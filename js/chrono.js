/* ============================================================
   PowerApp — Chrono.js v2.0
   Chronomètre de séance avec pause/reprise
   + Sauvegarde localStorage + onTick callback
   + getStats() + Fix renderWidget()
   ============================================================ */

'use strict';

const Chrono = {

  _debut:         null,
  _pauseOffset:   0,
  _enPause:       false,
  _interval:      null,
  _actif:         false,
  _callbacks:     [],           // ✅ NOUVEAU v2.0
  _dureePause:    0,            // ✅ NOUVEAU v2.0 — durée cumulée en pause
  _debutPause:    null,         // ✅ NOUVEAU v2.0
  _totalPauses:   0,            // ✅ NOUVEAU v2.0

  CLE_STORAGE:    'ft_chrono_seance',

  // ════════════════════════════════════════════════════════
  // CONTRÔLES
  // ════════════════════════════════════════════════════════
  demarrer() {
    if (this._actif) return;

    this._debut        = Date.now();
    this._pauseOffset  = 0;
    this._enPause      = false;
    this._actif        = true;
    this._dureePause   = 0;
    this._debutPause   = null;
    this._totalPauses  = 0;

    // ✅ NOUVEAU v2.0 — Sauvegarder le début
    this._sauvegarder();

    this._lancerInterval();
    console.log('[Chrono] Démarré');
  },

  pause() {
    if (!this._actif || this._enPause) return;

    this._pauseOffset += Date.now() - this._debut;
    this._enPause      = true;
    this._debutPause   = Date.now(); // ✅ NOUVEAU v2.0
    this._totalPauses++;            // ✅ NOUVEAU v2.0

    clearInterval(this._interval);
    this._updateUI();
    this._sauvegarder(); // ✅ NOUVEAU v2.0

    console.log('[Chrono] En pause');
  },

  reprendre() {
    if (!this._actif || !this._enPause) return;

    // ✅ NOUVEAU v2.0 — Cumuler durée de pause
    if (this._debutPause) {
      this._dureePause += Date.now() - this._debutPause;
      this._debutPause  = null;
    }

    this._debut   = Date.now();
    this._enPause = false;

    this._lancerInterval();
    this._sauvegarder(); // ✅ NOUVEAU v2.0

    console.log('[Chrono] Repris');
  },

  togglePause() {
    if (this._enPause) this.reprendre();
    else               this.pause();
  },

  arreter() {
    clearInterval(this._interval);

    const duree    = this.getDureeSecondes();
    this._actif    = false;
    this._enPause  = false;

    // ✅ NOUVEAU v2.0 — Nettoyer storage
    this._nettoyerStorage();

    console.log(`[Chrono] Arrêté — Durée: ${duree}s`);
    return duree;
  },

  reset() {
    this.arreter();
    this._debut        = null;
    this._pauseOffset  = 0;
    this._dureePause   = 0;
    this._debutPause   = null;
    this._totalPauses  = 0;
    this._updateUI();
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — Restaurer depuis localStorage
  // (si l'app se ferme et rouvre pendant la séance)
  // ════════════════════════════════════════════════════════
  restaurerSiActif() {
    try {
      const saved = Utils.storage.get(this.CLE_STORAGE, null);
      if (!saved || !saved.debut) return false;

      // Vérifier que c'est récent (moins de 4h)
      const maintenant = Date.now();
      if (maintenant - saved.debut > 4 * 60 * 60 * 1000) {
        this._nettoyerStorage();
        return false;
      }

      // Restaurer
      this._debut       = saved.debut;
      this._pauseOffset = saved.pauseOffset || 0;
      this._dureePause  = saved.dureePause  || 0;
      this._totalPauses = saved.totalPauses || 0;
      this._enPause     = false;
      this._actif       = true;

      this._lancerInterval();
      console.log('[Chrono] Restauré depuis storage');
      return true;
    } catch(e) {
      return false;
    }
  },

  // ════════════════════════════════════════════════════════
  // CALCULS
  // ════════════════════════════════════════════════════════
  getDureeSecondes() {
    if (!this._debut && !this._pauseOffset) return 0;
    if (this._enPause) {
      return Math.floor(this._pauseOffset / 1000);
    }
    return Math.floor(
      (this._pauseOffset + Date.now() - this._debut) / 1000
    );
  },

  // ✅ NOUVEAU v2.0 — Stats complètes
  getStats() {
    const dureeActive  = this.getDureeSecondes();
    const dureePause   = Math.floor(this._dureePause / 1000);
    const dureeTotal   = dureeActive + dureePause;
    const efficacite   = dureeTotal > 0
      ? Math.round((dureeActive / dureeTotal) * 100)
      : 100;

    return {
      dureeActive,    // Secondes actives (sans pauses)
      dureePause,     // Secondes en pause
      dureeTotal,     // Durée totale depuis le début
      totalPauses:   this._totalPauses,
      efficacite      // % temps actif / temps total
    };
  },

  // Alias pour compatibilité
  getFormate() {
    return this.formaterDuree(this.getDureeSecondes());
  },

  formaterDuree(secondes) {
    const h  = Math.floor(secondes / 3600);
    const m  = Math.floor((secondes % 3600) / 60);
    const s  = secondes % 60;
    const pad = n => String(n).padStart(2, '0');
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  },

  // ════════════════════════════════════════════════════════
  // ✅ NOUVEAU v2.0 — Callbacks onTick
  // ════════════════════════════════════════════════════════
  onTick(callback) {
    if (typeof callback === 'function') {
      this._callbacks.push(callback);
    }
    // Retourner une fonction de désinscription
    return () => {
      this._callbacks = this._callbacks.filter(
        cb => cb !== callback
      );
    };
  },

  // ════════════════════════════════════════════════════════
  // STORAGE — ✅ NOUVEAU v2.0
  // ════════════════════════════════════════════════════════
  _sauvegarder() {
    try {
      Utils.storage.set(this.CLE_STORAGE, {
        debut:        this._debut,
        pauseOffset:  this._pauseOffset,
        dureePause:   this._dureePause,
        totalPauses:  this._totalPauses,
        enPause:      this._enPause,
        ts:           Date.now()
      });
    } catch(e) {}
  },

  _nettoyerStorage() {
    try { Utils.storage.remove(this.CLE_STORAGE); } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // UI
  // ════════════════════════════════════════════════════════
  _lancerInterval() {
    clearInterval(this._interval);
    this._interval = setInterval(() => {
      this._updateUI();
      // ✅ NOUVEAU v2.0 — Notifier les callbacks
      this._notifierCallbacks();
      // ✅ NOUVEAU v2.0 — Sauvegarde toutes les 30s
      if (this.getDureeSecondes() % 30 === 0) {
        this._sauvegarder();
      }
    }, 1000);
  },

  _notifierCallbacks() {
    const duree = this.getDureeSecondes();
    this._callbacks.forEach(cb => {
      try { cb(duree, this._enPause); } catch(e) {}
    });
  },

  _updateUI() {
    const el = document.getElementById('chrono-display');
    if (!el) return;

    const duree   = this.getDureeSecondes();
    const texte   = this.formaterDuree(duree);
    const icone   = this._enPause ? '⏸' : '⏱️';
    const couleur = this._enPause
      ? 'var(--fd-coral)'
      : 'var(--fd-mint)';

    el.innerHTML = `
      <span style="color:${couleur};font-weight:800;
                   font-size:.85rem;
                   font-variant-numeric:tabular-nums">
        ${icone} ${texte}
      </span>`;

    // Mettre à jour bouton pause si présent
    const btn = document.getElementById('chrono-btn');
    if (btn) {
      btn.textContent = this._enPause ? '▶ Reprendre' : '⏸ Pause';
      btn.style.color = this._enPause
        ? 'var(--fd-mint)' : 'var(--text-muted)';
    }
  },

  // ✅ v2.0 — renderWidget() sans mutation de méthode
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

    // ✅ v2.0 — Forcer un update immédiat
    this._updateUI();
  },

  // ✅ NOUVEAU v2.0 — Widget compact pour header Live
  renderWidgetCompact(container) {
    if (!container) return;

    container.innerHTML = `
      <div id="chrono-display"
           style="display:inline-flex;align-items:center;
                  gap:4px;cursor:pointer"
           onclick="Chrono.togglePause()">
        <span style="color:var(--fd-mint);font-weight:800;
                     font-size:.82rem;
                     font-variant-numeric:tabular-nums">
          ⏱️ 00:00
        </span>
      </div>`;

    this._updateUI();
  },

  // ✅ NOUVEAU v2.0 — Render résumé fin de séance
  renderResume(container) {
    if (!container) return;

    const stats = this.getStats();

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);
                  gap:8px">
        <div style="text-align:center">
          <div style="font-size:1.1rem;font-weight:800;
                      color:var(--fd-mint)">
            ${this.formaterDuree(stats.dureeActive)}
          </div>
          <div style="font-size:.62rem;color:var(--text-muted)">
            Temps actif
          </div>
        </div>
        <div style="text-align:center">
          <div style="font-size:1.1rem;font-weight:800;
                      color:var(--fd-lavender)">
            ${stats.totalPauses}
          </div>
          <div style="font-size:.62rem;color:var(--text-muted)">
            Pauses
          </div>
        </div>
        <div style="text-align:center">
          <div style="font-size:1.1rem;font-weight:800;
                      color:var(--fd-lemon)">
            ${stats.efficacite}%
          </div>
          <div style="font-size:.62rem;color:var(--text-muted)">
            Efficacité
          </div>
        </div>
      </div>`;
  }
};

window.Chrono = Chrono;
console.log('✅ Chrono.js v2.0 chargé — Storage + onTick + Stats + Fix renderWidget');
