const CACHE_NAME = "starlight-v3"; // bump version here
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/apple-touch-icon-180-frog.png",
  "/apple-touch-icon-167-frog.png",
  "/apple-touch-icon-152-frog.png",
  "/apple-touch-icon-120-frog.png"
  // add CSS/JS/etc. as needed
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


