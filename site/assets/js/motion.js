/* THIAGO BENEVIDES — motion.js
   Revelação ao rolar (escalonada, por palavra, em arco, em wipe), filete que se desenha, contadores,
   barra de leitura na nav, parallax leve e ticker em loop.
   Uso: <script src="motion.js" defer></script>.
   Marque: .reveal / .reveal--arch / .reveal--mask / .reveal--words / .reveal--wipe / .rule--draw / [data-parallax] / [data-count] / [data-stagger]. */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.remove('no-js');

  // Escalonamento: filhos de [data-stagger] recebem --i
  document.querySelectorAll('[data-stagger]').forEach((box) =>
    [...box.children].forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--i', Math.min(i, 8)); })
  );

  // Título por palavra: envolve cada palavra (preserva <em>)
  document.querySelectorAll('.reveal--words').forEach((h) => {
    let n = 0;
    const wrap = (node) => {
      [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const s = document.createElement('span'); s.textContent = t; s.style.setProperty('--i', n++); w.append(s); frag.append(w);
          });
          c.replaceWith(frag);
        } else if (c.nodeType === 1) wrap(c);
      });
    };
    wrap(h);
  });

  // Contadores: <span data-count="3000" data-prefix="+">0</span>
  const count = (el) => {
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = pre + end.toLocaleString('pt-BR', { minimumFractionDigits: dec }) + suf; return; }
    const t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + (end * e).toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const targets = document.querySelectorAll('.reveal, .reveal--arch, .reveal--mask, .reveal--words, .reveal--wipe, .rule--draw, [data-count]');
  const show = (el) => { el.classList.add('is-in'); if (el.dataset.count) count(el); };
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(show);
  } else {
    // clip-path zera a área visível, então observamos o pai de .reveal--arch / .reveal--wipe
    const owner = new Map();
    const io = new IntersectionObserver((entries) => {
      // também revela o que ficou acima da tela (pulo de âncora / recarga no meio da página)
      entries.forEach((e) => { if (e.isIntersecting || e.boundingClientRect.top < 0) { show(owner.get(e.target) || e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((el) => {
      if ((el.classList.contains('reveal--arch') || el.classList.contains('reveal--wipe')) && el.parentElement) { owner.set(el.parentElement, el); io.observe(el.parentElement); }
      else io.observe(el);
    });
  }

  // Nav: sombra + barra de leitura
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', scrollY > 8);
      const max = root.scrollHeight - innerHeight;
      nav.style.setProperty('--scroll', max > 0 ? (scrollY / max).toFixed(4) : 0);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Parallax leve (data-parallax="0.08")
  const px = [...document.querySelectorAll('[data-parallax]')];
  if (px.length && !reduce) {
    let tick = false;
    const run = () => {
      px.forEach((el) => {
        const r = el.getBoundingClientRect(), k = parseFloat(el.dataset.parallax) || 0.08;
        el.style.transform = `translateY(${((r.top + r.height / 2) - innerHeight / 2) * -k}px)`;
      });
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  // Ticker: duplica o conteúdo para o loop contínuo
  document.querySelectorAll('.ticker__track').forEach((t) => { t.innerHTML += t.innerHTML; });
})();
