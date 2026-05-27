/* ============================================================
   PowerApp — HIIT v1.0
   ✅ Mode Tabata (20s effort / 10s repos)
   ✅ Mode AMRAP (As Many Rounds As Possible)
   ✅ Mode EMOM (Every Minute On the Minute)
   ✅ Mode Pyramidal (charge croissante/décroissante)
   ✅ Mode Personnalisé
   ✅ Timer visuel plein écran avec son
   ✅ Présets prêts à l'emploi
   ✅ Intégration XP + Stats
   ============================================================ */

const HIIT = {

  // ════════════════════════════════════════════════════════
  // PRÉSETS
  // ════════════════════════════════════════════════════════
  PRESETS: {

    // ── TABATA ──────────────────────────────────────────
    tabata_classic: {
      id:          'tabata_classic',
      nom:         'Tabata Classique',
      emoji:       '⚡',
      type:        'tabata',
      description: '8 rounds · 20s effort / 10s repos',
      duree:       4, // minutes
      difficulte:  3,
      calories:    80,
      exercices: [
        { ref:'burpees',              nom:'Burpees',          emoji:'💦' },
        { ref:'squat_saute',          nom:'Squat sauté',      emoji:'🦵' },
        { ref:'mountain_climbers',    nom:'Mountain Climbers',emoji:'🧗' },
        { ref:'pompes',               nom:'Pompes',           emoji:'⬆️' }
      ],
      config: { effortSec:20, reposSec:10, rounds:8 }
    },

    tabata_lower: {
      id:          'tabata_lower',
      nom:         'Tabata Jambes',
      emoji:       '🦵',
      type:        'tabata',
      description: '8 rounds · Focus jambes/fessiers',
      duree:       4,
      difficulte:  3,
      calories:    75,
      exercices: [
        { ref:'squat_saute',    nom:'Squat sauté',   emoji:'🦵' },
        { ref:'fentes',         nom:'Fentes',         emoji:'🚶' },
        { ref:'hip_thrust_sol', nom:'Hip Thrust',     emoji:'🍑' },
        { ref:'donkey_kick',    nom:'Donkey Kick',    emoji:'🦵' }
      ],
      config: { effortSec:20, reposSec:10, rounds:8 }
    },

    tabata_core: {
      id:          'tabata_core',
      nom:         'Tabata Core',
      emoji:       '🔥',
      type:        'tabata',
      description: '8 rounds · Focus abdos/gainage',
      duree:       4,
      difficulte:  2,
      calories:    60,
      exercices: [
        { ref:'mountain_climbers_core', nom:'Mountain Climbers', emoji:'🧗' },
        { ref:'crunch',                 nom:'Crunch',             emoji:'🔥' },
        { ref:'planche',                nom:'Planche',            emoji:'━' },
        { ref:'russian_twist',          nom:'Russian Twist',      emoji:'🔄' }
      ],
      config: { effortSec:20, reposSec:10, rounds:8 }
    },

    // ── EMOM ────────────────────────────────────────────
    emom_5min: {
      id:          'emom_5min',
      nom:         'EMOM 5 minutes',
      emoji:       '⏱️',
      type:        'emom',
      description: '5 rounds · 1 exercice toutes les minutes',
      duree:       5,
      difficulte:  2,
      calories:    60,
      exercices: [
        { ref:'burpees',   nom:'10 Burpees',      emoji:'💦', reps:10 },
        { ref:'pompes',    nom:'15 Pompes',        emoji:'⬆️', reps:15 },
        { ref:'squat_saute',nom:'12 Squats sautés',emoji:'🦵', reps:12 }
      ],
      config: { minutesDuree:5 }
    },

    emom_10min: {
      id:          'emom_10min',
      nom:         'EMOM 10 minutes',
      emoji:       '⏱️',
      type:        'emom',
      description: '10 rounds alternés · 2 exercices',
      duree:       10,
      difficulte:  3,
      calories:    120,
      exercices: [
        { ref:'tractions',   nom:'5 Tractions',    emoji:'🔗', reps:5  },
        { ref:'squat_saute', nom:'10 Squats sautés',emoji:'🦵', reps:10 }
      ],
      config: { minutesDuree:10 }
    },

    // ── AMRAP ────────────────────────────────────────────
    amrap_10: {
      id:          'amrap_10',
      nom:         'AMRAP 10 min',
      emoji:       '🏃',
      type:        'amrap',
      description: 'Max rounds en 10 minutes',
      duree:       10,
      difficulte:  4,
      calories:    150,
      exercices: [
        { ref:'burpees',   nom:'5 Burpees',   emoji:'💦', reps:5  },
        { ref:'pompes',    nom:'10 Pompes',   emoji:'⬆️', reps:10 },
        { ref:'squat_saute',nom:'15 Squats',  emoji:'🦵', reps:15 }
      ],
      config: { dureeMin:10 }
    },

    amrap_20: {
      id:          'amrap_20',
      nom:         'AMRAP 20 min',
      emoji:       '🔥',
      type:        'amrap',
      description: 'Max rounds en 20 minutes',
      duree:       20,
      difficulte:  5,
      calories:    280,
      exercices: [
        { ref:'tractions',   nom:'5 Tractions',   emoji:'🔗', reps:5  },
        { ref:'squat_saute', nom:'10 Squats',      emoji:'🦵', reps:10 },
        { ref:'pompes',      nom:'15 Pompes',      emoji:'⬆️', reps:15 },
        { ref:'burpees',     nom:'20 Burpees',     emoji:'💦', reps:20 }
      ],
      config: { dureeMin:20 }
    },

    // ── PYRAMIDAL ────────────────────────────────────────
    pyramide_up: {
      id:          'pyramide_up',
      nom:         'Pyramide montante',
      emoji:       '📈',
      type:        'pyramide',
      description: '1→10 reps · Montée progressive',
      duree:       15,
      difficulte:  3,
      calories:    100,
      exercices: [
        { ref:'burpees', nom:'Burpees', emoji:'💦' }
      ],
      config: { direction:'up', debut:1, fin:10, step:1 }
    },

    pyramide_down: {
      id:          'pyramide_down',
      nom:         'Pyramide descendante',
      emoji:       '📉',
      type:        'pyramide',
      description: '10→1 reps · Descente progressive',
      duree:       15,
      difficulte:  3,
      calories:    100,
      exercices: [
        { ref:'pompes', nom:'Pompes', emoji:'⬆️' }
      ],
      config: { direction:'down', debut:10, fin:1, step:-1 }
    },

    pyramide_double: {
      id:          'pyramide_double',
      nom:         'Pyramide complète',
      emoji:       '⛰️',
      type:        'pyramide',
      description: '1→10→1 reps · Montée et descente',
      duree:       25,
      difficulte:  4,
      calories:    180,
      exercices: [
        { ref:'burpees', nom:'Burpees', emoji:'💦' },
        { ref:'pompes',  nom:'Pompes',  emoji:'⬆️' }
      ],
      config: { direction:'both', debut:1, sommet:10, step:1 }
    },

    // ── CARDIO EXPRESS ───────────────────────────────────
    cardio_express: {
      id:          'cardio_express',
      nom:         'Cardio Express',
      emoji:       '⚡',
      type:        'intervalle',
      description: '6 exercices · 30s chacun · 3 rounds',
      duree:       12,
      difficulte:  2,
      calories:    100,
      exercices: [
        { ref:'burpees',             nom:'Burpees',          emoji:'💦' },
        { ref:'mountain_climbers',   nom:'Mountain Climbers',emoji:'🧗' },
        { ref:'squat_saute',         nom:'Squats sautés',    emoji:'🦵' },
        { ref:'corde_a_sauter',      nom:'Corde à sauter',   emoji:'🪢' },
        { ref:'pompes',              nom:'Pompes',           emoji:'⬆️' },
        { ref:'planche',             nom:'Planche',          emoji:'━'  }
      ],
      config: { effortSec:30, reposSec:15, rounds:3 }
    }
  },

  // ════════════════════════════════════════════════════════
  // STATE
  // ════════════════════════════════════════════════════════
  _actif:        false,
  _preset:       null,
  _type:         null,
  _phase:        'repos',   // 'effort' | 'repos' | 'transition'
  _roundActuel:  0,
  _exoActuel:    0,
  _secondes:     0,
  _interval:     null,
  _totalRounds:  0,
  _heureDebut:   null,
  _roundsAmrap:  0,

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    // Vérifier si session en cours
    if (this._actif) {
      this._renderSessionActive(container);
      return;
    }

    container.innerHTML = `

      <!-- Header -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(255,141,150,0.15),rgba(249,239,119,0.05));
                  border-color:rgba(255,141,150,0.3)">
        <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">
          ⚡ HIIT & Cardio
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Tabata · EMOM · AMRAP · Pyramide
        </div>
      </div>

      <!-- Filtres type -->
      <div style="display:flex;gap:6px;
                  overflow-x:auto;scrollbar-width:none;
                  margin-bottom:14px;padding-bottom:2px">
        ${[
          { id:'tous',      label:'Tous',      emoji:'⚡' },
          { id:'tabata',    label:'Tabata',    emoji:'🔥' },
          { id:'emom',      label:'EMOM',      emoji:'⏱️' },
          { id:'amrap',     label:'AMRAP',     emoji:'🏃' },
          { id:'pyramide',  label:'Pyramide',  emoji:'📈' },
          { id:'intervalle',label:'Intervalle',emoji:'💥' }
        ].map(f => `
          <button onclick="HIIT._filtrer('${f.id}',this)"
                  data-filtre="${f.id}"
                  style="padding:6px 12px;white-space:nowrap;
                         font-size:.72rem;font-weight:700;
                         border-radius:var(--radius-full);
                         cursor:pointer;
                         background:${f.id==='tous'
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.06)'};
                         border:1px solid ${f.id==='tous'
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.1)'};
                         color:${f.id==='tous'
                           ? 'white' : 'var(--text-muted)'}">
            ${f.emoji} ${f.label}
          </button>`).join('')}
      </div>

      <!-- Grille présets -->
      <div id="hiit-presets-grid">
        ${this._renderPresets('tous')}
      </div>

      <!-- Bouton créer custom -->
      <button onclick="HIIT._ouvrirCustom()"
              style="width:100%;padding:14px;margin-top:8px;
                     background:rgba(75,75,249,0.08);
                     border:1px dashed rgba(75,75,249,0.3);
                     border-radius:var(--radius-lg);
                     font-size:.85rem;font-weight:700;
                     color:var(--fd-indigo);cursor:pointer">
        ✏️ Créer un HIIT personnalisé
      </button>
    `;
  },

  // ════════════════════════════════════════════════════════
  // RENDU PRÉSETS
  // ════════════════════════════════════════════════════════
  _renderPresets(filtre = 'tous') {
    const presets = Object.values(this.PRESETS)
      .filter(p => filtre === 'tous' || p.type === filtre);

    if (!presets.length) {
      return `<div style="text-align:center;padding:20px;
                          color:var(--text-muted);font-size:.85rem">
                Aucun preset dans cette catégorie</div>`;
    }

    const typeColors = {
      tabata:    { bg:'rgba(255,141,150,0.1)', border:'rgba(255,141,150,0.3)', color:'var(--fd-coral)'  },
      emom:      { bg:'rgba(75,75,249,0.1)',   border:'rgba(75,75,249,0.3)',   color:'var(--fd-indigo)' },
      amrap:     { bg:'rgba(249,239,119,0.1)', border:'rgba(249,239,119,0.3)','color':'var(--fd-lemon)' },
      pyramide:  { bg:'rgba(139,240,187,0.1)', border:'rgba(139,240,187,0.3)','color':'var(--fd-mint)'  },
      intervalle:{ bg:'rgba(191,161,255,0.1)', border:'rgba(191,161,255,0.3)','color':'var(--fd-lavender)'}
    };

    return presets.map(p => {
      const tc = typeColors[p.type] || typeColors.tabata;
      return `
        <div style="background:var(--bg-card);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:12px;
                    cursor:pointer;transition:all .2s"
             onclick="HIIT._voirDetail('${p.id}')"
             onmouseenter="this.style.borderColor='rgba(75,75,249,0.4)'"
             onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)'">

          <div style="display:flex;align-items:flex-start;gap:12px">

            <!-- Emoji + type badge -->
            <div style="flex-shrink:0">
              <div style="width:52px;height:52px;border-radius:14px;
                          display:flex;align-items:center;justify-content:center;
                          font-size:1.8rem;
                          background:${tc.bg};
                          border:1px solid ${tc.border}">
                ${p.emoji}
              </div>
            </div>

            <!-- Infos -->
            <div style="flex:1">
              <div style="display:flex;align-items:center;
                          gap:8px;margin-bottom:4px">
                <div style="font-size:.92rem;font-weight:800">
                  ${p.nom}</div>
                <span style="padding:2px 8px;font-size:.58rem;
                             font-weight:700;border-radius:99px;
                             background:${tc.bg};
                             border:1px solid ${tc.border};
                             color:${tc.color}">
                  ${p.type.toUpperCase()}
                </span>
              </div>
              <div style="font-size:.72rem;color:var(--text-muted);
                          margin-bottom:8px">
                ${p.description}
              </div>

              <!-- Stats rapides -->
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                ${[
                  { emoji:'⏱️', val:`${p.duree}min`               },
                  { emoji:'🔥', val:`~${p.calories}kcal`           },
                  { emoji:'💪', val:`Niv.${p.difficulte}/5`         }
                ].map(s => `
                  <span style="font-size:.65rem;color:var(--text-muted);
                               display:flex;align-items:center;gap:3px">
                    ${s.emoji} ${s.val}
                  </span>`).join('')}
              </div>
            </div>

            <!-- Bouton start -->
            <button onclick="event.stopPropagation();
                             HIIT.demarrer('${p.id}')"
                    style="padding:8px 14px;flex-shrink:0;
                           background:var(--fd-indigo);border:none;
                           border-radius:var(--radius-full);
                           font-size:.72rem;font-weight:700;
                           color:white;cursor:pointer;
                           box-shadow:0 4px 12px rgba(75,75,249,0.4)">
              ▶ Start
            </button>
          </div>

          <!-- Exercices preview -->
          <div style="display:flex;gap:6px;margin-top:10px;
                      padding-top:10px;
                      border-top:1px solid rgba(255,255,255,0.06);
                      flex-wrap:wrap">
            ${p.exercices.slice(0,4).map(ex => `
              <span style="font-size:.65rem;padding:3px 8px;
                           background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.08);
                           border-radius:99px;
                           color:var(--text-muted)">
                ${ex.emoji} ${ex.nom}
              </span>`).join('')}
            ${p.exercices.length > 4
              ? `<span style="font-size:.65rem;color:var(--text-muted)">
                   +${p.exercices.length-4}
                 </span>` : ''}
          </div>
        </div>`;
    }).join('');
  },

  // ════════════════════════════════════════════════════════
  // FILTRE
  // ════════════════════════════════════════════════════════
  _filtrer(type, btn) {
    document.querySelectorAll('[data-filtre]').forEach(b => {
      b.style.background  = 'rgba(255,255,255,0.06)';
      b.style.borderColor = 'rgba(255,255,255,0.1)';
      b.style.color       = 'var(--text-muted)';
    });
    btn.style.background  = 'var(--fd-indigo)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'white';

    const grid = document.getElementById('hiit-presets-grid');
    if (grid) grid.innerHTML = this._renderPresets(type);
  },

  // ════════════════════════════════════════════════════════
  // VOIR DÉTAIL
  // ════════════════════════════════════════════════════════
  _voirDetail(presetId) {
    const preset  = this.PRESETS[presetId];
    if (!preset) return;
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const typeLabels = {
      tabata:   '🔥 Tabata — 20s effort / 10s repos × 8 rounds',
      emom:     '⏱️ EMOM — 1 exercice chaque minute',
      amrap:    '🏃 AMRAP — Max rounds en temps limité',
      pyramide: '📈 Pyramide — Reps croissantes/décroissantes',
      intervalle:'💥 Intervalles — Effort / Repos alternés'
    };

    content.innerHTML = `
      <div style="padding:16px">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:20px">
          <div style="font-size:3rem;margin-bottom:8px">${preset.emoji}</div>
          <div style="font-size:1.2rem;font-weight:800">${preset.nom}</div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px">
            ${typeLabels[preset.type] || preset.description}
          </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:16px">
          ${[
            { emoji:'⏱️', val:`${preset.duree}min`, label:'Durée'      },
            { emoji:'🔥', val:`~${preset.calories}`, label:'Calories'   },
            { emoji:'💪', val:`${preset.difficulte}/5`, label:'Difficulté'}
          ].map(s => `
            <div style="text-align:center;padding:10px 4px;
                        background:rgba(255,255,255,0.04);
                        border-radius:var(--radius-md)">
              <div style="font-size:.85rem">${s.emoji}</div>
              <div style="font-size:1rem;font-weight:800;
                          color:var(--fd-indigo);margin-top:2px">
                ${s.val}</div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${s.label}</div>
            </div>`).join('')}
        </div>

        <!-- Protocole -->
        <div style="background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:var(--radius-md);
                    padding:12px 14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-indigo);margin-bottom:6px">
            📋 Protocole
          </div>
          ${this._renderProtocole(preset)}
        </div>

        <!-- Exercices -->
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:8px">
          💪 Exercices
        </div>
        ${preset.exercices.map(ex => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:8px 0;
                      border-bottom:1px solid rgba(255,255,255,0.06)">
            <span style="font-size:1.3rem">${ex.emoji}</span>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:600">${ex.nom}</div>
              ${ex.reps
                ? `<div style="font-size:.65rem;color:var(--text-muted)">
                     ${ex.reps} répétitions</div>` : ''}
            </div>
          </div>`).join('')}

        <!-- Boutons -->
        <div style="display:grid;grid-template-columns:1fr 2fr;
                    gap:8px;margin-top:16px">
          <button onclick="document.getElementById('modal-info')
                             .classList.add('hidden')"
                  class="btn-secondary">
            ← Retour
          </button>
          <button onclick="document.getElementById('modal-info')
                             .classList.add('hidden');
                           HIIT.demarrer('${preset.id}')"
                  class="btn-primary"
                  style="font-size:.9rem">
            ⚡ Démarrer !
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _renderProtocole(preset) {
    switch(preset.type) {
      case 'tabata':
        return `
          <div style="font-size:.78rem;color:var(--text-secondary);
                      line-height:1.7">
            🔴 <strong>${preset.config.effortSec}s</strong> d'effort maximum<br>
            😴 <strong>${preset.config.reposSec}s</strong> de repos<br>
            🔄 <strong>${preset.config.rounds} rounds</strong> au total<br>
            ⏱️ Durée totale : <strong>${preset.duree} minutes</strong>
          </div>`;

      case 'emom':
        return `
          <div style="font-size:.78rem;color:var(--text-secondary);
                      line-height:1.7">
            ⏱️ À chaque début de minute, effectue les reps<br>
            😴 Le reste de la minute = repos<br>
            🔄 <strong>${preset.config.minutesDuree} minutes</strong> en continu<br>
            💡 Plus tu es rapide, plus tu récupères !
          </div>`;

      case 'amrap':
        return `
          <div style="font-size:.78rem;color:var(--text-secondary);
                      line-height:1.7">
            🏃 Enchaîne les exercices sans t'arrêter<br>
            ⏱️ Durée : <strong>${preset.config.dureeMin} minutes</strong><br>
            🔢 Compte tes rounds complétés<br>
            🎯 Objectif : battre ton score à chaque fois !
          </div>`;

      case 'pyramide': {
        const c = preset.config;
        if (c.direction === 'both') {
          return `
            <div style="font-size:.78rem;color:var(--text-secondary);
                        line-height:1.7">
              📈 Montée : ${c.debut} → ${c.sommet} reps (+${c.step}/round)<br>
              📉 Descente : ${c.sommet} → ${c.debut} reps (-${c.step}/round)<br>
              ⏱️ Repos : 30-45s entre chaque palier
            </div>`;
        }
        return `
          <div style="font-size:.78rem;color:var(--text-secondary);
                      line-height:1.7">
            ${c.direction === 'up' ? '📈' : '📉'} 
            <strong>${c.debut} → ${c.fin}</strong> reps<br>
            🔄 Variation : <strong>${Math.abs(c.step)} rep/round</strong><br>
            ⏱️ Repos : 30-45s entre chaque palier
          </div>`;
      }

      case 'intervalle':
        return `
          <div style="font-size:.78rem;color:var(--text-secondary);
                      line-height:1.7">
            🔴 <strong>${preset.config.effortSec}s</strong> d'effort<br>
            😴 <strong>${preset.config.reposSec}s</strong> de repos<br>
            🔄 <strong>${preset.config.rounds} rounds</strong> de ${preset.exercices.length} exercices<br>
            ⏱️ Durée totale : <strong>${preset.duree} min</strong>
          </div>`;

      default: return '<div style="font-size:.78rem;color:var(--text-muted)">Voir description</div>';
    }
  },

  // ════════════════════════════════════════════════════════
  // DÉMARRER UNE SESSION
  // ════════════════════════════════════════════════════════
  demarrer(presetId) {
    const preset = this.PRESETS[presetId];
    if (!preset) return;

    this._preset       = preset;
    this._type         = preset.type;
    this._actif        = true;
    this._roundActuel  = 1;
    this._exoActuel    = 0;
    this._roundsAmrap  = 0;
    this._heureDebut   = Date.now();

    // Naviguer vers la page circuit/hiit
    naviguer('circuit');

    setTimeout(() => {
      const container = document.getElementById('page-circuit');
      if (container) this._renderSessionActive(container);

      // Démarrer selon le type
      switch(preset.type) {
        case 'tabata':
        case 'intervalle':
          this._lancerTabata();
          break;
        case 'emom':
          this._lancerEMOM();
          break;
        case 'amrap':
          this._lancerAMRAP();
          break;
        case 'pyramide':
          this._lancerPyramide();
          break;
      }

      Utils.vibrer([100, 50, 100]);
      Utils.toast(`⚡ ${preset.nom} — Let's go !`, 'success', 2000);
    }, 300);
  },

  // ════════════════════════════════════════════════════════
  // SESSION ACTIVE — Interface
  // ════════════════════════════════════════════════════════
  _renderSessionActive(container) {
    if (!container || !this._preset) return;

    const preset      = this._preset;
    const exoActuel   = preset.exercices[this._exoActuel]
      || preset.exercices[0];

    container.innerHTML = `
      <div id="hiit-session" style="min-height:100vh;
           display:flex;flex-direction:column;align-items:center;
           justify-content:center;padding:24px;text-align:center">

        <!-- Header séance -->
        <div style="width:100%;display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:24px">
          <div style="font-size:.72rem;font-weight:700;
                      color:var(--text-muted)">
            ${preset.emoji} ${preset.nom}
          </div>
          <button onclick="HIIT._arreterSession()"
                  style="padding:5px 12px;font-size:.68rem;font-weight:700;
                         background:rgba(255,141,150,0.1);
                         border:1px solid rgba(255,141,150,0.2);
                         border-radius:99px;color:var(--fd-coral);
                         cursor:pointer">
            ✕ Arrêter
          </button>
        </div>

        <!-- Phase indicator -->
        <div id="hiit-phase-label"
             style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.2em;
                    color:var(--fd-mint);margin-bottom:12px">
          PRÊT ?
        </div>

        <!-- Exercice actuel -->
        <div id="hiit-exo-nom"
             style="font-size:1.4rem;font-weight:800;
                    margin-bottom:6px">
          ${exoActuel?.emoji} ${exoActuel?.nom}
        </div>
        <div id="hiit-exo-sub"
             style="font-size:.78rem;color:var(--text-muted);
                    margin-bottom:28px">
          ${exoActuel?.reps ? `${exoActuel.reps} répétitions` : 'Max effort'}
        </div>

        <!-- Timer principal — Cercle SVG -->
        <div style="position:relative;width:220px;height:220px;
                    margin-bottom:24px">
          <svg width="220" height="220" style="transform:rotate(-90deg)">
            <circle cx="110" cy="110" r="100"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    stroke-width="12"/>
            <circle cx="110" cy="110" r="100"
                    fill="none"
                    stroke="var(--fd-mint)"
                    stroke-width="12"
                    stroke-linecap="round"
                    stroke-dasharray="628"
                    stroke-dashoffset="0"
                    id="hiit-arc"
                    style="transition:stroke-dashoffset .5s linear,
                                      stroke .3s"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%)">
            <div id="hiit-timer"
                 style="font-size:4.5rem;font-weight:900;
                        color:var(--fd-mint);
                        font-variant-numeric:tabular-nums;
                        line-height:1">
              —
            </div>
            <div style="font-size:.7rem;color:var(--text-muted);
                        margin-top:4px">secondes</div>
          </div>
        </div>

        <!-- Round info -->
        <div id="hiit-round-info"
             style="font-size:.88rem;font-weight:700;
                    color:var(--text-secondary);margin-bottom:20px">
          Démarrage...
        </div>

        <!-- Barre progression rounds -->
        <div style="width:100%;max-width:320px;margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;
                      font-size:.62rem;color:var(--text-muted);
                      margin-bottom:5px">
            <span>Progression</span>
            <span id="hiit-prog-label">0%</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.08);
                      border-radius:99px;overflow:hidden">
            <div id="hiit-prog-bar"
                 style="height:100%;width:0%;
                        background:linear-gradient(90deg,
                          var(--fd-indigo),var(--fd-mint));
                        border-radius:99px;
                        transition:width .5s ease">
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div style="display:flex;gap:10px;width:100%;max-width:300px">
          <button onclick="HIIT._passerPhase()"
                  style="flex:1;padding:14px;
                         background:rgba(255,255,255,0.06);
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:var(--radius-md);
                         font-size:.82rem;font-weight:700;
                         color:var(--text-secondary);cursor:pointer">
            ⏭ Passer
          </button>
          <button id="hiit-btn-amrap"
                  onclick="HIIT._compterRound()"
                  style="flex:2;padding:14px;
                         display:${this._type === 'amrap'
                           ? 'block' : 'none'};
                         background:var(--fd-indigo);border:none;
                         border-radius:var(--radius-md);
                         font-size:.85rem;font-weight:700;
                         color:white;cursor:pointer">
            ✅ Round complété !
          </button>
        </div>

        <!-- Score AMRAP -->
        ${this._type === 'amrap' ? `
          <div style="margin-top:16px;text-align:center">
            <div id="hiit-amrap-score"
                 style="font-size:2rem;font-weight:800;
                        color:var(--fd-lemon)">0</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              rounds complétés</div>
          </div>` : ''}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // TABATA / INTERVALLES
  // ════════════════════════════════════════════════════════
  _lancerTabata() {
    const preset  = this._preset;
    const config  = preset.config;
    const maxRounds = config.rounds || 8;

    this._totalRounds = maxRounds * preset.exercices.length;
    this._phase       = 'preparation';
    this._secondes    = 3;

    this._runTimer(3, 'var(--fd-lemon)', 'PRÊT ?', () => {
      this._runTabataRound(1, 0, config, preset, maxRounds);
    });
  },

  _runTabataRound(round, exoIdx, config, preset, maxRounds) {
    if (round > maxRounds || !this._actif) {
      this._terminerSession();
      return;
    }

    const exo = preset.exercices[exoIdx % preset.exercices.length];
    const nextExoIdx = (exoIdx + 1) % preset.exercices.length;
    const roundsTotal = maxRounds;
    const roundActuel = round;

    // Mettre à jour l'UI exercice
    this._mettreAJourExo(exo);
    this._mettreAJourRound(
      `Round ${roundActuel} / ${roundsTotal}`,
      Math.round((roundActuel / roundsTotal) * 100)
    );

    // Phase EFFORT
    this._phase = 'effort';
    this._runTimer(
      config.effortSec,
      'var(--fd-coral)',
      '🔥 EFFORT !',
      () => {
        if (!this._actif) return;

        // Phase REPOS
        this._phase = 'repos';
        const estDernier = round >= maxRounds;

        this._runTimer(
          config.reposSec,
          'var(--fd-mint)',
          estDernier ? '🏁 Dernier round !' : '😴 REPOS',
          () => {
            if (!this._actif) return;
            this._runTabataRound(
              round + 1, nextExoIdx, config, preset, maxRounds
            );
          }
        );
      }
    );
  },

  // ════════════════════════════════════════════════════════
  // EMOM
  // ════════════════════════════════════════════════════════
  _lancerEMOM() {
    const preset       = this._preset;
    const dureeMin     = preset.config.minutesDuree;
    this._totalRounds  = dureeMin;
    let minuteActuelle = 0;

    const runMinute = () => {
      if (minuteActuelle >= dureeMin || !this._actif) {
        this._terminerSession();
        return;
      }

      minuteActuelle++;
      const exoIdx = (minuteActuelle - 1) % preset.exercices.length;
      const exo    = preset.exercices[exoIdx];

      this._mettreAJourExo(exo);
      this._mettreAJourRound(
        `Minute ${minuteActuelle} / ${dureeMin}`,
        Math.round((minuteActuelle / dureeMin) * 100)
      );

      this._runTimer(60, 'var(--fd-indigo)', '⏱️ GO !', runMinute);
    };

    // Compte à rebours initial
    this._runTimer(3, 'var(--fd-lemon)', 'PRÊT ?', runMinute);
  },

  // ════════════════════════════════════════════════════════
  // AMRAP
  // ════════════════════════════════════════════════════════
  _lancerAMRAP() {
    const preset    = this._preset;
    const dureeMin  = preset.config.dureeMin;
    const dureeSec  = dureeMin * 60;
    this._roundsAmrap = 0;
    this._totalRounds = dureeMin; // Pour la barre

    // Mettre à jour l'UI
    const exo = preset.exercices[0];
    this._mettreAJourExo(exo);

    // Timer dégressif AMRAP
    this._runTimer(
      dureeSec,
      'var(--fd-lemon)',
      '🏃 AMRAP — Go !',
      () => this._terminerSession(),
      true // AMRAP mode = timer dégressif
    );
  },

  _compterRound() {
    this._roundsAmrap++;
    const scoreEl = document.getElementById('hiit-amrap-score');
    if (scoreEl) {
      scoreEl.textContent = this._roundsAmrap;
      scoreEl.style.transform = 'scale(1.3)';
      setTimeout(() => scoreEl.style.transform = '', 300);
    }
    Utils.vibrer([30]);
    Utils.toast(`🏃 Round ${this._roundsAmrap} !`, 'success', 800);

    // Passer au prochain exercice
    this._exoActuel = (this._exoActuel + 1)
      % this._preset.exercices.length;
    this._mettreAJourExo(
      this._preset.exercices[this._exoActuel]
    );
  },

  // ════════════════════════════════════════════════════════
  // PYRAMIDE
  // ════════════════════════════════════════════════════════
  _lancerPyramide() {
    const preset  = this._preset;
    const config  = preset.config;

    // Générer la séquence de reps
    let sequence = [];
    if (config.direction === 'up') {
      for (let r = config.debut; r <= config.fin; r += config.step) {
        sequence.push(r);
      }
    } else if (config.direction === 'down') {
      for (let r = config.debut; r >= config.fin; r += config.step) {
        sequence.push(r);
      }
    } else { // both
      for (let r = config.debut; r <= config.sommet; r++) {
        sequence.push(r);
      }
      for (let r = config.sommet - 1; r >= config.debut; r--) {
        sequence.push(r);
      }
    }

    this._totalRounds = sequence.length;
    let palierIdx = 0;

    const runPalier = () => {
      if (palierIdx >= sequence.length || !this._actif) {
        this._terminerSession();
        return;
      }

      const reps   = sequence[palierIdx];
      const exoIdx = palierIdx % preset.exercices.length;
      const exo    = preset.exercices[exoIdx];

      this._mettreAJourExo({
        ...exo,
        nom: `${exo.nom}`,
        reps
      });

      this._mettreAJourRound(
        `Palier ${palierIdx+1}/${sequence.length} — ${reps} reps`,
        Math.round(((palierIdx+1) / sequence.length) * 100)
      );

      // Attendre confirmation manuelle
      const timerEl = document.getElementById('hiit-timer');
      const phaseEl = document.getElementById('hiit-phase-label');
      const arcEl   = document.getElementById('hiit-arc');

      if (timerEl) {
        timerEl.textContent = reps;
        timerEl.style.color = 'var(--fd-lemon)';
      }
      if (phaseEl) {
        phaseEl.textContent = `💪 EFFECTUE ${reps} REPS`;
        phaseEl.style.color = 'var(--fd-lemon)';
      }
      if (arcEl) {
        arcEl.style.stroke = 'var(--fd-lemon)';
      }

      Utils.vibrer([50]);

      // Repos automatique puis prochain palier
      palierIdx++;
      this._runTimer(40, 'var(--fd-mint)', '😴 REPOS', runPalier);
    };

    this._runTimer(3, 'var(--fd-lemon)', 'PRÊT ?', runPalier);
  },

  // ════════════════════════════════════════════════════════
  // TIMER CORE — Moteur central
  // ════════════════════════════════════════════════════════
  _runTimer(secondes, couleur, phaseLabel, onTermine, degressif = false) {
    clearInterval(this._interval);

    const timerEl = document.getElementById('hiit-timer');
    const phaseEl = document.getElementById('hiit-phase-label');
    const arcEl   = document.getElementById('hiit-arc');
    const circ    = 628; // 2 * PI * 100

    if (phaseEl) {
      phaseEl.textContent = phaseLabel;
      phaseEl.style.color = couleur;
    }
    if (arcEl) {
      arcEl.style.stroke = couleur;
    }

    const heureFin = Date.now() + (secondes * 1000);

    this._interval = setInterval(() => {
      if (!this._actif) {
        clearInterval(this._interval);
        return;
      }

      const resteMs  = heureFin - Date.now();
      const resteSec = Math.ceil(resteMs / 1000);
      const reste    = Math.max(0, resteSec);

      // Mettre à jour affichage
      if (timerEl) {
        timerEl.textContent = reste;
        timerEl.style.color = reste <= 3
          ? 'var(--fd-coral)'
          : couleur;
      }

      // Arc SVG
      if (arcEl) {
        const pct    = Math.max(0, resteMs / (secondes * 1000));
        const offset = degressif
          ? circ * (1 - pct)  // AMRAP : se vide
          : circ * (1 - pct); // Autres : se vide aussi
        arcEl.style.strokeDashoffset = offset;
      }

      // 3 dernières secondes
      if (reste <= 3 && reste > 0) {
        Utils.vibrer([20]);
      }

      // Terminé
      if (reste <= 0) {
        clearInterval(this._interval);
        Utils.vibrer([200, 100, 200]);
        if (onTermine) onTermine();
      }
    }, 250);
  },

  // ════════════════════════════════════════════════════════
  // HELPERS UI
  // ════════════════════════════════════════════════════════
  _mettreAJourExo(exo) {
    const nomEl = document.getElementById('hiit-exo-nom');
    const subEl = document.getElementById('hiit-exo-sub');
    if (nomEl && exo) {
      nomEl.textContent = `${exo.emoji} ${exo.nom}`;
      nomEl.style.animation = 'none';
      requestAnimationFrame(() => {
        nomEl.style.animation = 'fadeIn .3s ease';
      });
    }
    if (subEl && exo) {
      subEl.textContent = exo.reps
        ? `${exo.reps} répétitions`
        : 'Max effort';
    }
  },

  _mettreAJourRound(label, pct) {
    const roundEl = document.getElementById('hiit-round-info');
    const barEl   = document.getElementById('hiit-prog-bar');
    const lblEl   = document.getElementById('hiit-prog-label');
    if (roundEl) roundEl.textContent = label;
    if (barEl)   barEl.style.width   = `${pct}%`;
    if (lblEl)   lblEl.textContent   = `${pct}%`;
  },

  _passerPhase() {
    clearInterval(this._interval);
    Utils.vibrer([20]);
    Utils.toast('⏭ Phase passée', 'info', 800);
    // Déclencher la fin de phase artificielle
    if (this._phase === 'effort') {
      this._phase = 'repos';
    } else {
      this._phase = 'effort';
    }
  },

  // ════════════════════════════════════════════════════════
  // TERMINER LA SESSION
  // ════════════════════════════════════════════════════════
  _terminerSession() {
    if (!this._actif) return;

    clearInterval(this._interval);
    this._actif = false;

    const dureeMs  = Date.now() - (this._heureDebut || Date.now());
    const dureeSec = Math.round(dureeMs / 1000);
    const calories = this._preset?.calories || 0;
    const preset   = this._preset;

    // XP + Stats
    try { Gamification.recompenser('CIRCUIT_COMPLETE'); } catch(e) {}
    try {
      Tracker.sauvegarderSeanceHIIT({
        presetId:  preset?.id,
        nom:       preset?.nom,
        type:      preset?.type,
        duree:     dureeSec,
        calories,
        rounds:    this._type === 'amrap'
          ? this._roundsAmrap
          : this._roundActuel,
        date:      Utils.aujourd_hui()
      });
    } catch(e) {}

    Utils.confetti(2000);
    Utils.vibrer([200, 100, 200, 100, 400]);

    // Afficher résumé
    const container = document.getElementById('page-circuit');
    if (container) {
      container.innerHTML = `
        <div style="min-height:80vh;display:flex;flex-direction:column;
                    align-items:center;justify-content:center;
                    padding:24px;text-align:center">

          <!-- Célébration -->
          <div style="font-size:4rem;margin-bottom:12px">🎉</div>

          <div style="font-size:.65rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.2em;
                      color:var(--fd-mint);margin-bottom:8px">
            SESSION TERMINÉE !
          </div>

          <div style="font-size:1.4rem;font-weight:800;
                      margin-bottom:4px">
            ${preset?.emoji} ${preset?.nom}
          </div>

          <div style="font-size:.78rem;color:var(--text-muted);
                      margin-bottom:24px">
            ${preset?.type?.toUpperCase()} terminé 💪
          </div>

          <!-- Stats -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);
                      gap:10px;width:100%;max-width:320px;
                      margin-bottom:24px">
            ${[
              { emoji:'⏱️', val:this._formatDuree(dureeSec), label:'Durée'    },
              { emoji:'🔥', val:`~${calories}`,               label:'Calories' },
              { emoji:'🔄', val:this._type === 'amrap'
                ? `${this._roundsAmrap} rounds`
                : `${this._totalRounds} rounds`,               label:'Rounds'  }
            ].map(s => `
              <div style="text-align:center;padding:12px 6px;
                          background:rgba(255,255,255,0.04);
                          border:1px solid rgba(255,255,255,0.08);
                          border-radius:var(--radius-lg)">
                <div style="font-size:.85rem">${s.emoji}</div>
                <div style="font-size:1rem;font-weight:800;
                            color:var(--fd-mint);margin-top:4px">
                  ${s.val}</div>
                <div style="font-size:.58rem;color:var(--text-muted);
                            margin-top:2px">${s.label}</div>
              </div>`).join('')}
          </div>

          <!-- Message motivation -->
          <div style="padding:12px 16px;
                      background:rgba(75,75,249,0.08);
                      border:1px solid rgba(75,75,249,0.2);
                      border-left:3px solid var(--fd-indigo);
                      border-radius:var(--radius-md);
                      margin-bottom:24px;
                      max-width:320px;
                      font-size:.82rem;color:var(--text-secondary);
                      line-height:1.5">
            ${this._getMessageFin()}
          </div>

          <!-- Boutons -->
          <div style="display:flex;flex-direction:column;
                      gap:8px;width:100%;max-width:280px">
            <button onclick="HIIT.demarrer('${preset?.id}')"
                    style="padding:14px;background:var(--fd-indigo);
                           border:none;border-radius:var(--radius-lg);
                           font-size:.9rem;font-weight:700;
                           color:white;cursor:pointer">
              🔄 Refaire cette session
            </button>
            <button onclick="naviguer('circuit')"
                    class="btn-secondary"
                    style="font-size:.85rem">
              ← Choisir un autre HIIT
            </button>
            <button onclick="naviguer('home')"
                    style="padding:10px;background:transparent;
                           border:1px solid rgba(255,255,255,0.1);
                           border-radius:var(--radius-md);
                           font-size:.78rem;font-weight:600;
                           color:var(--text-muted);cursor:pointer">
              🏠 Accueil
            </button>
          </div>
        </div>
      `;
    }

    this._preset = null;
  },

  // ════════════════════════════════════════════════════════
  // ARRÊTER LA SESSION
  // ════════════════════════════════════════════════════════
  async _arreterSession() {
    const ok = await Utils.confirmer(
      'Arrêter la session ?',
      'Ta progression sera perdue.'
    );
    if (!ok) return;

    clearInterval(this._interval);
    this._actif  = false;
    this._preset = null;

    naviguer('circuit');
  },

  // ════════════════════════════════════════════════════════
  // CRÉER UN HIIT PERSONNALISÉ
  // ════════════════════════════════════════════════════════
  _ouvrirCustom() {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding:16px">
        <h3 style="margin-bottom:var(--space-md)">✏️ HIIT Personnalisé</h3>

        <div class="input-label">Type</div>
        <select class="input mb-md" id="custom-type">
          <option value="tabata">🔥 Tabata</option>
          <option value="intervalle">💥 Intervalles</option>
          <option value="emom">⏱️ EMOM</option>
          <option value="amrap">🏃 AMRAP</option>
        </select>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:10px;margin-bottom:12px">
          <div>
            <div class="input-label">Temps effort (s)</div>
            <input class="input" id="custom-effort" type="number"
                   value="20" min="5" max="120"/>
          </div>
          <div>
            <div class="input-label">Temps repos (s)</div>
            <input class="input" id="custom-repos" type="number"
                   value="10" min="5" max="120"/>
          </div>
          <div>
            <div class="input-label">Rounds</div>
            <input class="input" id="custom-rounds" type="number"
                   value="8" min="1" max="30"/>
          </div>
          <div>
            <div class="input-label">Exercices</div>
            <select class="input" id="custom-exo">
              ${Object.entries(window.EXERCICES || {})
                .filter(([,ex]) => ex.groupe === 'cardio'
                  || ex.groupe === 'abdos'
                  || ex.groupe === 'fullbody')
                .map(([ref, ex]) =>
                  `<option value="${ref}">${ex.emoji} ${ex.nom}</option>`
                ).join('')}
            </select>
          </div>
        </div>

        <button onclick="HIIT._lancerCustom()"
                class="btn-primary"
                style="width:100%">
          ⚡ Lancer !
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _lancerCustom() {
    const type   = document.getElementById('custom-type')?.value  || 'tabata';
    const effort = parseInt(document.getElementById('custom-effort')?.value) || 20;
    const repos  = parseInt(document.getElementById('custom-repos')?.value)  || 10;
    const rounds = parseInt(document.getElementById('custom-rounds')?.value) || 8;
    const exoRef = document.getElementById('custom-exo')?.value || 'burpees';
    const exo    = window.EXERCICES?.[exoRef]
      || { nom:'Exercice', emoji:'💪' };

    // Créer preset temporaire
    const customPreset = {
      id:         'custom',
      nom:        'Mon HIIT',
      emoji:      '⚡',
      type:       type,
      description:`${effort}s effort / ${repos}s repos × ${rounds} rounds`,
      duree:      Math.round(((effort + repos) * rounds) / 60),
      difficulte: 3,
      calories:   Math.round(((effort + repos) * rounds) / 60 * 10),
      exercices: [{
        ref:   exoRef,
        nom:   exo.nom,
        emoji: exo.emoji || '💪'
      }],
      config: { effortSec:effort, reposSec:repos, rounds }
    };

    this.PRESETS['custom'] = customPreset;

    document.getElementById('modal-info')?.classList.add('hidden');
    this.demarrer('custom');
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _formatDuree(secondes) {
    const m = Math.floor(secondes / 60);
    const s = secondes % 60;
    return m > 0
      ? `${m}min${s > 0 ? ` ${s}s` : ''}`
      : `${s}s`;
  },

  _getMessageFin() {
    const msgs = [
      '🔥 Session épique ! Ton cardio progresse à chaque séance.',
      '💪 Excellent travail ! Le HIIT est l\'arme secrète des athlètes.',
      '⚡ Impressionnant ! Tu repousses tes limites chaque jour.',
      '🏆 Bravo ! La régularité fait les champions.',
      '🚀 Session terminée ! Récupère bien et hydrate-toi !'
    ];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
};

window.HIIT = HIIT;
console.log('✅ HIIT v1.0 chargé — Tabata + EMOM + AMRAP + Pyramide + Custom');
