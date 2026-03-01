/* ============================================
   ENTER THE RABBIT HOLE — sw.js
   Phase 5: Service Worker (PWA / Offline)

   Strategy: Cache First
   - On install: pre-cache all core files
   - On fetch: serve from cache, fall back to network
   - On activate: clean up old caches
   ============================================ */

const CACHE_NAME = 'rabbit-hole-v5';

const CORE_FILES = [
  '/enter-the-rabbit-hole/',
  '/enter-the-rabbit-hole/index.html',
  '/enter-the-rabbit-hole/about.html',
  '/enter-the-rabbit-hole/style.css',
  '/enter-the-rabbit-hole/nodes.js',
  '/enter-the-rabbit-hole/effects.js',
  '/enter-the-rabbit-hole/stats.js',
  '/enter-the-rabbit-hole/npcs.js',
  '/enter-the-rabbit-hole/memory.js',
  '/enter-the-rabbit-hole/journal.js',
  '/enter-the-rabbit-hole/audio.js',
  '/enter-the-rabbit-hole/script.js',
  '/enter-the-rabbit-hole/manifest.json',
  '/enter-the-rabbit-hole/icons/icon-192.png',
  '/enter-the-rabbit-hole/icons/icon-512.png'
];

/* ---------- Install — pre-cache core files ---------- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

/* ---------- Activate — remove old caches ---------- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- Fetch — cache first, network fallback ---------- */
self.addEventListener('fetch', event => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            // Only cache valid same-origin responses
            if (
              !response ||
              response.status !== 200 ||
              response.type === 'opaque'
            ) return response;

            const clone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));

            return response;
          })
          .catch(() => {
            // If completely offline and not cached — return nothing
            // (browser shows its own offline page)
          });
      })
  );
});
