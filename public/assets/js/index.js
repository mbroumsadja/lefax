if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/public/assets/js/sw.js')
    .then(() => {
      console.log('Service Worker Registered');
    })
    .catch((error) => {
      console.error('Service Worker Registration Failed:', error);
    });
}

let deferredPrompt;
const addBtn = document.querySelector('.add-button');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    addBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    }).catch((error) => {
      console.error('Error handling user choice:', error);
    });
  });
});

self.addEventListener('fetch', (event) => {
  console.log('Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).catch(() => {
          return caches.match('/lefax/offline.html');
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
const CACHE_NAME = 'lefax-cache-v1';

const quizTopics = [
  { name: "formation Bilingue", author: "Prof. Dupont", slug: "ia" },
  { name: "formation bilingue intermadiare", author: "ia", slug: "fbilingue" },
  { name: "infographie", author: "ia", slug: "infographie" },
];

function randomNotification() {
  const randomItem = Math.floor(Math.random() * quizTopics.length);
  const notifTitle = quizTopics[randomItem].name;
  const notifBody = `Created by ${quizTopics[randomItem].author}.`;
  const notifImg = `/public/icon/${quizTopics[randomItem].slug}.jpg`;
  const options = {
    body: notifBody,
    icon: notifImg,
  };
  new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000000000);
}