/* ============================================================
   PowerApp — Predict.js v1.0
   ✅ Prédiction date atteinte objectifs
   ✅ Analyse surmenage prédictif
   ✅ Recommandation charge prochaine séance
   ✅ Détection plateau musculaire
   ✅ Score récupération prédictif
   ============================================================ */

'use strict';

const Predict = {

  _ongletActif: 'surmenage',

  // ════════════════════════════════════════════════════════
  // RÉGRESSION LINÉAIRE
  // ════════════════════════════════════════════════════════
  _regressionLineaire(points) {
    const n = points.length;
    if (n < 2) return { slope:0, intercept:points[0]?.y || 0, r2:0 };

    const xMoy = points.reduce((a,p) => a + p.x, 0) / n;
    const yMoy = points.reduce((a,p) => a + p.y, 0) / n;

    let num = 0, den = 0, ssTot = 0, ssRes = 0;
    points.forEach(p => {
      num  += (p.x - xMoy) * (p.y - yMoy);
      den  += (p.x - xMoy) ** 2;
    });

    const slope     = den !== 0 ? num / den : 0;
    const intercept = yMoy - slope * xMoy;

    points.forEach(p => {
      const yPred = slope * p.x + intercept;
      ssRes += (p.y - yPred) ** 2;
      ssTot += (p.y - yMoy)  ** 2;
    });

    const r2 = ssTot !== 0 ? Math.max(0, 1 - ssRes / ssTot) : 0;
    return { slope, intercept, r2 };
  },

  _predire(reg, x) {
    return reg.slope * x + reg.intercept;
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
      const actuel = points[points.length - 1].y;
      const n      = points.length;

      const predictions = [4, 8, 12].map(sem => {
        const steps    = sem * (n / 12);
        const valeur   = Math.max(
          actuel,
          Math.round(this._predire(reg, n + steps) / 2.5) * 2.5
        );
        return { semaines:sem, valeur };
      });

      const objectifsRef = {
        bench_press:   [60, 80, 100, 120],
        squat:         [80, 100, 120, 140],
        soulevé_terre: [100, 120, 140, 180],
        dev_militaire: [40, 60, 80, 100]
      };
      const seuils       = objectifsRef[ref]
        || [actuel*1.1, actuel*1.2, actuel*1.3];
      const prochainObj  = seuils.find(s => s > actuel) || null;

      let semPourAtteindre = null;
      if (prochainObj && reg.slope > 0) {
        const steps = (prochainObj - reg.intercept) / reg.slope - n;
        semPourAtteindre = steps > 0
          ? Math.round(steps / (n / 12))
          : 0;
      }

      const gainMensuel = Math.round(reg.slope * (n / 12) * 10) / 10;

      return {
        ref,
        nom:             window.EXERCICES?.[ref]?.nom   || ref,
        emoji:           window.EXERCICES?.[ref]?.emoji || '💪',
        actuel,
        predictions,
        gainMensuel,
        prochainObjectif: prochainObj,
        semPourAtteindre,
        tendance: reg.slope > 0.5 ? 'forte'
                : reg.slope > 0   ? 'légère'
                : reg.slope < -0.1 ? 'régression' : 'stagnation',
        fiabilite: Math.round(reg.r2 * 100),
        points: points.map(p => ({ date:p.date, rm1:p.y }))
      };
    } catch(e) { return null; }
  },

  predireTous(limite = 5) {
    try {
      const prs = Tracker.getAllPRs();
      return Object.keys(prs)
        .map(ref => this.predire1RM(ref))
        .filter(Boolean)
        .filter(p => p.gainMensuel > 0)
        .sort((a,b) => b.gainMensuel - a.gainMensuel)
        .slice(0, limite);
    } catch(e) { return []; }
  },

  // ════════════════════════════════════════════════════════
  // ANALYSE SURMENAGE
  // ════════════════════════════════════════════════════════
  analyserSurmenage() {
    try {
      const seances7j  = Tracker.getHistoriqueSeances(7);
      const seances14j = Tracker.getHistoriqueSeances(14);
      const rpe7j      = Tracker.getRPEMoyen7Jours?.() || 0;
      const streak     = Tracker.getStreak().count;

      let scoreForme = { score:50 };
      try { scoreForme = Tracker.calculerScoreForme(); } catch(e) {}

      const moySeances7j  = seances7j.length;
      const moySeances14j = seances14j.length / 2;
      const ratioCharge   = moySeances14j > 0
        ? moySeances7j / moySeances14j : 1;

      let fatigue = 0;
      if (rpe7j > 8.5)        fatigue += 35;
      else if (rpe7j > 7.5)   fatigue += 20;
      else if (rpe7j > 6.5)   fatigue += 10;

      if (ratioCharge > 1.5)      fatigue += 30;
      else if (ratioCharge > 1.3) fatigue += 15;
      else if (ratioCharge > 1.1) fatigue += 5;

      if (streak > 10)     fatigue += 20;
      else if (streak > 7) fatigue += 10;
      else if (streak > 5) fatigue += 5;

      if (scoreForme.score < 40)      fatigue += 15;
      else if (scoreForme.score < 60) fatigue += 5;

      fatigue = Math.min(100, fatigue);

      const risques = [];
      if (fatigue >= 70) risques.push({
        emoji:'🔴', msg:'Risque élevé de surmenage — repos fortement recommandé'
      });
      else if (fatigue >= 50) risques.push({
        emoji:'🟠', msg:'Fatigue accumulée — intègre une semaine de décharge'
      });
      else if (fatigue >= 30) risques.push({
        emoji:'🟡', msg:'Légère fatigue — surveille ton sommeil et ta nutrition'
      });

      if (rpe7j > 8) risques.push({
        emoji:'😤',
        msg:`RPE moyen élevé (${rpe7j.toFixed(1)}/10) — réduis l'intensité`
      });

      if (ratioCharge > 1.5) risques.push({
        emoji:'📈',
        msg:`Charge +${Math.round((ratioCharge-1)*100)}% vs ta moyenne — attention`
      });

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
        niveau:   fatigue >= 70 ? 'critique'
                : fatigue >= 50 ? 'modere'
                : fatigue >= 30 ? 'faible' : 'ok',
        couleur:  fatigue >= 70 ? 'var(--fd-coral)'
                : fatigue >= 50 ? '#ffa500'
                : fatigue >= 30 ? 'var(--fd-lemon)' : 'var(--fd-mint)',
        emoji:    fatigue >= 70 ? '🔴'
                : fatigue >= 50 ? '🟠'
                : fatigue >= 30 ? '🟡' : '🟢',
        rpe7j:        Math.round(rpe7j * 10) / 10,
        ratioCharge:  Math.round(ratioCharge * 100) / 100,
        seances7j:    moySeances7j,
        seancesMoy:   Math.round(moySeances14j * 10) / 10,
        streak,
        risques,
        recommandations
      };
    } catch(e) {
      return {
        fatigue:0, niveau:'ok', couleur:'var(--fd-mint)',
        emoji:'🟢', rpe7j:0, ratioCharge:1,
        seances7j:0, seancesMoy:0, streak:0,
        risques:[], recommandations:['✅ Données insuffisantes']
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATION CHARGES
  // ════════════════════════════════════════════════════════
  recommanderCharges(seanceId = null) {
    try {
      const surmenage = this.analyserSurmenage();
      const profil    = Tracker.getProfil();
      const prs       = Tracker.getAllPRs();
      const objectif  = profil.objectif || 'forme';

      const coeffBase = {
        prise_masse:0.75, force:0.85, seche:0.70,
        endurance:0.65,   forme:0.72, perte_poids:0.65
      }[objectif] || 0.72;

      const coeffFatigue = surmenage.fatigue >= 70 ? 0.60
                         : surmenage.fatigue >= 50 ? 0.70
                         : surmenage.fatigue >= 30 ? 0.85 : 1.0;

      const exosList = seanceId && window.SEANCES_BASE?.[seanceId]
        ? (window.SEANCES_BASE[seanceId].exercices || [])
        : Object.keys(prs).slice(0, 6);

      const recommandations = exosList.map(exoRef => {
        const ref = typeof exoRef === 'string' ? exoRef : exoRef.ref;
        const pr  = prs[ref];
        const ex  = window.EXERCICES?.[ref];
        if (!pr?.rm1) return null;

        const hist     = Tracker.getHistoriqueExercice(ref, 5);
        const dernPoids = hist[0]?.poids || pr.poids || 0;
        const dernReps  = hist[0]?.reps  || pr.reps  || 0;
        const dernRPE   = hist[0]?.rpe   || 7;

        let charge = pr.rm1 * coeffBase * coeffFatigue;
        if (dernRPE >= 9.5)      charge *= 0.90;
        else if (dernRPE >= 8.5) charge *= 0.95;
        else if (dernRPE <= 6)   charge *= 1.05;
        charge = Math.round(charge / 2.5) * 2.5;

        const repsReco = {
          prise_masse:'8-10', force:'3-5', seche:'12-15',
          endurance:'15-20',  forme:'10-12', perte_poids:'12-15'
        }[objectif] || '8-12';

        const action = charge > dernPoids ? 'augmenter'
                     : charge < dernPoids ? 'reduire' : 'maintenir';

        const raison = surmenage.fatigue >= 70 ? 'Fatigue élevée — charge réduite'
          : dernRPE >= 9.5 ? 'RPE très élevé — récupération'
          : dernRPE <= 6 && action === 'augmenter' ? 'RPE bas — progression possible'
          : action === 'augmenter' ? 'Progression régulière — +2.5kg'
          : action === 'maintenir' ? 'Charge optimale — maintien'
          : 'Optimisation selon objectif';

        return {
          ref, nom:ex?.nom||ref, emoji:ex?.emoji||'💪',
          muscle:ex?.muscle||'', rm1:pr.rm1,
          dernPoids, dernReps, dernRPE,
          chargeReco:charge, repsReco, action,
          delta:Math.round(charge - dernPoids), raison
        };
      }).filter(Boolean);

      const messageGlobal = surmenage.fatigue >= 70
        ? '⚠️ Charge très réduite — récupération prioritaire'
        : surmenage.fatigue >= 50 ? '📉 Charge modérée — tu reviens en forme'
        : objectif === 'force' ? '💪 Charges lourdes — force maximale'
        : objectif === 'prise_masse' ? '📈 Volume optimal — hypertrophie'
        : '⚡ Séance équilibrée — progression régulière';

      return {
        recommandations, objectif, message:messageGlobal,
        fatigue:surmenage.fatigue, coeffFatigue
      };
    } catch(e) {
      return { recommandations:[], fatigue:0, coeffFatigue:1,
               objectif:'forme', message:'' };
    }
  },

  // Compatibilité ancienne API
  recommanderCharge(ref) {
    try {
      const result = this.recommanderCharges();
      return result.recommandations.find(r => r.ref === ref) || null;
    } catch(e) { return null; }
  },

  // ════════════════════════════════════════════════════════
  // DÉTECTION PLATEAUX
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

        const recents   = rm1s.slice(-4);
        const max       = Math.max(...recents);
        const min       = Math.min(...recents);
        const variation = max > 0 ? ((max - min) / max) * 100 : 0;
        const tendance  = this._regressionLineaire(
          recents.map((y,x) => ({x,y}))
        );

        if (variation < 3 && Math.abs(tendance.slope) < 0.5) {
          const ex       = window.EXERCICES?.[ref];
          const solutions = [
            'Changer le tempo (3-1-3)',
            'Intégrer des drop sets',
            'Essayer une nouvelle variation',
            'Augmenter le volume total',
            'Prendre une semaine de décharge',
            'Améliorer la nutrition / protéines',
            'Optimiser le sommeil (7-9h)'
          ].sort(() => Math.random() - 0.5).slice(0, 3);

          plateaux.push({
            ref,
            nom:       ex?.nom   || ref,
            emoji:     ex?.emoji || '💪',
            muscle:    ex?.muscle || '',
            rm1Actuel: rm1s[rm1s.length - 1],
            duree:     `${hist.length}+ séances`,
            variation: Math.round(variation * 10) / 10,
            solutions
          });
        }
      } catch(e) {}
    });

    return plateaux;
  },

  // Compatibilité ancienne API
  detecterPlateau(ref) {
    return this.detecterPlateaux().find(p => p.ref === ref) || null;
  },

  detecterTousPlateaux() {
    return this.detecterPlateaux();
  },

  // ════════════════════════════════════════════════════════
  // PRÉDICTION OBJECTIF
  // ════════════════════════════════════════════════════════
  predireObjectif(objectifPoids = null, objectifRM = null, exoRef = null) {
    const resultats = [];

    if (objectifRM && exoRef) {
      try {
        const pred = this.predire1RM(exoRef);
        if (pred && pred.gainMensuel > 0) {
          const actuel      = pred.actuel;
          const gainMensuel = pred.gainMensuel;
          const moisNecess  = Math.ceil((objectifRM - actuel) / gainMensuel);

          if (moisNecess > 0 && moisNecess < 36) {
            const jours = moisNecess * 30;
            resultats.push({
              type:'1rm', emoji:pred.emoji,
              label:`${pred.nom} — ${objectifRM}kg`,
              actuel:`${actuel}kg`, cible:`${objectifRM}kg`,
              jours, date:Utils.ajouterJours(Utils.aujourd_hui(), jours),
              faisable:moisNecess < 24, vitesse:gainMensuel
            });
          }
        }
      } catch(e) {}
    }

    return resultats;
  },

  // ════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;gap:5px;overflow-x:auto;
                  scrollbar-width:none;margin-bottom:14px">
        ${[
          { id:'surmenage',   label:'🔋 Récupération' },
          { id:'progression', label:'📈 Progression'  },
          { id:'charges',     label:'💡 Charges'      },
          { id:'plateaux',    label:'📊 Plateaux'     },
          { id:'objectifs',   label:'🎯 Objectifs'    }
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
      case 'plateaux':    this._rendrePlateaux(c);    break;
      case 'objectifs':   this._rendreObjectifs(c);   break;
    }
  },

  // ─── SURMENAGE ──────────────────────────────────────────
  _rendreSurmenage(container) {
    const analyse = this.analyserSurmenage();
    const circ    = 251.2;

    container.innerHTML = `
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.1),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;text-align:center">

        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:16px">
          🔋 Score de récupération
        </div>

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
                  fill="rgba(255,255,255,0.4)" font-size="7">/ 100</text>
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

      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${[
          { label:'RPE 7j',      val:`${analyse.rpe7j}/10`,
            color:analyse.rpe7j>=8?'var(--fd-coral)':analyse.rpe7j>=7?'var(--fd-lemon)':'var(--fd-mint)' },
          { label:'Séances 7j',  val:analyse.seances7j,
            color:analyse.seances7j>analyse.seancesMoy*1.3?'var(--fd-coral)':'var(--fd-mint)' },
          { label:'Ratio charge',val:`×${analyse.ratioCharge}`,
            color:analyse.ratioCharge>1.3?'var(--fd-coral)':analyse.ratioCharge>1.1?'var(--fd-lemon)':'var(--fd-mint)' }
        ].map(m => `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:12px;text-align:center">
            <div style="font-size:.88rem;font-weight:800;color:${m.color}">${m.val}</div>
            <div style="font-size:.58rem;color:var(--text-muted);margin-top:3px">${m.label}</div>
          </div>`).join('')}
      </div>

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
            <div style="display:flex;gap:8px;padding:6px 0;
                        border-bottom:1px solid rgba(255,141,150,0.1)">
              <span style="flex-shrink:0">${r.emoji}</span>
              <div style="font-size:.75rem;color:var(--text-secondary)">${r.msg}</div>
            </div>`).join('')}
        </div>` : ''}

      <div style="background:rgba(139,240,187,0.06);
                  border:1px solid rgba(139,240,187,0.15);
                  border-radius:var(--radius-xl);
                  padding:14px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-mint);margin-bottom:8px">
          💡 Recommandations IA
        </div>
        ${analyse.recommandations.map(r => `
          <div style="display:flex;gap:8px;padding:7px 0;
                      border-bottom:1px solid rgba(139,240,187,0.08)">
            <div style="width:6px;height:6px;border-radius:50%;
                        background:var(--fd-mint);flex-shrink:0;
                        margin-top:6px"></div>
            <div style="font-size:.75rem;color:var(--text-secondary)">${r}</div>
          </div>`).join('')}
      </div>

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
    Utils.toast('😴 Semaine de décharge planifiée !', 'success', 3000);
    Utils.vibrerSuccess();
  },

  // ─── PROGRESSION ────────────────────────────────────────
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
          <div style="font-size:.88rem">Pas encore assez de données</div>
          <div style="font-size:.72rem;margin-top:4px">
            Continue tes séances pour voir tes prédictions !
          </div>
        </div>` :
        predictions.map(p => `
          <div style="background:rgba(255,255,255,0.03);
                      border:1px solid rgba(255,255,255,0.07);
                      border-radius:var(--radius-xl);
                      padding:16px;margin-bottom:12px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="font-size:1.5rem">${p.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.88rem;font-weight:800">${p.nom}</div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  Actuel : ${p.actuel}kg · +${p.gainMensuel}kg/mois
                </div>
              </div>
              <span style="font-size:.65rem;padding:3px 8px;
                           background:${p.tendance==='forte'
                             ?'rgba(139,240,187,0.15)'
                             :p.tendance==='légère'
                               ?'rgba(249,239,119,0.1)':'rgba(255,141,150,0.1)'};
                           border-radius:99px;font-weight:700;
                           color:${p.tendance==='forte'?'var(--fd-mint)'
                             :p.tendance==='légère'?'var(--fd-lemon)':'var(--fd-coral)'}">
                ${p.tendance==='forte'?'🚀 Forte'
                  :p.tendance==='légère'?'📈 Légère':'➡️ Stagnation'}
              </span>
            </div>

            <div style="display:grid;grid-template-columns:repeat(3,1fr);
                        gap:8px;margin-bottom:12px">
              ${p.predictions.map(pred => `
                <div style="text-align:center;padding:10px 4px;
                            background:rgba(75,75,249,0.06);
                            border:1px solid rgba(75,75,249,0.15);
                            border-radius:var(--radius-md)">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-lavender)">~${pred.valeur}kg</div>
                  <div style="font-size:.58rem;color:var(--text-muted);margin-top:2px">
                    dans ${pred.semaines} sem.
                  </div>
                </div>`).join('')}
            </div>

            ${p.prochainObjectif && p.semPourAtteindre !== null ? `
              <div style="padding:8px 12px;
                          background:rgba(249,239,119,0.08);
                          border:1px solid rgba(249,239,119,0.2);
                          border-radius:var(--radius-md);
                          display:flex;align-items:center;
                          justify-content:space-between">
                <div style="font-size:.72rem;color:var(--text-muted)">
                  🎯 Prochain : ${p.prochainObjectif}kg
                </div>
                <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
                  ${p.semPourAtteindre<=0?'✅ Atteint !':
                    `~${p.semPourAtteindre} sem.`}
                </div>
              </div>` : ''}

            <div style="margin-top:8px;font-size:.6rem;
                        color:var(--text-muted);text-align:right">
              Fiabilité : ${p.fiabilite}%
            </div>
          </div>`).join('')}
    `;
  },

  // ─── CHARGES ────────────────────────────────────────────
  _rendreCharges(container) {
    const reco = this.recommanderCharges();

    container.innerHTML = `
      <div style="background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.2);
                  border-left:3px solid var(--fd-indigo);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.75rem;font-weight:700;
                    color:var(--fd-indigo);margin-bottom:2px">
          💡 Recommandation séance
        </div>
        <div style="font-size:.72rem;color:var(--text-secondary)">
          ${reco.message}
        </div>
        <div style="margin-top:6px;font-size:.62rem;color:var(--text-muted)">
          Fatigue : ${reco.fatigue}/100 · Coeff : ×${reco.coeffFatigue}
          · Objectif : ${reco.objectif}
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
                      border:1px solid ${r.action==='augmenter'
                        ?'rgba(139,240,187,0.2)'
                        :r.action==='reduire'
                          ?'rgba(255,141,150,0.2)':'rgba(255,255,255,0.08)'};
                      border-radius:var(--radius-xl);
                      padding:14px;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
              <span style="font-size:1.3rem">${r.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:800">${r.nom}</div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${r.muscle} · 1RM ~${r.rm1}kg
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:1.1rem;font-weight:900;
                            color:${r.action==='augmenter'?'var(--fd-mint)'
                              :r.action==='reduire'?'var(--fd-coral)':'var(--fd-lemon)'}">
                  ${r.chargeReco}kg
                </div>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr auto 1fr;
                        gap:8px;align-items:center;margin-bottom:8px">
              <div style="text-align:center;padding:6px;
                          background:rgba(255,255,255,0.04);
                          border-radius:var(--radius-md)">
                <div style="font-size:.78rem;font-weight:700">${r.dernPoids}kg</div>
                <div style="font-size:.55rem;color:var(--text-muted)">Dernière fois</div>
              </div>
              <div style="text-align:center;font-size:.82rem;font-weight:800;
                          color:${r.action==='augmenter'?'var(--fd-mint)'
                            :r.action==='reduire'?'var(--fd-coral)':'var(--fd-lemon)'}">
                ${r.action==='augmenter'?`↑ +${r.delta}kg`
                  :r.action==='reduire'?`↓ ${r.delta}kg`:'→ ='}
              </div>
              <div style="text-align:center;padding:6px;
                          background:${r.action==='augmenter'
                            ?'rgba(139,240,187,0.1)'
                            :r.action==='reduire'
                              ?'rgba(255,141,150,0.1)':'rgba(255,255,255,0.04)'};
                          border-radius:var(--radius-md)">
                <div style="font-size:.78rem;font-weight:800;
                            color:${r.action==='augmenter'?'var(--fd-mint)'
                              :r.action==='reduire'?'var(--fd-coral)':'var(--fd-lemon)'}">
                  ${r.chargeReco}kg
                </div>
                <div style="font-size:.55rem;color:var(--text-muted)">Recommandé</div>
              </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center">
              <div style="font-size:.68rem;color:var(--text-muted)">
                📊 ${r.repsReco} reps · RPE ~7-8
              </div>
              <div style="font-size:.62rem;color:var(--fd-lavender)">${r.raison}</div>
            </div>
          </div>`).join('')}
    `;
  },

  // ─── PLATEAUX ───────────────────────────────────────────
  _rendrePlateaux(container) {
    const plateaux = this.detecterPlateaux();

    container.innerHTML = `
      <div style="background:rgba(75,75,249,0.06);
                  border:1px solid rgba(75,75,249,0.15);
                  border-radius:var(--radius-lg);
                  padding:12px 14px;margin-bottom:14px">
        <div style="font-size:.72rem;color:var(--text-muted);line-height:1.5">
          📊 Un plateau est détecté quand tes performances stagnent
          sur 4+ séances consécutives (variation &lt; 3%).
        </div>
      </div>

      ${plateaux.length === 0 ? `
        <div style="text-align:center;padding:40px 16px;color:var(--text-muted)">
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
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
              <span style="font-size:1.5rem">${p.emoji}</span>
              <div style="flex:1">
                <div style="font-size:.88rem;font-weight:800">${p.nom}</div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  ${p.muscle} · 1RM : ${p.rm1Actuel}kg
                </div>
              </div>
              <span style="padding:4px 10px;
                           background:rgba(255,141,150,0.15);
                           border:1px solid rgba(255,141,150,0.3);
                           border-radius:99px;font-size:.62rem;
                           font-weight:700;color:var(--fd-coral)">
                ➡️ Plateau
              </span>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;
                        gap:6px;margin-bottom:12px">
              <div style="padding:8px;background:rgba(255,255,255,0.03);
                          border-radius:var(--radius-md);text-align:center">
                <div style="font-size:.82rem;font-weight:700;color:var(--fd-coral)">
                  ${p.variation}%</div>
                <div style="font-size:.58rem;color:var(--text-muted)">Variation</div>
              </div>
              <div style="padding:8px;background:rgba(255,255,255,0.03);
                          border-radius:var(--radius-md);text-align:center">
                <div style="font-size:.82rem;font-weight:700;color:var(--fd-lemon)">
                  ${p.duree}</div>
                <div style="font-size:.58rem;color:var(--text-muted)">Durée</div>
              </div>
            </div>

            <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                        letter-spacing:.08em;color:var(--fd-lavender);margin-bottom:6px">
              💡 Solutions recommandées
            </div>
            ${p.solutions.map(s => `
              <div style="display:flex;gap:8px;padding:6px 0;
                          border-bottom:1px solid rgba(191,161,255,0.08)">
                <div style="width:5px;height:5px;border-radius:50%;
                            background:var(--fd-lavender);flex-shrink:0;
                            margin-top:6px"></div>
                <div style="font-size:.72rem;color:var(--text-secondary)">${s}</div>
              </div>`).join('')}
          </div>`).join('')}
    `;
  },

  // ─── OBJECTIFS ──────────────────────────────────────────
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
                ${window.EXERCICES?.[ref]?.emoji||''} ${window.EXERCICES?.[ref]?.nom||ref}
                (1RM : ${prs[ref].rm1}kg)
              </option>`).join('')}
          </select>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:.65rem;color:var(--text-muted);margin-bottom:5px">
            Objectif (kg)
          </div>
          <input id="pred-objectif-rm" type="number"
                 class="input" placeholder="ex: 100" min="1" max="500"/>
        </div>
        <button onclick="Predict._calculerObjectif()"
                class="btn-primary" style="width:100%;font-size:.85rem">
          🔮 Calculer
        </button>
      </div>

      <div id="pred-objectif-result"></div>

      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);
                  margin-bottom:10px;margin-top:14px">
        🏆 Prochains objectifs suggérés
      </div>
      ${this._renderObjectifsSuggeres(prs)}
    `;
  },

  _calculerObjectif() {
    const ref       = document.getElementById('pred-exo-ref')?.value;
    const objectif  = parseFloat(document.getElementById('pred-objectif-rm')?.value);
    const container = document.getElementById('pred-objectif-result');
    if (!container) return;

    if (!ref || !objectif) {
      Utils.toast('Sélectionne un exercice et entre un objectif !', 'error');
      return;
    }

    const resultats = this.predireObjectif(null, objectif, ref);
    if (!resultats.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:16px;color:var(--text-muted);
                    font-size:.82rem">
          Pas assez de données. Continue tes séances !
        </div>`;
      return;
    }

    const r = resultats[0];
    container.innerHTML = `
      <div style="background:${r.faisable
          ?'rgba(139,240,187,0.08)':'rgba(255,141,150,0.08)'};
                  border:1px solid ${r.faisable
          ?'rgba(139,240,187,0.25)':'rgba(255,141,150,0.2)'};
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="text-align:center;margin-bottom:12px">
          <div style="font-size:2.5rem;margin-bottom:6px">${r.emoji}</div>
          <div style="font-size:1rem;font-weight:800">${r.label}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:10px">
          <div style="text-align:center;padding:10px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.9rem;font-weight:700;color:var(--fd-indigo)">
              ${r.actuel}</div>
            <div style="font-size:.58rem;color:var(--text-muted)">Actuel</div>
          </div>
          <div style="text-align:center;padding:10px;
                      background:rgba(255,255,255,0.04);
                      border-radius:var(--radius-md)">
            <div style="font-size:.9rem;font-weight:700;color:var(--fd-lemon)">
              ${r.cible}</div>
            <div style="font-size:.58rem;color:var(--text-muted)">Objectif</div>
          </div>
        </div>
        <div style="text-align:center;padding:12px;
                    background:${r.faisable
                      ?'rgba(139,240,187,0.08)':'rgba(255,141,150,0.06)'};
                    border-radius:var(--radius-md)">
          <div style="font-size:1.2rem;font-weight:900;
                      color:${r.faisable?'var(--fd-mint)':'var(--fd-coral)'}">
            ~${r.jours} jours
          </div>
          <div style="font-size:.65rem;color:var(--text-muted);margin-top:2px">
            ${r.faisable?`Estimé le ${r.date} 🎯`
              :'Objectif ambitieux — ajuste ta progression'}
          </div>
        </div>
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
      const pr = prs[ref];
      if (!pr?.rm1) return;
      const ex   = window.EXERCICES?.[ref];
      const next = niveaux.find(s => s > pr.rm1);
      if (!next) return;
      const delta = next - pr.rm1;
      const pred  = this.predire1RM(ref);
      const sem   = pred?.gainMensuel > 0
        ? Math.ceil(delta / pred.gainMensuel * (52/12)) : null;

      html += `
        <div style="display:flex;align-items:center;gap:10px;
                    padding:10px 12px;margin-bottom:8px;
                    background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-lg)">
          <span style="font-size:1.2rem">${ex?.emoji||'💪'}</span>
          <div style="flex:1">
            <div style="font-size:.78rem;font-weight:700">${ex?.nom||ref}</div>
            <div style="font-size:.62rem;color:var(--text-muted)">
              ${pr.rm1}kg → ${next}kg (+${delta}kg)
            </div>
          </div>
          <div style="text-align:right">
            ${sem ? `
              <div style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
                ~${sem} sem.</div>
              <div style="font-size:.55rem;color:var(--text-muted)">estimé</div>` : `
              <div style="font-size:.65rem;color:var(--text-muted)">
                Pas assez de données</div>`}
          </div>
        </div>`;
    });

    return html || `
      <div style="text-align:center;padding:20px;color:var(--text-muted);
                  font-size:.82rem">
        Lance des séances pour voir tes objectifs !
      </div>`;
  }
};

window.Predict = Predict;
console.log('✅ Predict.js v1.0 chargé — Surmenage + Progression + Charges + Plateaux + Objectifs');
