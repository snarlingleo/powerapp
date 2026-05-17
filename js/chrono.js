/* ============================================================
   PowerApp — Chrono.js v1.0
   Chronomètre de séance avec pause/reprise
   ============================================================ */

'use strict';

const Chrono = {

  _debut:       null,
  _pauseOffset: 0,
  _enPause:     false,
  _interval:    null,
  _actif:       false,

  // ════════════════════════════════════════════════════════
  // CONTRÔLES
  // ════════════════════════════════════════════════════════

  demarrer() {
    if (this._actif) return; // Déjà en cours
    this._debut       = Date.now();
    this._pauseOffset = 0;
    this._enPause     = false;
    this._actif       = true;
    this._lancerInterval();
    console.log('[Chrono] Démarré');
  },

  pause() {
    if (!this._actif || this._enPause) return;
    this._pauseOffset += Date.now() - this._debut;
    this._enPause = true;
    clearInterval(this._interval);
    this._updateUI();
    console.log('[Chrono] En pause');
  },

  reprendre() {
    if (!this._actif || !this._enPause) return;
    this._debut   = Date.now();
    this._enPause = false;
    this._lancerInterval();
    console.log('[Chrono] Repris');
  },

  togglePause() {
    if (this._enPause) this.reprendre();
    else               this.pause();
  },

  arreter() {
    clearInterval(this._interval);
    this._actif   = false;
    this._enPause = false;
    console.log('[Chrono] Arrêté');
    return this.getDureeSecondes();
  },

  reset() {
    this.arreter();
    this._debut       = null;
    this._pauseOffset = 0;
    this._updateUI();
  },

  // ════════════════════════════════════════════════════════
  // CALCULS
  // ════════════════════════════════════════════════════════

  getDureeSecondes() {
    if (!this._debut && !this._pauseOffset) return 0;
    if (this._enPause) return Math.floor(this._pauseOffset / 1000);
    return Math.floor(
      (this._pauseOffset + Date.now() - this._debut) / 1000
    );
  },

  formaterDuree(secondes) {
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    const s = secondes % 60;

    const pad = n => String(n).padStart(2, '0');

    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  },

  // ════════════════════════════════════════════════════════
  // UI
  // ════════════════════════════════════════════════════════

  _lancerInterval() {
    clearInterval(this._interval);
    this._interval = setInterval(() => {
      this._updateUI();
    }, 1000);
  },

  _updateUI() {
    const el = document.getElementById('chrono-display');
    if (!el) return;

    const duree  = this.getDureeSecondes();
    const texte  = this.formaterDuree(duree);
    const icone  = this._enPause ? '⏸' : '⏱️';
    const couleur = this._enPause
      ? 'var(--fd-coral)'
      : 'var(--fd-mint)';

    el.innerHTML = `
      <span style="color:${couleur};font-weight:800;
                   font-size:.85rem;
                   font-variant-numeric:tabular-nums">
        ${icone} ${texte}
      </span>`;
  },

  /**
   * Injecte le widget chrono dans un container
   */
  renderWidget(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="display:flex;align-items:center;
                  gap:var(--space-sm)">
        <div id="chrono-display"
             style="min-width:70px;text-align:center">
          <span style="color:var(--fd-mint);
                       font-weight:800;font-size:.85rem">
            ⏱️ 00:00
          </span>
        </div>
        <button id="chrono-btn"
                onclick="Chrono.togglePause()"
                style="padding:4px 10px;
                       font-size:.68rem;font-weight:700;
                       background:var(--bg-input);
                       border:1px solid var(--border-color);
                       border-radius:var(--radius-full);
                       color:var(--text-muted);
                       cursor:pointer">
          ⏸ Pause
        </button>
      </div>`;

    // Mettre à jour le bouton à chaque tick
    const origUpdate = this._updateUI.bind(this);
    this._updateUI = () => {
      origUpdate();
      const btn = document.getElementById('chrono-btn');
      if (btn) {
        btn.textContent = this._enPause ? '▶ Reprendre' : '⏸ Pause';
        btn.style.color = this._enPause
          ? 'var(--fd-mint)'
          : 'var(--text-muted)';
      }
    };
  }
};

window.Chrono = Chrono;
console.log('✅ Chrono.js v1.0 chargé');
