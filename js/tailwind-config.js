(function () {
    try {
        if (typeof tailwind !== 'undefined') {
            tailwind.config = tailwind.config || {};
            tailwind.config.darkMode = 'class';
        }
    } catch (e) {
        /* CDN may load async; theming does not rely on this file */
    }
})();
