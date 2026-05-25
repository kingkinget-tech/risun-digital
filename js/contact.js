/* 联系我们页面样式已在 about.css 中定义（contact 相关部分） */
/* 此文件保留用于未来扩展 */

/* ========================================
   联系页交互脚本
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // FAQ 折叠面板
    // ========================================
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // 关闭其他已打开的项
            faqItems.forEach(function(other) {
                if (other !== item) other.classList.remove('active');
            });
            // 切换当前项
            item.classList.toggle('active');
        });
    });

    // ========================================
    // 表单提交处理
    // ========================================
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // 简单验证
            var name = document.getElementById('name').value.trim();
            var company = document.getElementById('company').value.trim();
            var phone = document.getElementById('phone').value.trim();

            if (!name || !company || !phone) {
                alert('请填写带 * 的必填项');
                return;
            }

            // 模拟提交成功
            var btn = form.querySelector('.form-submit-btn');
            btn.textContent = '✅ 提交成功！';
            btn.style.background = '#22C55E';
            btn.disabled = true;

            setTimeout(function() {
                alert('感谢您的咨询！我们的顾问将在24小时内与您联系。');
                form.reset();
                btn.textContent = '提交申请 →';
                btn.style.background = '';
                btn.disabled = false;
            }, 500);
        });
    }

});
