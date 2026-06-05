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
    bench_press:         '4Y2ZdHCOXok', // Jeff Nippard — Bench Press ✅
    incline_halteres:    '8iPEnn-ltC8', // Jeff Nippard — Incline DB ✅
    incline_bench:       '8iPEnn-ltC8', // alias
    decline_bench:       'LfyQTdaGQiY', // ScottHerman — Decline ✅
    dips:                '2z8JmcrW-As', // Jeff Nippard — Chest Dips ✅
    dips_triceps:        'wjUmnZH528Y', // Jeff Nippard — Tricep Dips ✅
    flyes:               'Iwe6AmxVf7o', // Jeff Nippard — Cable Fly ✅
    cable_crossover:     'Iwe6AmxVf7o', // alias
    push_up:             'IODxDxX7oi4', // Jeff Nippard — Push-up ✅
    pompes:              'IODxDxX7oi4', // alias ✅
    pompes_inclines:     'IODxDxX7oi4', // alias ✅

    // ── DOS ───────────────────────────────────────────────
    tractions:           'eGo4IYlbE5g', // Jeff Nippard — Pull-up ✅
    pull_up:             'eGo4IYlbE5g', // alias ✅
    chin_up:             'brhRXlOhsAM', // AthleanX — Chin-up ✅
    lat_pulldown:        'CAwf7n6Luuc', // Jeff Nippard — Lat Pulldown ✅
    rowing_barre:        '9efgcAjQe7E', // Jeff Nippard — Barbell Row ✅
    rowing_machine:      'GZbfZ033f74', // Jeff Nippard — Seated Row ✅
    seated_row:          'GZbfZ033f74', // alias ✅
    bent_over_row:       '9efgcAjQe7E', // alias ✅
    tbar_row:            'j3G1dQbnABQ', // ScottHerman — T-Bar Row ✅
    soulevé_terre:       'op9kVnSso6Q', // Jeff Nippard — Deadlift ✅
    deadlift:            'op9kVnSso6Q', // alias ✅
    romanian_deadlift:   'JCXUYuzwNrM', // Jeff Nippard — RDL ✅
    pullover:            'FK2SqQxNRmA', // ScottHerman — Pullover ✅
    face_pull:           'HSoHeSjovMQ', // AthleanX — Face Pull ✅ (ancien ID mort)
    inverted_row:        'rloXgjRwbRs', // ScottHerman — Inverted Row ✅
    superman:            'z6PJMT2y8GQ', // Superman exercise ✅

    // ── ÉPAULES ───────────────────────────────────────────
    dev_militaire:       'qEwKCR5JCog', // Jeff Nippard — OHP ✅
    overhead_press:      'qEwKCR5JCog', // alias ✅
    dumbbell_press:      '6Z15_WdXmVw', // ScottHerman — DB Shoulder ✅
    elev_laterales:      '3VcKaXpzqRo', // Jeff Nippard — Lateral Raise ✅
    lateral_raise:       '3VcKaXpzqRo', // alias ✅
    front_raise:         'sOiBHj9MEFQ', // ScottHerman — Front Raise ✅
    arnold_press:        '6Z15_WdXmVw', // ScottHerman — Arnold ✅
    upright_row:         'um3VTvBFsQI', // ScottHerman — Upright Row ✅
    pike_pushup:         'x7_I5SUAd00', // Pike Push-up ✅

    // ── BICEPS ────────────────────────────────────────────
    curl_barre:          'kwG2ipFRgfo', // Jeff Nippard — Barbell Curl ✅
    barbell_curl:        'kwG2ipFRgfo', // alias ✅
    curl_halteres:       'ykJmrZ5v0Oo', // Jeff Nippard — DB Curl ✅ (ancien mort)
    dumbbell_curl:       'ykJmrZ5v0Oo', // alias ✅
    curl_marteau:        'TwD-YGVP4Bk', // Jeff Nippard — Hammer ✅
    hammer_curl:         'TwD-YGVP4Bk', // alias ✅
    preacher_curl:       'fIWP-FRFNU0', // ScottHerman — Preacher ✅
    concentration_curl:  'Jvj2wf0PqB8', // ScottHerman — Concentration ✅
    cable_curl:          'NFzTWp2qpiE', // ScottHerman — Cable Curl ✅
    curl_pupitre:        'fIWP-FRFNU0', // alias ✅

    // ── TRICEPS ───────────────────────────────────────────
    ext_triceps_poulie:  '2-LAMcpzODU', // Jeff Nippard — Pushdown ✅
    tricep_pushdown:     '2-LAMcpzODU', // alias ✅
    overhead_extension:  'YSrMGOMwwAs', // Jeff Nippard — Overhead ✅
    skull_crusher:       'NINSVMysHOQ', // Jeff Nippard — Skull Crusher ✅
    close_grip_bench:    'nEF0bv2FW04', // Jeff Nippard — CG Bench ✅
    diamond_pushup:      'J0DXDurxX9E', // Diamond push-up ✅

    // ── JAMBES ────────────────────────────────────────────
    squat:               'ultWZbUMPL8', // Jeff Nippard — Squat ✅
    front_squat:         'uYumuL_G_V0', // Jeff Nippard — Front Squat ✅
    presse_cuisses:      'IZxyjW7MPJQ', // Jeff Nippard — Leg Press ✅
    leg_press:           'IZxyjW7MPJQ', // alias ✅
    fentes:              'QOVaHwm-Q6U', // Jeff Nippard — Lunges ✅
    lunges:              'QOVaHwm-Q6U', // alias ✅
    fentes_bulgares:     '2C-uNgKwPLE', // Jeff Nippard — Bulgarian ✅
    bulgarian_split:     '2C-uNgKwPLE', // alias ✅
    leg_extension:       'YyvSfVjQeL0', // Jeff Nippard — Leg Ext ✅
    leg_curl:            'ELOCsoDSmrg', // Jeff Nippard — Leg Curl ✅
    mollets:             '-M4-G8p1fCI', // Jeff Nippard — Calves ✅
    calf_raise:          '-M4-G8p1fCI', // alias ✅
    sumo_squat:          '67oNKBXSBh0', // Sumo Squat ✅
    squat_poids_corps:   'ultWZbUMPL8', // alias ✅
    squat_saute:         'Azgw4dSR-lg', // Jump Squat ✅

    // ── FESSIERS ──────────────────────────────────────────
    hip_thrust:          'SEdqd1n0cvg', // Jeff Nippard — Hip Thrust ✅
    hip_thrust_sol:      'SEdqd1n0cvg', // alias ✅
    donkey_kick:         'bpnBzBDMoGo', // Donkey Kick technique ✅
    glute_bridge:        'OUgsJ8-Vi0E', // Glute Bridge ✅
    clamshell:           'pDJrNW-KDGY', // Clamshell ✅
    kickback_poulie:     'bpnBzBDMoGo', // Cable Kickback ✅
    abduction_machine:   'SEdqd1n0cvg', // Abduction machine ✅

    // ── ABDOS ─────────────────────────────────────────────
    crunch:              'Xyd_fa5zoEU', // Jeff Nippard — Crunch ✅
    planche:             'pSHjTRCQxIw', // Jeff Nippard — Plank ✅
    plank:               'pSHjTRCQxIw', // alias ✅
    leg_raise:           'l4kQd9eWclE', // Jeff Nippard — Leg Raise ✅
    cable_crunch:        'AV5Ph30KaTc', // ScottHerman — Cable Crunch ✅
    russian_twist:       'wkD8rjkodUI', // ScottHerman ✅
    ab_wheel:            'JhEo1PxRXpk', // Jeff Nippard — Ab Wheel ✅
    gainage:             'pSHjTRCQxIw', // alias planche ✅

    // ── CARDIO / HIIT ─────────────────────────────────────
    burpees:             'dZgVxmf6jkA', // Burpees technique ✅
    mountain_climbers:   'nmwgirgXLYM', // Mountain Climbers ✅
    jumping_jacks:       'c4DAnQ6DtF8', // Jumping Jacks ✅
    box_jump:            'FN8gfh6FMKM', // Box Jump ✅
    sprint:              '6gIMaFzj6KA', // Sprint technique ✅
    jumping_squat:       'Azgw4dSR-lg', // Jump Squat ✅
    kettlebell_swing:    'YSxHifyI6s8', // KB Swing ✅
    goblet_squat:        'MeIiIdhvXT4', // Goblet Squat ✅

    // ── ÉTIREMENTS RECOVERY ───────────────────────────────
    pec_porte:           'kFfCqJxMfss', // Doorway chest stretch ✅
    pec_sol:             'kFfCqJxMfss', // alias ✅
    dos_chat:            'kqnua4rHVVA', // Cat-Cow stretch ✅
    dos_enfant:          '2MJGg-dUKh0', // Child's pose ✅
    dos_pigeon:          '2MJGg-dUKh0', // Spinal rotation ✅
    epaule_cross:        '5c4WkWDnPuc', // Cross body shoulder ✅
    epaule_overhead:     '5c4WkWDnPuc', // alias ✅
    quad_debout:         'cDjLGp3JHoo', // Standing quad stretch ✅
    ischio_sol:          'g7Uhp5tpfDI', // Seated hamstring ✅
    fessiers_pigeon:     'R5XOODKH6Wg', // Pigeon pose ✅
    mollets_mur:         'nkTjAoAnKXM', // Calf wall stretch ✅
    hanche_flexor:       'YqF6hOFkKHg', // Hip flexor stretch ✅
    cou_lateral:         'N2F5c_igVDA', // Neck lateral stretch ✅
    cou_rotation:        'N2F5c_igVDA', // alias ✅

    // ── MOBILITÉ ──────────────────────────────────────────
    squat_profond:       'xf0cKVTtOH8', // Deep squat mobility ✅
    rotation_thoracique: 'p_tIMxvd_cI', // Thoracic rotation ✅
  },

// ════════════════════════════════════════════════════════
  // ✅ GIF FALLBACK
  // ════════════════════════════════════════════════════════
gifs: {
  // ── PECTORAUX ──
  bench_press:        'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
  incline_halteres:   'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
  chest_press_machine:'https://fitnessprogramer.com/wp-content/uploads/2021/06/Machine-Chest-Press.gif',
  ecarte_poulie:      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Low-Cable-Crossover.gif',
  dips:               'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dips.gif',
  pompes:             'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif',
  decline_bench:      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Decline-Barbell-Bench-Press.gif',
  cable_fly:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Low-Cable-Crossover.gif',
  pompes_declined:    'https://fitnessprogramer.com/wp-content/uploads/2021/04/Decline-Push-Up.gif',
  diamond_pushup:     'https://fitnessprogramer.com/wp-content/uploads/2021/06/Diamond-Push-Up.gif',

  // ── DOS ──
  tractions:          'https://fitnessprogramer.com/wp-content/uploads/2021/04/Pull-Up.gif',
  rowing_barre:       'https://fitnessprogramer.com/wp-content/uploads/2021/04/Barbell-Row.gif',
  lat_pulldown:       'https://fitnessprogramer.com/wp-content/uploads/2021/02/LAT-Pulldown.gif',
  rowing_machine:     'https://fitnessprogramer.com/wp-content/uploads/2021/06/Seated-Cable-Row.gif',
  'soulevé_terre':    'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
  chin_up:            'https://fitnessprogramer.com/wp-content/uploads/2021/04/Chin-Up.gif',
  rack_pull:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Rack-Pull.gif',
  inverted_row:       'https://fitnessprogramer.com/wp-content/uploads/2021/04/Inverted-Row.gif',
  superman:           'https://fitnessprogramer.com/wp-content/uploads/2021/06/Superman.gif',
  bird_dog:           'https://fitnessprogramer.com/wp-content/uploads/2022/01/Bird-Dog.gif',
  pullover:           'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Pullover.gif',
  pendlay_row:        'https://fitnessprogramer.com/wp-content/uploads/2021/04/Barbell-Row.gif',
  tbar_row:           'https://fitnessprogramer.com/wp-content/uploads/2021/06/T-Bar-Row.gif',

  // ── ÉPAULES ──
  dev_militaire:          'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Shoulder-Press.gif',
  elev_laterales:         'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif',
  shoulder_press_machine: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Machine-Shoulder-Press.gif',
  face_pull:              'https://fitnessprogramer.com/wp-content/uploads/2021/06/Face-Pull.gif',
  oiseau:                 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Bent-Over-Dumbbell-Rear-Delt-Raise.gif',
  arnold_press:           'https://fitnessprogramer.com/wp-content/uploads/2021/04/Arnold-Press.gif',
  shrug:                  'https://fitnessprogramer.com/wp-content/uploads/2021/04/Dumbbell-Shrug.gif',
  upright_row:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Barbell-Upright-Row.gif',
  pike_pushup:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Pike-Push-Up.gif',

  // ── BICEPS ──
  curl_halteres:  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bicep-Curl.gif',
  curl_barre:     'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif',
  curl_marteau:   'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif',
  curl_machine:   'https://fitnessprogramer.com/wp-content/uploads/2021/06/Machine-Bicep-Curl.gif',
  spider_curl:    'https://fitnessprogramer.com/wp-content/uploads/2021/06/Spider-Curl.gif',
  incline_curl:   'https://fitnessprogramer.com/wp-content/uploads/2021/06/Incline-Dumbbell-Curl.gif',

  // ── TRICEPS ──
  ext_triceps_poulie:     'https://fitnessprogramer.com/wp-content/uploads/2021/02/Pushdown.gif',
  barre_front:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/EZ-Bar-Skullcrusher.gif',
  dips_triceps:           'https://fitnessprogramer.com/wp-content/uploads/2021/04/Bench-Dip.gif',
  overhead_triceps_cable: 'https://fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Overhead-Triceps-Extension.gif',
  close_grip_bench:       'https://fitnessprogramer.com/wp-content/uploads/2021/06/Close-Grip-Bench-Press.gif',

  // ── JAMBES ──
  squat:              'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif',
  presse_cuisses:     'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif',
  fentes:             'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunge.gif',
  leg_curl:           'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif',
  leg_extension:      'https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Extension.gif',
  mollets:            'https://fitnessprogramer.com/wp-content/uploads/2021/04/Standing-Calf-Raise.gif',
  hip_thrust:         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Barbell-Hip-Thrust.gif',
  hack_squat:         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Hack-Squat.gif',
  goblet_squat:       'https://fitnessprogramer.com/wp-content/uploads/2021/04/Goblet-Squat.gif',
  sumo_squat:         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Sumo-Squat.gif',
  nordic_curl:        'https://fitnessprogramer.com/wp-content/uploads/2021/06/Nordic-Curl.gif',
  glute_kickback:     'https://fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Glute-Kickback.gif',
  squat_poids_corps:  'https://fitnessprogramer.com/wp-content/uploads/2021/02/Air-Squat.gif',
  fentes_bulgares:    'https://fitnessprogramer.com/wp-content/uploads/2021/04/Dumbbell-Bulgarian-Split-Squat.gif',
  hip_thrust_sol:     'https://fitnessprogramer.com/wp-content/uploads/2021/06/Hip-Thrust.gif',
  donkey_kick:        'https://fitnessprogramer.com/wp-content/uploads/2021/04/Donkey-Kick.gif',
  clamshell:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Clamshell.gif',
  squat_saute:        'https://fitnessprogramer.com/wp-content/uploads/2021/04/Jump-Squat.gif',

  // ── ABDOS / CORE ──
  planche:                'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif',
  crunch_machine:         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Machine-Crunch.gif',
  releve_jambes:          'https://fitnessprogramer.com/wp-content/uploads/2021/04/Hanging-Leg-Raise.gif',
  russian_twist:          'https://fitnessprogramer.com/wp-content/uploads/2021/04/Russian-Twist.gif',
  hollow_body:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Hollow-Body-Hold.gif',
  side_plank:             'https://fitnessprogramer.com/wp-content/uploads/2021/06/Side-Plank.gif',
  crunch:                 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif',
  mountain_climbers_core: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Mountain-Climber.gif',
  mountain_climbers:      'https://fitnessprogramer.com/wp-content/uploads/2021/04/Mountain-Climber.gif',
  dragon_flag:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dragon-Flag.gif',

  // ── CARDIO / FULL BODY ──
  burpees:           'https://fitnessprogramer.com/wp-content/uploads/2021/04/Burpee.gif',
  kettlebell_swing:  'https://fitnessprogramer.com/wp-content/uploads/2021/04/Kettlebell-Swing.gif',
  rameur:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Rowing-Machine.gif',
  velo:              'https://fitnessprogramer.com/wp-content/uploads/2021/06/Stationary-Bike.gif',
  corde_a_sauter:    'https://fitnessprogramer.com/wp-content/uploads/2021/04/Jump-Rope.gif',
  thruster:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Thruster.gif',
  goblet_squat:      'https://fitnessprogramer.com/wp-content/uploads/2021/04/Goblet-Squat.gif',
},

getGifUrl(ref) {
  if (!ref) return null;

  // ✅ 1. Lookup direct
  if (this.gifs[ref]) return this.gifs[ref];

  // ✅ 2. Lookup depuis EXERCICES (si gif défini)
  const exo = window.EXERCICES?.[ref];
  if (exo?.gif) return exo.gif;

  // ✅ 3. Fallback par groupe musculaire
  const muscle = exo?.muscle?.toLowerCase() || '';
  const groupe = exo?.groupe?.toLowerCase() || '';

  if (groupe === 'jambes' || muscle.includes('quad') ||
      muscle.includes('fess') || muscle.includes('ischio') ||
      muscle.includes('moll')) {
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif';
  }
  if (groupe === 'pull' || muscle.includes('dos') ||
      muscle.includes('biceps') || muscle.includes('dorsal')) {
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Pull-Up.gif';
  }
  if (groupe === 'push' || muscle.includes('pector') ||
      muscle.includes('triceps') || muscle.includes('epaule')) {
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif';
  }
  if (groupe === 'abdos' || muscle.includes('abdo') ||
      muscle.includes('core')) {
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif';
  }
  if (groupe === 'cardio') {
    return 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Burpee.gif';
  }

  // ✅ 4. GIF générique
  return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif';
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
    // ✅ Passer ref pour le GIF
    this.ouvrir(id, ex.nom || ref, ex.muscle || '', ref);
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
ouvrir(youtubeId, nomExo, muscle, refExo) {
    document.getElementById('video-modal')?.remove();

    const gifUrl = this.getGifUrl(refExo || '');

    const modal = document.createElement('div');
    modal.id    = 'video-modal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:1000;
      background:rgba(9,9,45,0.94);
      display:flex;align-items:center;justify-content:center;
      padding:var(--space-md);
      animation:fadeIn .2s ease;
      backdrop-filter:blur(12px);
    `;

    modal.innerHTML = `
      <div style="width:100%;max-width:500px;
                  background:var(--bg-card);
                  border-radius:var(--radius-lg);
                  overflow:hidden;
                  border:1px solid rgba(0,100,255,0.2);
                  box-shadow:0 20px 60px rgba(0,0,0,0.6)">

        <!-- Header -->
        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    padding:14px 16px;
                    border-bottom:1px solid var(--border-color)">
          <div>
            <div style="font-weight:800;font-size:.95rem;color:white">
              ${nomExo}
            </div>
            ${muscle ? `
              <div style="font-size:.65rem;color:var(--fd-mint);margin-top:2px">
                🎯 ${muscle}
              </div>` : ''}
          </div>
          <button onclick="VideoDemo.fermer()"
                  style="width:32px;height:32px;
                         background:rgba(255,255,255,0.06);
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:50%;font-size:1rem;
                         cursor:pointer;color:rgba(255,255,255,0.6);
                         display:flex;align-items:center;
                         justify-content:center">
            ✕
          </button>
        </div>

        <!-- Tabs -->
        <div style="display:flex;border-bottom:1px solid var(--border-color)">
          <button id="vd-tab-yt"
                  onclick="VideoDemo._tab('yt','${youtubeId}')"
                  style="flex:1;padding:10px;font-size:.72rem;
                         font-weight:700;
                         background:rgba(255,0,0,0.15);
                         border:none;
                         border-right:1px solid var(--border-color);
                         color:#ff5555;cursor:pointer">
            ▶ YouTube
          </button>
          <button id="vd-tab-gif"
                  onclick="VideoDemo._tab('gif','${youtubeId}')"
                  style="flex:1;padding:10px;font-size:.72rem;
                         font-weight:700;
                         background:rgba(255,255,255,0.03);
                         border:none;
                         color:rgba(255,255,255,0.4);cursor:pointer">
            🖼️ GIF Offline
          </button>
        </div>

        <!-- Zone YouTube -->
        <div id="vd-yt-zone"
             style="position:relative;padding-bottom:56.25%;
                    height:0;overflow:hidden;cursor:pointer;background:#000"
             onclick="VideoDemo._chargerIframe('${youtubeId}')">

          <img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg"
               alt="${nomExo}"
               style="position:absolute;top:0;left:0;
                      width:100%;height:100%;object-fit:cover"
               onerror="this.src='https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg'"/>

          <!-- Bouton Play -->
          <div style="position:absolute;top:50%;left:50%;
                      transform:translate(-50%,-50%);
                      width:64px;height:64px;
                      background:rgba(255,0,0,0.9);
                      border-radius:50%;
                      display:flex;align-items:center;
                      justify-content:center;
                      pointer-events:none;
                      box-shadow:0 4px 20px rgba(0,0,0,0.5)">
            <div style="width:0;height:0;
                        border-top:12px solid transparent;
                        border-bottom:12px solid transparent;
                        border-left:20px solid white;
                        margin-left:4px"></div>
          </div>

          <div style="position:absolute;bottom:8px;right:8px;
                      padding:3px 8px;background:rgba(0,0,0,0.7);
                      border-radius:99px;font-size:.6rem;
                      color:white;pointer-events:none">
            ▶ Cliquer pour lire
          </div>
        </div>

        <!-- Zone GIF -->
        <div id="vd-gif-zone"
             style="display:none;background:#111;
                    min-height:220px;align-items:center;
                    justify-content:center;flex-direction:column;
                    padding:16px;text-align:center">
          <img id="vd-gif-img" src=""
               style="max-width:100%;max-height:260px;
                      border-radius:10px;object-fit:contain"
               onerror="VideoDemo._gifErreur(this)"/>
          <div id="vd-gif-msg"
               style="color:rgba(255,255,255,0.3);
                      font-size:.68rem;margin-top:8px;
                      font-family:monospace">
            Chargement GIF...
          </div>
          <div style="font-size:.58rem;color:rgba(0,207,255,0.3);
                      margin-top:4px;font-family:monospace">
            ✅ Fonctionne sans connexion
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:10px 14px;
                    display:flex;align-items:center;
                    justify-content:space-between;
                    border-top:1px solid var(--border-color)">
          <span style="font-size:.6rem;color:var(--text-muted)">
            Clique dehors ou Escape pour fermer
          </span>
          <a href="https://www.youtube.com/watch?v=${youtubeId}"
             target="_blank" rel="noopener"
             style="display:flex;align-items:center;gap:5px;
                    padding:5px 12px;background:#ff0000;
                    color:white;border-radius:99px;
                    font-size:.68rem;font-weight:700;
                    text-decoration:none">
            ▶ Ouvrir YouTube
          </a>
        </div>
      </div>
    `;

    this._gifUrl = gifUrl;

    modal.addEventListener('click', e => {
      if (e.target === modal) this.fermer();
    });

    this._escHandler = e => {
      if (e.key === 'Escape') this.fermer();
    };
    document.addEventListener('keydown', this._escHandler);

    document.body.appendChild(modal);
  },

  // ✅ Switcher tabs
  _tab(tab, ytId) {
    const ytZone  = document.getElementById('vd-yt-zone');
    const gifZone = document.getElementById('vd-gif-zone');
    const ytBtn   = document.getElementById('vd-tab-yt');
    const gifBtn  = document.getElementById('vd-tab-gif');

    if (tab === 'yt') {
      if (ytZone)  ytZone.style.display  = 'block';
      if (gifZone) gifZone.style.display = 'none';
      if (ytBtn) {
        ytBtn.style.background = 'rgba(255,0,0,0.15)';
        ytBtn.style.color      = '#ff5555';
      }
      if (gifBtn) {
        gifBtn.style.background = 'rgba(255,255,255,0.03)';
        gifBtn.style.color      = 'rgba(255,255,255,0.4)';
      }
    } else {
      if (ytZone)  ytZone.style.display  = 'none';
      if (gifZone) {
        gifZone.style.display = 'flex';
        const img = document.getElementById('vd-gif-img');
        const msg = document.getElementById('vd-gif-msg');
        if (img && !img.src.includes('http')) {
          img.src   = this._gifUrl || '';
          img.onload = () => {
            if (msg) msg.style.display = 'none';
          };
        } else if (msg && img?.src.includes('http')) {
          msg.style.display = 'none';
        }
      }
      if (gifBtn) {
        gifBtn.style.background = 'rgba(0,100,255,0.15)';
        gifBtn.style.color      = 'var(--fd-indigo)';
      }
      if (ytBtn) {
        ytBtn.style.background = 'rgba(255,255,255,0.03)';
        ytBtn.style.color      = 'rgba(255,255,255,0.4)';
      }
      // Pause iframe si actif
      const iframe = document.querySelector('#vd-yt-zone iframe');
      if (iframe) {
        iframe.contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}', '*'
        );
      }
    }
  },

  _gifErreur(img) {
    const msg = document.getElementById('vd-gif-msg');
    if (msg) {
      msg.innerHTML = `
        <div style="font-size:1.5rem">📵</div>
        <div style="margin-top:4px">
          GIF non disponible.<br>
          Utilise l'onglet YouTube.
        </div>`;
    }
    img.style.display = 'none';
  },

  // ✅ NOUVEAU v2.0 — Charger iframe au clic sur miniature
_chargerIframe(youtubeId) {
  const thumbContainer = document.getElementById('vd-yt-zone'); // ✅
  if (!thumbContainer) return;

  thumbContainer.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      style="position:absolute;top:0;left:0;
             width:100%;height:100%;border:none"
      allow="accelerometer; autoplay; clipboard-write;
             encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;

  thumbContainer.style.cursor = 'default';
  thumbContainer.onclick      = null;
},

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
    // Stopper la vidéo YouTube
    const iframe = document.querySelector('#vd-yt-zone iframe');
    if (iframe) iframe.src = 'about:blank';

    const modal = document.getElementById('video-modal');
    if (modal) {
      modal.style.animation = 'fadeOut .15s ease forwards';
      setTimeout(() => modal.remove(), 150);
    }

    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
      this._escHandler = null;
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
