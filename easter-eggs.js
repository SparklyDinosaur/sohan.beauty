/* ══════════════════════════════════════════════════════════════════════════
   sohan.beauty — Easter Eggs 🥚
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Toast notification system ───────────────────────────────────────────── */
function toast(html, duration=4000, big=false) {
  const t = document.createElement('div');
  t.innerHTML = html;
  t.style.cssText = `
    position:fixed;bottom:${24+document.querySelectorAll('.ee-toast').length*80}px;
    left:50%;transform:translateX(-50%) translateY(20px);
    background:linear-gradient(135deg,#1a0030,#000d28);
    border:2px solid transparent;
    background-clip:padding-box;
    padding:${big?'24px 36px':'14px 28px'};
    border-radius:50px;font-family:'Inter',sans-serif;
    color:#f0f0ff;text-align:center;z-index:999999;
    box-shadow:0 0 40px rgba(170,0,255,0.5),0 8px 32px rgba(0,0,0,0.5);
    font-size:${big?'1.1rem':'0.95rem'};font-weight:600;
    transition:opacity .4s,transform .4s;opacity:0;pointer-events:none;
    max-width:90vw;line-height:1.5;
  `;
  t.classList.add('ee-toast');
  // Rainbow border via outline trick
  t.style.outline = '2px solid';
  t.style.outlineColor = 'transparent';
  document.body.appendChild(t);
  requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';});
  setTimeout(()=>{
    t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';
    setTimeout(()=>t.remove(),500);
  }, duration);
  return t;
}

function bigModal(emoji, title, body) {
  const overlay = document.createElement('div');
  overlay.style.cssText=`position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:999998;display:flex;align-items:center;justify-content:center;padding:24px;`;
  overlay.innerHTML=`
    <div style="background:linear-gradient(135deg,#0f0020,#000d28);border:2px solid;border-image:linear-gradient(135deg,#FF003C,#FF8C00,#FFE500,#00C853,#2979FF,#AA00FF) 1;border-radius:24px;max-width:480px;width:100%;padding:40px 36px;text-align:center;position:relative;box-shadow:0 0 80px rgba(170,0,255,0.4);">
      <div style="font-size:3.5rem;margin-bottom:16px">${emoji}</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;margin-bottom:14px;background:linear-gradient(90deg,#FF4DAD,#AA00FF,#2979FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${title}</h2>
      <p style="color:#b0b0cc;font-size:1rem;line-height:1.65;margin-bottom:24px;">${body}</p>
      <button onclick="this.closest('[style*=fixed]').remove()" style="padding:12px 32px;background:linear-gradient(135deg,#FF1493,#AA00FF);color:#fff;border:none;border-radius:50px;font-size:0.95rem;font-weight:700;cursor:pointer;">Close ✨</button>
    </div>
  `;
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── Achievement badge ───────────────────────────────────────────────────── */
function achievement(emoji, title, desc) {
  const a = document.createElement('div');
  a.innerHTML=`
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="font-size:2rem">${emoji}</div>
      <div>
        <div style="font-size:0.72rem;color:#AA00FF;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Achievement Unlocked!</div>
        <div style="font-size:1rem;font-weight:700;margin:2px 0">${title}</div>
        <div style="font-size:0.82rem;color:#8888bb">${desc}</div>
      </div>
    </div>`;
  a.style.cssText=`position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#1a0030,#000d28);border:2px solid #AA00FF;border-radius:16px;padding:16px 20px;z-index:999999;color:#f0f0ff;box-shadow:0 0 30px rgba(170,0,255,0.5);transition:opacity .4s,transform .4s;opacity:0;transform:translateX(60px);min-width:280px;max-width:340px;`;
  document.body.appendChild(a);
  requestAnimationFrame(()=>{a.style.opacity='1';a.style.transform='translateX(0)';});
  setTimeout(()=>{a.style.opacity='0';a.style.transform='translateX(60px)';setTimeout(()=>a.remove(),500);},5000);
}

/* ── Mini confetti burst at position ─────────────────────────────────────── */
function miniConfetti(x, y) {
  const cols=['#FF003C','#FF8C00','#FFE500','#00C853','#2979FF','#AA00FF','#FF4DAD'];
  for(let i=0;i<16;i++){
    const span=document.createElement('span');
    span.textContent=['✦','★','♥','✿','●'][Math.floor(Math.random()*5)];
    const col=cols[Math.floor(Math.random()*cols.length)];
    const angle=Math.random()*Math.PI*2;
    const dist=40+Math.random()*60;
    span.style.cssText=`position:fixed;left:${x}px;top:${y}px;color:${col};font-size:${10+Math.random()*14}px;pointer-events:none;z-index:999997;user-select:none;transform:translate(-50%,-50%);transition:opacity .7s,transform .7s;`;
    document.body.appendChild(span);
    requestAnimationFrame(()=>{
      span.style.opacity='0';
      span.style.transform=`translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0.2)`;
    });
    setTimeout(()=>span.remove(),800);
  }
}

/* ════════════════════════════════════════════════════════════════════════════
   EASTER EGG DEFINITIONS
   ════════════════════════════════════════════════════════════════════════════ */

/* ─── 1. KONAMI CODE → Ultra Gay Mode ────────────────────────────────────── */
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
document.addEventListener('keydown', e => {
  if(e.key===KONAMI[konamiIdx]) konamiIdx++;
  else konamiIdx=0;
  if(konamiIdx===KONAMI.length){
    konamiIdx=0;
    bigModal('🌈','ULTRA GAY MODE ACTIVATED','Congratulations. You found the secret code. The rainbow powers have been unleashed. You are now officially operating at maximum gay capacity. Sohan is very proud of you. 🦄💖🏳️‍🌈');
    achievement('🌈','Rainbow God','You entered the Konami code on a gay pride website. Legendary.');
    // Flood hearts
    if(window.__prideHearts) for(let i=0;i<20;i++) window.__prideHearts.push(null);
    document.body.style.animation='ultra-gay 0.5s ease infinite';
    const s=document.createElement('style');
    s.textContent='@keyframes ultra-gay{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
    document.head.appendChild(s);
    setTimeout(()=>{document.body.style.animation='';s.remove();},8000);
  }
});

/* ─── 2. Type "GAY" anywhere ─────────────────────────────────────────────── */
let typedBuffer='';
document.addEventListener('keydown', e => {
  typedBuffer=(typedBuffer+e.key.toLowerCase()).slice(-6);
  if(typedBuffer.includes('gay')){
    typedBuffer='';
    toast('🏳️‍🌈 YES!! Gay!! That\'s us!! 💅',3000);
    miniConfetti(window.innerWidth/2, window.innerHeight/2);
  }
  if(typedBuffer.includes('uc9')){
    typedBuffer='';
    bigModal('🏳️‍🌈','UC9 FOREVER!','You typed UC9! That\'s the spirit. UC9 is the chosen family that never lets you down. Sohan loves every single one of you. Unconditionally and loudly. 💜');
    achievement('🏳️‍🌈','UC9 Rider','You typed UC9 on the keyboard. One of us. One of us.');
  }
  if(typedBuffer.includes('sohan')){
    typedBuffer='';
    toast('👑 THE MAN HIMSELF. Iconic. We stan. 💅',3500);
  }
});

/* ─── 3. Nav logo — click 5 times ────────────────────────────────────────── */
const navLogo=document.querySelector('.nav-logo');
if(navLogo){
  let logoClicks=0, logoTimer;
  navLogo.addEventListener('click', e => {
    e.preventDefault();
    logoClicks++;
    clearTimeout(logoTimer);
    if(logoClicks>=5){
      logoClicks=0;
      bigModal('💎','You found a secret!','The logo holds power. You clicked it 5 times and unlocked the hidden truth: sohan.beauty is the most gay website on the entire internet. Officially certified. 🏳️‍🌈✨');
      achievement('💎','Logo Whisperer','Clicked the logo 5 times. Persistent. Dedicated. Gay.');
    } else {
      toast(`🌈 ${logoClicks}/5 clicks... keep going...`,1200);
      logoTimer=setTimeout(()=>logoClicks=0,3000);
    }
  });
}

/* ─── 4. Click Sohan's hero photo ────────────────────────────────────────── */
const heroPhoto=document.querySelector('.hero-photo');
if(heroPhoto){
  let photoClicks=0;
  const photoMsgs=[
    '💅 Looking absolutely iconic.',
    '👑 That\'s the main character energy right there.',
    '🌈 The gays are thriving.',
    '✨ Certified gay icon.',
    '🦄 This man has RANGE.',
  ];
  heroPhoto.style.cursor='pointer';
  heroPhoto.addEventListener('click', e => {
    toast(photoMsgs[photoClicks % photoMsgs.length],3000);
    miniConfetti(e.clientX, e.clientY);
    photoClicks++;
    if(photoClicks===5) achievement('📸','Biggest Fan','Clicked Sohan\'s photo 5 times. We respect the dedication.');
  });
}

/* ─── 5. Click the rainbow bar ────────────────────────────────────────────── */
document.querySelectorAll('.rainbow-bar').forEach(bar => {
  bar.style.cursor='pointer';
  let discoActive=false;
  bar.addEventListener('click', () => {
    if(discoActive)return;
    discoActive=true;
    toast('🪩 DISCO MODE! 🪩',2500);
    const s=document.createElement('style');
    s.id='disco-style';
    s.textContent=`body{animation:disco-flash .3s ease infinite}@keyframes disco-flash{0%{filter:brightness(1) hue-rotate(0deg)}50%{filter:brightness(1.3) hue-rotate(90deg)}100%{filter:brightness(1) hue-rotate(180deg)}}`;
    document.head.appendChild(s);
    setTimeout(()=>{s.remove();discoActive=false;},3000);
    achievement('🪩','Disco Queen','Activated Disco Mode. The gays go HARD.');
  });
});

/* ─── 6. Click the quote / blockquote ────────────────────────────────────── */
const bq=document.querySelector('blockquote');
if(bq){
  const quotes=[
    {text:'"Be yourself; everyone else is already taken."',cite:'— Oscar Wilde'},
    {text:'"We\'re not going backwards."',cite:'— every queer person, always'},
    {text:'"I\'m not gay but my boyfriend is."',cite:'— classic'},
    {text:'"Normal is a setting on a washing machine."',cite:'— unknown gay genius'},
    {text:'"I didn\'t choose the gay life. The gay life chose me. And I said yes immediately."',cite:'— Sohan'},
  ];
  let qIdx=0;
  bq.style.cursor='pointer';
  bq.title='Click for more quotes';
  bq.addEventListener('click', () => {
    qIdx=(qIdx+1)%quotes.length;
    const q=quotes[qIdx];
    bq.innerHTML=`${q.text}<cite>${q.cite}</cite>`;
    miniConfetti(bq.getBoundingClientRect().left+bq.offsetWidth/2, bq.getBoundingClientRect().top+40);
    if(qIdx===quotes.length-1) achievement('💬','Quote Collector','Cycled through all the hidden quotes. A scholar.');
  });
  toast('💬 Psst — the quote is clickable',3000);
}

/* ─── 7. Click the ∞ stat ─────────────────────────────────────────────────── */
document.querySelectorAll('.stat-num').forEach(el => {
  if(el.textContent.trim()==='∞'){
    el.style.cursor='pointer';
    el.addEventListener('click', e => {
      bigModal('♾️','Infinite Love','No limit. No ceiling. No cap. The amount of love in UC9 literally cannot be quantified by modern mathematics. Scientists have tried. They gave up and joined the group chat instead. 💜');
      miniConfetti(e.clientX, e.clientY);
    });
  }
  if(el.textContent.trim()==='100%'){
    el.style.cursor='pointer';
    el.addEventListener('click', e => {
      toast('💯 Not 99%. Not 101%. 100% gay, 100% of the time, 100% not sorry.',4500);
      miniConfetti(e.clientX, e.clientY);
    });
  }
  if(el.textContent.trim()==='12+'){
    el.style.cursor='pointer';
    el.addEventListener('click', e => {
      toast('🏳️‍🌈 12 flags and counting. New ones welcome. The more the gayer.',3500);
      miniConfetti(e.clientX, e.clientY);
    });
  }
});

/* ─── 8. Triple-click the page heading ────────────────────────────────────── */
const pageH1=document.querySelector('.page-header h1');
if(pageH1){
  let h1Clicks=0,h1Timer;
  pageH1.style.cursor='default';
  pageH1.addEventListener('click', e => {
    h1Clicks++;clearTimeout(h1Timer);
    h1Timer=setTimeout(()=>h1Clicks=0,800);
    if(h1Clicks>=3){
      h1Clicks=0;
      toast('🎉 TRIPLE CLICK DETECTED. You\'re a natural. 🏳️‍🌈',3000);
      miniConfetti(e.clientX,e.clientY);
      achievement('👆','Triple Threat','Triple-clicked a heading. Unnecessary. Iconic. Gay.');
    }
  });
}

/* ─── 9. Click specific flag cards ───────────────────────────────────────── */
const flagMessages = {
  'Rainbow Pride':  '🌈 THE original. The flag that started it all. Gilbert Baker in 1978. Legend. Icon. Served.',
  'Gay Men\'s Pride': '💙 Sohan\'s flag. The greens and blues are giving nature, water, and absolute slay.',
  'Transgender Pride': '🏳️‍⚧️ Trans rights are human rights. Monica Helms designed this in 1999 and it is PERFECT.',
  'Bisexual Pride': '💜 Bi people exist! They\'re not confused! They\'re just twice as fabulous!',
  'Pansexual Pride': '💛 Attraction without limits. Love is love is love is love. Pan people are built different (better).',
  'Non-Binary Pride': '💛 Outside the binary. Above the binary. The binary doesn\'t even know what hit it.',
  'Asexual Pride': '🖤 The ace community belongs here. Always. Aromantic, grey-ace, demi — you\'re all perfect.',
  'Lesbian Pride': '🧡 The sunset flag. Stunning. The lesbians said "we want ORANGE" and they were right.',
};
document.querySelectorAll('.flag-card').forEach(card => {
  const name=card.querySelector('h3')?.textContent?.trim();
  if(flagMessages[name]){
    card.style.cursor='pointer';
    card.addEventListener('click', e => {
      e.stopPropagation();
      toast(flagMessages[name],4500);
      miniConfetti(e.clientX,e.clientY);
    });
  }
});

/* ─── 10. Click footer ────────────────────────────────────────────────────── */
const footer=document.querySelector('.footer');
if(footer){
  let footerClicks=0;
  footer.addEventListener('click', e => {
    footerClicks++;
    if(footerClicks===1) toast('👀 Snooping around the footer?',2500);
    if(footerClicks===3) toast('🕵️ Still here?',2000);
    if(footerClicks===5) {
      bigModal('🏆','Footer Champion','You clicked the footer 5 times. Nobody does this. You\'re literally the first person. Sohan is going to hear about this. Congratulations on your completely unique and gay achievement. 🏳️‍🌈');
      achievement('🏆','Footer Champion','Clicked the footer 5 times. Elite behavior.');
    }
    if(footerClicks%10===0&&footerClicks>5) toast(`🤯 ${footerClicks} footer clicks. You need help. Lovingly. 💜`,3000);
    miniConfetti(e.clientX,e.clientY);
  });
}

/* ─── 11. Click meme emojis 3 times for bonus meme ──────────────────────── */
const bonusMemes=[
  {e:'💀',text:'Gay culture is having a full breakdown and then someone sends you a meme and you\'re fine again.'},
  {e:'😭',text:'The way gay people say "oh she\'s NOT straight" about a fictional character 4 years before the show confirms it.'},
  {e:'🧠',text:'Gay sixth sense: knowing someone\'s queer before they\'ve even figured it out themselves.'},
  {e:'👏',text:'"Coming out" implies you were ever "in". We were always this gay. The world just wasn\'t looking.'},
  {e:'🌈',text:'Gay people didn\'t invent brunch but we absolutely perfected it.'},
];
document.querySelectorAll('.meme-emoji').forEach((em,idx) => {
  let clicks=0,timer;
  em.style.cursor='pointer';
  em.addEventListener('click', e => {
    e.stopPropagation();
    clicks++;clearTimeout(timer);
    timer=setTimeout(()=>clicks=0,1200);
    if(clicks>=3){
      clicks=0;
      const bm=bonusMemes[idx%bonusMemes.length];
      bigModal(bm.e,'Bonus Meme Unlocked!',bm.text);
      achievement('😂','Meme Archaeologist','Found a hidden meme by triple-clicking. Elite comedic taste.');
    } else {
      miniConfetti(e.clientX,e.clientY);
    }
  });
});

/* ─── 12. Idle for 25 seconds → mysterious message ───────────────────────── */
let idleTimer=setTimeout(()=>{
  toast('👀 Still here? Sohan appreciates the dedication. 🏳️‍🌈',4000);
},25000);
['mousemove','keydown','scroll','click','touchstart'].forEach(ev=>{
  document.addEventListener(ev,()=>{
    clearTimeout(idleTimer);
    idleTimer=setTimeout(()=>{
      toast('✨ Psst. Have you tried the Konami code? ↑↑↓↓←→←→BA 👀',5000);
    },30000);
  },{passive:true});
});

/* ─── 13. Scroll to very bottom → achievement ────────────────────────────── */
let scrollAchieved=false;
window.addEventListener('scroll', () => {
  if(scrollAchieved)return;
  const atBottom=window.scrollY+window.innerHeight>=document.body.scrollHeight-20;
  if(atBottom){
    scrollAchieved=true;
    achievement('📜','Bottom Scroller','You scrolled all the way to the bottom. Thorough. Gay. We love it.');
  }
},{passive:true});

/* ─── 14. Right-click custom message ─────────────────────────────────────── */
document.addEventListener('contextmenu', e => {
  e.preventDefault();
  toast('🌈 Right-click? On THIS website? Bold. Also — no secrets here. They\'re all left-click. 💅',3500);
});

/* ─── 15. UC9 logo / arch SVG easter egg ─────────────────────────────────── */
const uc9Logo=document.querySelector('.uc9-svg-logo, .uc9-arch-svg');
if(uc9Logo){
  uc9Logo.style.cursor='pointer';
  uc9Logo.addEventListener('click', e => {
    bigModal('🏳️‍🌈','UC9 Secret Unlocked!','You clicked the sacred UC9 symbol. This means you\'re officially part of the group. Welcome. There\'s a 4,000-message group chat, a mandatory karaoke night, and unconditional love waiting for you. 💜🏳️‍🌈✨');
    miniConfetti(e.clientX,e.clientY);
    achievement('🔮','UC9 Initiate','Clicked the UC9 logo. You\'re one of us now.');
  });
}

/* ─── 16. Gallery image click ─────────────────────────────────────────────── */
const galMsgs=[
  '✨ The vibes. Immaculate.',
  '💅 Camera loves him.',
  '🏳️‍🌈 Gay excellence personified.',
  '👑 Main character. No notes.',
  '🌈 Sohan has LEFT the chat. In the best way.',
];
document.querySelectorAll('.gallery-img').forEach((img,i)=>{
  img.addEventListener('click',()=> toast(galMsgs[i%galMsgs.length],3000));
});

/* ─── 17. Pong link easter egg ────────────────────────────────────────────── */
const pongLink=document.querySelector('a[href="pong.html"]');
if(pongLink){
  pongLink.addEventListener('click',()=>{
    toast('🏓 Good luck... you\'ll need it. Sohan NEVER loses.',3000);
  });
}
