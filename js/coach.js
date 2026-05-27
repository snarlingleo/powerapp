/* ============================================================
   PowerApp — Coach IA v7.0
   ============================================================ */

'use strict';

const Coach = {

  // ════════════════════════════════════════════════════════
  // getAnalyseSemaine
  // ════════════════════════════════════════════════════════
  getAnalyseSemaine() {
    try {
      const seances  = Tracker.getSeancesParSemaine() || 0;
      const objectif = Utils.storage.get('ft_objectif_seances_semaine', 4);
      const volume   = Tracker.getVolumeSemaine()     || 0;
      const rpe      = Tracker.getRPEMoyen7Jours()    || 0;
      return { seances, objectif, volume,
               rpe: rpe > 0 ? parseFloat(rpe.toFixed(1)) : 0 };
    } catch(e) {
      return { seances:0, objectif:4, volume:0, rpe:0 };
    }
  },

  // ════════════════════════════════════════════════════════
  // HISTORIQUE CHAT
  // ════════════════════════════════════════════════════════
  get _historique() {
    return window._coachHistorique || (window._coachHistorique = []);
  },
  set _historique(val) {
    window._coachHistorique = val;
  },

  _sauvegarderHistorique() {
    try {
      Utils.storage.set('ft_coach_historique', this._historique.slice(-20));
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
        genre:'homme', lieu:'salle', muscles_cibles:[],
        objectif:'forme', niveau:'intermediaire', nom:'Athlète'
      });
    } catch(e) {
      return { genre:'homme', lieu:'salle', muscles_cibles:[],
               objectif:'forme', niveau:'intermediaire', nom:'Athlète' };
    }
  },

  // ════════════════════════════════════════════════════════
  // CONTEXTE
  // ════════════════════════════════════════════════════════
  _getContexteComplet() {
    const profil = this._getProfilOnboarding();
    let ctx = {
      nom:'Athlète', genre:profil.genre||'homme',
      lieu:profil.lieu||'salle', muscles:profil.muscles_cibles||[],
      objectif:profil.objectif||'forme', niveau:profil.niveau||'intermediaire',
      seancesTotales:0, streak:0, streakMax:0, joursAbsence:-1,
      rpe:0, fatigue:null, humeur:null, volume:0, volumeSemaine:0,
      prs:{}, nbPRs:0, phase:'Reprise', scoreForme:0,
      blessures:[], surcharge:[], seanceDuJour:null,
      prochainPR:null, tendance:'stable'
    };

    try { ctx.nom            = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    try { ctx.seancesTotales = Tracker.getTotalSeances();             } catch(e) {}
    try { const s = Tracker.getStreak(); ctx.streak=s.count; ctx.streakMax=s.max; } catch(e) {}
    try { ctx.joursAbsence   = Tracker.getJoursAbsence();            } catch(e) {}
    try { ctx.rpe            = Tracker.getRPEMoyen7Jours();           } catch(e) {}
    try { ctx.fatigue        = Tracker.getFatigue();                  } catch(e) {}
    try { ctx.humeur         = Tracker.getHumeur();                   } catch(e) {}
    try { ctx.volumeSemaine  = Tracker.getVolumeSemaine();            } catch(e) {}
    try { ctx.prs            = Tracker.getAllPRs();                   } catch(e) {}
    try { ctx.nbPRs          = Object.keys(ctx.prs).length;           } catch(e) {}
    try { ctx.phase          = Programme.getInfosProgramme()?.phase?.nom || 'Reprise'; } catch(e) {}
    try { ctx.scoreForme     = Tracker.calculerScoreForme()?.score || 0; } catch(e) {}
    try { ctx.blessures      = Tracker.getBlessures().filter(b => b.active); } catch(e) {}
    try { ctx.surcharge      = Tracker.getSurchargeMusculaire();      } catch(e) {}
    try { ctx.seanceDuJour   = Tracker.getSeanceDuJour();             } catch(e) {}
    try {
      const comp = Tracker.getComparaisonSemaines();
      ctx.tendance = comp.delta > 10 ? 'hausse' : comp.delta < -10 ? 'baisse' : 'stable';
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
    let humeur=null, fatigue=null, rpe=0, absence=-1;
    let infos={ phase:{ nom:'Reprise', emoji:'💡' } };
    let streak={ count:0, max:0 }, nom='Athlète', total=0;
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
      const sd = Tracker.getSeanceDuJour();
      if (sd?.complete) {
        const prs = sd.prs || [];
        if (prs.length > 0) {
          const ex = window.EXERCICES?.[prs[0].exerciceRef];
          return { type:'pr', emoji:'🏆',
            message:`INCROYABLE ${nom} ! PR sur ${ex?.nom||prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! 🎉` };
        }
        return { type:'seance_faite', emoji:'✅',
          message:`Séance terminée ${nom} ! Récupère bien 💪` };
      }
    } catch(e) {}

    if (absence === -1 || total === 0)
      return { type:'bienvenue', emoji:'👋',
        message:`Bienvenue ${nom} ! C'est ta première séance — bonne chance ! 💪` };

    if (absence >= 7)
      return { type:'reprise', emoji:'🌱',
        message:`Bonne reprise ${nom} ! -20% sur les charges pour commencer.` };

    if (absence >= 3)
      return { type:'relance', emoji:'🔥',
        message:`Te revoilà ${nom} ! Le corps attendait ça.` };

    if (rpe > 0 && rpe >= 8.5)
      return { type:'deload', emoji:'⚡',
        message:`RPE ${rpe}/10 ${nom}. Aujourd'hui : -40% charges, technique parfaite.` };

    if ((fatigue?.niveau||0) >= 3)
      return { type:'fatigue', emoji:'😴',
        message:`Tu te sens épuisé${genre==='femme'?'e':''} ${nom} — charges modérées aujourd'hui.` };

    if (streak.count >= 14)
      return { type:'streak', emoji:'🏆',
        message:`${streak.count} jours consécutifs ${nom} — impressionnant ! Continue.` };

    const msgs = {
      'Reprise':      `Phase Reprise ${nom} : la technique prime.`,
      'Construction': `Phase Construction ${nom} : cherche à dépasser le volume de la semaine dernière.`,
      'Intensité':    `Phase Intensité ${nom} : charges lourdes, concentration max.`,
      'Peak':         `Phase Peak ${nom} : donne tout, PRs en vue !`,
      'Décharge':     `Semaine de décharge ${nom}. Laisse le corps assimiler.`
    };
    const phase = infos.phase?.nom || 'Reprise';
    return { type:'programme', emoji:infos.phase?.emoji||'💡',
             message:msgs[phase] || msgs['Reprise'] };
  },

  // ════════════════════════════════════════════════════════
  // MESSAGES PROACTIFS
  // ════════════════════════════════════════════════════════
  getMessagesProactifs() {
    const ctx  = this._getContexteComplet();
    const msgs = [];
    const e    = ctx.genre === 'femme' ? 'e' : '';

    if (ctx.scoreForme > 0 && ctx.scoreForme < 40)
      msgs.push({ type:'alerte', emoji:'⚠️', titre:'Score de forme bas',
        message:`Score ${ctx.scoreForme}/100. Priorité récupération.`, action:null });

    if (ctx.prochainPR)
      msgs.push({ type:'opportunite', emoji:'🎯', titre:'PR en vue !',
        message:`${ctx.prochainPR.message}`,
        action:{ label:'Prédictions', page:'predict' } });

    if (ctx.tendance === 'baisse' && ctx.seancesTotales > 5)
      msgs.push({ type:'conseil', emoji:'📉', titre:'Volume en baisse',
        message:`Volume en baisse. Ajoute une série par exercice.`, action:null });

    if (ctx.streak === 0 && ctx.joursAbsence === 1)
      msgs.push({ type:'urgence', emoji:'🔥', titre:'Streak en danger !',
        message:`Pas encore entraîné${e} — même 20min sauvera ton streak !`,
        action:{ label:'Démarrer', page:'live' } });

    if (ctx.blessures.length > 0)
      msgs.push({ type:'attention', emoji:'🩹',
        titre:`${ctx.blessures.length} blessure(s) active(s)`,
        message:`Zones : ${ctx.blessures.map(b=>b.zone).join(', ')}.`,
        action:{ label:'Blessures', page:'blessures' } });

    return msgs.slice(0, 3);
  },

  // ════════════════════════════════════════════════════════
  // POST SÉANCE
  // ════════════════════════════════════════════════════════
  getPostSeanceMessage(seanceData = {}) {
    let nom = 'Athlète';
    try { nom = Tracker.getProfil().nom || 'Athlète'; } catch(e) {}
    const { volumeTotal=0, prs=[], duree=0 } = seanceData;
    const genre = this._getProfilOnboarding().genre || 'homme';
    const e = genre === 'femme' ? 'e' : '';

    if (prs.length >= 3)
      return `🏆 SÉANCE LÉGENDAIRE ${nom} ! ${prs.length} records ! 🔥`;
    if (prs.length > 0) {
      const ex = window.EXERCICES?.[prs[0].exerciceRef];
      return `🏆 PR sur ${ex?.nom||prs[0].exerciceRef} — ${prs[0].poids}kg × ${prs[0].reps} ! 💪`;
    }
    if (volumeTotal > 8000)
      return `💥 Volume monstre ${nom} ! ${Utils.formatVolume(volumeTotal)} — 🔥`;
    return `Séance terminée ${nom} ! Récupère bien 💪`;
  },

  // ════════════════════════════════════════════════════════
  // ENVOYER MESSAGE
  // ════════════════════════════════════════════════════════
  async envoyerMessage(question) {
    const ctx = this._getContexteComplet();
    const q   = question.toLowerCase();

    if (q.includes('génère') || q.includes('crée') || q.includes('programme ia')) {
      if (typeof Coach !== 'undefined' && Coach?.ProgrammeIA) {
        setTimeout(() => {
          Coach.ProgrammeIA._modeQuestionnaire = true;
          Coach.ProgrammeIA._etapeActuelle     = 0;
          Coach.ProgrammeIA._reponses          = {};
          naviguer('adaptatif');
        }, 800);
      }
      return `Je lance le questionnaire ${ctx.nom} ! 🧠`;
    }

    if (q.includes('remplace') || q.includes('alternative'))
      return this._raisonnerRemplacement(q, ctx);
    if (q.includes('prédi') || q.includes('proch') || q.includes('quand'))
      return this._raisonnerPrediction(ctx);
    if (q.includes('plan') || q.includes('semaine') || q.includes('planning'))
      return this._raisonnerPlanSemaine(ctx);
    if (q.includes('décharge') || q.includes('deload'))
      return this._raisonnerDeload(ctx);
    if (q.includes('progress') || q.includes('évolution') || q.includes('résultat'))
      return this._raisonnerProgression(ctx);

    const reponse = this._raisonnerIAV7(q, ctx, ctx.prs);

    const hist = this._historique;
    hist.push({ role:'user', content:question }, { role:'assistant', content:reponse });
    if (hist.length > 40) hist.splice(0, hist.length - 40);
    this._historique = hist;
    this._sauvegarderHistorique();

    return reponse;
  },

  // ════════════════════════════════════════════════════════
  // RAISONNEMENTS
  // ════════════════════════════════════════════════════════
  _raisonnerPrediction(ctx) {
    const nom = ctx.nom;
    const prs = ctx.prs;
    if (!Object.keys(prs).length)
      return `Fais quelques séances d'abord ${nom} ! 💪`;

    const top = Object.entries(prs)
      .filter(([,v]) => v.rm1 > 0)
      .sort(([,a],[,b]) => (b.rm1||0)-(a.rm1||0))
      .slice(0,3)
      .map(([ref,pr]) => {
        const ex   = (window.EXERCICES||{})[ref];
        const gain = ctx.tendance==='hausse'?5:ctx.tendance==='baisse'?0:2.5;
        return `  • ${ex?.nom||ref} : ${pr.rm1}kg → ~${Math.round((pr.rm1+gain)/2.5)*2.5}kg`;
      });

    return `Prédictions 4 semaines ${nom} 🔮\n\n${top.join('\n')}\n\nTendance : ${ctx.tendance}`;
  },

  _raisonnerPlanSemaine(ctx) {
    const nom = ctx.nom;
    let planning = [];
    try { planning = Programme.getSeancesSemaine() || []; } catch(e) {}
    if (!planning.length)
      return `Pas encore de planning ${nom}. Va dans 🧠 Programme IA !`;

    const jours  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const lignes = planning.map(j => {
      if (!j.seanceId) return `  😴 ${j.label||jours[j.jour]} — Repos`;
      return `  ${j.estFaite?'✅':'📋'} ${j.label||jours[j.jour]} — ${j.seance?.nom||j.seanceId}`;
    });
    return `Planning semaine ${nom} 📅\n\n${lignes.join('\n')}`;
  },

  _raisonnerDeload(ctx) {
    const nom = ctx.nom;
    let deload = { oui:false, raison:'' };
    try { deload = this.necessiteDeload(); } catch(e) {}
    if (deload.oui)
      return `⚠️ Décharge recommandée ${nom} !\n\nRaison : ${deload.raison}\n\n  • 50-60% des charges\n  • Même volume\n  • Focus technique`;
    return `✅ Pas besoin de décharge ${nom} ! RPE (${ctx.rpe||'—'}/10) OK.`;
  },

  _raisonnerProgression(ctx) {
    const nom = ctx.nom;
    if (!Object.keys(ctx.prs).length)
      return `Continue tes séances ${nom} — ${ctx.seancesTotales} séances, ${ctx.nbPRs} records.`;
    return `Progression ${nom} 📈\n\nStreak : ${ctx.streak} jours 🔥\nTendance : ${ctx.tendance}\nScore forme : ${ctx.scoreForme}/100`;
  },

  _raisonnerRemplacement(q, ctx) {
    const nom = ctx.nom;
    const exo = Object.entries(window.EXERCICES||{})
      .find(([,ex]) => q.includes(ex.nom.toLowerCase()));
    if (exo) return `Alternatives pour ${exo[1].nom} ${nom} — même groupe musculaire. 💪`;
    return `Quel exercice veux-tu remplacer ${nom} ? Précise le nom ! 💪`;
  },

  _raisonnerIAV7(q, ctx, prs = {}) {
    const nom   = ctx.nom;
    const genre = ctx.genre || 'homme';

    if (q.includes('charge') || q.includes('combien') || q.includes('suggèr')) {
      const top5 = Object.entries(prs)
        .filter(([,v]) => v.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0)-(a.rm1||0))
        .slice(0,5);
      if (!top5.length) return `Fais quelques séances ${nom} ! 💪`;
      const liste = top5.map(([ref,pr]) => {
        const ex  = (window.EXERCICES||{})[ref];
        const sug = Math.round(pr.rm1*0.75/2.5)*2.5;
        return `  • ${ex?.nom||ref} : ${sug}kg (75% de ${pr.rm1}kg)`;
      }).join('\n');
      return `Charges suggérées ${nom} 💪\n\n${liste}`;
    }

    if (q.includes('sommeil') || q.includes('dormir'))
      return `Sommeil — arme secrète des athlètes ${nom} 😴\n\n  • 7-9h/nuit\n  • Chambre fraîche\n  • Pas d'écran 1h avant`;

    if (q.includes('bless') || q.includes('douleur'))
      return `Douleur ${nom} 🩺\n\n  • Douleur aiguë → arrête\n  • Ice 15min\n  • Repos 48-72h\n  • Reprends à -50%\n\nPrécise la zone !`;

    if (q.includes('cardio') || q.includes('course'))
      return `Cardio & muscu ${nom} 🏃\n\n  • Cardio APRÈS la muscu\n  • 2-3x/semaine max\n  • HIIT 20min > cardio lent 60min`;

    if (q.includes('supplément') || q.includes('whey') || q.includes('créatine'))
      return `Suppléments ${nom} 💊\n\n  🥇 Whey : 25-30g post-séance\n  🥇 Créatine : 5g/jour\n  💛 Vit D3 + Magnésium + Oméga-3\n\n  🚫 BCAA inutiles !`;

    if (q.includes('pr') || q.includes('record') || q.includes('max')) {
      const top = Object.entries(prs)
        .filter(([,v]) => v.rm1 > 0)
        .sort((a,b) => (b[1].rm1||0)-(a[1].rm1||0))
        .slice(0,5)
        .map(([ref,pr]) => {
          const ex = window.EXERCICES?.[ref];
          return `  • ${ex?.nom||ref}: ${pr.poids}kg × ${pr.reps} (~${pr.rm1}kg 1RM)`;
        });
      if (!top.length) return `Pas encore de records ${nom}. Lance ta première séance !`;
      return `Tes records ${nom} 🏆\n\n${top.join('\n')}\n\n${ctx.nbPRs} records au total 💪`;
    }

    if (q.includes('fatigu') || q.includes('récup') || q.includes('repos'))
      return `Récupération ${nom} 💤\n\n  • 48h entre groupes musculaires\n  • 7-9h de sommeil\n  • 35ml/kg/jour d'eau\n  • 1.6-2.2g/kg protéines`;

    if (q.includes('manger') || q.includes('nutrition') || q.includes('protéine')) {
      let poids = 80;
      try { poids = Tracker.getProfil().poids || 80; } catch(e) {}
      const prot = Math.round(poids * (genre==='femme'?1.7:2));
      const cal  = Math.round(poids * (genre==='femme'?30:35));
      return `Nutrition ${nom} (${poids}kg) 🥗\n\n  • Protéines : ${prot}g/jour\n  • Calories : ~${cal} kcal\n  • Eau : ${(poids*0.035).toFixed(1)}L`;
    }

    if (q.includes('motiv') || q.includes('envie') || q.includes('abandon'))
      return `${nom}, ${ctx.seancesTotales} séances derrière toi. La discipline ne faiblit jamais. Streak : ${ctx.streak} jours 🔥`;

    if (q.includes('bonjour') || q.includes('salut') || q.includes('hello'))
      return `${this._salutation()} ${nom} ! 👋\n\nJe peux t'aider avec :\n  💪 Records\n  📅 Programme\n  🥗 Nutrition\n  😴 Récupération\n  🔮 Prédictions\n  🧠 Générer un programme\n\nDe quoi as-tu besoin ? 🎯`;

    return `${nom} — je peux t'aider sur :\n  💪 Records · 📈 Programme\n  😴 Récupération · 🥗 Nutrition\n  🔥 Motivation · 🧠 Programme IA\n\nPrécise ! 🎯`;
  },

  // ════════════════════════════════════════════════════════
  // ANALYSE PROACTIVE
  // ════════════════════════════════════════════════════════
  getAnalyseProactive() {
    const alertes  = [];
    const conseils = [];

    try {
      Tracker.getSurchargeMusculaire().forEach(s => alertes.push({
        type:'surcharge', emoji:'⚠️',
        message:`${s.muscle} en surcharge — ${s.conseil}`, urgent:true
      }));
    } catch(e) {}

    try {
      (Tracker.getBlessures?.().filter(b=>b.active)||[]).forEach(b => alertes.push({
        type:'blessure', emoji:'🩹',
        message:`Blessure active : ${b.zone}`, urgent:true
      }));
    } catch(e) {}

    try {
      const rpe = Tracker.getRPEMoyen7Jours();
      if (rpe >= 8.5) alertes.push({ type:'rpe', emoji:'🔴',
        message:`RPE ${rpe}/10 — décharge recommandée`, urgent:true });
      else if (rpe >= 7.5) conseils.push({ type:'rpe_eleve', emoji:'🟠',
        message:`RPE ${rpe}/10 — maintiens sans augmenter` });
    } catch(e) {}

    try {
      const absence = Tracker.getJoursAbsence();
      if (absence >= 7) alertes.push({ type:'absence', emoji:'🌱',
        message:`${absence} jours d'absence — reprends à -20%` });
      else if (absence >= 3) conseils.push({ type:'absence_courte', emoji:'⏰',
        message:`${absence} jours sans séance — c'est le moment !` });
    } catch(e) {}

    try {
      const streak = Tracker.getStreak();
      if (streak.count >= 7) conseils.push({ type:'streak', emoji:'🔥',
        message:`Streak de ${streak.count} jours — continue !` });
    } catch(e) {}

    return { alertes, conseils };
  },

  // ════════════════════════════════════════════════════════
  // RENDER COACH TAB V7
  // ════════════════════════════════════════════════════════
  renderCoachTabV7(container) {
    if (!container) return;
    this.renderCoachTab(container);
  },

  // ════════════════════════════════════════════════════════
  // RENDER COACH TAB — Page principale
  // ════════════════════════════════════════════════════════
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
      ${proact.map(p => `
        <div style="background:${p.type==='alerte'||p.type==='urgence'
            ? 'rgba(255,141,150,0.08)' : 'rgba(75,75,249,0.06)'};
                    border:1px solid ${p.type==='alerte'||p.type==='urgence'
            ? 'rgba(255,141,150,0.25)' : 'rgba(75,75,249,0.2)'};
                    border-left:3px solid ${p.type==='alerte'||p.type==='urgence'
            ? 'var(--fd-coral)' : 'var(--fd-indigo)'};
                    border-radius:var(--radius-lg);
                    padding:12px 14px;margin-bottom:8px">
          <div style="font-size:.72rem;font-weight:700;
                      color:${p.type==='alerte'||p.type==='urgence'
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
        </div>`).join('')}

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
            { emoji:'🔮', label:'Prédictions',  page:'predict'   },
            { emoji:'🏆', label:'Défis',        page:'defis'     },
            { emoji:'🧠', label:'Programme IA', page:'adaptatif' },
            { emoji:'📊', label:'Stats',        page:'stats'     },
            { emoji:'🥗', label:'Nutrition',    page:'nutrition' },
            { emoji:'📈', label:'Historique',   page:'history'   }
          ].map(s => `
            <div onclick="naviguer('${s.page}')"
                 style="display:flex;align-items:center;gap:10px;
                        padding:10px 12px;cursor:pointer;
                        background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);transition:all .2s"
                 onmouseenter="this.style.borderColor='rgba(75,75,249,0.3)'"
                 onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)'">
              <span style="font-size:1.1rem">${s.emoji}</span>
              <span style="font-size:.78rem;font-weight:600">${s.label}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Stats rapides -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { emoji:'🔥', val:`${ctx.streak}j`,       label:'Streak',  color:'var(--fd-lemon)'  },
          { emoji:'📊', val:`${ctx.scoreForme}/100`, label:'Forme',   color:'var(--fd-indigo)' },
          { emoji:'🏆', val:`${ctx.nbPRs}`,          label:'Records', color:'var(--fd-mint)'   }
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

      <!-- Chat -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:10px">
          💬 Pose une question au Coach IA
        </div>

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
                          text-align:${m.role==='user'?'right':'left'}">
                <div style="display:inline-block;max-width:85%;
                            padding:10px 14px;
                            background:${m.role==='user'
                              ?'var(--fd-indigo)':'rgba(255,255,255,0.06)'};
                            border-radius:${m.role==='user'
                              ?'14px 14px 4px 14px':'14px 14px 14px 4px'};
                            font-size:.78rem;
                            color:${m.role==='user'?'white':'var(--text-primary)'};
                            white-space:pre-line;text-align:left">
                  ${m.content}
                </div>
              </div>`).join('')}
        </div>

        <!-- Suggestions -->
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">
          ${['Charge pour bench ?','Plan semaine','Mes records',
             'Prédictions','Récupération','🧠 Programme IA'].map(q => `
            <button onclick="Coach._envoyerChat('${q}')"
                    style="padding:4px 10px;font-size:.65rem;font-weight:600;
                           cursor:pointer;background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;color:var(--fd-indigo)">
              ${q}
            </button>`).join('')}
        </div>

        <!-- Input -->
        <div style="display:flex;gap:8px">
          <input id="coach-input" type="text"
                 placeholder="Pose ta question..."
                 style="flex:1;padding:10px 14px;
                        background:var(--bg-input);
                        border:1px solid var(--border-color);
                        border-radius:var(--radius-full);
                        color:var(--text-primary);font-size:.82rem;outline:none"
                 onkeydown="if(event.key==='Enter'){
                   Coach._envoyerChat(this.value);this.value='';
                 }"/>
          <button onclick="const i=document.getElementById('coach-input');
                           Coach._envoyerChat(i.value);i.value=''"
                  style="padding:10px 18px;background:var(--fd-indigo);
                         border:none;border-radius:var(--radius-full);
                         color:white;font-size:.82rem;
                         font-weight:700;cursor:pointer">▶</button>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      const el = document.getElementById('coach-chat-messages');
      if (el) el.scrollTop = el.scrollHeight;
    });
  },

  // ════════════════════════════════════════════════════════
  // ENVOYER CHAT
  // ════════════════════════════════════════════════════════
  async _envoyerChat(question) {
    if (!question?.trim()) return;
    const q = question.trim();

    const hist = this._historique;
    hist.push({ role:'user', content:q });
    this._historique = hist;

    const chatEl = document.getElementById('coach-chat-messages');
    if (chatEl) {
      chatEl.innerHTML += `
        <div style="margin-bottom:8px;text-align:right">
          <div style="display:inline-block;max-width:85%;
                      padding:10px 14px;background:var(--fd-indigo);
                      border-radius:14px 14px 4px 14px;
                      font-size:.78rem;color:white">${q}</div>
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

    const reponse = await this.envoyerMessage(q);

    const typing = document.getElementById('coach-typing');
    if (typing) {
      typing.outerHTML = `
        <div style="margin-bottom:8px">
          <div style="display:inline-block;max-width:85%;
                      padding:10px 14px;
                      background:rgba(255,255,255,0.06);
                      border-radius:14px 14px 14px 4px;
                      font-size:.78rem;color:var(--text-primary);
                      white-space:pre-line">${reponse}</div>
        </div>`;
      if (chatEl) chatEl.scrollTop = chatEl.scrollHeight;
    }
  },

  // ════════════════════════════════════════════════════════
  // NECESSITER DELOAD
  // ════════════════════════════════════════════════════════
  necessiteDeload() {
    try {
      const rpe     = Tracker.getRPEMoyen7Jours() || 0;
      const fatigue = Tracker.getFatigue()        || { niveau:0 };
      if (rpe >= 9)
        return { oui:true, raison:`RPE ${rpe}/10 — surentraînement` };
      if ((fatigue.niveau||0) >= 4)
        return { oui:true, raison:`Fatigue maximale niveau ${fatigue.niveau}/4` };
      return { oui:false, raison:'' };
    } catch(e) {
      return { oui:false, raison:'' };
    }
  }

};  // ← FIN de const Coach = {

// ════════════════════════════════════════════════════════════
// COACH PROGRAMME IA
// ════════════════════════════════════════════════════════════
Coach.ProgrammeIA = {

  _modeQuestionnaire: false,
  _etapeActuelle:     0,
  _reponses:          {},

  STYLES: {
    ppl: {
      label:'Push Pull Legs', styleLabel:'Push Pull Legs', emoji:'🔄',
      description:'3 séances — Push / Pull / Jambes',
      joursMin:3, joursMax:6,
      seances:['pec_tri','dos_bi','jambes']
    },
    upper_lower: {
      label:'Upper / Lower', styleLabel:'Upper Lower', emoji:'⚖️',
      description:'Haut / Bas du corps en alternance',
      joursMin:2, joursMax:4,
      seances:['pec_tri','jambes','epaules_bras','jambes']
    },
    full_body: {
      label:'Full Body', styleLabel:'Full Body', emoji:'🔥',
      description:'Corps complet à chaque séance',
      joursMin:2, joursMax:4,
      seances:['full_body','full_body','full_body','full_body']
    },
    maison: {
      label:'Maison', styleLabel:'Maison', emoji:'🏠',
      description:'Programme sans équipement',
      joursMin:2, joursMax:5,
      seances:['maison_push','maison_pull','maison_legs']
    },
    femme_galbe: {
      label:'Galbe Féminin', styleLabel:'Galbe Féminin', emoji:'🌸',
      description:'Programme galbe féminin',
      joursMin:3, joursMax:5,
      seances:['lower_body_femme','upper_body_femme','core_femme']
    }
  },

  QUESTIONS: [
    { id:'objectif', question:'🎯 Quel est ton objectif principal ?',
      options:[
        { label:'💪 Prise de masse', value:'prise_masse' },
        { label:'🔥 Perte de poids', value:'perte_poids' },
        { label:'⚡ Force pure',      value:'force'       },
        { label:'🏃 Forme générale', value:'forme'       },
        { label:'✂️ Sèche',          value:'seche'       }
      ]
    },
    { id:'niveau', question:'📊 Quel est ton niveau ?',
      options:[
        { label:'🌱 Débutant (< 6 mois)',     value:'debutant'      },
        { label:'📈 Intermédiaire (6m-2ans)',  value:'intermediaire' },
        { label:'🏆 Avancé (> 2 ans)',         value:'avance'        }
      ]
    },
    { id:'lieu', question:'📍 Où t\'entraînes-tu ?',
      options:[
        { label:'🏋️ Salle', value:'salle'  },
        { label:'🏠 Maison', value:'maison' },
        { label:'🌳 Dehors', value:'dehors' }
      ]
    },
    { id:'joursParSemaine', question:'📅 Combien de jours par semaine ?',
      options:[
        { label:'2 jours', value:2 },
        { label:'3 jours', value:3 },
        { label:'4 jours', value:4 },
        { label:'5 jours', value:5 },
        { label:'6 jours', value:6 }
      ]
    },
    { id:'genre', question:'👤 Tu t\'identifies comme ?',
      options:[
        { label:'♂️ Homme', value:'homme' },
        { label:'♀️ Femme', value:'femme' }
      ]
    }
  ],

  generer(config) {
    try {
      const {
        objectif='forme', niveau='intermediaire',
        lieu='salle', nbJours=4, genre='homme',
        jours_specifiques=null
      } = config;

      let styleKey = 'ppl';
      if (lieu==='maison'||lieu==='dehors')              styleKey = 'maison';
      else if (genre==='femme'&&objectif!=='force')      styleKey = 'femme_galbe';
      else if (niveau==='debutant'||nbJours<=3)          styleKey = 'full_body';
      else if (nbJours<=4)                               styleKey = 'upper_lower';
      else                                               styleKey = 'ppl';

      const style    = this.STYLES[styleKey];
      const jours    = jours_specifiques || this._genererJours(nbJours);
      const planning = this._construirePlanning(style, jours, nbJours, genre, lieu);

      try { Programme.sauvegarderPlanning(planning); } catch(e) {}

      const prog = {
        styleKey, styleLabel:style.styleLabel, emoji:style.emoji,
        objectif, niveau, lieu, nbJours, genre, planning,
        dateCreation: typeof Utils!=='undefined'
          ? Utils.aujourd_hui()
          : new Date().toISOString().slice(0,10)
      };

      try { Utils.storage.set('ft_programme_ia_config', prog); } catch(e) {}
      console.log('[Coach.ProgrammeIA] ✅', prog);
      return prog;

    } catch(e) {
      console.error('[Coach.ProgrammeIA] Erreur:', e);
      return { styleLabel:'Standard', emoji:'💪', planning:[], config };
    }
  },

  _construirePlanning(style, jours, nbJours, genre, lieu) {
    const planning = Array.from({length:7}, (_,i) => ({
      jour:i, label:['LUN','MAR','MER','JEU','VEN','SAM','DIM'][i], seanceId:null
    }));

    const seances = [...style.seances].map(s => {
      if (lieu==='maison'||lieu==='dehors') {
        if (s==='pec_tri')      return 'maison_push';
        if (s==='dos_bi')       return 'maison_pull';
        if (s==='jambes')       return 'maison_legs';
        if (s==='epaules_bras') return 'maison_push';
      }
      if (genre==='femme') {
        if (s==='jambes')       return 'lower_body_femme';
        if (s==='pec_tri')      return 'upper_body_femme';
        if (s==='dos_bi')       return 'upper_body_femme';
        if (s==='epaules_bras') return 'upper_body_femme';
      }
      return s;
    });

    jours.slice(0, nbJours).forEach((j, i) => {
      if (j >= 0 && j < 7) planning[j].seanceId = seances[i % seances.length];
    });

    return planning;
  },

  _genererJours(nbJours) {
    const p = { 2:[0,3], 3:[0,2,4], 4:[0,1,3,4], 5:[0,1,2,4,5], 6:[0,1,2,3,4,5] };
    return p[nbJours] || p[4];
  },

  render(container) {
    if (!container) return;
    if (this._modeQuestionnaire) {
      this.renderQuestionnaire(container);
    } else {
      this.renderQuestionnaire(container);
    }
  },

  renderQuestionnaire(container) {
    if (!container) return;

    const etape = this._etapeActuelle;
    const questions = this.QUESTIONS;

    if (etape >= questions.length) {
      this._finaliserQuestionnaire(container);
      return;
    }

    const q   = questions[etape];
    const pct = Math.round((etape / questions.length) * 100);

    container.innerHTML = `
      <div class="card" style="max-width:480px;margin:0 auto">
        <div style="display:flex;justify-content:space-between;margin-bottom:16px">
          <div style="font-size:.72rem;color:var(--text-muted)">
            Question ${etape+1} / ${questions.length}
          </div>
          <div style="font-size:.72rem;color:var(--fd-indigo);font-weight:700">
            ${pct}%
          </div>
        </div>
        <div style="height:4px;background:rgba(255,255,255,0.1);
                    border-radius:4px;margin-bottom:24px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--fd-indigo);
                      border-radius:4px;transition:width .3s"></div>
        </div>
        <div style="font-size:1.05rem;font-weight:700;margin-bottom:20px">
          ${q.question}
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${q.options.map(opt => `
            <button onclick="Coach.ProgrammeIA._repondre('${q.id}',${
              typeof opt.value==='string' ? `'${opt.value}'` : opt.value
            })"
                    style="padding:14px 16px;
                           background:rgba(75,75,249,0.08);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:var(--radius-lg);
                           color:var(--text-primary);font-size:.9rem;
                           font-weight:600;text-align:left;cursor:pointer"
                    onmouseover="this.style.background='rgba(75,75,249,0.2)'"
                    onmouseout="this.style.background='rgba(75,75,249,0.08)'">
              ${opt.label}
            </button>`).join('')}
        </div>
        ${etape > 0 ? `
          <button onclick="Coach.ProgrammeIA._precedent()"
                  style="margin-top:16px;width:100%;padding:10px;
                         background:transparent;
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:var(--radius-lg);
                         color:var(--text-muted);font-size:.8rem;cursor:pointer">
            ← Retour
          </button>` : ''}
      </div>`;
  },

  _repondre(id, valeur) {
    this._reponses[id]  = valeur;
    this._etapeActuelle++;
    const c = document.getElementById('page-adaptatif');
    if (this._etapeActuelle >= this.QUESTIONS.length) {
      this._finaliserQuestionnaire(c);
    } else {
      if (c) this.renderQuestionnaire(c);
    }
  },

  _precedent() {
    if (this._etapeActuelle > 0) {
      this._etapeActuelle--;
      const c = document.getElementById('page-adaptatif');
      if (c) this.renderQuestionnaire(c);
    }
  },

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

    try {
      const profil = Utils.storage.get('ft_profil_onboarding', {});
      Object.assign(profil, { objectif:config.objectif, niveau:config.niveau,
                               lieu:config.lieu, genre:config.genre });
      Utils.storage.set('ft_profil_onboarding', profil);
    } catch(e) {}

    this._modeQuestionnaire = false;
    this._etapeActuelle     = 0;
    this._reponses          = {};

    if (container) {
      container.innerHTML = `
        <div class="card" style="max-width:480px;margin:0 auto;text-align:center">
          <div style="font-size:3rem;margin-bottom:12px">${programme.emoji}</div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-indigo);margin-bottom:8px">
            Programme ${programme.styleLabel} activé !
          </div>
          <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:24px">
            ${programme.nbJours} j/sem · ${programme.objectif} · ${programme.lieu}
          </div>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);
                      gap:4px;margin-bottom:24px">
            ${(programme.planning||[]).map(j => {
              const hasS = !!j.seanceId;
              const s    = hasS ? (typeof SEANCES_BASE!=='undefined'
                ? SEANCES_BASE[j.seanceId] : null) : null;
              return `
                <div style="text-align:center;padding:8px 4px;
                            background:${hasS?'rgba(75,75,249,0.15)':'rgba(255,255,255,0.04)'};
                            border:1px solid ${hasS?'rgba(75,75,249,0.3)':'rgba(255,255,255,0.06)'};
                            border-radius:var(--radius-md)">
                  <div style="font-size:.6rem;color:var(--text-muted);margin-bottom:4px">
                    ${j.label}</div>
                  <div style="font-size:1rem">${hasS?(s?.emoji||'💪'):'😴'}</div>
                </div>`;
            }).join('')}
          </div>
          <button onclick="naviguer('home')"
                  style="width:100%;padding:14px;background:var(--fd-indigo);
                         color:white;border:none;border-radius:var(--radius-lg);
                         font-size:.95rem;font-weight:700;cursor:pointer">
            C'est parti ! 🚀
          </button>
          <button onclick="Coach.ProgrammeIA._relancer()"
                  style="width:100%;padding:10px;margin-top:8px;
                         background:transparent;
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:var(--radius-lg);
                         color:var(--text-muted);font-size:.8rem;cursor:pointer">
            🔄 Recommencer
          </button>
        </div>`;
    }

    try { Utils.toast(`✅ Programme ${programme.styleLabel} créé !`, 'success', 3000); } catch(e) {}
  },

  _relancer() {
    this._modeQuestionnaire = true;
    this._etapeActuelle     = 0;
    this._reponses          = {};
    const c = document.getElementById('page-adaptatif');
    if (c) this.renderQuestionnaire(c);
  }

};  // ← FIN de Coach.ProgrammeIA

// ════════════════════════════════════════════════════════════
window.Coach = Coach;
console.log('✅ Coach IA v7.0 chargé');
