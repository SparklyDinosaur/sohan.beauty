/* ══════════════════════════════════════════════════════════════════════════
   sohan.beauty — Pride Interactive Animations
   · Flying unicorns
   · Rainbow arcs shooting across the screen
   · Clouds raining coloured drops
   · Confetti burst (click + ambient)
   · Sparkle cursor trail
   ══════════════════════════════════════════════════════════════════════════ */

const PRIDE_COLORS = [
  '#FF003C','#FF8C00','#FFE500',
  '#00C853','#2979FF','#AA00FF',
  '#FF4DAD','#FF1493','#00E5FF',
  '#FF76A4','#55CDFC','#F7A8B8',
];

/* ── Canvas setup ─────────────────────────────────────────────────────────── */
const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function randBetween(a, b) { return a + Math.random() * (b - a); }
function randColor()       { return PRIDE_COLORS[Math.floor(Math.random() * PRIDE_COLORS.length)]; }
function randInt(a, b)     { return Math.floor(randBetween(a, b)); }

/* ══════════════════════════════════════════════════════════════════════════
   1. CONFETTI PARTICLES
   ══════════════════════════════════════════════════════════════════════════ */
const confetti = [];
const MAX_CONFETTI = 90;

function makeConfetti(x, y, burst = false) {
  return {
    x: x ?? randBetween(0, canvas.width),
    y: y ?? -20,
    vx: burst ? randBetween(-6, 6) : randBetween(-1.2, 1.2),
    vy: burst ? randBetween(-8, -2) : randBetween(1.2, 2.8),
    alpha: 1,
    color: randColor(),
    size:  randBetween(5, 11),
    rot:   Math.random() * Math.PI * 2,
    rotV:  randBetween(-0.12, 0.12),
    wobble: Math.random() * Math.PI * 2,
    wobbleV: randBetween(0.02, 0.08),
    shape: randInt(0, 3),
    burst,
  };
}

// Seed ambient particles scattered across screen
for (let i = 0; i < 40; i++) {
  const p = makeConfetti();
  p.y = randBetween(0, canvas.height);
  p.alpha = randBetween(0.2, 0.8);
  confetti.push(p);
}

function drawConfettiParticle(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha * 0.8;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.fillStyle = p.color;
  if (p.shape === 0) {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.shape === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Star
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const xi = (p.size / 2) * Math.cos(a);
      const yi = (p.size / 2) * Math.sin(a);
      i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function updateConfetti() {
  for (let i = confetti.length - 1; i >= 0; i--) {
    const p = confetti[i];
    p.wobble += p.wobbleV;
    p.x += p.vx + Math.sin(p.wobble) * 0.5;
    p.y += p.vy;
    p.rot += p.rotV;
    if (p.burst) p.vy += 0.25; // gravity for burst
    if (p.y > canvas.height * 0.8) p.alpha -= 0.018;
    if (p.alpha <= 0 || p.y > canvas.height + 30) confetti.splice(i, 1);
  }
  if (confetti.length < MAX_CONFETTI && Math.random() < 0.3) {
    confetti.push(makeConfetti());
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   2. FLYING RAINBOWS
   ══════════════════════════════════════════════════════════════════════════ */
const rainbows = [];
const RAINBOW_STRIPES = ['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF'];

function makeRainbow() {
  // Fly left→right OR right→left, at random vertical position
  const fromLeft = Math.random() < 0.5;
  const y = randBetween(canvas.height * 0.1, canvas.height * 0.7);
  return {
    x:      fromLeft ? -300 : canvas.width + 300,
    y,
    vx:     fromLeft ? randBetween(5, 11) : -randBetween(5, 11),
    radius: randBetween(90, 200),  // arc radius
    alpha:  0,
    life:   0,     // 0→1 fade in, then fade out near end
    done:   false,
  };
}

function drawRainbow(r) {
  const stripeW = 9;
  ctx.save();
  ctx.globalAlpha = r.alpha * 0.85;
  ctx.translate(r.x, r.y);

  RAINBOW_STRIPES.forEach((color, i) => {
    const rad = r.radius + i * stripeW;
    ctx.beginPath();
    ctx.arc(0, 0, rad, Math.PI, 2 * Math.PI); // upper semicircle
    ctx.strokeStyle = color;
    ctx.lineWidth = stripeW - 1;
    ctx.lineCap = 'round';
    ctx.stroke();
  });
  ctx.restore();
}

function updateRainbows() {
  for (let i = rainbows.length - 1; i >= 0; i--) {
    const r = rainbows[i];
    r.x    += r.vx;
    r.life += 0.012;
    // Fade in
    if (r.alpha < 0.9) r.alpha += 0.04;
    // Fade out when off screen
    const offscreen = r.vx > 0 ? r.x > canvas.width + 350 : r.x < -350;
    if (offscreen) r.alpha -= 0.06;
    if (r.alpha <= 0) rainbows.splice(i, 1);
  }
  // Spawn a new rainbow occasionally
  if (rainbows.length < 4 && Math.random() < 0.004) {
    rainbows.push(makeRainbow());
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   3. FLYING UNICORNS  🦄
   ══════════════════════════════════════════════════════════════════════════ */
const unicorns = [];

function makeUnicorn() {
  const fromLeft = Math.random() < 0.5;
  const y = randBetween(canvas.height * 0.05, canvas.height * 0.65);
  return {
    x:       fromLeft ? -120 : canvas.width + 120,
    y,
    vx:      fromLeft ? randBetween(3, 7) : -randBetween(3, 7),
    vy:      randBetween(-0.6, 0.6),
    scale:   randBetween(1.4, 2.4),
    alpha:   0,
    wobble:  Math.random() * Math.PI * 2,
    wobbleV: randBetween(0.03, 0.07),
    // Sparkle trail
    trail:   [],
  };
}

function drawUnicorn(u) {
  // Draw sparkle trail first
  u.trail.forEach((t) => {
    ctx.save();
    ctx.globalAlpha = t.alpha * 0.6;
    ctx.font = `${t.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = t.color;
    ctx.fillText(t.glyph, t.x, t.y);
    ctx.restore();
  });

  // Draw unicorn emoji
  ctx.save();
  ctx.globalAlpha = u.alpha;
  ctx.font = `${Math.round(48 * u.scale)}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // Flip if going right→left
  if (u.vx < 0) {
    ctx.scale(-1, 1);
    ctx.fillText('🦄', -u.x, u.y);
  } else {
    ctx.fillText('🦄', u.x, u.y);
  }
  ctx.restore();
}

const SPARKLE_GLYPHS = ['✦','★','✿','♥','✨','•'];

function updateUnicorns() {
  for (let i = unicorns.length - 1; i >= 0; i--) {
    const u = unicorns[i];
    u.wobble += u.wobbleV;
    u.x += u.vx;
    u.y += u.vy + Math.sin(u.wobble) * 1.2;
    if (u.alpha < 1) u.alpha += 0.05;

    // Emit sparkle trail
    if (Math.random() < 0.5) {
      u.trail.push({
        x: u.x + randBetween(-10, 10),
        y: u.y + randBetween(-10, 10),
        alpha: 0.9,
        size: randBetween(10, 22),
        color: randColor(),
        glyph: SPARKLE_GLYPHS[randInt(0, SPARKLE_GLYPHS.length)],
      });
    }
    // Age trail
    u.trail.forEach(t => { t.alpha -= 0.04; t.y -= 0.5; });
    u.trail = u.trail.filter(t => t.alpha > 0);

    const offscreen = u.vx > 0 ? u.x > canvas.width + 150 : u.x < -150;
    if (offscreen) {
      u.alpha -= 0.08;
      if (u.alpha <= 0) unicorns.splice(i, 1);
    }
  }
  if (unicorns.length < 3 && Math.random() < 0.003) {
    unicorns.push(makeUnicorn());
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   4. CLOUDS + COLOURED RAINDROPS  ☁️
   ══════════════════════════════════════════════════════════════════════════ */
const clouds = [];
const drops  = [];

function makeCloud() {
  return {
    x:      randBetween(-100, canvas.width + 100),
    y:      randBetween(-80, -20),
    vx:     randBetween(0.3, 1.2) * (Math.random() < 0.5 ? 1 : -1),
    vy:     randBetween(0.3, 0.9),
    w:      randBetween(140, 260),
    h:      randBetween(60, 100),
    alpha:  randBetween(0.55, 0.85),
    raining: true,
    dropTimer: 0,
  };
}

function drawCloud(c) {
  ctx.save();
  ctx.globalAlpha = c.alpha;
  ctx.fillStyle = '#e8e0ff';

  // Draw cloud as overlapping ellipses
  const cx = c.x, cy = c.y, w = c.w, h = c.h;
  ctx.beginPath();
  ctx.ellipse(cx,          cy,          w * 0.38, h * 0.5,  0, 0, Math.PI * 2);
  ctx.ellipse(cx + w*0.28, cy - h*0.15, w * 0.32, h * 0.45, 0, 0, Math.PI * 2);
  ctx.ellipse(cx - w*0.28, cy - h*0.1,  w * 0.28, h * 0.38, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + w*0.12, cy + h*0.12, w * 0.42, h * 0.42, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function makeDrop(cloud) {
  return {
    x:     cloud.x + randBetween(-cloud.w * 0.35, cloud.w * 0.35),
    y:     cloud.y + cloud.h * 0.4,
    vy:    randBetween(4, 9),
    vx:    randBetween(-0.8, 0.8),
    len:   randBetween(12, 26),
    color: randColor(),
    alpha: randBetween(0.6, 1),
  };
}

function drawDrop(d) {
  ctx.save();
  ctx.globalAlpha = d.alpha;
  ctx.strokeStyle = d.color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(d.x, d.y);
  ctx.lineTo(d.x + d.vx, d.y + d.len);
  ctx.stroke();
  ctx.restore();
}

function updateClouds() {
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.vx;
    c.y += c.vy;

    // Emit drops
    c.dropTimer++;
    if (c.raining && c.dropTimer % 4 === 0 && drops.length < 220) {
      drops.push(makeDrop(c));
    }

    // Remove when falls below screen
    if (c.y > canvas.height + 150) clouds.splice(i, 1);
  }
  if (clouds.length < 5 && Math.random() < 0.006) {
    clouds.push(makeCloud());
  }
}

function updateDrops() {
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    d.x += d.vx;
    d.y += d.vy;
    if (d.y > canvas.height + 40) drops.splice(i, 1);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   5. FLOATING PRIDE HEARTS  💜
   ══════════════════════════════════════════════════════════════════════════ */
const hearts = [];

function makeHeart() {
  return {
    x:    randBetween(0, canvas.width),
    y:    canvas.height + 40,
    vx:   randBetween(-0.8, 0.8),
    vy:   -randBetween(1.5, 3.5),
    size: randBetween(16, 36),
    alpha: randBetween(0.5, 0.9),
    glyph: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💗','💝'][randInt(0, 11)],
    wobble: Math.random() * Math.PI * 2,
    wobbleV: randBetween(0.02, 0.05),
  };
}

function drawHeart(h) {
  ctx.save();
  ctx.globalAlpha = h.alpha;
  ctx.font = `${h.size}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(h.glyph, h.x, h.y);
  ctx.restore();
}

function updateHearts() {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.wobble += h.wobbleV;
    h.x += h.vx + Math.sin(h.wobble) * 0.6;
    h.y += h.vy;
    if (h.y < canvas.height * 0.4) h.alpha -= 0.008;
    if (h.alpha <= 0 || h.y < -60) hearts.splice(i, 1);
  }
  if (hearts.length < 20 && Math.random() < 0.04) {
    hearts.push(makeHeart());
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   6. MAIN RENDER LOOP
   ══════════════════════════════════════════════════════════════════════════ */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw order: rainbows (back) → clouds → drops → unicorns → hearts → confetti (front)
  rainbows.forEach(drawRainbow);
  clouds.forEach(drawCloud);
  drops.forEach(drawDrop);
  unicorns.forEach(drawUnicorn);
  hearts.forEach(drawHeart);
  confetti.forEach(drawConfettiParticle);

  updateRainbows();
  updateClouds();
  updateDrops();
  updateUnicorns();
  updateHearts();
  updateConfetti();

  requestAnimationFrame(render);
}

// Seed initial objects
for (let i = 0; i < 3; i++) clouds.push(makeCloud());
for (let i = 0; i < 2; i++) rainbows.push(makeRainbow());
unicorns.push(makeUnicorn());

render();

/* ══════════════════════════════════════════════════════════════════════════
   7. CLICK BURST
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  // Confetti burst
  for (let i = 0; i < 22; i++) {
    confetti.push(makeConfetti(e.clientX, e.clientY, true));
  }
  // Mini rainbow at click point
  rainbows.push({
    x: e.clientX, y: e.clientY,
    vx: (Math.random() < 0.5 ? 1 : -1) * randBetween(4, 8),
    radius: 40, alpha: 0, life: 0,
  });
  // Heart pop
  for (let i = 0; i < 4; i++) {
    const h = makeHeart();
    h.x = e.clientX + randBetween(-30, 30);
    h.y = e.clientY;
    h.vy = -randBetween(3, 7);
    h.alpha = 1;
    hearts.push(h);
  }
});

/* ══════════════════════════════════════════════════════════════════════════
   8. SPARKLE CURSOR TRAIL
   ══════════════════════════════════════════════════════════════════════════ */
const SPARKLE_CHARS = ['✦','★','✿','♥','✨','🌈','💫','⭐'];
let lastSparkle = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSparkle < 45) return;
  lastSparkle = now;
  const span = document.createElement('span');
  span.textContent = SPARKLE_CHARS[randInt(0, SPARKLE_CHARS.length)];
  span.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    color:${randColor()};
    font-size:${randBetween(10, 20)}px;
    pointer-events:none;
    z-index:99998;
    user-select:none;
    transform:translate(-50%,-50%);
    transition:opacity .55s,transform .55s;
    will-change:transform,opacity;
  `;
  document.body.appendChild(span);
  requestAnimationFrame(() => {
    span.style.opacity = '0';
    span.style.transform = `translate(-50%,-${randBetween(25, 55)}px) scale(0.2) rotate(${randBetween(-90,90)}deg)`;
  });
  setTimeout(() => span.remove(), 650);
});

/* ══════════════════════════════════════════════════════════════════════════
   9. INTERSECTION OBSERVER (fade-in on scroll)
   ══════════════════════════════════════════════════════════════════════════ */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-in{opacity:0;transform:translateY(28px);transition:opacity .6s ease,transform .6s ease}
  .fade-in.visible{opacity:1;transform:translateY(0)}
`;
document.head.appendChild(fadeStyle);

const fadeTargets = document.querySelectorAll(
  '.card,.blog-post,.flag-card,.meme-card,.stat,.mini-flag,.value-card,.vibe-pill'
);
fadeTargets.forEach(el => el.classList.add('fade-in'));
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
fadeTargets.forEach(el => obs.observe(el));
