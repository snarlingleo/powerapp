/* ============================================================
   PowerApp — Gamification v6.0
   ✅ Tout v5.0 conservé
   ✅ Avatar RPG qui évolue avec les muscles
   ✅ Quêtes hebdomadaires avec récompenses
   ✅ Classement mondial simulé par 1RM
   ✅ Saisons compétitives (12 semaines)
   ✅ Loot boxes (programmes secrets)
   ✅ Animations de déblocage
   ✅ Barre XP animée
   ✅ Badges collectables
   ============================================================ */

const Gamification = {

  // ════════════════════════════════════════════════════════
  // NIVEAUX
  // ════════════════════════════════════════════════════════
  NIVEAUX: [
    { numero:1, nom:'Débutant',    emoji:'🌱', xpMin:0,     xpSuivant:500,   couleur:'#8bf0bb' },
    { numero:2, nom:'Apprenti',    emoji:'💪', xpMin:500,   xpSuivant:1200,  couleur:'#4b4bf9' },
    { numero:3, nom:'Confirmé',    emoji:'🏃', xpMin:1200,  xpSuivant:2500,  couleur:'#bfa1ff' },
    { numero:4, nom:'Athlète',     emoji:'⚡', xpMin:2500,  xpSuivant:5000,  couleur:'#f9ef77' },
    { numero:5, nom:'Expert',      emoji:'🔥', xpMin:5000,  xpSuivant:10000, couleur:'#ffa500' },
    { numero:6, nom:'Élite',       emoji:'💎', xpMin:10000, xpSuivant:20000, couleur:'#ff8d96' },
    { numero:7, nom:'Légende',     emoji:'👑', xpMin:20000, xpSuivant:50000, couleur:'#f9ef77' },
    { numero:8, nom:'Immortel',    emoji:'⭐', xpMin:50000, xpSuivant:99999, couleur:'#ffffff' }
  ],

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — AVATARS RPG
  // ════════════════════════════════════════════════════════
  AVATARS_RPG: {
    1: { corps:'🧍', titre:'Novice',        aura:'',     description:'Ton aventure commence' },
    2: { corps:'🏃', titre:'Coureur',       aura:'',     description:'Tu prends le rythme'   },
    3: { corps:'💪', titre:'Guerrier',      aura:'',     description:'La force grandit'       },
    4: { corps:'⚡', titre:'Champion',      aura:'✨',   description:'L\'éclat du talent'     },
    5: { corps:'🔥', titre:'Maître',        aura:'🌟',   description:'Respect absolu'         },
    6: { corps:'💎', titre:'Élite',         aura:'⚡🌟', description:'Parmi les meilleurs'    },
    7: { corps:'👑', titre:'Légende',       aura:'🔥⚡', description:'Ton nom résonne'        },
    8: { corps:'⭐', titre:'Immortel',      aura:'👑🔥', description:'Au-delà des limites'    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — QUÊTES HEBDOMADAIRES
  // ════════════════════════════════════════════════════════
  QUETES_POOL: [
    {
      id:          'quete_3_seances',
      titre:       '3 séances cette semaine',
      emoji:       '💪',
      description: 'Complète 3 séances en 7 jours',
      xp:          150,
      type:        'seances',
      cible:       3,
      difficulte:  'facile'
    },
    {
      id:          'quete_4_seances',
      titre:       '4 séances cette semaine',
      emoji:       '🏋️',
      description: 'Complète 4 séances en 7 jours',
      xp:          250,
      type:        'seances',
      cible:       4,
      difficulte:  'moyen'
    },
    {
      id:          'quete_5_seances',
      titre:       'Semaine infernale',
      emoji:       '🔥',
      description: 'Complète 5 séances en 7 jours',
      xp:          400,
      type:        'seances',
      cible:       5,
      difficulte:  'difficile'
    },
    {
      id:          'quete_pr',
      titre:       'Chasseur de records',
      emoji:       '🏆',
      description: 'Bats 1 PR cette semaine',
      xp:          200,
      type:        'prs',
      cible:       1,
      difficulte:  'moyen'
    },
    {
      id:          'quete_3_prs',
      titre:       'Triple Record',
      emoji:       '🎯',
      description: 'Bats 3 PRs cette semaine',
      xp:          450,
      type:        'prs',
      cible:       3,
      difficulte:  'difficile'
    },
    {
      id:          'quete_volume_5t',
      titre:       'Machine à volume',
      emoji:       '📦',
      description: 'Soulève 5 tonnes cette semaine',
      xp:          200,
      type:        'volume',
      cible:       5000,
      difficulte:  'moyen'
    },
    {
      id:          'quete_volume_10t',
      titre:       'Titan du volume',
      emoji:       '💥',
      description: 'Soulève 10 tonnes cette semaine',
      xp:          400,
      type:        'volume',
      cible:       10000,
      difficulte:  'difficile'
    },
    {
      id:          'quete_journal',
      titre:       'Chroniqueur',
      emoji:       '📔',
      description: 'Écris 3 entrées dans le journal',
      xp:          100,
      type:        'journal',
      cible:       3,
      difficulte:  'facile'
    },
    {
      id:          'quete_hydratation',
      titre:       'H2O Champion',
      emoji:       '💧',
      description: 'Atteins ton objectif eau 5 jours',
      xp:          150,
      type:        'hydratation',
      cible:       5,
      difficulte:  'facile'
    },
    {
      id:          'quete_streak_7',
      titre:       'Sans relâche',
      emoji:       '🔥',
      description: 'Maintiens un streak de 7 jours',
      xp:          300,
      type:        'streak',
      cible:       7,
      difficulte:  'moyen'
    },
    {
      id:          'quete_rpe_bas',
      titre:       'Zen Warrior',
      emoji:       '🧘',
      description: 'RPE moyen ≤ 7 pendant la semaine',
      xp:          200,
      type:        'rpe',
      cible:       7,
      difficulte:  'moyen'
    },
    {
      id:          'quete_serie_100',
      titre:       'Centurion des séries',
      emoji:       '💪',
      description: 'Valide 100 séries cette semaine',
      xp:          350,
      type:        'series',
      cible:       100,
      difficulte:  'difficile'
    }
  ],

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — LOOT BOXES
  // ════════════════════════════════════════════════════════
  LOOT_BOXES: {
    bronze: {
      nom:         'Coffre Bronze',
      emoji:       '📦',
      couleur:     '#cd7f32',
      xpCost:      500,
      recompenses: [
        { type:'xp',      val:100,           label:'+100 XP bonus',          chance:0.4 },
        { type:'xp',      val:200,           label:'+200 XP bonus',          chance:0.3 },
        { type:'badge',   val:'badge_force', label:'Badge Guerrier',         chance:0.2 },
        { type:'titre',   val:'Challenger',  label:'Titre "Challenger"',     chance:0.1 }
      ]
    },
    argent: {
      nom:         'Coffre Argent',
      emoji:       '🥈',
      couleur:     '#c0c0c0',
      xpCost:      1500,
      recompenses: [
        { type:'xp',      val:300,           label:'+300 XP bonus',          chance:0.35 },
        { type:'xp',      val:500,           label:'+500 XP bonus',          chance:0.25 },
        { type:'badge',   val:'badge_elite', label:'Badge Élite',            chance:0.25 },
        { type:'titre',   val:'Guerrier',    label:'Titre "Guerrier"',       chance:0.15 }
      ]
    },
    or: {
      nom:         'Coffre Or',
      emoji:       '🏆',
      couleur:     '#f9ef77',
      xpCost:      3000,
      recompenses: [
        { type:'xp',      val:750,            label:'+750 XP bonus',         chance:0.30 },
        { type:'xp',      val:1500,           label:'+1500 XP bonus',        chance:0.20 },
        { type:'badge',   val:'badge_legend', label:'Badge Légende',         chance:0.25 },
        { type:'titre',   val:'Champion',     label:'Titre "Champion"',      chance:0.15 },
        { type:'special', val:'double_xp',    label:'Double XP 24h',         chance:0.10 }
      ]
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — SAISON COMPÉTITIVE
  // ════════════════════════════════════════════════════════
  SAISON: {
    nom:     'Saison 1 — Fondations',
    emoji:   '🏆',
    duree:   12, // semaines
    recompenses: [
      { rang:'S',  label:'Immortel',   emoji:'⭐', xp:5000, couleur:'#f9ef77'  },
      { rang:'A',  label:'Élite',      emoji:'💎', xp:2500, couleur:'#bfa1ff'  },
      { rang:'B',  label:'Expert',     emoji:'🔥', xp:1000, couleur:'#ffa500'  },
      { rang:'C',  label:'Athlète',    emoji:'⚡', xp:500,  couleur:'#4b4bf9'  },
      { rang:'D',  label:'Confirmé',   emoji:'💪', xp:200,  couleur:'#8bf0bb'  }
    ]
  },

  // ════════════════════════════════════════════════════════
  // TROPHÉES (v5.0 conservé complet)
  // ════════════════════════════════════════════════════════
  TROPHEES_DEF: [
    { id:'first_session', nom:'Première séance',
      emoji:'🎯', xp:100, categorie:'debut', rare:false,
      description:'Terminer sa première séance',
      condition: d => d.totalSeances >= 1 },
    { id:'first_pr', nom:'Premier record',
      emoji:'🏆', xp:150, categorie:'debut', rare:false,
      description:'Battre un premier PR',
      condition: d => d.totalPRs >= 1 },
    { id:'first_week', nom:'Première semaine',
      emoji:'📅', xp:200, categorie:'debut', rare:false,
      description:'Compléter 4 séances en une semaine',
      condition: d => d.seancesParSemaine >= 4 },
    { id:'first_journal', nom:'Premiers mots',
      emoji:'📔', xp:75, categorie:'debut', rare:false,
      description:'Écrire dans le journal',
      condition: d => d.totalJournal >= 1 },
    { id:'first_photo', nom:'Première photo',
      emoji:'📸', xp:100, categorie:'debut', rare:false,
      description:'Ajouter une photo de progression',
      condition: d => d.totalPhotos >= 1 },
    { id:'streak_3', nom:'3 jours d\'affilée',
      emoji:'🔥', xp:100, categorie:'streak', rare:false,
      description:'Streak de 3 jours',
      condition: d => d.streak >= 3 },
    { id:'streak_7', nom:'Une semaine pleine',
      emoji:'🔥', xp:200, categorie:'streak', rare:false,
      description:'Streak de 7 jours',
      condition: d => d.streak >= 7 },
    { id:'streak_14', nom:'2 semaines non-stop',
      emoji:'🔥', xp:350, categorie:'streak', rare:false,
      description:'Streak de 14 jours',
      condition: d => d.streak >= 14 },
    { id:'streak_30', nom:'Mois de fer',
      emoji:'💎', xp:600, categorie:'streak', rare:false,
      description:'Streak de 30 jours',
      condition: d => d.streak >= 30 },
    { id:'streak_60', nom:'Machine de guerre',
      emoji:'⚡', xp:1000, categorie:'streak', rare:true,
      description:'Streak de 60 jours',
      condition: d => d.streak >= 60 },
    { id:'streak_100', nom:'Centurion du fitness',
      emoji:'👑', xp:2000, categorie:'streak', rare:true,
      description:'Streak de 100 jours',
      condition: d => d.streak >= 100 },
    { id:'sessions_5',   nom:'5 séances',
      emoji:'💪', xp:100, categorie:'seances', rare:false,
      description:'5 séances totales',
      condition: d => d.totalSeances >= 5 },
    { id:'sessions_10',  nom:'10 séances',
      emoji:'💪', xp:150, categorie:'seances', rare:false,
      description:'10 séances totales',
      condition: d => d.totalSeances >= 10 },
    { id:'sessions_25',  nom:'25 séances',
      emoji:'🏋️', xp:300, categorie:'seances', rare:false,
      description:'25 séances totales',
      condition: d => d.totalSeances >= 25 },
    { id:'sessions_50',  nom:'50 séances',
      emoji:'🎖️', xp:500, categorie:'seances', rare:false,
      description:'50 séances totales',
      condition: d => d.totalSeances >= 50 },
    { id:'sessions_100', nom:'Centurion',
      emoji:'💯', xp:1000, categorie:'seances', rare:true,
      description:'100 séances totales',
      condition: d => d.totalSeances >= 100 },
    { id:'sessions_200', nom:'Légende vivante',
      emoji:'👑', xp:2000, categorie:'seances', rare:true,
      description:'200 séances totales',
      condition: d => d.totalSeances >= 200 },
    { id:'sessions_500', nom:'Immortel',
      emoji:'⭐', xp:5000, categorie:'seances', rare:true,
      description:'500 séances totales',
      condition: d => d.totalSeances >= 500 },
    { id:'prs_3',  nom:'Premiers records',
      emoji:'🏅', xp:150, categorie:'prs', rare:false,
      description:'3 records personnels',
      condition: d => d.totalPRs >= 3 },
    { id:'prs_5',  nom:'Collectionneur',
      emoji:'🏅', xp:200, categorie:'prs', rare:false,
      description:'5 records personnels',
      condition: d => d.totalPRs >= 5 },
    { id:'prs_10', nom:'Record Man',
      emoji:'🎯', xp:400, categorie:'prs', rare:false,
      description:'10 records personnels',
      condition: d => d.totalPRs >= 10 },
    { id:'prs_20', nom:'Maître des records',
      emoji:'👑', xp:800, categorie:'prs', rare:true,
      description:'20 records personnels',
      condition: d => d.totalPRs >= 20 },
    { id:'bench_80',      nom:'Pecto de feu',
      emoji:'🔥', xp:300, categorie:'force', rare:false,
      description:'Développé couché 80kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 80 },
    { id:'bench_100',     nom:'Club des 100',
      emoji:'💎', xp:600, categorie:'force', rare:false,
      description:'Développé couché 100kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 100 },
    { id:'bench_120',     nom:'Pectoraux d\'élite',
      emoji:'💥', xp:1000, categorie:'force', rare:true,
      description:'Développé couché 120kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 120 },
    { id:'squat_100',     nom:'Jambes d\'acier',
      emoji:'🦵', xp:600, categorie:'force', rare:false,
      description:'Squat 100kg',
      condition: d => (d.prs['squat']?.poids||0) >= 100 },
    { id:'squat_140',     nom:'Squat King',
      emoji:'👑', xp:1000, categorie:'force', rare:true,
      description:'Squat 140kg',
      condition: d => (d.prs['squat']?.poids||0) >= 140 },
    { id:'deadlift_100',  nom:'Terre ferme',
      emoji:'🏋️', xp:600, categorie:'force', rare:false,
      description:'Soulevé de terre 100kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 100 },
    { id:'deadlift_140',  nom:'Force brute',
      emoji:'💥', xp:1000, categorie:'force', rare:true,
      description:'Soulevé de terre 140kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 140 },
    { id:'deadlift_180',  nom:'Titan',
      emoji:'⭐', xp:2000, categorie:'force', rare:true,
      description:'Soulevé de terre 180kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 180 },
    { id:'ohp_60',        nom:'Épaules de fer',
      emoji:'💪', xp:300, categorie:'force', rare:false,
      description:'Développé militaire 60kg',
      condition: d => (d.prs['dev_militaire']?.poids||0) >= 60 },
    { id:'phase_1', nom:'Phase 1 terminée',
      emoji:'🌱', xp:400, categorie:'programme', rare:false,
      description:'Compléter la Phase Reprise',
      condition: d => d.phasesTerminees >= 1 },
    { id:'cycle_1', nom:'Cycle complet',
      emoji:'🏆', xp:1000, categorie:'programme', rare:true,
      description:'Compléter un cycle de 16 semaines',
      condition: d => d.cyclesTermines >= 1 },
    { id:'cycle_3', nom:'Triplé',
      emoji:'🎖️', xp:2500, categorie:'programme', rare:true,
      description:'Compléter 3 cycles',
      condition: d => d.cyclesTermines >= 3 },
    { id:'volume_10T', nom:'10 tonnes',
      emoji:'💎', xp:300, categorie:'volume', rare:false,
      description:'Atteindre 10 tonnes de volume total',
      condition: d => d.volumeTotal >= 10000 },
    { id:'volume_100T', nom:'100 tonnes',
      emoji:'👑', xp:1000, categorie:'volume', rare:true,
      description:'Atteindre 100 tonnes de volume total',
      condition: d => d.volumeTotal >= 100000 },
    { id:'comeback', nom:'Le Retour',
      emoji:'🦅', xp:200, categorie:'special', rare:false,
      description:'Reprendre après 7+ jours d\'absence',
      condition: d => d.comeback },
    { id:'journal_10', nom:'Chroniqueur',
      emoji:'📔', xp:150, categorie:'special', rare:false,
      description:'10 entrées dans le journal',
      condition: d => d.totalJournal >= 10 },
    { id:'journal_50', nom:'Mémorialiste',
      emoji:'📚', xp:400, categorie:'special', rare:false,
      description:'50 entrées dans le journal',
      condition: d => d.totalJournal >= 50 },
    { id:'objectif_atteint', nom:'Objectif accompli',
      emoji:'🎯', xp:500, categorie:'special', rare:false,
      description:'Atteindre un objectif personnel',
      condition: d => d.objectifsAtteints >= 1 },
    { id:'perfect_week', nom:'Semaine parfaite',
      emoji:'✨', xp:300, categorie:'special', rare:false,
      description:'Compléter toutes les séances planifiées',
      condition: d => d.semaineParf >= 1 },
    { id:'photos_5', nom:'Photographe',
      emoji:'📸', xp:200, categorie:'special', rare:false,
      description:'5 photos de progression',
      condition: d => d.totalPhotos >= 5 },
    { id:'express_10', nom:'Speed Runner',
      emoji:'⚡', xp:250, categorie:'special', rare:false,
      description:'10 séances express',
      condition: d => d.seancesExpress >= 10 },
    { id:'lower_body_10', nom:'Reine du Lower',
      emoji:'🍑', xp:250, categorie:'femme', rare:false,
      description:'10 séances Lower Body',
      condition: d => d.seancesLowerBody >= 10 },
    { id:'lower_body_50', nom:'Légende des fessiers',
      emoji:'👑', xp:600, categorie:'femme', rare:true,
      description:'50 séances Lower Body',
      condition: d => d.seancesLowerBody >= 50 },
    { id:'first_hip_thrust_pr', nom:'Hip Thrust Queen',
      emoji:'🍑', xp:300, categorie:'femme', rare:false,
      description:'Battre un PR au Hip Thrust',
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) > 0
        || (d.prs['hip_thrust']?.poids||0) > 0 },
    { id:'hip_thrust_60', nom:'Fessiers de feu',
      emoji:'🔥', xp:400, categorie:'femme', rare:false,
      description:'Hip Thrust 60kg',
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) >= 60
        || (d.prs['hip_thrust']?.poids||0) >= 60 },
    { id:'hip_thrust_100', nom:'Puissance féminine',
      emoji:'💥', xp:800, categorie:'femme', rare:true,
      description:'Hip Thrust 100kg',
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) >= 100
        || (d.prs['hip_thrust']?.poids||0) >= 100 },
    { id:'avant_apres', nom:'Transformation',
      emoji:'🌟', xp:400, categorie:'femme', rare:false,
      description:'Ajouter 2+ photos de progression',
      condition: d => d.totalPhotos >= 2 },
    { id:'objectifs_femme_5', nom:'Détermination',
      emoji:'💪', xp:350, categorie:'femme', rare:false,
      description:'Atteindre 5 objectifs personnels',
      condition: d => d.objectifsAtteints >= 5 },
    { id:'first_log', nom:'Premier repas logué',
      emoji:'🍽️', xp:50, categorie:'nutrition', rare:false,
      description:'Logger son premier repas',
      condition: d => d.totalLogsNutrition >= 1 },
    { id:'nutrition_7j', nom:'Semaine propre',
      emoji:'🥗', xp:200, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 7 jours consécutifs',
      condition: d => d.streakNutrition >= 7 },
    { id:'nutrition_14j', nom:'2 semaines propre',
      emoji:'🥗', xp:350, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 14 jours consécutifs',
      condition: d => d.streakNutrition >= 14 },
    { id:'nutrition_30j', nom:'Mois parfait',
      emoji:'💚', xp:500, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 30 jours',
      condition: d => d.streakNutrition >= 30 },
    { id:'hydratation_7j', nom:'Source de vie',
      emoji:'💧', xp:150, categorie:'nutrition', rare:false,
      description:'Atteindre objectif eau 7 jours',
      condition: d => d.joursHydratation >= 7 },
    { id:'proteines_obj', nom:'Machine à protéines',
      emoji:'💪', xp:200, categorie:'nutrition', rare:false,
      description:'Atteindre objectif protéines 14 jours',
      condition: d => d.joursProteines >= 14 },
    { id:'recettes_10', nom:'Chef sportif',
      emoji:'👨‍🍳', xp:250, categorie:'nutrition', rare:false,
      description:'Logger 10 recettes différentes',
      condition: d => d.totalRecettesLoguees >= 10 },
    { id:'programme_ia_genere', nom:'Programme IA créé',
      emoji:'🧠', xp:200, categorie:'programme_ia', rare:false,
      description:'Générer son premier programme IA',
      condition: d => d.programmeIAGenere },
    { id:'programme_ia_complet', nom:'Fidèle au programme',
      emoji:'🎯', xp:500, categorie:'programme_ia', rare:false,
      description:'Suivre le programme IA pendant 4 semaines',
      condition: d => d.semainesProgrammeIA >= 4 },
    { id:'programme_ia_expert', nom:'Maître IA',
      emoji:'⚡', xp:1000, categorie:'programme_ia', rare:true,
      description:'Suivre le programme IA pendant 16 semaines',
      condition: d => d.semainesProgrammeIA >= 16 },
    { id:'maison_premier', nom:'Home Gym',
      emoji:'🏠', xp:150, categorie:'maison', rare:false,
      description:'Première séance à la maison',
      condition: d => d.seancesMaison >= 1 },
    { id:'maison_20', nom:'Home Warrior',
      emoji:'🏠', xp:300, categorie:'maison', rare:false,
      description:'20 séances à la maison',
      condition: d => d.seancesMaison >= 20 },
    { id:'dehors_premier', nom:'Outdoor Fighter',
      emoji:'🌳', xp:150, categorie:'maison', rare:false,
      description:'Première séance en extérieur',
      condition: d => d.seancesDehors >= 1 },
    { id:'dehors_10', nom:'Nature Warrior',
      emoji:'🌳', xp:250, categorie:'maison', rare:false,
      description:'10 séances en extérieur',
      condition: d => d.seancesDehors >= 10 },
    { id:'sans_salle_30', nom:'No Gym No Limit',
      emoji:'💥', xp:500, categorie:'maison', rare:true,
      description:'30 séances sans salle',
      condition: d => (d.seancesMaison + d.seancesDehors) >= 30 },
    { id:'pr_seance', nom:'Séance record',
      emoji:'🏆', xp:300, categorie:'adaptatif', rare:false,
      description:'Battre 3 PRs dans une même séance',
      condition: d => d.maxPRsSeance >= 3 },
    { id:'decharge_faite', nom:'Stratège',
      emoji:'🧘', xp:200, categorie:'adaptatif', rare:false,
      description:'Compléter une semaine de décharge',
      condition: d => d.semDecharge >= 1 },
    { id:'surmenage_evite', nom:'Sage athlète',
      emoji:'🦉', xp:300, categorie:'adaptatif', rare:false,
      description:'Éviter un surmenage grâce aux alertes',
      condition: d => d.surmenagesEvites >= 1 }
  ],

  // ════════════════════════════════════════════════════════
  // XP
  // ════════════════════════════════════════════════════════
  getXP() {
    const total  = Utils.storage.get('ft_xp_total', 0);
    const niveau = this.getNiveau(total);
    const xpNiv  = total - niveau.xpMin;
    const range  = Math.max(niveau.xpSuivant - niveau.xpMin, 1);
    const pct    = Math.min(100, Math.round((xpNiv / range) * 100));
    return { total, niveau, pourcentage: pct };
  },

  getNiveau(xp) {
    let actuel = this.NIVEAUX[0];
    for (const n of this.NIVEAUX) {
      if (xp >= n.xpMin) actuel = n;
    }
    return actuel;
  },

  ajouterXP(montant, raison = '') {
    try {
      const avant    = Utils.storage.get('ft_xp_total', 0);

      // ✅ Double XP si actif
      const doubleXP = Utils.storage.get('ft_double_xp_fin', 0);
      const multiplicateur = Date.now() < doubleXP ? 2 : 1;
      const montantFinal = montant * multiplicateur;

      const apres    = avant + montantFinal;
      Utils.storage.set('ft_xp_total', apres);

      const nivAvant = this.getNiveau(avant);
      const nivApres = this.getNiveau(apres);

      if (nivApres.numero > nivAvant.numero) {
        try {
          if (window.Sounds) Sounds.jouer('levelup');
          Utils.vibrer([200,100,200,100,400]);
          Utils.confetti(4000);
        } catch(e) {}

        setTimeout(() => {
          Utils.toast(
            `🎉 NIVEAU ${nivApres.numero} — ${nivApres.emoji} ${nivApres.nom} !`,
            'success', 6000
          );
          // ✅ Afficher l'animation de level up
          this._animerLevelUp(nivApres);
        }, 300);

      } else if (raison && montantFinal >= 100) {
        const labelDouble = multiplicateur > 1
          ? ` ×2 🔥` : '';
        Utils.toast(
          `+${montantFinal} XP${labelDouble} — ${raison}`,
          'info', 2000
        );
      }

      return apres;
    } catch(e) { return 0; }
  },

  // ✅ NOUVEAU v6.0 — Animation level up
  _animerLevelUp(niveau) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(9,9,45,0.95);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      animation:fadeIn .3s ease`;

    overlay.innerHTML = `
      <div style="text-align:center;animation:scaleIn .5s ease">
        <div style="font-size:5rem;margin-bottom:16px;
                    animation:bounce 1s infinite">
          ${niveau.emoji}
        </div>
        <div style="font-size:.7rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.2em;
                    color:${niveau.couleur};margin-bottom:8px">
          NIVEAU ATTEINT
        </div>
        <div style="font-size:3rem;font-weight:900;
                    color:${niveau.couleur};line-height:1;
                    margin-bottom:8px">
          ${niveau.numero}
        </div>
        <div style="font-size:1.5rem;font-weight:800;color:white;
                    margin-bottom:16px">
          ${niveau.nom}
        </div>
        <div style="font-size:.85rem;color:rgba(255,255,255,0.6);
                    margin-bottom:32px">
          ${this.AVATARS_RPG[niveau.numero]?.description || ''}
        </div>
        <button onclick="this.closest('[style*=fixed]').remove()"
                style="padding:12px 32px;
                       background:${niveau.couleur};
                       color:#09092d;border:none;
                       border-radius:99px;
                       font-size:.95rem;font-weight:800;
                       cursor:pointer">
          Continuer ! 🚀
        </button>
      </div>`;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 8000);
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — QUÊTES
  // ════════════════════════════════════════════════════════
  getQuetesSemaine() {
    const semaineActuelle = Utils.debutSemaine(Utils.aujourd_hui());
    const saved = Utils.storage.get('ft_quetes_semaine', null);

    // Régénérer si nouvelle semaine
    if (!saved || saved.semaine !== semaineActuelle) {
      const nouvelles = this._genererQuetes();
      Utils.storage.set('ft_quetes_semaine', {
        semaine:  semaineActuelle,
        quetes:   nouvelles,
        terminees:[]
      });
      return { semaine:semaineActuelle, quetes:nouvelles, terminees:[] };
    }
    return saved;
  },

  _genererQuetes() {
    // Sélectionner 3 quêtes aléatoires de difficulté variée
    const faciles   = this.QUETES_POOL.filter(q => q.difficulte === 'facile');
    const moyennes  = this.QUETES_POOL.filter(q => q.difficulte === 'moyen');
    const difficiles= this.QUETES_POOL.filter(q => q.difficulte === 'difficile');

    const rand = arr => arr[Math.floor(Math.random() * arr.length)];

    return [
      { ...rand(faciles),    progression:0 },
      { ...rand(moyennes),   progression:0 },
      { ...rand(difficiles), progression:0 }
    ];
  },

  mettreAJourQuetes() {
    try {
      const data     = this.getQuetesSemaine();
      const terminees = new Set(data.terminees || []);
      const nouvTerminees = [];

      data.quetes.forEach(q => {
        if (terminees.has(q.id)) return;

        let prog = 0;

        try {
          switch(q.type) {
            case 'seances':
              prog = Tracker.getSeancesParSemaine();
              break;
            case 'prs': {
              const prsSeance = Tracker.getHistoriqueSeances(7)
                .reduce((a,s) => a + (s.prs?.length||0), 0);
              prog = prsSeance;
              break;
            }
            case 'volume':
              prog = Tracker.getVolumeSemaine();
              break;
            case 'streak':
              prog = Tracker.getStreak().count;
              break;
            case 'journal':
              prog = Tracker.getJournal()
                .filter(e => e.date >= data.semaine).length;
              break;
            case 'series':
              prog = Tracker.getHistoriqueSeances(7)
                .reduce((a,s) => a + (s.series?.length||0), 0);
              break;
            case 'rpe': {
              const rpe = Tracker.getRPEMoyen7Jours();
              prog = rpe > 0 && rpe <= q.cible ? q.cible : 0;
              break;
            }
            case 'hydratation': {
              let joursEau = 0;
              for (let i = 0; i < 7; i++) {
                const d   = Utils.ajouterJours(Utils.aujourd_hui(), -i);
                const eau = Utils.storage.get(`ft_nutrition_eau_${d}`, 0);
                const obj = (Utils.storage.get(
                  'ft_nutrition_objectifs', { eau:2.5 }
                ).eau || 2.5) * 1000;
                if (eau >= obj * 0.9) joursEau++;
              }
              prog = joursEau;
              break;
            }
          }
        } catch(e) {}

        q.progression = Math.min(q.cible, prog);

        if (q.progression >= q.cible) {
          nouvTerminees.push(q.id);
          terminees.add(q.id);
        }
      });

      // Sauvegarder progression
      data.terminees = [...terminees];
      Utils.storage.set('ft_quetes_semaine', data);

      // Récompenser les nouvelles quêtes terminées
      nouvTerminees.forEach((qId, i) => {
        const quete = data.quetes.find(q => q.id === qId);
        if (!quete) return;
        setTimeout(() => {
          Utils.toast(
            `🎯 Quête terminée : ${quete.emoji} ${quete.titre} ! +${quete.xp} XP`,
            'pr', 5000
          );
          this.ajouterXP(quete.xp, `Quête ${quete.titre}`);
          Utils.vibrer([100, 50, 200]);
        }, i * 1500);
      });

      return data;
    } catch(e) {
      return this.getQuetesSemaine();
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — LOOT BOX
  // ════════════════════════════════════════════════════════
  ouvrirLootBox(type) {
    const box = this.LOOT_BOXES[type];
    if (!box) return;

    const xp = this.getXP();
    if (xp.total < box.xpCost) {
      Utils.toast(
        `❌ Il te faut ${box.xpCost.toLocaleString('fr-FR')} XP pour ouvrir ce coffre !`,
        'error'
      );
      return;
    }

    // Déduire les XP
    const actuel = Utils.storage.get('ft_xp_total', 0);
    Utils.storage.set('ft_xp_total', actuel - box.xpCost);

    // Tirer une récompense
    const rand = Math.random();
    let cumul  = 0;
    let recomp = box.recompenses[box.recompenses.length - 1];

    for (const r of box.recompenses) {
      cumul += r.chance;
      if (rand <= cumul) { recomp = r; break; }
    }

    // Appliquer la récompense
    if (recomp.type === 'xp') {
      this.ajouterXP(recomp.val, 'Coffre ouvert');
    } else if (recomp.type === 'special' && recomp.val === 'double_xp') {
      const fin = Date.now() + 24 * 60 * 60 * 1000;
      Utils.storage.set('ft_double_xp_fin', fin);
    } else if (recomp.type === 'titre') {
      const titres = Utils.storage.get('ft_titres_debloques', []);
      if (!titres.includes(recomp.val)) {
        titres.push(recomp.val);
        Utils.storage.set('ft_titres_debloques', titres);
      }
    } else if (recomp.type === 'badge') {
      const badges = Utils.storage.get('ft_badges_debloques', []);
      if (!badges.includes(recomp.val)) {
        badges.push(recomp.val);
        Utils.storage.set('ft_badges_debloques', badges);
      }
    }

    // Animation ouverture
    this._animerLootBox(box, recomp);
    this.verifierTrophees();

    return recomp;
  },

  _animerLootBox(box, recomp) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(9,9,45,0.97);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      animation:fadeIn .3s ease`;

    overlay.innerHTML = `
      <div style="text-align:center">
        <!-- Coffre qui s'ouvre -->
        <div id="loot-box-icon"
             style="font-size:5rem;margin-bottom:20px;
                    animation:bounce .5s 3 ease">
          ${box.emoji}
        </div>

        <div style="font-size:.7rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.2em;
                    color:${box.couleur};margin-bottom:8px">
          COFFRE OUVERT !
        </div>

        <!-- Récompense -->
        <div id="loot-reward"
             style="opacity:0;transform:scale(0.5);
                    transition:all .5s ease .8s;
                    background:rgba(255,255,255,0.05);
                    border:2px solid ${box.couleur};
                    border-radius:var(--radius-xl);
                    padding:24px 32px;
                    margin:16px 0">
          <div style="font-size:3rem;margin-bottom:8px">
            ${recomp.type === 'xp' ? '✨'
            : recomp.type === 'badge' ? '🎖️'
            : recomp.type === 'titre' ? '👑'
            : recomp.type === 'special' ? '⚡' : '🎁'}
          </div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:${box.couleur};margin-bottom:4px">
            ${recomp.label}
          </div>
          <div style="font-size:.78rem;color:rgba(255,255,255,0.5)">
            ${recomp.type === 'xp'
              ? 'XP bonus crédité !'
              : recomp.type === 'special'
                ? 'Actif pendant 24 heures !'
                : 'Débloqué pour toujours !'}
          </div>
        </div>

        <button onclick="this.closest('[style*=fixed]').remove()"
                style="margin-top:16px;padding:12px 32px;
                       background:${box.couleur};color:#09092d;
                       border:none;border-radius:99px;
                       font-size:.95rem;font-weight:800;
                       cursor:pointer">
          Super ! 🎉
        </button>
      </div>`;

    document.body.appendChild(overlay);
    Utils.vibrer([100, 50, 200, 50, 400]);

    // Animer la récompense après 800ms
    setTimeout(() => {
      const reward = overlay.querySelector('#loot-reward');
      if (reward) {
        reward.style.opacity   = '1';
        reward.style.transform = 'scale(1)';
      }
      Utils.confetti(2000);
    }, 800);

    setTimeout(() => overlay.remove(), 10000);
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — CLASSEMENT
  // ════════════════════════════════════════════════════════
  getClassement() {
    const prs    = Tracker.getAllPRs();
    const profil = Tracker.getProfil();
    const xp     = this.getXP();

    // Classement simulé réaliste
    const adversaires = [
      { nom:'MaxPower',     niveau:7, xp:28450, bench:145, squat:180, dead:220, emoji:'👑' },
      { nom:'IronFist',     niveau:6, xp:15200, bench:125, squat:160, dead:195, emoji:'💎' },
      { nom:'FitQueen',     niveau:6, xp:14800, bench:80,  squat:120, dead:145, emoji:'💎' },
      { nom:'StrengthX',    niveau:5, xp:8900,  bench:110, squat:140, dead:170, emoji:'🔥' },
      { nom:'GymWarrior',   niveau:5, xp:7200,  bench:105, squat:135, dead:165, emoji:'🔥' },
      { nom:'NaturalBeast', niveau:4, xp:4500,  bench:95,  squat:120, dead:150, emoji:'⚡' },
      { nom:'IronBody',     niveau:4, xp:3800,  bench:88,  squat:115, dead:140, emoji:'⚡' },
      { nom:'FitLife',      niveau:3, xp:2100,  bench:75,  squat:95,  dead:115, emoji:'🏃' },
      { nom:'Warrior99',    niveau:3, xp:1800,  bench:70,  squat:90,  dead:110, emoji:'🏃' },
      { nom:'Rookie2024',   niveau:2, xp:800,   bench:55,  squat:70,  dead:85,  emoji:'💪' }
    ];

    // Calculer score utilisateur
    const userBench = prs['bench_press']?.rm1 || 0;
    const userSquat = prs['squat']?.rm1        || 0;
    const userDead  = prs['soulevé_terre']?.rm1 || 0;
    const userScore = xp.total + (userBench + userSquat + userDead) * 10;

    const joueurs = [
      ...adversaires.map(a => ({
        ...a,
        score: a.xp + (a.bench + a.squat + a.dead) * 10,
        isUser: false
      })),
      {
        nom:    profil.nom || 'Toi',
        niveau: xp.niveau.numero,
        xp:     xp.total,
        bench:  userBench,
        squat:  userSquat,
        dead:   userDead,
        emoji:  xp.niveau.emoji,
        score:  userScore,
        isUser: true
      }
    ].sort((a,b) => b.score - a.score);

    const rangUser = joueurs.findIndex(j => j.isUser) + 1;

    return { joueurs, rangUser };
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v6.0 — SAISON
  // ════════════════════════════════════════════════════════
  getSaisonInfo() {
    const dateDebut = Utils.storage.get('ft_date_debut', Utils.aujourd_hui());
    const semaines  = Utils.semainesDepuis(dateDebut);
    const progression = Math.min(100,
      Math.round((semaines / this.SAISON.duree) * 100)
    );

    const xp       = this.getXP();
    let rang = 'D';
    if      (xp.niveau.numero >= 7) rang = 'S';
    else if (xp.niveau.numero >= 6) rang = 'A';
    else if (xp.niveau.numero >= 5) rang = 'B';
    else if (xp.niveau.numero >= 4) rang = 'C';

    const recompSaison = this.SAISON.recompenses
      .find(r => r.rang === rang);

    return {
      nom:         this.SAISON.nom,
      emoji:       this.SAISON.emoji,
      semaines,
      total:       this.SAISON.duree,
      progression,
      rang,
      recompense:  recompSaison,
      terminee:    semaines >= this.SAISON.duree
    };
  },

  // ════════════════════════════════════════════════════════
  // TROPHÉES — Vérification (v5.0 conservé)
  // ════════════════════════════════════════════════════════
  getTrophees() {
    const debloquees = Utils.storage.get('ft_trophees', []);
    return this.TROPHEES_DEF.map(t => ({
      ...t,
      debloquee:     debloquees.includes(t.id),
      dateDeblocage: Utils.storage.get(`ft_trophy_date_${t.id}`, null)
    }));
  },

  verifierTrophees() {
    try {
      const debloquees = Utils.storage.get('ft_trophees', []);

      let totalSeances = 0, totalPRs = 0, streak = 0;
      let seancesParSemaine = 0, prs = {};
      let totalJournal = 0, objectifsAtteints = 0;
      let comeback = false, phasesTerminees = 0;
      let cyclesTermines = 0, volumeTotal = 0;
      let totalPhotos = 0, semaineParf = 0;
      let seancesExpress = 0, seancesLowerBody = 0;
      let seancesMaison = 0, seancesDehors = 0;
      let maxPRsSeance = 0, semDecharge = 0;
      let surmenagesEvites = 0, programmeIAGenere = false;
      let semainesProgrammeIA = 0, totalLogsNutrition = 0;
      let streakNutrition = 0, joursHydratation = 0;
      let joursProteines = 0, totalRecettesLoguees = 0;

      try { totalSeances      = Tracker.getTotalSeances();          } catch(e) {}
      try { prs               = Tracker.getAllPRs();                } catch(e) {}
      try { totalPRs          = Object.keys(prs).length;           } catch(e) {}
      try { streak            = Tracker.getStreak().count;         } catch(e) {}
      try { seancesParSemaine = Tracker.getSeancesParSemaine();    } catch(e) {}
      try { totalJournal      = Tracker.getJournal().length;       } catch(e) {}
      try {
        objectifsAtteints = Tracker.getObjectifs()
          .filter(o => o.complete).length;
      } catch(e) {}
      try { comeback      = Utils.storage.get('ft_comeback', false);           } catch(e) {}
      try { phasesTerminees   = Utils.storage.get('ft_phases_terminees', 0);  } catch(e) {}
      try { cyclesTermines    = Utils.storage.get('ft_cycles_termines', 0);   } catch(e) {}
      try { semaineParf       = Utils.storage.get('ft_semaines_parf', 0);     } catch(e) {}
      try { semDecharge       = Utils.storage.get('ft_semaines_decharge', 0); } catch(e) {}
      try { surmenagesEvites  = Utils.storage.get('ft_surmenages_evites', 0); } catch(e) {}
      try {
        totalPhotos = typeof Tracker.getPhotos === 'function'
          ? (Tracker.getPhotos() || []).length : 0;
      } catch(e) {}

      try {
        const seancesHist = Tracker.getHistoriqueSeances(9999);
        volumeTotal       = seancesHist.reduce(
          (a,s) => a + (s.volumeTotal||0), 0
        );
        seancesExpress    = seancesHist.filter(s =>
          s.id?.includes('express') || s.id?.includes('full_body')
        ).length;
        seancesLowerBody  = seancesHist.filter(s =>
          s.id?.includes('lower') || s.id?.includes('fessier')
          || s.id?.includes('jambes') || s.id?.includes('legs')
        ).length;
        seancesMaison     = seancesHist.filter(s =>
          s.id?.includes('maison') || s.lieu === 'maison'
        ).length;
        seancesDehors     = seancesHist.filter(s =>
          s.id?.includes('dehors') || s.lieu === 'dehors'
        ).length;
        maxPRsSeance      = Math.max(
          ...seancesHist.map(s => (s.prs||[]).length), 0
        );
      } catch(e) {}

      try {
        programmeIAGenere = !!Utils.storage.get('ft_programme_ia_genere', null);
        const dateDebut   = Utils.storage.get('ft_date_debut', null);
        if (programmeIAGenere && dateDebut) {
          semainesProgrammeIA = Utils.semainesDepuis(dateDebut);
        }
      } catch(e) {}

      try {
        let streak_nutri = 0, jours_prot = 0, jours_eau = 0;
        const recettes_ids = new Set();
        let total_logs = 0;
        for (let i = 0; i < 60; i++) {
          const date    = Utils.ajouterJours(Utils.aujourd_hui(), -i);
          const journal = Utils.storage.get(`ft_nutrition_journal_${date}`, []);
          if (journal.length > 0) {
            total_logs += journal.length;
            streak_nutri++;
            const totaux = journal.reduce(
              (a,e) => ({ prot: a.prot + (e.prot||0) }), { prot:0 }
            );
            const obj = Utils.storage.get(
              'ft_nutrition_objectifs', { proteines:160 }
            );
            if (totaux.prot >= obj.proteines * 0.9) jours_prot++;
            journal.forEach(e => {
              if (!e.ref?.startsWith('custom_')) recettes_ids.add(e.ref);
            });
          } else if (i > 0) break;
          const eau    = Utils.storage.get(`ft_nutrition_eau_${date}`, 0);
          const eauObj = (Utils.storage.get(
            'ft_nutrition_objectifs', { eau:2.5 }
          ).eau || 2.5) * 1000;
          if (eau >= eauObj * 0.9) jours_eau++;
        }
        totalLogsNutrition   = total_logs;
        streakNutrition      = streak_nutri;
        joursHydratation     = jours_eau;
        joursProteines       = jours_prot;
        totalRecettesLoguees = recettes_ids.size;
      } catch(e) {}

      const donnees = {
        totalSeances, totalPRs, streak, seancesParSemaine,
        prs, totalJournal, objectifsAtteints, comeback,
        phasesTerminees, cyclesTermines, volumeTotal,
        totalPhotos, semaineParf, seancesExpress,
        seancesLowerBody, seancesMaison, seancesDehors,
        maxPRsSeance, semDecharge, surmenagesEvites,
        programmeIAGenere, semainesProgrammeIA,
        totalLogsNutrition, streakNutrition,
        joursHydratation, joursProteines, totalRecettesLoguees
      };

      const nouveaux = [];
      this.TROPHEES_DEF.forEach(t => {
        if (debloquees.includes(t.id)) return;
        try {
          if (t.condition(donnees)) {
            debloquees.push(t.id);
            nouveaux.push(t);
            Utils.storage.set(
              `ft_trophy_date_${t.id}`, Utils.aujourd_hui()
            );
          }
        } catch(e) {}
      });

      if (nouveaux.length > 0) {
        Utils.storage.set('ft_trophees', debloquees);
        nouveaux.forEach((t, i) => {
          setTimeout(() => {
            try {
              if (window.Sounds) Sounds.jouer('trophee');
            } catch(e) {}
            Utils.toast(
              `🏆 Trophée : ${t.emoji} ${t.nom} — +${t.xp} XP`,
              'pr', 5000
            );
            this.ajouterXP(t.xp, `Trophée ${t.nom}`);
            if (t.rare) {
              setTimeout(() => {
                Utils.confetti(3000);
                Utils.vibrer([200,100,200,100,400]);
              }, 200);
            }
          }, i * 1500);
        });
      }

      // ✅ Mettre à jour les quêtes aussi
      try { this.mettreAJourQuetes(); } catch(e) {}

      return nouveaux;
    } catch(e) { return []; }
  },

  // ════════════════════════════════════════════════════════
  // XP ACTIONS (v5.0 conservé)
  // ════════════════════════════════════════════════════════
  XP_ACTIONS: {
    SEANCE_COMPLETE:   100,
    SERIE_COMPLETE:      5,
    CIRCUIT_COMPLETE:  150,
    JOURNAL:            25,
    PR_BATTU:           50,
    STREAK_7:          150,
    DEFI_SEMAINE:      200,
    HUMEUR:             10,
    SEMAINE_PARF:      300,
    PREMIERE_SEANCE:   200,
    PHOTO_AJOUTEE:      30,
    OBJECTIF_ATTEINT:  250,
    MESURE_CORPORELLE:  20,
    SUPERSET_COMPLETE:  15,
    NUTRITION_LOG:       5,
    RECETTE_LOG:        10,
    HYDRATATION:        20,
    PROGRAMME_IA:      100,
    SEANCE_MAISON:      80,
    SEANCE_DEHORS:      80,
    BLESSURE_DECLAREE:  30,
    DECHARGE_COMPLETE:  50
  },

  recompenser(action) {
    try {
      const montant = this.XP_ACTIONS[action] || 0;
      if (montant > 0) {
        this.ajouterXP(
          montant,
          action.toLowerCase().replace(/_/g,' ')
        );
      }
      const actionsImportantes = [
        'SEANCE_COMPLETE','PR_BATTU','STREAK_7',
        'SEMAINE_PARF','PREMIERE_SEANCE','OBJECTIF_ATTEINT',
        'PROGRAMME_IA','DEFI_SEMAINE'
      ];
      if (actionsImportantes.includes(action)) {
        setTimeout(() => {
          try { this.verifierTrophees(); } catch(e) {}
        }, 500);
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // CATÉGORIES (v5.0 conservé)
  // ════════════════════════════════════════════════════════
  CATEGORIES: {
    tous:         { label:'Tous',          emoji:'🏆' },
    debut:        { label:'Premiers pas',  emoji:'🎯' },
    streak:       { label:'Streak',        emoji:'🔥' },
    seances:      { label:'Séances',       emoji:'💪' },
    prs:          { label:'Records',       emoji:'🏅' },
    force:        { label:'Force',         emoji:'🏋️' },
    volume:       { label:'Volume',        emoji:'💎' },
    programme:    { label:'Programme',     emoji:'📅' },
    programme_ia: { label:'Programme IA',  emoji:'🧠' },
    nutrition:    { label:'Nutrition',     emoji:'🥗' },
    femme:        { label:'Féminin',       emoji:'🌸' },
    maison:       { label:'Maison/Dehors', emoji:'🏠' },
    adaptatif:    { label:'Adaptatif',     emoji:'⚡' },
    special:      { label:'Spéciaux',      emoji:'✨' }
  },

  getProchainTrophee() {
    const non_debloquees = this.getTrophees().filter(t => !t.debloquee);
    if (!non_debloquees.length) return null;

    let totalSeances = 0, streak = 0, totalPRs = 0;
    let totalPhotos = 0, volumeTotal = 0;
    let seancesLowerBody = 0, streakNutrition = 0;
    let seancesMaison = 0, seancesDehors = 0;

    try { totalSeances    = Tracker.getTotalSeances();         } catch(e) {}
    try { streak          = Tracker.getStreak().count;        } catch(e) {}
    try { totalPRs        = Object.keys(Tracker.getAllPRs()).length; } catch(e) {}
    try { totalPhotos     = (Tracker.getPhotos?.() || []).length;   } catch(e) {}
    try {
      const hist    = Tracker.getHistoriqueSeances(9999);
      volumeTotal   = hist.reduce((a,s) => a + (s.volumeTotal||0), 0);
      seancesLowerBody = hist.filter(s =>
        s.id?.includes('lower') || s.id?.includes('fessier')
      ).length;
      seancesMaison = hist.filter(s => s.lieu === 'maison').length;
      seancesDehors = hist.filter(s => s.lieu === 'dehors').length;
    } catch(e) {}

    const scores = non_debloquees.map(t => {
      let pct = 0;
      try {
        if (t.id.startsWith('sessions_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? totalSeances / cible : 0;
        } else if (t.id.startsWith('streak_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? streak / cible : 0;
        } else if (t.id.startsWith('prs_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? totalPRs / cible : 0;
        } else if (t.id === 'photos_5' || t.id === 'avant_apres') {
          const cible = t.id === 'photos_5' ? 5 : 2;
          pct = cible > 0 ? totalPhotos / cible : 0;
        } else if (t.id === 'volume_10T') {
          pct = volumeTotal / 10000;
        } else if (t.id === 'volume_100T') {
          pct = volumeTotal / 100000;
        } else if (t.id.startsWith('lower_body_')) {
          const cible = parseInt(t.id.split('_')[2]);
          pct = cible > 0 ? seancesLowerBody / cible : 0;
        } else if (t.id === 'maison_20') {
          pct = seancesMaison / 20;
        } else if (t.id === 'dehors_10') {
          pct = seancesDehors / 10;
        } else if (t.id === 'sans_salle_30') {
          pct = (seancesMaison + seancesDehors) / 30;
        } else if (t.id === 'nutrition_7j') {
          pct = streakNutrition / 7;
        } else if (t.id === 'nutrition_14j') {
          pct = streakNutrition / 14;
        } else if (t.id === 'nutrition_30j') {
          pct = streakNutrition / 30;
        }
      } catch(e) {}
      return { ...t, pct: Math.min(1, pct) };
    });

    return scores
      .filter(t => t.pct < 1)
      .sort((a,b) => b.pct - a.pct)[0]
      || non_debloquees[0];
  },

  // ════════════════════════════════════════════════════════
  // ✅ RENDER PRINCIPAL v6.0 — Avec onglets RPG
  // ════════════════════════════════════════════════════════
  _filtreCategorie: 'tous',
  _ongletActif:     'profil',

  _getContainer() {
    return document.getElementById('stats-content')
      || document.getElementById('gamification-content')
      || document.getElementById('page-content');
  },

  renderGamificationTab(container) {
    if (!container) return;

    const xp       = this.getXP();
    const avatar   = this.AVATARS_RPG[xp.niveau.numero] || this.AVATARS_RPG[1];
    const saison   = this.getSaisonInfo();
    const quetes   = this.mettreAJourQuetes();
    const classement = this.getClassement();
    const profil   = Tracker.getProfil();

    const doubleXP = Utils.storage.get('ft_double_xp_fin', 0);
    const hasDoubleXP = Date.now() < doubleXP;

    container.innerHTML = `

      <!-- ✅ HERO AVATAR RPG -->
      <div style="background:linear-gradient(135deg,
                  rgba(9,9,45,0.9),rgba(75,75,249,0.2));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  position:relative;overflow:hidden;
                  text-align:center">

        <!-- Glow background -->
        <div style="position:absolute;top:-60px;left:50%;
                    transform:translateX(-50%);
                    width:200px;height:200px;
                    background:radial-gradient(circle,
                      ${xp.niveau.couleur}33 0%,transparent 70%);
                    pointer-events:none"></div>

        <!-- Double XP badge -->
        ${hasDoubleXP ? `
          <div style="position:absolute;top:12px;right:12px;
                      padding:4px 10px;
                      background:rgba(249,239,119,0.2);
                      border:1px solid rgba(249,239,119,0.5);
                      border-radius:99px;font-size:.65rem;
                      font-weight:700;color:var(--fd-lemon)">
            ⚡ Double XP actif !
          </div>` : ''}

        <!-- Aura + Corps avatar -->
        <div style="font-size:4rem;margin-bottom:8px;
                    position:relative;z-index:1;
                    filter:drop-shadow(0 0 20px ${xp.niveau.couleur})">
          ${avatar.aura}${avatar.corps}
        </div>

        <!-- Nom + Titre -->
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.15em;
                    color:${xp.niveau.couleur};margin-bottom:4px;
                    position:relative;z-index:1">
          ${avatar.titre}
        </div>
        <div style="font-size:1.3rem;font-weight:800;color:white;
                    margin-bottom:4px;position:relative;z-index:1">
          ${profil.nom || 'Athlète'}
        </div>
        <div style="font-size:.78rem;color:rgba(255,255,255,0.6);
                    margin-bottom:16px;position:relative;z-index:1">
          ${avatar.description}
        </div>

        <!-- Niveau + XP bar -->
        <div style="position:relative;z-index:1">
          <div style="display:flex;justify-content:space-between;
                      font-size:.68rem;margin-bottom:6px">
            <span style="color:${xp.niveau.couleur};font-weight:700">
              ${xp.niveau.emoji} Niv.${xp.niveau.numero} — ${xp.niveau.nom}
            </span>
            <span style="color:rgba(255,255,255,0.5)">
              ${xp.total.toLocaleString('fr-FR')} XP
            </span>
          </div>
          <div style="height:10px;background:rgba(255,255,255,0.1);
                      border-radius:99px;overflow:hidden;
                      border:1px solid rgba(255,255,255,0.1)">
            <div style="height:100%;width:${xp.pourcentage}%;
                        background:linear-gradient(90deg,
                          ${xp.niveau.couleur},white);
                        border-radius:99px;
                        transition:width 1.5s ease;
                        box-shadow:0 0 10px ${xp.niveau.couleur}">
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;
                      font-size:.6rem;color:rgba(255,255,255,0.4);
                      margin-top:4px">
            <span>${xp.niveau.xpMin.toLocaleString('fr-FR')}</span>
            <span>${xp.pourcentage}%</span>
            <span>${xp.niveau.xpSuivant.toLocaleString('fr-FR')}</span>
          </div>
        </div>
      </div>

      <!-- ✅ ONGLETS RPG -->
      <div style="display:flex;gap:6px;margin-bottom:14px;
                  overflow-x:auto;scrollbar-width:none">
        ${[
          { id:'profil',    label:'Profil',   emoji:'👤' },
          { id:'quetes',    label:'Quêtes',   emoji:'🎯' },
          { id:'trophees',  label:'Trophées', emoji:'🏆' },
          { id:'classement',label:'Classement',emoji:'🌍' },
          { id:'saison',    label:'Saison',   emoji:'🏆' },
          { id:'coffres',   label:'Coffres',  emoji:'📦' }
        ].map(o => `
          <button onclick="Gamification._ongletActif='${o.id}';
                           const c=Gamification._getContainer();
                           if(c)Gamification.renderGamificationTab(c);"
                  style="padding:8px 14px;white-space:nowrap;
                         font-size:.72rem;font-weight:700;
                         border-radius:var(--radius-full);
                         cursor:pointer;transition:all .2s;
                         background:${this._ongletActif === o.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.06)'};
                         border:1px solid ${this._ongletActif === o.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.1)'};
                         color:${this._ongletActif === o.id
                           ? 'white' : 'var(--text-muted)'}">
            ${o.emoji} ${o.label}
          </button>`).join('')}
      </div>

      <!-- Contenu onglet -->
      <div id="gamification-onglet-content">
        ${this._renderOnglet(this._ongletActif)}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ✅ RENDU PAR ONGLET
  // ════════════════════════════════════════════════════════
  _renderOnglet(onglet) {
    switch(onglet) {
      case 'profil':     return this._renderOngletProfil();
      case 'quetes':     return this._renderOngletQuetes();
      case 'trophees':   return this._renderOngletTrophees();
      case 'classement': return this._renderOngletClassement();
      case 'saison':     return this._renderOngletSaison();
      case 'coffres':    return this._renderOngletCoffres();
      default:           return this._renderOngletProfil();
    }
  },

  // ── ONGLET PROFIL ─────────────────────────────────────
  _renderOngletProfil() {
    const xp       = this.getXP();
    const trophees = this.getTrophees();
    const debloquees = trophees.filter(t => t.debloquee);
    const prochain = this.getProchainTrophee();
    const streak   = Tracker.getStreak();
    const total    = Tracker.getTotalSeances();

    return `
      <!-- Stats globales -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${debloquees.length}</span>
          <span class="stat-label">Trophées</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-indigo)">
            ${xp.total.toLocaleString('fr-FR')}</span>
          <span class="stat-label">XP Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-coral)">
            ${streak.count}🔥</span>
          <span class="stat-label">Streak</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${total}</span>
          <span class="stat-label">Séances</span>
        </div>
      </div>

      <!-- Progression niveaux -->
      <div class="card mb-md">
        <div class="card-label mb-md">🗺️ Chemin vers l'Immortalité</div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${this.NIVEAUX.map(n => {
            const atteint = xp.total >= n.xpMin;
            const actuel  = xp.niveau.numero === n.numero;
            return `
              <div style="display:flex;align-items:center;gap:10px">
                <div style="width:36px;height:36px;border-radius:50%;
                            flex-shrink:0;display:flex;align-items:center;
                            justify-content:center;font-size:1.3rem;
                            background:${atteint
                              ? n.couleur + '33'
                              : 'rgba(255,255,255,0.04)'};
                            border:2px solid ${atteint
                              ? n.couleur
                              : 'rgba(255,255,255,0.1)'};
                            ${actuel
                              ? `box-shadow:0 0 12px ${n.couleur}` : ''}">
                  ${n.emoji}
                </div>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:700;
                              color:${atteint
                                ? 'var(--text-primary)'
                                : 'var(--text-muted)'}">
                    Niv.${n.numero} — ${n.nom}
                    ${actuel ? `<span style="font-size:.58rem;
                      padding:1px 6px;margin-left:4px;
                      background:${n.couleur}33;
                      border:1px solid ${n.couleur}55;
                      border-radius:99px;color:${n.couleur}">
                      ACTUEL</span>` : ''}
                  </div>
                  <div style="font-size:.62rem;color:var(--text-muted)">
                    ${n.xpMin.toLocaleString('fr-FR')} XP requis
                  </div>
                </div>
                <div style="font-size:1.2rem">
                  ${atteint ? '✅' : '🔒'}
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Prochain trophée -->
      ${prochain ? `
        <div style="background:rgba(249,239,119,0.08);
                    border:1px solid rgba(249,239,119,0.25);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem;flex-shrink:0">${prochain.emoji}</div>
          <div style="flex:1">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.08em;
                        color:var(--fd-lemon);margin-bottom:3px">
              🎯 Prochain trophée
              ${prochain.pct > 0
                ? `· ${Math.round(prochain.pct * 100)}% complété` : ''}
            </div>
            <div style="font-size:.88rem;font-weight:700">${prochain.nom}</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${prochain.description} · +${prochain.xp} XP
            </div>
            ${prochain.pct > 0 ? `
              <div style="height:4px;background:rgba(249,239,119,0.2);
                          border-radius:99px;margin-top:6px;overflow:hidden">
                <div style="height:100%;
                            width:${Math.round(prochain.pct*100)}%;
                            background:var(--fd-lemon);border-radius:99px">
                </div>
              </div>` : ''}
          </div>
          ${prochain.rare ? `
            <div style="padding:3px 8px;
                        background:rgba(255,141,150,0.15);
                        border:1px solid rgba(255,141,150,0.3);
                        border-radius:99px;font-size:.6rem;
                        color:var(--fd-coral);font-weight:700">⭐ RARE</div>` : ''}
        </div>` : ''}

      <!-- Comment gagner des XP -->
      <div class="card">
        <div class="card-label">⚡ Gains XP</div>
        <div style="margin-top:var(--space-sm)">
          ${Object.entries(this.XP_ACTIONS).slice(0, 10).map(([action, xpVal]) => `
            <div class="score-row">
              <span class="score-row-label" style="font-size:.78rem">
                ${this._labelAction(action)}</span>
              <span style="font-size:.78rem;font-weight:700;color:var(--fd-lemon)">
                +${xpVal} XP</span>
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ── ONGLET QUÊTES ─────────────────────────────────────
  _renderOngletQuetes() {
    const data     = this.getQuetesSemaine();
    const terminees = new Set(data.terminees || []);

    const joursRestants = (() => {
      const maintenant = new Date();
      const finSemaine = new Date(data.semaine);
      finSemaine.setDate(finSemaine.getDate() + 7);
      return Math.max(0,
        Math.ceil((finSemaine - maintenant) / (1000*60*60*24))
      );
    })();

    return `
      <!-- Header quêtes -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.25);
                  border-radius:var(--radius-lg);
                  padding:14px 16px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;
                    align-items:center">
          <div>
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--fd-indigo);margin-bottom:4px">
              🎯 Quêtes de la semaine
            </div>
            <div style="font-size:1rem;font-weight:700">
              ${terminees.size} / ${data.quetes?.length || 3} complétées
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-lemon)">${joursRestants}j</div>
            <div style="font-size:.6rem;color:var(--text-muted)">restants</div>
          </div>
        </div>
        <!-- Barre progression globale quêtes -->
        <div style="height:6px;background:rgba(255,255,255,0.08);
                    border-radius:99px;overflow:hidden;margin-top:10px">
          <div style="height:100%;
                      width:${Math.round((terminees.size/(data.quetes?.length||3))*100)}%;
                      background:linear-gradient(90deg,
                        var(--fd-indigo),var(--fd-mint));
                      border-radius:99px;transition:width .5s">
          </div>
        </div>
      </div>

      <!-- Liste quêtes -->
      ${(data.quetes || []).map(q => {
        const terminee  = terminees.has(q.id);
        const pct       = Math.min(100,
          Math.round(((q.progression||0) / Math.max(q.cible,1)) * 100)
        );
        const diffColors = {
          facile:    { bg:'rgba(139,240,187,0.1)', border:'rgba(139,240,187,0.3)', color:'var(--fd-mint)'     },
          moyen:     { bg:'rgba(75,75,249,0.1)',   border:'rgba(75,75,249,0.3)',   color:'var(--fd-indigo)'   },
          difficile: { bg:'rgba(255,141,150,0.1)', border:'rgba(255,141,150,0.3)','color':'var(--fd-coral)'   }
        };
        const diff = diffColors[q.difficulte] || diffColors.moyen;

        return `
          <div style="background:${terminee
              ? 'rgba(139,240,187,0.08)' : diff.bg};
                      border:1px solid ${terminee
              ? 'rgba(139,240,187,0.3)' : diff.border};
                      border-radius:var(--radius-lg);
                      padding:14px 16px;margin-bottom:10px;
                      transition:all .3s">
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:44px;height:44px;border-radius:12px;
                          flex-shrink:0;display:flex;align-items:center;
                          justify-content:center;font-size:1.5rem;
                          background:rgba(255,255,255,0.06)">
                ${terminee ? '✅' : q.emoji}
              </div>
              <div style="flex:1">
                <div style="display:flex;align-items:center;
                            gap:6px;margin-bottom:2px">
                  <div style="font-size:.88rem;font-weight:700;
                              color:${terminee
                                ? 'var(--fd-mint)' : 'var(--text-primary)'}">
                    ${q.titre}
                  </div>
                  <span style="padding:1px 6px;font-size:.55rem;
                               font-weight:700;border-radius:99px;
                               background:${diff.bg};
                               border:1px solid ${diff.border};
                               color:${diff.color}">
                    ${q.difficulte}
                  </span>
                </div>
                <div style="font-size:.65rem;color:var(--text-muted);
                            margin-bottom:6px">
                  ${q.description}
                </div>
                <!-- Barre progression -->
                <div style="height:5px;background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden;
                            margin-bottom:4px">
                  <div style="height:100%;width:${pct}%;
                              background:${terminee
                                ? 'var(--fd-mint)' : diff.color};
                              border-radius:99px;transition:width .5s">
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;
                            font-size:.6rem;color:var(--text-muted)">
                  <span>${q.progression||0} / ${q.cible}</span>
                  <span>${pct}%</span>
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:.78rem;font-weight:700;
                            color:var(--fd-lemon)">+${q.xp}</div>
                <div style="font-size:.55rem;color:var(--text-muted)">XP</div>
              </div>
            </div>
          </div>`;
      }).join('')}

      <!-- Refresh quêtes -->
      <div style="text-align:center;padding:10px 0;
                  font-size:.7rem;color:var(--text-muted)">
        🔄 Nouvelles quêtes dans ${joursRestants} jours
      </div>
    `;
  },

  // ── ONGLET TROPHÉES ───────────────────────────────────
  _renderOngletTrophees() {
    const trophees   = this.getTrophees();
    const debloquees = trophees.filter(t => t.debloquee);
    const verrous    = trophees.filter(t => !t.debloquee);
    const filtre     = this._filtreCategorie || 'tous';

    const filtreDebloques = filtre === 'tous'
      ? debloquees
      : debloquees.filter(t => t.categorie === filtre);
    const filtreVerrous = filtre === 'tous'
      ? verrous
      : verrous.filter(t => t.categorie === filtre);

    return `
      <!-- Stats trophées -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${debloquees.length}</span>
          <span class="stat-label">Débloqués</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${trophees.length}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${Math.round((debloquees.length/Math.max(trophees.length,1))*100)}%</span>
          <span class="stat-label">Complété</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-indigo)">
            ${debloquees.filter(t => t.rare).length}</span>
          <span class="stat-label">Rares</span>
        </div>
      </div>

      <!-- Barre progression -->
      <div class="card mb-md">
        <div class="flex justify-between" style="font-size:.78rem;margin-bottom:var(--space-sm)">
          <span style="font-weight:600">🏆 Progression globale</span>
          <span style="color:var(--text-muted)">
            ${debloquees.length} / ${trophees.length}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"
               style="width:${Math.round((debloquees.length/Math.max(trophees.length,1))*100)}%;
                      background:var(--fd-lemon)"></div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="muscle-filter-row mb-md">
        ${Object.entries(this.CATEGORIES).map(([id, cat]) => `
          <button onclick="Gamification._filtreCategorie='${id}';
                           Gamification._ongletActif='trophees';
                           const c=Gamification._getContainer();
                           if(c)Gamification.renderGamificationTab(c);"
                  class="muscle-filter-btn ${filtre===id?'active':''}"
                  style="font-size:.6rem">
            ${cat.emoji} ${cat.label}
          </button>`).join('')}
      </div>

      <!-- Débloqués -->
      ${filtreDebloques.length > 0 ? `
        <div class="card-label mb-sm">🏆 Débloqués (${filtreDebloques.length})</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm);margin-bottom:var(--space-md)">
          ${filtreDebloques.map(t => `
            <div style="background:rgba(249,239,119,0.08);
                        border:1px solid ${t.rare
                          ? 'rgba(255,141,150,0.4)'
                          : 'rgba(249,239,119,0.3)'};
                        border-radius:var(--radius-md);
                        padding:var(--space-md) var(--space-xs);
                        text-align:center;position:relative">
              ${t.rare ? `
                <div style="position:absolute;top:4px;right:4px;
                            font-size:.5rem;padding:1px 4px;
                            background:rgba(255,141,150,0.2);
                            border-radius:99px;color:var(--fd-coral);
                            font-weight:700">RARE</div>` : ''}
              <div style="font-size:1.8rem;margin-bottom:4px">${t.emoji}</div>
              <div style="font-size:.62rem;font-weight:700;
                          color:var(--fd-lemon);line-height:1.3">
                ${t.nom}</div>
              <div style="font-size:.58rem;color:var(--fd-mint);margin-top:2px">
                +${t.xp} XP</div>
              ${t.dateDeblocage ? `
                <div style="font-size:.52rem;color:var(--text-muted);margin-top:2px">
                  ${Utils.formatDateCourt(t.dateDeblocage)}</div>` : ''}
            </div>`).join('')}
        </div>` : `
        <div class="card mb-md" style="text-align:center;padding:var(--space-lg)">
          <div style="font-size:2rem;margin-bottom:8px">🔒</div>
          <p style="color:var(--text-muted);font-size:.85rem">
            Aucun trophée dans cette catégorie</p>
        </div>`}

      <!-- Verrouillés -->
      ${filtreVerrous.length > 0 ? `
        <div class="card-label mb-sm">🔒 À débloquer (${filtreVerrous.length})</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm)">
          ${filtreVerrous.map(t => `
            <div title="${t.description}"
                 style="background:var(--bg-card);
                        border:1px solid ${t.rare
                          ? 'rgba(255,141,150,0.15)'
                          : 'var(--border-color)'};
                        border-radius:var(--radius-md);
                        padding:var(--space-md) var(--space-xs);
                        text-align:center;opacity:.4;
                        filter:grayscale(1);position:relative">
              ${t.rare ? `
                <div style="position:absolute;top:4px;right:4px;
                            font-size:.5rem;padding:1px 4px;
                            background:rgba(255,141,150,0.1);
                            border-radius:99px;color:var(--fd-coral);
                            font-weight:700">RARE</div>` : ''}
              <div style="font-size:1.8rem;margin-bottom:4px">${t.emoji}</div>
              <div style="font-size:.62rem;font-weight:700;
                          color:var(--text-secondary);line-height:1.3">
                ${t.nom}</div>
              <div style="font-size:.58rem;color:var(--text-muted);margin-top:2px">
                +${t.xp} XP</div>
              <div style="font-size:.52rem;color:var(--text-muted);
                          margin-top:4px;line-height:1.3">
                ${t.description}</div>
            </div>`).join('')}
        </div>` : ''}
    `;
  },

  // ── ONGLET CLASSEMENT ────────────────────────────────
  _renderOngletClassement() {
    const { joueurs, rangUser } = this.getClassement();
    const prs = Tracker.getAllPRs();

    return `
      <!-- Header classement -->
      <div style="background:linear-gradient(135deg,
                  rgba(249,239,119,0.1),rgba(75,75,249,0.05));
                  border:1px solid rgba(249,239,119,0.2);
                  border-radius:var(--radius-lg);
                  padding:14px 16px;margin-bottom:14px;
                  text-align:center">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-lemon);margin-bottom:4px">
          🌍 Classement mondial simulé
        </div>
        <div style="font-size:2rem;font-weight:900;
                    color:var(--fd-lemon)">
          #${rangUser}
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Ta position parmi ${joueurs.length} athlètes
        </div>
      </div>

      <!-- Tes stats de force -->
      <div class="card mb-md">
        <div class="card-label">💪 Tes stats de force</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-top:10px">
          ${[
            { label:'Bench',    ref:'bench_press',   emoji:'⬆️' },
            { label:'Squat',    ref:'squat',         emoji:'🦵' },
            { label:'Deadlift', ref:'soulevé_terre', emoji:'🏋️' }
          ].map(ex => {
            const rm1 = prs[ex.ref]?.rm1 || 0;
            return `
              <div style="text-align:center;padding:10px 4px;
                          background:rgba(255,255,255,0.04);
                          border:1px solid rgba(255,255,255,0.08);
                          border-radius:var(--radius-md)">
                <div style="font-size:1.2rem;margin-bottom:4px">${ex.emoji}</div>
                <div style="font-size:1rem;font-weight:800;
                            color:var(--fd-indigo)">
                  ${rm1 > 0 ? `${rm1}kg` : '—'}</div>
                <div style="font-size:.6rem;color:var(--text-muted)">${ex.label}</div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Top 10 -->
      <div class="card-label mb-sm">🏆 Classement</div>
      ${joueurs.map((j, i) => `
        <div style="display:flex;align-items:center;gap:12px;
                    padding:12px 14px;margin-bottom:6px;
                    background:${j.isUser
                      ? 'rgba(75,75,249,0.15)'
                      : 'rgba(255,255,255,0.03)'};
                    border:1px solid ${j.isUser
                      ? 'rgba(75,75,249,0.4)'
                      : 'rgba(255,255,255,0.06)'};
                    border-radius:var(--radius-lg)">

          <!-- Rang -->
          <div style="width:28px;text-align:center;font-size:.85rem;
                      font-weight:800;flex-shrink:0;
                      color:${i===0 ? '#f9ef77'
                             : i===1 ? '#c0c0c0'
                             : i===2 ? '#cd7f32'
                             : 'var(--text-muted)'}">
            ${i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : `#${i+1}`}
          </div>

          <!-- Avatar -->
          <div style="font-size:1.5rem;flex-shrink:0">${j.emoji}</div>

          <!-- Nom + niveau -->
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:700;
                        color:${j.isUser ? 'var(--fd-indigo)' : 'var(--text-primary)'}">
              ${j.nom}
              ${j.isUser ? `<span style="font-size:.6rem;padding:1px 6px;
                margin-left:4px;background:rgba(75,75,249,0.2);
                border-radius:99px;color:var(--fd-indigo)">
                TOI</span>` : ''}
            </div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              Niv.${j.niveau} · ${j.xp.toLocaleString('fr-FR')} XP
            </div>
          </div>

          <!-- Score -->
          <div style="text-align:right;flex-shrink:0">
            <div style="font-size:.8rem;font-weight:700;
                        color:var(--fd-lemon)">
              ${j.score.toLocaleString('fr-FR')}</div>
            <div style="font-size:.55rem;color:var(--text-muted)">pts</div>
          </div>
        </div>`).join('')}

      <div style="text-align:center;padding:10px;
                  font-size:.68rem;color:var(--text-muted)">
        💡 Score = XP + (Bench+Squat+Dead) × 10
      </div>
    `;
  },

  // ── ONGLET SAISON ────────────────────────────────────
  _renderOngletSaison() {
    const saison = this.getSaisonInfo();
    const xp     = this.getXP();

    return `
      <!-- Header saison -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(191,161,255,0.1));
                  border:1px solid rgba(191,161,255,0.3);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  text-align:center">
        <div style="font-size:2.5rem;margin-bottom:8px">
          ${saison.emoji}
        </div>
        <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">
          ${saison.nom}
        </div>
        <div style="font-size:.78rem;color:rgba(255,255,255,0.6);
                    margin-bottom:16px">
          Semaine ${saison.semaines} / ${saison.total}
        </div>
        <!-- Barre progression saison -->
        <div style="height:8px;background:rgba(255,255,255,0.1);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:6px">
          <div style="height:100%;width:${saison.progression}%;
                      background:linear-gradient(90deg,
                        var(--fd-indigo),var(--fd-lavender));
                      border-radius:99px"></div>
        </div>
        <div style="font-size:.68rem;color:rgba(255,255,255,0.4)">
          ${saison.progression}% de la saison écoulée
        </div>
      </div>

      <!-- Rang actuel -->
      <div style="background:${saison.recompense?.couleur + '11' || 'rgba(75,75,249,0.1)'};
                  border:2px solid ${saison.recompense?.couleur + '44' || 'rgba(75,75,249,0.3)'};
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px;
                  text-align:center">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:${saison.recompense?.couleur || 'var(--fd-indigo)'};
                    margin-bottom:8px">
          🎖️ Ton rang actuel
        </div>
        <div style="font-size:3rem;margin-bottom:4px">
          ${saison.recompense?.emoji || '🌱'}
        </div>
        <div style="font-size:1.5rem;font-weight:900;
                    color:${saison.recompense?.couleur || 'var(--fd-indigo)'}">
          Rang ${saison.rang}
        </div>
        <div style="font-size:.78rem;color:var(--text-muted);margin-top:4px">
          ${saison.recompense?.label || 'Confirmé'}
        </div>
        ${saison.recompense ? `
          <div style="margin-top:10px;padding:6px 12px;
                      background:rgba(255,255,255,0.05);
                      border-radius:99px;font-size:.68rem;
                      color:var(--fd-lemon)">
            Récompense : +${saison.recompense.xp.toLocaleString('fr-FR')} XP
          </div>` : ''}
      </div>

      <!-- Tous les rangs -->
      <div class="card mb-md">
        <div class="card-label mb-md">🏆 Rangs de la saison</div>
        ${this.SAISON.recompenses.map(r => {
          const atteint = xp.niveau.numero >= this.NIVEAUX.findIndex(
            n => n.numero >= (r.rang === 'S' ? 7
               : r.rang === 'A' ? 6
               : r.rang === 'B' ? 5
               : r.rang === 'C' ? 4 : 1)
          ) + 1;
          const actuel = saison.rang === r.rang;
          return `
            <div style="display:flex;align-items:center;gap:12px;
                        padding:10px 0;
                        border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="width:40px;height:40px;border-radius:10px;
                          flex-shrink:0;display:flex;align-items:center;
                          justify-content:center;font-size:1.4rem;
                          background:${r.couleur}22;
                          border:1px solid ${r.couleur}33">
                ${r.emoji}
              </div>
              <div style="flex:1">
                <div style="font-weight:700;font-size:.88rem;
                            color:${actuel ? r.couleur : 'var(--text-primary)'}">
                  Rang ${r.rang} — ${r.label}
                  ${actuel ? `<span style="font-size:.55rem;padding:1px 5px;
                    margin-left:4px;background:${r.couleur}22;
                    border-radius:99px;color:${r.couleur}">ACTUEL</span>` : ''}
                </div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  +${r.xp.toLocaleString('fr-FR')} XP de récompense
                </div>
              </div>
              <div style="font-size:1rem">
                ${actuel ? '▶' : atteint ? '✅' : '🔒'}
              </div>
            </div>`;
        }).join('')}
      </div>

      ${saison.terminee ? `
        <div style="background:rgba(249,239,119,0.1);
                    border:1px solid rgba(249,239,119,0.3);
                    border-radius:var(--radius-lg);
                    padding:16px;text-align:center">
          <div style="font-size:2rem;margin-bottom:8px">🎉</div>
          <div style="font-weight:700;color:var(--fd-lemon)">
            Saison terminée !</div>
          <div style="font-size:.78rem;color:var(--text-muted);margin-top:4px">
            Récompense débloquée — saison suivante bientôt !
          </div>
        </div>` : ''}
    `;
  },

  // ── ONGLET COFFRES ───────────────────────────────────
  _renderOngletCoffres() {
    const xp         = this.getXP();
    const doubleXP   = Utils.storage.get('ft_double_xp_fin', 0);
    const hasDoubleXP = Date.now() < doubleXP;

    return `
      <!-- Info double XP -->
      ${hasDoubleXP ? `
        <div style="background:rgba(249,239,119,0.1);
                    border:1px solid rgba(249,239,119,0.3);
                    border-radius:var(--radius-lg);
                    padding:12px 14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:10px">
          <span style="font-size:1.5rem">⚡</span>
          <div>
            <div style="font-weight:700;color:var(--fd-lemon)">Double XP actif !</div>
            <div style="font-size:.68rem;color:var(--text-muted)">
              Expire dans ${Math.ceil((doubleXP - Date.now()) / (1000*60*60))}h
            </div>
          </div>
        </div>` : ''}

      <!-- XP disponible -->
      <div style="text-align:center;padding:12px;
                  background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  margin-bottom:14px">
        <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:4px">
          XP disponible pour ouvrir des coffres
        </div>
        <div style="font-size:2rem;font-weight:800;color:var(--fd-indigo)">
          ${xp.total.toLocaleString('fr-FR')} XP
        </div>
      </div>

      <!-- Coffres -->
      ${Object.entries(this.LOOT_BOXES).map(([type, box]) => {
        const peutOuvrir = xp.total >= box.xpCost;
        return `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid ${peutOuvrir
                        ? box.couleur + '66'
                        : 'rgba(255,255,255,0.08)'};
                      border-radius:var(--radius-xl);
                      padding:18px;margin-bottom:12px;
                      transition:all .3s">
            <div style="display:flex;align-items:center;gap:14px">
              <div style="width:60px;height:60px;border-radius:16px;
                          flex-shrink:0;display:flex;align-items:center;
                          justify-content:center;font-size:2rem;
                          background:${box.couleur}22;
                          border:2px solid ${box.couleur}44">
                ${box.emoji}
              </div>
              <div style="flex:1">
                <div style="font-size:1rem;font-weight:800;
                            color:${peutOuvrir
                              ? box.couleur : 'var(--text-muted)'}">
                  ${box.nom}
                </div>
                <div style="font-size:.72rem;color:var(--text-muted);
                            margin-top:2px">
                  Coût : ${box.xpCost.toLocaleString('fr-FR')} XP
                </div>
                <!-- Récompenses possibles -->
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
                  ${box.recompenses.map(r => `
                    <span style="font-size:.58rem;padding:2px 6px;
                                 background:rgba(255,255,255,0.06);
                                 border:1px solid rgba(255,255,255,0.08);
                                 border-radius:99px;color:var(--text-muted)">
                      ${r.label} (${Math.round(r.chance*100)}%)
                    </span>`).join('')}
                </div>
              </div>
              <button onclick="Gamification.ouvrirLootBox('${type}');
                               const c=Gamification._getContainer();
                               if(c) setTimeout(()=>Gamification.renderGamificationTab(c),500);"
                      ${!peutOuvrir ? 'disabled' : ''}
                      style="padding:10px 16px;font-size:.78rem;font-weight:700;
                             background:${peutOuvrir
                               ? box.couleur
                               : 'rgba(255,255,255,0.06)'};
                             color:${peutOuvrir ? '#09092d' : 'var(--text-muted)'};
                             border:none;border-radius:var(--radius-md);
                             cursor:${peutOuvrir ? 'pointer' : 'not-allowed'};
                             flex-shrink:0;white-space:nowrap">
                ${peutOuvrir ? '📦 Ouvrir' : '🔒 Locked'}
              </button>
            </div>
            ${!peutOuvrir ? `
              <div style="margin-top:10px">
                <div style="height:4px;background:rgba(255,255,255,0.05);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;
                              width:${Math.min(100,Math.round((xp.total/box.xpCost)*100))}%;
                              background:${box.couleur};border-radius:99px">
                  </div>
                </div>
                <div style="font-size:.6rem;color:var(--text-muted);
                            margin-top:3px;text-align:right">
                  ${xp.total.toLocaleString('fr-FR')} / ${box.xpCost.toLocaleString('fr-FR')} XP
                </div>
              </div>` : ''}
          </div>`;
      }).join('')}

      <div style="text-align:center;padding:10px;
                  font-size:.68rem;color:var(--text-muted)">
        💡 Gagne des XP en faisant des séances pour débloquer des coffres !
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _labelAction(action) {
    const labels = {
      SEANCE_COMPLETE:   '💪 Séance complétée',
      SERIE_COMPLETE:    '✅ Série validée',
      PR_BATTU:          '🏆 Record personnel battu',
      STREAK_7:          '🔥 Streak de 7 jours',
      DEFI_SEMAINE:      '🎯 Défi semaine accompli',
      JOURNAL:           '📔 Entrée journal',
      HUMEUR:            '😊 Humeur du jour',
      SEMAINE_PARF:      '✨ Semaine parfaite',
      PREMIERE_SEANCE:   '🎯 Première séance',
      PHOTO_AJOUTEE:     '📸 Photo progression',
      OBJECTIF_ATTEINT:  '🎯 Objectif atteint',
      MESURE_CORPORELLE: '⚖️ Mesure corporelle',
      SUPERSET_COMPLETE: '⚡ Superset complété',
      CIRCUIT_COMPLETE:  '🔄 Circuit complété',
      NUTRITION_LOG:     '🍽️ Repas logué',
      RECETTE_LOG:       '🥗 Recette loguée',
      HYDRATATION:       '💧 Objectif eau atteint',
      PROGRAMME_IA:      '🧠 Programme IA généré',
      SEANCE_MAISON:     '🏠 Séance à la maison',
      SEANCE_DEHORS:     '🌳 Séance en extérieur',
      BLESSURE_DECLAREE: '🩹 Blessure déclarée',
      DECHARGE_COMPLETE: '😴 Décharge terminée'
    };
    return labels[action] || action.toLowerCase().replace(/_/g,' ');
  },

  getXPParCategorie() {
    const trophees = this.getTrophees().filter(t => t.debloquee);
    const par = {};
    trophees.forEach(t => {
      const cat = t.categorie || 'autre';
      par[cat]  = (par[cat] || 0) + t.xp;
    });
    return par;
  },

  _resetXP() {
    Utils.storage.set('ft_xp_total', 0);
    Utils.storage.set('ft_trophees', []);
    Utils.toast('XP réinitialisé.', 'info');
  }
};

window.Gamification = Gamification;
console.log(
  `✅ Gamification v6.0 — ${Gamification.TROPHEES_DEF.length} trophées`
  + ' + Avatar RPG + Quêtes + Coffres + Classement + Saison'
);
