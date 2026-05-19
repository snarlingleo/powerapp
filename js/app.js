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

    const navPages = ['home','training','live','stats','profil'];
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

    // ✅ Fermer le menu à chaque navigation
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
    home:         { emoji:'⚡', titre:'PowerApp'        },
    training:     { emoji:'📅', titre:'Programme'       },
    live:         { emoji:'💪', titre:'Séance live'     },
    stats:        { emoji:'📊', titre:'Statistiques'    },
    profil:       { emoji:'👤', titre:'Profil'          },
    coach:        { emoji:'🤖', titre:'Coach IA'        },
    defis:        { emoji:'🏆', titre:'Défis'           },
    predict:      { emoji:'📈', titre:'Prédictions'     },
    share:        { emoji:'📤', titre:'Partage'         },
    gamification: { emoji:'⭐', titre:'Niveaux & XP'    },
    history:      { emoji:'📅', titre:'Historique'      },
    photos:       { emoji:'📸', titre:'Photos'          },
    social:       { emoji:'📱', titre:'Réseaux'         },
    supersets:    { emoji:'⚡', titre:'Supersets'       },
    offline:      { emoji:'📵', titre:'Hors-ligne'      },
    settings:     { emoji:'⚙️', titre:'Paramètres'      },
    nutrition:    { emoji:'🥗', titre:'Nutrition'       },
    mon_profil:   { emoji:'👤', titre:'Mon profil'      },
    journal:      { emoji:'📔', titre:'Journal'         },
    objectifs:    { emoji:'🎯', titre:'Objectifs'       },
    circuit:      { emoji:'🔄', titre:'Circuit Training' },
    adaptatif:    { emoji:'🧠', titre:'Programme Adaptatif'},
    galerie:      { emoji:'💪', titre:'Galerie exercices' }, 
    blessures:    { emoji:'🩹', titre:'Blessures'       }
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
      <span style="font-size:.65rem;
                   color:var(--text-muted);
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
        catch(e) { _rendrePlaceholder(container, '🔄', 'Circuit Training', 'Module circuit non disponible.'); }
        break;

      case 'adaptatif':
        try { ProgrammeAdaptatif.render(container); }
        catch(e) { _rendrePlaceholder(container, '🧠', 'Programme Adaptatif', 'Analyse ta progression et adapte ton programme.'); }
        break;

      case 'galerie':
        try { GalerieExercices.render(container); }
        catch(e) { _rendrePlaceholder(container, '💪', 'Galerie exercices', 'Tous les exercices disponibles.'); }
        break;     
      case 'mon_profil':   _renderMonProfil(container);                   break;

      case 'journal':
        try { Stats.renderJournal(container); }
        catch(e) {
          _rendrePlaceholder(container, '📔', 'Journal',
            'Ton journal d\'entraînement sera disponible ici.');
        }
        break;

      case 'objectifs':
        try { Stats.renderObjectifs(container); }
        catch(e) {
          _rendrePlaceholder(container, '🎯', 'Objectifs',
            'Définis et suis tes objectifs ici.');
        }
        break;

      case 'blessures':
        try { Stats.renderBlessures(container); }
        catch(e) {
          _rendrePlaceholder(container, '🩹', 'Blessures',
            'Suivi de tes blessures et zones sensibles.');
        }
        break;

      default:
        _rendreHome(container);
    }
  } catch(e) {
    console.error(`[App] Erreur rendu page ${page}:`, e);
    container.innerHTML = `
      <div class="card mt-md"
           style="text-align:center;padding:var(--space-xl)">
        <div style="font-size:2rem">⚠️</div>
        <p style="color:var(--text-muted);margin-top:var(--space-sm)">
          Erreur chargement de la page.<br>
          <button onclick="naviguer('home')"
                  class="btn-secondary mt-md">
            Retour à l'accueil
          </button>
        </p>
      </div>`;
  }
}

function _rendrePlaceholder(container, emoji, titre, desc) {
  container.innerHTML = `
    <div class="card mt-md"
         style="text-align:center;padding:var(--space-xl)">
      <div style="font-size:2.5rem;margin-bottom:var(--space-sm)">
        ${emoji}
      </div>
      <div style="font-size:1.1rem;font-weight:700;
                  margin-bottom:var(--space-sm)">
        ${titre}
      </div>
      <p style="color:var(--text-muted);font-size:.85rem;
                line-height:1.5">
        ${desc}
      </p>
      <button onclick="retourArriere()"
              class="btn-secondary mt-lg">
        ← Retour
      </button>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// PAGE HOME
// ════════════════════════════════════════════════════════════
function _rendreHome(container) {
  let profil   = { nom:'Athlète', avatar:'💪' };
  let seance   = null, prochaine = null;
  let infos    = { label:'S1', cycle:1,
                   phase:{ emoji:'🌱', nom:'Reprise',
                           couleur:'#8bf0bb' } };
  let streak   = { count:0, max:0 };
  let xp       = { total:0, pourcentage:0,
                   niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
  let analyse  = { seances:0, objectif:4, volume:0, rpe:0 };
  let msg      = { emoji:'💡', message:'Bonne séance !' };
  let defisSem = [];

  try { profil    = Tracker.getProfil();                    } catch(e) {}
  try { seance    = Programme.getSeanceduJour();            } catch(e) {}
  try { prochaine = Programme.getProchaineSeance();         } catch(e) {}
  try { infos     = Programme.getInfosProgramme();          } catch(e) {}
  try { streak    = Tracker.getStreak();                    } catch(e) {}
  try { xp        = Gamification.getXP();                  } catch(e) {}
  try { analyse   = Coach.getAnalyseSemaine();              } catch(e) {}
  try { msg       = Coach.getMessageDuJour();               } catch(e) {}
  try {
    defisSem = (Defis.mettreAJourProgression()||[])
      .filter(d => !d.complete).slice(0, 2);
  } catch(e) {}

  const heure = new Date().getHours();
  const salut = heure < 12 ? 'Bonjour' :
                heure < 18 ? 'Bon après-midi' : 'Bonsoir';

  // Jour de la semaine pour nutrition
  const jours  = ['dimanche','lundi','mardi','mercredi',
                  'jeudi','vendredi','samedi'];
  const today  = jours[new Date().getDay()];
  const dateLabel = new Date().toLocaleDateString('fr-FR',{
    weekday:'long', day:'numeric', month:'short'
  });

  container.innerHTML = `

    <!-- ══ GREETING ══ -->
    <div style="padding:8px 0 16px">
      <div style="font-size:.7rem;color:var(--text-muted);
                  font-weight:600;margin-bottom:3px;
                  display:flex;align-items:center;gap:6px">
        <div style="width:5px;height:5px;border-radius:50%;
                    background:var(--fd-mint);
                    box-shadow:0 0 6px var(--fd-mint)"></div>
        ${dateLabel} · ${infos.label} · Cycle ${infos.cycle}
      </div>
      <div style="font-size:1.6rem;font-weight:800;
                  letter-spacing:-.03em;line-height:1.1">
        ${salut},
        <span style="background:linear-gradient(135deg,
                     #ffffff 0%,var(--fd-lavender) 100%);
                     -webkit-background-clip:text;
                     -webkit-text-fill-color:transparent;
                     background-clip:text">
          ${profil.nom}
        </span>
        ${profil.avatar||'💪'}
      </div>
      <div style="font-size:.72rem;color:var(--text-muted);
                  margin-top:4px;display:flex;
                  align-items:center;gap:5px">
        <div style="width:4px;height:4px;border-radius:50%;
                    background:var(--fd-indigo)"></div>
        ${infos.phase.emoji} ${infos.phase.nom} · Prise de masse
      </div>
    </div>

    <!-- ══ STREAK + XP RINGS ══ -->
    <div style="display:grid;grid-template-columns:1fr 1fr;
                gap:10px;margin-bottom:14px">

      <!-- Streak -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:14px;display:flex;
                  align-items:center;gap:12px;
                  position:relative;overflow:hidden;
                  cursor:pointer"
           onclick="naviguer('stats')">
        <div style="position:absolute;top:-15px;right:-15px;
                    width:60px;height:60px;border-radius:50%;
                    background:rgba(249,239,119,0.06)"></div>
        <svg width="48" height="48" viewBox="0 0 48 48" style="flex-shrink:0">
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="rgba(249,239,119,0.12)" stroke-width="4"/>
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="var(--fd-lemon)" stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="126"
                  stroke-dashoffset="${126 - Math.min(126, streak.count * 4)}"
                  transform="rotate(-90 24 24)"
                  style="filter:drop-shadow(0 0 3px var(--fd-lemon))"/>
          <text x="24" y="29" text-anchor="middle"
                fill="var(--fd-lemon)" font-size="13"
                font-weight="800">🔥</text>
        </svg>
        <div>
          <div style="font-size:1.3rem;font-weight:800;
                      color:var(--fd-lemon);line-height:1">
            ${streak.count}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      text-transform:uppercase;
                      letter-spacing:.06em;margin-top:2px">
            Streak
          </div>
          <div style="font-size:.58rem;color:var(--text-muted);
                      margin-top:1px">
            jours consec.
          </div>
        </div>
      </div>

      <!-- XP -->
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:14px;display:flex;
                  align-items:center;gap:12px;
                  position:relative;overflow:hidden;
                  cursor:pointer"
           onclick="naviguer('gamification')">
        <div style="position:absolute;top:-15px;right:-15px;
                    width:60px;height:60px;border-radius:50%;
                    background:rgba(75,75,249,0.08)"></div>
        <svg width="48" height="48" viewBox="0 0 48 48" style="flex-shrink:0">
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="rgba(75,75,249,0.15)" stroke-width="4"/>
          <circle cx="24" cy="24" r="20" fill="none"
                  stroke="var(--fd-indigo)" stroke-width="4"
                  stroke-linecap="round"
                  stroke-dasharray="126"
                  stroke-dashoffset="${126 - Math.min(126,
                    (xp.pourcentage / 100) * 126)}"
                  transform="rotate(-90 24 24)"
                  style="filter:drop-shadow(0 0 3px var(--fd-indigo))"/>
          <text x="24" y="29" text-anchor="middle"
                fill="var(--fd-lavender)" font-size="10"
                font-weight="800">
            N${xp.niveau.numero}
          </text>
        </svg>
        <div>
          <div style="font-size:1.2rem;font-weight:800;
                      color:var(--fd-lavender);line-height:1">
            ${xp.total}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted);
                      text-transform:uppercase;
                      letter-spacing:.06em;margin-top:2px">
            XP total
          </div>
          <div style="font-size:.58rem;color:var(--text-muted);
                      margin-top:1px">
            ${xp.niveau.nom}
          </div>
        </div>
      </div>
    </div>

    <!-- ══ HERO SÉANCE ══ -->
    ${seance ? `
      <div style="border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  position:relative;overflow:hidden;
                  background:linear-gradient(135deg,
                    rgba(75,75,249,0.22) 0%,
                    rgba(75,75,249,0.07) 55%,
                    rgba(191,161,255,0.05) 100%);
                  border:1px solid rgba(75,75,249,0.4);
                  box-shadow:0 4px 24px rgba(75,75,249,0.2)">
        <div style="position:absolute;top:-50px;right:-30px;
                    width:180px;height:180px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2) 0%,transparent 70%);
                    pointer-events:none"></div>
        <div style="display:flex;align-items:center;gap:6px;
                    margin-bottom:10px;position:relative;z-index:1">
          <div style="width:7px;height:7px;border-radius:50%;
                      background:var(--fd-indigo);
                      box-shadow:0 0 8px var(--fd-indigo);
                      animation:pulse 2s infinite"></div>
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;
                      letter-spacing:.12em;
                      color:var(--fd-indigo)">
            Séance du jour
          </div>
        </div>
        <div style="font-size:1.4rem;font-weight:800;
                    letter-spacing:-.02em;margin-bottom:4px;
                    position:relative;z-index:1">
          ${seance.emoji} ${seance.nom}
        </div>
        <div style="font-size:.75rem;color:var(--text-muted);
                    margin-bottom:16px;position:relative;z-index:1">
          ~${seance.duree_estimee}min
          · ${seance.exercices?.length||0} exercices
        </div>
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    position:relative;z-index:1">
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${(seance.muscles||[]).map(m => `
              <span style="padding:4px 10px;border-radius:99px;
                           font-size:.6rem;font-weight:700;
                           text-transform:uppercase;
                           letter-spacing:.04em;
                           background:rgba(75,75,249,0.2);
                           color:var(--fd-lavender);
                           border:1px solid rgba(75,75,249,0.3)">
                ${m}
              </span>`).join('')}
          </div>
          <button onclick="naviguer('live')"
                  style="display:flex;align-items:center;
                         gap:8px;padding:12px 20px;
                         background:var(--fd-indigo);color:white;
                         border:none;border-radius:99px;
                         font-size:.82rem;font-weight:700;
                         cursor:pointer;white-space:nowrap;
                         box-shadow:0 4px 20px rgba(75,75,249,0.5)">
            ▶ Démarrer
          </button>
        </div>
      </div>` : `
      <div style="border-radius:var(--radius-xl);
                  padding:20px;margin-bottom:14px;
                  background:rgba(139,240,187,0.06);
                  border:1px solid rgba(139,240,187,0.2);
                  text-align:center">
        <div style="font-size:2rem;margin-bottom:6px">😴</div>
        <div style="font-weight:700;font-size:1rem">
          Jour de repos
        </div>
        ${prochaine ? `
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-top:4px">
            Prochaine : ${prochaine.emoji} ${prochaine.nom}
            ${prochaine.dansJours > 0
              ? `dans ${prochaine.dansJours}j` : 'demain'}
          </div>` : ''}
      </div>`}

    <!-- ══ EXERCICES DU JOUR ══ -->
    ${seance ? `
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;
                    align-items:center;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:7px">
            <div style="width:3px;height:14px;border-radius:99px;
                        background:var(--fd-indigo)"></div>
            <span style="font-size:.6rem;font-weight:700;
                         text-transform:uppercase;
                         letter-spacing:.1em;
                         color:var(--text-muted)">
              Programme du jour
            </span>
          </div>
          <button onclick="naviguer('live')"
                  style="font-size:.7rem;color:var(--fd-indigo);
                         font-weight:600;background:none;
                         border:none;cursor:pointer">
            Tout voir →
          </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          ${(seance.exercices||[]).slice(0,5).map((ex,i) => {
            const exoData = (window.EXERCICES||{})[ex.ref]||{};
            const pr = (() => {
              try { return Tracker.getPR(ex.ref); } catch(e) { return null; }
            })();
            return `
              <div onclick="naviguer('live')"
                   style="display:flex;align-items:center;
                          gap:10px;padding:10px 12px;
                          background:var(--bg-input);
                          border-radius:var(--radius-sm);
                          border:1px solid var(--border-color);
                          cursor:pointer">
                <div style="width:36px;height:36px;
                            border-radius:10px;flex-shrink:0;
                            background:rgba(75,75,249,0.12);
                            border:1px solid rgba(75,75,249,0.2);
                            display:flex;align-items:center;
                            justify-content:center;font-size:1rem">
                  ${exoData.emoji||'💪'}
                </div>
                <div style="flex:1">
                  <div style="font-size:.82rem;font-weight:700">
                    ${exoData.nom||ex.ref}
                  </div>
                  <div style="font-size:.62rem;
                              color:var(--text-muted);margin-top:1px">
                    ${exoData.muscle||''}
                    ${pr ? `· <span style="color:var(--fd-lemon)">
                      PR ${pr.poids}kg</span>` : ''}
                  </div>
                </div>
                <div style="text-align:right;flex-shrink:0">
                  <div style="font-size:.78rem;font-weight:700;
                              color:var(--fd-indigo)">
                    ${ex.series}×${ex.reps}
                  </div>
                  <div style="font-size:.6rem;color:var(--text-muted)">
                    ⏱ ${ex.repos||75}s
                  </div>
                </div>
              </div>`;
          }).join('')}
          ${(seance.exercices||[]).length > 5 ? `
            <div style="text-align:center;font-size:.7rem;
                        color:var(--text-muted);padding:4px">
              +${(seance.exercices||[]).length - 5} exercices
            </div>` : ''}
        </div>
      </div>` : ''}

    <!-- ══ TIMERS REPOS ══ -->
    <div style="font-size:.58rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.1em;
                color:var(--text-muted);
                margin:14px 0 8px;
                display:flex;align-items:center;gap:8px">
      ⏱ Timers repos
      <div style="flex:1;height:1px;
                  background:var(--border-color)"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);
                gap:7px;margin-bottom:14px">
      ${[
        {icon:'⚡', val:'45s',  label:'Express', sec:45  },
        {icon:'💪', val:'60s',  label:'Normal',  sec:60  },
        {icon:'🏋️', val:'90s',  label:'Force',   sec:90  },
        {icon:'🔥', val:'2min', label:'Lourd',   sec:120 }
      ].map(t => `
        <div onclick="TimerManager.demarrerRepos(${t.sec})"
             style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-md);
                    padding:12px 6px;text-align:center;
                    cursor:pointer;transition:all .2s"
             onmousedown="this.style.transform='scale(.94)';
                          this.style.borderColor=
                          'rgba(75,75,249,0.4)'"
             onmouseup="this.style.transform='';
                        this.style.borderColor=
                        'rgba(255,255,255,0.08)'">
          <div style="font-size:1.2rem;margin-bottom:4px">
            ${t.icon}
          </div>
          <div style="font-size:.78rem;font-weight:800;
                      color:var(--fd-indigo)">
            ${t.val}
          </div>
          <div style="font-size:.55rem;color:var(--text-muted);
                      text-transform:uppercase;
                      letter-spacing:.04em;margin-top:1px">
            ${t.label}
          </div>
        </div>`).join('')}
    </div>

    <!-- ══ NUTRITION ══ -->
    <div style="font-size:.58rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.1em;
                color:var(--text-muted);
                margin:14px 0 8px;
                display:flex;align-items:center;gap:8px">
      🥗 Nutrition du jour
      <div style="flex:1;height:1px;
                  background:var(--border-color)"></div>
    </div>

    <div style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(139,240,187,0.2);
                border-radius:var(--radius-lg);
                padding:16px;margin-bottom:12px;
                position:relative;overflow:hidden">
      <div style="position:absolute;bottom:-30px;right:-30px;
                  width:100px;height:100px;
                  background:radial-gradient(circle,
                    rgba(139,240,187,0.08) 0%,transparent 70%);
                  pointer-events:none"></div>

      <!-- Macros objectifs -->
      <div style="display:flex;justify-content:space-between;
                  align-items:center;margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:7px">
          <div style="width:3px;height:14px;border-radius:99px;
                      background:var(--fd-mint)"></div>
          <span style="font-size:.6rem;font-weight:700;
                       text-transform:uppercase;
                       letter-spacing:.1em;
                       color:var(--text-muted)">
            Objectifs du jour
          </span>
        </div>
        <button onclick="naviguer('nutrition')"
                style="font-size:.7rem;color:var(--fd-mint);
                       font-weight:600;background:none;
                       border:none;cursor:pointer">
          Détails →
        </button>
      </div>

      <div style="display:grid;
                  grid-template-columns:repeat(3,1fr);
                  gap:8px;margin-bottom:14px">
        ${(() => {
          let obj = { proteines:176, calories:3100, eau:2.8 };
          try {
            const p = Tracker.getProfil();
            obj.proteines = Math.round((p.poids||80) * 2.2);
            obj.calories  = Math.round((p.poids||80) * 38);
            obj.eau       = Math.round((p.poids||80) * 0.035 * 10) / 10;
          } catch(e) {}
          return [
            { label:'Protéines', val:obj.proteines+'g',
              color:'var(--fd-coral)' },
            { label:'Calories',  val:obj.calories,
              color:'var(--fd-lemon)' },
            { label:'Eau',       val:obj.eau+'L',
              color:'var(--fd-indigo)' }
          ].map(m => `
            <div style="text-align:center;padding:10px 6px;
                        background:var(--bg-input);
                        border-radius:var(--radius-sm);
                        border:1px solid var(--border-color)">
              <div style="font-size:.95rem;font-weight:800;
                          color:${m.color};line-height:1">
                ${m.val}
              </div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          margin-top:3px;text-transform:uppercase;
                          letter-spacing:.04em">
                ${m.label}
              </div>
            </div>`).join('');
        })()}
      </div>

      <!-- Repas du jour -->
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;
                  color:var(--text-muted);margin-bottom:8px">
        Repas conseillés
      </div>
      <div style="display:flex;flex-direction:column;gap:6px">
        ${[
          { t:'07:30', n:'Oatmeal Protéiné',
            m:'P:42g · G:65g', cal:520, e:'🥣' },
          { t:'10:30', n:'Pré-séance Banane + Oats',
            m:'P:22g · G:65g', cal:380, e:'⚡' },
          { t:'13:30', n:'Bowl Poulet · Riz · Brocoli',
            m:'P:58g · G:80g', cal:680, e:'🥗' },
          { t:'16:30', n:'Fromage blanc & Fruits',
            m:'P:28g · G:30g', cal:280, e:'🍓' },
          { t:'19:30', n:'Saumon · Patate douce',
            m:'P:48g · G:60g', cal:620, e:'🐟' }
        ].map(r => `
          <div onclick="naviguer('nutrition')"
               style="display:flex;align-items:center;
                      gap:10px;padding:9px 12px;
                      background:var(--bg-input);
                      border-radius:var(--radius-sm);
                      border:1px solid var(--border-color);
                      cursor:pointer">
            <div style="font-size:.6rem;font-weight:700;
                        color:var(--fd-mint);width:40px;
                        flex-shrink:0;text-align:center;
                        padding:2px 0;
                        background:rgba(139,240,187,0.08);
                        border-radius:5px">
              ${r.t}
            </div>
            <div style="font-size:.88rem;flex-shrink:0">${r.e}</div>
            <div style="flex:1">
              <div style="font-size:.78rem;font-weight:600">
                ${r.n}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${r.m}
              </div>
            </div>
            <div style="font-size:.72rem;font-weight:700;
                        color:var(--fd-lemon);flex-shrink:0">
              ${r.cal}kcal
            </div>
          </div>`).join('')}
      </div>

      <!-- Eau rapide -->
      <div style="display:flex;align-items:center;gap:8px;
                  margin-top:12px;padding-top:12px;
                  border-top:1px solid var(--border-color)">
        <div style="font-size:.72rem;color:var(--text-muted);flex:1">
          💧 Ajouter de l'eau
        </div>
        <div style="display:flex;gap:5px">
          ${[250,500,750].map(ml => `
            <button onclick="event.stopPropagation();
                            _ajouterEauHome(${ml})"
                    style="padding:5px 9px;font-size:.65rem;
                           font-weight:700;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;
                           color:var(--fd-indigo);cursor:pointer">
              +${ml}ml
            </button>`).join('')}
        </div>
      </div>
    </div>

    <!-- ══ PLANNING SEMAINE ══ -->
    <div style="font-size:.58rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.1em;
                color:var(--text-muted);
                margin:14px 0 8px;
                display:flex;align-items:center;gap:8px">
      📅 Planning semaine
      <div style="flex:1;height:1px;
                  background:var(--border-color)"></div>
    </div>

    <div style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-lg);
                padding:14px 16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;
                  align-items:center;margin-bottom:10px">
        <div style="font-size:.72rem;font-weight:700;
                    color:var(--text-muted)">
          ${analyse.seances}/${analyse.objectif} séances
        </div>
        <div style="font-size:.72rem;font-weight:700;
                    color:var(--fd-mint)">
          ${Math.round((analyse.seances/Math.max(analyse.objectif,1))*100)}%
        </div>
      </div>
      <div style="display:grid;
                  grid-template-columns:repeat(6,1fr);
                  gap:5px">
        ${(()=>{
          const planning = (() => {
            try { return Programme.getSeancesSemaine(); } catch(e) { return []; }
          })();
          if (planning.length) {
            return planning.slice(0,6).map(jour => `
              <div style="display:flex;flex-direction:column;
                          align-items:center;gap:4px">
                <div style="width:32px;height:32px;
                            border-radius:10px;
                            display:flex;align-items:center;
                            justify-content:center;
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
          const todayIdx  = new Date().getDay() === 0 ? 6
                          : new Date().getDay() - 1;
          return jrsLabels.map((l,i) => `
            <div style="display:flex;flex-direction:column;
                        align-items:center;gap:4px">
              <div style="width:32px;height:32px;
                          border-radius:10px;
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.7rem;font-weight:700;
                          ${i === todayIdx
                            ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,0.5)'
                            : i < todayIdx
                              ? 'background:rgba(75,75,249,0.25);border:1px solid var(--fd-indigo);color:var(--fd-lavender)'
                              : 'background:var(--bg-input);border:1px solid var(--border-color);color:var(--text-muted)'}">
                ${i === todayIdx ? '▶' : i < todayIdx ? '✓' : '·'}
              </div>
              <div style="font-size:.52rem;color:var(--text-muted);
                          text-transform:uppercase;font-weight:600">
                ${l}
              </div>
            </div>`).join('');
        })()}
      </div>
      <div class="progress-bar mt-sm">
        <div class="progress-fill"
             style="width:${Math.min(100,
               Math.round((analyse.seances/
                 Math.max(analyse.objectif,1))*100))}%">
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
                    padding:12px 8px;text-align:center">
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

    <!-- ══ COACH DU JOUR ══ -->
    <div onclick="naviguer('coach')"
         style="background:rgba(255,255,255,0.04);
                border:1px solid rgba(255,255,255,0.08);
                border-left:3px solid var(--fd-lavender);
                border-radius:var(--radius-lg);
                padding:14px 16px;margin-bottom:14px;
                cursor:pointer">
      <div style="font-size:.62rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--fd-lavender);margin-bottom:5px">
        ${msg.emoji} Coach du jour
      </div>
      <p style="font-size:.82rem;color:var(--text-secondary);
                line-height:1.55;margin:0">
        ${msg.message}
      </p>
    </div>

    <!-- ══ DÉFIS ══ -->
    ${defisSem.length > 0 ? `
      <div style="font-size:.58rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);
                  margin:0 0 8px;
                  display:flex;align-items:center;gap:8px">
        🏆 Défis en cours
        <div style="flex:1;height:1px;
                    background:var(--border-color)"></div>
      </div>
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:16px;margin-bottom:12px;
                  cursor:pointer"
           onclick="naviguer('defis')">
        ${defisSem.map(d => {
          const pct = Math.round(
            (d.progression / Math.max(d.cible,1)) * 100
          );
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
                            background:linear-gradient(90deg,
                              var(--fd-lemon),var(--fd-mint));
                            border-radius:99px">
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>` : ''}

    <!-- ══ HUMEUR / FATIGUE ══ -->
    ${_renderHumeurFatigue()}

    <div style="height:8px"></div>
  `;

  requestAnimationFrame(() => {
    _attacherHumeurFatigueEvents();
  });
}

// Fonction helper eau depuis accueil
function _ajouterEauHome(ml) {
  try {
    const clé = `ft_nutrition_eau_${Utils.aujourd_hui()}`;
    const actuel = Utils.storage.get(clé, 0);
    const nouveau = Math.min(actuel + ml, 5000);
    Utils.storage.set(clé, nouveau);
    Utils.toast(`💧 +${ml}ml · Total ${(nouveau/1000).toFixed(1)}L`,
      'success', 1500);
    Utils.vibrerSuccess();
  } catch(e) {
    Utils.toast(`💧 +${ml}ml ajouté !`, 'success', 1500);
  }
}

function _renderHumeurFatigue() {
  let humeur  = null, fatigue = null;
  try { humeur  = Tracker.getHumeur();  } catch(e) {}
  try { fatigue = Tracker.getFatigue(); } catch(e) {}

  if (humeur && fatigue) return '';

  // ✅ FIX — ID unique pour attacher les events après render
  return `
    <div class="card mb-md" id="card-humeur-fatigue">
      <div class="card-label">😊 Comment tu te sens ?</div>

      ${!humeur ? `
        <div style="margin-top:var(--space-sm)">
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-bottom:6px">
            Humeur du jour
          </div>
          <div style="display:flex;gap:8px" id="humeur-btns">
            ${['😒','😐','🙂','😊','🔥'].map((h, i) => `
              <button data-humeur="${i}"
                      style="flex:1;padding:8px;font-size:1.2rem;
                             background:var(--bg-input);
                             border:1px solid var(--border-color);
                             border-radius:var(--radius-sm);
                             cursor:pointer;
                             transition:all .2s">
                ${h}
              </button>`).join('')}
          </div>
        </div>` : ''}

      ${!fatigue ? `
        <div style="margin-top:var(--space-sm)">
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-bottom:6px">
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
                      style="flex:1;padding:6px 2px;
                             font-size:.68rem;font-weight:600;
                             background:${f.color}22;
                             color:${f.color};
                             border:1px solid ${f.color}44;
                             border-radius:var(--radius-sm);
                             cursor:pointer">
                ${f.label}
              </button>`).join('')}
          </div>
        </div>` : ''}
    </div>`;
}
function _attacherHumeurFatigueEvents() {
  const humeurs = ['😒', '😐', '🙂', '😊', '🔥'];

  // ✅ Boutons humeur — via data-humeur index
  document.querySelectorAll('[data-humeur]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx    = parseInt(btn.dataset.humeur);
      const humeur = humeurs[idx];
      if (!humeur) return;

      // Feedback visuel
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

          // ✅ Re-render uniquement le bloc humeur/fatigue
          const card = document.getElementById('card-humeur-fatigue');
          if (card) {
            const fatigue = Tracker.getFatigue();
            if (!fatigue) {
              // Garder seulement la section fatigue
              card.querySelector('#humeur-btns')
                ?.closest('div')?.remove();
            } else {
              card.remove();
            }
          }
        } catch(e) {}
      }, 300);
    });
  });

  // ✅ Boutons fatigue — via data-fatigue
  document.querySelectorAll('[data-fatigue]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.fatigue);

      // Feedback visuel
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

          // ✅ Re-render uniquement le bloc humeur/fatigue
          const card = document.getElementById('card-humeur-fatigue');
          if (card) {
            const humeur = Tracker.getHumeur();
            if (!humeur) {
              card.querySelector('#fatigue-btns')
                ?.closest('div')?.remove();
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
  let infos    = { semaine:1, cycle:1,
                   phase:{ nom:'Reprise', emoji:'🌱',
                           couleur:'#8bf0bb', intensite:.65 } };
  let seances  = [];
  let planning = [];

  try { infos    = Programme.getInfosProgramme(); } catch(e) {}
  try { seances  = Programme.getAllSeances();      } catch(e) {}
  try { planning = Programme.getSeancesSemaine(); } catch(e) {}

  container.innerHTML = `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,
                var(--fd-indigo) 0%, #7b2ff7 100%);
                border:none;color:white;text-align:center">
      <div style="font-size:2rem">${infos.phase.emoji}</div>
      <div style="font-size:1.1rem;font-weight:800;margin-top:4px">
        ${infos.phase.nom}
      </div>
      <div style="font-size:.78rem;opacity:.8;margin-top:2px">
        Semaine ${infos.semaine}
        · Cycle ${infos.cycle}
        · ${Math.round((infos.phase.intensite||0)*100)}% intensité
      </div>
      <div style="height:6px;background:rgba(255,255,255,0.2);
                  border-radius:3px;margin-top:var(--space-md);
                  overflow:hidden">
        <div style="height:100%;background:var(--fd-lemon);
                    width:${infos.progression||0}%;
                    border-radius:3px"></div>
      </div>
      <div style="font-size:.65rem;opacity:.6;margin-top:4px">
        ${infos.progression||0}% du cycle
      </div>
    </div>

    <div class="section-title">📅 Planning semaine</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);
                gap:3px;margin-bottom:var(--space-md)">
      ${planning.map(jour => `
        <div style="text-align:center;
                    padding:var(--space-sm) 2px;
                    background:${jour.estAujourdhui
                      ? 'var(--fd-indigo)'
                      : jour.seance
                        ? 'rgba(75,75,249,0.15)'
                        : 'var(--bg-input)'};
                    border-radius:var(--radius-sm);
                    cursor:${jour.seance ? 'pointer':'default'}"
             ${jour.seance
               ? `onclick="naviguer('live',
                   { seanceId:'${jour.seance?.id}' })"`
               : ''}>
          <div style="font-size:.6rem;
                      color:${jour.estAujourdhui
                        ? 'white':'var(--text-muted)'};
                      font-weight:${jour.estAujourdhui
                        ? '700':'400'}">
            ${jour.label}
          </div>
          <div style="font-size:.9rem;margin-top:2px">
            ${jour.seance
              ? jour.seance.emoji
              : jour.estRepos ? '😴' : '·'}
          </div>
        </div>`).join('')}
    </div>

    <div class="section-title">🏋️ Séances</div>
    ${seances.map(s => _renderCarteSeanceTraining(s)).join('')}

    <div class="flex justify-between items-center mt-md mb-sm">
      <div class="section-title" style="margin:0">⚡ Supersets</div>
      <button onclick="naviguer('supersets')"
              style="background:none;border:none;
                     font-size:.72rem;color:var(--fd-indigo);
                     cursor:pointer;font-weight:600">
        Gérer →
      </button>
    </div>
    <div class="card"
         style="text-align:center;padding:var(--space-md)">
      <div style="font-size:1.5rem;margin-bottom:4px">⚡</div>
      <div style="font-size:.82rem;color:var(--text-muted)">
        Configure tes supersets pour maximiser ton efficacité
      </div>
      <button onclick="naviguer('supersets')"
              class="btn-secondary mt-md"
              style="font-size:.82rem">
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
          <div style="font-size:1rem;font-weight:700">
            ${seance.emoji} ${seance.nom}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-top:2px">
            ~${seance.duree_estimee}min
            · ${seance.exercices?.length||0} exercices
            ${supersets.length > 0
              ? `· ${supersets.length} superset${
                  supersets.length>1?'s':''}` : ''}
          </div>
        </div>
        <button onclick="naviguer('live',{ seanceId:'${seance.id}' })"
                class="btn-primary"
                style="font-size:.78rem;
                       padding:var(--space-sm) var(--space-md)">
          ▶ Start
        </button>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:4px">
        ${(seance.muscles||[]).map(m => `
          <span class="chip chip-indigo"
                style="font-size:.62rem">${m}</span>
        `).join('')}
      </div>
      <div style="margin-top:var(--space-sm);font-size:.75rem;
                  color:var(--text-muted)">
        ${(seance.exercices||[]).slice(0,4).map(ex => {
          const exo = (window.EXERCICES||{})[ex.ref]||{};
          return `${exo.emoji||'💪'} ${exo.nom||ex.ref}`;
        }).join(' · ')}
        ${(seance.exercices||[]).length > 4
          ? ` · +${(seance.exercices||[]).length - 4}` : ''}
      </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════
// PAGE LIVE
// ════════════════════════════════════════════════════════════
function _rendreLive(container, options = {}) {
  const seanceId = options.seanceId
    || Programme.getSeanceduJour()?.id
    || null;

  if (!seanceId) {
    container.innerHTML = `
      <div class="card mt-md"
           style="text-align:center;padding:var(--space-xl)">
        <div style="font-size:3rem">😴</div>
        <div style="font-size:1.1rem;font-weight:700;
                    margin-top:var(--space-md)">
          Jour de repos
        </div>
        <p style="color:var(--text-muted);font-size:.88rem;
                  margin-top:var(--space-sm)">
          Aucune séance planifiée aujourd'hui.
        </p>
        <div style="display:flex;flex-wrap:wrap;
                    gap:var(--space-sm);
                    margin-top:var(--space-lg)">
          <button onclick="naviguer('training')"
                  class="btn-secondary"
                  style="flex:1;min-width:140px">
            📅 Voir le programme
          </button>
          <button onclick="naviguer('live',{ seanceId:'full_body' })"
                  class="btn-primary"
                  style="flex:1;min-width:140px">
            ⚡ Séance express
          </button>
        </div>
      </div>`;
    return;
  }

  let seanceComplete = null;
  try {
    seanceComplete = Programme.getSeanceComplete(seanceId);
  } catch(e) {}

  if (!seanceComplete) {
    container.innerHTML = `
      <div class="card mt-md" style="text-align:center">
        <p>Séance introuvable.</p>
        <button onclick="naviguer('training')"
                class="btn-secondary mt-md">← Retour</button>
      </div>`;
    return;
  }

  try {
    const cleStart =
      `ft_seance_start_${Utils.aujourd_hui()}_${seanceId}`;
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
         style="background:linear-gradient(135deg,
                rgba(75,75,249,0.15),
                rgba(139,240,187,0.05));
                border-color:var(--fd-indigo)">
      <div class="flex justify-between items-center">
        <div>
          <div style="font-size:1.2rem;font-weight:800">
            ${seance.emoji} ${seance.nom}
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);
                      margin-top:2px">
            ~${seance.duree_estimee}min
            · ${seance.exercices?.length||0} exos
          </div>
        </div>
        <div style="display:flex;flex-direction:column;
                    align-items:flex-end;gap:6px">
          ${charge ? `
            <div style="text-align:center">
              <div style="font-size:1rem;font-weight:700;
                          color:${charge.recommandation?.couleur||'white'}">
                ${charge.score}/100
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${charge.recommandation?.emoji||'💪'} Forme
              </div>
            </div>` : ''}
          <!-- Chrono affiché après 1ère série -->
          <div id="chrono-container"></div>
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
        <div style="display:flex;align-items:center;
                    gap:var(--space-md);
                    padding:var(--space-sm) 0;
                    border-bottom:1px solid var(--border-color)">
          <div style="width:26px;height:26px;border-radius:50%;
                      background:var(--fd-indigo-dim);
                      display:flex;align-items:center;
                      justify-content:center;
                      font-size:.72rem;font-weight:700;
                      color:var(--fd-indigo);flex-shrink:0">
            ${i+1}
          </div>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">
              ${w.nom}
            </div>
            <div style="font-size:.7rem;color:var(--text-muted)">
              ${w.description}
            </div>
          </div>
          <div style="font-size:.75rem;color:var(--fd-mint);
                      font-weight:600">
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
            ⚡ ${supersets.length} superset${supersets.length>1?'s':''}
          </span>` : ''}
      </div>

      ${exos.map((ex, idx) => {
        const exo        = ex.details || {};
        const pr         = _getPRExo(ex.ref);
        const chargeReco = _getChargeReco(ex.ref);
        const youtubeId  = exo.youtube || null;

        return `
          <div class="live-exo-card"
               id="live-exo-${idx}"
               style="padding:var(--space-md);
                      background:var(--bg-input);
                      border-radius:var(--radius-md);
                      margin-bottom:var(--space-sm);
                      border:1px solid var(--border-color)">

            <!-- Header exercice -->
            <div class="flex justify-between items-center mb-sm">
              <div style="flex:1">
                <div style="font-weight:700;font-size:.95rem">
                  ${exo.emoji||'💪'} ${exo.nom||ex.ref}
                </div>
                <div style="font-size:.68rem;color:var(--fd-mint)">
                  ${exo.muscle||''}
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                ${pr ? `
                  <div style="font-size:.72rem;color:var(--fd-lemon);
                              font-weight:600">
                    🏆 ${pr.poids}kg×${pr.reps}
                  </div>` : ''}
                ${chargeReco ? `
                  <div style="font-size:.68rem;color:var(--fd-indigo)">
                    💡 ${chargeReco.charge}kg
                    (${chargeReco.pourcentage}%)
                  </div>` : ''}
              </div>
            </div>

            <!-- ✅ Boutons actions -->
            <div style="display:flex;gap:6px;
                        margin-bottom:var(--space-sm);
                        flex-wrap:wrap">
              ${youtubeId ? `
                <button onclick="VideoDemo.ouvrir(
                          '${youtubeId}',
                          '${(exo.nom||ex.ref).replace(/'/g,"\\'")}',
                          '${exo.muscle||''}')"
                        style="display:flex;align-items:center;
                               gap:4px;padding:5px 10px;
                               background:rgba(255,0,0,0.12);
                               border:1px solid rgba(255,0,0,0.25);
                               border-radius:var(--radius-full);
                               font-size:.68rem;font-weight:600;
                               color:#ff4444;cursor:pointer">
                  ▶ Voir démo
                </button>` : ''}
              <button onclick="Calculateur.renderCalculateur(
                        '${ex.ref}', ${idx})"
                      style="display:flex;align-items:center;
                             gap:4px;padding:5px 10px;
                             background:rgba(75,75,249,0.12);
                             border:1px solid rgba(75,75,249,0.25);
                             border-radius:var(--radius-full);
                             font-size:.68rem;font-weight:600;
                             color:var(--fd-indigo);cursor:pointer">
                🧮 Calculateur
              </button>
            </div>

            <!-- Info aide -->
            ${idx === 0 ? `
              <div style="display:flex;align-items:center;gap:8px;
                          padding:8px 10px;margin-bottom:8px;
                          background:rgba(191,161,255,0.08);
                          border:1px solid rgba(191,161,255,0.15);
                          border-radius:var(--radius-sm)">
                <span style="font-size:1rem;flex-shrink:0">💡</span>
                <div style="font-size:.68rem;color:rgba(191,161,255,0.8);
                            line-height:1.5">
                  <strong>KG</strong> = poids soulevé ·
                  <strong>REPS</strong> = nombre de répétitions ·
                  <strong>RPE</strong> = effort /10
                  <span style="opacity:.7">(7 = difficile, 9 = presque max)</span>
                </div>
              </div>` : ''}

            <!-- Séries -->
            ${Array.from({length:ex.series}, (_,s) => `
              <div class="serie-row"
                   id="serie-${idx}-${s}"
                   style="display:grid;
                          grid-template-columns:40px 1fr 1fr 50px auto auto;
                          gap:var(--space-xs);
                          align-items:center;
                          margin-bottom:18px">

                <!-- Numéro -->
                <div style="font-size:.75rem;font-weight:700;
                            color:var(--text-muted);text-align:center">
                  S${s+1}
                </div>

                <!-- Poids -->
                <div style="position:relative">
                  <input type="number" class="input"
                         id="poids-${idx}-${s}"
                         placeholder="${chargeReco?.charge||pr?.poids||'0'}"
                         value="${chargeReco?.charge||pr?.poids||''}"
                         step="2.5"
                         style="padding:6px;font-size:.82rem;
                                text-align:center" />
                  <div style="position:absolute;bottom:-14px;
                              left:0;right:0;text-align:center;
                              font-size:.52rem;color:var(--text-muted);
                              font-weight:600;pointer-events:none">
                    KG
                  </div>
                </div>

                <!-- Reps -->
                <div style="position:relative">
                  <input type="number" class="input"
                         id="reps-${idx}-${s}"
                         placeholder="${ex.reps?.split('-')[0]||10}"
                         style="padding:6px;font-size:.82rem;
                                text-align:center" />
                  <div style="position:absolute;bottom:-14px;
                              left:0;right:0;text-align:center;
                              font-size:.52rem;color:var(--text-muted);
                              font-weight:600;pointer-events:none">
                    REPS
                  </div>
                </div>

                <!-- RPE -->
                <div style="position:relative">
                  <input type="number" class="input"
                         id="rpe-${idx}-${s}"
                         placeholder="7" min="1" max="10"
                         style="padding:6px;font-size:.78rem;
                                text-align:center" />
                  <div style="position:absolute;bottom:-14px;
                              left:0;right:0;text-align:center;
                              font-size:.52rem;color:var(--text-muted);
                              font-weight:600;pointer-events:none">
                    RPE
                  </div>
                </div>

                <!-- Timer -->
                <button onclick="TimerManager.lancerTimerReps(${idx}, ${s})"
                        id="btn-timer-${idx}-${s}"
                        title="Timer repos"
                        style="width:32px;height:32px;
                               border-radius:50%;
                               background:rgba(75,75,249,0.15);
                               border:2px solid var(--fd-indigo);
                               font-size:.8rem;cursor:pointer;
                               display:flex;align-items:center;
                               justify-content:center">
                  ⏱
                </button>

                <!-- Valider -->
                <button onclick="App.validerSerie(
                            '${seanceId}','${ex.ref}',
                            ${idx},${s})"
                        id="btn-serie-${idx}-${s}"
                        style="width:32px;height:32px;
                               border-radius:50%;
                               background:var(--bg-card);
                               border:2px solid var(--border-color);
                               font-size:.9rem;cursor:pointer;
                               display:flex;align-items:center;
                               justify-content:center">
                  ○
                </button>
              </div>
            `).join('')}

            ${exo.conseils?.length ? `
              <details style="margin-top:var(--space-xs)">
                <summary style="font-size:.68rem;
                                color:var(--text-muted);
                                cursor:pointer">
                  💡 Conseils techniques
                </summary>
                <div style="font-size:.72rem;color:var(--text-muted);
                            margin-top:var(--space-xs);
                            padding-left:var(--space-sm)">
                  ${exo.conseils.map(c =>
                    `<div>• ${c}</div>`).join('')}
                </div>
              </details>` : ''}
          </div>`;
      }).join('')}

      <button onclick="App.terminerSeance('${seanceId}')"
              class="btn-primary mt-md"
              style="width:100%;font-size:.9rem;
                     padding:var(--space-md)">
        🏁 Terminer la séance
      </button>

      <button onclick="App.arreterSeance('${seanceId}')"
              class="btn-secondary mt-sm"
              style="width:100%;font-size:.82rem;
                     color:var(--text-muted)">
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
        <div style="display:flex;align-items:center;
                    gap:var(--space-md);
                    padding:var(--space-sm) 0;
                    border-bottom:1px solid var(--border-color)">
          <div style="font-size:1.2rem">${e.gif||'🧘'}</div>
          <div style="flex:1">
            <div style="font-size:.85rem;font-weight:600">
              ${e.nom}
            </div>
          </div>
          <div style="font-size:.78rem;color:var(--fd-mint);
                      font-weight:600">
            ${Utils.formatDuree(e.duree)}
          </div>
        </div>`).join('')}
    </div>`;
}

function _getPRExo(ref) {
  try { return Tracker.getPR(ref); } catch(e) { return null; }
}

function _getChargeReco(ref) {
  try { return Predict.recommanderCharge(ref); }
  catch(e) { return null; }
}

// ════════════════════════════════════════════════════════════
// PAGE PROFIL
// ════════════════════════════════════════════════════════════
function _rendreProfil(container) {
  let profil   = { nom:'Athlète', avatar:'💪',
                   poids:80, taille:175, objectif:'forme' };
  let xp       = { total:0,
                   niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
  let streak   = { count:0, max:0 };
  let total    = 0;
  let trophees = 0;

  try { profil   = Tracker.getProfil();           } catch(e) {}
  try { xp       = Gamification.getXP();          } catch(e) {}
  try { streak   = Tracker.getStreak();           } catch(e) {}
  try { total    = Tracker.getTotalSeances();      } catch(e) {}
  try {
    trophees = Gamification.getTrophees()
      .filter(t => t.debloquee).length;
  } catch(e) {}

  container.innerHTML = `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,
                var(--fd-indigo),#7b2ff7);
                border:none;color:white;text-align:center">
      <div style="font-size:3rem;margin-bottom:4px">
        ${profil.avatar||'💪'}
      </div>
      <div style="font-size:1.3rem;font-weight:800">
        ${profil.nom}
      </div>
      <div style="font-size:.82rem;opacity:.8;margin-top:4px">
        ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
      </div>
      <div class="stats-grid mt-md" style="background:none">
        ${[
          {val:total,        label:'Séances' },
          {val:streak.count, label:'Streak'  },
          {val:trophees,     label:'Trophées'}
        ].map(s => `
          <div>
            <div style="font-size:1.2rem;font-weight:800">
              ${s.val}
            </div>
            <div style="font-size:.65rem;opacity:.7">
              ${s.label}
            </div>
          </div>`).join('')}
      </div>
    </div>

    ${[
      {page:'mon_profil',   emoji:'👤', label:'Mon profil'       },
      {page:'journal',      emoji:'📔', label:'Journal'          },
      {page:'objectifs',    emoji:'🎯', label:'Objectifs'        },
      {page:'blessures',    emoji:'🩹', label:'Blessures'        },
      {page:'coach',        emoji:'🤖', label:'Coach IA'         },
      {page:'defis',        emoji:'🏆', label:'Défis'            },
      {page:'predict',      emoji:'📈', label:'Prédictions'      },
      {page:'share',        emoji:'📤', label:'Partage'          },
      {page:'supersets',    emoji:'⚡', label:'Supersets'        },
      {page:'social',       emoji:'📱', label:'Réseaux sociaux'  },
      {page:'offline',      emoji:'📵', label:'Hors-ligne'       },
      {page:'gamification', emoji:'⭐', label:'XP & Niveaux'     },
      {page:'history',      emoji:'📅', label:'Historique'       },
      {page:'photos',       emoji:'📸', label:'Photos'           },
      {page:'circuit',      emoji:'🔄', label:'Circuit Training'    },
      {page:'adaptatif',    emoji:'🧠', label:'Programme Adaptatif' },
      {page:'nutrition',    emoji:'🥗', label:'Nutrition'           },
      {page:'galerie',      emoji:'💪', label:'Galerie exercices' }, 
      {page:'settings',     emoji:'⚙️', label:'Paramètres'       }
    ].map(s => `
      <div class="card mb-md"
           style="cursor:pointer"
           onclick="naviguer('${s.page}')">
        <div class="flex justify-between items-center">
          <div style="display:flex;align-items:center;
                      gap:var(--space-md)">
            <span style="font-size:1.3rem">${s.emoji}</span>
            <span style="font-weight:600;font-size:.92rem">
              ${s.label}
            </span>
          </div>
          <span style="color:var(--text-muted);font-size:.9rem">
            ›
          </span>
        </div>
      </div>`).join('')}

    <div class="card mb-md"
         style="border-color:rgba(255,141,150,0.3)">
      <button onclick="UI.confirmerReset()"
              style="width:100%;background:none;border:none;
                     color:var(--fd-coral);font-size:.85rem;
                     font-weight:600;cursor:pointer;
                     padding:var(--space-sm)">
        🗑️ Réinitialiser toutes les données
      </button>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// PAGE MON PROFIL
// ════════════════════════════════════════════════════════════
function _renderMonProfil(container) {
  let profil = {
    nom:'', poids:null, taille:null,
    objectif:'forme', niveau:'intermediaire', avatar:'💪'
  };
  try { profil = Tracker.getProfil(); } catch(e) {}

  const objectifs = [
    {val:'prise_masse', label:'💪 Prise de masse'},
    {val:'perte_poids', label:'⬇️ Perte de poids'},
    {val:'seche',       label:'🔥 Sèche'         },
    {val:'force',       label:'🏋️ Force'          },
    {val:'endurance',   label:'🏃 Endurance'      },
    {val:'forme',       label:'✨ Forme générale' }
  ];

  const avatars = ['💪','🏋️','🔥','⚡','🚀','🦁','🐺','👊'];

  container.innerHTML = `
    <div class="card mb-md">
      <div class="card-label">🎭 Avatar</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;
                  margin-top:var(--space-sm)">
        ${avatars.map(a => `
          <button onclick="App._selectAvatar('${a}', this)"
                  class="profil-avatar-btn"
                  style="width:44px;height:44px;font-size:1.5rem;
                         background:${profil.avatar===a
                           ? 'var(--fd-indigo-dim)'
                           : 'var(--bg-input)'};
                         border:2px solid ${profil.avatar===a
                           ? 'var(--fd-indigo)'
                           : 'var(--border-color)'};
                         border-radius:var(--radius-sm);
                         cursor:pointer">
            ${a}
          </button>`).join('')}
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">👤 Informations</div>
      <div class="mt-sm">
        <div class="input-label">Prénom *</div>
        <input class="input mb-md" id="profil-edit-nom"
               value="${profil.nom||''}"
               placeholder="Ton prénom"
               autocomplete="given-name" />
        <div class="input-label">Poids (kg)</div>
        <input class="input mb-md" id="profil-edit-poids"
               type="number" step="0.1"
               value="${profil.poids||''}"
               placeholder="80" />
        <div class="input-label">Taille (cm)</div>
        <input class="input mb-md" id="profil-edit-taille"
               type="number"
               value="${profil.taille||''}"
               placeholder="175" />
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">🎯 Objectif</div>
      <div style="display:grid;gap:var(--space-xs);
                  margin-top:var(--space-sm)">
        ${objectifs.map(o => `
          <button onclick="App._selectObjectifProfil('${o.val}', this)"
                  class="profil-obj-btn btn-secondary"
                  style="${profil.objectif===o.val
                    ? 'border-color:var(--fd-indigo);'
                      + 'background:var(--fd-indigo-dim)'
                    : ''}">
            ${o.label}
          </button>`).join('')}
      </div>
    </div>

    <button onclick="App.sauvegarderProfil()"
            class="btn-primary btn-full mb-md">
      💾 Sauvegarder
    </button>
    <button onclick="retourArriere()"
            class="btn-secondary btn-full">
      ← Retour
    </button>
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
        {cle:'rappelQuotidien', label:'Rappel quotidien'},
        {cle:'absence1j',       label:'Absence 1 jour'  },
        {cle:'streakDanger',    label:'Streak en danger'},
        {cle:'prProche',        label:'PR en vue'       },
        {cle:'semaineParf',     label:'Semaine parfaite'},
        {cle:'finSeance',       label:'Fin de séance'   },
        {cle:'decharge',        label:'Semaine décharge'}
      ].map(n => `
        <div class="score-row">
          <span class="score-row-label"
                style="font-size:.85rem">${n.label}</span>
          <label class="toggle"
                 style="position:relative;display:inline-block;
                        width:44px;height:24px">
            <input type="checkbox"
                   ${config[n.cle] ? 'checked':''}
                   onchange="Notifications.sauvegarderConfig(
                     {'${n.cle}': this.checked})"
                   style="opacity:0;width:0;height:0" />
            <span class="toggle-slider"></span>
          </label>
        </div>`).join('')}
      <button onclick="Notifications.tester()"
              class="btn-secondary mt-md"
              style="width:100%;font-size:.82rem">
        🔔 Tester les notifications
      </button>
    </div>

    <div class="card mb-md">
      <div class="card-label">💾 Données</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:var(--space-sm);margin-top:var(--space-sm)">
        <button onclick="Utils.exporterJSON()"
                class="btn-secondary" style="font-size:.78rem">
          📤 Exporter JSON
        </button>
        <button onclick="Utils.importerJSON()"
                class="btn-secondary" style="font-size:.78rem">
          📥 Importer JSON
        </button>
      </div>
    </div>

    <div class="card mb-md">
      <div class="card-label">🎯 Objectif séances/semaine</div>
      <div style="margin-top:var(--space-md)">
        <div style="display:flex;gap:var(--space-sm);
                    justify-content:center">
          ${[2,3,4,5,6].map(n => {
            const current = Utils.storage.get(
              'ft_objectif_seances_semaine', 4
            );
            return `
              <button onclick="Utils.storage.set(
                        'ft_objectif_seances_semaine',${n});
                        naviguer('settings')"
                      style="width:44px;height:44px;
                             border-radius:50%;
                             font-weight:700;font-size:.9rem;
                             cursor:pointer;
                             background:${current===n
                               ? 'var(--fd-indigo)'
                               : 'var(--bg-input)'};
                             color:${current===n
                               ? 'white':'var(--text-muted)'};
                             border:2px solid ${current===n
                               ? 'var(--fd-indigo)'
                               : 'var(--border-color)'}">
                ${n}
              </button>`;
          }).join('')}
        </div>
      </div>
    </div>

   <div id="alarme-section"></div>
    <div id="offline-content"></div>

    <div style="text-align:center;font-size:.65rem;
                color:var(--text-muted);
                margin-top:var(--space-md)">
      PowerApp v3.0 · Othmane Turbo<br>Build 2026
    </div>
  `;

  try {
    // i18n.renderSelecteur désactivé
    // ✅ Alarme rappel
    TimerManager.renderAlarme(
      document.getElementById('alarme-section')
    );
    Offline.render(
      document.getElementById('offline-content')
    );
  } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// PAGE NUTRITION
// ════════════════════════════════════════════════════════════
function _rendreNutrition(container) {
  let profil = { poids:80 };
  try { profil = Tracker.getProfil(); } catch(e) {}
  const prot = Math.round((profil.poids||80) * 2);
  const cal  = Math.round((profil.poids||80) * 35);
  const eau  = ((profil.poids||80) * 0.035).toFixed(1);

  container.innerHTML = `
    <div class="card mb-md"
         style="text-align:center;border-color:var(--fd-mint)">
      <div style="font-size:2rem">🥗</div>
      <div style="font-weight:700;font-size:1.1rem;
                  margin-top:var(--space-sm)">
        Recommandations nutrition
      </div>
      <div style="font-size:.75rem;color:var(--text-muted);
                  margin-top:4px">
        Basé sur ton profil (${profil.poids||80}kg)
      </div>
    </div>

    ${[
      {emoji:'🥩',label:'Protéines',
       val:`${prot}g/jour`,         color:'var(--fd-coral)'   },
      {emoji:'🔥',label:'Calories',
       val:`~${cal} kcal`,          color:'var(--fd-lemon)'   },
      {emoji:'💧',label:'Eau',
       val:`${eau}L/jour`,          color:'var(--fd-indigo)'  },
      {emoji:'⏰',label:'Repas pré-séance',
       val:'2-3h avant',            color:'var(--fd-mint)'    },
      {emoji:'🥛',label:'Post-séance',
       val:'Protéines+glucides 30min',color:'var(--fd-lavender)'}
    ].map(r => `
      <div class="card mb-md">
        <div class="flex justify-between items-center">
          <div style="display:flex;align-items:center;
                      gap:var(--space-md)">
            <span style="font-size:1.5rem">${r.emoji}</span>
            <div style="font-weight:600;font-size:.88rem">
              ${r.label}
            </div>
          </div>
          <div style="font-size:.92rem;font-weight:800;
                      color:${r.color}">
            ${r.val}
          </div>
        </div>
      </div>`).join('')}

    <div class="card"
         style="text-align:center;padding:var(--space-lg);
                opacity:.6">
      <div style="font-size:1.5rem">🚀</div>
      <div style="font-size:.82rem;color:var(--text-muted);
                  margin-top:var(--space-sm)">
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
      const nom    = document.getElementById('profil-edit-nom')
        ?.value?.trim();
      const poids  = parseFloat(
        document.getElementById('profil-edit-poids')?.value);
      const taille = parseFloat(
        document.getElementById('profil-edit-taille')?.value);

      if (!nom) {
        Utils.toast('Entre ton prénom !', 'error');
        return;
      }

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
    const poids = parseFloat(
      document.getElementById(`poids-${exoIdx}-${serieIdx}`)?.value
    );
    const reps  = parseInt(
      document.getElementById(`reps-${exoIdx}-${serieIdx}`)?.value
    );
    const rpe   = parseFloat(
      document.getElementById(`rpe-${exoIdx}-${serieIdx}`)?.value
    ) || null;

    if (!poids || !reps) {
      Utils.toast('Entre le poids et les reps !', 'error');
      return;
    }

    let result = { isPR:false };
    try {
      result = Tracker.sauvegarderSerie(
        seanceId, exoRef, serieIdx+1, reps, poids, rpe
      );
    } catch(e) {}

    // ✅ Démarrer chrono à la 1ère série validée seulement
    try {
      if (!Chrono._actif) {
        Chrono.reset();
        Chrono.demarrer();
        const nomSeance = (window.SEANCES_BASE||{})[seanceId]?.nom
          || 'Séance en cours';
        ChronoSticky.afficher(nomSeance);
      }
    } catch(e) {}

    // ✅ Démarrer le chrono sticky à la 1ère série validée
    try {
      if (!ChronoSticky._visible) {
        const nomSeance = (window.SEANCES_BASE||{})[seanceId]?.nom
          || 'Séance en cours';
        Chrono.reset?.();
        Chrono.demarrer?.();
        ChronoSticky.afficher(nomSeance);
      }
    } catch(e) {}

    const btn =
      document.getElementById(`btn-serie-${exoIdx}-${serieIdx}`);
    if (btn) {
      btn.textContent       = '✅';
      btn.style.background  = 'var(--fd-mint)';
      btn.style.borderColor = 'var(--fd-mint)';
    }

    // ✅ Timer repos automatique après validation
    try {
      const seanceInfo = (window.SEANCES_BASE||{})[seanceId];
      const exo        = seanceInfo?.exercices?.[exoIdx];
      const reposDuree = exo?.repos || 75;
      TimerManager.demarrerRepos(reposDuree);
    } catch(e) {}

    if (result.isPR) {
      try { timerRepos.jouerSon('pr');               } catch(e) {}
      try { Gamification.recompenser('PR_BATTU');    } catch(e) {}
      try { Notifications.notifierPR(exoRef, poids, reps); } catch(e) {}
      Utils.toast(
        `🏆 Nouveau record ! ${poids}kg × ${reps}`, 'pr', 4000
      );
      Utils.vibrerPR();
    } else {
      Utils.vibrerSuccess();
      Utils.toast('✅ Série validée !', 'success', 1500);
    }

    try { Gamification.recompenser('SERIE_COMPLETE'); } catch(e) {}

    try {
      if (!Offline.estEnLigne()) {
        Offline.ajouterAction('serie_sauvegardee', {
          seanceId, exoRef, poids, reps, rpe,
          date: Utils.aujourd_hui()
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
      const seance = (window.SEANCES_BASE||{})[seanceId];
      const nom    = seance?.nom || 'Séance';

      try { Tracker.terminerSeance(seanceId); } catch(e) {}
      // ✅ Arrêter le chrono sticky
      try { ChronoSticky.masquer(); Chrono.reset?.(); } catch(e) {}

      // ✅ Sauvegarder la durée réelle
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

      try {
        if (Programme.isDecharge?.())
          Notifications.notifierDecharge();
      } catch(e) {}

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

      _afficherResumSeance(seanceId, duree, volume, prs);

    } catch(e) {
      console.error('[App] Erreur terminer séance:', e);
      naviguer('home');
    }
  },

  async arreterSeance(seanceId) {
    const ok = await Utils.confirmer(
      'Arrêter la séance ?',
      'Ta progression sera sauvegardée.'
    );
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
function _afficherResumSeance(seanceId, duree, volume, prs) {
  const modal   = document.getElementById('modal-info');
  const content = document.getElementById('modal-info-content');
  if (!modal || !content) { naviguer('home'); return; }

  const seance = (window.SEANCES_BASE||{})[seanceId]
    || { nom:'Séance', emoji:'💪' };

  content.innerHTML = `
    <div style="text-align:center;padding:var(--space-md)">
      <div style="font-size:3rem;margin-bottom:4px">🏁</div>
      <div style="font-size:1.3rem;font-weight:800;
                  color:var(--fd-mint);
                  margin-bottom:var(--space-sm)">
        Séance terminée !
      </div>
      <div style="font-size:.88rem;color:var(--text-muted);
                  margin-bottom:var(--space-lg)">
        ${seance.emoji} ${seance.nom}
      </div>
      <div class="stats-grid mb-md" style="grid-template-columns:repeat(3,1fr)">
        ${[
          {label:'Volume', val:Utils.formatVolume(volume),
           color:'var(--fd-mint)'  },
          {
           label: 'Durée',
           val: (() => {
             try {
               const sec = TempsSalle.recuperer(seanceId);
               if (sec > 60) return TempsSalle.formaterDuree(sec);
             } catch(e) {}
             return Utils.formatDuree(duree);
           })(),
           color: 'var(--fd-indigo)'
         },
          {label:'Records',val:prs,
           color:'var(--fd-lemon)' }
        ].map(s => `
          <div class="stat-card">
            <span class="stat-value" style="color:${s.color}">
              ${s.val}
            </span>
            <span class="stat-label">${s.label}</span>
          </div>`).join('')}
      </div>
       ${(() => {
        try {
          const sec = TempsSalle.getDureeChronoSecondes() || duree;
          return TempsSalle.renderCorrectionWidget(seanceId, sec);
        } catch(e) { return ''; }
         })()}
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:var(--space-sm)">
        <button onclick="
            document.getElementById('modal-info')
              .classList.add('hidden');
            Social._ouvrirTemplate?.('semaine_story')"
                class="btn-secondary"
                style="font-size:.78rem">
          📱 Partager
        </button>
        <button onclick="
            document.getElementById('modal-info')
              .classList.add('hidden');
            naviguer('home')"
                class="btn-primary"
                style="font-size:.78rem">
          🏠 Accueil
        </button>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  const closeBtn = document.getElementById('modal-info-close');
  if (closeBtn) closeBtn.onclick = () => {
    modal.classList.add('hidden');
    naviguer('home');
  };
}

// ════════════════════════════════════════════════════════════
// UI — Menu dropdown
// ════════════════════════════════════════════════════════════
const UI = {

  // ✅ Fonctions vides — plus de menu
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
// DARK / LIGHT MODE
// ════════════════════════════════════════════════════════════
const ThemeManager = {

  CLE: 'ft_theme',

  getTheme() {
    return Utils.storage.get(this.CLE, 'dark');
  },

  setTheme(theme) {
    Utils.storage.set(this.CLE, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this._updateBtn();
  },

  toggle() {
    const actuel = this.getTheme();
    const nouveau = actuel === 'dark' ? 'light' : 'dark';
    this.setTheme(nouveau);
    Utils.toast(
      nouveau === 'light' ? '☀️ Mode clair activé' : '🌙 Mode sombre activé',
      'success', 1500
    );
  },

  init() {
    const theme = this.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    this._injecterBtn();
  },

  _injecterBtn() {
    // Attendre que le header soit prêt
    const headerRight = document.querySelector('.header-right');
    if (!headerRight) return;

    // Éviter les doublons
    if (document.getElementById('theme-toggle')) return;

    const btn = document.createElement('button');
    btn.id        = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.setAttribute('aria-label', 'Changer de thème');
    btn.innerHTML = `
      <span class="icon-dark">🌙</span>
      <span class="icon-light">☀️</span>
    `;
    btn.onclick = () => ThemeManager.toggle();

    // Insérer avant le dernier élément (XP badge)
    const xp = document.getElementById('header-xp');
    if (xp) {
      headerRight.insertBefore(btn, xp);
    } else {
      headerRight.appendChild(btn);
    }
  },

  _updateBtn() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    // Les classes CSS gèrent l'affichage icône
  }
};

window.ThemeManager = ThemeManager;

// ════════════════════════════════════════════════════════════
// CHRONO STICKY — Bas d'écran pendant séance
// ════════════════════════════════════════════════════════════
const ChronoSticky = {

  _visible:  false,
  _seanceNom: '',
  _interval: null,

  afficher(seanceNom = '') {
    this._seanceNom = seanceNom;
    this._visible   = true;

    // Créer le widget s'il n'existe pas
    let el = document.getElementById('chrono-sticky');
    if (!el) {
      el = document.createElement('div');
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
          <div class="chrono-sticky-display ${enPause ? 'paused' : ''}">
            ${temps}
          </div>
          ${this._seanceNom ? `
            <div class="chrono-sticky-label">
              ${this._seanceNom}
            </div>` : ''}
        </div>
      </div>
      <div class="chrono-sticky-controls">
        <button class="chrono-sticky-btn ${enPause ? 'resume' : 'pause'}"
                onclick="ChronoSticky._togglePause()">
          ${enPause ? '▶ Reprendre' : '⏸ Pause'}
        </button>
      </div>
    `;
  },

  _getTemps() {
    try {
      if (typeof Chrono !== 'undefined' && Chrono._actif) {
        const sec = Chrono.getDureeSecondes();
        return Chrono.formaterDuree(sec);
      }
    } catch(e) {}
    return '00:00:00';
  },

  _togglePause() {
    try {
      if (Chrono?._enPause) {
        Chrono.reprendre?.();
      } else {
        Chrono.pause?.();
      }
      this._render();
    } catch(e) {}
  },

  _lancerUpdate() {
    clearInterval(this._interval);
    this._interval = setInterval(() => {
      if (!this._visible) {
        clearInterval(this._interval);
        return;
      }
      // Update uniquement le display et l'icône
      const disp   = document.querySelector('.chrono-sticky-display');
      const icon   = document.querySelector('.chrono-sticky-icon');
      const btn    = document.querySelector('.chrono-sticky-btn');
      const enPause = Chrono?._enPause || false;

      // ✅ Vérifier que Chrono tourne encore
      if (!Chrono?._actif) return;

      if (disp) {
        // ✅ Utiliser les bonnes méthodes de Chrono
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
// SWIPE NAVIGATION — Gauche/Droite entre onglets
// ════════════════════════════════════════════════════════════
const SwipeNav = {

  _startX:    0,
  _startY:    0,
  _active:    false,
  _pages:     ['home','training','live','stats','profil'],

  init() {
    const main = document.querySelector('.app-main');
    if (!main) return;

    main.addEventListener('touchstart', e => {
      this._startX  = e.touches[0].clientX;
      this._startY  = e.touches[0].clientY;
      this._active  = true;
    }, { passive:true });

    main.addEventListener('touchend', e => {
      if (!this._active) return;
      this._active = false;

      const dx = e.changedTouches[0].clientX - this._startX;
      const dy = e.changedTouches[0].clientY - this._startY;

      // Ignorer si scroll vertical dominant
      if (Math.abs(dy) > Math.abs(dx)) return;
      // Seuil minimum 60px
      if (Math.abs(dx) < 60) return;

      const current = this._pages.indexOf(window._pageActive);
      if (current === -1) return;

      if (dx < 0 && current < this._pages.length - 1) {
        // Swipe gauche → page suivante
        naviguer(this._pages[current + 1]);
      } else if (dx > 0 && current > 0) {
        // Swipe droite → page précédente
        naviguer(this._pages[current - 1]);
      }
    }, { passive:true });
  }
};

window.SwipeNav = SwipeNav;

// ════════════════════════════════════════════════════════════
// TEMPS À LA SALLE — Durée réelle + correction manuelle
// ════════════════════════════════════════════════════════════
const TempsSalle = {

  // Récupérer la durée depuis le chrono
  getDureeChronoSecondes() {
    try {
      return Chrono?._secondes || 0;
    } catch(e) { return 0; }
  },

  // Formater en hh:mm ou mm:ss
  formaterDuree(secondes) {
    const h  = Math.floor(secondes / 3600);
    const m  = Math.floor((secondes % 3600) / 60);
    const s  = secondes % 60;

    if (h > 0) {
      return `${h}h ${String(m).padStart(2,'0')}min`;
    }
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },

  // Formater court pour affichage badge
  formaterCourt(secondes) {
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    if (h > 0) return `${h}h${String(m).padStart(2,'0')}`;
    return `${m}min`;
  },

  // Sauvegarder la durée avec la séance
  sauvegarder(seanceId, secondes) {
    Utils.storage.set(`ft_duree_${seanceId}_${Utils.aujourd_hui()}`, secondes);
  },

  // Récupérer la durée sauvegardée
  recuperer(seanceId, date = null) {
    const d = date || Utils.aujourd_hui();
    return Utils.storage.get(`ft_duree_${seanceId}_${d}`, 0);
  },

  // Render widget correction dans résumé
  renderCorrectionWidget(seanceId, secondesAuto) {
    const minutesAuto = Math.round(secondesAuto / 60);
    return `
      <div class="duration-edit-row">
        <span class="duration-edit-label">
          ✏️ Corriger la durée
        </span>
        <input type="number"
               class="input duration-edit-input"
               id="duree-correction"
               value="${minutesAuto}"
               min="1" max="300"
               placeholder="min" />
        <span style="font-size:.72rem;color:var(--text-muted)">
          min
        </span>
      </div>
    `;
  }
};

window.TempsSalle = TempsSalle;

// ════════════════════════════════════════════════════════════
// GALERIE EXERCICES — Page dédiée
// ════════════════════════════════════════════════════════════
const GalerieExercices = {

  _filtreGroupe:  'tous',
  _filtreSearch:  '',

  render(container) {
    if (!container) return;

    const groupes = [
      { val:'tous',     label:'Tous',       emoji:'💪' },
      { val:'push',     label:'Push',       emoji:'⬆️' },
      { val:'pull',     label:'Pull',       emoji:'⬇️' },
      { val:'jambes',   label:'Jambes',     emoji:'🦵' },
      { val:'abdos',    label:'Abdos',      emoji:'🔥' },
      { val:'cardio',   label:'Cardio',     emoji:'❤️' },
      { val:'fullbody', label:'Full Body',  emoji:'🏋️' }
    ];

    const exos = this._getExosFiltres();

    container.innerHTML = `

      <!-- ═══ HEADER ═══ -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),
                  rgba(139,240,187,0.05))">
        <div style="font-size:1.1rem;font-weight:800;
                    margin-bottom:4px">
          💪 Galerie des exercices
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          ${Object.keys(window.EXERCICES||{}).length} exercices disponibles
        </div>
      </div>

      <!-- ═══ RECHERCHE ═══ -->
      <div class="search-container mb-md">
        <span class="search-icon">🔍</span>
        <input class="input search-input"
               id="galerie-search"
               placeholder="Rechercher un exercice..."
               oninput="GalerieExercices._filtrerSearch(this.value)" />
        ${this._filtreSearch ? `
          <button class="search-clear"
                  onclick="GalerieExercices._filtrerSearch('')">
            ✕
          </button>` : ''}
      </div>

      <!-- ═══ FILTRES GROUPE ═══ -->
      <div class="muscle-filter-row mb-md">
        ${groupes.map(g => `
          <button class="muscle-filter-btn
                         ${this._filtreGroupe === g.val ? 'active' : ''}"
                  onclick="GalerieExercices._filtrerGroupe('${g.val}')">
            ${g.emoji} ${g.label}
          </button>`).join('')}
      </div>

      <!-- ═══ COMPTEUR ═══ -->
      <div style="font-size:.72rem;color:var(--text-muted);
                  margin-bottom:var(--space-sm)">
        ${exos.length} exercice${exos.length > 1 ? 's' : ''}
        ${this._filtreGroupe !== 'tous' ? ` · ${this._filtreGroupe}` : ''}
        ${this._filtreSearch ? ` · "${this._filtreSearch}"` : ''}
      </div>

      <!-- ═══ GRILLE ═══ -->
      ${exos.length === 0 ? `
        <div class="card"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;margin-bottom:8px">🔍</div>
          <div style="color:var(--text-muted);font-size:.85rem">
            Aucun exercice trouvé
          </div>
        </div>` : `
        <div class="exercice-galerie-grid">
          ${exos.map(([ref, ex]) => `
            <div class="exercice-galerie-card"
                 onclick="GalerieExercices._voirDetail('${ref}')">
              <div class="exercice-galerie-emoji">
                ${ex.emoji||'💪'}
              </div>
              <div class="exercice-galerie-nom">
                ${ex.nom}
              </div>
              <div class="exercice-galerie-muscle">
                ${ex.muscle||''}
              </div>
              <div class="exercice-galerie-difficulte">
                ${[1,2,3,4,5].map(d => `
                  <div class="difficulte-dot
                              ${d <= (ex.difficulte||1) ? 'active' : ''}">
                  </div>`).join('')}
              </div>
              ${ex.youtube ? `
                <div style="margin-top:var(--space-xs)">
                  <span style="font-size:.6rem;
                               color:rgba(255,0,0,0.7);
                               font-weight:600">
                    ▶ Démo dispo
                  </span>
                </div>` : ''}
            </div>`).join('')}
        </div>`}
    `;

    // Restaurer la valeur de recherche
    const searchInput = document.getElementById('galerie-search');
    if (searchInput && this._filtreSearch) {
      searchInput.value = this._filtreSearch;
    }
  },

  _getExosFiltres() {
    return Object.entries(window.EXERCICES || {}).filter(([ref, ex]) => {
      const matchGroupe = this._filtreGroupe === 'tous'
        || ex.groupe === this._filtreGroupe;
      const matchSearch = !this._filtreSearch
        || ex.nom.toLowerCase().includes(this._filtreSearch.toLowerCase())
        || (ex.muscle||'').toLowerCase().includes(this._filtreSearch.toLowerCase());
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
    const ex    = window.EXERCICES?.[ref];
    const modal = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content || !ex) return;

    const pr = (() => {
      try { return Tracker.getPR(ref); } catch(e) { return null; }
    })();

    content.innerHTML = `
      <div style="padding:var(--space-md)">

        <!-- Header -->
        <div style="display:flex;align-items:center;
                    gap:var(--space-md);
                    margin-bottom:var(--space-md)">
          <span style="font-size:3rem">${ex.emoji||'💪'}</span>
          <div>
            <div style="font-size:1.1rem;font-weight:800">
              ${ex.nom}
            </div>
            <div style="font-size:.75rem;color:var(--fd-mint);
                        font-weight:600">
              ${ex.muscle||''}
            </div>
            ${ex.groupe ? `
              <span class="chip chip-indigo"
                    style="font-size:.6rem;margin-top:4px">
                ${ex.groupe}
              </span>` : ''}
          </div>
        </div>

        <!-- Difficulté -->
        <div style="display:flex;align-items:center;
                    gap:var(--space-sm);
                    margin-bottom:var(--space-md)">
          <span style="font-size:.72rem;color:var(--text-muted)">
            Difficulté :
          </span>
          <div style="display:flex;gap:4px">
            ${[1,2,3,4,5].map(d => `
              <div style="width:10px;height:10px;
                          border-radius:50%;
                          background:${d <= (ex.difficulte||1)
                            ? 'var(--fd-lemon)'
                            : 'var(--bg-input)'}">
              </div>`).join('')}
          </div>
        </div>

        <!-- PR si disponible -->
        ${pr?.rm1 ? `
          <div style="padding:var(--space-sm) var(--space-md);
                      background:rgba(249,239,119,0.08);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-md);
                      margin-bottom:var(--space-md);
                      display:flex;justify-content:space-between;
                      align-items:center">
            <span style="font-size:.78rem;color:var(--fd-lemon)">
              🏆 Ton PR
            </span>
            <span style="font-size:.88rem;font-weight:800;
                         color:var(--fd-lemon)">
              ${pr.poids}kg × ${pr.reps} reps
            </span>
          </div>` : ''}

        <!-- Description -->
        <div style="font-size:.85rem;color:var(--text-secondary);
                    line-height:1.6;margin-bottom:var(--space-md)">
          ${ex.description||''}
        </div>

        <!-- Équipement -->
        <div style="display:flex;align-items:center;gap:8px;
                    margin-bottom:var(--space-md)">
          <span style="font-size:.72rem;color:var(--text-muted)">
            🔧 Équipement :
          </span>
          <span style="font-size:.78rem;font-weight:600">
            ${ex.equipement||'—'}
          </span>
        </div>

        <!-- Muscles secondaires -->
        ${ex.muscles_sec?.length ? `
          <div style="margin-bottom:var(--space-md)">
            <div style="font-size:.68rem;color:var(--text-muted);
                        margin-bottom:6px">
              Muscles secondaires
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:4px">
              ${ex.muscles_sec.map(m => `
                <span class="chip chip-lavender"
                      style="font-size:.62rem">${m}</span>
              `).join('')}
            </div>
          </div>` : ''}

        <!-- Conseils -->
        ${ex.conseils?.length ? `
          <div style="margin-bottom:var(--space-md)">
            <div style="font-size:.68rem;color:var(--text-muted);
                        font-weight:700;text-transform:uppercase;
                        margin-bottom:6px">
              💡 Conseils
            </div>
            ${ex.conseils.map(c => `
              <div style="display:flex;align-items:flex-start;
                          gap:8px;padding:4px 0;font-size:.82rem;
                          color:var(--text-secondary)">
                <span style="color:var(--fd-indigo);flex-shrink:0">
                  •
                </span>
                ${c}
              </div>`).join('')}
          </div>` : ''}

        <!-- Boutons -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          ${ex.youtube ? `
            <button onclick="VideoDemo.ouvrir(
                      '${ex.youtube}',
                      '${ex.nom.replace(/'/g,"\\'")}',
                      '${ex.muscle||''}')"
                    style="padding:var(--space-md);
                           background:rgba(255,0,0,0.1);
                           border:1px solid rgba(255,0,0,0.2);
                           border-radius:var(--radius-full);
                           color:#ff4444;font-weight:700;
                           font-size:.82rem;cursor:pointer">
              ▶ Voir démo
            </button>` : '<div></div>'}
          <button onclick="document.getElementById(
                    'modal-info').classList.add('hidden')"
                  class="btn-primary"
                  style="font-size:.82rem">
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
    if (!profil?.nom) {
      _afficherOnboarding();
      return;
    }

    document.getElementById('splash-screen').style.display = 'none';
    document.getElementById('app-wrapper').style.display   = 'flex';

    try { Tracker.init?.();          } catch(e) {}
    try { Programme.getDateDebut();  } catch(e) {}
    try { Gamification.verifierTrophees(); } catch(e) {}
    try { await Notifications.init(); } catch(e) {}
    try { Offline.init();            } catch(e) {}
    try { Offline.initInstall();     } catch(e) {}

    try {
      const jours = Tracker.getJoursAbsence();
      if (jours >= 7) {
        Utils.storage.set('ft_comeback', true);
        Gamification.verifierTrophees();
      }
    } catch(e) {}

    try {
      if (Programme.isDecharge?.()) {
        setTimeout(() => Notifications.notifierDecharge(), 5000);
      }
    } catch(e) {}

    try {
      if (Offline.estEnLigne()
          && Offline._pendingQueue?.length > 0) {
        setTimeout(() => Offline.syncPendingQueue(), 4000);
      }
    } catch(e) {}

    naviguer('home');
    _updateHeaderXP();

    // ✅ Modules UI — dans le bon ordre
    try { ThemeManager.init(); } catch(e) {}
    try { SwipeNav.init();     } catch(e) {}
    try { TimerManager.initAlarme(); } catch(e) {} 

    // ✅ Bouton thème après que le DOM soit rendu
    setTimeout(() => {
      try { ThemeManager._injecterBtn(); } catch(e) {}
      try { _updateHeaderXP();           } catch(e) {}
    }, 300);; 

    // ✅ Écouter les messages du Service Worker
    navigator.serviceWorker?.addEventListener('message', event => {
      const { type, page } = event.data || {};
      if (type === 'NAVIGATE' && page) {
        try { naviguer(page); } catch(e) {}
      }
    }); 
    console.log('✅ PowerApp v3.0 — Prêt !');

  } catch(e) {
    console.error('[App] Erreur init:', e);
    document.getElementById('splash-screen')
      ?.style.setProperty('display','none');
    document.getElementById('app-wrapper')
      ?.style.setProperty('display','flex');
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

  window._obData = {
    nom:'', poids:null, taille:null,
    objectif:'forme', niveau:'intermediaire'
  };

  ob.innerHTML = _renderEtapeOnboarding(1, window._obData);
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
                 placeholder="ex: Othmane"
                 value="${data.nom||''}"
                 autocomplete="given-name" />
          <div class="input-label">Ton poids (kg)</div>
          <input class="input mb-md" id="ob-poids"
                 type="number" placeholder="ex: 80"
                 value="${data.poids||''}" />
          <div class="input-label">Ta taille (cm)</div>
          <input class="input" id="ob-taille"
                 type="number" placeholder="ex: 178"
                 value="${data.taille||''}" />
        </div>`
    },
    {
      titre:'Ton objectif 🎯',
      sousTitre:'Qu\'est-ce qui te motive ?',
      contenu:`
        <div style="display:grid;gap:var(--space-sm);
                    margin-top:var(--space-lg)">
          ${[
            {val:'prise_masse', label:'💪 Prise de masse'},
            {val:'perte_poids', label:'⬇️ Perte de poids'},
            {val:'seche',       label:'🔥 Sèche'         },
            {val:'force',       label:'🏋️ Force'          },
            {val:'endurance',   label:'🏃 Endurance'      },
            {val:'forme',       label:'✨ Forme générale' }
          ].map(o => `
            <button onclick="_selectObj('${o.val}', this)"
                    class="btn-secondary ob-obj"
                    style="${data.objectif===o.val
                      ? 'border-color:var(--fd-indigo);'
                        + 'background:rgba(75,75,249,.15)'
                      : ''}">
              ${o.label}
            </button>`).join('')}
        </div>`
    },
    {
      titre:'Ton niveau 📊',
      sousTitre:'Pour adapter ton programme',
      contenu:`
        <div style="display:grid;gap:var(--space-sm);
                    margin-top:var(--space-lg)">
          ${[
            {val:'debutant',
             label:'🌱 Débutant',      desc:'< 6 mois'      },
            {val:'intermediaire',
             label:'💪 Intermédiaire', desc:'6 mois — 2 ans'},
            {val:'avance',
             label:'🔥 Avancé',        desc:'2 ans +'       }
          ].map(n => `
            <button onclick="_selectNiv('${n.val}', this)"
                    class="btn-secondary ob-niv"
                    style="text-align:left;
                           ${data.niveau===n.val
                             ? 'border-color:var(--fd-indigo);'
                               + 'background:rgba(75,75,249,.15)'
                             : ''}">
              <div style="font-weight:700">${n.label}</div>
              <div style="font-size:.72rem;color:var(--text-muted)">
                ${n.desc}
              </div>
            </button>`).join('')}
        </div>`
    },
    {
      titre:'C\'est parti ! 🚀',
      sousTitre:'Ton programme est prêt',
      contenu:`
        <div style="text-align:center;padding:var(--space-xl) 0">
          <div style="font-size:4rem;margin-bottom:var(--space-md)">
            ⚡
          </div>
          <div style="font-size:1.1rem;font-weight:700;
                      margin-bottom:var(--space-sm)">
            Prêt ${data.nom} !
          </div>
          <div style="font-size:.85rem;color:var(--text-muted);
                      line-height:1.6">
            Ton programme personnalisé est configuré.<br>
            Commence ta première séance dès maintenant !
          </div>
        </div>`
    }
  ];

  const e = etapes[etape-1];

  return `
    <div style="max-width:480px;margin:0 auto;
                padding:var(--space-lg)">
      <div style="display:flex;justify-content:center;
                  gap:8px;margin-bottom:var(--space-lg)">
        ${[1,2,3,4].map(i => `
          <div style="width:${etape===i ? 24:8}px;height:8px;
                      border-radius:4px;
                      background:${etape===i
                        ? 'var(--fd-indigo)'
                        : 'var(--border-color)'};
                      transition:all .3s">
          </div>`).join('')}
      </div>

      <div style="font-size:1.3rem;font-weight:800;
                  margin-bottom:4px">${e.titre}</div>
      <div style="font-size:.82rem;color:var(--text-muted);
                  margin-bottom:var(--space-md)">
        ${e.sousTitre}
      </div>

      ${e.contenu}

      <div style="margin-top:var(--space-xl)">
        ${etape < 4 ? `
          <button onclick="_suivantOb(${etape})"
                  class="btn-primary"
                  style="width:100%;font-size:.9rem">
            Suivant →
          </button>` : `
          <button onclick="_terminerOb()"
                  class="btn-primary"
                  style="width:100%;font-size:.9rem">
            🚀 Commencer !
          </button>`}
        ${etape > 1 ? `
          <button onclick="_renderEtapeOb(${etape-1})"
                  class="btn-secondary mt-sm"
                  style="width:100%;font-size:.85rem">
            ← Retour
          </button>` : ''}
      </div>
    </div>`;
}

function _selectObj(val, btn) {
  window._obData.objectif = val;
  document.querySelectorAll('.ob-obj').forEach(b => {
    b.style.borderColor = '';
    b.style.background  = '';
  });
  btn.style.borderColor = 'var(--fd-indigo)';
  btn.style.background  = 'rgba(75,75,249,.15)';
}

function _selectNiv(val, btn) {
  window._obData.niveau = val;
  document.querySelectorAll('.ob-niv').forEach(b => {
    b.style.borderColor = '';
    b.style.background  = '';
  });
  btn.style.borderColor = 'var(--fd-indigo)';
  btn.style.background  = 'rgba(75,75,249,.15)';
}

function _suivantOb(etapeActuelle) {
  if (etapeActuelle === 1) {
    const nom    = document.getElementById('ob-nom')
      ?.value?.trim();
    const poids  = parseFloat(
      document.getElementById('ob-poids')?.value);
    const taille = parseFloat(
      document.getElementById('ob-taille')?.value);
    if (!nom) {
      Utils.toast('Entre ton prénom !', 'error');
      return;
    }
    window._obData.nom    = nom;
    window._obData.poids  = isNaN(poids)  ? null : poids;
    window._obData.taille = isNaN(taille) ? null : taille;
  }
  const ob = document.getElementById('onboarding-screen');
  ob.innerHTML =
    _renderEtapeOnboarding(etapeActuelle + 1, window._obData);
}

function _renderEtapeOb(etape) {
  const ob = document.getElementById('onboarding-screen');
  ob.innerHTML = _renderEtapeOnboarding(etape, window._obData);
}

function _terminerOb() {
  try {
    const profil = {
      nom:       window._obData.nom      || 'Athlète',
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

    document.getElementById('onboarding-screen')
      .classList.add('hidden');
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
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(init, 800);
});

window.addEventListener('popstate', () => {
  retourArriere();
});

window.naviguer      = naviguer;
window.retourArriere = retourArriere;
window.App           = App;
window.UI            = UI;

console.log('✅ App.js v3.0 chargé');
