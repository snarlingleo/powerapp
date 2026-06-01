/* ============================================================
   PowerApp — Recovery.js v1.0
   🧘 Module Récupération complet
   ✅ Stretching guidé
   ✅ Mobilité articulaire
   ✅ Score sommeil
   ✅ Massage / points de tension
   ✅ Plan récupération personnalisé
   ✅ Timer stretching
   ============================================================ */

'use strict';

const Recovery = {

  // ════════════════════════════════════════════════════════
  // DONNÉES STRETCHING
  // ════════════════════════════════════════════════════════
  STRETCHES: {
    // ── Pectoraux ──
    pec_porte: {
      id:      'pec_porte',
      nom:     'Étirement pectoraux à la porte',
      emoji:   '🚪',
      muscle:  'Pectoraux',
      duree:   30,
      sets:    2,
      desc:    'Positionne ton avant-bras contre le cadre de porte, tourne le corps vers l\'opposé.',
      conseils:['Maintiens 30 secondes chaque côté',
                'Sens l\'étirement sans douleur',
                'Respire profondément'],
      difficulte: 1,
      image:   '💪'
    },
    pec_sol: {
      id:      'pec_sol',
      nom:     'Ouverture thoracique au sol',
      emoji:   '🧘',
      muscle:  'Pectoraux / Épaules',
      duree:   45,
      sets:    2,
      desc:    'Allongé sur le dos, bras en croix. Laisse la gravité ouvrir ta poitrine.',
      conseils:['Relâche complètement les épaules',
                'Respiration abdominale'],
      difficulte: 1,
      image:   '🛏️'
    },

    // ── Dos ──
    dos_chat: {
      id:      'dos_chat',
      nom:     'Chat / Vache',
      emoji:   '🐱',
      muscle:  'Dos / Lombaires',
      duree:   60,
      sets:    3,
      desc:    'À 4 pattes, alterne flexion et extension de la colonne. 10 répétitions lentes.',
      conseils:['Mouvements lents et contrôlés',
                'Expire en arrondissant',
                'Inspire en cambrant'],
      difficulte: 1,
      image:   '🐈'
    },
    dos_enfant: {
      id:      'dos_enfant',
      nom:     'Posture de l\'enfant',
      emoji:   '🙇',
      muscle:  'Dos / Lombaires',
      duree:   60,
      sets:    2,
      desc:    'À genoux, assis sur les talons, bras tendus devant. Laisse le dos s\'étirer.',
      conseils:['Pousse les bras vers l\'avant',
                'Détends les épaules vers le sol'],
      difficulte: 1,
      image:   '🧘'
    },
    dos_pigeon: {
      id:      'dos_pigeon',
      nom:     'Rotation colonne vertébrale',
      emoji:   '🔄',
      muscle:  'Dos / Obliques',
      duree:   30,
      sets:    2,
      desc:    'Allongé sur le dos, genou plié croisé. Rotation douce de la colonne.',
      conseils:['Garde les épaules au sol',
                'Rotation progressive'],
      difficulte: 1,
      image:   '🔄'
    },

    // ── Épaules ──
    epaule_cross: {
      id:      'epaule_cross',
      nom:     'Étirement épaule croisé',
      emoji:   '✖️',
      muscle:  'Épaules / Deltoïdes',
      duree:   30,
      sets:    2,
      desc:    'Amène le bras tendu horizontalement devant toi, maintiens avec l\'autre bras.',
      conseils:['Garde l\'épaule basse',
                'Ne tourne pas le buste'],
      difficulte: 1,
      image:   '💪'
    },
    epaule_overhead: {
      id:      'epaule_overhead',
      nom:     'Étirement triceps / épaule overhead',
      emoji:   '🙆',
      muscle:  'Triceps / Épaules',
      duree:   30,
      sets:    2,
      desc:    'Bras levé, coude plié derrière la tête. Pousse doucement avec l\'autre main.',
      conseils:['Reste grand, ne te penche pas',
                'Sens l\'étirement dans le triceps'],
      difficulte: 1,
      image:   '🙆'
    },

    // ── Jambes ──
    quad_debout: {
      id:      'quad_debout',
      nom:     'Étirement quadriceps debout',
      emoji:   '🦵',
      muscle:  'Quadriceps',
      duree:   30,
      sets:    2,
      desc:    'Debout, attrape ton pied derrière toi. Garde les genoux alignés.',
      conseils:['Équilibre sur un appui',
                'Pousse le bassin vers l\'avant',
                'Garde le dos droit'],
      difficulte: 1,
      image:   '🦵'
    },
    ischio_sol: {
      id:      'ischio_sol',
      nom:     'Étirement ischio-jambiers au sol',
      emoji:   '🦿',
      muscle:  'Ischio-jambiers',
      duree:   45,
      sets:    2,
      desc:    'Assis jambes tendues, penche-toi vers l\'avant en gardant le dos droit.',
      conseils:['Fléchis depuis les hanches',
                'Pas depuis le dos',
                'Pieds fléchis'],
      difficulte: 2,
      image:   '🧘'
    },
    fessiers_pigeon: {
      id:      'fessiers_pigeon',
      nom:     'Posture du pigeon',
      emoji:   '🕊️',
      muscle:  'Fessiers / Hanches',
      duree:   60,
      sets:    2,
      desc:    'Genou avant plié au sol, jambe arrière tendue. Incline le buste vers l\'avant.',
      conseils:['30-60 secondes par côté',
                'Respire dans la tension',
                'Progressif'],
      difficulte: 3,
      image:   '🕊️'
    },
    mollets_mur: {
      id:      'mollets_mur',
      nom:     'Étirement mollets au mur',
      emoji:   '🧱',
      muscle:  'Mollets / Chevilles',
      duree:   30,
      sets:    2,
      desc:    'Mains au mur, jambe arrière tendue et talon au sol. Pousse le talon.',
      conseils:['Jambe arrière complètement tendue',
                'Pied parallèle au mur'],
      difficulte: 1,
      image:   '🦶'
    },

    // ── Hanches ──
    hanche_flexor: {
      id:      'hanche_flexor',
      nom:     'Étirement fléchisseurs de hanches',
      emoji:   '⚡',
      muscle:  'Hanches / Psoas',
      duree:   45,
      sets:    2,
      desc:    'En fente avant, genou arrière au sol. Pousse les hanches vers l\'avant.',
      conseils:['Bassin en rétroversion',
                'Garde le tronc droit',
                'Sens l\'étirement à l\'avant de la hanche'],
      difficulte: 2,
      image:   '🧎'
    },

    // ── Cou / Nuque ──
    cou_lateral: {
      id:      'cou_lateral',
      nom:     'Étirement latéral du cou',
      emoji:   '🫡',
      muscle:  'Cou / Trapèzes',
      duree:   30,
      sets:    2,
      desc:    'Incline doucement la tête vers l\'épaule. Peut amplifier avec la main.',
      conseils:['Mouvement doux et lent',
                'Garde l\'épaule basse',
                'Ne force pas'],
      difficulte: 1,
      image:   '🧠'
    },
    cou_rotation: {
      id:      'cou_rotation',
      nom:     'Rotation du cou',
      emoji:   '↩️',
      muscle:  'Cou',
      duree:   30,
      sets:    2,
      desc:    'Tourne lentement la tête de gauche à droite. 10 rotations douces.',
      conseils:['Pas de cercles complets',
                'Mouvements de gauche à droite uniquement'],
      difficulte: 1,
      image:   '🔄'
    }
  },

  // ════════════════════════════════════════════════════════
  // PROGRAMMES DE RÉCUPÉRATION
  // ════════════════════════════════════════════════════════
  PROGRAMMES: {
    full_body: {
      id:    'full_body',
      nom:   'Récupération Full Body',
      emoji: '🧘',
      duree: 15,
      desc:  'Programme complet post-séance',
      stretches: [
        'pec_porte','dos_chat','epaule_cross',
        'quad_debout','ischio_sol','mollets_mur',
        'hanche_flexor','dos_enfant'
      ]
    },
    upper_body: {
      id:    'upper_body',
      nom:   'Récupération Haut du Corps',
      emoji: '💪',
      duree: 10,
      desc:  'Pectoraux, dos, épaules',
      stretches: [
        'pec_porte','pec_sol','dos_chat',
        'epaule_cross','epaule_overhead','cou_lateral'
      ]
    },
    lower_body: {
      id:    'lower_body',
      nom:   'Récupération Bas du Corps',
      emoji: '🦵',
      duree: 12,
      desc:  'Jambes, hanches, fessiers',
      stretches: [
        'quad_debout','ischio_sol','fessiers_pigeon',
        'mollets_mur','hanche_flexor'
      ]
    },
    back_focus: {
      id:    'back_focus',
      nom:   'Décompression Dos',
      emoji: '🫁',
      duree: 8,
      desc:  'Soulager les douleurs de dos',
      stretches: [
        'dos_chat','dos_enfant','dos_pigeon',
        'hanche_flexor','cou_rotation'
      ]
    },
    express: {
      id:    'express',
      nom:   'Récupération Express',
      emoji: '⚡',
      duree: 5,
      desc:  '5 minutes essentielles',
      stretches: [
        'dos_chat','quad_debout',
        'hanche_flexor','epaule_cross'
      ]
    }
  },

  // ════════════════════════════════════════════════════════
  // POINTS DE TENSION (Massage)
  // ════════════════════════════════════════════════════════
  POINTS_TENSION: [
    {
      zone:    'Trapèzes',
      emoji:   '🎯',
      desc:    'Épaules tendues, nuque raide',
      technique:'Pression avec les pouces, cercles de 30s',
      cause:   'Stress, position bureau, développé'
    },
    {
      zone:    'Lombaires',
      emoji:   '🔵',
      desc:    'Bas du dos tendu',
      technique:'Rouleau mousse le long du dos, 2 minutes',
      cause:   'Squat, soulevé de terre, position assise'
    },
    {
      zone:    'Pectoraux',
      emoji:   '💢',
      desc:    'Poitrine serrée, épaules en avant',
      technique:'Balle de tennis sur le pec, pression 30s',
      cause:   'Développé couché, trop de poussée'
    },
    {
      zone:    'IT Band',
      emoji:   '📍',
      desc:    'Douleur latérale genou / cuisse',
      technique:'Rouleau mousse sur la face externe de la cuisse',
      cause:   'Course, squats, vélo'
    },
    {
      zone:    'Fléchisseurs hanches',
      emoji:   '⚡',
      desc:    'Hanches bloquées, douleur hanche',
      technique:'Balle sur le psoas, 60s par côté',
      cause:   'Position assise prolongée, squat lourd'
    },
    {
      zone:    'Mollets',
      emoji:   '🦶',
      desc:    'Mollets contractés, chevilles raides',
      technique:'Rouleau mousse sur mollets, 2 min par jambe',
      cause:   'Course, calf raises, vélo'
    }
  ],

  // ════════════════════════════════════════════════════════
  // ÉTAT LOCAL
  // ════════════════════════════════════════════════════════
  _timer:        null,
  _timerActif:   false,
  _timerSecondes:0,
  _stretchActif: null,
  _programmeActif: null,
  _indexActuel:  0,

  // ════════════════════════════════════════════════════════
  // RENDER PAGE PRINCIPALE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const scoreForme = this._getScoreForme();
    const sommeil    = this._getSommeil();
    const conseil    = this._getConseilJour();

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          🧘 MODULE RÉCUPÉRATION
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Récupération & Bien-être
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Étirements · Massage · Sommeil · Mobilité
        </p>
      </div>

      <!-- Score récupération -->
      <div class="card mb-md" style="
        background:linear-gradient(135deg,
          rgba(0,80,255,0.15),
          rgba(0,207,255,0.03)) !important;
        border-color:rgba(0,207,255,0.2) !important">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="position:relative;width:80px;height:80px;flex-shrink:0">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32"
                fill="none" stroke="rgba(0,80,200,0.15)"
                stroke-width="7"/>
              <circle cx="40" cy="40" r="32"
                fill="none" stroke="var(--cb1)"
                stroke-width="7"
                stroke-linecap="round"
                stroke-dasharray="${Math.round(201 * scoreForme / 100)} 201"
                transform="rotate(-90 40 40)"
                style="filter:drop-shadow(0 0 4px var(--cb1))"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;
                        align-items:center;justify-content:center;
                        font-family:'Orbitron',monospace;
                        font-size:1.1rem;font-weight:900;
                        color:var(--cb1)">
              ${scoreForme}
            </div>
          </div>
          <div style="flex:1">
            <div style="font-family:'Orbitron',monospace;
                        font-size:.58rem;letter-spacing:3px;
                        color:rgba(0,207,255,0.4);margin-bottom:4px">
              SCORE RÉCUPÉRATION
            </div>
            <div style="font-size:1rem;font-weight:800;margin-bottom:4px">
              ${this._getNiveauRecup(scoreForme)}
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);
                        line-height:1.5">
              ${conseil}
            </div>
          </div>
        </div>
      </div>

      <!-- Sommeil tracker -->
      ${this._renderSommeilCard(sommeil)}

      <!-- Tabs -->
      <div class="tabs-container mb-md">
        ${[
          {id:'programmes', label:'🧘 Programmes'},
          {id:'stretches',  label:'🤸 Exercices'},
          {id:'massage',    label:'💆 Massage'},
          {id:'mobilite',   label:'⚡ Mobilité'}
        ].map((t, i) => `
          <button class="tab-btn ${i===0?'active':''}"
                  onclick="Recovery._switchTab('${t.id}',this)">
            ${t.label}
          </button>`).join('')}
      </div>

      <!-- Tab Programmes -->
      <div id="recovery-tab-programmes">
        ${this._renderProgrammes()}
      </div>

      <!-- Tab Stretches -->
      <div id="recovery-tab-stretches" style="display:none">
        ${this._renderStretches()}
      </div>

      <!-- Tab Massage -->
      <div id="recovery-tab-massage" style="display:none">
        ${this._renderMassage()}
      </div>

      <!-- Tab Mobilité -->
      <div id="recovery-tab-mobilite" style="display:none">
        ${this._renderMobilite()}
      </div>

      <!-- Timer Modal -->
      <div id="recovery-timer-modal" class="hidden"
           style="position:fixed;inset:0;z-index:600;
                  background:rgba(0,0,0,0.9);
                  display:flex;align-items:center;
                  justify-content:center;
                  backdrop-filter:blur(12px)">
        <div style="text-align:center;padding:32px;
                    background:rgba(2,10,24,0.98);
                    border:1px solid rgba(0,207,255,0.2);
                    border-radius:24px;max-width:320px;
                    width:90%">
          <div id="rt-emoji" style="font-size:3rem;margin-bottom:8px">
            🧘
          </div>
          <div id="rt-nom"
               style="font-family:'Orbitron',monospace;
                      font-size:.75rem;letter-spacing:2px;
                      color:var(--cb1);margin-bottom:4px">
          </div>
          <div id="rt-muscle"
               style="font-size:.7rem;color:var(--text-muted);
                      margin-bottom:20px">
          </div>

          <!-- Cercle timer -->
          <div style="position:relative;width:160px;height:160px;
                      margin:0 auto 20px">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68"
                fill="none"
                stroke="rgba(0,80,200,0.15)"
                stroke-width="10"/>
              <circle id="rt-arc" cx="80" cy="80" r="68"
                fill="none"
                stroke="var(--cb1)"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="427"
                stroke-dashoffset="0"
                transform="rotate(-90 80 80)"
                style="filter:drop-shadow(0 0 8px var(--cb1));
                       transition:stroke-dashoffset .9s linear"/>
            </svg>
            <div style="position:absolute;inset:0;display:flex;
                        flex-direction:column;align-items:center;
                        justify-content:center">
              <div id="rt-display"
                   style="font-family:'Orbitron',monospace;
                          font-size:2.5rem;font-weight:900;
                          color:var(--cb1);
                          text-shadow:0 0 20px rgba(0,207,255,0.6);
                          line-height:1">
                0:30
              </div>
              <div style="font-size:.58rem;color:var(--text-muted);
                          letter-spacing:3px;margin-top:4px">
                SECONDES
              </div>
            </div>
          </div>

          <!-- Conseils -->
          <div id="rt-conseils"
               style="background:rgba(0,100,255,0.08);
                      border:1px solid rgba(0,207,255,0.15);
                      border-radius:12px;padding:10px 14px;
                      margin-bottom:16px;
                      font-size:.72rem;color:var(--text-muted);
                      line-height:1.6;text-align:left">
          </div>

          <!-- Controls -->
          <div style="display:flex;gap:8px">
            <button onclick="Recovery._pauseTimer()"
                    id="rt-pause-btn"
                    class="btn-secondary"
                    style="flex:1;font-size:.78rem;padding:10px">
              ⏸ Pause
            </button>
            <button onclick="Recovery._nextStretch()"
                    class="btn-primary"
                    style="flex:1;font-size:.78rem;padding:10px">
              ⏭ Suivant
            </button>
          </div>

          <button onclick="Recovery._stopTimer()"
                  style="margin-top:8px;width:100%;
                         padding:8px;background:none;
                         border:1px solid rgba(255,100,100,0.2);
                         border-radius:10px;
                         color:rgba(255,100,100,0.6);
                         font-size:.72rem;cursor:pointer">
            ✕ Arrêter
          </button>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // RENDER SOMMEIL
  // ════════════════════════════════════════════════════════
  _renderSommeilCard(sommeil) {
    return `
      <div class="card mb-md">
        <div class="card-label">😴 Suivi Sommeil</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:10px;margin-top:12px">
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:4px">
              Heures cette nuit
            </div>
            <input type="range" id="sleep-hours"
                   min="4" max="10" step="0.5"
                   value="${sommeil.heures}"
                   oninput="Recovery._updateSommeil()"
                   style="width:100%;accent-color:var(--cb1)">
            <div style="display:flex;justify-content:space-between;
                        font-size:.62rem;color:var(--text-muted)">
              <span>4h</span>
              <span id="sleep-val"
                    style="color:var(--cb1);font-weight:700">
                ${sommeil.heures}h
              </span>
              <span>10h</span>
            </div>
          </div>
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:4px">
              Qualité
            </div>
            <div style="display:flex;gap:4px">
              ${['😴','😐','🙂','😊','🌟'].map((e, i) => `
                <button onclick="Recovery._setSleepQuality(${i+1})"
                        id="sleep-q-${i+1}"
                        style="flex:1;padding:6px 2px;
                               font-size:1rem;
                               background:${sommeil.qualite === i+1
                                 ? 'rgba(0,100,255,0.2)'
                                 : 'rgba(0,20,60,0.3)'};
                               border:1px solid ${sommeil.qualite === i+1
                                 ? 'rgba(0,207,255,0.4)'
                                 : 'rgba(0,100,255,0.1)'};
                               border-radius:8px;cursor:pointer;
                               transition:all .2s">
                  ${e}
                </button>`).join('')}
            </div>
          </div>
        </div>

        <!-- Score sommeil -->
        <div style="margin-top:12px;padding:10px 12px;
                    background:${this._getSleepColor(sommeil)};
                    border-radius:10px;
                    font-size:.75rem;font-weight:600">
          ${this._getSleepMessage(sommeil)}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // RENDER PROGRAMMES
  // ════════════════════════════════════════════════════════
  _renderProgrammes() {
    return Object.values(this.PROGRAMMES).map(prog => `
      <div class="card mb-md" style="cursor:pointer"
           onclick="Recovery._lancerProgramme('${prog.id}')">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:52px;height:52px;border-radius:14px;
                      background:rgba(0,100,255,0.1);
                      border:1px solid rgba(0,207,255,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem;
                      flex-shrink:0">
            ${prog.emoji}
          </div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:.9rem;
                        margin-bottom:2px">
              ${prog.nom}
            </div>
            <div style="font-size:.7rem;color:var(--text-muted)">
              ${prog.desc}
            </div>
            <div style="display:flex;gap:8px;margin-top:6px">
              <span style="font-size:.62rem;color:var(--cb1);
                           background:rgba(0,100,255,0.1);
                           padding:2px 8px;border-radius:99px;
                           border:1px solid rgba(0,207,255,0.2)">
                ⏱ ${prog.duree} min
              </span>
              <span style="font-size:.62rem;color:var(--text-muted);
                           background:rgba(0,20,60,0.3);
                           padding:2px 8px;border-radius:99px;
                           border:1px solid rgba(0,100,255,0.1)">
                ${prog.stretches.length} exercices
              </span>
            </div>
          </div>
          <div style="color:rgba(0,207,255,0.3);font-size:1.2rem">
            ▶
          </div>
        </div>
      </div>`).join('');
  },

  // ════════════════════════════════════════════════════════
  // RENDER STRETCHES LIBRARY
  // ════════════════════════════════════════════════════════
  _renderStretches() {
    const muscles = [...new Set(
      Object.values(this.STRETCHES).map(s => s.muscle.split(' / ')[0])
    )];

    return `
      <!-- Filtres muscles -->
      <div class="muscle-filter-row mb-md">
        <button class="muscle-filter-btn active"
                onclick="Recovery._filtrerMuscle('tous',this)">
          Tous
        </button>
        ${muscles.map(m => `
          <button class="muscle-filter-btn"
                  onclick="Recovery._filtrerMuscle('${m}',this)">
            ${m}
          </button>`).join('')}
      </div>

      <!-- Liste -->
      <div id="stretches-list">
        ${Object.values(this.STRETCHES).map(s => `
          <div class="card mb-sm stretch-card"
               data-muscle="${s.muscle.split(' / ')[0]}"
               style="cursor:pointer"
               onclick="Recovery._lancerStretch('${s.id}')">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:1.8rem;width:40px;
                          text-align:center;flex-shrink:0">
                ${s.emoji}
              </div>
              <div style="flex:1">
                <div style="font-weight:700;font-size:.85rem">
                  ${s.nom}
                </div>
                <div style="font-size:.65rem;color:var(--cb1);
                            margin-top:2px">
                  ${s.muscle}
                </div>
                <div style="display:flex;gap:6px;margin-top:4px">
                  <span style="font-size:.6rem;
                               color:var(--text-muted)">
                    ⏱ ${s.duree}s × ${s.sets}
                  </span>
                  <span style="font-size:.6rem;
                               color:var(--text-muted)">
                    ${'●'.repeat(s.difficulte)}${'○'.repeat(3-s.difficulte)}
                  </span>
                </div>
              </div>
              <button style="padding:6px 12px;
                             background:rgba(0,100,255,0.1);
                             border:1px solid rgba(0,207,255,0.2);
                             border-radius:8px;font-size:.7rem;
                             color:var(--cb1);cursor:pointer">
                ▶
              </button>
            </div>
          </div>`).join('')}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // RENDER MASSAGE
  // ════════════════════════════════════════════════════════
  _renderMassage() {
    return `
      <div class="card mb-md" style="
        background:linear-gradient(135deg,
          rgba(191,127,255,0.08),
          rgba(123,0,255,0.03)) !important;
        border-color:rgba(191,127,255,0.2) !important">
        <div class="card-label" style="color:rgba(191,127,255,0.5) !important">
          💆 GUIDE AUTOMASSAGE
        </div>
        <p style="font-size:.78rem;color:var(--text-muted);
                  margin-top:8px;line-height:1.6">
          Utilise un rouleau mousse ou une balle de tennis
          pour relâcher les tensions musculaires.
          30 à 60 secondes par zone.
        </p>
      </div>

      ${this.POINTS_TENSION.map((pt, i) => `
        <div class="card mb-sm" style="cursor:pointer"
             onclick="Recovery._toggleMassageDetail(${i})">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:1.8rem;width:40px;
                        text-align:center;flex-shrink:0">
              ${pt.emoji}
            </div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:.88rem">
                ${pt.zone}
              </div>
              <div style="font-size:.68rem;color:var(--text-muted);
                          margin-top:2px">
                ${pt.desc}
              </div>
            </div>
            <div id="massage-chevron-${i}"
                 style="color:rgba(0,207,255,0.3);
                        transition:transform .2s;font-size:.9rem">
              ▼
            </div>
          </div>
          <div id="massage-detail-${i}"
               style="display:none;margin-top:12px;
                      padding:12px;
                      background:rgba(0,20,60,0.3);
                      border-radius:10px">
            <div style="font-size:.72rem;font-weight:700;
                        color:var(--cb1);margin-bottom:6px">
              🎯 Technique :
            </div>
            <div style="font-size:.75rem;color:var(--text-muted);
                        margin-bottom:8px;line-height:1.5">
              ${pt.technique}
            </div>
            <div style="font-size:.65rem;
                        color:rgba(255,215,0,0.6)">
              ⚠️ Causé par : ${pt.cause}
            </div>
          </div>
        </div>`).join('')}

      <!-- Outils recommandés -->
      <div class="card mt-md">
        <div class="card-label">🛠️ OUTILS RECOMMANDÉS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-top:12px">
          ${[
            { emoji:'🎯', nom:'Balle de tennis', desc:'Points précis' },
            { emoji:'🔵', nom:'Rouleau mousse', desc:'Grands muscles' },
            { emoji:'🧸', nom:'Balle lacrosse', desc:'Pression intense' },
            { emoji:'⚡', nom:'Pistolet massage', desc:'Récup rapide' }
          ].map(o => `
            <div style="padding:10px;
                        background:rgba(0,20,60,0.3);
                        border:1px solid rgba(0,100,255,0.1);
                        border-radius:10px;text-align:center">
              <div style="font-size:1.5rem;margin-bottom:4px">
                ${o.emoji}
              </div>
              <div style="font-size:.72rem;font-weight:700">
                ${o.nom}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${o.desc}
              </div>
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // RENDER MOBILITÉ
  // ════════════════════════════════════════════════════════
  _renderMobilite() {
    const exercices = [
      {
        emoji:  '🔄',
        nom:    'Rotations d\'épaules',
        desc:   '10 rotations avant + 10 arrière',
        duree:  '1 min',
        zone:   'Épaules'
      },
      {
        emoji:  '🌀',
        nom:    'Rotations de hanches',
        desc:   'Cercles larges, 10 de chaque côté',
        duree:  '1 min',
        zone:   'Hanches'
      },
      {
        emoji:  '↕️',
        nom:    'Squats profonds lents',
        desc:   '10 squats, descente 3s, tenue 2s',
        duree:  '2 min',
        zone:   'Hanches / Chevilles'
      },
      {
        emoji:  '🦴',
        nom:    'Rotations chevilles',
        desc:   '10 cercles chaque pied',
        duree:  '1 min',
        zone:   'Chevilles'
      },
      {
        emoji:  '🤸',
        nom:    'Pompes lentes mobilité',
        desc:   'Descente 4s, tenue bas 2s, montée 2s',
        duree:  '2 min',
        zone:   'Épaules / Poignets'
      },
      {
        emoji:  '🧎',
        nom:    'Fente avec rotation',
        desc:   'Fente avant, rotation du tronc × 5/côté',
        duree:  '2 min',
        zone:   'Hanches / Thoracique'
      },
      {
        emoji:  '🙆',
        nom:    'Ouverture thoracique',
        desc:   'Bras en croix, rotations lentes × 10',
        duree:  '1 min',
        zone:   'Thoracique'
      },
      {
        emoji:  '🦶',
        nom:    'Mobilité poignets',
        desc:   'Cercles, flexion, extension × 10',
        duree:  '1 min',
        zone:   'Poignets'
      }
    ];

    return `
      <div class="card mb-md" style="
        background:linear-gradient(135deg,
          rgba(139,240,187,0.08),
          rgba(0,207,255,0.03)) !important;
        border-color:rgba(139,240,187,0.2) !important">
        <div class="card-label"
             style="color:rgba(139,240,187,0.5) !important">
          ⚡ MOBILITÉ ARTICULAIRE
        </div>
        <p style="font-size:.75rem;color:var(--text-muted);
                  margin-top:6px;line-height:1.5">
          La mobilité prévient les blessures et améliore
          tes performances. 10 min/jour suffisent.
        </p>
      </div>

      ${exercices.map((ex, i) => `
        <div class="card mb-sm"
             style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:12px;
                      background:rgba(139,240,187,0.08);
                      border:1px solid rgba(139,240,187,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.3rem;
                      flex-shrink:0">
            ${ex.emoji}
          </div>
          <div style="flex:1">
            <div style="font-weight:700;font-size:.85rem">
              ${ex.nom}
            </div>
            <div style="font-size:.68rem;color:var(--text-muted);
                        margin-top:2px">
              ${ex.desc}
            </div>
            <div style="display:flex;gap:8px;margin-top:4px">
              <span style="font-size:.6rem;color:var(--fd-mint)">
                ⏱ ${ex.duree}
              </span>
              <span style="font-size:.6rem;color:var(--text-muted)">
                📍 ${ex.zone}
              </span>
            </div>
          </div>
          <button onclick="Recovery._lancerMobilite(${i},'${ex.nom}','${ex.emoji}')"
                  style="padding:6px 10px;
                         background:rgba(139,240,187,0.1);
                         border:1px solid rgba(139,240,187,0.2);
                         border-radius:8px;font-size:.7rem;
                         color:var(--fd-mint);cursor:pointer">
            ▶
          </button>
        </div>`).join('')}

      <!-- Programme mobilité quotidien -->
      <div class="card mt-md">
        <div class="card-label">📅 ROUTINE QUOTIDIENNE</div>
        <div style="margin-top:12px">
          ${[
            { moment:'🌅 Matin', desc:'Rotations épaules + hanches + chevilles', duree:'5 min' },
            { moment:'🏋️ Avant séance', desc:'Squats profonds + fentes + ouverture thoracique', duree:'8 min' },
            { moment:'🌙 Soir', desc:'Étirements doux + posture enfant + pigeon', duree:'10 min' }
          ].map(r => `
            <div style="padding:10px 0;
                        border-bottom:1px solid rgba(0,80,200,0.1)">
              <div style="display:flex;justify-content:space-between;
                          align-items:center">
                <div style="font-weight:700;font-size:.82rem">
                  ${r.moment}
                </div>
                <span style="font-size:.62rem;color:var(--cb1);
                             background:rgba(0,100,255,0.1);
                             padding:2px 8px;border-radius:99px">
                  ${r.duree}
                </span>
              </div>
              <div style="font-size:.7rem;color:var(--text-muted);
                          margin-top:3px">
                ${r.desc}
              </div>
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // TIMER STRETCHING
  // ════════════════════════════════════════════════════════
  _lancerStretch(stretchId) {
    const stretch = this.STRETCHES[stretchId];
    if (!stretch) return;

    this._stretchActif    = stretch;
    this._programmeActif  = null;
    this._timerSecondes   = stretch.duree;

    this._ouvrirTimerModal(stretch, stretch.duree);
    this._startTimer(stretch.duree);
  },

  _lancerProgramme(progId) {
    const prog = this.PROGRAMMES[progId];
    if (!prog) return;

    this._programmeActif = prog;
    this._indexActuel    = 0;

    const firstId      = prog.stretches[0];
    const firstStretch = this.STRETCHES[firstId];
    if (!firstStretch) return;

    this._stretchActif   = firstStretch;
    this._timerSecondes  = firstStretch.duree;

    this._ouvrirTimerModal(firstStretch, firstStretch.duree, 1, prog.stretches.length);
    this._startTimer(firstStretch.duree);

    Utils.toast(`🧘 Programme "${prog.nom}" démarré !`, 'success', 2000);
  },

  _lancerMobilite(idx, nom, emoji) {
    const duree = 60;
    this._stretchActif = {
      nom, emoji, duree,
      muscle: 'Mobilité',
      conseils: ['Mouvements lents et contrôlés',
                 'Amplitude maximale confortable']
    };
    this._programmeActif = null;
    this._ouvrirTimerModal(this._stretchActif, duree);
    this._startTimer(duree);
  },

  _ouvrirTimerModal(stretch, duree, current = 1, total = 1) {
    const modal = document.getElementById('recovery-timer-modal');
    if (!modal) return;

    document.getElementById('rt-emoji').textContent  = stretch.emoji || '🧘';
    document.getElementById('rt-nom').textContent    = stretch.nom;
    document.getElementById('rt-muscle').textContent =
      `${stretch.muscle}${total > 1 ? ` • ${current}/${total}` : ''}`;

    const conseils = document.getElementById('rt-conseils');
    if (conseils && stretch.conseils) {
      conseils.innerHTML = stretch.conseils
        .map(c => `<div>• ${c}</div>`).join('');
    }

    this._updateTimerDisplay(duree, duree);
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  },

  _startTimer(duree) {
    clearInterval(this._timer);
    this._timerActif   = true;
    this._timerSecondes = duree;
    const total         = duree;

    this._timer = setInterval(() => {
      if (!this._timerActif) return;

      this._timerSecondes--;
      this._updateTimerDisplay(this._timerSecondes, total);

      if (this._timerSecondes <= 0) {
        clearInterval(this._timer);
        this._onTimerFin();
      }
    }, 1000);
  },

  _updateTimerDisplay(secondes, total) {
    const display = document.getElementById('rt-display');
    const arc     = document.getElementById('rt-arc');

    if (display) {
      const m = Math.floor(secondes / 60);
      const s = secondes % 60;
      display.textContent = m > 0
        ? `${m}:${String(s).padStart(2,'0')}`
        : String(secondes);

      if (secondes <= 5) {
        display.style.color = '#ff6666';
      } else {
        display.style.color = 'var(--cb1)';
      }
    }

    if (arc && total > 0) {
      const pct    = secondes / total;
      const offset = 427 * (1 - pct);
      arc.style.strokeDashoffset = offset;
    }
  },

  _onTimerFin() {
    try { Utils.vibrer([200, 100, 200, 100, 400]); } catch(e) {}

    try {
      SeanceGuidee.parler('Étirement terminé !', true);
    } catch(e) {}

    // Programme → passer au suivant automatiquement
    if (this._programmeActif) {
      const prog = this._programmeActif;
      this._indexActuel++;

      if (this._indexActuel < prog.stretches.length) {
        setTimeout(() => {
          const nextId     = prog.stretches[this._indexActuel];
          const nextStretch = this.STRETCHES[nextId];
          if (!nextStretch) return;

          this._stretchActif  = nextStretch;
          this._timerSecondes = nextStretch.duree;
          this._ouvrirTimerModal(
            nextStretch, nextStretch.duree,
            this._indexActuel + 1, prog.stretches.length
          );
          this._startTimer(nextStretch.duree);

          Utils.toast(
            `⏭ ${nextStretch.nom}`,
            'info', 2000
          );
        }, 2000);

      } else {
        // Programme terminé !
        setTimeout(() => {
          this._stopTimer();
          Utils.toast(
            `🎉 Programme "${prog.nom}" terminé !`,
            'success', 3000
          );
          try { SeanceGuidee.parler('Excellent ! Programme terminé.', true); } catch(e) {}
        }, 1000);
      }
    } else {
      // Stretch simple → fermer après 2s
      setTimeout(() => this._stopTimer(), 2000);
    }
  },

  _pauseTimer() {
    this._timerActif = !this._timerActif;
    const btn = document.getElementById('rt-pause-btn');
    if (btn) {
      btn.textContent = this._timerActif ? '⏸ Pause' : '▶ Reprendre';
    }
  },

  _nextStretch() {
    clearInterval(this._timer);

    if (this._programmeActif) {
      this._indexActuel++;
      const prog = this._programmeActif;

      if (this._indexActuel < prog.stretches.length) {
        const nextId      = prog.stretches[this._indexActuel];
        const nextStretch = this.STRETCHES[nextId];
        if (!nextStretch) return;

        this._stretchActif  = nextStretch;
        this._timerSecondes = nextStretch.duree;
        this._ouvrirTimerModal(
          nextStretch, nextStretch.duree,
          this._indexActuel + 1, prog.stretches.length
        );
        this._startTimer(nextStretch.duree);
      } else {
        this._stopTimer();
        Utils.toast('🎉 Programme terminé !', 'success', 2000);
      }
    } else {
      this._stopTimer();
    }
  },

  _stopTimer() {
    clearInterval(this._timer);
    this._timerActif    = false;
    this._stretchActif  = null;
    this._programmeActif = null;

    const modal = document.getElementById('recovery-timer-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  },

  // ════════════════════════════════════════════════════════
  // HELPERS UI
  // ════════════════════════════════════════════════════════
  _switchTab(id, btn) {
    document.querySelectorAll('.tabs-container .tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    ['programmes','stretches','massage','mobilite'].forEach(t => {
      const el = document.getElementById(`recovery-tab-${t}`);
      if (el) el.style.display = t === id ? 'block' : 'none';
    });
  },

  _filtrerMuscle(muscle, btn) {
    document.querySelectorAll('.muscle-filter-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.stretch-card').forEach(card => {
      if (muscle === 'tous' || card.dataset.muscle === muscle) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  },

  _toggleMassageDetail(i) {
    const detail  = document.getElementById(`massage-detail-${i}`);
    const chevron = document.getElementById(`massage-chevron-${i}`);

    if (!detail) return;

    const open = detail.style.display === 'block';
    detail.style.display  = open ? 'none' : 'block';
    if (chevron) {
      chevron.style.transform = open ? '' : 'rotate(180deg)';
    }
  },

  _updateSommeil() {
    const val = document.getElementById('sleep-hours')?.value;
    const lbl = document.getElementById('sleep-val');
    if (lbl && val) lbl.textContent = `${val}h`;

    const data = this._getSommeil();
    data.heures = parseFloat(val);
    this._saveSommeil(data);
  },

  _setSleepQuality(q) {
    const data = this._getSommeil();
    data.qualite = q;
    this._saveSommeil(data);

    // Update UI
    for (let i = 1; i <= 5; i++) {
      const btn = document.getElementById(`sleep-q-${i}`);
      if (btn) {
        btn.style.background  = i === q
          ? 'rgba(0,100,255,0.2)' : 'rgba(0,20,60,0.3)';
        btn.style.borderColor = i === q
          ? 'rgba(0,207,255,0.4)' : 'rgba(0,100,255,0.1)';
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // DONNÉES & CALCULS
  // ════════════════════════════════════════════════════════
  _getScoreForme() {
    try {
      return Tracker.calculerScoreForme?.()?.score || 75;
    } catch(e) { return 75; }
  },

  _getSommeil() {
    try {
      return Utils.storage.get('ft_sommeil_today', {
        heures: 7.5, qualite: 3,
        date: Utils.aujourd_hui()
      });
    } catch(e) {
      return { heures: 7.5, qualite: 3 };
    }
  },

  _saveSommeil(data) {
    try {
      data.date = Utils.aujourd_hui();
      Utils.storage.set('ft_sommeil_today', data);
    } catch(e) {}
  },

  _getNiveauRecup(score) {
    if (score >= 85) return '🟢 Excellent — Prêt pour une séance intense';
    if (score >= 70) return '🟡 Bon — Séance modérée recommandée';
    if (score >= 55) return '🟠 Moyen — Récupération active conseillée';
    return '🔴 Faible — Repos ou étirements légers';
  },

  _getConseilJour() {
    const conseils = [
      'Hydrate-toi bien — 2L d\'eau minimum aujourd\'hui.',
      'Une bonne nuit de sommeil améliore les gains de 20%.',
      'Les étirements post-séance réduisent les courbatures.',
      'Le massage favorise la circulation et la récupération.',
      'Priorise les protéines dans les 30min post-entraînement.',
      'La mobilité quotidienne prévient les blessures à long terme.'
    ];
    const idx = new Date().getDate() % conseils.length;
    return conseils[idx];
  },

  _getSleepColor(sommeil) {
    const score = (sommeil.heures / 8) * 0.5 +
                  (sommeil.qualite / 5) * 0.5;
    if (score >= 0.8) return 'rgba(139,240,187,0.1)';
    if (score >= 0.6) return 'rgba(249,239,119,0.08)';
    return 'rgba(255,141,150,0.08)';
  },

  _getSleepMessage(sommeil) {
    const h = sommeil.heures;
    const q = sommeil.qualite;
    if (h >= 7.5 && q >= 4) return '😴 Excellent sommeil — Récupération optimale';
    if (h >= 6.5 && q >= 3) return '🙂 Bon sommeil — Récupération correcte';
    if (h >= 5.5) return '😐 Sommeil insuffisant — Récupération partielle';
    return '😴 Manque de sommeil — Évite les exercices intenses';
  }
};

window.Recovery = Recovery;
console.log('✅ Recovery.js v1.0 chargé');
