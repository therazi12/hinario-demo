// Guarda la app completa en el teléfono la primera vez -> funciona sin internet.
// Cambia VERSION cuando actualices los hinos para que se descarguen de nuevo.
const VERSION = "hinario-v6";
const FILES = ["./", "index.html", "manifest.webmanifest", "flame.svg", "icon-192.png", "icon-512.png",
  "fonts/eb-garamond-latin-400-normal.woff2", "fonts/eb-garamond-latin-400-italic.woff2", "fonts/eb-garamond-latin-600-normal.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).then(res => {
    const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res;
  }).catch(() => caches.match("index.html"))));
});
