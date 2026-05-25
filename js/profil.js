/* ============================================================
   PowerApp — Profil.js v2.0
   Gestion profil complet + Calculs nutrition + Adaptation
   + Sync onboarding + Thème personnalisable
   + Fix muscles_cibles modal
   ============================================================ */

'use strict';

const Profil = {

  CLE:            'ft_profil_complet',
  CLE_ONBOARDING: 'ft_profil_onboarding',  // ✅ NOUVEAU v2.0
  CLE_THEME:      'ft_theme_config',        // ✅ NOUVEAU v2.0

  // ════════════════════════════════════════════════════════
  // VALEURS PAR DÉFAUT
  // ════════════════════════════════════════════════════════
  DEFAUT: {
    nom:            '',
    avatar:         '💪',
    genre:          null,
    poids:          null,
    taille:         null,
    age:            null,
    objectif:       'forme',
    niveau:         'intermediaire',
    lieu:           'salle',
    muscles_cibles: [],
    nutrition: {
      calories:  2000,
      proteines: 150,
      glucides:  200,
      lipides:   65,
      eau:       2.5
    },
    dateCreation: null,
    dateMaj:      null
  },

  // ════════════════════════════════════════════════════════
  // GET / SET — ✅ v2.0 sync onboarding
  // ════════════════════════════════════════════════════════
  get() {
    const saved = Utils.storage.get(this.CLE, null);
    if (!saved) return this._migrerAncienProfil();
    return { ...this.DEFAUT, ...saved };
  },

  set(data) {
    const actuel  = this.get();
    const nouveau = {
      ...actuel,
      ...data,
      dateMaj: Utils.aujourd_hui()
    };
    if (data.poids || data.taille || data.age
        || data.objectif || data.genre) {
      nouveau.nutrition = this.calculerNutrition(nouveau);
    }
    Utils.storage.set(this.CLE, nouveau);
    this._syncAncienProfil(nouveau);
    // ✅ NOUVEAU v2.0 — Sync onboarding
    this._syncOnboarding(nouveau);
    return nouveau;
  },

  // ✅ NOUVEAU v2.0 — Sync ft_profil_onboarding
  _syncOnboarding(profil) {
    try {
      const existant = Utils.storage.get(
        this.CLE_ONBOARDING, {}
      );
      Utils.storage.set(this.CLE_ONBOARDING, {
        ...existant,
        nom:            profil.nom            || existant.nom,
        genre:          profil.genre          || existant.genre,
        objectif:       profil.objectif       || existant.objectif,
        niveau:         profil.niveau         || existant.niveau,
        lieu:           profil.lieu           || existant.lieu,
        muscles_cibles: profil.muscles_cibles || existant.muscles_cibles || [],
        poids:          profil.poids          || existant.poids,
        taille:         profil.taille         || existant.taille,
        age:            profil.age            || existant.age
      });
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // MIGRATION
  // ════════════════════════════════════════════════════════
  _migrerAncienProfil() {
    const ancien = Utils.storage.get('ft_profil', null);
    if (!ancien) return { ...this.DEFAUT };
    const nouveau = {
      ...this.DEFAUT,
      nom:      ancien.nom      || '',
      avatar:   ancien.avatar   || '💪',
      poids:    ancien.poids    || null,
      taille:   ancien.taille   || null,
      objectif: ancien.objectif || 'forme',
      niveau:   ancien.niveau   || 'intermediaire',
      dateCreation: ancien.dateDebut || Utils.aujourd_hui()
    };
    nouveau.nutrition = this.calculerNutrition(nouveau);
    Utils.storage.set(this.CLE, nouveau);
    return nouveau;
  },

  _syncAncienProfil(profil) {
    Utils.storage.set('ft_profil', {
      nom:       profil.nom,
      avatar:    profil.avatar,
      poids:     profil.poids,
      taille:    profil.taille,
      objectif:  profil.objectif,
      niveau:    profil.niveau,
      genre:     profil.genre,
      dateDebut: profil.dateCreation || Utils.aujourd_hui()
    });
  },

  // ════════════════════════════════════════════════════════
  // CALCULS NUTRITION
  // ════════════════════════════════════════════════════════
  calculerNutrition(profil) {
    const poids  = profil.poids  || 75;
    const taille = profil.taille || 175;
    const age    = profil.age    || 25;
    const genre  = profil.genre  || 'homme';
    const obj    = profil.objectif || 'forme';

    let MB;
    if (genre === 'femme') {
      MB = 447.6 + (9.2 * poids) + (3.1 * taille) - (4.3 * age);
    } else {
      MB = 88.4 + (13.4 * poids) + (4.8 * taille) - (5.7 * age);
    }

    const facteurs = {
      debutant:      1.55,
      intermediaire: 1.65,
      avance:        1.75
    };
    const facteur = facteurs[profil.niveau || 'intermediaire'];
    const TDEE    = Math.round(MB * facteur);

    const ajustements = {
      prise_masse: genre === 'femme' ? +300 : +400,
      perte_poids: genre === 'femme' ? -350 : -400,
      seche:       genre === 'femme' ? -250 : -300,
      force:       genre === 'femme' ? +150 : +200,
      endurance:   0,
      forme:       0
    };
    const calories = TDEE + (ajustements[obj] || 0);

    const ratiosProteine = {
      prise_masse: genre === 'homme' ? 2.2 : 1.8,
      perte_poids: genre === 'homme' ? 2.0 : 1.8,
      seche:       genre === 'homme' ? 2.2 : 2.0,
      force:       genre === 'homme' ? 2.0 : 1.8,
      endurance:   1.4,
      forme:       genre === 'homme' ? 1.8 : 1.6
    };
    const proteines = Math.round(
      poids * (ratiosProteine[obj] || 1.8)
    );

    const lipides = Math.round((calories * 0.27) / 9);
    const calProtPlusFat = (proteines * 4) + (lipides * 9);
    const glucides = Math.round(
      Math.max(0, (calories - calProtPlusFat) / 4)
    );
    const eau = Math.round((poids * 0.035) * 10) / 10;

    return {
      calories:  Math.round(calories),
      proteines,
      glucides,
      lipides,
      eau: Math.max(2.0, eau)
    };
  },

  // ════════════════════════════════════════════════════════
  // CONFIGS STATIQUES
  // ════════════════════════════════════════════════════════
  OBJECTIFS: {
    prise_masse: {
      label:'💪 Prise de masse', desc:'Augmenter le volume musculaire',
      couleur:'#4b4bf9', reps:'6-10', repos:'2-3 min',
      seances:4, conseil:'Surplus calorique + charges lourdes'
    },
    perte_poids: {
      label:'⬇️ Perte de poids', desc:'Perdre du gras en gardant le muscle',
      couleur:'#ff8d96', reps:'12-15', repos:'60s',
      seances:4, conseil:'Déficit calorique + cardio modéré'
    },
    seche: {
      label:'🔥 Sèche', desc:'Définition musculaire maximale',
      couleur:'#f9ef77', reps:'12-15', repos:'45-60s',
      seances:5, conseil:'Déficit modéré + haute protéines'
    },
    force: {
      label:'🏋️ Force', desc:'Maximiser la force brute',
      couleur:'#8bf0bb', reps:'3-6', repos:'3-5 min',
      seances:4, conseil:'Charges max + progression linéaire'
    },
    endurance: {
      label:'🏃 Endurance', desc:'Améliorer la résistance',
      couleur:'#bfa1ff', reps:'15-20', repos:'30-45s',
      seances:4, conseil:'Reps élevées + circuit training'
    },
    forme: {
      label:'✨ Forme générale', desc:'Équilibre santé & esthétique',
      couleur:'#ffffff', reps:'10-12', repos:'75s',
      seances:3, conseil:'Programme équilibré'
    }
  },

  NIVEAUX: {
    debutant: {
      label:'🌱 Débutant', desc:'Moins de 6 mois',
      seances:3, split:'full_body', repos:90, duree:60
    },
    intermediaire: {
      label:'💪 Intermédiaire', desc:'6 mois — 2 ans',
      seances:4, split:'ppl', repos:75, duree:70
    },
    avance: {
      label:'🔥 Avancé', desc:'Plus de 2 ans',
      seances:5, split:'ppl_plus', repos:60, duree:80
    }
  },

  LIEUX: {
    salle: {
      label:'🏋️ Salle de sport', desc:'Accès complet aux machines',
      equipement:['barre','halteres','machines','cables','rack'],
      bonus:'Tous les exercices disponibles'
    },
    maison: {
      label:'🏠 À la maison', desc:'Haltères ou poids du corps',
      equipement:['halteres','poids_corps','elastiques'],
      bonus:'Programme adapté sans machines'
    },
    dehors: {
      label:'🌳 En extérieur', desc:'Parc ou espace libre',
      equipement:['poids_corps','barres_traction'],
      bonus:'Circuit training & cardio'
    }
  },

  MUSCLES: {
    pectoraux:  { label:'Pectoraux',         emoji:'🫁', face:'avant',   couleur:'#4b4bf9' },
    epaules:    { label:'Épaules',           emoji:'🔵', face:'avant',   couleur:'#bfa1ff' },
    biceps:     { label:'Biceps',            emoji:'💪', face:'avant',   couleur:'#8bf0bb' },
    abdos:      { label:'Abdominaux',        emoji:'🔥', face:'avant',   couleur:'#f9ef77' },
    quadriceps: { label:'Quadriceps',        emoji:'🦵', face:'avant',   couleur:'#ff8d96' },
    dos:        { label:'Dos',               emoji:'🔙', face:'arriere', couleur:'#4b4bf9' },
    triceps:    { label:'Triceps',           emoji:'💪', face:'arriere', couleur:'#bfa1ff' },
    fessiers:   { label:'Fessiers',          emoji:'🍑', face:'arriere', couleur:'#ff8d96' },
    ischio:     { label:'Ischio-jambiers',   emoji:'🦵', face:'arriere', couleur:'#8bf0bb' },
    mollets:    { label:'Mollets',           emoji:'🦶', face:'arriere', couleur:'#f9ef77' },
    trapeze:    { label:'Trapèzes',          emoji:'🔝', face:'arriere', couleur:'#bfa1ff' }
  },

  // ✅ NOUVEAU v2.0 — Thèmes
  THEMES: {
    dark:    { label:'🌑 Dark',     desc:'Thème sombre par défaut'    },
    light:   { label:'☀️ Light',    desc:'Thème clair'                },
    indigo:  { label:'💜 Indigo',   desc:'Accent violet accentué'     },
    coral:   { label:'🪸 Coral',    desc:'Accent corail chaleureux'   }
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATIONS
  // ════════════════════════════════════════════════════════
  getRecommandations(profil) {
    const obj    = profil.objectif || 'forme';
    const niv    = profil.niveau   || 'intermediaire';
    const lieu   = profil.lieu     || 'salle';
    const genre  = profil.genre    || 'homme';
    const muscles = profil.muscles_cibles || [];

    const objConfig  = this.OBJECTIFS[obj]  || this.OBJECTIFS.forme;
    const nivConfig  = this.NIVEAUX[niv]    || this.NIVEAUX.intermediaire;
    const lieuConfig = this.LIEUX[lieu]     || this.LIEUX.salle;

    const exercicesPrioritaires = this._getExercicesPrioritaires(
      genre, muscles, lieu, obj
    );

    return {
      seancesParSemaine: objConfig.seances,
      split:             nivConfig.split,
      reps:              objConfig.reps,
      repos:             objConfig.repos,
      dureeSeance:       nivConfig.duree,
      equipement:        lieuConfig.equipement,
      exercices:         exercicesPrioritaires,
      conseil:           objConfig.conseil,
      nutrition:         profil.nutrition
    };
  },

  _getExercicesPrioritaires(genre, muscles, lieu, objectif) {
    const exosSalle = {
      push:     ['bench_press','incline_halteres','dev_militaire',
                 'elev_laterales','ext_triceps_poulie','dips'],
      pull:     ['tractions','rowing_barre','lat_pulldown',
                 'face_pull','curl_halteres','curl_marteau'],
      legs:     ['squat','presse_cuisses','leg_curl',
                 'leg_extension','fentes','mollets'],
      fessiers: ['hip_thrust','fentes','sumo_squat',
                 'kickback','leg_curl'],
      full:     ['squat','bench_press','rowing_barre',
                 'dev_militaire','curl_halteres','planche']
    };

    const exosMaison = {
      push:     ['pompes','pompes_declined','dips_triceps','pike_pushup'],
      pull:     ['tractions','inverted_row','superman'],
      legs:     ['squat_poids_corps','fentes','fentes_bulgares',
                 'hip_thrust_sol','squat_saute'],
      fessiers: ['hip_thrust_sol','donkey_kick','clamshell'],
      full:     ['burpees','mountain_climbers','squat_poids_corps',
                 'pompes','planche']
    };

    const exosDehors = {
      push:     ['pompes','dips','pike_pushup'],
      pull:     ['tractions','inverted_row'],
      legs:     ['squat_poids_corps','fentes','squat_saute'],
      fessiers: ['hip_thrust_sol','donkey_kick'],
      full:     ['burpees','mountain_climbers',
                 'squat_poids_corps','pompes']
    };

    const baseExos = lieu === 'maison' ? exosMaison
                   : lieu === 'dehors' ? exosDehors
                   : exosSalle;

    let selection = [];

    if (genre === 'femme') {
      const prioritesFemme = muscles.length > 0
        ? muscles
        : ['fessiers','jambes','abdos'];

      if (prioritesFemme.some(m =>
          ['fessiers','ischio','quadriceps','mollets'].includes(m)
        )) {
        selection = [
          ...baseExos.fessiers,
          ...baseExos.legs,
          ...baseExos.push.slice(0, 2),
          ...baseExos.pull.slice(0, 2)
        ];
      } else {
        selection = [
          ...baseExos.full,
          ...baseExos.fessiers.slice(0, 2)
        ];
      }
    } else {
      const prioritesHomme = muscles.length > 0
        ? muscles
        : ['pectoraux','dos','epaules'];

      if (prioritesHomme.some(m =>
          ['pectoraux','epaules','triceps'].includes(m)
        )) {
        selection = [
          ...baseExos.push,
          ...baseExos.pull.slice(0, 3),
          ...baseExos.legs.slice(0, 2)
        ];
      } else if (prioritesHomme.some(m =>
          ['dos','biceps','trapeze'].includes(m)
        )) {
        selection = [
          ...baseExos.pull,
          ...baseExos.push.slice(0, 3),
          ...baseExos.legs.slice(0, 2)
        ];
      } else if (prioritesHomme.some(m =>
          ['quadriceps','fessiers','ischio','mollets'].includes(m)
        )) {
        selection = [
          ...baseExos.legs,
          ...baseExos.push.slice(0, 2),
          ...baseExos.pull.slice(0, 2)
        ];
      } else {
        selection = [
          ...baseExos.push.slice(0, 3),
          ...baseExos.pull.slice(0, 3),
          ...baseExos.legs.slice(0, 3)
        ];
      }
    }

    return [...new Set(selection)];
  },

  // ════════════════════════════════════════════════════════
  // RÉSUMÉ PROFIL
  // ════════════════════════════════════════════════════════
  getResume(profil) {
    if (!profil) profil = this.get();

    const obj  = this.OBJECTIFS[profil.objectif] || this.OBJECTIFS.forme;
    const niv  = this.NIVEAUX[profil.niveau]     || this.NIVEAUX.intermediaire;
    const lieu = this.LIEUX[profil.lieu]         || this.LIEUX.salle;

    const imc = profil.poids && profil.taille
      ? Math.round(
          (profil.poids / Math.pow(profil.taille/100, 2)) * 10
        ) / 10
      : null;

    const imcLabel = !imc ? null
      : imc < 18.5 ? { label:'Maigreur', color:'var(--fd-coral)'  }
      : imc < 25   ? { label:'Normal',   color:'var(--fd-mint)'   }
      : imc < 30   ? { label:'Surpoids', color:'var(--fd-lemon)'  }
      :               { label:'Obésité', color:'var(--fd-coral)'  };

    return {
      nom:             profil.nom    || 'Athlète',
      avatar:          profil.avatar || '💪',
      genre:           profil.genre  || null,
      genreLabel:      profil.genre === 'homme' ? '👨 Homme'
                     : profil.genre === 'femme' ? '👩 Femme'
                     : null,
      objectif:        obj.label,
      objectifCouleur: obj.couleur,
      niveau:          niv.label,
      lieu:            lieu.label,
      imc, imcLabel,
      muscles: (profil.muscles_cibles || [])
        .map(m => this.MUSCLES[m]?.label || m),
      nutrition: profil.nutrition || this.DEFAUT.nutrition,
      seances:   obj.seances,
      reps:      obj.reps,
      repos:     obj.repos,
      conseil:   obj.conseil
    };
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE PROFIL — ✅ v2.0 enrichi
  // ════════════════════════════════════════════════════════
  renderPage(container) {
    if (!container) return;

    const profil = this.get();
    const resume = this.getResume(profil);
    const nut    = profil.nutrition || this.DEFAUT.nutrition;

    // ✅ Stats rapides depuis Tracker
    let totalSeances = 0, streak = 0, totalPRs = 0;
    try {
      totalSeances = Tracker.getTotalSeances();
      streak       = Tracker.getStreak().count;
      totalPRs     = Object.keys(Tracker.getAllPRs()).length;
    } catch(e) {}

    container.innerHTML = `

      <!-- HERO PROFIL -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.25),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  position:relative;overflow:hidden">
        <div style="position:absolute;top:-30px;right:-20px;
                    width:140px;height:140px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2) 0%,transparent 70%);
                    pointer-events:none"></div>

        <div style="display:flex;align-items:center;
                    gap:14px;margin-bottom:14px">
          <div style="width:64px;height:64px;border-radius:50%;
                      background:rgba(75,75,249,0.2);
                      border:2px solid rgba(75,75,249,0.4);
                      display:flex;align-items:center;
                      justify-content:center;
                      font-size:2rem;flex-shrink:0">
            ${resume.avatar}
          </div>
          <div style="flex:1">
            <div style="font-size:1.3rem;font-weight:800">
              ${resume.nom}
            </div>
            <div style="font-size:.75rem;color:var(--text-muted);
                        margin-top:3px;display:flex;
                        flex-wrap:wrap;gap:5px">
              ${resume.genreLabel
                ? `<span style="color:var(--fd-lavender)">
                     ${resume.genreLabel}</span>` : ''}
              ${resume.niveau
                ? `<span>· ${resume.niveau}</span>` : ''}
              ${resume.lieu
                ? `<span>· ${resume.lieu}</span>` : ''}
            </div>
          </div>
          <button onclick="Profil._ouvrirEdition()"
                  style="padding:8px 14px;
                         background:var(--fd-indigo);
                         border:none;border-radius:99px;
                         font-size:.72rem;font-weight:700;
                         color:white;cursor:pointer;
                         flex-shrink:0">
            ✏️ Modifier
          </button>
        </div>

        ${profil.poids || profil.taille ? `
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            ${profil.poids ? `
              <div style="padding:6px 12px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;font-size:.72rem;
                          font-weight:700">
                ⚖️ ${profil.poids}kg
              </div>` : ''}
            ${profil.taille ? `
              <div style="padding:6px 12px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;font-size:.72rem;
                          font-weight:700">
                📏 ${profil.taille}cm
              </div>` : ''}
            ${resume.imc ? `
              <div style="padding:6px 12px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;font-size:.72rem;
                          font-weight:700;
                          color:${resume.imcLabel?.color}">
                IMC ${resume.imc} · ${resume.imcLabel?.label}
              </div>` : ''}
          </div>` : ''}
      </div>

      <!-- ✅ NOUVEAU v2.0 — Stats rapides -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { val:totalSeances, label:'Séances', emoji:'💪',
            color:'var(--fd-indigo)'   },
          { val:`${streak}🔥`, label:'Streak',  emoji:'',
            color:'var(--fd-lemon)'    },
          { val:totalPRs,    label:'PRs',    emoji:'🏆',
            color:'var(--fd-mint)'     }
        ].map(s => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:12px;text-align:center">
            <div style="font-size:1.2rem;font-weight:800;
                        color:${s.color}">${s.val}</div>
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-top:2px">${s.label}</div>
          </div>`).join('')}
      </div>

      <!-- OBJECTIF & PROGRAMME -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          🎯 Objectif & Programme
        </div>
        <div style="display:flex;align-items:center;
                    gap:12px;margin-bottom:10px">
          <div style="width:40px;height:40px;border-radius:12px;
                      background:${resume.objectifCouleur}22;
                      border:1px solid ${resume.objectifCouleur}44;
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.2rem;
                      flex-shrink:0">
            ${resume.objectif.split(' ')[0]}
          </div>
          <div>
            <div style="font-size:.9rem;font-weight:700;
                        color:${resume.objectifCouleur}">
              ${resume.objectif}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              ${resume.reps} reps · Repos ${resume.repos}
              · ${resume.seances}j/semaine
            </div>
          </div>
        </div>
        <div style="padding:8px 12px;
                    background:rgba(75,75,249,0.06);
                    border:1px solid rgba(75,75,249,0.15);
                    border-radius:var(--radius-md);
                    font-size:.72rem;color:var(--text-muted)">
          💡 ${resume.conseil}
        </div>

        ${resume.muscles.length > 0 ? `
          <div style="margin-top:10px">
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-bottom:6px">🎯 Muscles ciblés</div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              ${resume.muscles.map(m => `
                <span style="padding:3px 10px;
                             background:rgba(75,75,249,0.15);
                             border:1px solid rgba(75,75,249,0.25);
                             border-radius:99px;
                             font-size:.62rem;font-weight:700;
                             color:var(--fd-lavender)">
                  ${m}</span>`).join('')}
            </div>
          </div>` : ''}
      </div>

      <!-- NUTRITION -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;margin-bottom:12px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted)">
            🥗 Nutrition recommandée
          </div>
          <button onclick="naviguer('nutrition')"
                  style="font-size:.65rem;color:var(--fd-indigo);
                         background:none;border:none;
                         cursor:pointer;font-weight:600">
            Voir →
          </button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);
                    gap:8px">
          ${[
            { label:'Calories',  val:`${nut.calories} kcal`,
              color:'var(--fd-lemon)',    emoji:'🔥' },
            { label:'Protéines', val:`${nut.proteines}g`,
              color:'var(--fd-coral)',    emoji:'🥩' },
            { label:'Glucides',  val:`${nut.glucides}g`,
              color:'var(--fd-mint)',     emoji:'🍚' },
            { label:'Lipides',   val:`${nut.lipides}g`,
              color:'var(--fd-lavender)', emoji:'🥑' }
          ].map(n => `
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);
                        padding:10px;text-align:center">
              <div style="font-size:.85rem;margin-bottom:3px">
                ${n.emoji}</div>
              <div style="font-size:.9rem;font-weight:800;
                          color:${n.color}">${n.val}</div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          margin-top:2px;text-transform:uppercase">
                ${n.label}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:8px;padding:8px 12px;
                    background:rgba(75,75,249,0.06);
                    border-radius:var(--radius-md);
                    display:flex;align-items:center;
                    justify-content:space-between">
          <span style="font-size:.72rem;color:var(--text-muted)">
            💧 Eau recommandée</span>
          <span style="font-size:.82rem;font-weight:700;
                       color:var(--fd-indigo)">
            ${nut.eau}L / jour</span>
        </div>
        <div style="margin-top:8px;font-size:.62rem;
                    color:var(--text-muted);line-height:1.4">
          * Calculé via Harris-Benedict selon ton poids,
          taille et objectif
        </div>
      </div>

      <!-- ✅ NOUVEAU v2.0 — Thème -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          🎨 Personnalisation
        </div>
        ${this._renderThemeSelector()}
      </div>

      <!-- ACTIONS -->
      <div style="display:flex;flex-direction:column;
                  gap:8px;margin-bottom:14px">
        <button onclick="Profil._ouvrirEdition()"
                class="btn-primary" style="width:100%">
          ✏️ Modifier mon profil
        </button>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px">
          <button onclick="naviguer('training')"
                  class="btn-secondary" style="font-size:.82rem">
            📅 Mon programme
          </button>
          <button onclick="naviguer('stats')"
                  class="btn-secondary" style="font-size:.82rem">
            📊 Mes stats
          </button>
        </div>
      </div>
    `;
  },

  // ✅ NOUVEAU v2.0 — Sélecteur de thème
  _renderThemeSelector() {
    const themeActuel = Utils.storage.get(
      this.CLE_THEME, 'dark'
    );

    return `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);
                  gap:6px">
        ${Object.entries(this.THEMES).map(([val, theme]) => `
          <button onclick="Profil._changerTheme('${val}')"
                  style="padding:10px 6px;text-align:center;
                         background:${themeActuel === val
                           ? 'rgba(75,75,249,0.2)'
                           : 'rgba(255,255,255,0.04)'};
                         border:1px solid ${themeActuel === val
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.1)'};
                         border-radius:var(--radius-md);
                         cursor:pointer;transition:all .2s">
            <div style="font-size:.9rem;margin-bottom:3px">
              ${theme.label.split(' ')[0]}
            </div>
            <div style="font-size:.62rem;font-weight:600;
                        color:${themeActuel === val
                          ? 'var(--fd-indigo)'
                          : 'var(--text-muted)'}">
              ${theme.label.split(' ').slice(1).join(' ')}
            </div>
          </button>`).join('')}
      </div>
      <div style="margin-top:8px;font-size:.65rem;
                  color:var(--text-muted);text-align:center">
        Typographies et logos bientôt disponibles
      </div>
    `;
  },

  // ✅ NOUVEAU v2.0 — Changer thème
  _changerTheme(theme) {
    Utils.storage.set(this.CLE_THEME, theme);

    // Appliquer le thème
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }

    Utils.toast(
      `🎨 Thème ${this.THEMES[theme]?.label} appliqué !`,
      'success', 1500
    );

    // Re-render la section thème
    const container = document.getElementById('page-mon_profil')
      || document.querySelector('[id*="profil"]');
    if (container) this.renderPage(container);
  },

  // ════════════════════════════════════════════════════════
  // RENDER CORPS SVG CLIQUABLE
  // ════════════════════════════════════════════════════════
  renderCorpsSVG(musclesCibles = [], onToggle = null) {
    const selectionnes = new Set(musclesCibles);

    return `
      <div id="corps-svg-wrapper" style="user-select:none">
        <div style="text-align:center;font-size:.7rem;
                    font-weight:700;color:var(--text-muted);
                    margin-bottom:8px;text-transform:uppercase;
                    letter-spacing:.08em">
          Clique sur les zones à cibler
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:12px">

          <!-- FACE AVANT -->
          <div style="text-align:center">
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-bottom:4px">Avant</div>
            <svg viewBox="0 0 120 280"
                 style="width:100%;max-width:140px;height:auto;
                        display:block;margin:0 auto">
              <!-- Tête -->
              <ellipse cx="60" cy="22" rx="14" ry="16"
                       fill="rgba(255,255,255,0.06)"
                       stroke="rgba(255,255,255,0.15)"
                       stroke-width="1"/>
              <rect x="55" y="36" width="10" height="8"
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.1)"
                    stroke-width="1"/>
              <!-- ÉPAULES -->
              <ellipse cx="35" cy="52" rx="12" ry="8"
                       fill="${selectionnes.has('epaules') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                       stroke="${selectionnes.has('epaules') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                       stroke-width="1.5" style="cursor:pointer"
                       onclick="Profil._toggleMuscleModal('epaules')"/>
              <ellipse cx="85" cy="52" rx="12" ry="8"
                       fill="${selectionnes.has('epaules') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                       stroke="${selectionnes.has('epaules') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                       stroke-width="1.5" style="cursor:pointer"
                       onclick="Profil._toggleMuscleModal('epaules')"/>
              <!-- PECTORAUX -->
              <path d="M44 46 Q60 42 76 46 L78 68 Q60 72 42 68 Z"
                    fill="${selectionnes.has('pectoraux') ? 'rgba(75,75,249,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('pectoraux') ? '#4b4bf9' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('pectoraux')"/>
              <!-- BICEPS -->
              <rect x="22" y="50" width="12" height="46" rx="6"
                    fill="${selectionnes.has('biceps') ? 'rgba(139,240,187,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('biceps') ? '#8bf0bb' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('biceps')"/>
              <rect x="86" y="50" width="12" height="46" rx="6"
                    fill="${selectionnes.has('biceps') ? 'rgba(139,240,187,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('biceps') ? '#8bf0bb' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('biceps')"/>
              <!-- Avant-bras -->
              <rect x="20" y="98" width="10" height="30" rx="5"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <rect x="90" y="98" width="10" height="30" rx="5"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <!-- ABDOS -->
              <rect x="47" y="70" width="26" height="50" rx="4"
                    fill="${selectionnes.has('abdos') ? 'rgba(249,239,119,0.4)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('abdos') ? '#f9ef77' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('abdos')"/>
              ${selectionnes.has('abdos') ? `
                <line x1="60" y1="75" x2="60" y2="118"
                      stroke="#f9ef7766" stroke-width="1"/>
                <line x1="47" y1="88" x2="73" y2="88"
                      stroke="#f9ef7766" stroke-width="1"/>
                <line x1="47" y1="100" x2="73" y2="100"
                      stroke="#f9ef7766" stroke-width="1"/>
              ` : ''}
              <!-- QUADRICEPS -->
              <rect x="44" y="145" width="22" height="60" rx="8"
                    fill="${selectionnes.has('quadriceps') ? 'rgba(255,141,150,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('quadriceps') ? '#ff8d96' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('quadriceps')"/>
              <rect x="68" y="145" width="22" height="60" rx="8"
                    fill="${selectionnes.has('quadriceps') ? 'rgba(255,141,150,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('quadriceps') ? '#ff8d96' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('quadriceps')"/>
              <!-- Genoux + Tibias -->
              <ellipse cx="55" cy="210" rx="10" ry="7"
                       fill="rgba(255,255,255,0.04)"
                       stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <ellipse cx="79" cy="210" rx="10" ry="7"
                       fill="rgba(255,255,255,0.04)"
                       stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <rect x="48" y="218" width="14" height="44" rx="6"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
              <rect x="72" y="218" width="14" height="44" rx="6"
                    fill="rgba(255,255,255,0.04)"
                    stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
              <!-- Bassin -->
              <path d="M42 120 Q60 115 78 120 L80 145 Q60 148 40 145 Z"
                    fill="rgba(255,255,255,0.05)"
                    stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <!-- Labels -->
              ${selectionnes.has('epaules')
                ? `<text x="60" y="56" text-anchor="middle" fill="#bfa1ff" font-size="5" font-weight="700">Épaules</text>` : ''}
              ${selectionnes.has('pectoraux')
                ? `<text x="60" y="59" text-anchor="middle" fill="#4b4bf9" font-size="5" font-weight="700">Pec</text>` : ''}
              ${selectionnes.has('biceps')
                ? `<text x="28" y="74" text-anchor="middle" fill="#8bf0bb" font-size="4.5" font-weight="700">Bi</text>
                   <text x="92" y="74" text-anchor="middle" fill="#8bf0bb" font-size="4.5" font-weight="700">Bi</text>` : ''}
              ${selectionnes.has('abdos')
                ? `<text x="60" y="97" text-anchor="middle" fill="#f9ef77" font-size="5" font-weight="700">Abdos</text>` : ''}
              ${selectionnes.has('quadriceps')
                ? `<text x="55" y="175" text-anchor="middle" fill="#ff8d96" font-size="4.5" font-weight="700">Quad</text>
                   <text x="79" y="175" text-anchor="middle" fill="#ff8d96" font-size="4.5" font-weight="700">Quad</text>` : ''}
            </svg>
          </div>

          <!-- FACE ARRIÈRE -->
          <div style="text-align:center">
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-bottom:4px">Arrière</div>
            <svg viewBox="0 0 120 280"
                 style="width:100%;max-width:140px;height:auto;
                        display:block;margin:0 auto">
              <!-- Tête -->
              <ellipse cx="60" cy="22" rx="14" ry="16"
                       fill="rgba(255,255,255,0.06)"
                       stroke="rgba(255,255,255,0.15)"
                       stroke-width="1"/>
              <rect x="55" y="36" width="10" height="8"
                    fill="rgba(255,255,255,0.06)"
                    stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              <!-- TRAPÈZE -->
              <path d="M48 38 Q60 34 72 38 L78 52 Q60 48 42 52 Z"
                    fill="${selectionnes.has('trapeze') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('trapeze') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('trapeze')"/>
              <!-- ÉPAULES ARRIÈRE -->
              <ellipse cx="34" cy="52" rx="12" ry="8"
                       fill="${selectionnes.has('epaules') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                       stroke="${selectionnes.has('epaules') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                       stroke-width="1.5" style="cursor:pointer"
                       onclick="Profil._toggleMuscleModal('epaules')"/>
              <ellipse cx="86" cy="52" rx="12" ry="8"
                       fill="${selectionnes.has('epaules') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                       stroke="${selectionnes.has('epaules') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                       stroke-width="1.5" style="cursor:pointer"
                       onclick="Profil._toggleMuscleModal('epaules')"/>
              <!-- DOS -->
              <path d="M42 50 Q60 46 78 50 L80 118 Q60 122 40 118 Z"
                    fill="${selectionnes.has('dos') ? 'rgba(75,75,249,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('dos') ? '#4b4bf9' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('dos')"/>
              <!-- TRICEPS -->
              <rect x="22" y="50" width="12" height="46" rx="6"
                    fill="${selectionnes.has('triceps') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('triceps') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('triceps')"/>
              <rect x="86" y="50" width="12" height="46" rx="6"
                    fill="${selectionnes.has('triceps') ? 'rgba(191,161,255,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('triceps') ? '#bfa1ff' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('triceps')"/>
              <!-- FESSIERS -->
              <path d="M42 118 Q60 114 78 118 L80 155 Q60 160 40 155 Z"
                    fill="${selectionnes.has('fessiers') ? 'rgba(255,141,150,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('fessiers') ? '#ff8d96' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('fessiers')"/>
              <!-- ISCHIO -->
              <rect x="44" y="155" width="22" height="52" rx="8"
                    fill="${selectionnes.has('ischio') ? 'rgba(139,240,187,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('ischio') ? '#8bf0bb' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('ischio')"/>
              <rect x="68" y="155" width="22" height="52" rx="8"
                    fill="${selectionnes.has('ischio') ? 'rgba(139,240,187,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('ischio') ? '#8bf0bb' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('ischio')"/>
              <!-- MOLLETS -->
              <rect x="47" y="214" width="16" height="40" rx="7"
                    fill="${selectionnes.has('mollets') ? 'rgba(249,239,119,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('mollets') ? '#f9ef77' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('mollets')"/>
              <rect x="71" y="214" width="16" height="40" rx="7"
                    fill="${selectionnes.has('mollets') ? 'rgba(249,239,119,0.5)' : 'rgba(255,255,255,0.06)'}"
                    stroke="${selectionnes.has('mollets') ? '#f9ef77' : 'rgba(255,255,255,0.15)'}"
                    stroke-width="1.5" style="cursor:pointer"
                    onclick="Profil._toggleMuscleModal('mollets')"/>
              <!-- Labels -->
              ${selectionnes.has('trapeze')
                ? `<text x="60" y="46" text-anchor="middle" fill="#bfa1ff" font-size="4.5" font-weight="700">Trap</text>` : ''}
              ${selectionnes.has('dos')
                ? `<text x="60" y="86" text-anchor="middle" fill="#4b4bf9" font-size="5" font-weight="700">DOS</text>` : ''}
              ${selectionnes.has('triceps')
                ? `<text x="28" y="74" text-anchor="middle" fill="#bfa1ff" font-size="4.5" font-weight="700">Tri</text>
                   <text x="92" y="74" text-anchor="middle" fill="#bfa1ff" font-size="4.5" font-weight="700">Tri</text>` : ''}
              ${selectionnes.has('fessiers')
                ? `<text x="60" y="140" text-anchor="middle" fill="#ff8d96" font-size="5" font-weight="700">Fessiers</text>` : ''}
              ${selectionnes.has('ischio')
                ? `<text x="55" y="182" text-anchor="middle" fill="#8bf0bb" font-size="4" font-weight="700">Ischio</text>
                   <text x="79" y="182" text-anchor="middle" fill="#8bf0bb" font-size="4" font-weight="700">Ischio</text>` : ''}
              ${selectionnes.has('mollets')
                ? `<text x="55" y="236" text-anchor="middle" fill="#f9ef77" font-size="4" font-weight="700">Mol</text>
                   <text x="79" y="236" text-anchor="middle" fill="#f9ef77" font-size="4" font-weight="700">Mol</text>` : ''}
            </svg>
          </div>
        </div>

        <!-- Chips -->
        <div id="muscles-chips"
             style="display:flex;flex-wrap:wrap;gap:6px;
                    justify-content:center;min-height:32px">
          ${musclesCibles.length === 0 ? `
            <span style="font-size:.72rem;
                         color:var(--text-muted);
                         font-style:italic">
              Aucun muscle ciblé — tout le corps
            </span>` :
            musclesCibles.map(m => `
              <span onclick="Profil._toggleMuscleModal('${m}')"
                    style="display:flex;align-items:center;
                           gap:5px;padding:4px 10px;
                           background:${Profil.MUSCLES[m]?.couleur || '#4b4bf9'}22;
                           border:1px solid ${Profil.MUSCLES[m]?.couleur || '#4b4bf9'}66;
                           border-radius:99px;font-size:.65rem;
                           font-weight:700;cursor:pointer;
                           color:${Profil.MUSCLES[m]?.couleur || '#4b4bf9'}">
                ${Profil.MUSCLES[m]?.label || m}
                <span style="font-size:.55rem;opacity:.6">✕</span>
              </span>`).join('')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // TOGGLE MUSCLE — ✅ v2.0 sans perte d'état
  // ════════════════════════════════════════════════════════
  _musclesCiblesTemp: [],

  // ✅ NOUVEAU v2.0 — Toggle dans modal (state en mémoire)
  _toggleMuscleModal(muscle) {
    // ✅ Utiliser _tmpData pour ne pas écraser le profil
    //    tant que la modal n'est pas sauvegardée
    if (!this._tmpData) this._tmpData = { ...this.get() };
    if (!this._tmpData.muscles_cibles) {
      this._tmpData.muscles_cibles = [];
    }

    const muscles = this._tmpData.muscles_cibles;
    const idx     = muscles.indexOf(muscle);

    if (idx === -1) muscles.push(muscle);
    else            muscles.splice(idx, 1);

    this._tmpData.muscles_cibles = muscles;

    // ✅ Re-render le container SVG dans la modal
    const container = document.getElementById('corps-svg-container');
    if (container) {
      container.innerHTML = this.renderCorpsSVG(muscles);
    }

    Utils.vibrer([20]);
  },

  // ✅ _toggleMuscle (depuis page profil, hors modal)
  _toggleMuscle(muscle) {
    const profil  = this.get();
    const muscles = [...(profil.muscles_cibles || [])];
    const idx     = muscles.indexOf(muscle);

    if (idx === -1) muscles.push(muscle);
    else            muscles.splice(idx, 1);

    this.set({ muscles_cibles: muscles });

    const wrapper = document.getElementById('corps-svg-wrapper');
    if (wrapper) {
      const parent = wrapper.parentElement;
      if (parent) parent.innerHTML = this.renderCorpsSVG(muscles);
    }

    Utils.vibrer([20]);
    Utils.toast(
      idx === -1
        ? `✅ ${this.MUSCLES[muscle]?.label || muscle} ajouté`
        : `${this.MUSCLES[muscle]?.label || muscle} retiré`,
      'success', 800
    );
  },

  // ════════════════════════════════════════════════════════
  // MODAL ÉDITION — ✅ v2.0 muscles depuis _tmpData
  // ════════════════════════════════════════════════════════
  _ouvrirEdition() {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const profil = this.get();

    // ✅ Init _tmpData avec le profil actuel
    this._tmpData = { ...profil };

    content.innerHTML = `
      <div style="padding:16px">

        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:16px">
          ✏️ Modifier mon profil
        </div>

        <!-- GENRE -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            👤 Genre
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:8px">
            ${['homme','femme'].map(g => `
              <button onclick="Profil._tmpSet('genre','${g}');
                      document.querySelectorAll('.btn-genre')
                        .forEach(b=>b.style.background='rgba(255,255,255,0.04)');
                      this.style.background='rgba(75,75,249,0.2)'"
                      class="btn-genre"
                      style="padding:12px;
                             background:${(profil.genre||'') === g
                               ? 'rgba(75,75,249,0.2)'
                               : 'rgba(255,255,255,0.04)'};
                             border:1px solid ${(profil.genre||'') === g
                               ? 'rgba(75,75,249,0.4)'
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-md);
                             font-size:.85rem;font-weight:700;
                             color:var(--text-primary);cursor:pointer">
                ${g === 'homme' ? '👨 Homme' : '👩 Femme'}
              </button>`).join('')}
          </div>
        </div>

        <!-- INFOS DE BASE -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            📋 Informations
          </div>
          <input class="input mb-sm" id="edit-nom"
                 placeholder="Prénom *"
                 value="${profil.nom || ''}"/>
          <div style="display:grid;
                      grid-template-columns:1fr 1fr 1fr;
                      gap:8px">
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);
                          margin-bottom:4px">Poids (kg)</div>
              <input class="input" id="edit-poids" type="number"
                     placeholder="80"
                     value="${profil.poids || ''}"/>
            </div>
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);
                          margin-bottom:4px">Taille (cm)</div>
              <input class="input" id="edit-taille" type="number"
                     placeholder="175"
                     value="${profil.taille || ''}"/>
            </div>
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);
                          margin-bottom:4px">Âge</div>
              <input class="input" id="edit-age" type="number"
                     placeholder="25"
                     value="${profil.age || ''}"/>
            </div>
          </div>
        </div>

        <!-- OBJECTIF -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            🎯 Objectif
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:6px">
            ${Object.entries(this.OBJECTIFS).map(([val, obj]) => `
              <button onclick="Profil._tmpSet('objectif','${val}');
                      document.querySelectorAll('.btn-obj').forEach(b=>{
                        b.style.background='rgba(255,255,255,0.04)';
                        b.style.borderColor='rgba(255,255,255,0.1)';
                      });
                      this.style.background='${obj.couleur}22';
                      this.style.borderColor='${obj.couleur}66'"
                      class="btn-obj"
                      style="padding:10px 8px;text-align:left;
                             background:${profil.objectif === val
                               ? `${obj.couleur}22`
                               : 'rgba(255,255,255,0.04)'};
                             border:1px solid ${profil.objectif === val
                               ? `${obj.couleur}66`
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-md);
                             cursor:pointer">
                <div style="font-size:.78rem;font-weight:700;
                            color:var(--text-primary)">
                  ${obj.label}</div>
                <div style="font-size:.58rem;color:var(--text-muted);
                            margin-top:2px">${obj.desc}</div>
              </button>`).join('')}
          </div>
        </div>

        <!-- NIVEAU -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            📊 Niveau
          </div>
          <div style="display:grid;
                      grid-template-columns:repeat(3,1fr);gap:6px">
            ${Object.entries(this.NIVEAUX).map(([val, niv]) => `
              <button onclick="Profil._tmpSet('niveau','${val}');
                      document.querySelectorAll('.btn-niv').forEach(b=>{
                        b.style.background='rgba(255,255,255,0.04)';
                        b.style.borderColor='rgba(255,255,255,0.1)';
                      });
                      this.style.background='rgba(75,75,249,0.2)';
                      this.style.borderColor='rgba(75,75,249,0.4)'"
                      class="btn-niv"
                      style="padding:10px 6px;text-align:center;
                             background:${profil.niveau === val
                               ? 'rgba(75,75,249,0.2)'
                               : 'rgba(255,255,255,0.04)'};
                             border:1px solid ${profil.niveau === val
                               ? 'rgba(75,75,249,0.4)'
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-md);
                             cursor:pointer">
                <div style="font-size:.82rem;font-weight:700">
                  ${niv.label}</div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  ${niv.desc}</div>
              </button>`).join('')}
          </div>
        </div>

        <!-- LIEU -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            📍 Lieu d'entraînement
          </div>
          <div style="display:grid;
                      grid-template-columns:repeat(3,1fr);gap:6px">
            ${Object.entries(this.LIEUX).map(([val, lieu]) => `
              <button onclick="Profil._tmpSet('lieu','${val}');
                      document.querySelectorAll('.btn-lieu').forEach(b=>{
                        b.style.background='rgba(255,255,255,0.04)';
                        b.style.borderColor='rgba(255,255,255,0.1)';
                      });
                      this.style.background='rgba(139,240,187,0.15)';
                      this.style.borderColor='rgba(139,240,187,0.3)'"
                      class="btn-lieu"
                      style="padding:10px 6px;text-align:center;
                             background:${(profil.lieu||'salle') === val
                               ? 'rgba(139,240,187,0.15)'
                               : 'rgba(255,255,255,0.04)'};
                             border:1px solid ${(profil.lieu||'salle') === val
                               ? 'rgba(139,240,187,0.3)'
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-md);
                             cursor:pointer">
                <div style="font-size:.85rem;margin-bottom:3px">
                  ${lieu.label.split(' ')[0]}</div>
                <div style="font-size:.7rem;font-weight:700">
                  ${lieu.label.split(' ').slice(1).join(' ')}</div>
                <div style="font-size:.55rem;color:var(--text-muted);
                            margin-top:2px">${lieu.desc}</div>
              </button>`).join('')}
          </div>
        </div>

        <!-- CORPS SVG dans modal -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            🎯 Muscles à cibler
          </div>
          <div id="corps-svg-container">
            ${this.renderCorpsSVG(profil.muscles_cibles || [])}
          </div>
        </div>

        <!-- BOUTONS -->
        <div style="display:grid;grid-template-columns:1fr 2fr;
                    gap:8px;margin-top:16px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            Annuler
          </button>
          <button onclick="Profil._sauvegarderEdition()"
                  class="btn-primary" style="font-size:.88rem">
            💾 Sauvegarder
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  _tmpData: {},
  _tmpSet(key, val) {
    if (!this._tmpData) this._tmpData = {};
    this._tmpData[key] = val;
  },

  // ✅ v2.0 — muscles_cibles depuis _tmpData
  _sauvegarderEdition() {
    const nom    = document.getElementById('edit-nom')
      ?.value?.trim();
    const poids  = parseFloat(
      document.getElementById('edit-poids')?.value);
    const taille = parseFloat(
      document.getElementById('edit-taille')?.value);
    const age    = parseInt(
      document.getElementById('edit-age')?.value);

    if (!nom) {
      Utils.toast('Entre ton prénom !', 'error');
      return;
    }

    const miseAJour = {
      ...this._tmpData,
      nom,
      poids:          isNaN(poids)  ? this._tmpData.poids  : poids,
      taille:         isNaN(taille) ? this._tmpData.taille : taille,
      age:            isNaN(age)    ? this._tmpData.age    : age,
      // ✅ FIX v2.0 — muscles depuis _tmpData
      muscles_cibles: this._tmpData.muscles_cibles || []
    };

    this.set(miseAJour);

    document.getElementById('modal-info')?.classList.add('hidden');

    Utils.toast('✅ Profil mis à jour !', 'success');
    Utils.vibrerSuccess();

    // ✅ Re-render la page profil si active
    const container = document.getElementById('page-mon_profil')
      || document.querySelector('[id*="profil"]');
    if (container && window._pageActive === 'mon_profil') {
      this.renderPage(container);
    }

    // ✅ Re-render home si active
    const home = document.getElementById('page-home');
    if (home && window._pageActive === 'home') {
      try { _rendreHome(home); } catch(e) {}
    }

    // ✅ NOUVEAU v2.0 — Appliquer planning selon genre + lieu
    try {
      Programme.appliquerPlanningGenre(
        miseAJour.genre || 'homme',
        miseAJour.lieu  || 'salle'
      );
    } catch(e) {}
  }
};

window.Profil = Profil;
console.log('✅ Profil.js v2.0 chargé — Sync onboarding + Thème + Fix muscles');
