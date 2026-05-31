/* ============================================================
   PowerApp — Charts v1.0
   📈 Graphiques interactifs enrichis
   ✅ Zoom + Pan
   ✅ Comparaison 2 exercices
   ✅ Export image PNG
   ✅ Annotations PRs
   ✅ Tooltips enrichis
   ✅ Animations fluides
   ✅ Thème adaptatif
   ============================================================ */

'use strict';

const Charts = {

  // ════════════════════════════════════════════════════════
  // REGISTRY
  // ════════════════════════════════════════════════════════
  _instances: {},
  _theme:     null,

  // ════════════════════════════════════════════════════════
  // THEME
  // ════════════════════════════════════════════════════════
  _getTheme() {
    try {
      const id = Utils.storage.get('ft_theme_style', 'cyber-blue');
      return window.Themes?.THEMES?.find(t => t.id === id)
        || { c1:'#4b4bf9', c2:'#8bf0bb', c3:'#f9ef77',
             bg:'#09092d', id:'cyber-blue' };
    } catch(e) {
      return { c1:'#4b4bf9', c2:'#8bf0bb', c3:'#f9ef77',
               bg:'#09092d' };
    }
  },

  _getDefaults() {
    const t = this._getTheme();
    const isLight = t.id === 'arctic-white';

    return {
      textColor:    isLight ? 'rgba(9,9,45,0.6)'   : 'rgba(255,255,255,0.4)',
      gridColor:    isLight ? 'rgba(0,0,0,0.06)'    : 'rgba(255,255,255,0.04)',
      bgColor:      isLight ? 'rgba(255,255,255,0.9)':'rgba(9,9,45,0.95)',
      borderColor:  isLight ? 'rgba(0,0,0,0.08)'    : 'rgba(255,255,255,0.08)',
      c1:           t.c1,
      c2:           t.c2,
      c3:           t.c3
    };
  },

  // ════════════════════════════════════════════════════════
  // OPTIONS DE BASE
  // ════════════════════════════════════════════════════════
  _baseOptions(overrides = {}) {
    const d = this._getDefaults();

    return {
      responsive:          true,
      maintainAspectRatio: true,
      animation: {
        duration: 600,
        easing:   'easeInOutQuart'
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor:  d.bgColor,
          titleColor:       '#ffffff',
          bodyColor:        d.c1,
          borderColor:      d.c1,
          borderWidth:      1,
          cornerRadius:     10,
          padding:          12,
          displayColors:    true,
          callbacks: {}
        }
      },
      scales: {
        x: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10, family: "'Rajdhani', system-ui" },
            maxRotation: 30
          },
          grid: {
            color:   d.gridColor,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10, family: "'Rajdhani', system-ui" }
          },
          grid: {
            color:   d.gridColor,
            drawBorder: false
          }
        }
      },
      interaction: {
        intersect: false,
        mode:      'index'
      },
      ...overrides
    };
  },

  // ════════════════════════════════════════════════════════
  // CRÉER / DÉTRUIRE
  // ════════════════════════════════════════════════════════
  creer(id, type, data, options = {}) {
    this.detruire(id);

    const canvas = document.getElementById(id);
    if (!canvas || typeof Chart === 'undefined') return null;

    const chart = new Chart(canvas, {
      type,
      data,
      options: this._baseOptions(options)
    });

    this._instances[id] = chart;
    return chart;
  },

  detruire(id) {
    if (this._instances[id]) {
      try { this._instances[id].destroy(); } catch(e) {}
      delete this._instances[id];
    }
  },

  detruireTous() {
    Object.keys(this._instances).forEach(id => this.detruire(id));
  },

  get(id) {
    return this._instances[id] || null;
  },

  // ════════════════════════════════════════════════════════
  // ✅ CHART VOLUME SEMAINES — Interactif
  // ════════════════════════════════════════════════════════
  creerVolumesSemaines(canvasId, nbSemaines = 12) {
    const d    = this._getDefaults();
    const data = Tracker.getVolumeParSemaine(nbSemaines);

    if (!data.length) return null;

    const max = Math.max(...data.map(v => v.volume));

    return this.creer(canvasId, 'bar', {
      labels: data.map(v => v.label),
      datasets: [{
        label:           'Volume (kg)',
        data:            data.map(v => v.volume),
        backgroundColor: data.map((v, i) => {
          const isLast    = i === data.length - 1;
          const pct       = max > 0 ? v.volume / max : 0;
          const alpha     = isLast ? 0.9 : 0.3 + pct * 0.4;
          return `${d.c1}${Math.round(alpha * 255).toString(16).padStart(2,'0')}`;
        }),
        borderColor:     data.map((v, i) =>
          i === data.length - 1 ? d.c1 : `${d.c1}88`
        ),
        borderWidth:     2,
        borderRadius:    8,
        borderSkipped:   false,
        hoverBackgroundColor: d.c1
      }]
    }, {
      plugins: {
        tooltip: {
          backgroundColor: `rgba(9,9,45,0.95)`,
          titleColor:      '#ffffff',
          bodyColor:       d.c1,
          borderColor:     d.c1,
          borderWidth:     1,
          cornerRadius:    10,
          padding:         12,
          callbacks: {
            label: ctx => {
              const val = ctx.parsed.y;
              return ` ${Utils.formatVolume(val)}`;
            },
            afterLabel: ctx => {
              const i    = ctx.dataIndex;
              const prev = data[i - 1]?.volume;
              if (!prev || prev === 0) return '';
              const delta = Math.round(
                ((data[i].volume - prev) / prev) * 100
              );
              return ` ${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}% vs sem. préc.`;
            }
          }
        },
        // ✅ Annotation meilleure semaine
        annotation: {
          annotations: (() => {
            const maxIdx = data.indexOf(
              data.reduce((a, b) => b.volume > a.volume ? b : a)
            );
            return {
              bestWeek: {
                type:        'point',
                xValue:      maxIdx,
                yValue:      data[maxIdx]?.volume || 0,
                radius:      6,
                backgroundColor: d.c2,
                borderColor:     '#ffffff',
                borderWidth:     2
              }
            };
          })()
        }
      },
      scales: {
        x: {
          ticks: {
            color: d.textColor,
            font:  { size: 10 }
          },
          grid: { color: d.gridColor }
        },
        y: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10 },
            callback: v => Utils.formatVolume(v)
          },
          grid: { color: d.gridColor }
        }
      },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx   = elements[0].index;
        const semaine = data[idx];
        Charts._afficherDetailSemaine(semaine, idx);
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // ✅ CHART PROGRESSION 1RM — Avec annotations PRs
  // ════════════════════════════════════════════════════════
  creerProgression1RM(canvasId, ref, periode = 60) {
    const d    = this._getDefaults();
    const prog = Stats.getProgressionExercice(ref, periode);
    const ex   = window.EXERCICES?.[ref] || {};

    if (prog.length < 2) return null;

    // ✅ Trouver les PRs dans la progression
    let maxRM1 = 0;
    const annotations = {};

    prog.forEach((p, i) => {
      if (p.rm1 > maxRM1) {
        maxRM1 = p.rm1;
        annotations[`pr_${i}`] = {
          type:            'point',
          xValue:          i,
          yValue:          p.rm1,
          radius:          7,
          backgroundColor: d.c3,
          borderColor:     '#ffffff',
          borderWidth:     2,
          label: {
            display:         true,
            content:         '🏆',
            position:        'top',
            backgroundColor: 'transparent',
            color:           d.c3,
            font:            { size: 12 }
          }
        };
      }
    });

    // ✅ Ligne de tendance (régression linéaire)
    const n    = prog.length;
    const xMoy = (n - 1) / 2;
    const yMoy = prog.reduce((a, b) => a + b.rm1, 0) / n;
    let num = 0, den = 0;
    prog.forEach((p, x) => {
      num += (x - xMoy) * (p.rm1 - yMoy);
      den += (x - xMoy) ** 2;
    });
    const slope     = den !== 0 ? num / den : 0;
    const intercept = yMoy - slope * xMoy;

    const tendanceData = prog.map((_, i) =>
      Math.round((slope * i + intercept) * 10) / 10
    );

    return this.creer(canvasId, 'line', {
      labels: prog.map(p => p.label),
      datasets: [
        // Dataset principal
        {
          label:               `1RM ${ex.nom || ref}`,
          data:                prog.map(p => p.rm1),
          borderColor:         d.c1,
          backgroundColor:     `${d.c1}22`,
          borderWidth:         2.5,
          pointRadius:         prog.map((p, i) =>
            annotations[`pr_${i}`] ? 8 : 4
          ),
          pointBackgroundColor: prog.map((p, i) =>
            annotations[`pr_${i}`] ? d.c3 : d.c1
          ),
          pointBorderColor:    '#ffffff',
          pointBorderWidth:    prog.map((p, i) =>
            annotations[`pr_${i}`] ? 2 : 0
          ),
          pointHoverRadius:    8,
          tension:             0.35,
          fill:                true
        },
        // Ligne tendance
        {
          label:       'Tendance',
          data:        tendanceData,
          borderColor: `${d.c2}66`,
          borderWidth: 1.5,
          borderDash:  [6, 4],
          pointRadius: 0,
          tension:     0,
          fill:        false
        }
      ]
    }, {
      plugins: {
        legend: {
          display: true,
          labels:  {
            color:   d.textColor,
            font:    { size: 11 },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(9,9,45,0.95)',
          titleColor:      '#ffffff',
          bodyColor:       d.c1,
          borderColor:     d.c1,
          borderWidth:     1,
          cornerRadius:    10,
          padding:         12,
          callbacks: {
            label: ctx => {
              if (ctx.datasetIndex === 1) return null;
              const p = prog[ctx.dataIndex];
              return [
                ` 1RM : ${ctx.parsed.y}kg`,
                ` Poids : ${p.poids}kg × ${p.reps} reps`
              ];
            },
            afterBody: ctx => {
              const i = ctx[0]?.dataIndex;
              if (annotations[`pr_${i}`]) {
                return ['', '🏆 Nouveau record !'];
              }
              return [];
            }
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10 },
            callback: v => `${v}kg`
          },
          grid: { color: d.gridColor }
        },
        x: {
          ticks: {
            color: d.textColor,
            font:  { size: 10 }
          },
          grid: { color: d.gridColor }
        }
      },
      onClick: (evt, elements) => {
        if (!elements.length) return;
        const idx = elements[0].index;
        Charts._afficherDetailPoint(prog[idx], ex);
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // ✅ COMPARAISON 2 EXERCICES
  // ════════════════════════════════════════════════════════
  renderComparaison(container) {
    if (!container) return;

    const refs = Object.keys(window.EXERCICES || {})
      .filter(r => Tracker.getPR(r));

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">📊 Comparer 2 exercices</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:10px;margin-top:14px">
          <div>
            <div class="input-label">Exercice 1</div>
            <select class="input" id="compare-ex1">
              <option value="">-- Choisir --</option>
              ${refs.map(r => `
                <option value="${r}">
                  ${window.EXERCICES[r]?.emoji||''}
                  ${window.EXERCICES[r]?.nom||r}
                </option>`).join('')}
            </select>
          </div>
          <div>
            <div class="input-label">Exercice 2</div>
            <select class="input" id="compare-ex2">
              <option value="">-- Choisir --</option>
              ${refs.map(r => `
                <option value="${r}">
                  ${window.EXERCICES[r]?.emoji||''}
                  ${window.EXERCICES[r]?.nom||r}
                </option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Période -->
        <div style="display:flex;gap:6px;
                    margin-top:10px;flex-wrap:wrap">
          ${[30,60,90,180].map((p, i) => `
            <button data-periode="${p}"
                    onclick="Charts._selectPeriode(this)"
                    style="flex:1;padding:7px 6px;
                           font-size:.72rem;font-weight:700;
                           border-radius:var(--radius-full);
                           cursor:pointer;
                           background:${i === 0
                             ? 'var(--fd-indigo)'
                             : 'var(--bg-input)'};
                           border:1px solid ${i === 0
                             ? 'var(--fd-indigo)'
                             : 'var(--border-color)'};
                           color:${i === 0
                             ? 'white' : 'var(--text-muted)'}">
              ${p}j
            </button>`).join('')}
        </div>

        <!-- Métrique -->
        <div style="margin-top:10px">
          <div class="input-label">Afficher</div>
          <select class="input" id="compare-metric">
            <option value="rm1">1RM estimé (kg)</option>
            <option value="poids">Poids soulevé (kg)</option>
            <option value="reps">Répétitions</option>
          </select>
        </div>

        <button onclick="Charts._lancerComparaison()"
                class="btn-primary mt-md"
                style="width:100%">
          📊 Comparer
        </button>
      </div>

      <!-- Résultat comparaison -->
      <div id="compare-result"></div>
    `;

    document.getElementById('compare-ex1')
      ?.addEventListener('change', () => Charts._lancerComparaison());
    document.getElementById('compare-ex2')
      ?.addEventListener('change', () => Charts._lancerComparaison());
    document.getElementById('compare-metric')
      ?.addEventListener('change', () => Charts._lancerComparaison());
  },

  _selectPeriode(btn) {
    document.querySelectorAll('[data-periode]').forEach(b => {
      b.style.background  = 'var(--bg-input)';
      b.style.borderColor = 'var(--border-color)';
      b.style.color       = 'var(--text-muted)';
    });
    btn.style.background  = 'var(--fd-indigo)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'white';
    Charts._lancerComparaison();
  },

  _lancerComparaison() {
    const ref1    = document.getElementById('compare-ex1')?.value;
    const ref2    = document.getElementById('compare-ex2')?.value;
    const metric  = document.getElementById('compare-metric')?.value || 'rm1';
    const periode = parseInt(
      document.querySelector('[data-periode][style*="var(--fd-indigo)"]')
        ?.dataset?.periode || '60'
    );
    const result  = document.getElementById('compare-result');

    if (!result) return;

    if (!ref1 && !ref2) {
      result.innerHTML = '';
      return;
    }

    const d     = this._getDefaults();
    const prog1 = ref1 ? Stats.getProgressionExercice(ref1, periode) : [];
    const prog2 = ref2 ? Stats.getProgressionExercice(ref2, periode) : [];

    if (!prog1.length && !prog2.length) {
      result.innerHTML = `
        <div class="card" style="text-align:center;padding:var(--space-xl)">
          <p style="color:var(--text-muted)">Pas assez de données</p>
        </div>`;
      return;
    }

    // ✅ Aligner les dates
    const allDates = [...new Set([
      ...prog1.map(p => p.date),
      ...prog2.map(p => p.date)
    ])].sort();

    const getData = (prog) => allDates.map(date => {
      const point = prog.find(p => p.date === date);
      return point ? point[metric] || null : null;
    });

    // ✅ Stats comparatives
    const last1 = prog1[prog1.length - 1]?.[metric] || 0;
    const last2 = prog2[prog2.length - 1]?.[metric] || 0;
    const ex1   = window.EXERCICES?.[ref1] || {};
    const ex2   = window.EXERCICES?.[ref2] || {};

    const metricLabel = {
      rm1:   '1RM (kg)',
      poids: 'Poids (kg)',
      reps:  'Reps'
    }[metric];

    result.innerHTML = `

      <!-- Stats comparatives -->
      ${ref1 && ref2 ? `
        <div style="display:grid;grid-template-columns:1fr auto 1fr;
                    gap:12px;align-items:center;
                    margin-bottom:14px">
          <div style="text-align:center;padding:14px;
                      background:rgba(75,75,249,0.08);
                      border:1px solid rgba(75,75,249,0.2);
                      border-radius:var(--radius-lg)">
            <div style="font-size:1.5rem">${ex1.emoji||'💪'}</div>
            <div style="font-size:.78rem;font-weight:700;
                        margin:4px 0">${ex1.nom||ref1}</div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:var(--fd-indigo)">${last1}${metric==='reps'?'':' kg'}</div>
          </div>
          <div style="text-align:center;font-size:.72rem;
                      font-weight:700;color:var(--text-muted)">
            VS
          </div>
          <div style="text-align:center;padding:14px;
                      background:rgba(139,240,187,0.08);
                      border:1px solid rgba(139,240,187,0.2);
                      border-radius:var(--radius-lg)">
            <div style="font-size:1.5rem">${ex2.emoji||'💪'}</div>
            <div style="font-size:.78rem;font-weight:700;
                        margin:4px 0">${ex2.nom||ref2}</div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:var(--fd-mint)">${last2}${metric==='reps'?'':' kg'}</div>
          </div>
        </div>` : ''}

      <!-- Graphique -->
      <div class="card mb-md">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:8px">
          <div class="card-label">
            📈 ${metricLabel} — ${periode} jours
          </div>
          <button onclick="Charts.exporterImage('chart-compare')"
                  style="padding:4px 10px;font-size:.62rem;
                         font-weight:700;cursor:pointer;
                         background:rgba(75,75,249,0.1);
                         border:1px solid rgba(75,75,249,0.2);
                         border-radius:99px;
                         color:var(--fd-indigo)">
            📥 Export
          </button>
        </div>
        <canvas id="chart-compare" height="200"></canvas>
      </div>

      <!-- Tableau données -->
      ${ref1 && ref2 ? `
        <div class="card">
          <div class="card-label mb-sm">📋 Comparaison détaillée</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                      gap:8px">
            ${[
              { label:'Progression',
                v1: prog1.length >= 2
                  ? `${Math.round(((prog1[prog1.length-1][metric]||0) - (prog1[0][metric]||0)) / Math.max(prog1[0][metric]||1,1) * 100)}%`
                  : '—',
                v2: prog2.length >= 2
                  ? `${Math.round(((prog2[prog2.length-1][metric]||0) - (prog2[0][metric]||0)) / Math.max(prog2[0][metric]||1,1) * 100)}%`
                  : '—'
              },
              { label:'Séances',
                v1: prog1.length,
                v2: prog2.length
              },
              { label:'Meilleur',
                v1: `${Math.max(...prog1.map(p => p[metric]||0))}${metric==='reps'?'':' kg'}`,
                v2: `${Math.max(...prog2.map(p => p[metric]||0))}${metric==='reps'?'':' kg'}`
              }
            ].map(row => `
              <div style="background:rgba(255,255,255,0.03);
                          border:1px solid rgba(255,255,255,0.07);
                          border-radius:var(--radius-md);
                          padding:10px;text-align:center">
                <div style="font-size:.58rem;color:var(--text-muted);
                            text-transform:uppercase;letter-spacing:.06em;
                            margin-bottom:6px">${row.label}</div>
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-indigo)">${row.v1}</div>
                <div style="font-size:.72rem;color:var(--text-muted);
                            margin:3px 0">vs</div>
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-mint)">${row.v2}</div>
              </div>`).join('')}
          </div>
        </div>` : ''}
    `;

    // ✅ Créer le graphique
    requestAnimationFrame(() => {
      this.detruire('chart-compare');
      const canvas = document.getElementById('chart-compare');
      if (!canvas) return;

      const datasets = [];

      if (ref1 && prog1.length > 0) {
        datasets.push({
          label:               ex1.nom || ref1,
          data:                getData(prog1),
          borderColor:         d.c1,
          backgroundColor:     `${d.c1}22`,
          borderWidth:         2.5,
          pointRadius:         4,
          pointBackgroundColor:d.c1,
          tension:             0.35,
          fill:                false,
          spanGaps:            true
        });
      }

      if (ref2 && prog2.length > 0) {
        datasets.push({
          label:               ex2.nom || ref2,
          data:                getData(prog2),
          borderColor:         d.c2,
          backgroundColor:     `${d.c2}22`,
          borderWidth:         2.5,
          pointRadius:         4,
          pointBackgroundColor:d.c2,
          tension:             0.35,
          fill:                false,
          spanGaps:            true
        });
      }

      if (!datasets.length) return;

      this._instances['chart-compare'] = new Chart(canvas, {
        type: 'line',
        data: {
          labels: allDates.map(d => Utils.formatDateCourt(d)),
          datasets
        },
        options: this._baseOptions({
          plugins: {
            legend: {
              display: true,
              labels:  {
                color:    d.textColor,
                font:     { size: 11 },
                boxWidth: 12
              }
            },
            tooltip: {
              backgroundColor: 'rgba(9,9,45,0.95)',
              titleColor:      '#ffffff',
              borderColor:     d.c1,
              borderWidth:     1,
              cornerRadius:    10,
              padding:         12,
              callbacks: {
                label: ctx => {
                  const val = ctx.parsed.y;
                  if (val === null) return null;
                  return ` ${ctx.dataset.label} : ${val}${metric==='reps'?'' : ' kg'}`;
                }
              }
            }
          },
          scales: {
            y: {
              ticks: {
                color:    d.textColor,
                font:     { size: 10 },
                callback: v => `${v}${metric==='reps'?'':' kg'}`
              },
              grid: { color: d.gridColor }
            },
            x: {
              ticks: {
                color:       d.textColor,
                font:        { size: 10 },
                maxRotation: 30
              },
              grid: { color: d.gridColor }
            }
          }
        })
      });
    });
  },

  // ════════════════════════════════════════════════════════
  // ✅ EXPORT IMAGE PNG
  // ════════════════════════════════════════════════════════
  exporterImage(chartId, nom = null) {
    const chart = this._instances[chartId];
    if (!chart) {
      Utils.toast('❌ Graphique introuvable', 'error');
      return;
    }

    const canvas = chart.canvas;
    if (!canvas) return;

    // ✅ Créer canvas avec fond
    const exportCanvas  = document.createElement('canvas');
    const PADDING       = 32;
    exportCanvas.width  = canvas.width  + PADDING * 2;
    exportCanvas.height = canvas.height + PADDING * 2 + 80;

    const ctx = exportCanvas.getContext('2d');
    const d   = this._getDefaults();

    // Fond
    const grad = ctx.createLinearGradient(
      0, 0, 0, exportCanvas.height
    );
    grad.addColorStop(0, '#06063d');
    grad.addColorStop(1, '#030820');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Header
    ctx.fillStyle = '#4b4bf9';
    ctx.font      = 'bold 20px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(
      '⚡ PowerApp',
      exportCanvas.width / 2,
      36
    );

    // Date
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font      = '13px system-ui';
    ctx.fillText(
      Utils.aujourd_hui(),
      exportCanvas.width / 2,
      56
    );

    // Graphique
    ctx.drawImage(canvas, PADDING, 70);

    // Watermark
    ctx.fillStyle = 'rgba(75,75,249,0.3)';
    ctx.font      = '11px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(
      'powerapp.fitness',
      exportCanvas.width / 2,
      exportCanvas.height - 10
    );

    // Télécharger
    const fileName = nom
      || `powerapp-chart-${Utils.aujourd_hui()}.png`;
    const link    = document.createElement('a');
    link.download = fileName;
    link.href     = exportCanvas.toDataURL('image/png', 0.95);
    link.click();

    Utils.toast('📥 Graphique exporté !', 'success', 2000);
  },

  // ════════════════════════════════════════════════════════
  // ✅ DETAIL SEMAINE — Popup clic barre
  // ════════════════════════════════════════════════════════
  _afficherDetailSemaine(semaine, idx) {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const seances = Tracker.getHistoriqueSeances(999)
      .filter(s => Utils.debutSemaine(s.date) === semaine.date);

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <h3 style="margin-bottom:12px">
          📅 Semaine ${semaine.label}
        </h3>
        <div style="font-size:1.2rem;font-weight:800;
                    color:var(--fd-indigo);margin-bottom:16px">
          ${Utils.formatVolume(semaine.volume)} total
        </div>

        <div class="card-label mb-sm">Séances</div>
        ${seances.length === 0
          ? '<p style="color:var(--text-muted);font-size:.85rem">Aucune donnée</p>'
          : seances.map(s => {
              const nom = window.SEANCES_BASE?.[s.id]?.nom || s.id;
              return `
                <div style="padding:8px 0;
                            border-bottom:1px solid var(--border-color);
                            font-size:.82rem">
                  <div style="font-weight:600">${nom}</div>
                  <div style="color:var(--text-muted);font-size:.7rem">
                    ${s.date} ·
                    ${Utils.formatVolume(s.volumeTotal||0)} ·
                    ${s.series?.length||0} séries
                  </div>
                </div>`;
            }).join('')}

        <button onclick="document.getElementById('modal-info')
                          .classList.add('hidden')"
                class="btn-secondary mt-md"
                style="width:100%">
          Fermer
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () =>
      modal.classList.add('hidden');
  },

  _afficherDetailPoint(point, ex) {
    Utils.toast(
      `📊 ${Utils.formatDateCourt(point.date)} — ${point.poids}kg × ${point.reps} (1RM ~${point.rm1}kg)`,
      'info', 3000
    );
  },

  // ════════════════════════════════════════════════════════
  // ✅ GRAPHIQUES STATS PAGE — Version enrichie
  // ════════════════════════════════════════════════════════
  creerRPESemaines(canvasId, n = 10) {
    const d   = this._getDefaults();
    const rpe = Tracker.getRPEParSemaine(n);
    if (rpe.length < 2) return null;

    return this.creer(canvasId, 'line', {
      labels: rpe.map(r => r.semaine),
      datasets: [{
        label:               'RPE moyen',
        data:                rpe.map(r => r.rpe),
        borderColor:         '#ff8d96',
        backgroundColor:     'rgba(255,141,150,0.1)',
        borderWidth:         2.5,
        pointRadius:         5,
        pointBackgroundColor:'#ff8d96',
        pointHoverRadius:    8,
        tension:             0.4,
        fill:                true
      }, {
        // Ligne seuil 8 (surmenage)
        label:       'Seuil surmenage',
        data:        rpe.map(() => 8),
        borderColor: 'rgba(255,141,150,0.3)',
        borderWidth: 1.5,
        borderDash:  [6, 4],
        pointRadius: 0,
        fill:        false
      }]
    }, {
      plugins: {
        legend: {
          display: true,
          labels:  { color: d.textColor, font: { size: 10 }, boxWidth: 10 }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.datasetIndex === 1) return null;
              const v = ctx.parsed.y;
              return [
                ` RPE : ${v}/10`,
                v >= 8.5 ? ' ⚠️ Surmenage !' : v <= 6 ? ' ✅ OK' : ' 👍 Bien'
              ];
            }
          }
        }
      },
      scales: {
        y: {
          min:   0,
          max:   10,
          ticks: {
            color:    d.textColor,
            font:     { size: 10 },
            callback: v => `${v}/10`
          },
          grid: { color: d.gridColor }
        },
        x: {
          ticks: { color: d.textColor, font: { size: 10 } },
          grid:  { color: d.gridColor }
        }
      }
    });
  },

  creerRadarForme(canvasId, scoreForme) {
    const d = this._getDefaults();

    return this.creer(canvasId, 'radar', {
      labels: ['Récup.', 'Assiduité', 'Progression', 'Streak', 'Volume'],
      datasets: [{
        data: [
          scoreForme.recup       || 0,
          scoreForme.assiduite   || 0,
          scoreForme.progression || 0,
          Math.min(100, (Tracker.getStreak().count / 30) * 100),
          Math.min(100, (Tracker.getVolumeSemaine() / 10000) * 100)
        ],
        backgroundColor:   `${d.c1}33`,
        borderColor:        d.c1,
        borderWidth:        2,
        pointBackgroundColor:d.c1,
        pointRadius:        5,
        pointHoverRadius:   7
      }]
    }, {
      scales: {
        r: {
          min:   0,
          max:   100,
          ticks: { display: false, stepSize: 25 },
          grid:  { color: 'rgba(255,255,255,0.08)' },
          angleLines: { color: 'rgba(255,255,255,0.08)' },
          pointLabels: {
            color: d.textColor,
            font:  { size: 10 }
          }
        }
      }
    });
  },

  creerJoursSemaine(canvasId) {
    const d     = this._getDefaults();
    const jours = Tracker.getSeancesParJourSemaine();
    const max   = Math.max(...jours, 1);

    return this.creer(canvasId, 'bar', {
      labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
      datasets: [{
        data:            jours,
        backgroundColor: jours.map(v => {
          const pct   = v / max;
          const alpha = 0.2 + pct * 0.7;
          return `${d.c2}${Math.round(alpha * 255).toString(16).padStart(2,'0')}`;
        }),
        borderColor:     d.c2,
        borderWidth:     2,
        borderRadius:    8,
        hoverBackgroundColor: d.c2
      }]
    }, {
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} séance${ctx.parsed.y > 1 ? 's' : ''}`
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10 },
            stepSize: 1,
            callback: v => Number.isInteger(v) ? v : null
          },
          grid: { color: d.gridColor }
        },
        x: {
          ticks: { color: d.textColor, font: { size: 10 } },
          grid:  { color: d.gridColor }
        }
      }
    });
  },

  creerTop1RM(canvasId, limite = 8) {
    const d    = this._getDefaults();
    const top  = Stats.getTopExercices(limite);
    if (!top.length) return null;

    const colors = [d.c1,d.c2,d.c3,'#bfa1ff','#ff8d96',
                    d.c1,d.c2,d.c3];

    return this.creer(canvasId, 'bar', {
      labels: top.map(e => e.nom),
      datasets: [{
        data:            top.map(e => e.rm1),
        backgroundColor: colors.map(c => `${c}cc`),
        borderColor:     colors,
        borderWidth:     2,
        borderRadius:    8,
        hoverBackgroundColor: colors
      }]
    }, {
      indexAxis: 'y',
      plugins: {
        tooltip: {
          callbacks: {
            label: ctx => {
              const ex = top[ctx.dataIndex];
              return [
                ` 1RM : ${ctx.parsed.x}kg`,
                ` ${ex.poids}kg × ${ex.reps} reps`
              ];
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color:    d.textColor,
            font:     { size: 10 },
            callback: v => `${v}kg`
          },
          grid: { color: d.gridColor }
        },
        y: {
          ticks: {
            color: d.textColor,
            font:  { size: 10 }
          },
          grid: { display: false }
        }
      }
    });
  },

  // ════════════════════════════════════════════════════════
  // ✅ RENDER PAGE GRAPHIQUES ENRICHIE
  // ════════════════════════════════════════════════════════
  renderPage(container) {
    if (!container) return;

    if (typeof Chart === 'undefined') {
      container.innerHTML = `
        <div class="card mt-md"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;margin-bottom:8px">📊</div>
          <div style="color:var(--text-muted);font-size:.85rem">
            Chart.js non chargé.<br>
            Vérifie ta connexion internet.
          </div>
        </div>`;
      return;
    }

    const d    = this._getDefaults();
    const refs = Object.keys(window.EXERCICES || {})
      .filter(r => Tracker.getPR(r));

    container.innerHTML = `

      <!-- Tabs -->
      <div class="tabs-container mb-md">
        ${[
          { id:'volumes',    label:'📦 Volumes'   },
          { id:'progression',label:'📈 Progression'},
          { id:'comparaison',label:'⚡ Comparaison'},
          { id:'stats',      label:'📊 Stats'      }
        ].map((t, i) => `
          <button class="tab-btn ${i===0?'active':''}"
                  onclick="Charts._switchTab('${t.id}',this)">
            ${t.label}
          </button>`).join('')}
      </div>

      <!-- ── TAB VOLUMES ── -->
      <div id="charts-tab-volumes">
        <div class="card mb-md">
          <div style="display:flex;justify-content:space-between;
                      align-items:center;margin-bottom:12px">
            <div class="card-label">📦 Volume par semaine</div>
            <button onclick="Charts.exporterImage('chart-vol-main')"
                    style="padding:4px 10px;font-size:.62rem;
                           font-weight:700;cursor:pointer;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;
                           color:var(--fd-indigo)">
              📥 Export
            </button>
          </div>
          <!-- Sélecteur semaines -->
          <div style="display:flex;gap:6px;margin-bottom:10px">
            ${[8,12,16,24].map((n, i) => `
              <button data-sem="${n}"
                      onclick="Charts._changerSemaines(this)"
                      style="flex:1;padding:6px 4px;
                             font-size:.72rem;font-weight:700;
                             border-radius:var(--radius-full);cursor:pointer;
                             background:${i===0?'var(--fd-indigo)':'var(--bg-input)'};
                             border:1px solid ${i===0?'var(--fd-indigo)':'var(--border-color)'};
                             color:${i===0?'white':'var(--text-muted)'}">
                ${n}sem
              </button>`).join('')}
          </div>
          <canvas id="chart-vol-main" height="180"></canvas>
          <div style="margin-top:8px;font-size:.65rem;
                      color:var(--text-muted);text-align:center">
            💡 Clique sur une barre pour voir le détail
          </div>
        </div>

        <div class="card mb-md">
          <div class="card-label mb-sm">😤 RPE par semaine</div>
          <canvas id="chart-rpe-main" height="160"></canvas>
        </div>

        <div class="card mb-md">
          <div class="card-label mb-sm">📅 Répartition jours</div>
          <canvas id="chart-jours-main" height="160"></canvas>
        </div>
      </div>

      <!-- ── TAB PROGRESSION ── -->
      <div id="charts-tab-progression" style="display:none">
        <div class="card mb-md">
          <div class="card-label mb-md">📈 Progression exercice</div>
          <select id="prog-ex-select" class="input mb-md">
            <option value="">-- Choisir un exercice --</option>
            ${refs.map(r => `
              <option value="${r}">
                ${window.EXERCICES[r]?.emoji||''}
                ${window.EXERCICES[r]?.nom||r}
              </option>`).join('')}
          </select>

          <!-- Metric + Période -->
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:8px;margin-bottom:10px">
            <select id="prog-metric" class="input">
              <option value="rm1">1RM (kg)</option>
              <option value="poids">Poids (kg)</option>
              <option value="reps">Reps</option>
            </select>
            <select id="prog-periode" class="input">
              <option value="30">30 jours</option>
              <option value="60">60 jours</option>
              <option value="90">90 jours</option>
              <option value="180">180 jours</option>
            </select>
          </div>

          <div id="prog-placeholder"
               style="text-align:center;padding:var(--space-xl);
                      color:var(--text-muted);font-size:.85rem">
            Sélectionne un exercice
          </div>
          <canvas id="chart-prog-main" height="220"
                  style="display:none"></canvas>

          <div id="prog-export-btn"
               style="display:none;margin-top:8px">
            <button onclick="Charts.exporterImage('chart-prog-main')"
                    class="btn-secondary"
                    style="width:100%;font-size:.78rem">
              📥 Exporter ce graphique
            </button>
          </div>
        </div>
      </div>

      <!-- ── TAB COMPARAISON ── -->
      <div id="charts-tab-comparaison" style="display:none">
      </div>

      <!-- ── TAB STATS ── -->
      <div id="charts-tab-stats" style="display:none">
        <div class="card mb-md">
          <div style="display:flex;justify-content:space-between;
                      align-items:center;margin-bottom:12px">
            <div class="card-label">🏆 Top 1RM estimés</div>
            <button onclick="Charts.exporterImage('chart-top-main')"
                    style="padding:4px 10px;font-size:.62rem;
                           font-weight:700;cursor:pointer;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;
                           color:var(--fd-indigo)">
              📥 Export
            </button>
          </div>
          <canvas id="chart-top-main" height="240"></canvas>
        </div>
      </div>
    `;

    // ✅ Init graphiques tab volumes
    requestAnimationFrame(() => {
      this.creerVolumesSemaines('chart-vol-main', 8);
      this.creerRPESemaines('chart-rpe-main', 10);
      this.creerJoursSemaine('chart-jours-main');
    });

    // ✅ Events progression
    document.getElementById('prog-ex-select')
      ?.addEventListener('change', () => Charts._mettreAJourProgression());
    document.getElementById('prog-metric')
      ?.addEventListener('change', () => Charts._mettreAJourProgression());
    document.getElementById('prog-periode')
      ?.addEventListener('change', () => Charts._mettreAJourProgression());
  },

  // ════════════════════════════════════════════════════════
  // SWITCH TAB
  // ════════════════════════════════════════════════════════
  _switchTab(id, btn) {
    // Tabs boutons
    document.querySelectorAll('.tabs-container .tab-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Contenus
    ['volumes','progression','comparaison','stats'].forEach(t => {
      const el = document.getElementById(`charts-tab-${t}`);
      if (el) el.style.display = t === id ? 'block' : 'none';
    });

    // Init au besoin
    requestAnimationFrame(() => {
      if (id === 'stats') {
        this.detruire('chart-top-main');
        this.creerTop1RM('chart-top-main');
      }
      if (id === 'comparaison') {
        const el = document.getElementById('charts-tab-comparaison');
        if (el && !el.innerHTML.trim()) {
          this.renderComparaison(el);
        }
      }
    });
  },

  _changerSemaines(btn) {
    document.querySelectorAll('[data-sem]').forEach(b => {
      b.style.background  = 'var(--bg-input)';
      b.style.borderColor = 'var(--border-color)';
      b.style.color       = 'var(--text-muted)';
    });
    btn.style.background  = 'var(--fd-indigo)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'white';

    const n = parseInt(btn.dataset.sem || '8');
    this.detruire('chart-vol-main');
    this.creerVolumesSemaines('chart-vol-main', n);
  },

  _mettreAJourProgression() {
    const ref     = document.getElementById('prog-ex-select')?.value;
    const metric  = document.getElementById('prog-metric')?.value || 'rm1';
    const periode = parseInt(
      document.getElementById('prog-periode')?.value || '60'
    );
    const ph      = document.getElementById('prog-placeholder');
    const canvas  = document.getElementById('chart-prog-main');
    const expBtn  = document.getElementById('prog-export-btn');

    if (!ref) {
      if (ph)     ph.style.display     = 'block';
      if (canvas) canvas.style.display = 'none';
      if (expBtn) expBtn.style.display = 'none';
      return;
    }

    const prog = Stats.getProgressionExercice(ref, periode);

    if (prog.length < 2) {
      if (ph) {
        ph.style.display = 'block';
        ph.textContent   = 'Pas assez de données';
      }
      if (canvas) canvas.style.display = 'none';
      if (expBtn) expBtn.style.display = 'none';
      return;
    }

    if (ph)     ph.style.display     = 'none';
    if (canvas) canvas.style.display = 'block';
    if (expBtn) expBtn.style.display = 'block';

    this.detruire('chart-prog-main');

    const d        = this._getDefaults();
    const ex       = window.EXERCICES?.[ref] || {};
    const metricColors = { rm1:'#bfa1ff', poids:d.c1, reps:d.c2 };
    const color = metricColors[metric] || d.c1;

    // ✅ Dataset principal
    const datasets = [{
      label:               `${ex.nom||ref} — ${metric.toUpperCase()}`,
      data:                prog.map(p => p[metric]||0),
      borderColor:         color,
      backgroundColor:     `${color}22`,
      borderWidth:         2.5,
      pointRadius:         5,
      pointHoverRadius:    8,
      pointBackgroundColor:color,
      tension:             0.35,
      fill:                true
    }];

    this._instances['chart-prog-main'] = new Chart(canvas, {
      type: 'line',
      data: {
        labels: prog.map(p => p.label),
        datasets
      },
      options: this._baseOptions({
        plugins: {
          legend: {
            display: true,
            labels:  {
              color:    d.textColor,
              font:     { size: 11 },
              boxWidth: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(9,9,45,0.95)',
            titleColor:      '#ffffff',
            bodyColor:       color,
            borderColor:     color,
            borderWidth:     1,
            cornerRadius:    10,
            padding:         12,
            callbacks: {
              label: ctx => {
                const p = prog[ctx.dataIndex];
                return [
                  ` ${metric.toUpperCase()} : ${ctx.parsed.y}${metric==='reps'?'':' kg'}`,
                  ` ${p.poids}kg × ${p.reps} reps`
                ];
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color:    d.textColor,
              font:     { size: 10 },
              callback: v => `${v}${metric==='reps'?'':' kg'}`
            },
            grid: { color: d.gridColor }
          },
          x: {
            ticks: {
              color:       d.textColor,
              font:        { size: 10 },
              maxRotation: 30
            },
            grid: { color: d.gridColor }
          }
        },
        onClick: (evt, elements) => {
          if (!elements.length) return;
          const p  = prog[elements[0].index];
          const ex = window.EXERCICES?.[ref] || {};
          Charts._afficherDetailPoint(p, ex);
        }
      })
    });
  }
};

window.Charts = Charts;
console.log('✅ Charts.js v1.0 — Graphiques interactifs chargé');
