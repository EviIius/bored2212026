/* ===================================================================
   JAKE BRULATO PORTFOLIO — SMii7Y-Inspired Interactions
   Splash screen, scroll reveals, smooth navigation, marquee,
   mobile menu, resume FAB
   =================================================================== */

(function () {
    'use strict';

    // ==================== SPLASH SCREEN ====================
    function initSplash() {
        const splash = document.getElementById('splash');
        const skipBtn = document.getElementById('splashSkip');
        const progress = document.getElementById('splashProgress');
        const percent = document.getElementById('splashPercent');

        if (!splash) return;

        // Check cookie — skip splash if already seen
        if (document.cookie.includes('seenSplash=1')) {
            splash.remove();
            document.body.classList.remove('splash-active');
            initAfterSplash();
            return;
        }

        document.body.classList.add('splash-active');

        let current = 0;
        const duration = 3000; // 3 seconds
        const startTime = Date.now();

        function updateProgress() {
            const elapsed = Date.now() - startTime;
            current = Math.min((elapsed / duration) * 100, 100);

            if (progress) progress.style.width = current + '%';
            if (percent) percent.textContent = Math.round(current) + '%';

            if (current < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setTimeout(closeSplash, 400);
            }
        }

        function closeSplash() {
            splash.classList.add('hide');
            document.body.classList.remove('splash-active');

            // Set cookie for 1 day
            document.cookie = 'seenSplash=1; max-age=86400; path=/';

            setTimeout(() => {
                splash.remove();
            }, 800);

            initAfterSplash();
        }

        // Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', closeSplash);
        }

        // Start progress after letter animations finish (~1s)
        setTimeout(updateProgress, 1200);
    }

    // ==================== AFTER SPLASH — INIT EVERYTHING ====================
    let initialized = false;

    function initAfterSplash() {
        if (initialized) return;
        initialized = true;

        initNavigation();
        initMobileMenu();
        initScrollReveal();
        initSmoothScroll();
        initResumeFab();
        initActiveNav();
    }

    // ==================== NAVIGATION ====================
    function initNavigation() {
        const nav = document.getElementById('nav');
        if (!nav) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // ==================== MOBILE MENU ====================
    function initMobileMenu() {
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('mobileMenu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        const links = menu.querySelectorAll('.mobile-link');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ==================== SCROLL REVEAL ====================
    function initScrollReveal() {
        const elements = document.querySelectorAll('.fade-up');
        if (!elements.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ==================== SMOOTH SCROLL ====================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const navHeight = 72;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==================== ACTIVE NAV LINK ====================
    function initActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');
        if (!sections.length || !navLinks.length) return;

        window.addEventListener('scroll', function () {
            let current = '';
            const scrollY = window.scrollY;

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop - 120;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });
    }

    // ==================== RESUME FAB ====================
    function initResumeFab() {
        const fab = document.getElementById('resumeFab');
        if (!fab) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                fab.classList.add('visible');
            } else {
                fab.classList.remove('visible');
            }
        }, { passive: true });
    }

    // ==================== INIT ON DOM READY ====================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSplash);
    } else {
        initSplash();
    }

})();
