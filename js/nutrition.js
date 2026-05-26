/* ============================================================
   PowerApp — Nutrition.js v5.0 COMPLET
   ✅ 60+ aliments · 30+ recettes
   ✅ Adapté genre (homme/femme)
   ✅ Adapté objectif (masse/sèche/force/endurance/forme)
   ✅ Adapté séance du jour (pré/post)
   ✅ Score nutrition · Streak · Stats · Charts
   ============================================================ */

'use strict';

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES ALIMENTS — 60 aliments
// ════════════════════════════════════════════════════════════
const ALIMENTS_DB = {

  // ── PROTÉINES ANIMALES ──────────────────────────────────
  poulet_grillee: {
    nom:'Poulet grillé', emoji:'🍗', categorie:'proteines',
    cal:165, prot:31, gluc:0,   lip:3.6, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  boeuf_hache: {
    nom:'Bœuf haché 5%', emoji:'🥩', categorie:'proteines',
    cal:137, prot:21, gluc:0,   lip:5,   portion:100, unite:'g',
    genre:['homme'], objectifs:['prise_masse','force']
  },
  boeuf_maigre: {
    nom:'Bœuf maigre', emoji:'🥩', categorie:'proteines',
    cal:150, prot:26, gluc:0,   lip:4.5, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['force','seche']
  },
  thon_boite: {
    nom:'Thon en boîte', emoji:'🐟', categorie:'proteines',
    cal:116, prot:26, gluc:0,   lip:1,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['seche','perte_poids','forme']
  },
  saumon: {
    nom:'Saumon', emoji:'🐠', categorie:'proteines',
    cal:208, prot:20, gluc:0,   lip:13,  portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  cabillaud: {
    nom:'Cabillaud', emoji:'🐟', categorie:'proteines',
    cal:82,  prot:18, gluc:0,   lip:0.7, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','perte_poids']
  },
  crevettes: {
    nom:'Crevettes', emoji:'🦐', categorie:'proteines',
    cal:99,  prot:24, gluc:0.2, lip:0.3, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','forme']
  },
  dinde: {
    nom:'Escalope dinde', emoji:'🦃', categorie:'proteines',
    cal:135, prot:30, gluc:0,   lip:1,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  jambon: {
    nom:'Jambon blanc', emoji:'🥩', categorie:'proteines',
    cal:107, prot:18, gluc:1,   lip:3,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['forme']
  },
  oeuf_entier: {
    nom:'Œuf entier', emoji:'🥚', categorie:'proteines',
    cal:155, prot:13, gluc:1,   lip:11,  portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  blanc_oeuf: {
    nom:'Blanc d\'œuf', emoji:'🥚', categorie:'proteines',
    cal:52,  prot:11, gluc:1,   lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['seche','perte_poids']
  },
  sardines: {
    nom:'Sardines en boîte', emoji:'🐟', categorie:'proteines',
    cal:185, prot:25, gluc:0,   lip:10,  portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['prise_masse','force']
  },

  // ── LAITIERS ────────────────────────────────────────────
  whey: {
    nom:'Whey Protéine', emoji:'💪', categorie:'supplements',
    cal:120, prot:24, gluc:3,   lip:2,   portion:30,  unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  caseine: {
    nom:'Caséine', emoji:'🌙', categorie:'supplements',
    cal:115, prot:24, gluc:2,   lip:1.5, portion:30,  unite:'g',
    genre:['homme','femme'], objectifs:['prise_masse','force']
  },
  yaourt_grec: {
    nom:'Yaourt grec 0%', emoji:'🥛', categorie:'laitiers',
    cal:59,  prot:10, gluc:4,   lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  fromage_blanc: {
    nom:'Fromage blanc 0%', emoji:'🥛', categorie:'laitiers',
    cal:45,  prot:8,  gluc:4,   lip:0.2, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','perte_poids','forme']
  },
  cottage_cheese: {
    nom:'Cottage Cheese', emoji:'🧀', categorie:'laitiers',
    cal:98,  prot:11, gluc:3,   lip:4,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  skyr: {
    nom:'Skyr nature', emoji:'🥛', categorie:'laitiers',
    cal:63,  prot:11, gluc:4,   lip:0.2, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','forme']
  },

  // ── VÉGÉTAUX ────────────────────────────────────────────
  tofu: {
    nom:'Tofu ferme', emoji:'🫘', categorie:'proteines',
    cal:76,  prot:8,  gluc:1.9, lip:4.2, portion:100, unite:'g',
    genre:['femme'], objectifs:['forme','perte_poids']
  },
  lentilles: {
    nom:'Lentilles cuites', emoji:'🫘', categorie:'glucides',
    cal:116, prot:9,  gluc:20,  lip:0.4, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['endurance','forme']
  },
  pois_chiches: {
    nom:'Pois chiches cuits', emoji:'🫘', categorie:'glucides',
    cal:164, prot:8.9,gluc:27,  lip:2.6, portion:100, unite:'g',
    genre:['femme'], objectifs:['forme','endurance']
  },
  edamame: {
    nom:'Edamame', emoji:'🌿', categorie:'proteines',
    cal:122, prot:11, gluc:10,  lip:5,   portion:100, unite:'g',
    genre:['femme'], objectifs:['forme']
  },

  // ── GLUCIDES / FÉCULENTS ────────────────────────────────
  riz_blanc: {
    nom:'Riz blanc cuit', emoji:'🍚', categorie:'glucides',
    cal:130, prot:2.7, gluc:28, lip:0.3, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  riz_complet: {
    nom:'Riz complet cuit', emoji:'🍚', categorie:'glucides',
    cal:112, prot:2.6, gluc:24, lip:0.9, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['forme','endurance']
  },
  pates: {
    nom:'Pâtes cuites', emoji:'🍝', categorie:'glucides',
    cal:158, prot:6,  gluc:31,  lip:1,   portion:100, unite:'g',
    genre:['homme'], objectifs:['prise_masse','endurance']
  },
  pates_completes: {
    nom:'Pâtes complètes cuites', emoji:'🍝', categorie:'glucides',
    cal:148, prot:5.5,gluc:28,  lip:0.9, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['endurance','forme']
  },
  pomme_terre: {
    nom:'Pomme de terre', emoji:'🥔', categorie:'glucides',
    cal:86,  prot:1.9, gluc:20, lip:0.1, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['prise_masse','endurance']
  },
  patate_douce: {
    nom:'Patate douce', emoji:'🍠', categorie:'glucides',
    cal:86,  prot:1.6, gluc:20, lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  avoine: {
    nom:'Flocons d\'avoine', emoji:'🌾', categorie:'glucides',
    cal:389, prot:17, gluc:66,  lip:7,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  pain_complet: {
    nom:'Pain complet', emoji:'🍞', categorie:'glucides',
    cal:247, prot:9,  gluc:48,  lip:3,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['forme','endurance']
  },
  quinoa: {
    nom:'Quinoa cuit', emoji:'🌾', categorie:'glucides',
    cal:120, prot:4.4,gluc:22,  lip:1.9, portion:100, unite:'g',
    genre:['femme'], objectifs:['forme','seche']
  },
  banane: {
    nom:'Banane', emoji:'🍌', categorie:'fruits',
    cal:89,  prot:1,  gluc:23,  lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  riz_basmati: {
    nom:'Riz basmati cuit', emoji:'🍚', categorie:'glucides',
    cal:121, prot:2.5,gluc:25,  lip:0.4, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['forme','seche']
  },

  // ── LÉGUMES ─────────────────────────────────────────────
  brocoli: {
    nom:'Brocoli', emoji:'🥦', categorie:'legumes',
    cal:34,  prot:3,  gluc:7,   lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  epinards: {
    nom:'Épinards', emoji:'🌿', categorie:'legumes',
    cal:23,  prot:3,  gluc:4,   lip:0,   portion:100, unite:'g',
    genre:['femme'], objectifs:['tous']
  },
  tomate: {
    nom:'Tomate', emoji:'🍅', categorie:'legumes',
    cal:18,  prot:1,  gluc:4,   lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  concombre: {
    nom:'Concombre', emoji:'🥒', categorie:'legumes',
    cal:15,  prot:1,  gluc:4,   lip:0,   portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','perte_poids']
  },
  courgette: {
    nom:'Courgette', emoji:'🥬', categorie:'legumes',
    cal:17,  prot:1,  gluc:3,   lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  salade: {
    nom:'Salade verte', emoji:'🥗', categorie:'legumes',
    cal:15,  prot:1.4,gluc:2.9, lip:0.2, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  poivron: {
    nom:'Poivron', emoji:'🫑', categorie:'legumes',
    cal:31,  prot:1,  gluc:6,   lip:0.3, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','forme']
  },
  champignons: {
    nom:'Champignons', emoji:'🍄', categorie:'legumes',
    cal:22,  prot:3.1,gluc:3.3, lip:0.3, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['seche','perte_poids']
  },
  asperges: {
    nom:'Asperges', emoji:'🌿', categorie:'legumes',
    cal:20,  prot:2.2,gluc:3.9, lip:0.1, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','perte_poids']
  },

  // ── LIPIDES SAINES ──────────────────────────────────────
  avocat: {
    nom:'Avocat', emoji:'🥑', categorie:'lipides',
    cal:160, prot:2,  gluc:9,   lip:15,  portion:100, unite:'g',
    genre:['femme'], objectifs:['forme','seche']
  },
  huile_olive: {
    nom:'Huile d\'olive', emoji:'🫒', categorie:'lipides',
    cal:884, prot:0,  gluc:0,   lip:100, portion:10,  unite:'ml',
    genre:['homme','femme'], objectifs:['tous']
  },
  amandes: {
    nom:'Amandes', emoji:'🌰', categorie:'lipides',
    cal:579, prot:21, gluc:22,  lip:50,  portion:30,  unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  beurre_cacahuete: {
    nom:'Beurre cacahuète', emoji:'🥜', categorie:'lipides',
    cal:588, prot:25, gluc:20,  lip:50,  portion:30,  unite:'g',
    genre:['homme'], objectifs:['prise_masse','force']
  },
  noix: {
    nom:'Noix', emoji:'🫘', categorie:'lipides',
    cal:654, prot:15, gluc:14,  lip:65,  portion:30,  unite:'g',
    genre:['homme','femme'], objectifs:['forme','endurance']
  },
  graines_chia: {
    nom:'Graines de chia', emoji:'🌱', categorie:'lipides',
    cal:486, prot:17, gluc:42,  lip:31,  portion:30,  unite:'g',
    genre:['femme'], objectifs:['forme','endurance']
  },
  graines_lin: {
    nom:'Graines de lin', emoji:'🌱', categorie:'lipides',
    cal:534, prot:18, gluc:29,  lip:42,  portion:20,  unite:'g',
    genre:['femme'], objectifs:['forme']
  },

  // ── FRUITS ──────────────────────────────────────────────
  pomme: {
    nom:'Pomme', emoji:'🍎', categorie:'fruits',
    cal:52,  prot:0,  gluc:14,  lip:0,   portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  orange: {
    nom:'Orange', emoji:'🍊', categorie:'fruits',
    cal:47,  prot:0.9,gluc:12,  lip:0.1, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  fraises: {
    nom:'Fraises', emoji:'🍓', categorie:'fruits',
    cal:32,  prot:0.7,gluc:7.7, lip:0.3, portion:100, unite:'g',
    genre:['femme'], objectifs:['seche','forme']
  },
  myrtilles: {
    nom:'Myrtilles', emoji:'🫐', categorie:'fruits',
    cal:57,  prot:0.7,gluc:14,  lip:0.3, portion:100, unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  mangue: {
    nom:'Mangue', emoji:'🥭', categorie:'fruits',
    cal:60,  prot:0.8,gluc:15,  lip:0.4, portion:100, unite:'g',
    genre:['femme'], objectifs:['forme','endurance']
  },
  kiwi: {
    nom:'Kiwi', emoji:'🥝', categorie:'fruits',
    cal:61,  prot:1.1,gluc:15,  lip:0.5, portion:100, unite:'g',
    genre:['femme'], objectifs:['forme']
  },

  // ── SUPPLÉMENTS ─────────────────────────────────────────
  barre_proteinee: {
    nom:'Barre protéinée', emoji:'🍫', categorie:'supplements',
    cal:200, prot:20, gluc:20,  lip:6,   portion:60,  unite:'g',
    genre:['homme','femme'], objectifs:['tous']
  },
  boisson_sport: {
    nom:'Boisson isotonique', emoji:'🧃', categorie:'supplements',
    cal:25,  prot:0,  gluc:6,   lip:0,   portion:500, unite:'ml',
    genre:['homme','femme'], objectifs:['endurance']
  },
  creapure: {
    nom:'Créatine', emoji:'💊', categorie:'supplements',
    cal:0,   prot:0,  gluc:0,   lip:0,   portion:5,   unite:'g',
    genre:['homme'], objectifs:['force','prise_masse']
  }
};

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES RECETTES — 32 recettes
// Genre-aware + Objectif-aware + Séance-aware
// ════════════════════════════════════════════════════════════
const RECETTES_DB = [

  // ══ POST-SÉANCE HOMME ═══════════════════════════════════
  {
    id:'bowl_post_seance_homme',
    nom:'Bowl récupération homme',
    emoji:'🥣', categorie:'post_seance', moment:'post_seance',
    temps:10, difficulte:1,
    description:'Récupération maximale après séance intense — ratio prot/gluc optimal',
    tags:['post-séance','protéines','masse','rapide'],
    genre:['homme'],
    objectifs:['prise_masse','force','forme'],
    seances:['tous'],
    ingredients:[
      { ref:'whey',          qte:30  },
      { ref:'banane',        qte:120 },
      { ref:'avoine',        qte:60  },
      { ref:'myrtilles',     qte:80  },
      { ref:'beurre_cacahuete', qte:20 }
    ]
  },
  {
    id:'shake_force',
    nom:'Shake force & masse',
    emoji:'💪', categorie:'post_seance', moment:'post_seance',
    temps:5, difficulte:1,
    description:'Maximum de calories et protéines pour la prise de masse',
    tags:['post-séance','masse','calories','rapide'],
    genre:['homme'],
    objectifs:['prise_masse','force'],
    seances:['pec_tri','dos_bi','jambes','full_body'],
    ingredients:[
      { ref:'whey',          qte:60  },
      { ref:'banane',        qte:150 },
      { ref:'avoine',        qte:80  },
      { ref:'beurre_cacahuete', qte:30 },
      { ref:'myrtilles',     qte:50  }
    ]
  },
  {
    id:'shake_seche_homme',
    nom:'Shake sèche protéiné',
    emoji:'🥤', categorie:'post_seance', moment:'post_seance',
    temps:5, difficulte:1,
    description:'Protéines maximales, glucides minimaux pour préserver la masse sèche',
    tags:['post-séance','sèche','faible-glucides'],
    genre:['homme'],
    objectifs:['seche','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'whey',          qte:30  },
      { ref:'fromage_blanc', qte:200 },
      { ref:'fraises',       qte:100 },
      { ref:'myrtilles',     qte:50  }
    ]
  },

  // ══ POST-SÉANCE FEMME ═══════════════════════════════════
  {
    id:'bowl_post_seance_femme',
    nom:'Bowl récup féminin 🌸',
    emoji:'🥣', categorie:'post_seance', moment:'post_seance',
    temps:10, difficulte:1,
    description:'Récupération légère et complète — galbe sans excès',
    tags:['post-séance','protéines','léger','femme'],
    genre:['femme'],
    objectifs:['forme','seche','perte_poids'],
    seances:['jambes','full_body'],
    ingredients:[
      { ref:'yaourt_grec',   qte:200 },
      { ref:'banane',        qte:80  },
      { ref:'myrtilles',     qte:80  },
      { ref:'graines_chia',  qte:15  },
      { ref:'amandes',       qte:15  }
    ]
  },
  {
    id:'smoothie_bowl_fessiers',
    nom:'Smoothie bowl fessiers 🍑',
    emoji:'🍓', categorie:'post_seance', moment:'post_seance',
    temps:8, difficulte:1,
    description:'Spécial après séance jambes/fessiers — collagène naturel',
    tags:['post-séance','fessiers','galbe','femme'],
    genre:['femme'],
    objectifs:['forme','seche'],
    seances:['jambes','lower_body'],
    ingredients:[
      { ref:'skyr',         qte:150 },
      { ref:'fraises',      qte:120 },
      { ref:'myrtilles',    qte:60  },
      { ref:'banane',       qte:60  },
      { ref:'graines_chia', qte:10  }
    ]
  },
  {
    id:'shake_femme_prise',
    nom:'Shake prise de muscle 💪',
    emoji:'🥤', categorie:'post_seance', moment:'post_seance',
    temps:5, difficulte:1,
    description:'Stimuler la prise de muscle féminine sans excès calorique',
    tags:['post-séance','muscle','femme'],
    genre:['femme'],
    objectifs:['prise_masse','force'],
    seances:['tous'],
    ingredients:[
      { ref:'whey',          qte:25  },
      { ref:'yaourt_grec',   qte:150 },
      { ref:'banane',        qte:80  },
      { ref:'myrtilles',     qte:80  }
    ]
  },

  // ══ PRÉ-SÉANCE ══════════════════════════════════════════
  {
    id:'pre_seance_homme',
    nom:'Repas pré-séance homme',
    emoji:'⚡', categorie:'pre_seance', moment:'pre_seance',
    temps:10, difficulte:1,
    description:'Énergie optimale 2h avant l\'entraînement intensif',
    tags:['pré-séance','énergie','homme'],
    genre:['homme'],
    objectifs:['prise_masse','force','endurance'],
    seances:['tous'],
    ingredients:[
      { ref:'riz_blanc',      qte:200 },
      { ref:'poulet_grillee', qte:150 },
      { ref:'banane',         qte:100 }
    ]
  },
  {
    id:'pre_seance_femme',
    nom:'Repas pré-séance femme 🌸',
    emoji:'⚡', categorie:'pre_seance', moment:'pre_seance',
    temps:8, difficulte:1,
    description:'Énergie légère et stable avant la séance',
    tags:['pré-séance','énergie','femme','léger'],
    genre:['femme'],
    objectifs:['tous'],
    seances:['tous'],
    ingredients:[
      { ref:'avoine',       qte:50  },
      { ref:'banane',       qte:80  },
      { ref:'yaourt_grec',  qte:100 },
      { ref:'amandes',      qte:15  }
    ]
  },
  {
    id:'pre_seance_seche',
    nom:'Pré-séance sèche',
    emoji:'🎯', categorie:'pre_seance', moment:'pre_seance',
    temps:5, difficulte:1,
    description:'Énergie minimale pour séance en déficit — préserver le muscle',
    tags:['pré-séance','sèche','faible-cal'],
    genre:['homme','femme'],
    objectifs:['seche','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'banane',       qte:100 },
      { ref:'yaourt_grec',  qte:120 },
      { ref:'amandes',      qte:15  }
    ]
  },

  // ══ PETIT-DÉJEUNER HOMME ════════════════════════════════
  {
    id:'omelette_musculation',
    nom:'Omelette musculation',
    emoji:'🍳', categorie:'petit_dejeuner', moment:'matin',
    temps:15, difficulte:2,
    description:'Petit-déjeuner riche en protéines — boost testostérone naturel',
    tags:['matin','protéines','œufs','homme'],
    genre:['homme'],
    objectifs:['prise_masse','force','forme'],
    seances:['tous'],
    ingredients:[
      { ref:'oeuf_entier',  qte:300 },
      { ref:'blanc_oeuf',   qte:100 },
      { ref:'epinards',     qte:80  },
      { ref:'tomate',       qte:100 },
      { ref:'huile_olive',  qte:10  }
    ]
  },
  {
    id:'pancakes_avoine_homme',
    nom:'Pancakes avoine homme',
    emoji:'🥞', categorie:'petit_dejeuner', moment:'matin',
    temps:20, difficulte:2,
    description:'Petit-déjeuner masse — glucides complexes + protéines',
    tags:['matin','glucides','masse','homme'],
    genre:['homme'],
    objectifs:['prise_masse','endurance'],
    seances:['tous'],
    ingredients:[
      { ref:'avoine',        qte:100 },
      { ref:'oeuf_entier',   qte:200 },
      { ref:'fromage_blanc', qte:150 },
      { ref:'banane',        qte:100 },
      { ref:'myrtilles',     qte:60  }
    ]
  },
  {
    id:'overnight_oats_homme',
    nom:'Overnight oats homme',
    emoji:'🌙', categorie:'petit_dejeuner', moment:'matin',
    temps:5, difficulte:1,
    description:'Préparer la veille — énergie lente tout la matinée',
    tags:['matin','préparation','glucides'],
    genre:['homme'],
    objectifs:['prise_masse','endurance','forme'],
    seances:['tous'],
    ingredients:[
      { ref:'avoine',        qte:100 },
      { ref:'caseine',       qte:30  },
      { ref:'banane',        qte:100 },
      { ref:'myrtilles',     qte:80  },
      { ref:'beurre_cacahuete', qte:20 }
    ]
  },

  // ══ PETIT-DÉJEUNER FEMME ════════════════════════════════
  {
    id:'bowl_acai_femme',
    nom:'Bowl açaï énergie 🌸',
    emoji:'🫐', categorie:'petit_dejeuner', moment:'matin',
    temps:10, difficulte:1,
    description:'Antioxydants + protéines — beauté & performance',
    tags:['matin','antioxydants','femme','légume'],
    genre:['femme'],
    objectifs:['forme','endurance'],
    seances:['tous'],
    ingredients:[
      { ref:'yaourt_grec',  qte:180 },
      { ref:'myrtilles',    qte:120 },
      { ref:'fraises',      qte:80  },
      { ref:'banane',       qte:60  },
      { ref:'graines_chia', qte:15  },
      { ref:'amandes',      qte:15  }
    ]
  },
  {
    id:'porridge_banane_femme',
    nom:'Porridge banane 🌸',
    emoji:'🌾', categorie:'petit_dejeuner', moment:'matin',
    temps:8, difficulte:1,
    description:'Énergie douce et durable — satiété maximale',
    tags:['matin','énergie','femme','satiété'],
    genre:['femme'],
    objectifs:['forme','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'avoine',       qte:60  },
      { ref:'banane',       qte:80  },
      { ref:'yaourt_grec',  qte:120 },
      { ref:'fraises',      qte:80  },
      { ref:'graines_lin',  qte:10  }
    ]
  },
  {
    id:'omelette_legere_femme',
    nom:'Omelette légère 🌸',
    emoji:'🍳', categorie:'petit_dejeuner', moment:'matin',
    temps:12, difficulte:2,
    description:'Protéines légères — forme & galbe sans surplus',
    tags:['matin','légère','femme','protéines'],
    genre:['femme'],
    objectifs:['seche','forme','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'blanc_oeuf',  qte:200 },
      { ref:'oeuf_entier', qte:100 },
      { ref:'epinards',    qte:100 },
      { ref:'tomate',      qte:100 },
      { ref:'poivron',     qte:80  }
    ]
  },

  // ══ DÉJEUNER HOMME ══════════════════════════════════════
  {
    id:'riz_poulet_legumes',
    nom:'Riz poulet légumes',
    emoji:'🍱', categorie:'dejeuner', moment:'dejeuner',
    temps:25, difficulte:2,
    description:'Le classique incontournable — ratio parfait musculation',
    tags:['déjeuner','classique','équilibré','homme'],
    genre:['homme'],
    objectifs:['prise_masse','force','forme'],
    seances:['tous'],
    ingredients:[
      { ref:'riz_blanc',      qte:200 },
      { ref:'poulet_grillee', qte:200 },
      { ref:'brocoli',        qte:150 },
      { ref:'courgette',      qte:100 },
      { ref:'huile_olive',    qte:10  }
    ]
  },
  {
    id:'bowl_patate_douce_homme',
    nom:'Bowl patate douce & poulet',
    emoji:'🍠', categorie:'dejeuner', moment:'dejeuner',
    temps:30, difficulte:2,
    description:'Glucides complexes + protéines — prise de masse propre',
    tags:['déjeuner','masse','glucides','homme'],
    genre:['homme'],
    objectifs:['prise_masse','force'],
    seances:['pec_tri','dos_bi','full_body'],
    ingredients:[
      { ref:'patate_douce',   qte:250 },
      { ref:'poulet_grillee', qte:220 },
      { ref:'epinards',       qte:100 },
      { ref:'huile_olive',    qte:10  }
    ]
  },
  {
    id:'pates_bolo_sport',
    nom:'Pâtes bolognaise sport',
    emoji:'🍝', categorie:'dejeuner', moment:'dejeuner',
    temps:30, difficulte:2,
    description:'Charge glucidique maximale — endurance & masse',
    tags:['déjeuner','glucides','masse','endurance'],
    genre:['homme'],
    objectifs:['prise_masse','endurance'],
    seances:['jambes','full_body'],
    ingredients:[
      { ref:'pates',       qte:250 },
      { ref:'boeuf_hache', qte:150 },
      { ref:'tomate',      qte:200 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'wrap_poulet_homme',
    nom:'Wrap poulet avocat',
    emoji:'🌯', categorie:'dejeuner', moment:'dejeuner',
    temps:10, difficulte:1,
    description:'Repas nomade équilibré — protéines + bons lipides',
    tags:['rapide','déjeuner','nomade'],
    genre:['homme'],
    objectifs:['forme','seche'],
    seances:['tous'],
    ingredients:[
      { ref:'pain_complet',   qte:80  },
      { ref:'poulet_grillee', qte:150 },
      { ref:'avocat',         qte:60  },
      { ref:'salade',         qte:50  },
      { ref:'tomate',         qte:80  }
    ]
  },

  // ══ DÉJEUNER FEMME ══════════════════════════════════════
  {
    id:'salade_thon_quinoa_femme',
    nom:'Salade thon quinoa 🌸',
    emoji:'🥗', categorie:'dejeuner', moment:'dejeuner',
    temps:15, difficulte:1,
    description:'Légère, protéinée et satiante — parfaite pour la sèche féminine',
    tags:['sèche','léger','déjeuner','femme'],
    genre:['femme'],
    objectifs:['seche','perte_poids','forme'],
    seances:['tous'],
    ingredients:[
      { ref:'quinoa',      qte:120 },
      { ref:'thon_boite',  qte:160 },
      { ref:'salade',      qte:100 },
      { ref:'tomate',      qte:150 },
      { ref:'avocat',      qte:60  },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'bowl_fessiers',
    nom:'Bowl galbe fessiers 🍑',
    emoji:'🍠', categorie:'dejeuner', moment:'dejeuner',
    temps:25, difficulte:2,
    description:'Spécial galbe — protéines + glucides pour nourrir les fessiers',
    tags:['déjeuner','fessiers','galbe','femme'],
    genre:['femme'],
    objectifs:['forme','prise_masse'],
    seances:['jambes','lower_body'],
    ingredients:[
      { ref:'patate_douce',   qte:180 },
      { ref:'poulet_grillee', qte:160 },
      { ref:'epinards',       qte:100 },
      { ref:'avocat',         qte:60  },
      { ref:'graines_chia',   qte:10  }
    ]
  },
  {
    id:'buddha_bowl_femme',
    nom:'Buddha bowl complet 🌸',
    emoji:'🥙', categorie:'dejeuner', moment:'dejeuner',
    temps:20, difficulte:2,
    description:'Couleurs + nutriments — repas complet esthétique et sain',
    tags:['déjeuner','coloré','complet','femme'],
    genre:['femme'],
    objectifs:['forme','endurance'],
    seances:['tous'],
    ingredients:[
      { ref:'quinoa',      qte:100 },
      { ref:'edamame',     qte:80  },
      { ref:'tomate',      qte:100 },
      { ref:'poivron',     qte:80  },
      { ref:'avocat',      qte:60  },
      { ref:'graines_chia',qte:10  }
    ]
  },
  {
    id:'soupe_legumes_femme',
    nom:'Soupe protéinée 🌸',
    emoji:'🍲', categorie:'dejeuner', moment:'dejeuner',
    temps:20, difficulte:2,
    description:'Légère et rassasiante — idéale perte de poids',
    tags:['déjeuner','léger','chaud','femme'],
    genre:['femme'],
    objectifs:['perte_poids','seche'],
    seances:['tous'],
    ingredients:[
      { ref:'lentilles',   qte:100 },
      { ref:'courgette',   qte:150 },
      { ref:'tomate',      qte:150 },
      { ref:'epinards',    qte:80  },
      { ref:'huile_olive', qte:5   }
    ]
  },

  // ══ DÎNER ═══════════════════════════════════════════════
  {
    id:'saumon_riz',
    nom:'Saumon & riz complet',
    emoji:'🐠', categorie:'diner', moment:'diner',
    temps:25, difficulte:2,
    description:'Oméga-3 + glucides complexes — récupération nocturne optimale',
    tags:['dîner','récupération','oméga-3'],
    genre:['homme','femme'],
    objectifs:['tous'],
    seances:['tous'],
    ingredients:[
      { ref:'saumon',      qte:200 },
      { ref:'riz_complet', qte:150 },
      { ref:'brocoli',     qte:200 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'tofu_wok_femme',
    nom:'Wok tofu légumes 🌸',
    emoji:'🥢', categorie:'diner', moment:'diner',
    temps:20, difficulte:2,
    description:'Végétarien léger — protéines végétales + légumes colorés',
    tags:['végétarien','dîner','léger','femme'],
    genre:['femme'],
    objectifs:['forme','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'tofu',        qte:200 },
      { ref:'riz_basmati', qte:120 },
      { ref:'brocoli',     qte:150 },
      { ref:'courgette',   qte:100 },
      { ref:'poivron',     qte:80  },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:'dinde_legumes',
    nom:'Dinde & légumes vapeur',
    emoji:'🦃', categorie:'diner', moment:'diner',
    temps:20, difficulte:1,
    description:'Ultra-light — protéines maigres + légumes satiants',
    tags:['dîner','léger','maigre','sèche'],
    genre:['homme','femme'],
    objectifs:['seche','perte_poids'],
    seances:['tous'],
    ingredients:[
      { ref:'dinde',      qte:200 },
      { ref:'brocoli',    qte:200 },
      { ref:'courgette',  qte:150 },
      { ref:'champignons',qte:100 },
      { ref:'huile_olive',qte:5   }
    ]
  },
  {
    id:'boeuf_patate',
    nom:'Bœuf & patate douce',
    emoji:'🥩', categorie:'diner', moment:'diner',
    temps:30, difficulte:2,
    description:'Récupération musculaire nocturne — fer + glucides complexes',
    tags:['dîner','masse','récupération','homme'],
    genre:['homme'],
    objectifs:['prise_masse','force'],
    seances:['pec_tri','dos_bi','jambes'],
    ingredients:[
      { ref:'boeuf_maigre',   qte:200 },
      { ref:'patate_douce',   qte:200 },
      { ref:'epinards',       qte:100 },
      { ref:'huile_olive',    qte:10  }
    ]
  },

  // ══ COLLATIONS ══════════════════════════════════════════
  {
    id:'cottage_fruits',
    nom:'Cottage cheese & fruits',
    emoji:'🧀', categorie:'collation', moment:'collation',
    temps:3, difficulte:1,
    description:'Collation caséine + fruits — anti-catabolisme nocturne',
    tags:['collation','soir','caséine'],
    genre:['homme','femme'],
    objectifs:['tous'],
    seances:['tous'],
    ingredients:[
      { ref:'cottage_cheese', qte:200 },
      { ref:'fraises',        qte:100 },
      { ref:'myrtilles',      qte:50  },
      { ref:'amandes',        qte:15  }
    ]
  },
  {
    id:'snack_noix_femme',
    nom:'Snack noix & yaourt 🌸',
    emoji:'🌰', categorie:'collation', moment:'collation',
    temps:2, difficulte:1,
    description:'Collation satiante — bons lipides + probiotiques',
    tags:['collation','femme','satiété'],
    genre:['femme'],
    objectifs:['forme','seche'],
    seances:['tous'],
    ingredients:[
      { ref:'yaourt_grec',  qte:150 },
      { ref:'noix',         qte:20  },
      { ref:'myrtilles',    qte:60  },
      { ref:'graines_chia', qte:10  }
    ]
  },
  {
    id:'barre_amandes',
    nom:'Barre protéinée + amandes',
    emoji:'🍫', categorie:'collation', moment:'collation',
    temps:1, difficulte:1,
    description:'Snack express à emporter — protéines rapides',
    tags:['collation','rapide','nomade'],
    genre:['homme','femme'],
    objectifs:['tous'],
    seances:['tous'],
    ingredients:[
      { ref:'barre_proteinee', qte:60 },
      { ref:'amandes',         qte:20 }
    ]
  }
];
// ════════════════════════════════════════════════════════════
// MODULE NUTRITION v5.0
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
  _objectifsCache:    null,
  _objectifsCacheKey: null,

  // ════════════════════════════════════════════════════════
  // PROFIL
  // ════════════════════════════════════════════════════════
  _getProfil() {
    try {
      const ob = Utils.storage.get('ft_profil_onboarding', null);
      const tr = Tracker.getProfil();
      return {
        genre:    ob?.genre    || 'homme',
        objectif: ob?.objectif || tr?.objectif || 'forme',
        muscles:  ob?.muscles_cibles || [],
        poids:    tr?.poids    || ob?.poids    || 80,
        taille:   tr?.taille   || ob?.taille   || 175,
        age:      ob?.age      || 25,
        niveau:   ob?.niveau   || 'intermediaire'
      };
    } catch(e) {
      return {
        genre:'homme', objectif:'forme',
        muscles:[], poids:80, taille:175,
        age:25, niveau:'intermediaire'
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
        const ancienne = Utils.storage.get(`ft_nutrition_${date}`, null);
        if (!ancienne?.repas?.length) continue;
        const cleNew = `${this.CLE_JOURNAL}_${date}`;
        if (Utils.storage.get(cleNew, null)) continue;
        const entrees = ancienne.repas.map(r => ({
          id:     r.id?.toString() || Date.now().toString(),
          ref:    r.ref   || 'custom',
          nom:    r.nom   || 'Aliment',
          emoji:  r.emoji || '🍽️',
          unite:  'g',
          qte:    r.quantite || 100,
          moment: r.repas    || 'dejeuner',
          cal:    r.cal  || 0,
          prot:   r.prot || 0,
          gluc:   r.gluc || 0,
          lip:    r.lip  || 0,
          date,
          heure:  r.heure || '12:00'
        }));
        Utils.storage.set(cleNew, entrees);
        if (ancienne.eau) {
          const cleEau = `${this.CLE_EAU}_${date}`;
          if (!Utils.storage.get(cleEau, null))
            Utils.storage.set(cleEau, ancienne.eau);
        }
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS — genre + objectif aware
  // ════════════════════════════════════════════════════════
  _calculerObjectifsAuto(profil) {
    const poids    = profil.poids    || 80;
    const taille   = profil.taille   || 175;
    const age      = profil.age      || 25;
    const objectif = profil.objectif || 'forme';
    const genre    = profil.genre    || 'homme';

    // Mifflin-St Jeor (plus précis que Harris-Benedict)
    let bmr;
    if (genre === 'femme') {
      bmr = (10 * poids) + (6.25 * taille) - (5 * age) - 161;
    } else {
      bmr = (10 * poids) + (6.25 * taille) - (5 * age) + 5;
    }

    // Niveau d'activité
    const niveauFactor = {
      debutant:      1.375,
      intermediaire: 1.55,
      avance:        1.725
    }[profil.niveau || 'intermediaire'] || 1.55;

    const tdee = Math.round(bmr * niveauFactor);

    // Surplus/déficit selon objectif ET genre
    const surplus = {
      prise_masse: genre === 'femme' ? +250 : +400,
      seche:       genre === 'femme' ? -300 : -450,
      force:       genre === 'femme' ? +150 : +250,
      endurance:   genre === 'femme' ? -50  : -100,
      perte_poids: genre === 'femme' ? -350 : -500,
      forme:       0
    }[objectif] || 0;

    const calories = Math.max(1200, tdee + surplus);

    // Ratio macros selon genre + objectif
    const facteurProt = {
      prise_masse: genre === 'femme' ? 1.8 : 2.2,
      seche:       genre === 'femme' ? 2.0 : 2.5,
      force:       genre === 'femme' ? 1.8 : 2.2,
      endurance:   genre === 'femme' ? 1.4 : 1.6,
      perte_poids: genre === 'femme' ? 1.8 : 2.0,
      forme:       genre === 'femme' ? 1.6 : 1.8
    }[objectif] || (genre === 'femme' ? 1.6 : 1.8);

    const pctGluc = {
      prise_masse: genre === 'femme' ? 0.42 : 0.48,
      seche:       genre === 'femme' ? 0.30 : 0.30,
      force:       genre === 'femme' ? 0.38 : 0.42,
      endurance:   genre === 'femme' ? 0.50 : 0.55,
      perte_poids: genre === 'femme' ? 0.28 : 0.30,
      forme:       genre === 'femme' ? 0.40 : 0.45
    }[objectif] || 0.40;

    const pctLip = {
      prise_masse: genre === 'femme' ? 0.28 : 0.25,
      seche:       genre === 'femme' ? 0.32 : 0.28,
      force:       genre === 'femme' ? 0.30 : 0.28,
      endurance:   genre === 'femme' ? 0.28 : 0.25,
      perte_poids: genre === 'femme' ? 0.32 : 0.28,
      forme:       genre === 'femme' ? 0.30 : 0.25
    }[objectif] || 0.28;

    return {
      tdee,
      calories:  Math.round(calories),
      proteines: Math.round(poids * facteurProt),
      glucides:  Math.round((calories * pctGluc) / 4),
      lipides:   Math.round((calories * pctLip)  / 9),
      eau:       parseFloat(
        (genre === 'femme'
          ? poids * 0.032
          : poids * 0.035
        ).toFixed(1)
      )
    };
  },

  getObjectifs() {
    const profil   = this._getProfil();
    const cacheKey = `${Utils.aujourd_hui()}_${profil.genre}_${profil.objectif}_${profil.poids}`;
    if (this._objectifsCache && this._objectifsCacheKey === cacheKey)
      return this._objectifsCache;
    const auto   = this._calculerObjectifsAuto(profil);
    const stored = Utils.storage.get(this.CLE_OBJECTIFS, null);
    const result = stored || {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    };
    this._objectifsCache    = result;
    this._objectifsCacheKey = cacheKey;
    return result;
  },

  _invaliderCache() {
    this._objectifsCache    = null;
    this._objectifsCacheKey = null;
  },

  // ════════════════════════════════════════════════════════
  // DONNÉES JOURNAL
  // ════════════════════════════════════════════════════════
  _getJournal(date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(`${this.CLE_JOURNAL}_${d}`, []);
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
    Utils.toast('🗑️ Supprimé', 'info', 1200);
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreJournal(c);
  },

  getTotauxJournal(date = null) {
    return this._getJournal(date).reduce(
      (t, e) => ({
        cal:  t.cal  + (e.cal  || 0),
        prot: t.prot + (e.prot || 0),
        gluc: t.gluc + (e.gluc || 0),
        lip:  t.lip  + (e.lip  || 0)
      }),
      { cal:0, prot:0, gluc:0, lip:0 }
    );
  },

  getEau(date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(`${this.CLE_EAU}_${d}`, 0);
  },

  getTotauxSemaine() {
    const debut  = Utils.debutSemaine(Utils.aujourd_hui());
    const totaux = { cal:0, prot:0, gluc:0, lip:0, eau:0 };
    for (let i = 0; i < 7; i++) {
      const date = Utils.ajouterJours(debut, i);
      if (date > Utils.aujourd_hui()) break;
      const t = this.getTotauxJournal(date);
      totaux.cal  += t.cal;
      totaux.prot += t.prot;
      totaux.gluc += t.gluc;
      totaux.lip  += t.lip;
      totaux.eau  += this.getEau(date);
    }
    return totaux;
  },

  getStreakNutrition() {
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const date = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      if (this._getJournal(date).length > 0) streak++;
      else if (i > 0) break;
    }
    return streak;
  },

  getJoursHydratation(n = 30) {
    const obj = this.getObjectifs();
    let count  = 0;
    for (let i = 0; i < n; i++) {
      if (this.getEau(
        Utils.ajouterJours(Utils.aujourd_hui(), -i)
      ) >= obj.eau * 900) count++;
    }
    return count;
  },

  getJoursProteines(n = 30) {
    const obj = this.getObjectifs();
    let count  = 0;
    for (let i = 0; i < n; i++) {
      const t = this.getTotauxJournal(
        Utils.ajouterJours(Utils.aujourd_hui(), -i)
      );
      if (t.prot >= obj.proteines * 0.9) count++;
    }
    return count;
  },

  // ════════════════════════════════════════════════════════
  // SCORE NUTRITION
  // ════════════════════════════════════════════════════════
  _calculerScore(totaux, obj, eau) {
    if (totaux.cal === 0) return { score:0, emoji:'', message:'' };
    const pCal  = (totaux.cal  / Math.max(obj.calories,  1)) * 100;
    const pProt = (totaux.prot / Math.max(obj.proteines, 1)) * 100;
    const pEau  = (eau         / Math.max(obj.eau * 1000,1)) * 100;
    let s = 0;
    if (pCal  >= 85 && pCal  <= 115) s += 40;
    else if (pCal >= 70 && pCal <= 130) s += 25;
    else s += 10;
    if (pProt >= 90) s += 35;
    else if (pProt >= 70) s += 20;
    else s += 5;
    if (pEau  >= 90) s += 25;
    else if (pEau >= 60) s += 15;
    else s += 5;
    s = Math.min(100, s);
    return {
      score:   s,
      emoji:   s >= 80 ? '🌟' : s >= 60 ? '👍' : '📊',
      message: s >= 80
        ? 'Excellente journée nutritionnelle !'
        : s >= 60
          ? 'Bonne nutrition — continue !'
          : pProt < 70
            ? `⚠️ Encore ${Math.round(obj.proteines - totaux.prot)}g de protéines`
            : 'Augmente tes apports pour atteindre tes objectifs'
    };
  },

  _getHistorique(jours = 7) {
    const obj  = this.getObjectifs();
    const hist = [];
    for (let i = jours - 1; i >= 0; i--) {
      const date   = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const totaux = this.getTotauxJournal(date);
      const eau    = this.getEau(date);
      hist.push({
        date,
        label: Utils.formatDateCourt
          ? Utils.formatDateCourt(date) : date.slice(5),
        ...totaux, eau,
        score: this._calculerScore(totaux, obj, eau).score
      });
    }
    return hist;
  },

  // ════════════════════════════════════════════════════════
  // RECETTES — genre + objectif + séance aware
  // ════════════════════════════════════════════════════════
  getRecettesAdaptees(limite = 6) {
    const profil  = this._getProfil();
    const genre   = profil.genre;
    const objectif= profil.objectif;

    // Détecter séance du jour
    let seanceType = 'tous';
    try {
      const seanceId = Programme.getSeanceduJour()?.id || '';
      if (seanceId.includes('pec') || seanceId.includes('push'))
        seanceType = 'pec_tri';
      else if (seanceId.includes('dos') || seanceId.includes('pull'))
        seanceType = 'dos_bi';
      else if (seanceId.includes('jambe') || seanceId.includes('leg'))
        seanceType = 'jambes';
      else if (seanceId.includes('full') || seanceId.includes('complet'))
        seanceType = 'full_body';
    } catch(e) {}

    return RECETTES_DB
      .filter(r => {
        const gOK = !r.genre
          || r.genre.includes(genre)
          || r.genre.includes('tous');
        const oOK = !r.objectifs
          || r.objectifs.includes(objectif)
          || r.objectifs.includes('tous')
          || r.objectifs.includes('forme');
        return gOK && oOK;
      })
      .sort((a, b) => {
        let sA = 0, sB = 0;
        if (a.genre?.includes(genre))    sA += 3;
        if (b.genre?.includes(genre))    sB += 3;
        if (a.objectifs?.includes(objectif)) sA += 2;
        if (b.objectifs?.includes(objectif)) sB += 2;
        if (a.seances?.includes(seanceType)) sA += 1;
        if (b.seances?.includes(seanceType)) sB += 1;
        return sB - sA;
      })
      .slice(0, limite);
  },

  getSuggestionPostSeance() {
    const profil  = this._getProfil();
    const genre   = profil.genre;
    const objectif= profil.objectif;
    const muscles = profil.muscles;

    // Trouver une recette post-séance adaptée
    const candidates = RECETTES_DB.filter(r =>
      r.moment === 'post_seance' &&
      (r.genre?.includes(genre) || !r.genre?.length)
    ).sort((a, b) => {
      let sA = 0, sB = 0;
      if (a.objectifs?.includes(objectif)) sA += 2;
      if (b.objectifs?.includes(objectif)) sB += 2;
      // Muscles ciblés
      const musclesCibles = muscles || [];
      const legMuscles = ['fessiers','quadriceps','ischio','mollets'];
      const hasLeg = musclesCibles.some(m => legMuscles.includes(m));
      if (hasLeg && a.id?.includes('fessier')) sA += 1;
      if (hasLeg && b.id?.includes('fessier')) sB += 1;
      return sB - sA;
    });

    return candidates[0] || null;
  },

  _calculerMacrosRecette(recette) {
    if (!recette?.ingredients) return { cal:0, prot:0, gluc:0, lip:0 };
    return recette.ingredients.reduce((t, ing) => {
      const ali = ALIMENTS_DB[ing.ref];
      if (!ali) return t;
      const ratio = ing.qte / ali.portion;
      return {
        cal:  Math.round(t.cal  + ali.cal  * ratio),
        prot: Math.round(t.prot + ali.prot * ratio),
        gluc: Math.round(t.gluc + ali.gluc * ratio),
        lip:  Math.round(t.lip  + ali.lip  * ratio)
      };
    }, { cal:0, prot:0, gluc:0, lip:0 });
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

    const profil = this._getProfil();
    const badge  = profil.genre === 'femme' ? ' 🌸' : ' 💪';

    container.innerHTML = `
      <div class="tabs-container mb-md"
           style="display:grid;
                  grid-template-columns:repeat(5,1fr);gap:4px">
        ${[
          { id:'dashboard', emoji:'📊', label:'Dashboard' },
          { id:'journal',   emoji:'📔', label:'Journal'   },
          { id:'recettes',  emoji:'🍽️', label:'Recettes'  },
          { id:'objectifs', emoji:'🎯', label:'Objectifs' },
          { id:'stats',     emoji:'📈', label:'Stats'     }
        ].map(t => `
          <button onclick="Nutrition._changerOnglet('${t.id}')"
                  style="padding:8px 4px;font-size:.62rem;
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
              ${t.emoji}
            </div>${t.label}
          </button>`).join('')}
      </div>
      <div id="nutrition-content"></div>`;

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
  // DASHBOARD
  // ════════════════════════════════════════════════════════
  _rendreDashboard(container) {
    const totaux  = this.getTotauxJournal();
    const obj     = this.getObjectifs();
    const eau     = this.getEau();
    const eauObj  = obj.eau * 1000;
    const profil  = this._getProfil();
    const genre   = profil.genre;
    const score   = this._calculerScore(totaux, obj, eau);
    const surplus = totaux.cal - obj.calories;
    const badge   = genre === 'femme' ? ' 🌸' : '';

    const pcts = {
      cal:  Math.min(100,Math.round((totaux.cal /Math.max(obj.calories, 1))*100)),
      prot: Math.min(100,Math.round((totaux.prot/Math.max(obj.proteines,1))*100)),
      gluc: Math.min(100,Math.round((totaux.gluc/Math.max(obj.glucides, 1))*100)),
      lip:  Math.min(100,Math.round((totaux.lip /Math.max(obj.lipides,  1))*100)),
      eau:  Math.min(100,Math.round((eau        /Math.max(eauObj,       1))*100))
    };

    // Suggestion post-séance
    let postSeance = null;
    try {
      const seanceDuJour = Tracker.getSeanceDuJour?.();
      if (seanceDuJour?.series?.length > 0 || seanceDuJour?.complete) {
        postSeance = this.getSuggestionPostSeance();
      }
    } catch(e) {}

    const recettes = this.getRecettesAdaptees(3);

    container.innerHTML = `

      <!-- Score -->
      ${score.score > 0 ? `
        <div style="background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-left:3px solid var(--fd-indigo);
                    border-radius:var(--radius-xl);
                    padding:12px 14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:12px">
          <div style="font-size:1.8rem;font-weight:900;
                      color:${score.score>=80
                        ?'var(--fd-mint)':score.score>=60
                        ?'var(--fd-lemon)':'var(--fd-coral)'}">
            ${score.score}
          </div>
          <div style="flex:1">
            <div style="font-size:.72rem;font-weight:700;
                        color:var(--fd-indigo)">
              📊 Score nutrition${badge}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${score.message}
            </div>
          </div>
          <div style="font-size:1.2rem">${score.emoji}</div>
        </div>` : ''}

      <!-- Calories -->
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
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--fd-indigo)">
              📊 Bilan du jour${badge}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              ${new Date().toLocaleDateString('fr-FR',{
                weekday:'long',day:'numeric',month:'long'
              })}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.6rem;font-weight:800;
                        color:${pcts.cal>=110?'var(--fd-coral)'
                          :pcts.cal>=90?'var(--fd-mint)'
                          :'var(--fd-indigo)'}">
              ${Math.round(totaux.cal)}
            </div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              / ${obj.calories} kcal
            </div>
            <div style="font-size:.6rem;font-weight:700;
                        color:${surplus>=0
                          ?'var(--fd-coral)':'var(--fd-mint)'}">
              ${surplus>=0?'+':''}${Math.round(surplus)} kcal
            </div>
          </div>
        </div>

        <div style="height:8px;background:rgba(255,255,255,0.06);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:14px">
          <div style="height:100%;width:${pcts.cal}%;
                      background:${pcts.cal>=110
                        ?'var(--fd-coral)':'var(--fd-indigo)'};
                      border-radius:99px;transition:width 1s ease">
          </div>
        </div>

        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);gap:8px">
          ${[
            {label:'Protéines',val:totaux.prot,obj:obj.proteines,
             pct:pcts.prot,color:'var(--fd-coral)',   u:'g',e:'💪'},
            {label:'Glucides', val:totaux.gluc,obj:obj.glucides,
             pct:pcts.gluc,color:'var(--fd-lemon)',   u:'g',e:'⚡'},
            {label:'Lipides',  val:totaux.lip, obj:obj.lipides,
             pct:pcts.lip, color:'var(--fd-lavender)',u:'g',e:'🥑'}
          ].map(m => `
            <div style="text-align:center;padding:10px 6px;
                        background:rgba(255,255,255,0.04);
                        border-radius:var(--radius-md)">
              <div style="font-size:.58rem;color:var(--text-muted);
                          margin-bottom:4px">${m.e} ${m.label}</div>
              <div style="font-size:.92rem;font-weight:800;
                          color:${m.color}">
                ${Math.round(m.val)}${m.u}
              </div>
              <div style="font-size:.52rem;color:var(--text-muted)">
                / ${m.obj}${m.u}
              </div>
              <div style="height:4px;background:rgba(255,255,255,0.06);
                          border-radius:99px;overflow:hidden;
                          margin-top:5px">
                <div style="height:100%;width:${m.pct}%;
                            background:${m.pct>=100
                              ?'var(--fd-coral)':m.color};
                            border-radius:99px"></div>
              </div>
              <div style="font-size:.52rem;margin-top:2px;
                          color:${m.pct>=100
                            ?'var(--fd-coral)':'var(--text-muted)'}">
                ${m.pct}%${m.pct>=100?' ⚠️':''}
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
                    justify-content:space-between;margin-bottom:10px">
          <div>
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.08em;
                        color:var(--fd-indigo)">
              💧 Hydratation
            </div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:var(--fd-indigo);margin-top:3px">
              ${(eau/1000).toFixed(2)}L
              <span style="font-size:.7rem;color:var(--text-muted);
                           font-weight:400">/ ${obj.eau}L</span>
            </div>
          </div>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none"
                    stroke="rgba(75,75,249,0.12)" stroke-width="7"/>
            <circle cx="32" cy="32" r="26" fill="none"
                    stroke="var(--fd-indigo)" stroke-width="7"
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
                      background:var(--fd-indigo);border-radius:99px;
                      transition:width .8s ease"></div>
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);gap:6px">
          ${[
            {ml:150, label:'+150',icon:'🥛'},
            {ml:250, label:'+250',icon:'🥤'},
            {ml:500, label:'+500',icon:'💧'},
            {ml:1000,label:'+1L', icon:'🍶'}
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
                ${b.label}
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
          </div>`}
      </div>

      <!-- Post-séance -->
      ${postSeance ? `
        <div onclick="Nutrition._voirRecette('${postSeance.id}')"
             style="background:rgba(139,240,187,0.07);
                    border:1px solid rgba(139,240,187,0.25);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px;cursor:pointer">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-mint);margin-bottom:6px">
            ⚡ Suggestion post-séance${badge}
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
                · ⏱ ${postSeance.temps}min
              </div>
            </div>
            <span style="color:var(--fd-mint);font-size:1.2rem">›</span>
          </div>
        </div>` : ''}

      <!-- Recettes pour toi -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;margin-bottom:10px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted)">
            🍽️ Recettes pour toi${badge}
          </div>
          <button onclick="Nutrition._changerOnglet('recettes')"
                  style="background:none;border:none;font-size:.68rem;
                         color:var(--fd-indigo);cursor:pointer;
                         font-weight:600">
            Voir tout →
          </button>
        </div>
        ${recettes.map(r => {
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
                    justify-content:space-between;margin-bottom:10px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted)">
            📔 Dernières entrées
          </div>
          <button onclick="Nutrition._changerOnglet('journal')"
                  style="background:none;border:none;font-size:.68rem;
                         color:var(--fd-indigo);cursor:pointer;
                         font-weight:600">
            Voir tout →
          </button>
        </div>
        ${this._renderDernieresEntrees()}
      </div>

      <button onclick="Nutrition._ouvrirAjoutAliment()"
              class="btn-primary" style="width:100%;font-size:.88rem">
        ➕ Ajouter un aliment
      </button>`;
  },

  _renderDernieresEntrees() {
    const entrees = this._getJournal().slice(-3).reverse();
    if (!entrees.length) return `
      <div style="text-align:center;padding:16px;
                  color:var(--text-muted);font-size:.82rem">
        Aucune entrée aujourd'hui
      </div>`;
    return entrees.map(e => {
      const ali = ALIMENTS_DB[e.ref]
        || { nom:e.nom||e.ref, emoji:e.emoji||'🍽️' };
      return `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:8px 0;
                    border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.2rem">${ali.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:600">
              ${ali.nom||e.nom}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              ${e.qte||100}${e.unite||'g'} · ${e.moment||''}
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
      {id:'matin',       label:'🌅 Matin'      },
      {id:'dejeuner',    label:'☀️ Déjeuner'   },
      {id:'collation',   label:'🍎 Collation'  },
      {id:'diner',       label:'🌙 Dîner'      },
      {id:'post_seance', label:'⚡ Post-séance' },
      {id:'pre_seance',  label:'🎯 Pré-séance'  }
    ];

    container.innerHTML = `
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:10px">
          <div style="font-size:.88rem;font-weight:800">
            Total du jour
          </div>
          <div style="font-size:1rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${Math.round(totaux.cal)} kcal
          </div>
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);gap:8px">
          ${[
            {label:'Prot.',val:totaux.prot,obj:obj.proteines,
             color:'var(--fd-coral)'   },
            {label:'Gluc.',val:totaux.gluc,obj:obj.glucides,
             color:'var(--fd-lemon)'   },
            {label:'Lip.', val:totaux.lip, obj:obj.lipides,
             color:'var(--fd-lavender)'}
          ].map(m => {
            const pct = Math.min(100,
              Math.round((m.val/Math.max(m.obj,1))*100));
            return `
              <div>
                <div style="display:flex;justify-content:space-between;
                            margin-bottom:3px">
                  <span style="font-size:.6rem;
                               color:var(--text-muted)">
                    ${m.label}
                  </span>
                  <span style="font-size:.6rem;font-weight:700;
                               color:${m.color}">
                    ${Math.round(m.val)}g
                  </span>
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
              style="width:100%;margin-bottom:14px;font-size:.88rem">
        ➕ Ajouter un aliment
      </button>

      ${moments.map(moment => {
        const entrees = journal.filter(
          e => (e.moment||e.repas) === moment.id
        );
        if (!entrees.length) return '';
        const totalM = entrees.reduce(
          (a,e) => ({
            cal: a.cal+(e.cal||0),
            prot:a.prot+(e.prot||0)
          }),
          {cal:0,prot:0}
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
                ${Math.round(totalM.cal)} kcal
                · ${Math.round(totalM.prot)}g prot
              </div>
            </div>
            ${entrees.map(e => {
              const ali = ALIMENTS_DB[e.ref]
                || {nom:e.nom||e.ref, emoji:e.emoji||'🍽️'};
              return `
                <div style="display:flex;align-items:center;
                            gap:10px;padding:10px 12px;
                            background:var(--bg-input);
                            border:1px solid var(--border-color);
                            border-radius:var(--radius-md);
                            margin-bottom:6px">
                  <span style="font-size:1.3rem;flex-shrink:0">
                    ${ali.emoji||e.emoji||'🍽️'}
                  </span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:.82rem;font-weight:700;
                                overflow:hidden;text-overflow:ellipsis;
                                white-space:nowrap">
                      ${ali.nom||e.nom}
                    </div>
                    <div style="font-size:.6rem;color:var(--text-muted)">
                      ${e.qte||100}${e.unite||'g'}
                      · P:${Math.round(e.prot||0)}g
                      · G:${Math.round(e.gluc||0)}g
                      · L:${Math.round(e.lip||0)}g
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:.82rem;font-weight:800;
                                color:var(--fd-lemon)">
                      ${Math.round(e.cal||0)}
                    </div>
                    <div style="font-size:.55rem;color:var(--text-muted)">
                      kcal
                    </div>
                  </div>
                  <button onclick="Nutrition._supprimerEntree('${e.id}')"
                          style="width:28px;height:28px;flex-shrink:0;
                                 background:rgba(255,141,150,0.1);
                                 border:1px solid rgba(255,141,150,0.2);
                                 border-radius:50%;color:var(--fd-coral);
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
            Clique sur ➕ pour commencer
          </div>
        </div>` : ''}`;
  },

  // ════════════════════════════════════════════════════════
  // AJOUT ALIMENT
  // ════════════════════════════════════════════════════════
  _ouvrirAjoutAliment(momentPrefere = 'dejeuner') {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;
    window._momentSelectionne = momentPrefere;

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <div style="font-size:.88rem;font-weight:800;
                    margin-bottom:12px">➕ Ajouter un aliment</div>
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
            Moment
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${[
              {id:'matin',       label:'🌅 Matin'      },
              {id:'dejeuner',    label:'☀️ Déjeuner'   },
              {id:'collation',   label:'🍎 Collation'  },
              {id:'diner',       label:'🌙 Dîner'      },
              {id:'post_seance', label:'⚡ Post-séance' }
            ].map(m => `
              <button onclick="Nutrition._selectMoment('${m.id}',this)"
                      id="moment-${m.id}"
                      style="padding:5px 10px;font-size:.65rem;
                             font-weight:600;cursor:pointer;
                             border-radius:var(--radius-full);
                             background:${m.id===momentPrefere
                               ?'rgba(75,75,249,0.2)':'var(--bg-input)'};
                             border:1px solid ${m.id===momentPrefere
                               ?'var(--fd-indigo)':'var(--border-color)'};
                             color:${m.id===momentPrefere
                               ?'var(--fd-indigo)':'var(--text-muted)'}">
                ${m.label}
              </button>`).join('')}
          </div>
        </div>
        <div id="ajout-content"></div>
      </div>`;

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
    const c = document.getElementById('ajout-content');
    if (!c) return;
    ['liste','manuel'].forEach(m => {
      const btn = document.getElementById(`btn-mode-${m}`);
      if (!btn) return;
      btn.style.background = m === mode
        ? 'var(--fd-indigo)' : 'var(--bg-input)';
      btn.style.color = m === mode ? 'white' : 'var(--text-muted)';
      btn.style.border = m === mode
        ? 'none' : '1px solid var(--border-color)';
    });

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
                       transform:translateY(-50%);
                       font-size:.9rem">🔍</span>
        </div>
        <div id="liste-aliments"
             style="max-height:300px;overflow-y:auto">
          ${this._renderListeAlimentsModal('')}
        </div>`;
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
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;gap:8px">
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
        </div>`;
    }
  },

  _renderListeAlimentsModal(recherche) {
    const q = (recherche||'').toLowerCase().trim();
    const profil = this._getProfil();
    const aliments = Object.entries(ALIMENTS_DB)
      .filter(([,ali]) => !q || ali.nom.toLowerCase().includes(q))
      .sort(([,a],[,b]) => {
        // Prioriser aliments adaptés au genre/objectif
        let sA = 0, sB = 0;
        if (a.genre?.includes(profil.genre)) sA++;
        if (b.genre?.includes(profil.genre)) sB++;
        if (a.objectifs?.includes(profil.objectif)) sA++;
        if (b.objectifs?.includes(profil.objectif)) sB++;
        return sB - sA;
      });

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
           onmouseenter="this.style.background='rgba(75,75,249,0.06)'"
           onmouseleave="this.style.background='transparent'">
        <span style="font-size:1.2rem;flex-shrink:0">${ali.emoji}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:.82rem;font-weight:700">
            ${ali.nom}
          </div>
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
              ${ali.nom}
            </div>
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
            <button onclick="Nutrition._ajusterQte(-${ali.portion>=100?25:5})"
                    style="width:42px;height:42px;
                           background:rgba(255,141,150,0.12);
                           border:2px solid rgba(255,141,150,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-coral);cursor:pointer">−
            </button>
            <input id="qte-aliment" type="number"
                   value="${ali.portion}" min="1" max="2000"
                   oninput="Nutrition._updateApercuMacros('${ref}',this.value)"
                   style="flex:1;padding:10px;font-size:1.1rem;
                          font-weight:800;text-align:center;
                          background:var(--bg-card);
                          border:2px solid var(--border-color);
                          border-radius:var(--radius-md);
                          color:var(--text-primary);outline:none"/>
            <button onclick="Nutrition._ajusterQte(${ali.portion>=100?25:5})"
                    style="width:42px;height:42px;
                           background:rgba(139,240,187,0.12);
                           border:2px solid rgba(139,240,187,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-mint);cursor:pointer">+
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
      </div>`;
  },

  _ajusterQte(delta) {
    const input = document.getElementById('qte-aliment');
    if (!input) return;
    const nouveau = Math.max(1, (parseFloat(input.value)||0) + delta);
    input.value = nouveau;
    this._updateApercuMacros(this._alimentChoisi, nouveau);
  },

  _updateApercuMacros(ref, qte) {
    const ali    = ALIMENTS_DB[ref];
    if (!ali) return;
    const apercu = document.getElementById('apercu-macros');
    if (apercu) apercu.innerHTML =
      this._renderApercuMacros(ali, parseFloat(qte)||0);
  },

  _renderApercuMacros(ali, qte) {
    const r = qte / ali.portion;
    return [
      {label:'Cal', val:Math.round(ali.cal *r),
       color:'var(--fd-lemon)',   u:'kcal'},
      {label:'Prot',val:Math.round(ali.prot*r*10)/10,
       color:'var(--fd-coral)',   u:'g'   },
      {label:'Gluc',val:Math.round(ali.gluc*r*10)/10,
       color:'var(--fd-indigo)', u:'g'   },
      {label:'Lip', val:Math.round(ali.lip *r*10)/10,
       color:'var(--fd-lavender)',u:'g'  }
    ].map(m => `
      <div style="text-align:center">
        <div style="font-size:.9rem;font-weight:800;
                    color:${m.color}">${m.val}</div>
        <div style="font-size:.5rem;color:var(--text-muted);
                    text-transform:uppercase;margin-top:1px">
          ${m.label}
        </div>
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

    this._ajouterEntreeJournal({
      id:    Date.now().toString(),
      ref,
      nom:   ali.nom,
      emoji: ali.emoji,
      unite: ali.unite,
      qte,   moment,
      cal:   Math.round(ali.cal  * ratio * 10) / 10,
      prot:  Math.round(ali.prot * ratio * 10) / 10,
      gluc:  Math.round(ali.gluc * ratio * 10) / 10,
      lip:   Math.round(ali.lip  * ratio * 10) / 10,
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    });

    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}
    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ ${ali.nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();
    this._alimentChoisi = null;
    const p = document.getElementById('page-nutrition');
    if (p) this.render(p);
  },

  _ajouterManuel() {
    const nom  = document.getElementById('manuel-nom')?.value?.trim();
    const cal  = parseFloat(document.getElementById('manuel-cal')?.value)  || 0;
    const prot = parseFloat(document.getElementById('manuel-prot')?.value) || 0;
    const gluc = parseFloat(document.getElementById('manuel-gluc')?.value) || 0;
    const lip  = parseFloat(document.getElementById('manuel-lip')?.value)  || 0;
    const qte  = parseFloat(document.getElementById('manuel-qte')?.value)  || 100;
    if (!nom) { Utils.toast('Entre le nom !', 'error'); return; }
    if (!cal) { Utils.toast('Entre les calories !', 'error'); return; }
    const ratio  = qte / 100;
    this._ajouterEntreeJournal({
      id:    Date.now().toString(),
      ref:   'custom_' + Date.now(),
      nom, emoji:'🍽️', unite:'g', qte,
      moment: window._momentSelectionne || 'dejeuner',
      cal:  Math.round(cal *ratio*10)/10,
      prot: Math.round(prot*ratio*10)/10,
      gluc: Math.round(gluc*ratio*10)/10,
      lip:  Math.round(lip *ratio*10)/10,
      date: Utils.aujourd_hui(),
      heure:new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    });
    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}
    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ ${nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();
    const p = document.getElementById('page-nutrition');
    if (p) this.render(p);
  },

  // ════════════════════════════════════════════════════════
  // RECETTES
  // ════════════════════════════════════════════════════════
  _rendreRecettes(container) {
    const profil  = this._getProfil();
    const filtres = [
      {id:'tous',          label:'Tous'         },
      {id:'post_seance',   label:'⚡ Post-séance'},
      {id:'pre_seance',    label:'🎯 Pré-séance' },
      {id:'petit_dejeuner',label:'🌅 Matin'      },
      {id:'dejeuner',      label:'☀️ Déjeuner'  },
      {id:'diner',         label:'🌙 Dîner'      },
      {id:'collation',     label:'🍎 Collation'  }
    ];

    // Filtrer selon genre + filtre catégorie
    const recettesFiltrees = RECETTES_DB
      .filter(r => {
        const catOK = this._filtreRecette === 'tous'
          || r.categorie === this._filtreRecette;
        const genreOK = !r.genre
          || r.genre.includes(profil.genre)
          || r.genre.includes('tous');
        return catOK && genreOK;
      })
      .sort((a, b) => {
        let sA = 0, sB = 0;
        if (a.genre?.includes(profil.genre)) sA += 2;
        if (b.genre?.includes(profil.genre)) sB += 2;
        if (a.objectifs?.includes(profil.objectif)) sA++;
        if (b.objectifs?.includes(profil.objectif)) sB++;
        return sB - sA;
      });

    container.innerHTML = `
      <div class="muscle-filter-row mb-md">
        ${filtres.map(f => `
          <button class="muscle-filter-btn ${
            this._filtreRecette===f.id?'active':''}"
                  onclick="Nutrition._filtrerRecettes('${f.id}')">
            ${f.label}
          </button>`).join('')}
      </div>
      <div style="font-size:.68rem;color:var(--text-muted);
                  margin-bottom:10px">
        ${recettesFiltrees.length} recette${recettesFiltrees.length>1?'s':''}
        pour toi${profil.genre==='femme'?' 🌸':' 💪'}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${recettesFiltrees.map(r => {
          const macros = this._calculerMacrosRecette(r);
          return `
            <div onclick="Nutrition._voirRecette('${r.id}')"
                 style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-xl);
                        padding:14px;cursor:pointer;transition:all .15s"
                 onmouseenter="this.style.borderColor='rgba(75,75,249,0.3)'"
                 onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)'">
              <div style="display:flex;align-items:center;
                          gap:12px;margin-bottom:10px">
                <span style="font-size:2rem;flex-shrink:0">
                  ${r.emoji}
                </span>
                <div style="flex:1">
                  <div style="font-size:.9rem;font-weight:800;
                              margin-bottom:2px">${r.nom}</div>
                  <div style="font-size:.62rem;color:var(--text-muted)">
                    ⏱ ${r.temps}min
                    · ${r.ingredients.length} ingrédients
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-lemon)">
                    ${macros.cal}
                  </div>
                  <div style="font-size:.55rem;color:var(--text-muted)">
                    kcal
                  </div>
                </div>
              </div>
              <div style="display:grid;
                          grid-template-columns:repeat(3,1fr);gap:6px">
                ${[
                  {l:'P',val:macros.prot,color:'var(--fd-coral)',  max:50 },
                  {l:'G',val:macros.gluc,color:'var(--fd-indigo)', max:100},
                  {l:'L',val:macros.lip, color:'var(--fd-lavender)',max:50}
                ].map(m => `
                  <div>
                    <div style="display:flex;justify-content:space-between;
                                margin-bottom:2px">
                      <span style="font-size:.55rem;color:${m.color};
                                   font-weight:700">${m.l}</span>
                      <span style="font-size:.55rem;
                                   color:var(--text-muted)">
                        ${m.val}g
                      </span>
                    </div>
                    <div style="height:3px;
                                background:rgba(255,255,255,0.06);
                                border-radius:99px;overflow:hidden">
                      <div style="height:100%;
                                  width:${Math.min(100,
                                    Math.round((m.val/m.max)*100)
                                  )}%;
                                  background:${m.color};
                                  border-radius:99px"></div>
                    </div>
                  </div>`).join('')}
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;
                          margin-top:8px">
                ${r.tags.map(tag => `
                  <span style="padding:2px 7px;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.15);
                               border-radius:99px;font-size:.58rem;
                               color:var(--fd-lavender)">${tag}</span>`
                ).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  _filtrerRecettes(id) {
    this._filtreRecette = id;
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreRecettes(c);
  },

  _voirRecette(id) {
    const r = RECETTES_DB.find(r => r.id === id);
    if (!r) return;
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;
    const macros = this._calculerMacrosRecette(r);
    const obj    = this.getObjectifs();

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <div style="text-align:center;padding:16px 0;margin-bottom:14px">
          <div style="font-size:3rem;margin-bottom:6px">${r.emoji}</div>
          <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">
            ${r.nom}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted)">
            ⏱ ${r.temps}min · ${r.ingredients.length} ingrédients
          </div>
        </div>
        <div style="padding:10px 14px;
                    background:rgba(191,161,255,0.06);
                    border:1px solid rgba(191,161,255,0.15);
                    border-radius:var(--radius-md);
                    font-size:.82rem;color:var(--text-secondary);
                    line-height:1.5;margin-bottom:14px">
          💡 ${r.description}
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
              kcal · ${Math.round((macros.cal/Math.max(obj.calories,1))*100)}%
              de ton objectif
            </div>
          </div>
          ${[
            {label:'Protéines',val:macros.prot,obj:obj.proteines,
             color:'var(--fd-coral)',  e:'💪'},
            {label:'Glucides', val:macros.gluc,obj:obj.glucides,
             color:'var(--fd-indigo)', e:'⚡'},
            {label:'Lipides',  val:macros.lip, obj:obj.lipides,
             color:'var(--fd-lavender)',e:'🥑'}
          ].map(m => {
            const pct=Math.min(100,Math.round((m.val/Math.max(m.obj,1))*100));
            return `
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;
                            margin-bottom:4px">
                  <span style="font-size:.72rem;font-weight:700;
                               color:${m.color}">
                    ${m.e} ${m.label}
                  </span>
                  <span style="font-size:.72rem;color:var(--text-muted)">
                    ${m.val}g / ${m.obj}g
                  </span>
                </div>
                <div style="height:5px;background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${m.color};border-radius:99px;
                              transition:width .8s ease"></div>
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
          ${r.ingredients.map(ing => {
            const ali = ALIMENTS_DB[ing.ref];
            if (!ali) return '';
            const ratio = ing.qte / ali.portion;
            return `
              <div style="display:flex;align-items:center;gap:10px;
                          padding:8px 0;
                          border-bottom:1px solid var(--border-color)">
                <span style="font-size:1.1rem;flex-shrink:0">
                  ${ali.emoji}
                </span>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:600">
                    ${ali.nom}
                  </div>
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
          <button onclick="Nutrition._loggerRecette('${r.id}')"
                  class="btn-primary" style="font-size:.82rem">
            📔 Logger
          </button>
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            Fermer
          </button>
        </div>
      </div>`;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  _loggerRecette(id) {
    const r = RECETTES_DB.find(r => r.id === id);
    if (!r) return;
    const macros = this._calculerMacrosRecette(r);
    this._ajouterEntreeJournal({
      id:    Date.now().toString(),
      ref:   r.id,
      nom:   r.nom,
      emoji: r.emoji,
      unite: 'portion',
      qte:   1,
      moment:r.moment || 'dejeuner',
      ...macros,
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    });
    try { Gamification.ajouterXP(10, 'recette_log'); } catch(e) {}
    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ ${r.nom} ajouté !`, 'success', 2000);
    Utils.vibrerSuccess();
    this._changerOnglet('journal');
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS
  // ════════════════════════════════════════════════════════
  _rendreObjectifs(container) {
    const obj    = this.getObjectifs();
    const profil = this._getProfil();
    const auto   = this._calculerObjectifsAuto(profil);
    const badge  = profil.genre === 'femme' ? ' 🌸' : '';

    container.innerHTML = `
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border-color:rgba(75,75,249,0.3)">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:12px">
          🎯 Tes objectifs${badge}
        </div>
        ${[
          {label:'Calories', val:obj.calories,  auto:auto.calories,
           color:'var(--fd-lemon)',   e:'🔥', u:'kcal'},
          {label:'Protéines',val:obj.proteines, auto:auto.proteines,
           color:'var(--fd-coral)',   e:'💪', u:'g'   },
          {label:'Glucides', val:obj.glucides,  auto:auto.glucides,
           color:'var(--fd-indigo)',  e:'⚡', u:'g'   },
          {label:'Lipides',  val:obj.lipides,   auto:auto.lipides,
           color:'var(--fd-lavender)',e:'🥑', u:'g'   },
          {label:'Eau',      val:obj.eau,       auto:auto.eau,
           color:'var(--fd-indigo)',  e:'💧', u:'L'   }
        ].map(m => {
          const pct = Math.min(100,
            Math.round((m.val/Math.max(m.auto,1))*100));
          return `
            <div style="margin-bottom:12px">
              <div style="display:flex;align-items:center;
                          justify-content:space-between;
                          margin-bottom:5px">
                <span style="font-size:.78rem;font-weight:700;
                             color:${m.color}">
                  ${m.e} ${m.label}
                </span>
                <div style="text-align:right">
                  <span style="font-size:.82rem;font-weight:800">
                    ${m.val}${m.u}
                  </span>
                  <span style="font-size:.6rem;
                               color:var(--text-muted);margin-left:4px">
                    (auto: ${m.auto}${m.u})
                  </span>
                </div>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);
                          border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${pct}%;
                            background:${m.color};border-radius:99px;
                            transition:width .8s"></div>
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
            {id:'calories', label:'🔥 Calories (kcal)',val:obj.calories },
            {id:'proteines',label:'💪 Protéines (g)',  val:obj.proteines},
            {id:'glucides', label:'⚡ Glucides (g)',   val:obj.glucides },
            {id:'lipides',  label:'🥑 Lipides (g)',    val:obj.lipides  },
            {id:'eau',      label:'💧 Eau (L)',         val:obj.eau      }
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
        🧮 Calcul basé sur :
        <strong>${profil.poids}kg · ${profil.genre}${badge}</strong>
        · objectif <strong>${profil.objectif}</strong>
        · TDEE <strong>${auto.tdee} kcal</strong>
        · Méthode Mifflin-St Jeor
      </div>`;
  },

  _sauvegarderObjectifs() {
    const obj = {
      calories:  parseInt(document.getElementById('obj-calories')?.value)  || 2000,
      proteines: parseInt(document.getElementById('obj-proteines')?.value) || 160,
      glucides:  parseInt(document.getElementById('obj-glucides')?.value)  || 225,
      lipides:   parseInt(document.getElementById('obj-lipides')?.value)   || 56,
      eau:       parseFloat(document.getElementById('obj-eau')?.value)     || 2.5
    };
    Utils.storage.set(this.CLE_OBJECTIFS, obj);
    this._invaliderCache();
    Utils.toast('✅ Objectifs sauvegardés !', 'success');
    Utils.vibrerSuccess();
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  _resetObjectifs() {
    const profil = this._getProfil();
    const auto   = this._calculerObjectifsAuto(profil);
    Utils.storage.set(this.CLE_OBJECTIFS, {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    });
    this._invaliderCache();
    Utils.toast('🔄 Réinitialisés !', 'success');
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  // ════════════════════════════════════════════════════════
  // STATS
  // ════════════════════════════════════════════════════════
  _rendreStats(container) {
    const hist       = this._getHistorique(7);
    const obj        = this.getObjectifs();
    const scoreMoyen = hist.length > 0
      ? Math.round(hist.reduce((a,h) => a+(h.score||0),0)/hist.length)
      : 0;
    const streak     = this.getStreakNutrition();
    const joursHydra = this.getJoursHydratation(7);
    const joursProt  = this.getJoursProteines(7);

    container.innerHTML = `
      <!-- Score moyen + Streak -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:8px;margin-bottom:14px">
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:12px;text-align:center">
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-bottom:4px">📊 Score moy.</div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:${scoreMoyen>=80
                        ?'var(--fd-mint)':scoreMoyen>=60
                        ?'var(--fd-lemon)':'var(--fd-coral)'}">
            ${scoreMoyen}
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:12px;text-align:center">
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-bottom:4px">🔥 Streak</div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${streak}j
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:12px;text-align:center">
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-bottom:4px">💧 Hydra.</div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-indigo)">
            ${joursHydra}/7j
          </div>
        </div>
      </div>

      <!-- Moyennes semaine -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          {label:'Moy. calories',
           val:`${Math.round(hist.reduce((a,h)=>a+h.cal,0)/Math.max(hist.length,1))} kcal`,
           color:'var(--fd-lemon)',emoji:'🔥'},
          {label:'Moy. protéines',
           val:`${Math.round(hist.reduce((a,h)=>a+h.prot,0)/Math.max(hist.length,1))}g`,
           color:'var(--fd-coral)',emoji:'💪'},
          {label:'Obj. prot. atteint',
           val:`${joursProt}/7 jours`,
           color:'var(--fd-mint)',emoji:'✅'},
          {label:'Moy. glucides',
           val:`${Math.round(hist.reduce((a,h)=>a+h.gluc,0)/Math.max(hist.length,1))}g`,
           color:'var(--fd-indigo)',emoji:'⚡'}
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

      <!-- Charts -->
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
              Obj: ${obj.calories} kcal
            </span>
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
              Obj: ${obj.proteines}g
            </span>
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
            <span>📊 Score nutrition</span>
            <span style="color:var(--fd-lavender)">
              Sur 100
            </span>
          </div>
          <canvas id="chart-nutri-score" height="130"></canvas>
        </div>` : `
        <div style="text-align:center;padding:32px 16px;
                    color:var(--text-muted)">
          <div style="font-size:2rem;margin-bottom:8px">📊</div>
          <div style="font-size:.88rem">
            Pas encore assez de données<br>
            <span style="font-size:.72rem">
              Continue à logger tes repas !
            </span>
          </div>
        </div>`}

      <!-- Tableau -->
      ${hist.length > 0 ? `
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px;
                    overflow-x:auto">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px">
            📅 Récap semaine
          </div>
          <table style="width:100%;border-collapse:collapse;
                        font-size:.72rem;min-width:320px">
            <thead>
              <tr style="color:var(--text-muted)">
                <th style="text-align:left;padding:4px 6px;
                           font-weight:600">Jour</th>
                <th style="text-align:right;padding:4px 6px;
                           color:var(--fd-lemon)">Cal</th>
                <th style="text-align:right;padding:4px 6px;
                           color:var(--fd-coral)">Prot</th>
                <th style="text-align:right;padding:4px 6px;
                           color:var(--fd-indigo)">💧</th>
                <th style="text-align:right;padding:4px 6px;
                           color:var(--fd-lavender)">Score</th>
              </tr>
            </thead>
            <tbody>
              ${hist.map(h => `
                <tr style="border-top:1px solid var(--border-color)">
                  <td style="padding:6px 6px;font-weight:600">
                    ${h.label}
                  </td>
                  <td style="text-align:right;padding:6px 6px;
                             color:${h.cal>=obj.calories*0.9
                               ?'var(--fd-mint)':'var(--text-muted)'}">
                    ${Math.round(h.cal)}
                  </td>
                  <td style="text-align:right;padding:6px 6px;
                             color:${h.prot>=obj.proteines*0.9
                               ?'var(--fd-mint)':'var(--text-muted)'}">
                    ${Math.round(h.prot)}g
                  </td>
                  <td style="text-align:right;padding:6px 6px;
                             color:var(--fd-indigo)">
                    ${(h.eau/1000).toFixed(1)}L
                  </td>
                  <td style="text-align:right;padding:6px 6px">
                    <span style="color:${h.score>=80
                      ?'var(--fd-mint)':h.score>=60
                      ?'var(--fd-lemon)':'var(--fd-coral)'}">
                      ${h.score || '—'}
                    </span>
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>` : ''}`;

    // Charts
    requestAnimationFrame(() => {
      if (typeof Chart === 'undefined') return;
      const opts = {
        responsive: true,
        plugins: { legend:{ display:false } },
        scales: {
          x: { ticks:{ color:'rgba(255,255,255,0.4)',font:{size:10} },
               grid: { color:'rgba(255,255,255,0.04)' } },
          y: { ticks:{ color:'rgba(255,255,255,0.4)',font:{size:10} },
               grid: { color:'rgba(255,255,255,0.04)' } }
        }
      };

      // Calories
      const cc = document.getElementById('chart-nutri-cal');
      if (cc && hist.length > 1) {
        try {
          if (this._chartInstances.cal)
            this._chartInstances.cal.destroy();
          this._chartInstances.cal = new Chart(cc, {
            type:'bar',
            data:{
              labels: hist.map(h=>h.label),
              datasets:[{
                data: hist.map(h=>h.cal),
                backgroundColor: hist.map(h =>
                  h.cal >= obj.calories * 0.9
                    ? 'rgba(139,240,187,0.7)'
                    : 'rgba(75,75,249,0.6)'
                ),
                borderColor:'#4b4bf9',borderWidth:1,borderRadius:6
              }]
            },
            options:{...opts,scales:{...opts.scales,
              y:{...opts.scales.y,
                suggestedMax:Math.max(obj.calories*1.2,
                  ...hist.map(h=>h.cal))}}}
          });
        } catch(e) {}
      }

      // Protéines
      const cp = document.getElementById('chart-nutri-prot');
      if (cp && hist.length > 1) {
        try {
          if (this._chartInstances.prot)
            this._chartInstances.prot.destroy();
          this._chartInstances.prot = new Chart(cp, {
            type:'line',
            data:{
              labels: hist.map(h=>h.label),
              datasets:[{
                data: hist.map(h=>h.prot),
                borderColor:'#ff8d96',
                backgroundColor:'rgba(255,141,150,0.1)',
                borderWidth:2,pointRadius:5,
                pointBackgroundColor:'#ff8d96',
                tension:0.4,fill:true
              }]
            },
            options: opts
          });
        } catch(e) {}
      }

      // Score
      const cs = document.getElementById('chart-nutri-score');
      if (cs && hist.length > 1) {
        try {
          if (this._chartInstances.score)
            this._chartInstances.score.destroy();
          this._chartInstances.score = new Chart(cs, {
            type:'line',
            data:{
              labels: hist.map(h=>h.label),
              datasets:[{
                data: hist.map(h=>h.score||0),
                borderColor:'#bfa1ff',
                backgroundColor:'rgba(191,161,255,0.1)',
                borderWidth:2,pointRadius:5,
                pointBackgroundColor:'#bfa1ff',
                tension:0.4,fill:true
              }]
            },
            options:{...opts,scales:{...opts.scales,
              y:{...opts.scales.y,min:0,max:100,
                ticks:{...opts.scales.y.ticks,
                  callback:v=>`${v}/100`}}}}
          });
        } catch(e) {}
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // EAU
  // ════════════════════════════════════════════════════════
  _ajouterEau(ml) {
    const cle    = `${this.CLE_EAU}_${Utils.aujourd_hui()}`;
    const actuel = this.getEau();
    const obj    = this.getObjectifs();
    const max    = obj.eau * 1000 * 1.5;
    const nouveau= Math.min(actuel + ml, max);
    Utils.storage.set(cle, nouveau);
    Utils.toast(
      `💧 +${ml}ml · Total ${(nouveau/1000).toFixed(2)}L`,
      'success', 1500
    );
    Utils.vibrerSuccess();
    if (nouveau >= obj.eau * 1000 && actuel < obj.eau * 1000) {
      setTimeout(() => {
        Utils.toast('🎉 Objectif hydratation atteint !','success',3000);
        try { Gamification.ajouterXP(20,'hydratation'); } catch(e) {}
      }, 500);
    }
    if (this._ongletActif === 'dashboard') {
      const p = document.getElementById('page-nutrition');
      if (p) this.render(p);
    }
  },

  _ajouterEauRapide(ml) { this._ajouterEau(ml); }
};

// ════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE
// ════════════════════════════════════════════════════════════
window.Nutrition   = Nutrition;
window.ALIMENTS_DB = ALIMENTS_DB;
window.RECETTES_DB = RECETTES_DB;

console.log(
  `✅ Nutrition v5.0 chargé — ` +
  `${Object.keys(ALIMENTS_DB).length} aliments · ` +
  `${RECETTES_DB.length} recettes · ` +
  `Genre-aware ✅ · Objectif-aware ✅ · Séance-aware ✅`
);
