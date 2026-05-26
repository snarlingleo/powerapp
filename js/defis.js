/* ============================================================
   PowerApp — Défis Hebdomadaires v4.0
   Défis auto + suivi + récompenses + photos + supersets
   + Défis femme Lower Body + Défis maison
   + Genre-aware generation
   ============================================================ */

const Defis = {

  BANQUE: [
    // ══ VOLUME ══
    { id:'vol_bench_100',  titre:'💪 100 reps Développé couché',
      description:'Cumule 100 répétitions de bench press cette semaine',
      categorie:'volume', exercice:'bench_press',
      type:'reps_cumul', cible:100, xp:300, emoji:'💪',
      difficulte:2, genre:['homme'] },
    { id:'vol_squat_80',   titre:'🦵 80 reps de Squat',
      description:'Cumule 80 répétitions de squat cette semaine',
      categorie:'volume', exercice:'squat',
      type:'reps_cumul', cible:80, xp:300, emoji:'🦵',
      difficulte:2, genre:['homme','femme'] },
    { id:'vol_total_5000', titre:'🏋️ 5 tonnes soulevées',
      description:'Cumule 5 000kg de volume total cette semaine',
      categorie:'volume', type:'volume_total',
      cible:5000, xp:400, emoji:'🏋️',
      difficulte:3, genre:['homme'] },
    { id:'vol_total_3000_femme', titre:'💪 3 tonnes soulevées',
      description:'Cumule 3 000kg de volume total cette semaine',
      categorie:'volume', type:'volume_total',
      cible:3000, xp:350, emoji:'💪',
      difficulte:3, genre:['femme'] },
    { id:'vol_total_8000', titre:'💥 8 tonnes soulevées',
      description:'Cumule 8 000kg de volume total cette semaine',
      categorie:'volume', type:'volume_total',
      cible:8000, xp:600, emoji:'💥',
      difficulte:4, genre:['homme'] },
    { id:'vol_traction_50',titre:'🔗 50 tractions',
      description:'Cumule 50 répétitions de tractions cette semaine',
      categorie:'volume', exercice:'tractions',
      type:'reps_cumul', cible:50, xp:350, emoji:'🔗',
      difficulte:3, genre:['homme'] },
    { id:'vol_curl_120',   titre:'💪 120 reps de Curl',
      description:'Cumule 120 répétitions de curl cette semaine',
      categorie:'volume', exercice:'curl_halteres',
      type:'reps_cumul', cible:120, xp:200, emoji:'💪',
      difficulte:1, genre:['homme','femme'] },
    { id:'vol_soulevé_60', titre:'🏋️ 60 reps Soulevé de terre',
      description:'Cumule 60 répétitions de soulevé de terre',
      categorie:'volume', exercice:'soulevé_terre',
      type:'reps_cumul', cible:60, xp:350, emoji:'🏋️',
      difficulte:3, genre:['homme'] },
    { id:'vol_total_3000', titre:'💪 3 tonnes soulevées',
      description:'Cumule 3 000kg de volume total cette semaine',
      categorie:'volume', type:'volume_total',
      cible:3000, xp:200, emoji:'💪',
      difficulte:1, genre:['homme'] },

    // ══ VOLUME FEMME ══
    { id:'vol_hip_thrust_80',  titre:'🍑 80 reps Hip Thrust',
      description:'Cumule 80 répétitions de hip thrust cette semaine',
      categorie:'volume', exercice:'hip_thrust_sol',
      type:'reps_cumul', cible:80, xp:300, emoji:'🍑',
      difficulte:2, genre:['femme'] },
    { id:'vol_squat_f_100',   titre:'🦵 100 reps Squat',
      description:'Cumule 100 répétitions de squat cette semaine',
      categorie:'volume', exercice:'squat_poids_corps',
      type:'reps_cumul', cible:100, xp:250, emoji:'🦵',
      difficulte:2, genre:['femme'] },
    { id:'vol_fentes_60',     titre:'🔥 60 fentes bulgares',
      description:'Cumule 60 répétitions de fentes bulgares',
      categorie:'volume', exercice:'fentes_bulgares',
      type:'reps_cumul', cible:60, xp:300, emoji:'🔥',
      difficulte:3, genre:['femme'] },
    { id:'vol_donkey_100',    titre:'🍑 100 donkey kicks',
      description:'Cumule 100 donkey kicks cette semaine',
      categorie:'volume', exercice:'donkey_kick',
      type:'reps_cumul', cible:100, xp:200, emoji:'🍑',
      difficulte:1, genre:['femme'] },
    { id:'vol_pompes_femme',  titre:'💪 50 pompes',
      description:'Cumule 50 pompes cette semaine',
      categorie:'volume', exercice:'pompes',
      type:'reps_cumul', cible:50, xp:250, emoji:'💪',
      difficulte:2, genre:['femme'] },

    // ══ SÉANCES ══
    { id:'seance_4_semaine',  titre:'📅 4 séances cette semaine',
      description:'Complète 4 séances dans la semaine',
      categorie:'assiduite', type:'seances_semaine',
      cible:4, xp:250, emoji:'📅',
      difficulte:2, genre:['homme','femme'] },
    { id:'seance_5_semaine',  titre:'🔥 5 séances cette semaine',
      description:'Complète 5 séances dans la semaine',
      categorie:'assiduite', type:'seances_semaine',
      cible:5, xp:400, emoji:'🔥',
      difficulte:3, genre:['homme','femme'] },
    { id:'seance_matin',      titre:'🌅 3 séances avant 10h',
      description:'Complète 3 séances avant 10h du matin',
      categorie:'assiduite', type:'seances_matin',
      cible:3, xp:300, emoji:'🌅',
      difficulte:3, genre:['homme','femme'] },
    { id:'seance_full_body',  titre:'🔄 2 séances Full Body',
      description:'Complète 2 séances Full Body cette semaine',
      categorie:'assiduite', type:'seance_type',
      seanceId:'full_body', cible:2, xp:250, emoji:'🔄',
      difficulte:2, genre:['homme','femme'] },
    { id:'seance_3_semaine',  titre:'📅 3 séances cette semaine',
      description:'Complète 3 séances dans la semaine',
      categorie:'assiduite', type:'seances_semaine',
      cible:3, xp:150, emoji:'📅',
      difficulte:1, genre:['homme','femme'] },
    { id:'seance_express_3',  titre:'⚡ 3 séances express',
      description:'Complète 3 séances express cette semaine',
      categorie:'assiduite', type:'seances_express',
      cible:3, xp:200, emoji:'⚡',
      difficulte:2, genre:['homme','femme'] },

    // ✅ NOUVEAU v4.0 — Séances femme spécifiques
    { id:'seance_lower_2',    titre:'🍑 2 séances Lower Body',
      description:'Complète 2 séances dédiées au bas du corps',
      categorie:'assiduite', type:'seances_lower',
      cible:2, xp:250, emoji:'🍑',
      difficulte:2, genre:['femme'] },
    { id:'seance_lower_3',    titre:'🍑 3 séances Lower Body',
      description:'Complète 3 séances dédiées au bas du corps',
      categorie:'assiduite', type:'seances_lower',
      cible:3, xp:400, emoji:'🍑',
      difficulte:3, genre:['femme'] },

    // ✅ NOUVEAU v4.0 — Défis maison
    { id:'maison_pompes_100',  titre:'🏠 100 pompes maison',
      description:'Cumule 100 pompes à la maison cette semaine',
      categorie:'maison', exercice:'pompes',
      type:'reps_cumul', cible:100, xp:200, emoji:'🏠',
      difficulte:2, genre:['homme','femme'], lieu:['maison'] },
    { id:'maison_seance_3',    titre:'🏠 3 séances maison',
      description:'Complète 3 séances à la maison cette semaine',
      categorie:'maison', type:'seances_maison',
      cible:3, xp:250, emoji:'🏠',
      difficulte:2, genre:['homme','femme'], lieu:['maison'] },
    { id:'maison_planche_5',   titre:'🏠 5 min de planche',
      description:'Cumule 5 minutes de gainage cette semaine',
      categorie:'maison', exercice:'planche',
      type:'reps_cumul', cible:300, xp:200, emoji:'🏠',
      difficulte:2, genre:['homme','femme'], lieu:['maison'] },
    { id:'dehors_seance_2',    titre:'🌳 2 séances dehors',
      description:'Complète 2 séances en extérieur cette semaine',
      categorie:'maison', type:'seances_dehors',
      cible:2, xp:200, emoji:'🌳',
      difficulte:2, genre:['homme','femme'], lieu:['dehors'] },

    // ══ FORCE / PR ══
    { id:'pr_bench',        titre:'🏆 Nouveau PR Développé couché',
      description:'Bats ton record sur le développé couché',
      categorie:'force', exercice:'bench_press',
      type:'nouveau_pr', cible:1, xp:500, emoji:'🏆',
      difficulte:4, genre:['homme'] },
    { id:'pr_squat',        titre:'🦵 Nouveau PR Squat',
      description:'Bats ton record sur le squat',
      categorie:'force', exercice:'squat',
      type:'nouveau_pr', cible:1, xp:500, emoji:'🦵',
      difficulte:4, genre:['homme','femme'] },
    { id:'pr_hip_thrust',   titre:'🍑 Nouveau PR Hip Thrust',
      description:'Bats ton record sur le hip thrust',
      categorie:'force', exercice:'hip_thrust_sol',
      type:'nouveau_pr', cible:1, xp:500, emoji:'🍑',
      difficulte:4, genre:['femme'] },
    { id:'pr_any_3',        titre:'🎯 3 nouveaux records',
      description:'Bats 3 records personnels cette semaine',
      categorie:'force', type:'prs_semaine',
      cible:3, xp:600, emoji:'🎯',
      difficulte:4, genre:['homme','femme'] },
    { id:'pr_any_1',        titre:'🏅 1 nouveau record',
      description:'Bats 1 record personnel cette semaine',
      categorie:'force', type:'prs_semaine',
      cible:1, xp:200, emoji:'🏅',
      difficulte:2, genre:['homme','femme'] },
    { id:'force_serie_lourde', titre:'💎 Série lourde (5 reps max)',
      description:'Fais une série de 5 reps ou moins',
      categorie:'force', type:'serie_lourde',
      cible:1, xp:200, emoji:'💎',
      difficulte:3, genre:['homme'] },
    { id:'force_pr_deadlift', titre:'🏋️ Nouveau PR Soulevé de terre',
      description:'Bats ton record sur le soulevé de terre',
      categorie:'force', exercice:'soulevé_terre',
      type:'nouveau_pr', cible:1, xp:500, emoji:'🏋️',
      difficulte:4, genre:['homme'] },

    // ══ RÉGULARITÉ ══
    { id:'streak_7',    titre:'🔥 Streak 7 jours',
      description:'Maintiens un streak de 7 jours consécutifs',
      categorie:'regularite', type:'streak',
      cible:7, xp:500, emoji:'🔥',
      difficulte:4, genre:['homme','femme'] },
    { id:'streak_5',    titre:'⚡ Streak 5 jours',
      description:'Maintiens un streak de 5 jours consécutifs',
      categorie:'regularite', type:'streak',
      cible:5, xp:300, emoji:'⚡',
      difficulte:3, genre:['homme','femme'] },
    { id:'streak_3',    titre:'🔥 Streak 3 jours',
      description:'Maintiens un streak de 3 jours consécutifs',
      categorie:'regularite', type:'streak',
      cible:3, xp:150, emoji:'🔥',
      difficulte:1, genre:['homme','femme'] },
    { id:'pas_absence', titre:'✅ Zéro absence cette semaine',
      description:'Ne manque aucune séance planifiée cette semaine',
      categorie:'regularite', type:'zero_absence',
      cible:1, xp:400, emoji:'✅',
      difficulte:3, genre:['homme','femme'] },

    // ══ BIEN-ÊTRE ══
    { id:'journal_3',       titre:'📔 3 entrées journal',
      description:'Écris 3 entrées dans ton journal cette semaine',
      categorie:'bienetre', type:'journal_semaine',
      cible:3, xp:150, emoji:'📔',
      difficulte:1, genre:['homme','femme'] },
    { id:'journal_1',       titre:'📔 1 entrée journal',
      description:'Écris 1 entrée dans ton journal',
      categorie:'bienetre', type:'journal_semaine',
      cible:1, xp:75, emoji:'📔',
      difficulte:1, genre:['homme','femme'] },
    { id:'mesure_semaine',  titre:'⚖️ Prendre ses mesures',
      description:'Enregistre tes mesures corporelles cette semaine',
      categorie:'bienetre', type:'mesure_semaine',
      cible:1, xp:100, emoji:'⚖️',
      difficulte:1, genre:['homme','femme'] },
    { id:'rpe_controle',    titre:'🎯 RPE maîtrisé',
      description:'Maintiens un RPE entre 7 et 8.5 sur toutes tes séances',
      categorie:'bienetre', type:'rpe_controle',
      cible:1, xp:200, emoji:'🎯',
      difficulte:2, genre:['homme','femme'] },
    { id:'photo_progression',titre:'📸 Photo de progression',
      description:'Ajoute une photo de progression cette semaine',
      categorie:'bienetre', type:'photo_semaine',
      cible:1, xp:150, emoji:'📸',
      difficulte:1, genre:['homme','femme'] },
    { id:'humeur_5j',       titre:'😊 Humeur 5 jours',
      description:'Renseigne ton humeur 5 jours cette semaine',
      categorie:'bienetre', type:'humeur_semaine',
      cible:5, xp:100, emoji:'😊',
      difficulte:1, genre:['homme','femme'] },

    // ══ CARDIO ══
    { id:'cardio_3',       titre:'🚴 3 sessions cardio',
      description:'Fais 3 sessions de cardio cette semaine',
      categorie:'cardio', type:'cardio_semaine',
      cible:3, xp:200, emoji:'🚴',
      difficulte:2, genre:['homme','femme'] },
    { id:'cardio_1',       titre:'🚴 1 session cardio',
      description:'Fais 1 session de cardio cette semaine',
      categorie:'cardio', type:'cardio_semaine',
      cible:1, xp:75, emoji:'🚴',
      difficulte:1, genre:['homme','femme'] },
    { id:'rameur_15min',   titre:'🚣 15 min de rameur',
      description:'Fais au moins 15 min de rameur en une session',
      categorie:'cardio', exercice:'rameur',
      type:'cardio_semaine', cible:1,
      xp:150, emoji:'🚣',
      difficulte:2, genre:['homme','femme'] },

    // ══ SUPERSETS ══
    { id:'superset_3', titre:'⚡ 3 supersets cette semaine',
      description:'Complète 3 supersets dans tes séances',
      categorie:'avance', type:'supersets_semaine',
      cible:3, xp:250, emoji:'⚡',
      difficulte:2, genre:['homme','femme'] },
    { id:'superset_5', titre:'⚡ 5 supersets cette semaine',
      description:'Complète 5 supersets dans tes séances',
      categorie:'avance', type:'supersets_semaine',
      cible:5, xp:400, emoji:'⚡',
      difficulte:3, genre:['homme','femme'] },

    // ══ DÉFIS SPÉCIAUX ══
    { id:'defi_100_series',    titre:'💯 100 séries cette semaine',
      description:'Cumule 100 séries au total cette semaine',
      categorie:'avance', type:'series_total',
      cible:100, xp:500, emoji:'💯',
      difficulte:4, genre:['homme'] },
    { id:'defi_seance_longue', titre:'⏱️ Séance de 90 minutes',
      description:'Complète une séance de 90 minutes ou plus',
      categorie:'avance', type:'seance_longue',
      cible:90 * 60, xp:300, emoji:'⏱️',
      difficulte:3, genre:['homme','femme'] }
  ],

  // ════════════════════════════════════════════════════════
  // HELPERS PROFIL
  // ════════════════════════════════════════════════════════
  _getGenre() {
    try {
      return Utils.storage.get(
        'ft_profil_onboarding', {}
      ).genre || 'homme';
    } catch(e) { return 'homme'; }
  },

  _getLieu() {
    try {
      return Utils.storage.get(
        'ft_profil_onboarding', {}
      ).lieu || 'salle';
    } catch(e) { return 'salle'; }
  },

  // ════════════════════════════════════════════════════════
  // GÉNÉRATION DÉFIS — ✅ v4.0 genre + lieu aware
  // ════════════════════════════════════════════════════════
  genererDefis(forceRegen = false) {
    const semaine  = Utils.debutSemaine(Utils.aujourd_hui());
    const cleCache = `ft_defis_${semaine}`;
    const cached   = Utils.storage.get(cleCache, null);

    if (cached && !forceRegen) return cached;

    let seances = 0;
    try { seances = Tracker.getTotalSeances(); } catch(e) {}

    const niveauMax =
      seances < 5  ? 1 :
      seances < 20 ? 2 :
      seances < 50 ? 3 : 4;

    const genre = this._getGenre();
    const lieu  = this._getLieu();

    // ✅ NOUVEAU v4.0 — Filtrer selon genre + lieu + difficulté
    const disponibles = this.BANQUE.filter(d => {
      // Filtre difficulté
      if (d.difficulte > niveauMax + 1) return false;
      // Filtre genre
      if (d.genre && !d.genre.includes(genre)) return false;
      // Filtre lieu (si lieu spécifié dans le défi)
      if (d.lieu && !d.lieu.includes(lieu)) return false;
      return true;
    });

    // ✅ NOUVEAU v4.0 — Catégories adaptées selon genre
    let categories = ['volume','assiduite','force','regularite','bienetre'];

    if (genre === 'femme') {
      // Remplacer 'force' par mix force+lower
      categories = [
        'volume','assiduite','force','regularite','bienetre'
      ];
    }
    if (lieu === 'maison' || lieu === 'dehors') {
      // Ajouter catégorie maison
      categories.push('maison');
    }

    const selectionnes = [];

    const graine = new Date(semaine + 'T00:00:00').getTime();
    const seed   = isNaN(graine)
      ? Math.floor(Date.now() / (1000 * 60 * 60 * 24))
      : Math.floor(graine / (1000 * 60 * 60 * 24));

    categories.forEach((cat, ci) => {
      const dispo = disponibles.filter(
        d => d.categorie === cat
          && !selectionnes.find(s => s.id === d.id)
      );
      if (!dispo.length) return;
      const idx = (seed + ci * 7) % dispo.length;
      selectionnes.push(dispo[idx] || dispo[0]);
    });

    if (niveauMax >= 3) {
      const avance = disponibles.filter(
        d => d.categorie === 'avance'
          && !selectionnes.find(s => s.id === d.id)
      );
      if (avance.length) {
        const idx = (seed + 31) % avance.length;
        selectionnes.push(avance[idx] || avance[0]);
      }
    }

    const defisAvecProgression = selectionnes.map(d => ({
      ...d, progression:0, complete:false, semaine
    }));

    Utils.storage.set(cleCache, defisAvecProgression);
    return defisAvecProgression;
  },

  // ════════════════════════════════════════════════════════
  // MISE À JOUR PROGRESSION
  // ════════════════════════════════════════════════════════
  mettreAJourProgression() {
    const semaine  = Utils.debutSemaine(Utils.aujourd_hui());
    const cleCache = `ft_defis_${semaine}`;
    const defis    = Utils.storage.get(cleCache, null);
    if (!defis) return this.genererDefis();

    let seances = 0, volumeSem = 0;
    let streak  = { count:0 }, journal = [];
    let mesures = [], prs = {}, photos = [];

    try { seances   = Tracker.getSeancesParSemaine();  } catch(e) {}
    try { volumeSem = Tracker.getVolumeSemaine();      } catch(e) {}
    try { streak    = Tracker.getStreak();             } catch(e) {}
    try { journal   = Tracker.getJournal();            } catch(e) {}
    try { mesures   = Tracker.getMesures();            } catch(e) {}
    try { prs       = Tracker.getAllPRs();             } catch(e) {}
    try { photos    = Tracker.getPhotos?.() || [];     } catch(e) {}

    const prsSemaine = Object.values(prs)
      .filter(pr => (pr.date||'') >= semaine).length;

    const mis_a_jour = defis.map(defi => {
      if (defi.complete) return defi;

      let progression = 0;

      try {
        switch(defi.type) {

          case 'seances_semaine':
            progression = seances;
            break;

          case 'volume_total':
            progression = volumeSem;
            break;

          case 'streak':
            progression = streak.count;
            break;

          case 'prs_semaine':
            progression = prsSemaine;
            break;

          case 'nouveau_pr': {
            const pr = prs[defi.exercice];
            progression = (pr?.date||'') >= semaine ? 1 : 0;
            break;
          }

          case 'journal_semaine':
            progression = journal.filter(
              e => (e.date||'') >= semaine
            ).length;
            break;

          case 'mesure_semaine':
            progression = mesures.filter(
              m => (m.date||'') >= semaine
            ).length;
            break;

          case 'reps_cumul':
            progression = this._calculerRepsCumul(
              defi.exercice, semaine
            );
            break;

          case 'zero_absence':
            progression = this._verifierZeroAbsence(semaine)
              ? 1 : 0;
            break;

          case 'seances_matin':
            progression = this._compterSeancesMatin(semaine);
            break;

          case 'rpe_controle':
            progression = this._verifierRPEControle(semaine)
              ? 1 : 0;
            break;

          case 'seance_type':
            progression = this._compterSeanceType(
              defi.seanceId, semaine
            );
            break;

          case 'serie_lourde':
            progression = this._verifierSerieLourde(semaine)
              ? 1 : 0;
            break;

          case 'cardio_semaine':
          case 'cardio_duree':
            progression = this._compterCardio(semaine);
            break;

          case 'photo_semaine':
            progression = photos.filter(
              p => (p.date||'') >= semaine
            ).length;
            break;

          case 'humeur_semaine':
            progression = this._compterHumeurs(semaine);
            break;

          case 'supersets_semaine':
            progression = this._compterSupersets(semaine);
            break;

          case 'series_total':
            progression = this._compterSeriesTotales(semaine);
            break;

          case 'seance_longue':
            progression = this._verifierSeanceLongue(semaine)
              ? defi.cible : 0;
            break;

          case 'seances_express':
            progression = this._compterSeancesExpress(semaine);
            break;

          // ✅ NOUVEAU v4.0 — Séances Lower Body (femme)
          case 'seances_lower':
            progression = this._compterSeancesLower(semaine);
            break;

          // ✅ NOUVEAU v4.0 — Séances maison / dehors
          case 'seances_maison':
            progression = this._compterSeancesLieu(
              semaine, 'maison'
            );
            break;

          case 'seances_dehors':
            progression = this._compterSeancesLieu(
              semaine, 'dehors'
            );
            break;

          default:
            progression = defi.progression || 0;
        }
      } catch(e) {
        progression = defi.progression || 0;
      }

      const complete = progression >= defi.cible;

      if (complete && !defi.complete) {
        this._recompenser(defi);
      }

      return {
        ...defi,
        progression: Math.min(progression, defi.cible),
        complete
      };
    });

    Utils.storage.set(cleCache, mis_a_jour);
    return mis_a_jour;
  },

  // ════════════════════════════════════════════════════════
  // HELPERS CALCUL
  // ════════════════════════════════════════════════════════
  _calculerRepsCumul(exerciceRef, semaine) {
    try {
      const hist = Tracker.getHistoriqueExercice(exerciceRef, 200);
      return hist
        .filter(h => (h.date||'') >= semaine)
        .reduce((acc, h) => acc + (h.reps||0), 0);
    } catch(e) { return 0; }
  },

  _verifierZeroAbsence(semaine) {
    try {
      const planning = window.PLANNING_SEMAINE || [];
      for (let i = 0; i < 7; i++) {
        const date = Utils.ajouterJours(semaine, i);
        if (date > Utils.aujourd_hui()) break;
        const p = planning[i];
        if (!p?.seanceId) continue;
        const s = Tracker.getSeanceDuJour(date);
        if (!s?.complete) return false;
      }
      return true;
    } catch(e) { return false; }
  },

  _compterSeancesMatin(semaine) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete || !data?.date) continue;
          if (data.date < semaine) continue;
          if (!data.debut) continue;
          const heure = new Date(data.debut).getHours();
          if (heure < 10) count++;
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  _verifierRPEControle(semaine) {
    try {
      const seances = Tracker.getHistoriqueSeances(10);
      const sem = seances.filter(
        s => (s.date||'') >= semaine && s.rpesMoyen
      );
      if (!sem.length) return false;
      return sem.every(
        s => s.rpesMoyen >= 7 && s.rpesMoyen <= 8.5
      );
    } catch(e) { return false; }
  },

  _compterSeanceType(seanceId, semaine) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (data?.complete
              && data?.id === seanceId
              && (data?.date||'') >= semaine) count++;
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  _verifierSerieLourde(semaine) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete) continue;
          if ((data?.date||'') < semaine) continue;
          const lourde = (data.series||[]).find(
            s => (s.reps||0) <= 5 && (s.poids||0) > 0
          );
          if (lourde) return true;
        } catch(e) {}
      }
    } catch(e) {}
    return false;
  },

  _compterCardio(semaine) {
    const cardioIds = ['rameur','velo'];
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete) continue;
          if ((data?.date||'') < semaine) continue;
          const hasCardio = (data.series||[]).some(
            s => cardioIds.includes(s.exerciceRef)
          );
          if (hasCardio) count++;
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  _compterHumeurs(semaine) {
    let count = 0;
    try {
      for (let i = 0; i < 7; i++) {
        const date   = Utils.ajouterJours(semaine, i);
        if (date > Utils.aujourd_hui()) break;
        const humeur = Tracker.getHumeur(date);
        if (humeur?.humeur) count++;
      }
    } catch(e) {}
    return count;
  },

  // ✅ FIX v4.0 — _compterSupersets corrigé
  // seriesCompletes est un nombre, pas un array
  _compterSupersets(semaine) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_superset_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          // ✅ FIX — seriesCompletes est un nombre
          if ((data?.date||'') >= semaine
              && (data?.seriesCompletes || 0) > 0) {
            count++;
          }
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  _compterSeriesTotales(semaine) {
    let total = 0;
    try {
      const seances = Tracker.getHistoriqueSeances(20);
      seances.filter(s => (s.date||'') >= semaine)
        .forEach(s => { total += (s.series||[]).length; });
    } catch(e) {}
    return total;
  },

  _verifierSeanceLongue(semaine) {
    try {
      const seances = Tracker.getHistoriqueSeances(20);
      return seances.some(
        s => (s.date||'') >= semaine && (s.duree||0) >= 90 * 60
      );
    } catch(e) { return false; }
  },

  _compterSeancesExpress(semaine) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete) continue;
          if ((data?.date||'') < semaine) continue;
          if (data?.id?.includes('express')
              || data?.id === 'full_body') count++;
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  // ✅ NOUVEAU v4.0 — Compter séances Lower Body (femme)
  _compterSeancesLower(semaine) {
    let count = 0;
    const lowerIds = [
      'lower','fessier','jambes','legs','glutes','lower_body'
    ];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete) continue;
          if ((data?.date||'') < semaine) continue;
          const id = data?.id?.toLowerCase() || '';
          if (lowerIds.some(k => id.includes(k))) count++;
        } catch(e) {}
      }
      // Fallback : chercher dans Tracker
      const hist = Tracker.getHistoriqueSeances(20);
      hist.filter(s => (s.date||'') >= semaine)
        .forEach(s => {
          const id = (s.id||'').toLowerCase();
          if (lowerIds.some(k => id.includes(k))) count++;
        });
    } catch(e) {}
    return count;
  },

  // ✅ NOUVEAU v4.0 — Compter séances par lieu
  _compterSeancesLieu(semaine, lieu) {
    let count = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_')) continue;
        try {
          const data = JSON.parse(localStorage.getItem(cle));
          if (!data?.complete) continue;
          if ((data?.date||'') < semaine) continue;
          // Vérifier par lieu ou par id
          if (data?.lieu === lieu
              || data?.id?.includes(lieu)) count++;
        } catch(e) {}
      }
    } catch(e) {}
    return count;
  },

  // ════════════════════════════════════════════════════════
  // RÉCOMPENSES
  // ════════════════════════════════════════════════════════
  _recompenser(defi) {
    setTimeout(() => {
      try { timerRepos.jouerSon('pr'); } catch(e) {}
      try { Utils.confetti(3000);      } catch(e) {}
      try { Utils.vibrerPR();          } catch(e) {}

      Utils.toast(
        `🏆 Défi accompli : ${defi.emoji} ${defi.titre} ! +${defi.xp} XP`,
        'pr', 6000
      );

      try {
        Gamification.ajouterXP(defi.xp, `Défi : ${defi.titre}`);
      } catch(e) {}

      Utils.storage.set(
        `ft_defi_done_${defi.id}`,
        Utils.aujourd_hui()
      );
    }, 500);
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE + STATS
  // ════════════════════════════════════════════════════════
  getHistoriqueDefis(nbSemaines = 4) {
    const historique = [];
    for (let i = 0; i < nbSemaines; i++) {
      const date  = Utils.ajouterJours(Utils.aujourd_hui(), -i * 7);
      const sem   = Utils.debutSemaine(date);
      const defis = Utils.storage.get(`ft_defis_${sem}`, null);
      if (defis) {
        const completes = defis.filter(d => d.complete).length;
        historique.push({
          semaine:  sem,
          label:    Utils.formatDateCourt(sem),
          defis,
          completes,
          total:    defis.length,
          xpGagne:  defis.filter(d => d.complete)
            .reduce((a,d) => a + d.xp, 0)
        });
      }
    }
    return historique;
  },

  getStatsDefis() {
    const historique        = this.getHistoriqueDefis(12);
    const total             = historique.reduce((a,s) => a+s.total, 0);
    const completes         = historique.reduce(
      (a,s) => a+s.completes, 0
    );
    const xpTotal           = historique.reduce(
      (a,s) => a+s.xpGagne, 0
    );
    const semainesParfaites = historique.filter(
      s => s.completes === s.total && s.total > 0
    ).length;

    return {
      total, completes, xpTotal,
      tauxReussite: total > 0
        ? Math.round((completes/total)*100) : 0,
      semainesParfaites
    };
  },

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const genre  = this._getGenre();
    const lieu   = this._getLieu();

    let defis = [];
    try {
      defis = this.mettreAJourProgression()
        || this.genererDefis();
    } catch(e) {
      defis = this.genererDefis();
    }

    const historique = this.getHistoriqueDefis(4);
    const stats      = this.getStatsDefis();
    const completes  = defis.filter(d => d.complete).length;
    const semaine    = Utils.debutSemaine(Utils.aujourd_hui());
    const finSemaine = Utils.finSemaine(Utils.aujourd_hui());

    const xpGagne = defis.filter(d => d.complete)
      .reduce((a,d) => a + d.xp, 0);
    const xpTotal = defis.reduce((a,d) => a + d.xp, 0);
    const pctGlob = Math.round(
      (completes / Math.max(defis.length,1)) * 100
    );

    container.innerHTML = `

      <!-- Header semaine -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(249,239,119,0.15),
                  rgba(75,75,249,0.15));
                  border-color:var(--fd-lemon)">
        <div class="flex justify-between items-center">
          <div>
            <div class="card-label" style="color:var(--fd-lemon)">
              🏆 Défis de la semaine
              ${genre === 'femme' ? '🌸' : ''}
              ${lieu === 'maison' ? '🏠' : lieu === 'dehors' ? '🌳' : ''}
            </div>
            <div style="font-size:.78rem;color:var(--text-muted);
                        margin-top:2px">
              ${Utils.formatDateCourt(semaine)}
              → ${Utils.formatDateCourt(finSemaine)}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.8rem;font-weight:800;
                        color:var(--fd-lemon)">
              ${completes}/${defis.length}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              complétés
            </div>
          </div>
        </div>

        <div style="margin-top:var(--space-md)">
          <div class="progress-bar">
            <div class="progress-fill"
                 style="width:${pctGlob}%;
                        background:var(--fd-lemon)">
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;
                    margin-top:var(--space-sm);font-size:.72rem">
          <span style="color:var(--text-muted)">XP cette semaine</span>
          <span style="color:var(--fd-lemon);font-weight:700">
            +${xpGagne} / ${xpTotal} XP
          </span>
        </div>
      </div>

      <!-- Stats globales -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${stats.completes}
          </span>
          <span class="stat-label">Total réussis</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-indigo)">
            ${stats.tauxReussite}%
          </span>
          <span class="stat-label">Taux réussite</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${stats.xpTotal}
          </span>
          <span class="stat-label">XP gagnés</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lavender)">
            ${stats.semainesParfaites}
          </span>
          <span class="stat-label">Sem. parfaites</span>
        </div>
      </div>

      <!-- Défis actifs -->
      <div class="section-title">⚡ Défis en cours</div>

      ${defis.map(defi => {
        const pct = Math.round(
          (defi.progression / Math.max(defi.cible,1)) * 100
        );
        const couleur =
          defi.complete ? 'var(--fd-mint)'   :
          pct >= 75     ? 'var(--fd-lemon)'  :
          pct >= 40     ? 'var(--fd-indigo)' :
                          'var(--fd-lavender)';

        return `
          <div class="card mb-md"
               style="${defi.complete
                 ? 'border-color:var(--fd-mint);'
                   + 'background:rgba(139,240,187,0.05);'
                 : ''}">
            <div class="flex items-center gap-md">
              <div style="width:48px;height:48px;
                          border-radius:50%;
                          background:${defi.complete
                            ? 'var(--fd-mint)'
                            : 'var(--bg-input)'};
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:1.4rem;flex-shrink:0">
                ${defi.complete ? '✅' : defi.emoji}
              </div>

              <div style="flex:1;min-width:0">
                <div style="font-weight:700;font-size:.92rem;
                            color:${defi.complete
                              ? 'var(--fd-mint)'
                              : 'var(--text-primary)'}">
                  ${defi.titre}
                </div>
                <div style="font-size:.70rem;
                            color:var(--text-muted);
                            margin-top:2px;line-height:1.4">
                  ${defi.description}
                </div>

                <div style="margin-top:var(--space-sm)">
                  <div style="display:flex;
                              justify-content:space-between;
                              font-size:.68rem;margin-bottom:4px">
                    <span style="color:${couleur};font-weight:600">
                      ${defi.progression} / ${defi.cible}
                      ${defi.type === 'volume_total' ? 'kg' : ''}
                    </span>
                    <span style="color:var(--fd-lemon);
                                 font-weight:700">
                      +${defi.xp} XP
                    </span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill"
                         style="width:${pct}%;
                                background:${couleur};
                                transition:width .5s ease">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            ${defi.complete ? `
              <div style="margin-top:var(--space-sm);
                          text-align:center;font-size:.75rem;
                          color:var(--fd-mint);font-weight:600;
                          padding:var(--space-xs);
                          background:rgba(139,240,187,0.08);
                          border-radius:var(--radius-sm)">
                🎉 Défi accompli !
                ${Utils.storage.get(`ft_defi_done_${defi.id}`)
                  ? `· ${Utils.formatDateCourt(
                      Utils.storage.get(`ft_defi_done_${defi.id}`)
                    )}`
                  : ''}
              </div>` : ''}
          </div>`;
      }).join('')}

      <!-- Actions -->
      <div class="flex gap-sm mb-md">
        <button onclick="Defis._confirmerRegen()"
                class="btn-secondary"
                style="flex:1;font-size:.82rem">
          🔄 Nouveaux défis
        </button>
        <button onclick="Defis._forceCheck()"
                class="btn-secondary"
                style="flex:1;font-size:.82rem">
          🔃 Actualiser
        </button>
      </div>

      <!-- Historique -->
      ${historique.length > 1 ? `
        <div class="section-title">📊 Historique défis</div>
        ${historique.slice(1).map(sem => `
          <div class="card mb-md">
            <div class="flex justify-between items-center">
              <div>
                <div style="font-weight:600;font-size:.88rem">
                  Semaine du ${sem.label}
                </div>
                <div style="font-size:.72rem;color:var(--text-muted);
                            margin-top:2px">
                  ${sem.completes}/${sem.total} défis
                  · +${sem.xpGagne} XP
                </div>
              </div>
              <div style="font-size:1.5rem">
                ${sem.completes === sem.total ? '🏆' :
                  sem.completes >= sem.total/2 ? '⭐' : '📊'}
              </div>
            </div>
            <div style="margin-top:var(--space-sm)">
              <div class="progress-bar">
                <div class="progress-fill"
                     style="width:${Math.round(
                       (sem.completes / Math.max(sem.total,1)) * 100
                     )}%;background:var(--fd-lavender)">
                </div>
              </div>
            </div>
          </div>`).join('')}` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS UI
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-defis')
      || document.getElementById('stats-content')
      || document.getElementById('page-content');
  },

  async _confirmerRegen() {
    const ok = await Utils.confirmer(
      'Nouveaux défis ?',
      'Ça va réinitialiser les défis de la semaine.'
    );
    if (!ok) return;

    try { this.genererDefis(true); } catch(e) {}

    const el = this._getContainer();
    if (el) this.render(el);
    Utils.toast('🔄 Nouveaux défis générés !', 'success');
  },

  _forceCheck() {
    let defis = [];
    try { defis = this.mettreAJourProgression() || []; } catch(e) {}

    const el = this._getContainer();
    if (el) this.render(el);

    const nb = defis.filter(d => d.complete).length;
    Utils.toast(
      `🔃 Mis à jour — ${nb} défi${nb>1?'s':''} complété${nb>1?'s':''}`,
      'success', 2000
    );
  }
};

window.Defis = Defis;
console.log('✅ Defis v4.0 chargé — Femme + Maison + Genre-aware + Fix supersets');
