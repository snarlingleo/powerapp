/* ============================================================
   PowerApp — Nutrition.js v3.0
   Journal + Recettes + Objectifs + Stats + Hydratation
   + Recettes adaptées genre + objectif + muscles
   + Objectifs nutritionnels genre-aware
   + Score nutrition
   + Suggestions repas ciblés
   ============================================================ */

'use strict';

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES ALIMENTS (42 aliments)
// ════════════════════════════════════════════════════════════
const ALIMENTS_DB = {

  // ══════════════════════════════════════
  // PROTÉINES ANIMALES
  // ══════════════════════════════════════
  poulet_grillee: {
    nom:'Poulet grillé',      emoji:'🍗', categorie:'proteines',
    cal:165, prot:31, gluc:0,   lip:3.6, portion:100, unite:'g'
  },
  boeuf_hache: {
    nom:'Bœuf haché 5%',      emoji:'🥩', categorie:'proteines',
    cal:137, prot:21, gluc:0,   lip:5,   portion:100, unite:'g'
  },
  thon_boite: {
    nom:'Thon en boîte',      emoji:'🐟', categorie:'proteines',
    cal:116, prot:26, gluc:0,   lip:1,   portion:100, unite:'g'
  },
  saumon: {
    nom:'Saumon',             emoji:'🐠', categorie:'proteines',
    cal:208, prot:20, gluc:0,   lip:13,  portion:100, unite:'g'
  },
  oeuf_entier: {
    nom:'Œuf entier',         emoji:'🥚', categorie:'proteines',
    cal:155, prot:13, gluc:1,   lip:11,  portion:100, unite:'g'
  },
  blanc_oeuf: {
    nom:'Blanc d\'œuf',       emoji:'🥚', categorie:'proteines',
    cal:52,  prot:11, gluc:1,   lip:0,   portion:100, unite:'g'
  },
  dinde: {
    nom:'Escalope dinde',     emoji:'🦃', categorie:'proteines',
    cal:135, prot:30, gluc:0,   lip:1,   portion:100, unite:'g'
  },
  jambon: {
    nom:'Jambon blanc',       emoji:'🥩', categorie:'proteines',
    cal:107, prot:18, gluc:1,   lip:3,   portion:100, unite:'g'
  },
  crevettes: {
    nom:'Crevettes',          emoji:'🦐', categorie:'proteines',
    cal:99,  prot:24, gluc:0.2, lip:0.3, portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // LAITIERS / VÉGÉTAUX
  // ══════════════════════════════════════
  whey: {
    nom:'Whey Protéine',      emoji:'💪', categorie:'supplements',
    cal:120, prot:24, gluc:3,   lip:2,   portion:30,  unite:'g'
  },
  yaourt_grec: {
    nom:'Yaourt grec 0%',     emoji:'🥛', categorie:'laitiers',
    cal:59,  prot:10, gluc:4,   lip:0,   portion:100, unite:'g'
  },
  fromage_blanc: {
    nom:'Fromage blanc 0%',   emoji:'🥛', categorie:'laitiers',
    cal:45,  prot:8,  gluc:4,   lip:0.2, portion:100, unite:'g'
  },
  cottage_cheese: {
    nom:'Cottage Cheese',     emoji:'🧀', categorie:'laitiers',
    cal:98,  prot:11, gluc:3,   lip:4,   portion:100, unite:'g'
  },
  tofu: {
    nom:'Tofu ferme',         emoji:'🫘', categorie:'proteines',
    cal:76,  prot:8,  gluc:1.9, lip:4.2, portion:100, unite:'g'
  },
  lentilles: {
    nom:'Lentilles cuites',   emoji:'🫘', categorie:'glucides',
    cal:116, prot:9,  gluc:20,  lip:0.4, portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // GLUCIDES / FÉCULENTS
  // ══════════════════════════════════════
  riz_blanc: {
    nom:'Riz blanc cuit',     emoji:'🍚', categorie:'glucides',
    cal:130, prot:2.7,gluc:28,  lip:0.3, portion:100, unite:'g'
  },
  riz_complet: {
    nom:'Riz complet cuit',   emoji:'🍚', categorie:'glucides',
    cal:112, prot:2.6,gluc:24,  lip:0.9, portion:100, unite:'g'
  },
  pates: {
    nom:'Pâtes cuites',       emoji:'🍝', categorie:'glucides',
    cal:158, prot:6,  gluc:31,  lip:1,   portion:100, unite:'g'
  },
  pomme_terre: {
    nom:'Pomme de terre',     emoji:'🥔', categorie:'glucides',
    cal:86,  prot:1.9,gluc:20,  lip:0.1, portion:100, unite:'g'
  },
  patate_douce: {
    nom:'Patate douce',       emoji:'🍠', categorie:'glucides',
    cal:86,  prot:1.6,gluc:20,  lip:0,   portion:100, unite:'g'
  },
  avoine: {
    nom:'Flocons d\'avoine',  emoji:'🌾', categorie:'glucides',
    cal:389, prot:17, gluc:66,  lip:7,   portion:100, unite:'g'
  },
  pain_complet: {
    nom:'Pain complet',       emoji:'🍞', categorie:'glucides',
    cal:247, prot:9,  gluc:48,  lip:3,   portion:100, unite:'g'
  },
  quinoa: {
    nom:'Quinoa cuit',        emoji:'🌾', categorie:'glucides',
    cal:120, prot:4.4,gluc:22,  lip:1.9, portion:100, unite:'g'
  },
  banane: {
    nom:'Banane',             emoji:'🍌', categorie:'fruits',
    cal:89,  prot:1,  gluc:23,  lip:0,   portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // LÉGUMES
  // ══════════════════════════════════════
  brocoli: {
    nom:'Brocoli',            emoji:'🥦', categorie:'legumes',
    cal:34,  prot:3,  gluc:7,   lip:0,   portion:100, unite:'g'
  },
  epinards: {
    nom:'Épinards',           emoji:'🌿', categorie:'legumes',
    cal:23,  prot:3,  gluc:4,   lip:0,   portion:100, unite:'g'
  },
  tomate: {
    nom:'Tomate',             emoji:'🍅', categorie:'legumes',
    cal:18,  prot:1,  gluc:4,   lip:0,   portion:100, unite:'g'
  },
  concombre: {
    nom:'Concombre',          emoji:'🥒', categorie:'legumes',
    cal:15,  prot:1,  gluc:4,   lip:0,   portion:100, unite:'g'
  },
  courgette: {
    nom:'Courgette',          emoji:'🥬', categorie:'legumes',
    cal:17,  prot:1,  gluc:3,   lip:0,   portion:100, unite:'g'
  },
  salade: {
    nom:'Salade verte',       emoji:'🥗', categorie:'legumes',
    cal:15,  prot:1.4,gluc:2.9, lip:0.2, portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // LIPIDES SAINES
  // ══════════════════════════════════════
  avocat: {
    nom:'Avocat',             emoji:'🥑', categorie:'lipides',
    cal:160, prot:2,  gluc:9,   lip:15,  portion:100, unite:'g'
  },
  huile_olive: {
    nom:'Huile d\'olive',     emoji:'🫒', categorie:'lipides',
    cal:884, prot:0,  gluc:0,   lip:100, portion:10,  unite:'ml'
  },
  amandes: {
    nom:'Amandes',            emoji:'🌰', categorie:'lipides',
    cal:579, prot:21, gluc:22,  lip:50,  portion:30,  unite:'g'
  },
  beurre_cacahuete: {
    nom:'Beurre cacahuète',   emoji:'🥜', categorie:'lipides',
    cal:588, prot:25, gluc:20,  lip:50,  portion:30,  unite:'g'
  },
  noix: {
    nom:'Noix',               emoji:'🫘', categorie:'lipides',
    cal:654, prot:15, gluc:14,  lip:65,  portion:30,  unite:'g'
  },

  // ══════════════════════════════════════
  // FRUITS
  // ══════════════════════════════════════
  pomme: {
    nom:'Pomme',              emoji:'🍎', categorie:'fruits',
    cal:52,  prot:0,  gluc:14,  lip:0,   portion:100, unite:'g'
  },
  orange: {
    nom:'Orange',             emoji:'🍊', categorie:'fruits',
    cal:47,  prot:0.9,gluc:12,  lip:0.1, portion:100, unite:'g'
  },
  fraises: {
    nom:'Fraises',            emoji:'🍓', categorie:'fruits',
    cal:32,  prot:0.7,gluc:7.7, lip:0.3, portion:100, unite:'g'
  },
  myrtilles: {
    nom:'Myrtilles',          emoji:'🫐', categorie:'fruits',
    cal:57,  prot:0.7,gluc:14,  lip:0.3, portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // SUPPLÉMENTS
  // ══════════════════════════════════════
  barre_proteinee: {
    nom:'Barre protéinée',    emoji:'🍫', categorie:'supplements',
    cal:200, prot:20, gluc:20,  lip:6,   portion:60,  unite:'g'
  },
  boisson_sport: {
    nom:'Boisson isotonique', emoji:'🧃', categorie:'supplements',
    cal:25,  prot:0,  gluc:6,   lip:0,   portion:500, unite:'ml'
  }
};

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES RECETTES — ✅ v3.0 enrichie (genre + objectif)
// ════════════════════════════════════════════════════════════
const RECETTES_DB = [

  // ══════════════════════════════════════
  // RECETTES UNIVERSELLES
  // ══════════════════════════════════════
  {
    id:'bowl_post_seance', nom:'Bowl post-séance',
    emoji:'🥣', categorie:'post_seance', moment:'post_seance',
    temps:10,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','force'],
    description:'Récupération optimale après l\'entraînement',
    tags:['post-séance','protéines','rapide'],
    ingredients:[
      { ref:'yaourt_grec',      qte:200 },
      { ref:'avoine',           qte:50  },
      { ref:'banane',           qte:100 },
      { ref:'myrtilles',        qte:50  },
      { ref:'beurre_cacahuete', qte:20  }
    ]
  },
  {
    id:'omelette_musculation', nom:'Omelette musculation',
    emoji:'🍳', categorie:'petit_dejeuner', moment:'matin',
    temps:15,
    genre:['homme','femme'],
    objectifs:['prise_masse','force','forme'],
    description:'Petit-déjeuner riche en protéines',
    tags:['matin','protéines','œufs'],
    ingredients:[
      { ref:'oeuf_entier', qte:300 },
      { ref:'blanc_oeuf',  qte:100 },
      { ref:'epinards',    qte:80  },
      { ref:'tomate',      qte:100 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'riz_poulet_legumes', nom:'Riz poulet légumes',
    emoji:'🍱', categorie:'dejeuner', moment:'dejeuner',
    temps:25,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','force','endurance'],
    description:'Le classique de la musculation — équilibré',
    tags:['déjeuner','équilibré','classique'],
    ingredients:[
      { ref:'riz_blanc',      qte:150 },
      { ref:'poulet_grillee', qte:180 },
      { ref:'brocoli',        qte:150 },
      { ref:'courgette',      qte:100 },
      { ref:'huile_olive',    qte:10  }
    ]
  },
  {
    id:'smoothie_proteine', nom:'Smoothie protéiné',
    emoji:'🥤', categorie:'post_seance', moment:'post_seance',
    temps:5,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','force'],
    description:'Récupération express — prêt en 5 minutes',
    tags:['rapide','post-séance','liquide'],
    ingredients:[
      { ref:'whey',          qte:30  },
      { ref:'banane',        qte:100 },
      { ref:'fromage_blanc', qte:150 },
      { ref:'myrtilles',     qte:80  }
    ]
  },
  {
    id:'salade_thon_quinoa', nom:'Salade thon quinoa',
    emoji:'🥗', categorie:'dejeuner', moment:'dejeuner',
    temps:15,
    genre:['homme','femme'],
    objectifs:['seche','perte_poids','forme'],
    description:'Légère et très protéinée — parfaite pour la sèche',
    tags:['sèche','léger','déjeuner'],
    ingredients:[
      { ref:'quinoa',      qte:120 },
      { ref:'thon_boite',  qte:160 },
      { ref:'salade',      qte:100 },
      { ref:'tomate',      qte:150 },
      { ref:'avocat',      qte:80  },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'pancakes_avoine', nom:'Pancakes avoine',
    emoji:'🥞', categorie:'petit_dejeuner', moment:'matin',
    temps:20,
    genre:['homme','femme'],
    objectifs:['prise_masse','endurance','force'],
    description:'Petit-déjeuner énergie pour les grosses séances',
    tags:['matin','énergie','volume'],
    ingredients:[
      { ref:'avoine',        qte:80  },
      { ref:'oeuf_entier',   qte:150 },
      { ref:'fromage_blanc', qte:100 },
      { ref:'banane',        qte:80  }
    ]
  },
  {
    id:'bowl_patate_douce', nom:'Bowl patate douce & poulet',
    emoji:'🍠', categorie:'dejeuner', moment:'dejeuner',
    temps:30,
    genre:['homme','femme'],
    objectifs:['prise_masse','force','endurance'],
    description:'Prise de masse — glucides complexes + protéines',
    tags:['prise de masse','déjeuner','volume'],
    ingredients:[
      { ref:'patate_douce',   qte:200 },
      { ref:'poulet_grillee', qte:200 },
      { ref:'epinards',       qte:100 },
      { ref:'avocat',         qte:80  }
    ]
  },
  {
    id:'cottage_fruits', nom:'Cottage cheese & fruits',
    emoji:'🧀', categorie:'collation', moment:'collation',
    temps:3,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','force'],
    description:'Collation protéinée — parfaite avant de dormir',
    tags:['collation','soir','caséine'],
    ingredients:[
      { ref:'cottage_cheese', qte:200 },
      { ref:'fraises',        qte:100 },
      { ref:'myrtilles',      qte:50  },
      { ref:'amandes',        qte:20  }
    ]
  },
  {
    id:'pates_bolo_sport', nom:'Pâtes bolognaise sport',
    emoji:'🍝', categorie:'diner', moment:'diner',
    temps:30,
    genre:['homme'],
    objectifs:['prise_masse','force','endurance'],
    description:'Repas du soir riche pour la récupération',
    tags:['dîner','masse','pâtes'],
    ingredients:[
      { ref:'pates',       qte:200 },
      { ref:'boeuf_hache', qte:150 },
      { ref:'tomate',      qte:200 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'saumon_riz', nom:'Saumon & riz complet',
    emoji:'🐠', categorie:'diner', moment:'diner',
    temps:25,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','force','seche'],
    description:'Oméga-3 + glucides complexes — récupération nocturne',
    tags:['dîner','récupération','oméga-3'],
    ingredients:[
      { ref:'saumon',      qte:180 },
      { ref:'riz_complet', qte:150 },
      { ref:'brocoli',     qte:150 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'wrap_poulet', nom:'Wrap poulet avocat',
    emoji:'🌯', categorie:'dejeuner', moment:'dejeuner',
    temps:10,
    genre:['homme','femme'],
    objectifs:['forme','seche','perte_poids'],
    description:'Repas rapide et équilibré — idéal au bureau',
    tags:['rapide','déjeuner','bureau'],
    ingredients:[
      { ref:'pain_complet',   qte:60  },
      { ref:'poulet_grillee', qte:120 },
      { ref:'avocat',         qte:60  },
      { ref:'salade',         qte:50  },
      { ref:'tomate',         qte:80  }
    ]
  },
  {
    id:'pre_seance', nom:'Repas pré-séance',
    emoji:'⚡', categorie:'pre_seance', moment:'pre_seance',
    temps:10,
    genre:['homme','femme'],
    objectifs:['prise_masse','force','endurance','forme'],
    description:'Énergie optimale 2h avant l\'entraînement',
    tags:['pré-séance','énergie','timing'],
    ingredients:[
      { ref:'riz_blanc',      qte:150 },
      { ref:'poulet_grillee', qte:120 },
      { ref:'banane',         qte:100 }
    ]
  },
  {
    id:'overnight_oats', nom:'Overnight oats',
    emoji:'🌙', categorie:'petit_dejeuner', moment:'matin',
    temps:5,
    genre:['homme','femme'],
    objectifs:['prise_masse','forme','endurance'],
    description:'Préparer la veille — petit-déjeuner parfait',
    tags:['matin','préparation','masse'],
    ingredients:[
      { ref:'avoine',        qte:80  },
      { ref:'yaourt_grec',   qte:150 },
      { ref:'banane',        qte:80  },
      { ref:'myrtilles',     qte:60  },
      { ref:'amandes',       qte:20  }
    ]
  },
  {
    id:'tofu_wok', nom:'Wok tofu légumes',
    emoji:'🥢', categorie:'diner', moment:'diner',
    temps:20,
    genre:['homme','femme'],
    objectifs:['forme','seche','perte_poids'],
    description:'Option végétarienne haute en protéines',
    tags:['végétarien','dîner','légumes'],
    ingredients:[
      { ref:'tofu',        qte:200 },
      { ref:'riz_blanc',   qte:150 },
      { ref:'brocoli',     qte:150 },
      { ref:'courgette',   qte:100 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'snack_muscu', nom:'Snack musculation',
    emoji:'💪', categorie:'collation', moment:'collation',
    temps:2,
    genre:['homme','femme'],
    objectifs:['prise_masse','force','forme'],
    description:'Collation rapide entre les repas',
    tags:['collation','rapide','protéines'],
    ingredients:[
      { ref:'barre_proteinee', qte:60  },
      { ref:'fromage_blanc',   qte:150 },
      { ref:'amandes',         qte:20  }
    ]
  },

  // ✅ NOUVEAU v3.0 — Recettes FEMME spécifiques
  {
    id:'bowl_acai_femme', nom:'Bowl açaï & fruits',
    emoji:'🫐', categorie:'petit_dejeuner', moment:'matin',
    temps:8,
    genre:['femme'],
    objectifs:['forme','seche','perte_poids'],
    description:'Antioxydants + énergie — parfait pour les femmes actives',
    tags:['matin','femme','antioxydants','léger'],
    ingredients:[
      { ref:'myrtilles',     qte:150 },
      { ref:'fraises',       qte:100 },
      { ref:'banane',        qte:80  },
      { ref:'yaourt_grec',   qte:150 },
      { ref:'amandes',       qte:20  }
    ]
  },
  {
    id:'poulet_citron_salade', nom:'Poulet citron & salade fraîche',
    emoji:'🍋', categorie:'dejeuner', moment:'dejeuner',
    temps:15,
    genre:['femme'],
    objectifs:['seche','perte_poids','forme'],
    description:'Léger, frais et protéiné — idéal pour la sèche féminine',
    tags:['déjeuner','femme','léger','sèche'],
    ingredients:[
      { ref:'poulet_grillee', qte:130 },
      { ref:'salade',         qte:120 },
      { ref:'tomate',         qte:100 },
      { ref:'concombre',      qte:80  },
      { ref:'avocat',         qte:60  },
      { ref:'huile_olive',    qte:8   }
    ]
  },
  {
    id:'curry_pois_chiches', nom:'Curry pois chiches & légumes',
    emoji:'🍲', categorie:'diner', moment:'diner',
    temps:25,
    genre:['femme'],
    objectifs:['forme','seche','perte_poids'],
    description:'Dîner végétarien équilibré, riche en fibres',
    tags:['dîner','femme','végétarien','équilibré'],
    ingredients:[
      { ref:'lentilles',   qte:150 },
      { ref:'tomate',      qte:150 },
      { ref:'courgette',   qte:100 },
      { ref:'epinards',    qte:80  },
      { ref:'huile_olive', qte:8   }
    ]
  },
  {
    id:'smoothie_collagene', nom:'Smoothie collagène & fruits',
    emoji:'🌸', categorie:'collation', moment:'collation',
    temps:5,
    genre:['femme'],
    objectifs:['forme','seche','perte_poids'],
    description:'Collation féminine — peau, cheveux et récupération',
    tags:['collation','femme','beauté','léger'],
    ingredients:[
      { ref:'fraises',       qte:150 },
      { ref:'myrtilles',     qte:80  },
      { ref:'fromage_blanc', qte:150 },
      { ref:'orange',        qte:100 }
    ]
  },
  {
    id:'bowl_fessiers', nom:'Bowl galbe fessiers',
    emoji:'🍑', categorie:'post_seance', moment:'post_seance',
    temps:12,
    genre:['femme'],
    objectifs:['prise_masse','forme','force'],
    description:'Récupération après Lower Body — idéal pour les fessiers',
    tags:['post-séance','femme','fessiers','galbe'],
    ingredients:[
      { ref:'yaourt_grec',    qte:200 },
      { ref:'patate_douce',   qte:120 },
      { ref:'poulet_grillee', qte:100 },
      { ref:'myrtilles',      qte:60  }
    ]
  },
  {
    id:'salade_saumon_avoc', nom:'Salade saumon avocat',
    emoji:'🥗', categorie:'dejeuner', moment:'dejeuner',
    temps:12,
    genre:['femme'],
    objectifs:['seche','forme','perte_poids'],
    description:'Oméga-3 + bons lipides — beauté et performance',
    tags:['déjeuner','femme','oméga-3','sèche'],
    ingredients:[
      { ref:'saumon',      qte:150 },
      { ref:'salade',      qte:120 },
      { ref:'avocat',      qte:80  },
      { ref:'tomate',      qte:100 },
      { ref:'concombre',   qte:80  },
      { ref:'huile_olive', qte:8   }
    ]
  },

  // ✅ NOUVEAU v3.0 — Recettes HOMME spécifiques (volume/force)
  {
    id:'steak_patate_brocoli', nom:'Steak + patate douce + brocoli',
    emoji:'🥩', categorie:'diner', moment:'diner',
    temps:25,
    genre:['homme'],
    objectifs:['prise_masse','force'],
    description:'Repas de force — maximum protéines et glucides',
    tags:['dîner','homme','force','volume'],
    ingredients:[
      { ref:'boeuf_hache',  qte:200 },
      { ref:'patate_douce', qte:250 },
      { ref:'brocoli',      qte:150 },
      { ref:'huile_olive',  qte:12  }
    ]
  },
  {
    id:'shake_prise_masse', nom:'Shake prise de masse',
    emoji:'💪', categorie:'post_seance', moment:'post_seance',
    temps:3,
    genre:['homme'],
    objectifs:['prise_masse','force'],
    description:'Shake hypercalorique pour maximiser la prise de masse',
    tags:['post-séance','homme','masse','shake'],
    ingredients:[
      { ref:'whey',             qte:60  },
      { ref:'avoine',           qte:80  },
      { ref:'banane',           qte:150 },
      { ref:'beurre_cacahuete', qte:30  },
      { ref:'fromage_blanc',    qte:150 }
    ]
  },
  {
    id:'riz_thon_masse', nom:'Riz thon masse',
    emoji:'🍚', categorie:'dejeuner', moment:'dejeuner',
    temps:15,
    genre:['homme'],
    objectifs:['prise_masse','force'],
    description:'Repas haute densité nutritionnelle — prise de masse',
    tags:['déjeuner','homme','masse','simple'],
    ingredients:[
      { ref:'riz_blanc',   qte:250 },
      { ref:'thon_boite',  qte:200 },
      { ref:'huile_olive', qte:15  },
      { ref:'tomate',      qte:150 },
      { ref:'epinards',    qte:80  }
    ]
  },

  // ✅ NOUVEAU v3.0 — Recettes SÈCHE universelles
  {
    id:'poulet_vapeur_legumes', nom:'Poulet vapeur & légumes',
    emoji:'🥦', categorie:'diner', moment:'diner',
    temps:20,
    genre:['homme','femme'],
    objectifs:['seche','perte_poids'],
    description:'Minimum calories, maximum protéines',
    tags:['dîner','sèche','léger','protéines'],
    ingredients:[
      { ref:'poulet_grillee', qte:180 },
      { ref:'brocoli',        qte:200 },
      { ref:'courgette',      qte:150 },
      { ref:'tomate',         qte:100 }
    ]
  },
  {
    id:'omelette_blancs', nom:'Omelette blancs d\'œufs',
    emoji:'🍳', categorie:'petit_dejeuner', moment:'matin',
    temps:10,
    genre:['homme','femme'],
    objectifs:['seche','perte_poids'],
    description:'Moins de lipides, plus de protéines — sèche active',
    tags:['matin','sèche','léger'],
    ingredients:[
      { ref:'blanc_oeuf', qte:300 },
      { ref:'epinards',   qte:100 },
      { ref:'tomate',     qte:100 }
    ]
  },

  // ✅ NOUVEAU v3.0 — Recettes ENDURANCE
  {
    id:'pasta_pre_race', nom:'Pasta pré-compétition',
    emoji:'🍝', categorie:'pre_seance', moment:'pre_seance',
    temps:20,
    genre:['homme','femme'],
    objectifs:['endurance'],
    description:'Charge glucidique avant effort prolongé',
    tags:['pré-séance','endurance','glucides','énergie'],
    ingredients:[
      { ref:'pates',          qte:250 },
      { ref:'poulet_grillee', qte:120 },
      { ref:'tomate',         qte:150 },
      { ref:'huile_olive',    qte:10  }
    ]
  },
  {
    id:'porridge_banane', nom:'Porridge banane & miel',
    emoji:'🌾', categorie:'petit_dejeuner', moment:'matin',
    temps:8,
    genre:['homme','femme'],
    objectifs:['endurance','forme'],
    description:'Énergie longue durée — parfait pour cardio',
    tags:['matin','endurance','énergie','cardio'],
    ingredients:[
      { ref:'avoine',        qte:100 },
      { ref:'banane',        qte:120 },
      { ref:'yaourt_grec',   qte:100 },
      { ref:'myrtilles',     qte:50  }
    ]
  }
];

// ════════════════════════════════════════════════════════════
// MODULE NUTRITION v3.0
// ════════════════════════════════════════════════════════════
const Nutrition = {

  CLE_JOURNAL:   'ft_nutrition_journal',
  CLE_OBJECTIFS: 'ft_nutrition_objectifs',
  CLE_EAU:       'ft_nutrition_eau',
  CLE_CUSTOMS:   'ft_nutrition_customs',

  _ongletActif:    'dashboard',
  _filtreRecette:  'tous',
  _alimentChoisi:  null,
  _chartInstances: {},

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v3.0 — Récupérer profil onboarding
  // ════════════════════════════════════════════════════════
  _getProfilOnboarding() {
    try {
      return Utils.storage.get('ft_profil_onboarding', {
        genre:          'homme',
        objectif:       'forme',
        muscles_cibles: [],
        niveau:         'intermediaire'
      });
    } catch(e) {
      return {
        genre:'homme', objectif:'forme',
        muscles_cibles:[], niveau:'intermediaire'
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // MIGRATION v1 → v2
  // ════════════════════════════════════════════════════════
  _migrerDonneesV1() {
    try {
      for (let i = 0; i < 60; i++) {
        const date     = Utils.ajouterJours(Utils.aujourd_hui(), -i);
        const ancienne = Utils.storage.get(
          `ft_nutrition_${date}`, null
        );

        if (ancienne?.repas?.length) {
          const cleNew    = `${this.CLE_JOURNAL}_${date}`;
          const dejaMigre = Utils.storage.get(cleNew, null);

          if (!dejaMigre) {
            const entrees = ancienne.repas.map(r => ({
              id:     r.id?.toString() || Date.now().toString(),
              ref:    r.ref   || 'custom',
              nom:    r.nom   || 'Aliment',
              emoji:  r.emoji || '🍽️',
              unite:  'g',
              qte:    r.quantite || 100,
              moment: r.repas    || 'dejeuner',
              cal:    r.cal      || 0,
              prot:   r.prot     || 0,
              gluc:   r.gluc     || 0,
              lip:    r.lip      || 0,
              date,
              heure:  r.heure    || '12:00'
            }));
            Utils.storage.set(cleNew, entrees);
          }
        }

        if (ancienne?.eau) {
          const cleEau = `${this.CLE_EAU}_${date}`;
          if (!Utils.storage.get(cleEau, null)) {
            Utils.storage.set(cleEau, ancienne.eau);
          }
        }
      }
    } catch(e) {
      console.warn('[Nutrition] Erreur migration:', e);
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v3.0 — Recettes adaptées genre + objectif
  // ════════════════════════════════════════════════════════
  getRecettesAdaptees(genre = null, objectif = null, limite = 6) {
    const profil   = this._getProfilOnboarding();
    const g        = genre   || profil.genre   || 'homme';
    const obj      = objectif || profil.objectif || 'forme';

    return RECETTES_DB
      .filter(r => {
        const genreOK = !r.genre
          || r.genre.includes(g)
          || r.genre.includes('tous');
        const objOK   = !r.objectifs
          || r.objectifs.includes(obj)
          || r.objectifs.includes('forme');
        return genreOK && objOK;
      })
      .sort((a,b) => {
        // Prioriser les recettes exactement pour ce genre + objectif
        const scoreA = (a.genre?.includes(g) ? 1 : 0)
          + (a.objectifs?.includes(obj) ? 1 : 0);
        const scoreB = (b.genre?.includes(g) ? 1 : 0)
          + (b.objectifs?.includes(obj) ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, limite);
  },

  // ✅ NOUVEAU v3.0 — Suggestion repas selon muscles ciblés
  getSuggestionRepasMusculaire(muscles = []) {
    if (!muscles.length) return null;

    // Muscles qui nécessitent protéines élevées
    const musclesForce = [
      'pectoraux','dorsal','quadriceps','fessiers'
    ];
    const musclesCardio = ['abdominaux','mollets','ischio'];

    const needsProtein = muscles.some(m =>
      musclesForce.includes(m)
    );
    const needsCarbs   = muscles.some(m =>
      musclesCardio.includes(m)
    );

    if (needsProtein) {
      // Suggérer recette haute protéine
      return RECETTES_DB.find(r =>
        r.id === 'riz_poulet_legumes'
        || r.id === 'bowl_patate_douce'
      );
    }
    if (needsCarbs) {
      return RECETTES_DB.find(r =>
        r.id === 'pre_seance'
        || r.id === 'porridge_banane'
      );
    }

    return RECETTES_DB.find(r => r.id === 'salade_thon_quinoa');
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    this._migrerDonneesV1();

    Object.values(this._chartInstances).forEach(c => {
      try { c.destroy(); } catch(e) {}
    });
    this._chartInstances = {};

    const profil    = this._getProfilOnboarding();
    const genre     = profil.genre    || 'homme';
    const objectif  = profil.objectif || 'forme';
    const genreIcon = genre === 'femme' ? '🌸' : '💪';

    container.innerHTML = `
      <!-- Onglets -->
      <div class="tabs-container mb-md"
           style="display:grid;
                  grid-template-columns:repeat(5,1fr);gap:4px">
        ${[
          { id:'dashboard', label:'📊', full:'Dashboard' },
          { id:'journal',   label:'📔', full:'Journal'   },
          { id:'recettes',  label:'🍽️', full:'Recettes'  },
          { id:'objectifs', label:'🎯', full:'Objectifs' },
          { id:'stats',     label:'📈', full:'Stats'     }
        ].map(t => `
          <button onclick="Nutrition._changerOnglet('${t.id}')"
                  style="padding:8px 4px;font-size:.65rem;
                         font-weight:700;text-align:center;
                         cursor:pointer;
                         border-radius:var(--radius-md);
                         transition:all .2s;
                         background:${this._ongletActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.04)'};
                         border:1px solid ${this._ongletActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.08)'};
                         color:${this._ongletActif === t.id
                           ? 'white' : 'var(--text-muted)'}">
            <div style="font-size:1rem;margin-bottom:2px">
              ${t.label}
            </div>
            ${t.full}
          </button>`).join('')}
      </div>
      <div id="nutrition-content"></div>
    `;

    this._rendreOnglet();
  },

  _changerOnglet(id) {
    this._ongletActif = id;
    const p = document.getElementById('page-nutrition');
    if (p) this.render(p);
  },

  _rendreOnglet() {
    const c = document.getElementById('nutrition-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'dashboard': this._rendreDashboard(c); break;
      case 'journal':   this._rendreJournal(c);   break;
      case 'recettes':  this._rendreRecettes(c);  break;
      case 'objectifs': this._rendreObjectifs(c); break;
      case 'stats':     this._rendreStats(c);     break;
    }
  },

  // ════════════════════════════════════════════════════════
  // DASHBOARD — ✅ v3.0 enrichi
  // ════════════════════════════════════════════════════════
  _rendreDashboard(container) {
    const totaux = this.getTotauxJournal();
    const obj    = this.getObjectifs();
    const eau    = this.getEau();
    const eauObj = obj.eau * 1000;
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre    || 'homme';
    const muscles = profil.muscles_cibles || [];

    const pcts = {
      cal:  Math.min(100, Math.round((totaux.cal  / Math.max(obj.calories,  1)) * 100)),
      prot: Math.min(100, Math.round((totaux.prot / Math.max(obj.proteines, 1)) * 100)),
      gluc: Math.min(100, Math.round((totaux.gluc / Math.max(obj.glucides,  1)) * 100)),
      lip:  Math.min(100, Math.round((totaux.lip  / Math.max(obj.lipides,   1)) * 100)),
      eau:  Math.min(100, Math.round((eau         / Math.max(eauObj,        1)) * 100))
    };

    const surplus = totaux.cal - obj.calories;

    // ✅ NOUVEAU v3.0 — Score nutrition
    const scoreNutri = this._calculerScoreNutrition(
      totaux, obj, eau
    );

    // ✅ Suggestion post-séance adaptée
    let postSeance = null;
    try {
      const seanceAuj = Tracker.getSeanceDuJour?.();
      if (seanceAuj?.series?.length > 0) {
        // Suggestion selon muscles ciblés
        if (muscles.length > 0) {
          postSeance = this.getSuggestionRepasMusculaire(muscles)
            || RECETTES_DB.find(r => r.moment === 'post_seance');
        } else {
          postSeance = genre === 'femme'
            ? RECETTES_DB.find(r => r.id === 'bowl_fessiers')
              || RECETTES_DB.find(r => r.moment === 'post_seance')
            : RECETTES_DB.find(r => r.moment === 'post_seance');
        }
      }
    } catch(e) {}

    // ✅ NOUVEAU v3.0 — Recettes recommandées adaptées
    const recettesRecommandees = this.getRecettesAdaptees(
      genre, profil.objectif, 3
    );

    container.innerHTML = `

      <!-- Score nutrition v3.0 -->
      ${scoreNutri.score > 0 ? `
        <div style="background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-left:3px solid var(--fd-indigo);
                    border-radius:var(--radius-xl);
                    padding:12px 14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:12px">
          <div style="font-size:1.8rem;font-weight:900;
                      color:${scoreNutri.score >= 80
                        ? 'var(--fd-mint)'
                        : scoreNutri.score >= 60
                          ? 'var(--fd-lemon)' : 'var(--fd-coral)'}">
            ${scoreNutri.score}
          </div>
          <div style="flex:1">
            <div style="font-size:.72rem;font-weight:700;
                        color:var(--fd-indigo)">
              📊 Score nutrition</div>
            <div style="font-size:.65rem;
                        color:var(--text-muted)">
              ${scoreNutri.message}</div>
          </div>
          <div style="font-size:1.2rem">${scoreNutri.emoji}</div>
        </div>` : ''}

      <!-- Résumé calories -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:18px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:12px">
          <div>
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:.1em;
                        color:var(--fd-indigo)">
              📊 Bilan du jour
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              ${new Date().toLocaleDateString('fr-FR',{
                weekday:'long',day:'numeric',month:'long'
              })}
              ${genre === 'femme' ? ' 🌸' : ''}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.6rem;font-weight:800;
                        color:${pcts.cal >= 110
                          ? 'var(--fd-coral)'
                          : pcts.cal >= 90
                            ? 'var(--fd-mint)'
                            : 'var(--fd-indigo)'}">
              ${Math.round(totaux.cal)}
            </div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              / ${obj.calories} kcal
            </div>
            <div style="font-size:.6rem;font-weight:700;
                        color:${surplus >= 0
                          ? 'var(--fd-coral)' : 'var(--fd-mint)'}">
              ${surplus >= 0 ? '+' : ''}${Math.round(surplus)} kcal
            </div>
          </div>
        </div>

        <div style="height:8px;background:rgba(255,255,255,0.06);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:14px">
          <div style="height:100%;width:${pcts.cal}%;
                      background:${pcts.cal >= 110
                        ? 'var(--fd-coral)' : 'var(--fd-indigo)'};
                      border-radius:99px;
                      transition:width 1s ease">
          </div>
        </div>

        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);gap:8px">
          ${[
            { label:'Protéines', val:totaux.prot,
              obj:obj.proteines,  pct:pcts.prot,
              color:'var(--fd-coral)',    unite:'g', emoji:'💪' },
            { label:'Glucides',  val:totaux.gluc,
              obj:obj.glucides,   pct:pcts.gluc,
              color:'var(--fd-lemon)',    unite:'g', emoji:'⚡' },
            { label:'Lipides',   val:totaux.lip,
              obj:obj.lipides,    pct:pcts.lip,
              color:'var(--fd-lavender)', unite:'g', emoji:'🥑' }
          ].map(m => `
            <div style="text-align:center;padding:10px 6px;
                        background:rgba(255,255,255,0.04);
                        border-radius:var(--radius-md)">
              <div style="font-size:.6rem;color:var(--text-muted);
                          margin-bottom:4px">
                ${m.emoji} ${m.label}
              </div>
              <div style="font-size:.92rem;font-weight:800;
                          color:${m.color}">
                ${Math.round(m.val)}${m.unite}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">
                / ${m.obj}${m.unite}
              </div>
              <div style="height:4px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;overflow:hidden;
                          margin-top:5px">
                <div style="height:100%;width:${m.pct}%;
                            background:${m.pct >= 100
                              ? 'var(--fd-coral)' : m.color};
                            border-radius:99px">
                </div>
              </div>
              <div style="font-size:.55rem;margin-top:2px;
                          color:${m.pct >= 100
                            ? 'var(--fd-coral)' : 'var(--text-muted)'}">
                ${m.pct}%${m.pct >= 100 ? ' ⚠️' : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Hydratation -->
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:10px">
          <div>
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:.08em;
                        color:var(--fd-indigo)">
              💧 Hydratation
            </div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:var(--fd-indigo);margin-top:3px">
              ${(eau/1000).toFixed(2)}L
              <span style="font-size:.7rem;color:var(--text-muted);
                           font-weight:400">
                / ${obj.eau}L
              </span>
            </div>
          </div>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26"
                    fill="none"
                    stroke="rgba(75,75,249,0.12)"
                    stroke-width="7"/>
            <circle cx="32" cy="32" r="26"
                    fill="none"
                    stroke="var(--fd-indigo)"
                    stroke-width="7"
                    stroke-linecap="round"
                    stroke-dasharray="${Math.round(163.4*(pcts.eau/100))} 163.4"
                    transform="rotate(-90 32 32)"
                    style="transition:stroke-dasharray .8s ease"/>
            <text x="32" y="36" text-anchor="middle"
                  fill="var(--fd-indigo)" font-size="11"
                  font-weight="800">${pcts.eau}%</text>
          </svg>
        </div>

        <div style="height:7px;background:rgba(75,75,249,0.1);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:12px">
          <div style="height:100%;width:${pcts.eau}%;
                      background:var(--fd-indigo);
                      border-radius:99px;
                      transition:width .8s ease">
          </div>
        </div>

        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);gap:6px">
          ${[
            {ml:150,  label:'+150', icon:'🥛'},
            {ml:250,  label:'+250', icon:'🥤'},
            {ml:500,  label:'+500', icon:'💧'},
            {ml:1000, label:'+1L',  icon:'🍶'}
          ].map(b => `
            <button onclick="Nutrition._ajouterEau(${b.ml})"
                    style="padding:8px 4px;text-align:center;
                           background:rgba(75,75,249,0.12);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:var(--radius-md);
                           cursor:pointer;transition:all .15s"
                    onmousedown="this.style.transform='scale(.94)'"
                    onmouseup="this.style.transform=''">
              <div style="font-size:.95rem">${b.icon}</div>
              <div style="font-size:.58rem;font-weight:700;
                          color:var(--fd-indigo);margin-top:2px">
                ${b.label}ml
              </div>
            </button>`).join('')}
        </div>

        ${pcts.eau >= 100 ? `
          <div style="margin-top:10px;padding:6px 12px;
                      background:rgba(139,240,187,0.1);
                      border:1px solid rgba(139,240,187,0.2);
                      border-radius:var(--radius-md);
                      font-size:.72rem;color:var(--fd-mint);
                      font-weight:700;text-align:center">
            ✅ Objectif hydratation atteint ! 💧
          </div>` : `
          <div style="margin-top:8px;font-size:.62rem;
                      color:var(--text-muted);text-align:center">
            Encore ${((eauObj-eau)/1000).toFixed(2)}L
            pour atteindre ton objectif
          </div>`}
      </div>

      <!-- Suggestion post-séance adaptée genre -->
      ${postSeance ? `
        <div style="background:rgba(139,240,187,0.07);
                    border:1px solid rgba(139,240,187,0.25);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px;cursor:pointer"
             onclick="Nutrition._voirRecette('${postSeance.id}')">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-mint);margin-bottom:6px">
            ⚡ Suggestion post-séance
            ${genre === 'femme' ? '🌸' : ''}
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.8rem">${postSeance.emoji}</span>
            <div style="flex:1">
              <div style="font-size:.88rem;font-weight:700">
                ${postSeance.nom}
              </div>
              <div style="font-size:.65rem;color:var(--text-muted)">
                ${this._calculerMacrosRecette(postSeance).cal} kcal
                · ${this._calculerMacrosRecette(postSeance).prot}g prot
                · ⏱ ${postSeance.temps} min
              </div>
            </div>
            <div style="color:var(--fd-mint);font-size:1.2rem">›</div>
          </div>
        </div>` : ''}

      <!-- ✅ NOUVEAU v3.0 — Recettes recommandées adaptées -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:10px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted)">
            🍽️ Recettes pour toi
            ${genre === 'femme' ? '🌸' : '💪'}
          </div>
          <button onclick="Nutrition._changerOnglet('recettes')"
                  style="background:none;border:none;
                         font-size:.68rem;color:var(--fd-indigo);
                         cursor:pointer;font-weight:600">
            Voir tout →
          </button>
        </div>
        ${recettesRecommandees.map(r => {
          const macros = this._calculerMacrosRecette(r);
          return `
            <div onclick="Nutrition._voirRecette('${r.id}')"
                 style="display:flex;align-items:center;gap:10px;
                        padding:8px 0;
                        border-bottom:1px solid var(--border-color);
                        cursor:pointer">
              <span style="font-size:1.3rem">${r.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:600">
                  ${r.nom}
                </div>
                <div style="font-size:.6rem;color:var(--text-muted)">
                  ⏱ ${r.temps}min · ${macros.prot}g prot
                  · ${macros.cal} kcal
                </div>
              </div>
              <span style="color:var(--fd-indigo)">›</span>
            </div>`;
        }).join('')}
      </div>

      <!-- Dernières entrées -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:10px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted)">
            📔 Dernières entrées
          </div>
          <button onclick="Nutrition._changerOnglet('journal')"
                  style="background:none;border:none;
                         font-size:.68rem;color:var(--fd-indigo);
                         cursor:pointer;font-weight:600">
            Voir tout →
          </button>
        </div>
        ${this._renderDernieresEntrees()}
      </div>

      <button onclick="Nutrition._ouvrirAjoutAliment()"
              class="btn-primary"
              style="width:100%;font-size:.88rem">
        ➕ Ajouter un aliment
      </button>
    `;
  },

  // ✅ NOUVEAU v3.0 — Score nutrition
  _calculerScoreNutrition(totaux, obj, eau) {
    if (totaux.cal === 0) return { score:0, emoji:'', message:'' };

    const pctCal  = (totaux.cal  / Math.max(obj.calories,  1)) * 100;
    const pctProt = (totaux.prot / Math.max(obj.proteines, 1)) * 100;
    const pctEau  = (eau         / Math.max(obj.eau * 1000, 1)) * 100;

    let score = 0;

    // Calories (40 pts)
    if (pctCal >= 85 && pctCal <= 115) score += 40;
    else if (pctCal >= 70 && pctCal <= 130) score += 25;
    else score += 10;

    // Protéines (35 pts) — le plus important
    if (pctProt >= 90) score += 35;
    else if (pctProt >= 70) score += 20;
    else score += 5;

    // Hydratation (25 pts)
    if (pctEau >= 90) score += 25;
    else if (pctEau >= 60) score += 15;
    else score += 5;

    const s = Math.min(100, score);

    return {
      score: s,
      emoji: s >= 80 ? '🌟' : s >= 60 ? '👍' : '📊',
      message: s >= 80
        ? 'Excellente journée nutritionnelle !'
        : s >= 60
          ? 'Bonne nutrition — continue !'
          : pctProt < 70
            ? `⚠️ Protéines insuffisantes — encore ${Math.round(obj.proteines - totaux.prot)}g`
            : `Augmente ton apport pour atteindre tes objectifs`
    };
  },

  _renderDernieresEntrees() {
    const journal = this._getJournal();
    const entrees = journal.slice(-3).reverse();

    if (!entrees.length) return `
      <div style="text-align:center;padding:16px;
                  color:var(--text-muted);font-size:.82rem">
        Aucune entrée aujourd'hui
      </div>`;

    return entrees.map(e => {
      const ali = ALIMENTS_DB[e.ref] || {
        nom: e.nom || e.ref, emoji: e.emoji || '🍽️'
      };
      return `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:8px 0;
                    border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.2rem">${ali.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:600">
              ${ali.nom || e.nom}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              ${e.qte || e.quantite || 100}${e.unite || 'g'}
              · ${e.moment || ''}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.78rem;font-weight:700;
                        color:var(--fd-lemon)">
              ${Math.round(e.cal)} kcal
            </div>
            <div style="font-size:.58rem;color:var(--fd-coral)">
              ${Math.round(e.prot)}g prot
            </div>
          </div>
        </div>`;
    }).join('');
  },

  // ════════════════════════════════════════════════════════
  // JOURNAL
  // ════════════════════════════════════════════════════════
  _rendreJournal(container) {
    const journal = this._getJournal();
    const totaux  = this.getTotauxJournal();
    const obj     = this.getObjectifs();
    const moments = [
      { id:'matin',       label:'🌅 Matin'      },
      { id:'dejeuner',    label:'☀️ Déjeuner'   },
      { id:'collation',   label:'🍎 Collation'  },
      { id:'diner',       label:'🌙 Dîner'      },
      { id:'post_seance', label:'⚡ Post-séance' },
      { id:'pre_seance',  label:'🎯 Pré-séance'  }
    ];

    container.innerHTML = `
      <!-- Totaux -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:10px">
          <div style="font-size:.88rem;font-weight:800">
            Total du jour</div>
          <div style="font-size:1rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${Math.round(totaux.cal)} kcal</div>
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);gap:8px">
          ${[
            { label:'Prot.', val:totaux.prot,
              obj:obj.proteines, color:'var(--fd-coral)'   },
            { label:'Gluc.', val:totaux.gluc,
              obj:obj.glucides,  color:'var(--fd-lemon)'   },
            { label:'Lip.',  val:totaux.lip,
              obj:obj.lipides,   color:'var(--fd-lavender)'}
          ].map(m => {
            const pct = Math.min(100, Math.round(
              (m.val / Math.max(m.obj,1)) * 100
            ));
            return `
              <div>
                <div style="display:flex;justify-content:space-between;
                            margin-bottom:3px">
                  <span style="font-size:.6rem;
                               color:var(--text-muted)">${m.label}</span>
                  <span style="font-size:.6rem;font-weight:700;
                               color:${m.color}">
                    ${Math.round(m.val)}g</span>
                </div>
                <div style="height:4px;
                            background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${m.color};
                              border-radius:99px"></div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <button onclick="Nutrition._ouvrirAjoutAliment()"
              class="btn-primary"
              style="width:100%;margin-bottom:14px;
                     font-size:.88rem">
        ➕ Ajouter un aliment
      </button>

      <!-- Entrées par moment -->
      ${moments.map(moment => {
        const entrees = journal.filter(
          e => (e.moment || e.repas) === moment.id
        );
        if (!entrees.length) return '';

        const totalMoment = entrees.reduce(
          (a, e) => ({
            cal:  a.cal  + (e.cal  || 0),
            prot: a.prot + (e.prot || 0)
          }),
          { cal:0, prot:0 }
        );

        return `
          <div style="margin-bottom:16px">
            <div style="display:flex;align-items:center;
                        justify-content:space-between;
                        margin-bottom:8px">
              <div style="font-size:.72rem;font-weight:700;
                          color:var(--text-muted);
                          display:flex;align-items:center;gap:6px">
                <div style="width:3px;height:12px;border-radius:99px;
                            background:var(--fd-indigo)"></div>
                ${moment.label}
              </div>
              <div style="font-size:.65rem;color:var(--text-muted)">
                ${Math.round(totalMoment.cal)} kcal
                · ${Math.round(totalMoment.prot)}g prot
              </div>
            </div>
            ${entrees.map(e => {
              const ali = ALIMENTS_DB[e.ref] || {
                nom:   e.nom   || e.ref,
                emoji: e.emoji || '🍽️'
              };
              return `
                <div style="display:flex;align-items:center;
                            gap:10px;padding:10px 12px;
                            background:var(--bg-input);
                            border:1px solid var(--border-color);
                            border-radius:var(--radius-md);
                            margin-bottom:6px">
                  <span style="font-size:1.3rem;flex-shrink:0">
                    ${ali.emoji || e.emoji || '🍽️'}
                  </span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:.82rem;font-weight:700;
                                overflow:hidden;text-overflow:ellipsis;
                                white-space:nowrap">
                      ${ali.nom || e.nom}
                    </div>
                    <div style="font-size:.6rem;color:var(--text-muted)">
                      ${e.qte || e.quantite || 100}${e.unite || 'g'}
                      · P:${Math.round(e.prot||0)}g
                      · G:${Math.round(e.gluc||0)}g
                      · L:${Math.round(e.lip||0)}g
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:.82rem;font-weight:800;
                                color:var(--fd-lemon)">
                      ${Math.round(e.cal||0)}</div>
                    <div style="font-size:.55rem;
                                color:var(--text-muted)">kcal</div>
                  </div>
                  <button onclick="Nutrition._supprimerEntree('${e.id}')"
                          style="width:28px;height:28px;flex-shrink:0;
                                 background:rgba(255,141,150,0.1);
                                 border:1px solid rgba(255,141,150,0.2);
                                 border-radius:50%;
                                 color:var(--fd-coral);
                                 font-size:.75rem;cursor:pointer">
                    ✕
                  </button>
                </div>`;
            }).join('')}
          </div>`;
      }).join('')}

      ${journal.length === 0 ? `
        <div style="text-align:center;padding:32px 16px;
                    color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">📔</div>
          <div style="font-size:.88rem">Aucune entrée aujourd'hui</div>
          <div style="font-size:.72rem;margin-top:4px">
            Clique sur ➕ pour commencer</div>
        </div>` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // MODALE AJOUT ALIMENT
  // ════════════════════════════════════════════════════════
  _ouvrirAjoutAliment(momentPrefere = 'dejeuner') {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    window._momentSelectionne = momentPrefere;

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <div style="font-size:.88rem;font-weight:800;
                    margin-bottom:12px">
          ➕ Ajouter un aliment
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:6px;margin-bottom:14px">
          <button id="btn-mode-liste"
                  onclick="Nutrition._modeAjout('liste')"
                  style="padding:8px;background:var(--fd-indigo);
                         color:white;border:none;
                         border-radius:var(--radius-md);
                         font-size:.75rem;font-weight:700;
                         cursor:pointer">
            📋 Liste
          </button>
          <button id="btn-mode-manuel"
                  onclick="Nutrition._modeAjout('manuel')"
                  style="padding:8px;background:var(--bg-input);
                         color:var(--text-muted);
                         border:1px solid var(--border-color);
                         border-radius:var(--radius-md);
                         font-size:.75rem;font-weight:700;
                         cursor:pointer">
            ✏️ Manuel
          </button>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:6px;font-weight:600">
            Moment de la journée
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${[
              { id:'matin',       label:'🌅 Matin'      },
              { id:'dejeuner',    label:'☀️ Déjeuner'   },
              { id:'collation',   label:'🍎 Collation'  },
              { id:'diner',       label:'🌙 Dîner'      },
              { id:'post_seance', label:'⚡ Post-séance' }
            ].map(m => `
              <button onclick="Nutrition._selectMoment('${m.id}',this)"
                      id="moment-${m.id}"
                      style="padding:5px 10px;font-size:.65rem;
                             font-weight:600;cursor:pointer;
                             border-radius:var(--radius-full);
                             background:${m.id === momentPrefere
                               ? 'rgba(75,75,249,0.2)' : 'var(--bg-input)'};
                             border:1px solid ${m.id === momentPrefere
                               ? 'var(--fd-indigo)' : 'var(--border-color)'};
                             color:${m.id === momentPrefere
                               ? 'var(--fd-indigo)' : 'var(--text-muted)'}">
                ${m.label}
              </button>`).join('')}
          </div>
        </div>
        <div id="ajout-content"></div>
      </div>
    `;

    modal.classList.remove('hidden');
    this._modeAjout('liste');

    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  _selectMoment(id, btn) {
    window._momentSelectionne = id;
    document.querySelectorAll('[id^="moment-"]').forEach(b => {
      b.style.background  = 'var(--bg-input)';
      b.style.borderColor = 'var(--border-color)';
      b.style.color       = 'var(--text-muted)';
    });
    btn.style.background  = 'rgba(75,75,249,0.2)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'var(--fd-indigo)';
  },

  _modeAjout(mode) {
    const c       = document.getElementById('ajout-content');
    const btnL    = document.getElementById('btn-mode-liste');
    const btnM    = document.getElementById('btn-mode-manuel');
    if (!c) return;

    if (btnL) {
      btnL.style.background = mode === 'liste'
        ? 'var(--fd-indigo)' : 'var(--bg-input)';
      btnL.style.color = mode === 'liste'
        ? 'white' : 'var(--text-muted)';
      btnL.style.border = mode === 'liste'
        ? 'none' : '1px solid var(--border-color)';
    }
    if (btnM) {
      btnM.style.background = mode === 'manuel'
        ? 'var(--fd-indigo)' : 'var(--bg-input)';
      btnM.style.color = mode === 'manuel'
        ? 'white' : 'var(--text-muted)';
      btnM.style.border = mode === 'manuel'
        ? 'none' : '1px solid var(--border-color)';
    }

    if (mode === 'liste') {
      c.innerHTML = `
        <div style="position:relative;margin-bottom:10px">
          <input id="search-aliment" type="text"
                 placeholder="Rechercher un aliment..."
                 oninput="Nutrition._rechercherAliment(this.value)"
                 style="width:100%;padding:10px 14px 10px 36px;
                        background:var(--bg-input);
                        border:1px solid var(--border-color);
                        border-radius:var(--radius-md);
                        color:var(--text-primary);
                        font-size:.82rem;outline:none"/>
          <span style="position:absolute;left:12px;top:50%;
                       transform:translateY(-50%);font-size:.9rem">
            🔍</span>
        </div>
        <div id="liste-aliments"
             style="max-height:300px;overflow-y:auto">
          ${this._renderListeAlimentsModal('')}
        </div>
      `;
    } else {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px">
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:4px">Nom *</div>
            <input id="manuel-nom" type="text" class="input"
                   placeholder="ex: Mon repas maison"
                   autocomplete="off"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:8px">
            <div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-bottom:4px">Calories *</div>
              <input id="manuel-cal" type="number"
                     class="input" placeholder="kcal" min="0"/>
            </div>
            <div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-bottom:4px">Protéines (g)</div>
              <input id="manuel-prot" type="number"
                     class="input" placeholder="g" min="0"/>
            </div>
            <div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-bottom:4px">Glucides (g)</div>
              <input id="manuel-gluc" type="number"
                     class="input" placeholder="g" min="0"/>
            </div>
            <div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-bottom:4px">Lipides (g)</div>
              <input id="manuel-lip" type="number"
                     class="input" placeholder="g" min="0"/>
            </div>
          </div>
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:4px">Quantité (g)</div>
            <input id="manuel-qte" type="number" class="input"
                   placeholder="100" value="100" min="1"/>
          </div>
          <button onclick="Nutrition._ajouterManuel()"
                  class="btn-primary" style="width:100%">
            ✅ Ajouter
          </button>
        </div>
      `;
    }
  },

  _renderListeAlimentsModal(recherche) {
    const q = (recherche || '').toLowerCase().trim();
    const aliments = Object.entries(ALIMENTS_DB)
      .filter(([, ali]) => !q || ali.nom.toLowerCase().includes(q));

    if (!aliments.length) return `
      <div style="text-align:center;padding:20px;
                  color:var(--text-muted);font-size:.82rem">
        Aucun aliment trouvé
      </div>`;

    return aliments.map(([ref, ali]) => `
      <div onclick="Nutrition._selectionnerAliment('${ref}')"
           style="display:flex;align-items:center;gap:10px;
                  padding:10px 12px;cursor:pointer;
                  border-bottom:1px solid var(--border-color);
                  transition:background .15s"
           onmouseenter="this.style.background=
             'rgba(75,75,249,0.06)'"
           onmouseleave="this.style.background='transparent'">
        <span style="font-size:1.2rem;flex-shrink:0">${ali.emoji}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:.82rem;font-weight:700">
            ${ali.nom}</div>
          <div style="font-size:.6rem;color:var(--text-muted)">
            ${ali.cal}kcal · P:${ali.prot}g · G:${ali.gluc}g
            · L:${ali.lip}g / ${ali.portion}${ali.unite}
          </div>
        </div>
        <span style="color:var(--text-muted);flex-shrink:0">›</span>
      </div>`).join('');
  },

  _rechercherAliment(val) {
    const liste = document.getElementById('liste-aliments');
    if (liste) liste.innerHTML = this._renderListeAlimentsModal(val);
  },

  _selectionnerAliment(ref) {
    const ali = ALIMENTS_DB[ref];
    if (!ali) return;

    this._alimentChoisi = ref;
    const c = document.getElementById('ajout-content');
    if (!c) return;

    c.innerHTML = `
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;
                    gap:10px;margin-bottom:12px">
          <span style="font-size:1.8rem">${ali.emoji}</span>
          <div>
            <div style="font-size:.9rem;font-weight:800">
              ${ali.nom}</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              Pour ${ali.portion}${ali.unite} :
              ${ali.cal}kcal · P:${ali.prot}g
              · G:${ali.gluc}g · L:${ali.lip}g
            </div>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:6px;font-weight:600">
            Quantité (${ali.unite})
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button onclick="Nutrition._ajusterQte(-${ali.portion >= 100 ? 25 : 5})"
                    style="width:42px;height:42px;
                           background:rgba(255,141,150,0.12);
                           border:2px solid rgba(255,141,150,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-coral);cursor:pointer">
              −
            </button>
            <input id="qte-aliment" type="number"
                   value="${ali.portion}" min="1" max="2000"
                   oninput="Nutrition._updateApercuMacros(
                     '${ref}', this.value)"
                   style="flex:1;padding:10px;font-size:1.1rem;
                          font-weight:800;text-align:center;
                          background:var(--bg-card);
                          border:2px solid var(--border-color);
                          border-radius:var(--radius-md);
                          color:var(--text-primary);outline:none"/>
            <button onclick="Nutrition._ajusterQte(${ali.portion >= 100 ? 25 : 5})"
                    style="width:42px;height:42px;
                           background:rgba(139,240,187,0.12);
                           border:2px solid rgba(139,240,187,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-mint);cursor:pointer">
              +
            </button>
          </div>
        </div>

        <div id="apercu-macros"
             style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:6px;padding:10px;
                    background:var(--bg-input);
                    border-radius:var(--radius-md)">
          ${this._renderApercuMacros(ali, ali.portion)}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button onclick="Nutrition._modeAjout('liste')"
                class="btn-secondary" style="font-size:.82rem">
          ← Retour
        </button>
        <button onclick="Nutrition._confirmerAjout('${ref}')"
                class="btn-primary" style="font-size:.82rem">
          ✅ Ajouter
        </button>
      </div>
    `;
  },

  _ajusterQte(delta) {
    const input = document.getElementById('qte-aliment');
    if (!input) return;
    const nouveau = Math.max(1,
      (parseFloat(input.value) || 0) + delta
    );
    input.value = nouveau;
    this._updateApercuMacros(this._alimentChoisi, nouveau);
  },

  _updateApercuMacros(ref, qte) {
    const ali    = ALIMENTS_DB[ref];
    if (!ali) return;
    const apercu = document.getElementById('apercu-macros');
    if (apercu) apercu.innerHTML =
      this._renderApercuMacros(ali, parseFloat(qte) || 0);
  },

  _renderApercuMacros(ali, qte) {
    const ratio = qte / ali.portion;
    return [
      { label:'Cal',  val:Math.round(ali.cal  * ratio),
        color:'var(--fd-lemon)',    unite:'kcal' },
      { label:'Prot', val:Math.round(ali.prot * ratio * 10) / 10,
        color:'var(--fd-coral)',    unite:'g'    },
      { label:'Gluc', val:Math.round(ali.gluc * ratio * 10) / 10,
        color:'var(--fd-indigo)',   unite:'g'    },
      { label:'Lip',  val:Math.round(ali.lip  * ratio * 10) / 10,
        color:'var(--fd-lavender)', unite:'g'    }
    ].map(m => `
      <div style="text-align:center">
        <div style="font-size:.9rem;font-weight:800;
                    color:${m.color}">${m.val}</div>
        <div style="font-size:.5rem;color:var(--text-muted);
                    text-transform:uppercase;margin-top:1px">
          ${m.label}</div>
      </div>`).join('');
  },

  _confirmerAjout(ref) {
    const ali    = ALIMENTS_DB[ref];
    if (!ali) return;
    const qte    = parseFloat(
      document.getElementById('qte-aliment')?.value
    ) || ali.portion;
    const moment = window._momentSelectionne || 'dejeuner';
    const ratio  = qte / ali.portion;

    const entree = {
      id:    Date.now().toString(),
      ref,
      nom:   ali.nom,
      emoji: ali.emoji,
      unite: ali.unite,
      qte,
      moment,
      cal:   Math.round(ali.cal  * ratio * 10) / 10,
      prot:  Math.round(ali.prot * ratio * 10) / 10,
      gluc:  Math.round(ali.gluc * ratio * 10) / 10,
      lip:   Math.round(ali.lip  * ratio * 10) / 10,
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    };

    this._ajouterEntreeJournal(entree);
    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}

    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ ${ali.nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();
    this._alimentChoisi = null;

    const p = document.getElementById('page-nutrition');
    if (p) this.render(p);
  },

  _ajouterManuel() {
    const nom  = document.getElementById('manuel-nom')
      ?.value?.trim();
    const cal  = parseFloat(
      document.getElementById('manuel-cal')?.value)  || 0;
    const prot = parseFloat(
      document.getElementById('manuel-prot')?.value) || 0;
    const gluc = parseFloat(
      document.getElementById('manuel-gluc')?.value) || 0;
    const lip  = parseFloat(
      document.getElementById('manuel-lip')?.value)  || 0;
    const qte  = parseFloat(
      document.getElementById('manuel-qte')?.value)  || 100;

    if (!nom) { Utils.toast('Entre le nom !', 'error'); return; }
    if (!cal) { Utils.toast('Entre les calories !', 'error'); return; }

    const ratio  = qte / 100;
    const moment = window._momentSelectionne || 'dejeuner';

    const entree = {
      id:    Date.now().toString(),
      ref:   'custom_' + Date.now(),
      nom,
      emoji: '🍽️',
      unite: 'g',
      qte,
      moment,
      cal:   Math.round(cal  * ratio * 10) / 10,
      prot:  Math.round(prot * ratio * 10) / 10,
      gluc:  Math.round(gluc * ratio * 10) / 10,
      lip:   Math.round(lip  * ratio * 10) / 10,
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    };

    this._ajouterEntreeJournal(entree);
    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}

    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ ${nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();

    const p = document.getElementById('page-nutrition');
    if (p) this.render(p);
  },

  // ════════════════════════════════════════════════════════
  // RECETTES — ✅ v3.0 filtre genre + objectif
  // ════════════════════════════════════════════════════════
  _rendreRecettes(container) {
    const profil  = this._getProfilOnboarding();
    const genre   = profil.genre    || 'homme';
    const objectif = profil.objectif || 'forme';

    const filtres = [
      { id:'tous',          label:'Tous'                          },
      { id:'genre_adapte',  label:`${genre === 'femme' ? '🌸' : '💪'} Pour moi` },
      { id:'petit_dejeuner',label:'🌅 Matin'                     },
      { id:'dejeuner',      label:'☀️ Déjeuner'                  },
      { id:'collation',     label:'🍎 Collation'                 },
      { id:'diner',         label:'🌙 Dîner'                     },
      { id:'post_seance',   label:'⚡ Post-séance'                },
      { id:'pre_seance',    label:'🎯 Pré-séance'                 }
    ];

    let recettesFiltrees;
    if (this._filtreRecette === 'genre_adapte') {
      recettesFiltrees = this.getRecettesAdaptees(genre, objectif, 20);
    } else if (this._filtreRecette === 'tous') {
      recettesFiltrees = RECETTES_DB;
    } else {
      recettesFiltrees = RECETTES_DB.filter(
        r => r.categorie === this._filtreRecette
      );
    }

    container.innerHTML = `
      <div class="muscle-filter-row mb-md">
        ${filtres.map(f => `
          <button class="muscle-filter-btn ${
            this._filtreRecette === f.id ? 'active' : ''}"
                  onclick="Nutrition._filtrerRecettes('${f.id}')">
            ${f.label}
          </button>`).join('')}
      </div>

      <div style="display:flex;flex-direction:column;gap:10px">
        ${recettesFiltrees.map(recette => {
          const macros = this._calculerMacrosRecette(recette);
          const estFemme = recette.genre?.length === 1
            && recette.genre[0] === 'femme';
          const estHomme = recette.genre?.length === 1
            && recette.genre[0] === 'homme';

          return `
            <div onclick="Nutrition._voirRecette('${recette.id}')"
                 style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-xl);
                        padding:14px;cursor:pointer;
                        transition:all .15s"
                 onmouseenter="this.style.borderColor=
                   'rgba(75,75,249,0.3)'"
                 onmouseleave="this.style.borderColor=
                   'rgba(255,255,255,0.08)'">
              <div style="display:flex;align-items:center;
                          gap:12px;margin-bottom:10px">
                <span style="font-size:2rem;flex-shrink:0">
                  ${recette.emoji}</span>
                <div style="flex:1">
                  <div style="font-size:.9rem;font-weight:800;
                              margin-bottom:2px">
                    ${recette.nom}
                    <!-- Badge genre -->
                    ${estFemme
                      ? `<span style="font-size:.55rem;padding:1px 5px;
                                     background:rgba(255,141,150,0.15);
                                     border:1px solid rgba(255,141,150,0.3);
                                     border-radius:99px;
                                     color:var(--fd-coral);
                                     margin-left:4px">🌸</span>`
                      : estHomme
                        ? `<span style="font-size:.55rem;padding:1px 5px;
                                       background:rgba(75,75,249,0.15);
                                       border:1px solid rgba(75,75,249,0.3);
                                       border-radius:99px;
                                       color:var(--fd-lavender);
                                       margin-left:4px">💪</span>`
                        : ''}
                  </div>
                  <div style="font-size:.65rem;color:var(--text-muted)">
                    ⏱ ${recette.temps} min
                    · ${recette.ingredients.length} ingrédients
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-lemon)">
                    ${macros.cal}</div>
                  <div style="font-size:.55rem;
                              color:var(--text-muted)">kcal</div>
                </div>
              </div>

              <div style="display:grid;
                          grid-template-columns:repeat(3,1fr);
                          gap:6px">
                ${[
                  { l:'P', val:macros.prot,
                    color:'var(--fd-coral)',    max:50  },
                  { l:'G', val:macros.gluc,
                    color:'var(--fd-indigo)',   max:100 },
                  { l:'L', val:macros.lip,
                    color:'var(--fd-lavender)', max:50  }
                ].map(m => `
                  <div>
                    <div style="display:flex;
                                justify-content:space-between;
                                margin-bottom:2px">
                      <span style="font-size:.55rem;
                                   color:${m.color};
                                   font-weight:700">${m.l}</span>
                      <span style="font-size:.55rem;
                                   color:var(--text-muted)">
                        ${m.val}g</span>
                    </div>
                    <div style="height:3px;
                                background:rgba(255,255,255,0.06);
                                border-radius:99px;overflow:hidden">
                      <div style="height:100%;
                                  width:${Math.min(100,
                                    Math.round((m.val/m.max)*100))}%;
                                  background:${m.color};
                                  border-radius:99px">
                      </div>
                    </div>
                  </div>`).join('')}
              </div>

              <div style="display:flex;flex-wrap:wrap;gap:4px;
                          margin-top:8px">
                ${recette.tags.map(tag => `
                  <span style="padding:2px 7px;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.15);
                               border-radius:99px;font-size:.58rem;
                               color:var(--fd-lavender)">
                    ${tag}</span>`).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },

  _filtrerRecettes(filtreId) {
    this._filtreRecette = filtreId;
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreRecettes(c);
  },

  _voirRecette(id) {
    const recette = RECETTES_DB.find(r => r.id === id);
    if (!recette) return;

    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const macros = this._calculerMacrosRecette(recette);
    const obj    = this.getObjectifs();

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <div style="text-align:center;padding:16px 0;margin-bottom:14px">
          <div style="font-size:3rem;margin-bottom:6px">
            ${recette.emoji}</div>
          <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">
            ${recette.nom}</div>
          <div style="font-size:.72rem;color:var(--text-muted)">
            ⏱ ${recette.temps} min
            · ${recette.ingredients.length} ingrédients
          </div>
        </div>

        <div style="padding:10px 14px;
                    background:rgba(191,161,255,0.06);
                    border:1px solid rgba(191,161,255,0.15);
                    border-radius:var(--radius-md);
                    font-size:.82rem;color:var(--text-secondary);
                    line-height:1.5;margin-bottom:14px">
          💡 ${recette.description}
        </div>

        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:10px">
            📊 Valeurs nutritionnelles
          </div>
          <div style="text-align:center;margin-bottom:12px">
            <div style="font-size:2rem;font-weight:800;
                        color:var(--fd-lemon)">${macros.cal}</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              kcal · ${Math.round(
                (macros.cal / Math.max(obj.calories,1)) * 100
              )}% de ton objectif
            </div>
          </div>
          ${[
            { label:'Protéines', val:macros.prot,
              obj:obj.proteines, color:'var(--fd-coral)',    emoji:'💪' },
            { label:'Glucides',  val:macros.gluc,
              obj:obj.glucides,  color:'var(--fd-indigo)',   emoji:'⚡' },
            { label:'Lipides',   val:macros.lip,
              obj:obj.lipides,   color:'var(--fd-lavender)', emoji:'🥑' }
          ].map(m => {
            const pct = Math.min(100, Math.round(
              (m.val / Math.max(m.obj,1)) * 100
            ));
            return `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;
                            margin-bottom:4px">
                  <span style="font-size:.72rem;font-weight:700;
                               color:${m.color}">
                    ${m.emoji} ${m.label}</span>
                  <span style="font-size:.72rem;
                               color:var(--text-muted)">
                    ${m.val}g / ${m.obj}g</span>
                </div>
                <div style="height:5px;
                            background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${m.color};
                              border-radius:99px;
                              transition:width .8s ease">
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>

        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:10px">
            🛒 Ingrédients
          </div>
          ${recette.ingredients.map(ing => {
            const ali = ALIMENTS_DB[ing.ref];
            if (!ali) return '';
            const ratio = ing.qte / ali.portion;
            return `
              <div style="display:flex;align-items:center;gap:10px;
                          padding:8px 0;
                          border-bottom:1px solid var(--border-color)">
                <span style="font-size:1.1rem;flex-shrink:0">
                  ${ali.emoji}</span>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:600">
                    ${ali.nom}</div>
                  <div style="font-size:.6rem;color:var(--text-muted)">
                    P:${Math.round(ali.prot*ratio)}g
                    · G:${Math.round(ali.gluc*ratio)}g
                    · L:${Math.round(ali.lip*ratio)}g
                  </div>
                </div>
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-indigo);flex-shrink:0">
                  ${ing.qte}${ali.unite}
                </div>
              </div>`;
          }).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button onclick="Nutrition._loggerRecette('${recette.id}')"
                  class="btn-primary" style="font-size:.82rem">
            📔 Logger
          </button>
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            Fermer
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  _loggerRecette(id) {
    const recette = RECETTES_DB.find(r => r.id === id);
    if (!recette) return;

    const macros = this._calculerMacrosRecette(recette);
    const moment = recette.moment || 'dejeuner';

    const entree = {
      id:    Date.now().toString(),
      ref:   recette.id,
      nom:   recette.nom,
      emoji: recette.emoji,
      unite: 'portion',
      qte:   1,
      moment,
      cal:   macros.cal,
      prot:  macros.prot,
      gluc:  macros.gluc,
      lip:   macros.lip,
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    };

    this._ajouterEntreeJournal(entree);
    try { Gamification.ajouterXP(10, 'recette_log'); } catch(e) {}

    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(
      `✅ ${recette.nom} ajouté au journal !`,
      'success', 2000
    );
    Utils.vibrerSuccess();
    this._changerOnglet('journal');
  },

  _calculerMacrosRecette(recette) {
    return recette.ingredients.reduce((totaux, ing) => {
      const ali = ALIMENTS_DB[ing.ref];
      if (!ali) return totaux;
      const ratio = ing.qte / ali.portion;
      return {
        cal:  Math.round(totaux.cal  + ali.cal  * ratio),
        prot: Math.round(totaux.prot + ali.prot * ratio),
        gluc: Math.round(totaux.gluc + ali.gluc * ratio),
        lip:  Math.round(totaux.lip  + ali.lip  * ratio)
      };
    }, { cal:0, prot:0, gluc:0, lip:0 });
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS — ✅ v3.0 genre-aware
  // ════════════════════════════════════════════════════════
  _rendreObjectifs(container) {
    const obj    = this.getObjectifs();
    const profil = this._getProfilOnboarding();
    const profilTracker = (() => {
      try { return Tracker.getProfil(); }
      catch(e) { return { poids:80, objectif:'forme' }; }
    })();

    const auto = this._calculerObjectifsAuto({
      ...profilTracker,
      genre:   profil.genre   || 'homme',
      objectif: profil.objectif || profilTracker.objectif || 'forme'
    });

    const genreLabel = profil.genre === 'femme' ? '🌸 Femme' : '💪 Homme';

    container.innerHTML = `
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border-color:rgba(75,75,249,0.3)">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:4px">
          🎯 Tes objectifs nutritionnels
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-bottom:12px">
          ${genreLabel} · ${profil.objectif || 'forme'}
        </div>
        ${[
          { label:'Calories',  val:obj.calories,
            auto:auto.calories,  color:'var(--fd-lemon)',
            emoji:'🔥', unite:'kcal' },
          { label:'Protéines', val:obj.proteines,
            auto:auto.proteines, color:'var(--fd-coral)',
            emoji:'💪', unite:'g'   },
          { label:'Glucides',  val:obj.glucides,
            auto:auto.glucides,  color:'var(--fd-indigo)',
            emoji:'⚡', unite:'g'   },
          { label:'Lipides',   val:obj.lipides,
            auto:auto.lipides,   color:'var(--fd-lavender)',
            emoji:'🥑', unite:'g'   },
          { label:'Eau',       val:obj.eau,
            auto:auto.eau,       color:'var(--fd-indigo)',
            emoji:'💧', unite:'L'   }
        ].map(m => {
          const pct = Math.min(100, Math.round(
            (m.val/Math.max(m.auto,1))*100
          ));
          return `
            <div style="margin-bottom:12px">
              <div style="display:flex;align-items:center;
                          justify-content:space-between;
                          margin-bottom:5px">
                <span style="font-size:.78rem;font-weight:700;
                             color:${m.color}">
                  ${m.emoji} ${m.label}
                </span>
                <div style="text-align:right">
                  <span style="font-size:.82rem;font-weight:800">
                    ${m.val}${m.unite}
                  </span>
                  <span style="font-size:.6rem;color:var(--text-muted);
                               margin-left:4px">
                    (auto: ${m.auto}${m.unite})
                  </span>
                </div>
              </div>
              <div style="height:6px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${pct}%;
                            background:${m.color};
                            border-radius:99px;
                            transition:width .8s">
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <div class="card mb-md">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          ✏️ Personnaliser
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { id:'calories',  label:'🔥 Calories (kcal)', val:obj.calories  },
            { id:'proteines', label:'💪 Protéines (g)',    val:obj.proteines },
            { id:'glucides',  label:'⚡ Glucides (g)',     val:obj.glucides  },
            { id:'lipides',   label:'🥑 Lipides (g)',      val:obj.lipides   },
            { id:'eau',       label:'💧 Eau (L)',          val:obj.eau       }
          ].map(f => `
            <div style="display:flex;align-items:center;gap:10px">
              <label style="font-size:.75rem;font-weight:600;
                            color:var(--text-muted);
                            min-width:140px;flex-shrink:0">
                ${f.label}
              </label>
              <input id="obj-${f.id}" type="number"
                     class="input" style="flex:1"
                     value="${f.val}" min="0"/>
            </div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-top:14px">
          <button onclick="Nutrition._resetObjectifs()"
                  class="btn-secondary" style="font-size:.78rem">
            🔄 Auto
          </button>
          <button onclick="Nutrition._sauvegarderObjectifs()"
                  class="btn-primary" style="font-size:.78rem">
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <div style="padding:12px 14px;
                  background:rgba(191,161,255,0.06);
                  border:1px solid rgba(191,161,255,0.15);
                  border-radius:var(--radius-md);
                  font-size:.72rem;color:rgba(191,161,255,0.8);
                  line-height:1.6">
        🧮 Calcul auto basé sur :
        <strong>${profilTracker.poids || 80}kg</strong>
        · ${genreLabel}
        · objectif <strong>${profil.objectif || 'forme'}</strong>
        · TDEE estimé <strong>${auto.tdee} kcal</strong>
      </div>
    `;
  },

  // ✅ v3.0 — _calculerObjectifsAuto genre-aware
  _calculerObjectifsAuto(profil) {
    const poids    = profil.poids    || 80;
    const taille   = profil.taille   || 175;
    const objectif = profil.objectif || 'forme';
    const genre    = profil.genre    || 'homme';

    // ✅ Harris-Benedict selon genre
    let bmr;
    if (genre === 'femme') {
      bmr = (10 * poids) + (6.25 * taille) - (5 * 25) - 161;
    } else {
      bmr = (10 * poids) + (6.25 * taille) - (5 * 25) + 5;
    }

    const tdee = Math.round(bmr * 1.55);

    const surplus = {
      prise_masse: genre === 'femme' ? +300 : +400,
      seche:       genre === 'femme' ? -400 : -500,
      force:       genre === 'femme' ? +150 : +200,
      endurance:   -100,
      perte_poids: genre === 'femme' ? -350 : -400,
      forme:        0
    }[objectif] || 0;

    const calories = tdee + surplus;

    // ✅ Protéines ajustées genre
    const facteurProt = genre === 'femme' ? 1.8 : 2.0;

    return {
      tdee,
      calories:  Math.round(calories),
      proteines: Math.round(poids * facteurProt),
      glucides:  Math.round((calories * (genre === 'femme' ? 0.40 : 0.45)) / 4),
      lipides:   Math.round((calories * (genre === 'femme' ? 0.30 : 0.25)) / 9),
      eau:       parseFloat((poids * 0.035).toFixed(1))
    };
  },

  _sauvegarderObjectifs() {
    const obj = {
      calories:  parseInt(
        document.getElementById('obj-calories')?.value)  || 2000,
      proteines: parseInt(
        document.getElementById('obj-proteines')?.value) || 160,
      glucides:  parseInt(
        document.getElementById('obj-glucides')?.value)  || 225,
      lipides:   parseInt(
        document.getElementById('obj-lipides')?.value)   || 56,
      eau:       parseFloat(
        document.getElementById('obj-eau')?.value)       || 2.5
    };
    Utils.storage.set(this.CLE_OBJECTIFS, obj);
    Utils.toast('✅ Objectifs sauvegardés !', 'success');
    Utils.vibrerSuccess();
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  _resetObjectifs() {
    let profil = { poids:80, objectif:'forme' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const profilOb = this._getProfilOnboarding();
    const auto = this._calculerObjectifsAuto({
      ...profil,
      genre:    profilOb.genre    || 'homme',
      objectif: profilOb.objectif || profil.objectif || 'forme'
    });

    Utils.storage.set(this.CLE_OBJECTIFS, {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    });
    Utils.toast('🔄 Objectifs réinitialisés !', 'success');
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  // ════════════════════════════════════════════════════════
  // STATS — ✅ v3.0 score nutrition + genre
  // ════════════════════════════════════════════════════════
  _rendreStats(container) {
    const hist   = this._getHistoriqueNutrition(7);
    const obj    = this.getObjectifs();
    const totaux = this.getTotauxJournal();
    const eau    = this.getEau();
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre || 'homme';

    // ✅ Score nutrition moyen semaine
    const scoreMoyen = hist.length > 0
      ? Math.round(
          hist.reduce((a, h) => {
            const s = this._calculerScoreNutrition(h, obj, h.eau);
            return a + s.score;
          }, 0) / hist.length
        )
      : 0;

    container.innerHTML = `

      <!-- Score nutrition semaine -->
      ${scoreMoyen > 0 ? `
        <div style="background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem;font-weight:900;
                      color:${scoreMoyen >= 80
                        ? 'var(--fd-mint)'
                        : scoreMoyen >= 60
                          ? 'var(--fd-lemon)' : 'var(--fd-coral)'}">
            ${scoreMoyen}
          </div>
          <div>
            <div style="font-size:.75rem;font-weight:700;
                        color:var(--fd-indigo)">
              Score nutrition moyen — 7 jours</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${genre === 'femme' ? '🌸 Programme féminin' : '💪 Programme masculin'}
              · Objectif ${profil.objectif || 'forme'}
            </div>
          </div>
        </div>` : ''}

      <!-- Résumé semaine -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { label:'Moy. calories',
            val:`${Math.round(hist.reduce((a,h) => a+h.cal,0)
              / Math.max(hist.length,1))} kcal`,
            color:'var(--fd-lemon)', emoji:'🔥' },
          { label:'Moy. protéines',
            val:`${Math.round(hist.reduce((a,h) => a+h.prot,0)
              / Math.max(hist.length,1))}g`,
            color:'var(--fd-coral)', emoji:'💪' },
          { label:'Moy. glucides',
            val:`${Math.round(hist.reduce((a,h) => a+h.gluc,0)
              / Math.max(hist.length,1))}g`,
            color:'var(--fd-indigo)', emoji:'⚡' },
          { label:'Moy. lipides',
            val:`${Math.round(hist.reduce((a,h) => a+h.lip,0)
              / Math.max(hist.length,1))}g`,
            color:'var(--fd-lavender)', emoji:'🥑' }
        ].map(s => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:12px;text-align:center">
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-bottom:4px">${s.emoji} ${s.label}</div>
            <div style="font-size:.95rem;font-weight:800;
                        color:${s.color}">${s.val}</div>
          </div>`).join('')}
      </div>

      <!-- Graphiques -->
      ${hist.length > 1 ? `
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px;
                      display:flex;align-items:center;
                      justify-content:space-between">
            <span>🔥 Calories — 7 jours</span>
            <span style="color:var(--fd-lemon)">
              Obj: ${obj.calories} kcal</span>
          </div>
          <canvas id="chart-nutri-cal" height="150"></canvas>
        </div>

        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px;
                      display:flex;align-items:center;
                      justify-content:space-between">
            <span>💪 Protéines — 7 jours</span>
            <span style="color:var(--fd-coral)">
              Obj: ${obj.proteines}g</span>
          </div>
          <canvas id="chart-nutri-prot" height="130"></canvas>
        </div>

        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px;
                      display:flex;align-items:center;
                      justify-content:space-between">
            <span>💧 Hydratation — 7 jours</span>
            <span style="color:var(--fd-indigo)">
              Obj: ${obj.eau}L/j</span>
          </div>
          <canvas id="chart-nutri-eau" height="130"></canvas>
        </div>` : `
        <div style="text-align:center;padding:32px 16px;
                    color:var(--text-muted)">
          <div style="font-size:2rem;margin-bottom:8px">📊</div>
          <div style="font-size:.88rem">
            Pas encore assez de données<br>
            <span style="font-size:.72rem">
              Continue à logger tes repas !</span>
          </div>
        </div>`}

      <!-- Tableau récap -->
      ${hist.length > 0 ? `
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px;
                    overflow-x:auto">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px">
            📅 Récap semaine</div>
          <table style="width:100%;border-collapse:collapse;
                        font-size:.72rem;min-width:320px">
            <thead>
              <tr style="color:var(--text-muted)">
                <th style="text-align:left;padding:4px 8px;
                           font-weight:600">Jour</th>
                <th style="text-align:right;padding:4px 8px;
                           color:var(--fd-lemon);font-weight:600">
                  Cal</th>
                <th style="text-align:right;padding:4px 8px;
                           color:var(--fd-coral);font-weight:600">
                  Prot</th>
                <th style="text-align:right;padding:4px 8px;
                           color:var(--fd-indigo);font-weight:600">
                  Gluc</th>
                <th style="text-align:right;padding:4px 8px;
                           color:var(--fd-lavender);font-weight:600">
                  Lip</th>
                <th style="text-align:right;padding:4px 8px;
                           color:var(--fd-indigo);font-weight:600">
                  💧</th>
              </tr>
            </thead>
            <tbody>
              ${hist.map(h => `
                <tr style="border-top:1px solid var(--border-color)">
                  <td style="padding:6px 8px;font-weight:600">
                    ${h.label}</td>
                  <td style="text-align:right;padding:6px 8px;
                             color:${h.cal >= obj.calories * 0.9
                               ? 'var(--fd-mint)' : 'var(--text-muted)'}">
                    ${Math.round(h.cal)}</td>
                  <td style="text-align:right;padding:6px 8px;
                             color:${h.prot >= obj.proteines * 0.9
                               ? 'var(--fd-mint)' : 'var(--text-muted)'}">
                    ${Math.round(h.prot)}g</td>
                  <td style="text-align:right;padding:6px 8px;
                             color:var(--text-muted)">
                    ${Math.round(h.gluc)}g</td>
                  <td style="text-align:right;padding:6px 8px;
                             color:var(--text-muted)">
                    ${Math.round(h.lip)}g</td>
                  <td style="text-align:right;padding:6px 8px;
                             color:var(--fd-indigo)">
                    ${(h.eau/1000).toFixed(1)}L</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}
    `;

    requestAnimationFrame(() => {
      const opts = {
        responsive:  true,
        plugins:     { legend:{ display:false } },
        scales: {
          x: {
            ticks: { color:'rgba(255,255,255,0.4)', font:{ size:10 } },
            grid:  { color:'rgba(255,255,255,0.04)' }
          },
          y: {
            ticks: { color:'rgba(255,255,255,0.4)', font:{ size:10 } },
            grid:  { color:'rgba(255,255,255,0.04)' }
          }
        }
      };

      const cc = document.getElementById('chart-nutri-cal');
      if (cc && typeof Chart !== 'undefined' && hist.length > 1) {
        try {
          if (this._chartInstances.cal) {
            this._chartInstances.cal.destroy();
          }
          this._chartInstances.cal = new Chart(cc, {
            type: 'bar',
            data: {
              labels:   hist.map(h => h.label),
              datasets: [{
                data:            hist.map(h => h.cal),
                backgroundColor: hist.map(h =>
                  h.cal >= obj.calories * 0.9
                    ? 'rgba(139,240,187,0.7)'
                    : 'rgba(75,75,249,0.6)'
                ),
                borderColor:  '#4b4bf9',
                borderWidth:  1,
                borderRadius: 6
              }]
            },
            options: {
              ...opts,
              scales: {
                ...opts.scales,
                y: {
                  ...opts.scales.y,
                  suggestedMax: Math.max(
                    obj.calories * 1.2,
                    ...hist.map(h => h.cal)
                  )
                }
              }
            }
          });
        } catch(e) {}
      }

      const cp = document.getElementById('chart-nutri-prot');
      if (cp && typeof Chart !== 'undefined' && hist.length > 1) {
        try {
          if (this._chartInstances.prot) {
            this._chartInstances.prot.destroy();
          }
          this._chartInstances.prot = new Chart(cp, {
            type: 'line',
            data: {
              labels:   hist.map(h => h.label),
              datasets: [{
                data:                hist.map(h => h.prot),
                borderColor:         '#ff8d96',
                backgroundColor:     'rgba(255,141,150,0.1)',
                borderWidth:         2,
                pointRadius:         5,
                pointBackgroundColor:'#ff8d96',
                tension:             0.4,
                fill:                true
              }]
            },
            options: opts
          });
        } catch(e) {}
      }

      const ce = document.getElementById('chart-nutri-eau');
      if (ce && typeof Chart !== 'undefined' && hist.length > 1) {
        try {
          if (this._chartInstances.eau) {
            this._chartInstances.eau.destroy();
          }
          this._chartInstances.eau = new Chart(ce, {
            type: 'bar',
            data: {
              labels:   hist.map(h => h.label),
              datasets: [{
                data:            hist.map(h =>
                  Math.round(h.eau / 100) / 10
                ),
                backgroundColor: hist.map(h =>
                  h.eau >= obj.eau * 900
                    ? 'rgba(75,75,249,0.7)'
                    : 'rgba(75,75,249,0.3)'
                ),
                borderColor:  '#4b4bf9',
                borderWidth:  1,
                borderRadius: 6
              }]
            },
            options: {
              ...opts,
              scales: {
                ...opts.scales,
                y: {
                  ...opts.scales.y,
                  suggestedMax: obj.eau * 1.5,
                  ticks: {
                    ...opts.scales.y.ticks,
                    callback: v => `${v}L`
                  }
                }
              }
            }
          });
        } catch(e) {}
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // DONNÉES
  // ════════════════════════════════════════════════════════
  _getJournal(date = null) {
    const d   = date || Utils.aujourd_hui();
    const cle = `${this.CLE_JOURNAL}_${d}`;
    return Utils.storage.get(cle, []);
  },

  _ajouterEntreeJournal(entree) {
    const cle     = `${this.CLE_JOURNAL}_${Utils.aujourd_hui()}`;
    const journal = this._getJournal();
    journal.push(entree);
    Utils.storage.set(cle, journal);
  },

  _supprimerEntree(id) {
    const cle     = `${this.CLE_JOURNAL}_${Utils.aujourd_hui()}`;
    const journal = this._getJournal().filter(e => e.id !== id);
    Utils.storage.set(cle, journal);
    Utils.toast('🗑️ Entrée supprimée', 'info', 1200);
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreJournal(c);
  },

  getEau(date = null) {
    const d   = date || Utils.aujourd_hui();
    const cle = `${this.CLE_EAU}_${d}`;
    return Utils.storage.get(cle, 0);
  },

  _ajouterEau(ml) {
    const cle    = `${this.CLE_EAU}_${Utils.aujourd_hui()}`;
    const actuel = this.getEau();
    const obj    = this.getObjectifs();
    const max    = obj.eau * 1000 * 1.5;
    const nouveau = Math.min(actuel + ml, max);

    Utils.storage.set(cle, nouveau);
    Utils.toast(
      `💧 +${ml}ml · Total ${(nouveau/1000).toFixed(2)}L`,
      'success', 1500
    );
    Utils.vibrerSuccess();

    if (nouveau >= obj.eau * 1000 && actuel < obj.eau * 1000) {
      setTimeout(() => {
        Utils.toast(
          '🎉 Objectif hydratation atteint !', 'success', 3000
        );
        try { Gamification.ajouterXP(20, 'hydratation'); }
        catch(e) {}
      }, 500);
    }

    if (this._ongletActif === 'dashboard') {
      const p = document.getElementById('page-nutrition');
      if (p) this.render(p);
    }
  },

  _ajouterEauRapide(ml) { this._ajouterEau(ml); },

  getObjectifs() {
    // ✅ v3.0 — Utilise profil onboarding pour le calcul auto
    let profilTracker = { poids:80, objectif:'forme' };
    try { profilTracker = Tracker.getProfil(); } catch(e) {}

    const profilOb = this._getProfilOnboarding();
    const auto = this._calculerObjectifsAuto({
      ...profilTracker,
      genre:    profilOb.genre    || 'homme',
      objectif: profilOb.objectif || profilTracker.objectif || 'forme'
    });

    return Utils.storage.get(this.CLE_OBJECTIFS, {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    });
  },

  getTotauxJournal(date = null) {
    return this._getJournal(date).reduce(
      (totaux, e) => ({
        cal:  totaux.cal  + (e.cal  || 0),
        prot: totaux.prot + (e.prot || 0),
        gluc: totaux.gluc + (e.gluc || 0),
        lip:  totaux.lip  + (e.lip  || 0)
      }),
      { cal:0, prot:0, gluc:0, lip:0 }
    );
  },

  _getHistoriqueNutrition(jours = 7) {
    const hist = [];
    for (let i = 0; i < jours; i++) {
      const date   = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const totaux = this.getTotauxJournal(date);
      const eau    = this.getEau(date);
      hist.push({
        date,
        label: Utils.formatDateCourt
          ? Utils.formatDateCourt(date)
          : date.slice(5),
        cal:  totaux.cal,
        prot: totaux.prot,
        gluc: totaux.gluc,
        lip:  totaux.lip,
        eau
      });
    }
    return hist.reverse();
  }
};

// ════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE
// ════════════════════════════════════════════════════════════
window.Nutrition   = Nutrition;
window.ALIMENTS_DB = ALIMENTS_DB;
window.RECETTES_DB = RECETTES_DB;

console.log(
  `✅ Nutrition v3.0 chargé — ` +
  `${Object.keys(ALIMENTS_DB).length} aliments, ` +
  `${RECETTES_DB.length} recettes ` +
  `(homme + femme + objectifs adaptatifs) ✅`
);
