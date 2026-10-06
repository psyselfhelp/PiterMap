const CACHE_PREFIX = 'piter-map-' + new URL('./', self.location.href).pathname + '-'
const CACHE_NAME = CACHE_PREFIX + "64626bc7f796dbbf"
const PRECACHE = ["./","./assets/index-D9IPHuqV.js","./assets/index-SJs4WsvI.css","./assets/maplibre-wqmL2Hxp.js","./assets/three-DNYHxwL5.js","./data/base.geojson","./data/buildings.geojson","./data/date-supplements.json","./data/metadata.json","./data/schubert-1828.jpg","./favicon.svg","./icons/apple-touch-icon.png","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./index.html","./manifest.webmanifest"]
const scope = new URL('./', self.location.href)

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)))
})

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)
    if (event.request.mode === 'navigate') return await cache.match(scope.href, { ignoreVary: true }) || fetch(event.request)
    // Static file contents are identical across Origin headers (module scripts use CORS).
    const cached = await cache.match(event.request, { ignoreVary: true })
    return cached || fetch(event.request)
  })())
})
