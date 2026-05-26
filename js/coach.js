/* ============================================================
   PowerApp — Coach IA v7.0
   ✅ Chat contextuel enrichi
   ✅ Mémoire conversationnelle
   ✅ Analyse prédictive
   ✅ Mode Séance Ultra-Rapide
   ✅ Périodisation Intelligente
   ✅ Suggestions proactives
   ✅ Toutes features v6.0 conservées
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

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Mémoire persistante
  // ════════════════════════════════════════════════════════
  _sauvegarderHistorique() {
    try {
      const toSave = this._historique.slice(-20);
      Utils.storage.set('ft_coach_historique', toSave);
    } catch(e) {}
  },

  _chargerHistorique() {
    try {
      const saved = Utils.storage.get('ft_coach_historique', []);
      if (saved.length > 0) window._coachHistorique = saved;
    } catch(e) {}
  },

  _salutation() {
    const h = new Date().getHours();
    return h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';
  },

  _getProfilOnboarding() {
    try {
      return Utils.storage.get('ft_profil_onboarding', {
        genre:'homme', lieu:'salle',
        muscles_cibles:[], objectif:'forme',
        niveau:'intermediaire', nom:'Athlète'
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
  // ✅ NOUVEAU v7.0 — Contexte enrichi
  // ════════════════════════════════════════════════════════
  _getContexteComplet() {
    const profil = this._getProfilOnboarding();
    let ctx = {
      nom:           'Athlète',
      genre:         profil.genre          || 'homme',
      lieu:          profil.lieu           || 'salle',
      muscles:       profil.muscles_cibles || [],
      objectif:      profil.objectif       || 'forme',
      niveau:        profil.niveau         || 'intermediaire',
      seancesTotales:0,
      streak:        0,
      streakMax:     0,
      joursAbsence:  -1,
      rpe:           0,
      fatigue:       null,
      humeur:        null,
      volume:        0,
      volumeSemaine: 0,
      prs:           {},
      nbPRs:         0,
      phase:         'Reprise',
      scoreForme:    0,
      blessures:     [],
      surcharge:     [],
      seanceDuJour:  null,
      prochainPR:    null,
      tendance:      'stable'
    };

    try { ctx.nom           = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { ctx.seancesTotales= Tracker.getTotalSeances();             } catch(e) {}
    try {
      const s = Tracker.getStreak();
      ctx.streak    = s.count;
      ctx.streakMax = s.max;
    } catch(e) {}
    try { ctx.joursAbsence  = Tracker.getJoursAbsence();            } catch(e) {}
    try { ctx.rpe           = Tracker.getRPEMoyen7Jours();           } catch(e) {}
    try { ctx.fatigue       = Tracker.getFatigue();                  } catch(e) {}
    try { ctx.humeur        = Tracker.getHumeur();                   } catch(e) {}
    try { ctx.volumeSemaine = Tracker.getVolumeSemaine();            } catch(e) {}
    try { ctx.prs           = Tracker.getAllPRs();                   } catch(e) {}
    try { ctx.nbPRs         = Object.keys(ctx.prs).length;           } catch(e) {}
    try { ctx.phase         = Programme.getInfosProgramme()?.phase?.nom || 'Reprise'; } catch(e) {}
    try { ctx.scoreForme    = Tracker.calculerScoreForme()?.score || 0; } catch(e) {}
    try { ctx.blessures     = Tracker.getBlessures().filter(b=>b.active); } catch(e) {}
    try { ctx.surcharge     = Tracker.getSurchargeMusculaire();      } catch(e) {}
    try { ctx.seanceDuJour  = Tracker.getSeanceDuJour();             } catch(e) {}

    // Tendance volume (hausse / baisse / stable)
    try {
      const comp = Tracker.getComparaisonSemaines();
      if (comp.delta > 10)       ctx.tendance = 'hausse';
      else if (comp.delta < -10) ctx.tendance = 'baisse';
      else                       ctx.tendance = 'stable';
    } catch(e) {}

    // Prochain PR potentiel
    try {
      ctx.prochainPR = Predict.prochainPRPotentiel?.() || null;
    } catch(e) {}

    return ctx;
  },

  // ════════════════════════════════════════════════════════
  // MESSAGE DU JOUR (identique v6.0)
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

    try {
      const seanceDuJour = Tracker.getSeanceDuJour();
      if (seanceDuJour?.complete) {
        const prs = seanceDuJour.prs || [];
        if (prs.length > 0) {
          const ex = window.EXERCICES?.[prs[0].exerciceRef];
          return {
            type:'pr', emoji:'🏆',
            message:`INCROYABLE ${nom} ! Tu as battu ton record sur ${ex?.nom||prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! ${prs.length>1?`Et ${prs.length-1} autre(s) PR !`:''} 🎉`
          };
        }
        return {
          type:'seance_faite', emoji:'✅',
          message:`Séance terminée ${nom} ! ${seanceDuJour.volumeTotal?`${Utils.formatVolume(seanceDuJour.volumeTotal)} de volume.`:''} Récupère bien 💪`
        };
      }
    } catch(e) {}

    if (absence === -1 || total === 0) {
      const msgs = genre === 'femme' ? [
        `Bienvenue ${nom} ! C'est ta première séance — prends le temps de trouver tes sensations. 🌸`,
        `Hey ${nom} ! Prête pour l'aventure ? Ta première séance commence ici. 💪`
      ] : [
        `Bienvenue ${nom} ! C'est ta première séance — profites-en pour trouver tes sensations.`,
        `Hey ${nom} ! Prêt pour l'aventure ? Ta première séance commence ici.`
      ];
      return { type:'bienvenue', emoji:'👋', message:Utils.random(msgs) };
    }

    if (absence >= 7) {
      return {
        type:'reprise', emoji:'🌱',
        message:Utils.random(genre === 'femme' ? [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges. 🌸`
        ] : [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges.`
        ])
      };
    }

    if (absence >= 3) {
      return {
        type:'relance', emoji:'🔥',
        message:`Te revoilà ${nom} ! Le corps attendait ça. Une séance même courte remet tout en route.`
      };
    }

    if (rpe > 0 && rpe >= 8.5) {
      return {
        type:'deload', emoji:'⚡',
        message:`RPE moyen ${rpe}/10 ${nom}. Ton corps envoie un signal. Aujourd'hui : -40% charges, technique parfaite.`
      };
    }

    if ((fatigue?.niveau||0) >= 3) {
      return {
        type:'fatigue', emoji:'😴',
        message:`Tu te sens épuisé${genre==='femme'?'e':''} ${nom} — écoute ton corps : technique parfaite sur charges modérées.`
      };
    }

    if (['😒','😤'].includes(humeur?.humeur)) {
      return {
        type:'motivation', emoji:'💡',
        message:`Pas dans ton assiette ${nom} ? Les meilleures séances arrivent parfois quand on s'y attend le moins.`
      };
    }

    if (humeur?.humeur === '🔥' && (fatigue?.niveau||0) <= 1) {
      return {
        type:'peak', emoji:'🚀',
        message:`Tu es en feu ${nom} ! Corps frais, mental affûté — c'est le moment de tenter un PR !`
      };
    }

    if (streak.count >= 14) {
      return {
        type:'streak', emoji:'🏆',
        message:`${streak.count} jours consécutifs ${nom} — c'est impressionnant ! Continue sur cette lancée.`
      };
    }

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
        .map(m => labels[m]||m).join(' et ');
      return {
        type:'muscles_cibles', emoji:'🎯',
        message:`Aujourd'hui ${nom}, on attaque ${musclesNoms} ! Focus sur tes zones prioritaires. 💪`
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
      type:'programme', emoji:infos.phase?.emoji||'💡',
      message:Utils.random(msgs[phase]||msgs['Reprise'])
    };
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Messages proactifs
  // ════════════════════════════════════════════════════════
  getMessagesProactifs() {
    const ctx   = this._getContexteComplet();
    const msgs  = [];
    const genre = ctx.genre;
    const e     = genre === 'femme' ? 'e' : '';

    // Score de forme bas
    if (ctx.scoreForme > 0 && ctx.scoreForme < 40) {
      msgs.push({
        type:    'alerte',
        emoji:   '⚠️',
        titre:   'Score de forme bas',
        message: `Ton score est à ${ctx.scoreForme}/100. Priorité récupération : sommeil + nutrition + hydratation.`,
        action:  null
      });
    }

    // PR imminent détecté
    if (ctx.prochainPR) {
      msgs.push({
        type:    'opportunite',
        emoji:   '🎯',
        titre:   'PR en vue !',
        message: `${ctx.prochainPR.message}`,
        action:  { label:'Voir les prédictions', page:'predict' }
      });
    }

    // Tendance volume en baisse
    if (ctx.tendance === 'baisse' && ctx.seancesTotales > 5) {
      msgs.push({
        type:    'conseil',
        emoji:   '📉',
        titre:   'Volume en baisse',
        message: `Ton volume est en baisse cette semaine. Ajoute une série par exercice pour relancer la progression.`,
        action:  null
      });
    }

    // Streak en danger
    if (ctx.streak === 0 && ctx.joursAbsence === 1) {
      msgs.push({
        type:    'urgence',
        emoji:   '🔥',
        titre:   'Streak en danger !',
        message: `Tu n'as pas encore entraîné${e} aujourd'hui — même 20min sauvera ton streak !`,
        action:  { label:'Démarrer une séance', page:'live' }
      });
    }

    // Blessures actives
    if (ctx.blessures.length > 0) {
      msgs.push({
        type:    'attention',
        emoji:   '🩹',
        titre:   `${ctx.blessures.length} blessure${ctx.blessures.length>1?'s':''} active${ctx.blessures.length>1?'s':''}`,
        message: `Zones affectées : ${ctx.blessures.map(b=>b.zone).join(', ')}. Consulte les exercices alternatifs.`,
        action:  { label:'Voir les blessures', page:'blessures' }
      });
    }

    // Surcharge musculaire
    if (ctx.surcharge.length > 0) {
      msgs.push({
        type:    'alerte',
        emoji:   '⚠️',
        titre:   'Surcharge musculaire',
        message: `${ctx.surcharge.map(s=>`${s.muscle}: ${s.conseil}`).join(' · ')}`,
        action:  null
      });
    }

    return msgs.slice(0, 3);
  },

  // ════════════════════════════════════════════════════════
  // getPostSeanceMessage (identique v6.0)
  // ════════════════════════════════════════════════════════
  getPostSeanceMessage(seanceData = {}) {
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre || 'homme';
    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    const { volumeTotal=0, nbSeries=0, prs=[], duree=0 } = seanceData;
    const e = genre === 'femme' ? 'e' : '';
    if (prs.length >= 3)
      return `🏆 SÉANCE LÉGENDAIRE ${nom} ! ${prs.length} nouveaux records ! Tu es inarrêtable${e} ! 🔥`;
    if (prs.length > 0) {
      const ex = window.EXERCICES?.[prs[0].exerciceRef];
      return `🏆 PR sur ${ex?.nom||prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! Bravo ${nom} ! 💪`;
    }
    if (volumeTotal > 8000)
      return `💥 Volume monstre ${nom} ! ${Utils.formatVolume(volumeTotal)} — ton corps va adorer ça ! 🔥`;
    if (duree > 75*60)
      return `⏱ Séance marathon terminée ${nom} ! ${Utils.formatDuree(duree)} de travail. Récupère bien 💤`;
    const msgs = genre === 'femme' ? [
      `Séance terminée ${nom} ! Tes efforts d'aujourd'hui construisent tes résultats de demain. 🌸`,
      `GG ${nom} ! Une séance de plus dans la boîte. Chaque rep compte ! 💪`
    ] : [
      `Séance terminée ${nom} ! ${volumeTotal>0?`${Utils.formatVolume(volumeTotal)} soulevés.`:''} Récupère bien. 💪`,
      `GG ${nom} ! Le travail paie toujours.`
    ];
    return Utils.random(msgs);
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — envoyerMessage enrichi
  // ════════════════════════════════════════════════════════
  async envoyerMessage(question) {
    const ctx = this._getContexteComplet();
    const q   = question.toLowerCase();

    // ── Navigation ──────────────────────────────────────
    if (q.includes('génère') || q.includes('crée')
        || q.includes('programme ia') || q.includes('générer')) {
      setTimeout(() => {
        Coach.ProgrammeIA._modeQuestionnaire = true;
        Coach.ProgrammeIA._etapeActuelle     = 0;
        Coach.ProgrammeIA._reponses          = {};
        naviguer('adaptatif');
      }, 800);
      return `Je lance le questionnaire pour toi ${ctx.nom} ! 🧠\n\nRéponds aux questions et ton programme sur mesure sera généré instantanément !`;
    }

    if (q.includes('remplace') || q.includes('alternative')
        || q.includes('substitut') || q.includes('à la place')) {
      return this._raisonnerRemplacement(q, ctx);
    }

    // ── Nouvelle feature : Analyse prédictive ───────────
    if (q.includes('prédi') || q.includes('proch')
        || q.includes('estime') || q.includes('futur')
        || q.includes('potentiel') || q.includes('quand')) {
      return this._raisonnerPrediction(ctx);
    }

    // ── Nouvelle feature : Plan semaine ─────────────────
    if (q.includes('plan') || q.includes('semaine')
        || q.includes('planning') || q.includes('organisation')) {
      return this._raisonnerPlanSemaine(ctx);
    }

    // ── Nouvelle feature : Déload ────────────────────────
    if (q.includes('décharge') || q.includes('deload')
        || q.includes('repos semaine') || q.includes('récupération semaine')) {
      return this._raisonnerDeload(ctx);
    }

    // ── Nouvelle feature : Comparaison ──────────────────
    if (q.includes('progress') || q.includes('évolution')
        || q.includes('améliore') || q.includes('résultat')) {
      return this._raisonnerProgression(ctx);
    }

    // ── Logique v6.0 conservée ───────────────────────────
    const reponse = this._raisonnerIA(q, ctx, ctx.prs);

    const hist = this._historique;
    hist.push(
      { role:'user',      content:question },
      { role:'assistant', content:reponse  }
    );
    if (hist.length > 40) hist.splice(0, hist.length - 40);
    this._historique = hist;
    this._sauvegarderHistorique();

    return reponse;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Raisonnement prédiction
  // ════════════════════════════════════════════════════════
  _raisonnerPrediction(ctx) {
    const nom = ctx.nom;

    // Tenter Predict.js
    try {
      const preds = Predict.getToutesPredictons?.() || [];
      if (preds.length > 0) {
        const top3 = preds.slice(0,3).map(p =>
          `  • ${p.emoji||'💪'} ${p.nom} : ${p.message}`
        );
        return `Prédictions IA pour toi ${nom} 🔮\n\n${top3.join('\n')}\n\nScore de forme actuel : ${ctx.scoreForme}/100\nTendance : ${ctx.tendance === 'hausse'?'📈 Hausse':ctx.tendance==='baisse'?'📉 Baisse':'➡️ Stable'}`;
      }
    } catch(e) {}

    // Analyse depuis les PRs
    const prs = ctx.prs;
    if (!Object.keys(prs).length)
      return `Fais quelques séances d'abord ${nom} — je pourrai ensuite prédire tes prochains records ! 💪`;

    const top = Object.entries(prs)
      .filter(([,v]) => v.rm1 > 0)
      .sort(([,a],[,b]) => (b.rm1||0)-(a.rm1||0))
      .slice(0,3);

    const preds = top.map(([ref, pr]) => {
      const ex    = (window.EXERCICES||{})[ref];
      const gain  = ctx.tendance === 'hausse' ? 5
                  : ctx.tendance === 'baisse' ? 0 : 2.5;
      const futur = Math.round((pr.rm1 + gain) / 2.5) * 2.5;
      return `  • ${ex?.nom||ref} : ${pr.rm1}kg → ~${futur}kg (dans 4 semaines)`;
    });

    return `Prédictions sur 4 semaines ${nom} 🔮\n\nBasé sur ta tendance (${ctx.tendance}) :\n\n${preds.join('\n')}\n\n💡 Continue ta progression — chaque séance compte !`;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Plan semaine intelligent
  // ════════════════════════════════════════════════════════
  _raisonnerPlanSemaine(ctx) {
    const nom    = ctx.nom;
    const genre  = ctx.genre;
    const e      = genre === 'femme' ? 'e' : '';
    const jours  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

    let planning = [];
    try {
      planning = Programme.getSeancesSemaine() || [];
    } catch(e2) {}

    if (!planning.length) {
      return `Je n'ai pas encore ton planning ${nom}.\n\nVa dans 🧠 Programme IA pour en générer un adapté à :\n  • Ton objectif : ${ctx.objectif}\n  • Ton lieu : ${ctx.lieu}\n  • Ton niveau : ${ctx.niveau}`;
    }

    const seancesRestantes = planning
      .filter(j => !j.seance && j.seanceId)
      .length;

    const seancesFaites = planning
      .filter(j => j.estFaite)
      .length;

    const lignes = planning.map(j => {
      if (!j.seanceId) return `  😴 ${j.label || jours[j.jour]} — Repos`;
      const icon = j.estFaite ? '✅' : '📋';
      const nomS = j.seance?.nom || j.seanceId;
      return `  ${icon} ${j.label||jours[j.jour]} — ${nomS}`;
    });

    return `Planning semaine ${nom} 📅\n\n${lignes.join('\n')}\n\n✅ Faites : ${seancesFaites}\n📋 Restantes : ${seancesRestantes}\n\n💡 ${seancesRestantes > 0 ? 'Tu es sur la bonne voie — continue !' : 'Semaine complète, bravo !'}`;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Conseil déload
  // ════════════════════════════════════════════════════════
  _raisonnerDeload(ctx) {
    const nom    = ctx.nom;
    const deload = this.necessiteDeload();

    if (deload.oui) {
      return `⚠️ Décharge recommandée ${nom} !\n\nRaison : ${deload.raison}\n\nProtocole décharge :\n  • Charges à 50-60% de ton habituel\n  • Même nombre de séries\n  • Focus sur la technique parfaite\n  • Durée : 7 jours\n\nBénéfices : supercompensation = +5-10% force après la décharge ! 💪`;
    }

    const semainesConsecutives = Math.floor(ctx.seancesTotales / (ctx.streak || 1));
    const besoinDeload         = semainesConsecutives >= 4;

    if (besoinDeload) {
      return `💡 Décharge conseillée ${nom}\n\nTu t'entraînes intensément depuis plusieurs semaines.\n\nUne décharge préventive tous les 4-6 semaines :\n  • Prévient le surentraînement\n  • Laisse le corps assimiler\n  • Augmente la longévité\n\nQuand : la semaine prochaine serait idéale.`;
    }

    return `✅ Pas besoin de décharge ${nom} !\n\nTon RPE moyen (${ctx.rpe || '—'}/10) est OK.\nContinue ta progression normale.\n\nRappel : une décharge est recommandée toutes les 4-6 semaines.`;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Analyse progression
  // ════════════════════════════════════════════════════════
  _raisonnerProgression(ctx) {
    const nom = ctx.nom;

    const top = Object.entries(ctx.prs)
      .filter(([,v]) => v.rm1 > 0 && v.ancienPR?.rm1)
      .sort(([,a],[,b]) => {
        const gA = ((a.rm1 - (a.ancienPR?.rm1||a.rm1)) / Math.max(a.ancienPR?.rm1||1,1)) * 100;
        const gB = ((b.rm1 - (b.ancienPR?.rm1||b.rm1)) / Math.max(b.ancienPR?.rm1||1,1)) * 100;
        return gB - gA;
      })
      .slice(0, 4);

    if (!top.length) {
      return `Continue tes séances ${nom} — les données de progression arrivent ! 💪\n\nTu as ${ctx.seancesTotales} séances et ${ctx.nbPRs} records.`;
    }

    const lignes = top.map(([ref, pr]) => {
      const ex  = (window.EXERCICES||{})[ref];
      const gain = pr.rm1 - (pr.ancienPR?.rm1 || pr.rm1);
      const pct  = Math.round((gain / Math.max(pr.ancienPR?.rm1||1,1)) * 100);
      return `  • ${ex?.nom||ref} : +${gain}kg 1RM (+${pct}%) 📈`;
    });

    return `Ta progression ${nom} 📈\n\nMeilleures évolutions :\n${lignes.join('\n')}\n\nStreak : ${ctx.streak} jours 🔥\nTendance : ${ctx.tendance === 'hausse'?'📈 Hausse':ctx.tendance==='baisse'?'📉 Baisse':'➡️ Stable'}\n\n💡 ${ctx.tendance==='hausse'?'Excellente trajectoire — maintiens le cap !':'La régularité prime toujours sur l\'intensité.'}`;
  },

  // ════════════════════════════════════════════════════════
  // _raisonnerRemplacement (identique v6.0)
  // ════════════════════════════════════════════════════════
  _raisonnerRemplacement(q, ctx) {
    const nom  = ctx.nom;
    const lieu = ctx.lieu || 'salle';
    const exoMentionne = Object.entries(window.EXERCICES||{})
      .find(([,ex]) => q.includes(ex.nom.toLowerCase()));
    if (exoMentionne) {
      const [ref, exo] = exoMentionne;
      try {
        const similaires = window.ExercicesFilter
          ?.getSimilaires(ref, lieu) || [];
        if (similaires.length > 0) {
          const liste = similaires.slice(0,4)
            .map(s => `  • ${s.emoji} ${s.nom}`).join('\n');
          return `Alternatives pour **${exo.nom}** (${lieu}) ${nom} :\n\n${liste}\n\nTous ciblent le même muscle. 💪`;
        }
      } catch(e) {}
      return `Je n'ai pas trouvé d'alternatives pour ${exo.nom} ${nom}.`;
    }
    return `Quel exercice veux-tu remplacer ${nom} ? Précise le nom ! 💪`;
  },

  // ════════════════════════════════════════════════════════
  // _raisonnerIA (v6.0 + enrichissements v7.0)
  // ════════════════════════════════════════════════════════
  _raisonnerIA(q, ctx, prs = {}) {
    const nom   = ctx.nom;
    const genre = ctx.genre || 'homme';
    const lieu  = ctx.lieu  || 'salle';
    const muscles = ctx.muscles || [];

    if (q.includes('pr') || q.includes('record')
        || q.includes('max') || q.includes('meilleur')) {
      const top = Object.entries(prs)
        .filter(([,v]) => v.rm1 > 0)
        .sort((a,b) => (b[1].rm1||0)-(a[1].rm1||0))
        .slice(0,5)
        .map(([ref, pr]) => {
          const ex = window.EXERCICES?.[ref];
          return `  • ${ex?.nom||ref}: ${pr.poids}kg × ${pr.reps} (~${pr.rm1}kg 1RM)`;
        });
      if (!top.length)
        return `Tu n'as pas encore de records ${nom}. Lance ta première séance !`;
      return `Tes meilleurs records ${nom} 🏆\n\n${top.join('\n')}\n\n${ctx.nbPRs} records au total 💪`;
    }

    if (q.includes('fatigu') || q.includes('récup')
        || q.includes('repos') || q.includes('douleur')
        || q.includes('mal')   || q.includes('épuisé')) {
      if (ctx.rpe !== 0 && ctx.rpe >= 8) {
        return `Ton RPE moyen est de ${ctx.rpe}/10 — c'est élevé ${nom} ⚠️\n\nConseils :\n  • -30-40% charges\n  • Prioriser le sommeil (7-9h)\n  • Augmenter les protéines\n  • 1 séance légère max\n\nLa récupération = progression !`;
      }
      return `La récupération est la moitié de l'entraînement ${nom} :\n\n  • 48h entre groupes musculaires\n  • 7-9h de sommeil\n  • Hydratation : 35ml/kg/jour\n  • Protéines : 1.6-2.2g/kg\n\nTon corps se construit au repos 💤`;
    }

    if (q.includes('programme') || q.includes('séance')
        || q.includes('aujourd') || q.includes('faire')
        || q.includes('entraîn')) {
      const phaseMsg = {
        'Reprise':      '🌱 Focus technique. Charges légères, mouvements parfaits.',
        'Construction': '🏗️ Volume élevé. +2.5kg dès que tu complètes toutes les séries.',
        'Intensité':    '💥 Charges lourdes, faible volume. Priorité aux compound.',
        'Peak':         '🏆 Charges maximales — semaine des records !',
        'Décharge':     '😴 Charges légères 55%. Récupération et technique.'
      };
      const musclesCtx = muscles.length > 0
        ? `\n\nMuscles ciblés : ${muscles.join(', ')}`
        : '';
      return `Tu es en phase **${ctx.phase}** ${nom}.\n\n${phaseMsg[ctx.phase]||phaseMsg['Reprise']}${musclesCtx}\n\nVolume cette semaine : ${Utils.formatVolume(ctx.volumeSemaine)}\nStreak : ${ctx.streak} jours 🔥\nLieu : ${lieu==='salle'?'🏋️ Salle':lieu==='maison'?'🏠 Maison':'🌳 Dehors'}`;
    }

    if (q.includes('manger') || q.includes('nutrition')
        || q.includes('protéine') || q.includes('calorie')
        || q.includes('régime')) {
      let poids = 80;
      try { poids = Tracker.getProfil().poids || 80; } catch(e) {}
      const facteurGenre = genre === 'femme' ? 0.85 : 1;
      const prot = Math.round(poids * 2 * facteurGenre);
      const cal  = Math.round(poids * (genre==='femme'?30:35));
      const eau  = (poids * 0.035).toFixed(1);
      const objMsg = {
        prise_masse:`\n  • Surplus : +300kcal/jour`,
        perte_poids:`\n  • Déficit : -300kcal/jour`,
        seche:      `\n  • Déficit : -400kcal/jour, glucides bas`,
        force:      `\n  • Légère surplus : +200kcal`,
        endurance:  `\n  • Glucides hauts : 5-7g/kg`
      }[ctx.objectif] || '';
      return `Recommandations pour toi ${nom} (${poids}kg${genre==='femme'?' 🌸':''}) 🥗\n\n  • Protéines : ${prot}g/jour\n  • Calories : ~${cal} kcal/jour${objMsg}\n  • Eau : ${eau}L minimum\n  • Repas 2-3h avant séance\n  • Post-séance : prot + gluc dans 30min 🎯`;
    }

    if (q.includes('motiv') || q.includes('envie')
        || q.includes('abandon') || q.includes('dur')) {
      const msgs = genre === 'femme' ? [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais. 🌸`,
        `Les jours difficiles font les athlètes durables ${nom}. Streak de ${ctx.streak} jours — tu n'es pas du genre à abandonner. 💪`
      ] : [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais.`,
        `Les jours difficiles font les athlètes durables ${nom}. Streak de ${ctx.streak} jours.`
      ];
      return Utils.random(msgs);
    }

    if (q.includes('streak') || q.includes('consécutif')) {
      if (ctx.streak === 0)
        return `Ton streak est à 0 ${nom}. Une séance aujourd'hui et c'est parti 🔥`;
      const qualif = ctx.streak>=21?'exceptionnel — top 1%'
                   :ctx.streak>=14?'excellent'
                   :ctx.streak>=7 ?'très bien':'un bon début';
      return `Ton streak : **${ctx.streak} jours** 🔥\n\nC'est ${qualif} ${nom} ! Continue 💪`;
    }

    if (q.includes('muscle') || q.includes('volume')
        || q.includes('répartition') || q.includes('cibl')) {
      try {
        const volumeParMuscle = Tracker.getVolumeParMuscle(7);
        if (volumeParMuscle.length > 0) {
          const top3 = volumeParMuscle.slice(0,3)
            .map(m => `  • ${m.muscle} : ${m.pourcentage}% (${m.intensite})`);
          const negliges = volumeParMuscle
            .filter(m => m.intensite==='faible').slice(0,2)
            .map(m => `  • ${m.muscle}`);
          let msg = `Analyse musculaire ${nom} 💪\n\nPlus travaillés :\n${top3.join('\n')}`;
          if (negliges.length>0) msg += `\n\nÀ ne pas négliger :\n${negliges.join('\n')}`;
          if (muscles.length>0)  msg += `\n\n🎯 Zones prioritaires : ${muscles.join(', ')}`;
          return msg;
        }
      } catch(e) {}
      return `Fais quelques séances pour voir l'analyse musculaire ${nom} ! 💪`;
    }

    if (q.includes('bonjour') || q.includes('salut')
        || q.includes('hello') || q.includes('hey')
        || q.includes('coucou')) {
      const lieuLabel = lieu==='salle'?'🏋️ salle'
                      :lieu==='maison'?'🏠 maison':'🌳 dehors';
      return `${this._salutation()} ${nom} ! ${genre==='femme'?'🌸':'👋'}\n\nJe suis ton Coach IA PowerApp.\n\nJe peux t'aider avec :\n  💪 Tes records & progression\n  📅 Ton planning & programme\n  🥗 Nutrition\n  😴 Récupération & décharge\n  🔮 Prédictions de PRs\n  🔥 Motivation\n  💪 Tes muscles ciblés\n  🧠 Générer un programme IA\n\nDe quoi as-tu besoin ? 🎯`;
    }

    return Utils## 🤖 Feature 1 — Coach IA Conversationnel v7.0

Le coach actuel est bon mais je vais l'**upgrader massivement** avec :
---

## 📦 PATCH coach.js — Nouvelles méthodes à ajouter

```javascript
/* ============================================================
   PowerApp — Coach IA v7.0 PATCH
   Ajouter ces méthodes dans const Coach = { ... }
   AVANT la dernière accolade }
   ============================================================ */

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Analyse proactive
  // Appelée automatiquement à l'ouverture du coach
  // ════════════════════════════════════════════════════════
  getAnalyseProactive() {
    const alertes  = [];
    const conseils = [];

    // ── Vérification surcharge ──────────────────────────
    try {
      const surcharge = Tracker.getSurchargeMusculaire();
      surcharge.forEach(s => {
        alertes.push({
          type:    'surcharge',
          emoji:   '⚠️',
          message: `${s.muscle} en surcharge — ${s.conseil}`,
          urgent:  true
        });
      });
    } catch(e) {}

    // ── Vérification blessures ──────────────────────────
    try {
      const blessures = (Tracker.getBlessuresActives?.()
        || Tracker.getBlessures?.().filter(b => b.active) || []);
      blessures.forEach(b => {
        alertes.push({
          type:    'blessure',
          emoji:   '🩹',
          message: `Blessure active : ${b.zone} — écoute ton corps`,
          urgent:  true
        });
      });
    } catch(e) {}

    // ── RPE élevé ───────────────────────────────────────
    try {
      const rpe = Tracker.getRPEMoyen7Jours();
      if (rpe >= 8.5) {
        alertes.push({
          type:    'rpe',
          emoji:   '🔴',
          message: `RPE moyen ${rpe}/10 — décharge recommandée`,
          urgent:  true
        });
      } else if (rpe >= 7.5) {
        conseils.push({
          type:    'rpe_eleve',
          emoji:   '🟠',
          message: `RPE ${rpe}/10 — maintiens sans augmenter`
        });
      }
    } catch(e) {}

    // ── Absence prolongée ───────────────────────────────
    try {
      const absence = Tracker.getJoursAbsence();
      if (absence >= 7) {
        alertes.push({
          type:    'absence',
          emoji:   '🌱',
          message: `${absence} jours d'absence — reprends à -20% charges`
        });
      } else if (absence >= 3) {
        conseils.push({
          type:    'absence_courte',
          emoji:   '⏰',
          message: `${absence} jours sans séance — c'est le moment de reprendre !`
        });
      }
    } catch(e) {}

    // ── Streak en danger ────────────────────────────────
    try {
      const streak = Tracker.getStreak();
      if (streak.count >= 7 && Tracker.getJoursAbsence() === 0) {
        conseils.push({
          type:    'streak',
          emoji:   '🔥',
          message: `Streak de ${streak.count} jours — ne laisse pas tomber aujourd'hui !`
        });
      }
    } catch(e) {}

    // ── Objectif séances semaine ─────────────────────────
    try {
      const seances  = Tracker.getSeancesParSemaine();
      const objectif = Utils.storage.get(
        'ft_objectif_seances_semaine', 4
      );
      const joursRestants = 7 - new Date().getDay();
      const manquantes    = objectif - seances;
      if (manquantes > 0 && manquantes <= joursRestants) {
        conseils.push({
          type:    'objectif_semaine',
          emoji:   '📅',
          message: `${manquantes} séance${manquantes > 1 ? 's' : ''} `
            + `restante${manquantes > 1 ? 's' : ''} pour atteindre `
            + `ton objectif hebdo !`
        });
      }
    } catch(e) {}

    // ── Hydratation ─────────────────────────────────────
    try {
      const eau    = Nutrition?.getEau?.() || 0;
      const objEau = Nutrition?.getObjectifs?.()?.eau || 2.5;
      if (eau < objEau * 500 && new Date().getHours() >= 14) {
        conseils.push({
          type:    'hydratation',
          emoji:   '💧',
          message: `Seulement ${(eau/1000).toFixed(1)}L aujourd'hui — hydrate-toi !`
        });
      }
    } catch(e) {}

    // ── PR proche ───────────────────────────────────────
    try {
      const prs      = Tracker.getAllPRs();
      const prProche = Object.entries(prs)
        .filter(([, pr]) => {
          if (!pr.rm1) return false;
          const reco = Tracker.getSuggestionCharge
            ?.([Object.keys(prs)]);
          return false; // placeholder
        }).slice(0, 1);
      // Simplified — check recent progression
      const topEx = Object.entries(prs)
        .filter(([, pr]) => pr.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0));
      if (topEx) {
        const [ref, pr] = topEx;
        const ex = (window.EXERCICES || {})[ref];
        if (ex && pr.date === Utils.ajouterJours(Utils.aujourd_hui(), -1)) {
          conseils.push({
            type:    'pr_recent',
            emoji:   '🏆',
            message: `PR hier sur ${ex.nom} ! Récupère bien avant la prochaine séance.`
          });
        }
      }
    } catch(e) {}

    return { alertes, conseils };
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — Réponses enrichies
  // ════════════════════════════════════════════════════════
  _raisonnerIAV7(q, ctx, prs = {}) {

    const nom   = ctx.nom;
    const genre = ctx.genre || 'homme';
    const e     = genre === 'femme' ? 'e' : '';

    // ── Charges / suggestion ────────────────────────────
    if (q.includes('charge') || q.includes('poids')
        || q.includes('combien') || q.includes('suggèr')
        || q.includes('mettre') || q.includes('utiliser')) {

      // Détecter l'exercice mentionné
      const exoTrouve = Object.entries(window.EXERCICES || {})
        .find(([, ex]) =>
          q.includes(ex.nom.toLowerCase())
          || q.includes(ex.emoji)
        );

      if (exoTrouve) {
        const [ref, exo] = exoTrouve;
        const pr         = prs[ref];
        let msg          = `Charge suggérée pour **${exo.nom}** ${nom} :\n\n`;

        if (pr?.rm1) {
          msg += `  • Ton 1RM estimé : ${pr.rm1}kg\n\n`;
          msg += `  📊 Zones d'entraînement :\n`;
          msg += `  • Endurance (50%) : ${Math.round(pr.rm1*0.50)}kg × 15-20\n`;
          msg += `  • Volume    (65%) : ${Math.round(pr.rm1*0.65)}kg × 10-12\n`;
          msg += `  • Hypertro  (75%) : ${Math.round(pr.rm1*0.75)}kg × 8-10\n`;
          msg += `  • Force     (85%) : ${Math.round(pr.rm1*0.85)}kg × 5-6\n`;
          msg += `  • Max       (95%) : ${Math.round(pr.rm1*0.95)}kg × 2-3\n\n`;

          try {
            const suggestion = Tracker.getSuggestionCharge(ref);
            if (suggestion) {
              msg += `  💡 Suggestion pour ta prochaine séance :\n`;
              msg += `  **${suggestion.poids}kg** (${suggestion.raison})`;
            }
          } catch(e2) {}
        } else {
          msg += `  Pas encore de PR enregistré pour cet exercice.\n`;
          msg += `  Commence avec une charge confortable et note tes séries !`;
        }
        return msg;
      }

      // Pas d'exercice précis → conseils généraux
      const top5 = Object.entries(prs)
        .filter(([, v]) => v.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
        .slice(0, 5);

      if (top5.length === 0)
        return `Fais quelques séances pour que je puisse te suggérer des charges ${nom} ! 💪`;

      const liste = top5.map(([ref, pr]) => {
        const ex  = (window.EXERCICES||{})[ref];
        const sug = Math.round(pr.rm1 * 0.75 / 2.5) * 2.5;
        return `  • ${ex?.nom||ref} : ${sug}kg (75% de ${pr.rm1}kg)`;
      }).join('\n');

      return `Charges suggérées (75% 1RM) ${nom} 💪\n\n${liste}\n\nAjuste selon ton énergie du jour ! 🎯`;
    }

    // ── Comparaison semaines ─────────────────────────────
    if (q.includes('progress') || q.includes('évolution')
        || q.includes('améliorer') || q.includes('compar')
        || q.includes('mieux')) {
      try {
        const comp   = Tracker.getComparaisonSemaines();
        const vol8   = Tracker.getVolumeParSemaine(8);
        const trend  = comp.delta;
        const tendance = trend > 5  ? '📈 En forte progression'
                       : trend > 0  ? '📈 En légère progression'
                       : trend > -5 ? '➡️ Stable'
                       :              '📉 En baisse';

        let msg = `Analyse de ta progression ${nom} :\n\n`;
        msg += `  ${tendance}\n`;
        msg += `  • Cette semaine : ${Utils.formatVolume(comp.cette)}\n`;
        msg += `  • Semaine préc. : ${Utils.formatVolume(comp.prec)}\n`;
        msg += `  • Évolution     : ${trend >= 0 ? '+' : ''}${trend}%\n\n`;

        if (vol8.length > 0) {
          const maxVol = Math.max(...vol8.map(v => v.volume));
          const minVol = Math.min(...vol8.map(v => v.volume));
          msg += `  Sur 8 semaines :\n`;
          msg += `  • Pic  : ${Utils.formatVolume(maxVol)}\n`;
          msg += `  • Creux : ${Utils.formatVolume(minVol)}\n\n`;
        }

        msg += trend > 5
          ? `  💚 Excellente progression — continue comme ça !`
          : trend > 0
            ? `  💙 Bonne direction — essaie +5% volume la semaine prochaine.`
            : `  💡 Stagnation ? Varie les exercices ou augmente les charges.`;

        return msg;
      } catch(e2) {
        return `Fais plusieurs séances pour voir ta progression ${nom} ! 💪`;
      }
    }

    // ── Récupération et sommeil ──────────────────────────
    if (q.includes('sommeil') || q.includes('dormir')
        || q.includes('nuit')) {
      return `Le sommeil est l'arme secrète des athlètes ${nom} 😴\n\n`
        + `  🌙 7-9h par nuit minimum\n`
        + `  🌡️ Chambre fraîche (17-19°C)\n`
        + `  📵 Pas d'écran 1h avant\n`
        + `  🥛 Caséine ou cottage cheese avant de dormir\n`
        + `  💧 Hydratation le soir (pas de caféine après 14h)\n\n`
        + `  📊 Tes données :\n`
        + `  • RPE moyen : ${ctx.rpe}\n`
        + `  • Fatigue : ${ctx.fatigue}\n\n`
        + (ctx.rpe !== 'aucune donnée' && parseFloat(ctx.rpe) >= 8
          ? `  ⚠️ Ton RPE élevé suggère un déficit de récupération — priorise le sommeil !`
          : `  ✅ Tes données semblent correctes — maintiens ce rythme.`);
    }

    // ── Blessure spécifique ──────────────────────────────
    if (q.includes('bless') || q.includes('douleur')
        || q.includes('mal à') || q.includes('souffr')) {

      const zones = {
        'épaule': {
          eviter:      ['Développé couché lourd', 'Développé militaire derrière la nuque', 'Écarté lourd'],
          alternatives:['Rotation externe', 'Face pull câble', 'Pompes légères'],
          conseil:     'Renforce la coiffe des rotateurs. Évite les charges lourdes 2-3 semaines.'
        },
        'genou': {
          eviter:      ['Squat profond', 'Fentes avant', 'Leg extension lourd'],
          alternatives:['Hip thrust', 'Leg curl', 'Presse avec angle modéré'],
          conseil:     'Travaille les ischio-jambiers pour protéger le genou. Ice 15min après séance.'
        },
        'dos': {
          eviter:      ['Soulevé de terre lourd', 'Good morning', 'Squat lourd'],
          alternatives:['Tirage câble assis', 'Extension dos léger', 'Planche'],
          conseil:     'Renforce le core. Technique parfaite sur toutes les charges. Kiné si persistant.'
        },
        'poignet': {
          eviter:      ['Développé barre', 'Curl barre droite', 'Front squat'],
          alternatives:['Curl haltères neutres', 'Poussées haltères', 'Machines'],
          conseil:     'Bandage + chaleur avant séance. Haltères ou machines plutôt que barre.'
        },
        'coude': {
          eviter:      ['Dips lesté', 'Extension triceps lourd', 'Curl barre'],
          alternatives:['Curl haltères prise neutre', 'Extension poulie légère'],
          conseil:     'Golfer/Tennis elbow — repos 1 semaine puis reprise progressive.'
        },
        'cheville': {
          eviter:      ['Fentes', 'Squat lourd', 'Mollets lourd'],
          alternatives:['Presse cuisses', 'Hip thrust', 'Exercices assis'],
          conseil:     'Élévation + ice 15min. Kinésithérapeute si gonflé.'
        }
      };

      const zoneDetectee = Object.entries(zones).find(([z]) =>
        q.includes(z)
      );

      if (zoneDetectee) {
        const [zone, info] = zoneDetectee;
        return `Douleur à l'${zone} ${nom} — voici mon analyse 🩺\n\n`
          + `  🚫 À éviter maintenant :\n`
          + info.eviter.map(e => `  • ${e}`).join('\n')
          + `\n\n  ✅ Alternatives sûres :\n`
          + info.alternatives.map(a => `  • ${a}`).join('\n')
          + `\n\n  💡 Conseil : ${info.conseil}\n\n`
          + `  ⚠️ Si la douleur persiste > 1 semaine, consulte un professionnel de santé.`;
      }

      return `Douleur détectée ${nom} 🩺\n\n`
        + `  Règles générales :\n`
        + `  • Douleur aiguë → arrête l'exercice immédiatement\n`
        + `  • Ice 15min après séance\n`
        + `  • Repos 48-72h minimum\n`
        + `  • Reprends à -50% charges\n`
        + `  • Consulte un professionnel si > 1 semaine\n\n`
        + `  Précise la zone (épaule, genou, dos, poignet...) pour plus de détails ! 🎯`;
    }

    // ── Cardio / endurance ───────────────────────────────
    if (q.includes('cardio') || q.includes('course')
        || q.includes('vélo') || q.includes('natation')
        || q.includes('endurance') || q.includes('souffle')) {
      return `Cardio & musculation ${nom} 🏃\n\n`
        + `  ✅ Comment combiner :\n`
        + `  • Cardio APRÈS la muscu (pas avant)\n`
        + `  • 2-3 séances cardio/semaine max\n`
        + `  • HIIT 20min > Cardio 60min lent\n`
        + `  • Cardio à jeun OK si objectif : perte de gras\n\n`
        + `  📊 Pour ton objectif (${ctx.objectif}) :\n`
        + (ctx.objectif === 'prise_masse'
          ? `  • Limite le cardio — il coupe la récupération\n  • 1-2x/semaine max, 20-30min`
          : ctx.objectif === 'seche' || ctx.objectif === 'perte_poids'
          ? `  • 2-3x/semaine HIIT (4min effort/2min repos)\n  • Marche quotidienne 7000 pas/jour`
          : `  • 2x/semaine — équilibre parfait muscu/cardio`);
    }

    // ── Suppléments ──────────────────────────────────────
    if (q.includes('supplément') || q.includes('whey')
        || q.includes('créatine') || q.includes('bcaa')
        || q.includes('protéine en poudre')) {
      const priorite = ctx.objectif === 'prise_masse' || ctx.objectif === 'force'
        ? 'créatine + whey'
        : ctx.objectif === 'seche'
        ? 'whey + caféine'
        : 'whey';

      return `Suppléments recommandés pour toi ${nom} 💊\n\n`
        + `  🥇 Priorité absolue (${priorite}) :\n`
        + `  • Whey : 25-30g post-séance (dans 30min)\n`
        + (ctx.objectif === 'prise_masse' || ctx.objectif === 'force'
          ? `  • Créatine monohydrate : 5g/jour (n'importe quand)\n`
          : '')
        + (ctx.objectif === 'seche'
          ? `  • Caféine : 200mg avant séance (si toléré)\n`
          : '')
        + `\n  💛 Secondaires :\n`
        + `  • Vitamine D3 : 2000-4000 UI/jour\n`
        + `  • Magnésium : 300mg le soir\n`
        + `  • Oméga-3 : 2-3g/jour\n\n`
        + `  🚫 À éviter :\n`
        + `  • Boosters pre-workout agressifs\n`
        + `  • BCAA (inutiles si whey suffisant)\n`
        + `  • "Fat burners" — marketing 95%\n\n`
        + `  💡 La base : alimentation + sommeil > tous les suppléments !`;
    }

    // ── Test 1RM ─────────────────────────────────────────
    if (q.includes('1rm') || q.includes('1 rm')
        || q.includes('répétition max')
        || q.includes('max')) {
      const topPrs = Object.entries(prs)
        .filter(([, v]) => v.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
        .slice(0, 5);

      if (!topPrs.length)
        return `Pas encore de données 1RM ${nom}. Lance des séances pour voir tes estimations ! 💪`;

      const liste = topPrs.map(([ref, pr]) => {
        const ex = (window.EXERCICES||{})[ref];
        return `  • ${ex?.emoji||'💪'} ${ex?.nom||ref} : ~${pr.rm1}kg (${pr.poids}kg × ${pr.reps})`;
      }).join('\n');

      return `Tes 1RM estimés ${nom} 🏋️\n\n${liste}\n\n`
        + `  💡 Formule Brzycki utilisée\n`
        + `  📈 Objectif pour prochaine séance :\n`
        + topPrs.slice(0,1).map(([ref, pr]) => {
          const ex = (window.EXERCICES||{})[ref];
          return `  • ${ex?.nom||ref} : vise ${Math.round((pr.rm1 * 0.85)/2.5)*2.5}kg × 5 (85% 1RM)`;
        }).join('');
    }

    // ── Planning / prochaine séance ──────────────────────
    if (q.includes('aujourd\'hui') || q.includes('maintenant')
        || q.includes('ce soir') || q.includes('quelle séance')
        || q.includes('quoi faire')) {
      try {
        const seanceDuJour = Programme.getSeanceduJour();
        if (!seanceDuJour) {
          const prochaine = Programme.getProchaineSeance?.();
          return prochaine
            ? `Aujourd'hui c'est repos ${nom} 😴\n\nProchaine séance : ${prochaine.emoji} ${prochaine.nom} dans ${prochaine.dansJours} jour${prochaine.dansJours>1?'s':''}\n\nProfites-en pour récupérer et bien manger ! 💤`
            : `Jour de repos ${nom} 😴 — récupération active recommandée.`;
        }

        const seanceComplete = Programme.getSeanceComplete?.(seanceDuJour.id);
        const exos = seanceComplete?.exercicesDetails?.slice(0, 4) || [];
        const exosList = exos.map(ex => {
          const sugg = this.suggererCharge(ex.ref);
          const exoData = ex.details || {};
          return `  • ${exoData.emoji||'💪'} ${exoData.nom||ex.ref} — ${sugg ? sugg.charge + 'kg recommandés' : ex.series + 'x' + ex.reps}`;
        }).join('\n');

        return `Séance du jour ${nom} 💪\n\n`
          + `  ${seanceDuJour.emoji} **${seanceDuJour.nom}**\n`
          + `  ~${seanceDuJour.duree_estimee}min · ${seanceDuJour.exercices?.length||0} exercices\n\n`
          + (exosList ? `  Top exercices :\n${exosList}\n\n` : '')
          + `  🎯 Conseils pour aujourd'hui :\n`
          + `  • RPE cible : ${ctx.rpe !== 'aucune donnée' ? Math.min(9, parseFloat(ctx.rpe)+0.5)+'/10' : '7-8/10'}\n`
          + `  • Échauffement : 5-10min obligatoire\n`
          + `  • Hydratation : 500ml avant + 250ml/heure\n\n`
          + `  Tape "Démarrer" pour lancer la séance ! ▶️`;
      } catch(e2) {
        return `Je ne trouve pas ta séance du jour ${nom}. Va dans Programme pour la voir ! 📅`;
      }
    }

    // ── Poids / corps / IMC ──────────────────────────────
    if (q.includes('poids') || q.includes('maigrir')
        || q.includes('grossir') || q.includes('imc')
        || q.includes('corps') || q.includes('transformation')) {
      try {
        const profil  = Tracker.getProfil();
        const mesure  = Tracker.getDerniereMesure?.() || {};
        const poids   = mesure.poids || profil.poids || 0;
        const taille  = mesure.taille || profil.taille || 0;
        const imc     = poids && taille
          ? (poids / ((taille/100) ** 2)).toFixed(1) : null;
        const imcLabel= !imc ? '—'
          : imc < 18.5 ? '🔵 Maigreur'
          : imc < 25   ? '🟢 Normal'
          : imc < 30   ? '🟡 Surpoids'
          :              '🔴 Obésité';

        return `Analyse corporelle ${nom} ⚖️\n\n`
          + `  • Poids actuel : ${poids || '—'}kg\n`
          + `  • Taille : ${taille || '—'}cm\n`
          + `  • IMC : ${imc || '—'} (${imcLabel})\n\n`
          + `  💡 Pour ton objectif (${ctx.objectif}) :\n`
          + (ctx.objectif === 'prise_masse'
            ? `  • Vise +0.5kg/semaine max (prise propre)\n  • Protéines : 2.2g/kg\n  • Surplus : +300-400 kcal`
            : ctx.objectif === 'perte_poids' || ctx.objectif === 'seche'
            ? `  • Vise -0.5kg/semaine max (préserve le muscle)\n  • Protéines : 2g/kg (anti-catabolisme)\n  • Déficit : -400 kcal max`
            : `  • Maintiens ton poids actuel\n  • Focus sur la composition corporelle\n  • Recomp : même poids, moins de gras`)
          + `\n\n  📸 Prends des photos mensuelles — la balance ne dit pas tout !`;
      } catch(e2) {
        return `Configure ton profil pour voir ton analyse corporelle ${nom} ! 👤`;
      }
    }

    // ── Aide / que peux-tu faire ─────────────────────────
    if (q.includes('aide') || q.includes('peux-tu')
        || q.includes('capable') || q.includes('fonction')
        || q.includes('commande')) {
      return `Voici tout ce que je peux faire pour toi ${nom} 🤖\n\n`
        + `  💪 **Entraînement**\n`
        + `  • Analyse ta progression\n`
        + `  • Suggère des charges par exercice\n`
        + `  • Explique quelle séance faire aujourd'hui\n`
        + `  • Indique tes 1RM et zones d'entraînement\n\n`
        + `  😴 **Récupération**\n`
        + `  • Détecte la surcharge et la fatigue\n`
        + `  • Conseille sur les blessures\n`
        + `  • Recommande une décharge\n\n`
        + `  🥗 **Nutrition**\n`
        + `  • Calcule tes macros personnalisées\n`
        + `  • Conseille sur les suppléments\n`
        + `  • Timing des repas\n\n`
        + `  🧠 **Programme**\n`
        + `  • Génère un programme IA complet\n`
        + `  • Remplace des exercices\n`
        + `  • Adapte le volume\n\n`
        + `  📊 **Stats**\n`
        + `  • Analyse ta semaine\n`
        + `  • Compare tes performances\n`
        + `  • Prédit tes prochains records\n\n`
        + `  Pose-moi n'importe quelle question ! 🎯`;
    }

    // ── Fallback — déléguer à v6 ─────────────────────────
    return this._raisonnerIA(q, ctx, prs);
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v7.0 — renderCoachTabV7
  // Remplace renderCoachTab avec bannière proactive
  // ════════════════════════════════════════════════════════
  renderCoachTabV7(container) {
    if (!container) return;

    // Récupérer analyse proactive
    const proactive = this.getAnalyseProactive();
    const profil    = this._getProfilOnboarding();
    let nom         = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}

    // Injecter bannières proactives AVANT le chat
    const bannieres = [
      ...proactive.alertes.map(a => `
        <div style="background:rgba(255,141,150,0.08);
                    border:1px solid rgba(255,141,150,0.3);
                    border-left:3px solid var(--fd-coral);
                    border-radius:var(--radius-lg);
                    padding:10px 14px;margin-bottom:8px;
                    display:flex;align-items:center;gap:10px">
          <span style="font-size:1.2rem">${a.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.75rem;font-weight:700;
                        color:var(--fd-coral)">
              Alerte Coach IA
            </div>
            <div style="font-size:.72rem;color:var(--text-secondary);
                        margin-top:2px">${a.message}</div>
          </div>
        </div>`),
      ...proactive.conseils.map(c => `
        <div style="background:rgba(75,75,249,0.06);
                    border:1px solid rgba(75,75,249,0.2);
                    border-left:3px solid var(--fd-indigo);
                    border-radius:var(--radius-lg);
                    padding:10px 14px;margin-bottom:8px;
                    display:flex;align-items:center;gap:10px">
          <span style="font-size:1.2rem">${c.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.75rem;font-weight:700;
                        color:var(--fd-indigo)">
              Conseil du Coach
            </div>
            <div style="font-size:.72rem;color:var(--text-secondary);
                        margin-top:2px">${c.message}</div>
          </div>
        </div>`)
    ].join('');

    // Injecter les bannières dans le DOM après le rendu standard
    this.renderCoachTab(container);

    // Trouver le premier card et insérer avant
    const firstCard = container.querySelector('.card');
    if (firstCard && bannieres) {
      const div   = document.createElement('div');
      div.innerHTML = bannieres;
      container.insertBefore(div, firstCard);
    }

    // ── Upgrade envoyerMessage pour utiliser v7 ──────────
    const origEnvoyer = this.envoyerMessage.bind(this);
    this._envoyerMessageV7 = async (question) => {
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
        nom, seancesTotales:seances,
        streak:       streak.count,
        joursAbsence: absence === -1 ? 'jamais' : `${absence} jours`,
        rpe:          rpe > 0 ? `${rpe}/10` : 'aucune donnée',
        fatigue:      fatigue ? `niveau ${fatigue.niveau}/4` : 'non renseignée',
        humeur:       humeur?.humeur || 'non renseignée',
        phase:        phase?.phase?.nom || 'Reprise',
        volume:       Utils.formatVolume(volume),
        nbPRs:        Object.keys(prs).length,
        genre:        profil.genre          || 'homme',
        lieu:         profil.lieu           || 'salle',
        muscles:      profil.muscles_cibles || [],
        objectif:     profil.objectif       || 'forme',
        niveau:       profil.niveau         || 'intermediaire'
      };

      const q = question.toLowerCase();

      // ── Délégations spéciales ──────────────────────────
      if (q.includes('remplace') || q.includes('alternative')
          || q.includes('substitut')) {
        return this._raisonnerRemplacement(q, ctx);
      }

      if (q.includes('génère') || q.includes('crée')
          || q.includes('nouveau programme')
          || q.includes('programme ia')) {
        setTimeout(() => {
          Coach.ProgrammeIA._modeQuestionnaire = true;
          Coach.ProgrammeIA._etapeActuelle     = 0;
          Coach.ProgrammeIA._reponses          = {};
          naviguer('adaptatif');
        }, 800);
        return `Je lance le questionnaire ${nom} ! 🧠\nRéponds aux questions → programme sur mesure instantané !`;
      }

      // ── IA v7 en priorité ──────────────────────────────
      const reponseV7 = this._raisonnerIAV7(q, ctx, prs);

      const hist = this._historique;
      hist.push(
        { role:'user',      content:question  },
        { role:'assistant', content:reponseV7 }
      );
      if (hist.length > 30) hist.splice(0, hist.length - 30);
      this._historique = hist;

      return reponseV7;
    };

    // ── Remplacer temporairement envoyerMessage ──────────
    const chatInput = container.querySelector('#coach-input');
    const chatBtn   = container.querySelector(
      'button[onclick*="_envoyerChat"]'
    );

    // Patcher _envoyerChat pour utiliser v7
    this._origEnvoyerMessage      = this.envoyerMessage;
    this.envoyerMessage           = this._envoyerMessageV7;
  }
