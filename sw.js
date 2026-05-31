/* ============================================================
   PowerApp — Service Worker v4.0
   ✅ Cache stratégique + Sync + Background + Notifications
   ✅ Précaching intelligent
   ✅ Offline complet
   ✅ Timer repos background
   ✅ Periodic sync amélioré
   ✅ Install prompt
   ============================================================ */

'use strict';

const CACHE_VERSION = 'powerapp-v5';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES  = `${CACHE_VERSION}-images`;
const CACHE_FONTS   = `${CACHE_VERSION}-fonts`;

// ════════════════════════════════════════════════════════════
// ASSETS STATIQUES
// ════════════════════════════════════════════════════════════
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',

  // JS Core
  './js/utils.js',
  './js/i18n.js',
  './js/tracker.js',
  './js/programme.js',
  './js/chrono.js',
  './js/gamification.js',
  './js/nutrition.js',
  './js/coach.js',
  './js/predict.js',
  './js/stats.js',
  './js/history.js',
  './js/photos.js',
  './js/defis.js',
  './js/social.js',
  './js/superset.js',
  './js/circuit.js',
  './js/hiit.js',
  './js/calculateur.js',
  './js/export.js',
  './js/share.js',
  './js/notifications.js',
  './js/offline.js',
  './js/video.js',
  './js/ui-premium.js',
  './js/lava.js',
  './js/themes.js',
  './js/voice.js', 
  './js/app.js',

  // Icons
  './assets/icons/icon-72.png',
  './assets/icons/icon-96.png',
  './assets/icons/icon-128.png',
  './assets/icons/icon-144.png',
  './assets/icons/icon-152.png',
  './assets/icons/icon-167.png',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

// ✅ Assets CDN à mettre en cache
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://code.jquery.com/jquery-3.7.1.min.js',
  'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js'
];

const NEVER_CACHE = [
  'firebase', 'googleapis', 'analytics',
  'chrome-extension', 'hot-update', 'sockjs'
];

// ════════════════════════════════════════════════════════════
// INSTALL
// ════════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('[SW v4.0] Install...');

  event.waitUntil(
    Promise.all([
      // ✅ Cache statique principal
      caches.open(CACHE_STATIC).then(cache => {
        const promises = STATIC_ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn(`[SW] Cache skip: ${url}`)
          )
        );
        return Promise.allSettled(promises);
      }),

      // ✅ Cache CDN séparé
      caches.open(CACHE_DYNAMIC).then(cache => {
        const promises = CDN_ASSETS.map(url =>
          fetch(url, { cache: 'no-cache' })
            .then(r => { if (r.ok) cache.put(url, r); })
            .catch(() => {})
        );
        return Promise.allSettled(promises);
      })
    ])
    .then(() => {
      console.log('[SW v4.0] Cache prêt ✅');
      return self.skipWaiting();
    })
    .catch(err => console.error('[SW] Erreur install:', err))
  );
});

// ════════════════════════════════════════════════════════════
// ACTIVATE
// ════════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('[SW v4.0] Activate...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const valides = [
          CACHE_STATIC, CACHE_DYNAMIC,
          CACHE_IMAGES, CACHE_FONTS
        ];
        return Promise.all(
          cacheNames
            .filter(name => !valides.includes(name))
            .map(name => {
              console.log('[SW] Suppression:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW v4.0] Caches nettoyés ✅');
        // ✅ Notifier les clients de la mise à jour
        _notifierClients({ type: 'SW_UPDATED', version: CACHE_VERSION });
        return self.clients.claim();
      })
  );
});

// ════════════════════════════════════════════════════════════
// FETCH — Stratégies intelligentes
// ════════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ Ignorer méthodes non-GET
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'blob:') return;
  if (url.protocol === 'data:') return;

  // ✅ Jamais mettre en cache
  if (NEVER_CACHE.some(n => url.href.includes(n))) {
    event.respondWith(
      fetch(request).catch(() => _offlineFallback(request))
    );
    return;
  }

  // ✅ Fonts Google → Cache First (très longue durée)
  if (url.hostname.includes('fonts.g')) {
    event.respondWith(
      _strategieCacheFirst(request, CACHE_FONTS)
    );
    return;
  }

  // ✅ CDN JS/CSS → Stale While Revalidate
  if (_estCDN(url)) {
    event.respondWith(
      _strategieStaleWhileRevalidate(request, CACHE_DYNAMIC)
    );
    return;
  }

  // ✅ Images → Cache First
  if (_estImage(url)) {
    event.respondWith(
      _strategieCacheFirst(request, CACHE_IMAGES)
    );
    return;
  }

  // ✅ Assets locaux statiques → Cache First
  if (_estStatique(url)) {
    event.respondWith(
      _strategieCacheFirst(request, CACHE_STATIC)
    );
    return;
  }

  // ✅ API Firebase → Network First
  if (_estAPI(url)) {
    event.respondWith(
      _strategieNetworkFirst(request, CACHE_DYNAMIC)
    );
    return;
  }

  // ✅ Autres → Stale While Revalidate
  event.respondWith(
    _strategieStaleWhileRevalidate(request, CACHE_DYNAMIC)
  );
});

// ════════════════════════════════════════════════════════════
// STRATÉGIES DE CACHE
// ════════════════════════════════════════════════════════════
async function _strategieCacheFirst(request, cacheName) {
  try {
    const cache  = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch(err) {
    return _offlineFallback(request);
  }
}

async function _strategieNetworkFirst(request, cacheName) {
  try {
    const response = await fetch(request, { timeout: 5000 });
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch(err) {
    const cache  = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || _offlineFallback(request);
  }
}

async function _strategieStaleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // ✅ Revalider en arrière-plan
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

async function _offlineFallback(request) {
  // ✅ HTML → Page offline complète
  if (request.headers.get('Accept')?.includes('text/html')) {
    const cache    = await caches.open(CACHE_STATIC);
    const fallback = await cache.match('./index.html');
    if (fallback) return fallback;
    return new Response(
      _offlineHTML(),
      { headers: { 'Content-Type': 'text/html;charset=utf-8' } }
    );
  }

  // ✅ Images → SVG placeholder
  if (_estImage(new URL(request.url))) {
    return new Response(
      _offlineSVG(),
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  // ✅ JS/CSS → vide (ne pas bloquer)
  if (/\.(js|css)$/.test(new URL(request.url).pathname)) {
    return new Response('/* offline */', {
      headers: { 'Content-Type': 'text/javascript' }
    });
  }

  return new Response(
    JSON.stringify({ error: 'Hors-ligne', offline: true }),
    {
      status:  503,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// ════════════════════════════════════════════════════════════
// HELPERS DÉTECTION
// ════════════════════════════════════════════════════════════
function _estImage(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);
}

function _estStatique(url) {
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname)
    || url.pathname === '/'
    || url.pathname.endsWith('.html');
}

function _estAPI(url) {
  return url.hostname.includes('firebase')
    || url.hostname.includes('googleapis')
    || url.hostname.includes('firebaseio')
    || url.hostname.includes('firebasestorage');
}

function _estCDN(url) {
  return url.hostname.includes('cdn.jsdelivr')
    || url.hostname.includes('unpkg.com')
    || url.hostname.includes('cdnjs.cloudflare')
    || url.hostname.includes('code.jquery');
}

// ════════════════════════════════════════════════════════════
// MESSAGES DU CLIENT
// ════════════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch(type) {

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CACHE_URLS':
      if (Array.isArray(payload)) {
        caches.open(CACHE_DYNAMIC)
          .then(cache => cache.addAll(payload))
          .catch(() => {});
      }
      break;

    case 'CLEAR_CACHE': {
      const nameToDelete = payload || CACHE_DYNAMIC;
      caches.delete(nameToDelete).then(() => {
        _notifierClients({ type: 'CACHE_CLEARED', nameToDelete });
      });
      break;
    }

    case 'GET_CACHE_SIZE':
      _getCacheSize().then(info => {
        event.source?.postMessage({ type: 'CACHE_SIZE', ...info });
      });
      break;

    // ✅ Timer repos background — même téléphone verrouillé
    case 'TIMER_REPOS_START': {
      const { duree, exoIdx, serieIdx, totalSeries } = payload || {};
      _demarrerTimerBackground(duree, exoIdx, serieIdx, totalSeries);
      break;
    }

    case 'TIMER_REPOS_CANCEL':
      _annulerTimerBackground();
      break;

    // ✅ Alarme réveil
    case 'PLANIFIER_ALARME': {
      const { heure, message, repetitions } = payload || {};
      _planifierAlarmeLocale(heure, message, repetitions);
      break;
    }

    case 'ANNULER_ALARME':
      _annulerAlarmeLocale();
      break;

    // ✅ Précacher une liste d'URLs dynamiques
    case 'PRECACHE': {
      const { urls, cacheName } = payload || {};
      if (Array.isArray(urls)) {
        caches.open(cacheName || CACHE_DYNAMIC)
          .then(cache => {
            urls.forEach(url =>
              fetch(url).then(r => {
                if (r.ok) cache.put(url, r);
              }).catch(() => {})
            );
          });
      }
      break;
    }

    // ✅ Forcer mise à jour du cache statique
    case 'REFRESH_STATIC':
      _rafraichirCacheStatique();
      break;

    default:
      console.log('[SW] Message inconnu:', type);
  }
});

// ════════════════════════════════════════════════════════════
// ✅ NOUVEAU — Timer repos en arrière-plan
// ════════════════════════════════════════════════════════════
let _timerBackground = null;

function _demarrerTimerBackground(duree, exoIdx, serieIdx, totalSeries) {
  _annulerTimerBackground();

  if (!duree || duree <= 0) return;

  const heureFin = Date.now() + duree * 1000;

  console.log(`[SW] Timer repos ${duree}s démarré`);

  _timerBackground = setTimeout(async () => {
    console.log('[SW] Timer repos TERMINÉ → notification');

    // ✅ Vibration + notification système
    await self.registration.showNotification(
      '⏱️ Repos terminé — Série suivante !', {
        body:               `Série ${(serieIdx||0) + 2} / ${totalSeries||'?'} — C'est reparti ! 💪`,
        icon:               './assets/icons/icon-192.png',
        badge:              './assets/icons/icon-72.png',
        tag:                'repos-termine',
        vibrate:            [200, 100, 200, 100, 200],
        requireInteraction: false,
        silent:             false,
        renotify:           true,
        data:               { exoIdx, serieIdx, action: 'repos_termine' },
        actions: [
          { action: 'reprendre', title: '💪 Reprendre'  },
          { action: 'plus15',    title: '+15s repos'    }
        ]
      }
    );

    // ✅ Notifier l'app si elle est ouverte
    _notifierClients({
      type:      'TIMER_REPOS_TERMINE',
      exoIdx,
      serieIdx,
      totalSeries
    });

  }, duree * 1000);
}

function _annulerTimerBackground() {
  if (_timerBackground) {
    clearTimeout(_timerBackground);
    _timerBackground = null;
    console.log('[SW] Timer repos annulé');
  }
}

// ════════════════════════════════════════════════════════════
// BACKGROUND SYNC
// ════════════════════════════════════════════════════════════
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  switch(event.tag) {
    case 'powerapp-sync':
      event.waitUntil(
        Promise.all([
          _notifierClients({ type: 'SYNC_REQUESTED' }),
          _sauvegarderDonneesEssentielles()
        ])
      );
      break;

    case 'powerapp-sync-seance':
      event.waitUntil(
        _notifierClients({ type: 'SYNC_SEANCE' })
      );
      break;

    case 'powerapp-sync-offline':
      event.waitUntil(
        _notifierClients({ type: 'SYNC_OFFLINE_QUEUE' })
      );
      break;

    // ✅ NOUVEAU — Sync backup hebdomadaire
    case 'powerapp-backup':
      event.waitUntil(
        _notifierClients({ type: 'BACKUP_REQUESTED' })
      );
      break;
  }
});

// ✅ Rafraîchir le cache statique
async function _rafraichirCacheStatique() {
  try {
    const cache = await caches.open(CACHE_STATIC);
    await Promise.allSettled(
      STATIC_ASSETS.map(url =>
        fetch(url, { cache: 'no-store' })
          .then(r => { if (r.ok) cache.put(url, r); })
          .catch(() => {})
      )
    );
    console.log('[SW] Cache statique rafraîchi ✅');
    _notifierClients({ type: 'STATIC_REFRESHED' });
  } catch(e) {}
}

async function _sauvegarderDonneesEssentielles() {
  try {
    const cache = await caches.open(CACHE_STATIC);
    const essentiels = [
      './index.html',
      './js/app.js',
      './css/style.css'
    ];
    await Promise.allSettled(
      essentiels.map(url =>
        fetch(url, { cache: 'no-store' })
          .then(r => { if (r.ok) cache.put(url, r); })
          .catch(() => {})
      )
    );
    console.log('[SW] Données essentielles mises en cache');
  } catch(e) {}
}

// ════════════════════════════════════════════════════════════
// PUSH NOTIFICATIONS
// ════════════════════════════════════════════════════════════
self.addEventListener('push', (event) => {
  console.log('[SW] Push reçu');

  let data = {
    titre:   '⚡ PowerApp',
    message: 'Ta séance t\'attend !',
    icon:    './assets/icons/icon-192.png',
    badge:   './assets/icons/icon-72.png',
    tag:     'powerapp-push',
    actions: [
      { action: 'go',    title: '💪 J\'y vais !' },
      { action: 'later', title: '⏰ Plus tard'   }
    ]
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = { ...data, ...payload };
    }
  } catch(e) {}

  event.waitUntil(
    self.registration.showNotification(data.titre, {
      body:     data.message,
      icon:     data.icon,
      badge:    data.badge,
      tag:      data.tag,
      vibrate:  [200, 100, 200],
      renotify: true,
      actions:  data.actions,
      data
    })
  );
});

// ════════════════════════════════════════════════════════════
// NOTIFICATION CLICK
// ════════════════════════════════════════════════════════════
self.addEventListener('notificationclick', (event) => {
  const { action, notification } = event;
  notification.close();

  console.log('[SW] Notification click:', action);

  // ✅ Timer repos — +15s
  if (action === 'plus15') {
    _notifierClients({
      type:      'TIMER_REPOS_PLUS15',
      secondes:  15
    });
    return;
  }

  // ✅ Timer repos — reprendre
  if (action === 'reprendre') {
    event.waitUntil(
      self.clients.matchAll({
        type: 'window', includeUncontrolled: true
      }).then(clients => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            client.postMessage({
              type: 'TIMER_REPOS_TERMINE',
              fromNotif: true
            });
            return;
          }
        }
        return self.clients.openWindow('./');
      })
    );
    return;
  }

  if (action === 'later' || action === 'eau') {
    if (action === 'eau') {
      _notifierClients({ type: 'EAU_AJOUTEE', ml: 250 });
    }
    return;
  }

  // ✅ Navigation selon action
  const navigationMap = {
    'go':      'live',
    'live':    'live',
    'express': 'live',
    'stats':   'stats',
    'share':   'share',
    'repos':   'live',
    'trophees':'gamification',
    'coach':   'coach'
  };

  const page = navigationMap[action]
    || notification.data?.page
    || 'home';

  event.waitUntil(
    self.clients.matchAll({
      type: 'window', includeUncontrolled: true
    }).then(clients => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin)
            && 'focus' in client) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE', page });
          return;
        }
      }
      return self.clients.openWindow('./');
    })
  );
});

// ════════════════════════════════════════════════════════════
// NOTIFICATION CLOSE
// ════════════════════════════════════════════════════════════
self.addEventListener('notificationclose', (event) => {
  _notifierClients({
    type: 'NOTIFICATION_CLOSED',
    tag:  event.notification.tag
  });
});

// ════════════════════════════════════════════════════════════
// PERIODIC BACKGROUND SYNC
// ════════════════════════════════════════════════════════════
self.addEventListener('periodicsync', (event) => {
  switch(event.tag) {
    case 'powerapp-daily':
      event.waitUntil(
        _notifierClients({ type: 'DAILY_SYNC' })
      );
      break;

    // ✅ Sync hebdomadaire → backup auto
    case 'powerapp-weekly':
      event.waitUntil(
        _notifierClients({ type: 'WEEKLY_BACKUP' })
      );
      break;

    // ✅ Check streak quotidien
    case 'powerapp-streak-check':
      event.waitUntil(
        _notifierClients({ type: 'STREAK_CHECK' })
      );
      break;
  }
});

// ════════════════════════════════════════════════════════════
// UTILITAIRES SW
// ════════════════════════════════════════════════════════════
async function _notifierClients(message) {
  try {
    const clients = await self.clients.matchAll({
      includeUncontrolled: true
    });
    clients.forEach(client => client.postMessage(message));
  } catch(e) {}
}

async function _getCacheSize() {
  try {
    const cacheNames = await caches.keys();
    let totalEntries = 0;
    const details    = {};

    for (const name of cacheNames) {
      const cache   = await caches.open(name);
      const keys    = await cache.keys();
      details[name] = keys.length;
      totalEntries += keys.length;
    }

    return { total: totalEntries, details, version: CACHE_VERSION };
  } catch(e) {
    return { total: 0, details: {}, version: CACHE_VERSION };
  }
}

// ════════════════════════════════════════════════════════════
// ALARME — Fonctionne téléphone verrouillé
// ════════════════════════════════════════════════════════════
let _alarmeTimer = null;

function _planifierAlarmeLocale(heure, message, repetitions = 3) {
  _annulerAlarmeLocale();

  _alarmeTimer = setInterval(() => {
    const now    = new Date();
    const [h, m] = heure.split(':').map(Number);

    if (now.getHours()   === h
        && now.getMinutes() === m
        && now.getSeconds() <= 10) {

      for (let i = 0; i < repetitions; i++) {
        setTimeout(() => {
          self.registration.showNotification(
            '⚡ PowerApp — Go t\'entraîner !', {
              body:               message || 'C\'est l\'heure du sport !',
              icon:               './assets/icons/icon-192.png',
              badge:              './assets/icons/icon-72.png',
              silent:             false,
              requireInteraction: true,
              renotify:           true,
              tag:                `powerapp-alarme-${i}`,
              vibrate: [500,200,500,200,500,500,200,500,200,500],
              actions: [
                { action: 'go',    title: '💪 J\'y vais !' },
                { action: 'later', title: '⏰ +30 min'     }
              ]
            }
          );
        }, i * 120000);
      }
    }
  }, 5000);
}

function _annulerAlarmeLocale() {
  if (_alarmeTimer) {
    clearInterval(_alarmeTimer);
    _alarmeTimer = null;
  }
}

// ════════════════════════════════════════════════════════════
// FALLBACKS HTML + SVG
// ════════════════════════════════════════════════════════════
function _offlineHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>PowerApp — Hors-ligne</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      min-height:100vh;
      background:linear-gradient(180deg,#020610 0%,#030818 100%);
      color:white;font-family:'Orbitron',system-ui,sans-serif;
      display:flex;align-items:center;justify-content:center;
      text-align:center;padding:24px
    }
    .container{max-width:320px}
    .logo{font-size:4rem;margin-bottom:16px;
          filter:drop-shadow(0 0 20px #00cfff)}
    h1{font-size:1.4rem;font-weight:800;margin-bottom:8px;
       background:linear-gradient(90deg,#00cfff,#0066ff);
       -webkit-background-clip:text;
       -webkit-text-fill-color:transparent}
    p{font-size:.85rem;color:rgba(255,255,255,.5);
      line-height:1.6;margin-bottom:24px}
    .badge{
      display:inline-block;
      background:rgba(0,207,255,0.1);
      color:#00cfff;border:1px solid rgba(0,207,255,0.3);
      padding:4px 14px;border-radius:99px;
      font-size:.68rem;font-weight:700;margin-bottom:16px;
      letter-spacing:2px
    }
    button{
      background:linear-gradient(135deg,#0066ff,#00cfff);
      color:#020610;border:none;
      padding:14px 28px;border-radius:99px;
      font-size:.9rem;font-weight:800;cursor:pointer;
      width:100%;box-shadow:0 4px 20px rgba(0,102,255,0.4);
      font-family:inherit
    }
    .info{
      margin-top:16px;padding:10px 14px;
      background:rgba(0,207,255,0.06);
      border:1px solid rgba(0,207,255,0.15);
      border-radius:12px;
      font-size:.72rem;color:rgba(0,207,255,0.6);
      line-height:1.5
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">⚡</div>
    <div class="badge">MODE HORS-LIGNE</div>
    <h1>Pas de connexion</h1>
    <p>
      Tes données sont sauvegardées localement<br>
      et synchronisées dès la reconnexion.
    </p>
    <button onclick="window.location.reload()">
      🔄 Réessayer la connexion
    </button>
    <div class="info">
      💡 Tu peux continuer à utiliser PowerApp<br>
      sans internet — tout est sauvegardé !
    </div>
  </div>
</body>
</html>`;
}

function _offlineSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg"
     width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#020610" rx="16"/>
  <text x="100" y="115" text-anchor="middle"
        font-size="70" fill="none">⚡</text>
  <text x="100" y="175" text-anchor="middle"
        font-size="14" fill="rgba(0,207,255,0.4)"
        font-family="system-ui">Hors-ligne</text>
</svg>`;
}

console.log(`✅ Service Worker v4.0 — Cache: ${CACHE_VERSION}`);
