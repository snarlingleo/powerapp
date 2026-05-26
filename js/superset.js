/* ============================================================
   PowerApp — Superset.js v2.0
   Gestion complète des supersets en séance
   + Supersets femme + Maison + Fix signature
   ============================================================ */

const Superset = {

  TYPES: {
    antagoniste: {
      label:'Antagoniste', emoji:'🔄', repos:60,
      description:'Muscles opposés (ex: Pec + Dos)',
      avantage:'Récupération optimale entre exercices'
    },
    agoniste: {
      label:'Agoniste', emoji:'💪', repos:90,
      description:'Même groupe musculaire',
      avantage:'Fatigue maximale du muscle cible'
    },
    non_competitif: {
      label:'Non-compétitif', emoji:'⚡', repos:45,
      description:'Groupes différents non liés',
      avantage:'Gain de temps maximum'
    },
    pre_fatigue: {
      label:'Pré-fatigue', emoji:'🔥', repos:30,
      description:'Isolation avant composé',
      avantage:'Activation maximale du muscle cible'
    },
    tri_set: {
      label:'Tri-set', emoji:'🏆', repos:90,
      description:'3 exercices enchaînés',
      avantage:'Densité d\'entraînement maximale'
    }
  },

  PREDEFINIS: {
    pec_tri: [
      {
        id:'ss_pec_tri_1', nom:'Pec + Tri Classique',
        type:'agoniste', emoji:'💪',
        exercices:[
          {ref:'bench_press',        series:3, reps:'8-10', repos:0  },
          {ref:'ext_triceps_poulie', series:3, reps:'12',   repos:75 }
        ]
      },
      {
        id:'ss_pec_tri_2', nom:'Pec Haut + Dips',
        type:'agoniste', emoji:'🔥',
        exercices:[
          {ref:'incline_halteres', series:3, reps:'10',    repos:0  },
          {ref:'dips_triceps',     series:3, reps:'échec', repos:90 }
        ]
      }
    ],
    dos_bi: [
      {
        id:'ss_dos_bi_1', nom:'Dos + Biceps Pull',
        type:'agoniste', emoji:'🔗',
        exercices:[
          {ref:'lat_pulldown',  series:3, reps:'10-12', repos:0  },
          {ref:'curl_halteres', series:3, reps:'12',    repos:75 }
        ]
      },
      {
        id:'ss_dos_bi_2', nom:'Rowing + Curl Marteau',
        type:'agoniste', emoji:'💪',
        exercices:[
          {ref:'rowing_machine', series:3, reps:'12', repos:0  },
          {ref:'curl_marteau',   series:3, reps:'12', repos:75 }
        ]
      }
    ],
    epaules_bras: [
      {
        id:'ss_epaules_1', nom:'Épaules Ant + Post',
        type:'antagoniste', emoji:'🦅',
        exercices:[
          {ref:'elev_laterales', series:3, reps:'12-15', repos:0  },
          {ref:'face_pull',      series:3, reps:'15',    repos:60 }
        ]
      },
      {
        id:'ss_bras_1', nom:'Biceps + Triceps',
        type:'antagoniste', emoji:'🔄',
        exercices:[
          {ref:'curl_barre',         series:3, reps:'10', repos:0  },
          {ref:'ext_triceps_poulie', series:3, reps:'12', repos:60 }
        ]
      }
    ],
    jambes: [
      {
        id:'ss_jambes_1', nom:'Quad + Ischio',
        type:'antagoniste', emoji:'🦵',
        exercices:[
          {ref:'leg_extension', series:3, reps:'15',    repos:0  },
          {ref:'leg_curl',      series:3, reps:'12',    repos:75 }
        ]
      },
      {
        id:'ss_jambes_2', nom:'Pré-fatigue Jambes',
        type:'pre_fatigue', emoji:'🔥',
        exercices:[
          {ref:'leg_extension',  series:3, reps:'15',    repos:0  },
          {ref:'presse_cuisses', series:3, reps:'10-12', repos:90 }
        ]
      }
    ],
    full_body: [
      {
        id:'ss_full_1', nom:'Full Body Express',
        type:'non_competitif', emoji:'⚡',
        exercices:[
          {ref:'bench_press', series:3, reps:'10', repos:0  },
          {ref:'squat',       series:3, reps:'10', repos:90 }
        ]
      }
    ],

    // ✅ NOUVEAU v2.0 — Supersets FEMME (Lower Body)
    lower_body_femme: [
      {
        id:'ss_lower_femme_1', nom:'Fessiers + Ischio',
        type:'agoniste', emoji:'🍑',
        exercices:[
          {ref:'hip_thrust_sol', series:3, reps:'15',   repos:0  },
          {ref:'donkey_kick',    series:3, reps:'15/j', repos:60 }
        ]
      },
      {
        id:'ss_lower_femme_2', nom:'Fentes + Glute Kickback',
        type:'pre_fatigue', emoji:'🔥',
        exercices:[
          {ref:'fentes_bulgares', series:3, reps:'12/j', repos:0  },
          {ref:'clamshell',       series:3, reps:'15/j', repos:60 }
        ]
      },
      {
        id:'ss_lower_femme_3', nom:'Squat + Hip Thrust',
        type:'agoniste', emoji:'🦵',
        exercices:[
          {ref:'squat_poids_corps', series:3, reps:'20', repos:0  },
          {ref:'hip_thrust_sol',    series:3, reps:'20', repos:75 }
        ]
      }
    ],
    upper_body_femme: [
      {
        id:'ss_upper_femme_1', nom:'Épaules + Dos Femme',
        type:'antagoniste', emoji:'💪',
        exercices:[
          {ref:'elev_laterales', series:3, reps:'15', repos:0  },
          {ref:'inverted_row',   series:3, reps:'12', repos:60 }
        ]
      }
    ],
    core_femme: [
      {
        id:'ss_core_femme_1', nom:'Planche + Hip Thrust Sol',
        type:'non_competitif', emoji:'🔥',
        exercices:[
          {ref:'planche',        series:3, reps:'30s', repos:0  },
          {ref:'hip_thrust_sol', series:3, reps:'20',  repos:45 }
        ]
      },
      {
        id:'ss_core_femme_2', nom:'Abdos Complet',
        type:'tri_set', emoji:'🏆',
        exercices:[
          {ref:'crunch',        series:3, reps:'20',  repos:0  },
          {ref:'russian_twist', series:3, reps:'20',  repos:0  },
          {ref:'planche',       series:3, reps:'30s', repos:60 }
        ]
      }
    ],

    // ✅ NOUVEAU v2.0 — Supersets MAISON
    maison_push: [
      {
        id:'ss_maison_push_1', nom:'Pompes + Dips',
        type:'agoniste', emoji:'🏠',
        exercices:[
          {ref:'pompes',       series:3, reps:'max',   repos:0  },
          {ref:'dips_triceps', series:3, reps:'max',   repos:75 }
        ]
      },
      {
        id:'ss_maison_push_2', nom:'Pompes + Pike Push-up',
        type:'agoniste', emoji:'💪',
        exercices:[
          {ref:'pompes',      series:3, reps:'12', repos:0  },
          {ref:'pike_pushup', series:3, reps:'10', repos:60 }
        ]
      }
    ],
    maison_pull: [
      {
        id:'ss_maison_pull_1', nom:'Tractions + Inverted Row',
        type:'agoniste', emoji:'🔗',
        exercices:[
          {ref:'tractions',    series:3, reps:'max', repos:0  },
          {ref:'inverted_row', series:3, reps:'12',  repos:75 }
        ]
      },
      {
        id:'ss_maison_pull_2', nom:'Superman + Bird Dog',
        type:'non_competitif', emoji:'🦸',
        exercices:[
          {ref:'superman',  series:3, reps:'15',  repos:0  },
          {ref:'bird_dog',  series:3, reps:'12/c',repos:45 }
        ]
      }
    ],
    maison_legs: [
      {
        id:'ss_maison_legs_1', nom:'Squat Sauté + Hip Thrust',
        type:'non_competitif', emoji:'🦵',
        exercices:[
          {ref:'squat_saute',    series:3, reps:'15', repos:0  },
          {ref:'hip_thrust_sol', series:3, reps:'20', repos:60 }
        ]
      },
      {
        id:'ss_maison_legs_2', nom:'Fentes Bulgares + Donkey Kick',
        type:'agoniste', emoji:'🔥',
        exercices:[
          {ref:'fentes_bulgares', series:3, reps:'12/j', repos:0  },
          {ref:'donkey_kick',     series:3, reps:'15/j', repos:60 }
        ]
      }
    ]
  },

  _supersetActif: null,
  _serieActuelle: 1,
  _exoActuel:     0,
  _debut:         null,
  _seriesLog:     [],
  _rpeActuel:     null,

  // ════════════════════════════════════════════════════════
  // GETTERS
  // ════════════════════════════════════════════════════════
  getSupersets(seanceId) {
    const custom     = this._getCustom();
    const predef     = this.PREDEFINIS[seanceId] || [];
    const custSeance = custom.filter(s => s.seanceId === seanceId);
    return [...predef, ...custSeance];
  },

  // ✅ NOUVEAU v2.0 — Tous les supersets filtrés par genre + lieu
  getAllSupersets(genre = null, lieu = null) {
    const profil = (() => {
      try {
        return Utils.storage.get('ft_profil_onboarding', {});
      } catch(e) { return {}; }
    })();

    const g = genre || profil.genre || 'homme';
    const l = lieu  || profil.lieu  || 'salle';

    // Supersets selon genre + lieu
    const sets = [];

    if (l === 'maison' || l === 'dehors') {
      // Maison / Dehors
      sets.push(...(this.PREDEFINIS.maison_push || []));
      sets.push(...(this.PREDEFINIS.maison_pull || []));
      sets.push(...(this.PREDEFINIS.maison_legs || []));
      if (g === 'femme') {
        sets.push(...(this.PREDEFINIS.lower_body_femme || []));
        sets.push(...(this.PREDEFINIS.core_femme || []));
      }
    } else {
      // Salle
      sets.push(...(this.PREDEFINIS.pec_tri || []));
      sets.push(...(this.PREDEFINIS.dos_bi || []));
      sets.push(...(this.PREDEFINIS.epaules_bras || []));
      sets.push(...(this.PREDEFINIS.jambes || []));
      sets.push(...(this.PREDEFINIS.full_body || []));

      if (g === 'femme') {
        sets.push(...(this.PREDEFINIS.lower_body_femme || []));
        sets.push(...(this.PREDEFINIS.upper_body_femme || []));
        sets.push(...(this.PREDEFINIS.core_femme || []));
      }
    }

    // Ajouter customs
    sets.push(...this._getCustom());

    return sets;
  },

  getSupersetById(id) {
    for (const seance of Object.values(this.PREDEFINIS)) {
      const found = seance.find(s => s.id === id);
      if (found) return found;
    }
    return this._getCustom().find(s => s.id === id) || null;
  },

  // ════════════════════════════════════════════════════════
  // DÉMARRER
  // ════════════════════════════════════════════════════════
  demarrer(supersetId, seanceId) {
    const ss = this.getSupersetById(supersetId);
    if (!ss) return false;

    this._supersetActif = { ...ss, seanceId };
    this._serieActuelle = 1;
    this._exoActuel     = 0;
    this._debut         = Date.now();
    this._seriesLog     = [];
    return true;
  },

  isActif()          { return !!this._supersetActif; },
  getSupersetActif() { return this._supersetActif;   },

  getExoActuel() {
    if (!this._supersetActif) return null;
    return this._supersetActif.exercices[this._exoActuel];
  },

  getProgression() {
    if (!this._supersetActif) return null;
    const ss       = this._supersetActif;
    const nbSeries = ss.exercices[0]?.series || 3;
    return {
      serieActuelle: this._serieActuelle,
      totalSeries:   nbSeries,
      exoActuel:     this._exoActuel,
      totalExos:     ss.exercices.length,
      pct: Math.round(
        ((this._serieActuelle - 1) / nbSeries) * 100
      )
    };
  },

  // ════════════════════════════════════════════════════════
  // VALIDER SÉRIE
  // ════════════════════════════════════════════════════════
  validerSerie(seanceId, poids, reps, rpe = null) {
    if (!this._supersetActif) return null;

    const ss  = this._supersetActif;
    const exo = ss.exercices[this._exoActuel];
    if (!exo) return null;

    let result = { isPR:false };
    try {
      result = Tracker.sauvegarderSerie(
        seanceId, exo.ref,
        this._serieActuelle, reps, poids, rpe
      );
    } catch(e) {}

    this._seriesLog.push({
      exoRef: exo.ref,
      serie:  this._serieActuelle,
      exoIdx: this._exoActuel,
      poids, reps, rpe,
      isPR:   result.isPR,
      ts:     Date.now()
    });

    const nbExos   = ss.exercices.length;
    const nbSeries = ss.exercices[0]?.series || 3;

    if (this._exoActuel + 1 < nbExos) {
      this._exoActuel++;
      return {
        type:       'prochain_exo',
        exoSuivant: ss.exercices[this._exoActuel],
        repos:      0,
        isPR:       result.isPR
      };
    } else {
      if (this._serieActuelle < nbSeries) {
        this._serieActuelle++;
        this._exoActuel = 0;
        const typeSuperset = this.TYPES[ss.type];
        return {
          type:  'repos',
          repos: typeSuperset?.repos || 75,
          serie: this._serieActuelle,
          isPR:  result.isPR
        };
      } else {
        return {
          type:  'termine',
          isPR:  result.isPR,
          log:   this._seriesLog,
          duree: Math.floor((Date.now() - this._debut) / 1000)
        };
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // TERMINER
  // ════════════════════════════════════════════════════════
  terminer(seanceId) {
    if (!this._supersetActif) return null;

    const duree  = Math.floor((Date.now() - this._debut) / 1000);
    const volume = this._seriesLog.reduce(
      (acc,s) => acc + (s.poids||0)*(s.reps||0), 0
    );
    const prs    = this._seriesLog.filter(s => s.isPR).length;

    const log = {
      id:              this._supersetActif.id,
      nom:             this._supersetActif.nom,
      type:            this._supersetActif.type,
      seanceId,
      date:            Utils.aujourd_hui(),
      duree, volume, prs,
      series:          this._seriesLog,
      seriesCompletes: this._serieActuelle - 1
    };

    try {
      Utils.storage.set(
        `ft_superset_${seanceId}_${Date.now()}`, log
      );
    } catch(e) {}

    try { Gamification.recompenser('SUPERSET_COMPLETE'); } catch(e) {}

    const result    = { ...log };
    this._supersetActif = null;
    this._serieActuelle = 1;
    this._exoActuel     = 0;
    this._debut         = null;
    this._seriesLog     = [];

    return result;
  },

  annuler() {
    this._supersetActif = null;
    this._serieActuelle = 1;
    this._exoActuel     = 0;
    this._debut         = null;
    this._seriesLog     = [];
  },

  // ════════════════════════════════════════════════════════
  // CRÉER / MODIFIER / SUPPRIMER
  // ════════════════════════════════════════════════════════
  creer(data) {
    const custom = this._getCustom();
    const id     = 'custom_ss_' + Date.now();
    custom.push({
      id,
      nom:          data.nom       || 'Mon superset',
      type:         data.type      || 'non_competitif',
      emoji:        data.emoji     || '⚡',
      seanceId:     data.seanceId  || null,
      exercices:    data.exercices || [],
      custom:       true,
      dateCreation: Utils.aujourd_hui()
    });
    this._saveCustom(custom);
    return id;
  },

  modifier(id, data) {
    const custom = this._getCustom();
    const idx    = custom.findIndex(s => s.id === id);
    if (idx < 0) return false;
    custom[idx] = {
      ...custom[idx],
      nom:       data.nom       ?? custom[idx].nom,
      type:      data.type      ?? custom[idx].type,
      emoji:     data.emoji     ?? custom[idx].emoji,
      exercices: data.exercices ?? custom[idx].exercices
    };
    this._saveCustom(custom);
    return true;
  },

  supprimer(id) {
    const custom = this._getCustom().filter(s => s.id !== id);
    this._saveCustom(custom);
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE & STATS
  // ════════════════════════════════════════════════════════
  getHistorique(nbJours = 30) {
    const debut = Utils.ajouterJours(Utils.aujourd_hui(), -nbJours);
    const hist  = [];

    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (!cle?.startsWith('ft_superset_')) continue;
      try {
        const data = JSON.parse(localStorage.getItem(cle));
        if ((data.date||'') >= debut) hist.push(data);
      } catch(e) {}
    }

    return hist.sort(
      (a,b) => (b.date||'').localeCompare(a.date||'')
    );
  },

  getStats() {
    const hist  = this.getHistorique(90);
    const types = {};
    hist.forEach(s => { types[s.type] = (types[s.type]||0) + 1; });
    return {
      total:  hist.length,
      volume: hist.reduce((a,s) => a + (s.volume||0), 0),
      prs:    hist.reduce((a,s) => a + (s.prs||0), 0),
      types
    };
  },

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-supersets')
      || document.getElementById('stats-content')
      || document.getElementById('page-content');
  },

  render(container, seanceId = null) {
    if (!container) return;

    // ✅ NOUVEAU v2.0 — Utiliser getAllSupersets() si pas de seanceId
    const supersets = seanceId
      ? this.getSupersets(seanceId)
      : this.getAllSupersets();

    const stats = this.getStats();

    // ✅ Genre + Lieu pour info
    let genre = 'homme', lieu = 'salle';
    try {
      const profil = Utils.storage.get('ft_profil_onboarding', {});
      genre = profil.genre || 'homme';
      lieu  = profil.lieu  || 'salle';
    } catch(e) {}

    container.innerHTML = `

      <!-- Stats rapides -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lavender)">
            ${stats.total}</span>
          <span class="stat-label">Supersets</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${Utils.formatVolume(stats.volume)}</span>
          <span class="stat-label">Volume total</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${stats.prs}</span>
          <span class="stat-label">PRs en SS</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-indigo)">
            ${Object.keys(stats.types).length}</span>
          <span class="stat-label">Types utilisés</span>
        </div>
      </div>

      <!-- Guide types -->
      <div class="card mb-md">
        <div class="card-label">📚 Types de supersets</div>
        <div style="margin-top:var(--space-sm)">
          ${Object.entries(this.TYPES).map(([key, type]) => `
            <div style="display:flex;gap:var(--space-md);
                        padding:var(--space-sm) 0;
                        border-bottom:1px solid var(--border-color)">
              <span style="font-size:1.2rem">${type.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:700">
                  ${type.label}
                  <span style="font-size:.65rem;
                               color:var(--text-muted);
                               font-weight:400;margin-left:6px">
                    Repos : ${type.repos}s
                  </span>
                </div>
                <div style="font-size:.72rem;color:var(--text-muted)">
                  ${type.description}
                </div>
                <div style="font-size:.68rem;color:var(--fd-mint);
                            margin-top:2px">
                  ✅ ${type.avantage}
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Créer custom -->
      <button class="btn-secondary mb-md" style="width:100%"
              onclick="event.stopPropagation();
                       Superset.renderFormCreation(
                         document.getElementById('ss-form-container'),
                         '${seanceId||''}')">
        ➕ Créer un superset custom
      </button>
      <div id="ss-form-container"></div>

      <!-- Supersets disponibles -->
      <div class="section-title">
        ⚡ Supersets disponibles
        ${genre === 'femme' ? '🌸' : ''}
        ${lieu !== 'salle' ? `(${lieu === 'maison' ? '🏠' : '🌳'})` : ''}
        (${supersets.length})
      </div>

      ${supersets.length === 0 ? `
        <div class="card" style="text-align:center;
                                  padding:var(--space-xl)">
          <div style="font-size:2rem;
                      margin-bottom:var(--space-sm)">⚡</div>
          <p style="color:var(--text-muted);font-size:.88rem">
            Aucun superset pour cette séance.<br>
            Crée le tien !
          </p>
        </div>` :
        supersets.map(ss =>
          this._renderCard(ss, seanceId)
        ).join('')}
    `;
  },

  _renderCard(ss, seanceId = null) {
    const type     = this.TYPES[ss.type] || this.TYPES.non_competitif;
    const nbSeries = ss.exercices[0]?.series || 3;

    return `
      <div class="card mb-md"
           style="border-color:rgba(191,161,255,0.3)">
        <div class="flex justify-between items-center mb-md">
          <div>
            <div style="font-weight:700;font-size:.95rem">
              ${ss.emoji} ${ss.nom}
              ${ss.custom ? `
                <span style="font-size:.6rem;
                             color:var(--fd-lemon)">
                  ✏️ Custom
                </span>` : ''}
            </div>
            <div style="margin-top:4px">
              <span class="chip chip-lavender"
                    style="font-size:.62rem">
                ${type.emoji} ${type.label}
              </span>
              <span style="font-size:.65rem;
                           color:var(--text-muted);margin-left:6px">
                ${nbSeries} séries · Repos ${type.repos}s
              </span>
            </div>
          </div>
          <button onclick="event.stopPropagation();
                  (() => {
                    const sid = '${seanceId}'
                      || localStorage.getItem('ft_seance_active')
                      || localStorage.getItem('ft_timer_seance')
                      || 'libre';
                    Superset.lancerUI('${ss.id}', sid);
                  })();"
                  style="padding:var(--space-sm) var(--space-md);
                         background:var(--fd-indigo);color:white;
                         border:none;
                         border-radius:var(--radius-full);
                         font-size:.78rem;font-weight:700;
                         cursor:pointer">
            ▶ Lancer
          </button>
        </div>

        ${ss.exercices.map((ex, i) => {
          const exo = (window.EXERCICES||{})[ex.ref] || {};
          return `
            ${i > 0 ? `
              <div class="superset-connector">
                <span class="superset-connector-label">
                  + enchaîner
                </span>
              </div>` : ''}
            <div style="display:flex;justify-content:space-between;
                        align-items:center;padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        font-size:.82rem">
              <div>
                <span style="font-weight:600">
                  ${exo.emoji||'💪'} ${exo.nom||ex.ref}
                </span>
                <div style="font-size:.68rem;color:var(--fd-mint)">
                  ${exo.muscle||''}
                </div>
              </div>
              <span style="color:var(--fd-indigo);font-weight:700">
                ${ex.series}×${ex.reps}
              </span>
            </div>`;
        }).join('')}

        ${ss.custom ? `
          <div class="flex gap-sm mt-md">
            <button onclick="Superset.renderFormCreation(
                      document.getElementById('ss-form-container'),
                      '${seanceId||''}', '${ss.id}')"
                    class="btn-secondary btn-sm" style="flex:1">
              ✏️ Modifier
            </button>
            <button onclick="Superset._confirmerSuppression('${ss.id}')"
                    class="btn-secondary btn-sm"
                    style="flex:1;color:var(--fd-coral)">
              🗑️ Supprimer
            </button>
          </div>` : ''}
      </div>`;
  },

  renderFormCreation(container, seanceId = '', editId = '') {
    if (!container) return;

    const existant   = editId ? this.getSupersetById(editId) : null;
    const toutesExos = Object.entries(window.EXERCICES || {});
    const formId     = 'ssform_' + Date.now();

    window._ssFormId     = formId;
    window._ssLigneCount = existant?.exercices?.length || 2;

    container.innerHTML = `
      <div class="card mb-md"
           style="border-color:var(--fd-lavender)">
        <div class="card-label" style="color:var(--fd-lavender)">
          ${existant ? '✏️ Modifier' : '➕ Créer'} un superset
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);
                    margin:var(--space-md) 0">
          <div>
            <div class="input-label">Nom *</div>
            <input class="input" id="ss-nom"
                   placeholder="ex: Pec + Tri"
                   value="${existant?.nom||''}" />
          </div>
          <div>
            <div class="input-label">Emoji</div>
            <input class="input" id="ss-emoji"
                   placeholder="⚡" maxlength="2"
                   value="${existant?.emoji||'⚡'}" />
          </div>
        </div>

        <div class="input-label">Type</div>
        <select class="input mb-md" id="ss-type">
          ${Object.entries(this.TYPES).map(([k, v]) => `
            <option value="${k}"
              ${(existant?.type||'non_competitif')===k
                ? 'selected':''}>
              ${v.emoji} ${v.label} (repos ${v.repos}s)
            </option>`).join('')}
        </select>

        <div class="card-label mb-sm">🏋️ Exercices</div>
        <div id="ss-exos-list-${formId}">
          ${(existant?.exercices || [
            {ref:'', series:3, reps:'10', repos:0},
            {ref:'', series:3, reps:'12', repos:0}
          ]).map((ex, i) =>
            this._renderLigneExo(ex, i, toutesExos, formId)
          ).join('')}
        </div>

        <button class="btn-secondary mt-sm mb-md"
                style="width:100%;font-size:.82rem"
                onclick="Superset._ajouterLigneExo('${formId}')">
          ➕ Ajouter un exercice
        </button>

        <div class="flex gap-sm">
          <button class="btn-secondary" style="flex:1"
                  onclick="Superset._annulerForm()">
            ✕ Annuler
          </button>
          <button class="btn-primary" style="flex:1"
                  onclick="Superset._sauvegarderForm(
                    '${seanceId}','${editId}','${formId}')">
            💾 ${existant ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </div>`;

    container.scrollIntoView({ behavior:'smooth' });
  },

  _renderLigneExo(ex, idx, toutesExos, formId = '') {
    const uid = `${formId}_${idx}`;
    return `
      <div class="ss-exo-ligne" id="ss-exo-${uid}"
           data-idx="${uid}"
           style="display:grid;
                  grid-template-columns:1fr 50px 60px 32px;
                  gap:4px;margin-bottom:4px;align-items:center">
        <select class="input" id="ss-ref-${uid}"
                style="font-size:.75rem;padding:6px 4px">
          <option value="">-- Exercice --</option>
          ${(toutesExos||[]).map(([ref, e]) => `
            <option value="${ref}"
              ${ex.ref===ref?'selected':''}>
              ${e.emoji||''} ${e.nom||ref}
            </option>`).join('')}
        </select>
        <input class="input" id="ss-series-${uid}"
               type="number" placeholder="S."
               value="${ex.series||3}"
               style="font-size:.75rem;padding:6px 4px;
                      text-align:center"/>
        <input class="input" id="ss-reps-${uid}"
               type="text" placeholder="Reps"
               value="${ex.reps||'10'}"
               style="font-size:.75rem;padding:6px 4px;
                      text-align:center"/>
        <button onclick="Superset._supprimerLigneExo('${uid}')"
                style="background:none;border:none;
                       color:var(--fd-coral);font-size:1rem;
                       cursor:pointer">✕</button>
      </div>`;
  },

  _ajouterLigneExo(formId) {
    const idx  = window._ssLigneCount || 0;
    window._ssLigneCount = idx + 1;
    const list = document.getElementById(`ss-exos-list-${formId}`);
    if (!list) return;
    const div  = document.createElement('div');
    div.innerHTML = this._renderLigneExo(
      { ref:'', series:3, reps:'10' },
      idx,
      Object.entries(window.EXERCICES || {}),
      formId
    );
    list.appendChild(div.firstElementChild);
  },

  _supprimerLigneExo(uid) {
    document.getElementById(`ss-exo-${uid}`)?.remove();
  },

  _sauvegarderForm(seanceId, editId, formId) {
    const nom   = document.getElementById('ss-nom')
      ?.value?.trim();
    const emoji = document.getElementById('ss-emoji')
      ?.value?.trim() || '⚡';
    const type  = document.getElementById('ss-type')
      ?.value || 'non_competitif';

    if (!nom) {
      Utils.toast('Entre un nom !', 'error'); return;
    }

    const exercices = [];
    const listEl    = document.getElementById(
      `ss-exos-list-${formId}`
    );

    if (listEl) {
      listEl.querySelectorAll('.ss-exo-ligne').forEach(ligne => {
        const uid    = ligne.dataset.idx;
        const ref    = document.getElementById(
          `ss-ref-${uid}`
        )?.value;
        const series = parseInt(
          document.getElementById(`ss-series-${uid}`)?.value
        ) || 3;
        const reps   = document.getElementById(
          `ss-reps-${uid}`
        )?.value || '10';
        if (ref) exercices.push({ ref, series, reps, repos:0 });
      });
    }

    if (exercices.length < 2) {
      Utils.toast(
        'Un superset nécessite au moins 2 exercices !',
        'error'
      );
      return;
    }

    const data = {
      nom, emoji, type,
      seanceId: seanceId || null,
      exercices
    };

    if (editId) {
      this.modifier(editId, data);
      Utils.toast('✅ Superset modifié !', 'success');
    } else {
      this.creer(data);
      Utils.toast('✅ Superset créé !', 'success');
    }

    const formContainer = document.getElementById(
      'ss-form-container'
    );
    if (formContainer) formContainer.innerHTML = '';

    const container = this._getContainer();
    if (container) this.render(container, seanceId || null);
  },

  _annulerForm() {
    const container = document.getElementById('ss-form-container');
    if (container) container.innerHTML = '';
  },

  async _confirmerSuppression(id) {
    const ok = await Utils.confirmer(
      'Supprimer ce superset ?',
      'Cette action est irréversible.'
    );
    if (!ok) return;
    this.supprimer(id);
    Utils.toast('Superset supprimé.', 'info');
    const container = this._getContainer();
    if (container) this.render(container);
  },

  // ════════════════════════════════════════════════════════
  // UI SUPERSET EN SÉANCE LIVE
  // ════════════════════════════════════════════════════════
  lancerUI(ssId, seanceId) {
    const ok = this.demarrer(ssId, seanceId);
    if (!ok) {
      Utils.toast('Superset introuvable !', 'error');
      return;
    }

    if (!document.getElementById('modal-info')) {
      const modal    = document.createElement('div');
      modal.id       = 'modal-info';
      modal.dataset.dynamic = 'true';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content" style="position:relative">
          <button id="modal-info-close"
                  style="position:absolute;top:12px;right:12px;
                         background:none;border:none;
                         color:var(--text-muted);font-size:1.4rem;
                         cursor:pointer;z-index:10">✕</button>
          <div id="modal-info-content"></div>
        </div>`;
      document.body.appendChild(modal);
    }

    Utils.toast(
      `⚡ Superset lancé : ${this._supersetActif.nom}`,
      'info', 2000
    );
    this._renderUIActif(seanceId);
  },

  _renderUIActif(seanceId) {
    const ss = this._supersetActif;
    if (!ss) return;

    const exo     = this.getExoActuel();
    const prog    = this.getProgression();
    const exoData = (window.EXERCICES||{})[exo?.ref] || {};
    const type    = this.TYPES[ss.type] || {};

    let pr = null, derniere = null;
    try { pr       = Tracker.getPR(exo?.ref);                    } catch(e) {}
    try { derniere = Tracker.getDernierePerf(seanceId, exo?.ref); } catch(e) {}

    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="text-align:center;margin-bottom:var(--space-md)">
        <div style="font-size:.72rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--fd-lavender)">
          ⚡ SUPERSET · ${ss.nom}
        </div>
        <div style="font-size:.7rem;color:var(--text-muted);
                    margin-top:4px">
          ${type.emoji||'⚡'} ${type.label||''}
          · Série ${prog.serieActuelle}/${prog.totalSeries}
        </div>
      </div>

      <!-- Barre progression séries -->
      <div style="display:flex;gap:4px;margin-bottom:var(--space-md)">
        ${Array.from({length:prog.totalSeries}, (_,i) => `
          <div style="flex:1;height:6px;border-radius:3px;
                      background:${
                        i+1 < prog.serieActuelle
                          ? 'var(--fd-mint)'
                          : i+1 === prog.serieActuelle
                            ? 'var(--fd-indigo)'
                            : 'var(--border-color)'
                      }">
          </div>`).join('')}
      </div>

      <!-- Exercices -->
      ${ss.exercices.map((ex, i) => {
        const e       = (window.EXERCICES||{})[ex.ref] || {};
        const isActif = i === this._exoActuel;
        const isDone  = i < this._exoActuel;
        return `
          <div style="padding:var(--space-sm);
                      border-radius:var(--radius-md);
                      background:${
                        isActif
                          ? 'rgba(75,75,249,0.15)'
                          : isDone
                            ? 'rgba(139,240,187,0.1)'
                            : 'var(--bg-input)'
                      };
                      border:1px solid ${
                        isActif ? 'var(--fd-indigo)'
                        : isDone ? 'var(--fd-mint)'
                        : 'var(--border-color)'
                      };
                      margin-bottom:4px;transition:all .3s">
            <div class="flex justify-between items-center">
              <span style="font-size:.88rem;font-weight:700;
                           color:${
                             isActif ? 'var(--fd-indigo)'
                             : isDone ? 'var(--fd-mint)'
                             : 'var(--text-muted)'
                           }">
                ${isDone ? '✅' : isActif ? '▶' : '○'}
                ${e.emoji||'💪'} ${e.nom||ex.ref}
              </span>
              <span style="font-size:.78rem;font-weight:600;
                           color:${isActif
                             ? 'var(--fd-indigo)'
                             : 'var(--text-muted)'}">
                ${ex.series}×${ex.reps}
              </span>
            </div>
          </div>`;
      }).join('')}

      <!-- Saisie poids / reps -->
      <div class="card mt-md mb-md">
        <div style="text-align:center;
                    margin-bottom:var(--space-md)">
          <div style="font-size:2.5rem">
            ${exoData.emoji||'💪'}
          </div>
          <div style="font-weight:700;font-size:1.1rem;margin-top:4px">
            ${exoData.nom||exo?.ref}
          </div>
          <div style="font-size:.75rem;color:var(--fd-mint)">
            ${exoData.muscle||''}
          </div>
          ${pr ? `
            <div style="font-size:.72rem;
                        color:var(--fd-lemon);margin-top:4px">
              🏆 PR: ${pr.poids}kg × ${pr.reps}
            </div>` : ''}
          ${derniere ? `
            <div style="font-size:.7rem;color:var(--text-muted)">
              Dernière: ${derniere.poids}kg × ${derniere.reps}
            </div>` : ''}
        </div>

        <div class="input-group mb-md">
          <div style="flex:1">
            <div class="input-label" style="text-align:center">
              Poids (kg)
            </div>
            <input class="input" id="ss-inp-poids" type="number"
                   value="${derniere?.poids||pr?.poids||''}"
                   placeholder="${pr?.poids||0}" step="2.5"/>
          </div>
          <div style="flex:1">
            <div class="input-label" style="text-align:center">
              Reps
            </div>
            <input class="input" id="ss-inp-reps" type="number"
                   value="${derniere?.reps||''}"
                   placeholder="${exo?.reps||10}"/>
          </div>
        </div>

        <!-- RPE -->
        <div style="margin-bottom:var(--space-md)">
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-bottom:6px;text-align:center">
            RPE (optionnel)
          </div>
          <div style="display:flex;gap:4px;justify-content:center">
            ${[6,7,8,9,10].map(v => `
              <button id="ss-rpe-${v}"
                      onclick="Superset._selRPE(${v})"
                      style="flex:1;padding:var(--space-sm) 2px;
                             border-radius:var(--radius-sm);
                             border:1px solid var(--border-color);
                             background:var(--bg-input);
                             color:var(--text-muted);
                             font-size:.78rem;font-weight:600;
                             cursor:pointer">
                ${v}
              </button>`).join('')}
          </div>
        </div>

        <!-- ✅ FIX v2.0 — Bouton lit poids depuis input -->
        <button class="btn-primary"
                onclick="(() => {
                  const poids = parseFloat(
                    document.getElementById('ss-inp-poids')?.value
                  ) || 0;
                  const reps  = parseInt(
                    document.getElementById('ss-inp-reps')?.value
                  ) || 0;
                  Superset._validerSerieUI('${seanceId}', poids, reps);
                })()">
          ✅ Valider · ${exoData.nom||exo?.ref}
          <span style="font-size:.8rem;opacity:.8">
            (${this._exoActuel+1}/${ss.exercices.length})
          </span>
        </button>
      </div>

      <button class="btn-secondary"
              style="width:100%;font-size:.82rem"
              onclick="Superset._annulerUI()">
        ✕ Abandonner le superset
      </button>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => {
      this.annuler();
      modal.classList.add('hidden');
    };
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.onclick = null;
  },

  _selRPE(val) {
    this._rpeActuel = val;
    [6,7,8,9,10].forEach(v => {
      const btn = document.getElementById(`ss-rpe-${v}`);
      if (!btn) return;
      btn.style.background  = v === val
        ? 'var(--fd-indigo)' : 'var(--bg-input)';
      btn.style.color       = v === val
        ? 'white' : 'var(--text-muted)';
      btn.style.borderColor = v === val
        ? 'var(--fd-indigo)' : 'var(--border-color)';
    });
  },

  // ✅ FIX v2.0 — Signature corrigée (poids et reps en paramètres)
  _validerSerieUI(seanceId, poids, reps) {
    if (!poids || !reps) {
      Utils.toast('Entre le poids et les reps !', 'error');
      return;
    }

    const result = this.validerSerie(
      seanceId, poids, reps, this._rpeActuel
    );
    this._rpeActuel = null;
    if (!result) return;

    Utils.vibrerSuccess();

    if (result.isPR) {
      try { timerRepos.jouerSon('pr'); } catch(e) {}
      Utils.toast(
        `🏆 NOUVEAU PR ! ${poids}kg × ${reps}`, 'pr', 3000
      );
    }

    switch(result.type) {

      case 'prochain_exo': {
        const modal = document.getElementById('modal-info');
        modal?.classList.add('hidden');

        const exoSuivant = result.exoSuivant;
        const repsTarget = parseInt(exoSuivant?.reps)
          || parseInt(exoSuivant?.reps?.split?.('-')?.[0])
          || 10;

        setTimeout(() => {
          if (typeof ChronoSerie !== 'undefined') {
            ChronoSerie.demarrerApresRepos(
              this._exoActuel,
              this._serieActuelle - 1,
              repsTarget,
              seanceId,
              this._supersetActif?.exercices[0]?.series || 3,
              this._supersetActif?.exercices?.length || 2,
              0,
              exoSuivant?.ref
            );
          } else {
            this._renderUIActif(seanceId);
          }
        }, 300);
        break;
      }

      case 'repos': {
        const modal      = document.getElementById('modal-info');
        modal?.classList.add('hidden');
        const reposDuree = result.repos || 75;

        if (typeof timerRepos !== 'undefined'
            && typeof LiveRapide !== 'undefined') {
          window._ssReposCallback = () => {
            this._renderUIActif(seanceId);
          };
          LiveRapide.lancerReposAuto(
            this._exoActuel,
            this._serieActuelle - 2,
            this._supersetActif?.exercices[0]?.series || 3,
            seanceId,
            reposDuree
          );
        } else {
          this._lancerReposSuperset(
            reposDuree, result.serie, seanceId
          );
        }
        break;
      }

      case 'termine': {
        const log   = this.terminer(seanceId);
        const modal = document.getElementById('modal-info');
        modal?.classList.add('hidden');
        Utils.confetti(2000);
        Utils.vibrer([200, 100, 200, 100, 300]);
        Utils.toast(
          `⚡ Superset terminé ! Volume : ${Utils.formatVolume(log?.volume||0)}`,
          'success', 4000
        );
        this._renderResumeSuperset(log);
        try { Gamification.ajouterXP(50, 'superset_complete'); } catch(e) {}
        break;
      }
    }
  },

  _lancerReposSuperset(secondes, serieSuivante, seanceId) {
    const overlay = document.createElement('div');
    overlay.id    = 'ss-repos-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:600;
      background:rgba(9,9,45,0.96);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      gap:var(--space-lg)`;

    overlay.innerHTML = `
      <div style="font-size:.9rem;font-weight:700;
                  color:var(--fd-lavender);
                  text-transform:uppercase;
                  letter-spacing:.1em">
        ⚡ Superset — Repos
      </div>
      <div style="font-size:5rem;font-weight:800;
                  color:var(--fd-lemon);
                  font-variant-numeric:tabular-nums"
           id="ss-repos-display">
        ${Utils.formatDureeMin(secondes)}
      </div>
      <div style="font-size:.82rem;color:var(--text-muted)">
        Série ${serieSuivante} commence après
      </div>
      <button onclick="
          timerRepos.arreter();
          document.getElementById('ss-repos-overlay')?.remove();
          Superset._renderUIActif('${seanceId}');"
              style="padding:var(--space-md) var(--space-xl);
                     background:var(--fd-indigo);border:none;
                     border-radius:var(--radius-full);color:white;
                     font-weight:700;font-size:.9rem;
                     cursor:pointer">
        ⏭ Passer le repos
      </button>`;

    document.body.appendChild(overlay);

    timerRepos.demarrer(
      secondes,
      (r) => {
        const el = document.getElementById('ss-repos-display');
        if (el) el.textContent = Utils.formatDureeMin(r);
      },
      () => {
        overlay.remove();
        this._renderUIActif(seanceId);
      }
    );
  },

  _annulerUI() {
    this.annuler();
    const modal = document.getElementById('modal-info');
    if (modal) {
      modal.classList.add('hidden');
      if (modal.dataset.dynamic === 'true') modal.remove();
    }
    Utils.toast('Superset abandonné.', 'info');
  },

  _renderResumeSuperset(log) {
    if (!log) return;

    const overlay = document.createElement('div');
    overlay.id    = 'ss-resume-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:700;
      background:rgba(9,9,45,0.97);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      gap:16px;padding:24px;text-align:center`;

    overlay.innerHTML = `
      <div style="font-size:3rem">⚡</div>
      <div style="font-size:1.2rem;font-weight:800;
                  color:var(--fd-lemon)">
        Superset terminé !
      </div>
      <div style="font-size:.85rem;color:var(--text-muted)">
        ${log.nom}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:12px;width:100%;max-width:320px;margin:8px 0">
        <div style="background:rgba(75,75,249,0.15);
                    border:1px solid rgba(75,75,249,0.3);
                    border-radius:12px;padding:12px">
          <div style="font-size:1.3rem;font-weight:800;
                      color:var(--fd-indigo)">
            ${log.seriesCompletes}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-top:2px">Séries</div>
        </div>
        <div style="background:rgba(139,240,187,0.1);
                    border:1px solid rgba(139,240,187,0.2);
                    border-radius:12px;padding:12px">
          <div style="font-size:1.3rem;font-weight:800;
                      color:var(--fd-mint)">
            ${Utils.formatVolume(log.volume||0)}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-top:2px">Volume</div>
        </div>
        <div style="background:rgba(249,239,119,0.1);
                    border:1px solid rgba(249,239,119,0.2);
                    border-radius:12px;padding:12px">
          <div style="font-size:1.3rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${log.prs > 0 ? `🏆${log.prs}` : '—'}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-top:2px">PRs</div>
        </div>
      </div>
      <div style="font-size:.78rem;color:var(--text-muted)">
        ⏱ Durée : ${Utils.formatDuree(log.duree||0)}
      </div>
      <button onclick="
          document.getElementById('ss-resume-overlay')?.remove();"
              style="margin-top:8px;padding:14px 32px;
                     background:var(--fd-indigo);border:none;
                     border-radius:99px;color:white;
                     font-weight:700;font-size:.95rem;
                     cursor:pointer">
        ✅ Continuer la séance
      </button>`;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 8000);
  },

  _getCustom()       { return Utils.storage.get('ft_supersets_custom', []); },
  _saveCustom(data)  { Utils.storage.set('ft_supersets_custom', data);      }
};

window.Superset = Superset;
console.log('✅ Superset.js v2.0 chargé — Femme + Maison + Fix signature');
