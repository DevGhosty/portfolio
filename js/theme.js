// ==================== THEME TOGGLE ====================
function applyDocumentTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    const root = document.documentElement;
    root.dataset.theme = next;
    root.classList.toggle('dark', next === 'dark');
    root.classList.remove('light');
    root.style.colorScheme = next === 'dark' ? 'dark' : 'light';
    localStorage.setItem('theme', next);

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        root.classList.remove('theme-transitioning');
        void root.offsetWidth;
        root.classList.add('theme-transitioning');
        window.setTimeout(() => root.classList.remove('theme-transitioning'), 230);
    }
}

function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle || toggle.dataset.themeBound === '1') return;
    toggle.dataset.themeBound = '1';

    const getPreferred = () => {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    applyDocumentTheme(getPreferred());

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.dataset.theme === 'dark';
        applyDocumentTheme(isDark ? 'light' : 'dark');
    });
}

window.applyDocumentTheme = applyDocumentTheme;
window.initTheme = initTheme;
