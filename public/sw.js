/**
 * Service Worker — RÉUSSIR POLYTECH (PWA & Web Push)
 * Version : rp-cache-v1
 * Règle impérative : Ne jamais mettre en cache les routes sensibles (/admin, /api/*, /auth).
 */

const CACHE_NAME = 'rp-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/assets/logo-polytech.png',
];

// 1. Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pré-cache partiel:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activation & Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Stratégie de Requête
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Uniquement pour les requêtes de même origine
  if (url.origin !== self.location.origin) {
    return;
  }

  // RÈGLE ABSOLUE : Exclusion stricte des routes privées et administratives (Network-Only)
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/dashboard') ||
    request.method !== 'GET'
  ) {
    return; // Laisser passer directement sur le réseau sans interception
  }

  // Navigation (pages HTML) : Network-First avec repli vers offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // Ressources statiques (images, icônes, css, js) : Cache-First avec repli réseau
  if (
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => {
            // Repli gracieux si indisponible
            return new Response('', { status: 408, statusText: 'Request timed out' });
          });
      })
    );
  }
});

// 4. Notifications Web Push
self.addEventListener('push', (event) => {
  let payload = {
    title: 'RÉUSSIR POLYTECH',
    body: '« L\'excellence est notre seul standard. » — Retrouvez vos cours et annales.',
    url: '/',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    }
  } catch {
    if (event.data) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'open', title: 'Ouvrir la plateforme' },
      { action: 'close', title: 'Fermer' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// 5. Clic sur Notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si une fenêtre Réussir Polytech est déjà ouverte, lui redonner le focus
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
