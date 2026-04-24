// ==================== THEME TOGGLE ====================
function initTheme() {
    const toggle = document.getElementById('theme-toggle');

    const getPreferred = () => localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const setTheme = (theme) => {
        // Native Tailwind dark mode — fully scalable forever
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    };

    setTheme(getPreferred());

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    });
}

// Expose for main.js
window.initTheme = initTheme;