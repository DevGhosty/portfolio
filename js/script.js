// ==================== PARTICLE BACKGROUND SYSTEM ====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let particles = [];
let width = 0;
let height = 0;
let animationFrameId = null;

class Particle {
    constructor() { this.reset(); }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
        const alpha = this.opacity;
        ctx.fillStyle = document.documentElement.classList.contains('light')
            ? `rgba(59, 130, 246, ${alpha})`
            : `rgba(96, 165, 250, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 8000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();

    animationFrameId = requestAnimationFrame(animate);
}

function startBackground() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    initParticles();
    animate();
}

// ==================== SCROLL GLOW ====================
function initScrollGlow() {
    const headings = document.querySelectorAll('h2.accent-blue');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting);
        });
    }, { threshold: 0.6 });

    headings.forEach(h => observer.observe(h));
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

// ==================== THEME TOGGLE ====================
function initTheme() {
    const toggle = document.getElementById('theme-toggle');

    const getPreferred = () => localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    const setTheme = (theme) => {
        document.documentElement.classList.toggle('light', theme === 'light');
        localStorage.setItem('theme', theme);
    };

    setTheme(getPreferred());

    toggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.contains('light');
        setTheme(isLight ? 'dark' : 'light');
    });
}

// ==================== INIT ====================
function init() {
    startBackground();
    window.addEventListener('resize', startBackground);

    initScrollGlow();
    initProgressBar();
    initTheme();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}