/* ── Pride Confetti & Sparkle Animations ────────────────────────────────── */

const COLORS = [
  '#FF003C', '#FF8C00', '#FFE500',
  '#00C853', '#2979FF', '#AA00FF',
  '#FF4DAD', '#FF1493', '#00E5FF',
  '#FF76A4', '#55CDFC', '#F7A8B8',
];

const SHAPES = ['●', '★', '♦', '♥', '▲', '✦'];

/* ── Confetti particle system ──────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const MAX = 80;

  function createParticle(x, y) {
    return {
      x: x ?? Math.random() * canvas.width,
      y: y ?? -20,
      vx: (Math.random() - 0.5) * 2.5,
      vy: Math.random() * 2 + 1,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      shape: Math.floor(Math.random() * 3), // 0=rect, 1=circle, 2=star
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.08 + 0.02,
    };
  }

  // Seed initial burst
  for (let i = 0; i < 40; i++) {
    const p = createParticle();
    p.y = Math.random() * window.innerHeight;
    p.alpha = Math.random() * 0.7 + 0.3;
    particles.push(p);
  }

  let frameCount = 0;

  function drawStar(ctx, x, y, r, color) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const xi = x + r * Math.cos(angle);
      const yi = y + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(xi, yi) : ctx.lineTo(xi, yi);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Spawn new particles periodically
    if (frameCount % 8 === 0 && particles.length < MAX) {
      particles.push(createParticle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.wobble += p.wobbleSpeed;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      // Fade out near bottom
      if (p.y > canvas.height * 0.8) {
        p.alpha -= 0.015;
      }

      if (p.alpha <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha * 0.75;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      if (p.shape === 0) {
        // Rectangle
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === 1) {
        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        // Star
        ctx.translate(-p.size / 2, -p.size / 2);
        drawStar(ctx, p.size / 2, p.size / 2, p.size / 2, p.color);
      }

      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();

  // Burst on click
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 18; i++) {
      const p = createParticle(e.clientX, e.clientY);
      p.vx = (Math.random() - 0.5) * 8;
      p.vy = Math.random() * -6 - 2;
      particles.push(p);
    }
  });
})();

/* ── Intersection Observer: fade-in sections ────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(30px); transition: opacity .6s ease, transform .6s ease; }
    .fade-in.visible { opacity: 1; transform: translateY(0); }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.card, .blog-post, .flag-card, .meme-card, .stat, .mini-flag'
  );
  targets.forEach(el => el.classList.add('fade-in'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => obs.observe(el));
})();

/* ── Sparkle cursor trail ───────────────────────────────────────────────── */
(function () {
  let lastSparkle = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 50) return;
    lastSparkle = now;

    const span = document.createElement('span');
    span.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    span.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      color: ${color};
      font-size: ${Math.random() * 14 + 8}px;
      pointer-events: none;
      z-index: 99998;
      user-select: none;
      transition: opacity .6s, transform .6s;
      transform: translate(-50%, -50%);
      will-change: transform, opacity;
    `;
    document.body.appendChild(span);
    requestAnimationFrame(() => {
      span.style.opacity = '0';
      span.style.transform = `translate(-50%, -${Math.random() * 40 + 20}px) scale(0.3) rotate(${Math.random() * 360}deg)`;
    });
    setTimeout(() => span.remove(), 700);
  });
})();
