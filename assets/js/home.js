/* Uncovered — home page: product rows and scroll scenes. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$;
  const SCENES = window.SCENES;
  const clamp = v => Math.min(1, Math.max(0, v));

  // Wordmark: letters rise in one by one.
  const wm = $('[data-wordmark]');
  if (wm && !S.reduced) wm.innerHTML = [...wm.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');

  // Category counts in the nav row.
  document.querySelectorAll('.catnav a').forEach(a => {
    const cat = new URL(a.href).searchParams.get('cat');
    const c = D.categories[cat];
    if (c) a.insertAdjacentHTML('beforeend', `<sup>${D.all.filter(c.test).length}</sup>`);
  });

  // Last releases: newest first, pre-orders included.
  const releases = D.albums
    .filter(a => a.tags.includes('new') || a.status === 'preorder')
    .sort((a, b) => b.released.localeCompare(a.released));
  $('#releases').innerHTML = releases.map(S.card).join('') +
    `<a class="hs__more" href="shop.html?cat=new" data-reveal><span>See all<br>new releases</span><i aria-hidden="true">→</i></a>`;

  // Best-selling records.
  const best = ['saint-ouen-sessions', 'velvet-static', 'pale-machines', 'midnight-ledger'].map(D.get);
  $('#bestsellers').innerHTML = best.map(S.card).join('');

  // Pack visual.
  $('#pack-visual').innerHTML = A.packVisual(D.get('starter-pack'), ['velvet-static', 'saint-ouen-sessions', 'low-tide-hymns']);

  /* ---- Scenes ---- */

  // Horizontal shelf driven by vertical scroll (desktop only).
  SCENES.hscroll = {
    measure(el, sticky) {
      const track = $('.hs__track', el), vp = $('.hs__viewport', el);
      if (!S.desktop.matches || S.reduced) {
        el.style.height = ''; track.style.transform = ''; el._dist = 0;
        el.classList.toggle('hs--native', S.reduced);
        return;
      }
      const dist = Math.max(0, track.scrollWidth - vp.clientWidth);
      el._dist = dist;
      el.style.height = (sticky.offsetHeight + dist) + 'px';
    },
    update(el, p) {
      if (!el._dist) return;
      $('.hs__track', el).style.transform = `translate3d(${(-p * el._dist).toFixed(1)}px,0,0)`;
    }
  };

  // Best-seller: tonearm swings in, record spins faster as you scroll.
  const bestEl = $('#best-seller');
  const tt = $('.best__tt', bestEl);
  let bestP = 0, angle = 0, visible = false, last = performance.now();
  SCENES.best = {
    update(el, p) {
      bestP = p;
      const arm = p < 0.1 ? 0 : p < 0.3 ? ((p - 0.1) / 0.2) * 28 : 28 + (p - 0.3) * 14;
      tt.style.setProperty('--arm', arm.toFixed(2));
      tt.querySelector('.tt').classList.toggle('is-on', p > 0.25);
    }
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(bestEl);
  const spin = now => {
    const dt = Math.min(64, now - last); last = now;
    if (visible && bestP > 0.25 && !S.reduced) angle += dt * 0.2; // ≈ 33⅓ RPM
    tt.style.setProperty('--spin', (angle + bestP * 420).toFixed(1) + 'deg');
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);

  // Concept: record slides out (1), phone rises (2), hub opens (3).
  SCENES.concept = {
    update(el, p) {
      el.style.setProperty('--p1', clamp(p * 3).toFixed(3));
      el.style.setProperty('--p2', clamp(p * 3 - 1).toFixed(3));
      el.style.setProperty('--p3', clamp(p * 3 - 2).toFixed(3));
    }
  };
})();
