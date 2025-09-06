// sw.js
const CACHE = "starlight-v3"; // bump this when you change files
const SCOPE = self.registration ? self.registration.scope : "./";
const r = (p) => new URL(p, SCOPE).toString(); // resolve paths relative to the site root

const ASSETS = [
  // Core
  r("./"),
  r("index.html"),
  r("manifest.json"),

  // Media & images you use
  r("icons8-star-64.png"),
  r("Tokyo.mp3"),
  r("pwa-bg.png"),

  // ✅ App icons (Android + iOS A2HS)
  r("icon-192.png"),
  r("icon-512.png"),
  r("icon-512-maskable.png"),
  r("apple-touch-icon.png"),          // 180x180
  r("apple-touch-icon-120x120.png"),
  r("apple-touch-icon-152x152.png"),
  r("apple-touch-icon-167x167.png"),
];

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
