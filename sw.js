/* ══════════════════════════════════════════════════════
   FitTrack Service Worker — Promemoria Streak
   Schedula una notifica locale ogni giorno all'orario scelto.
   Il timer si azzera se il browser viene completamente chiuso:
   viene ripristinato alla prossima apertura dell'app.
══════════════════════════════════════════════════════ */

let _cfg   = null;   /* configurazione attiva */
let _timer = null;   /* handle del setTimeout */

/* ── Lifecycle ── */
self.addEventListener('install',  () => self.skipWaiting());
self.addEventListener('activate', e  => e.waitUntil(self.clients.claim()));

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
