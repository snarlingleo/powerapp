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

  // ════════════════════════════════════════════════════════
  // DÉFINITIONS DES THÈMES
  // ════════════════════════════════════════════════════════
  THEMES: {

    dark: {
      id:          'dark',
      nom:         'Dark',
      emoji:       '🌑',
      description: 'Thème sombre élégant — défaut',
      preview:     '#09092d',
      vars: {
        '--bg-app':        '#06061e',
        '--bg-card':       '#0d0d2b',
        '--bg-input':      'rgba(255,255,255,0.06)',
        '--border-color':  'rgba(255,255,255,0.08)',
        '--text-primary':  '#ffffff',
        '--text-secondary':'rgba(255,255,255,0.75)',
        '--text-muted':    'rgba(255,255,255,0.4)',
        '--fd-indigo':     '#4b4bf9',
        '--fd-midnight':   '#09092d',
        '--fd-lemon':      '#f9ef77',
        '--fd-coral':      '#ff8d96',
        '--fd-mint':       '#8bf0bb',
        '--fd-lavender':   '#bfa1ff',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    },

    amoled: {
      id:          'amoled',
      nom:         'AMOLED',
      emoji:       '⚫',
      description: 'Noir pur — économise la batterie sur OLED',
      preview:     '#000000',
      vars: {
        '--bg-app':        '#000000',
        '--bg-card':       '#0a0a0a',
        '--bg-input':      'rgba(255,255,255,0.05)',
        '--border-color':  'rgba(255,255,255,0.07)',
        '--text-primary':  '#ffffff',
        '--text-secondary':'rgba(255,255,255,0.75)',
        '--text-muted':    'rgba(255,255,255,0.35)',
        '--fd-indigo':     '#5c5cff',
        '--fd-midnight':   '#000000',
        '--fd-lemon':      '#f9ef77',
        '--fd-coral':      '#ff8d96',
        '--fd-mint':       '#8bf0bb',
        '--fd-lavender':   '#bfa1ff',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    },

    light: {
      id:          'light',
      nom:         'Light',
      emoji:       '☀️',
      description: 'Thème clair — idéal en extérieur',
      preview:     '#f3f3f7',
      vars: {
        '--bg-app':        '#f3f3f7',
        '--bg-card':       '#ffffff',
        '--bg-input':      'rgba(0,0,0,0.05)',
        '--border-color':  'rgba(0,0,0,0.1)',
        '--text-primary':  '#09092d',
        '--text-secondary':'rgba(9,9,45,0.75)',
        '--text-muted':    'rgba(9,9,45,0.45)',
        '--fd-indigo':     '#4b4bf9',
        '--fd-midnight':   '#09092d',
        '--fd-lemon':      '#e8b800',
        '--fd-coral':      '#e85560',
        '--fd-mint':       '#22b06a',
        '--fd-lavender':   '#7b55dd',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    },

    indigo: {
      id:          'indigo',
      nom:         'Indigo',
      emoji:       '💜',
      description: 'Accent violet intense — premium',
      preview:     '#0d0d2b',
      vars: {
        '--bg-app':        '#07071a',
        '--bg-card':       '#0f0f30',
        '--bg-input':      'rgba(75,75,249,0.08)',
        '--border-color':  'rgba(75,75,249,0.15)',
        '--text-primary':  '#ffffff',
        '--text-secondary':'rgba(255,255,255,0.75)',
        '--text-muted':    'rgba(191,161,255,0.5)',
        '--fd-indigo':     '#6c6cff',
        '--fd-midnight':   '#07071a',
        '--fd-lemon':      '#f9ef77',
        '--fd-coral':      '#ff8d96',
        '--fd-mint':       '#8bf0bb',
        '--fd-lavender':   '#bfa1ff',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    },

    coral: {
      id:          'coral',
      nom:         'Coral',
      emoji:       '🪸',
      description: 'Accent corail chaleureux & énergique',
      preview:     '#1a0a0d',
      vars: {
        '--bg-app':        '#100608',
        '--bg-card':       '#1a0a0d',
        '--bg-input':      'rgba(255,141,150,0.08)',
        '--border-color':  'rgba(255,141,150,0.15)',
        '--text-primary':  '#ffffff',
        '--text-secondary':'rgba(255,255,255,0.75)',
        '--text-muted':    'rgba(255,141,150,0.5)',
        '--fd-indigo':     '#4b4bf9',
        '--fd-midnight':   '#100608',
        '--fd-lemon':      '#f9ef77',
        '--fd-coral':      '#ff6b78',
        '--fd-mint':       '#8bf0bb',
        '--fd-lavender':   '#bfa1ff',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    },

    mint: {
      id:          'mint',
      nom:         'Mint',
      emoji:       '🌿',
      description: 'Accent vert nature & fraîcheur',
      preview:     '#061510',
      vars: {
        '--bg-app':        '#040e09',
        '--bg-card':       '#071a10',
        '--bg-input':      'rgba(139,240,187,0.07)',
        '--border-color':  'rgba(139,240,187,0.12)',
        '--text-primary':  '#ffffff',
        '--text-secondary':'rgba(255,255,255,0.75)',
        '--text-muted':    'rgba(139,240,187,0.45)',
        '--fd-indigo':     '#4b4bf9',
        '--fd-midnight':   '#040e09',
        '--fd-lemon':      '#f9ef77',
        '--fd-coral':      '#ff8d96',
        '--fd-mint':       '#5ddaa0',
        '--fd-lavender':   '#bfa1ff',
        '--radius-sm':     '6px',
        '--radius-md':     '10px',
        '--radius-lg':     '14px',
        '--radius-xl':     '18px',
        '--radius-full':   '999px',
        '--space-xs':      '4px',
        '--space-sm':      '8px',
        '--space-md':      '14px',
        '--space-lg':      '20px',
        '--space-xl':      '28px'
      }
    }
  },

  // ════════════════════════════════════════════════════════
  // APPLIQUER UN THÈME
  // ════════════════════════════════════════════════════════
  appliquer(themeId) {
    const theme = this.THEMES[themeId];
    if (!theme) return;

    const root = document.documentElement;

    // Appliquer toutes les variables CSS
    Object.entries(theme.vars).forEach(([prop, val]) => {
      root.style.setProperty(prop, val);
    });

    // Mettre à jour data-theme
    root.setAttribute('data-theme', themeId);

    // Sauvegarder
    Utils.storage.set(this.CLE, themeId);

    // Mettre à jour meta theme-color
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }
    metaTheme.content = theme.preview;

    return theme;
  },

  // ════════════════════════════════════════════════════════
  // INITIALISER AU DÉMARRAGE
  // ════════════════════════════════════════════════════════
  init() {
    const saved = Utils.storage.get(this.CLE, 'dark');

    // Compatibilité ancien système
    const oldTheme = Utils.storage.get('ft_theme_config', null);
    if (oldTheme && !Utils.storage.get(this.CLE, null)) {
      const mapping = {
        dark: 'dark', light: 'light',
        indigo: 'indigo', coral: 'coral'
      };
      this.appliquer(mapping[oldTheme] || 'dark');
      return;
    }

    this.appliquer(saved);
  },

  getActif() {
    return Utils.storage.get(this.CLE, 'dark');
  },

  // ════════════════════════════════════════════════════════
  // RENDER PAGE THÈMES
  // ════════════════════════════════════════════════════════
  render(container) {
    if (!container) return;
    const actif = this.getActif();

    container.innerHTML = `

      <!-- Titre -->
      <div style="background:linear-gradient(135deg,
                  rgba(75,75,249,0.15),rgba(75,75,249,0.03));
                  border:1px solid rgba(75,75,249,0.2);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--fd-indigo);margin-bottom:4px">
          🎨 Thèmes visuels
        </div>
        <div style="font-size:.75rem;color:var(--text-muted)">
          Personnalise l'apparence de PowerApp selon tes préférences.
        </div>
      </div>

      <!-- Grille thèmes -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        ${Object.values(this.THEMES).map(theme => {
          const estActif = actif === theme.id;
          return `
            <div onclick="Themes._selectionnerTheme('${theme.id}')"
                 style="background:${theme.preview};
                        border:${estActif
                          ? '2px solid var(--fd-indigo)'
                          : '1px solid rgba(255,255,255,0.08)'};
                        border-radius:var(--radius-xl);
                        padding:16px;cursor:pointer;
                        position:relative;overflow:hidden;
                        transition:all .2s">

              <!-- Badge actif -->
              ${estActif ? `
                <div style="position:absolute;top:8px;right:8px;
                            padding:2px 8px;font-size:.58rem;
                            font-weight:700;background:var(--fd-indigo);
                            border-radius:99px;color:white">
                  ✓ Actif
                </div>` : ''}

              <!-- Aperçu -->
              <div style="display:flex;gap:4px;margin-bottom:10px">
                ${['--fd-indigo','--fd-mint','--fd-lemon','--fd-coral']
                  .map(v => `
                    <div style="width:12px;height:12px;border-radius:50%;
                                background:${theme.vars[v]}">
                    </div>`).join('')}
              </div>

              <!-- Info -->
              <div style="font-size:1.2rem;margin-bottom:4px">${theme.emoji}</div>
              <div style="font-size:.82rem;font-weight:800;
                          color:${theme.id === 'light' ? '#09092d' : 'white'}">
                ${theme.nom}
              </div>
              <div style="font-size:.62rem;margin-top:2px;
                          color:${theme.id === 'light'
                            ? 'rgba(9,9,45,0.5)' : 'rgba(255,255,255,0.4)'}">
                ${theme.description}
              </div>

              <!-- Mini preview UI -->
              <div style="margin-top:10px;
                          background:${theme.vars['--bg-card']};
                          border-radius:6px;padding:6px;
                          border:1px solid ${theme.vars['--border-color']}">
                <div style="height:4px;border-radius:2px;
                            background:${theme.vars['--fd-indigo']};
                            width:70%;margin-bottom:4px"></div>
                <div style="height:3px;border-radius:2px;
                            background:${theme.vars['--text-muted']};
                            width:90%"></div>
              </div>
            </div>`;
        }).join('')}
      </div>

      <!-- Aperçu live -->
      <div style="background:var(--bg-card);
                  border:1px solid var(--border-color);
                  border-radius:var(--radius-xl);
                  padding:16px;margin-bottom:14px">
        <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;
                    letter-spacing:.1em;color:var(--text-muted);margin-bottom:12px">
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
                        background:var(--fd-indigo);border-radius:99px">
            </div>
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
              <div style="font-size:.88rem;font-weight:800;color:${s.color}">
                ${s.val}</div>
              <div style="font-size:.58rem;color:var(--text-muted)">
                ${s.label}</div>
            </div>`).join('')}
        </div>
      </div>

      <!-- Thème actif info -->
      <div style="padding:12px 14px;
                  background:rgba(75,75,249,0.06);
                  border:1px solid rgba(75,75,249,0.12);
                  border-radius:var(--radius-md);
                  font-size:.72rem;color:var(--text-muted)">
        Thème actif :
        <strong style="color:var(--fd-indigo)">
          ${this.THEMES[actif]?.emoji || ''} ${this.THEMES[actif]?.nom || actif}
        </strong>
        — Appliqué instantanément et mémorisé
      </div>
    `;
  },

  _selectionnerTheme(id) {
    this.appliquer(id);

    try { Sounds.jouer('clic'); } catch(e) {}
    Utils.toast(`🎨 Thème ${this.THEMES[id]?.nom} appliqué !`, 'success', 1500);

    // Re-render
    const c = document.getElementById('page-themes')
      || document.getElementById('page-settings');
    if (c) this.render(c);
  }
};

window.Themes = Themes;
console.log('✅ Themes.js v1.0 — 6 thèmes + Mode clair + AMOLED + Application instantanée');
