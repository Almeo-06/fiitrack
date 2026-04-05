/* ══════════════════════════════════════════════
   tutorial.js — Tour introduttivo FitTrack
   Include in ogni pagina: <script src="tutorial.js"></script>
   Si auto-attiva se il tutorial è in corso.
══════════════════════════════════════════════ */

(function () {
  /* ── CSS ── */
  const _css = document.createElement('style');
  _css.textContent = `
    .tut-spotlight {
      position: relative;
      z-index: 50;
      box-shadow: 0 0 0 3px var(--a1), 0 0 28px rgba(0,136,255,.35) !important;
      border-radius: 18px;
      outline: none;
    }
    #tut-tooltip {
      position: fixed;
      bottom: calc(72px + env(safe-area-inset-bottom, 0px));
      left: 12px;
      right: 12px;
      background: var(--bg2, #060d1a);
      border: 1px solid var(--a1, #0088ff);
      border-radius: 18px;
      padding: 16px 18px;
      z-index: 900;
      box-shadow: 0 8px 40px rgba(0,0,0,.7);
      animation: tutSlideUp .28s cubic-bezier(.25,1,.3,1) both;
    }
    @keyframes tutSlideUp {
      from { transform: translateY(24px); opacity: 0; }
      to   { transform: translateY(0);   opacity: 1; }
    }
    .tut-counter {
      font-size: 10px;
      color: var(--a2, #00ccff);
      font-weight: 600;
      letter-spacing: .6px;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .tut-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text, #e0f4ff);
      margin-bottom: 5px;
    }
    .tut-body {
      font-size: 13px;
      color: var(--textm, #304870);
      line-height: 1.55;
      margin-bottom: 14px;
    }
    .tut-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      align-items: center;
    }
    .tut-btn-skip {
      background: transparent;
      border: 1px solid var(--border, #0d1e38);
      color: var(--textm, #304870);
      font-size: 12px;
      padding: 8px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-family: var(--font, 'DM Sans', sans-serif);
    }
    .tut-btn-next {
      background: linear-gradient(135deg, var(--a1, #0088ff), var(--a2, #00ccff));
      border: none;
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      padding: 9px 22px;
      border-radius: 10px;
      cursor: pointer;
      font-family: var(--font, 'DM Sans', sans-serif);
    }
    #tut-complete {
      position: fixed;
      inset: 0;
      background: rgba(2,8,16,.92);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: tutFadeIn .3s ease both;
    }
    @keyframes tutFadeIn { from{opacity:0} to{opacity:1} }
    .tut-complete-box {
      background: var(--bg2, #060d1a);
      border: 1px solid var(--a1, #0088ff);
      border-radius: 24px;
      padding: 36px 24px 28px;
      text-align: center;
      max-width: 310px;
      margin: 20px;
      animation: tutSlideUp .35s cubic-bezier(.25,1,.3,1) both;
    }
    .tut-complete-icon { font-size: 52px; margin-bottom: 14px; }
    .tut-complete-title { font-size: 22px; font-weight: 600; color: var(--text, #e0f4ff); margin-bottom: 8px; }
    .tut-complete-sub   { font-size: 13px; color: var(--textm, #304870); line-height: 1.6; margin-bottom: 24px; }
    .tut-complete-cta {
      background: linear-gradient(135deg, var(--a1, #0088ff), var(--a2, #00ccff));
      border: none;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      padding: 14px 0;
      border-radius: 13px;
      cursor: pointer;
      font-family: var(--font, 'DM Sans', sans-serif);
      width: 100%;
    }
  `;
  document.head.appendChild(_css);

  /* ── Costanti ── */
  const TUT_KEY  = 'fittrack_tutorial';
  const DATA_KEY = 'fittrack_v4';

  /* ── Definizione degli 11 step ── */
  const STEPS = [
    {
      page: 'home.html',
      sel:  '.streak-hero',
      title: 'Il tuo Streak 🔥',
      text:  'Qui vedi i giorni consecutivi di allenamento. Ogni volta che ti alleni lo streak cresce — non spezzarlo!',
      scroll: true
    },
    {
      page: 'home.html',
      sel:  '.plan-card',
      title: 'Piano Settimanale 📅',
      text:  'Ogni giorno ha il suo allenamento assegnato. Trascinalo verso sinistra per avviarlo direttamente.',
      scroll: true
    },
    {
      page: 'home.html',
      sel:  '#sfideHeroCard',
      title: 'Sfide & Obiettivi 🏆',
      text:  'Crea sfide personali: sessioni da completare, peso da raggiungere, km da percorrere o streak da mantenere.',
      scroll: true
    },
    {
      page: 'registra.html',
      sel:  '.scroll-area',
      title: 'Storico Allenamenti 📝',
      text:  'Qui trovi il calendario con tutte le tue sessioni. Tocca un giorno passato per aggiungere un allenamento manualmente.',
      scroll: false
    },
    {
      page: 'peso.html',
      sel:  '.scroll-area',
      title: 'Traccia il Peso ⚖️',
      text:  'Inserisci il tuo peso periodicamente per vedere il grafico dei progressi e calcolare il BMI.',
      scroll: false
    },
    {
      page: 'impostazioni.html',
      sel:  '#sec1',
      title: 'I tuoi Allenamenti ⚙️',
      text:  'Crea e personalizza i tuoi allenamenti: aggiungi esercizi, serie, ripetizioni o timer.',
      scroll: true
    },
    {
      page: 'impostazioni.html',
      sel:  '#sec2',
      title: 'Piano Settimanale ⚙️',
      text:  'Assegna un allenamento a ogni giorno della settimana. Puoi cambiarlo quando vuoi.',
      scroll: true
    },
    {
      page: 'impostazioni.html',
      sel:  '#sec5',
      title: 'Feedback 💬',
      text:  'Hai un suggerimento o hai trovato un bug? Tocca "Scrivi un feedback" — leggiamo tutto e usiamo i tuoi messaggi per migliorare l\'app.',
      scroll: true
    },
    {
      page: 'amici.html',
      sel:  '.scroll-area',
      title: 'Sezione Amici 👥',
      text:  'Connettiti con gli amici, tieni traccia dei loro streak e sfidate a chi si allena di più!',
      scroll: false
    },
    {
      page: 'home.html',
      sel:  '.logo-wrap',
      title: 'Personalizza la Home 🔧',
      text:  'Tocca il logo <strong>FitTrack</strong> in alto: apparirà il tasto ✏️. Premilo per attivare la modalità modifica e riordinare i blocchi della pagina con le frecce ↑ ↓. Il layout viene salvato automaticamente.',
      scroll: false
    },
    {
      page: 'home.html',
      sel:  null,
      title: 'Sei pronto! 🎉',
      text:  'Hai completato il tour di FitTrack. Ora inizia ad allenarti!',
      isFinal: true
    }
  ];

  /* ── Helpers stato ── */
  function _getState() {
    try { return JSON.parse(localStorage.getItem(TUT_KEY)) || null; } catch (e) { return null; }
  }
  function _setState(s) {
    try { localStorage.setItem(TUT_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function _clearState() {
    localStorage.removeItem(TUT_KEY);
  }

  /* ── Segna il tour come già visto (non si riattiva automaticamente) ── */
  function _markTourSeen() {
    try {
      const data = JSON.parse(localStorage.getItem(DATA_KEY)) || {};
      data.hasSeenUpdateTour = true;
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  /* ── Rimuovi UI ── */
  function _removeUI() {
    document.getElementById('tut-tooltip')?.remove();
    document.querySelectorAll('.tut-spotlight').forEach(el => el.classList.remove('tut-spotlight'));
  }

  /* ── Pulizia dati temporanei ── */
  function _cleanupData() {
    try {
      const data = JSON.parse(localStorage.getItem(DATA_KEY)) || {};
      // Rimuovi workout tutorial
      if (data.workouts) {
        data.workouts = data.workouts.filter(w => !w._tutorial);
      }
      // Ripristina assegnazione originale
      if (data.assignment) {
        const state = _getState();
        if (state && state.origDayIdx !== undefined) {
          const key = String(state.origDayIdx);
          if (state.origAssignment !== null && state.origAssignment !== undefined) {
            data.assignment[key] = state.origAssignment;
          } else {
            delete data.assignment[key];
          }
        }
      }
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  /* ────────────────────────────────────────────
     API PUBBLICA
  ──────────────────────────────────────────── */

  /**
   * Avvia il tutorial. Chiamata da onboarding.html e dal pulsante in impostazioni.html.
   */
  window.startTutorial = function () {
    try {
      const today = new Date().getDay(); // 0=dom … 6=sab
      let data = {};
      try { data = JSON.parse(localStorage.getItem(DATA_KEY)) || {}; } catch (e) {}

      if (!data.workouts)  data.workouts  = [];
      if (!data.assignment) data.assignment = {};

      // Rimuovi tutorial precedenti
      data.workouts = data.workouts.filter(w => !w._tutorial);

      // Workout demo (1 esercizio)
      data.workouts.push({
        id: '_tut_',
        name: 'Allenamento Demo',
        type: 'gym',
        typeLabel: 'Palestra',
        typeIcon: '🏋️',
        _tutorial: true,
        exs: [{ name: 'Flessioni', sets: 1, reps: 5 }]
      });

      // Salva assegnazione originale e imposta demo per oggi
      const origAssignment = data.assignment[String(today)];
      data.assignment[String(today)] = '_tut_';

      localStorage.setItem(DATA_KEY, JSON.stringify(data));

      _setState({
        step: 0,
        active: true,
        origDayIdx: today,
        origAssignment: origAssignment !== undefined ? origAssignment : null
      });
    } catch (e) {}
  };

  /**
   * Avanza al prossimo step. Usato dal pulsante "Avanti →".
   */
  window.tutAdvance = function () {
    const state = _getState();
    if (!state) return;

    const nextIdx = state.step + 1;

    // Ultimo step completato
    if (nextIdx >= STEPS.length) {
      _markTourSeen();
      _cleanupData();
      _clearState();
      _removeUI();
      _showComplete();
      return;
    }

    const curPage  = _currentPage();
    const nextStep = STEPS[nextIdx];
    state.step = nextIdx;
    _setState(state);

    if (nextStep.page !== curPage) {
      // Naviga alla nuova pagina
      _removeUI();
      document.body.style.transition = 'opacity .2s';
      document.body.style.opacity = '0';
      setTimeout(() => { location.href = nextStep.page; }, 200);
    } else {
      _renderStep(nextIdx);
    }
  };

  /**
   * Salta il tutorial.
   */
  window.tutSkip = function () {
    _markTourSeen();
    _cleanupData();
    _clearState();
    _removeUI();
  };

  /**
   * Riavvia il tutorial da impostazioni.html.
   */
  window.restartTutorial = function () {
    _cleanupData();
    _clearState();
    startTutorial();
    document.body.style.transition = 'opacity .2s';
    document.body.style.opacity = '0';
    setTimeout(() => { location.href = 'home.html'; }, 200);
  };

  /* ── Pagina corrente ── */
  function _currentPage() {
    return location.pathname.split('/').pop() || 'home.html';
  }

  /* ── Render di uno step ── */
  function _renderStep(idx) {
    _removeUI();
    const step  = STEPS[idx];
    const state = _getState();
    if (!step || !state) return;

    // Spotlight
    if (step.sel) {
      const el = document.querySelector(step.sel);
      if (el) {
        el.classList.add('tut-spotlight');
        if (step.scroll) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
        }
      }
    }

    // Tooltip card
    const tip = document.createElement('div');
    tip.id = 'tut-tooltip';
    tip.innerHTML = `
      <div class="tut-counter">Passo ${idx + 1} di ${STEPS.length}</div>
      <div class="tut-title">${step.title}</div>
      <div class="tut-body">${step.text}</div>
      <div class="tut-actions">
        <button class="tut-btn-skip" onclick="tutSkip()">Salta</button>
        <button class="tut-btn-next" onclick="tutAdvance()">${step.isFinal ? 'Iniziamo! 🚀' : 'Avanti →'}</button>
      </div>
    `;
    document.body.appendChild(tip);
  }

  /* ── Schermata celebrazione finale ── */
  function _showComplete() {
    const box = document.createElement('div');
    box.id = 'tut-complete';
    box.innerHTML = `
      <div class="tut-complete-box">
        <div class="tut-complete-icon">🎉</div>
        <div class="tut-complete-title">Benvenuto in FitTrack!</div>
        <div class="tut-complete-sub">
          Il tour è finito. Inizia ad allenarti, tieni lo streak vivo e raggiungi i tuoi obiettivi!
        </div>
        <button class="tut-complete-cta" onclick="document.getElementById('tut-complete').remove()">
          Iniziamo! 💪
        </button>
      </div>
    `;
    document.body.appendChild(box);
  }

  /* ── Auto-init: riprende un tutorial già in corso ── */
  function _autoInit() {
    const state = _getState();
    if (!state || !state.active) return;

    const curPage = _currentPage();
    const step    = STEPS[state.step];
    if (!step || step.page !== curPage) return;

    // Aspetta rendering pagina (~400ms per JS render)
    setTimeout(() => _renderStep(state.step), 420);
  }

  /**
   * Auto-trigger per utenti esistenti: mostra il tutorial una sola volta
   * se l'utente ha già completato l'onboarding ma non ha ancora visto
   * il tour aggiornato. Si avvia solo sulla home e solo se non c'è già
   * un tutorial in corso.
   */
  function _checkAutoTrigger() {
    if (_getState()) return; // tutorial già attivo, nulla da fare
    try {
      const data = JSON.parse(localStorage.getItem(DATA_KEY));
      if (
        data &&
        data.onboardingDone &&
        !data.hasSeenUpdateTour &&
        _currentPage() === 'home.html'
      ) {
        startTutorial();
        // Piccolo ritardo extra per il rendering della home
        setTimeout(() => _renderStep(0), 600);
      }
    } catch (e) {}
  }

  function _boot() {
    _autoInit();
    _checkAutoTrigger();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _boot);
  } else {
    _boot();
  }
})();
