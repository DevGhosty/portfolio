// ==================== PARTICLE BACKGROUND SYSTEM ====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d', { alpha: true });

let particles = [];
let width = 0;
let height = 0;
let animationFrameId = null;

function isDarkTheme() {
    return document.documentElement.classList.contains('dark');
}

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
        ctx.fillStyle = isDarkTheme()
            ? `rgba(96, 165, 250, ${alpha})`
            : `rgba(148, 163, 184, ${alpha * 0.45})`;
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
    ctx.strokeStyle = isDarkTheme()
        ? 'rgba(96, 165, 250, 0.08)'
        : 'rgba(59, 130, 246, 0.16)';
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
    ctx.fillStyle = isDarkTheme() ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(particle => { particle.update(); particle.draw(); });
    drawConnections();

    animationFrameId = requestAnimationFrame(animate);
}

function startBackground() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    initParticles();
    animate();
}

window.startBackground = startBackground;
