// ════════════════════════════════════════════════════
//  PowerApp — Service Worker v3.0 NEON EDITION
//  ✅ Cache busting automatique sur nouvelle version
// ════════════════════════════════════════════════════

const APP_VERSION   = 'powerapp-v3-neon';
const CACHE_STATIC  = `${APP_VERSION}-static`;
const CACHE_DYNAMIC = `${APP_VERSION}-dynamic`;
const CACHE_IMAGES  = `${APP_VERSION}-images`;

// ── Fichiers à mettre en cache immédiatement ──
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',

  // ✅ Toutes les icônes neon
  '/assets/icon-powerapp.png',
  '/assets/icon-32.png',
  '/assets/icon-40.png',
  '/assets/icon-60.png',
  '/assets/icon-76.png',
  '/assets/icon-96.png',
  '/assets/icon-120.png',
  '/assets/icon-144.png',
  '/assets/icon-180.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/icon-1024.png',

  // JS modules
  '/js/utils.js',
  '/js/i18n.js',
  '/js/tracker.js',
  '/js/notifications.js',
  '/js/programme.js',
  '/js/chrono.js',
  '/js/gamification.js',
  '/js/nutrition.js',
  '/js/coach.js',
  '/js/predict.js',
  '/js/stats.js',
  '/js/history.js',
  '/js/photos.js',
  '/js/defis.js',
  '/js/social.js',
  '/js/superset.js',
  '/js/circuit.js',
  '/js/hiit.js',
  '/js/calculateur.js',
  '/js/export.js',
  '/js/share.js',
  '/js/offline.js',
  '/js/video.js',
  '/js/voice.js',
  '/js/charts.js',
  '/js/recovery.js',
  '/js/profil.js',
  '/js/custom-exercises.js',
  '/js/report.js',
  '/js/duo.js',
  '/js/music.js',
  '/js/widget.js',
  '/js/ui-premium.js',
  '/js/lava.js',
  '/js/themes.js',
  '/js/app.js',
];

// ════════════════════════════════════════════════════
//  INSTALL — Précache tous les assets
// ════════════════════════════════════════════════════
self.addEventListener('install', event => {
  console.log(`[SW] 🚀 Install — ${APP_VERSION}`);

  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        console.log('[SW] 📦 Précache des assets...');
        return cache.addAll(
          PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' }))
        );
      })
      .then(() => {
        console.log('[SW] ✅ Précache terminé');
        // Force l'activation immédiate sans attendre
        return self.skipWaiting();
      })
      .catch(err => console.warn('[SW] ⚠️ Précache partiel:', err))
  );
});

// ════════════════════════════════════════════════════
//  ACTIVATE — Nettoie les anciens caches
// ════════════════════════════════════════════════════
self.addEventListener('activate', event => {
  console.log(`[SW] ⚡ Activate — ${APP_VERSION}`);

  event.waitUntil(
    caches.keys()
      .then(keys => {
        const deleteOld = keys
          .filter(key =>
            key !== CACHE_STATIC  &&
            key !== CACHE_DYNAMIC &&
            key !== CACHE_IMAGES
          )
          .map(key => {
            console.log(`[SW] 🗑️ Suppression ancien cache: ${key}`);
            return caches.delete(key);
          });
        return Promise.all(deleteOld);
      })
      .then(() => {
        console.log('[SW] ✅ Anciens caches supprimés');
        // Prend le contrôle immédiatement
        return self.clients.claim();
      })
  );
});

// ════════════════════════════════════════════════════
//  FETCH — Stratégie par type de ressource
// ════════════════════════════════════════════════════
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // ── Ignorer les requêtes non-GET ──
  if (request.method !== 'GET') return;

  // ── Ignorer extensions Chrome, devtools ──
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname !== location.hostname &&
      !url.hostname.includes('fonts.googleapis') &&
      !url.hostname.includes('fonts.gstatic') &&
      !url.hostname.includes('cdn.jsdelivr') &&
      !url.hostname.includes('unpkg.com') &&
      !url.hostname.includes('code.jquery')) return;

  // ── Stratégie : Images → Cache First ──
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, CACHE_IMAGES));
    return;
  }

  // ── Stratégie : Fonts CDN → Cache First ──
  if (url.hostname.includes('fonts.googleapis') ||
      url.hostname.includes('fonts.gstatic')) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // ── Stratégie : JS/CSS → Stale While Revalidate ──
  if (request.destination === 'script' ||
      request.destination === 'style') {
    event.respondWith(staleWhileRevalidate(request, CACHE_STATIC));
    return;
  }

  // ── Stratégie : HTML → Network First ──
  if (request.destination === 'document') {
    event.respondWith(networkFirst(request, CACHE_DYNAMIC));
    return;
  }

  // ── Default → Stale While Revalidate ──
  event.respondWith(staleWhileRevalidate(request, CACHE_DYNAMIC));
});

// ════════════════════════════════════════════════════
//  STRATÉGIES DE CACHE
// ════════════════════════════════════════════════════

// Cache First — Rapide, priorité cache
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

// Network First — Fraîcheur prioritaire
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback();
  }
}

// Stale While Revalidate — Rapide + màj en arrière-plan
async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise;
}

// ════════════════════════════════════════════════════
//  OFFLINE FALLBACK
// ════════════════════════════════════════════════════
function offlineFallback() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>PowerApp — Hors-ligne</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          background: #09092d;
          color: white;
          font-family: -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          gap: 16px;
          flex-direction: column;
          padding: 24px;
        }
        .icon {
          font-size: 4rem;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1);   opacity: .8; }
          50%      { transform: scale(1.1); opacity: 1;  }
        }
        h1 {
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #bf61ff, #8bf0bb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        p {
          font-size: .8rem;
          color: rgba(255,255,255,0.4);
          max-width: 260px;
          line-height: 1.6;
        }
        button {
          margin-top: 8px;
          padding: 12px 28px;
          border-radius: 99px;
          border: none;
          background: linear-gradient(135deg, #4b4bf9, #8b3fff);
          color: white;
          font-size: .85rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(75,75,249,0.4);
        }
      </style>
    </head>
    <body>
      <div class="icon">⚡</div>
      <h1>PowerApp — Hors-ligne</h1>
      <p>Vérifie ta connexion internet et réessaie.</p>
      <button onclick="window.location.reload()">🔄 Réessayer</button>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

// ════════════════════════════════════════════════════
//  MESSAGE — Force update depuis l'app
// ════════════════════════════════════════════════════
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    console.log('[SW] ⚡ Force update demandé');
    self.skipWaiting();
  }

  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => {
      console.log('[SW] 🗑️ Tous les caches vidés');
      event.ports[0]?.postMessage({ status: 'cleared' });
    });
  }
});
