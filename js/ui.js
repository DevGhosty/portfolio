// ==================== SCROLL GLOW ====================
function initScrollGlow() {
    const headings = document.querySelectorAll('h2.accent-blue');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, { threshold: 0.6 });

    headings.forEach(heading => observer.observe(heading));
}

// ==================== PROGRESS BAR ====================
function initProgressBar() {
    const bar = document.createElement('div');
    bar.id = 'progress-bar';
    document.body.appendChild(bar);

    const update = () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = height > 0 ? `${(scrollTop / height) * 100}%` : '0%';
    };

    window.addEventListener('scroll', update);
    update();
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitButton = document.getElementById('form-submit');

    if (!form || !status || !submitButton) return;

    const showStatus = (message, stateClasses) => {
        status.textContent = message;
        status.className = `rounded-3xl border px-5 py-4 text-sm ${stateClasses}`;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        showStatus('Sending your message...', 'border-blue-500/40 text-blue-300');

        const formData = new FormData(form);

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error('Form submission failed.');
            }

            form.reset();
            showStatus('Message sent. Thanks for reaching out.', 'border-emerald-500/40 text-emerald-300');
        } catch (error) {
            showStatus('Message failed to send. Please try again in a moment.', 'border-red-500/40 text-red-300');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    console.log('Mobile menu toggled - add the menu markup next.');
}

window.initScrollGlow = initScrollGlow;
window.initProgressBar = initProgressBar;
window.initContactForm = initContactForm;
window.toggleMobileMenu = toggleMobileMenu;
