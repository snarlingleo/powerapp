/* ============================================================
   PowerApp — TimerManager v1.0
   Timer reps + Timer repos + Alarme rappel
   ============================================================ */

'use strict';

const TimerManager = {

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _timerInterval: null,
  _secondesRestantes: 0,
  _phase: null, // 'reps' | 'repos'
  _enPause: false,

  // ════════════════════════════════════════════════════════
  // TIMER REPS — Manuel
  // ════════════════════════════════════════════════════════
  lancerTimerReps(exoIdx, serieIdx) {
    // Lire la durée depuis l'input si existe, sinon 40s par défaut
    const duree = 40;
    this._afficherOverlay('reps', duree, exoIdx, serieIdx);
    this._demarrer(duree, 'reps');
  },

  // ════════════════════════════════════════════════════════
  // TIMER REPOS — Auto après validation série
  // ════════════════════════════════════════════════════════
  demarrerRepos(secondes = 75) {
    // Fermer overlay reps si ouvert
    this._fermerOverlay();
    this._afficherOverlay('repos', secondes);
    this._demarrer(secondes, 'repos');
  },

  // ════════════════════════════════════════════════════════
  // CORE TIMER
  // ════════════════════════════════════════════════════════
  _demarrer(secondes, phase) {
    this._arreter();
    this._secondesRestantes = secondes;
    this._phase = phase;
    this._enPause = false;
    this._mettreAJourDisplay();

    this._timerInterval = setInterval(() => {
      if (this._enPause) return;

      this._secondesRestantes--;
      this._mettreAJourDisplay();
      this._mettreAJourCercle();

      // Sons d'alerte
      if (this._secondesRestantes === 3
          || this._secondesRestantes === 2
          || this._secondesRestantes === 1) {
        try { timerRepos.jouerSon('bip'); } catch(e) {}
        Utils.vibrer([50]);
      }

      if (this._secondesRestantes <= 0) {
        this._finTimer();
      }
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

    try {
      timerRepos.jouerSon(phase === 'repos' ? 'rest' : 'go');
    } catch(e) {}

    Utils.vibrer([200, 100, 200]);

    if (phase === 'repos') {
      Utils.toast('✅ Repos terminé — Go !', 'success', 2000);
    } else {
      Utils.toast('⏹ Timer terminé !', 'info', 1500);
    }

    // Fermer overlay après 1.5s
    setTimeout(() => this._fermerOverlay(), 1500);
  },

  // ════════════════════════════════════════════════════════
  // OVERLAY TIMER
  // ════════════════════════════════════════════════════════
  _dureeInitiale: 0,

  _afficherOverlay(phase, duree, exoIdx = null, serieIdx = null) {
    this._dureeInitiale = duree;

    // Supprimer overlay existant
    document.getElementById('timer-overlay-full')?.remove();

    const couleur = phase === 'reps'
      ? 'var(--fd-indigo)'
      : 'var(--fd-mint)';
    const label   = phase === 'reps' ? '⚡ EFFORT' : '😴 REPOS';
    const emoji   = phase === 'reps' ? '⚡' : '😴';

    const overlay = document.createElement('div');
    overlay.id    = 'timer-overlay-full';
    overlay.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height, 60px) + 8px);
      left:50%;
      transform:translateX(-50%);
      width:calc(100% - 32px);
      max-width:380px;
      background:var(--bg-card);
      border:2px solid ${couleur};
      border-radius:var(--radius-xl, 20px);
      padding:16px;
      z-index:800;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);
      animation:bounceIn .3s ease;
    `;

    overlay.innerHTML = `
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  margin-bottom:12px">
        <div style="font-size:.75rem;font-weight:800;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:${couleur}">
          ${label}
        </div>
        <button onclick="TimerManager._fermerOverlay()"
                style="background:none;border:none;
                       color:var(--text-muted);font-size:1rem;
                       cursor:pointer;padding:4px">
          ✕
        </button>
      </div>

      <!-- Cercle SVG -->
      <div style="position:relative;width:140px;height:140px;
                  margin:0 auto 12px">
        <svg width="140" height="140"
             style="transform:rotate(-90deg)">
          <circle cx="70" cy="70" r="60"
                  fill="none"
                  stroke="var(--bg-input)"
                  stroke-width="8"/>
          <circle cx="70" cy="70" r="60"
                  fill="none"
                  stroke="${couleur}"
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-dasharray="${2 * Math.PI * 60}"
                  stroke-dashoffset="0"
                  id="timer-circle-arc"
                  style="transition:stroke-dashoffset .9s linear"/>
        </svg>
        <div style="position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    text-align:center">
          <div id="timer-overlay-display"
               style="font-size:2.2rem;font-weight:800;
                      color:${couleur};
                      font-variant-numeric:tabular-nums;
                      line-height:1">
            ${this._formaterTemps(duree)}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted)">
            secondes
          </div>
        </div>
      </div>

      <!-- Contrôles -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:8px">
        <button onclick="TimerManager._togglePause()"
                id="timer-btn-pause"
                style="padding:10px 4px;
                       background:rgba(75,75,249,0.15);
                       border:1px solid var(--fd-indigo);
                       border-radius:var(--radius-full, 99px);
                       color:var(--fd-indigo);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          ⏸ Pause
        </button>
        <button onclick="TimerManager._ajouter(15)"
                style="padding:10px 4px;
                       background:var(--bg-input);
                       border:1px solid var(--border-color);
                       border-radius:var(--radius-full, 99px);
                       color:var(--text-primary);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          +15s
        </button>
        <button onclick="TimerManager._arreterEtFermer()"
                style="padding:10px 4px;
                       background:rgba(255,141,150,0.15);
                       border:1px solid var(--fd-coral);
                       border-radius:var(--radius-full, 99px);
                       color:var(--fd-coral);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          ✕ Stop
        </button>
      </div>

      ${phase === 'repos' ? `
        <!-- Presets repos -->
        <div style="display:flex;gap:6px;margin-top:10px">
          ${[45, 60, 90, 120].map(s => `
            <button onclick="TimerManager._resetAvec(${s})"
                    style="flex:1;padding:6px 2px;
                           font-size:.68rem;font-weight:700;
                           background:${s === duree
                             ? couleur
                             : 'var(--bg-input)'};
                           color:${s === duree
                             ? 'var(--fd-midnight, #09092d)'
                             : 'var(--text-muted)'};
                           border:1px solid ${s === duree
                             ? couleur
                             : 'var(--border-color)'};
                           border-radius:var(--radius-full, 99px);
                           cursor:pointer">
              ${s}s
            </button>`).join('')}
        </div>` : ''}
    `;

    document.body.appendChild(overlay);
  },

  _fermerOverlay() {
    this._arreter();
    const el = document.getElementById('timer-overlay-full');
    if (el) {
      el.style.animation = 'toastOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  _arreterEtFermer() {
    this._fermerOverlay();
  },

  _togglePause() {
    this._enPause = !this._enPause;
    const btn = document.getElementById('timer-btn-pause');
    if (btn) {
      btn.textContent = this._enPause ? '▶ Go' : '⏸ Pause';
      btn.style.borderColor = this._enPause
        ? 'var(--fd-coral)' : 'var(--fd-indigo)';
      btn.style.color = this._enPause
        ? 'var(--fd-coral)' : 'var(--fd-indigo)';
    }
    Utils.vibrer([30]);
  },

  _ajouter(secondes) {
    this._secondesRestantes = Math.min(
      this._secondesRestantes + secondes,
      600
    );
    this._dureeInitiale = Math.max(
      this._dureeInitiale, this._secondesRestantes
    );
    this._mettreAJourDisplay();
    this._mettreAJourCercle();
    Utils.vibrer([30]);
  },

  _resetAvec(secondes) {
    this._arreter();
    this._dureeInitiale = secondes;
    this._demarrer(secondes, this._phase || 'repos');
    // Mettre à jour les boutons preset
    document.querySelectorAll('[onclick^="TimerManager._resetAvec"]')
      .forEach(btn => {
        const val = parseInt(
          btn.getAttribute('onclick').replace(/\D/g,'')
        );
        const couleur = 'var(--fd-mint)';
        btn.style.background = val === secondes ? couleur : 'var(--bg-input)';
        btn.style.color      = val === secondes
          ? 'var(--fd-midnight, #09092d)' : 'var(--text-muted)';
        btn.style.borderColor = val === secondes
          ? couleur : 'var(--border-color)';
      });
  },

  // ════════════════════════════════════════════════════════
  // UPDATE DISPLAY
  // ════════════════════════════════════════════════════════
  _mettreAJourDisplay() {
    const el = document.getElementById('timer-overlay-display');
    if (el) {
      el.textContent = this._formaterTemps(
        Math.max(0, this._secondesRestantes)
      );
    }
  },

  _mettreAJourCercle() {
    const arc = document.getElementById('timer-circle-arc');
    if (!arc) return;

    const total = this._dureeInitiale || 1;
    const pct   = Math.max(0,
      this._secondesRestantes / total
    );
    const circ  = 2 * Math.PI * 60;
    arc.style.strokeDashoffset = circ * (1 - pct);
  },

  _formaterTemps(secondes) {
    const s = Math.max(0, Math.round(secondes));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m > 0) {
      return `${m}:${String(r).padStart(2,'0')}`;
    }
    return String(s);
  },

  // ════════════════════════════════════════════════════════
  // ALARME RAPPEL SPORT
  // ════════════════════════════════════════════════════════
  CLE_ALARME: 'ft_alarme_rappel',

  getAlarme() {
    return Utils.storage.get(this.CLE_ALARME, {
      active: false,
      heure:  '18:00',
      message:'⚡ C\'est l\'heure de t\'entraîner !'
    });
  },

  sauvegarderAlarme(data) {
    Utils.storage.set(this.CLE_ALARME, data);
    if (data.active) {
      this._planifierAlarme(data.heure);
    } else {
      this._annulerAlarme();
    }
  },

  _alarmeInterval: null,

  _planifierAlarme(heure) {
    // Nettoyer l'ancien interval
    this._annulerAlarme();

    this._alarmeInterval = setInterval(() => {
      const now     = new Date();
      const [h, m]  = heure.split(':').map(Number);
      const alarme  = this.getAlarme();

      if (!alarme.active) return;

      if (now.getHours()   === h
          && now.getMinutes() === m
          && now.getSeconds() <= 5) {

        const cleAujourdhui = `ft_alarme_done_${Utils.aujourd_hui()}`;
        if (Utils.storage.get(cleAujourdhui)) return;
        Utils.storage.set(cleAujourdhui, true);

        // Notification
        try {
          if (Notification.permission === 'granted') {
            new Notification('⚡ PowerApp', {
              body:  alarme.message || 'C\'est l\'heure de t\'entraîner !',
              icon:  './assets/icons/icon-192.png',
              badge: './assets/icons/icon-72.png',
              vibrate: [200, 100, 200]
            });
          }
        } catch(e) {}

        // Toast dans l'app
        Utils.toast(
          `⏰ ${alarme.message || 'C\'est l\'heure de t\'entraîner !'}`,
          'success', 8000
        );
        Utils.vibrer([200, 100, 200, 100, 400]);
        try { timerRepos.jouerSon('go'); } catch(e) {}
      }
    }, 5000); // Vérifier toutes les 5 secondes
  },

  _annulerAlarme() {
    if (this._alarmeInterval) {
      clearInterval(this._alarmeInterval);
      this._alarmeInterval = null;
    }
  },

  // ✅ Initialiser l'alarme au démarrage de l'app
  initAlarme() {
    const alarme = this.getAlarme();
    if (alarme.active) {
      this._planifierAlarme(alarme.heure);
    }

    // Demander permission notifications
    try {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // RENDER ALARME — Pour les Settings
  // ════════════════════════════════════════════════════════
  renderAlarme(container) {
    if (!container) return;

    const alarme = this.getAlarme();

    container.innerHTML = `
      <div class="card mb-md"
           style="border-color:${alarme.active
             ? 'var(--fd-lemon)'
             : 'var(--border-color)'}">

        <div class="flex justify-between items-center mb-md">
          <div>
            <div class="card-label" style="margin:0">
              ⏰ Rappel entraînement
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);
                        margin-top:2px">
              Notification quotidienne à heure fixe
            </div>
          </div>

          <!-- Toggle ON/OFF -->
          <label style="position:relative;display:inline-block;
                        width:48px;height:26px;cursor:pointer">
            <input type="checkbox"
                   id="alarme-toggle"
                   ${alarme.active ? 'checked' : ''}
                   onchange="TimerManager._toggleAlarme(this.checked)"
                   style="opacity:0;width:0;height:0" />
            <span style="position:absolute;inset:0;
                         background:${alarme.active
                           ? 'var(--fd-lemon)'
                           : 'var(--bg-input)'};
                         border:2px solid ${alarme.active
                           ? 'var(--fd-lemon)'
                           : 'var(--border-color)'};
                         border-radius:99px;
                         transition:all .3s;cursor:pointer">
              <span style="position:absolute;
                           left:${alarme.active ? '24px' : '2px'};
                           top:50%;transform:translateY(-50%);
                           width:18px;height:18px;
                           background:${alarme.active
                             ? 'var(--fd-midnight, #09092d)'
                             : 'var(--text-muted)'};
                           border-radius:50%;
                           transition:left .3s">
              </span>
            </span>
          </label>
        </div>

        <!-- Heure -->
        <div class="input-label">Heure du rappel</div>
        <input type="time"
               id="alarme-heure"
               class="input mt-sm mb-md"
               value="${alarme.heure}"
               style="font-size:1.2rem;font-weight:700;
                      text-align:center;letter-spacing:.1em;
                      color:var(--fd-lemon)" />

        <!-- Message -->
        <div class="input-label">Message (optionnel)</div>
        <input type="text"
               id="alarme-message"
               class="input mt-sm mb-md"
               value="${alarme.message || ''}"
               placeholder="⚡ C'est l'heure de t'entraîner !" />

        <!-- Bouton sauvegarder -->
        <button onclick="TimerManager._sauvegarderAlarme()"
                class="btn-primary"
                style="width:100%">
          💾 Sauvegarder l'alarme
        </button>

        ${alarme.active ? `
          <div style="margin-top:var(--space-sm);
                      text-align:center;
                      font-size:.75rem;
                      color:var(--fd-lemon)">
            ⏰ Alarme active à ${alarme.heure} chaque jour
          </div>` : ''}
      </div>

      <!-- Info permissions -->
      <div class="card"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div style="font-size:.75rem;color:var(--text-muted);
                    line-height:1.6">
          💡 <strong style="color:var(--fd-indigo)">
            Pour que l'alarme fonctionne :
          </strong><br>
          • Autorise les notifications quand demandé<br>
          • L'app doit être ouverte en arrière-plan<br>
          • Fonctionne même en mode veille sur iOS/Android
        </div>
        <button onclick="TimerManager._testerAlarme()"
                class="btn-secondary mt-md"
                style="width:100%;font-size:.78rem">
          🔔 Tester maintenant
        </button>
      </div>
    `;
  },

  _toggleAlarme(active) {
    const alarme = this.getAlarme();
    alarme.active = active;
    this.sauvegarderAlarme(alarme);

    // Re-render
    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);

    Utils.toast(
      active ? '⏰ Alarme activée !' : '🔕 Alarme désactivée',
      active ? 'success' : 'info',
      2000
    );
  },

  _sauvegarderAlarme() {
    const heure   = document.getElementById('alarme-heure')?.value;
    const message = document.getElementById('alarme-message')?.value?.trim()
      || '⚡ C\'est l\'heure de t\'entraîner !';
    const active  = document.getElementById('alarme-toggle')?.checked || false;

    if (!heure) {
      Utils.toast('Choisis une heure !', 'error');
      return;
    }

    this.sauvegarderAlarme({ active, heure, message });
    Utils.toast(`✅ Alarme sauvegardée à ${heure} !`, 'success');
    Utils.vibrerSuccess();

    // Re-render
    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);
  },

  _testerAlarme() {
    const alarme = this.getAlarme();
    Utils.toast(
      alarme.message || '⚡ C\'est l\'heure de t\'entraîner !',
      'success', 5000
    );
    Utils.vibrer([200, 100, 200, 100, 400]);
    try { timerRepos.jouerSon('go'); } catch(e) {}

    try {
      if (Notification.permission === 'granted') {
        new Notification('⚡ PowerApp — Test', {
          body:  alarme.message || 'C\'est l\'heure de t\'entraîner !',
          icon:  './assets/icons/icon-192.png'
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            Utils.toast('✅ Notifications activées !', 'success');
          }
        });
      }
    } catch(e) {}
  }
};

window.TimerManager = TimerManager;
console.log('✅ TimerManager v1.0 chargé');
