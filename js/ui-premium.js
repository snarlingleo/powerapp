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
// 3. SONS UI — Fusion sounds.js v2.0
// ═══════════════════════════════════════════════════════════
const Sounds = {

  CLE_CONFIG: 'ft_sounds_config',
  _ctx: null,

  getConfig() {
    return PM.get(() => Utils.storage.get(this.CLE_CONFIG, {
      actif: true, volume: 0.6,
      haptic: true, animations: true
    }), { actif:true, volume:0.6, haptic:true, animations:true });
  },

  setConfig(data) {
    const cfg = { ...this.getConfig(), ...data };
    try { Utils.storage.set(this.CLE_CONFIG, cfg); } catch(e) {}
    return cfg;
  },

  _getCtx() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    if (this._ctx.state === 'suspended') this._ctx.resume().catch(() => {});
    return this._ctx;
  },

  _jouerNote(freq, duree, type = 'sine', volume = 0.3, delai = 0) {
    try {
      const cfg = this.getConfig();
      if (!cfg.actif) return;
      const ctx = this._getCtx();
      if (!ctx) return;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delai);
      const vol   = cfg.volume * volume;
      const start = ctx.currentTime + delai;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duree);
      osc.start(start);
      osc.stop(start + duree + 0.05);
    } catch(e) {}
  },

  _jouerAcord(notes, type = 'sine', volume = 0.3) {
    notes.forEach(([freq, delai, duree]) => {
      this._jouerNote(freq, duree, type, volume, delai);
    });
  },

  SONS: {
    success:     () => Sounds._jouerAcord([[523,.00,.15],[659,.10,.15],[784,.20,.25]],'sine',.3),
    error:       () => Sounds._jouerAcord([[200,.00,.15],[150,.12,.15]],'sawtooth',.2),
    serie:       () => Sounds._jouerNote(880,.08,'sine',.25),
    pr:          () => Sounds._jouerAcord([[392,.00,.12],[523,.06,.12],[659,.12,.12],[784,.18,.12],[1047,.24,.30]],'sine',.35),
    levelup:     () => Sounds._jouerAcord([[523,.00,.10],[659,.08,.10],[784,.16,.10],[1047,.24,.10],[1319,.32,.40]],'triangle',.4),
    trophee:     () => Sounds._jouerAcord([[784,.00,.15],[880,.10,.15],[988,.20,.15],[1047,.30,.40]],'sine',.35),
    tick:        () => Sounds._jouerNote(1200,.05,'square',.15),
    repos_start: () => Sounds._jouerAcord([[659,.00,.12],[523,.10,.20]],'sine',.25),
    repos_fin:   () => Sounds._jouerAcord([[523,.00,.10],[659,.08,.10],[784,.16,.20]],'sine',.3),
    clic:        () => Sounds._jouerNote(440,.04,'sine',.1),
    seance_fin:  () => Sounds._jouerAcord([[523,.00,.12],[659,.10,.12],[784,.20,.12],[1047,.30,.12],[784,.42,.12],[1047,.52,.40]],'sine',.4),
    defi:        () => Sounds._jouerAcord([[392,.00,.10],[494,.08,.10],[587,.16,.10],[784,.24,.30]],'triangle',.35),
    notif:       () => Sounds._jouerAcord([[880,.00,.08],[1100,.10,.12]],'sine',.2),
    countdown_3: () => Sounds._jouerNote(440,.1,'square',.2),
    countdown_2: () => Sounds._jouerNote(520,.1,'square',.22),
    countdown_1: () => Sounds._jouerNote(660,.1,'square',.25),
    countdown_go:() => Sounds._jouerAcord([[660,.00,.1],[880,.08,.2]],'square',.35)
  },

  jouer(nom, force = false) {
    try {
      const cfg = this.getConfig();
      if (!cfg.actif && !force) return;
      const son = this.SONS[nom];
      if (son) son();
    } catch(e) {}
  },

  PATTERNS: {
    leger:    [10],
    moyen:    [30],
    fort:     [100],
    double:   [30,50,30],
    triple:   [30,30,30,30,30],
    success:  [10,50,10,50,100],
    pr:       [50,50,50,50,200],
    levelup:  [100,50,100,50,200],
    erreur:   [200],
    countdown:[30,50,30,50,30,50,100]
  },

  vibrer(pattern = 'moyen') {
    try {
      const cfg = this.getConfig();
      if (!cfg.haptic) return;
      const p = typeof pattern === 'string'
        ? (this.PATTERNS[pattern] || [30]) : pattern;
      if (navigator.vibrate) navigator.vibrate(p);
    } catch(e) {}
  },

  confetti(dureeMs = 3000, intensite = 'normal') {
    const cfg = this.getConfig();
    if (!cfg.animations) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position:fixed;inset:0;z-index:9998;
      pointer-events:none;width:100%;height:100%`;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx     = canvas.getContext('2d');
    const couleurs = ['#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff','#ff8d96','#fff','#ffa500'];
    const nb = intensite==='burst'?200:intensite==='fort'?150:intensite==='leger'?50:100;

    const particules = Array.from({ length:nb }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      w: Math.random() * 12 + 4,
      h: Math.random() * 6  + 2,
      color: couleurs[Math.floor(Math.random() * couleurs.length)],
      vx: (Math.random() - .5) * 4,
      vy: Math.random() * 4 + 2,
      vr: (Math.random() - .5) * .3,
      r:  Math.random() * Math.PI * 2,
      op: 1,
      forme: Math.random() > .5 ? 'rect' : 'cercle'
    }));

    let t0 = null;
    const animer = ts => {
      if (!t0) t0 = ts;
      const el = ts - t0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particules.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += .08;
        if (el > dureeMs * .7)
          p.op = Math.max(0, 1-(el-dureeMs*.7)/(dureeMs*.3));
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        if (p.forme === 'cercle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w/2, 0, Math.PI*2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        }
        ctx.restore();
      });
      if (el < dureeMs) requestAnimationFrame(animer);
      else canvas.remove();
    };
    requestAnimationFrame(animer);
  },

  celebrerPR(nomExo = '', valeur = 0) {
    this.jouer('pr');
    this.vibrer('pr');
    this.confetti(4000, 'fort');

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9997;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      background:rgba(9,9,45,.85);
      animation:pm-fadeIn .3s ease;pointer-events:none`;
    overlay.innerHTML = `
      <div style="text-align:center;animation:pm-ringPop .4s ease">
        <div style="font-size:4rem;margin-bottom:8px">🏆</div>
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.2em;
                    color:var(--fd-lemon);margin-bottom:6px">
          NOUVEAU RECORD !
        </div>
        <div style="font-size:1.8rem;font-weight:900;color:var(--fd-lemon)">
          ${nomExo}
        </div>
        ${valeur ? `
          <div style="font-size:3rem;font-weight:900;color:white;margin:8px 0">
            ${valeur}kg
          </div>` : ''}
        <div style="font-size:.75rem;color:rgba(255,255,255,.5);margin-top:4px">
          1RM personnel battu ! 💪
        </div>
      </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 3500);
  },

  celebrerSeanceFin() {
    this.jouer('seance_fin');
    this.vibrer('levelup');
    this.confetti(3000, 'normal');
  },

  celebrerLevelUp() {
    this.jouer('levelup');
    this.vibrer('levelup');
    this.confetti(5000, 'burst');
  },

  celebrerStreak(jours = 0) {
    this.jouer('success');
    this.vibrer('success');
    if (jours % 7 === 0) this.confetti(2000, 'fort');
  },

  pulser(element, couleur = '#4b4bf9', dureeMs = 600) {
    if (!element) return;
    element.style.transition = `box-shadow ${dureeMs/2}ms ease`;
    element.style.boxShadow  = `0 0 0 8px ${couleur}44,0 0 0 16px ${couleur}22`;
    setTimeout(() => element.style.boxShadow = '', dureeMs/2);
  },

  secouer(element) {
    if (!element) return;
    element.style.animation = 'pm-shake .4s ease';
    setTimeout(() => element.style.animation = '', 400);
  },

  compteARebours(cb, dureeMs = 3000) {
    const cfg    = this.getConfig();
    const etapes = [3, 2, 1, '🚀'];
    etapes.forEach((val, i) => {
      setTimeout(() => {
        if (cfg.actif) {
          const map = {3:'countdown_3',2:'countdown_2',1:'countdown_1'};
          this.jouer(map[val] || 'countdown_go', true);
        }
        if (val !== '🚀') this.vibrer('leger');
        else this.vibrer('fort');
        if (cfg.animations) {
          const div = document.createElement('div');
          div.style.cssText = `
            position:fixed;inset:0;z-index:9999;
            display:flex;align-items:center;justify-content:center;
            pointer-events:none;background:rgba(9,9,45,.7)`;
          div.innerHTML = `
            <div style="font-size:8rem;font-weight:900;
                        color:${val==='🚀'?'var(--fd-mint)':'white'};
                        text-shadow:0 0 40px rgba(75,75,249,.8)">
              ${val}
            </div>`;
          document.body.appendChild(div);
          setTimeout(() => div.remove(), 900);
        }
        if (val === '🚀' && cb) setTimeout(cb, 300);
      }, i * (dureeMs / etapes.length));
    });
  },

  renderSettings(container) {
    if (!container) return;
    const cfg = this.getConfig();
    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">🔊 Sons & Animations</div>
        <div style="display:flex;align-items:center;gap:12px;
                    padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Sons activés</div>
            <div style="font-size:.65rem;color:var(--text-muted)">Feedback sonore</div>
          </div>
          <input type="checkbox" id="son-actif" ${cfg.actif?'checked':''}
                 onchange="Sounds.setConfig({actif:this.checked});Sounds.jouer('clic',true)"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>
        <div style="padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <div style="font-size:.82rem;font-weight:700">Volume</div>
            <span id="vol-label" style="font-size:.78rem;color:var(--fd-indigo);font-weight:700">
              ${Math.round(cfg.volume*100)}%
            </span>
          </div>
          <input type="range" id="son-volume" min="0" max="1" step="0.1" value="${cfg.volume}"
                 oninput="document.getElementById('vol-label').textContent=
                   Math.round(this.value*100)+'%';
                   Sounds.setConfig({volume:parseFloat(this.value)});
                   Sounds.jouer('clic',true)"
                 style="width:100%;accent-color:var(--fd-indigo)"/>
        </div>
        <div style="display:flex;align-items:center;gap:12px;
                    padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Vibrations</div>
            <div style="font-size:.65rem;color:var(--text-muted)">Retour haptique</div>
          </div>
          <input type="checkbox" id="haptic-actif" ${cfg.haptic?'checked':''}
                 onchange="Sounds.setConfig({haptic:this.checked})"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Animations</div>
            <div style="font-size:.65rem;color:var(--text-muted)">Confetti, célébrations</div>
          </div>
          <input type="checkbox" id="anim-actif" ${cfg.animations?'checked':''}
                 onchange="Sounds.setConfig({animations:this.checked})"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>
      </div>
      <div class="card">
        <div class="card-label mb-md">🎵 Tester les sons</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[
            {son:'serie',     label:'Série validée', emoji:'✅'},
            {son:'pr',        label:'Nouveau PR',    emoji:'🏆'},
            {son:'levelup',   label:'Level Up',      emoji:'⭐'},
            {son:'trophee',   label:'Trophée',       emoji:'🎖️'},
            {son:'repos_fin', label:'Repos terminé', emoji:'⏱️'},
            {son:'seance_fin',label:'Séance finie',  emoji:'💪'}
          ].map(t=>`
            <button onclick="Sounds.jouer('${t.son}',true)"
                    style="padding:10px;background:rgba(255,255,255,.04);
                           border:1px solid rgba(255,255,255,.08);
                           border-radius:12px;font-size:.75rem;font-weight:600;
                           color:var(--text-primary,white);cursor:pointer">
              ${t.emoji} ${t.label}
            </button>`).join('')}
        </div>
      </div>`;
  }
};

window.Sounds = Sounds;

// Bridge PM.sons → Sounds
PM.sons = {
  clic()   { Sounds.jouer('clic');      },
  succes() { Sounds.jouer('success');   },
  erreur() { Sounds.jouer('error');     },
  timer()  { Sounds.jouer('repos_fin'); },
  pr()     { Sounds.celebrerPR();       },
  niveau() { Sounds.jouer('levelup');   }
};

PM.confetti = (duree) => Sounds.confetti(duree || 3000, 'fort');

// ═══════════════════════════════════════════════════════════
// 7. TIMER MANAGER — Fusion timer-manager.js v2.0
// ═══════════════════════════════════════════════════════════
const TimerManager = {

  _timerInterval:     null,
  _secondesRestantes: 0,
  _dureeInitiale:     0,
  _phase:             null,
  _enPause:           false,
  _alarmeInterval:    null,
  _poidsActuel:       null,
  _repsActuel:        null,
  _nomExo:            null,
  CLE_ALARME:         'ft_alarme_rappel',

  // ── Timer reps ──
  lancerTimerReps(exoIdx, serieIdx, poids = null, reps = null, nomExo = null) {
    this._poidsActuel = poids;
    this._repsActuel  = reps;
    this._nomExo      = nomExo;
    this._afficherOverlay('reps', 40, exoIdx, serieIdx);
    this._demarrer(40, 'reps');
  },

  // ── Timer repos ──
  demarrerRepos(secondes = 75) {
    this._fermerOverlay();
    this._afficherOverlay('repos', secondes);
    this._demarrer(secondes, 'repos');
  },

  // ── Core ──
  _demarrer(secondes, phase) {
    this._arreter();
    this._secondesRestantes = secondes;
    this._dureeInitiale     = secondes;
    this._phase             = phase;
    this._enPause           = false;
    this._mettreAJourDisplay();
    this._mettreAJourCercle();

    this._timerInterval = setInterval(() => {
      if (this._enPause) return;
      this._secondesRestantes--;
      this._mettreAJourDisplay();
      this._mettreAJourCercle();

      if (this._secondesRestantes <= 3 && this._secondesRestantes > 0) {
        Sounds.jouer('tick');
        Sounds.vibrer('leger');
      }
      if (this._secondesRestantes <= 0) this._finTimer();
    }, 1000);
  },

  _arreter() {
    if (this._timerInterval) {
      clearInterval(this._timerInterval);
      this._timerInterval = null;
    }
  },

  _finTimer() {
    this._arreter();
    const phase = this._phase;
    Sounds.jouer(phase === 'repos' ? 'repos_fin' : 'countdown_go');
    Sounds.vibrer([200, 100, 200]);
    if (phase === 'repos') {
      PM.toast('✅ Repos terminé — Go !', 'success', 2000);
    } else {
      PM.toast('⏹ Timer terminé !', 'info', 1500);
    }
    setTimeout(() => this._fermerOverlay(), 1500);
  },

  // ── Overlay ──
  _afficherOverlay(phase, duree, exoIdx = null, serieIdx = null) {
    this._dureeInitiale = duree;
    document.getElementById('timer-overlay-full')?.remove();

    const couleur = phase === 'reps' ? 'var(--fd-indigo)' : 'var(--fd-mint)';
    const label   = phase === 'reps' ? '⚡ EFFORT' : '😴 REPOS';
    const circ    = 2 * Math.PI * 60;

    const overlay = document.createElement('div');
    overlay.id    = 'timer-overlay-full';
    overlay.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,60px) + 8px);
      left:50%;transform:translateX(-50%);
      width:calc(100% - 32px);max-width:380px;
      background:var(--bg-card,#12122a);
      border:2px solid ${couleur};border-radius:20px;
      padding:16px;z-index:800;
      box-shadow:0 8px 32px rgba(0,0,0,.4);
      animation:pm-slideUp .3s ease`;

    overlay.innerHTML = `
      <div style="display:flex;align-items:center;
                  justify-content:space-between;margin-bottom:12px">
        <div style="font-size:.75rem;font-weight:800;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:${couleur}">${label}</div>
        <button onclick="TimerManager._fermerOverlay()"
                style="background:none;border:none;
                       color:rgba(255,255,255,.4);font-size:1rem;cursor:pointer">
          ✕
        </button>
      </div>

      ${(this._nomExo || this._poidsActuel !== null) ? `
        <div style="text-align:center;margin-bottom:10px">
          ${this._nomExo ? `
            <div style="font-size:.82rem;font-weight:700;
                        color:white;margin-bottom:4px">
              ${this._nomExo}
            </div>` : ''}
          ${this._poidsActuel !== null ? `
            <div style="display:inline-flex;align-items:center;gap:8px;
                        padding:8px 20px;background:rgba(75,75,249,.15);
                        border:1px solid rgba(75,75,249,.3);border-radius:99px">
              <span style="font-size:1.3rem;font-weight:800;
                           color:var(--fd-indigo)">${this._poidsActuel}kg</span>
              <span style="color:rgba(255,255,255,.4)">×</span>
              <span style="font-size:1.3rem;font-weight:800;
                           color:var(--fd-lemon)">${this._repsActuel||'—'}</span>
            </div>` : ''}
        </div>` : ''}

      <div style="position:relative;width:140px;height:140px;margin:0 auto 12px">
        <svg width="140" height="140" style="transform:rotate(-90deg)">
          <circle cx="70" cy="70" r="60" fill="none"
                  stroke="rgba(255,255,255,.06)" stroke-width="8"/>
          <circle cx="70" cy="70" r="60" fill="none"
                  stroke="${couleur}" stroke-width="8"
                  stroke-linecap="round"
                  stroke-dasharray="${circ}" stroke-dashoffset="0"
                  id="timer-circle-arc"
                  style="transition:stroke-dashoffset .9s linear;
                         filter:drop-shadow(0 0 6px ${couleur})"/>
        </svg>
        <div style="position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%);text-align:center">
          <div id="timer-overlay-display"
               style="font-size:2.2rem;font-weight:800;
                      color:${couleur};
                      font-variant-numeric:tabular-nums;line-height:1">
            ${this._formaterTemps(duree)}
          </div>
          <div style="font-size:.6rem;color:rgba(255,255,255,.4)">sec</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:8px;margin-bottom:10px">
        <button onclick="TimerManager._togglePause()" id="timer-btn-pause"
                style="padding:10px 4px;background:rgba(75,75,249,.15);
                       border:1px solid var(--fd-indigo);border-radius:99px;
                       color:var(--fd-indigo);font-size:.75rem;
                       font-weight:700;cursor:pointer">
          ⏸ Pause
        </button>
        <button onclick="TimerManager._ajouter(15)"
                style="padding:10px 4px;background:rgba(255,255,255,.06);
                       border:1px solid rgba(255,255,255,.12);border-radius:99px;
                       color:rgba(255,255,255,.7);font-size:.75rem;
                       font-weight:700;cursor:pointer">
          +15s
        </button>
        <button onclick="TimerManager._arreterEtFermer()"
                style="padding:10px 4px;background:rgba(255,141,150,.15);
                       border:1px solid var(--fd-coral);border-radius:99px;
                       color:var(--fd-coral);font-size:.75rem;
                       font-weight:700;cursor:pointer">
          ✕ Stop
        </button>
      </div>

      ${phase === 'repos' ? `
        <div style="display:flex;gap:6px">
          ${[45,60,90,120].map(s=>`
            <button onclick="TimerManager._resetAvec(${s})"
                    data-preset="${s}"
                    style="flex:1;padding:6px 2px;font-size:.68rem;font-weight:700;
                           background:${s===duree?couleur:'rgba(255,255,255,.06)'};
                           color:${s===duree?'#09092d':'rgba(255,255,255,.4)'};
                           border:1px solid ${s===duree?couleur:'rgba(255,255,255,.1)'};
                           border-radius:99px;cursor:pointer">
              ${s}s
            </button>`).join('')}
        </div>` : ''}

      ${phase === 'reps' ? `
        <div style="margin-bottom:8px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.08em;color:rgba(255,255,255,.4);
                      text-align:center;margin-bottom:6px">MODIFIER CHARGE</div>
          <div style="display:flex;align-items:center;justify-content:center;gap:12px">
            <button onclick="TimerManager._modifierPoids(-2.5)"
                    style="width:60px;height:44px;background:rgba(255,141,150,.15);
                           border:1px solid var(--fd-coral);border-radius:12px;
                           color:var(--fd-coral);font-size:.85rem;font-weight:700;cursor:pointer">
              −2.5
            </button>
            <div id="timer-poids-display"
                 style="font-size:1.4rem;font-weight:800;
                        color:var(--fd-indigo);min-width:80px;text-align:center">
              ${this._poidsActuel !== null ? `${this._poidsActuel}kg` : '—kg'}
            </div>
            <button onclick="TimerManager._modifierPoids(2.5)"
                    style="width:60px;height:44px;background:rgba(139,240,187,.1);
                           border:1px solid var(--fd-mint);border-radius:12px;
                           color:var(--fd-mint);font-size:.85rem;font-weight:700;cursor:pointer">
              +2.5
            </button>
          </div>
        </div>` : ''}
    `;
    document.body.appendChild(overlay);
  },

  _fermerOverlay() {
    this._arreter();
    const el = document.getElementById('timer-overlay-full');
    if (el) {
      el.style.animation = 'pm-toastOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  _arreterEtFermer() { this._fermerOverlay(); },

  _togglePause() {
    this._enPause = !this._enPause;
    const btn = document.getElementById('timer-btn-pause');
    if (btn) {
      btn.textContent       = this._enPause ? '▶ Go'         : '⏸ Pause';
      btn.style.color       = this._enPause ? 'var(--fd-coral)' : 'var(--fd-indigo)';
      btn.style.borderColor = this._enPause ? 'var(--fd-coral)' : 'var(--fd-indigo)';
    }
    Sounds.vibrer('leger');
  },

  _ajouter(secondes) {
    this._secondesRestantes = Math.min(this._secondesRestantes + secondes, 600);
    this._dureeInitiale     = Math.max(this._dureeInitiale, this._secondesRestantes);
    this._mettreAJourDisplay();
    this._mettreAJourCercle();
    Sounds.vibrer('leger');
  },

  _modifierPoids(delta) {
    if (this._poidsActuel === null) this._poidsActuel = 0;
    this._poidsActuel = Math.max(0, Math.round((this._poidsActuel + delta) * 10) / 10);
    const el = document.getElementById('timer-poids-display');
    if (el) el.textContent = `${this._poidsActuel}kg`;
    window._timerPoidsModifie = this._poidsActuel;
    Sounds.vibrer('leger');
    PM.toast(`Charge : ${this._poidsActuel}kg`, 'info', 800);
  },

  _resetAvec(secondes) {
    this._arreter();
    this._dureeInitiale = secondes;
    document.querySelectorAll('[data-preset]').forEach(btn => {
      const actif = parseInt(btn.dataset.preset) === secondes;
      const c     = 'var(--fd-mint)';
      btn.style.background  = actif ? c                      : 'rgba(255,255,255,.06)';
      btn.style.color       = actif ? '#09092d'              : 'rgba(255,255,255,.4)';
      btn.style.borderColor = actif ? c                      : 'rgba(255,255,255,.1)';
    });
    this._demarrer(secondes, this._phase || 'repos');
  },

  _mettreAJourDisplay() {
    const el = document.getElementById('timer-overlay-display');
    if (el) el.textContent = this._formaterTemps(Math.max(0, this._secondesRestantes));
  },

  _mettreAJourCercle() {
    const arc = document.getElementById('timer-circle-arc');
    if (!arc) return;
    const pct  = Math.max(0, this._secondesRestantes / (this._dureeInitiale || 1));
    const circ = 2 * Math.PI * 60;
    arc.style.strokeDashoffset = circ * (1 - pct);
  },

  _formaterTemps(s) {
    s = Math.max(0, Math.round(s));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}:${String(r).padStart(2,'0')}` : String(s);
  },

  // ── Alarme ──
  getAlarme() {
    return PM.get(() => Utils.storage.get(this.CLE_ALARME, {
      active:false, heure:'18:00',
      message:"⚡ C'est l'heure de t'entraîner !",
      repetitions:3
    }), { active:false, heure:'18:00',
          message:"⚡ C'est l'heure !",repetitions:3 });
  },

  sauvegarderAlarme(data) {
    try { Utils.storage.set(this.CLE_ALARME, data); } catch(e) {}
    try {
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage(
          data.active
            ? { type:'PLANIFIER_ALARME', payload:{ heure:data.heure, message:data.message, repetitions:data.repetitions||3 } }
            : { type:'ANNULER_ALARME' }
        );
      }
    } catch(e) {}
    if (data.active) this._planifierAlarme(data.heure);
    else this._annulerAlarme();
  },

  _planifierAlarme(heure) {
    this._annulerAlarme();
    this._alarmeInterval = setInterval(() => {
      const now    = new Date();
      const [h, m] = heure.split(':').map(Number);
      const alarme = this.getAlarme();
      if (!alarme.active) return;
      if (now.getHours()===h && now.getMinutes()===m && now.getSeconds()<=10) {
        const cle = `ft_alarme_done_${new Date().toISOString().split('T')[0]}`;
        if (PM.get(()=>Utils.storage.get(cle), false)) return;
        try { Utils.storage.set(cle, true); } catch(e) {}
        this._declencherAlarme(alarme);
      }
    }, 5000);
  },

  _annulerAlarme() {
    if (this._alarmeInterval) {
      clearInterval(this._alarmeInterval);
      this._alarmeInterval = null;
    }
  },

  _declencherAlarme(alarme) {
    const msg  = alarme.message || "⚡ C'est l'heure de t'entraîner !";
    const reps = alarme.repetitions || 3;
    Array.from({length:reps}, (_,i) => i * 120000).forEach(delai => {
      setTimeout(() => {
        const check = this.getAlarme();
        if (!check.active) return;
        try {
          if (Notification.permission === 'granted') {
            new Notification('⚡ PowerApp — Go !', {
              body:msg, vibrate:[500,200,500,200,500],
              requireInteraction:true, tag:'powerapp-alarme'
            });
          }
        } catch(e) {}
        PM.toast(`⏰ ${msg}`, 'success', 15000);
        Sounds.vibrer([500,200,500,200,500]);
        this._jouerSonAlarme();
      }, delai);
    });
  },

  _jouerSonAlarme() {
    [0, 800, 1600].forEach(delai => {
      setTimeout(() => {
        try {
          const ctx  = new (window.AudioContext || window.webkitAudioContext)();
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(880,  ctx.currentTime);
          osc.frequency.setValueAtTime(1100, ctx.currentTime + .15);
          osc.frequency.setValueAtTime(880,  ctx.currentTime + .30);
          gain.gain.setValueAtTime(1.0, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .6);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + .6);
        } catch(e) {}
      }, delai);
    });
  },

  async initAlarme() {
    const alarme = this.getAlarme();
    if (alarme.active) {
      this._planifierAlarme(alarme.heure);
      try {
        const reg = await navigator.serviceWorker?.ready;
        reg?.active?.postMessage({
          type:'PLANIFIER_ALARME',
          payload:{ heure:alarme.heure, message:alarme.message, repetitions:alarme.repetitions||3 }
        });
      } catch(e) {}
    }
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    } catch(e) {}
  },

  renderAlarme(container) {
    if (!container) return;
    const alarme = this.getAlarme();
    container.innerHTML = `
      <div class="card mb-md"
           style="border-color:${alarme.active?'var(--fd-lemon)':'var(--border-color)'}">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:16px">
          <div>
            <div class="card-label" style="margin:0">⏰ Rappel entraînement</div>
            <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">
              Notification quotidienne à heure fixe
            </div>
          </div>
          <div onclick="TimerManager._toggleAlarme(${!alarme.active})"
               style="position:relative;width:48px;height:26px;cursor:pointer">
            <div style="position:absolute;inset:0;
                        background:${alarme.active?'var(--fd-lemon)':'rgba(255,255,255,.1)'};
                        border:2px solid ${alarme.active?'var(--fd-lemon)':'rgba(255,255,255,.2)'};
                        border-radius:99px;transition:all .25s"></div>
            <div style="position:absolute;top:50%;
                        left:${alarme.active?'24px':'2px'};
                        transform:translateY(-50%);
                        width:18px;height:18px;border-radius:50%;
                        background:${alarme.active?'#09092d':'rgba(255,255,255,.4)'};
                        transition:left .25s;pointer-events:none"></div>
          </div>
        </div>
        <div class="input-label">⏰ Heure</div>
        <input type="time" id="alarme-heure" class="input mt-sm mb-md"
               value="${alarme.heure}"
               style="font-size:1.2rem;font-weight:700;text-align:center;
                      color:var(--fd-lemon)"/>
        <div class="input-label">💬 Message</div>
        <input type="text" id="alarme-message" class="input mt-sm mb-md"
               value="${alarme.message||''}"
               placeholder="⚡ C'est l'heure de t'entraîner !"/>
        <div class="input-label">🔁 Répétitions</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:6px;margin:8px 0 16px">
          ${[1,3,5].map(r=>`
            <button onclick="TimerManager._setRepetitions(${r})"
                    style="padding:8px 4px;font-size:.72rem;font-weight:700;
                           background:${(alarme.repetitions||3)===r?'var(--fd-lemon)':'var(--bg-input,rgba(255,255,255,.06))'};
                           color:${(alarme.repetitions||3)===r?'#09092d':'rgba(255,255,255,.5)'};
                           border:1px solid ${(alarme.repetitions||3)===r?'var(--fd-lemon)':'rgba(255,255,255,.1)'};
                           border-radius:99px;cursor:pointer">
              ${r===1?'1× seulement':r===3?'3× (recommandé)':'5× (max)'}
            </button>`).join('')}
        </div>
        <button onclick="TimerManager._sauvegarderAlarme()"
                class="btn-primary" style="width:100%">
          💾 Sauvegarder
        </button>
        ${alarme.active?`
          <div style="margin-top:8px;text-align:center;
                      font-size:.75rem;color:var(--fd-lemon)">
            ⏰ Active à ${alarme.heure} · ${alarme.repetitions||3}× / 2min
          </div>`:''}
      </div>
      <div class="card">
        <button onclick="TimerManager._testerAlarme()"
                class="btn-secondary" style="width:100%;font-size:.78rem">
          🔔 Tester l'alarme maintenant
        </button>
      </div>`;
  },

  _toggleAlarme(active) {
    const alarme  = this.getAlarme();
    alarme.active = active;
    this.sauvegarderAlarme(alarme);
    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);
    PM.toast(active ? '⏰ Alarme activée !' : '🔕 Alarme désactivée',
             active ? 'success' : 'info', 2000);
  },

  _sauvegarderAlarme() {
    const heure   = document.getElementById('alarme-heure')?.value;
    const message = document.getElementById('alarme-message')?.value?.trim()
      || "⚡ C'est l'heure de t'entraîner !";
    if (!heure) { PM.toast('Choisis une heure !','error'); return; }
    const existing = this.getAlarme();
    this.sauvegarderAlarme({ ...existing, heure, message });
    PM.toast(`✅ Alarme sauvegardée à ${heure} !`, 'success');
    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);
  },

  _setRepetitions(n) {
    const alarme       = this.getAlarme();
    alarme.repetitions = n;
    try { Utils.storage.set(this.CLE_ALARME, alarme); } catch(e) {}
    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);
    PM.toast(`🔁 ${n} répétition${n>1?'s':''}`, 'success', 2000);
  },

  async _testerAlarme() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') {
          PM.toast('⚠️ Active les notifications !', 'error', 5000);
          return;
        }
      } catch(e) {}
    }
    const alarme = this.getAlarme();
    this._declencherAlarme({ ...alarme, repetitions:1 });
    PM.toast('🔔 Test alarme lancé !', 'info', 2000);
  }
};

window.TimerManager = TimerManager;

// Bridge PM.timer → TimerManager
PM.timer = {
  ouvrir(sec, label) { TimerManager.demarrerRepos(sec); },
  fermer()           { TimerManager._fermerOverlay();   },
  ajouter(s)         { TimerManager._ajouter(s);        },
  passer()           { TimerManager._arreterEtFermer(); }
};

PM.demarrerRepos = sec => TimerManager.demarrerRepos(sec);

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
      // PM.navbar.render();
     //  PM.header.render();
      PM.splash.hide();

      // Override naviguer pour sync navbar
      const _navOrig = window.naviguer;
      if (typeof _navOrig === 'function') {
        window.naviguer = function(page, opts) {
          //PM.navbar.setActive(page);
          //PM.header.update();
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
// 20. LIVE ULTRA — Fusion live-ultra.js v1.0
// ═══════════════════════════════════════════════════════════
const LiveUltra = {

  _actif:          false,
  _seanceId:       null,
  _exercices:      [],
  _exoIdx:         0,
  _serieIdx:       0,
  _seriesValidees: {},
  _reposActif:     false,
  _reposInterval:  null,
  _reposHeureFin:  null,
  _voixActif:      false,
  _swipeStartX:    0,
  _swipeStartY:    0,
  _swipeStartT:    0,

  // ── Init ──
  demarrer(seanceId, exercices) {
    if (this._actif) this.quitter();
    this._actif          = true;
    this._seanceId       = seanceId;
    this._exercices      = exercices || [];
    this._exoIdx         = 0;
    this._serieIdx       = 0;
    this._seriesValidees = {};
    this._reposActif     = false;
    this._preRemplirCharges();
    this._creerOverlay();
    this._attacherGestes();
    this._attacherClavier();
    document.addEventListener('visibilitychange',
      this._onVisibilityChange.bind(this));
    console.log('[LiveUltra] Démarré ✅', seanceId);
  },

  quitter() {
    this._actif = false;
    clearInterval(this._reposInterval);
    document.getElementById('live-ultra-overlay')?.remove();
    document.removeEventListener('visibilitychange',
      this._onVisibilityChange.bind(this));
    document.removeEventListener('keydown',
      this._onKeyDown?.bind(this));
    try { window.speechSynthesis?.cancel(); } catch(e) {}
    console.log('[LiveUltra] Quitté ✅');
  },

  // ── Pré-remplissage ──
  _preRemplirCharges() {
    this._exercices.forEach((ex, i) => {
      try {
        const pr = Tracker.getPR(ex.ref);
        if (pr?.poids) {
          this._seriesValidees[`prefill-${i}`] = {
            poidsDefaut: pr.poids,
            repsDefaut:  ex.reps?.split?.('-')?.[0] || ex.reps || 10
          };
        }
      } catch(e) {}
    });
  },

  _getPoidsDefaut(i) {
    return this._seriesValidees[`prefill-${i}`]?.poidsDefaut || '';
  },

  _getRepsDefaut(i) {
    const ex = this._exercices[i];
    return this._seriesValidees[`prefill-${i}`]?.repsDefaut
      || ex?.reps?.split?.('-')?.[0] || ex?.reps || '';
  },

  _getDernierePoids(i) {
    for (let s = this._serieIdx - 1; s >= 0; s--) {
      const v = this._seriesValidees[`${i}-${s}`]?.poids;
      if (v) return v;
    }
    return this._getPoidsDefaut(i);
  },

  _getDerniereReps(i) {
    for (let s = this._serieIdx - 1; s >= 0; s--) {
      const v = this._seriesValidees[`${i}-${s}`]?.reps;
      if (v) return v;
    }
    return this._getRepsDefaut(i);
  },

  // ── Overlay ──
  _creerOverlay() {
    document.getElementById('live-ultra-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id    = 'live-ultra-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:#09092d;
      display:flex;flex-direction:column;
      overflow:hidden;user-select:none;
      -webkit-user-select:none;touch-action:pan-y;
      animation:pm-fadeIn .3s ease`;
    overlay.innerHTML = this._htmlOverlay();
    document.body.appendChild(overlay);
    this._attacherEventsOverlay();
  },

  _htmlOverlay() {
    const ex       = this._exercices[this._exoIdx];
    const exoData  = ex ? (window.EXERCICES||{})[ex.ref] || {} : {};
    const total    = this._exercices.length;
    const poids    = this._getDernierePoids(this._exoIdx);
    const reps     = this._getDerniereReps(this._exoIdx);
    const serie    = this._serieIdx + 1;
    const totalS   = ex?.series || 3;
    const pr       = PM.get(() => Tracker.getPR(ex?.ref), null);

    const totalSeries  = this._exercices.reduce((a,e) => a+(e.series||3), 0);
    const seriesFaites = Object.keys(this._seriesValidees)
      .filter(k => !k.startsWith('prefill')).length;
    const pct = Math.round((seriesFaites / Math.max(totalSeries,1)) * 100);

    return `
      <style>
        @keyframes ultraPulse {
          0%,100%{transform:scale(1);}
          50%    {transform:scale(1.05);}
        }
        @keyframes ultraSuccess {
          0%  {transform:scale(1);   background:rgba(139,240,187,.2);}
          50% {transform:scale(1.03);background:rgba(139,240,187,.4);}
          100%{transform:scale(1);   background:rgba(139,240,187,.2);}
        }
        @keyframes ultraShake {
          0%,100%{transform:translateX(0);}
          25%    {transform:translateX(-8px);}
          75%    {transform:translateX(8px);}
        }
        .ultra-btn {
          border-radius:14px;border:2px solid;
          font-weight:900;cursor:pointer;
          transition:transform .15s;
          display:flex;align-items:center;justify-content:center;
        }
        .ultra-btn:active{transform:scale(.92);}
        .ultra-input {
          flex:1;padding:16px 8px;font-size:2rem;font-weight:900;
          text-align:center;background:rgba(255,255,255,.06);
          border:2px solid rgba(255,255,255,.15);
          border-radius:16px;color:white;outline:none;
          transition:border-color .2s;
        }
        .ultra-input:focus{
          border-color:var(--fd-indigo);
          background:rgba(75,75,249,.1);
        }
      </style>

      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:16px 20px 8px;flex-shrink:0">
        <button onclick="LiveUltra.quitter()"
                style="width:40px;height:40px;background:rgba(255,255,255,.08);
                       border:1px solid rgba(255,255,255,.1);border-radius:50%;
                       color:rgba(255,255,255,.6);font-size:.9rem;cursor:pointer">✕</button>
        <div style="text-align:center;flex:1;padding:0 12px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.15em;color:rgba(255,255,255,.4)">
            ⚡ MODE ULTRA-RAPIDE
          </div>
          <div style="font-size:.78rem;font-weight:700;color:white;margin-top:2px;
                      overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${exoData.nom || ex?.ref || 'Séance'}
          </div>
        </div>
        <button id="ultra-btn-voix" onclick="LiveUltra._toggleVoix()"
                style="width:40px;height:40px;border-radius:50%;cursor:pointer;
                       background:${this._voixActif?'rgba(139,240,187,.2)':'rgba(255,255,255,.08)'};
                       border:1px solid ${this._voixActif?'rgba(139,240,187,.4)':'rgba(255,255,255,.1)'};
                       color:${this._voixActif?'#8bf0bb':'rgba(255,255,255,.6)'};font-size:.9rem">
          🎙️
        </button>
      </div>

      <!-- Progress global -->
      <div style="padding:0 20px;flex-shrink:0">
        <div style="height:4px;background:rgba(255,255,255,.06);
                    border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${pct}%;
                      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-mint));
                      border-radius:99px;transition:width .5s"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:4px">
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">
            Exo ${this._exoIdx+1}/${total}
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,.3)">
            ${seriesFaites}/${totalSeries} · ${pct}%
          </div>
        </div>
      </div>

      <!-- Zone exercice -->
      <div style="flex:1;display:flex;flex-direction:column;
                  align-items:center;justify-content:center;
                  padding:8px 20px;overflow:hidden"
           id="ultra-zone-exercice">

        <!-- Emoji -->
        <div style="text-align:center;margin-bottom:12px">
          <div style="font-size:3rem;margin-bottom:6px;
                      animation:ultraPulse 3s ease infinite">
            ${exoData.emoji||'💪'}
          </div>
          <div style="font-size:.72rem;color:rgba(75,75,249,.8);
                      font-weight:700;text-transform:uppercase;letter-spacing:.08em">
            ${exoData.muscle||''}
          </div>
        </div>

        <!-- Dots séries -->
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:16px">
          ${Array.from({length:totalS},(_,i)=>`
            <div style="width:${i===this._serieIdx?24:8}px;height:8px;
                        border-radius:99px;transition:all .3s;
                        background:${
                          this._seriesValidees[`${this._exoIdx}-${i}`]
                            ? 'var(--fd-mint)'
                            : i===this._serieIdx
                              ? 'var(--fd-indigo)'
                              : 'rgba(255,255,255,.15)'}">
            </div>`).join('')}
        </div>

        <div style="font-size:.65rem;font-weight:700;color:rgba(255,255,255,.4);
                    text-transform:uppercase;letter-spacing:.12em;margin-bottom:6px">
          Série ${serie} / ${totalS}
        </div>

        ${pr?`
          <div style="padding:4px 12px;margin-bottom:12px;
                      background:rgba(249,239,119,.1);
                      border:1px solid rgba(249,239,119,.3);
                      border-radius:99px;font-size:.68rem;
                      font-weight:700;color:var(--fd-lemon)">
            🏆 PR ${pr.poids}kg × ${pr.reps}
          </div>`:''}

        <!-- Poids -->
        <div style="width:100%;margin-bottom:12px">
          <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);
                      margin-bottom:8px;text-align:center">
            🏋️ Charge (kg)
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="ultra-btn"
                    style="width:52px;height:52px;flex-shrink:0;
                           background:rgba(255,141,150,.12);
                           border-color:rgba(255,141,150,.3);color:#ff8d96;font-size:1rem"
                    onmousedown="LiveUltra._ajusterCharge(-5)"
                    ontouchstart="LiveUltra._ajusterCharge(-5)">−5</button>
            <button class="ultra-btn"
                    style="width:40px;height:52px;flex-shrink:0;
                           background:rgba(255,141,150,.08);
                           border-color:rgba(255,141,150,.2);color:#ff8d96;font-size:.9rem"
                    onmousedown="LiveUltra._ajusterCharge(-2.5)"
                    ontouchstart="LiveUltra._ajusterCharge(-2.5)">−½</button>
            <input id="ultra-poids" type="number" inputmode="decimal"
                   class="ultra-input"
                   placeholder="${poids||'kg'}" value="${poids||''}"
                   step="2.5" min="0"
                   style="font-size:${poids>99?'1.6rem':'2rem'}"
                   oninput="LiveUltra._onPoidsChange(this.value)"
                   onfocus="this.select()"/>
            <button class="ultra-btn"
                    style="width:40px;height:52px;flex-shrink:0;
                           background:rgba(139,240,187,.08);
                           border-color:rgba(139,240,187,.2);color:#8bf0bb;font-size:.9rem"
                    onmousedown="LiveUltra._ajusterCharge(2.5)"
                    ontouchstart="LiveUltra._ajusterCharge(2.5)">+½</button>
            <button class="ultra-btn"
                    style="width:52px;height:52px;flex-shrink:0;
                           background:rgba(139,240,187,.12);
                           border-color:rgba(139,240,187,.3);color:#8bf0bb;font-size:1rem"
                    onmousedown="LiveUltra._ajusterCharge(5)"
                    ontouchstart="LiveUltra._ajusterCharge(5)">+5</button>
          </div>
        </div>

        <!-- Reps -->
        <div style="width:100%;margin-bottom:20px">
          <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);
                      margin-bottom:8px;text-align:center">
            🔁 Répétitions
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button class="ultra-btn"
                    style="width:52px;height:52px;flex-shrink:0;
                           background:rgba(255,141,150,.12);
                           border-color:rgba(255,141,150,.3);color:#ff8d96;font-size:1rem"
                    onmousedown="LiveUltra._ajusterReps(-2)"
                    ontouchstart="LiveUltra._ajusterReps(-2)">−2</button>
            <button class="ultra-btn"
                    style="width:40px;height:52px;flex-shrink:0;
                           background:rgba(255,141,150,.08);
                           border-color:rgba(255,141,150,.2);color:#ff8d96;font-size:.9rem"
                    onmousedown="LiveUltra._ajusterReps(-1)"
                    ontouchstart="LiveUltra._ajusterReps(-1)">−1</button>
            <input id="ultra-reps" type="number" inputmode="numeric"
                   class="ultra-input"
                   placeholder="${reps||'reps'}" value="${reps||''}"
                   min="1"
                   onfocus="this.select()"/>
            <button class="ultra-btn"
                    style="width:40px;height:52px;flex-shrink:0;
                           background:rgba(139,240,187,.08);
                           border-color:rgba(139,240,187,.2);color:#8bf0bb;font-size:.9rem"
                    onmousedown="LiveUltra._ajusterReps(1)"
                    ontouchstart="LiveUltra._ajusterReps(1)">+1</button>
            <button class="ultra-btn"
                    style="width:52px;height:52px;flex-shrink:0;
                           background:rgba(139,240,187,.12);
                           border-color:rgba(139,240,187,.3);color:#8bf0bb;font-size:1rem"
                    onmousedown="LiveUltra._ajusterReps(2)"
                    ontouchstart="LiveUltra._ajusterReps(2)">+2</button>
          </div>
        </div>

        <!-- Valider -->
        <button id="ultra-btn-valider"
                onclick="LiveUltra._validerSerie()"
                style="width:100%;padding:22px;background:var(--fd-indigo);
                       border:none;border-radius:20px;font-size:1.1rem;
                       font-weight:900;color:white;cursor:pointer;
                       letter-spacing:.04em;
                       box-shadow:0 6px 32px rgba(75,75,249,.5);
                       transition:all .2s">
          ✅ SÉRIE FAITE
        </button>

        <div style="margin-top:10px;font-size:.58rem;
                    color:rgba(255,255,255,.2);text-align:center">
          ↑ Swipe haut · ← → exercice · Double-tap · Enter
        </div>
      </div>

      <!-- Nav bas -->
      <div style="display:flex;align-items:center;justify-content:space-between;
                  padding:12px 20px;flex-shrink:0;
                  background:rgba(255,255,255,.03);
                  border-top:1px solid rgba(255,255,255,.06)">
        <button onclick="LiveUltra._exoPrecedent()"
                style="padding:10px 16px;background:rgba(255,255,255,.06);
                       border:1px solid rgba(255,255,255,.1);border-radius:12px;
                       color:rgba(255,255,255,.5);font-size:.78rem;
                       font-weight:700;cursor:pointer;
                       opacity:${this._exoIdx>0?'1':'0.3'}"
                ${this._exoIdx===0?'disabled':''}>
          ← Préc
        </button>

        <div style="display:flex;gap:5px;align-items:center">
          ${this._exercices.map((_,i)=>`
            <div onclick="LiveUltra._allerExo(${i})"
                 style="height:6px;border-radius:99px;cursor:pointer;
                        transition:all .3s;
                        width:${i===this._exoIdx?20:6}px;
                        background:${i===this._exoIdx
                          ? 'var(--fd-indigo)'
                          : this._exoTermine(i)
                            ? 'var(--fd-mint)'
                            : 'rgba(255,255,255,.15)'}">
            </div>`).join('')}
        </div>

        <button onclick="LiveUltra._exoSuivant()"
                style="padding:10px 16px;background:rgba(75,75,249,.15);
                       border:1px solid rgba(75,75,249,.3);border-radius:12px;
                       color:var(--fd-indigo);font-size:.78rem;
                       font-weight:700;cursor:pointer;
                       opacity:${this._exoIdx<this._exercices.length-1?'1':'0.3'}"
                ${this._exoIdx>=this._exercices.length-1?'disabled':''}>
          Suiv →
        </button>
      </div>
    `;
  },

  // ── Validation ──
  _validerSerie() {
    const poids = parseFloat(document.getElementById('ultra-poids')?.value);
    const reps  = parseInt(document.getElementById('ultra-reps')?.value);

    if (!poids || !reps) {
      this._animer('shake');
      Sounds.jouer('error');
      PM.toast('Entre le poids et les reps !', 'error');
      return;
    }

    const ex     = this._exercices[this._exoIdx];
    const key    = `${this._exoIdx}-${this._serieIdx}`;
    const totalS = ex?.series || 3;

    this._seriesValidees[key] = { poids, reps,
      exoIdx:this._exoIdx, serieIdx:this._serieIdx };

    let isPR = false;
    try {
      const r = Tracker.sauvegarderSerie(
        this._seanceId, ex.ref,
        this._serieIdx + 1, reps, poids, null
      );
      isPR = r?.isPR || false;
    } catch(e) {}

    try { Gamification.recompenser('SERIE_COMPLETE'); } catch(e) {}

    if (isPR) {
      Sounds.celebrerPR(ex.ref, poids);
      PM.toast(`🏆 NOUVEAU RECORD ! ${poids}kg × ${reps}`, 'pr', 4000);
    } else {
      Sounds.jouer('serie');
      Sounds.vibrer('success');
    }

    this._animer('success');

    if (this._voixActif) {
      this._parler(isPR
        ? `Record battu ! ${poids} kilos, ${reps} répétitions !`
        : `Série ${this._serieIdx+1} validée.`);
    }

    const serieSuivante = this._serieIdx + 1;

    if (serieSuivante < totalS) {
      const reposDuree = ex.repos || 75;
      setTimeout(() => {
        this._serieIdx = serieSuivante;
        this._lancerRepos(reposDuree, ex.ref);
      }, 400);
    } else {
      const exoSuivant = this._exoIdx + 1;
      if (exoSuivant < this._exercices.length) {
        setTimeout(() => {
          this._serieIdx = 0;
          this._exoIdx   = exoSuivant;
          this._animer('transition');
          if (this._voixActif) {
            const next = this._exercices[exoSuivant];
            const nd   = (window.EXERCICES||{})[next?.ref]||{};
            this._parler(`Exercice terminé ! Prochain : ${nd.nom||next?.ref}`);
          }
          this._rafraichir();
        }, 400);
      } else {
        setTimeout(() => this._terminerSeance(), 500);
      }
    }
  },

  // ── Repos ──
  _lancerRepos(secondes) {
    this._reposActif    = true;
    this._reposHeureFin = Date.now() + (secondes * 1000);
    clearInterval(this._reposInterval);

    const zone = document.getElementById('ultra-zone-exercice');
    if (!zone) return;

    const circ  = 2 * Math.PI * 70;
    const serie = this._serieIdx + 1;
    const ex    = this._exercices[this._exoIdx];
    const totalS= ex?.series || 3;
    const prev  = this._seriesValidees[`${this._exoIdx}-${this._serieIdx-1}`];

    zone.innerHTML = `
      <div style="display:flex;flex-direction:column;
                  align-items:center;justify-content:center;
                  height:100%;text-align:center;padding:20px">
        <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.15em;color:var(--fd-mint);margin-bottom:20px">
          😴 REPOS
        </div>
        <div style="position:relative;width:160px;height:160px;margin-bottom:20px">
          <svg width="160" height="160"
               style="transform:rotate(-90deg)">
            <circle cx="80" cy="80" r="70" fill="none"
                    stroke="rgba(139,240,187,.1)" stroke-width="8"/>
            <circle cx="80" cy="80" r="70" fill="none"
                    stroke="var(--fd-mint)" stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="${circ}" stroke-dashoffset="0"
                    id="ultra-repos-arc"
                    style="transition:stroke-dashoffset 1s linear;
                           filter:drop-shadow(0 0 6px var(--fd-mint))"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div id="ultra-repos-display"
                 style="font-size:2.8rem;font-weight:900;
                        color:var(--fd-mint);
                        font-variant-numeric:tabular-nums;line-height:1">
              ${this._formatTemps(secondes)}
            </div>
            <div style="font-size:.6rem;color:rgba(255,255,255,.3);margin-top:4px">
              secondes
            </div>
          </div>
        </div>
        <div style="font-size:.78rem;color:rgba(255,255,255,.5);margin-bottom:16px">
          Série ${serie+1} / ${totalS} dans...
        </div>
        ${prev?`
          <div style="padding:10px 20px;background:rgba(75,75,249,.1);
                      border:1px solid rgba(75,75,249,.2);
                      border-radius:12px;margin-bottom:16px">
            <div style="font-size:.6rem;color:rgba(255,255,255,.4);margin-bottom:4px">
              Dernière série
            </div>
            <div style="font-size:1.4rem;font-weight:900;color:var(--fd-indigo)">
              ${prev.poids}kg × ${prev.reps}
            </div>
          </div>`:''}
        <div style="display:flex;gap:10px;width:100%;max-width:280px">
          <button onclick="LiveUltra._ajouterTempsRepos(15)"
                  style="flex:1;padding:12px;background:rgba(255,255,255,.06);
                         border:1px solid rgba(255,255,255,.1);border-radius:12px;
                         color:rgba(255,255,255,.6);font-size:.82rem;
                         font-weight:700;cursor:pointer">+15s</button>
          <button onclick="LiveUltra._passerRepos()"
                  style="flex:2;padding:12px;background:var(--fd-indigo);
                         border:none;border-radius:12px;color:white;
                         font-size:.88rem;font-weight:800;cursor:pointer">
            ⚡ Passer
          </button>
        </div>
      </div>`;

    Sounds.jouer('repos_start');
    if (this._voixActif) this._parler(`Repos de ${secondes} secondes.`);

    this._reposInterval = setInterval(() => {
      const resteMs  = this._reposHeureFin - Date.now();
      const resteSec = Math.ceil(resteMs / 1000);
      const reste    = Math.max(0, resteSec);

      const disp = document.getElementById('ultra-repos-display');
      const arc  = document.getElementById('ultra-repos-arc');

      if (disp) disp.textContent = this._formatTemps(reste);
      if (arc) {
        const pct = Math.max(0, resteMs / (secondes * 1000));
        arc.style.strokeDashoffset = circ * (1 - pct);
        if (reste <= 5) {
          arc.style.stroke = 'var(--fd-coral)';
          arc.style.filter = 'drop-shadow(0 0 6px var(--fd-coral))';
          if (disp) disp.style.color = 'var(--fd-coral)';
        }
      }
      if (reste <= 3 && reste > 0) Sounds.vibrer('leger');
      if (reste <= 0) {
        clearInterval(this._reposInterval);
        this._reposActif = false;
        Sounds.jouer('repos_fin');
        Sounds.vibrer([200,100,200]);
        if (this._voixActif) this._parler('Repos terminé ! Allez, on y va !');
        this._rafraichir();
      }
    }, 300);
  },

  _passerRepos() {
    clearInterval(this._reposInterval);
    this._reposActif = false;
    Sounds.vibrer('leger');
    this._rafraichir();
  },

  _ajouterTempsRepos(sec) {
    this._reposHeureFin += sec * 1000;
    Sounds.vibrer('leger');
    PM.toast(`+${sec}s ✅`, 'success', 800);
  },

  // ── Navigation ──
  _exoSuivant() {
    if (this._exoIdx >= this._exercices.length-1) return;
    this._exoIdx++; this._serieIdx = 0;
    this._rafraichir(); Sounds.vibrer('leger');
  },

  _exoPrecedent() {
    if (this._exoIdx <= 0) return;
    this._exoIdx--; this._serieIdx = 0;
    this._rafraichir(); Sounds.vibrer('leger');
  },

  _allerExo(idx) {
    if (idx < 0 || idx >= this._exercices.length) return;
    this._exoIdx = idx; this._serieIdx = 0;
    this._rafraichir(); Sounds.vibrer('leger');
  },

  _exoTermine(i) {
    const ex = this._exercices[i];
    if (!ex) return false;
    for (let s = 0; s < (ex.series||3); s++) {
      if (!this._seriesValidees[`${i}-${s}`]) return false;
    }
    return true;
  },

  // ── Ajustements ──
  _ajusterCharge(delta) {
    const input = document.getElementById('ultra-poids');
    if (!input) return;
    const nouveau = Math.max(0, Math.round((parseFloat(input.value)||0 + delta)*4)/4);
    input.value = nouveau;
    input.style.fontSize = nouveau > 99 ? '1.6rem' : '2rem';
    input.style.borderColor = delta > 0 ? 'var(--fd-mint)' : 'var(--fd-coral)';
    input.style.background  = delta > 0 ? 'rgba(139,240,187,.1)' : 'rgba(255,141,150,.1)';
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.background  = '';
    }, 200);
    Sounds.vibrer('leger');
  },

  _ajusterReps(delta) {
    const input = document.getElementById('ultra-reps');
    if (!input) return;
    input.value = Math.max(1, (parseInt(input.value)||0) + delta);
    input.style.borderColor = delta > 0 ? 'var(--fd-mint)' : 'var(--fd-coral)';
    setTimeout(() => input.style.borderColor = '', 200);
    Sounds.vibrer('leger');
  },

  _onPoidsChange(val) {
    const input = document.getElementById('ultra-poids');
    if (input) input.style.fontSize = parseFloat(val) > 99 ? '1.6rem' : '2rem';
  },

  // ── Gestes ──
  _attacherGestes() {
    const overlay = document.getElementById('live-ultra-overlay');
    if (!overlay) return;

    overlay.addEventListener('touchstart', e => {
      const t = e.touches[0];
      this._swipeStartX = t.clientX;
      this._swipeStartY = t.clientY;
      this._swipeStartT = Date.now();
    }, { passive:true });

    overlay.addEventListener('touchend', e => {
      if (this._reposActif) return;
      const t    = e.changedTouches[0];
      const dx   = t.clientX - this._swipeStartX;
      const dy   = t.clientY - this._swipeStartY;
      const dt   = Date.now() - this._swipeStartT;
      const adx  = Math.abs(dx);
      const ady  = Math.abs(dy);
      if (dt > 400) return;
      if (ady > 60  && dy < 0 && ady > adx) { this._validerSerie(); return; }
      if (adx > 80  && dx > 0 && adx > ady) { this._exoPrecedent(); this._animer('swipe-right'); return; }
      if (adx > 80  && dx < 0 && adx > ady) { this._exoSuivant();   this._animer('swipe-left');  return; }
      if (ady > 120 && dy > 0 && ady > adx) { this._confirmerQuitter(); }
    }, { passive:true });
  },

  _confirmerQuitter() {
    if (confirm('⚡ Quitter le mode Ultra ?\nTa progression sera sauvegardée.')) {
      this.quitter();
    }
  },

  // ── Clavier ──
  _attacherClavier() {
    this._onKeyDown = e => {
      if (!this._actif) return;
      switch(e.key) {
        case 'Enter': case ' ': e.preventDefault(); this._validerSerie();       break;
        case 'ArrowRight':      e.preventDefault(); this._exoSuivant();         break;
        case 'ArrowLeft':       e.preventDefault(); this._exoPrecedent();        break;
        case 'ArrowUp':         e.preventDefault(); this._ajusterCharge(2.5);   break;
        case 'ArrowDown':       e.preventDefault(); this._ajusterCharge(-2.5);  break;
        case '+':                                   this._ajusterReps(1);        break;
        case '-':                                   this._ajusterReps(-1);       break;
        case 'Escape':                              this._confirmerQuitter();    break;
      }
    };
    document.addEventListener('keydown', this._onKeyDown);
  },

  // ── Events overlay ──
  _attacherEventsOverlay() {
    let lastTap = 0;
    const zone  = document.getElementById('ultra-zone-exercice');
    if (!zone) return;
    zone.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300) { e.preventDefault(); this._validerSerie(); }
      lastTap = now;
    }, { passive:false });
  },

  // ── Animations ──
  _animer(type) {
    const btn  = document.getElementById('ultra-btn-valider');
    const zone = document.getElementById('ultra-zone-exercice');
    switch(type) {
      case 'success':
        if (btn) { btn.style.animation='ultraSuccess .4s ease'; setTimeout(()=>btn.style.animation='',400); }
        break;
      case 'shake':
        if (btn) { btn.style.animation='ultraShake .3s ease'; setTimeout(()=>btn.style.animation='',300); }
        break;
      case 'transition':
      case 'swipe-left':
      case 'swipe-right':
        if (zone) {
          const tx = type==='swipe-left'?'-20px':type==='swipe-right'?'20px':'20px';
          zone.style.opacity='0'; zone.style.transform=`translateX(${tx})`;
          setTimeout(()=>{
            zone.style.transition='all .3s ease';
            zone.style.opacity='1'; zone.style.transform='translateX(0)';
          }, 50);
        }
        break;
    }
  },

  // ── Voix ──
  _toggleVoix() {
    this._voixActif = !this._voixActif;
    const btn = document.getElementById('ultra-btn-voix');
    if (btn) {
      btn.style.background  = this._voixActif?'rgba(139,240,187,.2)':'rgba(255,255,255,.08)';
      btn.style.borderColor = this._voixActif?'rgba(139,240,187,.4)':'rgba(255,255,255,.1)';
      btn.style.color       = this._voixActif?'#8bf0bb':'rgba(255,255,255,.6)';
    }
    PM.toast(this._voixActif?'🎙️ Voix activée':'🔇 Voix désactivée','success',1200);
    if (this._voixActif) {
      const ex = this._exercices[this._exoIdx];
      const ed = (window.EXERCICES||{})[ex?.ref||'']||{};
      this._parler(`Mode guidé activé. ${ed.nom||'Exercice'}, série ${this._serieIdx+1}.`);
    }
  },

  _parler(texte) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u  = new SpeechSynthesisUtterance(texte);
    u.lang   = 'fr-FR'; u.rate = 0.95; u.pitch = 1.0; u.volume = 0.9;
    const fr = window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('fr'));
    if (fr) u.voice = fr;
    window.speechSynthesis.speak(u);
  },

  // ── Fin séance ──
  _terminerSeance() {
    if (this._voixActif) this._parler('Séance terminée ! Bravo, excellent travail !');
    Sounds.celebrerSeanceFin();
    try { App.terminerSeance(this._seanceId); } catch(e) {}
    setTimeout(() => this.quitter(), 500);
  },

  // ── Rafraîchissement ──
  _rafraichir() {
    const overlay = document.getElementById('live-ultra-overlay');
    if (!overlay || !this._actif) return;
    const activeId = document.activeElement?.id;
    overlay.innerHTML = this._htmlOverlay();
    this._attacherGestes();
    this._attacherEventsOverlay();
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) { el.focus(); el.select?.(); }
    }
  },

  // ── Visibility ──
  _onVisibilityChange() {
    if (!this._actif) return;
    if (document.visibilityState === 'visible' && this._reposActif) {
      const reste = Math.ceil((this._reposHeureFin - Date.now()) / 1000);
      if (reste <= 0) {
        clearInterval(this._reposInterval);
        this._reposActif = false;
        Sounds.vibrer([200,100,200]);
        PM.toast('⏱ Repos terminé !', 'success', 3000);
        this._rafraichir();
      }
    }
  },

  _formatTemps(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec/60);
    const s = sec % 60;
    return m > 0 ? `${m}:${String(s).padStart(2,'0')}` : String(sec);
  }
};

window.LiveUltra = LiveUltra;
     
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
