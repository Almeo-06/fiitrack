/* ══════════════════════════════════════════════════════
   FitTrack Service Worker — Promemoria Streak + Auto-update
   Versione: 2026-04-03-1
   ↑ Cambia questa stringa per forzare l'aggiornamento
     su tutti i dispositivi che hanno la PWA installata.

   Strategia fetch:
   - File HTML: network-first, fallback cache offline
   - Risorse statiche (icone, manifest): cache-first
══════════════════════════════════════════════════════ */

const SW_VERSION = '2026-04-07-3'; /* bump per forzare aggiornamento */

const CACHE_NAME   = 'fittrack-static-' + SW_VERSION;
const STATIC_FILES = [
  'home.html', 'registra.html', 'sessione.html', 'peso.html',
  'profilo.html', 'impostazioni.html', 'sfide.html', 'amici.html',
  'scegli.html', 'onboarding.html',
  'premium/exercises.html', 'premium/sessione-animata.html',
  'premium/css/exercises.css', 'premium/css/sessione-animata.css',
  'premium/js/config.js', 'premium/js/exercises.js', 'premium/js/sessione-animata.js',
  'tutorial.js', 'widgetLayout.js',
  'icons/icon-192.png', 'icons/icon-512.png',
  'manifest.json'
];

let _cfg   = null;   /* configurazione attiva */
let _timer = null;   /* handle del setTimeout */

/* ── Lifecycle ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  /* Cancella solo le cache di versioni precedenti, mantieni quella attuale */
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch ── */
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return;
  if (!url.includes(self.location.origin)) return;

  const isHTML = url.endsWith('.html') || url.endsWith('/');

  if (isHTML) {
    /* Network-first per HTML: sempre aggiornato, fallback cache se offline */
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' })
        .then(res => {
          /* Salva copia fresca in cache */
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    /* Cache-first per risorse statiche: icone, js, css */
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        }))
    );
  }
});

/* ── Messaggi dalla pagina ── */
self.addEventListener('message', e => {
  if (!e.data) return;
  if (e.data.type === 'SCHEDULE') {
    _cfg = e.data;
    _scheduleNext();
  }
  if (e.data.type === 'CANCEL') {
    clearTimeout(_timer);
    _cfg   = null;
    _timer = null;
  }
});

/* ── Calcola ms fino al prossimo orario scelto ── */
function _msUntilNext(timeStr) {
  const [h, m] = (timeStr || '20:00').split(':').map(Number);
  const now  = new Date();
  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

function _scheduleNext() {
  clearTimeout(_timer);
  if (!_cfg || !_cfg.enabled) return;

  const ms = _msUntilNext(_cfg.time);
  _timer = setTimeout(_fire, ms);
}

async function _fire() {
  const body = _cfg && _cfg.body
    ? _cfg.body
    : 'Non dimenticare il tuo allenamento oggi! 🔥 Mantieni la streak.';

  const opts = {
    body,
    tag:      'fittrack-streak',
    renotify: true,
    vibrate:  [200, 100, 200],
    data:     { url: 'home.html' },
  };

  /* Aggiungi icona solo se il percorso è valido */
  if (_cfg && _cfg.icon) {
    opts.icon  = _cfg.icon;
    opts.badge = _cfg.icon;
  }

  try {
    await self.registration.showNotification('FitTrack 🔥', opts);
  } catch (err) {
    console.warn('[SW] Notifica fallita:', err);
  }

  /* Riprogramma per il giorno dopo */
  _scheduleNext();
}

/* ── Click sulla notifica → apri l'app ── */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const target = (e.notification.data && e.notification.data.url) || 'home.html';
  e.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        /* Se c'è già una finestra aperta, mettila in primo piano */
        const existing = clients.find(c => c.url.includes('home.html') || c.url.endsWith('/'));
        if (existing) return existing.focus();
        return self.clients.openWindow(target);
      })
  );
});
