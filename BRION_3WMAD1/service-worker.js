const CACHE_NAME = "shooting-game-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./game.js", // If you separate JavaScript files
  "./style.css", // If you have a CSS file
  "https://cdn-icons-png.flaticon.com/512/804/804449.png" // Player icon
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate and Update Cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
