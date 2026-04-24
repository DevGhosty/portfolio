// ==================== PARTICLE BACKGROUND SYSTEM ====================
// Best practices: Encapsulated, performant, well-commented for juniors.
// Uses requestAnimationFrame, minimal DOM reads, object pooling pattern.

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let particles = [];
let width = 0;
let height = 0;
let animationFrameId = null;

class Particle {
    constructor() {
        this.reset();
    }

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

        // Simple bounce (edge handling)
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
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
    // Performance-tuned density (8000px per particle ≈ good balance)
    const count = Math.floor((width * height) / 8000);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.08)';
    ctx.lineWidth = 0.5;

    // O(n²) but limited by low particle count — acceptable for background
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    // Fade trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);

    for (const p of particles) {
        p.update();
        p.draw();
    }

    drawConnections();

    animationFrameId = requestAnimationFrame(animate);
}

function startBackground() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    initParticles();
    animate();
}

// ==================== MOBILE MENU (placeholder) ====================
function toggleMobileMenu() {
    // TODO: Replace alert with real drawer/slide-in menu using Tailwind + JS
    alert("Mobile menu coming soon — let me know if you want it expanded!");
}

// ==================== INITIALIZATION & CLEANUP ====================
function init() {
    startBackground();

    // Resize handler
    window.addEventListener('resize', () => {
        startBackground();
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}