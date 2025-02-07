const CACHE_NAME = 'lefax-v1';
const URLS_TO_CACHE = [
  '/lefax/',
  '/lefax/index.html',
  '/lefax/public/icon/logo.png',
  '/lefax/public/assets/css/app.css',
  '/lefax/public/assets/css/style.css',
  '/lefax/public/assets/data/L2/fbilingue/part1.json',
  '/lefax/public/assets/data/L2/fbilingue/part2.json',
  '/lefax/public/assets/data/L2/fbilingue/part3.json',
  '/lefax/public/assets/data/L2/fbilingue/intermediare/part1.json',
  '/lefax/public/assets/data/L2/fbilingue/intermediare/part2.json',
  '/lefax/public/assets/data/L2/fbilingue/intermediare/part3.json',
  '/lefax/public/assets/data/L2/infographie/part1.json',
  '/lefax/public/assets/data/L2/infographie/part2.json',
  '/lefax/public/assets/js/index.js',
  '/lefax/public/modules/index1.js',
  '/lefax/public/modules/index2.js',
  '/lefax/public/modules/pages/fbilingue/fbilingue1.html',
  '/lefax/public/modules/pages/fbilingue/fbilingue2.html',
  '/lefax/public/modules/pages/fbilingue/fbilingue3.html',
  '/lefax/public/modules/pages/fbilingue/intermediare/fbilingue1.html',
  '/lefax/public/modules/pages/fbilingue/intermediare/fbilingue2.html',
  '/lefax/public/modules/pages/fbilingue/intermediare/fbilingue3.html',
  '/lefax/public/modules/pages/infographie/infographie1.html',
  '/lefax/public/modules/pages/infographie/infographie2.html',
];

// Installation du service worker et mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch((error) => {
        console.error('Failed to open cache:', error);
      })
  );
});

// Interception des requêtes réseau et réponse avec le cache si disponible
self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la réponse du cache si trouvée, sinon fait une requête réseau
        return response || fetch(event.request);
      })
      .catch((error) => {
        console.error('Failed to fetch:', error);
      })
  );
});