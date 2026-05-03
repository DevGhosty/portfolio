(function () {
    try {
        if (sessionStorage.getItem('portfolioIntroDone')) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            sessionStorage.setItem('portfolioIntroDone', '1');
            return;
        }
        document.documentElement.classList.add('brand-intro-active');
    } catch (e) {
        /* private mode / blocked storage */
    }
})();
