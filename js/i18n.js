/* ============================================================
   PowerApp — i18n.js (stub minimal)
   Multi-langue — à étendre si besoin
   ============================================================ */

const i18n = {
  _langue: 'fr',

  init() {
    try {
      const saved = Utils.storage.get('ft_langue', null);
      if (saved) this._langue = saved;
      else {
        const nav = navigator.language?.slice(0, 2) || 'fr';
        this._langue = ['fr','en'].includes(nav) ? nav : 'fr';
      }
    } catch(e) {}
    console.log(`[i18n] Langue : ${this._langue}`);
  },

  getLangue() {
    return this._langue;
  },

  setLangue(code) {
    this._langue = code;
    try { Utils.storage.set('ft_langue', code); } catch(e) {}
  },

  // Sélecteur de langue pour Settings
  renderSelecteur(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="card mb-md">
        <div class="card-label">🌍 Langue</div>
        <div style="display:flex;gap:var(--space-sm);
                    margin-top:var(--space-sm)">
          ${[
            { code:'fr', label:'🇫🇷 Français' },
            { code:'en', label:'🇬🇧 English'  }
          ].map(l => `
            <button onclick="i18n.setLangue('${l.code}')"
                    style="flex:1;padding:var(--space-sm);
                           border-radius:var(--radius-full);
                           border:1px solid ${this._langue===l.code
                             ? 'var(--fd-indigo)' : 'var(--border-color)'};
                           background:${this._langue===l.code
                             ? 'var(--fd-indigo-dim)' : 'var(--bg-input)'};
                           color:${this._langue===l.code
                             ? 'var(--fd-indigo)' : 'var(--text-muted)'};
                           font-size:.82rem;font-weight:600;
                           cursor:pointer">
              ${l.label}
            </button>`).join('')}
        </div>
      </div>`;
  }
};

window.i18n = i18n;
console.log('✅ i18n.js chargé');
