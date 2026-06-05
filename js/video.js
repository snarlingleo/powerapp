/* ============================================================
   PowerApp — Video.js v2.0
   Démonstrations vidéo YouTube par exercice
   + Exercices maison + Femme + getVideoId()
   + Miniature avant chargement + Bouton YouTube
   ============================================================ */

'use strict';

const VideoDemo = {

  videos: {
    // ── PECTORAUX ─────────────────────────────────────────
    bench_press:         '4Y2ZdHCOXok',
    incline_halteres:    '8iPEnn-ltC8',
    incline_bench:       '8iPEnn-ltC8',
    decline_bench:       'LfyQTdaGQiY',
    dips:                '2z8JmcrW-As',
    dips_triceps:        'wjUmnZH528Y',
    flyes:               'Iwe6AmxVf7o',
    cable_crossover:     'Iwe6AmxVf7o',
    push_up:             'IODxDxX7oi4',
    pompes:              'IODxDxX7oi4',
    pompes_inclines:     'IODxDxX7oi4',

    // ── DOS ───────────────────────────────────────────────
    tractions:           'eGo4IYlbE5g',
    pull_up:             'eGo4IYlbE5g',
    chin_up:             'brhRXlOhsAM',
    lat_pulldown:        'CAwf7n6Luuc',
    rowing_barre:        '9efgcAjQe7E',
    rowing_machine:      'GZbfZ033f74',
    seated_row:          'GZbfZ033f74',
    bent_over_row:       '9efgcAjQe7E',
    tbar_row:            'j3G1dQbnABQ',
    souvele_terre:       'op9kVnSso6Q',
    deadlift:            'op9kVnSso6Q',
    romanian_deadlift:   'JCXUYuzwNrM',
    pullover:            'FK2SqQxNRmA',
    face_pull:           'HSoHeSjovMQ',
    inverted_row:        'rloXgjRwbRs',
    superman:            'z6PJMT2y8GQ',

    // ── ÉPAULES ───────────────────────────────────────────
    dev_militaire:       'qEwKCR5JCog',
    overhead_press:      'qEwKCR5JCog',
    dumbbell_press:      '6Z15_WdXmVw',
    elev_laterales:      '3VcKaXpzqRo',
    lateral_raise:       '3VcKaXpzqRo',
    front_raise:         'sOiBHj9MEFQ',
    arnold_press:        '6Z15_WdXmVw',
    upright_row:         'um3VTvBFsQI',
    pike_pushup:         'x7_I5SUAd00',

    // ── BICEPS ────────────────────────────────────────────
    curl_barre:          'kwG2ipFRgfo',
    barbell_curl:        'kwG2ipFRgfo',
    curl_halteres:       'ykJmrZ5v0Oo',
    dumbbell_curl:       'ykJmrZ5v0Oo',
    curl_marteau:        'TwD-YGVP4Bk',
    hammer_curl:         'TwD-YGVP4Bk',
    preacher_curl:       'fIWP-FRFNU0',
    concentration_curl:  'Jvj2wf0PqB8',
    cable_curl:          'NFzTWp2qpiE',
    curl_pupitre:        'fIWP-FRFNU0',

    // ── TRICEPS ───────────────────────────────────────────
    ext_triceps_poulie:  '2-LAMcpzODU',
    tricep_pushdown:     '2-LAMcpzODU',
    overhead_extension:  'YSrMGOMwwAs',
    skull_crusher:       'NINSVMysHOQ',
    close_grip_bench:    'nEF0bv2FW04',
    diamond_pushup:      'J0DXDurxX9E',

    // ── JAMBES ────────────────────────────────────────────
    squat:               'ultWZbUMPL8',
    front_squat:         'uYumuL_G_V0',
    presse_cuisses:      'IZxyjW7MPJQ',
    leg_press:           'IZxyjW7MPJQ',
    fentes:              'QOVaHwm-Q6U',
    lunges:              'QOVaHwm-Q6U',
    fentes_bulgares:     '2C-uNgKwPLE',
    bulgarian_split:     '2C-uNgKwPLE',
    leg_extension:       'YyvSfVjQeL0',
    leg_curl:            'ELOCsoDSmrg',
    mollets:             '-M4-G8p1fCI',
    calf_raise:          '-M4-G8p1fCI',
    sumo_squat:          '67oNKBXSBh0',
    squat_poids_corps:   'ultWZbUMPL8',
    squat_saute:         'Azgw4dSR-lg',

    // ── FESSIERS ──────────────────────────────────────────
    hip_thrust:          'SEdqd1n0cvg',
    hip_thrust_sol:      'SEdqd1n0cvg',
    donkey_kick:         'bpnBzBDMoGo',
    glute_bridge:        'OUgsJ8-Vi0E',
    clamshell:           'pDJrNW-KDGY',
    kickback_poulie:     'bpnBzBDMoGo',
    abduction_machine:   'SEdqd1n0cvg',

    // ── ABDOS ─────────────────────────────────────────────
    crunch:              'Xyd_fa5zoEU',
    planche:             'pSHjTRCQxIw',
    plank:               'pSHjTRCQxIw',
    leg_raise:           'l4kQd9eWclE',
    cable_crunch:        'AV5Ph30KaTc',
    russian_twist:       'wkD8rjkodUI',
    ab_wheel:            'JhEo1PxRXpk',
    gainage:             'pSHjTRCQxIw',

    // ── CARDIO / HIIT ─────────────────────────────────────
    burpees:             'dZgVxmf6jkA',
    mountain_climbers:   'nmwgirgXLYM',
    jumping_jacks:       'c4DAnQ6DtF8',
    box_jump:            'FN8gfh6FMKM',
    sprint:              '6gIMaFzj6KA',
    jumping_squat:       'Azgw4dSR-lg',
    kettlebell_swing:    'YSxHifyI6s8',
    goblet_squat:        'MeIiIdhvXT4',

    // ── ÉTIREMENTS RECOVERY ───────────────────────────────
    pec_porte:           'kFfCqJxMfss',
    pec_sol:             'kFfCqJxMfss',
    dos_chat:            'kqnua4rHVVA',
    dos_enfant:          '2MJGg-dUKh0',
    dos_pigeon:          '2MJGg-dUKh0',
    epaule_cross:        '5c4WkWDnPuc',
    epaule_overhead:     '5c4WkWDnPuc',
    quad_debout:         'cDjLGp3JHoo',
    ischio_sol:          'g7Uhp5tpfDI',
    fessiers_pigeon:     'R5XOODKH6Wg',
    mollets_mur:         'nkTjAoAnKXM',
    hanche_flexor:       'YqF6hOFkKHg',
    cou_lateral:         'N2F5c_igVDA',
    cou_rotation:        'N2F5c_igVDA',

    // ── MOBILITÉ ──────────────────────────────────────────
    squat_profond:       'xf0cKVTtOH8',
    rotation_thoracique: 'p_tIMxvd_cI'
  },

  // ════════════════════════════════════════════════════════
  // GIF FALLBACK
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
    souvele_terre:      'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Deadlift.gif',
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
    thruster:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Thruster.gif'
  },

  // ════════════════════════════════════════════════════════
  // MÉTHODES
  // ════════════════════════════════════════════════════════
  getGifUrl(ref) {
    if (!ref) return null;
    if (this.gifs[ref]) return this.gifs[ref];

    const cleaned = ref.toLowerCase()
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u');
    if (this.gifs[cleaned]) return this.gifs[cleaned];

    const exo    = window.EXERCICES?.[ref];
    if (exo?.gif) return exo.gif;

    const muscle = exo?.muscle?.toLowerCase() || '';
    const groupe = exo?.groupe?.toLowerCase() || '';

    if (groupe === 'jambes' || muscle.includes('quad') ||
        muscle.includes('fess') || muscle.includes('ischio') ||
        muscle.includes('moll'))
      return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif';
    if (groupe === 'pull' || muscle.includes('dos') ||
        muscle.includes('biceps') || muscle.includes('dorsal'))
      return 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Pull-Up.gif';
    if (groupe === 'push' || muscle.includes('pector') ||
        muscle.includes('triceps') || muscle.includes('epaule'))
      return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif';
    if (groupe === 'abdos' || muscle.includes('abdo') ||
        muscle.includes('core'))
      return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif';
    if (groupe === 'cardio')
      return 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Burpee.gif';

    return 'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif';
  },

  getVideoId(ref) {
    if (!ref) return null;
    if (this.videos[ref]) return this.videos[ref];
    const cleaned = ref.toLowerCase()
      .replace(/[-\s]/g, '_')
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o');
    return this.videos[cleaned] || null;
  },

  hasVideo(ref) {
    return !!this.getVideoId(ref);
  },

  ouvrirParRef(ref) {
    const id = this.getVideoId(ref);
    if (!id) {
      this._ouvrirRecherche(ref);
      return;
    }
    const ex = (window.EXERCICES || {})[ref] || {};
    this.ouvrir(id, ex.nom || ref, ex.muscle || '', ref);
  },

  _ouvrirRecherche(ref) {
    const ex    = (window.EXERCICES || {})[ref] || {};
    const query = encodeURIComponent(
      `${ex.nom || ref} exercice technique musculation`
    );
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      '_blank'
    );
  },

  ouvrir(youtubeId, nomExo, muscle, refExo) {
    document.getElementById('video-modal')?.remove();

    const gifUrl = this.getGifUrl(refExo || '');

    const modal = document.createElement('div');
    modal.id    = 'video-modal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:1000;
      background:rgba(9,9,45,0.94);
      display:flex;align-items:center;justify-content:center;
      padding:16px;
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

        <div style="display:flex;align-items:center;
                    justify-content:space-between;
                    padding:14px 16px;
                    border-bottom:1px solid var(--border-color)">
          <div>
            <div style="font-weight:800;font-size:.95rem;color:white">
              ${nomExo}
            </div>
            ${muscle ? `
              <div style="font-size:.65rem;color:#8bf0bb;margin-top:2px">
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
                         justify-content:center">✕</button>
        </div>

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

        <div id="vd-yt-zone"
             style="position:relative;padding-bottom:56.25%;
                    height:0;overflow:hidden;cursor:pointer;background:#000"
             onclick="VideoDemo._chargerIframe('${youtubeId}')">
          <img src="https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg"
               alt="${nomExo}"
               style="position:absolute;top:0;left:0;
                      width:100%;height:100%;object-fit:cover"
               onerror="this.src='https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg'"/>
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

  _tab(tab, ytId) {
    const ytZone  = document.getElementById('vd-yt-zone');
    const gifZone = document.getElementById('vd-gif-zone');
    const ytBtn   = document.getElementById('vd-tab-yt');
    const gifBtn  = document.getElementById('vd-tab-gif');

    if (tab === 'yt') {
      if (ytZone)  ytZone.style.display  = 'block';
      if (gifZone) gifZone.style.display = 'none';
      if (ytBtn)  { ytBtn.style.background  = 'rgba(255,0,0,0.15)'; ytBtn.style.color  = '#ff5555'; }
      if (gifBtn) { gifBtn.style.background = 'rgba(255,255,255,0.03)'; gifBtn.style.color = 'rgba(255,255,255,0.4)'; }
    } else {
      if (ytZone)  ytZone.style.display  = 'none';
      if (gifZone) {
        gifZone.style.display = 'flex';
        const img = document.getElementById('vd-gif-img');
        const msg = document.getElementById('vd-gif-msg');
        if (img && !img.src.includes('http')) {
          img.src    = this._gifUrl || '';
          img.onload = () => { if (msg) msg.style.display = 'none'; };
        } else if (msg && img?.src.includes('http')) {
          msg.style.display = 'none';
        }
      }
      if (gifBtn) { gifBtn.style.background = 'rgba(0,100,255,0.15)'; gifBtn.style.color = '#4b4bf9'; }
      if (ytBtn)  { ytBtn.style.background  = 'rgba(255,255,255,0.03)'; ytBtn.style.color = 'rgba(255,255,255,0.4)'; }
      const iframe = document.querySelector('#vd-yt-zone iframe');
      if (iframe) iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  },

  _gifErreur(img) {
    const msg = document.getElementById('vd-gif-msg');
    if (msg) {
      msg.innerHTML = `
        <div style="font-size:1.5rem">📵</div>
        <div style="margin-top:4px">GIF non disponible.<br>Utilise l'onglet YouTube.</div>`;
    }
    img.style.display = 'none';
  },

  // ✅ FIX — un seul bloc, bon ID
  _chargerIframe(youtubeId) {
    const zone = document.getElementById('vd-yt-zone');
    if (!zone) return;
    zone.innerHTML = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>`;
    zone.style.cursor = 'default';
    zone.onclick      = null;
  },

  fermer() {
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
                     align-items:center;gap:4px;${style}">
        ▶ Vidéo
      </button>`;
  }

};

window.VideoDemo = VideoDemo;
console.log(`✅ Video.js v2.0 chargé — ${Object.keys(VideoDemo.videos).length} vidéos`);
