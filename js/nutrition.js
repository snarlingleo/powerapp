/* ============================================================
   PowerApp — Nutrition.js v2.0
   Recettes + Swaps + Courses E.Leclerc + Macros
   Adapté prise de masse · Haut du corps · Sans porc
   ============================================================ */

'use strict';

const Nutrition = {

  // ════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════
  CLE: {
    REPAS:        (date) => `ft_nutrition_repas_${date}`,
    EAU:          (date) => `ft_nutrition_eau_${date}`,
    OBJECTIFS:    ()     => 'ft_nutrition_objectifs',
    COURSES:      ()     => 'ft_nutrition_courses',
    PLAN_SEMAINE: ()     => 'ft_nutrition_plan_semaine',
    EXCLUSIONS:   ()     => 'ft_nutrition_exclusions'
  },

  // Exclusions par défaut
  EXCLUSIONS_DEFAULT: ['porc', 'lardons', 'jambon',
    'bacon', 'saucisson', 'chorizo'],

  // ════════════════════════════════════════════════════════
  // BASE DE RECETTES
  // ════════════════════════════════════════════════════════
  RECETTES: [

    // ── PETIT-DÉJEUNER ──────────────────────────────────
    {
      id: 'pdj_oatmeal_whey',
      nom: 'Oatmeal Protéiné',
      emoji: '🥣',
      type: 'petit_dejeuner',
      objectif: ['prise_masse', 'force'],
      temps: 5,
      calories: 520,
      macros: { prot: 42, gluc: 65, lip: 8 },
      ingredients: [
        { nom: 'Flocons d\'avoine', qte: 100, unite: 'g',
          rayon: 'Épicerie', emoji: '🌾',
          swaps: ['Granola maison', 'Riz au lait'] },
        { nom: 'Whey protéine vanille', qte: 30, unite: 'g',
          rayon: 'Nutrition sport', emoji: '🥛',
          swaps: ['Fromage blanc 0%', 'Yaourt grec 0%'] },
        { nom: 'Banane', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🍌',
          swaps: ['Pomme', 'Poire', 'Mangue'] },
        { nom: 'Lait écrémé', qte: 200, unite: 'ml',
          rayon: 'Crèmerie', emoji: '🥛',
          swaps: ['Lait d\'amande', 'Lait de soja', 'Eau'] },
        { nom: 'Beurre de cacahuète', qte: 15, unite: 'g',
          rayon: 'Épicerie', emoji: '🥜',
          swaps: ['Amandes concassées', 'Noix de cajou'] }
      ],
      etapes: [
        'Faire chauffer le lait 2min au micro-ondes',
        'Ajouter les flocons et mélanger',
        'Incorporer la whey hors du feu',
        'Couper la banane et ajouter le beurre de cacahuète'
      ]
    },

    {
      id: 'pdj_oeufs_toast',
      nom: 'Œufs Brouillés & Toast',
      emoji: '🍳',
      type: 'petit_dejeuner',
      objectif: ['prise_masse', 'forme'],
      temps: 10,
      calories: 480,
      macros: { prot: 38, gluc: 42, lip: 16 },
      ingredients: [
        { nom: 'Œufs entiers', qte: 3, unite: 'pièces',
          rayon: 'Crèmerie', emoji: '🥚',
          swaps: ['Blancs d\'œufs (6)', 'Œufs durs'] },
        { nom: 'Pain complet', qte: 2, unite: 'tranches',
          rayon: 'Boulangerie', emoji: '🍞',
          swaps: ['Pain de seigle', 'Tortilla blé complet'] },
        { nom: 'Avocat', qte: 0.5, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🥑',
          swaps: ['Fromage blanc', 'Houmous'] },
        { nom: 'Tomates cerises', qte: 100, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🍅',
          swaps: ['Tomate normale', 'Épinards'] }
      ],
      etapes: [
        'Battre les œufs avec sel et poivre',
        'Cuire à feu doux en remuant constamment',
        'Toaster le pain',
        'Étaler l\'avocat sur le toast',
        'Servir les œufs avec les tomates'
      ]
    },

    {
      id: 'pdj_pancakes_prot',
      nom: 'Pancakes Protéinés',
      emoji: '🥞',
      type: 'petit_dejeuner',
      objectif: ['prise_masse'],
      temps: 15,
      calories: 560,
      macros: { prot: 45, gluc: 70, lip: 10 },
      ingredients: [
        { nom: 'Flocons d\'avoine mixés', qte: 80, unite: 'g',
          rayon: 'Épicerie', emoji: '🌾',
          swaps: ['Farine complète', 'Farine d\'épeautre'] },
        { nom: 'Whey chocolat', qte: 30, unite: 'g',
          rayon: 'Nutrition sport', emoji: '🍫',
          swaps: ['Whey vanille', 'Fromage blanc'] },
        { nom: 'Blancs d\'œufs', qte: 4, unite: 'pièces',
          rayon: 'Crèmerie', emoji: '🥚',
          swaps: ['Œufs entiers (2)', 'Œuf + blanc'] },
        { nom: 'Banane mûre', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🍌',
          swaps: ['Compote pomme', 'Miel'] }
      ],
      etapes: [
        'Mixer les flocons en farine',
        'Mélanger tous les ingrédients',
        'Cuire dans une poêle antiadhésive',
        'Servir avec du miel ou des fruits rouges'
      ]
    },

    // ── PRÉ-SÉANCE ───────────────────────────────────────
    {
      id: 'pre_riz_poulet',
      nom: 'Riz + Poulet Pré-séance',
      emoji: '🍚',
      type: 'pre_seance',
      objectif: ['prise_masse', 'force'],
      temps: 20,
      calories: 550,
      macros: { prot: 45, gluc: 75, lip: 6 },
      ingredients: [
        { nom: 'Riz blanc', qte: 150, unite: 'g (cru)',
          rayon: 'Épicerie', emoji: '🍚',
          swaps: ['Riz complet', 'Pâtes', 'Patate douce'] },
        { nom: 'Blanc de poulet', qte: 150, unite: 'g',
          rayon: 'Boucherie / Volaille', emoji: '🍗',
          swaps: ['Thon en boîte', 'Dinde', 'Saumon'] },
        { nom: 'Courgette', qte: 100, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🥒',
          swaps: ['Brocoli', 'Épinards', 'Haricots verts'] },
        { nom: 'Huile d\'olive', qte: 10, unite: 'ml',
          rayon: 'Épicerie', emoji: '🫒',
          swaps: ['Huile de coco', 'Beurre clarifié'] }
      ],
      etapes: [
        'Cuire le riz 12min à l\'eau salée',
        'Griller le poulet à la poêle avec l\'huile',
        'Faire sauter la courgette 5min',
        'Assaisonner et servir 90min avant la séance'
      ]
    },

    {
      id: 'pre_banane_oats',
      nom: 'Banana & Oats Express',
      emoji: '⚡',
      type: 'pre_seance',
      objectif: ['prise_masse', 'endurance'],
      temps: 5,
      calories: 380,
      macros: { prot: 22, gluc: 65, lip: 5 },
      ingredients: [
        { nom: 'Banane', qte: 2, unite: 'pièces',
          rayon: 'Fruits & Légumes', emoji: '🍌',
          swaps: ['Dattes (4)', 'Mangue', 'Raisins secs'] },
        { nom: 'Flocons d\'avoine', qte: 60, unite: 'g',
          rayon: 'Épicerie', emoji: '🌾',
          swaps: ['Pain de mie complet', 'Galettes de riz'] },
        { nom: 'Fromage blanc 0%', qte: 150, unite: 'g',
          rayon: 'Crèmerie', emoji: '🥛',
          swaps: ['Yaourt grec', 'Skyr', 'Whey shaker'] }
      ],
      etapes: [
        'Préparer les flocons avec eau chaude 2min',
        'Couper les bananes',
        'Ajouter le fromage blanc',
        'Consommer 60min avant l\'entraînement'
      ]
    },

    // ── POST-SÉANCE ──────────────────────────────────────
    {
      id: 'post_poulet_riz_brocoli',
      nom: 'Bowl Poulet · Riz · Brocoli',
      emoji: '🥗',
      type: 'post_seance',
      objectif: ['prise_masse', 'force'],
      temps: 25,
      calories: 680,
      macros: { prot: 58, gluc: 80, lip: 8 },
      ingredients: [
        { nom: 'Blanc de poulet', qte: 200, unite: 'g',
          rayon: 'Boucherie / Volaille', emoji: '🍗',
          swaps: ['Thon albacore', 'Saumon', 'Dinde'] },
        { nom: 'Riz blanc', qte: 180, unite: 'g (cru)',
          rayon: 'Épicerie', emoji: '🍚',
          swaps: ['Riz complet', 'Quinoa', 'Patate douce'] },
        { nom: 'Brocoli', qte: 200, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🥦',
          swaps: ['Épinards', 'Haricots verts', 'Asperges'] },
        { nom: 'Sauce soja', qte: 15, unite: 'ml',
          rayon: 'Épicerie monde', emoji: '🍶',
          swaps: ['Sauce teriyaki', 'Jus de citron + sel'] }
      ],
      etapes: [
        'Cuire le riz 12min',
        'Griller le poulet assaisonné 8min de chaque côté',
        'Cuire le brocoli à la vapeur 5min',
        'Assembler le bowl et arroser de sauce soja',
        'Consommer dans les 30min après la séance'
      ]
    },

    {
      id: 'post_saumon_patate',
      nom: 'Saumon · Patate Douce',
      emoji: '🐟',
      type: 'post_seance',
      objectif: ['prise_masse', 'forme'],
      temps: 25,
      calories: 620,
      macros: { prot: 48, gluc: 60, lip: 18 },
      ingredients: [
        { nom: 'Pavé de saumon', qte: 180, unite: 'g',
          rayon: 'Poissonnerie', emoji: '🐟',
          swaps: ['Thon steak', 'Cabillaud', 'Truite'] },
        { nom: 'Patate douce', qte: 250, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🍠',
          swaps: ['Pomme de terre', 'Riz complet', 'Quinoa'] },
        { nom: 'Épinards frais', qte: 100, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🥬',
          swaps: ['Roquette', 'Mâche', 'Brocoli'] },
        { nom: 'Citron', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🍋',
          swaps: ['Vinaigre balsamique', 'Sauce yaourt'] }
      ],
      etapes: [
        'Préchauffer le four à 200°C',
        'Couper la patate douce en cubes et enfourner 20min',
        'Saisir le saumon à la poêle 3min de chaque côté',
        'Faire tomber les épinards à la poêle 2min',
        'Dresser et presser le citron sur le saumon'
      ]
    },

    {
      id: 'post_shake_recuperation',
      nom: 'Shake Récupération Express',
      emoji: '🥤',
      type: 'post_seance',
      objectif: ['prise_masse', 'force'],
      temps: 3,
      calories: 420,
      macros: { prot: 48, gluc: 50, lip: 4 },
      ingredients: [
        { nom: 'Whey protéine', qte: 40, unite: 'g',
          rayon: 'Nutrition sport', emoji: '🥛',
          swaps: ['Caséine', 'Fromage blanc (250g)'] },
        { nom: 'Banane congelée', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🍌',
          swaps: ['Mangue', 'Fruits rouges', 'Datte'] },
        { nom: 'Lait écrémé', qte: 250, unite: 'ml',
          rayon: 'Crèmerie', emoji: '🥛',
          swaps: ['Lait d\'amande', 'Eau', 'Lait de soja'] },
        { nom: 'Flocons d\'avoine', qte: 40, unite: 'g',
          rayon: 'Épicerie', emoji: '🌾',
          swaps: ['Pain de mie complet (2 tranches)'] }
      ],
      etapes: [
        'Mettre tous les ingrédients dans le blender',
        'Mixer 30 secondes',
        'Boire immédiatement après la séance'
      ]
    },

    // ── DÉJEUNER ─────────────────────────────────────────
    {
      id: 'dej_bowl_thon',
      nom: 'Bowl Thon & Quinoa',
      emoji: '🥙',
      type: 'dejeuner',
      objectif: ['prise_masse', 'seche'],
      temps: 15,
      calories: 580,
      macros: { prot: 52, gluc: 62, lip: 10 },
      ingredients: [
        { nom: 'Thon en boîte (eau)', qte: 2, unite: 'boîtes',
          rayon: 'Épicerie', emoji: '🐟',
          swaps: ['Poulet émincé', 'Crevettes', 'Saumon fumé'] },
        { nom: 'Quinoa', qte: 150, unite: 'g (cru)',
          rayon: 'Épicerie bio', emoji: '🌾',
          swaps: ['Riz complet', 'Boulgour', 'Lentilles'] },
        { nom: 'Avocat', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🥑',
          swaps: ['Houmous 60g', 'Olive 30g'] },
        { nom: 'Maïs', qte: 80, unite: 'g',
          rayon: 'Épicerie', emoji: '🌽',
          swaps: ['Pois chiches', 'Haricots rouges'] },
        { nom: 'Sauce yaourt citron', qte: 50, unite: 'g',
          rayon: 'Crèmerie', emoji: '🥛',
          swaps: ['Vinaigrette', 'Sauce soja + citron'] }
      ],
      etapes: [
        'Cuire le quinoa 12min à l\'eau salée',
        'Égoutter le thon',
        'Couper l\'avocat en cubes',
        'Assembler le bowl avec tous les ingrédients',
        'Assaisonner avec la sauce yaourt citron'
      ]
    },

    {
      id: 'dej_pates_boeuf',
      nom: 'Pâtes Bœuf & Tomates',
      emoji: '🍝',
      type: 'dejeuner',
      objectif: ['prise_masse', 'force'],
      temps: 20,
      calories: 720,
      macros: { prot: 55, gluc: 85, lip: 14 },
      ingredients: [
        { nom: 'Pâtes complètes', qte: 180, unite: 'g (cru)',
          rayon: 'Épicerie', emoji: '🍝',
          swaps: ['Pâtes blanches', 'Riz', 'Quinoa'] },
        { nom: 'Bœuf haché 5%', qte: 200, unite: 'g',
          rayon: 'Boucherie', emoji: '🥩',
          swaps: ['Dinde hachée', 'Blanc de poulet haché',
                  'Lentilles corail'] },
        { nom: 'Sauce tomate', qte: 150, unite: 'g',
          rayon: 'Épicerie', emoji: '🍅',
          swaps: ['Tomates fraîches + basilic', 'Coulis'] },
        { nom: 'Oignon', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🧅',
          swaps: ['Échalote', 'Poireau'] },
        { nom: 'Ail', qte: 2, unite: 'gousses',
          rayon: 'Fruits & Légumes', emoji: '🧄',
          swaps: ['Ail en poudre', 'Échalote'] }
      ],
      etapes: [
        'Faire revenir oignon et ail 3min',
        'Ajouter le bœuf haché et cuire 5min',
        'Incorporer la sauce tomate et mijoter 10min',
        'Cuire les pâtes al dente',
        'Mélanger et servir'
      ]
    },

    // ── COLLATION ────────────────────────────────────────
    {
      id: 'col_fromage_fruits',
      nom: 'Fromage Blanc & Fruits',
      emoji: '🍓',
      type: 'collation',
      objectif: ['prise_masse', 'forme'],
      temps: 3,
      calories: 280,
      macros: { prot: 28, gluc: 30, lip: 2 },
      ingredients: [
        { nom: 'Fromage blanc 0%', qte: 250, unite: 'g',
          rayon: 'Crèmerie', emoji: '🥛',
          swaps: ['Yaourt grec', 'Skyr', 'Cottage cheese'] },
        { nom: 'Fruits rouges surgelés', qte: 100, unite: 'g',
          rayon: 'Surgelés', emoji: '🍓',
          swaps: ['Banane', 'Pomme', 'Pêche', 'Kiwi'] },
        { nom: 'Miel', qte: 10, unite: 'g',
          rayon: 'Épicerie', emoji: '🍯',
          swaps: ['Sirop d\'agave', 'Confiture 0%'] }
      ],
      etapes: [
        'Décongeler les fruits 5min',
        'Mélanger fromage blanc et miel',
        'Ajouter les fruits et servir'
      ]
    },

    {
      id: 'col_amandes_proteines',
      nom: 'Amandes & Shake Protéiné',
      emoji: '🥜',
      type: 'collation',
      objectif: ['prise_masse', 'force'],
      temps: 2,
      calories: 320,
      macros: { prot: 32, gluc: 18, lip: 14 },
      ingredients: [
        { nom: 'Amandes', qte: 30, unite: 'g',
          rayon: 'Épicerie', emoji: '🥜',
          swaps: ['Noix de cajou', 'Noix', 'Pistaches'] },
        { nom: 'Whey protéine', qte: 30, unite: 'g',
          rayon: 'Nutrition sport', emoji: '🥛',
          swaps: ['Fromage blanc 200g', 'Yaourt grec'] },
        { nom: 'Eau', qte: 250, unite: 'ml',
          rayon: '', emoji: '💧',
          swaps: ['Lait écrémé', 'Lait d\'amande'] }
      ],
      etapes: [
        'Préparer le shaker avec whey + eau',
        'Secouer 10 secondes',
        'Consommer avec les amandes'
      ]
    },

    // ── DÎNER ────────────────────────────────────────────
    {
      id: 'din_poulet_legumes',
      nom: 'Poulet Rôti & Légumes Four',
      emoji: '🍖',
      type: 'diner',
      objectif: ['prise_masse', 'forme'],
      temps: 30,
      calories: 580,
      macros: { prot: 55, gluc: 45, lip: 14 },
      ingredients: [
        { nom: 'Cuisses de poulet', qte: 250, unite: 'g',
          rayon: 'Boucherie / Volaille', emoji: '🍗',
          swaps: ['Blanc de poulet', 'Dinde', 'Cabillaud'] },
        { nom: 'Poivrons', qte: 2, unite: 'pièces',
          rayon: 'Fruits & Légumes', emoji: '🫑',
          swaps: ['Courgette', 'Aubergine', 'Champignons'] },
        { nom: 'Patate douce', qte: 200, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🍠',
          swaps: ['Pomme de terre', 'Riz', 'Quinoa'] },
        { nom: 'Herbes de Provence', qte: 5, unite: 'g',
          rayon: 'Épicerie', emoji: '🌿',
          swaps: ['Paprika + cumin', 'Curry', 'Origan'] },
        { nom: 'Huile d\'olive', qte: 15, unite: 'ml',
          rayon: 'Épicerie', emoji: '🫒',
          swaps: ['Huile de coco', 'Beurre clarifié'] }
      ],
      etapes: [
        'Préchauffer le four à 200°C',
        'Couper légumes en morceaux et assaisonner',
        'Enfourner légumes 15min',
        'Ajouter le poulet et cuire encore 20min',
        'Vérifier la cuisson et servir'
      ]
    },

    {
      id: 'din_omelette_proteines',
      nom: 'Omelette Géante Protéinée',
      emoji: '🍳',
      type: 'diner',
      objectif: ['prise_masse', 'seche'],
      temps: 12,
      calories: 480,
      macros: { prot: 50, gluc: 15, lip: 22 },
      ingredients: [
        { nom: 'Œufs entiers', qte: 4, unite: 'pièces',
          rayon: 'Crèmerie', emoji: '🥚',
          swaps: ['2 œufs + 4 blancs', '6 blancs d\'œufs'] },
        { nom: 'Blanc de poulet cuit', qte: 100, unite: 'g',
          rayon: 'Boucherie / Volaille', emoji: '🍗',
          swaps: ['Thon émietté', 'Crevettes', 'Saumon fumé'] },
        { nom: 'Épinards', qte: 80, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🥬',
          swaps: ['Champignons', 'Poivron', 'Courgette'] },
        { nom: 'Fromage râpé allégé', qte: 30, unite: 'g',
          rayon: 'Crèmerie', emoji: '🧀',
          swaps: ['Feta', 'Ricotta', 'Sans fromage'] }
      ],
      etapes: [
        'Battre les œufs avec sel et poivre',
        'Faire revenir les épinards 2min',
        'Verser les œufs et cuire à feu moyen',
        'Ajouter poulet et fromage',
        'Plier l\'omelette et servir'
      ]
    },

    {
      id: 'din_cabillaud_riz',
      nom: 'Cabillaud Vapeur & Riz',
      emoji: '🐟',
      type: 'diner',
      objectif: ['prise_masse', 'seche'],
      temps: 20,
      calories: 520,
      macros: { prot: 52, gluc: 58, lip: 5 },
      ingredients: [
        { nom: 'Filet de cabillaud', qte: 200, unite: 'g',
          rayon: 'Poissonnerie', emoji: '🐟',
          swaps: ['Lieu noir', 'Merlu', 'Tilapia', 'Saumon'] },
        { nom: 'Riz basmati', qte: 150, unite: 'g (cru)',
          rayon: 'Épicerie', emoji: '🍚',
          swaps: ['Riz complet', 'Quinoa', 'Boulgour'] },
        { nom: 'Brocoli', qte: 200, unite: 'g',
          rayon: 'Fruits & Légumes', emoji: '🥦',
          swaps: ['Haricots verts', 'Asperges', 'Courgette'] },
        { nom: 'Citron', qte: 1, unite: 'pièce',
          rayon: 'Fruits & Légumes', emoji: '🍋',
          swaps: ['Sauce soja légère', 'Vinaigrette'] }
      ],
      etapes: [
        'Cuire le riz basmati 12min',
        'Cuire le cabillaud à la vapeur 8min',
        'Cuire le brocoli à la vapeur 5min',
        'Presser le citron sur le poisson',
        'Servir et assaisonner'
      ]
    }
  ],

  // ════════════════════════════════════════════════════════
  // PLAN SEMAINE — 5 jours d'entraînement
  // ════════════════════════════════════════════════════════
  PLAN_SEMAINE_DEFAULT: {
    lundi:    { entrainement: true,  type: 'chest_epaules',
      repas: ['pdj_oatmeal_whey','pre_riz_poulet',
               'post_poulet_riz_brocoli','col_fromage_fruits',
               'din_poulet_legumes'] },
    mardi:    { entrainement: true,  type: 'dos_biceps',
      repas: ['pdj_oeufs_toast','pre_banane_oats',
               'post_saumon_patate','col_amandes_proteines',
               'din_omelette_proteines'] },
    mercredi: { entrainement: true,  type: 'jambes_abdos',
      repas: ['pdj_pancakes_prot','pre_riz_poulet',
               'post_shake_recuperation','dej_bowl_thon',
               'din_cabillaud_riz'] },
    jeudi:    { entrainement: true,  type: 'epaules_triceps',
      repas: ['pdj_oatmeal_whey','pre_banane_oats',
               'post_poulet_riz_brocoli','col_fromage_fruits',
               'din_poulet_legumes'] },
    vendredi: { entrainement: true,  type: 'full_haut_abdos',
      repas: ['pdj_oeufs_toast','pre_riz_poulet',
               'post_saumon_patate','col_amandes_proteines',
               'din_omelette_proteines'] },
    samedi:   { entrainement: false, type: 'repos',
      repas: ['pdj_oatmeal_whey','dej_pates_boeuf',
               'col_fromage_fruits','din_cabillaud_riz'] },
    dimanche: { entrainement: false, type: 'repos',
      repas: ['pdj_pancakes_prot','dej_bowl_thon',
               'col_amandes_proteines','din_poulet_legumes'] }
  },

  // ════════════════════════════════════════════════════════
  // CALCULS OBJECTIFS
  // ════════════════════════════════════════════════════════
  calculerObjectifsAuto() {
    let profil = { poids:80, taille:175,
      objectif:'prise_masse', niveau:'intermediaire' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const poids  = profil.poids  || 80;
    const taille = profil.taille || 175;
    const bmr    = Math.round(10*poids + 6.25*taille - 5*25 + 5);
    const activ  = { debutant:1.375,
      intermediaire:1.55, avance:1.725 }[profil.niveau] || 1.55;
    const tdee   = Math.round(bmr * activ);

    const calories  = tdee + 300; // surplus prise de masse
    const proteines = Math.round(poids * 2.2);
    const lipides   = Math.round(calories * 0.25 / 9);
    const glucides  = Math.round(
      (calories - proteines*4 - lipides*9) / 4
    );

    return {
      calories, proteines, glucides, lipides,
      eau: Math.round(poids * 0.035 * 10) / 10
    };
  },

  getObjectifs() {
    const auto   = this.calculerObjectifsAuto();
    const custom = Utils.storage.get(this.CLE.OBJECTIFS(), null);
    return custom || auto;
  },

  // ════════════════════════════════════════════════════════
  // EXCLUSIONS
  // ════════════════════════════════════════════════════════
  getExclusions() {
    return Utils.storage.get(
      this.CLE.EXCLUSIONS(),
      this.EXCLUSIONS_DEFAULT
    );
  },

  _recetteValide(recette) {
    const exclusions = this.getExclusions();
    return !recette.ingredients.some(ing =>
      exclusions.some(ex =>
        ing.nom.toLowerCase().includes(ex.toLowerCase())
      )
    );
  },

  // ════════════════════════════════════════════════════════
  // EAU
  // ════════════════════════════════════════════════════════
  getEau(date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(this.CLE.EAU(d), 0);
  },

  ajouterEau(ml, date = null) {
    const d      = date || Utils.aujourd_hui();
    const actuel = this.getEau(d);
    const nouveau = Math.min(actuel + ml, 5000);
    Utils.storage.set(this.CLE.EAU(d), nouveau);
    return nouveau;
  },

  // ════════════════════════════════════════════════════════
  // GÉNÉRATEUR LISTE DE COURSES
  // ════════════════════════════════════════════════════════
  genererListeCourses() {
    const plan    = this.PLAN_SEMAINE_DEFAULT;
    const courses = {};
    const rayons  = {};

    // Parcourir tous les repas de la semaine
    Object.values(plan).forEach(jour => {
      jour.repas.forEach(repasId => {
        const recette = this.RECETTES.find(r => r.id === repasId);
        if (!recette) return;

        recette.ingredients.forEach(ing => {
          // Ignorer eau et ingrédients exclus
          if (!ing.rayon) return;
          const exclusions = this.getExclusions();
          if (exclusions.some(ex =>
            ing.nom.toLowerCase().includes(ex.toLowerCase())
          )) return;

          const key = ing.nom.toLowerCase().trim();

          if (courses[key]) {
            // Additionner les quantités si même unité
            if (courses[key].unite === ing.unite) {
              courses[key].qte += ing.qte;
            }
          } else {
            courses[key] = {
              nom:    ing.nom,
              qte:    ing.qte,
              unite:  ing.unite,
              rayon:  ing.rayon,
              emoji:  ing.emoji,
              coche:  false
            };
          }

          // Indexer par rayon
          if (!rayons[ing.rayon]) rayons[ing.rayon] = [];
          if (!rayons[ing.rayon].includes(key)) {
            rayons[ing.rayon].push(key);
          }
        });
      });
    });

    return { courses, rayons };
  },

  getCourses() {
    return Utils.storage.get(this.CLE.COURSES(), null);
  },

  sauvegarderCourses(courses) {
    Utils.storage.set(this.CLE.COURSES(), courses);
  },

  cocherArticle(nom) {
    const data = this.getCourses();
    if (!data) return;
    const key = nom.toLowerCase().trim();
    if (data.courses[key]) {
      data.courses[key].coche = !data.courses[key].coche;
      this.sauvegarderCourses(data);
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  _tabActif: 'dashboard',

  render(container) {
    if (!container) return;

    const tabs = [
      { id:'dashboard',  label:'🏠 Accueil'  },
      { id:'recettes',   label:'🍽️ Recettes'  },
      { id:'semaine',    label:'📅 Semaine'   },
      { id:'courses',    label:'🛒 Courses'   },
      { id:'objectifs',  label:'🎯 Objectifs' }
    ];

    container.innerHTML = `
      <div style="overflow-x:auto;display:flex;gap:4px;
                  padding:0 0 8px;scrollbar-width:none">
        ${tabs.map(t => `
          <button class="tab-btn
                  ${this._tabActif === t.id ? 'active' : ''}"
                  onclick="Nutrition._setTab('${t.id}')"
                  style="white-space:nowrap;flex-shrink:0;
                         font-size:.72rem">
            ${t.label}
          </button>`).join('')}
      </div>
      <div id="nutrition-content"></div>
    `;

    this._renderTab();
  },

  _setTab(tab) {
    this._tabActif = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.textContent.trim().includes(
        { dashboard:'Accueil', recettes:'Recettes',
          semaine:'Semaine', courses:'Courses',
          objectifs:'Objectifs' }[tab] || ''
      )) btn.classList.add('active');
    });
    this._renderTab();
  },

  _renderTab() {
    const el = document.getElementById('nutrition-content');
    if (!el) return;
    switch(this._tabActif) {
      case 'dashboard':  this._renderDashboard(el);  break;
      case 'recettes':   this._renderRecettes(el);   break;
      case 'semaine':    this._renderSemaine(el);     break;
      case 'courses':    this._renderCourses(el);     break;
      case 'objectifs':  this._renderObjectifs(el);   break;
    }
  },

  // ════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════
  _renderDashboard(el) {
    const obj  = this.getObjectifs();
    const eau  = this.getEau();
    const eauObj = Math.round(obj.eau * 1000);
    const pctEau = Math.min(100,
      Math.round((eau / eauObj) * 100)
    );

    // Repas du jour selon le jour de la semaine
    const jours  = ['dimanche','lundi','mardi','mercredi',
                    'jeudi','vendredi','samedi'];
    const today  = jours[new Date().getDay()];
    const planJour = this.PLAN_SEMAINE_DEFAULT[today];
    const repasJour = (planJour?.repas || [])
      .map(id => this.RECETTES.find(r => r.id === id))
      .filter(Boolean);

    const totalJour = repasJour.reduce((acc, r) => ({
      cal:  acc.cal  + r.calories,
      prot: acc.prot + r.macros.prot,
      gluc: acc.gluc + r.macros.gluc,
      lip:  acc.lip  + r.macros.lip
    }), { cal:0, prot:0, gluc:0, lip:0 });

    const isEntrainement = planJour?.entrainement || false;

    el.innerHTML = `

      <!-- Badge jour -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  margin-bottom:var(--space-md)">
        <div style="font-size:.82rem;font-weight:700;
                    color:var(--text-secondary)">
          📅 ${today.charAt(0).toUpperCase() + today.slice(1)}
          ${isEntrainement
            ? '<span style="margin-left:8px;padding:3px 8px;background:rgba(75,75,249,0.15);border:1px solid rgba(75,75,249,0.3);border-radius:99px;font-size:.65rem;color:var(--fd-indigo)">💪 Jour entraînement</span>'
            : '<span style="margin-left:8px;padding:3px 8px;background:rgba(139,240,187,0.1);border:1px solid rgba(139,240,187,0.2);border-radius:99px;font-size:.65rem;color:var(--fd-mint)">😴 Jour repos</span>'}
        </div>
      </div>

      <!-- Macros objectifs -->
      <div class="card mb-md">
        <div class="card-label">🎯 Objectifs du jour</div>
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:var(--space-xs);
                    margin-top:var(--space-sm)">
          ${[
            { label:'Calories',  val:totalJour.cal,
              obj:obj.calories,  color:'var(--fd-lemon)', unit:'kcal' },
            { label:'Protéines', val:totalJour.prot,
              obj:obj.proteines, color:'var(--fd-coral)', unit:'g' },
            { label:'Glucides',  val:totalJour.gluc,
              obj:obj.glucides,  color:'var(--fd-mint)', unit:'g' },
            { label:'Lipides',   val:totalJour.lip,
              obj:obj.lipides,   color:'var(--fd-lavender)', unit:'g' }
          ].map(m => `
            <div style="text-align:center;padding:var(--space-sm) 4px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
              <div style="font-size:.85rem;font-weight:800;
                          color:${m.color};line-height:1">
                ${m.val}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          margin-top:2px">
                / ${m.obj}${m.unit}
              </div>
              <div style="font-size:.58rem;color:var(--text-muted)">
                ${m.label}
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Repas du jour -->
      <div class="card mb-md">
        <div class="card-label">🍽️ Repas du jour</div>
        <div style="display:flex;flex-direction:column;
                    gap:6px;margin-top:var(--space-sm)">
          ${repasJour.map(r => `
            <div onclick="Nutrition._ouvrirRecette('${r.id}')"
                 style="display:flex;align-items:center;
                        gap:10px;padding:10px 12px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        border:1px solid var(--border-color);
                        cursor:pointer">
              <div style="width:38px;height:38px;
                          border-radius:10px;
                          background:rgba(75,75,249,0.1);
                          border:1px solid rgba(75,75,249,0.2);
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:1.1rem;flex-shrink:0">
                ${r.emoji}
              </div>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">
                  ${r.nom}
                </div>
                <div style="font-size:.62rem;
                            color:var(--text-muted);margin-top:1px">
                  ${this._typeLabel(r.type)} ·
                  ⏱ ${r.temps}min
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:.78rem;font-weight:700;
                            color:var(--fd-lemon)">
                  ${r.calories}kcal
                </div>
                <div style="font-size:.6rem;
                            color:var(--fd-coral)">
                  P:${r.macros.prot}g
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Eau -->
      <div class="card mb-md">
        <div class="flex justify-between items-center mb-sm">
          <div class="card-label" style="margin:0">
            💧 Hydratation
          </div>
          <div style="font-size:.78rem;font-weight:700;
                      color:var(--fd-indigo)">
            ${(eau/1000).toFixed(1)}L / ${obj.eau}L
            (${pctEau}%)
          </div>
        </div>
        <div style="height:8px;background:var(--bg-input);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:var(--space-sm)">
          <div style="height:100%;width:${pctEau}%;
                      background:var(--fd-indigo);
                      border-radius:99px;
                      transition:width .8s ease">
          </div>
        </div>
        <div style="display:flex;gap:6px">
          ${[250,500,750].map(ml => `
            <button onclick="Nutrition._ajouterEauRapide(${ml})"
                    style="flex:1;padding:8px 4px;
                           font-size:.72rem;font-weight:700;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:var(--radius-full);
                           color:var(--fd-indigo);cursor:pointer">
              +${ml}ml
            </button>`).join('')}
        </div>
      </div>

      <!-- Conseil nutrition -->
      ${this._getConseil(isEntrainement, totalJour, obj)}
    `;
  },

  // ════════════════════════════════════════════════════════
  // RECETTES
  // ════════════════════════════════════════════════════════
  _renderRecettes(el) {
    const types = [
      { id:'tous',           label:'Tout'       },
      { id:'petit_dejeuner', label:'🌅 Matin'   },
      { id:'pre_seance',     label:'⚡ Pré'     },
      { id:'post_seance',    label:'💪 Post'    },
      { id:'dejeuner',       label:'☀️ Déj.'    },
      { id:'collation',      label:'🍎 Collat.' },
      { id:'diner',          label:'🌙 Dîner'   }
    ];

    const filtreActif = this._filtreRecette || 'tous';

    const recettesFiltrees = this.RECETTES.filter(r => {
      if (!this._recetteValide(r)) return false;
      if (filtreActif === 'tous') return true;
      return r.type === filtreActif;
    });

    el.innerHTML = `

      <!-- Filtres -->
      <div style="display:flex;gap:5px;overflow-x:auto;
                  padding-bottom:8px;margin-bottom:var(--space-md);
                  scrollbar-width:none">
        ${types.map(t => `
          <button onclick="Nutrition._filtrerRecettes('${t.id}')"
                  style="flex-shrink:0;padding:6px 12px;
                         font-size:.7rem;font-weight:700;
                         border-radius:99px;cursor:pointer;
                         background:${filtreActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'var(--bg-input)'};
                         color:${filtreActif === t.id
                           ? 'white'
                           : 'var(--text-muted)'};
                         border:1px solid ${filtreActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'var(--border-color)'}">
            ${t.label}
          </button>`).join('')}
      </div>

      <!-- Liste recettes -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${recettesFiltrees.map(r => `
          <div class="card"
               onclick="Nutrition._ouvrirRecette('${r.id}')"
               style="cursor:pointer">
            <div style="display:flex;gap:12px;
                        align-items:flex-start">
              <div style="width:54px;height:54px;
                          border-radius:14px;
                          background:rgba(75,75,249,0.1);
                          border:1px solid rgba(75,75,249,0.2);
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:1.6rem;flex-shrink:0">
                ${r.emoji}
              </div>
              <div style="flex:1">
                <div style="font-weight:700;font-size:.92rem">
                  ${r.nom}
                </div>
                <div style="font-size:.68rem;
                            color:var(--text-muted);margin-top:2px">
                  ${this._typeLabel(r.type)} · ⏱ ${r.temps}min
                </div>
                <div style="display:flex;gap:8px;
                            margin-top:6px;flex-wrap:wrap">
                  <span style="font-size:.68rem;font-weight:700;
                               color:var(--fd-lemon)">
                    ${r.calories} kcal
                  </span>
                  <span style="font-size:.65rem;
                               color:var(--fd-coral)">
                    💪 ${r.macros.prot}g
                  </span>
                  <span style="font-size:.65rem;
                               color:var(--fd-mint)">
                    ⚡ ${r.macros.gluc}g
                  </span>
                  <span style="font-size:.65rem;
                               color:var(--fd-lavender)">
                    🧈 ${r.macros.lip}g
                  </span>
                </div>
              </div>
              <div style="flex-shrink:0;font-size:.7rem;
                          color:var(--text-muted)">
                ${r.ingredients.length} ingr. ›
              </div>
            </div>
          </div>`).join('')}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // SEMAINE
  // ════════════════════════════════════════════════════════
  _renderSemaine(el) {
    const jours = ['lundi','mardi','mercredi',
                   'jeudi','vendredi','samedi','dimanche'];
    const jourLabels = {
      lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi',
      jeudi:'Jeudi', vendredi:'Vendredi',
      samedi:'Samedi', dimanche:'Dimanche'
    };
    const today = ['dimanche','lundi','mardi','mercredi',
                   'jeudi','vendredi','samedi'][new Date().getDay()];

    el.innerHTML = `
      <div class="card mb-md"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div style="font-size:.82rem;color:var(--text-secondary);
                    line-height:1.6">
          📅 Plan nutritionnel sur
          <strong style="color:var(--fd-indigo)">5 jours
          d'entraînement</strong> + 2 jours de repos.<br>
          Adapté <strong style="color:var(--fd-mint)">
          prise de masse · haut du corps</strong>.
        </div>
      </div>

      ${jours.map(jour => {
        const planJour = this.PLAN_SEMAINE_DEFAULT[jour];
        const isToday  = jour === today;
        const repas    = (planJour?.repas || [])
          .map(id => this.RECETTES.find(r => r.id === id))
          .filter(Boolean);

        const totalCal  = repas.reduce(
          (a, r) => a + r.calories, 0
        );
        const totalProt = repas.reduce(
          (a, r) => a + r.macros.prot, 0
        );

        return `
          <div class="card mb-md"
               style="${isToday
                 ? 'border-color:var(--fd-indigo);'
                   + 'background:rgba(75,75,249,0.05)' : ''}">
            <div style="display:flex;justify-content:space-between;
                        align-items:center;margin-bottom:10px">
              <div>
                <div style="font-weight:700;font-size:.92rem;
                            display:flex;align-items:center;gap:6px">
                  ${jourLabels[jour]}
                  ${isToday
                    ? '<span style="padding:2px 7px;background:var(--fd-indigo);border-radius:99px;font-size:.6rem;color:white">Aujourd\'hui</span>'
                    : ''}
                </div>
                <div style="font-size:.68rem;
                            color:var(--text-muted);margin-top:1px">
                  ${planJour?.entrainement
                    ? '💪 Entraînement · ' + this._typeSeance(
                        planJour.type
                      )
                    : '😴 Repos'}
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-lemon)">
                  ${totalCal} kcal
                </div>
                <div style="font-size:.65rem;
                            color:var(--fd-coral)">
                  💪 ${totalProt}g prot.
                </div>
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:5px">
              ${repas.map(r => `
                <div onclick="Nutrition._ouvrirRecette('${r.id}')"
                     style="display:flex;align-items:center;
                            gap:8px;padding:8px 10px;
                            background:var(--bg-input);
                            border-radius:var(--radius-sm);
                            border:1px solid var(--border-color);
                            cursor:pointer">
                  <span style="font-size:1rem">${r.emoji}</span>
                  <div style="flex:1">
                    <div style="font-size:.75rem;font-weight:600">
                      ${r.nom}
                    </div>
                    <div style="font-size:.6rem;
                                color:var(--text-muted)">
                      ${this._typeLabel(r.type)}
                    </div>
                  </div>
                  <div style="font-size:.7rem;
                              color:var(--fd-lemon);font-weight:700">
                    ${r.calories}kcal
                  </div>
                </div>`).join('')}
            </div>
          </div>`;
      }).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // COURSES E.LECLERC
  // ════════════════════════════════════════════════════════
  _renderCourses(el) {
    let data = this.getCourses();

    // Générer si pas encore fait
    if (!data) {
      data = this.genererListeCourses();
      this.sauvegarderCourses(data);
    }

    const { courses, rayons } = data;

    // Ordre des rayons comme en magasin
    const ordreRayons = [
      'Fruits & Légumes',
      'Boucherie / Volaille',
      'Boucherie',
      'Poissonnerie',
      'Crèmerie',
      'Boulangerie',
      'Épicerie',
      'Épicerie bio',
      'Épicerie monde',
      'Surgelés',
      'Nutrition sport'
    ];

    const rayonsOrdonnes = [
      ...ordreRayons.filter(r => rayons[r]),
      ...Object.keys(rayons).filter(r => !ordreRayons.includes(r))
    ];

    const total      = Object.keys(courses).length;
    const cochees    = Object.values(courses)
      .filter(c => c.coche).length;
    const pctDone    = Math.round((cochees / Math.max(total, 1)) * 100);

    el.innerHTML = `

      <!-- Header courses -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(139,240,187,0.1),
                  rgba(75,75,249,0.05));
                  border-color:rgba(139,240,187,0.2)">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:8px">
          <div>
            <div style="font-weight:700;font-size:.95rem">
              🛒 E.Leclerc — Cette semaine
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);
                        margin-top:2px">
              ${cochees}/${total} articles · ${pctDone}%
            </div>
          </div>
          <button onclick="Nutrition._regenererCourses()"
                  style="padding:6px 12px;
                         background:rgba(75,75,249,0.1);
                         border:1px solid rgba(75,75,249,0.2);
                         border-radius:var(--radius-full);
                         font-size:.7rem;font-weight:700;
                         color:var(--fd-indigo);cursor:pointer">
            🔄 Regénérer
          </button>
        </div>

        <!-- Barre progression -->
        <div style="height:6px;background:var(--bg-input);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:var(--space-sm)">
          <div style="height:100%;width:${pctDone}%;
                      background:var(--fd-mint);
                      border-radius:99px;
                      transition:width .5s ease">
          </div>
        </div>

        <!-- Boutons action -->
        <div style="display:flex;gap:6px">
          <button onclick="Nutrition._copierCourses()"
                  style="flex:1;padding:8px;
                         background:rgba(75,75,249,0.1);
                         border:1px solid rgba(75,75,249,0.2);
                         border-radius:var(--radius-sm);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-indigo);cursor:pointer">
            📋 Copier la liste
          </button>
          <button onclick="Nutrition._toutDecocher()"
                  style="flex:1;padding:8px;
                         background:var(--bg-input);
                         border:1px solid var(--border-color);
                         border-radius:var(--radius-sm);
                         font-size:.72rem;font-weight:700;
                         color:var(--text-muted);cursor:pointer">
            🔄 Tout décocher
          </button>
        </div>
      </div>

      <!-- Liste par rayon -->
      ${rayonsOrdonnes.map(rayon => {
        const articlesRayon = rayons[rayon]
          .map(key => courses[key])
          .filter(Boolean)
          .sort((a, b) => a.coche - b.coche);

        if (!articlesRayon.length) return '';

        const rayonCochees = articlesRayon
          .filter(a => a.coche).length;
        const rayonTotal   = articlesRayon.length;
        const rayonDone    = rayonCochees === rayonTotal;

        return `
          <div class="card mb-md"
               style="${rayonDone
                 ? 'opacity:.5;'
                 : ''}">
            <div style="display:flex;justify-content:space-between;
                        align-items:center;margin-bottom:10px">
              <div class="card-label" style="margin:0">
                ${this._emojiRayon(rayon)} ${rayon}
              </div>
              <div style="font-size:.65rem;
                          color:var(--text-muted)">
                ${rayonCochees}/${rayonTotal}
                ${rayonDone ? '✅' : ''}
              </div>
            </div>

            ${articlesRayon.map(article => `
              <div onclick="Nutrition._cocherArticle('${article.nom}')"
                   style="display:flex;align-items:center;
                          gap:10px;padding:10px 0;
                          border-bottom:1px solid var(--border-color);
                          cursor:pointer;
                          opacity:${article.coche ? '.4' : '1'}">

                <!-- Checkbox -->
                <div style="width:22px;height:22px;
                            border-radius:6px;flex-shrink:0;
                            background:${article.coche
                              ? 'var(--fd-mint)'
                              : 'var(--bg-input)'};
                            border:2px solid ${article.coche
                              ? 'var(--fd-mint)'
                              : 'var(--border-color)'};
                            display:flex;align-items:center;
                            justify-content:center;
                            font-size:.75rem;
                            transition:all .2s">
                  ${article.coche ? '✓' : ''}
                </div>

                <span style="font-size:.9rem;margin-right:4px">
                  ${article.emoji}
                </span>

                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:600;
                              text-decoration:${article.coche
                                ? 'line-through'
                                : 'none'}">
                    ${article.nom}
                  </div>
                </div>

                <div style="font-size:.75rem;font-weight:700;
                            color:var(--fd-indigo);
                            flex-shrink:0;text-align:right">
                  ${this._formatQte(article.qte, article.unite)}
                </div>
              </div>`).join('')}
          </div>`;
      }).join('')}

      <!-- Budget estimé -->
      <div class="card mb-md"
           style="background:rgba(249,239,119,0.05);
                  border-color:rgba(249,239,119,0.2)">
        <div class="card-label"
             style="color:var(--fd-lemon)">
          💰 Budget estimé
        </div>
        <div style="font-size:1.4rem;font-weight:800;
                    color:var(--fd-lemon);margin-top:4px">
          ~${this._estimerBudget(courses)}€
          <span style="font-size:.75rem;color:var(--text-muted);
                       font-weight:400">/ semaine</span>
        </div>
        <div style="font-size:.72rem;color:var(--text-muted);
                    margin-top:4px">
          Estimation basée sur les prix moyens E.Leclerc
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS
  // ════════════════════════════════════════════════════════
  _renderObjectifs(el) {
    const auto = this.calculerObjectifsAuto();
    const obj  = this.getObjectifs();
    const excl = this.getExclusions();

    el.innerHTML = `

      <!-- Auto -->
      <div class="card mb-md"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div class="card-label">
          🤖 Calculé pour ton profil
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(2,1fr);
                    gap:var(--space-sm);
                    margin-top:var(--space-sm)">
          ${[
            { l:'Calories',  v:`${auto.calories} kcal`,
              c:'var(--fd-lemon)'    },
            { l:'Protéines', v:`${auto.proteines}g`,
              c:'var(--fd-coral)'   },
            { l:'Glucides',  v:`${auto.glucides}g`,
              c:'var(--fd-mint)'    },
            { l:'Lipides',   v:`${auto.lipides}g`,
              c:'var(--fd-lavender)'},
            { l:'Eau',       v:`${auto.eau}L`,
              c:'var(--fd-indigo)'  }
          ].map(s => `
            <div style="padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        text-align:center">
              <div style="font-size:.88rem;font-weight:800;
                          color:${s.c}">
                ${s.v}
              </div>
              <div style="font-size:.6rem;
                          color:var(--text-muted)">
                ${s.l}
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Personnaliser -->
      <div class="card mb-md">
        <div class="card-label">✏️ Personnaliser</div>
        ${[
          { id:'obj-cal',  l:'🔥 Calories (kcal)', v:obj.calories,  s:50   },
          { id:'obj-prot', l:'💪 Protéines (g)',    v:obj.proteines, s:5    },
          { id:'obj-gluc', l:'⚡ Glucides (g)',     v:obj.glucides,  s:5    },
          { id:'obj-lip',  l:'🧈 Lipides (g)',      v:obj.lipides,   s:2    },
          { id:'obj-eau',  l:'💧 Eau (L)',          v:obj.eau,       s:0.1  }
        ].map(f => `
          <div style="display:flex;align-items:center;
                      justify-content:space-between;
                      padding:var(--space-sm) 0;
                      border-bottom:1px solid var(--border-color)">
            <span style="font-size:.82rem">${f.l}</span>
            <input type="number" id="${f.id}" class="input"
                   value="${f.v}" step="${f.s}"
                   style="width:90px;text-align:center;
                          font-weight:700;font-size:.88rem;
                          padding:4px 8px" />
          </div>`).join('')}
        <button onclick="Nutrition._sauvegarderObjectifs()"
                class="btn-primary mt-md"
                style="width:100%">
          💾 Sauvegarder
        </button>
      </div>

      <!-- Exclusions alimentaires -->
      <div class="card mb-md">
        <div class="card-label">🚫 Exclusions alimentaires</div>
        <div style="font-size:.75rem;color:var(--text-muted);
                    margin-bottom:var(--space-sm)">
          Ces aliments ne seront jamais proposés
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;
                    margin-bottom:var(--space-sm)">
          ${excl.map(e => `
            <div style="display:flex;align-items:center;gap:4px;
                        padding:4px 10px;
                        background:rgba(255,141,150,0.1);
                        border:1px solid rgba(255,141,150,0.2);
                        border-radius:99px;font-size:.72rem;
                        color:var(--fd-coral)">
              ${e}
              <button onclick="Nutrition._retirerExclusion('${e}')"
                      style="background:none;border:none;
                             color:var(--fd-coral);cursor:pointer;
                             font-size:.8rem;line-height:1">
                ✕
              </button>
            </div>`).join('')}
        </div>
        <div style="display:flex;gap:var(--space-sm)">
          <input class="input" id="new-exclusion"
                 placeholder="Ajouter un aliment..."
                 style="flex:1;font-size:.82rem" />
          <button onclick="Nutrition._ajouterExclusion()"
                  class="btn-secondary"
                  style="font-size:.78rem;
                         padding:var(--space-sm)
                         var(--space-md)">
            + Ajouter
          </button>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // MODAL RECETTE DÉTAIL
  // ════════════════════════════════════════════════════════
  _ouvrirRecette(id) {
    const recette = this.RECETTES.find(r => r.id === id);
    if (!recette) return;

    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding:var(--space-sm)">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:var(--space-md)">
          <div style="font-size:2.5rem">${recette.emoji}</div>
          <div style="font-size:1.1rem;font-weight:800;
                      margin-top:6px">
            ${recette.nom}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-top:3px">
            ${this._typeLabel(recette.type)} ·
            ⏱ ${recette.temps} min
          </div>
        </div>

        <!-- Macros -->
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:var(--space-xs);
                    margin-bottom:var(--space-md)">
          ${[
            { l:'Calories', v:recette.calories+'kcal',
              c:'var(--fd-lemon)'    },
            { l:'Prot.',    v:recette.macros.prot+'g',
              c:'var(--fd-coral)'   },
            { l:'Gluc.',    v:recette.macros.gluc+'g',
              c:'var(--fd-mint)'    },
            { l:'Lip.',     v:recette.macros.lip+'g',
              c:'var(--fd-lavender)'}
          ].map(m => `
            <div style="text-align:center;
                        padding:var(--space-sm) 4px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
              <div style="font-size:.8rem;font-weight:800;
                          color:${m.c}">${m.v}</div>
              <div style="font-size:.58rem;
                          color:var(--text-muted)">${m.l}</div>
            </div>`).join('')}
        </div>

        <!-- Ingrédients avec swaps -->
        <div class="card-label mb-sm">
          🛒 Ingrédients & alternatives
        </div>
        ${recette.ingredients.map((ing, i) => `
          <div style="margin-bottom:8px">
            <div style="display:flex;align-items:center;
                        justify-content:space-between;
                        padding:10px 12px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        border:1px solid var(--border-color)">
              <div style="display:flex;align-items:center;
                          gap:8px">
                <span style="font-size:1rem">${ing.emoji}</span>
                <div>
                  <div style="font-size:.82rem;font-weight:600">
                    ${ing.nom}
                  </div>
                  <div style="font-size:.62rem;
                              color:var(--text-muted)">
                    ${this._formatQte(ing.qte, ing.unite)}
                  </div>
                </div>
              </div>
              ${ing.swaps?.length ? `
                <button onclick="Nutrition._toggleSwaps(${i})"
                        style="padding:4px 8px;font-size:.65rem;
                               font-weight:700;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.2);
                               border-radius:99px;
                               color:var(--fd-indigo);cursor:pointer">
                  🔄 Swap
                </button>` : ''}
            </div>

            <!-- Swaps -->
            ${ing.swaps?.length ? `
              <div id="swaps-${i}"
                   style="display:none;padding:6px 12px;
                          background:rgba(75,75,249,0.05);
                          border:1px solid rgba(75,75,249,0.15);
                          border-top:none;
                          border-radius:0 0 var(--radius-sm)
                          var(--radius-sm)">
                <div style="font-size:.62rem;
                            color:var(--fd-indigo);
                            font-weight:700;margin-bottom:4px">
                  Alternatives :
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:4px">
                  ${ing.swaps.map(s => `
                    <span style="padding:3px 8px;
                                 background:rgba(75,75,249,0.12);
                                 border:1px solid rgba(75,75,249,0.2);
                                 border-radius:99px;
                                 font-size:.68rem;
                                 color:var(--fd-lavender)">
                      ${s}
                    </span>`).join('')}
                </div>
              </div>` : ''}
          </div>`).join('')}

        <!-- Étapes -->
        <div class="card-label mb-sm mt-md">
          👨‍🍳 Préparation
        </div>
        ${recette.etapes.map((e, i) => `
          <div style="display:flex;gap:10px;
                      align-items:flex-start;
                      padding:8px 0;
                      border-bottom:1px solid var(--border-color)">
            <div style="width:22px;height:22px;
                        border-radius:6px;flex-shrink:0;
                        background:var(--fd-indigo);
                        display:flex;align-items:center;
                        justify-content:center;
                        font-size:.7rem;font-weight:800;
                        color:white">
              ${i+1}
            </div>
            <div style="font-size:.82rem;
                        color:var(--text-secondary);
                        line-height:1.5;padding-top:2px">
              ${e}
            </div>
          </div>`).join('')}

        <button onclick="document.getElementById(
                  'modal-info').classList.add('hidden')"
                class="btn-primary mt-md"
                style="width:100%">
          ✓ Fermer
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) {
      closeBtn.onclick = () => modal.classList.add('hidden');
    }
  },

  _toggleSwaps(idx) {
    const el = document.getElementById(`swaps-${idx}`);
    if (!el) return;
    el.style.display =
      el.style.display === 'none' ? 'block' : 'none';
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS
  // ════════════════════════════════════════════════════════
  _filtreRecette: 'tous',

  _filtrerRecettes(type) {
    this._filtreRecette = type;
    const el = document.getElementById('nutrition-content');
    if (el) this._renderRecettes(el);
  },

  _ajouterEauRapide(ml) {
    const nouveau = this.ajouterEau(ml);
    Utils.toast(
      `💧 +${ml}ml · Total ${(nouveau/1000).toFixed(1)}L`,
      'success', 1500
    );
    Utils.vibrerSuccess();
    const el = document.getElementById('nutrition-content');
    if (el) this._renderTab();
  },

  _cocherArticle(nom) {
    this.cocherArticle(nom);
    const el = document.getElementById('nutrition-content');
    if (el) this._renderCourses(el);
  },

  _regenererCourses() {
    const data = this.genererListeCourses();
    this.sauvegarderCourses(data);
    const el = document.getElementById('nutrition-content');
    if (el) this._renderCourses(el);
    Utils.toast('🛒 Liste régénérée !', 'success');
  },

  _toutDecocher() {
    const data = this.getCourses();
    if (!data) return;
    Object.keys(data.courses).forEach(key => {
      data.courses[key].coche = false;
    });
    this.sauvegarderCourses(data);
    const el = document.getElementById('nutrition-content');
    if (el) this._renderCourses(el);
  },

  _copierCourses() {
    const data = this.getCourses();
    if (!data) return;

    const ordreRayons = [
      'Fruits & Légumes','Boucherie / Volaille',
      'Boucherie','Poissonnerie','Crèmerie',
      'Boulangerie','Épicerie','Épicerie bio',
      'Épicerie monde','Surgelés','Nutrition sport'
    ];

    let texte = '🛒 COURSES E.LECLERC — PowerApp\n\n';

    ordreRayons.forEach(rayon => {
      if (!data.rayons[rayon]) return;
      texte += `── ${rayon} ──\n`;
      data.rayons[rayon].forEach(key => {
        const a = data.courses[key];
        if (a) {
          texte += `${a.coche ? '✓' : '□'} ${a.emoji} ${a.nom} — ${
            this._formatQte(a.qte, a.unite)}\n`;
        }
      });
      texte += '\n';
    });

    navigator.clipboard?.writeText(texte)
      .then(() => Utils.toast('📋 Liste copiée !', 'success'))
      .catch(() => Utils.toast('❌ Erreur copie', 'error'));
  },

  _sauvegarderObjectifs() {
    const cal  = parseFloat(
      document.getElementById('obj-cal')?.value);
    const prot = parseFloat(
      document.getElementById('obj-prot')?.value);
    const gluc = parseFloat(
      document.getElementById('obj-gluc')?.value);
    const lip  = parseFloat(
      document.getElementById('obj-lip')?.value);
    const eau  = parseFloat(
      document.getElementById('obj-eau')?.value);

    if ([cal,prot,gluc,lip,eau].some(isNaN)) {
      Utils.toast('Remplis tous les champs !', 'error');
      return;
    }

    Utils.storage.set(this.CLE.OBJECTIFS(), {
      calories: cal, proteines: prot,
      glucides: gluc, lipides: lip, eau
    });
    Utils.toast('✅ Objectifs sauvegardés !', 'success');
    Utils.vibrerSuccess();
  },

  _ajouterExclusion() {
    const input = document.getElementById('new-exclusion');
    const val   = input?.value?.trim().toLowerCase();
    if (!val) return;
    const excl = this.getExclusions();
    if (!excl.includes(val)) {
      excl.push(val);
      Utils.storage.set(this.CLE.EXCLUSIONS(), excl);
      Utils.toast(`🚫 "${val}" exclu !`, 'success');
    }
    if (input) input.value = '';
    const el = document.getElementById('nutrition-content');
    if (el) this._renderObjectifs(el);
  },

  _retirerExclusion(val) {
    const excl = this.getExclusions()
      .filter(e => e !== val);
    Utils.storage.set(this.CLE.EXCLUSIONS(), excl);
    const el = document.getElementById('nutrition-content');
    if (el) this._renderObjectifs(el);
    Utils.toast(`✅ "${val}" retiré des exclusions`, 'success');
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _typeLabel(type) {
    return {
      petit_dejeuner: '🌅 Petit-déj.',
      pre_seance:     '⚡ Pré-séance',
      post_seance:    '💪 Post-séance',
      dejeuner:       '☀️ Déjeuner',
      collation:      '🍎 Collation',
      diner:          '🌙 Dîner'
    }[type] || type;
  },

  _typeSeance(type) {
    return {
      chest_epaules:  'Poitrine & Épaules',
      dos_biceps:     'Dos & Biceps',
      jambes_abdos:   'Jambes & Abdos',
      epaules_triceps:'Épaules & Triceps',
      full_haut_abdos:'Full Haut + Abdos',
      repos:          'Repos'
    }[type] || type;
  },

  _emojiRayon(rayon) {
    return {
      'Fruits & Légumes':    '🥦',
      'Boucherie / Volaille':'🍗',
      'Boucherie':           '🥩',
      'Poissonnerie':        '🐟',
      'Crèmerie':            '🥛',
      'Boulangerie':         '🍞',
      'Épicerie':            '🛒',
      'Épicerie bio':        '🌿',
      'Épicerie monde':      '🌍',
      'Surgelés':            '❄️',
      'Nutrition sport':     '💊'
    }[rayon] || '🛒';
  },

  _formatQte(qte, unite) {
    // Arrondir les quantités cumulées
    const q = Math.ceil(qte * 10) / 10;
    return `${q} ${unite}`;
  },

  _estimerBudget(courses) {
    // Prix moyens E.Leclerc par rayon
    const prixMoyens = {
      'Fruits & Légumes':    2,
      'Boucherie / Volaille':8,
      'Boucherie':           9,
      'Poissonnerie':        10,
      'Crèmerie':            3,
      'Boulangerie':         2,
      'Épicerie':            2,
      'Épicerie bio':        4,
      'Épicerie monde':      3,
      'Surgelés':            3,
      'Nutrition sport':     15
    };

    let total = 0;
    Object.values(courses).forEach(a => {
      const prix = prixMoyens[a.rayon] || 3;
      total += prix;
    });

    return Math.round(total * 0.8); // Réduction volume
  },

  _getConseil(isEntrainement, totaux, obj) {
    let texte = '', couleur = 'var(--fd-lavender)';

    if (isEntrainement && totaux.prot < obj.proteines * 0.8) {
      texte  = `💪 Jour d'entraînement — tu as besoin de ${obj.proteines}g de protéines. Pense à ton shake post-séance !`;
      couleur = 'var(--fd-coral)';
    } else if (isEntrainement) {
      texte  = `🔥 Jour d'entraînement — bien alimenté ! Hydrate-toi bien avant la séance.`;
      couleur = 'var(--fd-mint)';
    } else {
      texte  = `😴 Jour de repos — réduis légèrement les glucides et maintiens les protéines pour la récupération.`;
      couleur = 'var(--fd-lemon)';
    }

    return `
      <div class="card"
           style="border-left:3px solid ${couleur}">
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;
                    letter-spacing:.08em;color:${couleur};
                    margin-bottom:4px">
          💡 Conseil du jour
        </div>
        <p style="font-size:.82rem;color:var(--text-secondary);
                  line-height:1.5;margin:0">
          ${texte}
        </p>
      </div>`;
  }
};

window.Nutrition = Nutrition;
console.log('✅ Nutrition.js v2.0 chargé');
