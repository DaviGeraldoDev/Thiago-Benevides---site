/* THIAGO BENEVIDES — site.js v2: abas, player próprio (overlay com legenda), menu mobile, arraste dos posts */
(() => {
  const ico = {
    play:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    vol:   '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mute:  '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    fs:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'
  };
  const fmt = (s) => (!isFinite(s) ? '0:00' : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`);

  // ---------- Abas (Vídeos / Posts) ----------
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', on); document.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
  }));

  // ---------- Player próprio ----------
  const rv = document.getElementById('rv');
  if (rv) {
    const cards = [...document.querySelectorAll('.reel')];
    const vp = rv.querySelector('.vp'), v = vp.querySelector('video'), $ = (s) => rv.querySelector(s);
    const big = $('.vp__big'), pp = $('.js-pp'), mute = $('.js-mute'), fs = $('.js-fs'), track = $('.vp__track'), fill = $('.vp__fill'), buf = $('.vp__buf');
    const tm = $('.js-time'), dur = $('.js-dur'), title = $('.js-title'), cap = $('.js-cap'), count = $('.js-count');
    let idx = 0, idle, opener = null;

    const paint = () => {
      const on = !v.paused && !v.ended;
      pp.innerHTML = on ? ico.pause : ico.play; pp.setAttribute('aria-label', on ? 'Pausar' : 'Reproduzir');
      mute.innerHTML = v.muted ? ico.mute : ico.vol; mute.setAttribute('aria-label', v.muted ? 'Ativar som' : 'Desativar som');
    };
    const wake = () => { vp.classList.remove('is-idle'); clearTimeout(idle); if (!v.paused) idle = setTimeout(() => vp.classList.add('is-idle'), 2600); };
    const load = (i, autoplay) => {
      idx = (i + cards.length) % cards.length; const c = cards[idx];
      v.poster = c.dataset.poster; v.src = c.dataset.video;
      title.textContent = c.dataset.title; cap.textContent = c.dataset.cap; count.textContent = `${idx + 1} / ${cards.length}`;
      fill.style.width = buf.style.width = '0'; tm.textContent = '0:00'; dur.textContent = '0:00';
      vp.classList.remove('is-started'); paint();
      if (autoplay) v.play().then(() => vp.classList.add('is-started')).catch(() => {});
    };
    const open = (i) => { opener = document.activeElement; rv.classList.add('is-open'); rv.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; load(i, true); $('.rv__x').focus({ preventScroll: true }); };
    const close = () => { v.pause(); rv.classList.remove('is-open'); rv.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; if (document.fullscreenElement) document.exitFullscreen(); if (opener) opener.focus({ preventScroll: true }); };
    const toggle = () => (v.paused ? v.play() : v.pause());

    cards.forEach((c, k) => c.addEventListener('click', () => open(k)));
    $('.rv__x').addEventListener('click', close);
    rv.addEventListener('click', (e) => { if (e.target === rv) close(); });
    $('.js-prev').addEventListener('click', () => load(idx - 1, true));
    $('.js-next').addEventListener('click', () => load(idx + 1, true));
    big.addEventListener('click', () => v.play().then(() => vp.classList.add('is-started')).catch(() => {}));
    pp.addEventListener('click', toggle); v.addEventListener('click', toggle);
    mute.addEventListener('click', () => { v.muted = !v.muted; });
    fs.innerHTML = ico.fs;
    fs.addEventListener('click', () => {
      if (document.fullscreenElement) return document.exitFullscreen();
      if (vp.requestFullscreen) vp.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    });
    ['play', 'pause', 'ended', 'volumechange'].forEach((e) => v.addEventListener(e, () => { paint(); wake(); }));
    v.addEventListener('loadedmetadata', () => { dur.textContent = fmt(v.duration); });
    v.addEventListener('timeupdate', () => { if (v.duration) { fill.style.width = (v.currentTime / v.duration * 100) + '%'; tm.textContent = fmt(v.currentTime); } });
    v.addEventListener('progress', () => { if (v.buffered.length && v.duration) buf.style.width = (v.buffered.end(v.buffered.length - 1) / v.duration * 100) + '%'; });
    v.addEventListener('ended', () => load(idx + 1, true));
    const seek = (x) => { const b = track.getBoundingClientRect(); v.currentTime = Math.min(1, Math.max(0, (x - b.left) / b.width)) * v.duration; };
    let drag = false;
    track.addEventListener('pointerdown', (e) => { drag = true; track.setPointerCapture(e.pointerId); seek(e.clientX); });
    track.addEventListener('pointermove', (e) => { if (drag) seek(e.clientX); });
    track.addEventListener('pointerup', () => { drag = false; });
    track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') v.currentTime += 5; if (e.key === 'ArrowLeft') v.currentTime -= 5; });
    vp.addEventListener('mousemove', wake); vp.addEventListener('touchstart', wake, { passive: true });
    document.addEventListener('keydown', (e) => {
      if (!rv.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight' && e.target === document.body) load(idx + 1, true);
      else if (e.key === 'ArrowLeft' && e.target === document.body) load(idx - 1, true);
      else if (e.key === ' ' && e.target === document.body) { e.preventDefault(); toggle(); }
      else if (e.key.toLowerCase() === 'm') v.muted = !v.muted;
    });
    paint();
  }

  // ---------- Menu mobile ----------
  const burger = document.querySelector('.nav__burger');
  if (burger) {
    const set = (on) => { document.body.classList.toggle('menu-open', on); burger.setAttribute('aria-expanded', on); burger.setAttribute('aria-label', on ? 'Fechar menu' : 'Abrir menu'); };
    burger.addEventListener('click', () => set(!document.body.classList.contains('menu-open')));
    document.querySelectorAll('.drawer a').forEach((a) => a.addEventListener('click', () => set(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  // ---------- Posts: arrastar com o mouse ----------
  const rail = document.querySelector('.rail');
  if (rail) {
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.style.scrollSnapType = 'none'; });
    addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!down) return; down = false; rail.style.scrollSnapType = ''; });
    rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
  }

  const yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
