const CACHE = "starlight-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons8-star-64.png",
  "./Tokyo.mp3",
  "./pwa-bg.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request))
  );
});
