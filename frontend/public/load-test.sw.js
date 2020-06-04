self.addEventListener('fetch', (event) => {});

self.addEventListener('message', (event) => {});

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
