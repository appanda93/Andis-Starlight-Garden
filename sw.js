/* ================================
   Andi’s Starlight Garden — Service Worker
   Purpose: stop iOS from caching a blank icon forever,
   while still giving you fast loads elsewhere.
   ================================ */

const CACHE_VERSION = "v9";                   // ← bump this when you change icons/assets
const CACHE_NAME = `starlight-${CACHE_VERSION}`;

// Precache only the absolute essentials.
// (Add your main CSS/JS here if desired.)
const CORE_ASSETS = [
  "/",                 // root
  "/index.html",
  "/manifest.json"
];

// Utils
async function putInCache(request, response) {
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  return putInCache(request, fresh);
}

async function networkFirst(request) {
  try {
    const fresh = await fetch(request, { cache: "no-store" });
    return putInCache(request, fresh);
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // optional: return a fallback Response here
    throw err;
  }
}

// Install: precache core
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Fetch: special handling for icons/manifest; sensible defaults for the rest
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only manage same-origin requests (your GitHub Pages domain)
  const isSameOrigin = url.origin === self.location.origin;

  // 1) Always network-first for iOS icons + the generic root icon
  //    This prevents stale/blank tiles.
  const isTouchIcon =
    isSameOrigin &&
    (
      url.pathname.includes("apple-touch-icon") || // e.g., /apple-touch-icon-180x180.png
      url.pathname === "/apple-touch-icon.png"
    );

  // 2) Network-first for manifest to keep Android installs fresh too
  const isManifest = isSameOrigin && url.pathname.endsWith("/manifest.json");

  if (isTouchIcon || isManifest) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 3) HTML documents: network-first (then fall back to cache)
  if (request.mode === "navigate" || request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 4) Everything else (images, CSS, JS): cache-first for speed
  event.respondWith(cacheFirst(request));
});
