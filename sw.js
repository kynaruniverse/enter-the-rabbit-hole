/* ============================================
   ENTER THE RABBIT HOLE — sw.js
   Cache: v7
   Bump CACHE_NAME on every deploy to force
   users off stale cached files.
   ============================================ */

const CACHE_NAME = 'rabbit-hole-v7';

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
  '/enter-the-rabbit-hole/supabase.js',
  '/enter-the-rabbit-hole/cursor.js',
  '/enter-the-rabbit-hole/script.js',
  '/enter-the-rabbit-hole/manifest.json',
  '/enter-the-rabbit-hole/icons/icon-192.png',
  '/enter-the-rabbit-hole/icons/icon-512.png',
  '/enter-the-rabbit-hole/preview.png'
];

/* Install — pre-cache */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

/* Activate — clear old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k  => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* Fetch — cache first, network fallback */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;

  /* Never cache Supabase API calls — always fresh */
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline and not cached — return minimal fallback for HTML requests
        const isHTML = event.request.headers.get('accept')?.includes('text/html');
        if (isHTML) {
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Rabbit Hole</title></head>' +
            '<body style="background:#000;color:#333;font-family:Courier New,monospace;' +
            'display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">' +
            '<p style="letter-spacing:0.2em;font-size:0.75rem;">[ you are offline — the hole is waiting ]</p>' +
            '</body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      });
    })
  );
});

/* ============================================
   UPDATE NOTIFICATION
   Posts a message to all open clients when
   a new SW version has activated, so the
   page can prompt the user to refresh.
   In script.js, listen for this with:
   navigator.serviceWorker.addEventListener('message', e => {
     if (e.data === 'SW_UPDATED') { ... }
   });
   ============================================ */

self.addEventListener('activate', event => {
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      clients.forEach(client => client.postMessage('SW_UPDATED'));
    })
  );
});
