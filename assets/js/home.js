/* Uncovered — homepage: rows, Current Reco, banner slider, videos. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc, money = S.money;
  const CATS = { ...D.categories, ...D.extraCategories };

  // Wordmark letters rise in one by one.
  const wm = $('[data-wordmark]');
  if (wm && !S.reduced) wm.innerHTML = [...wm.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');

  $('#last-releases').innerHTML = D.lastReleases().slice(0, 6).map(p => S.card(p)).join('');
  $('#best-sellers').innerHTML = D.bestsellers().slice(0, 6).map(p => S.card(p, { rank: true })).join('');

  /* ---- Current Reco: Listen & buy ---- */
  const reco = D.get('miles-davis-kind-of-blue');
  $('#reco-listen').addEventListener('click', e => {
    window.LISTEN.toggle(reco, e.currentTarget, $('#reco-player'));
    if (!S.Cart.items().some(i => i.id === reco.id)) S.Cart.add(reco.id, 1);
  });

  /* ---- Mobile banner slider dots ---- */
  const banner = $('#banner'), dots = $$('#banner-dots button');
  const setDot = () => {
    const panels = $$('.panel', banner), mid = banner.scrollLeft + banner.clientWidth / 2;
    let best = 0;
    panels.forEach((p, i) => { if (Math.abs(p.offsetLeft + p.offsetWidth / 2 - mid) < Math.abs(panels[best].offsetLeft + panels[best].offsetWidth / 2 - mid)) best = i; });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === best)));
  };
  banner.addEventListener('scroll', () => requestAnimationFrame(setDot), { passive: true });
  dots.forEach((d, i) => d.addEventListener('click', () => $$('.panel', banner)[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })));
  setDot();

  /* ---- Hero fade on scroll; videos pause off screen ---- */
  const hero = $('.hero');
  const onScroll = () => hero.style.setProperty('--hp', Math.min(1, Math.max(0, scrollY / (hero.offsetHeight * 0.8))).toFixed(3));
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const vids = $$('video');
  if (S.reduced) { vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); }); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const pr = e.target.play(); if (pr) pr.catch(() => {}); } else e.target.pause(); }), { threshold: 0.05 });
  vids.forEach(v => io.observe(v));
})();
