/* FiitTrack — Animazioni ingresso: ring SVG e contatori numerici */
(function () {
  var RAF = window.requestAnimationFrame.bind(window);
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /**
   * Anima un <circle> SVG da vuoto (circumference) fino a targetOffset.
   * @param {Element} el           - elemento con stroke-dashoffset
   * @param {number}  targetOffset - valore finale strokeDashoffset
   * @param {number}  circumference - lunghezza totale (= stroke-dasharray)
   * @param {number}  [duration=900]
   */
  window.animateRing = function (el, targetOffset, circumference, duration) {
    if (!el) return;
    duration = duration || 900;
    el.style.strokeDashoffset = circumference; // parte da vuoto
    var delta = targetOffset - circumference;
    function animate() {
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        el.style.strokeDashoffset = (circumference + delta * easeOut(t)).toFixed(2);
        if (t < 1) RAF(tick);
      }
      RAF(tick);
    }
    /* 2 frame di ritardo: garantisce che strokeDashoffset=circumference venga
       paintato prima che inizi l'animazione */
    RAF(function () { RAF(animate); });
  };

  /**
   * Conta da 0 a target aggiornando el.textContent.
   * @param {Element} el
   * @param {number}  target
   * @param {number}  [duration=800]
   * @param {number}  [decimals=0]
   * @param {string}  [suffix='']
   */
  window.animateCount = function (el, target, duration, decimals, suffix) {
    if (!el || isNaN(+target)) return;
    target   = +target;
    duration = duration  != null ? duration  : 800;
    decimals = decimals  != null ? decimals  : 0;
    suffix   = suffix    != null ? suffix    : '';
    el.textContent = (0).toFixed(decimals) + suffix;
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      el.textContent = (target * easeOut(t)).toFixed(decimals) + suffix;
      if (t < 1) RAF(tick);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    RAF(tick);
  };
})();
