/* ============================================================
   PowerApp — Defis.js v2.0
   ✅ Défis dynamiques selon niveau
   ✅ Classement défis communauté
   ✅ Défis saisonniers
   ✅ Récompenses XP + badges
   ✅ Historique défis
   ✅ Défis spéciaux surprise
   ============================================================ */

'use strict';

const Defis = {

  CLE_DEFIS:      'ft_defis_actifs',
  CLE_HISTORIQUE: 'ft_defis_historique',
  CLE_SAISON:     'ft_defis_saison',

  // ════════════════════════════════════════════════════════
  // DÉFIS DYNAMIQUES — générés selon niveau + objectif
  // ════════════════════════════════════════════════════════
  _genererDefis() {
    let totalSeances = 0, streak = 0, totalPRs = 0;
    let volumeSemaine = 0, niveau = 1;

    try { totalSeances  = Tracker.getTotalSeances();           } catch(e) {}
    try { streak        = Tracker.getStreak().count;          } catch(e) {}
    try { totalPRs      = Object.keys(Tracker.getAllPRs()).length; } catch(e) {}
    try { volumeSemaine = Tracker.getVolumeSemaine();         } catch(e) {}
    try { niveau        = Gamification.getXP().niveau.numero; } catch(e) {}

    const profil  = (() => {
      try { return Tracker.getProfil(); } catch(e) { return {}; }
    })();
    const objectif = profil.objectif || 'forme';
    const genre    = Utils.storage.get('ft_profil_onboarding', {})?.genre || 'homme';

    const maintenant = new Date();
    const debutSem   = Utils.debutSemaine(Utils.aujourd_hui());
    const finSem     = Utils.ajouterJours(debutSem, 6);

    // Pool de défis adaptés au profil
    const pool = [

      // ─── DÉFI SÉANCES ───
      {
        id:          `defi_seances_${debutSem}`,
        titre:       `${niveau >= 5 ? '5' : niveau >= 3 ? '4' : '3'} séances cette semaine`,
        emoji:       '💪',
        type:        'seances',
        categorie:   'hebdo',
        difficulte:  niveau >= 5 ? 'difficile' : niveau >= 3 ? 'moyen' : 'facile',
        description: `Complète ${niveau >= 5 ? '5' : niveau >= 3 ? '4' : '3'} séances avant dimanche`,
        cible:       niveau >= 5 ? 5 : niveau >= 3 ? 4 : 3,
        xp:          niveau >= 5 ? 400 : niveau >= 3 ? 250 : 150,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '🏅',
        progression: () => {
          try {
            return Tracker.getHistoriqueSeances(7)
              .filter(s => s.date >= debutSem).length;
          } catch(e) { return 0; }
        }
      },

      // ─── DÉFI STREAK ───
      {
        id:          `defi_streak_${debutSem}`,
        titre:       `Streak de ${niveau >= 4 ? '7' : '5'} jours`,
        emoji:       '🔥',
        type:        'streak',
        categorie:   'hebdo',
        difficulte:  niveau >= 4 ? 'difficile' : 'moyen',
        description: `Maintiens ton streak pendant ${niveau >= 4 ? '7' : '5'} jours consécutifs`,
        cible:       niveau >= 4 ? 7 : 5,
        xp:          niveau >= 4 ? 350 : 200,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '🔥',
        progression: () => {
          try { return Tracker.getStreak().count; } catch(e) { return 0; }
        }
      },

      // ─── DÉFI VOLUME ───
      {
        id:          `defi_volume_${debutSem}`,
        titre:       'Volume Monster',
        emoji:       '📦',
        type:        'volume',
        categorie:   'hebdo',
        difficulte:  objectif === 'prise_masse' || objectif === 'force' ? 'difficile' : 'moyen',
        description: `Soulève ${niveau >= 4 ? '10' : '6'} tonnes cette semaine`,
        cible:       (niveau >= 4 ? 10 : 6) * 1000,
        xp:          niveau >= 4 ? 300 : 180,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '💎',
        progression: () => {
          try { return Tracker.getVolumeSemaine(); } catch(e) { return 0; }
        }
      },

      // ─── DÉFI PR ───
      {
        id:          `defi_pr_${debutSem}`,
        titre:       niveau >= 3 ? 'Double Record' : 'Premier Record',
        emoji:       '🏆',
        type:        'prs',
        categorie:   'hebdo',
        difficulte:  niveau >= 3 ? 'moyen' : 'facile',
        description: `Bats ${niveau >= 3 ? '2 PRs' : '1 PR'} cette semaine`,
        cible:       niveau >= 3 ? 2 : 1,
        xp:          niveau >= 3 ? 400 : 200,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '🏆',
        progression: () => {
          try {
            const prsActuels = Tracker.getPRsSeance?.(null) || [];
            const seances    = Tracker.getHistoriqueSeances(7)
              .filter(s => s.date >= debutSem);
            return seances.reduce((a,s) => a + (s.prs?.length || 0), 0);
          } catch(e) { return 0; }
        }
      },

      // ─── DÉFI HYDRATATION ───
      {
        id:          `defi_eau_${debutSem}`,
        titre:       'Hydro Champion',
        emoji:       '💧',
        type:        'hydratation',
        categorie:   'hebdo',
        difficulte:  'facile',
        description: 'Atteins ton objectif eau 5 jours cette semaine',
        cible:       5,
        xp:          150,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '💧',
        progression: () => {
          try {
            const obj  = Utils.storage.get('ft_nutrition_objectifs', {eau:2.5});
            const seuil = (obj.eau || 2.5) * 900;
            let count   = 0;
            for (let i = 0; i < 7; i++) {
              const date = Utils.ajouterJours(debutSem, i);
              if (date > Utils.aujourd_hui()) break;
              const eau  = Utils.storage.get(`ft_nutrition_eau_${date}`, 0);
              if (eau >= seuil) count++;
            }
            return count;
          } catch(e) { return 0; }
        }
      },

      // ─── DÉFI SPÉCIAL GENRE ───
      genre === 'femme' ? {
        id:          `defi_lower_${debutSem}`,
        titre:       'Lower Body Queen 🌸',
        emoji:       '🍑',
        type:        'lower',
        categorie:   'special',
        difficulte:  'moyen',
        description: '3 séances Lower Body / Fessiers cette semaine',
        cible:       3,
        xp:          350,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '👑',
        progression: () => {
          try {
            return Tracker.getHistoriqueSeances(7)
              .filter(s => s.date >= debutSem &&
                (s.id?.includes('lower') || s.id?.includes('fessier'))
              ).length;
          } catch(e) { return 0; }
        }
      } : {
        id:          `defi_force_${debutSem}`,
        titre:       'Force Brute',
        emoji:       '💥',
        type:        'force',
        categorie:   'special',
        difficulte:  'difficile',
        description: 'Bats ton record sur Bench, Squat ou Deadlift',
        cible:       1,
        xp:          500,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '🔥',
        progression: () => {
          try {
            const bigThree = ['bench_press','squat','soulevé_terre'];
            const prs      = Tracker.getAllPRs();
            return bigThree.filter(ref => {
              const pr = prs[ref];
              return pr?.date >= debutSem;
            }).length;
          } catch(e) { return 0; }
        }
      },

      // ─── DÉFI NUTRITION ───
      {
        id:          `defi_nutrition_${debutSem}`,
        titre:       'Nutrition Parfaite',
        emoji:       '🥗',
        type:        'nutrition',
        categorie:   'hebdo',
        difficulte:  'moyen',
        description: 'Atteins ton objectif protéines 4 jours cette semaine',
        cible:       4,
        xp:          200,
        dateDebut:   debutSem,
        dateFin:     finSem,
        iconeRecomp: '🥗',
        progression: () => {
          try {
            const obj  = Utils.storage.get('ft_nutrition_objectifs', {proteines:160});
            const seuil = (obj.proteines || 160) * 0.9;
            let count   = 0;
            for (let i = 0; i < 7; i++) {
              const date  = Utils.ajouterJours(debutSem, i);
              if (date > Utils.aujourd_hui()) break;
              const j     = Utils.storage.get(`ft_nutrition_journal_${date}`, []);
              const prot  = j.reduce((a,e) => a+(e.prot||0), 0);
              if (prot >= seuil) count++;
            }
            return count;
          } catch(e) { return 0; }
        }
      }
    ];

    return pool.filter(Boolean);
  },

  // ════════════════════════════════════════════════════════
  // DÉFIS SAISON
  // ════════════════════════════════════════════════════════
  DEFIS_SAISON: [
    {
      id:          'saison_100_seances',
      titre:       '100 Séances',
      emoji:       '💯',
      type:        'seances_total',
      categorie:   'saison',
      difficulte:  'legendaire',
      description: 'Atteins le cap des 100 séances totales',
      cible:       100,
      xp:          2000,
      iconeRecomp: '👑',
      progression: () => {
        try { return Tracker.getTotalSeances(); } catch(e) { return 0; }
      }
    },
    {
      id:          'saison_50_prs',
      titre:       '50 Records Personnels',
      emoji:       '🏆',
      type:        'prs_total',
      categorie:   'saison',
      difficulte:  'legendaire',
      description: 'Bats 50 records personnels au total',
      cible:       50,
      xp:          3000,
      iconeRecomp: '⭐',
      progression: () => {
        try { return Object.keys(Tracker.getAllPRs()).length; } catch(e) { return 0; }
      }
    },
    {
      id:          'saison_streak_30',
      titre:       '30 Jours Consécutifs',
      emoji:       '🔥',
      type:        'streak_max',
      categorie:   'saison',
      difficulte:  'epique',
      description: 'Maintiens un streak de 30 jours',
      cible:       30,
      xp:          1500,
      iconeRecomp: '💎',
      progression: () => {
        try { return Tracker.getStreak().max; } catch(e) { return 0; }
      }
    },
    {
      id:          'saison_niveau_5',
      titre:       'Niveau Expert',
      emoji:       '⚡',
      type:        'niveau',
      categorie:   'saison',
      difficulte:  'epique',
      description: 'Atteins le niveau 5 — Expert',
      cible:       5,
      xp:          2500,
      iconeRecomp: '🔥',
      progression: () => {
        try { return Gamification.getXP().niveau.numero; } catch(e) { return 1; }
      }
    },
    {
      id:          'saison_1000_series',
      titre:       '1000 Séries',
      emoji:       '💪',
      type:        'series_total',
      categorie:   'saison',
      difficulte:  'epique',
      description: 'Valide 1000 séries au total',
      cible:       1000,
      xp:          1800,
      iconeRecomp: '🏆',
      progression: () => {
        try {
          return Tracker.getHistoriqueSeances(999)
            .reduce((a,s) => a + (s.series?.length || 0), 0);
        } catch(e) { return 0; }
      }
    }
  ],

  // ════════════════════════════════════════════════════════
  // LEADERBOARD DÉFIS
  // ════════════════════════════════════════════════════════
  getLeaderboardDefis() {
    let totalSeances = 0, streakMax = 0, totalXP = 0;
    try { totalSeances = Tracker.getTotalSeances();           } catch(e) {}
    try { streakMax    = Tracker.getStreak().max;             } catch(e) {}
    try { totalXP      = Gamification.getXP().total;         } catch(e) {}

    const moi    = Utils.storage.get('ft_profil_onboarding', {});
    const pseudo = Utils.storage.get('ft_social_profil', {})?.pseudo
      || moi.nom || 'Moi';

    const communaute = [
      { pseudo:'MaxPower',    avatar:'👑', seances:342, streak:45, xp:28450, defisTotal:28 },
      { pseudo:'IronFist',    avatar:'💎', seances:198, streak:22, xp:15200, defisTotal:19 },
      { pseudo:'FitQueen 🌸', avatar:'🌸', seances:187, streak:18, xp:14800, defisTotal:17 },
      { pseudo:'StrengthX',   avatar:'🔥', seances:142, streak:12, xp:8900,  defisTotal:14 },
      { pseudo:'GymWarrior',  avatar:'⚡', seances:128, streak:9,  xp:7200,  defisTotal:11 },
      { pseudo:'NaturalBeast',avatar:'🏆', seances:89,  streak:7,  xp:4500,  defisTotal:8  },
      { pseudo:'IronBody',    avatar:'💪', seances:76,  streak:5,  xp:3800,  defisTotal:7  },
      { pseudo:'Rookie2024',  avatar:'🌱', seances:24,  streak:2,  xp:800,   defisTotal:3  }
    ];

    const defisFaits = Utils.storage.get(this.CLE_HISTORIQUE, []).length;

    const joueurs = [
      ...communaute,
      {
        pseudo, avatar: '🙋',
        seances: totalSeances, streak: streakMax,
        xp: totalXP, defisTotal: defisFaits,
        isMe: true
      }
    ].sort((a,b) => b.defisTotal - a.defisTotal)
     .map((j,i) => ({ ...j, rang:i+1 }));

    return joueurs;
  },

  // ════════════════════════════════════════════════════════
  // VÉRIFICATION DÉFIS
  // ════════════════════════════════════════════════════════
  verifierDefis() {
    const defis    = this._genererDefis();
    const historique = Utils.storage.get(this.CLE_HISTORIQUE, []);
    const termines   = new Set(historique.map(d => d.id));
    const nouveaux   = [];

    defis.forEach(defi => {
      if (termines.has(defi.id)) return;

      const prog = defi.progression?.() || 0;
      if (prog >= defi.cible) {
        historique.push({
          id:     defi.id,
          titre:  defi.titre,
          emoji:  defi.emoji,
          xp:     defi.xp,
          date:   Utils.aujourd_hui()
        });
        nouveaux.push(defi);
      }
    });

    // Vérifier défis saison
    this.DEFIS_SAISON.forEach(defi => {
      if (termines.has(defi.id)) return;
      const prog = defi.progression?.() || 0;
      if (prog >= defi.cible) {
        historique.push({
          id:     defi.id,
          titre:  defi.titre,
          emoji:  defi.emoji,
          xp:     defi.xp,
          date:   Utils.aujourd_hui()
        });
        nouveaux.push(defi);
      }
    });

    if (nouveaux.length > 0) {
      Utils.storage.set(this.CLE_HISTORIQUE, historique);
      nouveaux.forEach((d, i) => {
        setTimeout(() => {
          Utils.toast(
            `🎯 Défi accompli : ${d.emoji} ${d.titre} ! +${d.xp} XP`,
            'pr', 5000
          );
          try { Gamification.ajouterXP(d.xp, `Défi ${d.titre}`); } catch(e) {}
          Utils.vibrer([100,50,200]);
        }, i * 2000);
      });
    }

    return nouveaux;
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    // Vérifier défis en arrière-plan
    try { this.verifierDefis(); } catch(e) {}

    container.innerHTML = `
      <div style="display:flex;gap:5px;overflow-x:auto;
                  scrollbar-width:none;margin-bottom:14px">
        ${[
          { id:'semaine',    label:'📅 Cette semaine' },
          { id:'saison',     label:'🏆 Saison'        },
          { id:'classement', label:'🌍 Classement'    },
          { id:'historique', label:'✅ Historique'    }
        ].map(t => `
          <button onclick="Defis._changerOnglet('${t.id}')"
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
      <div id="defis-content"></div>`;

    this._rendreOnglet();
  },

  _ongletActif: 'semaine',

  _changerOnglet(id) {
    this._ongletActif = id;
    const c = document.getElementById('page-defis')
      || document.getElementById('page-training');
    if (c) this.render(c);
  },

  _rendreOnglet() {
    const c = document.getElementById('defis-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'semaine':    this._rendreSemaine(c);    break;
      case 'saison':     this._rendreSaison(c);     break;
      case 'classement': this._rendreClassement(c); break;
      case 'historique': this._rendreHistorique(c); break;
    }
  },

  // ─── ONGLET SEMAINE ─────────────────────────────────────
  _rendreSemaine(container) {
    const defis      = this._genererDefis();
    const historique = Utils.storage.get(this.CLE_HISTORIQUE, []);
    const termines   = new Set(historique.map(d => d.id));

    const xpTotal    = defis.reduce((a,d) => a + d.xp, 0);
    const xpGagne    = defis
      .filter(d => termines.has(d.id))
      .reduce((a,d) => a + d.xp, 0);
    const nbTermines = defis.filter(d => termines.has(d.id)).length;

    const debutSem   = Utils.debutSemaine(Utils.aujourd_hui());
    const finSem     = Utils.ajouterJours(debutSem, 6);

    const diffColors = {
      facile:    { bg:'rgba(139,240,187,0.08)', border:'rgba(139,240,187,0.2)', color:'var(--fd-mint)'     },
      moyen:     { bg:'rgba(75,75,249,0.08)',   border:'rgba(75,75,249,0.2)',   color:'var(--fd-indigo)'   },
      difficile: { bg:'rgba(249,239,119,0.08)', border:'rgba(249,239,119,0.2)','color':'var(--fd-lemon)'   },
      legendaire:{ bg:'rgba(255,141,150,0.08)', border:'rgba(255,141,150,0.2)','color':'var(--fd-coral)'   },
      special:   { bg:'rgba(191,161,255,0.08)', border:'rgba(191,161,255,0.2)','color':'var(--fd-lavender)'}
    };

    container.innerHTML = `

      <!-- Header semaine -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.25);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;
                    align-items:flex-start;margin-bottom:10px">
          <div>
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--fd-indigo);margin-bottom:4px">
              📅 Défis de la semaine
            </div>
            <div style="font-size:.72rem;color:var(--text-muted)">
              ${defis[0]?.dateDebut || debutSem} → ${finSem}
            </div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.2rem;font-weight:900;color:var(--fd-lemon)">
              ${xpGagne}/${xpTotal}
            </div>
            <div style="font-size:.6rem;color:var(--text-muted)">XP gagnés</div>
          </div>
        </div>

        <!-- Barre progression -->
        <div style="height:8px;background:rgba(255,255,255,0.06);
                    border-radius:99px;overflow:hidden;margin-bottom:6px">
          <div style="height:100%;
                      width:${Math.round((nbTermines/Math.max(defis.length,1))*100)}%;
                      background:linear-gradient(90deg,
                        var(--fd-indigo),var(--fd-mint));
                      border-radius:99px;transition:width 1s ease"></div>
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);text-align:center">
          ${nbTermines} / ${defis.length} défis accomplis
        </div>
      </div>

      <!-- Liste défis -->
      <div style="display:flex;flex-direction:column;gap:10px">
        ${defis.map(defi => {
          const estTermine  = termines.has(defi.id);
          const progActuelle= defi.progression?.() || 0;
          const pct         = Math.min(100,
            Math.round((progActuelle / Math.max(defi.cible,1)) * 100)
          );
          const dc          = diffColors[defi.difficulte] || diffColors.moyen;

          return `
            <div style="background:${estTermine
                ? 'rgba(139,240,187,0.08)'
                : dc.bg};
                        border:1px solid ${estTermine
                ? 'rgba(139,240,187,0.3)'
                : dc.border};
                        border-radius:var(--radius-xl);
                        padding:16px;
                        ${estTermine ? 'opacity:.85;' : ''}
                        transition:all .3s">

              <!-- Header -->
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
                <div style="width:48px;height:48px;border-radius:14px;
                            flex-shrink:0;display:flex;align-items:center;
                            justify-content:center;font-size:1.6rem;
                            background:${dc.bg};
                            border:1px solid ${dc.border}">
                  ${estTermine ? '✅' : defi.emoji}
                </div>
                <div style="flex:1">
                  <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
                    <div style="font-size:.88rem;font-weight:800">
                      ${defi.titre}
                    </div>
                    ${defi.categorie === 'special' ? `
                      <span style="padding:1px 6px;font-size:.55rem;
                                   font-weight:700;border-radius:99px;
                                   background:rgba(191,161,255,0.15);
                                   color:var(--fd-lavender)">
                        ✨ SPÉCIAL
                      </span>` : ''}
                  </div>
                  <div style="font-size:.65rem;color:var(--text-muted);
                              margin-bottom:4px">
                    ${defi.description}
                  </div>
                  <div style="font-size:.6rem;padding:2px 8px;
                              background:${dc.bg};border:1px solid ${dc.border};
                              border-radius:99px;display:inline-block;
                              color:${dc.color};font-weight:700">
                    ${defi.difficulte}
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:.85rem;font-weight:800;
                              color:var(--fd-lemon)">+${defi.xp}</div>
                  <div style="font-size:.55rem;color:var(--text-muted)">XP</div>
                </div>
              </div>

              <!-- Progression -->
              <div>
                <div style="display:flex;justify-content:space-between;
                            font-size:.65rem;color:var(--text-muted);
                            margin-bottom:5px">
                  <span>Progression</span>
                  <span style="font-weight:700;
                               color:${estTermine ? 'var(--fd-mint)' : dc.color}">
                    ${progActuelle} / ${defi.cible}
                    ${defi.type === 'volume' ? 'kg' : ''}
                    (${pct}%)
                  </span>
                </div>
                <div style="height:8px;background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${estTermine ? 'var(--fd-mint)' : dc.color};
                              border-radius:99px;transition:width .8s ease"></div>
                </div>
              </div>

              ${estTermine ? `
                <div style="margin-top:10px;text-align:center;
                            font-size:.72rem;color:var(--fd-mint);font-weight:700">
                  🎉 Défi accompli ! ${defi.iconeRecomp} +${defi.xp} XP gagné
                </div>` : pct >= 80 ? `
                <div style="margin-top:8px;font-size:.65rem;
                            color:var(--fd-lemon);font-weight:600;text-align:center">
                  🔥 Presque ! Plus que ${defi.cible - progActuelle} pour finir !
                </div>` : ''}
            </div>`;
        }).join('')}
      </div>
    `;
  },

  // ─── ONGLET SAISON ──────────────────────────────────────
  _rendreSaison(container) {
    const historique = Utils.storage.get(this.CLE_HISTORIQUE, []);
    const termines   = new Set(historique.map(d => d.id));

    const diffColors = {
      epique:     { bg:'rgba(191,161,255,0.1)', border:'rgba(191,161,255,0.3)', color:'var(--fd-lavender)' },
      legendaire: { bg:'rgba(249,239,119,0.1)', border:'rgba(249,239,119,0.3)','color':'var(--fd-lemon)'   }
    };

    container.innerHTML = `
      <div style="background:linear-gradient(135deg,
                  rgba(249,239,119,0.1),rgba(75,75,249,0.05));
                  border:1px solid rgba(249,239,119,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:6px">
          🏆 Défis de Saison — Récompenses épiques
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Ces défis à long terme te définissent comme athlète.
          Chaque accomplissement débloque un badge légendaire.
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        ${this.DEFIS_SAISON.map(defi => {
          const estTermine   = termines.has(defi.id);
          const progActuelle = defi.progression?.() || 0;
          const pct          = Math.min(100,
            Math.round((progActuelle / Math.max(defi.cible,1)) * 100)
          );
          const dc = diffColors[defi.difficulte] || diffColors.epique;

          return `
            <div style="background:${estTermine
                ? 'rgba(249,239,119,0.1)'
                : dc.bg};
                        border:${estTermine
                ? '2px solid rgba(249,239,119,0.4)'
                : `1px solid ${dc.border}`};
                        border-radius:var(--radius-xl);
                        padding:18px;
                        position:relative;overflow:hidden">

              ${estTermine ? `
                <div style="position:absolute;top:12px;right:12px;
                            font-size:.62rem;font-weight:700;padding:3px 8px;
                            background:rgba(249,239,119,0.2);
                            border:1px solid rgba(249,239,119,0.4);
                            border-radius:99px;color:var(--fd-lemon)">
                  ✅ ACCOMPLI
                </div>` : `
                <div style="position:absolute;top:12px;right:12px;
                            font-size:.6rem;font-weight:700;padding:3px 8px;
                            background:${dc.bg};
                            border:1px solid ${dc.border};
                            border-radius:99px;color:${dc.color}">
                  ${defi.difficulte.toUpperCase()}
                </div>`}

              <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">
                <div style="font-size:2.5rem">${estTermine ? '🏆' : defi.emoji}</div>
                <div>
                  <div style="font-size:1rem;font-weight:800;margin-bottom:3px">
                    ${defi.titre}
                  </div>
                  <div style="font-size:.72rem;color:var(--text-muted)">
                    ${defi.description}
                  </div>
                </div>
              </div>

              <!-- Progression -->
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;
                            font-size:.68rem;margin-bottom:5px">
                  <span style="color:var(--text-muted)">
                    ${progActuelle.toLocaleString('fr-FR')} /
                    ${defi.cible.toLocaleString('fr-FR')}
                  </span>
                  <span style="font-weight:800;color:${dc.color}">
                    ${pct}%
                  </span>
                </div>
                <div style="height:10px;background:rgba(255,255,255,0.06);
                            border-radius:99px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;
                              background:${estTermine
                                ? 'var(--fd-lemon)'
                                : `linear-gradient(90deg,${dc.color},${dc.color}aa)`};
                              border-radius:99px;
                              transition:width 1s ease;
                              box-shadow:${estTermine
                                ? '0 0 8px rgba(249,239,119,0.5)' : 'none'}">
                  </div>
                </div>
              </div>

              <!-- Récompense -->
              <div style="display:flex;align-items:center;
                          justify-content:space-between">
                <div style="font-size:.65rem;color:var(--text-muted)">
                  ${defi.iconeRecomp} Badge + Badge légendaire
                </div>
                <div style="font-size:.78rem;font-weight:800;color:var(--fd-lemon)">
                  +${defi.xp.toLocaleString('fr-FR')} XP
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },

  // ─── ONGLET CLASSEMENT ──────────────────────────────────
  _rendreClassement(container) {
    const ldb = this.getLeaderboardDefis();

    container.innerHTML = `
      <div style="background:rgba(249,239,119,0.08);
                  border:1px solid rgba(249,239,119,0.2);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:4px">
          🌍 Classement Défis
        </div>
        <div style="font-size:.72rem;color:var(--text-muted)">
          Classé par nombre de défis accomplis
        </div>
      </div>

      <!-- Top 3 -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                  gap:8px;margin-bottom:14px">
        ${ldb.slice(0,3).map((j,i) => {
          const couleurs = ['var(--fd-lemon)','#c0c0c0','#cd7f32'];
          const podiums  = ['🥇','🥈','🥉'];
          return `
            <div style="text-align:center;padding:12px 6px;
                        background:${j.isMe
                          ?'rgba(75,75,249,0.15)':'rgba(255,255,255,0.04)'};
                        border:${j.isMe
                          ?'2px solid var(--fd-indigo)':'1px solid rgba(255,255,255,0.08)'};
                        border-radius:var(--radius-xl)">
              <div style="font-size:1.3rem;margin-bottom:4px">${j.avatar}</div>
              <div style="font-size:.62rem;font-weight:800;
                          color:${j.isMe?'var(--fd-indigo)':'var(--text-primary)'};
                          margin-bottom:2px;overflow:hidden;
                          text-overflow:ellipsis;white-space:nowrap">
                ${j.pseudo}
              </div>
              <div style="font-size:1.1rem;color:${couleurs[i]}">${podiums[i]}</div>
              <div style="font-size:.7rem;font-weight:700;
                          color:${couleurs[i]}">
                ${j.defisTotal} défis
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Reste -->
      <div style="display:flex;flex-direction:column;gap:6px">
        ${ldb.slice(3).map(j => `
          <div style="display:flex;align-items:center;gap:12px;
                      padding:10px 14px;
                      background:${j.isMe
                        ?'rgba(75,75,249,0.1)':'rgba(255,255,255,0.03)'};
                      border:1px solid ${j.isMe
                        ?'rgba(75,75,249,0.25)':'rgba(255,255,255,0.06)'};
                      border-radius:var(--radius-lg)">
            <div style="width:24px;text-align:center;font-size:.78rem;
                        font-weight:800;color:var(--text-muted)">
              #${j.rang}
            </div>
            <div style="font-size:1.1rem">${j.avatar}</div>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:700;
                          color:${j.isMe?'var(--fd-indigo)':'var(--text-primary)'}">
                ${j.pseudo}
                ${j.isMe ? `<span style="font-size:.58rem;padding:1px 5px;margin-left:4px;
                  background:rgba(75,75,249,0.15);border-radius:99px;
                  color:var(--fd-indigo)">Toi</span>` : ''}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${j.seances} séances · ${j.xp.toLocaleString('fr-FR')} XP
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:.85rem;font-weight:800;color:var(--fd-lemon)">
                ${j.defisTotal}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">défis</div>
            </div>
          </div>`).join('')}
      </div>
    `;
  },

  // ─── ONGLET HISTORIQUE ──────────────────────────────────
  _rendreHistorique(container) {
    const historique = Utils.storage.get(this.CLE_HISTORIQUE, [])
      .reverse();
    const xpTotal    = historique.reduce((a,d) => a + (d.xp || 0), 0);

    container.innerHTML = `
      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { val:historique.length,              label:'Défis accomplis', color:'var(--fd-indigo)'   },
          { val:`${xpTotal.toLocaleString()} XP`,label:'XP gagnés',      color:'var(--fd-lemon)'    },
          { val:historique.filter(d => d.date >= Utils.debutSemaine(Utils.aujourd_hui())).length,
            label:'Cette semaine', color:'var(--fd-mint)'     }
        ].map(s => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:12px;text-align:center">
            <div style="font-size:.9rem;font-weight:800;color:${s.color}">
              ${s.val}</div>
            <div style="font-size:.58rem;color:var(--text-muted);margin-top:2px">
              ${s.label}</div>
          </div>`).join('')}
      </div>

      ${historique.length === 0 ? `
        <div style="text-align:center;padding:40px 16px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">🎯</div>
          <div style="font-size:.88rem">Aucun défi accompli encore</div>
          <div style="font-size:.72rem;margin-top:4px">
            Commence par les défis de la semaine !
          </div>
        </div>` :
        historique.map(d => `
          <div style="display:flex;align-items:center;gap:12px;
                      padding:12px 14px;margin-bottom:8px;
                      background:rgba(139,240,187,0.06);
                      border:1px solid rgba(139,240,187,0.15);
                      border-radius:var(--radius-lg)">
            <span style="font-size:1.4rem;flex-shrink:0">${d.emoji}</span>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:700">${d.titre}</div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                ${Utils.formatDateCourt?.(d.date) || d.date}
              </div>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <div style="font-size:.78rem;font-weight:700;color:var(--fd-lemon)">
                +${d.xp} XP
              </div>
              <div style="font-size:.55rem;color:var(--fd-mint)">✅ Accompli</div>
            </div>
          </div>`).join('')}
    `;
  }
};

window.Defis = Defis;
console.log('✅ Defis.js v2.0 — Défis dynamiques + Saison + Classement + Historique');
