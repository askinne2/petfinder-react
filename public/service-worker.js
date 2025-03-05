const CACHE_NAME = 'petfinder-cache-v1';
const IMAGE_CACHE_NAME = 'petfinder-images-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      caches.open(IMAGE_CACHE_NAME)
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp)/)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((response) => {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      })
    );
  }
});