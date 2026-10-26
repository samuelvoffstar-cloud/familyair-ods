/* Family Air ODS · versión 4521114347. Lo genera test/web-build.js. */
const CACHE = 'familyair-ods-4521114347';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icono-180.png', './icono-192.png', './icono-512.png', './privacidad.html', './terminos.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k.startsWith('familyair-ods-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Solo se guardan los archivos de la app y las letras de Google Fonts. Las llamadas al servidor (POST a Apps Script) nunca pasan por aquí.
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET') return;
  const propio = u.origin === self.location.origin, letras = /fonts.(googleapis|gstatic).com$/.test(u.hostname);
  if (!propio && !letras) return;
  // Copia guardada al instante; se actualiza en segundo plano para la próxima vez.
  e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: propio }).then(guardada => {
    const red = fetch(r).then(resp => { if (resp && (resp.ok || resp.type === 'opaque')) c.put(r, resp.clone()); return resp; }).catch(() => guardada || (r.mode === 'navigate' ? c.match('./index.html') : undefined));
    return guardada || red;
  })));
});
