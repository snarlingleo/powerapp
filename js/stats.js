/* ============================================================
   PowerApp — Stats v5.0
   Dashboard + Corps + Charges + Graphiques + Calendrier
   + Photos + Historique + Journal + Objectifs + Blessures
   + Heatmap musculaire + Rapport PDF + Historique charges Live
   + Score forme enrichi + Surcharge dashboard
   ============================================================ */

const Stats = {

  // ════════════════════════════════════════════════════════
  // DASHBOARD DATA
  // ════════════════════════════════════════════════════════
  getDashboard() {
    const streak     = Tracker.getStreak();
    const profil     = Tracker.getProfil();
    const prs        = Tracker.getAllPRs();
    const volume     = Tracker.getVolumeSemaine();
    const seances    = Tracker.getTotalSeances();
    const scoreForme = Tracker.calculerScoreForme();
    const infos      = Programme.getInfosProgramme();
    const comp       = Tracker.getComparaisonSemaines();
    return {
      totalSeances:  seances,
      streak:        streak.count,
      streakMax:     streak.max,
      volumeSemaine: volume,
      totalPRs:      Object.keys(prs).length,
      scoreForme, infos, profil, comp
    };
  },

  getTopExercices(limite = 5) {
    const prs = Tracker.getAllPRs();
    return Object.entries(prs)
      .filter(([,v]) => v.rm1 > 0)
      .sort(([,a],[,b]) => (b.rm1||0) - (a.rm1||0))
      .slice(0, limite)
      .map(([ref, pr]) => ({
        ref,
        nom:    window.EXERCICES?.[ref]?.nom    || ref,
        emoji:  window.EXERCICES?.[ref]?.emoji  || '💪',
        muscle: window.EXERCICES?.[ref]?.muscle || '',
        ...pr
      }));
  },

  getVolumeParSemaine(n = 8) {
    return Tracker.getVolumeParSemaine(n);
  },

  getProgressionExercice(ref, periode = 30) {
    const hist   = Tracker.getHistoriqueExercice(ref, 200);
    const debut  = Utils.ajouterJours(Utils.aujourd_hui(), -periode);
    const filtre = hist.filter(h => h.date >= debut);
    const parSemaine = {};
    filtre.forEach(h => {
      const sem = Utils.debutSemaine(h.date);
      if (!parSemaine[sem]
          || (h.rm1||0) > (parSemaine[sem].rm1||0)) {
        parSemaine[sem] = h;
      }
    });
    return Object.entries(parSemaine)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        label: Utils.formatDateCourt(date),
        poids: data.poids || 0,
        reps:  data.reps  || 0,
        rm1:   data.rm1   || 0
      }));
  },

  getComparaisonSemaines() { return Tracker.getComparaisonSemaines(); },
  getHeatmap(semaines = 12) {
    return Tracker.getHeatmapData(semaines * 7);
  },

  get1RMTable() {
    const prs   = Tracker.getAllPRs();
    const table = [];
    Object.entries(prs).forEach(([ref, pr]) => {
      if (!pr.rm1) return;
      const ex = window.EXERCICES?.[ref];
      if (!ex) return;
      table.push({
        ref, nom:ex.nom, emoji:ex.emoji, muscle:ex.muscle,
        rm1:pr.rm1, poids:pr.poids, reps:pr.reps,
        date:pr.date, ancienPR:pr.ancienPR
      });
    });
    return table.sort((a,b) => b.rm1 - a.rm1);
  },

  // ════════════════════════════════════════════════════════
  // STATS CORPORELLES
  // ════════════════════════════════════════════════════════
  _caloriesBrulees(dureeMin, poids, intensite = 'modere') {
    const mets = { leger:3, modere:5, intense:8, tres_intense:11 };
    const met  = mets[intensite] || 5;
    return Math.round((met * poids * 3.5 / 200) * dureeMin);
  },

  getEvolutionPoids() {
    const mesures = Tracker.getMesures();
    const poids   = Tracker.getHistoriquePoids(30);
    const tous    = [
      ...mesures.filter(m => m.poids)
        .map(m => ({ date:m.date, poids:m.poids })),
      ...poids
    ];
    const parDate = {};
    tous.forEach(e => { parDate[e.date] = e.poids; });
    return Object.entries(parDate)
      .sort(([a],[b]) => a.localeCompare(b))
      .map(([date, poids]) => ({
        date, label:Utils.formatDateCourt(date), poids
      }));
  },

  getEvolutionMensurations() {
    return Tracker.getMesures()
      .filter(m => m.bras||m.poitrine||m.taille2||m.hanches)
      .sort((a,b) => a.date.localeCompare(b.date))
      .map(m => ({ ...m, label:Utils.formatDateCourt(m.date) }));
  },

  getStatsCorps() {
    const profil  = Tracker.getProfil();
    const mesures = Tracker.getDerniereMesure() || {};
    const poids   = mesures.poids  || profil.poids  || 0;
    const taille  = mesures.taille || profil.taille || 0;
    const imc     = poids && taille
      ? Utils.calculerIMC(poids, taille) : null;
    const catIMCLabel = imc ? Utils.categorieIMC(imc) : null;
    const toutes      = Tracker.getMesures();
    const premiere    = toutes[0] || {};
    const deltaPoids  = premiere.poids
      ? Utils.arrondir(poids - premiere.poids) : null;
    const seances     = Tracker.getHistoriqueSeances(10);
    const calSemaine  = seances
      .filter(s => s.date >= Utils.debutSemaine(Utils.aujourd_hui()))
      .reduce((acc, s) => {
        const dureeMin = Math.round((s.duree||0) / 60);
        return acc + this._caloriesBrulees(dureeMin, poids, 'intense');
      }, 0);
    return {
      poids, taille, imc, catIMC:catIMCLabel,
      deltaPoids, calSemaine,
      premiere, mesureActuelle:mesures
    };
  },

  // ════════════════════════════════════════════════════════
  // CHARTS REGISTRY
  // ════════════════════════════════════════════════════════
  _charts: {},

  _detruireCharts(ids) {
    if (!Stats._charts) Stats._charts = {};
    ids.forEach(id => {
      if (Stats._charts[id]) {
        try { Stats._charts[id].destroy(); } catch(e) {}
        delete Stats._charts[id];
      }
    });
  },

  _detruireTousCharts() {
    Stats._detruireCharts([
      'chart-volume','chart-rpe',
      'chart-vol-8w','chart-top-rm',
      'chart-jours-sem','chart-rpe-evo',
      'chart-progression','chart-poids',
      'chart-mensur','chart-exo',
      'chart-muscles-heatmap'           // ✅ NOUVEAU v5.0
    ]);
  },

  _chartOptions(overrides = {}) {
    return {
      responsive:          true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display:false },
        tooltip: {
          backgroundColor: '#09092d',
          titleColor:      '#ffffff',
          bodyColor:       '#bfa1ff',
          borderColor:     '#4b4bf9',
          borderWidth:     1
        }
      },
      scales: {
        x: {
          ticks: { color:'#888', font:{ size:10 } },
          grid:  { color:'rgba(255,255,255,0.05)' }
        },
        y: {
          ticks: { color:'#888', font:{ size:10 } },
          grid:  { color:'rgba(255,255,255,0.05)' }
        }
      },
      ...overrides
    };
  },

  // ════════════════════════════════════════════════════════
  // RENDER PRINCIPAL
  // ════════════════════════════════════════════════════════
  render(containerExterne = null, tab = 'dashboard') {
    const container = containerExterne
      || document.getElementById('page-stats')
      || document.getElementById('page-content');
    if (!container) return;

    try { Stats._detruireTousCharts(); } catch(e) {}

    const tabs = [
      'dashboard','historique','corps','photos',
      'charges','graphiques','calendrier','trophees'
    ];
    const tabLabels = {
      dashboard:'📊 Dashboard', historique:'📋 Historique',
      corps:'⚖️ Corps',         photos:'📸 Photos',
      charges:'🏋️ Charges',     graphiques:'📈 Graphiques',
      calendrier:'🗓️ Calendrier',trophees:'🏆 Trophées'
    };

    container.innerHTML = `
      <div class="tabs-container">
        ${tabs.map(t => `
          <button class="tab-btn ${tab===t?'active':''}"
                  onclick="Stats.render(
                    document.getElementById('page-stats'),'${t}')">
            ${tabLabels[t]}
          </button>`).join('')}
      </div>
      <div id="stats-content-wrapper">
        <div id="stats-content"></div>
      </div>
    `;

    const content = document.getElementById('stats-content');
    if (!content) return;

    switch(tab) {
      case 'dashboard':  this._renderDashboard(content);  break;
      case 'historique': this._renderHistorique(content); break;
      case 'corps':      this._renderCorps(content);      break;
      case 'photos':     this._renderPhotos(content);     break;
      case 'charges':    this._renderCharges(content);    break;
      case 'graphiques': this._renderGraphiques(content); break;
      case 'calendrier': this._renderCalendrier(content); break;
      case 'trophees':   this._renderTrophees(content);   break;
      default:           this._renderDashboard(content);
    }
  },

  // ════════════════════════════════════════════════════════
  // JOURNAL
  // ════════════════════════════════════════════════════════
  renderJournal(container) {
    if (!container) return;
    const journal = Tracker.getJournal();
    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">📔 Nouvelle entrée</div>
        <textarea class="input mt-md" id="journal-input" rows="3"
                  placeholder="Raconte ta séance, tes sensations, tes progrès..."
                  style="resize:none;min-height:80px"></textarea>
        <button onclick="Stats._sauvegarderJournal()"
                class="btn-primary mt-md" style="width:100%">
          💾 Ajouter au journal
        </button>
      </div>
      <div class="section-title">
        📋 ${journal.length} entrée${journal.length>1?'s':''}
      </div>
      ${journal.length === 0 ? `
        <div class="card" style="text-align:center;
                                  padding:var(--space-xl)">
          <div style="font-size:2.5rem;margin-bottom:var(--space-md)">
            📔</div>
          <p style="color:var(--text-muted);font-size:.88rem">
            Ton journal est vide.<br>Commence à écrire !</p>
        </div>` :
        journal.map(e => `
          <div class="card mb-md">
            <div class="flex justify-between items-center mb-sm">
              <div style="font-size:.72rem;color:var(--fd-indigo);
                          font-weight:600">
                📅 ${Utils.formatDateLong(e.date)}</div>
              <button onclick="Stats._supprimerJournal('${e.id}')"
                      style="background:none;border:none;
                             color:var(--text-muted);
                             font-size:.9rem;cursor:pointer">🗑️</button>
            </div>
            ${e.humeur
              ? `<div style="font-size:1.2rem;margin-bottom:4px">
                   ${e.humeur}</div>` : ''}
            <p style="font-size:.88rem;color:var(--text-secondary);
                      line-height:1.6;margin:0;white-space:pre-wrap">
              ${e.texte}</p>
          </div>`).join('')}
    `;
  },

  _sauvegarderJournal() {
    const texte = document.getElementById('journal-input')
      ?.value?.trim();
    if (!texte) {
      Utils.toast('Écris quelque chose !', 'error'); return;
    }
    Tracker.ajouterEntreeJournal(texte);
    try { Gamification.recompenser('JOURNAL'); } catch(e) {}
    Utils.toast('✅ Entrée ajoutée !', 'success');
    Utils.vibrerSuccess();
    const c = document.getElementById('page-journal')
      || document.getElementById('stats-content');
    if (c) this.renderJournal(c);
  },

  async _supprimerJournal(id) {
    const ok = await Utils.confirmer(
      'Supprimer cette entrée ?', 'Action irréversible.'
    );
    if (!ok) return;
    Tracker.supprimerEntreeJournal(id);
    Utils.toast('Entrée supprimée.', 'info');
    const c = document.getElementById('page-journal')
      || document.getElementById('stats-content');
    if (c) this.renderJournal(c);
  },

  // ════════════════════════════════════════════════════════
  // OBJECTIFS
  // ════════════════════════════════════════════════════════
  renderObjectifs(container) {
    if (!container) return;
    const objectifs = Tracker.getObjectifs();
    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🎯 Nouvel objectif</div>
        <div style="margin-top:var(--space-md)">
          <div class="input-label">Description</div>
          <input class="input mb-md" id="obj-titre"
                 placeholder="ex: Bench press 100kg" />
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;
                      gap:var(--space-sm)">
            <div>
              <div class="input-label">Valeur actuelle</div>
              <input class="input" id="obj-actuel"
                     type="number" placeholder="80" />
            </div>
            <div>
              <div class="input-label">Objectif cible</div>
              <input class="input" id="obj-cible"
                     type="number" placeholder="100" />
            </div>
          </div>
          <div style="margin-top:var(--space-sm)">
            <div class="input-label">Unité</div>
            <select class="input" id="obj-unite">
              <option value="kg">kg</option>
              <option value="reps">reps</option>
              <option value="min">minutes</option>
              <option value="km">km</option>
              <option value="%">%</option>
            </select>
          </div>
        </div>
        <button onclick="Stats._ajouterObjectif()"
                class="btn-primary mt-md" style="width:100%">
          ➕ Ajouter
        </button>
      </div>
      <div class="section-title">
        📋 ${objectifs.length} objectif${objectifs.length>1?'s':''}
      </div>
      ${objectifs.length === 0 ? `
        <div class="card" style="text-align:center;
                                  padding:var(--space-xl)">
          <div style="font-size:2.5rem;margin-bottom:var(--space-md)">
            🎯</div>
          <p style="color:var(--text-muted);font-size:.88rem">
            Aucun objectif défini.<br>Crée ton premier objectif !
          </p>
        </div>` :
        objectifs.map(o => {
          const pct = Tracker.calculerProgressionObjectif(o);
          return `
            <div class="card mb-md"
                 style="${o.complete
                   ? 'border-color:var(--fd-mint);background:rgba(139,240,187,0.05)'
                   : ''}">
              <div class="flex justify-between items-center mb-sm">
                <div style="font-weight:700;font-size:.92rem">
                  ${o.complete?'✅ ':'🎯 '}${o.titre||o.description}
                </div>
                ${!o.complete ? `
                  <button onclick="Stats._completerObjectif('${o.id}')"
                          class="btn-secondary btn-sm">✓ Atteint</button>` :
                  `<span class="chip chip-mint"
                         style="font-size:.65rem">Accompli !</span>`}
              </div>
              ${o.valeurActuelle && o.valeurCible ? `
                <div class="flex justify-between"
                     style="font-size:.75rem;margin-bottom:4px;
                            color:var(--text-muted)">
                  <span>${o.valeurActuelle} ${o.unite||''}</span>
                  <span style="font-weight:600;
                               color:var(--fd-indigo)">${pct}%</span>
                  <span>${o.valeurCible} ${o.unite||''}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill"
                       style="width:${pct}%;background:${o.complete
                         ? 'var(--fd-mint)' : 'var(--fd-indigo)'}">
                  </div>
                </div>` : ''}
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:var(--space-xs)">
                Créé le ${Utils.formatDateCourt(o.dateCreation)}
                ${o.dateCompletion
                  ? ` · Atteint le ${Utils.formatDateCourt(o.dateCompletion)}`
                  : ''}
              </div>
            </div>`;
        }).join('')}
    `;
  },

  _ajouterObjectif() {
    const titre  = document.getElementById('obj-titre')
      ?.value?.trim();
    const actuel = parseFloat(
      document.getElementById('obj-actuel')?.value
    );
    const cible  = parseFloat(
      document.getElementById('obj-cible')?.value
    );
    const unite  = document.getElementById('obj-unite')?.value || 'kg';
    if (!titre) {
      Utils.toast('Décris ton objectif !', 'error'); return;
    }
    Tracker.ajouterObjectif({
      titre, description:titre,
      valeurActuelle: isNaN(actuel) ? null : actuel,
      valeurCible:    isNaN(cible)  ? null : cible,
      unite
    });
    Utils.toast('🎯 Objectif ajouté !', 'success');
    const c = document.getElementById('page-objectifs')
      || document.getElementById('stats-content');
    if (c) this.renderObjectifs(c);
  },

  _completerObjectif(id) {
    Tracker.mettreAJourObjectif(id, {
      complete:true, dateCompletion:Utils.aujourd_hui()
    });
    try { Gamification.recompenser('OBJECTIF_ATTEINT'); } catch(e) {}
    Utils.toast('🎉 Objectif atteint ! +250 XP', 'success', 4000);
    Utils.vibrerPR();
    const c = document.getElementById('page-objectifs')
      || document.getElementById('stats-content');
    if (c) this.renderObjectifs(c);
  },

  // ════════════════════════════════════════════════════════
  // BLESSURES
  // ════════════════════════════════════════════════════════
  renderBlessures(container) {
    if (!container) return;
    const blessures = Tracker.getBlessures();
    const actives   = blessures.filter(b =>  b.active);
    const gueries   = blessures.filter(b => !b.active);
    const zones = [
      'Épaule gauche','Épaule droite','Genou gauche','Genou droit',
      'Dos bas','Dos haut','Coude','Poignet',
      'Cheville','Cou','Hanche'
    ];
    const severites = [
      { val:1, label:'🟡 Légère',  color:'var(--fd-lemon)'  },
      { val:2, label:'🟠 Modérée', color:'#ffa500'           },
      { val:3, label:'🔴 Sévère',  color:'var(--fd-coral)'  }
    ];

    // ✅ NOUVEAU v5.0 — Blessures actives enrichies
    const blessuresActives = actives.map(b => {
      try {
        const enrichie = Tracker.getBlessuresActives?.()
          .find(ba => ba.id === b.id);
        return enrichie || b;
      } catch(e) { return b; }
    });

    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🩹 Déclarer une blessure</div>
        <div style="margin-top:var(--space-md)">
          <div class="input-label">Zone</div>
          <select class="input mb-md" id="bless-zone">
            ${zones.map(z =>
              `<option value="${z}">${z}</option>`
            ).join('')}
          </select>
          <div class="input-label">Sévérité</div>
          <div style="display:flex;gap:var(--space-sm);
                      margin-bottom:var(--space-md)">
            ${severites.map(s => `
              <button onclick="Stats._selectSeverite(${s.val},this)"
                      class="sev-btn btn-secondary"
                      style="flex:1;font-size:.78rem;
                             ${s.val===1
                               ? 'border-color:var(--fd-lemon);background:rgba(249,239,119,0.1)'
                               : ''}">
                ${s.label}
              </button>`).join('')}
          </div>
          <input type="hidden" id="bless-severite" value="1" />
          <div class="input-label">Notes (optionnel)</div>
          <textarea class="input" id="bless-notes" rows="2"
                    placeholder="Douleur à la montée, depuis 2 jours..."
                    style="resize:none"></textarea>
        </div>
        <button onclick="Stats._ajouterBlessure()"
                class="btn-primary mt-md"
                style="width:100%;background:var(--fd-coral);
                       box-shadow:0 4px 20px rgba(255,141,150,0.3)">
          🩹 Déclarer
        </button>
      </div>

      ${actives.length > 0 ? `
        <div class="section-title">🔴 Actives (${actives.length})</div>
        ${blessuresActives.map(b => `
          <div class="card mb-md"
               style="border-color:rgba(255,141,150,0.4);
                      background:rgba(255,141,150,0.05)">
            <div class="flex justify-between items-center mb-sm">
              <div>
                <div style="font-weight:700;font-size:.92rem">
                  🩹 ${b.zone}</div>
                <div style="font-size:.72rem;color:var(--text-muted)">
                  ${Utils.formatDateCourt(b.date)} ·
                  ${severites.find(s=>s.val===b.severite)?.label||''}
                </div>
              </div>
              <button onclick="Stats._guerirBlessure('${b.id}')"
                      class="btn-secondary btn-sm"
                      style="color:var(--fd-mint);
                             border-color:var(--fd-mint)">
                ✅ Guérie
              </button>
            </div>
            ${b.notes
              ? `<p style="font-size:.82rem;
                           color:var(--text-secondary);
                           margin:0 0 8px;line-height:1.5">
                   ${b.notes}</p>` : ''}
            <!-- ✅ NOUVEAU v5.0 — Exercices à éviter + alternatives -->
            ${b.exercicesAEviter?.length ? `
              <div style="margin-top:6px">
                <div style="font-size:.6rem;font-weight:700;
                            color:var(--fd-coral);
                            text-transform:uppercase;
                            letter-spacing:.08em;margin-bottom:4px">
                  🚫 Exercices à éviter
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:4px">
                  ${b.exercicesAEviter.slice(0,4).map(e => `
                    <span style="padding:2px 8px;font-size:.62rem;
                                 background:rgba(255,141,150,0.15);
                                 border:1px solid rgba(255,141,150,0.3);
                                 border-radius:99px;color:var(--fd-coral)">
                      ${e}
                    </span>`).join('')}
                </div>
              </div>` : ''}
            ${b.alternativesOK?.length ? `
              <div style="margin-top:6px">
                <div style="font-size:.6rem;font-weight:700;
                            color:var(--fd-mint);
                            text-transform:uppercase;
                            letter-spacing:.08em;margin-bottom:4px">
                  ✅ Alternatives OK
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:4px">
                  ${b.alternativesOK.slice(0,3).map(e => `
                    <span style="padding:2px 8px;font-size:.62rem;
                                 background:rgba(139,240,187,0.15);
                                 border:1px solid rgba(139,240,187,0.3);
                                 border-radius:99px;color:var(--fd-mint)">
                      ${e}
                    </span>`).join('')}
                </div>
              </div>` : ''}
          </div>`).join('')}` : `
        <div class="card mb-md"
             style="text-align:center;padding:var(--space-lg);
                    border-color:var(--fd-mint)">
          <div style="font-size:1.5rem">✅</div>
          <div style="font-size:.85rem;color:var(--fd-mint);
                      font-weight:600;margin-top:4px">
            Aucune blessure active</div>
        </div>`}

      ${gueries.length > 0 ? `
        <div class="section-title">
          ✅ Historique (${gueries.length})</div>
        ${gueries.map(b => `
          <div class="card mb-md" style="opacity:.6">
            <div style="font-weight:600;font-size:.85rem">
              ✅ ${b.zone}</div>
            <div style="font-size:.68rem;color:var(--text-muted)">
              ${Utils.formatDateCourt(b.date)} →
              ${Utils.formatDateCourt(b.dateGuerison||'')}
            </div>
          </div>`).join('')}` : ''}
    `;
  },

  _selectSeverite(val, btn) {
    const input = document.getElementById('bless-severite');
    if (input) input.value = val;
    document.querySelectorAll('.sev-btn').forEach(b => {
      b.style.borderColor = ''; b.style.background = '';
    });
    const colors = {
      1:'var(--fd-lemon)', 2:'#ffa500', 3:'var(--fd-coral)'
    };
    btn.style.borderColor = colors[val] || '';
    btn.style.background  = `${colors[val]}22` || '';
  },

  _ajouterBlessure() {
    const zone     = document.getElementById('bless-zone')?.value;
    const severite = parseInt(
      document.getElementById('bless-severite')?.value
    ) || 1;
    const notes = document.getElementById('bless-notes')
      ?.value?.trim() || '';
    if (!zone) {
      Utils.toast('Sélectionne une zone !', 'error'); return;
    }
    Tracker.ajouterBlessure(zone, severite, notes);
    Utils.toast('🩹 Blessure déclarée.', 'warning');
    const c = document.getElementById('page-blessures')
      || document.getElementById('stats-content');
    if (c) this.renderBlessures(c);
  },

  async _guerirBlessure(id) {
    const ok = await Utils.confirmer(
      '✅ Marquer comme guérie ?',
      'Cette blessure sera archivée.'
    );
    if (!ok) return;
    Tracker.guerirBlessure(id);
    Utils.toast('✅ Blessure guérie !', 'success');
    Utils.vibrerSuccess();
    const c = document.getElementById('page-blessures')
      || document.getElementById('stats-content');
    if (c) this.renderBlessures(c);
  },

  // ════════════════════════════════════════════════════════
  // DASHBOARD TAB — ✅ v5.0 enrichi
  // ════════════════════════════════════════════════════════
  _renderDashboard(el) {
    const dash = this.getDashboard();
    const top  = this.getTopExercices(5);
    const comp = this.getComparaisonSemaines();
    const vol  = this.getVolumeParSemaine(8);
    const rpe  = Tracker.getRPEParSemaine(8);

    // ✅ NOUVEAU v5.0 — Surcharge musculaire
    let surcharge = [];
    try { surcharge = Tracker.getSurchargeMusculaire(); } catch(e) {}

    // ✅ NOUVEAU v5.0 — Volume par muscle
    let volumeMuscle = [];
    try { volumeMuscle = Tracker.getVolumeParMuscle(7); } catch(e) {}

    el.innerHTML = `

      <!-- Stats globales -->
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value">${dash.totalSeances}</span>
          <span class="stat-label">Séances</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${dash.streak}🔥</span>
          <span class="stat-label">Streak</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">
            ${Utils.formatVolume(dash.volumeSemaine)}</span>
          <span class="stat-label">Volume</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">${dash.totalPRs}</span>
          <span class="stat-label">PRs</span>
        </div>
      </div>

      <!-- Semaine vs précédente -->
      <div class="card mb-md">
        <div class="card-label">📊 Cette semaine vs précédente</div>
        <div class="flex items-center justify-between mt-md">
          <div style="text-align:center">
            <div style="font-size:1.2rem;font-weight:700;
                        color:var(--fd-indigo)">
              ${Utils.formatVolume(comp.cette)}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">
              Cette semaine</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:1.6rem;font-weight:800;
                        color:${comp.delta>=0
                          ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
              ${comp.delta>=0?'+':''}${comp.delta}%</div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              évolution</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:1.2rem;font-weight:700;
                        color:var(--text-secondary)">
              ${Utils.formatVolume(comp.prec)}</div>
            <div style="font-size:.72rem;color:var(--text-muted)">
              Semaine préc.</div>
          </div>
        </div>
      </div>

      <!-- Score de forme enrichi v5.0 -->
      <div class="card mb-md">
        <div class="card-label">💪 Score de forme</div>
        <div style="text-align:center;margin:12px 0 8px">
          <div style="font-size:2.5rem;font-weight:900;
                      color:${dash.scoreForme.score >= 80
                        ? 'var(--fd-mint)'
                        : dash.scoreForme.score >= 60
                          ? 'var(--fd-lemon)'
                          : dash.scoreForme.score >= 40
                            ? '#ffa500' : 'var(--fd-coral)'}">
            ${dash.scoreForme.score}</div>
          <div style="font-size:.78rem;color:var(--text-muted);
                      margin-bottom:8px">
            ${dash.scoreForme.niveau}</div>
          <!-- ✅ NOUVEAU v5.0 — Conseil personnalisé -->
          ${dash.scoreForme.conseil ? `
            <div style="padding:8px 12px;
                        background:rgba(75,75,249,0.08);
                        border:1px solid rgba(75,75,249,0.15);
                        border-radius:var(--radius-md);
                        font-size:.75rem;
                        color:var(--fd-lavender);
                        line-height:1.5">
              ${dash.scoreForme.conseil}
            </div>` : ''}
        </div>
        <div class="flex gap-md mt-md">
          ${[
            { label:'Récupération', val:dash.scoreForme.recup,
              color:'var(--fd-mint)'     },
            { label:'Assiduité',    val:dash.scoreForme.assiduite,
              color:'var(--fd-indigo)'   },
            { label:'Progression',  val:dash.scoreForme.progression,
              color:'var(--fd-lavender)' }
          ].map(s => `
            <div style="flex:1;text-align:center">
              <div style="font-size:1.1rem;font-weight:800;
                          color:${s.color}">${s.val}%</div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:2px">${s.label}</div>
              <div style="height:4px;background:var(--bg-input);
                          border-radius:99px;margin-top:4px;
                          overflow:hidden">
                <div style="height:100%;width:${s.val}%;
                            background:${s.color};border-radius:99px;
                            transition:width 1s"></div>
              </div>
            </div>`).join('')}
        </div>
        <!-- ✅ NOUVEAU v5.0 — Bonus streak -->
        ${dash.scoreForme.bonusStreak > 0 ? `
          <div style="margin-top:8px;text-align:center;
                      font-size:.7rem;color:var(--fd-lemon)">
            🔥 Bonus streak : +${dash.scoreForme.bonusStreak}pts
          </div>` : ''}
      </div>

      <!-- ✅ NOUVEAU v5.0 — Surcharge musculaire -->
      ${surcharge.length > 0 ? `
        <div class="card mb-md"
             style="border-color:var(--fd-coral);
                    background:rgba(255,141,150,0.05)">
          <div class="card-label" style="color:var(--fd-coral)">
            ⚠️ Surcharge musculaire détectée
          </div>
          ${surcharge.map(s => `
            <div style="font-size:.78rem;
                        color:var(--text-secondary);
                        padding:5px 0;
                        border-bottom:1px solid
                          rgba(255,141,150,0.1)">
              🔴 <strong>${s.muscle}</strong> —
              <span style="color:var(--text-muted)">${s.conseil}</span>
            </div>`).join('')}
        </div>` : ''}

      <!-- ✅ NOUVEAU v5.0 — Heatmap musculaire semaine -->
      ${volumeMuscle.length > 0 ? `
        <div class="card mb-md">
          <div class="card-label">🎯 Muscles travaillés cette semaine</div>
          ${this._renderHeatmapMusculaire(volumeMuscle)}
        </div>` : ''}

      <!-- Top PRs -->
      <div class="card mb-md">
        <div class="card-label">🏆 Top Records Personnels</div>
        ${top.length === 0 ? `
          <p style="color:var(--text-muted);text-align:center;
                    padding:var(--space-lg)">
            Commence tes séances pour voir tes records !</p>` :
          top.map((ex, i) => `
            <div class="flex items-center justify-between"
                 style="padding:var(--space-sm) 0;
                        border-bottom:1px solid var(--border-color)">
              <div class="flex items-center gap-md">
                <span style="font-size:1.1rem">
                  ${['🥇','🥈','🥉','4️⃣','5️⃣'][i]||''}</span>
                <div>
                  <div style="font-size:.88rem;font-weight:600">
                    ${ex.emoji} ${ex.nom}</div>
                  <div style="font-size:.68rem;color:var(--fd-mint)">
                    ${ex.muscle}</div>
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:.9rem;font-weight:700;
                            color:var(--fd-indigo)">
                  ${ex.poids}kg × ${ex.reps}</div>
                <div style="font-size:.68rem;
                            color:var(--fd-lavender)">
                  1RM: ${ex.rm1}kg</div>
              </div>
            </div>`).join('')}
      </div>

      <!-- Volume par semaine -->
      <div class="card mb-md">
        <div class="card-label">📈 Volume par semaine (kg)</div>
        <canvas id="chart-volume" height="160"
                style="margin-top:var(--space-sm)"></canvas>
      </div>

      ${rpe.length > 1 ? `
        <div class="card mb-md">
          <div class="card-label">😤 RPE moyen par semaine</div>
          <canvas id="chart-rpe" height="140"
                  style="margin-top:var(--space-sm)"></canvas>
        </div>` : ''}

      <!-- Répartition muscles historique -->
      <div class="card mb-md">
        <div class="card-label">💪 Répartition muscles — Historique</div>
        ${this._renderRepartitionMuscles()}
      </div>

      <!-- ✅ NOUVEAU v5.0 — Bouton export rapport -->
      <button onclick="Stats._exporterRapport()"
              class="btn-secondary"
              style="width:100%;margin-bottom:16px;
                     font-size:.82rem">
        📄 Exporter rapport mensuel
      </button>
    `;

    // ════════════════════════════════════════════════════════════
// _renderDashboard() requestAnimationFrame — ✅ v6.0
// Remplace le requestAnimationFrame dans _renderDashboard
// ════════════════════════════════════════════════════════════
requestAnimationFrame(() => {
  // ✅ FIX v6.0 — Vérifier Chart.js
  if (typeof Chart === 'undefined') return;

  Stats._detruireCharts(['chart-volume','chart-rpe']);

  const cvol = document.getElementById('chart-volume');
  if (cvol && vol.length > 0) {
    Stats._charts['chart-volume'] = new Chart(cvol, {
      type: 'bar',
      data: {
        labels:   vol.map(v => v.label),
        datasets: [{
          data:            vol.map(v => v.volume),
          backgroundColor: 'rgba(75,75,249,0.7)',
          borderColor:     '#4b4bf9',
          borderWidth:     2,
          borderRadius:    6
        }]
      },
      options: Stats._chartOptions()
    });
  }

  const crpe = document.getElementById('chart-rpe');
  if (crpe && rpe.length > 1) {
    Stats._charts['chart-rpe'] = new Chart(crpe, {
      type: 'line',
      data: {
        labels:   rpe.map(r => r.semaine),
        datasets: [{
          data:                rpe.map(r => r.rpe),
          borderColor:         '#ff8d96',
          backgroundColor:     'rgba(255,141,150,0.1)',
          borderWidth:         2,
          pointRadius:         4,
          pointBackgroundColor:'#ff8d96',
          tension:             0.4,
          fill:                true
        }]
      },
      options: Stats._chartOptions({
        scales: {
          x: {
            ticks: { color:'#888', font:{ size:10 } },
            grid:  { color:'rgba(255,255,255,0.05)' }
          },
          y: {
            min:0, max:10,
            ticks: {
              color:'#888', font:{ size:10 },
              callback: v => `${v}/10`
            },
            grid: { color:'rgba(255,255,255,0.05)' }
          }
        }
      })
    });
  }
});
  },

  // ✅ NOUVEAU v5.0 — Heatmap musculaire visuelle
  _renderHeatmapMusculaire(volumeMuscle) {
    if (!volumeMuscle.length) {
      return `<p style="color:var(--text-muted);text-align:center;
                        padding:var(--space-md);font-size:.85rem">
                Pas encore de données cette semaine</p>`;
    }

    const colorMap = {
      'haute':   { bg:'rgba(255,141,150,0.3)', border:'var(--fd-coral)', dot:'🔴' },
      'moyenne': { bg:'rgba(75,75,249,0.2)',   border:'var(--fd-indigo)', dot:'🟠' },
      'faible':  { bg:'rgba(139,240,187,0.15)',border:'var(--fd-mint)',   dot:'🟢' }
    };

    return `
      <div style="display:flex;flex-wrap:wrap;gap:6px;
                  margin-top:var(--space-md)">
        ${volumeMuscle.slice(0,10).map(m => {
          const c = colorMap[m.intensite] || colorMap.faible;
          return `
            <div style="display:flex;align-items:center;gap:6px;
                        padding:5px 10px;
                        background:${c.bg};
                        border:1px solid ${c.border};
                        border-radius:99px">
              <span style="font-size:.7rem">${c.dot}</span>
              <div>
                <div style="font-size:.72rem;font-weight:700;
                            color:var(--text-primary)">
                  ${m.muscle}</div>
                <div style="font-size:.58rem;color:var(--text-muted)">
                  ${m.pourcentage}% · ${m.intensite}</div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <div style="margin-top:8px;font-size:.65rem;
                  color:var(--text-muted);
                  display:flex;gap:12px">
        <span>🔴 Haute intensité</span>
        <span>🟠 Moyenne</span>
        <span>🟢 Faible</span>
      </div>
    `;
  },

  _renderRepartitionMuscles() {
    const muscles = Tracker.getRepartitionMuscles();
    if (!muscles.length) {
      return `<p style="color:var(--text-muted);text-align:center;
                        padding:var(--space-md);font-size:.85rem">
                Pas encore de données</p>`;
    }
    const total  = muscles.reduce((a,m) => a+m.volume, 0);
    const colors = [
      '#4b4bf9','#8bf0bb','#f9ef77',
      '#bfa1ff','#ff8d96','#09092d'
    ];
    return `
      <div style="margin-top:var(--space-md)">
        ${muscles.slice(0,6).map((m, i) => {
          const pct = Math.round((m.volume/total)*100);
          return `
            <div style="margin-bottom:var(--space-sm)">
              <div class="flex justify-between"
                   style="font-size:.78rem;margin-bottom:3px">
                <span style="font-weight:600">${m.muscle}</span>
                <span style="color:var(--text-muted)">
                  ${pct}% · ${Utils.formatVolume(m.volume)}</span>
              </div>
              <div style="height:6px;background:var(--bg-input);
                          border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${pct}%;
                            background:${colors[i]};
                            border-radius:99px;
                            transition:width 1s .${i}s"></div>
              </div>
            </div>`;
        }).join('')}
      </div>`;
  },

  // ✅ NOUVEAU v5.0 — Export rapport mensuel HTML/texte
  _exporterRapport() {
  const dash       = this.getDashboard();
  const top        = this.getTopExercices(10);
  const seances    = Tracker.getHistoriqueSeances(30);
  const stats      = this.getStatsCorps();
  const scoreForme = Tracker.calculerScoreForme();
  const auj        = Utils.aujourd_hui();
  const moisLabel  = new Date().toLocaleString('fr-FR',
    { month:'long', year:'numeric' }
  );

  // ✅ FIX — Ligne séances sans imbrication cassée
  const lignesSeances = seances.slice(0,10).map(s => {
    const nom = (
      window.SEANCES_BASE?.[s.id]?.nom || s.id || 'Séance'
    ).replace(/,/g,'');
    return `• ${s.date} — ${nom} — ${Utils.formatVolume(s.volumeTotal||0)} — ${Utils.formatDuree(s.duree||0)}`;
  }).join('\n');

  const contenu = `
RAPPORT POWERAPP — ${moisLabel.toUpperCase()}
${'═'.repeat(50)}

📊 RÉSUMÉ DU MOIS
─────────────────
• Séances totales  : ${dash.totalSeances}
• Streak actuel    : ${dash.streak} jours
• Streak record    : ${dash.streakMax} jours
• Volume semaine   : ${Utils.formatVolume(dash.volumeSemaine)}
• Records (PRs)    : ${dash.totalPRs}
• Score de forme   : ${scoreForme.score}/100 (${scoreForme.niveau})

⚖️ CORPS
─────────────────
• Poids actuel : ${stats.poids  || '—'} kg
• Taille       : ${stats.taille || '—'} cm
• IMC          : ${stats.imc    || '—'} (${stats.catIMC || '—'})
• Cal/semaine  : ${stats.calSemaine || 0} kcal

🏆 TOP RECORDS PERSONNELS
─────────────────────────
${top.map((ex,i) =>
  `${i+1}. ${ex.nom} — ${ex.poids}kg × ${ex.reps} (1RM: ${ex.rm1}kg)`
).join('\n')}

📅 SÉANCES CE MOIS
──────────────────
${lignesSeances}

─────────────────
Généré par PowerApp — ${auj}
  `.trim();

  const blob = new Blob([contenu], {
    type: 'text/plain;charset=utf-8;'
  });
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = `powerapp-rapport-${auj}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  Utils.toast('📄 Rapport exporté !', 'success');
},

  // ════════════════════════════════════════════════════════
  // HISTORIQUE TAB
  // ════════════════════════════════════════════════════════
  _renderHistorique(el, recherche = '') {
    const toutesSeances = Tracker.getHistoriqueSeancesAvecDetails(90);
    const seances = recherche
      ? toutesSeances.filter(s => {
          const nom = (
            window.SEANCES_BASE?.[s.id]?.nom || s.id || ''
          ).toLowerCase();
          return nom.includes(recherche.toLowerCase())
            || s.date.includes(recherche);
        })
      : toutesSeances;

    el.innerHTML = `
      <div class="search-container">
        <span class="search-icon">🔍</span>
        <input class="input search-input" id="historique-search"
               placeholder="Rechercher une séance..."
               value="${recherche}"
               oninput="Stats._filtrerHistorique(this.value)" />
        ${recherche
          ? `<button class="search-clear"
                     onclick="Stats._filtrerHistorique('')">✕</button>`
          : ''}
      </div>

      <div class="flex justify-between items-center mb-md">
        <div class="card-label" style="margin:0">
          📋 ${seances.length} séance${seances.length>1?'s':''}
          ${recherche
            ? `<span style="color:var(--fd-indigo)">
                 · "${recherche}"</span>`
            : ''}
        </div>
        <button onclick="Stats._exportHistorique()"
                style="padding:6px 12px;
                       border-radius:var(--radius-full);
                       border:1px solid var(--border-color);
                       background:var(--bg-input);
                       color:var(--text-primary);
                       font-size:.72rem;font-weight:600;
                       cursor:pointer">
          📤 CSV
        </button>
      </div>

      ${seances.length === 0 ? `
        <div class="card" style="text-align:center;
                                  padding:var(--space-xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">
            📋</div>
          <p style="color:var(--text-muted)">
            ${recherche
              ? 'Aucun résultat pour cette recherche.'
              : 'Aucune séance enregistrée.'}
          </p>
          ${!recherche
            ? `<button class="btn-primary mt-md"
                       onclick="naviguer('live')">
                 ⚡ Démarrer</button>` : ''}
        </div>` :
        seances.map(s => {
          const nom   = window.SEANCES_BASE?.[s.id]?.nom
            || s.id || 'Séance';
          const emoji = window.SEANCES_BASE?.[s.id]?.emoji || '💪';
          return `
            <div class="card mb-md"
                 onclick="Stats._afficherDetailSeance(
                   '${s.date}','${s.id}')"
                 style="cursor:pointer">
              <div class="flex items-center justify-between mb-sm">
                <div>
                  <div style="font-weight:700;font-size:.95rem">
                    ${emoji} ${nom}</div>
                  <div style="font-size:.72rem;
                              color:var(--text-muted)">
                    ${Utils.formatDateLong(s.date)}</div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:.82rem;font-weight:700;
                              color:var(--fd-indigo)">
                    ${Utils.formatDuree(s.duree||0)}</div>
                  <div style="font-size:.68rem;
                              color:var(--text-muted)">
                    ${Utils.formatVolume(s.volumeTotal||0)}</div>
                </div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${(s.exercicesResume||[]).map(e => `
                  <span style="padding:2px 6px;font-size:.65rem;
                               background:var(--bg-input);
                               border:1px solid var(--border-color);
                               border-radius:var(--radius-full)">
                    ${e.emoji} ${e.nom}
                    <span style="color:var(--fd-indigo)">
                      ${e.maxPoids}kg</span>
                  </span>`).join('')}
              </div>
              <div class="flex gap-md mt-sm"
                   style="font-size:.72rem;color:var(--text-muted)">
                <span>📊 ${s.series?.length||0} séries</span>
                ${s.rpesMoyen
                  ? `<span>😤 RPE ${s.rpesMoyen}</span>` : ''}
                ${(s.prs?.length||0)>0
                  ? `<span style="color:var(--fd-lemon)">
                       🏆 ${s.prs.length} PR</span>` : ''}
              </div>
            </div>`;
        }).join('')}
    `;
  },

  _filtrerHistorique(valeur) {
    const content = document.getElementById('stats-content');
    if (content) this._renderHistorique(content, valeur);
  },

  _afficherDetailSeance(date, seanceId) {
    let seanceData = null;
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (cle === `ft_seance_${date}_${seanceId}`) {
        try {
          seanceData = JSON.parse(localStorage.getItem(cle));
        } catch(e) {}
        break;
      }
    }
    if (!seanceData) return;

    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const nom   = window.SEANCES_BASE?.[seanceId]?.nom
      || seanceId;
    const emoji = window.SEANCES_BASE?.[seanceId]?.emoji || '💪';

    content.innerHTML = `
      <h3 style="margin-bottom:var(--space-md)">
        ${emoji} ${nom}</h3>
      <div style="font-size:.78rem;color:var(--text-muted);
                  margin-bottom:var(--space-md)">
        📅 ${Utils.formatDateLong(date)}</div>
      <div class="stats-grid mb-md">
        <div class="stat-card">
          <span class="stat-value" style="font-size:1rem">
            ${Utils.formatDuree(seanceData.duree||0)}</span>
          <span class="stat-label">Durée</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="font-size:1rem">
            ${Utils.formatVolume(seanceData.volumeTotal||0)}</span>
          <span class="stat-label">Volume</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="font-size:1rem">
            ${seanceData.series?.length||0}</span>
          <span class="stat-label">Séries</span>
        </div>
        <div class="stat-card">
          <span class="stat-value" style="font-size:1rem">
            ${seanceData.rpesMoyen||'—'}</span>
          <span class="stat-label">RPE</span>
        </div>
      </div>
      <div class="card-label mb-sm">Exercices</div>
      ${[...new Set(
        (seanceData.series||[]).map(s => s.exerciceRef)
      )].map(ref => {
        const ex     = window.EXERCICES?.[ref] || {};
        const series = (seanceData.series||[])
          .filter(s => s.exerciceRef === ref);
        const isPR   = Tracker.getPR(ref)?.date === date;
        return `
          <div class="card mb-sm">
            <div class="flex items-center justify-between mb-sm">
              <span style="font-weight:700;font-size:.88rem">
                ${ex.emoji||'💪'} ${ex.nom||ref}
                ${isPR
                  ? `<span style="color:var(--fd-lemon);
                               margin-left:4px">🏆 PR</span>`
                  : ''}
              </span>
              <span class="chip chip-indigo"
                    style="font-size:.65rem">${ex.muscle||''}</span>
            </div>
            ${series.map((sr,i) => `
              <div class="flex justify-between"
                   style="font-size:.78rem;padding:3px 0;
                          border-bottom:1px solid var(--border-color)">
                <span style="color:var(--text-muted)">
                  Série ${i+1}</span>
                <span style="font-weight:600">
                  ${sr.poids}kg × ${sr.reps}
                  ${sr.rpe
                    ? `<span style="color:var(--fd-coral);
                                   font-size:.7rem">
                         RPE ${sr.rpe}</span>` : ''}
                </span>
              </div>`).join('')}
          </div>`;
      }).join('')}
      ${seanceData.note ? `
        <div class="card mt-md"
             style="background:rgba(75,75,249,0.08)">
          <div class="card-label">📔 Note</div>
          <p style="font-size:.85rem;margin-top:var(--space-xs);
                    color:var(--text-secondary)">
            ${seanceData.note}</p>
        </div>` : ''}
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
    modal.querySelector('.modal-overlay')
      ?.addEventListener('click',
        () => modal.classList.add('hidden'), { once:true }
      );
  },

  _exportHistorique() {
    const seances = Tracker.getHistoriqueSeancesAvecDetails(999);
    const csv = ['Date,Séance,Durée(s),Volume(kg),Séries,RPE']
      .concat(seances.map(s => [
        s.date,
        (window.SEANCES_BASE?.[s.id]?.nom||s.id||'').replace(/,/g,''),
        s.duree||0,
        Math.round(s.volumeTotal||0),
        s.series?.length||0,
        s.rpesMoyen||''
      ].join(','))).join('\n');

    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `powerapp-historique-${Utils.aujourd_hui()}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    Utils.toast('✅ Export CSV téléchargé !', 'success');
  },

  // ════════════════════════════════════════════════════════
  // PHOTOS TAB
  // ════════════════════════════════════════════════════════
  _renderPhotos(el) {
    const photos = Tracker.getPhotos();
    const types  = [
      {val:'front', label:'Face',   emoji:'⬆️'},
      {val:'side',  label:'Côté',   emoji:'➡️'},
      {val:'back',  label:'Dos',    emoji:'⬇️'},
      {val:'custom',label:'Autre',  emoji:'📷'}
    ];
    el.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">📸 Ajouter une photo</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          <div>
            <div class="input-label">Type</div>
            <select class="input" id="photo-type">
              ${types.map(t =>
                `<option value="${t.val}">${t.emoji} ${t.label}</option>`
              ).join('')}
            </select>
          </div>
          <div>
            <div class="input-label">Note (optionnel)</div>
            <input class="input" id="photo-note"
                   placeholder="ex: Début programme" />
          </div>
        </div>
        <input type="file" id="photo-file" accept="image/*"
               capture="user" style="display:none"
               onchange="Stats._traiterPhoto(this)" />
        <button class="btn-primary mt-md"
                onclick="document.getElementById('photo-file').click()">
          📷 Choisir une photo
        </button>
      </div>

      ${photos.length >= 2 ? `
        <div class="card mb-md">
          <div class="card-label">🔄 Avant / Après</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:var(--space-md);margin-top:var(--space-md)">
            <div style="text-align:center">
              <div style="font-size:.72rem;font-weight:700;
                          color:var(--text-muted);
                          margin-bottom:var(--space-sm)">AVANT</div>
              <img src="${photos[photos.length-1].image}"
                   style="width:100%;border-radius:var(--radius-md);
                          aspect-ratio:3/4;object-fit:cover" />
            </div>
            <div style="text-align:center">
              <div style="font-size:.72rem;font-weight:700;
                          color:var(--fd-indigo);
                          margin-bottom:var(--space-sm)">MAINTENANT</div>
              <img src="${photos[0].image}"
                   style="width:100%;border-radius:var(--radius-md);
                          aspect-ratio:3/4;object-fit:cover" />
            </div>
          </div>
        </div>` : ''}

      <div class="card-label mb-sm">
        📂 Galerie (${photos.length} photos)</div>
      ${photos.length === 0 ? `
        <div class="card"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:3rem;margin-bottom:var(--space-md)">
            📸</div>
          <p style="color:var(--text-muted)">
            Ajoute ta première photo !</p>
        </div>` : `
        <div style="display:grid;
                    grid-template-columns:repeat(3,1fr);
                    gap:var(--space-sm)">
          ${photos.map(p => `
            <div style="position:relative;
                        border-radius:var(--radius-md);
                        overflow:hidden;aspect-ratio:3/4;
                        cursor:pointer"
                 onclick="Stats._voirPhoto('${p.id}')">
              <img src="${p.image}"
                   style="width:100%;height:100%;
                          object-fit:cover" />
              <div style="position:absolute;bottom:0;
                          left:0;right:0;
                          background:linear-gradient(
                            transparent,rgba(0,0,0,0.7));
                          padding:var(--space-xs);
                          font-size:.6rem;color:white">
                ${p.date}${p.poids?` · ${p.poids}kg`:''}
              </div>
            </div>`).join('')}
        </div>`}
    `;
  },

  async _traiterPhoto(input) {
    if (!input.files?.[0]) return;
    const type = document.getElementById('photo-type')?.value
      || 'front';
    const note = document.getElementById('photo-note')?.value || '';
    Utils.toast('⏳ Compression en cours...', 'info', 1500);
    try {
      const base64 = await Tracker.compresserImage(
        input.files[0], 800, 0.75
      );
      Tracker.ajouterPhoto(base64, type, note);
      try { Gamification.recompenser('PHOTO_AJOUTEE'); } catch(e) {}
      Utils.toast('✅ Photo ajoutée !', 'success');
      this._renderPhotos(document.getElementById('stats-content'));
    } catch(e) {
      Utils.toast('❌ Erreur lecture photo', 'error');
    }
  },

  _voirPhoto(id) {
    const photo   = Tracker.getPhotos().find(p => p.id === id);
    if (!photo) return;
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;
    content.innerHTML = `
      <img src="${photo.image}"
           style="width:100%;border-radius:var(--radius-md);
                  max-height:70vh;object-fit:contain;
                  margin-bottom:var(--space-md)" />
      <div style="font-size:.82rem;color:var(--text-muted);
                  margin-bottom:var(--space-md)">
        📅 ${photo.date}
        ${photo.poids ? `· ⚖️ ${photo.poids}kg` : ''}
        ${photo.note  ? `<br>📝 ${photo.note}` : ''}
      </div>
      <div class="flex gap-md">
        <button class="btn-secondary" style="flex:1"
                onclick="Stats._telechargerPhoto('${id}')">
          💾 Télécharger</button>
        <button style="flex:1;padding:var(--space-md) var(--space-lg);
                       background:var(--fd-coral-dim);
                       color:var(--fd-coral);
                       border:1px solid rgba(255,141,150,0.3);
                       border-radius:var(--radius-full);
                       font-size:.9rem;font-weight:600;
                       cursor:pointer"
                onclick="Stats._supprimerPhoto('${id}')">
          🗑️ Supprimer</button>
      </div>
    `;
    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _telechargerPhoto(id) {
    const photo = Tracker.getPhotos().find(p => p.id === id);
    if (!photo) return;
    const a = document.createElement('a');
    a.href     = photo.image;
    a.download = `powerapp-photo-${photo.date}.jpg`;
    a.click();
  },

  async _supprimerPhoto(id) {
    const ok = await Utils.confirmer(
      'Supprimer cette photo ?', 'Action irréversible.'
    );
    if (!ok) return;
    Tracker.supprimerPhoto(id);
    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast('Photo supprimée.', 'info');
    this._renderPhotos(document.getElementById('stats-content'));
  },

  // ════════════════════════════════════════════════════════
  // CORPS TAB
  // ════════════════════════════════════════════════════════
  _renderCorps(el) {
    const stats     = this.getStatsCorps();
    const evolPoids = this.getEvolutionPoids();
    const evolMens  = this.getEvolutionMensurations();
    const derniere  = Tracker.getDerniereMesure() || {};

    el.innerHTML = `
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(139,240,187,0.1))">
        <div class="card-label">🧮 Bilan corporel</div>
        <div class="stats-grid mt-md">
          <div class="stat-card">
            <span class="stat-value">${stats.poids||'—'}</span>
            <span class="stat-label">Poids (kg)</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${stats.taille||'—'}</span>
            <span class="stat-label">Taille (cm)</span>
          </div>
          <div class="stat-card">
            <span class="stat-value"
                  style="color:var(--fd-mint)">
              ${stats.imc||'—'}</span>
            <span class="stat-label">IMC</span>
          </div>
          <div class="stat-card">
            <span class="stat-value"
                  style="color:var(--fd-lemon)">
              ${stats.calSemaine||0}</span>
            <span class="stat-label">Cal/sem</span>
          </div>
        </div>
        ${stats.catIMC ? `
          <div style="margin-top:var(--space-md);
                      padding:var(--space-sm);
                      background:var(--fd-mint-dim);
                      border:1px solid rgba(139,240,187,0.2);
                      border-radius:var(--radius-sm);
                      text-align:center;font-size:.82rem;
                      color:var(--fd-mint);font-weight:600">
            ${stats.catIMC}</div>` : ''}
        ${stats.deltaPoids !== null ? `
          <div style="margin-top:var(--space-sm);text-align:center;
                      font-size:.8rem;color:var(--text-muted)">
            Depuis le début :
            <span style="font-weight:700;
                         color:${stats.deltaPoids<=0
                           ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
              ${stats.deltaPoids>0?'+':''}${stats.deltaPoids} kg
            </span>
          </div>` : ''}
      </div>

      <div class="card mb-md">
        <div class="card-label">📏 Ajouter une mesure</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          ${[
            {id:'c-poids',    label:'Poids (kg)',      val:stats.poids     ||''},
            {id:'c-taille',   label:'Taille (cm)',     val:stats.taille    ||''},
            {id:'c-bras',     label:'Bras (cm)',       val:derniere.bras   ||''},
            {id:'c-poitrine', label:'Poitrine (cm)',   val:derniere.poitrine||''},
            {id:'c-tour',     label:'Tour taille (cm)',val:derniere.taille2||''},
            {id:'c-hanches',  label:'Hanches (cm)',    val:derniere.hanches||''}
          ].map(f => `
            <div>
              <div class="input-label">${f.label}</div>
              <input class="input" id="${f.id}" type="number"
                     placeholder="${f.label}" value="${f.val}"
                     step="0.1" />
            </div>`).join('')}
        </div>
        <button class="btn-primary mt-md"
                onclick="Stats._sauvegarderMesure()">
          💾 Enregistrer
        </button>
      </div>

      <div class="card mb-md">
        <div class="card-label">⚖️ Évolution du poids</div>
        ${evolPoids.length < 2
          ? `<p style="text-align:center;padding:var(--space-xl);
                       color:var(--text-muted);font-size:.85rem">
               Ajoute au moins 2 mesures</p>`
          : `<canvas id="chart-poids" height="160"
                     style="margin-top:var(--space-sm)"></canvas>`}
      </div>

      <div class="card mb-md">
        <div class="card-label">📐 Évolution mensurations</div>
        ${evolMens.length < 2
          ? `<p style="text-align:center;padding:var(--space-xl);
                       color:var(--text-muted);font-size:.85rem">
               Ajoute au moins 2 mesures</p>`
          : `<canvas id="chart-mensur" height="160"
                     style="margin-top:var(--space-sm)"></canvas>`}
      </div>

      <div class="card">
        <div class="card-label">📋 Historique</div>
        ${Tracker.getMesures().length === 0
          ? `<p style="color:var(--text-muted);text-align:center;
                       padding:var(--space-lg);font-size:.85rem">
               Aucune mesure</p>` : ''}
        ${[...Tracker.getMesures()].reverse().slice(0,10).map(m => `
          <div style="padding:var(--space-sm) 0;
                      border-bottom:1px solid var(--border-color);
                      font-size:.82rem">
            <div style="font-weight:600;color:var(--fd-indigo);
                        margin-bottom:2px">
              ${Utils.formatDateCourt(m.date)}</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;
                        color:var(--text-secondary)">
              ${m.poids    ? `<span>⚖️ ${m.poids}kg</span>`    : ''}
              ${m.taille   ? `<span>📏 ${m.taille}cm</span>`   : ''}
              ${m.bras     ? `<span>💪 ${m.bras}cm</span>`     : ''}
              ${m.poitrine ? `<span>🫀 ${m.poitrine}cm</span>` : ''}
              ${m.taille2  ? `<span>📐 ${m.taille2}cm</span>`  : ''}
              ${m.hanches  ? `<span>🦵 ${m.hanches}cm</span>`  : ''}
            </div>
          </div>`).join('')}
      </div>
    `;

    // ════════════════════════════════════════════════════════════
// _renderCorps() requestAnimationFrame — ✅ v6.0
// ════════════════════════════════════════════════════════════
requestAnimationFrame(() => {
  // ✅ FIX v6.0
  if (typeof Chart === 'undefined') return;

  Stats._detruireCharts(['chart-poids','chart-mensur']);
  // ← Suite identique à v5.0

      if (evolPoids.length >= 2) {
        const c = document.getElementById('chart-poids');
        if (c) Stats._charts['chart-poids'] = new Chart(c, {
          type: 'line',
          data: {
            labels:   evolPoids.map(p => p.label),
            datasets: [{
              data:                evolPoids.map(p => p.poids),
              borderColor:         '#ff8d96',
              backgroundColor:     'rgba(255,141,150,0.1)',
              borderWidth:         2,
              pointRadius:         4,
              pointBackgroundColor:'#ff8d96',
              tension:             0.4,
              fill:                true
            }]
          },
          options: Stats._chartOptions()
        });
      }

      if (evolMens.length >= 2) {
        const c = document.getElementById('chart-mensur');
        if (c) {
          const colors   = ['#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff'];
          const keys     = ['bras','poitrine','taille2','hanches'];
          const datasets = [];
          keys.forEach((key,i) => {
            const vals = evolMens.map(m => m[key] || 0);
            if (vals.some(v => v > 0)) {
              datasets.push({
                data:                vals,
                borderColor:         colors[i],
                backgroundColor:     colors[i] + '22',
                borderWidth:         2,
                pointRadius:         3,
                pointBackgroundColor:colors[i],
                tension:             0.4,
                fill:                false
              });
            }
          });
          if (datasets.length) {
            Stats._charts['chart-mensur'] = new Chart(c, {
              type: 'line',
              data: { labels:evolMens.map(m => m.label), datasets },
              options: Stats._chartOptions()
            });
          }
        }
      }
    });
  },

  _sauvegarderMesure() {
    const poids    = parseFloat(
      document.getElementById('c-poids')?.value
    ) || undefined;
    const taille   = parseFloat(
      document.getElementById('c-taille')?.value
    ) || undefined;
    const bras     = parseFloat(
      document.getElementById('c-bras')?.value
    ) || undefined;
    const poitrine = parseFloat(
      document.getElementById('c-poitrine')?.value
    ) || undefined;
    const taille2  = parseFloat(
      document.getElementById('c-tour')?.value
    ) || undefined;
    const hanches  = parseFloat(
      document.getElementById('c-hanches')?.value
    ) || undefined;

    if (!poids&&!taille&&!bras&&!poitrine&&!taille2&&!hanches) {
      Utils.toast('Remplis au moins une mesure !', 'error'); return;
    }

    Tracker.ajouterMesure({
      poids, taille, bras, poitrine, taille2, hanches
    });
    if (poids)  Tracker.ajouterPoids(poids);
    if (poids)  Tracker.sauvegarderProfil({ poids });
    if (taille) Tracker.sauvegarderProfil({ taille });
    try { Gamification.ajouterXP(20, 'mesure'); } catch(e) {}
    Utils.toast('✅ Mesure enregistrée !', 'success');
    Utils.vibrerSuccess();
    this._renderCorps(document.getElementById('stats-content'));
  },

  // ════════════════════════════════════════════════════════
  // CHARGES TAB
  // ════════════════════════════════════════════════════════
  _renderCharges(el) {
    const table  = this.get1RMTable();
    const exRefs = Object.keys(window.EXERCICES||{});

    el.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🔍 Détail d'un exercice</div>
        <select id="select-exercice" class="input mt-md">
          <option value="">-- Choisir un exercice --</option>
          ${exRefs.map(ref => `
            <option value="${ref}">
              ${window.EXERCICES[ref]?.emoji||''}
              ${window.EXERCICES[ref]?.nom||ref}
            </option>`).join('')}
        </select>
      </div>
      <div id="detail-exercice"></div>
      <div class="card">
        <div class="card-label">📊 Tableau 1RM complet</div>
        ${table.length === 0
          ? `<p style="color:var(--text-muted);text-align:center;
                       padding:var(--space-lg)">
               Lance tes séances pour voir tes 1RM !</p>` : ''}
        ${table.map((ex,i) => `
          <div class="flex items-center justify-between"
               style="padding:var(--space-sm) 0;
                      border-bottom:1px solid var(--border-color)">
            <div class="flex items-center gap-sm">
              <span style="font-size:.72rem;
                           color:var(--text-muted);width:20px">
                ${i+1}</span>
              <div>
                <div style="font-size:.88rem;font-weight:600">
                  ${ex.emoji} ${ex.nom}</div>
                <div style="font-size:.68rem;color:var(--fd-mint)">
                  ${ex.muscle}</div>
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:.9rem;font-weight:700;
                          color:var(--fd-indigo)">
                1RM: ${ex.rm1}kg</div>
              <div style="font-size:.68rem;color:var(--text-muted)">
                ${ex.poids}kg × ${ex.reps}
                ${ex.ancienPR?.rm1
                  ? `<span style="color:var(--fd-mint)">
                       ↑${ex.rm1-ex.ancienPR.rm1}kg</span>`
                  : ''}
              </div>
            </div>
          </div>`).join('')}
      </div>
    `;

    document.getElementById('select-exercice').onchange = e => {
      if (e.target.value) this._renderDetailExercice(e.target.value);
    };
  },

  _renderDetailExercice(ref) {
    const el = document.getElementById('detail-exercice');
    if (!el) return;
    const ex    = window.EXERCICES?.[ref];
    const pr    = Tracker.getPR(ref);
    const prog  = this.getProgressionExercice(ref, 60);
    const notes = Tracker.getNotesExercice(ref);

    // ✅ NOUVEAU v5.0 — Historique charges Live
    let historiqueCharges = [];
    try {
      historiqueCharges = Tracker.getHistoriqueChargesLive(ref, 3);
    } catch(e) {}

    // ✅ NOUVEAU v5.0 — Suggestion charge
    let suggestion = null;
    try {
      suggestion = Tracker.getSuggestionCharge(ref);
    } catch(e) {}

    el.innerHTML = `
      <div class="card mb-md">
        <div class="flex items-center justify-between mb-md">
          <div class="card-label" style="margin:0">
            ${ex?.emoji||'💪'} ${ex?.nom||ref}</div>
          <button onclick="Stats._ajouterNoteExo('${ref}')"
                  style="padding:4px 12px;
                         border-radius:var(--radius-full);
                         border:1px solid var(--border-color);
                         background:var(--bg-input);
                         color:var(--text-primary);
                         font-size:.72rem;font-weight:600;
                         cursor:pointer">
            📝 Note
          </button>
        </div>

        <div class="stats-grid mb-md">
          <div class="stat-card">
            <span class="stat-value"
                  style="color:var(--fd-lemon)">
              ${pr?.rm1||0}kg</span>
            <span class="stat-label">1RM Estimé</span>
          </div>
          <div class="stat-card">
            <span class="stat-value"
                  style="color:var(--fd-indigo)">
              ${pr?.poids||0}kg</span>
            <span class="stat-label">Meilleur</span>
          </div>
          <div class="stat-card">
            <span class="stat-value"
                  style="color:var(--fd-mint)">
              ${pr?.reps||0}</span>
            <span class="stat-label">Meilleur reps</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" style="font-size:.9rem">
              ${pr?.date
                ? Utils.formatDateCourt(pr.date) : '—'}</span>
            <span class="stat-label">Date PR</span>
          </div>
        </div>

        <!-- ✅ NOUVEAU v5.0 — Suggestion charge prochaine séance -->
        ${suggestion ? `
          <div style="padding:10px 12px;
                      background:rgba(75,75,249,0.08);
                      border:1px solid rgba(75,75,249,0.2);
                      border-left:3px solid var(--fd-indigo);
                      border-radius:var(--radius-md);
                      margin-bottom:12px">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;
                        letter-spacing:.08em;
                        color:var(--fd-indigo);margin-bottom:4px">
              💡 Suggestion prochaine séance
            </div>
            <div style="font-size:.9rem;font-weight:800;
                        color:var(--text-primary)">
              ${suggestion.poids}kg
              <span style="font-size:.72rem;
                           font-weight:400;
                           color:var(--text-muted)">
                (${suggestion.action === 'augmenter' ? '↑' : '→'}
                vs ${suggestion.dernierePoids}kg)
              </span>
            </div>
            <div style="font-size:.65rem;
                        color:var(--text-muted);margin-top:2px">
              ${suggestion.raison || ''}
            </div>
          </div>` : ''}

        <!-- ✅ NOUVEAU v5.0 — Historique 3 dernières séances -->
        ${historiqueCharges.length > 0 ? `
          <div class="card-label mb-sm"
               style="font-size:.72rem">
            📋 3 dernières séances</div>
          ${historiqueCharges.map(h => `
            <div style="padding:6px 0;
                        border-bottom:1px solid var(--border-color)">
              <div style="display:flex;justify-content:space-between;
                          align-items:center;margin-bottom:3px">
                <span style="font-size:.68rem;
                             color:var(--fd-indigo);
                             font-weight:600">${h.label}</span>
                <span style="font-size:.72rem;
                             font-weight:700;
                             color:var(--text-primary)">
                  ${h.maxPoids}kg max</span>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${(h.series||[]).map(s => `
                  <span style="padding:1px 6px;font-size:.6rem;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.2);
                               border-radius:99px;
                               color:var(--fd-lavender)">
                    S${s.serie}: ${s.poids}kg×${s.reps}
                    ${s.rpe
                      ? `<span style="color:var(--fd-coral)">
                           R${s.rpe}</span>`
                      : ''}
                  </span>`).join('')}
              </div>
            </div>`).join('')}` : ''}

        ${pr?.rm1 ? `
          <div class="card-label mb-sm"
               style="margin-top:12px">
            📊 Zones d'entraînement</div>
          <div style="display:grid;
                      grid-template-columns:repeat(5,1fr);
                      gap:4px;margin-bottom:var(--space-md)">
            ${[
              {pct:50, label:'Endurance', color:'#8bf0bb'},
              {pct:65, label:'Volume',    color:'#4b4bf9'},
              {pct:75, label:'Hypertro.', color:'#bfa1ff'},
              {pct:85, label:'Force',     color:'#f9ef77'},
              {pct:95, label:'Max',       color:'#ff8d96'}
            ].map(z => `
              <div style="text-align:center;padding:var(--space-xs);
                          background:${z.color}22;
                          border:1px solid ${z.color}44;
                          border-radius:var(--radius-sm)">
                <div style="font-size:.75rem;font-weight:700;
                            color:${z.color}">
                  ${Math.round(pr.rm1*z.pct/100)}kg</div>
                <div style="font-size:.58rem;
                            color:var(--text-muted)">${z.pct}%</div>
                <div style="font-size:.58rem;
                            color:var(--text-muted)">
                  ${z.label}</div>
              </div>`).join('')}
          </div>` : ''}

        ${prog.length > 1
          ? `<div class="card-label"
                  style="font-size:.72rem">
               📈 Progression 1RM (60 jours)</div>
             <canvas id="chart-exo" height="140"
                     style="margin-top:var(--space-sm)">
             </canvas>`
          : `<p style="color:var(--text-muted);text-align:center;
                       font-size:.85rem;padding:var(--space-md)">
               Pas encore assez de données</p>`}

        ${notes.length > 0 ? `
          <div class="card-label mt-md mb-sm">📝 Mes notes</div>
          ${notes.slice(0,3).map(n => `
            <div style="font-size:.78rem;padding:var(--space-xs) 0;
                        border-bottom:1px solid var(--border-color);
                        color:var(--text-secondary)">
              <span style="color:var(--fd-indigo);
                           font-size:.65rem">${n.date}</span>
              <br>${n.note}
            </div>`).join('')}` : ''}
      </div>
    `;

    if (prog.length > 1) {
      requestAnimationFrame(() => {
        Stats._detruireCharts(['chart-exo']);
        const canvas = document.getElementById('chart-exo');
        if (canvas) Stats._charts['chart-exo'] = new Chart(canvas, {
          type: 'line',
          data: {
            labels:   prog.map(p => p.label),
            datasets: [{
              data:                prog.map(p => p.rm1),
              borderColor:         '#bfa1ff',
              backgroundColor:     'rgba(191,161,255,0.1)',
              borderWidth:         2,
              pointRadius:         4,
              pointBackgroundColor:'#bfa1ff',
              tension:             0.4,
              fill:                true
            }]
          },
          options: Stats._chartOptions()
        });
      });
    }
  },

  _ajouterNoteExo(ref) {
    const ex      = window.EXERCICES?.[ref];
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;
    content.innerHTML = `
      <h3 style="margin-bottom:var(--space-md)">
        📝 Note — ${ex?.emoji||''} ${ex?.nom||ref}</h3>
      <textarea class="input" id="note-exo-texte" rows="4"
                placeholder="Technique, sensations, points à améliorer..."
                style="resize:none;min-height:120px"></textarea>
      <button class="btn-primary mt-md"
              onclick="Stats._sauvegarderNoteExo('${ref}')">
        💾 Sauvegarder
      </button>
    `;
    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _sauvegarderNoteExo(ref) {
    const texte = document.getElementById('note-exo-texte')
      ?.value?.trim();
    if (!texte) return;
    Tracker.ajouterNoteExercice(ref, texte);
    Utils.toast('Note sauvegardée !', 'success');
    document.getElementById('modal-info')?.classList.add('hidden');
    this._renderDetailExercice(ref);
  },

  // ════════════════════════════════════════════════════════
// ✅ NOUVEAU v6.0 — Helper couleur
// ════════════════════════════════════════════════════════
_getChartColor(index) {
  const colors = [
    '#4b4bf9','#8bf0bb','#f9ef77',
    '#bfa1ff','#ff8d96','#4b4bf9'
  ];
  return colors[index % colors.length];
}, 

  // ════════════════════════════════════════════════════════
  // GRAPHIQUES TAB
  // ════════════════════════════════════════════════════════
  _renderGraphiques(el) {
      // ✅ AJOUTER CES LIGNES ICI — juste après l'accolade {
  if (typeof Chart === 'undefined') {
    el.innerHTML = `
      <div class="card mt-md" style="text-align:center;
                                      padding:var(--space-xl)">
        <div style="font-size:2rem;margin-bottom:8px">📊</div>
        <div style="color:var(--text-muted);font-size:.85rem">
          Chart.js non chargé.<br>
          Vérifie la connexion internet.
        </div>
      </div>`;
    return;
  } 
    const refs     = Object.keys(window.EXERCICES||{})
      .filter(r => Tracker.getPR(r));
    const periodes = ['30','60','90','180'];

    el.innerHTML = `
      <div class="card mb-md">
        <div class="card-label mb-md">📈 Progression exercice</div>
        <div style="display:flex;gap:var(--space-sm);
                    flex-wrap:wrap;margin-bottom:var(--space-sm)">
          <select id="sel-graph-exo" class="input"
                  style="flex:2;min-width:140px">
            <option value="">-- Choisir un exercice --</option>
            ${refs.map(r => `
              <option value="${r}">
                ${window.EXERCICES[r]?.emoji||''}
                ${window.EXERCICES[r]?.nom||r}
              </option>`).join('')}
          </select>
          <select id="sel-graph-metric" class="input"
                  style="flex:1;min-width:100px">
            <option value="rm1">1RM (kg)</option>
            <option value="poids">Poids (kg)</option>
            <option value="reps">Reps</option>
          </select>
        </div>
        <div style="display:flex;gap:6px;
                    margin-bottom:var(--space-md)">
          ${periodes.map((p,i) => `
            <button data-periode="${p}"
                    onclick="Stats._chartChangerPeriode(this)"
                    style="flex:1;padding:6px 4px;
                           border-radius:var(--radius-full);
                           font-size:.75rem;font-weight:600;
                           cursor:pointer;
                           border:1px solid ${i===0
                             ? 'var(--fd-indigo)' : 'var(--border-color)'};
                           background:${i===0
                             ? 'var(--fd-indigo)' : 'var(--bg-input)'};
                           color:${i===0
                             ? 'white' : 'var(--text-muted)'}">
              ${p}j
            </button>`).join('')}
        </div>
        <div id="chart-prog-placeholder"
             style="text-align:center;padding:var(--space-xl);
                    color:var(--text-muted);font-size:.85rem">
          Sélectionne un exercice pour voir sa progression
        </div>
        <canvas id="chart-progression" height="200"
                style="display:none"></canvas>
      </div>

      <div class="card mb-md">
        <div class="card-label">📊 Volume total — 8 semaines</div>
        <canvas id="chart-vol-8w" height="180"
                style="margin-top:var(--space-sm)"></canvas>
      </div>
      <div class="card mb-md">
        <div class="card-label">💪 Top 1RM estimés</div>
        <canvas id="chart-top-rm" height="200"
                style="margin-top:var(--space-sm)"></canvas>
      </div>
      <div class="card mb-md">
        <div class="card-label">📅 Séances par jour de la semaine</div>
        <canvas id="chart-jours-sem" height="160"
                style="margin-top:var(--space-sm)"></canvas>
      </div>
      <div class="card mb-md">
        <div class="card-label">😤 Évolution RPE moyen</div>
        <canvas id="chart-rpe-evo" height="160"
                style="margin-top:var(--space-sm)"></canvas>
      </div>
    `;

    Stats._detruireCharts([
      'chart-vol-8w','chart-top-rm',
      'chart-jours-sem','chart-rpe-evo'
    ]);

    requestAnimationFrame(() => {
      const vol  = Stats.getVolumeParSemaine(8);
      const cvol = document.getElementById('chart-vol-8w');
      if (cvol && vol.length > 0) {
        Stats._charts['chart-vol-8w'] = new Chart(cvol, {
          type: 'bar',
          data: {
            labels:   vol.map(v => v.label),
            datasets: [{
              data:            vol.map(v => v.volume),
              backgroundColor: 'rgba(75,75,249,0.7)',
              borderColor:     '#4b4bf9',
              borderWidth:     2,
              borderRadius:    6
            }]
          },
          options: Stats._chartOptions()
        });
      }

      const top  = Stats.getTopExercices(8);
      const crm  = document.getElementById('chart-top-rm');
      if (crm && top.length > 0) {
        const colors = [
          '#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff',
          '#ff8d96','#4b4bf9','#8bf0bb','#f9ef77'
        ];
        Stats._charts['chart-top-rm'] = new Chart(crm, {
          type: 'bar',
          data: {
            labels:   top.map(e => e.nom),
            datasets: [{
              data:            top.map(e => e.rm1),
              backgroundColor: colors.map(c => c+'cc'),
              borderColor:     colors,
              borderWidth:     2,
              borderRadius:    6
            }]
          },
          options: Stats._chartOptions({ indexAxis:'y' })
        });
      }

      const jours  = Tracker.getSeancesParJourSemaine();
      const cjours = document.getElementById('chart-jours-sem');
      if (cjours) {
        Stats._charts['chart-jours-sem'] = new Chart(cjours, {
          type: 'bar',
          data: {
            labels: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
            datasets: [{
              data:            jours,
              backgroundColor: 'rgba(139,240,187,0.6)',
              borderColor:     '#8bf0bb',
              borderWidth:     2,
              borderRadius:    6
            }]
          },
          options: Stats._chartOptions()
        });
      }

      const rpe  = Tracker.getRPEParSemaine(10);
      const crpe = document.getElementById('chart-rpe-evo');
      if (crpe && rpe.length > 1) {
        Stats._charts['chart-rpe-evo'] = new Chart(crpe, {
          type: 'line',
          data: {
            labels:   rpe.map(r => r.semaine),
            datasets: [{
              data:                rpe.map(r => r.rpe),
              borderColor:         '#ff8d96',
              backgroundColor:     'rgba(255,141,150,0.1)',
              borderWidth:         2,
              pointRadius:         4,
              pointBackgroundColor:'#ff8d96',
              tension:             0.4,
              fill:                true
            }]
          },
          options: Stats._chartOptions({
            scales: {
              x: {
                ticks: { color:'#888', font:{ size:10 } },
                grid:  { color:'rgba(255,255,255,0.05)' }
              },
              y: {
                min:0, max:10,
                ticks: {
                  color:'#888', font:{ size:10 },
                  callback: v => `${v}/10`
                },
                grid: { color:'rgba(255,255,255,0.05)' }
              }
            }
          })
        });
      }
    });

    document.getElementById('sel-graph-exo')
      ?.addEventListener('change', () =>
        Stats._chartMettreAJourProg()
      );
    document.getElementById('sel-graph-metric')
      ?.addEventListener('change', () =>
        Stats._chartMettreAJourProg()
      );
  },

  _chartChangerPeriode(btn) {
    document.querySelectorAll('[data-periode]').forEach(b => {
      b.style.background   = 'var(--bg-input)';
      b.style.borderColor  = 'var(--border-color)';
      b.style.color        = 'var(--text-muted)';
    });
    btn.style.background  = 'var(--fd-indigo)';
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.color       = 'white';
    Stats._chartMettreAJourProg();
  },

  _chartMettreAJourProg() {
    const ref    = document.getElementById('sel-graph-exo')?.value;
    const metric = document.getElementById('sel-graph-metric')?.value
      || 'rm1';
    const periode = document.querySelector(
      '[data-periode][style*="var(--fd-indigo)"]'
    )?.dataset?.periode || '30';

    const ph     = document.getElementById('chart-prog-placeholder');
    const canvas = document.getElementById('chart-progression');

    if (!ref) {
      if (ph)     ph.style.display     = 'block';
      if (canvas) canvas.style.display = 'none';
      return;
    }

    const prog = Stats.getProgressionExercice(ref, parseInt(periode));
    if (!prog.length) {
      if (ph) {
        ph.style.display  = 'block';
        ph.textContent    = 'Pas encore assez de données';
      }
      if (canvas) canvas.style.display = 'none';
      return;
    }

    if (ph)     ph.style.display     = 'none';
    if (canvas) canvas.style.display = 'block';

    Stats._detruireCharts(['chart-progression']);

    const metricColors = {
      rm1:'#bfa1ff', poids:'#4b4bf9', reps:'#8bf0bb'
    };
    const metricLabels = {
      rm1:'1RM estimé (kg)', poids:'Poids soulevé (kg)',
      reps:'Répétitions'
    };
    const color = metricColors[metric];

    Stats._charts['chart-progression'] = new Chart(canvas, {
      type: 'line',
      data: {
        labels:   prog.map(p => p.label),
        datasets: [{
          label:               metricLabels[metric],
          data:                prog.map(p => p[metric]||0),
          borderColor:         color,
          backgroundColor:     color + '22',
          borderWidth:         2.5,
          pointRadius:         5,
          pointHoverRadius:    7,
          pointBackgroundColor:color,
          tension:             0.35,
          fill:                true
        }]
      },
      options: Stats._chartOptions({
        plugins: {
          legend: {
            display: true,
            labels:  { color:'#888', font:{ size:11 } }
          },
          tooltip: {
            backgroundColor: '#09092d',
            titleColor:      '#fff',
            bodyColor:       color,
            borderColor:     color,
            borderWidth:     1
          }
        }
      })
    });
  },

 // ════════════════════════════════════════════════════════════
// CALENDRIER TAB — ✅ v6.0 navigation data-attributes
// ════════════════════════════════════════════════════════════
_renderCalendrier(el, annee = null, mois = null) {
  if (!el) {
    el = document.getElementById('stats-content');
    if (!el) return;
  }
  const today = new Date();
  const an    = annee !== null ? annee : today.getFullYear();
  const mo    = mois  !== null ? mois  : today.getMonth();

  const heatmap   = this.getHeatmap(24);
  const nomsMois  = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  const nomsJours = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  const premierJour = new Date(an, mo, 1);
  const offsetDebut = (premierJour.getDay() + 6) % 7;
  const nbJours     = new Date(an, mo + 1, 0).getDate();
  const dateDebut   = Utils.storage.get('ft_date_debut', null);

  let seancesMois = 0, manqueesMois = 0;
  for (let j = 1; j <= nbJours; j++) {
    const d = `${an}-${String(mo+1).padStart(2,'0')}-${String(j).padStart(2,'0')}`;
    if (heatmap[d] === 'done') seancesMois++;
    if (heatmap[d] === 'missed'
        && (!dateDebut || d >= dateDebut)) manqueesMois++;
  }

  let cellules = '';
  for (let i = 0; i < offsetDebut; i++) {
    cellules += `<div style="min-height:48px"></div>`;
  }

  for (let j = 1; j <= nbJours; j++) {
    const d  = `${an}-${String(mo+1).padStart(2,'0')}-${String(j).padStart(2,'0')}`;
    const etat          = heatmap[d] || 'none';
    const estAuj        = d === Utils.aujourd_hui();
    const estFut        = d > Utils.aujourd_hui();
    const estAvantDebut = dateDebut && d < dateDebut;
    const etatAffiche   = estAvantDebut ? 'none' : etat;

    const bg = etatAffiche === 'done'   ? 'var(--fd-indigo)'
             : etatAffiche === 'missed' ? 'rgba(255,141,150,0.3)'
             : etatAffiche === 'rest'   ? 'rgba(139,240,187,0.15)'
             : estFut                   ? 'transparent'
             :                            'var(--bg-input)';

    cellules += `
      <div ${estFut ? '' : `onclick="Stats._afficherJour('${d}')"`}
           style="background:${bg};
                  border:${estAuj
                    ? '2px solid var(--fd-lemon)'
                    : '1px solid var(--border-color)'};
                  border-radius:var(--radius-sm);
                  min-height:48px;padding:4px;
                  cursor:${estFut ? 'default' : 'pointer'}">
        <div style="font-size:.72rem;
                    font-weight:${estAuj ? '800' : '500'};
                    color:${estAuj ? 'var(--fd-lemon)'
                      : etatAffiche === 'done'
                        ? 'white' : 'var(--text-muted)'}">
          ${j}
        </div>
        <div style="font-size:.8rem;text-align:center;margin-top:2px">
          ${etatAffiche === 'done'   ? '✅'
          : etatAffiche === 'missed' ? '❌'
          : etatAffiche === 'rest'   ? '😴' : ''}
        </div>
      </div>`;
  }

  const isCurrentMonth = an === today.getFullYear()
    && mo === today.getMonth();

  // ✅ FIX v6.0 — Calculer mois précédent/suivant
  const anPrev = mo === 0  ? an - 1 : an;
  const moPrev = mo === 0  ? 11 : mo - 1;
  const anNext = mo === 11 ? an + 1 : an;
  const moNext = mo === 11 ? 0  : mo + 1;

  el.innerHTML = `
    <div class="flex items-center justify-between mb-md">
      <button
        data-cal-nav="prev"
        data-cal-an="${anPrev}"
        data-cal-mo="${moPrev}"
        onclick="Stats._renderCalendrier(
          document.getElementById('stats-content'),
          parseInt(this.dataset.calAn),
          parseInt(this.dataset.calMo))"
        style="width:36px;height:36px;border-radius:50%;
               border:1px solid var(--border-color);
               background:var(--bg-input);
               color:var(--text-primary);
               font-size:.9rem;cursor:pointer">◄</button>
      <div style="text-align:center">
        <div style="font-weight:700;font-size:1.1rem">
          ${nomsMois[mo]} ${an}</div>
        <div style="font-size:.72rem;color:var(--text-muted)">
          ${seancesMois} séance${seancesMois>1?'s':''} ·
          ${manqueesMois} manquée${manqueesMois>1?'s':''}
        </div>
      </div>
      <button
        data-cal-nav="next"
        data-cal-an="${anNext}"
        data-cal-mo="${moNext}"
        ${isCurrentMonth ? 'disabled' : ''}
        onclick="Stats._renderCalendrier(
          document.getElementById('stats-content'),
          parseInt(this.dataset.calAn),
          parseInt(this.dataset.calMo))"
        style="width:36px;height:36px;border-radius:50%;
               border:1px solid var(--border-color);
               background:var(--bg-input);
               color:var(--text-primary);
               font-size:.9rem;cursor:pointer;
               opacity:${isCurrentMonth ? '.3' : '1'}">►</button>
    </div>

    <div class="stats-grid mb-md">
      <div class="stat-card">
        <span class="stat-value" style="color:var(--fd-indigo)">
          ${seancesMois}</span>
        <span class="stat-label">Séances</span>
      </div>
      <div class="stat-card">
        <span class="stat-value" style="color:var(--fd-coral)">
          ${manqueesMois}</span>
        <span class="stat-label">Manquées</span>
      </div>
      <div class="stat-card">
        <span class="stat-value" style="color:var(--fd-mint)">
          ${Math.round((seancesMois / Math.max(1,
            seancesMois+manqueesMois)) * 100)}%</span>
        <span class="stat-label">Assiduité</span>
      </div>
      <div class="stat-card">
        <span class="stat-value" style="color:var(--fd-lemon)">
          ${Tracker.getStreak().count}🔥</span>
        <span class="stat-label">Streak</span>
      </div>
    </div>

    <div class="card mb-md" style="padding:var(--space-sm)">
      <div style="display:grid;
                  grid-template-columns:repeat(7,1fr);
                  gap:3px;margin-bottom:4px">
        ${nomsJours.map(j => `
          <div style="text-align:center;font-size:.65rem;
                      font-weight:600;color:var(--text-muted);
                      padding:4px 0">${j}</div>`).join('')}
      </div>
      <div style="display:grid;
                  grid-template-columns:repeat(7,1fr);
                  gap:3px">${cellules}</div>
    </div>

    <div id="detail-jour"></div>
  `;
},

  _afficherJour(dateStr) {
    const el = document.getElementById('detail-jour');
    if (!el) return;
    const heatmap  = this.getHeatmap(24);
    const etat     = heatmap[dateStr] || 'none';
    let seanceData = null;

    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (cle?.startsWith(`ft_seance_${dateStr}`)) {
        try {
          seanceData = JSON.parse(localStorage.getItem(cle));
        } catch(e) {}
        break;
      }
    }

    el.innerHTML = `
      <div class="card mt-md"
           style="border-color:${
             etat === 'done'   ? 'var(--fd-indigo)'
           : etat === 'missed' ? 'var(--fd-coral)'
           : etat === 'rest'   ? 'var(--fd-mint)'
           :                     'var(--border-color)'}">
        <div class="flex items-center justify-between mb-md">
          <div>
            <div style="font-weight:700">
              ${Utils.formatDateLong(dateStr)}
              ${dateStr === Utils.aujourd_hui()
                ? `<span class="chip chip-lemon"
                         style="font-size:.6rem;margin-left:4px">
                     Aujourd'hui</span>` : ''}
            </div>
            <div style="font-size:.75rem;color:var(--text-muted)">
              ${etat === 'done'   ? '✅ Séance complétée'
              : etat === 'missed' ? '❌ Séance manquée'
              : etat === 'rest'   ? '😴 Repos'
              :                     '⬜ Pas de données'}
            </div>
          </div>
          <button onclick="document.getElementById(
                    'detail-jour').innerHTML=''"
                  style="background:none;border:none;
                         color:var(--text-muted);
                         font-size:1.2rem;cursor:pointer">✕</button>
        </div>
        ${seanceData?.complete ? `
          <div class="stats-grid mb-md">
            <div class="stat-card">
              <span class="stat-value" style="font-size:1rem">
                ${Utils.formatDuree(seanceData.duree||0)}</span>
              <span class="stat-label">Durée</span>
            </div>
            <div class="stat-card">
              <span class="stat-value" style="font-size:1rem">
                ${Utils.formatVolume(seanceData.volumeTotal||0)}</span>
              <span class="stat-label">Volume</span>
            </div>
            <div class="stat-card">
              <span class="stat-value" style="font-size:1rem">
                ${seanceData.series?.length||0}</span>
              <span class="stat-label">Séries</span>
            </div>
            <div class="stat-card">
              <span class="stat-value" style="font-size:1rem">
                ${seanceData.rpesMoyen||'—'}</span>
              <span class="stat-label">RPE</span>
            </div>
          </div>
          ${[...new Set(
            (seanceData.series||[]).map(s => s.exerciceRef)
          )].map(ref => {
            const ex     = window.EXERCICES?.[ref] || {};
            const series = (seanceData.series||[])
              .filter(s => s.exerciceRef === ref);
            const max    = Math.max(...series.map(s => s.poids||0), 0);
            return `
              <div class="flex justify-between"
                   style="font-size:.82rem;
                          padding:var(--space-xs) 0;
                          border-bottom:1px solid var(--border-color)">
                <span>${ex.emoji||'💪'} ${ex.nom||ref}</span>
                <span style="font-weight:600;
                             color:var(--fd-indigo)">
                  ${max}kg × ${series.length} séries</span>
              </div>`;
          }).join('')}` : `
          <div style="text-align:center;padding:var(--space-md);
                      color:var(--text-muted)">
            <div style="font-size:2rem">
              ${etat === 'rest' ? '😴' : '⬜'}</div>
            <div style="font-size:.85rem;margin-top:4px">
              ${etat === 'rest' ? 'Jour de repos' : 'Aucune donnée'}
            </div>
          </div>`}
      </div>
    `;
    el.scrollIntoView({ behavior:'smooth', block:'nearest' });
  },

  // ════════════════════════════════════════════════════════
  // TROPHÉES TAB
  // ════════════════════════════════════════════════════════
  _renderTrophees(el) {
    Gamification.renderGamificationTab(el);
  }
};

window.Stats = Stats;
console.log('✅ Stats v5.0 chargé — Heatmap musculaire + Rapport + Historique charges Live');
