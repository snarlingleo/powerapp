/* ============================================================
   PowerApp — Profil.js v3.0
   ✅ Tout v2.0 conservé
   ✅ Corps SVG anatomique réaliste (même que onboarding)
   ✅ Image + maphilight + zones cliquables
   ✅ Chips muscles sélectionnés
   ✅ Sync complet
   ============================================================ */

'use strict';

const Profil = {

  CLE:            'ft_profil_complet',
  CLE_ONBOARDING: 'ft_profil_onboarding',
  CLE_THEME:      'ft_theme_config',

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
  // GET / SET
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
    this._syncOnboarding(nouveau);
    return nouveau;
  },

  _syncOnboarding(profil) {
    try {
      const existant = Utils.storage.get(this.CLE_ONBOARDING, {});
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

    const lipides         = Math.round((calories * 0.27) / 9);
    const calProtPlusFat  = (proteines * 4) + (lipides * 9);
    const glucides        = Math.round(
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
    pectoraux:  { label:'Pectoraux',         couleur:'#4b4bf9' },
    deltoides:  { label:'Deltoïdes',         couleur:'#bfa1ff' },
    biceps:     { label:'Biceps',            couleur:'#8bf0bb' },
    avantbras:  { label:'Avant-bras',        couleur:'#8bf0bb' },
    abdominaux: { label:'Abdominaux',        couleur:'#f9ef77' },
    quadriceps: { label:'Quadriceps',        couleur:'#22c55e' },
    trapeze:    { label:'Trapèzes',          couleur:'#8bf0bb' },
    dorsal:     { label:'Grand Dorsal',      couleur:'#4b4bf9' },
    lombaires:  { label:'Lombaires',         couleur:'#bfa1ff' },
    fessiers:   { label:'Fessiers',          couleur:'#ff8d96' },
    ischio:     { label:'Ischio-jambiers',   couleur:'#f9ef77' },
    mollets:    { label:'Mollets',           couleur:'#bfa1ff' },
    triceps:    { label:'Triceps',           couleur:'#ff8d96' }
  },

  THEMES: {
    dark:   { label:'🌑 Dark',   desc:'Thème sombre par défaut' },
    light:  { label:'☀️ Light',  desc:'Thème clair'             },
    indigo: { label:'💜 Indigo', desc:'Accent violet accentué'  },
    coral:  { label:'🪸 Coral',  desc:'Accent corail chaleureux'}
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATIONS (v2.0 conservé)
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

    return {
      seancesParSemaine: objConfig.seances,
      split:             nivConfig.split,
      reps:              objConfig.reps,
      repos:             objConfig.repos,
      dureeSeance:       nivConfig.duree,
      equipement:        lieuConfig.equipement,
      conseil:           objConfig.conseil,
      nutrition:         profil.nutrition
    };
  },

  // ════════════════════════════════════════════════════════
  // RÉSUMÉ PROFIL (v2.0 conservé)
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
  // RENDER PAGE PROFIL (v2.0 conservé)
  // ════════════════════════════════════════════════════════
  renderPage(container) {
    if (!container) return;

    const profil = this.get();
    const resume = this.getResume(profil);
    const nut    = profil.nutrition || this.DEFAUT.nutrition;

    let totalSeances = 0, streak = 0, totalPRs = 0;
    try {
      totalSeances = Tracker.getTotalSeances();
      streak       = Tracker.getStreak().count;
      totalPRs     = Object.keys(Tracker.getAllPRs()).length;
    } catch(e) {}

    container.innerHTML = `

      <!-- HERO -->
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
                         background:var(--fd-indigo);border:none;
                         border-radius:99px;font-size:.72rem;
                         font-weight:700;color:white;cursor:pointer;
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
                          font-weight:700">⚖️ ${profil.poids}kg</div>` : ''}
            ${profil.taille ? `
              <div style="padding:6px 12px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;font-size:.72rem;
                          font-weight:700">📏 ${profil.taille}cm</div>` : ''}
            ${resume.imc ? `
              <div style="padding:6px 12px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;font-size:.72rem;
                          font-weight:700;color:${resume.imcLabel?.color}">
                IMC ${resume.imc} · ${resume.imcLabel?.label}
              </div>` : ''}
          </div>` : ''}
      </div>

      <!-- Stats rapides -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { val:totalSeances, label:'Séances', color:'var(--fd-indigo)' },
          { val:`${streak}🔥`, label:'Streak', color:'var(--fd-lemon)'  },
          { val:totalPRs,    label:'PRs',    color:'var(--fd-mint)'    }
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

      <!-- Objectif -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          🎯 Objectif & Programme
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
          <div style="width:40px;height:40px;border-radius:12px;
                      background:${resume.objectifCouleur}22;
                      border:1px solid ${resume.objectifCouleur}44;
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.2rem;flex-shrink:0">
            ${resume.objectif.split(' ')[0]}
          </div>
          <div>
            <div style="font-size:.9rem;font-weight:700;
                        color:${resume.objectifCouleur}">
              ${resume.objectif}</div>
            <div style="font-size:.65rem;color:var(--text-muted);margin-top:2px">
              ${resume.reps} reps · Repos ${resume.repos} · ${resume.seances}j/sem
            </div>
          </div>
        </div>
        <div style="padding:8px 12px;background:rgba(75,75,249,0.06);
                    border:1px solid rgba(75,75,249,0.15);
                    border-radius:var(--radius-md);
                    font-size:.72rem;color:var(--text-muted)">
          💡 ${resume.conseil}
        </div>

        <!-- ✅ Muscles ciblés — aperçu visuel -->
        ${resume.muscles.length > 0 ? `
          <div style="margin-top:10px">
            <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:6px">
              🎯 Muscles ciblés
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:5px">
              ${(profil.muscles_cibles || []).map(m => {
                const cfg = this.MUSCLES[m] || {};
                return `
                  <span style="padding:4px 10px;
                               background:${cfg.couleur || '#4b4bf9'}22;
                               border:1px solid ${cfg.couleur || '#4b4bf9'}44;
                               border-radius:99px;font-size:.62rem;
                               font-weight:700;
                               color:${cfg.couleur || 'var(--fd-lavender)'}">
                    ${cfg.label || m}
                  </span>`;
              }).join('')}
            </div>
          </div>` : ''}
      </div>

      <!-- Nutrition -->
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
                         cursor:pointer;font-weight:600">Voir →</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
          ${[
            { label:'Calories',  val:`${nut.calories} kcal`, color:'var(--fd-lemon)',    emoji:'🔥' },
            { label:'Protéines', val:`${nut.proteines}g`,    color:'var(--fd-coral)',    emoji:'🥩' },
            { label:'Glucides',  val:`${nut.glucides}g`,     color:'var(--fd-mint)',     emoji:'🍚' },
            { label:'Lipides',   val:`${nut.lipides}g`,      color:'var(--fd-lavender)', emoji:'🥑' }
          ].map(n => `
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);
                        padding:10px;text-align:center">
              <div style="font-size:.85rem;margin-bottom:3px">${n.emoji}</div>
              <div style="font-size:.9rem;font-weight:800;color:${n.color}">${n.val}</div>
              <div style="font-size:.55rem;color:var(--text-muted);margin-top:2px;
                          text-transform:uppercase">${n.label}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:8px;padding:8px 12px;
                    background:rgba(75,75,249,0.06);border-radius:var(--radius-md);
                    display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:.72rem;color:var(--text-muted)">💧 Eau recommandée</span>
          <span style="font-size:.82rem;font-weight:700;color:var(--fd-indigo)">
            ${nut.eau}L / jour</span>
        </div>
      </div>

      <!-- Thème -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
          🎨 Personnalisation
        </div>
        ${this._renderThemeSelector()}
      </div>

      <!-- Actions -->
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px">
        <button onclick="Profil._ouvrirEdition()"
                class="btn-primary" style="width:100%">
          ✏️ Modifier mon profil
        </button>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
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

  // ════════════════════════════════════════════════════════
  // THÈME (v2.0 conservé)
  // ════════════════════════════════════════════════════════
  _renderThemeSelector() {
    const themeActuel = Utils.storage.get(this.CLE_THEME, 'dark');
    return `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
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
              ${theme.label.split(' ')[0]}</div>
            <div style="font-size:.62rem;font-weight:600;
                        color:${themeActuel === val
                          ? 'var(--fd-indigo)'
                          : 'var(--text-muted)'}">
              ${theme.label.split(' ').slice(1).join(' ')}
            </div>
          </button>`).join('')}
      </div>
      <div style="margin-top:8px;font-size:.65rem;color:var(--text-muted);text-align:center">
        Typographies et logos bientôt disponibles
      </div>
    `;
  },

  _changerTheme(theme) {
    Utils.storage.set(this.CLE_THEME, theme);
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    Utils.toast(`🎨 Thème ${this.THEMES[theme]?.label} appliqué !`, 'success', 1500);
    const container = document.getElementById('page-mon_profil');
    if (container) this.renderPage(container);
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v3.0 — Corps anatomique réaliste
  // Même image + maphilight que l'onboarding
  // ════════════════════════════════════════════════════════
  renderCorpsSVG(musclesCibles = []) {
    const sel = new Set(musclesCibles);

    const CFG = {
      pectoraux:  { label:'Pectoraux',       couleur:'#4b4bf9' },
      deltoides:  { label:'Deltoïdes',       couleur:'#bfa1ff' },
      biceps:     { label:'Biceps',          couleur:'#8bf0bb' },
      avantbras:  { label:'Avant-bras',      couleur:'#8bf0bb' },
      abdominaux: { label:'Abdominaux',      couleur:'#f9ef77' },
      quadriceps: { label:'Quadriceps',      couleur:'#22c55e' },
      trapeze:    { label:'Trapèzes',        couleur:'#8bf0bb' },
      dorsal:     { label:'Grand Dorsal',    couleur:'#4b4bf9' },
      lombaires:  { label:'Lombaires',       couleur:'#bfa1ff' },
      fessiers:   { label:'Fessiers',        couleur:'#ff8d96' },
      ischio:     { label:'Ischio-jambiers', couleur:'#f9ef77' },
      mollets:    { label:'Mollets',         couleur:'#bfa1ff' },
      triceps:    { label:'Triceps',         couleur:'#ff8d96' }
    };

    const chipsHTML = sel.size === 0 ? `
      <span style="font-size:.72rem;color:var(--text-muted);font-style:italic">
        Aucun muscle ciblé — programme complet
      </span>` :
      [...sel].map(m => {
        const cfg = CFG[m];
        if (!cfg) return '';
        return `
          <span onclick="Profil._toggleMuscleModal('${m}')"
                style="display:inline-flex;align-items:center;gap:5px;
                       padding:5px 12px;background:${cfg.couleur}22;
                       border:1px solid ${cfg.couleur}66;border-radius:99px;
                       font-size:.68rem;font-weight:700;cursor:pointer;
                       color:${cfg.couleur}">
            ${cfg.label}
            <span style="opacity:.6;font-size:.6rem">✕</span>
          </span>`;
      }).join('');

    return `
      <div style="text-align:center;margin-bottom:8px;
                  font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted)">
        Clique sur les zones à cibler
      </div>

      <!-- Image anatomique + image map -->
      <div style="position:relative;display:inline-block;
                  width:100%;text-align:center;margin-bottom:12px">
        <img id="profil-body-img"
             src="Capture d'écran 2026-05-24 204800.png"
             usemap="#profil-image-map"
             onload="Profil._initBodyMap(${JSON.stringify([...sel])})"
             style="max-width:100%;height:auto;
                    border-radius:12px;display:inline-block;
                    max-height:320px;object-fit:contain;
                    mix-blend-mode:multiply"
             alt="Carte musculaire"/>
      </div>

      <map name="profil-image-map" id="profil-image-map">

        <!-- ══ FACE AVANT ══ -->
        <area data-muscle="pectoraux" href="#" shape="poly"
              coords="200,204,206,201,212,197,216,191,221,187,226,180,212,197,230,174,235,169,241,162,246,158,252,154,258,154,265,152,272,152,278,153,284,154,289,155,296,159,297,166,297,171,297,180,297,205,295,212,291,218,284,224,278,229,270,232,261,235,251,234,242,232,233,228,225,221,219,213,212,208,205,206"/>
        <area data-muscle="pectoraux" href="#" shape="poly"
              coords="299,207,302,213,308,220,314,224,318,227,326,231,333,233,342,234,350,233,358,230,366,226,373,219,378,216,383,211,388,207,395,205,390,200,382,196,377,190,370,182,365,175,359,167,352,161,343,157,333,153,324,153,316,152,310,153,304,156,300,161,298,167,299,189"/>
        <area data-muscle="biceps" href="#" shape="poly"
              coords="175,215,186,209,194,208,202,208,209,210,213,214,216,222,215,231,213,238,209,246,204,251,192,266,185,275,177,283,167,287,156,285,151,275,151,262,153,252,160,237,165,228"/>
        <area data-muscle="biceps" href="#" shape="poly"
              coords="422,213,432,227,436,237,440,245,443,255,445,266,445,276,442,284,432,288,422,284,414,277,407,269,402,260,394,251,388,245,384,238,382,228,381,220,383,211,390,208,398,206,409,207"/>
        <area data-muscle="deltoides" href="#" shape="poly"
              coords="177,211,181,200,184,188,189,179,192,171,197,163,204,158,213,154,221,152,229,151,236,150,241,150,247,151,253,151,258,152,252,157,247,160,243,164,236,170,231,175,226,182,222,188,215,195,209,199,203,203,196,206,187,208"/>
        <area data-muscle="deltoides" href="#" shape="poly"
              coords="339,153,348,149,356,149,366,148,376,151,385,153,391,157,398,161,403,167,408,172,411,181,412,187,415,193,419,201,421,211,411,207,403,205,395,202,387,198,381,192,372,182,367,175,362,167,354,161,347,156"/>
        <area data-muscle="trapeze" href="#" shape="poly"
              coords="270,125,269,144,266,149,260,152,253,152,246,150,238,149,231,149,239,143,246,141,252,139,259,136,263,133,268,131"/>
        <area data-muscle="trapeze" href="#" shape="poly"
              coords="327,124,326,140,328,146,333,149,338,151,344,149,350,149,357,148,363,147,356,141,349,138,341,136,334,132"/>
        <area data-muscle="avantbras" href="#" shape="poly"
              coords="151,259,140,271,134,279,128,290,121,298,117,310,112,320,108,329,103,341,100,350,97,356,94,362,98,365,103,369,108,369,113,367,118,361,123,355,128,351,135,347,141,340,148,332,156,322,162,312,165,306,169,299,173,292,177,285,168,287,161,289,156,285,151,277,150,269"/>
        <area data-muscle="avantbras" href="#" shape="poly"
              coords="445,253,447,260,451,265,458,272,463,278,467,285,471,289,474,295,476,301,480,309,483,316,501,358,500,363,498,368,490,370,483,367,479,360,472,353,464,347,457,340,449,331,442,322,436,311,430,302,426,293,417,282,423,284,429,287,436,287,442,285,445,277,446,269"/>
        <area data-muscle="abdominaux" href="#" shape="poly"
              coords="213,211,261,257,261,264,261,277,259,288,258,294,257,299,257,305,258,314,258,322,257,327,256,336,254,341,252,345,247,351,239,355,232,355,231,346,233,337,235,329,237,319,238,309,236,300,234,290,230,281,226,273,222,263,219,254,216,246,214,238,217,230,216,221"/>
        <area data-muscle="abdominaux" href="#" shape="poly"
              coords="381,213,336,259,336,267,336,274,338,280,338,287,340,296,340,304,340,313,339,318,338,324,339,332,341,337,343,344,347,349,352,352,357,354,365,354,364,341,362,328,361,313,361,301,363,291,367,283,372,272,376,262,379,255,380,247,382,241,380,232,380,222"/>
        <area data-muscle="abdominaux" href="#" shape="poly"
              coords="260,241,270,234,281,230,291,229,296,231,298,236,302,231,308,228,315,230,322,233,330,236,336,241,336,247,334,254,333,261,333,268,333,276,333,287,332,295,331,329,329,345,327,356,325,365,318,379,311,393,301,401,292,398,286,391,279,381,272,367,267,349,264,301,263,274,263,258"/>
        <area data-muscle="quadriceps" href="#" shape="poly"
              coords="230,356,241,361,252,367,258,374,265,381,271,395,275,407,279,418,284,430,287,437,291,441,296,441,295,449,294,466,291,479,287,494,279,515,275,535,272,552,268,570,262,580,256,587,248,586,242,577,239,570,236,564,230,566,223,563,220,555,216,543,214,528,212,512,212,491,214,466,214,449,221,411,226,393,228,375"/>
        <area data-muscle="quadriceps" href="#" shape="poly"
              coords="366,357,367,374,372,397,377,422,380,447,384,472,384,497,382,516,381,531,378,550,375,561,372,566,365,567,360,565,356,571,354,580,350,586,341,587,336,584,331,575,328,567,325,554,322,537,317,517,313,503,308,486,303,471,301,457,300,442,306,440,311,434,316,424,319,411,325,394,334,378,345,367,354,361"/>

        <!-- ══ FACE DOS ══ -->
        <area data-muscle="trapeze" href="#" shape="poly"
              coords="691,147,703,141,710,137,718,135,728,134,740,133,754,133,768,134,783,134,793,134,806,139,813,143,821,146,815,149,809,153,802,159,795,164,786,164,773,162,758,162,745,162,735,163,724,164,716,163,710,158,704,153,698,149"/>
        <area data-muscle="trapeze" href="#" shape="poly"
              coords="797,165,790,178,783,194,776,208,772,219,768,229,765,238,762,246,759,252,757,254,752,249,749,242,745,232,742,222,737,211,732,201,728,191,724,182,720,174,715,166,721,167,727,166,736,164,746,164,753,163,764,163,772,164,780,164,789,166"/>
        <area data-muscle="deltoides" href="#" shape="poly"
              coords="710,159,697,171,680,184,671,190,662,194,650,197,641,199,634,200,635,191,638,184,642,176,647,170,654,164,660,158,668,153,676,151,684,150,692,149,700,152"/>
        <area data-muscle="deltoides" href="#" shape="poly"
              coords="803,160,813,168,824,177,837,187,846,192,853,195,864,197,871,197,879,200,877,192,875,185,870,177,865,168,858,162,849,157,840,153,829,149,819,150,810,153"/>
        <area data-muscle="triceps" href="#" shape="poly"
              coords="668,233,645,266,640,273,634,277,626,284,621,283,619,275,617,266,613,265,606,266,601,267,603,258,607,248,611,238,615,228,620,219,626,211,632,205,638,201,645,200,651,198,658,196,664,195,664,203,666,213,668,223"/>
        <area data-muscle="triceps" href="#" shape="poly"
              coords="848,196,856,198,866,199,872,200,878,202,883,207,888,211,892,218,897,225,899,231,903,240,907,247,909,252,912,259,913,266,909,267,902,266,898,266,895,268,895,275,894,280,890,285,884,280,877,276,871,268,863,260,859,250,852,244,848,235,845,227,846,217,848,210,849,204"/>
        <area data-muscle="dorsal" href="#" shape="poly"
              coords="710,161,700,171,690,179,681,186,675,190,667,194,665,200,667,206,668,212,669,220,670,226,669,232,669,236,671,243,673,249,678,260,680,268,683,274,688,280,688,286,690,293,691,299,691,305,691,313,691,323,692,330,689,339,689,346,687,353,687,359,685,369,693,362,699,357,705,354,714,351,719,345,721,336,721,324,720,314,722,306,725,300,731,290,736,278,740,267,744,256,744,244,744,234,736,215,728,194,718,175"/>
        <area data-muscle="dorsal" href="#" shape="poly"
              coords="802,161,818,174,830,185,839,191,845,196,847,203,846,211,843,218,843,224,843,230,844,236,839,250,835,262,831,269,828,277,824,284,823,293,821,304,822,315,822,325,823,336,824,345,825,356,826,362,828,370,823,365,818,360,810,355,805,351,798,348,792,341,791,328,791,316,791,308,788,301,783,292,778,282,775,272,771,263,768,252,770,235,774,224,778,211,785,196,791,183,796,173"/>
        <area data-muscle="lombaires" href="#" shape="poly"
              coords="766,243,763,249,760,254,757,257,753,255,749,247,745,240,748,252,746,258,744,265,740,275,737,283,733,291,731,296,728,302,725,308,724,314,724,320,724,328,724,335,722,342,718,349,726,347,732,347,739,348,745,351,750,355,753,359,754,364,756,370,759,364,762,357,766,353,772,348,778,346,784,347,791,347,792,348,790,338,789,330,789,321,789,314,787,306,783,298,780,289,775,282,772,273,769,264,767,255"/>
        <area data-muscle="fessiers" href="#" shape="poly"
              coords="710,352,705,359,699,369,696,378,695,388,692,395,691,406,691,414,694,421,697,427,702,434,710,437,718,439,731,440,740,440,748,438,755,431,755,418,756,390,756,374,753,364,747,355,740,351,730,347,722,349"/>
        <area data-muscle="fessiers" href="#" shape="poly"
              coords="758,426,758,370,763,358,771,351,781,349,792,350,800,352,808,359,811,363,815,372,818,382,820,391,823,403,822,412,821,421,815,428,811,433,803,438,790,441,780,440,772,440,765,438,760,433"/>
        <area data-muscle="ischio" href="#" shape="poly"
              coords="810,357,820,364,828,375,830,385,833,396,836,417,841,440,845,467,845,490,845,517,844,540,836,573,829,579,823,575,812,554,809,559,809,572,808,579,805,588,797,589,790,580,786,567,779,537,765,476,762,461,758,442,756,432,764,439,773,442,785,442,792,441,804,438,817,430,822,421,825,409,823,396,818,383,814,370"/>
        <area data-muscle="ischio" href="#" shape="poly"
              coords="754,435,749,474,741,509,733,537,731,545,728,557,725,571,722,582,714,589,706,582,702,571,701,555,696,560,692,568,689,577,682,576,677,566,673,553,671,537,668,514,668,491,669,469,669,450,673,435,675,422,677,409,680,395,682,387,684,374,688,367,695,363,706,353,703,360,698,373,694,382,691,393,689,402,689,412,692,422,695,430,704,436,715,440,728,441,740,441,748,439"/>
        <area data-muscle="mollets" href="#" shape="poly"
              coords="667,615,662,628,659,640,659,656,658,667,661,682,665,690,669,694,676,694,681,685,685,676,689,672,690,674,692,680,693,688,695,694,701,696,707,694,712,687,714,678,715,667,713,637,709,628,703,622,698,625,694,629,687,626,681,620,675,615"/>
        <area data-muscle="mollets" href="#" shape="poly"
              coords="843,613,839,617,833,622,828,625,821,628,813,625,807,627,802,630,802,634,801,642,800,647,799,656,799,662,799,667,799,673,799,680,800,687,803,691,808,696,815,697,820,692,821,685,822,678,825,672,829,676,831,681,834,688,838,692,842,695,845,694,850,687,853,678,854,668,855,656,854,646,852,636,851,626,847,617"/>
      </map>

      <!-- Chips muscles sélectionnés -->
      <div id="profil-muscles-chips"
           style="display:flex;flex-wrap:wrap;gap:6px;
                  justify-content:center;margin-bottom:10px;
                  min-height:32px">
        ${chipsHTML}
      </div>

      <!-- Info -->
      <div style="padding:8px 12px;
                  background:rgba(75,75,249,0.06);
                  border:1px solid rgba(75,75,249,0.12);
                  border-radius:var(--radius-md);
                  font-size:.7rem;color:var(--text-muted);
                  text-align:center">
        💡 Laisse vide pour un programme corps complet
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v3.0 — Init maphilight sur image profil
  // ════════════════════════════════════════════════════════
  _initBodyMap(musclesCibles = []) {

    const CFG_COULEURS = {
      pectoraux:  { r:75,  g:75,  b:249 },
      deltoides:  { r:191, g:161, b:255 },
      biceps:     { r:139, g:240, b:187 },
      avantbras:  { r:139, g:240, b:187 },
      abdominaux: { r:249, g:239, b:119 },
      quadriceps: { r:34,  g:197, b:94  },
      trapeze:    { r:139, g:240, b:187 },
      dorsal:     { r:75,  g:75,  b:249 },
      lombaires:  { r:191, g:161, b:255 },
      fessiers:   { r:255, g:141, b:150 },
      ischio:     { r:249, g:239, b:119 },
      mollets:    { r:191, g:161, b:255 },
      triceps:    { r:255, g:141, b:150 }
    };

    const toHex = (r,g,b) =>
      [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');

    const img = document.getElementById('profil-body-img');
    if (!img) return;

    const doInit = () => {
      // imageMapResize pour responsive
      if (typeof imageMapResize !== 'undefined') {
        imageMapResize('#profil-image-map');
      }

      // Fallback sans maphilight — juste les clics
      if (typeof $ === 'undefined' || !$.fn?.maphilight) {
        // Bind clics simples
        document.querySelectorAll(
          '#profil-image-map area[data-muscle]'
        ).forEach(area => {
          area.addEventListener('click', e => {
            e.preventDefault();
            Profil._toggleMuscleModal(area.dataset.muscle);
          });
        });
        return;
      }

      // Avec maphilight
      $('#profil-body-img').maphilight({
        fillColor:   '4b4bf9',
        fillOpacity: 0.35,
        stroke:      true,
        strokeColor: '4b4bf9',
        strokeWidth: 2,
        fade:        true
      });

      $('#profil-image-map area[data-muscle]').each(function() {
        const m   = $(this).data('muscle');
        const cfg = CFG_COULEURS[m];
        if (!cfg) return;
        const hex  = toHex(cfg.r, cfg.g, cfg.b);
        const isOn = musclesCibles.includes(m);
        $(this).data('maphilight', {
          fillColor:   hex,
          fillOpacity: isOn ? 0.55 : 0.35,
          strokeColor: hex,
          strokeWidth: isOn ? 3 : 2,
          fade:        true,
          alwaysOn:    isOn
        });
      });

      $('#profil-body-img').maphilight('options', {});

      $('#profil-image-map area[data-muscle]')
        .off('click')
        .on('click', function(e) {
          e.preventDefault();
          Profil._toggleMuscleModal($(this).data('muscle'));
        });
    };

    if (img.complete && img.naturalWidth > 0) {
      doInit();
    } else {
      img.onload = doInit;
    }
  },

  // ════════════════════════════════════════════════════════
  // TOGGLE MUSCLE MODAL — ✅ v3.0 avec re-init maphilight
  // ════════════════════════════════════════════════════════
  _tmpData: {},

  _toggleMuscleModal(muscle) {
    if (!this._tmpData) this._tmpData = { ...this.get() };
    if (!this._tmpData.muscles_cibles) {
      this._tmpData.muscles_cibles = [];
    }

    const muscles = this._tmpData.muscles_cibles;
    const idx     = muscles.indexOf(muscle);
    if (idx === -1) muscles.push(muscle);
    else            muscles.splice(idx, 1);
    this._tmpData.muscles_cibles = muscles;

    // Re-render le conteneur SVG
    const container = document.getElementById('corps-svg-container');
    if (container) {
      container.innerHTML = this.renderCorpsSVG(muscles);
      // Re-init maphilight après re-render
      setTimeout(() => {
        this._initBodyMap(muscles);
      }, 100);
    }

    Utils.vibrer([20]);

    // Toast discret
    const cfg = this.MUSCLES[muscle];
    Utils.toast(
      idx === -1
        ? `✅ ${cfg?.label || muscle} ajouté`
        : `${cfg?.label || muscle} retiré`,
      'success', 700
    );
  },

  // ✅ Toggle depuis page profil (hors modal)
  _toggleMuscle(muscle) {
    const profil  = this.get();
    const muscles = [...(profil.muscles_cibles || [])];
    const idx     = muscles.indexOf(muscle);
    if (idx === -1) muscles.push(muscle);
    else            muscles.splice(idx, 1);
    this.set({ muscles_cibles: muscles });

    const wrapper = document.getElementById('corps-svg-wrapper');
    if (wrapper) {
      wrapper.innerHTML = this.renderCorpsSVG(muscles);
      setTimeout(() => this._initBodyMap(muscles), 100);
    }
    Utils.vibrer([20]);
  },

  _tmpSet(key, val) {
    if (!this._tmpData) this._tmpData = {};
    this._tmpData[key] = val;
  },

  // ════════════════════════════════════════════════════════
  // MODAL ÉDITION — ✅ v3.0 avec vrai corps anatomique
  // ════════════════════════════════════════════════════════
  _ouvrirEdition() {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const profil     = this.get();
    this._tmpData    = { ...profil };

    content.innerHTML = `
      <div style="padding:16px">

        <div style="font-size:1rem;font-weight:800;margin-bottom:16px">
          ✏️ Modifier mon profil
        </div>

        <!-- GENRE -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            👤 Genre
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
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
                      grid-template-columns:1fr 1fr 1fr;gap:8px">
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
                Poids (kg)</div>
              <input class="input" id="edit-poids" type="number"
                     placeholder="80" value="${profil.poids || ''}"/>
            </div>
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
                Taille (cm)</div>
              <input class="input" id="edit-taille" type="number"
                     placeholder="175" value="${profil.taille || ''}"/>
            </div>
            <div>
              <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
                Âge</div>
              <input class="input" id="edit-age" type="number"
                     placeholder="25" value="${profil.age || ''}"/>
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
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
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
                             border-radius:var(--radius-md);cursor:pointer">
                <div style="font-size:.78rem;font-weight:700;
                            color:var(--text-primary)">${obj.label}</div>
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
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
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
                             border-radius:var(--radius-md);cursor:pointer">
                <div style="font-size:.82rem;font-weight:700">${niv.label}</div>
                <div style="font-size:.58rem;color:var(--text-muted)">${niv.desc}</div>
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
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
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
                             border-radius:var(--radius-md);cursor:pointer">
                <div style="font-size:.85rem;margin-bottom:3px">
                  ${lieu.label.split(' ')[0]}</div>
                <div style="font-size:.7rem;font-weight:700">
                  ${lieu.label.split(' ').slice(1).join(' ')}</div>
                <div style="font-size:.55rem;color:var(--text-muted);margin-top:2px">
                  ${lieu.desc}</div>
              </button>`).join('')}
          </div>
        </div>

        <!-- ✅ NOUVEAU v3.0 — Corps anatomique réaliste -->
        <div style="margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:8px">
            🎯 Muscles à cibler
          </div>
          <div id="corps-svg-container"
               style="background:rgba(255,255,255,0.02);
                      border:1px solid rgba(255,255,255,0.07);
                      border-radius:var(--radius-lg);
                      padding:14px">
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

    // ✅ Init maphilight après render
    setTimeout(() => {
      this._initBodyMap(profil.muscles_cibles || []);
    }, 200);

    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  // ════════════════════════════════════════════════════════
  // SAUVEGARDER (v2.0 conservé)
  // ════════════════════════════════════════════════════════
  _sauvegarderEdition() {
    const nom    = document.getElementById('edit-nom')?.value?.trim();
    const poids  = parseFloat(document.getElementById('edit-poids')?.value);
    const taille = parseFloat(document.getElementById('edit-taille')?.value);
    const age    = parseInt(document.getElementById('edit-age')?.value);

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
      muscles_cibles: this._tmpData.muscles_cibles || []
    };

    this.set(miseAJour);

    document.getElementById('modal-info')?.classList.add('hidden');

    Utils.toast('✅ Profil mis à jour !', 'success');
    Utils.vibrerSuccess();

    // Re-render pages si actives
    const container = document.getElementById('page-mon_profil');
    if (container && window._pageActive === 'mon_profil') {
      this.renderPage(container);
    }

    const home = document.getElementById('page-home');
    if (home && window._pageActive === 'home') {
      try { _rendreHome(home); } catch(e) {}
    }

    // Appliquer planning
    try {
      Programme.appliquerPlanningGenre(
        miseAJour.genre || 'homme',
        miseAJour.lieu  || 'salle'
      );
    } catch(e) {}
  }
};

window.Profil = Profil;
console.log('✅ Profil.js v3.0 — Corps anatomique réaliste + maphilight + sync complet');
