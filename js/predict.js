/* ============================================================
   PowerApp — Predict.js v1.0
   ✅ Prédiction date atteinte objectifs
   ✅ Analyse surmenage prédictif
   ✅ Recommandation charge prochaine séance
   ✅ Graphiques évolution projetée
   ✅ Détection plateau
   ✅ Score récupération intelligent
   ✅ Analyse tendances long terme
   ============================================================ */

'use strict';

const Predict = {

  // ════════════════════════════════════════════════════════
  // RÉGRESSION LINÉAIRE — Moteur IA
  // ════════════════════════════════════════════════════════
  _regressionLineaire(valeurs) {
    const n = valeurs.length;
    if (n < 2) return { pente:0, intercept:valeurs[0]||0, r2:0 };

    const xMoy = (n - 1) / 2;
    const yMoy = valeurs.reduce((a,b) => a+b, 0) / n;

    let num = 0, den = 0, ssTot = 0, ssRes = 0;
    valeurs.forEach((y, x) => {
      num    += (x - xMoy) * (y - yMoy);
      den    += (x - xMoy) ** 2;
      ssTot  += (y - yMoy) ** 2;
    });

    const pente     = den !== 0 ? num / den : 0;
    const intercept = yMoy - pente * xMoy;

    valeurs.forEach((y, x) => {
      const yPred = pente * x + intercept;
      ssRes += (y - yPred) ** 2;
    });

    const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;

    return { pente, intercept, r2 };
  },

  _predireValeur(regression, xFutur) {
    return regression.pente * xFutur + regression.intercept;
  },

  _arrondir2_5(val) {
    return Math.round(val / 2.5) * 2.5;
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION 1RM
  // ════════════════════════════════════════════════════════
  predire1RM(ref, semainesAvant = 12) {
    try {
      const hist = Tracker.getHistoriqueExercice(ref, 200);
      if (hist.length < 3) return null;

      // Grouper par semaine
      const parSemaine = {};
      hist.forEach(h => {
        const sem = Utils.debutSemaine(h.date);
        if (!parSemaine[sem] || (h.rm1||0) > (parSemaine[sem]||0)) {
          parSemaine[sem] = h.rm1 || 0;
        }
      });

      const series = Object.entries(parSemaine)
        .sort(([a],[b]) => a.localeCompare(b))
        .map(([,v]) => v)
        .filter(v => v > 0);

      if (series.length < 3) return null;

      const reg    = this._regressionLineaire(series);
      const actuel = series[series.length - 1];
      const projections = [];

      for (let i = 1; i <= semainesAvant; i++) {
        const val = this._predireValeur(reg, series.length - 1 + i);
        projections.push({
          semaine: i,
          label:   `S+${i}`,
          date:    Utils.ajouterJours(Utils.aujourd_hui(), i * 7),
          valeur:  Math.max(actuel, this._arrondir2_5(val))
        });
      }

      const gainMensuel = this._arrondir2_5(reg.pente * 4);
      const tendance    = reg.pente > 1   ? 'forte'
                        : reg.pente > 0.3 ? 'légère'
                        : reg.pente > 0   ? 'stable'
                        :                   'stagnation';

      return {
        ref,
        actuel,
        projections,
        gainMensuel,
        tendance,
        fiabilite:  Math.round(reg.r2 * 100),
        regression: reg
      };
    } catch(e) { return null; }
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION DATE OBJECTIF
  // ════════════════════════════════════════════════════════
  predireDateObjectif(ref, cible) {
    try {
      const pred = this.predire1RM(ref, 52);
      if (!pred) return null;

      if (pred.actuel >= cible) {
        return {
          atteint:   true,
          message:   `🎉 Objectif déjà atteint ! 1RM actuel : ${pred.actuel}kg`,
          dansJours: 0
        };
      }

      const semaineAtteinte = pred.projections
        .find(p => p.valeur >= cible);

      if (!semaineAtteinte) {
        return {
          atteint:   false,
          impossible:true,
          message:   `À ce rythme, l'objectif semble hors de portée à 12 mois`,
          conseil:   'Augmente la fréquence ou optimise la nutrition'
        };
      }

      return {
        atteint:      false,
        date:         semaineAtteinte.date,
        dansJours:    semaineAtteinte.semaine * 7,
        dansSemaines: semaineAtteinte.semaine,
        message:      `📅 Objectif ${cible}kg estimé dans ${semaineAtteinte.semaine} semaines`,
        fiabilite:    pred.fiabilite
      };
    } catch(e) { return null; }
  },

  // ════════════════════════════════════════════════════════
  // DÉTECTION PLATEAU
  // ════════════════════════════════════════════════════════
  detecterPlateau(ref, semaines = 6) {
    try {
      const hist = Tracker.getHistoriqueExercice(ref, 200);
      if (hist.length < 4) return null;

      const recent  = hist.slice(-semaines * 3);
      const rm1s    = recent.map(h => h.rm1 || 0).filter(v => v > 0);
      if (rm1s.length < 3) return null;

      const reg      = this._regressionLineaire(rm1s);
      const variance = rm1s.reduce((acc, val) => {
        const moy = rm1s.reduce((a,b) => a+b,0) / rm1s.length;
        return acc + (val - moy) ** 2;
      }, 0) / rm1s.length;

      const estPlateau = Math.abs(reg.pente) < 0.3 && variance < 25;

      if (!estPlateau) return null;

      const ex      = window.EXERCICES?.[ref];
      const conseils = [
        `🔄 Change de schéma de sets (essaie les 5×5 ou 3×8-10)`,
        `📈 Augmente la fréquence à 2× par semaine pour cet exercice`,
        `🍽️ Vérifie ton surplus calorique — as-tu assez mangé cette semaine ?`,
        `😴 Planifie une semaine de décharge pour une super-compensation`,
        `💡 Essaie une variation : ${ex?.variations?.[0] || 'exercice similaire'}`
      ];

      return {
        ref,
        nom:        ex?.nom || ref,
        emoji:      ex?.emoji || '💪',
        durée:      `${semaines} semaines`,
        pente:      Math.round(reg.pente * 100) / 100,
        message:    `Plateau détecté sur ${ex?.nom || ref}`,
        conseils
      };
    } catch(e) { return null; }
  },

  detecterTousPlateaux() {
    try {
      const prs = Tracker.getAllPRs();
      const plateaux = [];
      Object.keys(prs).forEach(ref => {
        const p = this.detecterPlateau(ref);
        if (p) plateaux.push(p);
      });
      return plateaux;
    } catch(e) { return []; }
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATION CHARGE
  // ════════════════════════════════════════════════════════
  recommanderCharge(ref) {
    try {
      const hist = Tracker.getHistoriqueExercice(ref, 50);
      if (!hist.length) return null;

      const derniereSeance   = hist.slice(-5);
      const meilleureRecente = Math.max(...derniereSeance.map(h => h.poids || 0));
      const dernier          = hist[hist.length - 1];
      const pr               = Tracker.getPR(ref);
      const rpeRecents       = derniereSeance
        .map(h => h.rpe || 0)
        .filter(v => v > 0);
      const rpeMoyen         = rpeRecents.length > 0
        ? rpeRecents.reduce((a,b) => a+b, 0) / rpeRecents.length
        : 7;

      let action    = 'maintenir';
      let variation = 0;
      let raison    = '';
      let zones     = null;

      // Logique de progression
      if (rpeMoyen <= 6.5) {
        action    = 'augmenter';
        variation = meilleureRecente >= 100 ? 5 : 2.5;
        raison    = `RPE moyen de ${rpeMoyen.toFixed(1)} — tu peux charger plus !`;
      } else if (rpeMoyen >= 9) {
        action    = 'diminuer';
        variation = -(meilleureRecente >= 100 ? 5 : 2.5);
        raison    = `RPE élevé (${rpeMoyen.toFixed(1)}) — récupère avant d'augmenter`;
      } else if (rpeMoyen <= 7.5 && pr?.rm1 > 0) {
        // Vérifier si progression possible via RM
        const prog = this.predire1RM(ref, 1);
        if (prog && prog.projections[0]?.valeur > dernier.poids) {
          action    = 'augmenter';
          variation = 2.5;
          raison    = `Progression IA suggère +2.5kg cette semaine`;
        } else {
          action    = 'maintenir';
          raison    = `RPE optimal — maintiens la charge`;
        }
      } else {
        action = 'maintenir';
        raison = `Charge optimale cette semaine`;
      }

      const nouvCharge = this._arrondir2_5(meilleureRecente + variation);

      // Calculer zones d'entraînement
      if (pr?.rm1 > 0) {
        zones = [
          { label:'Endurance', pct:50, kg:this._arrondir2_5(pr.rm1 * 0.50), color:'#8bf0bb' },
          { label:'Volume',    pct:65, kg:this._arrondir2_5(pr.rm1 * 0.65), color:'#4b4bf9' },
          { label:'Hypertro.', pct:75, kg:this._arrondir2_5(pr.rm1 * 0.75), color:'#bfa1ff' },
          { label:'Force',     pct:85, kg:this._arrondir2_5(pr.rm1 * 0.85), color:'#f9ef77' },
          { label:'Max',       pct:95, kg:this._arrondir2_5(pr.rm1 * 0.95), color:'#ff8d96' }
        ];
      }

      const ex = window.EXERCICES?.[ref];

      return {
        ref,
        nom:             ex?.nom   || ref,
        emoji:           ex?.emoji || '💪',
        derniereCharge:  meilleureRecente,
        chargeRecommandee: Math.max(0, nouvCharge),
        action,
        variation,
        raison,
        rpeMoyen:        Math.round(rpeMoyen * 10) / 10,
        zones
      };
    } catch(e) { return null; }
  },

  // ════════════════════════════════════════════════════════
  // ANALYSE SURMENAGE PRÉDICTIF
  // ════════════════════════════════════════════════════════
  analyserSurmenage() {
    try {
      const seances7j   = Tracker.getHistoriqueSeances(7);
      const seances14j  = Tracker.getHistoriqueSeances(14);
      const streak      = Tracker.getStreak().count;
      const rpe7j       = Tracker.getRPEMoyen7Jours?.() || 0;
      const volumeSem   = Tracker.getVolumeSemaine();
      const volMoyenne  = Tracker.getVolumeParSemaine?.(4)
        ?.reduce((a,s) => a + s.volume, 0) / 4 || volumeSem;

      let score         = 0; // 0-100 (100 = surmenage certain)
      const signaux     = [];
      const conseils    = [];

      // Signal 1 — RPE élevé
      if (rpe7j >= 9) {
        score += 30;
        signaux.push({ emoji:'😤', label:'RPE très élevé', val:`${rpe7j}/10`, severity:'high' });
        conseils.push('💤 Planifie 1-2 jours de repos complet');
      } else if (rpe7j >= 8) {
        score += 15;
        signaux.push({ emoji:'😤', label:'RPE élevé', val:`${rpe7j}/10`, severity:'medium' });
        conseils.push('⚡ Réduis l\'intensité de 15-20% cette semaine');
      }

      // Signal 2 — Volume excessif
      const ratioVol = volMoyenne > 0 ? volumeSem / volMoyenne : 1;
      if (ratioVol > 1.4) {
        score += 25;
        signaux.push({
          emoji:'📦', label:'Volume +40% vs moyenne',
          val:`${Math.round(ratioVol * 100)}%`, severity:'high'
        });
        conseils.push('📉 Réduis le volume de 20-30% la semaine prochaine');
      } else if (ratioVol > 1.2) {
        score += 12;
        signaux.push({
          emoji:'📦', label:'Volume élevé',
          val:`+${Math.round((ratioVol-1) * 100)}% vs moyenne`, severity:'medium'
        });
      }

      // Signal 3 — Fréquence excessive
      if (seances7j.length >= 6) {
        score += 20;
        signaux.push({
          emoji:'📅', label:'6+ séances / semaine',
          val:`${seances7j.length} séances`, severity:'high'
        });
        conseils.push('😴 Le repos est partie intégrante de la progression');
      } else if (seances7j.length >= 5) {
        score += 10;
        signaux.push({
          emoji:'📅', label:'Fréquence élevée',
          val:`${seances7j.length} séances/semaine`, severity:'medium'
        });
      }

      // Signal 4 — Streak très long sans décharge
      if (streak >= 21) {
        score += 20;
        signaux.push({
          emoji:'🔥', label:'Streak sans décharge',
          val:`${streak} jours`, severity:'high'
        });
        conseils.push('📅 Programme une semaine de décharge (50-60% de l\'intensité)');
      } else if (streak >= 14) {
        score += 10;
        signaux.push({
          emoji:'🔥', label:'Streak long',
          val:`${streak} jours`, severity:'medium'
        });
      }

      // Signal 5 — Surcharge musculaire
      try {
        const surcharge = Tracker.getSurchargeMusculaire?.() || [];
        if (surcharge.length >= 3) {
          score += 15;
          signaux.push({
            emoji:'⚠️', label:'Surcharge musculaire multiple',
            val:`${surcharge.length} groupes`, severity:'high'
          });
          conseils.push('🔄 Varie les groupes musculaires — respecte 48h de repos');
        }
      } catch(e) {}

      score = Math.min(100, score);

      const niveau = score >= 70 ? 'critique'
                   : score >= 50 ? 'élevé'
                   : score >= 30 ? 'modéré'
                   :               'normal';

      const messages = {
        critique: '🚨 Surmenage probable — repos conseillé',
        élevé:    '⚠️ Fatigue accumulée — surveille les signaux',
        modéré:   '🟡 Fatigue légère — continue prudemment',
        normal:   '✅ Récupération optimale — continue !'
      };

      // Prédiction surmenage
      let predictionJours = null;
      if (niveau !== 'normal' && niveau !== 'modéré') {
        predictionJours = Math.round(score / 10);
      }

      return {
        score,
        niveau,
        message:   messages[niveau],
        signaux,
        conseils:  [...new Set(conseils)],
        predictionJours,
        seances7j: seances7j.length,
        rpe7j,
        streak
      };
    } catch(e) {
      return {
        score:0, niveau:'normal',
        message:'✅ Données insuffisantes',
        signaux:[], conseils:[]
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // SCORE RÉCUPÉRATION
  // ════════════════════════════════════════════════════════
  calculerScoreRecuperation() {
    try {
      let score = 100;
      const facteurs = [];

      const rpe     = Tracker.getRPEMoyen7Jours?.() || 0;
      const streak  = Tracker.getStreak().count;
      const hier    = Utils.ajouterJours(Utils.aujourd_hui(), -1);
      const seanceHier = Tracker.getHistoriqueSeances(2)
        .find(s => s.date === hier);

      // RPE
      if (rpe >= 9) {
        score -= 30;
        facteurs.push({ label:'RPE très élevé', impact:-30, emoji:'😤' });
      } else if (rpe >= 8) {
        score -= 15;
        facteurs.push({ label:'RPE élevé', impact:-15, emoji:'😤' });
      } else if (rpe <= 6) {
        score += 10;
        facteurs.push({ label:'RPE optimal', impact:+10, emoji:'😊' });
      }

      // Streak
      if (streak >= 14) {
        score -= 20;
        facteurs.push({ label:'Streak long', impact:-20, emoji:'🔥' });
      } else if (streak >= 7) {
        score -= 10;
        facteurs.push({ label:'Streak 7j+', impact:-10, emoji:'🔥' });
      } else if (streak <= 3) {
        score += 5;
        facteurs.push({ label:'Repos récent', impact:+5, emoji:'😴' });
      }

      // Séance hier
      if (seanceHier) {
        if ((seanceHier.volumeTotal || 0) > 8000) {
          score -= 20;
          facteurs.push({ label:'Volume élevé hier', impact:-20, emoji:'📦' });
        } else if ((seanceHier.volumeTotal || 0) > 5000) {
          score -= 10;
          facteurs.push({ label:'Séance hier', impact:-10, emoji:'💪' });
        }
      } else {
        score += 15;
        facteurs.push({ label:'Repos hier', impact:+15, emoji:'✅' });
      }

      // Nutrition
      try {
        const nutObj = Utils.storage.get('ft_nutrition_objectifs', null);
        if (nutObj) {
          const totaux = (() => {
            const journal = Utils.storage.get(
              `ft_nutrition_journal_${hier}`, []
            );
            return journal.reduce(
              (t,e) => ({ prot: t.prot + (e.prot||0) }),
              { prot:0 }
            );
          })();
          if (totaux.prot >= nutObj.proteines * 0.9) {
            score += 10;
            facteurs.push({ label:'Protéines suffisantes', impact:+10, emoji:'🥩' });
          }
        }
      } catch(e) {}

      score = Math.max(0, Math.min(100, score));

      return {
        score,
        niveau:  score >= 80 ? 'optimal'
               : score >= 60 ? 'bon'
               : score >= 40 ? 'moyen'
               :               'faible',
        couleur: score >= 80 ? 'var(--fd-mint)'
               : score >= 60 ? 'var(--fd-lemon)'
               : score >= 40 ? '#ffa500'
               :               'var(--fd-coral)',
        facteurs,
        conseil: score >= 80
          ? '🚀 Tu es en pleine forme — séance intensive recommandée !'
          : score >= 60
            ? '💪 Bonne récup — séance normale recommandée'
            : score >= 40
              ? '⚡ Fatigue légère — baisse l\'intensité de 10-15%'
              : '😴 Récupération insuffisante — repos ou séance légère'
      };
    } catch(e) {
      return { score:70, niveau:'bon', couleur:'var(--fd-lemon)', facteurs:[], conseil:'' };
    }
  },

  // ════════════════════════════════════════════════════════
  // ANALYSE TENDANCES LONG TERME
  // ════════════════════════════════════════════════════════
  analyserTendances() {
    try {
      const seances = Tracker.getHistoriqueSeances(90);
      if (seances.length < 4) return null;

      // Volume par semaine
      const volParSem  = Tracker.getVolumeParSemaine?.(12) || [];
      const volumes    = volParSem.map(s => s.volume).filter(v => v > 0);

      // Progression globale
      let tendanceVolume = 'stable';
      if (volumes.length >= 4) {
        const reg = this._regressionLineaire(volumes);
        tendanceVolume = reg.pente > 500  ? 'hausse_forte'
                       : reg.pente > 100  ? 'hausse'
                       : reg.pente < -500 ? 'baisse_forte'
                       : reg.pente < -100 ? 'baisse'
                       :                    'stable';
      }

      // Fréquence moyenne
      const freqMoyenne = seances.length / 13; // 13 semaines

      // Meilleur jour de la semaine
      const jours = [0,0,0,0,0,0,0];
      seances.forEach(s => {
        const d = new Date(s.date).getDay();
        jours[d]++;
      });
      const meilleurJourIdx = jours.indexOf(Math.max(...jours));
      const nomsJours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

      // Heure préférée simulée
      const heures = ['matin','après-midi','soir'];
      const heurePref = heures[Math.floor(Math.random() * heures.length)];

      // PRs ce mois
      const debutMois = `${new Date().getFullYear()}-${
        String(new Date().getMonth()+1).padStart(2,'0')}-01`;
      const prsCeMois  = Object.values(Tracker.getAllPRs())
        .filter(pr => pr.date >= debutMois).length;

      return {
        tendanceVolume,
        freqMoyenne:    Math.round(freqMoyenne * 10) / 10,
        meilleurJour:   nomsJours[meilleurJourIdx],
        heurePref,
        prsCeMois,
        totalSeances90j:seances.length,
        volumeTotal90j: seances.reduce((a,s) => a + (s.volumeTotal||0), 0),
        message: tendanceVolume === 'hausse_forte' || tendanceVolume === 'hausse'
          ? '📈 Volume en progression — excellent travail !'
          : tendanceVolume === 'baisse' || tendanceVolume === 'baisse_forte'
            ? '📉 Volume en baisse — reprends de l\'élan !'
            : '➡️ Volume stable — maintiens la régularité'
      };
    } catch(e) { return null; }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  _ongletActif: 'dashboard',
  _charts: {},

  render(container) {
    if (!container) return;

    Object.values(this._charts).forEach(c => {
      try { c.destroy(); } catch(e) {}
    });
    this._charts = {};

    container.innerHTML = `
      <div style="display:flex;gap:6px;overflow-x:auto;
                  scrollbar-width:none;margin-bottom:14px">
        ${[
          { id:'dashboard',  label:'📊 Dashboard'   },
          { id:'surmenage',  label:'⚠️ Surmenage'   },
          { id:'charges',    label:'💪 Charges IA'  },
          { id:'objectifs',  label:'🎯 Prédictions' },
          { id:'tendances',  label:'📈 Tendances'   }
        ].map(t => `
          <button onclick="Predict._changerOnglet('${t.id}')"
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
      <div id="predict-content"></div>`;

    this._rendreOnglet();
  },

  _changerOnglet(id) {
    this._ongletActif = id;
    const c = document.getElementById('page-predict')
      || document.getElementById('page-content');
    if (c) this.render(c);
  },

  _rendreOnglet() {
    const c = document.getElementById('predict-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'dashboard':  this._rendreDashboard(c);  break;
      case 'surmenage':  this._rendreSurmenage(c);  break;
      case 'charges':    this._rendreCharges(c);    break;
      case 'objectifs':  this._rendreObjectifs(c);  break;
      case 'tendances':  this._rendreTendances(c);  break;
    }
  },

  // ────────────────────────────────────────────────────────
  // DASHBOARD IA
  // ────────────────────────────────────────────────────────
  _rendreDashboard(container) {
    const recup      = this.calculerScoreRecuperation();
    const surmenage  = this.analyserSurmenage();
    const tendances  = this.analyserTendances();
    const plateaux   = this.detecterTousPlateaux();

    // Top exercices pour charges IA
    let topCharges = [];
    try {
      const prs = Tracker.getAllPRs();
      topCharges = Object.keys(prs)
        .slice(0, 3)
        .map(ref => this.recommanderCharge(ref))
        .filter(Boolean);
    } catch(e) {}

    container.innerHTML = `

      <!-- Score récupération -->
      <div style="background:linear-gradient(135deg,
                  ${recup.couleur}22,${recup.couleur}05);
                  border:1px solid ${recup.couleur}44;
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:16px">

          <!-- Arc SVG -->
          <div style="flex-shrink:0;position:relative">
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle cx="45" cy="45" r="36" fill="none"
                      stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
              <circle cx="45" cy="45" r="36" fill="none"
                      stroke="${recup.couleur}" stroke-width="10"
                      stroke-linecap="round"
                      stroke-dasharray="${Math.round(226*(recup.score/100))} 226"
                      transform="rotate(-90 45 45)"
                      style="transition:stroke-dasharray 1s ease"/>
              <text x="45" y="49" text-anchor="middle"
                    fill="white" font-size="16" font-weight="900">
                ${recup.score}
              </text>
            </svg>
          </div>

          <div style="flex:1">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:${recup.couleur};margin-bottom:4px">
              🔋 Score récupération
            </div>
            <div style="font-size:1rem;font-weight:800;margin-bottom:4px">
              ${recup.niveau.charAt(0).toUpperCase() + recup.niveau.slice(1)}
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);line-height:1.5">
              ${recup.conseil}
            </div>
          </div>
        </div>

        <!-- Facteurs -->
        ${recup.facteurs.length > 0 ? `
          <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
            ${recup.facteurs.map(f => `
              <span style="padding:3px 10px;font-size:.62rem;font-weight:700;
                           background:rgba(255,255,255,0.06);
                           border:1px solid rgba(255,255,255,0.1);
                           border-radius:99px;
                           color:${f.impact > 0
                             ? 'var(--fd-mint)'
                             : f.impact < -10
                               ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
                ${f.emoji} ${f.label}
                (${f.impact > 0 ? '+' : ''}${f.impact})
              </span>`).join('')}
          </div>` : ''}
      </div>

      <!-- Alerte surmenage si critique -->
      ${surmenage.score >= 50 ? `
        <div style="background:rgba(255,141,150,0.08);
                    border:1px solid rgba(255,141,150,0.3);
                    border-left:4px solid var(--fd-coral);
                    border-radius:var(--radius-lg);
                    padding:14px 16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-coral);margin-bottom:6px">
            ${surmenage.niveau === 'critique' ? '🚨' : '⚠️'} Risque de surmenage
          </div>
          <div style="font-size:.82rem;font-weight:700;margin-bottom:4px">
            Score fatigue : ${surmenage.score}/100
          </div>
          ${surmenage.conseils.slice(0,2).map(c => `
            <div style="font-size:.72rem;color:var(--text-muted);
                        padding:3px 0;border-bottom:1px solid rgba(255,141,150,0.1)">
              ${c}
            </div>`).join('')}
          <button onclick="Predict._changerOnglet('surmenage')"
                  style="margin-top:8px;padding:5px 12px;font-size:.68rem;
                         font-weight:700;background:rgba(255,141,150,0.15);
                         border:1px solid rgba(255,141,150,0.3);
                         border-radius:99px;color:var(--fd-coral);cursor:pointer">
            Voir l'analyse complète →
          </button>
        </div>` : ''}

      <!-- Plateaux détectés -->
      ${plateaux.length > 0 ? `
        <div style="background:rgba(249,239,119,0.08);
                    border:1px solid rgba(249,239,119,0.2);
                    border-radius:var(--radius-lg);
                    padding:14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:8px">
            📊 ${plateaux.length} plateau${plateaux.length > 1 ? 'x' : ''} détecté${plateaux.length > 1 ? 's' : ''}
          </div>
          ${plateaux.map(p => `
            <div style="display:flex;align-items:center;gap:8px;
                        padding:6px 0;
                        border-bottom:1px solid rgba(249,239,119,0.1)">
              <span style="font-size:1rem">${p.emoji}</span>
              <div style="flex:1;font-size:.78rem;font-weight:600">${p.nom}</div>
              <span style="font-size:.65rem;color:var(--fd-lemon)">
                ${p.durée}
              </span>
            </div>`).join('')}
          <button onclick="Predict._changerOnglet('charges')"
                  style="margin-top:8px;padding:5px 12px;font-size:.68rem;
                         font-weight:700;background:rgba(249,239,119,0.12);
                         border:1px solid rgba(249,239,119,0.25);
                         border-radius:99px;color:var(--fd-lemon);cursor:pointer">
            Voir les conseils →
          </button>
        </div>` : ''}

      <!-- Recommandations charges -->
      ${topCharges.length > 0 ? `
        <div style="background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px">
            💡 Recommandations charges IA
          </div>
          ${topCharges.map(c => `
            <div style="display:flex;align-items:center;gap:12px;
                        padding:10px 0;
                        border-bottom:1px solid rgba(255,255,255,0.05)">
              <span style="font-size:1.2rem;flex-shrink:0">${c.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">${c.nom}</div>
                <div style="font-size:.62rem;color:var(--text-muted)">${c.raison}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:.95rem;font-weight:900;
                            color:${c.action === 'augmenter'
                              ? 'var(--fd-mint)'
                              : c.action === 'diminuer'
                                ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
                  ${c.chargeRecommandee}kg
                </div>
                <div style="font-size:.55rem;
                            color:${c.action === 'augmenter'
                              ? 'var(--fd-mint)'
                              : c.action === 'diminuer'
                                ? 'var(--fd-coral)' : 'var(--text-muted)'}">
                  ${c.action === 'augmenter' ? '↑ +' + c.variation + 'kg'
                    : c.action === 'diminuer' ? '↓ ' + c.variation + 'kg'
                    : '→ maintenir'}
                </div>
              </div>
            </div>`).join('')}
        </div>` : ''}

      <!-- Tendances -->
      ${tendances ? `
        <div style="background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-lg);
                    padding:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px">
            📈 Insights 90 jours
          </div>
          ${[
            {
              label:'Tendance volume',
              val: tendances.tendanceVolume === 'hausse_forte' ? '📈 Forte hausse'
                 : tendances.tendanceVolume === 'hausse' ? '📈 En hausse'
                 : tendances.tendanceVolume === 'baisse' ? '📉 En baisse'
                 : tendances.tendanceVolume === 'baisse_forte' ? '📉 Forte baisse'
                 : '➡️ Stable',
              color: tendances.tendanceVolume.includes('hausse') ? 'var(--fd-mint)'
                   : tendances.tendanceVolume.includes('baisse') ? 'var(--fd-coral)'
                   : 'var(--fd-lemon)'
            },
            { label:'Fréquence moyenne', val:`${tendances.freqMoyenne} séances/semaine`, color:'var(--fd-indigo)' },
            { label:'Meilleur jour',     val:tendances.meilleurJour,    color:'var(--fd-lavender)' },
            { label:'PRs ce mois',       val:`${tendances.prsCeMois} records`, color:'var(--fd-lemon)' }
          ].map(s => `
            <div style="display:flex;align-items:center;gap:8px;
                        padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="flex:1;font-size:.75rem;color:var(--text-muted)">
                ${s.label}
              </div>
              <div style="font-size:.82rem;font-weight:700;color:${s.color}">
                ${s.val}
              </div>
            </div>`).join('')}
        </div>` : ''}
    `;
  },

  // ────────────────────────────────────────────────────────
  // SURMENAGE
  // ────────────────────────────────────────────────────────
  _rendreSurmenage(container) {
    const analyse = this.analyserSurmenage();

    const niveauColors = {
      normal:   { bg:'rgba(139,240,187,0.08)', border:'rgba(139,240,187,0.25)', color:'var(--fd-mint)'  },
      modéré:   { bg:'rgba(249,239,119,0.08)', border:'rgba(249,239,119,0.25)', color:'var(--fd-lemon)' },
      élevé:    { bg:'rgba(255,165,0,0.08)',   border:'rgba(255,165,0,0.25)',   color:'#ffa500'          },
      critique: { bg:'rgba(255,141,150,0.08)', border:'rgba(255,141,150,0.25)','color':'var(--fd-coral)' }
    };

    const nc = niveauColors[analyse.niveau] || niveauColors.normal;

    container.innerHTML = `

      <!-- Score surmenage -->
      <div style="background:${nc.bg};border:2px solid ${nc.border};
                  border-radius:var(--radius-xl);padding:20px;margin-bottom:14px">
        <div style="display:flex;align-items:center;gap:16px">
          <div style="position:relative;flex-shrink:0">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none"
                      stroke="rgba(255,255,255,0.06)" stroke-width="12"/>
              <circle cx="50" cy="50" r="40" fill="none"
                      stroke="${nc.color}" stroke-width="12"
                      stroke-linecap="round"
                      stroke-dasharray="${Math.round(251*(analyse.score/100))} 251"
                      transform="rotate(-90 50 50)"
                      style="transition:stroke-dasharray 1.2s ease"/>
              <text x="50" y="54" text-anchor="middle"
                    fill="white" font-size="18" font-weight="900">
                ${analyse.score}
              </text>
            </svg>
            <div style="position:absolute;bottom:-4px;left:50%;
                        transform:translateX(-50%);font-size:.52rem;
                        color:var(--text-muted);white-space:nowrap">
              /100
            </div>
          </div>
          <div style="flex:1">
            <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.1em;color:${nc.color};margin-bottom:4px">
              Niveau de fatigue
            </div>
            <div style="font-size:1.2rem;font-weight:900;
                        color:${nc.color};margin-bottom:4px;text-transform:capitalize">
              ${analyse.niveau}
            </div>
            <div style="font-size:.75rem;color:var(--text-secondary)">
              ${analyse.message}
            </div>
          </div>
        </div>
      </div>

      <!-- Signaux détectés -->
      ${analyse.signaux.length > 0 ? `
        <div style="background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
            📡 Signaux détectés (${analyse.signaux.length})
          </div>
          ${analyse.signaux.map(s => {
            const sColor = s.severity === 'high'
              ? 'var(--fd-coral)'
              : 'var(--fd-lemon)';
            return `
              <div style="display:flex;align-items:center;gap:12px;
                          padding:10px 12px;margin-bottom:8px;
                          background:${s.severity === 'high'
                            ? 'rgba(255,141,150,0.08)'
                            : 'rgba(249,239,119,0.08)'};
                          border:1px solid ${s.severity === 'high'
                            ? 'rgba(255,141,150,0.2)'
                            : 'rgba(249,239,119,0.2)'};
                          border-radius:var(--radius-md)">
                <span style="font-size:1.3rem;flex-shrink:0">${s.emoji}</span>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:700">${s.label}</div>
                </div>
                <div style="font-size:.82rem;font-weight:800;
                            color:${sColor};flex-shrink:0">
                  ${s.val}
                </div>
              </div>`;
          }).join('')}
        </div>` : `
        <div style="background:rgba(139,240,187,0.08);
                    border:1px solid rgba(139,240,187,0.2);
                    border-radius:var(--radius-lg);
                    padding:16px;margin-bottom:14px;text-align:center">
          <div style="font-size:2rem;margin-bottom:8px">✅</div>
          <div style="font-size:.88rem;color:var(--fd-mint);font-weight:700">
            Aucun signal de surmenage détecté
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
            Continue sur cette lancée !
          </div>
        </div>`}

      <!-- Conseils IA -->
      ${analyse.conseils.length > 0 ? `
        <div style="background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:12px">
            🤖 Recommandations IA
          </div>
          ${analyse.conseils.map((c,i) => `
            <div style="display:flex;align-items:flex-start;gap:10px;
                        padding:8px 0;
                        border-bottom:1px solid rgba(75,75,249,0.1)">
              <div style="width:20px;height:20px;border-radius:50%;
                          background:rgba(75,75,249,0.2);
                          border:1px solid rgba(75,75,249,0.4);
                          display:flex;align-items:center;justify-content:center;
                          font-size:.62rem;font-weight:700;
                          color:var(--fd-indigo);flex-shrink:0;margin-top:2px">
                ${i+1}
              </div>
              <div style="font-size:.78rem;color:var(--text-secondary);
                          line-height:1.5">${c}</div>
            </div>`).join('')}
        </div>` : ''}

      <!-- Stats actuelles -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-lg);padding:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px">
          📊 Données analysées
        </div>
        ${[
          {label:'Séances 7 derniers jours', val:analyse.seances7j, emoji:'💪'},
          {label:'RPE moyen 7 jours',        val:`${analyse.rpe7j || 0}/10`, emoji:'😤'},
          {label:'Streak actuel',            val:`${analyse.streak} jours`, emoji:'🔥'}
        ].map(s => `
          <div style="display:flex;align-items:center;gap:8px;
                      padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
            <span style="font-size:.9rem">${s.emoji}</span>
            <div style="flex:1;font-size:.75rem;color:var(--text-muted)">${s.label}</div>
            <div style="font-size:.82rem;font-weight:700">${s.val}</div>
          </div>`).join('')}
      </div>
    `;
  },

  // ────────────────────────────────────────────────────────
  // CHARGES IA
  // ────────────────────────────────────────────────────────
  _rendreCharges(container) {
    const prs     = Tracker.getAllPRs();
    const exoRefs = Object.keys(prs);
    const plateaux = this.detecterTousPlateaux();

    container.innerHTML = `

      <!-- Sélection exercice -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-lg);
                  padding:14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px">
          🔍 Analyse d'un exercice
        </div>
        <select id="predict-exo-select" class="input"
                onchange="Predict._afficherChargeExo(this.value)">
          <option value="">-- Choisir un exercice --</option>
          ${exoRefs.map(ref => {
            const ex = window.EXERCICES?.[ref];
            return `<option value="${ref}">
              ${ex?.emoji || '💪'} ${ex?.nom || ref}
            </option>`;
          }).join('')}
        </select>
      </div>

      <div id="predict-charge-detail"></div>

      <!-- Plateaux -->
      ${plateaux.length > 0 ? `
        <div style="background:rgba(249,239,119,0.06);
                    border:1px solid rgba(249,239,119,0.2);
                    border-radius:var(--radius-xl);
                    padding:16px;margin-top:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-lemon);margin-bottom:12px">
            📊 Plateaux détectés — Conseils IA
          </div>
          ${plateaux.map(p => `
            <div style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-md);
                        padding:12px;margin-bottom:10px">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                <span style="font-size:1.3rem">${p.emoji}</span>
                <div>
                  <div style="font-size:.85rem;font-weight:700">${p.nom}</div>
                  <div style="font-size:.62rem;color:var(--fd-lemon)">
                    Plateau depuis ${p.durée}
                  </div>
                </div>
              </div>
              ${p.conseils.slice(0,3).map((c,i) => `
                <div style="font-size:.72rem;color:var(--text-muted);
                            padding:4px 0;
                            border-bottom:1px solid rgba(255,255,255,0.04)">
                  ${i+1}. ${c}
                </div>`).join('')}
            </div>`).join('')}
        </div>` : ''}
    `;
  },

  _afficherChargeExo(ref) {
    const el = document.getElementById('predict-charge-detail');
    if (!el || !ref) return;

    const charge = this.recommanderCharge(ref);
    const pred   = this.predire1RM(ref, 8);
    const plateau = this.detecterPlateau(ref);

    if (!charge) {
      el.innerHTML = `<div style="text-align:center;padding:16px;
        color:var(--text-muted)">Pas assez de données</div>`;
      return;
    }

    el.innerHTML = `
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:10px">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <span style="font-size:1.8rem">${charge.emoji}</span>
          <div>
            <div style="font-size:.95rem;font-weight:800">${charge.nom}</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              RPE moyen récent : ${charge.rpeMoyen}/10
            </div>
          </div>
        </div>

        <!-- Recommandation principale -->
        <div style="background:${charge.action === 'augmenter'
            ? 'rgba(139,240,187,0.1)'
            : charge.action === 'diminuer'
              ? 'rgba(255,141,150,0.1)'
              : 'rgba(249,239,119,0.1)'};
                    border:1px solid ${charge.action === 'augmenter'
            ? 'rgba(139,240,187,0.3)'
            : charge.action === 'diminuer'
              ? 'rgba(255,141,150,0.3)'
              : 'rgba(249,239,119,0.3)'};
                    border-radius:var(--radius-lg);
                    padding:16px;margin-bottom:14px;text-align:center">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;margin-bottom:6px;
                      color:${charge.action === 'augmenter'
                        ? 'var(--fd-mint)'
                        : charge.action === 'diminuer'
                          ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
            💡 Recommandation prochaine séance
          </div>
          <div style="font-size:3rem;font-weight:900;
                      color:${charge.action === 'augmenter'
                        ? 'var(--fd-mint)'
                        : charge.action === 'diminuer'
                          ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
            ${charge.chargeRecommandee}kg
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
            ${charge.action === 'augmenter' ? `↑ +${charge.variation}kg`
              : charge.action === 'diminuer' ? `↓ ${charge.variation}kg`
              : '→ Maintenir'}
            vs ${charge.derniereCharge}kg dernière séance
          </div>
          <div style="margin-top:8px;font-size:.72rem;
                      color:var(--text-secondary);line-height:1.5">
            ${charge.raison}
          </div>
        </div>

        <!-- Zones d'entraînement -->
        ${charge.zones ? `
          <div style="margin-bottom:14px">
            <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
              📊 Zones d'entraînement
            </div>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">
              ${charge.zones.map(z => `
                <div style="text-align:center;padding:8px 4px;
                            background:${z.color}22;
                            border:1px solid ${z.color}44;
                            border-radius:var(--radius-md)">
                  <div style="font-size:.78rem;font-weight:800;color:${z.color}">
                    ${z.kg}kg</div>
                  <div style="font-size:.55rem;color:var(--text-muted)">${z.pct}%</div>
                  <div style="font-size:.52rem;color:var(--text-muted)">${z.label}</div>
                </div>`).join('')}
            </div>
          </div>` : ''}

        <!-- Prédiction progression -->
        ${pred ? `
          <div>
            <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.1em;color:var(--text-muted);margin-bottom:8px">
              🔮 Projection 1RM — 8 semaines
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;
                        margin-bottom:8px">
              ${[
                { label:'Actuel',    val:pred.actuel,                          color:'var(--fd-indigo)'   },
                { label:'+4 sem.',   val:pred.projections[3]?.valeur || '—',   color:'var(--fd-lavender)' },
                { label:'+6 sem.',   val:pred.projections[5]?.valeur || '—',   color:'var(--fd-lemon)'    },
                { label:'+8 sem.',   val:pred.projections[7]?.valeur || '—',   color:'var(--fd-mint)'     }
              ].map(p => `
                <div style="text-align:center;padding:8px 4px;
                            background:rgba(255,255,255,0.04);
                            border-radius:var(--radius-md)">
                  <div style="font-size:.88rem;font-weight:800;color:${p.color}">
                    ${typeof p.val === 'number' ? p.val + 'kg' : p.val}
                  </div>
                  <div style="font-size:.55rem;color:var(--text-muted)">${p.label}</div>
                </div>`).join('')}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);text-align:center">
              Fiabilité : ${pred.fiabilite}% · Gain estimé : +${pred.gainMensuel}kg/mois
              <br>Tendance : ${pred.tendance}
            </div>
          </div>` : ''}

        <!-- Plateau -->
        ${plateau ? `
          <div style="margin-top:12px;padding:10px 12px;
                      background:rgba(249,239,119,0.08);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-md)">
            <div style="font-size:.65rem;font-weight:700;
                        color:var(--fd-lemon);margin-bottom:4px">
              ⚠️ Plateau détecté
            </div>
            <div style="font-size:.72rem;color:var(--text-muted)">
              ${plateau.conseils[0]}
            </div>
          </div>` : ''}
      </div>`;
  },

  // ────────────────────────────────────────────────────────
  // OBJECTIFS PRÉDICTIONS
  // ────────────────────────────────────────────────────────
  _rendreObjectifs(container) {
    const prs   = Tracker.getAllPRs();
    const refs  = Object.keys(prs).filter(r => prs[r].rm1 > 0);

    container.innerHTML = `

      <!-- Prédire atteinte objectif -->
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:12px">
          🎯 Prédire la date d'un objectif
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
              Exercice
            </div>
            <select id="pred-obj-exo" class="input">
              <option value="">-- Choisir --</option>
              ${refs.map(ref => {
                const ex = window.EXERCICES?.[ref];
                return `<option value="${ref}">
                  ${ex?.emoji||'💪'} ${ex?.nom||ref}
                  (actuel: ${prs[ref].rm1}kg)
                </option>`;
              }).join('')}
            </select>
          </div>
          <div>
            <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
              Objectif 1RM (kg)
            </div>
            <input id="pred-obj-cible" type="number"
                   class="input" placeholder="ex: 100"
                   min="1" max="500"/>
          </div>
          <button onclick="Predict._calculerPrediction()"
                  class="btn-primary" style="width:100%">
            🔮 Calculer
          </button>
        </div>
      </div>

      <div id="pred-obj-result"></div>

      <!-- Projections pour tous les exercices -->
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-top:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
          📈 Projections à 3 mois — Top exercices
        </div>
        ${refs.slice(0,5).map(ref => {
          const ex   = window.EXERCICES?.[ref];
          const pred = this.predire1RM(ref, 12);
          if (!pred) return '';
          const dans3mois = pred.projections[11]?.valeur || pred.actuel;
          const gain      = dans3mois - pred.actuel;
          return `
            <div style="display:flex;align-items:center;gap:10px;
                        padding:10px 0;
                        border-bottom:1px solid rgba(255,255,255,0.05)">
              <span style="font-size:1.1rem;flex-shrink:0">${ex?.emoji||'💪'}</span>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">${ex?.nom||ref}</div>
                <div style="font-size:.6rem;color:var(--text-muted)">
                  Actuel : ${pred.actuel}kg · Tendance : ${pred.tendance}
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:.88rem;font-weight:800;
                            color:${gain > 0 ? 'var(--fd-mint)' : 'var(--text-muted)'}">
                  ~${dans3mois}kg
                </div>
                <div style="font-size:.58rem;
                            color:${gain > 0 ? 'var(--fd-mint)' : 'var(--text-muted)'}">
                  ${gain > 0 ? '+' : ''}${gain}kg
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },

  _calculerPrediction() {
    const ref    = document.getElementById('pred-obj-exo')?.value;
    const cible  = parseFloat(document.getElementById('pred-obj-cible')?.value);
    const el     = document.getElementById('pred-obj-result');
    if (!el) return;

    if (!ref || !cible) {
      Utils.toast('Sélectionne un exercice et entre une cible !', 'error');
      return;
    }

    const pred = this.predireDateObjectif(ref, cible);
    const ex   = window.EXERCICES?.[ref];

    if (!pred) {
      el.innerHTML = `
        <div style="text-align:center;padding:16px;color:var(--text-muted)">
          Pas assez de données pour cette prédiction
        </div>`;
      return;
    }

    const couleur = pred.atteint    ? 'var(--fd-mint)'
                  : pred.impossible ? 'var(--fd-coral)'
                  :                   'var(--fd-indigo)';

    el.innerHTML = `
      <div style="background:${couleur}11;border:1px solid ${couleur}44;
                  border-radius:var(--radius-xl);padding:16px;margin-bottom:10px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <span style="font-size:1.5rem">${ex?.emoji||'💪'}</span>
          <div>
            <div style="font-size:.88rem;font-weight:700">${ex?.nom||ref}</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Objectif : ${cible}kg au 1RM
            </div>
          </div>
        </div>

        <div style="text-align:center;padding:16px 0">
          <div style="font-size:3rem;margin-bottom:8px">
            ${pred.atteint ? '🎉' : pred.impossible ? '😔' : '🔮'}
          </div>
          <div style="font-size:.95rem;font-weight:700;color:${couleur}">
            ${pred.message}
          </div>
          ${pred.dansSemaines ? `
            <div style="margin-top:8px;display:flex;
                        justify-content:center;gap:20px">
              <div style="text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:${couleur}">
                  ${pred.dansSemaines}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">semaines</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:1.5rem;font-weight:900;color:${couleur}">
                  ${pred.dansJours}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">jours</div>
              </div>
            </div>
            <div style="margin-top:8px;font-size:.68rem;color:var(--text-muted)">
              📅 Date estimée : ${pred.date}
              · Fiabilité : ${pred.fiabilite}%
            </div>` : ''}
          ${pred.conseil ? `
            <div style="margin-top:10px;font-size:.72rem;
                        color:var(--text-muted);
                        background:rgba(255,255,255,0.04);
                        padding:8px 12px;border-radius:var(--radius-md)">
              💡 ${pred.conseil}
            </div>` : ''}
        </div>
      </div>`;
  },

  // ────────────────────────────────────────────────────────
  // TENDANCES
  // ────────────────────────────────────────────────────────
  _rendreTendances(container) {
    const tendances = this.analyserTendances();
    const vol       = Tracker.getVolumeParSemaine?.(12) || [];

    if (!tendances) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 16px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">📈</div>
          <div style="font-size:.88rem">Pas encore assez de données</div>
          <div style="font-size:.72rem;margin-top:4px">
            Continue tes séances pour voir tes tendances !
          </div>
        </div>`;
      return;
    }

    container.innerHTML = `

      <!-- Résumé tendances -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.12),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:12px">
          📈 Vue d'ensemble — 90 jours
        </div>
        <div style="font-size:.88rem;color:var(--text-secondary);
                    line-height:1.6;margin-bottom:12px">
          ${tendances.message}
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
          ${[
            {
              emoji:'💪', label:'Séances réalisées',
              val:tendances.totalSeances90j,
              color:'var(--fd-indigo)'
            },
            {
              emoji:'📦', label:'Volume total',
              val:Utils.formatVolume ? Utils.formatVolume(tendances.volumeTotal90j) : `${Math.round(tendances.volumeTotal90j/1000)}T`,
              color:'var(--fd-mint)'
            },
            {
              emoji:'📅', label:'Fréquence moyenne',
              val:`${tendances.freqMoyenne} /sem.`,
              color:'var(--fd-lavender)'
            },
            {
              emoji:'🏆', label:'PRs ce mois',
              val:tendances.prsCeM## 🔮 predict.js — IA Prédictive

```javascript
/* ============================================================
   PowerApp — Predict.js v1.0
   ✅ Prédiction date atteinte objectifs
   ✅ Analyse surmenage prédictif
   ✅ Recommandation charge prochaine séance
   ✅ Graphiques évolution projetée
   ✅ Détection plateau musculaire
   ✅ Score récupération prédictif
   ============================================================ */

'use strict';

const Predict = {

  // ════════════════════════════════════════════════════════
  // RÉGRESSION LINÉAIRE — Moteur central
  // ════════════════════════════════════════════════════════
  _regressionLineaire(points) {
    const n = points.length;
    if (n < 2) return { slope:0, intercept:points?.y || 0, r2:0 };

    const xMoy = points.reduce((a,p) => a + p.x, 0) / n;
    const yMoy = points.reduce((a,p) => a + p.y, 0) / n;

    let num = 0, den = 0, ssTot = 0, ssRes = 0;
    points.forEach(p => {
      num   += (p.x - xMoy) * (p.y - yMoy);
      den   += (p.x - xMoy) ** 2;
    });

    const slope     = den !== 0 ? num / den : 0;
    const intercept = yMoy - slope * xMoy;

    points.forEach(p => {
      const yPred = slope * p.x + intercept;
      ssRes += (p.y - yPred) ** 2;
      ssTot += (p.y - yMoy)  ** 2;
    });

    const r2 = ssTot !== 0 ? Math.max(0, 1 - ssRes/ssTot) : 0;
    return { slope, intercept, r2 };
  },

  _predire(regression, x) {
    return regression.slope * x + regression.intercept;
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION 1RM
  // ════════════════════════════════════════════════════════
  predire1RM(ref, semaines = 12) {
    try {
      const hist = Tracker.getHistoriqueExercice(ref, 200);
      if (hist.length < 3) return null;

      const points = hist
        .filter(h => h.rm1 > 0)
        .sort((a,b) => a.date.localeCompare(b.date))
        .map((h, i) => ({ x:i, y:h.rm1, date:h.date }));

      if (points.length < 3) return null;

      const reg    = this._regressionLineaire(points);
      const actuel = points[points.length-1].y;
      const n      = points.length;

      // Prédictions par palier
      const predictions = [4, 8, 12].map(sem => {
        const steps      = sem * (points.length / 12);
        const valPredite = Math.max(
          actuel,
          Math.round(this._predire(reg, n + steps) / 2.5) * 2.5
        );
        return { semaines:sem, valeur:valPredite };
      });

      // Trouver date atteinte objectif commun
      const objectifs = {
        bench_press:    [60, 80, 100, 120],
        squat:          [80, 100, 120, 140],
        soulevé_terre:  [100, 120, 140, 180],
        dev_militaire:  [40, 60, 80, 100],
        default:        [actuel * 1.1, actuel * 1.2, actuel * 1.3]
      };
      const seuilsObj  = objectifs[ref] || objectifs.default;
      const prochainObj= seuilsObj.find(s => s > actuel);

      let semPourAtteindre = null;
      if (prochainObj && reg.slope > 0) {
        const steps = (prochainObj - reg.intercept) / reg.slope - n;
        semPourAtteindre = steps > 0
          ? Math.round(steps / (points.length / 12))
          : 0;
      }

      const gainMensuel = Math.round(reg.slope * (points.length/12) * 10) / 10;

      return {
        ref,
        nom:            window.EXERCICES?.[ref]?.nom   || ref,
        emoji:          window.EXERCICES?.[ref]?.emoji || '💪',
        actuel,
        predictions,
        gainMensuel,
        prochainObjectif:   prochainObj || null,
        semPourAtteindre,
        tendance:    reg.slope > 0.5 ? 'forte'
                   : reg.slope > 0   ? 'légère'
                   : reg.slope < -0.1 ? 'régression' : 'stagnation',
        fiabilite:   Math.round(reg.r2 * 100),
        points:      points.map(p => ({ date:p.date, rm1:p.y }))
      };
    } catch(e) {
      return null;
    }
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION TOUS LES EXERCICES
  // ════════════════════════════════════════════════════════
  predireTous(limite = 5) {
    const prs = Tracker.getAllPRs();
    return Object.keys(prs)
      .map(ref => this.predire1RM(ref))
      .filter(Boolean)
      .filter(p => p.gainMensuel > 0)
      .sort((a,b) => b.gainMensuel - a.gainMensuel)
      .slice(0, limite);
  },

  // ════════════════════════════════════════════════════════
  // ANALYSE SURMENAGE PRÉDICTIF
  // ════════════════════════════════════════════════════════
  analyserSurmenage() {
    try {
      const seances7j  = Tracker.getHistoriqueSeances(7);
      const seances14j = Tracker.getHistoriqueSeances(14);
      const seances28j = Tracker.getHistoriqueSeances(28);
      const rpe7j      = Tracker.getRPEMoyen7Jours() || 0;
      const streak     = Tracker.getStreak().count;
      const score      = Tracker.calculerScoreForme();

      const moySeances7j  = seances7j.length;
      const moySeances14j = seances14j.length / 2;
      const ratioCharge   = moySeances14j > 0
        ? moySeances7j / moySeances14j : 1;

      // Score de fatigue (0-100)
      let fatigue = 0;

      // RPE élevé = fatigue
      if (rpe7j > 8.5)      fatigue += 35;
      else if (rpe7j > 7.5) fatigue += 20;
      else if (rpe7j > 6.5) fatigue += 10;

      // Trop de séances par rapport à la moyenne
      if (ratioCharge > 1.5)      fatigue += 30;
      else if (ratioCharge > 1.3) fatigue += 15;
      else if (ratioCharge > 1.1) fatigue += 5;

      // Streak très long sans repos
      if (streak > 10)     fatigue += 20;
      else if (streak > 7) fatigue += 10;
      else if (streak > 5) fatigue += 5;

      // Score forme bas
      if (score.score < 40)      fatigue += 15;
      else if (score.score < 60) fatigue += 5;

      fatigue = Math.min(100, fatigue);

      // Risques identifiés
      const risques = [];
      if (fatigue >= 70) risques.push({
        niveau: 'critique',
        emoji:  '🔴',
        msg:    'Risque élevé de surmenage — repos fortement recommandé'
      });
      else if (fatigue >= 50) risques.push({
        niveau: 'modere',
        emoji:  '🟠',
        msg:    'Fatigue accumulée — intègre une semaine de décharge'
      });
      else if (fatigue >= 30) risques.push({
        niveau: 'faible',
        emoji:  '🟡',
        msg:    'Légère fatigue — surveille ton sommeil et ta nutrition'
      });

      if (rpe7j > 8) risques.push({
        niveau: 'modere',
        emoji:  '😤',
        msg:    `RPE moyen élevé (${rpe7j.toFixed(1)}/10) — réduis l'intensité`
      });

      if (ratioCharge > 1.5) risques.push({
        niveau: 'modere',
        emoji:  '📈',
        msg:    `Charge +${Math.round((ratioCharge-1)*100)}% vs ta moyenne — attention`
      });

      // Recommandations
      const recommandations = [];
      if (fatigue >= 70) {
        recommandations.push('🛌 Prends 2-3 jours de repos complet');
        recommandations.push('🥗 Augmente tes calories de 10-15%');
        recommandations.push('😴 Priorise 8-9h de sommeil');
      } else if (fatigue >= 50) {
        recommandations.push('💤 Intègre une semaine de décharge (60% charges)');
        recommandations.push('🧘 Ajoute 1 séance de mobilité / stretching');
        recommandations.push('💧 Augmente ton hydratation');
      } else if (fatigue >= 30) {
        recommandations.push('😴 Assure-toi de dormir 7-8h minimum');
        recommandations.push('🥩 Atteins ton objectif protéines chaque jour');
        recommandations.push('🚶 Une balade légère favorise la récupération');
      } else {
        recommandations.push('✅ Tu récupères bien — continue comme ça !');
        recommandations.push('💪 Tu peux maintenir ou légèrement augmenter l\'intensité');
      }

      return {
        fatigue,
        niveau:          fatigue >= 70 ? 'critique'
                       : fatigue >= 50 ? 'modere'
                       : fatigue >= 30 ? 'faible' : 'ok',
        couleur:         fatigue >= 70 ? 'var(--fd-coral)'
                       : fatigue >= 50 ? '#ffa500'
                       : fatigue >= 30 ? 'var(--fd-lemon)' : 'var(--fd-mint)',
        emoji:           fatigue >= 70 ? '🔴'
                       : fatigue >= 50 ? '🟠'
                       : fatigue >= 30 ? '🟡' : '🟢',
        rpe7j:           Math.round(rpe7j * 10) / 10,
        ratioCharge:     Math.round(ratioCharge * 100) / 100,
        seances7j:       moySeances7j,
        seancesMoy:      Math.round(moySeances14j * 10) / 10,
        risques,
        recommandations,
        scoreRecup:      score.recup || 0
      };
    } catch(e) {
      return {
        fatigue:0, niveau:'ok', couleur:'var(--fd-mint)',
        emoji:'🟢', rpe7j:0, ratioCharge:1,
        seances7j:0, seancesMoy:0, risques:[], recommandations:[],
        scoreRecup:0
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATION CHARGE PROCHAINE SÉANCE
  // ════════════════════════════════════════════════════════
  recommanderCharges(seanceId = null) {
    try {
      const surmenage  = this.analyserSurmenage();
      const profil     = Tracker.getProfil();
      const prs        = Tracker.getAllPRs();
      const objectif   = profil.objectif || 'forme';

      // Coefficient selon fatigue et objectif
      const coeffBase = {
        prise_masse: 0.75,
        force:       0.85,
        seche:       0.70,
        endurance:   0.65,
        forme:       0.72,
        perte_poids: 0.65
      }[objectif] || 0.72;

      const coeffFatigue = surmenage.fatigue >= 70 ? 0.60
                         : surmenage.fatigue >= 50 ? 0.70
                         : surmenage.fatigue >= 30 ? 0.85 : 1.0;

      const exercices = seanceId && window.SEANCES_BASE?.[seanceId]
        ? (window.SEANCES_BASE[seanceId].exercices || [])
        : Object.keys(prs).slice(0, 6);

      const recommandations = exercices.map(exoRef => {
        const ref = typeof exoRef === 'string' ? exoRef : exoRef.ref;
        const pr  = prs[ref];
        const ex  = window.EXERCICES?.[ref];
        if (!pr?.rm1) return null;

        const hist      = Tracker.getHistoriqueExercice(ref, 5);
        const dernPoids = hist?.poids || pr.poids || 0;
        const dernReps  = hist?.reps  || pr.reps  || 0;
        const dernRPE   = hist?.rpe   || 7;

        // Calculer charge recommandée
        let charge = pr.rm1 * coeffBase * coeffFatigue;

        // Ajuster selon RPE dernière séance
        if (dernRPE >= 9.5)      charge *= 0.90;
        else if (dernRPE >= 8.5) charge *= 0.95;
        else if (dernRPE <= 6)   charge *= 1.05;

        // Arrondir à 2.5kg
        charge = Math.round(charge / 2.5) * 2.5;

        // Reps recommandées selon objectif
        const repsReco = {
          prise_masse: '8-10',
          force:       '3-5',
          seche:       '12-15',
          endurance:   '15-20',
          forme:       '10-12',
          perte_poids: '12-15'
        }[objectif] || '8-12';

        const action = charge > dernPoids ? 'augmenter'
                     : charge < dernPoids ? 'reduire' : 'maintenir';

        return {
          ref,
          nom:         ex?.nom   || ref,
          emoji:       ex?.emoji || '💪',
          muscle:      ex?.muscle || '',
          rm1:         pr.rm1,
          dernPoids,
          dernReps,
          dernRPE,
          chargeReco:  charge,
          repsReco,
          action,
          delta:       Math.round(charge - dernPoids),
          raison:      this._raisonRecommandation(
                         action, dernRPE, surmenage.fatigue, objectif
                       )
        };
      }).filter(Boolean);

      return {
        recommandations,
        fatigue:         surmenage.fatigue,
        coeffFatigue,
        objectif,
        message:         this._messageGlobal(surmenage.fatigue, objectif)
      };
    } catch(e) {
      return { recommandations:[], fatigue:0, coeffFatigue:1, objectif:'forme', message:'' };
    }
  },

  _raisonRecommandation(action, rpe, fatigue, objectif) {
    if (fatigue >= 70) return 'Fatigue élevée détectée — charge réduite';
    if (rpe >= 9.5)    return 'RPE très élevé dernière fois — récupération';
    if (rpe <= 6 && action === 'augmenter') return 'RPE bas — progression possible';
    if (action === 'augmenter') return 'Progression régulière — +2.5kg';
    if (action === 'maintenir') return 'Maintien — consolide la technique';
    return 'Optimisation selon ton objectif';
  },

  _messageGlobal(fatigue, objectif) {
    if (fatigue >= 70) return '⚠️ Charge très réduite — récupération prioritaire';
    if (fatigue >= 50) return '📉 Charge modérée — tu reviens en forme';
    if (objectif === 'force') return '💪 Charges lourdes — force maximale';
    if (objectif === 'prise_masse') return '📈 Volume optimal — hypertrophie';
    if (objectif === 'seche') return '🔥 Intensité maintenue — déficit calorique';
    return '⚡ Séance équilibrée — progression régulière';
  },

  // ════════════════════════════════════════════════════════
  // DÉTECTION PLATEAU
  // ════════════════════════════════════════════════════════
  detecterPlateaux() {
    const prs     = Tracker.getAllPRs();
    const plateaux = [];

    Object.keys(prs).forEach(ref => {
      try {
        const hist = Tracker.getHistoriqueExercice(ref, 12);
        if (hist.length < 4) return;

        const rm1s = hist
          .filter(h => h.rm1 > 0)
          .sort((a,b) => a.date.localeCompare(b.date))
          .map(h => h.rm1);

        if (rm1s.length < 4) return;

        const recents    = rm1s.slice(-4);
        const max        = Math.max(...recents);
        const min        = Math.min(...recents);
        const variation  = max > 0 ? ((max - min) / max) * 100 : 0;
        const tendance   = this._regressionLineaire(
          recents.map((y,x) => ({x,y}))
        );

        if (variation < 3 && Math.abs(tendance.slope) < 0.5) {
          const ex = window.EXERCICES?.[ref];
          plateaux.push({
            ref,
            nom:      ex?.nom   || ref,
            emoji:    ex?.emoji || '💪',
            muscle:   ex?.muscle || '',
            rm1Actuel:rm1s[rm1s.length-1],
            duree:    `${hist.length}+ séances`,
            variation:Math.round(variation * 10) / 10,
            solutions:this._solutionsPlateaux(ref)
          });
        }
      } catch(e) {}
    });

    return plateaux;
  },

  _solutionsPlateaux(ref) {
    const solutions = [
      'Changer le tempo (3-1-3)',
      'Intégrer des drop sets',
      'Essayer une nouvelle variation',
      'Augmenter le volume total',
      'Prendre une semaine de décharge',
      'Améliorer la nutrition / protéines',
      'Optimiser le sommeil (7-9h)'
    ];
    // Retourner 3 solutions aléatoires pertinentes
    return solutions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION DATE OBJECTIF
  // ════════════════════════════════════════════════════════
  predireObjectif(objectifPoids = null, objectifRM = null, exoRef = null) {
    const resultats = [];

    // Objectif poids corporel
    if (objectifPoids) {
      try {
        const histPoids = Tracker.getHistoriquePoids(30);
        if (histPoids.length >= 3) {
          const points = histPoids.map((p,i) => ({x:i, y:p.poids}));
          const reg    = this._regressionLineaire(points);
          const actuel = histPoids[histPoids.length-1]?.poids || 0;

          if (Math.abs(reg.slope) > 0.01) {
            const stepsNecessaires = (objectifPoids - reg.intercept) / reg.slope;
            const jours            = Math.max(0,
              Math.round((stepsNecessaires - points.length) / (points.length / 30)) * 30
            );
            const date             = Utils.ajouterJours(Utils.aujourd_hui(), jours);

            resultats.push({
              type:    'poids',
              emoji:   '⚖️',
              label:   `Atteindre ${objectifPoids}kg`,
              actuel:  `${actuel}kg`,
              cible:   `${objectifPoids}kg`,
              jours,
              date,
              faisable:jours < 365 && jours > 0,
              vitesse: Math.round(Math.abs(reg.slope) * 100) / 100
            });
          }
        }
      } catch(e) {}
    }

    // Objectif 1RM
    if (objectifRM && exoRef) {
      try {
        const pred = this.predire1RM(exoRef);
        if (pred && pred.gainMensuel > 0) {
          const actuel       = pred.actuel;
          const gainMensuel  = pred.gainMensuel;
          const moisNecess   = gainMensuel > 0
            ? Math.ceil((objectifRM - actuel) / gainMensuel)
            : null;

          if (moisNecess && moisNecess > 0 && moisNecess < 36) {
            const jours = moisNecess * 30;
            const date  = Utils.ajouterJours(Utils.aujourd_hui(), jours);

            resultats.push({
              type:    '1rm',
              emoji:   pred.emoji,
              label:   `${pred.nom} — ${objectifRM}kg`,
              actuel:  `${actuel}kg`,
              cible:   `${objectifRM}kg`,
              jours,
              date,
              faisable:moisNecess < 24,
              vitesse: gainMensuel
            });
          }
        }
      } catch(e) {}
    }

    return resultats;
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
          { id:'surmenage',    label:'🔋 Récupération' },
          { id:'progression',  label:'📈 Progression'  },
          { id:'charges',      label:'💡 Charges'      },
          { id:'plateaux',     label:'📊 Plateaux'     },
          { id:'objectifs',    label:'🎯 Objectifs'    }
        ].map(t => `
          <button onclick="Predict._changerOnglet('${t.id}')"
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
      <div id="predict-content"></div>`;

    this._rendreOnglet();
  },

  _ongletActif: 'surmenage',

  _changerOnglet(id) {
    this._ongletActif = id;
    const c = document.getElementById('page-predict')
      || document.getElementById('page-coach');
    if (c) this.render(c);
  },

  _rendreOnglet() {
    const c = document.getElementById('predict-content');
    if (!c) return;
    switch(this._ongletActif) {
      case 'surmenage':   this._rendreSurmenage(c);   break;
      case 'progression': this._rendreProgression(c); break;
      case 'charges':     this._rendreCharges(c);     break;
      case 'plateaux':    this._rendreplateaux(c);     break;
      case 'objectifs':   this._rendreObjectifs(c);   break;
    }
  },

  // ════════════════════════════════════════════════════════
  // ONGLET SURMENAGE
  // ════════════════════════════════════════════════════════
  _rendreSurmenage(container) {
    const analyse = this.analyserSurmenage();
    const circ    = 251.2;
    const arc     = circ * (analyse.fatigue / 100);

    container.innerHTML = `

      <!-- Score fatigue visuel -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.1),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;text-align:center">

        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:16px">
          🔋 Score de récupération
        </div>

        <!-- Jauge circulaire -->
        <div style="position:relative;display:inline-block;margin-bottom:12px">
          <svg width="160" height="160" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none"
                    stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
            <circle cx="50" cy="50" r="40" fill="none"
                    stroke="${analyse.couleur}" stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="${circ*(analyse.fatigue/100)} ${circ}"
                    transform="rotate(-90 50 50)"
                    style="transition:stroke-dasharray 1.2s ease"/>
            <text x="50" y="46" text-anchor="middle"
                  fill="${analyse.couleur}" font-size="18" font-weight="900">
              ${analyse.fatigue}
            </text>
            <text x="50" y="58" text-anchor="middle"
                  fill="rgba(255,255,255,0.4)" font-size="7">
              / 100
            </text>
          </svg>
        </div>

        <div style="font-size:1.4rem;margin-bottom:4px">${analyse.emoji}</div>
        <div style="font-size:1rem;font-weight:800;color:${analyse.couleur};
                    margin-bottom:4px">
          ${analyse.fatigue >= 70 ? 'Surmenage critique'
          : analyse.fatigue >= 50 ? 'Fatigue modérée'
          : analyse.fatigue >= 30 ? 'Légère fatigue'
          : 'Récupération optimale'}
        </div>
        <div style="font-size:.72rem;color:var(--text-muted)">
          Score de fatigue : ${analyse.fatigue}/100
        </div>
      </div>

      <!-- Métriques clés -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { label:'RPE moyen 7j', val:`${analyse.rpe7j}/10`,
            color: analyse.rpe7j >= 8 ? 'var(--fd-coral)'
                 : analyse.rpe7j >= 7 ? 'var(--fd-lemon)' : 'var(--fd-mint)' },
          { label:'Séances 7j',   val:analyse.seances7j,
            color: analyse.seances7j > analyse.seancesMoy * 1.3
                 ? 'var(--fd-coral)' : 'var(--fd-mint)' },
          { label:'Ratio charge', val:`×${analyse.ratioCharge}`,
            color: analyse.ratioCharge > 1.3 ? 'var(--fd-coral)'
                 : analyse.ratioCharge > 1.1 ? 'var(--fd-lemon)' : 'var(--fd-mint)' }
        ].map(m => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:12px;text-align:center">
            <div style="font-size:.88rem;font-weight:800;color:${m.color}">
              ${m.val}</div>
            <div style="font-size:.58rem;color:var(--text-muted);margin-top:3px">
              ${m.label}</div>
          </div>`).join('')}
      </div>

      <!-- Risques -->
      ${analyse.risques.length > 0 ? `
        <div style="background:rgba(255,141,150,0.06);
                    border:1px solid rgba(255,141,150,0.15);
                    border-radius:var(--radius-xl);
                    padding:14px;margin-bottom:14px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-coral);margin-bottom:8px">
            ⚠️ Risques détectés
          </div>
          ${analyse.risques.map(r => `
            <div style="display:flex;align-items:flex-start;gap:8px;
                        padding:6px 0;border-bottom:1px solid rgba(255,141,150,0.1)">
              <span style="font-size:.9rem;flex-shrink:0">${r.emoji}</span>
              <div style="font-size:.75rem;color:var(--text-secondary);
                          line-height:1.4">${r.msg}</div>
            </div>`).join('')}
        </div>` : ''}

      <!-- Recommandations -->
      <div style="background:rgba(139,240,187,0.06);
                  border:1px solid rgba(139,240,187,0.15);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-mint);margin-bottom:8px">
          💡 Recommandations IA
        </div>
        ${analyse.recommandations.map(r => `
          <div style="display:flex;align-items:center;gap:8px;
                      padding:7px 0;border-bottom:1px solid rgba(139,240,187,0.08)">
            <div style="width:6px;height:6px;border-radius:50%;
                        background:var(--fd-mint);flex-shrink:0"></div>
            <div style="font-size:.75rem;color:var(--text-secondary);
                        line-height:1.4">${r}</div>
          </div>`).join('')}
      </div>

      <!-- Bouton semaine décharge -->
      ${analyse.fatigue >= 50 ? `
        <button onclick="Predict._planifierDecharge()"
                style="width:100%;padding:14px;
                       background:rgba(191,161,255,0.1);
                       border:1px solid rgba(191,161,255,0.25);
                       border-radius:var(--radius-lg);
                       font-size:.85rem;font-weight:700;
                       color:var(--fd-lavender);cursor:pointer">
          😴 Planifier une semaine de décharge
        </button>` : ''}
    `;
  },

  _planifierDecharge() {
    const actuel = Utils.storage.get('ft_semaines_decharge', 0);
    Utils.storage.set('ft_semaines_decharge', actuel + 1);
    try { Gamification.recompenser('DECHARGE_COMPLETE'); } catch(e) {}
    Utils.toast('😴 Semaine de décharge planifiée ! +50 XP', 'success', 3000);
    Utils.vibrerSuccess();
  },

  // ════════════════════════════════════════════════════════
  // ONGLET PROGRESSION
  // ════════════════════════════════════════════════════════
  _rendreProgression(container) {
    const predictions = this.predireTous(6);

    container.innerHTML = `
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.72rem;color:var(--fd-lavender);line-height:1.5">
          🔮 Prédictions basées sur ta progression réelle.
          Plus tu t'entraînes, plus la précision augmente.
        </div>
      </div>

      ${predictions.length === 0 ? `
        <div style="text-align:center;padding:40px 16px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">📈</div>
          <div style="font-size:.88rem">
            Pas encore assez de données<br>
            <span style="font-size:.72rem">
              Continue tes séances pour voir tes prédictions !
            </span>
          </div>
        </div>` :
        predictions.map(p => `
          <div style="background:rgba(255,255,255,0.03);
                      border:1px solid rgba(255,255,255,0.07);
                      border-radius:var(--radius-xl);
                      padding:16px;margin-bottom:12px">

            <!-- Header -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="font-size:1.5rem;flex-shrink:0">${p.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.88rem;font-weight:800">${p.nom}</div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  Actuel : ${p.actuel}kg · +${p.gainMensuel}kg/mois
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:.65rem;padding:3px 8px;
                            background:${p.tendance === 'forte'
                              ? 'rgba(139,240,187,0.15)'
                              : p.tendance === 'légère'
                                ? 'rgba(249,239,119,0.1)'
                                : 'rgba(255,141,150,0.1)'};
                            border:1px solid ${p.tendance === 'forte'
                              ? 'rgba(139,240,187,0.3)'
                              : p.tendance === 'légère'
                                ? 'rgba(249,239,119,0.25)'
                                : 'rgba(255,141,150,0.2)'};
                            border-radius:99px;font-weight:700;
                            color:${p.tendance === 'forte'
                              ? 'var(--fd-mint)'
                              : p.tendance === 'légère'
                                ? 'var(--fd-lemon)' : 'var(--fd-coral)'}">
                  ${p.tendance === 'forte' ? '🚀 Forte'
                  : p.tendance === 'légère' ? '📈 Légère' : '➡️ Stagnation'}
                </div>
              </div>
            </div>

            <!-- Prédictions 4/8/12 semaines -->
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px">
              ${p.predictions.map(pred => `
                <div style="text-align:center;padding:10px 4px;
                            background:rgba(75,75,249,0.06);
                            border:1px solid rgba(75,75,249,0.15);
                            border-radius:var(--radius-md)">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-lavender)">
                    ~${pred.valeur}kg
                  </div>
                  <div style="font-size:.58rem;color:var(--text-muted);margin-top:2px">
                    dans ${pred.semaines} sem.
                  </div>
                </div>`).join('')}
            </div>

            <!-- Prochain objectif -->
            ${p.prochainObjectif && p.semPourAtteindre !== null ? `
              <div style="padding:8px 12px;
                          background:rgba(249,239,119,0.08);
                          border:1px solid rgba(249,239,119,0.2);
                          border-radius:var(--radius-md);
                          display:flex;align-items:center;
                          justify-content:space-between">
                <div style="font-size:.72rem;color:var(--text-muted)">
                  🎯 Prochain objectif : ${p.prochainObjectif}kg
                </div>
                <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
                  ${p.semPourAtteindre <= 0
                    ? '✅ Déjà atteint !'
                    : `~${p.semPourAtteindre} sem.`}
                </div>
              </div>` : ''}

            <!-- Fiabilité -->
            <div style="margin-top:8px;font-size:.6rem;color:var(--text-muted);
                        text-align:right">
              Fiabilité : ${p.fiabilite}%
              <div style="display:inline-block;width:60px;height:3px;
                          background:rgba(255,255,255,0.06);
                          border-radius:99px;overflow:hidden;
                          vertical-align:middle;margin-left:4px">
                <div style="height:100%;width:${p.fiabilite}%;
                            background:var(--fd-lavender);border-radius:99px">
                </div>
              </div>
            </div>
          </div>`).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // ONGLET CHARGES
  // ════════════════════════════════════════════════════════
  _rendreCharges(container) {
    const reco = this.recommanderCharges();

    container.innerHTML = `

      <!-- Message global -->
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-left:3px solid var(--fd-indigo);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.75rem;font-weight:700;color:var(--fd-indigo);
                    margin-bottom:2px">
          💡 Recommandation séance
        </div>
        <div style="font-size:.72rem;color:var(--text-secondary)">
          ${reco.message}
        </div>
        <div style="margin-top:6px;font-size:.62rem;color:var(--text-muted)">
          Fatigue : ${reco.fatigue}/100 ·
          Coefficient : ×${reco.coeffFatigue} ·
          Objectif : ${reco.objectif}
        </div>
      </div>

      ${reco.recommandations.length === 0 ? `
        <div style="text-align:center;padding:40px 16px;color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">💡</div>
          <div style="font-size:.88rem">
            Lance des séances pour obtenir des recommandations !
          </div>
        </div>` :
        reco.recommandations.map(r => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid ${r.action === 'augmenter'
                        ? 'rgba(139,240,187,0.2)'
                        : r.action === 'reduire'
                          ? 'rgba(255,141,150,0.2)'
                          : 'rgba(255,255,255,0.08)'};
                      border-radius:var(--radius-xl);
                      padding:14px;margin-bottom:10px">

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="font-size:1.3rem;flex-shrink:0">${r.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:800">${r.nom}</div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${r.muscle} · 1RM ~${r.rm1}kg
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:1.1rem;font-weight:900;
                            color:${r.action === 'augmenter'
                              ? 'var(--fd-mint)'
                              : r.action === 'reduire'
                                ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
                  ${r.chargeReco}kg
                </div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  Reco.
                </div>
              </div>
            </div>

            <!-- Comparaison -->
            <div style="display:grid;grid-template-columns:1fr auto 1fr;
                        gap:8px;align-items:center;margin-bottom:8px">
              <div style="text-align:center;padding:6px;
                          background:rgba(255,255,255,0.04);
                          border-radius:var(--radius-md)">
                <div style="font-size:.78rem;font-weight:700">
                  ${r.dernPoids}kg</div>
                <div style="font-size:.55rem;color:var(--text-muted)">
                  Dernière fois</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:.82rem;font-weight:800;
                            color:${r.action === 'augmenter'
                              ? 'var(--fd-mint)'
                              : r.action === 'reduire'
                                ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
                  ${r.action === 'augmenter' ? `↑ +${r.delta}kg`
                  : r.action === 'reduire'   ? `↓ ${r.delta}kg`
                  :                            '→ ='}
                </div>
              </div>
              <div style="text-align:center;padding:6px;
                          background:${r.action === 'augmenter'
                            ? 'rgba(139,240,187,0.1)'
                            : r.action === 'reduire'
                              ? 'rgba(255,141,150,0.1)'
                              : 'rgba(255,255,255,0.04)'};
                          border:1px solid ${r.action === 'augmenter'
                            ? 'rgba(139,240,187,0.25)'
                            : r.action === 'reduire'
                              ? 'rgba(255,141,150,0.2)'
                              : 'rgba(255,255,255,0.08)'};
                          border-radius:var(--radius-md)">
                <div style="font-size:.78rem;font-weight:800;
                            color:${r.action === 'augmenter'
                              ? 'var(--fd-mint)'
                              : r.action === 'reduire'
                                ? 'var(--fd-coral)' : 'var(--fd-lemon)'}">
                  ${r.chargeReco}kg
                </div>
                <div style="font-size:.55rem;color:var(--text-muted)">
                  Recommandé
                </div>
              </div>
            </div>

            <!-- Reps + Raison -->
            <div style="display:flex;justify-content:space-between;
                        align-items:center">
              <div style="font-size:.68rem;color:var(--text-muted)">
                📊 ${r.repsReco} reps · RPE ~7-8
              </div>
              <div style="font-size:.62rem;color:var(--fd-lavender)">
                ${r.raison}
              </div>
            </div>
          </div>`).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // ONGLET PLATEAUX
  // ════════════════════════════════════════════════════════
  _rendreplateaux(container) {
    const plateaux = this.detecterPlateaux();

    container.innerHTML = `
      <div style="background:rgba(75,75,249,0.06);
                  border:1px solid rgba(75,75,249,0.15);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.72rem;color:var(--text-muted);line-height:1.5">
          📊 Un plateau est détecté quand tes performances stagnent
          sur 4+ séances consécutives (variation < 3%).
        </div>
      </div>

      ${plateaux.length === 0 ? `
        <div style="text-align:center;padding:40px 16px;
                    color:var(--text-muted)">
          <div style="font-size:2.5rem;margin-bottom:8px">🚀</div>
          <div style="font-size:.9rem;color:var(--fd-mint);font-weight:700">
            Aucun plateau détecté !
          </div>
          <div style="font-size:.75rem;margin-top:4px">
            Tu progresses sur tous tes exercices 💪
          </div>
        </div>` :
        plateaux.map(p => `
          <div style="background:rgba(255,141,150,0.06);
                      border:1px solid rgba(255,141,150,0.2);
                      border-radius:var(--radius-xl);
                      padding:16px;margin-bottom:12px">

            <!-- Header -->
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="font-size:1.5rem;flex-shrink:0">${p.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.88rem;font-weight:800">${p.nom}</div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  ${p.muscle} · 1RM actuel : ${p.rm1Actuel}kg
                </div>
              </div>
              <div style="padding:4px 10px;
                          background:rgba(255,141,150,0.15);
                          border:1px solid rgba(255,141,150,0.3);
                          border-radius:99px;font-size:.62rem;
                          font-weight:700;color:var(--fd-coral)">
                ➡️ Plateau
              </div>
            </div>

            <!-- Stats plateau -->
            <div style="display:grid;grid-template-columns:1fr 1fr;
                        gap:6px;margin-bottom:12px">
              <div style="padding:8px;background:rgba(255,255,255,0.03);
                          border-radius:var(--radius-md);text-align:center">
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-coral)">
                  ${p.variation}%
                </div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  Variation
                </div>
              </div>
              <div style="padding:8px;background:rgba(255,255,255,0.03);
                          border-radius:var(--radius-md);text-align:center">
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-lemon)">
                  ${p.duree}
                </div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  Durée
                </div>
              </div>
            </div>

            <!-- Solutions -->
            <div>
              <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                          letter-spacing:.08em;color:var(--fd-lavender);
                          margin-bottom:6px">
                💡 Solutions recommandées
              </div>
              ${p.solutions.map(s => `
                <div style="display:flex;align-items:center;gap:8px;
                            padding:6px 0;
                            border-bottom:1px solid rgba(191,161,255,0.08)">
                  <div style="width:5px;height:5px;border-radius:50%;
                              background:var(--fd-lavender);flex-shrink:0"></div>
                  <div style="font-size:.72rem;color:var(--text-secondary)">
                    ${s}
                  </div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
    `;
  },

  // ════════════════════════════════════════════════════════
  // ONGLET OBJECTIFS
  // ════════════════════════════════════════════════════════
  _rendreObjectifs(container) {
    const prs  = Tracker.getAllPRs();
    const refs = Object.keys(prs)
      .filter(r => prs[r].rm1 > 0)
      .sort((a,b) => (prs[b].rm1||0) - (prs[a].rm1||0));

    container.innerHTML = `
      <div style="background:rgba(255,255,255,0.03);
                  border:1px solid rgba(255,255,255,0.07);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">

        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:14px">
          🎯 Simuler l'atteinte d'un objectif 1RM
        </div>

        <div style="margin-bottom:10px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
            Exercice
          </div>
          <select id="pred-exo-ref" class="input">
            <option value="">-- Choisir un exercice --</option>
            ${refs.map(ref => `
              <option value="${ref}">
                ${window.EXERCICES?.[ref]?.emoji || ''} ${window.EXERCICES?.[ref]?.nom || ref}
                (1RM : ${prs[ref].rm1}kg)
              </option>`).join('')}
          </select>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
            Objectif (kg)
          </div>
          <input id="pred-objectif-rm" type="number"
                 class="input" placeholder="ex: 100"
                 min="1" max="500"/>
        </div>

        <button onclick="Predict._calculerObjectif()"
                class="btn-primary" style="width:100%;font-size:.85rem">
          🔮 Calculer
        </button>
      </div>

      <div id="pred-objectif-result"></div>

      <!-- Objectifs proches -->
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);margin-bottom:10px;
                  margin-top:14px">
        🏆 Prochains objectifs suggérés
      </div>
      ${this._renderObjectifsSuggeres(prs)}
    `;
  },

  _calculerObjectif() {
    const ref         = document.getElementById('pred-exo-ref')?.value;
    const objectifRM  = parseFloat(document.getElementById('pred-objectif-rm')?.value);
    const container   = document.getElementById('pred-objectif-result');
    if (!container) return;

    if (!ref || !objectifRM) {
      Utils.toast('Sélectionne un exercice et entre un objectif !', 'error');
      return;
    }

    const resultats = this.predireObjectif(null, objectifRM, ref);
    if (!resultats.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:16px;color:var(--text-muted);
                    font-size:.82rem">
          Pas assez de données pour calculer. Continue tes séances !
        </div>`;
      return;
    }

    const r = resultats;
    container.innerHTML = `
      <div style="background:${r.faisable
          ? 'rgba(139,240,187,0.08)'
          : 'rgba(255,141,150,0.08)'};
                  border:1px solid ${r.faisable
          ? 'rgba(139,240,187,0.25)'
          : 'rgba(255,141,150,0.2)'};
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="text-align:center;margin-bottom:12px">
          <div style="font-size:2.5rem;margin-bottom:6px">${r.emoji}</div>
          <div style="font-size:1rem;font-weight:800">${r.label}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <div style="text-align:center;padding:10px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.9rem;font-weight:700;color:var(--fd-indigo)">
              ${r.actuel}
            </div>
            <div style="font-size:.58rem;color:var(--text-muted)">Actuel</div>
          </div>
          <div style="text-align:center;padding:10px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.9rem;font-weight:700;color:var(--fd-lemon)">
              ${r.cible}
            </div>
            <div style="font-size:.58rem;color:var(--text-muted)">Objectif</div>
          </div>
        </div>
        <div style="text-align:center;padding:12px;
                    background:${r.faisable
                      ? 'rgba(139,240,187,0.08)'
                      : 'rgba(255,141,150,0.06)'};
                    border-radius:var(--radius-md)">
          <div style="font-size:1.2rem;font-weight:900;
                      color:${r.faisable ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
            ~${r.jours} jours
          </div>
          <div style="font-size:.65rem;color:var(--text-muted);margin-top:2px">
            ${r.faisable
              ? `Estimé le ${r.date} 🎯`
              : 'Objectif ambitieux — ajuste ta progression'}
          </div>
        </div>
        ${!r.faisable ? `
          <div style="margin-top:8px;font-size:.68rem;
                      color:var(--text-muted);text-align:center">
            💡 Essaie un objectif intermédiaire d'abord
          </div>` : ''}
      </div>`;
  },

  _renderObjectifsSuggeres(prs) {
    const seuils = {
      bench_press:   [60, 80, 100, 120],
      squat:         [80, 100, 120, 140],
      soulevé_terre: [100, 120, 140, 180],
      dev_militaire: [40, 60, 80, 100]
    };

    let html = '';
    Object.entries(seuils).forEach(([ref, niveaux]) => {
      const pr  = prs[ref];
      if (!pr?.rm1) return;
      const ex  = window.EXERCICES?.[ref];
      const next = niveaux.find(s => s > pr.rm1);
      if (!next) return;

      const delta = next - pr.rm1;
      const pred  = this.predire1RM(ref);
      const sem   = pred?.gainMensuel > 0
        ? Math.ceil(delta / pred.gainMensuel * (52/12))
        : null;

      html += `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:10px 12px;margin-bottom:8px;
                    background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-lg)">
          <span style="font-size:1.2rem;flex-shrink:0">${ex?.emoji || '💪'}</span>
          <div style="flex:1">
            <div style="font-size:.78rem;font-weight:700">${ex?.nom || ref}</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              ${pr.rm1}kg → ${next}kg (${delta > 0 ? '+' : ''}${delta}kg)
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0">
            ${sem ? `
              <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
                ~${sem} sem.
              </div>
              <div style="font-size:.55rem;color:var(--text-muted)">estimé</div>` : `
              <div style="font-size:.65rem;color:var(--text-muted)">
                Pas assez de données
              </div>`}
          </div>
        </div>`;
    });

    return html || `
      <div style="text-align:center;padding:20px;color:var(--text-muted);
                  font-size:.82rem">
        Lance des séances pour voir tes objectifs suggérés !
      </div>`;
  }
};

window.Predict = Predict;
console.log('✅ Predict.js v1.0 — Prédictions IA + Surmenage + Charges + Plateaux + Objectifs');
