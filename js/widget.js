/* ============================================================
   PowerApp — widget.js v1.0
   ✅ Widget iOS (Scriptable)
   ✅ Widget Android (KWGT / Widgetsmith)
   ✅ Widget navigateur (HTML exportable)
   ✅ Shortcut iPhone / PWA
   ✅ Données temps réel
   ============================================================ */

'use strict';

const Widget = {

  CLE_CONFIG: 'ft_widget_config',
  CLE_CACHE:  'ft_widget_cache',

  // ════════════════════════════════════════════════════════
  // TYPES DE WIDGETS
  // ════════════════════════════════════════════════════════
  WIDGETS: {

    streak: {
      id:    'streak',
      nom:   'Streak & Motivation',
      emoji: '🔥',
      desc:  'Affiche ton streak + message du jour',
      tailles: ['small', 'medium'],
      couleur: '#f9ef77'
    },
    seance: {
      id:    'seance',
      nom:   'Séance du jour',
      emoji: '💪',
      desc:  'Prochaine séance + bouton démarrer',
      tailles: ['medium', 'large'],
      couleur: '#4b4bf9'
    },
    stats: {
      id:    'stats',
      nom:   'Stats semaine',
      emoji: '📊',
      desc:  'Volume + séances + PRs cette semaine',
      tailles: ['medium', 'large'],
      couleur: '#8bf0bb'
    },
    xp: {
      id:    'xp',
      nom:   'XP & Niveau',
      emoji: '⭐',
      desc:  'Progression XP + niveau actuel',
      tailles: ['small', 'medium'],
      couleur: '#bfa1ff'
    },
    timer: {
      id:    'timer',
      nom:   'Timer Rapide',
      emoji: '⏱',
      desc:  'Lance un timer repos directement',
      tailles: ['small'],
      couleur: '#00cfff'
    }
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;

    const config = this.getConfig();

    container.innerHTML = `

      <!-- Header -->
      <div style="margin-bottom:20px">
        <div style="font-family:'Orbitron',monospace;
                    font-size:.6rem;letter-spacing:4px;
                    color:rgba(0,207,255,0.4);margin-bottom:6px">
          📱 WIDGETS
        </div>
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:4px">
          Widgets & Raccourcis
        </h2>
        <p style="font-size:.8rem;color:var(--text-muted)">
          Ajoute PowerApp à ton écran d'accueil
        </p>
      </div>

      <!-- PWA Install -->
      ${this._renderPWASection()}

      <!-- Tabs -->
      <div style="display:flex;gap:0;
                  background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-lg);
                  padding:4px;margin-bottom:16px">
        ${[
          { id:'apercu',   label:'👁️ Aperçu'    },
          { id:'ios',      label:'🍎 iOS'         },
          { id:'android',  label:'🤖 Android'     },
          { id:'html',     label:'🌐 HTML'         }
        ].map((t,i) => `
          <button id="widget-tab-${t.id}"
                  onclick="Widget._switchTab('${t.id}')"
                  style="flex:1;padding:8px 4px;
                         border-radius:var(--radius-md);
                         border:none;cursor:pointer;
                         font-size:.65rem;font-weight:700;
                         transition:all .2s;font-family:inherit;
                         background:${i===0
                           ?'rgba(75,75,249,0.2)':'transparent'};
                         color:${i===0
                           ?'var(--fd-indigo)':'var(--text-muted)'}">
            ${t.label}
          </button>`).join('')}
      </div>

      <!-- Contenu -->
      <div id="widget-tab-content">
        ${this._renderTabApercu()}
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // PWA SECTION
  // ════════════════════════════════════════════════════════
  _renderPWASection() {
    const estInstalle = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;

    return `
      <div style="background:${estInstalle
                    ?'rgba(139,240,187,0.08)'
                    :'linear-gradient(135deg,rgba(75,75,249,0.15),rgba(75,75,249,0.05))'};
                  border:1px solid ${estInstalle
                    ?'rgba(139,240,187,0.25)'
                    :'rgba(75,75,249,0.3)'};
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:16px">

        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:52px;height:52px;border-radius:14px;
                      background:${estInstalle
                        ?'rgba(139,240,187,0.15)'
                        :'rgba(75,75,249,0.15)'};
                      border:2px solid ${estInstalle
                        ?'rgba(139,240,187,0.3)'
                        :'rgba(75,75,249,0.3)'};
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem;
                      flex-shrink:0">
            ${estInstalle ? '✅' : '⚡'}
          </div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:800;margin-bottom:3px">
              ${estInstalle
                ? 'PowerApp installée !'
                : 'Installer PowerApp'}
            </div>
            <div style="font-size:.68rem;color:var(--text-muted);
                        line-height:1.4">
              ${estInstalle
                ? 'L\'app est sur ton écran d\'accueil · Pleine expérience'
                : 'Ajoute l\'app à l\'écran d\'accueil pour l\'expérience complète'}
            </div>
          </div>
          ${!estInstalle ? `
            <button onclick="Widget._installerPWA()"
                    style="padding:8px 14px;
                           background:var(--fd-indigo);border:none;
                           border-radius:var(--radius-full);
                           font-size:.72rem;font-weight:700;
                           color:white;cursor:pointer;
                           white-space:nowrap;flex-shrink:0">
              📲 Installer
            </button>` : ''}
        </div>

        ${!estInstalle ? `
          <div style="margin-top:12px;display:flex;gap:6px;
                      flex-wrap:wrap">
            ${[
              { os:'iOS',     emoji:'🍎', desc:'Safari → Partager → Sur l\'écran d\'accueil' },
              { os:'Android', emoji:'🤖', desc:'Chrome → Menu → Installer l\'app' }
            ].map(o=>`
              <div style="flex:1;min-width:140px;
                          padding:8px 10px;
                          background:rgba(255,255,255,0.04);
                          border:1px solid rgba(255,255,255,0.08);
                          border-radius:var(--radius-md)">
                <div style="font-size:.7rem;font-weight:700;
                            margin-bottom:3px">
                  ${o.emoji} ${o.os}
                </div>
                <div style="font-size:.6rem;color:var(--text-muted);
                            line-height:1.4">
                  ${o.desc}
                </div>
              </div>`).join('')}
          </div>` : ''}
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // TAB APERÇU
  // ════════════════════════════════════════════════════════
  _renderTabApercu() {
    const data = this._getData();

    return `
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);margin-bottom:12px">
        Aperçu des widgets disponibles
      </div>

      <!-- Grid widgets -->
      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:10px;margin-bottom:16px">

        <!-- Widget Streak Small -->
        ${this._renderWidgetPreview('streak_small', data)}

        <!-- Widget XP Small -->
        ${this._renderWidgetPreview('xp_small', data)}

        <!-- Widget Séance Medium -->
        ${this._renderWidgetPreview('seance_medium', data)}

        <!-- Widget Stats Medium -->
        ${this._renderWidgetPreview('stats_medium', data)}

      </div>

      <!-- Widget Large -->
      ${this._renderWidgetPreview('full_large', data)}

      <!-- Boutons export -->
      <div style="display:flex;flex-direction:column;
                  gap:8px;margin-top:16px">
        <button onclick="Widget._switchTab('ios')"
                style="display:flex;align-items:center;gap:10px;
                       padding:14px 16px;
                       background:rgba(255,255,255,0.04);
                       border:1px solid rgba(255,255,255,0.08);
                       border-radius:var(--radius-lg);
                       cursor:pointer;color:white;
                       font-family:inherit;transition:all .2s"
                onmouseenter="this.style.background='rgba(75,75,249,0.1)'"
                onmouseleave="this.style.background='rgba(255,255,255,0.04)'">
          <span style="font-size:1.5rem">🍎</span>
          <div style="flex:1;text-align:left">
            <div style="font-size:.85rem;font-weight:700">
              Widget iOS (Scriptable)
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Code JavaScript pour l'app Scriptable
            </div>
          </div>
          <span style="color:var(--fd-indigo)">→</span>
        </button>

        <button onclick="Widget._switchTab('android')"
                style="display:flex;align-items:center;gap:10px;
                       padding:14px 16px;
                       background:rgba(255,255,255,0.04);
                       border:1px solid rgba(255,255,255,0.08);
                       border-radius:var(--radius-lg);
                       cursor:pointer;color:white;
                       font-family:inherit;transition:all .2s"
                onmouseenter="this.style.background='rgba(139,240,187,0.08)'"
                onmouseleave="this.style.background='rgba(255,255,255,0.04)'">
          <span style="font-size:1.5rem">🤖</span>
          <div style="flex:1;text-align:left">
            <div style="font-size:.85rem;font-weight:700">
              Widget Android (KWGT)
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Preset KWGT + instructions
            </div>
          </div>
          <span style="color:var(--fd-mint)">→</span>
        </button>

        <button onclick="Widget._exporterHTML()"
                style="display:flex;align-items:center;gap:10px;
                       padding:14px 16px;
                       background:rgba(255,255,255,0.04);
                       border:1px solid rgba(255,255,255,0.08);
                       border-radius:var(--radius-lg);
                       cursor:pointer;color:white;
                       font-family:inherit;transition:all .2s"
                onmouseenter="this.style.background='rgba(249,239,119,0.08)'"
                onmouseleave="this.style.background='rgba(255,255,255,0.04)'">
          <span style="font-size:1.5rem">🌐</span>
          <div style="flex:1;text-align:left">
            <div style="font-size:.85rem;font-weight:700">
              Widget HTML
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              Widget autonome téléchargeable
            </div>
          </div>
          <span style="color:var(--fd-lemon)">→</span>
        </button>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // PREVIEWS WIDGETS
  // ════════════════════════════════════════════════════════
  _renderWidgetPreview(type, data) {

    switch(type) {

      case 'streak_small': return `
        <div style="background:linear-gradient(135deg,#06063d,#0a0a40);
                    border:1px solid rgba(249,239,119,0.2);
                    border-radius:16px;padding:14px;
                    aspect-ratio:1;display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                    position:relative;overflow:hidden">
          <div style="position:absolute;top:-20px;right:-20px;
                      width:80px;height:80px;border-radius:50%;
                      background:radial-gradient(circle,
                        rgba(249,239,119,0.15),transparent 70%)">
          </div>
          <div style="font-size:.55rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:2px;
                      color:rgba(249,239,119,0.5);
                      font-family:'Orbitron',monospace">
            STREAK
          </div>
          <div style="text-align:center">
            <div style="font-size:2.5rem;line-height:1">🔥</div>
            <div style="font-size:2rem;font-weight:900;
                        color:#f9ef77;line-height:1;margin-top:4px">
              ${data.streak}
            </div>
            <div style="font-size:.6rem;color:rgba(255,255,255,0.4);
                        margin-top:2px">
              jours
            </div>
          </div>
          <div style="font-size:.55rem;color:rgba(249,239,119,0.4);
                      font-family:monospace">
            ⚡ PowerApp
          </div>
        </div>`;

      case 'xp_small': return `
        <div style="background:linear-gradient(135deg,#06063d,#0a0a40);
                    border:1px solid rgba(191,161,255,0.2);
                    border-radius:16px;padding:14px;
                    aspect-ratio:1;display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                    position:relative;overflow:hidden">
          <div style="position:absolute;top:-20px;right:-20px;
                      width:80px;height:80px;border-radius:50%;
                      background:radial-gradient(circle,
                        rgba(191,161,255,0.15),transparent 70%)">
          </div>
          <div style="font-size:.55rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:2px;
                      color:rgba(191,161,255,0.5);
                      font-family:'Orbitron',monospace">
            XP TOTAL
          </div>
          <div style="text-align:center">
            <div style="font-size:1.2rem;line-height:1">
              ${data.niveauEmoji}
            </div>
            <div style="font-size:1.6rem;font-weight:900;
                        color:#bfa1ff;line-height:1;margin-top:4px">
              ${data.xp > 999
                ? (data.xp/1000).toFixed(1)+'K'
                : data.xp}
            </div>
            <div style="font-size:.58rem;color:rgba(191,161,255,0.5);
                        margin-top:2px">
              Niv.${data.niveau}
            </div>
          </div>
          <!-- Barre XP -->
          <div>
            <div style="height:4px;background:rgba(255,255,255,0.06);
                        border-radius:99px;overflow:hidden">
              <div style="height:100%;width:${data.xpPct}%;
                          background:#bfa1ff;border-radius:99px">
              </div>
            </div>
          </div>
        </div>`;

      case 'seance_medium': return `
        <div style="grid-column:span 2;
                    background:linear-gradient(135deg,#06063d,#0a0a40);
                    border:1px solid rgba(75,75,249,0.25);
                    border-radius:16px;padding:16px;
                    position:relative;overflow:hidden">
          <div style="position:absolute;top:-30px;right:-20px;
                      width:120px;height:120px;border-radius:50%;
                      background:radial-gradient(circle,
                        rgba(75,75,249,0.2),transparent 70%)">
          </div>
          <div style="font-size:.55rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:2px;
                      color:rgba(75,75,249,0.6);
                      font-family:'Orbitron',monospace;
                      margin-bottom:8px">
            SÉANCE DU JOUR
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="font-size:2rem">${data.seanceEmoji}</div>
            <div style="flex:1">
              <div style="font-size:.9rem;font-weight:800;
                          color:white">
                ${data.seanceNom}
              </div>
              <div style="font-size:.62rem;color:rgba(255,255,255,0.4);
                          margin-top:2px">
                ~${data.seanceDuree}min
                · ${data.seanceExos} exercices
              </div>
            </div>
            <div style="width:36px;height:36px;border-radius:50%;
                        background:#4b4bf9;
                        display:flex;align-items:center;
                        justify-content:center;
                        font-size:.9rem;flex-shrink:0">
              ▶
            </div>
          </div>
          <div style="margin-top:10px;
                      display:flex;gap:8px">
            ${[
              { val:`${data.streak}🔥`, label:'Streak' },
              { val:Utils.formatVolume(data.volumeSem), label:'Volume' },
              { val:`${data.seancesSem}`, label:'Séances' }
            ].map(s=>`
              <div style="flex:1;text-align:center;
                          padding:6px 4px;
                          background:rgba(75,75,249,0.08);
                          border-radius:8px">
                <div style="font-size:.78rem;font-weight:800;
                            color:#4b4bf9">${s.val}</div>
                <div style="font-size:.5rem;color:rgba(255,255,255,0.3);
                            text-transform:uppercase">${s.label}</div>
              </div>`).join('')}
          </div>
        </div>`;

      case 'stats_medium': return `
        <div style="grid-column:span 2;
                    background:linear-gradient(135deg,#06063d,#0a0a40);
                    border:1px solid rgba(139,240,187,0.2);
                    border-radius:16px;padding:16px;
                    position:relative;overflow:hidden">
          <div style="font-size:.55rem;font-weight:700;
                      text-transform:uppercase;letter-spacing:2px;
                      color:rgba(139,240,187,0.5);
                      font-family:'Orbitron',monospace;
                      margin-bottom:10px">
            📊 STATS SEMAINE
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);
                      gap:8px">
            ${[
              { val:data.seancesSem,
                label:'Séances', color:'#4b4bf9' },
              { val:Utils.formatVolume(data.volumeSem),
                label:'Volume', color:'#8bf0bb' },
              { val:data.prs,
                label:'PRs', color:'#f9ef77' },
              { val:data.rpe > 0 ? `${data.rpe}/10` : '—',
                label:'RPE', color:'#bfa1ff' }
            ].map(s=>`
              <div style="text-align:center">
                <div style="font-size:.9rem;font-weight:800;
                            color:${s.color};line-height:1">
                  ${s.val}
                </div>
                <div style="font-size:.5rem;
                            color:rgba(255,255,255,0.3);
                            margin-top:3px;text-transform:uppercase">
                  ${s.label}
                </div>
              </div>`).join('')}
          </div>
          <!-- Mini barres jours -->
          <div style="display:flex;gap:3px;margin-top:10px;
                      align-items:flex-end;height:28px">
            ${Object.values(data.volumeJours).map(v => {
              const max = Math.max(...Object.values(data.volumeJours), 1);
              const h   = Math.max(2, Math.round(28 * (v/max)));
              return `
                <div style="flex:1;height:${h}px;
                            background:${v > 0
                              ?'rgba(75,75,249,0.6)'
                              :'rgba(255,255,255,0.05)'};
                            border-radius:2px">
                </div>`;
            }).join('')}
          </div>
        </div>`;

      case 'full_large': return `
        <div style="background:linear-gradient(135deg,#06063d,#0a0a40);
                    border:1px solid rgba(75,75,249,0.2);
                    border-radius:16px;padding:16px;
                    position:relative;overflow:hidden">
          <!-- Glow -->
          <div style="position:absolute;top:-40px;right:-30px;
                      width:160px;height:160px;border-radius:50%;
                      background:radial-gradient(circle,
                        rgba(75,75,249,0.15),transparent 70%);
                      pointer-events:none"></div>

          <!-- Header -->
          <div style="display:flex;align-items:center;
                      justify-content:space-between;margin-bottom:12px">
            <div style="font-size:.58rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:2px;
                        color:rgba(75,75,249,0.5);
                        font-family:'Orbitron',monospace">
              ⚡ POWERAPP
            </div>
            <div style="font-size:.62rem;color:rgba(255,255,255,0.4)">
              ${new Date().toLocaleDateString('fr-FR', {
                weekday:'short', day:'numeric', month:'short'
              })}
            </div>
          </div>

          <!-- Profil + Séance -->
          <div style="display:flex;align-items:center;
                      gap:10px;margin-bottom:12px">
            <div style="font-size:1.8rem">${data.avatar}</div>
            <div style="flex:1">
              <div style="font-size:.85rem;font-weight:800">
                ${data.nom}
              </div>
              <div style="font-size:.6rem;color:rgba(75,75,249,0.7)">
                ${data.niveauEmoji} Niv.${data.niveau}
                · ${data.xp} XP
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:1.2rem;font-weight:800;
                          color:#f9ef77">
                🔥 ${data.streak}
              </div>
              <div style="font-size:.55rem;color:rgba(255,255,255,0.3)">
                jours
              </div>
            </div>
          </div>

          <!-- Séance -->
          <div style="padding:10px;
                      background:rgba(75,75,249,0.1);
                      border:1px solid rgba(75,75,249,0.2);
                      border-radius:10px;margin-bottom:10px">
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-size:1.1rem">${data.seanceEmoji}</span>
              <div style="flex:1">
                <div style="font-size:.78rem;font-weight:700">
                  ${data.seanceNom}
                </div>
                <div style="font-size:.58rem;
                            color:rgba(255,255,255,0.4)">
                  ~${data.seanceDuree}min
                </div>
              </div>
              <div style="width:28px;height:28px;border-radius:50%;
                          background:#4b4bf9;
                          display:flex;align-items:center;
                          justify-content:center;font-size:.7rem">
                ▶
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);
                      gap:6px">
            ${[
              { val:data.seancesSem, label:'Séances', color:'#4b4bf9' },
              { val:Utils.formatVolume(data.volumeSem), label:'Volume', color:'#8bf0bb' },
              { val:data.prs, label:'Records', color:'#f9ef77' }
            ].map(s=>`
              <div style="text-align:center;padding:6px;
                          background:rgba(255,255,255,0.03);
                          border-radius:8px">
                <div style="font-size:.82rem;font-weight:800;
                            color:${s.color}">${s.val}</div>
                <div style="font-size:.5rem;
                            color:rgba(255,255,255,0.3);
                            text-transform:uppercase">${s.label}</div>
              </div>`).join('')}
          </div>
        </div>`;

      default: return '';
    }
  },

  // ════════════════════════════════════════════════════════
  // TAB iOS — Scriptable
  // ════════════════════════════════════════════════════════
  _renderTabIOS() {
    const data   = this._getData();
    const script = this._genererScriptScriptable(data);

    return `
      <div style="margin-bottom:16px;
                  background:rgba(255,255,255,0.04);
                  border:1px solid rgba(255,255,255,0.08);
                  border-radius:var(--radius-xl);
                  padding:16px">
        <div style="display:flex;align-items:center;gap:10px;
                    margin-bottom:12px">
          <div style="width:48px;height:48px;border-radius:12px;
                      background:rgba(255,255,255,0.08);
                      display:flex;align-items:center;
                      justify-content:center;font-size:1.5rem">
            🍎
          </div>
          <div>
            <div style="font-weight:800;font-size:.92rem">
              Widget iOS avec Scriptable
            </div>
            <div style="font-size:.65rem;color:var(--text-muted)">
              App gratuite sur l'App Store
            </div>
          </div>
        </div>

        <!-- Étapes -->
        <div style="display:flex;flex-direction:column;gap:10px;
                    margin-bottom:16px">
          ${[
            {
              num: '1',
              titre: 'Installe Scriptable',
              desc: 'Télécharge l\'app Scriptable sur l\'App Store (gratuit)',
              btn: { label:'📲 App Store', action:"Widget._ouvrirURL('https://apps.apple.com/fr/app/scriptable/id1405459188')" }
            },
            {
              num: '2',
              titre: 'Copie le script',
              desc: 'Copie le code JavaScript ci-dessous',
              btn: { label:'📋 Copier le code', action:"Widget._copierScript()" }
            },
            {
              num: '3',
              titre: 'Crée un nouveau script',
              desc: 'Dans Scriptable, appuie sur + et colle le code',
              btn: null
            },
            {
              num: '4',
              titre: 'Ajoute le widget',
              desc: 'Maintiens l\'écran d\'accueil → + → Scriptable → choisis la taille',
              btn: null
            }
          ].map(e=>`
            <div style="display:flex;gap:12px;align-items:flex-start">
              <div style="width:28px;height:28px;border-radius:50%;
                          background:rgba(75,75,249,0.2);
                          border:2px solid rgba(75,75,249,0.4);
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.72rem;font-weight:800;
                          color:var(--fd-indigo);flex-shrink:0">
                ${e.num}
              </div>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">
                  ${e.titre}
                </div>
                <div style="font-size:.65rem;color:var(--text-muted);
                            margin-top:2px;line-height:1.4">
                  ${e.desc}
                </div>
                ${e.btn ? `
                  <button onclick="${e.btn.action}"
                          style="margin-top:6px;padding:5px 12px;
                                 background:rgba(75,75,249,0.12);
                                 border:1px solid rgba(75,75,249,0.25);
                                 border-radius:99px;font-size:.68rem;
                                 font-weight:700;color:var(--fd-indigo);
                                 cursor:pointer">
                    ${e.btn.label}
                  </button>` : ''}
              </div>
            </div>`).join('')}
        </div>

        <!-- Code Scriptable -->
        <div>
          <div style="display:flex;justify-content:space-between;
                      align-items:center;margin-bottom:8px">
            <div style="font-size:.65rem;font-weight:700;
                        text-transform:uppercase;letter-spacing:.08em;
                        color:var(--text-muted)">
              Code JavaScript
            </div>
            <button onclick="Widget._copierScript()"
                    style="padding:5px 12px;
                           background:rgba(75,75,249,0.12);
                           border:1px solid rgba(75,75,249,0.25);
                           border-radius:99px;font-size:.68rem;
                           font-weight:700;color:var(--fd-indigo);
                           cursor:pointer">
              📋 Copier
            </button>
          </div>
          <div id="script-container"
               style="background:rgba(0,0,0,0.4);
                      border:1px solid rgba(255,255,255,0.08);
                      border-radius:var(--radius-md);
                      padding:12px;
                      max-height:200px;overflow-y:auto;
                      font-family:monospace;font-size:.62rem;
                      color:rgba(0,207,255,0.7);
                      line-height:1.6;
                      white-space:pre-wrap;
                      word-break:break-all">
${script}
          </div>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // GÉNÉRATEUR SCRIPT SCRIPTABLE
  // ════════════════════════════════════════════════════════
  _genererScriptScriptable(data) {
    return `// PowerApp Widget — Scriptable v1.0
// ⚡ Copie ce code dans Scriptable

const DATA = ${JSON.stringify({
  nom:         data.nom,
  avatar:      data.avatar,
  streak:      data.streak,
  xp:          data.xp,
  niveau:      data.niveau,
  niveauEmoji: data.niveauEmoji,
  xpPct:       data.xpPct,
  seanceNom:   data.seanceNom,
  seanceEmoji: data.seanceEmoji,
  seanceDuree: data.seanceDuree,
  seancesSem:  data.seancesSem,
  volumeSem:   data.volumeSem,
  prs:         data.prs,
  date:        new Date().toLocaleDateString('fr-FR')
}, null, 2)};

// ── Couleurs PowerApp ──
const C = {
  bg:      new Color('#06063d'),
  indigo:  new Color('#4b4bf9'),
  mint:    new Color('#8bf0bb'),
  lemon:   new Color('#f9ef77'),
  lavande: new Color('#bfa1ff'),
  muted:   new Color('#ffffff', 0.35),
  white:   new Color('#ffffff')
};

// ── Créer le widget ──
const w = new ListWidget();
w.backgroundColor = C.bg;
w.setPadding(14, 14, 14, 14);

// Gradient
const grad = new LinearGradient();
grad.colors = [new Color('#06063d'), new Color('#0d0d4a')];
grad.locations = [0, 1];
w.backgroundGradient = grad;

// ── Header ──
const header = w.addStack();
header.layoutHorizontally();
header.centerAlignContent();

const logo = header.addText('⚡ PowerApp');
logo.font = Font.boldMonospacedSystemFont(9);
logo.textColor = new Color('#4b4bf9', 0.6);

header.addSpacer();

const date = header.addText(DATA.date);
date.font = Font.systemFont(9);
date.textColor = C.muted;

w.addSpacer(8);

// ── Profil ──
const profil = w.addStack();
profil.layoutHorizontally();
profil.centerAlignContent();

const avatar = profil.addText(DATA.avatar);
avatar.font = Font.systemFont(28);

profil.addSpacer(8);

const infos = profil.addStack();
infos.layoutVertically();

const nom = infos.addText(DATA.nom);
nom.font = Font.boldSystemFont(14);
nom.textColor = C.white;

const niv = infos.addText(\`\${DATA.niveauEmoji} Niv.\${DATA.niveau} · \${DATA.xp} XP\`);
niv.font = Font.systemFont(10);
niv.textColor = new Color('#4b4bf9', 0.7);

profil.addSpacer();

const streakStack = profil.addStack();
streakStack.layoutVertically();
streakStack.centerAlignContent();

const streakVal = streakStack.addText(\`🔥 \${DATA.streak}\`);
streakVal.font = Font.boldSystemFont(16);
streakVal.textColor = C.lemon;

const streakLabel = streakStack.addText('jours');
streakLabel.font = Font.systemFont(9);
streakLabel.textColor = C.muted;

w.addSpacer(10);

// ── Séance ──
const seanceBox = w.addStack();
seanceBox.layoutHorizontally();
seanceBox.centerAlignContent();
seanceBox.backgroundColor = new Color('#4b4bf9', 0.12);
seanceBox.cornerRadius = 10;
seanceBox.setPadding(8, 10, 8, 10);

const seanceEmoji = seanceBox.addText(DATA.seanceEmoji);
seanceEmoji.font = Font.systemFont(20);

seanceBox.addSpacer(8);

const seanceInfos = seanceBox.addStack();
seanceInfos.layoutVertically();

const seanceNom = seanceInfos.addText(DATA.seanceNom);
seanceNom.font = Font.boldSystemFont(12);
seanceNom.textColor = C.white;
seanceNom.lineLimit = 1;

const seanceSub = seanceInfos.addText(\`~\${DATA.seanceDuree}min\`);
seanceSub.font = Font.systemFont(9);
seanceSub.textColor = C.muted;

seanceBox.addSpacer();

const playBtn = seanceBox.addText('▶');
playBtn.font = Font.boldSystemFont(14);
playBtn.textColor = C.indigo;

w.addSpacer(10);

// ── Stats ──
const stats = w.addStack();
stats.layoutHorizontally();

[
  { val: \`\${DATA.seancesSem}\`,  label: 'Séances', color: C.indigo },
  { val: \`\${Math.round(DATA.volumeSem/1000)}t\`, label: 'Volume', color: C.mint },
  { val: \`\${DATA.prs} 🏆\`,     label: 'Records', color: C.lemon }
].forEach((s, i) => {
  const card = stats.addStack();
  card.layoutVertically();
  card.centerAlignContent();
  card.backgroundColor = new Color('#ffffff', 0.04);
  card.cornerRadius = 8;
  card.setPadding(6, 8, 6, 8);

  const val = card.addText(s.val);
  val.font = Font.boldSystemFont(13);
  val.textColor = s.color;
  val.centerAlignText();

  const label = card.addText(s.label);
  label.font = Font.systemFont(8);
  label.textColor = C.muted;
  label.centerAlignText();

  if (i < 2) stats.addSpacer(6);
});

// ── URL d'ouverture ──
w.url = 'powerapp://open';

// ── Présenter ──
if (config.runsInWidget) {
  Script.setWidget(w);
} else {
  w.presentMedium();
}

Script.complete();`;
  },

  // ════════════════════════════════════════════════════════
  // TAB ANDROID
  // ════════════════════════════════════════════════════════
  _renderTabAndroid() {
    return `
      <div style="display:flex;flex-direction:column;gap:12px">

        <!-- KWGT -->
        <div class="card">
          <div style="display:flex;align-items:center;gap:10px;
                      margin-bottom:12px">
            <div style="width:48px;height:48px;border-radius:12px;
                        background:rgba(139,240,187,0.1);
                        border:1px solid rgba(139,240,187,0.25);
                        display:flex;align-items:center;
                        justify-content:center;font-size:1.5rem">
              🤖
            </div>
            <div>
              <div style="font-weight:800;font-size:.92rem">
                KWGT (Recommandé)
              </div>
              <div style="font-size:.65rem;color:var(--text-muted)">
                Widget maker Android · Gratuit + Premium
              </div>
            </div>
          </div>

          ${[
            {
              num:'1', titre:'Installe KWGT',
              desc:'KWGT Kustom Widget Maker sur le Play Store',
              btn:{ label:'📲 Play Store',
                   action:"Widget._ouvrirURL('https://play.google.com/store/apps/details?id=org.kustom.widget')" }
            },
            {
              num:'2', titre:'Ajoute un widget KWGT',
              desc:'Maintiens l\'écran d\'accueil → Widgets → KWGT → choisis la taille',
              btn:null
            },
            {
              num:'3', titre:'Importe le preset',
              desc:'Dans KWGT, appuie sur le widget → Importer le fichier .kwgt',
              btn:{ label:'📥 Télécharger preset',
                   action:'Widget._telechargerPresetKWGT()' }
            },
            {
              num:'4', titre:'Configure la source',
              desc:'Dans KWGT : Globals → URL → Entre l\'URL de ton app PowerApp',
              btn:null
            }
          ].map(e=>`
            <div style="display:flex;gap:10px;
                        align-items:flex-start;
                        margin-bottom:10px">
              <div style="width:26px;height:26px;border-radius:50%;
                          background:rgba(139,240,187,0.15);
                          border:2px solid rgba(139,240,187,0.3);
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.68rem;font-weight:800;
                          color:var(--fd-mint);flex-shrink:0">
                ${e.num}
              </div>
              <div style="flex:1">
                <div style="font-size:.82rem;font-weight:700">
                  ${e.titre}
                </div>
                <div style="font-size:.65rem;color:var(--text-muted);
                            margin-top:2px;line-height:1.4">
                  ${e.desc}
                </div>
                ${e.btn ? `
                  <button onclick="${e.btn.action}"
                          style="margin-top:6px;padding:5px 12px;
                                 background:rgba(139,240,187,0.1);
                                 border:1px solid rgba(139,240,187,0.25);
                                 border-radius:99px;font-size:.68rem;
                                 font-weight:700;color:var(--fd-mint);
                                 cursor:pointer">
                    ${e.btn.label}
                  </button>` : ''}
              </div>
            </div>`).join('')}
        </div>

        <!-- Widgetsmith Alternative -->
        <div class="card">
          <div style="font-size:.75rem;font-weight:800;
                      margin-bottom:8px">
            📱 Alternative — Raccourci Android
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);
                      line-height:1.5;margin-bottom:10px">
            Sans widget, tu peux créer un raccourci direct
            vers PowerApp sur ton écran d'accueil via le navigateur Chrome.
          </div>
          ${[
            'Ouvre PowerApp dans Chrome',
            'Menu (3 points) → "Ajouter à l\'écran d\'accueil"',
            'Confirme → PowerApp apparaît comme une app native'
          ].map((e, i)=>`
            <div style="display:flex;gap:8px;margin-bottom:6px">
              <div style="width:20px;height:20px;border-radius:50%;
                          background:rgba(75,75,249,0.15);
                          display:flex;align-items:center;
                          justify-content:center;
                          font-size:.6rem;font-weight:800;
                          color:var(--fd-indigo);flex-shrink:0">
                ${i+1}
              </div>
              <div style="font-size:.72rem;color:var(--text-muted)">
                ${e}
              </div>
            </div>`).join('')}
        </div>

        <!-- Notifications rapides -->
        <div class="card">
          <div style="font-size:.75rem;font-weight:800;
                      margin-bottom:8px">
            🔔 Widgets notification (Android 12+)
          </div>
          <div style="font-size:.72rem;color:var(--text-muted);
                      line-height:1.5">
            PowerApp envoie des notifications intelligentes
            avec accès rapide à ta séance du jour,
            directement depuis le panneau de notifications.
          </div>
          <button onclick="naviguer('settings')"
                  style="margin-top:10px;padding:8px 16px;
                         background:rgba(75,75,249,0.1);
                         border:1px solid rgba(75,75,249,0.2);
                         border-radius:99px;font-size:.72rem;
                         font-weight:700;color:var(--fd-indigo);
                         cursor:pointer">
            ⚙️ Configurer les notifications
          </button>
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // TAB HTML — Widget autonome
  // ════════════════════════════════════════════════════════
  _renderTabHTML() {
    return `
      <div class="card mb-md">
        <div style="font-weight:800;font-size:.92rem;
                    margin-bottom:8px">
          🌐 Widget HTML autonome
        </div>
        <div style="font-size:.72rem;color:var(--text-muted);
                    line-height:1.5;margin-bottom:14px">
          Télécharge un widget HTML complet avec tes données.
          Utilisable dans n'importe quel outil qui supporte
          l'HTML personnalisé (Notion, Obsidian, etc.)
        </div>

        <!-- Choisir type -->
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:8px;margin-bottom:14px">
          ${[
            { id:'small',  emoji:'📦', label:'Petit', desc:'160×160px' },
            { id:'medium', emoji:'📊', label:'Moyen', desc:'320×160px' },
            { id:'large',  emoji:'📋', label:'Grand', desc:'320×320px' },
            { id:'full',   emoji:'🖥️', label:'Complet', desc:'Toutes les stats' }
          ].map(t=>`
            <button onclick="Widget._selTailleHTML('${t.id}',this)"
                    data-taille="${t.id}"
                    style="padding:10px;text-align:center;
                           background:${t.id==='medium'
                             ?'rgba(75,75,249,0.2)'
                             :'rgba(255,255,255,0.04)'};
                           border:1px solid ${t.id==='medium'
                             ?'var(--fd-indigo)'
                             :'rgba(255,255,255,0.08)'};
                           border-radius:var(--radius-lg);
                           cursor:pointer;font-family:inherit;
                           color:white;transition:all .2s">
              <div style="font-size:1.2rem;margin-bottom:4px">
                ${t.emoji}
              </div>
              <div style="font-size:.75rem;font-weight:700">
                ${t.label}
              </div>
              <div style="font-size:.6rem;color:var(--text-muted)">
                ${t.desc}
              </div>
            </button>`).join('')}
        </div>

        <input type="hidden" id="html-taille" value="medium"/>

        <button onclick="Widget._exporterHTML()"
                class="btn-primary"
                style="width:100%;font-size:.88rem">
          📥 Télécharger le widget HTML
        </button>
      </div>

      <!-- Preview HTML -->
      <div class="card">
        <div class="card-label">👁️ Prévisualisation</div>
        <div id="html-preview"
             style="margin-top:12px;border-radius:var(--radius-lg);
                    overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
          ${this._genererHTMLWidget('medium')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // GÉNÉRATEUR HTML WIDGET
  // ════════════════════════════════════════════════════════
  _genererHTMLWidget(taille = 'medium') {
    const data = this._getData();

    const configs = {
      small: { w:'160px', h:'160px', fontSize:'small'  },
      medium:{ w:'320px', h:'160px', fontSize:'normal' },
      large: { w:'320px', h:'320px', fontSize:'large'  },
      full:  { w:'100%',  h:'auto',  fontSize:'normal' }
    };
    const cfg = configs[taille] || configs.medium;

    return `
      <div style="
        width:${cfg.w};
        height:${cfg.h === 'auto' ? 'auto' : cfg.h};
        background:linear-gradient(135deg,#06063d,#0a0a40);
        border-radius:16px;
        padding:14px;
        font-family:system-ui,sans-serif;
        color:white;
        position:relative;
        overflow:hidden;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        box-shadow:0 8px 32px rgba(0,0,0,0.4);
      ">
        <!-- Glow -->
        <div style="position:absolute;top:-30px;right:-20px;
                    width:100px;height:100px;border-radius:50%;
                    background:radial-gradient(circle,
                      rgba(75,75,249,0.2),transparent 70%);
                    pointer-events:none"></div>

        <!-- Header -->
        <div style="display:flex;justify-content:space-between;
                    align-items:center">
          <span style="font-size:.5rem;font-weight:700;
                       letter-spacing:2px;color:rgba(75,75,249,0.6)">
            ⚡ POWERAPP
          </span>
          <span style="font-size:.5rem;color:rgba(255,255,255,0.3)">
            ${new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>

        <!-- Contenu selon taille -->
        ${taille === 'small' ? `
          <div style="text-align:center">
            <div style="font-size:2rem">🔥</div>
            <div style="font-size:2.2rem;font-weight:900;color:#f9ef77">
              ${data.streak}
            </div>
            <div style="font-size:.58rem;color:rgba(255,255,255,0.4)">
              STREAK
            </div>
          </div>` : `
          <div>
            <div style="display:flex;align-items:center;gap:8px;
                        margin:6px 0">
              <span style="font-size:1.2rem">${data.seanceEmoji}</span>
              <div>
                <div style="font-size:.75rem;font-weight:700">
                  ${data.seanceNom}
                </div>
                <div style="font-size:.55rem;color:rgba(255,255,255,0.4)">
                  ~${data.seanceDuree}min
                </div>
              </div>
            </div>
          </div>`}

        <!-- Footer stats -->
        <div style="display:flex;justify-content:space-between">
          <span style="font-size:.6rem;color:#f9ef77">
            🔥 ${data.streak}j
          </span>
          <span style="font-size:.6rem;color:#8bf0bb">
            📦 ${Utils.formatVolume(data.volumeSem)}
          </span>
          <span style="font-size:.6rem;color:#bfa1ff">
            ⭐ Niv.${data.niveau}
          </span>
        </div>
      </div>`;
  },

  // ════════════════════════════════════════════════════════
  // SWITCH TABS
  // ════════════════════════════════════════════════════════
  _switchTab(tab) {
    ['apercu','ios','android','html'].forEach(t => {
      const btn = document.getElementById(`widget-tab-${t}`);
      if (!btn) return;
      const actif = t === tab;
      btn.style.background = actif
        ? 'rgba(75,75,249,0.2)' : 'transparent';
      btn.style.color = actif
        ? 'var(--fd-indigo)' : 'var(--text-muted)';
    });

    const content = document.getElementById('widget-tab-content');
    if (!content) return;

    switch(tab) {
      case 'apercu':  content.innerHTML = this._renderTabApercu();  break;
      case 'ios':     content.innerHTML = this._renderTabIOS();     break;
      case 'android': content.innerHTML = this._renderTabAndroid(); break;
      case 'html':    content.innerHTML = this._renderTabHTML();    break;
    }
  },

  // ════════════════════════════════════════════════════════
  // ACTIONS
  // ════════════════════════════════════════════════════════
  _installerPWA() {
    if (this._deferredPrompt) {
      this._deferredPrompt.prompt();
      this._deferredPrompt.userChoice.then(result => {
        if (result.outcome === 'accepted') {
          Utils.toast('✅ PowerApp installée !', 'success', 3000);
        }
        this._deferredPrompt = null;
      });
    } else {
      // ✅ Afficher instructions manuelles
      const modal = document.getElementById('modal-info');
      const cont  = document.getElementById('modal-info-content');
      if (!modal || !cont) return;

      cont.innerHTML = `
        <div style="padding:20px">
          <div style="font-size:1rem;font-weight:800;margin-bottom:16px">
            📲 Installer PowerApp
          </div>
          ${[
            { os:'🍎 iPhone / iPad',
              steps:[
                'Ouvre PowerApp dans Safari',
                'Appuie sur le bouton Partager (carré avec flèche)',
                'Défile et appuie sur "Sur l\'écran d\'accueil"',
                'Appuie sur "Ajouter" en haut à droite'
              ]},
            { os:'🤖 Android (Chrome)',
              steps:[
                'Ouvre PowerApp dans Chrome',
                'Appuie sur les 3 points en haut à droite',
                'Sélectionne "Installer l\'application"',
                'Confirme en appuyant sur "Installer"'
              ]}
          ].map(o=>`
            <div style="margin-bottom:16px">
              <div style="font-size:.82rem;font-weight:800;
                          margin-bottom:8px;color:var(--fd-indigo)">
                ${o.os}
              </div>
              ${o.steps.map((s,i)=>`
                <div style="display:flex;gap:8px;margin-bottom:5px">
                  <div style="width:18px;height:18px;border-radius:50%;
                              background:rgba(75,75,249,0.2);
                              font-size:.6rem;font-weight:700;
                              display:flex;align-items:center;
                              justify-content:center;
                              color:var(--fd-indigo);flex-shrink:0">
                    ${i+1}
                  </div>
                  <div style="font-size:.72rem;color:var(--text-muted)">
                    ${s}
                  </div>
                </div>`).join('')}
            </div>`).join('')}
          <button onclick="document.getElementById('modal-info')
                            .classList.add('hidden')"
                  class="btn-primary" style="width:100%">
            ✓ Compris
          </button>
        </div>`;

      modal.classList.remove('hidden');
      const closeBtn = document.getElementById('modal-info-close');
      if (closeBtn) closeBtn.onclick = () => modal.classList.add('hidden');
    }
  },

  _copierScript() {
    const container = document.getElementById('script-container');
    const script    = container?.textContent || '';

    if (navigator.clipboard) {
      navigator.clipboard.writeText(script).then(() => {
        Utils.toast('📋 Code copié !', 'success', 2000);
      });
    } else {
      Utils.toast('Sélectionne et copie manuellement', 'info');
    }
  },

  _telechargerPresetKWGT() {
    // ✅ Générer un fichier JSON KWGT simplifié
    const data    = this._getData();
    const preset  = {
      name:    'PowerApp Widget',
      version: '1.0',
      data:    data,
      globals: {
        streak:    data.streak.toString(),
        nom:       data.nom,
        seance:    data.seanceNom,
        volume:    Utils.formatVolume(data.volumeSem),
        niveau:    data.niveau.toString(),
        xp:        data.xp.toString()
      }
    };

    const blob = new Blob(
      [JSON.stringify(preset, null, 2)],
      { type: 'application/json' }
    );
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = 'powerapp-kwgt.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    Utils.toast('📥 Preset téléchargé !', 'success', 2000);
  },

  _selTailleHTML(taille, btn) {
    document.querySelectorAll('[data-taille]').forEach(b => {
      b.style.background  = 'rgba(255,255,255,0.04)';
      b.style.borderColor = 'rgba(255,255,255,0.08)';
    });
    btn.style.background  = 'rgba(75,75,249,0.2)';
    btn.style.borderColor = 'var(--fd-indigo)';

    const input = document.getElementById('html-taille');
    if (input) input.value = taille;

    // Update preview
    const preview = document.getElementById('html-preview');
    if (preview) {
      preview.innerHTML = this._genererHTMLWidget(taille);
    }
    Utils.vibrer([15]);
  },

  _exporterHTML() {
    const taille = document.getElementById('html-taille')?.value
                || 'medium';
    const widget = this._genererHTMLWidget(taille);

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width">
<title>PowerApp Widget</title>
<style>
  * { margin:0;padding:0;box-sizing:border-box; }
  body {
    display:flex;align-items:center;
    justify-content:center;
    min-height:100vh;
    background:#000;
  }
</style>
</head>
<body>${widget}</body>
</html>`;

    const blob = new Blob([html], { type:'text/html' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = `powerapp-widget-${taille}.html`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    Utils.toast('📥 Widget HTML téléchargé !', 'success', 2000);
  },

  _ouvrirURL(url) {
    window.open(url, '_blank');
  },

  // ════════════════════════════════════════════════════════
  // DONNÉES TEMPS RÉEL
  // ════════════════════════════════════════════════════════
  _getData() {
    let profil   = { nom:'Athlète', avatar:'💪' };
    let xp       = { total:0, pourcentage:0,
                     niveau:{ numero:1, nom:'Débutant', emoji:'💪' } };
    let streak   = { count:0 };
    let seance   = null;
    let analyse  = { seances:0, volume:0, rpe:0 };
    let prs      = 0;
    let volJours = { Lun:0, Mar:0, Mer:0, Jeu:0, Ven:0, Sam:0, Dom:0 };

    try { profil  = Tracker.getProfil();          } catch(e) {}
    try { xp      = Gamification.getXP();          } catch(e) {}
    try { streak  = Tracker.getStreak();           } catch(e) {}
    try { seance  = Programme.getSeanceduJour();   } catch(e) {}
    try { analyse = Coach.getAnalyseSemaine();     } catch(e) {}
    try {
      const debut = Utils.debutSemaine(Utils.aujourd_hui());
      const fin   = Utils.finSemaine(Utils.aujourd_hui());
      const seances = Tracker.getSeancesSemaine?.(debut, fin) || [];
      prs = seances.reduce(
        (a, s) => a + (s.prs?.length||0), 0
      );
      const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dom'];
      seances.forEach(s => {
        const d   = new Date(s.date);
        const idx = (d.getDay()+6)%7;
        volJours[JOURS[idx]] =
          (volJours[JOURS[idx]]||0) + (s.volumeTotal||0);
      });
    } catch(e) {}

    return {
      nom:         profil.nom || 'Athlète',
      avatar:      profil.avatar || '💪',
      streak:      streak.count || 0,
      xp:          xp.total || 0,
      xpPct:       xp.pourcentage || 0,
      niveau:      xp.niveau?.numero || 1,
      niveauEmoji: xp.niveau?.emoji || '💪',
      seanceNom:   seance?.nom || 'Repos',
      seanceEmoji: seance?.emoji || '😴',
      seanceDuree: seance?.duree_estimee || 0,
      seanceExos:  seance?.exercices?.length || 0,
      seancesSem:  analyse.seances || 0,
      volumeSem:   analyse.volume || 0,
      rpe:         analyse.rpe || 0,
      prs,
      volumeJours: volJours
    };
  },

  // ════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════
  getConfig() {
    return Utils.storage.get(this.CLE_CONFIG, {
      taille:  'medium',
      type:    'full',
      theme:   'dark'
    });
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  init() {
    // ✅ Capturer le prompt d'installation PWA
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this._deferredPrompt = e;
      console.log('[Widget] PWA install prompt capturé');
    });

    window.addEventListener('appinstalled', () => {
      Utils.toast('✅ PowerApp installée !', 'success', 3000);
      this._deferredPrompt = null;
    });

    // ✅ Mettre à jour le cache widget toutes les 5min
    setInterval(() => {
      try {
        const data = this._getData();
        Utils.storage.set(this.CLE_CACHE, {
          ...data, timestamp: Date.now()
        });
      } catch(e) {}
    }, 5 * 60 * 1000);

    console.log('[Widget] Initialisé ✅');
  }
};

window.Widget = Widget;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    try { Widget.init(); } catch(e) {}
  }, 2000);
});

console.log('✅ Widget.js v1.0 chargé');
