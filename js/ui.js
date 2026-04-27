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

    const scrollByPage = (direction) => {
        carousel.scrollBy({ left: direction * carousel.clientWidth, behavior: 'smooth' });
    };

    previous.addEventListener('click', () => scrollByPage(-1));
    next.addEventListener('click', () => scrollByPage(1));

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    carousel.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') return;
        isDragging = true;
        startX = event.clientX;
        startScrollLeft = carousel.scrollLeft;
        carousel.classList.add('is-dragging');
        carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        event.preventDefault();
        carousel.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    const stopDragging = () => {
        isDragging = false;
        carousel.classList.remove('is-dragging');
    };

    carousel.addEventListener('pointerup', stopDragging);
    carousel.addEventListener('pointercancel', stopDragging);
    carousel.addEventListener('mouseleave', stopDragging);
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

window.initScrollGlow = initScrollGlow;
window.initProgressBar = initProgressBar;
window.initSectionLinks = initSectionLinks;
window.initContactForm = initContactForm;
window.initProjectCarousel = initProjectCarousel;
window.initMobileMenu = initMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.toggleMobileMenu = toggleMobileMenu;
