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
    const darkTheme = isDarkTheme();
    const time = performance.now() * 0.0015;
    const maxDistSq = 120 * 120;

    for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const particleB = particles[j];
            const dx = particleA.x - particleB.x;
            const dy = particleA.y - particleB.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
                const showPulse = (i + j) % 3 === 0;

                ctx.strokeStyle = darkTheme
                    ? 'rgba(96, 165, 250, 0.1)'
                    : 'rgba(59, 130, 246, 0.16)';
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(particleA.x, particleA.y);
                ctx.lineTo(particleB.x, particleB.y);
                ctx.stroke();

                if (!showPulse) continue;

                const pulse = (Math.sin(time + i * 0.9 + j * 0.35) + 1) * 0.5;
                const travel = (time * 0.9 + i * 0.13 + j * 0.07) % 1;
                const startX = particleA.x + (particleB.x - particleA.x) * Math.max(0, travel - 0.18);
                const startY = particleA.y + (particleB.y - particleA.y) * Math.max(0, travel - 0.18);
                const endX = particleA.x + (particleB.x - particleA.x) * travel;
                const endY = particleA.y + (particleB.y - particleA.y) * travel;

                ctx.strokeStyle = darkTheme
                    ? `rgba(191, 219, 254, ${0.22 + pulse * 0.28})`
                    : `rgba(15, 23, 42, ${0.16 + pulse * 0.24})`;
                ctx.lineWidth = 0.9 + pulse * 0.45;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
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
