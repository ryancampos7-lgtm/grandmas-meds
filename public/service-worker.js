/* Grandma's Meds - Service Worker */
const CACHE_NAME = 'grandmas-meds-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

/* Push notification handler */
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Grandma's Meds 💙";
  const options = {
    body: data.body || "Time to take your medication!",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'med-reminder',
    requireInteraction: true,
    actions: [
      { action: 'taken', title: '✅ I took it!' },
      { action: 'snooze', title: '⏰ Snooze 15 min' }
    ],
    data: { url: '/', ...data }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'snooze') {
    const snoozeMs = 15 * 60 * 1000;
    event.waitUntil(
      new Promise(resolve => {
        setTimeout(() => {
          self.registration.showNotification("Grandma's Meds 💙 (Snoozed)", {
            body: "Snooze time is up! Time to take your medication 💊",
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-72.png',
            vibrate: [200, 100, 200],
            requireInteraction: true
          });
          resolve();
        }, snoozeMs);
      })
    );
  } else {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow('/');
      })
    );
  }
});

/* Background sync for family notifications */
self.addEventListener('sync', event => {
  if (event.tag === 'send-family-notification') {
    event.waitUntil(sendPendingNotifications());
  }
});

async function sendPendingNotifications() {
  // In production, this would POST to your notification API
  console.log('Sending pending family notifications...');
}
