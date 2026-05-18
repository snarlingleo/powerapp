/* ============================================================
   PowerApp — Nutrition.js v1.0
   Dashboard + Macros + Hydratation + Repas + Historique
   Lié au profil (objectif, poids, taille)
   ============================================================ */

'use strict';

const Nutrition = {

  // ════════════════════════════════════════════════════════
  // CONFIG & CONSTANTES
  // ════════════════════════════════════════════════════════
  CLE: {
    REPAS:       (date) => `ft_nutrition_repas_${date}`,
    EAU:         (date) => `ft_nutrition_eau_${date}`,
    OBJECTIFS:   ()     => 'ft_nutrition_objectifs',
    ALIMENTS:    ()     => 'ft_nutrition_aliments_custom'
  },

  // Base d'aliments courants (pour recherche rapide)
  ALIMENTS_BASE: [
    // Protéines
    { nom:'Poulet (cuit)',     cal:165, prot:31, gluc:0,  lip:3.6, emoji:'🍗', categorie:'proteine' },
    { nom:'Bœuf haché 5%',    cal:137, prot:21, gluc:0,  lip:5,   emoji:'🥩', categorie:'proteine' },
    { nom:'Saumon',            cal:208, prot:20, gluc:0,  lip:13,  emoji:'🐟', categorie:'proteine' },
    { nom:'Thon en boîte',     cal:116, prot:26, gluc:0,  lip:1,   emoji:'🐟', categorie:'proteine' },
    { nom:'Œufs (1 unité)',    cal:78,  prot:6,  gluc:0.6,lip:5,   emoji:'🥚', categorie:'proteine' },
    { nom:'Blanc d\'œuf',      cal:17,  prot:3.6,gluc:0.2,lip:0,   emoji:'🥚', categorie:'proteine' },
    { nom:'Whey protéine',     cal:120, prot:24, gluc:3,  lip:2,   emoji:'🥛', categorie:'proteine' },
    { nom:'Fromage blanc 0%',  cal:45,  prot:8,  gluc:4,  lip:0.1, emoji:'🥛', categorie:'proteine' },
    { nom:'Jambon blanc',      cal:107, prot:17, gluc:1,  lip:3.5, emoji:'🍖', categorie:'proteine' },
    // Glucides
    { nom:'Riz blanc (cuit)',  cal:130, prot:2.7,gluc:28, lip:0.3, emoji:'🍚', categorie:'glucide'  },
    { nom:'Riz complet (cuit)',cal:112, prot:2.6,gluc:24, lip:0.9, emoji:'🍚', categorie:'glucide'  },
    { nom:'Pâtes (cuites)',    cal:158, prot:5.8,gluc:31, lip:0.9, emoji:'🍝', categorie:'glucide'  },
    { nom:'Pain complet',      cal:247, prot:9,  gluc:41, lip:3.4, emoji:'🍞', categorie:'glucide'  },
    { nom:'Avoine (flocons)',  cal:389, prot:17, gluc:66, lip:7,   emoji:'🌾', categorie:'glucide'  },
    { nom:'Patate douce',      cal:86,  prot:1.6,gluc:20, lip:0.1, emoji:'🍠', categorie:'glucide'  },
    { nom:'Pomme de terre',    cal:77,  prot:2,  gluc:17, lip:0.1, emoji:'🥔', categorie:'glucide'  },
    { nom:'Banane',            cal:89,  prot:1.1,gluc:23, lip:0.3, emoji:'🍌', categorie:'glucide'  },
    { nom:'Pomme',             cal:52,  prot:0.3,gluc:14, lip:0.2, emoji:'🍎', categorie:'glucide'  },
    // Lipides
    { nom:'Huile olive (cs)',  cal:119, prot:0,  gluc:0,  lip:13.5,emoji:'🫒', categorie:'lipide'   },
    { nom:'Beurre de cacah.', cal:588, prot:25, gluc:20, lip:50,  emoji:'🥜', categorie:'lipide'   },
    { nom:'Amandes (30g)',     cal:174, prot:6,  gluc:5,  lip:15,  emoji:'🥜', categorie:'lipide'   },
    { nom:'Avocat (½)',        cal:120, prot:1.5,gluc:6,  lip:11,  emoji:'🥑', categorie:'lipide'   },
    // Légumes
    { nom:'Brocoli (100g)',    cal:34,  prot:2.8,gluc:7,  lip:0.4, emoji:'🥦', categorie:'legume'   },
    { nom:'Épinards (100g)',   cal:23,  prot:2.9,gluc:3.6,lip:0.4, emoji:'🥬', categorie:'legume'   },
    { nom:'Tomate (100g)',     cal:18,  prot:0.9,gluc:3.9,lip:0.2, emoji:'🍅', categorie:'legume'   },
    { nom:'Courgette (100g)',  cal:17,  prot:1.2,gluc:3.1,lip:0.3, emoji:'🥒', categorie:'legume'   }
  ],

  // ════════════════════════════════════════════════════════
  // CALCULS OBJECTIFS NUTRITIONNELS
  // ════════════════════════════════════════════════════════
  calculerObjectifsAuto() {
    let profil = { poids:80, taille:175, objectif:'forme', niveau:'intermediaire' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const poids  = profil.poids  || 80;
    const taille = profil.taille || 175;

    // Métabolisme de base (Mifflin-St Jeor simplifié)
    const bmr = Math.round(10 * poids + 6.25 * taille - 5 * 25 + 5);

    // Multiplicateur activité selon niveau
    const activ = {
      debutant:      1.375,
      intermediaire: 1.55,
      avance:        1.725
    }[profil.niveau] || 1.55;

    const tdee = Math.round(bmr * activ);

    // Ajustement selon objectif
    const calMap = {
      prise_masse:  tdee + 300,
      perte_poids:  tdee - 400,
      seche:        tdee - 500,
      force:        tdee + 200,
      endurance:    tdee + 100,
      forme:        tdee
    };

    const calories = calMap[profil.objectif] || tdee;

    // Répartition macros selon objectif
    const macrosMap = {
      prise_masse:  { prot: poids * 2.2, lip: calories * 0.25 / 9 },
      perte_poids:  { prot: poids * 2.4, lip: calories * 0.30 / 9 },
      seche:        { prot: poids * 2.6, lip: calories * 0.25 / 9 },
      force:        { prot: poids * 2.0, lip: calories * 0.30 / 9 },
      endurance:    { prot: poids * 1.6, lip: calories * 0.25 / 9 },
      forme:        { prot: poids * 1.8, lip: calories * 0.28 / 9 }
    };

    const macros   = macrosMap[profil.objectif] || macrosMap.forme;
    const proteines = Math.round(macros.prot);
    const lipides   = Math.round(macros.lip);
    const glucides  = Math.round(
      (calories - proteines * 4 - lipides * 9) / 4
    );

    return {
      calories,
      proteines,
      glucides,
      lipides,
      eau: Math.round(poids * 0.035 * 10) / 10
    };
  },

  getObjectifs() {
    const auto = this.calculerObjectifsAuto();
    const custom = Utils.storage.get(this.CLE.OBJECTIFS(), null);
    return custom || auto;
  },

  sauvegarderObjectifs(obj) {
    Utils.storage.set(this.CLE.OBJECTIFS(), obj);
  },

  // ════════════════════════════════════════════════════════
  // REPAS
  // ════════════════════════════════════════════════════════
  getRepas(date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(this.CLE.REPAS(d), []);
  },

  ajouterRepas(aliment, quantite, repasType = 'dejeuner', date = null) {
    const d      = date || Utils.aujourd_hui();
    const repas  = this.getRepas(d);
    const factor = quantite / 100;

    repas.push({
      id:        Date.now().toString(),
      timestamp: Date.now(),
      repasType,
      nom:       aliment.nom,
      emoji:     aliment.emoji || '🍽️',
      quantite,
      cal:   Math.round((aliment.cal  || 0) * factor),
      prot:  Math.round((aliment.prot || 0) * factor * 10) / 10,
      gluc:  Math.round((aliment.gluc || 0) * factor * 10) / 10,
      lip:   Math.round((aliment.lip  || 0) * factor * 10) / 10
    });

    Utils.storage.set(this.CLE.REPAS(d), repas);
    return repas;
  },

  supprimerRepas(id, date = null) {
    const d     = date || Utils.aujourd_hui();
    const repas = this.getRepas(d).filter(r => r.id !== id);
    Utils.storage.set(this.CLE.REPAS(d), repas);
  },

  getTotauxJour(date = null) {
    const repas = this.getRepas(date);
    return repas.reduce((acc, r) => ({
      cal:  acc.cal  + (r.cal  || 0),
      prot: acc.prot + (r.prot || 0),
      gluc: acc.gluc + (r.gluc || 0),
      lip:  acc.lip  + (r.lip  || 0)
    }), { cal:0, prot:0, gluc:0, lip:0 });
  },

  // ════════════════════════════════════════════════════════
  // HYDRATATION
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
  // HISTORIQUE
  // ════════════════════════════════════════════════════════
  getHistorique(nbJours = 7) {
    const result = [];
    for (let i = nbJours - 1; i >= 0; i--) {
      const date   = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const totaux = this.getTotauxJour(date);
      const eau    = this.getEau(date);
      result.push({ date, label: Utils.formatDateCourt(date),
        ...totaux, eau });
    }
    return result;
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  _tabActif: 'dashboard',

  render(container) {
    if (!container) return;

    const tabs = [
      { id:'dashboard',   label:'📊 Dashboard'   },
      { id:'repas',       label:'🍽️ Repas'        },
      { id:'hydratation', label:'💧 Eau'          },
      { id:'historique',  label:'📈 Historique'   },
      { id:'objectifs',   label:'🎯 Objectifs'    }
    ];

    container.innerHTML = `
      <div class="tabs-container" style="overflow-x:auto;
           display:flex;gap:4px;padding-bottom:4px">
        ${tabs.map(t => `
          <button class="tab-btn ${this._tabActif===t.id?'active':''}"
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
    document.querySelectorAll('.tabs-container .tab-btn')
      .forEach(btn => {
        btn.classList.toggle(
          'active',
          btn.textContent.includes(
            { dashboard:'Dashboard', repas:'Repas',
              hydratation:'Eau', historique:'Historique',
              objectifs:'Objectifs' }[tab] || ''
          )
        );
      });
    this._renderTab();
  },

  _renderTab() {
    const el = document.getElementById('nutrition-content');
    if (!el) return;
    switch(this._tabActif) {
      case 'dashboard':   this._renderDashboard(el);   break;
      case 'repas':       this._renderRepas(el);       break;
      case 'hydratation': this._renderHydratation(el); break;
      case 'historique':  this._renderHistorique(el);  break;
      case 'objectifs':   this._renderObjectifs(el);   break;
    }
  },

  // ════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════
  _renderDashboard(el) {
    const obj    = this.getObjectifs();
    const totaux = this.getTotauxJour();
    const eau    = this.getEau();
    const eauObj = Math.round(obj.eau * 1000); // en ml

    const pctCal  = Math.min(100, Math.round((totaux.cal  / Math.max(obj.calories,1))  * 100));
    const pctProt = Math.min(100, Math.round((totaux.prot / Math.max(obj.proteines,1)) * 100));
    const pctGluc = Math.min(100, Math.round((totaux.gluc / Math.max(obj.glucides,1))  * 100));
    const pctLip  = Math.min(100, Math.round((totaux.lip  / Math.max(obj.lipides,1))   * 100));
    const pctEau  = Math.min(100, Math.round((eau          / Math.max(eauObj,1))         * 100));

    // Score nutrition du jour
    const score = Math.round((pctCal + pctProt + pctGluc + pctLip + pctEau) / 5);

    // Repas du jour groupés
    const repas    = this.getRepas();
    const repasTypes = {
      petit_dejeuner: { label:'🌅 Petit-déjeuner', items:[] },
      dejeuner:       { label:'☀️ Déjeuner',        items:[] },
      collation:      { label:'🍎 Collation',        items:[] },
      diner:          { label:'🌙 Dîner',            items:[] }
    };
    repas.forEach(r => {
      if (repasTypes[r.repasType]) {
        repasTypes[r.repasType].items.push(r);
      }
    });

    el.innerHTML = `

      <!-- Score du jour -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),
                  rgba(139,240,187,0.05));
                  border-color:var(--fd-indigo);
                  text-align:center">
        <div style="font-size:.68rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--fd-indigo);margin-bottom:4px">
          Score nutrition du jour
        </div>
        <div style="font-size:2.5rem;font-weight:800;
                    color:${score >= 80 ? 'var(--fd-mint)'
                          : score >= 50 ? 'var(--fd-lemon)'
                          : 'var(--fd-coral)'}">
          ${score}%
        </div>
        <div style="font-size:.75rem;color:var(--text-muted);
                    margin-top:2px">
          ${score >= 80 ? '🔥 Excellente journée !'
          : score >= 50 ? '💪 Bonne progression'
          : '📈 Encore des efforts'}
        </div>
      </div>

      <!-- Calories -->
      <div class="card mb-md">
        <div class="flex justify-between items-center mb-sm">
          <div class="card-label" style="margin:0">🔥 Calories</div>
          <div style="font-size:.82rem;font-weight:700;
                      color:var(--fd-lemon)">
            ${totaux.cal} / ${obj.calories} kcal
          </div>
        </div>
        <div style="height:10px;background:var(--bg-input);
                    border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${pctCal}%;
                      background:${pctCal > 110
                        ? 'var(--fd-coral)'
                        : pctCal >= 90
                          ? 'var(--fd-mint)'
                          : 'var(--fd-lemon)'};
                      border-radius:99px;
                      transition:width .8s ease">
          </div>
        </div>
        <div style="font-size:.68rem;color:var(--text-muted);
                    margin-top:4px">
          ${obj.calories - totaux.cal > 0
            ? `Encore ${obj.calories - totaux.cal} kcal`
            : `Objectif atteint ! 🎉`}
        </div>
      </div>

      <!-- Macros -->
      <div class="card mb-md">
        <div class="card-label">⚖️ Macronutriments</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm);margin-top:var(--space-sm)">
          ${[
            { label:'Protéines', val:totaux.prot, obj:obj.proteines,
              pct:pctProt, color:'var(--fd-coral)',   unit:'g', emoji:'💪' },
            { label:'Glucides',  val:totaux.gluc, obj:obj.glucides,
              pct:pctGluc, color:'var(--fd-lemon)',   unit:'g', emoji:'⚡' },
            { label:'Lipides',   val:totaux.lip,  obj:obj.lipides,
              pct:pctLip,  color:'var(--fd-lavender)', unit:'g', emoji:'🧈' }
          ].map(m => `
            <div style="text-align:center;padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-md)">
              <div style="font-size:.85rem;margin-bottom:4px">
                ${m.emoji}
              </div>
              <div style="font-size:1rem;font-weight:800;
                          color:${m.color}">
                ${m.val}${m.unit}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                / ${m.obj}${m.unit}
              </div>
              <div style="height:4px;background:rgba(255,255,255,0.1);
                          border-radius:99px;margin-top:6px;
                          overflow:hidden">
                <div style="height:100%;width:${m.pct}%;
                            background:${m.color};border-radius:99px">
                </div>
              </div>
              <div style="font-size:.6rem;color:${m.color};
                          margin-top:2px;font-weight:600">
                ${m.pct}%
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Eau rapide -->
      <div class="card mb-md">
        <div class="flex justify-between items-center mb-sm">
          <div class="card-label" style="margin:0">💧 Hydratation</div>
          <div style="font-size:.82rem;font-weight:700;
                      color:var(--fd-indigo)">
            ${(eau/1000).toFixed(1)}L / ${obj.eau}L
          </div>
        </div>
        <div style="height:8px;background:var(--bg-input);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:var(--space-sm)">
          <div style="height:100%;width:${pctEau}%;
                      background:var(--fd-indigo);
                      border-radius:99px;transition:width .8s">
          </div>
        </div>
        <div style="display:flex;gap:6px">
          ${[150, 250, 500].map(ml => `
            <button onclick="Nutrition._ajouterEauRapide(${ml})"
                    style="flex:1;padding:8px 4px;
                           font-size:.72rem;font-weight:700;
                           background:rgba(75,75,249,0.12);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:var(--radius-full);
                           color:var(--fd-indigo);cursor:pointer">
              +${ml}ml
            </button>`).join('')}
        </div>
      </div>

      <!-- Repas du jour résumé -->
      <div class="card mb-md">
        <div class="flex justify-between items-center mb-sm">
          <div class="card-label" style="margin:0">
            🍽️ Repas du jour
          </div>
          <button onclick="Nutrition._setTab('repas')"
                  style="background:none;border:none;
                         font-size:.72rem;color:var(--fd-indigo);
                         cursor:pointer;font-weight:600">
            Ajouter +
          </button>
        </div>
        ${repas.length === 0 ? `
          <div style="text-align:center;padding:var(--space-md);
                      color:var(--text-muted);font-size:.82rem">
            Aucun repas enregistré aujourd'hui
          </div>` :
          Object.entries(repasTypes)
            .filter(([, v]) => v.items.length > 0)
            .map(([, v]) => `
              <div style="margin-bottom:var(--space-sm)">
                <div style="font-size:.72rem;font-weight:700;
                            color:var(--text-muted);
                            margin-bottom:4px">
                  ${v.label}
                </div>
                ${v.items.map(item => `
                  <div style="display:flex;justify-content:space-between;
                              align-items:center;padding:4px 0;
                              border-bottom:1px solid var(--border-color);
                              font-size:.78rem">
                    <span>${item.emoji} ${item.nom}
                      <span style="color:var(--text-muted);font-size:.65rem">
                        (${item.quantite}g)
                      </span>
                    </span>
                    <div style="text-align:right">
                      <span style="color:var(--fd-lemon);font-weight:600">
                        ${item.cal}kcal
                      </span>
                      <button onclick="Nutrition._supprimerRepas('${item.id}')"
                              style="background:none;border:none;
                                     color:var(--fd-coral);font-size:.8rem;
                                     cursor:pointer;margin-left:6px">
                        ✕
                      </button>
                    </div>
                  </div>`).join('')}
              </div>`).join('')}
      </div>

      <!-- Conseil du jour -->
      ${this._getConseilNutrition(totaux, obj)}
    `;
  },

  // ════════════════════════════════════════════════════════
  // REPAS
  // ════════════════════════════════════════════════════════
  _renderRepas(el) {
    const repasTypes = [
      { val:'petit_dejeuner', label:'🌅 Petit-déjeuner' },
      { val:'dejeuner',       label:'☀️ Déjeuner'        },
      { val:'collation',      label:'🍎 Collation'       },
      { val:'diner',          label:'🌙 Dîner'           }
    ];

    el.innerHTML = `

      <!-- Ajouter un aliment -->
      <div class="card mb-md">
        <div class="card-label">➕ Ajouter un aliment</div>

        <!-- Type de repas -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:6px;margin-top:var(--space-sm);
                    margin-bottom:var(--space-sm)">
          ${repasTypes.map(t => `
            <button data-repas-type="${t.val}"
                    onclick="Nutrition._selectRepasType('${t.val}', this)"
                    style="padding:8px;font-size:.72rem;font-weight:600;
                           background:${t.val === 'dejeuner'
                             ? 'var(--fd-indigo)'
                             : 'var(--bg-input)'};
                           color:${t.val === 'dejeuner'
                             ? 'white'
                             : 'var(--text-muted)'};
                           border:1px solid ${t.val === 'dejeuner'
                             ? 'var(--fd-indigo)'
                             : 'var(--border-color)'};
                           border-radius:var(--radius-sm);
                           cursor:pointer">
              ${t.label}
            </button>`).join('')}
        </div>
        <input type="hidden" id="repas-type-selectionne" value="dejeuner" />

        <!-- Recherche aliment -->
        <div class="input-label">Rechercher un aliment</div>
        <div style="position:relative">
          <input class="input mt-sm" id="aliment-search"
                 placeholder="🔍 Poulet, riz, œufs..."
                 oninput="Nutrition._rechercherAliment(this.value)"
                 autocomplete="off" />
          <div id="aliment-suggestions"
               style="position:absolute;top:100%;left:0;right:0;
                      background:var(--bg-card);
                      border:1px solid var(--border-color);
                      border-radius:var(--radius-md);
                      max-height:200px;overflow-y:auto;
                      z-index:100;display:none">
          </div>
        </div>

        <!-- Aliment sélectionné -->
        <div id="aliment-selectionne" style="display:none;
             margin-top:var(--space-sm);padding:var(--space-sm);
             background:rgba(75,75,249,0.08);
             border:1px solid rgba(75,75,249,0.2);
             border-radius:var(--radius-md)">
          <div id="aliment-info" style="font-size:.82rem;font-weight:600;
               margin-bottom:var(--space-sm)"></div>
          <div style="display:flex;gap:var(--space-sm);
                      align-items:center">
            <div style="flex:1">
              <div class="input-label">Quantité (g)</div>
              <input type="number" class="input mt-sm"
                     id="aliment-quantite"
                     value="100" min="1" max="2000"
                     oninput="Nutrition._updatePreview()"
                     style="text-align:center;font-size:1rem;
                            font-weight:700" />
            </div>
            <div id="aliment-preview"
                 style="flex:1;text-align:center;
                        padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
            </div>
          </div>
          <button onclick="Nutrition._validerAjout()"
                  class="btn-primary mt-sm"
                  style="width:100%">
            ✅ Ajouter
          </button>
        </div>

        <!-- Aliment custom -->
        <button onclick="Nutrition._toggleAjoutCustom()"
                class="btn-secondary mt-sm"
                style="width:100%;font-size:.75rem">
          ✏️ Créer un aliment personnalisé
        </button>

        <!-- Formulaire aliment custom -->
        <div id="ajout-custom" style="display:none;
             margin-top:var(--space-sm)">
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:var(--space-sm)">
            <div>
              <div class="input-label">Nom *</div>
              <input class="input mt-sm" id="custom-nom"
                     placeholder="Mon aliment" />
            </div>
            <div>
              <div class="input-label">Calories /100g *</div>
              <input type="number" class="input mt-sm"
                     id="custom-cal" placeholder="150" />
            </div>
            <div>
              <div class="input-label">Protéines (g)</div>
              <input type="number" class="input mt-sm"
                     id="custom-prot" placeholder="20" step="0.1" />
            </div>
            <div>
              <div class="input-label">Glucides (g)</div>
              <input type="number" class="input mt-sm"
                     id="custom-gluc" placeholder="10" step="0.1" />
            </div>
            <div>
              <div class="input-label">Lipides (g)</div>
              <input type="number" class="input mt-sm"
                     id="custom-lip" placeholder="5" step="0.1" />
            </div>
            <div>
              <div class="input-label">Emoji</div>
              <input class="input mt-sm" id="custom-emoji"
                     placeholder="🍽️" maxlength="2" />
            </div>
          </div>
          <button onclick="Nutrition._sauvegarderAlimentCustom()"
                  class="btn-primary mt-sm"
                  style="width:100%;font-size:.82rem">
            💾 Sauvegarder l'aliment
          </button>
        </div>
      </div>

      <!-- Liste repas du jour -->
      ${this._renderListeRepasParType()}
    `;
  },

  _renderListeRepasParType() {
    const repas = this.getRepas();
    const types = {
      petit_dejeuner: { label:'🌅 Petit-déjeuner', items:[] },
      dejeuner:       { label:'☀️ Déjeuner',        items:[] },
      collation:      { label:'🍎 Collation',        items:[] },
      diner:          { label:'🌙 Dîner',            items:[] }
    };

    repas.forEach(r => {
      if (types[r.repasType]) types[r.repasType].items.push(r);
    });

    const totalJour = this.getTotauxJour();

    return `
      ${Object.entries(types).map(([, v]) => {
        if (!v.items.length) return '';
        const totType = v.items.reduce(
          (a, r) => ({ cal:a.cal+r.cal, prot:a.prot+r.prot,
                       gluc:a.gluc+r.gluc, lip:a.lip+r.lip }),
          { cal:0, prot:0, gluc:0, lip:0 }
        );
        return `
          <div class="card mb-md">
            <div class="flex justify-between items-center mb-sm">
              <div class="card-label" style="margin:0">
                ${v.label}
              </div>
              <div style="font-size:.75rem;font-weight:700;
                          color:var(--fd-lemon)">
                ${totType.cal} kcal
              </div>
            </div>
            ${v.items.map(item => `
              <div style="display:flex;justify-content:space-between;
                          align-items:center;padding:var(--space-xs) 0;
                          border-bottom:1px solid var(--border-color)">
                <div>
                  <div style="font-size:.82rem;font-weight:600">
                    ${item.emoji} ${item.nom}
                  </div>
                  <div style="font-size:.65rem;color:var(--text-muted)">
                    ${item.quantite}g ·
                    P:${item.prot}g ·
                    G:${item.gluc}g ·
                    L:${item.lip}g
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:.78rem;font-weight:700;
                               color:var(--fd-lemon)">
                    ${item.cal}kcal
                  </span>
                  <button onclick="Nutrition._supprimerRepas('${item.id}')"
                          style="background:none;border:none;
                                 color:var(--fd-coral);font-size:.9rem;
                                 cursor:pointer">✕</button>
                </div>
              </div>`).join('')}
          </div>`;
      }).join('')}

      ${repas.length > 0 ? `
        <div class="card mb-md"
             style="background:rgba(75,75,249,0.05);
                    border-color:rgba(75,75,249,0.2);
                    text-align:center">
          <div style="font-size:.72rem;font-weight:700;
                      color:var(--fd-indigo);margin-bottom:4px">
            TOTAL DU JOUR
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);
                      gap:var(--space-xs)">
            ${[
              { label:'Calories', val:`${totalJour.cal}kcal`,
                color:'var(--fd-lemon)'    },
              { label:'Protéines', val:`${totalJour.prot}g`,
                color:'var(--fd-coral)'   },
              { label:'Glucides',  val:`${totalJour.gluc}g`,
                color:'var(--fd-mint)'    },
              { label:'Lipides',   val:`${totalJour.lip}g`,
                color:'var(--fd-lavender)'}
            ].map(s => `
              <div>
                <div style="font-size:.85rem;font-weight:800;
                            color:${s.color}">
                  ${s.val}
                </div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  ${s.label}
                </div>
              </div>`).join('')}
          </div>
        </div>` : `
        <div class="card"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem">🍽️</div>
          <div style="color:var(--text-muted);font-size:.85rem;
                      margin-top:var(--space-sm)">
            Aucun repas aujourd'hui.<br>Ajoute ton premier repas !
          </div>
        </div>`}
    `;
  },

  // ════════════════════════════════════════════════════════
  // HYDRATATION
  // ════════════════════════════════════════════════════════
  _renderHydratation(el) {
    const obj    = this.getObjectifs();
    const eau    = this.getEau();
    const eauObj = Math.round(obj.eau * 1000);
    const pct    = Math.min(100, Math.round((eau / eauObj) * 100));
    const verres = Math.round(eau / 250);
    const vergObj = Math.round(eauObj / 250);

    // Historique eau 7j
    const hist = this.getHistorique(7);

    el.innerHTML = `

      <!-- Jauge principale -->
      <div class="card mb-md"
           style="text-align:center;
                  border-color:var(--fd-indigo)">
        <div style="font-size:.72rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--fd-indigo);margin-bottom:var(--space-md)">
          💧 Hydratation du jour
        </div>

        <!-- Cercle SVG -->
        <div style="position:relative;width:160px;height:160px;
                    margin:0 auto var(--space-md)">
          <svg width="160" height="160"
               style="transform:rotate(-90deg)">
            <circle cx="80" cy="80" r="70"
                    fill="none"
                    stroke="var(--bg-input)"
                    stroke-width="10"/>
            <circle cx="80" cy="80" r="70"
                    fill="none"
                    stroke="var(--fd-indigo)"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 70}"
                    stroke-dashoffset="${2 * Math.PI * 70 * (1 - pct/100)}"
                    style="transition:stroke-dashoffset 1s ease"/>
          </svg>
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);
                      text-align:center">
            <div style="font-size:1.8rem;font-weight:800;
                        color:var(--fd-indigo)">
              ${(eau/1000).toFixed(1)}L
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              / ${obj.eau}L
            </div>
          </div>
        </div>

        <!-- Verres -->
        <div style="display:flex;justify-content:center;
                    flex-wrap:wrap;gap:6px;margin-bottom:var(--space-md)">
          ${Array.from({ length: Math.max(vergObj, verres) }, (_,i) => `
            <span style="font-size:1.4rem;
                         opacity:${i < verres ? '1' : '0.2'}">
              💧
            </span>`).join('')}
        </div>

        <div style="font-size:.82rem;color:var(--text-muted)">
          ${verres} verre${verres > 1 ? 's' : ''} sur ${vergObj}
          · ${pct}% de l'objectif
        </div>
      </div>

      <!-- Boutons ajout rapide -->
      <div class="card mb-md">
        <div class="card-label">Ajouter rapidement</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);
                    gap:var(--space-sm);margin-top:var(--space-sm)">
          ${[
            { ml:150, label:'Petit\nverre',   emoji:'🥃' },
            { ml:250, label:'Verre',          emoji:'🥤' },
            { ml:330, label:'Canette',        emoji:'🧃' },
            { ml:500, label:'Bouteille',      emoji:'🍶' }
          ].map(b => `
            <button onclick="Nutrition._ajouterEauRapide(${b.ml})"
                    style="padding:var(--space-sm) 4px;
                           text-align:center;
                           background:rgba(75,75,249,0.08);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:var(--radius-md);
                           cursor:pointer">
              <div style="font-size:1.5rem">${b.emoji}</div>
              <div style="font-size:.65rem;color:var(--fd-indigo);
                          font-weight:700;margin-top:2px">
                +${b.ml}ml
              </div>
              <div style="font-size:.58rem;color:var(--text-muted)">
                ${b.label}
              </div>
            </button>`).join('')}
        </div>

        <!-- Saisie manuelle -->
        <div style="display:flex;gap:var(--space-sm);
                    margin-top:var(--space-sm);
                    align-items:center">
          <input type="number" class="input"
                 id="eau-custom-ml"
                 placeholder="Quantité (ml)"
                 min="1" max="2000"
                 style="flex:1;text-align:center" />
          <button onclick="Nutrition._ajouterEauCustom()"
                  class="btn-primary"
                  style="flex-shrink:0;font-size:.82rem;
                         padding:var(--space-sm) var(--space-md)">
            + Ajouter
          </button>
        </div>

        ${eau > 0 ? `
          <button onclick="Nutrition._resetEau()"
                  class="btn-secondary mt-sm"
                  style="width:100%;font-size:.75rem;
                         color:var(--fd-coral)">
            🔄 Remettre à zéro
          </button>` : ''}
      </div>

      <!-- Historique eau 7j -->
      <div class="card mb-md">
        <div class="card-label">📅 7 derniers jours</div>
        <div style="margin-top:var(--space-sm)">
          ${hist.map(h => {
            const pctH = Math.min(100,
              Math.round((h.eau / Math.max(eauObj,1)) * 100)
            );
            return `
              <div style="display:flex;align-items:center;
                          gap:var(--space-sm);margin-bottom:6px">
                <div style="width:32px;font-size:.65rem;
                            color:var(--text-muted);flex-shrink:0">
                  ${h.label}
                </div>
                <div style="flex:1;height:16px;
                            background:var(--bg-input);
                            border-radius:8px;overflow:hidden">
                  <div style="height:100%;width:${pctH}%;
                              background:${pctH >= 100
                                ? 'var(--fd-mint)'
                                : pctH >= 60
                                  ? 'var(--fd-indigo)'
                                  : 'rgba(75,75,249,0.4)'};
                              border-radius:8px;
                              transition:width .5s">
                  </div>
                </div>
                <div style="width:36px;font-size:.65rem;
                            font-weight:700;color:var(--fd-indigo);
                            text-align:right;flex-shrink:0">
                  ${(h.eau/1000).toFixed(1)}L
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Conseils hydratation -->
      <div class="card"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div style="font-size:.75rem;color:var(--text-muted);
                    line-height:1.7">
          💡 <strong style="color:var(--fd-indigo)">
            Conseils hydratation
          </strong><br>
          • Bois 500ml avant l'entraînement<br>
          • Bois 150-250ml toutes les 15-20 min pendant l'effort<br>
          • Rehydrate avec 150% du poids perdu après séance<br>
          • Urine jaune pâle = bien hydraté ✅
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE
  // ════════════════════════════════════════════════════════
  _renderHistorique(el) {
    const hist   = this.getHistorique(14);
    const obj    = this.getObjectifs();

    el.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">📈 Calories — 14 jours</div>
        <canvas id="chart-nutrition-cal"
                height="160"
                style="margin-top:var(--space-sm)">
        </canvas>
      </div>

      <div class="card mb-md">
        <div class="card-label">💪 Protéines — 14 jours</div>
        <canvas id="chart-nutrition-prot"
                height="140"
                style="margin-top:var(--space-sm)">
        </canvas>
      </div>

      <div class="card mb-md">
        <div class="card-label">💧 Hydratation — 14 jours</div>
        <canvas id="chart-nutrition-eau"
                height="140"
                style="margin-top:var(--space-sm)">
        </canvas>
      </div>

      <!-- Tableau récap -->
      <div class="card">
        <div class="card-label mb-sm">📋 Récapitulatif</div>
        <div style="overflow-x:auto">
          <table style="width:100%;font-size:.72rem;
                        border-collapse:collapse">
            <thead>
              <tr style="color:var(--text-muted)">
                <th style="text-align:left;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  Date
                </th>
                <th style="text-align:right;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  Cal
                </th>
                <th style="text-align:right;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  Prot
                </th>
                <th style="text-align:right;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  Gluc
                </th>
                <th style="text-align:right;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  Lip
                </th>
                <th style="text-align:right;padding:6px 4px;
                           border-bottom:1px solid var(--border-color)">
                  💧
                </th>
              </tr>
            </thead>
            <tbody>
              ${[...hist].reverse().map(h => {
                const ok = h.cal >= obj.calories * 0.85;
                return `
                  <tr>
                    <td style="padding:5px 4px;
                               border-bottom:1px solid var(--border-color);
                               color:var(--text-muted)">
                      ${h.label}
                    </td>
                    <td style="padding:5px 4px;text-align:right;
                               border-bottom:1px solid var(--border-color);
                               font-weight:${ok?'700':'400'};
                               color:${h.cal>0
                                 ? (ok?'var(--fd-mint)':'var(--fd-lemon)')
                                 : 'var(--text-muted)'}">
                      ${h.cal || '—'}
                    </td>
                    <td style="padding:5px 4px;text-align:right;
                               border-bottom:1px solid var(--border-color);
                               color:${h.prot>0
                                 ? 'var(--fd-coral)'
                                 : 'var(--text-muted)'}">
                      ${h.prot || '—'}g
                    </td>
                    <td style="padding:5px 4px;text-align:right;
                               border-bottom:1px solid var(--border-color);
                               color:var(--text-secondary)">
                      ${h.gluc || '—'}g
                    </td>
                    <td style="padding:5px 4px;text-align:right;
                               border-bottom:1px solid var(--border-color);
                               color:var(--text-secondary)">
                      ${h.lip || '—'}g
                    </td>
                    <td style="padding:5px 4px;text-align:right;
                               border-bottom:1px solid var(--border-color);
                               color:var(--fd-indigo)">
                      ${h.eau > 0 ? (h.eau/1000).toFixed(1)+'L' : '—'}
                    </td>
                  </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Graphiques
    requestAnimationFrame(() => {
      this._renderCharts(hist, obj);
    });
  },

  _renderCharts(hist, obj) {
    try {
      const labels = hist.map(h => h.label);

      // Calories
      const cCal = document.getElementById('chart-nutrition-cal');
      if (cCal && window.Chart) {
        new Chart(cCal, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Calories',
                data:  hist.map(h => h.cal),
                backgroundColor: hist.map(h =>
                  h.cal >= obj.calories * 0.85
                    ? 'rgba(139,240,187,0.7)'
                    : 'rgba(75,75,249,0.5)'
                ),
                borderColor: hist.map(h =>
                  h.cal >= obj.calories * 0.85
                    ? '#8bf0bb' : '#4b4bf9'
                ),
                borderWidth: 2,
                borderRadius: 4
              },
              {
                label: 'Objectif',
                data:  hist.map(() => obj.calories),
                type:  'line',
                borderColor:     '#f9ef77',
                borderWidth:     2,
                borderDash:      [5, 5],
                pointRadius:     0,
                fill:            false
              }
            ]
          },
          options: this._chartOptions()
        });
      }

      // Protéines
      const cProt = document.getElementById('chart-nutrition-prot');
      if (cProt && window.Chart) {
        new Chart(cProt, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              data:            hist.map(h => h.prot),
              borderColor:     '#ff8d96',
              backgroundColor: 'rgba(255,141,150,0.1)',
              borderWidth:     2,
              pointRadius:     4,
              pointBackgroundColor: '#ff8d96',
              tension:         0.4,
              fill:            true
            }]
          },
          options: this._chartOptions()
        });
      }

      // Eau
      const cEau = document.getElementById('chart-nutrition-eau');
      if (cEau && window.Chart) {
        new Chart(cEau, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              data:            hist.map(h => h.eau / 1000),
              backgroundColor: hist.map(h =>
                h.eau >= obj.eau * 1000 * 0.8
                  ? 'rgba(75,75,249,0.7)'
                  : 'rgba(75,75,249,0.3)'
              ),
              borderColor:  '#4b4bf9',
              borderWidth:  2,
              borderRadius: 4
            }]
          },
          options: this._chartOptions({
            scales: {
              x: {
                ticks: { color:'#888', font:{ size:10 } },
                grid:  { color:'rgba(255,255,255,0.05)' }
              },
              y: {
                ticks: {
                  color:'#888', font:{ size:10 },
                  callback: v => `${v}L`
                },
                grid: { color:'rgba(255,255,255,0.05)' }
              }
            }
          })
        });
      }
    } catch(e) {
      console.warn('[Nutrition] Erreur charts:', e);
    }
  },

  _chartOptions(overrides = {}) {
    return {
      responsive:          true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#09092d',
          titleColor:      '#ffffff',
          bodyColor:       '#bfa1ff',
          borderColor:     '#4b4bf9',
          borderWidth:     1
        }
      },
      scales: {
        x: {
          ticks: { color:'#888', font:{ size:10 } },
          grid:  { color:'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color:'#888', font:{ size:10 } },
          grid:  { color:'rgba(255,255,255,0.05)' }
        }
      },
      ...overrides
    };
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS
  // ════════════════════════════════════════════════════════
  _renderObjectifs(el) {
    const auto = this.calculerObjectifsAuto();
    const obj  = this.getObjectifs();

    el.innerHTML = `

      <!-- Recommandés auto -->
      <div class="card mb-md"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div class="card-label">
          🤖 Recommandés pour ton profil
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);
                    gap:var(--space-sm);margin-top:var(--space-sm)">
          ${[
            { label:'Calories',   val:`${auto.calories} kcal`, color:'var(--fd-lemon)'    },
            { label:'Protéines',  val:`${auto.proteines} g`,   color:'var(--fd-coral)'    },
            { label:'Glucides',   val:`${auto.glucides} g`,    color:'var(--fd-mint)'     },
            { label:'Lipides',    val:`${auto.lipides} g`,     color:'var(--fd-lavender)' },
            { label:'Eau',        val:`${auto.eau} L`,         color:'var(--fd-indigo)'   }
          ].map(s => `
            <div style="padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        text-align:center">
              <div style="font-size:.88rem;font-weight:700;
                          color:${s.color}">
                ${s.val}
              </div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                ${s.label}
              </div>
            </div>`).join('')}
        </div>
        <button onclick="Nutrition._appliquerObjectifsAuto()"
                class="btn-secondary mt-md"
                style="width:100%;font-size:.78rem">
          ✅ Utiliser ces valeurs
        </button>
      </div>

      <!-- Personnaliser -->
      <div class="card mb-md">
        <div class="card-label">✏️ Personnaliser</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            { id:'obj-calories',  label:'🔥 Calories (kcal)', val:obj.calories,  step:50  },
            { id:'obj-proteines', label:'💪 Protéines (g)',    val:obj.proteines, step:5   },
            { id:'obj-glucides',  label:'⚡ Glucides (g)',     val:obj.glucides,  step:5   },
            { id:'obj-lipides',   label:'🧈 Lipides (g)',      val:obj.lipides,   step:2   },
            { id:'obj-eau',       label:'💧 Eau (L)',          val:obj.eau,       step:0.1 }
          ].map(f => `
            <div style="display:flex;align-items:center;
                        justify-content:space-between;
                        padding:var(--space-sm) 0;
                        border-bottom:1px solid var(--border-color)">
              <span style="font-size:.82rem">${f.label}</span>
              <input type="number"
                     id="${f.id}"
                     class="input"
                     value="${f.val}"
                     step="${f.step}"
                     style="width:90px;text-align:center;
                            font-weight:700;font-size:.88rem;
                            padding:4px 8px" />
            </div>`).join('')}
        </div>
        <button onclick="Nutrition._sauvegarderObjectifsCustom()"
                class="btn-primary mt-md"
                style="width:100%">
          💾 Sauvegarder mes objectifs
        </button>
      </div>

      <!-- Info calcul -->
      <div class="card"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div style="font-size:.75rem;color:var(--text-muted);
                    line-height:1.7">
          📊 <strong style="color:var(--fd-indigo)">
            Comment c'est calculé ?
          </strong><br>
          • Formule Mifflin-St Jeor pour ton métabolisme de base<br>
          • Ajusté selon ton niveau d'activité<br>
          • Macros adaptés à ton objectif (${
            (Tracker.getProfil?.()?.objectif || 'forme')
              .replace('_',' ')
          })<br>
          • Modifie ton profil pour recalculer automatiquement
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS
  // ════════════════════════════════════════════════════════
  _alimentActuel: null,

  _selectRepasType(val, btn) {
    document.getElementById('repas-type-selectionne').value = val;
    document.querySelectorAll('[data-repas-type]').forEach(b => {
      b.style.background = 'var(--bg-input)';
      b.style.color      = 'var(--text-muted)';
      b.style.borderColor = 'var(--border-color)';
    });
    btn.style.background  = 'var(--fd-indigo)';
    btn.style.color       = 'white';
    btn.style.borderColor = 'var(--fd-indigo)';
  },

  _rechercherAliment(q) {
    const box = document.getElementById('aliment-suggestions');
    if (!box) return;

    if (!q || q.length < 2) {
      box.style.display = 'none';
      return;
    }

    // Chercher dans base + custom
    const custom   = Utils.storage.get(this.CLE.ALIMENTS(), []);
    const tous     = [...this.ALIMENTS_BASE, ...custom];
    const resultats = tous.filter(a =>
      a.nom.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8);

    if (!resultats.length) {
      box.style.display = 'none';
      return;
    }

    box.style.display = 'block';
    box.innerHTML = resultats.map((a, i) => `
      <div onclick="Nutrition._selectionnerAliment(${i})"
           data-idx="${i}"
           style="padding:10px var(--space-md);
                  cursor:pointer;font-size:.82rem;
                  border-bottom:1px solid var(--border-color);
                  display:flex;justify-content:space-between;
                  align-items:center"
           onmouseover="this.style.background='var(--bg-input)'"
           onmouseout="this.style.background='transparent'">
        <span>${a.emoji||'🍽️'} ${a.nom}</span>
        <span style="color:var(--fd-lemon);font-size:.72rem;
                     font-weight:700">
          ${a.cal}kcal/100g
        </span>
      </div>`).join('');

    // Stocker les résultats pour référence
    this._searchResults = resultats;
  },

  _selectionnerAliment(idx) {
    const aliment = this._searchResults?.[idx];
    if (!aliment) return;

    this._alimentActuel = aliment;

    const box = document.getElementById('aliment-suggestions');
    if (box) box.style.display = 'none';

    const search = document.getElementById('aliment-search');
    if (search) search.value = aliment.nom;

    const section = document.getElementById('aliment-selectionne');
    if (section) section.style.display = 'block';

    const info = document.getElementById('aliment-info');
    if (info) {
      info.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.5rem">${aliment.emoji||'🍽️'}</span>
          <div>
            <div style="font-weight:700">${aliment.nom}</div>
            <div style="font-size:.68rem;color:var(--text-muted)">
              Pour 100g : ${aliment.cal}kcal ·
              P:${aliment.prot}g ·
              G:${aliment.gluc}g ·
              L:${aliment.lip}g
            </div>
          </div>
        </div>`;
    }

    this._updatePreview();
  },

  _updatePreview() {
    const aliment  = this._alimentActuel;
    const quantite = parseFloat(
      document.getElementById('aliment-quantite')?.value
    ) || 100;

    if (!aliment) return;

    const factor  = quantite / 100;
    const preview = document.getElementById('aliment-preview');
    if (preview) {
      preview.innerHTML = `
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-bottom:2px">Pour ${quantite}g</div>
        <div style="font-size:1rem;font-weight:800;
                    color:var(--fd-lemon)">
          ${Math.round(aliment.cal * factor)} kcal
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:2px">
          P:${Math.round(aliment.prot*factor*10)/10}g ·
          G:${Math.round(aliment.gluc*factor*10)/10}g ·
          L:${Math.round(aliment.lip*factor*10)/10}g
        </div>`;
    }
  },

  _validerAjout() {
    const aliment  = this._alimentActuel;
    const quantite = parseFloat(
      document.getElementById('aliment-quantite')?.value
    ) || 100;
    const type = document.getElementById(
      'repas-type-selectionne'
    )?.value || 'dejeuner';

    if (!aliment) {
      Utils.toast('Sélectionne un aliment !', 'error');
      return;
    }

    this.ajouterRepas(aliment, quantite, type);
    Utils.toast(`✅ ${aliment.nom} ajouté !`, 'success', 1500);
    Utils.vibrerSuccess();

    // Reset
    this._alimentActuel = null;
    const search = document.getElementById('aliment-search');
    if (search) search.value = '';
    const section = document.getElementById('aliment-selectionne');
    if (section) section.style.display = 'none';

    // Refresh liste
    const listeEl = document.getElementById('nutrition-content');
    if (listeEl) this._renderRepas(listeEl);
  },

  _supprimerRepas(id) {
    this.supprimerRepas(id);
    const el = document.getElementById('nutrition-content');
    if (el) this._renderTab();
    Utils.toast('Repas supprimé.', 'info', 1500);
  },

  _ajouterEauRapide(ml) {
    const nouveau = this.ajouterEau(ml);
    Utils.toast(`💧 +${ml}ml (${(nouveau/1000).toFixed(1)}L)`,
      'success', 1500);
    Utils.vibrerSuccess();
    const el = document.getElementById('nutrition-content');
    if (el) this._renderTab();
  },

  _ajouterEauCustom() {
    const ml = parseInt(
      document.getElementById('eau-custom-ml')?.value
    );
    if (!ml || ml < 1) {
      Utils.toast('Entre une quantité valide !', 'error');
      return;
    }
    this._ajouterEauRapide(ml);
  },

  _resetEau() {
    Utils.storage.set(
      this.CLE.EAU(Utils.aujourd_hui()), 0
    );
    const el = document.getElementById('nutrition-content');
    if (el) this._renderTab();
    Utils.toast('Hydratation remise à zéro.', 'info', 1500);
  },

  _toggleAjoutCustom() {
    const el = document.getElementById('ajout-custom');
    if (!el) return;
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
  },

  _sauvegarderAlimentCustom() {
    const nom  = document.getElementById('custom-nom')?.value?.trim();
    const cal  = parseFloat(document.getElementById('custom-cal')?.value);
    const prot = parseFloat(document.getElementById('custom-prot')?.value)||0;
    const gluc = parseFloat(document.getElementById('custom-gluc')?.value)||0;
    const lip  = parseFloat(document.getElementById('custom-lip')?.value)||0;
    const emoji = document.getElementById('custom-emoji')?.value || '🍽️';

    if (!nom || isNaN(cal)) {
      Utils.toast('Nom et calories obligatoires !', 'error');
      return;
    }

    const custom = Utils.storage.get(this.CLE.ALIMENTS(), []);
    custom.push({ nom, cal, prot, gluc, lip, emoji,
      categorie:'custom' });
    Utils.storage.set(this.CLE.ALIMENTS(), custom);

    Utils.toast(`✅ "${nom}" sauvegardé !`, 'success');
    this._toggleAjoutCustom();
  },

  _appliquerObjectifsAuto() {
    const auto = this.calculerObjectifsAuto();
    // Supprimer les custom pour revenir à l'auto
    Utils.storage.set(this.CLE.OBJECTIFS(), null);
    Utils.toast('✅ Objectifs automatiques appliqués !', 'success');
    Utils.vibrerSuccess();
    const el = document.getElementById('nutrition-content');
    if (el) this._renderObjectifs(el);
  },

  _sauvegarderObjectifsCustom() {
    const cal  = parseFloat(
      document.getElementById('obj-calories')?.value);
    const prot = parseFloat(
      document.getElementById('obj-proteines')?.value);
    const gluc = parseFloat(
      document.getElementById('obj-glucides')?.value);
    const lip  = parseFloat(
      document.getElementById('obj-lipides')?.value);
    const eau  = parseFloat(
      document.getElementById('obj-eau')?.value);

    if ([cal,prot,gluc,lip,eau].some(isNaN)) {
      Utils.toast('Remplis tous les champs !', 'error');
      return;
    }

    this.sauvegarderObjectifs({
      calories:  cal,
      proteines: prot,
      glucides:  gluc,
      lipides:   lip,
      eau
    });

    Utils.toast('✅ Objectifs sauvegardés !', 'success');
    Utils.vibrerSuccess();
  },

  // ════════════════════════════════════════════════════════
  // CONSEIL NUTRITION
  // ════════════════════════════════════════════════════════
  _getConseilNutrition(totaux, obj) {
    let conseil = '';
    let couleur = 'var(--fd-lavender)';

    if (totaux.prot < obj.proteines * 0.7) {
      conseil = `💪 Tes protéines sont basses (${totaux.prot}g / ${obj.proteines}g). Ajoute du poulet, des œufs ou du fromage blanc.`;
      couleur = 'var(--fd-coral)';
    } else if (totaux.cal < obj.calories * 0.5 &&
               new Date().getHours() > 14) {
      conseil = `🔥 Tu es à ${totaux.cal}kcal sur ${obj.calories}kcal. Pense à manger pour alimenter tes séances !`;
      couleur = 'var(--fd-lemon)';
    } else if (totaux.cal > obj.calories * 1.1) {
      conseil = `⚠️ Tu dépasses ton objectif calorique (${totaux.cal}kcal). Reste attentif à tes prochains repas.`;
      couleur = 'var(--fd-coral)';
    } else if (totaux.prot >= obj.proteines * 0.9) {
      conseil = `✅ Excellente apport en protéines aujourd'hui ! Continue comme ça pour ta progression.`;
      couleur = 'var(--fd-mint)';
    } else {
      const conseilsGeneral = [
        '🥗 Privilege les aliments non transformés pour de meilleures performances.',
        '⏰ Mange tes glucides autour de l\'entraînement pour maximiser l\'énergie.',
        '🥚 Les œufs sont l\'une des meilleures sources de protéines complètes.',
        '🍌 Une banane avant l\'entraînement = énergie rapide et potassium.',
        '🌿 Les légumes verts sont riches en micronutriments essentiels à la récupération.'
      ];
      conseil = conseilsGeneral[
        new Date().getDay() % conseilsGeneral.length
      ];
    }

    return `
      <div class="card"
           style="border-left:3px solid ${couleur};
                  background:rgba(75,75,249,0.03)">
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:${couleur};margin-bottom:var(--space-xs)">
          💡 Conseil du jour
        </div>
        <p style="font-size:.82rem;color:var(--text-secondary);
                  line-height:1.5;margin:0">
          ${conseil}
        </p>
      </div>`;
  }
};

window.Nutrition = Nutrition;
console.log('✅ Nutrition.js v1.0 chargé');
