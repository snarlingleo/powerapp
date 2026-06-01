/* ============================================================
   PowerApp — custom-exercises.js v1.0
   ✅ Créer / modifier / supprimer ses propres exercices
   ✅ Photo + vidéo perso
   ✅ Intégration dans la galerie et les séances
   ✅ Import / Export
   ============================================================ */

'use strict';

const CustomExercices = {

  CLE: 'ft_custom_exercices',

  // ════════════════════════════════════════════════════════
  // CRUD
  // ════════════════════════════════════════════════════════
  getAll() {
    return Utils.storage.get(this.CLE, {});
  },

  get(ref) {
    return this.getAll()[ref] || null;
  },

  sauvegarder(exercice) {
    const tous = this.getAll();
    // ✅ Générer ref si nouveau
    if (!exercice.ref) {
      exercice.ref = 'custom_' + Date.now();
    }
    exercice.custom      = true;
    exercice.dateCreation = exercice.dateCreation || Utils.aujourd_hui();
    exercice.dateModif    = Utils.aujourd_hui();

    tous[exercice.ref] = exercice;
    Utils.storage.set(this.CLE, tous);

    // ✅ Injecter dans window.EXERCICES
    this._injecterDansGlobal(exercice);

    return exercice;
  },

  supprimer(ref) {
    const tous = this.getAll();
    if (!tous[ref]) return false;
    delete tous[ref];
    Utils.storage.set(this.CLE, tous);

    // ✅ Retirer de window.EXERCICES
    if (window.EXERCICES?.[ref]) {
      delete window.EXERCICES[ref];
    }
    return true;
  },

  // ✅ Injecter dans la DB globale
  _injecterDansGlobal(ex) {
    if (!window.EXERCICES) window.EXERCICES = {};
    window.EXERCICES[ex.ref] = {
      nom:        ex.nom,
      muscle:     ex.muscle,
      emoji:      ex.emoji || '💪',
      groupe:     ex.groupe || 'fullbody',
      difficulte: ex.difficulte || 2,
      equipement: ex.equipement || 'Poids libres',
      description:ex.description || '',
      conseils:   ex.conseils || [],
      youtube:    ex.youtube || null,
      custom:     true
    };
  },

  // ✅ Injecter tous au démarrage
  injecterTous() {
    const tous = this.getAll();
    Object.values(tous).forEach(ex => this._injecterDansGlobal(ex));
    const nb = Object.keys(tous).length;
    if (nb > 0) {
      console.log(`[CustomExercices] ${nb} exercices perso chargés`);
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const tous = this.getAll();
    const list = Object.values(tous);

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          💪 EXERCICES PERSO
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Mes exercices
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Crée tes propres exercices avec vidéo et conseils
        </p>
      </div>

      <!-- Bouton créer -->
      <button onclick="CustomExercices._ouvrirFormulaire()"
              class="btn-primary mb-md"
              style="width:100%;font-size:.88rem;
                     display:flex;align-items:center;
                     justify-content:center;gap:8px">
        ➕ Créer un exercice
      </button>

      <!-- Stats -->
      ${list.length > 0 ? `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);
                    gap:8px;margin-bottom:16px">
          ${[
            { val:list.length, label:'Créés',   color:'var(--fd-indigo)' },
            { val:list.filter(e=>e.youtube).length,
              label:'Avec vidéo', color:'#ff5555' },
            { val:list.filter(e=>e.photo).length,
              label:'Avec photo', color:'var(--fd-mint)' }
          ].map(s=>`
            <div style="background:rgba(255,255,255,0.04);
                        border:1px solid rgba(255,255,255,0.08);
                        border-radius:var(--radius-md);
                        padding:12px 8px;text-align:center">
              <div style="font-size:1.2rem;font-weight:800;
                          color:${s.color}">${s.val}</div>
              <div style="font-size:.58rem;color:var(--text-muted);
                          margin-top:3px;text-transform:uppercase">
                ${s.label}
              </div>
            </div>`).join('')}
        </div>` : ''}

      <!-- Liste exercices -->
      ${list.length === 0 ? `
        <div style="text-align:center;padding:40px 20px;
                    background:rgba(255,255,255,0.03);
                    border:1px dashed rgba(255,255,255,0.1);
                    border-radius:var(--radius-xl)">
          <div style="font-size:3rem;margin-bottom:12px">💪</div>
          <div style="font-size:1rem;font-weight:700;margin-bottom:6px">
            Aucun exercice perso
          </div>
          <div style="font-size:.78rem;color:var(--text-muted);
                      margin-bottom:16px;line-height:1.5">
            Crée ton premier exercice personnalisé !<br>
            Il apparaîtra dans la galerie et tes séances.
          </div>
          <button onclick="CustomExercices._ouvrirFormulaire()"
                  class="btn-primary" style="font-size:.82rem">
            ➕ Créer maintenant
          </button>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${list.map(ex => this._renderCarteExercice(ex)).join('')}
        </div>`}

      <!-- Import / Export -->
      ${list.length > 0 ? `
        <div class="card mt-md">
          <div class="card-label">📦 Import / Export</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;
                      gap:8px;margin-top:10px">
            <button onclick="CustomExercices._exporter()"
                    class="btn-secondary"
                    style="font-size:.78rem">
              📤 Exporter JSON
            </button>
            <button onclick="CustomExercices._importerFichier()"
                    class="btn-secondary"
                    style="font-size:.78rem">
              📥 Importer JSON
            </button>
          </div>
        </div>` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // CARTE EXERCICE
  // ════════════════════════════════════════════════════════
  _renderCarteExercice(ex) {
    return `
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-lg);
                  overflow:hidden">

        <!-- Photo si dispo -->
        ${ex.photo ? `
          <div style="position:relative;
                      height:140px;overflow:hidden;
                      background:#000">
            <img src="${ex.photo}"
                 style="width:100%;height:100%;
                        object-fit:cover;opacity:0.85"
                 onerror="this.parentElement.style.display='none'"/>
            <div style="position:absolute;inset:0;
                        background:linear-gradient(
                          to bottom,transparent 40%,
                          rgba(0,0,0,0.7) 100%)"></div>
            <!-- Badge custom -->
            <div style="position:absolute;top:8px;right:8px;
                        padding:3px 8px;
                        background:rgba(75,75,249,0.8);
                        border-radius:99px;font-size:.6rem;
                        font-weight:700;color:white">
              💪 Perso
            </div>
          </div>` : ''}

        <!-- Contenu -->
        <div style="padding:14px">
          <div style="display:flex;align-items:flex-start;
                      gap:12px;margin-bottom:10px">

            <!-- Emoji -->
            <div style="width:48px;height:48px;border-radius:12px;
                        background:rgba(75,75,249,0.12);
                        border:1px solid rgba(75,75,249,0.25);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.5rem;
                        flex-shrink:0">
              ${ex.emoji || '💪'}
            </div>

            <!-- Infos -->
            <div style="flex:1;min-width:0">
              <div style="font-size:.92rem;font-weight:800;
                          color:white;margin-bottom:3px">
                ${ex.nom}
              </div>
              <div style="font-size:.65rem;color:var(--fd-mint);
                          margin-bottom:4px">
                ${ex.muscle || '—'}
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:4px">
                ${ex.groupe ? `
                  <span style="padding:2px 8px;font-size:.58rem;
                               background:rgba(75,75,249,0.1);
                               border:1px solid rgba(75,75,249,0.2);
                               border-radius:99px;color:var(--fd-lavender)">
                    ${ex.groupe}
                  </span>` : ''}
                ${ex.equipement ? `
                  <span style="padding:2px 8px;font-size:.58rem;
                               background:rgba(255,255,255,0.05);
                               border:1px solid rgba(255,255,255,0.1);
                               border-radius:99px;
                               color:var(--text-muted)">
                    ${ex.equipement}
                  </span>` : ''}
                <span style="padding:2px 8px;font-size:.58rem;
                             background:rgba(139,240,187,0.08);
                             border:1px solid rgba(139,240,187,0.2);
                             border-radius:99px;color:var(--fd-mint)">
                  💪 Perso
                </span>
              </div>
            </div>

            <!-- Difficulté -->
            <div style="display:flex;flex-direction:column;
                        gap:2px;flex-shrink:0">
              ${[1,2,3,4,5].map(d=>`
                <div style="width:6px;height:6px;border-radius:50%;
                            background:${d<=(ex.difficulte||1)
                              ?'var(--fd-lemon)'
                              :'rgba(255,255,255,0.1)'}">
                </div>`).join('')}
            </div>
          </div>

          <!-- Description -->
          ${ex.description ? `
            <div style="font-size:.75rem;color:var(--text-secondary);
                        line-height:1.5;margin-bottom:10px;
                        padding:8px 10px;
                        background:rgba(255,255,255,0.03);
                        border-radius:var(--radius-sm)">
              ${ex.description}
            </div>` : ''}

          <!-- Conseils -->
          ${ex.conseils?.length ? `
            <div style="margin-bottom:10px">
              ${ex.conseils.slice(0,2).map(c=>`
                <div style="font-size:.68rem;color:var(--text-muted);
                            display:flex;gap:5px;padding:2px 0">
                  <span style="color:var(--fd-indigo)">•</span>${c}
                </div>`).join('')}
            </div>` : ''}

          <!-- Actions -->
          <div style="display:flex;gap:6px;flex-wrap:wrap">

            <!-- Voir vidéo si YouTube ID -->
            ${ex.youtube ? `
              <button onclick="VideoDemo.ouvrir(
                        '${ex.youtube}',
                        '${ex.nom.replace(/'/g,"\\'")}',
                        '${ex.muscle||''}',
                        '${ex.ref}')"
                      style="padding:6px 12px;
                             background:rgba(255,0,0,0.1);
                             border:1px solid rgba(255,80,80,0.25);
                             border-radius:var(--radius-full);
                             font-size:.7rem;font-weight:700;
                             color:#ff5555;cursor:pointer">
                ▶ Vidéo
              </button>` : ''}

            <!-- Modifier -->
            <button onclick="CustomExercices._ouvrirFormulaire('${ex.ref}')"
                    style="padding:6px 12px;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:var(--radius-full);
                           font-size:.7rem;font-weight:700;
                           color:var(--fd-indigo);cursor:pointer">
              ✏️ Modifier
            </button>

            <!-- Ajouter à une séance -->
            <button onclick="CustomExercices._ajouterASeance('${ex.ref}')"
                    style="padding:6px 12px;
                           background:rgba(139,240,187,0.08);
                           border:1px solid rgba(139,240,187,0.2);
                           border-radius:var(--radius-full);
                           font-size:.7rem;font-weight:700;
                           color:var(--fd-mint);cursor:pointer">
              📅 + Séance
            </button>

            <!-- Supprimer -->
            <button onclick="CustomExercices._confirmerSuppression('${ex.ref}')"
                    style="padding:6px 12px;
                           background:rgba(255,141,150,0.08);
                           border:1px solid rgba(255,141,150,0.2);
                           border-radius:var(--radius-full);
                           font-size:.7rem;font-weight:700;
                           color:var(--fd-coral);cursor:pointer;
                           margin-left:auto">
              🗑️
            </button>
          </div>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // FORMULAIRE CRÉATION / ÉDITION
  // ════════════════════════════════════════════════════════
  _ouvrirFormulaire(ref = null) {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const ex = ref ? (this.get(ref) || {}) : {};
    const isEdit = !!ref;

    content.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <!-- Titre -->
        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:20px;color:white;
                    display:flex;align-items:center;gap:8px">
          ${isEdit ? '✏️ Modifier l\'exercice' : '➕ Nouvel exercice'}
        </div>

        <!-- ─── INFOS DE BASE ─── -->
        <div class="card mb-md">
          <div class="card-label">📋 Informations</div>

          <!-- Emoji -->
          <div style="margin-top:12px;margin-bottom:10px">
            <div class="input-label">Emoji</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
              ${['💪','🏋️','🤸','🏃','⚡','🔥','🎯','💥',
                 '🦵','🦴','🤼','🥊','🧘','🏊','🚴','⛹️'].map(e=>`
                <button onclick="CustomExercices._selEmoji('${e}',this)"
                        id="emoji-btn-${e}"
                        style="width:40px;height:40px;font-size:1.2rem;
                               border-radius:10px;cursor:pointer;
                               transition:all .15s;
                               background:${(ex.emoji||'💪')===e
                                 ?'rgba(75,75,249,0.25)'
                                 :'rgba(255,255,255,0.04)'};
                               border:2px solid ${(ex.emoji||'💪')===e
                                 ?'var(--fd-indigo)'
                                 :'rgba(255,255,255,0.08)'}">
                  ${e}
                </button>`).join('')}
            </div>
            <input type="hidden" id="ex-emoji"
                   value="${ex.emoji||'💪'}"/>
          </div>

          <!-- Nom -->
          <div class="input-label">Nom de l'exercice *</div>
          <input class="input mb-sm" id="ex-nom"
                 placeholder="ex: Cable Fly Low to High"
                 value="${ex.nom||''}"/>

          <!-- Muscle -->
          <div class="input-label">Muscle principal *</div>
          <select class="input mb-sm" id="ex-muscle">
            ${['Pectoraux','Dos','Épaules','Biceps','Triceps',
               'Abdominaux','Quadriceps','Fessiers','Ischio-jambiers',
               'Mollets','Lombaires','Avant-bras','Full Body'
              ].map(m=>`
                <option value="${m}"
                        ${(ex.muscle||'Pectoraux')===m?'selected':''}>
                  ${m}
                </option>`).join('')}
          </select>

          <!-- Groupe -->
          <div class="input-label">Groupe</div>
          <select class="input mb-sm" id="ex-groupe">
            ${[
              {val:'push',     label:'Push (Poussée)'},
              {val:'pull',     label:'Pull (Tirage)'},
              {val:'jambes',   label:'Jambes'},
              {val:'abdos',    label:'Abdos / Core'},
              {val:'cardio',   label:'Cardio'},
              {val:'fullbody', label:'Full Body'}
            ].map(g=>`
              <option value="${g.val}"
                      ${(ex.groupe||'push')===g.val?'selected':''}>
                ${g.label}
              </option>`).join('')}
          </select>

          <!-- Équipement -->
          <div class="input-label">Équipement</div>
          <select class="input mb-sm" id="ex-equipement">
            ${['Barre','Haltères','Machine','Câbles','Poulie',
               'Poids du corps','Élastiques','Kettlebell','Aucun'
              ].map(e=>`
                <option value="${e}"
                        ${(ex.equipement||'Haltères')===e?'selected':''}>
                  ${e}
                </option>`).join('')}
          </select>

          <!-- Difficulté -->
          <div class="input-label">Difficulté</div>
          <div style="display:flex;gap:8px;margin-top:6px;
                      margin-bottom:12px">
            ${[1,2,3,4,5].map(d=>`
              <button onclick="CustomExercices._selDiff(${d},this)"
                      id="diff-btn-${d}"
                      style="flex:1;padding:8px;border-radius:8px;
                             font-size:.72rem;font-weight:700;
                             cursor:pointer;transition:all .15s;
                             background:${(ex.difficulte||2)===d
                               ?'rgba(249,239,119,0.2)'
                               :'rgba(255,255,255,0.04)'};
                             border:1px solid ${(ex.difficulte||2)===d
                               ?'var(--fd-lemon)'
                               :'rgba(255,255,255,0.08)'};
                             color:${(ex.difficulte||2)===d
                               ?'var(--fd-lemon)'
                               :'var(--text-muted)'}">
                ${'●'.repeat(d)}
              </button>`).join('')}
          </div>
          <input type="hidden" id="ex-difficulte"
                 value="${ex.difficulte||2}"/>
        </div>

        <!-- ─── DESCRIPTION & CONSEILS ─── -->
        <div class="card mb-md">
          <div class="card-label">📝 Description & Conseils</div>

          <div style="margin-top:10px">
            <div class="input-label">Description</div>
            <textarea class="input" id="ex-description"
                      rows="3"
                      placeholder="Décris le mouvement..."
                      style="resize:vertical;min-height:70px"
                      >${ex.description||''}</textarea>
          </div>

          <div style="margin-top:10px">
            <div class="input-label">
              Conseils techniques
              <span style="color:var(--text-muted);
                           font-weight:400"> (un par ligne)</span>
            </div>
            <textarea class="input" id="ex-conseils"
                      rows="3"
                      placeholder="Garde le dos droit&#10;Contrôle la descente&#10;Expire sur l'effort"
                      style="resize:vertical;min-height:70px"
                      >${(ex.conseils||[]).join('\n')}</textarea>
          </div>
        </div>

        <!-- ─── VIDÉO ─── -->
        <div class="card mb-md">
          <div class="card-label">🎬 Vidéo YouTube</div>
          <div style="margin-top:10px">
            <div class="input-label">
              ID YouTube ou URL complète
            </div>
            <input class="input mb-sm" id="ex-youtube"
                   placeholder="ex: dZgVxmf6jkA ou https://youtu.be/..."
                   value="${ex.youtube||''}"
                   oninput="CustomExercices._previewYoutube(this.value)"/>
            <div style="font-size:.62rem;color:var(--text-muted);
                        margin-bottom:8px">
              💡 Colle l'URL YouTube — l'ID sera extrait automatiquement
            </div>

            <!-- Preview miniature -->
            <div id="yt-preview"
                 style="display:${ex.youtube?'block':'none'}">
              <div style="position:relative;padding-bottom:56.25%;
                          height:0;overflow:hidden;border-radius:10px;
                          background:#000">
                <img id="yt-preview-img"
                     src="${ex.youtube
                       ?'https://img.youtube.com/vi/'+ex.youtube+'/hqdefault.jpg'
                       :''}"
                     style="position:absolute;top:0;left:0;
                            width:100%;height:100%;object-fit:cover"
                     onerror="this.parentElement.parentElement.style.display='none'"/>
                <div style="position:absolute;bottom:8px;right:8px;
                            padding:3px 8px;background:rgba(0,0,0,0.7);
                            border-radius:99px;font-size:.6rem;
                            color:white">
                  ✅ Vidéo détectée
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ─── PHOTO PERSO ─── -->
        <div class="card mb-md">
          <div class="card-label">📸 Photo personnelle</div>
          <div style="margin-top:10px">

            <!-- Upload -->
            <label for="ex-photo-input"
                   style="display:flex;align-items:center;gap:10px;
                          padding:12px 14px;cursor:pointer;
                          background:rgba(255,255,255,0.04);
                          border:1px dashed rgba(255,255,255,0.15);
                          border-radius:var(--radius-md);
                          transition:all .2s"
                   onmouseenter="this.style.borderColor='var(--fd-indigo)'"
                   onmouseleave="this.style.borderColor='rgba(255,255,255,0.15)'">
              <span style="font-size:1.5rem">📸</span>
              <div>
                <div style="font-size:.82rem;font-weight:700">
                  Choisir une photo
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  JPG, PNG, WebP · Max 5MB
                </div>
              </div>
            </label>
            <input type="file" id="ex-photo-input"
                   accept="image/*"
                   style="display:none"
                   onchange="CustomExercices._previewPhoto(this)"/>

            <!-- Preview photo -->
            <div id="photo-preview"
                 style="margin-top:10px;
                        display:${ex.photo?'block':'none'}">
              <div style="position:relative;
                          height:180px;border-radius:10px;
                          overflow:hidden;background:#000">
                <img id="photo-preview-img"
                     src="${ex.photo||''}"
                     style="width:100%;height:100%;
                            object-fit:cover"
                     onerror="this.parentElement.parentElement.style.display='none'"/>
                <button onclick="CustomExercices._supprimerPhoto()"
                        style="position:absolute;top:8px;right:8px;
                               padding:4px 10px;
                               background:rgba(200,50,50,0.8);
                               border:none;border-radius:99px;
                               font-size:.65rem;color:white;
                               cursor:pointer">
                  🗑️ Supprimer
                </button>
              </div>
            </div>

            <input type="hidden" id="ex-photo"
                   value="${ex.photo||''}"/>
          </div>
        </div>

        <!-- ─── SÉRIES PAR DÉFAUT ─── -->
        <div class="card mb-md">
          <div class="card-label">⚙️ Paramètres par défaut</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                      gap:8px;margin-top:10px">
            <div>
              <div class="input-label">Séries</div>
              <input class="input" id="ex-series"
                     type="number" min="1" max="10"
                     value="${ex.series||3}"/>
            </div>
            <div>
              <div class="input-label">Reps</div>
              <input class="input" id="ex-reps"
                     placeholder="10-12"
                     value="${ex.reps||'10-12'}"/>
            </div>
            <div>
              <div class="input-label">Repos (s)</div>
              <input class="input" id="ex-repos"
                     type="number" min="30" max="300"
                     value="${ex.repos||75}"/>
            </div>
          </div>
        </div>

        <!-- Boutons -->
        <div style="display:grid;grid-template-columns:1fr 2fr;
                    gap:10px;padding-bottom:8px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            ✕ Annuler
          </button>
          <button onclick="CustomExercices._sauvegarderFormulaire('${ref||''}')"
                  class="btn-primary" style="font-size:.88rem">
            ${isEdit ? '✅ Sauvegarder' : '✅ Créer l\'exercice'}
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
  _selEmoji(val, btn) {
    document.querySelectorAll('[id^="emoji-btn-"]').forEach(b => {
      b.style.background  = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
    });
    btn.style.background  = 'rgba(75,75,249,0.25)';
    btn.style.borderColor = 'var(--fd-indigo)';
    const input = document.getElementById('ex-emoji');
    if (input) input.value = val;
    Utils.vibrer();
  },

  _selDiff(val, btn) {
    document.querySelectorAll('[id^="diff-btn-"]').forEach(b => {
      b.style.background  = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
      b.style.color       = 'var(--text-muted)';
    });
    btn.style.background  = 'rgba(249,239,119,0.2)';
    btn.style.borderColor = 'var(--fd-lemon)';
    btn.style.color       = 'var(--fd-lemon)';
    const input = document.getElementById('ex-difficulte');
    if (input) input.value = val;
    Utils.vibrer();
  },

  // ════════════════════════════════════════════════════════
  // PREVIEW YOUTUBE
  // ════════════════════════════════════════════════════════
  _previewYoutube(val) {
    const id = this._extraireYoutubeId(val);
    const preview = document.getElementById('yt-preview');
    const img     = document.getElementById('yt-preview-img');

    if (id && preview && img) {
      img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      preview.style.display = 'block';
    } else if (preview) {
      preview.style.display = 'none';
    }
  },

  _extraireYoutubeId(val) {
    if (!val) return null;
    val = val.trim();

    // ID direct (11 chars alphanumériques + - _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(val)) return val;

    // URLs YouTube
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ];

    for (const p of patterns) {
      const m = val.match(p);
      if (m) return m;
    }
    return null;
  },

  // ════════════════════════════════════════════════════════
  // PHOTO UPLOAD
  // ════════════════════════════════════════════════════════
  _previewPhoto(input) {
    const file = input.files;
    if (!file) return;

    // Vérifier taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Utils.toast('Photo trop lourde ! Max 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;

      // Compresser si > 1MB
      if (file.size > 1024 * 1024) {
        this._compresserImage(base64, (compressed) => {
          this._setPhotoPreview(compressed);
        });
      } else {
        this._setPhotoPreview(base64);
      }
    };
    reader.readAsDataURL(file);
  },

  _setPhotoPreview(base64) {
    const preview    = document.getElementById('photo-preview');
    const previewImg = document.getElementById('photo-preview-img');
    const input      = document.getElementById('ex-photo');

    if (preview)    preview.style.display = 'block';
    if (previewImg) previewImg.src         = base64;
    if (input)      input.value            = base64;
  },

  _supprimerPhoto() {
    const preview = document.getElementById('photo-preview');
    const input   = document.getElementById('ex-photo');
    if (preview) preview.style.display = 'none';
    if (input)   input.value           = '';
  },

  // ✅ Compresser image via Canvas
  _compresserImage(base64, callback, qualite = 0.7) {
    const img    = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX    = 800;
      let w = img.width, h = img.height;

      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }

      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', qualite));
    };
    img.src = base64;
  },

  // ════════════════════════════════════════════════════════
  // SAUVEGARDER FORMULAIRE
  // ════════════════════════════════════════════════════════
  _sauvegarderFormulaire(refExistant) {
    const nom = document.getElementById('ex-nom')?.value?.trim();
    if (!nom) {
      Utils.toast('Entre le nom de l\'exercice !', 'error');
      document.getElementById('ex-nom')?.focus();
      return;
    }

    const muscle = document.getElementById('ex-muscle')?.value;
    if (!muscle) {
      Utils.toast('Choisis un muscle !', 'error');
      return;
    }

    // ✅ Extraire l'ID YouTube si URL
    const ytRaw  = document.getElementById('ex-youtube')?.value?.trim();
    const ytId   = ytRaw ? this._extraireYoutubeId(ytRaw) : null;

    const conseils = (document.getElementById('ex-conseils')?.value || '')
      .split('\n')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const exercice = {
      ref:         refExistant || null,
      nom,
      muscle,
      groupe:      document.getElementById('ex-groupe')?.value      || 'push',
      equipement:  document.getElementById('ex-equipement')?.value  || 'Haltères',
      emoji:       document.getElementById('ex-emoji')?.value       || '💪',
      difficulte:  parseInt(document.getElementById('ex-difficulte')?.value) || 2,
      description: document.getElementById('ex-description')?.value?.trim() || '',
      conseils,
      youtube:     ytId || null,
      photo:       document.getElementById('ex-photo')?.value       || null,
      series:      parseInt(document.getElementById('ex-series')?.value) || 3,
      reps:        document.getElementById('ex-reps')?.value         || '10-12',
      repos:       parseInt(document.getElementById('ex-repos')?.value) || 75
    };

    // Sauvegarder
    const saved = this.sauvegarder(exercice);

    // Fermer modal
    document.getElementById('modal-info')?.classList.add('hidden');

    // Feedback
    Utils.toast(
      `✅ Exercice "${saved.nom}" ${refExistant ? 'modifié' : 'créé'} !`,
      'success', 3000
    );
    Utils.vibrerSuccess();

    // XP
    try {
      if (!refExistant) {
        Gamification.ajouterXP(50, 'Exercice perso créé');
      }
    } catch(e) {}

    // Re-render
    setTimeout(() => {
      const container = document.getElementById('page-galerie')
        || document.querySelector('.page.active');
      if (container) this.render(container);
    }, 200);
  },

  // ════════════════════════════════════════════════════════
  // SUPPRIMER
  // ════════════════════════════════════════════════════════
  async _confirmerSuppression(ref) {
    const ex = this.get(ref);
    if (!ex) return;

    const ok = await Utils.confirmer(
      `🗑️ Supprimer "${ex.nom}" ?`,
      'Cet exercice sera retiré de ta bibliothèque.'
    );
    if (!ok) return;

    this.supprimer(ref);
    Utils.toast(`🗑️ "${ex.nom}" supprimé`, 'info', 2000);

    // Re-render
    const container = document.getElementById('page-galerie')
      || document.querySelector('.page.active');
    if (container) this.render(container);
  },

  // ════════════════════════════════════════════════════════
  // AJOUTER À UNE SÉANCE
  // ════════════════════════════════════════════════════════
  _ajouterASeance(ref) {
    const modal   = document.getElementById('modal-info');
    const content = document.getElementById('modal-info-content');
    if (!modal || !content) return;

    const ex = this.get(ref);
    if (!ex) return;

    let seances = [];
    try { seances = Programme.getAllSeances(); } catch(e) {}

    content.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:16px;color:white">
          📅 Ajouter à une séance
        </div>

        <div style="padding:12px 14px;margin-bottom:16px;
                    background:rgba(75,75,249,0.08);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:var(--radius-lg);
                    display:flex;align-items:center;gap:10px">
          <span style="font-size:1.5rem">${ex.emoji}</span>
          <div>
            <div style="font-size:.88rem;font-weight:700">${ex.nom}</div>
            <div style="font-size:.65rem;color:var(--fd-mint)">${ex.muscle}</div>
          </div>
        </div>

        <!-- Config série -->
        <div class="card mb-md">
          <div class="card-label">⚙️ Configuration</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;
                      gap:8px;margin-top:10px">
            <div>
              <div class="input-label">Séries</div>
              <input class="input" id="add-series"
                     type="number" min="1" max="10"
                     value="${ex.series||3}"/>
            </div>
            <div>
              <div class="input-label">Reps</div>
              <input class="input" id="add-reps"
                     value="${ex.reps||'10-12'}"/>
            </div>
            <div>
              <div class="input-label">Repos (s)</div>
              <input class="input" id="add-repos"
                     type="number" value="${ex.repos||75}"/>
            </div>
          </div>
        </div>

        <!-- Séances -->
        <div class="card mb-md">
          <div class="card-label">💪 Choisir une séance</div>
          <div style="display:flex;flex-direction:column;
                      gap:6px;margin-top:10px">
            ${seances.length === 0 ? `
              <div style="text-align:center;padding:20px;
                          color:var(--text-muted);font-size:.82rem">
                Aucune séance disponible
              </div>` :
              seances.map(s=>`
                <button onclick="CustomExercices._confirmerAjoutSeance(
                          '${ref}','${s.id}')"
                        style="display:flex;align-items:center;gap:12px;
                               padding:12px 14px;text-align:left;
                               background:rgba(255,255,255,0.04);
                               border:1px solid rgba(255,255,255,0.08);
                               border-radius:var(--radius-lg);
                               cursor:pointer;width:100%;
                               font-family:inherit;color:white;
                               transition:all .2s"
                        onmouseenter="this.style.background='rgba(75,75,249,0.1)';
                                      this.style.borderColor='rgba(75,75,249,0.3)'"
                        onmouseleave="this.style.background='rgba(255,255,255,0.04)';
                                      this.style.borderColor='rgba(255,255,255,0.08)'">
                  <span style="font-size:1.3rem">${s.emoji}</span>
                  <div style="flex:1">
                    <div style="font-size:.85rem;font-weight:700">
                      ${s.nom}
                    </div>
                    <div style="font-size:.62rem;
                                color:var(--text-muted);margin-top:2px">
                      ~${s.duree_estimee}min
                      · ${s.exercices?.length||0} exercices
                    </div>
                  </div>
                  <span style="color:var(--fd-indigo);font-size:.9rem">+</span>
                </button>`).join('')}
          </div>
        </div>

        <button onclick="document.getElementById('modal-info')
                          .classList.add('hidden')"
                class="btn-secondary" style="width:100%;font-size:.82rem">
          ✕ Annuler
        </button>

      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _confirmerAjoutSeance(exRef, seanceId) {
    try {
      const series = parseInt(document.getElementById('add-series')?.value)||3;
      const reps   = document.getElementById('add-reps')?.value||'10-12';
      const repos  = parseInt(document.getElementById('add-repos')?.value)||75;

      // ✅ Ajouter l'exercice à la séance
      Programme.ajouterExerciceASeance(seanceId, {
        ref:    exRef,
        series, reps, repos
      });

      document.getElementById('modal-info')?.classList.add('hidden');
      Utils.toast('✅ Exercice ajouté à la séance !', 'success', 2500);
      Utils.vibrerSuccess();

    } catch(e) {
      // ✅ Fallback si Programme.ajouterExerciceASeance n'existe pas
      const seances = Utils.storage.get('ft_seances_custom', {});
      if (!seances[seanceId]) seances[seanceId] = [];
      seances[seanceId].push({ ref: exRef });
      Utils.storage.set('ft_seances_custom', seances);

      document.getElementById('modal-info')?.classList.add('hidden');
      Utils.toast('✅ Exercice sauvegardé !', 'success', 2500);
    }
  },

  // ════════════════════════════════════════════════════════
  // IMPORT / EXPORT
  // ════════════════════════════════════════════════════════
  _exporter() {
    const tous = this.getAll();
    if (Object.keys(tous).length === 0) {
      Utils.toast('Aucun exercice à exporter', 'info');
      return;
    }

    const blob = new Blob(
      [JSON.stringify(tous, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `exercices-perso-${Utils.aujourd_hui()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    Utils.toast('📤 Exercices exportés !', 'success', 2000);
  },

  _importerFichier() {
    const input = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = e.target.files;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          let count  = 0;

          Object.values(data).forEach(ex => {
            if (ex.nom && ex.muscle) {
              this.sauvegarder(ex);
              count++;
            }
          });

          Utils.toast(
            `✅ ${count} exercice${count>1?'s':''} importé${count>1?'s':''}`,
            'success', 3000
          );

          // Re-render
          const container = document.querySelector('.page.active');
          if (container) this.render(container);

        } catch(err) {
          Utils.toast('❌ Fichier invalide', 'error');
        }
      };
      reader.readAsText(file);
    };

    input.click();
  }
};

// ✅ Injecter au démarrage
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try { CustomExercices.injecterTous(); } catch(e) {}
  }, 1000);
});

window.CustomExercices = CustomExercices;
console.log('✅ CustomExercices.js v1.0 chargé');
