const CACHE_NAME = 'gastehaus-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/Logo.webp',
  '/Schlafräume.webp',
  '/Wohnzimmer.webp',
  '/Küche.webp',
  '/Bad.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});