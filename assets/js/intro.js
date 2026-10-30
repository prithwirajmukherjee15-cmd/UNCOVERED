/* Uncovered — opening intro. A frosted card over the hero: a big record spins,
   its label is a real album cover, and it cycles through this week's releases. */
(function () {
  const S = window.SITE, D = S.D, $ = S.$, $$ = S.$$, esc = S.esc;
  const el = $('#intro');
  const KEY = 'uncovered.intro.seen';
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked */ }
  if (!el || (seen && !location.hash.includes('intro'))) return;

  const picks = ['amy-winehouse-back-to-black-20th', 'miles-davis-kind-of-blue', 'used-velvet-underground-and-nico', 'iommi-from-the-dark', 'air-moon-safari', 'shygirl-swallow'].map(D.get).filter(Boolean);
  const root = document.body.dataset.root || '';
  const label = $('.vinyl__label', el), disc = $('.intro__disc', el), ghost = $('.intro__ghost', el);
  $('.intro__swatches', el).innerHTML = picks.map((p, i) => `<button type="button" data-i="${i}" aria-label="${esc(p.artist)}, ${esc(p.title)}"><img src="${root}${p.img}" alt=""></button>`).join('');

  // Tint the stage with each cover's average colour (covers are same-origin, so canvas can read them).
  const tint = p => new Promise(res => {
    const img = new Image(); img.src = root + p.img;
    img.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = c.height = 8;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, 8, 8);
        const d = x.getImageData(0, 0, 8, 8).data; let r = 0, g = 0, b = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
        const n = d.length / 4; res(`${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)}`);
      } catch (e) { res('201, 162, 107'); }
    };
    img.onerror = () => res('201, 162, 107');
  });

  let i = 0, timer = null;
  async function show(n, first) {
    i = (n + picks.length) % picks.length;
    const p = picks[i];
    $$('.intro__swatches button', el).forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    if (!first) { disc.classList.add('is-out'); await new Promise(r => setTimeout(r, 420)); }
    label.style.backgroundImage = `url('${root}${p.img}')`;
    ghost.textContent = p.artist;
    $('.intro__artist', el).textContent = p.artist;
    $('.intro__title', el).textContent = p.title;
    el.style.setProperty('--tint', await tint(p));
    disc.classList.remove('is-out');
  }
  const auto = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 2800); };

  function open() {
    el.hidden = false;
    document.documentElement.classList.add('is-locked');
    requestAnimationFrame(() => el.classList.add('is-open'));
    show(0, true); auto();
    const card = $('.intro__card', el); card.tabIndex = -1; setTimeout(() => card.focus({ preventScroll: true }), 700);
  }
  function close(go) {
    clearInterval(timer);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage blocked */ }
    el.classList.remove('is-open'); el.classList.add('is-closing');
    document.documentElement.classList.remove('is-locked');
    setTimeout(() => { el.hidden = true; }, 700);
    if (go) setTimeout(() => $('#last').scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth' }), 350);
    S.track('intro_' + (go ? 'start' : 'dismiss'));
  }
  el.addEventListener('click', e => {
    const sw = e.target.closest('.intro__swatches button');
    if (sw) { show(+sw.dataset.i); auto(); return; }
    if (e.target.closest('[data-intro-go]')) { close(true); return; }
    if (e.target.closest('[data-intro-close]')) close(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !el.hidden) close(false); });
  setTimeout(open, S.reduced ? 0 : 900);
})();
