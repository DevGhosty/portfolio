// ==================== INIT ====================
function init() {
    startBackground();
    window.addEventListener('resize', startBackground);

    initScrollGlow();
    initProgressBar();
    initTheme();
    initContactForm();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
