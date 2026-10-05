const CACHE = 'pocket-arcade-muvolj3i';
const FILES = ["./","./assets/index-CfBTJEHR.js","./assets/online-Om7lb9qs.js","./assets/web-C0SgI1eN.js","./assets/web-DNuNHl8X.js","./assets/index-3DIa0Jha.css","./apple-touch-icon.png","./Fredoka.ttf","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  // the page itself: try the internet first so a new version shows up straight away; offline → saved copy
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); return res; })
      .catch(() => caches.match('./').then(hit => hit || caches.match(req, { ignoreSearch: true }))));
    return;
  }
  // everything else (files have unique names per version): saved copy first, else fetch and keep it
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
