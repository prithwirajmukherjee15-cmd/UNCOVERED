/* Uncovered — cart and checkout (demo: no payment is taken). */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc, money = S.money, Cart = S.Cart;
  const PROMOS = { UNCOVERED10: 0.1 }; // demo code
  const order = { step: 'cart', promo: S.store.get('uncovered.promo', '') };
  const STEPS = ['cart', 'delivery', 'payment', 'done'];

  function totals() {
    const sub = Cart.subtotal();
    const rate = PROMOS[order.promo] || 0;
    const discount = Math.round(sub * rate * 100) / 100;
    const method = ($('input[name="ship"]:checked') || {}).value || 'standard';
    const hasPack = Cart.items().some(i => D.get(i.id).type === 'pack');
    let ship = method === 'express' ? 9.9 : 4.9;
    if (method === 'standard' && (sub - discount >= S.FREE_SHIPPING || hasPack)) ship = 0;
    return { sub, discount, ship, total: Math.max(0, sub - discount + ship), method };
  }

  function renderLines() {
    const items = Cart.items();
    $('#cart-lines').innerHTML = items.length ? items.map(i => {
      const p = D.get(i.id);
      return `<li class="line">
        <a href="product.html?id=${p.id}" tabindex="-1" aria-hidden="true">${S.thumb(p)}</a>
        <div class="line__info"><a href="product.html?id=${p.id}">${esc(p.title)}</a><small>${esc(S.lineLabel(i))}${p.status === 'preorder' ? ` · ${S.statusInfo(p).text}` : ''}</small>
          <div class="qty" data-key="${esc(i.key)}"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>
        </div>
        <div class="line__price">${money(S.linePrice(i) * i.qty)}<button type="button" class="link" data-remove-line="${esc(i.key)}">Remove</button></div>
      </li>`;
    }).join('') : `<li class="empty" style="padding:40px 0"><p class="lead">Your cart is empty. Plenty of records waiting, though.</p><a class="btn" href="shop.html">Browse the shop</a></li>`;
    $('#to-delivery').disabled = !items.length;
    renderSummary();
  }

  function renderSummary() {
    const t = totals();
    $('#sum-lines').innerHTML = Cart.items().map(i => {
      const p = D.get(i.id);
      return `<li><span>${i.qty} × ${esc(p.title)}</span><span>${money(S.linePrice(i) * i.qty)}</span></li>`;
    }).join('');
    $('#sum-totals').innerHTML = `
      <li><span>Subtotal</span><span>${money(t.sub)}</span></li>
      ${t.discount ? `<li><span>Promo ${esc(order.promo)}</span><span>−${money(t.discount)}</span></li>` : ''}
      <li><span>Delivery</span><span>${t.ship ? money(t.ship) : 'Free'}</span></li>`;
    $('#sum-total').textContent = money(t.total);
    const free = t.sub - t.discount >= S.FREE_SHIPPING;
    $('#ship-standard').textContent = free ? 'Free' : '€4.90';
  }

  function go(step) {
    if (step !== 'cart' && !Cart.items().length) step = 'cart';
    order.step = step;
    $$('[data-step-panel]').forEach(p => { p.hidden = p.dataset.stepPanel !== step; });
    const idx = STEPS.indexOf(step);
    $$('#stepper li').forEach((li, i) => {
      li.classList.toggle('is-current', i === idx);
      li.classList.toggle('is-done', i < idx);
      if (i === idx) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    const panel = $(`[data-step-panel="${step}"]`);
    if (panel) { const h = $('h1, h2', panel); h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: S.reduced ? 'auto' : 'smooth' });
    if (step === 'delivery') S.track('begin_checkout', { currency: 'EUR', value: totals().total });
  }

  function validate(form, msgEl) {
    const bad = [...form.querySelectorAll('input, select')].filter(i => !i.checkValidity());
    if (bad.length) {
      msgEl.textContent = 'Please check the highlighted fields.';
      bad.forEach(i => i.setAttribute('aria-invalid', 'true'));
      bad[0].focus();
      return false;
    }
    form.querySelectorAll('[aria-invalid]').forEach(i => i.removeAttribute('aria-invalid'));
    msgEl.textContent = '';
    return true;
  }

  function complete() {
    const t = totals();
    const items = Cart.items();
    const num = 'UNC-' + Date.now().toString(36).toUpperCase().slice(-6);
    const preorders = items.filter(i => D.get(i.id).status === 'preorder');
    S.track('purchase', {
      transaction_id: num, currency: 'EUR', value: t.total, shipping: t.ship,
      items: items.map(i => ({ item_id: i.id, item_name: D.get(i.id).title, quantity: i.qty, price: S.linePrice(i) }))
    });
    const name = $('#fname').value.trim();
    $('#checkout').hidden = true;
    $$('#stepper li').forEach(li => { li.classList.add('is-done'); li.classList.remove('is-current'); });
    $('#stepper li:last-child').classList.add('is-current');
    const c = $('#confirm');
    c.hidden = false;
    c.innerHTML = `
      <div class="confirm__cover">${A.img(D.get(items[0].id), { decorative: true })}</div>
      <p class="eyebrow">Order ${num}</p>
      <h1 class="h-display">Thank you${name ? ', ' + esc(name) : ''}. <em>It's on its way.</em></h1>
      <p class="lead">A confirmation is on its way to ${esc($('#email').value)}. Total paid: <strong>${money(t.total)}</strong>.${preorders.length ? ' Pre-ordered items ship on release day.' : ''}</p>
      <p class="lead">Every record ships in an Uncovered outer sleeve. Tap it with your phone when it arrives to open the record's page: tracklist, credits and where to listen.</p>
      <div class="buy-row" style="justify-content:center;margin-top:30px">
        <a class="btn" href="how-it-works.html">How the sleeve works</a>
        <a class="btn btn--ghost" href="shop.html">Back to the shop</a>
      </div>`;
    Cart.clear();
    S.store.set('uncovered.promo', '');
    window.scrollTo(0, 0);
  }

  // Events
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) { go(g.dataset.go); return; }
    const q = e.target.closest('#cart-lines .qty button');
    if (q) { const key = q.parentElement.dataset.key; const it = Cart.items().find(i => i.key === key); if (it) Cart.setQty(key, it.qty + Number(q.dataset.q)); return; }
    const rm = e.target.closest('[data-remove-line]');
    if (rm) Cart.remove(rm.dataset.removeLine);
  });
  $('#to-payment').addEventListener('click', () => { if (validate($('#f-delivery'), $('#delivery-msg'))) go('payment'); });
  $('#pay').addEventListener('click', () => {
    if (!validate($('#f-payment'), $('#payment-msg'))) return;
    const btn = $('#pay'); btn.textContent = 'Processing…'; btn.setAttribute('disabled', '');
    setTimeout(complete, 900);
  });
  $('#f-delivery').addEventListener('change', renderSummary);
  $('#promo').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#promo-code').value.trim().toUpperCase();
    if (PROMOS[code]) { order.promo = code; S.store.set('uncovered.promo', code); $('#promo-code').value = ''; }
    else { $('#promo-code').value = ''; $('#promo-code').placeholder = 'Code not recognised'; }
    renderSummary();
  });
  document.addEventListener('cart:change', renderLines);

  renderLines();
  go(location.hash === '#delivery' && Cart.items().length ? 'delivery' : 'cart');
})();
