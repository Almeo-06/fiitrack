/* ══════════════════════════════════════════════════════
   FitTrack Service Worker — Promemoria Streak + Auto-update
   Versione: 2026-04-03-1
   ↑ Cambia questa stringa per forzare l'aggiornamento
     su tutti i dispositivi che hanno la PWA installata.

   Strategia fetch: network-first per file HTML.
   I file HTML vengono sempre scaricati freschi dal server;
   se la rete non è disponibile si usa la risposta del browser.
══════════════════════════════════════════════════════ */

const SW_VERSION = '2026-04-04-3'; /* bump per forzare aggiornamento */

let _cfg   = null;   /* configurazione attiva */
let _timer = null;   /* handle del setTimeout */

/* ── Lifecycle ── */
self.addEventListener('install', () => {
  self.skipWaiting(); /* prende controllo subito, senza aspettare reload */
});

self.addEventListener('activate', e => {
  /* Cancella TUTTE le cache residue di versioni precedenti */
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim()) /* prende controllo di tutte le tab aperte */
  );
});

/* ── Fetch: network-first per i file HTML ── */
self.addEventListener('fetch', e => {
  const url = e.request.url;
  /* Intercetta solo richieste same-origin a file .html */
  if(e.request.method !== 'GET') return;
  if(!url.includes(self.location.origin)) return;
  if(!url.endsWith('.html') && !url.endsWith('/')) return;

  e.respondWith(
    fetch(e.request, { cache: 'no-cache' })
      .catch(() => fetch(e.request)) /* fallback senza no-cache se offline */
  );
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
