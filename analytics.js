/* ══════════════════════════════════════════════════════
   FiiTrack Analytics — caricato su tutte le pagine
   Inizializza Firebase Analytics e traccia page_view.

   Per attivare:
   1. Firebase Console → Project Settings → Google Analytics → Abilita
   2. Copia il measurementId (G-XXXXXXXXXX) e incollalo nel campo qui sotto
   ══════════════════════════════════════════════════════ */

(function(){
  const _CONFIG = {
    apiKey:            "AIzaSyD3kvEKJw3vBVZGT3VJqolnsDwQeCFvZSM",
    authDomain:        "fittrack-c95c6.firebaseapp.com",
    projectId:         "fittrack-c95c6",
    storageBucket:     "fittrack-c95c6.firebasestorage.app",
    messagingSenderId: "502254449477",
    appId:             "1:502254449477:web:0e38cddc20a8eb28ba442c",
    measurementId:     "G-VK1L5GLRCG"
  };

  try{
    /* Inizializza Firebase solo se non è già stato fatto da un'altra pagina */
    if(!firebase.apps.length) firebase.initializeApp(_CONFIG);
    const _analytics = firebase.analytics();
    window._ftAnalytics = _analytics;

    /* Page view automatico */
    const page = location.pathname.split('/').pop() || 'home.html';
    _analytics.logEvent('page_view', {
      page_title:    document.title,
      page_location: location.href,
      page_path:     '/' + page
    });
  } catch(e){}

  /* ── Helper globale per loggare eventi da qualsiasi pagina ── */
  window._ftLog = function(eventName, params){
    try{
      if(window._ftAnalytics) window._ftAnalytics.logEvent(eventName, params || {});
    } catch(e){}
  };
})();
