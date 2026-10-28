/* Uncovered — product page for records, record players and packs. */
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

  const catKey = p.type === 'vinyl' ? 'vinyl' : p.type === 'player' ? 'players' : 'packs';
  $('#crumbs').insertAdjacentHTML('beforeend', `<li><a href="shop.html?cat=${catKey}">${D.categories[catKey].label}</a></li><li aria-current="page">${esc(p.title)}</li>`);
  document.title = `${p.title}${p.type === 'vinyl' ? ' — ' + p.artist + ' (Vinyl LP)' : ''} — Uncovered`;
  document.querySelector('meta[name="description"]').setAttribute('content', p.blurb);

  const st = S.statusInfo(p);
  const b = S.badgeFor(p);
  const ship = `<div class="acc__body"><p>Free delivery on orders over ${money(S.FREE_SHIPPING)}; otherwise €4.90. Records are shipped in rigid mailers with corner protection.</p><p>Changed your mind? Return unopened items within 30 days. <a href="help.html#returns">Read our returns policy</a>.</p></div>`;

  /* ---- Media ---- */
  let media;
  if (p.type === 'vinyl') {
    media = `<div class="product__visual">${A.sleeve(p, { cls: 'is-out' })}${b ? `<span class="badge badge--${b.cls}">${b.text}</span>` : ''}</div>
      <p class="media-hint"><button class="btn btn--ghost" type="button" id="spin">Spin it</button> Connected sleeve · tap to unlock the album hub</p>`;
  } else if (p.type === 'player') {
    media = `<div class="product__visual product__visual--player">${A.turntable(p.art)}${b ? `<span class="badge badge--${b.cls}">${b.text}</span>` : ''}</div>
      <p class="media-hint"><button class="btn btn--ghost" type="button" id="play">Drop the needle</button> Finish: ${esc(p.finish)}</p>`;
  } else {
    media = `<div class="product__visual product__visual--pack" id="pack-vis">${A.packVisual(p)}${b ? `<span class="badge badge--${b.cls}">${b.text}</span>` : ''}</div>`;
  }

  /* ---- Info ---- */
  let format = '', extra = '', accs = '', picks = '';
  if (p.type === 'vinyl') {
    format = `LP · 180g vinyl · 33⅓ RPM · ${esc(p.label)} · ${p.year}`;
    const x = p.extras;
    extra = `<div class="extras">
      <div class="extras__head"><h2>Inside the connected sleeve</h2><a class="link-arrow" href="album.html?id=${p.id}">Preview</a></div>
      <ul>
        <li><b>Album story</b><span>How ${esc(p.title)} was made, told by the people who made it.</span></li>
        <li><b>Interview</b><span>${x.interview.length} questions with ${esc(p.artist)}.</span></li>
        <li><b>${x.lyrics.length ? 'Lyrics' : 'Liner notes'}</b><span>${x.lyrics.length ? 'Words to the songs, track by track.' : 'An instrumental record: credits and notes instead.'}</span></li>
        <li><b>Live session</b><span>Filmed at ${esc(x.live.venue)}, ${esc(x.live.city)}.</span></li>
      </ul></div>`;
    accs = `
      <details class="acc" open><summary>Tracklist</summary><div class="acc__body"><ol class="tracklist">${p.tracks.map(t => `<li><b>${t[0]}</b><span>${esc(t[1])}</span><span>${t[2]}</span></li>`).join('')}</ol></div></details>
      <details class="acc"><summary>Details</summary><div class="acc__body"><table class="specs">
        <tr><th>Artist</th><td>${esc(p.artist)}</td></tr><tr><th>Genre</th><td>${esc(p.genre)}</td></tr>
        <tr><th>Label</th><td>${esc(p.label)}</td></tr><tr><th>Release date</th><td>${S.date(p.released)}</td></tr>
        <tr><th>Format</th><td>12" LP, 180g, 33⅓ RPM, connected NFC sleeve</td></tr>${p.liner ? `<tr><th>Credits</th><td>${esc(p.liner)}</td></tr>` : ''}
      </table></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  } else if (p.type === 'player') {
    const pre = p.specs.find(s => s[0] === 'Phono preamp');
    const needsPreamp = pre && /not/i.test(pre[1]);
    format = `${esc(p.specs[0][1])} · ${esc(p.specs[1][1])}`;
    extra = `<p class="notice">${needsPreamp
      ? 'No built-in preamp: pair it with a phono stage and an amplifier, or a receiver with a phono input.'
      : 'Built-in preamp: plug it straight into powered speakers.'} <a href="journal/do-you-need-speakers-for-a-turntable.html">Do you need speakers for a turntable?</a></p>`;
    accs = `
      <details class="acc" open><summary>Why you'll like it</summary><div class="acc__body"><ul class="ticks" style="margin:0">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
      <details class="acc"><summary>Specifications</summary><div class="acc__body"><table class="specs">${p.specs.map(s => `<tr><th>${esc(s[0])}</th><td>${esc(s[1])}</td></tr>`).join('')}</table></div></details>
      <details class="acc"><summary>In the box</summary><div class="acc__body"><ul class="ticks" style="margin:0">${p.box.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  } else {
    const player = D.get(p.includes);
    format = `${esc(player.title)} + ${p.choose} records · save ${money(p.oldPrice - p.price)}`;
    const options = D.albums.map(a => `<option value="${a.id}">${esc(a.artist)} — ${esc(a.title)}${a.status === 'preorder' ? ' (pre-order)' : ''}</option>`).join('');
    const defaults = ['velvet-static', 'saint-ouen-sessions', 'low-tide-hymns', 'midnight-ledger', 'pale-machines'];
    picks = `<div class="picks" id="picks"><p class="pcard__artist" style="font-size:13px">Choose your ${p.choose} records</p>${Array.from({ length: p.choose }, (_, i) => `
      <div class="picks__row"><div class="picks__thumb" data-pick-thumb="${i}"></div>
        <div><label class="sr-only" for="pick-${i}">Record ${i + 1}</label><select class="select" id="pick-${i}" data-pick="${i}">${options.replace(`value="${defaults[i]}"`, `value="${defaults[i]}" selected`)}</select></div></div>`).join('')}</div>`;
    accs = `
      <details class="acc" open><summary>What's included</summary><div class="acc__body"><ul class="ticks" style="margin:0">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}${p.extras.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div></details>
      <details class="acc"><summary>About the ${esc(player.title)}</summary><div class="acc__body"><p>${esc(player.blurb)}</p><a class="link-arrow" href="product.html?id=${player.id}">Turntable details</a></div></details>
      <details class="acc"><summary>Delivery &amp; returns</summary>${ship}</details>`;
  }

  const buyBtn = p.type === 'pack'
    ? `<button class="btn" type="button" id="add-pack">Add pack to cart · ${money(p.price)}</button>`
    : `<button class="btn" type="button" data-add="${p.id}" data-qty-from="#qty">${p.status === 'preorder' ? 'Pre-order' : 'Add to cart'} · ${money(p.price)}</button>`;

  root.innerHTML = `
    <div class="product__media">${media}</div>
    <div class="product__info">
      <p class="pcard__artist">${p.type === 'vinyl' ? `<a href="shop.html?artist=${encodeURIComponent(p.artist)}">${esc(p.artist)}</a> · ${esc(p.genre)}` : p.type === 'pack' ? 'Pack offer' : 'Record player'}</p>
      <h1 class="product__title">${esc(p.title)}</h1>
      <div class="product__price">${S.priceHTML(p)}<span class="stock stock--${st.cls}">${st.text}</span></div>
      <p class="format">${format}</p>
      <p class="lead">${esc(p.blurb)}</p>
      ${picks}
      <div class="buy">
        ${p.type === 'pack' ? '<span></span>' : `<div class="qty"><button type="button" data-delta="-1" aria-label="Decrease quantity">−</button><input id="qty" type="number" min="1" max="20" value="1" aria-label="Quantity"><button type="button" data-delta="1" aria-label="Increase quantity">+</button></div>`}
        ${buyBtn}
      </div>
      <div class="assure"><span>Free delivery over ${money(S.FREE_SHIPPING)}</span><span>30-day returns</span><span>Secure checkout</span></div>
      ${extra}
      ${accs}
    </div>`;
  if (p.type === 'pack') $('.buy').style.gridTemplateColumns = '1fr';

  /* ---- Interactions ---- */
  const qty = $('#qty');
  $$('.buy .qty button').forEach(btn => btn.addEventListener('click', () => {
    qty.value = Math.max(1, Math.min(20, (parseInt(qty.value, 10) || 1) + Number(btn.dataset.delta)));
  }));
  const spin = $('#spin');
  if (spin) spin.addEventListener('click', () => {
    const d = $('.sleeve .disc');
    d.classList.toggle('is-spinning');
    spin.textContent = d.classList.contains('is-spinning') ? 'Stop' : 'Spin it';
  });
  const play = $('#play');
  if (play) play.addEventListener('click', () => {
    const tt = $('.product__visual .tt');
    tt.classList.toggle('is-playing');
    play.textContent = tt.classList.contains('is-playing') ? 'Lift the needle' : 'Drop the needle';
  });
  if (p.type === 'pack') {
    const current = () => $$('[data-pick]').map(s => s.value);
    const drawPicks = () => {
      $$('[data-pick-thumb]').forEach((el, i) => { el.innerHTML = A.cover(D.get(current()[i]), { text: false }); });
      const vis = $('#pack-vis');
      const badge = vis.querySelector('.badge');
      vis.innerHTML = A.packVisual(p, current()) + (badge ? badge.outerHTML : '');
    };
    $('#picks').addEventListener('change', drawPicks);
    drawPicks();
    $('#add-pack').addEventListener('click', e => {
      S.Cart.add(p.id, 1, { picks: current() });
      e.currentTarget.classList.add('is-added');
      document.querySelector('[data-cart-open]').click();
    });
  }

  /* ---- Related ---- */
  let related = D.all.filter(x => x.id !== p.id && x.type === p.type && (p.type !== 'vinyl' || x.genre === p.genre));
  const fill = D.all.filter(x => x.id !== p.id && !related.includes(x) && (p.type === 'vinyl' ? x.type === 'vinyl' : true));
  related = [...related, ...fill.filter(x => x.tags.includes('bestseller')), ...fill].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 4);
  $('#related').innerHTML = related.map(S.card).join('');

  /* ---- Structured data & analytics ---- */
  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.title, description: p.blurb, sku: p.id,
    brand: { '@type': 'Brand', name: p.type === 'vinyl' ? p.label : 'Uncovered' },
    url: `https://uncovered.store/product.html?id=${p.id}`,
    offers: {
      '@type': 'Offer', priceCurrency: 'EUR', price: p.price.toFixed(2), url: `https://uncovered.store/product.html?id=${p.id}`,
      availability: p.status === 'preorder' ? 'https://schema.org/PreOrder' : p.status === 'low' ? 'https://schema.org/LimitedAvailability' : 'https://schema.org/InStock'
    }
  };
  if (p.type === 'vinyl') { ld['@type'] = ['Product', 'MusicAlbum']; ld.byArtist = { '@type': 'MusicGroup', name: p.artist }; ld.genre = p.genre; ld.numTracks = p.tracks.length; }
  const s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(ld);
  document.head.append(s);
  const canon = document.createElement('link'); canon.rel = 'canonical'; canon.href = ld.url; document.head.append(canon);
  S.track('view_item', { currency: 'EUR', value: p.price, items: [{ item_id: p.id, item_name: p.title }] });
})();
