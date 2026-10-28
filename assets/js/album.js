/* Uncovered — album content hub.
   NFC sleeves open:  https://uncovered.store/a/<album-id>?k=<sleeve-token>
   (rewritten to album.html?id=<album-id>&k=<token> — see _redirects).
   Demo note: the token is only checked for presence here. In production the
   hub content should be served by an API that verifies the token. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc;
  const params = new URLSearchParams(location.search);
  const short = location.pathname.match(/\/a\/([a-z0-9-]+)/); // NFC short link: /a/<album-id>
  const id = params.get('id') || (short && short[1]);
  const token = params.get('k');
  const p = D.get(id);
  const LIB = 'uncovered.library';
  const library = S.store.get(LIB, {});

  if (!p || p.type !== 'vinyl') {
    $('#hub-hero').innerHTML = `<div><p class="eyebrow">Album hub</p><h1 class="h-xl">Sleeve <em>not found</em></h1>
      <p class="muted" style="margin-top:16px">We couldn't match this link to an album. Try tapping the sleeve again, or enter the code printed inside it.</p>
      <div class="buy-row" style="margin-top:24px"><a class="btn btn--light" href="how-it-works.html#unlock">Enter a sleeve code</a><a class="btn btn--ghost" style="color:var(--paper);border-color:var(--paper)" href="help.html#nfc">NFC help</a></div></div>`;
    renderLibrary();
    return;
  }

  document.title = `${p.title} — Album hub — Uncovered`;
  const preview = {
    get: () => { try { return sessionStorage.getItem('uncovered.preview.' + p.id) === '1'; } catch (e) { return false; } },
    set: () => { try { sessionStorage.setItem('uncovered.preview.' + p.id, '1'); } catch (e) { /* storage blocked */ } }
  };
  let unlocked = !!library[p.id] || preview.get();

  // Arrived from a sleeve tap (or a typed code): record it and tidy the URL so the token isn't shared.
  if (token) {
    const entry = library[p.id] || { first: new Date().toISOString(), visits: 0 };
    library[p.id] = entry;
    unlocked = true;
    S.track('nfc_access', { album_id: p.id, source: token === 'code' ? 'sleeve_code' : token === 'preview' ? 'preview' : 'nfc' });
    history.replaceState(null, '', (short ? location.pathname : `album.html?id=${p.id}`) + location.hash);
  }
  if (library[p.id]) {
    library[p.id].visits = (library[p.id].visits || 0) + 1;
    library[p.id].last = new Date().toISOString();
    if (library[p.id].visits > 1) S.track('hub_repeat_visit', { album_id: p.id, visit: library[p.id].visits });
    S.store.set(LIB, library);
  }
  const visits = library[p.id] ? library[p.id].visits : 0;
  const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');

  /* ---- Hero ---- */
  $('#hub-hero').innerHTML = `
    <div>${A.sleeve(p, { cls: 'is-out' })}</div>
    <div>
      <p class="eyebrow">${unlocked ? 'You\'ve uncovered' : 'Album hub'}</p>
      <h1 class="h-xl">${esc(p.title)}</h1>
      <p class="lead muted">${esc(p.artist)} · ${esc(p.genre)} · ${p.year}</p>
      ${visits > 1 ? `<span class="visits">Welcome back. This is your ${ordinal(visits)} visit.</span>` : unlocked ? '<span class="visits">Sleeve connected. Enjoy the record.</span>' : ''}
    </div>`;

  /* ---- Panels ---- */
  const x = p.extras;
  const tabs = [
    ['story', 'Album story', `<div class="hub-story">${x.story.map(t => `<p>${esc(t)}</p>`).join('')}</div>`],
    ['interview', 'Interview', `<dl class="qa">${x.interview.map(([q, a]) => `<div><dt>${esc(q)}</dt><dd>${esc(a)}</dd></div>`).join('')}</dl>
       <p class="muted" style="margin-top:30px">Interview by the Uncovered team, ${p.year}.</p>`],
    x.lyrics.length
      ? ['lyrics', 'Lyrics', x.lyrics.map(l => `<div class="lyrics"><div><p class="eyebrow">Lyrics</p><h2 class="h-md">${esc(l.track)}</h2>
          <p class="muted" style="margin-top:12px">From ${esc(p.title)}. More lyrics are added as the artist shares them.</p></div>
          <p class="lyrics__text">${l.lines.map(esc).join('\n')}</p></div>`).join('')]
      : ['lyrics', 'Liner notes', `<div class="lyrics"><div><p class="eyebrow">Instrumental</p><h2 class="h-md">Liner notes</h2></div>
          <div><p class="lyrics__text">${esc(p.liner || '')}</p><ol class="tracklist" style="margin-top:28px">${p.tracks.map(t => `<li><b>${t[0]}</b><span>${esc(t[1])}</span><span>${t[2]}</span></li>`).join('')}</ol></div></div>`],
    ['live', 'Live session', `<div class="video">${A.cover(p, { text: false })}
        <button class="video__play" type="button" id="play-live"><i></i><span>Play the session · ${esc(x.live.venue)}</span></button></div>
       <div class="lyrics"><div><p class="eyebrow">Recorded ${S.date(x.live.date)}</p><h2 class="h-md">${esc(x.live.venue)}, ${esc(x.live.city)}</h2>
         <p style="margin-top:14px">${esc(x.live.note)}</p></div>
         <div><p class="flabel" style="font:600 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px">Setlist</p><ol class="setlist">${x.live.setlist.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div></div>`]
  ];

  const tabsHTML = `<div class="hub-tabs" role="tablist" aria-label="Album content">${tabs.map(([k, label], i) =>
    `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${k}">${label}</button>`).join('')}</div>`;
  const panelsHTML = tabs.map(([k, , html], i) =>
    `<section class="hub-panel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}" tabindex="0"${i ? ' hidden' : ''}>${html}</section>`).join('');

  const bodyEl = $('#hub-body');
  if (unlocked) {
    bodyEl.innerHTML = tabsHTML + panelsHTML;
  } else {
    bodyEl.classList.add('locked');
    bodyEl.innerHTML = tabsHTML + panelsHTML + `
      <div class="lock-card" role="region" aria-label="Locked content">
        <p class="eyebrow">Locked</p>
        <h2 class="h-md">This hub opens with the sleeve</h2>
        <p>Tap your copy of <strong>${esc(p.title)}</strong> with your phone, or enter the code printed inside the sleeve.</p>
        <div class="actions">
          <a class="btn" href="how-it-works.html#unlock">Enter sleeve code</a>
          <a class="btn btn--ghost" href="product.html?id=${p.id}">Get the record</a>
        </div>
        <p style="margin:18px 0 0"><button class="link" type="button" id="preview">Preview the experience (demo)</button></p>
      </div>`;
    $$('.hub-tabs button', bodyEl).forEach(b => b.setAttribute('tabindex', '-1'));
    $$('.hub-panel', bodyEl).forEach(pn => { pn.setAttribute('aria-hidden', 'true'); pn.removeAttribute('tabindex'); });
    $('#preview').addEventListener('click', () => {
      preview.set();
      location.replace(`album.html?id=${p.id}&k=preview`);
    });
  }

  /* ---- Tabs ---- */
  function select(k, focus) {
    $$('[role="tab"]', bodyEl).forEach(b => {
      const on = b.dataset.tab === k;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && focus) b.focus();
    });
    $$('[role="tabpanel"]', bodyEl).forEach(pn => { pn.hidden = pn.id !== 'panel-' + k; });
    if (unlocked) {
      S.track('content_view', { album_id: p.id, content_type: k });
      history.replaceState(null, '', location.pathname + location.search + '#' + k);
    }
    S.refresh();
  }
  if (unlocked) {
    const tablist = $('.hub-tabs', bodyEl);
    tablist.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) select(b.dataset.tab); });
    tablist.addEventListener('keydown', e => {
      const btns = $$('[role="tab"]', tablist);
      const i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      let n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % btns.length;
      if (e.key === 'ArrowLeft') n = (i - 1 + btns.length) % btns.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = btns.length - 1;
      if (n !== null) { e.preventDefault(); select(btns[n].dataset.tab, true); }
    });
    const start = location.hash.slice(1);
    select(tabs.some(t => t[0] === start) ? start : 'story');
    const live = $('#play-live');
    if (live) live.addEventListener('click', () => {
      live.querySelector('span').textContent = 'Session video streams here once the video host is connected.';
      S.track('content_view', { album_id: p.id, content_type: 'live_play' });
    });
  }

  renderLibrary();

  function renderLibrary() {
    const ids = Object.keys(library).filter(k => k !== id && D.get(k));
    const el = $('#library');
    if (!ids.length) {
      el.innerHTML = `<p class="muted">Albums you unlock appear here. Each one is a tap away from its hub.</p>`;
      return;
    }
    el.innerHTML = ids.map(k => { const a = D.get(k); return `<a href="album.html?id=${a.id}"><div class="thumb">${A.cover(a, { text: false })}</div><b>${esc(a.title)}</b><br><span class="muted">${esc(a.artist)}</span></a>`; }).join('');
  }
})();
