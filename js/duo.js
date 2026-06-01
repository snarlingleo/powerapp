/* ============================================================
   PowerApp — duo.js v1.0
   ✅ Entraînement en duo
   ✅ Comparaison en temps réel
   ✅ Défis entre amis
   ✅ Partage de programmes
   ✅ Chat workout
   ============================================================ */

'use strict';

const Duo = {

  CLE_PROFIL:    'ft_duo_profil',
  CLE_AMIS:      'ft_duo_amis',
  CLE_DEFIS:     'ft_duo_defis',
  CLE_MESSAGES:  'ft_duo_messages',
  CLE_SEANCES:   'ft_duo_seances_partagees',

  // ════════════════════════════════════════════════════════
  // RENDER PAGE PRINCIPALE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const amis    = this.getAmis();
    const defis   = this.getDefis();
    const profil  = this.getProfilDuo();
    const actifs  = defis.filter(d => !d.termine);
    const termines= defis.filter(d =>  d.termine);

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          👥 MODE DUO
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Entraînement en duo
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Défie tes amis et progresse ensemble
        </p>
      </div>

      <!-- Mon profil Duo -->
      ${this._renderProfilDuo(profil)}

      <!-- Tabs -->
      <div style="display:flex;gap:0;
                  background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:4px;margin-bottom:16px">
        ${[
          { id:'amis',    label:'👥 Amis',     nb:amis.length    },
          { id:'defis',   label:'⚔️ Défis',    nb:actifs.length  },
          { id:'compare', label:'📊 Stats',    nb:0              },
          { id:'partage', label:'📤 Partage',  nb:0              }
        ].map((t,i) => `
          <button id="duo-tab-${t.id}"
                  onclick="Duo._switchTab('${t.id}')"
                  style="flex:1;padding:8px 4px;
                         border-radius:var(--radius-md);
                         border:none;cursor:pointer;
                         font-size:.65rem;font-weight:700;
                         transition:all .2s;
                         background:${i===0
                           ?'rgba(75,75,249,0.2)'
                           :'transparent'};
                         color:${i===0
                           ?'var(--fd-indigo)'
                           :'var(--text-muted)'};
                         font-family:inherit">
            ${t.label}
            ${t.nb > 0 ? `
              <span style="display:inline-flex;align-items:center;
                           justify-content:center;
                           width:16px;height:16px;
                           background:var(--fd-indigo);
                           border-radius:50%;font-size:.55rem;
                           color:white;margin-left:3px">
                ${t.nb}
              </span>` : ''}
          </button>`).join('')}
      </div>

      <!-- Contenu tabs -->
      <div id="duo-tab-content">
        ${this._renderTabAmis(amis)}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // PROFIL DUO
  // ════════════════════════════════════════════════════════
  _renderProfilDuo(profil) {
    let myProfil = {};
    let xp       = { total:0, niveau:{ emoji:'💪', numero:1 } };
    let streak   = { count:0 };
    try { myProfil = Tracker.getProfil(); } catch(e) {}
    try { xp       = Gamification.getXP(); } catch(e) {}
    try { streak   = Tracker.getStreak();  } catch(e) {}

    const code = profil.code || this._genererCode();

    return `
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.05));
                  border:1px solid rgba(75,75,249,0.3);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:16px;
                  position:relative;overflow:hidden">

        <div style="position:absolute;top:-30px;right:-20px;
                    width:120px;height:120px;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2),transparent 70%);
                    pointer-events:none"></div>

        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:10px">
          👤 Mon profil Duo
        </div>

        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:52px;height:52px;border-radius:50%;
                      background:rgba(75,75,249,0.15);
                      border:2px solid rgba(75,75,249,0.4);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.6rem;
                      flex-shrink:0">
            ${myProfil.avatar || '💪'}
          </div>
          <div style="flex:1">
            <div style="font-size:1rem;font-weight:800">
              ${myProfil.nom || 'Athlète'}
            </div>
            <div style="font-size:.65rem;color:var(--fd-indigo);
                        margin-top:2px">
              ${xp.niveau.emoji} Niv.${xp.niveau.numero}
              · ${xp.total} XP
              · 🔥 ${streak.count}j
            </div>
          </div>
          <!-- Code partage -->
          <div style="text-align:center;flex-shrink:0">
            <div style="font-size:.55rem;color:var(--text-muted);
                        margin-bottom:3px">MON CODE</div>
            <div style="font-family:'Orbitron',monospace;
                        font-size:1rem;font-weight:900;
                        color:var(--fd-lemon);
                        letter-spacing:3px;
                        padding:6px 10px;
                        background:rgba(249,239,119,0.1);
                        border:1px solid rgba(249,239,119,0.3);
                        border-radius:8px;cursor:pointer"
                 onclick="Duo._copierCode('${code}')"
                 title="Cliquer pour copier">
              ${code}
            </div>
            <div style="font-size:.52rem;color:var(--text-muted);
                        margin-top:3px">
              Tap pour copier
            </div>
          </div>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // TAB AMIS
  // ════════════════════════════════════════════════════════
  _renderTabAmis(amis) {
    return `
      <!-- Ajouter un ami -->
      <div class="card mb-md">
        <div class="card-label">➕ Ajouter un ami</div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <input class="input" id="duo-code-input"
                 placeholder="Entre le code de ton ami..."
                 maxlength="6"
                 style="flex:1;text-transform:uppercase;
                        font-family:'Orbitron',monospace;
                        letter-spacing:3px;font-size:.9rem"
                 oninput="this.value=this.value.toUpperCase()"/>
          <button onclick="Duo._ajouterAmi()"
                  class="btn-primary"
                  style="padding:10px 16px;font-size:.8rem;
                         white-space:nowrap">
            ➕ Ajouter
          </button>
        </div>
        <div style="font-size:.62rem;color:var(--text-muted);
                    margin-top:6px">
          💡 Partage ton code pour que tes amis te trouvent
        </div>
      </div>

      <!-- Liste amis -->
      ${amis.length === 0 ? `
        <div style="text-align:center;padding:32px 20px;
                    background:rgba(255,255,255,0.03);
                    border:1px dashed rgba(255,255,255,0.1);
                    border-radius:var(--radius-xl)">
          <div style="font-size:2.5rem;margin-bottom:10px">👥</div>
          <div style="font-size:.9rem;font-weight:700;margin-bottom:6px">
            Aucun ami pour l'instant
          </div>
          <div style="font-size:.75rem;color:var(--text-muted);
                      line-height:1.5">
            Entre le code d'un ami pour commencer<br>
            à vous challenger mutuellement !
          </div>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:10px">
          ${amis.map(ami => this._renderCarteAmi(ami)).join('')}
        </div>`}
    `;
  },

  // ════════════════════════════════════════════════════════
  // CARTE AMI
  // ════════════════════════════════════════════════════════
  _renderCarteAmi(ami) {
    const estEnLigne = ami.lastSeen
      && (Date.now() - ami.lastSeen) < 15 * 60 * 1000; // 15 min

    const deltaXP = (ami.xp || 0) - (this._getMonXP());
    const deltaVol= (ami.volumeSemaine || 0) - this._getMonVolumeSemaine();

    return `
      <div style="background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  overflow:hidden">

        <!-- Header ami -->
        <div style="padding:14px;
                    display:flex;align-items:center;gap:12px">

          <!-- Avatar + badge en ligne -->
          <div style="position:relative;flex-shrink:0">
            <div style="width:48px;height:48px;border-radius:50%;
                        background:rgba(75,75,249,0.12);
                        border:2px solid rgba(75,75,249,0.3);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.5rem">
              ${ami.avatar || '💪'}
            </div>
            <!-- Badge en ligne -->
            <div style="position:absolute;bottom:0;right:0;
                        width:12px;height:12px;border-radius:50%;
                        background:${estEnLigne
                          ?'var(--fd-mint)':'rgba(255,255,255,0.2)'};
                        border:2px solid var(--bg-card);
                        ${estEnLigne
                          ?'box-shadow:0 0 6px var(--fd-mint)':''}">
            </div>
          </div>

          <!-- Infos ami -->
          <div style="flex:1;min-width:0">
            <div style="font-size:.9rem;font-weight:800;
                        display:flex;align-items:center;gap:6px">
              ${ami.nom}
              ${estEnLigne ? `
                <span style="font-size:.55rem;padding:1px 6px;
                             background:rgba(139,240,187,0.15);
                             border:1px solid rgba(139,240,187,0.3);
                             border-radius:99px;color:var(--fd-mint)">
                  En ligne
                </span>` : ''}
            </div>
            <div style="font-size:.65rem;color:var(--text-muted);
                        margin-top:2px">
              Niv.${ami.niveau||1} · ${ami.xp||0} XP
            </div>
          </div>

          <!-- Comparaison XP -->
          <div style="text-align:center;flex-shrink:0">
            <div style="font-size:.75rem;font-weight:800;
                        color:${deltaXP <= 0
                          ?'var(--fd-mint)':'var(--fd-coral)'}">
              ${deltaXP <= 0 ? '▲' : '▼'}
              ${Math.abs(deltaXP)} XP
            </div>
            <div style="font-size:.55rem;color:var(--text-muted)">
              ${deltaXP <= 0 ? 'Tu mènes !' : 'Il mène !'}
            </div>
          </div>
        </div>

        <!-- Stats comparées -->
        <div style="padding:0 14px 12px;
                    display:grid;grid-template-columns:1fr 1fr 1fr;
                    gap:6px">
          ${[
            {
              label:'Volume sem.',
              moi: Utils.formatVolume(this._getMonVolumeSemaine()),
              lui: Utils.formatVolume(ami.volumeSemaine||0),
              jeGagne: this._getMonVolumeSemaine() >= (ami.volumeSemaine||0)
            },
            {
              label:'Séances sem.',
              moi: this._getMesSeancesSemaine(),
              lui: ami.seancesSemaine||0,
              jeGagne: this._getMesSeancesSemaine() >= (ami.seancesSemaine||0)
            },
            {
              label:'Streak',
              moi: this._getMonStreak(),
              lui: ami.streak||0,
              jeGagne: this._getMonStreak() >= (ami.streak||0)
            }
          ].map(s=>`
            <div style="background:rgba(255,255,255,0.03);
                        border:1px solid rgba(255,255,255,0.06);
                        border-radius:var(--radius-md);
                        padding:8px 6px;text-align:center">
              <div style="font-size:.55rem;color:var(--text-muted);
                          margin-bottom:4px;text-transform:uppercase">
                ${s.label}
              </div>
              <div style="display:flex;align-items:center;
                          justify-content:space-between;gap:4px">
                <div style="font-size:.72rem;font-weight:800;
                            color:${s.jeGagne
                              ?'var(--fd-mint)':'var(--text-secondary)'};
                            flex:1;text-align:center">
                  ${s.moi}
                </div>
                <div style="font-size:.55rem;color:var(--text-muted)">
                  vs
                </div>
                <div style="font-size:.72rem;font-weight:800;
                            color:${!s.jeGagne
                              ?'var(--fd-coral)':'var(--text-secondary)'};
                            flex:1;text-align:center">
                  ${s.lui}
                </div>
              </div>
              <div style="display:flex;justify-content:space-between;
                          font-size:.5rem;color:var(--text-muted);
                          margin-top:2px">
                <span>Moi</span><span>${ami.nom.split(' ')[0]}</span>
              </div>
            </div>`).join('')}
        </div>

        <!-- Actions -->
        <div style="padding:0 14px 14px;
                    display:flex;gap:6px;flex-wrap:wrap">
          <button onclick="Duo._lancerDefi('${ami.id}')"
                  style="flex:1;padding:8px;
                         background:rgba(75,75,249,0.12);
                         border:1px solid rgba(75,75,249,0.25);
                         border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-indigo);cursor:pointer">
            ⚔️ Défier
          </button>
          <button onclick="Duo._ouvrirChat('${ami.id}')"
                  style="flex:1;padding:8px;
                         background:rgba(139,240,187,0.08);
                         border:1px solid rgba(139,240,187,0.2);
                         border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-mint);cursor:pointer">
            💬 Chat
          </button>
          <button onclick="Duo._partagerSeance('${ami.id}')"
                  style="flex:1;padding:8px;
                         background:rgba(249,239,119,0.08);
                         border:1px solid rgba(249,239,119,0.2);
                         border-radius:var(--radius-full);
                         font-size:.72rem;font-weight:700;
                         color:var(--fd-lemon);cursor:pointer">
            📤 Partager séance
          </button>
          <button onclick="Duo._supprimerAmi('${ami.id}')"
                  style="padding:8px 12px;
                         background:rgba(255,141,150,0.06);
                         border:1px solid rgba(255,141,150,0.15);
                         border-radius:var(--radius-full);
                         font-size:.72rem;
                         color:var(--fd-coral);cursor:pointer">
            🗑️
          </button>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // TAB DÉFIS
  // ════════════════════════════════════════════════════════
  _renderTabDefis(defis) {
    const actifs   = defis.filter(d => !d.termine);
    const termines = defis.filter(d =>  d.termine);

    return `
      <!-- Créer un défi -->
      <button onclick="Duo._creerDefi()"
              class="btn-primary mb-md"
              style="width:100%;font-size:.88rem">
        ⚔️ Nouveau défi
      </button>

      <!-- Défis actifs -->
      ${actifs.length > 0 ? `
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:8px">
          ⚡ En cours (${actifs.length})
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;
                    margin-bottom:16px">
          ${actifs.map(d => this._renderCarteDefi(d)).join('')}
        </div>` : `
        <div style="text-align:center;padding:24px;
                    background:rgba(255,255,255,0.03);
                    border:1px dashed rgba(255,255,255,0.1);
                    border-radius:var(--radius-lg);margin-bottom:16px">
          <div style="font-size:2rem;margin-bottom:8px">⚔️</div>
          <div style="font-size:.82rem;color:var(--text-muted)">
            Aucun défi en cours.<br>Lance un défi à un ami !
          </div>
        </div>`}

      <!-- Défis terminés -->
      ${termines.length > 0 ? `
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:8px">
          ✅ Terminés (${termines.length})
        </div>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${termines.slice(0,3).map(d => this._renderCarteDefi(d, true)).join('')}
        </div>` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // CARTE DÉFI
  // ════════════════════════════════════════════════════════
  _renderCarteDefi(defi, termine = false) {
    const ami       = this.getAmis().find(a => a.id === defi.amiId);
    const nomAmi    = ami?.nom || 'Ami';
    const pctMoi    = Math.min(100,
      Math.round((defi.progressionMoi/Math.max(defi.cible,1))*100));
    const pctAmi    = Math.min(100,
      Math.round((defi.progressionAmi/Math.max(defi.cible,1))*100));
    const jeGagne   = defi.progressionMoi >= defi.progressionAmi;

    const TYPES_DEFIS = {
      volume:   { emoji:'📦', label:'Volume total' },
      seances:  { emoji:'🏋️', label:'Nombre de séances' },
      streak:   { emoji:'🔥', label:'Streak de jours' },
      poids:    { emoji:'🏆', label:'Charge maximale' },
      reps:     { emoji:'🔁', label:'Répétitions totales' }
    };
    const typeInfo = TYPES_DEFIS[defi.type] || TYPES_DEFIS.seances;

    return `
      <div style="background:${termine
                    ?'rgba(255,255,255,0.03)'
                    :'rgba(75,75,249,0.08)'};
                  border:1px solid ${termine
                    ?'rgba(255,255,255,0.08)'
                    :'rgba(75,75,249,0.25)'};
                  border-radius:var(--radius-lg);
                  padding:14px;
                  ${termine?'opacity:0.7':''}">

        <!-- Header défi -->
        <div style="display:flex;align-items:center;
                    justify-content:space-between;margin-bottom:10px">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:1.2rem">${typeInfo.emoji}</span>
            <div>
              <div style="font-size:.82rem;font-weight:800">
                ${defi.titre || typeInfo.label}
              </div>
              <div style="font-size:.62rem;color:var(--text-muted)">
                vs ${nomAmi}
                ${defi.dateFin ? `· Fin : ${defi.dateFin}` : ''}
              </div>
            </div>
          </div>
          ${termine ? `
            <div style="font-size:.75rem;font-weight:800;
                        color:${defi.gagnant==='moi'
                          ?'var(--fd-lemon)':'var(--text-muted)'}">
              ${defi.gagnant === 'moi' ? '🏆 Gagné !' : '💪 Perdu'}
            </div>` : `
            <div style="font-size:.65rem;font-weight:700;
                        color:${jeGagne
                          ?'var(--fd-mint)':'var(--fd-coral)'}">
              ${jeGagne ? '▲ Tu mènes !' : '▼ Il mène !'}
            </div>`}
        </div>

        <!-- Barres progression -->
        <div style="display:flex;flex-direction:column;gap:6px">

          <!-- Moi -->
          <div>
            <div style="display:flex;justify-content:space-between;
                        font-size:.62rem;margin-bottom:3px">
              <span style="color:var(--fd-indigo);font-weight:700">
                Moi
              </span>
              <span style="color:var(--text-muted)">
                ${defi.progressionMoi} / ${defi.cible}
                · ${pctMoi}%
              </span>
            </div>
            <div style="height:8px;background:rgba(255,255,255,0.06);
                        border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${pctMoi}%;
                          background:var(--fd-indigo);
                          border-radius:99px;
                          box-shadow:0 0 6px var(--fd-indigo);
                          transition:width .5s">
              </div>
            </div>
          </div>

          <!-- Ami -->
          <div>
            <div style="display:flex;justify-content:space-between;
                        font-size:.62rem;margin-bottom:3px">
              <span style="color:var(--fd-coral);font-weight:700">
                ${nomAmi}
              </span>
              <span style="color:var(--text-muted)">
                ${defi.progressionAmi} / ${defi.cible}
                · ${pctAmi}%
              </span>
            </div>
            <div style="height:8px;background:rgba(255,255,255,0.06);
                        border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${pctAmi}%;
                          background:var(--fd-coral);
                          border-radius:99px;
                          transition:width .5s">
              </div>
            </div>
          </div>
        </div>

        <!-- Mise en jeu -->
        ${defi.mise ? `
          <div style="margin-top:10px;padding:6px 10px;
                      background:rgba(249,239,119,0.08);
                      border:1px solid rgba(249,239,119,0.2);
                      border-radius:var(--radius-sm);
                      font-size:.68rem;color:var(--fd-lemon)">
            🎯 Mise : ${defi.mise}
          </div>` : ''}
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // TAB COMPARAISON
  // ════════════════════════════════════════════════════════
  _renderTabCompare(amis) {
    if (amis.length === 0) {
      return `
        <div style="text-align:center;padding:32px 20px;
                    background:rgba(255,255,255,0.03);
                    border:1px dashed rgba(255,255,255,0.1);
                    border-radius:var(--radius-xl)">
          <div style="font-size:2.5rem;margin-bottom:10px">📊</div>
          <div style="font-size:.82rem;color:var(--text-muted)">
            Ajoute des amis pour voir les comparaisons
          </div>
        </div>`;
    }

    const monVol     = this._getMonVolumeSemaine();
    const monSeances = this._getMesSeancesSemaine();
    const monStreak  = this._getMonStreak();
    const monXP      = this._getMonXP();

    let monProfil = { nom:'Moi', avatar:'💪' };
    try { monProfil = Tracker.getProfil(); } catch(e) {}

    // ✅ Leaderboard
    const classement = [
      {
        nom:     monProfil.nom,
        avatar:  monProfil.avatar || '💪',
        xp:      monXP,
        volume:  monVol,
        seances: monSeances,
        streak:  monStreak,
        estMoi:  true
      },
      ...amis.map(a => ({
        nom:     a.nom,
        avatar:  a.avatar || '💪',
        xp:      a.xp || 0,
        volume:  a.volumeSemaine || 0,
        seances: a.seancesSemaine || 0,
        streak:  a.streak || 0,
        estMoi:  false
      }))
    ].sort((a, b) => b.xp - a.xp);

    return `
      <!-- Leaderboard XP -->
      <div class="card mb-md">
        <div class="card-label">⭐ Classement XP</div>
        <div style="margin-top:10px">
          ${classement.map((p, i) => `
            <div style="display:flex;align-items:center;gap:10px;
                        padding:10px;margin-bottom:6px;
                        background:${p.estMoi
                          ?'rgba(75,75,249,0.12)'
                          :'rgba(255,255,255,0.03)'};
                        border:1px solid ${p.estMoi
                          ?'rgba(75,75,249,0.3)'
                          :'rgba(255,255,255,0.06)'};
                        border-radius:var(--radius-lg)">
              <!-- Rang -->
              <div style="width:28px;height:28px;border-radius:50%;
                          flex-shrink:0;font-size:.75rem;
                          font-weight:800;
                          display:flex;align-items:center;
                          justify-content:center;
                          background:${i===0?'var(--fd-lemon)'
                            :i===1?'rgba(255,255,255,0.2)'
                            :i===2?'rgba(255,141,150,0.4)'
                            :'rgba(255,255,255,0.08)'};
                          color:${i===0?'#09092d':'white'}">
                ${i===0?'🥇':i===1?'🥈':i===2?'🥉':i+1}
              </div>
              <!-- Avatar -->
              <span style="font-size:1.3rem">${p.avatar}</span>
              <!-- Nom -->
              <div style="flex:1">
                <div style="font-size:.85rem;font-weight:700;
                            color:${p.estMoi
                              ?'var(--fd-indigo)':'white'}">
                  ${p.nom}
                  ${p.estMoi
                    ?'<span style="font-size:.55rem;padding:1px 5px;background:rgba(75,75,249,0.2);border:1px solid rgba(75,75,249,0.3);border-radius:99px;color:var(--fd-indigo);margin-left:4px">Toi</span>'
                    :''}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  🔥 ${p.streak}j · 🏋️ ${p.seances} séances
                </div>
              </div>
              <!-- XP -->
              <div style="text-align:right;flex-shrink:0">
                <div style="font-size:.88rem;font-weight:800;
                            color:var(--fd-lemon)">
                  ${p.xp.toLocaleString('fr-FR')} XP
                </div>
                <div style="font-size:.6rem;color:var(--text-muted)">
                  ${Utils.formatVolume(p.volume)} vol.
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Comparaison détaillée (1er ami) -->
      ${amis.length > 0 ? `
        <div class="card mb-md">
          <div class="card-label">
            📊 Comparaison — ${amis[0].nom}
          </div>
          <div style="margin-top:12px">
            ${[
              { label:'XP Total',     moi:monXP,      lui:amis[0].xp||0,
                unite:'XP',    color:'var(--fd-lavender)' },
              { label:'Volume sem.',  moi:monVol,     lui:amis[0].volumeSemaine||0,
                unite:'kg',    color:'var(--fd-mint)' },
              { label:'Séances sem.', moi:monSeances, lui:amis[0].seancesSemaine||0,
                unite:'',      color:'var(--fd-indigo)' },
              { label:'Streak',       moi:monStreak,  lui:amis[0].streak||0,
                unite:'jours', color:'var(--fd-lemon)' }
            ].map(s => {
              const total  = s.moi + s.lui || 1;
              const pctMoi = Math.round((s.moi/total)*100);
              const pctLui = 100 - pctMoi;
              return `
                <div style="margin-bottom:14px">
                  <div style="display:flex;justify-content:space-between;
                              align-items:center;margin-bottom:6px">
                    <span style="font-size:.7rem;font-weight:700;
                                 color:var(--fd-indigo)">
                      ${monProfil.nom}
                    </span>
                    <span style="font-size:.65rem;font-weight:700;
                                 color:var(--text-muted)">
                      ${s.label}
                    </span>
                    <span style="font-size:.7rem;font-weight:700;
                                 color:var(--fd-coral)">
                      ${amis[0].nom}
                    </span>
                  </div>
                  <!-- Barre double -->
                  <div style="display:flex;gap:2px;height:12px;
                              border-radius:99px;overflow:hidden">
                    <div style="width:${pctMoi}%;
                                background:var(--fd-indigo);
                                border-radius:99px 0 0 99px;
                                min-width:4px"></div>
                    <div style="width:${pctLui}%;
                                background:var(--fd-coral);
                                border-radius:0 99px 99px 0;
                                min-width:4px"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;
                              font-size:.62rem;color:var(--text-muted);
                              margin-top:3px">
                    <span style="font-weight:700;
                                 color:var(--fd-indigo)">
                      ${s.moi} ${s.unite}
                    </span>
                    <span style="font-weight:700;
                                 color:var(--fd-coral)">
                      ${s.lui} ${s.unite}
                    </span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>` : ''}
    `;
  },

  // ════════════════════════════════════════════════════════
  // TAB PARTAGE
  // ════════════════════════════════════════════════════════
  _renderTabPartage(amis) {
    let seances = [];
    try { seances = Programme.getAllSeances(); } catch(e) {}

    const seancesRecues = Utils.storage.get(this.CLE_SEANCES, [])
      .filter(s => s.direction === 'recu');

    return `

      <!-- Envoyer une séance -->
      <div class="card mb-md">
        <div class="card-label">📤 Partager une séance</div>

        ${amis.length === 0 ? `
          <div style="font-size:.78rem;color:var(--text-muted);
                      margin-top:10px;text-align:center;
                      padding:16px">
            Ajoute des amis d'abord !
          </div>` : `
          <div style="margin-top:10px">
            <!-- Choisir séance -->
            <div class="input-label">Séance à partager</div>
            <select class="input mb-sm" id="duo-share-seance">
              ${seances.map(s=>`
                <option value="${s.id}">
                  ${s.emoji} ${s.nom}
                </option>`).join('')}
            </select>

            <!-- Choisir ami -->
            <div class="input-label">Envoyer à</div>
            <select class="input mb-sm" id="duo-share-ami">
              ${amis.map(a=>`
                <option value="${a.id}">${a.nom}</option>`
              ).join('')}
            </select>

            <!-- Message perso -->
            <div class="input-label">Message (optionnel)</div>
            <input class="input mb-md" id="duo-share-msg"
                   placeholder="Essaie cette séance ! 💪"/>

            <button onclick="Duo._envoyerSeance()"
                    class="btn-primary"
                    style="width:100%;font-size:.88rem">
              📤 Envoyer la séance
            </button>
          </div>`}
      </div>

      <!-- Séances reçues -->
      ${seancesRecues.length > 0 ? `
        <div class="card mb-md">
          <div class="card-label">
            📥 Séances reçues (${seancesRecues.length})
          </div>
          <div style="margin-top:10px;
                      display:flex;flex-direction:column;gap:8px">
            ${seancesRecues.map(s=>`
              <div style="display:flex;align-items:center;gap:10px;
                          padding:12px;
                          background:rgba(75,75,249,0.08);
                          border:1px solid rgba(75,75,249,0.2);
                          border-radius:var(--radius-lg)">
                <span style="font-size:1.3rem;flex-shrink:0">
                  ${s.seance?.emoji||'💪'}
                </span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:.85rem;font-weight:700">
                    ${s.seance?.nom||'Séance'}
                  </div>
                  <div style="font-size:.62rem;color:var(--text-muted)">
                    De ${s.expediteur} · ${s.date}
                  </div>
                  ${s.message ? `
                    <div style="font-size:.68rem;
                                color:var(--fd-lavender);
                                margin-top:2px;font-style:italic">
                      "${s.message}"
                    </div>` : ''}
                </div>
                <div style="display:flex;gap:6px;flex-shrink:0">
                  <button onclick="Duo._importerSeanceRecue('${s.id}')"
                          style="padding:6px 10px;
                                 background:rgba(75,75,249,0.15);
                                 border:1px solid rgba(75,75,249,0.3);
                                 border-radius:var(--radius-full);
                                 font-size:.68rem;font-weight:700;
                                 color:var(--fd-indigo);cursor:pointer">
                    ✅ Importer
                  </button>
                  <button onclick="Duo._supprimerSeanceRecue('${s.id}')"
                          style="padding:6px;
                                 background:rgba(255,141,150,0.08);
                                 border:1px solid rgba(255,141,150,0.15);
                                 border-radius:var(--radius-full);
                                 font-size:.68rem;
                                 color:var(--fd-coral);cursor:pointer">
                    ✕
                  </button>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

      <!-- Partager via lien -->
      <div class="card mb-md">
        <div class="card-label">🔗 Partager via lien</div>
        <div style="margin-top:10px">
          <div style="font-size:.75rem;color:var(--text-muted);
                      margin-bottom:10px;line-height:1.5">
            Génère un lien pour partager ta séance ou ton programme
            avec n'importe qui, même sans compte.
          </div>
          <button onclick="Duo._genererLien()"
                  style="width:100%;padding:12px;
                         background:rgba(139,240,187,0.08);
                         border:1px solid rgba(139,240,187,0.2);
                         border-radius:var(--radius-md);
                         font-size:.82rem;font-weight:700;
                         color:var(--fd-mint);cursor:pointer">
            🔗 Générer un lien de partage
          </button>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // SWITCH TABS
  // ════════════════════════════════════════════════════════
  _switchTab(tab) {
    // Update boutons
    ['amis','defis','compare','partage'].forEach(t => {
      const btn = document.getElementById(`duo-tab-${t}`);
      if (!btn) return;
      const actif = t === tab;
      btn.style.background = actif
        ? 'rgba(75,75,249,0.2)' : 'transparent';
      btn.style.color = actif
        ? 'var(--fd-indigo)' : 'var(--text-muted)';
    });

    // Render contenu
    const content = document.getElementById('duo-tab-content');
    if (!content) return;

    const amis  = this.getAmis();
    const defis = this.getDefis();

    switch(tab) {
      case 'amis':
        content.innerHTML = this._renderTabAmis(amis);
        break;
      case 'defis':
        content.innerHTML = this._renderTabDefis(defis);
        break;
      case 'compare':
        content.innerHTML = this._renderTabCompare(amis);
        break;
      case 'partage':
        content.innerHTML = this._renderTabPartage(amis);
        break;
    }
  },

  // ════════════════════════════════════════════════════════
  // AMIS — CRUD
  // ════════════════════════════════════════════════════════
  getAmis() {
    return Utils.storage.get(this.CLE_AMIS, []);
  },

  _ajouterAmi() {
    const input = document.getElementById('duo-code-input');
    const code  = (input?.value || '').trim().toUpperCase();

    if (code.length < 4) {
      Utils.toast('Code trop court !', 'error');
      return;
    }

    const amis = this.getAmis();

    // ✅ Vérifier doublon
    if (amis.find(a => a.code === code)) {
      Utils.toast('Cet ami est déjà dans ta liste !', 'info');
      return;
    }

    // ✅ Vérifier que c'est pas son propre code
    const monCode = this.getProfilDuo().code;
    if (code === monCode) {
      Utils.toast('C\'est ton propre code ! 😄', 'info');
      return;
    }

    // ✅ Simuler récupération profil ami
    // (En prod : appel API)
    const nouvelAmi = {
      id:             'ami_' + Date.now(),
      code,
      nom:            `Athlète ${code}`,
      avatar:         '💪',
      xp:             Math.floor(Math.random() * 5000) + 500,
      niveau:         Math.floor(Math.random() * 10) + 1,
      streak:         Math.floor(Math.random() * 20),
      volumeSemaine:  Math.floor(Math.random() * 15000) + 2000,
      seancesSemaine: Math.floor(Math.random() * 5) + 1,
      lastSeen:       Date.now() - Math.floor(Math.random() * 3600000),
      dateAjout:      Utils.aujourd_hui()
    };

    amis.push(nouvelAmi);
    Utils.storage.set(this.CLE_AMIS, amis);

    if (input) input.value = '';

    Utils.toast(
      `✅ ${nouvelAmi.nom} ajouté ! Code : ${code}`,
      'success', 3000
    );
    Utils.vibrerSuccess();

    // Re-render tab
    const content = document.getElementById('duo-tab-content');
    if (content) {
      content.innerHTML = this._renderTabAmis(this.getAmis());
    }
  },

  async _supprimerAmi(id) {
    const amis = this.getAmis();
    const ami  = amis.find(a => a.id === id);
    if (!ami) return;

    const ok = await Utils.confirmer(
      `Retirer ${ami.nom} ?`,
      'Tes défis avec cet ami seront aussi supprimés.'
    );
    if (!ok) return;

    const nouveaux = amis.filter(a => a.id !== id);
    Utils.storage.set(this.CLE_AMIS, nouveaux);

    Utils.toast(`${ami.nom} retiré`, 'info', 2000);

    const content = document.getElementById('duo-tab-content');
    if (content) {
      content.innerHTML = this._renderTabAmis(this.getAmis());
    }
  },

  // ════════════════════════════════════════════════════════
  // DÉFIS — CRUD
  // ════════════════════════════════════════════════════════
  getDefis() {
    return Utils.storage.get(this.CLE_DEFIS, []);
  },

  _creerDefi() {
    const amis  = this.getAmis();
    const modal = document.getElementById('modal-info');
    const cont  = document.getElementById('modal-info-content');
    if (!modal || !cont) return;

    if (amis.length === 0) {
      Utils.toast('Ajoute un ami d\'abord !', 'info');
      return;
    }

    cont.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:20px;color:white">
          ⚔️ Nouveau défi
        </div>

        <!-- Ami -->
        <div class="input-label">Défier</div>
        <select class="input mb-sm" id="defi-ami">
          ${amis.map(a=>`
            <option value="${a.id}">${a.nom}</option>`
          ).join('')}
        </select>

        <!-- Type -->
        <div class="input-label">Type de défi</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:6px;margin-bottom:12px">
          ${[
            { val:'seances', emoji:'🏋️', label:'Séances',
              desc:'Nombre de séances en X jours' },
            { val:'volume',  emoji:'📦', label:'Volume',
              desc:'Volume total soulevé (kg)' },
            { val:'streak',  emoji:'🔥', label:'Streak',
              desc:'Jours consécutifs d\'entraînement' },
            { val:'poids',   emoji:'🏆', label:'Charge max',
              desc:'PR sur un exercice choisi' }
          ].map(t=>`
            <button onclick="Duo._selTypeDefi('${t.val}',this)"
                    data-type="${t.val}"
                    style="padding:10px;text-align:left;
                           background:rgba(255,255,255,0.04);
                           border:1px solid rgba(255,255,255,0.08);
                           border-radius:var(--radius-lg);
                           cursor:pointer;font-family:inherit;
                           color:white;transition:all .2s">
              <div style="font-size:1.1rem;margin-bottom:3px">
                ${t.emoji}
              </div>
              <div style="font-size:.78rem;font-weight:700">
                ${t.label}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${t.desc}
              </div>
            </button>`).join('')}
        </div>

        <input type="hidden" id="defi-type" value="seances"/>

        <!-- Cible -->
        <div class="input-label">Objectif à atteindre</div>
        <input class="input mb-sm" id="defi-cible"
               type="number" placeholder="ex: 5 séances"
               value="5"/>

        <!-- Durée -->
        <div class="input-label">Durée (jours)</div>
        <select class="input mb-sm" id="defi-duree">
          <option value="7">1 semaine</option>
          <option value="14">2 semaines</option>
          <option value="30">1 mois</option>
        </select>

        <!-- Mise -->
        <div class="input-label">
          Mise (optionnel)
          <span style="color:var(--text-muted);font-weight:400">
            · ex: "Offrir un repas"
          </span>
        </div>
        <input class="input mb-md" id="defi-mise"
               placeholder="La persrit perd offre un café ☕"/>

        <!-- Boutons -->
        <div style="display:grid;grid-template-columns:1fr 2fr;gap:10px">
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-secondary" style="font-size:.82rem">
            Annuler
          </button>
          <button onclick="Duo._confirmerDefi()"
                  class="btn-primary" style="font-size:.88rem">
            ⚔️ Lancer le défi !
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _selTypeDefi(val, btn) {
    document.querySelectorAll('[data-type]').forEach(b => {
      b.style.background  = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
    });
    btn.style.background  = 'rgba(75,75,249,0.2)';
    btn.style.borderColor = 'var(--fd-indigo)';
    const input = document.getElementById('defi-type');
    if (input) input.value = val;
    Utils.vibrer([15]);
  },

  _confirmerDefi() {
    const amiId  = document.getElementById('defi-ami')?.value;
    const type   = document.getElementById('defi-type')?.value||'seances';
    const cible  = parseInt(document.getElementById('defi-cible')?.value)||5;
    const duree  = parseInt(document.getElementById('defi-duree')?.value)||7;
    const mise   = document.getElementById('defi-mise')?.value?.trim()||'';

    const ami    = this.getAmis().find(a => a.id === amiId);
    if (!ami) return;

    const dateFin = Utils.ajouterJours(Utils.aujourd_hui(), duree);

    const defi = {
      id:              'defi_' + Date.now(),
      amiId,
      type,
      cible,
      dateFin,
      mise,
      titre:           `${cible} ${type === 'seances' ? 'séances'
                          : type === 'volume' ? 'kg volume'
                          : type === 'streak' ? 'jours streak'
                          : 'kg au max'} en ${duree}j`,
      progressionMoi:  0,
      progressionAmi:  0,
      dateCreation:    Utils.aujourd_hui(),
      termine:         false
    };

    const defis = this.getDefis();
    defis.push(defi);
    Utils.storage.set(this.CLE_DEFIS, defis);

    document.getElementById('modal-info')?.classList.add('hidden');

    Utils.toast(
      `⚔️ Défi lancé contre ${ami.nom} !`,
      'success', 3000
    );
    Utils.vibrer([50, 30, 100]);

    // ✅ XP
    try { Gamification.ajouterXP(25, 'Défi lancé'); } catch(e) {}

    // Re-render
    const content = document.getElementById('duo-tab-content');
    if (content) {
      content.innerHTML = this._renderTabDefis(this.getDefis());
    }
  },

  // ✅ Mettre à jour la progression du défi
  _mettreAJourDefi(defiId, nouvelleVal) {
    const defis = this.getDefis();
    const defi  = defis.find(d => d.id === defiId);
    if (!defi) return;

    defi.progressionMoi = nouvelleVal;

    // ✅ Vérifier si terminé
    if (defi.progressionMoi >= defi.cible) {
      defi.termine = true;
      defi.gagnant = 'moi';
      Utils.toast('🏆 Défi remporté !', 'success', 4000);
      Utils.vibrerPR();
      Utils.confetti(3000);
      try { Gamification.ajouterXP(100, 'Défi remporté'); } catch(e) {}
    }

    Utils.storage.set(this.CLE_DEFIS, defis);
  },

  // ✅ Mettre à jour tous les défis actifs depuis les stats
  mettreAJourTousDefis() {
    try {
      const defis      = this.getDefis();
      const actifs     = defis.filter(d => !d.termine);
      if (!actifs.length) return;

      const monVol     = this._getMonVolumeSemaine();
      const monSeances = this._getMesSeancesSemaine();
      const monStreak  = this._getMonStreak();

      actifs.forEach(d => {
        let valeur = 0;
        switch(d.type) {
          case 'seances': valeur = monSeances; break;
          case 'volume':  valeur = Math.round(monVol/1000); break;
          case 'streak':  valeur = monStreak;  break;
        }
        d.progressionMoi = valeur;

        // ✅ Simuler progression ami (+/- aléatoire)
        if (!d._amiSimule) {
          d.progressionAmi = Math.floor(
            Math.random() * d.cible * 0.8
          );
          d._amiSimule = true;
        }
      });

      Utils.storage.set(this.CLE_DEFIS, defis);
    } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // DÉFI RAPIDE depuis home
  // ════════════════════════════════════════════════════════
  _lancerDefi(amiId) {
    const amis = this.getAmis();
    const ami  = amis.find(a => a.id === amiId);
    if (!ami) return;

    const modal = document.getElementById('modal-info');
    const cont  = document.getElementById('modal-info-content');
    if (!modal || !cont) return;

    cont.innerHTML = `
      <div style="padding:20px;padding-top:8px">

        <div style="font-size:1rem;font-weight:800;
                    margin-bottom:16px;color:white">
          ⚔️ Défier ${ami.nom}
        </div>

        <!-- Défis rapides -->
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            { emoji:'🏋️', titre:'5 séances cette semaine',
              type:'seances', cible:5, duree:7  },
            { emoji:'📦', titre:'10 tonnes cette semaine',
              type:'volume', cible:10, duree:7  },
            { emoji:'🔥', titre:'7 jours consécutifs',
              type:'streak', cible:7, duree:7   },
            { emoji:'💪', titre:'30 jours d\'entraînement',
              type:'seances', cible:30, duree:30 }
          ].map(d=>`
            <button onclick="Duo._lancerDefiRapide(
                      '${amiId}','${d.type}',
                      ${d.cible},${d.duree},
                      '${d.emoji} ${d.titre}')"
                    style="display:flex;align-items:center;gap:12px;
                           padding:14px;text-align:left;
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
              <span style="font-size:1.5rem">${d.emoji}</span>
              <div>
                <div style="font-size:.85rem;font-weight:700">
                  ${d.titre}
                </div>
                <div style="font-size:.62rem;color:var(--text-muted)">
                  ${d.duree} jours · Cible : ${d.cible}
                </div>
              </div>
              <span style="margin-left:auto;
                           color:var(--fd-indigo);font-size:.9rem">
                →
              </span>
            </button>`).join('')}
        </div>

        <button onclick="document.getElementById('modal-info')
                          .classList.add('hidden')"
                class="btn-secondary mt-md"
                style="width:100%;font-size:.82rem">
          Annuler
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
  },

  _lancerDefiRapide(amiId, type, cible, duree, titre) {
    const dateFin = Utils.ajouterJours(Utils.aujourd_hui(), duree);
    const defi    = {
      id:             'defi_' + Date.now(),
      amiId, type, cible, dateFin, titre,
      progressionMoi: 0, progressionAmi: 0,
      dateCreation:   Utils.aujourd_hui(),
      termine:        false
    };

    const defis = this.getDefis();
    defis.push(defi);
    Utils.storage.set(this.CLE_DEFIS, defis);

    const ami = this.getAmis().find(a => a.id === amiId);
    document.getElementById('modal-info')?.classList.add('hidden');

    Utils.toast(
      `⚔️ Défi lancé contre ${ami?.nom||'ton ami'} !`,
      'success', 3000
    );
    Utils.vibrer([50, 30, 100]);
    try { Gamification.ajouterXP(25, 'Défi lancé'); } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // CHAT
  // ════════════════════════════════════════════════════════
  _ouvrirChat(amiId) {
    const ami   = this.getAmis().find(a => a.id === amiId);
    const modal = document.getElementById('modal-info');
    const cont  = document.getElementById('modal-info-content');
    if (!modal || !cont || !ami) return;

    const msgs = Utils.storage.get(
      `${this.CLE_MESSAGES}_${amiId}`, []
    );

    cont.innerHTML = `
      <div style="padding:16px;padding-top:8px;
                  display:flex;flex-direction:column;height:100%">

        <!-- Header chat -->
        <div style="display:flex;align-items:center;gap:10px;
                    margin-bottom:14px;padding-bottom:12px;
                    border-bottom:1px solid var(--border-color)">
          <div style="width:40px;height:40px;border-radius:50%;
                      background:rgba(75,75,249,0.12);
                      border:2px solid rgba(75,75,249,0.3);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.3rem">
            ${ami.avatar||'💪'}
          </div>
          <div>
            <div style="font-weight:800;font-size:.92rem">
              ${ami.nom}
            </div>
            <div style="font-size:.62rem;color:var(--fd-mint)">
              💬 Chat workout
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div id="duo-chat-msgs"
             style="flex:1;overflow-y:auto;
                    min-height:200px;max-height:360px;
                    display:flex;flex-direction:column;gap:8px;
                    padding-bottom:8px">
          ${msgs.length === 0 ? `
            <div style="text-align:center;padding:20px;
                        color:var(--text-muted);font-size:.78rem">
              Envoie le premier message !
            </div>` :
            msgs.map(m => this._renderMessage(m, ami)).join('')}
        </div>

        <!-- Quick replies -->
        <div style="display:flex;flex-wrap:wrap;gap:5px;margin:8px 0">
          ${[
            '💪 Belle séance !',
            '🔥 Let\'s go !',
            '🏆 GG !',
            '⚔️ Je te défie !',
            '😅 Dur...',
            '🎯 En route !'
          ].map(r=>`
            <button onclick="Duo._envoyerMessage('${amiId}','${r}')"
                    style="padding:4px 10px;
                           background:rgba(75,75,249,0.1);
                           border:1px solid rgba(75,75,249,0.2);
                           border-radius:99px;font-size:.68rem;
                           color:var(--fd-indigo);cursor:pointer">
              ${r}
            </button>`).join('')}
        </div>

        <!-- Input -->
        <div style="display:flex;gap:8px;margin-top:6px">
          <input class="input" id="duo-chat-input"
                 placeholder="Écris un message..."
                 style="flex:1"
                 onkeydown="if(event.key==='Enter')
                   Duo._envoyerMessage('${amiId}',
                     document.getElementById('duo-chat-input').value)"/>
          <button onclick="Duo._envoyerMessage('${amiId}',
                    document.getElementById('duo-chat-input').value)"
                  class="btn-primary"
                  style="padding:10px 14px;font-size:.8rem">
            ➤
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    const closeBtn = document.getElementById('modal-info-close');
    if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');

    // Scroll bas
    setTimeout(() => {
      const msgs = document.getElementById('duo-chat-msgs');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 100);
  },

  _renderMessage(msg, ami) {
    const estMoi = msg.auteur === 'moi';
    return `
      <div style="display:flex;
                  justify-content:${estMoi?'flex-end':'flex-start'};
                  align-items:flex-end;gap:6px">
        ${!estMoi ? `
          <div style="width:26px;height:26px;border-radius:50%;
                      background:rgba(75,75,249,0.12);flex-shrink:0;
                      display:flex;align-items:center;
                      justify-content:center;font-size:.8rem">
            ${ami.avatar||'💪'}
          </div>` : ''}
        <div style="max-width:75%">
          <div style="padding:8px 12px;
                      background:${estMoi
                        ?'var(--fd-indigo)'
                        :'rgba(255,255,255,0.08)'};
                      border-radius:${estMoi
                        ?'14px 14px 4px 14px'
                        :'14px 14px 14px 4px'};
                      font-size:.82rem;line-height:1.4;
                      color:${estMoi?'white':'var(--text-primary)'}">
            ${msg.texte}
          </div>
          <div style="font-size:.55rem;color:var(--text-muted);
                      margin-top:2px;
                      text-align:${estMoi?'right':'left'}">
            ${msg.heure}
          </div>
        </div>
        ${estMoi ? `
          <div style="width:26px;height:26px;border-radius:50%;
                      background:rgba(75,75,249,0.15);flex-shrink:0;
                      display:flex;align-items:center;
                      justify-content:center;font-size:.8rem">
            💪
          </div>` : ''}
      </div>`;
  },

  _envoyerMessage(amiId, texte) {
    const t = (texte || '').trim();
    if (!t) return;

    const cle  = `${this.CLE_MESSAGES}_${amiId}`;
    const msgs = Utils.storage.get(cle, []);

    const msg = {
      id:     Date.now(),
      auteur: 'moi',
      texte:  t,
      heure:  new Date().toLocaleTimeString('fr-FR', {
        hour:'2-digit', minute:'2-digit'
      })
    };

    msgs.push(msg);

    // Garder 50 derniers messages
    if (msgs.length > 50) msgs.splice(0, msgs.length - 50);
    Utils.storage.set(cle, msgs);

    // Mettre à jour l'UI
    const container = document.getElementById('duo-chat-msgs');
    const ami       = this.getAmis().find(a => a.id === amiId);
    if (container && ami) {
      container.insertAdjacentHTML(
        'beforeend',
        this._renderMessage(msg, ami)
      );
      container.scrollTop = container.scrollHeight;
    }

    // Reset input
    const input = document.getElementById('duo-chat-input');
    if (input) input.value = '';

    Utils.vibrer([10]);

    // ✅ Simuler réponse ami après 1-3s
    setTimeout(() => {
      this._simulerReponseAmi(amiId, cle, ami);
    }, 1000 + Math.random() * 2000);
  },

  _simulerReponseAmi(amiId, cle, ami) {
    const reponses = [
      '💪 Let\'s go !',
      '🔥 En forme !',
      '💬 GG à toi aussi !',
      '⚔️ Challenge accepted !',
      '🏆 On se donne tout !',
      '😤 Je vais t\'écraser !',
      '🤝 Bonne séance !',
      '📊 Regarde mes stats !',
      '🎯 Objectif atteint !'
    ];
    const texte = reponses[
      Math.floor(Math.random() * reponses.length)
    ];

    const msgs = Utils.storage.get(cle, []);
    const msg  = {
      id:     Date.now(),
      auteur: 'ami',
      texte,
      heure:  new Date().toLocaleTimeString('fr-FR', {
        hour:'2-digit', minute:'2-digit'
      })
    };
    msgs.push(msg);
    if (msgs.length > 50) msgs.splice(0, msgs.length - 50);
    Utils.storage.set(cle, msgs);

    // Mettre à jour l'UI si le chat est encore ouvert
    const container = document.getElementById('duo-chat-msgs');
    if (container && ami) {
      container.insertAdjacentHTML(
        'beforeend',
        this._renderMessage(msg, ami)
      );
      container.scrollTop = container.scrollHeight;
    }
  },

  // ════════════════════════════════════════════════════════
  // PARTAGE SÉANCE
  // ════════════════════════════════════════════════════════
  _partagerSeance(amiId) {
    this._switchTab('partage');
    const select = document.getElementById('duo-share-ami');
    if (select) select.value = amiId;
  },

  _envoyerSeance() {
    const seanceId = document.getElementById('duo-share-seance')?.value;
    const amiId    = document.getElementById('duo-share-ami')?.value;
    const message  = document.getElementById('duo-share-msg')?.value?.trim()||'';

    const ami    = this.getAmis().find(a => a.id === amiId);
    let seance   = null;
    try {
      seance = Programme._getSeanceById?.(seanceId);
    } catch(e) {}

    if (!ami || !seanceId) {
      Utils.toast('Choisis un ami et une séance !', 'error');
      return;
    }

    const envoi = {
      id:          'share_' + Date.now(),
      amiId,
      seanceId,
      seance,
      message,
      date:        Utils.aujourd_hui(),
      direction:   'envoye'
    };

    const seances = Utils.storage.get(this.CLE_SEANCES, []);
    seances.push(envoi);
    Utils.storage.set(this.CLE_SEANCES, seances);

    Utils.toast(
      `📤 Séance envoyée à ${ami.nom} !`,
      'success', 3000
    );
    Utils.vibrerSuccess();

    // Reset
    const msgInput = document.getElementById('duo-share-msg');
    if (msgInput) msgInput.value = '';
  },

  _importerSeanceRecue(shareId) {
    const seances = Utils.storage.get(this.CLE_SEANCES, []);
    const share   = seances.find(s => s.id === shareId);
    if (!share?.seance) {
      Utils.toast('Séance introuvable', 'error');
      return;
    }

    // ✅ Ajouter la séance reçue
    try {
      Programme.ajouterSeanceCustom?.(share.seance);
    } catch(e) {
      // Fallback
      const custom = Utils.storage.get('ft_seances_custom_recu', []);
      custom.push(share.seance);
      Utils.storage.set('ft_seances_custom_recu', custom);
    }

    Utils.toast(
      `✅ Séance "${share.seance.nom}" importée !`,
      'success', 3000
    );
    Utils.vibrerSuccess();

    this._switchTab('partage');
  },

  _supprimerSeanceRecue(shareId) {
    const seances = Utils.storage.get(this.CLE_SEANCES, []);
    const nouvelles = seances.filter(s => s.id !== shareId);
    Utils.storage.set(this.CLE_SEANCES, nouvelles);
    this._switchTab('partage');
  },

  // ════════════════════════════════════════════════════════
  // LIEN DE PARTAGE
  // ════════════════════════════════════════════════════════
  _genererLien() {
    let profil = { nom:'Athlète', avatar:'💪' };
    let xp     = { total:0, niveau:{ numero:1 } };
    let streak = { count:0 };
    try { profil = Tracker.getProfil(); } catch(e) {}
    try { xp     = Gamification.getXP(); } catch(e) {}
    try { streak = Tracker.getStreak();  } catch(e) {}

    const data = {
      nom:    profil.nom,
      avatar: profil.avatar,
      niveau: xp.niveau.numero,
      xp:     xp.total,
      streak: streak.count,
      code:   this.getProfilDuo().code
    };

    const encoded = btoa(JSON.stringify(data));
    const url     = `${window.location.origin}?duo=${encoded}`;

    // Copier dans le presse-papier
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        Utils.toast('🔗 Lien copié !', 'success', 3000);
      });
    } else {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      Utils.toast('🔗 Lien copié !', 'success', 3000);
    }
  },

  // ════════════════════════════════════════════════════════
  // PROFIL DUO
  // ════════════════════════════════════════════════════════
  getProfilDuo() {
    let profil = Utils.storage.get(this.CLE_PROFIL, null);
    if (!profil) {
      profil = { code: this._genererCode() };
      Utils.storage.set(this.CLE_PROFIL, profil);
    }
    return profil;
  },

  _genererCode() {
    const chars  = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code     = '';
    for (let i = 0; i < 5; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const profil = Utils.storage.get(this.CLE_PROFIL, {});
    profil.code  = code;
    Utils.storage.set(this.CLE_PROFIL, profil);
    return code;
  },

  _copierCode(code) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        Utils.toast(`📋 Code ${code} copié !`, 'success', 2000);
      });
    } else {
      Utils.toast(`Code : ${code}`, 'info', 3000);
    }
    Utils.vibrer([20]);
  },

  // ════════════════════════════════════════════════════════
  // HELPERS STATS
  // ════════════════════════════════════════════════════════
  _getMonXP() {
    try { return Gamification.getXP().total; } catch(e) { return 0; }
  },

  _getMonVolumeSemaine() {
    try { return Tracker.getVolumeSemaine(); } catch(e) { return 0; }
  },

  _getMesSeancesSemaine() {
    try {
      const analyse = Coach.getAnalyseSemaine();
      return analyse.seances || 0;
    } catch(e) { return 0; }
  },

  _getMonStreak() {
    try { return Tracker.getStreak().count; } catch(e) { return 0; }
  },

  // ════════════════════════════════════════════════════════
  // INIT — Mettre à jour défis après séance
  // ════════════════════════════════════════════════════════
  init() {
    // ✅ Mettre à jour les défis à chaque fin de séance
    window.addEventListener('seance-terminee', () => {
      setTimeout(() => {
        try { this.mettreAJourTousDefis(); } catch(e) {}
      }, 1000);
    });

    console.log('[Duo] Initialisé ✅');
  }
};

window.Duo = Duo;

// ✅ Init auto
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try { Duo.init(); } catch(e) {}
  }, 2000);
});

console.log('✅ Duo.js v1.0 chargé');
