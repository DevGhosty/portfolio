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
    initHeroPlateSectionSignal();
    initScrollGlow();
    initProgressBar();
    initSectionLinks();
    initContactForm();
    initProjectCarousel();
    initParticleSectionMood();
    initMobileMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
