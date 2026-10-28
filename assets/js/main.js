/* Uncovered — shared site shell: header, menu, cart, footer, scroll effects. */
(function () {
  const D = window.UNCOVERED, A = window.ART, esc = A.esc;
  const body = document.body;
  const ROOT = body.dataset.root || '';
  const u = path => ROOT + path;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
  const money = n => fmt.format(n);
  const date = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const FREE_SHIPPING = 60;

  /* ---------- Analytics hook ----------
     Events land in window.dataLayer, ready for Google Tag Manager / GA4.
     Key events tie back to the blueprint's success measures:
     purchase, nfc_access (content opened from a sleeve), hub_repeat_visit. */
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => window.dataLayer.push({ event, ...params });

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };

  /* ---------- Cart ---------- */
  const Cart = {
    key: 'uncovered.cart',
    items() { return store.get(this.key, []).filter(i => D.get(i.id)); },
    save(items) { store.set(this.key, items); document.dispatchEvent(new CustomEvent('cart:change')); },
    add(id, qty = 1, opts) {
      const p = D.get(id); if (!p) return;
      const items = this.items();
      const key = id + (opts ? ':' + JSON.stringify(opts) : '');
      const found = items.find(i => i.key === key);
      if (found) found.qty = Math.min(20, found.qty + qty); else items.push({ key, id, qty, opts });
      this.save(items);
      track('add_to_cart', { currency: 'EUR', value: p.price * qty, items: [{ item_id: id, item_name: p.title, quantity: qty }] });
    },
    setQty(key, q) {
      let items = this.items();
      const it = items.find(i => i.key === key); if (!it) return;
      it.qty = Math.max(0, Math.min(20, q));
      this.save(items.filter(i => i.qty > 0));
    },
    remove(key) { this.save(this.items().filter(i => i.key !== key)); },
    clear() { this.save([]); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items().reduce((n, i) => n + D.get(i.id).price * i.qty, 0); }
  };

  /* ---------- Shared bits of markup ---------- */
  function statusInfo(p) {
    if (p.status === 'preorder') return { cls: 'pre', text: `Pre-order · ships ${date(p.released)}` };
    if (p.status === 'low') return { cls: 'low', text: `Only ${p.stock} left` };
    return { cls: 'ok', text: 'In stock · ships within 24h' };
  }
  function badgeFor(p) {
    if (p.status === 'preorder') return { cls: 'pre', text: 'Pre-order' };
    if (p.oldPrice) return { cls: 'sale', text: `−${Math.round((1 - p.price / p.oldPrice) * 100)}%` };
    if (p.tags.includes('bestseller')) return { cls: 'best', text: 'Best-seller' };
    if (p.tags.includes('new')) return { cls: 'new', text: 'New' };
    return null;
  }
  const priceHTML = p => `<span class="price">${p.oldPrice ? `<s>${money(p.oldPrice)}</s> ` : ''}${money(p.price)}</span>`;

  function card(p) {
    const href = u(`product.html?id=${p.id}`);
    const b = badgeFor(p);
    const sub = p.type === 'vinyl' ? p.artist : p.type === 'pack' ? 'Pack offer' : `Record player · ${p.finish}`;
    return `<article class="pcard pcard--${p.type}" data-reveal>
      <a class="pcard__media" href="${href}" tabindex="-1" aria-hidden="true">${A.visual(p)}${b ? `<span class="badge badge--${b.cls}">${b.text}</span>` : ''}</a>
      <div class="pcard__meta">
        <p class="pcard__artist">${esc(sub)}</p>
        <h3 class="pcard__title"><a href="${href}">${esc(p.title)}</a></h3>
        <div class="pcard__row">${priceHTML(p)}
          <button class="pcard__add" type="button" data-add="${p.id}" aria-label="${p.type === 'pack' ? 'Build' : 'Add'} ${esc(p.title)}${p.type === 'pack' ? '' : ' to cart'}">${p.type === 'pack' ? 'Build' : p.status === 'preorder' ? 'Pre-order' : 'Add'}<span aria-hidden="true">+</span></button>
        </div>
      </div>
    </article>`;
  }

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.6"/></svg>',
    phones: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 19v-3a10 10 0 0 1 20 0v3" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="4" y="18" width="6" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="22" y="18" width="6" height="9" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
  };

  const NAV = [['Shop', 'shop.html', 'shop'], ['How it works', 'how-it-works.html', 'how'], ['Journal', 'journal/index.html', 'journal'], ['Help', 'help.html', 'help']];
  const CATS = Object.entries(D.categories).filter(([k]) => k !== 'packs');

  function buildShell() {
    const page = body.dataset.page;
    const topbar = document.createElement('header');
    topbar.className = 'topbar';
    topbar.innerHTML = `
      <div class="topbar__l">
        <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
        <a class="topbar__mark" href="${u('index.html')}" aria-label="Uncovered home">UNCOVERED</a>
      </div>
      <nav class="topbar__nav" aria-label="Main">
        ${NAV.map(([t, h, k]) => `<a href="${u(h)}"${page === k ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      </nav>
      <div class="topbar__r">
        <a class="icon-btn" href="${u('shop.html?focus=search')}" aria-label="Search the shop">${ICON.search}</a>
        <button class="icon-btn cart-btn" type="button" data-cart-open aria-label="Open cart">${ICON.bag}<span class="cart-count" data-cart-count>0</span></button>
      </div>`;
    body.prepend(topbar);

    const sound = document.createElement('button');
    sound.className = 'sound-toggle';
    sound.type = 'button';
    sound.setAttribute('aria-pressed', 'false');
    sound.setAttribute('aria-label', 'Play vinyl crackle ambience');
    sound.title = 'Vinyl crackle on/off';
    sound.innerHTML = ICON.phones;
    body.prepend(sound);

    const frame = document.createElement('div');
    frame.className = 'frame';
    frame.setAttribute('aria-hidden', 'true');
    body.prepend(frame);

    const menu = document.createElement('div');
    menu.className = 'menu'; menu.id = 'menu'; menu.hidden = true;
    menu.innerHTML = `<nav class="menu__inner" aria-label="Mobile">
        <ul class="menu__main">${NAV.map(([t, h]) => `<li><a href="${u(h)}">${t}</a></li>`).join('')}</ul>
        <ul class="menu__cats">${CATS.map(([k, c]) => `<li><a href="${u('shop.html?cat=' + k)}">${c.label}</a></li>`).join('')}</ul>
        <p class="menu__foot">Free delivery over ${money(FREE_SHIPPING)} · <a href="mailto:hello@uncovered.store">hello@uncovered.store</a></p>
      </nav>`;
    body.append(menu);

    const drawer = document.createElement('div');
    drawer.className = 'drawer'; drawer.id = 'drawer'; drawer.hidden = true;
    drawer.innerHTML = `<div class="drawer__scrim" data-drawer-close></div>
      <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header class="drawer__head"><h2 id="drawer-title">Your cart <sup data-cart-count>0</sup></h2>
          <button class="icon-btn" type="button" data-drawer-close aria-label="Close cart">✕</button></header>
        <div class="drawer__ship"></div>
        <ul class="drawer__items"></ul>
        <footer class="drawer__foot">
          <div class="drawer__sub"><span>Subtotal</span><strong data-subtotal></strong></div>
          <a class="btn btn--block" href="${u('cart.html')}">Checkout</a>
          <button class="btn btn--ghost btn--block" type="button" data-drawer-close>Keep browsing</button>
        </footer>
      </aside>`;
    body.append(drawer);

    const foot = $('#site-footer');
    if (foot) foot.outerHTML = footerHTML();
  }

  function footerHTML() {
    return `<footer class="footer">
      <div class="footer__news" data-reveal>
        <div>
          <p class="eyebrow">Newsletter</p>
          <h2 class="h-display">Are you on <em>the list?</em></h2>
          <p class="muted">New releases, pre-orders and the monthly Reco, before anyone else. One email a month.</p>
        </div>
        <form class="news-form" novalidate>
          <label class="sr-only" for="news-email">Email address</label>
          <input id="news-email" type="email" name="email" placeholder="you@email.com" autocomplete="email" required>
          <button class="btn" type="submit">Sign me up</button>
          <p class="news-form__msg" role="status"></p>
        </form>
      </div>
      <div class="footer__cols">
        <div><h3>Shop</h3><ul>${CATS.map(([k, c]) => `<li><a href="${u('shop.html?cat=' + k)}">${c.label}</a></li>`).join('')}<li><a href="${u('shop.html?cat=packs')}">Packs</a></li></ul></div>
        <div><h3>Uncovered</h3><ul>
          <li><a href="${u('index.html#concept')}">Our concept</a></li>
          <li><a href="${u('how-it-works.html')}">How it works</a></li>
          <li><a href="${u('index.html#reco')}">Current Reco</a></li>
          <li><a href="${u('journal/index.html')}">Journal</a></li></ul></div>
        <div><h3>Help</h3><ul>
          <li><a href="${u('help.html#delivery')}">Delivery</a></li>
          <li><a href="${u('help.html#returns')}">Returns</a></li>
          <li><a href="${u('help.html#nfc')}">NFC troubleshooting</a></li>
          <li><a href="${u('help.html#faq')}">FAQ</a></li>
          <li><a href="${u('help.html#contact')}">Contact us</a></li></ul></div>
        <div><h3>Say hello</h3><ul>
          <li><a href="mailto:hello@uncovered.store">hello@uncovered.store</a></li>
          <li><a href="https://instagram.com/" rel="noopener">Instagram</a></li>
          <li><a href="https://youtube.com/" rel="noopener">YouTube</a></li></ul></div>
      </div>
      <div class="footer__mark" aria-hidden="true">UNCOVERED</div>
      <div class="footer__legal"><span>© ${new Date().getFullYear()} Uncovered · uncovered.store</span><span>Prices include VAT · Secure checkout</span></div>
    </footer>`;
  }

  /* ---------- Drawer & menu ---------- */
  let lenis = null;
  let lastFocus = null;
  function lockScroll(on) {
    document.documentElement.classList.toggle('is-locked', on);
    if (lenis) on ? lenis.stop() : lenis.start();
  }
  function openDrawer() {
    const d = $('#drawer'); if (!d) return;
    lastFocus = document.activeElement;
    renderDrawer(); d.hidden = false;
    requestAnimationFrame(() => d.classList.add('is-open'));
    lockScroll(true);
    $('.drawer__panel [data-drawer-close]', d).focus();
  }
  function closeDrawer() {
    const d = $('#drawer'); if (!d || d.hidden) return;
    d.classList.remove('is-open'); lockScroll(false);
    setTimeout(() => { d.hidden = true; }, 400);
    if (lastFocus) lastFocus.focus();
  }
  function toggleMenu(force) {
    const m = $('#menu'), b = $('.menu-btn');
    const open = force ?? m.hidden;
    b.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
    if (open) { m.hidden = false; requestAnimationFrame(() => m.classList.add('is-open')); }
    else { m.classList.remove('is-open'); setTimeout(() => { m.hidden = true; }, 400); }
    lockScroll(open);
  }

  function shipHTML(sub) {
    const left = FREE_SHIPPING - sub;
    const pct = Math.min(100, (sub / FREE_SHIPPING) * 100);
    return `<p>${left > 0 ? `You're <strong>${money(left)}</strong> away from free delivery.` : 'Free delivery unlocked.'}</p><div class="meter"><span style="width:${pct}%"></span></div>`;
  }
  function lineLabel(i) {
    const p = D.get(i.id);
    if (i.opts && i.opts.picks) return i.opts.picks.map(id => D.get(id)?.title).filter(Boolean).join(', ');
    return p.type === 'vinyl' ? p.artist : p.type === 'player' ? p.finish : '';
  }
  function thumb(p) {
    if (p.type === 'vinyl') return `<div class="thumb">${A.cover(p, { text: false })}</div>`;
    return `<div class="thumb thumb--tt">${A.turntable(p.art)}</div>`;
  }
  function renderDrawer() {
    const d = $('#drawer'); if (!d) return;
    const items = Cart.items();
    $('.drawer__items', d).innerHTML = items.length ? items.map(i => {
      const p = D.get(i.id);
      return `<li class="line">
        ${thumb(p)}
        <div class="line__info"><a href="${u('product.html?id=' + p.id)}">${esc(p.title)}</a><small>${esc(lineLabel(i))}</small>
          <div class="qty" data-key="${esc(i.key)}"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button type="button" data-q="1" aria-label="Increase quantity">+</button></div>
        </div>
        <div class="line__price">${money(p.price * i.qty)}<button type="button" class="link" data-remove="${esc(i.key)}">Remove</button></div>
      </li>`;
    }).join('') : `<li class="empty"><p>Your cart is empty.</p><a class="btn btn--ghost" href="${u('shop.html')}">Browse the shop</a></li>`;
    $('.drawer__ship', d).innerHTML = items.length ? shipHTML(Cart.subtotal()) : '';
    $('[data-subtotal]', d).textContent = money(Cart.subtotal());
    $('.drawer__foot', d).hidden = !items.length;
  }
  function syncCount() {
    const n = Cart.count();
    $$('[data-cart-count]').forEach(el => { el.textContent = n; el.classList.toggle('is-empty', !n); });
  }

  /* ---------- Global events ---------- */
  function bindEvents() {
    document.addEventListener('click', e => {
      const add = e.target.closest('[data-add]');
      if (add) {
        const p = D.get(add.dataset.add);
        if (p && p.type === 'pack') { location.href = u(`product.html?id=${p.id}`); return; }
        const qtyInput = add.dataset.qtyFrom && $(add.dataset.qtyFrom);
        Cart.add(add.dataset.add, qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1);
        add.classList.add('is-added'); setTimeout(() => add.classList.remove('is-added'), 900);
        openDrawer(); return;
      }
      if (e.target.closest('.skip')) { e.preventDefault(); const m = $('#main'); m.setAttribute('tabindex', '-1'); m.focus(); return; }
      if (e.target.closest('[data-cart-open]')) { openDrawer(); return; }
      if (e.target.closest('[data-drawer-close]')) { closeDrawer(); return; }
      if (e.target.closest('.menu-btn')) { toggleMenu(); return; }
      const q = e.target.closest('.drawer .qty button');
      if (q) { const key = q.parentElement.dataset.key; const it = Cart.items().find(i => i.key === key); if (it) Cart.setQty(key, it.qty + Number(q.dataset.q)); return; }
      const rm = e.target.closest('.drawer [data-remove]');
      if (rm) { Cart.remove(rm.dataset.remove); return; }
      if (e.target.closest('.sound-toggle')) { toggleSound(e.target.closest('.sound-toggle')); return; }
      const a = e.target.closest('a[href*="#"]');
      if (a && lenis) {
        const url = new URL(a.href, location.href);
        if (url.pathname === location.pathname && url.hash.length > 1) {
          const t = document.getElementById(url.hash.slice(1));
          if (t) { e.preventDefault(); if (body.classList.contains('menu-open')) toggleMenu(false); lenis.scrollTo(t, { offset: -headerOffset() }); history.pushState(null, '', url.hash); }
        }
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closeDrawer(); if (body.classList.contains('menu-open')) toggleMenu(false); }
    });
    document.addEventListener('cart:change', () => { syncCount(); renderDrawer(); });
    window.addEventListener('storage', e => { if (e.key === Cart.key) { syncCount(); renderDrawer(); } });

    $$('.news-form').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('input', f), msg = $('.news-form__msg', f);
      if (!input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      msg.textContent = 'You\'re on the list. See you at the next drop.';
      input.value = '';
      track('newsletter_signup');
    }));
  }

  /* ---------- Vinyl crackle (generated, no audio file) ---------- */
  let audio = null;
  function toggleSound(btn) {
    try {
      if (!audio) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const len = ctx.sampleRate * 6, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
        let last = 0;
        for (let i = 0; i < len; i++) {
          const hiss = (Math.random() * 2 - 1) * 0.012;
          last = last * 0.86 + hiss * 0.14;
          const pop = Math.random() < 0.00035 ? (Math.random() * 2 - 1) * 0.6 : 0;
          d[i] = last * 3 + pop;
        }
        const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 4200;
        const gain = ctx.createGain(); gain.gain.value = 0;
        src.connect(lp).connect(gain).connect(ctx.destination); src.start();
        audio = { ctx, gain, on: false };
      }
      audio.on = !audio.on;
      audio.ctx.resume();
      audio.gain.gain.setTargetAtTime(audio.on ? 0.5 : 0, audio.ctx.currentTime, 0.25);
      btn.setAttribute('aria-pressed', String(audio.on));
      btn.classList.toggle('is-on', audio.on);
    } catch (e) { /* audio not supported */ }
  }

  /* ---------- Scroll engine ---------- */
  const SCENES = window.SCENES = window.SCENES || {};
  let scenes = [], parallax = [], marquees = [];
  let lastY = window.scrollY, velocity = 0, ticking = false;
  const desktop = matchMedia('(min-width: 900px)');

  function headerOffset() {
    const t = $('.topbar');
    return t ? t.getBoundingClientRect().bottom + 12 : 0;
  }

  function measure() {
    scenes = $$('[data-scene]').map(el => {
      const sticky = $('[data-sticky]', el);
      if (SCENES[el.dataset.scene] && SCENES[el.dataset.scene].measure) SCENES[el.dataset.scene].measure(el, sticky);
      return { el, sticky, top: sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0, h: sticky ? sticky.offsetHeight : innerHeight };
    });
    parallax = $$('[data-parallax]').map(el => ({ el, f: parseFloat(el.dataset.parallax) || 0.1 }));
  }

  function update() {
    ticking = false;
    const y = window.scrollY;
    velocity = y - lastY; lastY = y;
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const total = r.height - s.h;
      const p = total > 0 ? Math.min(1, Math.max(0, (s.top - r.top) / total)) : (r.top < innerHeight ? 1 : 0);
      s.el.style.setProperty('--p', p.toFixed(4));
      const steps = parseInt(s.el.dataset.steps || '0', 10);
      if (steps) {
        const i = String(Math.min(steps - 1, Math.floor(p * steps * 0.999)));
        if (s.el.dataset.step !== i) s.el.dataset.step = i;
      }
      const h = SCENES[s.el.dataset.scene];
      if (h && h.update) h.update(s.el, p);
    }
    if (!reduced) for (const { el, f } of parallax) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const off = (r.top + r.height / 2 - innerHeight / 2) * -f;
      el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    }
  }
  function requestUpdate() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  function runMarquees() {
    marquees = $$('[data-marquee]').map(el => {
      const track = $('.marquee__track', el);
      track.innerHTML += track.innerHTML; // seamless loop
      return { el, track, x: 0, speed: parseFloat(el.dataset.marquee) || 0.6 };
    });
    if (!marquees.length || reduced) return;
    let boost = 0;
    const loop = () => {
      boost += (Math.min(40, Math.abs(velocity)) * 0.12 - boost) * 0.08;
      for (const m of marquees) {
        const w = m.track.scrollWidth / 2;
        m.x -= m.speed + boost;
        if (m.x <= -w) m.x += w;
        m.track.style.transform = `translate3d(${m.x.toFixed(1)}px,0,0)`;
      }
      velocity *= 0.9;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function splitText(root) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = part; inner.style.setProperty('--i', i++);
            w.append(inner); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(root);
  }

  function initReveal() {
    $$('[data-split]').forEach(el => { splitText(el); el.setAttribute('data-reveal', ''); });
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduced) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }
  // Content rendered later (shop grid, related products) calls this to animate in.
  function observeNew(root) {
    const els = $$('[data-reveal]:not(.in)', root);
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.05 });
    els.forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 70 + 'ms'); io.observe(el); });
  }

  function initTopbar() {
    const mast = $('.masthead');
    const bar = $('.topbar');
    if (!mast) { bar.classList.add('is-visible'); return; }
    const io = new IntersectionObserver(([en]) => bar.classList.toggle('is-visible', !en.isIntersecting), { threshold: 0 });
    io.observe($('.masthead__sentinel') || mast);
  }

  // Fill [data-cover], [data-disc], [data-turntable] placeholders written in page HTML.
  function hydrateVisuals(root = document) {
    $$('[data-cover]', root).forEach(el => { const p = D.get(el.dataset.cover); if (p) el.innerHTML = A.cover(p, { text: el.dataset.text !== 'false' }); });
    $$('[data-sleeve]', root).forEach(el => { const p = D.get(el.dataset.sleeve); if (p) el.innerHTML = A.sleeve(p); });
    $$('[data-disc]', root).forEach(el => { el.innerHTML = A.disc(el.dataset.disc || '#C2471B', { side: el.dataset.side }); });
    $$('[data-turntable]', root).forEach(el => { const p = D.get(el.dataset.turntable); el.innerHTML = A.turntable(p ? p.art : {}); });
  }

  function initLenis() {
    if (reduced || !window.Lenis) return;
    try {
      lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if (location.hash) {
        const t = document.getElementById(location.hash.slice(1));
        if (t) setTimeout(() => lenis.scrollTo(t, { offset: -headerOffset(), immediate: true }), 60);
      }
    } catch (e) { lenis = null; }
  }

  /* ---------- Boot ---------- */
  buildShell();
  hydrateVisuals();
  bindEvents();
  syncCount();
  renderDrawer();
  initTopbar();

  window.SITE = { D, A, u, $, $$, money, date, esc, card, priceHTML, statusInfo, badgeFor, Cart, track, store, observeNew, hydrateVisuals, refresh: () => { measure(); requestUpdate(); }, FREE_SHIPPING, reduced, desktop, shipHTML, lineLabel, thumb };

  // Page scripts run on DOMContentLoaded (all scripts are deferred), then we start the effects.
  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initLenis();
    measure(); update();
    runMarquees();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', () => { measure(); requestUpdate(); });
    desktop.addEventListener('change', () => { measure(); requestUpdate(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); requestUpdate(); });
    addEventListener('load', () => { measure(); requestUpdate(); });
    body.classList.add('is-ready');
  });
})();
