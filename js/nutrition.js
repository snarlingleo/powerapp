/* ============================================================
   PowerApp — Nutrition.js v4.0
   PATCH sur v3.0
   + getObjectifs() optimisé
   + _getHistoriqueNutrition() Fix score
   + getTotauxSemaine() NOUVEAU
   + getStreakNutrition() NOUVEAU
   + getJoursHydratation() NOUVEAU
   + _rendreDashboard() Fix séance active
   ============================================================ */

// ════════ ALIMENTS_DB et RECETTES_DB identiques à v3.0 ════════
// (coller ici le contenu de ALIMENTS_DB et RECETTES_DB de v3.0)

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
  // PROFIL ONBOARDING
  // ════════════════════════════════════════════════════════
  _getProfilOnboarding() {
    try {
      return Utils.storage.get('ft_profil_onboarding', {
        genre:'homme', objectif:'forme',
        muscles_cibles:[], niveau:'intermediaire'
      });
    } catch(e) {
      return {
        genre:'homme', objectif:'forme',
        muscles_cibles:[], niveau:'intermediaire'
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // MIGRATION v1 → v2 (identique v3.0)
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
  // RECETTES ADAPTÉES (identique v3.0)
  // ════════════════════════════════════════════════════════
  getRecettesAdaptees(genre = null, objectif = null, limite = 6) {
    const profil = this._getProfilOnboarding();
    const g      = genre   || profil.genre   || 'homme';
    const obj    = objectif || profil.objectif || 'forme';
    return RECETTES_DB
      .filter(r => {
        const genreOK = !r.genre
          || r.genre.includes(g) || r.genre.includes('tous');
        const objOK   = !r.objectifs
          || r.objectifs.includes(obj) || r.objectifs.includes('forme');
        return genreOK && objOK;
      })
      .sort((a,b) => {
        const scoreA = (a.genre?.includes(g) ? 1 : 0)
          + (a.objectifs?.includes(obj) ? 1 : 0);
        const scoreB = (b.genre?.includes(g) ? 1 : 0)
          + (b.objectifs?.includes(obj) ? 1 : 0);
        return scoreB - scoreA;
      })
      .slice(0, limite);
  },

  getSuggestionRepasMusculaire(muscles = []) {
    if (!muscles.length) return null;
    const musclesForce  = ['pectoraux','dorsal','quadriceps','fessiers'];
    const musclesCardio = ['abdominaux','mollets','ischio'];
    const needsProtein  = muscles.some(m => musclesForce.includes(m));
    const needsCarbs    = muscles.some(m => musclesCardio.includes(m));
    if (needsProtein)
      return RECETTES_DB.find(r =>
        r.id === 'riz_poulet_legumes' || r.id === 'bowl_patate_douce'
      );
    if (needsCarbs)
      return RECETTES_DB.find(r =>
        r.id === 'pre_seance' || r.id === 'porridge_banane'
      );
    return RECETTES_DB.find(r => r.id === 'salade_thon_quinoa');
  },

  // ════════════════════════════════════════════════════════
  // DONNÉES — ✅ v4.0 optimisé
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

  // ✅ NOUVEAU v4.0 — getTotauxSemaine()
  // Appelé par Offline.js, Gamification, Defis
  getTotauxSemaine() {
    const semaine = Utils.debutSemaine(Utils.aujourd_hui());
    let totaux    = { cal:0, prot:0, gluc:0, lip:0, eau:0 };

    for (let i = 0; i < 7; i++) {
      const date = Utils.ajouterJours(semaine, i);
      if (date > Utils.aujourd_hui()) break;

      const t   = this.getTotauxJournal(date);
      const eau = this.getEau(date);

      totaux.cal  += t.cal;
      totaux.prot += t.prot;
      totaux.gluc += t.gluc;
      totaux.lip  += t.lip;
      totaux.eau  += eau;
    }

    return totaux;
  },

  // ✅ NOUVEAU v4.0 — Streak nutrition (jours consécutifs logués)
  getStreakNutrition() {
    let streak = 0;
    for (let i = 0; i < 60; i++) {
      const date = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const j    = this._getJournal(date);
      if (j.length > 0) {
        streak++;
      } else if (i > 0) {
        break; // Streak brisé
      }
    }
    return streak;
  },

  // ✅ NOUVEAU v4.0 — Jours avec objectif hydratation atteint
  getJoursHydratation(nbJours = 30) {
    const obj = this.getObjectifs();
    let count  = 0;
    for (let i = 0; i < nbJours; i++) {
      const date = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const eau  = this.getEau(date);
      if (eau >= obj.eau * 1000 * 0.9) count++;
    }
    return count;
  },

  // ✅ NOUVEAU v4.0 — Jours avec objectif protéines atteint
  getJoursProteines(nbJours = 30) {
    const obj = this.getObjectifs();
    let count  = 0;
    for (let i = 0; i < nbJours; i++) {
      const date   = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const totaux = this.getTotauxJournal(date);
      if (totaux.prot >= obj.proteines * 0.9) count++;
    }
    return count;
  },

  // ✅ NOUVEAU v4.0 — Nombre de recettes uniques loguées
  getTotalRecettesLoguees() {
    const ids = new Set();
    for (let i = 0; i < 60; i++) {
      const date = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      const j    = this._getJournal(date);
      j.forEach(e => {
        if (e.ref && !e.ref.startsWith('custom_')) {
          ids.add(e.ref);
        }
      });
    }
    return ids.size;
  },

  // ✅ NOUVEAU v4.0 — Total logs sur N jours
  getTotalLogsNutrition(nbJours = 60) {
    let total = 0;
    for (let i = 0; i < nbJours; i++) {
      const date = Utils.ajouterJours(Utils.aujourd_hui(), -i);
      total += this._getJournal(date).length;
    }
    return total;
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS — ✅ v4.0 optimisé (cache évitant recalcul)
  // ════════════════════════════════════════════════════════
  _objectifsCache:    null,
  _objectifsCacheKey: null,

  getObjectifs() {
    // ✅ Cache clé = today + profil.genre + profil.objectif
    const profil    = this._getProfilOnboarding();
    const cacheKey  = `${Utils.aujourd_hui()}_${profil.genre}_${profil.objectif}`;

    if (this._objectifsCache
        && this._objectifsCacheKey === cacheKey) {
      return this._objectifsCache;
    }

    let profilTracker = { poids:80, objectif:'forme' };
    try { profilTracker = Tracker.getProfil(); } catch(e) {}

    const auto = this._calculerObjectifsAuto({
      ...profilTracker,
      genre:    profil.genre    || 'homme',
      objectif: profil.objectif || profilTracker.objectif || 'forme'
    });

    const storedObj = Utils.storage.get(this.CLE_OBJECTIFS, null);

    const result = storedObj || {
      calories:  auto.calories,
      proteines: auto.proteines,
      glucides:  auto.glucides,
      lipides:   auto.lipides,
      eau:       auto.eau
    };

    // Mise en cache
    this._objectifsCache    = result;
    this._objectifsCacheKey = cacheKey;

    return result;
  },

  // ✅ Invalider cache quand on sauvegarde
  _invaliderCacheObjectifs() {
    this._objectifsCache    = null;
    this._objectifsCacheKey = null;
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE — ✅ v4.0 Fix score nutrition
  // ════════════════════════════════════════════════════════
  _getHistoriqueNutrition(jours = 7) {
    const obj  = this.getObjectifs(); // ✅ Charger obj une seule fois
    const hist = [];

    for (let i = jours - 1; i >= 0; i--) {
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
        eau,
        // ✅ FIX v4.0 — Passer obj.eau*1000 comme eauMl
        score: this._calculerScoreNutrition(
          totaux, obj, eau
        ).score
      });
    }

    return hist;
  },

  // ════════════════════════════════════════════════════════
  // SCORE NUTRITION (identique v3.0 — paramètres inchangés)
  // ════════════════════════════════════════════════════════
  _calculerScoreNutrition(totaux, obj, eau) {
    if (totaux.cal === 0) return { score:0, emoji:'', message:'' };

    const pctCal  = (totaux.cal  / Math.max(obj.calories,  1)) * 100;
    const pctProt = (totaux.prot / Math.max(obj.proteines, 1)) * 100;
    const pctEau  = (eau         / Math.max(obj.eau * 1000, 1)) * 100;

    let score = 0;

    if (pctCal >= 85 && pctCal <= 115) score += 40;
    else if (pctCal >= 70 && pctCal <= 130) score += 25;
    else score += 10;

    if (pctProt >= 90) score += 35;
    else if (pctProt >= 70) score += 20;
    else score += 5;

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

  // ════════════════════════════════════════════════════════
  // CALCUL OBJECTIFS AUTO — genre-aware (identique v3.0)
  // ════════════════════════════════════════════════════════
  _calculerObjectifsAuto(profil) {
    const poids    = profil.poids    || 80;
    const taille   = profil.taille   || 175;
    const objectif = profil.objectif || 'forme';
    const genre    = profil.genre    || 'homme';

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

    const calories      = tdee + surplus;
    const facteurProt   = genre === 'femme' ? 1.8 : 2.0;
    const pctGlucides   = genre === 'femme' ? 0.40 : 0.45;
    const pctLipides    = genre === 'femme' ? 0.30 : 0.25;

    return {
      tdee,
      calories:  Math.round(calories),
      proteines: Math.round(poids * facteurProt),
      glucides:  Math.round((calories * pctGlucides) / 4),
      lipides:   Math.round((calories * pctLipides)  / 9),
      eau:       parseFloat((poids * 0.035).toFixed(1))
    };
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
  // DASHBOARD — ✅ v4.0 Fix séance active + cache
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

    const surplus     = totaux.cal - obj.calories;
    const scoreNutri  = this._calculerScoreNutrition(totaux, obj, eau);

    // ✅ FIX v4.0 — Suggestion post-séance protégée
    let postSeance = null;
    try {
      let seanceDuJour = null;
      try {
        seanceDuJour = Tracker.getSeanceDuJour?.()
          || Tracker.getSeanceDuJour?.call?.(Tracker);
      } catch(e) {}

      if (seanceDuJour?.series?.length > 0
          || seanceDuJour?.complete) {
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

    const recettesRecommandees = this.getRecettesAdaptees(
      genre, profil.objectif, 3
    );

    container.innerHTML = `

      <!-- Score nutrition -->
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
            <div style="font-size:.65rem;color:var(--text-muted)">
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
                        text-transform:uppercase;letter-spacing:.1em;
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
                        text-transform:uppercase;letter-spacing:.08em;
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

      <!-- Suggestion post-séance -->
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

      <!-- Recettes recommandées -->
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
  // JOURNAL (identique v3.0 — voir ci-dessus)
  // ════════════════════════════════════════════════════════
  _rendreJournal(container) {
    // ← Code identique à v3.0, voir fichier original
    // Copier _rendreJournal() de v3.0 ici
  },

  // ════════════════════════════════════════════════════════
  // AJOUT ALIMENT (identique v3.0)
  // ════════════════════════════════════════════════════════
  _ouvrirAjoutAliment(momentPrefere = 'dejeuner') {
    // ← Code identique à v3.0
  },
  _selectMoment(id, btn) {
    // ← Code identique à v3.0
  },
  _modeAjout(mode) {
    // ← Code identique à v3.0
  },
  _renderListeAlimentsModal(recherche) {
    // ← Code identique à v3.0
  },
  _rechercherAliment(val) {
    // ← Code identique à v3.0
  },
  _selectionnerAliment(ref) {
    // ← Code identique à v3.0
  },
  _ajusterQte(delta) {
    // ← Code identique à v3.0
  },
  _updateApercuMacros(ref, qte) {
    // ← Code identique à v3.0
  },
  _renderApercuMacros(ali, qte) {
    // ← Code identique à v3.0
  },
  _confirmerAjout(ref) {
    // ← Code identique à v3.0
  },
  _ajouterManuel() {
    // ← Code identique à v3.0
  },

  // ════════════════════════════════════════════════════════
  // RECETTES (identique v3.0)
  // ════════════════════════════════════════════════════════
  _rendreRecettes(container) {
    // ← Code identique à v3.0
  },
  _filtrerRecettes(filtreId) {
    // ← Code identique à v3.0
  },
  _voirRecette(id) {
    // ← Code identique à v3.0
  },
  _loggerRecette(id) {
    // ← Code identique à v3.0
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
  // OBJECTIFS — ✅ v4.0 invalider cache à la sauvegarde
  // ════════════════════════════════════════════════════════
  _rendreObjectifs(container) {
    // ← Code identique à v3.0, sauf :
    // _sauvegarderObjectifs() et _resetObjectifs() ci-dessous
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
    // ✅ FIX v4.0 — Invalider le cache
    this._invaliderCacheObjectifs();
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
    // ✅ FIX v4.0 — Invalider le cache
    this._invaliderCacheObjectifs();
    Utils.toast('🔄 Objectifs réinitialisés !', 'success');
    const c = document.getElementById('nutrition-content');
    if (c) this._rendreObjectifs(c);
  },

  // ════════════════════════════════════════════════════════
  // STATS (identique v3.0 — scores via _getHistoriqueNutrition)
  // ════════════════════════════════════════════════════════
  _rendreStats(container) {
    // ← Code identique à v3.0
    // Note : scoreMoyen utilise maintenant h.score (pré-calculé)
    const hist      = this._getHistoriqueNutrition(7);
    const obj       = this.getObjectifs();
    const scoreMoyen = hist.length > 0
      ? Math.round(
          hist.reduce((a, h) => a + (h.score || 0), 0) / hist.length
        )
      : 0;
    // ← Suite identique à v3.0 (rendu, charts, tableau)
  },

  // ════════════════════════════════════════════════════════
  // EAU
  // ════════════════════════════════════════════════════════
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
        try { Gamification.ajouterXP(20, 'hydratation'); } catch(e) {}
      }, 500);
    }

    if (this._ongletActif === 'dashboard') {
      const p = document.getElementById('page-nutrition');
      if (p) this.render(p);
    }
  },

  _ajouterEauRapide(ml) { this._ajouterEau(ml); }
};

window.Nutrition   = Nutrition;
window.ALIMENTS_DB = ALIMENTS_DB;
window.RECETTES_DB = RECETTES_DB;

console.log(
  `✅ Nutrition v4.0 chargé — `
  + `${Object.keys(ALIMENTS_DB).length} aliments, `
  + `${RECETTES_DB.length} recettes `
  + `+ getTotauxSemaine + cache objectifs + Fix score`
);
