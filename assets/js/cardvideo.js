/* Uncovered — record cards come alive.
   1. Glow frame: always on, coloured from the album's own cover art, pulsing at a speed set by the
      music's energy (genre). It speeds up and brightens while the record's video plays.
   2. Hover video: hovering a record plays its official video over the cover, muted, with a sound
      button. Leaving the card stops it and the cover returns. On touch screens, tap the cover. */
(function () {
  const S = window.SITE, $$ = S.$$;
  const SPEED = { Metal: 2.6, Rock: 3.6, 'Indie Rock': 3.6, Electronic: 3.2, 'Hip-hop': 3.4, Funk: 3.8, Pop: 4.2, Indie: 4.4, Alternative: 4.6,
    Country: 5.4, Soul: 5.6, Soundtrack: 5.8, Chanson: 6.4, Folk: 6.6, Jazz: 7.2, Classical: 8, Ambient: 9 };
  const SOUND_KEY = 'uncovered.sound';
  let soundOn = false;
  try { soundOn = localStorage.getItem(SOUND_KEY) === '1'; } catch (e) { /* storage blocked */ }

  /* ---------- Glow colours from the cover ---------- */
  const cache = {};
  function palette(img) {
    const c = document.createElement('canvas'); c.width = c.height = 28;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, 28, 28);
    const d = x.getImageData(0, 0, 28, 28).data, buckets = {};
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, dl = max - min;
      if (dl < 0.08 || l < 0.08 || l > 0.95) continue;               // skip greys, black, white
      const s = dl / (1 - Math.abs(2 * l - 1));
      let h = max === r ? ((g - b) / dl) % 6 : max === g ? (b - r) / dl + 2 : (r - g) / dl + 4;
      h = Math.round(((h * 60) + 360) % 360 / 24);                     // 15 hue buckets
      buckets[h] = buckets[h] || { w: 0, s: 0, l: 0 };
      buckets[h].w += s; buckets[h].s += s; buckets[h].l += l;
    }
    const top = Object.entries(buckets).map(([h, v]) => ({ h: +h * 24 + 12, w: v.w, s: v.s / v.w, l: v.l / v.w }))
      .filter(v => v.w > 0).sort((a, b) => b.w - a.w).slice(0, 3);
    if (!top.length) return ['#C9A26B', '#E2C391', '#8a6a3f'];
    while (top.length < 3) top.push({ ...top[top.length - 1], h: (top[top.length - 1].h + 40) % 360 });
    // Push towards vivid, glowing tones so every frame reads as light
    return top.map(v => `hsl(${v.h} ${Math.round(Math.min(100, 55 + v.s * 45))}% ${Math.round(Math.min(68, Math.max(52, v.l * 100 + 10)))}%)`);
  }
  function paint(card) {
    if (card.dataset.glow) return;
    const img = card.querySelector('.pcard__media img'); if (!img) return;
    const apply = () => {
      const id = card.dataset.id;
      let pal = cache[id];
      if (!pal) { try { pal = cache[id] = palette(img); } catch (e) { pal = ['#C9A26B', '#E2C391', '#8a6a3f']; } }
      card.style.setProperty('--g1', pal[0]); card.style.setProperty('--g2', pal[1]); card.style.setProperty('--g3', pal[2]);
      card.style.setProperty('--gs', (SPEED[card.dataset.genre] || 5) + 's');
      card.dataset.glow = '1';
    };
    if (img.complete && img.naturalWidth) apply(); else img.addEventListener('load', apply, { once: true });
  }
  const paintAll = () => $$('.pcard--vinyl').forEach(paint);
  let queued = false;
  const onDom = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; paintAll(); setSoundButtons(); }); };
  new MutationObserver(onDom).observe(document.body, { childList: true, subtree: true });
  paintAll();

  /* ---------- Hover video ---------- */
  let active = null, timer = null;
  const cmd = (f, func) => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*'); } catch (e) { /* not ready */ } };
  function setSoundButtons() {
    $$('.pcard__sound').forEach(b => {
      if (b.getAttribute('aria-pressed') === String(soundOn) && b.dataset.ready) return; // no change: avoid re-render loops
      b.dataset.ready = '1';
      b.setAttribute('aria-pressed', String(soundOn));
      b.setAttribute('aria-label', soundOn ? 'Mute the video' : 'Unmute the video');
      b.innerHTML = soundOn ? S.SOUND_ON : S.SOUND_OFF;
    });
  }
  function start(card) {
    if (active === card) return;
    stop();
    active = card;
    const box = card.querySelector('.pcard__vid');
    const id = card.dataset.video;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&enablejsapi=1&start=15`;
    f.allow = 'autoplay; encrypted-media';
    f.title = card.dataset.videoTitle; f.tabIndex = -1;
    f.addEventListener('load', () => { try { f.contentWindow.postMessage(JSON.stringify({ event: 'listening', id, channel: 'widget' }), '*'); } catch (e) { /* ignore */ } });
    box.append(f);
    card.classList.add('is-loading');
    S.track('card_video', { item_id: card.dataset.id });
  }
  function stop() {
    if (!active) return;
    const f = active.querySelector('.pcard__vid iframe');
    if (f) { cmd(f, 'pauseVideo'); setTimeout(() => f.remove(), 350); }
    active.classList.remove('is-playing', 'is-loading');
    active = null;
  }
  window.addEventListener('message', e => {
    if (!active || !/youtube(-nocookie)?\.com$/.test(new URL(e.origin).hostname)) return;
    const f = active.querySelector('.pcard__vid iframe');
    if (!f || e.source !== f.contentWindow) return;
    let d; try { d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    const state = d.event === 'onStateChange' ? d.info : d.event === 'infoDelivery' && d.info ? d.info.playerState : undefined;
    if (state === 1 && !active.classList.contains('is-playing')) {
      active.classList.add('is-playing'); active.classList.remove('is-loading');
      if (soundOn) cmd(f, 'unMute');
    }
    if (d.event === 'onError') { active.classList.remove('is-loading'); f.remove(); }
  });

  const hoverable = matchMedia('(hover: hover) and (pointer: fine)');
  document.addEventListener('pointerover', e => {
    if (!hoverable.matches) return;
    const card = e.target.closest('.pcard[data-video]');
    if (!card || card === active) return;
    clearTimeout(timer);
    timer = setTimeout(() => start(card), 220);
  });
  document.addEventListener('pointerout', e => {
    if (!hoverable.matches) return;
    const card = e.target.closest('.pcard[data-video]');
    if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    clearTimeout(timer);
    if (card === active) stop();
  });
  document.addEventListener('click', e => {
    const btn = e.target.closest('.pcard__sound');
    if (btn) {
      e.preventDefault(); e.stopPropagation();
      soundOn = !soundOn;
      try { localStorage.setItem(SOUND_KEY, soundOn ? '1' : '0'); } catch (err) { /* storage blocked */ }
      setSoundButtons();
      const card = btn.closest('.pcard');
      if (card !== active) start(card);
      const f = active && active.querySelector('.pcard__vid iframe');
      if (f) cmd(f, soundOn ? 'unMute' : 'mute');
      return;
    }
    // Touch screens: tap the cover to play / stop
    if (!hoverable.matches) {
      const media = e.target.closest('.pcard[data-video] .pcard__media');
      if (media) { const card = media.closest('.pcard'); card === active ? stop() : start(card); }
    }
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  document.addEventListener('cart:change', () => { /* keep playing while shopping */ });
  setSoundButtons();
})();
