const CACHE = 'pocket-arcade-mveezu3l';
const FILES = ["./","./assets/index-GEF6bsSX.js","./assets/online-CskzuUYh.js","./assets/web-CiRqzZaz.js","./assets/web-D2szlsa7.js","./assets/index-uPzi5X6K.css","./apple-touch-icon.png","./Fredoka.ttf","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./manifest.webmanifest"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  // the page itself: try the internet first so a new version shows up straight away; offline → saved copy.
  // Slow hotel/holiday Wi-Fi: if the internet hasn't answered within 3 seconds, open the saved copy instead.
  if (req.mode === 'navigate') {
    const saved = () => caches.match('./', { ignoreVary: true }).then(hit => hit || caches.match(req, { ignoreSearch: true, ignoreVary: true }));
    const net = fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy)); } return res; });
    const slow = new Promise(r => setTimeout(r, 3000)).then(saved);
    e.respondWith(Promise.race([net.catch(saved), slow.then(hit => hit || net)]));
    return;
  }
  // everything else (files have unique names per version): saved copy first, else fetch and keep it
  e.respondWith(caches.match(req, { ignoreSearch: true, ignoreVary: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
