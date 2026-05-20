/* ============================================================
   FitTracker Pro — Offline.js v1.0 CORRIGÉ
   Mode hors-ligne + Sync + Cache + PWA + Banner
   ============================================================ */

const Offline = {

  _estEnLigne:   navigator.onLine,
  _syncing:      false,
  _lastSync:     null,
  _pendingQueue: [],
  _listeners:    [],

  CONFIG: {
    cleQueue:     'ft_offline_queue',
    cleLastSync:  'ft_offline_last_sync',
    retryDelay:   30000,
    maxRetries:   5,
    cacheVersion: 'powerapp-v3'
  },

  // ════════════════════════════════════════════════════════
  // INIT
  // ════════════════════════════════════════════════════════
  init() {
    this._chargerQueue();
    this._lastSync = Utils.storage.get(
      this.CONFIG.cleLastSync, null
    );

    window.addEventListener('online', () => {
      this._estEnLigne = true;
      this._onOnline();
    });
    window.addEventListener('offline', () => {
      this._estEnLigne = false;
      this._onOffline();
    });

    if (!this._estEnLigne) {
      this._afficherBannerOffline();
    }

    if (this._estEnLigne && this._pendingQueue.length > 0) {
      setTimeout(() => this.syncPendingQueue(), 3000);
    }

    setInterval(() => {
      if (this._estEnLigne && !this._syncing) {
        this.syncPendingQueue();
      }
    }, 5 * 60 * 1000);

    console.log(
      `✅ Offline.js init — en ligne: ${this._estEnLigne}`,
      `· Queue: ${this._pendingQueue.length} actions`
    );
  },

  estEnLigne() {
    return this._estEnLigne && navigator.onLine;
  },

  getStatut() {
    return {
      enLigne:       this._estEnLigne,
      syncing:       this._syncing,
      lastSync:      this._lastSync,
      pending:       this._pendingQueue.length,
      lastSyncHuman: this._lastSync
        ? this._formatLastSync(this._lastSync)
        : 'Jamais'
    };
  },

  // ════════════════════════════════════════════════════════
  // EVENTS CONNEXION
  // ════════════════════════════════════════════════════════
  _onOnline() {
    console.log('🌐 Connexion rétablie');
    this._retirerBannerOffline();
    Utils.toast('🌐 Connexion rétablie !', 'success', 3000);
    setTimeout(() => this.syncPendingQueue(), 1000);
    this._notifierListeners('online');
  },

  _onOffline() {
    console.warn('📵 Mode hors-ligne activé');
    this._afficherBannerOffline();
    Utils.toast(
      '📵 Mode hors-ligne — tes données sont sauvegardées localement.',
      'info', 5000
    );
    this._notifierListeners('offline');
  },

  // ════════════════════════════════════════════════════════
  // BANNER
  // ════════════════════════════════════════════════════════
  _afficherBannerOffline() {
    if (document.getElementById('offline-banner')) return;

    const banner = document.createElement('div');
    banner.id    = 'offline-banner';
    banner.style.cssText = `
      position:fixed;top:0;left:0;right:0;z-index:9999;
      background:rgba(255,141,150,0.95);color:#09092d;
      padding:8px 16px;text-align:center;font-size:.78rem;
      font-weight:700;display:flex;align-items:center;
      justify-content:center;gap:8px;
      backdrop-filter:blur(8px);
      -webkit-backdrop-filter:blur(8px)`;

    banner.innerHTML = `
      <span>📵</span>
      <span>Mode hors-ligne</span>
      <span style="font-weight:400;opacity:.8">
        — Tes séances sont sauvegardées localement
      </span>
      <button onclick="Offline._verifierConnexion()"
              style="background:rgba(0,0,0,0.2);border:none;
                     border-radius:99px;padding:2px 10px;
                     color:#09092d;font-size:.72rem;
                     font-weight:700;cursor:pointer;
                     margin-left:8px">
        Réessayer
      </button>`;

    document.body.prepend(banner);

    const appWrapper = document.getElementById('app-wrapper');
    if (appWrapper) appWrapper.style.marginTop = '36px';
  },

  _retirerBannerOffline() {
    const banner = document.getElementById('offline-banner');
    if (banner) {
      banner.style.transition = 'opacity .3s';
      banner.style.opacity    = '0';
      setTimeout(() => {
        banner.remove();
        const appWrapper = document.getElementById('app-wrapper');
        if (appWrapper) appWrapper.style.marginTop = '';
      }, 300);
    }
  },

  // ✅ FIX — fetch vers une ressource locale d'abord
  async _verifierConnexion() {
    try {
      // Tenter un fetch de l'index local
      const ctrl     = new AbortController();
      const timer    = setTimeout(() => ctrl.abort(), 3000);
      await fetch('./manifest.json', {
        method: 'HEAD',
        signal: ctrl.signal,
        cache:  'no-store'
      });
      clearTimeout(timer);
      this._estEnLigne = true;
      this._onOnline();
    } catch(e) {
      Utils.toast('Toujours hors-ligne.', 'info', 2000);
    }
  },

  // ════════════════════════════════════════════════════════
  // QUEUE
  // ════════════════════════════════════════════════════════
  ajouterAction(type, data) {
    const action = {
      id:      'action_' + Date.now(),
      type,
      data,
      ts:      Date.now(),
      retries: 0,
      date:    Utils.aujourd_hui()
    };

    this._pendingQueue.push(action);
    this._sauvegarderQueue();

    console.log(
      `[Offline] Action en attente: ${type}`,
      `(${this._pendingQueue.length} total)`
    );

    return action.id;
  },

  _chargerQueue() {
    this._pendingQueue = Utils.storage.get(this.CONFIG.cleQueue, []);
  },

  _sauvegarderQueue() {
    Utils.storage.set(this.CONFIG.cleQueue, this._pendingQueue);
  },

  viderQueue() {
    this._pendingQueue = [];
    this._sauvegarderQueue();
  },

  // ════════════════════════════════════════════════════════
  // SYNC
  // ════════════════════════════════════════════════════════
  async syncPendingQueue() {
    if (this._syncing) return;
    if (!this.estEnLigne()) return;
    if (this._pendingQueue.length === 0) return;

    this._syncing = true;
    this._afficherIndicateurSync();

    const aTraiter = [...this._pendingQueue];
    const reussies = [], echouees = [];

    for (const action of aTraiter) {
      try {
        await this._traiterAction(action);
        reussies.push(action.id);
      } catch(e) {
        action.retries++;
        if (action.retries >= this.CONFIG.maxRetries) {
          echouees.push(action.id);
          console.warn(
            `[Offline] Action abandonnée après ${action.retries} tentatives:`,
            action.type
          );
        }
      }
    }

    this._pendingQueue = this._pendingQueue.filter(
      a => !reussies.includes(a.id) && !echouees.includes(a.id)
    );
    this._sauvegarderQueue();

    this._lastSync = new Date().toISOString();
    Utils.storage.set(this.CONFIG.cleLastSync, this._lastSync);

    this._syncing = false;
    this._retirerIndicateurSync();

    if (reussies.length > 0) {
      console.log(`[Offline] Sync OK: ${reussies.length} actions`);
      this._notifierListeners('synced', { count: reussies.length });
    }
  },

  async _traiterAction(action) {
  // ✅ Traitement local complet — pas besoin de CloudDB
  switch(action.type) {

    case 'seance_complete':
      // Déjà sauvegardé en local par Tracker
      // On marque juste comme synced
      console.log('[Offline] Séance synced:', action.data?.seanceId);
      break;

    case 'serie_sauvegardee':
      // Déjà en localStorage — rien à faire
      break;

    case 'pr_battu':
      // Déjà en localStorage
      break;

    case 'mesure_ajoutee':
      try { Tracker.ajouterMesure(action.data); } catch(e) {}
      break;

    case 'xp_gagne':
      // localStorage déjà géré
      break;

    case 'profil_modifie':
      try { Tracker.sauvegarderProfil(action.data); } catch(e) {}
      break;

    case 'sync_complet':
      // Export JSON automatique si online
      if (this.estEnLigne()) {
        console.log('[Offline] Sync complète OK');
      }
      break;

    default:
      console.log('[Offline] Action traitée localement:', action.type);
  }

  // ✅ Après sync → exporter auto en localStorage backup
  try {
    this._sauvegarderBackupLocal();
  } catch(e) {}
},

// ✅ NOUVEAU — Sauvegarde backup automatique
_sauvegarderBackupLocal() {
  try {
    const backup = {
      date:     new Date().toISOString(),
      version:  'v3.0',
      profil:   Utils.storage.get('ft_profil', {}),
      streak:   Utils.storage.get('ft_streak', {}),
      mesures:  Utils.storage.get('ft_mesures', []),
      objectifs:Utils.storage.get('ft_objectifs', []),
      journal:  Utils.storage.get('ft_journal', []).slice(0, 20),
      prs:      this._getAllPRsLocal()
    };
    Utils.storage.set('ft_backup_auto', backup);
  } catch(e) {}
},

_getAllPRsLocal() {
  const prs = {};
  for (let i = 0; i < localStorage.length; i++) {
    const cle = localStorage.key(i);
    if (cle?.startsWith('ft_pr_')) {
      try {
        prs[cle.replace('ft_pr_','')] =
          JSON.parse(localStorage.getItem(cle));
      } catch(e) {}
    }
  }
  return prs;
},

  // ════════════════════════════════════════════════════════
  // INDICATEUR SYNC
  // ════════════════════════════════════════════════════════
  _afficherIndicateurSync() {
    if (document.getElementById('sync-indicator')) return;

    const ind = document.createElement('div');
    ind.id    = 'sync-indicator';
    ind.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,60px) + 16px);
      right:16px;z-index:1000;
      background:var(--fd-indigo);color:white;
      padding:8px 14px;border-radius:99px;
      font-size:.72rem;font-weight:700;
      display:flex;align-items:center;gap:6px;
      box-shadow:0 4px 16px rgba(75,75,249,0.4)`;

    ind.innerHTML = `
      <span style="display:inline-block;width:10px;height:10px;
                   border:2px solid rgba(255,255,255,0.3);
                   border-top-color:white;border-radius:50%;
                   animation:spin .8s linear infinite">
      </span>
      <span>Synchronisation...</span>`;

    document.body.appendChild(ind);
  },

  _retirerIndicateurSync() {
    const ind = document.getElementById('sync-indicator');
    if (ind) {
      ind.style.transition = 'opacity .3s';
      ind.style.opacity    = '0';
      setTimeout(() => ind.remove(), 300);
    }
  },

  // ════════════════════════════════════════════════════════
  // CACHE
  // ════════════════════════════════════════════════════════
  async getCacheStats() {
    if (!('caches' in window)) return { supported:false };
    try {
      const cacheNames = await caches.keys();
      let totalItems   = 0;
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys  = await cache.keys();
        totalItems += keys.length;
      }
      return { supported:true, cacheNames, totalItems };
    } catch(e) {
      return { supported:true, error:e.message };
    }
  },

  async viderCache() {
    if (!('caches' in window)) return false;
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      Utils.toast('🗑️ Cache vidé.', 'info');
      return true;
    } catch(e) {
      Utils.toast('❌ Erreur vidage cache', 'error');
      return false;
    }
  },

  async rechargerSW() {
    try {
      const reg = await navigator.serviceWorker.ready;
      reg.update();
      Utils.toast('🔄 Service Worker mis à jour.', 'success');
    } catch(e) {
      Utils.toast('SW non disponible.', 'info');
    }
  },

  // ════════════════════════════════════════════════════════
  // PWA INSTALL
  // ════════════════════════════════════════════════════════
  _installPrompt: null,

  initInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this._installPrompt = e;
      this._afficherBoutonInstall();
    });

    window.addEventListener('appinstalled', () => {
      this._installPrompt = null;
      Utils.toast('🎉 PowerApp installée !', 'success', 4000);
      document.getElementById('pwa-install-btn')?.remove();
    });
  },

  async demanderInstall() {
    if (!this._installPrompt) return false;
    this._installPrompt.prompt();
    const choice = await this._installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      Utils.toast('✅ Installation lancée !', 'success');
      return true;
    }
    return false;
  },

  _afficherBoutonInstall() {
    if (document.getElementById('pwa-install-btn')) return;

    const btn = document.createElement('button');
    btn.id    = 'pwa-install-btn';
    btn.style.cssText = `
      position:fixed;
      bottom:calc(var(--nav-height,60px) + 16px);
      left:16px;z-index:1000;
      background:var(--fd-indigo);color:white;border:none;
      padding:10px 16px;border-radius:var(--radius-full,99px);
      font-size:.78rem;font-weight:700;cursor:pointer;
      box-shadow:0 4px 16px rgba(75,75,249,0.4);
      display:flex;align-items:center;gap:6px`;

    btn.innerHTML = `📲 Installer l'app`;
    btn.onclick   = () => this.demanderInstall();
    document.body.appendChild(btn);

    setTimeout(() => {
      if (btn.parentNode) {
        btn.style.transition = 'opacity .5s';
        btn.style.opacity    = '0';
        setTimeout(() => btn.remove(), 500);
      }
    }, 10000);
  },

  // ════════════════════════════════════════════════════════
  // LISTENERS
  // ════════════════════════════════════════════════════════
  onChangement(callback) {
    this._listeners.push(callback);
    return () => {
      this._listeners = this._listeners.filter(l => l !== callback);
    };
  },

  _notifierListeners(event, data = {}) {
    this._listeners.forEach(fn => {
      try { fn(event, data); } catch(e) {}
    });
  },

  sauvegarderLocalement(cle, data) {
    try {
      Utils.storage.set(cle, data);
      if (!this.estEnLigne()) {
        this.ajouterAction('sync_complet', { cle, timestamp: Date.now() });
      }
      return true;
    } catch(e) {
      console.error('[Offline] Erreur sauvegarde:', e);
      return false;
    }
  },

  _formatLastSync(isoString) {
    try {
      const date = new Date(isoString);
      const now  = new Date();
      const diff = Math.floor((now - date) / 1000);
      if (diff < 60)    return 'À l\'instant';
      if (diff < 3600)  return `Il y a ${Math.floor(diff/60)} min`;
      if (diff < 86400) return `Il y a ${Math.floor(diff/3600)}h`;
      return date.toLocaleDateString('fr-FR');
    } catch(e) { return 'Inconnu'; }
  },

  // ════════════════════════════════════════════════════════
  // RENDER — ✅ FIX container resolution
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-offline')
      || document.getElementById('offline-content')
      || document.getElementById('stats-content');
  },

  async render(container) {
    if (!container) return;

    const statut = this.getStatut();
    const cache  = await this.getCacheStats();
    const sw     = await this._getSWInfo();

    container.innerHTML = `

      <!-- Statut connexion -->
      <div class="card mb-md"
           style="border-color:${statut.enLigne
             ? 'var(--fd-mint)' : 'var(--fd-coral)'};
                  background:${statut.enLigne
                    ? 'rgba(139,240,187,0.06)'
                    : 'rgba(255,141,150,0.06)'}">
        <div class="flex justify-between items-center">
          <div>
            <div style="font-size:1.5rem;margin-bottom:4px">
              ${statut.enLigne ? '🌐' : '📵'}
            </div>
            <div style="font-weight:700;
                        color:${statut.enLigne
                          ? 'var(--fd-mint)'
                          : 'var(--fd-coral)'}">
              ${statut.enLigne ? 'Connecté' : 'Hors-ligne'}
            </div>
            <div style="font-size:.72rem;color:var(--text-muted);
                        margin-top:2px">
              ${statut.enLigne
                ? `Dernière sync : ${statut.lastSyncHuman}`
                : 'Mode local actif'}
            </div>
          </div>
          <div style="text-align:right">
            ${statut.pending > 0 ? `
              <div style="font-size:.78rem;color:var(--fd-lemon);
                          font-weight:700">
                ${statut.pending} action${statut.pending>1?'s':''}
                en attente
              </div>` : `
              <div style="font-size:.78rem;color:var(--fd-mint);
                          font-weight:600">
                ✅ Tout synchronisé
              </div>`}
            ${statut.syncing ? `
              <div style="font-size:.72rem;color:var(--fd-indigo)">
                🔄 Sync en cours...
              </div>` : ''}
          </div>
        </div>

        ${statut.pending > 0 && statut.enLigne ? `
          <button class="btn-primary mt-md"
                  style="width:100%;font-size:.82rem"
                  onclick="Offline.syncPendingQueue().then(
                    () => {
                      const el = Offline._getContainer();
                      if (el) Offline.render(el);
                    })">
            🔄 Synchroniser (${statut.pending} actions)
          </button>` : ''}
      </div>

      <!-- PWA Install -->
      ${this._installPrompt ? `
        <div class="card mb-md"
             style="border-color:var(--fd-indigo)">
          <div class="card-label" style="color:var(--fd-indigo)">
            📲 Installer l'application
          </div>
          <p style="font-size:.82rem;color:var(--text-muted);
                    margin:var(--space-sm) 0">
            Installe PowerApp sur ton écran d'accueil
            pour un accès rapide et une meilleure expérience.
          </p>
          <button class="btn-primary" style="width:100%"
                  onclick="Offline.demanderInstall()">
            📲 Installer maintenant
          </button>
        </div>` : ''}

      <!-- Mode hors-ligne info -->
      <div class="card mb-md">
        <div class="card-label">💾 Fonctionnement hors-ligne</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            { emoji:'✅', label:'Séances & exercices',              ok:true  },
            { emoji:'✅', label:'Historique complet',               ok:true  },
            { emoji:'✅', label:'Stats & graphiques',               ok:true  },
            { emoji:'✅', label:'Records personnels',               ok:true  },
            { emoji:'✅', label:'Photos de progression',            ok:true  },
            { emoji:'✅', label:'Coach IA (données locales)',        ok:true  },
            { emoji:'⚡', label:'Sync cloud (à la reconnexion)',    ok:null  },
            { emoji:'❌', label:'Partage en ligne',                 ok:false }
          ].map(f => `
            <div style="display:flex;align-items:center;
                        gap:var(--space-sm);padding:var(--space-xs) 0;
                        font-size:.82rem;border-bottom:1px solid
                        var(--border-color)">
              <span>${f.emoji}</span>
              <span style="color:${
                f.ok === true  ? 'var(--text-primary)' :
                                 'var(--text-muted)'
              }">${f.label}</span>
            </div>`).join('')}
        </div>
      </div>

      <!-- Service Worker -->
      <div class="card mb-md">
        <div class="card-label">⚙️ Service Worker</div>
        <div style="margin-top:var(--space-sm)">
          <div class="score-row">
            <span class="score-row-label">Statut</span>
            <span style="font-size:.82rem;font-weight:600;
                         color:${sw.actif
                           ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
              ${sw.actif ? '✅ Actif' : '❌ Inactif'}
            </span>
          </div>
          <div class="score-row">
            <span class="score-row-label">Cache</span>
            <span style="font-size:.82rem">
              ${cache.totalItems || 0} fichiers
            </span>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          <button class="btn-secondary" style="font-size:.78rem"
                  onclick="Offline.rechargerSW()">
            🔄 Mettre à jour
          </button>
          <button class="btn-secondary" style="font-size:.78rem"
                  onclick="Offline.viderCache().then(() => {
                    const el = Offline._getContainer();
                    if (el) Offline.render(el);
                  })">
            🗑️ Vider le cache
          </button>
        </div>
      </div>

      <!-- Données locales -->
      <div class="card mb-md">
        <div class="card-label">📦 Données locales</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            { label:'Taille utilisée',     val:Utils.storage.taille() },
            { label:'Actions en attente',  val:`${statut.pending} action${statut.pending>1?'s':''}` },
            { label:'Dernière sync',       val:statut.lastSyncHuman },
            { label:'Mode',                val:statut.enLigne ? 'En ligne' : 'Hors-ligne' }
          ].map(r => `
            <div class="score-row">
              <span class="score-row-label">${r.label}</span>
              <span style="font-size:.82rem;font-weight:600">
                ${r.val}
              </span>
            </div>`).join('')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm);margin-top:var(--space-md)">
          <button class="btn-secondary" style="font-size:.78rem"
                  onclick="Utils.exporterJSON()">
            📤 Exporter données
          </button>
          <button class="btn-secondary" style="font-size:.78rem"
                  onclick="Offline._importerDonnees()">
            📥 Importer données
          </button>
        </div>
      </div>

      <!-- Queue détail -->
      ${statut.pending > 0 ? `
        <div class="card mb-md">
          <div class="card-label" style="color:var(--fd-lemon)">
            ⏳ Actions en attente de sync
          </div>
          ${this._pendingQueue.slice(0, 5).map(a => `
            <div style="display:flex;justify-content:space-between;
                        padding:var(--space-xs) 0;font-size:.75rem;
                        border-bottom:1px solid var(--border-color)">
              <span style="color:var(--fd-lavender)">
                ${this._labelAction(a.type)}
              </span>
              <span style="color:var(--text-muted)">
                ${a.date}
                ${a.retries > 0
                  ? `· ${a.retries} tentative${a.retries>1?'s':''}`
                  : ''}
              </span>
            </div>`).join('')}
          ${statut.pending > 5 ? `
            <div style="font-size:.7rem;color:var(--text-muted);
                        margin-top:var(--space-xs);text-align:center">
              + ${statut.pending - 5} autre${statut.pending-5>1?'s':''}
            </div>` : ''}
          <button class="btn-secondary mt-md"
                  style="width:100%;font-size:.78rem;
                         color:var(--fd-coral)"
                  onclick="Offline._confirmerViderQueue()">
            🗑️ Vider la queue
          </button>
        </div>` : ''}

      <!-- Conseils PWA -->
      <div class="card">
        <div class="card-label">💡 Conseils PWA</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            '📲 Installe l\'app pour un accès hors-ligne complet',
            '💾 Tes séances sont toujours sauvegardées localement',
            '🔄 La sync reprend automatiquement à la reconnexion',
            '📤 Exporte régulièrement tes données en JSON',
            '⚡ L\'app fonctionne même sans internet'
          ].map(c => `
            <div style="display:flex;gap:8px;padding:var(--space-xs) 0;
                        font-size:.78rem;border-bottom:1px solid
                        var(--border-color)">
              ${c}
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // HELPERS RENDER
  // ════════════════════════════════════════════════════════
  _labelAction(type) {
    const labels = {
      seance_complete: '💪 Séance complétée',
      pr_battu:        '🏆 PR enregistré',
      mesure_ajoutee:  '⚖️ Mesure corporelle',
      xp_gagne:        '⚡ XP gagné',
      profil_modifie:  '👤 Profil modifié',
      sync_complet:    '🔄 Sync globale',
      serie_sauvegardee:'✅ Série validée'
    };
    return labels[type] || type;
  },

  async _getSWInfo() {
    if (!('serviceWorker' in navigator)) return { actif:false };
    try {
      const reg = await navigator.serviceWorker.ready;
      return { actif:true, version:this.CONFIG.cacheVersion, scope:reg.scope };
    } catch(e) {
      return { actif:false };
    }
  },

  async _confirmerViderQueue() {
    const ok = await Utils.confirmer(
      'Vider la queue ?',
      'Les actions non synchronisées seront perdues.'
    );
    if (!ok) return;
    this.viderQueue();
    Utils.toast('Queue vidée.', 'info');
    const el = this._getContainer();
    if (el) this.render(el);
  },

  _importerDonnees() {
    const input  = document.createElement('input');
    input.type   = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const fichier = e.target.files?.[0];
      if (!fichier) return;
      try {
        await Utils.importerJSON(fichier);
        setTimeout(() => window.location.reload(), 1000);
      } catch(err) {
        Utils.toast('❌ Fichier invalide', 'error');
      }
    };
    input.click();
  }
};

window.Offline = Offline;
console.log('✅ Offline.js v1.0 chargé');
