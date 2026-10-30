/* Uncovered — opening sequence.
   1. Hero video starts as a small rounded window (html.is-opening, set inline in <head>).
   2. It expands to full screen; header and glass panel fade in.
   3. A popup opens over the blurred hero: an animated stage on top
      (record → your record → finder screens → Graded. → Flip.), text and buttons below.
   The popup shows once per browser session. */
(function () {
  const S = window.SITE, D = S.D, $ = S.$, $$ = S.$$;
  const html = document.documentElement;
  const root = document.body.dataset.root || '';

  // 1 → 2: expand the window.
  setTimeout(() => html.classList.remove('is-opening'), S.reduced ? 0 : 500);

  const pop = $('#vpop');
  const KEY = 'uncovered.opening.seen';
  let seen = false;
  try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked */ }
  if (!pop || (seen && !location.hash.includes('opening'))) return;

  const stage = $('#vpop-stage');
  const intro = $('.sc--intro', stage), ui = $('.sc--ui', stage);
  const STEPS = ['Format', 'Genre', 'Record', 'Condition', 'Sides', 'Summary'];
  const chipsIds = ['miles-davis-kind-of-blue', 'air-moon-safari', 'amy-winehouse-back-to-black', 'fleetwood-mac-rumours', 'daft-punk-random-access-memories', 'serge-gainsbourg-histoire-de-melody-nelson', 'pink-floyd-dark-side-of-the-moon'];
  const img = id => `${root}${D.get(id).img}`;

  const tintCache = {};
  const tint = id => tintCache[id] || (tintCache[id] = new Promise(res => {
    const im = new Image(); im.src = img(id);
    im.onload = () => {
      try {
        const c = document.createElement('canvas'); c.width = c.height = 10;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0, 10, 10);
        const d = x.getImageData(0, 0, 10, 10).data; let r = 0, g = 0, b = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
        const n = d.length / 4, k = 1.25; // lift the colour a little so dark covers still glow
        res(`${Math.min(255, Math.round(r / n * k))}, ${Math.min(255, Math.round(g / n * k))}, ${Math.min(255, Math.round(b / n * k))}`);
      } catch (e) { res('60, 50, 40'); }
    };
    im.onerror = () => res('60, 50, 40');
  }));

  const scenes = [
    { kind: 'intro', headline: 'Uncover your vinyl.', logo: true },
    { kind: 'intro', headline: 'Your record.', label: 'miles-davis-kind-of-blue', caption: 'Kind of Blue<sup>®</sup>' },
    { kind: 'ui', step: 'Record', title: 'Kind of Blue', ghost: 'Kind of Blue', desc: 'Miles Davis, 1959. Warm, deep and made for a rainy Sunday.', label: 'miles-davis-kind-of-blue', chips: 'covers' },
    { kind: 'ui', step: 'Record', title: 'Moon Safari', ghost: 'Moon Safari', desc: 'Air, 1998. Versailles at dusk, on 180 grams.', label: 'air-moon-safari', chips: 'covers' },
    { kind: 'ui', step: 'Condition', title: 'Graded.', ghost: 'Graded', desc: 'Every used record cleaned, played and graded by hand.', label: 'used-velvet-underground-and-nico', mode: 'zoom', tags: ['NM', 'VG+', 'VG', 'G'], on: 1 },
    { kind: 'ui', step: 'Sides', title: 'Flip.', ghost: 'Flip', desc: 'Side A, side B. Both checked before it ships.', label: 'used-david-bowie-hunky-dory', mode: 'flip', tags: ['Side A', 'Side B'], on: 1 }
  ];

  let i = -1, timer = null;
  async function play(n) {
    i = n % scenes.length;
    const s = scenes[i];
    intro.classList.toggle('is-on', s.kind === 'intro');
    ui.classList.toggle('is-on', s.kind === 'ui');
    if (s.kind === 'intro') {
      stage.setAttribute('data-plain', '');
      stage.removeAttribute('data-mode');
      $('[data-headline]', intro).textContent = s.headline;
      const lab = $('[data-label]', intro);
      lab.classList.toggle('is-logo', !!s.logo);
      lab.style.backgroundImage = s.label ? `url('${img(s.label)}')` : '';
      $('[data-caption]', intro).innerHTML = s.caption || '';
    } else {
      stage.removeAttribute('data-plain');
      if (s.mode) stage.setAttribute('data-mode', s.mode); else stage.removeAttribute('data-mode');
      $('[data-steps]', ui).innerHTML = STEPS.map(t => `<span${t === s.step ? ' aria-current="step"' : ''}>${t}</span>`).join('<span aria-hidden="true">·</span>');
      const title = $('[data-title]', ui);
      title.classList.add('is-blur');
      setTimeout(() => {
        title.innerHTML = `${s.title}${s.mode ? '' : '<sup>®</sup>'}`;
        $('[data-step]', ui).textContent = s.step;
        $('[data-desc]', ui).textContent = s.desc;
        $('[data-ghost]', ui).textContent = s.ghost;
        $('[data-ui-label]', ui).style.backgroundImage = `url('${img(s.label)}')`;
        $('[data-chips]', ui).innerHTML = s.tags
          ? s.tags.map((t, k) => `<span class="tag${k === s.on ? ' is-on' : ''}">${t}</span>`).join('')
          : chipsIds.map(id => `<span class="${id === s.label ? 'is-on' : ''}"><img src="${img(id)}" alt=""></span>`).join('');
        title.classList.remove('is-blur');
      }, 260);
      stage.style.setProperty('--tint', await tint(s.label));
    }
  }
  const next = () => play(i + 1);

  function open() {
    pop.hidden = false;
    html.classList.add('is-locked');
    requestAnimationFrame(() => pop.classList.add('is-open'));
    next();
    timer = setInterval(next, 2400);
    setTimeout(() => $('.vpop__card', pop).focus({ preventScroll: true }), 600);
  }
  function close(go) {
    clearInterval(timer);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage blocked */ }
    pop.classList.remove('is-open'); pop.classList.add('is-closing');
    html.classList.remove('is-locked');
    setTimeout(() => { pop.hidden = true; pop.classList.remove('is-closing'); }, 800);
    if (go) setTimeout(() => $('#browse').scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth' }), 400);
    S.track(go ? 'opening_try_it' : 'opening_dismiss');
  }
  pop.addEventListener('click', e => {
    if (e.target.closest('[data-vpop-go]')) close(true);
    else if (e.target.closest('[data-vpop-close]')) close(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pop.hidden) close(false); });
  // Preload the colour tints, then open after the hero has expanded.
  scenes.forEach(s => s.label && tint(s.label));
  setTimeout(open, S.reduced ? 300 : 2600);
})();
