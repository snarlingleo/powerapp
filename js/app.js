/* ============================================================
   PowerApp — App.js v3.0 (NETTOYÉ & STABILISÉ)
   Point d'entrée principal + Navigation + Init + UI
   ============================================================ */

'use strict';

/* ============================
   GLOBAL STATE
============================ */
window._pageActive  = 'home';
window._pageHistory = [];
window._homeSearch  = ''; // recherche Home (sécurisé)

/* ============================
   NAVIGATION
============================ */
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

    const pageEl =
      document.getElementById(`page-${page}`) ||
      document.getElementById('page-home');

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

    // Menu principal volontairement désactivé
    UI.fermerMenu();

  } catch (e) {
    console.error('[App] Erreur navigation:', e);
  }
}

function retourArriere() {
  const prev = window._pageHistory.pop();
  naviguer(prev || 'home');
}

/* ============================
   HEADER
============================ */
function _updateHeader(page) {
  const configs = {
    home:         { emoji:'⚡', titre:'PowerApp' },
    training:     { emoji:'📅', titre:'Programme' },
    live:         { emoji:'💪', titre:'Séance live' },
    stats:        { emoji:'📊', titre:'Statistiques' },
    profil:       { emoji:'👤', titre:'Profil' },
    coach:        { emoji:'🤖', titre:'Coach IA' },
    defis:        { emoji:'🏆', titre:'Défis' },
    predict:      { emoji:'📈', titre:'Prédictions' },
    gamification: { emoji:'⭐', titre:'Niveaux & XP' },
    nutrition:    { emoji:'🥗', titre:'Nutrition' }
  };

  const cfg = configs[page] || configs.home;

  document.getElementById('header-emoji')?.textContent = cfg.emoji;
  document.getElementById('header-title')?.textContent = cfg.titre;

  _updateHeaderXP();
}

function _updateHeaderXP() {
  const el = document.getElementById('header-xp');
  if (!el) return;

  try {
    const xp = Gamification.getXP();
    el.innerHTML = `
      <span style="font-size:.72rem;font-weight:700;color:var(--fd-lemon)">
        ${xp.niveau.emoji} Niv.${xp.niveau.numero}
      </span>
      <span style="font-size:.65rem;color:var(--text-muted);margin-left:4px">
        ${xp.total}XP
      </span>`;
  } catch {}
}

/* ============================
   RENDU DES PAGES
============================ */
function _rendreContenu(page, container, options = {}) {
  try {
    switch (page) {
      case 'home':         _rendreHome(container); break;
      case 'training':     _rendreTraining(container); break;
      case 'live':         _rendreLive(container, options); break;
      case 'stats':        Stats.render(container); break;
      case 'profil':       _rendreProfil(container); break;
      case 'coach':        Coach.renderCoachTab(container); break;
      case 'defis':        Defis.render(container); break;
      case 'predict':      Predict.render(container); break;
      case 'share':        Share.render(container); break;
      case 'gamification': Gamification.renderGamificationTab(container); break;
      case 'history':      History.render(container); break;
      case 'photos':       Photos.render(container); break;
      case 'social':       Social.render(container); break;
      case 'supersets':    Superset.render(container); break;
      case 'offline':      Offline.render(container); break;
      case 'settings':     _rendreSettings(container); break;
      case 'nutrition':
        try { Nutrition.render(container); }
        catch { _rendreNutrition(container); }
        break;
      default:
        _rendreHome(container);
    }
  } catch (e) {
    console.error('[App] Erreur rendu page:', e);
    container.innerHTML = `
      <div class="card mt-md" style="text-align:center;padding:24px">
        <div style="font-size:2rem">⚠️</div>
        <p>Erreur de chargement</p>
        <button onclick="naviguer('home')" class="btn-secondary">
          Retour accueil
        </button>
      </div>`;
  }
}

/* ============================
   HOME
============================ */
function _rendreHome(container) {
  let profil   = { nom:'Athlète', avatar:'💪' };
  let seance   = null;
  let infos    = {};
  let streak   = { count:0 };
  let xp       = { total:0, pourcentage:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' }};
  let analyse  = { seances:0, objectif:4, volume:0, rpe:0 };
  let msg      = { emoji:'💡', message:'Bonne séance !' };
  let defisSem = [];

  try { profil  = Tracker.getProfil(); } catch {}
  try { seance  = Programme.getSeanceduJour(); } catch {}
  try { infos   = Programme.getInfosProgramme(); } catch {}
  try { streak  = Tracker.getStreak(); } catch {}
  try { xp      = Gamification.getXP(); } catch {}
  try { analyse = Coach.getAnalyseSemaine(); } catch {}
  try { msg     = Coach.getMessageDuJour(); } catch {}
  try {
    defisSem = (Defis.mettreAJourProgression() || [])
      .filter(d => !d.complete).slice(0,2);
  } catch {}

  const heure = new Date().getHours();
  const salut = heure < 12 ? 'Bonjour'
               : heure < 18 ? 'Bon après-midi'
               : 'Bonsoir';

  const dateLabel = new Date().toLocaleDateString('fr-FR',{
    weekday:'long', day:'numeric', month:'short'
  });

  container.innerHTML = `
    <!-- GREETING -->
    <div style="padding:8px 0 16px">
      <div style="font-size:.7rem;color:var(--text-muted);font-weight:600">
        ${dateLabel}
      </div>
      <div style="font-size:1.6rem;font-weight:800">
        ${salut}, ${profil.nom} ${profil.avatar}
      </div>
    </div>

    <!-- RECHERCHE -->
    <div style="margin-bottom:14px">
      <input
        type="text"
        placeholder="Rechercher une séance, un exercice…"
        style="width:100%;padding:10px;border-radius:12px"
        oninput="window._homeSearch=this.value">
    </div>

    ${seance ? `
      <div class="card mb-md">
        <div style="font-weight:700">
          ${seance.emoji} ${seance.nom}
        </div>
        <button onclick="naviguer('live')" class="btn-primary mt-sm">
          ▶ Démarrer
        </button>
      </div>` : ''}

    <div id="temps-salle-result"
         style="font-size:.75rem;color:var(--text-muted)">
      Choisis ton temps disponible
    </div>
  `;
}

/* ============================
   LOGIQUE HOME
============================ */
function _choisirTempsSalle(min) {
  const map = {
    30: 'Séance express · Cardio + gainage',
    60: 'Full body équilibré',
    90: 'Haut / Bas du corps',
    120:'Séance complète + étirements'
  };

  const el = document.getElementById('temps-salle-result');
  if (!el || !map[min]) return;

  el.innerHTML = `💡 Recommandation : <strong>${map[min]}</strong>`;
}
/* ============================
   PAGE TRAINING
============================ */
function _rendreTraining(container) {
  let infos    = { semaine:1, cycle:1,
                   phase:{ nom:'Reprise', emoji:'🌱', intensite:.65 } };
  let seances  = [];
  let planning = [];

  try { infos    = Programme.getInfosProgramme(); } catch {}
  try { seances  = Programme.getAllSeances(); } catch {}
  try { planning = Programme.getSeancesSemaine(); } catch {}

  container.innerHTML = `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                color:white;text-align:center">
      <div style="font-size:2rem">${infos.phase.emoji}</div>
      <div style="font-size:1.1rem;font-weight:800">${infos.phase.nom}</div>
      <div style="font-size:.75rem;opacity:.85">
        Semaine ${infos.semaine} · Cycle ${infos.cycle}
      </div>
    </div>

    <div class="section-title">📅 Planning semaine</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
      ${planning.map(jour => `
        <div style="text-align:center;padding:6px;
                    background:${jour.estAujourdhui
                      ? 'var(--fd-indigo)'
                      : jour.seance
                        ? 'rgba(75,75,249,0.2)'
                        : 'var(--bg-input)'};
                    border-radius:8px;
                    cursor:${jour.seance ? 'pointer':'default'}"
             ${jour.seance
               ? `onclick="naviguer('live',{seanceId:'${jour.seance.id}'})"`
               : ''}>
          <div style="font-size:.6rem">${jour.label}</div>
          <div style="font-size:.9rem">
            ${jour.seance ? jour.seance.emoji : jour.estRepos ? '😴' : '·'}
          </div>
        </div>`).join('')}
    </div>

    <div class="section-title mt-md">🏋️ Séances</div>
    ${seances.map(s => _renderCarteSeanceTraining(s)).join('')}
  `;
}

function _renderCarteSeanceTraining(seance) {
  return `
    <div class="card mb-md">
      <div style="font-weight:700">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="font-size:.72rem;color:var(--text-muted)">
        ~${seance.duree_estimee} min · ${seance.exercices?.length||0} exos
      </div>
      <button onclick="naviguer('live',{seanceId:'${seance.id}'})"
              class="btn-primary mt-sm">
        ▶ Start
      </button>
    </div>
  `;
}

/* ============================
   PAGE LIVE
============================ */
function _rendreLive(container, options = {}) {
  const seanceId =
    options.seanceId ||
    Programme.getSeanceduJour()?.id ||
    null;

  if (!seanceId) {
    container.innerHTML = `
      <div class="card text-center">
        <div style="font-size:2rem">😴</div>
        <p>Aucune séance aujourd’hui</p>
        <button onclick="naviguer('training')" class="btn-secondary">
          Voir le programme
        </button>
      </div>`;
    return;
  }

  let seance = null;
  try { seance = Programme.getSeanceComplete(seanceId); } catch {}

  if (!seance) {
    container.innerHTML = `
      <div class="card text-center">
        <p>Séance introuvable</p>
        <button onclick="naviguer('training')" class="btn-secondary">
          Retour
        </button>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="card mb-md">
      <div style="font-size:1.2rem;font-weight:800">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="font-size:.75rem;color:var(--text-muted)">
        ~${seance.duree_estimee} min
      </div>
    </div>
  `;
}

/* ============================
   PAGE PROFIL
============================ */
function _rendreProfil(container) {
  let profil = { nom:'Athlète', avatar:'💪' };
  let xp     = { total:0, niveau:{ emoji:'💪', nom:'Débutant' } };

  try { profil = Tracker.getProfil(); } catch {}
  try { xp     = Gamification.getXP(); } catch {}

  container.innerHTML = `
    <div class="card text-center mb-md"
         style="background:linear-gradient(135deg,var(--fd-indigo),#7b2ff7);
                color:white">
      <div style="font-size:3rem">${profil.avatar}</div>
      <div style="font-size:1.3rem;font-weight:800">${profil.nom}</div>
      <div style="font-size:.8rem;opacity:.85">
        ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
      </div>
    </div>
  `;
}

/* ============================
   UI (menu volontairement désactivé)
============================ */
const UI = {
  toggleMenu() {},
  ouvrirMenu() {},
  fermerMenu() {},
  _handler() {},

  async confirmerReset() {
    const ok = await Utils.confirmer(
      'Réinitialiser ?',
      'Toutes les données seront supprimées.'
    );
    if (!ok) return;
    localStorage.clear();
    location.reload();
  }
};
window.UI = UI;

/* ============================
   INIT
============================ */
async function init() {
  try {
    const profil = Utils.storage.get('ft_profil');
    if (!profil?.nom) {
      _afficherOnboarding();
      return;
    }

    document.getElementById('splash-screen')?.remove();
    document.getElementById('app-wrapper').style.display = 'flex';

    Tracker.init?.();
    Notifications.init?.();
    Offline.init?.();

    naviguer('home');
    ThemeManager.init?.();
    SwipeNav.init?.();

  } catch (e) {
    console.error('[App] Init error:', e);
    naviguer('home');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(init, 500);
});

window.naviguer = naviguer;
window.retourArriere = retourArriere;
window.App = App;

console.log('✅ App.js chargé (version finale)');
