// Minimal service worker so browsers treat the site as an installable app.
// It does not cache anything: scam checks always need the live network.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {})
