// ==================== INIT ====================
function init() {
    initTheme();
    initBrandIntro();
    startBackground();
    window.addEventListener('resize', startBackground);

    initRevealSections();
    initNavScrollState();
    initNavActiveSections();
    initHeroPlateParallax();
    initScrollGlow();
    initProgressBar();
    initSectionLinks();
    initContactForm();
    initProjectCarousel();
    initMobileMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
