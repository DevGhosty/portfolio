const BRAND_INTRO_STORAGE = 'portfolioIntroDone';

function ensureNavBrandChars(anchor) {
    if (anchor.querySelector('.nav-brand-char')) {
        anchor.querySelectorAll('.nav-brand-char').forEach((span, i) => {
            span.style.setProperty('--nb-i', String(i));
        });
        return;
    }
    const raw = anchor.textContent.trim();
    const chars = raw.length ? Array.from(raw) : Array.from('Hello There.');
    anchor.textContent = '';
    chars.forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'nav-brand-char';
        if (ch === '.') span.classList.add('text-blue-400');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.setProperty('--nb-i', String(i));
        anchor.appendChild(span);
    });
}

// ==================== BRAND INTRO (rain → nav, one per session) ====================
function initBrandIntro() {
    const root = document.documentElement;
    if (!root.classList.contains('brand-intro-active')) return;

    const navBrand = document.getElementById('nav-brand');
    if (!navBrand) {
        root.classList.remove('brand-intro-active');
        try {
            sessionStorage.setItem(BRAND_INTRO_STORAGE, '1');
        } catch (e) {
            /* noop */
        }
        return;
    }

    ensureNavBrandChars(navBrand);

    const overlay = document.createElement('div');
    overlay.id = 'brand-intro-overlay';
    overlay.className = 'brand-intro-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = 'brand-intro-backdrop';
    overlay.appendChild(backdrop);

    const cluster = document.createElement('div');
    cluster.id = 'brand-intro-cluster';
    cluster.className =
        'brand-intro-cluster font-display font-bold tracking-tighter accent-blue';

    const line = 'Hello There.';
    Array.from(line).forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'brand-intro-char';
        if (ch === '.') span.classList.add('text-blue-400');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.setProperty('--bi-i', String(i));
        span.style.setProperty('--bi-x', i % 2 === 0 ? '-18vw' : '18vw');
        span.style.setProperty('--bi-r-from', i % 2 === 0 ? '-5deg' : '5deg');
        cluster.appendChild(span);
    });

    overlay.appendChild(cluster);
    document.body.appendChild(overlay);

    let finished = false;
    const finish = () => {
        if (finished) return;
        finished = true;
        overlay.remove();
        root.classList.remove('brand-intro-active', 'brand-intro-nav-reveal');
        try {
            sessionStorage.setItem(BRAND_INTRO_STORAGE, '1');
        } catch (e) {
            /* noop */
        }
    };

    const runExit = () => {
        const clusterEl = document.getElementById('brand-intro-cluster');
        if (!clusterEl || !navBrand) {
            finish();
            return;
        }

        const clusterChars = clusterEl.querySelectorAll('.brand-intro-char');
        const navChars = navBrand.querySelectorAll('.nav-brand-char');

        const applyPerCharRainHome =
            clusterChars.length === navChars.length && clusterChars.length > 0;

        if (!applyPerCharRainHome) {
            clusterEl.style.transformOrigin = 'center center';
            clusterEl.style.willChange = 'transform, opacity';
            clusterEl.style.transition =
                'transform 1.25s cubic-bezier(0.25, 0.88, 0.32, 1), opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.62s';
            const cr = clusterEl.getBoundingClientRect();
            const nr = navBrand.getBoundingClientRect();
            const cx = cr.left + cr.width / 2;
            const cy = cr.top + cr.height / 2;
            const nx = nr.left + nr.width / 2;
            const ny = nr.top + nr.height / 2;
            const dx = nx - cx;
            const dy = ny - cy;
            const scale = Math.min(nr.width / cr.width, nr.height / cr.height);
            root.classList.add('brand-intro-nav-reveal');
            overlay.classList.add('brand-intro--exit');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    clusterEl.style.transform =
                        `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
                    clusterEl.style.opacity = '0';
                });
            });
            const onTransformEnd = (e) => {
                if (e.target !== clusterEl || e.propertyName !== 'transform') return;
                clusterEl.removeEventListener('transitionend', onTransformEnd);
                window.setTimeout(finish, 550);
            };
            clusterEl.addEventListener('transitionend', onTransformEnd);
            window.setTimeout(finish, 2800);
            return;
        }

        clusterEl.style.transform = '';
        clusterEl.style.opacity = '';
        clusterEl.style.transition = '';
        clusterEl.style.willChange = '';

        /* Matches css “hidden” state: translate3d(-0.24em, 0.07em) on .nav-brand-char */
        const navFs = parseFloat(window.getComputedStyle(navBrand).fontSize) || 16;
        const navSlotTx = 0.24 * navFs;
        const navSlotTy = -0.07 * navFs;

        clusterChars.forEach((charEl, i) => {
            const cr = charEl.getBoundingClientRect();
            const nr = navChars[i].getBoundingClientRect();
            const cx = cr.left + cr.width / 2;
            const cy = cr.top + cr.height / 2;
            const nx = nr.left + nr.width / 2 + navSlotTx;
            const ny = nr.top + nr.height / 2 + navSlotTy;
            const dx = nx - cx;
            const dy = ny - cy;
            const scale = Math.min(nr.width / cr.width, nr.height / cr.height);
            const kickX = i % 2 === 0 ? -18 : 18;
            const kickY = -12 - (i % 3) * 5;
            const r0 = i % 2 === 0 ? '-8deg' : '8deg';

            charEl.style.setProperty('--fly-dx', `${dx}px`);
            charEl.style.setProperty('--fly-dy', `${dy}px`);
            charEl.style.setProperty('--fly-s', String(scale));
            charEl.style.setProperty('--fly-mx', `${kickX}px`);
            charEl.style.setProperty('--fly-my', `${kickY}px`);
            charEl.style.setProperty('--fly-r0', r0);
        });

        root.classList.add('brand-intro-nav-reveal');
        overlay.classList.add('brand-intro--exit');

        const lastChar = clusterChars[clusterChars.length - 1];
        const onLastFlyEnd = (e) => {
            if (e.target !== lastChar || e.animationName !== 'brandIntroCharRainHome') {
                return;
            }
            lastChar.removeEventListener('animationend', onLastFlyEnd);
            window.setTimeout(finish, 350);
        };
        lastChar.addEventListener('animationend', onLastFlyEnd);
        window.setTimeout(finish, 3400);
    };

    let sequenceStarted = false;
    const scheduleStart = () => {
        if (sequenceStarted) return;
        sequenceStarted = true;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('brand-intro--rain');
                const n = line.length;
                const rainEndMs = 900 + (n - 1) * 45;
                window.setTimeout(() => {
                    window.setTimeout(runExit, 550);
                }, rainEndMs);
            });
        });
    };

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(scheduleStart, scheduleStart);
    } else {
        scheduleStart();
    }
    window.setTimeout(scheduleStart, 2000);
}

// ==================== SCROLL REVEAL ====================
function initRevealSections() {
    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => {
        section.querySelectorAll('.reveal-item').forEach((el, i) => {
            el.style.setProperty('--reveal-stagger', `${Math.min(i, 16) * 50}ms`);
        });
    });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
        sections.forEach(section => section.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    sections.forEach(section => observer.observe(section));
}

// ==================== NAV: COMPACT ON SCROLL ====================
function initNavScrollState() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('is-compact', window.scrollY > 40);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

// ==================== NAV: ACTIVE SECTION ====================
/** IntersectionObserver drives updates; marker uses nav height (scroll-spy style). */
function initNavActiveSections() {
    const links = [...document.querySelectorAll('.nav-section-link[href^="#"]')];
    const sectionIds = ['about', 'skills', 'projects', 'contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const nav = document.getElementById('site-nav');

    if (!links.length || !sections.length) return;

    const markerLine = () => (nav ? nav.getBoundingClientRect().bottom : 72) + 12;

    const applyActiveFromLayout = () => {
        if (window.scrollY < 24) {
            links.forEach(link => {
                link.classList.remove('nav-active');
                link.removeAttribute('aria-current');
            });
            return;
        }

        const line = markerLine();
        let current = null;
        for (const section of sections) {
            const top = section.getBoundingClientRect().top;
            if (top <= line) current = section.id;
        }

        links.forEach(link => {
            const href = link.getAttribute('href');
            const on = Boolean(current) && href === `#${current}`;
            link.classList.toggle('nav-active', on);
            if (on) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    };

    const thresholds = [0, 0.04, 0.08, 0.12, 0.16, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
    const sectionObserver = new IntersectionObserver(applyActiveFromLayout, {
        root: null,
        rootMargin: '0px',
        threshold: thresholds
    });

    sections.forEach(section => sectionObserver.observe(section));

    applyActiveFromLayout();

    let resizeRaf = 0;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(applyActiveFromLayout);
    });

    if (nav && typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => applyActiveFromLayout());
        ro.observe(nav);
    }
}

// ==================== HERO PLATE PARALLAX ====================
function initHeroPlateParallax() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hero = document.getElementById('hero');
    const plate = document.getElementById('hero-plate');
    if (reduced || !hero || !plate) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;

    const apply = () => {
        rafId = 0;
        plate.style.setProperty('--tilt-x', `${targetX}px`);
        plate.style.setProperty('--tilt-y', `${targetY}px`);
    };

    hero.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch') return;
        const rect = hero.getBoundingClientRect();
        const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        targetX = nx * 10;
        targetY = ny * 8;
        if (!rafId) rafId = requestAnimationFrame(apply);
    });

    hero.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(apply);
    });
}

// ==================== SCROLL GLOW ====================
function initScrollGlow() {
    const headings = document.querySelectorAll('h2.accent-blue');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, { threshold: 0.6 });

    headings.forEach(heading => observer.observe(heading));
}

// ==================== PROGRESS BAR ====================
function initProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'progress-bar';
    document.body.appendChild(bar);

    const update = () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = height > 0 ? `${(scrollTop / height) * 100}%` : '0%';
    };

    window.addEventListener('scroll', update);
    update();
}

// ==================== SECTION LINKS ====================
function initSectionLinks() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = targetId ? document.querySelector(targetId) : null;
            if (!target) return;

            event.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        });
    });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitButton = document.getElementById('form-submit');

    if (!form || !status || !submitButton) return;

    const showStatus = (message, stateClasses) => {
        status.textContent = message;
        status.className = `rounded-3xl border px-5 py-4 text-sm ${stateClasses}`;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        showStatus('Sending your message...', 'border-blue-500/40 text-blue-300');

        const formData = new FormData(form);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error('Form submission failed.');
            }

            form.reset();
            showStatus('Message sent. Thanks for reaching out.', 'border-emerald-500/40 text-emerald-300');
        } catch (error) {
            showStatus('Message failed to send. Please try again in a moment.', 'border-red-500/40 text-red-300');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// ==================== PROJECT CAROUSEL ====================
function initProjectCarousel() {
    const carousel = document.getElementById('project-carousel');
    const previous = document.querySelector('[data-project-prev]');
    const next = document.querySelector('[data-project-next]');

    if (!carousel || !previous || !next) return;

    const scrollStep = () => {
        const card = carousel.querySelector('.project-card');
        if (!card) return carousel.clientWidth;
        const gapRaw = getComputedStyle(carousel).gap || getComputedStyle(carousel).columnGap;
        const gap = Number.parseFloat(gapRaw) || 0;
        return card.getBoundingClientRect().width + gap;
    };

    const scrollByPage = (direction) => {
        carousel.scrollBy({ left: direction * scrollStep(), behavior: 'smooth' });
    };

    previous.addEventListener('click', (e) => {
        e.preventDefault();
        scrollByPage(-1);
    });
    next.addEventListener('click', (e) => {
        e.preventDefault();
        scrollByPage(1);
    });

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    carousel.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        isDragging = true;
        startX = event.clientX;
        startScrollLeft = carousel.scrollLeft;
        carousel.classList.add('is-dragging');
        try {
            carousel.setPointerCapture(event.pointerId);
        } catch (e) {
            /* ignore: some targets reject capture */
        }
    });

    carousel.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        event.preventDefault();
        carousel.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    const stopDragging = (event) => {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('is-dragging');
        if (event && typeof event.pointerId === 'number') {
            try {
                carousel.releasePointerCapture(event.pointerId);
            } catch (e) {
                /* noop */
            }
        }
    };

    carousel.addEventListener('pointerup', stopDragging);
    carousel.addEventListener('pointercancel', stopDragging);
    carousel.addEventListener('pointerleave', stopDragging);
}

// ==================== MOBILE MENU ====================
function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');

    if (!menu || !button) return;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    button.setAttribute('aria-expanded', 'false');
    menu.querySelectorAll('a').forEach(link => link.setAttribute('tabindex', '-1'));
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');

    if (!menu || !button) return;

    const isOpen = menu.classList.contains('is-open');
    menu.classList.toggle('is-open', !isOpen);
    menu.setAttribute('aria-hidden', String(isOpen));
    button.setAttribute('aria-expanded', String(!isOpen));
    menu.querySelectorAll('a').forEach(link => {
        if (isOpen) {
            link.setAttribute('tabindex', '-1');
        } else {
            link.removeAttribute('tabindex');
        }
    });
}

function initMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    if (!button) return;

    button.addEventListener('click', toggleMobileMenu);
}

window.initBrandIntro = initBrandIntro;
window.initRevealSections = initRevealSections;
window.initNavScrollState = initNavScrollState;
window.initNavActiveSections = initNavActiveSections;
window.initHeroPlateParallax = initHeroPlateParallax;
window.initScrollGlow = initScrollGlow;
window.initProgressBar = initProgressBar;
window.initSectionLinks = initSectionLinks;
window.initContactForm = initContactForm;
window.initProjectCarousel = initProjectCarousel;
window.initMobileMenu = initMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileMenu = toggleMobileMenu;
