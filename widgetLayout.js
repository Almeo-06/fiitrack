/* ══════════════════════════════════════════════
   Tab bar height sync — imposta --tab-bar-h su :root
   con l'altezza reale della tab bar misurata dal DOM.
   Funziona su qualsiasi dispositivo / safe area.
══════════════════════════════════════════════ */
(function(){
  /* ── Rileva safe area bottom in modo affidabile ──
     env(safe-area-inset-bottom) su alcuni Android ritorna 0 anche quando
     la gesture bar esiste. Il probe misura il valore CSS reale e lo imposta
     come variabile --safe-b su :root, aggiornando poi --tab-bar-h di conseguenza. */
  function _detectSafeB(){
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;bottom:0;left:0;width:1px;height:env(safe-area-inset-bottom,0px);pointer-events:none;opacity:0;z-index:-1;';
    document.body.appendChild(probe);
    const h = Math.ceil(probe.getBoundingClientRect().height);
    document.body.removeChild(probe);
    /* Imposta --safe-b con il valore rilevato (può essere 0 su dispositivi senza gesture bar) */
    document.documentElement.style.setProperty('--safe-b', h + 'px');
  }
  _detectSafeB();
  window.addEventListener('resize', _detectSafeB, { passive:true });
  window.addEventListener('orientationchange', _detectSafeB, { passive:true });

  function _syncTabH(){
    const tb = document.querySelector('.tab-bar');
    if(!tb) return;
    const h = Math.ceil(tb.getBoundingClientRect().height);
    if(h > 0) document.documentElement.style.setProperty('--tab-bar-h', h + 'px');
  }
  _syncTabH();
  /* Osserva direttamente la tab bar per cambiamenti di dimensione */
  try{
    const tb = document.querySelector('.tab-bar');
    if(tb) new ResizeObserver(_syncTabH).observe(tb);
  }catch(e){}
  /* Reagisce al cambio tema (aggiunta/rimozione di html.theme-light) */
  try{
    new MutationObserver(_syncTabH).observe(document.documentElement, { attributes:true, attributeFilter:['class'] });
  }catch(e){}
  window.addEventListener('resize', _syncTabH, { passive:true });
  window.addEventListener('load', _syncTabH, { once:true });
})();


