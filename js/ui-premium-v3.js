/* ═══════════════════════════════════════════════════════════
   UI PREMIUM v3 — PowerApp
   Coach IA + Défis + Nutrition + Gamification + Timer + Analytics
   ═══════════════════════════════════════════════════════════ */
'use strict';

// ═══════════════════════════════════════════════════════════
// CSS v3
// ═══════════════════════════════════════════════════════════
(function injectCSSv3() {
  if (document.getElementById('css-premium-v3')) return;
  const s = document.createElement('style');
  s.id = 'css-premium-v3';
  s.textContent = `

    /* ── Confetti ── */
    .pm-confetti {
      position:fixed;top:0;left:0;width:100%;height:100%;
      pointer-events:none;z-index:9998;overflow:hidden;
    }
    .pm-confetti-piece {
      position:absolute;top:-10px;
      width:8px;height:8px;border-radius:2px;
      animation:pm-confettiFall linear forwards;
    }
    @keyframes pm-confettiFall {
      0%   { transform:translateY(0) rotate(0deg);   opacity:1; }
      100% { transform:translateY(110vh) rotate(720deg); opacity:0; }
    }

    /* ── Chat ── */
    .pm-chat-bubble {
      max-width:85%;padding:12px 14px;
      border-radius:18px;margin-bottom:8px;
      font-size:.82rem;line-height:1.55;
      animation:pm-fadeUp .3s ease;
    }
    .pm-chat-bubble.ai {
      background:rgba(75,75,249,.12);
      border:1px solid rgba(75,75,249,.25);
      border-bottom-left-radius:4px;
      color:rgba(255,255,255,.85);
      align-self:flex-start;
    }
    .pm-chat-bubble.user {
      background:rgba(75,75,249,.3);
      border:1px solid rgba(75,75,249,.4);
      border-bottom-right-radius:4px;
      color:white;align-self:flex-end;
      margin-left:auto;
    }
    .pm-chat-typing {
      display:flex;gap:4px;padding:12px 14px;
      background:rgba(75,75,249,.08);
      border:1px solid rgba(75,75,249,.2);
      border-radius:18px;border-bottom-left-radius:4px;
      width:fit-content;margin-bottom:8px;
    }
    .pm-chat-typing span {
      width:6px;height:6px;border-radius:50%;
      background:var(--fd-indigo);
      animation:pm-typingDot 1.2s ease-in-out infinite;
    }
    .pm-chat-typing span:nth-child(2){animation-delay:.2s;}
    .pm-chat-typing span:nth-child(3){animation-delay:.4s;}
    @keyframes pm-typingDot {
      0%,100%{transform:translateY(0);opacity:.4;}
      50%    {transform:translateY(-5px);opacity:1;}
    }

    /* ── Défi cards ── */
    .pm-defi-card {
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:18px;padding:16px;
      margin-bottom:10px;transition:all .2s;
      animation:pm-fadeUp .3s ease both;
    }
    .pm-defi-card:hover {
      border-color:rgba(75,75,249,.3);
      transform:translateY(-2px);
    }
    .pm-defi-card.complete {
      background:rgba(139,240,187,.06);
      border-color:rgba(139,240,187,.25);
    }

    /* ── Progress ring ── */
    .pm-ring-progress {
      transform:rotate(-90deg);
      transform-origin:center;
    }

    /* ── Nutrition ── */
    .pm-macro-bar {
      height:8px;border-radius:99px;overflow:hidden;
      background:rgba(255,255,255,.06);margin-bottom:12px;
    }
    .pm-macro-fill {
      height:100%;border-radius:99px;
      animation:pm-progressFill .8s ease forwards;
    }

    /* ── XP Bar ── */
    .pm-xp-bar {
      height:10px;border-radius:99px;
      background:rgba(255,255,255,.06);
      overflow:hidden;position:relative;
    }
    .pm-xp-fill {
      height:100%;border-radius:99px;
      background:linear-gradient(90deg,var(--fd-indigo),var(--fd-lavender));
      animation:pm-progressFill .8s ease forwards;
      box-shadow:0 0 8px rgba(75,75,249,.4);
    }
    .pm-xp-shine {
      position:absolute;top:0;left:-100%;
      width:60%;height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent);
      animation:pm-xpShine 2s ease infinite;
    }
    @keyframes pm-xpShine {
      0%  {left:-100%;}
      100%{left:200%;}
    }

    /* ── Badge ── */
    .pm-badge {
      display:inline-flex;flex-direction:column;
      align-items:center;gap:4px;padding:12px 8px;
      background:rgba(255,255,255,.04);
      border:1px solid rgba(255,255,255,.08);
      border-radius:14px;text-align:center;
      transition:all .2s;cursor:pointer;
    }
    .pm-badge.unlocked {
      background:rgba(249,239,119,.08);
      border-color:rgba(249,239,119,.3);
    }
    .pm-badge:hover { transform:scale(1.05); }

    /* ── Timer plein écran ── */
    .pm-timer-fullscreen {
      position:fixed;top:0;left:0;
      width:100%;height:100%;
      background:rgba(7,7,20,.97);
      backdrop-filter:blur(20px);
      z-index:500;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      animation:pm-fadeUp .3s ease;
    }

    /* ── Analytics ── */
    .pm-chart-tooltip {
      position:absolute;
      background:rgba(9,9,45,.95);
      border:1px solid rgba(75,75,249,.3);
      border-radius:8px;padding:6px 10px;
      font-size:.7rem;font-weight:700;color:white;
      pointer-events:none;
      transition:all .15s;
      white-space:nowrap;
    }

    /* ── Sounds visual ── */
    .pm-sound-wave {
      display:flex;align-items:center;gap:3px;height:20px;
    }
    .pm-sound-bar {
      width:3px;border-radius:99px;
      background:var(--fd-indigo);
      animation:pm-soundWave .8s ease-in-out infinite;
    }
    .pm-sound-bar:nth-child(2){animation-delay:.1s;height:60%;}
    .pm-sound-bar:nth-child(3){animation-delay:.2s;height:100%;}
    .pm-sound-bar:nth-child(4){animation-delay:.3s;height:70%;}
    .pm-sound-bar:nth-child(5){animation-delay:.4s;height:40%;}
    @keyframes pm-soundWave {
      0%,100%{transform:scaleY(1);}
      50%    {transform:scaleY(.4);}
    }

    /* ── Micro interactions ── */
    .pm-pressable {
      transition:transform .15s,box-shadow .15s;
      -webkit-tap-highlight-color:transparent;
    }
    .pm-pressable:active { transform:scale(.95) !important; }

    /* ── Shake error ── */
    @keyframes pm-shake {
      0%,100%{transform:translateX(0);}
      20%    {transform:translateX(-8px);}
      40%    {transform:translateX(8px);}
      60%    {transform:translateX(-5px);}
      80%    {transform:translateX(5px);}
    }
    .pm-shake { animation:pm-shake .4s ease; }

  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// CONFETTI
// ═══════════════════════════════════════════════════════════
PM.confetti = function(duree = 2500) {
  const colors = ['#4b4bf9','#8bf0bb','#f9ef77','#ff8d96','#bfa1ff','#ffffff'];
  const div    = document.createElement('div');
  div.className = 'pm-confetti';
  document.body.appendChild(div);

  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'pm-confetti-piece';
    piece.style.cssText = `
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${4+Math.random()*8}px;
      height:${4+Math.random()*8}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation-duration:${1.5+Math.random()*2}s;
      animation-delay:${Math.random()*.8}s;
    `;
    div.appendChild(piece);
  }
  setTimeout(() => div.remove(), duree + 1000);
};

// ═══════════════════════════════════════════════════════════
// SONS UI
// ═══════════════════════════════════════════════════════════
PM.sons = {
  _ctx: null,
  _getCtx() {
    if (!this._ctx) {
      try { this._ctx = new (window.AudioContext||window.webkitAudioContext)(); }
      catch(e) {}
    }
    return this._ctx;
  },
  _play(freq, type='sine', dur=.15, vol=.3, delay=0) {
    const ctx = this._getCtx();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type      = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(vol, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + delay + dur);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur);
    } catch(e) {}
  },
  clic()    { this._play(800, 'sine',     .06, .15); },
  succes()  {
    this._play(440, 'sine', .1, .2);
    this._play(554, 'sine', .1, .2, .1);
    this._play(659, 'sine', .15,.2, .2);
  },
  erreur()  { this._play(200, 'square', .2, .2); },
  timer()   {
    this._play(880, 'sine', .1, .3);
    this._play(880, 'sine', .1, .3, .15);
    this._play(1320,'sine', .2, .3, .3);
  },
  pr()      {
    [261,329,392,523].forEach((f,i) =>
      this._play(f,'sine',.2,.25,i*.08));
  },
  niveau()  {
    [523,659,784,1047].forEach((f,i) =>
      this._play(f,'sine',.25,.3,i*.1));
  }
};

// ═══════════════════════════════════════════════════════════
// TIMER PLEIN ÉCRAN — v2
// ═══════════════════════════════════════════════════════════
PM.timerFullscreen = {
  _timer: null,
  _restant: 0,
  _total: 0,

  ouvrir(sec = 90, label = 'Repos') {
    this.fermer();
    this._total   = sec;
    this._restant = sec;

    const div = document.createElement('div');
    div.id    = 'pm-timer-fs';
    div.className = 'pm-timer-fullscreen';
    div.innerHTML = `
      <div style="text-align:center;padding:32px 24px">

        <!-- Label -->
        <div style="font-size:.65rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.15em;color:var(--fd-mint);margin-bottom:20px">
          😴 ${label.toUpperCase()}
        </div>

        <!-- Ring SVG -->
        <div style="position:relative;width:220px;height:220px;
                    margin:0 auto 24px">
          <svg width="220" height="220" style="transform:rotate(-90deg)">
            <circle cx="110" cy="110" r="96" fill="none"
                    stroke="rgba(139,240,187,.08)" stroke-width="12"/>
            <circle id="pm-fs-ring" cx="110" cy="110" r="96" fill="none"
                    stroke="var(--fd-mint)" stroke-width="12"
                    stroke-linecap="round"
                    stroke-dasharray="603" stroke-dashoffset="0"
                    style="filter:drop-shadow(0 0 12px var(--fd-mint));
                           transition:stroke-dashoffset 1s linear"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div id="pm-fs-count"
                 style="font-size:4.5rem;font-weight:800;color:var(--fd-mint);
                        font-variant-numeric:tabular-nums;line-height:1">
              ${sec}
            </div>
            <div style="font-size:.75rem;color:rgba(255,255,255,.4);margin-top:4px">
              secondes
            </div>
          </div>
        </div>

        <!-- Série info -->
        <div id="pm-fs-label"
             style="font-size:.9rem;font-weight:700;
                    color:rgba(255,255,255,.6);margin-bottom:24px">
          ${label}
        </div>

        <!-- Boutons rapides -->
        <div style="display:flex;gap:10px;justify-content:center;margin-bottom:20px">
          ${[15,30,60].map(s=>`
            <button onclick="PM.timerFullscreen.ajouter(${s})"
                    class="pm-pressable"
                    style="padding:10px 16px;background:rgba(255,255,255,.06);
                           border:1px solid rgba(255,255,255,.1);border-radius:12px;
                           font-size:.78rem;font-weight:700;
                           color:rgba(255,255,255,.6);cursor:pointer">
              +${s}s
            </button>`).join('')}
        </div>

        <!-- Boutons action -->
        <div style="display:flex;gap:12px;justify-content:center">
          <button onclick="PM.timerFullscreen.passer()"
                  class="pm-pressable"
                  style="padding:14px 28px;background:var(--fd-indigo);border:none;
                         border-radius:99px;font-size:.9rem;font-weight:800;
                         color:white;cursor:pointer;
                         box-shadow:0 4px 20px rgba(75,75,249,.4)">
            ⚡ Passer
          </button>
          <button onclick="PM.timerFullscreen.fermer()"
                  class="pm-pressable"
                  style="padding:14px 20px;background:rgba(255,255,255,.06);
                         border:1px solid rgba(255,255,255,.1);
                         border-radius:99px;font-size:.9rem;font-weight:700;
                         color:rgba(255,255,255,.5);cursor:pointer">
            ✕
          </button>
        </div>

        <!-- Vibration hint -->
        <div style="font-size:.62rem;color:rgba(255,255,255,.2);margin-top:16px">
          📳 Vibration + son à la fin
        </div>
      </div>
    `;
    document.body.appendChild(div);
    PM.sons.clic();

    const total = 603;
    this._timer = setInterval(() => {
      this._restant--;
      const count = document.getElementById('pm-fs-count');
      const ring  = document.getElementById('pm-fs-ring');
      if (count) count.textContent = Math.max(0, this._restant);
      if (ring) {
        ring.style.strokeDashoffset =
          total - (this._restant / this._total) * total;
      }

      // Couleur warning
      if (this._restant <= 10 && ring) {
        ring.style.stroke = 'var(--fd-coral)';
        ring.style.filter = 'drop-shadow(0 0 12px var(--fd-coral))';
        if (count) count.style.color = 'var(--fd-coral)';
      }

      if (this._restant <= 0) {
        clearInterval(this._timer);
        PM.sons.timer();
        try { navigator.vibrate([300,100,300]); } catch(e) {}
        setTimeout(() => this.fermer(), 800);
        PM.toast('⚡ Repos terminé — C\'est parti !', 'info');
      }
    }, 1000);
  },

  ajouter(sec) {
    this._restant += sec;
    PM.sons.clic();
  },

  passer() {
    clearInterval(this._timer);
    this.fermer();
    PM.sons.clic();
  },

  fermer() {
    clearInterval(this._timer);
    const el = document.getElementById('pm-timer-fs');
    if (el) el.remove();
  }
};

// Override PM.demarrerRepos
PM.demarrerRepos = function(sec) {
  PM.timerFullscreen.ouvrir(sec, 'Repos entre séries');
};

// ═══════════════════════════════════════════════════════════
// PAGE COACH IA v2
// ═══════════════════════════════════════════════════════════
function _rendreCoach(container) {

  const profil  = PM.get(() => Tracker.getProfil(), { nom:'Athlète' });
  const analyse = PM.get(() => Coach.getAnalyseSemaine(),
                    { seances:0, objectif:4, volume:0, rpe:0 });
  const msgs    = PM.get(() => Coach.getHistoriqueMessages(), []);
  const seance  = PM.get(() => Programme.getSeanceduJour(), null);

  // Suggestions rapides
  const suggestions = [
    '💪 Analyse ma progression',
    '📊 Comment améliorer mon volume ?',
    '😴 Suis-je assez récupéré ?',
    '🏋️ Programme la semaine prochaine',
    '🔥 Défis adaptés à mon niveau',
    '🥗 Conseils nutritionnels'
  ];

  container.innerHTML = `

    <!-- Header Coach -->
    <div style="background:linear-gradient(135deg,
                rgba(191,161,255,.2),rgba(75,75,249,.08));
                border:1px solid rgba(191,161,255,.3);
                border-radius:20px;padding:16px;margin-bottom:14px;
                display:flex;align-items:center;gap:14px;
                animation:pm-fadeUp .3s ease">
      <div style="width:52px;height:52px;border-radius:50%;flex-shrink:0;
                  background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                  display:flex;align-items:center;justify-content:center;
                  font-size:1.6rem;
                  box-shadow:0 0 20px rgba(75,75,249,.4);
                  animation:pm-avatarPulse 3s ease-in-out infinite">
        🤖
      </div>
      <div style="flex:1">
        <div style="font-size:.95rem;font-weight:800">Coach PowerApp IA</div>
        <div style="font-size:.7rem;color:rgba(255,255,255,.5);margin-top:2px">
          Analyse en temps réel · Personnalisé pour ${profil.nom}
        </div>
        <div style="display:flex;align-items:center;gap:5px;margin-top:4px">
          <div style="width:6px;height:6px;border-radius:50%;
                      background:var(--fd-mint);
                      box-shadow:0 0 5px var(--fd-mint);
                      animation:pm-pulse 2s infinite"></div>
          <div style="font-size:.62rem;color:var(--fd-mint);font-weight:600">
            En ligne
          </div>
        </div>
      </div>
    </div>

    <!-- Stats rapides Coach -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);
                gap:8px;margin-bottom:14px">
      ${[
        {emoji:'📅',val:`${analyse.seances}/${analyse.objectif}`,label:'Séances',c:'var(--fd-indigo)'},
        {emoji:'📦',val:PM.vol(analyse.volume),                  label:'Volume', c:'var(--fd-mint)'  },
        {emoji:'😤',val:analyse.rpe>0?`${analyse.rpe}/10`:'—',  label:'RPE',    c:'var(--fd-lemon)' }
      ].map(s=>`
        <div style="background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:10px 8px;text-align:center">
          <div style="font-size:.75rem;margin-bottom:3px">${s.emoji}</div>
          <div style="font-size:.9rem;font-weight:800;color:${s.c}">${s.val}</div>
          <div style="font-size:.5rem;color:rgba(255,255,255,.3);
                      text-transform:uppercase;margin-top:2px">${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Zone chat -->
    <div style="background:rgba(255,255,255,.02);
                border:1px solid rgba(255,255,255,.06);
                border-radius:20px;margin-bottom:12px;overflow:hidden">

      <!-- Messages -->
      <div id="pm-chat-messages"
           style="display:flex;flex-direction:column;
                  padding:16px;gap:4px;
                  max-height:380px;overflow-y:auto;
                  scrollbar-width:none">

        <!-- Message IA initial -->
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:4px">
          <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                      background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                      display:flex;align-items:center;justify-content:center;
                      font-size:.8rem">🤖</div>
          <div class="pm-chat-bubble ai">
            Bonjour ${profil.nom} ! 👋 Je suis ton Coach IA.
            ${seance
              ? `Ta séance du jour est <strong>${seance.emoji} ${seance.nom}</strong>. Tu veux qu'on l'analyse ensemble ?`
              : "Aujourd'hui c'est repos — profite pour récupérer ! Comment tu te sens ?"}
          </div>
        </div>

        <!-- Historique messages -->
        ${msgs.slice(-6).map(m => `
          <div style="display:flex;align-items:flex-start;gap:8px;
                      ${m.role==='user'?'flex-direction:row-reverse':''}">
            ${m.role!=='user'?`
              <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                          background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                          display:flex;align-items:center;justify-content:center;
                          font-size:.8rem">🤖</div>` : ''}
            <div class="pm-chat-bubble ${m.role==='user'?'user':'ai'}">
              ${m.content}
            </div>
          </div>`).join('')}
      </div>

      <!-- Input chat -->
      <div style="border-top:1px solid rgba(255,255,255,.06);padding:12px">
        <div style="display:flex;gap:8px;align-items:flex-end">
          <textarea id="pm-chat-input"
                    placeholder="Pose une question à ton coach..."
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
                      event.preventDefault();PM.chatEnvoyer();
                    }"></textarea>
          <button onclick="PM.chatEnvoyer()"
                  class="pm-pressable"
                  style="width:44px;height:44px;border-radius:12px;flex-shrink:0;
                         background:var(--fd-indigo);border:none;
                         font-size:1.1rem;cursor:pointer;
                         box-shadow:0 4px 14px rgba(75,75,249,.4)">
            ➤
          </button>
        </div>
      </div>
    </div>

    <!-- Suggestions rapides -->
    <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em;color:rgba(255,255,255,.3);
                margin-bottom:8px">💡 Suggestions</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      ${suggestions.map(s=>`
        <button onclick="PM.chatSuggestion('${s.replace(/'/g,"\\'")}')"
                class="pm-pressable"
                style="padding:7px 12px;background:rgba(75,75,249,.1);
                       border:1px solid rgba(75,75,249,.2);border-radius:99px;
                       font-size:.7rem;font-weight:600;color:var(--fd-lavender);
                       cursor:pointer;transition:all .2s"
                onmouseenter="this.style.background='rgba(75,75,249,.2)'"
                onmouseleave="this.style.background='rgba(75,75,249,.1)'">
          ${s}
        </button>`).join('')}
    </div>

    <div style="height:8px"></div>
  `;

  // Scroll en bas
  setTimeout(() => {
    const msgs = document.getElementById('pm-chat-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 100);
}

// Chat helpers
PM.chatEnvoyer = function() {
  const input = document.getElementById('pm-chat-input');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  PM.sons.clic();
  PM._chatAjouter(msg, 'user');
  PM._chatTyping();
  setTimeout(() => {
    PM._chatRepondre(msg);
  }, 800 + Math.random() * 800);
};

PM.chatSuggestion = function(msg) {
  const input = document.getElementById('pm-chat-input');
  if (input) { input.value = msg; }
  PM.chatEnvoyer();
};

PM._chatAjouter = function(content, role) {
  const container = document.getElementById('pm-chat-messages');
  if (!container) return;

  // Supprimer typing si existe
  document.getElementById('pm-typing')?.remove();

  const div = document.createElement('div');
  div.style.cssText = `display:flex;align-items:flex-start;gap:8px;
    ${role==='user'?'flex-direction:row-reverse':''}`;
  div.innerHTML = `
    ${role!=='user'?`
      <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                  background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                  display:flex;align-items:center;justify-content:center;
                  font-size:.8rem">🤖</div>` : ''}
    <div class="pm-chat-bubble ${role}">
      ${content}
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;

  // Sauvegarder
  try { Coach.ajouterMessage?.({ role, content }); } catch(e) {}
};

PM._chatTyping = function() {
  const container = document.getElementById('pm-chat-messages');
  if (!container) return;
  const div = document.createElement('div');
  div.id = 'pm-typing';
  div.style.cssText = 'display:flex;align-items:flex-start;gap:8px';
  div.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;flex-shrink:0;
                background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                display:flex;align-items:center;justify-content:center;
                font-size:.8rem">🤖</div>
    <div class="pm-chat-typing">
      <span></span><span></span><span></span>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
};

PM._chatRepondre = function(question) {
  let reponse = '';

  try {
    const r = Coach.repondre?.(question);
    if (r) { reponse = r; }
  } catch(e) {}

  if (!reponse) {
    const q = question.toLowerCase();
    const analyse = PM.get(() => Coach.getAnalyseSemaine(),
      { seances:0, objectif:4, volume:0 });
    const pct = Math.round((analyse.seances/Math.max(analyse.objectif,1))*100);

    if (q.includes('progression') || q.includes('analyse')) {
      reponse = `📊 Cette semaine : ${analyse.seances}/${analyse.objectif} séances (${pct}%).
        ${pct >= 75 ? '🔥 Excellent rythme, continue !' :
          pct >= 50 ? '👍 Bon début, reste régulier !' :
          '💪 On peut mieux faire — vise 4 séances !'}`;
    } else if (q.includes('volume')) {
      reponse = `📦 Ton volume actuel est de ${PM.vol(analyse.volume)}.
        Pour progresser, vise +5-10% par semaine.
        Ajoute une série par exercice principal chaque semaine.`;
    } else if (q.includes('récup') || q.includes('repos')) {
      reponse = `😴 La récupération est clé !
        Dors 7-9h par nuit, bois 2L d'eau/jour.
        Entre les séances lourdes, laisse 48h de repos musculaire.`;
    } else if (q.includes('programme')) {
      reponse = `📅 Je génère ton programme selon ta progression.
        Basé sur tes données : ${analyse.seances} séances/sem.
        Continue ainsi et augmente progressivement l'intensité ! 💪`;
    } else if (q.includes('nutri') || q.includes('manger')) {
      reponse = `🥗 Pour tes objectifs :
        • Protéines : 1.8-2.2g/kg de poids
        • Glucides : énergie avant séance
        • Lipides : récupération et hormones
        Va voir la section Nutrition pour les détails !`;
    } else {
      const reps = [
        `💪 Bonne question ${PM.get(()=>Tracker.getProfil().nom,'') || ''} ! Continue sur ta lancée, tes efforts paient !`,
        `🎯 Focus sur la régularité — c'est la clé du succès à long terme.`,
        `📈 Tes données montrent une bonne progression. Reste constant !`,
        `🔥 Tu es sur la bonne voie ! Chaque séance compte.`
      ];
      reponse = reps[Math.floor(Math.random()*reps.length)];
    }
  }

  document.getElementById('pm-typing')?.remove();
  PM._chatAjouter(reponse, 'ai');
  PM.sons.clic();
};

// ═══════════════════════════════════════════════════════════
// PAGE DÉFIS v2
// ═══════════════════════════════════════════════════════════
function _rendreDefis(container) {

  let defis = PM.get(() => Defis.mettreAJourProgression(), []);

  if (!defis.length) {
    defis = [
      { id:'d1', emoji:'🔥', titre:'12 séances ce mois',   progression:7,  cible:12,  complete:false, xp:200, couleur:'#f9ef77' },
      { id:'d2', emoji:'💪', titre:'500kg bench ce mois',   progression:380,cible:500, complete:false, xp:150, couleur:'#4b4bf9' },
      { id:'d3', emoji:'⚡', titre:'Streak 7 jours',        progression:5,  cible:7,   complete:false, xp:100, couleur:'#8bf0bb' },
      { id:'d4', emoji:'🏋️', titre:'20 séances totales',    progression:20, cible:20,  complete:true,  xp:300, couleur:'#bfa1ff' },
      { id:'d5', emoji:'📅', titre:'4 séances cette semaine',progression:3, cible:4,   complete:false, xp:80,  couleur:'#ff8d96' },
      { id:'d6', emoji:'🎯', titre:'Nouveau PR Squat',      progression:0,  cible:1,   complete:false, xp:250, couleur:'#f9ef77' }
    ];
  }

  const termines  = defis.filter(d => d.complete);
  const encours   = defis.filter(d => !d.complete);
  const xpTotal   = termines.reduce((s,d) => s + (d.xp||0), 0);

  container.innerHTML = `

    <!-- Header défis -->
    <div style="background:linear-gradient(135deg,
                rgba(249,239,119,.15),rgba(249,239,119,.04));
                border:1px solid rgba(249,239,119,.3);
                border-radius:20px;padding:16px 20px;margin-bottom:14px;
                display:flex;align-items:center;justify-content:space-between;
                animation:pm-fadeUp .3s ease">
      <div>
        <div style="font-size:1.1rem;font-weight:800">🏆 Défis</div>
        <div style="font-size:.72rem;color:rgba(255,255,255,.5);margin-top:2px">
          ${termines.length}/${defis.length} complétés · ${xpTotal} XP gagnés
        </div>
      </div>
      <div style="text-align:center">
        <div style="font-size:2rem;font-weight:800;color:var(--fd-lemon)">
          ${termines.length}
        </div>
        <div style="font-size:.55rem;color:rgba(255,255,255,.4);
                    text-transform:uppercase">Terminés</div>
      </div>
    </div>

    <!-- En cours -->
    ${PM.sectionTitle('⚡ En cours', `<span style="color:var(--fd-indigo)">${encours.length}</span>`)}

    ${encours.map((d,i) => {
      const pct  = Math.round((d.progression/Math.max(d.cible,1))*100);
      const circ = 157; // 2π×25
      const dash = (pct/100)*circ;
      return `
        <div class="pm-defi-card" style="animation-delay:${i*.06}s">
          <div style="display:flex;align-items:center;gap:14px">

            <!-- Ring progress -->
            <div style="position:relative;width:56px;height:56px;flex-shrink:0">
              <svg width="56" height="56" class="pm-ring-progress">
                <circle cx="28" cy="28" r="24" fill="none"
                        stroke="${d.couleur||'#4b4bf9'}22" stroke-width="5"/>
                <circle cx="28" cy="28" r="24" fill="none"
                        stroke="${d.couleur||'#4b4bf9'}" stroke-width="5"
                        stroke-linecap="round"
                        stroke-dasharray="${dash} ${circ-dash}"
                        style="filter:drop-shadow(0 0 3px ${d.couleur||'#4b4bf9'})"/>
              </svg>
              <div style="position:absolute;top:50%;left:50%;
                          transform:translate(-50%,-50%);
                          font-size:.75rem;font-weight:800">
                ${pct}%
              </div>
            </div>

            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
                <span style="font-size:1rem">${d.emoji}</span>
                <span style="font-size:.85rem;font-weight:700;
                             overflow:hidden;text-overflow:ellipsis;
                             white-space:nowrap">${d.titre}</span>
              </div>
              <div style="height:5px;background:rgba(255,255,255,.06);
                          border-radius:99px;overflow:hidden;margin-bottom:5px">
                <div style="height:100%;width:${pct}%;
                            background:${d.couleur||'#4b4bf9'};
                            border-radius:99px;
                            box-shadow:0 0 6px ${d.couleur||'#4b4bf9'};
                            animation:pm-progressFill .8s ${i*.1}s ease both"></div>
              </div>
              <div style="display:flex;justify-content:space-between;
                          font-size:.62rem">
                <span style="color:rgba(255,255,255,.4)">
                  ${d.progression} / ${d.cible}
                  ${d.unite||''}
                </span>
                <span style="color:${d.couleur||'#4b4bf9'};font-weight:700">
                  +${d.xp||0} XP
                </span>
              </div>
            </div>
          </div>
        </div>`;
    }).join('')}

    <!-- Terminés -->
    ${termines.length > 0 ? `
      ${PM.sectionTitle('✅ Complétés', `<span style="color:var(--fd-mint)">${termines.length}</span>`)}
      ${termines.map((d,i)=>`
        <div class="pm-defi-card complete" style="animation-delay:${i*.06}s">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="width:44px;height:44px;border-radius:50%;flex-shrink:0;
                        background:rgba(139,240,187,.15);
                        border:2px solid rgba(139,240,187,.4);
                        display:flex;align-items:center;justify-content:center;
                        font-size:1.2rem">
              ${d.emoji}
            </div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:700;
                          text-decoration:line-through;
                          color:rgba(255,255,255,.5)">
                ${d.titre}
              </div>
              <div style="font-size:.65rem;color:var(--fd-mint);margin-top:2px">
                ✅ Complété · +${d.xp||0} XP
              </div>
            </div>
            <div style="font-size:1.5rem">🏆</div>
          </div>
        </div>`).join('')}` : ''}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE NUTRITION v2
// ═══════════════════════════════════════════════════════════
function _rendreNutrition(container) {

  const profil  = PM.get(() => Tracker.getProfil(),
                    { poids:80, objectif:'forme' });
  const nutri   = PM.get(() => Nutrition.getJournee(),
                    { calories:{ conso:1840, objectif:2400 },
                      proteines:{ conso:120, objectif:160 },
                      glucides: { conso:180, objectif:280 },
                      lipides:  { conso:55,  objectif:70  } });
  const repas   = PM.get(() => Nutrition.getRepasJournee(), []);
  const streak  = PM.get(() => Nutrition.getStreak(), 0);

  const calPct  = Math.round((nutri.calories.conso /
    Math.max(nutri.calories.objectif,1))*100);

  // Donut calories
  const circ = 345;
  const dash  = Math.min(1,(nutri.calories.conso/
    Math.max(nutri.calories.objectif,1)))*circ;

  container.innerHTML = `

    <!-- Hero calories -->
    <div style="background:linear-gradient(135deg,
                rgba(139,240,187,.15),rgba(75,75,249,.06));
                border:1px solid rgba(139,240,187,.3);
                border-radius:22px;padding:20px;margin-bottom:14px;
                animation:pm-fadeUp .3s ease">

      <div style="display:flex;align-items:center;gap:20px">

        <!-- Donut -->
        <div style="position:relative;width:110px;height:110px;flex-shrink:0">
          <svg width="110" height="110" style="transform:rotate(-90deg)">
            <circle cx="55" cy="55" r="48" fill="none"
                    stroke="rgba(255,255,255,.05)" stroke-width="10"/>
            <circle cx="55" cy="55" r="48" fill="none"
                    stroke="var(--fd-mint)" stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${dash} ${circ-dash}"
                    style="filter:drop-shadow(0 0 6px var(--fd-mint));
                           transition:stroke-dasharray .8s"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);text-align:center">
            <div style="font-size:1.3rem;font-weight:800;color:var(--fd-mint)">
              ${calPct}%
            </div>
            <div style="font-size:.52rem;color:rgba(255,255,255,.4)">kcal</div>
          </div>
        </div>

        <!-- Infos -->
        <div style="flex:1">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:rgba(255,255,255,.3);
                      margin-bottom:4px">Calories aujourd'hui</div>
          <div style="font-size:2rem;font-weight:800;color:var(--fd-mint);
                      line-height:1">
            ${nutri.calories.conso}
          </div>
          <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:2px">
            / ${nutri.calories.objectif} kcal
          </div>
          <div style="font-size:.65rem;color:var(--fd-lemon);
                      margin-top:6px;font-weight:700">
            ${nutri.calories.objectif - nutri.calories.conso > 0
              ? `Reste ${nutri.calories.objectif - nutri.calories.conso} kcal`
              : '✅ Objectif atteint !'}
          </div>
        </div>
      </div>
    </div>

    <!-- Macros -->
    ${PM.sectionTitle('💊 Macronutriments')}
    <div class="pm-card" style="margin-bottom:14px">
      ${[
        {label:'🥩 Protéines',val:nutri.proteines,c:'#4b4bf9', unit:'g'},
        {label:'🍚 Glucides', val:nutri.glucides, c:'#f9ef77', unit:'g'},
        {label:'🥑 Lipides',  val:nutri.lipides,  c:'#ff8d96', unit:'g'}
      ].map(m => {
        const pct = Math.round((m.val.conso/Math.max(m.val.objectif,1))*100);
        return `
          <div style="margin-bottom:12px">
            <div style="display:flex;justify-content:space-between;
                        margin-bottom:5px;font-size:.78rem">
              <span style="font-weight:600">${m.label}</span>
              <span style="font-weight:700;color:${m.c}">
                ${m.val.conso}/${m.val.objectif}${m.unit}
                <span style="font-weight:400;color:rgba(255,255,255,.4)">
                  · ${pct}%
                </span>
              </span>
            </div>
            <div class="pm-macro-bar">
              <div class="pm-macro-fill"
                   style="width:${pct}%;background:${m.c};
                          box-shadow:0 0 6px ${m.c}"></div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Repas du jour -->
    ${PM.sectionTitle('🍽 Repas du jour')}

    ${['Petit-déjeuner','Déjeuner','Dîner','Collation'].map((repas, i) => {
      const r = repas[i] || null;
      return `
        <div style="background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:16px;padding:14px 16px;margin-bottom:8px;
                    cursor:pointer;transition:all .2s;
                    animation:pm-fadeUp .3s ${i*.08}s ease both"
             onclick="PM.toast('🍽 ${repas} — En développement', 'info')"
             onmouseenter="this.style.borderColor='rgba(75,75,249,.25)'"
             onmouseleave="this.style.borderColor='rgba(255,255,255,.08)'">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:36px;height:36px;border-radius:10px;
                          background:rgba(75,75,249,.15);
                          border:1px solid rgba(75,75,249,.2);
                          display:flex;align-items:center;justify-content:center;
                          font-size:1.1rem">
                ${['🌅','☀️','🌙','🍎'][i]}
              </div>
              <div>
                <div style="font-size:.85rem;font-weight:700">${repas}</div>
                <div style="font-size:.65rem;color:rgba(255,255,255,.4)">
                  ${r ? `${r.calories || 0} kcal` : 'Non renseigné'}
                </div>
              </div>
            </div>
            <button style="padding:6px 12px;background:rgba(75,75,249,.12);
                           border:1px solid rgba(75,75,249,.2);border-radius:99px;
                           font-size:.65rem;font-weight:700;
                           color:var(--fd-indigo);cursor:pointer">
              + Ajouter
            </button>
          </div>
        </div>`;
    }).join('')}

    <!-- Streak nutrition -->
    ${streak > 0 ? `
      <div style="background:rgba(249,239,119,.08);
                  border:1px solid rgba(249,239,119,.2);
                  border-radius:16px;padding:12px 16px;margin-top:8px;
                  display:flex;align-items:center;gap:10px">
        <div style="font-size:1.5rem">🔥</div>
        <div>
          <div style="font-size:.85rem;font-weight:800;color:var(--fd-lemon)">
            Streak nutrition : ${streak} jours
          </div>
          <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-top:2px">
            Continue à tracker tes repas !
          </div>
        </div>
      </div>` : ''}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE GAMIFICATION v2
// ═══════════════════════════════════════════════════════════
function _rendreGamification(container) {

  const xp       = PM.get(() => Gamification.getXP(),
                     { total:0, pourcentage:0, versProchain:0,
                       niveau:{ emoji:'💪', numero:1, nom:'Débutant',
                                couleur:'#4b4bf9' } });
  const trophees = PM.get(() => Gamification.getTrophees(), []);
  const niveaux  = PM.get(() => Gamification.getNiveaux(), [
    { numero:1, nom:'Débutant',      emoji:'🌱', xp:0,    couleur:'#8bf0bb' },
    { numero:2, nom:'Régulier',      emoji:'💪', xp:500,  couleur:'#4b4bf9' },
    { numero:3, nom:'Intermédiaire', emoji:'🔥', xp:1200, couleur:'#f9ef77' },
    { numero:4, nom:'Confirmé',      emoji:'⚡', xp:2500, couleur:'#bfa1ff' },
    { numero:5, nom:'Expert',        emoji:'🏆', xp:5000, couleur:'#ff8d96' },
    { numero:6, nom:'Élite',         emoji:'💎', xp:10000,couleur:'#f9ef77' }
  ]);

  const unlocked = trophees.filter(t => t.debloquee);
  const niveauActuel = xp.niveau;

  container.innerHTML = `

    <!-- Hero XP -->
    <div style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border-radius:22px;padding:24px 20px;margin-bottom:14px;
                text-align:center;position:relative;overflow:hidden;
                animation:pm-fadeUp .3s ease">
      <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;
                  border-radius:50%;
                  background:radial-gradient(circle,rgba(255,255,255,.12),transparent 70%);
                  pointer-events:none"></div>

      <div style="font-size:3rem;margin-bottom:8px">${niveauActuel.emoji}</div>
      <div style="font-size:1.4rem;font-weight:800">${niveauActuel.nom}</div>
      <div style="font-size:.8rem;opacity:.8;margin-top:2px">
        Niveau ${niveauActuel.numero}
      </div>

      <!-- XP total -->
      <div style="font-size:2.5rem;font-weight:800;margin:12px 0 4px;
                  color:var(--fd-lemon)">
        ${xp.total.toLocaleString('fr')}
        <span style="font-size:1rem;color:rgba(255,255,255,.6);font-weight:400">XP</span>
      </div>

      <!-- XP bar -->
      <div style="margin:12px 0 6px">
        <div class="pm-xp-bar">
          <div class="pm-xp-fill" style="width:${xp.pourcentage}%"></div>
          <div class="pm-xp-shine"></div>
        </div>
      </div>
      <div style="font-size:.65rem;opacity:.6">
        ${xp.versProchain} XP pour le niveau suivant
      </div>
    </div>

    <!-- Niveaux timeline -->
    ${PM.sectionTitle('🗺 Progression des niveaux')}
    <div style="position:relative;padding-left:24px;margin-bottom:14px">
      <div style="position:absolute;left:11px;top:0;bottom:0;width:2px;
                  background:rgba(255,255,255,.06)"></div>
      ${niveaux.map((n,i) => {
        const atteint = xp.niveau.numero > n.numero;
        const actuel  = xp.niveau.numero === n.numero;
        return `
          <div style="position:relative;margin-bottom:10px;
                      animation:pm-slideIn .3s ${i*.07}s ease both">
            <div style="position:absolute;left:-17px;top:12px;
                        width:12px;height:12px;border-radius:50%;
                        background:${atteint||actuel ? n.couleur : 'rgba(255,255,255,.1)'};
                        ${actuel?`box-shadow:0 0 8px ${n.couleur}`:''}
                        border:2px solid var(--bg-app,#070714)"></div>
            <div style="background:${actuel
                          ? `rgba(75,75,249,.15);border-color:rgba(75,75,249,.35)`
                          : atteint
                            ? `rgba(139,240,187,.06);border-color:rgba(139,240,187,.2)`
                            : 'rgba(255,255,255,.04)'};
                        border:1px solid ${actuel
                          ? 'rgba(75,75,249,.35)'
                          : atteint
                            ? 'rgba(139,240,187,.2)'
                            : 'rgba(255,255,255,.07)'};
                        border-radius:14px;padding:10px 14px;
                        display:flex;align-items:center;gap:10px;
                        opacity:${atteint||actuel?'1':'.5'}">
              <div style="font-size:1.4rem">${n.emoji}</div>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:700;
                            color:${actuel?'white':atteint?'rgba(255,255,255,.8)':'rgba(255,255,255,.4)'}">
                  ${n.nom}
                  ${actuel?`<span style="font-size:.6rem;padding:2px 7px;
                    background:rgba(75,75,249,.2);border-radius:99px;
                    color:var(--fd-lavender);margin-left:5px">Actuel</span>`:''}
                </div>
                <div style="font-size:.62rem;color:rgba(255,255,255,.4);margin-top:1px">
                  Niveau ${n.numero} · ${n.xp.toLocaleString('fr')} XP
                </div>
              </div>
              ${atteint?'<div style="font-size:1rem">✅</div>':''}
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Trophées -->
    ${PM.sectionTitle(`🏆 Trophées (${unlocked.length}/${trophees.length})`)}
    <div style="display:grid;grid-template-columns:repeat(4,1fr);
                gap:8px;margin-bottom:14px">
      ${trophees.slice(0,12).map((t,i) => `
        <div class="pm-badge ${t.debloquee?'unlocked':''}"
             style="animation:pm-countUp .4s ${i*.05}s ease both"
             onclick="${t.debloquee
               ? `PM.toast('🏆 ${t.nom}\\n${t.description||''}', 'pr')`
               : `PM.toast('🔒 Non débloqué encore', 'info')`}">
          <div style="font-size:1.4rem;
                      ${!t.debloquee?'filter:grayscale(1);opacity:.3':''}">
            ${t.emoji||'🏆'}
          </div>
          <div style="font-size:.5rem;font-weight:700;line-height:1.2;
                      color:${t.debloquee?'var(--fd-lemon)':'rgba(255,255,255,.3)'}">
            ${t.nom||'???'}
          </div>
          ${t.debloquee?`
            <div style="font-size:.45rem;color:var(--fd-mint)">
              +${t.xp||50}XP
            </div>`:''}
        </div>`).join('')}
    </div>

    <!-- Actions XP rapides -->
    ${PM.sectionTitle('⚡ Gagner des XP')}
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
      ${[
        {emoji:'🏋️',label:'Finir une séance',  xp:'+100 XP',c:'#4b4bf9'},
        {emoji:'🔥',label:'Maintenir le streak',xp:'+20 XP', c:'#f9ef77'},
        {emoji:'🏆',label:'Battre un record',   xp:'+50 XP', c:'#ff8d96'},
        {emoji:'🎯',label:'Finir un défi',       xp:'+150 XP',c:'#8bf0bb'}
      ].map(a=>`
        <div style="background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:14px;padding:12px;
                    display:flex;align-items:center;gap:8px">
          <div style="font-size:1.3rem">${a.emoji}</div>
          <div style="flex:1">
            <div style="font-size:.78rem;font-weight:600">${a.label}</div>
            <div style="font-size:.65rem;font-weight:700;
                        color:${a.c};margin-top:2px">${a.xp}</div>
          </div>
        </div>`).join('')}
    </div>

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// PAGE ANALYTICS / DASHBOARD
// ═══════════════════════════════════════════════════════════
function _rendreAnalytics(container) {

  const historique = PM.get(() => Tracker.getHistorique(), []);
  const analyse    = PM.get(() => Coach.getAnalyseSemaine(),
                      { seances:0, objectif:4, volume:0, rpe:0 });
  const prs        = PM.get(() => Tracker.getPRs(), []);

  // Données graphique 4 semaines
  const semaines = [
    { label:'S-3', seances:3, volume:28000, rpe:7.2 },
    { label:'S-2', seances:4, volume:34000, rpe:7.8 },
    { label:'S-1', seances:3, volume:31000, rpe:7.5 },
    { label:'Cette sem', seances:analyse.seances, volume:analyse.volume*1000||12000, rpe:analyse.rpe||7 }
  ];

  const maxVol = Math.max(...semaines.map(s => s.volume), 1);
  const W = 300, H = 100;

  const barW   = 50;
  const barGap = (W - semaines.length * barW) / (semaines.length + 1);

  container.innerHTML = `

    <!-- Header analytics -->
    <div style="background:linear-gradient(135deg,
                rgba(75,75,249,.15),rgba(191,161,255,.06));
                border:1px solid rgba(75,75,249,.3);
                border-radius:20px;padding:16px 20px;margin-bottom:14px;
                animation:pm-fadeUp .3s ease">
      <div style="font-size:1rem;font-weight:800;margin-bottom:4px">
        📊 Analytics PowerApp
      </div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.4)">
        Analyse complète de tes performances
      </div>
    </div>

    <!-- KPIs -->
    <div style="display:grid;grid-template-columns:repeat(2,1fr);
                gap:10px;margin-bottom:14px">
      ${[
        {emoji:'📅',label:'Total séances', val:PM.get(()=>Tracker.getTotalSeances(),0),    c:'#4b4bf9'},
        {emoji:'📦',label:'Volume total',  val:PM.vol(PM.get(()=>Tracker.getVolumeTotal(),0)),c:'#8bf0bb'},
        {emoji:'🏆',label:'Records perso', val:prs.length,                                c:'#f9ef77'},
        {emoji:'🔥',label:'Meilleur streak',val:PM.get(()=>Tracker.getStreak()?.max||0,0),c:'#ff8d96'}
      ].map((k,i)=>`
        <div style="background:rgba(255,255,255,.04);
                    border:1px solid rgba(255,255,255,.08);
                    border-radius:16px;padding:14px;
                    animation:pm-countUp .4s ${i*.1}s ease both">
          <div style="font-size:.65rem;color:rgba(255,255,255,.4);margin-bottom:4px">
            ${k.emoji} ${k.label}
          </div>
          <div style="font-size:1.6rem;font-weight:800;color:${k.c}">
            ${k.val}
          </div>
        </div>`).join('')}
    </div>

    <!-- Graphique barres 4 semaines -->
    <div class="pm-card" style="margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:12px">
        📈 Volume — 4 dernières semaines
      </div>
      <svg width="100%" height="130" viewBox="0 0 320 130">
        <defs>
          <linearGradient id="pm-bar-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4b4bf9" stop-opacity=".9"/>
            <stop offset="100%" stop-color="#4b4bf9" stop-opacity=".3"/>
          </linearGradient>
          <linearGradient id="pm-bar-grad-last" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#8bf0bb" stop-opacity=".9"/>
            <stop offset="100%" stop-color="#8bf0bb" stop-opacity=".3"/>
          </linearGradient>
        </defs>
        ${[20,60,100].map(y=>`
          <line x1="0" y1="${y}" x2="320" y2="${y}"
                stroke="rgba(255,255,255,.04)" stroke-width="1"/>`).join('')}
        ${semaines.map((s,i) => {
          const x   = barGap + i * (barW + barGap) + 10;
          const bH  = (s.volume / maxVol) * (H - 10);
          const y   = H - bH;
          const last = i === semaines.length - 1;
          return `
            <rect x="${x}" y="${y}" width="${barW}" height="${bH}"
                  rx="6" fill="url(#pm-bar-grad${last?'-last':''})"
                  style="filter:drop-shadow(0 0 4px ${last?'#8bf0bb':'#4b4bf9'})"/>
            <text x="${x+barW/2}" y="${H+18}" text-anchor="middle"
                  fill="rgba(255,255,255,.35)" font-size="7"
                  font-family="-apple-system,sans-serif">${s.label}</text>
            <text x="${x+barW/2}" y="${y-6}" text-anchor="middle"
                  fill="${last?'#8bf0bb':'rgba(255,255,255,.5)'}"
                  font-size="8" font-weight="700"
                  font-family="-apple-system,sans-serif">
              ${PM.vol(s.volume)}
            </text>`;
        }).join('')}
      </svg>
    </div>

    <!-- Comparaison semaine -->
    <div class="pm-card" style="margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:rgba(255,255,255,.3);margin-bottom:12px">
        📊 Cette sem vs précédente
      </div>
      ${[
        {label:'Séances',  curr:analyse.seances, prev:3,           unit:'',   c:'#4b4bf9'},
        {label:'Volume',   curr:analyse.volume,  prev:31,          unit:'kg', c:'#8bf0bb'},
        {label:'RPE moy.', curr:analyse.rpe||7,  prev:7.5,         unit:'/10',c:'#f9ef77'}
      ].map(m => {
        const delta = m.curr - m.prev;
        const pct   = m.prev > 0
          ? Math.round((delta / m.prev) * 100) : 0;
        const up    = delta >= 0;
        return `
          <div style="display:flex;align-items:center;
                      justify-content:space-between;margin-bottom:10px">
            <div style="font-size:.78rem;color:rgba(255,255,255,.5)">${m.label}</div>
            <div style="display:flex;align-items:center;gap:12px">
              <div style="font-size:.72rem;color:rgba(255,255,255,.35)">
                ${m.prev}${m.unit}
              </div>
              <div style="font-size:.68rem;font-weight:700;
                          color:${up?'var(--fd-mint)':'var(--fd-coral)'};
                          padding:2px 8px;border-radius:99px;
                          background:${up?'rgba(139,240,187,.1)':'rgba(255,141,150,.1)'}">
                ${up?'+':''}${pct}%
              </div>
              <div style="font-size:.82rem;font-weight:800;color:${m.c}">
                ${m.curr}${m.unit}
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <!-- Top exercices -->
    ${prs.length > 0 ? `
      ${PM.sectionTitle('🏆 Top PRs')}
      <div class="pm-card" style="margin-bottom:14px">
        ${prs.slice(0,5).map((p,i)=>`
          <div style="display:flex;align-items:center;gap:10px;
                      padding:8px 0;
                      border-bottom:${i<prs.length-1&&i<4
                        ?'1px solid rgba(255,255,255,.06)':'none'}">
            <div style="width:24px;height:24px;border-radius:8px;
                        background:${['#f9ef77','#bfa1ff','#4b4bf9','#8bf0bb','#ff8d96'][i]+'22'};
                        display:flex;align-items:center;justify-content:center;
                        font-size:.75rem;font-weight:800;flex-shrink:0;
                        color:${['#f9ef77','#bfa1ff','#4b4bf9','#8bf0bb','#ff8d96'][i]}">
              ${i+1}
            </div>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:700">${p.exercice||p.nom||'—'}</div>
              <div style="font-size:.62rem;color:rgba(255,255,255,.4)">${p.muscle||''}</div>
            </div>
            <div style="font-size:.82rem;font-weight:800;color:var(--fd-lemon)">
              ${p.poids||0}kg×${p.reps||0}
            </div>
          </div>`).join('')}
      </div>` : ''}

    <div style="height:8px"></div>
  `;
}

// ═══════════════════════════════════════════════════════════
// MICRO INTERACTIONS GLOBALES
// ═══════════════════════════════════════════════════════════
(function initMicroInteractions() {
  // Appliquer pm-pressable sur les boutons
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button, [onclick]');
    if (!btn) return;
    // Son clic léger
    try { PM.sons.clic(); } catch(e) {}
  }, { passive: true });

  // Vibration mobile sur boutons importants
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.pm-btn-primary, .ob-btn-next');
    if (!btn) return;
    try { navigator.vibrate?.(30); } catch(e) {}
  }, { passive: true });
})();

// ═══════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════
window._rendreCoach        = _rendreCoach;
window._rendreDefis        = _rendreDefis;
window._rendreNutrition    = _rendreNutrition;
window._rendreGamification = _rendreGamification;
window._rendreAnalytics    = _rendreAnalytics;
window.PM                  = PM;

console.log('✅ UI Premium v3 — Coach + Défis + Nutrition + Gamification + Timer + Analytics');
