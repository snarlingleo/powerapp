/* ============================================================
   PowerApp — Gamification v5.0
   XP + Niveaux + Trophées + Badges
   + Fix filtre onclick + getProchainTrophee() smart
   + Fix hip_thrust_sol + nutrition_streak_14
   ============================================================ */

const Gamification = {

  NIVEAUX: [
    { numero:1, nom:'Débutant',  emoji:'🌱', xpMin:0,     xpSuivant:500   },
    { numero:2, nom:'Apprenti',  emoji:'💪', xpMin:500,   xpSuivant:1200  },
    { numero:3, nom:'Confirmé',  emoji:'🏃', xpMin:1200,  xpSuivant:2500  },
    { numero:4, nom:'Athlète',   emoji:'⚡', xpMin:2500,  xpSuivant:5000  },
    { numero:5, nom:'Expert',    emoji:'🔥', xpMin:5000,  xpSuivant:10000 },
    { numero:6, nom:'Élite',     emoji:'💎', xpMin:10000, xpSuivant:20000 },
    { numero:7, nom:'Légende',   emoji:'👑', xpMin:20000, xpSuivant:50000 },
    { numero:8, nom:'Immortel',  emoji:'⭐', xpMin:50000, xpSuivant:99999 }
  ],

  TROPHEES_DEF: [
    // ── Premiers pas ──────────────────────────────────────
    { id:'first_session', nom:'Première séance',
      emoji:'🎯', xp:100, categorie:'debut', rare:false,
      description:'Terminer sa première séance',
      condition: d => d.totalSeances >= 1 },
    { id:'first_pr', nom:'Premier record',
      emoji:'🏆', xp:150, categorie:'debut', rare:false,
      description:'Battre un premier PR',
      condition: d => d.totalPRs >= 1 },
    { id:'first_week', nom:'Première semaine',
      emoji:'📅', xp:200, categorie:'debut', rare:false,
      description:'Compléter 4 séances en une semaine',
      condition: d => d.seancesParSemaine >= 4 },
    { id:'first_journal', nom:'Premiers mots',
      emoji:'📔', xp:75, categorie:'debut', rare:false,
      description:'Écrire dans le journal',
      condition: d => d.totalJournal >= 1 },
    { id:'first_photo', nom:'Première photo',
      emoji:'📸', xp:100, categorie:'debut', rare:false,
      description:'Ajouter une photo de progression',
      condition: d => d.totalPhotos >= 1 },

    // ── Streak ────────────────────────────────────────────
    { id:'streak_3', nom:'3 jours d\'affilée',
      emoji:'🔥', xp:100, categorie:'streak', rare:false,
      description:'Streak de 3 jours',
      condition: d => d.streak >= 3 },
    { id:'streak_7', nom:'Une semaine pleine',
      emoji:'🔥', xp:200, categorie:'streak', rare:false,
      description:'Streak de 7 jours',
      condition: d => d.streak >= 7 },
    { id:'streak_14', nom:'2 semaines non-stop',
      emoji:'🔥', xp:350, categorie:'streak', rare:false,
      description:'Streak de 14 jours',
      condition: d => d.streak >= 14 },
    { id:'streak_30', nom:'Mois de fer',
      emoji:'💎', xp:600, categorie:'streak', rare:false,
      description:'Streak de 30 jours',
      condition: d => d.streak >= 30 },
    { id:'streak_60', nom:'Machine de guerre',
      emoji:'⚡', xp:1000, categorie:'streak', rare:true,
      description:'Streak de 60 jours',
      condition: d => d.streak >= 60 },
    { id:'streak_100', nom:'Centurion du fitness',
      emoji:'👑', xp:2000, categorie:'streak', rare:true,
      description:'Streak de 100 jours',
      condition: d => d.streak >= 100 },

    // ── Séances ───────────────────────────────────────────
    { id:'sessions_5',   nom:'5 séances',
      emoji:'💪', xp:100, categorie:'seances', rare:false,
      description:'5 séances totales',
      condition: d => d.totalSeances >= 5 },
    { id:'sessions_10',  nom:'10 séances',
      emoji:'💪', xp:150, categorie:'seances', rare:false,
      description:'10 séances totales',
      condition: d => d.totalSeances >= 10 },
    { id:'sessions_25',  nom:'25 séances',
      emoji:'🏋️', xp:300, categorie:'seances', rare:false,
      description:'25 séances totales',
      condition: d => d.totalSeances >= 25 },
    { id:'sessions_50',  nom:'50 séances',
      emoji:'🎖️', xp:500, categorie:'seances', rare:false,
      description:'50 séances totales',
      condition: d => d.totalSeances >= 50 },
    { id:'sessions_100', nom:'Centurion',
      emoji:'💯', xp:1000, categorie:'seances', rare:true,
      description:'100 séances totales',
      condition: d => d.totalSeances >= 100 },
    { id:'sessions_200', nom:'Légende vivante',
      emoji:'👑', xp:2000, categorie:'seances', rare:true,
      description:'200 séances totales',
      condition: d => d.totalSeances >= 200 },
    { id:'sessions_500', nom:'Immortel',
      emoji:'⭐', xp:5000, categorie:'seances', rare:true,
      description:'500 séances totales',
      condition: d => d.totalSeances >= 500 },

    // ── PRs ───────────────────────────────────────────────
    { id:'prs_3',  nom:'Premiers records',
      emoji:'🏅', xp:150, categorie:'prs', rare:false,
      description:'3 records personnels',
      condition: d => d.totalPRs >= 3 },
    { id:'prs_5',  nom:'Collectionneur',
      emoji:'🏅', xp:200, categorie:'prs', rare:false,
      description:'5 records personnels',
      condition: d => d.totalPRs >= 5 },
    { id:'prs_10', nom:'Record Man',
      emoji:'🎯', xp:400, categorie:'prs', rare:false,
      description:'10 records personnels',
      condition: d => d.totalPRs >= 10 },
    { id:'prs_20', nom:'Maître des records',
      emoji:'👑', xp:800, categorie:'prs', rare:true,
      description:'20 records personnels',
      condition: d => d.totalPRs >= 20 },

    // ── Force ─────────────────────────────────────────────
    { id:'bench_80',      nom:'Pecto de feu',
      emoji:'🔥', xp:300, categorie:'force', rare:false,
      description:'Développé couché 80kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 80 },
    { id:'bench_100',     nom:'Club des 100',
      emoji:'💎', xp:600, categorie:'force', rare:false,
      description:'Développé couché 100kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 100 },
    { id:'bench_120',     nom:'Pectoraux d\'élite',
      emoji:'💥', xp:1000, categorie:'force', rare:true,
      description:'Développé couché 120kg',
      condition: d => (d.prs['bench_press']?.poids||0) >= 120 },
    { id:'squat_100',     nom:'Jambes d\'acier',
      emoji:'🦵', xp:600, categorie:'force', rare:false,
      description:'Squat 100kg',
      condition: d => (d.prs['squat']?.poids||0) >= 100 },
    { id:'squat_140',     nom:'Squat King',
      emoji:'👑', xp:1000, categorie:'force', rare:true,
      description:'Squat 140kg',
      condition: d => (d.prs['squat']?.poids||0) >= 140 },
    { id:'deadlift_100',  nom:'Terre ferme',
      emoji:'🏋️', xp:600, categorie:'force', rare:false,
      description:'Soulevé de terre 100kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 100 },
    { id:'deadlift_140',  nom:'Force brute',
      emoji:'💥', xp:1000, categorie:'force', rare:true,
      description:'Soulevé de terre 140kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 140 },
    { id:'deadlift_180',  nom:'Titan',
      emoji:'⭐', xp:2000, categorie:'force', rare:true,
      description:'Soulevé de terre 180kg',
      condition: d => (d.prs['soulevé_terre']?.poids||0) >= 180 },
    { id:'ohp_60',        nom:'Épaules de fer',
      emoji:'💪', xp:300, categorie:'force', rare:false,
      description:'Développé militaire 60kg',
      condition: d => (d.prs['dev_militaire']?.poids||0) >= 60 },

    // ── Programme ─────────────────────────────────────────
    { id:'phase_1', nom:'Phase 1 terminée',
      emoji:'🌱', xp:400, categorie:'programme', rare:false,
      description:'Compléter la Phase Reprise',
      condition: d => d.phasesTerminees >= 1 },
    { id:'cycle_1', nom:'Cycle complet',
      emoji:'🏆', xp:1000, categorie:'programme', rare:true,
      description:'Compléter un cycle de 16 semaines',
      condition: d => d.cyclesTermines >= 1 },
    { id:'cycle_3', nom:'Triplé',
      emoji:'🎖️', xp:2500, categorie:'programme', rare:true,
      description:'Compléter 3 cycles',
      condition: d => d.cyclesTermines >= 3 },

    // ── Volume ────────────────────────────────────────────
    { id:'volume_10T', nom:'10 tonnes',
      emoji:'💎', xp:300, categorie:'volume', rare:false,
      description:'Atteindre 10 tonnes de volume total',
      condition: d => d.volumeTotal >= 10000 },
    { id:'volume_100T', nom:'100 tonnes',
      emoji:'👑', xp:1000, categorie:'volume', rare:true,
      description:'Atteindre 100 tonnes de volume total',
      condition: d => d.volumeTotal >= 100000 },

    // ── Spéciaux ──────────────────────────────────────────
    { id:'comeback', nom:'Le Retour',
      emoji:'🦅', xp:200, categorie:'special', rare:false,
      description:'Reprendre après 7+ jours d\'absence',
      condition: d => d.comeback },
    { id:'journal_10', nom:'Chroniqueur',
      emoji:'📔', xp:150, categorie:'special', rare:false,
      description:'10 entrées dans le journal',
      condition: d => d.totalJournal >= 10 },
    { id:'journal_50', nom:'Mémorialiste',
      emoji:'📚', xp:400, categorie:'special', rare:false,
      description:'50 entrées dans le journal',
      condition: d => d.totalJournal >= 50 },
    { id:'objectif_atteint', nom:'Objectif accompli',
      emoji:'🎯', xp:500, categorie:'special', rare:false,
      description:'Atteindre un objectif personnel',
      condition: d => d.objectifsAtteints >= 1 },
    { id:'perfect_week', nom:'Semaine parfaite',
      emoji:'✨', xp:300, categorie:'special', rare:false,
      description:'Compléter toutes les séances planifiées',
      condition: d => d.semaineParf >= 1 },
    { id:'photos_5', nom:'Photographe',
      emoji:'📸', xp:200, categorie:'special', rare:false,
      description:'5 photos de progression',
      condition: d => d.totalPhotos >= 5 },
    { id:'express_10', nom:'Speed Runner',
      emoji:'⚡', xp:250, categorie:'special', rare:false,
      description:'10 séances express',
      condition: d => d.seancesExpress >= 10 },

    // ── Femme ─────────────────────────────────────────────
    { id:'lower_body_10', nom:'Reine du Lower',
      emoji:'🍑', xp:250, categorie:'femme', rare:false,
      description:'10 séances Lower Body',
      condition: d => d.seancesLowerBody >= 10 },
    { id:'lower_body_50', nom:'Légende des fessiers',
      emoji:'👑', xp:600, categorie:'femme', rare:true,
      description:'50 séances Lower Body',
      condition: d => d.seancesLowerBody >= 50 },
    { id:'first_hip_thrust_pr', nom:'Hip Thrust Queen',
      emoji:'🍑', xp:300, categorie:'femme', rare:false,
      description:'Battre un PR au Hip Thrust',
      // ✅ FIX v5.0 — ref correcte hip_thrust_sol
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) > 0
        || (d.prs['hip_thrust']?.poids||0) > 0 },
    { id:'hip_thrust_60', nom:'Fessiers de feu',
      emoji:'🔥', xp:400, categorie:'femme', rare:false,
      description:'Hip Thrust 60kg',
      // ✅ FIX v5.0
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) >= 60
        || (d.prs['hip_thrust']?.poids||0) >= 60 },
    { id:'hip_thrust_100', nom:'Puissance féminine',
      emoji:'💥', xp:800, categorie:'femme', rare:true,
      description:'Hip Thrust 100kg',
      // ✅ FIX v5.0
      condition: d => (d.prs['hip_thrust_sol']?.poids||0) >= 100
        || (d.prs['hip_thrust']?.poids||0) >= 100 },
    { id:'avant_apres', nom:'Transformation',
      emoji:'🌟', xp:400, categorie:'femme', rare:false,
      description:'Ajouter 2+ photos de progression',
      condition: d => d.totalPhotos >= 2 },
    { id:'objectifs_femme_5', nom:'Détermination',
      emoji:'💪', xp:350, categorie:'femme', rare:false,
      description:'Atteindre 5 objectifs personnels',
      condition: d => d.objectifsAtteints >= 5 },

    // ── Nutrition ─────────────────────────────────────────
    { id:'first_log', nom:'Premier repas logué',
      emoji:'🍽️', xp:50, categorie:'nutrition', rare:false,
      description:'Logger son premier repas',
      condition: d => d.totalLogsNutrition >= 1 },
    { id:'nutrition_7j', nom:'Semaine propre',
      emoji:'🥗', xp:200, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 7 jours consécutifs',
      condition: d => d.streakNutrition >= 7 },
    // ✅ NOUVEAU v5.0 — nutrition_streak_14
    { id:'nutrition_14j', nom:'2 semaines propre',
      emoji:'🥗', xp:350, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 14 jours consécutifs',
      condition: d => d.streakNutrition >= 14 },
    { id:'nutrition_30j', nom:'Mois parfait',
      emoji:'💚', xp:500, categorie:'nutrition', rare:false,
      description:'Loguer ses repas 30 jours',
      condition: d => d.streakNutrition >= 30 },
    { id:'hydratation_7j', nom:'Source de vie',
      emoji:'💧', xp:150, categorie:'nutrition', rare:false,
      description:'Atteindre objectif eau 7 jours',
      condition: d => d.joursHydratation >= 7 },
    { id:'proteines_obj', nom:'Machine à protéines',
      emoji:'💪', xp:200, categorie:'nutrition', rare:false,
      description:'Atteindre objectif protéines 14 jours',
      condition: d => d.joursProteines >= 14 },
    { id:'recettes_10', nom:'Chef sportif',
      emoji:'👨‍🍳', xp:250, categorie:'nutrition', rare:false,
      description:'Logger 10 recettes différentes',
      condition: d => d.totalRecettesLoguees >= 10 },

    // ── Programme IA ──────────────────────────────────────
    { id:'programme_ia_genere', nom:'Programme IA créé',
      emoji:'🧠', xp:200, categorie:'programme_ia', rare:false,
      description:'Générer son premier programme IA',
      condition: d => d.programmeIAGenere },
    { id:'programme_ia_complet', nom:'Fidèle au programme',
      emoji:'🎯', xp:500, categorie:'programme_ia', rare:false,
      description:'Suivre le programme IA pendant 4 semaines',
      condition: d => d.semainesProgrammeIA >= 4 },
    { id:'programme_ia_expert', nom:'Maître IA',
      emoji:'⚡', xp:1000, categorie:'programme_ia', rare:true,
      description:'Suivre le programme IA pendant 16 semaines',
      condition: d => d.semainesProgrammeIA >= 16 },

    // ── Maison / Dehors ───────────────────────────────────
    { id:'maison_premier', nom:'Home Gym',
      emoji:'🏠', xp:150, categorie:'maison', rare:false,
      description:'Première séance à la maison',
      condition: d => d.seancesMaison >= 1 },
    { id:'maison_20', nom:'Home Warrior',
      emoji:'🏠', xp:300, categorie:'maison', rare:false,
      description:'20 séances à la maison',
      condition: d => d.seancesMaison >= 20 },
    { id:'dehors_premier', nom:'Outdoor Fighter',
      emoji:'🌳', xp:150, categorie:'maison', rare:false,
      description:'Première séance en extérieur',
      condition: d => d.seancesDehors >= 1 },
    { id:'dehors_10', nom:'Nature Warrior',
      emoji:'🌳', xp:250, categorie:'maison', rare:false,
      description:'10 séances en extérieur',
      condition: d => d.seancesDehors >= 10 },
    { id:'sans_salle_30', nom:'No Gym No Limit',
      emoji:'💥', xp:500, categorie:'maison', rare:true,
      description:'30 séances sans salle',
      condition: d =>
        (d.seancesMaison + d.seancesDehors) >= 30 },

    // ── Adaptatif ─────────────────────────────────────────
    { id:'pr_seance', nom:'Séance record',
      emoji:'🏆', xp:300, categorie:'adaptatif', rare:false,
      description:'Battre 3 PRs dans une même séance',
      condition: d => d.maxPRsSeance >= 3 },
    { id:'decharge_faite', nom:'Stratège',
      emoji:'🧘', xp:200, categorie:'adaptatif', rare:false,
      description:'Compléter une semaine de décharge',
      condition: d => d.semDecharge >= 1 },
    { id:'surmenage_evite', nom:'Sage athlète',
      emoji:'🦉', xp:300, categorie:'adaptatif', rare:false,
      description:'Éviter un surmenage grâce aux alertes',
      condition: d => d.surmenagesEvites >= 1 }
  ],

  // ════════════════════════════════════════════════════════
  // XP
  // ════════════════════════════════════════════════════════
  getXP() {
    const total  = Utils.storage.get('ft_xp_total', 0);
    const niveau = this.getNiveau(total);
    const xpNiv  = total - niveau.xpMin;
    const range  = Math.max(niveau.xpSuivant - niveau.xpMin, 1);
    const pct    = Math.min(100, Math.round((xpNiv / range) * 100));
    return { total, niveau, pourcentage: pct };
  },

  getNiveau(xp) {
    let actuel = this.NIVEAUX[0];
    for (const n of this.NIVEAUX) {
      if (xp >= n.xpMin) actuel = n;
    }
    return actuel;
  },

  ajouterXP(montant, raison = '') {
    try {
      const avant    = Utils.storage.get('ft_xp_total', 0);
      const apres    = avant + montant;
      Utils.storage.set('ft_xp_total', apres);

      const nivAvant = this.getNiveau(avant);
      const nivApres = this.getNiveau(apres);

      if (nivApres.numero > nivAvant.numero) {
        try {
          if (window.Sounds) Sounds.jouer('levelup');
          else timerRepos.jouerSon?.('pr');
          Utils.vibrer([200,100,200,100,400]);
          Utils.confetti(4000);
        } catch(e) {}

        setTimeout(() => {
          Utils.toast(
            `🎉 NIVEAU ${nivApres.numero} — ${nivApres.emoji} ${nivApres.nom} !`,
            'success', 6000
          );
        }, 300);

      } else if (raison && montant >= 100) {
        Utils.toast(`+${montant} XP — ${raison}`, 'info', 2000);
      }

      return apres;
    } catch(e) { return 0; }
  },

  // ════════════════════════════════════════════════════════
  // TROPHÉES
  // ════════════════════════════════════════════════════════
  getTrophees() {
    const debloquees = Utils.storage.get('ft_trophees', []);
    return this.TROPHEES_DEF.map(t => ({
      ...t,
      debloquee:     debloquees.includes(t.id),
      dateDeblocage: Utils.storage.get(
        `ft_trophy_date_${t.id}`, null
      )
    }));
  },

  verifierTrophees() {
    try {
      const debloquees = Utils.storage.get('ft_trophees', []);

      let totalSeances = 0, totalPRs = 0, streak = 0;
      let seancesParSemaine = 0, prs = {};
      let totalJournal = 0, objectifsAtteints = 0;
      let comeback = false, phasesTerminees = 0;
      let cyclesTermines = 0, volumeTotal = 0;
      let totalPhotos = 0, semaineParf = 0;
      let seancesExpress = 0;
      let seancesLowerBody   = 0;
      let seancesMaison      = 0;
      let seancesDehors      = 0;
      let maxPRsSeance       = 0;
      let semDecharge        = 0;
      let surmenagesEvites   = 0;
      let programmeIAGenere  = false;
      let semainesProgrammeIA = 0;
      let totalLogsNutrition = 0;
      let streakNutrition    = 0;
      let joursHydratation   = 0;
      let joursProteines     = 0;
      let totalRecettesLoguees = 0;

      try { totalSeances      = Tracker.getTotalSeances();              } catch(e) {}
      try { prs               = Tracker.getAllPRs();                    } catch(e) {}
      try { totalPRs          = Object.keys(prs).length;               } catch(e) {}
      try { streak            = Tracker.getStreak().count;             } catch(e) {}
      try { seancesParSemaine = Tracker.getSeancesParSemaine();        } catch(e) {}
      try { totalJournal      = Tracker.getJournal().length;           } catch(e) {}
      try {
        objectifsAtteints = Tracker.getObjectifs()
          .filter(o => o.complete).length;
      } catch(e) {}
      try { comeback = Utils.storage.get('ft_comeback', false);        } catch(e) {}
      try {
        phasesTerminees = Utils.storage.get('ft_phases_terminees', 0);
      } catch(e) {}
      try {
        cyclesTermines = Utils.storage.get('ft_cycles_termines', 0);
      } catch(e) {}
      try { semaineParf = Utils.storage.get('ft_semaines_parf', 0);    } catch(e) {}
      try { semDecharge = Utils.storage.get('ft_semaines_decharge',0); } catch(e) {}
      try {
        surmenagesEvites = Utils.storage.get('ft_surmenages_evites', 0);
      } catch(e) {}
      try {
        totalPhotos = typeof Tracker.getPhotos === 'function'
          ? (Tracker.getPhotos() || []).length : 0;
      } catch(e) {}

      try {
        const seancesHist = Tracker.getHistoriqueSeances(9999);
        volumeTotal = seancesHist.reduce(
          (a,s) => a + (s.volumeTotal||0), 0
        );
        seancesExpress = seancesHist.filter(s =>
          s.id?.includes('express') || s.id?.includes('full_body')
        ).length;
        seancesLowerBody = seancesHist.filter(s =>
          s.id?.includes('lower') || s.id?.includes('fessier')
          || s.id?.includes('jambes') || s.id?.includes('legs')
        ).length;
        seancesMaison = seancesHist.filter(s =>
          s.id?.includes('maison') || s.lieu === 'maison'
        ).length;
        seancesDehors = seancesHist.filter(s =>
          s.id?.includes('dehors') || s.lieu === 'dehors'
        ).length;
        maxPRsSeance = Math.max(
          ...seancesHist.map(s => (s.prs||[]).length), 0
        );
      } catch(e) {}

      try {
        programmeIAGenere = !!Utils.storage.get(
          'ft_programme_ia_genere', null
        );
        const dateDebut = Utils.storage.get('ft_date_debut', null);
        if (programmeIAGenere && dateDebut) {
          semainesProgrammeIA = Utils.semainesDepuis(dateDebut);
        }
      } catch(e) {}

      try {
        let streak_nutri  = 0;
        let jours_prot    = 0;
        let jours_eau     = 0;
        let recettes_ids  = new Set();
        let total_logs    = 0;

        for (let i = 0; i < 60; i++) {
          const date    = Utils.ajouterJours(Utils.aujourd_hui(), -i);
          const journal = Utils.storage.get(
            `ft_nutrition_journal_${date}`, []
          );
          if (journal.length > 0) {
            total_logs += journal.length;
            streak_nutri++;
            const totaux = journal.reduce(
              (a,e) => ({ prot: a.prot + (e.prot||0) }),
              { prot:0 }
            );
            const obj = Utils.storage.get(
              'ft_nutrition_objectifs', { proteines:160 }
            );
            if (totaux.prot >= obj.proteines * 0.9) jours_prot++;
            journal.forEach(e => {
              if (!e.ref?.startsWith('custom_')) {
                recettes_ids.add(e.ref);
              }
            });
          } else if (i > 0) {
            break;
          }
          const eau = Utils.storage.get(
            `ft_nutrition_eau_${date}`, 0
          );
          const eauObj = (Utils.storage.get(
            'ft_nutrition_objectifs', { eau:2.5 }
          ).eau || 2.5) * 1000;
          if (eau >= eauObj * 0.9) jours_eau++;
        }

        totalLogsNutrition   = total_logs;
        streakNutrition      = streak_nutri;
        joursHydratation     = jours_eau;
        joursProteines       = jours_prot;
        totalRecettesLoguees = recettes_ids.size;
      } catch(e) {}

      const donnees = {
        totalSeances, totalPRs, streak,
        seancesParSemaine, prs, totalJournal,
        objectifsAtteints, comeback, phasesTerminees,
        cyclesTermines, volumeTotal, totalPhotos,
        semaineParf, seancesExpress,
        seancesLowerBody, seancesMaison, seancesDehors,
        maxPRsSeance, semDecharge, surmenagesEvites,
        programmeIAGenere, semainesProgrammeIA,
        totalLogsNutrition, streakNutrition,
        joursHydratation, joursProteines,
        totalRecettesLoguees
      };

      const nouveaux = [];

      this.TROPHEES_DEF.forEach(t => {
        if (debloquees.includes(t.id)) return;
        try {
          if (t.condition(donnees)) {
            debloquees.push(t.id);
            nouveaux.push(t);
            Utils.storage.set(
              `ft_trophy_date_${t.id}`,
              Utils.aujourd_hui()
            );
          }
        } catch(e) {}
      });

      if (nouveaux.length > 0) {
        Utils.storage.set('ft_trophees', debloquees);
        nouveaux.forEach((t, i) => {
          setTimeout(() => {
            try {
              if (window.Sounds) Sounds.jouer('trophee');
              else timerRepos.jouerSon?.('pr');
            } catch(e) {}

            Utils.toast(
              `🏆 Trophée : ${t.emoji} ${t.nom} — +${t.xp} XP`,
              'pr', 5000
            );
            this.ajouterXP(t.xp, `Trophée ${t.nom}`);

            if (t.rare) {
              setTimeout(() => {
                Utils.confetti(3000);
                Utils.vibrer([200,100,200,100,400]);
              }, 200);
            }
          }, i * 1500);
        });
      }

      return nouveaux;
    } catch(e) {
      return [];
    }
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS XP
  // ════════════════════════════════════════════════════════
  XP_ACTIONS: {
    SEANCE_COMPLETE:   100,
    SERIE_COMPLETE:      5,
    CIRCUIT_COMPLETE:  150,
    JOURNAL:            25,
    PR_BATTU:           50,
    STREAK_7:          150,
    DEFI_SEMAINE:      200,
    HUMEUR:             10,
    SEMAINE_PARF:      300,
    PREMIERE_SEANCE:   200,
    PHOTO_AJOUTEE:      30,
    OBJECTIF_ATTEINT:  250,
    MESURE_CORPORELLE:  20,
    SUPERSET_COMPLETE:  15,
    NUTRITION_LOG:       5,
    RECETTE_LOG:        10,
    HYDRATATION:        20,
    PROGRAMME_IA:      100,
    SEANCE_MAISON:      80,
    SEANCE_DEHORS:      80,
    BLESSURE_DECLAREE:  30,
    DECHARGE_COMPLETE:  50
  },

  recompenser(action) {
    try {
      const montant = this.XP_ACTIONS[action] || 0;
      if (montant > 0) {
        this.ajouterXP(
          montant,
          action.toLowerCase().replace(/_/g,' ')
        );
      }
      const actionsImportantes = [
        'SEANCE_COMPLETE','PR_BATTU','STREAK_7',
        'SEMAINE_PARF','PREMIERE_SEANCE','OBJECTIF_ATTEINT',
        'PROGRAMME_IA','DEFI_SEMAINE'
      ];
      if (actionsImportantes.includes(action)) {
        setTimeout(() => {
          try { this.verifierTrophees(); } catch(e) {}
        }, 500);
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // CATÉGORIES
  // ════════════════════════════════════════════════════════
  CATEGORIES: {
    tous:         { label:'Tous',          emoji:'🏆' },
    debut:        { label:'Premiers pas',  emoji:'🎯' },
    streak:       { label:'Streak',        emoji:'🔥' },
    seances:      { label:'Séances',       emoji:'💪' },
    prs:          { label:'Records',       emoji:'🏅' },
    force:        { label:'Force',         emoji:'🏋️' },
    volume:       { label:'Volume',        emoji:'💎' },
    programme:    { label:'Programme',     emoji:'📅' },
    programme_ia: { label:'Programme IA',  emoji:'🧠' },
    nutrition:    { label:'Nutrition',     emoji:'🥗' },
    femme:        { label:'Féminin',       emoji:'🌸' },
    maison:       { label:'Maison/Dehors', emoji:'🏠' },
    adaptatif:    { label:'Adaptatif',     emoji:'⚡' },
    special:      { label:'Spéciaux',      emoji:'✨' }
  },

  // ════════════════════════════════════════════════════════
  // ✅ v5.0 — getProchainTrophee() SMART
  // Score = proximité : progressionActuelle / cible
  // ════════════════════════════════════════════════════════
  getProchainTrophee() {
    const non_debloquees = this.getTrophees().filter(
      t => !t.debloquee
    );
    if (!non_debloquees.length) return null;

    // Récupérer les données une seule fois
    let totalSeances = 0, streak = 0, totalPRs = 0;
    let totalPhotos = 0, volumeTotal = 0;
    let seancesLowerBody = 0, streakNutrition = 0;
    let seancesMaison = 0, seancesDehors = 0;

    try { totalSeances    = Tracker.getTotalSeances();        } catch(e) {}
    try { streak          = Tracker.getStreak().count;       } catch(e) {}
    try { totalPRs        = Object.keys(
      Tracker.getAllPRs()).length;                             } catch(e) {}
    try { totalPhotos     = (Tracker.getPhotos?.() || [])
      .length;                                               } catch(e) {}
    try {
      const hist = Tracker.getHistoriqueSeances(9999);
      volumeTotal = hist.reduce(
        (a,s) => a + (s.volumeTotal||0), 0
      );
      seancesLowerBody = hist.filter(s =>
        s.id?.includes('lower') || s.id?.includes('fessier')
      ).length;
      seancesMaison = hist.filter(
        s => s.lieu === 'maison'
      ).length;
      seancesDehors = hist.filter(
        s => s.lieu === 'dehors'
      ).length;
    } catch(e) {}

    // Scorer chaque trophée par proximité
    const scores = non_debloquees.map(t => {
      let pct = 0;

      try {
        // Trophées séances
        if (t.id.startsWith('sessions_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? totalSeances / cible : 0;
        }
        // Trophées streak
        else if (t.id.startsWith('streak_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? streak / cible : 0;
        }
        // Trophées PRs
        else if (t.id.startsWith('prs_')) {
          const cible = parseInt(t.id.split('_')[1]);
          pct = cible > 0 ? totalPRs / cible : 0;
        }
        // Trophées photos
        else if (t.id === 'photos_5' || t.id === 'avant_apres') {
          const cible = t.id === 'photos_5' ? 5 : 2;
          pct = cible > 0 ? totalPhotos / cible : 0;
        }
        // Trophées volume
        else if (t.id === 'volume_10T') {
          pct = volumeTotal / 10000;
        } else if (t.id === 'volume_100T') {
          pct = volumeTotal / 100000;
        }
        // Trophées Lower Body
        else if (t.id.startsWith('lower_body_')) {
          const cible = parseInt(t.id.split('_')[2]);
          pct = cible > 0 ? seancesLowerBody / cible : 0;
        }
        // Trophées maison/dehors
        else if (t.id === 'maison_20') {
          pct = seancesMaison / 20;
        } else if (t.id === 'dehors_10') {
          pct = seancesDehors / 10;
        } else if (t.id === 'sans_salle_30') {
          pct = (seancesMaison + seancesDehors) / 30;
        }
        // Trophées nutrition
        else if (t.id === 'nutrition_7j') {
          pct = streakNutrition / 7;
        } else if (t.id === 'nutrition_14j') {
          pct = streakNutrition / 14;
        } else if (t.id === 'nutrition_30j') {
          pct = streakNutrition / 30;
        }
        // Défaut — score 0
      } catch(e) {}

      return { ...t, pct: Math.min(1, pct) };
    });

    // Retourner celui avec le pct le plus élevé (< 1)
    return scores
      .filter(t => t.pct < 1)
      .sort((a,b) => b.pct - a.pct)[0]
      || non_debloquees[0];
  },

  // ════════════════════════════════════════════════════════
  // RENDER — ✅ v5.0 Fix onclick filtre
  // ════════════════════════════════════════════════════════
  _filtreCategorie: 'tous',

  _getContainer() {
    return document.getElementById('stats-content')
      || document.getElementById('gamification-content')
      || document.getElementById('page-content');
  },

  renderGamificationTab(container) {
    if (!container) return;

    const xp         = this.getXP();
    const trophees   = this.getTrophees();
    const debloquees = trophees.filter(t =>  t.debloquee);
    const verrous    = trophees.filter(t => !t.debloquee);
    const prochain   = this.getProchainTrophee();

    const filtre = this._filtreCategorie || 'tous';
    const filtreDebloques = filtre === 'tous'
      ? debloquees
      : debloquees.filter(t => t.categorie === filtre);
    const filtreVerrous = filtre === 'tous'
      ? verrous
      : verrous.filter(t => t.categorie === filtre);

    container.innerHTML = `

      <!-- Niveau + XP -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  var(--fd-indigo) 0%, #7b2ff7 100%);
                  border:none;text-align:center;color:white">
        <div style="font-size:2.5rem;margin-bottom:4px">
          ${xp.niveau.emoji}
        </div>
        <div style="font-size:1.3rem;font-weight:800">
          Niveau ${xp.niveau.numero} — ${xp.niveau.nom}
        </div>
        <div style="font-size:.78rem;opacity:.8;margin-top:4px">
          ${xp.total.toLocaleString('fr-FR')} XP total
        </div>
        <div style="margin:var(--space-md) 0">
          <div style="display:flex;justify-content:space-between;
                      font-size:.68rem;opacity:.7;
                      margin-bottom:6px">
            <span>${xp.niveau.xpMin.toLocaleString('fr-FR')} XP</span>
            <span>${xp.pourcentage}%</span>
            <span>${xp.niveau.xpSuivant.toLocaleString('fr-FR')} XP</span>
          </div>
          <div style="height:8px;
                      background:rgba(255,255,255,0.2);
                      border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${xp.pourcentage}%;
                        background:var(--fd-lemon);
                        border-radius:99px;
                        transition:width 1s ease">
            </div>
          </div>
        </div>
        ${xp.niveau.numero < 8 ? `
          <div style="font-size:.72rem;opacity:.7">
            ${(xp.niveau.xpSuivant - xp.total)
              .toLocaleString('fr-FR')}
            XP jusqu'au niveau suivant
          </div>` : `
          <div style="font-size:.72rem;color:var(--fd-lemon);
                      font-weight:700">
            ⭐ Niveau maximum — Immortel !
          </div>`}
      </div>

      <!-- Stats trophées -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-lemon)">
            ${debloquees.length}
          </span>
          <span class="stat-label">Débloqués</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${trophees.length}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-mint)">
            ${Math.round(
              (debloquees.length / Math.max(trophees.length,1)) * 100
            )}%
          </span>
          <span class="stat-label">Complété</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="color:var(--fd-indigo)">
            ${xp.total.toLocaleString('fr-FR')}
          </span>
          <span class="stat-label">XP Total</span>
        </div>
      </div>

      <!-- Prochain trophée -->
      ${prochain ? `
        <div style="background:rgba(249,239,119,0.08);
                    border:1px solid rgba(249,239,119,0.25);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px;
                    display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem;flex-shrink:0">
            ${prochain.emoji}
          </div>
          <div style="flex:1">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:.08em;
                        color:var(--fd-lemon);margin-bottom:3px">
              🎯 Prochain trophée
              ${prochain.pct > 0 ? `
                · ${Math.round(prochain.pct * 100)}% complété` : ''}
            </div>
            <div style="font-size:.88rem;font-weight:700">
              ${prochain.nom}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${prochain.description} · +${prochain.xp} XP
            </div>
            ${prochain.pct > 0 ? `
              <div style="height:4px;
                          background:rgba(249,239,119,0.2);
                          border-radius:99px;
                          margin-top:6px;overflow:hidden">
                <div style="height:100%;
                            width:${Math.round(prochain.pct*100)}%;
                            background:var(--fd-lemon);
                            border-radius:99px">
                </div>
              </div>` : ''}
          </div>
          ${prochain.rare ? `
            <div style="padding:3px 8px;
                        background:rgba(255,141,150,0.15);
                        border:1px solid rgba(255,141,150,0.3);
                        border-radius:99px;font-size:.6rem;
                        color:var(--fd-coral);font-weight:700;
                        flex-shrink:0">
              ⭐ RARE
            </div>` : ''}
        </div>` : ''}

      <!-- Barre progression globale -->
      <div class="card mb-md">
        <div class="flex justify-between"
             style="font-size:.78rem;
                    margin-bottom:var(--space-sm)">
          <span style="font-weight:600">🏆 Progression</span>
          <span style="color:var(--text-muted)">
            ${debloquees.length} / ${trophees.length}
          </span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill"
               style="width:${Math.round(
                 (debloquees.length / Math.max(trophees.length,1))*100
               )}%;background:var(--fd-lemon)">
          </div>
        </div>
      </div>

      <!-- ✅ v5.0 — Filtres catégories Fix onclick -->
      <div class="muscle-filter-row mb-md">
        ${Object.entries(this.CATEGORIES).map(([id, cat]) => `
          <button onclick="Gamification._filtreCategorie='${id}';
                           const c = Gamification._getContainer();
                           if (c) Gamification.renderGamificationTab(c);"
                  class="muscle-filter-btn ${
                    filtre === id ? 'active' : ''
                  }"
                  style="font-size:.6rem">
            ${cat.emoji} ${cat.label}
          </button>`).join('')}
      </div>

      <!-- Trophées débloqués -->
      ${filtreDebloques.length > 0 ? `
        <div class="card-label mb-sm">
          🏆 Débloqués (${filtreDebloques.length})
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm);
                    margin-bottom:var(--space-md)">
          ${filtreDebloques.map(t => `
            <div style="background:rgba(249,239,119,0.08);
                        border:1px solid ${t.rare
                          ? 'rgba(255,141,150,0.4)'
                          : 'rgba(249,239,119,0.3)'};
                        border-radius:var(--radius-md);
                        padding:var(--space-md) var(--space-xs);
                        text-align:center;position:relative">
              ${t.rare ? `
                <div style="position:absolute;top:4px;right:4px;
                            font-size:.5rem;padding:1px 4px;
                            background:rgba(255,141,150,0.2);
                            border:1px solid rgba(255,141,150,0.4);
                            border-radius:99px;
                            color:var(--fd-coral);font-weight:700">
                  RARE
                </div>` : ''}
              <div style="font-size:1.8rem;margin-bottom:4px">
                ${t.emoji}
              </div>
              <div style="font-size:.62rem;font-weight:700;
                          color:var(--fd-lemon);line-height:1.3">
                ${t.nom}
              </div>
              <div style="font-size:.58rem;color:var(--fd-mint);
                          margin-top:2px">
                +${t.xp} XP
              </div>
              ${t.dateDeblocage ? `
                <div style="font-size:.52rem;color:var(--text-muted);
                            margin-top:2px">
                  ${Utils.formatDateCourt(t.dateDeblocage)}
                </div>` : ''}
            </div>`).join('')}
        </div>` : filtre !== 'tous' ? `
        <div style="text-align:center;padding:16px;
                    color:var(--text-muted);font-size:.82rem">
          Aucun trophée débloqué dans cette catégorie
        </div>` : `
        <div class="card mb-md"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;margin-bottom:var(--space-sm)">
            🔒
          </div>
          <p style="color:var(--text-muted);font-size:.88rem">
            Aucun trophée débloqué pour l'instant.<br>
            Lance ta première séance !
          </p>
          <button class="btn-primary mt-md"
                  onclick="naviguer('live')"
                  style="width:auto;
                         padding:var(--space-sm) var(--space-lg)">
            ⚡ Commencer
          </button>
        </div>`}

      <!-- Trophées verrouillés -->
      ${filtreVerrous.length > 0 ? `
        <div class="card-label mb-sm">
          🔒 À débloquer (${filtreVerrous.length})
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm);
                    margin-bottom:var(--space-md)">
          ${filtreVerrous.map(t => `
            <div title="${t.description}"
                 style="background:var(--bg-card);
                        border:1px solid ${t.rare
                          ? 'rgba(255,141,150,0.15)'
                          : 'var(--border-color)'};
                        border-radius:var(--radius-md);
                        padding:var(--space-md) var(--space-xs);
                        text-align:center;opacity:.4;
                        filter:grayscale(1);position:relative">
              ${t.rare ? `
                <div style="position:absolute;top:4px;right:4px;
                            font-size:.5rem;padding:1px 4px;
                            background:rgba(255,141,150,0.1);
                            border-radius:99px;
                            color:var(--fd-coral);font-weight:700">
                  RARE
                </div>` : ''}
              <div style="font-size:1.8rem;margin-bottom:4px">
                ${t.emoji}
              </div>
              <div style="font-size:.62rem;font-weight:700;
                          color:var(--text-secondary);
                          line-height:1.3">
                ${t.nom}
              </div>
              <div style="font-size:.58rem;color:var(--text-muted);
                          margin-top:2px">
                +${t.xp} XP
              </div>
              <div style="font-size:.52rem;color:var(--text-muted);
                          margin-top:4px;line-height:1.3">
                ${t.description}
              </div>
            </div>`).join('')}
        </div>` : ''}

      <!-- Comment gagner des XP -->
      <div class="card">
        <div class="card-label">⚡ Comment gagner des XP</div>
        <div style="margin-top:var(--space-sm)">
          ${Object.entries(this.XP_ACTIONS).map(([action, xpVal]) => `
            <div class="score-row">
              <span class="score-row-label" style="font-size:.82rem">
                ${this._labelAction(action)}
              </span>
              <span style="font-size:.82rem;font-weight:700;
                           color:var(--fd-lemon)">
                +${xpVal} XP
              </span>
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  _labelAction(action) {
    const labels = {
      SEANCE_COMPLETE:   '💪 Séance complétée',
      SERIE_COMPLETE:    '✅ Série validée',
      PR_BATTU:          '🏆 Record personnel battu',
      STREAK_7:          '🔥 Streak de 7 jours',
      DEFI_SEMAINE:      '🎯 Défi semaine accompli',
      JOURNAL:           '📔 Entrée journal',
      HUMEUR:            '😊 Humeur du jour',
      SEMAINE_PARF:      '✨ Semaine parfaite',
      PREMIERE_SEANCE:   '🎯 Première séance',
      PHOTO_AJOUTEE:     '📸 Photo progression',
      OBJECTIF_ATTEINT:  '🎯 Objectif atteint',
      MESURE_CORPORELLE: '⚖️ Mesure corporelle',
      SUPERSET_COMPLETE: '⚡ Superset complété',
      CIRCUIT_COMPLETE:  '🔄 Circuit complété',
      NUTRITION_LOG:     '🍽️ Repas logué',
      RECETTE_LOG:       '🥗 Recette loguée',
      HYDRATATION:       '💧 Objectif eau atteint',
      PROGRAMME_IA:      '🧠 Programme IA généré',
      SEANCE_MAISON:     '🏠 Séance à la maison',
      SEANCE_DEHORS:     '🌳 Séance en extérieur',
      BLESSURE_DECLAREE: '🩹 Blessure déclarée',
      DECHARGE_COMPLETE: '😴 Décharge terminée'
    };
    return labels[action]
      || action.toLowerCase().replace(/_/g,' ');
  },

  getXPParCategorie() {
    const trophees = this.getTrophees().filter(t => t.debloquee);
    const par = {};
    trophees.forEach(t => {
      const cat = t.categorie || 'autre';
      par[cat]  = (par[cat] || 0) + t.xp;
    });
    return par;
  },

  _resetXP() {
    Utils.storage.set('ft_xp_total', 0);
    Utils.storage.set('ft_trophees', []);
    Utils.toast('XP réinitialisé.', 'info');
  }
};

window.Gamification = Gamification;
console.log(
  `✅ Gamification v5.0 chargé — ${Gamification.TROPHEES_DEF.length} trophées`
  + ' + Fix hip_thrust_sol + nutrition_14j + Smart prochain'
);
