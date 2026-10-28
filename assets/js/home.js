/* Uncovered — home page rows and banner slider. */
(function () {
  const S = window.SITE, D = S.D, $ = S.$, $$ = S.$$;

  // Wordmark letters rise in one by one.
  const wm = $('[data-wordmark]');
  if (wm && !S.reduced) wm.innerHTML = [...wm.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');

  $('#last-releases').innerHTML = D.lastReleases().slice(0, 6).map(p => S.card(p)).join('');
  $('#best-sellers').innerHTML = D.bestsellers().slice(0, 6).map(p => S.card(p, { rank: true })).join('');
  $('#used-row').innerHTML = D.albums.filter(a => a.condition === 'Used').slice(0, 6).map(p => S.card(p)).join('');

  // Mobile: the banner becomes a swipeable slider with dots.
  const banner = $('#banner'), dots = $$('#banner-dots button');
  const setDot = () => {
    const panels = $$('.panel', banner);
    const mid = banner.scrollLeft + banner.clientWidth / 2;
    let best = 0;
    panels.forEach((p, i) => { if (Math.abs(p.offsetLeft + p.offsetWidth / 2 - mid) < Math.abs(panels[best].offsetLeft + panels[best].offsetWidth / 2 - mid)) best = i; });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === best)));
  };
  banner.addEventListener('scroll', () => requestAnimationFrame(setDot), { passive: true });
  dots.forEach((d, i) => d.addEventListener('click', () => $$('.panel', banner)[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })));
  setDot();
})();

// Hero: fade the title as you scroll; pause videos when off screen (saves battery).
(function () {
  const hero = document.querySelector('.hero');
  const onScroll = () => { const p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.8))); hero.style.setProperty('--hp', p.toFixed(3)); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const vids = [...document.querySelectorAll('video')];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); }); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const pr = e.target.play(); if (pr) pr.catch(() => {}); } else e.target.pause(); }), { threshold: 0.05 });
  vids.forEach(v => io.observe(v));
})();
