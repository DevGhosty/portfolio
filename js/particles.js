// ==================== PARTICLE BACKGROUND SYSTEM ====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d', { alpha: true }) : null;

let particles = [];
let width = 0;
let height = 0;
let animationFrameId = null;

/** Section-scoped motion/connection intensity (from ui.js scroll spy) */
let particleMood = { speedMul: 1, lineMul: 1 };

window.setParticleMood = function setParticleMood(opts) {
    if (!opts || typeof opts !== 'object') return;
    particleMood = {
        speedMul: typeof opts.speedMul === 'number' ? opts.speedMul : 1,
        lineMul: typeof opts.lineMul === 'number' ? opts.lineMul : 1
    };
};

/** Short-lived bright sparks: respawn on new particles when ttl hits 0 */
let sparkStates = [];

function isDarkTheme() {
    const t = document.documentElement.dataset.theme;
    if (t === 'dark') return true;
    if (t === 'light') return false;
    return document.documentElement.classList.contains('dark');
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getScrollBlend() {
    const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollable <= 0) return 0.5;
    return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

/** Local-time blue palette: indigo night -> sky noon -> periwinkle dusk (stays in blue family) */
function skylineBlueRgb() {
    const d = new Date();
    const u = (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400;
    const stops = [
        { u: 0, rgb: [34, 74, 130] },
        { u: 0.22, rgb: [72, 120, 198] },
        { u: 0.45, rgb: [96, 165, 250] },
        { u: 0.62, rgb: [82, 155, 245] },
        { u: 0.78, rgb: [100, 130, 235] },
        { u: 1, rgb: [34, 74, 130] }
    ];
    let seg = stops.length - 2;
    for (let i = 0; i < stops.length - 1; i++) {
        if (u < stops[i + 1].u + 1e-6) {
            seg = i;
            break;
        }
    }
    const a = stops[seg];
    const b = stops[seg + 1];
    const span = Math.max(1e-6, b.u - a.u);
    const t = (u - a.u) / span;
    const lerp = (x, y) => Math.round(x + (y - x) * t);
    return {
        r: lerp(a.rgb[0], b.rgb[0]),
        g: lerp(a.rgb[1], b.rgb[1]),
        b: lerp(a.rgb[2], b.rgb[2])
    };
}

function initSparkStates(count) {
    sparkStates = [];
    const n = Math.min(6, Math.max(3, Math.floor(count / 14)));
    for (let k = 0; k < n; k++) {
        sparkStates.push({
            particleIndex: Math.floor(Math.random() * count),
            ttl: 0,
            maxTtl: 1
        });
    }
}

function tickSparks() {
    const n = particles.length;
    if (!n) return;
    for (const s of sparkStates) {
        s.ttl -= 1;
        if (s.ttl <= 0) {
            s.particleIndex = Math.floor(Math.random() * n);
            s.maxTtl = 48 + Math.random() * 100;
            s.ttl = s.maxTtl;
        }
    }
}

function sparkFadeByIndex() {
    const map = new Map();
    for (const s of sparkStates) {
        const f = s.ttl / s.maxTtl;
        const prev = map.get(s.particleIndex) || 0;
        if (f > prev) map.set(s.particleIndex, f);
    }
    return map;
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
        const m = particleMood.speedMul;
        this.x += this.speedX * m;
        this.y += this.speedY * m;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
    }

    draw(sky, isSpark, sparkFade) {
        const alpha = this.opacity * (isSpark ? 1.15 + 0.55 * sparkFade : 1);
        const size = this.size * (isSpark ? 1.15 + 0.35 * sparkFade : 1);
        const r = sky.r;
        const g = sky.g;
        const b = sky.b;
        if (isSpark) {
            const boost = 0.35 + 0.65 * sparkFade;
            const sr = Math.min(255, Math.round(r + (255 - r) * 0.45 * boost));
            const sg = Math.min(255, Math.round(g + (255 - g) * 0.35 * boost));
            const sb = Math.min(255, Math.round(b + (255 - b) * 0.15 * boost));
            ctx.fillStyle = isDarkTheme()
                ? `rgba(${sr}, ${sg}, ${sb}, ${Math.min(1, alpha * 0.95)})`
                : `rgba(${Math.round(r * 0.65)}, ${Math.round(g * 0.8)}, ${Math.round(b * 0.95)}, ${Math.min(1, alpha * 0.5)})`;
        } else if (isDarkTheme()) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.92})`;
        } else {
            ctx.fillStyle = `rgba(${Math.round(r * 0.65 + 90)}, ${Math.round(g * 0.75 + 70)}, ${Math.round(b * 0.9 + 40)}, ${alpha * 0.42})`;
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function resizeCanvas() {
    if (!canvas || !ctx) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function initParticles() {
    if (!canvas || !ctx) return;
    particles = [];
    const count = Math.floor((width * height) / 8000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
    initSparkStates(count);
}

function drawConnections(sky) {
    const darkTheme = isDarkTheme();
    const time = performance.now() * 0.0015;
    const maxDistSq = 120 * 120;
    const scrollBlend = getScrollBlend();
    const lm = particleMood.lineMul;
    const lineBoost = (0.4 + 0.75 * scrollBlend) * lm;
    const pulseBoost = (0.65 + 0.68 * scrollBlend) * lm;
    const motionOk = !prefersReducedMotion();

    const baseA = darkTheme ? 0.08 : 0.11;
    const lineA = baseA * (0.72 + 0.55 * (sky.b / 255));

    for (let i = 0; i < particles.length; i++) {
        const particleA = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
            const particleB = particles[j];
            const dx = particleA.x - particleB.x;
            const dy = particleA.y - particleB.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
                const showPulse = motionOk && (i + j) % 3 === 0;

                ctx.strokeStyle = darkTheme
                    ? `rgba(${sky.r}, ${sky.g}, ${sky.b}, ${lineA * lineBoost})`
                    : `rgba(${Math.max(40, sky.r - 20)}, ${Math.max(80, sky.g - 25)}, ${sky.b}, ${lineA * lineBoost})`;
                ctx.lineWidth = 0.55 + 0.2 * scrollBlend;
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

                const pulseA = darkTheme
                    ? (0.14 + pulse * 0.34) * pulseBoost
                    : (0.12 + pulse * 0.22) * pulseBoost;

                ctx.strokeStyle = darkTheme
                    ? `rgba(${Math.min(255, sky.r + 85)}, ${Math.min(255, sky.g + 55)}, ${Math.min(255, sky.b + 35)}, ${pulseA})`
                    : `rgba(${Math.max(15, sky.r - 30)}, ${Math.max(30, sky.g - 20)}, ${Math.min(120, sky.b)}, ${pulseA})`;
                ctx.lineWidth = 0.85 + pulse * 0.5 + 0.15 * scrollBlend;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    if (!canvas || !ctx) return;
    const sky = skylineBlueRgb();

    ctx.fillStyle = isDarkTheme() ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, width, height);

    tickSparks();
    const sparkFade = sparkFadeByIndex();

    particles.forEach((particle, index) => {
        particle.update();
        const fade = sparkFade.get(index);
        const isSpark = fade !== undefined;
        particle.draw(sky, isSpark, isSpark ? fade : 0);
    });
    drawConnections(sky);

    animationFrameId = requestAnimationFrame(animate);
}

function startBackground() {
    if (!canvas || !ctx) return;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    initParticles();
    animate();
}

window.startBackground = startBackground;
