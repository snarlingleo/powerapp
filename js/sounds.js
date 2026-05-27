/* ============================================================
   PowerApp — Sounds.js v2.0
   ✅ Sons personnalisables
   ✅ Animations célébration avancées
   ✅ Haptic feedback intelligent
   ✅ Particles confetti améliorés
   ✅ Sons Web Audio API (sans fichiers)
   ✅ Pack sons thématiques
   ============================================================ */

'use strict';

const Sounds = {

  CLE_CONFIG: 'ft_sounds_config',
  _ctx:       null,
  _actif:     true,

  // ════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════
  getConfig() {
    return Utils.storage.get(this.CLE_CONFIG, {
      actif:      true,
      volume:     0.6,
      haptic:     true,
      theme:      'sport',
      animations: true
    });
  },

  setConfig(data) {
    const cfg = { ...this.getConfig(), ...data };
    Utils.storage.set(this.CLE_CONFIG, cfg);
    this._actif = cfg.actif;
    return cfg;
  },

  // ════════════════════════════════════════════════════════
  // WEB AUDIO API — Sons synthétisés
  // ════════════════════════════════════════════════════════
  _getCtx() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume().catch(() => {});
    }
    return this._ctx;
  },

  _jouerNote(freq, duree, type = 'sine', volume = 0.3, delai = 0) {
    try {
      const cfg = this.getConfig();
      if (!cfg.actif) return;

      const ctx  = this._getCtx();
      if (!ctx) return;

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delai);

      const vol     = cfg.volume * volume;
      const start   = ctx.currentTime + delai;

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

  // ════════════════════════════════════════════════════════
  // BIBLIOTHÈQUE DE SONS
  // ════════════════════════════════════════════════════════
  SONS: {

    // ── Succès / Positif ────────────────────────────────
    success: () => {
      Sounds._jouerAcord([
        [523, 0.00, 0.15],  // Do5
        [659, 0.10, 0.15],  // Mi5
        [784, 0.20, 0.25]   // Sol5
      ], 'sine', 0.3);
    },

    // ── Erreur ──────────────────────────────────────────
    error: () => {
      Sounds._jouerAcord([
        [200, 0.00, 0.15],
        [150, 0.12, 0.15]
      ], 'sawtooth', 0.2);
    },

    // ── Série validée ───────────────────────────────────
    serie: () => {
      Sounds._jouerNote(880, 0.08, 'sine', 0.25);
    },

    // ── PR battu ────────────────────────────────────────
    pr: () => {
      Sounds._jouerAcord([
        [392, 0.00, 0.12],  // Sol4
        [523, 0.06, 0.12],  // Do5
        [659, 0.12, 0.12],  // Mi5
        [784, 0.18, 0.12],  // Sol5
        [1047,0.24, 0.30]   // Do6
      ], 'sine', 0.35);
    },

    // ── Level Up ────────────────────────────────────────
    levelup: () => {
      Sounds._jouerAcord([
        [523, 0.00, 0.10],
        [659, 0.08, 0.10],
        [784, 0.16, 0.10],
        [1047,0.24, 0.10],
        [1319,0.32, 0.40]
      ], 'triangle', 0.4);
    },

    // ── Trophée ─────────────────────────────────────────
    trophee: () => {
      Sounds._jouerAcord([
        [784, 0.00, 0.15],
        [880, 0.10, 0.15],
        [988, 0.20, 0.15],
        [1047,0.30, 0.40]
      ], 'sine', 0.35);
    },

    // ── Tick timer ──────────────────────────────────────
    tick: () => {
      Sounds._jouerNote(1200, 0.05, 'square', 0.15);
    },

    // ── Repos démarré ───────────────────────────────────
    repos_start: () => {
      Sounds._jouerAcord([
        [659, 0.00, 0.12],
        [523, 0.10, 0.20]
      ], 'sine', 0.25);
    },

    // ── Repos terminé ───────────────────────────────────
    repos_fin: () => {
      Sounds._jouerAcord([
        [523, 0.00, 0.10],
        [659, 0.08, 0.10],
        [784, 0.16, 0.20]
      ], 'sine', 0.3);
    },

    // ── Clic bouton ─────────────────────────────────────
    clic: () => {
      Sounds._jouerNote(440, 0.04, 'sine', 0.1);
    },

    // ── Séance terminée ─────────────────────────────────
    seance_fin: () => {
      Sounds._jouerAcord([
        [523, 0.00, 0.12],
        [659, 0.10, 0.12],
        [784, 0.20, 0.12],
        [1047,0.30, 0.12],
        [784, 0.42, 0.12],
        [1047,0.52, 0.40]
      ], 'sine', 0.4);
    },

    // ── Défi accompli ───────────────────────────────────
    defi: () => {
      Sounds._jouerAcord([
        [392, 0.00, 0.10],
        [494, 0.08, 0.10],
        [587, 0.16, 0.10],
        [784, 0.24, 0.30]
      ], 'triangle', 0.35);
    },

    // ── Notification ────────────────────────────────────
    notif: () => {
      Sounds._jouerAcord([
        [880, 0.00, 0.08],
        [1100,0.10, 0.12]
      ], 'sine', 0.2);
    },

    // ── Compte à rebours ────────────────────────────────
    countdown_3: () => {
      Sounds._jouerNote(440, 0.1, 'square', 0.2);
    },
    countdown_2: () => {
      Sounds._jouerNote(520, 0.1, 'square', 0.22);
    },
    countdown_1: () => {
      Sounds._jouerNote(660, 0.1, 'square', 0.25);
    },
    countdown_go: () => {
      Sounds._jouerAcord([
        [660, 0.00, 0.1],
        [880, 0.08, 0.2]
      ], 'square', 0.35);
    }
  },

  // ════════════════════════════════════════════════════════
  // JOUER UN SON
  // ════════════════════════════════════════════════════════
  jouer(nom, force = false) {
    try {
      const cfg = this.getConfig();
      if (!cfg.actif && !force) return;
      const son = this.SONS[nom];
      if (son) son();
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // HAPTIC FEEDBACK
  // ════════════════════════════════════════════════════════
  PATTERNS: {
    leger:    [10],
    moyen:    [30],
    fort:     [100],
    double:   [30, 50, 30],
    triple:   [30, 30, 30, 30, 30],
    success:  [10, 50, 10, 50, 100],
    pr:       [50, 50, 50, 50, 200],
    levelup:  [100, 50, 100, 50, 200],
    erreur:   [200],
    countdown:[30, 50, 30, 50, 30, 50, 100]
  },

  vibrer(pattern = 'moyen') {
    try {
      const cfg = this.getConfig();
      if (!cfg.haptic) return;
      const p = typeof pattern === 'string'
        ? (this.PATTERNS[pattern] || [30])
        : pattern;
      if (navigator.vibrate) navigator.vibrate(p);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // ANIMATIONS CONFETTI
  // ════════════════════════════════════════════════════════
  confetti(dureeMs = 3000, intensite = 'normal') {
    const cfg = this.getConfig();
    if (!cfg.animations) return;

    const canvas  = document.createElement('canvas');
    canvas.style.cssText = `
      position:fixed;inset:0;z-index:9998;
      pointer-events:none;width:100%;height:100%`;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx     = canvas.getContext('2d');
    const couleurs = [
      '#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff',
      '#ff8d96','#ffffff','#ffa500','#ff69b4'
    ];

    const nbParticules = intensite === 'burst' ? 200
                       : intensite === 'fort'  ? 150
                       : intensite === 'leger' ? 50
                       :                         100;

    const particules = Array.from({ length:nbParticules }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height * -1,
      w:       Math.random() * 12 + 4,
      h:       Math.random() * 6  + 2,
      color:   couleurs[Math.floor(Math.random() * couleurs.length)],
      vx:      (Math.random() - 0.5) * 4,
      vy:      Math.random() * 4 + 2,
      vr:      (Math.random() - 0.5) * 0.3,
      r:       Math.random() * Math.PI * 2,
      opacite: 1,
      forme:   Math.random() > 0.5 ? 'rect' : 'cercle'
    }));

    let startTime = null;

    const animer = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particules.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.r  += p.vr;
        p.vy += 0.08; // gravité

        if (elapsed > dureeMs * 0.7) {
          p.opacite = Math.max(0, 1 - (elapsed - dureeMs * 0.7) / (dureeMs * 0.3));
        }

        ctx.save();
        ctx.globalAlpha = p.opacite;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;

        if (p.forme === 'cercle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        }
        ctx.restore();
      });

      if (elapsed < dureeMs) {
        requestAnimationFrame(animer);
      } else {
        canvas.remove();
      }
    };

    requestAnimationFrame(animer);
  },

  // ════════════════════════════════════════════════════════
  // ANIMATIONS CÉLÉBRATION
  // ════════════════════════════════════════════════════════
  celebrerPR(nomExo = '', valeur = 0) {
    const cfg = this.getConfig();

    this.jouer('pr');
    this.vibrer('pr');
    if (cfg.animations) this.confetti(4000, 'fort');

    // Overlay PR
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9997;
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      background:rgba(9,9,45,0.85);
      animation:fadeIn .3s ease;
      pointer-events:none`;

    overlay.innerHTML = `
      <div style="text-align:center;animation:scaleIn .4s ease">
        <div style="font-size:4rem;margin-bottom:8px;
                    animation:bounce 0.6s ease 3">🏆</div>
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.2em;
                    color:var(--fd-lemon);margin-bottom:6px">
          NOUVEAU RECORD !
        </div>
        <div style="font-size:1.8rem;font-weight:900;
                    color:var(--fd-lemon)">
          ${nomExo}
        </div>
        ${valeur ? `
          <div style="font-size:3rem;font-weight:900;
                      color:white;margin:8px 0">
            ${valeur}kg
          </div>` : ''}
        <div style="font-size:.75rem;color:rgba(255,255,255,0.5);
                    margin-top:4px">
          1RM personnel battu ! 💪
        </div>
      </div>`;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 3500);
  },

  celebrerSeanceFin(stats = {}) {
    const cfg = this.getConfig();

    this.jouer('seance_fin');
    this.vibrer('levelup');
    if (cfg.animations) this.confetti(3000, 'normal');
  },

  celebrerLevelUp(niveau = {}) {
    const cfg = this.getConfig();

    this.jouer('levelup');
    this.vibrer('levelup');
    if (cfg.animations) this.confetti(5000, 'burst');
  },

  celebrerStreak(jours = 0) {
    this.jouer('success');
    this.vibrer('success');

    if (jours % 7 === 0) {
      this.confetti(2000, 'fort');
    }
  },

  // ════════════════════════════════════════════════════════
  // ANIMATION PULSE (élément UI)
  // ════════════════════════════════════════════════════════
  pulser(element, couleur = '#4b4bf9', dureeMs = 600) {
    if (!element) return;
    const cfg = this.getConfig();
    if (!cfg.animations) return;

    element.style.transition = `box-shadow ${dureeMs/2}ms ease`;
    element.style.boxShadow  = `0 0 0 8px ${couleur}44, 0 0 0 16px ${couleur}22`;
    setTimeout(() => {
      element.style.boxShadow = '';
    }, dureeMs / 2);
  },

  // ════════════════════════════════════════════════════════
  // ANIMATION SHAKE (erreur)
  // ════════════════════════════════════════════════════════
  secouer(element) {
    if (!element) return;
    const cfg = this.getConfig();
    if (!cfg.animations) return;

    element.style.animation = 'shake 0.4s ease';
    setTimeout(() => element.style.animation = '', 400);
  },

  // ════════════════════════════════════════════════════════
  // COMPTE À REBOURS ANIMÉ
  // ════════════════════════════════════════════════════════
  compteARebours(cb, dureeMs = 3000) {
    const cfg  = this.getConfig();
    const etapes = [3, 2, 1, '🚀'];

    etapes.forEach((val, i) => {
      setTimeout(() => {
        // Son
        if (cfg.actif) {
          const sonMap = { 3:'countdown_3', 2:'countdown_2', 1:'countdown_1' };
          if (sonMap[val]) this.jouer(sonMap[val]);
          else this.jouer('countdown_go');
        }

        // Haptic
        if (val !== '🚀') this.vibrer('leger');
        else this.vibrer('fort');

        // Affichage
        if (cfg.animations) {
          const div = document.createElement('div');
          div.style.cssText = `
            position:fixed;inset:0;z-index:9999;
            display:flex;align-items:center;justify-content:center;
            pointer-events:none;background:rgba(9,9,45,.7)`;
          div.innerHTML = `
            <div style="font-size:8rem;font-weight:900;
                        color:${val === '🚀' ? 'var(--fd-mint)' : 'white'};
                        animation:pulse .4s ease;
                        text-shadow:0 0 40px rgba(75,75,249,0.8)">
              ${val}
            </div>`;
          document.body.appendChild(div);
          setTimeout(() => div.remove(), 900);
        }

        if (val === '🚀' && cb) {
          setTimeout(cb, 300);
        }
      }, i * (dureeMs / etapes.length));
    });
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE PARAMÈTRES SONS
  // ════════════════════════════════════════════════════════
  renderSettings(container) {
    if (!container) return;
    const cfg = this.getConfig();

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">🔊 Sons & Animations</div>

        <!-- Toggle sons -->
        <div style="display:flex;align-items:center;gap:12px;
                    padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Sons activés</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Feedback sonore pour chaque action
            </div>
          </div>
          <input type="checkbox" id="son-actif"
                 ${cfg.actif ? 'checked' : ''}
                 onchange="Sounds.setConfig({actif:this.checked});
                           Sounds.jouer('clic',true)"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>

        <!-- Volume -->
        <div style="padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="display:flex;justify-content:space-between;
                      margin-bottom:8px">
            <div style="font-size:.82rem;font-weight:700">Volume</div>
            <span id="vol-label" style="font-size:.78rem;
                                         color:var(--fd-indigo);font-weight:700">
              ${Math.round(cfg.volume * 100)}%
            </span>
          </div>
          <input type="range" id="son-volume"
                 min="0" max="1" step="0.1"
                 value="${cfg.volume}"
                 oninput="document.getElementById('vol-label').textContent=
                   Math.round(this.value*100)+'%';
                   Sounds.setConfig({volume:parseFloat(this.value)});
                   Sounds.jouer('clic',true)"
                 style="width:100%;accent-color:var(--fd-indigo)"/>
        </div>

        <!-- Haptic -->
        <div style="display:flex;align-items:center;gap:12px;
                    padding:12px 0;border-bottom:1px solid var(--border-color)">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Vibrations (Haptic)</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Retour tactile pour les actions importantes
            </div>
          </div>
          <input type="checkbox" id="haptic-actif"
                 ${cfg.haptic ? 'checked' : ''}
                 onchange="Sounds.setConfig({haptic:this.checked})"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>

        <!-- Animations -->
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0">
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:700">Animations</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Confetti, célébrations visuelles
            </div>
          </div>
          <input type="checkbox" id="anim-actif"
                 ${cfg.animations ? 'checked' : ''}
                 onchange="Sounds.setConfig({animations:this.checked})"
                 style="width:20px;height:20px;cursor:pointer"/>
        </div>
      </div>

      <!-- Tester les sons -->
      <div class="card mb-md">
        <div class="card-label mb-md">🎵 Tester les sons</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${[
            { son:'serie',      label:'Série validée', emoji:'✅' },
            { son:'pr',         label:'Nouveau PR',    emoji:'🏆' },
            { son:'levelup',    label:'Level Up',      emoji:'⭐' },
            { son:'trophee',    label:'Trophée',       emoji:'🎖️' },
            { son:'repos_fin',  label:'Repos terminé', emoji:'⏱️' },
            { son:'seance_fin', label:'Séance terminée',emoji:'💪' }
          ].map(t => `
            <button onclick="Sounds.jouer('${t.son}',true)"
                    style="padding:10px;
                           background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.08);
                           border-radius:var(--radius-md);
                           font-size:.75rem;font-weight:600;
                           color:var(--text-primary);cursor:pointer;
                           transition:all .15s"
                    onmousedown="this.style.transform='scale(.96)'"
                    onmouseup="this.style.transform=''">
              ${t.emoji} ${t.label}
            </button>`).join('')}
        </div>
      </div>

      <!-- Tester animations -->
      <div class="card">
        <div class="card-label mb-md">🎉 Tester les animations</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button onclick="Sounds.confetti(2500,'fort')"
                  class="btn-primary" style="font-size:.82rem">
            🎊 Confetti Fort
          </button>
          <button onclick="Sounds.celebrerPR('Bench Press',105)"
                  style="padding:12px;background:rgba(249,239,119,0.1);
                         border:1px solid rgba(249,239,119,0.25);
                         border-radius:var(--radius-md);
                         font-size:.82rem;font-weight:700;
                         color:var(--fd-lemon);cursor:pointer">
            🏆 Célébration PR
          </button>
          <button onclick="Sounds.compteARebours(null,3000)"
                  class="btn-secondary" style="font-size:.82rem">
            ⏱️ Compte à rebours 3...2...1
          </button>
        </div>
      </div>
    `;
  }
};

window.Sounds = Sounds;
console.log('✅ Sounds.js v2.0 — Web Audio API + Animations + Haptic + Confetti');
