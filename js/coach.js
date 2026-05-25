/* ============================================================
   PowerApp — Coach IA v5.0
   Messages + Chat + Analyse + Programme IA Auto-généré
   + Genre / Lieu / Muscles onboarding
   + Message post-séance enrichi
   + Suggestion remplacement exercice
   + Heatmap musculaire dans chat
   + Blessures actives v4.0
   ============================================================ */

const Coach = {

  // ════════════════════════════════════════════════════════
  // HISTORIQUE CHAT
  // ════════════════════════════════════════════════════════
  get _historique() {
    return window._coachHistorique
      || (window._coachHistorique = []);
  },
  set _historique(val) {
    window._coachHistorique = val;
  },

  _salutation() {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  },

  // ✅ NOUVEAU v5.0 — Récupérer profil onboarding
  _getProfilOnboarding() {
    try {
      return Utils.storage.get('ft_profil_onboarding', {
        genre:          'homme',
        lieu:           'salle',
        muscles_cibles: [],
        objectif:       'forme',
        niveau:         'intermediaire',
        nom:            'Athlète'
      });
    } catch(e) {
      return {
        genre:'homme', lieu:'salle',
        muscles_cibles:[], objectif:'forme',
        niveau:'intermediaire', nom:'Athlète'
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // MESSAGE DU JOUR
  // ════════════════════════════════════════════════════════
  getMessageDuJour() {
    let humeur = null, fatigue = null;
    let rpe = 0, absence = -1;
    let infos  = { phase:{ nom:'Reprise', emoji:'💡' } };
    let streak = { count:0, max:0 };
    let nom = 'Athlète', total = 0;
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre || 'homme';

    try { humeur  = Tracker.getHumeur();                  } catch(e) {}
    try { fatigue = Tracker.getFatigue();                 } catch(e) {}
    try { rpe     = Tracker.getRPEMoyen7Jours();          } catch(e) {}
    try { absence = Tracker.getJoursAbsence();            } catch(e) {}
    try { infos   = Programme.getInfosProgramme();        } catch(e) {}
    try { streak  = Tracker.getStreak();                  } catch(e) {}
    try { nom     = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { total   = Tracker.getTotalSeances();            } catch(e) {}

    // ✅ NOUVEAU — Message post-séance du jour
    try {
      const seanceDuJour = Tracker.getSeanceDuJour();
      if (seanceDuJour?.complete) {
        const prs = seanceDuJour.prs || [];
        if (prs.length > 0) {
          const ex = window.EXERCICES?.[prs[0].exerciceRef];
          return {
            type: 'pr', emoji: '🏆',
            message: `INCROYABLE ${nom} ! Tu as battu ton record sur ${ex?.nom || prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! ${prs.length > 1 ? `Et ${prs.length - 1} autre(s) PR ce soir !` : ''} 🎉`
          };
        }
        return {
          type: 'seance_faite', emoji: '✅',
          message: `Séance terminée ${nom} ! ${seanceDuJour.volumeTotal ? `${Utils.formatVolume(seanceDuJour.volumeTotal)} de volume aujourd'hui.` : ''} Récupère bien 💪`
        };
      }
    } catch(e) {}

    if (absence === -1 || total === 0) {
      const msgs = genre === 'femme' ? [
        `Bienvenue ${nom} ! C'est ta première séance — prends le temps de trouver tes sensations. 🌸`,
        `Hey ${nom} ! Prête pour l'aventure ? Ta première séance commence ici. 💪`,
        `${nom}, bienvenue dans PowerApp ! Aujourd'hui marque le début de quelque chose d'exceptionnel. ✨`
      ] : [
        `Bienvenue ${nom} ! C'est ta première séance — profites-en pour trouver tes sensations.`,
        `Hey ${nom} ! Prêt pour l'aventure ? Ta première séance commence ici.`,
        `${nom}, bienvenue dans PowerApp ! Aujourd'hui marque le début de quelque chose de grand.`
      ];
      return { type:'bienvenue', emoji:'👋', message:Utils.random(msgs) };
    }

    if (absence >= 7) {
      return {
        type:'reprise', emoji:'🌱',
        message: Utils.random(genre === 'femme' ? [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges. 🌸`,
          `Te revoilà ${nom} ! On ne juge pas les pauses, on célèbre les retours. Commence doucement. 💪`
        ] : [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges.`,
          `Te revoilà ${nom} ! On ne juge pas les pauses, on célèbre les retours. Commence doucement.`
        ])
      };
    }

    if (absence >= 3) {
      return {
        type:'relance', emoji:'🔥',
        message: Utils.random([
          `Te revoilà ${nom} ! Quelques jours de pause, ça arrive. Le premier set est toujours le plus dur.`,
          `${nom} de retour ! Le corps attendait ça. Une séance même courte remet tout en route.`
        ])
      };
    }

    if (rpe > 0 && rpe >= 8.5) {
      return {
        type:'deload', emoji:'⚡',
        message: `RPE moyen ${rpe}/10 ${nom}. Ton corps envoie un signal. Aujourd'hui : -40% charges, technique parfaite.`
      };
    }

    if ((fatigue?.niveau || 0) >= 3) {
      return {
        type:'fatigue', emoji:'😴',
        message: Utils.random([
          `Tu te sens épuisé${genre === 'femme' ? 'e' : ''} ${nom} — écoute ton corps : technique parfaite sur charges modérées.`,
          `Fatigue détectée ${nom}. Charges à -20%, concentration sur la qualité.`
        ])
      };
    }

    if (['😒','😤'].includes(humeur?.humeur)) {
      return {
        type:'motivation', emoji:'💡',
        message: Utils.random([
          `Pas dans ton assiette ${nom} ? Les meilleures séances arrivent parfois quand on s'y attend le moins.`,
          `${nom}, les champion${genre === 'femme' ? 'nes' : 's'} s'entraînent aussi quand ils n'en ont pas envie. C'est là que la différence se fait.`
        ])
      };
    }

    if (humeur?.humeur === '🔥' && (fatigue?.niveau || 0) <= 1) {
      return {
        type:'peak', emoji:'🚀',
        message: Utils.random([
          `Tu es en feu ${nom} ! Corps frais, mental affûté — c'est le moment de tenter un PR !`,
          `${nom} en mode peak ! Tout est réuni pour une séance exceptionnelle. Vas chercher un record.`
        ])
      };
    }

    try {
      if (Programme.isDecharge()) {
        return {
          type:'decharge', emoji:'😴',
          message: `Semaine de décharge ${nom} ! Charges à 55%, focus technique. Ton corps va supercompenser.`
        };
      }
    } catch(e) {}

    if (streak.count >= 14) {
      return {
        type:'streak', emoji:'🏆',
        message: `${streak.count} jours consécutifs ${nom} — c'est impressionnant ! Continue sur cette lancée.`
      };
    }

    // ✅ NOUVEAU — Message adapté muscles ciblés
    const muscles = profil.muscles_cibles || [];
    if (muscles.length > 0) {
      const labels = {
        pectoraux:'pectoraux', deltoides:'épaules',
        biceps:'biceps', triceps:'triceps',
        abdominaux:'abdos', quadriceps:'quadriceps',
        dorsal:'dos', fessiers:'fessiers',
        ischio:'ischio-jambiers', mollets:'mollets'
      };
      const musclesNoms = muscles.slice(0,2)
        .map(m => labels[m] || m).join(' et ');
      return {
        type:'muscles_cibles', emoji:'🎯',
        message: `Aujourd'hui ${nom}, on attaque ${musclesNoms} ! Focus sur tes zones prioritaires. 💪`
      };
    }

    const msgs = {
      'Reprise':      [`Phase Reprise ${nom} : la technique prime sur tout.`],
      'Construction': [`Phase Construction ${nom} : cherche à dépasser le volume de la semaine dernière.`],
      'Intensité':    [`Phase Intensité ${nom} : charges lourdes, concentration maximale. PRs en vue.`],
      'Peak':         [`Phase Peak ${nom} : tu as accumulé des semaines de travail pour ça. Donne tout.`],
      'Décharge':     [`Semaine de décharge ${nom}. Laisse le corps assimiler.`]
    };

    const phase = infos.phase?.nom || 'Reprise';
    return {
      type:    'programme',
      emoji:   infos.phase?.emoji || '💡',
      message: Utils.random(msgs[phase] || msgs['Reprise'])
    };
  },

  // ════════════════════════════════════════════════════════
  // COACH IA CHAT
  // ════════════════════════════════════════════════════════
  async envoyerMessage(question) {
    let nom = 'Athlète', seances = 0;
    let streak  = { count:0 }, absence = -1;
    let rpe = 0, fatigue = null, humeur = null;
    let prs = {}, phase = { phase:{ nom:'Reprise' } };
    let volume = 0;
    const profil = this._getProfilOnboarding();

    try { nom     = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { seances = Tracker.getTotalSeances();             } catch(e) {}
    try { streak  = Tracker.getStreak();                  } catch(e) {}
    try { absence = Tracker.getJoursAbsence();            } catch(e) {}
    try { rpe     = Tracker.getRPEMoyen7Jours();          } catch(e) {}
    try { fatigue = Tracker.getFatigue();                 } catch(e) {}
    try { humeur  = Tracker.getHumeur();                  } catch(e) {}
    try { prs     = Tracker.getAllPRs();                  } catch(e) {}
    try { phase   = Programme.getInfosProgramme();        } catch(e) {}
    try { volume  = Tracker.getVolumeSemaine();           } catch(e) {}

    const ctx = {
      nom,
      seancesTotales: seances,
      streak:         streak.count,
      joursAbsence:   absence === -1 ? 'jamais' : `${absence} jours`,
      rpe:            rpe > 0 ? `${rpe}/10` : 'aucune donnée',
      fatigue:        fatigue ? `niveau ${fatigue.niveau}/4` : 'non renseignée',
      humeur:         humeur?.humeur || 'non renseignée',
      phase:          phase?.phase?.nom || 'Reprise',
      volume:         Utils.formatVolume(volume),
      nbPRs:          Object.keys(prs).length,
      // ✅ NOUVEAU v5.0 — Contexte onboarding
      genre:          profil.genre          || 'homme',
      lieu:           profil.lieu           || 'salle',
      muscles:        profil.muscles_cibles || [],
      objectif:       profil.objectif       || 'forme',
      niveau:         profil.niveau         || 'intermediaire'
    };

    // ✅ NOUVEAU — Détecter intention "remplacer exercice"
    if (q => q.includes('remplace') || q.includes('alternative') ||
         q.includes('substitut') || q.includes('à la place')) {
      if (question.toLowerCase().includes('remplace')
          || question.toLowerCase().includes('alternative')
          || question.toLowerCase().includes('substitut')
          || question.toLowerCase().includes('à la place')) {
        return this._raisonnerRemplacement(
          question.toLowerCase(), ctx
        );
      }
    }

    if (question.toLowerCase().includes('génère') ||
        question.toLowerCase().includes('crée') ||
        question.toLowerCase().includes('nouveau programme') ||
        question.toLowerCase().includes('programme ia') ||
        question.toLowerCase().includes('générer')) {
      setTimeout(() => {
        Coach.ProgrammeIA._modeQuestionnaire = true;
        Coach.ProgrammeIA._etapeActuelle     = 0;
        Coach.ProgrammeIA._reponses          = {};
        naviguer('adaptatif');
      }, 800);
      return `Je lance le questionnaire pour toi ${nom} ! 🧠\n\nRéponds aux questions et ton programme sur mesure sera généré instantanément !`;
    }

    const reponse = this._raisonnerIA(
      question.toLowerCase(), ctx, prs
    );

    const hist = this._historique;
    hist.push(
      { role:'user',      content:question },
      { role:'assistant', content:reponse  }
    );
    if (hist.length > 30) hist.splice(0, hist.length - 30);
    this._historique = hist;

    return reponse;
  },

  // ✅ NOUVEAU v5.0 — Raisonnement remplacement exercice
  _raisonnerRemplacement(q, ctx) {
    const nom  = ctx.nom;
    const lieu = ctx.lieu || 'salle';

    // Essayer de détecter l'exercice mentionné
    const exoMentionne = Object.entries(window.EXERCICES || {})
      .find(([,ex]) => q.includes(ex.nom.toLowerCase()));

    if (exoMentionne) {
      const [ref, exo] = exoMentionne;
      try {
        const similaires = window.ExercicesFilter
          ?.getSimilaires(ref, lieu) || [];
        if (similaires.length > 0) {
          const liste = similaires.slice(0,4)
            .map(s => `  • ${s.emoji} ${s.nom}`)
            .join('\n');
          return `Alternatives pour **${exo.nom}** (${lieu}) ${nom} :\n\n${liste}\n\nTous ciblent le même muscle. 💪`;
        }
      } catch(e) {}
      return `Je n'ai pas trouvé d'alternatives disponibles pour ${exo.nom} ${nom}. Essaie de préciser ton équipement.`;
    }

    return `Quel exercice veux-tu remplacer ${nom} ? Précise le nom et je te propose des alternatives adaptées à ${lieu === 'salle' ? 'la salle' : lieu === 'maison' ? 'la maison' : 'l\'extérieur'} ! 💪`;
  },

  _raisonnerIA(q, ctx, prs = {}) {
    const nom    = ctx.nom;
    const genre  = ctx.genre  || 'homme';
    const lieu   = ctx.lieu   || 'salle';
    const muscles = ctx.muscles || [];

    // ✅ PRs / Records
    if (q.includes('pr') || q.includes('record') ||
        q.includes('max') || q.includes('meilleur')) {
      const top = Object.entries(prs)
        .filter(([,v]) => v.rm1 > 0)
        .sort((a,b) => (b[1].rm1||0) - (a[1].rm1||0))
        .slice(0, 5)
        .map(([ref, pr]) => {
          const ex = window.EXERCICES?.[ref];
          return `  • ${ex?.nom||ref}: ${pr.poids}kg × ${pr.reps} (~${pr.rm1}kg 1RM)`;
        });
      if (!top.length)
        return `Tu n'as pas encore de records enregistrés ${nom}. Lance ta première séance !`;
      return `Tes meilleurs records ${nom} 🏆\n\n${top.join('\n')}\n\n${ctx.nbPRs} records au total 💪`;
    }

    // ✅ Fatigue / Récupération
    if (q.includes('fatigu') || q.includes('récup') ||
        q.includes('repos')  || q.includes('douleur') ||
        q.includes('mal')    || q.includes('épuisé')) {
      if (ctx.rpe !== 'aucune donnée' && parseFloat(ctx.rpe) >= 8) {
        return `Ton RPE moyen est de ${ctx.rpe} — c'est élevé ${nom} ⚠️\n\nConseils :\n  • -30-40% charges\n  • Prioriser le sommeil (7-9h)\n  • Augmenter les protéines\n  • 1 séance légère max\n\nLa récupération = progression !`;
      }
      return `La récupération est la moitié de l'entraînement ${nom} :\n\n  • 48h entre groupes musculaires\n  • 7-9h de sommeil\n  • Hydratation : 35ml/kg/jour\n  • Protéines : 1.6-2.2g/kg\n\nTon corps se construit au repos 💤`;
    }

    // ✅ Programme / Séance du jour
    if (q.includes('programme') || q.includes('plan') ||
        q.includes('séance')    || q.includes('aujourd') ||
        q.includes('faire')     || q.includes('entraîn')) {
      const phaseMsg = {
        'Reprise':      '🌱 Focus technique. Charges légères, mouvements parfaits.',
        'Construction': '🏗️ Volume élevé. +2.5kg dès que tu complètes toutes les séries.',
        'Intensité':    '💥 Charges lourdes, faible volume. Priorité aux compound.',
        'Peak':         '🏆 Charges maximales — semaine des records !',
        'Décharge':     '😴 Charges légères 55%. Récupération et technique.'
      };

      // ✅ NOUVEAU — Contexte muscles ciblés
      const musclesCtx = muscles.length > 0
        ? `\n\nMuscles ciblés : ${muscles.join(', ')}`
        : '';

      return `Tu es en phase **${ctx.phase}** ${nom}.\n\n${phaseMsg[ctx.phase]||phaseMsg['Reprise']}${musclesCtx}\n\nVolume cette semaine : ${ctx.volume}\nStreak : ${ctx.streak} jours 🔥\nLieu : ${lieu === 'salle' ? '🏋️ Salle' : lieu === 'maison' ? '🏠 Maison' : '🌳 Dehors'}`;
    }

    // ✅ Nutrition — adaptée genre + objectif
    if (q.includes('manger')   || q.includes('nutrition') ||
        q.includes('protéine') || q.includes('calorie')   ||
        q.includes('régime')   || q.includes('nourriture')) {
      let poids = 80;
      try { poids = Tracker.getProfil().poids || 80; } catch(e) {}

      // ✅ Ajustement selon genre
      const facteurGenre = genre === 'femme' ? 0.85 : 1;
      const prot = Math.round(poids * 2 * facteurGenre);
      const cal  = Math.round(poids * (genre === 'femme' ? 30 : 35));
      const eau  = (poids * 0.035).toFixed(1);

      const objMsg = {
        prise_masse: `\n  • Surplus : +300kcal/jour`,
        perte_poids: `\n  • Déficit : -300kcal/jour`,
        seche:       `\n  • Déficit : -400kcal/jour, glucides bas`,
        force:       `\n  • Légère surplus : +200kcal`,
        endurance:   `\n  • Glucides hauts : 5-7g/kg`
      }[ctx.objectif] || '';

      return `Recommandations pour toi ${nom} (${poids}kg${genre === 'femme' ? ' 🌸' : ''}) 🥗\n\n  • Protéines : ${prot}g/jour\n  • Calories : ~${cal} kcal/jour${objMsg}\n  • Eau : ${eau}L minimum\n  • Repas 2-3h avant séance\n  • Post-séance : prot + gluc dans 30min 🎯`;
    }

    // ✅ Motivation
    if (q.includes('motiv')   || q.includes('envie')    ||
        q.includes('abandon') || q.includes('dur')      ||
        q.includes('difficile')|| q.includes('arrêt')) {
      const msgs = genre === 'femme' ? [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais. 🌸\n\n"Le seul mauvais entraînement est celui qui n'a pas eu lieu."`,
        `Les jours difficiles font les athlètes durables ${nom}. Une séance à 50% vaut mieux que zéro.\n\nStreak de ${ctx.streak} jours — tu n'es pas du genre à abandonner. 💪`
      ] : [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais.\n\n"Le seul mauvais entraînement est celui qui n'a pas eu lieu."`,
        `Les jours difficiles font les athlètes durables ${nom}. Une séance à 50% vaut mieux que zéro.\n\nStreak de ${ctx.streak} jours — tu n'es pas du genre à abandonner.`
      ];
      return Utils.random(msgs);
    }

    // ✅ Streak
    if (q.includes('streak') || q.includes('consécutif') ||
        q.includes('régularité')) {
      if (ctx.streak === 0)
        return `Ton streak est à 0 ${nom}. Une séance aujourd'hui et c'est parti 🔥`;
      const qualif = ctx.streak >= 21 ? 'exceptionnel — top 1%'
                   : ctx.streak >= 14 ? 'excellent'
                   : ctx.streak >= 7  ? 'très bien'
                   : 'un bon début';
      return `Ton streak : **${ctx.streak} jours** 🔥\n\nC'est ${qualif} ${nom} ! Continue 💪`;
    }

    // ✅ NOUVEAU v5.0 — Muscles / Heatmap
    if (q.includes('muscle')   || q.includes('heatmap') ||
        q.includes('volume')   || q.includes('répartition') ||
        q.includes('travaill') || q.includes('cibl')) {
      try {
        const volumeParMuscle = Tracker.getVolumeParMuscle(7);
        if (volumeParMuscle.length > 0) {
          const top3 = volumeParMuscle.slice(0,3)
            .map(m => `  • ${m.muscle} : ${m.pourcentage}% d'intensité (${m.intensite})`);
          const negliges = volumeParMuscle
            .filter(m => m.intensite === 'faible').slice(0,2)
            .map(m => `  • ${m.muscle}`);
          let msg = `Analyse musculaire cette semaine ${nom} 💪\n\nPlus travaillés :\n${top3.join('\n')}`;
          if (negliges.length > 0) {
            msg += `\n\nÀ ne pas négliger :\n${negliges.join('\n')}`;
          }
          if (muscles.length > 0) {
            msg += `\n\n🎯 Tes zones prioritaires : ${muscles.join(', ')}`;
          }
          return msg;
        }
      } catch(e) {}
      return `Fais quelques séances pour voir l'analyse musculaire ${nom} ! Je pourrai te dire quels muscles sont les plus travaillés. 💪`;
    }

    // ✅ NOUVEAU v5.0 — Surcharge / Blessure
    if (q.includes('surcharge') || q.includes('blessure') ||
        q.includes('éviter')    || q.includes('danger')) {
      try {
        const surcharge = Tracker.getSurchargeMusculaire();
        const blessures = Tracker.getBlessuresActives();

        let msg = '';

        if (surcharge.length > 0) {
          const alertes = surcharge.map(s =>
            `  ⚠️ ${s.muscle} : ${s.conseil}`
          ).join('\n');
          msg += `Surcharge musculaire détectée ${nom} :\n\n${alertes}\n\n`;
        }

        if (blessures.length > 0) {
          const bMsg = blessures.map(b =>
            `  🚫 ${b.zone} (${b.severite})\n    Éviter : ${(b.exercicesAEviter||[]).slice(0,3).join(', ')}\n    OK : ${(b.alternativesOK||[]).slice(0,2).join(', ')}`
          ).join('\n');
          msg += `Blessures actives :\n\n${bMsg}`;
        }

        if (!msg) {
          return `Aucune surcharge ni blessure active détectée ${nom}. Tu peux y aller à fond ! 💪`;
        }

        return msg.trim();
      } catch(e) {}
      return `Je n'ai pas assez de données pour analyser les risques ${nom}. Fais quelques séances et enregistre tes blessures éventuelles.`;
    }

    // ✅ NOUVEAU v5.0 — Lieu d'entraînement
    if (q.includes('maison') || q.includes('salle') ||
        q.includes('dehors') || q.includes('extérieur') ||
        q.includes('équipement')) {
      try {
        const exosDispo = window.ExercicesFilter
          ?.parLieu(lieu) || {};
        const nbExos    = Object.keys(exosDispo).length;
        const lieuLabel = lieu === 'salle' ? '🏋️ Salle'
                        : lieu === 'maison' ? '🏠 Maison'
                        : '🌳 Extérieur';
        return `Pour ton lieu d'entraînement : ${lieuLabel} ${nom}\n\n  • ${nbExos} exercices disponibles\n  • Programme adapté à ton équipement\n\nVeux-tu que je génère un programme spécial ${lieuLabel} ? Dis "génère un programme" ! 🎯`;
      } catch(e) {}
    }

    // ✅ Bonjour / Accueil
    if (q.includes('bonjour') || q.includes('salut') ||
        q.includes('hello')   || q.includes('hey')   ||
        q.includes('coucou')  || q.includes('bonsoir')) {
      const lieuLabel = lieu === 'salle' ? '🏋️ salle'
                      : lieu === 'maison' ? '🏠 maison'
                      : '🌳 dehors';
      return `${this._salutation()} ${nom} ! ${genre === 'femme' ? '🌸' : '👋'}\n\nJe suis ton Coach IA PowerApp.\n\nJe peux t'aider avec :\n  💪 Tes records\n  📅 Séance du jour (${lieuLabel})\n  🥗 Nutrition\n  😴 Fatigue\n  🔥 Motivation\n  💪 Muscles ciblés\n  🧠 Générer un programme\n\nDe quoi as-tu besoin ? 🎯`;
    }

    return Utils.random([
      `${nom} — je peux t'aider sur :\n  💪 Records / PRs\n  📈 Volume / Programme\n  😴 Récupération\n  🥗 Nutrition\n  🔥 Motivation\n  💪 Muscles ciblés\n  🧠 Générer un programme IA\n\nPrécise ! 🎯`,
      `Pour te donner les meilleurs conseils ${nom}, dis-moi ce que tu cherches : force, volume, récupération, nutrition ou programme ?`
    ]);
  },

  // ════════════════════════════════════════════════════════
  // PROGRAMME IA
  // ════════════════════════════════════════════════════════
  ProgrammeIA: {

    CLE:        'ft_programme_ia_config',
    CLE_GENERE: 'ft_programme_ia_genere',

    ETAPES: [
      {
        id:    'objectif',
        titre: '🎯 Quel est ton objectif principal ?',
        type:  'choix_unique',
        options: [
          { val:'prise_masse', label:'💪 Prise de masse', desc:'Grossir et muscler'    },
          { val:'seche',       label:'🔥 Sèche',          desc:'Perdre du gras'        },
          { val:'force',       label:'🏋️ Force pure',      desc:'Soulever plus lourd'  },
          { val:'forme',       label:'✨ Forme générale',  desc:'Rester en bonne santé'},
          { val:'endurance',   label:'🏃 Endurance',       desc:'Cardio et résistance' }
        ]
      },
      {
        id:    'niveau',
        titre: '📊 Quel est ton niveau ?',
        type:  'choix_unique',
        options: [
          { val:'debutant',      label:'🌱 Débutant',      desc:'Moins de 6 mois'},
          { val:'intermediaire', label:'💪 Intermédiaire', desc:'6 mois — 2 ans' },
          { val:'avance',        label:'🔥 Avancé',        desc:'Plus de 2 ans'  }
        ]
      },
      {
        id:    'jours',
        titre: '📅 Combien de jours par semaine ?',
        type:  'choix_unique',
        options: [
          { val:'3', label:'3 jours', desc:'Lun / Mer / Ven'       },
          { val:'4', label:'4 jours', desc:'Lun / Mar / Jeu / Ven' },
          { val:'5', label:'5 jours', desc:'Lun à Ven'             },
          { val:'6', label:'6 jours', desc:'Lun à Sam'             }
        ]
      },
      {
        id:        'jours_specifiques',
        titre:     '📆 Quels jours tu t\'entraînes ?',
        type:      'jours_semaine',
        desc:      'Sélectionne tes jours (optionnel)',
        optionnel: true
      },
      {
        id:    'style',
        titre: '🏋️ Quel style de programme ?',
        type:  'choix_unique',
        options: [
          { val:'ppl',         label:'⚡ Push / Pull / Legs', desc:'Classique et efficace'      },
          { val:'full_body',   label:'🔄 Full Body',          desc:'Tout le corps chaque séance' },
          { val:'upper_lower', label:'↕️ Upper / Lower',      desc:'Haut et bas alternés'        },
          { val:'auto',        label:'🧠 IA choisit',         desc:'Selon ton profil'            }
        ]
      },
      {
        id:    'equipement',
        titre: '🏗️ Quel équipement as-tu ?',
        type:  'choix_multiple',
        options: [
          { val:'barre',       label:'🏋️ Barre + poids'  },
          { val:'halteres',    label:'💪 Haltères'        },
          { val:'machines',    label:'🤖 Machines salle'  },
          { val:'cables',      label:'🔄 Câbles'          },
          { val:'poids_corps', label:'🧘 Poids du corps'  },
          { val:'rack',        label:'🏗️ Rack à squat'    }
        ]
      },
      {
        id:    'duree',
        titre: '⏱ Durée de séance souhaitée ?',
        type:  'choix_unique',
        options: [
          { val:'45', label:'45 min', desc:'Express'           },
          { val:'60', label:'1 heure',desc:'Standard'          },
          { val:'75', label:'1h15',   desc:'Complet'           },
          { val:'90', label:'1h30',   desc:'Entraînement long' }
        ]
      }
    ],

    get _etapeActuelle() { return window._piaEtape || 0; },
    set _etapeActuelle(v) { window._piaEtape = v; },

    get _reponses() {
      return window._piaReponses
        || (window._piaReponses = {});
    },
    set _reponses(v) { window._piaReponses = v; },

    get _modeQuestionnaire() { return window._piaModeQ || false; },
    set _modeQuestionnaire(v) { window._piaModeQ = v; },

    getConfig()  { return Utils.storage.get(this.CLE, null);        },
    getGenere()  { return Utils.storage.get(this.CLE_GENERE, null); },

    sauvegarderConfig(config) {
      Utils.storage.set(this.CLE, config);
    },
    sauvegarderGenere(programme) {
      Utils.storage.set(this.CLE_GENERE, programme);
    },

    _getContainer() {
      return document.getElementById('page-adaptatif')
        || document.getElementById('stats-content')
        || document.querySelector('.page.active');
    },

    // ════════════════════════════════════════════════════
    // GÉNÉRATION
    // ════════════════════════════════════════════════════
    generer(reponses) {
      const {
        objectif          = 'prise_masse',
        niveau            = 'intermediaire',
        jours             = '4',
        jours_specifiques = null,
        style             = 'auto',
        equipement        = ['barre','halteres','machines','cables'],
        duree             = '60'
      } = reponses;

      const nbJours  = parseInt(jours);
      const dureeMin = parseInt(duree);

      // ✅ NOUVEAU v5.0 — Récupérer genre + lieu onboarding
      let genre = 'homme', lieu = 'salle';
      try {
        const profil = Utils.storage.get(
          'ft_profil_onboarding', {}
        );
        genre = profil.genre || 'homme';
        lieu  = profil.lieu  || 'salle';
      } catch(e) {}

      const styleChoisi = style === 'auto'
        ? this._choisirStyleAuto(objectif, nbJours, niveau, genre)
        : style;

      const seances = this._genererSeances(
        styleChoisi, objectif, niveau,
        nbJours, dureeMin, equipement, genre, lieu
      );

      const planning = this._genererPlanning(
        seances, nbJours, jours_specifiques
      );

      const conseils = this._genererConseils(
        objectif, niveau, styleChoisi, genre
      );

      const programme = {
        id:           'ia_' + Date.now(),
        dateCreation: Utils.aujourd_hui(),
        config:       reponses,
        style:        styleChoisi,
        styleLabel:   this._styleLabel(styleChoisi),
        objectif, niveau, nbJours, dureeMin,
        genre, lieu,
        seances, planning, conseils,
        version:      'IA v2.0'
      };

      this.sauvegarderConfig(reponses);
      this.sauvegarderGenere(programme);
      this._enregistrerSeances(seances);
      this._appliquerPlanning(planning);

      // ✅ NOUVEAU — Appliquer planning genre/lieu
      try {
        Programme.appliquerPlanningGenre(genre, lieu);
      } catch(e) {}

      return programme;
    },

    _enregistrerSeances(seances) {
      try {
        const uniques = [...new Map(
          seances.map(s => [s.id, s])
        ).values()];
        const customs = Utils.storage.get('ft_seances_custom', {});
        uniques.forEach(seance => {
          customs[seance.id] = {
            ...seance,
            custom:       true,
            ia:           true,
            dateCreation: Utils.aujourd_hui()
          };
        });
        Utils.storage.set('ft_seances_custom', customs);
        console.log(`[ProgrammeIA] ${uniques.length} séances enregistrées ✅`);
      } catch(e) {
        console.error('[ProgrammeIA] Erreur enregistrement:', e);
      }
    },

    // ✅ NOUVEAU v5.0 — Prend en compte genre
    _choisirStyleAuto(objectif, nbJours, niveau, genre = 'homme') {
      // Femme → Lower focus si peu de jours
      if (genre === 'femme' && nbJours <= 3) return 'full_body';
      if (genre === 'femme' && nbJours === 4) return 'upper_lower';
      if (nbJours <= 3)  return 'full_body';
      if (nbJours === 4) return objectif === 'force'
        ? 'upper_lower' : 'ppl';
      if (nbJours >= 5)  return 'ppl';
      return 'full_body';
    },

    _styleLabel(style) {
      return {
        ppl:         'Push / Pull / Legs',
        full_body:   'Full Body',
        upper_lower: 'Upper / Lower'
      }[style] || style;
    },

    // ════════════════════════════════════════════════════
    // GÉNÉRATION SÉANCES — avec genre + lieu
    // ════════════════════════════════════════════════════
    _genererSeances(style, objectif, niveau,
                    nbJours, duree, equipement,
                    genre = 'homme', lieu = 'salle') {
      const params = {
        debutant:      { series:3, repsForce:'8-10', repsVol:'12-15', repsEnd:'15-20', repos:60  },
        intermediaire: { series:4, repsForce:'5-8',  repsVol:'8-12',  repsEnd:'12-15', repos:75  },
        avance:        { series:5, repsForce:'3-6',  repsVol:'6-10',  repsEnd:'10-15', repos:90  }
      }[niveau] || { series:4, repsForce:'6-8', repsVol:'8-12', repsEnd:'12-15', repos:90 };

      const reps = objectif === 'force'     ? params.repsForce
                 : objectif === 'endurance' ? params.repsEnd
                 :                            params.repsVol;
      const s = params.series;
      const r = params.repos;

      // ✅ NOUVEAU v5.0 — Séances femme spécifiques
      if (genre === 'femme') {
        return this._seancesFemme(
          objectif, niveau, nbJours, s, reps, r, duree, equipement, lieu
        );
      }

      // ✅ NOUVEAU v5.0 — Séances maison/dehors
      if (lieu === 'maison' || lieu === 'dehors') {
        return this._seancesMaison(
          objectif, niveau, nbJours, s, reps, r, duree
        );
      }

      if (style === 'full_body') {
        return this._seancesFullBody(
          objectif, niveau, nbJours, s, reps, r, duree, equipement
        );
      }
      if (style === 'upper_lower') {
        return this._seancesUpperLower(
          objectif, niveau, nbJours, s, reps, r, duree, equipement
        );
      }
      return this._seancesPPL(
        objectif, niveau, nbJours, s, reps, r, duree, equipement
      );
    },

    // ✅ NOUVEAU v5.0 — Séances FEMME
    _seancesFemme(objectif, niveau, nbJours,
                  s, reps, r, duree, equipement, lieu) {
      const lower = {
        id: 'ia_lower_femme',
        nom: '🍑 Lower Body — Fessiers & Jambes',
        emoji: '🍑',
        muscles: ['Fessiers','Quadriceps','Ischio-jambiers'],
        duree_estimee: duree,
        exercices: this._filtrerExos([
          { ref:'hip_thrust',       series:s,   reps:reps,    repos:75 },
          { ref:'fentes_bulgares',  series:s-1, reps:'12/j',  repos:75 },
          { ref:'squat_poids_corps',series:s-1, reps:'15-20', repos:60 },
          { ref:'donkey_kick',      series:s-1, reps:'15/j',  repos:45 },
          { ref:'hip_thrust_sol',   series:s-1, reps:'20',    repos:45 },
          { ref:'clamshell',        series:s-1, reps:'15/j',  repos:45 },
          { ref:'planche',          series:3,   reps:'30s',   repos:30 },
          { ref:'crunch',           series:3,   reps:'20',    repos:30 }
        ], equipement, duree)
      };

      const upper = {
        id: 'ia_upper_femme',
        nom: '💪 Upper Body Féminin',
        emoji: '💪',
        muscles: ['Épaules','Dos','Bras'],
        duree_estimee: duree,
        exercices: this._filtrerExos([
          { ref:'dev_militaire',  series:s-1, reps:reps,    repos:75 },
          { ref:'elev_laterales', series:s-1, reps:'15',    repos:60 },
          { ref:'inverted_row',   series:s-1, reps:'12',    repos:75 },
          { ref:'curl_halteres',  series:s-1, reps:'15',    repos:60 },
          { ref:'diamond_pushup', series:s-1, reps:'12',    repos:60 },
          { ref:'planche',        series:3,   reps:'30-45s',repos:30 },
          { ref:'russian_twist',  series:3,   reps:'20',    repos:30 }
        ], equipement, duree)
      };

      const core = {
        id: 'ia_core_femme',
        nom: '🔥 Core & Galbe',
        emoji: '🔥',
        muscles: ['Core','Abdominaux'],
        duree_estimee: Math.min(duree, 45),
        exercices: this._filtrerExos([
          { ref:'planche',         series:4, reps:'30-45s',repos:45 },
          { ref:'crunch',          series:3, reps:'20',    repos:45 },
          { ref:'russian_twist',   series:3, reps:'20',    repos:45 },
          { ref:'side_plank',      series:3, reps:'30s/c', repos:45 },
          { ref:'mountain_climbers',series:3,reps:'20',    repos:45 },
          { ref:'hip_thrust_sol',  series:3, reps:'20',    repos:45 }
        ], equipement, duree)
      };

      if (nbJours === 3) return [lower, upper, lower];
      if (nbJours === 4) return [lower, upper, lower, core];
      if (nbJours === 5) return [lower, upper, lower, core, upper];
      return [lower, upper, lower, core, upper, lower];
    },

    // ✅ NOUVEAU v5.0 — Séances MAISON / DEHORS
    _seancesMaison(objectif, niveau, nbJours,
                   s, reps, r, duree) {
      const push = {
        id: 'ia_push_maison',
        nom: '🏠 Push Maison — Poussée',
        emoji: '⬆️',
        muscles: ['Pectoraux','Épaules','Triceps'],
        duree_estimee: duree,
        exercices: [
          { ref:'pompes',          series:s,   reps:reps,    repos:75 },
          { ref:'pompes_declined', series:s-1, reps:'12',    repos:75 },
          { ref:'diamond_pushup',  series:s-1, reps:'12',    repos:60 },
          { ref:'pike_pushup',     series:s-1, reps:'12',    repos:60 },
          { ref:'dips_triceps',    series:s-1, reps:'max',   repos:60 },
          { ref:'planche',         series:3,   reps:'45-60s',repos:30 },
          { ref:'crunch',          series:3,   reps:'20',    repos:30 }
        ]
      };

      const pull = {
        id: 'ia_pull_maison',
        nom: '🏠 Pull Maison — Tirage',
        emoji: '⬇️',
        muscles: ['Dos','Biceps'],
        duree_estimee: duree,
        exercices: [
          { ref:'tractions',    series:s,   reps:reps,  repos:90 },
          { ref:'inverted_row', series:s-1, reps:'12',  repos:75 },
          { ref:'superman',     series:s-1, reps:'15',  repos:60 },
          { ref:'bird_dog',     series:s-1, reps:'12/c',repos:60 },
          { ref:'curl_halteres',series:s-1, reps:'15',  repos:60 },
          { ref:'planche',      series:3,   reps:'45s', repos:30 }
        ]
      };

      const legs = {
        id: 'ia_legs_maison',
        nom: '🏠 Legs Maison — Jambes',
        emoji: '🦵',
        muscles: ['Quadriceps','Fessiers','Ischio-jambiers'],
        duree_estimee: duree,
        exercices: [
          { ref:'squat_poids_corps',series:s,   reps:'20',   repos:60 },
          { ref:'fentes_bulgares',  series:s-1, reps:'12/j', repos:75 },
          { ref:'hip_thrust_sol',   series:s-1, reps:'20',   repos:60 },
          { ref:'donkey_kick',      series:s-1, reps:'15/j', repos:45 },
          { ref:'squat_saute',      series:s-1, reps:'15',   repos:60 },
          { ref:'nordic_curl',      series:s-1, reps:'5-8',  repos:90 }
        ]
      };

      if (nbJours === 3) return [push, pull, legs];
      if (nbJours === 4) return [push, pull, legs, push];
      if (nbJours === 5) return [push, pull, legs, push, pull];
      return [push, pull, legs, push, pull, legs];
    },

    // ════════════════════════════════════════════════════
    // PUSH / PULL / LEGS
    // ════════════════════════════════════════════════════
    _seancesPPL(objectif, niveau, nbJours,
                s, reps, r, duree, equip) {
      const push = {
        id:'ia_push', nom:'Push — Pectoraux · Épaules · Triceps',
        emoji:'⬆️',
        muscles:['Pectoraux','Épaules','Triceps'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'bench_press',        series:s,   reps:reps,    repos:90},
          {ref:'incline_halteres',   series:s-1, reps:reps,    repos:75},
          {ref:'dev_militaire',      series:s-1, reps:reps,    repos:75},
          {ref:'elev_laterales',     series:s,   reps:'12-15', repos:45},
          {ref:'ext_triceps_poulie', series:s-1, reps:'12',    repos:45},
          {ref:'dips_triceps',       series:s-1, reps:'échec', repos:45},
          {ref:'planche',            series:3,   reps:'45-60s',repos:30},
          {ref:'crunch_machine',     series:3,   reps:'15',    repos:30}
        ], equip, duree)
      };

      const pull = {
        id:'ia_pull', nom:'Pull — Dos · Biceps · Épaules Arr.',
        emoji:'⬇️',
        muscles:['Dos','Biceps','Épaules Postérieures'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'tractions',    series:s,   reps:reps,    repos:90},
          {ref:'rowing_barre', series:s,   reps:reps,    repos:90},
          {ref:'lat_pulldown', series:s-1, reps:'10-12', repos:75},
          {ref:'face_pull',    series:s-1, reps:'15',    repos:45},
          {ref:'curl_halteres',series:s-1, reps:'12',    repos:45},
          {ref:'curl_marteau', series:s-1, reps:'12',    repos:45},
          {ref:'releve_jambes',series:3,   reps:'12',    repos:30},
          {ref:'russian_twist',series:3,   reps:'20',    repos:30}
        ], equip, duree)
      };

      const legs = {
        id:'ia_legs', nom:'Legs — Quadriceps · Ischio · Fessiers',
        emoji:'🦵',
        muscles:['Quadriceps','Ischio-jambiers','Fessiers','Mollets'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'squat',         series:s,   reps:reps,    repos:120},
          {ref:'presse_cuisses',series:s-1, reps:'10-12', repos:90 },
          {ref:'fentes',        series:s-1, reps:'12/j',  repos:75 },
          {ref:'leg_curl',      series:s-1, reps:'12',    repos:60 },
          {ref:'hip_thrust',    series:s-1, reps:'12',    repos:75 },
          {ref:'mollets',       series:s,   reps:'15-20', repos:45 },
          {ref:'planche',       series:3,   reps:'45-60s',repos:30 },
          {ref:'releve_jambes', series:3,   reps:'12',    repos:30 }
        ], equip, duree)
      };

      if (nbJours === 3) return [push, pull, legs];
      if (nbJours === 4) return [push, pull, legs,
        {...push, id:'ia_push_b', nom:'Push B — Variation'}];
      if (nbJours === 5) return [push, pull, legs, push, pull];
      return [push, pull, legs, push, pull, legs];
    },

    // ════════════════════════════════════════════════════
    // FULL BODY
    // ════════════════════════════════════════════════════
    _seancesFullBody(objectif, niveau, nbJours,
                     s, reps, r, duree, equip) {
      const fbA = {
        id:'ia_fba', nom:'Full Body A',
        emoji:'🔄',
        muscles:['Full Body','Force'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'squat',          series:s-1, reps:reps,    repos:120},
          {ref:'bench_press',    series:s-1, reps:reps,    repos:90 },
          {ref:'rowing_barre',   series:s-1, reps:reps,    repos:90 },
          {ref:'dev_militaire',  series:s-2, reps:reps,    repos:75 },
          {ref:'curl_halteres',  series:s-2, reps:'12',    repos:45 },
          {ref:'planche',        series:3,   reps:'45-60s',repos:30 },
          {ref:'crunch_machine', series:3,   reps:'15',    repos:30 }
        ], equip, duree)
      };

      const fbB = {
        id:'ia_fbb', nom:'Full Body B',
        emoji:'🔄',
        muscles:['Full Body','Volume'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'soulevé_terre',    series:s-1, reps:reps,    repos:120},
          {ref:'incline_halteres', series:s-1, reps:reps,    repos:90 },
          {ref:'tractions',        series:s-1, reps:'max',   repos:90 },
          {ref:'elev_laterales',   series:s-1, reps:'12-15', repos:45 },
          {ref:'leg_curl',         series:s-2, reps:'12',    repos:60 },
          {ref:'releve_jambes',    series:3,   reps:'12',    repos:30 },
          {ref:'russian_twist',    series:3,   reps:'20',    repos:30 }
        ], equip, duree)
      };

      if (nbJours === 3) return [fbA, fbB, fbA];
      if (nbJours === 4) return [fbA, fbB, fbA, fbB];
      return [fbA, fbB, fbA, fbB, fbA];
    },

    // ════════════════════════════════════════════════════
    // UPPER / LOWER
    // ════════════════════════════════════════════════════
    _seancesUpperLower(objectif, niveau, nbJours,
                       s, reps, r, duree, equip) {
      const upper = {
        id:'ia_upper', nom:'Upper — Haut du corps',
        emoji:'💪',
        muscles:['Pectoraux','Dos','Épaules','Bras'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'bench_press',        series:s-1, reps:reps,    repos:90 },
          {ref:'rowing_barre',       series:s-1, reps:reps,    repos:90 },
          {ref:'dev_militaire',      series:s-1, reps:reps,    repos:75 },
          {ref:'tractions',          series:s-1, reps:'max',   repos:90 },
          {ref:'curl_halteres',      series:s-2, reps:'12',    repos:45 },
          {ref:'ext_triceps_poulie', series:s-2, reps:'12',    repos:45 },
          {ref:'planche',            series:3,   reps:'45-60s',repos:30 },
          {ref:'russian_twist',      series:3,   reps:'20',    repos:30 }
        ], equip, duree)
      };

      const lower = {
        id:'ia_lower', nom:'Lower — Bas du corps',
        emoji:'🦵',
        muscles:['Quadriceps','Ischio-jambiers','Fessiers','Mollets'],
        duree_estimee:duree,
        exercices: this._filtrerExos([
          {ref:'squat',          series:s,   reps:reps,    repos:120},
          {ref:'soulevé_terre',  series:s-1, reps:reps,    repos:120},
          {ref:'presse_cuisses', series:s-1, reps:'10-12', repos:90 },
          {ref:'fentes',         series:s-1, reps:'12/j',  repos:75 },
          {ref:'hip_thrust',     series:s-1, reps:'12',    repos:75 },
          {ref:'mollets',        series:s,   reps:'15-20', repos:45 },
          {ref:'releve_jambes',  series:3,   reps:'12',    repos:30 },
          {ref:'crunch_machine', series:3,   reps:'15',    repos:30 }
        ], equip, duree)
      };

      if (nbJours === 4) return [upper, lower, upper, lower];
      if (nbJours === 5) return [upper, lower, upper, lower, upper];
      return [upper, lower, upper, lower, upper, lower];
    },

    // ════════════════════════════════════════════════════
    // FILTRER selon équipement + durée
    // ════════════════════════════════════════════════════
    _filtrerExos(exercices, equipement, duree) {
      const maxExos = duree <= 45 ? 5
                    : duree <= 60 ? 7
                    : duree <= 75 ? 8
                    : 10;

      const necessiteEquip = {
        bench_press:         ['barre'],
        rowing_barre:        ['barre'],
        'soulevé_terre':     ['barre'],
        squat:               ['barre','rack'],
        lat_pulldown:        ['machines'],
        rowing_machine:      ['machines'],
        leg_curl:            ['machines'],
        leg_extension:       ['machines'],
        presse_cuisses:      ['machines'],
        crunch_machine:      ['machines'],
        ext_triceps_poulie:  ['cables'],
        face_pull:           ['cables'],
        ecarte_poulie:       ['cables'],
        curl_halteres:       ['halteres'],
        curl_marteau:        ['halteres'],
        elev_laterales:      ['halteres'],
        incline_halteres:    ['halteres'],
        dev_militaire:       ['halteres','barre'],
        hip_thrust:          ['barre','halteres'],
        tractions:           ['poids_corps'],
        dips_triceps:        ['poids_corps'],
        pompes:              ['poids_corps'],
        planche:             ['poids_corps'],
        releve_jambes:       ['poids_corps'],
        hollow_body:         ['poids_corps'],
        russian_twist:       ['poids_corps','halteres'],
        fentes:              ['halteres','poids_corps'],
        mollets:             ['poids_corps','machines'],
        // ✅ NOUVEAU — Exercices maison
        pompes_declined:     ['poids_corps'],
        diamond_pushup:      ['poids_corps'],
        pike_pushup:         ['poids_corps'],
        squat_poids_corps:   ['poids_corps'],
        fentes_bulgares:     ['poids_corps'],
        hip_thrust_sol:      ['poids_corps'],
        donkey_kick:         ['poids_corps'],
        clamshell:           ['poids_corps'],
        squat_saute:         ['poids_corps'],
        superman:            ['poids_corps'],
        bird_dog:            ['poids_corps'],
        inverted_row:        ['poids_corps'],
        crunch:              ['poids_corps'],
        mountain_climbers_core:['poids_corps']
      };

      const filtres = exercices.filter(ex => {
        const requis = necessiteEquip[ex.ref];
        if (!requis) return true;
        return requis.some(eq => (equipement||[]).includes(eq));
      });

      return filtres.slice(0, maxExos);
    },

    // ════════════════════════════════════════════════════
    // PLANNING
    // ════════════════════════════════════════════════════
    _genererPlanning(seances, nbJours, joursSpecifiques) {
      const planning = Array(7).fill(null).map((_, i) => ({
        jour:     i,
        label:    ['LUN','MAR','MER','JEU','VEN','SAM','DIM'][i],
        seanceId: null
      }));

      let joursActifs = joursSpecifiques;

      if (!joursActifs || joursActifs.length === 0) {
        const distributions = {
          3: [0, 2, 4],
          4: [0, 1, 3, 4],
          5: [0, 1, 2, 3, 4],
          6: [0, 1, 2, 3, 4, 5]
        };
        joursActifs = distributions[nbJours] || [0,1,3,4];
      }

      joursActifs.slice(0, nbJours).forEach((jourIdx, i) => {
        const seance = seances[i % seances.length];
        if (planning[jourIdx]) {
          planning[jourIdx].seanceId = seance.id;
        }
      });

      return planning;
    },

    _appliquerPlanning(planning) {
      try {
        Programme.sauvegarderPlanning(planning.map(j => ({
          jour:     j.jour,
          label:    j.label,
          seanceId: j.seanceId
        })));
        console.log('[ProgrammeIA] Planning appliqué ✅');
      } catch(e) {
        console.warn('[ProgrammeIA] Erreur planning:', e);
      }
    },

    // ════════════════════════════════════════════════════
    // ✅ CONSEILS — avec genre
    // ════════════════════════════════════════════════════
    _genererConseils(objectif, niveau, style, genre = 'homme') {
      const base = [
        '💧 Hydratation : boire 35ml/kg/jour minimum',
        '😴 Sommeil : 7-9h par nuit pour une récupération optimale',
        '📊 Note ton RPE après chaque série pour adapter l\'intensité'
      ];

      const parObjectif = {
        prise_masse: [
          '🥩 Protéines : 2-2.2g par kg de poids corporel',
          '🍚 Surplus calorique : +300 kcal/jour minimum',
          '⬆️ Progressivité : +2.5kg dès que tu complètes toutes les séries'
        ],
        seche: [
          '🥗 Déficit calorique modéré : -300 à -500 kcal/jour',
          '💪 Maintiens les charges lourdes pour préserver le muscle',
          '🏃 Cardio léger en complément 2-3x/semaine'
        ],
        force: [
          '🏋️ Priorité aux mouvements composés : squat, bench, soulevé',
          '⏱ Repos longs : 2-5 min entre les séries lourdes',
          '📈 Périodisation : varie les charges et les reps'
        ],
        forme: [
          '🎯 Consistance > Intensité — mieux vaut 3 séances régulières',
          '🔄 Varie les exercices pour éviter la routine',
          '🌟 Écoute ton corps et ajuste selon ton énergie du jour'
        ],
        endurance: [
          '❤️ Cardio 2-3x/semaine en complément de la musculation',
          '⬇️ Temps de repos courts : 30-60 secondes',
          '📈 Progression graduelle : +5-10% volume/semaine maximum'
        ]
      };

      const parNiveau = {
        debutant:      ['🌱 Focus sur la technique avant d\'augmenter les charges'],
        intermediaire: ['📈 Alternez les phases de volume et d\'intensité'],
        avance:        ['⚡ Intégrez des techniques avancées : supersets, drop sets']
      };

      // ✅ NOUVEAU — Conseils spécifiques femme
      const parGenre = genre === 'femme' ? [
        '🌸 Adapte l\'intensité selon ton cycle hormonal',
        '🍑 Les exercices unilatéraux (fentes, kickbacks) sont excellents pour le galbe',
        '💪 N\'aie pas peur de soulever lourd — ça ne rend pas "trop musclée" !'
      ] : [
        '💪 La testostérone favorise la récupération — profites-en !',
        '📈 Le sommeil est crucial pour la synthèse protéique'
      ];

      return [
        ...base,
        ...(parObjectif[objectif] || []),
        ...(parNiveau[niveau]     || []),
        ...parGenre
      ];
    },

    // ════════════════════════════════════════════════════
    // RENDER
    // ════════════════════════════════════════════════════
    render(container) {
      if (!container) return;
      const programmeExistant = this.getGenere();
      if (programmeExistant && !this._modeQuestionnaire) {
        this._renderProgrammeGenere(container, programmeExistant);
      } else {
        this._renderQuestionnaire(container);
      }
    },

    _renderQuestionnaire(container) {
      const etape   = this.ETAPES[this._etapeActuelle];
      const total   = this.ETAPES.length;
      const pctProg = Math.round((this._etapeActuelle / total) * 100);

      container.innerHTML = `
        <div class="card mb-md"
             style="background:linear-gradient(135deg,
                    rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                    border-color:rgba(75,75,249,0.3)">
          <div style="display:flex;align-items:center;
                      justify-content:space-between;margin-bottom:8px">
            <div>
              <div style="font-size:1rem;font-weight:800">
                🧠 Programme IA</div>
              <div style="font-size:.72rem;color:var(--text-muted)">
                Étape ${this._etapeActuelle + 1} / ${total}</div>
            </div>
            <div style="font-size:.78rem;font-weight:700;
                        color:var(--fd-indigo)">${pctProg}%</div>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.08);
                      border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${pctProg}%;
                        background:var(--fd-indigo);
                        border-radius:99px;
                        transition:width .5s ease"></div>
          </div>
        </div>

        <div class="card mb-md">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:10px">
            Question ${this._etapeActuelle + 1}
          </div>
          <div style="font-size:1rem;font-weight:800;
                      margin-bottom:6px;line-height:1.3">
            ${etape.titre}
          </div>
          ${etape.desc ? `
            <div style="font-size:.72rem;color:var(--text-muted);
                        margin-bottom:12px">${etape.desc}</div>` : ''}
          ${this._renderOptionsEtape(etape)}
        </div>

        <div style="display:grid;
                    grid-template-columns:${this._etapeActuelle > 0
                      ? '1fr 2fr' : '1fr'};gap:8px">
          ${this._etapeActuelle > 0 ? `
            <button onclick="Coach.ProgrammeIA._etapePrecedente()"
                    class="btn-secondary"
                    style="font-size:.85rem">← Retour</button>` : ''}
          <button onclick="Coach.ProgrammeIA._etapeSuivante()"
                  class="btn-primary"
                  style="font-size:.85rem">
            ${this._etapeActuelle === total - 1
              ? '🧠 Générer mon programme !'
              : 'Suivant →'}
          </button>
        </div>

        ${etape.optionnel ? `
          <div style="text-align:center;margin-top:8px">
            <button onclick="Coach.ProgrammeIA._etapeSuivante(true)"
                    style="background:none;border:none;
                           color:var(--text-muted);font-size:.72rem;
                           cursor:pointer">
              Passer cette étape →
            </button>
          </div>` : ''}
      `;
    },

    _renderOptionsEtape(etape) {
      const rep = this._reponses[etape.id];

      if (etape.type === 'choix_unique') {
        return `
          <div style="display:flex;flex-direction:column;gap:8px">
            ${etape.options.map(opt => `
              <button onclick="Coach.ProgrammeIA._selectionnerChoix('${etape.id}','${opt.val}')"
                      style="display:flex;align-items:center;
                             gap:12px;padding:12px 16px;
                             background:${rep === opt.val
                               ? 'rgba(75,75,249,0.2)'
                               : 'var(--bg-input)'};
                             border:2px solid ${rep === opt.val
                               ? 'var(--fd-indigo)'
                               : 'var(--border-color)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;text-align:left;
                             transition:all .2s;width:100%">
                <div style="font-size:1.1rem;flex-shrink:0">
                  ${opt.label.split(' ')[0]}</div>
                <div style="flex:1">
                  <div style="font-size:.85rem;font-weight:700;
                              color:${rep === opt.val
                                ? 'var(--fd-indigo)'
                                : 'var(--text-primary)'}">
                    ${opt.label}</div>
                  ${opt.desc ? `
                    <div style="font-size:.65rem;color:var(--text-muted);
                                margin-top:1px">${opt.desc}</div>` : ''}
                </div>
                ${rep === opt.val ? `
                  <div style="width:20px;height:20px;
                              border-radius:50%;
                              background:var(--fd-indigo);
                              display:flex;align-items:center;
                              justify-content:center;
                              font-size:.75rem;color:white;
                              flex-shrink:0">✓</div>` : ''}
              </button>`).join('')}
          </div>`;
      }

      if (etape.type === 'choix_multiple') {
        const reps = this._reponses[etape.id] || [];
        return `
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;gap:8px">
            ${etape.options.map(opt => {
              const actif = reps.includes(opt.val);
              return `
                <button onclick="Coach.ProgrammeIA._toggleChoixMultiple('${etape.id}','${opt.val}')"
                        style="padding:12px 8px;text-align:center;
                               background:${actif
                                 ? 'rgba(75,75,249,0.2)'
                                 : 'var(--bg-input)'};
                               border:2px solid ${actif
                                 ? 'var(--fd-indigo)'
                                 : 'var(--border-color)'};
                               border-radius:var(--radius-lg);
                               cursor:pointer;transition:all .2s">
                  <div style="font-size:1.2rem;margin-bottom:4px">
                    ${opt.label.split(' ')[0]}</div>
                  <div style="font-size:.75rem;font-weight:600;
                              color:${actif
                                ? 'var(--fd-indigo)'
                                : 'var(--text-primary)'}">
                    ${opt.label.split(' ').slice(1).join(' ')}</div>
                  ${actif ? `
                    <div style="margin-top:4px;font-size:.65rem;
                                color:var(--fd-mint)">✓ Sélectionné</div>` : ''}
                </button>`;
            }).join('')}
          </div>
          <div style="margin-top:8px;font-size:.68rem;
                      color:var(--text-muted);text-align:center">
            ${(this._reponses[etape.id]||[]).length} sélectionné(s)
            · Sélection multiple
          </div>`;
      }

      if (etape.type === 'jours_semaine') {
        const reps = this._reponses[etape.id] || [];
        const jours = [
          {idx:0,label:'Lun'},{idx:1,label:'Mar'},
          {idx:2,label:'Mer'},{idx:3,label:'Jeu'},
          {idx:4,label:'Ven'},{idx:5,label:'Sam'},
          {idx:6,label:'Dim'}
        ];
        return `
          <div style="display:grid;
                      grid-template-columns:repeat(7,1fr);gap:5px">
            ${jours.map(j => {
              const actif = reps.includes(j.idx);
              return `
                <button onclick="Coach.ProgrammeIA._toggleJour(${j.idx})"
                        style="padding:10px 4px;text-align:center;
                               background:${actif
                                 ? 'var(--fd-indigo)'
                                 : 'var(--bg-input)'};
                               border:2px solid ${actif
                                 ? 'var(--fd-indigo)'
                                 : 'var(--border-color)'};
                               border-radius:var(--radius-md);
                               cursor:pointer;transition:all .2s">
                  <div style="font-size:.68rem;font-weight:700;
                              color:${actif ? 'white' : 'var(--text-muted)'}">
                    ${j.label}</div>
                </button>`;
            }).join('')}
          </div>
          <div style="margin-top:8px;font-size:.68rem;
                      color:var(--text-muted);text-align:center">
            ${reps.length} jour(s) sélectionné(s)
          </div>`;
      }

      return '';
    },

    _reRender() {
      const c = this._getContainer();
      if (c) this._renderQuestionnaire(c);
    },

    _selectionnerChoix(etapeId, val) {
      this._reponses[etapeId] = val;
      this._reRender();
    },

    _toggleChoixMultiple(etapeId, val) {
      if (!this._reponses[etapeId]) this._reponses[etapeId] = [];
      const arr = this._reponses[etapeId];
      const idx = arr.indexOf(val);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
      this._reRender();
    },

    _toggleJour(jourIdx) {
      const id = this.ETAPES[this._etapeActuelle].id;
      if (!this._reponses[id]) this._reponses[id] = [];
      const arr = this._reponses[id];
      const idx = arr.indexOf(jourIdx);
      if (idx >= 0) arr.splice(idx, 1); else arr.push(jourIdx);
      this._reRender();
    },

    _etapeSuivante(passer = false) {
      const etape = this.ETAPES[this._etapeActuelle];
      if (!passer && !etape.optionnel) {
        const rep = this._reponses[etape.id];
        if (!rep || (Array.isArray(rep) && rep.length === 0)) {
          Utils.toast('Fais un choix avant de continuer !', 'error');
          return;
        }
      }
      if (this._etapeActuelle >= this.ETAPES.length - 1) {
        this._lancerGeneration();
        return;
      }
      this._etapeActuelle++;
      this._reRender();
    },

    _etapePrecedente() {
      if (this._etapeActuelle <= 0) return;
      this._etapeActuelle--;
      this._reRender();
    },

    _lancerGeneration() {
      const container = this._getContainer();
      if (!container) return;

      container.innerHTML = `
        <div style="display:flex;flex-direction:column;
                    align-items:center;justify-content:center;
                    min-height:60vh;text-align:center;
                    padding:var(--space-xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-lg);
                      animation:pulse 1s infinite">🧠</div>
          <div style="font-size:1.1rem;font-weight:800;
                      margin-bottom:var(--space-sm)">
            Génération en cours...</div>
          <div style="font-size:.82rem;color:var(--text-muted);
                      margin-bottom:var(--space-xl)">
            L'IA analyse ton profil et crée ton programme</div>
          <div style="width:200px;height:4px;
                      background:var(--border-color);
                      border-radius:2px;overflow:hidden">
            <div style="height:100%;background:var(--fd-indigo);
                        border-radius:2px;
                        animation:splashLoad 2s ease forwards"></div>
          </div>
          <div style="margin-top:var(--space-lg);font-size:.72rem;
                      color:var(--text-muted)">
            ${this._getMessageChargement()}</div>
        </div>`;

      setTimeout(() => {
        try {
          const programme = this.generer(this._reponses);
          this._modeQuestionnaire = false;
          this._etapeActuelle     = 0;
          const c = this._getContainer();
          if (c) this._renderProgrammeGenere(c, programme);
          Utils.toast('🧠 Programme généré !', 'success', 3000);
          Utils.confetti(2000);
          try { Gamification.ajouterXP(100, 'programme_ia'); } catch(e) {}
        } catch(e) {
          console.error('[ProgrammeIA] Erreur:', e);
          Utils.toast('❌ Erreur génération', 'error');
        }
      }, 2200);
    },

    _getMessageChargement() {
      const msgs = [
        '⚡ Analyse de ton niveau...',
        '🎯 Adaptation à ton objectif...',
        '💪 Sélection des exercices optimaux...',
        '📅 Création du planning semaine...',
        '🧪 Optimisation des séries et répétitions...'
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    },

    // ════════════════════════════════════════════════════
    // RENDER PROGRAMME GÉNÉRÉ
    // ════════════════════════════════════════════════════
    _renderProgrammeGenere(container, prog) {
      const genreLabel = prog.genre === 'femme' ? '👩 Femme' : '👨 Homme';
      const lieuLabel  = prog.lieu === 'salle' ? '🏋️ Salle'
                       : prog.lieu === 'maison' ? '🏠 Maison'
                       : '🌳 Dehors';

      container.innerHTML = `
        <div class="card mb-md"
             style="background:linear-gradient(135deg,
                    rgba(75,75,249,0.25),rgba(139,240,187,0.08));
                    border-color:rgba(75,75,249,0.4);
                    text-align:center;padding:20px">
          <div style="font-size:2rem;margin-bottom:8px">🧠</div>
          <div style="font-size:1.1rem;font-weight:800;
                      margin-bottom:6px">Ton programme IA</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;
                      justify-content:center;margin-bottom:10px">
            ${[
              {label:prog.styleLabel, color:'var(--fd-indigo)'  },
              {label:`${prog.nbJours}j/sem`,color:'var(--fd-mint)'  },
              {label:`~${prog.dureeMin}min`, color:'var(--fd-lemon)' },
              {label:genreLabel,            color:'var(--fd-lavender)'},
              {label:lieuLabel,             color:'var(--fd-coral)'  }
            ].map(b => `
              <span style="padding:4px 10px;
                           background:${b.color}22;
                           border:1px solid ${b.color}44;
                           border-radius:99px;font-size:.68rem;
                           color:${b.color};font-weight:700">
                ${b.label}
              </span>`).join('')}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted)">
            Généré le ${prog.dateCreation}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:14px">
          <button onclick="
              Coach.ProgrammeIA._modeQuestionnaire = true;
              Coach.ProgrammeIA._etapeActuelle = 0;
              Coach.ProgrammeIA._reponses = {};
              window._piaReponses = {};
              const c = Coach.ProgrammeIA._getContainer();
              if (c) Coach.ProgrammeIA._renderQuestionnaire(c);"
                  class="btn-secondary" style="font-size:.75rem">
            🔄 Refaire
          </button>
          <button onclick="naviguer('training')"
                  class="btn-primary" style="font-size:.75rem">
            📅 Voir planning →
          </button>
        </div>

        <!-- Planning -->
        <div class="card mb-md">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:12px">
            📅 Planning généré</div>
          <div style="display:grid;
                      grid-template-columns:repeat(7,1fr);gap:4px">
            ${prog.planning.map(j => {
              const seance = prog.seances.find(s => s.id === j.seanceId);
              return `
                <div style="text-align:center">
                  <div style="width:100%;aspect-ratio:1;
                              border-radius:10px;
                              display:flex;align-items:center;
                              justify-content:center;font-size:.85rem;
                              ${j.seanceId
                                ? 'background:rgba(75,75,249,0.2);border:2px solid var(--fd-indigo);'
                                : 'background:var(--bg-input);border:1px solid var(--border-color);'}">
                    ${seance ? seance.emoji : '😴'}
                  </div>
                  <div style="font-size:.5rem;color:var(--text-muted);
                              margin-top:3px;text-transform:uppercase;
                              font-weight:600">${j.label}</div>
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Séances -->
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin:0 0 8px">
          💪 Séances générées</div>

        ${[...new Map(prog.seances.map(s => [s.id, s])).values()]
          .map(seance => `
          <div class="card mb-md">
            <div style="display:flex;align-items:center;
                        justify-content:space-between;margin-bottom:10px">
              <div>
                <div style="font-size:.95rem;font-weight:800">
                  ${seance.emoji} ${seance.nom}</div>
                <div style="font-size:.68rem;color:var(--text-muted)">
                  ~${seance.duree_estimee}min
                  · ${seance.exercices.length} exercices</div>
              </div>
              <button onclick="naviguer('live',{seanceId:'${seance.id}'})"
                      class="btn-primary"
                      style="font-size:.72rem;
                             padding:var(--space-sm) var(--space-md)">
                ▶ Start
              </button>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;
                        margin-bottom:10px">
              ${(seance.muscles||[]).map(m => `
                <span style="padding:3px 8px;border-radius:99px;
                             font-size:.6rem;font-weight:700;
                             background:rgba(75,75,249,0.15);
                             color:var(--fd-lavender);
                             border:1px solid rgba(75,75,249,0.2)">
                  ${m}</span>`).join('')}
            </div>
            ${seance.exercices.map(ex => {
              const exoData = (window.EXERCICES||{})[ex.ref] || {};
              return `
                <div style="display:flex;align-items:center;
                            gap:8px;padding:7px 0;
                            border-bottom:1px solid var(--border-color)">
                  <div style="width:26px;height:26px;border-radius:8px;
                              background:rgba(75,75,249,0.1);
                              border:1px solid rgba(75,75,249,0.2);
                              display:flex;align-items:center;
                              justify-content:center;
                              font-size:.8rem;flex-shrink:0">
                    ${exoData.emoji || '💪'}</div>
                  <div style="flex:1">
                    <div style="font-size:.78rem;font-weight:700">
                      ${exoData.nom || ex.ref}</div>
                    <div style="font-size:.6rem;color:var(--fd-mint)">
                      ${exoData.muscle || ''}</div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:.72rem;font-weight:700;
                                color:var(--fd-indigo)">
                      ${ex.series}×${ex.reps}</div>
                    <div style="font-size:.55rem;color:var(--text-muted)">
                      ⏱ ${ex.repos}s</div>
                  </div>
                </div>`;
            }).join('')}
          </div>`).join('')}

        <!-- Conseils -->
        <div class="card mb-md"
             style="border-color:rgba(191,161,255,0.2);
                    background:rgba(191,161,255,0.05)">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-lavender);margin-bottom:10px">
            💡 Conseils personnalisés ${genreLabel}</div>
          ${prog.conseils.map(c => `
            <div style="display:flex;gap:8px;
                        align-items:flex-start;padding:6px 0;
                        border-bottom:1px solid rgba(191,161,255,0.1)">
              <div style="font-size:.8rem;line-height:1.5;
                          color:var(--text-secondary)">${c}</div>
            </div>`).join('')}
        </div>

        <div class="card mb-md"
             style="border-color:rgba(139,240,187,0.2);
                    background:rgba(139,240,187,0.05)">
          <div style="font-size:.82rem;color:var(--text-secondary);
                      margin-bottom:10px;line-height:1.5">
            ✅ Programme appliqué à ton planning.
            Tu peux démarrer depuis
            <strong style="color:var(--fd-mint)">Programme</strong>.
          </div>
          <button onclick="naviguer('training')"
                  class="btn-primary" style="width:100%">
            📅 Voir mon planning →
          </button>
        </div>
      `;
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER COACH TAB
  // ════════════════════════════════════════════════════════
  renderCoachTab(container) {
    if (!container) return;

    let msg      = { emoji:'💡', message:'Prêt pour la séance ?' };
    let analyse  = {
      seances:0, objectif:4, volume:0, rpe:0,
      intensite:'🟢 Faible', recommendation:'Continue !', deltaVolume:0
    };
    let warmup   = [];
    let deload   = { oui:false };
    let citation = { texte:'La progression est un choix.', auteur:'Anonyme' };
    let aEviter  = [];
    let nom      = 'Athlète';
    const profil = this._getProfilOnboarding();

    try { msg      = this.getMessageDuJour();              } catch(e) {}
    try { analyse  = this.getAnalyseSemaine();             } catch(e) {}
    try { warmup   = this.getWarmupDuJour();               } catch(e) {}
    try { deload   = this.necessiteDeload();               } catch(e) {}
    try { citation = this.getCitationDuJour(profil.genre); } catch(e) {}
    try { aEviter  = this.getExercicesAEviter();           } catch(e) {}
    try { nom      = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    // ✅ NOUVEAU v5.0 — Surcharge musculaire
    let surcharge = [];
    try { surcharge = Tracker.getSurchargeMusculaire(); } catch(e) {}

    container.innerHTML = `

      <!-- BOUTON PROGRAMME IA -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(139,240,187,0.05));
                  border-color:rgba(75,75,249,0.4);cursor:pointer"
           onclick="Coach.ProgrammeIA._modeQuestionnaire=false;
                    naviguer('adaptatif')">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:50px;height:50px;border-radius:16px;
                      background:rgba(75,75,249,0.2);
                      border:2px solid rgba(75,75,249,0.4);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.8rem;
                      flex-shrink:0">🧠</div>
          <div style="flex:1">
            <div style="font-size:.95rem;font-weight:800;margin-bottom:3px">
              Programme IA Personnalisé</div>
            <div style="font-size:.72rem;color:var(--text-muted)">
              ${this.ProgrammeIA.getGenere()
                ? `✅ Programme actif (${profil.genre === 'femme' ? 'Féminin' : 'Masculin'} · ${profil.lieu === 'salle' ? 'Salle' : profil.lieu === 'maison' ? 'Maison' : 'Dehors'})`
                : 'Questionnaire · Génération automatique · Planning adapté'}
            </div>
          </div>
          <div style="color:var(--fd-indigo);font-size:1.2rem">›</div>
        </div>
      </div>

      <!-- ✅ NOUVEAU — Surcharge musculaire -->
      ${surcharge.length > 0 ? `
        <div class="card mb-md"
             style="border-color:var(--fd-coral);
                    background:rgba(255,141,150,0.08)">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-coral);margin-bottom:8px">
            ⚠️ Surcharge musculaire détectée
          </div>
          ${surcharge.map(s => `
            <div style="font-size:.78rem;color:var(--text-secondary);
                        padding:4px 0;
                        border-bottom:1px solid rgba(255,141,150,0.1)">
              🔴 <strong>${s.muscle}</strong> — ${s.conseil}
            </div>`).join('')}
        </div>` : ''}

      <!-- Citation -->
      <div class="card mb-md"
           style="border-left:3px solid var(--fd-lemon);
                  background:rgba(249,239,119,0.06)">
        <div style="font-size:.72rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--fd-lemon);margin-bottom:var(--space-sm)">
          💬 Citation du jour</div>
        <p style="font-size:.9rem;font-style:italic;
                  line-height:1.6;color:var(--text-primary)">
          "${citation.texte}"</p>
        <p style="font-size:.72rem;color:var(--text-muted);
                  margin-top:var(--space-xs)">— ${citation.auteur}</p>
      </div>

      <!-- Message coach -->
      <div class="card mb-md"
           style="border-left:3px solid var(--fd-lavender)">
        <div style="font-size:.65rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--fd-lavender);margin-bottom:var(--space-sm)">
          ${msg.emoji} Coach du jour</div>
        <p style="font-size:.88rem;color:var(--text-secondary);
                  line-height:1.6;margin:0">${msg.message}</p>
      </div>

      <!-- Décharge -->
      ${deload.oui ? `
        <div class="card mb-md"
             style="border-color:var(--fd-coral);
                    background:rgba(255,141,150,0.08)">
          <div class="card-label" style="color:var(--fd-coral)">
            ⚠️ Décharge recommandée</div>
          <p style="font-size:.88rem;margin-top:var(--space-sm);
                    color:var(--text-secondary)">
            ${deload.raison}.<br>
            Réduis les charges de <strong>40%</strong>.</p>
        </div>` : ''}

      <!-- Exercices à éviter -->
      ${aEviter.length > 0 ? `
        <div class="card mb-md"
             style="border-color:var(--fd-lemon);
                    background:rgba(249,239,119,0.06)">
          <div class="card-label" style="color:var(--fd-lemon)">
            ⚠️ Exercices déconseillés</div>
          <div style="display:flex;flex-wrap:wrap;gap:var(--space-xs);
                      margin-top:var(--space-sm)">
            ${aEviter.map(ref => `
              <span class="chip chip-lemon">
                ${(window.EXERCICES||{})[ref]?.nom||ref}
              </span>`).join('')}
          </div>
        </div>` : ''}

      <!-- Analyse semaine -->
      <div class="card mb-md">
        <div class="card-label">📊 Analyse de la semaine</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            {label:'Séances',    val:`${analyse.seances}/${analyse.objectif}`},
            {label:'Volume',     val:Utils.formatVolume(analyse.volume)      },
            {label:'RPE moyen',  val:analyse.rpe > 0 ? `${analyse.rpe}/10` : '—'},
            {label:'Intensité',  val:analyse.intensite                       },
            {label:'vs S-1',     val:`${(analyse.deltaVolume||0) >= 0 ? '+' : ''}${analyse.deltaVolume||0}%`}
          ].map(r => `
            <div class="score-row">
              <span class="score-row-label">${r.label}</span>
              <span style="font-size:.85rem;font-weight:600">${r.val}</span>
            </div>`).join('')}
          <div class="progress-bar mt-md">
            <div class="progress-fill"
                 style="width:${Math.min(100, Math.round(
                   (analyse.seances / Math.max(analyse.objectif,1)) * 100
                 ))}%"></div>
          </div>
        </div>
        <div style="margin-top:var(--space-md);padding:var(--space-sm);
                    background:var(--fd-indigo-dim);
                    border-radius:var(--radius-sm)">
          <span style="font-size:.82rem;color:var(--fd-lavender)">
            💡 ${analyse.recommendation}
          </span>
        </div>
      </div>

      <!-- Chat IA -->
      <div class="card mb-md"
           style="border-color:var(--fd-indigo);
                  background:rgba(75,75,249,0.04)">
        <div class="card-label" style="color:var(--fd-indigo)">
          🤖 Coach IA — Chat</div>

        <div style="display:flex;flex-wrap:wrap;gap:6px;
                    margin-top:var(--space-md);
                    margin-bottom:var(--space-md)">
          ${[
            {label:'💪 Mes records',    q:'Mes records'              },
            {label:'😴 Récupération',   q:'Récupération'             },
            {label:'📈 Programme',      q:'Mon programme'            },
            {label:'🥗 Nutrition',      q:'Nutrition'                },
            {label:'🔥 Motivation',     q:'Motivation'               },
            {label:'💪 Mes muscles',    q:'Analyse mes muscles'      },
            {label:'🔄 Remplacer exo',  q:'Remplace un exercice'     },
            {label:'🧠 Programme IA',   q:'Générer un programme'     }
          ].map(s => `
            <button onclick="Coach._suggestionRapide('${s.q}')"
                    style="padding:6px 10px;border-radius:99px;
                           border:1px solid var(--fd-indigo);
                           background:rgba(75,75,249,0.12);
                           color:var(--fd-lavender);font-size:.72rem;
                           font-weight:600;cursor:pointer;
                           white-space:nowrap">
              ${s.label}
            </button>`).join('')}
        </div>

        <div id="coach-chat"
             style="min-height:100px;max-height:360px;overflow-y:auto;
                    margin-bottom:var(--space-md);
                    display:flex;flex-direction:column;
                    gap:var(--space-sm);padding:var(--space-xs)">
          ${this._historique.length === 0 ? `
            <div data-initial="true"
                 style="text-align:center;padding:var(--space-lg);
                        color:var(--text-muted);font-size:.85rem;
                        line-height:1.8">
              🤖 ${this._salutation()} ${nom} !${profil.genre === 'femme' ? ' 🌸' : ''}<br><br>
              Pose-moi une question ou clique sur une suggestion 👆<br><br>
              💡 Clique sur
              <strong style="color:var(--fd-indigo)">🧠 Programme IA</strong>
              pour générer ton programme !
            </div>` :
            this._historique.map(m => `
              <div style="display:flex;justify-content:${
                m.role === 'user' ? 'flex-end' : 'flex-start'}">
                <div style="max-width:82%;padding:10px 14px;
                            border-radius:${m.role === 'user'
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px'};
                            background:${m.role === 'user'
                              ? 'var(--fd-indigo)'
                              : 'var(--bg-input)'};
                            color:${m.role === 'user'
                              ? 'white' : 'var(--text-primary)'};
                            font-size:.85rem;line-height:1.6;
                            white-space:pre-wrap;word-break:break-word">
                  ${m.role === 'assistant' ? '🤖 ' : ''}${m.content}
                </div>
              </div>`).join('')}
        </div>

        <div style="display:grid;
                    grid-template-columns:1fr auto;
                    gap:var(--space-sm);align-items:center">
          <input id="coach-input" type="text" class="input"
                 style="border-radius:var(--radius-full)"
                 placeholder="Ta question..."
                 autocomplete="off" autocorrect="off"
                 autocapitalize="sentences"
                 onkeydown="if(event.key==='Enter'){
                   event.preventDefault();
                   Coach._envoyerChat();
                 }"/>
          <button onclick="Coach._envoyerChat()"
                  style="height:44px;padding:0 16px;
                         background:var(--fd-indigo);color:white;
                         border:none;border-radius:var(--radius-full);
                         font-size:.85rem;font-weight:700;
                         cursor:pointer">↗</button>
        </div>
      </div>

      <!-- Warm-up -->
      <div class="card">
        <div class="card-label">🔥 Warm-up recommandé</div>
        ${(warmup||[]).length === 0 ? `
          <p style="color:var(--text-muted);text-align:center;
                    padding:var(--space-md);font-size:.85rem">
            Aucun warm-up disponible</p>` :
          (warmup||[]).map((w, i) => `
            <div style="display:flex;align-items:center;
                        gap:var(--space-md);padding:var(--space-sm) 0;
                        border-bottom:1px solid var(--border-color)">
              <div style="width:28px;height:28px;border-radius:50%;
                          background:var(--fd-indigo-dim);
                          display:flex;align-items:center;
                          justify-content:center;font-size:.75rem;
                          font-weight:700;color:var(--fd-indigo);
                          flex-shrink:0">${i + 1}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.88rem;font-weight:600">
                  ${w.nom}</div>
                <div style="font-size:.72rem;color:var(--text-muted)">
                  ${w.description}</div>
              </div>
              <div style="font-size:.78rem;color:var(--fd-mint);
                          font-weight:600;flex-shrink:0">
                ${Utils.formatDuree(w.duree)}</div>
            </div>`).join('')}
      </div>
    `;

    const chat = document.getElementById('coach-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
  },

  // ════════════════════════════════════════════════════════
  // CHAT
  // ════════════════════════════════════════════════════════
  async _envoyerChat() {
    const input = document.getElementById('coach-input');
    const chat  = document.getElementById('coach-chat');
    if (!input || !chat) return;

    const question = input.value.trim();
    if (!question) return;

    input.value = '';
    input.focus();

    const initMsg = chat.querySelector('[data-initial]');
    if (initMsg) initMsg.remove();

    const bulleUser = document.createElement('div');
    bulleUser.style.cssText = 'display:flex;justify-content:flex-end';
    bulleUser.innerHTML = `
      <div style="max-width:82%;padding:10px 14px;
                  border-radius:16px 16px 4px 16px;
                  background:var(--fd-indigo);color:white;
                  font-size:.85rem;line-height:1.6;
                  word-break:break-word">${question}</div>`;
    chat.appendChild(bulleUser);
    chat.scrollTop = chat.scrollHeight;

    const bulleLoad = document.createElement('div');
    bulleLoad.style.cssText = 'display:flex;justify-content:flex-start';
    bulleLoad.innerHTML = `
      <div style="padding:10px 14px;background:var(--bg-input);
                  border-radius:16px 16px 16px 4px;
                  font-size:.85rem;color:var(--text-muted)">
        🤖 <span style="display:inline-block;width:12px;height:12px;
                        border:2px solid rgba(255,255,255,0.2);
                        border-top-color:var(--fd-indigo);
                        border-radius:50%;
                        animation:spin .8s linear infinite;
                        vertical-align:middle;margin-left:4px"></span>
      </div>`;
    chat.appendChild(bulleLoad);
    chat.scrollTop = chat.scrollHeight;

    await new Promise(r =>
      setTimeout(r, 600 + Math.random() * 400)
    );

    let reponse = '';
    try { reponse = await this.envoyerMessage(question); }
    catch(e) { reponse = 'Désolé, une erreur est survenue. 🤖'; }

    bulleLoad.remove();

    const bulleCoach = document.createElement('div');
    bulleCoach.style.cssText = 'display:flex;justify-content:flex-start';
    bulleCoach.innerHTML = `
      <div style="max-width:82%;padding:10px 14px;
                  border-radius:16px 16px 16px 4px;
                  background:var(--bg-input);
                  color:var(--text-primary);
                  font-size:.85rem;line-height:1.6;
                  white-space:pre-wrap;word-break:break-word">
        🤖 ${reponse}
      </div>`;
    chat.appendChild(bulleCoach);
    chat.scrollTop = chat.scrollHeight;

    try { Utils.vibrerSuccess(); } catch(e) {}
  },

  _suggestionRapide(texte) {
    const input = document.getElementById('coach-input');
    if (input) {
      input.value = texte;
      this._envoyerChat();
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ CITATIONS — avec genre
  // ════════════════════════════════════════════════════════
  getCitationDuJour(genre = 'homme') {
    const citations = [
      {texte:"Le corps accomplit ce que l'esprit croit possible.",
       auteur:"Napoleon Hill"},
      {texte:"La douleur est temporaire. Abandonner dure toujours.",
       auteur:"Lance Armstrong"},
      {texte:"Chaque rep que tu fais change ton futur.",
       auteur:"Anonyme"},
      {texte:"La force vient d'une volonté indomptable.",
       auteur:"Gandhi"},
      {texte:"Le seul mauvais entraînement est celui qui n'a pas eu lieu.",
       auteur:"Anonyme"},
      {texte:"Tu n'as pas à être extrême, juste consistant.",
       auteur:"Anonyme"},
      {texte:"Les champions sont faits à la salle — reconnus ailleurs.",
       auteur:"Joe Frazier"},
      {texte:"Construis ton corps, construis ta confiance.",
       auteur:"Anonyme"},
      {texte:"Souffre maintenant et vis le reste de ta vie en champion.",
       auteur:"Muhammad Ali"},
      {texte:"La progression n'est pas un accident, c'est un choix.",
       auteur:"Anonyme"},
      // ✅ NOUVEAU — Citations femme
      {texte:"La force n'a pas de genre. Elle se construit, rep après rep.",
       auteur:"Anonyme"},
      {texte:"Les femmes qui soulèvent changent le monde — à commencer par elles-mêmes.",
       auteur:"Anonyme"},
      {texte:"Ton corps peut faire bien plus que tu ne le crois.",
       auteur:"Anonyme"},
      {texte:"Les limites n'existent que dans l'esprit.",
       auteur:"Arnold Schwarzenegger"},
      {texte:"La discipline est le pont entre les objectifs et les résultats.",
       auteur:"Jim Rohn"},
      {texte:"Ton futur te remerciera pour les efforts d'aujourd'hui.",
       auteur:"Anonyme"}
    ];
    const idx = new Date().getDate() % citations.length;
    return citations[idx];
  },

  // ════════════════════════════════════════════════════════
  // WARM-UP / ANALYSE / DELOAD / EXERCICES À ÉVITER
  // ════════════════════════════════════════════════════════
  getWarmupDuJour() {
    try {
      const indexJour = Utils.indexJourSemaine(Utils.aujourd_hui());
      const planning  = window.PLANNING_SEMAINE?.[indexJour];
      const seanceId  = planning?.seanceId;
      return seanceId
        ? (window.WARMUP?.[seanceId] || window.WARMUP?.general || [])
        : (window.WARMUP?.general || []);
    } catch(e) { return []; }
  },

  getAnalyseSemaine() {
    let volume = 0, seances = 0, rpe = 0;
    let objectif = 4, comp = { delta:0 };

    try { volume   = Tracker.getVolumeSemaine();      } catch(e) {}
    try { seances  = Tracker.getSeancesParSemaine();  } catch(e) {}
    try { rpe      = Tracker.getRPEMoyen7Jours();     } catch(e) {}
    try { objectif = Utils.storage.get(
      'ft_objectif_seances_semaine', 4);              } catch(e) {}
    try { comp     = Tracker.getComparaisonSemaines();} catch(e) {}

    let intensite      = '🟢 Faible';
    let recommendation = 'Augmente l\'intensité ou le volume cette semaine.';

    if (rpe >= 9) {
      intensite      = '🔴 Très élevée';
      recommendation = 'Décharge recommandée — réduis les charges de 40%.';
    } else if (rpe >= 7.5) {
      intensite      = '🟠 Élevée';
      recommendation = 'Maintiens le volume actuel sans augmenter.';
    } else if (rpe >= 5.5) {
      intensite      = '🟡 Modérée';
      recommendation = 'Augmentation progressive possible (+5% volume).';
    } else if (seances >= objectif) {
      intensite      = '🟢 Bonne';
      recommendation = 'Objectif séances atteint ! Maintiens ce rythme.';
    }

    return {
      volume, seances, objectif, rpe,
      intensite, recommendation,
      deltaVolume:     comp.delta || 0,
      objectifAtteint: seances >= objectif
    };
  },

  suggererCharge(exerciceRef) {
    try {
      const pr    = Tracker.getPR(exerciceRef);
      const phase = Programme.getPhaseActuelle();
      if (!pr?.rm1) return null;
      const charge = Math.round(pr.rm1 * phase.intensite / 2.5) * 2.5;
      return { charge, pourcentage:Math.round(phase.intensite * 100),
               rm1:pr.rm1, phase:phase.nom };
    } catch(e) { return null; }
  },

  necessiteDeload() {
    try {
      const rpe     = Tracker.getRPEMoyen7Jours();
      const fatigue = Tracker.getFatigue();
      const absence = Tracker.getJoursAbsence();
      if (absence === -1) return { oui:false };
      if (rpe > 0 && rpe >= 8.5)
        return { oui:true, raison:`RPE moyen élevé : ${rpe}/10` };
      if ((fatigue?.niveau || 0) >= 3)
        return { oui:true, raison:'Fatigue déclarée maximale' };
      if (Programme.isDecharge?.())
        return { oui:true, raison:'Semaine de décharge planifiée (S16)' };
      return { oui:false };
    } catch(e) { return { oui:false }; }
  },

  getExercicesAEviter() {
    try {
      // ✅ NOUVEAU v5.0 — Utiliser getBlessuresActives
      const blessures = Tracker.getBlessuresActives
        ? Tracker.getBlessuresActives()
        : Tracker.getBlessures().filter(b => b.active);

      const aEviter = new Set();

      blessures.forEach(b => {
        // ✅ Utiliser exercicesAEviter si disponible (v4.0)
        if (b.exercicesAEviter?.length) {
          b.exercicesAEviter.forEach(e => aEviter.add(e));
        } else {
          // Fallback restrictions
          const restrictions = {
            'epaule':   ['dev_militaire','bench_press','elev_laterales','dips'],
            'genou':    ['squat','presse_cuisses','fentes','leg_extension'],
            'dos':      ['soulevé_terre','rowing_barre','squat'],
            'coude':    ['curl_halteres','curl_barre','ext_triceps_poulie'],
            'poignet':  ['bench_press','curl_barre'],
            'cheville': ['squat','fentes','mollets'],
            'cou':      ['dev_militaire','rowing_barre'],
            'hanche':   ['squat','fentes','hip_thrust']
          };
          const zone = b.zone?.toLowerCase() || '';
          Object.entries(restrictions).forEach(([k, exos]) => {
            if (zone.includes(k)) exos.forEach(e => aEviter.add(e));
          });
        }
      });

      return [...aEviter];
    } catch(e) { return []; }
  }
};

window.Coach       = Coach;
window.ProgrammeIA = Coach.ProgrammeIA;

console.log('✅ Coach IA v5.0 chargé — Genre + Lieu + Muscles + Chat enrichi');
