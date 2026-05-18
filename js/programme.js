/* ============================================================
   FitTracker Pro — Programme v3.0 CORRIGÉ
   Exercices + Séances + Cycles + Planning custom
   + Supersets + Décharge auto + Progression intelligente
   ============================================================ */

// ════════════════════════════════════════════════════════════
// BIBLIOTHÈQUE EXERCICES (identique — aucun bug trouvé)
// ════════════════════════════════════════════════════════════
const EXERCICES = {

  // ══════════════════════════════════════════
  // PECTORAUX (9 exercices)
  // ══════════════════════════════════════════
  bench_press: {
    nom:'Développé couché', muscle:'Pectoraux',
    muscles_sec:['Triceps','Épaules'],
    groupe:'push',
    equipement:'Barre olympique + Banc plat',
    emoji:'💪', difficulte:2,
    youtube:'rT7DgCr-3pg',
    description:'Allongé sur le banc, prise légèrement plus large que les épaules.',
    conseils:['Omoplates serrées et déprimées','Pieds bien à plat au sol','Ne pas rebondir sur la poitrine','Coudes à 75° du corps']
  },
  incline_halteres: {
    nom:'Développé incliné haltères', muscle:'Pectoraux Hauts',
    muscles_sec:['Épaules','Triceps'],
    groupe:'push',
    equipement:'Haltères + Banc incliné 30-45°',
    emoji:'💪', difficulte:2,
    youtube:'DbFgADa2PL8',
    description:'Banc incliné à 30-45°, haltères en pronation.',
    conseils:['Angle 30-45° maximum','Amplitude complète','Contrôle total en descente','Ne pas trop monter l\'inclinaison']
  },
  chest_press_machine: {
    nom:'Chest Press Machine', muscle:'Pectoraux',
    muscles_sec:['Triceps'],
    groupe:'push',
    equipement:'Machine Chest Press',
    emoji:'🤖', difficulte:1,
    youtube:'taI4XduLpTk',
    description:'Machine guidée.',
    conseils:['Régler le siège correctement','Ne pas verrouiller les coudes','Pression constante']
  },
  ecarte_poulie: {
    nom:'Écarté poulie haute', muscle:'Pectoraux',
    muscles_sec:[],
    groupe:'push',
    equipement:'Câble crossover',
    emoji:'🔄', difficulte:2,
    youtube:'eozdVDA78K0',
    description:'Câbles en position haute.',
    conseils:['Légère flexion du coude','Squeeze fort en fin','Contrôle en ouverture']
  },
  dips: {
    nom:'Dips', muscle:'Pectoraux / Triceps',
    muscles_sec:['Épaules'],
    groupe:'push',
    equipement:'Barres parallèles',
    emoji:'⬇️', difficulte:3,
    youtube:'yN6Q1UI_xkE',
    description:'Se pencher légèrement en avant pour cibler les pectoraux.',
    conseils:['Pencher = pectoraux, droit = triceps','Contrôle total en descente','Pas d\'à-coup dans le bas']
  },
  pompes: {
    nom:'Pompes', muscle:'Pectoraux',
    muscles_sec:['Triceps','Épaules','Core'],
    groupe:'push',
    equipement:'Poids du corps',
    emoji:'⬆️', difficulte:1,
    youtube:'IODxDxX7oi4',
    description:'Mains légèrement plus larges que les épaules.',
    conseils:['Corps rigide','Coudes à 45°','Amplitude complète']
  },
  // ── NOUVEAUX PECTORAUX ───────────────────
  decline_bench: {
    nom:'Développé décliné', muscle:'Pectoraux Bas',
    muscles_sec:['Triceps'],
    groupe:'push',
    equipement:'Barre + Banc décliné',
    emoji:'📉', difficulte:2,
    youtube:'LfyQTdaGQiY',
    description:'Banc décliné, ciblage des pectoraux inférieurs.',
    conseils:['Angle 15-30° maximum','Pieds bien calés','Contrôle en descente','Ne pas rebondir']
  },
  cable_fly: {
    nom:'Cable Fly bas', muscle:'Pectoraux',
    muscles_sec:[],
    groupe:'push',
    equipement:'Câble poulie basse',
    emoji:'🦋', difficulte:2,
    youtube:'taI4XduLpTk',
    description:'Câbles en position basse, mouvement vers le haut.',
    conseils:['Légère flexion du coude fixe','Expirer en remontant','Amplitude maximale']
  },
  pompes_declined: {
    nom:'Pompes pieds surélevés', muscle:'Pectoraux Hauts',
    muscles_sec:['Épaules','Triceps'],
    groupe:'push',
    equipement:'Banc ou chaise',
    emoji:'🔼', difficulte:2,
    youtube:'IODxDxX7oi4',
    description:'Pieds surélevés pour cibler les pectoraux supérieurs.',
    conseils:['Pieds sur une surface stable','Corps bien droit','Amplitude complète']
  },

  // ══════════════════════════════════════════
  // DOS (10 exercices)
  // ══════════════════════════════════════════
  tractions: {
    nom:'Tractions', muscle:'Grand Dorsal',
    muscles_sec:['Biceps','Rhomboïdes'],
    groupe:'pull',
    equipement:'Barre de traction',
    emoji:'🔗', difficulte:3,
    youtube:'eGo4IYlbE5g',
    description:'Prise pronation légèrement plus large que les épaules.',
    conseils:['Scapulas déprimées avant de tirer','Pas d\'à-coup','Descente complète']
  },
  rowing_barre: {
    nom:'Rowing barre', muscle:'Dos Moyen',
    muscles_sec:['Biceps','Trapèzes'],
    groupe:'pull',
    equipement:'Barre olympique',
    emoji:'🔗', difficulte:3,
    youtube:'6FZHhZMqDgg',
    description:'Dos parallèle au sol, prise pronation.',
    conseils:['Dos plat OBLIGATOIRE','Tirage vers le nombril','Coudes proches du corps']
  },
  lat_pulldown: {
    nom:'Tirage poulie haute', muscle:'Grand Dorsal',
    muscles_sec:['Biceps'],
    groupe:'pull',
    equipement:'Lat Pulldown',
    emoji:'⬇️', difficulte:1,
    youtube:'CAwf7n6Luuc',
    description:'Prise large, tirer la barre vers le haut de la poitrine.',
    conseils:['Ne pas se pencher excessivement','Initier par les coudes','Amplitude complète']
  },
  rowing_machine: {
    nom:'Rowing machine assise', muscle:'Dos Moyen',
    muscles_sec:['Biceps','Rhomboïdes'],
    groupe:'pull',
    equipement:'Machine Rowing',
    emoji:'🤖', difficulte:1,
    youtube:'GZbfZ033f74',
    description:'Dos droit, tirer les poignées vers le ventre.',
    conseils:['Dos droit','Pas de balancement','Serrer les omoplates en fin']
  },
  'soulevé_terre': {
    nom:'Soulevé de terre', muscle:'Chaîne postérieure',
    muscles_sec:['Fessiers','Ischio-jambiers','Dos','Trapèzes'],
    groupe:'pull',
    equipement:'Barre olympique',
    emoji:'🏋️', difficulte:4,
    youtube:'op9kVnSso6Q',
    description:'Pieds largeur des hanches, barre contre les tibias.',
    conseils:['Dos NEUTRE — jamais arrondi','Barre proche du corps','Pousser le sol','Inspirez avant la montée']
  },
  pullover: {
    nom:'Pull-over haltère', muscle:'Grand Dorsal',
    muscles_sec:['Pectoraux'],
    groupe:'pull',
    equipement:'Haltère + Banc plat',
    emoji:'🔄', difficulte:2,
    youtube:'FK2SqQxNRmA',
    description:'Allongé, haltère tenu à deux mains.',
    conseils:['Légère flexion du coude','Ne pas descendre trop bas','Amplitude progressive']
  },
  // ── NOUVEAUX DOS ─────────────────────────
  rack_pull: {
    nom:'Rack Pull', muscle:'Dos / Trapèzes',
    muscles_sec:['Fessiers','Ischio-jambiers'],
    groupe:'pull',
    equipement:'Rack + Barre olympique',
    emoji:'🏗️', difficulte:3,
    youtube:'op9kVnSso6Q',
    description:'Soulevé de terre partiel depuis un rack, focus dos et trapèzes.',
    conseils:['Barre au niveau des genoux','Dos parfaitement neutre','Mouvement contrôlé','Charges plus lourdes qu\'un deadlift']
  },
  pendlay_row: {
    nom:'Pendlay Row', muscle:'Dos Moyen',
    muscles_sec:['Biceps','Trapèzes'],
    groupe:'pull',
    equipement:'Barre olympique',
    emoji:'⚡', difficulte:3,
    youtube:'6FZHhZMqDgg',
    description:'Rowing explosif depuis le sol, dos horizontal.',
    conseils:['Barre revient au sol à chaque rep','Tirage explosif','Dos strictement horizontal','Coudes à 45°']
  },
  tbar_row: {
    nom:'T-Bar Row', muscle:'Dos Moyen / Épaisseur',
    muscles_sec:['Biceps','Rhomboïdes'],
    groupe:'pull',
    equipement:'T-Bar ou Landmine',
    emoji:'🔱', difficulte:3,
    youtube:'j3G1dQbnABQ',
    description:'Rowing avec barre fixée à une extrémité.',
    conseils:['Poitrine sur le support','Amplitude complète','Serrer les omoplates','Dos neutre']
  },
  chin_up: {
    nom:'Chin-up (supination)', muscle:'Grand Dorsal / Biceps',
    muscles_sec:['Biceps','Rhomboïdes'],
    groupe:'pull',
    equipement:'Barre de traction',
    emoji:'🔝', difficulte:3,
    youtube:'brhRXlOhsAM',
    description:'Tractions prise supination (paumes vers soi).',
    conseils:['Prise supination légèrement moins large que les épaules','Biceps fortement sollicités','Descente complète','Pas d\'à-coup']
  },

  // ══════════════════════════════════════════
  // ÉPAULES (8 exercices)
  // ══════════════════════════════════════════
  dev_militaire: {
    nom:'Développé militaire', muscle:'Épaules',
    muscles_sec:['Triceps','Trapèzes'],
    groupe:'push',
    equipement:'Haltères ou Barre',
    emoji:'💪', difficulte:3,
    youtube:'CnBmiBqp-AI',
    description:'Debout ou assis, pousser au-dessus de la tête.',
    conseils:['Core bien gainé','Ne pas cambrer','Lockout complet en haut']
  },
  elev_laterales: {
    nom:'Élévations latérales', muscle:'Deltoïdes Latéraux',
    muscles_sec:[],
    groupe:'push',
    equipement:'Haltères',
    emoji:'🦅', difficulte:1,
    youtube:'kDqklk1ZESo',
    description:'Bras légèrement fléchis, lever à hauteur d\'épaule.',
    conseils:['Ne pas hausser les épaules','Coudes légèrement fléchis','Contrôle en descente']
  },
  shoulder_press_machine: {
    nom:'Shoulder Press Machine', muscle:'Épaules',
    muscles_sec:['Triceps'],
    groupe:'push',
    equipement:'Machine Épaules',
    emoji:'🤖', difficulte:1,
    youtube:'6Z15_WdXmVw',
    description:'Machine guidée.',
    conseils:['Régler la hauteur du siège','Pas de verrouillage brutal','Expirer en poussant']
  },
  face_pull: {
    nom:'Face Pull', muscle:'Deltoïdes Postérieurs',
    muscles_sec:['Trapèzes','Rhomboïdes'],
    groupe:'pull',
    equipement:'Câble poulie haute + corde',
    emoji:'🔄', difficulte:2,
    youtube:'HSoHeSt2VWo',
    description:'Câble à hauteur du visage.',
    conseils:['Coudes à hauteur des épaules','Rotation externe en fin','Léger poids, focus technique']
  },
  oiseau: {
    nom:'Oiseau', muscle:'Deltoïdes Postérieurs',
    muscles_sec:['Rhomboïdes'],
    groupe:'pull',
    equipement:'Haltères',
    emoji:'🦢', difficulte:2,
    youtube:'sOiBHj9MEFQ',
    description:'Penché en avant dos plat.',
    conseils:['Dos plat et horizontal','Mouvement lent','Coudes légèrement fléchis']
  },
  // ── NOUVEAUX ÉPAULES ─────────────────────
  arnold_press: {
    nom:'Arnold Press', muscle:'Épaules (3 faisceaux)',
    muscles_sec:['Triceps'],
    groupe:'push',
    equipement:'Haltères',
    emoji:'🌀', difficulte:2,
    youtube:'vj2w851ZHRM',
    description:'Rotation des paumes de dedans vers dehors pendant le press.',
    conseils:['Rotation fluide et contrôlée','Pas de compensation du dos','Amplitude maximale','Amplitude plus complète qu\'un press classique']
  },
  upright_row: {
    nom:'Rowing vertical', muscle:'Trapèzes / Épaules',
    muscles_sec:['Deltoïdes Latéraux'],
    groupe:'pull',
    equipement:'Barre ou Haltères',
    emoji:'⬆️', difficulte:2,
    youtube:'UcrJ2WBIXeg',
    description:'Tirer la barre vers le menton, coudes vers le haut.',
    conseils:['Prise légèrement plus étroite que les épaules','Coudes au-dessus des poignets','Ne pas monter trop haut','Mouvement contrôlé']
  },
  shrug: {
    nom:'Shrug / Haussement épaules', muscle:'Trapèzes',
    muscles_sec:[],
    groupe:'pull',
    equipement:'Haltères ou Barre',
    emoji:'🤷', difficulte:1,
    youtube:'vj2w851ZHRM',
    description:'Hausser les épaules vers les oreilles avec charge.',
    conseils:['Mouvement vertical uniquement','Tenir 1s en position haute','Ne pas faire de rotation','Descente lente']
  },

  // ══════════════════════════════════════════
  // BICEPS (6 exercices)
  // ══════════════════════════════════════════
  curl_halteres: {
    nom:'Curl haltères', muscle:'Biceps',
    muscles_sec:['Avant-bras'],
    groupe:'pull',
    equipement:'Haltères',
    emoji:'💪', difficulte:1,
    youtube:'sAq_ocpS3zY',
    description:'Coudes fixés contre le corps.',
    conseils:['Coudes fixes','Supination complète','Descente lente']
  },
  curl_barre: {
    nom:'Curl barre EZ', muscle:'Biceps',
    muscles_sec:['Avant-bras'],
    groupe:'pull',
    equipement:'Barre EZ',
    emoji:'💪', difficulte:1,
    youtube:'kwG2ipFRgfo',
    description:'Barre EZ pour protéger les poignets.',
    conseils:['Pas de balancement','Coudes fixes','Prise EZ plus confortable']
  },
  curl_marteau: {
    nom:'Curl marteau', muscle:'Brachial',
    muscles_sec:['Biceps','Avant-bras'],
    groupe:'pull',
    equipement:'Haltères',
    emoji:'🔨', difficulte:1,
    youtube:'zC3nLlEvin4',
    description:'Prise neutre (pouces vers le haut).',
    conseils:['Prise neutre','Coudes fixes','Mouvement lent']
  },
  curl_machine: {
    nom:'Curl machine', muscle:'Biceps',
    muscles_sec:[],
    groupe:'pull',
    equipement:'Machine Curl',
    emoji:'🤖', difficulte:1,
    youtube:'fIWP-FRFNU0',
    description:'Machine guidée, isolation parfaite.',
    conseils:['Bras bien collés au pupitre','Amplitude complète','Squeeze fort en haut']
  },
  // ── NOUVEAUX BICEPS ──────────────────────
  spider_curl: {
    nom:'Spider Curl', muscle:'Biceps (pic)',
    muscles_sec:['Avant-bras'],
    groupe:'pull',
    equipement:'Banc incliné + Haltères ou Barre EZ',
    emoji:'🕷️', difficulte:2,
    youtube:'kwG2ipFRgfo',
    description:'Allongé face contre banc incliné, curl strict sans balancement.',
    conseils:['Poitrine collée au banc','Isolation maximale','Contrôle total','Squeeze fort en haut']
  },
  incline_curl: {
    nom:'Curl incliné', muscle:'Biceps (longue portion)',
    muscles_sec:['Avant-bras'],
    groupe:'pull',
    equipement:'Banc incliné + Haltères',
    emoji:'📐', difficulte:2,
    youtube:'sAq_ocpS3zY',
    description:'Assis sur banc incliné 45°, amplitude maximale.',
    conseils:['Dos contre le banc','Bras tombent librement','Amplitude maximale','Mouvement lent']
  },

  // ══════════════════════════════════════════
  // TRICEPS (5 exercices)
  // ══════════════════════════════════════════
  ext_triceps_poulie: {
    nom:'Extension triceps poulie', muscle:'Triceps',
    muscles_sec:[],
    groupe:'push',
    equipement:'Câble poulie haute + corde',
    emoji:'⬇️', difficulte:1,
    youtube:'vB5OHsJ3EME',
    description:'Coudes fixes contre le corps.',
    conseils:['Coudes fixes','Extension complète','Écarter légèrement la corde en bas']
  },
  barre_front: {
    nom:'Barre au front', muscle:'Triceps',
    muscles_sec:[],
    groupe:'push',
    equipement:'Barre EZ + Banc plat',
    emoji:'💥', difficulte:2,
    youtube:'NIKnG_8szOQ',
    description:'Allongé, barre descend vers le front.',
    conseils:['Coudes fixes','Contrôle total','Ne jamais toucher le front !']
  },
  dips_triceps: {
    nom:'Dips triceps (banc)', muscle:'Triceps',
    muscles_sec:['Épaules'],
    groupe:'push',
    equipement:'Banc',
    emoji:'⬇️', difficulte:1,
    youtube:'wjUmnZH528Y',
    description:'Mains sur le banc, corps proche.',
    conseils:['Corps proche du banc','Coudes vers l\'arrière','Amplitude complète']
  },
  // ── NOUVEAUX TRICEPS ─────────────────────
  overhead_triceps_cable: {
    nom:'Extension overhead câble', muscle:'Triceps (longue portion)',
    muscles_sec:[],
    groupe:'push',
    equipement:'Câble poulie basse + corde',
    emoji:'🔼', difficulte:2,
    youtube:'YbX7Wd8jQ-Q',
    description:'Face à la poulie, extension au-dessus de la tête.',
    conseils:['Coudes près des oreilles','Amplitude maximale','Core gainé','Mouvement lent']
  },
  close_grip_bench: {
    nom:'Développé serré', muscle:'Triceps',
    muscles_sec:['Pectoraux'],
    groupe:'push',
    equipement:'Barre olympique + Banc plat',
    emoji:'🤏', difficulte:2,
    youtube:'nEF0bv2FW94',
    description:'Développé couché prise serrée, focus triceps.',
    conseils:['Prise légèrement plus étroite que les épaules','Coudes proches du corps','Contrôle en descente','Lockout complet']
  },

  // ══════════════════════════════════════════
  // JAMBES (11 exercices)
  // ══════════════════════════════════════════
  squat: {
    nom:'Squat', muscle:'Quadriceps',
    muscles_sec:['Fessiers','Ischio-jambiers','Core'],
    groupe:'jambes',
    equipement:'Rack à squat + Barre',
    emoji:'🦵', difficulte:3,
    youtube:'ultWZbUMPL8',
    description:'Pieds largeur épaules ou légèrement plus larges.',
    conseils:['Genoux dans l\'axe des pieds','Talons au sol','Dos droit','Profondeur ≥ parallèle']
  },
  presse_cuisses: {
    nom:'Presse à cuisses', muscle:'Quadriceps',
    muscles_sec:['Fessiers','Ischio-jambiers'],
    groupe:'jambes',
    equipement:'Machine Presse inclinée',
    emoji:'🤖', difficulte:1,
    youtube:'IZxyjW7SKSA',
    description:'Pieds à plat à largeur des épaules.',
    conseils:['Ne pas décoller les fesses','Pieds à plat','Ne pas verrouiller en haut']
  },
  fentes: {
    nom:'Fentes marchées', muscle:'Quadriceps',
    muscles_sec:['Fessiers','Ischio-jambiers'],
    groupe:'jambes',
    equipement:'Haltères',
    emoji:'🚶', difficulte:2,
    youtube:'QOVaHwm-Q6U',
    description:'Grand pas en avant, descendre le genou arrière.',
    conseils:['Genou avant dans l\'axe','Torse droit','Contrôle de l\'équilibre']
  },
  leg_curl: {
    nom:'Leg Curl couché', muscle:'Ischio-jambiers',
    muscles_sec:[],
    groupe:'jambes',
    equipement:'Machine Leg Curl',
    emoji:'🦵', difficulte:1,
    youtube:'ELOCsoDSmrg',
    description:'Allongé, fléchir les genoux.',
    conseils:['Hanches collées','Amplitude complète','Pas d\'à-coup en haut']
  },
  leg_extension: {
    nom:'Leg Extension', muscle:'Quadriceps',
    muscles_sec:[],
    groupe:'jambes',
    equipement:'Machine Leg Extension',
    emoji:'🦵', difficulte:1,
    youtube:'ljO4jkNWCKk',
    description:'Assis, étendre les jambes.',
    conseils:['Pas de verrouillage brutal','Contrôle en descente','Squeeze en position haute']
  },
  mollets: {
    nom:'Mollets debout', muscle:'Mollets',
    muscles_sec:[],
    groupe:'jambes',
    equipement:'Machine Mollets / Smith Machine',
    emoji:'⬆️', difficulte:1,
    youtube:'gwLzBJYoWlA',
    description:'Monter sur la pointe des pieds.',
    conseils:['Amplitude complète','Tenir 1s en position haute','Descente lente']
  },
  hip_thrust: {
    nom:'Hip Thrust', muscle:'Fessiers',
    muscles_sec:['Ischio-jambiers'],
    groupe:'jambes',
    equipement:'Barre + Banc',
    emoji:'🍑', difficulte:2,
    youtube:'SEdqd1n0cvg',
    description:'Dos contre le banc, barre sur les hanches.',
    conseils:['Squeeze fort en haut','Menton rentré','Pieds à plat']
  },
  // ── NOUVEAUX JAMBES ──────────────────────
  hack_squat: {
    nom:'Hack Squat', muscle:'Quadriceps',
    muscles_sec:['Fessiers'],
    groupe:'jambes',
    equipement:'Machine Hack Squat',
    emoji:'🦿', difficulte:2,
    youtube:'uYumuL_G_V0',
    description:'Machine guidée inclinée, excellente isolation quadriceps.',
    conseils:['Pieds légèrement en avant','Dos plaqué contre le dossier','Profondeur maximale','Genoux dans l\'axe des pieds']
  },
  goblet_squat: {
    nom:'Goblet Squat', muscle:'Quadriceps / Core',
    muscles_sec:['Fessiers','Core'],
    groupe:'jambes',
    equipement:'Haltère ou Kettlebell',
    emoji:'🏆', difficulte:1,
    youtube:'MxsFDJCGFqU',
    description:'Squat avec haltère tenu contre la poitrine.',
    conseils:['Haltère contre la poitrine','Coudes entre les genoux en bas','Idéal pour débutants','Talon au sol']
  },
  sumo_squat: {
    nom:'Sumo Squat / Deadlift', muscle:'Ischio-jambiers / Adducteurs',
    muscles_sec:['Fessiers','Quadriceps'],
    groupe:'jambes',
    equipement:'Barre ou Haltère',
    emoji:'🥋', difficulte:2,
    youtube:'67oNKBXSBh0',
    description:'Pieds très écartés, orteils vers l\'extérieur.',
    conseils:['Pieds à 45° vers l\'extérieur','Genoux dans l\'axe des pieds','Dos neutre','Hanches descendent directement vers le bas']
  },
  nordic_curl: {
    nom:'Nordic Curl', muscle:'Ischio-jambiers',
    muscles_sec:[],
    groupe:'jambes',
    equipement:'Partenaire ou fixation aux pieds',
    emoji:'🎿', difficulte:4,
    youtube:'ELOCsoDSmrg',
    description:'Pieds fixés, descendre le corps en avant en contrôlant.',
    conseils:['Un des meilleurs exercices pour les ischio','Descente très lente','Utiliser les bras en fin de mouvement','Progresser doucement']
  },
  glute_kickback: {
    nom:'Glute Kickback câble', muscle:'Fessiers',
    muscles_sec:['Ischio-jambiers'],
    groupe:'jambes',
    equipement:'Câble + Cheville',
    emoji:'🦶', difficulte:1,
    youtube:'SEdqd1n0cvg',
    description:'Debout face au câble, extension de la jambe vers l\'arrière.',
    conseils:['Core gainé','Jambe portante légèrement fléchie','Squeeze fessier en haut','Ne pas compenser avec le dos']
  },

  // ══════════════════════════════════════════
  // ABDOMINAUX (6 exercices)
  // ══════════════════════════════════════════
  planche: {
    nom:'Planche', muscle:'Core',
    muscles_sec:['Épaules','Fessiers'],
    groupe:'abdos',
    equipement:'Tapis / Sol',
    emoji:'━', difficulte:1,
    youtube:'pSHjTRCQxIw',
    description:'Corps en ligne droite, appui sur les avant-bras.',
    conseils:['Dos parfaitement plat','Ne pas lever les fesses','Respirer normalement','Gainage actif']
  },
  crunch_machine: {
    nom:'Crunch machine', muscle:'Abdominaux',
    muscles_sec:[],
    groupe:'abdos',
    equipement:'Machine Abdos',
    emoji:'🤖', difficulte:1,
    youtube:'Xyd_fa5zoEU',
    description:'Flexion du tronc en expirant.',
    conseils:['Expirer en fléchissant','Pas d\'élan','Amplitude contrôlée']
  },
  releve_jambes: {
    nom:'Relevé de jambes suspendu', muscle:'Abdominaux Bas',
    muscles_sec:['Hip Flexors'],
    groupe:'abdos',
    equipement:'Barre de traction',
    emoji:'⬆️', difficulte:3,
    youtube:'JB2oyawG9KQ',
    description:'Suspendu à la barre, lever les jambes.',
    conseils:['Pas de balancement','Contrôle total','Rétroversion du bassin']
  },
  russian_twist: {
    nom:'Russian Twist', muscle:'Obliques',
    muscles_sec:['Abdominaux'],
    groupe:'abdos',
    equipement:'Haltère / Médecine ball',
    emoji:'🔄', difficulte:2,
    youtube:'wkD8rjkodUI',
    description:'Assis, tourner le tronc alternativement.',
    conseils:['Talons au sol ou légèrement levés','Rotation depuis le tronc','Contrôle']
  },
  // ── NOUVEAUX ABDOS ───────────────────────
  dragon_flag: {
    nom:'Dragon Flag', muscle:'Core Complet',
    muscles_sec:['Hip Flexors','Épaules'],
    groupe:'abdos',
    equipement:'Banc ou barre fixe',
    emoji:'🐉', difficulte:5,
    youtube:'pSHjTRCQxIw',
    description:'Allongé, maintenir le corps rigide et descendre lentement.',
    conseils:['Un des exercices les plus difficiles','Corps parfaitement rigide','Descente très lente','Progression obligatoire']
  },
  hollow_body: {
    nom:'Hollow Body Hold', muscle:'Core Complet',
    muscles_sec:['Hip Flexors'],
    groupe:'abdos',
    equipement:'Tapis',
    emoji:'🍌', difficulte:2,
    youtube:'pSHjTRCQxIw',
    description:'Position creuse maintenue au sol, bras et jambes tendus.',
    conseils:['Bas du dos collé au sol','Bras tendus derrière la tête','Respirer normalement','Position de base de la gymnastique']
  },
  side_plank: {
    nom:'Planche latérale', muscle:'Obliques',
    muscles_sec:['Core','Épaules'],
    groupe:'abdos',
    equipement:'Tapis',
    emoji:'📏', difficulte:2,
    youtube:'pSHjTRCQxIw',
    description:'Appui sur un avant-bras, corps latéralement en ligne droite.',
    conseils:['Hanches bien alignées','Ne pas laisser tomber les hanches','Respirer normalement','Maintenir la position']
  },

  // ══════════════════════════════════════════
  // CARDIO (5 exercices)
  // ══════════════════════════════════════════
  rameur: {
    nom:'Rameur', muscle:'Full Body Cardio',
    muscles_sec:['Dos','Jambes','Bras'],
    groupe:'cardio',
    equipement:'Rameur',
    emoji:'🚣', difficulte:2,
    youtube:'j3G1dQbnABQ',
    description:'60% jambes / 30% dos / 10% bras.',
    conseils:['Jambes d\'abord','Incliner le dos ensuite','Bras en dernier']
  },
  velo: {
    nom:'Vélo stationnaire', muscle:'Cardio / Jambes',
    muscles_sec:['Quadriceps','Mollets'],
    groupe:'cardio',
    equipement:'Vélo',
    emoji:'🚴', difficulte:1,
    youtube:'',
    description:'Cardio low-impact.',
    conseils:['Selle à hauteur de hanche','Résistance progressive','Cadence régulière']
  },
  // ── NOUVEAUX CARDIO ──────────────────────
  corde_a_sauter: {
    nom:'Corde à sauter', muscle:'Cardio / Mollets',
    muscles_sec:['Mollets','Épaules','Core'],
    groupe:'cardio',
    equipement:'Corde à sauter',
    emoji:'🪢', difficulte:2,
    youtube:'gwLzBJYoWlA',
    description:'Sauts rythmés à la corde, cardio intense.',
    conseils:['Sur les pointes des pieds','Rotation des poignets uniquement','Commencer lentement','Maintenir un rythme régulier']
  },
  burpees: {
    nom:'Burpees', muscle:'Full Body Cardio',
    muscles_sec:['Pectoraux','Quadriceps','Core'],
    groupe:'cardio',
    equipement:'Poids du corps',
    emoji:'💦', difficulte:3,
    youtube:'IODxDxX7oi4',
    description:'Squat → planche → pompe → saut vertical.',
    conseils:['Enchaîner les mouvements sans pause','Atterrissage doux','Corps rigide en planche','Sauter haut en finissant']
  },
  mountain_climbers: {
    nom:'Mountain Climbers', muscle:'Core / Cardio',
    muscles_sec:['Épaules','Hip Flexors'],
    groupe:'cardio',
    equipement:'Tapis',
    emoji:'🧗', difficulte:2,
    youtube:'pSHjTRCQxIw',
    description:'En position de pompes, ramener les genoux alternativement vers la poitrine.',
    conseils:['Hanches basses','Corps rigide','Rythme rapide','Respirer régulièrement']
  },

  // ══════════════════════════════════════════
  // FULL BODY (4 exercices)
  // ══════════════════════════════════════════
  clean_press: {
    nom:'Clean & Press', muscle:'Full Body',
    muscles_sec:['Épaules','Quadriceps','Dos'],
    groupe:'fullbody',
    equipement:'Barre ou Haltères',
    emoji:'🏅', difficulte:4,
    youtube:'CnBmiBqp-AI',
    description:'Soulever la barre de sol à l\'épaule puis au-dessus de la tête.',
    conseils:['Apprentissage technique obligatoire','Explosivité dans le tirage','Core gainé pendant tout le mouvement','Commencer léger']
  },
  thruster: {
    nom:'Thruster', muscle:'Full Body',
    muscles_sec:['Quadriceps','Épaules','Triceps'],
    groupe:'fullbody',
    equipement:'Barre ou Haltères',
    emoji:'🚀', difficulte:3,
    youtube:'CnBmiBqp-AI',
    description:'Front squat enchaîné avec un développé en un seul mouvement.',
    conseils:['Utiliser l\'élan du squat','Transition fluide','Core gainé','Excellent pour le HIIT']
  },
  kettlebell_swing: {
    nom:'Kettlebell Swing', muscle:'Chaîne postérieure',
    muscles_sec:['Fessiers','Ischio-jambiers','Core'],
    groupe:'fullbody',
    equipement:'Kettlebell',
    emoji:'⚫', difficulte:2,
    youtube:'op9kVnSso6Q',
    description:'Balancement du kettlebell avec extension explosive des hanches.',
    conseils:['Mouvement des hanches (pas des bras)','Extension explosive','Dos neutre','Le poids doit monter jusqu\'à la hauteur des épaules']
  },
  turkish_getup: {
    nom:'Turkish Get-up', muscle:'Full Body / Core',
    muscles_sec:['Épaules','Core','Fessiers'],
    groupe:'fullbody',
    equipement:'Kettlebell ou Haltère',
    emoji:'🧘', difficulte:4,
    youtube:'CnBmiBqp-AI',
    description:'Se lever du sol à debout avec une charge tenue bras tendu.',
    conseils:['Apprendre sans charge d\'abord','Regard sur la charge','Mouvement très lent','Chaque étape distincte']
  }
};

// ════════════════════════════════════════════════════════════
// SÉANCES DE BASE (identique — aucun bug trouvé)
// ════════════════════════════════════════════════════════════
const SEANCES_BASE = {
  pec_tri: {
    id:'pec_tri', nom:'Pectoraux + Triceps', emoji:'💪',
    muscles:['Pectoraux','Triceps'], duree_estimee:65,
    exercices:[
      {ref:'bench_press',         series:4, reps:'8-10',  repos:90},
      {ref:'incline_halteres',    series:4, reps:'10',    repos:90},
      {ref:'chest_press_machine', series:3, reps:'12',    repos:75},
      {ref:'ecarte_poulie',       series:3, reps:'12-15', repos:60},
      {ref:'ext_triceps_poulie',  series:3, reps:'12',    repos:60},
      {ref:'dips_triceps',        series:3, reps:'échec', repos:60}
    ]
  },
  dos_bi: {
    id:'dos_bi', nom:'Dos + Biceps', emoji:'🔗',
    muscles:['Dos','Biceps'], duree_estimee:65,
    exercices:[
      {ref:'tractions',      series:4, reps:'max',   repos:90},
      {ref:'rowing_barre',   series:4, reps:'8-10',  repos:90},
      {ref:'lat_pulldown',   series:3, reps:'10-12', repos:75},
      {ref:'rowing_machine', series:3, reps:'12',    repos:75},
      {ref:'curl_halteres',  series:3, reps:'12',    repos:60},
      {ref:'curl_marteau',   series:3, reps:'12',    repos:60}
    ]
  },
  epaules_bras: {
    id:'epaules_bras', nom:'Épaules + Bras', emoji:'💪',
    muscles:['Épaules','Biceps','Triceps'], duree_estimee:65,
    exercices:[
      {ref:'dev_militaire',          series:4, reps:'8-10',  repos:90},
      {ref:'elev_laterales',         series:4, reps:'12-15', repos:60},
      {ref:'shoulder_press_machine', series:3, reps:'12',    repos:75},
      {ref:'face_pull',              series:3, reps:'15',    repos:60},
      {ref:'curl_barre',             series:3, reps:'10',    repos:60},
      {ref:'barre_front',            series:3, reps:'10',    repos:60}
    ]
  },
  jambes: {
    id:'jambes', nom:'Jambes + Fessiers', emoji:'🦵',
    muscles:['Quadriceps','Ischio-jambiers','Fessiers','Mollets'],
    duree_estimee:70,
    exercices:[
      {ref:'squat',          series:4, reps:'8-10',  repos:120},
      {ref:'presse_cuisses', series:4, reps:'10-12', repos:90},
      {ref:'fentes',         series:3, reps:'12/j',  repos:75},
      {ref:'leg_curl',       series:3, reps:'12',    repos:75},
      {ref:'leg_extension',  series:3, reps:'15',    repos:60},
      {ref:'mollets',        series:4, reps:'15-20', repos:45}
    ]
  },
  full_body: {
    id:'full_body', nom:'Full Body + Gainage', emoji:'🔄',
    muscles:['Full Body','Core'], duree_estimee:60,
    exercices:[
      {ref:'soulevé_terre',  series:4, reps:'6-8',    repos:120},
      {ref:'rowing_machine', series:3, reps:'12',     repos:75},
      {ref:'planche',        series:3, reps:'45-60s', repos:60},
      {ref:'releve_jambes',  series:3, reps:'12-15',  repos:60},
      {ref:'russian_twist',  series:3, reps:'20',     repos:45},
      {ref:'crunch_machine', series:3, reps:'15',     repos:45}
    ]
  }
};

// ════════════════════════════════════════════════════════════
// PLANNING HEBDOMADAIRE
// ════════════════════════════════════════════════════════════
const PLANNING_SEMAINE_DEFAUT = [
  {jour:0, label:'LUN', seanceId:'pec_tri'      },
  {jour:1, label:'MAR', seanceId:'dos_bi'       },
  {jour:2, label:'MER', seanceId:'epaules_bras' },
  {jour:3, label:'JEU', seanceId:null           },
  {jour:4, label:'VEN', seanceId:'jambes'       },
  {jour:5, label:'SAM', seanceId:'full_body'    },
  {jour:6, label:'DIM', seanceId:null           }
];

// ✅ FIX — Initialisation sécurisée du planning
let PLANNING_SEMAINE = (() => {
  try {
    const custom = Utils.storage.get('ft_planning_custom', null);
    return custom ? [...custom] : [...PLANNING_SEMAINE_DEFAUT];
  } catch(e) {
    return [...PLANNING_SEMAINE_DEFAUT];
  }
})();

// ════════════════════════════════════════════════════════════
// WARM-UP
// ════════════════════════════════════════════════════════════
const WARMUP = {
  general: [
    {nom:'Vélo stationnaire',     duree:300, description:'5 min cadence modérée'},
    {nom:'Rotations épaules',     duree:30,  description:'10 reps chaque sens'  },
    {nom:'Rotations hanches',     duree:30,  description:'10 reps chaque sens'  },
    {nom:'Squats poids du corps', duree:60,  description:'15 reps lentes'       },
    {nom:'Pompes légères',        duree:60,  description:'10 reps sans effort'  }
  ],
  pec_tri: [
    {nom:'Vélo / Elliptique', duree:300, description:'5 min'             },
    {nom:'Rotations bras',    duree:30,  description:'10 reps chaque sens'},
    {nom:'Pompes légères',    duree:60,  description:'15 reps faciles'   },
    {nom:'Bench barre vide',  duree:60,  description:'20 reps, technique'}
  ],
  dos_bi: [
    {nom:'Rameur',              duree:300, description:'5 min léger'       },
    {nom:'Rotations épaules',   duree:30,  description:'10 reps'           },
    {nom:'Tractions assistées', duree:60,  description:'5 reps faciles'    },
    {nom:'Rowing barre vide',   duree:60,  description:'15 reps, technique'}
  ],
  epaules_bras: [
    {nom:'Vélo',          duree:300, description:'5 min léger'           },
    {nom:'Circles bras',  duree:30,  description:'10 reps chaque sens'   },
    {nom:'Face pull léger',duree:60, description:'15 reps, focus posture'}
  ],
  jambes: [
    {nom:'Vélo stationnaire',    duree:300, description:'5 min'               },
    {nom:'Leg swing',            duree:30,  description:'10 reps chaque jambe'},
    {nom:'Squats goblet légers', duree:60,  description:'10 reps'             },
    {nom:'Fentes sur place',     duree:60,  description:'8 reps chaque jambe' }
  ],
  full_body: [
    {nom:'Rameur',               duree:300, description:'5 min cadence modérée'},
    {nom:'Hip hinge barre vide', duree:60,  description:'10 reps, technique'   },
    {nom:'Squats poids du corps',duree:60,  description:'10 reps'              }
  ]
};

// ════════════════════════════════════════════════════════════
// ÉTIREMENTS POST-SÉANCE
// ════════════════════════════════════════════════════════════
const ETIREMENTS = {
  pec_tri: [
    {nom:'Étirement pectoraux au mur', duree:30, gif:'🧘'},
    {nom:'Étirement triceps',          duree:30, gif:'🧘'},
    {nom:'Étirement épaule croisée',   duree:30, gif:'🧘'}
  ],
  dos_bi: [
    {nom:'Child pose',              duree:45, gif:'🧘'},
    {nom:'Étirement biceps au mur', duree:30, gif:'🧘'},
    {nom:'Torsion assis',           duree:30, gif:'🧘'}
  ],
  epaules_bras: [
    {nom:'Étirement épaule croisée',  duree:30, gif:'🧘'},
    {nom:'Rotation externe étirée',   duree:30, gif:'🧘'},
    {nom:'Triceps au mur',            duree:30, gif:'🧘'}
  ],
  jambes: [
    {nom:'Étirement quadriceps debout', duree:30, gif:'🧘'},
    {nom:'Étirement ischio au sol',     duree:45, gif:'🧘'},
    {nom:'Pigeon pose fessiers',        duree:45, gif:'🧘'},
    {nom:'Étirement mollets au mur',    duree:30, gif:'🧘'}
  ],
  full_body: [
    {nom:'Étirement dos complet',   duree:45, gif:'🧘'},
    {nom:'Cat-Cow stretch',         duree:30, gif:'🧘'},
    {nom:'Étirement hip flexors',   duree:45, gif:'🧘'}
  ]
};

// ════════════════════════════════════════════════════════════
// SUPERSETS RECOMMANDÉS
// ════════════════════════════════════════════════════════════
const SUPERSETS_RECOMMANDES = {
  pec_tri: [{
    id:'ss_bench_dips', nom:'Superset Pec+Tri',
    emoji:'⚡',
    exercices:[
      {ref:'bench_press',  series:3, reps:'8',  repos:0 },
      {ref:'dips_triceps', series:3, reps:'12', repos:90}
    ]
  }],
  dos_bi: [{
    id:'ss_pulldown_curl', nom:'Superset Dos+Bi',
    emoji:'⚡',
    exercices:[
      {ref:'lat_pulldown',  series:3, reps:'10', repos:0 },
      {ref:'curl_halteres', series:3, reps:'12', repos:90}
    ]
  }],
  epaules_bras: [{
    id:'ss_lateral_facepull', nom:'Superset Épaules',
    emoji:'⚡',
    exercices:[
      {ref:'elev_laterales', series:3, reps:'12', repos:0 },
      {ref:'face_pull',      series:3, reps:'15', repos:75}
    ]
  }]
};

// ════════════════════════════════════════════════════════════
// PROGRAMME — SYSTÈME CYCLES INFINIS
// ════════════════════════════════════════════════════════════
const Programme = {

  getDateDebut() {
    return Utils.storage.get('ft_date_debut')
      || Utils.aujourd_hui();
  },

  setDateDebut(date) {
    Utils.storage.set('ft_date_debut', date);
  },

  getSemaineActuelle() {
    try {
      const debut = this.getDateDebut();
      return Math.max(1, Utils.semainesDepuis(debut));
    } catch(e) { return 1; }
  },

  getCycleActuel() {
    return Math.floor((this.getSemaineActuelle() - 1) / 16) + 1;
  },

  getSemaineDansCycle() {
    return ((this.getSemaineActuelle() - 1) % 16) + 1;
  },

  getPhaseActuelle() {
    const s    = this.getSemaineDansCycle();
    const mult = 1 + (this.getCycleActuel() - 1) * 0.05;

    if (s <= 4) return {
      nom:'Reprise', numero:1,
      description:'Technique & Adaptation',
      intensite: Math.min(0.65 * mult, 0.75),
      couleur:'#8bf0bb', emoji:'🌱'
    };
    if (s <= 8) return {
      nom:'Construction', numero:2,
      description:'Volume & Hypertrophie',
      intensite: Math.min(0.75 * mult, 0.85),
      couleur:'#4b4bf9', emoji:'🏗️'
    };
    if (s <= 12) return {
      nom:'Intensité', numero:3,
      description:'Force & Records',
      intensite: Math.min(0.85 * mult, 0.95),
      couleur:'#bfa1ff', emoji:'💥'
    };
    if (s < 16) return {
      nom:'Peak', numero:4,
      description:'Records & Performance max',
      intensite: Math.min(0.95 * mult, 1.0),
      couleur:'#f9ef77', emoji:'🏆'
    };
    return {
      nom:'Décharge', numero:4,
      description:'Récupération active',
      intensite: 0.55,
      couleur:'#ff8d96', emoji:'😴', decharge:true
    };
  },

  isDecharge() {
    return this.getSemaineDansCycle() === 16
      || this.getPhaseActuelle().decharge === true;
  },

  getSeanceduJour(dateStr = null) {
    try {
      const date      = dateStr || Utils.aujourd_hui();
      const indexJour = Utils.indexJourSemaine(date);
      const planning  = PLANNING_SEMAINE[indexJour];
      if (!planning?.seanceId) return null;

      const seance = this._getSeanceById(planning.seanceId);
      if (!seance) return null;

      return {
        ...Utils.clone(seance),
        dateStr: dateStr || Utils.aujourd_hui(),
        phase:   this.getPhaseActuelle(),
        semaine: this.getSemaineActuelle(),
        cycle:   this.getCycleActuel()
      };
    } catch(e) { return null; }
  },

  getProchaineSeance() {
    // ✅ FIX — Démarrer à i=1 pour ne pas retourner la séance du jour
    // si elle a déjà été faite (on peut vouloir les deux comportements,
    // mais i=0 fait double emploi avec getSeanceduJour)
    for (let i = 1; i <= 7; i++) {
      const date   = Utils.ajouterJours(Utils.aujourd_hui(), i);
      const seance = this.getSeanceduJour(date);
      if (seance) {
        return { ...seance, dateStr:date, dansJours:i };
      }
    }
    return null;
  },

  getSeancesSemaine(offset = 0) {
    try {
      const debut = Utils.ajouterJours(
        Utils.debutSemaine(Utils.aujourd_hui()),
        offset * 7
      );
      return PLANNING_SEMAINE.map(p => {
        const date = Utils.ajouterJours(debut, p.jour);
        return {
          ...p,
          date,
          seance:        p.seanceId ? this._getSeanceById(p.seanceId) : null,
          estRepos:      !p.seanceId,
          estAujourdhui: date === Utils.aujourd_hui(),
          estPasse:      date < Utils.aujourd_hui()
        };
      });
    } catch(e) { return []; }
  },

  getSeanceComplete(seanceId) {
    try {
      const seance = this._getSeanceById(seanceId);
      if (!seance) return null;

      const clone = Utils.clone(seance);
      return {
        ...clone,
        exercicesDetails: (seance.exercices||[]).map(ex => ({
          ...ex,
          details: EXERCICES[ex.ref] || {}
        })),
        warmup:    WARMUP[seanceId]                  || WARMUP.general,
        etirements:ETIREMENTS[seanceId]              || [],
        supersets: SUPERSETS_RECOMMANDES[seanceId]   || []
      };
    } catch(e) { return null; }
  },

  getAllSeances() {
    try {
      const customs    = this._getSeancesCustom();
      const base       = Object.values(SEANCES_BASE);
      const customList = Object.values(customs);
      const ids        = new Set(base.map(s => s.id));
      return [
        ...base,
        ...customList.filter(s => !ids.has(s.id))
      ];
    } catch(e) {
      return Object.values(SEANCES_BASE);
    }
  },

  getInfosProgramme() {
    try {
      const semaine     = this.getSemaineActuelle();
      const cycle       = this.getCycleActuel();
      const semaineC    = this.getSemaineDansCycle();
      const phase       = this.getPhaseActuelle();
      const progression = Math.round((semaineC / 16) * 100);
      return {
        semaine, cycle,
        semaineInCycle: semaineC,
        phase, progression,
        label:   `Semaine ${semaine} · ${phase.nom}`,
        decharge: this.isDecharge()
      };
    } catch(e) {
      return {
        semaine:1, cycle:1, semaineInCycle:1,
        phase:{ nom:'Reprise', emoji:'🌱', numero:1,
                couleur:'#8bf0bb', intensite:.65 },
        progression:0,
        label:'Semaine 1 · Reprise',
        decharge:false
      };
    }
  },

  getChargesRecommandees(exerciceRef) {
    try {
      const phase = this.getPhaseActuelle();
      const pr    = window.Tracker?.getPR(exerciceRef);
      if (!pr?.rm1) return null;

      const charge = Math.round(
        pr.rm1 * phase.intensite / 2.5
      ) * 2.5;

      return {
        charge,
        pourcentage: Math.round(phase.intensite * 100),
        phase:       phase.nom,
        rm1Base:     pr.rm1
      };
    } catch(e) { return null; }
  },

  // ✅ FIX — Ajout de l'emoji dans getSupersets
  getSupersets(seanceId) {
    const ss = SUPERSETS_RECOMMANDES[seanceId] || [];
    // Ajouter customs
    try {
      const customSS = Utils.storage.get(
        `ft_supersets_custom_${seanceId}`, []
      );
      return [...ss, ...customSS];
    } catch(e) {
      return ss;
    }
  },

  getPlanningActuel() {
    return PLANNING_SEMAINE;
  },

  sauvegarderPlanning(planning) {
    Utils.storage.set('ft_planning_custom', planning);
    PLANNING_SEMAINE.splice(0, 7, ...planning);
    window.PLANNING_SEMAINE = PLANNING_SEMAINE;
  },

  resetPlanning() {
    Utils.storage.remove('ft_planning_custom');
    PLANNING_SEMAINE.splice(0, 7, ...PLANNING_SEMAINE_DEFAUT);
    window.PLANNING_SEMAINE = PLANNING_SEMAINE;
  },

  estPlanningCustom() {
    return Utils.storage.get('ft_planning_custom', null) !== null;
  },

  getSeancesCustom() {
    return this._getSeancesCustom();
  },

  creerSeanceCustom(data) {
    const customs = this._getSeancesCustom();
    const id = 'custom_seance_' +
      (data.nom || 'seance')
        .toLowerCase()
        .replace(/\s+/g,'_')
        .replace(/[^a-z0-9_]/g,'')
      + '_' + Date.now();

    customs[id] = {
      id,
      nom:           data.nom           || 'Ma séance',
      emoji:         data.emoji         || '💪',
      muscles:       data.muscles       || [],
      duree_estimee: data.duree_estimee || 60,
      exercices:     data.exercices     || [],
      custom:        true,
      dateCreation:  Utils.aujourd_hui()
    };

    this._saveSeancesCustom(customs);
    return id;
  },

  modifierSeanceCustom(id, data) {
    const customs = this._getSeancesCustom();
    if (!customs[id]) return false;

    customs[id] = {
      ...customs[id],
      nom:           data.nom           ?? customs[id].nom,
      emoji:         data.emoji         ?? customs[id].emoji,
      muscles:       data.muscles       ?? customs[id].muscles,
      duree_estimee: data.duree_estimee ?? customs[id].duree_estimee,
      exercices:     data.exercices     ?? customs[id].exercices
    };

    this._saveSeancesCustom(customs);
    return true;
  },

  supprimerSeanceCustom(id) {
    const customs = this._getSeancesCustom();
    delete customs[id];
    this._saveSeancesCustom(customs);

    const planning = this.getPlanningActuel().map(p =>
      p.seanceId === id ? { ...p, seanceId:null } : p
    );
    this.sauvegarderPlanning(planning);
  },

  dupliquerSeanceBase(seanceBaseId) {
    const base = SEANCES_BASE[seanceBaseId];
    if (!base) return null;
    return this.creerSeanceCustom({
      nom:           base.nom + ' (copie)',
      emoji:         base.emoji,
      muscles:       [...(base.muscles||[])],
      duree_estimee: base.duree_estimee,
      exercices:     (base.exercices||[]).map(e => ({...e}))
    });
  },

  _getSeanceById(id) {
    if (!id) return null;
    const customs = this._getSeancesCustom();
    return customs[id] || SEANCES_BASE[id] || null;
  },

  _getSeancesCustom() {
    return Utils.storage.get('ft_seances_custom', {});
  },

  _saveSeancesCustom(seances) {
    Utils.storage.set('ft_seances_custom', seances);
  },

  getStatsProgramme() {
    try {
      return {
        totalSeancesBase: Object.values(SEANCES_BASE).length,
        totalExercices:   Object.values(EXERCICES).length,
        cycleActuel:      this.getCycleActuel(),
        semaineActuelle:  this.getSemaineActuelle(),
        progression:      Math.round(
          (this.getSemaineDansCycle() / 16) * 100
        )
      };
    } catch(e) {
      return {
        totalSeancesBase: 5,
        totalExercices:   Object.keys(EXERCICES).length,
        cycleActuel:      1,
        semaineActuelle:  1,
        progression:      0
      };
    }
  }
};

// ════════════════════════════════════════════════════════════
// ✅ NOUVEAU — PROGRAMME AUTO-ADAPTATIF
// ════════════════════════════════════════════════════════════
const ProgrammeAdaptatif = {

  CLE: 'ft_adaptatif_config',

  getConfig() {
    return Utils.storage.get(this.CLE, {
      actif:            true,
      augmentationAuto: true,
      seuilPR:          3,      // Nombre de PRs pour augmenter
      pourcentageHausse: 2.5,   // kg d'augmentation
      detectionStagnation: true,
      semStagnation:    3,      // Semaines avant d'alerter
      variationsAuto:   true,
      surmenageProtection: true
    });
  },

  /**
   * Analyse les performances et retourne des recommandations
   */
  analyser() {
    const prs      = {};
    const analyses = {};
    try { Object.assign(prs, Tracker.getAllPRs()); } catch(e) {}

    Object.keys(window.EXERCICES||{}).forEach(ref => {
      try {
        const hist = Tracker.getHistoriqueExercice(ref, 60);
        if (hist.length < 2) return; // ✅ 2 au lieu de 3 — plus inclusif

        const recents  = hist.slice(0, 6);
        const anciens  = hist.slice(6, 12);

        const moyRec  = recents.reduce((a,h) => a + (h.rm1||0), 0)
          / recents.length;
        const moyAnc  = anciens.length
          ? anciens.reduce((a,h) => a + (h.rm1||0), 0) / anciens.length
          : moyRec;

        const delta    = moyRec - moyAnc;
        const tendance = delta > 2
          ? 'progression'
          : delta < -2
            ? 'regression'
            : 'stagnation';

        analyses[ref] = {
          ref,
          nom:      window.EXERCICES[ref]?.nom || ref,
          emoji:    window.EXERCICES[ref]?.emoji || '💪',
          tendance,
          delta:    Math.round(delta * 10) / 10,
          rm1:      prs[ref]?.rm1 || 0,
          rm1Moy:   Math.round(moyRec)
        };
      } catch(e) {}
    });

    return analyses;
  },

  /**
   * Suggère des ajustements de charges basés sur l'analyse
   */
  getRecommandationsCharges() {
    const config   = this.getConfig();
    const analyses = this.analyser();
    const sugges   = [];

    Object.values(analyses).forEach(a => {
      if (!a.rm1) return;

      if (a.tendance === 'progression' && config.augmentationAuto) {
        sugges.push({
          ref:     a.ref,
          nom:     a.nom,
          emoji:   a.emoji,
          type:    'hausse',
          message: `+${config.pourcentageHausse}kg recommandé`,
          delta:   config.pourcentageHausse,
          color:   'var(--fd-mint)'
        });
      } else if (a.tendance === 'stagnation'
                 && config.detectionStagnation) {
        sugges.push({
          ref:     a.ref,
          nom:     a.nom,
          emoji:   a.emoji,
          type:    'variation',
          message: 'Essaie une variation pour relancer la progression',
          delta:   0,
          color:   'var(--fd-lemon)'
        });
      } else if (a.tendance === 'regression') {
        sugges.push({
          ref:     a.ref,
          nom:     a.nom,
          emoji:   a.emoji,
          type:    'baisse',
          message: '-5kg recommandé (signe de fatigue)',
          delta:   -5,
          color:   'var(--fd-coral)'
        });
      }
    });

    return sugges;
  },

  /**
   * Détecte si l'utilisateur est en surmenage
   */
  detecterSurmenage() {
    try {
      const seances = Tracker.getHistoriqueSeances(14);
      const rpes    = seances
        .filter(s => s.rpeMoyen)
        .map(s => s.rpeMoyen);

      if (rpes.length < 3) return false;

      const moyRPE  = rpes.reduce((a,b) => a+b, 0) / rpes.length;
      const seances7 = seances.filter(s => {
        const debut = Utils.ajouterJours(Utils.aujourd_hui(), -7);
        return s.date >= debut;
      }).length;

      return moyRPE > 8.5 || seances7 >= 6;
    } catch(e) { return false; }
  },

  /**
   * Retourne les exercices de variation pour un exercice
   * qui stagne
   */
  getVariations(ref) {
    const variations = {
      bench_press:    ['incline_halteres','chest_press_machine','pompes'],
      squat:          ['presse_cuisses','fentes','hip_thrust'],
      tractions:      ['lat_pulldown','rowing_barre','pullover'],
      dev_militaire:  ['shoulder_press_machine','elev_laterales','oiseau'],
      curl_halteres:  ['curl_barre','curl_marteau','curl_machine'],
      rowing_barre:   ['rowing_machine','lat_pulldown','tractions'],
      ext_triceps_poulie: ['barre_front','dips_triceps'],
      soulevé_terre:  ['squat','hip_thrust','hip_thrust'],
    };
    return (variations[ref] || []).map(r => ({
      ref:   r,
      nom:   window.EXERCICES?.[r]?.nom   || r,
      emoji: window.EXERCICES?.[r]?.emoji || '💪'
    }));
  },

  /**
   * Render de l'interface adaptative
   */
  render(container) {
    if (!container) return;

    const config    = this.getConfig();
    const analyses  = this.analyser();
    const sugges    = this.getRecommandationsCharges();
    const surmenage = this.detecterSurmenage();

    const progressions = Object.values(analyses)
      .filter(a => a.tendance === 'progression');
    const stagnations  = Object.values(analyses)
      .filter(a => a.tendance === 'stagnation');
    const regressions  = Object.values(analyses)
      .filter(a => a.tendance === 'regression');

    container.innerHTML = `

      <!-- ═══ ALERTE SURMENAGE ═══ -->
      ${surmenage ? `
        <div class="card mb-md"
             style="border-color:var(--fd-coral);
                    background:rgba(255,141,150,0.08)">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:2rem">⚠️</div>
            <div>
              <div style="font-weight:700;color:var(--fd-coral)">
                Surmenage détecté !
              </div>
              <div style="font-size:.78rem;color:var(--text-muted)">
                Ton RPE moyen est élevé ou tu t'entraînes trop souvent.
                Prends 1-2 jours de repos.
              </div>
            </div>
          </div>
        </div>` : ''}

      <!-- ═══ RÉSUMÉ ═══ -->
      <div class="card mb-md"
           style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),
                  rgba(139,240,187,0.05))">
        <div class="card-label mb-md">🧠 Analyse de ta progression</div>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value" style="color:var(--fd-mint)">
              ${progressions.length}
            </span>
            <span class="stat-label">En hausse</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" style="color:var(--fd-lemon)">
              ${stagnations.length}
            </span>
            <span class="stat-label">Stagnation</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" style="color:var(--fd-coral)">
              ${regressions.length}
            </span>
            <span class="stat-label">En baisse</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" style="color:var(--fd-indigo)">
              ${sugges.length}
            </span>
            <span class="stat-label">Suggestions</span>
          </div>
        </div>
      </div>

      <!-- ═══ SUGGESTIONS ═══ -->
      ${sugges.length > 0 ? `
        <div class="section-title">💡 Recommandations</div>
        ${sugges.map(s => `
          <div class="card mb-md"
               style="border-left:4px solid ${s.color}">
            <div class="flex justify-between items-center">
              <div style="display:flex;align-items:center;gap:12px">
                <span style="font-size:1.5rem">${s.emoji}</span>
                <div>
                  <div style="font-weight:700;font-size:.9rem">
                    ${s.nom}
                  </div>
                  <div style="font-size:.72rem;color:${s.color};
                              font-weight:600">
                    ${s.message}
                  </div>
                </div>
              </div>
              ${s.type === 'variation' ? `
                <button onclick="ProgrammeAdaptatif
                          ._voirVariations('${s.ref}')"
                        style="padding:4px 10px;
                               background:${s.color}22;
                               border:1px solid ${s.color}44;
                               border-radius:var(--radius-full);
                               color:${s.color};
                               font-size:.68rem;font-weight:600;
                               cursor:pointer">
                  Voir →
                </button>` : ''}
            </div>
          </div>`).join('')}` : `
        <div class="card mb-md"
             style="text-align:center;padding:var(--space-xl)">
          <div style="font-size:2rem;margin-bottom:8px">📊</div>
          <div style="color:var(--text-muted);font-size:.85rem">
            Pas encore assez de données.<br>
            Fais quelques séances pour voir l'analyse !
          </div>
        </div>`}

      <!-- ═══ EXERCICES EN PROGRESSION ═══ -->
      ${progressions.length > 0 ? `
        <div class="section-title">
          📈 En progression (${progressions.length})
        </div>
        ${progressions.map(a => `
          <div class="card mb-md"
               style="border-color:rgba(139,240,187,0.3)">
            <div class="flex justify-between items-center">
              <div style="display:flex;align-items:center;gap:8px">
                <span>${a.emoji}</span>
                <div style="font-size:.85rem;font-weight:600">
                  ${a.nom}
                </div>
              </div>
              <div style="text-align:right">
                <div style="font-size:.82rem;font-weight:700;
                            color:var(--fd-mint)">
                  +${a.delta}kg
                </div>
                <div style="font-size:.65rem;color:var(--text-muted)">
                  sur les dernières séances
                </div>
              </div>
            </div>
          </div>`).join('')}` : ''}

      <!-- ═══ STAGNATIONS ═══ -->
      ${stagnations.length > 0 ? `
        <div class="section-title">
          ⏸ Stagnation (${stagnations.length})
        </div>
        ${stagnations.map(a => `
          <div class="card mb-md"
               style="border-color:rgba(249,239,119,0.3)">
            <div class="flex justify-between items-center">
              <div style="display:flex;align-items:center;gap:8px">
                <span>${a.emoji}</span>
                <div style="font-size:.85rem;font-weight:600">
                  ${a.nom}
                </div>
              </div>
              <button onclick="ProgrammeAdaptatif
                        ._voirVariations('${a.ref}')"
                      style="padding:4px 10px;
                             background:rgba(249,239,119,0.1);
                             border:1px solid rgba(249,239,119,0.3);
                             border-radius:var(--radius-full);
                             color:var(--fd-lemon);
                             font-size:.68rem;font-weight:600;
                             cursor:pointer">
                Variations →
              </button>
            </div>
          </div>`).join('')}` : ''}

      <!-- ═══ CONFIG ═══ -->
      <div class="card mt-md">
        <div class="card-label mb-md">⚙️ Paramètres adaptatifs</div>
        ${[
          { cle:'augmentationAuto',    label:'Augmentation auto des charges' },
          { cle:'detectionStagnation', label:'Détection stagnation'          },
          { cle:'variationsAuto',      label:'Suggestions de variations'     },
          { cle:'surmenageProtection', label:'Protection surmenage'          }
        ].map(p => `
          <div class="score-row">
            <span class="score-row-label"
                  style="font-size:.82rem">${p.label}</span>
            <label style="position:relative;display:inline-block;
                          width:44px;height:24px">
              <input type="checkbox"
                     ${config[p.cle] ? 'checked':''}
                     onchange="ProgrammeAdaptatif
                       ._toggleConfig('${p.cle}', this.checked)"
                     style="opacity:0;width:0;height:0" />
              <span class="toggle-slider"></span>
            </label>
          </div>`).join('')}
      </div>

      <div id="variations-panel"></div>
    `;
  },

  _voirVariations(ref) {
    const panel    = document.getElementById('variations-panel');
    if (!panel) return;

    const variations = this.getVariations(ref);
    const exo        = window.EXERCICES?.[ref];

    if (!variations.length) {
      Utils.toast('Pas de variation disponible', 'info');
      return;
    }

    panel.innerHTML = `
      <div class="card mt-md"
           style="border-color:var(--fd-lemon)">
        <div class="card-label mb-md">
          🔄 Variations pour ${exo?.nom||ref}
        </div>
        ${variations.map(v => `
          <div style="display:flex;align-items:center;gap:12px;
                      padding:var(--space-sm) 0;
                      border-bottom:1px solid var(--border-color)">
            <span style="font-size:1.3rem">${v.emoji}</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:.88rem">
                ${v.nom}
              </div>
            </div>
            <button onclick="naviguer('live')"
                    style="padding:4px 10px;
                           background:var(--fd-indigo);
                           color:white;border:none;
                           border-radius:var(--radius-full);
                           font-size:.68rem;font-weight:600;
                           cursor:pointer">
              Essayer
            </button>
          </div>`).join('')}
        <button onclick="document.getElementById(
                  'variations-panel').innerHTML=''"
                class="btn-secondary mt-md"
                style="width:100%;font-size:.78rem">
          Fermer
        </button>
      </div>
    `;

    panel.scrollIntoView({ behavior:'smooth' });
  },

  _toggleConfig(cle, val) {
    this.getConfig();
    const config = Utils.storage.get(this.CLE, {});
    config[cle]  = val;
    Utils.storage.set(this.CLE, config);
    Utils.toast(
      `${val ? '✅' : '❌'} ${cle} ${val ? 'activé' : 'désactivé'}`,
      'success', 1500
    );
  }
};

window.ProgrammeAdaptatif = ProgrammeAdaptatif;

// ════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE
// ════════════════════════════════════════════════════════════
window.EXERCICES               = EXERCICES;
window.SEANCES_BASE            = SEANCES_BASE;
window.PLANNING_SEMAINE        = PLANNING_SEMAINE;
window.PLANNING_SEMAINE_DEFAUT = PLANNING_SEMAINE_DEFAUT;
window.WARMUP                  = WARMUP;
window.ETIREMENTS              = ETIREMENTS;
window.SUPERSETS_RECOMMANDES   = SUPERSETS_RECOMMANDES;
window.Programme               = Programme;

console.log(
  `✅ Programme v3.0 chargé — ` +
  `${Object.keys(EXERCICES).length} exercices, ` +
  `${Object.keys(SEANCES_BASE).length} séances de base`
);
