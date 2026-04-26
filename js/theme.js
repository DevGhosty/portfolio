// ==================== THEME TOGGLE ====================
function initTheme() {
    const toggle = document.getElementById('theme-toggle');

    const getPreferred = () => localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const setTheme = (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.classList.toggle('light', theme === 'light');
        localStorage.setItem('theme', theme);
    };

    setTheme(getPreferred());

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    });
}

window.initTheme = initTheme;
