// Check if service workers are supported
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

// Code to handle install prompt on desktop
let deferredPrompt;
const addBtn = document.querySelector('.add-button');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    // Hide our user interface that shows our A2HS button
    addBtn.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
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

