const CACHE_NAME = "italian-learning-hub-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then(function(networkResponse) {
          return networkResponse;
        })
        .catch(function() {
          return caches.match("./index.html");
        });
    })
  );
});
