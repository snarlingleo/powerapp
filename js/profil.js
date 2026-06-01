/* ============================================================
   PowerApp — profil.js v2.0
   ✅ Modal édition profil complète
   ✅ Régénération programme automatique
   ============================================================ */

'use strict';

const Profil = {

  // ════════════════════════════════════════════════════════
  // CONSTANTES
  // ════════════════════════════════════════════════════════
  OBJECTIFS: {
    prise_masse: {
      label:   '💪 Prise de masse',
      desc:    'Augmenter le volume musculaire',
      couleur: '#4b4bf9', reps: '6-12'
    },
    perte_poids: {
      label:   '⬇️ Perte de poids',
      desc:    'Perdre du gras en gardant le muscle',
      couleur: '#ff8d96', reps: '12-20'
    },
    seche: {
      label:   '🔥 Sèche',
      desc:    'Définition musculaire maximale',
      couleur: '#f9ef77', reps: '10-15'
    },
    force: {
      label:   '🏋️ Force',
      desc:    'Maximiser la force brute',
      couleur: '#8bf0bb', reps: '3-6'
    },
    endurance: {
      label:   '🏃 Endurance',
      desc:    'Améliorer la résistance',
      couleur: '#bfa1ff', reps: '15-25'
    },
    forme: {
      label:   '✨ Forme générale',
      desc:    'Équilibre santé & esthétique',
      couleur: '#8bf0bb', reps: '10-15'
    }
  },

  NIVEAUX: {
    debutant: {
      label: '🌱 Débutant',
      desc:  'Moins de 1 an de pratique',
      seances: 3, repos: 90
    },
    intermediaire: {
      label: '💪 Intermédiaire',
      desc:  '1 à 3 ans de pratique',
      seances: 4, repos: 75
    },
    avance: {
      label: '🔥 Avancé',
      desc:  'Plus de 3 ans de pratique',
      seances: 5, repos: 60
    }
  },

  LIEUX: {
    salle: {
      label: '🏋️ Salle de sport',
      desc:  'Accès à tous les équipements',
      bonus: 'Machines + Poids libres + Câbles'
    },
    maison: {
      label: '🏠 Maison',
      desc:  'Entraînement à domicile',
      bonus: 'Haltères + Élastiques + Poids corps'
    },
    dehors: {
      label: '🌳 Extérieur',
      desc:  'Parc, terrain de sport',
      bonus: 'Poids du corps + Barres outdoor'
    }
  },

  // ════════════════════════════════════════════════════════
  // STATE INTERNE
  // ════════════════════════════════════════════════════════
  _genreChoisi:    null,
  _objectifChoisi: null,
  _niveauChoisi:   null,
  _lieuChoisi:     null,
  _musclesChoisis: [],
  _avatarChoisi:   null,

  // ════════════════════════════════════════════════════════
  // SET PROFIL (onboarding)
  // ════════════════════════════════════════════════════════
  set(data) {
    Utils.storage.set('ft_profil',            data);
    Utils.storage.set('ft_profil_onboarding', data);
    Utils.storage.set('ft_onboarding_data',   data);
    return data;
  },

  // ════════════════════════════════════════════════════════
  // CALCULER NUTRITION
  // ════════════════════════════════════════════════════════
  calculerNutrition({ poids, taille, age, genre, objectif, niveau }) {
    const p = poids  || 75;
    const t = taille || 175;
    const a = age    || 25;

    // BMR Mifflin-St Jeor
    let bmr = genre === 'femme'
      ? 10*p + 6.25*t - 5*a - 161
      : 10*p + 6.25*t - 5*a + 5;

    const facteur = {
      debutant: 1.375, intermediaire: 1.55, avance: 1.725
    };
    let tdee = bmr * (facteur[niveau] || 1.55);

    const ajust = {
      prise_masse: 300, perte_poids: -400, seche: -250,
      force: 200, endurance: 100, forme: 0
    };
    const calories = Math.round(tdee + (ajust[objectif] || 0));

    const factProt = {
      prise_masse: 2.2, force: 2.0, seche: 2.4,
      perte_poids: 2.2, endurance: 1.8, forme: 2.0
    };
    const proteines = Math.round(p * (factProt[objectif] || 2.0));
    const lipides   = Math.round((calories * 0.25) / 9);
    const glucides  = Math.round((calories - proteines*4 - lipides*9) / 4);
    const eau       = Math.round(p * 0.035 * 10) / 10;

    return { calories, proteines, glucides, lipides, eau };
  },

  // ════════════════════════════════════════════════════════
  // OUVRIR MODAL ÉDITION
  // ════════════════════════════════════════════════════════
  _ouvrirEdition() {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    // ✅ Charger données existantes
    let profil = {};
    try { profil = Tracker.getProfil(); } catch(e) {}

    const saved = Utils.storage.get('ft_onboarding_data', {})
               || Utils.storage.get('ft_profil_onboarding', {})
               || {};

    // ✅ Valeurs actuelles
    const genre   = saved.genre   || profil.genre   || 'homme';
    const objectif= saved.objectif|| profil.objectif|| 'forme';
    const niveau  = saved.niveau  || profil.niveau  || 'intermediaire';
    const lieu    = saved.lieu    || profil.lieu    || 'salle';
    const muscles = saved.muscles_cibles || profil.muscles_cibles || [];

    // ✅ Init state
    this._genreChoisi    = genre;
    this._objectifChoisi = objectif;
    this._niveauChoisi   = niveau;
    this._lieuChoisi     = lieu;
    this._musclesChoisis = [...muscles];
    this._avatarChoisi   = profil.avatar || null;

    content.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <!-- Titre -->
        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:20px;
                    display:flex;align-items:center;gap:8px;
                    color:white">
          ✏️ Modifier mon profil
        </div>

        <!-- ═══ GENRE ═══ -->
        <div class="card mb-md">
          <div class="card-label">👤 Genre</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:10px;margin-top:10px">
            ${[
              { val:'homme', emoji:'👨', label:'Homme' },
              { val:'femme', emoji:'👩', label:'Femme'  }
            ].map(g => `
              <button id="profil-genre-${g.val}"
                      onclick="Profil._selGenre('${g.val}')"
                      style="padding:16px;text-align:center;
                             background:${genre === g.val
                               ? 'rgba(75,75,249,0.25)'
                               : 'rgba(255,255,255,0.04)'};
                             border:2px solid ${genre === g.val
                               ? 'var(--fd-indigo)'
                               : 'rgba(255,255,255,0.1)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;font-family:inherit;
                             color:white;transition:all .2s">
                <div style="font-size:2rem;margin-bottom:6px">
                  ${g.emoji}
                </div>
                <div style="font-size:.88rem;font-weight:800">
                  ${g.label}
                </div>
              </button>`).join('')}
          </div>
        </div>

        <!-- ═══ INFOS DE BASE ═══ -->
        <div class="card mb-md">
          <div class="card-label">📋 Informations</div>
          <div style="margin-top:12px">
            <div class="input-label">Prénom *</div>
            <input class="input mb-md" id="profil-edit-nom"
                   placeholder="Ton prénom"
                   value="${profil.nom || saved.nom || ''}"/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                      gap:8px">
            <div>
              <div class="input-label">Poids (kg)</div>
              <input class="input" id="profil-edit-poids"
                     type="number" inputmode="decimal"
                     placeholder="80"
                     value="${profil.poids || saved.poids || ''}"/>
            </div>
            <div>
              <div class="input-label">Taille (cm)</div>
              <input class="input" id="profil-edit-taille"
                     type="number" inputmode="numeric"
                     placeholder="178"
                     value="${profil.taille || saved.taille || ''}"/>
            </div>
            <div>
              <div class="input-label">Âge</div>
              <input class="input" id="profil-edit-age"
                     type="number" inputmode="numeric"
                     placeholder="25"
                     value="${profil.age || saved.age || ''}"/>
            </div>
          </div>
        </div>

        <!-- ═══ AVATAR ═══ -->
        <div class="card mb-md">
          <div class="card-label">🎨 Avatar</div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">
            ${['💪','🔥','⚡','🏆','🎯','🦁','🐺','🦅',
               '💎','🌟','🚀','⚔️','🥊','🏋️','🤸','🏃'].map(e => `
              <button onclick="Profil._selAvatar('${e}',this)"
                      style="width:44px;height:44px;
                             border-radius:10px;font-size:1.3rem;
                             cursor:pointer;transition:all .15s;
                             background:${(profil.avatar||'💪') === e
                               ? 'rgba(75,75,249,0.25)'
                               : 'rgba(255,255,255,0.04)'};
                             border:2px solid ${(profil.avatar||'💪') === e
                               ? 'var(--fd-indigo)'
                               : 'rgba(255,255,255,0.08)'}">
                ${e}
              </button>`).join('')}
          </div>
        </div>

        <!-- ═══ OBJECTIF ═══ -->
        <div class="card mb-md">
          <div class="card-label">🎯 Objectif</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:8px;margin-top:10px">
            ${Object.entries(this.OBJECTIFS).map(([val, obj]) => `
              <button id="profil-obj-${val}"
                      onclick="Profil._selObjectif('${val}')"
                      style="padding:12px 10px;text-align:left;
                             background:${objectif === val
                               ? `${obj.couleur}22`
                               : 'rgba(255,255,255,0.04)'};
                             border:1px solid ${objectif === val
                               ? `${obj.couleur}66`
                               : 'rgba(255,255,255,0.08)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;width:100%;
                             font-family:inherit;color:white;
                             transition:all .2s">
                <div style="font-size:1.1rem;margin-bottom:4px">
                  ${obj.label.split(' ')[0]}
                </div>
                <div style="font-size:.8rem;font-weight:700;
                            color:white">
                  ${obj.label.split(' ').slice(1).join(' ')}
                </div>
                <div style="font-size:.62rem;
                            color:rgba(255,255,255,0.4);
                            margin-top:3px">
                  ${obj.desc}
                </div>
              </button>`).join('')}
          </div>
        </div>

        <!-- ═══ NIVEAU ═══ -->
        <div class="card mb-md">
          <div class="card-label">📊 Niveau</div>
          <div style="display:flex;flex-direction:column;
                      gap:8px;margin-top:10px">
            ${Object.entries(this.NIVEAUX).map(([val, niv]) => `
              <button id="profil-niv-${val}"
                      onclick="Profil._selNiveau('${val}')"
                      style="display:flex;align-items:center;gap:12px;
                             padding:14px;text-align:left;
                             background:${niveau === val
                               ? 'rgba(75,75,249,0.2)'
                               : 'rgba(255,255,255,0.04)'};
                             border:2px solid ${niveau === val
                               ? 'var(--fd-indigo)'
                               : 'rgba(255,255,255,0.08)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;width:100%;
                             font-family:inherit;color:white;
                             transition:all .2s">
                <span style="font-size:1.4rem">
                  ${niv.label.split(' ')[0]}
                </span>
                <div style="flex:1">
                  <div style="font-size:.88rem;font-weight:800">
                    ${niv.label.split(' ').slice(1).join(' ')}
                  </div>
                  <div style="font-size:.65rem;
                              color:rgba(255,255,255,0.4);margin-top:2px">
                    ${niv.desc} · ${niv.seances}j/sem · repos ${niv.repos}s
                  </div>
                </div>
                ${niveau === val ? `
                  <span style="color:var(--fd-indigo);font-size:1.1rem">
                    ✓
                  </span>` : ''}
              </button>`).join('')}
          </div>
        </div>

        <!-- ═══ LIEU ═══ -->
        <div class="card mb-md">
          <div class="card-label">📍 Lieu d'entraînement</div>
          <div style="display:flex;flex-direction:column;
                      gap:8px;margin-top:10px">
            ${Object.entries(this.LIEUX).map(([val, l]) => `
              <button id="profil-lieu-${val}"
                      onclick="Profil._selLieu('${val}')"
                      style="display:flex;align-items:center;gap:12px;
                             padding:14px;text-align:left;
                             background:${lieu === val
                               ? 'rgba(139,240,187,0.12)'
                               : 'rgba(255,255,255,0.04)'};
                             border:2px solid ${lieu === val
                               ? 'var(--fd-mint)'
                               : 'rgba(255,255,255,0.08)'};
                             border-radius:var(--radius-lg);
                             cursor:pointer;width:100%;
                             font-family:inherit;color:white;
                             transition:all .2s">
                <span style="font-size:1.5rem">
                  ${l.label.split(' ')[0]}
                </span>
                <div style="flex:1">
                  <div style="font-size:.88rem;font-weight:800">
                    ${l.label.split(' ').slice(1).join(' ')}
                  </div>
                  <div style="font-size:.65rem;
                              color:rgba(255,255,255,0.4);margin-top:2px">
                    ${l.desc}
                  </div>
                  <div style="font-size:.6rem;
                              color:var(--fd-mint);margin-top:2px">
                    ✅ ${l.bonus}
                  </div>
                </div>
                ${lieu === val ? `
                  <span style="color:var(--fd-mint);font-size:1.1rem">
                    ✓
                  </span>` : ''}
              </button>`).join('')}
          </div>
        </div>

        <!-- ═══ MUSCLES CIBLÉS ═══ -->
        <div class="card mb-md">
          <div class="card-label">💪 Muscles ciblés</div>
          <div style="display:flex;flex-wrap:wrap;
                      gap:8px;margin-top:10px">
            ${[
              { val:'pectoraux',  label:'Pectoraux',  c:'#4b4bf9' },
              { val:'deltoides',  label:'Épaules',    c:'#bfa1ff' },
              { val:'biceps',     label:'Biceps',     c:'#8bf0bb' },
              { val:'triceps',    label:'Triceps',    c:'#ff8d96' },
              { val:'dorsal',     label:'Dos',        c:'#4b4bf9' },
              { val:'trapeze',    label:'Trapèzes',   c:'#8bf0bb' },
              { val:'abdominaux', label:'Abdos',      c:'#f9ef77' },
              { val:'lombaires',  label:'Lombaires',  c:'#bfa1ff' },
              { val:'quadriceps', label:'Quadriceps', c:'#22c55e' },
              { val:'fessiers',   label:'Fessiers',   c:'#ff8d96' },
              { val:'ischio',     label:'Ischio',     c:'#f9ef77' },
              { val:'mollets',    label:'Mollets',    c:'#bfa1ff' }
            ].map(m => {
              const sel = muscles.includes(m.val);
              return `
                <button id="profil-muscle-${m.val}"
                        onclick="Profil._selMuscle('${m.val}',this,'${m.c}')"
                        style="padding:7px 14px;
                               background:${sel
                                 ? m.c+'22' : 'rgba(255,255,255,0.04)'};
                               border:1px solid ${sel
                                 ? m.c+'66' : 'rgba(255,255,255,0.08)'};
                               border-radius:99px;
                               font-size:.75rem;font-weight:700;
                               color:${sel ? m.c : 'rgba(255,255,255,0.5)'};
                               cursor:pointer;transition:all .15s">
                  ${m.label}
                </button>`;
            }).join('')}
          </div>
          <div style="margin-top:8px;font-size:.65rem;
                      color:var(--text-muted)">
            💡 Laisse vide pour un programme corps complet
          </div>
        </div>

        <!-- ═══ NOTE RÉGÉNÉRATION ═══ -->
        <div style="padding:12px 14px;margin-bottom:16px;
                    background:rgba(139,240,187,0.06);
                    border:1px solid rgba(139,240,187,0.2);
                    border-radius:var(--radius-md)">
          <div style="font-size:.7rem;color:var(--fd-mint);
                      font-weight:700;margin-bottom:3px">
            🔄 Régénération automatique du programme
          </div>
          <div style="font-size:.65rem;color:var(--text-muted);
                      line-height:1.5">
            En sauvegardant, ton programme sera mis à jour
            selon ton âge, niveau, objectif et muscles ciblés.
          </div>
        </div>

        <!-- ═══ BOUTONS ═══ -->
        <div style="display:grid;grid-template-columns:1fr 2fr;
                    gap:10px;padding-bottom:8px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary"
                  style="font-size:.82rem">
            ✕ Annuler
          </button>
          <button onclick="Profil._sauvegarder()"
                  class="btn-primary"
                  style="font-size:.88rem">
            ✅ Sauvegarder
          </button>
        </div>

      </div>
    `;

    modal.classList.remove('hidden');

    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  // ════════════════════════════════════════════════════════
  // SÉLECTIONS UI
  // ════════════════════════════════════════════════════════
  _selGenre(val) {
    this._genreChoisi = val;
    ['homme','femme'].forEach(g => {
      const btn = document.getElementById(`profil-genre-${g}`);
      if (!btn) return;
      btn.style.background  = g === val
        ? 'rgba(75,75,249,0.25)' : 'rgba(255,255,255,0.04)';
      btn.style.borderColor = g === val
        ? 'var(--fd-indigo)' : 'rgba(255,255,255,0.1)';
    });
    Utils.vibrer([15]);
  },

  _selAvatar(val, btn) {
    this._avatarChoisi = val;
    document.querySelectorAll('[onclick^="Profil._selAvatar"]')
      .forEach(b => {
        b.style.background  = 'rgba(255,255,255,0.04)';
        b.style.borderColor = 'rgba(255,255,255,0.08)';
      });
    btn.style.background  = 'rgba(75,75,249,0.25)';
    btn.style.borderColor = 'var(--fd-indigo)';
    Utils.vibrer([15]);
  },

  _selObjectif(val) {
    this._objectifChoisi = val;
    Object.keys(this.OBJECTIFS).forEach(k => {
      const btn = document.getElementById(`profil-obj-${k}`);
      const obj = this.OBJECTIFS[k];
      if (!btn) return;
      btn.style.background  = k === val
        ? `${obj.couleur}22` : 'rgba(255,255,255,0.04)';
      btn.style.borderColor = k === val
        ? `${obj.couleur}66` : 'rgba(255,255,255,0.08)';
    });
    Utils.vibrer([15]);
  },

  _selNiveau(val) {
    this._niveauChoisi = val;
    Object.keys(this.NIVEAUX).forEach(k => {
      const btn = document.getElementById(`profil-niv-${k}`);
      if (!btn) return;
      btn.style.background  = k === val
        ? 'rgba(75,75,249,0.2)' : 'rgba(255,255,255,0.04)';
      btn.style.borderColor = k === val
        ? 'var(--fd-indigo)' : 'rgba(255,255,255,0.08)';

      // Mettre à jour le ✓
      const check = btn.querySelector('span:last-child');
      if (check) {
        check.style.display = k === val ? 'inline' : 'none';
      }
    });
    Utils.vibrer([15]);
  },

  _selLieu(val) {
    this._lieuChoisi = val;
    Object.keys(this.LIEUX).forEach(k => {
      const btn = document.getElementById(`profil-lieu-${k}`);
      if (!btn) return;
      btn.style.background  = k === val
        ? 'rgba(139,240,187,0.12)' : 'rgba(255,255,255,0.04)';
      btn.style.borderColor = k === val
        ? 'var(--fd-mint)' : 'rgba(255,255,255,0.08)';

      const check = btn.querySelector('span:last-child');
      if (check) {
        check.style.display = k === val ? 'inline' : 'none';
      }
    });
    Utils.vibrer([15]);
  },

  _selMuscle(val, btn, couleur) {
    const idx = this._musclesChoisis.indexOf(val);
    if (idx === -1) {
      this._musclesChoisis.push(val);
      btn.style.background  = couleur + '22';
      btn.style.borderColor = couleur + '66';
      btn.style.color       = couleur;
    } else {
      this._musclesChoisis.splice(idx, 1);
      btn.style.background  = 'rgba(255,255,255,0.04)';
      btn.style.borderColor = 'rgba(255,255,255,0.08)';
      btn.style.color       = 'rgba(255,255,255,0.5)';
    }
    Utils.vibrer([15]);
  },

  // ════════════════════════════════════════════════════════
  // SAUVEGARDER
  // ════════════════════════════════════════════════════════
  _sauvegarder() {
    try {
      // ✅ Récupérer valeurs
      const nom    = document.getElementById('profil-edit-nom')?.value?.trim();
      const poids  = parseFloat(document.getElementById('profil-edit-poids')?.value);
      const taille = parseFloat(document.getElementById('profil-edit-taille')?.value);
      const age    = parseInt(document.getElementById('profil-edit-age')?.value);

      if (!nom) {
        Utils.toast('Entre ton prénom !', 'error');
        return;
      }

      // ✅ Récupérer profil existant
      let profil = {};
      try { profil = Tracker.getProfil(); } catch(e) {}

      // ✅ Construire updates
      const updates = {
        nom,
        poids:          isNaN(poids)  ? profil.poids  : poids,
        taille:         isNaN(taille) ? profil.taille : taille,
        age:            isNaN(age)    ? profil.age    : age,
        genre:          this._genreChoisi    || profil.genre    || 'homme',
        objectif:       this._objectifChoisi || profil.objectif || 'forme',
        niveau:         this._niveauChoisi   || profil.niveau   || 'intermediaire',
        lieu:           this._lieuChoisi     || profil.lieu     || 'salle',
        muscles_cibles: [...this._musclesChoisis],
        avatar:         this._avatarChoisi   || profil.avatar   || '💪'
      };

      // ✅ Sauvegarder profil tracker
      try { Tracker.sauvegarderProfil(updates); } catch(e) {}

      // ✅ Sauvegarder onboarding data (pour le programme)
      const obData = Utils.storage.get('ft_onboarding_data', {})
                  || Utils.storage.get('ft_profil_onboarding', {})
                  || {};

      const mergedOb = { ...obData, ...updates };
      Utils.storage.set('ft_onboarding_data',   mergedOb);
      Utils.storage.set('ft_profil_onboarding', mergedOb);
      Utils.storage.set('ft_profil',            updates);

      // ✅ Feedback
      Utils.toast('✅ Profil sauvegardé !', 'success');
      Utils.vibrerSuccess();

      // ✅ Fermer la modal
      document.getElementById('modal-info')?.classList.add('hidden');

      // ✅ Regénérer le programme
      setTimeout(() => {
        try {
          _regenererProgrammeDepuisProfil();
        } catch(e) {
          console.warn('[Profil] Régénération:', e);
        }
      }, 300);

      // ✅ Reset state
      this._genreChoisi    = null;
      this._objectifChoisi = null;
      this._niveauChoisi   = null;
      this._lieuChoisi     = null;
      this._musclesChoisis = [];
      this._avatarChoisi   = null;

      // ✅ Retourner au profil
      setTimeout(() => naviguer('profil'), 400);

    } catch(e) {
      console.error('[Profil] Erreur sauvegarde:', e);
      Utils.toast('❌ Erreur sauvegarde', 'error');
    }
  }
};

window.Profil = Profil;
console.log('✅ Profil.js v2.0 chargé');
