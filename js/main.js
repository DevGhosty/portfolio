// ==================== INIT ====================
function init() {
    startBackground();
    window.addEventListener('resize', startBackground);

    initScrollGlow();
    initProgressBar();
    initSectionLinks();
    initTheme();
    initContactForm();
    initProjectCarousel();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
