/* ============================================================
   PowerApp — Circuit.js v2.0
   Mode Circuit + HIIT + Tabata + AMRAP + EMOM
   + Circuits prédéfinis + Genre-aware + Stats Tracker
   + AMRAP compteur rounds + EMOM logique minutes
   ============================================================ */

'use strict';

const Circuit = {

  // ════════════════════════════════════════════════════════
  // MODES
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

  // ✅ NOUVEAU v2.0 — Circuits prédéfinis
  PREDEFINIS_DEFAUT: [
    {
      id:'circuit_full_body',
      nom:'Full Body Express',
      mode:'circuit',
      emoji:'🔄',
      travail:40, repos:20, rounds:3, reposCircuit:60,
      genre:['homme','femme'],
      lieu:['salle','maison'],
      exercices:[
        {ref:'pompes'},
        {ref:'squat_poids_corps'},
        {ref:'planche'},
        {ref:'crunch'},
        {ref:'mountain_climbers'}
      ]
    },
    {
      id:'hiit_cardio',
      nom:'HIIT Cardio Brûle-Graisse',
      mode:'hiit',
      emoji:'🔥',
      travail:30, repos:15, rounds:5, reposCircuit:90,
      genre:['homme','femme'],
      lieu:['maison','dehors'],
      exercices:[
        {ref:'burpees'},
        {ref:'squat_saute'},
        {ref:'mountain_climbers'},
        {ref:'pompes'}
      ]
    },
    {
      id:'tabata_abs',
      nom:'Tabata Abdos',
      mode:'tabata',
      emoji:'⚡',
      travail:20, repos:10, rounds:8, reposCircuit:0,
      genre:['homme','femme'],
      lieu:['maison','dehors'],
      exercices:[
        {ref:'crunch'},
        {ref:'russian_twist'},
        {ref:'planche'},
        {ref:'mountain_climbers'}
      ]
    },
    // ✅ NOUVEAU v2.0 — Circuit femme Lower Body
    {
      id:'circuit_lower_femme',
      nom:'Lower Body Féminin 🍑',
      mode:'circuit',
      emoji:'🍑',
      travail:40, repos:15, rounds:4, reposCircuit:60,
      genre:['femme'],
      lieu:['salle','maison'],
      exercices:[
        {ref:'squat_poids_corps'},
        {ref:'donkey_kick'},
        {ref:'hip_thrust_sol'},
        {ref:'clamshell'},
        {ref:'fentes_bulgares'}
      ]
    },
    {
      id:'hiit_lower_femme',
      nom:'HIIT Fessiers Power',
      mode:'hiit',
      emoji:'🍑',
      travail:35, repos:15, rounds:4, reposCircuit:60,
      genre:['femme'],
      lieu:['maison','dehors'],
      exercices:[
        {ref:'squat_saute'},
        {ref:'hip_thrust_sol'},
        {ref:'donkey_kick'},
        {ref:'mountain_climbers'}
      ]
    },
    // ✅ Circuit maison homme
    {
      id:'circuit_maison_homme',
      nom:'Push-Pull Maison',
      mode:'circuit',
      emoji:'🏠',
      travail:45, repos:15, rounds:3, reposCircuit:90,
      genre:['homme'],
      lieu:['maison','dehors'],
      exercices:[
        {ref:'pompes'},
        {ref:'tractions'},
        {ref:'diamond_pushup'},
        {ref:'inverted_row'},
        {ref:'planche'}
      ]
    }
  ],

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _timer:            null,
  _tempsRestant:     0,
  _phase:            'travail',
  _exoActuel:        0,
  _roundActuel:      1,
  _config:           null,
  _configSauvegarde: null,
  _enPause:          false,
  _exercicesConfig:  [],
  _modeActif:        'circuit',
  _debutCircuit:     null,    // ✅ NOUVEAU v2.0 — chrono
  _minuteEMOM:       1,       // ✅ NOUVEAU v2.0 — EMOM
  _roundsAMRAP:      0,       // ✅ NOUVEAU v2.0 — AMRAP compteur

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    this._arreterPlayer();

    // ✅ NOUVEAU v2.0 — Genre + lieu pour filtrer circuits
    let genre = 'homme', lieu = 'salle';
    try {
      const profil = Utils.storage.get('ft_profil_onboarding', {});
      genre = profil.genre || 'homme';
      lieu  = profil.lieu  || 'salle';
    } catch(e) {}

    // Circuits prédéfinis adaptés
    const circuitsAdaptes = this.PREDEFINIS_DEFAUT.filter(c =>
      (!c.genre || c.genre.includes(genre))
      && (!c.lieu  || c.lieu.includes(lieu)
          || c.lieu.includes('salle'))
    );

    container.innerHTML = `
      <div id="circuit-selection">

        <!-- ✅ NOUVEAU v2.0 — Circuits recommandés -->
        ${circuitsAdaptes.length > 0 ? `
          <div class="section-title">
            ⭐ Circuits pour toi
            ${genre === 'femme' ? '🌸' : ''}
          </div>
          ${circuitsAdaptes.map(c => {
            const mode = this.MODES[c.mode] || {};
            return `
              <div class="card mb-md"
                   style="border-left:4px solid ${mode.color || 'var(--fd-indigo)'};
                          cursor:pointer"
                   onclick="Circuit._chargerCircuitPredefini('${c.id}')">
                <div class="flex justify-between items-center">
                  <div style="display:flex;align-items:center;
                              gap:var(--space-md)">
                    <span style="font-size:2rem">${c.emoji||mode.emoji||'⚡'}</span>
                    <div>
                      <div style="font-weight:700;font-size:.9rem">
                        ${c.nom}
                      </div>
                      <div style="font-size:.65rem;
                                  color:var(--text-muted)">
                        ${mode.emoji||''} ${mode.nom||''}
                        · ${c.exercices.length} exos
                        · ${c.rounds} rounds
                      </div>
                    </div>
                  </div>
                  <button onclick="event.stopPropagation();
                          Circuit._lancerPredefini('${c.id}')"
                          class="btn-primary"
                          style="font-size:.72rem;padding:6px 12px">
                    ▶ Start
                  </button>
                </div>
              </div>`;
          }).join('')}` : ''}

        <div class="section-title">⚡ Choisir un mode</div>
        ${Object.values(this.MODES).map(mode => `
          <div class="card mb-md"
               style="cursor:pointer;
                      border-left:4px solid ${mode.color}"
               onclick="Circuit._selectionnerMode('${mode.id}')">
            <div class="flex justify-between items-center">
              <div style="display:flex;align-items:center;
                          gap:var(--space-md)">
                <span style="font-size:2rem">${mode.emoji}</span>
                <div>
                  <div style="font-weight:700;font-size:.95rem">
                    ${mode.nom}
                  </div>
                  <div style="font-size:.72rem;color:var(--text-muted)">
                    ${mode.description}
                  </div>
                </div>
              </div>
              <span style="color:var(--text-muted);font-size:1.2rem">
                ›
              </span>
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
                ${c.exercices?.length||0} exercices
                · ${Utils.formatDateCourt(c.date)}
              </div>
            </div>
            <button onclick="event.stopPropagation();
                    Circuit._lancerCircuit('${c.id}')"
                    class="btn-primary"
                    style="font-size:.72rem;padding:6px 12px">
              ▶ Relancer
            </button>
          </div>
        </div>`).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // CIRCUITS PRÉDÉFINIS
  // ════════════════════════════════════════════════════════
  _chargerCircuitPredefini(id) {
    const c = this.PREDEFINIS_DEFAUT.find(x => x.id === id);
    if (!c) return;
    this._selectionnerMode(c.mode);
    // Pré-remplir avec les exercices du circuit
    setTimeout(() => {
      this._exercicesConfig = [...c.exercices];
      const liste = document.getElementById('circuit-exercices-list');
      if (liste) {
        liste.innerHTML = this._renderExercicesConfig(
          this._exercicesConfig
        );
      }
      const nom = document.getElementById('cfg-nom');
      if (nom) nom.value = c.nom;
    }, 50);
  },

  _lancerPredefini(id) {
    const c = this.PREDEFINIS_DEFAUT.find(x => x.id === id);
    if (!c) return;

    const config = {
      ...c,
      id:              'circuit_' + Date.now(),
      date:            Utils.aujourd_hui(),
      tempsTotalAMRAP: 600
    };

    const hist = Utils.storage.get('ft_circuits_hist', []);
    hist.unshift(config);
    Utils.storage.set('ft_circuits_hist', hist.slice(0, 10));

    this._demarrerPlayer(config);
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
              style="background:none;border:none;
                     color:var(--fd-indigo);font-size:.85rem;
                     font-weight:600;cursor:pointer;
                     margin-bottom:var(--space-md)">
        ← Retour
      </button>

      <div class="card mb-md"
           style="border-left:4px solid ${mode.color}">
        <div style="font-size:1.5rem;margin-bottom:4px">
          ${mode.emoji}
        </div>
        <div style="font-size:1.1rem;font-weight:800">
          ${mode.nom}
        </div>
        <div style="font-size:.78rem;color:var(--text-muted)">
          ${mode.description}
        </div>
      </div>

      <div class="card mb-md">
        <div class="card-label mb-md">⏱️ Paramètres</div>
        ${modeId !== 'amrap' ? `
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;
                      gap:var(--space-sm)">
            <div>
              <div class="input-label">⚡ Travail (sec)</div>
              <input class="input" id="cfg-travail" type="number"
                     value="${def.travail}" min="5" max="300"/>
            </div>
            <div>
              <div class="input-label">😴 Repos (sec)</div>
              <input class="input" id="cfg-repos" type="number"
                     value="${def.repos}" min="0" max="300"/>
            </div>
            <div>
              <div class="input-label">🔄 Rounds</div>
              <input class="input" id="cfg-rounds" type="number"
                     value="${def.rounds}" min="1" max="20"/>
            </div>
            ${modeId !== 'tabata' ? `
              <div>
                <div class="input-label">⏸ Repos circuit (sec)</div>
                <input class="input" id="cfg-repos-circuit"
                       type="number"
                       value="${def.repos_circuit}" min="0" max="300"/>
              </div>` : '<div></div>'}
          </div>` : `
          <div>
            <div class="input-label">⏱️ Durée totale (min)</div>
            <input class="input" id="cfg-temps-total" type="number"
                   value="${(def.temps_total||600)/60}"
                   min="1" max="60"/>
          </div>`}
      </div>

      <div class="card mb-md">
        <div class="flex justify-between items-center mb-md">
          <div class="card-label" style="margin:0">🏋️ Exercices</div>
          <button onclick="Circuit._ajouterExercice()"
                  style="padding:4px 12px;
                         background:var(--fd-indigo);color:white;
                         border:none;border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:600;
                         cursor:pointer">
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
              style="width:100%;font-size:.9rem;
                     padding:var(--space-md)">
        ▶ Démarrer le circuit
      </button>
    `;

    this._modeActif       = modeId;
    this._exercicesConfig = [];
    ['squat_poids_corps','pompes','planche'].forEach(
      ref => this._ajouterExerciceRef(ref)
    );
  },

  _renderExercicesConfig(exercices) {
    if (!exercices.length) {
      return `
        <div style="text-align:center;padding:var(--space-md);
                    color:var(--text-muted);font-size:.82rem">
          Aucun exercice. Clique sur + Ajouter
        </div>`;
    }
    return exercices.map((ex, i) => {
      const exo = (window.EXERCICES||{})[ex.ref]||{};
      return `
        <div style="display:flex;align-items:center;gap:8px;
                    padding:var(--space-sm) 0;
                    border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.2rem">${exo.emoji||'💪'}</span>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">
              ${exo.nom||ex.ref}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${exo.muscle||''}
            </div>
          </div>
          <button onclick="Circuit._retirerExercice(${i})"
                  style="background:none;border:none;
                         color:var(--fd-coral);cursor:pointer;
                         font-size:.9rem">
            ✕
          </button>
        </div>`;
    }).join('');
  },

  // ✅ NOUVEAU v2.0 — Filtre exercices selon genre + lieu
  _ajouterExercice() {
    let genre = 'homme', lieu = 'salle';
    try {
      const profil = Utils.storage.get('ft_profil_onboarding', {});
      genre = profil.genre || 'homme';
      lieu  = profil.lieu  || 'salle';
    } catch(e) {}

    // Filtrer les exercices selon lieu
    const tousExos = Object.entries(window.EXERCICES||{});
    const exosFiltres = tousExos.filter(([, ex]) => {
      if (!ex.lieux) return true;
      if (lieu === 'salle') return true; // Salle = tout disponible
      return ex.lieux.includes(lieu) || ex.lieux.includes('maison');
    });

    const modal = document.createElement('div');
    modal.id    = 'modal-circuit-exo';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:1000;
      background:rgba(9,9,45,0.92);
      display:flex;align-items:flex-end;
      padding:var(--space-md);`;

    modal.innerHTML = `
      <div style="width:100%;max-width:480px;margin:0 auto;
                  background:var(--bg-card);
                  border-radius:var(--radius-lg);overflow:hidden;
                  max-height:80vh;display:flex;
                  flex-direction:column">
        <div style="padding:var(--space-md);
                    border-bottom:1px solid var(--border-color);
                    display:flex;justify-content:space-between;
                    align-items:center">
          <div style="font-weight:700">
            Choisir un exercice
            ${lieu !== 'salle'
              ? `<span style="font-size:.65rem;
                             color:var(--fd-mint);
                             margin-left:4px">
                   (${lieu === 'maison' ? '🏠 Maison' : '🌳 Dehors'})
                 </span>`
              : ''}
          </div>
          <button onclick="document.getElementById(
                    'modal-circuit-exo').remove()"
                  style="background:none;border:none;
                         font-size:1.2rem;cursor:pointer;
                         color:var(--text-muted)">✕</button>
        </div>
        <!-- Recherche -->
        <div style="padding:8px var(--space-md);
                    border-bottom:1px solid var(--border-color)">
          <input type="text"
                 placeholder="🔍 Rechercher..."
                 style="width:100%;padding:8px 12px;
                        background:var(--bg-input);
                        border:1px solid var(--border-color);
                        border-radius:var(--radius-md);
                        color:var(--text-primary);
                        font-size:.82rem;outline:none"
                 oninput="(() => {
                   const q = this.value.toLowerCase();
                   document.querySelectorAll('.circuit-exo-item')
                     .forEach(item => {
                       item.style.display =
                         item.textContent.toLowerCase().includes(q)
                           ? '' : 'none';
                     });
                 })()"/>
        </div>
        <div style="overflow-y:auto;flex:1">
          ${exosFiltres.map(([ref, ex]) => `
            <div class="circuit-exo-item"
                 onclick="Circuit._ajouterExerciceRef('${ref}');
                          document.getElementById(
                            'modal-circuit-exo').remove()"
                 style="display:flex;align-items:center;gap:12px;
                        padding:var(--space-sm) var(--space-md);
                        cursor:pointer;
                        border-bottom:1px solid var(--border-color)"
                 onmouseover="this.style.background='rgba(75,75,249,0.1)'"
                 onmouseout="this.style.background='transparent'">
              <span style="font-size:1.3rem">${ex.emoji||'💪'}</span>
              <div>
                <div style="font-weight:600;font-size:.88rem">
                  ${ex.nom}
                </div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  ${ex.muscle||''}
                  ${ex.lieux?.includes('maison') ? '🏠' : ''}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
  },

  _ajouterExerciceRef(ref) {
    this._exercicesConfig.push({ ref });
    const liste = document.getElementById('circuit-exercices-list');
    if (liste) liste.innerHTML = this._renderExercicesConfig(
      this._exercicesConfig
    );
  },

  _retirerExercice(idx) {
    this._exercicesConfig.splice(idx, 1);
    const liste = document.getElementById('circuit-exercices-list');
    if (liste) liste.innerHTML = this._renderExercicesConfig(
      this._exercicesConfig
    );
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
      id:              'circuit_' + Date.now(),
      mode:            modeId,
      nom:             document.getElementById('cfg-nom')?.value
                       || `Circuit ${modeId}`,
      date:            Utils.aujourd_hui(),
      exercices:       [...this._exercicesConfig],
      travail:         parseInt(
        document.getElementById('cfg-travail')?.value) || 30,
      repos:           parseInt(
        document.getElementById('cfg-repos')?.value)   || 15,
      rounds:          parseInt(
        document.getElementById('cfg-rounds')?.value)  || 3,
      reposCircuit:    parseInt(
        document.getElementById('cfg-repos-circuit')?.value) || 60,
      tempsTotalAMRAP: (parseInt(
        document.getElementById('cfg-temps-total')?.value) || 10) * 60
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
    this._configSauvegarde = JSON.parse(JSON.stringify(config));
    this._config           = config;
    this._exoActuel        = 0;
    this._roundActuel      = 1;
    this._phase            = 'travail';
    this._enPause          = false;
    this._debutCircuit     = Date.now(); // ✅ NOUVEAU v2.0
    this._minuteEMOM       = 1;         // ✅ NOUVEAU v2.0
    this._roundsAMRAP      = 0;         // ✅ NOUVEAU v2.0

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
    const exoSuiv    = exoSuivant
      ? (window.EXERCICES||{})[exoSuivant.ref]||{} : null;
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

    const progressPct = config.mode === 'amrap'
      ? Math.round(
          (1 - this._tempsRestant / config.tempsTotalAMRAP) * 100
        )
      : Math.round(
          ((this._exoActuel + (this._roundActuel-1) * totalEx) /
           (totalEx * config.rounds)) * 100
        );

    // ✅ NOUVEAU v2.0 — Durée écoulée
    const dureeEcoulee = this._debutCircuit
      ? Math.floor((Date.now() - this._debutCircuit) / 1000)
      : 0;

    player.innerHTML = `
      <!-- Header -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                  border-color:var(--fd-indigo)">
        <div class="flex justify-between items-center">
          <div>
            <div style="font-size:.72rem;color:var(--fd-indigo);
                        font-weight:700;text-transform:uppercase">
              ${mode?.emoji} ${mode?.nom}
            </div>
            <div style="font-weight:700;font-size:.95rem;margin-top:2px">
              ${config.nom}
            </div>
          </div>
          <button onclick="Circuit._retourSelection()"
                  style="padding:6px 12px;
                         background:rgba(255,141,150,0.15);
                         border:1px solid rgba(255,141,150,0.3);
                         border-radius:var(--radius-full);
                         color:var(--fd-coral);
                         font-size:.72rem;font-weight:600;
                         cursor:pointer">
            ✕ Arrêter
          </button>
        </div>
        <div style="margin-top:var(--space-sm)">
          <div class="flex justify-between"
               style="font-size:.68rem;color:var(--text-muted);
                      margin-bottom:4px">
            ${config.mode === 'amrap' ? `
              <span>⏱ ${Utils.formatDureeMin(this._tempsRestant)}</span>
              <span>🔄 ${this._roundsAMRAP} rounds complétés</span>` :
              config.mode === 'emom' ? `
              <span>⏰ Minute ${this._minuteEMOM} / ${config.rounds}</span>
              <span>Exo ${this._exoActuel + 1} / ${totalEx}</span>` : `
              <span>Round ${this._roundActuel} / ${config.rounds}</span>
              <span>Exo ${this._exoActuel + 1} / ${totalEx}</span>`}
          </div>
          <div style="height:4px;background:var(--bg-input);
                      border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${progressPct}%;
                        background:var(--fd-indigo);
                        border-radius:99px;transition:width .3s">
            </div>
          </div>
          <div style="font-size:.62rem;color:var(--text-muted);
                      margin-top:4px;text-align:right">
            ⏱ Écoulé : ${Utils.formatDuree(dureeEcoulee)}
          </div>
        </div>
      </div>

      <!-- Timer cercle -->
      <div class="card mb-md"
           style="text-align:center;
                  border-color:${phaseColor};
                  background:${phaseColor}11">
        <div style="font-size:.85rem;font-weight:700;
                    color:${phaseColor};
                    text-transform:uppercase;
                    letter-spacing:.1em;
                    margin-bottom:var(--space-sm)">
          ${phaseLabel}
        </div>

        <div style="position:relative;width:180px;height:180px;
                    margin:0 auto var(--space-md)">
          <svg width="180" height="180"
               style="transform:rotate(-90deg)">
            <circle cx="90" cy="90" r="80" fill="none"
                    stroke="var(--bg-input)" stroke-width="10"/>
            <circle cx="90" cy="90" r="80" fill="none"
                    stroke="${phaseColor}" stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 80}"
                    stroke-dashoffset="${2 * Math.PI * 80 *
                      (1 - this._getProgression())}"
                    id="circle-timer"
                    style="transition:stroke-dashoffset .9s linear"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);
                      text-align:center">
            <div id="timer-display"
                 style="font-size:3rem;font-weight:800;
                        color:${phaseColor};
                        font-variant-numeric:tabular-nums;
                        line-height:1">
              ${config.mode === 'amrap'
                ? Utils.formatDureeMin(this._tempsRestant)
                : this._tempsRestant}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${config.mode === 'amrap' ? 'restant' : 'secondes'}
            </div>
          </div>
        </div>

        <!-- Exercice actuel -->
        <div style="font-size:2.5rem;margin-bottom:4px">
          ${exo.emoji||'💪'}
        </div>
        <div style="font-size:1.2rem;font-weight:800;margin-bottom:4px">
          ${exo.nom||exoActuel?.ref||'Exercice'}
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          ${exo.muscle||''}
        </div>

        ${exoSuiv && this._phase === 'travail' ? `
          <div style="margin-top:var(--space-sm);
                      padding:var(--space-xs) var(--space-md);
                      background:var(--bg-input);
                      border-radius:var(--radius-full);
                      font-size:.72rem;color:var(--text-muted)">
            Suivant : ${exoSuiv.emoji||'💪'} ${exoSuiv.nom||''}
          </div>` : ''}

        <!-- ✅ NOUVEAU v2.0 — AMRAP compteur rounds -->
        ${config.mode === 'amrap' ? `
          <div style="margin-top:var(--space-md);
                      display:flex;align-items:center;
                      justify-content:center;gap:16px">
            <div style="text-align:center">
              <div style="font-size:1.8rem;font-weight:800;
                          color:var(--fd-mint)">
                ${this._roundsAMRAP}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                Rounds
              </div>
            </div>
            <button onclick="Circuit._comptabiliserRoundAMRAP()"
                    style="padding:10px 20px;
                           background:var(--fd-mint);
                           border:none;
                           border-radius:var(--radius-full);
                           color:#09092d;font-weight:700;
                           font-size:.82rem;cursor:pointer">
              ✅ +1 Round
            </button>
          </div>` : ''}
      </div>

      <!-- Contrôles -->
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:var(--space-sm);margin-bottom:var(--space-md)">
        <button id="btn-pause-circuit" onclick="Circuit._togglePause()"
                class="btn-secondary"
                style="font-size:.9rem;padding:var(--space-md)">
          ${this._enPause ? '▶ Reprendre' : '⏸ Pause'}
        </button>
        <button onclick="Circuit._passerPhase()"
                class="btn-primary"
                style="font-size:.9rem;padding:var(--space-md)">
          ⏭ Passer
        </button>
      </div>

      <!-- Conseils -->
      ${exo.conseils?.length ? `
        <div class="card"
             style="border-left:3px solid ${phaseColor}">
          <div style="font-size:.65rem;font-weight:700;
                      color:${phaseColor};
                      text-transform:uppercase;margin-bottom:4px">
            💡 Conseils
          </div>
          ${exo.conseils.slice(0,2).map(c => `
            <div style="font-size:.75rem;
                        color:var(--text-secondary);
                        margin-bottom:2px">• ${c}</div>
          `).join('')}
        </div>` : ''}
    `;
  },

  // ✅ NOUVEAU v2.0 — AMRAP : comptabiliser un round
  _comptabiliserRoundAMRAP() {
    this._roundsAMRAP++;
    this._exoActuel = 0; // Reset exercice
    Utils.vibrer([50]);
    Utils.toast(
      `♾️ Round ${this._roundsAMRAP} complété !`,
      'success', 1500
    );
    this._renderPlayer();
  },

  _getProgression() {
    const config = this._config;
    if (!config) return 0;

    if (config.mode === 'amrap') {
      return this._tempsRestant / config.tempsTotalAMRAP;
    }

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

      // Update léger sans re-render
      const disp = document.getElementById('timer-display');
      if (disp) {
        disp.textContent = this._config?.mode === 'amrap'
          ? Utils.formatDureeMin(Math.max(0, this._tempsRestant))
          : Math.max(0, this._tempsRestant);
      }

      const circle = document.getElementById('circle-timer');
      if (circle) {
        const prog   = this._getProgression();
        const offset = 2 * Math.PI * 80 * (1 - prog);
        circle.style.strokeDashoffset = offset;
      }

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

    // ✅ NOUVEAU v2.0 — AMRAP : fin du temps
    if (config.mode === 'amrap') {
      this._finCircuit();
      return;
    }

    // ✅ NOUVEAU v2.0 — EMOM : logique minute
    if (config.mode === 'emom') {
      if (this._minuteEMOM < config.rounds) {
        this._minuteEMOM++;
        this._exoActuel    = (this._exoActuel + 1) % totalEx;
        this._phase        = 'travail';
        this._tempsRestant = config.travail;
        this._renderPlayer();
        this._lancerTimer();
      } else {
        this._finCircuit();
      }
      return;
    }

    // Circuit standard
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
    if (btn) btn.textContent = this._enPause
      ? '▶ Reprendre' : '⏸ Pause';
    Utils.vibrer([50]);
  },

  _arreterPlayer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this._enPause = false;
  },

  // ✅ NOUVEAU v2.0 — _finCircuit avec stats Tracker
  _finCircuit() {
    this._arreterPlayer();

    const config       = this._configSauvegarde;
    const player       = document.getElementById('circuit-player');
    if (!player) return;

    // ✅ Calculer durée réelle
    const dureeReelle = this._debutCircuit
      ? Math.floor((Date.now() - this._debutCircuit) / 1000)
      : 0;

    // ✅ XP selon mode + rounds
    const xpBase = {
      circuit: 80,
      hiit:    100,
      tabata:  120,
      amrap:   100 + this._roundsAMRAP * 10,
      emom:    90
    }[config?.mode||'circuit'] || 80;

    const xpFinal = Math.round(xpBase * Math.max(1, (config?.rounds||1) / 3));

    try { Gamification.ajouterXP(xpFinal, 'Circuit terminé'); } catch(e) {}
    try { Gamification.recompenser('CIRCUIT_COMPLETE');        } catch(e) {}

    // ✅ NOUVEAU v2.0 — Enregistrer dans Tracker comme séance
    try {
      const seanceId = 'circuit_' + Date.now();
      Tracker.terminerSeance(seanceId, {
        nom:         config?.nom || 'Circuit',
        mode:        config?.mode,
        duree:       dureeReelle,
        volumeTotal: 0,
        rounds:      config?.mode === 'amrap'
          ? this._roundsAMRAP
          : (config?.rounds || 1),
        nbExercices: config?.exercices?.length || 0
      });
    } catch(e) {}

    Utils.confetti(3000);
    Utils.vibrer([200,100,200,100,400]);

    player.innerHTML = `
      <div class="card mt-md"
           style="text-align:center;padding:var(--space-xl);
                  border-color:var(--fd-mint)">
        <div style="font-size:4rem;margin-bottom:var(--space-md)">
          🏆
        </div>
        <div style="font-size:1.5rem;font-weight:800;
                    color:var(--fd-mint);
                    margin-bottom:var(--space-sm)">
          Circuit terminé !
        </div>
        <div style="font-size:.88rem;color:var(--text-muted);
                    margin-bottom:var(--space-md)">
          ${config?.mode === 'amrap'
            ? `♾️ ${this._roundsAMRAP} rounds complétés !`
            : `${config?.rounds||0} rounds · ${config?.exercices?.length||0} exercices`}
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:var(--space-md)">
          <div style="background:rgba(75,75,249,0.1);
                      border:1px solid rgba(75,75,249,0.2);
                      border-radius:var(--radius-md);padding:10px">
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-indigo)">
              ${Utils.formatDuree(dureeReelle)}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              Durée
            </div>
          </div>
          <div style="background:rgba(139,240,187,0.1);
                      border:1px solid rgba(139,240,187,0.2);
                      border-radius:var(--radius-md);padding:10px">
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-mint)">
              ${config?.mode === 'amrap' ? this._roundsAMRAP : config?.rounds||0}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              Rounds
            </div>
          </div>
          <div style="background:rgba(249,239,119,0.1);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-md);padding:10px">
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-lemon)">
              +${xpFinal} XP
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              XP gagnés
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm)">
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
console.log('✅ Circuit.js v2.0 chargé — Prédéfinis + Femme + AMRAP+EMOM fix + Stats');
