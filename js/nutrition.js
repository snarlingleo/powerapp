/* ============================================================
   PowerApp — Nutrition v2.0 COMPLET
   Journal + Recettes + Objectifs + Hydratation + Coach
   ============================================================ */

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES ALIMENTS (50 aliments)
// ════════════════════════════════════════════════════════════
const ALIMENTS_DB = {

  // ══════════════════════════════════════
  // PROTÉINES ANIMALES
  // ══════════════════════════════════════
  poulet_grillee: {
    nom:'Poulet grillé', emoji:'🍗',
    categorie:'proteines',
    cal:165, prot:31, gluc:0, lip:3.6,
    portion:100, unite:'g'
  },
  oeuf_entier: {
    nom:'Œuf entier', emoji:'🥚',
    categorie:'proteines',
    cal:155, prot:13, gluc:1.1, lip:11,
    portion:100, unite:'g'
  },
  blanc_oeuf: {
    nom:'Blanc d\'œuf', emoji:'🥚',
    categorie:'proteines',
    cal:52, prot:11, gluc:0.7, lip:0.2,
    portion:100, unite:'g'
  },
  saumon: {
    nom:'Saumon', emoji:'🐟',
    categorie:'proteines',
    cal:208, prot:20, gluc:0, lip:13,
    portion:100, unite:'g'
  },
  thon_boite: {
    nom:'Thon en boîte', emoji:'🐟',
    categorie:'proteines',
    cal:116, prot:26, gluc:0, lip:1,
    portion:100, unite:'g'
  },
  boeuf_haché: {
    nom:'Bœuf haché 5%', emoji:'🥩',
    categorie:'proteines',
    cal:137, prot:21, gluc:0, lip:5,
    portion:100, unite:'g'
  },
  dinde: {
    nom:'Escalope de dinde', emoji:'🦃',
    categorie:'proteines',
    cal:135, prot:30, gluc:0, lip:1,
    portion:100, unite:'g'
  },
  crevettes: {
    nom:'Crevettes', emoji:'🦐',
    categorie:'proteines',
    cal:99, prot:24, gluc:0.2, lip:0.3,
    portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // PROTÉINES VÉGÉTALES / LAITIÈRES
  // ══════════════════════════════════════
  fromage_blanc: {
    nom:'Fromage blanc 0%', emoji:'🥛',
    categorie:'laitiers',
    cal:45, prot:8, gluc:4, lip:0.2,
    portion:100, unite:'g'
  },
  yaourt_grec: {
    nom:'Yaourt grec', emoji:'🥛',
    categorie:'laitiers',
    cal:59, prot:10, gluc:3.6, lip:0.4,
    portion:100, unite:'g'
  },
  whey: {
    nom:'Whey Protéine', emoji:'💪',
    categorie:'supplements',
    cal:120, prot:24, gluc:3, lip:2,
    portion:30, unite:'g'
  },
  cottage_cheese: {
    nom:'Cottage Cheese', emoji:'🧀',
    categorie:'laitiers',
    cal:98, prot:11, gluc:3.4, lip:4.3,
    portion:100, unite:'g'
  },
  tofu: {
    nom:'Tofu ferme', emoji:'🫘',
    categorie:'proteines',
    cal:76, prot:8, gluc:1.9, lip:4.2,
    portion:100, unite:'g'
  },
  lentilles: {
    nom:'Lentilles cuites', emoji:'🫘',
    categorie:'glucides',
    cal:116, prot:9, gluc:20, lip:0.4,
    portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // GLUCIDES / FÉCULENTS
  // ══════════════════════════════════════
  riz_blanc: {
    nom:'Riz blanc cuit', emoji:'🍚',
    categorie:'glucides',
    cal:130, prot:2.7, gluc:28, lip:0.3,
    portion:100, unite:'g'
  },
  riz_complet: {
    nom:'Riz complet cuit', emoji:'🍚',
    categorie:'glucides',
    cal:112, prot:2.6, gluc:24, lip:0.9,
    portion:100, unite:'g'
  },
  pates: {
    nom:'Pâtes cuites', emoji:'🍝',
    categorie:'glucides',
    cal:131, prot:5, gluc:25, lip:1.1,
    portion:100, unite:'g'
  },
  pomme_terre: {
    nom:'Pomme de terre cuite', emoji:'🥔',
    categorie:'glucides',
    cal:86, prot:1.9, gluc:20, lip:0.1,
    portion:100, unite:'g'
  },
  patate_douce: {
    nom:'Patate douce', emoji:'🍠',
    categorie:'glucides',
    cal:86, prot:1.6, gluc:20, lip:0.1,
    portion:100, unite:'g'
  },
  avoine: {
    nom:'Flocons d\'avoine', emoji:'🥣',
    categorie:'glucides',
    cal:389, prot:17, gluc:66, lip:7,
    portion:100, unite:'g'
  },
  pain_complet: {
    nom:'Pain complet', emoji:'🍞',
    categorie:'glucides',
    cal:247, prot:13, gluc:41, lip:4.2,
    portion:100, unite:'g'
  },
  quinoa: {
    nom:'Quinoa cuit', emoji:'🌾',
    categorie:'glucides',
    cal:120, prot:4.4, gluc:22, lip:1.9,
    portion:100, unite:'g'
  },
  banane: {
    nom:'Banane', emoji:'🍌',
    categorie:'fruits',
    cal:89, prot:1.1, gluc:23, lip:0.3,
    portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // LÉGUMES
  // ══════════════════════════════════════
  brocoli: {
    nom:'Brocoli', emoji:'🥦',
    categorie:'legumes',
    cal:34, prot:2.8, gluc:7, lip:0.4,
    portion:100, unite:'g'
  },
  epinards: {
    nom:'Épinards', emoji:'🥬',
    categorie:'legumes',
    cal:23, prot:2.9, gluc:3.6, lip:0.4,
    portion:100, unite:'g'
  },
  courgette: {
    nom:'Courgette', emoji:'🥒',
    categorie:'legumes',
    cal:17, prot:1.2, gluc:3.1, lip:0.3,
    portion:100, unite:'g'
  },
  salade: {
    nom:'Salade verte', emoji:'🥗',
    categorie:'legumes',
    cal:15, prot:1.4, gluc:2.9, lip:0.2,
    portion:100, unite:'g'
  },
  tomate: {
    nom:'Tomate', emoji:'🍅',
    categorie:'legumes',
    cal:18, prot:0.9, gluc:3.9, lip:0.2,
    portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // LIPIDES / GRAISSES SAINES
  // ══════════════════════════════════════
  avocat: {
    nom:'Avocat', emoji:'🥑',
    categorie:'lipides',
    cal:160, prot:2, gluc:9, lip:15,
    portion:100, unite:'g'
  },
  huile_olive: {
    nom:'Huile d\'olive', emoji:'🫙',
    categorie:'lipides',
    cal:884, prot:0, gluc:0, lip:100,
    portion:10, unite:'g'
  },
  amandes: {
    nom:'Amandes', emoji:'🥜',
    categorie:'lipides',
    cal:579, prot:21, gluc:22, lip:50,
    portion:30, unite:'g'
  },
  beurre_cacahuete: {
    nom:'Beurre de cacahuète', emoji:'🥜',
    categorie:'lipides',
    cal:588, prot:25, gluc:20, lip:50,
    portion:30, unite:'g'
  },
  noix: {
    nom:'Noix', emoji:'🫘',
    categorie:'lipides',
    cal:654, prot:15, gluc:14, lip:65,
    portion:30, unite:'g'
  },

  // ══════════════════════════════════════
  // FRUITS
  // ══════════════════════════════════════
  pomme: {
    nom:'Pomme', emoji:'🍎',
    categorie:'fruits',
    cal:52, prot:0.3, gluc:14, lip:0.2,
    portion:100, unite:'g'
  },
  orange: {
    nom:'Orange', emoji:'🍊',
    categorie:'fruits',
    cal:47, prot:0.9, gluc:12, lip:0.1,
    portion:100, unite:'g'
  },
  fraises: {
    nom:'Fraises', emoji:'🍓',
    categorie:'fruits',
    cal:32, prot:0.7, gluc:7.7, lip:0.3,
    portion:100, unite:'g'
  },
  myrtilles: {
    nom:'Myrtilles', emoji:'🫐',
    categorie:'fruits',
    cal:57, prot:0.7, gluc:14, lip:0.3,
    portion:100, unite:'g'
  },

  // ══════════════════════════════════════
  // SUPPLÉMENTS / SPORT
  // ══════════════════════════════════════
  creatine: {
    nom:'Créatine', emoji:'⚗️',
    categorie:'supplements',
    cal:0, prot:0, gluc:0, lip:0,
    portion:5, unite:'g'
  },
  barre_proteinee: {
    nom:'Barre protéinée', emoji:'🍫',
    categorie:'supplements',
    cal:200, prot:20, gluc:20, lip:6,
    portion:60, unite:'g'
  },
  boisson_sport: {
    nom:'Boisson isotonique', emoji:'🧃',
    categorie:'supplements',
    cal:25, prot:0, gluc:6, lip:0,
    portion:500, unite:'ml'
  }
};

// ════════════════════════════════════════════════════════════
// BASE DE DONNÉES RECETTES (15 recettes sport)
// ════════════════════════════════════════════════════════════
const RECETTES_DB = [
  {
    id:         'bowl_post_seance',
    nom:        'Bowl post-séance',
    emoji:      '🥣',
    categorie:  'post_seance',
    moment:     'post_seance',
    temps:      10,
    description:'Récupération optimale après l\'entraînement',
    tags:       ['post-séance','protéines','rapide'],
    ingredients:[
      { ref:'yaourt_grec',    qte:200 },
      { ref:'avoine',         qte:50  },
      { ref:'banane',         qte:100 },
      { ref:'myrtilles',      qte:50  },
      { ref:'beurre_cacahuete',qte:20 }
    ]
  },
  {
    id:         'omelette_musculation',
    nom:        'Omelette musculation',
    emoji:      '🍳',
    categorie:  'petit_dejeuner',
    moment:     'matin',
    temps:      15,
    description:'Petit-déjeuner riche en protéines pour une journée active',
    tags:       ['matin','protéines','œufs'],
    ingredients:[
      { ref:'oeuf_entier', qte:300 },
      { ref:'blanc_oeuf',  qte:100 },
      { ref:'epinards',    qte:80  },
      { ref:'tomate',      qte:100 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:         'riz_poulet_legumes',
    nom:        'Riz poulet légumes',
    emoji:      '🍱',
    categorie:  'dejeuner',
    moment:     'dejeuner',
    temps:      25,
    description:'Le classique de la musculation — équilibré et complet',
    tags:       ['déjeuner','équilibré','classique'],
    ingredients:[
      { ref:'riz_blanc',     qte:150 },
      { ref:'poulet_grillee',qte:180 },
      { ref:'brocoli',       qte:150 },
      { ref:'courgette',     qte:100 },
      { ref:'huile_olive',   qte:10  }
    ]
  },
  {
    id:         'smoothie_proteine',
    nom:        'Smoothie protéiné',
    emoji:      '🥤',
    categorie:  'post_seance',
    moment:     'post_seance',
    temps:      5,
    description:'Récupération express — prêt en 5 minutes',
    tags:       ['rapide','post-séance','liquide'],
    ingredients:[
      { ref:'whey',          qte:30  },
      { ref:'banane',        qte:100 },
      { ref:'fromage_blanc', qte:150 },
      { ref:'myrtilles',     qte:80  }
    ]
  },
  {
    id:         'salade_thon_quinoa',
    nom:        'Salade thon quinoa',
    emoji:      '🥗',
    categorie:  'dejeuner',
    moment:     'dejeuner',
    temps:      15,
    description:'Salade légère et très protéinée — parfaite pour la sèche',
    tags:       ['sèche','léger','déjeuner'],
    ingredients:[
      { ref:'quinoa',     qte:120 },
      { ref:'thon_boite', qte:160 },
      { ref:'salade',     qte:100 },
      { ref:'tomate',     qte:150 },
      { ref:'avocat',     qte:80  },
      { ref:'huile_olive',qte:10  }
    ]
  },
  {
    id:         'pancakes_avoine',
    nom:        'Pancakes avoine',
    emoji:      '🥞',
    categorie:  'petit_dejeuner',
    moment:     'matin',
    temps:      20,
    description:'Petit-déjeuner énergie pour les grosses séances',
    tags:       ['matin','énergie','volume'],
    ingredients:[
      { ref:'avoine',        qte:80  },
      { ref:'oeuf_entier',   qte:150 },
      { ref:'fromage_blanc', qte:100 },
      { ref:'banane',        qte:80  }
    ]
  },
  {
    id:         'bowl_patate_douce',
    nom:        'Bowl patate douce & poulet',
    emoji:      '🍠',
    categorie:  'dejeuner',
    moment:     'dejeuner',
    temps:      30,
    description:'Prise de masse — glucides complexes + protéines',
    tags:       ['prise de masse','déjeuner','volume'],
    ingredients:[
      { ref:'patate_douce',   qte:200 },
      { ref:'poulet_grillee', qte:200 },
      { ref:'epinards',       qte:100 },
      { ref:'avocat',         qte:80  }
    ]
  },
  {
    id:         'cottage_fruits',
    nom:        'Cottage cheese & fruits',
    emoji:      '🧀',
    categorie:  'collation',
    moment:     'collation',
    temps:      3,
    description:'Collation protéinée et savoureuse — parfaite avant de dormir',
    tags:       ['collation','soir','caséine'],
    ingredients:[
      { ref:'cottage_cheese', qte:200 },
      { ref:'fraises',        qte:100 },
      { ref:'myrtilles',      qte:50  },
      { ref:'amandes',        qte:20  }
    ]
  },
  {
    id:         'pates_bolognaise_sport',
    nom:        'Pâtes bolognaise sport',
    emoji:      '🍝',
    categorie:  'diner',
    moment:     'diner',
    temps:      30,
    description:'Repas du soir riche pour la récupération',
    tags:       ['dîner','masse','pâtes'],
    ingredients:[
      { ref:'pates',       qte:200 },
      { ref:'boeuf_haché', qte:150 },
      { ref:'tomate',      qte:200 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:         'saumon_riz',
    nom:        'Saumon & riz complet',
    emoji:      '🐟',
    categorie:  'diner',
    moment:     'diner',
    temps:      25,
    description:'Oméga-3 + glucides complexes — récupération nocturne',
    tags:       ['dîner','récupération','oméga-3'],
    ingredients:[
      { ref:'saumon',      qte:180 },
      { ref:'riz_complet', qte:150 },
      { ref:'brocoli',     qte:150 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:         'wrap_poulet',
    nom:        'Wrap poulet avocat',
    emoji:      '🌯',
    categorie:  'dejeuner',
    moment:     'dejeuner',
    temps:      10,
    description:'Repas rapide et équilibré — idéal au bureau',
    tags:       ['rapide','déjeuner','bureau'],
    ingredients:[
      { ref:'pain_complet',   qte:60  },
      { ref:'poulet_grillee', qte:120 },
      { ref:'avocat',         qte:60  },
      { ref:'salade',         qte:50  },
      { ref:'tomate',         qte:80  }
    ]
  },
  {
    id:         'pre_seance',
    nom:        'Repas pré-séance',
    emoji:      '⚡',
    categorie:  'pre_seance',
    moment:     'pre_seance',
    temps:      10,
    description:'Énergie optimale 2h avant l\'entraînement',
    tags:       ['pré-séance','énergie','timing'],
    ingredients:[
      { ref:'riz_blanc',      qte:150 },
      { ref:'poulet_grillee', qte:120 },
      { ref:'banane',         qte:100 }
    ]
  },
  {
    id:         'overnight_oats',
    nom:        'Overnight oats',
    emoji:      '🌙',
    categorie:  'petit_dejeuner',
    moment:     'matin',
    temps:      5,
    description:'Préparer la veille — petit-déjeuner parfait',
    tags:       ['matin','préparation','masse'],
    ingredients:[
      { ref:'avoine',        qte:80  },
      { ref:'yaourt_grec',   qte:150 },
      { ref:'banane',        qte:80  },
      { ref:'myrtilles',     qte:60  },
      { ref:'amandes',       qte:20  }
    ]
  },
  {
    id:         'tofu_legumes_wok',
    nom:        'Wok tofu légumes',
    emoji:      '🥢',
    categorie:  'diner',
    moment:     'diner',
    temps:      20,
    description:'Option végétarienne haute en protéines végétales',
    tags:       ['végétarien','dîner','légumes'],
    ingredients:[
      { ref:'tofu',        qte:200 },
      { ref:'riz_blanc',   qte:150 },
      { ref:'brocoli',     qte:150 },
      { ref:'courgette',   qte:100 },
      { ref:'huile_olive', qte:10  }
    ]
  },
  {
    id:         'snack_musculation',
    nom:        'Snack musculation',
    emoji:      '💪',
    categorie:  'collation',
    moment:     'collation',
    temps:      2,
    description:'Collation rapide entre les repas',
    tags:       ['collation','rapide','protéines'],
    ingredients:[
      { ref:'barre_proteinee',  qte:60  },
      { ref:'fromage_blanc',    qte:150 },
      { ref:'amandes',          qte:20  }
    ]
  }
];

// ════════════════════════════════════════════════════════════
// MODULE NUTRITION PRINCIPAL
// ════════════════════════════════════════════════════════════
const Nutrition = {

  // ─── Clés de stockage ───────────────────────────────────
  CLE_JOURNAL:    'ft_nutrition_journal',
  CLE_OBJECTIFS:  'ft_nutrition_objectifs',
  CLE_EAU:        'ft_nutrition_eau',
  CLE_FAVORIS:    'ft_nutrition_favoris',
  CLE_CUSTOMS:    'ft_nutrition_customs',

  // ─── Onglet actif ───────────────────────────────────────
  _ongletActif:   'dashboard',
  _recherche:     '',
  _filtreRecette: 'tous',

  // ════════════════════════════════════════════════════════
  // ✅ RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    container.innerHTML = `
      <!-- Onglets -->
      <div class="tabs-container mb-md">
        ${[
          { id:'dashboard', label:'📊 Dashboard' },
          { id:'journal',   label:'📔 Journal'   },
          { id:'recettes',  label:'🍽️ Recettes'  },
          { id:'objectifs', label:'🎯 Objectifs' }
        ].map(t => `
          <button class="tab-btn ${this._ongletActif === t.id
            ? 'active' : ''}"
                  onclick="Nutrition._changerOnglet('${t.id}')">
            ${t.label}
          </button>`).join('')}
      </div>
      <div id="nutrition-content"></div>
    `;

    this._rendreOnglet();
  },

  _changerOnglet(id) {
    this._ongletActif = id;
    const container   = document.getElementById(
      'page-nutrition'
    );
    if (container) this.render(container);
  },

  _rendreOnglet() {
    const c = document.getElementById('nutrition-content');
    if (!c) return;

    switch(this._ongletActif) {
      case 'dashboard': this._rendreDashboard(c); break;
      case 'journal':   this._rendreJournal(c);   break;
      case 'recettes':  this._rendreRecettes(c);  break;
      case 'objectifs': this._rendreObjectifs(c); break;
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ DASHBOARD
  // ════════════════════════════════════════════════════════
  _rendreDashboard(container) {
    const totaux = this.getTotauxJournal();
    const obj    = this.getObjectifs();
    const eau    = this.getEau();
    const eauObj = obj.eau * 1000; // en ml

    // Suggestion post-séance
    let postSeance = null;
    try {
      const seanceAuj = Tracker.getSeanceDuJour();
      if (seanceAuj?.series?.length > 0) {
        postSeance = RECETTES_DB.find(
          r => r.moment === 'post_seance'
        );
      }
    } catch(e) {}

    const pctCal  = Math.min(100,
      Math.round((totaux.cal  / Math.max(obj.calories,   1)) * 100));
    const pctProt = Math.min(100,
      Math.round((totaux.prot / Math.max(obj.proteines,  1)) * 100));
    const pctGluc = Math.min(100,
      Math.round((totaux.gluc / Math.max(obj.glucides,   1)) * 100));
    const pctLip  = Math.min(100,
      Math.round((totaux.lip  / Math.max(obj.lipides,    1)) * 100));
    const pctEau  = Math.min(100,
      Math.round((eau         / Math.max(eauObj,         1)) * 100));

    const surplus = totaux.cal - obj.calories;

    container.innerHTML = `

      <!-- Date + résumé -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  margin-bottom:14px">
        <div>
          <div style="font-size:1rem;font-weight:800">
            Aujourd'hui
          </div>
          <div style="font-size:.72rem;color:var(--text-muted)">
            ${new Date().toLocaleDateString('fr-FR',{
              weekday:'long',day:'numeric',month:'long'
            })}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.3rem;font-weight:800;
                      color:${surplus > 200
                        ? 'var(--fd-coral)'
                        : surplus < -200
                          ? 'var(--fd-indigo)'
                          : 'var(--fd-mint)'}">
            ${totaux.cal} kcal
          </div>
          <div style="font-size:.65rem;color:var(--text-muted)">
            ${surplus >= 0
              ? `+${surplus} kcal surplus`
              : `${surplus} kcal déficit`}
          </div>
        </div>
      </div>

      <!-- Macros cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:8px;margin-bottom:14px">
        ${[
          { label:'Calories', val:totaux.cal,
            obj:obj.calories, pct:pctCal,
            unite:'kcal', color:'var(--fd-lemon)', emoji:'🔥' },
          { label:'Protéines', val:totaux.prot,
            obj:obj.proteines, pct:pctProt,
            unite:'g', color:'var(--fd-coral)', emoji:'💪' },
          { label:'Glucides', val:totaux.gluc,
            obj:obj.glucides, pct:pctGluc,
            unite:'g', color:'var(--fd-indigo)', emoji:'⚡' },
          { label:'Lipides', val:totaux.lip,
            obj:obj.lipides, pct:pctLip,
            unite:'g', color:'var(--fd-mint)', emoji:'🥑' }
        ].map(m => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:14px">
            <div style="display:flex;align-items:center;
                        justify-content:space-between;
                        margin-bottom:8px">
              <div style="font-size:.65rem;font-weight:700;
                          text-transform:uppercase;
                          letter-spacing:.08em;
                          color:var(--text-muted)">
                ${m.emoji} ${m.label}
              </div>
              <div style="font-size:.65rem;font-weight:700;
                          color:${m.pct >= 100
                            ? 'var(--fd-coral)' : m.color}">
                ${m.pct}%
              </div>
            </div>
            <div style="font-size:1.1rem;font-weight:800;
                        color:${m.color};line-height:1;
                        margin-bottom:4px">
              ${Math.round(m.val)}
              <span style="font-size:.65rem;
                           color:var(--text-muted);
                           font-weight:400">
                /${Math.round(m.obj)}${m.unite}
              </span>
            </div>
            <div style="height:5px;
                        background:rgba(255,255,255,0.06);
                        border-radius:99px;overflow:hidden">
              <div style="height:100%;
                          width:${m.pct}%;
                          background:${m.pct >= 100
                            ? 'var(--fd-coral)' : m.color};
                          border-radius:99px;
                          transition:width .8s ease">
              </div>
            </div>
            ${m.pct >= 100 ? `
              <div style="font-size:.55rem;color:var(--fd-coral);
                          margin-top:3px;font-weight:700">
                ⚠️ Objectif dépassé
              </div>` : ''}
          </div>`).join('')}
      </div>

      <!-- Hydratation -->
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:10px">
          <div>
            <div style="font-size:.65rem;font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:.08em;
                        color:var(--fd-indigo)">
              💧 Hydratation
            </div>
            <div style="font-size:1.2rem;font-weight:800;
                        color:var(--fd-indigo);
                        margin-top:2px">
              ${(eau / 1000).toFixed(2)}L
              <span style="font-size:.7rem;
                           color:var(--text-muted);
                           font-weight:400">
                / ${obj.eau}L
              </span>
            </div>
          </div>
          <!-- Cercle eau -->
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="24"
                    fill="none"
                    stroke="rgba(75,75,249,0.15)"
                    stroke-width="6"/>
            <circle cx="30" cy="30" r="24"
                    fill="none"
                    stroke="var(--fd-indigo)"
                    stroke-width="6"
                    stroke-linecap="round"
                    stroke-dasharray="${Math.round(
                      150.8 * (pctEau / 100)
                    )} 150.8"
                    transform="rotate(-90 30 30)"
                    style="transition:stroke-dasharray .8s ease"/>
            <text x="30" y="34"
                  text-anchor="middle"
                  fill="var(--fd-indigo)"
                  font-size="11"
                  font-weight="800">
              ${pctEau}%
            </text>
          </svg>
        </div>

        <!-- Barre eau -->
        <div style="height:8px;
                    background:rgba(75,75,249,0.1);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:12px">
          <div style="height:100%;width:${pctEau}%;
                      background:var(--fd-indigo);
                      border-radius:99px;
                      transition:width .8s ease">
          </div>
        </div>

        <!-- Boutons eau rapides -->
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:6px">
          ${[
            { ml:150,  label:'+150ml', icon:'🥛' },
            { ml:250,  label:'+250ml', icon:'🥤' },
            { ml:500,  label:'+500ml', icon:'💧' },
            { ml:1000, label:'+1L',    icon:'🍶' }
          ].map(b => `
            <button onclick="Nutrition._ajouterEau(${b.ml})"
                    style="padding:8px 4px;text-align:center;
                           background:rgba(75,75,249,0.12);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:var(--radius-md);
                           cursor:pointer;transition:all .15s"
                    onmousedown="this.style.transform='scale(.94)'"
                    onmouseup="this.style.transform=''">
              <div style="font-size:1rem;margin-bottom:2px">
                ${b.icon}
              </div>
              <div style="font-size:.6rem;font-weight:700;
                          color:var(--fd-indigo)">
                ${b.label}
              </div>
            </button>`).join('')}
        </div>

        ${pctEau >= 100 ? `
          <div style="margin-top:8px;padding:6px 10px;
                      background:rgba(139,240,187,0.1);
                      border:1px solid rgba(139,240,187,0.2);
                      border-radius:var(--radius-sm);
                      font-size:.72rem;
                      color:var(--fd-mint);font-weight:700;
                      text-align:center">
            ✅ Objectif hydratation atteint ! Bravo 💧
          </div>` : `
          <div style="margin-top:8px;font-size:.65rem;
                      color:var(--text-muted);text-align:center">
            Encore ${((eauObj - eau) / 1000).toFixed(2)}L pour atteindre ton objectif
          </div>`}
      </div>

      <!-- Suggestion post-séance -->
      ${postSeance ? `
        <div style="background:rgba(139,240,187,0.08);
                    border:1px solid rgba(139,240,187,0.25);
                    border-radius:var(--radius-lg);
                    padding:14px;margin-bottom:14px;
                    cursor:pointer"
             onclick="Nutrition._voirRecette('${postSeance.id}')">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-mint);margin-bottom:6px">
            ⚡ Suggestion post-séance
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.8rem">${postSeance.emoji}</span>
            <div>
              <div style="font-size:.88rem;font-weight:700">
                ${postSeance.nom}
              </div>
              <div style="font-size:.65rem;color:var(--text-muted)">
                ${this._calculerMacrosRecette(postSeance).cal} kcal
                · ${this._calculerMacrosRecette(postSeance).prot}g protéines
                · ⏱ ${postSeance.temps} min
              </div>
            </div>
            <div style="margin-left:auto;color:var(--fd-mint);
                        font-size:1.2rem">›</div>
          </div>
        </div>` : ''}

      <!-- Dernières entrées journal -->
      <div style="margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    margin-bottom:8px">
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

      <!-- Bouton ajouter rapide -->
      <button onclick="Nutrition._changerOnglet('journal')"
              class="btn-primary"
              style="width:100%;font-size:.88rem">
        + Ajouter un aliment
      </button>
    `;
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
      const aliment = ALIMENTS_DB[e.ref] || {
        nom:   e.nom   || e.ref,
        emoji: e.emoji || '🍽️'
      };
      return `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:8px 0;
                    border-bottom:1px solid var(--border-color)">
          <span style="font-size:1.2rem">${aliment.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.82rem;font-weight:600">
              ${aliment.nom}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">
              ${e.qte}${e.unite||'g'} · ${e.moment||''}
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
  // ✅ JOURNAL
  // ════════════════════════════════════════════════════════
  _rendreJournal(container) {
    const journal  = this._getJournal();
    const totaux   = this.getTotauxJournal();
    const obj      = this.getObjectifs();
    const moments  = [
      { id:'matin',      label:'🌅 Matin',      emoji:'🌅' },
      { id:'dejeuner',   label:'☀️ Déjeuner',   emoji:'☀️' },
      { id:'collation',  label:'🍎 Collation',  emoji:'🍎' },
      { id:'diner',      label:'🌙 Dîner',      emoji:'🌙' },
      { id:'post_seance',label:'⚡ Post-séance', emoji:'⚡' }
    ];

    container.innerHTML = `

      <!-- Totaux du jour -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
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
                    grid-template-columns:repeat(3,1fr);
                    gap:8px">
          ${[
            { label:'Prot.',   val:totaux.prot,
              obj:obj.proteines, color:'var(--fd-coral)'  },
            { label:'Gluc.',   val:totaux.gluc,
              obj:obj.glucides,  color:'var(--fd-indigo)' },
            { label:'Lip.',    val:totaux.lip,
              obj:obj.lipides,   color:'var(--fd-mint)'   }
          ].map(m => {
            const pct = Math.min(100,
              Math.round((m.val / Math.max(m.obj, 1)) * 100));
            return `
              <div>
                <div style="display:flex;
                            justify-content:space-between;
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
                              border-radius:99px">
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Bouton ajouter -->
      <button onclick="Nutrition._ouvrirAjoutAliment()"
              class="btn-primary"
              style="width:100%;margin-bottom:14px;font-size:.88rem">
        + Ajouter un aliment
      </button>

      <!-- Entrées par moment -->
      ${moments.map(moment => {
        const entrees = journal.filter(
          e => e.moment === moment.id
        );
        if (!entrees.length) return '';

        const totalMoment = entrees.reduce(
          (a, e) => ({
            cal:  a.cal  + e.cal,
            prot: a.prot + e.prot
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
                <div style="width:3px;height:12px;
                            border-radius:99px;
                            background:var(--fd-indigo)">
                </div>
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
                    ${ali.emoji}
                  </span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:.82rem;font-weight:700;
                                overflow:hidden;text-overflow:ellipsis;
                                white-space:nowrap">
                      ${ali.nom}
                    </div>
                    <div style="font-size:.6rem;
                                color:var(--text-muted);
                                margin-top:1px">
                      ${e.qte}${e.unite||'g'}
                      · P:${Math.round(e.prot)}g
                      · G:${Math.round(e.gluc)}g
                      · L:${Math.round(e.lip)}g
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:.82rem;font-weight:800;
                                color:var(--fd-lemon)">
                      ${Math.round(e.cal)}
                    </div>
                    <div style="font-size:.55rem;
                                color:var(--text-muted)">kcal</div>
                  </div>
                  <button onclick="Nutrition._supprimerEntree('${e.id}')"
                          style="width:28px;height:28px;
                                 flex-shrink:0;
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
          <div style="font-size:.88rem">
            Aucune entrée aujourd'hui
          </div>
          <div style="font-size:.72rem;margin-top:4px">
            Clique sur + Ajouter pour commencer
          </div>
        </div>` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // ✅ MODALE AJOUT ALIMENT
  // ════════════════════════════════════════════════════════
  _ouvrirAjoutAliment(momentPrefere = 'dejeuner') {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const aliments = {
      ...ALIMENTS_DB,
      ...this._getAlimentsCustom()
    };

    content.innerHTML = `
      <div style="padding:var(--space-md)">

        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          + Ajouter un aliment
        </div>

        <!-- Tabs mode -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:6px;margin-bottom:14px">
          <button id="btn-mode-liste" onclick="Nutrition._modeAjout('liste')"
                  style="padding:8px;background:var(--fd-indigo);
                         color:white;border:none;
                         border-radius:var(--radius-md);
                         font-size:.75rem;font-weight:700;
                         cursor:pointer">
            📋 Liste
          </button>
          <button id="btn-mode-manuel" onclick="Nutrition._modeAjout('manuel')"
                  style="padding:8px;background:var(--bg-input);
                         color:var(--text-muted);
                         border:1px solid var(--border-color);
                         border-radius:var(--radius-md);
                         font-size:.75rem;font-weight:700;
                         cursor:pointer">
            ✏️ Manuel
          </button>
        </div>

        <!-- Moment -->
        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:6px;font-weight:600">
            Moment de la journée
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${[
              { id:'matin',      label:'🌅 Matin'      },
              { id:'dejeuner',   label:'☀️ Déjeuner'   },
              { id:'collation',  label:'🍎 Collation'  },
              { id:'diner',      label:'🌙 Dîner'      },
              { id:'post_seance',label:'⚡ Post-séance' }
            ].map(m => `
              <button onclick="Nutrition._selectMoment('${m.id}',this)"
                      id="moment-${m.id}"
                      style="padding:5px 10px;font-size:.65rem;
                             font-weight:600;cursor:pointer;
                             border-radius:var(--radius-full);
                             background:${m.id === momentPrefere
                               ? 'rgba(75,75,249,0.2)'
                               : 'var(--bg-input)'};
                             border:1px solid ${m.id === momentPrefere
                               ? 'var(--fd-indigo)'
                               : 'var(--border-color)'};
                             color:${m.id === momentPrefere
                               ? 'var(--fd-indigo)'
                               : 'var(--text-muted)'}">
                ${m.label}
              </button>`).join('')}
          </div>
        </div>

        <div id="ajout-content"></div>
      </div>
    `;

    window._momentSelectionne = momentPrefere;
    modal.classList.remove('hidden');
    this._modeAjout('liste');

    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => {
      modal.classList.add('hidden');
    };
  },

  _selectMoment(id, btn) {
    window._momentSelectionne = id;
    document.querySelectorAll('[id^="moment-"]').forEach(b => {
      b.style.background = 'var(--bg-input)';
      b.style.borderColor = 'var(--border-color)';
      b.style.color = 'var(--text-muted)';
    });
    btn.style.background  = 'rgba(75,75,249,0.2)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'var(--fd-indigo)';
  },

  _modeAjout(mode) {
    const c = document.getElementById('ajout-content');
    if (!c) return;

    document.getElementById('btn-mode-liste')?.style
      .setProperty('background',
        mode === 'liste' ? 'var(--fd-indigo)' : 'var(--bg-input)');
    document.getElementById('btn-mode-manuel')?.style
      .setProperty('background',
        mode === 'manuel' ? 'var(--fd-indigo)' : 'var(--bg-input)');

    if (mode === 'liste') {
      const aliments = { ...ALIMENTS_DB, ...this._getAlimentsCustom() };
      c.innerHTML = `
        <!-- Recherche -->
        <div style="position:relative;margin-bottom:10px">
          <input id="search-aliment"
                 type="text"
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
            🔍
          </span>
        </div>
        <div id="liste-aliments"
             style="max-height:320px;overflow-y:auto">
          ${this._renderListeAliments(aliments, '')}
        </div>
      `;
    } else {
      c.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px">
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-bottom:4px">Nom *</div>
            <input id="manuel-nom" type="text"
                   class="input" placeholder="ex: Smoothie maison"
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
                          margin-bottom:4px">Protéines (g) *</div>
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
            <input id="manuel-qte" type="number"
                   class="input" placeholder="100" value="100" min="1"/>
          </div>
          <button onclick="Nutrition._ajouterManuel()"
                  class="btn-primary"
                  style="width:100%;font-size:.85rem">
            ✅ Ajouter
          </button>
        </div>
      `;
    }
  },

  _renderListeAliments(aliments, recherche) {
    const q = (recherche || '').toLowerCase().trim();
    const filtres = Object.entries(aliments).filter(([, ali]) =>
      !q || ali.nom.toLowerCase().includes(q)
    );

    if (!filtres.length) return `
      <div style="text-align:center;padding:20px;
                  color:var(--text-muted);font-size:.82rem">
        Aucun aliment trouvé
      </div>`;

    return filtres.map(([ref, ali]) => `
      <div onclick="Nutrition._selectionnerAliment('${ref}')"
           style="display:flex;align-items:center;gap:10px;
                  padding:10px 12px;cursor:pointer;
                  border-bottom:1px solid var(--border-color);
                  transition:background .15s"
           onmouseenter="this.style.background='rgba(75,75,249,0.06)'"
           onmouseleave="this.style.background='transparent'">
        <span style="font-size:1.3rem;flex-shrink:0">
          ${ali.emoji || '🍽️'}
        </span>
        <div style="flex:1;min-width:0">
          <div style="font-size:.82rem;font-weight:700;
                      overflow:hidden;text-overflow:ellipsis;
                      white-space:nowrap">
            ${ali.nom}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      margin-top:1px">
            ${ali.cal}kcal · P:${ali.prot}g · G:${ali.gluc}g · L:${ali.lip}g
            <span style="color:var(--text-muted)">/ ${ali.portion}${ali.unite}</span>
          </div>
        </div>
        <span style="color:var(--text-muted);font-size:.9rem;
                     flex-shrink:0">›</span>
      </div>`).join('');
  },

  _rechercherAliment(val) {
    const aliments = { ...ALIMENTS_DB, ...this._getAlimentsCustom() };
    const liste    = document.getElementById('liste-aliments');
    if (liste) liste.innerHTML =
      this._renderListeAliments(aliments, val);
  },

  _selectionnerAliment(ref) {
    const ali = ALIMENTS_DB[ref] || this._getAlimentsCustom()[ref];
    if (!ali) return;

    const c = document.getElementById('ajout-content');
    if (!c) return;

    c.innerHTML = `
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  padding:14px;margin-bottom:12px">
        <div style="display:flex;align-items:center;
                    gap:10px;margin-bottom:10px">
          <span style="font-size:1.8rem">${ali.emoji || '🍽️'}</span>
          <div>
            <div style="font-size:.9rem;font-weight:800">
              ${ali.nom}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Pour ${ali.portion}${ali.unite} :
              ${ali.cal}kcal · P:${ali.prot}g · G:${ali.gluc}g · L:${ali.lip}g
            </div>
          </div>
        </div>

        <div style="margin-bottom:10px">
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:6px;font-weight:600">
            Quantité (${ali.unite})
          </div>
          <div style="display:flex;align-items:center;gap:8px">
            <button onclick="Nutrition._ajusterQte(-${ali.portion / 2 || 25})"
                    style="width:40px;height:40px;
                           background:rgba(255,141,150,0.12);
                           border:2px solid rgba(255,141,150,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-coral);cursor:pointer">
              −
            </button>
            <input id="qte-aliment" type="number"
                   value="${ali.portion}"
                   min="1" max="2000"
                   oninput="Nutrition._updateApercuMacros(
                     '${ref}', this.value)"
                   style="flex:1;padding:10px;font-size:1.1rem;
                          font-weight:800;text-align:center;
                          background:var(--bg-card);
                          border:2px solid var(--border-color);
                          border-radius:var(--radius-md);
                          color:var(--text-primary);outline:none"/>
            <button onclick="Nutrition._ajusterQte(${ali.portion / 2 || 25})"
                    style="width:40px;height:40px;
                           background:rgba(139,240,187,0.12);
                           border:2px solid rgba(139,240,187,0.3);
                           border-radius:var(--radius-md);
                           font-size:1.2rem;font-weight:800;
                           color:var(--fd-mint);cursor:pointer">
              +
            </button>
          </div>
        </div>

        <!-- Aperçu macros -->
        <div id="apercu-macros"
             style="display:grid;grid-template-columns:repeat(4,1fr);
                    gap:6px;padding:10px;
                    background:var(--bg-input);
                    border-radius:var(--radius-md)">
          ${this._renderApercuMacros(ali, ali.portion)}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:8px">
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

    window._alimentSelectionne = ref;
  },

  _ajusterQte(delta) {
    const input = document.getElementById('qte-aliment');
    if (!input) return;
    const actuel = parseFloat(input.value) || 0;
    const nouveau = Math.max(1, actuel + delta);
    input.value = nouveau;
    this._updateApercuMacros(
      window._alimentSelectionne, nouveau
    );
  },

  _updateApercuMacros(ref, qte) {
    const ali = ALIMENTS_DB[ref] || this._getAlimentsCustom()[ref];
    if (!ali) return;
    const apercu = document.getElementById('apercu-macros');
    if (apercu) apercu.innerHTML =
      this._renderApercuMacros(ali, parseFloat(qte) || 0);
  },

  _renderApercuMacros(ali, qte) {
    const ratio = qte / ali.portion;
    return [
      { label:'Cal',   val:Math.round(ali.cal  * ratio), color:'var(--fd-lemon)', unite:'kcal' },
      { label:'Prot',  val:Math.round(ali.prot * ratio), color:'var(--fd-coral)', unite:'g'    },
      { label:'Gluc',  val:Math.round(ali.gluc * ratio), color:'var(--fd-indigo)',unite:'g'    },
      { label:'Lip',   val:Math.round(ali.lip  * ratio), color:'var(--fd-mint)',  unite:'g'    }
    ].map(m => `
      <div style="text-align:center">
        <div style="font-size:.88rem;font-weight:800;
                    color:${m.color}">${m.val}</div>
        <div style="font-size:.55rem;color:var(--text-muted);
                    text-transform:uppercase">${m.label}</div>
      </div>`).join('');
  },

  _confirmerAjout(ref) {
    const ali  = ALIMENTS_DB[ref] || this._getAlimentsCustom()[ref];
    const qte  = parseFloat(
      document.getElementById('qte-aliment')?.value
    ) || (ali?.portion || 100);
    const moment = window._momentSelectionne || 'dejeuner';

    if (!ali) return;

    const ratio   = qte / ali.portion;
    const entree  = {
      id:     Date.now().toString(),
      ref,
      nom:    ali.nom,
      emoji:  ali.emoji || '🍽️',
      unite:  ali.unite || 'g',
      qte,
      moment,
      cal:    ali.cal  * ratio,
      prot:   ali.prot * ratio,
      gluc:   ali.gluc * ratio,
      lip:    ali.lip  * ratio,
      date:   Utils.aujourd_hui(),
      heure:  new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    };

    this._ajouterEntreeJournal(entree);

    // +5 XP
    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}

    document.getElementById('modal-info')
      ?.classList.add('hidden');
    Utils.toast(`✅ ${ali.nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();

    // Rafraîchir le journal
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreJournal(c);
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

    const moment  = window._momentSelectionne || 'dejeuner';
    const entree  = {
      id:    Date.now().toString(),
      ref:   'custom_' + Date.now(),
      nom,
      emoji: '🍽️',
      unite: 'g',
      qte,
      moment,
      cal:   cal  * (qte / 100),
      prot:  prot * (qte / 100),
      gluc:  gluc * (qte / 100),
      lip:   lip  * (qte / 100),
      date:  Utils.aujourd_hui(),
      heure: new Date().toLocaleTimeString('fr-FR',{
        hour:'2-digit', minute:'2-digit'
      })
    };

    this._ajouterEntreeJournal(entree);
    try { Gamification.ajouterXP(5, 'nutrition_log'); } catch(e) {}

    document.getElementById('modal-info')
      ?.classList.add('hidden');
    Utils.toast(`✅ ${nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();

    const c = document.getElementById('nutrition-content');
    if (c) this._rendreJournal(c);
  },

  // ════════════════════════════════════════════════════════
  // ✅ RECETTES
  // ════════════════════════════════════════════════════════
  _rendreRecettes(container) {
    const filtres = [
      { id:'tous',         label:'Tous'          },
      { id:'petit_dejeuner',label:'🌅 Matin'     },
      { id:'dejeuner',     label:'☀️ Déjeuner'   },
      { id:'collation',    label:'🍎 Collation'  },
      { id:'diner',        label:'🌙 Dîner'       },
      { id:'post_seance',  label:'⚡ Post-séance' },
      { id:'pre_seance',   label:'🎯 Pré-séance'  }
    ];

    const recettesFiltrees = this._filtreRecette === 'tous'
      ? RECETTES_DB
      : RECETTES_DB.filter(
          r => r.categorie === this._filtreRecette
        );

    container.innerHTML = `

      <!-- Filtres -->
      <div class="muscle-filter-row mb-md">
        ${filtres.map(f => `
          <button class="muscle-filter-btn ${
            this._filtreRecette === f.id ? 'active' : ''}"
                  onclick="Nutrition._filtrerRecettes('${f.id}')">
            ${f.label}
          </button>`).join('')}
      </div>

      <!-- Grille recettes -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${recettesFiltrees.map(recette => {
          const macros = this._calculerMacrosRecette(recette);
          return `
            <div onclick="Nutrition._voirRecette('${recette.id}')"
                 style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-lg);
                        padding:14px;cursor:pointer;
                        transition:all .15s"
                 onmouseenter="this.style.borderColor='rgba(75,75,249,0.3)'"
                 onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)'">
              <div style="display:flex;align-items:center;
                          gap:12px;margin-bottom:10px">
                <span style="font-size:2rem;flex-shrink:0">
                  ${recette.emoji}
                </span>
                <div style="flex:1">
                  <div style="font-size:.9rem;font-weight:800;
                              margin-bottom:2px">
                    ${recette.nom}
                  </div>
                  <div style="font-size:.65rem;
                              color:var(--text-muted)">
                    ⏱ ${recette.temps} min
                    · ${recette.ingredients.length} ingrédients
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-lemon)">
                    ${macros.cal}
                  </div>
                  <div style="font-size:.55rem;
                              color:var(--text-muted)">kcal</div>
                </div>
              </div>

              <!-- Mini barres macros -->
              <div style="display:grid;
                          grid-template-columns:repeat(3,1fr);
                          gap:6px">
                ${[
                  { label:'P', val:macros.prot, color:'var(--fd-coral)',  max:50 },
                  { label:'G', val:macros.gluc, color:'var(--fd-indigo)', max:100},
                  { label:'L', val:macros.lip,  color:'var(--fd-mint)',   max:50 }
                ].map(m => `
                  <div>
                    <div style="display:flex;
                                justify-content:space-between;
                                margin-bottom:2px">
                      <span style="font-size:.55rem;
                                   color:${m.color};
                                   font-weight:700">
                        ${m.label}
                      </span>
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
                                    Math.round((m.val/m.max)*100))}%;
                                  background:${m.color};
                                  border-radius:99px">
                      </div>
                    </div>
                  </div>`).join('')}
              </div>

              <!-- Tags -->
              <div style="display:flex;flex-wrap:wrap;gap:4px;
                          margin-top:8px">
                ${recette.tags.map(tag => `
                  <span style="padding:2px 7px;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.15);
                               border-radius:99px;font-size:.58rem;
                               color:var(--fd-lavender)">
                    ${tag}
                  </span>`).join('')}
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

        <!-- Hero recette -->
        <div style="text-align:center;padding:16px 0;
                    margin-bottom:14px">
          <div style="font-size:3rem;margin-bottom:6px">
            ${recette.emoji}
          </div>
          <div style="font-size:1.1rem;font-weight:800;
                      margin-bottom:4px">
            ${recette.nom}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted)">
            ⏱ ${recette.temps} min
            · ${recette.ingredients.length} ingrédients
          </div>
        </div>

        <!-- Description -->
        <div style="padding:10px 14px;
                    background:rgba(191,161,255,0.06);
                    border:1px solid rgba(191,161,255,0.15);
                    border-radius:var(--radius-md);
                    font-size:.82rem;color:var(--text-secondary);
                    line-height:1.5;margin-bottom:14px">
          💡 ${recette.description}
        </div>

        <!-- Macros détaillées avec barres -->
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:10px">
            📊 Valeurs nutritionnelles
          </div>

          <!-- Calories principale -->
          <div style="text-align:center;margin-bottom:12px">
            <div style="font-size:2rem;font-weight:800;
                        color:var(--fd-lemon)">
              ${macros.cal}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              kcal · ${Math.round(
                (macros.cal / Math.max(obj.calories, 1)) * 100
              )}% de ton objectif journalier
            </div>
          </div>

          ${[
            { label:'Protéines', val:macros.prot,
              obj:obj.proteines, color:'var(--fd-coral)',
              emoji:'💪', unite:'g' },
            { label:'Glucides',  val:macros.gluc,
              obj:obj.glucides,  color:'var(--fd-indigo)',
              emoji:'⚡', unite:'g' },
            { label:'Lipides',   val:macros.lip,
              obj:obj.lipides,   color:'var(--fd-mint)',
              emoji:'🥑', unite:'g' }
          ].map(m => {
            const pct = Math.min(100,
              Math.round((m.val / Math.max(m.obj, 1)) * 100));
            return `
              <div style="margin-bottom:10px">
                <div style="display:flex;
                            justify-content:space-between;
                            margin-bottom:4px">
                  <span style="font-size:.72rem;font-weight:700;
                               color:${m.color}">
                    ${m.emoji} ${m.label}
                  </span>
                  <span style="font-size:.72rem;font-weight:700;
                               color:var(--text-muted)">
                    ${m.val}${m.unite}
                    <span style="opacity:.6">/ ${m.obj}${m.unite}</span>
                  </span>
                </div>
                <div style="height:6px;
                            background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${m.color};border-radius:99px;
                              transition:width .8s ease">
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Ingrédients -->
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
              <div style="display:flex;align-items:center;
                          gap:10px;padding:8px 0;
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

        <!-- Actions -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px">
          <button onclick="Nutrition._loggerRecette('${recette.id}')"
                  class="btn-primary" style="font-size:.82rem">
            📔 Logger cette recette
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
    const moment = recette.moment === 'pre_seance'  ? 'pre_seance'
                 : recette.moment === 'post_seance' ? 'post_seance'
                 : recette.moment || 'dejeuner';

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

    document.getElementById('modal-info')
      ?.classList.add('hidden');
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
  // ✅ OBJECTIFS
  // ════════════════════════════════════════════════════════
  _rendreObjectifs(container) {
    const obj     = this.getObjectifs();
    const profil  = (() => {
      try { return Tracker.getProfil(); }
      catch(e) { return { poids:80, objectif:'forme' }; }
    })();

    const objAuto = this._calculerObjectifsAuto(profil);

    container.innerHTML = `

      <!-- Objectifs actuels -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border-color:rgba(75,75,249,0.3)">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:12px">
          🎯 Tes objectifs nutritionnels
        </div>
        ${[
          { label:'Calories',  val:obj.calories,
            auto:objAuto.calories,  color:'var(--fd-lemon)',
            emoji:'🔥', unite:'kcal' },
          { label:'Protéines', val:obj.proteines,
            auto:objAuto.proteines, color:'var(--fd-coral)',
            emoji:'💪', unite:'g'   },
          { label:'Glucides',  val:obj.glucides,
            auto:objAuto.glucides,  color:'var(--fd-indigo)',
            emoji:'⚡', unite:'g'   },
          { label:'Lipides',   val:obj.lipides,
            auto:objAuto.lipides,   color:'var(--fd-mint)',
            emoji:'🥑', unite:'g'   },
          { label:'Eau',       val:obj.eau,
            auto:objAuto.eau,       color:'var(--fd-indigo)',
            emoji:'💧', unite:'L'   }
        ].map(m => {
          const pct = Math.min(100,
            Math.round((m.val / Math.max(m.auto, 1)) * 100));
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
                  <span style="font-size:.82rem;font-weight:800;
                               color:var(--text-primary)">
                    ${m.val}${m.unite}
                  </span>
                  <span style="font-size:.62rem;
                               color:var(--text-muted);
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
                            transition:width .8s ease">
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Modifier objectifs -->
      <div class="card mb-md">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          ✏️ Personnaliser
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            { id:'calories',  label:'🔥 Calories (kcal)',
              val:obj.calories,  placeholder:objAuto.calories  },
            { id:'proteines', label:'💪 Protéines (g)',
              val:obj.proteines, placeholder:objAuto.proteines },
            { id:'glucides',  label:'⚡ Glucides (g)',
              val:obj.glucides,  placeholder:objAuto.glucides  },
            { id:'lipides',   label:'🥑 Lipides (g)',
              val:obj.lipides,   placeholder:objAuto.lipides   },
            { id:'eau',       label:'💧 Eau (L)',
              val:obj.eau,       placeholder:objAuto.eau       }
          ].map(f => `
            <div style="display:flex;align-items:center;gap:10px">
              <label style="font-size:.75rem;font-weight:600;
                            color:var(--text-muted);
                            min-width:140px;flex-shrink:0">
                ${f.label}
              </label>
              <input id="obj-${f.id}" type="number"
                     class="input" style="flex:1"
                     value="${f.val}"
                     placeholder="${f.placeholder}"
                     min="0"/>
            </div>`).join('')}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-top:14px">
          <button onclick="Nutrition._resetObjectifs()"
                  class="btn-secondary" style="font-size:.78rem">
            🔄 Réinitialiser auto
          </button>
          <button onclick="Nutrition._sauvegarderObjectifs()"
                  class="btn-primary" style="font-size:.78rem">
            💾 Sauvegarder
          </button>
        </div>
      </div>

      <!-- Info calcul auto -->
      <div style="padding:12px 14px;
                  background:rgba(191,161,255,0.06);
                  border:1px solid rgba(191,161,255,0.15);
                  border-radius:var(--radius-md);
                  font-size:.72rem;color:rgba(191,161,255,0.8);
                  line-height:1.6">
        🧮 Calcul auto basé sur :
        <strong>${profil.poids || 80}kg</strong>
        · objectif <strong>${profil.objectif || 'forme'}</strong>
        · TDEE estimé <strong>${objAuto.tdee} kcal</strong>
      </div>
    `;
  },

  _calculerObjectifsAuto(profil) {
    const poids    = profil.poids   || 80;
    const taille   = profil.taille  || 175;
    const objectif = profil.objectif || 'forme';

    // Harris-Benedict simplifié (homme)
    const bmr  = 88.36 + (13.4 * poids) +
                 (4.8 * taille) - (5.7 * 30);
    const tdee = Math.round(bmr * 1.55); // Actif

    const surplus = {
      prise_masse: +400,
      seche:       -400,
      force:       +200,
      endurance:   -100,
      forme:       0
    }[objectif] || 0;

    const calories = tdee + surplus;

    return {
      tdee,
      calories: Math.round(calories),
      proteines: Math.round(poids * 2),
      glucides:  Math.round((calories * 0.45) / 4),
      lipides:   Math.round((calories * 0.25) / 9),
      eau:       parseFloat((poids * 0.035).toFixed(1))
    };
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
    Utils.toast('✅ Objectifs sauvegardés !', 'success');
    Utils.vibrerSuccess();

    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  _resetObjectifs() {
    let profil = { poids:80, objectif:'forme' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const auto = this._calculerObjectifsAuto(profil);
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
  // ✅ EAU
  // ════════════════════════════════════════════════════════
  getEau() {
    const cle = `${this.CLE_EAU}_${Utils.aujourd_hui()}`;
    return Utils.storage.get(cle, 0);
  },

  _ajouterEau(ml) {
    const cle     = `${this.CLE_EAU}_${Utils.aujourd_hui()}`;
    const actuel  = this.getEau();
    const obj     = this.getObjectifs();
    const maximum = obj.eau * 1000 * 1.5; // max 1.5x l'objectif
    const nouveau = Math.min(actuel + ml, maximum);

    Utils.storage.set(cle, nouveau);
    Utils.toast(
      `💧 +${ml}ml · Total ${(nouveau/1000).toFixed(2)}L`,
      'success', 1500
    );
    Utils.vibrerSuccess();

    if (nouveau >= obj.eau * 1000 &&
        actuel < obj.eau * 1000) {
      Utils.toast(
        '🎉 Objectif hydratation atteint !',
        'success', 3000
      );
      try { Gamification.ajouterXP(20, 'hydratation'); } catch(e) {}
    }

    const c = document.getElementById('nutrition-content');
    if (c && this._ongletActif === 'dashboard') {
      this._rendreDashboard(c);
    }
  },

  // ✅ Méthode publique pour app.js
  _ajouterEauRapide(ml) {
    this._ajouterEau(ml);
  },

  // ════════════════════════════════════════════════════════
  // ✅ DONNÉES
  // ════════════════════════════════════════════════════════
  _getJournal() {
    const cle = `${this.CLE_JOURNAL}_${Utils.aujourd_hui()}`;
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

  getObjectifs() {
    let profil = { poids:80, objectif:'forme' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const auto = this._calculerObjectifsAuto(profil);
    return Utils.storage.get(this.CLE_OBJECTIFS, {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    });
  },

  getTotauxJournal() {
    return this._getJournal().reduce((totaux, e) => ({
      cal:  totaux.cal  + (e.cal  || 0),
      prot: totaux.prot + (e.prot || 0),
      gluc: totaux.gluc + (e.gluc || 0),
      lip:  totaux.lip  + (e.lip  || 0)
    }), { cal:0, prot:0, gluc:0, lip:0 });
  },

  _getAlimentsCustom() {
    return Utils.storage.get(this.CLE_CUSTOMS, {});
  },

  // ✅ Méthode pour le widget Home
  getTotauxJournal() {
    return this._getJournal().reduce((totaux, e) => ({
      cal:  totaux.cal  + (e.cal  || 0),
      prot: totaux.prot + (e.prot || 0),
      gluc: totaux.gluc + (e.gluc || 0),
      lip:  totaux.lip  + (e.lip  || 0)
    }), { cal:0, prot:0, gluc:0, lip:0 });
  }
};

// ════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE
// ════════════════════════════════════════════════════════════
window.Nutrition    = Nutrition;
window.ALIMENTS_DB  = ALIMENTS_DB;
window.RECETTES_DB  = RECETTES_DB;

console.log(
  `✅ Nutrition v2.0 chargé — ` +
  `${Object.keys(ALIMENTS_DB).length} aliments, ` +
  `${RECETTES_DB.length} recettes`
);
