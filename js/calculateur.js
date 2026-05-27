/* ============================================================
   PowerApp — Calculateur.js v1.0
   ✅ 1RM multi-formules
   ✅ Wilks Score (powerlifting)
   ✅ FFMI (indice masse musculaire)
   ✅ IMC + catégories
   ✅ Calories brûlées détaillées
   ✅ Macros personnalisées
   ✅ Zones d'entraînement FC
   ✅ Comparateur charges
   ============================================================ */

'use strict';

const Calculateur = {

  _ongletActif: 'rm1',

  // ════════════════════════════════════════════════════════
  // FORMULES 1RM
  // ════════════════════════════════════════════════════════
  FORMULES_1RM: {
    brzycki: {
      nom:    'Brzycki',
      calcul: (p, r) => p * (36 / (37 - r)),
      info:   'La plus précise pour 1-10 reps'
    },
    epley: {
      nom:    'Epley',
      calcul: (p, r) => r === 1 ? p : p * (1 + r / 30),
      info:   'Adaptée pour les séries moyennes'
    },
    lander: {
      nom:    'Lander',
      calcul: (p, r) => (100 * p) / (101.3 - 2.67123 * r),
      info:   'Précise pour les reps élevées'
    },
    lombardi: {
      nom:    'Lombardi',
      calcul: (p, r) => p * Math.pow(r, 0.10),
      info:   'Conservatrice — idéale débutants'
    },
    oconner: {
      nom:    "O'Conner",
      calcul: (p, r) => p * (1 + 0.025 * r),
      info:   'Simple et rapide'
    },
    wathan: {
      nom:    'Wathan',
      calcul: (p, r) => (100 * p) / (48.8 + 53.8 * Math.exp(-0.075 * r)),
      info:   'Adaptée powerlifting'
    }
  },

  calculer1RMTous(poids, reps) {
    if (!poids || !reps || reps < 1) return {};
    return Object.entries(this.FORMULES_1RM).reduce((acc, [id, formule]) => {
      try {
        const val = formule.calcul(poids, reps);
        acc[id] = {
          nom:    formule.nom,
          valeur: Math.round(val * 10) / 10,
          info:   formule.info
        };
      } catch(e) {}
      return acc;
    }, {});
  },

  calculer1RMMoyen(poids, reps) {
    const resultats = Object.values(this.calculer1RMTous(poids, reps))
      .map(r => r.valeur)
      .filter(v => v > 0);
    return resultats.length > 0
      ? Math.round(
          resultats.reduce((a,b) => a+b, 0) / resultats.length * 10
        ) / 10
      : 0;
  },

  getZonesEntrainement(rm1) {
    return [
      { zone:'Endurance',    pct:50, reps:'15-20+', repos:'30s',   color:'#8bf0bb', objectif:'Fond & endurance' },
      { zone:'Hypertrophie', pct:65, reps:'12-15',  repos:'60s',   color:'#4b4bf9', objectif:'Volume musculaire' },
      { zone:'Hypertrophie+',pct:75, reps:'8-12',   repos:'90s',   color:'#bfa1ff', objectif:'Masse & définition' },
      { zone:'Force',        pct:85, reps:'4-6',    repos:'3min',  color:'#f9ef77', objectif:'Gain de force' },
      { zone:'Force max',    pct:90, reps:'2-3',    repos:'4min',  color:'#ffa500', objectif:'Développement neural' },
      { zone:'Puissance max',pct:95, reps:'1-2',    repos:'5min+', color:'#ff8d96', objectif:'1RM & puissance' }
    ].map(z => ({
      ...z,
      charge:    Math.round(rm1 * z.pct / 100 / 2.5) * 2.5
    }));
  },

  // ════════════════════════════════════════════════════════
  // WILKS SCORE
  // ════════════════════════════════════════════════════════
  calculerWilks(total, poidsCorps, genre = 'homme') {
    if (!total || !poidsCorps) return 0;

    // Coefficients Wilks 2020 (Wilks II)
    const coeffsHomme  = [-216.0475144, 16.2606339, -0.002388645, -0.00113732, 7.01863e-6, -1.291e-8];
    const coeffsFemme  = [594.31747775582, -27.23842536447, 0.82112226871, -0.00930733913, 4.731582e-5, -9.054e-8];
    const coeffs       = genre === 'femme' ? coeffsFemme : coeffsHomme;

    const b = poidsCorps;
    const denom = coeffs[0]
      + coeffs[1] * b
      + coeffs[2] * b**2
      + coeffs[3] * b**3
      + coeffs[4] * b**4
      + coeffs[5] * b**5;

    const coeff = denom !== 0 ? 600 / denom : 0;
    return Math.round(total * coeff * 10) / 10;
  },

  getCategorieWilks(score) {
    if (score >= 500)      return { label:'Elite mondiale',  color:'#f9ef77', emoji:'👑' };
    if (score >= 400)      return { label:'Compétition nat.',color:'#ff8d96', emoji:'💥' };
    if (score >= 300)      return { label:'Avancé',          color:'#bfa1ff', emoji:'💎' };
    if (score >= 200)      return { label:'Intermédiaire',   color:'#4b4bf9', emoji:'🔥' };
    if (score >= 100)      return { label:'Débutant solide', color:'#8bf0bb', emoji:'💪' };
    return                        { label:'Débutant',        color:'#ffffff', emoji:'🌱' };
  },

  // ════════════════════════════════════════════════════════
  // FFMI — Fat-Free Mass Index
  // ════════════════════════════════════════════════════════
  calculerFFMI(poidsTotal, taille, pctGraisse = null) {
    if (!poidsTotal || !taille) return null;

    const tailleMetre  = taille / 100;
    const masseGrasse  = pctGraisse !== null
      ? (poidsTotal * pctGraisse / 100)
      : (poidsTotal * 0.15); // Estimation 15% défaut

    const masseMaigre  = poidsTotal - masseGrasse;
    const ffmi         = masseMaigre / (tailleMetre ** 2);
    const ffmiNormalise= ffmi + 6.1 * (1.8 - tailleMetre);

    return {
      ffmi:        Math.round(ffmi * 10) / 10,
      ffmiNorm:    Math.round(ffmiNormalise * 10) / 10,
      masseMaigre: Math.round(masseMaigre * 10) / 10,
      masseGrasse: Math.round(masseGrasse * 10) / 10,
      categorie:   this._categorieFFMI(ffmiNormalise)
    };
  },

  _categorieFFMI(ffmi) {
    if (ffmi >= 26)    return { label:'Athlète de haut niveau', color:'#f9ef77', emoji:'👑', info:'Rare — possible sans dopage' };
    if (ffmi >= 24)    return { label:'Très musclé',            color:'#ff8d96', emoji:'💥', info:'Top 5% de la population' };
    if (ffmi >= 22)    return { label:'Musclé',                 color:'#4b4bf9', emoji:'💪', info:'Résultat d\'années d\'entraînement' };
    if (ffmi >= 20)    return { label:'Bien musclé',            color:'#8bf0bb', emoji:'⚡', info:'Entraînement sérieux visible' };
    if (ffmi >= 18)    return { label:'Entraîné',               color:'#bfa1ff', emoji:'🏃', info:'Masse musculaire correcte' };
    return                    { label:'Natif',                  color:'#ffffff', emoji:'🌱', info:'Potentiel de gain important' };
  },

  // ════════════════════════════════════════════════════════
  // IMC
  // ════════════════════════════════════════════════════════
  calculerIMC(poids, taille) {
    if (!poids || !taille) return null;
    const imc = poids / ((taille/100) ** 2);
    return {
      valeur:    Math.round(imc * 10) / 10,
      categorie: this._categorieIMC(imc)
    };
  },

  _categorieIMC(imc) {
    if (imc < 16.5)  return { label:'Maigreur sévère', color:'#ff8d96', emoji:'⚠️'  };
    if (imc < 18.5)  return { label:'Maigreur',        color:'#ffa500', emoji:'📉'  };
    if (imc < 25)    return { label:'Poids normal',    color:'#8bf0bb', emoji:'✅'  };
    if (imc < 30)    return { label:'Surpoids',        color:'#f9ef77', emoji:'📊'  };
    if (imc < 35)    return { label:'Obésité I',       color:'#ffa500', emoji:'⚠️'  };
    if (imc < 40)    return { label:'Obésité II',      color:'#ff8d96', emoji:'⚠️'  };
    return                  { label:'Obésité III',     color:'#ff4444', emoji:'🚨'  };
  },

  // ════════════════════════════════════════════════════════
  // CALORIES BRÛLÉES
  // ════════════════════════════════════════════════════════
  ACTIVITES: {
    musculation_intense: { label:'Musculation intense',    met:6.0  },
    musculation_modere:  { label:'Musculation modérée',    met:3.5  },
    hiit:                { label:'HIIT / Circuit',         met:8.0  },
    cardio_leger:        { label:'Cardio léger',           met:4.0  },
    cardio_intense:      { label:'Cardio intense',         met:9.0  },
    course_lente:        { label:'Course lente (8km/h)',   met:7.0  },
    course_rapide:       { label:'Course rapide (12km/h)', met:11.5 },
    velo:                { label:'Vélo (20km/h)',          met:7.5  },
    natation:            { label:'Natation',               met:6.0  },
    yoga:                { label:'Yoga / Stretching',      met:2.5  },
    marche_active:       { label:'Marche active',          met:4.5  },
    boxe:                { label:'Boxe / Arts martiaux',   met:7.5  }
  },

  calculerCalories(activiteId, dureeMin, poidsKg, genre = 'homme') {
    const act = this.ACTIVITES[activiteId];
    if (!act || !dureeMin || !poidsKg) return 0;

    // Formule MET
    const cal = (act.met * poidsKg * 3.5 / 200) * dureeMin;

    // Correction genre (femmes brûlent ~10% moins)
    const coeff = genre === 'femme' ? 0.9 : 1.0;

    return Math.round(cal * coeff);
  },

  // ════════════════════════════════════════════════════════
  // ZONES FC (Fréquence Cardiaque)
  // ════════════════════════════════════════════════════════
  calculerZonesFC(age, fcRepos = 60) {
    const fcMax  = 220 - age;
    const fcRes  = fcMax - fcRepos; // FC de réserve (Karvonen)

    return [
      { zone:1, nom:'Récupération active',  pctMin:50, pctMax:60, color:'#8bf0bb',
        objectif:'Récupération, chaleur' },
      { zone:2, nom:'Endurance de base',    pctMin:60, pctMax:70, color:'#4b4bf9',
        objectif:'Fondamental, brûle graisses' },
      { zone:3, nom:'Aérobie',              pctMin:70, pctMax:80, color:'#f9ef77',
        objectif:'Condition cardio, endurance' },
      { zone:4, nom:'Seuil anaérobie',      pctMin:80, pctMax:90, color:'#ffa500',
        objectif:'Performance, puissance' },
      { zone:5, nom:'VO2 Max',              pctMin:90, pctMax:100,color:'#ff8d96',
        objectif:'Puissance maximale — court' }
    ].map(z => ({
      ...z,
      fcMin: Math.round(fcRepos + fcRes * z.pctMin/100),
      fcMax: Math.round(fcRepos + fcRes * z.pctMax/100),
      fcMaxAbs: fcMax
    }));
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;gap:5px;overflow-x:auto;
                  scrollbar-width:none;margin-bottom:14px">
        ${[
          { id:'rm1',       label:'💪 1RM'         },
          { id:'zones',     label:'📊 Zones'        },
          { id:'wilks',     label:'🏋️ Wilks'       },
          { id:'ffmi',      label:'🧬 FFMI'         },
          { id:'calories',  label:'🔥 Calories'     },
          { id:'fc',        label:'❤️ Zones FC'     }
        ].map(t => `
          <button onclick="Calculateur._changerOnglet('${t.id}')"
                  style="padding:8px 14px;white-space:nowrap;
                         font-size:.72rem;font-weight:700;
                         border-radius:var(--radius-full);
                         cursor:pointer;transition:all .2s;
                         background:${this._ongletActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.06)'};
                         border:1px solid ${this._ongletActif === t.id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.1)'};
                         color:${this._ongletActif === t.id
                           ? 'white' : 'var(--text-muted)'}">
            ${t.label}
          </button>`).join('')}
      </div>
      <div id="calc-content"></div>`;

    this._rendreOnglet();
  },

  _changerOnglet(id) {
    this._ongletActif = id;
    const c = document.getElementById('page-calculateur')
      || document.getElementById('page-tools');
    if (c) this.render(c);
  },

  _rendreOnglet() {
    const c = document.getElementById('calc-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'rm1':      this._rendreRM1(c);      break;
      case 'zones':    this._rendreZones(c);    break;
      case 'wilks':    this._rendreWilks(c);    break;
      case 'ffmi':     this._rendreFFMI(c);     break;
      case 'calories': this._rendreCalories(c); break;
      case 'fc':       this._rendreFC(c);       break;
    }
  },

  // ─── ONGLET 1RM ─────────────────────────────────────────
  _rendreRM1(container) {
    let poidsPre = 0, repsPre = 0;
    try {
      const prs = Tracker.getAllPRs();
      const top = Object.values(prs).sort((a,b)=>(b.rm1||0)-(a.rm1||0))[0];
      if (top) { poidsPre = top.poids || 0; repsPre = top.reps || 0; }
    } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">💪 Calculateur 1RM multi-formules</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
          <div>
            <div class="input-label">Poids soulevé (kg)</div>
            <input id="calc-poids" type="number" class="input"
                   placeholder="80" value="${poidsPre || ''}"
                   oninput="Calculateur._calcRM1()"
                   min="1" max="500"/>
          </div>
          <div>
            <div class="input-label">Répétitions</div>
            <input id="calc-reps" type="number" class="input"
                   placeholder="5" value="${repsPre || ''}"
                   oninput="Calculateur._calcRM1()"
                   min="1" max="30"/>
          </div>
        </div>
        <div id="rm1-result"></div>
      </div>`;

    if (poidsPre && repsPre) this._calcRM1();
  },

  _calcRM1() {
    const poids = parseFloat(document.getElementById('calc-poids')?.value) || 0;
    const reps  = parseInt(document.getElementById('calc-reps')?.value)    || 0;
    const res   = document.getElementById('rm1-result');
    if (!res) return;

    if (!poids || !reps) {
      res.innerHTML = '';
      return;
    }

    const resultats = this.calculer1RMTous(poids, reps);
    const moyen     = this.calculer1RMMoyen(poids, reps);
    const vals      = Object.values(resultats).map(r => r.valeur);
    const max       = Math.max(...vals);
    const min       = Math.min(...vals);

    res.innerHTML = `
      <!-- 1RM moyen -->
      <div style="text-align:center;padding:14px;
                  background:rgba(75,75,249,0.1);
                  border:2px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  margin-bottom:14px">
        <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
          1RM ESTIMÉ (MOYENNE)
        </div>
        <div style="font-size:2.5rem;font-weight:900;color:var(--fd-indigo)">
          ${moyen}kg
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);margin-top:4px">
          Fourchette : ${min}kg — ${max}kg
        </div>
      </div>

      <!-- Toutes formules -->
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
        Détail par formule
      </div>
      ${Object.entries(resultats).map(([id, r]) => {
        const pct = max > 0 ? Math.round((r.valeur / max) * 100) : 0;
        return `
          <div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;
                        margin-bottom:4px">
              <div>
                <span style="font-size:.78rem;font-weight:700">${r.nom}</span>
                <span style="font-size:.6rem;color:var(--text-muted);
                             margin-left:6px">${r.info}</span>
              </div>
              <span style="font-size:.82rem;font-weight:800;
                           color:var(--fd-indigo)">${r.valeur}kg</span>
            </div>
            <div style="height:5px;background:rgba(255,255,255,0.06);
                        border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${pct}%;
                          background:var(--fd-indigo);border-radius:99px"></div>
            </div>
          </div>`;
      }).join('')}
    `;
  },

  // ─── ONGLET ZONES ───────────────────────────────────────
  _rendreZones(container) {
    let rm1Pre = 0;
    try {
      const prs = Tracker.getAllPRs();
      rm1Pre = Math.max(...Object.values(prs).map(p => p.rm1 || 0), 0);
    } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">📊 Zones d'entraînement</div>
        <div style="margin-bottom:14px">
          <div class="input-label">1RM de référence (kg)</div>
          <input id="zones-rm1" type="number" class="input"
                 placeholder="100" value="${rm1Pre || ''}"
                 oninput="Calculateur._calcZones()"
                 min="1" max="500"/>
        </div>
        <div id="zones-result"></div>
      </div>`;

    if (rm1Pre) this._calcZones();
  },

  _calcZones() {
    const rm1 = parseFloat(document.getElementById('zones-rm1')?.value) || 0;
    const res = document.getElementById('zones-result');
    if (!res || !rm1) return;

    const zones = this.getZonesEntrainement(rm1);
    res.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:6px">
        ${zones.map(z => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:12px 14px;
                      background:${z.color}11;
                      border:1px solid ${z.color}33;
                      border-left:4px solid ${z.color};
                      border-radius:var(--radius-md)">
            <div style="width:60px;flex-shrink:0;text-align:center">
              <div style="font-size:1.1rem;font-weight:900;color:${z.color}">
                ${z.charge}kg
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">
                ${z.pct}%
              </div>
            </div>
            <div style="flex:1">
              <div style="font-size:.78rem;font-weight:700">${z.zone}</div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                ${z.reps} reps · Repos ${z.repos}
              </div>
              <div style="font-size:.6rem;color:${z.color};margin-top:1px">
                ${z.objectif}
              </div>
            </div>
          </div>`).join('')}
      </div>`;
  },

  // ─── ONGLET WILKS ───────────────────────────────────────
  _rendreWilks(container) {
    let poidsCorps = 0;
    try { poidsCorps = Tracker.getProfil()?.poids || 0; } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">🏋️ Score Wilks — Powerlifting</div>
        <div style="padding:10px 12px;background:rgba(75,75,249,0.06);
                    border-radius:var(--radius-md);margin-bottom:12px;
                    font-size:.72rem;color:var(--text-muted)">
          📊 Le score Wilks normalise ta performance selon ton poids de corps.
          Utilisé dans les compétitions de powerlifting mondiales.
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
          <div>
            <div class="input-label">Genre</div>
            <select id="wilks-genre" class="input" onchange="Calculateur._calcWilks()">
              <option value="homme">👨 Homme</option>
              <option value="femme">👩 Femme</option>
            </select>
          </div>
          <div>
            <div class="input-label">Poids de corps (kg)</div>
            <input id="wilks-poids" type="number" class="input"
                   value="${poidsCorps || ''}" placeholder="80"
                   oninput="Calculateur._calcWilks()" min="40" max="200"/>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:12px">
          ${[
            { id:'wilks-squat',   label:'Squat (kg)',    placeholder:'120' },
            { id:'wilks-bench',   label:'Bench (kg)',    placeholder:'90'  },
            { id:'wilks-deadlift',label:'Deadlift (kg)', placeholder:'150' }
          ].map(f => `
            <div>
              <div class="input-label" style="font-size:.58rem">${f.label}</div>
              <input id="${f.id}" type="number" class="input"
                     placeholder="${f.placeholder}"
                     oninput="Calculateur._calcWilks()"
                     min="0" max="500"/>
            </div>`).join('')}
        </div>
        <div id="wilks-result"></div>
      </div>`;

    // Préremplir avec les PRs
    try {
      const prs = Tracker.getAllPRs();
      const vals = {
        'wilks-squat':    prs['squat']?.rm1          || '',
        'wilks-bench':    prs['bench_press']?.rm1    || '',
        'wilks-deadlift': prs['soulevé_terre']?.rm1  || ''
      };
      Object.entries(vals).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el && val) el.value = val;
      });
      if (prs['squat'] || prs['bench_press'] || prs['soulevé_terre']) {
        this._calcWilks();
      }
    } catch(e) {}
  },

  _calcWilks() {
    const genre   = document.getElementById('wilks-genre')?.value || 'homme';
    const poids   = parseFloat(document.getElementById('wilks-poids')?.value)    || 0;
    const squat   = parseFloat(document.getElementById('wilks-squat')?.value)    || 0;
    const bench   = parseFloat(document.getElementById('wilks-bench')?.value)    || 0;
    const deadlft = parseFloat(document.getElementById('wilks-deadlift')?.value) || 0;
    const res     = document.getElementById('wilks-result');
    if (!res) return;

    const total = squat + bench + deadlft;
    if (!total || !poids) {
      res.innerHTML = '';
      return;
    }

    const score    = this.calculerWilks(total, poids, genre);
    const categorie= this.getCategorieWilks(score);

    res.innerHTML = `
      <!-- Score principal -->
      <div style="text-align:center;padding:16px;
                  background:rgba(249,239,119,0.08);
                  border:2px solid rgba(249,239,119,0.25);
                  border-radius:var(--radius-xl);margin-bottom:12px">
        <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
          SCORE WILKS II
        </div>
        <div style="font-size:3rem;font-weight:900;color:var(--fd-lemon)">
          ${score}
        </div>
        <div style="font-size:1.2rem;margin-top:4px">${categorie.emoji}</div>
        <div style="font-size:.82rem;font-weight:700;
                    color:${categorie.color};margin-top:4px">
          ${categorie.label}
        </div>
      </div>

      <!-- Total et décomposition -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);
                  gap:6px;margin-bottom:12px">
        ${[
          { label:'Total', val:`${total}kg`, color:'var(--fd-lemon)' },
          { label:'Squat', val:`${squat}kg`, color:'#4b4bf9'         },
          { label:'Bench', val:`${bench}kg`, color:'#ff8d96'         },
          { label:'Dead',  val:`${deadlft}kg`,color:'#8bf0bb'        }
        ].map(s => `
          <div style="text-align:center;padding:8px 4px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.78rem;font-weight:700;color:${s.color}">
              ${s.val}</div>
            <div style="font-size:.55rem;color:var(--text-muted)">${s.label}</div>
          </div>`).join('')}
      </div>

      <!-- Niveaux Wilks -->
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
        Échelle de référence
      </div>
      ${[500,400,300,200,100].map(seuil => {
        const cat = this.getCategorieWilks(seuil);
        return `
          <div style="display:flex;align-items:center;gap:8px;
                      padding:6px 0;
                      border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="font-size:.8rem">${cat.emoji}</span>
            <span style="flex:1;font-size:.72rem;
                         color:${score >= seuil
                           ? 'var(--text-primary)' : 'var(--text-muted)'}">
              ${cat.label}
            </span>
            <span style="font-size:.72rem;font-weight:700;
                         color:${score >= seuil ? cat.color : 'var(--text-muted)'}">
              ${score >= seuil ? '✅' : ''} ${seuil}+
            </span>
          </div>`;
      }).join('')}
    `;
  },

  // ─── ONGLET FFMI ────────────────────────────────────────
  _rendreFFMI(container) {
    let poidsCorps = 0, tailleCorps = 0;
    try {
      const p = Tracker.getProfil();
      poidsCorps  = p.poids  || 0;
      tailleCorps = p.taille || 0;
    } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">🧬 FFMI — Indice Masse Musculaire</div>
        <div style="padding:10px 12px;background:rgba(75,75,249,0.06);
                    border-radius:var(--radius-md);margin-bottom:12px;
                    font-size:.72rem;color:var(--text-muted)">
          🧬 Le FFMI mesure ton niveau de développement musculaire
          relativement à ta taille. Le maximum naturel est généralement ~26.
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:12px">
          <div>
            <div class="input-label">Poids (kg)</div>
            <input id="ffmi-poids" type="number" class="input"
                   value="${poidsCorps || ''}" placeholder="80"
                   oninput="Calculateur._calcFFMI()" min="40" max="200"/>
          </div>
          <div>
            <div class="input-label">Taille (cm)</div>
            <input id="ffmi-taille" type="number" class="input"
                   value="${tailleCorps || ''}" placeholder="175"
                   oninput="Calculateur._calcFFMI()" min="140" max="220"/>
          </div>
          <div>
            <div class="input-label">% Masse grasse (optionnel)</div>
            <input id="ffmi-gras" type="number" class="input"
                   placeholder="15 (défaut)"
                   oninput="Calculateur._calcFFMI()" min="3" max="50"/>
          </div>
          <div>
            <div class="input-label">Genre</div>
            <select id="ffmi-genre" class="input" onchange="Calculateur._calcFFMI()">
              <option value="homme">👨 Homme</option>
              <option value="femme">👩 Femme</option>
            </select>
          </div>
        </div>
        <div id="ffmi-result"></div>
      </div>`;

    if (poidsCorps && tailleCorps) this._calcFFMI();
  },

  _calcFFMI() {
    const poids  = parseFloat(document.getElementById('ffmi-poids')?.value)  || 0;
    const taille = parseFloat(document.getElementById('ffmi-taille')?.value) || 0;
    const gras   = parseFloat(document.getElementById('ffmi-gras')?.value)   || null;
    const res    = document.getElementById('ffmi-result');
    if (!res || !poids || !taille) return;

    const ffmiData = this.calculerFFMI(poids, taille, gras);
    const imcData  = this.calculerIMC(poids, taille);
    if (!ffmiData) return;

    const cat  = ffmiData.categorie;
    const seuils = [18, 20, 22, 24, 26];

    res.innerHTML = `
      <!-- Score FFMI -->
      <div style="text-align:center;padding:16px;
                  background:${cat.color}11;
                  border:2px solid ${cat.color}33;
                  border-radius:var(--radius-xl);margin-bottom:12px">
        <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
          FFMI NORMALISÉ
        </div>
        <div style="font-size:3rem;font-weight:900;color:${cat.color}">
          ${ffmiData.ffmiNorm}
        </div>
        <div style="font-size:1.2rem;margin-top:4px">${cat.emoji}</div>
        <div style="font-size:.82rem;font-weight:700;
                    color:${cat.color};margin-top:4px">
          ${cat.label}
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);margin-top:2px">
          ${cat.info}
        </div>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:6px;margin-bottom:12px">
        ${[
          { label:'FFMI brut',      val:ffmiData.ffmi,        color:'var(--fd-indigo)'   },
          { label:'Masse maigre',   val:`${ffmiData.masseMaigre}kg`, color:'var(--fd-mint)'     },
          { label:'Masse grasse',   val:`${ffmiData.masseGrasse}kg`, color:'var(--fd-coral)'    }
        ].map(s => `
          <div style="text-align:center;padding:8px 4px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.78rem;font-weight:700;color:${s.color}">
              ${s.val}</div>
            <div style="font-size:.55rem;color:var(--text-muted);margin-top:2px">
              ${s.label}</div>
          </div>`).join('')}
      </div>

      <!-- IMC -->
      ${imcData ? `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:10px 12px;margin-bottom:12px;
                    background:rgba(255,255,255,0.04);
                    border-radius:var(--radius-md)">
          <span style="font-size:.85rem">${imcData.categorie.emoji}</span>
          <div style="flex:1;font-size:.75rem">
            IMC : <strong>${imcData.valeur}</strong>
            — ${imcData.categorie.label}
          </div>
          <div style="font-size:.62rem;color:${imcData.categorie.color};font-weight:700">
            ${imcData.categorie.label}
          </div>
        </div>` : ''}

      <!-- Jauge FFMI -->
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
        Échelle FFMI
      </div>
      <div style="position:relative;height:8px;
                  background:linear-gradient(to right,
                    #8bf0bb 0%,#4b4bf9 30%,#bfa1ff 55%,#ff8d96 80%,#f9ef77 100%);
                  border-radius:99px;margin-bottom:4px">
        <!-- Indicateur position -->
        <div style="position:absolute;top:-3px;
                    left:${Math.min(95, Math.max(0, (ffmiData.ffmiNorm-16)/(28-16)*100))}%;
                    transform:translateX(-50%);
                    width:14px;height:14px;
                    background:white;border-radius:50%;
                    border:3px solid var(--fd-indigo);
                    box-shadow:0 2px 6px rgba(0,0,0,0.4)">
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;
                  font-size:.58rem;color:var(--text-muted)">
        <span>16 — Natif</span>
        <span>20 — Entraîné</span>
        <span>24 — Avancé</span>
        <span>26+ — Elite</span>
      </div>
    `;
  },

  // ─── ONGLET CALORIES ────────────────────────────────────
  _rendreCalories(container) {
    let poidsCorps = 0;
    try { poidsCorps = Tracker.getProfil()?.poids || 0; } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">🔥 Calories brûlées</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:12px">
          <div>
            <div class="input-label">Poids (kg)</div>
            <input id="cal-poids" type="number" class="input"
                   value="${poidsCorps || ''}" placeholder="80"
                   oninput="Calculateur._calcCalories()" min="30" max="200"/>
          </div>
          <div>
            <div class="input-label">Durée (min)</div>
            <input id="cal-duree" type="number" class="input"
                   placeholder="60" value="60"
                   oninput="Calculateur._calcCalories()" min="5" max="300"/>
          </div>
          <div>
            <div class="input-label">Genre</div>
            <select id="cal-genre" class="input" onchange="Calculateur._calcCalories()">
              <option value="homme">👨 Homme</option>
              <option value="femme">👩 Femme</option>
            </select>
          </div>
        </div>

        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-bottom:8px;font-weight:600">
          Activité
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${Object.entries(this.ACTIVITES).map(([id, act]) => `
            <div onclick="Calculateur._selectActivite('${id}',this)"
                 data-activite="${id}"
                 style="display:flex;align-items:center;gap:10px;
                        padding:10px 12px;cursor:pointer;
                        background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);
                        transition:all .15s"
                 onmouseenter="this.style.borderColor='rgba(75,75,249,0.2)'"
                 onmouseleave="if(!this.classList.contains('selected'))
                   this.style.borderColor='rgba(255,255,255,0.07)'">
              <div style="flex:1">
                <div style="font-size:.78rem;font-weight:600">${act.label}</div>
                <div style="font-size:.6rem;color:var(--text-muted)">
                  MET ${act.met}
                </div>
              </div>
              <div id="cal-${id}" style="font-size:.82rem;font-weight:700;
                          color:var(--fd-lemon)">—</div>
            </div>`).join('')}
        </div>
      </div>`;

    this._calcCalories();
  },

  _activiteSelectionnee: null,

  _selectActivite(id, el) {
    this._activiteSelectionnee = id;
    document.querySelectorAll('[data-activite]').forEach(b => {
      b.style.background   = 'rgba(255,255,255,0.03)';
      b.style.borderColor  = 'rgba(255,255,255,0.07)';
    });
    el.style.background  = 'rgba(75,75,249,0.1)';
    el.style.borderColor = 'rgba(75,75,249,0.25)';
    this._calcCalories();
  },

  _calcCalories() {
    const poids = parseFloat(document.getElementById('cal-poids')?.value) || 0;
    const duree = parseFloat(document.getElementById('cal-duree')?.value) || 60;
    const genre = document.getElementById('cal-genre')?.value || 'homme';
    if (!poids) return;

    Object.keys(this.ACTIVITES).forEach(id => {
      const el  = document.getElementById(`cal-${id}`);
      if (!el) return;
      const cal = this.calculerCalories(id, duree, poids, genre);
      el.textContent = `${cal} kcal`;
    });
  },

  // ─── ONGLET FC ──────────────────────────────────────────
  _rendreFC(container) {
    let agePre = 0;
    try { agePre = Utils.storage.get('ft_profil_onboarding', {})?.age || 0; } catch(e) {}

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">❤️ Zones de Fréquence Cardiaque</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:12px">
          <div>
            <div class="input-label">Âge</div>
            <input id="fc-age" type="number" class="input"
                   value="${agePre || ''}" placeholder="25"
                   oninput="Calculateur._calcFC()" min="10" max="90"/>
          </div>
          <div>
            <div class="input-label">FC au repos (bpm)</div>
            <input id="fc-repos" type="number" class="input"
                   placeholder="60" value="60"
                   oninput="Calculateur._calcFC()" min="30" max="100"/>
          </div>
        </div>
        <div id="fc-result"></div>
      </div>`;

    if (agePre) this._calcFC();
  },

  _calcFC() {
    const age    = parseInt(document.getElementById('fc-age')?.value)   || 0;
    const repos  = parseInt(document.getElementById('fc-repos')?.value) || 60;
    const res    = document.getElementById('fc-result');
    if (!res || !age) return;

    const fcMax = 220 - age;
    const zones = this.calculerZonesFC(age, repos);

    res.innerHTML = `
      <!-- FC Max -->
      <div style="text-align:center;padding:12px;
                  background:rgba(255,141,150,0.08);
                  border:1px solid rgba(255,141,150,0.2);
                  border-radius:var(--radius-lg);margin-bottom:12px">
        <div style="font-size:.6rem;color:var(--text-muted)">FC MAX ESTIMÉE</div>
        <div style="font-size:2rem;font-weight:900;color:var(--fd-coral)">
          ${fcMax} bpm
        </div>
        <div style="font-size:.65rem;color:var(--text-muted)">
          Formule : 220 - âge · Méthode Karvonen
        </div>
      </div>

      <!-- Zones -->
      <div style="display:flex;flex-direction:column;gap:6px">
        ${zones.map(z => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:12px 14px;
                      background:${z.color}11;
                      border:1px solid ${z.color}33;
                      border-left:4px solid ${z.color};
                      border-radius:var(--radius-md)">
            <div style="width:40px;text-align:center;flex-shrink:0">
              <div style="font-size:.72rem;font-weight:800;
                          color:${z.color}">Z${z.zone}</div>
              <div style="font-size:.55rem;color:var(--text-muted)">
                ${z.pctMin}-${z.pctMax}%
              </div>
            </div>
            <div style="flex:1">
              <div style="font-size:.78rem;font-weight:700">${z.nom}</div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                ${z.objectif}
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:.78rem;font-weight:700;color:${z.color}">
                ${z.fcMin}-${z.fcMax}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">bpm</div>
            </div>
          </div>`).join('')}
      </div>

      <div style="margin-top:12px;padding:8px 12px;
                  background:rgba(75,75,249,0.06);
                  border-radius:var(--radius-md);
                  font-size:.65rem;color:var(--text-muted)">
        💡 Méthode de Karvonen — plus précise car intègre ta FC au repos
      </div>
    `;
  }
};

window.Calculateur = Calculateur;
console.log('✅ Calculateur.js v1.0 — 1RM + Zones + Wilks + FFMI + Calories + FC');
