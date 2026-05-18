/* ============================================================
   PowerApp — Circuit.js v1.1 FINAL
   Mode Circuit + HIIT + Tabata + Fix timer navigation
   ============================================================ */

'use strict';

const Circuit = {

  // ════════════════════════════════════════════════════════
  // MODES DISPONIBLES
  // ════════════════════════════════════════════════════════
  MODES: {
    circuit: {
      id:'circuit', nom:'Circuit Training', emoji:'🔄',
      description:'Enchaîne les exercices sans repos entre eux',
      color:'var(--fd-indigo)'
    },
    hiit: {
      id:'hiit', nom:'HIIT', emoji:'🔥',
      description:'Intervalles haute intensité / récupération',
      color:'var(--fd-coral)'
    },
    tabata: {
      id:'tabata', nom:'Tabata', emoji:'⚡',
      description:'20s effort / 10s repos × 8 rounds',
      color:'var(--fd-lemon)'
    },
    amrap: {
      id:'amrap', nom:'AMRAP', emoji:'♾️',
      description:'As Many Rounds As Possible',
      color:'var(--fd-mint)'
    },
    emom: {
      id:'emom', nom:'EMOM', emoji:'⏰',
      description:'Every Minute On the Minute',
      color:'var(--fd-lavender)'
    }
  },

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _timer:          null,
  _tempsRestant:   0,
  _phase:          'travail',
  _exoActuel:      0,
  _roundActuel:    1,
  _config:         null,
  _configSauvegarde: null,   // ✅ Pour "Recommencer"
  _enPause:        false,
  _exercicesConfig:[],
  _modeActif:      'circuit',

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    // ✅ Arrêter le timer si on re-render la page
    this._arreterPlayer();

    container.innerHTML = `
      <div id="circuit-selection">
        <div class="section-title">⚡ Choisir un mode</div>
        ${Object.values(this.MODES).map(mode => `
          <div class="card mb-md"
               style="cursor:pointer;border-left:4px solid ${mode.color}"
               onclick="Circuit._selectionnerMode('${mode.id}')">
            <div class="flex justify-between items-center">
              <div style="display:flex;align-items:center;gap:var(--space-md)">
                <span style="font-size:2rem">${mode.emoji}</span>
                <div>
                  <div style="font-weight:700;font-size:.95rem">${mode.nom}</div>
                  <div style="font-size:.72rem;color:var(--text-muted)">${mode.description}</div>
                </div>
              </div>
              <span style="color:var(--text-muted);font-size:1.2rem">›</span>
            </div>
          </div>`).join('')}
        ${this._renderHistoriqueCircuits()}
      </div>

      <div id="circuit-config" style="display:none"></div>
      <div id="circuit-player" style="display:none"></div>
    `;
  },

  _renderHistoriqueCircuits() {
    const hist = Utils.storage.get('ft_circuits_hist', []);
    if (!hist.length) return '';
    return `
      <div class="section-title mt-md">📋 Circuits récents</div>
      ${hist.slice(0,3).map(c => `
        <div class="card mb-md" style="cursor:pointer;opacity:.8"
             onclick="Circuit._chargerCircuit('${c.id}')">
          <div class="flex justify-between items-center">
            <div>
              <div style="font-weight:600;font-size:.88rem">
                ${this.MODES[c.mode]?.emoji||'⚡'} ${c.nom}
              </div>
              <div style="font-size:.68rem;color:var(--text-muted)">
                ${c.exercices?.length||0} exercices · ${Utils.formatDateCourt(c.date)}
              </div>
            </div>
            <button onclick="event.stopPropagation();Circuit._lancerCircuit('${c.id}')"
                    class="btn-primary" style="font-size:.72rem;padding:6px 12px">
              ▶ Relancer
            </button>
          </div>
        </div>`).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // CONFIGURATEUR
  // ════════════════════════════════════════════════════════
  _selectionnerMode(modeId) {
    const mode = this.MODES[modeId];
    if (!mode) return;

    const sel = document.getElementById('circuit-selection');
    const cfg = document.getElementById('circuit-config');
    if (sel) sel.style.display = 'none';
    if (cfg) cfg.style.display = 'block';

    const defaults = {
      circuit: { travail:40, repos:20,  rounds:3,  repos_circuit:60  },
      hiit:    { travail:30, repos:30,  rounds:8,  repos_circuit:120 },
      tabata:  { travail:20, repos:10,  rounds:8,  repos_circuit:0   },
      amrap:   { travail:60, repos:0,   rounds:1,  temps_total:600   },
      emom:    { travail:40, repos:20,  rounds:10, intervalle:60     }
    };
    const def = defaults[modeId] || defaults.circuit;

    cfg.innerHTML = `
      <button onclick="Circuit._retourSelection()"
              style="background:none;border:none;color:var(--fd-indigo);
                     font-size:.85rem;font-weight:600;cursor:pointer;
                     margin-bottom:var(--space-md)">
        ← Retour
      </button>

      <div class="card mb-md" style="border-left:4px solid ${mode.color}">
        <div style="font-size:1.5rem;margin-bottom:4px">${mode.emoji}</div>
        <div style="font-size:1.1rem;font-weight:800">${mode.nom}</div>
        <div style="font-size:.78rem;color:var(--text-muted)">${mode.description}</div>
      </div>

      <div class="card mb-md">
        <div class="card-label mb-md">⏱️ Paramètres</div>
        ${modeId !== 'amrap' ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
            <div>
              <div class="input-label">⚡ Travail (sec)</div>
              <input class="input" id="cfg-travail" type="number" value="${def.travail}" min="5" max="300" />
            </div>
            <div>
              <div class="input-label">😴 Repos (sec)</div>
              <input class="input" id="cfg-repos" type="number" value="${def.repos}" min="0" max="300" />
            </div>
            <div>
              <div class="input-label">🔄 Rounds</div>
              <input class="input" id="cfg-rounds" type="number" value="${def.rounds}" min="1" max="20" />
            </div>
            ${modeId !== 'tabata' ? `
              <div>
                <div class="input-label">⏸ Repos circuit (sec)</div>
                <input class="input" id="cfg-repos-circuit" type="number" value="${def.repos_circuit}" min="0" max="300" />
              </div>` : '<div></div>'}
          </div>` : `
          <div>
            <div class="input-label">⏱️ Durée totale (min)</div>
            <input class="input" id="cfg-temps-total" type="number"
                   value="${(def.temps_total||600)/60}" min="1" max="60" />
          </div>`}
      </div>

      <div class="card mb-md">
        <div class="flex justify-between items-center mb-md">
          <div class="card-label" style="margin:0">🏋️ Exercices</div>
          <button onclick="Circuit._ajouterExercice()"
                  style="padding:4px 12px;background:var(--fd-indigo);color:white;
                         border:none;border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:600;cursor:pointer">
            + Ajouter
          </button>
        </div>
        <div id="circuit-exercices-list">
          ${this._renderExercicesConfig([])}
        </div>
      </div>

      <div class="card mb-md">
        <div class="input-label">📝 Nom du circuit</div>
        <input class="input mt-sm" id="cfg-nom"
               placeholder="Mon circuit ${mode.nom}"
               value="Circuit ${mode.nom} — ${new Date().toLocaleDateString('fr-FR')}" />
      </div>

      <button onclick="Circuit._lancerConfig('${modeId}')"
              class="btn-primary"
              style="width:100%;font-size:.9rem;padding:var(--space-md)">
        ▶ Démarrer le circuit
      </button>
    `;

    this._modeActif      = modeId;
    this._exercicesConfig = [];
    ['squat','pompes','planche'].forEach(ref => this._ajouterExerciceRef(ref));
  },

  _renderExercicesConfig(exercices) {
    if (!exercices.length) {
      return `<div style="text-align:center;padding:var(--space-md);color:var(--text-muted);font-size:.82rem">
                Aucun exercice. Clique sur + Ajouter
              </div>`;
    }
    return exercices.map((ex, i) => {
      const exo = (window.EXERCICES||{})[ex.ref]||{};
      return `
        <div style="display:flex;align-items:center;gap:8px;padding:var(--space-sm) 0;border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.2rem">${exo.emoji||'💪'}</span>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">${exo.nom||ex.ref}</div>
            <div style="font-size:.65rem;color:var(--text-muted)">${exo.muscle||''}</div>
          </div>
          <button onclick="Circuit._retirerExercice(${i})"
                  style="background:none;border:none;color:var(--fd-coral);cursor:pointer;font-size:.9rem">
            ✕
          </button>
        </div>`;
    }).join('');
  },

  _ajouterExercice() {
    const exos  = Object.entries(window.EXERCICES||{});
    const modal = document.createElement('div');
    modal.id    = 'modal-circuit-exo';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:1000;
      background:rgba(9,9,45,0.92);
      display:flex;align-items:flex-end;
      padding:var(--space-md);
    `;
    modal.innerHTML = `
      <div style="width:100%;max-width:480px;margin:0 auto;background:var(--bg-card);
                  border-radius:var(--radius-lg);overflow:hidden;max-height:80vh;
                  display:flex;flex-direction:column">
        <div style="padding:var(--space-md);border-bottom:1px solid var(--border-color);
                    display:flex;justify-content:space-between;align-items:center">
          <div style="font-weight:700">Choisir un exercice</div>
          <button onclick="document.getElementById('modal-circuit-exo').remove()"
                  style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--text-muted)">✕</button>
        </div>
        <div style="overflow-y:auto;flex:1">
          ${exos.map(([ref, ex]) => `
            <div onclick="Circuit._ajouterExerciceRef('${ref}');document.getElementById('modal-circuit-exo').remove()"
                 style="display:flex;align-items:center;gap:12px;padding:var(--space-sm) var(--space-md);
                        cursor:pointer;border-bottom:1px solid var(--border-color)"
                 onmouseover="this.style.background='rgba(75,75,249,0.1)'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:1.3rem">${ex.emoji||'💪'}</span>
              <div>
                <div style="font-weight:600;font-size:.88rem">${ex.nom}</div>
                <div style="font-size:.65rem;color:var(--text-muted)">${ex.muscle||''}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  },

  _ajouterExerciceRef(ref) {
    this._exercicesConfig.push({ ref });
    const liste = document.getElementById('circuit-exercices-list');
    if (liste) liste.innerHTML = this._renderExercicesConfig(this._exercicesConfig);
  },

  _retirerExercice(idx) {
    this._exercicesConfig.splice(idx, 1);
    const liste = document.getElementById('circuit-exercices-list');
    if (liste) liste.innerHTML = this._renderExercicesConfig(this._exercicesConfig);
  },

  // ════════════════════════════════════════════════════════
  // LANCEMENT
  // ════════════════════════════════════════════════════════
  _lancerConfig(modeId) {
    if (!this._exercicesConfig.length) {
      Utils.toast('Ajoute au moins un exercice !', 'error');
      return;
    }
    const config = {
      id:       'circuit_' + Date.now(),
      mode:     modeId,
      nom:      document.getElementById('cfg-nom')?.value || `Circuit ${modeId}`,
      date:     Utils.aujourd_hui(),
      exercices:     [...this._exercicesConfig],
      travail:       parseInt(document.getElementById('cfg-travail')?.value)       || 30,
      repos:         parseInt(document.getElementById('cfg-repos')?.value)         || 15,
      rounds:        parseInt(document.getElementById('cfg-rounds')?.value)        || 3,
      reposCircuit:  parseInt(document.getElementById('cfg-repos-circuit')?.value) || 60,
      tempsTotalAMRAP: (parseInt(document.getElementById('cfg-temps-total')?.value) || 10) * 60
    };
    const hist = Utils.storage.get('ft_circuits_hist', []);
    hist.unshift(config);
    Utils.storage.set('ft_circuits_hist', hist.slice(0, 10));
    this._demarrerPlayer(config);
  },

  _lancerCircuit(id) {
    const hist   = Utils.storage.get('ft_circuits_hist', []);
    const config = hist.find(c => c.id === id);
    if (!config) return;
    this._demarrerPlayer(config);
  },

  _chargerCircuit(id) {
    const hist   = Utils.storage.get('ft_circuits_hist', []);
    const config = hist.find(c => c.id === id);
    if (!config) return;
    this._selectionnerMode(config.mode);
  },

  _retourSelection() {
    this._arreterPlayer();
    // ✅ Fermer modal exercice si ouvert
    document.getElementById('modal-circuit-exo')?.remove();

    const sel = document.getElementById('circuit-selection');
    const cfg = document.getElementById('circuit-config');
    const pl  = document.getElementById('circuit-player');
    if (sel) sel.style.display = 'block';
    if (cfg) cfg.style.display = 'none';
    if (pl)  pl.style.display  = 'none';
  },

  // ════════════════════════════════════════════════════════
  // PLAYER
  // ════════════════════════════════════════════════════════
  _demarrerPlayer(config) {
    // ✅ Sauvegarder pour "Recommencer"
    this._configSauvegarde = JSON.parse(JSON.stringify(config));

    this._config      = config;
    this._exoActuel   = 0;
    this._roundActuel = 1;
    this._phase       = 'travail';
    this._enPause     = false;

    const sel = document.getElementById('circuit-selection');
    const cfg = document.getElementById('circuit-config');
    const pl  = document.getElementById('circuit-player');
    if (sel) sel.style.display = 'none';
    if (cfg) cfg.style.display = 'none';
    if (pl)  pl.style.display  = 'block';

    this._tempsRestant = config.mode === 'amrap'
      ? config.tempsTotalAMRAP
      : config.travail;

    this._renderPlayer();
    this._lancerTimer();
  },

  _renderPlayer() {
    const config = this._config;
    if (!config) return;
    const player = document.getElementById('circuit-player');
    if (!player) return;

    const exoActuel  = config.exercices[this._exoActuel];
    const exoSuivant = config.exercices[this._exoActuel + 1];
    const exo        = (window.EXERCICES||{})[exoActuel?.ref]||{};
    const exoSuiv    = exoSuivant ? (window.EXERCICES||{})[exoSuivant.ref]||{} : null;
    const mode       = this.MODES[config.mode];
    const totalEx    = config.exercices.length;

    const phaseColor = this._phase === 'travail'
      ? (mode?.color || 'var(--fd-indigo)')
      : this._phase === 'repos_circuit'
        ? 'var(--fd-lavender)'
        : 'var(--fd-mint)';

    const phaseLabel = this._phase === 'travail'
      ? '⚡ GO !'
      : this._phase === 'repos_circuit'
        ? '🔄 Repos circuit'
        : '😴 Repos';

    const progressPct = Math.round(
      ((this._exoActuel + (this._roundActuel - 1) * totalEx) /
      (totalEx * config.rounds)) * 100
    );

    player.innerHTML = `
      <div class="card mb-md"
           style="background:linear-gradient(135deg,rgba(75,75,249,0.2),rgba(75,75,249,0.05));border-color:var(--fd-indigo)">
        <div class="flex justify-between items-center">
          <div>
            <div style="font-size:.72rem;color:var(--fd-indigo);font-weight:700;text-transform:uppercase">
              ${mode?.emoji} ${mode?.nom}
            </div>
            <div style="font-weight:700;font-size:.95rem;margin-top:2px">${config.nom}</div>
          </div>
          <button onclick="Circuit._retourSelection()"
                  style="padding:6px 12px;background:rgba(255,141,150,0.15);
                         border:1px solid rgba(255,141,150,0.3);border-radius:var(--radius-full);
                         color:var(--fd-coral);font-size:.72rem;font-weight:600;cursor:pointer">
            ✕ Arrêter
          </button>
        </div>
        <div style="margin-top:var(--space-sm)">
          <div class="flex justify-between" style="font-size:.68rem;color:var(--text-muted);margin-bottom:4px">
            <span>Round ${this._roundActuel} / ${config.rounds}</span>
            <span>Exo ${this._exoActuel + 1} / ${totalEx}</span>
          </div>
          <div style="height:4px;background:var(--bg-input);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${progressPct}%;background:var(--fd-indigo);border-radius:99px;transition:width .3s"></div>
          </div>
        </div>
      </div>

      <div class="card mb-md"
           style="text-align:center;border-color:${phaseColor};background:${phaseColor}11">
        <div style="font-size:.85rem;font-weight:700;color:${phaseColor};text-transform:uppercase;letter-spacing:.1em;margin-bottom:var(--space-sm)">
          ${phaseLabel}
        </div>

        <div style="position:relative;width:180px;height:180px;margin:0 auto var(--space-md)">
          <svg width="180" height="180" style="transform:rotate(-90deg)">
            <circle cx="90" cy="90" r="80" fill="none" stroke="var(--bg-input)" stroke-width="10"/>
            <circle cx="90" cy="90" r="80" fill="none"
                    stroke="${phaseColor}" stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 80}"
                    stroke-dashoffset="${2 * Math.PI * 80 * (1 - this._getProgression())}"
                    id="circle-timer"
                    style="transition:stroke-dashoffset .9s linear"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
            <div id="timer-display"
                 style="font-size:3rem;font-weight:800;color:${phaseColor};font-variant-numeric:tabular-nums;line-height:1">
              ${this._tempsRestant}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">secondes</div>
          </div>
        </div>

        <div style="font-size:2.5rem;margin-bottom:4px">${exo.emoji||'💪'}</div>
        <div style="font-size:1.2rem;font-weight:800;margin-bottom:4px">
          ${exo.nom||exoActuel?.ref||'Exercice'}
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">${exo.muscle||''}</div>

        ${exoSuiv && this._phase === 'travail' ? `
          <div style="margin-top:var(--space-sm);padding:var(--space-xs) var(--space-md);
                      background:var(--bg-input);border-radius:var(--radius-full);
                      font-size:.72rem;color:var(--text-muted)">
            Suivant : ${exoSuiv.emoji||'💪'} ${exoSuiv.nom||''}
          </div>` : ''}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);margin-bottom:var(--space-md)">
        <button id="btn-pause-circuit" onclick="Circuit._togglePause()"
                class="btn-secondary" style="font-size:.9rem;padding:var(--space-md)">
          ${this._enPause ? '▶ Reprendre' : '⏸ Pause'}
        </button>
        <button onclick="Circuit._passerPhase()"
                class="btn-primary" style="font-size:.9rem;padding:var(--space-md)">
          ⏭ Passer
        </button>
      </div>

      ${exo.conseils?.length ? `
        <div class="card" style="border-left:3px solid ${phaseColor}">
          <div style="font-size:.65rem;font-weight:700;color:${phaseColor};text-transform:uppercase;margin-bottom:4px">
            💡 Conseils
          </div>
          ${exo.conseils.slice(0,2).map(c=>`
            <div style="font-size:.75rem;color:var(--text-secondary);margin-bottom:2px">• ${c}</div>
          `).join('')}
        </div>` : ''}
    `;
  },

  _getProgression() {
    const config = this._config;
    if (!config) return 0;
    const total = this._phase === 'travail'
      ? config.travail
      : this._phase === 'repos_circuit'
        ? config.reposCircuit
        : config.repos;
    if (!total) return 0;
    return this._tempsRestant / total;
  },

  _lancerTimer() {
    clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (this._enPause) return;

      this._tempsRestant--;

      // ✅ Update leger — pas de re-render complet
      const disp = document.getElementById('timer-display');
      if (disp) disp.textContent = Math.max(0, this._tempsRestant);

      // Cercle SVG update
      const circle = document.getElementById('circle-timer');
      if (circle) {
        const prog = this._getProgression();
        const offset = 2 * Math.PI * 80 * (1 - prog);
        circle.style.strokeDashoffset = offset;
      }

      // Alerte sonore 3 dernières secondes
      if (this._tempsRestant <= 3 && this._tempsRestant > 0) {
        try { timerRepos.jouerSon?.('bip'); } catch(e) {}
        Utils.vibrer([50]);
      }

      if (this._tempsRestant <= 0) {
        this._phaseSuivante();
      }
    }, 1000);
  },

  _phaseSuivante() {
    const config  = this._config;
    if (!config) return;
    const totalEx = config.exercices.length;

    try { timerRepos.jouerSon?.('go'); } catch(e) {}
    Utils.vibrer([200, 100, 200]);

    if (this._phase === 'travail') {
      const suivantExo = this._exoActuel + 1;
      if (suivantExo < totalEx) {
        if (config.repos > 0) {
          this._phase        = 'repos';
          this._tempsRestant = config.repos;
        } else {
          this._exoActuel++;
          this._phase        = 'travail';
          this._tempsRestant = config.travail;
        }
      } else {
        if (this._roundActuel < config.rounds) {
          this._roundActuel++;
          this._exoActuel = 0;
          if (config.reposCircuit > 0) {
            this._phase        = 'repos_circuit';
            this._tempsRestant = config.reposCircuit;
          } else {
            this._phase        = 'travail';
            this._tempsRestant = config.travail;
          }
        } else {
          this._finCircuit();
          return;
        }
      }
    } else if (this._phase === 'repos') {
      this._exoActuel++;
      this._phase        = 'travail';
      this._tempsRestant = config.travail;
    } else if (this._phase === 'repos_circuit') {
      this._phase        = 'travail';
      this._tempsRestant = config.travail;
    }

    this._renderPlayer();
    this._lancerTimer();
  },

  _passerPhase() {
    this._tempsRestant = 0;
  },

  _togglePause() {
    this._enPause = !this._enPause;
    const btn = document.getElementById('btn-pause-circuit');
    if (btn) btn.textContent = this._enPause ? '▶ Reprendre' : '⏸ Pause';
    Utils.vibrer([50]);
  },

  // ✅ Arrêt propre — clearInterval garanti
  _arreterPlayer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._enPause = false;
  },

  _finCircuit() {
    this._arreterPlayer();
    const config = this._configSauvegarde; // ✅ Utiliser la sauvegarde
    const player = document.getElementById('circuit-player');
    if (!player) return;

    Utils.confetti(3000);
    Utils.vibrer([200,100,200,100,400]);
    try { Gamification.recompenser('CIRCUIT_COMPLETE'); } catch(e) {}
    try { Gamification.ajouterXP(150, 'Circuit terminé');  } catch(e) {}

    player.innerHTML = `
      <div class="card mt-md"
           style="text-align:center;padding:var(--space-xl);border-color:var(--fd-mint)">
        <div style="font-size:4rem;margin-bottom:var(--space-md)">🏆</div>
        <div style="font-size:1.5rem;font-weight:800;color:var(--fd-mint);margin-bottom:var(--space-sm)">
          Circuit terminé !
        </div>
        <div style="font-size:.88rem;color:var(--text-muted);margin-bottom:var(--space-lg)">
          ${config?.rounds||0} rounds · ${config?.exercices?.length||0} exercices<br>
          +150 XP gagnés !
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm)">
          <button onclick="Circuit._recommencer()"
                  class="btn-secondary">
            🔄 Recommencer
          </button>
          <button onclick="naviguer('home')"
                  class="btn-primary">
            🏠 Accueil
          </button>
        </div>
      </div>
    `;
  },

  // ✅ Recommencer avec config sauvegardée
  _recommencer() {
    if (this._configSauvegarde) {
      this._demarrerPlayer(
        JSON.parse(JSON.stringify(this._configSauvegarde))
      );
    } else {
      this._retourSelection();
    }
  }
};

window.Circuit = Circuit;
console.log('✅ Circuit.js v1.1 chargé');
