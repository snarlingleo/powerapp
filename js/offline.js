/* ============================================================
   PowerApp — Offline.js v3.0
   Mode hors-ligne complet + Backup auto + Restauration
   + Backup nutrition + Profil onboarding + Séances custom
   + Versioning backup (3 derniers)
   ============================================================ */

const Offline = {

  _estEnLigne:   navigator.onLine,
  _syncing:      false,
  _lastSync:     null,
  _pendingQueue: [],
  _listeners:    [],

  CONFIG: {
    cleQueue:      'ft_offline_queue',
    cleLastSync:   'ft_offline_last_sync',
    cleBackupBase: 'ft_backup_v',  // ✅ NOUVEAU v3.0
    nbBackups:     3,              // ✅ NOUVEAU v3.0 — 3 versions
    retryDelay:    30000,
    maxRetries:    5,
    cacheVersion:  'powerapp-v4'
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

    // ✅ Backup auto toutes les 5 minutes
    setInterval(() => {
      try { this._sauvegarderBackupLocal(); } catch(e) {}
      if (this._estEnLigne && !this._syncing) {
        this.syncPendingQueue();
      }
    }, 5 * 60 * 1000);

    // ✅ Backup au démarrage
    setTimeout(() => {
      try { this._sauvegarderBackupLocal(); } catch(e) {}
    }, 3000);

    console.log(
      `✅ Offline.js v3.0 init — en ligne: ${this._estEnLigne}`,
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

  async _verifierConnexion() {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
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
    this._pendingQueue = Utils.storage.get(
      this.CONFIG.cleQueue, []
    );
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

    const aTraiter  = [...this._pendingQueue];
    const reussies  = [], echouees = [];

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
      try { this._sauvegarderBackupLocal(); } catch(e) {}
      this._notifierListeners('synced', { count: reussies.length });
    }
  },

  async _traiterAction(action) {
    switch(action.type) {
      case 'seance_complete':
        console.log('[Offline] Séance synced:', action.data?.seanceId);
        break;
      case 'serie_sauvegardee':
        break;
      case 'pr_battu':
        break;
      case 'mesure_ajoutee':
        try { Tracker.ajouterMesure(action.data); } catch(e) {}
        break;
      case 'xp_gagne':
        break;
      case 'profil_modifie':
        try { Tracker.sauvegarderProfil(action.data); } catch(e) {}
        break;
      case 'sync_complet':
        console.log('[Offline] Sync globale OK');
        break;
      default:
        console.log('[Offline] Action traitée localement:', action.type);
    }
    try { this._sauvegarderBackupLocal(); } catch(e) {}
  },

  // ════════════════════════════════════════════════════════
  // ✅ BACKUP LOCAL — v3.0 complet + versioning
  // ════════════════════════════════════════════════════════
  _sauvegarderBackupLocal() {
    try {
      // ✅ NOUVEAU v3.0 — Nutrition (7 derniers jours)
      const nutritionJournal = {};
      const nutritionEau     = {};
      for (let i = 0; i < 7; i++) {
        const date    = Utils.ajouterJours(Utils.aujourd_hui(), -i);
        const journal = Utils.storage.get(
          `ft_nutrition_journal_${date}`, null
        );
        const eau     = Utils.storage.get(
          `ft_nutrition_eau_${date}`, null
        );
        if (journal) nutritionJournal[date] = journal;
        if (eau !== null) nutritionEau[date] = eau;
      }

      const backup = {
        date:               new Date().toISOString(),
        version:            'v3.0',
        // Profil
        profil:             Utils.storage.get('ft_profil', {}),
        profilOnboarding:   Utils.storage.get('ft_profil_onboarding', {}), // ✅ NOUVEAU
        profilComplet:      Utils.storage.get('ft_profil_complet', {}),   // ✅ NOUVEAU
        // Activité
        streak:             Utils.storage.get('ft_streak', {}),
        mesures:            Utils.storage.get('ft_mesures', []),
        objectifs:          Utils.storage.get('ft_objectifs', []),
        blessures:          Utils.storage.get('ft_blessures', []),
        journal:            Utils.storage.get('ft_journal', []).slice(0, 30),
        photos:             Utils.storage.get('ft_photos', []).slice(0, 5),
        // Gamification
        xp:                 Utils.storage.get('ft_xp', {}),
        xpTotal:            Utils.storage.get('ft_xp_total', 0),           // ✅ NOUVEAU
        trophees:           Utils.storage.get('ft_trophees', []),
        // PRs
        prs:                this._getAllPRsLocal(),
        // Programme IA
        programmeIA:        Utils.storage.get('ft_programme_ia_genere', null), // ✅ NOUVEAU
        programmeIAConfig:  Utils.storage.get('ft_programme_ia_config', null), // ✅ NOUVEAU
        // Séances custom
        seancesCustom:      Utils.storage.get('ft_seances_custom', {}),        // ✅ NOUVEAU
        // Nutrition (7 derniers jours)
        nutritionJournal,                                                       // ✅ NOUVEAU
        nutritionEau,                                                           // ✅ NOUVEAU
        nutritionObjectifs: Utils.storage.get('ft_nutrition_objectifs', null), // ✅ NOUVEAU
        // Planning
        planning:           Utils.storage.get('ft_planning_custom', null),
        planningNew:        Utils.storage.get('ft_planning', null),            // ✅ NOUVEAU
        // Config
        notifsConfig:       Utils.storage.get('ft_notifs_config', null),
        themeConfig:        Utils.storage.get('ft_theme_config', null)         // ✅ NOUVEAU
      };

      // ✅ NOUVEAU v3.0 — Versioning : garder 3 backups
      this._rotationBackup(backup);

      // Backup principal (compatibilité)
      Utils.storage.set('ft_backup_auto', backup);

      console.log('[Offline] Backup v3.0 sauvegardé ✅');
    } catch(e) {
      console.warn('[Offline] Erreur backup:', e);
    }
  },

  // ✅ NOUVEAU v3.0 — Rotation des backups (3 versions)
  _rotationBackup(backup) {
    try {
      // Décaler les backups : v3 → supprimer, v2 → v3, v1 → v2, nouveau → v1
      const v2 = Utils.storage.get(
        this.CONFIG.cleBackupBase + '2', null
      );
      if (v2) {
        Utils.storage.set(
          this.CONFIG.cleBackupBase + '3', v2
        );
      }
      const v1 = Utils.storage.get(
        this.CONFIG.cleBackupBase + '1', null
      );
      if (v1) {
        Utils.storage.set(
          this.CONFIG.cleBackupBase + '2', v1
        );
      }
      Utils.storage.set(
        this.CONFIG.cleBackupBase + '1', backup
      );
    } catch(e) {}
  },

  // ✅ NOUVEAU v3.0 — Récupérer la liste des backups
  getBackups() {
    const backups = [];
    for (let i = 1; i <= this.CONFIG.nbBackups; i++) {
      const b = Utils.storage.get(
        this.CONFIG.cleBackupBase + i, null
      );
      if (b) backups.push({ version: i, ...b });
    }
    // Ajouter backup_auto si existe
    const auto = Utils.storage.get('ft_backup_auto', null);
    if (auto) backups.unshift({ version: 0, ...auto });
    return backups;
  },

  _getAllPRsLocal() {
    const prs = {};
    for (let i = 0; i < localStorage.length; i++) {
      const cle = localStorage.key(i);
      if (cle?.startsWith('ft_pr_')) {
        try {
          prs[cle.replace('ft_pr_', '')] = JSON.parse(
            localStorage.getItem(cle)
          );
        } catch(e) {}
      }
    }
    return prs;
  },

  // ✅ NOUVEAU v3.0 — Restauration complète
  async _restaurerDepuisBackup(versionIdx = null) {
    const backups = this.getBackups();
    if (!backups.length) {
      Utils.toast('Aucun backup disponible.', 'info');
      return;
    }

    // Utiliser le backup demandé ou le plus récent
    const backup = versionIdx !== null
      ? backups.find(b => b.version === versionIdx)
      : backups[0];

    if (!backup) {
      Utils.toast('Backup introuvable.', 'error');
      return;
    }

    const dateBackup = new Date(backup.date).toLocaleString('fr-FR');
    const ok = await Utils.confirmer(
      '🔄 Restaurer depuis backup ?',
      `Backup du ${dateBackup}. Tes données actuelles seront remplacées.`
    );
    if (!ok) return;

    try {
      // ✅ Profil
      if (backup.profil)    Utils.storage.set('ft_profil', backup.profil);
      if (backup.profilOnboarding) {
        Utils.storage.set('ft_profil_onboarding', backup.profilOnboarding);
      }
      if (backup.profilComplet) {
        Utils.storage.set('ft_profil_complet', backup.profilComplet);
      }
      // ✅ Activité
      if (backup.streak)    Utils.storage.set('ft_streak',    backup.streak);
      if (backup.mesures)   Utils.storage.set('ft_mesures',   backup.mesures);
      if (backup.objectifs) Utils.storage.set('ft_objectifs', backup.objectifs);
      if (backup.blessures) Utils.storage.set('ft_blessures', backup.blessures);
      if (backup.journal)   Utils.storage.set('ft_journal',   backup.journal);
      // ✅ Gamification
      if (backup.xp)        Utils.storage.set('ft_xp',        backup.xp);
      if (backup.xpTotal !== undefined) {
        Utils.storage.set('ft_xp_total', backup.xpTotal);
      }
      if (backup.trophees)  Utils.storage.set('ft_trophees',  backup.trophees);
      // ✅ PRs
      if (backup.prs) {
        Object.entries(backup.prs).forEach(([ref, pr]) => {
          Utils.storage.set(`ft_pr_${ref}`, pr);
        });
      }
      // ✅ Programme IA
      if (backup.programmeIA) {
        Utils.storage.set('ft_programme_ia_genere', backup.programmeIA);
      }
      if (backup.programmeIAConfig) {
        Utils.storage.set('ft_programme_ia_config', backup.programmeIAConfig);
      }
      // ✅ Séances custom
      if (backup.seancesCustom) {
        Utils.storage.set('ft_seances_custom', backup.seancesCustom);
      }
      // ✅ NOUVEAU v3.0 — Nutrition
      if (backup.nutritionJournal) {
        Object.entries(backup.nutritionJournal).forEach(
          ([date, journal]) => {
            Utils.storage.set(`ft_nutrition_journal_${date}`, journal);
          }
        );
      }
      if (backup.nutritionEau) {
        Object.entries(backup.nutritionEau).forEach(
          ([date, eau]) => {
            Utils.storage.set(`ft_nutrition_eau_${date}`, eau);
          }
        );
      }
      if (backup.nutritionObjectifs) {
        Utils.storage.set(
          'ft_nutrition_objectifs', backup.nutritionObjectifs
        );
      }
      // ✅ Planning
      if (backup.planning) {
        Utils.storage.set('ft_planning_custom', backup.planning);
      }
      if (backup.planningNew) {
        Utils.storage.set('ft_planning', backup.planningNew);
      }
      // ✅ Config
      if (backup.notifsConfig) {
        Utils.storage.set('ft_notifs_config', backup.notifsConfig);
      }
      if (backup.themeConfig) {
        Utils.storage.set('ft_theme_config', backup.themeConfig);
      }

      Utils.toast(
        '✅ Données restaurées avec succès !', 'success', 3000
      );
      Utils.vibrerSuccess();
      setTimeout(() => window.location.reload(), 1500);
    } catch(e) {
      Utils.toast('❌ Erreur lors de la restauration.', 'error');
      console.error('[Offline] Erreur restauration:', e);
    }
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
      padding:10px 16px;
      border-radius:var(--radius-full,99px);
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
        this.ajouterAction('sync_complet', {
          cle, timestamp: Date.now()
        });
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
  // RENDER
  // ════════════════════════════════════════════════════════
  _getContainer() {
    return document.getElementById('page-offline')
      || document.getElementById('offline-content')
      || document.getElementById('stats-content');
  },

  async render(container) {
    if (!container) return;

    const statut  = this.getStatut();
    const cache   = await this.getCacheStats();
    const sw      = await this._getSWInfo();
    const backups = this.getBackups();
    const backup  = backups[0] || null;

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
                          ? 'var(--fd-mint)' : 'var(--fd-coral)'}">
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
                  onclick="Offline.syncPendingQueue().then(() => {
                    const el = Offline._getContainer();
                    if (el) Offline.render(el);
                  })">
            🔄 Synchroniser (${statut.pending} actions)
          </button>` : ''}
      </div>

      <!-- ✅ NOUVEAU v3.0 — Backups versionnés -->
      <div class="card mb-md"
           style="border-color:${backup
             ? 'rgba(139,240,187,0.3)' : 'var(--border-color)'}">
        <div class="flex justify-between items-center mb-md">
          <div class="card-label"
               style="color:${backup
                 ? 'var(--fd-mint)' : 'var(--text-muted)'};margin:0">
            💾 Sauvegardes automatiques
          </div>
          <span style="font-size:.65rem;color:var(--text-muted)">
            ${backups.length}/${this.CONFIG.nbBackups} versions
          </span>
        </div>

        ${backup ? `
          <div style="font-size:.78rem;color:var(--text-muted);
                      margin-bottom:var(--space-sm)">
            Dernière :
            <span style="color:var(--fd-mint);font-weight:600">
              ${new Date(backup.date).toLocaleString('fr-FR')}
            </span>
          </div>

          <!-- Ce que le backup contient -->
          <div style="display:flex;flex-wrap:wrap;gap:4px;
                      margin-bottom:var(--space-sm)">
            ${[
              backup.prs
                ? `${Object.keys(backup.prs).length} PRs` : '',
              backup.mesures?.length
                ? `${backup.mesures.length} mesures` : '',
              backup.nutritionJournal
                ? `${Object.keys(backup.nutritionJournal).length}j nutrition` : '',
              backup.seancesCustom
                ? `${Object.keys(backup.seancesCustom).length} séances IA` : '',
              backup.programmeIA
                ? `Programme IA` : '',
              backup.profilOnboarding?.genre
                ? `Profil ${backup.profilOnboarding.genre}` : ''
            ].filter(Boolean).map(i => `
              <span style="padding:2px 8px;
                           background:rgba(139,240,187,0.1);
                           border:1px solid rgba(139,240,187,0.2);
                           border-radius:99px;
                           font-size:.62rem;
                           color:var(--fd-mint)">
                ✅ ${i}
              </span>`).join('')}
          </div>

          <!-- ✅ NOUVEAU v3.0 — Liste des 3 versions -->
          ${backups.length > 1 ? `
            <div style="margin-bottom:var(--space-sm)">
              <div style="font-size:.6rem;font-weight:700;
                          text-transform:uppercase;
                          letter-spacing:.08em;
                          color:var(--text-muted);
                          margin-bottom:6px">
                Versions disponibles
              </div>
              ${backups.map((b, i) => `
                <div style="display:flex;
                            justify-content:space-between;
                            align-items:center;padding:5px 0;
                            border-bottom:1px solid var(--border-color)">
                  <span style="font-size:.72rem;
                               color:${i === 0
                                 ? 'var(--fd-mint)'
                                 : 'var(--text-muted)'}">
                    ${i === 0 ? '🟢' : '⚪'} V${b.version||'auto'}
                    <span style="font-size:.62rem">
                      · ${new Date(b.date).toLocaleString('fr-FR',
                          {hour:'2-digit',minute:'2-digit',
                           day:'2-digit',month:'2-digit'})}
                    </span>
                  </span>
                  <button onclick="Offline._restaurerDepuisBackup(${b.version||null})"
                          style="padding:3px 10px;
                                 background:rgba(75,75,249,0.15);
                                 border:1px solid rgba(75,75,249,0.3);
                                 border-radius:99px;
                                 color:var(--fd-lavender);
                                 font-size:.62rem;cursor:pointer">
                    Restaurer
                  </button>
                </div>`).join('')}
            </div>` : ''}` : `
          <p style="font-size:.78rem;color:var(--text-muted);
                    margin-bottom:var(--space-sm)">
            Aucune sauvegarde auto disponible.<br>
            Lance une séance pour créer un backup !
          </p>`}

        <div style="display:grid;grid-template-columns:1fr 1fr;
                    gap:var(--space-sm)">
          <button class="btn-secondary" style="font-size:.75rem"
                  onclick="Offline._sauvegarderBackupLocal();
                           Utils.toast('✅ Backup créé !','success',2000);
                           setTimeout(() => {
                             const el = Offline._getContainer();
                             if (el) Offline.render(el);
                           }, 500)">
            💾 Backup maintenant
          </button>
          <button class="btn-secondary"
                  style="font-size:.75rem;
                         color:${backup
                           ? 'var(--fd-mint)' : 'var(--text-muted)'}"
                  onclick="Offline._restaurerDepuisBackup()"
                  ${!backup ? 'disabled' : ''}>
            🔄 Restaurer (dernier)
          </button>
        </div>
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
            Installe PowerApp sur ton écran d'accueil pour un accès
            rapide et une meilleure expérience.
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
            { emoji:'✅', label:'Séances & exercices'                },
            { emoji:'✅', label:'Historique complet'                 },
            { emoji:'✅', label:'Stats & graphiques'                 },
            { emoji:'✅', label:'Records personnels'                 },
            { emoji:'✅', label:'Photos de progression'              },
            { emoji:'✅', label:'Coach IA (données locales)'         },
            { emoji:'✅', label:'Nutrition journal (7 jours)'        },
            { emoji:'✅', label:'Programme IA sauvegardé'            },
            { emoji:'✅', label:'Profil onboarding sauvegardé'       },
            { emoji:'✅', label:'Backup auto toutes les 5 min (3 versions)' },
            { emoji:'✅', label:'Restauration depuis 3 versions'     },
            { emoji:'⚡', label:'Sync cloud (à la reconnexion)'     },
            { emoji:'❌', label:'Partage en ligne'                   }
          ].map(f => `
            <div style="display:flex;align-items:center;
                        gap:var(--space-sm);padding:var(--space-xs) 0;
                        font-size:.82rem;
                        border-bottom:1px solid var(--border-color)">
              <span>${f.emoji}</span>
              <span>${f.label}</span>
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
            { label:'Taille utilisée',    val:Utils.storage.taille()  },
            { label:'Actions en attente', val:`${statut.pending}` },
            { label:'Dernière sync',      val:statut.lastSyncHuman    },
            { label:'Backups disponibles',val:`${backups.length}/3`   },
            { label:'Mode',               val:statut.enLigne
              ? 'En ligne' : 'Hors-ligne' }
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
        <div class="card-label">💡 Conseils</div>
        <div style="margin-top:var(--space-sm)">
          ${[
            '📲 Installe l\'app pour un accès hors-ligne complet',
            '💾 3 versions de backup conservées automatiquement',
            '🔄 La sync reprend automatiquement à la reconnexion',
            '📤 Exporte régulièrement tes données en JSON',
            '⚡ L\'app fonctionne même sans internet'
          ].map(c => `
            <div style="display:flex;gap:8px;padding:var(--space-xs) 0;
                        font-size:.78rem;border-bottom:
                        1px solid var(--border-color)">
              ${c}
            </div>`).join('')}
        </div>
      </div>
    `;
  },

  // ════════════════════════════════════════════════════════
  // HELPERS
  // ════════════════════════════════════════════════════════
  _labelAction(type) {
    const labels = {
      seance_complete:    '💪 Séance complétée',
      pr_battu:           '🏆 PR enregistré',
      mesure_ajoutee:     '⚖️ Mesure corporelle',
      xp_gagne:           '⚡ XP gagné',
      profil_modifie:     '👤 Profil modifié',
      sync_complet:       '🔄 Sync globale',
      serie_sauvegardee:  '✅ Série validée'
    };
    return labels[type] || type;
  },

  async _getSWInfo() {
    if (!('serviceWorker' in navigator)) return { actif:false };
    try {
      const reg = await navigator.serviceWorker.ready;
      return {
        actif:   true,
        version: this.CONFIG.cacheVersion,
        scope:   reg.scope
      };
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
console.log('✅ Offline.js v3.0 chargé — Backup complet + Nutrition + IA + Versioning');
