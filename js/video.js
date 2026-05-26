/* ============================================================
   PowerApp — Video.js v2.0
   Démonstrations vidéo YouTube par exercice
   + Exercices maison + Femme + getVideoId()
   + Miniature avant chargement + Bouton YouTube
   ============================================================ */

'use strict';

const VideoDemo = {

  // ════════════════════════════════════════════════════════
  // BASE DE DONNÉES VIDÉOS
  // Clés = refs exactes de la DB exercices
  // ════════════════════════════════════════════════════════
  videos: {

    // ── PECTORAUX ─────────────────────────────────────────
    bench_press:         'rT7DgCr-3pg', // Jeff Nippard — Bench Press
    incline_halteres:    'DbFgADa2PL8', // Jeff Nippard — Incline
    incline_bench:       'DbFgADa2PL8',
    decline_bench:       'LfyQTdaGQiY', // ScottHermanFitness
    dips:                'yN6Q1UI_xkE', // Jeff Nippard — Dips
    dips_triceps:        'wjUmnZH528Y', // Jeff Nippard — Dips Triceps
    flyes:               'eozdVDA78K0', // Renaissance Periodization
    cable_crossover:     'taI4XduLpTk', // Nippard Cable Fly
    push_up:             'IODxDxX7oi4', // Jeff Nippard — Pushup
    pompes:              'IODxDxX7oi4', // Alias pompes
    pompes_inclines:     'IODxDxX7oi4', // Pompes inclinées

    // ── DOS ───────────────────────────────────────────────
    tractions:           'eGo4IYlbE5g', // Jeff Nippard — Pull-up
    pull_up:             'eGo4IYlbE5g',
    chin_up:             'brhRXlOhsAM', // AthleanX
    lat_pulldown:        'CAwf7n6Luuc', // Jeff Nippard
    rowing_barre:        '6FZHhZMqDgg', // Jeff Nippard — Barbell Row
    rowing_machine:      'GZbfZ033f74', // Jeff Nippard — Seated Row
    seated_row:          'GZbfZ033f74',
    bent_over_row:       '6FZHhZMqDgg',
    tbar_row:            'j3G1dQbnABQ', // ScottHermanFitness
    soulevé_terre:       'op9kVnSso6Q', // Jeff Nippard — Deadlift
    deadlift:            'op9kVnSso6Q',
    romanian_deadlift:   'JCXUYuzwNrM', // Jeff Nippard — RDL
    pullover:            'FK2SqQxNRmA', // ScottHermanFitness
    face_pull:           'HSoHeSt2VWo', // AthleanX
    // ✅ NOUVEAU v2.0 — Maison
    inverted_row:        'GZbfZ033f74', // Australian Pull-up
    superman:            'z6PJMT2y8GQ', // Superman exercise

    // ── ÉPAULES ───────────────────────────────────────────
    dev_militaire:       'CnBmiBqp-AI', // Jeff Nippard — OHP
    overhead_press:      'CnBmiBqp-AI',
    dumbbell_press:      '6Z15_WdXmVw', // ScottHermanFitness
    elev_laterales:      'kDqklk1ZESo', // Jeff Nippard
    lateral_raise:       'kDqklk1ZESo',
    front_raise:         'sOiBHj9MEFQ', // ScottHermanFitness
    arnold_press:        'vj2w851ZHRM', // ScottHermanFitness
    upright_row:         'UcrJ2WBIXeg', // ScottHermanFitness
    // ✅ NOUVEAU v2.0
    pike_pushup:         'x7_I5SUAd00', // Pike Push-up technique

    // ── BICEPS ────────────────────────────────────────────
    curl_barre:          'kwG2ipFRgfo', // Jeff Nippard
    barbell_curl:        'kwG2ipFRgfo',
    curl_halteres:       'sAq_ocpS3zY', // Jeff Nippard
    dumbbell_curl:       'sAq_ocpS3zY',
    curl_marteau:        'zC3nLlEvin4', // Jeff Nippard
    hammer_curl:         'zC3nLlEvin4',
    preacher_curl:       'fIWP-FRFNU0', // ScottHermanFitness
    concentration_curl:  'Jvj2wf0PqB8', // ScottHermanFitness
    cable_curl:          'NFzTWp2qpiE', // ScottHermanFitness
    curl_pupitre:        'fIWP-FRFNU0', // Alias

    // ── TRICEPS ───────────────────────────────────────────
    ext_triceps_poulie:  'vB5OHsJ3EME', // Jeff Nippard
    tricep_pushdown:     'vB5OHsJ3EME',
    overhead_extension:  'YbX7Wd8jQ-Q', // ScottHermanFitness
    skull_crusher:       'NIKnG_8szOQ', // Jeff Nippard
    close_grip_bench:    'nEF0bv2FW94', // Jeff Nippard
    diamond_pushup:      'J0DXDurxX9E', // ✅ NOUVEAU v2.0

    // ── JAMBES ────────────────────────────────────────────
    squat:               'ultWZbUMPL8', // Jeff Nippard
    front_squat:         'uYumuL_G_V0', // Jeff Nippard
    presse_cuisses:      'IZxyjW7SKSA', // Jeff Nippard
    leg_press:           'IZxyjW7SKSA',
    fentes:              'QOVaHwm-Q6U', // Jeff Nippard
    lunges:              'QOVaHwm-Q6U',
    fentes_bulgares:     '2C-uNgKwPLE', // Jeff Nippard — Bulgarian
    bulgarian_split:     '2C-uNgKwPLE',
    leg_extension:       'ljO4jkNWCKk', // ScottHermanFitness
    leg_curl:            'ELOCsoDSmrg', // Jeff Nippard
    mollets:             'gwLzBJYoWlA', // Jeff Nippard
    calf_raise:          'gwLzBJYoWlA',
    sumo_squat:          '67oNKBXSBh0', // Alan Thrall — Sumo
    squat_poids_corps:   'ultWZbUMPL8', // Squat bodyweight
    squat_saute:         'Azgw4dSR-lg', // ✅ NOUVEAU v2.0 — Jump Squat

    // ── FESSIERS (Femme) ──────────────────────────────────
    hip_thrust:          'SEdqd1n0cvg', // Jeff Nippard
    hip_thrust_sol:      'SEdqd1n0cvg', // ✅ NOUVEAU v2.0 — Alias sol
    // ✅ NOUVEAU v2.0 — Exercices femme spécifiques
    donkey_kick:         'SEdqd1n0cvg', // Donkey kick
    glute_bridge:        'OUgsJ8-Vi0E', // Glute Bridge
    clamshell:           'pDJrNW-KDGY', // Clamshell exercise
    kickback_poulie:     'SEdqd1n0cvg', // Kickback câble
    abduction_machine:   'SEdqd1n0cvg', // Machine abduction

    // ── ABDOS ─────────────────────────────────────────────
    crunch:              'Xyd_fa5zoEU', // Jeff Nippard
    planche:             'pSHjTRCQxIw', // Jeff Nippard
    plank:               'pSHjTRCQxIw',
    leg_raise:           'JB2oyawG9KQ', // Jeff Nippard
    cable_crunch:        'GvjAoJaFBzE', // ScottHermanFitness
    russian_twist:       'wkD8rjkodUI', // ScottHermanFitness
    ab_wheel:            'JhEo1PxRXpk', // Jeff Nippard
    gainage:             'pSHjTRCQxIw', // Alias planche

    // ── CARDIO / HIIT (Maison) ────────────────────────────
    // ✅ NOUVEAU v2.0
    burpees:             '818X9HXFr-g', // Burpees technique
    mountain_climbers:   'cnyTQDSE884', // Mountain climbers
    jumping_jacks:       'c4DAnQ6DtF8', // Jumping jacks
    box_jump:            'FN8gfh6FMKM', // Box jump
    sprint:              '6gIMaFzj6KA', // Sprint technique
    jumping_squat:       'Azgw4dSR-lg', // Jump squat alias
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — getVideoId(ref)
  // Méthode appelée par Live.js et Stats.js
  // ════════════════════════════════════════════════════════
  getVideoId(ref) {
    if (!ref) return null;
    // Essai direct
    if (this.videos[ref]) return this.videos[ref];
    // Nettoyage ref (remplace tirets, espaces)
    const cleaned = ref.toLowerCase()
      .replace(/[-\s]/g, '_')
      .replace(/[éè]/g, 'e')
      .replace(/[à]/g, 'a');
    return this.videos[cleaned] || null;
  },

  // ✅ hasVideo(ref) — vérifier si une vidéo existe
  hasVideo(ref) {
    return !!this.getVideoId(ref);
  },

  // ════════════════════════════════════════════════════════
  // ✅ ouvrirParRef(ref, ...) — raccourci pour les exercices
  // ════════════════════════════════════════════════════════
  ouvrirParRef(ref) {
    const id = this.getVideoId(ref);
    if (!id) {
      this._ouvrirRecherche(ref);
      return;
    }
    const ex = (window.EXERCICES||{})[ref] || {};
    this.ouvrir(id, ex.nom || ref, ex.muscle || '');
  },

  // ✅ Ouvrir YouTube Search si pas de vidéo
  _ouvrirRecherche(ref) {
    const ex    = (window.EXERCICES||{})[ref] || {};
    const query = encodeURIComponent(
      `${ex.nom || ref} exercice technique musculation`
    );
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      '_blank'
    );
  },

  // ════════════════════════════════════════════════════════
  // OUVRIR LA MODAL VIDÉO — ✅ v2.0 avec miniature
  // ════════════════════════════════════════════════════════
  ouvrir(youtubeId, nomExo, muscle) {
    document.getElementById('video-modal')?.remove();

    const modal = document.createElement('div');
    modal.id    = 'video-modal';
    modal.style.cssText = `
      position:   fixed;
      inset:      0;
      z-index:    1000;
      background: rgba(9,9,45,0.92);
      display:    flex;
      align-items: center;
      justify-content: center;
      padding:    var(--space-md);
      animation:  fadeIn .2s ease;
    `;

    modal.innerHTML = `
      <div style="width:100%;max-width:480px;
                  background:var(--bg-card);
                  border-radius:var(--radius-lg);
                  overflow:hidden;
                  box-shadow:0 20px 60px rgba(0,0,0,0.5)">

        <!-- Header -->
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    padding:var(--space-md);
                    border-bottom:1px solid var(--border-color)">
          <div>
            <div style="font-weight:700;font-size:.95rem">
              ${nomExo}
            </div>
            ${muscle ? `
              <div style="font-size:.68rem;color:var(--fd-mint);
                          margin-top:2px">
                ${muscle}
              </div>` : ''}
          </div>
          <button onclick="VideoDemo.fermer()"
                  style="width:32px;height:32px;
                         background:var(--bg-input);
                         border:1px solid var(--border-color);
                         border-radius:50%;font-size:1rem;
                         cursor:pointer;display:flex;
                         align-items:center;justify-content:center;
                         color:var(--text-muted)">
            ✕
          </button>
        </div>

        <!-- ✅ NOUVEAU v2.0 — Miniature cliquable -->
        <div id="video-thumb-container"
             style="position:relative;padding-bottom:56.25%;
                    height:0;overflow:hidden;cursor:pointer"
             onclick="VideoDemo._chargerIframe('${youtubeId}')">
          <!-- Miniature YouTube -->
          <img
            src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg"
            alt="${nomExo}"
            style="position:absolute;top:0;left:0;
                   width:100%;height:100%;object-fit:cover;
                   transition:filter .2s"
            onerror="this.src='https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg'"
            onmouseover="this.style.filter='brightness(0.8)'"
            onmouseout="this.style.filter='brightness(1)'"
            />
          <!-- Bouton Play -->
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);
                      width:64px;height:64px;
                      background:rgba(255,0,0,0.9);
                      border-radius:50%;display:flex;
                      align-items:center;justify-content:center;
                      box-shadow:0 4px 20px rgba(0,0,0,0.4);
                      pointer-events:none">
            <div style="width:0;height:0;
                        border-top:12px solid transparent;
                        border-bottom:12px solid transparent;
                        border-left:20px solid white;
                        margin-left:4px">
            </div>
          </div>
          <!-- Label "Cliquer pour lire" -->
          <div style="position:absolute;bottom:8px;right:8px;
                      padding:3px 8px;background:rgba(0,0,0,0.7);
                      border-radius:99px;font-size:.62rem;
                      color:white">
            ▶ Cliquer pour lire
          </div>
        </div>

        <!-- ✅ NOUVEAU v2.0 — Bouton Ouvrir YouTube -->
        <div style="padding:var(--space-sm) var(--space-md);
                    display:flex;align-items:center;
                    justify-content:space-between">
          <span style="font-size:.65rem;color:var(--text-muted)">
            Appuie en dehors pour fermer
          </span>
          <a href="https://www.youtube.com/watch?v=${youtubeId}"
             target="_blank" rel="noopener"
             style="display:flex;align-items:center;gap:5px;
                    padding:5px 12px;background:#ff0000;
                    color:white;border-radius:99px;
                    font-size:.68rem;font-weight:700;
                    text-decoration:none">
            ▶ YouTube
          </a>
        </div>
      </div>
    `;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.fermer();
    });

    document.body.appendChild(modal);
  },

  // ✅ NOUVEAU v2.0 — Charger iframe au clic sur miniature
  _chargerIframe(youtubeId) {
    const thumbContainer = document.getElementById(
      'video-thumb-container'
    );
    if (!thumbContainer) return;

    thumbContainer.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1"
        style="position:absolute;top:0;left:0;
               width:100%;height:100%;border:none"
        allow="accelerometer; autoplay; clipboard-write;
               encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    `;

    // Remove onclick après chargement
    thumbContainer.style.cursor = 'default';
    thumbContainer.onclick      = null;
  },

  fermer() {
    const modal = document.getElementById('video-modal');
    if (modal) {
      modal.style.animation = 'fadeOut .15s ease forwards';
      setTimeout(() => modal.remove(), 150);
    }
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — renderBouton(ref)
  // Retourne un bouton HTML pour afficher la vidéo
  // ════════════════════════════════════════════════════════
  renderBouton(ref, style = '') {
    const id = this.getVideoId(ref);
    if (!id) return '';

    return `
      <button onclick="VideoDemo.ouvrirParRef('${ref}')"
              style="padding:4px 10px;
                     background:rgba(255,0,0,0.1);
                     border:1px solid rgba(255,0,0,0.3);
                     border-radius:99px;
                     color:#ff4444;
                     font-size:.65rem;font-weight:600;
                     cursor:pointer;
                     display:inline-flex;
                     align-items:center;gap:4px;
                     ${style}">
        ▶ Vidéo
      </button>`;
  }
};

window.VideoDemo = VideoDemo;
console.log(
  `✅ Video.js v2.0 chargé — ${Object.keys(VideoDemo.videos).length} vidéos`
);
