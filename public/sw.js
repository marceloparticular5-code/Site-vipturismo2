// Natal Vip Turismo - Service Worker para Push Notifications & Background Sync
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listener para eventos de Push enviados do servidor/backend
self.addEventListener('push', (event) => {
  let data = {
    title: 'Natal Vip Turismo 🌊',
    body: 'Atualização na tábua de maré e vagas de passeios VIP!',
    icon: '/favicon.png',
    badge: '/favicon.png',
    url: '/',
    tag: 'natal-vip-notification',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.png',
    badge: data.badge || '/favicon.png',
    tag: data.tag || 'natal-vip-notification',
    renotify: true,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open_booking', title: 'Ver Detalhes / Reservar' },
      { action: 'close', title: 'Fechar' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Listener para clique na notificação do sistema operacional
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if (client.navigate) {
            return client.navigate(targetUrl);
          }
          return;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
