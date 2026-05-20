/* ============================================================
   PowerApp — App.js v3.0 CORRIGÉ
   Point d'entrée principal + Navigation + Init + UI
   ============================================================ */

'use strict';

window._pageActive    = 'home';
window._pageHistory   = [];
window._seanceActive  = null;
window._timerInterval = null;

// ════════════════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════════════════
function naviguer(page, options = {}) {
  try {
    document.querySelectorAll('.page').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const navPages = ['home','training','live','stats','nutrition'];
    if (navPages.includes(page)) {
      document.getElementById(`nav-${page}`)?.classList.add('active');
    }

    const pageEl = document.getElementById(`page-${page}`)
      || document.getElementById('page-home');

    if (!pageEl) {
      console.warn(`[App] Page introuvable: ${page}`);
      return;
    }

    pageEl.classList.add('active');
    pageEl.style.display = 'block';

    _updateHeader(page);

    pageEl.scrollTop = 0;
    window.scrollTo(0, 0);

    if (window._pageActive !== page) {
      window._pageHistory.push(window._pageActive);
      if (window._pageHistory.length > 10) {
        window._pageHistory.shift();
      }
    }
    window._pageActive = page;

    _rendreContenu(page, pageEl, options);

    UI.fermerMenu();

  } catch(e) {
    console.error('[App] Erreur navigation:', e);
  }
}

function retourArriere() {
  const prev = window._pageHistory.pop();
  if (prev) naviguer(prev);
  else naviguer('home');
}

// ════════════════════════════════════════════════════════════
// HEADER
// ════════════════════════════════════════════════════════════
function _updateHeader(page) {
  const configs = {
    home:         { emoji:'⚡', titre:'PowerApp'           },
    training:     { emoji:'📅', titre:'Programme'          },
    live:         { emoji:'💪', titre:'Séance live'        },
    stats:        { emoji:'📊', titre:'Statistiques'       },
    profil:       { emoji:'👤', titre:'Profil'             },
    coach:        { emoji:'🤖', titre:'Coach IA'           },
    defis:        { emoji:'🏆', titre:'Défis'              },
    predict:      { emoji:'📈', titre:'Prédictions'        },
    share:        { emoji:'📤', titre:'Partage'            },
    gamification: { emoji:'⭐', titre:'Niveaux & XP'       },
    history:      { emoji:'📅', titre:'Historique'         },
    photos:       { emoji:'📸', titre:'Photos'             },
    social:       { emoji:'📱', titre:'Réseaux'            },
    supersets:    { emoji:'⚡', titre:'Supersets'          },
    offline:      { emoji:'📵', titre:'Hors-ligne'         },
    settings:     { emoji:'⚙️', titre:'Paramètres'         },
    nutrition:    { emoji:'🥗', titre:'Nutrition'          },
    mon_profil:   { emoji:'👤', titre:'Mon profil'         },
    journal:      { emoji:'📔', titre:'Journal'            },
    objectifs:    { emoji:'🎯', titre:'Objectifs'          },
    circuit:      { emoji:'🔄', titre:'Circuit Training'   },
    adaptatif:    { emoji:'🧠', titre:'Programme Adaptatif'},
    galerie:      { emoji:'💪', titre:'Galerie exercices'  },
    blessures:    { emoji:'🩹', titre:'Blessures'          }
  };

  const cfg = configs[page] || configs.home;
  const emojiEl = document.getElementById('header-emoji');
  const titleEl = document.getElementById('header-title');
  if (emojiEl) emojiEl.textContent = cfg.emoji;
  if (titleEl) titleEl.textContent = cfg.titre;
  _updateHeaderXP();
}

function _updateHeaderXP() {
  const el = document.getElementById('header-xp');
  if (!el) return;
  try {
    const xp = Gamification.getXP();
    el.innerHTML = `
      <span style="font-size:.72rem;font-weight:700;
                   color:var(--fd-lemon)">
        ${xp.niveau.emoji} Niv.${xp.niveau.numero}
      </span>
      <span style="font-size:.65rem;color:var(--text-muted);
                   margin-left:4px">
        ${xp.total}XP
      </span>`;
  } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// RENDU DES PAGES
// ════════════════════════════════════════════════════════════
function _rendreContenu(page, container, options = {}) {
  try {
    switch(page) {
      case 'home':         _rendreHome(container);                        break;
      case 'training':     _rendreTraining(container);                    break;
      case 'live':         _rendreLive(container, options);               break;
      case 'stats':        Stats.render(container);                       break;
      case 'profil':       _rendreProfil(container);                      break;
      case 'coach':        Coach.renderCoachTab(container);               break;
      case 'defis':        Defis.render(container);                       break;
      case 'predict':      Predict.render(container);                     break;
      case 'share':        Share.render(container);                       break;
      case 'gamification': Gamification.renderGamificationTab(container); break;
      case 'history':      History.render(container);                     break;
      case 'photos':       Photos.render(container);                      break;
      case 'social':       Social.render(container);                      break;
      case 'supersets':    Superset.render(container);                    break;
      case 'offline':      Offline.render(container);                     break;
      case 'settings':     _rendreSettings(container);                    break;
      case 'nutrition':
        try { Nutrition.render(container); }
        catch(e) { _rendreNutrition(container); }
        break;
      case 'circuit':
        try { Circuit.render(container); }
        catch(e) { _rendrePlaceholder(container,'🔄','Circuit Training','Module circuit non disponible.'); }
        break;
      case 'adaptatif':
        try { ProgrammeAdaptatif.render(container); }
        catch(e) { _rendrePlaceholder(container,'🧠','Programme Adaptatif','Analyse ta progression.'); }
        break;
      case 'galerie':
        try { GalerieExercices.render(container); }
        catch(e) { _rendrePlaceholder(container,'💪','Galerie exercices','Tous les exercices disponibles.'); }
        break;
      case 'mon_profil': _renderMonProfil(container); break;
      case 'journal':
        try { Stats.renderJournal(container); }
        catch(e) { _rendrePlaceholder(container,'📔','Journal','Ton journal d\'entraînement.'); }
        break;
      case 'objectifs':
        try { Stats.renderObjectifs(container); }
        catch(e) { _rendrePlaceholder(container,'🎯','Objectifs','Définis tes objectifs.'); }
        break;
      case 'blessures':
        try { Stats.renderBlessures(container); }
        catch(e) { _rendrePlaceholder(container,'🩹','Blessures','Suivi de tes blessures.'); }
        break;
      default: _rendreHome(container);
    }
  } catch(e) {
    console.error(`[App] Erreur rendu page ${page}:`, e);
    container.innerHTML = `
      <div class="card mt-md" style="text-align:center;padding:var(--space-xl)">
        <div style="font-size:2rem">⚠️</div>
        <p style="color:var(--text-muted);margin-top:var(--space-sm)">
          Erreur chargement de la page.<br>
          <button onclick="naviguer('home')" class="btn-secondary mt-md">
            Retour à l'accueil
          </button>
        </p>
      </div>`;
  }
}

function _rendrePlaceholder(container, emoji, titre, desc) {
  container.innerHTML = `
    <div class="card mt-md" style="text-align:center;padding:var(--space-xl)">
      <div style="font-size:2.5rem;margin-bottom:var(--space-sm)">${emoji}</div>
      <div style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-sm)">${titre}</div>
      <p style="color:var(--text-muted);font-size:.85rem;line-height:1.5">${desc}</p>
      <button onclick="retourArriere()" class="btn-secondary mt-lg">← Retour</button>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// ✅ HELPER — Adapter exercices selon temps disponible
// ════════════════════════════════════════════════════════════
function getExercicesSelonTemps(exercices, minutes) {
  if (!Array.isArray(exercices)) return [];
  if (minutes <= 30) return exercices.slice(0, 3);
  if (minutes <= 60) return exercices.slice(0, 5);
  if (minutes <= 90) return exercices.slice(0, 7);
  return exercices; // 120 min = séance complète
}

// ════════════════════════════════════════════════════════════
// ✅ RECHERCHE GLOBALE DEPUIS HOME
// ════════════════════════════════════════════════════════════
function rechercherDepuisHome(val) {
  const q = (val || '').toLowerCase().trim();
  if (!q) return;

  // ✅ Index pages navigables
  const pages = [
    { mots:['programme','training','séance','seance','planning'], page:'training'      },
    { mots:['live','entrainement','entraînement','démarrer'],      page:'live'          },
    { mots:['stats','statistiques','graphique'],                   page:'stats'         },
    { mots:['nutrition','manger','repas','proteine','calories'],   page:'nutrition'     },
    { mots:['galerie','exercice','mouvement'],                     page:'galerie'       },
    { mots:['coach','ia','conseil'],                               page:'coach'         },
    { mots:['défis','defis','challenge'],                          page:'defis'         },
    { mots:['profil','modifier','avatar'],                         page:'mon_profil'    },
    { mots:['parametre','paramètres','settings','notif'],          page:'settings'      },
    { mots:['historique','history'],                               page:'history'       },
    { mots:['photos','photo','corps'],                             page:'photos'        },
    { mots:['objectif','objectifs','but'],                         page:'objectifs'     },
    { mots:['blessure','blessures','douleur'],                     page:'blessures'     },
    { mots:['journal'],                                            page:'journal'       },
    { mots:['superset','supersets'],                               page:'supersets'     },
    { mots:['circuit'],                                            page:'circuit'       },
    { mots:['adaptatif','adaptation','intelligent'],               page:'adaptatif'     },
    { mots:['xp','niveau','gamification','trophee','trophée'],     page:'gamification'  },
    { mots:['partage','share','social'],                           page:'share'         },
    { mots:['hors-ligne','offline','sync'],                        page:'offline'       }
  ];

  // ✅ Chercher une page correspondante
  for (const entry of pages) {
    if (entry.mots.some(m => q.includes(m))) {
      naviguer(entry.page);
      return;
    }
  }

  // ✅ Chercher un exercice dans la galerie
  const match = Object.entries(window.EXERCICES || {}).find(([_, ex]) =>
    ex.nom.toLowerCase().includes(q) ||
    (ex.muscle || '').toLowerCase().includes(q)
  );

  if (match) {
    naviguer('galerie');
    setTimeout(() => {
      try { GalerieExercices._filtrerSearch(q); } catch(e) {}
    }, 350);
    return;
  }

  Utils.toast(`Aucun résultat pour "${val}"`, 'info', 1500);
}

// ════════════════════════════════════════════════════════════
// PAGE HOME
// ════════════════════════════════════════════════════════════
function _rendreHome(container) {
  let profil   = { nom:'Athlète', avatar:'💪' };
  let seance   = null, prochaine = null;
  let infos    = { label:'S1', cycle:1, phase:{ emoji:'🌱', nom:'Reprise', couleur:'#8bf0bb' } };
  let streak   = { count:0, max:0 };
  let xp       = { total:0, pourcentage:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
  let analyse  = { seances:0, objectif:4, volume:0, rpe:0 };
  let msg      = { emoji:'💡', message:'Bonne séance !' };
  let defisSem = [];

  try { profil    = Tracker.getProfil();                } catch(e) {}
  try { seance    = Programme.getSeanceduJour();        } catch(e) {}
  try { prochaine = Programme.getProchaineSeance();     } catch(e) {}
  try { infos     = Programme.getInfosProgramme();      } catch(e) {}
  try { streak    = Tracker.getStreak();                } catch(e) {}
  try { xp        = Gamification.getXP();              } catch(e) {}
  try { analyse   = Coach.getAnalyseSemaine();          } catch(e) {}
  try { msg       = Coach.getMessageDuJour();           } catch(e) {}
  try {
    defisSem = (Defis.mettreAJourProgression() || [])
      .filter(d => !d.complete).slice(0, 2);
  } catch(e) {}

  const heure    = new Date().getHours();
  const salut    = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir';
  const dateLabel = new Date().toLocaleDateString('fr-FR',{
    weekday:'long', day:'numeric', month:'short'
  });

  // ✅ Temps salle mémorisé
  const tempsSalle = Utils.storage.get('ft_temps_salle', 60);

  // ✅ Exercices adaptés selon temps
  const exosAdaptes = seance
    ? getExercicesSelonTemps(seance.exercices || [], tempsSalle)
    : [];

  container.innerHTML = `

    <!-- ══ GREETING ══ -->
    <div style="padding:8px 0 16px">
      <div style="font-size:.7rem;color:var(--text-muted);font-weight:600;
                  margin-bottom:3px;display:flex;align-items:center;gap:6px">
        <div style="width:5px;height:5px;border-radius:50%;
                    background:var(--fd-mint);
                    box-shadow:0 0 6px var(--fd-mint)"></div>
        ${dateLabel} · ${infos.label} · Cycle ${infos.cycle}
      </div>
      <div style="font-size:1.6rem;font-weight:800;
                  letter-spacing:-.03em;line-height:1.1">
        ${salut},
        <span style="background:linear-gradient(135deg,#ffffff 0%,var(--fd-lavender) 100%);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;
                     background-clip:text">
          ${profil.nom}
        </span>
        ${profil.avatar || '💪'}
      </div>
      <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px;
                  display:flex;align-items:center;gap:5px">
        <div style="width:4px;height:4px;border-radius:50%;
                    background:var(--fd-indigo)"></div>
        ${infos.phase.emoji} ${infos.phase.nom} · Prise de masse
      </div>
    </div>

    <!-- ══ BARRE DE RECHERCHE GLOBALE ══ -->
    <div style="position:relative;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:10px;
                  background:var(--bg-input);
                  border:1px solid var(--border-color);
                  border-radius:var(--radius-md);
                  padding:10px 14px;
                  transition:border-color .2s"
           id="home-search-wrap">
        <span style="font-size:1rem;flex-shrink:0">🔍</span>
        <input id="home-search-input"
               type="text"
               placeholder="Rechercher une séance, un exercice, une page…"
               autocomplete="off"
               style="flex:1;background:none;border:none;
                      color:var(--text-primary);font-size:.82rem;
                      outline:none"
               oninput="_homeSearchLive(this.value)"
               onkeydown="if(event.key==='Enter'){
                 rechercherDepuisHome(this.value);
                 this.blur();
               }" />
        <button id="home-search-clear"
                onclick="_homeSearchClear()"
                style="display:none;background:none;border:none;
                       color:var(--text-muted);font-size:1rem;
                       cursor:pointer;padding:0">✕</button>
      </div>
      <!-- Suggestions -->
      <div id="home-search-suggestions"
           style="display:none;position:absolute;top:100%;left:0;right:0;
                  z-index:200;background:var(--bg-card);
                  border:1px solid var(--border-color);
                  border-radius:var(--radius-md);
                  margin-top:4px;overflow:hidden;
                  box-shadow:0 8px 24px rgba(0,0,0,0.3)">
      </div>
    </div>

    <!-- ══ STREAK + XP RINGS ══ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;
                gap:10px;margin-bottom:14px">

      <!-- Streak -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);padding:14px;
                  display:flex;align-items:center;gap:12px;
                  position:relative;overflow:hidden;cursor:pointer"
           onclick="naviguer('stats')">
        <div style="position:absolute;top:-15px;right:-15px;width:60px;height:60px;
                    border-radius:50%;background:rgba(249,239,119,0.06)"></div>
        <svg width="48" height="48" viewBox="0 0 48 48" style="flex-shrink:0">
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="rgba(249,239,119,0.12)" stroke-width="4"/>
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="var(--fd-lemon)" stroke-width="4"
                  stroke-linecap="round" stroke-dasharray="126"
                  stroke-dashoffset="${126 - Math.min(126, streak.count * 4)}"
                  transform="rotate(-90 24 24)"
                  style="filter:drop-shadow(0 0 3px var(--fd-lemon))"/>
          <text x="24" y="29" text-anchor="middle"
                fill="var(--fd-lemon)" font-size="13" font-weight="800">🔥</text>
        </svg>
        <div>
          <div style="font-size:1.3rem;font-weight:800;
                      color:var(--fd-lemon);line-height:1">${streak.count}</div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">Streak</div>
          <div style="font-size:.58rem;color:var(--text-muted);margin-top:1px">jours consec.</div>
        </div>
      </div>

      <!-- XP -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);padding:14px;
                  display:flex;align-items:center;gap:12px;
                  position:relative;overflow:hidden;cursor:pointer"
           onclick="naviguer('gamification')">
        <div style="position:absolute;top:-15px;right:-15px;width:60px;height:60px;
                    border-radius:50%;background:rgba(75,75,249,0.08)"></div>
        <svg width="48" height="48" viewBox="0 0 48 48" style="flex-shrink:0">
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="rgba(75,75,249,0.15)" stroke-width="4"/>
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="var(--fd-indigo)" stroke-width="4"
                  stroke-linecap="round" stroke-dasharray="126"
                  stroke-dashoffset="${126 - Math.min(126,(xp.pourcentage/100)*126)}"
                  transform="rotate(-90 24 24)"
                  style="filter:drop-shadow(0 0 3px var(--fd-indigo))"/>
          <text x="24" y="29" text-anchor="middle"
                fill="var(--fd-lavender)" font-size="10" font-weight="800">
            N${xp.niveau.numero}
          </text>
        </svg>
        <div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-lavender);line-height:1">${xp.total}</div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      text-transform:uppercase;letter-spacing:.06em;margin-top:2px">XP total</div>
          <div style="font-size:.58rem;color:var(--text-muted);margin-top:1px">${xp.niveau.nom}</div>
        </div>
      </div>
    </div>

    <!-- ══ HERO SÉANCE ══ -->
    ${seance ? `
      <div style="border-radius:var(--radius-xl);padding:20px;margin-bottom:14px;
                  position:relative;overflow:hidden;
                  background:linear-gradient(135deg,
                    rgba(75,75,249,0.22) 0%,
                    rgba(75,75,249,0.07) 55%,
                    rgba(191,161,255,0.05) 100%);
                  border:1px solid rgba(75,75,249,0.4);
                  box-shadow:0 4px 24px rgba(75,75,249,0.2)">
        <div style="position:absolute;top:-50px;right:-30px;width:180px;height:180px;
                    background:radial-gradient(circle,rgba(75,75,249,0.2) 0%,transparent 70%);
                    pointer-events:none"></div>
        <div style="display:flex;align-items:center;gap:6px;
                    margin-bottom:10px;position:relative;z-index:1">
          <div style="width:7px;height:7px;border-radius:50%;
                      background:var(--fd-indigo);
                      box-shadow:0 0 8px var(--fd-indigo);
                      animation:pulse 2s infinite"></div>
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.12em;color:var(--fd-indigo)">
            Séance du jour
          </div>
        </div>
        <div style="font-size:1.4rem;font-weight:800;letter-spacing:-.02em;
                    margin-bottom:4px;position:relative;z-index:1">
          ${seance.emoji} ${seance.nom}
        </div>
        <div style="font-size:.75rem;color:var(--text-muted);
                    margin-bottom:16px;position:relative;z-index:1">
          ~${seance.duree_estimee}min · ${seance.exercices?.length || 0} exercices
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;
                    position:relative;z-index:1">
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${(seance.muscles || []).map(m => `
              <span style="padding:4px 10px;border-radius:99px;
                           font-size:.6rem;font-weight:700;
                           text-transform:uppercase;letter-spacing:.04em;
                           background:rgba(75,75,249,0.2);color:var(--fd-lavender);
                           border:1px solid rgba(75,75,249,0.3)">${m}</span>
            `).join('')}
          </div>
          <button onclick="naviguer('live')"
                  style="display:flex;align-items:center;gap:8px;
                         padding:12px 20px;background:var(--fd-indigo);color:white;
                         border:none;border-radius:99px;font-size:.82rem;font-weight:700;
                         cursor:pointer;white-space:nowrap;
                         box-shadow:0 4px 20px rgba(75,75,249,0.5)">
            ▶ Démarrer
          </button>
        </div>
      </div>` : `
      <div style="border-radius:var(--radius-xl);padding:20px;margin-bottom:14px;
                  background:rgba(139,240,187,0.06);
                  border:1px solid rgba(139,240,187,0.2);text-align:center">
        <div style="font-size:2rem;margin-bottom:6px">😴</div>
        <div style="font-weight:700;font-size:1rem">Jour de repos</div>
        ${prochaine ? `
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
            Prochaine : ${prochaine.emoji} ${prochaine.nom}
            ${prochaine.dansJours > 0 ? `dans ${prochaine.dansJours}j` : 'demain'}
          </div>` : ''}
      </div>`}

    <!-- ══ TEMPS À LA SALLE + SÉANCE ADAPTÉE ══ -->
    <div style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-lg);
                padding:16px;margin-bottom:14px">

      <div style="display:flex;align-items:center;gap:7px;margin-bottom:12px">
        <div style="width:3px;height:14px;border-radius:99px;
                    background:var(--fd-lemon)"></div>
        <span style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                     letter-spacing:.1em;color:var(--text-muted)">
          ⏱ Temps disponible à la salle
        </span>
      </div>

      <!-- Boutons temps -->
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
        ${[
          { min:30,  label:'30 min', icon:'⚡', desc:'Express'  },
          { min:60,  label:'1 h',    icon:'💪', desc:'Standard' },
          { min:90,  label:'1h30',   icon:'🏋️', desc:'Complet'  },
          { min:120, label:'2 h',    icon:'🔥', desc:'Intense'  }
        ].map(t => `
          <button onclick="_choisirTempsSalle(${t.min})"
                  id="btn-temps-${t.min}"
                  style="padding:10px 4px;text-align:center;
                         background:${tempsSalle === t.min
                           ? 'rgba(75,75,249,0.25)'
                           : 'rgba(75,75,249,0.08)'};
                         border:2px solid ${tempsSalle === t.min
                           ? 'var(--fd-indigo)'
                           : 'rgba(75,75,249,0.15)'};
                         border-radius:var(--radius-md);
                         cursor:pointer;transition:all .2s">
            <div style="font-size:1rem;margin-bottom:3px">${t.icon}</div>
            <div style="font-size:.72rem;font-weight:800;
                        color:${tempsSalle === t.min
                          ? 'var(--fd-indigo)'
                          : 'var(--text-primary)'}">
              ${t.label}
            </div>
            <div style="font-size:.55rem;color:var(--text-muted);margin-top:1px">
              ${t.desc}
            </div>
          </button>
        `).join('')}
      </div>

      <!-- Résultat recommandation -->
      <div id="temps-salle-result"
           style="padding:10px 12px;
                  background:rgba(75,75,249,0.08);
                  border:1px solid rgba(75,75,249,0.15);
                  border-radius:var(--radius-sm);
                  font-size:.75rem;color:var(--text-muted)">
        ${_getRecommandationTemps(tempsSalle, seance)}
      </div>

      <!-- ✅ Exercices adaptés selon temps -->
      ${seance && exosAdaptes.length > 0 ? `
        <div style="margin-top:12px">
          <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                      letter-spacing:.08em;color:var(--text-muted);margin-bottom:8px">
            Programme adapté · ${exosAdaptes.length} exercices
          </div>
          <div style="display:flex;flex-direction:column;gap:5px">
            ${exosAdaptes.map((ex, i) => {
              const exoData = (window.EXERCICES || {})[ex.ref] || {};
              const pr = (() => { try { return Tracker.getPR(ex.ref); } catch(e) { return null; } })();
              return `
                <div onclick="naviguer('live')"
                     style="display:flex;align-items:center;gap:10px;
                            padding:9px 12px;background:var(--bg-input);
                            border-radius:var(--radius-sm);
                            border:1px solid var(--border-color);cursor:pointer">
                  <div style="width:30px;height:30px;border-radius:8px;flex-shrink:0;
                              background:rgba(75,75,249,0.12);
                              border:1px solid rgba(75,75,249,0.2);
                              display:flex;align-items:center;
                              justify-content:center;font-size:.9rem">
                    ${exoData.emoji || '💪'}
                  </div>
                  <div style="flex:1">
                    <div style="font-size:.8rem;font-weight:700">${exoData.nom || ex.ref}</div>
                    <div style="font-size:.6rem;color:var(--text-muted);margin-top:1px">
                      ${exoData.muscle || ''}
                      ${pr ? `· <span style="color:var(--fd-lemon)">PR ${pr.poids}kg</span>` : ''}
                    </div>
                  </div>
                  <div style="text-align:right;flex-shrink:0">
                    <div style="font-size:.75rem;font-weight:700;color:var(--fd-indigo)">
                      ${ex.series}×${ex.reps}
                    </div>
                    <div style="font-size:.58rem;color:var(--text-muted)">⏱ ${ex.repos || 75}s</div>
                  </div>
                </div>`;
            }).join('')}
          </div>
          <button onclick="naviguer('live')"
                  style="width:100%;margin-top:10px;padding:11px;
                         background:var(--fd-indigo);color:white;border:none;
                         border-radius:var(--radius-md);font-size:.82rem;
                         font-weight:700;cursor:pointer;
                         box-shadow:0 4px 16px rgba(75,75,249,0.4)">
            ▶ Démarrer cette séance
          </button>
        </div>` : ''}
    </div>

    <!-- ══ TIMERS REPOS ══ -->
    <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em;color:var(--text-muted);
                margin:14px 0 8px;display:flex;align-items:center;gap:8px">
      ⏱ Timers repos
      <div style="flex:1;height:1px;background:var(--border-color)"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);
                gap:7px;margin-bottom:14px">
      ${[
        { icon:'⚡', val:'45s',  label:'Express', sec:45  },
        { icon:'💪', val:'60s',  label:'Normal',  sec:60  },
        { icon:'🏋️', val:'90s',  label:'Force',   sec:90  },
        { icon:'🔥', val:'2min', label:'Lourd',   sec:120 }
      ].map(t => `
        <div onclick="TimerManager.demarrerRepos(${t.sec})"
             style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-md);
                    padding:12px 6px;text-align:center;cursor:pointer;transition:all .2s"
             onmousedown="this.style.transform='scale(.94)';
                          this.style.borderColor='rgba(75,75,249,0.4)'"
             onmouseup="this.style.transform='';
                        this.style.borderColor='rgba(255,255,255,0.08)'">
          <div style="font-size:1.2rem;margin-bottom:4px">${t.icon}</div>
          <div style="font-size:.78rem;font-weight:800;color:var(--fd-indigo)">${t.val}</div>
          <div style="font-size:.55rem;color:var(--text-muted);
                      text-transform:uppercase;letter-spacing:.04em;margin-top:1px">
            ${t.label}
          </div>
        </div>`).join('')}
    </div>

    <!-- ══ PLANNING SEMAINE ══ -->
    <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em;color:var(--text-muted);
                margin:14px 0 8px;display:flex;align-items:center;gap:8px">
      📅 Planning semaine
      <div style="flex:1;height:1px;background:var(--border-color)"></div>
    </div>
    <div style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-lg);
                padding:14px 16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;
                  align-items:center;margin-bottom:10px">
        <div style="font-size:.72rem;font-weight:700;color:var(--text-muted)">
          ${analyse.seances}/${analyse.objectif} séances
        </div>
        <div style="font-size:.72rem;font-weight:700;color:var(--fd-mint)">
          ${Math.round((analyse.seances / Math.max(analyse.objectif, 1)) * 100)}%
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px">
        ${(() => {
          const planning = (() => {
            try { return Programme.getSeancesSemaine(); } catch(e) { return []; }
          })();
          if (planning.length) {
            return planning.slice(0, 6).map(jour => `
              <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
                <div style="width:32px;height:32px;border-radius:10px;
                            display:flex;align-items:center;justify-content:center;
                            font-size:.7rem;font-weight:700;
                            ${jour.estAujourdhui
                              ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,0.5)'
                              : jour.seance
                                ? 'background:rgba(75,75,249,0.25);border:1px solid var(--fd-indigo);color:var(--fd-lavender)'
                                : 'background:var(--bg-input);border:1px solid var(--border-color);color:var(--text-muted)'}">
                  ${jour.estAujourdhui ? '▶' : jour.seance ? jour.seance.emoji : '·'}
                </div>
                <div style="font-size:.52rem;color:var(--text-muted);
                            text-transform:uppercase;font-weight:600">
                  ${jour.label}
                </div>
              </div>`).join('');
          }
          const jrsLabels = ['Lun','Mar','Mer','Jeu','Ven','Sam'];
          const todayIdx  = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
          return jrsLabels.map((l, i) => `
            <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
              <div style="width:32px;height:32px;border-radius:10px;
                          display:flex;align-items:center;justify-content:center;
                          font-size:.7rem;font-weight:700;
                          ${i === todayIdx
                            ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,0.5)'
                            : i < todayIdx
                              ? 'background:rgba(75,75,249,0.25);border:1px solid var(--fd-indigo);color:var(--fd-lavender)'
                              : 'background:var(--bg-input);border:1px solid var(--border-color);color:var(--text-muted)'}">
                ${i === todayIdx ? '▶' : i < todayIdx ? '✓' : '·'}
              </div>
              <div style="font-size:.52rem;color:var(--text-muted);
                          text-transform:uppercase;font-weight:600">${l}</div>
            </div>`).join('');
        })()}
      </div>
      <div class="progress-bar mt-sm">
        <div class="progress-fill"
             style="width:${Math.min(100,
               Math.round((analyse.seances / Math.max(analyse.objectif, 1)) * 100))}%">
        </div>
      </div>
    </div>

    <!-- ══ STATS SEMAINE ══ -->
<div style="display:grid;grid-template-columns:repeat(3,1fr);
            gap:8px;margin-bottom:14px">
  ${[
    { label:'Séances',  val:`${analyse.seances}/${analyse.objectif}`,
      color:'var(--fd-indigo)' },
    { label:'Volume',   val:Utils.formatVolume(analyse.volume),
      color:'var(--fd-mint)'  },
    { label:'RPE moy.', val:analyse.rpe > 0
        ? `${analyse.rpe}/10` : '—',
      color:'var(--fd-lemon)' }
  ].map(s => `
    <div style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-md);
                padding:12px 8px;text-align:center;
                cursor:pointer"
         onclick="naviguer('stats')">
      <div style="font-size:1rem;font-weight:800;
                  color:${s.color};line-height:1">
        ${s.val}
      </div>
      <div style="font-size:.55rem;color:var(--text-muted);
                  margin-top:4px;text-transform:uppercase;
                  letter-spacing:.04em">
        ${s.label}
      </div>
    </div>`).join('')}
</div>

<!-- ══ PROGRESSION LIVE ══ -->
${(() => {
  try {
    const seanceAujourdhui = Tracker.getSeanceDuJour();
    if (!seanceAujourdhui?.series?.length) return '';
    
    const series  = seanceAujourdhui.series || [];
    const volume  = seanceAujourdhui.volumeTotal || 0;
    const prsAuj  = seanceAujourdhui.prs?.length || 0;
    const nbSeries = series.length;
    const seanceBase = (window.SEANCES_BASE||{})[seanceAujourdhui.id];
    const totalSeries = (seanceBase?.exercices||[])
      .reduce((a,e) => a + (e.series||0), 0) || 1;
    const pct = Math.min(100, Math.round((nbSeries / totalSeries) * 100));

    return `
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),
                  rgba(139,240,187,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-lg);
                  padding:14px 16px;margin-bottom:14px"
           onclick="naviguer('live')">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:8px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;
                      letter-spacing:.1em;color:var(--fd-indigo)">
            ⚡ Séance en cours
          </div>
          <div style="font-size:.72rem;font-weight:700;
                      color:var(--fd-lemon)">
            ${pct}%
          </div>
        </div>
        <div style="height:6px;background:rgba(255,255,255,0.08);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:10px">
          <div style="height:100%;width:${pct}%;
                      background:linear-gradient(90deg,
                        var(--fd-indigo),var(--fd-mint));
                      border-radius:99px;
                      transition:width .5s ease"></div>
        </div>
        <div style="display:flex;gap:12px">
          <div style="text-align:center;flex:1">
            <div style="font-size:.95rem;font-weight:800;
                        color:var(--fd-mint)">${nbSeries}</div>
            <div style="font-size:.55rem;color:var(--text-muted);
                        text-transform:uppercase">Séries</div>
          </div>
          <div style="text-align:center;flex:1">
            <div style="font-size:.95rem;font-weight:800;
                        color:var(--fd-indigo)">
              ${Utils.formatVolume(volume)}
            </div>
            <div style="font-size:.55rem;color:var(--text-muted);
                        text-transform:uppercase">Volume</div>
          </div>
          ${prsAuj > 0 ? `
            <div style="text-align:center;flex:1">
              <div style="font-size:.95rem;font-weight:800;
                          color:var(--fd-lemon)">
                ${prsAuj} 🏆
              </div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          text-transform:uppercase">Records</div>
            </div>` : ''}
        </div>
      </div>`;
  } catch(e) { return ''; }
})()}

    <!-- ══ COACH DU JOUR ══ -->
    <div onclick="naviguer('coach')"
         style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-left:3px solid var(--fd-lavender);
                border-radius:var(--radius-lg);
                padding:14px 16px;margin-bottom:14px;cursor:pointer">
      <div style="font-size:.62rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--fd-lavender);margin-bottom:5px">
        ${msg.emoji} Coach du jour
      </div>
      <p style="font-size:.82rem;color:var(--text-secondary);line-height:1.55;margin:0">
        ${msg.message}
      </p>
    </div>

    <!-- ══ DÉFIS ══ -->
    ${defisSem.length > 0 ? `
      <div style="font-size:.58rem;font-weight:700;text-transform:uppercase;
                  letter-spacing:.1em;color:var(--text-muted);
                  margin:0 0 8px;display:flex;align-items:center;gap:8px">
        🏆 Défis en cours
        <div style="flex:1;height:1px;background:var(--border-color)"></div>
      </div>
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:12px;cursor:pointer"
           onclick="naviguer('defis')">
        ${defisSem.map(d => {
          const pct = Math.round((d.progression / Math.max(d.cible, 1)) * 100);
          return `
            <div style="margin-bottom:10px">
              <div style="display:flex;justify-content:space-between;
                          font-size:.78rem;margin-bottom:5px">
                <span>${d.emoji} ${d.titre}</span>
                <span style="color:var(--fd-lemon);font-weight:700">
                  ${d.progression}/${d.cible}
                </span>
              </div>
              <div style="height:4px;background:var(--bg-input);
                          border-radius:99px;overflow:hidden">
                <div style="height:100%;width:${pct}%;
                            background:linear-gradient(90deg,var(--fd-lemon),var(--fd-mint));
                            border-radius:99px"></div>
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

    <!-- ══ HUMEUR / FATIGUE ══ -->
    ${_renderHumeurFatigue()}

    <div style="height:8px"></div>
  `;

  // ✅ Attacher les events humeur/fatigue
  requestAnimationFrame(() => {
    _attacherHumeurFatigueEvents();
    _attacherSearchEvents();
  });
}

// ════════════════════════════════════════════════════════════
// ✅ HELPER — Recommandation texte selon temps + séance
// ════════════════════════════════════════════════════════════
function _getRecommandationTemps(min, seance) {
  const nbExos = seance
    ? getExercicesSelonTemps(seance.exercices || [], min).length
    : 0;

  const map = {
    30:  `⚡ Express — ${nbExos} exercices essentiels · Pas de cardio · Repos 45s`,
    60:  `💪 Standard — ${nbExos} exercices · Repos 60–75s · Séance équilibrée`,
    90:  `🏋️ Complet — ${nbExos} exercices · Repos 90s · Supersets possibles`,
    120: `🔥 Intense — ${nbExos} exercices · Séance complète + étirements`
  };

  return map[min] || `💡 ${nbExos} exercices planifiés`;
}

// ════════════════════════════════════════════════════════════
// ✅ CHOISIR TEMPS À LA SALLE
// ════════════════════════════════════════════════════════════
function _choisirTempsSalle(min) {
  Utils.storage.set('ft_temps_salle', min);

  // ✅ Mettre à jour les boutons visuellement
  [30, 60, 90, 120].forEach(t => {
    const btn = document.getElementById(`btn-temps-${t}`);
    if (!btn) return;
    const actif = t === min;
    btn.style.background    = actif ? 'rgba(75,75,249,0.25)' : 'rgba(75,75,249,0.08)';
    btn.style.borderColor   = actif ? 'var(--fd-indigo)' : 'rgba(75,75,249,0.15)';
    btn.querySelector('div:nth-child(2)').style.color =
      actif ? 'var(--fd-indigo)' : 'var(--text-primary)';
  });

  // ✅ Re-render la page Home pour adapter les exercices
  const container = document.getElementById('page-home');
  if (container) {
    _rendreHome(container);
  }

  Utils.toast(`⏱ ${min} min sélectionnées`, 'success', 1200);
}

// ════════════════════════════════════════════════════════════
// ✅ SEARCH LIVE — Suggestions en temps réel
// ════════════════════════════════════════════════════════════
function _homeSearchLive(val) {
  const q   = (val || '').toLowerCase().trim();
  const box = document.getElementById('home-search-suggestions');
  const clr = document.getElementById('home-search-clear');

  if (clr) clr.style.display = q ? 'block' : 'none';
  if (!box) return;

  if (!q) {
    box.style.display = 'none';
    return;
  }

  // ✅ Suggestions pages
  const suggestions = [
    { label:'Programme',         emoji:'📅', page:'training'      },
    { label:'Séance Live',       emoji:'💪', page:'live'          },
    { label:'Statistiques',      emoji:'📊', page:'stats'         },
    { label:'Nutrition',         emoji:'🥗', page:'nutrition'     },
    { label:'Galerie exercices', emoji:'💪', page:'galerie'       },
    { label:'Coach IA',          emoji:'🤖', page:'coach'         },
    { label:'Défis',             emoji:'🏆', page:'defis'         },
    { label:'Mon profil',        emoji:'👤', page:'mon_profil'    },
    { label:'Paramètres',        emoji:'⚙️', page:'settings'      },
    { label:'Historique',        emoji:'📅', page:'history'       },
    { label:'Photos',            emoji:'📸', page:'photos'        },
    { label:'Objectifs',         emoji:'🎯', page:'objectifs'     },
    { label:'Blessures',         emoji:'🩹', page:'blessures'     },
    { label:'Journal',           emoji:'📔', page:'journal'       },
    { label:'Supersets',         emoji:'⚡', page:'supersets'     },
    { label:'Circuit Training',  emoji:'🔄', page:'circuit'       },
    { label:'Programme Adaptatif',emoji:'🧠',page:'adaptatif'     },
    { label:'XP & Niveaux',      emoji:'⭐', page:'gamification'  },
    { label:'Partage',           emoji:'📤', page:'share'         },
    { label:'Hors-ligne',        emoji:'📵', page:'offline'       }
  ].filter(s => s.label.toLowerCase().includes(q));

  // ✅ Exercices correspondants
  const exosSugg = Object.entries(window.EXERCICES || {})
    .filter(([_, ex]) =>
      ex.nom.toLowerCase().includes(q) ||
      (ex.muscle || '').toLowerCase().includes(q)
    )
    .slice(0, 3)
    .map(([ref, ex]) => ({
      label: ex.nom,
      emoji: ex.emoji || '💪',
      isExo: true,
      ref
    }));

  const all = [...suggestions.slice(0, 4), ...exosSugg];

  if (!all.length) {
    box.style.display = 'none';
    return;
  }

  box.style.display = 'block';
  box.innerHTML = all.map((s, i) => `
    <div onclick="${s.isExo
        ? `naviguer('galerie');setTimeout(()=>GalerieExercices._filtrerSearch('${s.label}'),350)`
        : `naviguer('${s.page}')`};
         document.getElementById('home-search-suggestions').style.display='none';
         document.getElementById('home-search-input').value=''"
         style="display:flex;align-items:center;gap:12px;
                padding:10px 14px;cursor:pointer;
                border-bottom:${i < all.length - 1
                  ? '1px solid var(--border-color)'
                  : 'none'};
                transition:background .15s"
         onmouseenter="this.style.background='rgba(75,75,249,0.08)'"
         onmouseleave="this.style.background='transparent'">
      <span style="font-size:1.1rem;flex-shrink:0">${s.emoji}</span>
      <span style="font-size:.85rem;font-weight:600;color:var(--text-primary)">
        ${s.label}
      </span>
      ${s.isExo ? `
        <span style="margin-left:auto;font-size:.65rem;
                     color:var(--fd-mint);font-weight:600">
          Exercice →
        </span>` : `
        <span style="margin-left:auto;color:var(--text-muted);font-size:.8rem">›</span>`}
    </div>`).join('');
}

function _homeSearchClear() {
  const input = document.getElementById('home-search-input');
  const box   = document.getElementById('home-search-suggestions');
  const clr   = document.getElementById('home-search-clear');
  if (input) input.value = '';
  if (box)   box.style.display = 'none';
  if (clr)   clr.style.display = 'none';
}

function _attacherSearchEvents() {
  // ✅ Fermer les suggestions en cliquant ailleurs
  document.addEventListener('click', (e) => {
    const box   = document.getElementById('home-search-suggestions');
    const wrap  = document.getElementById('home-search-wrap');
    if (box && wrap && !wrap.contains(e.target)) {
      box.style.display = 'none';
    }
  }, { once: true });
}

// ════════════════════════════════════════════════════════════
// HELPER EAU
// ════════════════════════════════════════════════════════════
function _ajouterEauHome(ml) {
  try {
    const clé    = `ft_nutrition_eau_${Utils.aujourd_hui()}`;
    const actuel = Utils.storage.get(clé, 0);
    const nouveau = Math.min(actuel + ml, 5000);
    Utils.storage.set(clé, nouveau);
    Utils.toast(`💧 +${ml}ml · Total ${(nouveau / 1000).toFixed(1)}L`, 'success', 1500);
    Utils.vibrerSuccess();
  } catch(e) {
    Utils.toast(`💧 +${ml}ml ajouté !`, 'success', 1500);
  }
}

// ════════════════════════════════════════════════════════════
// HUMEUR / FATIGUE
// ════════════════════════════════════════════════════════════
function _renderHumeurFatigue() {
  let humeur = null, fatigue = null;
  try { humeur  = Tracker.getHumeur();  } catch(e) {}
  try { fatigue = Tracker.getFatigue(); } catch(e) {}
  if (humeur && fatigue) return '';

  return `
    <div class="card mb-md" id="card-humeur-fatigue">
      <div class="card-label">😊 Comment tu te sens ?</div>
      ${!humeur ? `
        <div style="margin-top:var(--space-sm)">
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:6px">
            Humeur du jour
          </div>
          <div style="display:flex;gap:8px" id="humeur-btns">
            ${['😒','😐','🙂','😊','🔥'].map((h, i) => `
              <button data-humeur="${i}"
                      style="flex:1;padding:8px;font-size:1.2rem;
                             background:var(--bg-input);
                             border:1px solid var(--border-color);
                             border-radius:var(--radius-sm);
                             cursor:pointer;transition:all .2s">
                ${h}
              </button>`).join('')}
          </div>
        </div>` : ''}
      ${!fatigue ? `
        <div style="margin-top:var(--space-sm)">
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:6px">
            Niveau de fatigue
          </div>
          <div style="display:flex;gap:6px" id="fatigue-btns">
            ${[
              { val:0, label:'Frais',  color:'var(--fd-mint)'  },
              { val:1, label:'OK',     color:'var(--fd-lemon)' },
              { val:2, label:'Mod.',   color:'#ffa500'         },
              { val:3, label:'Épuisé', color:'var(--fd-coral)' }
            ].map(f => `
              <button data-fatigue="${f.val}"
                      style="flex:1;padding:6px 2px;font-size:.68rem;font-weight:600;
                             background:${f.color}22;color:${f.color};
                             border:1px solid ${f.color}44;
                             border-radius:var(--radius-sm);cursor:pointer">
                ${f.label}
              </button>`).join('')}
          </div>
        </div>` : ''}
    </div>`;
}

function _attacherHumeurFatigueEvents() {
  const humeurs = ['😒','😐','🙂','😊','🔥'];

  document.querySelectorAll('[data-humeur]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.humeur);
      const humeur = humeurs[idx];
      if (!humeur) return;

      document.querySelectorAll('[data-humeur]').forEach(b => {
        b.style.transform  = '';
        b.style.background = 'var(--bg-input)';
        b.style.border     = '1px solid var(--border-color)';
      });
      btn.style.transform  = 'scale(1.2)';
      btn.style.background = 'rgba(75,75,249,0.2)';
      btn.style.border     = '2px solid var(--fd-indigo)';

      setTimeout(() => {
        try {
          Tracker.sauvegarderHumeur(humeur);
          try { Gamification.recompenser('HUMEUR'); } catch(e) {}
          Utils.toast(`Humeur : ${humeur}`, 'success', 1500);
          Utils.vibrerSuccess();
          const card = document.getElementById('card-humeur-fatigue');
          if (card) {
            const fatigue = Tracker.getFatigue();
            if (!fatigue) {
              card.querySelector('#humeur-btns')?.closest('div')?.remove();
            } else {
              card.remove();
            }
          }
        } catch(e) {}
      }, 300);
    });
  });

  document.querySelectorAll('[data-fatigue]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.fatigue);

      document.querySelectorAll('[data-fatigue]').forEach(b => {
        b.style.opacity   = '0.5';
        b.style.transform = '';
      });
      btn.style.opacity   = '1';
      btn.style.transform = 'scale(1.05)';

      setTimeout(() => {
        try {
          Tracker.sauvegarderFatigue(val);
          Utils.toast('Fatigue enregistrée ✅', 'success', 1500);
          Utils.vibrerSuccess();
          const card = document.getElementById('card-humeur-fatigue');
          if (card) {
            const humeur = Tracker.getHumeur();
            if (!humeur) {
              card.querySelector('#fatigue-btns')?.closest('div')?.remove();
            } else {
              card.remove();
            }
          }
        } catch(e) {}
      }, 300);
    });
  });
}

// ════════════════════════════════════════════════════════════
// PAGE TRAINING
// ════════════════════════════════════════════════════════════
function _rendreTraining(container) {
  let infos    = { semaine:1, cycle:1, phase:{ nom:'Reprise', emoji:'🌱', couleur:'#8bf0bb', intensite:.65 } };
  let seances  = [];
  let planning = [];

  try { infos    = Programme.getInfosProgramme(); } catch(e) {}
  try { seances  = Programme.getAllSeances();      } catch(e) {}
  try { planning = Programme.getSeancesSemaine(); } catch(e) {}

  container.innerHTML = `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,var(--fd-indigo) 0%,#7b2ff7 100%);
                border:none;color:white;text-align:center">
      <div style="font-size:2rem">${infos.phase.emoji}</div>
      <div style="font-size:1.1rem;font-weight:800;margin-top:4px">${infos.phase.nom}</div>
      <div style="font-size:.78rem;opacity:.8;margin-top:2px">
        Semaine ${infos.semaine} · Cycle ${infos.cycle}
        · ${Math.round((infos.phase.intensite || 0) * 100)}% intensité
      </div>
      <div style="height:6px;background:rgba(255,255,255,0.2);
                  border-radius:3px;margin-top:var(--space-md);overflow:hidden">
        <div style="height:100%;background:var(--fd-lemon);
                    width:${infos.progression || 0}%;border-radius:3px"></div>
      </div>
      <div style="font-size:.65rem;opacity:.6;margin-top:4px">
        ${infos.progression || 0}% du cycle
      </div>
    </div>

    <div class="section-title">📅 Planning semaine</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);
                gap:3px;margin-bottom:var(--space-md)">
      ${planning.map(jour => `
        <div style="text-align:center;padding:var(--space-sm) 2px;
                    background:${jour.estAujourdhui
                      ? 'var(--fd-indigo)'
                      : jour.seance ? 'rgba(75,75,249,0.15)' : 'var(--bg-input)'};
                    border-radius:var(--radius-sm);
                    cursor:${jour.seance ? 'pointer' : 'default'}"
             ${jour.seance ? `onclick="naviguer('live',{seanceId:'${jour.seance?.id}'})"` : ''}>
          <div style="font-size:.6rem;
                      color:${jour.estAujourdhui ? 'white' : 'var(--text-muted)'};
                      font-weight:${jour.estAujourdhui ? '700' : '400'}">
            ${jour.label}
          </div>
          <div style="font-size:.9rem;margin-top:2px">
            ${jour.seance ? jour.seance.emoji : jour.estRepos ? '😴' : '·'}
          </div>
        </div>`).join('')}
    </div>

    <div class="section-title">🏋️ Séances</div>
    ${seances.map(s => _renderCarteSeanceTraining(s)).join('')}

    <div class="flex justify-between items-center mt-md mb-sm">
      <div class="section-title" style="margin:0">⚡ Supersets</div>
      <button onclick="naviguer('supersets')"
              style="background:none;border:none;font-size:.72rem;
                     color:var(--fd-indigo);cursor:pointer;font-weight:600">
        Gérer →
      </button>
    </div>
    <div class="card" style="text-align:center;padding:var(--space-md)">
      <div style="font-size:1.5rem;margin-bottom:4px">⚡</div>
      <div style="font-size:.82rem;color:var(--text-muted)">
        Configure tes supersets pour maximiser ton efficacité
      </div>
      <button onclick="naviguer('supersets')" class="btn-secondary mt-md" style="font-size:.82rem">
        Voir les supersets
      </button>
    </div>
  `;
}

function _renderCarteSeanceTraining(seance) {
  let supersets = [];
  try { supersets = Superset.getSupersets(seance.id); } catch(e) {}

  return `
    <div class="card mb-md">
      <div class="flex justify-between items-center mb-sm">
        <div>
          <div style="font-size:1rem;font-weight:700">${seance.emoji} ${seance.nom}</div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">
            ~${seance.duree_estimee}min · ${seance.exercices?.length || 0} exercices
            ${supersets.length > 0 ? `· ${supersets.length} superset${supersets.length > 1 ? 's' : ''}` : ''}
          </div>
        </div>
        <button onclick="naviguer('live',{seanceId:'${seance.id}'})"
                class="btn-primary"
                style="font-size:.78rem;padding:var(--space-sm) var(--space-md)">
          ▶ Start
        </button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${(seance.muscles || []).map(m => `
          <span class="chip chip-indigo" style="font-size:.62rem">${m}</span>
        `).join('')}
      </div>
      <div style="margin-top:var(--space-sm);font-size:.75rem;color:var(--text-muted)">
        ${(seance.exercices || []).slice(0, 4).map(ex => {
          const exo = (window.EXERCICES || {})[ex.ref] || {};
          return `${exo.emoji || '💪'} ${exo.nom || ex.ref}`;
        }).join(' · ')}
        ${(seance.exercices || []).length > 4
          ? ` · +${(seance.exercices || []).length - 4}` : ''}
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// SÉANCE GUIDÉE — Mode automatique avec voix française
// ════════════════════════════════════════════════════════════
const SeanceGuidee = {

  _actif:        false,
  _exoIdx:       0,
  _serieIdx:     0,
  _seanceId:     null,
  _exercices:    [],
  _phase:        'repos',   // 'effort' | 'repos' | 'transition'
  _voix:         null,
  _synth:        window.speechSynthesis || null,

  // ✅ Initialiser la voix française féminine
  _initVoix() {
    if (!this._synth) return;
    const voix = this._synth.getVoices();
    // Chercher voix française féminine
    this._voix = voix.find(v =>
      v.lang.startsWith('fr') &&
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('femme') ||
       v.name.toLowerCase().includes('amélie') ||
       v.name.toLowerCase().includes('thomas') === false)
    ) || voix.find(v => v.lang.startsWith('fr'))
      || voix[0]
      || null;
  },

  parler(texte, urgent = false) {
    if (!this._synth) return;
    if (!this._voix) this._initVoix();

    // Annuler si urgent
    if (urgent) this._synth.cancel();

    const utterance      = new SpeechSynthesisUtterance(texte);
    utterance.voice      = this._voix;
    utterance.lang       = 'fr-FR';
    utterance.rate       = 0.95;
    utterance.pitch      = 1.1;   // Légèrement plus aigu = féminin
    utterance.volume     = 0.9;
    this._synth.speak(utterance);
  },

  demarrer(seanceId, exercices) {
    if (this._actif) this.arreter();

    this._actif     = true;
    this._seanceId  = seanceId;
    this._exercices = exercices || [];
    this._exoIdx    = 0;
    this._serieIdx  = 0;
    this._phase     = 'effort';

    // Sauvegarder l'état
    Utils.storage.set('ft_guidee_actif', true);
    Utils.storage.set('ft_guidee_seance', seanceId);

    this._initVoix();

    // Annonce de début
    const premierExo = this._exercices[0];
    if (premierExo) {
      const exoData = (window.EXERCICES || {})[premierExo.ref] || {};
      setTimeout(() => {
        this.parler(
          `Séance démarrée ! Premier exercice : ${exoData.nom || premierExo.ref}. 
           ${premierExo.series} séries de ${premierExo.reps} répétitions. 
           Bonne séance !`,
          true
        );
      }, 500);
    }

    this._mettreAJourUI();
    console.log('[SeanceGuidee] Démarré:', seanceId);
  },

  arreter() {
    this._actif    = false;
    this._synth?.cancel();
    Utils.storage.set('ft_guidee_actif', false);
    this._mettreAJourUI();
    console.log('[SeanceGuidee] Arrêté');
  },

  // ✅ Appelé après chaque série validée
  serieValidee(exoIdx, serieIdx, poids, reps, isPR) {
    if (!this._actif) return;

    this._exoIdx   = exoIdx;
    this._serieIdx = serieIdx;

    const exo     = this._exercices[exoIdx];
    if (!exo) return;

    const exoData   = (window.EXERCICES || {})[exo.ref] || {};
    const seriesRest = exo.series - (serieIdx + 1);
    const reposSec  = exo.repos || 75;

    // ✅ Message vocal après série
    let message = '';

    if (isPR) {
      message = `Nouveau record ! ${poids} kilos, ${reps} répétitions. Fantastique ! `;
    } else {
      message = `Série ${serieIdx + 1} validée. ${poids} kilos, ${reps} répétitions. `;
    }

    if (seriesRest > 0) {
      message += `Encore ${seriesRest} série${seriesRest > 1 ? 's' : ''}. `;
      message += `Repos de ${reposSec} secondes. `;
    } else {
      // Dernière série de cet exercice
      const prochaineExo = this._exercices[exoIdx + 1];
      if (prochaineExo) {
        const prochaineData = (window.EXERCICES || {})[prochaineExo.ref] || {};
        message += `Exercice terminé. Prochain exercice : ${prochaineData.nom || prochaineExo.ref}. `;
        message += `${prochaineExo.series} séries de ${prochaineExo.reps} répétitions. `;
      } else {
        message += `Dernier exercice terminé. Plus qu'un peu ! `;
      }
    }

    this.parler(message, true);
    this._mettreAJourUI();
  },

  // ✅ Annonce fin de repos
  annoncerFinRepos() {
    if (!this._actif) return;
    const exo     = this._exercices[this._exoIdx];
    const exoData = (window.EXERCICES || {})[exo?.ref || ''] || {};
    const serie   = (this._serieIdx + 2);
    this.parler(
      `Repos terminé ! Série ${serie} sur ${exo?.series || '?'}. 
       Allez, on y va !`,
      true
    );
  },

  // ✅ Annonce début d'un nouvel exercice
  annoncerNouvelExercice(exoIdx) {
    if (!this._actif) return;
    const exo     = this._exercices[exoIdx];
    const exoData = (window.EXERCICES || {})[exo?.ref || ''] || {};

    this.parler(
      `Nouvel exercice : ${exoData.nom || exo?.ref || ''}. 
       ${exo?.series} séries de ${exo?.reps} répétitions. 
       Repos de ${exo?.repos || 75} secondes entre les séries. `,
      true
    );
  },

  // ✅ Annonce fin de séance
  annoncerFinSeance(volume, prs) {
    if (!this._synth) {
      this._initVoix();
    }
    const msg = prs > 0
      ? `Bravo ! Séance terminée avec ${prs} nouveau${prs > 1 ? 'x' : ''} record${prs > 1 ? 's' : ''} ! Volume total : ${Math.round(volume / 1000)} tonnes. Tu es incroyable !`
      : `Séance terminée ! Volume total : ${Math.round(volume / 1000)} tonnes. Excellent travail, récupère bien !`;
    this.parler(msg, true);
  },

  _mettreAJourUI() {
    const btn = document.getElementById('btn-mode-guide');
    if (!btn) return;
    btn.textContent   = this._actif ? '🔇 Désactiver voix' : '🎙️ Mode guidé';
    btn.style.background = this._actif
      ? 'rgba(139,240,187,0.2)' : 'rgba(75,75,249,0.12)';
    btn.style.borderColor = this._actif
      ? 'var(--fd-mint)' : 'rgba(75,75,249,0.25)';
    btn.style.color = this._actif
      ? 'var(--fd-mint)' : 'var(--fd-indigo)';
  },

  // ✅ Charger les voix (async sur certains navigateurs)
  prechargerVoix() {
    if (!window.speechSynthesis) return;
    // Les voix se chargent de manière asynchrone
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        this._initVoix();
      }, { once: true });
    } else {
      this._initVoix();
    }
  }
};

window.SeanceGuidee = SeanceGuidee;

// ════════════════════════════════════════════════════════════
// PAGE LIVE
// ════════════════════════════════════════════════════════════
function _rendreLive(container, options = {}) {
  const seanceId = options.seanceId
    || Programme.getSeanceduJour()?.id
    || null;

  if (!seanceId) {
    container.innerHTML = `
      <div class="card mt-md" style="text-align:center;padding:var(--space-xl)">
        <div style="font-size:3rem">😴</div>
        <div style="font-size:1.1rem;font-weight:700;margin-top:var(--space-md)">
          Jour de repos
        </div>
        <p style="color:var(--text-muted);font-size:.88rem;margin-top:var(--space-sm)">
          Aucune séance planifiée aujourd'hui.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-sm);margin-top:var(--space-lg)">
          <button onclick="naviguer('training')" class="btn-secondary" style="flex:1;min-width:140px">
            📅 Voir le programme
          </button>
          <button onclick="naviguer('live',{seanceId:'full_body'})" class="btn-primary" style="flex:1;min-width:140px">
            ⚡ Séance express
          </button>
        </div>
      </div>`;
    return;
  }

  let seanceComplete = null;
  try { seanceComplete = Programme.getSeanceComplete(seanceId); } catch(e) {}

  if (!seanceComplete) {
    container.innerHTML = `
      <div class="card mt-md" style="text-align:center">
        <p>Séance introuvable.</p>
        <button onclick="naviguer('training')" class="btn-secondary mt-md">← Retour</button>
      </div>`;
    return;
  }

  // ✅ Adapter les exercices selon le temps salle choisi
  const tempsSalle = Utils.storage.get('ft_temps_salle', 60);
  seanceComplete.exercicesDetails = getExercicesSelonTemps(
    seanceComplete.exercicesDetails || [], tempsSalle
  );

  try {
    const cleStart = `ft_seance_start_${Utils.aujourd_hui()}_${seanceId}`;
    if (!Utils.storage.get(cleStart)) {
      Tracker.demarrerSeance(seanceId);
    }
  } catch(e) {}

  container.innerHTML = `
    <div id="live-content">
      ${_renderLiveHeader(seanceComplete)}
      ${_renderWarmup(seanceComplete, seanceId)}
      ${_renderExercicesLive(seanceComplete, seanceId)}
      ${_renderEtirements(seanceComplete)}
    </div>`;
}

function _renderLiveHeader(seance) {
  let charge = null;
  try { charge = Predict.analyserFatigue(); } catch(e) {}

  return `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,rgba(75,75,249,0.15),rgba(139,240,187,0.05));
                border-color:var(--fd-indigo)">
      <div class="flex justify-between items-center">
        <div>
          <div style="font-size:1.2rem;font-weight:800">${seance.emoji} ${seance.nom}</div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">
            ~${seance.duree_estimee}min · ${seance.exercices?.length || 0} exos
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          ${charge ? `
            <div style="text-align:center">
              <div style="font-size:1rem;font-weight:700;
                          color:${charge.recommandation?.couleur || 'white'}">
                ${charge.score}/100
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${charge.recommandation?.emoji || '💪'} Forme
              </div>
            </div>` : ''}
          <div id="chrono-container"></div>
<button id="btn-mode-guide"
        onclick="SeanceGuidee._actif 
          ? SeanceGuidee.arreter() 
          : SeanceGuidee.demarrer(
              '${seance.id}',
              ${JSON.stringify(seance.exercices||[]).replace(/'/g,'"')}
            )"
        style="display:flex;align-items:center;gap:4px;
               padding:5px 10px;
               background:rgba(75,75,249,0.12);
               border:1px solid rgba(75,75,249,0.25);
               border-radius:var(--radius-full);
               font-size:.68rem;font-weight:600;
               color:var(--fd-indigo);cursor:pointer;
               margin-top:4px">
  🎙️ Mode guidé
</button>
        </div>
      </div>
    </div>`;
}

function _renderWarmup(seance, seanceId) {
  const warmup = seance.warmup || [];
  if (!warmup.length) return '';
  return `
    <div class="card mb-md">
      <div class="card-label">🔥 Échauffement</div>
      ${warmup.map((w, i) => `
        <div style="display:flex;align-items:center;gap:var(--space-md);
                    padding:var(--space-sm) 0;border-bottom:1px solid var(--border-color)">
          <div style="width:26px;height:26px;border-radius:50%;
                      background:var(--fd-indigo-dim);
                      display:flex;align-items:center;justify-content:center;
                      font-size:.72rem;font-weight:700;color:var(--fd-indigo);flex-shrink:0">
            ${i + 1}
          </div>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">${w.nom}</div>
            <div style="font-size:.7rem;color:var(--text-muted)">${w.description}</div>
          </div>
          <div style="font-size:.75rem;color:var(--fd-mint);font-weight:600">
            ${Utils.formatDuree(w.duree)}
          </div>
        </div>`).join('')}
    </div>`;
}

function _renderExercicesLive(seance, seanceId) {
  const exos      = seance.exercicesDetails || [];
  const supersets = seance.supersets || [];

  return `
    <div class="card mb-md">
      <div class="flex justify-between items-center mb-md">
        <div class="card-label">🏋️ ${exos.length} exercices</div>
        ${supersets.length > 0 ? `
          <span class="chip chip-lavender" style="font-size:.65rem">
            ⚡ ${supersets.length} superset${supersets.length > 1 ? 's' : ''}
          </span>` : ''}
      </div>

      ${exos.map((ex, idx) => {
        const exo        = ex.details || {};
        const pr         = _getPRExo(ex.ref);
        const chargeReco = _getChargeReco(ex.ref);
        const youtubeId  = exo.youtube || null;

        return `
          <div class="live-exo-card" id="live-exo-${idx}"
               style="padding:var(--space-md);background:var(--bg-input);
                      border-radius:var(--radius-md);margin-bottom:var(--space-sm);
                      border:1px solid var(--border-color)">

            <div class="flex justify-between items-center mb-sm">
              <div style="flex:1">
                <div style="font-weight:700;font-size:.95rem">
                  ${exo.emoji || '💪'} ${exo.nom || ex.ref}
                </div>
                <div style="font-size:.68rem;color:var(--fd-mint)">${exo.muscle || ''}</div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                ${pr ? `
                  <div style="font-size:.72rem;color:var(--fd-lemon);font-weight:600">
                    🏆 ${pr.poids}kg×${pr.reps}
                  </div>` : ''}
                ${chargeReco ? `
                  <div style="font-size:.68rem;color:var(--fd-indigo)">
                    💡 ${chargeReco.charge}kg (${chargeReco.pourcentage}%)
                  </div>` : ''}
              </div>
            </div>

            <div style="display:flex;gap:6px;margin-bottom:var(--space-sm);flex-wrap:wrap">
              ${youtubeId ? `
                <button onclick="VideoDemo.ouvrir('${youtubeId}',
                          '${(exo.nom || ex.ref).replace(/'/g,"\\'")}',
                          '${exo.muscle || ''}')"
                        style="display:flex;align-items:center;gap:4px;padding:5px 10px;
                               background:rgba(255,0,0,0.12);
                               border:1px solid rgba(255,0,0,0.25);
                               border-radius:var(--radius-full);
                               font-size:.68rem;font-weight:600;color:#ff4444;cursor:pointer">
                  ▶ Voir démo
                </button>` : ''}
              <button onclick="Calculateur.renderCalculateur('${ex.ref}',${idx})"
                      style="display:flex;align-items:center;gap:4px;padding:5px 10px;
                             background:rgba(75,75,249,0.12);
                             border:1px solid rgba(75,75,249,0.25);
                             border-radius:var(--radius-full);
                             font-size:.68rem;font-weight:600;
                             color:var(--fd-indigo);cursor:pointer">
                🧮 Calculateur
              </button>
            </div>

            ${idx === 0 ? `
              <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;
                          margin-bottom:8px;background:rgba(191,161,255,0.08);
                          border:1px solid rgba(191,161,255,0.15);
                          border-radius:var(--radius-sm)">
                <span style="font-size:1rem;flex-shrink:0">💡</span>
                <div style="font-size:.68rem;color:rgba(191,161,255,0.8);line-height:1.5">
                  <strong>KG</strong> = poids soulevé ·
                  <strong>REPS</strong> = répétitions ·
                  <strong>RPE</strong> = effort /10
                  <span style="opacity:.7">(7 = difficile, 9 = presque max)</span>
                </div>
              </div>` : ''}

            ${Array.from({ length: ex.series }, (_, s) => `
              <div class="serie-row" id="serie-${idx}-${s}"
                   style="display:grid;grid-template-columns:40px 1fr 1fr 50px auto auto;
                          gap:var(--space-xs);align-items:center;margin-bottom:18px">
                <div style="font-size:.75rem;font-weight:700;
                            color:var(--text-muted);text-align:center">S${s + 1}</div>
                <div style="position:relative">
                  <input type="number" class="input" id="poids-${idx}-${s}"
                         placeholder="${chargeReco?.charge || pr?.poids || '0'}"
                         value="${chargeReco?.charge || pr?.poids || ''}"
                         step="2.5"
                         style="padding:6px;font-size:.82rem;text-align:center"/>
                  <div style="position:absolute;bottom:-14px;left:0;right:0;
                              text-align:center;font-size:.52rem;
                              color:var(--text-muted);font-weight:600;pointer-events:none">KG</div>
                </div>
                <div style="position:relative">
                  <input type="number" class="input" id="reps-${idx}-${s}"
                         placeholder="${ex.reps?.split('-')[0] || 10}"
                         style="padding:6px;font-size:.82rem;text-align:center"/>
                  <div style="position:absolute;bottom:-14px;left:0;right:0;
                              text-align:center;font-size:.52rem;
                              color:var(--text-muted);font-weight:600;pointer-events:none">REPS</div>
                </div>
                <div style="position:relative">
                  <input type="number" class="input" id="rpe-${idx}-${s}"
                         placeholder="7" min="1" max="10"
                         style="padding:6px;font-size:.78rem;text-align:center"/>
                  <div style="position:absolute;bottom:-14px;left:0;right:0;
                              text-align:center;font-size:.52rem;
                              color:var(--text-muted);font-weight:600;pointer-events:none">RPE</div>
                </div>
                <button onclick="TimerManager.lancerTimerReps(${idx},${s})"
                        id="btn-timer-${idx}-${s}" title="Timer repos"
                        style="width:32px;height:32px;border-radius:50%;
                               background:rgba(75,75,249,0.15);
                               border:2px solid var(--fd-indigo);
                               font-size:.8rem;cursor:pointer;
                               display:flex;align-items:center;justify-content:center">⏱</button>
                <button onclick="App.validerSerie('${seanceId}','${ex.ref}',${idx},${s})"
                        id="btn-serie-${idx}-${s}"
                        style="width:32px;height:32px;border-radius:50%;
                               background:var(--bg-card);
                               border:2px solid var(--border-color);
                               font-size:.9rem;cursor:pointer;
                               display:flex;align-items:center;justify-content:center">○</button>
              </div>`).join('')}

            ${exo.conseils?.length ? `
              <details style="margin-top:var(--space-xs)">
                <summary style="font-size:.68rem;color:var(--text-muted);cursor:pointer">
                  💡 Conseils techniques
                </summary>
                <div style="font-size:.72rem;color:var(--text-muted);
                            margin-top:var(--space-xs);padding-left:var(--space-sm)">
                  ${exo.conseils.map(c => `<div>• ${c}</div>`).join('')}
                </div>
              </details>` : ''}
          </div>`;
      }).join('')}

      <button onclick="App.terminerSeance('${seanceId}')"
              class="btn-primary mt-md"
              style="width:100%;font-size:.9rem;padding:var(--space-md)">
        🏁 Terminer la séance
      </button>
      <button onclick="App.arreterSeance('${seanceId}')"
              class="btn-secondary mt-sm"
              style="width:100%;font-size:.82rem;color:var(--text-muted)">
        ✕ Arrêter
      </button>
    </div>`;
}

function _renderEtirements(seance) {
  const etirements = seance.etirements || [];
  if (!etirements.length) return '';
  return `
    <div class="card mb-md">
      <div class="card-label">🧘 Étirements</div>
      ${etirements.map((e, i) => `
        <div style="display:flex;align-items:center;gap:var(--space-md);
                    padding:var(--space-sm) 0;border-bottom:1px solid var(--border-color)">
          <div style="font-size:1.2rem">${e.gif || '🧘'}</div>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">${e.nom}</div>
          </div>
          <div style="font-size:.78rem;color:var(--fd-mint);font-weight:600">
            ${Utils.formatDuree(e.duree)}
          </div>
        </div>`).join('')}
    </div>`;
}

function _getPRExo(ref) {
  try { return Tracker.getPR(ref); } catch(e) { return null; }
}

function _getChargeReco(ref) {
  try { return Predict.recommanderCharge(ref); } catch(e) { return null; }
}

// ════════════════════════════════════════════════════════════
// PAGE PROFIL
// ════════════════════════════════════════════════════════════
function _rendreProfil(container) {
  let profil   = { nom:'Athlète', avatar:'💪', poids:80, taille:175, objectif:'forme' };
  let xp       = { total:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
  let streak   = { count:0, max:0 };
  let total    = 0;
  let trophees = 0;

  try { profil   = Tracker.getProfil();           } catch(e) {}
  try { xp       = Gamification.getXP();          } catch(e) {}
  try { streak   = Tracker.getStreak();           } catch(e) {}
  try { total    = Tracker.getTotalSeances();      } catch(e) {}
  try { trophees = Gamification.getTrophees().filter(t => t.debloquee).length; } catch(e) {}

  container.innerHTML = `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                border:none;color:white;text-align:center">
      <div style="font-size:3rem;margin-bottom:4px">${profil.avatar || '💪'}</div>
      <div style="font-size:1.3rem;font-weight:800">${profil.nom}</div>
      <div style="font-size:.82rem;opacity:.8;margin-top:4px">
        ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
      </div>
      <div class="stats-grid mt-md" style="background:none">
        ${[
          { val:total,        label:'Séances'  },
          { val:streak.count, label:'Streak'   },
          { val:trophees,     label:'Trophées' }
        ].map(s => `
          <div>
            <div style="font-size:1.2rem;font-weight:800">${s.val}</div>
            <div style="font-size:.65rem;opacity:.7">${s.label}</div>
          </div>`).join('')}
      </div>
    </div>

    ${[
      { page:'journal',      emoji:'📔', label:'Journal'             },
      { page:'objectifs',    emoji:'🎯', label:'Objectifs'           },
      { page:'blessures',    emoji:'🩹', label:'Blessures'           },
      { page:'coach',        emoji:'🤖', label:'Coach IA'            },
      { page:'defis',        emoji:'🏆', label:'Défis'               },
      { page:'predict',      emoji:'📈', label:'Prédictions'         },
      { page:'share',        emoji:'📤', label:'Partage'             },
      { page:'supersets',    emoji:'⚡', label:'Supersets'           },
      { page:'social',       emoji:'📱', label:'Réseaux sociaux'     },
      { page:'offline',      emoji:'📵', label:'Hors-ligne'          },
      { page:'gamification', emoji:'⭐', label:'XP & Niveaux'        },
      { page:'history',      emoji:'📅', label:'Historique'          },
      { page:'photos',       emoji:'📸', label:'Photos'              },
      { page:'circuit',      emoji:'🔄', label:'Circuit Training'    },
      { page:'adaptatif',    emoji:'🧠', label:'Programme Adaptatif' },
      { page:'nutrition',    emoji:'🥗', label:'Nutrition'           },
      { page:'galerie',      emoji:'💪', label:'Galerie exercices'   },
      { page:'settings',     emoji:'⚙️', label:'Paramètres'         }
    ].map(s => `
      <div class="card mb-md" style="cursor:pointer" onclick="naviguer('${s.page}')">
        <div class="flex justify-between items-center">
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <span style="font-size:1.3rem">${s.emoji}</span>
            <span style="font-weight:600;font-size:.92rem">${s.label}</span>
          </div>
          <span style="color:var(--text-muted);font-size:.9rem">›</span>
        </div>
      </div>`).join('')}

    <div class="card mb-md" style="border-color:rgba(255,141,150,0.3)">
      <button onclick="UI.confirmerReset()"
              style="width:100%;background:none;border:none;
                     color:var(--fd-coral);font-size:.85rem;
                     font-weight:600;cursor:pointer;padding:var(--space-sm)">
        🗑️ Réinitialiser toutes les données
      </button>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// PAGE MON PROFIL
// ════════════════════════════════════════════════════════════
function _renderMonProfil(container) {
  let profil = { nom:'', poids:null, taille:null, objectif:'forme', niveau:'intermediaire', avatar:'💪' };
  try { profil = Tracker.getProfil(); } catch(e) {}

  const objectifs = [
    { val:'prise_masse', label:'💪 Prise de masse' },
    { val:'perte_poids', label:'⬇️ Perte de poids' },
    { val:'seche',       label:'🔥 Sèche'          },
    { val:'force',       label:'🏋️ Force'           },
    { val:'endurance',   label:'🏃 Endurance'       },
    { val:'forme',       label:'✨ Forme générale'  }
  ];

  const avatars = ['💪','🏋️','🔥','⚡','🚀','🦁','🐺','👊'];

  container.innerHTML = `
    <div class="card mb-md">
      <div class="card-label">🎭 Avatar</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:var(--space-sm)">
        ${avatars.map(a => `
          <button onclick="App._selectAvatar('${a}',this)"
                  class="profil-avatar-btn"
                  style="width:44px;height:44px;font-size:1.5rem;
                         background:${profil.avatar === a ? 'var(--fd-indigo-dim)' : 'var(--bg-input)'};
                         border:2px solid ${profil.avatar === a ? 'var(--fd-indigo)' : 'var(--border-color)'};
                         border-radius:var(--radius-sm);cursor:pointer">
            ${a}
          </button>`).join('')}
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">👤 Informations</div>
      <div class="mt-sm">
        <div class="input-label">Prénom *</div>
        <input class="input mb-md" id="profil-edit-nom"
               value="${profil.nom || ''}" placeholder="Ton prénom"
               autocomplete="given-name"/>
        <div class="input-label">Poids (kg)</div>
        <input class="input mb-md" id="profil-edit-poids"
               type="number" step="0.1"
               value="${profil.poids || ''}" placeholder="80"/>
        <div class="input-label">Taille (cm)</div>
        <input class="input mb-md" id="profil-edit-taille"
               type="number" value="${profil.taille || ''}" placeholder="175"/>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">🎯 Objectif</div>
      <div style="display:grid;gap:var(--space-xs);margin-top:var(--space-sm)">
        ${objectifs.map(o => `
          <button onclick="App._selectObjectifProfil('${o.val}',this)"
                  class="profil-obj-btn btn-secondary"
                  style="${profil.objectif === o.val
                    ? 'border-color:var(--fd-indigo);background:var(--fd-indigo-dim)' : ''}">
            ${o.label}
          </button>`).join('')}
      </div>
    </div>

    <button onclick="App.sauvegarderProfil()" class="btn-primary btn-full mb-md">
      💾 Sauvegarder
    </button>
    <button onclick="retourArriere()" class="btn-secondary btn-full">← Retour</button>
  `;
}

// ════════════════════════════════════════════════════════════
// PAGE SETTINGS
// ════════════════════════════════════════════════════════════
function _rendreSettings(container) {
  let config = {};
  try { config = Notifications.getConfig(); } catch(e) {}

  container.innerHTML = `
    <div class="card mb-md">
      <div class="card-label">🔔 Notifications</div>
      ${[
        { cle:'rappelQuotidien', label:'Rappel quotidien' },
        { cle:'absence1j',       label:'Absence 1 jour'   },
        { cle:'streakDanger',    label:'Streak en danger' },
        { cle:'prProche',        label:'PR en vue'        },
        { cle:'semaineParf',     label:'Semaine parfaite' },
        { cle:'finSeance',       label:'Fin de séance'    },
        { cle:'decharge',        label:'Semaine décharge' }
      ].map(n => `
        <div class="score-row">
          <span class="score-row-label" style="font-size:.85rem">${n.label}</span>
          <label class="toggle"
                 style="position:relative;display:inline-block;width:44px;height:24px">
            <input type="checkbox"
                   ${config[n.cle] ? 'checked' : ''}
                   onchange="Notifications.sauvegarderConfig({'${n.cle}':this.checked})"
                   style="opacity:0;width:0;height:0"/>
            <span class="toggle-slider"></span>
          </label>
        </div>`).join('')}
      <button onclick="Notifications.tester()"
              class="btn-secondary mt-md" style="width:100%;font-size:.82rem">
        🔔 Tester les notifications
      </button>
    </div>

    <div class="card mb-md">
      <div class="card-label">💾 Données</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:var(--space-sm);margin-top:var(--space-sm)">
        <button onclick="Utils.exporterJSON()" class="btn-secondary" style="font-size:.78rem">
          📤 Exporter JSON
        </button>
        <button onclick="Utils.importerJSON()" class="btn-secondary" style="font-size:.78rem">
          📥 Importer JSON
        </button>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">🎯 Objectif séances/semaine</div>
      <div style="margin-top:var(--space-md)">
        <div style="display:flex;gap:var(--space-sm);justify-content:center">
          ${[2,3,4,5,6].map(n => {
            const current = Utils.storage.get('ft_objectif_seances_semaine', 4);
            return `
              <button onclick="Utils.storage.set('ft_objectif_seances_semaine',${n});naviguer('settings')"
                      style="width:44px;height:44px;border-radius:50%;
                             font-weight:700;font-size:.9rem;cursor:pointer;
                             background:${current === n ? 'var(--fd-indigo)' : 'var(--bg-input)'};
                             color:${current === n ? 'white' : 'var(--text-muted)'};
                             border:2px solid ${current === n ? 'var(--fd-indigo)' : 'var(--border-color)'}">
                ${n}
              </button>`;
          }).join('')}
        </div>
      </div>
    </div>

    <div id="alarme-section"></div>
    <div id="offline-content"></div>

    <div style="text-align:center;font-size:.65rem;color:var(--text-muted);
                margin-top:var(--space-md)">
      PowerApp v3.0 · Othmane Turbo<br>Build 2026
    </div>
  `;

  try { TimerManager.renderAlarme(document.getElementById('alarme-section')); } catch(e) {}
  try { Offline.render(document.getElementById('offline-content')); } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// PAGE NUTRITION (fallback)
// ════════════════════════════════════════════════════════════
function _rendreNutrition(container) {
  let profil = { poids:80 };
  try { profil = Tracker.getProfil(); } catch(e) {}
  const prot = Math.round((profil.poids || 80) * 2);
  const cal  = Math.round((profil.poids || 80) * 35);
  const eau  = ((profil.poids || 80) * 0.035).toFixed(1);

  container.innerHTML = `
    <div class="card mb-md" style="text-align:center;border-color:var(--fd-mint)">
      <div style="font-size:2rem">🥗</div>
      <div style="font-weight:700;font-size:1.1rem;margin-top:var(--space-sm)">
        Recommandations nutrition
      </div>
      <div style="font-size:.75rem;color:var(--text-muted);margin-top:4px">
        Basé sur ton profil (${profil.poids || 80}kg)
      </div>
    </div>
    ${[
      { emoji:'🥩', label:'Protéines',      val:`${prot}g/jour`,             color:'var(--fd-coral)'   },
      { emoji:'🔥', label:'Calories',        val:`~${cal} kcal`,              color:'var(--fd-lemon)'   },
      { emoji:'💧', label:'Eau',             val:`${eau}L/jour`,              color:'var(--fd-indigo)'  },
      { emoji:'⏰', label:'Repas pré-séance',val:'2-3h avant',               color:'var(--fd-mint)'    },
      { emoji:'🥛', label:'Post-séance',     val:'Protéines+glucides 30min',  color:'var(--fd-lavender)'}
    ].map(r => `
      <div class="card mb-md">
        <div class="flex justify-between items-center">
          <div style="display:flex;align-items:center;gap:var(--space-md)">
            <span style="font-size:1.5rem">${r.emoji}</span>
            <div style="font-weight:600;font-size:.88rem">${r.label}</div>
          </div>
          <div style="font-size:.92rem;font-weight:800;color:${r.color}">${r.val}</div>
        </div>
      </div>`).join('')}
    <div class="card" style="text-align:center;padding:var(--space-lg);opacity:.6">
      <div style="font-size:1.5rem">🚀</div>
      <div style="font-size:.82rem;color:var(--text-muted);margin-top:var(--space-sm)">
        Module Nutrition complet — Bientôt disponible
      </div>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// ACTIONS SÉANCE
// ════════════════════════════════════════════════════════════
const App = {

  _avatarChoisi:   null,
  _objectifChoisi: null,

  _selectAvatar(val, btn) {
    this._avatarChoisi = val;
    document.querySelectorAll('.profil-avatar-btn').forEach(b => {
      b.style.borderColor = 'var(--border-color)';
      b.style.background  = 'var(--bg-input)';
    });
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.background  = 'var(--fd-indigo-dim)';
  },

  _selectObjectifProfil(val, btn) {
    this._objectifChoisi = val;
    document.querySelectorAll('.profil-obj-btn').forEach(b => {
      b.style.borderColor = '';
      b.style.background  = '';
    });
    btn.style.borderColor = 'var(--fd-indigo)';
    btn.style.background  = 'var(--fd-indigo-dim)';
  },

  sauvegarderProfil() {
    try {
      const nom    = document.getElementById('profil-edit-nom')?.value?.trim();
      const poids  = parseFloat(document.getElementById('profil-edit-poids')?.value);
      const taille = parseFloat(document.getElementById('profil-edit-taille')?.value);

      if (!nom) { Utils.toast('Entre ton prénom !', 'error'); return; }

      const profil  = Tracker.getProfil();
      const updates = {
        nom,
        poids:  isNaN(poids)  ? profil.poids  : poids,
        taille: isNaN(taille) ? profil.taille : taille
      };

      if (this._avatarChoisi)   updates.avatar   = this._avatarChoisi;
      if (this._objectifChoisi) updates.objectif = this._objectifChoisi;

      Tracker.sauvegarderProfil(updates);
      Utils.toast('✅ Profil sauvegardé !', 'success');
      Utils.vibrerSuccess();
      this._avatarChoisi   = null;
      this._objectifChoisi = null;
      naviguer('profil');
    } catch(e) {
      console.error('[App] Erreur sauvegarde profil:', e);
      Utils.toast('❌ Erreur sauvegarde', 'error');
    }
  },

  validerSerie(seanceId, exoRef, exoIdx, serieIdx) {
    const poids = parseFloat(document.getElementById(`poids-${exoIdx}-${serieIdx}`)?.value);
    const reps  = parseInt(document.getElementById(`reps-${exoIdx}-${serieIdx}`)?.value);
    const rpe   = parseFloat(document.getElementById(`rpe-${exoIdx}-${serieIdx}`)?.value) || null;

    if (!poids || !reps) { Utils.toast('Entre le poids et les reps !', 'error'); return; }

    let result = { isPR:false };
    try { result = Tracker.sauvegarderSerie(seanceId, exoRef, serieIdx+1, reps, poids, rpe); } catch(e) {}

    try {
      if (!Chrono._actif) {
        Chrono.reset();
        Chrono.demarrer();
        const nomSeance = (window.SEANCES_BASE || {})[seanceId]?.nom || 'Séance en cours';
        ChronoSticky.afficher(nomSeance);
      }
    } catch(e) {}

    try {
      if (!ChronoSticky._visible) {
        const nomSeance = (window.SEANCES_BASE || {})[seanceId]?.nom || 'Séance en cours';
        Chrono.reset?.();
        Chrono.demarrer?.();
        ChronoSticky.afficher(nomSeance);
      }
    } catch(e) {}

    const btn = document.getElementById(`btn-serie-${exoIdx}-${serieIdx}`);
    if (btn) {
      btn.textContent       = '✅';
      btn.style.background  = 'var(--fd-mint)';
      btn.style.borderColor = 'var(--fd-mint)';
    }

    try {
      const seanceInfo = (window.SEANCES_BASE || {})[seanceId];
      const exo        = seanceInfo?.exercices?.[exoIdx];
      const reposDuree = exo?.repos || 75;
      TimerManager.demarrerRepos(reposDuree);
    } catch(e) {}

    if (result.isPR) {
      try { timerRepos.jouerSon('pr');               } catch(e) {}
      try { Gamification.recompenser('PR_BATTU');    } catch(e) {}
      try { Notifications.notifierPR(exoRef, poids, reps); } catch(e) {}
      Utils.toast(`🏆 Nouveau record ! ${poids}kg × ${reps}`, 'pr', 4000);
      Utils.vibrerPR();
    } else {
      Utils.vibrerSuccess();
      Utils.toast('✅ Série validée !', 'success', 1500);
    }

    try { Gamification.recompenser('SERIE_COMPLETE'); } catch(e) {}
    // ✅ Séance guidée — annonce vocale
      try {
        SeanceGuidee.serieValidee(exoIdx, serieIdx, poids, reps, result.isPR);
      } catch(e) {}  
    try {
      if (!Offline.estEnLigne()) {
        Offline.ajouterAction('serie_sauvegardee', {
          seanceId, exoRef, poids, reps, rpe, date: Utils.aujourd_hui()
        });
      }
    } catch(e) {}
  },

  async terminerSeance(seanceId) {
    try {
      const duree  = Tracker.getDureeSeance?.(seanceId) || 0;
      const volume = Tracker.getVolumeSemaine?.()       || 0;
      const prs = (() => {
        try { return (Tracker.getPRsSeance?.(seanceId) || []).length; }
        catch(e) { return 0; }
      })();
      const seance = (window.SEANCES_BASE || {})[seanceId];
      const nom    = seance?.nom || 'Séance';

      try { Tracker.terminerSeance(seanceId); } catch(e) {}
      try { ChronoSticky.masquer(); Chrono.reset?.(); } catch(e) {}

      try {
        const secondes = TempsSalle.getDureeChronoSecondes();
        TempsSalle.sauvegarder(seanceId, secondes);
      } catch(e) {}

      try {
        Gamification.recompenser('SEANCE_COMPLETE');
        Gamification.verifierTrophees();
      } catch(e) {}

      try { Defis.mettreAJourProgression();              } catch(e) {}
      try { Notifications.notifierFinSeance(nom,duree,volume); } catch(e) {}
      try { Notifications.verifierSemaineParf();         } catch(e) {}
      try { if (Programme.isDecharge?.()) Notifications.notifierDecharge(); } catch(e) {}
      try {
        if (!Offline.estEnLigne()) {
          Offline.ajouterAction('seance_complete', {
            seanceId, date: Utils.aujourd_hui(), duree, volume
          });
        }
      } catch(e) {}

      Utils.confetti(3000);
      try { timerRepos.jouerSon('pr'); } catch(e) {}
      Utils.vibrer([200,100,200,100,400]);
      // ✅ Annonce vocale fin de séance
try { SeanceGuidee.annoncerFinSeance(volume, prs); } catch(e) {}
try { SeanceGuidee.arreter(); } catch(e) {} 
      _afficherResumSeance(seanceId, duree, volume, prs);

    } catch(e) {
      console.error('[App] Erreur terminer séance:', e);
      naviguer('home');
    }
  },

  async arreterSeance(seanceId) {
    const ok = await Utils.confirmer('Arrêter la séance ?', 'Ta progression sera sauvegardée.');
    if (!ok) return;
    try { Tracker.terminerSeance?.(seanceId); } catch(e) {}
    try { ChronoSticky.masquer(); Chrono.reset?.(); } catch(e) {}
    Utils.toast('Séance arrêtée.', 'info');
    naviguer('home');
  },

  setHumeur(humeur) {
    try {
      Tracker.sauvegarderHumeur(humeur);
      Gamification.recompenser('HUMEUR');
      Utils.toast(`Humeur: ${humeur}`, 'success', 1500);
      naviguer('home');
    } catch(e) {}
  },

  setFatigue(niveau) {
    try {
      Tracker.sauvegarderFatigue(niveau);
      Utils.toast('Fatigue enregistrée.', 'success', 1500);
      naviguer('home');
    } catch(e) {}
  }
};

// ════════════════════════════════════════════════════════════
// RÉSUMÉ FIN DE SÉANCE
// ════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════
// RÉSUMÉ FIN DE SÉANCE v2.0
// Donut muscles + Score + PR animés + Image PNG
// ════════════════════════════════════════════════════════════
function _afficherResumSeance(seanceId, duree, volume, prs) {
  const modal   = document.getElementById('modal-info');
  const content = document.getElementById('modal-info-content');
  if (!modal || !content) { naviguer('home'); return; }

  const seance  = (window.SEANCES_BASE || {})[seanceId]
    || { nom:'Séance', emoji:'💪' };

  // ✅ Récupérer données complètes
  let seriesDetails = [], scoreSeance = 0, msgMotiv = '';
  let rpesMoyen = 0, comparaison = null;

  try {
    const seanceData = Tracker.getSeanceDuJour();
    seriesDetails    = seanceData?.series || [];
    rpesMoyen        = seanceData?.rpesMoyen || 0;
  } catch(e) {}

  try {
    const forme  = Tracker.calculerScoreForme();
    scoreSeance  = forme.score || 0;
  } catch(e) {}

  try {
    const comp   = Tracker.getComparaisonSemaines();
    comparaison  = comp;
  } catch(e) {}

  try {
    const msg = Coach.getMessageDuJour();
    msgMotiv  = msg?.message || 'Belle séance !';
  } catch(e) { msgMotiv = 'Excellent travail ! Continue comme ça 💪'; }

  // ✅ Calculer répartition muscles depuis les séries
  const musclesData = {};
  seriesDetails.forEach(s => {
    const ex     = (window.EXERCICES || {})[s.exerciceRef] || {};
    const muscle = ex.muscle || 'Autre';
    const vol    = (s.poids || 0) * (s.reps || 0);
    musclesData[muscle] = (musclesData[muscle] || 0) + vol;
  });

  const musclesArr = Object.entries(musclesData)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  const totalMusc = musclesArr.reduce((a,[,v]) => a + v, 0) || 1;

  // ✅ Couleurs pour le donut
  const COULEURS = [
    '#4b4bf9', '#8bf0bb', '#f9ef77',
    '#bfa1ff', '#ff8d96'
  ];

  // ✅ Générer le SVG donut
  function genererDonut(data, total, rayon = 60) {
    const cx = 80, cy = 80;
    const strokeW = 18;
    const circ    = 2 * Math.PI * rayon;

    let offset = 0;
    let segments = '';

    data.forEach(([muscle, vol], i) => {
      const pct    = vol / total;
      const dash   = circ * pct;
      const gap    = circ - dash;
      const rotate = (offset / total) * 360 - 90;

      segments += `
        <circle
          cx="${cx}" cy="${cy}" r="${rayon}"
          fill="none"
          stroke="${COULEURS[i]}"
          stroke-width="${strokeW}"
          stroke-dasharray="${dash} ${gap}"
          stroke-dashoffset="0"
          transform="rotate(${rotate} ${cx} ${cy})"
          style="transition:stroke-dashoffset 1s ease ${i*0.15}s"
        />`;

      offset += vol;
    });

    return `
      <svg width="160" height="160" viewBox="0 0 160 160">
        <!-- Track -->
        <circle cx="${cx}" cy="${cy}" r="${rayon}"
                fill="none" stroke="rgba(255,255,255,0.05)"
                stroke-width="${strokeW}"/>
        ${segments}
        <!-- Centre -->
        <text x="${cx}" y="${cy - 8}"
              text-anchor="middle"
              fill="white" font-size="11"
              font-weight="800">
          ${musclesArr.length}
        </text>
        <text x="${cx}" y="${cy + 6}"
              text-anchor="middle"
              fill="rgba(255,255,255,0.5)"
              font-size="8">
          muscles
        </text>
        <text x="${cx}" y="${cy + 18}"
              text-anchor="middle"
              fill="var(--fd-mint)" font-size="8"
              font-weight="700">
          travaillés
        </text>
      </svg>`;
  }

  // ✅ Score couleur
  const scoreCouleur = scoreSeance >= 80
    ? 'var(--fd-mint)'
    : scoreSeance >= 60
      ? 'var(--fd-indigo)'
      : scoreSeance >= 40
        ? 'var(--fd-lemon)'
        : 'var(--fd-coral)';

  const scoreEmoji = scoreSeance >= 80 ? '🔥'
    : scoreSeance >= 60 ? '💪'
    : scoreSeance >= 40 ? '👍'
    : '😤';

  // ✅ Durée formatée
  const dureeAffichee = (() => {
    try {
      const sec = TempsSalle.recuperer(seanceId);
      if (sec > 60) return TempsSalle.formaterDuree(sec);
    } catch(e) {}
    return Utils.formatDuree(duree);
  })();

  // ✅ PRs de la séance
  let prsDetails = [];
  try {
    prsDetails = Tracker.getPRsSeance(seanceId) || [];
  } catch(e) {}

  content.innerHTML = `
    <div style="padding:0;overflow:hidden">

      <!-- ═══ HERO ═══ -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.3) 0%,
                  rgba(139,240,187,0.1) 100%);
                  padding:24px 20px 20px;
                  text-align:center;
                  position:relative;overflow:hidden">

        <!-- Glow -->
        <div style="position:absolute;top:-40px;left:50%;
                    transform:translateX(-50%);
                    width:200px;height:200px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.3) 0%,transparent 70%);
                    pointer-events:none">
        </div>

        <div style="font-size:2.5rem;margin-bottom:6px;
                    position:relative;z-index:1">
          🏁
        </div>
        <div style="font-size:1.3rem;font-weight:800;
                    color:var(--fd-mint);
                    margin-bottom:4px;position:relative;z-index:1">
          Séance terminée !
        </div>
        <div style="font-size:.88rem;color:rgba(255,255,255,0.6);
                    position:relative;z-index:1">
          ${seance.emoji} ${seance.nom}
        </div>
      </div>

      <div style="padding:16px 16px 0">

        <!-- ═══ STATS PRINCIPALES ═══ -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:16px">
          ${[
            { label:'Volume',   val:Utils.formatVolume(volume),
              color:'var(--fd-mint)',    emoji:'📦' },
            { label:'Durée',    val:dureeAffichee,
              color:'var(--fd-indigo)', emoji:'⏱️'  },
            { label:'Records',  val:`${prs} 🏆`,
              color:'var(--fd-lemon)',  emoji:'⭐'  }
          ].map(s => `
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-lg);
                        padding:12px 8px;text-align:center">
              <div style="font-size:.85rem;margin-bottom:3px">
                ${s.emoji}
              </div>
              <div style="font-size:.95rem;font-weight:800;
                          color:${s.color};line-height:1">
                ${s.val}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          margin-top:3px;text-transform:uppercase;
                          letter-spacing:.04em">
                ${s.label}
              </div>
            </div>`).join('')}
        </div>

        <!-- ═══ DONUT MUSCLES ═══ -->
        ${musclesArr.length > 0 ? `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:16px;margin-bottom:16px">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--text-muted);margin-bottom:12px">
              🎯 Répartition musculaire
            </div>
            <div style="display:flex;align-items:center;gap:16px">

              <!-- Donut SVG -->
              <div style="flex-shrink:0" id="donut-wrapper">
                ${genererDonut(musclesArr, totalMusc)}
              </div>

              <!-- Légende -->
              <div style="flex:1;display:flex;
                          flex-direction:column;gap:6px">
                ${musclesArr.map(([muscle, vol], i) => {
                  const pct = Math.round((vol / totalMusc) * 100);
                  return `
                    <div>
                      <div style="display:flex;justify-content:space-between;
                                  align-items:center;margin-bottom:2px">
                        <span style="font-size:.72rem;font-weight:600;
                                     color:${COULEURS[i]}">
                          ${muscle}
                        </span>
                        <span style="font-size:.65rem;
                                     color:var(--text-muted)">
                          ${pct}%
                        </span>
                      </div>
                      <div style="height:4px;
                                  background:rgba(255,255,255,0.05);
                                  border-radius:99px;overflow:hidden">
                        <div style="height:100%;width:0%;
                                    background:${COULEURS[i]};
                                    border-radius:99px;
                                    transition:width 1s ease ${i*0.15}s"
                             data-width="${pct}">
                        </div>
                      </div>
                    </div>`;
                }).join('')}
              </div>
            </div>
          </div>` : ''}

        <!-- ═══ SCORE DE SÉANCE ═══ -->
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:14px 16px;margin-bottom:16px">
          <div style="display:flex;align-items:center;
                      justify-content:space-between">
            <div>
              <div style="font-size:.6rem;font-weight:700;
                          text-transform:uppercase;letter-spacing:.1em;
                          color:var(--text-muted);margin-bottom:4px">
                ${scoreEmoji} Score de forme
              </div>
              <div style="font-size:2rem;font-weight:800;
                          color:${scoreCouleur};line-height:1">
                ${scoreSeance}
                <span style="font-size:.9rem;
                             color:var(--text-muted);
                             font-weight:400">/100</span>
              </div>
            </div>

            <!-- Arc score -->
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      stroke-width="8"
                      stroke-dasharray="150 51"
                      transform="rotate(135 40 40)"/>
              <circle cx="40" cy="40" r="32"
                      fill="none"
                      stroke="${scoreCouleur}"
                      stroke-width="8"
                      stroke-linecap="round"
                      stroke-dasharray="${Math.round(150*(scoreSeance/100))} 201"
                      transform="rotate(135 40 40)"
                      style="transition:stroke-dasharray 1.5s ease;
                             filter:drop-shadow(0 0 4px ${scoreCouleur})"/>
              <text x="40" y="44"
                    text-anchor="middle"
                    fill="${scoreCouleur}"
                    font-size="14"
                    font-weight="800">
                ${scoreEmoji}
              </text>
            </svg>
          </div>

          <!-- Barres détail score -->
          <div style="margin-top:10px;display:grid;
                      grid-template-columns:1fr 1fr 1fr;
                      gap:8px">
            ${(() => {
              let recup = 0, assiduite = 0, progression = 0;
              try {
                const f  = Tracker.calculerScoreForme();
                recup      = f.recup       || 0;
                assiduite  = f.assiduite   || 0;
                progression= f.progression || 0;
              } catch(e) {}
              return [
                {label:'Récup',  val:recup,      color:'var(--fd-mint)'    },
                {label:'Assiduité',val:assiduite, color:'var(--fd-indigo)'  },
                {label:'Prog.',  val:progression, color:'var(--fd-lavender)'}
              ].map(s => `
                <div style="text-align:center">
                  <div style="font-size:.65rem;font-weight:700;
                              color:${s.color}">${s.val}%</div>
                  <div style="height:3px;background:rgba(255,255,255,0.05);
                              border-radius:99px;overflow:hidden;
                              margin:3px 0">
                    <div style="height:100%;width:${s.val}%;
                                background:${s.color};border-radius:99px;
                                transition:width 1.2s ease">
                    </div>
                  </div>
                  <div style="font-size:.55rem;color:var(--text-muted)">
                    ${s.label}
                  </div>
                </div>`).join('');
            })()}
          </div>
        </div>

        <!-- ═══ COMPARAISON SEMAINE ═══ -->
        ${comparaison ? `
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);
                      padding:14px 16px;margin-bottom:16px">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--text-muted);margin-bottom:10px">
              📊 Cette semaine vs précédente
            </div>
            <div style="display:flex;align-items:center;
                        justify-content:space-between">
              <div style="text-align:center">
                <div style="font-size:.72rem;color:var(--text-muted)">
                  Semaine préc.
                </div>
                <div style="font-size:1rem;font-weight:700;
                            color:var(--text-secondary);margin-top:2px">
                  ${Utils.formatVolume(comparaison.prec)}
                </div>
              </div>
              <div style="text-align:center;
                          padding:8px 16px;
                          background:${comparaison.delta >= 0
                            ? 'rgba(139,240,187,0.1)'
                            : 'rgba(255,141,150,0.1)'};
                          border-radius:var(--radius-md);
                          border:1px solid ${comparaison.delta >= 0
                            ? 'rgba(139,240,187,0.2)'
                            : 'rgba(255,141,150,0.2)'}">
                <div style="font-size:1.3rem;font-weight:800;
                            color:${comparaison.delta >= 0
                              ? 'var(--fd-mint)'
                              : 'var(--fd-coral)'}">
                  ${comparaison.delta >= 0 ? '+' : ''}${comparaison.delta}%
                </div>
                <div style="font-size:.6rem;color:var(--text-muted)">
                  ${comparaison.delta >= 0 ? '📈 En hausse' : '📉 En baisse'}
                </div>
              </div>
              <div style="text-align:center">
                <div style="font-size:.72rem;color:var(--text-muted)">
                  Cette semaine
                </div>
                <div style="font-size:1rem;font-weight:700;
                            color:var(--fd-mint);margin-top:2px">
                  ${Utils.formatVolume(comparaison.cette)}
                </div>
              </div>
            </div>
          </div>` : ''}

        <!-- ═══ PRs ANIMÉS ═══ -->
        ${prsDetails.length > 0 ? `
          <div style="background:linear-gradient(135deg,
                      rgba(249,239,119,0.12),
                      rgba(249,239,119,0.03));
                      border:1px solid rgba(249,239,119,0.3);
                      border-radius:var(--radius-lg);
                      padding:14px 16px;margin-bottom:16px">
            <div style="font-size:.6rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.1em;
                        color:var(--fd-lemon);margin-bottom:10px;
                        display:flex;align-items:center;gap:6px">
              <span style="animation:pulse 1s infinite">🏆</span>
              Nouveaux records personnels !
            </div>
            ${prsDetails.slice(0, 3).map(pr => {
              const ex = (window.EXERCICES || {})[pr.exerciceRef] || {};
              return `
                <div style="display:flex;align-items:center;gap:10px;
                            padding:8px 0;
                            border-bottom:1px solid rgba(249,239,119,0.1)">
                  <span style="font-size:1.2rem">${ex.emoji || '💪'}</span>
                  <div style="flex:1">
                    <div style="font-size:.8rem;font-weight:700">
                      ${ex.nom || pr.exerciceRef}
                    </div>
                    <div style="font-size:.65rem;color:var(--fd-mint)">
                      ${ex.muscle || ''}
                    </div>
                  </div>
                  <div style="text-align:right">
                    <div style="font-size:.88rem;font-weight:800;
                                color:var(--fd-lemon)">
                      ${pr.poids}kg × ${pr.reps}
                    </div>
                    <div style="font-size:.6rem;color:var(--text-muted)">
                      1RM: ~${pr.rm1 || Math.round(pr.poids * (1 + pr.reps/30))}kg
                    </div>
                  </div>
                </div>`;
            }).join('')}
          </div>` : ''}

        <!-- ═══ RPE + SÉRIES ═══ -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:16px">
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-md);
                      padding:12px;text-align:center">
            <div style="font-size:.62rem;color:var(--text-muted);
                        margin-bottom:4px">😤 RPE moyen</div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:${rpesMoyen >= 8
                          ? 'var(--fd-coral)'
                          : rpesMoyen >= 6
                            ? 'var(--fd-lemon)'
                            : 'var(--fd-mint)'}">
              ${rpesMoyen || '—'}<span style="font-size:.7rem;
                                               color:var(--text-muted);
                                               font-weight:400">/10</span>
            </div>
          </div>
          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-md);
                      padding:12px;text-align:center">
            <div style="font-size:.62rem;color:var(--text-muted);
                        margin-bottom:4px">💪 Séries validées</div>
            <div style="font-size:1.3rem;font-weight:800;
                        color:var(--fd-indigo)">
              ${seriesDetails.length}
            </div>
          </div>
        </div>

        <!-- ═══ MESSAGE COACH ═══ -->
        <div style="background:rgba(191,161,255,0.08);
                    border:1px solid rgba(191,161,255,0.15);
                    border-left:3px solid var(--fd-lavender);
                    border-radius:var(--radius-md);
                    padding:12px 14px;margin-bottom:16px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.08em;
                      color:var(--fd-lavender);margin-bottom:4px">
            🤖 Coach IA
          </div>
          <p style="font-size:.8rem;color:var(--text-secondary);
                    line-height:1.55;margin:0">
            ${msgMotiv}
          </p>
        </div>

        <!-- ═══ CORRECTION DURÉE ═══ -->
        ${(() => {
          try {
            const sec = TempsSalle.getDureeChronoSecondes() || duree;
            return TempsSalle.renderCorrectionWidget(seanceId, sec);
          } catch(e) { return ''; }
        })()}

        <!-- ═══ ACTIONS ═══ -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-top:16px;padding-bottom:16px">
          <button onclick="ResumSeance.genererImagePNG('${seanceId}')"
                  style="display:flex;align-items:center;
                         justify-content:center;gap:6px;
                         padding:12px;
                         background:rgba(75,75,249,0.15);
                         border:1px solid rgba(75,75,249,0.3);
                         border-radius:var(--radius-md);
                         color:var(--fd-indigo);font-size:.78rem;
                         font-weight:700;cursor:pointer">
            📸 Story Instagram
          </button>
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden');
                           naviguer('home')"
                  class="btn-primary"
                  style="font-size:.82rem;border-radius:var(--radius-md)">
            🏠 Accueil
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');

  // ✅ Animer les barres après rendu
  requestAnimationFrame(() => {
    setTimeout(() => {
      // Barres de légende donut
      document.querySelectorAll('[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }, 100);
  });

  // ✅ Bouton fermer
  const closeBtn = document.getElementById('modal-info-close');
  if (closeBtn) closeBtn.onclick = () => {
    modal.classList.add('hidden');
    naviguer('home');
  };
}

// ════════════════════════════════════════════════════════════
// RÉSUMÉ SÉANCE — Génération image PNG (Story Instagram)
// ════════════════════════════════════════════════════════════
const ResumSeance = {

  async genererImagePNG(seanceId) {
    try {
      Utils.toast('⏳ Génération en cours...', 'info', 2000);

      const canvas  = document.createElement('canvas');
      canvas.width  = 1080;
      canvas.height = 1920;
      const ctx     = canvas.getContext('2d');

      // ✅ Récupérer données
      const seance     = (window.SEANCES_BASE || {})[seanceId]
        || { nom:'Séance', emoji:'💪' };

      let profil    = { nom:'Athlète', avatar:'💪' };
      let xp        = { total:0, niveau:{ numero:1, nom:'Débutant' } };
      let streak    = { count:0 };
      let volume    = 0;
      let prs       = 0;
      let scoreForm = 0;
      let dureeAff  = '—';

      try { profil    = Tracker.getProfil();         } catch(e) {}
      try { xp        = Gamification.getXP();        } catch(e) {}
      try { streak    = Tracker.getStreak();         } catch(e) {}
      try { volume    = Tracker.getVolumeSemaine();  } catch(e) {}
      try { scoreForm = Tracker.calculerScoreForme().score; } catch(e) {}
      try {
        const sec = TempsSalle.recuperer(seanceId);
        dureeAff  = sec > 60
          ? TempsSalle.formaterDuree(sec)
          : '—';
      } catch(e) {}
      try {
        prs = (Tracker.getPRsSeance(seanceId) || []).length;
      } catch(e) {}

      // ✅ FOND — gradient bleu profond Foundever
      const gradFond = ctx.createLinearGradient(0, 0, 0, 1920);
      gradFond.addColorStop(0,    '#06063d');
      gradFond.addColorStop(0.5,  '#08082e');
      gradFond.addColorStop(1,    '#050520');
      ctx.fillStyle = gradFond;
      ctx.fillRect(0, 0, 1080, 1920);

      // ✅ Glow indigo en haut
      const glowTop = ctx.createRadialGradient(540, 0, 0, 540, 0, 600);
      glowTop.addColorStop(0,   'rgba(75,75,249,0.25)');
      glowTop.addColorStop(1,   'transparent');
      ctx.fillStyle = glowTop;
      ctx.fillRect(0, 0, 1080, 600);

      // ✅ Glow mint en bas
      const glowBot = ctx.createRadialGradient(540, 1920, 0, 540, 1920, 500);
      glowBot.addColorStop(0,   'rgba(139,240,187,0.12)');
      glowBot.addColorStop(1,   'transparent');
      ctx.fillStyle = glowBot;
      ctx.fillRect(0, 1400, 1080, 520);

      // ✅ LOGO PowerApp
      ctx.fillStyle    = '#4b4bf9';
      ctx.font         = 'bold 38px system-ui, sans-serif';
      ctx.textAlign    = 'center';
      ctx.fillText('⚡ PowerApp', 540, 120);

      // Ligne décorative sous le logo
      const ligne = ctx.createLinearGradient(200, 0, 880, 0);
      ligne.addColorStop(0, 'transparent');
      ligne.addColorStop(0.5, 'rgba(75,75,249,0.6)');
      ligne.addColorStop(1, 'transparent');
      ctx.strokeStyle = ligne;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(200, 140);
      ctx.lineTo(880, 140);
      ctx.stroke();

      // ✅ EMOJI SÉANCE
      ctx.font      = '120px serif';
      ctx.textAlign = 'center';
      ctx.fillText(seance.emoji, 540, 320);

      // ✅ NOM SÉANCE
      ctx.fillStyle = '#ffffff';
      ctx.font      = 'bold 72px system-ui, sans-serif';
      ctx.textAlign = 'center';
      this._wrapText(ctx, seance.nom, 540, 420, 900, 85);

      // ✅ Badge "Séance terminée"
      this._roundRect(ctx, 290, 520, 500, 70, 35,
        'rgba(139,240,187,0.15)', 'rgba(139,240,187,0.4)');
      ctx.fillStyle = '#8bf0bb';
      ctx.font      = 'bold 32px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✅ SÉANCE TERMINÉE', 540, 563);

      // ✅ STATS CARDS (3 cartes)
      const cartes = [
        { label:'VOLUME',  val:Utils.formatVolume(volume),  color:'#8bf0bb',  x:80  },
        { label:'DURÉE',   val:dureeAff,                    color:'#4b4bf9',  x:390 },
        { label:'RECORDS', val:`${prs} 🏆`,                 color:'#f9ef77',  x:700 }
      ];

      cartes.forEach(c => {
        // Card background
        this._roundRect(ctx, c.x, 640, 280, 180, 24,
          'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)');
        // Valeur
        ctx.fillStyle = c.color;
        ctx.font      = 'bold 52px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(c.val, c.x + 140, 740);
        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font      = '24px system-ui, sans-serif';
        ctx.fillText(c.label, c.x + 140, 785);
      });

      // ✅ DONUT MUSCLES
      const musclesData = {};
      try {
        const seanceData = Tracker.getSeanceDuJour();
        (seanceData?.series || []).forEach(s => {
          const ex     = (window.EXERCICES || {})[s.exerciceRef] || {};
          const muscle = ex.muscle || 'Autre';
          const vol    = (s.poids || 0) * (s.reps || 0);
          musclesData[muscle] = (musclesData[muscle] || 0) + vol;
        });
      } catch(e) {}

      const musclesArr  = Object.entries(musclesData)
        .sort((a,b) => b[1] - a[1]).slice(0, 5);
      const totalMusc   = musclesArr.reduce((a,[,v]) => a + v, 0) || 1;
      const COULEURS    = ['#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff','#ff8d96'];

      if (musclesArr.length > 0) {
        // Titre section
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font      = '28px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('RÉPARTITION MUSCULAIRE', 540, 900);

        // Donut canvas
        const cx = 540, cy = 1060, r = 140, sw = 30;
        const circ = 2 * Math.PI * r;

        // Track
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth   = sw;
        ctx.stroke();

        // Segments
        let startAngle = -Math.PI / 2;
        musclesArr.forEach(([muscle, vol], i) => {
          const angle = (vol / totalMusc) * 2 * Math.PI;
          ctx.beginPath();
          ctx.arc(cx, cy, r, startAngle, startAngle + angle);
          ctx.strokeStyle = COULEURS[i];
          ctx.lineWidth   = sw;
          ctx.lineCap     = 'round';
          ctx.stroke();
          startAngle += angle;
        });

        // Centre donut
        ctx.fillStyle = '#ffffff';
        ctx.font      = 'bold 48px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${musclesArr.length}`, cx, cy - 10);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font      = '24px system-ui, sans-serif';
        ctx.fillText('muscles', cx, cy + 30);

        // Légende
        const legendY = 1240;
        musclesArr.forEach(([muscle, vol], i) => {
          const pct  = Math.round((vol / totalMusc) * 100);
          const col  = i % 2 === 0 ? 150 : 580;
          const row  = Math.floor(i / 2) * 70;

          // Point couleur
          ctx.fillStyle = COULEURS[i];
          ctx.beginPath();
          ctx.arc(col, legendY + row + 10, 10, 0, 2 * Math.PI);
          ctx.fill();

          // Nom muscle
          ctx.fillStyle = '#ffffff';
          ctx.font      = 'bold 26px system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(muscle, col + 25, legendY + row + 18);

          // Pourcentage
          ctx.fillStyle = COULEURS[i];
          ctx.font      = 'bold 26px system-ui, sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(`${pct}%`,
            i % 2 === 0 ? 520 : 1000,
            legendY + row + 18);
        });
      }

      // ✅ SCORE + STREAK
      const scoreY = musclesArr.length > 0 ? 1520 : 950;

      this._roundRect(ctx, 80, scoreY, 900, 140, 24,
        'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)');

      // Score
      ctx.fillStyle = scoreForm >= 70
        ? '#8bf0bb' : scoreForm >= 50
          ? '#4b4bf9' : '#f9ef77';
      ctx.font      = 'bold 64px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${scoreForm}/100`, 300, scoreY + 80);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '26px system-ui, sans-serif';
      ctx.fillText('SCORE DE FORME', 300, scoreY + 115);

      // Streak
      ctx.fillStyle = '#f9ef77';
      ctx.font      = 'bold 64px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`🔥 ${streak.count}`, 780, scoreY + 80);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '26px system-ui, sans-serif';
      ctx.fillText('STREAK', 780, scoreY + 115);

      // ✅ PROFIL
      const profilY = musclesArr.length > 0 ? 1700 : 1120;

      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font      = '30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${profil.avatar} ${profil.nom} · Niv.${xp.niveau.numero} · ${xp.total} XP`,
        540, profilY
      );

      // Ligne décorative
      const ligneBot = ctx.createLinearGradient(200, 0, 880, 0);
      ligneBot.addColorStop(0, 'transparent');
      ligneBot.addColorStop(0.5, 'rgba(75,75,249,0.4)');
      ligneBot.addColorStop(1, 'transparent');
      ctx.strokeStyle = ligneBot;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(200, profilY + 20);
      ctx.lineTo(880, profilY + 20);
      ctx.stroke();

      // ✅ DATE
      const dateStr = new Date().toLocaleDateString('fr-FR', {
        weekday:'long', day:'numeric', month:'long', year:'numeric'
      });
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.font      = '26px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(dateStr, 540, profilY + 60);

      // ✅ Watermark PowerApp
      ctx.fillStyle = 'rgba(75,75,249,0.5)';
      ctx.font      = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('powerapp.fitness', 540, 1880);

      // ✅ Télécharger
      const link    = document.createElement('a');
      link.download = `powerapp-seance-${Utils.aujourd_hui()}.png`;
      link.href     = canvas.toDataURL('image/png', 0.95);
      link.click();

      Utils.toast('✅ Story téléchargée !', 'success', 3000);
      Utils.vibrerSuccess();

    } catch(e) {
      console.error('[ResumSeance] Erreur PNG:', e);
      Utils.toast('❌ Erreur génération image', 'error');
    }
  },

  // ✅ Helper — texte multiligne
  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line    = '';
    let lines   = [];

    words.forEach(word => {
      const testLine  = line + word + ' ';
      const metrics   = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    lines.push(line.trim());

    lines.forEach((l, i) => {
      ctx.fillText(l, x, y + i * lineHeight);
    });
  },

  // ✅ Helper — rectangle arrondi
  _roundRect(ctx, x, y, w, h, r, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth   = 1;
      ctx.stroke();
    }
  }
};

window.ResumSeance = ResumSeance;

// ════════════════════════════════════════════════════════════
// UI
// ════════════════════════════════════════════════════════════
const UI = {
  toggleMenu()  {},
  ouvrirMenu()  {},
  fermerMenu()  {},
  _handler()    {},

  async confirmerReset() {
    const ok = await Utils.confirmer(
      '⚠️ Réinitialiser ?',
      'Toutes tes données seront supprimées définitivement.'
    );
    if (!ok) return;
    localStorage.clear();
    Utils.toast('Données supprimées.', 'info');
    setTimeout(() => window.location.reload(), 1000);
  }
};
window.UI = UI;

// ════════════════════════════════════════════════════════════
// THEME MANAGER
// ════════════════════════════════════════════════════════════
const ThemeManager = {
  CLE: 'ft_theme',

  getTheme() { return Utils.storage.get(this.CLE, 'dark'); },

  setTheme(theme) {
    Utils.storage.set(this.CLE, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this._updateBtn();
  },

  toggle() {
    const actuel  = this.getTheme();
    const nouveau = actuel === 'dark' ? 'light' : 'dark';
    this.setTheme(nouveau);
    Utils.toast(
      nouveau === 'light' ? '☀️ Mode clair activé' : '🌙 Mode sombre activé',
      'success', 1500
    );
  },

  init() {
    document.documentElement.setAttribute('data-theme', this.getTheme());
    this._injecterBtn();
  },

  _injecterBtn() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight || document.getElementById('theme-toggle')) return;

    const btn = document.createElement('button');
    btn.id        = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Changer de thème');
    btn.innerHTML = `<span class="icon-dark">🌙</span><span class="icon-light">☀️</span>`;
    btn.onclick   = () => ThemeManager.toggle();

    const xp = document.getElementById('header-xp');
    if (xp) headerRight.insertBefore(btn, xp);
    else    headerRight.appendChild(btn);
  },

  _updateBtn() {}
};
window.ThemeManager = ThemeManager;

// ════════════════════════════════════════════════════════════
// CHRONO STICKY
// ════════════════════════════════════════════════════════════
const ChronoSticky = {
  _visible:   false,
  _seanceNom: '',
  _interval:  null,

  afficher(seanceNom = '') {
    this._seanceNom = seanceNom;
    this._visible   = true;
    let el = document.getElementById('chrono-sticky');
    if (!el) {
      el    = document.createElement('div');
      el.id = 'chrono-sticky';
      document.body.appendChild(el);
    }
    el.classList.remove('hidden');
    this._render();
    this._lancerUpdate();
  },

  masquer() {
    this._visible = false;
    clearInterval(this._interval);
    const el = document.getElementById('chrono-sticky');
    if (el) el.classList.add('hidden');
  },

  _render() {
    const el = document.getElementById('chrono-sticky');
    if (!el) return;
    const temps   = this._getTemps();
    const enPause = Chrono?._enPause || false;
    el.innerHTML = `
      <div class="chrono-sticky-time">
        <span class="chrono-sticky-icon ${enPause ? 'paused' : ''}">
          ${enPause ? '⏸' : '⏱️'}
        </span>
        <div>
          <div class="chrono-sticky-display ${enPause ? 'paused' : ''}">${temps}</div>
          ${this._seanceNom ? `<div class="chrono-sticky-label">${this._seanceNom}</div>` : ''}
        </div>
      </div>
      <div class="chrono-sticky-controls">
        <button class="chrono-sticky-btn ${enPause ? 'resume' : 'pause'}"
                onclick="ChronoSticky._togglePause()">
          ${enPause ? '▶ Reprendre' : '⏸ Pause'}
        </button>
      </div>`;
  },

  _getTemps() {
    try {
      if (typeof Chrono !== 'undefined' && Chrono._actif) {
        return Chrono.formaterDuree(Chrono.getDureeSecondes());
      }
    } catch(e) {}
    return '00:00:00';
  },

  _togglePause() {
    try {
      if (Chrono?._enPause) Chrono.reprendre?.();
      else                   Chrono.pause?.();
      this._render();
    } catch(e) {}
  },

  _lancerUpdate() {
    clearInterval(this._interval);
    this._interval = setInterval(() => {
      if (!this._visible) { clearInterval(this._interval); return; }
      const disp    = document.querySelector('.chrono-sticky-display');
      const icon    = document.querySelector('.chrono-sticky-icon');
      const btn     = document.querySelector('.chrono-sticky-btn');
      const enPause = Chrono?._enPause || false;
      if (!Chrono?._actif) return;
      if (disp) {
        const sec = Chrono.getDureeSecondes?.() || 0;
        disp.textContent = Chrono.formaterDuree?.(sec) || '00:00';
        disp.className   = `chrono-sticky-display ${enPause ? 'paused' : ''}`;
      }
      if (icon) {
        icon.textContent = enPause ? '⏸' : '⏱️';
        icon.className   = `chrono-sticky-icon ${enPause ? 'paused' : ''}`;
      }
      if (btn) {
        btn.textContent = enPause ? '▶ Reprendre' : '⏸ Pause';
        btn.className   = `chrono-sticky-btn ${enPause ? 'resume' : 'pause'}`;
      }
    }, 1000);
  }
};
window.ChronoSticky = ChronoSticky;

// ════════════════════════════════════════════════════════════
// SWIPE NAVIGATION
// ════════════════════════════════════════════════════════════
const SwipeNav = {
  _startX:  0,
  _startY:  0,
  _active:  false,
  _blocked: false,
  _pages:   ['home','training','live','stats','nutrition'],

  init() {
    const main = document.querySelector('.app-main');
    if (!main) return;

    main.addEventListener('touchstart', e => {
      this._startX  = e.touches.clientX;
      this._startY  = e.touches.clientY;
      this._active  = true;
      this._blocked = false;

      const target     = e.target;
      const scrollable = target.closest(
        '.muscle-filter-row,.stats-tabs,.tab-scroll,.tabs-container,.filter-row,.chips-row'
      );
      if (scrollable) { this._blocked = true; return; }

      let el = target;
      while (el && el !== main) {
        const style     = window.getComputedStyle(el);
        const overflowX = style.overflowX;
        if ((overflowX === 'auto' || overflowX === 'scroll')
            && el.scrollWidth > el.clientWidth) {
          this._blocked = true;
          break;
        }
        el = el.parentElement;
      }
    }, { passive:true });

    main.addEventListener('touchmove', e => {
      if (!this._active) return;
      const dx = e.touches.clientX - this._startX;
      const dy = e.touches.clientY - this._startY;

      const target     = e.target;
      const scrollable = target.closest(
        '.tabs-container,.muscle-filter-row,.recette-filters,.stats-tabs,.tab-scroll'
      );
      if (scrollable) { this._blocked = true; return; }
      if (Math.abs(dy) > Math.abs(dx)) { this._blocked = true; }
    }, { passive:true });

    main.addEventListener('touchend', e => {
      if (!this._active || this._blocked) {
        this._active  = false;
        this._blocked = false;
        return;
      }
      this._active = false;

      const dx = e.changedTouches.clientX - this._startX;
      const dy = e.changedTouches.clientY - this._startY;

      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) < 80) return;

      const current = this._pages.indexOf(window._pageActive);
      if (current === -1) return;

      if (dx < 0 && current < this._pages.length - 1) naviguer(this._pages[current + 1]);
      else if (dx > 0 && current > 0)                  naviguer(this._pages[current - 1]);
    }, { passive:true });
  }
};
window.SwipeNav = SwipeNav;

// ════════════════════════════════════════════════════════════
// TEMPS À LA SALLE
// ════════════════════════════════════════════════════════════
const TempsSalle = {

  getDureeChronoSecondes() {
    try { return Chrono?._secondes || 0; } catch(e) { return 0; }
  },

  formaterDuree(secondes) {
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    const s = secondes % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2,'0')}min`;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },

  formaterCourt(secondes) {
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    if (h > 0) return `${h}h${String(m).padStart(2,'0')}`;
    return `${m}min`;
  },

  sauvegarder(seanceId, secondes) {
    Utils.storage.set(`ft_duree_${seanceId}_${Utils.aujourd_hui()}`, secondes);
  },

  recuperer(seanceId, date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(`ft_duree_${seanceId}_${d}`, 0);
  },

  renderCorrectionWidget(seanceId, secondesAuto) {
    const minutesAuto = Math.round(secondesAuto / 60);
    return `
      <div class="duration-edit-row">
        <span class="duration-edit-label">✏️ Corriger la durée</span>
        <input type="number" class="input duration-edit-input"
               id="duree-correction" value="${minutesAuto}"
               min="1" max="300" placeholder="min"/>
        <span style="font-size:.72rem;color:var(--text-muted)">min</span>
      </div>`;
  }
};
window.TempsSalle = TempsSalle;

// ════════════════════════════════════════════════════════════
// GALERIE EXERCICES
// ════════════════════════════════════════════════════════════
const GalerieExercices = {

  _filtreGroupe: 'tous',
  _filtreSearch: '',

  render(container) {
    if (!container) return;

    const groupes = [
      { val:'tous',     label:'Tous',      emoji:'💪' },
      { val:'push',     label:'Push',      emoji:'⬆️' },
      { val:'pull',     label:'Pull',      emoji:'⬇️' },
      { val:'jambes',   label:'Jambes',    emoji:'🦵' },
      { val:'abdos',    label:'Abdos',     emoji:'🔥' },
      { val:'cardio',   label:'Cardio',    emoji:'❤️' },
      { val:'fullbody', label:'Full Body', emoji:'🏋️' }
    ];

    const exos = this._getExosFiltres();

    container.innerHTML = `
      <div class="card mb-md"
           style="background:linear-gradient(135deg,rgba(75,75,249,0.15),rgba(139,240,187,0.05))">
        <div style="font-size:1.1rem;font-weight:800;margin-bottom:4px">
          💪 Galerie des exercices
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          ${Object.keys(window.EXERCICES || {}).length} exercices disponibles
        </div>
      </div>

      <div class="search-container mb-md">
        <span class="search-icon">🔍</span>
        <input class="input search-input" id="galerie-search"
               placeholder="Rechercher un exercice..."
               oninput="GalerieExercices._filtrerSearch(this.value)"/>
        ${this._filtreSearch ? `
          <button class="search-clear"
                  onclick="GalerieExercices._filtrerSearch('')">✕</button>` : ''}
      </div>

      <div class="muscle-filter-row mb-md">
        ${groupes.map(g => `
          <button class="muscle-filter-btn ${this._filtreGroupe === g.val ? 'active' : ''}"
                  onclick="GalerieExercices._filtrerGroupe('${g.val}')">
            ${g.emoji} ${g.label}
          </button>`).join('')}
      </div>

      <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:var(--space-sm)">
        ${exos.length} exercice${exos.length > 1 ? 's' : ''}
        ${this._filtreGroupe !== 'tous' ? ` · ${this._filtreGroupe}` : ''}
        ${this._filtreSearch ? ` · "${this._filtreSearch}"` : ''}
      </div>

      ${exos.length === 0 ? `
        <div class="card" style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;margin-bottom:8px">🔍</div>
          <div style="color:var(--text-muted);font-size:.85rem">Aucun exercice trouvé</div>
        </div>` : `
        <div class="exercice-galerie-grid">
          ${exos.map(([ref, ex]) => `
            <div class="exercice-galerie-card"
                 onclick="GalerieExercices._voirDetail('${ref}')">
              <div class="exercice-galerie-emoji">${ex.emoji || '💪'}</div>
              <div class="exercice-galerie-nom">${ex.nom}</div>
              <div class="exercice-galerie-muscle">${ex.muscle || ''}</div>
              <div class="exercice-galerie-difficulte">
                ${[1,2,3,4,5].map(d => `
                  <div class="difficulte-dot ${d <= (ex.difficulte || 1) ? 'active' : ''}"></div>
                `).join('')}
              </div>
              ${ex.youtube ? `
                <div style="margin-top:var(--space-xs)">
                  <span style="font-size:.6rem;color:rgba(255,0,0,0.7);font-weight:600">
                    ▶ Démo dispo
                  </span>
                </div>` : ''}
            </div>`).join('')}
        </div>`}
    `;

    const searchInput = document.getElementById('galerie-search');
    if (searchInput && this._filtreSearch) searchInput.value = this._filtreSearch;
  },

  _getExosFiltres() {
    return Object.entries(window.EXERCICES || {}).filter(([ref, ex]) => {
      const matchGroupe = this._filtreGroupe === 'tous' || ex.groupe === this._filtreGroupe;
      const matchSearch = !this._filtreSearch
        || ex.nom.toLowerCase().includes(this._filtreSearch.toLowerCase())
        || (ex.muscle || '').toLowerCase().includes(this._filtreSearch.toLowerCase());
      return matchGroupe && matchSearch;
    });
  },

  _filtrerGroupe(groupe) {
    this._filtreGroupe = groupe;
    const container = document.getElementById('page-galerie')
      || document.getElementById('stats-content');
    if (container) this.render(container);
  },

  _filtrerSearch(val) {
    this._filtreSearch = val;
    const container = document.getElementById('page-galerie')
      || document.getElementById('stats-content');
    if (container) this.render(container);
  },

  _voirDetail(ref) {
    const ex      = window.EXERCICES?.[ref];
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content || !ex) return;

    const pr = (() => { try { return Tracker.getPR(ref); } catch(e) { return null; } })();

    content.innerHTML = `
      <div style="padding:var(--space-md)">
        <div style="display:flex;align-items:center;gap:var(--space-md);
                    margin-bottom:var(--space-md)">
          <span style="font-size:3rem">${ex.emoji || '💪'}</span>
          <div>
            <div style="font-size:1.1rem;font-weight:800">${ex.nom}</div>
            <div style="font-size:.75rem;color:var(--fd-mint);font-weight:600">
              ${ex.muscle || ''}
            </div>
            ${ex.groupe ? `
              <span class="chip chip-indigo" style="font-size:.6rem;margin-top:4px">
                ${ex.groupe}
              </span>` : ''}
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:var(--space-sm);
                    margin-bottom:var(--space-md)">
          <span style="font-size:.72rem;color:var(--text-muted)">Difficulté :</span>
          <div style="display:flex;gap:4px">
            ${[1,2,3,4,5].map(d => `
              <div style="width:10px;height:10px;border-radius:50%;
                          background:${d <= (ex.difficulte || 1)
                            ? 'var(--fd-lemon)' : 'var(--bg-input)'}">
              </div>`).join('')}
          </div>
        </div>

        ${pr?.rm1 ? `
          <div style="padding:var(--space-sm) var(--space-md);
                      background:rgba(249,239,119,0.08);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-md);margin-bottom:var(--space-md);
                      display:flex;justify-content:space-between;align-items:center">
            <span style="font-size:.78rem;color:var(--fd-lemon)">🏆 Ton PR</span>
            <span style="font-size:.88rem;font-weight:800;color:var(--fd-lemon)">
              ${pr.poids}kg × ${pr.reps} reps
            </span>
          </div>` : ''}

        <div style="font-size:.85rem;color:var(--text-secondary);
                    line-height:1.6;margin-bottom:var(--space-md)">
          ${ex.description || ''}
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:var(--space-md)">
          <span style="font-size:.72rem;color:var(--text-muted)">🔧 Équipement :</span>
          <span style="font-size:.78rem;font-weight:600">${ex.equipement || '—'}</span>
        </div>

        ${ex.muscles_sec?.length ? `
          <div style="margin-bottom:var(--space-md)">
            <div style="font-size:.68rem;color:var(--text-muted);margin-bottom:6px">
              Muscles secondaires
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${ex.muscles_sec.map(m => `
                <span class="chip chip-lavender" style="font-size:.62rem">${m}</span>
              `).join('')}
            </div>
          </div>` : ''}

        ${ex.conseils?.length ? `
          <div style="margin-bottom:var(--space-md)">
            <div style="font-size:.68rem;color:var(--text-muted);font-weight:700;
                        text-transform:uppercase;margin-bottom:6px">💡 Conseils</div>
            ${ex.conseils.map(c => `
              <div style="display:flex;align-items:flex-start;gap:8px;
                          padding:4px 0;font-size:.82rem;color:var(--text-secondary)">
                <span style="color:var(--fd-indigo);flex-shrink:0">•</span>${c}
              </div>`).join('')}
          </div>` : ''}

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          ${ex.youtube ? `
            <button onclick="VideoDemo.ouvrir('${ex.youtube}',
                      '${ex.nom.replace(/'/g,"\\'")}','${ex.muscle || ''}')"
                    style="padding:var(--space-md);background:rgba(255,0,0,0.1);
                           border:1px solid rgba(255,0,0,0.2);
                           border-radius:var(--radius-full);
                           color:#ff4444;font-weight:700;font-size:.82rem;cursor:pointer">
              ▶ Voir démo
            </button>` : '<div></div>'}
          <button onclick="document.getElementById('modal-info').classList.add('hidden')"
                  class="btn-primary" style="font-size:.82rem">
            ✓ Fermer
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  }
};
window.GalerieExercices = GalerieExercices;

// ════════════════════════════════════════════════════════════
// INIT PRINCIPAL
// ════════════════════════════════════════════════════════════
async function init() {
  try {
    console.log('🚀 PowerApp v3.0 — Init...');
    try { i18n.init(); } catch(e) {}

    const profil = Utils.storage.get('ft_profil', null);
    if (!profil?.nom) { _afficherOnboarding(); return; }

    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app-wrapper').style.display   = 'flex';

    try { Tracker.init?.();               } catch(e) {}
    try { Programme.getDateDebut();       } catch(e) {}
    try { Gamification.verifierTrophees();} catch(e) {}
    try { await Notifications.init();     } catch(e) {}
    try { Offline.init();                 } catch(e) {}
    try { Offline.initInstall();          } catch(e) {}

    try {
      const jours = Tracker.getJoursAbsence();
      if (jours >= 7) {
        Utils.storage.set('ft_comeback', true);
        Gamification.verifierTrophees();
      }
    } catch(e) {}

    try {
      if (Programme.isDecharge?.())
        setTimeout(() => Notifications.notifierDecharge(), 5000);
    } catch(e) {}

    try {
      if (Offline.estEnLigne() && Offline._pendingQueue?.length > 0)
        setTimeout(() => Offline.syncPendingQueue(), 4000);
    } catch(e) {}

    naviguer('home');
    _updateHeaderXP();

    try { ThemeManager.init(); } catch(e) {}
    try { SwipeNav.init();     } catch(e) {}
    try { SeanceGuidee.prechargerVoix(); } catch(e) {} 
    try { TimerManager.initAlarme(); } catch(e) {}

    setTimeout(() => {
      try { ThemeManager._injecterBtn(); } catch(e) {}
      try { _updateHeaderXP();           } catch(e) {}
    }, 300);

    navigator.serviceWorker?.addEventListener('message', event => {
      const { type, page } = event.data || {};
      if (type === 'NAVIGATE' && page) { try { naviguer(page); } catch(e) {} }
    });

    console.log('✅ PowerApp v3.0 — Prêt !');

  } catch(e) {
    console.error('[App] Erreur init:', e);
    document.getElementById('splash-screen')?.style.setProperty('display','none');
    document.getElementById('app-wrapper')?.style.setProperty('display','flex');
    naviguer('home');
  }

  try { Sounds.init(); } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// ONBOARDING
// ════════════════════════════════════════════════════════════
function _afficherOnboarding() {
  document.getElementById('splash-screen').style.display = 'none';
  const ob = document.getElementById('onboarding-screen');
  ob.classList.remove('hidden');
  window._obData = { nom:'', poids:null, taille:null, objectif:'forme', niveau:'intermediaire' };
  ob.innerHTML   = _renderEtapeOnboarding(1, window._obData);
}

function _renderEtapeOnboarding(etape, data) {
  const etapes = [
    {
      titre:'Bienvenue sur PowerApp ! 🏋️',
      sousTitre:'Ton coach fitness personnel',
      contenu:`
        <div style="margin-top:var(--space-lg)">
          <div class="input-label">Ton prénom *</div>
          <input class="input mb-md" id="ob-nom"
                 placeholder="ex: Othmane" value="${data.nom || ''}"
                 autocomplete="given-name"/>
          <div class="input-label">Ton poids (kg)</div>
          <input class="input mb-md" id="ob-poids"
                 type="number" placeholder="ex: 80" value="${data.poids || ''}"/>
          <div class="input-label">Ta taille (cm)</div>
          <input class="input" id="ob-taille"
                 type="number" placeholder="ex: 178" value="${data.taille || ''}"/>
        </div>`
    },
    {
      titre:'Ton objectif 🎯',
      sousTitre:'Qu\'est-ce qui te motive ?',
      contenu:`
        <div style="display:grid;gap:var(--space-sm);margin-top:var(--space-lg)">
          ${[
            { val:'prise_masse', label:'💪 Prise de masse' },
            { val:'perte_poids', label:'⬇️ Perte de poids' },
            { val:'seche',       label:'🔥 Sèche'          },
            { val:'force',       label:'🏋️ Force'           },
            { val:'endurance',   label:'🏃 Endurance'       },
            { val:'forme',       label:'✨ Forme générale'  }
          ].map(o => `
            <button onclick="_selectObj('${o.val}',this)"
                    class="btn-secondary ob-obj"
                    style="${data.objectif === o.val
                      ? 'border-color:var(--fd-indigo);background:rgba(75,75,249,.15)' : ''}">
              ${o.label}
            </button>`).join('')}
        </div>`
    },
    {
      titre:'Ton niveau 📊',
      sousTitre:'Pour adapter ton programme',
      contenu:`
        <div style="display:grid;gap:var(--space-sm);margin-top:var(--space-lg)">
          ${[
            { val:'debutant',      label:'🌱 Débutant',      desc:'< 6 mois'       },
            { val:'intermediaire', label:'💪 Intermédiaire', desc:'6 mois — 2 ans' },
            { val:'avance',        label:'🔥 Avancé',        desc:'2 ans +'        }
          ].map(n => `
            <button onclick="_selectNiv('${n.val}',this)"
                    class="btn-secondary ob-niv"
                    style="text-align:left;${data.niveau === n.val
                      ? 'border-color:var(--fd-indigo);background:rgba(75,75,249,.15)' : ''}">
              <div style="font-weight:700">${n.label}</div>
              <div style="font-size:.72rem;color:var(--text-muted)">${n.desc}</div>
            </button>`).join('')}
        </div>`
    },
    {
      titre:'C\'est parti ! 🚀',
      sousTitre:'Ton programme est prêt',
      contenu:`
        <div style="text-align:center;padding:var(--space-xl) 0">
          <div style="font-size:4rem;margin-bottom:var(--space-md)">⚡</div>
          <div style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-sm)">
            Prêt ${data.nom} !
          </div>
          <div style="font-size:.85rem;color:var(--text-muted);line-height:1.6">
            Ton programme personnalisé est configuré.<br>
            Commence ta première séance dès maintenant !
          </div>
        </div>`
    }
  ];

  const e = etapes[etape - 1];
  return `
    <div style="max-width:480px;margin:0 auto;padding:var(--space-lg)">
      <div style="display:flex;justify-content:center;gap:8px;margin-bottom:var(--space-lg)">
        ${[1,2,3,4].map(i => `
          <div style="width:${etape === i ? 24 : 8}px;height:8px;border-radius:4px;
                      background:${etape === i ? 'var(--fd-indigo)' : 'var(--border-color)'};
                      transition:all .3s"></div>`).join('')}
      </div>
      <div style="font-size:1.3rem;font-weight:800;margin-bottom:4px">${e.titre}</div>
      <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:var(--space-md)">
        ${e.sousTitre}
      </div>
      ${e.contenu}
      <div style="margin-top:var(--space-xl)">
        ${etape < 4 ? `
          <button onclick="_suivantOb(${etape})" class="btn-primary"
                  style="width:100%;font-size:.9rem">Suivant →</button>` : `
          <button onclick="_terminerOb()" class="btn-primary"
                  style="width:100%;font-size:.9rem">🚀 Commencer !</button>`}
        ${etape > 1 ? `
          <button onclick="_renderEtapeOb(${etape - 1})" class="btn-secondary mt-sm"
                  style="width:100%;font-size:.85rem">← Retour</button>` : ''}
      </div>
    </div>`;
}

function _selectObj(val, btn) {
  window._obData.objectif = val;
  document.querySelectorAll('.ob-obj').forEach(b => { b.style.borderColor = ''; b.style.background = ''; });
  btn.style.borderColor = 'var(--fd-indigo)';
  btn.style.background  = 'rgba(75,75,249,.15)';
}

function _selectNiv(val, btn) {
  window._obData.niveau = val;
  document.querySelectorAll('.ob-niv').forEach(b => { b.style.borderColor = ''; b.style.background = ''; });
  btn.style.borderColor = 'var(--fd-indigo)';
  btn.style.background  = 'rgba(75,75,249,.15)';
}

function _suivantOb(etapeActuelle) {
  if (etapeActuelle === 1) {
    const nom    = document.getElementById('ob-nom')?.value?.trim();
    const poids  = parseFloat(document.getElementById('ob-poids')?.value);
    const taille = parseFloat(document.getElementById('ob-taille')?.value);
    if (!nom) { Utils.toast('Entre ton prénom !', 'error'); return; }
    window._obData.nom    = nom;
    window._obData.poids  = isNaN(poids)  ? null : poids;
    window._obData.taille = isNaN(taille) ? null : taille;
  }
  const ob = document.getElementById('onboarding-screen');
  ob.innerHTML = _renderEtapeOnboarding(etapeActuelle + 1, window._obData);
}

function _renderEtapeOb(etape) {
  document.getElementById('onboarding-screen').innerHTML =
    _renderEtapeOnboarding(etape, window._obData);
}

function _terminerOb() {
  try {
    const profil = {
      nom:       window._obData.nom     || 'Athlète',
      poids:     window._obData.poids,
      taille:    window._obData.taille,
      objectif:  window._obData.objectif,
      niveau:    window._obData.niveau,
      avatar:    '💪',
      dateDebut: Utils.aujourd_hui()
    };
    Utils.storage.set('ft_profil', profil);
    Programme.setDateDebut(Utils.aujourd_hui());
    Gamification.ajouterXP(200, 'Bienvenue');
    document.getElementById('onboarding-screen').classList.add('hidden');
    document.getElementById('app-wrapper').style.display = 'flex';
    naviguer('home');
    Utils.toast(`Bienvenue ${profil.nom} ! 🎉`, 'success', 4000);
    Utils.confetti(2000);
  } catch(e) {
    console.error('[App] Erreur onboarding:', e);
    window.location.reload();
  }
}

// ════════════════════════════════════════════════════════════
// DÉMARRAGE
// ════════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => { setTimeout(init, 800); });
window.addEventListener('popstate', () => { retourArriere(); });

window.naviguer             = naviguer;
window.retourArriere        = retourArriere;
window.rechercherDepuisHome = rechercherDepuisHome;
window.App                  = App;
window.UI                   = UI;

// ════════════════════════════════════════════════════════════
// MENU GLOBAL
// ════════════════════════════════════════════════════════════
const MenuGlobal = {
  _ouvert: false,

  toggle() { this._ouvert ? this.fermer() : this.ouvrir(); },

  ouvrir() {
    this._ouvert = true;
    const old = document.getElementById('menu-global-panel');
    if (old) old.remove();

    const btn = document.getElementById('btn-menu-global');
    if (btn) btn.textContent = '✕';

    const panel = document.createElement('div');
    panel.id    = 'menu-global-panel';
    panel.style.cssText = `
      position:fixed;top:var(--header-height);left:50%;transform:translateX(-50%);
      width:100%;max-width:480px;
      max-height:calc(100vh - var(--header-height) - var(--nav-height));
      overflow-y:auto;z-index:300;background:var(--bg-app);
      border-bottom:1px solid var(--border-color);
      animation:slideDown .25s ease;padding:12px;scrollbar-width:none;`;

    let profil   = { nom:'Athlète', avatar:'💪' };
    let xp       = { total:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
    let streak   = { count:0 };
    let total    = 0;
    let trophees = 0;

    try { profil   = Tracker.getProfil();    } catch(e) {}
    try { xp       = Gamification.getXP();   } catch(e) {}
    try { streak   = Tracker.getStreak();    } catch(e) {}
    try { total    = Tracker.getTotalSeances(); } catch(e) {}
    try { trophees = Gamification.getTrophees().filter(t => t.debloquee).length; } catch(e) {}

    const items = [
      { page:'mon_profil',   emoji:'✏️', label:'Modifier profil'      },
      { page:'journal',      emoji:'📔', label:'Journal'              },
      { page:'objectifs',    emoji:'🎯', label:'Objectifs'            },
      { page:'blessures',    emoji:'🩹', label:'Blessures'            },
      { page:'coach',        emoji:'🤖', label:'Coach IA'             },
      { page:'defis',        emoji:'🏆', label:'Défis'                },
      { page:'predict',      emoji:'📈', label:'Prédictions'          },
      { page:'gamification', emoji:'⭐', label:'XP & Niveaux'         },
      { page:'history',      emoji:'📅', label:'Historique'           },
      { page:'photos',       emoji:'📸', label:'Photos'               },
      { page:'share',        emoji:'📤', label:'Partage'              },
      { page:'social',       emoji:'📱', label:'Réseaux sociaux'      },
      { page:'supersets',    emoji:'⚡', label:'Supersets'            },
      { page:'circuit',      emoji:'🔄', label:'Circuit Training'     },
      { page:'adaptatif',    emoji:'🧠', label:'Programme Adaptatif'  },
      { page:'galerie',      emoji:'💪', label:'Galerie exercices'    },
      { page:'offline',      emoji:'📵', label:'Hors-ligne'           },
      { page:'settings',     emoji:'⚙️', label:'Paramètres'          }
    ];

    panel.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;
                  cursor:pointer"
           onclick="MenuGlobal.naviguerEt('mon_profil')">
        <div style="width:50px;height:50px;background:rgba(75,75,249,0.2);
                    border:2px solid rgba(75,75,249,0.4);border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:1.6rem;flex-shrink:0">${profil.avatar || '💪'}</div>
        <div style="flex:1">
          <div style="font-size:1rem;font-weight:800;color:white">${profil.nom}</div>
          <div style="font-size:.72rem;color:var(--fd-lavender);margin-top:2px">
            ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center">
          ${[[total,'Séances'],[streak.count,'Streak'],[trophees,'Trophées']].map(([v,l]) => `
            <div>
              <div style="font-size:.9rem;font-weight:800;color:var(--fd-indigo)">${v}</div>
              <div style="font-size:.5rem;color:var(--text-muted);text-transform:uppercase">${l}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:4px">
        ${items.map(item => `
          <div onclick="MenuGlobal.naviguerEt('${item.page}')"
               style="display:flex;align-items:center;gap:14px;padding:13px 16px;
                      background:var(--bg-card);border:1px solid var(--border-color);
                      border-radius:var(--radius-md);cursor:pointer;transition:all .15s"
               onmouseenter="this.style.borderColor='rgba(75,75,249,0.3)';
                             this.style.background='rgba(75,75,249,0.06)'"
               onmouseleave="this.style.borderColor='var(--border-color)';
                             this.style.background='var(--bg-card)'">
            <span style="font-size:1.2rem;flex-shrink:0">${item.emoji}</span>
            <span style="font-size:.9rem;font-weight:600;color:var(--text-primary);flex:1">
              ${item.label}
            </span>
            <span style="color:var(--text-muted);font-size:.85rem">›</span>
          </div>`).join('')}
      </div>

      <div style="margin-top:8px;padding:4px">
        <button onclick="UI.confirmerReset()"
                style="width:100%;padding:12px;background:rgba(255,141,150,0.08);
                       border:1px solid rgba(255,141,150,0.2);border-radius:var(--radius-md);
                       color:var(--fd-coral);font-size:.82rem;font-weight:600;cursor:pointer">
          🗑️ Réinitialiser les données
        </button>
      </div>
      <div style="height:12px"></div>
    `;

    document.body.appendChild(panel);
    setTimeout(() => {
      document.addEventListener('click', this._fermerSidehors.bind(this));
    }, 100);
  },

  fermer() {
    this._ouvert = false;
    const panel  = document.getElementById('menu-global-panel');
    if (panel) {
      panel.style.animation = 'slideUp .2s ease forwards';
      setTimeout(() => panel.remove(), 200);
    }
    const btn = document.getElementById('btn-menu-global');
    if (btn) btn.textContent = '☰';
    document.removeEventListener('click', this._fermerSidehors.bind(this));
  },

  naviguerEt(page) {
    this.fermer();
    setTimeout(() => naviguer(page), 150);
  },

  _fermerSidehors(e) {
    const panel = document.getElementById('menu-global-panel');
    const btn   = document.getElementById('btn-menu-global');
    if (!panel) return;
    if (!panel.contains(e.target) && !btn?.contains(e.target)) this.fermer();
  }
};
window.MenuGlobal = MenuGlobal;

console.log('✅ App.js v3.0 chargé');
