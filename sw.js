const CACHE_NAME = 'static-cache-v1';
let urlsToCache = [
  '/',
  './offlline.html',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/',
];
// registering service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      console.log('Service Worker Registered', reg);
    });
  });
}
// precache static resources here
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});
// Remove previous cached data from disk.
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
// Add fetch event handler here.
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(evt.request);
    })
  );
});
