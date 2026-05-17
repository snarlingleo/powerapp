/* ============================================================
   PowerApp — Video.js v1.0
   Démonstrations vidéo YouTube par exercice
   ============================================================ */

'use strict';

const VideoDemo = {

  // ════════════════════════════════════════════════════════
  // BASE DE DONNÉES VIDÉOS
  // IDs YouTube — Meilleure qualité technique disponible
  // ════════════════════════════════════════════════════════
  videos: {
    // ── PECTORAUX ────────────────────────────────────────
    bench_press:         'rT7DgCr-3pg', // Jeff Nippard — Bench Press
    incline_bench:       'DbFgADa2PL8', // Jeff Nippard — Incline
    decline_bench:       'LfyQTdaGQiY', // ScottHermanFitness
    dips_pecs:           'yN6Q1UI_xkE', // Jeff Nippard — Dips
    flyes:               'eozdVDA78K0', // Renaissance Periodization
    cable_crossover:     'taI4XduLpTk', // Nippard Cable Fly
    push_up:             'IODxDxX7oi4', // Jeff Nippard — Pushup

    // ── DOS ───────────────────────────────────────────────
    pull_up:             'eGo4IYlbE5g', // Jeff Nippard — Pull-up
    chin_up:             'brhRXlOhsAM', // AthleanX Chin-up
    lat_pulldown:        'CAwf7n6Luuc', // Jeff Nippard — Lat Pulldown
    seated_row:          'GZbfZ033f74', // Jeff Nippard — Row
    bent_over_row:       '6FZHhZMqDgg', // Jeff Nippard — Barbell Row
    tbar_row:            'j3G1dQbnABQ', // ScottHermanFitness
    deadlift:            'op9kVnSso6Q', // Jeff Nippard — Deadlift
    romanian_deadlift:   'JCXUYuzwNrM', // Jeff Nippard — RDL
    pullover:            'FK2SqQxNRmA', // ScottHermanFitness

    // ── ÉPAULES ───────────────────────────────────────────
    overhead_press:      'CnBmiBqp-AI', // Jeff Nippard — OHP
    dumbbell_press:      '6Z15_WdXmVw', // ScottHermanFitness
    lateral_raise:       'kDqklk1ZESo', // Jeff Nippard — Lateral Raise
    front_raise:         'sOiBHj9MEFQ', // ScottHermanFitness
    face_pull:           'HSoHeSt2VWo', // AthleanX — Face Pull
    arnold_press:        'vj2w851ZHRM', // ScottHermanFitness
    upright_row:         'UcrJ2WBIXeg', // ScottHermanFitness

    // ── BICEPS ────────────────────────────────────────────
    barbell_curl:        'kwG2ipFRgfo', // Jeff Nippard — Curl
    dumbbell_curl:       'sAq_ocpS3zY', // Jeff Nippard
    hammer_curl:         'zC3nLlEvin4', // Jeff Nippard
    preacher_curl:       'fIWP-FRFNU0', // ScottHermanFitness
    concentration_curl:  'Jvj2wf0PqB8', // ScottHermanFitness
    cable_curl:          'NFzTWp2qpiE', // ScottHermanFitness

    // ── TRICEPS ───────────────────────────────────────────
    tricep_pushdown:     'vB5OHsJ3EME', // Jeff Nippard
    overhead_extension:  'YbX7Wd8jQ-Q', // ScottHermanFitness
    skull_crusher:       'NIKnG_8szOQ', // Jeff Nippard
    close_grip_bench:    'nEF0bv2FW94', // Jeff Nippard
    dips_triceps:        'wjUmnZH528Y', // Jeff Nippard

    // ── JAMBES ────────────────────────────────────────────
    squat:               'ultWZbUMPL8', // Jeff Nippard — Squat
    front_squat:         'uYumuL_G_V0', // Jeff Nippard
    leg_press:           'IZxyjW7SKSA', // Jeff Nippard
    lunges:              'QOVaHwm-Q6U', // Jeff Nippard
    leg_extension:       'ljO4jkNWCKk', // ScottHermanFitness
    leg_curl:            'ELOCsoDSmrg', // Jeff Nippard
    calf_raise:          'gwLzBJYoWlA', // Jeff Nippard
    hip_thrust:          'SEdqd1n0cvg', // Jeff Nippard
    sumo_deadlift:       '67oNKBXSBh0', // Alan Thrall
    bulgarian_split:     '2C-uNgKwPLE', // Jeff Nippard

    // ── ABDOS ─────────────────────────────────────────────
    crunch:              'Xyd_fa5zoEU', // Jeff Nippard
    plank:               'pSHjTRCQxIw', // Jeff Nippard
    leg_raise:           'JB2oyawG9KQ', // Jeff Nippard
    cable_crunch:        'GvjAoJaFBzE', // ScottHermanFitness
    russian_twist:       'wkD8rjkodUI', // ScottHermanFitness
    ab_wheel:            'JhEo1PxRXpk', // Jeff Nippard
  },

  // ════════════════════════════════════════════════════════
  // OUVRIR LA MODAL VIDÉO
  // ════════════════════════════════════════════════════════
  ouvrir(youtubeId, nomExo, muscle) {
    // Supprimer modal existante si présente
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
                  box-shadow:var(--shadow-lg)">

        <!-- Header modal -->
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
                         border-radius:50%;
                         font-size:1rem;cursor:pointer;
                         display:flex;align-items:center;
                         justify-content:center;
                         color:var(--text-muted)">
            ✕
          </button>
        </div>

        <!-- Vidéo YouTube -->
        <div style="position:relative;
                    padding-bottom:56.25%;
                    height:0;
                    overflow:hidden">
          <iframe
            src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1"
            style="position:absolute;top:0;left:0;
                   width:100%;height:100%;border:none"
            allow="accelerometer; autoplay; clipboard-write;
                   encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>

        <!-- Footer -->
        <div style="padding:var(--space-sm) var(--space-md);
                    text-align:center;
                    font-size:.65rem;color:var(--text-muted)">
          Appuie en dehors pour fermer
        </div>
      </div>
    `;

    // Fermer au clic extérieur
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.fermer();
    });

    document.body.appendChild(modal);
  },

  fermer() {
    const modal = document.getElementById('video-modal');
    if (modal) {
      modal.style.animation = 'fadeOut .15s ease';
      setTimeout(() => modal.remove(), 150);
    }
  }
};

window.VideoDemo = VideoDemo;
console.log('✅ Video.js v1.0 chargé');
