/* ============================================
   ENTER THE RABBIT HOLE — sw.js
   Cache: v6 (Direction 2+3 update)
   ============================================ */

const CACHE_NAME = 'rabbit-hole-v6';

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
  '/enter-the-rabbit-hole/icons/icon-512.png'
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
      }).catch(() => { /* offline and not cached */ });
    })
  );
});
