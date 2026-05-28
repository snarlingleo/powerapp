/* ═══════════════════════════════════════════════════════════
   UI PREMIUM FINAL — PowerApp
   Version consolidée — zéro doublon — zéro conflit
   ═══════════════════════════════════════════════════════════ */
'use strict';

// ═══════════════════════════════════════════════════════════
// 1. CSS GLOBAL
// ═══════════════════════════════════════════════════════════
(function injectCSS() {
  if (document.getElementById('css-pm-final')) return;
  const s = document.createElement('style');
  s.id = 'css-pm-final';
  s.textContent = `
    :root {
      --fd-indigo:   #4b4bf9;
      --fd-midnight: #09092d;
      --fd-lemon:    #f9ef77;
      --fd-coral:    #ff8d96;
      --fd-lavender: #bfa1ff;
      --fd-mint:     #8bf0bb;
    }

    /* ── Animations ── */
    @keyframes pm-fadeUp {
      from { opacity:0; transform:translateY(14px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes pm-fadeIn {
      from { opacity:0; }
      to   { opacity:1; }
    }
    @keyframes pm-pulse {
      0%,100% { opacity:1; }
      50%     { opacity:.4; }
    }
    @keyframes pm-progressFill {
      from { width:0%; }
    }
    @keyframes pm-countUp {
      from { opacity:0; transform:scale(.5); }
      to   { opacity:1; transform:scale(1);  }
    }
    @keyframes pm-slideIn {
      from { opacity:0; transform:translateX(-10px); }
      to   { opacity:1; transform:translateX(0);     }
    }
    @keyframes pm-slideUp {
      from { opacity:0; transform:translateY(20px); }
      to   { opacity:1; transform:translateY(0);    }
    }
    @keyframes pm-ringPop {
      0%   { transform:scale(.8); opacity:0; }
      60%  { transform:scale(1.05);           }
      100% { transform:scale(1);  opacity:1; }
    }
    @keyframes pm-toastIn {
      from { opacity:0; transform:translateX(110%) scale(.8); }
      to   { opacity:1; transform:translateX(0)    scale(1);  }
    }
    @keyframes pm-toastOut {
      from { opacity:1; transform:translateX(0);    }
      to   { opacity:0; transform:translateX(110%); }
    }
    @keyframes pm-avatarPulse {
      0%,100% { box-shadow:0 0 20px rgba(75,75,249,.4); }
      50%     { box-shadow:0 0 36px rgba(75,75,249,.7); }
    }
    @keyframes pm-liveDot {
      0%,100% { opacity:1;  transform:scale(1);   }
      50%     { opacity:.3; transform:scale(1.5); }
    }
    @keyframes pm-xpShine {
      0%   { left:-100%; }
      100% { left:200%;  }
    }
    @keyframes pm-confettiFall {
      0%   { transform:translateY(0)     rotate(0deg);   opacity:1; }
      100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
    }
    @keyframes pm-typingDot {
      0%,100% { transform:translateY(0);  opacity:.4; }
      50%     { transform:translateY(-5px); opacity:1; }
    }
    @keyframes pm-soundWave {
      0%,100% { transform:scaleY(1);  }
      50%     { transform:scaleY(.3); }
    }
    @keyframes pm-shake {
      0%,100% { transform:translateX(0);  }
      20%     { transform:translateX(-8px); }
      40%     { transform:translateX(8px);  }
      60%     { transform:translateX(-5px); }
      80%     { transform:translateX(5px);  }
    }
    @keyframes pm-splash {
      0%   { opacity:0; transform:scale(.8); }
      60%  { opacity:1; transform:scale(1.05); }
      100% { opacity:1; transform:scale(1);    }
    }
    @keyframes pm-navPop {
      0%   { transform:translateY(0) scale(1);    }
      40%  { transform:translateY(-6px) scale(1.2); }
      100% { transform:translateY(0) scale(1);    }
    }

    /* ── Composants ── */
    .pm-card {
      background:var(--bg-card, rgba(255,255,255,.04));
      border:1px solid var(--border-color, rgba(255,255,255,.08));
      border-radius:18px; padding:16px; margin-bottom:12px;
    }
    .pm-section-title {
      font-size:.58rem; font-weight:800;
      text-transform:uppercase; letter-spacing:.1em;
      color:rgba(255,255,255,.3);
      display:flex; align-items:center; gap:8px;
      margin:16px 0 10px;
    }
    .pm-section-title::after {
      content:''; flex:1; height:1px;
      background:rgba(255,255,255,.06);
    }
    .pm-chip {
      display:inline-flex; align-items:center;
      padding:4px 10px; border-radius:99px;
      font-size:.6rem; font-weight:700;
      text-transform:uppercase; letter-spacing:.04em;
      background:rgba(75,75,249,.2); color:var(--fd-lavender);
      border:1px solid rgba(75,75,249,.3);
    }
    .pm-progress {
      height:5px; background:rgba(255,255,255,.06);
      border-radius:99px; overflow:hidden;
    }
    .pm-progress-fill {
      height:100%; border-radius:99px;
      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
      animation:pm-progressFill .8s ease forwards;
    }
    .pm-btn {
      border:none; border-radius:99px; font-weight:700;
      cursor:pointer; transition:all .2s; font-size:.85rem;
    }
    .pm-btn-primary {
      background:var(--fd-indigo); color:white; padding:12px 22px;
      box-shadow:0 4px 20px rgba(75,75,249,.4);
    }
    .pm-btn-primary:hover  { transform:scale(1.03); }
    .pm-btn-primary:active { transform:scale(.97);  }
    .pm-btn-ghost {
      background:rgba(255,255,255,.06);
      border:1px solid rgba(255,255,255,.12) !important;
      color:rgba(255,255,255,.6); padding:10px 18px;
    }
    .pm-input {
      width:100%; padding:10px 4px; font-size:1.3rem;
      font-weight:800; text-align:center;
      background:rgba(255,255,255,.06);
      border:2px solid rgba(255,255,255,.1);
      border-radius:12px; color:white; outline:none;
      transition:border-color .2s; -webkit-appearance:none;
      box-sizing:border-box;
    }
    .pm-input:focus { border-color:var(--fd-indigo); }
    .pm-serie {
      padding:14px;
      background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px; margin-bottom:8px;
      transition:all .3s;
    }
    .pm-serie.active {
      border-color:rgba(75,75,249,.4);
      background:rgba(75,75,249,.06);
    }
    .pm-serie.done {
      border-color:rgba(139,240,187,.2);
      background:rgba(139,240,187,.04);
      opacity:.75;
    }
    .pm-rpe-btn {
      flex:1; padding:8px 2px; font-size:.78rem; font-weight:700;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:8px; color:rgba(255,255,255,.4);
      cursor:pointer; transition:all .15s; text-align:center;
    }
    .pm-rpe-btn.active {
      background:rgba(75,75,249,.25);
      border-color:rgba(75,75,249,.4); color:white;
    }
    .pm-ob-option {
      display:flex; align-items:center; gap:12px;
      padding:14px 16px;
      background:rgba(255,255,255,.04);
      border:2px solid rgba(255,255,255,.1);
      border-radius:16px; cursor:pointer;
      transition:all .2s; margin-bottom:8px;
    }
    .pm-ob-option.selected {
      background:rgba(75,75,249,.15);
      border-color:rgba(75,75,249,.4);
    }
    .pm-ob-option:active { transform:scale(.98); }
    .pm-menu-item {
      display:flex; align-items:center; gap:10px;
      padding:13px 14px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.07);
      border-radius:14px; cursor:pointer; transition:all .18s;
    }
    .pm-badge {
      display:inline-flex; flex-direction:column;
      align-items:center; gap:4px; padding:12px 8px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:14px; text-align:center;
      transition:all .2s; cursor:pointer;
    }
    .pm-badge.unlocked {
      background:rgba(249,239,119,.08);
      border-color:rgba(249,239,119,.3);
    }
    .pm-badge:hover { transform:scale(1.05); }
    .pm-defi-card {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px; padding:16px; margin-bottom:10px;
      transition:all .2s; animation:pm-fadeUp .3s ease both;
    }
    .pm-defi-card:hover {
      border-color:rgba(75,75,249,.3);
      transform:translateY(-2px);
    }
    .pm-defi-card.complete {
      background:rgba(139,240,187,.06);
      border-color:rgba(139,240,187,.25);
    }
    .pm-macro-bar {
      height:8px; border-radius:99px; overflow:hidden;
      background:rgba(255,255,255,.06); margin-bottom:12px;
    }
    .pm-macro-fill {
      height:100%; border-radius:99px;
      animation:pm-progressFill .8s ease forwards;
    }
    .pm-xp-bar {
      height:10px; border-radius:99px;
      background:rgba(255,255,255,.06);
      overflow:hidden; position:relative;
    }
    .pm-xp-fill {
      height:100%; border-radius:99px;
      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-lavender));
      animation:pm-progressFill .8s ease forwards;
      box-shadow:0 0 8px rgba(75,75,249,.4);
    }
    .pm-xp-shine {
      position:absolute; top:0; left:-100%;
      width:60%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
      animation:pm-xpShine 2s ease infinite;
    }
    .pm-chat-bubble {
      max-width:85%; padding:12px 14px; border-radius:18px;
      margin-bottom:8px; font-size:.82rem; line-height:1.55;
      animation:pm-fadeUp .3s ease;
    }
    .pm-chat-bubble.ai {
      background:rgba(75,75,249,.12);
      border:1px solid rgba(75,75,249,.25);
      border-bottom-left-radius:4px;
      color:rgba(255,255,255,.85); align-self:flex-start;
    }
    .pm-chat-bubble.user {
      background:rgba(75,75,249,.3);
      border:1px solid rgba(75,75,249,.4);
      border-bottom-right-radius:4px;
      color:white; align-self:flex-end; margin-left:auto;
    }
    .pm-chat-typing {
      display:flex; gap:4px; padding:12px 14px;
      background:rgba(75,75,249,.08);
      border:1px solid rgba(75,75,249,.2);
      border-radius:18px; border-bottom-left-radius:4px;
      width:fit-content; margin-bottom:8px;
    }
    .pm-chat-typing span {
      width:6px; height:6px; border-radius:50%;
      background:var(--fd-indigo);
      animation:pm-typingDot 1.2s ease-in-out infinite;
    }
    .pm-chat-typing span:nth-child(2) { animation-delay:.2s; }
    .pm-chat-typing span:nth-child(3) { animation-delay:.4s; }
    .pm-confetti {
      position:fixed; top:0; left:0;
      width:100%; height:100%;
      pointer-events:none; z-index:9998; overflow:hidden;
    }
    .pm-confetti-piece {
      position:absolute; top:-10px;
      animation:pm-confettiFall linear forwards;
    }
    .pm-timer-fullscreen {
      position:fixed; top:0; left:0;
      width:100%; height:100%;
      background:rgba(7,7,20,.97);
      backdrop-filter:blur(20px);
      z-index:500; display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      animation:pm-fadeIn .3s ease;
    }

    /* ── Toast ── */
    #pm-toast-container {
      position:fixed;
      top:calc(var(--header-height,56px) + 8px);
      right:12px; z-index:9999;
      display:flex; flex-direction:column; gap:8px;
      pointer-events:none; max-width:300px;
    }
    .pm-toast {
      padding:12px 16px; border-radius:14px;
      display:flex; align-items:flex-start; gap:10px;
      font-size:.82rem; font-weight:700;
      pointer-events:all;
      animation:pm-toastIn .35s cubic-bezier(.34,1.56,.64,1);
      box-shadow:0 8px 24px rgba(0,0,0,.4);
    }
    .pm-toast.success {
      background:rgba(139,240,187,.15);
      border:1px solid rgba(139,240,187,.35);
      color:var(--fd-mint);
    }
    .pm-toast.error {
      background:rgba(255,141,150,.15);
      border:1px solid rgba(255,141,150,.35);
      color:var(--fd-coral);
    }
    .pm-toast.pr {
      background:linear-gradient(135deg,rgba(249,239,119,.2),rgba(249,239,119,.05));
      border:1px solid rgba(249,239,119,.4);
      color:var(--fd-lemon);
    }
    .pm-toast.info {
      background:rgba(75,75,249,.15);
      border:1px solid rgba(75,75,249,.3);
      color:#818cf8;
    }

    /* ── Splash ── */
    #pm-splash {
      position:fixed; top:0; left:0;
      width:100%; height:100%;
      background:var(--bg-app, #070714);
      z-index:9999; display:flex;
      flex-direction:column;
      align-items:center; justify-content:center;
      gap:16px;
    }
    #pm-splash-logo {
      font-size:4rem;
      animation:pm-splash .6s cubic-bezier(.34,1.56,.64,1);
    }
    #pm-splash-bar {
      width:160px; height:4px;
      background:rgba(255,255,255,.08);
      border-radius:99px; overflow:hidden;
    }
    #pm-splash-fill {
      height:100%; width:0%;
      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
      border-radius:99px; transition:width .1s linear;
      box-shadow:0 0 8px var(--fd-indigo);
    }

    /* ── Navbar premium ── */
    #pm-navbar {
      position:fixed; bottom:0; left:50%;
      transform:translateX(-50%);
      width:100%; max-width:480px;
      background:rgba(9,9,45,.95);
      backdrop-filter:blur(20px);
      border-top:1px solid rgba(255,255,255,.08);
      z-index:100; padding:8px 0 max(8px,env(safe-area-inset-bottom));
      display:flex; justify-content:space-around; align-items:center;
    }
    .pm-nav-item {
      display:flex; flex-direction:column;
      align-items:center; gap:3px;
      padding:6px 12px; border-radius:14px;
      cursor:pointer; transition:all .2s;
      position:relative; min-width:52px;
      -webkit-tap-highlight-color:transparent;
    }
    .pm-nav-item.active {
      background:rgba(75,75,249,.15);
    }
    .pm-nav-item.active .pm-nav-icon {
      animation:pm-navPop .3s ease;
    }
    .pm-nav-icon {
      font-size:1.3rem; line-height:1;
      transition:transform .2s;
    }
    .pm-nav-label {
      font-size:.48rem; font-weight:700;
      text-transform:uppercase; letter-spacing:.06em;
      color:rgba(255,255,255,.4); transition:color .2s;
    }
    .pm-nav-item.active .pm-nav-label {
      color:var(--fd-indigo);
    }
    .pm-nav-dot {
      position:absolute; top:4px; right:8px;
      width:7px; height:7px; border-radius:50%;
      background:var(--fd-coral);
      border:2px solid rgba(9,9,45,.95);
    }
    .pm-nav-indicator {
      position:absolute; bottom:-8px; left:50%;
      transform:translateX(-50%);
      width:20px; height:3px; border-radius:99px;
      background:var(--fd-indigo);
      box-shadow:0 0 8px var(--fd-indigo);
      opacity:0; transition:opacity .2s;
    }
    .pm-nav-item.active .pm-nav-indicator { opacity:1; }

    /* ── Header premium ── */
    #pm-header {
      position:fixed; top:0; left:50%;
      transform:translateX(-50%);
      width:100%; max-width:480px;
      background:rgba(9,9,45,.95);
      backdrop-filter:blur(20px);
      border-bottom:1px solid rgba(255,255,255,.08);
      z-index:100; padding:10px 16px;
      display:flex; align-items:center;
      justify-content:space-between; gap:12px;
    }

    /* ── Onboarding ── */
    #onboarding-screen {
      position:fixed; top:0; left:0;
      width:100%; height:100%;
      background:var(--bg-app, #070714);
      z-index:200; overflow-y:auto;
      -webkit-overflow-scrolling:touch;
    }
    .ob-wrap {
      max-width:480px; margin:0 auto;
      padding:20px 16px 40px;
      min-height:100vh;
      display:flex; flex-direction:column;
    }
    .ob-step-dot {
      height:6px; border-radius:99px;
      background:rgba(255,255,255,.1); transition:all .3s;
    }
    .ob-step-dot.active { width:24px; background:var(--fd-indigo); }
    .ob-step-dot.done   { width:8px;  background:rgba(75,75,249,.4); }
    .ob-step-dot.todo   { width:8px;  }
    .ob-input {
      width:100%; padding:16px; font-size:1rem; font-weight:600;
      background:rgba(255,255,255,.06);
      border:2px solid rgba(255,255,255,.1);
      border-radius:16px; color:white; outline:none;
      transition:border-color .2s; margin-bottom:10px;
      -webkit-appearance:none; box-sizing:border-box;
    }
    .ob-input:focus { border-color:var(--fd-indigo); }
    .ob-input::placeholder { color:rgba(255,255,255,.25); }
    .ob-btn-next {
      width:100%; padding:17px;
      background:var(--fd-indigo); border:none;
      border-radius:99px; font-size:.95rem;
      font-weight:800; color:white; cursor:pointer;
      box-shadow:0 4px 20px rgba(75,75,249,.4);
      transition:all .2s; margin-bottom:8px;
    }
    .ob-btn-next:active { transform:scale(.98); }
    .ob-btn-back {
      width:100%; padding:12px; background:none; border:none;
      font-size:.82rem; color:rgba(255,255,255,.4); cursor:pointer;
    }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// 2. HELPERS — PM object
// ═══════════════════════════════════════════════════════════
const PM = {

  get(fn, fallback) {
    try { const r = fn(); return (r !== undefined && r !== null) ? r : fallback; }
    catch(e) { return fallback; }
  },

  vol(v) {
    if (!v || isNaN(v)) return '0kg';
    if (v >= 1000000) return (v/1000).toFixed(0)+'T';
    if (v >= 1000)    return (v/1000).toFixed(1)+'T';
    return Math.round(v)+'kg';
  },

  dateFR() {
    return new Date().toLocaleDateString('fr-FR',{
      weekday:'long', day:'numeric', month:'short'
    });
  },

  salut() {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  },

  sectionTitle(label, extra = '') {
    return `<div class="pm-section-title">${label}${extra}</div>`;
  },

  toast(msg, type = 'success', duree = 2800) {
    let c = document.getElementById('pm-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'pm-toast-container';
      document.body.appendChild(c);
    }
    const icons = { success:'✅', error:'❌', pr:'🏆', info:'ℹ️' };
    const parts = msg.split('\n');
    const t = document.createElement('div');
    t.className = `pm-toast ${type}`;
    t.innerHTML = `
      <span style="font-size:1.1rem;flex-shrink:0">${icons[type]||'💬'}</span>
      <div style="flex:1">
        <div style="font-weight:800">${parts[0]}</div>
        ${parts[1]
          ? `<div style="font-size:.72rem;opacity:.8;margin-top:2px">${parts[1]}</div>`
          : ''}
      </div>
      <button onclick="this.parentElement.remove()"
              style="background:none;border:none;color:currentColor;
                     font-size:.9rem;cursor:pointer;opacity:.5;flex-shrink:0">✕</button>`;
    c.appendChild(t);
    if (c.children.length > 4) c.children[0].remove();
    setTimeout(() => {
      if (!t.parentElement) return;
      t.style.animation = 'pm-toastOut .3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duree);
  },

  confetti(duree = 2500) {
    const colors = ['#4b4bf9','#8bf0bb','#f9ef77','#ff8d96','#bfa1ff','#fff'];
    const div = document.createElement('div');
    div.className = 'pm-confetti';
    document.body.appendChild(div);
    for (let i = 0; i < 80; i++) {
      const p = document.createElement('div');
      p.className = 'pm-confetti-piece';
      p.style.cssText = `
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${4+Math.random()*8}px; height:${4+Math.random()*8}px;
        border-radius:${Math.random()>.5?'50%':'2px'};
        animation-duration:${1.5+Math.random()*2}s;
        animation-delay:${Math.random()*.8}s;`;
      div.appendChild(p);
    }
    setTimeout(() => div.remove(), duree + 1000);
  },

  inputDelta(id, delta) {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = Math.max(0, Math.round((parseFloat(el.value)||0) + delta) * 1);
    if (id === 'pm-poids')
      el.value = Math.max(0, Math.round(((parseFloat(el.value)||0)) * 4) / 4);
  },

  setRPE(val, el) {
    document.querySelectorAll('#pm-rpe-row .pm-rpe-btn')
      .forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    window._PM_RPE = val;
  }
};

// ═══════════════════════════════════════════════════════════
// 3. SONS UI
// ═══════════════════════════════════════════════════════════
PM.sons = {
  _ctx: null,
  _get() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext||window.webkitAudioContext)();
      } catch(e) {}
    }
    return this._ctx;
  },
  _play(freq, type='sine', dur=.12, vol=.25, delay=0) {
    const ctx = this._get(); if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      g.gain.setValueAtTime(vol, ctx.currentTime + delay);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+delay+dur);
      o.start(ctx.currentTime + delay);
      o.stop(ctx.currentTime + delay + dur);
    } catch(e) {}
  },
  clic()   { this._play(600,'sine',.06,.1); },
  succes() {
    this._play(440,'sine',.1,.2);
    this._play(554,'sine',.1,.2,.1);
    this._play(659,'sine',.15,.2,.2);
  },
  erreur() { this._play(180,'square',.2,.2); },
  timer()  {
    this._play(880,'sine',.1,.3);
    this._play(880,'sine',.1,.3,.15);
    this._play(1320,'sine',.2,.3,.3);
  },
  pr()     { [261,329,392,523].forEach((f,i)=>this._play(f,'sine',.2,.25,i*.08)); },
  niveau() { [523,659,784,1047].forEach((f,i)=>this._play(f,'sine',.25,.3,i*.1)); }
};

// ═══════════════════════════════════════════════════════════
// 4. SPLASH SCREEN
// ═══════════════════════════════════════════════════════════
PM.splash = {
  show() {
    if (document.getElementById('pm-splash')) return;
    const div = document.createElement('div');
    div.id = 'pm-splash';
    div.innerHTML = `
      <div id="pm-splash-logo">⚡</div>
      <div style="font-size:1.4rem;font-weight:800;
                  background:linear-gradient(135deg,#fff,var(--fd-lavender));
                  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                  background-clip:text;margin-bottom:4px">
        PowerApp
      </div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-bottom:20px">
        Ton coach fitness personnel
      </div>
      <div id="pm-splash-bar">
        <div id="pm-splash-fill"></div>
      </div>
      <div id="pm-splash-msg"
           style="font-size:.65rem;color:rgba(255,255,255,.3);margin-top:10px">
        Chargement...
      </div>`;
    document.body.appendChild(div);

    const msgs = [
      'Chargement du programme...',
      'Analyse de tes données...',
      'Préparation du Coach IA...',
      'Presque prêt...'
    ];
    let pct = 0;
    const fill = document.getElementById('pm-splash-fill');
    const msg  = document.getElementById('pm-splash-msg');
    const iv = setInterval(() => {
      pct += Math.random() * 18 + 8;
      if (pct > 100) pct = 100;
      if (fill) fill.style.width = pct + '%';
      if (msg)  msg.textContent  = msgs[Math.floor((pct/100)*msgs.length)] || msgs[3];
      if (pct >= 100) clearInterval(iv);
    }, 120);
  },

  hide() {
    const div = document.getElementById('pm-splash');
    if (!div) return;
    div.style.transition = 'opacity .4s ease';
    div.style.opacity    = '0';
    setTimeout(() => div.remove(), 400);
  }
};

// ═══════════════════════════════════════════════════════════
// 5. NAVBAR PREMIUM
// ═══════════════════════════════════════════════════════════
PM.navbar = {
  items: [
    { id:'home',     icon:'🏠', label:'Home'     },
    { id:'training', icon:'📅', label:'Training' },
    { id:'live',     icon:'⚡', label:'Live'     },
    { id:'stats',    icon:'📊', label:'Stats'    },
    { id:'profil',   icon:'👤', label:'Profil'   }
  ],
  _active: 'home',

  render() {
    let nav = document.getElementById('pm-navbar');
    if (!nav) {
      nav = document.createElement('div');
      nav.id = 'pm-navbar';
      document.body.appendChild(nav);
    }
    nav.innerHTML = this.items.map(item => `
      <div class="pm-nav-item ${this._active===item.id?'active':''}"
           onclick="PM.navbar.goto('${item.id}')"
           id="pm-nav-${item.id}">
        <div class="pm-nav-icon">${item.icon}</div>
        <div class="pm-nav-label">${item.label}</div>
        <div class="pm-nav-indicator"></div>
      </div>`).join('');
  },

  goto(page) {
    this._active = page;
    // Update active state sans re-render complet
    document.querySelectorAll('.pm-nav-item').forEach(el => {
      el.classList.remove('active');
    });
    const el = document.getElementById(`pm-nav-${page}`);
    if (el) el.classList.add('active');
    PM.sons.clic();
    try { navigator.vibrate?.(20); } catch(e) {}
    try { naviguer(page); } catch(e) {
      console.warn('[PM.navbar] naviguer() non trouvé:', e);
    }
  },

  setActive(page) {
    this._active = page;
    document.querySelectorAll('.pm-nav-item').forEach(el => {
      el.classList.remove('active');
    });
    const el = document.getElementById(`pm-nav-${page}`);
    if (el) el.classList.add('active');
  }
};

// ═══════════════════════════════════════════════════════════
// 6. HEADER PREMIUM
// ═══════════════════════════════════════════════════════════
PM.header = {
  render() {
    let h = document.getElementById('pm-header');
    if (!h) {
      h = document.createElement('div');
      h.id = 'pm-header';
      document.body.appendChild(h);
    }

    const profil = PM.get(() => Tracker.getProfil(), { nom:'Athlète', avatar:'💪' });
    const xp     = PM.get(() => Gamification.getXP(),
                     { total:0, pourcentage:0,
                       niveau:{ numero:1, emoji:'💪', nom:'Débutant' } });
    const streak = PM.get(() => Tracker.getStreak(), { count:0 });

    h.innerHTML = `
      <!-- Logo + titre -->
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:1.3rem">⚡</div>
        <div>
          <div style="font-size:.88rem;font-weight:800;line-height:1">
            PowerApp
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.4)">
            ${PM.dateFR()}
          </div>
        </div>
      </div>

      <!-- XP mini + streak -->
      <div style="flex:1;max-width:140px;padding:0 8px">
        <div style="display:flex;justify-content:space-between;
                    font-size:.55rem;color:rgba(255,255,255,.4);
                    margin-bottom:3px">
          <span>${xp.niveau.emoji} Niv.${xp.niveau.numero}</span>
          <span style="color:var(--fd-indigo)">${xp.total} XP</span>
        </div>
        <div class="pm-xp-bar" style="height:5px">
          <div class="pm-xp-fill" style="width:${xp.pourcentage}%"></div>
        </div>
      </div>

      <!-- Streak + avatar -->
      <div style="display:flex;align-items:center;gap:8px">
        <div style="display:flex;align-items:center;gap:3px;
                    padding:4px 8px;border-radius:99px;
                    background:rgba(249,239,119,.1);
                    border:1px solid rgba(249,239,119,.2)">
          <span style="font-size:.75rem">🔥</span>
          <span style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
            ${streak.count}
          </span>
        </div>
        <div onclick="PM.navbar.goto('profil')"
             style="width:32px;height:32px;border-radius:50%;
                    background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                    display:flex;align-items:center;justify-content:center;
                    font-size:1rem;cursor:pointer;
                    box-shadow:0 0 10px rgba(75,75,249,.4);
                    border:2px solid rgba(75,75,249,.3)">
          ${profil.avatar || '💪'}
        </div>
      </div>`;
  },

  update() { this.render(); }
};

// ═══════════════════════════════════════════════════════════
// 7. TIMER PLEIN ÉCRAN
// ═══════════════════════════════════════════════════════════
PM.timer = {
  _iv: null, _restant: 0, _total: 0,

  ouvrir(sec = 90, label = 'Repos') {
    this.fermer();
    this._total = this._restant = sec;
    const div = document.createElement('div');
    div.id = 'pm-timer-fs';
    div.className = 'pm-timer-fullscreen';
    div.innerHTML = `
      <div style="text-align:center;padding:32px 24px;width:100%;max-width:340px">
        <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.15em;color:var(--fd-mint);margin-bottom:20px">
          😴 ${label.toUpperCase()}
        </div>
        <div style="position:relative;width:200px;height:200px;margin:0 auto 24px">
          <svg width="200" height="200" style="transform:rotate(-90deg)">
            <circle cx="100" cy="100" r="88" fill="none"
                    stroke="rgba(139,240,187,.08)" stroke-width="12"/>
            <circle id="pm-fs-ring" cx="100" cy="100" r="88" fill="none"
                    stroke="var(--fd-mint)" stroke-width="12"
                    stroke-linecap="round" stroke-dasharray="553"
                    stroke-dashoffset="0"
                    style="filter:drop-shadow(0 0 10px var(--fd-mint));
                           transition:stroke-dashoffset 1s linear,
                                      stroke .3s,filter .3s"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div id="pm-fs-count"
                 style="font-size:4rem;font-weight:800;color:var(--fd-mint);
                        font-variant-numeric:tabular-nums;line-height:1;
                        transition:color .3s">
              ${sec}
            </div>
            <div style="font-size:.7rem;color:rgba(255,255,255,.4)">sec</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-bottom:18px">
          ${[15,30,60].map(s=>`
            <button onclick="PM.timer.ajouter(${s})"
                    style="padding:9px 14px;background:rgba(255,255,255,.06);
                           border:1px solid rgba(255,255,255,.1);border-radius:12px;
                           font-size:.78rem;font-weight:700;
                           color:rgba(255,255,255,.6);cursor:pointer">
              +${s}s
            </button>`).join('')}
        </div>
        <div style="display:flex;gap:10px;justify-content:center">
          <button onclick="PM.timer.passer()"
                  style="padding:14px 28px;background:var(--fd-indigo);border:none;
                         border-radius:99px;font-size:.9rem;font-weight:800;
                         color:white;cursor:pointer;
                         box-shadow:0 4px 20px rgba(75,75,249,.4)">
            ⚡ Passer
          </button>
          <button onclick="PM.timer.fermer()"
                  style="padding:14px 20px;background:rgba(255,255,255,.06);
                         border:1px solid rgba(255,255,255,.1);
                         border-radius:99px;font-size:.9rem;
                         color:rgba(255,255,255,.5);cursor:pointer">
            ✕
          </button>
        </div>
        <div style="font-size:.6rem;color:rgba(255,255,255,.2);margin-top:14px">
          📳 Son + vibration à la fin
        </div>
      </div>`;
    document.body.appendChild(div);
    PM.sons.clic();

    const total = 553;
    this._iv = setInterval(() => {
      this._restant--;
      const count = document.getElementById('pm-fs-count');
      const ring  = document.getElementById('pm-fs-ring');
      if (count) count.textContent = Math.max(0, this._restant);
      if (ring) {
        ring.style.strokeDashoffset =
          total * (1 - this._restant / this._total);
      }
      if (this._restant <= 10 && this._restant > 0) {
        if (ring)  { ring.style.stroke='var(--fd-coral)'; ring.style.filter='drop-shadow(0 0 10px var(--fd-coral))'; }
        if (count) count.style.color = 'var(--fd-coral)';
      }
      if (this._restant <= 0) {
        clearInterval(this._iv);
        PM.sons.timer();
        try { navigator.vibrate?.([300,100,300]); } catch(e) {}
        PM.toast('⚡ Repos terminé — À toi !', 'info');
        setTimeout(() => this.fermer(), 600);
      }
    }, 1000);
  },

  ajouter(sec) { this._restant += sec; PM.sons.clic(); },
  passer()     { clearInterval(this._iv); this.fermer(); PM.sons.clic(); },
  fermer()     { clearInterval(this._iv); document.getElementById('pm-timer-fs')?.remove(); }
};

PM.demarrerRepos = sec => PM.timer.ouvrir(sec, 'Repos entre séries');

// ═══════════════════════════════════════════════════════════
// 8. PAGE HOME v2
// ═══════════════════════════════════════════════════════════
function _rendreHome(container) {
  const profil  = PM.get(() => Tracker.getProfil(), { nom:'Athlète', avatar:'💪' });
  const seance  = PM.get(() => Programme.getSeanceduJour(), null);
  const infos   = PM.get(() => Programme.getInfosProgramme(),
                    { label:'S1', cycle:1, phase:{ emoji:'🌱', nom:'Reprise' } });
  const streak  = PM.get(() => Tracker.getStreak(), { count:0 });
  const xp      = PM.get(() => Gamification.getXP(),
                    { total:0, pourcentage:0,
                      niveau:{ emoji:'💪', numero:1, nom:'Débutant' } });
  const analyse = PM.get(() => Coach.getAnalyseSemaine(),
                    { seances:0, objectif:4, volume:0, rpe:0 });
  const msg     = PM.get(() => Coach.getMessageDuJour(),
                    { emoji:'💡', message:'Bonne séance aujourd\'hui !' });
  const planning= PM.get(() => Programme.getSeancesSemaine(), []);
  const defis   = PM.get(() =>
                    (Defis.mettreAJourProgression()||[])
                    .filter(d=>!d.complete).slice(0,2), []);

  const sd = PM.get(() => Tracker.getSeanceDuJour(), null);
  const seanceFaite = !!(sd?.terminee || sd?.series?.length > 0);
  const statsSd = {
    volume: sd?.volumeTotal    || 0,
    series: sd?.series?.length || 0,
    prs:    (sd?.prs||[]).length
  };

  const streakDash = Math.min(132, streak.count * 5);
  const xpDash     = Math.round((xp.pourcentage / 100) * 132);

  // Hero séance
  const heroHTML = seanceFaite && seance ? `
    <div style="background:linear-gradient(135deg,rgba(139,240,187,.18),rgba(139,240,187,.05) 60%,rgba(75,75,249,.04));
                border:1px solid rgba(139,240,187,.4);border-radius:22px;padding:20px;
                margin-bottom:14px;position:relative;overflow:hidden;
                box-shadow:0 4px 24px rgba(139,240,187,.1);animation:pm-fadeUp .4s .2s ease both">
      <div style="position:absolute;top:-40px;right:-30px;width:150px;height:150px;
                  background:radial-gradient(circle,rgba(139,240,187,.15),transparent 70%);
                  pointer-events:none"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;position:relative;z-index:1">
        <div style="width:7px;height:7px;border-radius:50%;
                    background:var(--fd-mint);box-shadow:0 0 8px var(--fd-mint)"></div>
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.12em;color:var(--fd-mint)">✅ Séance complétée !</div>
      </div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:14px;position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;
                  margin-bottom:14px;position:relative;z-index:1">
        ${[
          {emoji:'📦',val:PM.vol(statsSd.volume),label:'Volume', c:'var(--fd-mint)'  },
          {emoji:'💪',val:statsSd.series,         label:'Séries', c:'var(--fd-indigo)'},
          {emoji:'🏆',val:statsSd.prs||'—',       label:'Records',c:'var(--fd-lemon)' }
        ].map(s=>`
          <div style="background:rgba(255,255,255,.05);border:1px solid rgba(139,240,187,.15);
                      border-radius:12px;padding:10px 6px;text-align:center">
            <div style="font-size:.8rem;margin-bottom:2px">${s.emoji}</div>
            <div style="font-size:.92rem;font-weight:800;color:${s.c}">${s.val}</div>
            <div style="font-size:.5rem;color:rgba(255,255,255,.4);margin-top:2px;
                        text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:8px;position:relative;z-index:1">
        <button onclick="naviguer('live')"
                style="flex:1;padding:10px;background:rgba(139,240,187,.15);
                       border:1px solid rgba(139,240,187,.3);border-radius:99px;
                       font-size:.75rem;font-weight:700;color:var(--fd-mint);cursor:pointer">
          📊 Résumé
        </button>
        <button onclick="naviguer('stats')"
                style="flex:1;padding:10px;background:rgba(75,75,249,.12);
                       border:1px solid rgba(75,75,249,.25);border-radius:99px;
                       font-size:.75rem;font-weight:700;color:var(--fd-indigo);cursor:pointer">
          📈 Stats
        </button>
      </div>
    </div>` :

  seance ? `
    <div style="background:linear-gradient(135deg,rgba(75,75,249,.22),rgba(75,75,249,.07) 55%,rgba(191,161,255,.05));
                border:1px solid rgba(75,75,249,.4);border-radius:22px;padding:20px;
                margin-bottom:14px;position:relative;overflow:hidden;
                box-shadow:0 4px 24px rgba(75,75,249,.2);animation:pm-fadeUp .4s .2s ease both">
      <div style="position:absolute;top:-50px;right:-30px;width:180px;height:180px;
                  background:radial-gradient(circle,rgba(75,75,249,.2),transparent 70%);
                  pointer-events:none"></div>
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;position:relative;z-index:1">
        <div style="width:7px;height:7px;border-radius:50%;background:var(--fd-indigo);
                    box-shadow:0 0 8px var(--fd-indigo);animation:pm-pulse 2s infinite"></div>
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.12em;color:var(--fd-indigo)">Séance du jour</div>
      </div>
      <div style="font-size:1.4rem;font-weight:800;letter-spacing:-.02em;
                  margin-bottom:4px;position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="font-size:.75rem;color:rgba(255,255,255,.45);
                  margin-bottom:16px;position:relative;z-index:1">
        ~${seance.duree_estimee||60}min · ${seance.exercices?.length||0} exercices
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;
                  position:relative;z-index:1;flex-wrap:wrap;gap:10px">
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${(seance.muscles||[]).map(m=>`<span class="pm-chip">${m}</span>`).join('')}
        </div>
        <button onclick="naviguer('live')"
                style="padding:12px 20px;background:var(--fd-indigo);color:white;
                       border:none;border-radius:99px;font-size:.82rem;font-weight:700;
                       cursor:pointer;box-shadow:0 4px 20px rgba(75,75,249,.5);
                       transition:transform .2s"
                onmouseenter="this.style.transform='scale(1.05)'"
                onmouseleave="this.style.transform=''">
          ▶ Démarrer
        </button>
      </div>
    </div>` :

  `<div style="border-radius:22px;padding:20px;margin-bottom:14px;
               background:rgba(139,240,187,.06);border:1px solid rgba(139,240,187,.2);
               text-align:center;animation:pm-fadeUp .4s .2s ease both">
    <div style="font-size:2rem;margin-bottom:6px">😴</div>
    <div style="font-weight:700;font-size:1rem">Jour de repos</div>
    <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:4px">
      Récupère bien 💆
    </div>
  </div>`;

  container.innerHTML = `

    <!-- Greeting -->
    <div style="padding:8px 0 18px;animation:pm-fadeUp .3s ease">
      <div style="font-size:.68rem;color:rgba(255,255,255,.4);font-weight:600;
                  margin-bottom:5px;display:flex;align-items:center;gap:6px">
        <div style="width:6px;height:6px;border-radius:50%;background:var(--fd-mint);
                    box-shadow:0 0 6px var(--fd-mint);animation:pm-pulse 2s infinite"></div>
        ${PM.dateFR()} · ${infos.label} · Cycle ${infos.cycle}
      </div>
      <div style="font-size:1.7rem;font-weight:800;letter-spacing:-.03em;line-height:1.1">
        ${PM.salut()},
        <span style="background:linear-gradient(135deg,#fff,var(--fd-lavender));
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                     background-clip:text">${profil.nom}</span>
        ${profil.avatar||'💪'}
      </div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:5px">
        ${infos.phase?.emoji||'🌱'} ${infos.phase?.nom||'Reprise'} · ${xp.niveau.nom}
      </div>
    </div>

    <!-- Rings -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">

      <div onclick="naviguer('stats')"
           style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                  border-radius:18px;padding:14px;display:flex;align-items:center;gap:12px;
                  cursor:pointer;transition:all .25s;animation:pm-fadeUp .4s ease"
           onmouseenter="this.style.borderColor='rgba(249,239,119,.35)';this.style.transform='translateY(-2px)'"
           onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
        <svg width="50" height="50" viewBox="0 0 50 50" style="flex-shrink:0">
          <circle cx="25" cy="25" r="21" fill="none" stroke="rgba(249,239,119,.12)" stroke-width="5"/>
          <circle cx="25" cy="25" r="21" fill="none" stroke="#f9ef77" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="${streakDash} ${132-streakDash}"
                  transform="rotate(-90 25 25)"
                  style="filter:drop-shadow(0 0 4px #f9ef77)"/>
          <text x="25" y="30" text-anchor="middle" fill="#f9ef77" font-size="13">🔥</text>
        </svg>
        <div>
          <div style="font-size:1.5rem;font-weight:800;color:var(--fd-lemon);line-height:1">
            ${streak.count}
          </div>
          <div style="font-size:.58rem;color:rgba(255,255,255,.4);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">
            Streak
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">jours</div>
        </div>
      </div>

      <div onclick="naviguer('gamification')"
           style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                  border-radius:18px;padding:14px;display:flex;align-items:center;gap:12px;
                  cursor:pointer;transition:all .25s;animation:pm-fadeUp .4s .1s ease both"
           onmouseenter="this.style.borderColor='rgba(75,75,249,.35)';this.style.transform='translateY(-2px)'"
           onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
        <svg width="50" height="50" viewBox="0 0 50 50" style="flex-shrink:0">
          <circle cx="25" cy="25" r="21" fill="none" stroke="rgba(75,75,249,.15)" stroke-width="5"/>
          <circle cx="25" cy="25" r="21" fill="none" stroke="#4b4bf9" stroke-width="5"
                  stroke-linecap="round"
                  stroke-dasharray="${xpDash} ${132-xpDash}"
                  transform="rotate(-90 25 25)"
                  style="filter:drop-shadow(0 0 4px #4b4bf9)"/>
          <text x="25" y="29" text-anchor="middle" fill="#bfa1ff" font-size="9" font-weight="800">
            N${xp.niveau.numero}
          </text>
        </svg>
        <div>
          <div style="font-size:1.3rem;font-weight:800;color:var(--fd-lavender);line-height:1">
            ${xp.total}
          </div>
          <div style="font-size:.58rem;color:rgba(255,255,255,.4);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">
            XP total
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">${xp.niveau.nom}</div>
        </div>
      </div>
    </div>

    <!-- Hero séance -->
    ${heroHTML}

    <!-- Stats semaine -->
    ${PM.sectionTitle('📊 Cette semaine')}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      ${[
        {emoji:'📅',val:`${analyse.seances}/${analyse.objectif}`,label:'Séances',c:'var(--fd-indigo)',d:'0s'  },
        {emoji:'📦',val:PM.vol(analyse.volume),                  label:'Volume', c:'var(--fd-mint)',  d:'.08s'},
        {emoji:'😤',val:analyse.rpe>0?`${analyse.rpe}/10`:'—',  label:'RPE',    c:'var(--fd-lemon)', d:'.16s'}
      ].map(s=>`
        <div onclick="naviguer('stats')"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 8px;text-align:center;cursor:pointer;
                    transition:all .2s;animation:pm-fadeUp .4s ${s.d} ease both"
             onmouseenter="this.style.transform='translateY(-3px)'"
             onmouseleave="this.style.transform=''">
          <div style="font-size:.82rem;margin-bottom:4px">${s.emoji}</div>
          <div style="font-size:.95rem;font-weight:800;color:${s.c}">${s.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);margin-top:3px;
                      text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Planning -->
    ${planning.length > 0 ? `
      ${PM.sectionTitle('📅 Planning semaine',
        `<span style="font-weight:700;color:var(--fd-mint)">
          ${Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)}%
        </span>`)}
      <div class="pm-card">
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:8px">
          ${planning.map(j=>`
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <div onclick="PlanningEditor?.ouvrirChoixSeance(${j.jour})"
                   style="width:36px;height:36px;border-radius:10px;
                          display:flex;align-items:center;justify-content:center;
                          font-size:.8rem;font-weight:700;cursor:pointer;transition:all .2s;
                          ${j.estAujourdhui
                            ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,.5)'
                            : j.seance
                              ? 'background:rgba(75,75,249,.2);border:1px solid rgba(75,75,249,.4);color:var(--fd-lavender)'
                              : 'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.3)'}"
                   onmouseenter="this.style.transform='scale(1.1)'"
                   onmouseleave="this.style.transform=''">
                ${j.estAujourdhui ? '▶' : j.seance ? j.seance.emoji : '·'}
              </div>
              <div style="font-size:.46rem;color:rgba(255,255,255,.3);
                          text-transform:uppercase;font-weight:600">${j.label}</div>
            </div>`).join('')}
        </div>
        <div class="pm-progress">
          <div class="pm-progress-fill"
               style="width:${Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)}%">
          </div>
        </div>
      </div>` : ''}

    <!-- Timers repos -->
    ${PM.sectionTitle('⏱ Timers repos')}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
      ${[
        {icon:'⚡',val:'45s', label:'Express',sec:45, c:'#4b4bf9'},
        {icon:'💪',val:'60s', label:'Normal', sec:60, c:'#8bf0bb'},
        {icon:'🏋️',val:'90s', label:'Force',  sec:90, c:'#f9ef77'},
        {icon:'🔥',val:'2m',  label:'Lourd',  sec:120,c:'#ff8d96'}
      ].map((t,i)=>`
        <div onclick="PM.timer.ouvrir(${t.sec},'Repos ${t.label}')"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 4px;text-align:center;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .4s ${.3+i*.06}s ease both"
             onmouseenter="this.style.background='${t.c}12';this.style.borderColor='${t.c}33';this.style.transform='scale(.95)'"
             onmouseleave="this.style.background='rgba(255,255,255,.04)';this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
          <div style="font-size:1.1rem;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:.8rem;font-weight:800;color:${t.c}">${t.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);
                      text-transform:uppercase">${t.label}</div>
        </div>`).join('')}
    </div>

    <!-- Défis -->
    ${defis.length > 0 ? `
      ${PM.sectionTitle('🏆 Défis en cours')}
      <div class="pm-card" style="cursor:pointer" onclick="naviguer('defis')">
        ${defis.map((d,i) => {
          const pct = Math.round((d.progression/Math.max(d.cible,1))*100);
          return `
            <div style="margin-bottom:${i<defis.length-1?'10px':'0'}">
              <div style="display:flex;justify-content:space-between;
                          font-size:.78rem;margin-bottom:5px">
                <span>${d.emoji} ${d.titre}</span>
                <span style="color:var(--fd-lemon);font-weight:700">
                  ${d.progression}/${d.cible}
                </span>
              </div>
              <div class="pm-progress">
                <div class="pm-progress-fill"
                     style="width:${pct}%;
                            background:linear-gradient(90deg,var(--fd-lemon),var(--fd-mint));
                            box-shadow:0 0 6px var(--fd-lemon)">
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

    <!-- Coach -->
    <div onclick="naviguer('coach')"
         style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                border-left:3px solid var(--fd-lavender);border-radius:18px;
                padding:14px 16px;margin-bottom:14px;cursor:pointer;
                transition:all .2s;animation:pm-fadeUp .4s .5s ease both"
         onmouseenter="this.style.transform='translateX(4px)'"
         onmouseleave="this.style.transform=''">
      <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--fd-lavender);margin-bottom:5px">
        ${msg.emoji} Coach du jour
      </div>
      <p style="font-size:.82rem;color:rgba(255,255,255,.7);line-height:1.55;margin:0">
        ${msg.message}
      </p>
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 9. PAGE LIVE v2
// ═══════════════════════════════════════════════════════════
function _rendreLive(container, options = {}) {
  const seanceId = options?.seanceId
    || PM.get(() => Programme.getSeanceduJour()?.id, null);
  const seance = PM.get(() =>
    seanceId
      ? Programme.getSeanceById?.(seanceId) || Programme.getSeanceduJour()
      : Programme.getSeanceduJour(), null);

  if (!seance) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;min-height:60vh;text-align:center;padding:32px">
        <div style="font-size:3rem;margin-bottom:16px">😴</div>
        <div style="font-size:1.1rem;font-weight:700;margin-bottom:8px">
          Aucune séance aujourd'hui
        </div>
        <div style="font-size:.82rem;color:rgba(255,255,255,.4);margin-bottom:20px">
          Jour de repos ou programme non configuré
        </div>
        <button onclick="naviguer('training')" class="pm-btn pm-btn-primary">
          📅 Voir le programme
        </button>
      </div>`;
    return;
  }

  const etat     = PM.get(() => Tracker.getEtatSeance?.(seance.id), { series:[], exoActif:0, serieActive:0, debut:null });
  const exos     = seance.exercices || [];
  const exoIdx   = Math.min(etat.exoActif||0, exos.length-1);
  const exoRef   = exos[exoIdx];
  const exo      = PM.get(() => (window.EXERCICES||{})[exoRef?.ref||exoRef] || {}, {});
  const nbSeries = exoRef?.series || 4;
  const seriesFaites = (etat.series||[]).filter(s => s.exoIndex === exoIdx);
  const totalSeries  = exos.reduce((s,ex) => s+(ex.series||4), 0);
  const seriesFaitesTotal = (etat.series||[]).length;
  const pct = Math.round((seriesFaitesTotal/Math.max(totalSeries,1))*100);
  const tempsEcoule = etat.debut ? Math.floor((Date.now()-etat.debut)/1000) : 0;
  const mm = String(Math.floor(tempsEcoule/60)).padStart(2,'0');
  const ss = String(tempsEcoule%60).padStart(2,'0');
  const pr   = PM.get(() => Tracker.getPR?.(exoRef?.ref||exoRef), null);
  const reco = PM.get(() => Predict.getRecommandation?.(exoRef?.ref||exoRef), null);

  container.innerHTML = `

    <!-- Sticky progress -->
    <div style="background:rgba(9,9,45,.97);backdrop-filter:blur(16px);
                border-bottom:1px solid rgba(75,75,249,.3);
                padding:10px 16px;margin:-16px -16px 16px;
                position:sticky;top:0;z-index:50">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">
        <div style="display:flex;align-items:center;gap:8px">
          <div style="width:7px;height:7px;border-radius:50%;background:var(--fd-mint);
                      box-shadow:0 0 6px var(--fd-mint);animation:pm-liveDot 1.5s infinite"></div>
          <span style="font-size:.82rem;font-weight:800;color:var(--fd-mint)">
            ⏱ ${mm}:${ss}
          </span>
        </div>
        <span style="font-size:.72rem;color:rgba(255,255,255,.5)">
          ${seance.emoji} ${seance.nom}
        </span>
        <span style="font-size:.72rem;font-weight:700;color:var(--fd-indigo)">
          ${pct}%
        </span>
      </div>
      <div style="height:4px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${pct}%;
                    background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
                    border-radius:99px;transition:width .5s ease"></div>
      </div>
    </div>

    <!-- Exercice actuel -->
    <div class="pm-card" style="animation:pm-fadeUp .3s ease">
      <div style="display:flex;justify-content:space-between;
                  align-items:flex-start;margin-bottom:14px">
        <div>
          <div style="font-size:1rem;font-weight:800">
            ${exo.emoji||'🏋️'} ${exo.nom||exoRef?.ref||'Exercice'}
          </div>
          <div style="font-size:.68rem;color:var(--fd-mint);margin-top:2px">
            ${exo.muscle||exo.groupe||''}
          </div>
          <div style="font-size:.62rem;color:rgba(255,255,255,.4);margin-top:2px">
            ${nbSeries} séries · ${exoRef?.reps||'8-10'} reps · repos ${exoRef?.repos||90}s
          </div>
        </div>
        <div style="text-align:right">
          ${pr   ? `<div style="font-size:.7rem;color:var(--fd-lemon);font-weight:700">🏆 PR ${pr.poids}kg×${pr.reps}</div>` : ''}
          ${reco ? `<div style="font-size:.62rem;color:var(--fd-indigo);margin-top:2px">💡 Reco ${reco.poids}kg</div>` : ''}
        </div>
      </div>

      <!-- Séries faites -->
      ${seriesFaites.map((s,i)=>`
        <div class="pm-serie done">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:.78rem;font-weight:700;color:var(--fd-mint)">S${i+1}/${nbSeries}</div>
            <div style="font-size:.72rem;font-weight:700;color:var(--fd-mint)">
              ✅ ${s.poids||0}kg × ${s.reps||0} reps${s.rpe?` · RPE ${s.rpe}`:''}
            </div>
          </div>
        </div>`).join('')}

      <!-- Série active -->
      <div class="pm-serie active">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-size:.78rem;font-weight:800;color:var(--fd-indigo)">
            S${seriesFaites.length+1}/${nbSeries}
          </div>
          <div style="padding:3px 10px;background:rgba(75,75,249,.15);
                      border:1px solid rgba(75,75,249,.3);border-radius:99px;
                      font-size:.6rem;font-weight:700;color:var(--fd-indigo)">⚡ Active</div>
        </div>

        <!-- Poids + Reps -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div>
            <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
              🏋️ Charge (kg)
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <button onclick="PM.inputDelta('pm-poids',-2.5)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1.1rem;font-weight:800;cursor:pointer;
                             background:rgba(255,141,150,.12);
                             border:1.5px solid rgba(255,141,150,.3);
                             color:var(--fd-coral)"
                      onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">−</button>
              <input id="pm-poids" class="pm-input"
                     value="${reco?.poids||pr?.poids||exoRef?.charge_depart||20}"
                     type="number" step="2.5" min="0"/>
              <button onclick="PM.inputDelta('pm-poids',2.5)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1.1rem;font-weight:800;cursor:pointer;
                             background:rgba(139,240,187,.12);
                             border:1.5px solid rgba(139,240,187,.3);
                             color:var(--fd-mint)"
                      onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">+</button>
            </div>
          </div>
          <div>
            <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
              🔁 Répétitions
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              <button onclick="PM.inputDelta('pm-reps',-1)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1.1rem;font-weight:800;cursor:pointer;
                             background:rgba(255,141,150,.12);
                             border:1.5px solid rgba(255,141,150,.3);
                             color:var(--fd-coral)"
                      onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">−</button>
              <input id="pm-reps" class="pm-input"
                     value="${exoRef?.reps_cible||10}"
                     type="number" step="1" min="1"/>
              <button onclick="PM.inputDelta('pm-reps',1)"
                      style="width:38px;height:38px;flex-shrink:0;border-radius:10px;
                             font-size:1.1rem;font-weight:800;cursor:pointer;
                             background:rgba(139,240,187,.12);
                             border:1.5px solid rgba(139,240,187,.3);
                             color:var(--fd-mint)"
                      onmousedown="this.style.transform='scale(.88)'"
                      onmouseup="this.style.transform=''">+</button>
            </div>
          </div>
        </div>

        <!-- RPE -->
        <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.08em;color:rgba(255,255,255,.4);margin-bottom:6px">
          😤 RPE
        </div>
        <div style="display:flex;gap:4px;margin-bottom:14px" id="pm-rpe-row">
          ${[6,7,8,9,10].map(r=>`
            <div class="pm-rpe-btn" onclick="PM.setRPE(${r},this)">${r}</div>`).join('')}
        </div>

        <!-- Bouton série -->
        <button onclick="PM.validerSerie('${seance.id}',${exoIdx},${seriesFaites.length})"
                style="width:100%;padding:18px;background:var(--fd-indigo);border:none;
                       border-radius:14px;font-size:1rem;font-weight:800;color:white;
                       cursor:pointer;letter-spacing:.02em;
                       box-shadow:0 4px 20px rgba(75,75,249,.4);transition:all .15s"
                onmousedown="this.style.transform='scale(.97)'"
                onmouseup="this.style.transform=''">
          ✅ SÉRIE FAITE
        </button>
      </div>

      <!-- Séries en attente -->
      ${Array.from({length:Math.max(0,nbSeries-seriesFaites.length-1)},(_,i)=>`
        <div class="pm-serie" style="opacity:.4">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-size:.78rem;color:rgba(255,255,255,.4)">
              S${seriesFaites.length+2+i}/${nbSeries}
            </div>
            <div style="font-size:.62rem;color:rgba(255,255,255,.3)">○ En attente</div>
          </div>
        </div>`).join('')}
    </div>

    <!-- Exos restants -->
    ${exos.length > 1 ? `
      ${PM.sectionTitle('📋 Exercices restants')}
      ${exos.slice(exoIdx+1, exoIdx+4).map(ex => {
        const e = PM.get(() => (window.EXERCICES||{})[ex.ref||ex]||{},{});
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;
                      background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);
                      border-radius:12px;margin-bottom:6px;opacity:.65">
            <span style="font-size:1rem">${e.emoji||'💪'}</span>
            <div style="flex:1">
              <div style="font-size:.8rem;font-weight:600">${e.nom||ex.ref||ex}</div>
              <div style="font-size:.62rem;color:rgba(255,255,255,.35)">
                ${ex.series||4} × ${ex.reps||'8-10'}
              </div>
            </div>
          </div>`;
      }).join('')}` : ''}

    <!-- Terminer -->
    <button onclick="PM.terminerSeance('${seance.id}')"
            style="width:100%;padding:16px;margin-top:12px;margin-bottom:8px;
                   background:rgba(139,240,187,.1);border:1px solid rgba(139,240,187,.25);
                   border-radius:14px;font-size:.88rem;font-weight:700;
                   color:var(--fd-mint);cursor:pointer;transition:background .2s"
            onmouseenter="this.style.background='rgba(139,240,187,.2)'"
            onmouseleave="this.style.background='rgba(139,240,187,.1)'">
      🏁 Terminer la séance
    </button>

    <div style="height:16px"></div>
  `;
}

// Live helpers
PM.validerSerie = function(seanceId, exoIdx, serieIdx) {
  const poids = parseFloat(document.getElementById('pm-poids')?.value)||0;
  const reps  = parseInt(document.getElementById('pm-reps')?.value)||0;
  const rpe   = window._PM_RPE||null;
  if (!poids||!reps) { PM.toast('Entre le poids et les reps !','error'); PM.sons.erreur(); return; }
  try { Tracker.enregistrerSerie?.({ seanceId, exoIdx, serieIdx, poids, reps, rpe }); } catch(e) {}
  PM.sons.succes();
  try { navigator.vibrate?.([100]); } catch(e) {}
  PM.toast(`✅ Série validée !\n${poids}kg × ${reps} reps`,'success');
  const pr = PM.get(() => Tracker.getPR?.(null), null);
  if (pr && poids >= pr.poids) {
    setTimeout(() => { PM.toast('🏆 NOUVEAU RECORD !','pr',3500); PM.sons.pr(); PM.confetti(); }, 600);
  }
  PM.timer.ouvrir(rpe && rpe >= 9 ? 120 : rpe >= 8 ? 90 : 60, 'Repos');
  setTimeout(() => {
    const c = document.querySelector('.page.active,.page-content');
    if (c) _rendreLive(c, { seanceId });
  }, 300);
};

PM.terminerSeance = function(seanceId) {
  if (!confirm('Terminer la séance ?')) return;
  try { Tracker.terminerSeance?.(seanceId); } catch(e) {}
  try { Gamification.ajouterXP?.(100,'Séance terminée'); } catch(e) {}
  PM.sons.niveau();
  PM.confetti();
  PM.toast('🎉 Séance terminée !\nBravo pour l\'effort !','success',3500);
  setTimeout(() => { try { naviguer('home'); } catch(e) {} }, 800);
};

// ═══════════════════════════════════════════════════════════
// 10. PAGE STATS v2
// ═══════════════════════════════════════════════════════════
function _rendreStats(container) {
  const analyse  = PM.get(() => Coach.getAnalyseSemaine(),
                     { seances:0, objectif:4, volume:0, rpe:0 });
  const prs      = PM.get(() => Tracker.getPRs(), []);
  const muscles  = PM.get(() => Tracker.getRepartitionMuscles(),
                     [{nom:'Pectoraux',pct:40,couleur:'#4b4bf9'},
                      {nom:'Épaules',  pct:25,couleur:'#8bf0bb'},
                      {nom:'Triceps',  pct:20,couleur:'#f9ef77'},
                      {nom:'Dos',      pct:15,couleur:'#bfa1ff'}]);
  const histo    = PM.get(() => Tracker.getHistoriqueVolume7j(), []);
  const streak   = PM.get(() => Tracker.getStreak(), { count:0 });
  const score    = Math.min(100, Math.round(
    (analyse.seances/Math.max(analyse.objectif,1))*40 +
    Math.min(30, streak.count*3) + 30));

  // Courbe volume 7j
  const pts = histo.length >= 7 ? histo.slice(-7)
    : Array(7).fill(0).map((_,i) => ({ vol:[80,200,150,320,180,400,250][i]||0 }));
  const maxV = Math.max(...pts.map(p=>p.vol||p||0),1);
  const W=300, H=100;
  const svgPts = pts.map((p,i) => [
    (i/(pts.length-1))*W,
    H - ((p.vol||p||0)/maxV)*(H-10) - 5
  ]);
  const pathD = svgPts.map((p,i) =>
    i===0 ? `M${p[0]},${p[1]}`
    : `C${svgPts[i-1][0]+20},${svgPts[i-1][1]} ${p[0]-20},${p[1]} ${p[0]},${p[1]}`
  ).join(' ');
  const areaD = pathD + ` L${W},${H} L0,${H}Z`;

  // Donut muscles
  let offset = 0;
  const circ  = 276;
  const total = muscles.reduce((s,m)=>s+m.pct,0)||100;
  const donut = muscles.map(m => {
    const dash = (m.pct/total)*circ;
    const arc  = `<circle cx="55" cy="55" r="44" fill="none"
      stroke="${m.couleur}" stroke-width="14"
      stroke-dasharray="${dash} ${circ-dash}"
      stroke-dashoffset="${-offset}"
      transform="rotate(-90 55 55)"
      style="filter:drop-shadow(0 0 3px ${m.couleur})"/>`;
    offset += dash; return arc;
  }).join('');

  container.innerHTML = `

    <!-- Stats 3 -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px">
      ${[
        {emoji:'📅',val:`${analyse.seances}/${analyse.objectif}`,label:'Séances',c:'var(--fd-indigo)',d:'0s'  },
        {emoji:'📦',val:PM.vol(analyse.volume),                  label:'Volume', c:'var(--fd-mint)',  d:'.1s' },
        {emoji:'😤',val:analyse.rpe>0?`${analyse.rpe}/10`:'—',  label:'RPE',    c:'var(--fd-lemon)', d:'.2s' }
      ].map(s=>`
        <div onclick="naviguer('history')"
             style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px 8px;text-align:center;cursor:pointer;
                    transition:all .2s;animation:pm-countUp .4s ${s.d} ease both"
             onmouseenter="this.style.transform='translateY(-3px)'"
             onmouseleave="this.style.transform=''">
          <div style="font-size:.85rem;margin-bottom:4px">${s.emoji}</div>
          <div style="font-size:.95rem;font-weight:800;color:${s.c}">${s.val}</div>
          <div style="font-size:.52rem;color:rgba(255,255,255,.3);margin-top:3px;
                      text-transform:uppercase;letter-spacing:.04em">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Graphique volume -->
    <div class="pm-card">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:10px">
        📈 Volume — 7 derniers jours
      </div>
      <svg width="100%" height="115" viewBox="0 0 300 115" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pm-vol-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4b4bf9" stop-opacity=".35"/>
            <stop offset="100%" stop-color="#4b4bf9" stop-opacity="0"/>
          </linearGradient>
        </defs>
        ${[25,55,85].map(y=>`<line x1="0" y1="${y}" x2="300" y2="${y}"
          stroke="rgba(255,255,255,.04)" stroke-width="1"/>`).join('')}
        <path d="${areaD}" fill="url(#pm-vol-grad)"/>
        <path d="${pathD}" fill="none" stroke="#4b4bf9" stroke-width="2.5"
              stroke-linecap="round"
              style="filter:drop-shadow(0 0 5px #4b4bf9)"/>
        ${svgPts.map(([x,y])=>`
          <circle cx="${x}" cy="${y}" r="4" fill="#4b4bf9"
                  style="filter:drop-shadow(0 0 4px #4b4bf9)"/>`).join('')}
      </svg>
      <div style="display:flex;justify-content:space-between;
                  margin-top:6px;font-size:.55rem;color:rgba(255,255,255,.3)">
        ${['L','M','M','J','V','S','D'].map(d=>`<span>${d}</span>`).join('')}
      </div>
    </div>

    <!-- Donut muscles -->
    <div class="pm-card">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:10px">
        🎯 Répartition musculaire
      </div>
      <div style="display:flex;align-items:center;gap:16px">
        <svg width="110" height="110" viewBox="0 0 110 110" style="flex-shrink:0">
          ${donut}
          <text x="55" y="51" text-anchor="middle" fill="white" font-size="13" font-weight="800">
            ${muscles.length}
          </text>
          <text x="55" y="63" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="7">
            muscles
          </text>
        </svg>
        <div style="flex:1">
          ${muscles.map((m,i)=>`
            <div style="margin-bottom:7px">
              <div style="display:flex;justify-content:space-between;margin-bottom:3px">
                <span style="font-size:.72rem;font-weight:600;color:${m.couleur}">${m.nom}</span>
                <span style="font-size:.65rem;color:rgba(255,255,255,.4)">${m.pct}%</span>
              </div>
              <div style="height:4px;background:rgba(255,255,255,.05);border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${m.pct}%;background:${m.couleur};border-radius:99px;
                            animation:pm-progressFill .8s ${i*.1}s ease both"></div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- PRs -->
    ${prs.length > 0 ? `
      <div class="pm-card" style="background:linear-gradient(135deg,rgba(249,239,119,.1),rgba(249,239,119,.03));
           border-color:rgba(249,239,119,.25)">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:10px">
          🏆 Records personnels
        </div>
        ${prs.slice(0,3).map(p=>`
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;
                      border-bottom:1px solid rgba(249,239,119,.08)">
            <span style="font-size:1rem">${p.emoji||'🏋️'}</span>
            <div style="flex:1">
              <div style="font-size:.8rem;font-weight:700">${p.exercice}</div>
              <div style="font-size:.62rem;color:var(--fd-mint)">${p.muscle||''}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:.85rem;font-weight:800;color:var(--fd-lemon)">
                ${p.poids}kg×${p.reps}
              </div>
              <div style="font-size:.58rem;color:rgba(255,255,255,.3)">
                ~${Math.round(p.poids*(1+p.reps/30))}kg 1RM
              </div>
            </div>
          </div>`).join('')}
      </div>` : ''}

    <!-- Score de forme -->
    <div class="pm-card">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:4px">
            🔥 Score de forme
          </div>
          <div style="font-size:2.2rem;font-weight:800;color:var(--fd-mint)">
            ${score}<span style="font-size:.9rem;color:rgba(255,255,255,.4)">/100</span>
          </div>
        </div>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.05)"
                  stroke-width="8" stroke-dasharray="150 51" transform="rotate(135 40 40)"/>
          <circle cx="40" cy="40" r="32" fill="none" stroke="var(--fd-mint)"
                  stroke-width="8" stroke-linecap="round"
                  stroke-dasharray="${(score/100)*150} ${150-(score/100)*150}"
                  transform="rotate(135 40 40)"
                  style="filter:drop-shadow(0 0 4px var(--fd-mint))"/>
          <text x="40" y="44" text-anchor="middle" fill="var(--fd-mint)" font-size="14">🔥</text>
        </svg>
      </div>
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 11. PAGE TRAINING v2
// ═══════════════════════════════════════════════════════════
function _rendreTraining(container) {
  const infos   = PM.get(() => Programme.getInfosProgramme(),
                    { semaine:1, cycle:1, progression:25,
                      phase:{ nom:'Reprise', emoji:'🌱', intensite:.65 } });
  const seances = PM.get(() => Programme.getAllSeances(), []);
  const planning= PM.get(() => Programme.getSeancesSemaine(), []);
  const isCustom= PM.get(() => Programme.estPlanningCustom?.(), false);
  const COLORS  = ['#ff4d6d','#8bf0bb','#4b4bf9','#f9ef77','#bfa1ff','#ff8d96'];

  container.innerHTML = `

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;color:white;text-align:center;padding:20px;
                margin-bottom:14px;position:relative;overflow:hidden;
                animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-30px;right:-20px;width:130px;height:130px;
                  border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>
      <div style="font-size:2rem;margin-bottom:6px">${infos.phase.emoji}</div>
      <div style="font-size:1.1rem;font-weight:800">${infos.phase.nom}</div>
      <div style="font-size:.78rem;opacity:.8;margin-top:2px">
        Semaine ${infos.semaine} · Cycle ${infos.cycle}
        · ${Math.round((infos.phase.intensite||.65)*100)}% intensité
      </div>
      <div style="height:6px;background:rgba(255,255,255,.2);border-radius:3px;
                  margin-top:14px;overflow:hidden">
        <div style="height:100%;background:var(--fd-lemon);width:${infos.progression||25}%;
                    border-radius:3px;animation:pm-progressFill .8s ease"></div>
      </div>
      <div style="font-size:.62rem;opacity:.6;margin-top:4px">
        ${infos.progression||25}% du cycle
      </div>
    </div>

    <!-- Planning -->
    ${PM.sectionTitle('📅 Planning semaine',
      isCustom ? `<button onclick="PlanningEditor?.resetPlanning()"
        style="font-size:.58rem;font-weight:700;padding:3px 8px;
               background:rgba(255,141,150,.1);border:1px solid rgba(255,141,150,.2);
               border-radius:99px;color:var(--fd-coral);cursor:pointer">
        🔄 Reset</button>` : '')}

    <div class="pm-card" style="margin-bottom:14px">
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:3px">
        ${planning.map(j=>`
          <div style="text-align:center;padding:8px 2px;border-radius:10px;
                      cursor:pointer;transition:all .2s;
                      ${j.estAujourdhui
                        ? 'background:var(--fd-indigo)'
                        : j.seance
                          ? 'background:rgba(75,75,249,.15)'
                          : 'background:rgba(255,255,255,.03)'}"
               onclick="PlanningEditor?.ouvrirChoixSeance(${j.jour})"
               onmouseenter="this.style.transform='scale(1.08)'"
               onmouseleave="this.style.transform=''">
            <div style="font-size:.58rem;
                        color:${j.estAujourdhui?'white':'rgba(255,255,255,.4)'};
                        font-weight:${j.estAujourdhui?'700':'400'}">
              ${j.label}
            </div>
            <div style="font-size:.9rem;margin-top:2px">
              ${j.seance ? j.seance.emoji : j.estRepos ? '😴' : '·'}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Séances -->
    ${PM.sectionTitle('🏋️ Séances du programme')}
    ${seances.map((s,i) => {
      const color = COLORS[i%COLORS.length];
      return `
        <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                    border-radius:18px;padding:16px;margin-bottom:10px;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .3s ${i*.07}s ease both"
             onmouseenter="this.style.borderColor='${color}33';this.style.transform='translateX(4px)'"
             onmouseleave="this.style.borderColor='rgba(255,255,255,.08)';this.style.transform=''">
          <div style="display:flex;justify-content:space-between;
                      align-items:flex-start;margin-bottom:10px">
            <div>
              <div style="font-size:1rem;font-weight:700">${s.emoji} ${s.nom}</div>
              <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px">
                ~${s.duree_estimee||60}min · ${s.exercices?.length||0} exercices
              </div>
            </div>
            <button onclick="event.stopPropagation();naviguer('live',{seanceId:'${s.id}'})"
                    style="padding:9px 18px;background:var(--fd-indigo);border:none;
                           border-radius:99px;font-size:.78rem;font-weight:700;
                           color:white;cursor:pointer;
                           box-shadow:0 3px 14px rgba(75,75,249,.35);transition:transform .2s"
                    onmouseenter="this.style.transform='scale(1.05)'"
                    onmouseleave="this.style.transform=''">▶ Start</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">
            ${(s.muscles||[]).map(m=>`
              <span style="padding:3px 9px;border-radius:99px;font-size:.6rem;
                           font-weight:700;text-transform:uppercase;
                           background:${color}18;color:${color};
                           border:1px solid ${color}33">${m}</span>`).join('')}
          </div>
          <div style="display:flex;flex-wrap:wrap">
            ${(s.exercices||[]).slice(0,5).map(ex => {
              const e = PM.get(()=>(window.EXERCICES||{})[ex.ref||ex]||{},{});
              return `<span style="display:inline-flex;align-items:center;gap:3px;
                            padding:3px 8px;border-radius:99px;font-size:.6rem;
                            background:rgba(255,255,255,.04);
                            border:1px solid rgba(255,255,255,.07);
                            color:rgba(255,255,255,.4);margin:2px">
                ${e.emoji||'💪'} ${e.nom||ex.ref||ex}
              </span>`;
            }).join('')}
            ${(s.exercices||[]).length>5?`
              <span style="padding:3px 8px;border-radius:99px;font-size:.6rem;
                           background:rgba(75,75,249,.1);color:var(--fd-indigo);
                           border:1px solid rgba(75,75,249,.2);margin:2px">
                +${(s.exercices||[]).length-5}
              </span>`:''}
          </div>
        </div>`;
    }).join('')}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 12. PAGE PROFIL v2
// ═══════════════════════════════════════════════════════════
function _rendreProfil(container) {
  const profil   = PM.get(() => Tracker.getProfil(), { nom:'Athlète', avatar:'💪' });
  const xp       = PM.get(() => Gamification.getXP(),
                     { total:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } });
  const streak   = PM.get(() => Tracker.getStreak(), { count:0 });
  const total    = PM.get(() => Tracker.getTotalSeances(), 0);
  const trophees = PM.get(() => Gamification.getTrophees(), []);
  const histo    = PM.get(() => Tracker.getHistorique(), []);
  const unlocked = trophees.filter(t => t.debloquee);

  const menuItems = [
    {page:'journal',      emoji:'📔',label:'Journal',         color:'#f9ef77'},
    {page:'objectifs',    emoji:'🎯',label:'Objectifs',       color:'#ff4d6d'},
    {page:'coach',        emoji:'🤖',label:'Coach IA',        color:'#bfa1ff'},
    {page:'defis',        emoji:'🏆',label:'Défis',           color:'#f9ef77'},
    {page:'gamification', emoji:'⭐',label:'XP & Niveaux',    color:'#f9ef77'},
    {page:'history',      emoji:'📅',label:'Historique',      color:'#4b4bf9'},
    {page:'nutrition',    emoji:'🥗',label:'Nutrition',       color:'#8bf0bb'},
    {page:'stats',        emoji:'📊',label:'Analytics',       color:'#bfa1ff'},
    {page:'photos',       emoji:'📸',label:'Photos',          color:'#ff8d96'},
    {page:'blessures',    emoji:'🩹',label:'Blessures',       color:'#ff8d96'},
    {page:'circuit',      emoji:'🔥',label:'HIIT & Cardio',   color:'#f9ef77'},
    {page:'export',       emoji:'📤',label:'Exporter',        color:'#8bf0bb'},
    {page:'settings',     emoji:'⚙️',label:'Paramètres',      color:'#bfa1ff'}
  ];

  container.innerHTML = `

    <!-- Hero -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;padding:24px 20px;text-align:center;
                margin-bottom:14px;position:relative;overflow:hidden;
                animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;
                  border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>
      <div style="position:relative;display:inline-block;margin-bottom:12px">
        <div style="width:80px;height:80px;border-radius:50%;
                    border:3px solid rgba(255,255,255,.3);
                    display:flex;align-items:center;justify-content:center;
                    font-size:2.5rem;background:rgba(255,255,255,.1);
                    animation:pm-avatarPulse 3s ease-in-out infinite">
          ${profil.avatar||'💪'}
        </div>
        <div style="position:absolute;bottom:2px;right:2px;
                    width:22px;height:22px;border-radius:50%;
                    background:var(--fd-lemon);
                    display:flex;align-items:center;justify-content:center;
                    font-size:.65rem;border:2px solid #09092d;
                    color:#09092d;font-weight:800">
          ${xp.niveau.numero}
        </div>
      </div>
      <div style="font-size:1.4rem;font-weight:800">${profil.nom}</div>
      <div style="font-size:.82rem;opacity:.8;margin-top:4px">
        ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  background:rgba(255,255,255,.1);border-radius:14px;
                  padding:12px;gap:8px;margin-top:16px">
        ${[[total,'Séances'],[streak.count,'Streak'],[unlocked.length,'🏆']].map(([v,l])=>`
          <div style="text-align:center">
            <div style="font-size:1.3rem;font-weight:800">${v}</div>
            <div style="font-size:.58rem;opacity:.6;text-transform:uppercase">${l}</div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Trophées -->
    ${PM.sectionTitle(`🏆 Trophées (${unlocked.length}/${trophees.length})`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
      ${trophees.slice(0,8).map((t,i)=>`
        <div class="pm-badge ${t.debloquee?'unlocked':''}"
             style="animation:pm-countUp .4s ${i*.05}s ease both"
             onclick="${t.debloquee
               ? `PM.toast('🏆 ${t.nom?.replace(/'/g,"\\'")||"Trophée"}','pr')`
               : `PM.toast('🔒 Pas encore débloqué','info')`}">
          <div style="font-size:1.3rem;${!t.debloquee?'filter:grayscale(1);opacity:.3':''}">
            ${t.emoji||'🏆'}
          </div>
          <div style="font-size:.5rem;font-weight:700;line-height:1.2;
                      color:${t.debloquee?'var(--fd-lemon)':'rgba(255,255,255,.3)'}">
            ${t.nom||'???'}
          </div>
        </div>`).join('')}
    </div>

    <!-- Historique récent -->
    ${histo.length > 0 ? `
      ${PM.sectionTitle('📅 Récent')}
      <div style="position:relative;padding-left:20px;margin-bottom:14px">
        <div style="position:absolute;left:6px;top:0;bottom:0;width:2px;
                    background:rgba(255,255,255,.06)"></div>
        ${histo.slice(0,3).map((s,i)=>{
          const C=['#ff4d6d','#8bf0bb','#4b4bf9'];
          const c=C[i%C.length];
          return `
            <div style="position:relative;margin-bottom:10px;
                        animation:pm-slideIn .3s ${i*.1}s ease both">
              <div style="position:absolute;left:-17px;top:8px;
                          width:10px;height:10px;border-radius:50%;
                          background:${c};box-shadow:0 0 6px ${c};
                          border:2px solid var(--bg-app,#070714)"></div>
              <div class="pm-card" style="padding:12px 14px;margin-bottom:0">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-size:.88rem;font-weight:700">
                      ${s.emoji||'🏋️'} ${s.nom||'Séance'}
                    </div>
                    <div style="font-size:.62rem;color:rgba(255,255,255,.4);margin-top:1px">
                      ${s.date||''}
                    </div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:.82rem;font-weight:700;color:${c}">
                      ${PM.vol(s.volumeTotal||0)}
                    </div>
                    ${(s.prs?.length||0)>0
                      ?`<div style="font-size:.6rem;color:var(--fd-lemon)">${s.prs.length} 🏆</div>`
                      :''}
                  </div>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

    <!-- Menu rapide -->
    ${PM.sectionTitle('🔗 Accès rapide')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${menuItems.map((s,i)=>`
        <div onclick="naviguer('${s.page}')"
             class="pm-menu-item"
             style="animation:pm-slideIn .3s ${i*.04}s ease both"
             onmouseenter="this.style.background='${s.color}15';this.style.borderColor='${s.color}44';this.style.transform='scale(1.02)'"
             onmouseleave="this.style.background='rgba(255,255,255,.04)';this.style.borderColor='rgba(255,255,255,.07)';this.style.transform=''">
          <div style="width:34px;height:34px;border-radius:10px;
                      background:${s.color}18;border:1px solid ${s.color}33;
                      display:flex;align-items:center;justify-content:center;
                      font-size:1.1rem;flex-shrink:0">${s.emoji}</div>
          <span style="font-size:.78rem;font-weight:600;color:rgba(255,255,255,.8);
                       overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">
            ${s.label}
          </span>
        </div>`).join('')}
    </div>

    <!-- Reset -->
    <button onclick="typeof UI!=='undefined'&&UI.confirmerReset()"
            style="width:100%;padding:12px;margin-bottom:8px;
                   background:rgba(255,141,150,.06);border:1px solid rgba(255,141,150,.15);
                   border-radius:14px;color:var(--fd-coral);font-size:.82rem;
                   font-weight:600;cursor:pointer;transition:background .2s"
            onmouseenter="this.style.background='rgba(255,141,150,.12)'"
            onmouseleave="this.style.background='rgba(255,141,150,.06)'">
      🗑️ Réinitialiser toutes les données
    </button>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 13. PAGE COACH IA v2
// ═══════════════════════════════════════════════════════════
function _rendreCoach(container) {
  const profil  = PM.get(() => Tracker.getProfil(), { nom:'Athlète' });
  const analyse = PM.get(() => Coach.getAnalyseSemaine(),
                    { seances:0, objectif:4, volume:0, rpe:0 });
  const seance  = PM.get(() => Programme.getSeanceduJour(), null);

  const suggestions = [
    '💪 Analyse ma progression',
    '📊 Améliorer mon volume ?',
    '😴 Suis-je bien récupéré ?',
    '🏋️ Programme semaine prochaine',
    '🔥 Défis adaptés à mon niveau',
    '🥗 Conseils nutrition'
  ];

  container.innerHTML = `

    <!-- Header Coach -->
    <div style="background:linear-gradient(135deg,rgba(191,161,255,.2),rgba(75,75,249,.08));
                border:1px solid rgba(191,161,255,.3);border-radius:20px;
                padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:14px;
                animation:pm-fadeUp .3s ease">
      <div style="width:52px;height:52px;border-radius:50%;flex-shrink:0;
                  background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                  display:flex;align-items:center;justify-content:center;font-size:1.6rem;
                  box-shadow:0 0 20px rgba(75,75,249,.4);animation:pm-avatarPulse 3s ease-in-out infinite">
        🤖
      </div>
      <div style="flex:1">
        <div style="font-size:.95rem;font-weight:800">Coach PowerApp IA</div>
        <div style="font-size:.7rem;color:rgba(255,255,255,.5);margin-top:2px">
          Personnalisé pour ${profil.nom}
        </div>
        <div style="display:flex;align-items:center;gap:5px;margin-top:4px">
          <div style="width:6px;height:6px;border-radius:50%;background:var(--fd-mint);
                      box-shadow:0 0 5px var(--fd-mint);animation:pm-pulse 2s infinite"></div>
          <div style="font-size:.62rem;color:var(--fd-mint);font-weight:600">En ligne</div>
        </div>
      </div>
    </div>

    <!-- Zone chat -->
    <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);
                border-radius:20px;margin-bottom:12px;overflow:hidden">
      <div id="pm-chat-messages"
           style="display:flex;flex-direction:column;padding:16px;gap:4px;
                  max-height:360px;overflow-y:auto;scrollbar-width:none">
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">
          <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                      background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                      display:flex;align-items:center;justify-content:center;font-size:.8rem">🤖</div>
          <div class="pm-chat-bubble ai">
            Bonjour ${profil.nom} ! 👋
            ${seance
              ? `Ta séance : <strong>${seance.emoji} ${seance.nom}</strong>. On l'analyse ?`
              : "C'est repos aujourd'hui 😴 Comment tu te sens ?"}
          </div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,.06);padding:12px">
        <div style="display:flex;gap:8px;align-items:flex-end">
          <textarea id="pm-chat-input"
                    placeholder="Pose une question..."
                    rows="1"
                    style="flex:1;padding:12px 14px;font-size:.82rem;
                           background:rgba(255,255,255,.06);
                           border:1px solid rgba(255,255,255,.1);
                           border-radius:14px;color:white;outline:none;
                           resize:none;font-family:inherit;line-height:1.4;
                           transition:border-color .2s;max-height:100px"
                    onfocus="this.style.borderColor='var(--fd-indigo)'"
                    onblur="this.style.borderColor='rgba(255,255,255,.1)'"
                    onkeydown="if(event.key==='Enter'&&!event.shiftKey){
                      event.preventDefault();PM.chatEnvoyer();}"></textarea>
          <button onclick="PM.chatEnvoyer()"
                  style="width:44px;height:44px;border-radius:12px;flex-shrink:0;
                         background:var(--fd-indigo);border:none;font-size:1.1rem;
                         cursor:pointer;box-shadow:0 4px 14px rgba(75,75,249,.4)">➤</button>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:8px">
      💡 Suggestions
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      ${suggestions.map(s=>`
        <button onclick="PM.chatSuggestion('${s.replace(/'/g,"\\'")}')"
                style="padding:7px 12px;background:rgba(75,75,249,.1);
                       border:1px solid rgba(75,75,249,.2);border-radius:99px;
                       font-size:.7rem;font-weight:600;color:var(--fd-lavender);
                       cursor:pointer;transition:background .2s"
                onmouseenter="this.style.background='rgba(75,75,249,.2)'"
                onmouseleave="this.style.background='rgba(75,75,249,.1)'">
          ${s}
        </button>`).join('')}
    </div>

    <div style="height:8px"></div>
  `;

  setTimeout(() => {
    const m = document.getElementById('pm-chat-messages');
    if (m) m.scrollTop = m.scrollHeight;
  }, 100);
}

// Chat helpers
PM.chatEnvoyer = function() {
  const input = document.getElementById('pm-chat-input');
  if (!input?.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  PM.sons.clic();
  PM._chatMsg(msg, 'user');
  PM._chatTyping();
  setTimeout(() => PM._chatRepondre(msg), 800 + Math.random()*600);
};

PM.chatSuggestion = function(msg) {
  const i = document.getElementById('pm-chat-input');
  if (i) i.value = msg;
  PM.chatEnvoyer();
};

PM._chatMsg = function(content, role) {
  const c = document.getElementById('pm-chat-messages');
  if (!c) return;
  document.getElementById('pm-typing')?.remove();
  const div = document.createElement('div');
  div.style.cssText = `display:flex;align-items:flex-start;gap:8px;
    ${role==='user'?'flex-direction:row-reverse':''}`;
  div.innerHTML = `
    ${role!=='user'?`<div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
      background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
      display:flex;align-items:center;justify-content:center;font-size:.8rem">🤖</div>`:''}
    <div class="pm-chat-bubble ${role}">${content}</div>`;
  c.appendChild(div);
  c.scrollTop = c.scrollHeight;
};

PM._chatTyping = function() {
  const c = document.getElementById('pm-chat-messages');
  if (!c) return;
  const div = document.createElement('div');
  div.id = 'pm-typing';
  div.style.cssText = 'display:flex;align-items:flex-start;gap:8px';
  div.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                display:flex;align-items:center;justify-content:center;font-size:.8rem">🤖</div>
    <div class="pm-chat-typing"><span></span><span></span><span></span></div>`;
  c.appendChild(div);
  c.scrollTop = c.scrollHeight;
};

PM._chatRepondre = function(q) {
  let r = '';
  try { r = Coach.repondre?.(q)||''; } catch(e) {}
  if (!r) {
    const ql = q.toLowerCase();
    const a  = PM.get(()=>Coach.getAnalyseSemaine(),{seances:0,objectif:4,volume:0});
    const pct= Math.round((a.seances/Math.max(a.objectif,1))*100);
    if (ql.includes('progress')||ql.includes('analys'))
      r = `📊 Cette semaine : ${a.seances}/${a.objectif} séances (${pct}%). ${pct>=75?'🔥 Excellent !':pct>=50?'👍 Continue !':'💪 Vise 4 séances !'}`;
    else if (ql.includes('volume'))
      r = `📦 Volume actuel : ${PM.vol(a.volume)}. Vise +5-10% par semaine. Ajoute 1 série par exo principal chaque semaine !`;
    else if (ql.includes('récup')||ql.includes('repos'))
      r = `😴 Récup clé ! Dors 7-9h, bois 2L/jour. Laisse 48h entre séances lourdes.`;
    else if (ql.includes('nutri')||ql.includes('manger'))
      r = `🥗 Protéines : 1.8-2.2g/kg · Glucides avant séance · Lipides pour récup. Voir section Nutrition !`;
    else {
      const reps = [
        '💪 Continue sur ta lancée, tes efforts paient !',
        '🎯 Reste constant — la régularité bat l\'intensité.',
        '📈 Tes données montrent une belle progression !',
        '🔥 Chaque séance compte. Tu es sur la bonne voie !'
      ];
      r = reps[Math.floor(Math.random()*reps.length)];
    }
  }
  document.getElementById('pm-typing')?.remove();
  PM._chatMsg(r, 'ai');
  PM.sons.clic();
};

// ═══════════════════════════════════════════════════════════
// 14. PAGE DÉFIS v2
// ═══════════════════════════════════════════════════════════
function _rendreDefis(container) {
  let defis = PM.get(() => Defis.mettreAJourProgression(), []);
  if (!defis.length) {
    defis = [
      {id:'d1',emoji:'🔥',titre:'12 séances ce mois', progression:7, cible:12,complete:false,xp:200,couleur:'#f9ef77'},
      {id:'d2',emoji:'💪',titre:'500kg volume bench',  progression:380,cible:500,complete:false,xp:150,couleur:'#4b4bf9'},
      {id:'d3',emoji:'⚡',titre:'Streak 7 jours',      progression:5, cible:7, complete:false,xp:100,couleur:'#8bf0bb'},
      {id:'d4',emoji:'🏋️',titre:'20 séances totales',  progression:20,cible:20,complete:true, xp:300,couleur:'#bfa1ff'},
      {id:'d5',emoji:'📅',titre:'4 séances cette sem', progression:3, cible:4, complete:false,xp:80, couleur:'#ff8d96'}
    ];
  }
  const termines = defis.filter(d=>d.complete);
  const encours  = defis.filter(d=>!d.complete);

  container.innerHTML = `

    <div style="background:linear-gradient(135deg,rgba(249,239,119,.15),rgba(249,239,119,.04));
                border:1px solid rgba(249,239,119,.3);border-radius:20px;
                padding:16px 20px;margin-bottom:14px;
                display:flex;align-items:center;justify-content:space-between;
                animation:pm-fadeUp .3s ease">
      <div>
        <div style="font-size:1.1rem;font-weight:800">🏆 Défis</div>
        <div style="font-size:.72rem;color:rgba(255,255,255,.5);margin-top:2px">
          ${termines.length}/${defis.length} complétés
        </div>
      </div>
      <div style="text-align:center">
        <div style="font-size:2rem;font-weight:800;color:var(--fd-lemon)">${termines.length}</div>
        <div style="font-size:.55rem;color:rgba(255,255,255,.4);text-transform:uppercase">Terminés</div>
      </div>
    </div>

    ${PM.sectionTitle('⚡ En cours')}
    ${encours.map((d,i) => {
      const pct  = Math.round((d.progression/Math.max(d.cible,1))*100);
      const circ = 138;
      const dash = (pct/100)*circ;
      return `
        <div class="pm-defi-card" style="animation-delay:${i*.06}s">
          <div style="display:flex;align-items:center;gap:14px">
            <div style="position:relative;width:54px;height:54px;flex-shrink:0">
              <svg width="54" height="54" style="transform:rotate(-90deg)">
                <circle cx="27" cy="27" r="22" fill="none"
                        stroke="${d.couleur||'#4b4bf9'}22" stroke-width="5"/>
                <circle cx="27" cy="27" r="22" fill="none"
                        stroke="${d.couleur||'#4b4bf9'}" stroke-width="5"
                        stroke-linecap="round"
                        stroke-dasharray="${dash} ${circ-dash}"
                        style="filter:drop-shadow(0 0 3px ${d.couleur||'#4b4bf9'})"/>
              </svg>
              <div style="position:absolute;top:50%;left:50%;
                          transform:translate(-50%,-50%);
                          font-size:.72rem;font-weight:800">${pct}%</div>
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="font-size:.9rem">${d.emoji}</span>
                <span style="font-size:.85rem;font-weight:700;
                             overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                  ${d.titre}
                </span>
              </div>
              <div class="pm-progress" style="margin-bottom:4px">
                <div class="pm-progress-fill"
                     style="width:${pct}%;background:${d.couleur||'#4b4bf9'};
                            box-shadow:0 0 5px ${d.couleur||'#4b4bf9'};
                            animation:pm-progressFill .8s ${i*.08}s ease both"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:.62rem">
                <span style="color:rgba(255,255,255,.4)">${d.progression}/${d.cible}</span>
                <span style="color:${d.couleur||'#4b4bf9'};font-weight:700">+${d.xp||0}XP</span>
              </div>
            </div>
          </div>
        </div>`;
    }).join('')}

    ${termines.length > 0 ? `
      ${PM.sectionTitle('✅ Complétés')}
      ${termines.map((d,i)=>`
        <div class="pm-defi-card complete" style="animation-delay:${i*.06}s">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;flex-shrink:0;
                        background:rgba(139,240,187,.15);border:2px solid rgba(139,240,187,.4);
                        display:flex;align-items:center;justify-content:center;font-size:1.2rem">
              ${d.emoji}
            </div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:700;text-decoration:line-through;
                          color:rgba(255,255,255,.5)">${d.titre}</div>
              <div style="font-size:.65rem;color:var(--fd-mint);margin-top:2px">
                ✅ Complété · +${d.xp||0} XP
              </div>
            </div>
            <div style="font-size:1.4rem">🏆</div>
          </div>
        </div>`).join('')}` : ''}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 15. PAGE NUTRITION v2
// ═══════════════════════════════════════════════════════════
function _rendreNutrition(container) {
  const profil = PM.get(() => Tracker.getProfil(), { poids:80 });
  const nutri  = PM.get(() => Nutrition.getJournee(), {
    calories:  { conso:1840, objectif:2400 },
    proteines: { conso:120,  objectif:160  },
    glucides:  { conso:180,  objectif:280  },
    lipides:   { conso:55,   objectif:70   }
  });

  const calPct = Math.min(100,Math.round((nutri.calories.conso/Math.max(nutri.calories.objectif,1))*100));
  const circ   = 314;
  const dash   = (calPct/100)*circ;

  container.innerHTML = `

    <!-- Hero calories -->
    <div style="background:linear-gradient(135deg,rgba(139,240,187,.15),rgba(75,75,249,.06));
                border:1px solid rgba(139,240,187,.3);border-radius:22px;
                padding:20px;margin-bottom:14px;animation:pm-fadeUp .3s ease">
      <div style="display:flex;align-items:center;gap:20px">
        <div style="position:relative;width:110px;height:110px;flex-shrink:0">
          <svg width="110" height="110" style="transform:rotate(-90deg)">
            <circle cx="55" cy="55" r="50" fill="none"
                    stroke="rgba(255,255,255,.05)" stroke-width="10"/>
            <circle cx="55" cy="55" r="50" fill="none"
                    stroke="var(--fd-mint)" stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${dash} ${circ-dash}"
                    style="filter:drop-shadow(0 0 6px var(--fd-mint))"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div style="font-size:1.3rem;font-weight:800;color:var(--fd-mint)">${calPct}%</div>
            <div style="font-size:.52rem;color:rgba(255,255,255,.4)">kcal</div>
          </div>
        </div>
        <div style="flex:1">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:4px">
            Calories aujourd'hui
          </div>
          <div style="font-size:2rem;font-weight:800;color:var(--fd-mint);line-height:1">
            ${nutri.calories.conso}
          </div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px">
            / ${nutri.calories.objectif} kcal
          </div>
          <div style="font-size:.65rem;font-weight:700;margin-top:6px;
                      color:${nutri.calories.conso<nutri.calories.objectif?'var(--fd-lemon)':'var(--fd-mint)'}">
            ${nutri.calories.objectif-nutri.calories.conso>0
              ? `Reste ${nutri.calories.objectif-nutri.calories.conso} kcal`
              : '✅ Objectif atteint !'}
          </div>
        </div>
      </div>
    </div>

    <!-- Macros -->
    ${PM.sectionTitle('💊 Macronutriments')}
    <div class="pm-card">
      ${[
        {label:'🥩 Protéines',val:nutri.proteines,c:'#4b4bf9'},
        {label:'🍚 Glucides', val:nutri.glucides, c:'#f9ef77'},
        {label:'🥑 Lipides',  val:nutri.lipides,  c:'#ff8d96'}
      ].map(m => {
        const pct = Math.min(100,Math.round((m.val.conso/Math.max(m.val.objectif,1))*100));
        return `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.78rem">
              <span style="font-weight:600">${m.label}</span>
              <span style="font-weight:700;color:${m.c}">
                ${m.val.conso}/${m.val.objectif}g
                <span style="color:rgba(255,255,255,.4);font-weight:400"> · ${pct}%</span>
              </span>
            </div>
            <div class="pm-macro-bar">
              <div class="pm-macro-fill"
                   style="width:${pct}%;background:${m.c};box-shadow:0 0 6px ${m.c}"></div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Repas -->
    ${PM.sectionTitle('🍽 Repas du jour')}
    ${['Petit-déjeuner','Déjeuner','Dîner','Collation'].map((r,i)=>`
      <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
                  border-radius:16px;padding:14px 16px;margin-bottom:8px;cursor:pointer;
                  transition:all .2s;animation:pm-fadeUp .3s ${i*.07}s ease both"
           onmouseenter="this.style.borderColor='rgba(75,75,249,.25)'"
           onmouseleave="this.style.borderColor='rgba(255,255,255,.08)'">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:10px;
                        background:rgba(75,75,249,.15);border:1px solid rgba(75,75,249,.2);
                        display:flex;align-items:center;justify-content:center;font-size:1.1rem">
              ${['🌅','☀️','🌙','🍎'][i]}
            </div>
            <div>
              <div style="font-size:.85rem;font-weight:700">${r}</div>
              <div style="font-size:.65rem;color:rgba(255,255,255,.4)">Non renseigné</div>
            </div>
          </div>
          <button onclick="PM.toast('🍽 Fonctionnalité en développement','info')"
                  style="padding:6px 12px;background:rgba(75,75,249,.12);
                         border:1px solid rgba(75,75,249,.2);border-radius:99px;
                         font-size:.65rem;font-weight:700;color:var(--fd-indigo);cursor:pointer">
            + Ajouter
          </button>
        </div>
      </div>`).join('')}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 16. PAGE GAMIFICATION v2
// ═══════════════════════════════════════════════════════════
function _rendreGamification(container) {
  const xp       = PM.get(() => Gamification.getXP(),
                     { total:0, pourcentage:0, versProchain:500,
                       niveau:{ emoji:'💪', numero:1, nom:'Débutant' } });
  const trophees = PM.get(() => Gamification.getTrophees(), []);
  const niveaux  = PM.get(() => Gamification.getNiveaux(), [
    {numero:1,nom:'Débutant',      emoji:'🌱',xp:0,    couleur:'#8bf0bb'},
    {numero:2,nom:'Régulier',      emoji:'💪',xp:500,  couleur:'#4b4bf9'},
    {numero:3,nom:'Intermédiaire', emoji:'🔥',xp:1200, couleur:'#f9ef77'},
    {numero:4,nom:'Confirmé',      emoji:'⚡',xp:2500, couleur:'#bfa1ff'},
    {numero:5,nom:'Expert',        emoji:'🏆',xp:5000, couleur:'#ff8d96'},
    {numero:6,nom:'Élite',         emoji:'💎',xp:10000,couleur:'#f9ef77'}
  ]);
  const unlocked = trophees.filter(t=>t.debloquee);

  container.innerHTML = `

    <!-- Hero XP -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;padding:24px 20px;margin-bottom:14px;
                text-align:center;position:relative;overflow:hidden;
                animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;
                  border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>
      <div style="font-size:3rem;margin-bottom:8px">${xp.niveau.emoji}</div>
      <div style="font-size:1.4rem;font-weight:800">${xp.niveau.nom}</div>
      <div style="font-size:.8rem;opacity:.8;margin-top:2px">Niveau ${xp.niveau.numero}</div>
      <div style="font-size:2.5rem;font-weight:800;margin:12px 0 4px;color:var(--fd-lemon)">
        ${xp.total.toLocaleString('fr')}
        <span style="font-size:1rem;color:rgba(255,255,255,.6);font-weight:400">XP</span>
      </div>
      <div class="pm-xp-bar" style="margin:12px 0 6px">
        <div class="pm-xp-fill" style="width:${xp.pourcentage}%"></div>
        <div class="pm-xp-shine"></div>
      </div>
      <div style="font-size:.65rem;opacity:.6">${xp.versProchain} XP pour le niveau suivant</div>
    </div>

    <!-- Niveaux -->
    ${PM.sectionTitle('🗺 Niveaux')}
    <div style="position:relative;padding-left:24px;margin-bottom:14px">
      <div style="position:absolute;left:11px;top:0;bottom:0;width:2px;
                  background:rgba(255,255,255,.06)"></div>
      ${niveaux.map((n,i)=>{
        const atteint = xp.niveau.numero > n.numero;
        const actuel  = xp.niveau.numero === n.numero;
        return `
          <div style="position:relative;margin-bottom:8px;
                      animation:pm-slideIn .3s ${i*.07}s ease both">
            <div style="position:absolute;left:-17px;top:12px;
                        width:12px;height:12px;border-radius:50%;
                        background:${atteint||actuel?n.couleur:'rgba(255,255,255,.1)'};
                        ${actuel?`box-shadow:0 0 8px ${n.couleur}`:''}
                        border:2px solid var(--bg-app,#070714)"></div>
            <div style="background:${actuel?'rgba(75,75,249,.12)':atteint?'rgba(139,240,187,.05)':'rgba(255,255,255,.03)'};
                        border:1px solid ${actuel?'rgba(75,75,249,.3)':atteint?'rgba(139,240,187,.15)':'rgba(255,255,255,.06)'};
                        border-radius:14px;padding:10px 14px;
                        display:flex;align-items:center;gap:10px;
                        opacity:${atteint||actuel?'1':'.45'}">
              <div style="font-size:1.3rem">${n.emoji}</div>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:700">
                  ${n.nom}
                  ${actuel?`<span style="font-size:.58rem;padding:2px 6px;
                    background:rgba(75,75,249,.2);border-radius:99px;
                    color:var(--fd-lavender);margin-left:5px">Actuel</span>`:''}
                </div>
                <div style="font-size:.62rem;color:rgba(255,255,255,.4)">
                  Niv.${n.numero} · ${n.xp.toLocaleString('fr')} XP
                </div>
              </div>
              ${atteint?'<div style="color:var(--fd-mint)">✅</div>':''}
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Trophées -->
    ${PM.sectionTitle(`🏆 Trophées (${unlocked.length}/${trophees.length})`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px">
      ${trophees.slice(0,12).map((t,i)=>`
        <div class="pm-badge ${t.debloquee?'unlocked':''}"
             style="animation:pm-countUp .4s ${i*.05}s ease both"
             onclick="${t.debloquee
               ? `PM.toast('🏆 ${(t.nom||'Trophée').replace(/'/g,"\\'")}','pr')`
               : "PM.toast('🔒 Pas encore débloqué','info')"}">
          <div style="font-size:1.3rem;${!t.debloquee?'filter:grayscale(1);opacity:.25':''}">
            ${t.emoji||'🏆'}
          </div>
          <div style="font-size:.5rem;font-weight:700;line-height:1.2;
                      color:${t.debloquee?'var(--fd-lemon)':'rgba(255,255,255,.3)'}">
            ${t.nom||'???'}
          </div>
        </div>`).join('')}
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// 17. ONBOARDING v2
// ═══════════════════════════════════════════════════════════
function _afficherOnboarding() {
  window._OB = window._OB || {
    etape: 1, total: 6,
    data: { nom:'', poids:80, taille:175, age:25,
            genre:null, objectif:null, niveau:null,
            lieu:null, muscles:new Set() }
  };

  const screen = document.getElementById('onboarding-screen');
  if (!screen) { console.error('[OB] #onboarding-screen introuvable'); return; }

  const d = window._OB.data;
  const e = window._OB.etape;

  const steps = {
    1: {
      titre:'Bienvenue ! ⚡', sous:'Commençons par te connaître',
      html:`
        <label style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.08em;color:rgba(255,255,255,.4);
                      display:block;margin-bottom:6px">TON PRÉNOM *</label>
        <input id="ob-nom" class="ob-input" placeholder="ex: Othmane"
               value="${d.nom}" oninput="window._OB.data.nom=this.value"/>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">
          ${[
            {id:'ob-poids', label:'Poids (kg)', val:d.poids, step:1,   key:'poids'},
            {id:'ob-taille',label:'Taille (cm)',val:d.taille,step:1,   key:'taille'},
            {id:'ob-age',   label:'Âge',        val:d.age,   step:1,   key:'age'}
          ].map(f=>`
            <div>
              <label style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                            letter-spacing:.06em;color:rgba(255,255,255,.4);
                            display:block;margin-bottom:5px">${f.label}</label>
              <input id="${f.id}" class="ob-input"
                     type="number" value="${f.val}" step="${f.step}"
                     style="font-size:1.1rem;padding:12px 4px"
                     oninput="window._OB.data.${f.key}=+this.value"/>
            </div>`).join('')}
        </div>`
    },
    2: {
      titre:'Ton genre 👤', sous:'Pour personnaliser ton programme',
      html:`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${[
            {val:'homme',emoji:'👨',label:'Homme', desc:'Force & Volume'},
            {val:'femme', emoji:'👩',label:'Femme', desc:'Galbe & Mobilité'}
          ].map(g=>`
            <div class="pm-ob-option ${d.genre===g.val?'selected':''}"
                 style="flex-direction:column;text-align:center;padding:24px 12px"
                 onclick="document.querySelectorAll('.pm-ob-option').forEach(e=>e.classList.remove('selected'));
                          this.classList.add('selected');window._OB.data.genre='${g.val}'">
              <div style="font-size:3rem;margin-bottom:10px">${g.emoji}</div>
              <div style="font-size:1rem;font-weight:800;margin-bottom:4px">${g.label}</div>
              <div style="font-size:.7rem;color:rgba(255,255,255,.45)">${g.desc}</div>
            </div>`).join('')}
        </div>`
    },
    3: {
      titre:'Ton objectif 🎯', sous:"Qu'est-ce qui te motive ?",
      html: [
        {val:'masse', emoji:'💪',label:'Prise de masse',  desc:'Volume · Charges lourdes',   c:'#ff4d6d'},
        {val:'perte', emoji:'🔥',label:'Perte de poids',  desc:'Cardio · Déficit calorique', c:'#f9ef77'},
        {val:'seche', emoji:'✂️', label:'Sèche',          desc:'Muscle sec · Brûler graisse',c:'#8bf0bb'},
        {val:'force', emoji:'🏋️',label:'Force pure',      desc:'Charges max · Faibles reps', c:'#bfa1ff'},
        {val:'forme', emoji:'✨',label:'Forme générale',   desc:'Équilibre · Bien-être',      c:'#f9ef77'}
      ].map(o=>`
        <div class="pm-ob-option ${d.objectif===o.val?'selected':''}"
             onclick="document.querySelectorAll('.pm-ob-option').forEach(e=>e.classList.remove('selected'));
                      this.classList.add('selected');window._OB.data.objectif='${o.val}'">
          <div style="width:44px;height:44px;flex-shrink:0;border-radius:12px;
                      background:${o.c}22;border:1px solid ${o.c}33;
                      display:flex;align-items:center;justify-content:center;font-size:1.3rem">
            ${o.emoji}
          </div>
          <div style="flex:1">
            <div style="font-size:.88rem;font-weight:800">${o.label}</div>
            <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-top:2px">${o.desc}</div>
          </div>
          ${d.objectif===o.val?'<div style="color:var(--fd-indigo)">✓</div>':''}
        </div>`).join('')
    },
    4: {
      titre:'Ton niveau 📊', sous:"Pour adapter l'intensité",
      html: [
        {val:'debutant',     emoji:'🌱',label:'Débutant',      desc:'< 1 an · 3 séances/sem'},
        {val:'intermediaire',emoji:'💪',label:'Intermédiaire', desc:'1-3 ans · 4 séances/sem'},
        {val:'avance',       emoji:'🔥',label:'Avancé',        desc:'3+ ans · 5 séances/sem'}
      ].map(n=>`
        <div class="pm-ob-option ${d.niveau===n.val?'selected':''}"
             onclick="document.querySelectorAll('.pm-ob-option').forEach(e=>e.classList.remove('selected'));
                      this.classList.add('selected');window._OB.data.niveau='${n.val}'">
          <div style="width:52px;height:52px;flex-shrink:0;border-radius:14px;
                      background:rgba(75,75,249,.15);border:1px solid rgba(75,75,249,.2);
                      display:flex;align-items:center;justify-content:center;font-size:1.6rem">
            ${n.emoji}
          </div>
          <div style="flex:1">
            <div style="font-size:.95rem;font-weight:800">${n.label}</div>
            <div style="font-size:.68rem;color:rgba(255,255,255,.4);margin-top:3px">${n.desc}</div>
          </div>
          ${d.niveau===n.val?'<div style="color:var(--fd-indigo);font-size:1.2rem">✓</div>':''}
        </div>`).join('')
    },
    5: {
      titre:"Où tu t'entraînes ? 📍", sous:'Pour adapter les exercices',
      html: [
        {val:'salle',    emoji:'🏋️',label:'Salle de sport',desc:'Tous les équipements',   bonus:'Machines + Câbles + Rack'},
        {val:'maison',   emoji:'🏠',label:'À la maison',   desc:'Haltères, élastiques',   bonus:'Exercices adaptés'},
        {val:'exterieur',emoji:'🌳',label:'En extérieur',  desc:'Parcs, barres, cardio',  bonus:'Poids de corps + Cardio'}
      ].map(l=>`
        <div class="pm-ob-option ${d.lieu===l.val?'selected':''}"
             onclick="document.querySelectorAll('.pm-ob-option').forEach(e=>e.classList.remove('selected'));
                      this.classList.add('selected');window._OB.data.lieu='${l.val}'">
          <div style="width:52px;height:52px;flex-shrink:0;border-radius:14px;
                      background:rgba(139,240,187,.1);border:1px solid rgba(139,240,187,.2);
                      display:flex;align-items:center;justify-content:center;font-size:2rem">
            ${l.emoji}
          </div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:800">${l.label}</div>
            <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-top:2px">${l.desc}</div>
            <div style="font-size:.62rem;color:var(--fd-mint);margin-top:3px;font-weight:600">
              ✅ ${l.bonus}
            </div>
          </div>
          ${d.lieu===l.val?'<div style="color:var(--fd-mint);font-size:1.2rem">✓</div>':''}
        </div>`).join('')
    },
    6: {
      titre:'🧠 Ton programme IA', sous:'Personnalisé pour toi',
      html:`
        <div style="background:rgba(75,75,249,.08);border:1px solid rgba(75,75,249,.2);
                    border-left:3px solid var(--fd-indigo);
                    border-radius:14px;padding:14px 16px;margin-bottom:16px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:6px">
            🤖 Coach IA
          </div>
          <p style="font-size:.8rem;color:rgba(255,255,255,.75);line-height:1.6;margin:0">
            ${d.nom?d.nom+',':'Bienvenue,'} j'ai créé un programme
            ${d.objectif==='masse'?'Push/Pull/Legs pour ta prise de masse':
              d.objectif==='perte'?'Full Body pour perdre du poids':
              d.objectif==='force'?'de force pure 5×5':
              d.objectif==='seche'?'de sèche avec supersets':
              'équilibré corps complet'}.
            ${d.niveau==='debutant'?'3 séances/sem pour bien débuter.':
              d.niveau==='avance'  ?'5 séances/sem pour maximiser.':
              '4 séances/sem adaptées.'} 💪
          </p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px">
          ${[
            {l:d.genre==='femme'?'👩 Femme':'👨 Homme',c:'#bfa1ff'},
            {l:d.niveau==='debutant'?'🌱 Débutant':d.niveau==='avance'?'🔥 Avancé':'💪 Inter.',c:'#4b4bf9'},
            {l:d.objectif==='masse'?'💪 Masse':d.objectif==='perte'?'🔥 Perte':
              d.objectif==='force'?'🏋️ Force':d.objectif==='seche'?'✂️ Sèche':'✨ Forme',c:'#ff4d6d'},
            {l:d.lieu==='salle'?'🏋️ Salle':d.lieu==='maison'?'🏠 Maison':'🌳 Extérieur',c:'#8bf0bb'}
          ].map(b=>`
            <span style="padding:4px 10px;background:${b.c}22;border:1px solid ${b.c}44;
                         border-radius:99px;font-size:.62rem;font-weight:700;color:${b.c}">
              ${b.l}
            </span>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
          <button onclick="window._OB.etape=1;_afficherOnboarding()"
                  style="padding:12px;background:rgba(255,255,255,.06);
                         border:1px solid rgba(255,255,255,.1);border-radius:12px;
                         font-size:.75rem;font-weight:700;
                         color:rgba(255,255,255,.5);cursor:pointer">
            ✏️ Modifier
          </button>
          <button onclick="PM.obTerminer()"
                  style="padding:12px;background:var(--fd-mint);border:none;
                         border-radius:12px;font-size:.85rem;font-weight:800;
                         color:#09092d;cursor:pointer;
                         box-shadow:0 4px 16px rgba(139,240,187,.4)">
            ✅ Adopter ce programme !
          </button>
        </div>`
    }
  };

  const step = steps[e] || steps[1];

  screen.style.cssText = `
    display:flex !important;
    flex-direction:column;
    pointer-events:all;
    z-index:200;
  `;

  screen.innerHTML = `
    <div class="ob-wrap">
      <!-- Steps dots -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <div style="display:flex;gap:5px">
          ${Array.from({length:window._OB.total},(_,i)=>`
            <div class="ob-step-dot ${i+1===e?'active':i+1<e?'done':'todo'}"></div>`).join('')}
        </div>
        ${e>1?`
          <button onclick="window._OB.etape--;_afficherOnboarding()"
                  style="background:none;border:none;font-size:.8rem;
                         color:rgba(255,255,255,.4);cursor:pointer;padding:4px 8px">
            ← Retour
          </button>`:'<div></div>'}
      </div>

      <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:6px">
        Étape ${e} / ${window._OB.total}
      </div>
      <div style="font-size:1.5rem;font-weight:800;letter-spacing:-.02em;
                  margin-bottom:6px;color:white">${step.titre}</div>
      <div style="font-size:.82rem;color:rgba(255,255,255,.45);
                  margin-bottom:20px;line-height:1.5">${step.sous}</div>

      <div style="flex:1">${step.html}</div>

      <div style="margin-top:auto;padding-top:20px">
        ${e < window._OB.total ? `
          <button class="ob-btn-next" onclick="PM.obSuivant()">
            ${e===window._OB.total-1?'Voir mon programme →':'Suivant →'}
          </button>` : ''}
        ${e>1?`
          <button class="ob-btn-back"
                  onclick="window._OB.etape--;_afficherOnboarding()">
            ← Retour
          </button>`:''}
      </div>
    </div>
  `;
}

// Onboarding helpers
PM.obSuivant = function() {
  const d = window._OB.data;
  const e = window._OB.etape;
  if (e===1 && !d.nom.trim())    { PM.toast('Entre ton prénom !','error'); PM.sons.erreur(); return; }
  if (e===2 && !d.genre)         { PM.toast('Sélectionne ton genre','error'); PM.sons.erreur(); return; }
  if (e===3 && !d.objectif)      { PM.toast('Choisis ton objectif','error'); PM.sons.erreur(); return; }
  if (e===4 && !d.niveau)        { PM.toast('Choisis ton niveau','error'); PM.sons.erreur(); return; }
  if (e===5 && !d.lieu)          { PM.toast('Choisis ton lieu','error'); PM.sons.erreur(); return; }
  PM.sons.clic();
  window._OB.etape++;
  _afficherOnboarding();
};

PM.obTerminer = function() {
  const d = window._OB.data;
  const profil = {
    nom: d.nom||'Athlète', poids:d.poids, taille:d.taille, age:d.age,
    genre:d.genre||'homme', objectif:d.objectif||'forme',
    niveau:d.niveau||'intermediaire', lieu:d.lieu||'salle',
    muscles_cibles:[...(d.muscles||new Set())],
    avatar:'💪', dateCreation:new Date().toISOString().split('T')[0]
  };
  try {
    if (typeof Utils?.storage?.set === 'function') {
      Utils.storage.set('ft_profil', profil);
      Utils.storage.set('ft_profil_onboarding', profil);
    } else {
      localStorage.setItem('ft_profil', JSON.stringify(profil));
      localStorage.setItem('ft_profil_onboarding', JSON.stringify(profil));
    }
  } catch(e) { console.error('[OB]', e); }
  try { Programme.genererProgramme?.(profil); } catch(e) {}
  try { Coach.genererProgramme?.(profil);     } catch(e) {}

  const screen = document.getElementById('onboarding-screen');
  if (screen) { screen.style.display='none'; screen.style.pointerEvents='none'; }
  const app = document.getElementById('app-wrapper');
  if (app) { app.style.display='flex'; app.style.pointerEvents='all'; }

  PM.sons.niveau();
  PM.confetti();
  PM.toast(`Bienvenue ${profil.nom} ! 🎉\nTon programme est prêt !`,'success',4000);
  setTimeout(() => { try { naviguer('home'); } catch(e) {} }, 400);
};

// ═══════════════════════════════════════════════════════════
// 18. INIT — Splash + Navbar + Header
// ═══════════════════════════════════════════════════════════
(function initPremium() {

  function boot() {
    // Splash
    PM.splash.show();

    // Attendre que le DOM soit prêt
    setTimeout(() => {
      PM.navbar.render();
      PM.header.render();
      PM.splash.hide();

      // Override naviguer pour sync navbar
      const _navOrig = window.naviguer;
      if (typeof _navOrig === 'function') {
        window.naviguer = function(page, opts) {
          PM.navbar.setActive(page);
          PM.header.update();
          return _navOrig(page, opts);
        };
      }

      console.log('✅ UI Premium Final — Tous systèmes opérationnels');
    }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();

// ═══════════════════════════════════════════════════════════
// 19. EXPORT GLOBAL
// ═══════════════════════════════════════════════════════════
window.PM                  = PM;
window._rendreHome         = _rendreHome;
window._rendreLive         = _rendreLive;
window._rendreStats        = _rendreStats;
window._rendreTraining     = _rendreTraining;
window._rendreProfil       = _rendreProfil;
window._rendreCoach        = _rendreCoach;
window._rendreDefis        = _rendreDefis;
window._rendreNutrition    = _rendreNutrition;
window._rendreGamification = _rendreGamification;
window._afficherOnboarding = _afficherOnboarding;

console.log('✅ UI Premium Final v1.0 chargé — 19 modules');
