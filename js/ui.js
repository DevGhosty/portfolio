// ==================== SCROLL GLOW ====================
function initScrollGlow() {
    const headings = document.querySelectorAll('h2.accent-blue');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, { threshold: 0.6 });

    headings.forEach(h => observer.observe(h));
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

// ==================== MOBILE MENU (was missing) ====================
function toggleMobileMenu() {
    // TODO: Add mobile menu HTML when ready (simple dropdown or side nav)
    console.log('Mobile menu toggled — implement HTML markup next');
}

// Expose for main.js
window.initScrollGlow = initScrollGlow;
window.initProgressBar = initProgressBar;
window.toggleMobileMenu = toggleMobileMenu;