/* ========================================
   智源数科 - 交互脚本
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 导航栏滚动效果
    // ========================================
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ========================================
    // 移动端汉堡菜单
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('open');

            // 阻止背景滚动
            if (navMenu.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // 点击菜单项后关闭
        navMenu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // 点击遮罩关闭
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('open') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // Hero 数字动画
    // ========================================
    function animateNumbers() {
        var statNumbers = document.querySelectorAll('.stat-number[data-target]');
        statNumbers.forEach(function(el) {
            var target = parseInt(el.getAttribute('data-target'));
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // easeOutExpo
                var eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                el.textContent = Math.floor(target * eased);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        });
    }

    // 使用 IntersectionObserver 触发数字动画
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        var statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(heroStats);
    }

    // ========================================
    // 解决方案 Tab 切换
    // ========================================
    var tabBtns = document.querySelectorAll('#solutionTabs .tab-btn');
    var tabPanels = document.querySelectorAll('.tabs-content .tab-panel');

    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetTab = this.getAttribute('data-tab');

            // 切换按钮状态
            tabBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            // 切换面板
            tabPanels.forEach(function(panel) {
                panel.classList.remove('active');
                if (panel.id === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // ========================================
    // 滚动动画 (AOS 简易实现)
    // ========================================
    var aosElements = document.querySelectorAll('[data-aos]');
    if (aosElements.length > 0) {
        var aosObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    var delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(function() {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    aosObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        aosElements.forEach(function(el) {
            aosObserver.observe(el);
        });
    }

    // ========================================
    // 平滑滚动（锚点导航）
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;

            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 能耗柱状图动画
    // ========================================
    var energyBars = document.querySelectorAll('.energy-bar');
    if (energyBars.length > 0) {
        var energyObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    energyBars.forEach(function(bar, i) {
                        setTimeout(function() {
                            bar.style.height = bar.style.getPropertyValue('--height');
                        }, i * 150);
                    });
                    energyObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // 先设为0高度
        energyBars.forEach(function(bar) {
            bar.style.height = '0%';
            var parent = bar.closest('.energy-chart');
            if (parent) energyObserver.observe(parent);
        });
    }

});
