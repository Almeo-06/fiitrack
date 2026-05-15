/* ══════════════════════════════════════════════════════
   FiitTracker — Sistema Haptic unificato
   Carica questo file in tutte le pagine dell'app.
   API: window.FtHaptic.<pattern>()
══════════════════════════════════════════════════════ */

(function(){
  function _h(p){ try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }

  window.FtHaptic = {
    /* Tocchi UI generici */
    tap:         ()=>_h([8]),
    light:       ()=>_h([14]),
    medium:      ()=>_h([28]),
    heavy:       ()=>_h([55]),

    /* Azioni positive */
    success:     ()=>_h([30, 12, 55]),
    celebration: ()=>_h([40, 20, 40, 20, 80]),
    prAchieved:  ()=>_h([50, 15, 50, 15, 100, 15, 80]),

    /* In-sessione */
    seriesDone:  ()=>_h([30]),
    exDone:      ()=>_h([40, 15, 40]),
    recStart:    ()=>_h([15]),
    recEnd:      ()=>_h([20, 10, 60]),

    /* Feedback neutro/avviso */
    warning:     ()=>_h([18, 80, 18]),
    error:       ()=>_h([80, 40, 80]),

    /* Navigazione */
    navTap:      ()=>_h([6]),
    swipe:       ()=>_h([10]),
  };
})();
