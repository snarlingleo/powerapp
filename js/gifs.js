// ════════════════════════════════════════════════════════
// ✅ GIFs Exercices — URLs externes (fitnessprogramer.com)
// ════════════════════════════════════════════════════════
const GIFS_EXERCICES = {

  // ── PECTORAUX ──
  bench_press:        'https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif',
  incline_halteres:   'https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Dumbbell-Press.gif',
  chest_press_machine:'https://fitnessprogramer.com/wp-content/uploads/2021/06/Machine-Chest-Press.gif',
  ecarte_poulie:      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Cable-Crossover.gif',
  dips:               'https://fitnessprogramer.com/wp-content/uploads/2021/02/Dips.gif',
  pompes:             'https://fitnessprogramer.com/wp-content/uploads/2021/02/push-up.gif',
  decline_bench:      'https://fitnessprogramer.com/wp-content/uploads/2021/06/Decline-Barbell-Bench-Press.gif',
  cable_fly:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Low-Cable-Crossover.gif',

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
  diamond_pushup:         'https://fitnessprogramer.com/wp-content/uploads/2021/06/Diamond-Push-Up.gif',

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
  dragon_flag:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dragon-Flag.gif',

  // ── CARDIO / FULL BODY ──
  burpees:           'https://fitnessprogramer.com/wp-content/uploads/2021/04/Burpee.gif',
  mountain_climbers: 'https://fitnessprogramer.com/wp-content/uploads/2021/04/Mountain-Climber.gif',
  kettlebell_swing:  'https://fitnessprogramer.com/wp-content/uploads/2021/04/Kettlebell-Swing.gif',
  rameur:            'https://fitnessprogramer.com/wp-content/uploads/2021/06/Rowing-Machine.gif',
  velo:              'https://fitnessprogramer.com/wp-content/uploads/2021/06/Stationary-Bike.gif',
  corde_a_sauter:    'https://fitnessprogramer.com/wp-content/uploads/2021/04/Jump-Rope.gif',
  thruster:          'https://fitnessprogramer.com/wp-content/uploads/2021/06/Dumbbell-Thruster.gif'
};

window.GIFS_EXERCICES = GIFS_EXERCICES;
