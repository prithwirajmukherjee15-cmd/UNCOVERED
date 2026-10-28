/* Uncovered — shared site shell: header, menus, cart, footer, scroll effects. */
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
  const date = (s, opts = { day: 'numeric', month: 'long', year: 'numeric' }) => s && s.length >= 10 ? new Date(s + 'T12:00:00').toLocaleDateString('en-GB', opts) : (s || '').slice(0, 4);
  const shortDate = s => date(s, { day: 'numeric', month: 'short', year: 'numeric' });
  const FREE_SHIPPING = 60;

  /* ---------- Analytics hook (window.dataLayer, ready for GTM / GA4) ---------- */
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => window.dataLayer.push({ event, ...params });

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
  };

  /* ---------- Cart ---------- */
  const linePrice = i => (i.opts && i.opts.price) || D.get(i.id).price;
  const Cart = {
    key: 'uncovered.cart.v2',
    items() { return store.get(this.key, []).filter(i => D.get(i.id)); },
    save(items) { store.set(this.key, items); document.dispatchEvent(new CustomEvent('cart:change')); },
    add(id, qty = 1, opts) {
      const p = D.get(id); if (!p) return;
      const items = this.items();
      const key = id + (opts ? ':' + JSON.stringify(opts) : '');
      const found = items.find(i => i.key === key);
      const max = p.stock || 20;
      if (found) found.qty = Math.min(max, found.qty + qty); else items.push({ key, id, qty: Math.min(max, qty), opts });
      this.save(items);
      track('add_to_cart', { currency: 'EUR', value: ((opts && opts.price) || p.price) * qty, items: [{ item_id: id, item_name: p.title, quantity: qty }] });
    },
    setQty(key, q) {
      const items = this.items();
      const it = items.find(i => i.key === key); if (!it) return;
      it.qty = Math.max(0, Math.min(D.get(it.id).stock || 20, q));
      this.save(items.filter(i => i.qty > 0));
    },
    remove(key) { this.save(this.items().filter(i => i.key !== key)); },
    clear() { this.save([]); },
    count() { return this.items().reduce((n, i) => n + i.qty, 0); },
    subtotal() { return this.items().reduce((n, i) => n + linePrice(i) * i.qty, 0); }
  };

  /* ---------- Shared markup ---------- */
  function statusInfo(p) {
    if (p.status === 'preorder') return { cls: 'pre', text: `Preorder · out ${date(p.released)}` };
    if (p.status === 'low') return { cls: 'low', text: p.stock === 1 ? 'Only 1 left' : `Only ${p.stock} left` };
    return { cls: 'ok', text: 'In stock · ships within 24h' };
  }
  function badges(p) {
    const b = [];
    if (p.status === 'preorder') b.push(['pre', 'Preorder']);
    if (p.oldPrice) b.push(['sale', `−${Math.round((1 - p.price / p.oldPrice) * 100)}%`]);
    if (p.condition === 'Used' && p.grade) b.push(['used', `Used · ${p.grade[0]}`]);
    else if (p.condition && p.condition !== 'New' && p.type === 'player') b.push(['used', p.condition]);
    if (p.edition === 'Limited') b.push(['limited', 'Limited']);
    if (p.edition === 'Coloured vinyl') b.push(['', 'Coloured vinyl']);
    if (p.edition === 'Signed') b.push(['signed', 'Signed']);
    return b;
  }
  const priceHTML = p => `<span class="price">${p.oldPrice ? `<s>${money(p.oldPrice)}</s>` : ''}${money(p.price)}</span>`;
  const whenText = p => p.type !== 'vinyl' ? '' : (p.tags.includes('new') || p.status === 'preorder') ? shortDate(p.released) : String(p.originalYear || '');

  // o.info: show label + format (Last releases page). o.rank: show #1, #2, #3.
  function card(p, o = {}) {
    if (p.type === 'pack') return packCard(p);
    const b = badges(p);
    const sub = p.type === 'vinyl' ? p.artist : `${p.artist} · ${p.condition === 'New' ? 'New' : p.condition}`;
    const info = o.info && p.type === 'vinyl' ? [whenText(p), p.label, p.format].filter(Boolean).join(' · ') : whenText(p);
    const cta = p.status === 'preorder' ? 'Preorder' : 'Add to cart';
    return `<article class="pcard pcard--${p.type}" data-reveal>
      <div class="pcard__media">${A.img(p)}
        ${b.length ? `<span class="badges">${b.map(([c, t]) => `<span class="badge${c ? ' badge--' + c : ''}">${t}</span>`).join('')}</span>` : ''}
        ${o.rank && p.rank && p.rank <= 3 ? `<span class="rank"><small>#</small>${p.rank}</span>` : ''}</div>
      <div class="pcard__meta">
        <p class="pcard__artist">${esc(sub)}</p>
        <h3 class="pcard__title">${esc(p.title)}</h3>
        ${info ? `<p class="pcard__info">${esc(info)}</p>` : ''}
        ${p.status === 'low' && o.info ? `<p class="pcard__stock">${statusInfo(p).text}</p>` : ''}
        <div class="pcard__row">${priceHTML(p)}
          <button class="pcard__add" type="button" data-add="${p.id}" aria-label="${cta}: ${esc(p.title)}">${cta}</button>
        </div>
      </div>
    </article>`;
  }
  function packCard(p) {
    return `<article class="pcard pcard--pack" data-reveal>
      <div class="pcard__media">${A.img(p)}<span class="badges"><span class="badge badge--limited">Pack · −10%</span></span></div>
      <div class="pcard__meta"><p class="pcard__artist">Record player + 3 records</p><h3 class="pcard__title">${esc(p.title)}</h3>
        <div class="pcard__row"><span class="price">10% off</span><a class="pcard__add" href="#pack">Build my pack</a></div></div>
    </article>`;
  }

  const ICON = {
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.4"/></svg>'
  };
  const NAV = [['Shop', '#browse'], ['Last releases', '#last'], ['Best-sellers', '#best'], ['Our story', '#story']];
  const CATS = Object.entries(D.categories);

  function catmenuHTML(home) {
    const current = new URLSearchParams(location.search).get('cat');
    return `<nav class="catmenu${home ? ' catmenu--home' : ''}" aria-label="Shop categories">
      <ul class="catmenu__list">${CATS.map(([k, c]) => `<li><a href="#browse" data-cat="${k}" data-intro="${esc(c.intro)}">${c.label}<sup>${D.all.filter(c.test).length}</sup></a></li>`).join('')}</ul>
      ${home ? `<p class="catmenu__intro" aria-live="polite">${esc(CATS[0][1].intro)}</p>` : ''}
    </nav>`;
  }

  function buildShell() {
    const page = body.dataset.page;
    const home = page === 'home';
    const head = document.createElement('header');
    head.className = 'site-head';
    head.innerHTML = `
      <div class="site-head__bar">
        <div class="site-head__left">
          <button class="icon-btn menu-btn" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
          <nav class="site-head__nav" aria-label="Main">${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>
        </div>
        <a class="logo" href="#top" aria-label="Uncovered, back to top"><b>UNCOVERED</b><small>Records worth uncovering.</small></a>
        <div class="site-head__tools">
          <a class="icon-btn" href="#browse" data-focus-search aria-label="Search records">${ICON.search}</a>
          <button class="icon-btn" type="button" data-cart-open aria-label="Open cart">${ICON.bag}<span class="cart-count" data-cart-count>0</span></button>
        </div>
      </div>
      ${home ? '' : catmenuHTML(false)}`;
    const announce = document.createElement('div');
    announce.className = 'announce marquee';
    announce.setAttribute('data-marquee', '0.35');
    announce.setAttribute('aria-label', 'Announcements');
    announce.innerHTML = `<div class="marquee__track"><span>Free delivery over <b>€60</b></span><span>New records every <b>Friday</b></span><span>Used vinyl, <b>graded by hand</b></span><span>30-day returns</span><span>Preorders ship on <b>release day</b></span></div>`;
    body.prepend(head);
    body.prepend(announce);
    const slot = $('#catmenu-slot');
    if (slot) slot.outerHTML = catmenuHTML(true);

    const menu = document.createElement('div');
    menu.className = 'menu'; menu.id = 'menu'; menu.hidden = true;
    menu.innerHTML = `<nav aria-label="Mobile">
        <ul class="menu__main">${NAV.map(([t, h]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
        <ul class="menu__cats">${CATS.map(([k, c]) => `<li><a href="#browse" data-cat="${k}">${c.label}</a></li>`).join('')}</ul>
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
          <button class="btn btn--block" type="button" data-checkout>Checkout</button>
          <p class="drawer__note" role="status" hidden>Checkout opens at launch. Your cart is saved on this device.</p>
          <button class="btn btn--ghost btn--block" type="button" data-drawer-close>Keep browsing</button>
        </footer>
      </aside>`;
    body.append(drawer);

    const foot = $('#site-footer');
    if (foot) foot.outerHTML = footerHTML();
  }

  function footerHTML() {
    return `<footer class="footer"><div class="footer__inner">
      <div class="footer__top">
        <div class="footer__brand"><b>UNCOVERED</b><p>Records worth uncovering.</p></div>
        <div><h3>Shop</h3><ul>${CATS.map(([k, c]) => `<li><a href="#browse" data-cat="${k}">${c.label}</a></li>`).join('')}</ul></div>
        <div><h3>Uncovered</h3><ul>
          <li><a href="#last">Last releases</a></li>
          <li><a href="#best">Best-sellers</a></li>
          <li><a href="#pack">Pack offer</a></li>
          <li><a href="#story">Our story</a></li></ul></div>
        <div><h3>Say hello</h3><ul>
          <li><a href="mailto:hello@uncovered.store">hello@uncovered.store</a></li>
          <li><a href="https://www.instagram.com/" rel="noopener">Instagram</a></li>
          <li><a href="https://www.discogs.com/" rel="noopener">Discogs</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>© ${new Date().getFullYear()} Uncovered · uncovered.store · Prices include VAT</span>
        <span>Video: Beachfront B-Roll, CC BY 3.0 · Turntable photos: Wikimedia Commons contributors (CC BY / CC BY-SA) · Release data: MusicBrainz · Covers: Cover Art Archive</span>
      </div>
    </div></footer>`;
  }

  /* ---------- Drawer & menu ---------- */
  let lenis = null, lastFocus = null;
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
    setTimeout(() => { d.hidden = true; }, 450);
    if (lastFocus) lastFocus.focus();
  }
  function toggleMenu(force) {
    const m = $('#menu'), b = $('.menu-btn');
    const open = force ?? m.hidden;
    b.setAttribute('aria-expanded', String(open));
    body.classList.toggle('menu-open', open);
    if (open) { m.hidden = false; requestAnimationFrame(() => m.classList.add('is-open')); }
    else { m.classList.remove('is-open'); setTimeout(() => { m.hidden = true; }, 500); }
    lockScroll(open);
  }
  function shipHTML(sub) {
    const left = FREE_SHIPPING - sub;
    return `<p>${left > 0 ? `You're <strong>${money(left)}</strong> away from free delivery.` : 'Free delivery unlocked.'}</p><div class="meter"><span style="width:${Math.min(100, (sub / FREE_SHIPPING) * 100)}%"></span></div>`;
  }
  function lineLabel(i) {
    const p = D.get(i.id);
    if (i.opts && i.opts.picks) return [D.get(i.opts.player)?.artist + ' ' + D.get(i.opts.player)?.title, ...i.opts.picks.map(id => D.get(id)?.title)].filter(Boolean).join(' · ');
    if (p.type === 'vinyl') return p.artist + (p.condition === 'Used' ? ` · Used ${p.grade.join(' / ')}` : '');
    return `${p.artist} · ${p.condition}`;
  }
  const thumb = p => `<div class="thumb">${A.img(p, { decorative: true })}</div>`;
  function renderDrawer() {
    const d = $('#drawer'); if (!d) return;
    const items = Cart.items();
    $('.drawer__items', d).innerHTML = items.length ? items.map(i => {
      const p = D.get(i.id);
      return `<li class="line">${thumb(p)}
        <div class="line__info"><b class="line__title">${esc(p.title)}</b><small>${esc(lineLabel(i))}</small>
          <div class="qty" data-key="${esc(i.key)}"><button type="button" data-q="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button type="button" data-q="1" aria-label="Increase quantity">+</button></div></div>
        <div class="line__price">${money(linePrice(i) * i.qty)}<button type="button" class="link" data-remove="${esc(i.key)}">Remove</button></div>
      </li>`;
    }).join('') : `<li class="empty"><p>Your cart is empty.</p><a class="btn btn--ghost" href="#last" data-drawer-close>See the last releases</a></li>`;
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
        if (p && p.type === 'pack') { location.hash = 'pack'; return; }
        const qtyInput = add.dataset.qtyFrom && $(add.dataset.qtyFrom);
        Cart.add(add.dataset.add, qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1);
        add.classList.add('is-added'); setTimeout(() => add.classList.remove('is-added'), 900);
        openDrawer(); return;
      }
      if (e.target.closest('.skip')) { e.preventDefault(); const m = $('#main'); m.setAttribute('tabindex', '-1'); m.focus(); return; }
      if (e.target.closest('[data-cart-open]')) { openDrawer(); return; }
      if (e.target.closest('[data-checkout]')) { const n = $('.drawer__note'); n.hidden = false; track('begin_checkout', { value: Cart.subtotal() }); return; }
      if (e.target.closest('[data-drawer-close]')) { closeDrawer(); return; }
      if (e.target.closest('.menu-btn')) { toggleMenu(); return; }
      const q = e.target.closest('.drawer .qty button');
      if (q) { const key = q.parentElement.dataset.key; const it = Cart.items().find(i => i.key === key); if (it) Cart.setQty(key, it.qty + Number(q.dataset.q)); return; }
      const rm = e.target.closest('.drawer [data-remove]');
      if (rm) { Cart.remove(rm.dataset.remove); return; }
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

    // Category menu on the home page: show the category's intro line on hover/focus.
    const intro = $('.catmenu__intro');
    if (intro) $$('.catmenu--home a').forEach(a => {
      const show = () => { intro.style.opacity = 0; setTimeout(() => { intro.textContent = a.dataset.intro; intro.style.opacity = 1; }, 150); };
      a.addEventListener('mouseenter', show); a.addEventListener('focus', show);
    });

    document.addEventListener('submit', e => {
      const f = e.target.closest('.news-form'); if (!f) return;
      e.preventDefault();
      const input = $('input', f), msg = $('.news-form__msg', f);
      if (!input.checkValidity()) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      msg.textContent = f.dataset.thanks || "You're on the list.";
      input.value = '';
      track('newsletter_signup', { list: f.dataset.list || 'newsletter' });
    });
  }

  /* ---------- Scroll engine ---------- */
  const SCENES = window.SCENES = window.SCENES || {};
  let scenes = [], parallax = [], lastY = window.scrollY, velocity = 0, ticking = false;
  const desktop = matchMedia('(min-width: 900px)');
  const headerOffset = () => { const h = $('.site-head'); return h ? h.getBoundingClientRect().height + 16 : 0; };

  function measure() {
    scenes = $$('[data-scene]').map(el => {
      const sticky = $('[data-sticky]', el);
      return { el, sticky, top: sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0, h: sticky ? sticky.offsetHeight : innerHeight };
    });
    parallax = $$('[data-parallax]').map(el => ({ el, f: parseFloat(el.dataset.parallax) || 0.1 }));
  }
  function update() {
    ticking = false;
    const y = window.scrollY;
    velocity = y - lastY; lastY = y;
    const head = $('.site-head');
    if (head) head.classList.toggle('is-scrolled', y > (body.dataset.page === 'home' ? ($('.masthead')?.offsetHeight || 200) - 40 : 10));
    for (const s of scenes) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const total = r.height - s.h;
      const p = total > 0 ? Math.min(1, Math.max(0, (s.top - r.top) / total)) : (r.top < innerHeight ? 1 : 0);
      s.el.style.setProperty('--p', p.toFixed(4));
      const steps = parseInt(s.el.dataset.steps || '0', 10);
      if (steps) { const i = String(Math.min(steps - 1, Math.floor(p * steps * 0.999))); if (s.el.dataset.step !== i) s.el.dataset.step = i; }
      const h = SCENES[s.el.dataset.scene]; if (h && h.update) h.update(s.el, p);
    }
    if (!reduced) for (const { el, f } of parallax) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - innerHeight / 2) * -f).toFixed(1)}px, 0)`;
    }
  }
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  function runMarquees() {
    const ms = $$('[data-marquee]').map(el => {
      const track = $('.marquee__track', el);
      track.innerHTML += track.innerHTML + track.innerHTML;
      return { track, x: 0, speed: parseFloat(el.dataset.marquee) || 0.5 };
    });
    if (!ms.length || reduced) return;
    let boost = 0;
    const loop = () => {
      boost += (Math.min(40, Math.abs(velocity)) * 0.08 - boost) * 0.08;
      for (const m of ms) {
        const w = m.track.scrollWidth / 3;
        m.x -= m.speed + boost; if (m.x <= -w) m.x += w;
        m.track.style.transform = `translate3d(${m.x.toFixed(1)}px,0,0)`;
      }
      velocity *= 0.9;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function splitText(root) {
    let i = 0;
    const walk = node => [...node.childNodes].forEach(n => {
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
    walk(root);
  }
  function observe(els) {
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    els.forEach(el => io.observe(el));
  }
  function initReveal() {
    $$('[data-split]').forEach(el => { splitText(el); el.setAttribute('data-reveal', ''); });
    observe($$('[data-reveal]'));
  }
  function observeNew(root) {
    const els = $$('[data-reveal]:not(.in)', root);
    els.forEach((el, i) => el.style.setProperty('--d', (i % 6) * 60 + 'ms'));
    observe(els);
  }
  function hydrate(root = document) {
    $$('[data-img]', root).forEach(el => { const p = D.get(el.dataset.img); if (p) el.innerHTML = A.img(p, { decorative: el.dataset.decorative === 'true' }); });
  }
  function initLenis() {
    if (reduced || !window.Lenis) return;
    try {
      lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(() => lenis.scrollTo(t, { offset: -headerOffset(), immediate: true }), 80); }
    } catch (e) { lenis = null; }
  }

  /* ---------- Boot ---------- */
  buildShell();
  hydrate();
  bindEvents();
  syncCount();
  renderDrawer();

  window.SITE = { D, A, u, $, $$, money, date, shortDate, esc, card, priceHTML, statusInfo, badges, Cart, linePrice, track, store, observeNew, hydrate,
    refresh: () => { measure(); requestUpdate(); }, FREE_SHIPPING, reduced, desktop, shipHTML, lineLabel, thumb };

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initLenis();
    measure(); update();
    runMarquees();
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', () => { measure(); requestUpdate(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); requestUpdate(); });
    addEventListener('load', () => { measure(); requestUpdate(); });
  });
})();
