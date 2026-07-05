const CACHE_NAME = "belege-cache-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) =>
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          })
        )
        .catch(() => caches.match(request))
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("./index.html").then((res) => res || caches.match("./offline.html"))
      )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(request).then((response) =>
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response.clone());
          return response;
        })
      );
    })
  );
});
