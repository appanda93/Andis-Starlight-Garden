// sw.js
const CACHE = "starlight-v3"; // bump this when you change files
const SCOPE = self.registration ? self.registration.scope : "./";
// sw.js
const CACHE = "starlight-v6"; // bump this
const ASSETS = [
  "./", "index.html", "manifest.json",
  "icons8-star-64.png", "Tokyo.mp3", "pwa-bg.png",
  "icon-192-forest-fairy.png",
  "icon-512-forest-fairy.png",
  "icon-512-forest-fairy-maskable.png",
  "apple-touch-icon-180-forest-fairy.png",
  "apple-touch-icon-167-forest-fairy.png",
  "apple-touch-icon-152-forest-fairy.png",
  "apple-touch-icon-120-forest-fairy.png"
];
// ...install/activate/fetch as before


self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});

