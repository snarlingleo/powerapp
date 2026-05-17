/* ============================================================
   PowerApp — Calculateur.js v1.0
   Calcul 1RM, recommandations de charge, pourcentages
   ============================================================ */

'use strict';

const Calculateur = {

  // ════════════════════════════════════════════════════════
  // FORMULES 1RM
  // ════════════════════════════════════════════════════════

  /**
   * Calcule le 1RM estimé selon plusieurs formules
   * Retourne la moyenne pour plus de précision
   */
  calculer1RM(poids, reps) {
    if (!poids || !reps || reps < 1) return 0;
    if (reps === 1) return poids;

    // Epley (la plus connue)
    const epley    = poids * (1 + reps / 30);

    // Brzycki (précise jusqu'à 10 reps)
    const brzycki  = poids * (36 / (37 - reps));

    // Lombardi
    const lombardi = poids * Math.pow(reps, 0.10);

    // Moyenne pondérée — Epley a plus de poids
    const moyenne  = (epley * 0.5 + brzycki * 0.35 + lombardi * 0.15);

    // Arrondi au 0.5kg
    return Math.round(moyenne * 2) / 2;
  },

  /**
   * Retourne les recommandations par objectif
   * basées sur le 1RM calculé
   */
  getRecommandations(un_rm) {
    if (!un_rm || un_rm <= 0) return [];

    const arrondir = (val) => Math.round(val / 2.5) * 2.5;

    return [
      {
        objectif:   'Force',
        emoji:      '🏋️',
        color:      'var(--fd-coral)',
        pct_min:    85,
        pct_max:    95,
        reps:       '1-5',
        series:     '4-6',
        charge_min: arrondir(un_rm * 0.85),
        charge_max: arrondir(un_rm * 0.95),
        conseil:    'Récupération 3-5 min entre séries'
      },
      {
        objectif:   'Hypertrophie',
        emoji:      '💪',
        color:      'var(--fd-indigo)',
        pct_min:    65,
        pct_max:    80,
        reps:       '6-12',
        series:     '3-4',
        charge_min: arrondir(un_rm * 0.65),
        charge_max: arrondir(un_rm * 0.80),
        conseil:    'Récupération 60-90 sec entre séries'
      },
      {
        objectif:   'Endurance musculaire',
        emoji:      '🔥',
        color:      'var(--fd-mint)',
        pct_min:    50,
        pct_max:    65,
        reps:       '12-20',
        series:     '2-3',
        charge_min: arrondir(un_rm * 0.50),
        charge_max: arrondir(un_rm * 0.65),
        conseil:    'Récupération 30-45 sec entre séries'
      }
    ];
  },

  /**
   * Calcule la charge pour un % donné du 1RM
   */
  chargeParPourcentage(un_rm, pourcentage) {
    const charge = un_rm * (pourcentage / 100);
    return Math.round(charge / 2.5) * 2.5;
  },

  /**
   * Estime les reps possibles à une charge donnée
   */
  repsEstimees(un_rm, charge) {
    if (!un_rm || !charge || charge > un_rm) return 0;
    const pct = charge / un_rm;
    // Formule inverse d'Epley
    const reps = Math.round(30 * (1 / pct - 1));
    return Math.max(1, Math.min(30, reps));
  },

  // ════════════════════════════════════════════════════════
  // RENDU UI
  // ════════════════════════════════════════════════════════

  /**
   * Affiche le calculateur inline sous un exercice
   */
  renderCalculateur(exoRef, exoIdx) {
    const containerId = `calc-${exoIdx}`;
    const existing    = document.getElementById(containerId);

    // Toggle — si déjà ouvert, fermer
    if (existing) {
      existing.remove();
      return;
    }

    // Créer le panel
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

    panel.innerHTML = `
      <div style="font-size:.72rem;font-weight:700;
                  color:var(--fd-indigo);
                  text-transform:uppercase;
                  letter-spacing:.08em;
                  margin-bottom:var(--space-sm)">
        🧮 Calculateur 1RM
      </div>

      <!-- Inputs -->
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
                 step="2.5"
                 style="padding:8px;font-size:.85rem;
                        text-align:center" />
        </div>
        <div>
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-bottom:3px">Répétitions</div>
          <input type="number"
                 id="calc-reps-${exoIdx}"
                 class="input"
                 placeholder="ex: 8"
                 min="1" max="30"
                 style="padding:8px;font-size:.85rem;
                        text-align:center" />
        </div>
        <div style="display:flex;align-items:flex-end">
          <button onclick="Calculateur._calculerEtAfficher(${exoIdx})"
                  class="btn-primary"
                  style="padding:8px 12px;
                         font-size:.82rem;
                         white-space:nowrap">
            Calculer →
          </button>
        </div>
      </div>

      <!-- Résultat -->
      <div id="calc-resultat-${exoIdx}"></div>
    `;

    // Insérer après la carte exercice
    const carte = document.getElementById(`live-exo-${exoIdx}`);
    if (carte) {
      carte.appendChild(panel);
    }

    // Focus sur le premier input
    setTimeout(() => {
      document.getElementById(`calc-poids-${exoIdx}`)?.focus();
    }, 100);
  },

  _calculerEtAfficher(exoIdx) {
    const poids = parseFloat(
      document.getElementById(`calc-poids-${exoIdx}`)?.value
    );
    const reps  = parseInt(
      document.getElementById(`calc-reps-${exoIdx}`)?.value
    );

    if (!poids || !reps) {
      document.getElementById(`calc-resultat-${exoIdx}`).innerHTML = `
        <div style="font-size:.75rem;color:var(--fd-coral);
                    text-align:center;padding:var(--space-sm)">
          ⚠️ Entre le poids et les répétitions
        </div>`;
      return;
    }

    const un_rm         = this.calculer1RM(poids, reps);
    const recommandations = this.getRecommandations(un_rm);

    document.getElementById(`calc-resultat-${exoIdx}`).innerHTML = `

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

      <!-- Tableau des % -->
      <details style="margin-top:var(--space-sm)">
        <summary style="font-size:.68rem;color:var(--text-muted);
                        cursor:pointer;
                        padding:var(--space-xs) 0">
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

  /**
   * Applique la charge recommandée dans tous les inputs poids
   * de l'exercice correspondant
   */
  _appliquerCharge(exoIdx, charge) {
    // Trouver tous les inputs poids de cet exercice
    let s = 0;
    while (document.getElementById(`poids-${exoIdx}-${s}`)) {
      document.getElementById(`poids-${exoIdx}-${s}`).value = charge;
      s++;
    }
    Utils.toast(`💪 ${charge}kg appliqué sur toutes les séries`, 'success', 2000);
  }

};

window.Calculateur = Calculateur;
console.log('✅ Calculateur.js v1.0 chargé');
