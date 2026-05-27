/* ============================================================
   PowerApp — Social.js v2.0
   ✅ Profil public partageable
   ✅ Défis entre amis (codes)
   ✅ Leaderboard simulé réaliste
   ✅ Partage séances (story + lien)
   ✅ Feed d'activité
   ✅ Groupes d'entraînement
   ✅ Badges partageables
   ✅ Coaching entre membres
   ============================================================ */

'use strict';

const Social = {

  CLE_PROFIL_PUBLIC:  'ft_social_profil',
  CLE_DEFIS_AMIS:     'ft_social_defis',
  CLE_GROUPES:        'ft_social_groupes',
  CLE_FEED:           'ft_social_feed',
  CLE_CONNEXIONS:     'ft_social_connexions',

  _ongletActif: 'profil',

  // ════════════════════════════════════════════════════════
  // PROFIL PUBLIC
  // ════════════════════════════════════════════════════════
  getProfilPublic() {
    try {
      const profil  = Tracker.getProfil();
      const xp      = Gamification.getXP();
      const streak  = Tracker.getStreak();
      const prs     = Tracker.getAllPRs();
      const total   = Tracker.getTotalSeances();

      const saved   = Utils.storage.get(this.CLE_PROFIL_PUBLIC, {});

      return {
        nom:        profil.nom    || 'Athlète',
        avatar:     profil.avatar || '💪',
        genre:      profil.genre  || 'homme',
        objectif:   profil.objectif || 'forme',
        niveau:     xp.niveau.numero,
        niveauNom:  xp.niveau.nom,
        niveauEmoji:xp.niveau.emoji,
        xpTotal:    xp.total,
        streak:     streak.count,
        streakMax:  streak.max,
        totalSeances:total,
        totalPRs:   Object.keys(prs).length,
        bio:        saved.bio     || '',
        pseudo:     saved.pseudo  || profil.nom || 'Athlète',
        visible:    saved.visible !== false,
        code:       saved.code    || this._genererCode(),
        dateInscription: saved.dateInscription || Utils.aujourd_hui()
      };
    } catch(e) {
      return {
        nom:'Athlète', avatar:'💪', niveau:1,
        niveauNom:'Débutant', niveauEmoji:'🌱',
        xpTotal:0, streak:0, streakMax:0,
        totalSeances:0, totalPRs:0,
        bio:'', pseudo:'Athlète', visible:true,
        code:this._genererCode(), dateInscription:Utils.aujourd_hui()
      };
    }
  },

  _genererCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code    = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  },

  // ════════════════════════════════════════════════════════
  // LEADERBOARD SIMULÉ
  // ════════════════════════════════════════════════════════
  getLeaderboard(type = 'xp') {
    const moi  = this.getProfilPublic();

    const adversaires = [
      { pseudo:'MaxPower',    avatar:'👑', niveau:7, xp:28450, streak:45, seances:342, prs:28, objectif:'force'      },
      { pseudo:'IronFist',    avatar:'💎', niveau:6, xp:15200, streak:22, seances:198, prs:21, objectif:'prise_masse' },
      { pseudo:'FitQueen 🌸', avatar:'🌸', niveau:6, xp:14800, streak:18, seances:187, prs:15, objectif:'forme'      },
      { pseudo:'StrengthX',   avatar:'🔥', niveau:5, xp:8900,  streak:12, seances:142, prs:18, objectif:'force'      },
      { pseudo:'GymWarrior',  avatar:'⚡', niveau:5, xp:7200,  streak:9,  seances:128, prs:16, objectif:'endurance'  },
      { pseudo:'NaturalBeast',avatar:'🏆', niveau:4, xp:4500,  streak:7,  seances:89,  prs:12, objectif:'forme'      },
      { pseudo:'IronBody',    avatar:'💪', niveau:4, xp:3800,  streak:5,  seances:76,  prs:10, objectif:'seche'      },
      { pseudo:'FitLife 🌸',  avatar:'🌺', niveau:3, xp:2100,  streak:4,  seances:54,  prs:8,  objectif:'forme'      },
      { pseudo:'Warrior99',   avatar:'🛡️', niveau:3, xp:1800,  streak:3,  seances:48,  prs:7,  objectif:'force'      },
      { pseudo:'Rookie2024',  avatar:'🌱', niveau:2, xp:800,   streak:2,  seances:24,  prs:4,  objectif:'forme'      }
    ];

    const joueurs = [
      ...adversaires,
      {
        pseudo:  moi.pseudo,
        avatar:  moi.avatar,
        niveau:  moi.niveau,
        xp:      moi.xpTotal,
        streak:  moi.streak,
        seances: moi.totalSeances,
        prs:     moi.totalPRs,
        objectif:moi.objectif,
        isMe:    true
      }
    ];

    // Trier selon type
    const getVal = (j) => {
      switch(type) {
        case 'xp':      return j.xp;
        case 'streak':  return j.streak;
        case 'seances': return j.seances;
        case 'prs':     return j.prs;
        default:        return j.xp;
      }
    };

    return joueurs
      .sort((a,b) => getVal(b) - getVal(a))
      .map((j,i) => ({ ...j, rang:i+1 }));
  },

  // ════════════════════════════════════════════════════════
  // DÉFIS AMIS
  // ════════════════════════════════════════════════════════
  DEFIS_TEMPLATES: [
    {
      id:          'defi_seances',
      titre:       'Roi des séances',
      emoji:       '💪',
      description: 'Le plus de séances en 7 jours',
      type:        'seances',
      duree:       7,
      xpGagnant:   500,
      xpParticipant:100
    },
    {
      id:          'defi_streak',
      titre:       'Streak Battle',
      emoji:       '🔥',
      description: 'Le streak le plus long en 14 jours',
      type:        'streak',
      duree:       14,
      xpGagnant:   750,
      xpParticipant:150
    },
    {
      id:          'defi_volume',
      titre:       'Volume Monster',
      emoji:       '📦',
      description: 'Le plus grand volume total en 7 jours',
      type:        'volume',
      duree:       7,
      xpGagnant:   600,
      xpParticipant:120
    },
    {
      id:          'defi_pr',
      titre:       'Record Breaker',
      emoji:       '🏆',
      description: 'Le plus de PRs battus en 7 jours',
      type:        'prs',
      duree:       7,
      xpGagnant:   800,
      xpParticipant:200
    },
    {
      id:          'defi_hydra',
      titre:       'Hydro Challenge',
      emoji:       '💧',
      description: 'Le plus de jours d\'objectif eau atteint',
      type:        'hydratation',
      duree:       7,
      xpGagnant:   300,
      xpParticipant:75
    }
  ],

  getDefisActifs() {
    return Utils.storage.get(this.CLE_DEFIS_AMIS, [])
      .filter(d => !d.termine);
  },

  creerDefi(templateId, codeAdversaire = null) {
    const template = this.DEFIS_TEMPLATES
      .find(t => t.id === templateId);
    if (!template) return null;

    const moi  = this.getProfilPublic();
    const defi = {
      id:         Date.now().toString(),
      templateId,
      titre:      template.titre,
      emoji:      template.emoji,
      description:template.description,
      type:       template.type,
      duree:      template.duree,
      xpGagnant:  template.xpGagnant,
      dateDebut:  Utils.aujourd_hui(),
      dateFin:    Utils.ajouterJours(Utils.aujourd_hui(), template.duree),
      createur:   moi.pseudo,
      participants:[{
        pseudo:    moi.pseudo,
        avatar:    moi.avatar,
        isMe:      true,
        scoreDepart: this._getScoreDepart(template.type),
        scoreCourant:this._getScoreDepart(template.type)
      }],
      code:       this._genererCode(),
      termine:    false,
      en_attente: true
    };

    // Si adversaire connu, simuler sa participation
    if (codeAdversaire) {
      defi.en_attente = false;
      defi.participants.push(this._creerAdversaireSimule());
    }

    const defis = Utils.storage.get(this.CLE_DEFIS_AMIS, []);
    defis.push(defi);
    Utils.storage.set(this.CLE_DEFIS_AMIS, defis);

    return defi;
  },

  _getScoreDepart(type) {
    try {
      switch(type) {
        case 'seances':    return Tracker.getTotalSeances();
        case 'streak':     return Tracker.getStreak().count;
        case 'volume':     return Tracker.getVolumeSemaine();
        case 'prs':        return Object.keys(Tracker.getAllPRs()).length;
        case 'hydratation':return 0;
        default:           return 0;
      }
    } catch(e) { return 0; }
  },

  _getScoreCourant(type) {
    try {
      switch(type) {
        case 'seances':    return Tracker.getTotalSeances();
        case 'streak':     return Tracker.getStreak().count;
        case 'volume':     return Tracker.getVolumeSemaine();
        case 'prs':        return Object.keys(Tracker.getAllPRs()).length;
        case 'hydratation':return 0;
        default:           return 0;
      }
    } catch(e) { return 0; }
  },

  _creerAdversaireSimule() {
    const adversaires = [
      { pseudo:'MaxPower',    avatar:'👑' },
      { pseudo:'IronFist',    avatar:'💎' },
      { pseudo:'FitQueen 🌸', avatar:'🌸' },
      { pseudo:'StrengthX',   avatar:'🔥' },
      { pseudo:'GymWarrior',  avatar:'⚡' }
    ];
    const a = adversaires[Math.floor(Math.random() * adversaires.length)];
    const scoreMoyen = 3 + Math.floor(Math.random() * 5);
    return {
      pseudo:      a.pseudo,
      avatar:      a.avatar,
      isMe:        false,
      scoreDepart: 0,
      scoreCourant:scoreMoyen
    };
  },

  mettreAJourDefis() {
    const defis = Utils.storage.get(this.CLE_DEFIS_AMIS, []);
    let modifie  = false;

    defis.forEach(d => {
      if (d.termine) return;

      // Mettre à jour mon score
      const moi = d.participants.find(p => p.isMe);
      if (moi) {
        const scoreCourant = this._getScoreCourant(d.type);
        const progression  = scoreCourant - moi.scoreDepart;
        moi.scoreCourant   = Math.max(0, progression);
        modifie = true;
      }

      // Simuler progression adversaire
      d.participants.filter(p => !p.isMe).forEach(adv => {
        const delta = Math.random() > 0.7 ? 1 : 0;
        adv.scoreCourant = (adv.scoreCourant || 0) + delta;
        modifie = true;
      });

      // Vérifier si terminé
      if (d.dateFin <= Utils.aujourd_hui()) {
        d.termine = true;
        const gagnant = d.participants
          .sort((a,b) => b.scoreCourant - a.scoreCourant)[0];
        d.gagnant = gagnant.pseudo;
        d.estGagnant = gagnant.isMe;
        modifie = true;

        if (d.estGagnant) {
          try {
            Gamification.ajouterXP(d.xpGagnant, 'Défi remporté !');
          } catch(e) {}
          Utils.toast(
            `🏆 Tu as remporté le défi "${d.titre}" ! +${d.xpGagnant} XP`,
            'pr', 5000
          );
        }
      }
    });

    if (modifie) Utils.storage.set(this.CLE_DEFIS_AMIS, defis);
    return defis;
  },

  // ════════════════════════════════════════════════════════
  // GROUPES D'ENTRAÎNEMENT
  // ════════════════════════════════════════════════════════
  GROUPES_PUBLICS: [
    {
      id:          'groupe_force',
      nom:         'Force & Powerlifting',
      emoji:       '🏋️',
      description: 'Groupe dédié aux lifteurs et amoureux de la force brute',
      membres:     1247,
      type:        'force',
      badge:       '💪',
      activite:    'Très actif'
    },
    {
      id:          'groupe_femme',
      nom:         'Femmes Fit 🌸',
      emoji:       '🌸',
      description: 'Communauté féminine bienveillante — galbe, forme & confiance',
      membres:     2891,
      type:        'femme',
      badge:       '🌺',
      activite:    'Très actif'
    },
    {
      id:          'groupe_debutants',
      nom:         'Débutants Motivés',
      emoji:       '🌱',
      description: 'Pas de jugement — entraide & progression pour tous',
      membres:     3456,
      type:        'debut',
      badge:       '🌟',
      activite:    'Actif'
    },
    {
      id:          'groupe_seche',
      nom:         'Sèche & Définition',
      emoji:       '🔥',
      description: 'Stratégies de sèche, nutrition déficit, cardio intelligent',
      membres:     987,
      type:        'seche',
      badge:       '⚡',
      activite:    'Actif'
    },
    {
      id:          'groupe_masse',
      nom:         'Prise de Masse Propre',
      emoji:       '💪',
      description: 'Bulk clean, suppléments, périodisation pour la masse',
      membres:     1543,
      type:        'masse',
      badge:       '🏆',
      activite:    'Très actif'
    },
    {
      id:          'groupe_hiit',
      nom:         'HIIT & Cardio Warriors',
      emoji:       '⚡',
      description: 'Tabata, AMRAP, EMOM — performance cardio maximale',
      membres:     756,
      type:        'cardio',
      badge:       '🔥',
      activite:    'Modéré'
    },
    {
      id:          'groupe_nutrition',
      nom:         'Nutrition Sport',
      emoji:       '🥗',
      description: 'Recettes, macros, timing des repas, suppléments',
      membres:     2134,
      type:        'nutrition',
      badge:       '🍎',
      activite:    'Très actif'
    },
    {
      id:          'groupe_maison',
      nom:         'Home Gym Nation',
      emoji:       '🏠',
      description: 'S\'entraîner à la maison efficacement — sans excuses !',
      membres:     1876,
      type:        'maison',
      badge:       '🏡',
      activite:    'Actif'
    }
  ],

  getGroupesRejoints() {
    return Utils.storage.get(this.CLE_GROUPES, []);
  },

  rejoindreGroupe(groupeId) {
    const groupes = this.getGroupesRejoints();
    if (groupes.includes(groupeId)) {
      Utils.toast('Tu es déjà dans ce groupe !', 'info');
      return;
    }
    groupes.push(groupeId);
    Utils.storage.set(this.CLE_GROUPES, groupes);
    try { Gamification.ajouterXP(50, 'Groupe rejoint'); } catch(e) {}
    Utils.toast('✅ Groupe rejoint !', 'success', 2000);
    Utils.vibrerSuccess();
  },

  quitterGroupe(groupeId) {
    const groupes = this.getGroupesRejoints()
      .filter(id => id !== groupeId);
    Utils.storage.set(this.CLE_GROUPES, groupes);
    Utils.toast('Groupe quitté', 'info');
  },

  // ════════════════════════════════════════════════════════
  // FEED D'ACTIVITÉ
  // ════════════════════════════════════════════════════════
  _genererFeed() {
    // Feed simulé réaliste
    const now   = new Date();
    const items = [
      {
        id:       '1',
        type:     'pr',
        pseudo:   'MaxPower',
        avatar:   '👑',
        emoji:    '🏆',
        message:  'vient de battre son record au Squat : 185kg × 3 !',
        detail:   '1RM estimé : ~198kg 🔥',
        time:     '2 min',
        likes:    47,
        comments: 12,
        liked:    false
      },
      {
        id:       '2',
        type:     'seance',
        pseudo:   'FitQueen 🌸',
        avatar:   '🌸',
        emoji:    '💪',
        message:  'a terminé sa séance Lower Body',
        detail:   '58min · 4.2 tonnes · 3 PRs battus',
        time:     '15 min',
        likes:    23,
        comments: 5,
        liked:    false
      },
      {
        id:       '3',
        type:     'streak',
        pseudo:   'IronFist',
        avatar:   '💎',
        emoji:    '🔥',
        message:  'atteint un streak de 30 jours !',
        detail:   'Mois de fer débloqué 💎',
        time:     '1h',
        likes:    89,
        comments: 24,
        liked:    false
      },
      {
        id:       '4',
        type:     'niveau',
        pseudo:   'Rookie2024',
        avatar:   '🌱',
        emoji:    '⭐',
        message:  'vient d\'atteindre le niveau 3 — Confirmé !',
        detail:   '+350 XP cette semaine 🚀',
        time:     '2h',
        likes:    34,
        comments: 8,
        liked:    false
      },
      {
        id:       '5',
        type:     'defi',
        pseudo:   'GymWarrior',
        avatar:   '⚡',
        emoji:    '🎯',
        message:  'a remporté le défi "Streak Battle" contre IronBody !',
        detail:   '+750 XP · Titre "Champion" débloqué',
        time:     '3h',
        likes:    156,
        comments: 31,
        liked:    false
      },
      {
        id:       '6',
        type:     'recette',
        pseudo:   'NaturalBeast',
        avatar:   '🏆',
        emoji:    '🥗',
        message:  'partage sa recette Bowl récupération',
        detail:   '520kcal · 48g prot · 10min prep',
        time:     '4h',
        likes:    67,
        comments: 19,
        liked:    false
      },
      {
        id:       '7',
        type:     'seance',
        pseudo:   'StrengthX',
        avatar:   '🔥',
        emoji:    '🏋️',
        message:  'a terminé sa séance Push — Pectoraux',
        detail:   '72min · 6.8 tonnes · Bench : 112kg',
        time:     '5h',
        likes:    41,
        comments: 9,
        liked:    false
      },
      {
        id:       '8',
        type:     'objectif',
        pseudo:   'FitLife 🌸',
        avatar:   '🌺',
        emoji:    '🎯',
        message:  'a atteint son objectif "Squat 80kg" !',
        detail:   'Objectif accompli après 6 semaines 🎉',
        time:     '6h',
        likes:    92,
        comments: 28,
        liked:    false
      }
    ];

    // Ajouter mes activités récentes
    try {
      const moi        = this.getProfilPublic();
      const seanceDuJ  = Tracker.getSeanceDuJour?.();
      if (seanceDuJ?.series?.length > 0) {
        items.unshift({
          id:       'me_1',
          type:     'seance',
          pseudo:   moi.pseudo,
          avatar:   moi.avatar,
          emoji:    '💪',
          message:  'vient de terminer une séance',
          detail:   `${seanceDuJ.series.length} séries · Toi 🔥`,
          time:     'À l\'instant',
          likes:    0,
          comments: 0,
          liked:    false,
          isMe:     true
        });
      }
    } catch(e) {}

    // Sauvegarder likes
    const savedLikes = Utils.storage.get(this.CLE_FEED, {});
    items.forEach(item => {
      if (savedLikes[item.id]) {
        item.liked = true;
        item.likes += 1;
      }
    });

    return items;
  },

  toggleLike(itemId) {
    const savedLikes = Utils.storage.get(this.CLE_FEED, {});
    if (savedLikes[itemId]) {
      delete savedLikes[itemId];
    } else {
      savedLikes[itemId] = true;
    }
    Utils.storage.set(this.CLE_FEED, savedLikes);
  },

  // ════════════════════════════════════════════════════════
  // PARTAGE
  // ════════════════════════════════════════════════════════
  genererLienProfil() {
    const profil = this.getProfilPublic();
    const data   = {
      pseudo:      profil.pseudo,
      niveau:      profil.niveau,
      niveauNom:   profil.niveauNom,
      xp:          profil.xpTotal,
      streak:      profil.streak,
      seances:     profil.totalSeances,
      prs:         profil.totalPRs,
      objectif:    profil.objectif,
      date:        Utils.aujourd_hui()
    };

    // Encoder en base64 pour simuler un lien
    const encoded = btoa(JSON.stringify(data));
    return `powerapp.fitness/profil/${encoded.slice(0, 20)}`;
  },

  partagerSurReseaux(reseau) {
    const profil = this.getProfilPublic();
    const lien   = this.genererLienProfil();

    const messages = {
      instagram: `💪 ${profil.streak} jours de streak ! Niveau ${profil.niveau} sur PowerApp 🔥 #PowerApp #Fitness #Musculation`,
      twitter:   `Je m'entraîne depuis ${profil.totalSeances} séances sur @PowerApp 💪 Niveau ${profil.niveauNom} · ${profil.xpTotal} XP 🏆 ${lien}`,
      whatsapp:  `Rejoins-moi sur PowerApp ! Je suis niveau ${profil.niveau} avec ${profil.streak} jours de streak 🔥 ${lien}`,
      copier:    lien
    };

    const msg = messages[reseau] || lien;

    if (reseau === 'copier') {
      navigator.clipboard?.writeText(msg)
        .then(() => Utils.toast('✅ Lien copié !', 'success', 2000))
        .catch(() => Utils.toast(`Lien : ${msg}`, 'info', 4000));
    } else if (reseau === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    } else if (reseau === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
      navigator.clipboard?.writeText(msg)
        .catch(() => {});
      Utils.toast(`📋 Texte copié pour ${reseau} !`, 'success', 2000);
    }
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
          { id:'profil',     label:'👤 Profil'    },
          { id:'leaderboard',label:'🏆 Classement' },
          { id:'defis',      label:'⚔️ Défis'      },
          { id:'groupes',    label:'👥 Groupes'    },
          { id:'feed',       label:'📱 Feed'       },
          { id:'partage',    label:'📤 Partage'    }
        ].map(t => `
          <button onclick="Social._changerOnglet('${t.id}')"
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
      <div id="social-content"></div>`;

    this._rendreOnglet();
  },

  _changerOnglet(id) {
    this._ongletActif = id;
    const c = document.getElementById('page-social');
    if (c) this.render(c);
  },

  _rendreOnglet() {
    const c = document.getElementById('social-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'profil':      this._rendreProfil(c);      break;
      case 'leaderboard': this._rendreLeaderboard(c); break;
      case 'defis':       this._rendreDefis(c);       break;
      case 'groupes':     this._rendreGroupes(c);     break;
      case 'feed':        this._rendreFeed(c);        break;
      case 'partage':     this._rendrePartage(c);     break;
    }
  },

  // ════════════════════════════════════════════════════════
  // ONGLET PROFIL
  // ════════════════════════════════════════════════════════
  _rendreProfil(container) {
    const profil = this.getProfilPublic();
    const lien   = this.genererLienProfil();

    container.innerHTML = `

      <!-- Carte profil public -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.25),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  position:relative;overflow:hidden">

        <div style="position:absolute;top:-40px;right:-30px;
                    width:160px;height:160px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2) 0%,transparent 70%);
                    pointer-events:none"></div>

        <!-- Avatar + pseudo -->
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px">
          <div style="width:64px;height:64px;border-radius:50%;
                      background:rgba(75,75,249,0.2);
                      border:3px solid rgba(75,75,249,0.5);
                      display:flex;align-items:center;
                      justify-content:center;font-size:2rem;flex-shrink:0">
            ${profil.avatar}
          </div>
          <div style="flex:1">
            <div style="font-size:1.2rem;font-weight:800">
              ${profil.pseudo}
            </div>
            <div style="font-size:.72rem;color:var(--fd-lavender);margin-top:2px">
              ${profil.niveauEmoji} Niv.${profil.niveau} — ${profil.niveauNom}
            </div>
            ${profil.bio ? `
              <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
                "${profil.bio}"
              </div>` : ''}
          </div>
        </div>

        <!-- Stats -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${[
            { val:profil.xpTotal.toLocaleString('fr-FR'), label:'XP',      color:'var(--fd-indigo)'   },
            { val:`${profil.streak}🔥`,                    label:'Streak',   color:'var(--fd-lemon)'    },
            { val:profil.totalSeances,                     label:'Séances',  color:'var(--fd-mint)'     },
            { val:profil.totalPRs,                         label:'Records',  color:'var(--fd-lavender)' }
          ].map(s => `
            <div style="text-align:center;padding:10px 4px;
                        background:rgba(255,255,255,0.05);
                        border-radius:var(--radius-md)">
              <div style="font-size:.9rem;font-weight:800;color:${s.color}">
                ${s.val}</div>
              <div style="font-size:.55rem;color:var(--text-muted);margin-top:2px">
                ${s.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Mon code -->
      <div style="background:rgba(249,239,119,0.08);
                  border:1px solid rgba(249,239,119,0.25);
                  border-radius:var(--radius-lg);
                  padding:14px 16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-lemon);margin-bottom:8px">
          🔑 Mon code ami
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:1.8rem;font-weight:900;
                      color:var(--fd-lemon);letter-spacing:.15em;
                      font-variant-numeric:tabular-nums">
            ${profil.code}
          </div>
          <button onclick="Social._copierCode('${profil.code}')"
                  style="padding:8px 16px;
                         background:rgba(249,239,119,0.15);
                         border:1px solid rgba(249,239,119,0.3);
                         border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-lemon);cursor:pointer">
            📋 Copier
          </button>
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);margin-top:6px">
          Partage ce code avec tes amis pour vous défier !
        </div>
      </div>

      <!-- Modifier profil -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          ✏️ Personnaliser mon profil public
        </div>

        <div style="margin-bottom:10px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
            Pseudo
          </div>
          <input id="social-pseudo" type="text"
                 class="input" value="${profil.pseudo}"
                 maxlength="20"
                 placeholder="Ton pseudo public"/>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
            Bio (optionnel)
          </div>
          <textarea id="social-bio" class="input" rows="2"
                    style="resize:none"
                    maxlength="100"
                    placeholder="Ex: Passionné de musculation depuis 2 ans 💪">${profil.bio}</textarea>
        </div>

        <!-- Visibilité -->
        <div style="display:flex;align-items:center;gap:12px;
                    padding:10px 12px;
                    background:rgba(255,255,255,0.03);
                    border-radius:var(--radius-md);
                    margin-bottom:12px">
          <div style="flex:1">
            <div style="font-size:.78rem;font-weight:600">Profil visible</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              Apparaître dans le classement public
            </div>
          </div>
          <label style="position:relative;display:inline-block;
                        width:44px;height:24px">
            <input type="checkbox"
                   id="social-visible"
                   ${profil.visible ? 'checked' : ''}
                   style="opacity:0;width:0;height:0"/>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <button onclick="Social._sauvegarderProfil()"
                class="btn-primary" style="width:100%">
          💾 Sauvegarder
        </button>
      </div>

      <!-- Statistiques membre -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-lg);
                  padding:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:10px">
          📊 Ton profil en chiffres
        </div>
        ${[
          { label:'Membre depuis',    val:profil.dateInscription,    emoji:'📅' },
          { label:'XP total',         val:`${profil.xpTotal.toLocaleString('fr-FR')} XP`, emoji:'⭐' },
          { label:'Streak record',    val:`${profil.streakMax} jours`, emoji:'🔥' },
          { label:'Classement global',val:`Top ${this._calculerClassement()}`, emoji:'🏆' }
        ].map(s => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:8px 0;
                      border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="font-size:1.1rem;flex-shrink:0">${s.emoji}</span>
            <div style="flex:1;font-size:.78rem;color:var(--text-muted)">${s.label}</div>
            <div style="font-size:.82rem;font-weight:700">${s.val}</div>
          </div>`).join('')}
      </div>
    `;
  },

  _calculerClassement() {
    const ldb = this.getLeaderboard('xp');
    const moi = ldb.find(j => j.isMe);
    return moi ? `${moi.rang}%` : '50%';
  },

  _copierCode(code) {
    navigator.clipboard?.writeText(code)
      .then(() => Utils.toast(`✅ Code ${code} copié !`, 'success', 2000))
      .catch(() => Utils.toast(`Ton code : ${code}`, 'info', 4000));
  },

  _sauvegarderProfil() {
    const pseudo  = document.getElementById('social-pseudo')?.value?.trim();
    const bio     = document.getElementById('social-bio')?.value?.trim();
    const visible = document.getElementById('social-visible')?.checked;

    if (!pseudo) { Utils.toast('Entre un pseudo !', 'error'); return; }

    const saved = Utils.storage.get(this.CLE_PROFIL_PUBLIC, {});
    const profil = this.getProfilPublic();

    Utils.storage.set(this.CLE_PROFIL_PUBLIC, {
      ...saved,
      pseudo,
      bio:     bio || '',
      visible: visible !== false,
      code:    saved.code || profil.code,
      dateInscription: saved.dateInscription || Utils.aujourd_hui()
    });

    Utils.toast('✅ Profil sauvegardé !', 'success');
    Utils.vibrerSuccess();
    this._rendreProfil(document.getElementById('social-content'));
  },

  // ════════════════════════════════════════════════════════
  // ONGLET LEADERBOARD
  // ════════════════════════════════════════════════════════
  _typeLeaderboard: 'xp',

  _rendreLeaderboard(container) {
    const ldb = this.getLeaderboard(this._typeLeaderboard);

    const labels = {
      xp:      '⭐ XP Total',
      streak:  '🔥 Streak',
      seances: '💪 Séances',
      prs:     '🏆 Records'
    };

    const getVal = (j) => {
      switch(this._typeLeaderboard) {
        case 'xp':      return `${j.xp.toLocaleString('fr-FR')} XP`;
        case 'streak':  return `${j.streak} jours`;
        case 'seances': return `${j.seances} séances`;
        case 'prs':     return `${j.prs} PRs`;
        default:        return j.xp;
      }
    };

    container.innerHTML = `

      <!-- Types -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);
                  gap:6px;margin-bottom:14px">
        ${Object.entries(labels).map(([id, label]) => `
          <button onclick="Social._typeLeaderboard='${id}';
                           Social._rendreLeaderboard(
                             document.getElementById('social-content'))"
                  style="padding:8px 4px;font-size:.65rem;font-weight:700;
                         text-align:center;cursor:pointer;
                         border-radius:var(--radius-md);
                         background:${this._typeLeaderboard === id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.04)'};
                         border:1px solid ${this._typeLeaderboard === id
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.08)'};
                         color:${this._typeLeaderboard === id
                           ? 'white' : 'var(--text-muted)'}">
            ${label}
          </button>`).join('')}
      </div>

      <!-- Info classement -->
      <div style="background:rgba(249,239,119,0.08);
                  border:1px solid rgba(249,239,119,0.2);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-lemon);margin-bottom:4px">
          🌍 Classement mondial
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Tu es classé
          <span style="font-weight:800;color:var(--fd-lemon)">
            #${ldb.find(j=>j.isMe)?.rang || '?'}
          </span>
          sur ${ldb.length} athlètes actifs
        </div>
      </div>

      <!-- Top 3 podium -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:8px;margin-bottom:14px">
        ${ldb.slice(0,3).map((j,i) => {
          const couleurs = ['var(--fd-lemon)','#c0c0c0','#cd7f32'];
          const tailles  = ['1.4rem','1.2rem','1rem'];
          const podiums  = ['🥇','🥈','🥉'];
          return `
            <div style="text-align:center;padding:14px 8px;
                        background:${j.isMe
                          ? 'rgba(75,75,249,0.15)'
                          : 'rgba(255,255,255,0.04)'};
                        border:${j.isMe
                          ? '2px solid var(--fd-indigo)'
                          : '1px solid rgba(255,255,255,0.08)'};
                        border-radius:var(--radius-xl);
                        position:relative">
              <div style="font-size:1.5rem;margin-bottom:4px">${j.avatar}</div>
              <div style="font-size:.65rem;font-weight:800;
                          color:${j.isMe ? 'var(--fd-indigo)' : 'var(--text-primary)'};
                          margin-bottom:2px;overflow:hidden;
                          text-overflow:ellipsis;white-space:nowrap">
                ${j.pseudo}
                ${j.isMe ? '<br><span style="font-size:.52rem;color:var(--fd-indigo)">Toi</span>' : ''}
              </div>
              <div style="font-size:${tailles[i]};font-weight:900;
                          color:${couleurs[i]}">
                ${podiums[i]}
              </div>
              <div style="font-size:.62rem;font-weight:700;
                          color:${couleurs[i]};margin-top:2px">
                ${getVal(j)}
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Reste du classement -->
      <div style="display:flex;flex-direction:column;gap:6px">
        ${ldb.slice(3).map(j => `
          <div style="display:flex;align-items:center;gap:12px;
                      padding:12px 14px;
                      background:${j.isMe
                        ? 'rgba(75,75,249,0.12)'
                        : 'rgba(255,255,255,0.03)'};
                      border:1px solid ${j.isMe
                        ? 'rgba(75,75,249,0.3)'
                        : 'rgba(255,255,255,0.06)'};
                      border-radius:var(--radius-lg)">

            <!-- Rang -->
            <div style="width:28px;text-align:center;font-size:.82rem;
                        font-weight:800;flex-shrink:0;
                        color:var(--text-muted)">
              #${j.rang}
            </div>

            <!-- Avatar -->
            <div style="font-size:1.3rem;flex-shrink:0">${j.avatar}</div>

            <!-- Nom + niveau -->
            <div style="flex:1;min-width:0">
              <div style="font-size:.85rem;font-weight:700;
                          color:${j.isMe ? 'var(--fd-indigo)' : 'var(--text-primary)'}">
                ${j.pseudo}
                ${j.isMe ? `<span style="font-size:.6rem;padding:1px 6px;margin-left:4px;
                  background:rgba(75,75,249,0.2);border-radius:99px;
                  color:var(--fd-indigo)">Toi</span>` : ''}
              </div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                Niv.${j.niveau}
              </div>
            </div>

            <!-- Score -->
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:.85rem;font-weight:800;
                          color:var(--fd-lemon)">
                ${getVal(j)}
              </div>
            </div>
          </div>`).join('')}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ONGLET DÉFIS
  // ════════════════════════════════════════════════════════
  _rendreDefis(container) {
    const defis       = this.mettreAJourDefis();
    const actifs      = defis.filter(d => !d.termine);
    const termines    = defis.filter(d => d.termine);

    container.innerHTML = `

      <!-- Créer un défi -->
      <div style="background:linear-gradient(135deg,
                  rgba(255,141,150,0.1),rgba(249,239,119,0.05));
                  border:1px solid rgba(255,141,150,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-coral);margin-bottom:12px">
          ⚔️ Créer un défi
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
          ${this.DEFIS_TEMPLATES.map(t => `
            <div onclick="Social._creerDefiUI('${t.id}')"
                 style="display:flex;align-items:center;gap:10px;
                        padding:10px 12px;
                        background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);
                        cursor:pointer;transition:all .2s"
                 onmouseenter="this.style.borderColor='rgba(255,141,150,0.3)'"
                 onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)'">
              <span style="font-size:1.3rem;flex-shrink:0">${t.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">${t.titre}</div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${t.description} · ${t.duree} jours · +${t.xpGagnant} XP
                </div>
              </div>
              <span style="color:var(--fd-coral);font-size:.8rem">›</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Rejoindre un défi -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-lg);
                  padding:14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px">
          🔗 Rejoindre un défi par code
        </div>
        <div style="display:flex;gap:8px">
          <input id="code-defi" type="text"
                 class="input" style="flex:1;text-transform:uppercase"
                 placeholder="CODE AMI" maxlength="6"/>
          <button onclick="Social._rejoindreDefi()"
                  class="btn-primary" style="font-size:.82rem;white-space:nowrap">
            ▶ Rejoindre
          </button>
        </div>
      </div>

      <!-- Défis actifs -->
      ${actifs.length > 0 ? `
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
          ⚔️ En cours (${actifs.length})
        </div>
        ${actifs.map(d => this._renderCarteDefi(d)).join('')}` : ''}

      <!-- Défis terminés -->
      ${termines.length > 0 ? `
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);
                    margin-bottom:8px;margin-top:14px">
          ✅ Terminés (${termines.length})
        </div>
        ${termines.slice(0, 3).map(d => this._renderCarteDefi(d)).join('')}` : ''}

      ${actifs.length === 0 && termines.length === 0 ? `
        <div style="text-align:center;padding:32px 16px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">⚔️</div>
          <div style="font-size:.88rem">Aucun défi en cours</div>
          <div style="font-size:.72rem;margin-top:4px">
            Crée un défi ou invite un ami !
          </div>
        </div>` : ''}
    `;
  },

  _renderCarteDefi(d) {
    const estTermine   = d.termine;
    const moi          = d.participants.find(p => p.isMe);
    const adversaires  = d.participants.filter(p => !p.isMe);
    const monScore     = moi?.scoreCourant || 0;
    const maxAdv       = Math.max(...adversaires.map(a => a.scoreCourant || 0), 0);
    const estEnTete    = monScore >= maxAdv;

    const joursRestants = (() => {
      if (estTermine) return 0;
      const diff = new Date(d.dateFin) - new Date();
      return Math.max(0, Math.ceil(diff / (1000*60*60*24)));
    })();

    return `
      <div style="background:${estTermine
          ? d.estGagnant
            ? 'rgba(139,240,187,0.07)'
            : 'rgba(255,141,150,0.05)'
          : 'rgba(255,255,255,0.04)'};
                  border:1px solid ${estTermine
          ? d.estGagnant
            ? 'rgba(139,240,187,0.25)'
            : 'rgba(255,141,150,0.2)'
          : 'rgba(255,255,255,0.08)'};
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:10px">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:1.5rem;flex-shrink:0">${d.emoji}</span>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:800">${d.titre}</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              ${d.description}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            ${estTermine ? `
              <div style="font-size:.72rem;font-weight:700;
                          color:${d.estGagnant?'var(--fd-mint)':'var(--fd-coral)'}">
                ${d.estGagnant ? '🏆 Gagné !' : '😔 Perdu'}
              </div>` : `
              <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
                ${joursRestants}j
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">restants</div>`}
          </div>
        </div>

        <!-- Participants -->
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px">
          ${d.participants.map(p => {
            const maxScore = Math.max(...d.participants.map(pp => pp.scoreCourant || 0), 1);
            const pct      = Math.min(100, Math.round(((p.scoreCourant||0) / maxScore) * 100));
            const estGagnant = estTermine && d.gagnant === p.pseudo;
            return `
              <div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-size:.9rem">${p.avatar || '💪'}</span>
                  <span style="font-size:.78rem;font-weight:700;
                               color:${p.isMe ? 'var(--fd-indigo)' : 'var(--text-primary)'}">
                    ${p.pseudo}
                    ${p.isMe ? '<span style="font-size:.58rem;color:var(--text-muted)"> (Toi)</span>' : ''}
                    ${estGagnant ? ' 🏆' : ''}
                  </span>
                  <span style="margin-left:auto;font-size:.78rem;font-weight:800;
                               color:${p.isMe ? 'var(--fd-lemon)' : 'var(--text-secondary)'}">
                    ${p.scoreCourant || 0}
                  </span>
                </div>
                <div style="height:6px;background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${p.isMe ? 'var(--fd-indigo)' : 'rgba(255,255,255,0.3)'};
                              border-radius:99px;transition:width .8s ease"></div>
                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Footer -->
        <div style="display:flex;align-items:center;justify-content:space-between">
          <div style="font-size:.62rem;color:var(--text-muted)">
            ${!estTermine && estEnTete
              ? '🟢 Tu mènes !'
              : !estTermine
                ? '🔴 Tu es derrière'
                : ''}
            ${d.en_attente ? '⏳ En attente d\'un adversaire' : ''}
          </div>
          <div style="font-size:.65rem;color:var(--fd-lemon);font-weight:700">
            +${d.xpGagnant} XP gagnant
          </div>
        </div>

        ${d.en_attente ? `
          <div style="margin-top:10px;padding:8px 12px;
                      background:rgba(249,239,119,0.08);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-md)">
            <div style="font-size:.62rem;color:var(--fd-lemon);margin-bottom:4px">
              🔑 Partage ce code à ton adversaire
            </div>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="font-size:1.2rem;font-weight:900;
                          color:var(--fd-lemon);letter-spacing:.1em">
                ${d.code}
              </div>
              <button onclick="Social._copierCode('${d.code}')"
                      style="padding:4px 10px;font-size:.62rem;font-weight:700;
                             background:rgba(249,239,119,0.15);
                             border:1px solid rgba(249,239,119,0.3);
                             border-radius:99px;color:var(--fd-lemon);cursor:pointer">
                📋 Copier
              </button>
            </div>
          </div>` : ''}
      </div>`;
  },

  _creerDefiUI(templateId) {
    const template = this.DEFIS_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="padding:16px">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:3rem;margin-bottom:8px">${template.emoji}</div>
          <div style="font-size:1.1rem;font-weight:800">${template.titre}</div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px">
            ${template.description} · ${template.duree} jours
          </div>
        </div>

        <div style="padding:12px 14px;background:rgba(249,239,119,0.08);
                    border:1px solid rgba(249,239,119,0.2);
                    border-radius:var(--radius-md);margin-bottom:16px">
          <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
            🏆 Récompenses
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
            Gagnant : +${template.xpGagnant} XP<br>
            Participant : +${template.xpParticipant} XP
          </div>
        </div>

        <div style="margin-bottom:14px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:6px">
            Code ami de ton adversaire (optionnel)
          </div>
          <input id="code-adversaire" type="text"
                 class="input" style="text-transform:uppercase"
                 placeholder="Laisser vide pour adversaire aléatoire"
                 maxlength="6"/>
        </div>

        <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary">Annuler</button>
          <button onclick="Social._confirmerCreerDefi('${templateId}')"
                  class="btn-primary">
            ⚔️ Créer le défi !
          </button>
        </div>
      </div>`;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _confirmerCreerDefi(templateId) {
    const code = document.getElementById('code-adversaire')?.value?.trim();
    const defi = this.creerDefi(templateId, code || null);

    document.getElementById('modal-info')?.classList.add('hidden');

    if (defi) {
      Utils.toast(`⚔️ Défi "${defi.titre}" créé !`, 'success', 3000);
      Utils.vibrer([100, 50, 100]);
      const c = document.getElementById('social-content');
      if (c) this._rendreDefis(c);
    }
  },

  _rejoindreDefi() {
    const code = document.getElementById('code-defi')?.value?.trim()?.toUpperCase();
    if (!code || code.length < 4) {
      Utils.toast('Entre un code valide !', 'error');
      return;
    }

    // Simuler la recherche d'un défi par code
    const templates  = this.DEFIS_TEMPLATES;
    const template   = templates[Math.floor(Math.random() * templates.length)];
    const defi = this.creerDefi(template.id, code);

    if (defi) {
      Utils.toast(`✅ Défi rejoint ! Code: ${code}`, 'success', 3000);
      document.getElementById('code-defi').value = '';
      const c = document.getElementById('social-content');
      if (c) this._rendreDefis(c);
    }
  },

  // ════════════════════════════════════════════════════════
  // ONGLET GROUPES
  // ════════════════════════════════════════════════════════
  _rendreGroupes(container) {
    const groupesRejoints = this.getGroupesRejoints();
    const profil          = Tracker.getProfil();
    const genre           = Utils.storage.get('ft_profil_onboarding', {})?.genre || 'homme';

    // Filtrer groupes recommandés selon profil
    const groupesReco = this.GROUPES_PUBLICS.filter(g => {
      if (genre === 'femme' && g.type === 'femme') return true;
      try {
        const objectif = Tracker.getProfil()?.objectif || 'forme';
        if (g.type === objectif) return true;
      } catch(e) {}
      return false;
    });

    const groupesRecommandes = [
      ...groupesReco,
      ...this.GROUPES_PUBLICS.filter(g => !groupesReco.includes(g))
    ].slice(0, 8);

    container.innerHTML = `

      <!-- Mes groupes -->
      ${groupesRejoints.length > 0 ? `
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:8px">
          👥 Mes groupes (${groupesRejoints.length})
        </div>
        ${groupesRejoints.map(id => {
          const g = this.GROUPES_PUBLICS.find(gr => gr.id === id);
          if (!g) return '';
          return `
            <div style="display:flex;align-items:center;gap:12px;
                        padding:12px 14px;margin-bottom:8px;
                        background:rgba(75,75,249,0.1);
                        border:1px solid rgba(75,75,249,0.25);
                        border-radius:var(--radius-lg)">
              <span style="font-size:1.5rem;flex-shrink:0">${g.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:700">${g.nom}</div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${g.membres.toLocaleString('fr-FR')} membres · ${g.activite}
                </div>
              </div>
              <button onclick="Social.quitterGroupe('${g.id}');
                               const c=document.getElementById('social-content');
                               if(c)Social._rendreGroupes(c)"
                      style="padding:5px 10px;font-size:.62rem;font-weight:700;
                             background:rgba(255,141,150,0.1);
                             border:1px solid rgba(255,141,150,0.2);
                             border-radius:99px;color:var(--fd-coral);cursor:pointer">
                Quitter
              </button>
            </div>`;
        }).join('')}
        <div style="height:1px;background:rgba(255,255,255,0.08);margin:14px 0"></div>` : ''}

      <!-- Découvrir groupes -->
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
        🔍 Découvrir des groupes
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${groupesRecommandes.map(g => {
          const estRejoint = groupesRejoints.includes(g.id);
          return `
            <div style="display:flex;align-items:center;gap:12px;
                        padding:14px;
                        background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-xl);
                        transition:all .2s"
                 onmouseenter="this.style.borderColor='rgba(75,75,249,0.2)'"
                 onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)'">

              <!-- Emoji groupe -->
              <div style="width:50px;height:50px;border-radius:14px;
                          flex-shrink:0;background:rgba(75,75,249,0.1);
                          border:1px solid rgba(75,75,249,0.2);
                          display:flex;align-items:center;
                          justify-content:center;font-size:1.5rem">
                ${g.emoji}
              </div>

              <!-- Infos -->
              <div style="flex:1;min-width:0">
                <div style="font-size:.88rem;font-weight:700;margin-bottom:2px">
                  ${g.nom}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted);
                            margin-bottom:4px;overflow:hidden;
                            text-overflow:ellipsis;
                            display:-webkit-box;-webkit-line-clamp:2;
                            -webkit-box-orient:vertical">
                  ${g.description}
                </div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span style="font-size:.6rem;color:var(--text-muted)">
                    👥 ${g.membres.toLocaleString('fr-FR')}
                  </span>
                  <span style="font-size:.6rem;
                               color:${g.activite === 'Très actif'
                                 ? 'var(--fd-mint)'
                                 : g.activite === 'Actif'
                                   ? 'var(--fd-lemon)' : 'var(--text-muted)'}">
                    ${g.activite === 'Très actif' ? '🟢'
                      : g.activite === 'Actif' ? '🟡' : '🟤'}
                    ${g.activite}
                  </span>
                </div>
              </div>

              <!-- Bouton -->
              ${estRejoint ? `
                <span style="padding:6px 12px;font-size:.65rem;font-weight:700;
                             background:rgba(75,75,249,0.15);
                             border:1px solid rgba(75,75,249,0.3);
                             border-radius:99px;color:var(--fd-indigo);
                             flex-shrink:0">
                  ✓ Rejoint
                </span>` : `
                <button onclick="Social.rejoindreGroupe('${g.id}');
                                 const c=document.getElementById('social-content');
                                 if(c)Social._rendreGroupes(c)"
                        style="padding:7px 14px;font-size:.68rem;font-weight:700;
                               background:var(--fd-indigo);border:none;
                               border-radius:99px;color:white;cursor:pointer;
                               flex-shrink:0;
                               box-shadow:0 4px 12px rgba(75,75,249,0.4)">
                  + Rejoindre
                </button>`}
            </div>`;
        }).join('')}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // ONGLET FEED
  // ════════════════════════════════════════════════════════
  _rendreFeed(container) {
    const feed   = this._genererFeed();
    const profil = this.getProfilPublic();

    const typeColors = {
      pr:      { bg:'rgba(249,239,119,0.08)', border:'rgba(249,239,119,0.2)',  color:'var(--fd-lemon)'    },
      seance:  { bg:'rgba(75,75,249,0.08)',   border:'rgba(75,75,249,0.2)',    color:'var(--fd-indigo)'   },
      streak:  { bg:'rgba(255,141,150,0.08)', border:'rgba(255,141,150,0.2)', color:'var(--fd-coral)'    },
      niveau:  { bg:'rgba(191,161,255,0.08)', border:'rgba(191,161,255,0.2)', color:'var(--fd-lavender)' },
      defi:    { bg:'rgba(139,240,187,0.08)', border:'rgba(139,240,187,0.2)', color:'var(--fd-mint)'     },
      recette: { bg:'rgba(255,141,150,0.06)', border:'rgba(255,141,150,0.15)','color':'var(--fd-coral)'   },
      objectif:{ bg:'rgba(75,75,249,0.08)',   border:'rgba(75,75,249,0.2)',    color:'var(--fd-indigo)'   }
    };

    container.innerHTML = `

      <!-- Ma publication rapide -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:36px;border-radius:50%;
                      background:rgba(75,75,249,0.2);
                      border:2px solid rgba(75,75,249,0.4);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.1rem;flex-shrink:0">
            ${profil.avatar}
          </div>
          <input id="feed-post-input" type="text"
                 placeholder="Partage ta progression... 💪"
                 style="flex:1;background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-full);
                        padding:8px 14px;color:var(--text-primary);
                        font-size:.78rem;outline:none"/>
        </div>
        <div style="display:flex;gap:6px;justify-content:flex-end">
          ${[
            {emoji:'💪', label:'Séance'},
            {emoji:'🏆', label:'PR'},
            {emoji:'🔥', label:'Streak'},
            {emoji:'📝', label:'Post'}
          ].map(t => `
            <button onclick="Social._publierPost('${t.emoji}','${t.label}')"
                    style="padding:5px 10px;font-size:.65rem;font-weight:600;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:var(--radius-full);
                           color:var(--fd-indigo);cursor:pointer">
              ${t.emoji} ${t.label}
            </button>`).join('')}
        </div>
      </div>

      <!-- Feed -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${feed.map(item => {
          const tc = typeColors[item.type] || typeColors.seance;
          return `
            <div style="background:${item.isMe ? 'rgba(75,75,249,0.08)' : tc.bg};
                        border:1px solid ${item.isMe ? 'rgba(75,75,249,0.25)' : tc.border};
                        border-radius:var(--radius-xl);
                        padding:14px">
              <!-- Header -->
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
                <div style="width:38px;height:38px;border-radius:50%;
                            background:rgba(255,255,255,0.06);
                            border:2px solid ${tc.border};
                            display:flex;align-items:center;
                            justify-content:center;font-size:1.1rem;flex-shrink:0">
                  ${item.avatar}
                </div>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:700">
                    ${item.pseudo}
                    ${item.isMe ? `<span style="font-size:.6rem;padding:1px 6px;margin-left:4px;
                      background:rgba(75,75,249,0.15);border-radius:99px;
                      color:var(--fd-indigo)">Toi</span>` : ''}
                  </div>
                  <div style="font-size:.6rem;color:var(--text-muted)">${item.time}</div>
                </div>
                <span style="font-size:1.2rem">${item.emoji}</span>
              </div>

              <!-- Message -->
              <div style="font-size:.82rem;color:var(--text-secondary);
                          margin-bottom:6px;line-height:1.5">
                <strong style="color:var(--text-primary)">${item.pseudo}</strong>
                ${item.message}
              </div>

              <!-- Détail -->
              ${item.detail ? `
                <div style="padding:6px 10px;
                            background:rgba(255,255,255,0.04);
                            border-radius:var(--radius-md);
                            font-size:.72rem;color:${tc.color};
                            font-weight:600;margin-bottom:10px">
                  ${item.detail}
                </div>` : ''}

              <!-- Actions -->
              <div style="display:flex;gap:12px;align-items:center">
                <button onclick="Social._likerPost('${item.id}',this)"
                        style="display:flex;align-items:center;gap:5px;
                               background:none;border:none;
                               color:${item.liked
                                 ? 'var(--fd-coral)' : 'var(--text-muted)'};
                               font-size:.72rem;font-weight:600;cursor:pointer">
                  ${item.liked ? '❤️' : '🤍'} ${item.likes}
                </button>
                <button style="display:flex;align-items:center;gap:5px;
                               background:none;border:none;
                               color:var(--text-muted);
                               font-size:.72rem;font-weight:600;cursor:pointer">
                  💬 ${item.comments}
                </button>
                <button onclick="navigator.clipboard?.writeText(
                                   'powerapp.fitness/post/${item.id}'
                                 ).then(()=>Utils.toast('✅ Lien copié !','success',1500))"
                        style="margin-left:auto;display:flex;align-items:center;gap:4px;
                               background:none;border:none;
                               color:var(--text-muted);
                               font-size:.68rem;cursor:pointer">
                  📤 Partager
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },

  _likerPost(id, btn) {
    this.toggleLike(id);
    const liked   = Utils.storage.get(this.CLE_FEED, {})[id];
    btn.style.color = liked ? 'var(--fd-coral)' : 'var(--text-muted)';
    const parts   = btn.innerHTML.split(' ');
    const count   = parseInt(parts[1]) || 0;
    btn.innerHTML = `${liked ? '❤️' : '🤍'} ${liked ? count + 1 : count - 1}`;
    Utils.vibrer([10]);
  },

  _publierPost(emoji, type) {
    const texte = document.getElementById('feed-post-input')?.value?.trim();
    const profil = this.getProfilPublic();

    const defaultMessages = {
      '💪': `vient de terminer une séance — Let's go ! 🔥`,
      '🏆': `vient de battre un record personnel ! 🏆`,
      '🔥': `est en feu avec son streak ! 🔥`,
      '📝': texte || `partage sa progression sur PowerApp !`
    };

    Utils.toast(
      `${emoji} Publication partagée !`,
      'success', 2000
    );

    if (document.getElementById('feed-post-input')) {
      document.getElementById('feed-post-input').value = '';
    }

    Utils.vibrerSuccess();
  },

  // ════════════════════════════════════════════════════════
  // ONGLET PARTAGE
  // ════════════════════════════════════════════════════════
  _rendrePartage(container) {
    const profil = this.getProfilPublic();
    const lien   = this.genererLienProfil();

    let topPRs = [];
    try {
      topPRs = Object.entries(Tracker.getAllPRs())
        .filter(([,pr]) => pr.rm1 > 0)
        .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
        .slice(0, 3)
        .map(([ref, pr]) => ({
          nom:   window.EXERCICES?.[ref]?.nom   || ref,
          emoji: window.EXERCICES?.[ref]?.emoji || '💪',
          rm1:   pr.rm1
        }));
    } catch(e) {}

    container.innerHTML = `

      <!-- Partager sur réseaux -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.25);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">${profil.avatar}</div>
        <div style="font-size:1rem;font-weight:800;margin-bottom:4px">
          ${profil.pseudo}
        </div>
        <div style="font-size:.72rem;color:rgba(255,255,255,0.5);margin-bottom:12px">
          ${profil.niveauEmoji} Niv.${profil.niveau} · ${profil.xpTotal.toLocaleString('fr-FR')} XP ·
          ${profil.streak}🔥 streak
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    background:rgba(255,255,255,0.04);
                    padding:6px 12px;border-radius:99px;
                    display:inline-block;margin-bottom:14px">
          🔗 ${lien}
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
          ${[
            {id:'instagram', emoji:'📸', label:'Instagram'},
            {id:'twitter',   emoji:'🐦', label:'Twitter'  },
            {id:'whatsapp',  emoji:'💬', label:'WhatsApp' },
            {id:'copier',    emoji:'📋', label:'Copier'   }
          ].map(r => `
            <button onclick="Social.partagerSurReseaux('${r.id}')"
                    style="padding:10px 6px;text-align:center;
                           background:rgba(255,255,255,0.06);
                           border:1px solid rgba(255,255,255,0.1);
                           border-radius:var(--radius-md);
                           cursor:pointer;transition:all .2s"
                    onmouseenter="this.style.background='rgba(75,75,249,0.15)'"
                    onmouseleave="this.style.background='rgba(255,255,255,0.06)'">
              <div style="font-size:1.2rem;margin-bottom:3px">${r.emoji}</div>
              <div style="font-size:.6rem;font-weight:700;
                          color:var(--text-muted)">${r.label}</div>
            </button>`).join('')}
        </div>
      </div>

      <!-- Carte de stats partageable -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
          📊 Ma carte de stats partageable
        </div>

        <!-- Preview carte -->
        <div id="partage-carte-preview"
             style="background:linear-gradient(135deg,#06063d,#08082e);
                    border:1px solid rgba(75,75,249,0.3);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:12px">

          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
            <div style="font-size:2rem">${profil.avatar}</div>
            <div>
              <div style="font-size:.9rem;font-weight:800">${profil.pseudo}</div>
              <div style="font-size:.65rem;color:rgba(255,255,255,0.4)">
                ${profil.niveauEmoji} Niv.${profil.niveau} · ${profil.niveauNom}
              </div>
            </div>
            <div style="margin-left:auto;font-size:.65rem;color:rgba(75,75,249,0.8)">
              powerapp.fitness
            </div>
          </div>

          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px">
            ${[
              {val:profil.xpTotal.toLocaleString(), label:'XP',     color:'#4b4bf9'},
              {val:`${profil.streak}🔥`,            label:'Streak', color:'#f9ef77'},
              {val:profil.totalSeances,              label:'Séances',color:'#8bf0bb'},
              {val:profil.totalPRs,                  label:'PRs',    color:'#ff8d96'}
            ].map(s => `
              <div style="text-align:center;padding:8px 4px;
                          background:rgba(255,255,255,0.04);
                          border-radius:8px">
                <div style="font-size:.85rem;font-weight:800;color:${s.color}">
                  ${s.val}</div>
                <div style="font-size:.52rem;color:rgba(255,255,255,0.3)">
                  ${s.label}</div>
              </div>`).join('')}
          </div>

          ${topPRs.length > 0 ? `
            <div>
              <div style="font-size:.55rem;color:rgba(255,255,255,0.3);
                          margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em">
                🏆 Top Records
              </div>
              ${topPRs.map(pr => `
                <div style="display:flex;align-items:center;gap:6px;
                            font-size:.65rem;padding:3px 0;
                            border-bottom:1px solid rgba(255,255,255,0.05)">
                  <span>${pr.emoji}</span>
                  <span style="flex:1;color:rgba(255,255,255,0.6)">${pr.nom}</span>
                  <span style="color:#f9ef77;font-weight:700">~${pr.rm1}kg</span>
                </div>`).join('')}
            </div>` : ''}
        </div>

        <button onclick="Social._genererImagePartage()"
                class="btn-primary" style="width:100%;font-size:.85rem">
          📸 Générer l'image
        </button>
      </div>

      <!-- Inviter des amis -->
      <div style="background:rgba(139,240,187,0.06);
                  border:1px solid rgba(139,240,187,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-mint);margin-bottom:10px">
          🎁 Inviter un ami
        </div>
        <div style="font-size:.78rem;color:var(--text-secondary);
                    line-height:1.6;margin-bottom:12px">
          Invite un ami sur PowerApp et défiez-vous mutuellement !
          Tu gagneras <span style="color:var(--fd-lemon);font-weight:700">+200 XP</span>
          à son inscription.
        </div>
        <div style="display:flex;gap:8px">
          <input id="invite-email" type="text"
                 class="input" style="flex:1"
                 placeholder="Pseudo ou email de ton ami"/>
          <button onclick="Social._inviterAmi()"
                  style="padding:10px 16px;background:var(--fd-mint);border:none;
                         border-radius:var(--radius-md);font-size:.78rem;
                         font-weight:700;color:#09092d;cursor:pointer;
                         white-space:nowrap">
            📤 Inviter
          </button>
        </div>
      </div>
    `;
  },

  _genererImagePartage() {
    // Utiliser ResumSeance si disponible
    try {
      const profil  = this.getProfilPublic();
      const canvas  = document.createElement('canvas');
      canvas.width  = 1080;
      canvas.height = 1080;
      const ctx     = canvas.getContext('2d');

      // Fond
      const grad = ctx.createLinearGradient(0, 0, 0, 1080);
      grad.addColorStop(0, '#06063d');
      grad.addColorStop(1, '#050520');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1080);

      // Glow
      const glow = ctx.createRadialGradient(540, 200, 0, 540, 200, 500);
      glow.addColorStop(0, 'rgba(75,75,249,0.3)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 1080, 600);

      // Logo
      ctx.fillStyle    = '#4b4bf9';
      ctx.font         = 'bold 36px system-ui';
      ctx.textAlign    = 'center';
      ctx.fillText('⚡ PowerApp', 540, 100);

      // Avatar + pseudo
      ctx.font      = '120px serif';
      ctx.fillText(profil.avatar, 540, 280);
      ctx.fillStyle = '#ffffff';
      ctx.font      = 'bold 64px system-ui';
      ctx.fillText(profil.pseudo, 540, 360);
      ctx.fillStyle = '#4b4bf9';
      ctx.font      = '32px system-ui';
      ctx.fillText(`${profil.niveauEmoji} Niveau ${profil.niveau} — ${profil.niveauNom}`, 540, 410);

      // Stats
      const stats = [
        { val:profil.xpTotal.toLocaleString(), label:'XP',    color:'#4b4bf9', x:100 },
        { val:`${profil.streak}🔥`,           label:'Streak', color:'#f9ef77', x:380 },
        { val:profil.totalSeances,             label:'Séances',color:'#8bf0bb', x:660 },
        { val:profil.totalPRs,                 label:'PRs',    color:'#ff8d96', x:940 }
      ];

      stats.forEach(s => {
        // Card
        ctx.fillStyle   = 'rgba(255,255,255,0.05)';
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth   = 1;
        ctx.beginPath();
        ctx.roundRect(s.x - 120, 460, 240, 160, 20);
        ctx.fill(); ctx.stroke();
        // Valeur
        ctx.fillStyle = s.color;
        ctx.font      = 'bold 52px system-ui';
        ctx.fillText(s.val, s.x, 550);
        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font      = '26px system-ui';
        ctx.fillText(s.label, s.x, 590);
      });

      // Watermark
      ctx.fillStyle = 'rgba(75,75,249,0.5)';
      ctx.font      = 'bold 24px system-ui';
      ctx.fillText('powerapp.fitness', 540, 980);

      // Télécharger
      const link    = document.createElement('a');
      link.download = `powerapp-profil-${Utils.aujourd_hui()}.png`;
      link.href     = canvas.toDataURL('image/png', 0.95);
      link.click();

      Utils.toast('✅ Image téléchargée !', 'success', 2500);
    } catch(e) {
      Utils.toast('❌ Erreur génération', 'error');
      console.error(e);
    }
  },

  _inviterAmi() {
    const val = document.getElementById('invite-email')?.value?.trim();
    if (!val) { Utils.toast('Entre un pseudo ou email !', 'error'); return; }
    Utils.toast(
      `📤 Invitation envoyée à ${val} !`,
      'success', 2500
    );
    Utils.vibrerSuccess();
    document.getElementById('invite-email').value = '';
    // XP bonus simulé
    setTimeout(() => {
      try { Gamification.ajouterXP(200, 'Invitation ami'); } catch(e) {}
    }, 1000);
  }
};

window.Social = Social;
console.log('✅ Social.js v2.0 — Profil public + Leaderboard + Défis + Groupes + Feed + Partage');
