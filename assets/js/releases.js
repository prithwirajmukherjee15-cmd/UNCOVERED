/* Uncovered — Last releases page: release of the week, filters, 12-per-page grid, coming soon. */
(function () {
  const S = window.SITE, D = S.D, $ = S.$, $$ = S.$$, esc = S.esc, money = S.money;
  const PER_PAGE = 12;
  const outNow = D.lastReleases();
  const soon = D.comingSoon();
  const params = new URLSearchParams(location.search);
  const state = { show: params.get('show') === 'soon' ? 'soon' : 'out', genres: [], formats: [], editions: [], min: '', max: '', sort: 'newest', page: 1 };

  /* ---- Release of the week ---- */
  const w = outNow.find(p => p.tags.includes('week')) || outNow[0];
  $('#rotw').innerHTML = `
    <div class="rotw__media">${S.A.img(w, { eager: true })}</div>
    <div>
      <p class="eyebrow">Out ${S.date(w.released)}</p>
      <h3>${esc(w.title)}</h3>
      <p class="rotw__by">${esc(w.artist)}</p>
      <div class="rotw__meta"><span>${esc(w.label)}</span><span>${esc(w.format)}${w.editionNote ? ' · ' + esc(w.editionNote) : ''}</span><span>${w.trackCount} tracks</span></div>
      <blockquote>${esc(w.review || w.blurb)}<cite>The Uncovered team</cite></blockquote>
      <div class="buy-row">
        ${S.priceHTML(w)}
        <button class="btn" type="button" data-add="${w.id}">Add to cart</button>
        <button class="btn btn--ghost" type="button" id="listen">Listen to an extract</button>
      </div>
      <div class="player" id="player" hidden><span data-now></span><span class="player__bar"><span></span></span></div>
    </div>`;
  $('#listen').addEventListener('click', e => window.LISTEN.toggle(w, e.currentTarget, $('#player')));

  /* ---- Filters ---- */
  const pool = () => state.show === 'soon' ? soon : outNow;
  $('[data-count="out"]').textContent = outNow.length;
  $('[data-count="soon"]').textContent = soon.length;
  const FORMATS = ['LP', 'Double LP', '7"', 'Box set'];
  const EDITIONS = ['Standard', 'Limited', 'Coloured vinyl', 'Signed'];
  function buildChecks() {
    const all = [...outNow, ...soon];
    const genres = [...new Set(all.map(p => p.genre))].sort();
    const box = (name, values, list) => values.map(v => {
      const n = pool().filter(p => p[name] === v).length;
      return `<label class="check"><input type="checkbox" name="${name}" value="${esc(v)}"${list.includes(v) ? ' checked' : ''}> ${esc(v)} <small>${n}</small></label>`;
    }).join('');
    $('#f-genre').innerHTML = box('genre', genres, state.genres);
    $('#f-format').innerHTML = box('format', FORMATS, state.formats);
    $('#f-edition').innerHTML = box('edition', EDITIONS, state.editions);
  }

  function results() {
    const min = parseFloat(state.min), max = parseFloat(state.max);
    const list = pool().filter(p =>
      (!state.genres.length || state.genres.includes(p.genre)) &&
      (!state.formats.length || state.formats.includes(p.format)) &&
      (!state.editions.length || state.editions.includes(p.edition)) &&
      (isNaN(min) || p.price >= min) && (isNaN(max) || p.price <= max));
    const sorters = {
      newest: (a, b) => b.released.localeCompare(a.released),
      date: (a, b) => a.released.localeCompare(b.released),
      price: (a, b) => a.price - b.price
    };
    return list.sort(sorters[state.sort]);
  }

  function render(scroll) {
    const list = results();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    state.page = Math.min(state.page, pages);
    const slice = list.slice((state.page - 1) * PER_PAGE, state.page * PER_PAGE);
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'record' : 'records'} · ${state.show === 'soon' ? 'coming soon' : 'out now'}`;
    $('#grid').innerHTML = slice.length ? slice.map(p => S.card(p, { info: true })).join('')
      : `<div class="no-results" style="grid-column:1/-1"><p class="h-md">Nothing matches yet</p><p class="muted">Try another format or edition, or clear the filters.</p></div>`;
    $('#pager').innerHTML = pages > 1 ? `
      <button type="button" data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''} aria-label="Previous page">←</button>
      ${Array.from({ length: pages }, (_, i) => `<button type="button" data-page="${i + 1}"${i + 1 === state.page ? ' aria-current="page"' : ''}>${i + 1}</button>`).join('')}
      <button type="button" data-page="${state.page + 1}" ${state.page === pages ? 'disabled' : ''} aria-label="Next page">→</button>` : '';
    S.observeNew($('#grid'));
    if (scroll) $('#releases').scrollIntoView({ behavior: S.reduced ? 'auto' : 'smooth', block: 'start' });
    S.refresh();
  }

  $('#filters').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'show') { state.show = t.value; state.page = 1; buildChecks(); }
    if (t.name === 'genre') state.genres = $$('input[name="genre"]:checked').map(i => i.value);
    if (t.name === 'format') state.formats = $$('input[name="format"]:checked').map(i => i.value);
    if (t.name === 'edition') state.editions = $$('input[name="edition"]:checked').map(i => i.value);
    state.page = 1; render();
  });
  ['pmin', 'pmax'].forEach(id => $('#' + id).addEventListener('input', e => { state[id === 'pmin' ? 'min' : 'max'] = e.target.value; state.page = 1; render(); }));
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#f-reset').addEventListener('click', () => {
    Object.assign(state, { genres: [], formats: [], editions: [], min: '', max: '', page: 1 });
    $('#pmin').value = ''; $('#pmax').value = ''; buildChecks(); render();
  });
  $('#pager').addEventListener('click', e => { const b = e.target.closest('[data-page]'); if (b && !b.disabled) { state.page = +b.dataset.page; render(true); } });
  const ft = $('.filters-toggle');
  ft.addEventListener('click', () => { const open = !$('#filters').classList.contains('is-open'); $('#filters').classList.toggle('is-open', open); ft.setAttribute('aria-expanded', String(open)); });
  if (state.show === 'soon') $('input[name="show"][value="soon"]').checked = true;

  buildChecks();
  render();

  /* ---- Coming soon row ---- */
  $('#soon').innerHTML = soon.slice(0, 4).map(p => S.card(p, { info: true })).join('');
})();
