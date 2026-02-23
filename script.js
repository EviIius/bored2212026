/* ============================================
   MAIN SCRIPT
   Modern Resume Website — All 14 Features
   ============================================ */

// Preloader runs first, then inits everything else
initPreloader();

function initAfterLoad() {
    initThemeToggle();
    initCustomCursor();
    initCursorGlow();
    initMagneticButtons();
    initParticles();
    initNavigation();
    initRevealAnimations();
    initTypingEffect();
    initTerminal();
    initSmoothScroll();
    initLocalTime();
    initScrollProgress();
    initCommandPalette();
    initTiltCards();
    initTextScramble();
    initParallax();

    initResumeFab();
}

/* ============================================
   1. THEME TOGGLE (Dark ↔ Light)
   ============================================ */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    if (!toggle) return;

    // Load saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
        html.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        // Re-init particles for new color
        if (window._particleCleanup) window._particleCleanup();
        initParticles();
    });
}

/* ============================================
   2. CUSTOM CURSOR — Crosshair
   ============================================ */
function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.getElementById('cursorCrosshair');
    const label = document.getElementById('crosshairLabel');
    const canvas = document.getElementById('cursorTrail');
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;
    let angle = 0, targetAngle = 0;
    let prevX = 0, prevY = 0;
    let speed = 0;

    // --- Trail ---
    let ctx = null;
    const trail = [];
    const trailLength = 18;
    if (canvas) {
        ctx = canvas.getContext('2d');
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate movement angle
        const dx = mouseX - prevX;
        const dy = mouseY - prevY;
        speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > 2) {
            targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        }
        prevX = mouseX;
        prevY = mouseY;

        // Push trail point
        if (ctx) {
            trail.push({ x: mouseX, y: mouseY, life: 1 });
            if (trail.length > trailLength) trail.shift();
        }
    });

    // Click feedback
    document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
    document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

    function animate() {
        // Smooth follow
        curX += (mouseX - curX) * 0.25;
        curY += (mouseY - curY) * 0.25;

        // Smooth angle interpolation
        let angleDiff = targetAngle - angle;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        angle += angleDiff * 0.12;

        cursor.style.transform = `translate(${curX}px, ${curY}px) rotate(${angle}deg)`;

        // Draw trail
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (trail.length > 1) {
                ctx.beginPath();
                ctx.moveTo(trail[0].x, trail[0].y);
                for (let i = 1; i < trail.length; i++) {
                    trail[i].life -= 0.035;
                    if (trail[i].life <= 0) { trail.splice(i, 1); i--; continue; }
                    ctx.lineTo(trail[i].x, trail[i].y);
                }
                ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)';
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.stroke();
            }
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Context labels
    function getCursorLabel(el) {
        if (el.closest('a[href^="mailto:"]')) return 'email';
        if (el.closest('a[href^="tel:"]')) return 'call';
        if (el.closest('a[target="_blank"]')) return 'open';
        if (el.closest('.project-card')) return 'view';
        if (el.closest('.bento-card')) return '';
        if (el.closest('.contact-card')) return 'connect';
        if (el.closest('.btn')) return 'go';
        if (el.closest('a')) return 'go';
        if (el.closest('button')) return '';
        return '';
    }

    // Hover states
    const hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic, .project-card, .skill-pill, .bento-pill, .bento-card, .contact-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovering');
            if (label) label.textContent = getCursorLabel(el);
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovering');
            if (label) label.textContent = '';
        });
    });
}

/* ============================================
   CURSOR GLOW EFFECT (Linear-inspired)
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

/* ============================================
   3. MAGNETIC BUTTONS
   ============================================ */
function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;

    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => { el.style.transition = ''; }, 500);
        });
    });
}

/* ============================================
   4. PARTICLE CONSTELLATION (Canvas)
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Get particle color from CSS variable
    function getColor(alpha) {
        const style = getComputedStyle(document.documentElement);
        const rgb = style.getPropertyValue('--particle-color').trim();
        return `rgba(${rgb}, ${alpha})`;
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse attraction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x += dx * 0.005;
                this.y += dy * 0.005;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = getColor(0.6);
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = getColor(0.12 * (1 - dist / 140));
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse to particle lines
    function drawMouseLines() {
        if (mouse.x === -9999) return;
        particles.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = getColor(0.2 * (1 - dist / 200));
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        drawMouseLines();
        animId = requestAnimationFrame(animate);
    }
    animate();

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Cleanup for theme toggle re-init
    window._particleCleanup = () => {
        cancelAnimationFrame(animId);
        particles = [];
    };
}

/* ============================================
   5. INTERACTIVE TERMINAL
   ============================================ */
function initTerminal() {
    const body = document.getElementById('terminalBody');
    const cmd = document.getElementById('terminalCmd');
    const blink = body ? body.querySelector('.terminal-blink') : null;
    if (!body || !cmd) return;

    const commands = [
        {
            cmd: 'cat about.me',
            output: ['Data Analyst at Wells Fargo. M.S. Data Science from UNC Charlotte.']
        },
        {
            cmd: 'ls skills/',
            output: ['Python  SQL  R  Tableau  PowerBI  JavaScript  ML  Snowflake']
        },
        {
            cmd: 'whoami',
            output: ['Jake Brulato \u2014 turning data into stories that matter.']
        },
        {
            cmd: 'cat status.txt',
            output: ['Status: Open to exciting opportunities ✨']
        }
    ];

    let cmdIdx = 0;

    async function sleep(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function typeCommand(text) {
        cmd.textContent = '';
        for (let i = 0; i < text.length; i++) {
            cmd.textContent += text[i];
            await sleep(50 + Math.random() * 40);
        }
    }

    async function showOutput(lines) {
        for (const line of lines) {
            const div = document.createElement('div');
            div.className = 'terminal-line output';
            div.textContent = line;
            body.appendChild(div);
            await sleep(200);
        }
    }

    async function runSequence() {
        await sleep(1500); // Initial pause

        while (true) {
            const entry = commands[cmdIdx % commands.length];
            
            // Type command
            if (blink) blink.style.display = 'inline';
            await typeCommand(entry.cmd);
            await sleep(600);
            if (blink) blink.style.display = 'none';

            // Show output
            await showOutput(entry.output);
            await sleep(2000);

            // Clear for next command
            cmd.textContent = '';
            // Remove output lines
            const outputs = body.querySelectorAll('.terminal-line.output');
            outputs.forEach(o => o.remove());

            cmdIdx++;
        }
    }

    runSequence();
}

/* ============================================
   6. LOCAL TIME CLOCK
   ============================================ */
function initLocalTime() {
    const el = document.getElementById('localTime');
    if (!el) return;

    function update() {
        const now = new Date();
        el.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }
    update();
    setInterval(update, 1000);
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll effect - glassmorphism on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // Mobile menu toggle
    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/* ============================================
   REVEAL ON SCROLL (Intersection Observer)
   ============================================ */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const element = document.getElementById('typedText');
    if (!element) return;

    const words = [
        'Data Analyst',
        'Machine Learning Enthusiast',
        'Problem Solver',
        'Python Developer',
        'Visualization Nerd'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentWord = '';

    function type() {
        const word = words[wordIndex];

        if (isDeleting) {
            currentWord = word.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentWord = word.substring(0, charIndex + 1);
            charIndex++;
        }

        element.textContent = currentWord;

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === word.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after a slight delay
    setTimeout(type, 1000);
}

/* ============================================
   COUNT UP ANIMATION
   ============================================ */


/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   CINEMATIC PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progress = document.getElementById('preloaderProgress');
    const percent = document.getElementById('preloaderPercent');
    if (!preloader) return;

    let loaded = 0;
    const target = 100;

    function tick() {
        // Accelerating progress simulation
        const remaining = target - loaded;
        const increment = Math.max(0.5, remaining * 0.08);
        loaded = Math.min(target, loaded + increment);
        
        if (progress) progress.style.width = loaded + '%';
        if (percent) percent.textContent = Math.round(loaded) + '%';

        if (loaded < 99.5) {
            requestAnimationFrame(tick);
        } else {
            // Complete
            if (progress) progress.style.width = '100%';
            if (percent) percent.textContent = '100%';
            
            setTimeout(() => {
                preloader.classList.add('done');
                document.body.style.overflow = '';
                initAfterLoad();
            }, 400);
        }
    }

    // Lock scroll during preload
    document.body.style.overflow = 'hidden';
    
    // Start after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tick, 300);
        });
    } else {
        setTimeout(tick, 300);
    }
}

/* ============================================
   SCROLL PROGRESS BAR
   ============================================ */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    function update() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================
   COMMAND PALETTE (Ctrl+K)
   ============================================ */
function initCommandPalette() {
    const overlay = document.getElementById('cmdPaletteOverlay');
    const input = document.getElementById('cmdPaletteInput');
    const body = document.getElementById('cmdPaletteBody');
    const trigger = document.getElementById('cmdTrigger');
    if (!overlay) return;

    let activeIndex = -1;

    function open() {
        overlay.classList.add('active');
        if (input) {
            input.value = '';
            input.focus();
        }
        filterItems('');
        activeIndex = -1;
    }

    function close() {
        overlay.classList.remove('active');
        activeIndex = -1;
    }

    function getVisibleItems() {
        return Array.from(overlay.querySelectorAll('.cmd-palette-item:not(.hidden)'));
    }

    function setActive(index) {
        const items = getVisibleItems();
        items.forEach(i => i.classList.remove('active'));
        if (index >= 0 && index < items.length) {
            activeIndex = index;
            items[index].classList.add('active');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    function filterItems(query) {
        const items = overlay.querySelectorAll('.cmd-palette-item');
        const q = query.toLowerCase().trim();
        items.forEach(item => {
            const text = item.querySelector('span').textContent.toLowerCase();
            item.classList.toggle('hidden', q.length > 0 && !text.includes(q));
        });

        // Hide empty groups
        overlay.querySelectorAll('.cmd-palette-group').forEach(group => {
            const visibleInGroup = group.querySelectorAll('.cmd-palette-item:not(.hidden)');
            group.style.display = visibleInGroup.length === 0 ? 'none' : '';
        });
    }

    function executeItem(item) {
        const action = item.dataset.action;
        close();

        if (action === 'navigate') {
            const target = document.querySelector(item.dataset.target);
            if (target) {
                const offset = 80;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - offset,
                    behavior: 'smooth'
                });
            }
        } else if (action === 'theme') {
            document.getElementById('themeToggle')?.click();
        } else if (action === 'download') {
            document.getElementById('resumeFab')?.click();
        } else if (action === 'email') {
            window.location.href = 'mailto:jakebrulato@gmail.com';
        }
    }

    // Keyboard shortcut: Ctrl+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('active') ? close() : open();
        }
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            close();
        }
    });

    // Input filtering
    if (input) {
        input.addEventListener('input', () => {
            filterItems(input.value);
            activeIndex = -1;
        });

        input.addEventListener('keydown', (e) => {
            const items = getVisibleItems();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(Math.min(activeIndex + 1, items.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(Math.max(activeIndex - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeIndex >= 0 && items[activeIndex]) {
                    executeItem(items[activeIndex]);
                }
            }
        });
    }

    // Click on items
    overlay.querySelectorAll('.cmd-palette-item').forEach(item => {
        item.addEventListener('click', () => executeItem(item));
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });

    // Trigger button
    if (trigger) {
        trigger.addEventListener('click', open);
    }
}

/* ============================================
   3D TILT CARDS + SPOTLIGHT GLOW (Stripe)
   ============================================ */
function initTiltCards() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        // Create spotlight element
        const spotlight = document.createElement('div');
        spotlight.className = 'tilt-spotlight';
        card.appendChild(spotlight);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            spotlight.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(var(--particle-color), 0.15) 0%, transparent 60%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s var(--ease-out)';
            spotlight.style.background = 'transparent';
            setTimeout(() => { card.style.transition = ''; }, 500);
        });
    });
}

/* ============================================
   TEXT SCRAMBLE EFFECT
   ============================================ */
function initTextScramble() {
    const chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const targets = document.querySelectorAll('.section-title');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrambled) {
                entry.target.dataset.scrambled = 'true';
                scrambleElement(entry.target);
            }
        });
    }, { threshold: 0.3 });

    targets.forEach(el => observer.observe(el));

    function scrambleElement(el) {
        // Get all text nodes (skip gradient-text spans — we want those too)
        const textNodes = [];
        function walk(node) {
            if (node.nodeType === 3 && node.textContent.trim()) {
                textNodes.push(node);
            } else if (node.childNodes) {
                node.childNodes.forEach(walk);
            }
        }
        walk(el);

        textNodes.forEach(node => {
            const original = node.textContent;
            const parent = node.parentNode;
            
            // Replace text node with span-wrapped characters
            const wrapper = document.createElement('span');
            wrapper.className = 'scramble-text';
            
            for (let i = 0; i < original.length; i++) {
                const span = document.createElement('span');
                span.className = 'scramble-char';
                span.dataset.final = original[i];
                if (original[i] === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                    span.classList.add('scrambling');
                }
                wrapper.appendChild(span);
            }
            
            parent.replaceChild(wrapper, node);

            // Animate each character with stagger
            const charSpans = wrapper.querySelectorAll('.scramble-char');
            charSpans.forEach((span, i) => {
                if (span.dataset.final === ' ') return;
                
                let iterations = 0;
                const maxIterations = 3 + Math.floor(Math.random() * 4);
                const delay = i * 30;

                setTimeout(() => {
                    const interval = setInterval(() => {
                        if (iterations >= maxIterations) {
                            span.textContent = span.dataset.final;
                            span.classList.remove('scrambling');
                            clearInterval(interval);
                            return;
                        }
                        span.textContent = chars[Math.floor(Math.random() * chars.length)];
                        iterations++;
                    }, 50);
                }, delay);
            });
        });
    }
}

/* ============================================
   PARALLAX DEPTH LAYERS
   ============================================ */
function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    const grid = document.querySelector('.grid-overlay');
    const hero = document.querySelector('.hero');
    if (!hero) return;

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrollY < heroHeight * 1.5) {
            // Parallax orbs at different speeds
            orbs.forEach((orb, i) => {
                const speed = 0.1 + (i * 0.05);
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });

            // Grid moves slowest
            if (grid) {
                grid.style.transform = `translateY(${scrollY * 0.03}px)`;
            }
        }
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
}



/* ============================================
   DOWNLOAD RESUME FAB
   ============================================ */
function initResumeFab() {
    const fab = document.getElementById('resumeFab');
    if (!fab) return;

    function update() {
        if (window.scrollY > 400) {
            fab.classList.add('visible');
        } else {
            fab.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
}
