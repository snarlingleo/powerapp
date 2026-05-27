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

'use strict';

const Coach = {
   // ════════════════════════════════════════════════════════
// getAnalyseSemaine — requis par app.js _rendreHome()
// ════════════════════════════════════════════════════════
getAnalyseSemaine() {
  try {
    const seances  = Tracker.getSeancesParSemaine()    || 0;
    const objectif = Utils.storage.get(
      'ft_objectif_seances_semaine', 4
    );
    const volume   = Tracker.getVolumeSemaine()        || 0;
    const rpe      = Tracker.getRPEMoyen7Jours()       || 0;
    return {
      seances,
      objectif,
      volume,
      rpe: rpe > 0 ? parseFloat(rpe.toFixed(1)) : 0
    };
  } catch(e) {
    return { seances:0, objectif:4, volume:0, rpe:0 };
  }
},

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
  // Mémoire persistante
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
        genre: 'homme', lieu: 'salle',
        muscles_cibles: [], objectif: 'forme',
        niveau: 'intermediaire', nom: 'Athlète'
      });
    } catch(e) {
      return {
        genre: 'homme', lieu: 'salle',
        muscles_cibles: [], objectif: 'forme',
        niveau: 'intermediaire', nom: 'Athlète'
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // Contexte enrichi
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
      seancesTotales: 0,
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

    try { ctx.nom            = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { ctx.seancesTotales = Tracker.getTotalSeances();             } catch(e) {}
    try {
      const s = Tracker.getStreak();
      ctx.streak    = s.count;
      ctx.streakMax = s.max;
    } catch(e) {}
    try { ctx.joursAbsence  = Tracker.getJoursAbsence();               } catch(e) {}
    try { ctx.rpe           = Tracker.getRPEMoyen7Jours();              } catch(e) {}
    try { ctx.fatigue       = Tracker.getFatigue();                     } catch(e) {}
    try { ctx.humeur        = Tracker.getHumeur();                      } catch(e) {}
    try { ctx.volumeSemaine = Tracker.getVolumeSemaine();               } catch(e) {}
    try { ctx.prs           = Tracker.getAllPRs();                      } catch(e) {}
    try { ctx.nbPRs         = Object.keys(ctx.prs).length;              } catch(e) {}
    try { ctx.phase         = Programme.getInfosProgramme()?.phase?.nom || 'Reprise'; } catch(e) {}
    try { ctx.scoreForme    = Tracker.calculerScoreForme()?.score || 0; } catch(e) {}
    try { ctx.blessures     = Tracker.getBlessures().filter(b => b.active); } catch(e) {}
    try { ctx.surcharge     = Tracker.getSurchargeMusculaire();         } catch(e) {}
    try { ctx.seanceDuJour  = Tracker.getSeanceDuJour();                } catch(e) {}

    try {
      const comp = Tracker.getComparaisonSemaines();
      if (comp.delta > 10)       ctx.tendance = 'hausse';
      else if (comp.delta < -10) ctx.tendance = 'baisse';
      else                       ctx.tendance = 'stable';
    } catch(e) {}

    try {
  if (typeof Predict !== 'undefined') {
    ctx.prochainPR = Predict.prochainPRPotentiel?.() || null;
  }
} catch(e) {}

    return ctx;
  },

  // ════════════════════════════════════════════════════════
  // MESSAGE DU JOUR
  // ════════════════════════════════════════════════════════
  getMessageDuJour() {
    let humeur = null, fatigue = null;
    let rpe = 0, absence = -1;
    let infos  = { phase: { nom: 'Reprise', emoji: '💡' } };
    let streak = { count: 0, max: 0 };
    let nom = 'Athlète', total = 0;
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre || 'homme';

    try { humeur  = Tracker.getHumeur();                   } catch(e) {}
    try { fatigue = Tracker.getFatigue();                  } catch(e) {}
    try { rpe     = Tracker.getRPEMoyen7Jours();           } catch(e) {}
    try { absence = Tracker.getJoursAbsence();             } catch(e) {}
    try { infos   = Programme.getInfosProgramme();         } catch(e) {}
    try { streak  = Tracker.getStreak();                   } catch(e) {}
    try { nom     = Tracker.getProfil().nom || 'Athlète';  } catch(e) {}
    try { total   = Tracker.getTotalSeances();             } catch(e) {}

    try {
      const seanceDuJour = Tracker.getSeanceDuJour();
      if (seanceDuJour?.complete) {
        const prs = seanceDuJour.prs || [];
        if (prs.length > 0) {
          const ex = window.EXERCICES?.[prs[0].exerciceRef];
          return {
            type: 'pr', emoji: '🏆',
            message: `INCROYABLE ${nom} ! Tu as battu ton record sur ${ex?.nom || prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! ${prs.length > 1 ? `Et ${prs.length - 1} autre(s) PR !` : ''} 🎉`
          };
        }
        return {
          type: 'seance_faite', emoji: '✅',
          message: `Séance terminée ${nom} ! ${seanceDuJour.volumeTotal ? `${Utils.formatVolume(seanceDuJour.volumeTotal)} de volume.` : ''} Récupère bien 💪`
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
      return { type: 'bienvenue', emoji: '👋', message: Utils.random(msgs) };
    }

    if (absence >= 7) {
      return {
        type: 'reprise', emoji: '🌱',
        message: Utils.random(genre === 'femme' ? [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges. 🌸`
        ] : [
          `Bonne reprise ${nom} ! Peu importe la pause — ce qui compte c'est d'être là. -20% sur les charges.`
        ])
      };
    }

    if (absence >= 3) {
      return {
        type: 'relance', emoji: '🔥',
        message: `Te revoilà ${nom} ! Le corps attendait ça. Une séance même courte remet tout en route.`
      };
    }

    if (rpe > 0 && rpe >= 8.5) {
      return {
        type: 'deload', emoji: '⚡',
        message: `RPE moyen ${rpe}/10 ${nom}. Ton corps envoie un signal. Aujourd'hui : -40% charges, technique parfaite.`
      };
    }

    if ((fatigue?.niveau || 0) >= 3) {
      return {
        type: 'fatigue', emoji: '😴',
        message: `Tu te sens épuisé${genre === 'femme' ? 'e' : ''} ${nom} — écoute ton corps : technique parfaite sur charges modérées.`
      };
    }

    if (['😒', '😤'].includes(humeur?.humeur)) {
      return {
        type: 'motivation', emoji: '💡',
        message: `Pas dans ton assiette ${nom} ? Les meilleures séances arrivent parfois quand on s'y attend le moins.`
      };
    }

    if (humeur?.humeur === '🔥' && (fatigue?.niveau || 0) <= 1) {
      return {
        type: 'peak', emoji: '🚀',
        message: `Tu es en feu ${nom} ! Corps frais, mental affûté — c'est le moment de tenter un PR !`
      };
    }

    if (streak.count >= 14) {
      return {
        type: 'streak', emoji: '🏆',
        message: `${streak.count} jours consécutifs ${nom} — c'est impressionnant ! Continue sur cette lancée.`
      };
    }

    const muscles = profil.muscles_cibles || [];
    if (muscles.length > 0) {
      const labels = {
        pectoraux: 'pectoraux', deltoides: 'épaules',
        biceps: 'biceps', triceps: 'triceps',
        abdominaux: 'abdos', quadriceps: 'quadriceps',
        dorsal: 'dos', fessiers: 'fessiers',
        ischio: 'ischio-jambiers', mollets: 'mollets'
      };
      const musclesNoms = muscles.slice(0, 2)
        .map(m => labels[m] || m).join(' et ');
      return {
        type: 'muscles_cibles', emoji: '🎯',
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
      type: 'programme', emoji: infos.phase?.emoji || '💡',
      message: Utils.random(msgs[phase] || msgs['Reprise'])
    };
  },

  // ════════════════════════════════════════════════════════
  // Messages proactifs
  // ════════════════════════════════════════════════════════
  getMessagesProactifs() {
    const ctx   = this._getContexteComplet();
    const msgs  = [];
    const genre = ctx.genre;
    const e     = genre === 'femme' ? 'e' : '';

    if (ctx.scoreForme > 0 && ctx.scoreForme < 40) {
      msgs.push({
        type:    'alerte',
        emoji:   '⚠️',
        titre:   'Score de forme bas',
        message: `Ton score est à ${ctx.scoreForme}/100. Priorité récupération : sommeil + nutrition + hydratation.`,
        action:  null
      });
    }

    if (ctx.prochainPR) {
      msgs.push({
        type:    'opportunite',
        emoji:   '🎯',
        titre:   'PR en vue !',
        message: `${ctx.prochainPR.message}`,
        action:  { label: 'Voir les prédictions', page: 'predict' }
      });
    }

    if (ctx.tendance === 'baisse' && ctx.seancesTotales > 5) {
      msgs.push({
        type:    'conseil',
        emoji:   '📉',
        titre:   'Volume en baisse',
        message: `Ton volume est en baisse cette semaine. Ajoute une série par exercice pour relancer la progression.`,
        action:  null
      });
    }

    if (ctx.streak === 0 && ctx.joursAbsence === 1) {
      msgs.push({
        type:    'urgence',
        emoji:   '🔥',
        titre:   'Streak en danger !',
        message: `Tu n'as pas encore entraîné${e} aujourd'hui — même 20min sauvera ton streak !`,
        action:  { label: 'Démarrer une séance', page: 'live' }
      });
    }

    if (ctx.blessures.length > 0) {
      msgs.push({
        type:    'attention',
        emoji:   '🩹',
        titre:   `${ctx.blessures.length} blessure${ctx.blessures.length > 1 ? 's' : ''} active${ctx.blessures.length > 1 ? 's' : ''}`,
        message: `Zones affectées : ${ctx.blessures.map(b => b.zone).join(', ')}. Consulte les exercices alternatifs.`,
        action:  { label: 'Voir les blessures', page: 'blessures' }
      });
    }

    if (ctx.surcharge.length > 0) {
      msgs.push({
        type:    'alerte',
        emoji:   '⚠️',
        titre:   'Surcharge musculaire',
        message: `${ctx.surcharge.map(s => `${s.muscle}: ${s.conseil}`).join(' · ')}`,
        action:  null
      });
    }

    return msgs.slice(0, 3);
  },

  // ════════════════════════════════════════════════════════
  // Post séance message
  // ════════════════════════════════════════════════════════
  getPostSeanceMessage(seanceData = {}) {
    const profil = this._getProfilOnboarding();
    const genre  = profil.genre || 'homme';
    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    const { volumeTotal = 0, nbSeries = 0, prs = [], duree = 0 } = seanceData;
    const e = genre === 'femme' ? 'e' : '';
    if (prs.length >= 3)
      return `🏆 SÉANCE LÉGENDAIRE ${nom} ! ${prs.length} nouveaux records ! Tu es inarrêtable${e} ! 🔥`;
    if (prs.length > 0) {
      const ex = window.EXERCICES?.[prs[0].exerciceRef];
      return `🏆 PR sur ${ex?.nom || prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! Bravo ${nom} ! 💪`;
    }
    if (volumeTotal > 8000)
      return `💥 Volume monstre ${nom} ! ${Utils.formatVolume(volumeTotal)} — ton corps va adorer ça ! 🔥`;
    if (duree > 75 * 60)
      return `⏱ Séance marathon terminée ${nom} ! ${Utils.formatDuree(duree)} de travail. Récupère bien 💤`;
    const msgs = genre === 'femme' ? [
      `Séance terminée ${nom} ! Tes efforts d'aujourd'hui construisent tes résultats de demain. 🌸`,
      `GG ${nom} ! Une séance de plus dans la boîte. Chaque rep compte ! 💪`
    ] : [
      `Séance terminée ${nom} ! ${volumeTotal > 0 ? `${Utils.formatVolume(volumeTotal)} soulevés.` : ''} Récupère bien. 💪`,
      `GG ${nom} ! Le travail paie toujours.`
    ];
    return Utils.random(msgs);
  },

  // ════════════════════════════════════════════════════════
  // envoyerMessage
  // ════════════════════════════════════════════════════════
  async envoyerMessage(question) {
    const ctx = this._getContexteComplet();
    const q   = question.toLowerCase();

    if (q.includes('génère') || q.includes('crée')
        || q.includes('programme ia') || q.includes('générer')) {
      if (typeof Coach !== 'undefined' && Coach?.ProgrammeIA) {
        setTimeout(() => {
          Coach.ProgrammeIA._modeQuestionnaire = true;
          Coach.ProgrammeIA._etapeActuelle     = 0;
          Coach.ProgrammeIA._reponses          = {};
          naviguer('adaptatif');
        }, 800);
      }
      return `Je lance le questionnaire pour toi ${ctx.nom} ! 🧠\n\nRéponds aux questions et ton programme sur mesure sera généré instantanément !`;
    }

    if (q.includes('remplace') || q.includes('alternative')
        || q.includes('substitut') || q.includes('à la place')) {
      return this._raisonnerRemplacement(q, ctx);
    }

    if (q.includes('prédi') || q.includes('proch')
        || q.includes('estime') || q.includes('futur')
        || q.includes('potentiel') || q.includes('quand')) {
      return this._raisonnerPrediction(ctx);
    }

    if (q.includes('plan') || q.includes('semaine')
        || q.includes('planning') || q.includes('organisation')) {
      return this._raisonnerPlanSemaine(ctx);
    }

    if (q.includes('décharge') || q.includes('deload')
        || q.includes('repos semaine') || q.includes('récupération semaine')) {
      return this._raisonnerDeload(ctx);
    }

    if (q.includes('progress') || q.includes('évolution')
        || q.includes('améliore') || q.includes('résultat')) {
      return this._raisonnerProgression(ctx);
    }

    const reponse = this._raisonnerIAV7(q, ctx, ctx.prs);

    const hist = this._historique;
    hist.push(
      { role: 'user',      content: question },
      { role: 'assistant', content: reponse  }
    );
    if (hist.length > 40) hist.splice(0, hist.length - 40);
    this._historique = hist;
    this._sauvegarderHistorique();

    return reponse;
  },

  // ════════════════════════════════════════════════════════
  // Raisonnement prédiction
  // ════════════════════════════════════════════════════════
  _raisonnerPrediction(ctx) {
    const nom = ctx.nom;

    try {
      const preds = Predict.getToutesPredictons?.() || [];
      if (preds.length > 0) {
        const top3 = preds.slice(0, 3).map(p =>
          `  • ${p.emoji || '💪'} ${p.nom} : ${p.message}`
        );
        return `Prédictions IA pour toi ${nom} 🔮\n\n${top3.join('\n')}\n\nScore de forme actuel : ${ctx.scoreForme}/100\nTendance : ${ctx.tendance === 'hausse' ? '📈 Hausse' : ctx.tendance === 'baisse' ? '📉 Baisse' : '➡️ Stable'}`;
      }
    } catch(e) {}

    const prs = ctx.prs;
    if (!Object.keys(prs).length)
      return `Fais quelques séances d'abord ${nom} — je pourrai ensuite prédire tes prochains records ! 💪`;

    const top = Object.entries(prs)
      .filter(([, v]) => v.rm1 > 0)
      .sort(([, a], [, b]) => (b.rm1 || 0) - (a.rm1 || 0))
      .slice(0, 3);

    const preds = top.map(([ref, pr]) => {
      const ex   = (window.EXERCICES || {})[ref];
      const gain = ctx.tendance === 'hausse' ? 5
                 : ctx.tendance === 'baisse' ? 0 : 2.5;
      const futur = Math.round((pr.rm1 + gain) / 2.5) * 2.5;
      return `  • ${ex?.nom || ref} : ${pr.rm1}kg → ~${futur}kg (dans 4 semaines)`;
    });

    return `Prédictions sur 4 semaines ${nom} 🔮\n\nBasé sur ta tendance (${ctx.tendance}) :\n\n${preds.join('\n')}\n\n💡 Continue ta progression — chaque séance compte !`;
  },

  // ════════════════════════════════════════════════════════
  // Plan semaine intelligent
  // ════════════════════════════════════════════════════════
  _raisonnerPlanSemaine(ctx) {
    const nom   = ctx.nom;
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    let planning = [];
    try { planning = Programme.getSeancesSemaine() || []; } catch(e) {}

    if (!planning.length) {
      return `Je n'ai pas encore ton planning ${nom}.\n\nVa dans 🧠 Programme IA pour en générer un adapté à :\n  • Ton objectif : ${ctx.objectif}\n  • Ton lieu : ${ctx.lieu}\n  • Ton niveau : ${ctx.niveau}`;
    }

    const seancesRestantes = planning.filter(j => !j.seance && j.seanceId).length;
    const seancesFaites    = planning.filter(j => j.estFaite).length;

    const lignes = planning.map(j => {
      if (!j.seanceId) return `  😴 ${j.label || jours[j.jour]} — Repos`;
      const icon = j.estFaite ? '✅' : '📋';
      const nomS = j.seance?.nom || j.seanceId;
      return `  ${icon} ${j.label || jours[j.jour]} — ${nomS}`;
    });

    return `Planning semaine ${nom} 📅\n\n${lignes.join('\n')}\n\n✅ Faites : ${seancesFaites}\n📋 Restantes : ${seancesRestantes}\n\n💡 ${seancesRestantes > 0 ? 'Tu es sur la bonne voie — continue !' : 'Semaine complète, bravo !'}`;
  },

  // ════════════════════════════════════════════════════════
  // Conseil déload
  // ════════════════════════════════════════════════════════
  _raisonnerDeload(ctx) {
    const nom = ctx.nom;

    let deload = { oui: false, raison: '' };
    try { deload = this.necessiteDeload(); } catch(e) {}

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
  // Analyse progression
  // ════════════════════════════════════════════════════════
  _raisonnerProgression(ctx) {
    const nom = ctx.nom;

    const top = Object.entries(ctx.prs)
      .filter(([, v]) => v.rm1 > 0 && v.ancienPR?.rm1)
      .sort(([, a], [, b]) => {
        const gA = ((a.rm1 - (a.ancienPR?.rm1 || a.rm1)) / Math.max(a.ancienPR?.rm1 || 1, 1)) * 100;
        const gB = ((b.rm1 - (b.ancienPR?.rm1 || b.rm1)) / Math.max(b.ancienPR?.rm1 || 1, 1)) * 100;
        return gB - gA;
      })
      .slice(0, 4);

    if (!top.length) {
      return `Continue tes séances ${nom} — les données de progression arrivent ! 💪\n\nTu as ${ctx.seancesTotales} séances et ${ctx.nbPRs} records.`;
    }

    const lignes = top.map(([ref, pr]) => {
      const ex   = (window.EXERCICES || {})[ref];
      const gain = pr.rm1 - (pr.ancienPR?.rm1 || pr.rm1);
      const pct  = Math.round((gain / Math.max(pr.ancienPR?.rm1 || 1, 1)) * 100);
      return `  • ${ex?.nom || ref} : +${gain}kg 1RM (+${pct}%) 📈`;
    });

    return `Ta progression ${nom} 📈\n\nMeilleures évolutions :\n${lignes.join('\n')}\n\nStreak : ${ctx.streak} jours 🔥\nTendance : ${ctx.tendance === 'hausse' ? '📈 Hausse' : ctx.tendance === 'baisse' ? '📉 Baisse' : '➡️ Stable'}\n\n💡 ${ctx.tendance === 'hausse' ? 'Excellente trajectoire — maintiens le cap !' : 'La régularité prime toujours sur l\'intensité.'}`;
  },

  // ════════════════════════════════════════════════════════
  // Remplacement exercice
  // ════════════════════════════════════════════════════════
  _raisonnerRemplacement(q, ctx) {
    const nom  = ctx.nom;
    const lieu = ctx.lieu || 'salle';
    const exoMentionne = Object.entries(window.EXERCICES || {})
      .find(([, ex]) => q.includes(ex.nom.toLowerCase()));
    if (exoMentionne) {
      const [ref, exo] = exoMentionne;
      try {
        const similaires = window.ExercicesFilter?.getSimilaires(ref, lieu) || [];
        if (similaires.length > 0) {
          const liste = similaires.slice(0, 4)
            .map(s => `  • ${s.emoji} ${s.nom}`).join('\n');
          return `Alternatives pour **${exo.nom}** (${lieu}) ${nom} :\n\n${liste}\n\nTous ciblent le même muscle. 💪`;
        }
      } catch(e) {}
      return `Je n'ai pas trouvé d'alternatives pour ${exo.nom} ${nom}.`;
    }
    return `Quel exercice veux-tu remplacer ${nom} ? Précise le nom ! 💪`;
  },

  // ════════════════════════════════════════════════════════
  // Raisonnement IA v7 (enrichi)
  // ════════════════════════════════════════════════════════
  _raisonnerIAV7(q, ctx, prs = {}) {
    const nom   = ctx.nom;
    const genre = ctx.genre || 'homme';

    // ── Charges / suggestion ────────────────────────────
    if (q.includes('charge') || q.includes('combien')
        || q.includes('suggèr') || q.includes('mettre')
        || q.includes('utiliser')) {

      const exoTrouve = Object.entries(window.EXERCICES || {})
        .find(([, ex]) => q.includes(ex.nom.toLowerCase()));

      if (exoTrouve) {
        const [ref, exo] = exoTrouve;
        const pr = prs[ref];
        let msg  = `Charge suggérée pour **${exo.nom}** ${nom} :\n\n`;

        if (pr?.rm1) {
          msg += `  • Ton 1RM estimé : ${pr.rm1}kg\n\n`;
          msg += `  📊 Zones d'entraînement :\n`;
          msg += `  • Endurance (50%) : ${Math.round(pr.rm1 * 0.50)}kg × 15-20\n`;
          msg += `  • Volume    (65%) : ${Math.round(pr.rm1 * 0.65)}kg × 10-12\n`;
          msg += `  • Hypertro  (75%) : ${Math.round(pr.rm1 * 0.75)}kg × 8-10\n`;
          msg += `  • Force     (85%) : ${Math.round(pr.rm1 * 0.85)}kg × 5-6\n`;
          msg += `  • Max       (95%) : ${Math.round(pr.rm1 * 0.95)}kg × 2-3\n\n`;
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

      const top5 = Object.entries(prs)
        .filter(([, v]) => v.rm1 > 0)
        .sort(([, a], [, b]) => (b.rm1 || 0) - (a.rm1 || 0))
        .slice(0, 5);

      if (top5.length === 0)
        return `Fais quelques séances pour que je puisse te suggérer des charges ${nom} ! 💪`;

      const liste = top5.map(([ref, pr]) => {
        const ex  = (window.EXERCICES || {})[ref];
        const sug = Math.round(pr.rm1 * 0.75 / 2.5) * 2.5;
        return `  • ${ex?.nom || ref} : ${sug}kg (75% de ${pr.rm1}kg)`;
      }).join('\n');

      return `Charges suggérées (75% 1RM) ${nom} 💪\n\n${liste}\n\nAjuste selon ton énergie du jour ! 🎯`;
    }

    // ── Comparaison semaines ─────────────────────────────
    if (q.includes('progress') || q.includes('évolution')
        || q.includes('améliorer') || q.includes('compar')
        || q.includes('mieux')) {
      try {
        const comp     = Tracker.getComparaisonSemaines();
        const vol8     = Tracker.getVolumeParSemaine(8);
        const trend    = comp.delta;
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
          msg += `  • Pic   : ${Utils.formatVolume(maxVol)}\n`;
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

    // ── Sommeil ──────────────────────────────────────────
    if (q.includes('sommeil') || q.includes('dormir')
        || q.includes('nuit')) {
      return `Le sommeil est l'arme secrète des athlètes ${nom} 😴\n\n`
        + `  🌙 7-9h par nuit minimum\n`
        + `  🌡️ Chambre fraîche (17-19°C)\n`
        + `  📵 Pas d'écran 1h avant\n`
        + `  🥛 Caséine ou cottage cheese avant de dormir\n`
        + `  💧 Pas de caféine après 14h\n\n`
        + (ctx.rpe > 0 && ctx.rpe >= 8
          ? `  ⚠️ Ton RPE élevé (${ctx.rpe}/10) suggère un déficit de récupération — priorise le sommeil !`
          : `  ✅ Continue sur ce rythme.`);
    }

    // ── Blessure ─────────────────────────────────────────
    if (q.includes('bless') || q.includes('douleur')
        || q.includes('mal à') || q.includes('souffr')) {

      const zones = {
        'épaule': {
          eviter:       ['Développé couché lourd', 'Militaire derrière nuque', 'Écarté lourd'],
          alternatives: ['Rotation externe', 'Face pull câble', 'Pompes légères'],
          conseil:      'Renforce la coiffe des rotateurs. Évite les charges lourdes 2-3 semaines.'
        },
        'genou': {
          eviter:       ['Squat profond', 'Fentes avant', 'Leg extension lourd'],
          alternatives: ['Hip thrust', 'Leg curl', 'Presse angle modéré'],
          conseil:      'Travaille les ischio-jambiers. Ice 15min après séance.'
        },
        'dos': {
          eviter:       ['Soulevé de terre lourd', 'Good morning', 'Squat lourd'],
          alternatives: ['Tirage câble assis', 'Extension dos léger', 'Planche'],
          conseil:      'Renforce le core. Technique parfaite. Kiné si persistant.'
        },
        'poignet': {
          eviter:       ['Développé barre', 'Curl barre droite', 'Front squat'],
          alternatives: ['Curl haltères neutres', 'Poussées haltères', 'Machines'],
          conseil:      'Bandage + chaleur avant séance. Préfère haltères ou machines.'
        },
        'coude': {
          eviter:       ['Dips lesté', 'Extension triceps lourd', 'Curl barre'],
          alternatives: ['Curl haltères prise neutre', 'Extension poulie légère'],
          conseil:      'Repos 1 semaine puis reprise progressive.'
        },
        'cheville': {
          eviter:       ['Fentes', 'Squat lourd', 'Mollets lourd'],
          alternatives: ['Presse cuisses', 'Hip thrust', 'Exercices assis'],
          conseil:      'Élévation + ice 15min. Kiné si gonflé.'
        }
      };

      const zoneDetectee = Object.entries(zones).find(([z]) => q.includes(z));

      if (zoneDetectee) {
        const [zone, info] = zoneDetectee;
        return `Douleur à l'${zone} ${nom} 🩺\n\n`
          + `  🚫 À éviter :\n`
          + info.eviter.map(ev => `  • ${ev}`).join('\n')
          + `\n\n  ✅ Alternatives :\n`
          + info.alternatives.map(alt => `  • ${alt}`).join('\n')
          + `\n\n  💡 ${info.conseil}\n\n`
          + `  ⚠️ Si douleur > 1 semaine, consulte un professionnel.`;
      }

      return `Douleur détectée ${nom} 🩺\n\n`
        + `  • Douleur aiguë → arrête immédiatement\n`
        + `  • Ice 15min après séance\n`
        + `  • Repos 48-72h minimum\n`
        + `  • Reprends à -50% charges\n\n`
        + `  Précise la zone (épaule, genou, dos...) ! 🎯`;
    }

    // ── Cardio ───────────────────────────────────────────
    if (q.includes('cardio') || q.includes('course')
        || q.includes('vélo') || q.includes('endurance')) {
      return `Cardio & musculation ${nom} 🏃\n\n`
        + `  • Cardio APRÈS la muscu\n`
        + `  • 2-3 séances/semaine max\n`
        + `  • HIIT 20min > cardio lent 60min\n\n`
        + `  Pour ton objectif (${ctx.objectif}) :\n`
        + (ctx.objectif === 'prise_masse'
          ? `  • 1-2x/semaine max, 20-30min`
          : ctx.objectif === 'seche' || ctx.objectif === 'perte_poids'
          ? `  • 2-3x/semaine HIIT + 7000 pas/jour`
          : `  • 2x/semaine — équilibre parfait`);
    }

    // ── Suppléments ──────────────────────────────────────
    if (q.includes('supplément') || q.includes('whey')
        || q.includes('créatine') || q.includes('bcaa')) {
      return `Suppléments pour toi ${nom} 💊\n\n`
        + `  🥇 Priorité :\n`
        + `  • Whey : 25-30g post-séance\n`
        + (ctx.objectif === 'prise_masse' || ctx.objectif === 'force'
          ? `  • Créatine monohydrate : 5g/jour\n` : '')
        + `\n  💛 Secondaires :\n`
        + `  • Vitamine D3 : 2000-4000 UI/jour\n`
        + `  • Magnésium : 300mg le soir\n`
        + `  • Oméga-3 : 2-3g/jour\n\n`
        + `  🚫 À éviter : BCAA, fat burners, boosters agressifs\n\n`
        + `  💡 Alimentation + sommeil > tous les suppléments !`;
    }

    // ── Fallback → _raisonnerIA ──────────────────────────
    return this._raisonnerIA(q, ctx, prs);
  },

  // ════════════════════════════════════════════════════════
  // Raisonnement IA v6 (fallback)
  // ════════════════════════════════════════════════════════
  _raisonnerIA(q, ctx, prs = {}) {
    const nom     = ctx.nom;
    const genre   = ctx.genre   || 'homme';
    const lieu    = ctx.lieu    || 'salle';
    const muscles = ctx.muscles || [];

    if (q.includes('pr') || q.includes('record')
        || q.includes('max') || q.includes('meilleur')) {
      const top = Object.entries(prs)
        .filter(([, v]) => v.rm1 > 0)
        .sort((a, b) => (b[1].rm1 || 0) - (a[1].rm1 || 0))
        .slice(0, 5)
        .map(([ref, pr]) => {
          const ex = window.EXERCICES?.[ref];
          return `  • ${ex?.nom || ref}: ${pr.poids}kg × ${pr.reps} (~${pr.rm1}kg 1RM)`;
        });
      if (!top.length)
        return `Tu n'as pas encore de records ${nom}. Lance ta première séance !`;
      return `Tes meilleurs records ${nom} 🏆\n\n${top.join('\n')}\n\n${ctx.nbPRs} records au total 💪`;
    }

    if (q.includes('fatigu') || q.includes('récup')
        || q.includes('repos') || q.includes('épuisé')) {
      if (ctx.rpe !== 0 && ctx.rpe >= 8) {
        return `Ton RPE moyen est de ${ctx.rpe}/10 — c'est élevé ${nom} ⚠️\n\n  • -30-40% charges\n  • Sommeil 7-9h\n  • Protéines augmentées\n\nLa récupération = progression !`;
      }
      return `La récupération est la moitié de l'entraînement ${nom} :\n\n  • 48h entre groupes musculaires\n  • 7-9h de sommeil\n  • 35ml/kg/jour d'eau\n  • 1.6-2.2g/kg de protéines 💤`;
    }

    if (q.includes('programme') || q.includes('séance')
        || q.includes('aujourd') || q.includes('entraîn')) {
      const phaseMsg = {
        'Reprise':      '🌱 Focus technique. Charges légères.',
        'Construction': '🏗️ Volume élevé. +2.5kg dès que tu complètes.',
        'Intensité':    '💥 Charges lourdes, faible volume.',
        'Peak':         '🏆 Charges maximales — semaine des records !',
        'Décharge':     '😴 Charges légères 55%. Récupération.'
      };
      const musclesCtx = muscles.length > 0 ? `\n\nMuscles ciblés : ${muscles.join(', ')}` : '';
      return `Tu es en phase **${ctx.phase}** ${nom}.\n\n${phaseMsg[ctx.phase] || phaseMsg['Reprise']}${musclesCtx}\n\nVolume semaine : ${Utils.formatVolume(ctx.volumeSemaine)}\nStreak : ${ctx.streak} jours 🔥`;
    }

    if (q.includes('manger') || q.includes('nutrition')
        || q.includes('protéine') || q.includes('calorie')) {
      let poids = 80;
      try { poids = Tracker.getProfil().poids || 80; } catch(e) {}
      const facteurGenre = genre === 'femme' ? 0.85 : 1;
      const prot = Math.round(poids * 2 * facteurGenre);
      const cal  = Math.round(poids * (genre === 'femme' ? 30 : 35));
      const eau  = (poids * 0.035).toFixed(1);
      return `Recommandations ${nom} (${poids}kg) 🥗\n\n  • Protéines : ${prot}g/jour\n  • Calories : ~${cal} kcal/jour\n  • Eau : ${eau}L minimum\n  • Repas 2-3h avant séance 🎯`;
    }

    if (q.includes('motiv') || q.includes('envie')
        || q.includes('abandon') || q.includes('dur')) {
      const msgs = genre === 'femme' ? [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais. 🌸`,
        `Les jours difficiles font les athlètes durables ${nom}. Streak de ${ctx.streak} jours. 💪`
      ] : [
        `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais.`,
        `Les jours difficiles font les athlètes durables ${nom}. Streak de ${ctx.streak} jours.`
      ];
      return Utils.random(msgs);
    }

    if (q.includes('streak') || q.includes('consécutif')) {
      if (ctx.streak === 0)
        return `Ton streak est à 0 ${nom}. Une séance aujourd'hui et c'est parti 🔥`;
      const qualif = ctx.streak >= 21 ? 'exceptionnel — top 1%'
                   : ctx.streak >= 14 ? 'excellent'
                   : ctx.streak >= 7  ? 'très bien' : 'un bon début';
      return `Ton streak : **${ctx.streak} jours** 🔥\n\nC'est ${qualif} ${nom} ! Continue 💪`;
    }

    if (q.includes('muscle') || q.includes('volume')
        || q.includes('répartition')) {
      try {
        const volumeParMuscle = Tracker.getVolumeParMuscle(7);
        if (volumeParMuscle.length > 0) {
          const top3 = volumeParMuscle.slice(0, 3)
            .map(m => `  • ${m.muscle} : ${m.pourcentage}% (${m.intensite})`);
          const negliges = volumeParMuscle
            .filter(m => m.intensite === 'faible').slice(0, 2)
            .map(m => `  • ${m.muscle}`);
          let msg = `Analyse musculaire ${nom} 💪\n\nPlus travaillés :\n${top3.join('\n')}`;
          if (negliges.length > 0) msg += `\n\nÀ ne pas négliger :\n${negliges.join('\n')}`;
          if (muscles.length > 0)  msg += `\n\n🎯 Priorités : ${muscles.join(', ')}`;
          return msg;
        }
      } catch(e) {}
      return `Fais quelques séances pour voir l'analyse musculaire ${nom} ! 💪`;
    }

    if (q.includes('bonjour') || q.includes('salut')
        || q.includes('hello') || q.includes('hey')
        || q.includes('coucou')) {
      return `${this._salutation()} ${nom} ! ${genre === 'femme' ? '🌸' : '👋'}\n\nJe suis ton Coach IA PowerApp.\n\nJe peux t'aider avec :\n  💪 Records & progression\n  📅 Planning & programme\n  🥗 Nutrition\n  😴 Récupération\n  🔮 Prédictions PRs\n  🔥 Motivation\n  🧠 Générer un programme IA\n\nDe quoi as-tu besoin ? 🎯`;
    }

    return Utils.random([
      `${nom} — je peux t'aider sur :\n  💪 Records\n  📈 Programme\n  😴 Récupération\n  🥗 Nutrition\n  🔥 Motivation\n  🧠 Programme IA\n\nPrécise ! 🎯`,
      `Dis-moi ce que tu cherches ${nom} : force, volume, récupération, nutrition ou programme ?`
    ]);
  },

  // ════════════════════════════════════════════════════════
  // Analyse proactive
  // ════════════════════════════════════════════════════════
  getAnalyseProactive() {
    const alertes  = [];
    const conseils = [];

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

    try {
      const blessures = Tracker.getBlessuresActives?.()
        || Tracker.getBlessures?.().filter(b => b.active)
        || [];
      blessures.forEach(b => {
        alertes.push({
          type:    'blessure',
          emoji:   '🩹',
          message: `Blessure active : ${b.zone} — écoute ton corps`,
          urgent:  true
        });
      });
    } catch(e) {}

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
          message: `${absence} jours sans séance — c'est le moment !`
        });
      }
    } catch(e) {}

    try {
      const streak = Tracker.getStreak();
      if (streak.count >= 7 && Tracker.getJoursAbsence() === 0) {
        conseils.push({
          type:    'streak',
          emoji:   '🔥',
          message: `Streak de ${streak.count} jours — ne laisse pas tomber !`
        });
      }
    } catch(e) {}

    try {
      const seances       = Tracker.getSeancesParSemaine();
      const objectif      = Utils.storage.get('ft_objectif_seances_semaine', 4);
      const joursRestants = 7 - new Date().getDay();
      const manquantes    = objectif - seances;
      if (manquantes > 0 && manquantes <= joursRestants) {
        conseils.push({
          type:    'objectif_semaine',
          emoji:   '📅',
          message: `${manquantes} séance${manquantes > 1 ? 's' : ''} restante${manquantes > 1 ? 's' : ''} pour ton objectif hebdo !`
        });
      }
    } catch(e) {}

    try {
      const eau    = (typeof Nutrition !== 'undefined' && Nutrition?.getEau?.()) || 0;
      const objEau = (typeof Nutrition !== 'undefined' && Nutrition?.getObjectifs?.()?.eau) || 2.5;
      if (eau < objEau * 500 && new Date().getHours() >= 14) {
        conseils.push({
          type:    'hydratation',
          emoji:   '💧',
          message: `Seulement ${(eau / 1000).toFixed(1)}L aujourd'hui — hydrate-toi !`
        });
      }
    } catch(e) {}

    return { alertes, conseils };
  },

  // ════════════════════════════════════════════════════════
  // renderCoachTabV7
  // ════════════════════════════════════════════════════════
  renderCoachTabV7(container) {
    if (!container) return;

    const proactive = this.getAnalyseProactive();

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
            <div style="font-size:.75rem;font-weight:700;color:var(--fd-coral)">
              Alerte Coach IA
            </div>
            <div style="font-size:.72rem;color:var(--text-secondary);margin-top:2px">
              ${a.message}
            </div>
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
            <div style="font-size:.75rem;font-weight:700;color:var(--fd-indigo)">
              Conseil du Coach
            </div>
            <div style="font-size:.72rem;color:var(--text-secondary);margin-top:2px">
              ${c.message}
            </div>
          </div>
        </div>`)
    ].join('');

    if (typeof this.renderCoachTab === 'function') {
      this.renderCoachTab(container);
    }

    if (bannieres) {
      const firstCard = container.querySelector('.card');
      if (firstCard) {
        const div = document.createElement('div');
        div.innerHTML = bannieres;
        container.insertBefore(div, firstCard);
      }
    }

    this._origEnvoyerMessage = this.envoyerMessage;
    this.envoyerMessage      = this.envoyerMessage.bind(this);
  },

  // ════════════════════════════════════════════════════════
  // necessiteDeload (fallback sécurisé)
  // ════════════════════════════════════════════════════════
  necessiteDeload() {
    try {
      const rpe     = Tracker.getRPEMoyen7Jours()  || 0;
      const absence = Tracker.getJoursAbsence()    || 0;
      const fatigue = Tracker.getFatigue()         || { niveau: 0 };

      if (rpe >= 9)
        return { oui: true, raison: `RPE moyen ${rpe}/10 — surentraînement détecté` };
      if ((fatigue.niveau || 0) >= 4)
        return { oui: true, raison: `Fatigue maximale niveau ${fatigue.niveau}/4` };

      return { oui: false, raison: '' };
    } catch(e) {
      return { oui: false, raison: '' };
    }
  }

};

// ════════════════════════════════════════════════════════════
// COACH PROGRAMME IA — Générateur de programmes personnalisés
// ════════════════════════════════════════════════════════════
Coach.ProgrammeIA = {

  _modeQuestionnaire: false,
  _etapeActuelle:     0,
  _reponses:          {},

  // ── Styles de programmes disponibles ──────────────────
  STYLES: {
    ppl: {
      label:      'Push Pull Legs',
      styleLabel: 'Push Pull Legs',
      emoji:      '🔄',
      description:'3 séances — Push / Pull / Jambes',
      joursMin:   3, joursMax: 6,
      seances:    ['pec_tri', 'dos_bi', 'jambes']
    },
    upper_lower: {
      label:      'Upper / Lower',
      styleLabel: 'Upper Lower',
      emoji:      '⚖️',
      description:'Haut / Bas du corps en alternance',
      joursMin:   2, joursMax: 4,
      seances:    ['pec_tri', 'jambes', 'epaules_bras', 'jambes']
    },
    full_body: {
      label:      'Full Body',
      styleLabel: 'Full Body',
      emoji:      '🔥',
      description:'Corps complet à chaque séance',
      joursMin:   2, joursMax: 4,
      seances:    ['full_body', 'full_body', 'full_body', 'full_body']
    },
    maison: {
      label:      'Maison / Sans matériel',
      styleLabel: 'Maison',
      emoji:      '🏠',
      description:'Programme sans équipement',
      joursMin:   2, joursMax: 5,
      seances:    ['maison_push', 'maison_pull', 'maison_legs']
    },
    femme_galbe: {
      label:      'Galbe Féminin',
      styleLabel: 'Galbe Féminin',
      emoji:      '🌸',
      description:'Programme galbe et renforcement féminin',
      joursMin:   3, joursMax: 5,
      seances:    ['lower_body_femme', 'upper_body_femme', 'core_femme']
    }
  },

  // ── Questions du questionnaire ─────────────────────────
  QUESTIONS: [
    {
      id:       'objectif',
      question: '🎯 Quel est ton objectif principal ?',
      options:  [
        { label: '💪 Prise de masse',    value: 'prise_masse'  },
        { label: '🔥 Perte de poids',    value: 'perte_poids'  },
        { label: '⚡ Force pure',         value: 'force'        },
        { label: '🏃 Forme générale',    value: 'forme'        },
        { label: '✂️ Sèche',             value: 'seche'        }
      ]
    },
    {
      id:       'niveau',
      question: '📊 Quel est ton niveau ?',
      options:  [
        { label: '🌱 Débutant (< 6 mois)',    value: 'debutant'      },
        { label: '📈 Intermédiaire (6m-2ans)', value: 'intermediaire' },
        { label: '🏆 Avancé (> 2 ans)',        value: 'avance'        }
      ]
    },
    {
      id:       'lieu',
      question: '📍 Où t\'entraînes-tu ?',
      options:  [
        { label: '🏋️ Salle de sport',      value: 'salle'  },
        { label: '🏠 Maison',              value: 'maison' },
        { label: '🌳 Dehors / Parc',       value: 'dehors' }
      ]
    },
    {
      id:       'joursParSemaine',
      question: '📅 Combien de jours par semaine ?',
      options:  [
        { label: '2 jours', value: 2 },
        { label: '3 jours', value: 3 },
        { label: '4 jours', value: 4 },
        { label: '5 jours', value: 5 },
        { label: '6 jours', value: 6 }
      ]
    },
    {
      id:       'genre',
      question: '👤 Tu t\'identifies comme ?',
      options:  [
        { label: '♂️ Homme', value: 'homme' },
        { label: '♀️ Femme', value: 'femme' }
      ]
    }
  ],

  // ── Génération du programme ────────────────────────────
  generer(config) {
    try {
      const {
        objectif          = 'forme',
        niveau            = 'intermediaire',
        lieu              = 'salle',
        nbJours           = 4,
        genre             = 'homme',
        jours_specifiques = null
      } = config;

      // Choisir le style selon le profil
      let styleKey = 'ppl';

      if (lieu === 'maison' || lieu === 'dehors') {
        styleKey = 'maison';
      } else if (genre === 'femme' && objectif !== 'force') {
        styleKey = 'femme_galbe';
      } else if (niveau === 'debutant' || nbJours <= 3) {
        styleKey = 'full_body';
      } else if (nbJours <= 4) {
        styleKey = 'upper_lower';
      } else {
        styleKey = 'ppl';
      }

      const style = this.STYLES[styleKey];

      // Construire le planning
      const joursDispos = jours_specifiques
        || this._genererJours(nbJours);

      const planning = this._construirePlanning(
        style, joursDispos, nbJours, genre, lieu
      );

      // Appliquer le planning
      try {
        Programme.sauvegarderPlanning(planning);
      } catch(e) {}

      // Sauvegarder la config
      const programmeGenere = {
        styleKey,
        styleLabel:   style.styleLabel,
        emoji:        style.emoji,
        objectif,
        niveau,
        lieu,
        nbJours,
        genre,
        planning,
        dateCreation: (typeof Utils !== 'undefined')
          ? Utils.aujourd_hui()
          : new Date().toISOString().slice(0, 10)
      };

      try {
        Utils.storage.set('ft_programme_ia_config', programmeGenere);
      } catch(e) {}

      console.log(
        '[Coach.ProgrammeIA] Programme généré ✅',
        programmeGenere
      );
      return programmeGenere;

    } catch(e) {
      console.error('[Coach.ProgrammeIA] Erreur génération:', e);
      return {
        styleLabel: 'Standard',
        emoji:      '💪',
        planning:   [],
        config
      };
    }
  },

  // ── Construire le planning ─────────────────────────────
  _construirePlanning(style, jours, nbJours, genre, lieu) {
    const planning = Array.from({ length: 7 }, (_, i) => ({
      jour:     i,
      label:    ['LUN','MAR','MER','JEU','VEN','SAM','DIM'][i],
      seanceId: null
    }));

    const seancesStyle   = [...style.seances];
    const seancesAdaptees = seancesStyle.map(s => {
      if (lieu === 'maison' || lieu === 'dehors') {
        if (s === 'pec_tri')      return 'maison_push';
        if (s === 'dos_bi')       return 'maison_pull';
        if (s === 'jambes')       return 'maison_legs';
        if (s === 'epaules_bras') return 'maison_push';
      }
      if (genre === 'femme') {
        if (s === 'jambes')       return 'lower_body_femme';
        if (s === 'full_body')    return 'full_body';
        if (s === 'pec_tri')      return 'upper_body_femme';
        if (s === 'dos_bi')       return 'upper_body_femme';
        if (s === 'epaules_bras') return 'upper_body_femme';
      }
      return s;
    });

    const joursLimites = jours.slice(0, nbJours);
    joursLimites.forEach((jourIdx, i) => {
      const seanceIdx = i % seancesAdaptees.length;
      if (jourIdx >= 0 && jourIdx < 7) {
        planning[jourIdx].seanceId = seancesAdaptees[seanceIdx];
      }
    });

    return planning;
  },

  // ── Générer les jours automatiquement ─────────────────
  _genererJours(nbJours) {
    const patterns = {
      2: [0, 3],
      3: [0, 2, 4],
      4: [0, 1, 3, 4],
      5: [0, 1, 2, 4, 5],
      6: [0, 1, 2, 3, 4, 5]
    };
    return patterns[nbJours] || patterns[4];
  },

  // ── Rendu du questionnaire ─────────────────────────────
  renderQuestionnaire(container) {
    if (!container) return;

    const etape      = this._etapeActuelle;
    const questions  = this.QUESTIONS;

    if (etape >= questions.length) {
      this._finaliserQuestionnaire(container);
      return;
    }

    const q          = questions[etape];
    const progression = Math.round((etape / questions.length) * 100);

    container.innerHTML = `
      <div class="card" style="max-width:480px;margin:0 auto">

        <div style="display:flex;align-items:center;
                    justify-content:space-between;margin-bottom:16px">
          <div style="font-size:.72rem;color:var(--text-muted)">
            Question ${etape + 1} / ${questions.length}
          </div>
          <div style="font-size:.72rem;color:var(--fd-indigo);
                      font-weight:700">
            ${progression}%
          </div>
        </div>

        <div style="height:4px;background:rgba(255,255,255,0.1);
                    border-radius:4px;margin-bottom:24px;overflow:hidden">
          <div style="height:100%;width:${progression}%;
                      background:var(--fd-indigo);
                      border-radius:4px;transition:width .3s"></div>
        </div>

        <div style="font-size:1.05rem;font-weight:700;
                    margin-bottom:20px;line-height:1.4">
          ${q.question}
        </div>

        <div style="display:flex;flex-direction:column;gap:10px">
          ${q.options.map(opt => `
            <button
              onclick="Coach.ProgrammeIA._repondre('${q.id}', ${
                typeof opt.value === 'string'
                  ? `'${opt.value}'`
                  : opt.value
              })"
              style="padding:14px 16px;
                     background:rgba(75,75,249,0.08);
                     border:1px solid rgba(75,75,249,0.2);
                     border-radius:var(--radius-lg);
                     color:var(--text-primary);
                     font-size:.9rem;font-weight:600;
                     text-align:left;cursor:pointer;
                     transition:all .2s"
              onmouseover="this.style.background='rgba(75,75,249,0.2)';
                           this.style.borderColor='var(--fd-indigo)'"
              onmouseout="this.style.background='rgba(75,75,249,0.08)';
                          this.style.borderColor='rgba(75,75,249,0.2)'">
              ${opt.label}
            </button>
          `).join('')}
        </div>

        ${etape > 0 ? `
          <button
            onclick="Coach.ProgrammeIA._precedent()"
            style="margin-top:16px;width:100%;
                   padding:10px;background:transparent;
                   border:1px solid rgba(255,255,255,0.1);
                   border-radius:var(--radius-lg);
                   color:var(--text-muted);font-size:.8rem;
                   cursor:pointer">
            ← Retour
          </button>` : ''}
      </div>
    `;
  },

  // ── Répondre à une question ────────────────────────────
  _repondre(id, valeur) {
    this._reponses[id]  = valeur;
    this._etapeActuelle++;

    const container = document.getElementById('page-adaptatif')
      || document.querySelector('[data-page="adaptatif"]');

    if (this._etapeActuelle >= this.QUESTIONS.length) {
      this._finaliserQuestionnaire(container);
    } else {
      if (container) this.renderQuestionnaire(container);
    }
  },

  // ── Retour question précédente ─────────────────────────
  _precedent() {
    if (this._etapeActuelle > 0) {
      this._etapeActuelle--;
      const container = document.getElementById('page-adaptatif')
        || document.querySelector('[data-page="adaptatif"]');
      if (container) this.renderQuestionnaire(container);
    }
  },

  // ── Finaliser le questionnaire ─────────────────────────
  _finaliserQuestionnaire(container) {
    const rep = this._reponses;

    const config = {
      objectif: rep.objectif        || 'forme',
      niveau:   rep.niveau          || 'intermediaire',
      lieu:     rep.lieu            || 'salle',
      nbJours:  rep.joursParSemaine || 4,
      genre:    rep.genre           || 'homme'
    };

    const programme = this.generer(config);

    // Sync profil onboarding
    try {
      const profil    = Utils.storage.get('ft_profil_onboarding', {});
      profil.objectif = config.objectif;
      profil.niveau   = config.niveau;
      profil.lieu     = config.lieu;
      profil.genre    = config.genre;
      Utils.storage.set('ft_profil_onboarding', profil);
    } catch(e) {}

    // Reset
    this._modeQuestionnaire = false;
    this._etapeActuelle     = 0;
    this._reponses          = {};

    if (container) {
      container.innerHTML = `
        <div class="card"
             style="max-width:480px;margin:0 auto;text-align:center">

          <div style="font-size:3rem;margin-bottom:12px">
            ${programme.emoji}
          </div>

          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-indigo);margin-bottom:8px">
            Programme ${programme.styleLabel} activé !
          </div>

          <div style="font-size:.82rem;color:var(--text-muted);
                      margin-bottom:24px">
            ${programme.nbJours} séances/semaine ·
            ${programme.objectif} · ${programme.lieu}
          </div>

          <div style="display:grid;grid-template-columns:repeat(7,1fr);
                      gap:4px;margin-bottom:24px">
            ${(programme.planning || []).map(j => {
              const hasSeance = !!j.seanceId;
              const seance    = hasSeance
                ? (typeof SEANCES_BASE !== 'undefined'
                    ? SEANCES_BASE[j.seanceId] : null)
                : null;
              return `
                <div style="text-align:center;padding:8px 4px;
                            background:${hasSeance
                              ? 'rgba(75,75,249,0.15)'
                              : 'rgba(255,255,255,0.04)'};
                            border:1px solid ${hasSeance
                              ? 'rgba(75,75,249,0.3)'
                              : 'rgba(255,255,255,0.06)'};
                            border-radius:var(--radius-md)">
                  <div style="font-size:.6rem;color:var(--text-muted);
                              margin-bottom:4px">${j.label}</div>
                  <div style="font-size:1rem">
                    ${hasSeance ? (seance?.emoji || '💪') : '😴'}
                  </div>
                </div>`;
            }).join('')}
          </div>

          <button onclick="naviguer('home')"
                  style="width:100%;padding:14px;
                         background:var(--fd-indigo);
                         color:white;border:none;
                         border-radius:var(--radius-lg);
                         font-size:.95rem;font-weight:700;
                         cursor:pointer">
            C'est parti ! 🚀
          </button>

          <button onclick="Coach.ProgrammeIA._relancer()"
                  style="width:100%;padding:10px;margin-top:8px;
                         background:transparent;
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:var(--radius-lg);
                         color:var(--text-muted);font-size:.8rem;
                         cursor:pointer">
            🔄 Recommencer le questionnaire
          </button>
        </div>
      `;
    }

    try {
      Utils.toast(
        `✅ Programme ${programme.styleLabel} créé !`,
        'success', 3000
      );
    } catch(e) {}
  },

  // ── Relancer le questionnaire ──────────────────────────
  _relancer() {
    this._modeQuestionnaire = true;
    this._etapeActuelle     = 0;
    this._reponses          = {};
    const container = document.getElementById('page-adaptatif')
      || document.querySelector('[data-page="adaptatif"]');
    if (container) this.renderQuestionnaire(container);
  }

};

// ════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════
// renderCoachTab — Page principale Coach IA
// ════════════════════════════════════════════════════════════
renderCoachTab(container) {
  if (!container) return;

  this._chargerHistorique();
  const ctx    = this._getContexteComplet();
  const msg    = this.getMessageDuJour();
  const proact = this.getMessagesProactifs();

  container.innerHTML = `

    <!-- Message du jour -->
    <div style="background:linear-gradient(135deg,
                rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                border:1px solid rgba(75,75,249,0.3);
                border-radius:var(--radius-xl);
                padding:16px;margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--fd-indigo);margin-bottom:6px">
        ${msg.emoji} Coach IA — Message du jour
      </div>
      <p style="font-size:.85rem;color:var(--text-secondary);
                line-height:1.6;margin:0;white-space:pre-line">
        ${msg.message}
      </p>
    </div>

    <!-- Alertes proactives -->
    ${proact.length > 0 ? proact.map(p => `
      <div style="background:${p.type === 'alerte' || p.type === 'urgence'
          ? 'rgba(255,141,150,0.08)'
          : 'rgba(75,75,249,0.06)'};
                  border:1px solid ${p.type === 'alerte' || p.type === 'urgence'
          ? 'rgba(255,141,150,0.25)'
          : 'rgba(75,75,249,0.2)'};
                  border-left:3px solid ${p.type === 'alerte' || p.type === 'urgence'
          ? 'var(--fd-coral)'
          : 'var(--fd-indigo)'};
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:8px">
        <div style="font-size:.72rem;font-weight:700;
                    color:${p.type === 'alerte' || p.type === 'urgence'
                      ? 'var(--fd-coral)' : 'var(--fd-indigo)'};
                    margin-bottom:3px">
          ${p.emoji} ${p.titre}
        </div>
        <div style="font-size:.72rem;color:var(--text-secondary)">
          ${p.message}
        </div>
        ${p.action ? `
          <button onclick="naviguer('${p.action.page}')"
                  style="margin-top:8px;padding:5px 12px;
                         font-size:.65rem;font-weight:700;
                         background:rgba(75,75,249,0.15);
                         border:1px solid rgba(75,75,249,0.3);
                         border-radius:99px;
                         color:var(--fd-indigo);cursor:pointer">
            ${p.action.label} →
          </button>` : ''}
      </div>`).join('') : ''}

    <!-- Accès rapides -->
    <div style="background:rgba(255,255,255,0.03);
                border:1px solid rgba(255,255,255,0.07);
                border-radius:var(--radius-xl);
                padding:14px;margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);margin-bottom:10px">
        ⚡ Accès rapides
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${[
          { emoji:'🔮', label:'Prédictions',      page:'predict'   },
          { emoji:'🏆', label:'Défis',            page:'defis'     },
          { emoji:'🧠', label:'Programme IA',     page:'adaptatif' },
          { emoji:'📊', label:'Statistiques',     page:'stats'     },
          { emoji:'🥗', label:'Nutrition',        page:'nutrition' },
          { emoji:'📈', label:'Progression',      page:'history'   }
        ].map(s => `
          <div onclick="naviguer('${s.page}')"
               style="display:flex;align-items:center;gap:10px;
                      padding:10px 12px;cursor:pointer;
                      background:rgba(255,255,255,0.03);
                      border:1px solid rgba(255,255,255,0.07);
                      border-radius:var(--radius-md);
                      transition:all .2s"
               onmouseenter="this.style.borderColor='rgba(75,75,249,0.3)';
                             this.style.background='rgba(75,75,249,0.06)'"
               onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)';
                             this.style.background='rgba(255,255,255,0.03)'">
            <span style="font-size:1.1rem">${s.emoji}</span>
            <span style="font-size:.78rem;font-weight:600">${s.label}</span>
          </div>`).join('')}
      </div>
    </div>

    <!-- Stats rapides -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);
                gap:8px;margin-bottom:14px">
      ${[
        { emoji:'🔥', val:`${ctx.streak}j`,          label:'Streak',    color:'var(--fd-lemon)'    },
        { emoji:'📊', val:`${ctx.scoreForme}/100`,    label:'Forme',     color:'var(--fd-indigo)'   },
        { emoji:'🏆', val:`${ctx.nbPRs}`,             label:'Records',   color:'var(--fd-mint)'     }
      ].map(s => `
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:12px;text-align:center">
          <div style="font-size:.85rem;margin-bottom:3px">${s.emoji}</div>
          <div style="font-size:.95rem;font-weight:800;color:${s.color}">
            ${s.val}</div>
          <div style="font-size:.58rem;color:var(--text-muted);margin-top:2px">
            ${s.label}</div>
        </div>`).join('')}
    </div>

    <!-- Chat Coach IA -->
    <div style="background:rgba(255,255,255,0.03);
                border:1px solid rgba(255,255,255,0.07);
                border-radius:var(--radius-xl);
                padding:14px;margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);margin-bottom:10px">
        💬 Pose une question au Coach IA
      </div>

      <!-- Historique chat -->
      <div id="coach-chat-messages"
           style="max-height:300px;overflow-y:auto;
                  margin-bottom:10px;scrollbar-width:thin">
        ${this._historique.length === 0 ? `
          <div style="text-align:center;padding:20px;
                      color:var(--text-muted);font-size:.78rem">
            👋 Pose-moi n'importe quelle question sur ton entraînement !
          </div>` :
          this._historique.map(m => `
            <div style="margin-bottom:8px;
                        text-align:${m.role === 'user' ? 'right' : 'left'}">
              <div style="display:inline-block;max-width:85%;
                          padding:10px 14px;
                          background:${m.role === 'user'
                            ? 'var(--fd-indigo)'
                            : 'rgba(255,255,255,0.06)'};
                          border-radius:${m.role === 'user'
                            ? '14px 14px 4px 14px'
                            : '14px 14px 14px 4px'};
                          font-size:.78rem;
                          color:${m.role === 'user'
                            ? 'white' : 'var(--text-primary)'};
                          white-space:pre-line;
                          text-align:left">
                ${m.content}
              </div>
            </div>`).join('')}
      </div>

      <!-- Questions suggérées -->
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">
        ${[
          'Charge pour bench ?',
          'Plan semaine',
          'Mes records',
          'Prédictions',
          'Récupération',
          '🧠 Programme IA'
        ].map(q => `
          <button onclick="Coach._envoyerChat('${q}')"
                  style="padding:4px 10px;font-size:.65rem;
                         font-weight:600;cursor:pointer;
                         background:rgba(75,75,249,0.1);
                         border:1px solid rgba(75,75,249,0.2);
                         border-radius:99px;
                         color:var(--fd-indigo)">
            ${q}
          </button>`).join('')}
      </div>

      <!-- Input chat -->
      <div style="display:flex;gap:8px">
        <input id="coach-input"
               type="text"
               placeholder="Pose ta question..."
               style="flex:1;padding:10px 14px;
                      background:var(--bg-input);
                      border:1px solid var(--border-color);
                      border-radius:var(--radius-full);
                      color:var(--text-primary);
                      font-size:.82rem;outline:none"
               onkeydown="if(event.key==='Enter'){
                 Coach._envoyerChat(this.value);
                 this.value='';
               }"/>
        <button onclick="const inp=document.getElementById('coach-input');
                         Coach._envoyerChat(inp.value);
                         inp.value=''"
                style="padding:10px 18px;background:var(--fd-indigo);
                       border:none;border-radius:var(--radius-full);
                       color:white;font-size:.82rem;
                       font-weight:700;cursor:pointer">
          ▶
        </button>
      </div>
    </div>
  `;

  // Scroll vers le bas du chat
  requestAnimationFrame(() => {
    const chatEl = document.getElementById('coach-chat-messages');
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
  });
},

// ─── Envoyer un message depuis le chat ──────────────────
async _envoyerChat(question) {
  if (!question?.trim()) return;
  const q = question.trim();

  // Ajouter le message utilisateur
  const hist = this._historique;
  hist.push({ role:'user', content:q });
  this._historique = hist;

  // Afficher "en cours"
  const chatEl = document.getElementById('coach-chat-messages');
  if (chatEl) {
    chatEl.innerHTML += `
      <div style="margin-bottom:8px;text-align:right">
        <div style="display:inline-block;max-width:85%;
                    padding:10px 14px;background:var(--fd-indigo);
                    border-radius:14px 14px 4px 14px;
                    font-size:.78rem;color:white">
          ${q}
        </div>
      </div>
      <div id="coach-typing" style="margin-bottom:8px">
        <div style="display:inline-block;padding:10px 14px;
                    background:rgba(255,255,255,0.06);
                    border-radius:14px 14px 14px 4px;
                    font-size:.78rem;color:var(--text-muted)">
          🤖 Coach réfléchit...
        </div>
      </div>`;
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  // Obtenir la réponse
  const reponse = await this.envoyerMessage(q);

  // Remplacer le "en cours"
  const typing = document.getElementById('coach-typing');
  if (typing) {
    typing.outerHTML = `
      <div style="margin-bottom:8px">
        <div style="display:inline-block;max-width:85%;
                    padding:10px 14px;
                    background:rgba(255,255,255,0.06);
                    border-radius:14px 14px 14px 4px;
                    font-size:.78rem;color:var(--text-primary);
                    white-space:pre-line">
          ${reponse}
        </div>
      </div>`;
    if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
  }
}
window.Coach = Coach;
console.log('✅ Coach IA v7.0 chargé');
