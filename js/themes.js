/* ============================================================
   PowerApp — Themes.js v2.0
   ✅ 11 thèmes unifiés
   ============================================================ */

'use strict';

const Themes = {

  CLE:       'ft_theme_actif',
  CLE_CYBER: 'ft_theme_style',

  THEMES: [
    {
      id: 'dark',
      nom: 'Dark',
      emoji: '🌑',
      description: 'Sombre élégant — défaut',
      preview: '#09092d',
      c1: '#4b4bf9', c2: '#7b2ff7', c3: '#bfa1ff',
      bg: '#06061e',
      categorie: 'classique',
      vars: {
        '--bg-app': '#06061e',
        '--bg-card': 'rgba(255,255,255,0.04)',
        '--bg-input': 'rgba(255,255,255,0.06)',
        '--border-color': 'rgba(255,255,255,0.08)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted': 'rgba(255,255,255,0.4)',
        '--fd-indigo': '#4b4bf9',
        '--fd-midnight': '#09092d',
        '--fd-lemon': '#f9ef77',
        '--fd-coral': '#ff8d96',
        '--fd-mint': '#8bf0bb',
        '--fd-lavender': '#bfa1ff'
      }
    },
    {
      id: 'amoled',
      nom: 'AMOLED',
      emoji: '⚫',
      description: 'Noir pur — économise la batterie',
      preview: '#000000',
      c1: '#5c5cff', c2: '#8b2fff', c3: '#bfa1ff',
      bg: '#000000',
      categorie: 'classique',
      vars: {
        '--bg-app': '#000000',
        '--bg-card': 'rgba(255,255,255,0.03)',
        '--bg-input': 'rgba(255,255,255,0.05)',
        '--border-color': 'rgba(255,255,255,0.07)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted': 'rgba(255,255,255,0.35)',
        '--fd-indigo': '#5c5cff',
        '--fd-midnight': '#000000',
        '--fd-lemon': '#f9ef77',
        '--fd-coral': '#ff8d96',
        '--fd-mint': '#8bf0bb',
        '--fd-lavender': '#bfa1ff'
      }
    },
    {
      id: 'light',
      nom: 'Light',
      emoji: '☀️',
      description: 'Clair — idéal en extérieur',
      preview: '#f3f3f7',
      c1: '#4b4bf9', c2: '#7b2ff7', c3: '#9b59b6',
      bg: '#f3f3f7',
      categorie: 'classique',
      vars: {
        '--bg-app': '#f3f3f7',
        '--bg-card': '#ffffff',
        '--bg-input': 'rgba(0,0,0,0.05)',
        '--border-color': 'rgba(0,0,0,0.1)',
        '--text-primary': '#09092d',
        '--text-secondary': 'rgba(9,9,45,0.75)',
        '--text-muted': 'rgba(9,9,45,0.45)',
        '--fd-indigo': '#4b4bf9',
        '--fd-midnight': '#09092d',
        '--fd-lemon': '#e8b800',
        '--fd-coral': '#e85560',
        '--fd-mint': '#22b06a',
        '--fd-lavender': '#7b55dd'
      }
    },
    {
      id: 'indigo',
      nom: 'Indigo',
      emoji: '💜',
      description: 'Violet intense — premium',
      preview: '#0d0d2b',
      c1: '#6c6cff', c2: '#9b2fff', c3: '#bfa1ff',
      bg: '#07071a',
      categorie: 'classique',
      vars: {
        '--bg-app': '#07071a',
        '--bg-card': 'rgba(75,75,249,0.06)',
        '--bg-input': 'rgba(75,75,249,0.08)',
        '--border-color': 'rgba(75,75,249,0.15)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted': 'rgba(191,161,255,0.5)',
        '--fd-indigo': '#6c6cff',
        '--fd-midnight': '#07071a',
        '--fd-lemon': '#f9ef77',
        '--fd-coral': '#ff8d96',
        '--fd-mint': '#8bf0bb',
        '--fd-lavender': '#bfa1ff'
      }
    },
    {
      id: 'coral',
      nom: 'Coral',
      emoji: '🪸',
      description: 'Corail chaleureux',
      preview: '#1a0a0d',
      c1: '#ff6b78', c2: '#ff4757', c3: '#ff8d96',
      bg: '#100608',
      categorie: 'classique',
      vars: {
        '--bg-app': '#100608',
        '--bg-card': 'rgba(255,141,150,0.05)',
        '--bg-input': 'rgba(255,141,150,0.08)',
        '--border-color': 'rgba(255,141,150,0.15)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted': 'rgba(255,141,150,0.5)',
        '--fd-indigo': '#4b4bf9',
        '--fd-midnight': '#100608',
        '--fd-lemon': '#f9ef77',
        '--fd-coral': '#ff6b78',
        '--fd-mint': '#8bf0bb',
        '--fd-lavender': '#bfa1ff'
      }
    },
    {
      id: 'mint',
      nom: 'Mint',
      emoji: '🌿',
      description: 'Vert nature',
      preview: '#061510',
      c1: '#5ddaa0', c2: '#22b06a', c3: '#8bf0bb',
      bg: '#040e09',
      categorie: 'classique',
      vars: {
        '--bg-app': '#040e09',
        '--bg-card': 'rgba(139,240,187,0.04)',
        '--bg-input': 'rgba(139,240,187,0.07)',
        '--border-color': 'rgba(139,240,187,0.12)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.75)',
        '--text-muted': 'rgba(139,240,187,0.45)',
        '--fd-indigo': '#4b4bf9',
        '--fd-midnight': '#040e09',
        '--fd-lemon': '#f9ef77',
        '--fd-coral': '#ff8d96',
        '--fd-mint': '#5ddaa0',
        '--fd-lavender': '#bfa1ff'
      }
    },
    {
      id: 'cyber-blue',
      nom: 'Cyber Blue',
      emoji: '🔵',
      description: 'Néon bleu électrique',
      preview: '#020610',
      c1: '#00cfff', c2: '#0066ff', c3: '#7b00ff',
      bg: '#020610',
      categorie: 'cyber',
      defaut: true,
      vars: {
        '--bg-app': '#020610',
        '--bg-card': 'rgba(0,20,60,0.4)',
        '--bg-input': 'rgba(0,20,60,0.3)',
        '--border-color': 'rgba(0,100,255,0.12)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted': 'rgba(0,207,255,0.45)',
        '--fd-indigo': '#0066ff',
        '--fd-midnight': '#020610',
        '--fd-lemon': '#00cfff',
        '--fd-coral': '#7b00ff',
        '--fd-mint': '#00cfff',
        '--fd-lavender': '#7b00ff'
      }
    },
    {
      id: 'lava-neon',
      nom: 'Lava Neon',
      emoji: '🔴',
      description: 'Rouge lave brûlant',
      preview: '#120606',
      c1: '#ff6b35', c2: '#ff0066', c3: '#ff3300',
      bg: '#120606',
      categorie: 'cyber',
      vars: {
        '--bg-app': '#120606',
        '--bg-card': 'rgba(60,10,10,0.4)',
        '--bg-input': 'rgba(60,10,10,0.3)',
        '--border-color': 'rgba(255,80,20,0.15)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted': 'rgba(255,107,53,0.45)',
        '--fd-indigo': '#ff0066',
        '--fd-midnight': '#120606',
        '--fd-lemon': '#ff6b35',
        '--fd-coral': '#ff3300',
        '--fd-mint': '#ff6b35',
        '--fd-lavender': '#ff0066'
      }
    },
    {
      id: 'deep-purple',
      nom: 'Deep Purple',
      emoji: '🟣',
      description: 'Violet profond',
      preview: '#080612',
      c1: '#bf7fff', c2: '#8b00ff', c3: '#ff00aa',
      bg: '#080612',
      categorie: 'cyber',
      vars: {
        '--bg-app': '#080612',
        '--bg-card': 'rgba(20,10,40,0.4)',
        '--bg-input': 'rgba(20,10,40,0.3)',
        '--border-color': 'rgba(139,0,255,0.15)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted': 'rgba(191,127,255,0.45)',
        '--fd-indigo': '#8b00ff',
        '--fd-midnight': '#080612',
        '--fd-lemon': '#bf7fff',
        '--fd-coral': '#ff00aa',
        '--fd-mint': '#bf7fff',
        '--fd-lavender': '#ff00aa'
      }
    },
    {
      id: 'matrix-green',
      nom: 'Matrix',
      emoji: '🟢',
      description: 'Vert néon hacker',
      preview: '#020c06',
      c1: '#00ff88', c2: '#00cc44', c3: '#00ffcc',
      bg: '#020c06',
      categorie: 'cyber',
      vars: {
        '--bg-app': '#020c06',
        '--bg-card': 'rgba(0,20,10,0.4)',
        '--bg-input': 'rgba(0,20,10,0.3)',
        '--border-color': 'rgba(0,180,60,0.15)',
        '--text-primary': '#ffffff',
        '--text-secondary': 'rgba(255,255,255,0.85)',
        '--text-muted': 'rgba(0,255,136,0.45)',
        '--fd-indigo': '#00cc44',
        '--fd-midnight': '#020c06',
        '--fd-lemon': '#00ff88',
        '--fd-coral': '#00ffcc',
        '--fd-mint': '#00ff88',
        '--fd-lavender': '#00ffcc'
      }
    },
    {
      id: 'arctic-white',
      nom: 'Arctic',
      emoji: '⚪',
      description: 'Blanc glacé épuré',
      preview: '#f0f4ff',
      c1: '#0066ff', c2: '#0044cc', c3: '#4b4bf9',
      bg: '#f0f4ff',
      categorie: 'cyber',
      vars: {
        '--bg-app': '#e8eeff',
        '--bg-card': 'rgba(255,255,255,0.95)',
        '--bg-input': 'rgba(0,50,150,0.05)',
        '--border-color': 'rgba(0,100,255,0.1)',
        '--text-primary': '#09092d',
        '--text-secondary': 'rgba(9,9,45,0.85)',
        '--text-muted': 'rgba(0,100,200,0.5)',
        '--fd-indigo': '#0066ff',
        '--fd-midnight': '#09092d',
        '--fd-lemon': '#0066ff',
        '--fd-coral': '#0044cc',
        '--fd-mint': '#0066ff',
        '--fd-lavender': '#4b4bf9'
      }
    }
  ],

  // ════════════════════════════════════════════════
  // MÉTHODES
  // ════════════════════════════════════════════════

  appliquer(themeId) {
    const theme = this.THEMES.find(function(t) { return t.id === themeId; });
    if (!theme) {
      if (themeId !== 'dark') this.appliquer('dark');
      return null;
    }

    const root = document.documentElement;

    Object.keys(theme.vars).forEach(function(prop) {
      root.style.setProperty(prop, theme.vars[prop]);
    });

    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-theme-style', themeId);

    try { Utils.storage.set('ft_theme_actif', themeId); } catch(e) {}
    try { Utils.storage.set('ft_theme_style', themeId); } catch(e) {}

    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme.preview;

    this._updateSparks(theme);

    return theme;
  },

  _updateSparks(theme) {
    var style = document.getElementById('cb-sparks-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'cb-sparks-theme';
      document.head.appendChild(style);
    }

    if (theme.id === 'arctic-white' || theme.id === 'light') {
      style.textContent = '.cb-spark,.cb-glow-dot{display:none!important}';
    } else {
      style.textContent = [
        '.cb-spark{',
        'background:linear-gradient(180deg,' + theme.c1 + ',transparent)!important;',
        'box-shadow:0 0 6px ' + theme.c1 + '!important}',
        '.cb-spark-purple{',
        'background:linear-gradient(180deg,' + theme.c3 + ',transparent)!important;',
        'box-shadow:0 0 6px ' + theme.c3 + '!important}',
        '.cb-spark-blue{',
        'background:linear-gradient(180deg,' + theme.c2 + ',transparent)!important;',
        'box-shadow:0 0 6px ' + theme.c2 + '!important}'
      ].join('');
    }
  },

  init() {
    var saved = null;
    try { saved = Utils.storage.get('ft_theme_actif', null); } catch(e) {}
    if (!saved) {
      try { saved = Utils.storage.get('ft_theme_style', null); } catch(e) {}
    }
    if (!saved) {
      try { saved = Utils.storage.get('ft_theme_config', null); } catch(e) {}
    }
    this.appliquer(saved || 'cyber-blue');
  },

  get: function(themeId) {
    if (themeId) {
      return this.THEMES.find(function(t) { return t.id === themeId; }) || null;
    }
    var saved = null;
    try { saved = Utils.storage.get('ft_theme_actif', 'cyber-blue'); } catch(e) { saved = 'cyber-blue'; }
    return this.THEMES.find(function(t) { return t.id === saved; }) || this.THEMES[0];
  },

  getActif: function() {
    try { return Utils.storage.get('ft_theme_actif', 'cyber-blue'); } catch(e) { return 'cyber-blue'; }
  },

  set: function(id) {
    return this.appliquer(id);
  },

  render: function(container) {
    if (!container) return;
    var self = this;
    var actifId = this.getActif();

    var classiques = this.THEMES.filter(function(t) { return t.categorie === 'classique'; });
    var cyber = this.THEMES.filter(function(t) { return t.categorie === 'cyber'; });

    var htmlClassiques = classiques.map(function(t) { return self._renderCard(t, actifId); }).join('');
    var htmlCyber = cyber.map(function(t) { return self._renderCard(t, actifId); }).join('');

    container.innerHTML = '<div style="background:linear-gradient(135deg,rgba(75,75,249,0.15),rgba(75,75,249,0.03));border:1px solid rgba(75,75,249,0.2);border-radius:var(--radius-xl);padding:16px;margin-bottom:14px"><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:4px">🎨 Thèmes visuels</div><div style="font-size:.75rem;color:var(--text-muted)">' + self.THEMES.length + ' thèmes disponibles</div></div>'
      + '<div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin:0 0 10px;display:flex;align-items:center;gap:8px">🌙 Classiques<div style="flex:1;height:1px;background:var(--border-color)"></div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' + htmlClassiques + '</div>'
      + '<div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin:0 0 10px;display:flex;align-items:center;gap:8px">⚡ Cyber<div style="flex:1;height:1px;background:var(--border-color)"></div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">' + htmlCyber + '</div>'
      + '<div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-xl);padding:16px;margin-bottom:14px"><div style="font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">👁️ Aperçu en direct</div><div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:12px;margin-bottom:8px"><div style="font-size:.82rem;font-weight:700;color:var(--text-primary);margin-bottom:4px">💪 Bench Press — PR</div><div style="font-size:.65rem;color:var(--text-muted)">105kg × 3 reps · 1RM ~113kg</div><div style="height:5px;background:var(--bg-app);border-radius:99px;overflow:hidden;margin-top:8px"><div style="height:100%;width:85%;background:var(--fd-indigo);border-radius:99px"></div></div></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px"><div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:8px;text-align:center"><div style="font-size:.88rem;font-weight:800;color:var(--fd-indigo)">247</div><div style="font-size:.58rem;color:var(--text-muted)">Séances</div></div><div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:8px;text-align:center"><div style="font-size:.88rem;font-weight:800;color:var(--fd-lemon)">18🔥</div><div style="font-size:.58rem;color:var(--text-muted)">Streak</div></div><div style="background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-md);padding:8px;text-align:center"><div style="font-size:.88rem;font-weight:800;color:var(--fd-mint)">32</div><div style="font-size:.58rem;color:var(--text-muted)">PRs</div></div></div></div>'
      + '<div style="padding:12px 14px;background:rgba(75,75,249,0.06);border:1px solid rgba(75,75,249,0.12);border-radius:var(--radius-md);font-size:.72rem;color:var(--text-muted)">Thème actif : <strong style="color:var(--fd-indigo)">' + (self.get() ? self.get().emoji + ' ' + self.get().nom : actifId) + '</strong></div>';
  },

  _renderCard: function(theme, actifId) {
    var estActif = actifId === theme.id;
    var isLight = theme.id === 'light' || theme.id === 'arctic-white';
    var textColor = isLight ? '#09092d' : 'white';
    var textMuted = isLight ? 'rgba(9,9,45,0.5)' : 'rgba(255,255,255,0.4)';

    return '<div onclick="Themes._selectionnerTheme(\'' + theme.id + '\')" style="background:' + theme.preview + ';border:' + (estActif ? '2px solid var(--fd-indigo)' : '1px solid rgba(255,255,255,0.08)') + ';border-radius:var(--radius-xl);padding:14px;cursor:pointer;position:relative;overflow:hidden;transition:all .2s' + (estActif ? ';box-shadow:0 0 16px ' + theme.c1 + '44' : '') + '">'
      + (estActif ? '<div style="position:absolute;top:8px;right:8px;padding:2px 8px;font-size:.56rem;font-weight:700;background:var(--fd-indigo);border-radius:99px;color:white">✓ Actif</div>' : '')
      + '<div style="display:flex;gap:4px;margin-bottom:8px"><div style="width:10px;height:10px;border-radius:50%;background:' + theme.c1 + '"></div><div style="width:10px;height:10px;border-radius:50%;background:' + theme.c2 + '"></div><div style="width:10px;height:10px;border-radius:50%;background:' + theme.c3 + '"></div></div>'
      + '<div style="font-size:1.1rem;margin-bottom:3px">' + theme.emoji + '</div>'
      + '<div style="font-size:.8rem;font-weight:800;color:' + textColor + '">' + theme.nom + '</div>'
      + '<div style="font-size:.58rem;margin-top:2px;color:' + textMuted + '">' + theme.description + '</div>'
      + '<div style="margin-top:8px;border-radius:5px;padding:5px;background:' + (theme.vars['--bg-card'] || 'rgba(255,255,255,0.05)') + ';border:1px solid ' + (theme.vars['--border-color'] || 'rgba(255,255,255,0.08)') + '"><div style="height:4px;border-radius:2px;background:' + theme.c1 + ';width:70%;margin-bottom:3px"></div><div style="height:3px;border-radius:2px;background:' + (theme.vars['--text-muted'] || 'rgba(255,255,255,0.3)') + ';width:90%"></div></div>'
      + '</div>';
  },

  _selectionnerTheme: function(id) {
    this.appliquer(id);

    try {
      var oldNavCss = document.getElementById('cb-nav-css');
      if (oldNavCss) oldNavCss.remove();
      if (typeof _rendreNavBar === 'function') _rendreNavBar();
    } catch(e) {}

    try {
      if (typeof _updateHeader === 'function') {
        _updateHeader(window._pageActive || 'home');
      }
    } catch(e) {}

    try { Sounds && Sounds.jouer && Sounds.jouer('clic'); } catch(e) {}

    var theme = this.THEMES.find(function(t) { return t.id === id; });
    try {
      Utils.toast(
        (theme ? theme.emoji + ' Thème ' + theme.nom : '🎨 Thème') + ' appliqué !',
        'success', 1500
      );
    } catch(e) {}

    var c = document.getElementById('page-themes');
    if (c) this.render(c);
  }

};

window.Themes = Themes;
console.log('✅ Themes.js v2.0 — 11 thèmes (6 Classiques + 5 Cyber)');
