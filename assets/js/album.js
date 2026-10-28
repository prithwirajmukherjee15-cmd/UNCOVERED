/* Uncovered — record page opened by the NFC tag in every Uncovered outer sleeve.
   Sleeve tags open:  https://uncovered.store/a/<record-id>?k=<sleeve-token>
   (served from album.html — see _redirects). Demo note: the token is only checked
   for presence; verify it server-side before launch. */
(function () {
  const S = window.SITE, D = S.D, A = S.A, $ = S.$, $$ = S.$$, esc = S.esc;
  const params = new URLSearchParams(location.search);
  const short = location.pathname.match(/\/a\/([a-z0-9-]+)/);
  const id = params.get('id') || (short && short[1]);
  const token = params.get('k');
  const p = D.get(id);
  const LIB = 'uncovered.library';
  const library = S.store.get(LIB, {});

  if (!p || p.type !== 'vinyl') {
    $('#hub-hero').innerHTML = `<div><p class="eyebrow">Record page</p><h1 class="h-xl">Sleeve <em>not found</em></h1>
      <p class="muted" style="margin-top:16px">We couldn't match this link to a record. Try tapping the sleeve again, or enter the code printed on the sleeve.</p>
      <div class="buy-row" style="margin-top:24px"><a class="btn" href="how-it-works.html#unlock">Enter a sleeve code</a><a class="btn btn--ghost" href="help.html#nfc">NFC help</a></div></div>`;
    renderLibrary();
    return;
  }

  document.title = `${p.title} — ${p.artist} | Uncovered`;
  const preview = {
    get: () => { try { return sessionStorage.getItem('uncovered.preview.' + p.id) === '1'; } catch (e) { return false; } },
    set: () => { try { sessionStorage.setItem('uncovered.preview.' + p.id, '1'); } catch (e) { /* storage blocked */ } }
  };
  let unlocked = !!library[p.id] || preview.get();

  if (token) {
    library[p.id] = library[p.id] || { first: new Date().toISOString(), visits: 0 };
    unlocked = true;
    S.track('nfc_access', { album_id: p.id, source: token === 'code' ? 'sleeve_code' : token === 'preview' ? 'preview' : 'nfc' });
    history.replaceState(null, '', (short ? location.pathname : `album.html?id=${p.id}`) + location.hash);
  }
  if (library[p.id]) {
    library[p.id].visits = (library[p.id].visits || 0) + 1;
    if (library[p.id].visits > 1) S.track('hub_repeat_visit', { album_id: p.id, visit: library[p.id].visits });
    S.store.set(LIB, library);
  }
  const visits = library[p.id] ? library[p.id].visits : 0;
  const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  const when = p.tags.includes('new') || p.status === 'preorder' ? S.date(p.released) : String(p.originalYear);

  $('#hub-hero').innerHTML = `
    <div class="hub-hero__cover">${A.img(p, { eager: true })}</div>
    <div>
      <p class="eyebrow">${unlocked ? "You've uncovered" : 'Record page'}</p>
      <h1 class="h-xl">${esc(p.title)}</h1>
      <p class="lead">${esc(p.artist)} · ${esc(p.genre)} · ${esc(when)}</p>
      ${visits > 1 ? `<span class="visits">Welcome back. This is your ${ordinal(visits)} visit.</span>` : unlocked ? '<span class="visits">Sleeve connected. Enjoy the record.</span>' : ''}
    </div>`;

  const q = encodeURIComponent(`${p.artist} ${p.title}`);
  const tabs = [
    ['record', 'The record', `<div class="hub-story"><p>${esc(p.blurb)}</p>${p.review ? `<p>${esc(p.review)}</p>` : ''}</div>
      ${p.condition === 'Used' ? `<p class="notice" style="margin-top:30px">This copy was graded <strong>${p.grade[0]}</strong> (record) and <strong>${p.grade[1]}</strong> (sleeve). <a href="help.html#grading">How we grade</a></p>` : ''}`],
    ['tracklist', 'Tracklist', p.tracks.length
      ? `<ol class="tracklist">${p.tracks.map(t => `<li><b>${esc(t[0])}</b><span>${esc(t[1])}</span><span>${t[2]}</span></li>`).join('')}</ol>`
      : `<p class="lead">${p.trackCount} tracks across ${p.media.length} records. <a href="https://musicbrainz.org/release/${p.mb}" rel="noopener">See the full tracklist on MusicBrainz</a>.</p>`],
    ['credits', 'Credits', `<table class="specs" style="max-width:640px">
        <tr><th>Artist</th><td>${esc(p.artist)}</td></tr>${p.label ? `<tr><th>Label</th><td>${esc(p.label)}</td></tr>` : ''}
        ${p.catno ? `<tr><th>Catalogue no.</th><td>${esc(p.catno)}</td></tr>` : ''}<tr><th>Released</th><td>${esc(when)}</td></tr>
        <tr><th>Format</th><td>${esc(p.media.join(' + '))}</td></tr></table>
        <p class="muted" style="margin-top:16px;font-size:14px">Release data from <a href="https://musicbrainz.org/release/${p.mb}" rel="noopener">MusicBrainz</a>, the open music encyclopedia.</p>`],
    ['listen', 'Listen', `<div class="buy-row" style="margin-bottom:28px"><button class="btn" type="button" id="listen">Listen to an extract</button></div>
        <div class="player" id="player" hidden style="margin:-14px 0 28px"><span data-now></span><span class="player__bar"><span></span></span></div>
        <div class="listen">
          <a href="https://www.deezer.com/search/${q}" rel="noopener" target="_blank">Deezer</a>
          <a href="https://open.spotify.com/search/${q}" rel="noopener" target="_blank">Spotify</a>
          <a href="https://music.apple.com/search?term=${q}" rel="noopener" target="_blank">Apple Music</a>
          <a href="https://bandcamp.com/search?q=${q}" rel="noopener" target="_blank">Bandcamp</a>
          <a href="https://www.youtube.com/results?search_query=${q}" rel="noopener" target="_blank">YouTube</a>
        </div>`]
  ];
  const tabsHTML = `<div class="hub-tabs" role="tablist" aria-label="About this record">${tabs.map(([k, label], i) =>
    `<button type="button" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${k}">${label}</button>`).join('')}</div>`;
  const panelsHTML = tabs.map(([k, , html], i) => `<section class="hub-panel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}" tabindex="0"${i ? ' hidden' : ''}>${html}</section>`).join('');

  const bodyEl = $('#hub-body');
  if (unlocked) {
    bodyEl.innerHTML = tabsHTML + panelsHTML;
  } else {
    bodyEl.classList.add('locked');
    bodyEl.innerHTML = tabsHTML + panelsHTML + `
      <div class="lock-card" role="region" aria-label="Locked content">
        <p class="eyebrow">Sleeve page</p>
        <h2 class="h-md">This page opens with the sleeve</h2>
        <p class="muted">Tap the Uncovered sleeve of <strong>${esc(p.title)}</strong> with your phone, or enter the code printed on it.</p>
        <div class="actions"><a class="btn" href="how-it-works.html#unlock">Enter sleeve code</a><a class="btn btn--ghost" href="product.html?id=${p.id}">Get the record</a></div>
        <p style="margin:18px 0 0"><button class="link" type="button" id="preview">Preview the experience (demo)</button></p>
      </div>`;
    $$('.hub-tabs button', bodyEl).forEach(b => b.setAttribute('tabindex', '-1'));
    $$('.hub-panel', bodyEl).forEach(pn => { pn.setAttribute('aria-hidden', 'true'); pn.removeAttribute('tabindex'); });
    $('#preview').addEventListener('click', () => { preview.set(); location.replace(`album.html?id=${p.id}&k=preview`); });
  }

  function select(k, focus) {
    $$('[role="tab"]', bodyEl).forEach(b => { const on = b.dataset.tab === k; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; if (on && focus) b.focus(); });
    $$('[role="tabpanel"]', bodyEl).forEach(pn => { pn.hidden = pn.id !== 'panel-' + k; });
    S.track('content_view', { album_id: p.id, content_type: k });
    history.replaceState(null, '', location.pathname + location.search + '#' + k);
    S.refresh();
  }
  if (unlocked) {
    const tablist = $('.hub-tabs', bodyEl);
    tablist.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) select(b.dataset.tab); });
    tablist.addEventListener('keydown', e => {
      const btns = $$('[role="tab"]', tablist), i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      const n = { ArrowRight: (i + 1) % btns.length, ArrowLeft: (i - 1 + btns.length) % btns.length, Home: 0, End: btns.length - 1 }[e.key];
      if (n !== undefined) { e.preventDefault(); select(btns[n].dataset.tab, true); }
    });
    const start = location.hash.slice(1);
    if (tabs.some(t => t[0] === start)) select(start);
    $('#listen').addEventListener('click', e => window.LISTEN.toggle(p, e.currentTarget, $('#player')));
  }
  renderLibrary();

  function renderLibrary() {
    const ids = Object.keys(library).filter(k => k !== id && D.get(k));
    $('#library').innerHTML = ids.length
      ? ids.map(k => { const a = D.get(k); return `<a href="album.html?id=${a.id}"><div class="thumb">${A.img(a, { decorative: true })}</div><b>${esc(a.title)}</b><br><span class="muted">${esc(a.artist)}</span></a>`; }).join('')
      : `<p class="muted">Records you tap appear here, so you can come back to them.</p>`;
  }
})();
