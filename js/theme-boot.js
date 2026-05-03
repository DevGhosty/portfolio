(function () {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') {
        t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    var r = document.documentElement;
    r.dataset.theme = t;
    r.classList.toggle('dark', t === 'dark');
    r.classList.remove('light');
    r.style.colorScheme = t === 'dark' ? 'dark' : 'light';
})();
