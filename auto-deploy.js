// Auto-deploy to Netlify Drop using Playwright
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SITE_DIR = __dirname;
const RESULT_FILE = path.join(SITE_DIR, 'DEPLOY-RESULT.txt');

async function deploy() {
    console.log('=== 旭阳数科网站 - 自动免费部署 ===\n');
    
    // Try Netlify Drop first (requires drag-drop, which Playwright can do via input)
    // Actually, let's try a simpler approach: use Netlify's CLI with a temp account
    // Or use the File Input on Netlify Drop page
    
    console.log('启动浏览器...\n');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Method: Use Netlify's unauthenticated site creation + deploy API
    // This won't work without token. Let me try another approach:
    // Use tiiny.host or similar free hosting with API
    
    // Actually, the most reliable automated approach is:
    // 1. Go to Netlify Drop page
    // 2. Use the file upload input element
    // 3. Upload files via setInputFiles
    
    console.log('正在打开 Netlify Drop...');
    
    try {
        await page.goto('https://app.netlify.com/drop', { timeout: 30000, waitUntil: 'domcontentloaded' });
        
        // Check if there's a file input for uploading
        const content = await page.content();
        
        // Look for file input
        const fileInputs = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input[type="file"]');
            return Array.from(inputs).map(el => ({
                id: el.id,
                name: el.name,
                className: el.className,
                accept: el.accept,
                multiple: el.multiple
            }));
        });
        
        console.log('找到文件上传元素:', JSON.stringify(fileInputs));
        
        if (fileInputs.length > 0) {
            // Upload all web files
            const webFiles = getAllWebFiles(SITE_DIR);
            console.log(`\n准备上传 ${webFiles.length} 个文件...`);
            
            // Use the first file input - but Netlify Drop uses directory upload
            // Let's try using the drop zone input
            const inputSelector = 'input[type="file"]';
            
            await page.setInputFiles(inputSelector, webFiles.map(f => f.path));
            
            console.log('文件已上传，等待处理...');
            
            // Wait for deployment URL to appear
            await page.waitForTimeout(15000);
            
            // Get the deployed URL
            const url = await page.evaluate(() => {
                // Netlify shows URL in various places after upload
                const links = document.querySelectorAll('a[href*=".netlify.app"]');
                if (links.length > 0) return links[0].href;
                const text = document.body.innerText;
                const match = text.match(/https?:\/\/[a-z0-9-]+\.netlify\.app/i);
                return match ? match[0] : null;
            });
            
            if (url) {
                console.log(`\n✅ 部署成功!`);
                console.log(`🌐 网址: ${url}`);
                saveResult(url);
            } else {
                console.log('\n等待部署URL...');
                await page.screenshot({ path: path.join(SITE_DIR, 'deploy-screenshot.png'), fullPage: true });
                console.log('截图已保存到 deploy-screenshot.png');
                
                // Try one more wait and check again
                await page.waitForTimeout(10000);
                const url2 = await page.evaluate(() => {
                    const text = document.body.innerText;
                    const match = text.match(/https?:\/\/[a-z0-9-]+\.netlify\.app/i);
                    return match ? `https://${match[1]}` : null;
                });
                
                if (url2) {
                    console.log(`✅ 部署成功! 🌐 ${url2}`);
                    saveResult(url2);
                } else {
                    throw new Error('无法获取部署URL');
                }
            }
        } else {
            // No file inputs found - might be a login wall or different UI
            console.log('\nNetlify Drop 可能需要登录，尝试备用方案...');
            
            // Take screenshot to see what's on the page
            await page.screenshot({ path: path.join(SITE_DIR, 'deploy-screenshot.png') });
            
            // Try GitHub Pages approach via raw.githubusercontent.com... no that won't work
            
            // Final fallback: provide clear instructions
            saveResult(null);
        }
    } catch(e) {
        console.error(`部署过程出错: ${e.message}`);
        
        // Try screenshot for debugging
        try { await page.screenshot({ path: path.join(SITE_DIR, 'deploy-screenshot.png') }); } catch(e2) {}
        
        saveResult(null);
    } finally {
        await browser.close();
    }
}

function getAllWebFiles(dir) {
    let results = [];
    const skip = ['.workbuddy', 'node_modules', '.git', 'deploy.js', 'deploy-now.js', 'deploy-final.js', 'vercel.json', 'DEPLOY-INFO.txt'];
    
    function walk(d) {
        const items = fs.readdirSync(d);
        for (const item of items) {
            if (skip.includes(item) || item.endsWith('.js') && item !== 'main.js' || item.startsWith('deploy')) continue;
            const fullPath = path.join(d, item);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else {
                results.push({
                    path: fullPath,
                    name: item
                });
            }
        }
    }
    walk(dir);
    return results;
}

function saveResult(url) {
    const tunnelUrl = 'https://all-dogs-wish.loca.lt';
    
    const result = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
${url ? '   🎉 旭阳数科网站 已成功上线！' : '   📡 旭阳数科网站 临时公网地址'}
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
${url ? `   🌐 永久网址: ${url}` : ''}
${!url ? `   🌐 公网地址: ${tunnelUrl}` : ''}
${!url ? '   ⚠️  临时地址（本机运行中可访问）' : ''}
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║   ❌ 取消发布方法：                                         ║
${url ? `   • 登录 https://app.netlify.com` : ''}
${url ? `   • 找到你的站点 → Site settings → General` : ''}
${url ? `   • 点击 "Delete this site"` : ''}
${url ? `   • 删除后域名立即失效，无任何费用` : ''}
${!url ? `   • 关闭本地服务器 = 地址立即失效（无需任何操作）` : ''}
║                                                          ║
╚══════════════════════════════════════════════════════════╝

时间: ${new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'})}
`;
    
    fs.writeFileSync(RESULT_FILE, result.trim());
    console.log(`\n${result}`);
}

deploy().catch(e => {
    console.error('Fatal error:', e.message);
    process.exit(1);
});
