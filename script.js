/* ============================================
   MAIN SCRIPT
   Modern Resume Website — All 6 Features
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCustomCursor();
    initCursorGlow();
    initMagneticButtons();
    initParticles();
    initNavigation();
    initRevealAnimations();
    initTypingEffect();
    initTerminal();
    initCountUp();
    initSmoothScroll();
    initLocalTime();
});

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
   2. CUSTOM CURSOR (Dot + Ring)
   ============================================ */
function initCustomCursor() {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .magnetic, .project-card, .skill-pill, .bento-pill, .bento-card, .contact-card, input, textarea');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hovering');
            ring.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hovering');
            ring.classList.remove('hovering');
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
            output: ['Passionate developer who loves building beautiful, performant web apps.']
        },
        {
            cmd: 'ls skills/',
            output: ['React  TypeScript  Node.js  Python  Docker  AWS  Next.js  GraphQL']
        },
        {
            cmd: 'whoami',
            output: ['A creative problem-solver & lifelong learner.']
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
        'Software Developer',
        'Problem Solver',
        'Creative Thinker',
        'Full Stack Engineer',
        'UI/UX Enthusiast'
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
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(start + (target - start) * eased);
                    
                    counter.textContent = current;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

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
