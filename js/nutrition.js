/* ============================================================
   PowerApp — Nutrition.js v1.0
   Suivi macros + Base aliments + Calcul automatique
   ============================================================ */

'use strict';

const Nutrition = {

  // ════════════════════════════════════════════════════════
  // BASE DE DONNÉES ALIMENTS
  // ════════════════════════════════════════════════════════
  ALIMENTS: {
    // ── PROTÉINES ────────────────────────────────────────
    poulet_blanc:    { nom:'Poulet blanc',      emoji:'🍗', cal:165, prot:31, gluc:0,  lip:3.6, unite:'g'  },
    boeuf_hache:     { nom:'Bœuf haché 5%',     emoji:'🥩', cal:137, prot:21, gluc:0,  lip:5,   unite:'g'  },
    thon_boite:      { nom:'Thon en boîte',     emoji:'🐟', cal:116, prot:26, gluc:0,  lip:1,   unite:'g'  },
    saumon:          { nom:'Saumon',            emoji:'🐠', cal:208, prot:20, gluc:0,  lip:13,  unite:'g'  },
    oeufs:           { nom:'Œuf entier',        emoji:'🥚', cal:155, prot:13, gluc:1,  lip:11,  unite:'100g'},
    blanc_oeuf:      { nom:'Blanc d\'œuf',      emoji:'🥚', cal:52,  prot:11, gluc:1,  lip:0,   unite:'g'  },
    whey:            { nom:'Whey protéine',     emoji:'🥛', cal:120, prot:24, gluc:3,  lip:2,   unite:'g'  },
    cottage:         { nom:'Cottage cheese',   emoji:'🧀', cal:98,  prot:11, gluc:3,  lip:4,   unite:'g'  },
    yaourt_grec:     { nom:'Yaourt grec 0%',   emoji:'🥛', cal:59,  prot:10, gluc:4,  lip:0,   unite:'g'  },
    jambon:          { nom:'Jambon blanc',      emoji:'🥩', cal:107, prot:18, gluc:1,  lip:3,   unite:'g'  },

    // ── GLUCIDES ──────────────────────────────────────────
    riz_blanc:       { nom:'Riz blanc cuit',   emoji:'🍚', cal:130, prot:2.7,gluc:28, lip:0.3, unite:'g'  },
    pates:           { nom:'Pâtes cuites',     emoji:'🍝', cal:158, prot:6,  gluc:31, lip:1,   unite:'g'  },
    patate_douce:    { nom:'Patate douce',     emoji:'🍠', cal:86,  prot:1.6,gluc:20, lip:0,   unite:'g'  },
    avoine:          { nom:'Flocons d\'avoine',emoji:'🌾', cal:389, prot:17, gluc:66, lip:7,   unite:'g'  },
    pain_complet:    { nom:'Pain complet',     emoji:'🍞', cal:247, prot:9,  gluc:48, lip:3,   unite:'g'  },
    banane:          { nom:'Banane',           emoji:'🍌', cal:89,  prot:1,  gluc:23, lip:0,   unite:'g'  },
    pomme:           { nom:'Pomme',            emoji:'🍎', cal:52,  prot:0,  gluc:14, lip:0,   unite:'g'  },

    // ── LIPIDES ───────────────────────────────────────────
    huile_olive:     { nom:'Huile d\'olive',   emoji:'🫒', cal:884, prot:0,  gluc:0,  lip:100, unite:'ml' },
    amandes:         { nom:'Amandes',          emoji:'🌰', cal:579, prot:21, gluc:22, lip:50,  unite:'g'  },
    avocat:          { nom:'Avocat',           emoji:'🥑', cal:160, prot:2,  gluc:9,  lip:15,  unite:'g'  },
    beurre_cacah:    { nom:'Beurre cacahuète', emoji:'🥜', cal:588, prot:25, gluc:20, lip:50,  unite:'g'  },

    // ── LÉGUMES ───────────────────────────────────────────
    brocoli:         { nom:'Brocoli',          emoji:'🥦', cal:34,  prot:3,  gluc:7,  lip:0,   unite:'g'  },
    epinards:        { nom:'Épinards',         emoji:'🌿', cal:23,  prot:3,  gluc:4,  lip:0,   unite:'g'  },
    tomate:          { nom:'Tomate',           emoji:'🍅', cal:18,  prot:1,  gluc:4,  lip:0,   unite:'g'  },
    concombre:       { nom:'Concombre',        emoji:'🥒', cal:15,  prot:1,  gluc:4,  lip:0,   unite:'g'  },
    courgette:       { nom:'Courgette',        emoji:'🥬', cal:17,  prot:1,  gluc:3,  lip:0,   unite:'g'  },
  },

  // ════════════════════════════════════════════════════════
  // CALCULS
  // ════════════════════════════════════════════════════════
  calculerBesoins(profil) {
    const poids   = profil.poids   || 80;
    const taille  = profil.taille  || 175;
    const objectif= profil.objectif|| 'forme';

    // Formule Harris-Benedict
    const bmr = (10 * poids) + (6.25 * taille) - (5 * 25) + 5;

    // Facteur d'activité — sportif modéré
    const tdee = Math.round(bmr * 1.55);

    // Ajustements selon objectif
    const ajustements = {
      prise_masse: { cal: tdee + 300, prot: poids * 2.2, gluc: poids * 4,   lip: poids * 1   },
      perte_poids: { cal: tdee - 400, prot: poids * 2.5, gluc: poids * 2.5, lip: poids * 0.8 },
      seche:       { cal: tdee - 500, prot: poids * 2.8, gluc: poids * 2,   lip: poids * 0.7 },
      force:       { cal: tdee + 200, prot: poids * 2.4, gluc: poids * 3.5, lip: poids * 1   },
      endurance:   { cal: tdee + 100, prot: poids * 1.8, gluc: poids * 5,   lip: poids * 0.9 },
      forme:       { cal: tdee,       prot: poids * 2,   gluc: poids * 3,   lip: poids * 1   }
    };

    const base = ajustements[objectif] || ajustements.forme;

    return {
      calories: Math.round(base.cal),
      proteines: Math.round(base.prot),
      glucides:  Math.round(base.gluc),
      lipides:   Math.round(base.lip),
      eau:       Math.round(poids * 0.035 * 10) / 10
    };
  },

  calculerMacrosAliment(ref, quantite) {
    const aliment = this.ALIMENTS[ref];
    if (!aliment) return null;
    const ratio = quantite / 100;
    return {
      cal:  Math.round(aliment.cal  * ratio),
      prot: Math.round(aliment.prot * ratio * 10) / 10,
      gluc: Math.round(aliment.gluc * ratio * 10) / 10,
      lip:  Math.round(aliment.lip  * ratio * 10) / 10
    };
  },

  // ════════════════════════════════════════════════════════
  // STORAGE
  // ════════════════════════════════════════════════════════
  getJourActuel() {
    return Utils.storage.get(
      `ft_nutrition_${Utils.aujourd_hui()}`,
      { repas: [], eau: 0 }
    );
  },

  sauvegarderJour(data) {
    Utils.storage.set(
      `ft_nutrition_${Utils.aujourd_hui()}`,
      data
    );
  },

  ajouterAliment(ref, quantite, repas = 'dejeuner') {
    const jour   = this.getJourActuel();
    const macros = this.calculerMacrosAliment(ref, quantite);
    if (!macros) return;

    const aliment = this.ALIMENTS[ref];
    jour.repas.push({
      id:       Date.now(),
      ref,
      nom:      aliment.nom,
      emoji:    aliment.emoji,
      quantite,
      repas,
      ...macros,
      heure: new Date().toLocaleTimeString('fr-FR', {
        hour:'2-digit', minute:'2-digit'
      })
    });

    this.sauvegarderJour(jour);
    return macros;
  },

  supprimerAliment(id) {
    const jour = this.getJourActuel();
    jour.repas = jour.repas.filter(r => r.id !== id);
    this.sauvegarderJour(jour);
  },

  ajouterEau(ml) {
    const jour = this.getJourActuel();
    jour.eau   = (jour.eau || 0) + ml;
    this.sauvegarderJour(jour);
    return jour.eau;
  },

  getTotauxJour() {
    const jour = this.getJourActuel();
    return jour.repas.reduce(
      (acc, r) => ({
        cal:  acc.cal  + (r.cal  || 0),
        prot: acc.prot + (r.prot || 0),
        gluc: acc.gluc + (r.gluc || 0),
        lip:  acc.lip  + (r.lip  || 0)
      }),
      { cal:0, prot:0, gluc:0, lip:0 }
    );
  },

  getHistoriqueNutrition(jours = 7) {
    const hist = [];
    for (let i = 0; i < jours; i++) {
      const date  = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const data  = Utils.storage.get(`ft_nutrition_${date}`, null);
      if (data) {
        const totaux = data.repas.reduce(
          (acc, r) => ({
            cal:  acc.cal  + (r.cal  || 0),
            prot: acc.prot + (r.prot || 0),
            gluc: acc.gluc + (r.gluc || 0),
            lip:  acc.lip  + (r.lip  || 0)
          }),
          { cal:0, prot:0, gluc:0, lip:0 }
        );
        hist.push({
          date,
          label: Utils.formatDateCourt(date),
          ...totaux,
          eau: data.eau || 0
        });
      }
    }
    return hist.reverse();
  },

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    let profil  = { poids:80, taille:175, objectif:'forme' };
    try { profil = Tracker.getProfil(); } catch(e) {}

    const besoins = this.calculerBesoins(profil);
    const totaux  = this.getTotauxJour();
    const jour    = this.getJourActuel();
    const hist    = this.getHistoriqueNutrition(7);

    const pctCal  = Math.min(100, Math.round((totaux.cal  / besoins.calories)  * 100));
    const pctProt = Math.min(100, Math.round((totaux.prot / besoins.proteines) * 100));
    const pctGluc = Math.min(100, Math.round((totaux.gluc / besoins.glucides)  * 100));
    const pctLip  = Math.min(100, Math.round((totaux.lip  / besoins.lipides)   * 100));
    const pctEau  = Math.min(100, Math.round(
      ((jour.eau || 0) / 1000 / besoins.eau) * 100
    ));

    const repasTypes = [
      { val:'petit_dejeuner', label:'🌅 Petit-déjeuner' },
      { val:'dejeuner',       label:'☀️ Déjeuner'       },
      { val:'collation',      label:'🍎 Collation'      },
      { val:'diner',          label:'🌙 Dîner'          },
      { val:'post_seance',    label:'💪 Post-séance'    }
    ];

    container.innerHTML = `

      <!-- ═══ BILAN DU JOUR ═══ -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),
                  rgba(139,240,187,0.05));
                  border-color:var(--fd-indigo)">
        <div class="flex justify-between items-center mb-md">
          <div class="card-label" style="margin:0">
            📊 Bilan du jour
          </div>
          <div style="font-size:.68rem;color:var(--text-muted)">
            ${Utils.formatDateLong(Utils.aujourd_hui())}
          </div>
        </div>

        <!-- Calories principale -->
        <div style="text-align:center;margin-bottom:var(--space-md)">
          <div style="font-size:2.5rem;font-weight:800;
                      color:var(--fd-indigo);line-height:1">
            ${totaux.cal}
          </div>
          <div style="font-size:.75rem;color:var(--text-muted)">
            / ${besoins.calories} kcal
          </div>
          <div style="height:8px;background:var(--bg-input);
                      border-radius:99px;margin-top:8px;
                      overflow:hidden">
            <div style="height:100%;width:${pctCal}%;
                        background:${pctCal > 110
                          ? 'var(--fd-coral)'
                          : pctCal > 90
                            ? 'var(--fd-mint)'
                            : 'var(--fd-indigo)'};
                        border-radius:99px;
                        transition:width 1s"></div>
          </div>
        </div>

        <!-- Macros -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm)">
          ${[
            { label:'Protéines', val:totaux.prot, obj:besoins.proteines,
              pct:pctProt, color:'var(--fd-coral)',   unite:'g' },
            { label:'Glucides',  val:totaux.gluc, obj:besoins.glucides,
              pct:pctGluc, color:'var(--fd-lemon)',   unite:'g' },
            { label:'Lipides',   val:totaux.lip,  obj:besoins.lipides,
              pct:pctLip,  color:'var(--fd-lavender)',unite:'g' }
          ].map(m => `
            <div style="text-align:center;padding:var(--space-sm);
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
              <div style="font-size:.9rem;font-weight:800;
                          color:${m.color}">
                ${m.val}${m.unite}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                / ${m.obj}${m.unite}
              </div>
              <div style="height:4px;background:var(--bg-card);
                          border-radius:99px;margin-top:4px;
                          overflow:hidden">
                <div style="height:100%;width:${m.pct}%;
                            background:${m.color};
                            border-radius:99px"></div>
              </div>
              <div style="font-size:.6rem;color:${m.color};
                          margin-top:2px;font-weight:600">
                ${m.pct}%
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- ═══ EAU ═══ -->
      <div class="card mb-md">
        <div class="flex justify-between items-center mb-sm">
          <div class="card-label" style="margin:0">
            💧 Hydratation
          </div>
          <div style="font-size:.82rem;font-weight:700;
                      color:var(--fd-indigo)">
            ${((jour.eau||0)/1000).toFixed(1)}L
            / ${besoins.eau}L
          </div>
        </div>
        <div style="height:8px;background:var(--bg-input);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:var(--space-sm)">
          <div style="height:100%;width:${pctEau}%;
                      background:var(--fd-indigo);
                      border-radius:99px;
                      transition:width .5s"></div>
        </div>
        <div style="display:flex;gap:var(--space-sm)">
          ${[150, 250, 330, 500].map(ml => `
            <button onclick="Nutrition._ajouterEauUI(${ml})"
                    style="flex:1;padding:8px 4px;
                           font-size:.72rem;font-weight:600;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:var(--radius-full);
                           color:var(--fd-indigo);
                           cursor:pointer">
              +${ml}ml
            </button>`).join('')}
        </div>
      </div>

      <!-- ═══ AJOUTER ALIMENT ═══ -->
      <div class="card mb-md">
        <div class="card-label mb-md">➕ Ajouter un aliment</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-bottom:var(--space-sm)">
          <div>
            <div class="input-label">Repas</div>
            <select class="input" id="nutri-repas">
              ${repasTypes.map(r => `
                <option value="${r.val}">${r.label}</option>
              `).join('')}
            </select>
          </div>
          <div>
            <div class="input-label">Quantité (g/ml)</div>
            <input class="input" id="nutri-qte"
                   type="number" placeholder="100"
                   value="100" min="1" max="2000" />
          </div>
        </div>

        <!-- Recherche aliment -->
        <div class="input-label">Aliment</div>
        <input class="input mb-sm" id="nutri-search"
               placeholder="Cherche un aliment..."
               oninput="Nutrition._filtrerAliments(this.value)" />

        <div id="nutri-aliments-list"
             style="max-height:200px;overflow-y:auto;
                    border:1px solid var(--border-color);
                    border-radius:var(--radius-md);
                    margin-bottom:var(--space-sm)">
          ${this._renderListeAliments('')}
        </div>

        <div id="nutri-selection"
             style="display:none;
                    padding:var(--space-sm);
                    background:rgba(75,75,249,0.1);
                    border-radius:var(--radius-sm);
                    margin-bottom:var(--space-sm);
                    font-size:.82rem">
        </div>

        <button onclick="Nutrition._confirmerAjout()"
                class="btn-primary"
                style="width:100%">
          ➕ Ajouter
        </button>
      </div>

      <!-- ═══ REPAS DU JOUR ═══ -->
      ${repasTypes.map(type => {
        const items = jour.repas.filter(r => r.repas === type.val);
        if (!items.length) return '';
        const totalRepas = items.reduce(
          (acc, r) => ({ ...acc, cal: acc.cal + r.cal }),
          { cal:0 }
        );
        return `
          <div class="card mb-md">
            <div class="flex justify-between items-center mb-sm">
              <div class="card-label" style="margin:0">
                ${type.label}
              </div>
              <div style="font-size:.72rem;color:var(--fd-lemon);
                          font-weight:600">
                ${totalRepas.cal} kcal
              </div>
            </div>
            ${items.map(item => `
              <div style="display:flex;align-items:center;
                          justify-content:space-between;
                          padding:var(--space-xs) 0;
                          border-bottom:1px solid var(--border-color)">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-size:1.1rem">${item.emoji}</span>
                  <div>
                    <div style="font-size:.82rem;font-weight:600">
                      ${item.nom}
                    </div>
                    <div style="font-size:.65rem;color:var(--text-muted)">
                      ${item.quantite}g · ${item.heure}
                    </div>
                  </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <div style="text-align:right">
                    <div style="font-size:.78rem;font-weight:700;
                                color:var(--fd-lemon)">
                      ${item.cal} kcal
                    </div>
                    <div style="font-size:.62rem;color:var(--text-muted)">
                      P:${item.prot} G:${item.gluc} L:${item.lip}
                    </div>
                  </div>
                  <button onclick="Nutrition._supprimerAlimentUI(${item.id})"
                          style="background:none;border:none;
                                 color:var(--text-muted);
                                 font-size:.9rem;cursor:pointer;
                                 padding:4px">
                    🗑️
                  </button>
                </div>
              </div>`).join('')}
          </div>`;
      }).join('')}

      <!-- ═══ GRAPHIQUE 7 JOURS ═══ -->
      ${hist.length > 1 ? `
        <div class="card mb-md">
          <div class="card-label mb-sm">
            📈 Calories — 7 derniers jours
          </div>
          <canvas id="chart-nutri-cal" height="160"></canvas>
        </div>
        <div class="card mb-md">
          <div class="card-label mb-sm">
            💪 Protéines — 7 derniers jours
          </div>
          <canvas id="chart-nutri-prot" height="140"></canvas>
        </div>` : ''}

      <!-- ═══ OBJECTIFS MACROS ═══ -->
      <div class="card mb-md"
           style="background:rgba(75,75,249,0.05);
                  border-color:rgba(75,75,249,0.2)">
        <div class="card-label mb-md">🎯 Objectifs quotidiens</div>
        ${[
          { label:'🔥 Calories',  val:besoins.calories,  unite:'kcal', color:'var(--fd-lemon)'    },
          { label:'🥩 Protéines', val:besoins.proteines, unite:'g',    color:'var(--fd-coral)'    },
          { label:'🍚 Glucides',  val:besoins.glucides,  unite:'g',    color:'var(--fd-lavender)' },
          { label:'🫒 Lipides',   val:besoins.lipides,   unite:'g',    color:'var(--fd-mint)'     },
          { label:'💧 Eau',       val:besoins.eau,       unite:'L',    color:'var(--fd-indigo)'   }
        ].map(o => `
          <div class="flex justify-between items-center"
               style="padding:var(--space-xs) 0;
                      border-bottom:1px solid var(--border-color)">
            <span style="font-size:.82rem">${o.label}</span>
            <span style="font-weight:700;font-size:.88rem;
                         color:${o.color}">
              ${o.val} ${o.unite}
            </span>
          </div>`).join('')}
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:var(--space-sm);text-align:center">
          Calculé pour ${profil.poids}kg · Objectif: ${profil.objectif}
        </div>
      </div>
    `;

    // Charts
    requestAnimationFrame(() => {
      if (hist.length > 1) {
        const cc = document.getElementById('chart-nutri-cal');
        if (cc && typeof Chart !== 'undefined') {
          new Chart(cc, {
            type: 'bar',
            data: {
              labels:   hist.map(h => h.label),
              datasets: [{
                data:            hist.map(h => h.cal),
                backgroundColor: hist.map(h =>
                  h.cal >= besoins.calories * 0.9
                    ? 'rgba(139,240,187,0.7)'
                    : 'rgba(75,75,249,0.6)'
                ),
                borderColor:  '#4b4bf9',
                borderWidth:  1,
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              plugins:  { legend:{ display:false } },
              scales: {
                x: { ticks:{ color:'#888', font:{ size:10 } },
                     grid:{ color:'rgba(255,255,255,0.05)' } },
                y: { ticks:{ color:'#888', font:{ size:10 } },
                     grid:{ color:'rgba(255,255,255,0.05)' } }
              }
            }
          });
        }

        const cp = document.getElementById('chart-nutri-prot');
        if (cp && typeof Chart !== 'undefined') {
          new Chart(cp, {
            type: 'line',
            data: {
              labels:   hist.map(h => h.label),
              datasets: [{
                data:                hist.map(h => h.prot),
                borderColor:         '#ff8d96',
                backgroundColor:     'rgba(255,141,150,0.1)',
                borderWidth:         2,
                pointRadius:         4,
                pointBackgroundColor:'#ff8d96',
                tension:             0.4,
                fill:                true
              }]
            },
            options: {
              responsive: true,
              plugins:  { legend:{ display:false } },
              scales: {
                x: { ticks:{ color:'#888', font:{ size:10 } },
                     grid:{ color:'rgba(255,255,255,0.05)' } },
                y: { ticks:{ color:'#888', font:{ size:10 } },
                     grid:{ color:'rgba(255,255,255,0.05)' } }
              }
            }
          });
        }
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // HELPERS UI
  // ════════════════════════════════════════════════════════
  _alimentChoisi: null,

  _renderListeAliments(filtre) {
    const aliments = Object.entries(this.ALIMENTS)
      .filter(([, a]) =>
        !filtre ||
        a.nom.toLowerCase().includes(filtre.toLowerCase())
      );

    if (!aliments.length) {
      return `<div style="padding:var(--space-md);
                          text-align:center;
                          color:var(--text-muted);
                          font-size:.82rem">
                Aucun aliment trouvé
              </div>`;
    }

    return aliments.map(([ref, a]) => `
      <div onclick="Nutrition._selectionnerAliment('${ref}')"
           style="display:flex;align-items:center;gap:8px;
                  padding:var(--space-sm) var(--space-md);
                  cursor:pointer;
                  border-bottom:1px solid var(--border-color);
                  transition:background .15s"
           onmouseover="this.style.background='rgba(75,75,249,0.1)'"
           onmouseout="this.style.background='transparent'">
        <span style="font-size:1.2rem">${a.emoji}</span>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:600">${a.nom}</div>
          <div style="font-size:.62rem;color:var(--text-muted)">
            ${a.cal}kcal · P:${a.prot}g G:${a.gluc}g L:${a.lip}g
            pour 100${a.unite}
          </div>
        </div>
      </div>`).join('');
  },

  _filtrerAliments(val) {
    const liste = document.getElementById('nutri-aliments-list');
    if (liste) liste.innerHTML = this._renderListeAliments(val);
  },

  _selectionnerAliment(ref) {
    this._alimentChoisi = ref;
    const aliment = this.ALIMENTS[ref];
    const sel     = document.getElementById('nutri-selection');
    const qte     = parseInt(document.getElementById('nutri-qte')?.value) || 100;
    const macros  = this.calculerMacrosAliment(ref, qte);

    if (sel) {
      sel.style.display = 'block';
      sel.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.3rem">${aliment.emoji}</span>
          <div>
            <div style="font-weight:700">${aliment.nom}</div>
            <div style="font-size:.7rem;color:var(--text-muted)">
              ${qte}g → <strong style="color:var(--fd-lemon)">
              ${macros.cal} kcal</strong>
              · P:${macros.prot}g G:${macros.gluc}g L:${macros.lip}g
            </div>
          </div>
        </div>`;
    }
  },

  _confirmerAjout() {
    if (!this._alimentChoisi) {
      Utils.toast('Sélectionne un aliment !', 'error');
      return;
    }
    const qte   = parseInt(document.getElementById('nutri-qte')?.value) || 100;
    const repas = document.getElementById('nutri-repas')?.value || 'dejeuner';

    this.ajouterAliment(this._alimentChoisi, qte, repas);
    this._alimentChoisi = null;

    Utils.toast('✅ Aliment ajouté !', 'success', 1500);
    Utils.vibrerSuccess();

    // Re-render
    const container = document.getElementById('page-nutrition')
      || document.getElementById('stats-content');
    if (container) this.render(container);
  },

  _supprimerAlimentUI(id) {
    this.supprimerAliment(id);
    const container = document.getElementById('page-nutrition')
      || document.getElementById('stats-content');
    if (container) this.render(container);
  },

  _ajouterEauUI(ml) {
    const total = this.ajouterEau(ml);
    Utils.toast(
      `💧 +${ml}ml · Total: ${(total/1000).toFixed(1)}L`,
      'success', 1500
    );
    const container = document.getElementById('page-nutrition')
      || document.getElementById('stats-content');
    if (container) this.render(container);
  }
};

window.Nutrition = Nutrition;
console.log('✅ Nutrition.js v1.0 chargé');
