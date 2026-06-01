/* ============================================================
   PowerApp — report.js v1.0
   ✅ Rapport hebdomadaire complet
   ✅ Graphiques Canvas
   ✅ Export PDF + PNG
   ✅ Comparaison semaines
   ✅ Top exercices + PRs
   ============================================================ */

'use strict';

const Report = {

  CLE: 'ft_reports_history',

  // ════════════════════════════════════════════════════════
  // DONNÉES SEMAINE
  // ════════════════════════════════════════════════════════
  _getDonneesSemaine(offsetSemaines = 0) {
    try {
      const aujourd = Utils.aujourd_hui();
      const debut   = Utils.debutSemaine(aujourd, offsetSemaines);
      const fin     = Utils.finSemaine(aujourd, offsetSemaines);

      // ✅ Séances de la semaine
      let seances = [];
      try {
        seances = Tracker.getSeancesSemaine?.(debut, fin) || [];
      } catch(e) {}

      // ✅ Volume par jour
      const volumeParJour = {};
      const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
      JOURS.forEach(j => volumeParJour[j] = 0);

      seances.forEach(s => {
        const date  = new Date(s.date);
        const idx   = (date.getDay() + 6) % 7; // Lundi = 0
        const label = JOURS[idx];
        volumeParJour[label] = (volumeParJour[label] || 0)
          + (s.volumeTotal || 0);
      });

      // ✅ Muscles travaillés
      const musclesData = {};
      seances.forEach(s => {
        (s.series || []).forEach(serie => {
          const ex     = (window.EXERCICES || {})[serie.exerciceRef] || {};
          const muscle = ex.muscle || 'Autre';
          const vol    = (serie.poids || 0) * (serie.reps || 0);
          musclesData[muscle] = (musclesData[muscle] || 0) + vol;
        });
      });

      // ✅ PRs de la semaine
      let prs = [];
      try {
        prs = Tracker.getPRsPeriode?.(debut, fin) || [];
      } catch(e) {}

      // ✅ Stats globales
      const volumeTotal = seances.reduce(
        (a, s) => a + (s.volumeTotal || 0), 0
      );
      const nbSeries = seances.reduce(
        (a, s) => a + (s.series?.length || 0), 0
      );
      const rpesMoyen = (() => {
        const rpes = seances
          .flatMap(s => s.series || [])
          .map(s => s.rpe)
          .filter(r => r > 0);
        return rpes.length
          ? Math.round(rpes.reduce((a, r) => a + r, 0) / rpes.length * 10) / 10
          : 0;
      })();

      // ✅ Streak
      let streak = { count: 0 };
      try { streak = Tracker.getStreak(); } catch(e) {}

      // ✅ Top exercices
      const topExo = {};
      seances.forEach(s => {
        (s.series || []).forEach(serie => {
          const ref = serie.exerciceRef;
          if (!ref) return;
          if (!topExo[ref]) topExo[ref] = { sets:0, vol:0 };
          topExo[ref].sets++;
          topExo[ref].vol += (serie.poids||0) * (serie.reps||0);
        });
      });

      const topExoList = Object.entries(topExo)
        .sort(([,a],[,b]) => b.vol - a.vol)
        .slice(0, 5)
        .map(([ref, data]) => ({
          ref,
          ex:   (window.EXERCICES||{})[ref] || {},
          sets: data.sets,
          vol:  data.vol
        }));

      return {
        debut, fin,
        seances,
        nbSeances:    seances.length,
        volumeTotal,
        volumeParJour,
        musclesData,
        prs,
        nbSeries,
        rpesMoyen,
        streak,
        topExoList,
        offsetSemaines
      };

    } catch(e) {
      console.warn('[Report] _getDonneesSemaine:', e);
      return {
        debut: '', fin: '',
        seances: [], nbSeances: 0,
        volumeTotal: 0, volumeParJour: {},
        musclesData: {}, prs: [],
        nbSeries: 0, rpesMoyen: 0,
        streak: { count:0 },
        topExoList: [],
        offsetSemaines
      };
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    this._offsetActuel = this._offsetActuel || 0;
    const data     = this._getDonneesSemaine(this._offsetActuel);
    const dataPrev = this._getDonneesSemaine(this._offsetActuel - 1);

    // ✅ Objectif séances
    const objectifSeances = Utils.storage.get(
      'ft_objectif_seances_semaine', 4
    );
    const pctObjectif = Math.min(100, Math.round(
      (data.nbSeances / Math.max(objectifSeances, 1)) * 100
    ));

    // ✅ Comparaison volume
    const deltaVol = dataPrev.volumeTotal > 0
      ? Math.round(
          ((data.volumeTotal - dataPrev.volumeTotal)
           / dataPrev.volumeTotal) * 100
        )
      : 0;

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          📊 RAPPORT HEBDOMADAIRE
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Bilan de la semaine
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Analyse ta progression et exporte ton rapport
        </p>
      </div>

      <!-- Navigation semaines -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  margin-bottom:16px;
                  background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:10px 14px">
        <button onclick="Report._changerSemaine(-1)"
                style="width:36px;height:36px;
                       background:rgba(75,75,249,0.1);
                       border:1px solid rgba(75,75,249,0.2);
                       border-radius:50%;font-size:1rem;
                       color:var(--fd-indigo);cursor:pointer">
          ‹
        </button>
        <div style="text-align:center">
          <div style="font-size:.72rem;font-weight:700;
                      color:white">
            ${this._offsetActuel === 0
              ? 'Cette semaine'
              : this._offsetActuel === -1
                ? 'Semaine dernière'
                : `Il y a ${Math.abs(this._offsetActuel)} semaines`}
          </div>
          <div style="font-size:.62rem;color:var(--text-muted);
                      margin-top:2px">
            ${data.debut} → ${data.fin}
          </div>
        </div>
        <button onclick="Report._changerSemaine(1)"
                style="width:36px;height:36px;
                       background:${this._offsetActuel >= 0
                         ?'rgba(255,255,255,0.04)'
                         :'rgba(75,75,249,0.1)'};
                       border:1px solid ${this._offsetActuel >= 0
                         ?'rgba(255,255,255,0.08)'
                         :'rgba(75,75,249,0.2)'};
                       border-radius:50%;font-size:1rem;
                       color:${this._offsetActuel >= 0
                         ?'var(--text-muted)'
                         :'var(--fd-indigo)'};
                       cursor:${this._offsetActuel >= 0
                         ?'default':'pointer'}"
                ${this._offsetActuel >= 0 ? 'disabled' : ''}>
          ›
        </button>
      </div>

      <!-- Stats principales -->
      <div style="display:grid;grid-template-columns:repeat(2,1fr);
                  gap:10px;margin-bottom:16px">
        ${[
          {
            emoji:'🏋️', label:'Séances',
            val:`${data.nbSeances}/${objectifSeances}`,
            sub:`${pctObjectif}% objectif`,
            color:'var(--fd-indigo)',
            bg:'rgba(75,75,249,0.08)',
            border:'rgba(75,75,249,0.2)'
          },
          {
            emoji:'📦', label:'Volume total',
            val:Utils.formatVolume(data.volumeTotal),
            sub:deltaVol !== 0
              ? `${deltaVol>0?'+':`'}${deltaVol}% vs sem. préc.`
              : 'Pas de comparaison',
            color: deltaVol >= 0
              ? 'var(--fd-mint)' : 'var(--fd-coral)',
            bg: deltaVol >= 0
              ? 'rgba(139,240,187,0.08)'
              : 'rgba(255,141,150,0.08)',
            border: deltaVol >= 0
              ? 'rgba(139,240,187,0.2)'
              : 'rgba(255,141,150,0.2)'
          },
          {
            emoji:'💪', label:'Séries totales',
            val:data.nbSeries,
            sub:`~${data.nbSeries > 0
              ? Math.round(data.nbSeries / Math.max(data.nbSeances,1))
              : 0} par séance`,
            color:'var(--fd-lavender)',
            bg:'rgba(191,161,255,0.08)',
            border:'rgba(191,161,255,0.2)'
          },
          {
            emoji:'🏆', label:'Nouveaux PRs',
            val:data.prs.length,
            sub:data.prs.length > 0
              ? `🔥 ${data.prs.length} record${data.prs.length>1?'s':''}!`
              : 'Continue comme ça !',
            color:'var(--fd-lemon)',
            bg:'rgba(249,239,119,0.08)',
            border:'rgba(249,239,119,0.2)'
          }
        ].map(s=>`
          <div style="background:${s.bg};
                      border:1px solid ${s.border};
                      border-radius:var(--radius-lg);
                      padding:14px 12px">
            <div style="font-size:.6rem;color:var(--text-muted);
                        margin-bottom:6px;
                        display:flex;align-items:center;gap:5px">
              ${s.emoji} ${s.label}
            </div>
            <div style="font-size:1.4rem;font-weight:800;
                        color:${s.color};line-height:1">
              ${s.val}
            </div>
            <div style="font-size:.62rem;color:var(--text-muted);
                        margin-top:4px">
              ${s.sub}
            </div>
          </div>`).join('')}
      </div>

      <!-- Objectif semaine -->
      <div class="card mb-md">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:8px">
          <div style="font-size:.72rem;font-weight:700;
                      color:var(--text-muted)">
            🎯 Objectif séances
          </div>
          <div style="font-size:.72rem;font-weight:700;
                      color:${pctObjectif >= 100
                        ?'var(--fd-mint)':'var(--fd-indigo)'}">
            ${data.nbSeances} / ${objectifSeances}
          </div>
        </div>
        <div style="height:8px;background:rgba(255,255,255,0.06);
                    border-radius:99px;overflow:hidden">
          <div style="height:100%;
                      width:${pctObjectif}%;
                      background:${pctObjectif >= 100
                        ?'linear-gradient(90deg,var(--fd-mint),var(--fd-indigo))'
                        :'linear-gradient(90deg,var(--fd-indigo),var(--fd-lavender))'};
                      border-radius:99px;
                      transition:width .5s ease">
          </div>
        </div>
        ${pctObjectif >= 100 ? `
          <div style="margin-top:8px;font-size:.72rem;
                      color:var(--fd-mint);font-weight:700">
            🎉 Objectif atteint cette semaine !
          </div>` : `
          <div style="margin-top:8px;font-size:.7rem;
                      color:var(--text-muted)">
            Encore ${objectifSeances - data.nbSeances} séance${
              objectifSeances - data.nbSeances > 1 ? 's' : ''
            } pour atteindre l'objectif
          </div>`}
      </div>

      <!-- Graphique Volume par jour -->
      <div class="card mb-md">
        <div class="card-label">📈 Volume par jour</div>
        <div style="margin-top:12px;position:relative;height:160px">
          <canvas id="report-chart-volume"
                  style="width:100%;height:160px"></canvas>
        </div>
      </div>

      <!-- Graphique muscles -->
      ${Object.keys(data.musclesData).length > 0 ? `
        <div class="card mb-md">
          <div class="card-label">🎯 Répartition musculaire</div>
          <div style="display:flex;align-items:center;
                      gap:16px;margin-top:12px">
            <canvas id="report-chart-muscles"
                    width="140" height="140"
                    style="flex-shrink:0"></canvas>
            <div id="report-muscles-legend"
                 style="flex:1;display:flex;
                        flex-direction:column;gap:6px">
            </div>
          </div>
        </div>` : ''}

      <!-- Graphique 4 semaines -->
      <div class="card mb-md">
        <div class="card-label">📊 Évolution sur 4 semaines</div>
        <div style="margin-top:12px;position:relative;height:140px">
          <canvas id="report-chart-evolution"
                  style="width:100%;height:140px"></canvas>
        </div>
      </div>

      <!-- Top exercices -->
      ${data.topExoList.length > 0 ? `
        <div class="card mb-md">
          <div class="card-label">🏆 Top exercices semaine</div>
          <div style="margin-top:10px">
            ${data.topExoList.map((item, i) => `
              <div style="display:flex;align-items:center;gap:10px;
                          padding:8px 0;
                          border-bottom:1px solid rgba(255,255,255,0.05)">
                <div style="width:24px;height:24px;
                            border-radius:50%;flex-shrink:0;
                            background:${i===0?'var(--fd-lemon)'
                              :i===1?'rgba(255,255,255,0.2)'
                              :i===2?'rgba(255,141,150,0.4)'
                              :'rgba(255,255,255,0.08)'};
                            display:flex;align-items:center;
                            justify-content:center;
                            font-size:.65rem;font-weight:800;
                            color:${i===0?'#09092d':'white'}">
                  ${i+1}
                </div>
                <span style="font-size:1.1rem">
                  ${item.ex.emoji||'💪'}
                </span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:.82rem;font-weight:700;
                              overflow:hidden;text-overflow:ellipsis;
                              white-space:nowrap">
                    ${item.ex.nom||item.ref}
                  </div>
                  <div style="font-size:.62rem;color:var(--text-muted);
                              margin-top:1px">
                    ${item.sets} séries · ${Utils.formatVolume(item.vol)}
                  </div>
                </div>
                <div style="font-size:.7rem;font-weight:700;
                            color:var(--fd-indigo);flex-shrink:0">
                  ${Utils.formatVolume(item.vol)}
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

      <!-- PRs de la semaine -->
      ${data.prs.length > 0 ? `
        <div style="background:linear-gradient(135deg,
                    rgba(249,239,119,0.12),rgba(249,239,119,0.03));
                    border:1px solid rgba(249,239,119,0.3);
                    border-radius:var(--radius-lg);
                    padding:16px;margin-bottom:16px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-lemon);margin-bottom:10px;
                      display:flex;align-items:center;gap:6px">
            <span style="animation:pulse 1s infinite">🏆</span>
            Records personnels cette semaine !
          </div>
          ${data.prs.map(pr=>{
            const ex = (window.EXERCICES||{})[pr.exerciceRef]||{};
            return `
              <div style="display:flex;align-items:center;gap:10px;
                          padding:8px 0;
                          border-bottom:1px solid rgba(249,239,119,0.1)">
                <span style="font-size:1.2rem">${ex.emoji||'💪'}</span>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:700">
                    ${ex.nom||pr.exerciceRef}
                  </div>
                  <div style="font-size:.62rem;color:var(--text-muted)">
                    ${pr.date}
                  </div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:.85rem;font-weight:800;
                              color:var(--fd-lemon)">
                    ${pr.poids}kg × ${pr.reps}
                  </div>
                  <div style="font-size:.6rem;color:var(--fd-lavender)">
                    1RM ~${pr.rm1||'?'}kg
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>` : ''}

      <!-- RPE moyen -->
      ${data.rpesMoyen > 0 ? `
        <div class="card mb-md">
          <div style="display:flex;align-items:center;
                      justify-content:space-between">
            <div>
              <div class="card-label">😤 RPE moyen</div>
              <div style="font-size:2rem;font-weight:800;
                          margin-top:6px;
                          color:${data.rpesMoyen >= 8
                            ?'var(--fd-coral)'
                            :data.rpesMoyen >= 6
                              ?'var(--fd-lemon)'
                              :'var(--fd-mint)'}">
                ${data.rpesMoyen}
                <span style="font-size:.9rem;
                             color:var(--text-muted);
                             font-weight:400">/10</span>
              </div>
              <div style="font-size:.7rem;color:var(--text-muted);
                          margin-top:4px">
                ${data.rpesMoyen >= 8
                  ? '🔥 Intensité élevée — récupère bien !'
                  : data.rpesMoyen >= 6
                    ? '💪 Bonne intensité — continue !'
                    : '😊 Intensité modérée — tu peux pousser plus !'}
              </div>
            </div>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      stroke-width="8"/>
              <circle cx="40" cy="40" r="32"
                      fill="none"
                      stroke="${data.rpesMoyen>=8
                        ?'var(--fd-coral)'
                        :data.rpesMoyen>=6
                          ?'var(--fd-lemon)'
                          :'var(--fd-mint)'}"
                      stroke-width="8"
                      stroke-linecap="round"
                      stroke-dasharray="${Math.round(201*(data.rpesMoyen/10))} 201"
                      transform="rotate(-90 40 40)"
                      style="filter:drop-shadow(0 0 4px currentColor)"/>
              <text x="40" y="44"
                    text-anchor="middle"
                    fill="white" font-size="14"
                    font-weight="800">
                ${data.rpesMoyen}
              </text>
            </svg>
          </div>
        </div>` : ''}

      <!-- Boutons export -->
      <div class="card mb-md">
        <div class="card-label">📤 Exporter mon rapport</div>
        <div style="display:flex;flex-direction:column;
                    gap:8px;margin-top:12px">

          <button onclick="Report.exporterPNG()"
                  style="display:flex;align-items:center;gap:10px;
                         padding:14px 16px;
                         background:rgba(75,75,249,0.12);
                         border:1px solid rgba(75,75,249,0.3);
                         border-radius:var(--radius-lg);
                         cursor:pointer;transition:all .2s;
                         width:100%;text-align:left;
                         font-family:inherit;color:white"
                  onmouseenter="this.style.background='rgba(75,75,249,0.2)'"
                  onmouseleave="this.style.background='rgba(75,75,249,0.12)'">
            <div style="width:40px;height:40px;border-radius:10px;
                        background:rgba(75,75,249,0.2);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.2rem;
                        flex-shrink:0">📸</div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:700">
                Image PNG
              </div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:2px">
                Story Instagram · Partage rapide
              </div>
            </div>
            <span style="color:var(--fd-indigo)">↓</span>
          </button>

          <button onclick="Report.exporterPDF()"
                  style="display:flex;align-items:center;gap:10px;
                         padding:14px 16px;
                         background:rgba(255,141,150,0.08);
                         border:1px solid rgba(255,141,150,0.2);
                         border-radius:var(--radius-lg);
                         cursor:pointer;transition:all .2s;
                         width:100%;text-align:left;
                         font-family:inherit;color:white"
                  onmouseenter="this.style.background='rgba(255,141,150,0.15)'"
                  onmouseleave="this.style.background='rgba(255,141,150,0.08)'">
            <div style="width:40px;height:40px;border-radius:10px;
                        background:rgba(255,141,150,0.15);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.2rem;
                        flex-shrink:0">📄</div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:700">
                Rapport PDF
              </div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:2px">
                Rapport complet · À imprimer ou partager
              </div>
            </div>
            <span style="color:var(--fd-coral)">↓</span>
          </button>

          <button onclick="Report.exporterJSON()"
                  style="display:flex;align-items:center;gap:10px;
                         padding:14px 16px;
                         background:rgba(139,240,187,0.06);
                         border:1px solid rgba(139,240,187,0.15);
                         border-radius:var(--radius-lg);
                         cursor:pointer;transition:all .2s;
                         width:100%;text-align:left;
                         font-family:inherit;color:white"
                  onmouseenter="this.style.background='rgba(139,240,187,0.12)'"
                  onmouseleave="this.style.background='rgba(139,240,187,0.06)'">
            <div style="width:40px;height:40px;border-radius:10px;
                        background:rgba(139,240,187,0.1);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.2rem;
                        flex-shrink:0">📊</div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:700">
                Données JSON
              </div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:2px">
                Export brut · Analyse externe
              </div>
            </div>
            <span style="color:var(--fd-mint)">↓</span>
          </button>
        </div>
      </div>

    `;

    // ✅ Dessiner les graphiques après render
    requestAnimationFrame(() => {
      this._dessinerVolumeJour(data.volumeParJour);
      this._dessinerMuscles(data.musclesData);
      this._dessinerEvolution();
    });
  },

  // ════════════════════════════════════════════════════════
  // GRAPHIQUES CANVAS
  // ════════════════════════════════════════════════════════
  _dessinerVolumeJour(volumeParJour) {
    const canvas = document.getElementById('report-chart-volume');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    const W      = canvas.offsetWidth || 300;
    const H      = 160;
    canvas.width  = W;
    canvas.height = H;

    const JOURS  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dom'];
    const valeurs = JOURS.map(j => volumeParJour[j] || 0);
    const maxVal  = Math.max(...valeurs, 1);

    const padL = 40, padR = 10, padT = 10, padB = 30;
    const areaW = W - padL - padR;
    const areaH = H - padT - padB;
    const barW  = Math.floor(areaW / JOURS.length * 0.6);
    const gap   = Math.floor(areaW / JOURS.length);

    // Fond
    ctx.clearRect(0, 0, W, H);

    // Grille horizontale
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth   = 1;
    [0.25, 0.5, 0.75, 1].forEach(pct => {
      const y = padT + areaH * (1 - pct);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();

      // Labels Y
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font      = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        Utils.formatVolume(maxVal * pct),
        padL - 4, y + 3
      );
    });

    // Aujourd'hui index
    const aujourdJour = (new Date().getDay() + 6) % 7;

    // Barres
    JOURS.forEach((jour, i) => {
      const val = valeurs[i];
      const pct = val / maxVal;
      const bH  = Math.max(2, Math.round(areaH * pct));
      const x   = padL + i * gap + (gap - barW) / 2;
      const y   = padT + areaH - bH;

      // Couleur selon jour
      const estAujourd = i === aujourdJour;
      const estWeekend = i >= 5;

      const color = val === 0
        ? 'rgba(255,255,255,0.05)'
        : estAujourd
          ? '#4b4bf9'
          : estWeekend
            ? '#8bf0bb'
            : '#4b4bf9';

      // Barre
      const radius = Math.min(4, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barW - radius, y);
      ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
      ctx.lineTo(x + barW, y + bH);
      ctx.lineTo(x, y + bH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();

      if (val > 0) {
        const grad = ctx.createLinearGradient(0, y, 0, y + bH);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color + '44');
        ctx.fillStyle = grad;
        ctx.shadowColor  = color;
        ctx.shadowBlur   = 6;
      } else {
        ctx.fillStyle   = 'rgba(255,255,255,0.05)';
        ctx.shadowBlur  = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label valeur
      if (val > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font      = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          Utils.formatVolume(val),
          x + barW / 2, y - 3
        );
      }

      // Label jour
      ctx.fillStyle = estAujourd
        ? '#4b4bf9' : 'rgba(255,255,255,0.35)';
      ctx.font      = estAujourd
        ? 'bold 9px monospace' : '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(jour, x + barW / 2, H - 8);
    });
  },

  _dessinerMuscles(musclesData) {
    const canvas = document.getElementById('report-chart-muscles');
    if (!canvas) return;

    const entries = Object.entries(musclesData)
      .sort(([,a],[,b]) => b - a)
      .slice(0, 6);

    if (!entries.length) return;

    const ctx   = canvas.getContext('2d');
    const W = H = 140;
    canvas.width  = W;
    canvas.height = H;

    const cx    = W / 2, cy = H / 2, r = 55, sw = 18;
    const total = entries.reduce((a,[,v]) => a + v, 0);
    const COLS  = ['#4b4bf9','#8bf0bb','#f9ef77',
                   '#bfa1ff','#ff8d96','#00cfff'];

    let startAngle = -Math.PI / 2;

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth   = sw;
    ctx.stroke();

    // Segments
    entries.forEach(([muscle, vol], i) => {
      const angle = (vol / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, startAngle, startAngle + angle);
      ctx.strokeStyle = COLS[i];
      ctx.lineWidth   = sw;
      ctx.lineCap     = 'round';
      ctx.shadowColor = COLS[i];
      ctx.shadowBlur  = 4;
      ctx.stroke();
      ctx.shadowBlur  = 0;
      startAngle += angle;
    });

    // Centre
    ctx.fillStyle = 'white';
    ctx.font      = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(entries.length, cx, cy - 4);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font      = '9px monospace';
    ctx.fillText('muscles', cx, cy + 10);

    // Légende
    const legend = document.getElementById('report-muscles-legend');
    if (!legend) return;

    legend.innerHTML = entries.map(([muscle, vol], i) => {
      const pct = Math.round((vol / total) * 100);
      return `
        <div>
          <div style="display:flex;justify-content:space-between;
                      align-items:center;margin-bottom:2px">
            <span style="font-size:.68rem;font-weight:700;
                         color:${COLS[i]}">
              ${muscle}
            </span>
            <span style="font-size:.6rem;color:var(--text-muted)">
              ${pct}%
            </span>
          </div>
          <div style="height:3px;
                      background:rgba(255,255,255,0.05);
                      border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${pct}%;
                        background:${COLS[i]};
                        border-radius:99px;
                        transition:width .8s ease">
            </div>
          </div>
        </div>`;
    }).join('');
  },

  _dessinerEvolution() {
    const canvas = document.getElementById('report-chart-evolution');
    if (!canvas) return;

    // ✅ Récupérer 4 semaines
    const semaines = [
      this._getDonneesSemaine(-3),
      this._getDonneesSemaine(-2),
      this._getDonneesSemaine(-1),
      this._getDonneesSemaine(0)
    ];

    const ctx    = canvas.getContext('2d');
    const W      = canvas.offsetWidth || 300;
    const H      = 140;
    canvas.width  = W;
    canvas.height = H;

    const valeurs = semaines.map(s => s.volumeTotal);
    const maxVal  = Math.max(...valeurs, 1);

    const padL = 44, padR = 16, padT = 16, padB = 28;
    const areaW = W - padL - padR;
    const areaH = H - padT - padB;

    ctx.clearRect(0, 0, W, H);

    // Grille
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth   = 1;
    [0.5, 1].forEach(pct => {
      const y = padT + areaH * (1 - pct);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font      = '9px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(
        Utils.formatVolume(maxVal * pct),
        padL - 4, y + 3
      );
    });

    // Calculer points
    const pts = valeurs.map((v, i) => ({
      x: padL + (i / (valeurs.length - 1)) * areaW,
      y: padT + areaH * (1 - v / maxVal)
    }));

    // Zone remplie
    const grad = ctx.createLinearGradient(0, padT, 0, padT + areaH);
    grad.addColorStop(0, 'rgba(75,75,249,0.3)');
    grad.addColorStop(1, 'rgba(75,75,249,0)');

    ctx.beginPath();
    ctx.moveTo(pts.x, padT + areaH);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length-1].x, padT + areaH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Ligne
    ctx.beginPath();
    pts.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else {
        // Courbe lisse
        const prev = pts[i-1];
        const cpx  = (prev.x + p.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
      }
    });
    ctx.strokeStyle = '#4b4bf9';
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = '#4b4bf9';
    ctx.shadowBlur  = 8;
    ctx.stroke();
    ctx.shadowBlur  = 0;

    // Points + labels
    const labels = ['S-3','S-2','S-1','Cette sem.'];
    pts.forEach((p, i) => {
      // Point
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = i === 3 ? '#f9ef77' : '#4b4bf9';
      ctx.shadowColor = i === 3 ? '#f9ef77' : '#4b4bf9';
      ctx.shadowBlur  = 8;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Valeur
      if (valeurs[i] > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font      = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          Utils.formatVolume(valeurs[i]),
          p.x, p.y - 10
        );
      }

      // Label semaine
      ctx.fillStyle = i === 3
        ? '#f9ef77' : 'rgba(255,255,255,0.35)';
      ctx.font      = i === 3
        ? 'bold 9px monospace' : '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], p.x, H - 8);
    });
  },

  // ════════════════════════════════════════════════════════
  // NAVIGATION SEMAINES
  // ════════════════════════════════════════════════════════
  _changerSemaine(delta) {
    const nouveau = (this._offsetActuel || 0) + delta;
    if (nouveau > 0) return; // Pas dans le futur

    this._offsetActuel = nouveau;

    const container = document.getElementById('page-report')
      || document.querySelector('.page.active');
    if (container) this.render(container);
  },

  // ════════════════════════════════════════════════════════
  // EXPORT PNG
  // ════════════════════════════════════════════════════════
  async exporterPNG() {
    Utils.toast('⏳ Génération de l\'image...', 'info', 2000);

    try {
      const data   = this._getDonneesSemaine(this._offsetActuel || 0);
      const canvas = document.createElement('canvas');
      canvas.width  = 1080;
      canvas.height = 1920;
      const ctx    = canvas.getContext('2d');

      // ── Fond ──
      const gradFond = ctx.createLinearGradient(0, 0, 0, 1920);
      gradFond.addColorStop(0, '#06063d');
      gradFond.addColorStop(1, '#020515');
      ctx.fillStyle = gradFond;
      ctx.fillRect(0, 0, 1080, 1920);

      // Glows
      const g1 = ctx.createRadialGradient(540, 0, 0, 540, 0, 600);
      g1.addColorStop(0, 'rgba(75,75,249,0.25)');
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, 1080, 600);

      const g2 = ctx.createRadialGradient(540, 1920, 0, 540, 1920, 500);
      g2.addColorStop(0, 'rgba(139,240,187,0.1)');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 1400, 1080, 520);

      // ── Header ──
      ctx.fillStyle = '#4b4bf9';
      ctx.font      = 'bold 40px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ PowerApp', 540, 110);

      // Ligne séparatrice
      const ligne = ctx.createLinearGradient(150, 0, 930, 0);
      ligne.addColorStop(0, 'transparent');
      ligne.addColorStop(0.5, 'rgba(75,75,249,0.6)');
      ligne.addColorStop(1, 'transparent');
      ctx.strokeStyle = ligne;
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(150, 135);
      ctx.lineTo(930, 135);
      ctx.stroke();

      // ── Titre rapport ──
      ctx.fillStyle = 'white';
      ctx.font      = 'bold 68px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📊 RAPPORT HEBDO', 540, 220);

      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '32px system-ui, sans-serif';
      ctx.fillText(`${data.debut} → ${data.fin}`, 540, 270);

      // ── 4 Stats cards ──
      const stats = [
        { emoji:'🏋️', label:'SÉANCES', val:`${data.nbSeances}`,
          color:'#4b4bf9', x:80,  y:310 },
        { emoji:'📦', label:'VOLUME',  val:Utils.formatVolume(data.volumeTotal),
          color:'#8bf0bb', x:560, y:310 },
        { emoji:'💪', label:'SÉRIES',  val:`${data.nbSeries}`,
          color:'#bfa1ff', x:80,  y:510 },
        { emoji:'🏆', label:'RECORDS', val:`${data.prs.length}`,
          color:'#f9ef77', x:560, y:510 }
      ];

      stats.forEach(s => {
        // Fond carte
        ctx.fillStyle = s.color + '15';
        ctx.strokeStyle = s.color + '44';
        ctx.lineWidth = 2;
        this._roundRectPNG(ctx, s.x, s.y, 440, 160, 20);
        ctx.fill();
        ctx.stroke();

        // Emoji
        ctx.font      = '42px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = s.color;
        ctx.fillText(s.emoji, s.x + 20, s.y + 55);

        // Valeur
        ctx.font      = 'bold 56px system-ui, sans-serif';
        ctx.fillStyle = s.color;
        ctx.fillText(s.val, s.x + 20, s.y + 115);

        // Label
        ctx.font      = '24px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(s.label, s.x + 20, s.y + 148);
      });

      // ── Barre objectif ──
      const objSem = Utils.storage.get('ft_objectif_seances_semaine',4);
      const pctObj = Math.min(100, (data.nbSeances/Math.max(objSem,1))*100);

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font      = '28px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `🎯 Objectif : ${data.nbSeances}/${objSem} séances`,
        80, 720
      );

      // Track
      ctx.beginPath();
      ctx.roundRect(80, 740, 920, 16, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();

      // Fill
      const gradObj = ctx.createLinearGradient(80, 0, 1000, 0);
      gradObj.addColorStop(0, '#4b4bf9');
      gradObj.addColorStop(1, '#8bf0bb');
      ctx.beginPath();
      ctx.roundRect(80, 740, Math.round(920 * pctObj/100), 16, 8);
      ctx.fillStyle = gradObj;
      ctx.shadowColor = '#4b4bf9';
      ctx.shadowBlur  = 12;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // ── Graphique volume barres ──
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font      = '28px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('📈 Volume par jour', 80, 820);

      const JOURS  = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dom'];
      const vols   = JOURS.map(j => data.volumeParJour[j]||0);
      const maxV   = Math.max(...vols, 1);
      const barW2  = 110, barGap = 30;
      const chartX = 80, chartY = 840;
      const chartH = 250;

      vols.forEach((v, i) => {
        const bH  = Math.max(4, Math.round(chartH * (v/maxV)));
        const x   = chartX + i * (barW2 + barGap);
        const y   = chartY + chartH - bH;
        const col = v > 0 ? '#4b4bf9' : 'rgba(255,255,255,0.06)';

        if (v > 0) {
          const bg = ctx.createLinearGradient(0, y, 0, y+bH);
          bg.addColorStop(0, col);
          bg.addColorStop(1, col+'44');
          ctx.fillStyle   = bg;
          ctx.shadowColor = col;
          ctx.shadowBlur  = 8;
        } else {
          ctx.fillStyle = col;
          ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.roundRect(x, y, barW2, bH, 6);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (v > 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.font      = '18px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(Utils.formatVolume(v), x + barW2/2, y - 8);
        }

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font      = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(JOURS[i], x + barW2/2, chartY + chartH + 30);
      });

      // ── Top 3 exercices ──
      if (data.topExoList.length > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font      = '28px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('🏆 Top exercices', 80, 1170);

        data.topExoList.slice(0,3).forEach((item, i) => {
          const y = 1195 + i * 100;
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          this._roundRectPNG(ctx, 80, y, 920, 80, 12);
          ctx.fill();
          ctx.stroke();

          const medal = i===0?'🥇':i===1?'🥈':'🥉';
          ctx.font      = '32px system-ui, sans-serif';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'left';
          ctx.fillText(medal, 100, y+52);

          ctx.font = 'bold 28px system-ui, sans-serif';
          ctx.fillText(
            `${item.ex.emoji||'💪'} ${item.ex.nom||item.ref}`,
            160, y+52
          );

          ctx.font      = '24px monospace';
          ctx.fillStyle = '#4b4bf9';
          ctx.textAlign = 'right';
          ctx.fillText(Utils.formatVolume(item.vol), 980, y+52);
        });
      }

      // ── PRs ──
      if (data.prs.length > 0) {
        const prY = data.topExoList.length > 0 ? 1500 : 1200;
        ctx.fillStyle = '#f9ef77';
        ctx.font      = 'bold 32px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`🏆 ${data.prs.length} nouveau${data.prs.length>1?'x':''} record${data.prs.length>1?'s':''}!`, 80, prY);

        data.prs.slice(0,2).forEach((pr, i) => {
          const ex = (window.EXERCICES||{})[pr.exerciceRef]||{};
          const y  = prY + 20 + i * 80;
          ctx.font      = '26px system-ui, sans-serif';
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText(`${ex.emoji||'💪'} ${ex.nom||pr.exerciceRef}`, 80, y);
          ctx.fillStyle = '#f9ef77';
          ctx.textAlign = 'right';
          ctx.fillText(`${pr.poids}kg × ${pr.reps}`, 980, y);
          ctx.textAlign = 'left';
        });
      }

      // ── Profil ──
      let profil = { nom:'Athlète', avatar:'💪' };
      let xp = { total:0, niveau:{ numero:1, nom:'Débutant' } };
      let streak = { count:0 };
      try { profil = Tracker.getProfil(); } catch(e) {}
      try { xp     = Gamification.getXP(); } catch(e) {}
      try { streak = Tracker.getStreak();  } catch(e) {}

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font      = '28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${profil.avatar} ${profil.nom} · Niv.${xp.niveau.numero} · ${xp.total} XP · 🔥 ${streak.count}j`,
        540, 1850
      );

      ctx.fillStyle = 'rgba(75,75,249,0.5)';
      ctx.font      = 'bold 22px monospace';
      ctx.fillText('powerapp.fitness', 540, 1885);

      // Télécharger
      const link    = document.createElement('a');
      link.download = `rapport-semaine-${data.debut}.png`;
      link.href     = canvas.toDataURL('image/png', 0.95);
      link.click();

      Utils.toast('✅ Rapport PNG téléchargé !', 'success', 3000);
      Utils.vibrerSuccess();

    } catch(e) {
      console.error('[Report] exporterPNG:', e);
      Utils.toast('❌ Erreur export', 'error');
    }
  },

  // ════════════════════════════════════════════════════════
  // EXPORT PDF (via HTML → Print)
  // ════════════════════════════════════════════════════════
  exporterPDF() {
    Utils.toast('📄 Génération du PDF...', 'info', 2000);

    const data = this._getDonneesSemaine(this._offsetActuel || 0);
    let profil = { nom:'Athlète', avatar:'💪' };
    let xp     = { total:0, niveau:{ numero:1 } };
    try { profil = Tracker.getProfil(); } catch(e) {}
    try { xp     = Gamification.getXP(); } catch(e) {}

    const objSem = Utils.storage.get('ft_objectif_seances_semaine', 4);
    const pct    = Math.min(100,
      Math.round((data.nbSeances/Math.max(objSem,1))*100)
    );

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport PowerApp — ${data.debut}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    font-family: system-ui, sans-serif;
    background: #fff;
    color: #1a1a2e;
    padding: 32px;
    max-width: 800px;
    margin: 0 auto;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 3px solid #4b4bf9;
    margin-bottom: 28px;
  }
  .header-logo {
    font-size: 1.8rem;
    font-weight: 900;
    color: #4b4bf9;
    letter-spacing: 2px;
  }
  .header-date {
    font-size: .85rem;
    color: #666;
    text-align: right;
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }
  .stat-card {
    padding: 16px 12px;
    border-radius: 12px;
    text-align: center;
    border: 2px solid;
  }
  .stat-val {
    font-size: 1.6rem;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-label {
    font-size: .65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: .6;
  }

  /* Section title */
  .section-title {
    font-size: 1rem;
    font-weight: 800;
    margin-bottom: 14px;
    margin-top: 24px;
    color: #4b4bf9;
    border-left: 4px solid #4b4bf9;
    padding-left: 10px;
  }

  /* Progress bar */
  .progress-wrap {
    background: #f0f0f0;
    border-radius: 99px;
    height: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4b4bf9, #8bf0bb);
    border-radius: 99px;
  }

  /* Table */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  th {
    background: #4b4bf9;
    color: white;
    padding: 8px 12px;
    text-align: left;
    font-size: .78rem;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  td {
    padding: 8px 12px;
    border-bottom: 1px solid #f0f0f0;
    font-size: .85rem;
  }
  tr:nth-child(even) td {
    background: #f8f8fc;
  }

  /* PR card */
  .pr-card {
    background: #fff9e6;
    border: 2px solid #f9ef77;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Footer */
  .footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    font-size: .72rem;
    color: #999;
  }

  @media print {
    body { padding: 16px; }
    @page { margin: 1cm; }
  }
</style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div>
      <div class="header-logo">⚡ PowerApp</div>
      <div style="font-size:.75rem;color:#666;margin-top:4px">
        Rapport hebdomadaire
      </div>
    </div>
    <div class="header-date">
      <div style="font-weight:700">${profil.avatar} ${profil.nom}</div>
      <div>Niveau ${xp.niveau.numero} · ${xp.total} XP</div>
      <div style="margin-top:4px;color:#4b4bf9">
        ${data.debut} → ${data.fin}
      </div>
    </div>
  </div>

  <!-- Stats principales -->
  <div class="stats-grid">
    ${[
      { val:`${data.nbSeances}/${objSem}`, label:'Séances',
        color:'#4b4bf9', bg:'#f0f0ff' },
      { val:Utils.formatVolume(data.volumeTotal), label:'Volume total',
        color:'#22c55e', bg:'#f0fff4' },
      { val:`${data.nbSeries}`, label:'Séries',
        color:'#7b00ff', bg:'#faf0ff' },
      { val:`${data.prs.length}`, label:'Records',
        color:'#ca8a04', bg:'#fffbeb' }
    ].map(s=>`
      <div class="stat-card"
           style="border-color:${s.color}33;background:${s.bg}">
        <div class="stat-val" style="color:${s.color}">${s.val}</div>
        <div class="stat-label" style="color:${s.color}">${s.label}</div>
      </div>`).join('')}
  </div>

  <!-- Objectif -->
  <div class="section-title">🎯 Objectif de la semaine</div>
  <div class="progress-wrap">
    <div class="progress-fill" style="width:${pct}%"></div>
  </div>
  <div style="font-size:.8rem;color:#666;margin-bottom:20px">
    ${data.nbSeances} séances réalisées sur ${objSem} prévues — ${pct}%
    ${pct >= 100 ? ' ✅ Objectif atteint !' : ''}
  </div>

  <!-- Volume par jour -->
  <div class="section-title">📈 Volume par jour</div>
  <table>
    <tr>
      ${['Lun','Mar','Mer','Jeu','Ven','Sam','Dom'].map(j=>`
        <th style="text-align:center">${j}</th>`).join('')}
    </tr>
    <tr>
      ${['Lun','Mar','Mer','Jeu','Ven','Sam','Dom'].map(j=>`
        <td style="text-align:center;
                   background:${(data.volumeParJour[j]||0)>0
                     ?'#f0f0ff':''};
                   font-weight:${(data.volumeParJour[j]||0)>0?'700':'400'};
                   color:${(data.volumeParJour[j]||0)>0?'#4b4bf9':'#ccc'}">
          ${Utils.formatVolume(data.volumeParJour[j]||0)}
        </td>`).join('')}
    </tr>
  </table>

  <!-- Top exercices -->
  ${data.topExoList.length > 0 ? `
    <div class="section-title">🏋️ Top exercices</div>
    <table>
      <tr>
        <th>#</th>
        <th>Exercice</th>
        <th>Séries</th>
        <th>Volume</th>
      </tr>
      ${data.topExoList.map((item, i)=>`
        <tr>
          <td>${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}</td>
          <td>${item.ex.emoji||'💪'} ${item.ex.nom||item.ref}</td>
          <td>${item.sets}</td>
          <td style="font-weight:700;color:#4b4bf9">
            ${Utils.formatVolume(item.vol)}
          </td>
        </tr>`).join('')}
    </table>` : ''}

  <!-- PRs -->
  ${data.prs.length > 0 ? `
    <div class="section-title">🏆 Nouveaux records</div>
    ${data.prs.map(pr=>{
      const ex = (window.EXERCICES||{})[pr.exerciceRef]||{};
      return `
        <div class="pr-card">
          <div>
            <div style="font-weight:700">
              ${ex.emoji||'💪'} ${ex.nom||pr.exerciceRef}
            </div>
            <div style="font-size:.72rem;color:#666">
              ${pr.date} · 1RM estimé ~${pr.rm1||'?'}kg
            </div>
          </div>
          <div style="font-weight:800;font-size:1.1rem;color:#ca8a04">
            ${pr.poids}kg × ${pr.reps}
          </div>
        </div>`;
    }).join('')}` : ''}

  <!-- RPE -->
  ${data.rpesMoyen > 0 ? `
    <div class="section-title">😤 Intensité moyenne</div>
    <div style="display:flex;align-items:center;gap:16px;
                padding:14px;background:#f8f8fc;
                border-radius:10px;margin-bottom:20px">
      <div style="font-size:2rem;font-weight:800;
                  color:${data.rpesMoyen>=8?'#ef4444'
                    :data.rpesMoyen>=6?'#ca8a04':'#22c55e'}">
        ${data.rpesMoyen}/10
      </div>
      <div style="font-size:.82rem;color:#666">
        ${data.rpesMoyen >= 8
          ? '🔥 Intensité élevée — bien récupérer cette semaine'
          : data.rpesMoyen >= 6
            ? '💪 Bonne intensité — continue sur ta lancée'
            : '😊 Intensité modérée — tu peux aller un peu plus fort'}
      </div>
    </div>` : ''}

  <!-- Footer -->
  <div class="footer">
    <div>⚡ PowerApp · powerapp.fitness</div>
    <div>Généré le ${new Date().toLocaleDateString('fr-FR')}</div>
  </div>

</body>
</html>`;

    // ✅ Ouvrir dans nouvelle fenêtre + Print
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      win.print();
    }, 500);

    Utils.toast('✅ Rapport ouvert — Lance l\'impression !', 'success', 4000);
  },

  // ════════════════════════════════════════════════════════
  // EXPORT JSON
  // ════════════════════════════════════════════════════════
  exporterJSON() {
    const data = this._getDonneesSemaine(this._offsetActuel || 0);

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `powerapp-rapport-${data.debut}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    Utils.toast('📊 Données JSON exportées !', 'success', 2000);
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _roundRectPNG(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }
};

window.Report = Report;
console.log('✅ Report.js v1.0 chargé');
