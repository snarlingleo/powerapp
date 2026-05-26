/* ============================================================
   PowerApp — Notifications v5.0
   Rappels + Absence + Streak + PR + Motivation
   + Séance en cours + Surmenage + Milestone XP
   + Hydratation + Surcharge musculaire
   + Genre-aware + Interface settings
   + Fix toggles + LevelUp notif + fin_repos
   ============================================================ */

const Notifications = {

  CONFIG_CLE: 'ft_notifs_config',

  // ════════════════════════════════════════════════════════
  // CONFIGURATION
  // ════════════════════════════════════════════════════════
  getConfig() {
    return Utils.storage.get(this.CONFIG_CLE, {
      active:            true,
      rappelQuotidien:   true,
      heureRappel:       '07:30',
      absence1j:         true,
      absence2j:         true,
      absence5j:         true,
      streakDanger:      true,
      motivationMatin:   true,
      prProche:          true,
      semaineParf:       true,
      ton:               'motivant',
      son:               true,
      vibration:         true,
      finSeance:         true,
      nouveauPR:         true,
      trophee:           true,
      decharge:          true,
      hydratation:       true,
      surcharge:         true,
      levelUp:           true,   // ✅ NOUVEAU v5.0
      rappelHydratation: '10:00',
      hydratationFreq:   2
    });
  },

  sauvegarderConfig(updates) {
    const config = { ...this.getConfig(), ...updates };
    Utils.storage.set(this.CONFIG_CLE, config);
    return config;
  },

  // ════════════════════════════════════════════════════════
  // PERMISSION
  // ════════════════════════════════════════════════════════
  async demanderPermission() {
    if (!('Notification' in window)) {
      console.warn('[Notifs] Non supporté sur cet appareil');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') {
      Utils.toast(
        '🔔 Active les notifications dans les paramètres',
        'info', 4000
      );
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      return result === 'granted';
    } catch(e) { return false; }
  },

  estAutorisee() {
    return 'Notification' in window
      && Notification.permission === 'granted';
  },

  // ════════════════════════════════════════════════════════
  // ENVOYER
  // ════════════════════════════════════════════════════════
  async envoyer(titre, message, options = {}) {
    const config = this.getConfig();
    if (!config.active) return;
    if (!this.estAutorisee()) return;

    const defauts = {
      icon:     './assets/icons/icon-192.png',
      badge:    './assets/icons/icon-72.png',
      vibrate:  config.vibration ? [200, 100, 200] : [],
      tag:      options.tag || 'powerapp',
      renotify: true,
      actions:  options.actions || []
    };

    try {
      if ('serviceWorker' in navigator) {
        const sw = await navigator.serviceWorker.ready;
        await sw.showNotification(titre, {
          body: message, ...defauts, ...options
        });
      } else {
        new Notification(titre, {
          body: message, icon: defauts.icon
        });
      }
    } catch(e) {
      console.warn('[Notifs] Erreur envoi:', e);
    }
  },

  // ════════════════════════════════════════════════════════
  // MESSAGES PAR TON — genre-aware
  // ════════════════════════════════════════════════════════
  getMessage(type, contexte = {}) {
    const config = this.getConfig();
    const ton    = config.ton;

    let genre = 'homme';
    try {
      genre = Utils.storage.get(
        'ft_profil_onboarding', {}
      ).genre || 'homme';
    } catch(e) {}

    const {
      jours  = 0,
      streak = 0,
      nom    = 'Athlète',
      pr     = '',
      niveau = ''
    } = contexte;

    const e        = genre === 'femme' ? 'e' : '';
    const champion = genre === 'femme' ? 'championne' : 'champion';

    const messages = {
      absence_1: {
        motivant: [
          `Hé ${nom} ! T'as oublié quelque chose... tes muscles ! 💪`,
          `Un jour de repos c'est bien. Deux c'est une excuse. 😏`,
          `Ta prochaine séance s'impatiente ${champion} ! Tu viens ? 🏋️`
        ],
        doux: [
          `Coucou ${nom} 😊 Tu nous manques ! La salle t'attend.`,
          `Parfois on a besoin d'un petit rappel. Ta séance est là 🌟`,
          `Hey, tout va bien ? Ta séance reste disponible à tout moment 💫`
        ],
        severe: [
          `${nom} ! UNE séance manquée. C'est UNE de trop. On y va. 🔥`,
          `Les excuses ne construisent pas de muscles. BOUGE ! ⚡`,
          `Chaque jour sans entraînement est un jour de régression. MAINTENANT. 💥`
        ]
      },
      absence_2: {
        motivant: [
          `2 jours sans sueur ${nom}... la flemme s'installe vite ! 😅`,
          `Ton streak de ${streak}j mérite mieux. Allez ! 🔥`,
          `45 minutes et tu repars comme une fusée 🚀`
        ],
        doux: [
          `${nom}, 2 jours de pause c'est ok. Mais là c'est l'heure de reprendre 💪`,
          `On sait que c'est parfois difficile. Même une courte séance compte ! 🌟`,
          `Retourner après une pause c'est le vrai défi. Tu peux le faire ! ✨`
        ],
        severe: [
          `2 jours ${nom}. 48H. Aucune excuse valable. On repart. MAINTENANT.`,
          `Ton corps commence à oublier. Rappelle-lui qui est le patron. 💥`,
          `2 jours perdus. Ne fais pas de 3. SALLE. AUJOURD'HUI. 🔥`
        ]
      },
      absence_5: {
        motivant: [
          `${jours} jours ${nom}... relançons la machine doucement ! 🌱`,
          `Le plus dur c'est de remettre les baskets. Après ça roule ! 👟`,
          `Ton futur toi te remerciera d'y aller aujourd'hui. 💪`
        ],
        doux: [
          `${nom}, on ne juge pas. On repart simplement. Doucement 🌟`,
          `${jours} jours de pause, et alors ? Ce qui compte c'est de reprendre 💫`,
          `Chaque grand${e} athlète a eu des pauses. L'important c'est de revenir 🌸`
        ],
        severe: [
          `${jours} JOURS ${nom}. C'est inacceptable. On repart maintenant.`,
          `${jours} jours perdus. Chaque jour de plus te coûte tes gains. STOP. 🔥`,
          `Tu avais un objectif. Tu l'as pas oublié. RETOURNE À LA SALLE. ⚡`
        ]
      },
      streak_danger: {
        motivant: [
          `⚠️ Ton streak de ${streak}j est en danger ${nom} !`,
          `🔥 ${streak} jours de streak à protéger ! Tu y vas ?`,
          `Streak de ${streak}j... une courte séance suffit pour le garder.`
        ],
        doux: [
          `${nom}, ton beau streak de ${streak} jours peut encore être sauvé 🌟`,
          `Plus que quelques heures pour garder ton streak. Tu le fais ? 💫`,
          `${streak} jours c'est trop précieux à perdre. Allez ! ✨`
        ],
        severe: [
          `STREAK EN DANGER ${nom} ! ${streak}j à protéger. TU Y VAS OU PAS ?! 🔥`,
          `${streak} jours. Tout perdre en une nuit. Décide maintenant. ⚡`,
          `TON STREAK DE ${streak}J. MAINTENANT. 💥`
        ]
      },
      rappel_quotidien: {
        motivant: [
          `Bonjour ${nom} ! 🌅 Ta séance t'attend. On va cartonner !`,
          `Nouvelle journée, nouvelles opportunités de progresser ! 💪`,
          `C'est parti ${nom} ! Aujourd'hui on bat des records ! 🏆`
        ],
        doux: [
          `Bonjour ${nom} 😊 Prêt${e} pour ta séance du jour ?`,
          `Belle journée pour s'entraîner ${nom} ! Tu vas assurer 🌟`,
          `Coucou ${nom} ! Ta séance est planifiée. Bonne chance 💫`
        ],
        severe: [
          `${nom}. Séance du jour. Pas d'excuse. On y va. 🔥`,
          `La salle t'attend ${nom}. Tu es attendu${e}. Présent${e} ? ⚡`,
          `JOUR D'ENTRAÎNEMENT ${nom}. DEBOUT. SALLE. MAINTENANT. 💥`
        ]
      },
      semaine_parfaite: {
        motivant: [
          `🏆 SEMAINE PARFAITE ${nom} ! Toutes les séances complètes. +300 XP !`,
          `Tu es INARRÊTABLE ! Semaine 100% complète ! Continue ! 🔥`,
          `Semaine parfaite ${nom} ! C'est comme ça qu'on construit un physique ! 💪`
        ],
        doux: [
          `Bravo ${nom} ! Semaine complète ! Tu peux être fièr${e} 🌟`,
          `Quelle belle semaine ${nom} ! Continue, tu es sur la bonne voie 💫`,
          `Semaine parfaite ! Tu le mérites vraiment ${nom} ✨`
        ],
        severe: [
          `SEMAINE PARFAITE. Voilà comment on progresse. Recommence. 🔥`,
          `Toutes les séances. C'est le minimum requis. On garde ce rythme. ⚡`,
          `BIEN. Semaine complète. C'est maintenant la norme. 💥`
        ]
      },
      pr_proche: {
        motivant: [
          `📈 Tu es proche d'un record sur ${pr} ${nom} !`,
          `Aujourd'hui pourrait être le jour du PR sur ${pr} ! 🏆`,
          `${pr} : tu es à seulement quelques kilos du record ! 💪`
        ],
        doux: [
          `${nom}, tu progresses bien sur ${pr} 🌟 Record accessible !`,
          `Tu es proche de ton meilleur sur ${pr}. Essaie si tu te sens bien 💫`,
          `Belle progression sur ${pr} ! Le record est à portée 🌸`
        ],
        severe: [
          `${pr}. Ton record est à portée. BATS-LE AUJOURD'HUI. 🔥`,
          `PROCHE DU PR sur ${pr}. Pas d'excuse pour rater ça. ⚡`,
          `LE PR SUR ${pr} EST LÀ. PRENDS-LE. 💥`
        ]
      },
      fin_seance: {
        motivant: [
          `💪 Séance terminée ${nom} ! Tu assures grave. Récupère bien !`,
          `GG ${nom} ! Encore une séance dans la boîte. Respects 🏆`,
          `BEAST MODE activé ${nom} ! Séance faite. Corps qui progresse ! 🔥`
        ],
        doux: [
          `Bravo ${nom} ! Séance terminée, profite de ta récupération 🌟`,
          `Belle séance ${nom} ! Ton corps te remerciera 💫`,
          `Fièr${e} de toi ${nom} ! Séance accomplie ✨`
        ],
        severe: [
          `Séance faite. Bien. La suivante est dans quelques jours. Prépare-toi.`,
          `C'était pas parfait mais c'était fait. Améliore demain. 🎯`,
          `Séance terminée. Récupère. La prochaine doit être meilleure. 🔥`
        ]
      },
      decharge: {
        motivant: [
          `😴 Semaine de décharge ${nom} ! Ton corps va supercompenser. Charges légères !`,
          `Décharge planifiée ${nom} ! -40% charges. Tu vas exploser le prochain cycle ! 🚀`,
          `Semaine de récup ${nom} ! Technique parfaite, charges légères. C'est stratégique ! 💡`
        ],
        doux: [
          `${nom}, cette semaine on récupère. Charges légères, technique parfaite 🌟`,
          `Semaine de décharge ! Profites-en pour parfaire ta technique 💫`,
          `Ton corps mérite cette semaine de récup ${nom} ✨`
        ],
        severe: [
          `DÉCHARGE. -40% charges. Pas de négociation. C'est planifié. 🎯`,
          `Semaine légère IMPOSÉE. Récupère pour mieux exploser ensuite. ⚡`,
          `DÉCHARGE OBLIGATOIRE. Ignorer = surmenage = régression. Obéis. 💥`
        ]
      },
      // ✅ NOUVEAU v5.0 — fin de repos timer
      fin_repos: {
        motivant: [
          `⚡ C'est reparti ${nom} ! Prochain exercice maintenant ! 💪`,
          `😤 Repos terminé ! On reprend les forces ! 🔥`,
          `GO GO GO ${nom} ! La prochaine série t'attend ! ⚡`
        ],
        doux: [
          `✅ Repos terminé ${nom} ! Quand tu es prêt${e} 🌟`,
          `💫 Prêt${e} pour la prochaine série ${nom} ?`,
          `🌸 Repos fini ! Prends ton temps ${nom} ✨`
        ],
        severe: [
          `REPOS TERMINÉ. PROCHAINE SÉRIE. MAINTENANT. 🔥`,
          `⚡ STOP REPOS. SÉRIE SUIVANTE. MAINTENANT. 💥`,
          `TU TE REPOSES DEPUIS ASSEZ LONGTEMPS. BOUGEZ. 🔥`
        ]
      },
      hydratation: {
        motivant: [
          `💧 ${nom} ! N'oublie pas de t'hydrater. Ton corps te remerciera !`,
          `💧 Pause hydratation ${nom} ! Un verre d'eau = meilleure performance.`,
          `💧 Ta bouteille, c'est ton meilleur équipement ${nom} ! 😄`
        ],
        doux: [
          `💧 Coucou ${nom} ! Pense à boire de l'eau 🌟`,
          `💧 Hydratation = récupération. Un verre maintenant ? 💫`,
          `💧 Petite pensée pour ton hydratation ${nom} ✨`
        ],
        severe: [
          `💧 ${nom}. EAU. MAINTENANT. La déshydratation nuit aux performances.`,
          `HYDRATATION ${nom}. Si tu ne bois pas, tu régresseras. Un verre. VITE.`,
          `💧 BOIS DE L'EAU ${nom}. C'est non négociable. 🔥`
        ]
      },
      surcharge: {
        motivant: [
          `⚠️ ${nom} ! Attention à la surcharge. Ton corps demande du repos.`,
          `⚠️ Surcharge détectée ! Une séance légère ou un jour off serait parfait.`,
          `⚠️ Tes muscles travaillent trop ${nom}. Récupération = progression ! 💪`
        ],
        doux: [
          `${nom}, ton corps montre des signes de fatigue. Prends soin de toi 🌟`,
          `Surcharge musculaire détectée. Un jour de repos est une bonne idée 💫`,
          `${nom}, écoute ton corps. Il sait ce dont il a besoin ✨`
        ],
        severe: [
          `SURCHARGE ${nom}. REPOS IMPOSÉ. Sinon blessure garantie. 🔥`,
          `Ton corps crie stop. Écoute-le. REPOS MAINTENANT. ⚡`,
          `SURMENAGE MUSCULAIRE. UN JOUR DE REPOS. PAS DE NÉGOCIATION. 💥`
        ]
      },
      // ✅ NOUVEAU v5.0 — Level Up
      level_up: {
        motivant: [
          `🎉 NIVEAU ${niveau} atteint ${nom} ! Tu es INARRÊTABLE ! 🔥`,
          `⭐ Level Up ${nom} ! ${niveau} - tu montes en puissance !`,
          `🏆 Nouveau niveau ${nom} ! ${niveau} — la progression continue !`
        ],
        doux: [
          `🌟 Bravo ${nom} ! Tu passes au niveau ${niveau} !`,
          `✨ Nouveau niveau ${niveau} ${nom} ! Tu peux être fièr${e} de toi !`,
          `💫 Niveau ${niveau} atteint ! Continue comme ça ${nom} 🌸`
        ],
        severe: [
          `NIVEAU ${niveau} ${nom}. Bien. Maintenant vise le suivant. 🔥`,
          `${niveau}. C'est bien. C'est insuffisant. Continue. ⚡`,
          `LEVEL UP. ${niveau}. On ne s'arrête pas. PROCHAIN. 💥`
        ]
      }
    };

    const groupe = messages[type];
    if (!groupe) return `Hey ${nom}, ta séance t'attend ! 💪`;
    const liste = groupe[ton] || groupe.motivant;
    return Utils.random(liste);
  },

  // ════════════════════════════════════════════════════════
  // VÉRIFICATIONS
  // ════════════════════════════════════════════════════════
  async verifierAbsenceEtNotifier() {
    const config = this.getConfig();
    if (!config.active) return;

    let jours = -1, nom = 'Athlète', streak = 0;
    try { jours  = Tracker.getJoursAbsence();            } catch(e) {}
    try { nom    = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { streak = Tracker.getStreak().count;            } catch(e) {}

    try {
      const planning = window.PLANNING_SEMAINE?.[
        Utils.indexJourSemaine(Utils.aujourd_hui())
      ];
      if (!planning?.seanceId) return;
    } catch(e) {}

    const ctx = { jours, streak, nom };

    if (jours >= 5 && config.absence5j) {
      await this.envoyer(
        `😢 ${jours} jours sans séance...`,
        this.getMessage('absence_5', ctx),
        {
          tag:'absence-5j',
          actions: [
            { action:'express', title:'⚡ Séance express' },
            { action:'go',      title:'▶ Je fonce'        }
          ]
        }
      );
    } else if (jours >= 2 && config.absence2j) {
      await this.envoyer(
        `🔥 ${jours} jours sans séance`,
        this.getMessage('absence_2', ctx),
        {
          tag:'absence-2j',
          actions: [
            { action:'go',    title:'▶ J\'y vais !' },
            { action:'later', title:'⏰ Ce soir'    }
          ]
        }
      );
    } else if (jours >= 1 && config.absence1j) {
      await this.envoyer(
        `💪 Ta séance t'attend !`,
        this.getMessage('absence_1', ctx),
        {
          tag:'absence-1j',
          actions: [{ action:'go', title:'▶ J\'y vais !' }]
        }
      );
    }
  },

  async envoyerRappelQuotidien() {
    const config = this.getConfig();
    if (!config.active || !config.rappelQuotidien) return;

    let nom = 'Athlète', seance = null;
    try { nom    = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { seance = Programme.getProchaineSeance();        } catch(e) {}

    let message = this.getMessage('rappel_quotidien', { nom });
    if (seance) {
      message +=
        `\n${seance.emoji} ${seance.nom} — ~${seance.duree_estimee}min`;
    }

    await this.envoyer(
      `🌅 Bonjour ${nom} !`,
      message,
      {
        tag:'rappel-quotidien',
        actions: [
          { action:'go',    title:'💪 On y va !' },
          { action:'later', title:'⏰ Plus tard'  }
        ]
      }
    );
  },

  async envoyerMotivationMatin() {
    const config = this.getConfig();
    if (!config.active || !config.motivationMatin) return;

    let citation = {
      texte:'La progression est un choix.', auteur:'Anonyme'
    };
    try {
      if (typeof Coach !== 'undefined'
          && Coach.getCitationDuJour) {
        citation = Coach.getCitationDuJour();
      }
    } catch(e) {}

    await this.envoyer(
      `🌅 Citation du jour`,
      `"${citation.texte}" — ${citation.auteur}`,
      {
        tag:'motivation-matin',
        actions: [
          { action:'go',    title:'💪 C\'est parti !' },
          { action:'later', title:'☕ Après le café'  }
        ]
      }
    );
  },

  async verifierStreakDanger() {
    const config = this.getConfig();
    if (!config.active || !config.streakDanger) return;

    let streak = { count:0 };
    try { streak = Tracker.getStreak(); } catch(e) {}
    if (streak.count < 3) return;

    const heure = Utils.heureActuelle();
    if (heure < 18) return;

    try {
      const seanceDuJour = Tracker.getSeanceDuJour();
      if (seanceDuJour?.complete) return;
    } catch(e) {}

    try {
      const planning = window.PLANNING_SEMAINE?.[
        Utils.indexJourSemaine(Utils.aujourd_hui())
      ];
      if (!planning?.seanceId) return;
    } catch(e) {}

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    await this.envoyer(
      `⚠️ Streak en danger !`,
      this.getMessage('streak_danger', {
        streak: streak.count, nom
      }),
      {
        tag:     'streak-danger',
        vibrate: [300, 100, 300, 100, 300],
        actions: [{ action:'go', title:'🔥 Je fonce !' }]
      }
    );
  },

  async verifierSemaineParf() {
    const config = this.getConfig();
    if (!config.active || !config.semaineParf) return;

    let objectif = 4, seances = 0, nom = 'Athlète';
    try {
      objectif = Utils.storage.get(
        'ft_objectif_seances_semaine', 4
      );
    } catch(e) {}
    try { seances = Tracker.getSeancesParSemaine();       } catch(e) {}
    try { nom     = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    if (seances < objectif) return;

    const cleNotif = 'ft_notif_semaine_parf_'
      + Utils.debutSemaine(Utils.aujourd_hui());
    if (Utils.storage.get(cleNotif, false)) return;

    await this.envoyer(
      `🏆 Semaine PARFAITE !`,
      this.getMessage('semaine_parfaite', { nom }),
      {
        tag:     'semaine-parfaite',
        vibrate: [200,100,200,100,200,100,400]
      }
    );

    Utils.storage.set(cleNotif, true);

    try {
      Gamification.recompenser('SEMAINE_PARF');
      const total = Utils.storage.get('ft_semaines_parf', 0);
      Utils.storage.set('ft_semaines_parf', total + 1);
    } catch(e) {}
  },

  async notifierPR(exerciceRef, poids, reps) {
    const config = this.getConfig();
    if (!config.active || !config.nouveauPR) return;

    let ex = {}, nom = 'Athlète';
    try { ex  = (window.EXERCICES||{})[exerciceRef] || {}; } catch(e) {}
    try { nom = Tracker.getProfil().nom || 'Athlète';      } catch(e) {}

    await this.envoyer(
      `🏆 NOUVEAU RECORD !`,
      `${ex.nom||exerciceRef} : ${poids}kg × ${reps} reps ! Incroyable ${nom} !`,
      {
        tag:     `pr-${exerciceRef}`,
        vibrate: [200, 100, 200, 100, 400],
        actions: [{ action:'stats', title:'📊 Voir stats' }]
      }
    );
  },

  async notifierFinSeance(seanceNom, duree, volume) {
    const config = this.getConfig();
    if (!config.active || !config.finSeance) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    await this.envoyer(
      `✅ Séance terminée !`,
      `${seanceNom} — ${Utils.formatDuree(duree)} · `
      + `${Utils.formatVolume(volume)} · `
      + this.getMessage('fin_seance', { nom }),
      {
        tag:     'fin-seance',
        vibrate: [100, 50, 100],
        actions: [
          { action:'stats', title:'📊 Mes stats' },
          { action:'share', title:'📸 Partager'  }
        ]
      }
    );
  },

  // ✅ NOUVEAU v5.0 — Notification Level Up
  async notifierLevelUp(niveau) {
    const config = this.getConfig();
    if (!config.active || !config.levelUp) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    const cle = `ft_notif_level_${niveau.numero}`;
    if (Utils.storage.get(cle, false)) return;

    await this.envoyer(
      `⭐ Niveau ${niveau.numero} — ${niveau.nom} !`,
      this.getMessage('level_up', {
        nom, niveau: `${niveau.emoji} ${niveau.nom}`
      }),
      {
        tag:     `level-up-${niveau.numero}`,
        vibrate: [200,100,200,100,400],
        actions: [{ action:'stats', title:'🏆 Voir trophées' }]
      }
    );

    Utils.storage.set(cle, true);
  },

  async notifierDecharge() {
    const config = this.getConfig();
    if (!config.active || !config.decharge) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    const cle = 'ft_notif_decharge_'
      + Utils.debutSemaine(Utils.aujourd_hui());
    if (Utils.storage.get(cle, false)) return;

    await this.envoyer(
      `😴 Semaine de décharge !`,
      this.getMessage('decharge', { nom }),
      { tag:'decharge', vibrate:[100,50,100] }
    );

    Utils.storage.set(cle, true);
  },

  async verifierPRsProches() {
    const config = this.getConfig();
    if (!config.active || !config.prProche) return;

    let alertes = [];
    try {
      const seanceDuJour = Tracker.getSeanceDuJour?.();
      const seanceId     = seanceDuJour?.id || null;
      alertes = Tracker.getPRsProches(seanceId);
    } catch(e) {}

    if (!alertes.length) {
      try {
        const prs    = Tracker.getAllPRs();
        const seance = Programme.getProchaineSeance();
        if (!seance) return;

        let nom = 'Athlète';
        try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

        let phase = { intensite:0.75 };
        try { phase = Programme.getPhaseActuelle(); } catch(e) {}

        for (const exRef of (seance.exercices || [])) {
          const refStr = exRef?.ref || exRef;
          const pr     = prs[refStr];
          if (!pr?.rm1) continue;

          const chargeObj = Math.round(pr.rm1 * phase.intensite);
          const diff      = pr.rm1 - chargeObj;

          if (diff <= 5 && diff >= 0) {
            const ex = (window.EXERCICES||{})[refStr] || {};
            await this.envoyer(
              `📈 PR en vue !`,
              this.getMessage('pr_proche', {
                nom, pr: ex.nom||refStr
              }),
              {
                tag:     `pr-proche-${refStr}`,
                actions: [{
                  action:'go',
                  title: '🏆 Je vise le PR !'
                }]
              }
            );
            break;
          }
        }
        return;
      } catch(e) {}
    }

    if (!alertes.length) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    const alerte = alertes[0];
    await this.envoyer(
      `📈 PR en vue sur ${alerte.nom} !`,
      this.getMessage('pr_proche', { nom, pr: alerte.nom }),
      {
        tag:     `pr-proche-${alerte.exerciceRef}`,
        actions: [{ action:'go', title:'🏆 Je vise le PR !' }]
      }
    );
  },

  async verifierHydratation() {
    const config = this.getConfig();
    if (!config.active || !config.hydratation) return;

    const heure = Utils.heureActuelle();
    if (heure < 8 || heure > 21) return;

    let eauObj = 2.5, eauActuelle = 0;
    try {
      const obj = Utils.storage.get('ft_nutrition_objectifs', {});
      eauObj    = obj.eau || 2.5;
    } catch(e) {}
    try {
      const cleEau = `ft_nutrition_eau_${Utils.aujourd_hui()}`;
      eauActuelle  = Utils.storage.get(cleEau, 0);
    } catch(e) {}

    if (eauActuelle >= eauObj * 1000 * 0.9) return;

    const cle = `ft_notif_eau_${Utils.aujourd_hui()}_${heure}`;
    if (Utils.storage.get(cle, false)) return;

    const freq = config.hydratationFreq || 2;
    if (heure % freq !== 0) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    const reste = ((eauObj * 1000) - eauActuelle) / 1000;

    await this.envoyer(
      `💧 Rappel hydratation`,
      this.getMessage('hydratation', { nom })
        + ` Encore ${reste.toFixed(1)}L pour ton objectif.`,
      {
        tag:     'hydratation',
        actions: [{ action:'eau', title:'💧 Boire 250ml' }]
      }
    );

    Utils.storage.set(cle, true);
  },

  async verifierSurchargeMusculaire() {
    const config = this.getConfig();
    if (!config.active || !config.surcharge) return;

    const cle = `ft_notif_surcharge_${Utils.aujourd_hui()}`;
    if (Utils.storage.get(cle, false)) return;

    let alertes = [];
    try { alertes = Tracker.getSurchargeMusculaire(); } catch(e) {}
    if (!alertes.length) return;

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    const muscles = alertes.slice(0,2)
      .map(a => a.muscle).join(', ');

    await this.envoyer(
      `⚠️ Surcharge musculaire !`,
      `${this.getMessage('surcharge', { nom })} Zones : ${muscles}`,
      {
        tag:     'surcharge',
        vibrate: [200, 100, 200],
        actions: [
          { action:'stats', title:'📊 Voir analyse' },
          { action:'repos', title:'😴 Repos demain' }
        ]
      }
    );

    Utils.storage.set(cle, true);
  },

  async _verifierSeanceEnCours() {
    try {
      const config = this.getConfig();
      if (!config.active) return;

      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle?.startsWith('ft_seance_start_')) continue;

        const debut    = Utils.storage.get(cle, null);
        if (!debut) continue;

        const dureeMin = Math.floor((Date.now() - debut) / 60000);

        if (dureeMin > 120) {
          let nom = 'Athlète';
          try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

          const cle2 = 'ft_notif_seance_longue_'
            + Utils.aujourd_hui();
          if (Utils.storage.get(cle2, false)) return;

          await this.envoyer(
            '⏱️ Séance longue !',
            `${nom}, ta séance dure depuis ${dureeMin} minutes. Pense à terminer pour enregistrer tes stats !`,
            { tag:'seance-longue' }
          );

          Utils.storage.set(cle2, true);
          break;
        }
      }
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // VÉRIFICATION AU LANCEMENT
  // ════════════════════════════════════════════════════════
  async verifierAuLancement() {
    const config = this.getConfig();
    if (!config.active) return;

    const heure = Utils.heureActuelle();
    let jours   = -1;
    try { jours = Tracker.getJoursAbsence(); } catch(e) {}

    if (jours >= 2 && heure >= 8 && heure <= 21) {
      await this.verifierAbsenceEtNotifier();
    }

    const dejVerifPR = Utils.storage.get(
      'ft_verif_pr_' + Utils.aujourd_hui(), false
    );
    if (!dejVerifPR) {
      await this.verifierPRsProches();
      Utils.storage.set(
        'ft_verif_pr_' + Utils.aujourd_hui(), true
      );
    }

    try {
      if (Programme.isDecharge?.()) {
        await this.notifierDecharge();
      }
    } catch(e) {}

    await this.verifierSurchargeMusculaire();
  },

  // ════════════════════════════════════════════════════════
  // PLANIFICATION
  // ════════════════════════════════════════════════════════
  planifierRappels() {
    const config = this.getConfig();
    if (!config.active) return;

    this.arreterPlanification();

    const parts     = (config.heureRappel||'07:30').split(':');
    const heureConf = parseInt(parts[0]) || 7;
    const minConf   = parseInt(parts[1]) || 30;

    this._intervalVerif = setInterval(async () => {
      const now     = new Date();
      const heure   = now.getHours();
      const minutes = now.getMinutes();

      if (heure === heureConf && minutes === minConf
          && config.rappelQuotidien) {
        const cle = 'ft_rappel_' + Utils.aujourd_hui();
        if (!Utils.storage.get(cle, false)) {
          await this.envoyerRappelQuotidien();
          Utils.storage.set(cle, true);
        }
      }

      const minuteMotiv = (minConf + 30) % 60;
      const heureMotiv  = minConf + 30 >= 60
        ? heureConf + 1 : heureConf;
      if (heure === heureMotiv && minutes === minuteMotiv
          && config.motivationMatin) {
        const cle = 'ft_motiv_' + Utils.aujourd_hui();
        if (!Utils.storage.get(cle, false)) {
          await this.envoyerMotivationMatin();
          Utils.storage.set(cle, true);
        }
      }

      if (minutes === 0 && heure % 2 === 0
          && heure >= 8 && heure <= 20) {
        await this.verifierAbsenceEtNotifier();
      }

      if (heure >= 18 && heure <= 22 && minutes === 30) {
        await this.verifierStreakDanger();
      }

      if (heure === 12 && minutes === 0) {
        await this.verifierPRsProches();
      }

      if (heure === 21 && minutes === 0) {
        await this.verifierSemaineParf();
      }

      if (heure === 22 && minutes === 0) {
        await this.verifierSurmenage();
        await this.verifierMilestoneXP();
        await this.verifierSurchargeMusculaire();
      }

      if (heure === 10 && minutes === 0) {
        await this.envoyerRappelPersonnalise();
        await this.notifierComeback();
      }

      if (minutes === 0) {
        await this._verifierSeanceEnCours();
        await this.verifierHydratation();
      }

    }, 60 * 1000);

    console.log('[Notifs] Planification v5.0 active');
  },

  arreterPlanification() {
    if (this._intervalVerif) {
      clearInterval(this._intervalVerif);
      this._intervalVerif = null;
    }
  },

  // ════════════════════════════════════════════════════════
  // TEST
  // ════════════════════════════════════════════════════════
  async tester() {
    const autorisee = await this.demanderPermission();
    if (!autorisee) {
      Utils.toast('❌ Permission notifications refusée', 'error');
      return false;
    }

    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    await this.envoyer(
      '✅ Notifications PowerApp actives !',
      `${nom}, tu recevras tes rappels et notifications ici.`,
      { tag:'test' }
    );

    Utils.toast('🔔 Notification de test envoyée !', 'success');
    return true;
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  async init() {
    const config = this.getConfig();
    if (!config.active) return;

    const autorisee = await this.demanderPermission();
    if (autorisee) {
      this.planifierRappels();
      setTimeout(() => this.verifierAuLancement(),    4000);
      setTimeout(() => this._analyserRoutine(),        8000);
      setTimeout(() => this._verifierSeanceEnCours(), 12000);
      console.log('✅ Notifications v5.0 initialisées');
    } else {
      console.log('[Notifs] Permissions non accordées');
    }
  },

  // ════════════════════════════════════════════════════════
  // SMART IA
  // ════════════════════════════════════════════════════════
  _analyserRoutine() {
    try {
      const hist  = Tracker.getHistoriqueSeances(30);
      const heures = hist
        .filter(s => s.debut)
        .map(s => new Date(s.debut).getHours())
        .filter(h => !isNaN(h) && h >= 5 && h <= 23);

      if (heures.length < 3) return;

      const moy    = Math.round(
        heures.reduce((a,b) => a+b, 0) / heures.length
      );
      const config = this.getConfig();
      const hConf  = parseInt(
        (config.heureRappel||'07:30').split(':')[0]
      );

      if (Math.abs(moy - hConf) > 2) {
        const nouvelleHeure =
          `${String(Math.max(6, moy-1)).padStart(2,'0')}:00`;
        this.sauvegarderConfig({ heureRappel: nouvelleHeure });
        console.log(
          `[Notifs Smart] Heure rappel adaptée: ${nouvelleHeure}`
        );
      }
    } catch(e) {}
  },

  async verifierSurmenage() {
    try {
      const config  = this.getConfig();
      if (!config.active) return;

      const hist    = Tracker.getHistoriqueSeances(7);
      const seances = hist.length;

      if (seances >= 6) {
        let nom = 'Athlète';
        try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

        const cle = 'ft_notif_surmenage_' + Utils.aujourd_hui();
        if (Utils.storage.get(cle, false)) return;

        await this.envoyer(
          '⚠️ Attention au surmenage !',
          `${nom}, ${seances} séances en 7 jours. Ton corps a besoin de récupérer. Prends 1-2 jours de repos ! 🛌`,
          { tag:'surmenage', vibrate:[300,100,300] }
        );
        Utils.storage.set(cle, true);
      }
    } catch(e) {}
  },

  async verifierMilestoneXP() {
    try {
      const config = this.getConfig();
      if (!config.active) return;

      let xp = { total:0 };
      try { xp = Gamification.getXP(); } catch(e) { return; }

      const milestones = [500, 1000, 2500, 5000, 10000];
      for (const m of milestones) {
        const diff = m - xp.total;
        if (diff > 0 && diff <= 100) {
          const cle = `ft_notif_xp_${m}`;
          if (Utils.storage.get(cle, false)) continue;

          let nom = 'Athlète';
          try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

          await this.envoyer(
            `⭐ Plus que ${diff} XP !`,
            `${nom}, il te manque seulement ${diff} XP pour atteindre ${m} XP ! Une séance suffit ! 💪`,
            { tag:`milestone-xp-${m}` }
          );
          Utils.storage.set(cle, true);
          break;
        }
      }
    } catch(e) {}
  },

  async envoyerRappelPersonnalise() {
    try {
      const config = this.getConfig();
      if (!config.active || !config.rappelQuotidien) return;

      const planning = window.PLANNING_SEMAINE?.[
        Utils.indexJourSemaine(Utils.aujourd_hui())
      ];
      if (!planning?.seanceId) return;

      let seanceFaite = false;
      try {
        const sej   = Tracker.getSeanceDuJour?.();
        seanceFaite = sej?.complete || false;
      } catch(e) {}
      if (seanceFaite) return;

      const cle = 'ft_rappel_perso_' + Utils.aujourd_hui();
      if (Utils.storage.get(cle, false)) return;

      let nom = 'Athlète', seance = null;
      try { nom    = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
      try { seance = Programme.getSeanceduJour();          } catch(e) {}

      const streak = (() => {
        try { return Tracker.getStreak().count; } catch(e) { return 0; }
      })();

      let msg = this.getMessage('rappel_quotidien', { nom });
      if (seance) {
        msg += `\n${seance.emoji} ${seance.nom}`;
        if (streak > 0) msg += `\n🔥 Streak: ${streak} jours`;
      }

      await this.envoyer(
        `💪 ${nom}, ta séance t'attend !`,
        msg,
        {
          tag:'rappel-perso',
          actions: [
            { action:'go',    title:'▶ Démarrer !' },
            { action:'later', title:'⏰ Dans 1h'    }
          ]
        }
      );
      Utils.storage.set(cle, true);
    } catch(e) {}
  },

  async notifierComeback() {
    try {
      const config = this.getConfig();
      if (!config.active) return;

      const cle = 'ft_notif_comeback_' + Utils.aujourd_hui();
      if (Utils.storage.get(cle, false)) return;

      const vientDeRevenir = Utils.storage.get(
        'ft_comeback', false
      );
      if (!vientDeRevenir) return;

      let nom = 'Athlète', jours = 7;
      try { nom   = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
      try { jours = Tracker.getJoursAbsence();             } catch(e) {}

      await this.envoyer(
        `🎉 Bienvenue de retour ${nom} !`,
        `${jours} jours de pause, c'est du passé. Repars doucement, ton corps va vite retrouver ses sensations ! 💪`,
        {
          tag:'comeback',
          actions: [{ action:'go', title:'💪 C\'est reparti !' }]
        }
      );

      Utils.storage.set(cle, true);
      Utils.storage.remove('ft_comeback');
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // ✅ v5.0 — RENDER PAGE — Fix toggles _getContainer()
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-notifications')
      || document.getElementById('notifs-content')
      || document.getElementById('settings-notifications')
      || document.getElementById('page-content');
  },

  renderPage(container) {
    if (!container) return;

    const config = this.getConfig();
    const perm   = this.estAutorisee();

    container.innerHTML = `

      <!-- Permission status -->
      <div style="padding:14px 16px;
                  background:${perm
                    ? 'rgba(139,240,187,0.08)'
                    : 'rgba(255,141,150,0.08)'};
                  border:1px solid ${perm
                    ? 'rgba(139,240,187,0.25)'
                    : 'rgba(255,141,150,0.25)'};
                  border-radius:var(--radius-xl);
                  margin-bottom:14px;
                  display:flex;align-items:center;gap:12px">
        <div style="font-size:1.5rem">
          ${perm ? '✅' : '🔔'}
        </div>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:700">
            ${perm
              ? 'Notifications autorisées'
              : 'Notifications non autorisées'}
          </div>
          <div style="font-size:.65rem;color:var(--text-muted)">
            ${perm
              ? 'Tu recevras tes rappels et alertes'
              : 'Active les notifications pour ne rien manquer'}
          </div>
        </div>
        ${!perm ? `
          <button onclick="Notifications.demanderPermission()
            .then(ok => {
              if (ok) {
                Utils.toast('✅ Notifications activées!','success');
                const c = Notifications._getContainer();
                if (c) Notifications.renderPage(c);
              } else {
                Utils.toast('❌ Refusé dans les paramètres','error');
              }
            })"
                  class="btn-primary"
                  style="font-size:.72rem;flex-shrink:0">
            Activer
          </button>` : ''}
      </div>

      <!-- Active / Inactive global -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between">
          <div>
            <div style="font-size:.88rem;font-weight:700">
              🔔 Notifications PowerApp
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              Activer / désactiver toutes les notifications
            </div>
          </div>
          ${this._renderToggle('active', config.active)}
        </div>
      </div>

      <!-- TON -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:10px">
          💬 Ton des messages
        </div>
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);gap:6px">
          ${['motivant','doux','severe'].map(ton => `
            <button onclick="
              Notifications.sauvegarderConfig({ton:'${ton}'});
              document.querySelectorAll('.btn-ton').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.04)';
                b.style.borderColor = 'rgba(255,255,255,0.1)';
              });
              this.style.background = 'rgba(75,75,249,0.2)';
              this.style.borderColor = 'var(--fd-indigo)';
              Utils.toast('Ton ${ton} sélectionné','success',1500)"
                    class="btn-ton"
                    style="padding:10px 6px;text-align:center;
                           background:${config.ton === ton
                             ? 'rgba(75,75,249,0.2)'
                             : 'rgba(255,255,255,0.04)'};
                           border:1px solid ${config.ton === ton
                             ? 'var(--fd-indigo)'
                             : 'rgba(255,255,255,0.1)'};
                           border-radius:var(--radius-md);
                           cursor:pointer">
              <div style="font-size:1rem;margin-bottom:3px">
                ${ton === 'motivant' ? '🔥'
                : ton === 'doux'     ? '🌸' : '⚡'}
              </div>
              <div style="font-size:.68rem;font-weight:700;
                          color:${config.ton === ton
                            ? 'var(--fd-indigo)'
                            : 'var(--text-muted)'}">
                ${ton === 'motivant' ? 'Motivant'
                : ton === 'doux'     ? 'Doux' : 'Sévère'}
              </div>
            </button>`).join('')}
        </div>
      </div>

      <!-- HEURE RAPPEL -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;align-items:center;
                    justify-content:space-between">
          <div>
            <div style="font-size:.82rem;font-weight:700">
              🕐 Heure du rappel quotidien
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Adapté automatiquement selon tes habitudes
            </div>
          </div>
          <input type="time"
                 value="${config.heureRappel || '07:30'}"
                 onchange="Notifications.sauvegarderConfig(
                   {heureRappel:this.value});
                   Utils.toast('⏰ Heure mise à jour','success',1500)"
                 style="padding:8px;background:var(--bg-input);
                        border:1px solid var(--border-color);
                        border-radius:var(--radius-md);
                        color:var(--text-primary);
                        font-size:.82rem"/>
        </div>
      </div>

      <!-- TYPES DE NOTIFS -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          📋 Types de notifications
        </div>
        ${[
          {
            cle:'rappelQuotidien',
            label:'🌅 Rappel quotidien',
            desc:'Séance du jour'
          },
          {
            cle:'absence1j',
            label:'💪 Absence 1 jour',
            desc:'Si tu n\'as pas traîné'
          },
          {
            cle:'absence2j',
            label:'🔥 Absence 2 jours',
            desc:'Relance urgente'
          },
          {
            cle:'absence5j',
            label:'😢 Absence longue',
            desc:'5+ jours sans séance'
          },
          {
            cle:'streakDanger',
            label:'⚠️ Streak en danger',
            desc:'Fin de journée'
          },
          {
            cle:'motivationMatin',
            label:'🌟 Motivation matin',
            desc:'Citation du jour'
          },
          {
            cle:'prProche',
            label:'📈 PR en vue',
            desc:'Record accessible'
          },
          {
            cle:'nouveauPR',
            label:'🏆 Nouveau PR',
            desc:'Record battu'
          },
          {
            cle:'finSeance',
            label:'✅ Fin de séance',
            desc:'Résumé post-séance'
          },
          {
            cle:'semaineParf',
            label:'🏆 Semaine parfaite',
            desc:'Objectif semaine atteint'
          },
          {
            cle:'decharge',
            label:'😴 Semaine de décharge',
            desc:'Rappel décharge'
          },
          {
            cle:'hydratation',
            label:'💧 Rappel hydratation',
            desc:'Toutes les 2h'
          },
          {
            cle:'surcharge',
            label:'⚠️ Surcharge musculaire',
            desc:'Alerte récupération'
          },
          // ✅ NOUVEAU v5.0
          {
            cle:'levelUp',
            label:'⭐ Nouveau niveau XP',
            desc:'Level Up atteint'
          }
        ].map(n => `
          <div style="display:flex;align-items:center;
                      justify-content:space-between;
                      padding:8px 0;
                      border-bottom:1px solid
                        rgba(255,255,255,0.06)">
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:600">
                ${n.label}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${n.desc}
              </div>
            </div>
            ${this._renderToggle(n.cle, config[n.cle])}
          </div>`).join('')}
      </div>

      <!-- SON + VIBRATION -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          🔊 Son & Vibration
        </div>
        ${[
          { cle:'son',       label:'🔊 Son',       desc:'Sons de notification' },
          { cle:'vibration', label:'📳 Vibration', desc:'Retour haptique'      }
        ].map(n => `
          <div style="display:flex;align-items:center;
                      justify-content:space-between;
                      padding:8px 0;
                      border-bottom:1px solid
                        rgba(255,255,255,0.06)">
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:600">
                ${n.label}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${n.desc}
              </div>
            </div>
            ${this._renderToggle(n.cle, config[n.cle])}
          </div>`).join('')}
      </div>

      <!-- ACTIONS -->
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:8px;margin-bottom:14px">
        <button onclick="Notifications.tester()"
                class="btn-secondary" style="font-size:.82rem">
          🔔 Tester
        </button>
        <button onclick="Notifications._resetNotifsJour();
                         Utils.toast('✅ Réinitialisé','success')"
                class="btn-secondary" style="font-size:.82rem">
          🔄 Reset aujourd'hui
        </button>
      </div>

      <!-- Stats du jour -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:8px">
          📊 Statut aujourd'hui
        </div>
        ${Object.entries(this.getStatsDuJour()).map(([k,v]) => `
          <div style="display:flex;justify-content:space-between;
                      padding:4px 0;font-size:.72rem">
            <span style="color:var(--text-muted)">${k}</span>
            <span style="color:${v
              ? 'var(--fd-mint)' : 'var(--text-muted)'}">
              ${v ? '✅ Envoyé' : '⏳ En attente'}
            </span>
          </div>`).join('')}
      </div>
    `;
  },

  // ✅ v5.0 — _renderToggle Fix _getContainer()
  _renderToggle(cle, valeur) {
    return `
      <div onclick="(() => {
               const v = !${valeur ? 'true' : 'false'};
               Notifications.sauvegarderConfig({${cle}: v});
               Utils.toast(
                 v ? '✅ Activé' : '❌ Désactivé',
                 'success', 1000
               );
               const c = Notifications._getContainer();
               if (c) Notifications.renderPage(c);
             })()"
           style="position:relative;width:48px;height:26px;
                  cursor:pointer;flex-shrink:0">
        <div style="position:absolute;inset:0;
                    background:${valeur
                      ? 'var(--fd-indigo)'
                      : 'rgba(255,255,255,0.1)'};
                    border:2px solid ${valeur
                      ? 'var(--fd-indigo)'
                      : 'rgba(255,255,255,0.2)'};
                    border-radius:99px;
                    transition:all .25s">
        </div>
        <div style="position:absolute;top:50%;
                    left:${valeur ? '24px' : '2px'};
                    transform:translateY(-50%);
                    width:18px;height:18px;
                    background:${valeur
                      ? 'white' : 'rgba(255,255,255,0.4)'};
                    border-radius:50%;
                    transition:left .25s;
                    pointer-events:none">
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // UTILITAIRES
  // ════════════════════════════════════════════════════════
  getStatsDuJour() {
    const today = Utils.aujourd_hui();
    const stats = {};
    [
      'ft_rappel_',
      'ft_motiv_',
      'ft_verif_pr_',
      'ft_notif_semaine_parf_',
      'ft_notif_decharge_',
      'ft_notif_surcharge_'
    ].forEach(cle => {
      stats[
        cle.replace('ft_','').replace(/_/g,' ').trim()
      ] = Utils.storage.get(cle + today, false);
    });
    return stats;
  },

  _resetNotifsJour() {
    const today = Utils.aujourd_hui();
    [
      'ft_rappel_',
      'ft_motiv_',
      'ft_verif_pr_',
      'ft_notif_semaine_parf_',
      'ft_notif_decharge_',
      'ft_notif_surcharge_'
    ].forEach(cle => Utils.storage.remove(cle + today));
    Utils.toast('Notifs du jour réinitialisées', 'info');
  }
};

window.Notifications = Notifications;
console.log(
  '✅ Notifications v5.0 chargé'
  + ' — Fix toggles + LevelUp + fin_repos + genre-aware'
);
