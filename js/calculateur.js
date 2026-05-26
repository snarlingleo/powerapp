/* ============================================================
   PowerApp — Calculateur.js v2.0
   Calcul 1RM + recommandations + pourcentages
   + Genre-aware + Page complète + getSuggestionCharge()
   ============================================================ */

'use strict';

const Calculateur = {

  // ════════════════════════════════════════════════════════
  // FORMULES 1RM
  // ════════════════════════════════════════════════════════

  calculer1RM(poids, reps) {
    if (!poids || !reps || reps < 1) return 0;
    if (reps === 1) return poids;

    // Epley (la plus connue)
    const epley    = poids * (1 + reps / 30);

    // Brzycki (précise jusqu'à 10 reps)
    const brzycki  = reps < 37
      ? poids * (36 / (37 - reps))
      : poids * 2; // Sécurité si reps >= 37

    // Lombardi
    const lombardi = poids * Math.pow(reps, 0.10);

    // ✅ NOUVEAU v2.0 — O'Conner (précise hautes reps)
    const oconner  = poids * (1 + 0.025 * reps);

    // Moyenne pondérée
    const moyenne  =
      epley    * 0.40
      + brzycki  * 0.30
      + lombardi * 0.15
      + oconner  * 0.15;

    // Arrondi au 0.5kg
    return Math.round(moyenne * 2) / 2;
  },

  // ════════════════════════════════════════════════════════
  // RECOMMANDATIONS — ✅ v2.0 genre-aware
  // ════════════════════════════════════════════════════════
  getRecommandations(un_rm, genre = null) {
    if (!un_rm || un_rm <= 0) return [];

    // ✅ NOUVEAU v2.0 — Détecter genre si non fourni
    if (!genre) {
      try {
        genre = Utils.storage.get(
          'ft_profil_onboarding', {}
        ).genre || 'homme';
      } catch(e) {
        genre = 'homme';
      }
    }

    const arrondir = (val) => Math.round(val / 2.5) * 2.5;

    const recs = [
      {
        objectif:   'Force',
        emoji:      '🏋️',
        color:      'var(--fd-coral)',
        pct_min:    85,
        pct_max:    95,
        reps:       genre === 'femme' ? '3-6' : '1-5',
        series:     '4-6',
        charge_min: arrondir(un_rm * 0.85),
        charge_max: arrondir(un_rm * 0.95),
        conseil:    'Récupération 3-5 min entre séries',
        // ✅ NOUVEAU v2.0 — Volume hebdo recommandé
        volHebdo:   genre === 'femme'
          ? '9-12 séries/sem'
          : '10-15 séries/sem'
      },
      {
        objectif:   'Hypertrophie',
        emoji:      '💪',
        color:      'var(--fd-indigo)',
        pct_min:    65,
        pct_max:    80,
        reps:       genre === 'femme' ? '10-15' : '6-12',
        series:     genre === 'femme' ? '4-5' : '3-4',
        charge_min: arrondir(un_rm * 0.65),
        charge_max: arrondir(un_rm * 0.80),
        conseil:    genre === 'femme'
          ? 'Récupération 60-75 sec. Focus contraction'
          : 'Récupération 60-90 sec entre séries',
        volHebdo: genre === 'femme'
          ? '14-20 séries/sem'
          : '12-18 séries/sem'
      },
      {
        objectif:   'Endurance musculaire',
        emoji:      '🔥',
        color:      'var(--fd-mint)',
        pct_min:    50,
        pct_max:    65,
        reps:       genre === 'femme' ? '15-25' : '12-20',
        series:     '2-3',
        charge_min: arrondir(un_rm * 0.50),
        charge_max: arrondir(un_rm * 0.65),
        conseil:    'Récupération 30-45 sec entre séries',
        volHebdo:   '10-15 séries/sem'
      }
    ];

    // ✅ NOUVEAU v2.0 — Objectif Lower Body pour femme
    if (genre === 'femme') {
      recs.push({
        objectif:   'Fessiers / Lower',
        emoji:      '🍑',
        color:      'var(--fd-coral)',
        pct_min:    60,
        pct_max:    75,
        reps:       '12-20',
        series:     '4-5',
        charge_min: arrondir(un_rm * 0.60),
        charge_max: arrondir(un_rm * 0.75),
        conseil:    'Contraction maximale en haut. Tempo 2-0-2-1',
        volHebdo:   '16-22 séries/sem'
      });
    }

    return recs;
  },

  chargeParPourcentage(un_rm, pourcentage) {
    const charge = un_rm * (pourcentage / 100);
    return Math.round(charge / 2.5) * 2.5;
  },

  repsEstimees(un_rm, charge) {
    if (!un_rm || !charge || charge > un_rm) return 0;
    const pct  = charge / un_rm;
    const reps = Math.round(30 * (1 / pct - 1));
    return Math.max(1, Math.min(30, reps));
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — getSuggestionCharge(ref)
  // Appelée par Tracker.getSuggestionCharge() / History.js
  // ════════════════════════════════════════════════════════
  getSuggestionCharge(exerciceRef) {
    try {
      const pr   = Tracker.getPR(exerciceRef);
      const hist = Tracker.getHistoriqueExercice(exerciceRef, 5);

      if (!hist.length) return null;

      const derniere = hist.sort(
        (a,b) => (b.date||'').localeCompare(a.date||'')
      )[0];

      if (!derniere?.poids) return null;

      let phase = { nom:'Construction', intensite:0.75 };
      try { phase = Programme.getPhaseActuelle(); } catch(e) {}

      // ✅ Déterminer si progression est possible
      const rm1Actuel   = pr?.rm1 || this.calculer1RM(
        derniere.poids, derniere.reps
      );
      const chargeIdeal = Math.round(
        rm1Actuel * phase.intensite / 2.5
      ) * 2.5;

      // ✅ Comparaison avec dernière séance
      const deltaCHarge = chargeIdeal - derniere.poids;
      const action      = deltaCHarge > 0
        ? 'augmenter' : deltaCHarge < 0 ? 'reduire' : 'maintenir';

      return {
        ref:           exerciceRef,
        poids:         chargeIdeal,
        dernierePoids: derniere.poids,
        derniereReps:  derniere.reps,
        delta:         Utils.arrondir(deltaCHarge),
        action,
        rm1:           rm1Actuel,
        phase:         phase.nom,
        raison:        action === 'augmenter'
          ? `Phase ${phase.nom} → +${Math.abs(deltaCHarge)}kg vs dernière`
          : action === 'reduire'
            ? `Récupération → -${Math.abs(deltaCHarge)}kg conseillé`
            : `Charge maintenue (phase ${phase.nom})`
      };
    } catch(e) {
      return null;
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER INLINE (sous exercice)
  // ════════════════════════════════════════════════════════
  renderCalculateur(exoRef, exoIdx) {
    const containerId = `calc-${exoIdx}`;
    const existing    = document.getElementById(containerId);

    if (existing) {
      existing.remove();
      return;
    }

    const panel = document.createElement('div');
    panel.id    = containerId;
    panel.style.cssText = `
      margin-top:     8px;
      padding:        var(--space-md);
      background:     rgba(75,75,249,0.08);
      border:         1px solid rgba(75,75,249,0.25);
      border-radius:  var(--radius-md);
      animation:      fadeIn .2s ease;
    `;

    // ✅ NOUVEAU v2.0 — Pré-remplir avec dernière perf
    let dernierPoids = '', derniereReps = '';
    try {
      const derniere = Tracker.getDernierePerf(null, exoRef);
      if (derniere?.poids) dernierPoids = derniere.poids;
      if (derniere?.reps)  derniereReps = derniere.reps;
    } catch(e) {}

    panel.innerHTML = `
      <div style="font-size:.72rem;font-weight:700;
                  color:var(--fd-indigo);
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  margin-bottom:var(--space-sm)">
        🧮 Calculateur 1RM
      </div>

      <div style="display:grid;
                  grid-template-columns:1fr 1fr auto;
                  gap:var(--space-xs);
                  margin-bottom:var(--space-sm)">
        <div>
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:3px">Poids (kg)</div>
          <input type="number"
                 id="calc-poids-${exoIdx}"
                 class="input"
                 placeholder="ex: 80"
                 value="${dernierPoids}"
                 step="2.5"
                 style="padding:8px;font-size:.85rem;
                        text-align:center"/>
        </div>
        <div>
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:3px">Répétitions</div>
          <input type="number"
                 id="calc-reps-${exoIdx}"
                 class="input"
                 placeholder="ex: 8"
                 value="${derniereReps}"
                 min="1" max="30"
                 style="padding:8px;font-size:.85rem;
                        text-align:center"/>
        </div>
        <div style="display:flex;align-items:flex-end">
          <button onclick="Calculateur._calculerEtAfficher(${exoIdx})"
                  class="btn-primary"
                  style="padding:8px 12px;font-size:.82rem;
                         white-space:nowrap">
            Calculer →
          </button>
        </div>
      </div>

      <div id="calc-resultat-${exoIdx}"></div>
    `;

    const carte = document.getElementById(`live-exo-${exoIdx}`);
    if (carte) {
      carte.appendChild(panel);
    }

    // ✅ Auto-calculer si pré-rempli
    if (dernierPoids && derniereReps) {
      setTimeout(() => {
        this._calculerEtAfficher(exoIdx);
      }, 150);
    } else {
      setTimeout(() => {
        document.getElementById(`calc-poids-${exoIdx}`)?.focus();
      }, 100);
    }
  },

  _calculerEtAfficher(exoIdx) {
    const poids = parseFloat(
      document.getElementById(`calc-poids-${exoIdx}`)?.value
    );
    const reps  = parseInt(
      document.getElementById(`calc-reps-${exoIdx}`)?.value
    );

    if (!poids || !reps) {
      const el = document.getElementById(`calc-resultat-${exoIdx}`);
      if (el) el.innerHTML = `
        <div style="font-size:.75rem;color:var(--fd-coral);
                    text-align:center;padding:var(--space-sm)">
          ⚠️ Entre le poids et les répétitions
        </div>`;
      return;
    }

    const un_rm        = this.calculer1RM(poids, reps);
    const recommandations = this.getRecommandations(un_rm);

    const el = document.getElementById(`calc-resultat-${exoIdx}`);
    if (!el) return;

    el.innerHTML = `

      <!-- 1RM estimé -->
      <div style="text-align:center;
                  padding:var(--space-md);
                  background:rgba(75,75,249,0.12);
                  border-radius:var(--radius-sm);
                  margin-bottom:var(--space-sm)">
        <div style="font-size:.65rem;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.08em">
          1RM estimé
        </div>
        <div style="font-size:2rem;font-weight:800;
                    color:var(--fd-indigo);
                    line-height:1.1;margin-top:2px">
          ${un_rm} kg
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:2px">
          Basé sur ${poids}kg × ${reps} reps
        </div>
      </div>

      <!-- Recommandations -->
      <div style="font-size:.68rem;font-weight:700;
                  color:var(--text-muted);
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  margin-bottom:var(--space-xs)">
        Charges recommandées
      </div>

      ${recommandations.map(r => `
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    padding:var(--space-sm);
                    background:var(--bg-input);
                    border-radius:var(--radius-sm);
                    margin-bottom:4px;
                    border-left:3px solid ${r.color}">
          <div>
            <div style="font-size:.78rem;font-weight:700">
              ${r.emoji} ${r.objectif}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              ${r.reps} reps · ${r.series} séries
              · ${r.pct_min}-${r.pct_max}%
            </div>
            <div style="font-size:.62rem;color:var(--text-muted);
                        margin-top:1px;font-style:italic">
              ${r.conseil}
            </div>
            ${r.volHebdo ? `
              <div style="font-size:.6rem;
                          color:${r.color};margin-top:2px">
                📊 ${r.volHebdo}
              </div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0;
                      margin-left:var(--space-sm)">
            <div style="font-size:.9rem;font-weight:800;
                        color:${r.color}">
              ${r.charge_min}–${r.charge_max}kg
            </div>
            <button onclick="Calculateur._appliquerCharge(
                      ${exoIdx}, ${r.charge_max})"
                    style="margin-top:4px;
                           padding:3px 8px;
                           font-size:.62rem;
                           font-weight:700;
                           background:${r.color};
                           color:var(--fd-midnight);
                           border:none;
                           border-radius:var(--radius-full);
                           cursor:pointer">
              Utiliser
            </button>
          </div>
        </div>`).join('')}

      <!-- ✅ NOUVEAU v2.0 — Reps à une charge donnée -->
      <div style="margin-top:var(--space-sm);padding:var(--space-sm);
                  background:rgba(75,75,249,0.06);
                  border-radius:var(--radius-sm)">
        <div style="font-size:.65rem;font-weight:700;
                    color:var(--text-muted);
                    text-transform:uppercase;
                    letter-spacing:.06em;margin-bottom:6px">
          Reps estimées à une charge
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <input type="number"
                 id="calc-charge-test-${exoIdx}"
                 class="input"
                 placeholder="Charge (kg)"
                 step="2.5"
                 style="flex:1;padding:6px;font-size:.78rem;
                        text-align:center"/>
          <button onclick="(() => {
            const c = parseFloat(document.getElementById(
              'calc-charge-test-${exoIdx}').value);
            const r = Calculateur.repsEstimees(${un_rm}, c);
            document.getElementById(
              'calc-reps-test-${exoIdx}').textContent =
              c && r ? r + ' reps estimées' : '—';
          })()"
                  class="btn-secondary"
                  style="padding:6px 10px;font-size:.72rem">
            →
          </button>
        </div>
        <div id="calc-reps-test-${exoIdx}"
             style="font-size:.78rem;font-weight:700;
                    color:var(--fd-indigo);
                    text-align:center;margin-top:6px">
        </div>
      </div>

      <!-- Tableau des % -->
      <details style="margin-top:var(--space-sm)">
        <summary style="font-size:.68rem;color:var(--text-muted);
                        cursor:pointer;padding:var(--space-xs) 0">
          📊 Voir tous les pourcentages
        </summary>
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:3px;margin-top:var(--space-xs)">
          ${[100,95,90,85,80,75,70,65,60,55,50,45].map(pct => `
            <div style="text-align:center;
                        padding:4px 2px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
              <div style="font-size:.6rem;
                          color:var(--text-muted)">${pct}%</div>
              <div style="font-size:.72rem;font-weight:700;
                          color:var(--text-primary)">
                ${this.chargeParPourcentage(un_rm, pct)}kg
              </div>
            </div>`).join('')}
        </div>
      </details>
    `;
  },

  // ✅ v2.0 — _appliquerCharge avec mise à jour timerPoids
  _appliquerCharge(exoIdx, charge) {
    let s = 0;
    while (document.getElementById(`poids-${exoIdx}-${s}`)) {
      document.getElementById(`poids-${exoIdx}-${s}`).value = charge;
      s++;
    }
    // ✅ NOUVEAU v2.0 — Mettre à jour timerPoidsModifie
    window._timerPoidsModifie = charge;

    Utils.toast(
      `💪 ${charge}kg appliqué sur toutes les séries`,
      'success', 2000
    );
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — render() page complète
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    let genre = 'homme';
    try {
      genre = Utils.storage.get('ft_profil_onboarding', {})
        .genre || 'homme';
    } catch(e) {}

    let prs = {};
    try { prs = Tracker.getAllPRs(); } catch(e) {}
    const refs = Object.keys(prs);

    container.innerHTML = `

      <!-- Titre -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border-color:var(--fd-indigo)">
        <div style="font-size:1.5rem;margin-bottom:4px">🧮</div>
        <div style="font-weight:700;font-size:1.1rem">
          Calculateur 1RM
        </div>
        <div style="font-size:.78rem;color:var(--text-muted);
                    margin-top:4px">
          Calcule ton 1RM estimé et tes charges optimales
          ${genre === 'femme' ? '🌸' : ''}
        </div>
      </div>

      <!-- Calculateur manuel -->
      <div class="card mb-md">
        <div class="card-label">🏋️ Calcul rapide</div>
        <div style="display:grid;
                    grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);
                    margin-top:var(--space-md)">
          <div>
            <div class="input-label">Poids soulevé (kg)</div>
            <input type="number"
                   id="page-calc-poids"
                   class="input"
                   placeholder="ex: 80"
                   step="2.5"/>
          </div>
          <div>
            <div class="input-label">Répétitions</div>
            <input type="number"
                   id="page-calc-reps"
                   class="input"
                   placeholder="ex: 8"
                   min="1" max="30"/>
          </div>
        </div>
        <button onclick="Calculateur._pageCalculer()"
                class="btn-primary mt-md"
                style="width:100%">
          🧮 Calculer mon 1RM
        </button>
        <div id="page-calc-resultat"
             style="margin-top:var(--space-md)"></div>
      </div>

      <!-- 1RM depuis PRs existants -->
      ${refs.length > 0 ? `
        <div class="section-title">📊 Mes 1RM depuis mes records</div>
        <div class="card mb-md">
          ${refs.slice(0, 8).map(ref => {
            const pr = prs[ref];
            const ex = (window.EXERCICES||{})[ref] || {};
            if (!pr?.poids || !pr?.reps) return '';
            const rm1 = pr.rm1 || this.calculer1RM(
              pr.poids, pr.reps
            );
            return `
              <div style="padding:var(--space-sm) 0;
                          border-bottom:1px solid var(--border-color);
                          cursor:pointer"
                   onclick="Calculateur._afficherDetailExo(
                     '${ref}', ${rm1})">
                <div class="flex justify-between items-center">
                  <div>
                    <div style="font-size:.88rem;font-weight:600">
                      ${ex.emoji||'💪'} ${ex.nom||ref}
                    </div>
                    <div style="font-size:.68rem;
                                color:var(--text-muted)">
                      Record : ${pr.poids}kg × ${pr.reps} reps
                    </div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:1.1rem;font-weight:800;
                                color:var(--fd-indigo)">
                      ~${rm1}kg
                    </div>
                    <div style="font-size:.62rem;
                                color:var(--text-muted)">
                      1RM estimé
                    </div>
                  </div>
                </div>
              </div>`;
          }).join('')}
          <div id="detail-exo-calc"
               style="margin-top:var(--space-sm)"></div>
        </div>` : `
        <div class="card mb-md"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem">🏋️</div>
          <p style="color:var(--text-muted);font-size:.88rem;
                    margin-top:var(--space-sm)">
            Fais des séances pour voir tes 1RM ici !
          </p>
        </div>`}

      <!-- Guide formules -->
      <div class="card">
        <div class="card-label">📐 À propos des formules</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            {
              nom:'Epley',
              desc:'La plus utilisée. Poids × (1 + reps/30)',
              fiable:'Toutes les plages de reps'
            },
            {
              nom:'Brzycki',
              desc:'Précise pour 1-10 reps. Poids × 36/(37-reps)',
              fiable:'1 à 10 reps'
            },
            {
              nom:'Lombardi',
              desc:'Poids × reps^0.10',
              fiable:'Hautes reps'
            },
            {
              nom:'O\'Conner',
              desc:'Poids × (1 + 0.025 × reps)',
              fiable:'Hautes reps'
            }
          ].map(f => `
            <div style="padding:var(--space-xs) 0;
                        border-bottom:1px solid var(--border-color)">
              <div style="font-size:.82rem;font-weight:600;
                          color:var(--fd-indigo)">
                ${f.nom}
              </div>
              <div style="font-size:.72rem;color:var(--text-muted)">
                ${f.desc}
              </div>
              <div style="font-size:.62rem;color:var(--fd-mint)">
                ✓ ${f.fiable}
              </div>
            </div>`).join('')}
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-top:var(--space-sm);
                      font-style:italic">
            💡 PowerApp utilise une moyenne pondérée des 4 formules
            pour la meilleure précision.
          </div>
        </div>
      </div>
    `;
  },

  _pageCalculer() {
    const poids = parseFloat(
      document.getElementById('page-calc-poids')?.value
    );
    const reps  = parseInt(
      document.getElementById('page-calc-reps')?.value
    );

    const el = document.getElementById('page-calc-resultat');
    if (!el) return;

    if (!poids || !reps) {
      el.innerHTML = `
        <div style="font-size:.78rem;color:var(--fd-coral);
                    text-align:center;padding:var(--space-sm)">
          ⚠️ Entre le poids et les répétitions
        </div>`;
      return;
    }

    const un_rm        = this.calculer1RM(poids, reps);
    const recommandations = this.getRecommandations(un_rm);

    el.innerHTML = `
      <div style="text-align:center;
                  padding:var(--space-md);
                  background:rgba(75,75,249,0.12);
                  border-radius:var(--radius-sm);
                  margin-bottom:var(--space-md)">
        <div style="font-size:.65rem;color:var(--text-muted);
                    text-transform:uppercase;letter-spacing:.08em">
          1RM estimé
        </div>
        <div style="font-size:2.5rem;font-weight:800;
                    color:var(--fd-indigo);
                    line-height:1.1;margin-top:2px">
          ${un_rm} kg
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:2px">
          Basé sur ${poids}kg × ${reps} reps
        </div>
      </div>

      ${recommandations.map(r => `
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    padding:var(--space-sm);
                    background:var(--bg-input);
                    border-radius:var(--radius-sm);
                    margin-bottom:4px;
                    border-left:3px solid ${r.color}">
          <div>
            <div style="font-size:.82rem;font-weight:700">
              ${r.emoji} ${r.objectif}
            </div>
            <div style="font-size:.68rem;color:var(--text-muted)">
              ${r.reps} reps · ${r.series} séries
              · ${r.pct_min}-${r.pct_max}%
            </div>
            <div style="font-size:.62rem;color:var(--text-muted);
                        font-style:italic">
              ${r.conseil}
            </div>
            ${r.volHebdo ? `
              <div style="font-size:.6rem;color:${r.color};
                          margin-top:2px">
                📊 ${r.volHebdo}
              </div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0;
                      margin-left:var(--space-sm)">
            <div style="font-size:.9rem;font-weight:800;
                        color:${r.color}">
              ${r.charge_min}–${r.charge_max}kg
            </div>
          </div>
        </div>`).join('')}

      <details style="margin-top:var(--space-sm)">
        <summary style="font-size:.68rem;color:var(--text-muted);
                        cursor:pointer;padding:4px 0">
          📊 Tableau pourcentages
        </summary>
        <div style="display:grid;
                    grid-template-columns:repeat(4,1fr);
                    gap:3px;margin-top:var(--space-xs)">
          ${[100,95,90,85,80,75,70,65,60,55,50,45].map(pct => `
            <div style="text-align:center;padding:4px 2px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm)">
              <div style="font-size:.6rem;
                          color:var(--text-muted)">${pct}%</div>
              <div style="font-size:.72rem;font-weight:700">
                ${this.chargeParPourcentage(un_rm, pct)}kg
              </div>
            </div>`).join('')}
        </div>
      </details>
    `;
  },

  _afficherDetailExo(ref, rm1) {
    const el = document.getElementById('detail-exo-calc');
    if (!el) return;

    const recs = this.getRecommandations(rm1);
    const ex   = (window.EXERCICES||{})[ref] || {};

    el.innerHTML = `
      <div style="padding:var(--space-md);
                  background:rgba(75,75,249,0.06);
                  border-radius:var(--radius-md);
                  border:1px solid rgba(75,75,249,0.2)">
        <div style="font-weight:700;font-size:.9rem;
                    margin-bottom:var(--space-sm)">
          ${ex.emoji||'💪'} ${ex.nom||ref}
          — 1RM : ${rm1}kg
        </div>
        ${recs.map(r => `
          <div style="display:flex;justify-content:space-between;
                      padding:var(--space-xs) 0;font-size:.78rem;
                      border-bottom:1px solid var(--border-color)">
            <span style="color:${r.color};font-weight:600">
              ${r.emoji} ${r.objectif}
            </span>
            <span>
              ${r.charge_min}–${r.charge_max}kg
              (${r.reps} reps)
            </span>
          </div>`).join('')}
      </div>
    `;
  }
};

window.Calculateur = Calculateur;

// ✅ Connecter getSuggestionCharge à Tracker
if (window.Tracker) {
  window.Tracker.getSuggestionCharge = (ref) =>
    Calculateur.getSuggestionCharge(ref);
}

console.log('✅ Calculateur.js v2.0 chargé — 4 formules + Genre-aware + getSuggestionCharge');
