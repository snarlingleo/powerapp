/* ============================================================
   PowerApp — Themes.js v1.0
   ✅ 6 thèmes complets
   ✅ Couleurs d'accent personnalisables
   ✅ Mode clair amélioré
   ✅ Thème AMOLED
   ✅ Thème Fondever brand
   ✅ Application instantanée
   ============================================================ */

'use strict';

const Themes = {

  CLE: 'ft_theme_actif',
  CLE_CYBER: 'ft_theme_style', 

  // ════════════════════════════════════════════════════════
  // DÉFINITIONS DES THÈMES
  // ════════════════════════════════════════════════════════
  THEMES: {

    // ── THÈMES CLASSIQUES ──────────────────────────────
    {
      id:          'dark',
      nom:         'Dark',
      emoji:       '🌑',
      description: 'Sombre élégant — défaut',
      preview:     '#09092d',
      c1: '#4b4bf9', c2: '#7b2ff7', c3: '#bfa1ff',
      bg: '#06061e',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#06061e',
        '--bg-card':        'rgba(255,255,255,0.04)',
        '--bg-input':       'rgba(255,255,255,0.06)',
        '--border-color':   'rgba(255,255,255,0.08)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted':     'rgba(255,255,255,0.4)',
        '--fd-indigo':      '#4b4bf9',
        '--fd-midnight':    '#09092d',
        '--fd-lemon':       '#f9ef77',
        '--fd-coral':       '#ff8d96',
        '--fd-mint':        '#8bf0bb',
        '--fd-lavender':    '#bfa1ff'
      }
    },

    {
      id:          'amoled',
      nom:         'AMOLED',
      emoji:       '⚫',
      description: 'Noir pur — économise la batterie',
      preview:     '#000000',
      c1: '#5c5cff', c2: '#8b2fff', c3: '#bfa1ff',
      bg: '#000000',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#000000',
        '--bg-card':        'rgba(255,255,255,0.03)',
        '--bg-input':       'rgba(255,255,255,0.05)',
        '--border-color':   'rgba(255,255,255,0.07)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted':     'rgba(255,255,255,0.35)',
        '--fd-indigo':      '#5c5cff',
        '--fd-midnight':    '#000000',
        '--fd-lemon':       '#f9ef77',
        '--fd-coral':       '#ff8d96',
        '--fd-mint':        '#8bf0bb',
        '--fd-lavender':    '#bfa1ff'
      }
    },

    {
      id:          'light',
      nom:         'Light',
      emoji:       '☀️',
      description: 'Clair — idéal en extérieur',
      preview:     '#f3f3f7',
      c1: '#4b4bf9', c2: '#7b2ff7', c3: '#9b59b6',
      bg: '#f3f3f7',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#f3f3f7',
        '--bg-card':        '#ffffff',
        '--bg-input':       'rgba(0,0,0,0.05)',
        '--border-color':   'rgba(0,0,0,0.1)',
        '--text-primary':   '#09092d',
        '--text-secondary': 'rgba(9,9,45,0.75)',
        '--text-muted':     'rgba(9,9,45,0.45)',
        '--fd-indigo':      '#4b4bf9',
        '--fd-midnight':    '#09092d',
        '--fd-lemon':       '#e8b800',
        '--fd-coral':       '#e85560',
        '--fd-mint':        '#22b06a',
        '--fd-lavender':    '#7b55dd'
      }
    },

    {
      id:          'indigo',
      nom:         'Indigo',
      emoji:       '💜',
      description: 'Violet intense — premium',
      preview:     '#0d0d2b',
      c1: '#6c6cff', c2: '#9b2fff', c3: '#bfa1ff',
      bg: '#07071a',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#07071a',
        '--bg-card':        'rgba(75,75,249,0.06)',
        '--bg-input':       'rgba(75,75,249,0.08)',
        '--border-color':   'rgba(75,75,249,0.15)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted':     'rgba(191,161,255,0.5)',
        '--fd-indigo':      '#6c6cff',
        '--fd-midnight':    '#07071a',
        '--fd-lemon':       '#f9ef77',
        '--fd-coral':       '#ff8d96',
        '--fd-mint':        '#8bf0bb',
        '--fd-lavender':    '#bfa1ff'
      }
    },

    {
      id:          'coral',
      nom:         'Coral',
      emoji:       '🪸',
      description: 'Corail chaleureux & énergique',
      preview:     '#1a0a0d',
      c1: '#ff6b78', c2: '#ff4757', c3: '#ff8d96',
      bg: '#100608',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#100608',
        '--bg-card':        'rgba(255,141,150,0.05)',
        '--bg-input':       'rgba(255,141,150,0.08)',
        '--border-color':   'rgba(255,141,150,0.15)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted':     'rgba(255,141,150,0.5)',
        '--fd-indigo':      '#4b4bf9',
        '--fd-midnight':    '#100608',
        '--fd-lemon':       '#f9ef77',
        '--fd-coral':       '#ff6b78',
        '--fd-mint':        '#8bf0bb',
        '--fd-lavender':    '#bfa1ff'
      }
    },

    {
      id:          'mint',
      nom:         'Mint',
      emoji:       '🌿',
      description: 'Vert nature & fraîcheur',
      preview:     '#061510',
      c1: '#5ddaa0', c2: '#22b06a', c3: '#8bf0bb',
      bg: '#040e09',
      categorie: 'classique',
      vars: {
        '--bg-app':         '#040e09',
        '--bg-card':        'rgba(139,240,187,0.04)',
        '--bg-input':       'rgba(139,240,187,0.07)',
        '--border-color':   'rgba(139,240,187,0.12)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted':     'rgba(139,240,187,0.45)',
        '--fd-indigo':      '#4b4bf9',
        '--fd-midnight':    '#040e09',
        '--fd-lemon':       '#f9ef77',
        '--fd-coral':       '#ff8d96',
        '--fd-mint':        '#5ddaa0',
        '--fd-lavender':    '#bfa1ff'
      }
    },

    // ── THÈMES CYBER ───────────────────────────────────
    {
      id:          'cyber-blue',
      nom:         'Cyber Blue',
      emoji:       '🔵',
      description: 'Néon bleu électrique',
      preview:     '#020610',
      c1: '#00cfff', c2: '#0066ff', c3: '#7b00ff',
      bg: '#020610',
      categorie: 'cyber',
      vars: {
        '--bg-app':         '#020610',
        '--bg-card':        'rgba(0,20,60,0.4)',
        '--bg-input':       'rgba(0,20,60,0.3)',
        '--border-color':   'rgba(0,100,255,0.12)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted':     'rgba(0,207,255,0.45)',
        '--fd-indigo':      '#0066ff',
        '--fd-midnight':    '#020610',
        '--fd-lemon':       '#00cfff',
        '--fd-coral':       '#7b00ff',
        '--fd-mint':        '#00cfff',
        '--fd-lavender':    '#7b00ff'
      }
    },

    {
      id:          'lava-neon',
      nom:         'Lava Neon',
      emoji:       '🔴',
      description: 'Rouge lave & orange brûlant',
      preview:     '#120606',
      c1: '#ff6b35', c2: '#ff0066', c3: '#ff3300',
      bg: '#120606',
      categorie: 'cyber',
      vars: {
        '--bg-app':         '#120606',
        '--bg-card':        'rgba(60,10,10,0.4)',
        '--bg-input':       'rgba(60,10,10,0.3)',
        '--border-color':   'rgba(255,80,20,0.15)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted':     'rgba(255,107,53,0.45)',
        '--fd-indigo':      '#ff0066',
        '--fd-midnight':    '#120606',
        '--fd-lemon':       '#ff6b35',
        '--fd-coral':       '#ff3300',
        '--fd-mint':        '#ff6b35',
        '--fd-lavender':    '#ff0066'
      }
    },

    {
      id:          'deep-purple',
      nom:         'Deep Purple',
      emoji:       '🟣',
      description: 'Violet profond & mystérieux',
      preview:     '#080612',
      c1: '#bf7fff', c2: '#8b00ff', c3: '#ff00aa',
      bg: '#080612',
      categorie: 'cyber',
      vars: {
        '--bg-app':         '#080612',
        '--bg-card':        'rgba(20,10,40,0.4)',
        '--bg-input':       'rgba(20,10,40,0.3)',
        '--border-color':   'rgba(139,0,255,0.15)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted':     'rgba(191,127,255,0.45)',
        '--fd-indigo':      '#8b00ff',
        '--fd-midnight':    '#080612',
        '--fd-lemon':       '#bf7fff',
        '--fd-coral':       '#ff00aa',
        '--fd-mint':        '#bf7fff',
        '--fd-lavender':    '#ff00aa'
      }
    },

    {
      id:          'matrix-green',
      nom:         'Matrix',
      emoji:       '🟢',
      description: 'Vert néon — style hacker',
      preview:     '#020c06',
      c1: '#00ff88', c2: '#00cc44', c3: '#00ffcc',
      bg: '#020c06',
      categorie: 'cyber',
      vars: {
        '--bg-app':         '#020c06',
        '--bg-card':        'rgba(0,20,10,0.4)',
        '--bg-input':       'rgba(0,20,10,0.3)',
        '--border-color':   'rgba(0,180,60,0.15)',
        '--text-primary':   '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted':     'rgba(0,255,136,0.45)',
        '--fd-indigo':      '#00cc44',
        '--fd-midnight':    '#020c06',
        '--fd-lemon':       '#00ff88',
        '--fd-coral':       '#00ffcc',
        '--fd-mint':        '#00ff88',
        '--fd-lavender':    '#00ffcc'
      }
    },

    {
      id:          'arctic-white',
      nom:         'Arctic',
      emoji:       '⚪',
      description: 'Blanc glacé & épuré',
      preview:     '#f0f4ff',
      c1: '#0066ff', c2: '#0044cc', c3: '#4b4bf9',
      bg: '#f0f4ff',
      categorie: 'cyber',
      vars: {
        '--bg-app':         '#e8eeff',
        '--bg-card':        'rgba(255,255,255,0.95)',
        '--bg-input':       'rgba(0,50,150,0.05)',
        '--border-color':   'rgba(0,100,255,0.1)',
        '--text-primary':   '#09092d',
        '--text-secondary': 'rgba(9,9,45,0.85)',
        '--text-muted':     'rgba(0,100,200,0.5)',
        '--fd-indigo':      '#0066ff',
        '--fd-midnight':    '#09092d',
        '--fd-lemon':       '#0066ff',
        '--fd-coral':       '#0044cc',
        '--fd-mint':        '#0066ff',
        '--fd-lavender':    '#4b4bf9'
      }
    }
  },

// ════════════════════════════════════════════════════════
  // APPLIQUER UN THÈME — Système unifié
  // ════════════════════════════════════════════════════════
  appliquer(themeId) {
    const theme = this.THEMES.find(t => t.id === themeId);
    if (!theme) {
      // Fallback dark si thème inconnu
      const dark = this.THEMES.find(t => t.id === 'dark');
      if (dark) this.appliquer('dark');
      return;
    }

    const root = document.documentElement;

    // ✅ Appliquer variables CSS
    Object.entries(theme.vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });

    // ✅ Mettre à jour data-theme ET data-theme-style
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-theme-style', themeId);

    // ✅ Sauvegarder dans les 2 clés (compatibilité)
    Utils.storage.set(this.CLE, themeId);
    Utils.storage.set(this.CLE_CYBER, themeId);

    // ✅ Meta theme-color
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme      = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme.preview;

    // ✅ Mettre à jour les sparks Cyber
    this._updateSparks(theme);

    return theme;
  },

  // ✅ Sparks selon couleur thème
  _updateSparks(theme) {
    const style = document.getElementById('cb-sparks-theme')
      || document.createElement('style');
    style.id = 'cb-sparks-theme';

    if (theme.id === 'arctic-white' || theme.id === 'light') {
      style.textContent = `.cb-spark,.cb-glow-dot{display:none!important}`;
    } else {
      style.textContent = `
        .cb-spark {
          background:linear-gradient(180deg,${theme.c1},transparent)!important;
          box-shadow:0 0 6px ${theme.c1}!important;
        }
        .cb-spark-purple {
          background:linear-gradient(180deg,${theme.c3},transparent)!important;
          box-shadow:0 0 6px ${theme.c3}!important;
        }
        .cb-spark-blue {
          background:linear-gradient(180deg,${theme.c2},transparent)!important;
          box-shadow:0 0 6px ${theme.c2}!important;
        }
      `;
    }
    if (!document.getElementById('cb-sparks-theme')) {
      document.head.appendChild(style);
    }
  },

  // ════════════════════════════════════════════════════════
  // INITIALISER
  // ════════════════════════════════════════════════════════
  init() {
    // ✅ Chercher dans les 2 clés
    const saved = Utils.storage.get(this.CLE, null)
      || Utils.storage.get(this.CLE_CYBER, null)
      || Utils.storage.get('ft_theme_config', null)
      || 'dark';

    // Compatibilité anciens noms
    const mapping = {
      'cyber-blue':  'cyber-blue',
      'lava-neon':   'lava-neon',
      'deep-purple': 'deep-purple',
      'matrix-green':'matrix-green',
      'arctic-white':'arctic-white',
      'dark':        'dark',
      'amoled':      'amoled',
      'light':       'light',
      'indigo':      'indigo',
      'coral':       'coral',
      'mint':        'mint'
    };

    this.appliquer(mapping[saved] || 'dark');
  },

  get(themeId = null) {
    if (themeId) return this.THEMES.find(t => t.id === themeId);
    const saved = Utils.storage.get(this.CLE, 'dark');
    return this.THEMES.find(t => t.id === saved) || this.THEMES[0];
  },

  getActif() {
    return Utils.storage.get(this.CLE, 'dark');
  },

  // ✅ Méthode set() pour compatibilité app.js
  set(id) {
    return this.appliquer(id);
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;
    const actifId = this.getActif();

    // Grouper par catégorie
    const classiques = this.THEMES.filter(t => t.categorie === 'classique');
    const cyber      = this.THEMES.filter(t => t.categorie === 'cyber');

    container.innerHTML = `

      <!-- Header -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--fd-indigo);margin-bottom:4px">
          🎨 Thèmes visuels
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          ${this.THEMES.length} thèmes disponibles · Application instantanée
        </div>
      </div>

      <!-- Section Classiques -->
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);
                  margin:0 0 10px;
                  display:flex;align-items:center;gap:8px">
        🌙 Classiques
        <div style="flex:1;height:1px;background:var(--border-color)"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:8px;margin-bottom:14px">
        ${classiques.map(t => this._renderCard(t, actifId)).join('')}
      </div>

      <!-- Section Cyber -->
      <div style="font-size:.6rem;font-weight:700;
                  text-transform:uppercase;letter-spacing:.1em;
                  color:var(--text-muted);
                  margin:0 0 10px;
                  display:flex;align-items:center;gap:8px">
        ⚡ Cyber
        <div style="flex:1;height:1px;background:var(--border-color)"></div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;
                  gap:8px;margin-bottom:14px">
        ${cyber.map(t => this._renderCard(t, actifId)).join('')}
      </div>

      <!-- Aperçu live -->
      <div style="background:var(--bg-card);
                  border:1px solid var(--border-color);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;
                    text-transform:uppercase;letter-spacing:.1em;
                    color:var(--text-muted);margin-bottom:12px">
          👁️ Aperçu en direct
        </div>

        <!-- Fausse carte -->
        <div style="background:var(--bg-input);
                    border:1px solid var(--border-color);
                    border-radius:var(--radius-lg);
                    padding:12px;margin-bottom:8px">
          <div style="font-size:.82rem;font-weight:700;
                      color:var(--text-primary);margin-bottom:4px">
            💪 Bench Press — PR
          </div>
          <div style="font-size:.65rem;color:var(--text-muted)">
            105kg × 3 reps · 1RM ~113kg
          </div>
          <div style="height:5px;background:var(--bg-app);
                      border-radius:99px;overflow:hidden;margin-top:8px">
            <div style="height:100%;width:85%;
                        background:var(--fd-indigo);
                        border-radius:99px"></div>
          </div>
        </div>

        <!-- Fausses stats -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
          ${[
            { val:'247', label:'Séances', color:'var(--fd-indigo)' },
            { val:'18🔥',label:'Streak',  color:'var(--fd-lemon)'  },
            { val:'32',  label:'PRs',     color:'var(--fd-mint)'   }
          ].map(s => `
            <div style="background:var(--bg-input);
                        border:1px solid var(--border-color);
                        border-radius:var(--radius-md);
                        padding:8px;text-align:center">
              <div style="font-size:.88rem;font-weight:800;
                          color:${s.color}">${s.val}</div>
              <div style="font-size:.58rem;
                          color:var(--text-muted)">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Thème actif -->
      <div style="padding:12px 14px;
                  background:rgba(75,75,249,0.06);
                  border:1px solid rgba(75,75,249,0.12);
                  border-radius:var(--radius-md);
                  font-size:.72rem;color:var(--text-muted)">
        Thème actif :
        <strong style="color:var(--fd-indigo)">
          ${this.get()?.emoji || ''} ${this.get()?.nom || actifId}
        </strong>
        — Mémorisé automatiquement
      </div>
    `;
  },

  _renderCard(theme, actifId) {
    const estActif = actifId === theme.id;
    const isLight  = theme.id === 'light' || theme.id === 'arctic-white';

    return `
      <div onclick="Themes._selectionnerTheme('${theme.id}')"
           style="background:${theme.preview};
                  border:${estActif
                    ? '2px solid var(--fd-indigo)'
                    : '1px solid rgba(255,255,255,0.08)'};
                  border-radius:var(--radius-xl);
                  padding:14px;cursor:pointer;
                  position:relative;overflow:hidden;
                  transition:all .2s;
                  ${estActif ? `box-shadow:0 0 16px ${theme.c1}44` : ''}">

        <!-- Badge actif -->
        ${estActif ? `
          <div style="position:absolute;top:8px;right:8px;
                      padding:2px 8px;font-size:.56rem;
                      font-weight:700;background:var(--fd-indigo);
                      border-radius:99px;color:white">
            ✓ Actif
          </div>` : ''}

        <!-- Palette couleurs -->
        <div style="display:flex;gap:4px;margin-bottom:8px">
          <div style="width:10px;height:10px;border-radius:50%;
                      background:${theme.c1}"></div>
          <div style="width:10px;height:10px;border-radius:50%;
                      background:${theme.c2}"></div>
          <div style="width:10px;height:10px;border-radius:50%;
                      background:${theme.c3}"></div>
        </div>

        <!-- Emoji + Nom -->
        <div style="font-size:1.1rem;margin-bottom:3px">${theme.emoji}</div>
        <div style="font-size:.8rem;font-weight:800;
                    color:${isLight ? '#09092d' : 'white'}">
          ${theme.nom}
        </div>
        <div style="font-size:.58rem;margin-top:2px;
                    color:${isLight
                      ? 'rgba(9,9,45,0.5)'
                      : 'rgba(255,255,255,0.4)'}">
          ${theme.description}
        </div>

        <!-- Mini preview -->
        <div style="margin-top:8px;border-radius:5px;padding:5px;
                    background:${theme.vars['--bg-card'] || 'rgba(255,255,255,0.05)'};
                    border:1px solid ${theme.vars['--border-color'] || 'rgba(255,255,255,0.08)'}">
          <div style="height:4px;border-radius:2px;
                      background:${theme.c1};width:70%;
                      margin-bottom:3px"></div>
          <div style="height:3px;border-radius:2px;
                      background:${theme.vars['--text-muted'] || 'rgba(255,255,255,0.3)'};
                      width:90%"></div>
        </div>
      </div>
    `;
  },

  _selectionnerTheme(id) {
    this.appliquer(id);

    // ✅ Mettre à jour nav + header
    try {
      const oldNavCss = document.getElementById('cb-nav-css');
      if (oldNavCss) oldNavCss.remove();
      _rendreNavBar();
    } catch(e) {}
    try { _updateHeader(window._pageActive || 'home'); } catch(e) {}

    // ✅ Mettre à jour lava si dispo
    try {
      if (typeof LavaBackground !== 'undefined') {
        LavaBackground._getTheme();
      }
    } catch(e) {}

    try { Sounds?.jouer('clic'); } catch(e) {}

    const theme = this.THEMES.find(t => t.id === id);
    Utils.toast(
      `${theme?.emoji || '🎨'} Thème ${theme?.nom || id} appliqué !`,
      'success', 1500
    );

    // Re-render page
    const c = document.getElementById('page-themes');
    if (c) this.render(c);
  }

}; // ← fin Themes

window.Themes = Themes;
console.log('✅ Themes.js v2.0 — 11 thèmes unifiés (Classiques + Cyber)');
