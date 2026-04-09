/* ══════════════════════════════════════════════════════════════════════════
   sohan.beauty — Pride Animations (performance-optimised build)
   ══════════════════════════════════════════════════════════════════════════ */
const PRIDE    = ['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF'];
const EXTENDED = [...PRIDE,'#FF4DAD','#FF1493','#00E5FF','#FF76A4','#55CDFC'];
const HEART_EMOJIS  = ['❤️','🧡','💛','💚','💙','💜','💖','💗','💝'];
const SPARKLE_CHARS = ['✦','★','♥','✨','💫','⭐','🌟'];

const canvas = document.getElementById('confetti-canvas');
if (!canvas) throw new Error('no canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width  = window.innerWidth;
let H = canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  buildStars();
});

const R  = (a,b) => a + Math.random()*(b-a);
const RI = (a,b) => Math.floor(R(a,b));
const RC = ()    => EXTENDED[RI(0,EXTENDED.length)];
const PC = ()    => PRIDE[RI(0,PRIDE.length)];

/* ── Page visibility: pause when hidden ────────────────────────────────── */
let paused = false;
document.addEventListener('visibilitychange', () => { paused = document.hidden; });

/* ══ STARS (static, twinkling, NO shadowBlur) ═══════════════════════════ */
let stars = [];
function buildStars() {
  stars = Array.from({length:130}, () => ({
    x:R(0,W), y:R(0,H), r:R(0.5,2),
    a:R(0.15,0.9), av:R(0.004,0.02)*( Math.random()<0.5?1:-1),
    c:PRIDE[RI(0,PRIDE.length)],
  }));
}
buildStars();
function drawStars() {
  for (const s of stars) {
    s.a = Math.max(0.05, Math.min(1, s.a + s.av));
    if (s.a >= 0.9 || s.a <= 0.05) s.av *= -1;
    ctx.globalAlpha = s.a * 0.65;
    ctx.fillStyle = s.c;
    ctx.fillRect(s.x - s.r, s.y - s.r, s.r*2, s.r*2);
  }
  ctx.globalAlpha = 1;
}

/* ══ SHOOTING STARS ══════════════════════════════════════════════════════ */
const shooters = [];
function makeShooting() {
  const a = R(0.12, 0.42);
  const sp = R(10,20);
  return { x:R(0,W*0.7), y:R(0,H*0.4), vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
           alpha:1, color:PC(), tail:[] };
}
function drawShooters() {
  if (shooters.length < 5 && Math.random() < 0.01) shooters.push(makeShooting());
  for (let i = shooters.length-1; i >= 0; i--) {
    const s = shooters[i];
    s.tail.push({x:s.x, y:s.y});
    if (s.tail.length > 14) s.tail.shift();
    s.x += s.vx; s.y += s.vy; s.alpha -= 0.022;
    if (s.alpha <= 0 || s.x > W+60 || s.y > H+60) { shooters.splice(i,1); continue; }
    for (let j=1; j<s.tail.length; j++) {
      const t = j/s.tail.length;
      ctx.globalAlpha = t * s.alpha * 0.7;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = t*2.5;
      ctx.beginPath();
      ctx.moveTo(s.tail[j-1].x, s.tail[j-1].y);
      ctx.lineTo(s.tail[j].x, s.tail[j].y);
      ctx.stroke();
    }
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ══ RAINBOWS (flying arcs) ══════════════════════════════════════════════ */
const rainbows = [];
const RBOW = ['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF'];
function makeRainbow() {
  const fl = Math.random()<0.5;
  return { x:fl?-250:W+250, y:R(H*0.05,H*0.7),
           vx:(fl?1:-1)*R(4,9), radius:R(70,200), alpha:0, scaleY:R(0.5,1.2) };
}
function drawRainbows() {
  if (rainbows.length < 5 && Math.random() < 0.006) rainbows.push(makeRainbow());
  for (let i = rainbows.length-1; i >= 0; i--) {
    const r = rainbows[i];
    r.x += r.vx;
    r.alpha = Math.min(0.8, r.alpha + 0.03);
    const off = r.vx>0 ? r.x>W+300 : r.x<-300;
    if (off) r.alpha -= 0.06;
    if (r.alpha <= 0) { rainbows.splice(i,1); continue; }
    ctx.save();
    ctx.globalAlpha = r.alpha * 0.7;
    ctx.translate(r.x, r.y); ctx.scale(1, r.scaleY);
    RBOW.forEach((c,idx) => {
      ctx.strokeStyle = c; ctx.lineWidth = 8; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, r.radius+idx*9, Math.PI, 2*Math.PI); ctx.stroke();
    });
    ctx.restore();
  }
}

/* ══ UNICORNS 🦄 ══════════════════════════════════════════════════════════ */
const unicorns = [];
function makeUnicorn() {
  const fl = Math.random()<0.5;
  return { x:fl?-100:W+100, y:R(H*0.02,H*0.68),
           vx:(fl?1:-1)*R(2.5,7), vy:R(-0.7,0.7),
           scale:R(1.2,2.6), alpha:0, wobble:Math.random()*Math.PI*2,
           wobbleV:R(0.025,0.065), trail:[] };
}
function drawUnicorns() {
  if (unicorns.length < 4 && Math.random() < 0.004) unicorns.push(makeUnicorn());
  for (let i = unicorns.length-1; i >= 0; i--) {
    const u = unicorns[i];
    u.wobble += u.wobbleV;
    u.x += u.vx; u.y += u.vy + Math.sin(u.wobble)*1.2;
    u.alpha = Math.min(1, u.alpha+0.04);
    if (Math.random()<0.5) u.trail.push({x:u.x+R(-12,12),y:u.y+R(-12,12),
      a:0.85,size:R(10,22),c:RC(),g:SPARKLE_CHARS[RI(0,SPARKLE_CHARS.length)],vy:-R(0.3,1)});
    u.trail.forEach(t => { t.a -= 0.04; t.y += t.vy; });
    u.trail = u.trail.filter(t => t.a > 0);
    // Trail
    for (const t of u.trail) {
      ctx.globalAlpha = t.a * 0.7;
      ctx.font = `${t.size}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle = t.c; ctx.fillText(t.g, t.x, t.y);
    }
    const off = u.vx>0 ? u.x>W+140 : u.x<-140;
    if (off) { u.alpha -= 0.07; if (u.alpha<=0){unicorns.splice(i,1);continue;} }
    ctx.globalAlpha = u.alpha;
    ctx.font = `${Math.round(50*u.scale)}px serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    if (u.vx<0){ctx.save();ctx.scale(-1,1);ctx.fillText('🦄',-u.x,u.y);ctx.restore();}
    else ctx.fillText('🦄', u.x, u.y);
  }
  ctx.globalAlpha = 1;
}

/* ══ CLOUDS + RAIN (batched, no per-drop shadowBlur) ═════════════════════ */
const clouds = [], drops = [];
function makeCloud() {
  return { x:R(-130,W+130), y:R(-110,-15),
           vx:R(0.2,1.2)*(Math.random()<0.5?1:-1), vy:R(0.2,0.9),
           w:R(110,280), h:R(50,105), alpha:R(0.5,0.85), t:0 };
}
function makeDrop(c) {
  return { x:c.x+R(-c.w*0.4,c.w*0.4), y:c.y+c.h*0.35,
           vy:R(5,12), len:R(10,28), c:RC(), a:R(0.55,1) };
}
function drawClouds() {
  if (clouds.length < 8 && Math.random() < 0.008) clouds.push(makeCloud());
  for (let i = clouds.length-1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.vx; c.y += c.vy; c.t++;
    if (c.t%3===0 && drops.length<180) drops.push(makeDrop(c));
    if (c.y > H+180) { clouds.splice(i,1); continue; }
    ctx.globalAlpha = c.alpha;
    ctx.fillStyle = '#e0d8ff';
    ctx.beginPath();
    const {x,y,w,h} = c;
    ctx.ellipse(x,       y,       w*.38,h*.5,  0,0,Math.PI*2);
    ctx.ellipse(x+w*.27, y-h*.17, w*.30,h*.44, 0,0,Math.PI*2);
    ctx.ellipse(x-w*.27, y-h*.12, w*.26,h*.36, 0,0,Math.PI*2);
    ctx.ellipse(x+w*.10, y+h*.13, w*.40,h*.40, 0,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function drawDrops() {
  for (let i = drops.length-1; i >= 0; i--) {
    const d = drops[i];
    d.y += d.vy;
    if (d.y > H+40) { drops.splice(i,1); continue; }
    ctx.globalAlpha = d.a;
    ctx.strokeStyle = d.c; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y+d.len); ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/* ══ CONFETTI ════════════════════════════════════════════════════════════ */
const confetti = [];
function makeConfetti(x,y,burst) {
  return { x:x??R(0,W), y:y??-20,
    vx:burst?R(-7,7):R(-1.2,1.2), vy:burst?R(-9,-2):R(1.2,3),
    a:burst?1:R(0.3,0.9), c:RC(), size:R(5,11),
    rot:Math.random()*Math.PI*2, rotV:R(-0.12,0.12),
    wb:Math.random()*Math.PI*2, wbV:R(0.02,0.07),
    shape:RI(0,3), burst:!!burst };
}
for (let i=0;i<50;i++){const p=makeConfetti();p.y=R(0,H);confetti.push(p);}
function drawConfetti() {
  if (confetti.length < 100 && Math.random()<0.4) confetti.push(makeConfetti());
  for (let i = confetti.length-1; i >= 0; i--) {
    const p = confetti[i];
    p.wb += p.wbV; p.x += p.vx+Math.sin(p.wb)*0.5; p.y += p.vy; p.rot += p.rotV;
    if (p.burst) p.vy += 0.28;
    if (p.y > H*0.83) p.a -= 0.02;
    if (p.a <= 0 || p.y > H+30) { confetti.splice(i,1); continue; }
    ctx.save(); ctx.globalAlpha = p.a * 0.8;
    ctx.fillStyle = p.c; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
    if (p.shape===0)      ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
    else if(p.shape===1){ ctx.beginPath();ctx.arc(0,0,p.size/2,0,Math.PI*2);ctx.fill(); }
    else {
      ctx.beginPath();
      for(let j=0;j<5;j++){const a=(j*4*Math.PI)/5-Math.PI/2;
        j===0?ctx.moveTo(Math.cos(a)*p.size/2,Math.sin(a)*p.size/2):ctx.lineTo(Math.cos(a)*p.size/2,Math.sin(a)*p.size/2);}
      ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }
}

/* ══ FIREWORKS ═══════════════════════════════════════════════════════════ */
const fireworks = [];
function explode(x,y,big) {
  const c = PC(); const n = big?60:40;
  for(let i=0;i<n;i++){
    const a=(i/n)*Math.PI*2, sp=R(big?3:1.5,big?10:6);
    fireworks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,a:1,c,size:R(1.5,4),tail:[]});
  }
}
function drawFireworks() {
  if (fireworks.length < 80 && Math.random()<0.007) explode(R(W*.1,W*.9),R(H*.05,H*.55));
  for(let i=fireworks.length-1;i>=0;i--){
    const f=fireworks[i];
    f.tail.push({x:f.x,y:f.y});
    if(f.tail.length>7)f.tail.shift();
    f.x+=f.vx;f.y+=f.vy;f.vy+=0.1;f.vx*=0.97;f.a-=0.024;
    if(f.a<=0){fireworks.splice(i,1);continue;}
    for(let j=1;j<f.tail.length;j++){
      ctx.globalAlpha=(j/f.tail.length)*f.a*0.5;
      ctx.strokeStyle=f.c;ctx.lineWidth=1.2;
      ctx.beginPath();ctx.moveTo(f.tail[j-1].x,f.tail[j-1].y);ctx.lineTo(f.tail[j].x,f.tail[j].y);ctx.stroke();
    }
    ctx.globalAlpha=f.a;ctx.fillStyle=f.c;
    ctx.beginPath();ctx.arc(f.x,f.y,f.size,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
}

/* ══ BUBBLES ══════════════════════════════════════════════════════════════ */
const bubbles = [];
function makeBubble(){
  return {x:R(0,W),y:H+30,vy:-R(1,3),vx:R(-0.7,0.7),r:R(8,40),
          a:R(0.2,0.55),wb:Math.random()*Math.PI*2,wbV:R(0.015,0.04),hue:RI(0,360)};
}
function drawBubbles(){
  if(bubbles.length<30&&Math.random()<0.1)bubbles.push(makeBubble());
  for(let i=bubbles.length-1;i>=0;i--){
    const b=bubbles[i];
    b.wb+=b.wbV;b.x+=b.vx+Math.sin(b.wb)*0.6;b.y+=b.vy;b.hue=(b.hue+0.6)%360;
    if(b.y<-b.r*2){bubbles.splice(i,1);continue;}
    ctx.globalAlpha=b.a;
    const g=ctx.createRadialGradient(b.x-b.r*.3,b.y-b.r*.3,b.r*.1,b.x,b.y,b.r);
    g.addColorStop(0,`hsla(${b.hue},100%,90%,0.7)`);
    g.addColorStop(1,`hsla(${b.hue},100%,50%,0.05)`);
    ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fillStyle=g;ctx.fill();
    ctx.strokeStyle=`hsla(${b.hue},100%,75%,0.4)`;ctx.lineWidth=1.2;ctx.stroke();
  }
  ctx.globalAlpha=1;
}

/* ══ FLOATING HEARTS ═════════════════════════════════════════════════════ */
const hearts = [];
function makeHeart(x,y){
  return {x:x??R(0,W),y:y??H+30,vx:R(-1,1),vy:-R(1.2,3.5),
          size:R(14,36),a:R(0.5,0.9),wb:Math.random()*Math.PI*2,wbV:R(0.02,0.05),
          g:HEART_EMOJIS[RI(0,HEART_EMOJIS.length)]};
}
function drawHearts(){
  if(hearts.length<25&&Math.random()<0.06)hearts.push(makeHeart());
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=hearts.length-1;i>=0;i--){
    const h=hearts[i];
    h.wb+=h.wbV;h.x+=h.vx+Math.sin(h.wb)*0.7;h.y+=h.vy;
    if(h.y<H*.35)h.a-=0.009;
    if(h.a<=0||h.y<-70){hearts.splice(i,1);continue;}
    ctx.globalAlpha=h.a;ctx.font=`${h.size}px serif`;ctx.fillText(h.g,h.x,h.y);
  }
  ctx.globalAlpha=1;
}

/* ══ GLITTER (no shadowBlur – just alpha-fading squares) ════════════════ */
const glitter = Array.from({length:50},()=>({
  x:R(0,W),y:R(0,H),a:0,aDir:1,aV:R(0.04,0.1),size:R(1,3),c:RC()
}));
function drawGlitter(){
  for(const g of glitter){
    g.a+=g.aV*g.aDir;
    if(g.a>1){g.aDir=-1;}
    if(g.a<0){g.aDir=1;g.x=R(0,W);g.y=R(0,H);g.c=RC();}
    ctx.globalAlpha=g.a*0.7;ctx.fillStyle=g.c;
    ctx.fillRect(g.x,g.y,g.size,g.size);
  }
  ctx.globalAlpha=1;
}

/* ══ FLOATING PRIDE WORDS ════════════════════════════════════════════════ */
const WORDS=['LOVE','PRIDE','GAY','🏳️‍🌈','JOY','QUEER','✨','LOVE WINS','💖','UC9'];
const fwords=[];
function drawWords(){
  if(fwords.length<10&&Math.random()<0.02)fwords.push({
    x:R(0,W),y:H+35,vx:R(-0.3,0.3),vy:-R(0.6,1.6),a:R(0.35,0.75),
    size:RI(13,30),word:WORDS[RI(0,WORDS.length)],c:RC(),
    wb:Math.random()*Math.PI*2,wbV:R(0.01,0.03)
  });
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(let i=fwords.length-1;i>=0;i--){
    const w=fwords[i];
    w.wb+=w.wbV;w.x+=w.vx+Math.sin(w.wb)*0.3;w.y+=w.vy;
    if(w.y<H*.28)w.a-=0.007;
    if(w.a<=0||w.y<-55){fwords.splice(i,1);continue;}
    ctx.globalAlpha=w.a;ctx.fillStyle=w.c;
    ctx.font=`bold ${w.size}px 'Playfair Display',serif`;
    ctx.fillText(w.word,w.x,w.y);
  }
  ctx.globalAlpha=1;
}

/* ══ PULSING RINGS ═══════════════════════════════════════════════════════ */
const rings=[];
function drawRings(){
  if(rings.length<6&&Math.random()<0.035)rings.push({x:R(0,W),y:R(0,H),r:0,vr:R(2,5),c:PC(),a:0.8});
  for(let i=rings.length-1;i>=0;i--){
    const rg=rings[i];rg.r+=rg.vr;rg.a-=0.013;
    if(rg.a<=0){rings.splice(i,1);continue;}
    ctx.globalAlpha=rg.a;ctx.strokeStyle=rg.c;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(rg.x,rg.y,rg.r,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalAlpha=1;
}

/* ══ MAIN LOOP ═══════════════════════════════════════════════════════════ */
let lastTime = 0;
function render(ts) {
  if (!paused) {
    // Throttle to ~50fps to reduce CPU load
    if (ts - lastTime >= 20) {
      lastTime = ts;
      ctx.clearRect(0,0,W,H);
      drawStars();
      drawGlitter();
      drawRings();
      drawRainbows();
      drawClouds();
      drawDrops();
      drawUnicorns();
      drawShooters();
      drawFireworks();
      drawBubbles();
      drawHearts();
      drawWords();
      drawConfetti();
    }
  }
  requestAnimationFrame(render);
}

// Seed
for(let i=0;i<5;i++)clouds.push(makeCloud());
for(let i=0;i<3;i++)rainbows.push(makeRainbow());
for(let i=0;i<2;i++)unicorns.push(makeUnicorn());
explode(W*.3,H*.3);explode(W*.7,H*.25);
requestAnimationFrame(render);

/* ══ CLICK BURST ═════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  explode(e.clientX, e.clientY);
  for(let i=0;i<18;i++) confetti.push(makeConfetti(e.clientX,e.clientY,true));
  for(let i=0;i<4;i++){const h=makeHeart(e.clientX+R(-35,35),e.clientY);h.vy=-R(3,7);h.a=1;hearts.push(h);}
  rings.push({x:e.clientX,y:e.clientY,r:0,vr:6,c:PC(),a:1});
});

/* ══ SPARKLE CURSOR (throttled, 1 per move) ══════════════════════════════ */
let lastSpark=0;
document.addEventListener('mousemove', e => {
  const now=Date.now(); if(now-lastSpark<40)return; lastSpark=now;
  const span=document.createElement('span');
  const col=RC();
  span.textContent=SPARKLE_CHARS[RI(0,SPARKLE_CHARS.length)];
  span.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;color:${col};font-size:${R(9,18)}px;pointer-events:none;z-index:99998;user-select:none;transform:translate(-50%,-50%);transition:opacity .5s,transform .5s;`;
  document.body.appendChild(span);
  requestAnimationFrame(()=>{span.style.opacity='0';span.style.transform=`translate(-50%,-${R(28,60)}px) scale(0.1) rotate(${R(-160,160)}deg)`;});
  setTimeout(()=>span.remove(),580);
});

/* ══ FADE-IN ON SCROLL ═══════════════════════════════════════════════════ */
const fadeStyle=document.createElement('style');
fadeStyle.textContent=`.fade-in{opacity:0;transform:translateY(26px);transition:opacity .55s,transform .55s}.fade-in.visible{opacity:1;transform:none}`;
document.head.appendChild(fadeStyle);
document.querySelectorAll('.card,.blog-post,.flag-card,.meme-card,.stat,.mini-flag,.value-card,.vibe-pill')
  .forEach(el=>{el.classList.add('fade-in');});
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
