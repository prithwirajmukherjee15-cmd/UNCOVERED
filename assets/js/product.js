/* Uncovered — product page for records, record players and the pack. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc, money = S.money;
  const id = new URLSearchParams(location.search).get('id');
  const p = D.get(id);
  const root = $('#product');

  if (!p) {
    root.innerHTML = `<div style="grid-column:1/-1;padding:60px 0"><h1 class="h-display">Record <em>not found</em></h1><p class="lead" style="margin:20px 0 30px">This page may have moved. The record you're after is probably still in the shop.</p><a class="btn" href="shop.html">Go to the shop</a></div>`;
    $('.related').hidden = true;
    return;
  }

  const catKey = p.type === 'vinyl' ? (p.condition === 'Used' ? 'used' : 'vinyl') : p.type === 'player' ? 'players' : 'packs';
  const catLabel = { ...D.categories, ...D.extraCategories }[catKey].label;
  $('#crumbs').insertAdjacentHTML('beforeend', `<li><a href="shop.html?cat=${catKey}">${catLabel}</a></li><li aria-current="page">${esc(p.title)}</li>`);
  document.title = p.type === 'vinyl' ? `${p.artist} – ${p.title} (${p.condition === 'Used' ? 'Used ' : ''}Vinyl ${p.format}) | Uncovered` : `${p.artist} ${p.title} | Uncovered`;
  document.querySelector('meta[name="description"]').setAttribute('content', p.blurb);

  const st = S.statusInfo(p);
  const credit = c => c ? `<p class="photo-credit">Photo: <a href="${c.page}" rel="noopener">${esc(c.author)}</a>, ${esc(c.license)} via Wikimedia Commons</p>` : '';
  const ship = `<div class="acc__body"><p>Free delivery on orders over ${money(S.FREE_SHIPPING)}; otherwise €4.90. Records travel in rigid mailers with corner protectors.</p><p>Changed your mind? Return unopened items within 30 days. <a href="help.html#returns">Our returns policy</a>.</p></div>`;
  const badges = S.badges(p).map(([c, t]) => `<span class="badge${c ? ' badge--' + c : ''}">${t}</span>`).join('');

  let media = `<div class="product__visual product__visual--${p.type}" id="visual">${A.img(p, { eager: true })}${badges ? `<span class="badges">${badges}</span>` : ''}</div>`;
  let info = '', accs = '', extra = '';

  if (p.type === 'vinyl') {
    const when = p.tags.includes('new') || p.status === 'preorder' ? S.date(p.released) : String(p.originalYear);
    info = [p.format, p.editionNote || (p.edition !== 'Standard' ? p.edition : ''), p.label, when].filter(Boolean).map(esc).join(' · ');
    if (p.condition === 'Used') extra += `<div class="grade">
        <div><b>${p.grade[0]}</b><span>Media grade</span></div><div><b>${p.grade[1]}</b><span>Sleeve grade</span></div>
        <p>Played through and checked by our team, then cleaned and shipped in a new anti-static inner sleeve. <a href="help.html#grading">How we grade</a></p></div>`;
    const tracks = p.tracks.length
      ? `<ol class="tracklist">${p.tracks.map(t => `<li><b>${esc(t[0])}</b><span>${esc(t[1])}</span><span>${t[2]}</span></li>`).join('')}</ol>`
      : `<p>${p.trackCount} tracks across ${p.media.length} records. The full tracklist is on <a href="https://musicbrainz.org/release/${p.mb}" rel="noopener">MusicBrainz</a>.</p>`;
    accs = `
      <details class="acc" open><summary>Tracklist</summary><div class="acc__body">${tracks}</div></details>
      <details class="acc"><summary>Details</summary><div class="acc__body"><table class="specs">
        <tr><th>Artist</th><td>${esc(p.artist)}</td></tr><tr><th>Genre</th><td>${esc(p.genre)}</td></tr>
        ${p.label ? `<tr><th>Label</th><td>${esc(p.label)}</td></tr>` : ''}${p.catno ? `<tr><th>Catalogue no.</th><td>${esc(p.catno)}</td></tr>` : ''}
        <tr><th>${p.tags.includes('new') || p.status === 'preorder' ? 'Release date' : 'First released'}</th><td>${esc(when)}</td></tr>
        <tr><th>Format</th><td>${esc(p.media.join(' + '))}</td></tr>
        <tr><th>Condition</th><td>${p.condition === 'Used' ? `Used · media ${p.grade[0]}, sleeve ${p.grade[1]}` : 'New, sealed'}</td></tr>
      </table><p style="margin-top:14px;font-size:13px">Release data from <a href="https://musicbrainz.org/release/${p.mb}" rel="noopener">MusicBrainz</a>. Cover image from the <a href="https://coverartarchive.org/" rel="noopener">Cover Art Archive</a>.</p></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  } else if (p.type === 'player') {
    media += credit(p.credit);
    info = esc(p.condition === 'New' ? 'New · full manufacturer warranty' : `${p.condition} · tested and serviced by our team · 6-month Uncovered warranty`);
    const pre = p.specs.find(s => s[0] === 'Phono preamp');
    extra = `<p class="notice">${pre && /Not/.test(pre[1])
      ? 'No built-in preamp: pair it with a phono stage and an amplifier, or a receiver with a phono input.'
      : 'Built-in preamp: plug it straight into powered speakers.'} <a href="journal/do-you-need-speakers-for-a-turntable.html">Do you need speakers for a turntable?</a></p>`;
    accs = `
      <details class="acc" open><summary>Why we like it</summary><div class="acc__body"><ul class="ticks">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
      <details class="acc"><summary>Key specifications</summary><div class="acc__body"><table class="specs">${p.specs.map(s => `<tr><th>${esc(s[0])}</th><td>${esc(s[1])}</td></tr>`).join('')}</table>
        <p style="margin-top:14px;font-size:13px">Full specifications on the <a href="${p.maker}" rel="noopener">${esc(p.artist)} website</a>.</p></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  } else {
    media += credit(p.credit);
    const players = p.players.map(D.get);
    const records = D.albums.filter(a => a.status !== 'preorder' && a.format !== 'Box set' && a.format !== '7"').sort((a, b) => a.artist.localeCompare(b.artist));
    const defaults = ['miles-davis-kind-of-blue', 'air-moon-safari', 'fleetwood-mac-rumours'];
    extra = `<div class="picks" id="picks">
        <label class="flabel" for="pick-player">Your record player</label>
        <div class="picks__row"><div class="picks__thumb" data-thumb="player"></div><select class="select" id="pick-player">${players.map(x => `<option value="${x.id}">${esc(x.artist)} ${esc(x.title)} (${esc(x.condition)}) · ${money(x.price)}</option>`).join('')}</select></div>
        <span class="flabel" style="margin-top:14px">Your three records</span>
        ${[0, 1, 2].map(i => `<div class="picks__row"><div class="picks__thumb" data-thumb="${i}"></div><div><label class="sr-only" for="pick-${i}">Record ${i + 1}</label>
          <select class="select" id="pick-${i}" data-pick>${records.map(a => `<option value="${a.id}"${a.id === defaults[i] ? ' selected' : ''}>${esc(a.artist)} — ${esc(a.title)}${a.condition === 'Used' ? ' (used)' : ''} · ${money(a.price)}</option>`).join('')}</select></div></div>`).join('')}
      </div>`;
    accs = `
      <details class="acc" open><summary>How the pack works</summary><div class="acc__body"><ul class="ticks">
        <li>Choose any of our entry turntables</li><li>Add three records from the shop</li><li>10% off the total, applied automatically</li><li>Free delivery</li></ul></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  }

  const buyBtn = p.type === 'pack'
    ? `<button class="btn" type="button" id="add-pack">Add pack to cart</button>`
    : `<button class="btn" type="button" data-add="${p.id}" data-qty-from="#qty">${p.status === 'preorder' ? 'Preorder' : 'Add to cart'} · ${money(p.price)}</button>`;
  const max = p.stock || 20;

  root.innerHTML = `
    <div class="product__media">${media}</div>
    <div class="product__info">
      <p class="pcard__artist">${p.type === 'vinyl' ? `<a href="shop.html?artist=${encodeURIComponent(p.artist)}">${esc(p.artist)}</a> · ${esc(p.genre)}` : p.type === 'pack' ? 'Pack offer' : `${esc(p.artist)} · Record player`}</p>
      <h1 class="product__title">${esc(p.title)}</h1>
      <div class="product__price">${p.type === 'pack' ? '<span class="price" id="pack-price"></span>' : S.priceHTML(p)}<span class="stock stock--${st.cls}">${st.text}</span></div>
      <p class="format">${info}</p>
      <p class="lead">${esc(p.blurb)}</p>
      ${extra}
      <div class="buy"${p.type === 'pack' ? ' style="grid-template-columns:1fr"' : ''}>
        ${p.type === 'pack' ? '' : `<div class="qty"><button type="button" data-delta="-1" aria-label="Decrease quantity">−</button><input id="qty" type="number" min="1" max="${max}" value="1" aria-label="Quantity"><button type="button" data-delta="1" aria-label="Increase quantity">+</button></div>`}
        ${buyBtn}
      </div>
      ${p.type === 'vinyl' ? `<div class="buy-row" style="margin-bottom:14px"><button class="btn btn--ghost btn--sm" type="button" id="listen">Listen to an extract</button></div>
        <div class="player" id="player" hidden style="margin:-4px 0 18px"><span data-now></span><span class="player__bar"><span></span></span></div>` : ''}
      <div class="assure"><span>Free delivery over ${money(S.FREE_SHIPPING)}</span><span>30-day returns</span><span>Ships in an Uncovered sleeve</span></div>
      ${accs}
    </div>`;

  /* ---- Interactions ---- */
  const qty = $('#qty');
  $$('.buy .qty button').forEach(btn => btn.addEventListener('click', () => {
    qty.value = Math.max(1, Math.min(max, (parseInt(qty.value, 10) || 1) + Number(btn.dataset.delta)));
  }));
  const listen = $('#listen');
  if (listen) listen.addEventListener('click', e => window.LISTEN.toggle(p, e.currentTarget, $('#player')));

  if (p.type === 'pack') {
    const picks = () => $$('[data-pick]').map(s => s.value);
    const total = () => {
      const sum = D.get($('#pick-player').value).price + picks().reduce((n, x) => n + D.get(x).price, 0);
      return { sum, price: Math.round(sum * (1 - p.discount) * 100) / 100 };
    };
    const draw = () => {
      $('[data-thumb="player"]').innerHTML = A.img(D.get($('#pick-player').value), { decorative: true });
      picks().forEach((x, i) => { $(`[data-thumb="${i}"]`).innerHTML = A.img(D.get(x), { decorative: true }); });
      const t = total();
      $('#pack-price').innerHTML = `<s>${money(t.sum)}</s>${money(t.price)}`;
    };
    $('#picks').addEventListener('change', draw);
    draw();
    $('#add-pack').addEventListener('click', e => {
      S.Cart.add(p.id, 1, { player: $('#pick-player').value, picks: picks(), price: total().price });
      e.currentTarget.classList.add('is-added');
      document.querySelector('[data-cart-open]').click();
    });
  }

  /* ---- Related ---- */
  const pool = D.all.filter(x => x.id !== p.id && x.type === (p.type === 'pack' ? 'player' : p.type));
  const same = pool.filter(x => x.genre === p.genre || (p.type === 'player'));
  const related = [...same, ...pool].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 4);
  $('#related').innerHTML = related.map(x => S.card(x)).join('');
  S.observeNew($('#related'));

  /* ---- Structured data & analytics ---- */
  const url = `https://uncovered.store/product.html?id=${p.id}`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.type === 'vinyl' ? `${p.artist} – ${p.title}` : `${p.artist} ${p.title}`,
    description: p.blurb, sku: p.id, image: `https://uncovered.store/${p.img}`, url,
    brand: { '@type': 'Brand', name: p.type === 'vinyl' ? (p.label || p.artist) : p.artist },
    itemCondition: p.condition === 'New' || p.type === 'pack' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    offers: { '@type': 'Offer', priceCurrency: 'EUR', price: p.price ? p.price.toFixed(2) : undefined, url,
      availability: p.status === 'preorder' ? 'https://schema.org/PreOrder' : p.status === 'low' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock' }
  };
  if (p.type === 'vinyl') { ld['@type'] = ['Product', 'MusicAlbum']; ld.byArtist = { '@type': 'MusicGroup', name: p.artist }; ld.genre = p.genre; ld.numTracks = p.trackCount; }
  if (p.type === 'pack') delete ld.offers.price;
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld); document.head.append(s);
  const canon = document.createElement('link'); canon.rel = 'canonical'; canon.href = url; document.head.append(canon);
  S.track('view_item', { currency: 'EUR', value: p.price, items: [{ item_id: p.id, item_name: p.title }] });
})();
