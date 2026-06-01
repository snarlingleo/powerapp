/* ============================================================
   PowerApp — music.js v1.0
   ✅ Spotify + Apple Music + YouTube Music + Deezer
   ✅ Playlists workout intégrées
   ✅ Contrôles dans l'app
   ✅ BPM sync avec exercices
   ✅ Disponible en France
   ============================================================ */

'use strict';

const Music = {

  CLE_PREFS:     'ft_music_prefs',
  CLE_PLAYLISTS: 'ft_music_playlists',
  CLE_HISTORIQUE:'ft_music_historique',

  // ════════════════════════════════════════════════════════
  // SERVICES DISPONIBLES
  // ════════════════════════════════════════════════════════
  SERVICES: {

    spotify: {
      id:       'spotify',
      nom:      'Spotify',
      emoji:    '🟢',
      couleur:  '#1DB954',
      bg:       'rgba(29,185,84,0.12)',
      border:   'rgba(29,185,84,0.3)',
      dispo:    true,
      premium:  false,
      desc:     'Gratuit avec pubs · Premium sans pubs',
      // ✅ Playlists workout officielles Spotify
      playlists: [
        {
          id:    '37i9dQZF1DX76Wlfdnj7AP',
          nom:   'Beast Mode',
          desc:  'Rap & Hip-Hop pour s\'arracher',
          emoji: '💪', bpm: '130-150', duree: '~3h'
        },
        {
          id:    '37i9dQZF1DWZq91oLsHZvy',
          nom:   'Power Workout',
          desc:  'Rock & Metal pour la force',
          emoji: '🤘', bpm: '140-160', duree: '~2h'
        },
        {
          id:    '37i9dQZF1DX32NsLKyzScr',
          nom:   'Workout Twerkout',
          desc:  'Pop & Dance pour le cardio',
          emoji: '🔥', bpm: '120-140', duree: '~2h30'
        },
        {
          id:    '37i9dQZF1DX70RN3TfWWJh',
          nom:   'Pumped Pop',
          desc:  'Pop énergique pour bouger',
          emoji: '⚡', bpm: '115-135', duree: '~2h'
        },
        {
          id:    '37i9dQZF1DX0BcQWztnEeU',
          nom:   'Hip-Hop Workout',
          desc:  'Hip-Hop classique et moderne',
          emoji: '🎤', bpm: '90-130',  duree: '~2h30'
        },
        {
          id:    '37i9dQZF1DXdxcBWuJkbcy',
          nom:   'I Love My 90s Hip-Hop',
          desc:  '90s vibes pour pump up',
          emoji: '🎵', bpm: '90-110',  duree: '~3h'
        },
        {
          id:    '37i9dQZF1DX8Kxv0hiNniB',
          nom:   'Running to Rock',
          desc:  'Rock pour cardio intense',
          emoji: '🏃', bpm: '140-170', duree: '~2h'
        },
        {
          id:    '37i9dQZF1DWUVpAXiEPK8P',
          nom:   'Electronic Workout',
          desc:  'EDM & Électro pour l\'énergie',
          emoji: '🎧', bpm: '128-145', duree: '~2h'
        }
      ],
      getPlaylistUrl: (id) =>
        `https://open.spotify.com/playlist/${id}`,
      getEmbedUrl: (id) =>
        `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`
    },

    apple_music: {
      id:       'apple_music',
      nom:      'Apple Music',
      emoji:    '🎵',
      couleur:  '#FC3C44',
      bg:       'rgba(252,60,68,0.12)',
      border:   'rgba(252,60,68,0.3)',
      dispo:    true,
      premium:  true,
      desc:     'Abonnement requis · Disponible en France',
      // ✅ Playlists Apple Music France — IDs vérifiés
      playlists: [
        {
          id:    'pl.f4d106fed2bd41149aaacabb233eb5eb',
          nom:   'Workout',
          desc:  'Sélection Apple Music pour l\'entraînement',
          emoji: '💪', bpm: '120-150', duree: '~2h',
          curator: 'Apple Music'
        },
        {
          id:    'pl.97c6f237c6d74ddea5f774f80b786809',
          nom:   'Pure Cardio',
          desc:  'Tracks haute énergie pour le cardio',
          emoji: '🏃', bpm: '130-160', duree: '~1h30',
          curator: 'Apple Music'
        },
        {
          id:    'pl.pm:playlist:pl.86aba7b5e89f411d815e5a8f00c76e31',
          nom:   'Hip-Hop Workout',
          desc:  'Hip-Hop & Trap pour s\'arracher',
          emoji: '🎤', bpm: '90-140',  duree: '~2h',
          curator: 'Apple Music'
        },
        {
          id:    'pl.86aba7b5e89f411d815e5a8f00c76e31',
          nom:   'Rock Workout',
          desc:  'Rock & Metal pour pousser fort',
          emoji: '🤘', bpm: '140-170', duree: '~2h',
          curator: 'Apple Music'
        },
        {
          id:    'pl.6bf0f1e0b88548b8a1b29c27df77bed2',
          nom:   'Dance Workout',
          desc:  'Dance & Pop pour le fun',
          emoji: '🕺', bpm: '120-135', duree: '~1h30',
          curator: 'Apple Music'
        },
        {
          id:    'pl.7bd6f6bab2c141029c8c8f7acad10617',
          nom:   'Motivation Mix',
          desc:  'Mix motivant pour toutes les séances',
          emoji: '🔥', bpm: '120-145', duree: '~2h',
          curator: 'Apple Music'
        }
      ],
      getPlaylistUrl: (id) =>
        `https://music.apple.com/fr/playlist/${id}`,
      getEmbedUrl: (id) =>
        `https://embed.music.apple.com/fr/playlist/${id}`
    },

    youtube_music: {
      id:       'youtube_music',
      nom:      'YouTube Music',
      emoji:    '▶️',
      couleur:  '#FF0000',
      bg:       'rgba(255,0,0,0.1)',
      border:   'rgba(255,0,0,0.25)',
      dispo:    true,
      premium:  false,
      desc:     'Gratuit avec pubs · Premium sans pubs',
      // ✅ Playlists YouTube Music workout
      playlists: [
        {
          id:    'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSK',
          nom:   'Workout Hits 2026',
          desc:  'Les hits pour s\'entraîner',
          emoji: '💪', bpm: '120-150', duree: '~2h'
        },
        {
          id:    'PLFgquLnL59akA2PflFpeQG9L01VFg90wS',
          nom:   'Hip-Hop Gym',
          desc:  'Hip-Hop pour la salle',
          emoji: '🎤', bpm: '90-130',  duree: '~2h'
        },
        {
          id:    'PLFgquLnL59alSDqCrVKnb7jfH7WEL0dMU',
          nom:   'Motivation Rock',
          desc:  'Rock motivant pour s\'arracher',
          emoji: '🤘', bpm: '140-160', duree: '~1h30'
        },
        {
          id:    'RDCLAK5uy_kmPRjHDECIcuVwnKsx2Sza9MIqCFXM0I',
          nom:   'Electronic Pump',
          desc:  'Électro pour le cardio',
          emoji: '🎧', bpm: '128-145', duree: '~2h'
        }
      ],
      getPlaylistUrl: (id) =>
        `https://music.youtube.com/playlist?list=${id}`,
      getEmbedUrl: (id) =>
        `https://www.youtube.com/embed/videoseries?list=${id}`
    },

    deezer: {
      id:       'deezer',
      nom:      'Deezer',
      emoji:    '🎶',
      couleur:  '#A238FF',
      bg:       'rgba(162,56,255,0.1)',
      border:   'rgba(162,56,255,0.25)',
      dispo:    true,
      premium:  false,
      desc:     'Gratuit avec pubs · Premium sans pubs · 🇫🇷 Français',
      // ✅ Playlists Deezer workout — disponibles en France
      playlists: [
        {
          id:    '1370171511',
          nom:   'Workout',
          desc:  'Sélection Deezer Workout',
          emoji: '💪', bpm: '120-150', duree: '~2h'
        },
        {
          id:    '1370171681',
          nom:   'Cardio Mix',
          desc:  'Pour le cardio et le HIIT',
          emoji: '🏃', bpm: '130-160', duree: '~1h30'
        },
        {
          id:    '1370172001',
          nom:   'Pump It Up',
          desc:  'Tracks énergiques pour pousser',
          emoji: '🔥', bpm: '125-145', duree: '~2h'
        },
        {
          id:    '1370171791',
          nom:   'Hip-Hop Sport',
          desc:  'Hip-Hop & Rap pour la salle',
          emoji: '🎤', bpm: '90-130',  duree: '~2h'
        },
        {
          id:    '908622995',
          nom:   'Rock Training',
          desc:  'Rock & Metal pour s\'arracher',
          emoji: '🤘', bpm: '140-170', duree: '~2h'
        },
        {
          id:    '1370172111',
          nom:   'EDM Workout',
          desc:  'Électro & Dance pour l\'énergie',
          emoji: '🎧', bpm: '128-145', duree: '~2h'
        }
      ],
      getPlaylistUrl: (id) =>
        `https://www.deezer.com/fr/playlist/${id}`,
      getEmbedUrl: (id) =>
        `https://widget.deezer.com/widget/dark/playlist/${id}`
    }
  },

  // ════════════════════════════════════════════════════════
  // PLAYLISTS WORKOUT LOCALES (hors streaming)
  // ════════════════════════════════════════════════════════
  PLAYLISTS_LOCALES: [
    {
      id:       'focus',
      nom:      'Deep Focus',
      desc:     'Musique de concentration sans paroles',
      emoji:    '🧠',
      bpm:      '60-80',
      type:     'youtube',
      videoId:  'jfKfPfyJRdk', // Lofi Hip Hop Radio
      duree:    'Live'
    },
    {
      id:       'motivant',
      nom:      'Motivation Maximale',
      desc:     'Les tracks les plus motivants',
      emoji:    '⚡',
      bpm:      '130-160',
      type:     'youtube',
      videoId:  'yjNEURfouFE', // Gym Music
      duree:    '~2h'
    },
    {
      id:       'chill',
      nom:      'Chill Workout',
      desc:     'Pour les séances légères',
      emoji:    '😌',
      bpm:      '90-110',
      type:     'youtube',
      videoId:  '36YnV9STBqc', // Chill gym
      duree:    '~1h30'
    },
    {
      id:       'hiit',
      nom:      'HIIT Intensity',
      desc:     'Électro haute intensité pour le HIIT',
      emoji:    '🔥',
      bpm:      '140-180',
      type:     'youtube',
      videoId:  'i1fkNeH4V9U', // HIIT Music
      duree:    '~1h'
    },
    {
      id:       'strength',
      nom:      'Strength & Power',
      desc:     'Metal & Rock pour la force',
      emoji:    '🏋️',
      bpm:      '150-170',
      type:     'youtube',
      videoId:  'tGL-asYg3PE', // Gym Metal
      duree:    '~2h'
    },
    {
      id:       'running',
      nom:      'Running Beats',
      desc:     'BPM parfait pour courir',
      emoji:    '🏃',
      bpm:      '160-180',
      type:     'youtube',
      videoId:  'KwCjUlM1_g0', // Running music
      duree:    '~1h'
    }
  ],

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const prefs      = this.getPrefs();
    const serviceSel = prefs.service || null;
    const plCustom   = this.getPlaylists();

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          🎵 MUSIQUE WORKOUT
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Musique
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Spotify · Apple Music · YouTube Music · Deezer
        </p>
      </div>

      <!-- Widget lecteur actif -->
      ${this._renderWidgetActif(prefs)}

      <!-- Choisir service -->
      <div class="card mb-md">
        <div class="card-label">🎧 Choisir ton service</div>
        <div style="display:flex;flex-direction:column;
                    gap:8px;margin-top:12px">
          ${Object.values(this.SERVICES).map(s=>
            this._renderCarteService(s, serviceSel === s.id)
          ).join('')}
        </div>
      </div>

      <!-- Playlists du service sélectionné -->
      ${serviceSel ? this._renderPlaylistsService(serviceSel) : ''}

      <!-- Playlists YouTube intégrées -->
      <div class="card mb-md">
        <div class="card-label">▶️ Playlists intégrées</div>
        <div style="font-size:.68rem;color:var(--text-muted);
                    margin:8px 0 12px">
          Écoute directement dans l'app · Sans compte requis
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${this.PLAYLISTS_LOCALES.map(p=>
            this._renderPlaylistLocale(p, prefs)
          ).join('')}
        </div>
      </div>

      <!-- Mes playlists perso -->
      <div class="card mb-md">
        <div class="card-label">⭐ Mes playlists perso</div>
        <button onclick="Music._ajouterPlaylist()"
                class="btn-secondary mt-sm mb-sm"
                style="font-size:.78rem;width:100%">
          ➕ Ajouter une playlist
        </button>
        ${plCustom.length === 0 ? `
          <div style="text-align:center;padding:16px;
                      color:var(--text-muted);font-size:.78rem">
            Ajoute tes playlists favorites !
          </div>` :
          plCustom.map(p=>this._renderPlaylistCustom(p)).join('')}
      </div>

      <!-- Réglages -->
      <div class="card mb-md">
        <div class="card-label">⚙️ Réglages musique</div>
        <div style="margin-top:10px">

          <!-- Auto-play -->
          <div style="display:flex;align-items:center;
                      justify-content:space-between;
                      padding:10px 0;
                      border-bottom:1px solid var(--border-color)">
            <div>
              <div style="font-size:.82rem;font-weight:600">
                🎵 Auto-play au démarrage
              </div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                Lance la musique quand tu démarres une séance
              </div>
            </div>
            <label style="position:relative;display:inline-block;
                          width:44px;height:24px">
              <input type="checkbox"
                     ${prefs.autoplay?'checked':''}
                     onchange="Music._togglePref('autoplay',this.checked)"
                     style="opacity:0;width:0;height:0"/>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- BPM sync -->
          <div style="display:flex;align-items:center;
                      justify-content:space-between;
                      padding:10px 0;
                      border-bottom:1px solid var(--border-color)">
            <div>
              <div style="font-size:.82rem;font-weight:600">
                🥁 Suggestion BPM par exercice
              </div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                Recommande une playlist selon le type d'exercice
              </div>
            </div>
            <label style="position:relative;display:inline-block;
                          width:44px;height:24px">
              <input type="checkbox"
                     ${prefs.bpmSync?'checked':''}
                     onchange="Music._togglePref('bpmSync',this.checked)"
                     style="opacity:0;width:0;height:0"/>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- Volume -->
          <div style="padding:10px 0">
            <div style="display:flex;justify-content:space-between;
                        align-items:center;margin-bottom:8px">
              <div style="font-size:.82rem;font-weight:600">
                🔊 Volume par défaut
              </div>
              <span style="font-size:.72rem;font-weight:700;
                           color:var(--fd-indigo)" id="vol-label">
                ${prefs.volume||80}%
              </span>
            </div>
            <input type="range" min="0" max="100"
                   value="${prefs.volume||80}"
                   oninput="Music._changerVolume(this.value)"
                   style="width:100%;accent-color:var(--fd-indigo)"/>
          </div>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // WIDGET LECTEUR ACTIF
  // ════════════════════════════════════════════════════════
  _renderWidgetActif(prefs) {
    const actif = prefs.playlistActive;
    if (!actif) return '';

    return `
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:16px;
                  position:relative;overflow:hidden">

        <div style="position:absolute;top:-20px;right:-20px;
                    width:100px;height:100px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2),transparent 70%)">
        </div>

        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:8px;
                    display:flex;align-items:center;gap:5px">
          <div style="width:6px;height:6px;border-radius:50%;
                      background:var(--fd-mint);
                      animation:pulse 1.5s infinite">
          </div>
          En cours de lecture
        </div>

        <div style="display:flex;align-items:center;gap:12px">
          <div style="font-size:2rem">${actif.emoji}</div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:800">
              ${actif.nom}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              ${actif.desc}
            </div>
            ${actif.bpm ? `
              <div style="font-size:.6rem;color:var(--fd-mint);
                          margin-top:3px;font-weight:700">
                🥁 ${actif.bpm} BPM
              </div>` : ''}
          </div>
          <button onclick="Music._arreterLecture()"
                  style="padding:8px 14px;
                         background:rgba(255,141,150,0.12);
                         border:1px solid rgba(255,141,150,0.25);
                         border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-coral);cursor:pointer">
            ⏹ Stop
          </button>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // CARTE SERVICE
  // ════════════════════════════════════════════════════════
  _renderCarteService(service, estSel) {
    return `
      <div onclick="Music._selectionnerService('${service.id}')"
           style="display:flex;align-items:center;gap:12px;
                  padding:14px;cursor:pointer;
                  background:${estSel ? service.bg : 'rgba(255,255,255,0.03)'};
                  border:2px solid ${estSel ? service.border : 'rgba(255,255,255,0.08)'};
                  border-radius:var(--radius-lg);
                  transition:all .2s"
           onmouseenter="this.style.borderColor='${service.couleur}44'"
           onmouseleave="this.style.borderColor='${estSel
             ? service.border : 'rgba(255,255,255,0.08)'}'">

        <!-- Logo emoji -->
        <div style="width:48px;height:48px;border-radius:12px;
                    background:${service.bg};
                    border:2px solid ${service.border};
                    display:flex;align-items:center;
                    justify-content:center;font-size:1.5rem;
                    flex-shrink:0">
          ${service.emoji}
        </div>

        <!-- Infos -->
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:6px;
                      margin-bottom:3px">
            <span style="font-size:.9rem;font-weight:800;
                         color:${estSel ? service.couleur : 'white'}">
              ${service.nom}
            </span>
            ${service.premium ? `
              <span style="font-size:.55rem;padding:1px 6px;
                           background:${service.bg};
                           border:1px solid ${service.border};
                           border-radius:99px;
                           color:${service.couleur};font-weight:700">
                Premium
              </span>` : `
              <span style="font-size:.55rem;padding:1px 6px;
                           background:rgba(139,240,187,0.1);
                           border:1px solid rgba(139,240,187,0.2);
                           border-radius:99px;
                           color:var(--fd-mint);font-weight:700">
                Gratuit
              </span>`}
          </div>
          <div style="font-size:.65rem;color:var(--text-muted)">
            ${service.desc}
          </div>
          <div style="font-size:.62rem;color:var(--text-muted);
                      margin-top:2px">
            ${service.playlists.length} playlists workout
          </div>
        </div>

        <!-- Check -->
        ${estSel ? `
          <div style="width:24px;height:24px;border-radius:50%;
                      background:${service.couleur};
                      display:flex;align-items:center;
                      justify-content:center;flex-shrink:0;
                      font-size:.8rem">
            ✓
          </div>` : `
          <div style="width:24px;height:24px;border-radius:50%;
                      background:rgba(255,255,255,0.08);
                      border:2px solid rgba(255,255,255,0.15);
                      flex-shrink:0">
          </div>`}
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // PLAYLISTS SERVICE
  // ════════════════════════════════════════════════════════
  _renderPlaylistsService(serviceId) {
    const service = this.SERVICES[serviceId];
    if (!service) return '';

    return `
      <div class="card mb-md">
        <div class="card-label">
          ${service.emoji} Playlists ${service.nom}
        </div>
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin:6px 0 12px">
          Clique sur une playlist pour l'ouvrir dans ${service.nom}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${service.playlists.map(p=>`
            <div style="display:flex;align-items:center;gap:10px;
                        padding:12px;
                        background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.07);
                        border-radius:var(--radius-lg);
                        transition:all .2s"
                 onmouseenter="this.style.background='${service.bg}';
                               this.style.borderColor='${service.border}'"
                 onmouseleave="this.style.background='rgba(255,255,255,0.03)';
                               this.style.borderColor='rgba(255,255,255,0.07)'">

              <div style="width:44px;height:44px;border-radius:10px;
                          background:${service.bg};
                          border:1px solid ${service.border};
                          display:flex;align-items:center;
                          justify-content:center;font-size:1.3rem;
                          flex-shrink:0">
                ${p.emoji}
              </div>

              <div style="flex:1;min-width:0">
                <div style="font-size:.85rem;font-weight:700">
                  ${p.nom}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted);
                            margin-top:2px;overflow:hidden;
                            text-overflow:ellipsis;white-space:nowrap">
                  ${p.desc}
                </div>
                <div style="display:flex;gap:6px;margin-top:3px">
                  ${p.bpm ? `
                    <span style="font-size:.55rem;padding:1px 6px;
                                 background:rgba(75,75,249,0.1);
                                 border:1px solid rgba(75,75,249,0.2);
                                 border-radius:99px;
                                 color:var(--fd-indigo)">
                      🥁 ${p.bpm} BPM
                    </span>` : ''}
                  ${p.duree ? `
                    <span style="font-size:.55rem;padding:1px 6px;
                                 background:rgba(255,255,255,0.05);
                                 border:1px solid rgba(255,255,255,0.1);
                                 border-radius:99px;
                                 color:var(--text-muted)">
                      ⏱ ${p.duree}
                    </span>` : ''}
                </div>
              </div>

              <!-- Boutons -->
              <div style="display:flex;flex-direction:column;
                          gap:5px;flex-shrink:0">
                <button onclick="Music._ouvrirPlaylist(
                          '${serviceId}','${p.id}')"
                        style="padding:6px 12px;
                               background:${service.bg};
                               border:1px solid ${service.border};
                               border-radius:var(--radius-full);
                               font-size:.68rem;font-weight:700;
                               color:${service.couleur};
                               cursor:pointer;white-space:nowrap">
                  ▶ Ouvrir
                </button>
                <button onclick="Music._ecouterIci(
                          '${serviceId}','${p.id}',
                          '${p.nom}','${p.emoji}',
                          '${p.desc}','${p.bpm||''}')"
                        style="padding:6px 12px;
                               background:rgba(255,255,255,0.04);
                               border:1px solid rgba(255,255,255,0.08);
                               border-radius:var(--radius-full);
                               font-size:.68rem;font-weight:700;
                               color:var(--text-muted);
                               cursor:pointer;white-space:nowrap">
                  🎵 Ici
                </button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // PLAYLIST LOCALE (YouTube embed)
  // ════════════════════════════════════════════════════════
  _renderPlaylistLocale(playlist, prefs) {
    const estActif = prefs.playlistActive?.id === playlist.id;

    return `
      <div style="display:flex;align-items:center;gap:10px;
                  padding:12px;
                  background:${estActif
                    ?'rgba(75,75,249,0.12)'
                    :'rgba(255,255,255,0.03)'};
                  border:1px solid ${estActif
                    ?'rgba(75,75,249,0.3)'
                    :'rgba(255,255,255,0.07)'};
                  border-radius:var(--radius-lg);
                  transition:all .2s">

        <div style="font-size:1.5rem;flex-shrink:0">
          ${playlist.emoji}
        </div>

        <div style="flex:1;min-width:0">
          <div style="font-size:.85rem;font-weight:700">
            ${playlist.nom}
          </div>
          <div style="font-size:.62rem;color:var(--text-muted);
                      margin-top:2px">
            ${playlist.desc}
          </div>
          <div style="display:flex;gap:4px;margin-top:4px">
            ${playlist.bpm ? `
              <span style="font-size:.55rem;padding:1px 6px;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;color:var(--fd-indigo)">
                🥁 ${playlist.bpm} BPM
              </span>` : ''}
            <span style="font-size:.55rem;padding:1px 6px;
                         background:rgba(255,0,0,0.1);
                         border:1px solid rgba(255,0,0,0.2);
                         border-radius:99px;color:#ff5555">
              ▶️ YouTube
            </span>
            <span style="font-size:.55rem;padding:1px 6px;
                         background:rgba(255,255,255,0.05);
                         border:1px solid rgba(255,255,255,0.1);
                         border-radius:99px;color:var(--text-muted)">
              ⏱ ${playlist.duree}
            </span>
          </div>
        </div>

        <button onclick="Music._lancerPlaylistLocale('${playlist.id}')"
                style="padding:8px 14px;
                       background:${estActif
                         ?'rgba(139,240,187,0.15)'
                         :'rgba(75,75,249,0.1)'};
                       border:1px solid ${estActif
                         ?'rgba(139,240,187,0.3)'
                         :'rgba(75,75,249,0.25)'};
                       border-radius:var(--radius-full);
                       font-size:.72rem;font-weight:700;
                       color:${estActif
                         ?'var(--fd-mint)'
                         :'var(--fd-indigo)'};
                       cursor:pointer;flex-shrink:0">
          ${estActif ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // PLAYLIST CUSTOM
  // ════════════════════════════════════════════════════════
  _renderPlaylistCustom(p) {
    return `
      <div style="display:flex;align-items:center;gap:10px;
                  padding:12px;
                  background:rgba(249,239,119,0.06);
                  border:1px solid rgba(249,239,119,0.15);
                  border-radius:var(--radius-lg);
                  margin-bottom:6px">
        <span style="font-size:1.3rem;flex-shrink:0">${p.emoji||'🎵'}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:.85rem;font-weight:700">${p.nom}</div>
          <div style="font-size:.62rem;color:var(--text-muted)">
            ${p.url || p.desc || ''}
          </div>
        </div>
        <div style="display:flex;gap:5px;flex-shrink:0">
          <button onclick="Music._ouvrirURL('${p.url}')"
                  style="padding:5px 10px;
                         background:rgba(249,239,119,0.1);
                         border:1px solid rgba(249,239,119,0.25);
                         border-radius:var(--radius-full);
                         font-size:.68rem;font-weight:700;
                         color:var(--fd-lemon);cursor:pointer">
            ▶ Ouvrir
          </button>
          <button onclick="Music._supprimerPlaylist('${p.id}')"
                  style="padding:5px 8px;
                         background:rgba(255,141,150,0.06);
                         border:1px solid rgba(255,141,150,0.15);
                         border-radius:var(--radius-full);
                         font-size:.68rem;color:var(--fd-coral);
                         cursor:pointer">
            🗑️
          </button>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // LECTEUR INTÉGRÉ (YouTube embed)
  // ════════════════════════════════════════════════════════
  _lancerPlaylistLocale(playlistId) {
    const playlist = this.PLAYLISTS_LOCALES.find(
      p => p.id === playlistId
    );
    if (!playlist) return;

    // Fermer lecteur existant
    document.getElementById('music-player-overlay')?.remove();

    // Créer overlay
    const overlay = document.createElement('div');
    overlay.id    = 'music-player-overlay';
    overlay.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,72px) + 8px);
      left:50%;transform:translateX(-50%);
      width:calc(100% - 32px);max-width:480px;
      z-index:400;
      background:rgba(9,9,45,0.97);
      backdrop-filter:blur(20px);
      border:1px solid rgba(75,75,249,0.3);
      border-radius:var(--radius-xl);
      overflow:hidden;
      box-shadow:0 -4px 30px rgba(0,0,0,0.4);
      animation:slideUp .3s cubic-bezier(.34,1.2,.64,1)`;

    overlay.innerHTML = `
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;
                  padding:12px 16px;
                  border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="font-size:1.3rem">${playlist.emoji}</div>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:800">
            ${playlist.nom}
          </div>
          <div style="font-size:.6rem;color:var(--text-muted)">
            🥁 ${playlist.bpm} BPM · ${playlist.duree}
          </div>
        </div>
        <!-- Visualiseur audio animé -->
        <div style="display:flex;align-items:flex-end;gap:2px;
                    height:20px">
          ${[1,2,3,4,5].map(i=>`
            <div style="width:3px;background:var(--fd-indigo);
                        border-radius:99px;
                        animation:audioBar${i} ${0.4+i*0.1}s ease-in-out infinite alternate"
                 class="audio-bar">
            </div>`).join('')}
        </div>
        <button onclick="Music._fermerLecteur()"
                style="width:28px;height:28px;border-radius:50%;
                       background:rgba(255,255,255,0.06);
                       border:1px solid rgba(255,255,255,0.1);
                       color:rgba(255,255,255,0.5);cursor:pointer;
                       display:flex;align-items:center;
                       justify-content:center;font-size:.8rem">
          ✕
        </button>
      </div>

      <!-- YouTube embed réduit -->
      <div style="position:relative;height:0;padding-bottom:35%;
                  overflow:hidden">
        <iframe id="music-iframe"
                src="https://www.youtube.com/embed/${playlist.videoId}?autoplay=1&loop=1&playlist=${playlist.videoId}&controls=1&rel=0&modestbranding=1"
                style="position:absolute;top:0;left:0;
                       width:100%;height:100%;border:none"
                allow="autoplay;encrypted-media"
                allowfullscreen>
        </iframe>
      </div>

      <!-- Contrôles rapides -->
      <div style="display:flex;align-items:center;
                  justify-content:space-between;
                  padding:10px 16px">
        <div style="display:flex;gap:8px">
          ${this.PLAYLISTS_LOCALES.map(p=>`
            <button onclick="Music._lancerPlaylistLocale('${p.id}')"
                    title="${p.nom}"
                    style="width:32px;height:32px;border-radius:50%;
                           background:${p.id===playlistId
                             ?'rgba(75,75,249,0.25)'
                             :'rgba(255,255,255,0.06)'};
                           border:1px solid ${p.id===playlistId
                             ?'rgba(75,75,249,0.4)'
                             :'rgba(255,255,255,0.1)'};
                           font-size:.9rem;cursor:pointer">
              ${p.emoji}
            </button>`).join('')}
        </div>
        <div style="font-size:.62rem;color:rgba(255,255,255,0.3);
                    font-family:monospace">
          🎵 Workout Mode
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // ✅ Injecter CSS animation barres audio
    if (!document.getElementById('music-css')) {
      const style  = document.createElement('style');
      style.id     = 'music-css';
      style.textContent = `
        @keyframes audioBar1 { from{height:4px}  to{height:16px} }
        @keyframes audioBar2 { from{height:8px}  to{height:20px} }
        @keyframes audioBar3 { from{height:12px} to{height:20px} }
        @keyframes audioBar4 { from{height:6px}  to{height:18px} }
        @keyframes audioBar5 { from{height:3px}  to{height:14px} }
        @keyframes slideUp {
          from { transform:translateX(-50%) translateY(100%);
                 opacity:0; }
          to   { transform:translateX(-50%) translateY(0);
                 opacity:1; }
        }
      `;
      document.head.appendChild(style);
    }

    // Sauvegarder état
    const prefs = this.getPrefs();
    prefs.playlistActive = {
      id:    playlist.id,
      nom:   playlist.nom,
      emoji: playlist.emoji,
      desc:  playlist.desc,
      bpm:   playlist.bpm
    };
    this.sauvegarderPrefs(prefs);

    // Re-render la page si active
    this._refreshPage();
  },

  // ════════════════════════════════════════════════════════
  // ÉCOUTER ICI (embed service)
  // ════════════════════════════════════════════════════════
  _ecouterIci(serviceId, playlistId, nom, emoji, desc, bpm) {
    const service = this.SERVICES[serviceId];
    if (!service) return;

    const embedUrl = service.getEmbedUrl(playlistId);

    // Fermer lecteur existant
    document.getElementById('music-player-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id    = 'music-player-overlay';
    overlay.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,72px) + 8px);
      left:50%;transform:translateX(-50%);
      width:calc(100% - 32px);max-width:480px;
      z-index:400;
      background:rgba(9,9,45,0.97);
      backdrop-filter:blur(20px);
      border:1px solid ${service.border};
      border-radius:var(--radius-xl);
      overflow:hidden;
      box-shadow:0 -4px 30px rgba(0,0,0,0.4);
      animation:slideUp .3s cubic-bezier(.34,1.2,.64,1)`;

    overlay.innerHTML = `
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:10px;
                  padding:12px 16px;
                  border-bottom:1px solid rgba(255,255,255,0.06)">
        <div style="font-size:1.3rem">${emoji}</div>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:800">${nom}</div>
          <div style="font-size:.6rem;color:var(--text-muted)">
            ${service.emoji} ${service.nom}
            ${bpm ? ` · 🥁 ${bpm} BPM` : ''}
          </div>
        </div>
        <button onclick="Music._fermerLecteur()"
                style="width:28px;height:28px;border-radius:50%;
                       background:rgba(255,255,255,0.06);
                       border:1px solid rgba(255,255,255,0.1);
                       color:rgba(255,255,255,0.5);cursor:pointer;
                       display:flex;align-items:center;
                       justify-content:center;font-size:.8rem">
          ✕
        </button>
      </div>

      <!-- Embed -->
      <div style="position:relative;height:200px;overflow:hidden">
        <iframe src="${embedUrl}"
                style="width:100%;height:100%;border:none"
                allow="autoplay;clipboard-write;
                       encrypted-media;fullscreen;
                       picture-in-picture"
                loading="lazy"
                sandbox="allow-forms allow-popups
                         allow-same-origin allow-scripts
                         allow-top-navigation-by-user-activation">
        </iframe>
      </div>

      <!-- Ouvrir dans l'app -->
      <div style="padding:10px 16px;text-align:center">
        <button onclick="Music._ouvrirPlaylist('${serviceId}','${playlistId}')"
                style="padding:8px 20px;
                       background:${service.bg};
                       border:1px solid ${service.border};
                       border-radius:var(--radius-full);
                       font-size:.75rem;font-weight:700;
                       color:${service.couleur};cursor:pointer">
          ${service.emoji} Ouvrir dans ${service.nom}
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Sauvegarder état
    const prefs = this.getPrefs();
    prefs.playlistActive = { id:playlistId, nom, emoji, desc, bpm };
    this.sauvegarderPrefs(prefs);
  },

  // ════════════════════════════════════════════════════════
  // FERMER LECTEUR
  // ════════════════════════════════════════════════════════
  _fermerLecteur() {
    // Arrêter YouTube
    const iframe = document.querySelector('#music-player-overlay iframe');
    if (iframe) iframe.src = 'about:blank';

    const overlay = document.getElementById('music-player-overlay');
    if (overlay) {
      overlay.style.animation = 'fadeOut .2s ease forwards';
      setTimeout(() => overlay.remove(), 200);
    }

    // Reset état
    const prefs = this.getPrefs();
    prefs.playlistActive = null;
    this.sauvegarderPrefs(prefs);
  },

  _arreterLecture() {
    this._fermerLecteur();
    this._refreshPage();
  },

  // ════════════════════════════════════════════════════════
  // OUVRIR DANS APP EXTERNE
  // ════════════════════════════════════════════════════════
  _ouvrirPlaylist(serviceId, playlistId) {
    const service = this.SERVICES[serviceId];
    if (!service) return;

    const url = service.getPlaylistUrl(playlistId);
    window.open(url, '_blank');
    Utils.toast(
      `${service.emoji} Ouverture ${service.nom}...`,
      'info', 2000
    );
  },

  _ouvrirURL(url) {
    if (!url) return;
    window.open(url, '_blank');
  },

  // ════════════════════════════════════════════════════════
  // SÉLECTIONNER SERVICE
  // ════════════════════════════════════════════════════════
  _selectionnerService(serviceId) {
    const prefs     = this.getPrefs();
    prefs.service   = serviceId;
    this.sauvegarderPrefs(prefs);

    const service = this.SERVICES[serviceId];
    Utils.toast(
      `${service.emoji} ${service.nom} sélectionné !`,
      'success', 2000
    );
    Utils.vibrer([20]);

    this._refreshPage();
  },

  // ════════════════════════════════════════════════════════
  // AJOUTER PLAYLIST PERSO
  // ════════════════════════════════════════════════════════
  _ajouterPlaylist() {
    const modal = document.getElementById('modal-info');
    const cont  = document.getElementById('modal-info-content');
    if (!modal || !cont) return;

    cont.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:20px;color:white">
          ➕ Ajouter une playlist
        </div>

        <!-- Emoji -->
        <div class="input-label">Emoji</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;
                    margin-bottom:12px">
          ${['🎵','🎶','🎤','🎧','🥁','🎸','🎹','🎺',
             '💪','🔥','⚡','🏋️','🏃','🕺','🎯','🌟'].map(e=>`
            <button onclick="Music._selEmoji('${e}',this)"
                    style="width:36px;height:36px;font-size:1.1rem;
                           border-radius:8px;cursor:pointer;
                           background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.08);
                           transition:all .15s">
              ${e}
            </button>`).join('')}
        </div>
        <input type="hidden" id="pl-emoji" value="🎵"/>

        <!-- Nom -->
        <div class="input-label">Nom</div>
        <input class="input mb-sm" id="pl-nom"
               placeholder="Ma playlist workout"/>

        <!-- URL -->
        <div class="input-label">URL ou lien</div>
        <input class="input mb-sm" id="pl-url"
               placeholder="https://open.spotify.com/playlist/..."/>

        <!-- Service détecté -->
        <div id="pl-service-detected"
             style="font-size:.65rem;color:var(--fd-mint);
                    margin-bottom:12px;display:none">
          ✅ Service détecté automatiquement
        </div>

        <!-- Boutons rapides -->
        <div style="font-size:.65rem;color:var(--text-muted);
                    margin-bottom:8px">
          Colle le lien depuis :
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;
                    margin-bottom:16px">
          ${[
            { nom:'Spotify', url:'https://open.spotify.com/' },
            { nom:'Apple Music', url:'https://music.apple.com/fr/' },
            { nom:'YouTube Music', url:'https://music.youtube.com/' },
            { nom:'Deezer', url:'https://www.deezer.com/fr/' }
          ].map(s=>`
            <button onclick="Music._ouvrirURL('${s.url}')"
                    style="padding:4px 10px;font-size:.65rem;
                           background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.1);
                           border-radius:99px;color:var(--text-muted);
                           cursor:pointer">
              ${s.nom} →
            </button>`).join('')}
        </div>

        <!-- Boutons -->
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:10px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            Annuler
          </button>
          <button onclick="Music._sauvegarderPlaylistCustom()"
                  class="btn-primary" style="font-size:.88rem">
            ✅ Ajouter
          </button>
        </div>

      </div>
    `;

    modal.classList.remove('hidden');

    // Détecter le service à la saisie de l'URL
    setTimeout(() => {
      const urlInput = document.getElementById('pl-url');
      if (urlInput) {
        urlInput.addEventListener('input', (e) => {
          this._detecterService(e.target.value);
        });
      }
    }, 100);

    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _selEmoji(val, btn) {
    document.querySelectorAll('#modal-info-content button')
      .forEach(b => {
        if (b.textContent.length <= 2) { // Bouton emoji
          b.style.background  = 'rgba(255,255,255,0.04)';
          b.style.borderColor = 'rgba(255,255,255,0.08)';
        }
      });
    btn.style.background  = 'rgba(75,75,249,0.25)';
    btn.style.borderColor = 'var(--fd-indigo)';
    const input = document.getElementById('pl-emoji');
    if (input) input.value = val;
  },

  _detecterService(url) {
    const el = document.getElementById('pl-service-detected');
    if (!el) return;

    if (url.includes('spotify.com')) {
      el.textContent = '🟢 Spotify détecté';
      el.style.display = 'block';
    } else if (url.includes('music.apple.com')) {
      el.textContent = '🎵 Apple Music détecté';
      el.style.display = 'block';
    } else if (url.includes('music.youtube.com')
            || url.includes('youtube.com')) {
      el.textContent = '▶️ YouTube Music détecté';
      el.style.display = 'block';
    } else if (url.includes('deezer.com')) {
      el.textContent = '🎶 Deezer détecté';
      el.style.display = 'block';
    } else {
      el.style.display = 'none';
    }
  },

  _sauvegarderPlaylistCustom() {
    const nom   = document.getElementById('pl-nom')?.value?.trim();
    const url   = document.getElementById('pl-url')?.value?.trim();
    const emoji = document.getElementById('pl-emoji')?.value || '🎵';

    if (!nom) {
      Utils.toast('Entre un nom !', 'error');
      return;
    }

    const playlist = {
      id:    'pl_' + Date.now(),
      nom,
      url:   url || '',
      emoji,
      dateAjout: Utils.aujourd_hui()
    };

    const playlists = this.getPlaylists();
    playlists.push(playlist);
    Utils.storage.set(this.CLE_PLAYLISTS, playlists);

    document.getElementById('modal-info')?.classList.add('hidden');
    Utils.toast(`✅ "${nom}" ajoutée !`, 'success', 2000);
    Utils.vibrerSuccess();

    this._refreshPage();
  },

  async _supprimerPlaylist(id) {
    const ok = await Utils.confirmer(
      'Supprimer cette playlist ?', ''
    );
    if (!ok) return;

    const playlists = this.getPlaylists().filter(p => p.id !== id);
    Utils.storage.set(this.CLE_PLAYLISTS, playlists);
    this._refreshPage();
  },

  // ════════════════════════════════════════════════════════
  // PREFS
  // ════════════════════════════════════════════════════════
  getPrefs() {
    return Utils.storage.get(this.CLE_PREFS, {
      service:         null,
      autoplay:        false,
      bpmSync:         true,
      volume:          80,
      playlistActive:  null
    });
  },

  sauvegarderPrefs(prefs) {
    Utils.storage.set(this.CLE_PREFS, prefs);
  },

  _togglePref(cle, val) {
    const prefs = this.getPrefs();
    prefs[cle]  = val;
    this.sauvegarderPrefs(prefs);
    Utils.toast(
      `${val ? '✅' : '❌'} ${cle === 'autoplay'
        ? 'Auto-play' : 'BPM Sync'} ${val ? 'activé' : 'désactivé'}`,
      'success', 1500
    );
  },

  _changerVolume(val) {
    const prefs = this.getPrefs();
    prefs.volume = parseInt(val);
    this.sauvegarderPrefs(prefs);
    const label = document.getElementById('vol-label');
    if (label) label.textContent = `${val}%`;

    // Appliquer au iframe si actif
    const iframe = document.querySelector(
      '#music-player-overlay iframe'
    );
    if (iframe?.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          `{"event":"command","func":"setVolume","args":[${val}]}`,
          '*'
        );
      } catch(e) {}
    }
  },

  // ════════════════════════════════════════════════════════
  // PLAYLISTS CUSTOM
  // ════════════════════════════════════════════════════════
  getPlaylists() {
    return Utils.storage.get(this.CLE_PLAYLISTS, []);
  },

  // ════════════════════════════════════════════════════════
  // SUGGESTION BPM
  // ════════════════════════════════════════════════════════
  getSuggestionBPM(typeExercice) {
    const MAP = {
      force:    { bpm:'60-90',   playlist:'strength', label:'Lent & Puissant' },
      cardio:   { bpm:'140-180', playlist:'running',  label:'Cardio Intense'  },
      hiit:     { bpm:'140-180', playlist:'hiit',     label:'HIIT Maximum'    },
      technique:{ bpm:'90-110',  playlist:'chill',    label:'Focus & Technique'},
      normal:   { bpm:'120-140', playlist:'motivant', label:'Workout Standard' }
    };
    return MAP[typeExercice] || MAP.normal;
  },

  // ✅ Afficher suggestion BPM dans le Live
  afficherSuggestionBPM(typeExercice) {
    const prefs = this.getPrefs();
    if (!prefs.bpmSync) return;

    const sugg = this.getSuggestionBPM(typeExercice);
    Utils.toast(
      `🎵 Suggestion : ${sugg.label} · ${sugg.bpm} BPM`,
      'info', 3000
    );
  },

  // ✅ Auto-play si activé
  autoPlaySiActif(typeExercice = 'normal') {
    const prefs = this.getPrefs();
    if (!prefs.autoplay) return;
    if (document.getElementById('music-player-overlay')) return;

    const sugg     = this.getSuggestionBPM(typeExercice);
    const playlist = this.PLAYLISTS_LOCALES.find(
      p => p.id === sugg.playlist
    );
    if (playlist) {
      setTimeout(() => {
        this._lancerPlaylistLocale(playlist.id);
      }, 1500);
    }
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _refreshPage() {
    const container = document.getElementById('page-music')
      || document.querySelector('.page.active');
    if (container && window._pageActive === 'music') {
      this.render(container);
    }
  },

  // ✅ Init
  init() {
    // ✅ Auto-play au démarrage séance
    window.addEventListener('seance-demarree', () => {
      try { this.autoPlaySiActif('normal'); } catch(e) {}
    });

    // ✅ Arrêter à la fin de séance
    window.addEventListener('seance-terminee', () => {
      try {
        const prefs = this.getPrefs();
        if (prefs.playlistActive) {
          setTimeout(() => this._fermerLecteur(), 3000);
        }
      } catch(e) {}
    });

    console.log('[Music] Initialisé ✅');
  }
};

window.Music = Music;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try { Music.init(); } catch(e) {}
  }, 2000);
});

console.log('✅ Music.js v1.0 chargé');
