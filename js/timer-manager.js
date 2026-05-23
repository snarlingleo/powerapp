/* ============================================================
   PowerApp — TimerManager v1.1 CORRIGÉ
   Timer reps + Timer repos + Alarme forte répétée
   ============================================================ */

'use strict';

const TimerManager = {

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _timerInterval:     null,
  _secondesRestantes: 0,
  _dureeInitiale:     0,
  _phase:             null,
  _enPause:           false,
  _alarmeInterval:    null,

  CLE_ALARME: 'ft_alarme_rappel',

  // ════════════════════════════════════════════════════════
  // TIMER REPS — Manuel
  // ════════════════════════════════════════════════════════
  lancerTimerReps(exoIdx, serieIdx, poids = null, reps = null, nomExo = null) {
  const duree = 40;
  // ✅ Stocker les infos pour l'overlay
  this._poidsActuel = poids;
  this._repsActuel  = reps;
  this._nomExo      = nomExo;
  this._afficherOverlay('reps', duree, exoIdx, serieIdx);
  this._demarrer(duree, 'reps');
},

  // ════════════════════════════════════════════════════════
  // TIMER REPOS — Auto après validation série
  // ════════════════════════════════════════════════════════
  demarrerRepos(secondes = 75) {
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

      // ✅ Sons d'alerte 3 dernières secondes
      if (this._secondesRestantes <= 3
          && this._secondesRestantes > 0) {
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
       // ✅ Annonce vocale fin de repos
try { SeanceGuidee.annoncerFinRepos(); } catch(e) {}
    } else {
      Utils.toast('⏹ Timer terminé !', 'info', 1500);
    }

    setTimeout(() => this._fermerOverlay(), 1500);
  },

  // ════════════════════════════════════════════════════════
  // OVERLAY TIMER
  // ════════════════════════════════════════════════════════
  _afficherOverlay(phase, duree, exoIdx = null, serieIdx = null) {
    this._dureeInitiale = duree;
    document.getElementById('timer-overlay-full')?.remove();

    const couleur = phase === 'reps'
      ? 'var(--fd-indigo)'
      : 'var(--fd-mint)';
    const label = phase === 'reps' ? '⚡ EFFORT' : '😴 REPOS';
    const circ  = 2 * Math.PI * 60;

    const overlay = document.createElement('div');
    overlay.id    = 'timer-overlay-full';
    overlay.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,60px) + 8px);
      left:50%;
      transform:translateX(-50%);
      width:calc(100% - 32px);
      max-width:380px;
      background:var(--bg-card);
      border:2px solid ${couleur};
      border-radius:20px;
      padding:16px;
      z-index:800;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);
      animation:bounceIn .3s ease;
    `;

    overlay.innerHTML = `
      <!-- Header -->
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
                       cursor:pointer;padding:4px">✕</button>
      </div>
      <!-- Infos exercice -->
      ${(this._nomExo || this._poidsActuel) ? `
        <div style="text-align:center;margin-bottom:10px">
          ${this._nomExo ? `
            <div style="font-size:.82rem;font-weight:700;
                        color:var(--text-primary);margin-bottom:4px">
              ${this._nomExo}
            </div>` : ''}
          ${this._poidsActuel ? `
            <div style="display:inline-flex;align-items:center;
                        gap:8px;padding:8px 20px;
                        background:rgba(75,75,249,0.15);
                        border:1px solid rgba(75,75,249,0.3);
                        border-radius:99px">
              <span style="font-size:1.3rem;font-weight:800;
                           color:var(--fd-indigo)">
                ${this._poidsActuel}kg
              </span>
              <span style="color:var(--text-muted);font-size:.9rem">×</span>
              <span style="font-size:1.3rem;font-weight:800;
                           color:var(--fd-lemon)">
                ${this._repsActuel || '—'}
              </span>
            </div>` : ''}
        </div>` : ''}
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
                  stroke-dasharray="${circ}"
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
                  gap:8px;margin-bottom:10px">
        <button onclick="TimerManager._togglePause()"
                id="timer-btn-pause"
                style="padding:10px 4px;
                       background:rgba(75,75,249,0.15);
                       border:1px solid var(--fd-indigo);
                       border-radius:99px;
                       color:var(--fd-indigo);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          ⏸ Pause
        </button>
        <button onclick="TimerManager._ajouter(15)"
                style="padding:10px 4px;
                       background:var(--bg-input);
                       border:1px solid var(--border-color);
                       border-radius:99px;
                       color:var(--text-primary);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          +15s
        </button>
        <button onclick="TimerManager._arreterEtFermer()"
                style="padding:10px 4px;
                       background:rgba(255,141,150,0.15);
                       border:1px solid var(--fd-coral);
                       border-radius:99px;
                       color:var(--fd-coral);
                       font-size:.75rem;font-weight:700;
                       cursor:pointer">
          ✕ Stop
        </button>
      </div>
      <!-- Modifier charge pendant série -->
      ${phase === 'reps' ? `
        <div style="margin-bottom:10px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.08em;
                      color:var(--text-muted);text-align:center;
                      margin-bottom:6px">
            MODIFIER LA CHARGE
          </div>
          <div style="display:flex;align-items:center;
                      justify-content:center;gap:12px">
            <button onclick="TimerManager._modifierPoids(-2.5)"
                    style="width:60px;height:44px;
                           background:rgba(255,141,150,0.15);
                           border:1px solid var(--fd-coral);
                           border-radius:12px;
                           color:var(--fd-coral);
                           font-size:.85rem;font-weight:700;
                           cursor:pointer">
              -2.5
            </button>
            <div id="timer-poids-display"
                 style="font-size:1.4rem;font-weight:800;
                        color:var(--fd-indigo);
                        min-width:80px;text-align:center">
              ${this._poidsActuel ? `${this._poidsActuel}kg` : '—kg'}
            </div>
            <button onclick="TimerManager._modifierPoids(2.5)"
                    style="width:60px;height:44px;
                           background:rgba(139,240,187,0.1);
                           border:1px solid var(--fd-mint);
                           border-radius:12px;
                           color:var(--fd-mint);
                           font-size:.85rem;font-weight:700;
                           cursor:pointer">
              +2.5
            </button>
          </div>
        </div>` : ''}

      ${phase === 'repos' ? `
              <!-- Presets repos -->
        <div style="display:flex;gap:6px">
          ${[45, 60, 90, 120].map(s => `
            <button onclick="TimerManager._resetAvec(${s})"
                    data-preset="${s}"
                    style="flex:1;padding:6px 2px;
                           font-size:.68rem;font-weight:700;
                           background:${s === duree
                             ? couleur : 'var(--bg-input)'};
                           color:${s === duree
                             ? '#09092d' : 'var(--text-muted)'};
                           border:1px solid ${s === duree
                             ? couleur : 'var(--border-color)'};
                           border-radius:99px;cursor:pointer">
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
      btn.textContent   = this._enPause ? '▶ Go'    : '⏸ Pause';
      btn.style.color   = this._enPause
        ? 'var(--fd-coral)'   : 'var(--fd-indigo)';
      btn.style.borderColor = this._enPause
        ? 'var(--fd-coral)'   : 'var(--fd-indigo)';
    }
    Utils.vibrer([30]);
  },

  _ajouter(secondes) {
    this._secondesRestantes = Math.min(
      this._secondesRestantes + secondes, 600
    );
    this._dureeInitiale = Math.max(
      this._dureeInitiale, this._secondesRestantes
    );
    this._mettreAJourDisplay();
    this._mettreAJourCercle();
    Utils.vibrer([30]);
  },

   _modifierPoids(delta) {
  if (this._poidsActuel === null) {
    this._poidsActuel = 0;
  }
  this._poidsActuel = Math.max(0,
    Math.round((this._poidsActuel + delta) * 10) / 10
  );

  // ✅ Mettre à jour l'affichage
  const el = document.getElementById('timer-poids-display');
  if (el) el.textContent = `${this._poidsActuel}kg`;

  // ✅ Sauvegarder pour récupérer après validation
  window._timerPoidsModifie = this._poidsActuel;

  Utils.vibrer([30]);
  Utils.toast(
    `Charge : ${this._poidsActuel}kg`, 'info', 800
  );
},

  _resetAvec(secondes) {
    this._arreter();
    this._dureeInitiale = secondes;

    // ✅ Mettre à jour visuellement les presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      const val     = parseInt(btn.dataset.preset);
      const couleur = 'var(--fd-mint)';
      const actif   = val === secondes;
      btn.style.background  = actif ? couleur    : 'var(--bg-input)';
      btn.style.color       = actif ? '#09092d'  : 'var(--text-muted)';
      btn.style.borderColor = actif ? couleur    : 'var(--border-color)';
    });

    this._demarrer(secondes, this._phase || 'repos');
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
    const total  = this._dureeInitiale || 1;
    const pct    = Math.max(0, this._secondesRestantes / total);
    const circ   = 2 * Math.PI * 60;
    arc.style.strokeDashoffset = circ * (1 - pct);
  },

  _formaterTemps(secondes) {
    const s = Math.max(0, Math.round(secondes));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m > 0) return `${m}:${String(r).padStart(2, '0')}`;
    return String(s);
  },

  // ════════════════════════════════════════════════════════
  // ALARME RAPPEL SPORT
  // ════════════════════════════════════════════════════════
  getAlarme() {
    return Utils.storage.get(this.CLE_ALARME, {
      active:      false,
      heure:       '18:00',
      message:     '⚡ C\'est l\'heure de t\'entraîner !',
      repetitions: 3
    });
  },

  sauvegarderAlarme(data) {
    Utils.storage.set(this.CLE_ALARME, data);

    // ✅ Envoyer au Service Worker pour alarme téléphone verrouillé
    try {
      if ('serviceWorker' in navigator
          && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(
          data.active
            ? {
                type:    'PLANIFIER_ALARME',
                payload: {
                  heure:       data.heure,
                  message:     data.message,
                  repetitions: data.repetitions || 3
                }
              }
            : { type: 'ANNULER_ALARME' }
        );
      }
    } catch(e) {}

    // Aussi planifier en JS pour quand l'app est ouverte
    if (data.active) {
      this._planifierAlarme(data.heure);
    } else {
      this._annulerAlarme();
    }
  },

  // ════════════════════════════════════════════════════════
  // PLANIFICATION — vérifie toutes les 5s
  // ════════════════════════════════════════════════════════
  _planifierAlarme(heure) {
    this._annulerAlarme();

    this._alarmeInterval = setInterval(() => {
      const now    = new Date();
      const [h, m] = heure.split(':').map(Number);
      const alarme = this.getAlarme();
      if (!alarme.active) return;

      if (now.getHours()   === h
          && now.getMinutes() === m
          && now.getSeconds() <= 10) {

        const cle = `ft_alarme_done_${Utils.aujourd_hui()}`;
        if (Utils.storage.get(cle)) return;
        Utils.storage.set(cle, true);

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

  // ════════════════════════════════════════════════════════
  // DÉCLENCHEMENT — Fort + Répété
  // ════════════════════════════════════════════════════════
  _declencherAlarme(alarme) {
    const msg         = alarme.message
      || '⚡ C\'est l\'heure de t\'entraîner !';
    const repetitions = alarme.repetitions || 3;

    // ✅ Répéter toutes les 2 minutes
    Array.from({ length: repetitions }, (_, i) => i * 120000)
      .forEach(delai => {
        setTimeout(() => {
          const check = this.getAlarme();
          if (!check.active) return;

          // ✅ Notification persistante avec requireInteraction
          try {
            if (Notification.permission === 'granted') {
              new Notification('⚡ PowerApp — Go t\'entraîner !', {
                body:               msg,
                icon:               './assets/icons/icon-192.png',
                badge:              './assets/icons/icon-72.png',
                // ✅ Vibrations longues et répétées
                vibrate: [
                  500, 200, 500, 200, 500,
                  500, 200, 500, 200, 500,
                  500, 200, 500
                ],
                requireInteraction: true,  // ✅ Reste affichée
                renotify:           true,
                tag:                'powerapp-alarme',
                silent:             false
              });
            }
          } catch(e) {}

          // ✅ Toast persistant dans l'app
          Utils.toast(`⏰ ${msg}`, 'success', 15000);

          // ✅ Vibrations longues
          Utils.vibrer([
            500, 200, 500, 200, 500,
            200, 500, 200, 500, 200, 500
          ]);

          // ✅ Son fort répété 3×
          this._jouerSonAlarme();

        }, delai);
      });
  },

  // ✅ Son alarme — 3 bips forts successifs
  _jouerSonAlarme() {
    [0, 800, 1600].forEach(delai => {
      setTimeout(() => {
        try {
          const ctx  = new (window.AudioContext
            || window.webkitAudioContext)();
          const osc  = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          // ✅ Son perçant type alarme
          osc.type = 'square';
          osc.frequency.setValueAtTime(880,  ctx.currentTime);
          osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
          osc.frequency.setValueAtTime(880,  ctx.currentTime + 0.30);

          gain.gain.setValueAtTime(1.0, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(
            0.001, ctx.currentTime + 0.6
          );

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.6);
        } catch(e) {}
      }, delai);
    });
  },

  // ════════════════════════════════════════════════════════
  // INIT — Au démarrage de l'app
  // ════════════════════════════════════════════════════════
  initAlarme() {
    const alarme = this.getAlarme();

    if (alarme.active) {
      this._planifierAlarme(alarme.heure);

      // ✅ Aussi envoyer au SW
      try {
        navigator.serviceWorker?.ready.then(reg => {
          reg.active?.postMessage({
            type:    'PLANIFIER_ALARME',
            payload: {
              heure:       alarme.heure,
              message:     alarme.message,
              repetitions: alarme.repetitions || 3
            }
          });
        });
      } catch(e) {}
    }

    // Permission notifications
    try {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // RENDER ALARME — Settings
  // ════════════════════════════════════════════════════════
  renderAlarme(container) {
    if (!container) return;

    const alarme = this.getAlarme();

    container.innerHTML = `
      <div class="card mb-md"
           style="border-color:${alarme.active
             ? 'var(--fd-lemon)' : 'var(--border-color)'}">

        <!-- Header toggle -->
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

          <!-- ✅ Toggle inline — pas de dépendance CSS -->
          <div onclick="TimerManager._toggleAlarme(${!alarme.active})"
               style="position:relative;width:48px;height:26px;
                      cursor:pointer;flex-shrink:0">
            <div style="position:absolute;inset:0;
                        background:${alarme.active
                          ? 'var(--fd-lemon)' : 'rgba(255,255,255,0.1)'};
                        border:2px solid ${alarme.active
                          ? 'var(--fd-lemon)' : 'rgba(255,255,255,0.2)'};
                        border-radius:99px;transition:all .25s">
            </div>
            <div style="position:absolute;
                        top:50%;
                        left:${alarme.active ? '24px' : '2px'};
                        transform:translateY(-50%);
                        width:18px;height:18px;
                        background:${alarme.active
                          ? '#09092d' : 'rgba(255,255,255,0.4)'};
                        border-radius:50%;
                        transition:left .25s;
                        pointer-events:none">
            </div>
          </div>
        </div>

        <!-- Heure -->
        <div class="input-label">⏰ Heure du rappel</div>
        <input type="time"
               id="alarme-heure"
               class="input mt-sm mb-md"
               value="${alarme.heure}"
               style="font-size:1.2rem;font-weight:700;
                      text-align:center;letter-spacing:.1em;
                      color:var(--fd-lemon)" />

        <!-- Message -->
        <div class="input-label">💬 Message</div>
        <input type="text"
               id="alarme-message"
               class="input mt-sm mb-md"
               value="${alarme.message || ''}"
               placeholder="⚡ C'est l'heure de t'entraîner !" />

        <!-- ✅ Répétitions -->
        <div class="input-label">🔁 Répéter l'alarme</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:6px;margin-top:8px;margin-bottom:var(--space-md)">
          ${[1, 3, 5].map(r => `
            <button onclick="TimerManager._setRepetitions(${r})"
                    style="padding:8px 4px;
                           font-size:.72rem;font-weight:700;
                           background:${(alarme.repetitions||3) === r
                             ? 'var(--fd-lemon)' : 'var(--bg-input)'};
                           color:${(alarme.repetitions||3) === r
                             ? '#09092d' : 'var(--text-muted)'};
                           border:1px solid ${(alarme.repetitions||3) === r
                             ? 'var(--fd-lemon)' : 'var(--border-color)'};
                           border-radius:99px;cursor:pointer">
              ${r === 1 ? '1× seulement' : r === 3 ? '3× (recommandé)' : '5× (max)'}
            </button>`).join('')}
        </div>

        <!-- Sauvegarder -->
        <button onclick="TimerManager._sauvegarderAlarme()"
                class="btn-primary"
                style="width:100%">
          💾 Sauvegarder
        </button>

        ${alarme.active ? `
          <div style="margin-top:var(--space-sm);text-align:center;
                      font-size:.75rem;color:var(--fd-lemon)">
            ⏰ Alarme active à ${alarme.heure}
            · ${alarme.repetitions||3}× toutes les 2 min
          </div>` : ''}
      </div>

      <!-- Info + Test -->
      <div class="card"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div style="font-size:.75rem;color:var(--text-muted);
                    line-height:1.6">
          💡 <strong style="color:var(--fd-indigo)">
            Pour maximiser l'alarme :
          </strong><br>
          • Active les notifications dans les réglages<br>
          • Garde l'app ouverte en arrière-plan<br>
          • Son fort + vibrations longues + notification persistante<br>
          • Se répète toutes les 2 minutes
        </div>
        <button onclick="TimerManager._testerAlarme()"
                class="btn-secondary mt-md"
                style="width:100%;font-size:.78rem">
          🔔 Tester l'alarme maintenant
        </button>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS UI
  // ════════════════════════════════════════════════════════
  _toggleAlarme(active) {
    const alarme  = this.getAlarme();
    alarme.active = active;
    this.sauvegarderAlarme(alarme);

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
    const message = document.getElementById('alarme-message')
      ?.value?.trim() || '⚡ C\'est l\'heure de t\'entraîner !';
    const active  = document.getElementById('alarme-toggle')
      ?.checked ?? this.getAlarme().active;
    const alarme  = this.getAlarme();

    if (!heure) {
      Utils.toast('Choisis une heure !', 'error');
      return;
    }

    this.sauvegarderAlarme({
      ...alarme,
      active, heure, message
    });

    Utils.toast(`✅ Alarme sauvegardée à ${heure} !`, 'success');
    Utils.vibrerSuccess();

    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);
  },

  _setRepetitions(n) {
    const alarme       = this.getAlarme();
    alarme.repetitions = n;
    Utils.storage.set(this.CLE_ALARME, alarme);

    const el = document.getElementById('alarme-section');
    if (el) this.renderAlarme(el);

    Utils.toast(
      `🔁 Alarme répétée ${n} fois (toutes les 2 min)`,
      'success', 2000
    );
  },

  // ✅ Test avec le vrai système d'alarme fort
  _testerAlarme() {
    const alarme = this.getAlarme();
    this._declencherAlarme({
      ...alarme,
      repetitions: 1  // 1 seule fois pour le test
    });
    Utils.toast('🔔 Test alarme lancé !', 'info', 2000);

    // Demander permission si pas encore accordée
    try {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            Utils.toast('✅ Notifications activées !', 'success');
          } else {
            Utils.toast(
              '⚠️ Active les notifications dans les réglages !',
              'warning', 5000
            );
          }
        });
      }
    } catch(e) {}
  }
};

window.TimerManager = TimerManager;
console.log('✅ TimerManager v1.1 chargé');
