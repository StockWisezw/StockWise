const CACHE_NAME = 'pos-offline-cache-v1';
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/pos',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.includes('firestore.googleapis.com')) {
    // Basic offline fallback strategy for firestore happens at the SDK level usually, 
    // but we can register background sync if needed.
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Return offline fallback if network fails
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pos-transactions') {
    event.waitUntil(syncTransactions());
  }
});

async function syncTransactions() {
  console.log('Background sync: syncing offline transactions...');
  // Logic to process an IndexedDB queue of offline sales
  // and push them to Firestore once connectivity is restored.
}
