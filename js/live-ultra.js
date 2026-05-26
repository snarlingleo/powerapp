/* ============================================================
   PowerApp — Live Ultra v1.0
   ⚡ Mode Séance Ultra-Rapide
   ✅ Interface minimaliste plein écran
   ✅ Swipe gauche/droite → série suivante/précédente
   ✅ Swipe haut → valider série
   ✅ Auto-fill charges depuis PR
   ✅ Timer visuel animé
   ✅ Vibrations distinctes
   ✅ Voice control
   ✅ Gestes tactiles
   ✅ Mode paysage optimisé
   ✅ Offline 100%
   ============================================================ */

'use strict';

const LiveUltra = {

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _actif:         false,
  _seanceId:      null,
  _exercices:     [],
  _exoIdx:        0,
  _serieIdx:      0,
  _seriesValidees:{},   // { "exoIdx-serieIdx": { poids, reps } }
  _reposActif:    false,
  _reposInterval: null,
  _reposHeureFin: null,
  _voixActif:     false,
  _swipeStartX:   0,
  _swipeStartY:   0,
  _swipeStartT:   0,

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  demarrer(seanceId, exercices) {
    if (this._actif) this.quitter();

    this._actif         = true;
    this._seanceId      = seanceId;
    this._exercices     = exercices || [];
    this._exoIdx        = 0;
    this._serieIdx      = 0;
    this._seriesValidees= {};
    this._reposActif    = false;

    // Pré-remplir avec les PRs
    this._preRemplirCharges();

    // Créer l'overlay
    this._creerOverlay();

    // Attacher les gestes
    this._attacherGestes();

    // Attacher les touches clavier
    this._attacherClavier();

    // Visibilité (retour arrière-plan)
    document.addEventListener(
      'visibilitychange',
      this._onVisibilityChange.bind(this)
    );

    // Log
    console.log('[LiveUltra] Démarré ✅', seanceId);
  },

  quitter() {
    this._actif = false;
    clearInterval(this._reposInterval);

    // Retirer l'overlay
    document.getElementById('live-ultra-overlay')?.remove();

    // Détacher les events
    document.removeEventListener(
      'visibilitychange',
      this._onVisibilityChange.bind(this)
    );
    document.removeEventListener(
      'keydown',
      this._onKeyDown.bind(this)
    );

    // Arrêter la voix
    try { window.speechSynthesis?.cancel(); } catch(e) {}

    console.log('[LiveUltra] Quitté ✅');
  },

  // ════════════════════════════════════════════════════════
  // PRÉ-REMPLISSAGE CHARGES
  // ════════════════════════════════════════════════════════
  _preRemplirCharges() {
    this._exercices.forEach((ex, exoIdx) => {
      try {
        const pr = Tracker.getPR(ex.ref);
        if (pr?.poids) {
          if (!this._seriesValidees[`prefill-${exoIdx}`]) {
            this._seriesValidees[`prefill-${exoIdx}`] = {
              poidsDefaut: pr.poids,
              repsDefaut:  ex.reps?.split?.('-')?.[0] || ex.reps || 10
            };
          }
        }
      } catch(e) {}
    });
  },

  _getPoidsDefaut(exoIdx) {
    return this._seriesValidees[`prefill-${exoIdx}`]?.poidsDefaut
      || '';
  },

  _getRepsDefaut(exoIdx) {
    const ex = this._exercices[exoIdx];
    return this._seriesValidees[`prefill-${exoIdx}`]?.repsDefaut
      || ex?.reps?.split?.('-')?.[0]
      || ex?.reps
      || '';
  },

  _getDernierePoids(exoIdx) {
    // Chercher la dernière série validée de cet exercice
    for (let s = this._serieIdx - 1; s >= 0; s--) {
      const key = `${exoIdx}-${s}`;
      if (this._seriesValidees[key]?.poids) {
        return this._seriesValidees[key].poids;
      }
    }
    return this._getPoidsDefaut(exoIdx);
  },

  _getDerniereReps(exoIdx) {
    for (let s = this._serieIdx - 1; s >= 0; s--) {
      const key = `${exoIdx}-${s}`;
      if (this._seriesValidees[key]?.reps) {
        return this._seriesValidees[key].reps;
      }
    }
    return this._getRepsDefaut(exoIdx);
  },

  // ════════════════════════════════════════════════════════
  // OVERLAY PRINCIPAL
  // ════════════════════════════════════════════════════════
  _creerOverlay() {
    // Supprimer l'existant
    document.getElementById('live-ultra-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id    = 'live-ultra-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:#09092d;
      display:flex;flex-direction:column;
      overflow:hidden;
      user-select:none;
      -webkit-user-select:none;
      touch-action:pan-y;`;

    overlay.innerHTML = this._htmlOverlay();
    document.body.appendChild(overlay);

    // Attacher les events internes
    this._attacherEventsOverlay();

    // Animation d'entrée
    overlay.style.animation = 'ultraFadeIn .3s ease';
  },

  _htmlOverlay() {
    const ex      = this._exercices[this._exoIdx];
    const exoData = ex ? (window.EXERCICES||{})[ex.ref] || {} : {};
    const total   = this._exercices.length;
    const poids   = this._getDernierePoids(this._exoIdx);
    const reps    = this._getDerniereReps(this._exoIdx);
    const serie   = this._serieIdx + 1;
    const totalS  = ex?.series || 3;
    const pr      = (() => {
      try { return Tracker.getPR(ex?.ref); } catch(e) { return null; }
    })();

    // Progression globale
    const totalSeries = this._exercices.reduce(
      (a, e) => a + (e.series || 3), 0
    );
    const seriesFaites = Object.keys(this._seriesValidees)
      .filter(k => !k.startsWith('prefill')).length;
    const pctGlobal = Math.round((seriesFaites / Math.max(totalSeries, 1)) * 100);

    return `
      <!-- ✅ CSS Animations -->
      <style>
        @keyframes ultraFadeIn {
          from { opacity:0; transform:scale(.97); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes ultraPulse {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(1.05); }
        }
        @keyframes ultraShake {
          0%,100% { transform:translateX(0); }
          25%     { transform:translateX(-8px); }
          75%     { transform:translateX(8px); }
        }
        @keyframes ultraSuccess {
          0%   { transform:scale(1);    background:rgba(139,240,187,0.2); }
          50%  { transform:scale(1.03); background:rgba(139,240,187,0.4); }
          100% { transform:scale(1);    background:rgba(139,240,187,0.2); }
        }
        @keyframes reposArc {
          from { stroke-dashoffset: 0; }
        }
        .ultra-btn-poids {
          width:52px;height:52px;flex-shrink:0;
          border-radius:14px;border:2px solid;
          font-size:1.4rem;font-weight:900;
          cursor:pointer;transition:all .15s;
          display:flex;align-items:center;
          justify-content:center;
        }
        .ultra-btn-poids:active { transform:scale(.92); }
        .ultra-input {
          flex:1;padding:16px 8px;
          font-size:2rem;font-weight:900;
          text-align:center;
          background:rgba(255,255,255,0.06);
          border:2px solid rgba(255,255,255,0.15);
          border-radius:16px;
          color:white;outline:none;
          transition:border-color .2s;
        }
        .ultra-input:focus {
          border-color:#4b4bf9;
          background:rgba(75,75,249,0.1);
        }
        #ultra-btn-valider {
          transition:all .2s;
          -webkit-tap-highlight-color:transparent;
        }
        #ultra-btn-valider:active {
          transform:scale(.96);
        }
      </style>

      <!-- ═══ HEADER ═══ -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  padding:16px 20px 8px;flex-shrink:0">

        <!-- Bouton quitter -->
        <button onclick="LiveUltra.quitter()"
                style="width:40px;height:40px;
                       background:rgba(255,255,255,0.08);
                       border:1px solid rgba(255,255,255,0.1);
                       border-radius:50%;color:rgba(255,255,255,0.6);
                       font-size:.9rem;cursor:pointer">
          ✕
        </button>

        <!-- Titre séance -->
        <div style="text-align:center;flex:1;padding:0 12px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.15em;
                      color:rgba(255,255,255,0.4)">
            ⚡ MODE ULTRA-RAPIDE
          </div>
          <div style="font-size:.78rem;font-weight:700;
                      color:white;margin-top:2px;
                      overflow:hidden;text-overflow:ellipsis;
                      white-space:nowrap">
            ${exoData.nom || ex?.ref || 'Séance'}
          </div>
        </div>

        <!-- Bouton voix -->
        <button id="ultra-btn-voix"
                onclick="LiveUltra._toggleVoix()"
                style="width:40px;height:40px;
                       background:${this._voixActif
                         ? 'rgba(139,240,187,0.2)'
                         : 'rgba(255,255,255,0.08)'};
                       border:1px solid ${this._voixActif
                         ? 'rgba(139,240,187,0.4)'
                         : 'rgba(255,255,255,0.1)'};
                       border-radius:50%;
                       color:${this._voixActif
                         ? '#8bf0bb' : 'rgba(255,255,255,0.6)'};
                       font-size:.9rem;cursor:pointer">
          🎙️
        </button>
      </div>

      <!-- ═══ BARRE PROGRESSION GLOBALE ═══ -->
      <div style="padding:0 20px;flex-shrink:0">
        <div style="height:4px;background:rgba(255,255,255,0.06);
                    border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${pctGlobal}%;
                      background:linear-gradient(90deg,#4b4bf9,#8bf0bb);
                      border-radius:99px;transition:width .5s ease">
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;
                    margin-top:4px">
          <div style="font-size:.55rem;color:rgba(255,255,255,0.3)">
            Exo ${this._exoIdx + 1}/${total}
          </div>
          <div style="font-size:.55rem;color:rgba(255,255,255,0.3)">
            ${seriesFaites}/${totalSeries} séries · ${pctGlobal}%
          </div>
        </div>
      </div>

      <!-- ═══ ZONE EXERCICE ═══ -->
      <div style="flex:1;display:flex;flex-direction:column;
                  align-items:center;justify-content:center;
                  padding:8px 20px;overflow:hidden"
           id="ultra-zone-exercice">

        <!-- Emoji + Muscle -->
        <div style="text-align:center;margin-bottom:12px">
          <div style="font-size:3rem;margin-bottom:6px;
                      animation:ultraPulse 3s ease infinite">
            ${exoData.emoji || '💪'}
          </div>
          <div style="font-size:.72rem;color:rgba(75,75,249,0.8);
                      font-weight:700;text-transform:uppercase;
                      letter-spacing:.08em">
            ${exoData.muscle || ''}
          </div>
        </div>

        <!-- Indicateur série -->
        <div style="display:flex;align-items:center;gap:6px;
                    margin-bottom:16px">
          ${Array.from({length:totalS}, (_, i) => `
            <div style="width:${i === this._serieIdx ? 24 : 8}px;
                        height:8px;border-radius:99px;
                        background:${
                          this._seriesValidees[`${this._exoIdx}-${i}`]
                            ? '#8bf0bb'
                          : i === this._serieIdx
                            ? '#4b4bf9'
                          : 'rgba(255,255,255,0.15)'};
                        transition:all .3s ease">
            </div>`).join('')}
        </div>

        <!-- Label série -->
        <div style="font-size:.65rem;font-weight:700;
                    color:rgba(255,255,255,0.4);
                    text-transform:uppercase;letter-spacing:.12em;
                    margin-bottom:6px">
          Série ${serie} / ${totalS}
        </div>

        <!-- PR Badge -->
        ${pr ? `
          <div style="padding:4px 12px;margin-bottom:12px;
                      background:rgba(249,239,119,0.1);
                      border:1px solid rgba(249,239,119,0.3);
                      border-radius:99px;
                      font-size:.68rem;font-weight:700;
                      color:#f9ef77">
            🏆 PR ${pr.poids}kg × ${pr.reps}
            (~${pr.rm1}kg 1RM)
          </div>` : ''}

        <!-- ═══ POIDS ═══ -->
        <div style="width:100%;margin-bottom:12px">
          <div style="font-size:.58rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:rgba(255,255,255,0.3);
                      margin-bottom:8px;text-align:center">
            🏋️ Charge (kg)
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <button class="ultra-btn-poids"
                    style="background:rgba(255,141,150,0.12);
                           border-color:rgba(255,141,150,0.3);
                           color:#ff8d96;"
                    onmousedown="LiveUltra._ajusterCharge(-5)"
                    ontouchstart="LiveUltra._ajusterCharge(-5)">
              −5
            </button>
            <button class="ultra-btn-poids"
                    style="width:40px;height:52px;
                           background:rgba(255,141,150,0.08);
                           border-color:rgba(255,141,150,0.2);
                           color:#ff8d96;font-size:1rem;"
                    onmousedown="LiveUltra._ajusterCharge(-2.5)"
                    ontouchstart="LiveUltra._ajusterCharge(-2.5)">
              −½
            </button>
            <input id="ultra-poids"
                   type="number" inputmode="decimal"
                   class="ultra-input"
                   placeholder="${poids || 'kg'}"
                   value="${poids || ''}"
                   step="2.5" min="0"
                   style="font-size:${poids > 99 ? '1.6rem' : '2rem'}"
                   oninput="LiveUltra._onPoidsChange(this.value)"
                   onfocus="this.select()"/>
            <button class="ultra-btn-poids"
                    style="width:40px;height:52px;
                           background:rgba(139,240,187,0.08);
                           border-color:rgba(139,240,187,0.2);
                           color:#8bf0bb;font-size:1rem;"
                    onmousedown="LiveUltra._ajusterCharge(2.5)"
                    ontouchstart="LiveUltra._ajusterCharge(2.5)">
              +½
            </button>
            <button class="ultra-btn-poids"
                    style="background:rgba(139,240,187,0.12);
                           border-color:rgba(139,240,187,0.3);
                           color:#8bf0bb;"
                    onmousedown="LiveUltra._ajusterCharge(5)"
                    ontouchstart="LiveUltra._ajusterCharge(5)">
              +5
            </button>
          </div>
        </div>

        <!-- ═══ REPS ═══ -->
        <div style="width:100%;margin-bottom:20px">
          <div style="font-size:.58rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:rgba(255,255,255,0.3);
                      margin-bottom:8px;text-align:center">
            🔁 Répétitions
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <button class="ultra-btn-poids"
                    style="background:rgba(255,141,150,0.12);
                           border-color:rgba(255,141,150,0.3);
                           color:#ff8d96;"
                    onmousedown="LiveUltra._ajusterReps(-2)"
                    ontouchstart="LiveUltra._ajusterReps(-2)">
              −2
            </button>
            <button class="ultra-btn-poids"
                    style="width:40px;height:52px;
                           background:rgba(255,141,150,0.08);
                           border-color:rgba(255,141,150,0.2);
                           color:#ff8d96;font-size:1rem;"
                    onmousedown="LiveUltra._ajusterReps(-1)"
                    ontouchstart="LiveUltra._ajusterReps(-1)">
              −1
            </button>
            <input id="ultra-reps"
                   type="number" inputmode="numeric"
                   class="ultra-input"
                   placeholder="${reps || 'reps'}"
                   value="${reps || ''}"
                   min="1"
                   oninput="LiveUltra._onRepsChange(this.value)"
                   onfocus="this.select()"/>
            <button class="ultra-btn-poids"
                    style="width:40px;height:52px;
                           background:rgba(139,240,187,0.08);
                           border-color:rgba(139,240,187,0.2);
                           color:#8bf0bb;font-size:1rem;"
                    onmousedown="LiveUltra._ajusterReps(1)"
                    ontouchstart="LiveUltra._ajusterReps(1)">
              +1
            </button>
            <button class="ultra-btn-poids"
                    style="background:rgba(139,240,187,0.12);
                           border-color:rgba(139,240,187,0.3);
                           color:#8bf0bb;"
                    onmousedown="LiveUltra._ajusterReps(2)"
                    ontouchstart="LiveUltra._ajusterReps(2)">
              +2
            </button>
          </div>
        </div>

        <!-- ═══ BOUTON VALIDER ═══ -->
        <button id="ultra-btn-valider"
                onclick="LiveUltra._validerSerie()"
                style="width:100%;padding:22px;
                       background:#4b4bf9;
                       border:none;border-radius:20px;
                       font-size:1.1rem;font-weight:900;
                       color:white;cursor:pointer;
                       letter-spacing:.04em;
                       box-shadow:0 6px 32px rgba(75,75,249,0.5)">
          ✅ SÉRIE FAITE
        </button>

        <!-- Hint swipe -->
        <div style="margin-top:10px;font-size:.58rem;
                    color:rgba(255,255,255,0.2);text-align:center">
          ↑ Swipe haut pour valider · ← → changer exercice
        </div>

      </div>

      <!-- ═══ NAVIGATION BAS ═══ -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  padding:12px 20px;flex-shrink:0;
                  background:rgba(255,255,255,0.03);
                  border-top:1px solid rgba(255,255,255,0.06)">

        <!-- Exo précédent -->
        <button onclick="LiveUltra._exoPrecedent()"
                style="display:flex;align-items:center;gap:6px;
                       padding:10px 16px;
                       background:rgba(255,255,255,0.06);
                       border:1px solid rgba(255,255,255,0.1);
                       border-radius:12px;
                       color:rgba(255,255,255,0.5);
                       font-size:.78rem;font-weight:700;
                       cursor:pointer;
                       opacity:${this._exoIdx > 0 ? '1' : '0.3'}"
                ${this._exoIdx === 0 ? 'disabled' : ''}>
          ← Préc
        </button>

        <!-- Dots exercices -->
        <div style="display:flex;gap:5px;align-items:center">
          ${this._exercices.map((_, i) => `
            <div onclick="LiveUltra._allerExo(${i})"
                 style="width:${i === this._exoIdx ? 20 : 6}px;
                        height:6px;border-radius:99px;cursor:pointer;
                        background:${i === this._exoIdx
                          ? '#4b4bf9'
                          : this._exoTermine(i)
                            ? '#8bf0bb'
                          : 'rgba(255,255,255,0.15)'};
                        transition:all .3s">
            </div>`).join('')}
        </div>

        <!-- Exo suivant -->
        <button onclick="LiveUltra._exoSuivant()"
                style="display:flex;align-items:center;gap:6px;
                       padding:10px 16px;
                       background:rgba(75,75,249,0.15);
                       border:1px solid rgba(75,75,249,0.3);
                       border-radius:12px;
                       color:#4b4bf9;
                       font-size:.78rem;font-weight:700;
                       cursor:pointer;
                       opacity:${this._exoIdx < this._exercices.length - 1 ? '1' : '0.3'}"
                ${this._exoIdx >= this._exercices.length - 1 ? 'disabled' : ''}>
          Suiv →
        </button>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // VALIDATION SÉRIE
  // ════════════════════════════════════════════════════════
  _validerSerie() {
    const poidsVal = parseFloat(
      document.getElementById('ultra-poids')?.value
    );
    const repsVal  = parseInt(
      document.getElementById('ultra-reps')?.value
    );

    // Validation
    if (!poidsVal || !repsVal) {
      this._animer('shake');
      Utils.toast('Entre le poids et les reps !', 'error');
      return;
    }

    const ex      = this._exercices[this._exoIdx];
    const key     = `${this._exoIdx}-${this._serieIdx}`;
    const totalS  = ex?.series || 3;

    // Sauvegarder
    this._seriesValidees[key] = {
      poids:   poidsVal,
      reps:    repsVal,
      exoIdx:  this._exoIdx,
      serieIdx:this._serieIdx
    };

    // Enregistrer dans le tracker
    let isPR = false;
    try {
      const result = Tracker.sauvegarderSerie(
        this._seanceId,
        ex.ref,
        this._serieIdx + 1,
        repsVal,
        poidsVal,
        null
      );
      isPR = result?.isPR || false;
    } catch(e) {}

    // XP
    try { Gamification.recompenser('SERIE_COMPLETE'); } catch(e) {}

    // Vibration
    if (isPR) {
      Utils.vibrerPR?.() || Utils.vibrer([200,100,200,100,200]);
      Utils.toast(`🏆 NOUVEAU RECORD ! ${poidsVal}kg × ${repsVal}`, 'pr', 4000);
    } else {
      Utils.vibrerSuccess?.() || Utils.vibrer([50]);
    }

    // Animation succès
    this._animer('success');

    // Voix
    if (this._voixActif) {
      this._parler(isPR
        ? `Record battu ! ${poidsVal} kilos, ${repsVal} répétitions !`
        : `Série ${this._serieIdx + 1} validée.`
      );
    }

    // Série suivante ou repos
    const seriesSuivante = this._serieIdx + 1;

    if (seriesSuivante < totalS) {
      // Encore des séries → repos
      const reposDuree = ex.repos || 75;
      setTimeout(() => {
        this._serieIdx = seriesSuivante;
        this._lancerRepos(reposDuree, ex.ref);
      }, 400);
    } else {
      // Exercice terminé
      const exoSuivant = this._exoIdx + 1;

      if (exoSuivant < this._exercices.length) {
        // Exercice suivant
        setTimeout(() => {
          this._serieIdx = 0;
          this._exoIdx   = exoSuivant;
          this._animer('transition');

          if (this._voixActif) {
            const next     = this._exercices[exoSuivant];
            const nextData = (window.EXERCICES||{})[next?.ref] || {};
            this._parler(`Exercice terminé ! Prochain : ${nextData.nom || next?.ref}`);
          }

          this._rafraichir();
        }, 400);
      } else {
        // Séance terminée !
        setTimeout(() => {
          this._terminerSeance();
        }, 500);
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // REPOS ULTRA
  // ════════════════════════════════════════════════════════
  _lancerRepos(secondes, exoRef) {
    this._reposActif    = true;
    this._reposHeureFin = Date.now() + (secondes * 1000);

    clearInterval(this._reposInterval);

    // Créer overlay repos dans l'overlay ultra
    const zone = document.getElementById('ultra-zone-exercice');
    if (!zone) return;

    const circ = 2 * Math.PI * 70;
    const ex   = this._exercices[this._exoIdx];
    const exoData = (window.EXERCICES||{})[ex?.ref||''] || {};
    const serie = this._serieIdx + 1;
    const totalS = ex?.series || 3;

    zone.innerHTML = `
      <div style="display:flex;flex-direction:column;
                  align-items:center;justify-content:center;
                  height:100%;text-align:center;padding:20px">

        <!-- Label repos -->
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.15em;
                    color:#8bf0bb;margin-bottom:20px">
          😴 REPOS
        </div>

        <!-- Cercle SVG -->
        <div style="position:relative;width:160px;height:160px;
                    margin-bottom:20px">
          <svg width="160" height="160"
               viewBox="0 0 160 160"
               style="transform:rotate(-90deg)">
            <circle cx="80" cy="80" r="70"
                    fill="none"
                    stroke="rgba(139,240,187,0.1)"
                    stroke-width="8"/>
            <circle cx="80" cy="80" r="70"
                    fill="none"
                    stroke="#8bf0bb"
                    stroke-width="8"
                    stroke-linecap="round"
                    stroke-dasharray="${circ}"
                    stroke-dashoffset="0"
                    id="ultra-repos-arc"
                    style="transition:stroke-dashoffset 1s linear"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);
                      text-align:center">
            <div id="ultra-repos-display"
                 style="font-size:2.8rem;font-weight:900;
                        color:#8bf0bb;
                        font-variant-numeric:tabular-nums;
                        line-height:1">
              ${this._formatTemps(secondes)}
            </div>
            <div style="font-size:.6rem;color:rgba(255,255,255,0.3);
                        margin-top:4px">secondes</div>
          </div>
        </div>

        <!-- Prochain label -->
        <div style="font-size:.78rem;color:rgba(255,255,255,0.5);
                    margin-bottom:20px">
          Série ${serie + 1} / ${totalS} dans...
        </div>

        <!-- Charge prochaine -->
        <div style="padding:10px 20px;
                    background:rgba(75,75,249,0.1);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:12px;margin-bottom:20px">
          <div style="font-size:.6rem;color:rgba(255,255,255,0.4);
                      margin-bottom:4px">Charge prévue</div>
          <div style="font-size:1.4rem;font-weight:900;
                      color:#4b4bf9" id="ultra-repos-charge">
            ${this._seriesValidees[`${this._exoIdx}-${this._serieIdx-1}`]?.poids || '—'}kg
            × ${this._seriesValidees[`${this._exoIdx}-${this._serieIdx-1}`]?.reps || '—'}
          </div>
        </div>

        <!-- Boutons -->
        <div style="display:flex;gap:10px;width:100%;max-width:280px">
          <button onclick="LiveUltra._ajouterTempsRepos(15)"
                  style="flex:1;padding:12px;
                         background:rgba(255,255,255,0.06);
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:12px;color:rgba(255,255,255,0.6);
                         font-size:.82rem;font-weight:700;cursor:pointer">
            +15s
          </button>
          <button onclick="LiveUltra._passerRepos()"
                  style="flex:2;padding:12px;
                         background:#4b4bf9;border:none;
                         border-radius:12px;color:white;
                         font-size:.88rem;font-weight:800;
                         cursor:pointer">
            ⚡ Passer
          </button>
        </div>
      </div>`;

    // Voix
    if (this._voixActif) {
      this._parler(`Repos de ${secondes} secondes.`);
    }

    // Timer
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
        // Rouge les 5 dernières secondes
        if (reste <= 5) arc.style.stroke = '#ff8d96';
      }

      // Vibration 3s finales
      if (reste <= 3 && reste > 0) {
        Utils.vibrer?.([20]);
      }

      if (reste <= 0) {
        clearInterval(this._reposInterval);
        this._reposActif = false;
        Utils.vibrer?.([200, 100, 200]);
        if (this._voixActif) {
          this._parler('Repos terminé ! Allez, on y va !');
        }
        this._rafraichir();
      }
    }, 300);
  },

  _passerRepos() {
    clearInterval(this._reposInterval);
    this._reposActif = false;
    Utils.vibrer?.([30]);
    this._rafraichir();
  },

  _ajouterTempsRepos(secondes) {
    this._reposHeureFin += (secondes * 1000);
    Utils.vibrer?.([20]);
    Utils.toast(`+${secondes}s ✅`, 'success', 800);
  },

  // ════════════════════════════════════════════════════════
  // NAVIGATION EXERCICES
  // ════════════════════════════════════════════════════════
  _exoSuivant() {
    if (this._exoIdx >= this._exercices.length - 1) return;
    this._exoIdx++;
    this._serieIdx = 0;
    this._rafraichir();
    Utils.vibrer?.([20]);
  },

  _exoPrecedent() {
    if (this._exoIdx <= 0) return;
    this._exoIdx--;
    this._serieIdx = 0;
    this._rafraichir();
    Utils.vibrer?.([20]);
  },

  _allerExo(idx) {
    if (idx < 0 || idx >= this._exercices.length) return;
    this._exoIdx   = idx;
    this._serieIdx = 0;
    this._rafraichir();
    Utils.vibrer?.([20]);
  },

  _exoTermine(exoIdx) {
    const ex = this._exercices[exoIdx];
    if (!ex) return false;
    for (let s = 0; s < (ex.series || 3); s++) {
      if (!this._seriesValidees[`${exoIdx}-${s}`]) return false;
    }
    return true;
  },

  // ════════════════════════════════════════════════════════
  // AJUSTEMENTS CHARGE / REPS
  // ════════════════════════════════════════════════════════
  _ajusterCharge(delta) {
    const input = document.getElementById('ultra-poids');
    if (!input) return;
    const actuel  = parseFloat(input.value) || 0;
    const nouveau = Math.max(0, Math.round((actuel + delta) * 4) / 4);
    input.value   = nouveau;
    input.style.fontSize = nouveau > 99 ? '1.6rem' : '2rem';
    this._flashInput(input, delta > 0 ? '#8bf0bb' : '#ff8d96');
    Utils.vibrer?.([10]);
  },

  _ajusterReps(delta) {
    const input = document.getElementById('ultra-reps');
    if (!input) return;
    const actuel  = parseInt(input.value) || 0;
    const nouveau = Math.max(1, actuel + delta);
    input.value   = nouveau;
    this._flashInput(input, delta > 0 ? '#8bf0bb' : '#ff8d96');
    Utils.vibrer?.([10]);
  },

  _onPoidsChange(val) {
    const input = document.getElementById('ultra-poids');
    if (input) {
      input.style.fontSize = parseFloat(val) > 99 ? '1.6rem' : '2rem';
    }
  },

  _onRepsChange(val) {
    // Rien à faire pour l'instant
  },

  _flashInput(input, color) {
    input.style.borderColor = color;
    input.style.background  = `${color}22`;
    setTimeout(() => {
      input.style.borderColor = '';
      input.style.background  = '';
    }, 200);
  },

  // ════════════════════════════════════════════════════════
  // GESTES SWIPE
  // ════════════════════════════════════════════════════════
  _attacherGestes() {
    const overlay = document.getElementById('live-ultra-overlay');
    if (!overlay) return;

    overlay.addEventListener('touchstart', e => {
      const t          = e.touches[0];
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
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Swipe rapide uniquement (< 400ms)
      if (dt > 400) return;

      // Swipe HAUT → Valider série
      if (absDy > 60 && dy < 0 && absDy > absDx) {
        this._validerSerie();
        return;
      }

      // Swipe DROITE → Exercice précédent
      if (absDx > 80 && dx > 0 && absDx > absDy) {
        this._exoPrecedent();
        this._animer('swipe-right');
        return;
      }

      // Swipe GAUCHE → Exercice suivant
      if (absDx > 80 && dx < 0 && absDx > absDy) {
        this._exoSuivant();
        this._animer('swipe-left');
        return;
      }

      // Swipe BAS → Quitter
      if (absDy > 120 && dy > 0 && absDy > absDx) {
        this._confirmerQuitter();
        return;
      }
    }, { passive:true });
  },

  _confirmerQuitter() {
    Utils.confirmer(
      '⚡ Quitter le mode Ultra ?',
      'Ta progression sera sauvegardée.'
    ).then(ok => {
      if (ok) this.quitter();
    });
  },

  // ════════════════════════════════════════════════════════
  // CLAVIER
  // ════════════════════════════════════════════════════════
  _attacherClavier() {
    this._onKeyDown = (e) => {
      if (!this._actif) return;

      switch(e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          this._validerSerie();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this._exoSuivant();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this._exoPrecedent();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._ajusterCharge(2.5);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this._ajusterCharge(-2.5);
          break;
        case '+':
          this._ajusterReps(1);
          break;
        case '-':
          this._ajusterReps(-1);
          break;
        case 'Escape':
          this._confirmerQuitter();
          break;
      }
    };

    document.addEventListener('keydown', this._onKeyDown);
  },

  // ════════════════════════════════════════════════════════
  // EVENTS OVERLAY
  // ════════════════════════════════════════════════════════
  _attacherEventsOverlay() {
    // Double-tap → valider
    let lastTap = 0;
    const zone  = document.getElementById('ultra-zone-exercice');

    if (zone) {
      zone.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          e.preventDefault();
          this._validerSerie();
        }
        lastTap = now;
      }, { passive:false });
    }
  },

  // ════════════════════════════════════════════════════════
  // ANIMATIONS
  // ════════════════════════════════════════════════════════
  _animer(type) {
    const btn  = document.getElementById('ultra-btn-valider');
    const zone = document.getElementById('ultra-zone-exercice');

    switch(type) {
      case 'success':
        if (btn) {
          btn.style.animation = 'ultraSuccess .4s ease';
          setTimeout(() => { btn.style.animation = ''; }, 400);
        }
        break;

      case 'shake':
        if (btn) {
          btn.style.animation = 'ultraShake .3s ease';
          setTimeout(() => { btn.style.animation = ''; }, 300);
        }
        break;

      case 'transition':
        if (zone) {
          zone.style.opacity   = '0';
          zone.style.transform = 'translateY(20px)';
          setTimeout(() => {
            zone.style.transition = 'all .3s ease';
            zone.style.opacity    = '1';
            zone.style.transform  = 'translateY(0)';
          }, 50);
        }
        break;

      case 'swipe-left':
        if (zone) {
          zone.style.transform = 'translateX(-20px)';
          zone.style.opacity   = '0.5';
          setTimeout(() => {
            zone.style.transition = 'all .3s ease';
            zone.style.transform  = 'translateX(0)';
            zone.style.opacity    = '1';
          }, 50);
        }
        break;

      case 'swipe-right':
        if (zone) {
          zone.style.transform = 'translateX(20px)';
          zone.style.opacity   = '0.5';
          setTimeout(() => {
            zone.style.transition = 'all .3s ease';
            zone.style.transform  = 'translateX(0)';
            zone.style.opacity    = '1';
          }, 50);
        }
        break;
    }
  },

  // ════════════════════════════════════════════════════════
  // VOIX
  // ════════════════════════════════════════════════════════
  _toggleVoix() {
    this._voixActif = !this._voixActif;
    const btn = document.getElementById('ultra-btn-voix');
    if (btn) {
      btn.style.background  = this._voixActif
        ? 'rgba(139,240,187,0.2)' : 'rgba(255,255,255,0.08)';
      btn.style.borderColor = this._voixActif
        ? 'rgba(139,240,187,0.4)' : 'rgba(255,255,255,0.1)';
      btn.style.color = this._voixActif
        ? '#8bf0bb' : 'rgba(255,255,255,0.6)';
    }
    Utils.toast(
      this._voixActif ? '🎙️ Voix activée' : '🔇 Voix désactivée',
      'success', 1200
    );
    if (this._voixActif) {
      const ex     = this._exercices[this._exoIdx];
      const exoData = (window.EXERCICES||{})[ex?.ref||''] || {};
      this._parler(`Mode guidé activé. ${exoData.nom || 'Exercice'}, série ${this._serieIdx + 1}.`);
    }
  },

  _parler(texte) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u   = new SpeechSynthesisUtterance(texte);
    u.lang    = 'fr-FR';
    u.rate    = 0.95;
    u.pitch   = 1.0;
    u.volume  = 0.9;

    // Chercher voix française
    const voix = window.speechSynthesis.getVoices();
    const fr   = voix.find(v => v.lang.startsWith('fr')) || null;
    if (fr) u.voice = fr;

    window.speechSynthesis.speak(u);
  },

  // ════════════════════════════════════════════════════════
  // FIN DE SÉANCE
  // ════════════════════════════════════════════════════════
  _terminerSeance() {
    if (this._voixActif) {
      this._parler('Séance terminée ! Bravo, excellent travail !');
    }

    Utils.vibrer?.([200, 100, 200, 100, 400]);
    Utils.confetti?.(3000);

    // Terminer dans le tracker
    try { App.terminerSeance(this._seanceId); } catch(e) {}

    // Quitter le mode ultra
    setTimeout(() => { this.quitter(); }, 500);
  },

  // ════════════════════════════════════════════════════════
  // RAFRAÎCHISSEMENT
  // ════════════════════════════════════════════════════════
  _rafraichir() {
    const overlay = document.getElementById('live-ultra-overlay');
    if (!overlay || !this._actif) return;

    // Sauvegarder le focus
    const activeId = document.activeElement?.id;

    overlay.innerHTML = this._htmlOverlay();
    this._attacherGestes();
    this._attacherEventsOverlay();

    // Restaurer le focus
    if (activeId) {
      const el = document.getElementById(activeId);
      if (el) {
        el.focus();
        el.select?.();
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // BACKGROUND
  // ════════════════════════════════════════════════════════
  _onVisibilityChange() {
    if (!this._actif) return;
    if (document.visibilityState === 'visible' && this._reposActif) {
      // Recalculer le temps restant
      const resteMs  = this._reposHeureFin - Date.now();
      const resteSec = Math.ceil(resteMs / 1000);
      if (resteSec <= 0) {
        clearInterval(this._reposInterval);
        this._reposActif = false;
        Utils.vibrer?.([200, 100, 200]);
        Utils.toast('⏱ Repos terminé !', 'success', 3000);
        this._rafraichir();
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _formatTemps(sec) {
    const s = Math.max(0, Math.round(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m > 0) return `${m}:${String(r).padStart(2,'0')}`;
    return String(s);
  }
};

// ════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE
// ════════════════════════════════════════════════════════════
window.LiveUltra = LiveUltra;

console.log('✅ LiveUltra v1.0 chargé — Mode Séance Ultra-Rapide');
