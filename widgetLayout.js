/* ══════════════════════════════════════════════
   Tab bar height sync — imposta --tab-bar-h su :root
   con l'altezza reale della tab bar misurata dal DOM.
   Funziona su qualsiasi dispositivo / safe area.
══════════════════════════════════════════════ */
(function(){
  function _syncTabH(){
    const tb = document.querySelector('.tab-bar');
    if(!tb) return;
    const h = Math.ceil(tb.getBoundingClientRect().height);
    if(h > 0) document.documentElement.style.setProperty('--tab-bar-h', h + 'px');
  }
  /* Prima chiamata immediata */
  _syncTabH();
  /* Aggiorna se la tab bar cambia dimensione (es. rotazione schermo) */
  try{ new ResizeObserver(_syncTabH).observe(document.documentElement); }catch(e){}
  window.addEventListener('resize', _syncTabH, { passive:true });
  /* Sicurezza: riesegui dopo rendering completo */
  window.addEventListener('load', _syncTabH, { once:true });
})();

/* ══════════════════════════════════════════════
   widgetLayout.js — Riordino widget per pagina
   Include in: home, registra, peso, profilo, sfide
══════════════════════════════════════════════ */
(function () {
  const LAYOUT_KEY = 'fittrack_layout';
  const PAGE = location.pathname.split('/').pop() || 'home.html';

  const PAGE_WIDGETS = {
    'home.html':     ['wgt-carousel', 'wgt-recap', 'wgt-plan'],
    'registra.html': ['wgt-cal', 'wgt-mstats', 'wgt-storico'],
    'peso.html':     ['wgt-phero', 'wgt-input', 'wgt-chart', 'wgt-storico-p'],
    'profilo.html':  ['wgt-avatar', 'wgt-stats', 'wgt-dati', 'wgt-goal'],
    'sfide.html':    ['wgt-sfide-active', 'wgt-sfide-completed']
  };

  if (!PAGE_WIDGETS[PAGE]) return;

  /* ── CSS ── */
  const _css = document.createElement('style');
  _css.textContent = `
    /* Logo / titolo wrap */
    .logo-wrap {
      display: flex;
      align-items: center;
      gap: 0;
      cursor: default;
    }
    .logo-wrap .logo,
    .logo-wrap .wl-trigger-el {
      transition: transform .25s cubic-bezier(.25,1,.3,1);
      user-select: none;
    }
    .logo-wrap .logo.wl-shifted,
    .logo-wrap .wl-trigger-el.wl-shifted { transform: translateX(10px); }

    /* Bottone matita */
    .wl-pencil {
      width: 30px; height: 26px;
      border-radius: 8px;
      background: linear-gradient(135deg, var(--a1, #0088ff), var(--a2, #00ccff));
      border: none;
      color: #fff; font-size: 13px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transform: translateX(-8px);
      transition: opacity .25s, transform .25s cubic-bezier(.25,1,.3,1);
      flex-shrink: 0;
    }
    .wl-pencil.wl-visible {
      opacity: 1;
      pointer-events: all;
      transform: translateX(0);
    }
    .wl-pencil.wl-active {
      background: linear-gradient(135deg, #ff6b35, #ff4455);
    }

    /* Bordo tratteggiato sui widget in edit mode */
    body.wl-edit #wgt-container > [id^="wgt-"] {
      position: relative;
      outline: 1.5px dashed rgba(0,136,255,.35);
      outline-offset: 3px;
      border-radius: 18px;
      transition: outline .2s;
    }

    /* Barra controlli widget */
    .wl-ctrl {
      display: none;
      position: absolute;
      top: 10px; right: 12px;
      z-index: 40;
      gap: 4px;
    }
    body.wl-edit .wl-ctrl { display: flex; }

    .wl-btn {
      width: 28px; height: 28px;
      border-radius: 8px;
      background: var(--bg3, #0a1428);
      border: 1px solid var(--a1, #0088ff);
      color: var(--a2, #00ccff);
      font-size: 14px; line-height: 1;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      font-family: var(--font, sans-serif);
      transition: background .15s;
    }
    .wl-btn:active { background: rgba(0,136,255,.2); }
    .wl-btn:disabled { opacity: .3; cursor: default; }
  `;
  document.head.appendChild(_css);

  /* ── Stato ── */
  let _pencilVisible = false;
  let _editMode = false;

  function _getLayout() {
    try { return JSON.parse(localStorage.getItem(LAYOUT_KEY)) || {}; } catch (e) { return {}; }
  }
  function _saveLayout(order) {
    const all = _getLayout();
    all[PAGE] = order;
    try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(all)); } catch (e) {}
  }

  function _currentOrder() {
    const container = document.getElementById('wgt-container');
    if (!container) return [];
    return [...container.children]
      .filter(el => el.id && el.id.startsWith('wgt-'))
      .map(el => el.id);
  }

  function _applyOrder() {
    const container = document.getElementById('wgt-container');
    if (!container) return;
    const saved = _getLayout()[PAGE];
    if (!saved || !saved.length) return;
    saved.forEach(id => {
      const el = document.getElementById(id);
      if (el) container.appendChild(el);
    });
  }

  function _moveWidget(id, dir) {
    const container = document.getElementById('wgt-container');
    if (!container) return;
    const el = document.getElementById(id);
    if (!el) return;
    const siblings = [...container.children].filter(c => c.id && c.id.startsWith('wgt-'));
    const idx = siblings.indexOf(el);
    if (dir === -1 && idx > 0) {
      container.insertBefore(el, siblings[idx - 1]);
    } else if (dir === 1 && idx < siblings.length - 1) {
      siblings[idx + 1].after(el);
    }
    _updateBtnStates();
    _saveLayout(_currentOrder());
  }

  function _updateBtnStates() {
    const container = document.getElementById('wgt-container');
    if (!container) return;
    const siblings = [...container.children].filter(c => c.id && c.id.startsWith('wgt-'));
    siblings.forEach((el, idx) => {
      const up   = el.querySelector('.wl-up');
      const down = el.querySelector('.wl-down');
      if (up)   up.disabled   = idx === 0;
      if (down) down.disabled = idx === siblings.length - 1;
    });
  }

  function _addControls() {
    const container = document.getElementById('wgt-container');
    if (!container) return;
    [...container.children]
      .filter(el => el.id && el.id.startsWith('wgt-'))
      .forEach(el => {
        if (el.querySelector('.wl-ctrl')) return;
        const ctrl = document.createElement('div');
        ctrl.className = 'wl-ctrl';
        ctrl.innerHTML = `
          <button class="wl-btn wl-up"   onclick="wlMove('${el.id}',-1)" title="Sposta su">↑</button>
          <button class="wl-btn wl-down" onclick="wlMove('${el.id}',1)"  title="Sposta giù">↓</button>
        `;
        el.appendChild(ctrl);
      });
    _updateBtnStates();
  }

  function _toggleEdit() {
    _editMode = !_editMode;
    document.body.classList.toggle('wl-edit', _editMode);
    const pencil = document.querySelector('.wl-pencil');
    if (pencil) pencil.classList.toggle('wl-active', _editMode);
    if (_editMode) {
      _addControls();
    } else {
      _saveLayout(_currentOrder());
    }
  }

  function _togglePencil() {
    if (_editMode) { _toggleEdit(); return; }
    _pencilVisible = !_pencilVisible;
    const triggerEl = document.querySelector('.logo-wrap .wl-trigger-el');
    const pencil    = document.querySelector('.wl-pencil');
    if (triggerEl) triggerEl.classList.toggle('wl-shifted', _pencilVisible);
    if (pencil)    pencil.classList.toggle('wl-visible', _pencilVisible);
  }

  /* ── Setup trigger (logo o titolo alternativo) ── */
  function _setupLogo() {
    // Cerca prima .logo, poi .header-title, poi .page-title
    let trigger = document.querySelector('.logo')
                || document.querySelector('.header-title')
                || document.querySelector('.page-title');
    if (!trigger || trigger.closest('.logo-wrap')) return;

    trigger.classList.add('wl-trigger-el');

    const wrap = document.createElement('div');
    wrap.className = 'logo-wrap';
    trigger.parentNode.insertBefore(wrap, trigger);
    wrap.appendChild(trigger);

    const pencil = document.createElement('button');
    pencil.className = 'wl-pencil';
    pencil.innerHTML = '✏️';
    pencil.title = 'Riordina widget';
    pencil.onclick = (e) => { e.stopPropagation(); _toggleEdit(); };
    wrap.insertBefore(pencil, trigger);

    trigger.addEventListener('click', (e) => { e.stopPropagation(); _togglePencil(); });
  }

  /* ── API pubblica ── */
  window.wlMove = function (id, dir) { _moveWidget(id, dir); };

  /* ── Init ── */
  function _init() {
    _applyOrder();
    _setupLogo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }
})();
