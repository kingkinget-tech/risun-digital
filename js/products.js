/* ========================================
   产品页交互脚本
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 产品导航高亮（滚动时）
    // ========================================
    var productSections = document.querySelectorAll('.product-detail-section[id]');
    var pNavItems = document.querySelectorAll('#productNav .p-nav-item');

    if (productSections.length > 0 && pNavItems.length > 0) {
        // 导航点击滚动
        pNavItems.forEach(function(item) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                var targetId = this.getAttribute('href');
                var target = document.querySelector(targetId);
                if (target) {
                    var offsetTop = target.getBoundingClientRect().top + window.scrollY - 120;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            });
        });

        // 滚动监听，更新导航高亮
        function updateActiveNav() {
            var scrollY = window.scrollY;

            for (var i = productSections.length - 1; i >= 0; i--) {
                var section = productSections[i];
                var top = section.offsetTop - 150;
                if (scrollY >= top) {
                    var activeId = section.id;
                    pNavItems.forEach(function(navItem) {
                        navItem.classList.remove('active');
                        if (navItem.getAttribute('href') === '#' + activeId) {
                            navItem.classList.add('active');
                        }
                    });
                    break;
                }
            }
        }

        window.addEventListener('scroll', updateActiveNav, { passive: true });
        updateActiveNav();
    }

});
