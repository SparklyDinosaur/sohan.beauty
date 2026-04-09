/* ══════════════════════════════════════════════════════════════════════════
   sohan.beauty — MAXIMUM PRIDE CHAOS ENGINE
   ══════════════════════════════════════════════════════════════════════════ */

const PRIDE   = ['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF'];
const EXTENDED = [...PRIDE,'#FF4DAD','#FF1493','#00E5FF','#FF76A4','#55CDFC','#F7A8B8','#FFD700','#FF69B4','#7B2FBE'];
const RAINBOW_STRIPE = ['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF'];
const HEART_EMOJIS  = ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','💖','💗','💝','💘','💞','💓'];
const SPARKLE_CHARS = ['✦','★','✿','♥','✨','💫','⭐','🌟','✯','❋','✱','✲'];
const UNICORN_EMOJIS = ['🦄','🌈','✨','💖','🦋','🌸','⭐','💎','🔮'];

const canvas = document.getElementById('confetti-canvas');
const ctx    = canvas.getContext('2d');

let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStarField();
});

const R  = (a, b) => a + Math.random() * (b - a);
const RI = (a, b) => Math.floor(R(a, b));
const RC = ()     => EXTENDED[RI(0, EXTENDED.length)];
const PC = ()     => PRIDE[RI(0, PRIDE.length)];

/* ══ STAR FIELD (static background stars, twinkling) ══════════════════════ */
let stars = [];
function buildStarField() {
  stars = [];
  for (let i = 0; i < 220; i++) {
    stars.push({
      x: R(0, W), y: R(0, H),
      r: R(0.5, 2.5),
      alpha: R(0.2, 1),
      twinkleV: R(0.005, 0.025),
      twinkleDir: 1,
      color: PRIDE[RI(0, PRIDE.length)],
    });
  }
}
buildStarField();

function drawStars() {
  stars.forEach(s => {
    s.alpha += s.twinkleV * s.twinkleDir;
    if (s.alpha > 1 || s.alpha < 0.1) s.twinkleDir *= -1;
    ctx.save();
    ctx.globalAlpha = s.alpha * 0.7;
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

/* ══ SHOOTING STARS ════════════════════════════════════════════════════════ */
const shooters = [];
function makeShooting() {
  const angle = R(Math.PI * 0.1, Math.PI * 0.4);
  const speed = R(12, 22);
  return {
    x: R(0, W * 0.7), y: R(0, H * 0.4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    len: R(60, 140),
    alpha: 1,
    color: PC(),
    tail: [],
  };
}
function updateShooters() {
  if (shooters.length < 6 && Math.random() < 0.012) shooters.push(makeShooting());
  for (let i = shooters.length - 1; i >= 0; i--) {
    const s = shooters[i];
    s.tail.push({ x: s.x, y: s.y });
    if (s.tail.length > 18) s.tail.shift();
    s.x += s.vx; s.y += s.vy;
    s.alpha -= 0.018;
    if (s.alpha <= 0 || s.x > W + 50 || s.y > H + 50) { shooters.splice(i, 1); continue; }
    // Draw tail
    s.tail.forEach((pt, idx) => {
      const t = (idx + 1) / s.tail.length;
      ctx.save();
      ctx.globalAlpha = t * s.alpha * 0.8;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = t * 3;
      ctx.lineCap = 'round';
      if (idx > 0) {
        ctx.beginPath();
        ctx.moveTo(s.tail[idx-1].x, s.tail[idx-1].y);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }
      ctx.restore();
    });
    // Bright head
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/* ══ FLYING RAINBOWS ═══════════════════════════════════════════════════════ */
const rainbows = [];
function makeRainbow() {
  const fromLeft = Math.random() < 0.5;
  return {
    x:      fromLeft ? -280 : W + 280,
    y:      R(H * 0.05, H * 0.7),
    vx:     (fromLeft ? 1 : -1) * R(4, 10),
    radius: R(70, 220),
    alpha:  0,
    scaleY: R(0.5, 1.2),
  };
}
function updateRainbows() {
  if (rainbows.length < 7 && Math.random() < 0.008) rainbows.push(makeRainbow());
  for (let i = rainbows.length - 1; i >= 0; i--) {
    const r = rainbows[i];
    r.x += r.vx;
    if (r.alpha < 0.9) r.alpha += 0.035;
    const offscreen = r.vx > 0 ? r.x > W + 320 : r.x < -320;
    if (offscreen) r.alpha -= 0.06;
    if (r.alpha <= 0) { rainbows.splice(i, 1); continue; }
    // Draw
    ctx.save();
    ctx.globalAlpha = r.alpha * 0.75;
    ctx.translate(r.x, r.y);
    ctx.scale(1, r.scaleY);
    RAINBOW_STRIPE.forEach((col, idx) => {
      const rad = r.radius + idx * 10;
      ctx.beginPath();
      ctx.arc(0, 0, rad, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = col;
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.shadowColor = col;
      ctx.shadowBlur = 6;
      ctx.stroke();
    });
    ctx.restore();
  }
}

/* ══ UNICORNS 🦄 ═══════════════════════════════════════════════════════════ */
const unicorns = [];
function makeUnicorn() {
  const fromLeft = Math.random() < 0.5;
  return {
    x:       fromLeft ? -120 : W + 120,
    y:       R(H * 0.02, H * 0.68),
    vx:      (fromLeft ? 1 : -1) * R(2.5, 8),
    vy:      R(-0.8, 0.8),
    scale:   R(1.2, 3),
    alpha:   0,
    wobble:  Math.random() * Math.PI * 2,
    wobbleV: R(0.025, 0.07),
    trail:   [],
    emoji:   UNICORN_EMOJIS[RI(0, 4)], // unicorn variants
  };
}
function updateUnicorns() {
  if (unicorns.length < 6 && Math.random() < 0.005) unicorns.push(makeUnicorn());
  for (let i = unicorns.length - 1; i >= 0; i--) {
    const u = unicorns[i];
    u.wobble += u.wobbleV;
    u.x += u.vx;
    u.y += u.vy + Math.sin(u.wobble) * 1.5;
    if (u.alpha < 1) u.alpha += 0.04;
    // Sparkle trail
    if (Math.random() < 0.7) {
      u.trail.push({
        x: u.x + R(-14, 14), y: u.y + R(-14, 14),
        alpha: 1, size: R(10, 28),
        color: RC(), glyph: SPARKLE_CHARS[RI(0, SPARKLE_CHARS.length)],
        vy: -R(0.3, 1.2),
      });
    }
    u.trail.forEach(t => { t.alpha -= 0.035; t.y += t.vy; });
    u.trail = u.trail.filter(t => t.alpha > 0);
    // Draw trail
    u.trail.forEach(t => {
      ctx.save();
      ctx.globalAlpha = t.alpha * 0.75;
      ctx.font = `${t.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = t.color;
      ctx.fillText(t.glyph, t.x, t.y);
      ctx.restore();
    });
    // Off-screen check
    const offscreen = u.vx > 0 ? u.x > W + 160 : u.x < -160;
    if (offscreen) { u.alpha -= 0.07; if (u.alpha <= 0) { unicorns.splice(i, 1); continue; } }
    // Draw unicorn
    ctx.save();
    ctx.globalAlpha = u.alpha;
    ctx.font = `${Math.round(52 * u.scale)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FF4DAD';
    ctx.shadowBlur = 20;
    if (u.vx < 0) { ctx.scale(-1, 1); ctx.fillText('🦄', -u.x, u.y); }
    else           { ctx.fillText('🦄', u.x, u.y); }
    ctx.restore();
  }
}

/* ══ CLOUDS + RAINBOW RAIN ═════════════════════════════════════════════════ */
const clouds = [], drops = [];
function makeCloud() {
  return {
    x: R(-150, W + 150), y: R(-120, -20),
    vx: R(0.2, 1.4) * (Math.random() < 0.5 ? 1 : -1),
    vy: R(0.2, 1),
    w: R(120, 300), h: R(55, 110),
    alpha: R(0.6, 0.9),
    dropTimer: 0,
    color: Math.random() < 0.6 ? '#ddd8ff' : '#ffddee',
  };
}
function makeDrop(c) {
  return {
    x: c.x + R(-c.w * 0.42, c.w * 0.42),
    y: c.y + c.h * 0.35,
    vy: R(5, 13),
    vx: R(-1, 1),
    len: R(10, 30),
    width: R(1.5, 3.5),
    color: RC(),
    alpha: R(0.6, 1),
  };
}
function updateCloudsDrops() {
  if (clouds.length < 10 && Math.random() < 0.009) clouds.push(makeCloud());
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.vx; c.y += c.vy;
    c.dropTimer++;
    if (c.dropTimer % 2 === 0 && drops.length < 400) drops.push(makeDrop(c));
    if (c.y > H + 200) { clouds.splice(i, 1); continue; }
    // Draw cloud
    ctx.save();
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = c.color;
    ctx.shadowColor = '#cc88ff';
    ctx.shadowBlur = 20;
    const cx = c.x, cy = c.y, w = c.w, h = c.h;
    ctx.beginPath();
    ctx.ellipse(cx,          cy,          w*0.38, h*0.5,  0, 0, Math.PI*2);
    ctx.ellipse(cx + w*0.28, cy - h*0.18, w*0.30, h*0.44, 0, 0, Math.PI*2);
    ctx.ellipse(cx - w*0.28, cy - h*0.12, w*0.27, h*0.37, 0, 0, Math.PI*2);
    ctx.ellipse(cx + w*0.1,  cy + h*0.14, w*0.40, h*0.40, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i];
    d.x += d.vx; d.y += d.vy;
    if (d.y > H + 50) { drops.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = d.alpha;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = d.width;
    ctx.lineCap = 'round';
    ctx.shadowColor = d.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.vx * 0.5, d.y + d.len);
    ctx.stroke();
    ctx.restore();
  }
}

/* ══ FLOATING HEARTS + EMOJIS ══════════════════════════════════════════════ */
const hearts = [];
function makeHeart(x, y) {
  return {
    x: x ?? R(0, W),
    y: y ?? H + 30,
    vx: R(-1.2, 1.2),
    vy: -R(1.2, 4),
    size: R(16, 42),
    alpha: R(0.6, 1),
    wobble: Math.random() * Math.PI * 2,
    wobbleV: R(0.02, 0.055),
    glyph: HEART_EMOJIS[RI(0, HEART_EMOJIS.length)],
  };
}
function updateHearts() {
  if (hearts.length < 35 && Math.random() < 0.07) hearts.push(makeHeart());
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.wobble += h.wobbleV;
    h.x += h.vx + Math.sin(h.wobble) * 0.8;
    h.y += h.vy;
    if (h.y < H * 0.35) h.alpha -= 0.009;
    if (h.alpha <= 0 || h.y < -80) { hearts.splice(i, 1); continue; }
    ctx.save();
    ctx.globalAlpha = h.alpha;
    ctx.font = `${h.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#FF4DAD';
    ctx.shadowBlur = 12;
    ctx.fillText(h.glyph, h.x, h.y);
    ctx.restore();
  }
}

/* ══ CONFETTI ══════════════════════════════════════════════════════════════ */
const confetti = [];
function makeConfetti(x, y, burst) {
  return {
    x: x ?? R(0, W), y: y ?? -20,
    vx: burst ? R(-8, 8)  : R(-1.5, 1.5),
    vy: burst ? R(-10, -2) : R(1.2, 3),
    alpha: 1, color: RC(),
    size: R(5, 13), rot: Math.random() * Math.PI * 2,
    rotV: R(-0.14, 0.14),
    wobble: Math.random() * Math.PI * 2,
    wobbleV: R(0.02, 0.08),
    shape: RI(0, 3), burst: !!burst,
  };
}
for (let i = 0; i < 60; i++) {
  const p = makeConfetti(); p.y = R(0, H); p.alpha = R(0.2, 0.9);
  confetti.push(p);
}
function drawConfettiP(p) {
  ctx.save();
  ctx.globalAlpha = p.alpha * 0.85;
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 4;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (p.shape === 0)      { ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2); }
  else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
  else {
    ctx.beginPath();
    for (let i=0;i<5;i++) {
      const a=(i*4*Math.PI)/5-Math.PI/2;
      i===0?ctx.moveTo(Math.cos(a)*p.size/2,Math.sin(a)*p.size/2):ctx.lineTo(Math.cos(a)*p.size/2,Math.sin(a)*p.size/2);
    }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
function updateConfetti() {
  for (let i = confetti.length-1; i >= 0; i--) {
    const p = confetti[i];
    p.wobble += p.wobbleV;
    p.x += p.vx + Math.sin(p.wobble)*0.6;
    p.y += p.vy;
    p.rot += p.rotV;
    if (p.burst) p.vy += 0.3;
    if (p.y > H*0.82) p.alpha -= 0.02;
    if (p.alpha <= 0 || p.y > H+30) { confetti.splice(i,1); continue; }
    drawConfettiP(p);
  }
  if (confetti.length < 160 && Math.random() < 0.5) confetti.push(makeConfetti());
}

/* ══ FIREWORKS 🎆 ══════════════════════════════════════════════════════════ */
const fireworks = [];
function explode(x, y) {
  const color = PC();
  for (let i = 0; i < 55; i++) {
    const angle = (i / 55) * Math.PI * 2;
    const speed = R(2, 9);
    fireworks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      size: R(2, 5),
      tail: [],
    });
  }
}
function updateFireworks() {
  // Auto-fire
  if (fireworks.length < 120 && Math.random() < 0.008) {
    explode(R(W*0.1, W*0.9), R(H*0.05, H*0.55));
  }
  for (let i = fireworks.length-1; i >= 0; i--) {
    const f = fireworks[i];
    f.tail.push({x:f.x, y:f.y});
    if (f.tail.length > 8) f.tail.shift();
    f.x += f.vx; f.y += f.vy;
    f.vy += 0.12; // gravity
    f.vx *= 0.97;
    f.alpha -= 0.022;
    if (f.alpha <= 0) { fireworks.splice(i,1); continue; }
    // Draw tail
    f.tail.forEach((pt, idx) => {
      if (idx === 0) return;
      ctx.save();
      ctx.globalAlpha = (idx/f.tail.length) * f.alpha * 0.6;
      ctx.strokeStyle = f.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(f.tail[idx-1].x, f.tail[idx-1].y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      ctx.restore();
    });
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = f.color;
    ctx.shadowColor = f.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}

/* ══ BUBBLES 🫧 ════════════════════════════════════════════════════════════ */
const bubbles = [];
function makeBubble() {
  return {
    x: R(0, W), y: H + 30,
    vy: -R(1, 3.5),
    vx: R(-0.8, 0.8),
    r: R(10, 45),
    alpha: R(0.25, 0.65),
    wobble: Math.random()*Math.PI*2,
    wobbleV: R(0.015, 0.04),
    hue: RI(0, 360),
  };
}
function updateBubbles() {
  if (bubbles.length < 40 && Math.random() < 0.12) bubbles.push(makeBubble());
  for (let i = bubbles.length-1; i >= 0; i--) {
    const b = bubbles[i];
    b.wobble += b.wobbleV;
    b.x += b.vx + Math.sin(b.wobble)*0.7;
    b.y += b.vy;
    b.hue = (b.hue + 0.8) % 360;
    if (b.y < -b.r*2) { bubbles.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = b.alpha;
    const grad = ctx.createRadialGradient(b.x-b.r*0.3, b.y-b.r*0.3, b.r*0.1, b.x, b.y, b.r);
    grad.addColorStop(0, `hsla(${b.hue},100%,90%,0.8)`);
    grad.addColorStop(0.5, `hsla(${b.hue},100%,65%,0.3)`);
    grad.addColorStop(1, `hsla(${b.hue},100%,50%,0.1)`);
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = `hsla(${b.hue},100%,75%,0.5)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
}

/* ══ DISCO GLITTER ═════════════════════════════════════════════════════════ */
const glitter = [];
function makeGlitter() {
  return {
    x: R(0, W), y: R(0, H),
    alpha: 0, fadeDir: 1,
    fadeV: R(0.04, 0.12),
    size: R(1, 4),
    color: RC(),
  };
}
for (let i = 0; i < 80; i++) glitter.push(makeGlitter());
function updateGlitter() {
  glitter.forEach(g => {
    g.alpha += g.fadeV * g.fadeDir;
    if (g.alpha > 1) { g.fadeDir = -1; }
    if (g.alpha < 0) {
      // Reposition and reset
      g.x = R(0, W); g.y = R(0, H);
      g.fadeDir = 1; g.alpha = 0;
      g.color = RC();
      g.size = R(1, 4);
    }
    ctx.save();
    ctx.globalAlpha = g.alpha * 0.8;
    ctx.fillStyle = g.color;
    ctx.shadowColor = g.color;
    ctx.shadowBlur = 6;
    ctx.fillRect(g.x, g.y, g.size, g.size);
    ctx.restore();
  });
}

/* ══ LIGHTNING BOLTS ════════════════════════════════════════════════════════ */
const bolts = [];
function makeBolt() {
  const x = R(W*0.1, W*0.9);
  const color = PC();
  const points = [{ x, y: 0 }];
  let cx = x, cy = 0;
  while (cy < H * 0.6) {
    cx += R(-40, 40);
    cy += R(30, 70);
    points.push({ x: cx, y: cy });
  }
  return { points, color, alpha: 0.9, fade: 0.08 };
}
function updateBolts() {
  if (bolts.length < 2 && Math.random() < 0.004) bolts.push(makeBolt());
  for (let i = bolts.length-1; i >= 0; i--) {
    const b = bolts[i];
    b.alpha -= b.fade;
    if (b.alpha <= 0) { bolts.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = b.alpha * 0.7;
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 20;
    ctx.beginPath();
    b.points.forEach((pt, idx) => idx===0?ctx.moveTo(pt.x,pt.y):ctx.lineTo(pt.x,pt.y));
    ctx.stroke();
    // Glow pass
    ctx.globalAlpha = b.alpha * 0.3;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
  }
}

/* ══ SWIRL VORTEX (periodic) ═══════════════════════════════════════════════ */
let vortex = null, vortexAge = 0;
function makeVortex() {
  return { x: R(W*0.2, W*0.8), y: R(H*0.2, H*0.7), angle: 0, alpha: 0, life: 0 };
}
function updateVortex() {
  if (!vortex && Math.random() < 0.002) vortex = makeVortex();
  if (!vortex) return;
  vortex.angle += 0.06;
  vortex.life  += 0.01;
  if (vortex.alpha < 0.8 && vortex.life < 0.5) vortex.alpha += 0.03;
  if (vortex.life > 0.5) vortex.alpha -= 0.025;
  if (vortex.alpha <= 0) { vortex = null; return; }
  PRIDE.forEach((col, idx) => {
    for (let arm = 0; arm < 3; arm++) {
      const armOffset = (arm / 3) * Math.PI * 2;
      for (let t = 0; t < 60; t++) {
        const tt = t / 60;
        const angle = vortex.angle + tt * Math.PI * 4 + armOffset;
        const radius = tt * 160 + idx * 5;
        const px = vortex.x + Math.cos(angle) * radius;
        const py = vortex.y + Math.sin(angle) * radius;
        ctx.save();
        ctx.globalAlpha = vortex.alpha * (1 - tt) * 0.6;
        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 - tt*2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }
  });
}

/* ══ FLOATING PRIDE WORDS ══════════════════════════════════════════════════ */
const PRIDE_WORDS = ['LOVE','PRIDE','GAY','🏳️‍🌈','JOY','QUEER','✨','BE YOURSELF','LOVE WINS','💖'];
const floatWords = [];
function makeWord() {
  return {
    x: R(0, W), y: H + 40,
    vy: -R(0.6, 1.8),
    vx: R(-0.4, 0.4),
    alpha: R(0.4, 0.8),
    size: RI(14, 36),
    word: PRIDE_WORDS[RI(0, PRIDE_WORDS.length)],
    color: RC(),
    wobble: Math.random()*Math.PI*2,
    wobbleV: R(0.01, 0.03),
  };
}
function updateWords() {
  if (floatWords.length < 12 && Math.random() < 0.025) floatWords.push(makeWord());
  for (let i = floatWords.length-1; i >= 0; i--) {
    const w = floatWords[i];
    w.wobble += w.wobbleV;
    w.x += w.vx + Math.sin(w.wobble)*0.4;
    w.y += w.vy;
    if (w.y < H*0.3) w.alpha -= 0.006;
    if (w.alpha <= 0 || w.y < -60) { floatWords.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = w.alpha;
    ctx.font = `bold ${w.size}px 'Playfair Display', serif`;
    ctx.fillStyle = w.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = w.color;
    ctx.shadowBlur = 12;
    ctx.fillText(w.word, w.x, w.y);
    ctx.restore();
  }
}

/* ══ PULSING RINGS ═════════════════════════════════════════════════════════ */
const rings = [];
function makeRing() {
  return {
    x: R(0, W), y: R(0, H),
    r: 0, vr: R(2, 5),
    color: PC(),
    alpha: 0.8,
  };
}
function updateRings() {
  if (rings.length < 8 && Math.random() < 0.04) rings.push(makeRing());
  for (let i = rings.length-1; i >= 0; i--) {
    const rg = rings[i];
    rg.r += rg.vr;
    rg.alpha -= 0.012;
    if (rg.alpha <= 0) { rings.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = rg.alpha;
    ctx.strokeStyle = rg.color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = rg.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }
}

/* ══ MAIN LOOP ════════════════════════════════════════════════════════════ */
function render() {
  ctx.clearRect(0, 0, W, H);

  drawStars();
  updateGlitter();
  updateRings();
  updateBolts();
  updateVortex();
  updateRainbows();
  updateCloudsDrops();
  updateUnicorns();
  updateShooters();
  updateFireworks();
  updateBubbles();
  updateHearts();
  updateWords();
  updateConfetti();

  requestAnimationFrame(render);
}

// Seed objects
for (let i = 0; i < 6; i++) clouds.push(makeCloud());
for (let i = 0; i < 4; i++) rainbows.push(makeRainbow());
for (let i = 0; i < 3; i++) unicorns.push(makeUnicorn());
for (let i = 0; i < 3; i++) bubbles.push(makeBubble());
explode(W * 0.3, H * 0.3);
explode(W * 0.7, H * 0.25);

render();

/* ══ CLICK EXPLOSION ══════════════════════════════════════════════════════ */
document.addEventListener('click', (e) => {
  explode(e.clientX, e.clientY);
  for (let i = 0; i < 28; i++) confetti.push(makeConfetti(e.clientX, e.clientY, true));
  for (let i = 0; i < 5; i++) {
    const h = makeHeart(e.clientX + R(-40, 40), e.clientY);
    h.vy = -R(3, 8); h.alpha = 1; hearts.push(h);
  }
  rings.push({ x: e.clientX, y: e.clientY, r: 0, vr: 6, color: PC(), alpha: 1 });
  rings.push({ x: e.clientX, y: e.clientY, r: 0, vr: 4, color: PC(), alpha: 1 });
});

/* ══ SPARKLE CURSOR TRAIL ════════════════════════════════════════════════ */
let lastSpark = 0;
document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastSpark < 30) return;
  lastSpark = now;

  const count = RI(1, 3);
  for (let k = 0; k < count; k++) {
    const span = document.createElement('span');
    span.textContent = SPARKLE_CHARS[RI(0, SPARKLE_CHARS.length)];
    const col = RC();
    span.style.cssText = `
      position:fixed;left:${e.clientX+R(-8,8)}px;top:${e.clientY+R(-8,8)}px;
      color:${col};font-size:${R(9,20)}px;pointer-events:none;z-index:99998;
      user-select:none;transform:translate(-50%,-50%);
      transition:opacity .5s,transform .5s;will-change:transform,opacity;
      text-shadow:0 0 8px ${col};
    `;
    document.body.appendChild(span);
    requestAnimationFrame(() => {
      span.style.opacity = '0';
      span.style.transform = `translate(-50%,-${R(30,65)}px) scale(0.1) rotate(${R(-180,180)}deg)`;
    });
    setTimeout(() => span.remove(), 600);
  }
});

/* ══ SCROLL RAINBOW PULSE ════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  if (Math.random() < 0.3) {
    rings.push({ x: R(0, W), y: R(0, H*0.5), r: 0, vr: R(3,7), color: PC(), alpha: 0.9 });
  }
  if (Math.random() < 0.15) shooters.push(makeShooting());
});

/* ══ FADE-IN ON SCROLL ═══════════════════════════════════════════════════ */
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
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);} });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
fadeTargets.forEach(el => observer.observe(el));
