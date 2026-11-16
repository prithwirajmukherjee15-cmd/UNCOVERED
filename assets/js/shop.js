/* Uncovered — shop page: browse grid with search, pack builder, videos. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc, money = S.money;
  const CATS = { ...D.categories, ...D.extraCategories };

  /* ---- Browse: the main-menu categories filter this grid ---- */
  const state = { cat: '', q: '' };
  const tabs = [['', 'All'], ...Object.entries(CATS).map(([k, c]) => [k, c.label])];
  $('#browse-tabs').innerHTML = tabs.map(([k, l]) => `<button class="chip" type="button" data-cat="${k}" aria-pressed="${k === ''}">${l}</button>`).join('');
  function renderBrowse() {
    const q = state.q.trim().toLowerCase();
    const list = D.all.filter(p => p.type !== 'pack' && (!state.cat || CATS[state.cat].test(p)) &&
      (!q || [p.title, p.artist, p.genre, p.label, p.format].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => (a.rank || 99) - (b.rank || 99) || (b.released || '').localeCompare(a.released || ''));
    $('#browse-intro').textContent = state.cat ? CATS[state.cat].intro : 'New, reissued and used records, and the turntables to play them.';
    $('#browse-title').textContent = state.cat ? CATS[state.cat].label : 'Browse';
    $$('#browse-tabs .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)));
    $('#browse-count').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    $('#browse-grid').innerHTML = list.map(p => S.card(p, { info: true })).join('') || '<p class="muted">Nothing matches. Try another search.</p>';
    S.observeNew($('#browse-grid'));
    S.refresh();
  }
  // Any link or tab with data-cat (main menu, footer, "See all…") sets the category.
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-cat]');
    if (!t) return;
    state.cat = t.dataset.cat; renderBrowse();
    // Links to #browse are scrolled by the shared anchor handler (smooth scroll).
  });
  document.addEventListener('click', e => { if (e.target.closest('[data-focus-search]')) setTimeout(() => $('#q').focus({ preventScroll: true }), 600); });
  let t;
  $('#q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; renderBrowse(); }, 150); });
  // Arriving from the homepage: ?cat=new opens that category, ?focus=search focuses the search box.
  const params = new URLSearchParams(location.search);
  if (CATS[params.get('cat')]) state.cat = params.get('cat');
  renderBrowse();
  if (params.get('focus') === 'search') setTimeout(() => $('#q').focus({ preventScroll: true }), 700);

  /* ---- Pack builder ---- */
  const pack = D.get('starter-pack');
  const players = pack.players.map(D.get);
  const records = D.albums.filter(a => a.status !== 'preorder' && a.format !== 'Box set' && a.format !== '7"').sort((a, b) => a.artist.localeCompare(b.artist));
  const defaults = ['miles-davis-kind-of-blue', 'air-moon-safari', 'fleetwood-mac-rumours'];
  $('#picks').innerHTML = `
    <label class="flabel" for="pick-player">Your record player</label>
    <div class="picks__row"><div class="picks__thumb" data-thumb="player"></div><select class="select" id="pick-player">${players.map(x => `<option value="${x.id}">${esc(x.artist)} ${esc(x.title)} (${esc(x.condition)}) · ${money(x.price)}</option>`).join('')}</select></div>
    <span class="flabel" style="margin-top:12px">Your three records</span>
    ${[0, 1, 2].map(i => `<div class="picks__row"><div class="picks__thumb" data-thumb="${i}"></div><div><label class="sr-only" for="pick-${i}">Record ${i + 1}</label>
      <select class="select" id="pick-${i}" data-pick>${records.map(a => `<option value="${a.id}"${a.id === defaults[i] ? ' selected' : ''}>${esc(a.artist)} — ${esc(a.title)}${a.condition === 'Used' ? ' (used)' : ''} · ${money(a.price)}</option>`).join('')}</select></div></div>`).join('')}`;
  const picks = () => $$('[data-pick]').map(s => s.value);
  const total = () => {
    const sum = D.get($('#pick-player').value).price + picks().reduce((n, x) => n + D.get(x).price, 0);
    return { sum, price: Math.round(sum * (1 - pack.discount) * 100) / 100 };
  };
  const drawPack = () => {
    $('[data-thumb="player"]').innerHTML = A.img(D.get($('#pick-player').value), { decorative: true });
    picks().forEach((x, i) => { $(`[data-thumb="${i}"]`).innerHTML = A.img(D.get(x), { decorative: true }); });
    // Left-hand visual: the chosen turntable, with the three chosen records in front.
    const root = document.body.dataset.root || '';
    const swap = (el, src, alt) => {
      if (el.getAttribute('src') === src) return;
      el.classList.add('is-swapping');
      const pre = new Image(); pre.src = src;
      pre.onload = pre.onerror = () => { el.src = src; el.alt = alt; requestAnimationFrame(() => el.classList.remove('is-swapping')); };
    };
    const pl = D.get($('#pick-player').value);
    swap($('#pv-player'), root + pl.img, `${pl.artist} ${pl.title} turntable`);
    picks().forEach((x, i) => { const r = D.get(x); swap($('#pv-' + i), root + r.img, `${r.title} by ${r.artist}`); });
    $('#pv-caption').textContent = `${pl.artist} ${pl.title} + ${picks().map(x => D.get(x).title).join(', ')}`;
    const tt = total();
    $('#pack-price').innerHTML = `<s>${money(tt.sum)}</s>${money(tt.price)}`;
  };
  $('#picks').addEventListener('change', drawPack);
  $('#picks').addEventListener('input', drawPack);
  drawPack();
  $('#add-pack').addEventListener('click', e => {
    S.Cart.add(pack.id, 1, { player: $('#pick-player').value, picks: picks(), price: total().price });
    e.currentTarget.classList.add('is-added');
    $('[data-cart-open]').click();
  });

  /* ---- Videos pause off screen ---- */
  const vids = $$('video');
  if (S.reduced) { vids.forEach(v => { v.removeAttribute('autoplay'); v.pause(); }); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const pr = e.target.play(); if (pr) pr.catch(() => {}); } else e.target.pause(); }), { threshold: 0.05 });
  vids.forEach(v => io.observe(v));
})();
