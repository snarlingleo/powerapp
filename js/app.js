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
// NAVIGATION — Avec transitions premium
// ════════════════════════════════════════════════════════════
function naviguer(page, options = {}) {
  try {

    // ── Animation sortie page précédente ──
    const pagePrecedente = document.querySelector('.page.active');
    if (pagePrecedente && pagePrecedente.id !== `page-${page}`) {
      pagePrecedente.style.animation = 'pageOut .18s ease forwards';
      setTimeout(() => {
        pagePrecedente.classList.remove('active');
        pagePrecedente.style.display   = 'none';
        pagePrecedente.style.animation = '';
      }, 160);
    } else if (!pagePrecedente) {
      document.querySelectorAll('.page').forEach(p => {
  if (p.id !== `page-${page}`) {
    p.style.display = 'none';
    p.classList.remove('active');
  }
});
    }

    // ── Nav Glassmorphism Neon ──
    window._pageActive = page;
    _rendreNavBar();

    const pageEl = document.getElementById(`page-${page}`)
      || document.getElementById('page-home');

    if (!pageEl) {
      console.warn(`[App] Page introuvable: ${page}`);
      return;
    }

    // ── Animation entrée nouvelle page ──
    setTimeout(() => {
      pageEl.style.display   = 'block';
      pageEl.style.animation = 'pageIn .25s ease forwards';
      pageEl.classList.add('active');

      setTimeout(() => {
        pageEl.style.animation = '';
      }, 260);

      // ── Rendu contenu ──
      _rendreContenu(page, pageEl, options);

    setTimeout(() => {
    if (pageEl.innerHTML.trim() === '') {
      console.warn('[App] Container vide, re-render forcé:', page);
      _rendreContenu(page, pageEl, options);
    }
  }, 300);

}, pagePrecedente ? 80 : 0);

    _updateHeader(page);

    pageEl.scrollTop = 0;
    window.scrollTo(0, 0);

    // ── Historique ──
    if (window._pageActive !== page) {
      window._pageHistory.push(window._pageActive);
      if (window._pageHistory.length > 10) {
        window._pageHistory.shift();
      }
    }
    window._pageActive = page;

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
// NAV BAR — Glassmorphism Neon (adapté à .app-nav)
// ════════════════════════════════════════════════════════════
function _rendreNavBar() {
  const nav = document.querySelector('.app-nav');
  if (!nav) return;

  const NEON = {
    home:      { c:'#4b4bf9', bg:'rgba(75,75,249,0.18)',
                 b:'rgba(75,75,249,0.55)',  g:'rgba(75,75,249,0.4)'    },
    training:  { c:'#ff4d6d', bg:'rgba(255,77,109,0.18)',
                 b:'rgba(255,77,109,0.55)', g:'rgba(255,77,109,0.4)'   },
    live:      { c:'#8bf0bb', bg:'rgba(139,240,187,0.15)',
                 b:'rgba(139,240,187,0.5)', g:'rgba(139,240,187,0.35)' },
    stats:     { c:'#f9ef77', bg:'rgba(249,239,119,0.15)',
                 b:'rgba(249,239,119,0.5)', g:'rgba(249,239,119,0.35)' },
    nutrition: { c:'#bfa1ff', bg:'rgba(191,161,255,0.18)',
                 b:'rgba(191,161,255,0.55)',g:'rgba(191,161,255,0.4)'  }
  };

  const ICONS = {
    home: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
           <polyline points="9 22 9 12 15 12 15 22"/>`,
    training: `<rect x="3" y="4" width="18" height="18" rx="2"/>
               <line x1="16" y1="2" x2="16" y2="6"/>
               <line x1="8" y1="2" x2="8" y2="6"/>
               <line x1="3" y1="10" x2="21" y2="10"/>`,
    live: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    stats: `<line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6"  y1="20" x2="6"  y2="14"/>`,
    nutrition: `<path d="M7 21h10"/>
                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"/>
                <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03.5"/>
                <path d="M13 12a4 4 0 0 1-4 4"/>`
  };

  const pages = [
    { id:'home',      label:'Home'  },
    { id:'training',  label:'Prog.' },
    { id:'live',      label:'Live'  },
    { id:'stats',     label:'Stats' },
    { id:'nutrition', label:'Nutri.'}
  ];

  // ✅ Style du conteneur — garde .app-nav mais override le look
  nav.style.cssText = `
    position:fixed;
    bottom:0;
    left:50%;
    transform:translateX(-50%);
    width:100%;
    max-width:480px;
    background:rgba(9,9,45,0.95) !important;
    backdrop-filter:blur(24px) !important;
    -webkit-backdrop-filter:blur(24px) !important;
    border-top:1px solid rgba(255,255,255,0.08) !important;
    display:flex !important;
    justify-content:space-around !important;
    align-items:center !important;
    padding:8px 8px env(safe-area-inset-bottom, 8px) !important;
    z-index:100;
    height:var(--nav-height, 70px);
  `;

  nav.innerHTML = pages.map(p => {
    const actif = window._pageActive === p.id;
    const n     = NEON[p.id] || NEON.home;

    // ✅ Bouton live spécial (plus grand)
    const isLive = p.id === 'live';

    return `
      <button class="nav-btn ${actif ? 'active' : ''}"
              id="nav-${p.id}"
              onclick="naviguer('${p.id}')"
              style="
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:4px;
                background:none;
                border:none;
                cursor:pointer;
                position:relative;
                padding:4px ${isLive ? '12px' : '8px'};
                transition:transform .2s;
                flex:1;
              "
              onmouseenter="this.style.transform='translateY(-2px)'"
              onmouseleave="this.style.transform='translateY(0)'">

        <!-- Icône glass -->
        <div style="
          width:${isLive ? '52px' : '44px'};
          height:${isLive ? '52px' : '44px'};
          border-radius:${isLive ? '16px' : '13px'};
          display:flex;
          align-items:center;
          justify-content:center;
          position:relative;
          overflow:hidden;
          background:${actif ? n.bg : isLive ? 'rgba(139,240,187,0.08)' : 'rgba(255,255,255,0.05)'};
          border:${actif
            ? `1.5px solid ${n.b}`
            : isLive
              ? '1.5px solid rgba(139,240,187,0.25)'
              : '1px solid rgba(255,255,255,0.08)'};
          transition:all .3s cubic-bezier(.34,1.56,.64,1);
          transform:${actif ? 'scale(1.1)' : 'scale(1)'};
          box-shadow:${actif
            ? `0 0 16px ${n.g}, 0 0 32px ${n.g}55, inset 0 1px 0 rgba(255,255,255,.18)`
            : isLive
              ? '0 0 10px rgba(139,240,187,0.15)'
              : 'none'};
          ${actif ? 'animation:neonPulse 2.5s ease-in-out infinite;' : ''}
        ">

          <!-- Shine -->
          <div style="
            position:absolute;top:0;left:0;right:0;
            height:45%;
            background:linear-gradient(180deg,
              rgba(255,255,255,0.14) 0%,
              transparent 100%);
            border-radius:inherit;
            pointer-events:none;
            z-index:2;
          "></div>

          <!-- SVG Icon -->
          <svg viewBox="0 0 24 24" style="
            width:${isLive ? '24px' : '20px'};
            height:${isLive ? '24px' : '20px'};
            stroke:${actif
              ? n.c
              : isLive
                ? 'rgba(139,240,187,0.8)'
                : 'rgba(255,255,255,0.45)'};
            stroke-width:${actif ? '2.2' : '1.8'};
            fill:none;
            stroke-linecap:round;
            stroke-linejoin:round;
            position:relative;
            z-index:1;
            transition:all .3s;
            filter:${actif ? `drop-shadow(0 0 5px ${n.c})` : 'none'};
          ">
            ${ICONS[p.id] || ICONS.home}
          </svg>

          <!-- Badge Live animé -->
          ${isLive && !actif ? `
            <div style="
              position:absolute;top:4px;right:4px;
              width:7px;height:7px;
              border-radius:50%;
              background:var(--fd-mint);
              box-shadow:0 0 6px var(--fd-mint);
              animation:pulseLive 1.5s ease-in-out infinite;
            "></div>` : ''}
        </div>

        <!-- Label -->
        <span style="
          font-size:${isLive ? '.56rem' : '.52rem'};
          font-weight:${actif ? '800' : '600'};
          text-transform:uppercase;
          letter-spacing:.05em;
          color:${actif
            ? 'white'
            : isLive
              ? 'rgba(139,240,187,0.6)'
              : 'rgba(255,255,255,0.3)'};
          transition:color .3s;
          white-space:nowrap;
        ">
          ${p.label}
        </span>

        <!-- Point actif -->
        <div style="
          position:absolute;
          bottom:0px;
          left:50%;
          transform:translateX(-50%);
          width:${actif ? '20px' : '4px'};
          height:2px;
          border-radius:99px;
          background:${n.c};
          box-shadow:0 0 8px ${n.c};
          opacity:${actif ? '1' : '0'};
          transition:all .35s cubic-bezier(.34,1.56,.64,1);
        "></div>

      </button>
    `;
  }).join('');

  // ✅ Injecter le CSS des animations (une seule fois)
  if (!document.getElementById('css-neon-nav')) {
    const style = document.createElement('style');
    style.id = 'css-neon-nav';
    style.textContent = `
      @keyframes neonPulse {
        0%,100% {
          box-shadow:0 0 16px var(--ng,rgba(75,75,249,.4)),
                     0 0 32px var(--ng,rgba(75,75,249,.2)),
                     inset 0 1px 0 rgba(255,255,255,.18);
        }
        50% {
          box-shadow:0 0 24px var(--ng,rgba(75,75,249,.6)),
                     0 0 48px var(--ng,rgba(75,75,249,.3)),
                     inset 0 1px 0 rgba(255,255,255,.25);
        }
      }
      @keyframes pulseLive {
        0%,100% { opacity:1; transform:scale(1); }
        50%      { opacity:.5; transform:scale(1.3); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ════════════════════════════════════════════════════════════
// HEADER — Neon Premium avec couleur dynamique par page
// ════════════════════════════════════════════════════════════
function _updateHeader(page) {
  const configs = {
    home:         { emoji:'⚡', titre:'PowerApp',           color:'#4b4bf9' },
    training:     { emoji:'📅', titre:'Programme',          color:'#ff4d6d' },
    live:         { emoji:'💪', titre:'Séance live',        color:'#8bf0bb' },
    stats:        { emoji:'📊', titre:'Statistiques',       color:'#f9ef77' },
    profil:       { emoji:'👤', titre:'Profil',             color:'#bfa1ff' },
    coach:        { emoji:'🤖', titre:'Coach IA',           color:'#bfa1ff' },
    defis:        { emoji:'🏆', titre:'Défis',              color:'#f9ef77' },
    predict:      { emoji:'📈', titre:'Prédictions',        color:'#8bf0bb' },
    share:        { emoji:'📤', titre:'Partage',            color:'#4b4bf9' },
    gamification: { emoji:'⭐', titre:'Niveaux & XP',       color:'#f9ef77' },
    history:      { emoji:'📅', titre:'Historique',         color:'#4b4bf9' },
    photos:       { emoji:'📸', titre:'Photos',             color:'#ff8d96' },
    social:       { emoji:'📱', titre:'Réseaux',            color:'#bfa1ff' },
    supersets:    { emoji:'⚡', titre:'Supersets',          color:'#8bf0bb' },
    offline:      { emoji:'📵', titre:'Hors-ligne',         color:'#ff8d96' },
    settings:     { emoji:'⚙️', titre:'Paramètres',         color:'#bfa1ff' },
    nutrition:    { emoji:'🥗', titre:'Nutrition',          color:'#8bf0bb' },
    journal:      { emoji:'📔', titre:'Journal',            color:'#f9ef77' },
    objectifs:    { emoji:'🎯', titre:'Objectifs',          color:'#ff4d6d' },
    circuit:      { emoji:'⚡', titre:'HIIT & Cardio',      color:'#f9ef77' },
    adaptatif:    { emoji:'🧠', titre:'Programme Adaptatif',color:'#bfa1ff' },
    galerie:      { emoji:'💪', titre:'Galerie exercices',  color:'#8bf0bb' },
    blessures:    { emoji:'🩹', titre:'Blessures',          color:'#ff8d96' },
    calculateur:  { emoji:'🧮', titre:'Calculateur',        color:'#8bf0bb' },
    export:       { emoji:'📤', titre:'Export',             color:'#4b4bf9' },
    themes:       { emoji:'🎨', titre:'Thèmes',             color:'#bfa1ff' },
    sounds:       { emoji:'🔊', titre:'Sons',               color:'#8bf0bb' }
  };

  const cfg = configs[page] || configs.home;

  // ── Emoji + animation ──
  const emojiEl = document.getElementById('header-emoji');
  if (emojiEl) {
    emojiEl.textContent = cfg.emoji;
    emojiEl.style.cssText = `
      font-size:1.3rem;
      filter:drop-shadow(0 0 8px ${cfg.color});
      animation:headerEmojiPop .4s cubic-bezier(.34,1.56,.64,1);
      display:inline-block;
    `;
  }

  // ── Titre gradient ──
  const titleEl = document.getElementById('header-title');
  if (titleEl) {
    titleEl.textContent = cfg.titre;
    titleEl.style.cssText = `
      font-size:1rem;
      font-weight:800;
      letter-spacing:-.02em;
      background:linear-gradient(135deg,#ffffff 0%,${cfg.color} 100%);
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      background-clip:text;
      transition:all .3s;
    `;
  }

  // ── Header container ──
  const header = document.querySelector('.app-header');
  if (header) {
    header.style.borderBottomColor = cfg.color + '33';
    header.style.boxShadow         = `0 1px 20px ${cfg.color}18`;
    header.style.transition        = 'border-color .4s, box-shadow .4s';
  }

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
      // ════════════════════════════════════════════════════════════
// _rendreContenu() — case 'live' ✅ v4.0
// Remplace le case 'live' complet dans le switch
// ════════════════════════════════════════════════════════════
case 'live': {
  // ✅ FIX v4.0 — Bloc scoped pour éviter
  // le break orphelin
  const seanceEnCours = document.getElementById('live-exo-0');
  const chronoActif   = (typeof Chrono !== 'undefined')
    && Chrono?._actif;

  if (seanceEnCours && chronoActif) {
    container.scrollTop = 0;
    break;
  }

  const skipChecklist = options.skipChecklist
    || Utils.storage.get('ft_skip_checklist', false);

  const seanceIdLive = options.seanceId
    || Programme.getSeanceduJour()?.id;

  if (!skipChecklist && seanceIdLive) {
    _rendreChecklistPreSeance(
      container, options, seanceIdLive
    );
  } else {
    _rendreLive(container, options);
  }
  break;
}
        case 'stats':
  if (typeof Stats !== 'undefined') {
    Stats.render(container);
  } else {
    _rendrePlaceholder(
      container,'📊','Statistiques',
      'Module stats non disponible.'
    );
  }
  break;
      case 'coach':
  try {
    if (typeof Coach === 'undefined') {
      throw new Error('Coach non chargé');
    }
    if (typeof Coach.renderCoachTabV7 === 'function') {
      Coach.renderCoachTabV7(container);
    } else if (typeof Coach.renderCoachTab === 'function') {
      Coach.renderCoachTab(container);
    } else {
      throw new Error('Aucune méthode render');
    }
  } catch(e) {
    console.error('[Coach]', e);
    _rendrePlaceholder(
      container, '🤖', 'Coach IA',
      'Vérifie que coach.js est chargé avant app.js dans index.html'
    );
  }
  break;
      case 'defis':
  try { Defis.render(container); }
  catch(e) { _rendrePlaceholder(container,'🎯','Défis',''); }
  break;
      case 'predict':
  try { Predict.render(container); }
  catch(e) { _rendrePlaceholder(container,'🔮','Prédictions IA',''); }
  break;
      case 'calculateur':
  try { Calculateur.render(container); }
  catch(e) { _rendrePlaceholder(container,'🧮','Calculateur',''); }
  break;    
      case 'share':
  try { Export.render(container); }
  catch(e) { _rendrePlaceholder(container,'📤','Partage','Module export non disponible.'); }
  break;
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
  try { HIIT.render(container); }
  catch(e) {
    try { Circuit.render(container); }
    catch(e2) { _rendrePlaceholder(
      container,'⚡','HIIT & Cardio',
      'Module HIIT non disponible.'
    ); }
  }
  break;
      case 'adaptatif':
  // ✅ Programme IA en priorité
  try { Coach.ProgrammeIA.render(container); }
  catch(e) {
    try { ProgrammeAdaptatif.render(container); }
    catch(e2) { _rendrePlaceholder(
      container,'🧠','Programme Adaptatif',
      'Analyse ta progression.'
    ); }
  }
  break;
      case 'galerie':
        try { GalerieExercices.render(container); }
        catch(e) { _rendrePlaceholder(container,'💪','Galerie exercices','Tous les exercices disponibles.'); }
        break;
      case 'journal':
        try { Stats.renderJournal(container); }
        catch(e) { _rendrePlaceholder(container,'📔','Journal','Ton journal d\'entraînement.'); }
        break;
      case 'objectifs':
        try { Stats.renderObjectifs(container); }
        catch(e) { _rendrePlaceholder(container,'🎯','Objectifs','Définis tes objectifs.'); }
        break;
        // ✅ Cases à ajouter dans _rendreContenu()
case 'themes':
  try { Themes.render(container); }
  catch(e) { _rendrePlaceholder(container,'🎨','Thèmes',''); }
  break;

case 'export':
  try { Export.render(container); }
  catch(e) { _rendrePlaceholder(container,'📤','Export',''); }
  break;

case 'sounds':
  try { Sounds.renderSettings(container); }
  catch(e) { _rendrePlaceholder(container,'🔊','Sons',''); }
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
// ✅ NOUVEAU — avec complétion automatique
function getExercicesSelonTemps(exercices, minutes) {
  if (!Array.isArray(exercices)) return [];

  if (minutes <= 30) return exercices.slice(0, 3);
  if (minutes <= 60) return exercices.slice(0, 5);
  if (minutes <= 90) return exercices.slice(0, 7);

  // ✅ 2h — Compléter avec exercices bonus
  return _completerSeance2h(exercices);
}

// ✅ NOUVEAU — Compléter une séance pour 2h
function _completerSeance2h(exercicesBase) {
  const base = [...exercicesBase];

  // Détecter le type de séance depuis les exercices
  const refs = base.map(e => e.ref);

  // Exercices bonus selon le muscle dominant
  const BONUS = {
    // Pec/Tri → ajouter decline + overhead câble
    pec_tri: [
      { ref:'decline_bench',          series:3, reps:'10',    repos:75 },
      { ref:'cable_fly',              series:3, reps:'12-15', repos:60 },
      { ref:'overhead_triceps_cable', series:3, reps:'12',    repos:60 },
      { ref:'close_grip_bench',       series:3, reps:'10',    repos:75 }
    ],
    // Dos/Bi → ajouter chin-up + spider curl
    dos_bi: [
      { ref:'chin_up',     series:3, reps:'max', repos:90 },
      { ref:'rack_pull',   series:3, reps:'6-8', repos:90 },
      { ref:'spider_curl', series:3, reps:'12',  repos:60 },
      { ref:'incline_curl',series:3, reps:'12',  repos:60 }
    ],
    // Épaules/Bras → ajouter arnold + shrug
    epaules_bras: [
      { ref:'arnold_press',  series:3, reps:'12',    repos:75 },
      { ref:'shrug',         series:3, reps:'15',    repos:60 },
      { ref:'upright_row',   series:3, reps:'12',    repos:60 },
      { ref:'curl_marteau',  series:3, reps:'12',    repos:60 }
    ],
    // Jambes → ajouter hack squat + nordic + kickback
    jambes: [
      { ref:'hack_squat',    series:3, reps:'10-12', repos:90 },
      { ref:'hip_thrust',    series:4, reps:'12',    repos:75 },
      { ref:'nordic_curl',   series:3, reps:'8',     repos:90 },
      { ref:'glute_kickback',series:3, reps:'15/j',  repos:60 }
    ],
    // Full Body → ajouter KB swing + goblet
    full_body: [
      { ref:'kettlebell_swing', series:3, reps:'15',    repos:60 },
      { ref:'goblet_squat',     series:3, reps:'12',    repos:75 },
      { ref:'face_pull',        series:3, reps:'15',    repos:60 },
      { ref:'burpees',          series:3, reps:'10',    repos:75 }
    ]
  };

  // Détecter le type de séance
  let typeSeance = 'full_body';
  if (refs.some(r => ['bench_press','incline_halteres',
    'chest_press_machine','ecarte_poulie'].includes(r))) {
    typeSeance = 'pec_tri';
  } else if (refs.some(r => ['tractions','rowing_barre',
    'lat_pulldown','soulevé_terre'].includes(r))) {
    typeSeance = 'dos_bi';
  } else if (refs.some(r => ['dev_militaire','elev_laterales',
    'shoulder_press_machine'].includes(r))) {
    typeSeance = 'epaules_bras';
  } else if (refs.some(r => ['squat','presse_cuisses',
    'fentes','leg_curl'].includes(r))) {
    typeSeance = 'jambes';
  }

  // Ajouter les exercices bonus non déjà présents
  const bonus = BONUS[typeSeance] || BONUS.full_body;
  bonus.forEach(ex => {
    if (!refs.includes(ex.ref)) {
      base.push(ex);
      refs.push(ex.ref);
    }
  });

  return base; // ~9-10 exercices pour 2h
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
   { mots:['profil','modifier','avatar'], page:'profil' },
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
    { mots:['partage','share','export','exporter'],                page:'export' },
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
// WIDGETS HOME — Système de personnalisation
// ════════════════════════════════════════════════════════════
const WidgetsHome = {

  CLE: 'ft_widgets_config',

  // ✅ Tous les widgets disponibles
  WIDGETS_DISPONIBLES: [
    {
      id:      'greeting',
      label:   'Salutation',
      emoji:   '👋',
      desc:    'Bonjour + date + phase',
      actif:   true,
      bloqué:  true   // Toujours visible
    },
    {
      id:      'search',
      label:   'Barre de recherche',
      emoji:   '🔍',
      desc:    'Recherche rapide dans l\'app',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'streak_xp',
      label:   'Streak & XP',
      emoji:   '🔥',
      desc:    'Anneaux streak et XP',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'seance_hero',
      label:   'Séance du jour',
      emoji:   '💪',
      desc:    'Carte principale séance',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'temps_salle',
      label:   'Temps à la salle',
      emoji:   '⏱',
      desc:    'Sélecteur durée + exercices adaptés',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'progression_live',
      label:   'Progression en cours',
      emoji:   '📊',
      desc:    'Barre progression séance actuelle',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'timers_repos',
      label:   'Timers repos',
      emoji:   '⏱',
      desc:    '4 boutons timer rapide',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'planning_semaine',
      label:   'Planning semaine',
      emoji:   '📅',
      desc:    'Grille 6 jours + barre progression',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'stats_semaine',
      label:   'Stats semaine',
      emoji:   '📈',
      desc:    'Séances / Volume / RPE',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'coach_jour',
      label:   'Coach du jour',
      emoji:   '🤖',
      desc:    'Message motivant du coach IA',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'defis',
      label:   'Défis en cours',
      emoji:   '🏆',
      desc:    'Défis hebdomadaires',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'humeur_fatigue',
      label:   'Humeur & Fatigue',
      emoji:   '😊',
      desc:    'Check-in quotidien',
      actif:   true,
      bloqué:  false
    },
    {
      id:      'nutrition_rapide',
      label:   'Nutrition rapide',
      emoji:   '🥗',
      desc:    'Macros du jour + eau',
      actif:   false,
      bloqué:  false
    },
    {
      id:      'pr_du_jour',
      label:   'PRs récents',
      emoji:   '🏅',
      desc:    'Tes derniers records',
      actif:   false,
      bloqué:  false
    },
    {
      id:      'meteo_sport',
      label:   'Météo motivation',
      emoji:   '🌤',
      desc:    'Score de forme + conseil',
      actif:   false,
      bloqué:  false
    }
  ],

  // ✅ Récupérer config
  getConfig() {
    const saved = Utils.storage.get(this.CLE, null);
    if (!saved) return [...this.WIDGETS_DISPONIBLES];

    // Merge avec nouveaux widgets
    const ids = saved.map(w => w.id);
    const nouveaux = this.WIDGETS_DISPONIBLES
      .filter(w => !ids.includes(w.id));

    return [...saved, ...nouveaux];
  },

  // ✅ Sauvegarder config
  sauvegarderConfig(config) {
    Utils.storage.set(this.CLE, config);
  },

  // ✅ Toggle un widget
  toggleWidget(id) {
    const config = this.getConfig();
    const widget = config.find(w => w.id === id);
    if (!widget || widget.bloqué) return;
    widget.actif = !widget.actif;
    this.sauvegarderConfig(config);
    return widget.actif;
  },

  // ✅ Déplacer un widget (haut/bas)
  deplacerWidget(id, direction) {
    const config = this.getConfig();
    const idx    = config.findIndex(w => w.id === id);
    if (idx === -1) return;

    const newIdx = direction === 'up'
      ? Math.max(0, idx - 1)
      : Math.min(config.length - 1, idx + 1);

    if (newIdx === idx) return;

    const item = config.splice(idx, 1)[0];
    config.splice(newIdx, 0, item);
    this.sauvegarderConfig(config);
  },

  // ✅ Reset par défaut
  reset() {
    Utils.storage.remove(this.CLE);
  },

  // ✅ Widget est actif ?
  estActif(id) {
    const config = this.getConfig();
    const widget = config.find(w => w.id === id);
    return widget ? widget.actif : false;
  },

  // ✅ Widgets ordonnés et actifs
  getActifs() {
    return this.getConfig().filter(w => w.actif);
  },

  // ✅ Render page configuration
  renderConfig(container) {
    if (!container) return;

    const config = this.getConfig();
    const actifs = config.filter(w => w.actif).length;

    container.innerHTML = `

      <!-- Header -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                  border-color:rgba(75,75,249,0.3)">
        <div style="display:flex;align-items:center;
                    justify-content:space-between">
          <div>
            <div style="font-size:1rem;font-weight:800;margin-bottom:4px">
              🎛️ Widgets accueil
            </div>
            <div style="font-size:.75rem;color:var(--text-muted)">
              ${actifs} widget${actifs > 1 ? 's' : ''} actif${actifs > 1 ? 's' : ''}
              · Personnalise ton accueil
            </div>
          </div>
          <button onclick="WidgetsHome._resetConfig()"
                  style="padding:6px 12px;font-size:.7rem;font-weight:700;
                         background:rgba(255,141,150,0.1);
                         border:1px solid rgba(255,141,150,0.2);
                         border-radius:var(--radius-full);
                         color:var(--fd-coral);cursor:pointer">
            🔄 Reset
          </button>
        </div>
      </div>

      <!-- Info -->
      <div style="padding:8px 12px;margin-bottom:12px;
                  background:rgba(191,161,255,0.08);
                  border:1px solid rgba(191,161,255,0.15);
                  border-radius:var(--radius-md);
                  font-size:.72rem;color:rgba(191,161,255,0.8);
                  line-height:1.5">
        💡 Active/désactive les widgets et réorganise-les
        avec les flèches ▲▼
      </div>

      <!-- Liste widgets -->
      <div style="display:flex;flex-direction:column;gap:8px">
        ${config.map((w, idx) => `
          <div style="display:flex;align-items:center;gap:10px;
                      padding:12px 14px;
                      background:${w.actif
                        ? 'rgba(75,75,249,0.08)'
                        : 'var(--bg-card)'};
                      border:1px solid ${w.actif
                        ? 'rgba(75,75,249,0.25)'
                        : 'var(--border-color)'};
                      border-radius:var(--radius-lg);
                      transition:all .2s;
                      opacity:${w.actif ? '1' : '0.5'}">

            <!-- Emoji widget -->
            <div style="width:40px;height:40px;border-radius:12px;
                        background:${w.actif
                          ? 'rgba(75,75,249,0.15)'
                          : 'var(--bg-input)'};
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.2rem;
                        flex-shrink:0">
              ${w.emoji}
            </div>

            <!-- Infos -->
            <div style="flex:1;min-width:0">
              <div style="font-size:.85rem;font-weight:700;
                          color:var(--text-primary)">
                ${w.label}
                ${w.bloqué
                  ? '<span style="font-size:.6rem;padding:1px 6px;background:rgba(75,75,249,0.15);border-radius:99px;color:var(--fd-indigo);margin-left:4px">Requis</span>'
                  : ''}
              </div>
              <div style="font-size:.65rem;color:var(--text-muted);
                          margin-top:1px;overflow:hidden;
                          text-overflow:ellipsis;white-space:nowrap">
                ${w.desc}
              </div>
            </div>

            <!-- Flèches réorganisation -->
            <div style="display:flex;flex-direction:column;
                        gap:2px;flex-shrink:0">
              <button onclick="WidgetsHome._deplacerEtRefresh('${w.id}','up')"
                      style="width:24px;height:24px;background:var(--bg-input);
                             border:1px solid var(--border-color);
                             border-radius:6px;cursor:pointer;
                             font-size:.7rem;display:flex;align-items:center;
                             justify-content:center;
                             opacity:${idx === 0 ? '0.2' : '1'}"
                      ${idx === 0 ? 'disabled' : ''}>
                ▲
              </button>
              <button onclick="WidgetsHome._deplacerEtRefresh('${w.id}','down')"
                      style="width:24px;height:24px;background:var(--bg-input);
                             border:1px solid var(--border-color);
                             border-radius:6px;cursor:pointer;
                             font-size:.7rem;display:flex;align-items:center;
                             justify-content:center;
                             opacity:${idx === config.length - 1 ? '0.2' : '1'}"
                      ${idx === config.length - 1 ? 'disabled' : ''}>
                ▼
              </button>
            </div>

            <!-- Toggle -->
            ${w.bloqué ? `
              <div style="width:48px;height:26px;flex-shrink:0;
                          opacity:0.4;pointer-events:none">
                <div style="position:relative;width:48px;height:26px">
                  <div style="position:absolute;inset:0;
                              background:var(--fd-indigo);
                              border-radius:99px"></div>
                  <div style="position:absolute;top:50%;left:24px;
                              transform:translateY(-50%);
                              width:18px;height:18px;
                              background:white;border-radius:50%">
                  </div>
                </div>
              </div>` : `
              <div onclick="WidgetsHome._toggleEtRefresh('${w.id}')"
                   style="position:relative;width:48px;height:26px;
                          cursor:pointer;flex-shrink:0">
                <div style="position:absolute;inset:0;
                            background:${w.actif
                              ? 'var(--fd-indigo)'
                              : 'rgba(255,255,255,0.1)'};
                            border:2px solid ${w.actif
                              ? 'var(--fd-indigo)'
                              : 'rgba(255,255,255,0.2)'};
                            border-radius:99px;transition:all .25s">
                </div>
                <div style="position:absolute;top:50%;
                            left:${w.actif ? '24px' : '2px'};
                            transform:translateY(-50%);
                            width:18px;height:18px;
                            background:${w.actif
                              ? 'white'
                              : 'rgba(255,255,255,0.4)'};
                            border-radius:50%;
                            transition:left .25s;
                            pointer-events:none">
                </div>
              </div>`}
          </div>`).join('')}
      </div>

      <!-- Bouton appliquer -->
      <div style="margin-top:16px;padding-bottom:8px">
        <button onclick="naviguer('home')"
                class="btn-primary"
                style="width:100%;font-size:.9rem">
          ✅ Appliquer et voir l'accueil
        </button>
      </div>
    `;
  },

  // ✅ Actions UI
  _toggleEtRefresh(id) {
    this.toggleWidget(id);
    const container = document.getElementById('page-settings')
      || document.getElementById('page-home');
    const el = document.querySelector('[data-widgets-config]')
      || document.getElementById('widgets-config-container');
    if (el) this.renderConfig(el);
    else {
      // Re-render inline
      const pageEl = document.getElementById('page-home');
      if (pageEl) this.renderConfig(
        document.getElementById('widgets-config-container')
      );
    }
    Utils.toast(
      `Widget ${this.estActif(id) ? 'activé ✅' : 'masqué'}`,
      'success', 1000
    );
  },

  _deplacerEtRefresh(id, dir) {
    this.deplacerWidget(id, dir);
    const el = document.getElementById('widgets-config-container');
    if (el) this.renderConfig(el);
    Utils.vibrer([20]);
  },

  _resetConfig() {
    this.reset();
    const el = document.getElementById('widgets-config-container');
    if (el) this.renderConfig(el);
    Utils.toast('🔄 Widgets réinitialisés !', 'success');
  }
};

// ════════════════════════════════════════════════════════════
// ✅ PLANNING EDITOR — Changer les séances du planning
// ════════════════════════════════════════════════════════════
const PlanningEditor = {

  // ✅ Ouvrir la modal de choix de séance pour un jour
  ouvrirChoixSeance(jourIdx) {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const planning    = Programme.getPlanningActuel();
    const jourActuel  = planning[jourIdx];
    const toutes      = Programme.getAllSeances();
    const labels      = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];

    // ✅ Trouver où est chaque séance dans le planning actuel
    const placements = {};
    planning.forEach((p, idx) => {
      if (p.seanceId) {
        placements[p.seanceId] = {
          jourIdx: idx,
          label:   labels[idx]
        };
      }
    });

    content.innerHTML = `
      <div style="padding:16px">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,
                    rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                    border:1px solid rgba(75,75,249,0.3);
                    border-radius:var(--radius-lg);
                    padding:14px 16px;margin-bottom:16px">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--fd-indigo);margin-bottom:4px">
            📅 Changer la séance du
          </div>
          <div style="font-size:1.2rem;font-weight:800">
            ${labels[jourIdx]}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
            Actuellement :
            ${jourActuel.seanceId
              ? `${Programme._getSeanceById(jourActuel.seanceId)?.emoji || '💪'} ${Programme._getSeanceById(jourActuel.seanceId)?.nom || ''}`
              : '😴 Jour de repos'}
          </div>
        </div>

        <!-- Info échange -->
        <div style="padding:8px 12px;margin-bottom:14px;
                    background:rgba(191,161,255,0.08);
                    border:1px solid rgba(191,161,255,0.15);
                    border-radius:var(--radius-md);
                    font-size:.7rem;color:rgba(191,161,255,0.8);
                    line-height:1.5">
          💡 Si la séance choisie est déjà placée un autre jour,
          les deux jours s'échangeront automatiquement.
        </div>

        <!-- Option Repos -->
        <div onclick="PlanningEditor.changerSeance(${jourIdx}, null)"
             style="display:flex;align-items:center;gap:12px;
                    padding:12px 14px;margin-bottom:8px;
                    background:${!jourActuel.seanceId
                      ? 'rgba(139,240,187,0.1)'
                      : 'rgba(255,255,255,0.03)'};
                    border:1px solid ${!jourActuel.seanceId
                      ? 'rgba(139,240,187,0.3)'
                      : 'rgba(255,255,255,0.08)'};
                    border-radius:var(--radius-lg);
                    cursor:pointer;transition:all .2s"
             onmouseenter="this.style.borderColor='rgba(139,240,187,0.3)';this.style.background='rgba(139,240,187,0.06)'"
             onmouseleave="this.style.borderColor='${!jourActuel.seanceId ? 'rgba(139,240,187,0.3)' : 'rgba(255,255,255,0.08)'}';this.style.background='${!jourActuel.seanceId ? 'rgba(139,240,187,0.1)' : 'rgba(255,255,255,0.03)'}'">
          <div style="width:44px;height:44px;border-radius:12px;
                      background:rgba(139,240,187,0.1);
                      border:1px solid rgba(139,240,187,0.2);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.4rem;
                      flex-shrink:0">
            😴
          </div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:700">
              Jour de repos
            </div>
            <div style="font-size:.62rem;color:var(--text-muted);margin-top:2px">
              Pas de séance ce jour
            </div>
          </div>
          ${!jourActuel.seanceId ? `
            <div style="font-size:.65rem;color:var(--fd-mint);
                        font-weight:700">✅ Actuel</div>` : ''}
        </div>

        <!-- Séparateur -->
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin:12px 0 8px;
                    display:flex;align-items:center;gap:8px">
          💪 Choisir une séance
          <div style="flex:1;height:1px;background:var(--border-color)"></div>
        </div>

        <!-- Liste séances -->
        <div style="display:flex;flex-direction:column;gap:8px">
          ${toutes.map(s => {
            const estActuelle  = jourActuel.seanceId === s.id;
            const placement    = placements[s.id];
            const estAilleurs  = placement && placement.jourIdx !== jourIdx;

            return `
              <div onclick="PlanningEditor.changerSeance(${jourIdx}, '${s.id}')"
                   style="display:flex;align-items:center;gap:12px;
                          padding:12px 14px;
                          background:${estActuelle
                            ? 'rgba(75,75,249,0.15)'
                            : 'rgba(255,255,255,0.03)'};
                          border:1px solid ${estActuelle
                            ? 'rgba(75,75,249,0.4)'
                            : 'rgba(255,255,255,0.08)'};
                          border-radius:var(--radius-lg);
                          cursor:pointer;transition:all .2s"
                   onmouseenter="this.style.borderColor='rgba(75,75,249,0.4)';this.style.background='rgba(75,75,249,0.1)'"
                   onmouseleave="this.style.borderColor='${estActuelle ? 'rgba(75,75,249,0.4)' : 'rgba(255,255,255,0.08)'}';this.style.background='${estActuelle ? 'rgba(75,75,249,0.15)' : 'rgba(255,255,255,0.03)'}'">

                <!-- Emoji séance -->
                <div style="width:44px;height:44px;border-radius:12px;
                            background:rgba(75,75,249,0.12);
                            border:1px solid rgba(75,75,249,0.2);
                            display:flex;align-items:center;
                            justify-content:center;font-size:1.4rem;
                            flex-shrink:0">
                  ${s.emoji}
                </div>

                <!-- Infos séance -->
                <div style="flex:1;min-width:0">
                  <div style="font-size:.9rem;font-weight:700;
                              color:${estActuelle
                                ? 'var(--fd-indigo)'
                                : 'var(--text-primary)'}">
                    ${s.nom}
                  </div>
                  <div style="font-size:.62rem;color:var(--text-muted);
                              margin-top:2px">
                    ~${s.duree_estimee}min
                    · ${s.exercices?.length || 0} exercices
                    · ${(s.muscles||[]).slice(0,2).join(', ')}
                  </div>
                  ${estAilleurs ? `
                    <div style="font-size:.6rem;margin-top:3px;
                                color:var(--fd-lemon);font-weight:600;
                                display:flex;align-items:center;gap:4px">
                      🔄 Actuellement le ${placement.label}
                      → échange automatique
                    </div>` : ''}
                </div>

                <!-- Badge statut -->
                <div style="flex-shrink:0;text-align:right">
                  ${estActuelle ? `
                    <div style="font-size:.65rem;color:var(--fd-indigo);
                                font-weight:700">✅ Actuel</div>` : ''}
                  ${estAilleurs && !estActuelle ? `
                    <div style="font-size:.65rem;color:var(--fd-lemon);
                                font-weight:700">🔄 Échange</div>` : ''}
                  ${!estActuelle && !estAilleurs ? `
                    <div style="font-size:.65rem;color:var(--text-muted)">
                      Libre
                    </div>` : ''}
                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Bouton fermer -->
        <button onclick="document.getElementById('modal-info').classList.add('hidden')"
                class="btn-secondary"
                style="width:100%;margin-top:16px;font-size:.85rem">
          ✕ Annuler
        </button>

      </div>
    `;

    modal.classList.remove('hidden');

    // Bouton fermer natif
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  // ✅ Changer la séance d'un jour + échange automatique
  changerSeance(jourIdx, nouvelleSeanceId) {
    const planning = [...Programme.getPlanningActuel()];

    const ancienneSeanceId = planning[jourIdx].seanceId;

    // Pas de changement
    if (ancienneSeanceId === nouvelleSeanceId) {
      document.getElementById('modal-info')?.classList.add('hidden');
      return;
    }

    // ✅ Trouver où est déjà la nouvelle séance
    const ancienJourNouvelleSeance = planning.findIndex(
      (p, idx) => idx !== jourIdx && p.seanceId === nouvelleSeanceId
    );

    // ✅ ÉCHANGE AUTOMATIQUE
    if (ancienJourNouvelleSeance !== -1 && nouvelleSeanceId !== null) {
      // La nouvelle séance était ailleurs → on échange
      planning[jourIdx].seanceId                  = nouvelleSeanceId;
      planning[ancienJourNouvelleSeance].seanceId = ancienneSeanceId;
    } else {
      // La nouvelle séance n'était nulle part → simple remplacement
      planning[jourIdx].seanceId = nouvelleSeanceId;
    }

    // ✅ Sauvegarder
    Programme.sauvegarderPlanning(planning);

    // ✅ Fermer la modal
    document.getElementById('modal-info')?.classList.add('hidden');

    // ✅ Re-render la home
    const homeContainer = document.getElementById('page-home');
    if (homeContainer && window._pageActive === 'home') {
      _rendreHome(homeContainer);
    }

    // ✅ Toast de confirmation
    const labels         = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    const nouvelleSeance = nouvelleSeanceId
      ? Programme._getSeanceById(nouvelleSeanceId)
      : null;

    if (ancienJourNouvelleSeance !== -1 && nouvelleSeanceId) {
      Utils.toast(
        `🔄 Échangé ! ${nouvelleSeance?.emoji} ${nouvelleSeance?.nom} ↔ ${labels[ancienJourNouvelleSeance]}`,
        'success', 3000
      );
    } else if (nouvelleSeanceId) {
      Utils.toast(
        `✅ ${labels[jourIdx]} → ${nouvelleSeance?.emoji} ${nouvelleSeance?.nom}`,
        'success', 2500
      );
    } else {
      Utils.toast(
        `😴 ${labels[jourIdx]} → Jour de repos`,
        'success', 2000
      );
    }

    Utils.vibrer([50, 30, 50]);
  },

  // ✅ Reset le planning par défaut
  resetPlanning() {
    Utils.confirmer(
      '🔄 Réinitialiser le planning ?',
      'Le planning original sera restauré.'
    ).then(ok => {
      if (!ok) return;
      Programme.resetPlanning();
      const homeContainer = document.getElementById('page-home');
      if (homeContainer) _rendreHome(homeContainer);
      Utils.toast('✅ Planning réinitialisé !', 'success');
    });
  }
};

window.PlanningEditor = PlanningEditor;
window.WidgetsHome = WidgetsHome;

// ════════════════════════════════════════════════════════════
// PAGE HOME — Avec widgets personnalisables
// ════════════════════════════════════════════════════════════
function _rendreHome(container) {
  let profil   = { nom:'Athlète', avatar:'💪' };
  let seance   = null, prochaine = null;
  let infos    = { label:'S1', cycle:1,
                   phase:{ emoji:'🌱', nom:'Reprise', couleur:'#8bf0bb' } };
  let streak   = { count:0, max:0 };
  let xp       = { total:0, pourcentage:0,
                   niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
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
  const salut    = heure < 12 ? 'Bonjour'
                 : heure < 18 ? 'Bon après-midi' : 'Bonsoir';
  const dateLabel = new Date().toLocaleDateString('fr-FR',{
    weekday:'long', day:'numeric', month:'short'
  });

  const tempsSalle   = Utils.storage.get('ft_temps_salle', 60);
  const exosAdaptes  = seance
    ? getExercicesSelonTemps(seance.exercices || [], tempsSalle)
    : [];

  // ✅ Récupérer ordre et état des widgets
  const widgets = WidgetsHome.getConfig();

  // ✅ Générateur de chaque widget
  function genererWidget(id) {
    switch(id) {

      // ── GREETING ──────────────────────────────────────
      case 'greeting': return `
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
            ${profil.avatar || '💪'}
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);
                      margin-top:4px;display:flex;
                      align-items:center;gap:5px">
            <div style="width:4px;height:4px;border-radius:50%;
                        background:var(--fd-indigo)"></div>
            ${infos.phase.emoji} ${infos.phase.nom}
          </div>
        </div>`;

      // ── SEARCH ────────────────────────────────────────
      case 'search': return `
        <div style="position:relative;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:10px;
                      background:var(--bg-input);
                      border:1px solid var(--border-color);
                      border-radius:var(--radius-md);
                      padding:10px 14px;transition:border-color .2s"
               id="home-search-wrap">
            <span style="font-size:1rem;flex-shrink:0">🔍</span>
            <input id="home-search-input"
                   type="text"
                   placeholder="Rechercher une séance, exercice, page…"
                   autocomplete="off"
                   style="flex:1;background:none;border:none;
                          color:var(--text-primary);font-size:.82rem;
                          outline:none"
                   oninput="_homeSearchLive(this.value)"
                   onkeydown="if(event.key==='Enter'){
                     rechercherDepuisHome(this.value);
                     this.blur();
                   }"/>
            <button id="home-search-clear"
                    onclick="_homeSearchClear()"
                    style="display:none;background:none;border:none;
                           color:var(--text-muted);font-size:1rem;
                           cursor:pointer;padding:0">✕</button>
          </div>
          <div id="home-search-suggestions"
               style="display:none;position:absolute;top:100%;
                      left:0;right:0;z-index:200;
                      background:var(--bg-card);
                      border:1px solid var(--border-color);
                      border-radius:var(--radius-md);
                      margin-top:4px;overflow:hidden;
                      box-shadow:0 8px 24px rgba(0,0,0,0.3)">
          </div>
        </div>`;

      // ── STREAK + XP ───────────────────────────────────
      case 'streak_xp': return `
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:10px;margin-bottom:14px">

          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);padding:14px;
                      display:flex;align-items:center;gap:12px;
                      position:relative;overflow:hidden;cursor:pointer"
               onclick="naviguer('stats')">
            <div style="position:absolute;top:-15px;right:-15px;
                        width:60px;height:60px;border-radius:50%;
                        background:rgba(249,239,119,0.06)"></div>
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
                    fill="var(--fd-lemon)" font-size="13"
                    font-weight="800">🔥</text>
            </svg>
            <div>
              <div style="font-size:1.3rem;font-weight:800;
                          color:var(--fd-lemon);line-height:1">
                ${streak.count}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted);
                          text-transform:uppercase;letter-spacing:.06em;
                          margin-top:2px">Streak</div>
              <div style="font-size:.58rem;color:var(--text-muted);
                          margin-top:1px">jours consec.</div>
            </div>
          </div>

          <div style="background:rgba(255,255,255,0.04);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-lg);padding:14px;
                      display:flex;align-items:center;gap:12px;
                      position:relative;overflow:hidden;cursor:pointer"
               onclick="naviguer('gamification')">
            <div style="position:absolute;top:-15px;right:-15px;
                        width:60px;height:60px;border-radius:50%;
                        background:rgba(75,75,249,0.08)"></div>
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
                    fill="var(--fd-lavender)" font-size="10"
                    font-weight="800">N${xp.niveau.numero}</text>
            </svg>
            <div>
              <div style="font-size:1.2rem;font-weight:800;
                          color:var(--fd-lavender);line-height:1">
                ${xp.total}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted);
                          text-transform:uppercase;letter-spacing:.06em;
                          margin-top:2px">XP total</div>
              <div style="font-size:.58rem;color:var(--text-muted);
                          margin-top:1px">${xp.niveau.nom}</div>
            </div>
          </div>
        </div>`;

      // ── SÉANCE HERO ───────────────────────────────────
     case 'seance_hero': return (() => {

  // ✅ Vérifier si séance du jour déjà faite
  let seanceFaite = false;
  let statsSeance = { volume:0, duree:0, prs:0, series:0 };

  try {
    const seanceDuJour = Tracker.getSeanceDuJour();
    if (seanceDuJour?.terminee || seanceDuJour?.series?.length > 0) {
      seanceFaite = true;
      statsSeance = {
        volume:  seanceDuJour.volumeTotal || 0,
        duree:   seanceDuJour.duree       || 0,
        prs:    (seanceDuJour.prs || []).length,
        series:  seanceDuJour.series?.length || 0
      };
    }
  } catch(e) {}

  // ✅ SÉANCE FAITE — Carte verte
  if (seanceFaite && seance) return `
    <div style="border-radius:var(--radius-xl);
                padding:20px;margin-bottom:14px;
                position:relative;overflow:hidden;
                background:linear-gradient(135deg,
                  rgba(139,240,187,0.2) 0%,
                  rgba(139,240,187,0.06) 60%,
                  rgba(75,75,249,0.05) 100%);
                border:1px solid rgba(139,240,187,0.4);
                box-shadow:0 4px 24px rgba(139,240,187,0.15)">

      <!-- Glow -->
      <div style="position:absolute;top:-40px;right:-30px;
                  width:160px;height:160px;
                  background:radial-gradient(circle,
                    rgba(139,240,187,0.2) 0%,transparent 70%);
                  pointer-events:none"></div>

      <!-- Badge fait -->
      <div style="display:flex;align-items:center;gap:6px;
                  margin-bottom:10px;position:relative;z-index:1">
        <div style="width:7px;height:7px;border-radius:50%;
                    background:var(--fd-mint);
                    box-shadow:0 0 8px var(--fd-mint)"></div>
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.12em;
                    color:var(--fd-mint)">
          ✅ Séance du jour complétée !
        </div>
      </div>

      <!-- Nom séance -->
      <div style="font-size:1.4rem;font-weight:800;
                  letter-spacing:-.02em;margin-bottom:4px;
                  position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>

      <!-- Stats séance -->
      <div style="display:grid;
                  grid-template-columns:repeat(3,1fr);
                  gap:8px;margin:14px 0;
                  position:relative;z-index:1">
        ${[
          { emoji:'📦', val:Utils.formatVolume(statsSeance.volume),
            label:'Volume',   color:'var(--fd-mint)'    },
          { emoji:'💪', val:statsSeance.series,
            label:'Séries',   color:'var(--fd-indigo)'  },
          { emoji:'🏆', val:statsSeance.prs || '—',
            label:'Records',  color:'var(--fd-lemon)'   }
        ].map(s => `
          <div style="background:rgba(255,255,255,0.05);
                      border:1px solid rgba(139,240,187,0.15);
                      border-radius:var(--radius-md);
                      padding:10px 6px;text-align:center">
            <div style="font-size:.85rem;margin-bottom:2px">
              ${s.emoji}
            </div>
            <div style="font-size:.95rem;font-weight:800;
                        color:${s.color};line-height:1">
              ${s.val}
            </div>
            <div style="font-size:.52rem;color:var(--text-muted);
                        margin-top:3px;text-transform:uppercase;
                        letter-spacing:.04em">
              ${s.label}
            </div>
          </div>`).join('')}
      </div>

      <!-- Boutons -->
      <div style="display:flex;gap:8px;
                  position:relative;z-index:1">
        <button onclick="naviguer('live')"
                style="flex:1;padding:10px;
                       background:rgba(139,240,187,0.15);
                       border:1px solid rgba(139,240,187,0.3);
                       border-radius:var(--radius-full);
                       font-size:.75rem;font-weight:700;
                       color:var(--fd-mint);cursor:pointer">
          📊 Voir le résumé
        </button>
        <button onclick="naviguer('stats')"
                style="flex:1;padding:10px;
                       background:rgba(75,75,249,0.12);
                       border:1px solid rgba(75,75,249,0.25);
                       border-radius:var(--radius-full);
                       font-size:.75rem;font-weight:700;
                       color:var(--fd-indigo);cursor:pointer">
          📈 Mes stats
        </button>
      </div>

      <!-- Prochaine séance -->
      ${prochaine ? `
        <div style="margin-top:14px;padding-top:14px;
                    border-top:1px solid rgba(139,240,187,0.15);
                    position:relative;z-index:1">
          <div style="font-size:.6rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:.1em;
                      color:var(--text-muted);margin-bottom:6px">
            📅 Prochaine séance
          </div>
          <div style="display:flex;align-items:center;
                      justify-content:space-between">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.2rem">${prochaine.emoji}</span>
              <div>
                <div style="font-size:.82rem;font-weight:700">
                  ${prochaine.nom}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${prochaine.dansJours === 1
                    ? 'Demain'
                    : `Dans ${prochaine.dansJours} jours`}
                  · ~${prochaine.duree_estimee || 60}min
                </div>
              </div>
            </div>
            <span style="font-size:.7rem;color:var(--text-muted)">›</span>
          </div>
        </div>` : ''}
    </div>`;

  // ✅ SÉANCE PAS ENCORE FAITE — Carte normale
  return seance ? `
    <div style="border-radius:var(--radius-xl);padding:20px;
                margin-bottom:14px;position:relative;overflow:hidden;
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
                    text-transform:uppercase;letter-spacing:.12em;
                    color:var(--fd-indigo)">Séance du jour</div>
      </div>
      <div style="font-size:1.4rem;font-weight:800;
                  letter-spacing:-.02em;margin-bottom:4px;
                  position:relative;z-index:1">
        ${seance.emoji} ${seance.nom}
      </div>
      <div style="font-size:.75rem;color:var(--text-muted);
                  margin-bottom:16px;position:relative;z-index:1">
        ~${seance.duree_estimee}min
        · ${seance.exercices?.length || 0} exercices
      </div>
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  position:relative;z-index:1">
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${(seance.muscles || []).map(m => `
            <span style="padding:4px 10px;border-radius:99px;
                         font-size:.6rem;font-weight:700;
                         text-transform:uppercase;letter-spacing:.04em;
                         background:rgba(75,75,249,0.2);
                         color:var(--fd-lavender);
                         border:1px solid rgba(75,75,249,0.3)">
              ${m}
            </span>`).join('')}
        </div>
        <div style="display:flex;gap:6px;align-items:center">
  <button onclick="naviguer('live')"
          style="display:flex;align-items:center;gap:8px;
                 padding:12px 20px;background:var(--fd-indigo);
                 color:white;border:none;border-radius:99px;
                 font-size:.82rem;font-weight:700;cursor:pointer;
                 white-space:nowrap;
                 box-shadow:0 4px 20px rgba(75,75,249,0.5)">
    ▶ Démarrer
  </button>

  <!-- ✅ NOUVEAU — Bouton Ultra depuis Home -->
  <button onclick="_lancerModeUltra('${seance.id}')"
          style="padding:12px 14px;
                 background:rgba(249,239,119,0.12);
                 border:1px solid rgba(249,239,119,0.3);
                 border-radius:99px;
                 font-size:.82rem;font-weight:700;
                 color:var(--fd-lemon);cursor:pointer;
                 white-space:nowrap">
    ⚡
  </button>
</div>
      </div>
    </div>` : `
    <div style="border-radius:var(--radius-xl);padding:20px;
                margin-bottom:14px;
                background:rgba(139,240,187,0.06);
                border:1px solid rgba(139,240,187,0.2);
                text-align:center">
      <div style="font-size:2rem;margin-bottom:6px">😴</div>
      <div style="font-weight:700;font-size:1rem">Jour de repos</div>
      ${prochaine ? `
        <div style="font-size:.72rem;color:var(--text-muted);margin-top:4px">
          Prochaine : ${prochaine.emoji} ${prochaine.nom}
          ${prochaine.dansJours > 0
            ? `dans ${prochaine.dansJours}j` : 'demain'}
        </div>` : ''}
    </div>`;
})();

      // ── TEMPS À LA SALLE ──────────────────────────────
      case 'temps_salle': return `
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:16px;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:7px;
                      margin-bottom:12px">
            <div style="width:3px;height:14px;border-radius:99px;
                        background:var(--fd-lemon)"></div>
            <span style="font-size:.6rem;font-weight:700;
                         text-transform:uppercase;letter-spacing:.1em;
                         color:var(--text-muted)">
              ⏱ Temps disponible à la salle
            </span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);
                      gap:8px;margin-bottom:12px">
            ${[
              {min:30,  label:'30 min', icon:'⚡', desc:'Express' },
              {min:60,  label:'1 h',    icon:'💪', desc:'Standard'},
              {min:90,  label:'1h30',   icon:'🏋️', desc:'Complet' },
              {min:120, label:'2 h',    icon:'🔥', desc:'Intense' }
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
                <div style="font-size:1rem;margin-bottom:3px">
                  ${t.icon}
                </div>
                <div style="font-size:.72rem;font-weight:800;
                            color:${tempsSalle === t.min
                              ? 'var(--fd-indigo)'
                              : 'var(--text-primary)'}">
                  ${t.label}
                </div>
                <div style="font-size:.55rem;color:var(--text-muted);
                            margin-top:1px">${t.desc}</div>
              </button>`).join('')}
          </div>
          <div style="padding:10px 12px;
                      background:rgba(75,75,249,0.08);
                      border:1px solid rgba(75,75,249,0.15);
                      border-radius:var(--radius-sm);
                      font-size:.75rem;color:var(--text-muted)">
            ${_getRecommandationTemps(tempsSalle, seance)}
          </div>
          ${seance && exosAdaptes.length > 0 ? `
            <div style="margin-top:12px">
              <div style="font-size:.6rem;font-weight:700;
                          text-transform:uppercase;letter-spacing:.08em;
                          color:var(--text-muted);margin-bottom:8px">
                Programme adapté · ${exosAdaptes.length} exercices
              </div>
              <div style="display:flex;flex-direction:column;gap:5px">
                ${exosAdaptes.map(ex => {
                  const exoData = (window.EXERCICES || {})[ex.ref] || {};
                  const pr = (() => {
                    try { return Tracker.getPR(ex.ref); }
                    catch(e) { return null; }
                  })();
                  return `
                    <div onclick="naviguer('live')"
                         style="display:flex;align-items:center;
                                gap:10px;padding:9px 12px;
                                background:var(--bg-input);
                                border-radius:var(--radius-sm);
                                border:1px solid var(--border-color);
                                cursor:pointer">
                      <div style="width:30px;height:30px;border-radius:8px;
                                  flex-shrink:0;
                                  background:rgba(75,75,249,0.12);
                                  border:1px solid rgba(75,75,249,0.2);
                                  display:flex;align-items:center;
                                  justify-content:center;font-size:.9rem">
                        ${exoData.emoji || '💪'}
                      </div>
                      <div style="flex:1">
                        <div style="font-size:.8rem;font-weight:700">
                          ${exoData.nom || ex.ref}
                        </div>
                        <div style="font-size:.6rem;color:var(--text-muted)">
                          ${exoData.muscle || ''}
                          ${pr ? `· <span style="color:var(--fd-lemon)">
                            PR ${pr.poids}kg</span>` : ''}
                        </div>
                      </div>
                      <div style="text-align:right;flex-shrink:0">
                        <div style="font-size:.75rem;font-weight:700;
                                    color:var(--fd-indigo)">
                          ${ex.series}×${ex.reps}
                        </div>
                        <div style="font-size:.58rem;color:var(--text-muted)">
                          ⏱ ${ex.repos || 60}s
                        </div>
                      </div>
                    </div>`;
                }).join('')}
              </div>
              <button onclick="naviguer('live')"
                      style="width:100%;margin-top:10px;padding:11px;
                             background:var(--fd-indigo);color:white;
                             border:none;border-radius:var(--radius-md);
                             font-size:.82rem;font-weight:700;cursor:pointer;
                             box-shadow:0 4px 16px rgba(75,75,249,0.4)">
                ▶ Démarrer cette séance
              </button>
            </div>` : ''}
        </div>`;

      // ── PROGRESSION LIVE ──────────────────────────────
      case 'progression_live': return (() => {
        try {
          const seanceAujourdhui = Tracker.getSeanceDuJour();
          if (!seanceAujourdhui?.series?.length) return '';
          const series     = seanceAujourdhui.series || [];
          const volumeAuj  = seanceAujourdhui.volumeTotal || 0;
          const prsAuj     = seanceAujourdhui.prs?.length || 0;
          const seanceBase = (window.SEANCES_BASE||{})[seanceAujourdhui.id];
          const totalSeries = (seanceBase?.exercices||[])
            .reduce((a,e) => a+(e.series||0), 0) || 1;
          const pct = Math.min(100,
            Math.round((series.length/totalSeries)*100));
          return `
            <div style="background:linear-gradient(135deg,
                        rgba(75,75,249,0.15),rgba(139,240,187,0.05));
                        border:1px solid rgba(75,75,249,0.3);
                        border-radius:var(--radius-lg);
                        padding:14px 16px;margin-bottom:14px"
                 onclick="naviguer('live')">
              <div style="display:flex;justify-content:space-between;
                          align-items:center;margin-bottom:8px">
                <div style="font-size:.6rem;font-weight:700;
                            text-transform:uppercase;letter-spacing:.1em;
                            color:var(--fd-indigo)">
                  ⚡ Séance en cours
                </div>
                <div style="font-size:.72rem;font-weight:700;
                            color:var(--fd-lemon)">${pct}%</div>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.08);
                          border-radius:99px;overflow:hidden;
                          margin-bottom:10px">
                <div style="height:100%;width:${pct}%;
                            background:linear-gradient(90deg,
                              var(--fd-indigo),var(--fd-mint));
                            border-radius:99px;transition:width .5s">
                </div>
              </div>
              <div style="display:flex;gap:12px">
                <div style="text-align:center;flex:1">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-mint)">
                    ${series.length}
                  </div>
                  <div style="font-size:.55rem;color:var(--text-muted);
                              text-transform:uppercase">Séries</div>
                </div>
                <div style="text-align:center;flex:1">
                  <div style="font-size:.95rem;font-weight:800;
                              color:var(--fd-indigo)">
                    ${Utils.formatVolume(volumeAuj)}
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
      })();

      // ── TIMERS REPOS ──────────────────────────────────
      case 'timers_repos': return `
        <div style="font-size:.58rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);
                    margin:14px 0 8px;
                    display:flex;align-items:center;gap:8px">
          ⏱ Timers repos
          <div style="flex:1;height:1px;background:var(--border-color)">
          </div>
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
                 onmousedown="this.style.transform='scale(.94)'"
                 onmouseup="this.style.transform=''">
              <div style="font-size:1.2rem;margin-bottom:4px">
                ${t.icon}
              </div>
              <div style="font-size:.78rem;font-weight:800;
                          color:var(--fd-indigo)">${t.val}</div>
              <div style="font-size:.55rem;color:var(--text-muted);
                          text-transform:uppercase;letter-spacing:.04em;
                          margin-top:1px">${t.label}</div>
            </div>`).join('')}
        </div>`;

      // ── PLANNING SEMAINE ──────────────────────────────
      case 'planning_semaine': return `
  <div style="font-size:.58rem;font-weight:700;
              text-transform:uppercase;letter-spacing:.1em;
              color:var(--text-muted);
              margin:14px 0 8px;
              display:flex;align-items:center;gap:8px">
    📅 Planning semaine
    <div style="flex:1;height:1px;background:var(--border-color)"></div>
    ${Programme.estPlanningCustom() ? `
      <button onclick="PlanningEditor.resetPlanning()"
              style="font-size:.58rem;font-weight:700;
                     padding:3px 8px;
                     background:rgba(255,141,150,0.1);
                     border:1px solid rgba(255,141,150,0.2);
                     border-radius:99px;
                     color:var(--fd-coral);cursor:pointer">
        🔄 Reset
      </button>` : ''}
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
    <div style="display:grid;grid-template-columns:repeat(7,1fr);
                gap:4px">
      ${(() => {
        const planning = (() => {
          try { return Programme.getSeancesSemaine(); }
          catch(e) { return []; }
        })();
        if (!planning.length) return '';
        return planning.map(jour => `
          <div style="display:flex;flex-direction:column;
                      align-items:center;gap:4px">
            <div onclick="PlanningEditor.ouvrirChoixSeance(${jour.jour})"
                 style="width:36px;height:36px;border-radius:10px;
                        display:flex;align-items:center;
                        justify-content:center;
                        font-size:.75rem;font-weight:700;
                        cursor:pointer;
                        position:relative;
                        transition:all .2s;
                        ${jour.estAujourdhui
                          ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,0.5)'
                          : jour.seance
                            ? 'background:rgba(75,75,249,0.2);border:1px solid rgba(75,75,249,0.4);color:var(--fd-lavender)'
                            : 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:var(--text-muted)'}"
                 title="${jour.seance ? jour.seance.nom : 'Repos'} — Cliquer pour changer">
              ${jour.estAujourdhui ? '▶'
                : jour.seance ? jour.seance.emoji : '😴'}
              <!-- Petit badge édition -->
              <div style="position:absolute;top:-4px;right:-4px;
                          width:12px;height:12px;
                          background:rgba(75,75,249,0.8);
                          border-radius:50%;
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.45rem;color:white">
                ✏️
              </div>
            </div>
            <div style="font-size:.5rem;color:var(--text-muted);
                        text-transform:uppercase;font-weight:600">
              ${jour.label}
            </div>
            ${jour.seance ? `
              <div style="font-size:.45rem;color:var(--text-muted);
                          text-align:center;
                          max-width:36px;
                          overflow:hidden;
                          text-overflow:ellipsis;
                          white-space:nowrap;
                          line-height:1.2">
                ${jour.seance.nom.split(' ')[0]}
              </div>` : `
              <div style="font-size:.45rem;color:var(--text-muted)">
                Repos
              </div>`}
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
  </div>`;

      // ── STATS SEMAINE ─────────────────────────────────
      case 'stats_semaine': return `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:14px">
          ${[
            {label:'Séances',  val:`${analyse.seances}/${analyse.objectif}`,
             color:'var(--fd-indigo)'},
            {label:'Volume',   val:Utils.formatVolume(analyse.volume),
             color:'var(--fd-mint)'},
            {label:'RPE moy.', val:analyse.rpe>0?`${analyse.rpe}/10`:'—',
             color:'var(--fd-lemon)'}
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
                          letter-spacing:.04em">${s.label}</div>
            </div>`).join('')}
        </div>`;

      // ── COACH DU JOUR ─────────────────────────────────
      case 'coach_jour': return `
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
        </div>`;

      // ── DÉFIS ─────────────────────────────────────────
      case 'defis': return defisSem.length > 0 ? `
        <div style="font-size:.58rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin:0 0 8px;
                    display:flex;align-items:center;gap:8px">
          🏆 Défis en cours
          <div style="flex:1;height:1px;background:var(--border-color)">
          </div>
        </div>
        <div style="background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.08);
                    border-radius:var(--radius-lg);
                    padding:16px;margin-bottom:12px;cursor:pointer"
             onclick="naviguer('defis')">
          ${defisSem.map(d => {
            const pct = Math.round(
              (d.progression/Math.max(d.cible,1))*100
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
        </div>` : '';

      // ── HUMEUR / FATIGUE ──────────────────────────────
      case 'humeur_fatigue':
        return _renderHumeurFatigue();

      // ── NUTRITION RAPIDE ──────────────────────────────
      case 'nutrition_rapide': return (() => {
        try {
          const obj   = Nutrition.getObjectifs();
          const eau   = Nutrition.getEau();
          const totaux = Nutrition.getTotauxJournal();
          const pctEau = Math.min(100,
            Math.round((eau/(obj.eau*1000))*100));
          const pctProt = Math.min(100,
            Math.round((totaux.prot/Math.max(obj.proteines,1))*100));
          const pctCal  = Math.min(100,
            Math.round((totaux.cal/Math.max(obj.calories,1))*100));

          return `
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-lg);
                        padding:14px 16px;margin-bottom:14px;
                        cursor:pointer"
                 onclick="naviguer('nutrition')">
              <div style="display:flex;align-items:center;
                          justify-content:space-between;
                          margin-bottom:10px">
                <div style="font-size:.6rem;font-weight:700;
                            text-transform:uppercase;letter-spacing:.1em;
                            color:var(--text-muted)">
                  🥗 Nutrition du jour
                </div>
                <div style="font-size:.65rem;color:var(--fd-indigo)">
                  Voir →
                </div>
              </div>
              ${[
                {label:'Calories',  pct:pctCal,  color:'var(--fd-lemon)',
                 val:`${totaux.cal}/${obj.calories}kcal`},
                {label:'Protéines', pct:pctProt, color:'var(--fd-coral)',
                 val:`${totaux.prot}/${obj.proteines}g`},
                {label:'Eau',       pct:pctEau,  color:'var(--fd-indigo)',
                 val:`${(eau/1000).toFixed(1)}/${obj.eau}L`}
              ].map(m => `
                <div style="margin-bottom:6px">
                  <div style="display:flex;justify-content:space-between;
                              margin-bottom:2px">
                    <span style="font-size:.65rem;
                                 color:var(--text-muted)">${m.label}</span>
                    <span style="font-size:.65rem;font-weight:700;
                                 color:${m.color}">${m.val}</span>
                  </div>
                  <div style="height:4px;background:rgba(255,255,255,0.05);
                              border-radius:99px;overflow:hidden">
                    <div style="height:100%;width:${m.pct}%;
                                background:${m.color};border-radius:99px">
                    </div>
                  </div>
                </div>`).join('')}
              <div style="display:flex;gap:6px;margin-top:8px">
                ${[150,250,500].map(ml => `
                  <button onclick="event.stopPropagation();
                                   Nutrition._ajouterEauRapide(${ml})"
                          style="flex:1;padding:5px 2px;font-size:.65rem;
                                 font-weight:700;
                                 background:rgba(75,75,249,0.1);
                                 border:1px solid rgba(75,75,249,0.2);
                                 border-radius:var(--radius-full);
                                 color:var(--fd-indigo);cursor:pointer">
                    💧+${ml}
                  </button>`).join('')}
              </div>
            </div>`;
        } catch(e) { return ''; }
      })();

      // ── PRs RÉCENTS ───────────────────────────────────
      case 'pr_du_jour': return (() => {
        try {
          const prs    = Tracker.getAllPRs();
          const recent = Object.entries(prs)
            .filter(([,pr]) => pr.date === Utils.aujourd_hui()
              || pr.date >= Utils.ajouterJours(Utils.aujourd_hui(),-7))
            .sort(([,a],[,b]) =>
              (b.date||'').localeCompare(a.date||''))
            .slice(0, 3);

          if (!recent.length) return '';

          return `
            <div style="background:rgba(249,239,119,0.06);
                        border:1px solid rgba(249,239,119,0.2);
                        border-radius:var(--radius-lg);
                        padding:14px 16px;margin-bottom:14px">
              <div style="font-size:.6rem;font-weight:700;
                          text-transform:uppercase;letter-spacing:.1em;
                          color:var(--fd-lemon);margin-bottom:10px">
                🏅 Records récents (7 jours)
              </div>
              ${recent.map(([ref, pr]) => {
                const ex = (window.EXERCICES||{})[ref]||{};
                return `
                  <div style="display:flex;align-items:center;gap:8px;
                              padding:6px 0;
                              border-bottom:1px solid rgba(249,239,119,0.1)">
                    <span style="font-size:1rem">${ex.emoji||'💪'}</span>
                    <div style="flex:1">
                      <div style="font-size:.78rem;font-weight:700">
                        ${ex.nom||ref}
                      </div>
                      <div style="font-size:.6rem;color:var(--text-muted)">
                        ${pr.date}
                      </div>
                    </div>
                    <div style="text-align:right">
                      <div style="font-size:.78rem;font-weight:800;
                                  color:var(--fd-lemon)">
                        ${pr.poids}kg×${pr.reps}
                      </div>
                      <div style="font-size:.6rem;color:var(--fd-lavender)">
                        1RM ~${pr.rm1||'?'}kg
                      </div>
                    </div>
                  </div>`;
              }).join('')}
            </div>`;
        } catch(e) { return ''; }
      })();

      // ── MÉTÉO MOTIVATION ──────────────────────────────
      case 'meteo_sport': return (() => {
        try {
          const forme  = Tracker.calculerScoreForme();
          const score  = forme.score || 0;
          const meteo  = score >= 80 ? {emoji:'☀️',label:'Excellente forme',color:'var(--fd-lemon)'}
                       : score >= 60 ? {emoji:'⛅',label:'Bonne forme',     color:'var(--fd-mint)'}
                       : score >= 40 ? {emoji:'🌤',label:'Forme correcte',  color:'var(--fd-indigo)'}
                       :               {emoji:'🌧',label:'Récupération',     color:'var(--fd-coral)'};
          const conseil = score >= 70
            ? 'Tu es au top ! C\'est le moment de viser des records.'
            : score >= 50
              ? 'Bonne séance en vue. Reste concentré sur ta technique.'
              : 'Écoute ton corps. Une séance légère vaut mieux que rien.';

          return `
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-left:3px solid ${meteo.color};
                        border-radius:var(--radius-lg);
                        padding:14px 16px;margin-bottom:14px">
              <div style="display:flex;align-items:center;
                          gap:12px;margin-bottom:8px">
                <span style="font-size:2rem">${meteo.emoji}</span>
                <div>
                  <div style="font-size:.82rem;font-weight:700;
                              color:${meteo.color}">
                    ${meteo.label}
                  </div>
                  <div style="font-size:.65rem;color:var(--text-muted)">
                    Score de forme : ${score}/100
                  </div>
                </div>
                <div style="margin-left:auto">
                  <svg width="44" height="44" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            stroke-width="6"/>
                    <circle cx="22" cy="22" r="18"
                            fill="none"
                            stroke="${meteo.color}"
                            stroke-width="6"
                            stroke-linecap="round"
                            stroke-dasharray="${Math.round(113*(score/100))} 113"
                            transform="rotate(-90 22 22)"/>
                    <text x="22" y="26"
                          text-anchor="middle"
                          fill="${meteo.color}"
                          font-size="9"
                          font-weight="800">
                      ${score}
                    </text>
                  </svg>
                </div>
              </div>
              <p style="font-size:.78rem;color:var(--text-secondary);
                        line-height:1.5;margin:0">
                ${conseil}
              </p>
            </div>`;
        } catch(e) { return ''; }
      })();

      default: return '';
    }
  }

  // ✅ BOUTON PERSONNALISER (toujours visible)
  const btnPerso = `
    <div style="display:flex;justify-content:flex-end;
                margin-bottom:8px">
      <button onclick="_ouvrirConfigWidgets()"
              style="display:flex;align-items:center;gap:6px;
                     padding:6px 12px;font-size:.68rem;font-weight:700;
                     background:rgba(75,75,249,0.1);
                     border:1px solid rgba(75,75,249,0.2);
                     border-radius:var(--radius-full);
                     color:var(--fd-indigo);cursor:pointer">
        🎛️ Personnaliser
      </button>
    </div>`;

  // ✅ Construire le HTML dans l'ordre des widgets
  const htmlWidgets = widgets
    .filter(w => w.actif)
    .map(w => genererWidget(w.id))
    .join('');

  container.innerHTML = btnPerso + htmlWidgets
    + '<div style="height:8px"></div>';

  // ✅ Events post-render
  requestAnimationFrame(() => {
    _attacherHumeurFatigueEvents();
    _attacherSearchEvents();
  });
}

// ════════════════════════════════════════════════════════════
// OUVRIR CONFIG WIDGETS — Modal inline
// ════════════════════════════════════════════════════════════
function _ouvrirConfigWidgets() {
  const modal   = document.getElementById('modal-info');
  const content = document.getElementById('modal-info-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div id="widgets-config-container"
         style="padding:var(--space-md)">
    </div>`;

  modal.classList.remove('hidden');
  WidgetsHome.renderConfig(
    document.getElementById('widgets-config-container')
  );

  const closeBtn = document.getElementById('modal-info-close');
  if (closeBtn) closeBtn.onclick = () => {
    modal.classList.add('hidden');
    // Re-render home avec nouvelles config
    const home = document.getElementById('page-home');
    if (home) _rendreHome(home);
  };
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
              cursor:pointer;position:relative"
       onclick="PlanningEditor.ouvrirChoixSeance(${jour.jour})">
    <div style="font-size:.6rem;
                color:${jour.estAujourdhui ? 'white' : 'var(--text-muted)'};
                font-weight:${jour.estAujourdhui ? '700' : '400'}">
      ${jour.label}
    </div>
    <div style="font-size:.9rem;margin-top:2px">
      ${jour.seance ? jour.seance.emoji : jour.estRepos ? '😴' : '·'}
    </div>
    <div style="position:absolute;top:2px;right:2px;
                font-size:.5rem;opacity:.5">✏️</div>
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
// ✅ MODULE LIVE RAPIDE — Mains libres
// ════════════════════════════════════════════════════════════
const LiveRapide = {

  // State par exercice : { poids, reps, rpe }
  _valeurs: {},
  _wakeLock: null,

  // ✅ WakeLock — écran toujours allumé
  async activerWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this._wakeLock = await navigator.wakeLock.request('screen');
        console.log('[LiveRapide] WakeLock actif');
      }
    } catch(e) {}
  },

  async relacherWakeLock() {
    try {
      await this._wakeLock?.release();
      this._wakeLock = null;
    } catch(e) {}
  },

  // ✅ Initialiser les valeurs d'un exercice
  initExo(exoIdx, poidsDefaut = '', repsDefaut = '') {
    if (!this._valeurs[exoIdx]) {
      this._valeurs[exoIdx] = {
        poids: poidsDefaut,
        reps:  repsDefaut,
        rpe:   7
      };
    }
  },

  // ✅ Obtenir valeurs actuelles
  get(exoIdx) {
    return this._valeurs[exoIdx] || { poids:'', reps:'', rpe:7 };
  },

// ✅ Modifier poids avec +/- — FIX DOM direct
modifierPoids(exoIdx, delta) {

  // Trouver le premier input poids non validé
  let inputActif = null;
  document.querySelectorAll(
    `[id^="lr-poids-${exoIdx}-"]`
  ).forEach(input => {
    if (inputActif) return;
    const parts    = input.id.split('-');
    const serieIdx = parseInt(parts[parts.length - 1]);
    const btn      = document.getElementById(
      `btn-serie-${exoIdx}-${serieIdx}`
    );
    if (btn && !btn.disabled) inputActif = input;
  });

  if (!inputActif) return;

  // Calculer nouvelle valeur
  const actuel  = parseFloat(inputActif.value) || 0;
  const nouveau = Math.max(0,
    Math.round((actuel + delta) * 4) / 4
  );

  // ✅ Mettre à jour le DOM directement
  inputActif.value = nouveau;

  // Mettre à jour le state
  const v = this.get(exoIdx);
  this._valeurs[exoIdx] = { ...v, poids: nouveau };

  // Feedback visuel
  inputActif.style.borderColor = delta > 0
    ? 'var(--fd-mint)' : 'var(--fd-coral)';
  inputActif.style.transform = 'scale(1.04)';
  setTimeout(() => {
    inputActif.style.borderColor = 'var(--border-color)';
    inputActif.style.transform   = '';
  }, 180);

  // Vibration légère
  Utils.vibrer([10]);
},

// ✅ Modifier reps avec +/- — FIX DOM direct
modifierReps(exoIdx, delta) {

  // Trouver le premier input reps non validé
  let inputActif = null;
  document.querySelectorAll(
    `[id^="lr-reps-${exoIdx}-"]`
  ).forEach(input => {
    if (inputActif) return;
    const parts    = input.id.split('-');
    const serieIdx = parseInt(parts[parts.length - 1]);
    const btn      = document.getElementById(
      `btn-serie-${exoIdx}-${serieIdx}`
    );
    if (btn && !btn.disabled) inputActif = input;
  });

  if (!inputActif) return;

  // Calculer nouvelle valeur
  const actuel  = parseInt(inputActif.value) || 0;
  const nouveau = Math.max(1, actuel + delta);

  // ✅ Mettre à jour le DOM directement
  inputActif.value = nouveau;

  // Mettre à jour le state
  const v = this.get(exoIdx);
  this._valeurs[exoIdx] = { ...v, reps: nouveau };

  // Feedback visuel
  inputActif.style.borderColor = delta > 0
    ? 'var(--fd-mint)' : 'var(--fd-coral)';
  inputActif.style.transform = 'scale(1.04)';
  setTimeout(() => {
    inputActif.style.borderColor = 'var(--border-color)';
    inputActif.style.transform   = '';
  }, 180);

  // Vibration légère
  Utils.vibrer([10]);
},

  // ✅ Saisie directe poids
  setPoids(exoIdx, val) {
    const v = this.get(exoIdx);
    this._valeurs[exoIdx] = { ...v, poids: val };
  },

  // ✅ Saisie directe reps
  setReps(exoIdx, val) {
    const v = this.get(exoIdx);
    this._valeurs[exoIdx] = { ...v, reps: val };
  },

  // ✅ Saisie RPE
  setRPE(exoIdx, val) {
    const v = this.get(exoIdx);
    this._valeurs[exoIdx] = { ...v, rpe: val };
  },

  // ✅ Copier depuis série précédente
  copierSeriePrecedente(exoIdx, serieIdx) {
    if (serieIdx <= 0) return;
    const poids = document.getElementById(
      `lr-poids-${exoIdx}-${serieIdx - 1}`
    )?.value;
    const reps  = document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx - 1}`
    )?.value;
    if (poids) this._valeurs[exoIdx] = {
      ...this.get(exoIdx), poids
    };
    if (reps) this._valeurs[exoIdx] = {
      ...this.get(exoIdx), reps
    };
    this._updateAffichage(exoIdx);
    Utils.toast('↩️ Valeurs copiées !', 'success', 800);
  },

  // ✅ Update affichage sans re-render
  _updateAffichage(exoIdx) {
    // Mettre à jour tous les inputs visibles de cet exercice
    document.querySelectorAll(
      `[id^="lr-poids-${exoIdx}-"]`
    ).forEach(input => {
      const serieIdx = parseInt(input.id.split('-')[3]);
      // Ne mettre à jour que si la série n'est pas encore validée
      const btn = document.getElementById(
        `btn-serie-${exoIdx}-${serieIdx}`
      );
      if (btn?.textContent === '○') {
        input.value = this._valeurs[exoIdx]?.poids || '';
      }
    });
    document.querySelectorAll(
      `[id^="lr-reps-${exoIdx}-"]`
    ).forEach(input => {
      const serieIdx = parseInt(input.id.split('-')[3]);
      const btn = document.getElementById(
        `btn-serie-${exoIdx}-${serieIdx}`
      );
      if (btn?.textContent === '○') {
        input.value = this._valeurs[exoIdx]?.reps || '';
      }
    });

    // Mettre à jour les affichages rapides
    document.querySelectorAll(
      `[data-lr-poids="${exoIdx}"]`
    ).forEach(el => {
      el.textContent = this._valeurs[exoIdx]?.poids
        ? `${this._valeurs[exoIdx].poids} kg`
        : '— kg';
    });
    document.querySelectorAll(
      `[data-lr-reps="${exoIdx}"]`
    ).forEach(el => {
      el.textContent = this._valeurs[exoIdx]?.reps
        ? `${this._valeurs[exoIdx].reps} reps`
        : '— reps';
    });
  },

  // ✅ Timer repos AUTO avec transition
  lancerReposAuto(secondes, exoIdx, serieIdx,
                totalSeries, totalExos, seanceId) {

  // ✅ Fermer overlay existant
  this._fermerRepos?.();

  // ✅ FIX BACKGROUND — Sauvegarder heure de fin
  const heureFin = Date.now() + (secondes * 1000);
  localStorage.setItem('ft_timer_fin',   heureFin.toString());
  localStorage.setItem('ft_timer_total', secondes.toString());
  localStorage.setItem('ft_timer_actif', 'true');
  localStorage.setItem('ft_timer_seance', seanceId);

  const overlay = document.createElement('div');
  overlay.id    = 'repos-auto-overlay';
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:900;
    background:rgba(9,9,45,0.97);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:24px;text-align:center;
    animation:fadeIn .3s ease`;

  const derniereSerie = serieIdx + 1 >= totalSeries;
  const dernierExo    = exoIdx + 1 >= totalExos;

  overlay.innerHTML = `
    <div style="font-size:.65rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.15em;
                color:var(--fd-mint);margin-bottom:16px">
      😴 REPOS
    </div>

    <div style="position:relative;width:200px;height:200px;
                margin-bottom:24px" id="repos-cercle-wrap">
      <svg width="200" height="200"
           style="transform:rotate(-90deg)">
        <circle cx="100" cy="100" r="88"
                fill="none"
                stroke="rgba(139,240,187,0.1)"
                stroke-width="10"/>
        <circle cx="100" cy="100" r="88"
                fill="none"
                stroke="var(--fd-mint)"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="${2 * Math.PI * 88}"
                stroke-dashoffset="0"
                id="repos-arc"
                style="transition:stroke-dashoffset 1s linear"/>
      </svg>
      <div style="position:absolute;top:50%;left:50%;
                  transform:translate(-50%,-50%)">
        <div id="repos-display"
             style="font-size:3.5rem;font-weight:800;
                    color:var(--fd-mint);
                    font-variant-numeric:tabular-nums;
                    line-height:1">
          ${this._formaterTemps(secondes)}
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:4px">secondes</div>
      </div>
    </div>

    <div style="font-size:.9rem;font-weight:700;
                color:var(--text-secondary);margin-bottom:20px">
      ${derniereSerie
        ? dernierExo
          ? '🏁 Dernier exercice terminé !'
          : '➡️ Prochain exercice'
        : `Série ${serieIdx + 2} / ${totalSeries}`}
    </div>

    ${!derniereSerie ? `
      <button onclick="LiveRapide._copierPourSuivante(
                ${exoIdx}, ${serieIdx})"
              style="padding:10px 20px;margin-bottom:16px;
                     background:rgba(75,75,249,0.15);
                     border:1px solid rgba(75,75,249,0.3);
                     border-radius:var(--radius-full);
                     font-size:.78rem;font-weight:700;
                     color:var(--fd-indigo);cursor:pointer">
        ↩️ Même poids pour S${serieIdx + 2}
      </button>` : ''}

    <div style="display:flex;gap:10px;
                width:100%;max-width:300px">
      <button onclick="LiveRapide._ajouterTemps(15)"
              style="flex:1;padding:12px;
                     background:rgba(255,255,255,0.06);
                     border:1px solid rgba(255,255,255,0.1);
                     border-radius:var(--radius-md);
                     font-size:.82rem;font-weight:700;
                     color:var(--text-secondary);cursor:pointer">
        +15s
      </button>
      <button onclick="LiveRapide._passerRepos('${seanceId}')"
              style="flex:2;padding:12px;
                     background:var(--fd-indigo);border:none;
                     border-radius:var(--radius-md);
                     font-size:.85rem;font-weight:700;
                     color:white;cursor:pointer">
        ⚡ Passer
      </button>
    </div>

    <div id="repos-countdown"
         style="display:none;margin-top:20px;
                font-size:.88rem;color:var(--text-muted)">
      Prochaine série dans
      <span id="repos-countdown-val"
            style="font-weight:800;color:var(--fd-indigo)">
        3
      </span>s
      <button onclick="LiveRapide._annulerTransition()"
              style="margin-left:8px;background:none;border:none;
                     color:var(--text-muted);font-size:.78rem;
                     cursor:pointer;text-decoration:underline">
        Attendre
      </button>
    </div>

    <!-- ✅ CONFIRMATION CHARGE PROCHAINE SÉRIE -->
${!derniereSerie ? `
  <div id="charge-confirmation"
       style="width:100%;max-width:320px;
              margin-top:16px;
              background:rgba(255,255,255,0.04);
              border:1px solid rgba(255,255,255,0.08);
              border-radius:var(--radius-lg);
              padding:14px 16px">

    <!-- Titre -->
    <div style="font-size:.6rem;font-weight:700;
                text-transform:uppercase;
                letter-spacing:.12em;
                color:var(--text-muted);
                margin-bottom:10px;
                text-align:center">
      💪 Série ${serieIdx + 2} — Même charge ?
    </div>

    <!-- Poids actuel -->
    <div style="text-align:center;margin-bottom:12px">
      <div id="charge-display"
           style="font-size:1.8rem;font-weight:800;
                  color:var(--fd-indigo);
                  line-height:1">
        ${(() => {
          const p = document.getElementById(
            `lr-poids-${exoIdx}-${serieIdx}`
          )?.value || '—';
          const r = document.getElementById(
            `lr-reps-${exoIdx}-${serieIdx}`
          )?.value || '—';
          return `${p}kg × ${r}`;
        })()}
      </div>
      <div id="charge-feedback"
           style="font-size:.72rem;margin-top:4px;
                  color:var(--fd-mint);font-weight:600">
        🟢 Même charge
      </div>
    </div>

    <!-- RPE auto-suggéré -->
    <div id="rpe-suggestion"
         style="padding:8px 12px;
                background:rgba(75,75,249,0.08);
                border:1px solid rgba(75,75,249,0.15);
                border-radius:var(--radius-md);
                margin-bottom:12px;
                font-size:.72rem;
                color:var(--text-muted);
                text-align:center">
      ${(() => {
        const repsTarget = parseInt(
  document.getElementById(
    `lr-reps-${exoIdx}-${serieIdx}`
  )?.value || '10'
) || 10;
        const repsFaites = parseInt(
          document.getElementById(
            `lr-reps-${exoIdx}-${serieIdx}`
          )?.value || '0'
        );
        const ratio = repsFaites / repsTarget;
        if (ratio >= 1.1) return '🔥 Tu gères — essaie +2.5kg !';
        if (ratio >= 0.9) return '💪 Bonne série — garde la charge';
        if (ratio >= 0.7) return '😤 C\'était dur — garde ou baisse';
        return '⚠️ Difficile — baisse de 2.5kg conseillé';
      })()}
    </div>

    <!-- Boutons charge -->
    <div style="display:flex;gap:8px">
      <button onclick="LiveRapide._changerCharge(
                ${exoIdx}, ${serieIdx}, -2.5)"
              style="flex:1;padding:10px 6px;
                     background:rgba(255,141,150,0.12);
                     border:1px solid rgba(255,141,150,0.25);
                     border-radius:var(--radius-md);
                     font-size:.78rem;font-weight:700;
                     color:var(--fd-coral);cursor:pointer">
        📉 −2.5kg
      </button>
      <button onclick="LiveRapide._garderCharge(
                ${exoIdx}, ${serieIdx})"
              style="flex:2;padding:10px 6px;
                     background:rgba(75,75,249,0.15);
                     border:1px solid rgba(75,75,249,0.3);
                     border-radius:var(--radius-md);
                     font-size:.78rem;font-weight:700;
                     color:var(--fd-indigo);cursor:pointer">
        ✅ Même charge
      </button>
      <button onclick="LiveRapide._changerCharge(
                ${exoIdx}, ${serieIdx}, 2.5)"
              style="flex:1;padding:10px 6px;
                     background:rgba(139,240,187,0.12);
                     border:1px solid rgba(139,240,187,0.25);
                     border-radius:var(--radius-md);
                     font-size:.78rem;font-weight:700;
                     color:var(--fd-mint);cursor:pointer">
        📈 +2.5kg
      </button>
    </div>
  </div>` : ''}
  
    <!-- ✅ Message retour arrière-plan -->
    <div id="repos-bg-msg"
         style="display:none;margin-top:16px;
                padding:10px 14px;
                background:rgba(139,240,187,0.1);
                border:1px solid rgba(139,240,187,0.2);
                border-radius:var(--radius-md);
                font-size:.75rem;color:var(--fd-mint);
                text-align:center">
      ✅ Repos terminé pendant que l'app était en arrière-plan !
    </div>
  `;

  document.body.appendChild(overlay);

  // ✅ State timer
  this._reposSecondes   = secondes;
  this._reposTotal      = secondes;
  this._reposActif      = true;
  this._transitionActif = false;

  // ✅ FIX — Utiliser heure absolue au lieu de décompte
  const heureDeFin = Date.now() + (secondes * 1000);

  this._reposInterval = setInterval(() => {
    if (!this._reposActif) return;

    // ✅ FIX — Calculer depuis l'heure réelle
    const resteMs  = heureDeFin - Date.now();
    const resteSec = Math.ceil(resteMs / 1000);

    // Stocker pour _ajouterTemps
    this._reposSecondes = Math.max(0, resteSec);

    // Mettre à jour display
    const disp = document.getElementById('repos-display');
    if (disp) disp.textContent =
      this._formaterTemps(Math.max(0, resteSec));

    // Mettre à jour arc
    const arc = document.getElementById('repos-arc');
    if (arc) {
      const circ = 2 * Math.PI * 88;
      const pct  = Math.max(0, resteMs / (secondes * 1000));
      arc.style.strokeDashoffset = circ * (1 - pct);
    }

    // Sons 3 dernières secondes
    if (resteSec <= 3 && resteSec > 0) {
      Utils.vibrer([30]);
      try { timerRepos?.jouerSon('bip'); } catch(e) {}
    }

    // ✅ Timer terminé
    if (resteSec <= 0) {
      clearInterval(this._reposInterval);
      localStorage.removeItem('ft_timer_actif');
      Utils.vibrer([200, 100, 200]);
      try { timerRepos?.jouerSon('rest'); } catch(e) {}
      try { SeanceGuidee.annoncerFinRepos(); } catch(e) {}

      // ✅ NOTIFICATION SYSTÈME — même téléphone verrouillé
      LiveRapide._notifierFinRepos(exoIdx, serieIdx, totalSeries);

      this._enchaînerSerieSuivante(exoIdx, serieIdx, totalSeries);
    }
  }, 500); // ✅ Rafraîchir toutes les 500ms pour plus de précision
},

// ✅ NOUVEAU — Enchaîner série suivante après repos
_enchaînerSerieSuivante(exoIdx, serieIdx, totalSeries) {
  this._fermerRepos();

  const prochaineSerieIdx = serieIdx + 1;

  if (prochaineSerieIdx < totalSeries) {
    const repsInput  = document.getElementById(
      `lr-reps-${exoIdx}-${prochaineSerieIdx}`
    );
    const repsTarget = parseInt(repsInput?.value)
      || parseInt(repsInput?.placeholder)
      || 10;

    let seanceId   = '';
    let exoRef     = '';
    let totalExos  = 1;
    let reposDuree = 75;

    try {
      const btnProchain = document.getElementById(
        `btn-serie-${exoIdx}-${prochaineSerieIdx}`
      );
      if (btnProchain) {
        const onclick = btnProchain.getAttribute('onclick');
        const match   = onclick?.match(
          /validerSerieLR\('([^']+)','([^']+)',\d+,\d+,\d+,(\d+),(\d+)\)/
        );
        if (match) {
          seanceId   = match[1];
          exoRef     = match[2];
          totalExos  = parseInt(match[3]);
          reposDuree = parseInt(match[4]);
        }
      }
    } catch(e) {}

    setTimeout(() => {
      ChronoSerie.demarrerApresRepos(
        exoIdx,
        prochaineSerieIdx,
        repsTarget,
        seanceId,
        totalSeries,
        totalExos,
        reposDuree,
        exoRef
      );
    }, 300);

  } else {
    this._scrollVersProchaineSerie();
  }
},

  // ✅ Countdown 3s avant retour auto
  _lancerCountdown(seanceId) {
    const cdEl  = document.getElementById('repos-countdown');
    const cdVal = document.getElementById('repos-countdown-val');
    if (cdEl) cdEl.style.display = 'block';

    this._transitionActif = true;
    let compte = 3;

    this._countdownInterval = setInterval(() => {
      if (!this._transitionActif) {
        clearInterval(this._countdownInterval);
        return;
      }

      compte--;
      if (cdVal) cdVal.textContent = compte;

      if (compte <= 0) {
        clearInterval(this._countdownInterval);
        this._fermerRepos();
        // Scroll vers prochaine série
        this._scrollVersProchaineSerie();
      }
    }, 1000);
  },

  _annulerTransition() {
    this._transitionActif = false;
    clearInterval(this._countdownInterval);
    const cdEl = document.getElementById('repos-countdown');
    if (cdEl) cdEl.style.display = 'none';
    Utils.toast('⏸ Reprends quand tu veux !', 'info', 1500);
  },

  _passerRepos(seanceId) {
    clearInterval(this._reposInterval);
    clearInterval(this._countdownInterval);
    this._reposActif = false;
    this._fermerRepos();
    this._scrollVersProchaineSerie();
  },

  _fermerRepos() {
    this._reposActif = false;
    const el = document.getElementById('repos-auto-overlay');
    if (el) {
      el.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  _ajouterTemps(secondes) {
  // ✅ FIX — Mettre à jour aussi l'heure dans localStorage
  const heureFin    = parseInt(
    localStorage.getItem('ft_timer_fin') || Date.now().toString()
  );
  const nouvelleFin = heureFin + (secondes * 1000);
  localStorage.setItem('ft_timer_fin', nouvelleFin.toString());

  this._reposSecondes = (this._reposSecondes || 0) + secondes;
  this._reposTotal    = Math.max(
    this._reposTotal || 0, this._reposSecondes
  );
  Utils.vibrer([20]);
  Utils.toast(`+${secondes}s ajoutées ✅`, 'success', 800);
},

  _copierPourSuivante(exoIdx, serieActuelleIdx) {
    const poidsInput = document.getElementById(
      `lr-poids-${exoIdx}-${serieActuelleIdx}`
    );
    const repsInput  = document.getElementById(
      `lr-reps-${exoIdx}-${serieActuelleIdx}`
    );
    if (poidsInput?.value) {
      this._valeurs[exoIdx] = {
        ...this.get(exoIdx),
        poids: poidsInput.value
      };
    }
    if (repsInput?.value) {
      this._valeurs[exoIdx] = {
        ...this.get(exoIdx),
        reps: repsInput.value
      };
    }
    Utils.toast('✅ Valeurs copiées pour la prochaine série !',
      'success', 1500);
  },

  _scrollVersProchaineSerie() {
    // Trouver la prochaine série non validée
    setTimeout(() => {
      const btns = document.querySelectorAll('[id^="btn-serie-"]');
      for (const btn of btns) {
        if (btn.textContent.trim() === '○') {
          btn.closest('.lr-serie-bloc')?.scrollIntoView({
            behavior: 'smooth', block: 'center'
          });
          // ✅ Highlight visuel
          const bloc = btn.closest('.lr-serie-bloc');
          if (bloc) {
            bloc.style.transition = 'all .3s';
            bloc.style.borderColor = 'var(--fd-mint)';
            bloc.style.background  =
              'rgba(139,240,187,0.08)';
            setTimeout(() => {
              bloc.style.borderColor = '';
              bloc.style.background  = '';
            }, 2000);
          }
          break;
        }
      }
    }, 300);
  },

 // ✅ Garder la même charge pour la prochaine série
  _garderCharge(exoIdx, serieIdx) {
    const poids = document.getElementById(
      `lr-poids-${exoIdx}-${serieIdx}`
    )?.value;
    const reps = document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx}`
    )?.value;

    const nextPoids = document.getElementById(
      `lr-poids-${exoIdx}-${serieIdx + 1}`
    );
    const nextReps = document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx + 1}`
    );
    if (nextPoids) nextPoids.value = poids;
    if (nextReps)  nextReps.value  = reps;

    const display  = document.getElementById('charge-display');
    const feedback = document.getElementById('charge-feedback');
    if (display)  display.style.color = 'var(--fd-mint)';
    if (feedback) {
      feedback.textContent = '✅ Confirmé !';
      feedback.style.color = 'var(--fd-mint)';
    }

    this._desactiverBoutonsCharge();
    Utils.vibrer([30]);
    Utils.toast(`✅ ${poids}kg gardé pour S${serieIdx + 2}`,
      'success', 1200);
  },

  // ✅ Changer la charge (+/- 2.5kg)
  _changerCharge(exoIdx, serieIdx, delta) {
    const poidsActuel = parseFloat(
      document.getElementById(
        `lr-poids-${exoIdx}-${serieIdx}`
      )?.value || '0'
    );
    const reps = document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx}`
    )?.value;

    const nouveauPoids = Math.max(0,
      Math.round((poidsActuel + delta) * 4) / 4
    );

    const nextPoids = document.getElementById(
      `lr-poids-${exoIdx}-${serieIdx + 1}`
    );
    const nextReps  = document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx + 1}`
    );
    if (nextPoids) nextPoids.value = nouveauPoids;
    if (nextReps)  nextReps.value  = reps;

    const display  = document.getElementById('charge-display');
    const feedback = document.getElementById('charge-feedback');

    if (display) {
      display.textContent = `${nouveauPoids}kg × ${reps}`;
      display.style.color = delta > 0
        ? 'var(--fd-lemon)'
        : 'var(--fd-coral)';
    }

    if (feedback) {
      if (delta > 0) {
        feedback.textContent = '📈 +2.5kg — On monte ! 🏆';
        feedback.style.color = 'var(--fd-lemon)';
      } else {
        feedback.textContent = '📉 −2.5kg — Sage décision 👍';
        feedback.style.color = 'var(--fd-coral)';
      }
    }

    this._desactiverBoutonsCharge();
    Utils.vibrer([30]);
    Utils.toast(
      `${delta > 0 ? '📈' : '📉'} ${nouveauPoids}kg pour S${serieIdx + 2}`,
      delta > 0 ? 'success' : 'info',
      1500
    );
  },

  // ✅ Désactiver les boutons après confirmation
  _desactiverBoutonsCharge() {
    const zone = document.getElementById('charge-confirmation');
    if (!zone) return;
    zone.querySelectorAll('button').forEach(btn => {
      btn.disabled      = true;
      btn.style.opacity = '0.4';
      btn.style.cursor  = 'default';
    });
  },

  // ✅ Notification système fin de repos
  async _notifierFinRepos(exoIdx, serieIdx, totalSeries) {
    try {
      // Demander permission si pas encore accordée
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }

      if (Notification.permission !== 'granted') return;

      // ✅ Trouver l'exercice actuel
      const exoCard = document.getElementById(`live-exo-${exoIdx}`);
      const nomExo  = exoCard
        ?.querySelector('[style*="font-size:1rem"]')
        ?.textContent?.trim()
        || 'Exercice';

      const serieNum = serieIdx + 2;

      // ✅ Envoyer la notification
      const notif = new Notification('⏱️ Repos terminé !', {
        body:    `Série ${serieNum}/${totalSeries} — ${nomExo}\nC'est reparti ! 💪`,
        icon:    '/icon-192.png',
        badge:   '/icon-192.png',
        vibrate: [200, 100, 200],
        tag:     'repos-termine',   // Remplace la notif précédente
        silent:  false,
        requireInteraction: false
      });

      // ✅ Clic sur la notif → ramène l'app au premier plan
      notif.onclick = () => {
        window.focus();
        notif.close();
      };

      // ✅ Fermer auto après 8s
      setTimeout(() => notif.close(), 8000);

    } catch(e) {
      console.warn('[LiveRapide] Notification non disponible:', e);
    }
  },
   
  _formaterTemps(sec) {
    const s = Math.max(0, Math.round(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    if (m > 0) return `${m}:${String(r).padStart(2,'0')}`;
    return String(s);
  },
   // ✅ FIX BACKGROUND — Vérifier si timer fini pendant l'absence
_verifierTimerAuRetour() {
  const actif = localStorage.getItem('ft_timer_actif');
  if (!actif) return;

  const heureFin = parseInt(
    localStorage.getItem('ft_timer_fin') || '0'
  );
  const resteMs  = heureFin - Date.now();
  const resteSec = Math.ceil(resteMs / 1000);

  // ✅ Timer déjà terminé pendant l'absence
  if (resteSec <= 0) {
    localStorage.removeItem('ft_timer_actif');
    localStorage.removeItem('ft_timer_fin');
    localStorage.removeItem('ft_timer_total');

    // ✅ Si l'overlay est toujours visible → le mettre à 0
    const disp = document.getElementById('repos-display');
    if (disp) {
      disp.textContent  = '0';
      disp.style.color  = 'var(--fd-coral)';
    }

    // ✅ Afficher message si overlay ouvert
    const bgMsg = document.getElementById('repos-bg-msg');
    if (bgMsg) bgMsg.style.display = 'block';

    // ✅ Si pas d'overlay → toast + vibration
    const overlay = document.getElementById('repos-auto-overlay');
    if (!overlay) {
      Utils.toast(
        '⏱ Repos terminé ! Prêt pour la série suivante ?',
        'success',
        5000
      );
      Utils.vibrer([200, 100, 200, 100, 200]);
      try { SeanceGuidee.annoncerFinRepos(); } catch(e) {}
    } else {
      // ✅ Lancer le countdown si overlay visible
      Utils.vibrer([200, 100, 200]);
      this._lancerCountdown(
        localStorage.getItem('ft_timer_seance') || ''
      );
    }

    return true; // Timer était fini
  }

  // ✅ Timer encore en cours → mettre à jour l'affichage
  if (resteSec > 0) {
    const disp = document.getElementById('repos-display');
    if (disp) disp.textContent = this._formaterTemps(resteSec);
    return false; // Timer encore actif
  }
},
  reset() {
  this._valeurs         = {};
  this._reposActif      = false;
  this._transitionActif = false;
  clearInterval(this._reposInterval);
  clearInterval(this._countdownInterval);

  // ✅ FIX — Nettoyer localStorage
  localStorage.removeItem('ft_timer_actif');
  localStorage.removeItem('ft_timer_fin');
  localStorage.removeItem('ft_timer_total');
  localStorage.removeItem('ft_timer_seance');

  document.getElementById('repos-auto-overlay')?.remove();
},

// ✅ Sauvegarder l'état complet en localStorage
sauvegarderEtat(seanceId) {
  try {
    const etat = {
      seanceId,
      valeurs:   this._valeurs,
      timestamp: Date.now()
    };

    // ✅ Sauvegarder les séries validées
    const seriesValidees = [];
    document.querySelectorAll('[id^="btn-serie-"]').forEach(btn => {
      if (btn.disabled) {
        const parts    = btn.id.split('-');
        const exoIdx   = parseInt(parts[2]);
        const serieIdx = parseInt(parts[3]);
        seriesValidees.push({
          exoIdx,
          serieIdx,
          texte:      btn.innerHTML,
          background: btn.style.background,
          color:      btn.style.color
        });
      }
    });
    etat.seriesValidees = seriesValidees;

    // ✅ Sauvegarder les valeurs des inputs
    const inputsValeurs = {};
    document.querySelectorAll('[id^="lr-poids-"],[id^="lr-reps-"]')
      .forEach(inp => {
        if (inp.value) inputsValeurs[inp.id] = inp.value;
      });
    etat.inputsValeurs = inputsValeurs;

    localStorage.setItem('ft_live_etat', JSON.stringify(etat));
  } catch(e) {
    console.warn('[LiveRapide] Erreur sauvegarde état:', e);
  }
},

// ✅ Restaurer l'état depuis localStorage
restaurerEtat(seanceId) {
  try {
    const saved = localStorage.getItem('ft_live_etat');
    if (!saved) return false;

    const etat = JSON.parse(saved);

    // ✅ Vérifier que c'est bien pour cette séance
    // et pas trop ancien (> 4h = abandonné)
    if (etat.seanceId !== seanceId) return false;
    if (Date.now() - etat.timestamp > 4 * 60 * 60 * 1000) {
      localStorage.removeItem('ft_live_etat');
      return false;
    }

    // ✅ Restaurer les valeurs internes
    if (etat.valeurs) {
      this._valeurs = etat.valeurs;
    }

    // ✅ Restaurer après render
    requestAnimationFrame(() => {
      // Restaurer les valeurs des inputs
      if (etat.inputsValeurs) {
        Object.entries(etat.inputsValeurs).forEach(([id, val]) => {
          const inp = document.getElementById(id);
          if (inp) inp.value = val;
        });
      }

      // Restaurer les séries validées
      if (etat.seriesValidees) {
        etat.seriesValidees.forEach(s => {
          const btn = document.getElementById(
            `btn-serie-${s.exoIdx}-${s.serieIdx}`
          );
          if (btn) {
            btn.innerHTML         = s.texte;
            btn.style.background  = s.background || 'rgba(139,240,187,0.2)';
            btn.style.border      = '2px solid var(--fd-mint)';
            btn.style.color       = s.color || 'var(--fd-mint)';
            btn.style.boxShadow   = 'none';
            btn.disabled          = true;
            btn.style.cursor      = 'default';
          }
        });
      }

      // ✅ Toast discret
      if (etat.seriesValidees?.length > 0) {
        Utils.toast(
          `↩️ ${etat.seriesValidees.length} série${etat.seriesValidees.length > 1 ? 's' : ''} restaurée${etat.seriesValidees.length > 1 ? 's' : ''} !`,
          'success', 2500
        );
        // Mettre à jour la sticky bar
        setTimeout(() => {
          try { LiveStickyBar.mettreAJourProgression(); } catch(e) {}
        }, 500);
      }
    });

    return true;
  } catch(e) {
    console.warn('[LiveRapide] Erreur restauration état:', e);
    return false;
  }
}
};

// ════════════════════════════════════════════════════════════
// ✅ BARRE STICKY LIVE — Chrono + Progression
// ════════════════════════════════════════════════════════════
const LiveStickyBar = {

  _interval:    null,
  _seance:      null,
  _totalSeries: 0,
  _seriesFaites: 0,

  init(seance) {
    this._seance = seance;

    // ✅ Calculer total séries
    try {
      this._totalSeries = (seance.exercicesDetails || [])
        .reduce((a, ex) => a + (ex.series || 0), 0);
    } catch(e) { this._totalSeries = 0; }

    this._seriesFaites = 0;

    // ✅ Créer la barre si pas déjà là
    let bar = document.getElementById('live-sticky-bar');
    if (!bar) {
      bar    = document.createElement('div');
      bar.id = 'live-sticky-bar';
      bar.style.cssText = `
        position:fixed;top:var(--header-height);
        left:50%;transform:translateX(-50%);
        width:100%;max-width:480px;
        z-index:250;
        background:rgba(9,9,45,0.97);
        backdrop-filter:blur(12px);
        border-bottom:1px solid rgba(75,75,249,0.3);
        padding:8px 16px;
        display:flex;flex-direction:column;gap:6px;
        box-shadow:0 4px 20px rgba(0,0,0,0.4);
        transition:all .3s`;
      document.body.appendChild(bar);
    }

    this._render();
    this._lancerUpdate();
  },

  // ✅ Mettre à jour séries faites
  mettreAJourProgression() {
    const btns = document.querySelectorAll('[id^="btn-serie-"]');
    let faites = 0;
    btns.forEach(btn => {
      if (btn.disabled) faites++;
    });
    this._seriesFaites = faites;

    // Calculer exo actuel
    const exos = document.querySelectorAll('.live-exo-card');
    let exoActuel = 0;
    exos.forEach((exo, idx) => {
      const btnsExo = exo.querySelectorAll('[id^="btn-serie-"]');
      const tousFaits = [...btnsExo].every(b => b.disabled);
      if (tousFaits && idx < exos.length - 1) exoActuel = idx + 1;
    });

    this._exoActuel   = exoActuel;
    this._totalExos   = exos.length;
    this._render();
  },

  _render() {
    const bar = document.getElementById('live-sticky-bar');
    if (!bar) return;

    const pct   = this._totalSeries > 0
      ? Math.round((this._seriesFaites / this._totalSeries) * 100)
      : 0;

    const exoActuel  = (this._exoActuel  || 0) + 1;
    const totalExos  = this._totalExos   || 0;

    // Temps chrono
    let temps = '00:00';
    try {
      if (Chrono?._actif) {
        temps = Chrono.formaterDuree(Chrono.getDureeSecondes());
      }
    } catch(e) {}

    const enPause = Chrono?._enPause || false;

    bar.innerHTML = `

      <!-- Ligne 1 : Chrono + Nom + Pause -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between">

        <!-- Chrono -->
        <div style="display:flex;align-items:center;gap:8px">
          <div style="font-size:1.1rem;font-weight:800;
                      color:${enPause
                        ? 'var(--fd-coral)'
                        : 'var(--fd-mint)'};
                      font-variant-numeric:tabular-nums;
                      letter-spacing:.02em">
            ${enPause ? '⏸' : '⏱️'} ${temps}
          </div>
        </div>

        <!-- Nom séance -->
        <div style="font-size:.65rem;font-weight:700;
                    color:var(--text-muted);
                    text-align:center;flex:1;
                    padding:0 8px;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap">
          ${this._seance?.emoji || ''} ${this._seance?.nom || ''}
        </div>

        <!-- Bouton pause -->
        <button onclick="ChronoSticky._togglePause();
                         LiveStickyBar._render()"
                style="padding:4px 10px;
                       background:${enPause
                         ? 'rgba(139,240,187,0.15)'
                         : 'rgba(255,255,255,0.06)'};
                       border:1px solid ${enPause
                         ? 'rgba(139,240,187,0.3)'
                         : 'rgba(255,255,255,0.1)'};
                       border-radius:var(--radius-full);
                       font-size:.65rem;font-weight:700;
                       color:${enPause
                         ? 'var(--fd-mint)'
                         : 'var(--text-muted)'};
                       cursor:pointer;white-space:nowrap">
          ${enPause ? '▶ Reprendre' : '⏸ Pause'}
        </button>
      </div>

      <!-- Ligne 2 : Barre progression + détail -->
      <div>
        <!-- Barre -->
        <div style="height:5px;background:rgba(255,255,255,0.07);
                    border-radius:99px;overflow:hidden;
                    margin-bottom:4px">
          <div style="height:100%;width:${pct}%;
                      background:linear-gradient(90deg,
                        var(--fd-indigo),var(--fd-mint));
                      border-radius:99px;
                      transition:width .5s ease">
          </div>
        </div>

        <!-- Détail texte -->
        <div style="display:flex;justify-content:space-between;
                    align-items:center">
          <div style="font-size:.6rem;color:var(--text-muted)">
            ${totalExos > 0
              ? `Exo ${Math.min(exoActuel, totalExos)}/${totalExos}`
              : 'Démarrer la séance'}
            ${this._seriesFaites > 0
              ? ` · ${this._seriesFaites} série${this._seriesFaites > 1 ? 's' : ''} faite${this._seriesFaites > 1 ? 's' : ''}`
              : ''}
          </div>
          <div style="font-size:.6rem;font-weight:700;
                      color:var(--fd-indigo)">
            ${this._seriesFaites}/${this._totalSeries} séries
            · ${pct}%
          </div>
        </div>
      </div>
    `;
  },

  _lancerUpdate() {
    clearInterval(this._interval);
    this._interval = setInterval(() => {
      const bar = document.getElementById('live-sticky-bar');
      if (!bar) { clearInterval(this._interval); return; }
      this._render();
    }, 1000);
  },

  masquer() {
    clearInterval(this._interval);
    const bar = document.getElementById('live-sticky-bar');
    if (bar) {
      bar.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => bar.remove(), 300);
    }
  }
};

// ════════════════════════════════════════════════════════════
// ✅ CHRONO SÉRIE — Overlay plein écran (comme repos)
// ════════════════════════════════════════════════════════════
const ChronoSerie = {

  _interval:   null,
  _exoIdx:     null,
  _serieIdx:   null,
  _actif:      false,

  // ✅ Calcul durée selon reps (2.5s/rep)
  _calculerDuree(reps) {
    const r = parseInt(reps) || 10;
    return Math.min(60, Math.max(15, Math.round(r * 2.5)));
  },

  // ✅ Démarrer le chrono SÉRIE — overlay plein écran
  demarrer(exoIdx, serieIdx, repsTarget, seanceId, totalSeries, totalExos, reposDuree, exoRef) {
    this.stopper();

    this._exoIdx   = exoIdx;
    this._serieIdx = serieIdx;
    this._actif    = true;

    const duree    = this._calculerDuree(repsTarget);
    const heureFin = Date.now() + (duree * 1000);
    const circ     = 2 * Math.PI * 88;

    // ✅ Masquer le bouton "Commencer" de cet exercice
    const btnCommencer = document.getElementById(`btn-commencer-${exoIdx}`);
    if (btnCommencer) btnCommencer.style.display = 'none';

    // ✅ Récupérer infos exercice
    const exoCard = document.getElementById(`live-exo-${exoIdx}`);
    const nomExo  = exoCard?.querySelector('[style*="font-size:1rem"]')
      ?.textContent?.trim() || 'Exercice';

    const poids = document.getElementById(`lr-poids-${exoIdx}-${serieIdx}`)?.value || '—';
    const reps  = document.getElementById(`lr-reps-${exoIdx}-${serieIdx}`)?.value || repsTarget;

    // ✅ Créer l'overlay plein écran
    const overlay = document.createElement('div');
    overlay.id    = 'serie-overlay';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:900;
      background:rgba(9,9,45,0.97);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      padding:24px;text-align:center;
      animation:fadeIn .3s ease`;

    overlay.innerHTML = `

      <!-- Badge SÉRIE EN COURS -->
      <div style="font-size:.65rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.15em;
                  color:var(--fd-lemon);margin-bottom:8px">
        💪 SÉRIE EN COURS
      </div>

      <!-- Nom exercice -->
      <div style="font-size:.95rem;font-weight:700;
                  color:var(--text-muted);margin-bottom:6px">
        ${nomExo}
      </div>

      <!-- Info série -->
      <div style="font-size:.82rem;font-weight:700;
                  color:var(--text-secondary);margin-bottom:20px">
        Série ${serieIdx + 1} / ${totalSeries}
      </div>

      <!-- Cercle SVG (comme repos) -->
      <div style="position:relative;width:200px;height:200px;
                  margin-bottom:20px">
        <svg width="200" height="200"
             style="transform:rotate(-90deg)">
          <circle cx="100" cy="100" r="88"
                  fill="none"
                  stroke="rgba(249,239,119,0.1)"
                  stroke-width="10"/>
          <circle cx="100" cy="100" r="88"
                  fill="none"
                  stroke="var(--fd-lemon)"
                  stroke-width="10"
                  stroke-linecap="round"
                  stroke-dasharray="${circ}"
                  stroke-dashoffset="0"
                  id="serie-arc"
                  style="transition:stroke-dashoffset .5s linear"/>
        </svg>
        <div style="position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%)">
          <div id="serie-display"
               style="font-size:3.5rem;font-weight:800;
                      color:var(--fd-lemon);
                      font-variant-numeric:tabular-nums;
                      line-height:1">
            ${duree}
          </div>
          <div style="font-size:.65rem;color:var(--text-muted);
                      margin-top:4px">secondes</div>
        </div>
      </div>

      <!-- Charge -->
      <div style="margin-bottom:20px;
                  background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:14px 24px;text-align:center">
        <div id="serie-charge-display"
             style="font-size:2rem;font-weight:800;
                    color:var(--fd-indigo);line-height:1">
          ${poids}kg × ${reps}
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-top:4px">Charge prévue</div>
      </div>

      <!-- Boutons -->
      <div style="display:flex;gap:10px;
                  width:100%;max-width:300px">
        <button onclick="ChronoSerie._terminerManuellement(
                  '${seanceId}','${exoRef}',
                  ${exoIdx},${serieIdx},
                  ${totalSeries},${totalExos},
                  ${reposDuree})"
                style="flex:2;padding:16px;
                       background:var(--fd-indigo);border:none;
                       border-radius:var(--radius-md);
                       font-size:.95rem;font-weight:800;
                       color:white;cursor:pointer;
                       box-shadow:0 4px 20px rgba(75,75,249,0.4)">
          ✅ Série terminée !
        </button>
      </div>

      <!-- Modifier charge pendant la série -->
      <div style="margin-top:16px;
                  width:100%;max-width:300px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.08em;
                    color:var(--text-muted);margin-bottom:8px;
                    text-align:center">
          Modifier la charge
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button onclick="ChronoSerie._modifierCharge(${exoIdx},${serieIdx},-2.5)"
                  style="flex:1;padding:10px;
                         background:rgba(255,141,150,0.12);
                         border:2px solid rgba(255,141,150,0.3);
                         border-radius:var(--radius-md);
                         font-size:.85rem;font-weight:800;
                         color:var(--fd-coral);cursor:pointer">
            −2.5
          </button>
          <div id="serie-poids-display"
               style="flex:2;text-align:center;
                      font-size:1.2rem;font-weight:800;
                      color:var(--fd-indigo)">
            ${poids}kg
          </div>
          <button onclick="ChronoSerie._modifierCharge(${exoIdx},${serieIdx},2.5)"
                  style="flex:1;padding:10px;
                         background:rgba(139,240,187,0.12);
                         border:2px solid rgba(139,240,187,0.3);
                         border-radius:var(--radius-md);
                         font-size:.85rem;font-weight:800;
                         color:var(--fd-mint);cursor:pointer">
            +2.5
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    Utils.vibrer([30]);

    // ✅ Lancer le décompte
    this._interval = setInterval(() => {
      const resteMs  = heureFin - Date.now();
      const resteSec = Math.ceil(resteMs / 1000);
      const reste    = Math.max(0, resteSec);

      const disp = document.getElementById('serie-display');
      const arc  = document.getElementById('serie-arc');

      if (disp) disp.textContent = reste;

      if (arc) {
        const pct = Math.max(0, resteMs / (duree * 1000));
        arc.style.strokeDashoffset = circ * (1 - pct);
        // Changer couleur selon urgence
        arc.style.stroke = reste <= 5
          ? 'var(--fd-coral)'
          : reste <= 10
            ? 'var(--fd-lemon)'
            : 'var(--fd-lemon)';
      }

      // 3 dernières secondes → vibration
      if (reste <= 3 && reste > 0) Utils.vibrer([20]);

      // ✅ Temps écoulé → terminer automatiquement
      if (reste <= 0) {
        this.stopper();
        this._onTempsEcoule(seanceId, exoRef, exoIdx, serieIdx, totalSeries, totalExos, reposDuree);
      }
    }, 250);
  },

  // ✅ Temps écoulé — valider auto et lancer repos
  _onTempsEcoule(seanceId, exoRef, exoIdx, serieIdx, totalSeries, totalExos, reposDuree) {
    Utils.vibrer([200, 100, 200]);
    Utils.toast('⏱️ Temps écoulé !', 'info', 1500);

    // ✅ Fermer l'overlay série
    this._fermerOverlay();

    // ✅ Valider la série automatiquement
    App.validerSerieLR(seanceId, exoRef, exoIdx, serieIdx, totalSeries, totalExos, reposDuree);
  },

  // ✅ Bouton "Série terminée !" — valider manuellement
  _terminerManuellement(seanceId, exoRef, exoIdx, serieIdx, totalSeries, totalExos, reposDuree) {
    this.stopper();
    this._fermerOverlay();
    if (typeof App !== 'undefined' && App.validerSerieLR) {
    App.validerSerieLR(seanceId, exoRef, exoIdx, serieIdx, totalSeries, totalExos, reposDuree);
  }
},

  // ✅ Modifier charge pendant la série
  _modifierCharge(exoIdx, serieIdx, delta) {
    const inp = document.getElementById(`lr-poids-${exoIdx}-${serieIdx}`);
    if (!inp) return;

    const actuel  = parseFloat(inp.value) || 0;
    const nouveau = Math.max(0, Math.round((actuel + delta) * 4) / 4);
    inp.value     = nouveau;

    // Mettre à jour l'affichage dans l'overlay
    const display      = document.getElementById('serie-charge-display');
    const poidsDisplay = document.getElementById('serie-poids-display');
    const repsInp      = document.getElementById(`lr-reps-${exoIdx}-${serieIdx}`);
    const reps         = repsInp?.value || '—';

    if (display)      display.textContent      = `${nouveau}kg × ${reps}`;
    if (poidsDisplay) poidsDisplay.textContent = `${nouveau}kg`;

    // Feedback couleur
    if (display) {
      display.style.color = delta > 0
        ? 'var(--fd-mint)'
        : 'var(--fd-coral)';
      setTimeout(() => {
        if (display) display.style.color = 'var(--fd-indigo)';
      }, 500);
    }

    Utils.vibrer([10]);
  },

  // ✅ Fermer l'overlay série
  _fermerOverlay() {
    const el = document.getElementById('serie-overlay');
    if (el) {
      el.style.animation = 'fadeOut .3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }
  },

  // ✅ Démarrer après repos (appelé depuis _enchaînerSerieSuivante)
  demarrerApresRepos(exoIdx, serieIdx, repsTarget, seanceId, totalSeries, totalExos, reposDuree, exoRef) {
    this.demarrer(exoIdx, serieIdx, repsTarget, seanceId, totalSeries, totalExos, reposDuree, exoRef);
  },

  stopper() {
    clearInterval(this._interval);
    this._interval = null;
    this._actif    = false;
  },

  reset() {
    this.stopper();
    this._exoIdx  = null;
    this._serieIdx = null;
    this._fermerOverlay();
  }
};

window.ChronoSerie = ChronoSerie;
window.LiveStickyBar = LiveStickyBar;

// ════════════════════════════════════════════════════════════
// ✅ CHECKLIST PRÉ-SÉANCE
// ════════════════════════════════════════════════════════════
function _rendreChecklistPreSeance(container, options, seanceId) {
  if (!seanceId) {
    _rendreLive(container, options);
    return;
  }

  let seanceComplete = null;
  try {
    seanceComplete = Programme.getSeanceComplete(seanceId);
  } catch(e) {}

  if (!seanceComplete) {
    _rendreLive(container, options);
    return;
  }

  const exos        = seanceComplete.exercicesDetails || [];
  const skipChecklist = Utils.storage.get('ft_skip_checklist', false);

  // ✅ Récupérer état des cases cochées
  const cleVus = `ft_checklist_vus_${seanceId}`;
  let exosVus  = Utils.storage.get(cleVus, []);

  container.innerHTML = `

    <!-- Header séance -->
    <div style="background:linear-gradient(135deg,
                rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                border:1px solid rgba(75,75,249,0.35);
                border-radius:var(--radius-xl);
                padding:20px;margin-bottom:16px;
                position:relative;overflow:hidden">

      <div style="position:absolute;top:-40px;right:-30px;
                  width:160px;height:160px;
                  background:radial-gradient(circle,
                    rgba(75,75,249,0.2) 0%,transparent 70%);
                  pointer-events:none"></div>

      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.15em;
                  color:var(--fd-indigo);margin-bottom:8px;
                  display:flex;align-items:center;gap:6px">
        <div style="width:6px;height:6px;border-radius:50%;
                    background:var(--fd-indigo);
                    box-shadow:0 0 8px var(--fd-indigo);
                    animation:pulse 2s infinite"></div>
        Checklist pré-séance
      </div>

      <div style="font-size:1.4rem;font-weight:800;
                  margin-bottom:4px">
        ${seanceComplete.emoji} ${seanceComplete.nom}
      </div>

      <div style="font-size:.75rem;color:var(--text-muted);
                  margin-bottom:14px">
        ~${seanceComplete.duree_estimee}min
        · ${exos.length} exercices
        · Vérifie avant de commencer !
      </div>

      <!-- Barre de progression exercices vus -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  margin-bottom:6px">
        <div style="font-size:.65rem;color:var(--text-muted)">
          Exercices consultés
        </div>
        <div id="checklist-compteur"
             style="font-size:.72rem;font-weight:700;
                    color:var(--fd-indigo)">
          ${exosVus.length}/${exos.length}
        </div>
      </div>
      <div style="height:6px;background:rgba(255,255,255,0.06);
                  border-radius:99px;overflow:hidden;
                  margin-bottom:0">
        <div id="checklist-progress-bar"
             style="height:100%;
                    width:${Math.round((exosVus.length/Math.max(exos.length,1))*100)}%;
                    background:linear-gradient(90deg,
                      var(--fd-indigo),var(--fd-mint));
                    border-radius:99px;
                    transition:width .5s ease">
        </div>
      </div>
    </div>

    <!-- Muscles ciblés -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;
                margin-bottom:16px">
      ${(seanceComplete.muscles || []).map(m => `
        <span style="padding:4px 12px;
                     background:rgba(75,75,249,0.15);
                     border:1px solid rgba(75,75,249,0.25);
                     border-radius:99px;font-size:.65rem;
                     font-weight:700;color:var(--fd-lavender)">
          ${m}
        </span>`).join('')}
    </div>

    <!-- Liste exercices checklist -->
    <div style="display:flex;flex-direction:column;gap:8px;
                margin-bottom:20px"
         id="checklist-exos-list">

      ${exos.map((ex, idx) => {
        const exoData = ex.details || {};
        const estVu   = exosVus.includes(idx);

        return `
          <div id="checklist-item-${idx}"
               style="background:${estVu
                 ? 'rgba(139,240,187,0.07)'
                 : 'rgba(255,255,255,0.04)'};
                      border:1px solid ${estVu
                 ? 'rgba(139,240,187,0.25)'
                 : 'rgba(255,255,255,0.08)'};
                      border-radius:var(--radius-lg);
                      padding:14px;
                      transition:all .25s">

            <!-- Ligne principale -->
            <div style="display:flex;align-items:center;gap:12px">

              <!-- Checkbox -->
              <div onclick="_checklistToggle(${idx}, '${seanceId}', ${exos.length})"
                   style="width:28px;height:28px;border-radius:50%;
                          flex-shrink:0;cursor:pointer;
                          background:${estVu
                            ? 'var(--fd-mint)'
                            : 'rgba(255,255,255,0.06)'};
                          border:2px solid ${estVu
                            ? 'var(--fd-mint)'
                            : 'rgba(255,255,255,0.2)'};
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.85rem;
                          transition:all .2s">
                ${estVu ? '✓' : ''}
              </div>

              <!-- Emoji + Nom + Muscle -->
              <div style="flex:1;min-width:0">
                <div style="font-size:.9rem;font-weight:700;
                            color:${estVu
                              ? 'var(--fd-mint)'
                              : 'var(--text-primary)'};
                            overflow:hidden;
                            text-overflow:ellipsis;
                            white-space:nowrap;
                            transition:color .2s">
                  ${exoData.emoji || '💪'}
                  ${exoData.nom || ex.ref}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted);
                            margin-top:2px">
                  ${exoData.muscle || ''}
                  · ${ex.series}×${ex.reps}
                  · ⏱ ${ex.repos || 60}s
                </div>
              </div>

              <!-- Difficulté dots -->
              <div style="display:flex;gap:3px;flex-shrink:0;
                          align-items:center">
                ${[1,2,3,4,5].map(d => `
                  <div style="width:6px;height:6px;border-radius:50%;
                              background:${d <= (exoData.difficulte || 1)
                                ? 'var(--fd-lemon)'
                                : 'rgba(255,255,255,0.1)'}">
                  </div>`).join('')}
              </div>

              <!-- Bouton Démo YouTube -->
              ${exoData.youtube ? `
                <button onclick="VideoDemo.ouvrir(
                          '${exoData.youtube}',
                          '${(exoData.nom||ex.ref).replace(/'/g,"\\'")}',
                          '${exoData.muscle||''}'
                        );_checklistToggle(${idx},'${seanceId}',${exos.length})"
                        style="flex-shrink:0;
                               display:flex;align-items:center;
                               gap:4px;padding:6px 10px;
                               background:rgba(255,0,0,0.12);
                               border:1px solid rgba(255,0,0,0.25);
                               border-radius:var(--radius-full);
                               font-size:.65rem;font-weight:700;
                               color:#ff4444;cursor:pointer;
                               white-space:nowrap">
                  ▶ Démo
                </button>` : `
                <div style="width:10px;flex-shrink:0"></div>`}
            </div>

            <!-- Conseils (dépliables) -->
            ${exoData.conseils?.length ? `
              <details style="margin-top:10px">
                <summary style="font-size:.65rem;
                                color:var(--text-muted);
                                cursor:pointer;
                                list-style:none;
                                display:flex;
                                align-items:center;gap:5px">
                  <span style="color:var(--fd-indigo)">▸</span>
                  💡 Conseils techniques
                </summary>
                <div style="margin-top:8px;padding:8px 10px;
                            background:rgba(75,75,249,0.06);
                            border-radius:var(--radius-sm);
                            border-left:2px solid rgba(75,75,249,0.3)">
                  ${exoData.conseils.map(c => `
                    <div style="font-size:.72rem;
                                color:var(--text-secondary);
                                padding:2px 0;
                                display:flex;gap:6px">
                      <span style="color:var(--fd-indigo);
                                   flex-shrink:0">•</span>
                      ${c}
                    </div>`).join('')}
                </div>
              </details>` : ''}
          </div>`;
      }).join('')}
    </div>

    <!-- Option "Ne plus afficher" -->
    <div style="display:flex;align-items:center;gap:10px;
                padding:12px 14px;
                background:rgba(255,255,255,0.03);
                border:1px solid rgba(255,255,255,0.07);
                border-radius:var(--radius-md);
                margin-bottom:16px;cursor:pointer"
         onclick="_checklistToggleSkip(this)">
      <div id="skip-toggle"
           style="width:20px;height:20px;border-radius:5px;
                  flex-shrink:0;
                  background:${skipChecklist
                    ? 'var(--fd-indigo)'
                    : 'rgba(255,255,255,0.08)'};
                  border:2px solid ${skipChecklist
                    ? 'var(--fd-indigo)'
                    : 'rgba(255,255,255,0.2)'};
                  display:flex;align-items:center;
                  justify-content:center;
                  font-size:.7rem;color:white;
                  transition:all .2s">
        ${skipChecklist ? '✓' : ''}
      </div>
      <div>
        <div style="font-size:.78rem;font-weight:600;
                    color:var(--text-primary)">
          Passer la checklist à l'avenir
        </div>
        <div style="font-size:.62rem;color:var(--text-muted)">
          Tu pourras la réactiver dans Paramètres
        </div>
      </div>
    </div>

    <!-- Boutons action -->
    <div style="display:grid;grid-template-columns:1fr 2fr;
                gap:10px;padding-bottom:8px">
      <button onclick="naviguer('training')"
              class="btn-secondary"
              style="font-size:.82rem">
        ← Retour
      </button>
      <button id="btn-demarrer-seance"
              onclick="_lancerSeanceDepuisChecklist(
                '${seanceId}',
                ${JSON.stringify(options).replace(/'/g,"\\'")}
              )"
              class="btn-primary"
              style="font-size:.92rem;
                     box-shadow:0 4px 20px
                       rgba(75,75,249,0.4)">
        ${exosVus.length >= exos.length
          ? '🚀 Démarrer !'
          : '▶ Démarrer quand même'}
      </button>
    </div>
  `;
}

// ════════════════════════════════════════════════════════════
// ✅ HELPERS CHECKLIST
// ════════════════════════════════════════════════════════════

// ✅ Toggle un exercice comme "vu"
function _checklistToggle(idx, seanceId, totalExos) {
  const cleVus = `ft_checklist_vus_${seanceId}`;
  let exosVus  = Utils.storage.get(cleVus, []);

  if (exosVus.includes(idx)) {
    exosVus = exosVus.filter(i => i !== idx);
  } else {
    exosVus.push(idx);
  }

  Utils.storage.set(cleVus, exosVus);

  // ✅ Mettre à jour l'item visuellement
  const item = document.getElementById(`checklist-item-${idx}`);
  if (item) {
    const estVu = exosVus.includes(idx);

    item.style.background   = estVu
      ? 'rgba(139,240,187,0.07)'
      : 'rgba(255,255,255,0.04)';
    item.style.borderColor  = estVu
      ? 'rgba(139,240,187,0.25)'
      : 'rgba(255,255,255,0.08)';

    // Checkbox
    const checkbox = item.querySelector(
      '[onclick^="_checklistToggle"]'
    );
    if (checkbox) {
      checkbox.textContent  = estVu ? '✓' : '';
      checkbox.style.background  = estVu
        ? 'var(--fd-mint)'
        : 'rgba(255,255,255,0.06)';
      checkbox.style.borderColor = estVu
        ? 'var(--fd-mint)'
        : 'rgba(255,255,255,0.2)';
    }

    // Nom texte
    const nomEl = item.querySelector(
      '[style*="font-size:.9rem"]'
    );
    if (nomEl) nomEl.style.color = estVu
      ? 'var(--fd-mint)'
      : 'var(--text-primary)';
  }

  // ✅ Mettre à jour compteur + barre
  const compteur = document.getElementById('checklist-compteur');
  const barre    = document.getElementById('checklist-progress-bar');
  const btnStart = document.getElementById('btn-demarrer-seance');

  if (compteur) compteur.textContent = `${exosVus.length}/${totalExos}`;
  if (barre) barre.style.width =
    `${Math.round((exosVus.length / Math.max(totalExos, 1)) * 100)}%`;

  if (btnStart) {
    btnStart.textContent = exosVus.length >= totalExos
      ? '🚀 Démarrer !'
      : '▶ Démarrer quand même';
  }

  // ✅ Vibration légère
  Utils.vibrer();
}

// ✅ Toggle option "ne plus afficher"
function _checklistToggleSkip(container) {
  const actuel = Utils.storage.get('ft_skip_checklist', false);
  const nouveau = !actuel;
  Utils.storage.set('ft_skip_checklist', nouveau);

  const toggle = document.getElementById('skip-toggle');
  if (toggle) {
    toggle.textContent    = nouveau ? '✓' : '';
    toggle.style.background  = nouveau
      ? 'var(--fd-indigo)'
      : 'rgba(255,255,255,0.08)';
    toggle.style.borderColor = nouveau
      ? 'var(--fd-indigo)'
      : 'rgba(255,255,255,0.2)';
  }

  Utils.toast(
    nouveau
      ? 'Checklist désactivée — tu peux la réactiver dans Paramètres'
      : '✅ Checklist réactivée',
    'info',
    2500
  );
}

// ✅ Lancer la séance depuis la checklist
function _lancerSeanceDepuisChecklist(seanceId, options = {}) {
  // Nettoyer les exercices vus (reset pour la prochaine fois)
  Utils.storage.remove(`ft_checklist_vus_${seanceId}`);

  // Lancer le live directement
  const container = document.getElementById('page-live')
    || document.getElementById(`page-${window._pageActive}`);

  if (container) {
    _rendreLive(container, { ...options, seanceId });
  }
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

  // ✅ NE PAS démarrer auto — l'utilisateur démarre manuellement
// Tracker.demarrerSeance() sera appelé au premier clic "SÉRIE FAITE"

  container.innerHTML = `
    <div id="live-content">
      ${_renderLiveHeader(seanceComplete)}
      ${_renderWarmup(seanceComplete, seanceId)}
      ${_renderExercicesLive(seanceComplete, seanceId)}
      ${_renderEtirements(seanceComplete)}
    </div>`;
}

// ✅ Toggle mode guidé
function _toggleModeGuide(seanceId) {
  try {
    if (SeanceGuidee._actif) {
      SeanceGuidee.arreter();
      Utils.toast('🔇 Mode guidé désactivé', 'info', 1500);
    } else {
      // ✅ Récupérer les exercices depuis window
      // au lieu du JSON inline (évite les erreurs de parsing)
      const exercices = window._liveExercices?.[seanceId] || [];
      SeanceGuidee.demarrer(seanceId, exercices);
      Utils.toast('🎙️ Mode guidé activé !', 'success', 1500);
    }
  } catch(e) {
    console.error('[App] Erreur mode guidé:', e);
    Utils.toast('❌ Erreur mode guidé', 'error');
  }
}

function _renderLiveHeader(seance) {
  let charge = null;
  try { charge = Predict.analyserFatigue(); } catch(e) {}

  // ✅ Créer la barre sticky si pas encore là
  setTimeout(() => {
  LiveStickyBar.init(seance);
}, 100);

// ✅ Stocker les exercices pour le mode guidé
window._liveExercices = window._liveExercices || {};
window._liveExercices[seance.id] = seance.exercices || [];

  return `
    <div class="card mb-md"
         style="background:linear-gradient(135deg,
                rgba(75,75,249,0.15),rgba(139,240,187,0.05));
                border-color:var(--fd-indigo)">
      <div class="flex justify-between items-center">
        <div>
          <div style="font-size:1.2rem;font-weight:800">
            ${seance.emoji} ${seance.nom}
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);margin-top:2px">
            ~${seance.duree_estimee}min
            · ${seance.exercices?.length || 0} exos
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
          <div id="chrono-container"></div>
          <button id="btn-demarrer-chrono"
                  onclick="App._demarrerSeanceManuellement('${seance.id}')"
                  style="display:flex;align-items:center;gap:6px;
                         padding:8px 14px;background:var(--fd-mint);
                         border:none;border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:800;
                         color:#09092d;cursor:pointer;
                         box-shadow:0 4px 16px rgba(139,240,187,0.4);
                         margin-top:4px;transition:all .2s"
                  onmousedown="this.style.transform='scale(.95)'"
                  onmouseup="this.style.transform=''">
            ▶ Démarrer le chrono
          </button>
          <button id="btn-mode-guide"
        onclick="_toggleModeGuide('${seance.id}')"
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
             <button onclick="_lancerModeUltra('${seance.id}')"
        style="display:flex;align-items:center;gap:4px;
               padding:5px 10px;
               background:rgba(249,239,119,0.12);
               border:1px solid rgba(249,239,119,0.25);
               border-radius:var(--radius-full);
               font-size:.68rem;font-weight:700;
               color:var(--fd-lemon);cursor:pointer;
               margin-top:4px">
  ⚡ Mode Ultra
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
  const supersets = seance.supersets        || [];

  // ✅ Init WakeLock au démarrage de la séance
  setTimeout(() => {
  try { LiveRapide.activerWakeLock(); } catch(e) {}

  // ✅ Essayer de restaurer un état précédent
  const restaure = LiveRapide.restaurerEtat(seanceId);
  if (!restaure) {
    // Pas d'état sauvegardé → reset normal
    LiveRapide.reset();
  }
  // ✅ Réinitialiser ChronoSerie
  try { ChronoSerie.reset(); } catch(e) {}
}, 300);

  return `
    <div class="card mb-md">
      <div class="flex justify-between items-center mb-md">
        <div class="card-label">
          🏋️ ${exos.length} exercices
        </div>
        ${supersets.length > 0 ? `
          <span class="chip chip-lavender" style="font-size:.65rem">
            ⚡ ${supersets.length} superset${supersets.length > 1 ? 's' : ''}
          </span>` : ''}
      </div>

      ${exos.map((ex, exoIdx) => {
        const exo        = ex.details || {};
        const pr         = _getPRExo(ex.ref);
        const chargeReco = _getChargeReco(ex.ref);
        const youtubeId  = exo.youtube || null;

        // ✅ Valeurs par défaut intelligentes
        const poidsDefaut = chargeReco?.charge
          || pr?.poids
          || '';
        const repsDefaut = ex.reps?.split('-')[0]
          || ex.reps
          || '';

        return `
          <div class="live-exo-card"
               id="live-exo-${exoIdx}"
               style="padding:16px;
                      background:var(--bg-input);
                      border-radius:var(--radius-lg);
                      margin-bottom:12px;
                      border:1px solid var(--border-color)">

            <!-- ✅ HEADER EXERCICE -->
            <div style="display:flex;justify-content:space-between;
                        align-items:flex-start;margin-bottom:12px">
              <div style="flex:1">
                <div style="font-weight:700;font-size:1rem">
                  ${exo.emoji || '💪'} ${exo.nom || ex.ref}
                </div>
                <div style="font-size:.68rem;color:var(--fd-mint);
                            margin-top:2px">
                  ${exo.muscle || ''}
                </div>
                <div style="font-size:.65rem;color:var(--text-muted);
                            margin-top:3px">
                  ${ex.series} séries × ${ex.reps} reps
                  · repos ${ex.repos || 60}s
                </div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                ${pr ? `
                  <div style="font-size:.72rem;
                              color:var(--fd-lemon);
                              font-weight:700">
                    🏆 PR ${pr.poids}kg×${pr.reps}
                  </div>` : ''}
                ${chargeReco ? `
                  <div style="font-size:.65rem;
                              color:var(--fd-indigo)">
                    💡 Reco ${chargeReco.charge}kg
                  </div>` : ''}
              </div>
            </div>

            <!-- ✅ BOUTONS DÉMO + CALCULATEUR -->
            <div style="display:flex;gap:6px;margin-bottom:14px;
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
                  ▶ Démo
                </button>` : ''}
              <button onclick="Calculateur.renderCalculateur(
                        '${ex.ref}',${exoIdx})"
                      style="display:flex;align-items:center;
                             gap:4px;padding:5px 10px;
                             background:rgba(75,75,249,0.12);
                             border:1px solid rgba(75,75,249,0.25);
                             border-radius:var(--radius-full);
                             font-size:.68rem;font-weight:600;
                             color:var(--fd-indigo);cursor:pointer">
                🧮 1RM
              </button>
            </div>

            <!-- ✅ SÉRIES ULTRA-RAPIDES -->
           ${Array.from({ length: ex.series }, (_, serieIdx) => `

  <div class="lr-serie-bloc"
       id="lr-bloc-${exoIdx}-${serieIdx}"
       style="margin-bottom:16px;padding:14px;
              background:rgba(255,255,255,0.03);
              border:1px solid rgba(255,255,255,0.07);
              border-radius:var(--radius-lg);
              transition:all .3s">

    <!-- Label série + chrono -->
    <div style="display:flex;align-items:center;
                justify-content:space-between;
                margin-bottom:12px">
      <div style="font-size:.78rem;font-weight:800;
                  color:var(--fd-indigo)">
        Série ${serieIdx + 1} / ${ex.series}
      </div>

      <!-- ✅ CHRONO SÉRIE -->
      <div id="chrono-serie-${exoIdx}-${serieIdx}"
           style="display:flex;align-items:center;gap:6px">

        <!-- Affiché quand pas encore démarré -->
        <div id="chrono-serie-idle-${exoIdx}-${serieIdx}"
             style="font-size:.65rem;color:var(--text-muted);
                    display:${serieIdx === 0 ? 'none' : 'flex'};
                    align-items:center;gap:4px">
          <span style="width:8px;height:8px;border-radius:50%;
                       background:rgba(255,255,255,0.15);
                       display:inline-block"></span>
          En attente
        </div>

        <!-- ✅ BOUTON COMMENCER — seulement S1 de chaque exo -->
        ${serieIdx === 0 ? `
  <button id="btn-commencer-${exoIdx}"
          onclick="ChronoSerie.demarrer(
            ${exoIdx}, ${serieIdx},
            ${ex.reps?.split?.('-')?.[0] || ex.reps || 10},
            '${seanceId}',
            ${ex.series},
            ${exos.length},
            ${ex.repos || 60},
            '${ex.ref}'
          )"
                  style="display:flex;align-items:center;gap:5px;
                         padding:6px 12px;
                         background:var(--fd-mint);
                         border:none;
                         border-radius:var(--radius-full);
                         font-size:.7rem;font-weight:800;
                         color:#09092d;cursor:pointer;
                         box-shadow:0 2px 10px rgba(139,240,187,0.4);
                         transition:all .2s"
                  onmousedown="this.style.transform='scale(.95)'"
                  onmouseup="this.style.transform=''">
            ▶ Commencer
          </button>` : ''}

        <!-- Chrono en cours -->
        <div id="chrono-serie-actif-${exoIdx}-${serieIdx}"
             style="display:none;align-items:center;gap:6px">
          <div style="position:relative;width:36px;height:36px">
            <svg width="36" height="36" viewBox="0 0 36 36"
                 style="transform:rotate(-90deg)">
              <circle cx="18" cy="18" r="14"
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      stroke-width="3"/>
              <circle cx="18" cy="18" r="14"
                      fill="none"
                      stroke="var(--fd-lemon)"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-dasharray="${2 * Math.PI * 14}"
                      stroke-dashoffset="0"
                      id="arc-serie-${exoIdx}-${serieIdx}"
                      style="transition:stroke-dashoffset .5s linear"/>
            </svg>
            <div style="position:absolute;top:50%;left:50%;
                        transform:translate(-50%,-50%);
                        font-size:.55rem;font-weight:800;
                        color:var(--fd-lemon)"
                 id="chrono-val-${exoIdx}-${serieIdx}">
              —
            </div>
          </div>
          <div style="font-size:.72rem;font-weight:700;
                      color:var(--fd-lemon)">
            Série en cours
          </div>
        </div>

        <!-- Statut validé -->
        <div id="lr-statut-${exoIdx}-${serieIdx}"
             style="font-size:.65rem;color:var(--text-muted);
                    display:none">
        </div>
      </div>
    </div>

    <!-- POIDS -->
    <div style="margin-bottom:12px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;
                  color:var(--text-muted);margin-bottom:6px">
        🏋️ Charge (kg)
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="LiveRapide.modifierPoids(${exoIdx}, -2.5)"
                style="width:48px;height:48px;flex-shrink:0;
                       background:rgba(255,141,150,0.12);
                       border:2px solid rgba(255,141,150,0.3);
                       border-radius:var(--radius-md);
                       font-size:1.2rem;font-weight:800;
                       color:var(--fd-coral);cursor:pointer">−</button>
        <div style="flex:1;position:relative">
          <input type="number" inputmode="decimal"
                 id="lr-poids-${exoIdx}-${serieIdx}"
                 placeholder="${poidsDefaut || 'kg'}"
                 value="${poidsDefaut || ''}"
                 step="2.5" min="0"
                 oninput="LiveRapide.setPoids(${exoIdx}, this.value)"
                 style="width:100%;padding:12px 8px;
                        font-size:1.3rem;font-weight:800;
                        text-align:center;
                        background:var(--bg-card);
                        border:2px solid var(--border-color);
                        border-radius:var(--radius-md);
                        color:var(--text-primary);outline:none;
                        transition:border-color .2s"
                 onfocus="this.style.borderColor='var(--fd-indigo)';this.select()"
                 onblur="this.style.borderColor='var(--border-color)'"/>
          <div style="position:absolute;bottom:-14px;
                      left:0;right:0;text-align:center;
                      font-size:.52rem;color:var(--text-muted);
                      font-weight:700;pointer-events:none">KG</div>
        </div>
        <button onclick="LiveRapide.modifierPoids(${exoIdx}, 2.5)"
                style="width:48px;height:48px;flex-shrink:0;
                       background:rgba(139,240,187,0.12);
                       border:2px solid rgba(139,240,187,0.3);
                       border-radius:var(--radius-md);
                       font-size:1.2rem;font-weight:800;
                       color:var(--fd-mint);cursor:pointer">+</button>
      </div>
    </div>

    <!-- REPS -->
    <div style="margin-bottom:16px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;
                  color:var(--text-muted);margin-bottom:6px">
        🔁 Répétitions
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="LiveRapide.modifierReps(${exoIdx}, -1)"
                style="width:48px;height:48px;flex-shrink:0;
                       background:rgba(255,141,150,0.12);
                       border:2px solid rgba(255,141,150,0.3);
                       border-radius:var(--radius-md);
                       font-size:1.2rem;font-weight:800;
                       color:var(--fd-coral);cursor:pointer">−</button>
        <div style="flex:1;position:relative">
          <input type="number" inputmode="numeric"
                 id="lr-reps-${exoIdx}-${serieIdx}"
                 placeholder="${repsDefaut || 'reps'}"
                 value="${repsDefaut || ''}"
                 min="1"
                 oninput="LiveRapide.setReps(${exoIdx}, this.value)"
                 style="width:100%;padding:12px 8px;
                        font-size:1.3rem;font-weight:800;
                        text-align:center;
                        background:var(--bg-card);
                        border:2px solid var(--border-color);
                        border-radius:var(--radius-md);
                        color:var(--text-primary);outline:none;
                        transition:border-color .2s"
                 onfocus="this.style.borderColor='var(--fd-indigo)';this.select()"
                 onblur="this.style.borderColor='var(--border-color)'"/>
          <div style="position:absolute;bottom:-14px;
                      left:0;right:0;text-align:center;
                      font-size:.52rem;color:var(--text-muted);
                      font-weight:700;pointer-events:none">REPS</div>
        </div>
        <button onclick="LiveRapide.modifierReps(${exoIdx}, 1)"
                style="width:48px;height:48px;flex-shrink:0;
                       background:rgba(139,240,187,0.12);
                       border:2px solid rgba(139,240,187,0.3);
                       border-radius:var(--radius-md);
                       font-size:1.2rem;font-weight:800;
                       color:var(--fd-mint);cursor:pointer">+</button>
      </div>
    </div>

    <!-- RPE -->
    <div style="margin-bottom:16px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;
                  color:var(--text-muted);margin-bottom:6px">
        😤 Effort ressenti (RPE)
        <span style="font-weight:400;opacity:.6">· optionnel</span>
      </div>
      <div style="display:flex;gap:4px">
        ${[6,7,8,9,10].map(rpe => `
          <button onclick="LiveRapide.setRPE(${exoIdx},${rpe});
                          document.getElementById('lr-rpe-${exoIdx}-${serieIdx}').value=${rpe};
                          this.parentElement.querySelectorAll('button')
                            .forEach(b=>b.style.background='rgba(255,255,255,0.04)');
                          this.style.background='rgba(75,75,249,0.3)'"
                  style="flex:1;padding:8px 4px;font-size:.75rem;font-weight:700;
                         background:rgba(255,255,255,0.04);
                         border:1px solid rgba(255,255,255,0.08);
                         border-radius:var(--radius-sm);
                         color:var(--text-muted);cursor:pointer;transition:all .15s">
            ${rpe}
          </button>`).join('')}
      </div>
      <input type="hidden" id="lr-rpe-${exoIdx}-${serieIdx}" value="7"/>
    </div>

    <!-- BOUTON SÉRIE FAITE -->
    <button onclick="App.validerSerieLR(
                '${seanceId}','${ex.ref}',
                ${exoIdx},${serieIdx},
                ${ex.series},${exos.length},
                ${ex.repos || 60})"
            id="btn-serie-${exoIdx}-${serieIdx}"
            style="width:100%;padding:18px;
                   background:var(--fd-indigo);border:none;
                   border-radius:var(--radius-lg);
                   font-size:1rem;font-weight:800;
                   color:white;cursor:pointer;
                   letter-spacing:.02em;
                   box-shadow:0 4px 20px rgba(75,75,249,0.4);
                   transition:all .15s;
                   -webkit-tap-highlight-color:transparent"
            onmousedown="this.style.transform='scale(.97)'"
            onmouseup="this.style.transform=''"
            ontouchstart="this.style.transform='scale(.97)'"
            ontouchend="this.style.transform=''">
      ✅ SÉRIE FAITE
    </button>

    ${serieIdx > 0 ? `
      <button onclick="LiveRapide.copierSeriePrecedente(${exoIdx},${serieIdx})"
              style="width:100%;margin-top:8px;padding:8px;
                     background:none;
                     border:1px dashed rgba(255,255,255,0.1);
                     border-radius:var(--radius-md);
                     font-size:.72rem;color:var(--text-muted);cursor:pointer">
        ↩️ Copier S${serieIdx} (même poids/reps)
      </button>` : ''}
  </div>`).join('')}
                  
            <!-- Conseils techniques -->
            ${exo.conseils?.length ? `
              <details style="margin-top:8px">
                <summary style="font-size:.68rem;
                                color:var(--text-muted);
                                cursor:pointer">
                  💡 Conseils techniques
                </summary>
                <div style="font-size:.72rem;
                            color:var(--text-muted);
                            margin-top:6px;
                            padding-left:8px">
                  ${exo.conseils.map(c => `
                    <div>• ${c}</div>`).join('')}
                </div>
              </details>` : ''}
          </div>`;
      }).join('')}

      <!-- ✅ BOUTONS FIN DE SÉANCE -->
      <button onclick="App.terminerSeance('${seanceId}')"
              class="btn-primary mt-md"
              style="width:100%;font-size:.95rem;
                     padding:18px;
                     box-shadow:0 4px 20px rgba(75,75,249,0.4)">
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
  if (!container) return;
  
  let profil   = { nom:'Athlète', avatar:'💪', poids:80, taille:175, objectif:'forme' };
  let xp       = { total:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
  let streak   = { count:0, max:0 };
  let total    = 0;
  let trophees = 0;

  try { profil   = Tracker.getProfil();           } catch(e) {}
  try { xp       = Gamification.getXP();          } catch(e) {}
  try { streak   = Tracker.getStreak();           } catch(e) {}
  try { total    = Tracker.getTotalSeances();      } catch(e) {}
  try { trophees = Gamification.getTrophees()
          .filter(t => t.debloquee).length;        } catch(e) {}

  // ✅ Une seule zone de rendu — pas de double
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

    <!-- Bouton modifier profil -->
    <div class="card mb-md"
         style="background:rgba(75,75,249,0.1);
                border:1px solid rgba(75,75,249,0.3);
                cursor:pointer"
         onclick="Profil._ouvrirEdition()">
      <div style="display:flex;align-items:center;
                  justify-content:space-between">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:1.3rem">✏️</span>
          <span style="font-weight:700;font-size:.92rem">
            Modifier mon profil
          </span>
        </div>
        <span style="color:var(--fd-indigo);font-size:.9rem">›</span>
      </div>
    </div>

    ${[
      { page:'journal',      emoji:'📔', label:'Journal'             },
      { page:'objectifs',    emoji:'🎯', label:'Objectifs'           },
      { page:'blessures',    emoji:'🩹', label:'Blessures'           },
      { page:'coach',        emoji:'🤖', label:'Coach IA'            },
      { page:'defis',        emoji:'🏆', label:'Défis'               },
      { page:'predict',      emoji:'🔮', label:'Prédictions IA'      },
      { page:'calculateur',  emoji:'🧮', label:'Calculateur'         },
      { page:'export',       emoji:'📤', label:'Exporter mes données'},
      { page:'supersets',    emoji:'⚡', label:'Supersets'           },
      { page:'social',       emoji:'📱', label:'Réseaux sociaux'     },
      { page:'offline',      emoji:'📵', label:'Hors-ligne'          },
      { page:'gamification', emoji:'⭐', label:'XP & Niveaux'        },
      { page:'history',      emoji:'📅', label:'Historique'          },
      { page:'photos',       emoji:'📸', label:'Photos'              },
      { page:'circuit',      emoji:'⚡', label:'HIIT & Cardio'       },
      { page:'adaptatif',    emoji:'🧠', label:'Programme Adaptatif' },
      { page:'nutrition',    emoji:'🥗', label:'Nutrition'           },
      { page:'galerie',      emoji:'💪', label:'Galerie exercices'   },
      { page:'settings',     emoji:'⚙️', label:'Paramètres'         }
    ].map(s => `
  <div class="card mb-md" style="cursor:pointer" 
       onclick="${s.page === '__edit__' ? 'Profil._ouvrirEdition()' : `naviguer('${s.page}')`}">
    <div class="flex justify-between items-center">
      <div style="display:flex;align-items:center;gap:var(--space-md)">
        <span style="font-size:1.3rem">${s.emoji}</span>
        <span style="font-weight:600;font-size:.92rem">${s.label}</span>
      </div>
      <span style="color:var(--text-muted);font-size:.9rem">›</span>
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

<!-- ✅ NOUVEAU — Checklist pré-séance -->
<div class="card mb-md">
  <div class="card-label">🎛️ Checklist pré-séance</div>
  <div class="score-row" style="margin-top:var(--space-sm)">
    <div>
      <span class="score-row-label" style="font-size:.85rem">
        Afficher avant chaque séance
      </span>
      <div style="font-size:.68rem;color:var(--text-muted);margin-top:2px">
        Liste les exercices avec démo YouTube
      </div>
    </div>
    <label class="toggle"
           style="position:relative;display:inline-block;
                  width:44px;height:24px">
      <input type="checkbox"
             ${!Utils.storage.get('ft_skip_checklist', false) ? 'checked' : ''}
             onchange="Utils.storage.set('ft_skip_checklist', !this.checked);
                       Utils.toast(
                         this.checked
                           ? '✅ Checklist activée'
                           : 'Checklist désactivée',
                         'success', 1500
                       )"
             style="opacity:0;width:0;height:0"/>
      <span class="toggle-slider"></span>
    </label>
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

  // ✅ NOUVEAU — validerSerieLR remplace validerSerie
validerSerieLR(seanceId, exoRef, exoIdx, serieIdx,
               totalSeries, totalExos, reposDuree) {

  // ✅ Récupérer les valeurs depuis LiveRapide
  const poids = parseFloat(
    document.getElementById(
      `lr-poids-${exoIdx}-${serieIdx}`
    )?.value
  );
  const reps  = parseInt(
    document.getElementById(
      `lr-reps-${exoIdx}-${serieIdx}`
    )?.value
  );
  const rpe   = parseInt(
    document.getElementById(
      `lr-rpe-${exoIdx}-${serieIdx}`
    )?.value
  ) || null;

  // ✅ Vérifier que poids et reps sont renseignés
  if (!poids || !reps) {
    // Highlight les champs vides
    if (!poids) {
      const inp = document.getElementById(
        `lr-poids-${exoIdx}-${serieIdx}`
      );
      if (inp) {
        inp.style.borderColor = 'var(--fd-coral)';
        inp.focus();
        setTimeout(() => {
          inp.style.borderColor = 'var(--border-color)';
        }, 2000);
      }
    } else if (!reps) {
      const inp = document.getElementById(
        `lr-reps-${exoIdx}-${serieIdx}`
      );
      if (inp) {
        inp.style.borderColor = 'var(--fd-coral)';
        inp.focus();
        setTimeout(() => {
          inp.style.borderColor = 'var(--border-color)';
        }, 2000);
      }
    }
    Utils.toast('Entre le poids et les reps !', 'error');
    return;
  }

  // ✅ Sauvegarder la série
  let result = { isPR:false };
  try {
    result = Tracker.sauvegarderSerie(
      seanceId, exoRef, serieIdx + 1, reps, poids, rpe
    );
  } catch(e) {}

  // ✅ Chrono — démarre auto à la première série si pas encore démarré
// ════════════════════════════════════════════════════════════
// validerSerieLR() — ✅ v4.0 Chrono sécurisé
// Remplace la section "// ✅ Chrono — démarre auto..."
// ════════════════════════════════════════════════════════════

// ✅ FIX v4.0 — Vérifier Chrono._actif avant accès
try {
  const chronoActif = typeof Chrono !== 'undefined'
    && Chrono._actif;

  if (!chronoActif) {
    if (typeof Chrono !== 'undefined' && Chrono.reset) {
      Chrono.reset();
    }
    if (typeof Chrono !== 'undefined' && Chrono.demarrer) {
      Chrono.demarrer();
    }

    const nomSeance = (window.SEANCES_BASE||{})[seanceId]?.nom
      || 'Séance en cours';

    if (typeof ChronoSticky !== 'undefined') {
      ChronoSticky.afficher(nomSeance);
    }

    try {
      if (!Tracker._seanceEnCours) {
        Tracker.demarrerSeance(seanceId);
      }
    } catch(e) {}

    App._mettreAJourBtnDemarrer(true);
  }
} catch(e) {
  console.warn('[App] Erreur Chrono démarrage:', e);
}

  // ✅ Mettre à jour le bouton → validé
  const btn = document.getElementById(
    `btn-serie-${exoIdx}-${serieIdx}`
  );
  if (btn) {
    btn.innerHTML = `✅ ${poids}kg × ${reps} reps`;
    btn.style.background  = 'rgba(139,240,187,0.2)';
    btn.style.border      = '2px solid var(--fd-mint)';
    btn.style.color       = 'var(--fd-mint)';
    btn.style.boxShadow   = 'none';
    btn.disabled          = true;
    btn.style.cursor      = 'default';
  }

  // ✅ Mettre à jour le statut
  const statut = document.getElementById(
    `lr-statut-${exoIdx}-${serieIdx}`
  );
  if (statut) {
    statut.textContent  = `✅ ${poids}kg × ${reps}`;
    statut.style.color  = 'var(--fd-mint)';
    statut.style.fontWeight = '700';
  }

  // ✅ Copier valeurs vers séries suivantes du même exo
  LiveRapide._valeurs[exoIdx] = {
    poids, reps, rpe: rpe || 7
  };
  // Pré-remplir les inputs des séries suivantes
  for (let s = serieIdx + 1; s < totalSeries; s++) {
    const pInp = document.getElementById(
      `lr-poids-${exoIdx}-${s}`
    );
    const rInp = document.getElementById(
      `lr-reps-${exoIdx}-${s}`
    );
    const btnS = document.getElementById(
      `btn-serie-${exoIdx}-${s}`
    );
    // Seulement si pas encore validé
    if (btnS && !btnS.disabled) {
      if (pInp && !pInp.value) pInp.value = poids;
      if (rInp && !rInp.value) rInp.value = reps;
    }
  }

  // ✅ PR
  if (result.isPR) {
    try { timerRepos?.jouerSon('pr');              } catch(e) {}
    try { Gamification.recompenser('PR_BATTU');   } catch(e) {}
    try { Notifications.notifierPR(exoRef, poids, reps); } catch(e) {}
    Utils.toast(
      `🏆 NOUVEAU RECORD ! ${poids}kg × ${reps}`,
      'pr', 4000
    );
    Utils.vibrerPR();
  } else {
    Utils.vibrerSuccess();
  }
   // ✅ RPE auto-suggéré selon reps faites vs cibles
  try {
    const repsTarget = parseInt(
      document.getElementById(`lr-reps-${exoIdx}-0`)
        ?.getAttribute('placeholder') || '0'
    ) || 10;
    const ratio = reps / repsTarget;

    let rpeAuto = 7;
    if (ratio >= 1.2)       rpeAuto = 6;
    else if (ratio >= 1.0)  rpeAuto = 7;
    else if (ratio >= 0.8)  rpeAuto = 8;
    else if (ratio >= 0.6)  rpeAuto = 9;
    else                    rpeAuto = 10;

    const rpeInput = document.getElementById(
      `lr-rpe-${exoIdx}-${serieIdx}`
    );
    if (rpeInput && parseInt(rpeInput.value) === 7) {
      rpeInput.value = rpeAuto;
      const rpeBtns = document.querySelectorAll(
        `#lr-bloc-${exoIdx}-${serieIdx} button`
      );
      rpeBtns.forEach(btn => {
        if (btn.textContent.trim() === String(rpeAuto)) {
          btn.style.background = 'rgba(75,75,249,0.3)';
        }
      });
    }
  } catch(e) {}

  // ✅ XP série
  try { Gamification.recompenser('SERIE_COMPLETE'); } catch(e) {}

  // ✅ Mettre à jour la barre sticky progression
  try { LiveStickyBar.mettreAJourProgression(); } catch(e) {}

  try { SeanceGuidee.serieValidee(
    exoIdx, serieIdx, poids, reps, result.isPR
  ); } catch(e) {}
  try {
    if (!Offline.estEnLigne()) {
      Offline.ajouterAction('serie_sauvegardee', {
        seanceId, exoRef, poids, reps, rpe,
        date: Utils.aujourd_hui()
      });
    }
  } catch(e) {}
  // ✅ Sauvegarder l'état après chaque série validée
try { LiveRapide.sauvegarderEtat(seanceId); } catch(e) {} 
  // ✅ Lancer timer repos AUTO
  LiveRapide.lancerReposAuto(
    reposDuree,
    exoIdx,
    serieIdx,
    totalSeries,
    totalExos,
    seanceId
  );
},

// ✅ Garder l'ancien pour compatibilité
validerSerie(seanceId, exoRef, exoIdx, serieIdx) {
  const totalSeries = parseInt(
    document.querySelectorAll(
      `[id^="btn-serie-${exoIdx}-"]`
    ).length
  ) || 1;
  const totalExos = document.querySelectorAll(
    '.live-exo-card'
  ).length || 1;
  const reposDuree = 60;
  this.validerSerieLR(
    seanceId, exoRef, exoIdx, serieIdx,
    totalSeries, totalExos, reposDuree
  );
},

  async terminerSeance(seanceId) {
  try {
    // ✅ Libérer WakeLock
    try { await LiveRapide.relacherWakeLock(); } catch(e) {}
    // ✅ Fermer overlay repos si ouvert
    try { LiveRapide._fermerRepos(); } catch(e) {}
    LiveRapide.reset();
    // ✅ Nettoyer l'état sauvegardé
    localStorage.removeItem('ft_live_etat');

    const duree  = Tracker.getDureeSeance?.(seanceId) || 0;
    const volume = Tracker.getVolumeSemaine?.()       || 0;
    const prs = (() => {
      try {
        return (Tracker.getPRsSeance?.(seanceId) || []).length;
      }
      catch(e) { return 0; }
    })();
    const seance = (window.SEANCES_BASE || {})[seanceId];
    const nom    = seance?.nom || 'Séance';

    try { Tracker.terminerSeance(seanceId); } catch(e) {}
    try { ChronoSticky.masquer(); Chrono.reset?.(); } catch(e) {}
    try { LiveStickyBar.masquer(); } catch(e) {}

    try {
      const secondes = TempsSalle.getDureeChronoSecondes();
      TempsSalle.sauvegarder(seanceId, secondes);
    } catch(e) {}

    try {
      Gamification.recompenser('SEANCE_COMPLETE');
      Gamification.verifierTrophees();
    } catch(e) {}

    try { Defis.mettreAJourProgression();                 } catch(e) {}
    try { Notifications.notifierFinSeance(nom,duree,volume); } catch(e) {}
    try { Notifications.verifierSemaineParf();            } catch(e) {}
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
    try { timerRepos?.jouerSon('pr'); } catch(e) {}
    Utils.vibrer([200,100,200,100,400]);

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
  },

  // ✅ Démarrer la séance manuellement
  _demarrerSeanceManuellement(seanceId) {
    try {
      // Démarrer le tracker
      try {
        Tracker.demarrerSeance(seanceId);
      } catch(e) {}

      // Démarrer le chrono
      try {
        Chrono.reset();
        Chrono.demarrer();
        const nomSeance = (window.SEANCES_BASE||{})[seanceId]?.nom
          || 'Séance en cours';
        ChronoSticky.afficher(nomSeance);
      } catch(e) {}

      // ✅ Mettre à jour le bouton
      this._mettreAJourBtnDemarrer(true);

      // ✅ Vibration + toast
      Utils.vibrer([100, 50, 100]);       
      Utils.toast('💪 Séance démarrée ! Let\'s go !', 'success', 2000);

      // ✅ Demander permission notifications
      try {
        if (Notification.permission === 'default') {
          Notification.requestPermission().then(perm => {
            if (perm === 'granted') {
              Utils.toast(
                '🔔 Notifications activées — tu seras alerté à la fin du repos !',
                'success', 3000
              );
            }
          });
        }
      } catch(e) {} 

      // ✅ Scroll vers le premier exercice
      setTimeout(() => {
        const premierExo = document.getElementById('live-exo-0');
        if (premierExo) {
          premierExo.scrollIntoView({
            behavior: 'smooth',
            block:    'start'
          });
        }
      }, 400);

      // ✅ Mode guidé auto si activé
      try {
        if (SeanceGuidee._actif) {
          const seance = Programme.getSeanceComplete(seanceId);
          SeanceGuidee.demarrer(
            seanceId,
            seance?.exercices || []
          );
        }
      } catch(e) {}

    } catch(e) {
      console.error('[App] Erreur démarrage manuel:', e);
    }
  },

  // ✅ Mettre à jour le bouton démarrer
  _mettreAJourBtnDemarrer(estDemarre) {
    const btn = document.getElementById('btn-demarrer-chrono');
    if (!btn) return;

    if (estDemarre) {
      btn.innerHTML         = '⏱️ En cours';
      btn.style.background  = 'rgba(139,240,187,0.15)';
      btn.style.color       = 'var(--fd-mint)';
      btn.style.border      = '1px solid rgba(139,240,187,0.3)';
      btn.style.boxShadow   = 'none';
      btn.style.cursor      = 'default';
      btn.disabled          = true;
    } else {
      btn.innerHTML         = '▶ Démarrer le chrono';
      btn.style.background  = 'var(--fd-mint)';
      btn.style.color       = '#09092d';
      btn.style.border      = 'none';
      btn.style.boxShadow   = '0 4px 16px rgba(139,240,187,0.4)';
      btn.style.cursor      = 'pointer';
      btn.disabled          = false;
    }
  }
};

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

  // ════════════════════════════════════════════════════════════
// _afficherResumSeance() — ✅ v4.0 duréeAffichée sécurisée
// Remplace la section "const dureeAffichee = ..."
// ════════════════════════════════════════════════════════════
const dureeAffichee = (() => {
  try {
    if (typeof TempsSalle !== 'undefined'
        && TempsSalle.recuperer) {
      const sec = TempsSalle.recuperer(seanceId);
      if (sec && sec > 60) {
        return TempsSalle.formaterDuree(sec);
      }
    }
    if (duree > 0) return Utils.formatDuree(duree);
    return '—';
  } catch(e) {
    return duree > 0 ? Utils.formatDuree(duree) : '—';
  }
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
    const seance = (window.SEANCES_BASE || {})[seanceId]
      || { nom:'Séance', emoji:'💪' };

    let profil    = { nom:'Athlète', avatar:'💪' };
    let xp        = { total:0, niveau:{ numero:1, nom:'Débutant' } };
    let streak    = { count:0 };
    let volume    = 0;
    let prs       = 0;
    let scoreForm = 0;
    let dureeAff  = '—';
    let duree     = 0;

    try { profil    = Tracker.getProfil();                    } catch(e) {}
    try { xp        = Gamification.getXP();                   } catch(e) {}
    try { streak    = Tracker.getStreak();                    } catch(e) {}
    try { volume    = Tracker.getVolumeSemaine();             } catch(e) {}
    try { scoreForm = Tracker.calculerScoreForme().score;     } catch(e) {}
    try { duree     = TempsSalle.getDureeChronoSecondes() || 0; } catch(e) {}
    try {
      if (typeof TempsSalle !== 'undefined' && TempsSalle.recuperer) {
        const sec = TempsSalle.recuperer(seanceId);
        if (sec && sec > 60) {
          dureeAff = TempsSalle.formaterDuree(sec);
        } else if (duree > 0) {
          dureeAff = Utils.formatDuree(duree);
        }
      } else if (duree > 0) {
        dureeAff = Utils.formatDuree(duree);
      }
    } catch(e) {}
    try { prs = (Tracker.getPRsSeance(seanceId) || []).length; } catch(e) {}

    // ✅ FOND — gradient bleu profond
    const gradFond = ctx.createLinearGradient(0, 0, 0, 1920);
    gradFond.addColorStop(0,   '#06063d');
    gradFond.addColorStop(0.5, '#08082e');
    gradFond.addColorStop(1,   '#050520');
    ctx.fillStyle = gradFond;
    ctx.fillRect(0, 0, 1080, 1920);

    // ✅ Glow indigo en haut
    const glowTop = ctx.createRadialGradient(540, 0, 0, 540, 0, 600);
    glowTop.addColorStop(0, 'rgba(75,75,249,0.25)');
    glowTop.addColorStop(1, 'transparent');
    ctx.fillStyle = glowTop;
    ctx.fillRect(0, 0, 1080, 600);

    // ✅ Glow mint en bas
    const glowBot = ctx.createRadialGradient(540, 1920, 0, 540, 1920, 500);
    glowBot.addColorStop(0, 'rgba(139,240,187,0.12)');
    glowBot.addColorStop(1, 'transparent');
    ctx.fillStyle = glowBot;
    ctx.fillRect(0, 1400, 1080, 520);

    // ✅ LOGO PowerApp
    ctx.fillStyle = '#4b4bf9';
    ctx.font      = 'bold 38px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ PowerApp', 540, 120);

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
      { label:'VOLUME',  val:Utils.formatVolume(volume), color:'#8bf0bb', x:80  },
      { label:'DURÉE',   val:dureeAff,                   color:'#4b4bf9', x:390 },
      { label:'RECORDS', val:`${prs} 🏆`,                color:'#f9ef77', x:700 }
    ];

    cartes.forEach(c => {
      this._roundRect(ctx, c.x, 640, 280, 180, 24,
        'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)');
      ctx.fillStyle = c.color;
      ctx.font      = 'bold 52px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.val, c.x + 140, 740);
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

    const musclesArr = Object.entries(musclesData)
      .sort((a,b) => b[1] - a[1]).slice(0, 5);
    const totalMusc  = musclesArr.reduce((a,[,v]) => a + v, 0) || 1;
    const COULEURS   = ['#4b4bf9','#8bf0bb','#f9ef77','#bfa1ff','#ff8d96'];

    if (musclesArr.length > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '28px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('RÉPARTITION MUSCULAIRE', 540, 900);

      const cx = 540, cy = 1060, r = 140, sw = 30;
      const circ = 2 * Math.PI * r;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth   = sw;
      ctx.stroke();

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

      ctx.fillStyle = '#ffffff';
      ctx.font      = 'bold 48px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${musclesArr.length}`, cx, cy - 10);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font      = '24px system-ui, sans-serif';
      ctx.fillText('muscles', cx, cy + 30);

      const legendY = 1240;
      musclesArr.forEach(([muscle, vol], i) => {
        const pct = Math.round((vol / totalMusc) * 100);
        const col = i % 2 === 0 ? 150 : 580;
        const row = Math.floor(i / 2) * 70;

        ctx.fillStyle = COULEURS[i];
        ctx.beginPath();
        ctx.arc(col, legendY + row + 10, 10, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font      = 'bold 26px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(muscle, col + 25, legendY + row + 18);

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

    ctx.fillStyle = scoreForm >= 70
      ? '#8bf0bb' : scoreForm >= 50 ? '#4b4bf9' : '#f9ef77';
    ctx.font      = 'bold 64px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${scoreForm}/100`, 300, scoreY + 80);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font      = '26px system-ui, sans-serif';
    ctx.fillText('SCORE DE FORME', 300, scoreY + 115);

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

    // ✅ Watermark
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
// ════════════════════════════════════════════════════════════
// init() ✅ v4.0 — Plus robuste
// ════════════════════════════════════════════════════════════
async function init() {
  try {
    console.log('🚀 PowerApp v4.0 — Init...');

    try { i18n?.init?.(); } catch(e) {}

    // ✅ FIX v4.0 — Vérifier ft_profil ET ft_profil_onboarding
    const profil1  = Utils.storage.get('ft_profil', null);
    const profil2  = Utils.storage.get('ft_profil_onboarding', null);
    const profilOk = profil1?.nom || profil2?.nom;

    if (!profilOk) {
      _afficherOnboarding();
      return;
    }

   // ✅ FIX — Cacher splash + afficher app
const splash = document.getElementById('splash-screen');
const app    = document.getElementById('app-wrapper');

if (splash) {
  splash.style.opacity    = '0';
  splash.style.transition = 'opacity 0.3s ease';
  setTimeout(() => {
    splash.style.display = 'none';
  }, 300);
}

if (app) {
  app.style.display    = 'flex';
  app.style.flexDirection = 'column';
  app.style.minHeight  = '100vh';
}

    try { Tracker.init?.();                          } catch(e) {}
    try { Programme.getDateDebut();                  } catch(e) {}
    try { Gamification.verifierTrophees();           } catch(e) {}
    try { await Notifications.init();                } catch(e) {}
    try { Offline.init?.();                          } catch(e) {}
    try { Offline.initInstall?.();                   } catch(e) {}

    try {
      const jours = Tracker.getJoursAbsence();
      if (jours >= 7) {
        Utils.storage.set('ft_comeback', true);
        Gamification.verifierTrophees();
      }
    } catch(e) {}

    try {
      if (Programme.isDecharge?.()) {
        setTimeout(() => {
          Notifications.notifierDecharge?.();
        }, 5000);
      }
    } catch(e) {}

    try {
      if (Offline.estEnLigne?.()
          && Offline._pendingQueue?.length > 0) {
        setTimeout(() => Offline.syncPendingQueue?.(), 4000);
      }
    } catch(e) {}

    naviguer('home');
    _updateHeaderXP();

    // ✅ FIX BACKGROUND TIMER
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        try {
          LiveRapide._verifierTimerAuRetour();
        } catch(e) {}
        try {
          if (ChronoSticky._visible) {
            const disp = document.querySelector(
              '.chrono-sticky-display'
            );
            if (disp && Chrono?._actif) {
              const sec = Chrono.getDureeSecondes?.() || 0;
              disp.textContent =
                Chrono.formaterDuree?.(sec) || '00:00';
            }
          }
        } catch(e) {}
      }
    });

    try { ThemeManager.init?.();       } catch(e) {}
    try { SwipeNav.init?.();           } catch(e) {}
    try { SeanceGuidee.prechargerVoix?.(); } catch(e) {}
    try { Themes.init(); } catch(e) {}  
    try { TimerManager.initAlarme?.(); } catch(e) {}

    setTimeout(() => {
      try { ThemeManager._injecterBtn?.(); } catch(e) {}
      try { _updateHeaderXP();             } catch(e) {}
    }, 300);

    navigator.serviceWorker?.addEventListener('message',
      event => {
        const { type, page } = event.data || {};
        if (type === 'NAVIGATE' && page) {
          try { naviguer(page); } catch(e) {}
        }
      }
    );

    console.log('✅ PowerApp v4.0 — Prêt !');

  } catch(e) {
    console.error('[App] Erreur init:', e);
    const splash = document.getElementById('splash-screen');
    const app    = document.getElementById('app-wrapper');
    if (splash) splash.style.display = 'none';
    if (app)    app.style.display    = 'flex';
    naviguer('home');
  }

  try { Sounds?.init?.(); } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// ✅ ONBOARDING v2.0 — Complet avec corps SVG
// ════════════════════════════════════════════════════════════

function _renderPropositionProgramme(data) {

  // ✅ DEBUG — voir ce qui arrive
  console.log('[Coach IA] Data reçue:', {
    muscles:   data.muscles_cibles,
    objectif:  data.objectif,
    genre:     data.genre,
    lieu:      data.lieu,
    niveau:    data.niveau
  });

  const muscles      = data.muscles_cibles || [];
  const corpsComplet = muscles.length === 0;

  console.log('[Coach IA] Corps complet:', corpsComplet);
  console.log('[Coach IA] Muscles:', muscles);
   
  const objectif  = data.objectif  || 'forme';
  const niveau    = data.niveau    || 'intermediaire';
  const nom       = data.nom       || 'Athlète';
  const genre     = data.genre     || 'homme';
  const lieu      = data.lieu      || 'salle';
  
  const nbJoursParNiveau = {
    debutant: 3, intermediaire: 4, avance: 5
  };
  const nbJours = nbJoursParNiveau[niveau] || 4;

  // ✅ Style selon muscles ciblés
  const styleChoix = (() => {
    if (corpsComplet) {
      if (nbJours <= 3) return 'full_body';
      if (objectif === 'force') return 'upper_lower';
      if (nbJours >= 5) return 'ppl';
      return 'ppl';
    }
    // Muscles ciblés → programme spécialisé
    const hasPush = muscles.some(m =>
      ['pectoraux','deltoides','triceps'].includes(m));
    const hasPull = muscles.some(m =>
      ['dorsal','biceps','trapeze'].includes(m));
    const hasLegs = muscles.some(m =>
      ['quadriceps','fessiers','ischio','mollets'].includes(m));
    const hasCore = muscles.some(m =>
      ['abdominaux','lombaires'].includes(m));

    if (hasPush && hasPull && hasLegs) return 'ppl';
    if (hasPush && hasPull) return 'upper_lower';
    if (hasLegs && genre === 'femme') return 'lower_focus';
    if (hasPush) return 'push_focus';
    if (hasPull) return 'pull_focus';
    if (hasLegs) return 'legs_focus';
    if (hasCore) return 'core_focus';
    return 'full_body';
  })();

  const styleLabel = {
    ppl:          'Push / Pull / Legs',
    full_body:    'Full Body',
    upper_lower:  'Upper / Lower',
    lower_focus:  'Lower Body Focus',
    push_focus:   'Push Focus',
    pull_focus:   'Pull Focus',
    legs_focus:   'Legs Focus',
    core_focus:   'Core & Gainage'
  }[styleChoix] || 'Full Body';

  const planning = _genererPlanningDepuisAujourdhui(
    styleChoix, nbJours, objectif
  );

  window._obProgrammePropose = {
    objectif, niveau, nbJours, genre, lieu,
    muscles_cibles: muscles,
    style: styleChoix,
    jours_specifiques: planning.map(p => p.jour),
    equipement: lieu === 'salle'
      ? ['barre','halteres','machines','cables','rack']
      : lieu === 'maison'
        ? ['halteres','elastiques','poids_corps']
        : ['poids_corps','elastiques'],
    duree: niveau === 'debutant' ? '60' : '75'
  };

  // ✅ Message Coach IA personnalisé
  const msgCoach = _genererMessageCoach(
    nom, genre, objectif, muscles,
    corpsComplet, styleLabel, nbJours, lieu
  );

  // ✅ Séances adaptées
  const seancesAdaptees = _getSeancesAdaptees(
    styleChoix, objectif, niveau, genre, lieu, muscles
  );

  const objectifLabel = {
    prise_masse: '💪 Prise de masse',
    perte_poids: '⬇️ Perte de poids',
    seche:       '🔥 Sèche',
    force:       '🏋️ Force',
    endurance:   '🏃 Endurance',
    forme:       '✨ Forme générale'
  }[objectif] || objectif;

  const niveauLabel = {
    debutant:      '🌱 Débutant',
    intermediaire: '💪 Intermédiaire',
    avance:        '🔥 Avancé'
  }[niveau] || niveau;

  const lieuLabel = {
    salle:  '🏋️ Salle',
    maison: '🏠 Maison',
    dehors: '🌳 Dehors'
  }[lieu] || '🏋️ Salle';

  const genreLabel = genre === 'femme' ? '👩 Femme' : '👨 Homme';

  const labels = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  // ✅ Nutrition adaptée genre + objectif
  let nut = { calories:2000, proteines:150, glucides:200, lipides:65, eau:2.5 };
  try {
    nut = Profil.calculerNutrition({
      poids:    data.poids    || 75,
      taille:   data.taille   || 175,
      age:      data.age      || 25,
      genre, objectif, niveau
    });
  } catch(e) {}

  // ✅ Recettes adaptées
  const recettes = _getRecettesAdaptees(genre, objectif);

  return `
    <!-- Message Coach IA -->
    <div style="background:rgba(75,75,249,0.08);
                border:1px solid rgba(75,75,249,0.2);
                border-left:3px solid var(--fd-indigo);
                border-radius:var(--radius-lg);
                padding:14px 16px;margin-bottom:16px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--fd-indigo);margin-bottom:6px">
        🤖 Coach IA — Programme personnalisé
      </div>
      <p style="font-size:.82rem;color:var(--text-secondary);
                line-height:1.6;margin:0">
        ${msgCoach}
      </p>
    </div>

    <!-- Badges -->
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px">
      ${[
        { label: genreLabel,    color:'var(--fd-lavender)' },
        { label: niveauLabel,   color:'var(--fd-indigo)'   },
        { label: objectifLabel, color:'var(--fd-lemon)'    },
        { label: lieuLabel,     color:'var(--fd-mint)'     },
        { label: `${styleLabel} · ${nbJours}j/sem`,
          color:'var(--fd-coral)' }
      ].map(b => `
        <span style="padding:4px 10px;
                     background:${b.color}22;
                     border:1px solid ${b.color}44;
                     border-radius:99px;font-size:.65rem;
                     font-weight:700;color:${b.color}">
          ${b.label}
        </span>`).join('')}
      ${muscles.length > 0 ? muscles.map(m => {
        const cfg = {
          pectoraux:'#4b4bf9', deltoides:'#bfa1ff',
          biceps:'#8bf0bb',    triceps:'#ff8d96',
          abdominaux:'#f9ef77',quadriceps:'#22c55e',
          dorsal:'#4b4bf9',    fessiers:'#ff8d96',
          ischio:'#f9ef77',    mollets:'#bfa1ff',
          trapeze:'#8bf0bb',   lombaires:'#bfa1ff',
          avantbras:'#8bf0bb'
        }[m] || '#4b4bf9';
        return `
          <span style="padding:4px 10px;
                       background:${cfg}22;
                       border:1px solid ${cfg}66;
                       border-radius:99px;font-size:.65rem;
                       font-weight:700;color:${cfg}">
            🎯 ${m}
          </span>`;
      }).join('') : `
        <span style="padding:4px 10px;
                     background:rgba(139,240,187,0.1);
                     border:1px solid rgba(139,240,187,0.3);
                     border-radius:99px;font-size:.65rem;
                     font-weight:700;color:var(--fd-mint)">
          🔄 Corps complet
        </span>`}
    </div>

    <!-- Planning -->
    <div style="background:rgba(255,255,255,0.03);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-lg);
                padding:14px;margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);margin-bottom:12px">
        📅 Planning — commence aujourd'hui
      </div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">
        ${planning.map(j => `
          <div style="display:flex;flex-direction:column;
                      align-items:center;gap:4px">
            <div style="width:36px;height:36px;border-radius:10px;
                        display:flex;align-items:center;
                        justify-content:center;
                        font-size:.75rem;font-weight:700;
                        ${j.estAujourdhui
                          ? 'background:var(--fd-indigo);color:white;box-shadow:0 0 12px rgba(75,75,249,0.5)'
                          : j.seanceEmoji
                            ? 'background:rgba(75,75,249,0.2);border:1px solid rgba(75,75,249,0.3);color:var(--fd-lavender)'
                            : 'background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:var(--text-muted)'}">
              ${j.estAujourdhui ? '▶' : j.seanceEmoji ? j.seanceEmoji : '😴'}
            </div>
            <div style="font-size:.48rem;color:var(--text-muted);
                        text-transform:uppercase;font-weight:600">
              ${labels[j.jour]}
            </div>
          </div>`).join('')}
      </div>
    </div>

    <!-- Séances adaptées -->
    <div style="font-size:.6rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.1em;
                color:var(--text-muted);margin-bottom:8px">
      💪 Séances de ton programme
    </div>
    <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px">
      ${seancesAdaptees.map(s => `
        <div style="background:rgba(255,255,255,0.03);
                    border:1px solid rgba(255,255,255,0.07);
                    border-radius:var(--radius-md);
                    padding:10px 12px">
          <div style="display:flex;align-items:center;
                      gap:10px;margin-bottom:6px">
            <span style="font-size:1.3rem">${s.emoji}</span>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:700">
                ${s.nom}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${s.muscles} · ~${s.duree}min
              </div>
            </div>
            <div style="font-size:.6rem;color:var(--fd-indigo);
                        font-weight:700;text-align:right">
              ${s.lieu === 'maison' ? '🏠' : s.lieu === 'dehors' ? '🌳' : '🏋️'}
            </div>
          </div>
          <!-- Exercices -->
          <div style="display:flex;flex-wrap:wrap;gap:4px">
            ${s.exercices.map(ex => `
              <span style="padding:2px 8px;font-size:.58rem;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;
                           color:var(--fd-lavender)">
                ${ex}
              </span>`).join('')}
          </div>
        </div>`).join('')}
    </div>

    <!-- Nutrition adaptée -->
    <div style="background:rgba(255,255,255,0.03);
                border:1px solid rgba(255,255,255,0.08);
                border-radius:var(--radius-lg);
                padding:14px;margin-bottom:14px">
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);margin-bottom:10px">
        🥗 Nutrition — ${genreLabel} · ${objectifLabel}
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;
                  margin-bottom:10px">
        ${[
          { label:'Kcal',  val:nut.calories,       color:'var(--fd-lemon)'    },
          { label:'Prot.', val:`${nut.proteines}g`, color:'var(--fd-coral)'   },
          { label:'Gluc.', val:`${nut.glucides}g`,  color:'var(--fd-mint)'    },
          { label:'Lip.',  val:`${nut.lipides}g`,   color:'var(--fd-lavender)'}
        ].map(n => `
          <div style="text-align:center;padding:8px 4px;
                      background:${n.color}11;
                      border:1px solid ${n.color}33;
                      border-radius:var(--radius-md)">
            <div style="font-size:.82rem;font-weight:800;color:${n.color}">
              ${n.val}
            </div>
            <div style="font-size:.52rem;color:var(--text-muted);margin-top:2px">
              ${n.label}
            </div>
          </div>`).join('')}
      </div>
      <!-- Recettes suggérées -->
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.08em;
                  color:var(--text-muted);margin-bottom:6px">
        🍽️ Recettes suggérées
      </div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${recettes.map(r => `
          <div style="display:flex;align-items:center;gap:8px;
                      padding:8px 10px;
                      background:rgba(255,255,255,0.03);
                      border:1px solid rgba(255,255,255,0.06);
                      border-radius:var(--radius-sm)">
            <span style="font-size:1.1rem">${r.emoji}</span>
            <div style="flex:1">
              <div style="font-size:.75rem;font-weight:700">
                ${r.nom}
              </div>
              <div style="font-size:.58rem;color:var(--text-muted)">
                ${r.macros}
              </div>
            </div>
            <span style="font-size:.6rem;padding:2px 7px;
                         background:${r.color}22;
                         border:1px solid ${r.color}44;
                         border-radius:99px;color:${r.color};
                         font-weight:700">
              ${r.moment}
            </span>
          </div>`).join('')}
      </div>
      <div style="margin-top:8px;text-align:center;
                  font-size:.65rem;color:var(--fd-indigo)">
        💧 ${nut.eau}L d'eau / jour
      </div>
    </div>

    <!-- Boutons -->
    <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px">
      <button onclick="_obModifierProgramme()"
              style="padding:10px;
                     background:rgba(255,255,255,0.06);
                     border:1px solid rgba(255,255,255,0.1);
                     border-radius:var(--radius-md);
                     font-size:.72rem;font-weight:700;
                     color:var(--text-muted);cursor:pointer">
        ✏️ Modifier
      </button>
      <button onclick="_obValiderProgramme()"
              style="padding:10px;background:var(--fd-indigo);
                     border:none;border-radius:var(--radius-md);
                     font-size:.82rem;font-weight:800;
                     color:white;cursor:pointer;
                     box-shadow:0 4px 16px rgba(75,75,249,0.4)">
        ✅ J'adopte ce programme !
      </button>
    </div>
  `;
}

// ✅ Générer le planning qui commence aujourd'hui
function _genererPlanningDepuisAujourdhui(style, nbJours, objectif) {
  const aujourdhuiIdx = Utils.indexJourSemaine(Utils.aujourd_hui());
  const labels        = ['LUN','MAR','MER','JEU','VEN','SAM','DIM'];

  // ✅ Emojis par style
  const emojisParStyle = {
    ppl: [
      { emoji:'⬆️', muscles:'Pec · Épaules · Tri' },
      { emoji:'⬇️', muscles:'Dos · Biceps'         },
      { emoji:'🦵', muscles:'Jambes · Fessiers'     }
    ],
    full_body: [
      { emoji:'🔄', muscles:'Full Body A' },
      { emoji:'🔄', muscles:'Full Body B' }
    ],
    upper_lower: [
      { emoji:'💪', muscles:'Haut du corps'  },
      { emoji:'🦵', muscles:'Bas du corps'   }
    ]
  };

  const modeles  = emojisParStyle[style] || emojisParStyle.ppl;
  const planning = Array.from({length: 7}, (_, i) => ({
    jour:        i,
    label:       labels[i],
    seanceEmoji: null,
    seanceMuscles: null,
    estAujourdhui: i === aujourdhuiIdx
  }));

  // ✅ Distributions selon nombre de jours
  const distributions = {
    3: [0, 2, 4],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
    6: [0, 1, 2, 3, 4, 5]
  };

  let joursActifs = distributions[nbJours] || [0, 1, 3, 4];

  // ✅ RÉORDONNER pour commencer par aujourd'hui
  // Trouver si aujourd'hui est un jour d'entraînement
  // Sinon, décaler pour que le prochain jour soit demain
  const joursDecales = [];
  for (let offset = 0; offset < 7; offset++) {
    const jourCible = (aujourdhuiIdx + offset) % 7;
    if (joursDecales.length < nbJours) {
      // Vérifier si ce jour était prévu dans la distribution
      const positionDansDistrib = joursActifs.indexOf(
        (jourCible - (joursActifs[0] || 0) + 7) % 7
      );
      joursDecales.push(jourCible);
    }
  }

  // ✅ Approche simple : placer les séances en commençant par aujourd'hui
  const joursFinaux = [];
  let compteJours   = 0;
  for (let offset = 0; offset < 7 && compteJours < nbJours; offset++) {
    const jourCible = (aujourdhuiIdx + offset) % 7;

    // Éviter 2 jours consécutifs sauf si 5-6 jours/semaine
    const dernierAjoute = joursFinaux[joursFinaux.length - 1];
    const estConsecutif = dernierAjoute !== undefined
      && (jourCible - dernierAjoute + 7) % 7 === 1;

    if (nbJours <= 4 && estConsecutif && compteJours > 0) {
      continue; // Sauter les jours consécutifs pour laisser récupérer
    }

    joursFinaux.push(jourCible);
    compteJours++;
  }

  // ✅ Si on n'a pas assez de jours (à cause des contraintes)
  // Remplir les jours manquants
  if (joursFinaux.length < nbJours) {
    for (let i = 0; i < 7 && joursFinaux.length < nbJours; i++) {
      const jourCible = (aujourdhuiIdx + i) % 7;
      if (!joursFinaux.includes(jourCible)) {
        joursFinaux.push(jourCible);
      }
    }
    joursFinaux.sort((a, b) => {
      const ra = (a - aujourdhuiIdx + 7) % 7;
      const rb = (b - aujourdhuiIdx + 7) % 7;
      return ra - rb;
    });
  }

  // ✅ Assigner les séances
  joursFinaux.forEach((jourIdx, i) => {
    const modele = modeles[i % modeles.length];
    planning[jourIdx].seanceEmoji    = modele.emoji;
    planning[jourIdx].seanceMuscles  = modele.muscles;
  });

  return planning;
}

// ✅ Séances résumées pour affichage
function _getSeancesPourStyle(style, objectif, niveau) {
  const dureeBase = niveau === 'debutant' ? 60
                  : niveau === 'avance'   ? 75
                  : 65;

  const seancesParStyle = {
    ppl: [
      { emoji:'⬆️', nom:'Push',
        muscles:'Pectoraux · Épaules · Triceps',
        duree: dureeBase },
      { emoji:'⬇️', nom:'Pull',
        muscles:'Dos · Biceps · Épaules Postérieures',
        duree: dureeBase },
      { emoji:'🦵', nom:'Legs',
        muscles:'Quadriceps · Ischio · Fessiers',
        duree: dureeBase + 5 }
    ],
    full_body: [
      { emoji:'🔄', nom:'Full Body A',
        muscles:'Force — Squat · Bench · Row',
        duree: dureeBase },
      { emoji:'🔄', nom:'Full Body B',
        muscles:'Volume — Deadlift · Press · Pull',
        duree: dureeBase }
    ],
    upper_lower: [
      { emoji:'💪', nom:'Upper',
        muscles:'Pectoraux · Dos · Épaules · Bras',
        duree: dureeBase },
      { emoji:'🦵', nom:'Lower',
        muscles:'Quadriceps · Ischio · Fessiers · Mollets',
        duree: dureeBase + 5 }
    ]
  };

  return seancesParStyle[style] || seancesParStyle.ppl;
}

// ✅ Valider le programme proposé
function _obValiderProgramme() {
  window._obProgrammeValide = true;
  Utils.vibrer([50, 30, 50]);
  Utils.toast('✅ Programme adopté !', 'success', 1500);
  // ✅ FIX — Aller directement à l'étape finale (7→8 = terminer)
  _terminerOb();
}

// ✅ Ouvrir le questionnaire IA complet
function _obModifierProgramme() {
  window._obOuvrirIA = true;
  Utils.toast('💡 Tu pourras personnaliser depuis Coach IA', 'info', 2500);
  _terminerOb(); // ← Correct
}

// ════════════════════════════════════════════════════════
// ✅ CORPS SVG ANATOMIQUE — Onboarding
// ════════════════════════════════════════════════════════
function _renderCorpsSVGOnboarding(musclesCibles) {

  const CFG = {
    pectoraux:  { label:'Pectoraux',        couleur:'#4b4bf9' },
    deltoides:  { label:'Deltoïdes',        couleur:'#bfa1ff' },
    biceps:     { label:'Biceps',           couleur:'#8bf0bb' },
    avantbras:  { label:'Avant-bras',       couleur:'#8bf0bb' },
    abdominaux: { label:'Abdominaux',       couleur:'#f9ef77' },
    quadriceps: { label:'Quadriceps',       couleur:'#22c55e' },
    trapeze:    { label:'Trapèzes',         couleur:'#8bf0bb' },
    dorsal:     { label:'Grand Dorsal',     couleur:'#4b4bf9' },
    lombaires:  { label:'Lombaires',        couleur:'#bfa1ff' },
    fessiers:   { label:'Fessiers',         couleur:'#ff8d96' },
    ischio:     { label:'Ischio-jambiers',  couleur:'#f9ef77' },
    mollets:    { label:'Mollets',          couleur:'#bfa1ff' },
    triceps:    { label:'Triceps',          couleur:'#ff8d96' }
  };

  const sel = new Set(musclesCibles);

  const chipsHTML = sel.size === 0 ? `
    <span style="font-size:.72rem;color:var(--text-muted);
                 font-style:italic">
      Aucun muscle ciblé — programme complet
    </span>` :
    [...sel].map(m => {
      const cfg = CFG[m];
      if (!cfg) return '';
      return `
        <span onclick="_toggleMuscleOb('${m}')"
              style="display:inline-flex;align-items:center;
                     gap:5px;padding:5px 12px;
                     background:${cfg.couleur}22;
                     border:1px solid ${cfg.couleur}66;
                     border-radius:99px;font-size:.68rem;
                     font-weight:700;cursor:pointer;
                     color:${cfg.couleur}">
          ${cfg.label}
          <span style="opacity:.6;font-size:.6rem">✕</span>
        </span>`;
    }).join('');

  return `
    <div style="text-align:center;margin-bottom:10px;
                font-size:.65rem;font-weight:700;
                text-transform:uppercase;letter-spacing:.1em;
                color:var(--text-muted)">
      Clique sur les zones à cibler
    </div>

    <!-- IMAGE + MAP -->
    <div style="position:relative;display:inline-block;
                width:100%;text-align:center;
                margin-bottom:12px">
      <img id="ob-body-img"
           src="Capture d'écran 2026-05-24 204800.png"
           usemap="#ob-image-map"
           onload="_initObMuscleMap(window._obData?.muscles_cibles || [])"
           style="max-width:100%;height:auto;
                  border-radius:12px;display:inline-block;
                  max-height:360px;object-fit:contain;
                  mix-blend-mode:multiply"
           alt="Carte musculaire"/>
    </div>

    <map name="ob-image-map" id="ob-image-map">

      <!-- ══ FACE AVANT ══ -->
      <area data-muscle="pectoraux" href="#" shape="poly"
            coords="200,204,206,201,212,197,216,191,221,187,226,180,212,197,230,174,235,169,241,162,246,158,252,154,258,154,265,152,272,152,278,153,284,154,289,155,296,159,297,166,297,171,297,180,297,205,295,212,291,218,284,224,278,229,270,232,261,235,251,234,242,232,233,228,225,221,219,213,212,208,205,206">
      <area data-muscle="pectoraux" href="#" shape="poly"
            coords="299,207,302,213,308,220,314,224,318,227,326,231,333,233,342,234,350,233,358,230,366,226,373,219,378,216,383,211,388,207,395,205,390,200,382,196,377,190,370,182,365,175,359,167,352,161,343,157,333,153,324,153,316,152,310,153,304,156,300,161,298,167,299,189">
      <area data-muscle="biceps" href="#" shape="poly"
            coords="175,215,186,209,194,208,202,208,209,210,213,214,216,222,215,231,213,238,209,246,204,251,192,266,185,275,177,283,167,287,156,285,151,275,151,262,153,252,160,237,165,228">
      <area data-muscle="biceps" href="#" shape="poly"
            coords="422,213,432,227,436,237,440,245,443,255,445,266,445,276,442,284,432,288,422,284,414,277,407,269,402,260,394,251,388,245,384,238,382,228,381,220,383,211,390,208,398,206,409,207">
      <area data-muscle="deltoides" href="#" shape="poly"
            coords="177,211,181,200,184,188,189,179,192,171,197,163,204,158,213,154,221,152,229,151,236,150,241,150,247,151,253,151,258,152,252,157,247,160,243,164,236,170,231,175,226,182,222,188,215,195,209,199,203,203,196,206,187,208">
      <area data-muscle="deltoides" href="#" shape="poly"
            coords="339,153,348,149,356,149,366,148,376,151,385,153,391,157,398,161,403,167,408,172,411,181,412,187,415,193,419,201,421,211,411,207,403,205,395,202,387,198,381,192,372,182,367,175,362,167,354,161,347,156">
      <area data-muscle="trapeze" href="#" shape="poly"
            coords="270,125,269,144,266,149,260,152,253,152,246,150,238,149,231,149,239,143,246,141,252,139,259,136,263,133,268,131">
      <area data-muscle="trapeze" href="#" shape="poly"
            coords="327,124,326,140,328,146,333,149,338,151,344,149,350,149,357,148,363,147,356,141,349,138,341,136,334,132">
      <area data-muscle="avantbras" href="#" shape="poly"
            coords="151,259,140,271,134,279,128,290,121,298,117,310,112,320,108,329,103,341,100,350,97,356,94,362,98,365,103,369,108,369,113,367,118,361,123,355,128,351,135,347,141,340,148,332,156,322,162,312,165,306,169,299,173,292,177,285,168,287,161,289,156,285,151,277,150,269">
      <area data-muscle="avantbras" href="#" shape="poly"
            coords="445,253,447,260,451,265,458,272,463,278,467,285,471,289,474,295,476,301,480,309,483,316,501,358,500,363,498,368,490,370,483,367,479,360,472,353,464,347,457,340,449,331,442,322,436,311,430,302,426,293,417,282,423,284,429,287,436,287,442,285,445,277,446,269">
      <area data-muscle="abdominaux" href="#" shape="poly"
            coords="213,211,261,257,261,264,261,277,259,288,258,294,257,299,257,305,258,314,258,322,257,327,256,336,254,341,252,345,247,351,239,355,232,355,231,346,233,337,235,329,237,319,238,309,236,300,234,290,230,281,226,273,222,263,219,254,216,246,214,238,217,230,216,221">
      <area data-muscle="abdominaux" href="#" shape="poly"
            coords="381,213,336,259,336,267,336,274,338,280,338,287,340,296,340,304,340,313,339,318,338,324,339,332,341,337,343,344,347,349,352,352,357,354,365,354,364,341,362,328,361,313,361,301,363,291,367,283,372,272,376,262,379,255,380,247,382,241,380,232,380,222">
      <area data-muscle="abdominaux" href="#" shape="poly"
            coords="260,241,270,234,281,230,291,229,296,231,298,236,302,231,308,228,315,230,322,233,330,236,336,241,336,247,334,254,333,261,333,268,333,276,333,287,332,295,331,329,329,345,327,356,325,365,318,379,311,393,301,401,292,398,286,391,279,381,272,367,267,349,264,301,263,274,263,258">
      <area data-muscle="quadriceps" href="#" shape="poly"
            coords="230,356,241,361,252,367,258,374,265,381,271,395,275,407,279,418,284,430,287,437,291,441,296,441,295,449,294,466,291,479,287,494,279,515,275,535,272,552,268,570,262,580,256,587,248,586,242,577,239,570,236,564,230,566,223,563,220,555,216,543,214,528,212,512,212,491,214,466,214,449,221,411,226,393,228,375">
      <area data-muscle="quadriceps" href="#" shape="poly"
            coords="366,357,367,374,372,397,377,422,380,447,384,472,384,497,382,516,381,531,378,550,375,561,372,566,365,567,360,565,356,571,354,580,350,586,341,587,336,584,331,575,328,567,325,554,322,537,317,517,313,503,308,486,303,471,301,457,300,442,306,440,311,434,316,424,319,411,325,394,334,378,345,367,354,361">

      <!-- ══ FACE DOS ══ -->
      <area data-muscle="trapeze" href="#" shape="poly"
            coords="691,147,703,141,710,137,718,135,728,134,740,133,754,133,768,134,783,134,793,134,806,139,813,143,821,146,815,149,809,153,802,159,795,164,786,164,773,162,758,162,745,162,735,163,724,164,716,163,710,158,704,153,698,149">
      <area data-muscle="trapeze" href="#" shape="poly"
            coords="797,165,790,178,783,194,776,208,772,219,768,229,765,238,762,246,759,252,757,254,752,249,749,242,745,232,742,222,737,211,732,201,728,191,724,182,720,174,715,166,721,167,727,166,736,164,746,164,753,163,764,163,772,164,780,164,789,166">
      <area data-muscle="deltoides" href="#" shape="poly"
            coords="710,159,697,171,680,184,671,190,662,194,650,197,641,199,634,200,635,191,638,184,642,176,647,170,654,164,660,158,668,153,676,151,684,150,692,149,700,152">
      <area data-muscle="deltoides" href="#" shape="poly"
            coords="803,160,813,168,824,177,837,187,846,192,853,195,864,197,871,197,879,200,877,192,875,185,870,177,865,168,858,162,849,157,840,153,829,149,819,150,810,153">
      <area data-muscle="triceps" href="#" shape="poly"
            coords="668,233,645,266,640,273,634,277,626,284,621,283,619,275,617,266,613,265,606,266,601,267,603,258,607,248,611,238,615,228,620,219,626,211,632,205,638,201,645,200,651,198,658,196,664,195,664,203,666,213,668,223">
      <area data-muscle="triceps" href="#" shape="poly"
            coords="848,196,856,198,866,199,872,200,878,202,883,207,888,211,892,218,897,225,899,231,903,240,907,247,909,252,912,259,913,266,909,267,902,266,898,266,895,268,895,275,894,280,890,285,884,280,877,276,871,268,863,260,859,250,852,244,848,235,845,227,846,217,848,210,849,204">
      <area data-muscle="dorsal" href="#" shape="poly"
            coords="710,161,700,171,690,179,681,186,675,190,667,194,665,200,667,206,668,212,669,220,670,226,669,232,669,236,671,243,673,249,678,260,680,268,683,274,688,280,688,286,690,293,691,299,691,305,691,313,691,323,692,330,689,339,689,346,687,353,687,359,685,369,693,362,699,357,705,354,714,351,719,345,721,336,721,324,720,314,722,306,725,300,731,290,736,278,740,267,744,256,744,244,744,234,736,215,728,194,718,175">
      <area data-muscle="dorsal" href="#" shape="poly"
            coords="802,161,818,174,830,185,839,191,845,196,847,203,846,211,843,218,843,224,843,230,844,236,839,250,835,262,831,269,828,277,824,284,823,293,821,304,822,315,822,325,823,336,824,345,825,356,826,362,828,370,823,365,818,360,810,355,805,351,798,348,792,341,791,328,791,316,791,308,788,301,783,292,778,282,775,272,771,263,768,252,770,235,774,224,778,211,785,196,791,183,796,173">
      <area data-muscle="lombaires" href="#" shape="poly"
            coords="766,243,763,249,760,254,757,257,753,255,749,247,745,240,748,252,746,258,744,265,740,275,737,283,733,291,731,296,728,302,725,308,724,314,724,320,724,328,724,335,722,342,718,349,726,347,732,347,739,348,745,351,750,355,753,359,754,364,756,370,759,364,762,357,766,353,772,348,778,346,784,347,791,347,792,348,790,338,789,330,789,321,789,314,787,306,783,298,780,289,775,282,772,273,769,264,767,255">
      <area data-muscle="fessiers" href="#" shape="poly"
            coords="710,352,705,359,699,369,696,378,695,388,692,395,691,406,691,414,694,421,697,427,702,434,710,437,718,439,731,440,740,440,748,438,755,431,755,418,756,390,756,374,753,364,747,355,740,351,730,347,722,349">
      <area data-muscle="fessiers" href="#" shape="poly"
            coords="758,426,758,370,763,358,771,351,781,349,792,350,800,352,808,359,811,363,815,372,818,382,820,391,823,403,822,412,821,421,815,428,811,433,803,438,790,441,780,440,772,440,765,438,760,433">
      <area data-muscle="ischio" href="#" shape="poly"
            coords="810,357,820,364,828,375,830,385,833,396,836,417,841,440,845,467,845,490,845,517,844,540,836,573,829,579,823,575,812,554,809,559,809,572,808,579,805,588,797,589,790,580,786,567,779,537,765,476,762,461,758,442,756,432,764,439,773,442,785,442,792,441,804,438,817,430,822,421,825,409,823,396,818,383,814,370">
      <area data-muscle="ischio" href="#" shape="poly"
            coords="754,435,749,474,741,509,733,537,731,545,728,557,725,571,722,582,714,589,706,582,702,571,701,555,696,560,692,568,689,577,682,576,677,566,673,553,671,537,668,514,668,491,669,469,669,450,673,435,675,422,677,409,680,395,682,387,684,374,688,367,695,363,706,353,703,360,698,373,694,382,691,393,689,402,689,412,692,422,695,430,704,436,715,440,728,441,740,441,748,439">
      <area data-muscle="mollets" href="#" shape="poly"
            coords="667,615,662,628,659,640,659,656,658,667,661,682,665,690,669,694,676,694,681,685,685,676,689,672,690,674,692,680,693,688,695,694,701,696,707,694,712,687,714,678,715,667,713,637,709,628,703,622,698,625,694,629,687,626,681,620,675,615">
      <area data-muscle="mollets" href="#" shape="poly"
            coords="843,613,839,617,833,622,828,625,821,628,813,625,807,627,802,630,802,634,801,642,800,647,799,656,799,662,799,667,799,673,799,680,800,687,803,691,808,696,815,697,820,692,821,685,822,678,825,672,829,676,831,681,834,688,838,692,842,695,845,694,850,687,853,678,854,668,855,656,854,646,852,636,851,626,847,617">
    </map>

    <!-- Chips muscles sélectionnés -->
    <div id="ob-muscles-chips"
         style="display:flex;flex-wrap:wrap;gap:6px;
                justify-content:center;margin-bottom:10px;
                min-height:30px">
      ${chipsHTML}
    </div>

    <!-- Info -->
    <div style="padding:10px 14px;
                background:rgba(75,75,249,0.06);
                border:1px solid rgba(75,75,249,0.15);
                border-radius:var(--radius-md);
                font-size:.72rem;color:var(--text-muted);
                text-align:center">
      💡 Laisse vide pour un programme complet du corps
    </div>
  `;
}

// ✅ Toggle muscle dans l'onboarding
function _toggleMuscleOb(muscle) {
   // ✅ S'assurer que muscles_cibles existe
  if (!window._obData.muscles_cibles) {
    window._obData.muscles_cibles = [];
  }
  const muscles = window._obData.muscles_cibles;
  const idx     = muscles.indexOf(muscle);

  if (idx === -1) {
    muscles.push(muscle);
  } else {
    muscles.splice(idx, 1);
  }

  window._obData.muscles_cibles = muscles;
  // ✅ Log pour debug
  console.log('[Ob] Muscles:', window._obData.muscles_cibles); 

  // ✅ Re-render le composant
  const wrapper = document.getElementById('ob-muscles-wrapper');
  if (wrapper) {
    wrapper.innerHTML = _renderCorpsSVGOnboarding(muscles);
    // ✅ Réinitialiser maphilight après re-render
    _initObMuscleMap(muscles);
  }

  Utils.vibrer([20]);
}

// ✅ Init maphilight sur l'image onboarding
function _initObMuscleMap(musclesCibles) {

  const CFG = {
    pectoraux:  { r:75,  g:75,  b:249 },
    deltoides:  { r:191, g:161, b:255 },
    biceps:     { r:139, g:240, b:187 },
    avantbras:  { r:139, g:240, b:187 },
    abdominaux: { r:249, g:239, b:119 },
    quadriceps: { r:34,  g:197, b:94  },
    trapeze:    { r:139, g:240, b:187 },
    dorsal:     { r:75,  g:75,  b:249 },
    lombaires:  { r:191, g:161, b:255 },
    fessiers:   { r:255, g:141, b:150 },
    ischio:     { r:249, g:239, b:119 },
    mollets:    { r:191, g:161, b:255 },
    triceps:    { r:255, g:141, b:150 } 
  };

  function toHex(r,g,b) {
    return [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  // ✅ Attendre que l'image soit prête
  const img = document.getElementById('ob-body-img');
  if (!img) return;

  const doInit = () => {
     if (typeof imageMapResize !== 'undefined') {
      imageMapResize('#ob-image-map');
    } 
    if (typeof $ === 'undefined' || !$.fn.maphilight) return;

    // Init maphilight
    $('#ob-body-img').maphilight({
      fillColor:   '4b4bf9',
      fillOpacity: 0.35,
      stroke:      true,
      strokeColor: '4b4bf9',
      strokeWidth: 2,
      fade:        true
    });

    // ✅ Couleur par muscle + alwaysOn si sélectionné
    $('#ob-image-map area[data-muscle]').each(function() {
      const m   = $(this).data('muscle');
      const cfg = CFG[m];
      if (!cfg) return;

      const hex  = toHex(cfg.r, cfg.g, cfg.b);
      const isOn = musclesCibles.includes(m);

      $(this).data('maphilight', {
        fillColor:   hex,
        fillOpacity: isOn ? 0.5 : 0.35,
        strokeColor: hex,
        strokeWidth: isOn ? 3 : 2,
        fade:        true,
        alwaysOn:    isOn
      });
    });

    // ✅ Forcer refresh
    $('#ob-body-img').maphilight('options', {});

    // ✅ Clic sur les zones
    $('#ob-image-map area[data-muscle]').off('click').on('click', function(e) {
      e.preventDefault();
      _toggleMuscleOb($(this).data('muscle'));
    });
  };

  if (img.complete && img.naturalWidth > 0) {
    doInit();
  } else {
    img.onload = doInit;
  }
}
// ════════════════════════════════════════════════════════════
// ONBOARDING v2.0
// ════════════════════════════════════════════════════════════
function _afficherOnboarding() {
  document.getElementById('splash-screen').style.display = 'none';
  const ob = document.getElementById('onboarding-screen');
  ob.classList.remove('hidden');
  window._obData = {
  nom:             '',
  poids:           null,
  taille:          null,
  age:             null,
  genre:           null,
  objectif:        null,   // ✅ Pas de pré-sélection
  niveau:          null,   // ✅ Pas de pré-sélection
  lieu:            null,   // ✅ Pas de pré-sélection
  muscles_cibles:  [],
  // Flags pour savoir si choix manuel
  _objectifChoisi: null,
  _niveauChoisi:   null,
  _lieuChoisi:     null,
  _genreChoisi:    null
};
  ob.innerHTML = _renderEtapeOnboarding(1, window._obData);
}

function _renderEtapeOnboarding(etape, data) {
  if (typeof Profil === 'undefined') {
    console.error('[App] profil.js non chargé !');
    return `
      <div style="padding:20px;text-align:center">
        <div style="font-size:2rem">⚠️</div>
        <div style="margin-top:8px;color:var(--fd-coral)">
          Erreur chargement — recharge la page
        </div>
        <button onclick="window.location.reload()"
                class="btn-primary mt-md">
          🔄 Recharger
        </button>
      </div>`;
  } 
  const totalEtapes = 7;

  const etapes = [

    // ── ÉTAPE 1 — Infos de base ──────────────────────────
    {
      titre:     'Bienvenue sur PowerApp ! ⚡',
      sousTitre: 'Ton coach fitness personnel',
      contenu: `
        <div style="margin-top:var(--space-lg)">
          <div class="input-label">Ton prénom *</div>
          <input class="input mb-md" id="ob-nom"
                 placeholder="ex: Othmane"
                 value="${data.nom || ''}"
                 autocomplete="given-name"/>
          <div style="display:grid;
                      grid-template-columns:1fr 1fr 1fr;
                      gap:8px">
            <div>
              <div class="input-label">Poids (kg)</div>
              <input class="input" id="ob-poids"
                     type="number" placeholder="80"
                     value="${data.poids || ''}"/>
            </div>
            <div>
              <div class="input-label">Taille (cm)</div>
              <input class="input" id="ob-taille"
                     type="number" placeholder="178"
                     value="${data.taille || ''}"/>
            </div>
            <div>
              <div class="input-label">Âge</div>
              <input class="input" id="ob-age"
                     type="number" placeholder="25"
                     value="${data.age || ''}"/>
            </div>
          </div>
        </div>`
    },

    // ── ÉTAPE 2 — Genre ──────────────────────────────────
    {
      titre:     'Ton genre 👤',
      sousTitre: 'Pour personnaliser ton programme',
      contenu: `
        <div style="margin-top:var(--space-lg)">
          <div style="display:grid;
                      grid-template-columns:1fr 1fr;
                      gap:12px">
            ${[
              { val:'homme', emoji:'👨',
                label:'Homme',
                desc:'Programme orienté force\n& volume haut du corps' },
              { val:'femme', emoji:'👩',
                label:'Femme',
                desc:'Programme orienté galbe\n& bas du corps' }
            ].map(g => `
              <button onclick="_selectGenre('${g.val}',this)"
                      class="ob-genre-btn"
                      style="padding:20px 14px;
                             text-align:center;
                             background:${(data.genre || '') === g.val
                               ? 'rgba(75,75,249,0.2)'
                               : 'rgba(255,255,255,0.04)'};
                             border:2px solid ${(data.genre||'') === g.val
                               ? 'var(--fd-indigo)'
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;transition:all .2s">
                <div style="font-size:2.5rem;margin-bottom:8px">
                  ${g.emoji}
                </div>
                <div style="font-size:1rem;font-weight:800;
                            color:var(--text-primary)">
                  ${g.label}
                </div>
                <div style="font-size:.7rem;
                            color:var(--text-muted);
                            margin-top:6px;line-height:1.4;
                            white-space:pre-line">
                  ${g.desc}
                </div>
              </button>`).join('')}
          </div>
        </div>`
    },

    // ── ÉTAPE 3 — Objectif ───────────────────────────────
{
  titre:     'Ton objectif 🎯',
  sousTitre: 'Qu\'est-ce qui te motive ?',
  contenu: `
    <div style="display:grid;gap:8px;
                margin-top:var(--space-lg)">
      ${Object.entries(Profil.OBJECTIFS).map(([val, obj]) => {
        const estSelectionne = data.objectif === val
          && data._objectifChoisi === val; // ✅ Seulement si choisi manuellement
        return `
          <button onclick="_selectObj('${val}',this)"
                  class="ob-obj"
                  style="display:flex;align-items:center;
                         gap:12px;text-align:left;
                         padding:12px 16px;
                         background:${estSelectionne
                           ? `${obj.couleur}22`
                           : 'rgba(255,255,255,0.04)'};
                         border:1px solid ${estSelectionne
                           ? `${obj.couleur}66`
                           : 'rgba(255,255,255,0.12)'};
                         border-radius:var(--radius-lg);
                         cursor:pointer;width:100%;
                         color:white;font-family:inherit">
            <div style="width:42px;height:42px;flex-shrink:0;
                        border-radius:10px;
                        background:${obj.couleur}22;
                        border:1px solid ${obj.couleur}33;
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.4rem">
              ${obj.label.split(' ')[0]}
            </div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:.92rem;
                          color:white">
                ${obj.label.split(' ').slice(1).join(' ')}
              </div>
              <div style="font-size:.68rem;
                          color:rgba(255,255,255,0.5);
                          margin-top:2px">
                ${obj.desc} · ${obj.reps} reps
              </div>
            </div>
            ${estSelectionne ? `
              <div style="color:${obj.couleur};
                          font-size:1rem;flex-shrink:0">✓</div>
            ` : ''}
          </button>`;
      }).join('')}
    </div>`
},

    // ── ÉTAPE 4 — Niveau ─────────────────────────────────
{
  titre:     'Ton niveau 📊',
  sousTitre: 'Pour adapter l\'intensité',
  contenu: `
    <div style="display:grid;gap:10px;
                margin-top:var(--space-lg)">
      ${Object.entries(Profil.NIVEAUX).map(([val, niv]) => {
        const estSelectionne = data.niveau === val
          && data._niveauChoisi === val;
        return `
          <button onclick="_selectNiv('${val}',this)"
                  class="ob-niv"
                  style="padding:16px;text-align:left;
                         background:${estSelectionne
                           ? 'rgba(75,75,249,0.25)'
                           : 'rgba(255,255,255,0.04)'};
                         border:2px solid ${estSelectionne
                           ? 'var(--fd-indigo)'
                           : 'rgba(255,255,255,0.12)'};
                         border-radius:var(--radius-lg);
                         cursor:pointer;width:100%;
                         font-family:inherit;
                         display:flex;align-items:center;
                         gap:14px;transition:all .2s">
            <div style="width:52px;height:52px;flex-shrink:0;
                        border-radius:14px;
                        background:rgba(75,75,249,0.15);
                        border:1px solid rgba(75,75,249,0.2);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.6rem">
              ${niv.label.split(' ')[0]}
            </div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:.95rem;
                          color:white">
                ${niv.label.split(' ').slice(1).join(' ')}
              </div>
              <div style="font-size:.7rem;
                          color:rgba(255,255,255,0.5);
                          margin-top:3px">
                ${niv.desc} · ${niv.seances}j/sem
                · Repos ${niv.repos}s
              </div>
            </div>
            ${estSelectionne ? `
              <div style="color:var(--fd-indigo);
                          font-size:1.2rem;flex-shrink:0">✓</div>
            ` : ''}
          </button>`;
      }).join('')}
    </div>`
},

    // ── ÉTAPE 5 — Lieu ───────────────────────────────────
{
  titre:     'Où tu t\'entraînes ? 📍',
  sousTitre: 'Pour adapter les exercices',
  contenu: `
    <div style="display:grid;gap:10px;
                margin-top:var(--space-lg)">
      ${Object.entries(Profil.LIEUX).map(([val, lieu]) => {
        const estSelectionne = data.lieu === val
          && data._lieuChoisi === val;
        return `
          <button onclick="_selectLieu('${val}',this)"
                  class="ob-lieu"
                  style="padding:16px;text-align:left;
                         background:${estSelectionne
                           ? 'rgba(139,240,187,0.15)'
                           : 'rgba(255,255,255,0.04)'};
                         border:2px solid ${estSelectionne
                           ? 'var(--fd-mint)'
                           : 'rgba(255,255,255,0.12)'};
                         border-radius:var(--radius-lg);
                         cursor:pointer;width:100%;
                         font-family:inherit;
                         display:flex;align-items:center;
                         gap:14px;transition:all .2s">
            <div style="width:60px;height:60px;flex-shrink:0;
                        border-radius:16px;
                        background:rgba(139,240,187,0.1);
                        border:1px solid rgba(139,240,187,0.2);
                        display:flex;align-items:center;
                        justify-content:center;font-size:2rem">
              ${lieu.label.split(' ')[0]}
            </div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:.95rem;
                          color:white">
                ${lieu.label.split(' ').slice(1).join(' ')}
              </div>
              <div style="font-size:.72rem;
                          color:rgba(255,255,255,0.5);
                          margin-top:3px">
                ${lieu.desc}
              </div>
              <div style="font-size:.65rem;
                          color:var(--fd-mint);
                          margin-top:4px;font-weight:600">
                ✅ ${lieu.bonus}
              </div>
            </div>
            ${estSelectionne ? `
              <div style="color:var(--fd-mint);
                          font-size:1.2rem;flex-shrink:0">✓</div>
            ` : ''}
          </button>`;
      }).join('')}
    </div>`
},

   // ── ÉTAPE 6 — Corps SVG ──────────────────────────────
{
  titre:     'Tes muscles cibles 💪',
  sousTitre: 'Clique sur les zones à travailler',
  contenu: `
    <div style="margin-top:8px" id="ob-muscles-wrapper">
      ${_renderCorpsSVGOnboarding(data.muscles_cibles || [])}
    </div>`
},

    // ── ÉTAPE 7 — Programme Coach IA ─────────────────────
    {
      titre:     '🧠 Ton programme personnalisé',
      sousTitre: 'Le Coach IA analyse ton profil',
      contenu: `
        <div id="ob-programme-container"
             style="margin-top:var(--space-lg)">
          ${_renderPropositionProgramme(data)}
        </div>`
    }
  ];

  const e = etapes[etape - 1];

  return `
    <div style="max-width:480px;margin:0 auto;
                padding:var(--space-lg);
                max-height:100vh;overflow-y:auto">

      <!-- Barre de progression -->
      <div style="display:flex;justify-content:center;
                  gap:6px;margin-bottom:var(--space-lg)">
        ${Array.from({length: totalEtapes}, (_, i) => `
          <div style="width:${etape === i+1 ? 28 : 8}px;
                      height:8px;border-radius:4px;
                      background:${etape === i+1
                        ? 'var(--fd-indigo)'
                        : i+1 < etape
                          ? 'rgba(75,75,249,0.4)'
                          : 'var(--border-color)'};
                      transition:all .3s ease">
          </div>`).join('')}
      </div>

      <!-- Étape info -->
      <div style="font-size:.62rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--fd-indigo);margin-bottom:6px">
        Étape ${etape} / ${totalEtapes}
      </div>

      <div style="font-size:1.3rem;font-weight:800;
                  margin-bottom:4px;letter-spacing:-.02em">
        ${e.titre}
      </div>
      <div style="font-size:.82rem;color:var(--text-muted);
                  margin-bottom:var(--space-sm)">
        ${e.sousTitre}
      </div>

      ${e.contenu}

      <!-- Boutons navigation -->
      <div style="margin-top:var(--space-xl)">
        ${etape < totalEtapes ? `
          <button onclick="_suivantOb(${etape})"
                  class="btn-primary"
                  style="width:100%;font-size:.92rem;
                         padding:16px">
            ${etape === totalEtapes - 1
              ? '🚀 Voir mon programme !'
              : 'Suivant →'}
          </button>` : `
          <button onclick="_terminerOb()"
                  class="btn-primary"
                  style="width:100%;font-size:.92rem;
                         padding:16px">
            🚀 C'est parti !
          </button>`}
        ${etape > 1 ? `
          <button onclick="_renderEtapeOb(${etape - 1})"
                  class="btn-secondary mt-sm"
                  style="width:100%;font-size:.85rem">
            ← Retour
          </button>` : ''}
      </div>
    </div>`;
}

function _selectGenre(val, btn) {
  window._obData.genre = val;
  window._obData._genreChoisi = val;
  document.querySelectorAll('.ob-genre-btn').forEach(b => {
    b.style.background  = 'rgba(255,255,255,0.04)';
    b.style.borderColor = 'rgba(255,255,255,0.12)';
  });
  btn.style.background  = 'rgba(75,75,249,0.2)';
  btn.style.borderColor = 'var(--fd-indigo)';
  Utils.vibrer([20]);
}

function _selectObj(val, btn) {
  window._obData.objectif       = val;
  window._obData._objectifChoisi = val;
  const obj = Profil.OBJECTIFS[val];
  document.querySelectorAll('.ob-obj').forEach(b => {
    b.style.background  = 'rgba(255,255,255,0.04)';
    b.style.borderColor = 'rgba(255,255,255,0.12)';
    // ✅ Retirer le ✓ des autres boutons
    const check = b.querySelector('.ob-check');
    if (check) check.remove();
  });
  if (obj) {
    btn.style.background  = `${obj.couleur}22`;
    btn.style.borderColor = `${obj.couleur}66`;
  }
  Utils.vibrer([20]);
}

function _selectNiv(val, btn) {
  window._obData.niveau       = val;
  window._obData._niveauChoisi = val;
  document.querySelectorAll('.ob-niv').forEach(b => {
    b.style.background  = 'rgba(255,255,255,0.04)';
    b.style.borderColor = 'rgba(255,255,255,0.12)';
  });
  btn.style.background  = 'rgba(75,75,249,0.25)';
  btn.style.borderColor = 'var(--fd-indigo)';
  Utils.vibrer([20]);
}

function _selectLieu(val, btn) {
  window._obData.lieu       = val;
  window._obData._lieuChoisi = val;
  document.querySelectorAll('.ob-lieu').forEach(b => {
    b.style.background  = 'rgba(255,255,255,0.04)';
    b.style.borderColor = 'rgba(255,255,255,0.12)';
  });
  btn.style.background  = 'rgba(139,240,187,0.15)';
  btn.style.borderColor = 'var(--fd-mint)';
  Utils.vibrer([20]);
}

function _suivantOb(etapeActuelle) {

  // ── Étape 1 — Infos de base ──────────────────────────
  if (etapeActuelle === 1) {
    const nom    = document.getElementById('ob-nom')?.value?.trim();
    const poids  = parseFloat(document.getElementById('ob-poids')?.value);
    const taille = parseFloat(document.getElementById('ob-taille')?.value);
    const age    = parseInt(document.getElementById('ob-age')?.value);
    if (!nom) { Utils.toast('Entre ton prénom !', 'error'); return; }
    window._obData.nom    = nom;
    window._obData.poids  = isNaN(poids)  ? null : poids;
    window._obData.taille = isNaN(taille) ? null : taille;
    window._obData.age    = isNaN(age)    ? null : age;
  }

  // ── Étape 2 — Genre ──────────────────────────────────
  if (etapeActuelle === 2) {
    if (!window._obData.genre) {
      Utils.toast('Choisis ton genre !', 'error');
      return;
    }
  }

  // ── Étape 3 — Objectif ───────────────────────────────
if (etapeActuelle === 3) {
  if (!window._obData._objectifChoisi) {
    // ✅ Défaut silencieux sans erreur bloquante
    window._obData.objectif = 'forme';
    window._obData._objectifChoisi = 'forme';
  }
}

// ── Étape 4 — Niveau ─────────────────────────────────
if (etapeActuelle === 4) {
  if (!window._obData._niveauChoisi) {
    window._obData.niveau = 'intermediaire';
    window._obData._niveauChoisi = 'intermediaire';
  }
}

// ── Étape 5 — Lieu ───────────────────────────────────
if (etapeActuelle === 5) {
  if (!window._obData._lieuChoisi) {
    window._obData.lieu = 'salle';
    window._obData._lieuChoisi = 'salle';
  }
}

  // ── Étape 6 — Corps SVG ──────────────────────────────
// ✅ FIX — Les muscles sont déjà dans window._obData
// via _toggleMuscleOb → pas besoin de récupérer depuis Profil
if (etapeActuelle === 6) {
  // window._obData.muscles_cibles est déjà à jour
  // grâce à _toggleMuscleOb() appelé à chaque clic
  console.log(
    '[Ob] Muscles ciblés:',
    window._obData.muscles_cibles
  );
}

  const ob = document.getElementById('onboarding-screen');
  ob.innerHTML = _renderEtapeOnboarding(
    etapeActuelle + 1, window._obData
  );

  // ✅ Init maphilight si on arrive sur l'étape 6
  if (etapeActuelle + 1 === 6) {
    setTimeout(() => {
      _initObMuscleMap(window._obData.muscles_cibles || []);
    }, 200);
  }
}

function _renderEtapeOb(etape) {
  document.getElementById('onboarding-screen').innerHTML =
    _renderEtapeOnboarding(etape, window._obData);
}

// ════════════════════════════════════════════════════════════
// ONBOARDING — _terminerOb() v4.0
// ════════════════════════════════════════════════════════════
function _terminerOb() {
  try {
    // ✅ FIX v4.0 — Vérifier que Profil.js est chargé
    let profil = {};
    if (typeof Profil !== 'undefined' && Profil.set) {
      profil = Profil.set({
        nom:            window._obData.nom      || 'Athlète',
        poids:          window._obData.poids,
        taille:         window._obData.taille,
        age:            window._obData.age,
        genre:          window._obData.genre    || 'homme',
        objectif:       window._obData.objectif || 'forme',
        niveau:         window._obData.niveau   || 'intermediaire',
        lieu:           window._obData.lieu     || 'salle',
        muscles_cibles: window._obData.muscles_cibles || [],
        avatar:         '💪',
        dateCreation:   Utils.aujourd_hui()
      });
    } else {
      // ✅ Fallback si Profil.js absent
      const data = {
        nom:            window._obData.nom      || 'Athlète',
        poids:          window._obData.poids    || 80,
        taille:         window._obData.taille   || 175,
        age:            window._obData.age      || 25,
        genre:          window._obData.genre    || 'homme',
        objectif:       window._obData.objectif || 'forme',
        niveau:         window._obData.niveau   || 'intermediaire',
        lieu:           window._obData.lieu     || 'salle',
        muscles_cibles: window._obData.muscles_cibles || [],
        avatar:         '💪',
        dateCreation:   Utils.aujourd_hui()
      };
      Utils.storage.set('ft_profil', data);
      Utils.storage.set('ft_profil_onboarding', data);
      profil = data;
    }

    Programme.setDateDebut(Utils.aujourd_hui());

    try { Gamification.ajouterXP(200, 'Bienvenue'); } catch(e) {}

    // ✅ FIX v7.0 — Générer programme IA avec protection Coach
    if (window._obProgrammePropose) {
      try {
        // Vérifier que Coach est chargé
        if (typeof Coach === 'undefined' || !Coach?.ProgrammeIA) {
          console.warn(
            '[Onboarding] Coach.js non chargé — programme ignoré'
          );
        } else {
          const config = {
            ...window._obProgrammePropose,
            jours_specifiques: null
          };

          const aujourdhuiIdx = Utils.indexJourSemaine(
            Utils.aujourd_hui()
          );
          const nbJours    = config.nbJours || 4;
          const joursFinaux = [];

          for (
            let offset = 0;
            offset < 7 && joursFinaux.length < nbJours;
            offset++
          ) {
            const jourCible = (aujourdhuiIdx + offset) % 7;
            const dernier   = joursFinaux[joursFinaux.length - 1];
            const estConsec = dernier !== undefined
              && (jourCible - dernier + 7) % 7 === 1;

            if (nbJours <= 4 && estConsec
                && joursFinaux.length > 0) {
              continue;
            }
            joursFinaux.push(jourCible);
          }

          if (joursFinaux.length < nbJours) {
            for (
              let i = 0;
              i < 7 && joursFinaux.length < nbJours;
              i++
            ) {
              const jourCible = (aujourdhuiIdx + i) % 7;
              if (!joursFinaux.includes(jourCible)) {
                joursFinaux.push(jourCible);
              }
            }
          }

          config.jours_specifiques = joursFinaux;

          const programme = Coach.ProgrammeIA.generer(config);
          console.log(
            '[Onboarding] Programme IA généré ✅',
            programme
          );
          Utils.toast(
            `🧠 Programme ${programme?.styleLabel || 'IA'} activé !`,
            'success', 3000
          );
        }
      } catch(e) {
        console.warn(
          '[Onboarding] Erreur génération programme:', e
        );
      }
    }

    // ✅ FIX v7.0 — Ouvrir IA avec protection Coach
    if (window._obOuvrirIA) {
      window._obOuvrirIA = false;
      document.getElementById('onboarding-screen')
        ?.classList.add('hidden');
      const appWrapper = document.getElementById('app-wrapper');
if (appWrapper) {
  appWrapper.style.display       = 'flex';
  appWrapper.style.flexDirection = 'column';
  appWrapper.style.minHeight     = '100vh';
}
      naviguer('home');

      // Vérifier Coach avant d'ouvrir
      if (typeof Coach !== 'undefined' && Coach?.ProgrammeIA) {
        setTimeout(() => {
          Coach.ProgrammeIA._modeQuestionnaire = true;
          Coach.ProgrammeIA._etapeActuelle     = 0;
          Coach.ProgrammeIA._reponses          = {};
          naviguer('adaptatif');
        }, 500);
      } else {
        console.warn(
          '[Onboarding] Coach.js absent — redirection home'
        );
      }
      return;
    }

    document.getElementById('onboarding-screen')
      ?.classList.add('hidden');
    document.getElementById('app-wrapper')
      ?.style.setProperty('display', 'flex');

    naviguer('home');

    Utils.toast(
      `Bienvenue ${profil.nom || 'Athlète'} ! 🎉`,
      'success', 4000
    );

    try { Utils.confetti(2000); } catch(e) {}

    window._obProgrammePropose = null;
    window._obProgrammeValide  = null;
    window._obOuvrirIA         = null;

  } catch(e) {
    console.error('[App] Erreur onboarding:', e);
    document.getElementById('onboarding-screen')
      ?.classList.add('hidden');
    document.getElementById('app-wrapper')
      ?.style.setProperty('display', 'flex');
    naviguer('home');
  }
}
function _genererMessageCoach(nom, genre, objectif, muscles,
                               corpsComplet, styleLabel, nbJours, lieu) {
  const prenom = nom || 'Athlète';
  const g = genre === 'femme';

  const lieuMsg = {
    salle:  'en salle',
    maison: 'à la maison',
    dehors: 'en extérieur'
  }[lieu] || 'en salle';

  // ✅ Corps complet
  if (corpsComplet) {
    const msgs = {
      prise_masse: `Salut ${prenom} ! Pour ta prise de masse ${lieuMsg}, je t'ai concocté un programme ${styleLabel} sur ${nbJours} jours. On va maximiser le volume et les charges progressives. Let's go ! 💪`,
      perte_poids: `Salut ${prenom} ! Pour perdre du gras ${lieuMsg} tout en gardant le muscle, le ${styleLabel} sur ${nbJours} jours est parfait. Cardio + force = combo gagnant ! 🔥`,
      seche:       `Salut ${prenom} ! Pour ta sèche ${lieuMsg}, le ${styleLabel} sur ${nbJours} jours va maximiser ta dépense calorique. On garde les charges hautes ! ⚡`,
      force:       `Salut ${prenom} ! Pour développer ta force ${lieuMsg}, l'${styleLabel} sur ${nbJours} jours avec charges lourdes est optimal. Concentre-toi sur les grands mouvements ! 🏋️`,
      endurance:   `Salut ${prenom} ! Pour ton endurance ${lieuMsg}, le ${styleLabel} sur ${nbJours} jours avec hautes reps est parfait. On va dépasser tes limites ! 🏃`,
      forme:       `Salut ${prenom} ! Pour ta forme générale ${lieuMsg}, le ${styleLabel} sur ${nbJours} jours est l'approche la plus équilibrée. Corps sain, esprit sain ! ✨`
    };
    return msgs[objectif] || msgs.forme;
  }

  // ✅ Muscles ciblés
  const musclesLabels = {
    pectoraux: 'les pectoraux', deltoides: 'les épaules',
    biceps: 'les biceps',       triceps: 'les triceps',
    abdominaux: 'les abdos',    quadriceps: 'les quadriceps',
    dorsal: 'le dos',           fessiers: 'les fessiers',
    ischio: 'les ischio-jambiers', mollets: 'les mollets',
    trapeze: 'les trapèzes',    lombaires: 'les lombaires',
    avantbras: 'les avant-bras'
  };

  const musclesNoms = muscles.map(m => musclesLabels[m] || m).join(', ');

  if (g) {
    return `Salut ${prenom} ! 🌸 J'ai analysé tes zones cibles : ${musclesNoms}. J'ai créé un programme féminin spécialisé ${lieuMsg} sur ${nbJours} jours, axé sur le galbe, le renforcement et l'esthétique. On va sculpter exactement les zones que tu veux ! 💪`;
  }

  return `Salut ${prenom} ! J'ai analysé tes muscles cibles : ${musclesNoms}. J'ai créé un programme spécialisé ${lieuMsg} sur ${nbJours} jours pour maximiser le développement de ces groupes. Programme personnalisé à 100% ! 🔥`;
}
function _getSeancesAdaptees(style, objectif, niveau, genre, lieu, muscles) {
  const duree = niveau === 'debutant' ? 45
              : niveau === 'avance'   ? 75 : 60;

  const g = genre === 'femme';

  // ✅ Exercices selon lieu
  const EXOS = {
    salle: {
      pectoraux:  ['Développé couché','Écarté poulie','Dips'],
      deltoides:  ['Développé militaire','Élévations lat.','Face pull'],
      biceps:     ['Curl barre','Curl incliné','Marteau'],
      triceps:    ['Dips','Extension câble','Skull crusher'],
      abdominaux: ['Crunch câble','Relevé jambes','Planche'],
      quadriceps: ['Squat','Presse','Fentes'],
      dorsal:     ['Tractions','Rowing barre','Tirage poulie'],
      fessiers:   ['Hip thrust','Fentes bulgares','Kickback'],
      ischio:     ['Leg curl','Soulevé terre jambes tendues','Nordic'],
      mollets:    ['Mollets debout machine','Mollets assis'],
      trapeze:    ['Shrug barre','Rowing vertical','Face pull'],
      lombaires:  ['Hyperextension','Good morning','Soulevé terre']
    },
    maison: {
      pectoraux:  ['Pompes','Pompes déclinées','Pompes diamant'],
      deltoides:  ['Press haltères','Élévations lat.','Pike push-up'],
      biceps:     ['Curl haltères','Curl concentré','Chin-up'],
      triceps:    ['Dips chaise','Extension haltère','Pompes triceps'],
      abdominaux: ['Crunch','Mountain climber','Planche'],
      quadriceps: ['Squat poids corps','Fentes','Squat sauté'],
      dorsal:     ['Superman','Row haltères','Pull-up'],
      fessiers:   ['Hip thrust sol','Fentes','Donkey kick'],
      ischio:     ['Good morning','Nordic curl','Fentes marche'],
      mollets:    ['Mollets debout','Sauts mollets'],
      trapeze:    ['Shrug haltères','Row haltères'],
      lombaires:  ['Superman','Bird dog','Good morning']
    },
    dehors: {
      pectoraux:  ['Pompes','Pompes sur banc','Dips parallèles'],
      deltoides:  ['Pike push-up','Handstand wall','Élévations'],
      biceps:     ['Chin-up barre','Curl élastique'],
      triceps:    ['Dips parallèles','Pompes triceps'],
      abdominaux: ['Crunch','Planche','L-sit'],
      quadriceps: ['Squat','Fentes','Sprint côte'],
      dorsal:     ['Pull-up','Inverted row','Tractions'],
      fessiers:   ['Hip thrust banc','Fentes','Sprints'],
      ischio:     ['Nordic curl','Fentes marche','Deadlift élastique'],
      mollets:    ['Mollets escalier','Sauts'],
      trapeze:    ['Pull-up prise large','Inverted row'],
      lombaires:  ['Superman','Bird dog']
    }
  };

  const exoLieu = EXOS[lieu] || EXOS.salle;

  // ✅ Programme corps complet
  if (muscles.length === 0) {
    if (g) {
      // Programme femme
      return [
        {
          emoji: '🍑', nom: 'Lower Body Féminin',
          muscles: 'Fessiers · Quadriceps · Ischio',
          duree, lieu,
          exercices: [
            ...(exoLieu.fessiers?.slice(0,2) || []),
            ...(exoLieu.quadriceps?.slice(0,1) || []),
            ...(exoLieu.ischio?.slice(0,1) || [])
          ]
        },
        {
          emoji: '💪', nom: 'Upper Body Féminin',
          muscles: 'Épaules · Dos · Bras',
          duree, lieu,
          exercices: [
            ...(exoLieu.deltoides?.slice(0,2) || []),
            ...(exoLieu.dorsal?.slice(0,1) || []),
            ...(exoLieu.biceps?.slice(0,1) || [])
          ]
        },
        {
          emoji: '🔥', nom: 'Core & Cardio',
          muscles: 'Abdos · Lombaires · Cardio',
          duree: duree - 10, lieu,
          exercices: [
            ...(exoLieu.abdominaux?.slice(0,2) || []),
            ...(exoLieu.lombaires?.slice(0,1) || []),
            'Burpees'
          ]
        }
      ];
    }

    // Programme homme
    return [
      {
        emoji: '⬆️', nom: 'Push Day',
        muscles: 'Pectoraux · Épaules · Triceps',
        duree, lieu,
        exercices: [
          ...(exoLieu.pectoraux?.slice(0,2) || []),
          ...(exoLieu.deltoides?.slice(0,1) || []),
          ...(exoLieu.triceps?.slice(0,1) || [])
        ]
      },
      {
        emoji: '⬇️', nom: 'Pull Day',
        muscles: 'Dos · Biceps · Trapèzes',
        duree, lieu,
        exercices: [
          ...(exoLieu.dorsal?.slice(0,2) || []),
          ...(exoLieu.biceps?.slice(0,1) || []),
          ...(exoLieu.trapeze?.slice(0,1) || [])
        ]
      },
      {
        emoji: '🦵', nom: 'Legs Day',
        muscles: 'Quadriceps · Ischio · Fessiers',
        duree, lieu,
        exercices: [
          ...(exoLieu.quadriceps?.slice(0,2) || []),
          ...(exoLieu.ischio?.slice(0,1) || []),
          ...(exoLieu.fessiers?.slice(0,1) || [])
        ]
      }
    ];
  }

  // ✅ Programme muscles ciblés
  const seances = [];
  const musclesUniques = [...new Set(muscles)];

  // Grouper les muscles par séance
  const pushMuscles = musclesUniques.filter(m =>
    ['pectoraux','deltoides','triceps'].includes(m));
  const pullMuscles = musclesUniques.filter(m =>
    ['dorsal','biceps','trapeze','avantbras'].includes(m));
  const legsMuscles = musclesUniques.filter(m =>
    ['quadriceps','fessiers','ischio','mollets'].includes(m));
  const coreMuscles = musclesUniques.filter(m =>
    ['abdominaux','lombaires'].includes(m));

  if (pushMuscles.length > 0) {
    seances.push({
      emoji: '⬆️',
      nom: g ? 'Haut du corps Féminin' : 'Push — Poussée',
      muscles: pushMuscles.join(' · '),
      duree, lieu,
      exercices: pushMuscles.flatMap(m =>
        exoLieu[m]?.slice(0, Math.ceil(3/pushMuscles.length)) || []
      ).slice(0, 5)
    });
  }

  if (pullMuscles.length > 0) {
    seances.push({
      emoji: '⬇️',
      nom: g ? 'Dos & Bras Féminin' : 'Pull — Tirage',
      muscles: pullMuscles.join(' · '),
      duree, lieu,
      exercices: pullMuscles.flatMap(m =>
        exoLieu[m]?.slice(0, Math.ceil(3/pullMuscles.length)) || []
      ).slice(0, 5)
    });
  }

  if (legsMuscles.length > 0) {
    seances.push({
      emoji: g ? '🍑' : '🦵',
      nom: g ? 'Lower Body Sculpté' : 'Legs — Jambes',
      muscles: legsMuscles.join(' · '),
      duree, lieu,
      exercices: legsMuscles.flatMap(m =>
        exoLieu[m]?.slice(0, Math.ceil(3/legsMuscles.length)) || []
      ).slice(0, 5)
    });
  }

  if (coreMuscles.length > 0) {
    seances.push({
      emoji: '🔥',
      nom: 'Core & Gainage',
      muscles: coreMuscles.join(' · '),
      duree: duree - 10, lieu,
      exercices: coreMuscles.flatMap(m =>
        exoLieu[m]?.slice(0,2) || []
      ).slice(0, 5)
    });
  }

  // Si aucune séance générée → full body
  if (seances.length === 0) {
    seances.push({
      emoji: '🔄',
      nom: 'Full Body',
      muscles: 'Corps complet',
      duree, lieu,
      exercices: ['Squat', 'Pompes', 'Row', 'Planche', 'Fentes']
    });
  }

  return seances;
}
function _getRecettesAdaptees(genre, objectif) {
  const g = genre === 'femme';

  const RECETTES = {
    // ── PRISE DE MASSE ──
    prise_masse: {
      homme: [
        { emoji:'🍗', nom:'Riz + Poulet + Légumes',
          macros:'P:45g · G:65g · L:8g · 520kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🥛', nom:'Shake protéiné + Avoine + Banane',
          macros:'P:35g · G:55g · L:5g · 400kcal',
          moment:'Post-séance', color:'var(--fd-indigo)' },
        { emoji:'🥩', nom:'Steak + Patate douce + Brocoli',
          macros:'P:50g · G:45g · L:12g · 490kcal',
          moment:'Dîner', color:'var(--fd-lemon)' }
      ],
      femme: [
        { emoji:'🍗', nom:'Poulet grillé + Quinoa + Avocat',
          macros:'P:35g · G:40g · L:15g · 440kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🥤', nom:'Smoothie protéiné + Fruits rouges',
          macros:'P:25g · G:35g · L:6g · 290kcal',
          moment:'Post-séance', color:'var(--fd-lavender)' },
        { emoji:'🐟', nom:'Saumon + Riz basmati + Légumes verts',
          macros:'P:38g · G:42g · L:14g · 450kcal',
          moment:'Dîner', color:'var(--fd-indigo)' }
      ]
    },
    // ── PERTE DE POIDS ──
    perte_poids: {
      homme: [
        { emoji:'🥗', nom:'Salade thon + œufs + légumes',
          macros:'P:40g · G:15g · L:12g · 330kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🍳', nom:'Omelette + Épinards + Fromage blanc',
          macros:'P:30g · G:8g · L:10g · 245kcal',
          moment:'Matin', color:'var(--fd-lemon)' },
        { emoji:'🐟', nom:'Cabillaud vapeur + Légumes rôtis',
          macros:'P:35g · G:20g · L:5g · 265kcal',
          moment:'Dîner', color:'var(--fd-indigo)' }
      ],
      femme: [
        { emoji:'🥗', nom:'Salade Caesar légère + Poulet',
          macros:'P:28g · G:12g · L:8g · 230kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🍓', nom:'Bowl açaï + Granola + Fruits',
          macros:'P:15g · G:38g · L:8g · 285kcal',
          moment:'Matin', color:'var(--fd-coral)' },
        { emoji:'🍲', nom:'Soupe lentilles + Légumes',
          macros:'P:20g · G:35g · L:5g · 265kcal',
          moment:'Dîner', color:'var(--fd-lavender)' }
      ]
    },
    // ── SÈCHE ──
    seche: {
      homme: [
        { emoji:'🥩', nom:'Bœuf maigre + Légumes vapeur',
          macros:'P:45g · G:10g · L:8g · 295kcal',
          moment:'Déjeuner', color:'var(--fd-coral)' },
        { emoji:'🍳', nom:'Blancs d\'œufs + Épinards',
          macros:'P:28g · G:5g · L:2g · 150kcal',
          moment:'Matin', color:'var(--fd-lemon)' },
        { emoji:'🐟', nom:'Thon + Salade verte + Citron',
          macros:'P:38g · G:5g · L:3g · 200kcal',
          moment:'Dîner', color:'var(--fd-mint)' }
      ],
      femme: [
        { emoji:'🥗', nom:'Salade de thon + Concombre + Avocat',
          macros:'P:28g · G:8g · L:10g · 235kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🍳', nom:'Omelette blancs d\'œufs + Légumes',
          macros:'P:22g · G:6g · L:3g · 140kcal',
          moment:'Matin', color:'var(--fd-lemon)' },
        { emoji:'🍗', nom:'Poulet épicé + Courgettes grillées',
          macros:'P:32g · G:8g · L:5g · 205kcal',
          moment:'Dîner', color:'var(--fd-lavender)' }
      ]
    },
    // ── FORCE ──
    force: {
      homme: [
        { emoji:'🥩', nom:'Bœuf + Riz + Patate douce',
          macros:'P:55g · G:70g · L:15g · 635kcal',
          moment:'Pré-séance', color:'var(--fd-lemon)' },
        { emoji:'🥛', nom:'Shake caséine + Beurre cacahuète',
          macros:'P:40g · G:25g · L:18g · 420kcal',
          moment:'Nuit', color:'var(--fd-indigo)' },
        { emoji:'🍗', nom:'Poulet + Pâtes complètes + Huile olive',
          macros:'P:48g · G:75g · L:14g · 620kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' }
      ],
      femme: [
        { emoji:'🥩', nom:'Bœuf maigre + Quinoa + Légumes',
          macros:'P:40g · G:50g · L:10g · 450kcal',
          moment:'Pré-séance', color:'var(--fd-lemon)' },
        { emoji:'🐟', nom:'Saumon + Patate douce + Brocoli',
          macros:'P:38g · G:45g · L:14g · 460kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🥤', nom:'Shake whey + Lait + Banane',
          macros:'P:35g · G:40g · L:6g · 350kcal',
          moment:'Post-séance', color:'var(--fd-lavender)' }
      ]
    },
    // ── ENDURANCE ──
    endurance: {
      homme: [
        { emoji:'🍝', nom:'Pâtes complètes + Sauce tomate + Dinde',
          macros:'P:35g · G:85g · L:8g · 560kcal',
          moment:'Pré-séance', color:'var(--fd-lemon)' },
        { emoji:'🍌', nom:'Bananes + Amandes + Yaourt grec',
          macros:'P:18g · G:55g · L:10g · 385kcal',
          moment:'Collation', color:'var(--fd-coral)' },
        { emoji:'🍚', nom:'Riz + Légumes + Œufs',
          macros:'P:28g · G:65g · L:10g · 470kcal',
          moment:'Dîner', color:'var(--fd-mint)' }
      ],
      femme: [
        { emoji:'🍝', nom:'Pâtes semi-complètes + Poulet',
          macros:'P:30g · G:65g · L:6g · 435kcal',
          moment:'Pré-séance', color:'var(--fd-lemon)' },
        { emoji:'🫐', nom:'Porridge avoine + Fruits rouges + Miel',
          macros:'P:12g · G:58g · L:6g · 335kcal',
          moment:'Matin', color:'var(--fd-lavender)' },
        { emoji:'🥤', nom:'Smoothie banane + Lait d\'amande + Spiruline',
          macros:'P:15g · G:45g · L:5g · 285kcal',
          moment:'Collation', color:'var(--fd-mint)' }
      ]
    },
    // ── FORME ──
    forme: {
      homme: [
        { emoji:'🍗', nom:'Poulet + Légumes + Riz complet',
          macros:'P:40g · G:50g · L:8g · 440kcal',
          moment:'Déjeuner', color:'var(--fd-mint)' },
        { emoji:'🍳', nom:'Omelette 3 œufs + Avocat + Toast',
          macros:'P:25g · G:30g · L:18g · 380kcal',
          moment:'Matin', color:'var(--fd-lemon)' },
        { emoji:'🐟', nom:'Saumon + Quinoa + Légumes verts',
          macros:'P:38g · G:40g · L:14g · 440kcal',
          moment:'Dîner', color:'var(--fd-indigo)' }
      ],
      femme: [
        { emoji:'🥑', nom:'Bowl avocat + Œufs + Légumes',
          macros:'P:22g · G:25g · L:18g · 350kcal',
          moment:'Matin', color:'var(--fd-mint)' },
        { emoji:'🍗', nom:'Poulet citron + Salade + Feta',
          macros:'P:32g · G:15g · L:12g · 300kcal',
          moment:'Déjeuner', color:'var(--fd-lemon)' },
        { emoji:'🍲', nom:'Curry légumes + Pois chiches + Riz',
          macros:'P:18g · G:55g · L:8g · 365kcal',
          moment:'Dîner', color:'var(--fd-lavender)' }
      ]
    }
  };

  const recettesObjectif = RECETTES[objectif] || RECETTES.forme;
  return recettesObjectif[genre] || recettesObjectif.homme;
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
// MENU GLOBAL — Premium Grid
// ════════════════════════════════════════════════════════════
const MenuGlobal = {
  _ouvert: false,

  toggle() { this._ouvert ? this.fermer() : this.ouvrir(); },

  ouvrir() {
    this._ouvert = true;
    const old = document.getElementById('menu-global-panel');
    if (old) old.remove();

    // ── Bouton ──
    const btn = document.getElementById('btn-menu-global');
    if (btn) {
      btn.textContent      = '✕';
      btn.style.background  = 'rgba(75,75,249,0.2)';
      btn.style.borderColor = 'rgba(75,75,249,0.4)';
      btn.style.color       = 'white';
    }

    const panel = document.createElement('div');
    panel.id    = 'menu-global-panel';
    panel.style.cssText = `
      position:fixed;
      top:var(--header-height, 56px);
      left:50%;
      transform:translateX(-50%);
      width:100%;max-width:480px;
      max-height:calc(100vh - var(--header-height,56px) - var(--nav-height,72px));
      overflow-y:auto;z-index:300;
      background:rgba(9,9,45,0.97);
      backdrop-filter:blur(32px);
      -webkit-backdrop-filter:blur(32px);
      border-bottom:1px solid rgba(75,75,249,0.2);
      box-shadow:0 20px 60px rgba(0,0,0,0.5);
      padding:16px 12px;
      scrollbar-width:none;
      animation:menuSlideDown .3s cubic-bezier(.34,1.2,.64,1);
    `;

    // ── Données ──
    let profil   = { nom:'Athlète', avatar:'💪' };
    let xp       = { total:0, niveau:{ emoji:'💪', numero:1, nom:'Débutant' } };
    let streak   = { count:0 };
    let total    = 0;
    let trophees = 0;

    try { profil   = Tracker.getProfil();    } catch(e) {}
    try { xp       = Gamification.getXP();   } catch(e) {}
    try { streak   = Tracker.getStreak();    } catch(e) {}
    try { total    = Tracker.getTotalSeances(); } catch(e) {}
    try { trophees = Gamification.getTrophees()
            .filter(t => t.debloquee).length; } catch(e) {}

    // ── Sections ──
    const sections = [
      {
        titre: '👤 Profil',
        items: [
          { page:'__edit__',  emoji:'✏️', label:'Modifier profil',    color:'#bfa1ff' },
          { page:'objectifs',   emoji:'🎯', label:'Objectifs',          color:'#ff4d6d' },
          { page:'journal',     emoji:'📔', label:'Journal',            color:'#f9ef77' },
          { page:'blessures',   emoji:'🩹', label:'Blessures',          color:'#ff8d96' },
          { page:'photos',      emoji:'📸', label:'Photos',             color:'#ff8d96' },
          { page:'gamification',emoji:'⭐', label:'XP & Niveaux',       color:'#f9ef77' }
        ]
      },
      {
        titre: '🏋️ Entraînement',
        items: [
          { page:'coach',       emoji:'🤖', label:'Coach IA',           color:'#bfa1ff' },
          { page:'defis',       emoji:'🏆', label:'Défis',              color:'#f9ef77' },
          { page:'predict',     emoji:'📈', label:'Prédictions',        color:'#8bf0bb' },
          { page:'adaptatif',   emoji:'🧠', label:'Prog. Adaptatif',    color:'#bfa1ff' },
          { page:'supersets',   emoji:'⚡', label:'Supersets',          color:'#8bf0bb' },
          { page:'circuit',     emoji:'🔥', label:'HIIT & Cardio',      color:'#f9ef77' },
          { page:'galerie',     emoji:'💪', label:'Galerie exercices',  color:'#4b4bf9' },
          { page:'calculateur', emoji:'🧮', label:'Calculateur',        color:'#8bf0bb' }
        ]
      },
      {
        titre: '📊 Données',
        items: [
          { page:'history',     emoji:'📅', label:'Historique',         color:'#4b4bf9' },
          { page:'export',      emoji:'📤', label:'Exporter',           color:'#8bf0bb' },
          { page:'social',      emoji:'📱', label:'Réseaux sociaux',    color:'#bfa1ff' },
          { page:'offline',     emoji:'📵', label:'Hors-ligne',         color:'#ff8d96' }
        ]
      },
      {
        titre: '⚙️ App',
        items: [
          { page:'themes',      emoji:'🎨', label:'Thèmes',             color:'#bfa1ff' },
          { page:'sounds',      emoji:'🔊', label:'Sons',               color:'#8bf0bb' },
          { page:'settings',    emoji:'⚙️', label:'Paramètres',         color:'#bfa1ff' }
        ]
      }
    ];

    panel.innerHTML = `

      <!-- ── Profil card ── -->
      <div onclick="MenuGlobal.naviguerEt('profil')"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.2),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:20px;padding:16px;
                  margin-bottom:20px;
                  display:flex;align-items:center;gap:14px;
                  cursor:pointer;transition:all .2s"
           onmouseenter="this.style.borderColor='rgba(75,75,249,0.5)';
                         this.style.transform='scale(1.01)'"
           onmouseleave="this.style.borderColor='rgba(75,75,249,0.3)';
                         this.style.transform='scale(1)'">

        <!-- Avatar -->
        <div style="width:52px;height:52px;
                    background:rgba(75,75,249,0.2);
                    border:2px solid rgba(75,75,249,0.4);
                    border-radius:50%;flex-shrink:0;
                    display:flex;align-items:center;justify-content:center;
                    font-size:1.8rem;
                    box-shadow:0 0 16px rgba(75,75,249,0.3);
                    animation:avatarPulse 3s ease-in-out infinite">
          ${profil.avatar || '💪'}
        </div>

        <!-- Infos -->
        <div style="flex:1;min-width:0">
          <div style="font-size:1rem;font-weight:800;color:white;
                      overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${profil.nom}
          </div>
          <div style="font-size:.72rem;color:rgba(191,161,255,0.8);margin-top:2px">
            ${xp.niveau.emoji} ${xp.niveau.nom} · ${xp.total} XP
          </div>
        </div>

        <!-- Stats mini -->
        <div style="display:flex;gap:12px;text-align:center;flex-shrink:0">
          ${[
            [total,        'Séances', '#4b4bf9'],
            [streak.count, 'Streak',  '#f9ef77'],
            [trophees,     '🏆',      '#ff8d96']
          ].map(([v, l, c]) => `
            <div>
              <div style="font-size:.95rem;font-weight:800;color:${c}">${v}</div>
              <div style="font-size:.52rem;color:rgba(255,255,255,0.4);
                          text-transform:uppercase;letter-spacing:.04em">${l}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- ── Sections grid ── -->
      ${sections.map(sec => `
        <div style="margin-bottom:20px">
          <div style="font-size:.58rem;font-weight:800;
                      text-transform:uppercase;letter-spacing:.12em;
                      color:rgba(255,255,255,0.25);
                      padding:0 4px;margin-bottom:8px">
            ${sec.titre}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            ${sec.items.map(item => `
              <div onclick="${item.page === '__edit__' 
                    ? 'MenuGlobal.fermer();setTimeout(()=>Profil._ouvrirEdition(),200)' 
                    : `MenuGlobal.naviguerEt('${item.page}')`}"
                   style="display:flex;align-items:center;gap:10px;
                          padding:11px 12px;
                          background:rgba(255,255,255,0.04);
                          border:1px solid rgba(255,255,255,0.07);
                          border-radius:14px;cursor:pointer;
                          transition:all .18s"
                   onmouseenter="
                     this.style.background='${item.color}15';
                     this.style.borderColor='${item.color}44';
                     this.style.transform='scale(1.02)'"
                   onmouseleave="
                     this.style.background='rgba(255,255,255,0.04)';
                     this.style.borderColor='rgba(255,255,255,0.07)';
                     this.style.transform='scale(1)'">
                <div style="width:32px;height:32px;border-radius:10px;
                            flex-shrink:0;
                            background:${item.color}18;
                            border:1px solid ${item.color}33;
                            display:flex;align-items:center;
                            justify-content:center;font-size:1rem">
                  ${item.emoji}
                </div>
                <span style="font-size:.78rem;font-weight:600;
                             color:rgba(255,255,255,0.8);
                             overflow:hidden;text-overflow:ellipsis;
                             white-space:nowrap;flex:1">
                  ${item.label}
                </span>
              </div>`).join('')}
          </div>
        </div>`).join('')}

      <!-- ── Reset ── -->
      <div style="padding:4px;margin-top:4px">
        <button onclick="UI.confirmerReset()"
                style="width:100%;padding:12px;
                       background:rgba(255,141,150,0.06);
                       border:1px solid rgba(255,141,150,0.15);
                       border-radius:14px;
                       color:var(--fd-coral);
                       font-size:.8rem;font-weight:600;
                       cursor:pointer;transition:all .2s"
                onmouseenter="this.style.background='rgba(255,141,150,0.12)'"
                onmouseleave="this.style.background='rgba(255,141,150,0.06)'">
          🗑️ Réinitialiser les données
        </button>
      </div>

      <div style="height:16px"></div>
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
      panel.style.animation =
        'menuSlideUp .25s cubic-bezier(.34,1,.64,1) forwards';
      setTimeout(() => panel.remove(), 240);
    }

    const btn = document.getElementById('btn-menu-global');
    if (btn) {
      btn.textContent       = '☰';
      btn.style.background  = 'var(--bg-input)';
      btn.style.borderColor = 'var(--border-color)';
      btn.style.color       = '';
    }

    document.removeEventListener(
      'click', this._fermerSidehors.bind(this)
    );
  },

  naviguerEt(page) {
    this.fermer();
    setTimeout(() => naviguer(page), 150);
  },

  _fermerSidehors(e) {
    const panel = document.getElementById('menu-global-panel');
    const btn   = document.getElementById('btn-menu-global');
    if (!panel) return;
    if (!panel.contains(e.target) && !btn?.contains(e.target)) {
      this.fermer();
    }
  }
};
window.MenuGlobal = MenuGlobal;
// ════════════════════════════════════════════════════════════
// ✅ MODE ULTRA-RAPIDE — Lancement
// ════════════════════════════════════════════════════════════
function _lancerModeUltra(seanceId) {
  try {
    if (typeof LiveUltra === 'undefined') {
      Utils.toast('Module Ultra non chargé', 'error');
      return;
    }

    const seanceComplete = Programme.getSeanceComplete(seanceId);
    if (!seanceComplete) {
      Utils.toast('Séance introuvable', 'error');
      return;
    }

    const tempsSalle = Utils.storage.get('ft_temps_salle', 60);
    const exercices  = getExercicesSelonTemps(
      seanceComplete.exercicesDetails || [],
      tempsSalle
    );

    if (!exercices.length) {
      Utils.toast('Aucun exercice disponible', 'error');
      return;
    }

    Utils.toast('⚡ Mode Ultra-Rapide !', 'success', 1500);
    Utils.vibrer([50, 30, 100]);

    try {
      if (!Tracker._seanceEnCours) {
        Tracker.demarrerSeance(seanceId);
      }
    } catch(e) {}

    LiveUltra.demarrer(seanceId, exercices);

  } catch(e) {
    console.error('[App] Erreur mode ultra:', e);
    Utils.toast('❌ Erreur lancement', 'error');
  }
}

window._lancerModeUltra = _lancerModeUltra;

console.log('✅ App.js v3.0 chargé');
