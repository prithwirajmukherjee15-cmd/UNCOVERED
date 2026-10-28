/* Uncovered — shop: categories, search, filters, sort and grouping (all kept in the URL). */
(function () {
  const S = window.SITE, D = S.D, $ = S.$, $$ = S.$$, esc = S.esc;
  const CATS = { ...D.categories, ...D.extraCategories };
  const params = new URLSearchParams(location.search);
  const state = {
    cat: CATS[params.get('cat')] ? params.get('cat') : '',
    q: params.get('q') || '',
    genres: (params.get('genre') || '').split(',').filter(Boolean),
    artist: params.get('artist') || '',
    avail: (params.get('avail') || '').split(',').filter(Boolean),
    group: params.get('group') || '',
    sort: params.get('sort') || 'featured'
  };

  const LEADS = Object.fromEntries(Object.entries(CATS).map(([k, c]) => [k, c.intro]));
  LEADS[''] = 'New, reissued and used records, and the turntables to play them. Browse by artist or genre.';

  // Category tabs
  const tabs = [['', 'All', D.all.length], ...Object.entries(CATS).map(([k, c]) => [k, c.label, D.all.filter(c.test).length])];
  $('#cat-tabs').innerHTML = tabs.map(([k, label, n]) =>
    `<a class="chip" href="?cat=${k}" data-cat="${k}" aria-current="${state.cat === k}">${label} <small>${n}</small></a>`).join('');

  // Filters
  const genres = [...new Set(D.albums.map(a => a.genre))].sort();
  $('#f-genre').innerHTML = genres.map(g =>
    `<label class="check"><input type="checkbox" name="genre" value="${esc(g)}"${state.genres.includes(g) ? ' checked' : ''}> ${esc(g)} <small>${D.albums.filter(a => a.genre === g).length}</small></label>`).join('');
  const artists = [...new Set(D.albums.map(a => a.artist))].sort((a, b) => a.localeCompare(b));
  $('#f-artist').insertAdjacentHTML('beforeend', artists.map(a => `<option${a === state.artist ? ' selected' : ''}>${esc(a)}</option>`).join(''));
  $$('input[name="avail"]').forEach(i => { i.checked = state.avail.includes(i.value); });
  $('#q').value = state.q;
  $('#group').value = state.group;
  $('#sort').value = state.sort;

  const featuredOrder = p => (p.rank ? p.rank / 100 : p.tags.includes('new') ? 1 : p.condition !== 'New' ? 2 : 3);
  const sorters = {
    featured: (a, b) => featuredOrder(a) - featuredOrder(b),
    popular: (a, b) => (a.rank || 99) - (b.rank || 99),
    newest: (a, b) => (b.released || '0').localeCompare(a.released || '0'),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    artist: (a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title)
  };

  function results() {
    const q = state.q.trim().toLowerCase();
    let list = D.all.filter(p => {
      if (state.cat && !CATS[state.cat].test(p)) return false;
      if (state.genres.length && !state.genres.includes(p.genre)) return false;
      if (state.artist && p.artist !== state.artist) return false;
      if (state.avail.length) {
        const a = p.status === 'preorder' ? 'preorder' : 'instock';
        if (!state.avail.includes(a)) return false;
      }
      if (q) {
        const hay = [p.title, p.artist, p.genre, p.label, p.format, p.edition, p.condition, ...(p.tracks || []).map(t => t[1])].join(' ').toLowerCase();
        if (!q.split(/\s+/).every(w => hay.includes(w))) return false;
      }
      return true;
    });
    return list.sort(sorters[state.sort] || sorters.featured);
  }

  function render() {
    const list = results();
    const cat = state.cat ? CATS[state.cat].label : 'Shop';
    $('#shop-title').textContent = cat;
    $('#crumb-cat').textContent = cat;
    $('#shop-lead').textContent = LEADS[state.cat] || LEADS[''];
    document.title = `${state.cat ? cat + ' — ' : 'Shop vinyl records & turntables — '}Uncovered`;
    $$('#cat-tabs .chip').forEach(c => c.setAttribute('aria-current', String(c.dataset.cat === state.cat)));
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}${state.q ? ` for “${state.q}”` : ''}`;

    const out = $('#results');
    if (!list.length) {
      out.innerHTML = `<div class="no-results"><p class="h-md">Nothing here yet</p><p class="muted">Try another search, or clear your filters.</p><button class="btn btn--ghost" type="button" id="nr-reset">Clear filters</button></div>`;
      $('#nr-reset').addEventListener('click', reset);
    } else if (state.group) {
      const key = p => state.group === 'artist' ? (p.type === 'vinyl' ? p.artist : 'Uncovered') : p.genre;
      const groups = {};
      list.forEach(p => (groups[key(p)] = groups[key(p)] || []).push(p));
      out.innerHTML = Object.keys(groups).sort((a, b) => a.localeCompare(b)).map(g =>
        `<section class="group"><h2 class="group-title">${esc(g)} <small>${groups[g].length}</small></h2><div class="grid">${groups[g].map(S.card).join('')}</div></section>`).join('');
    } else {
      out.innerHTML = `<div class="grid">${list.map(S.card).join('')}</div>`;
    }
    S.observeNew(out);
    syncURL();
  }

  function syncURL() {
    const p = new URLSearchParams();
    if (state.cat) p.set('cat', state.cat);
    if (state.q) p.set('q', state.q);
    if (state.genres.length) p.set('genre', state.genres.join(','));
    if (state.artist) p.set('artist', state.artist);
    if (state.avail.length) p.set('avail', state.avail.join(','));
    if (state.group) p.set('group', state.group);
    if (state.sort !== 'featured') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  }

  function reset() {
    Object.assign(state, { q: '', genres: [], artist: '', avail: [] });
    $('#q').value = ''; $('#f-artist').value = '';
    $$('.filters input').forEach(i => { i.checked = false; });
    render();
  }

  // Events
  $('#cat-tabs').addEventListener('click', e => {
    const a = e.target.closest('[data-cat]'); if (!a) return;
    e.preventDefault(); state.cat = a.dataset.cat; render();
  });
  let t;
  $('#q').addEventListener('input', e => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; render(); }, 160); });
  $('#q').addEventListener('search', e => { state.q = e.target.value; render(); });
  $('#group').addEventListener('change', e => { state.group = e.target.value; render(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#f-artist').addEventListener('change', e => { state.artist = e.target.value; render(); });
  $('#filters').addEventListener('change', e => {
    if (e.target.name === 'genre') state.genres = $$('input[name="genre"]:checked').map(i => i.value);
    if (e.target.name === 'avail') state.avail = $$('input[name="avail"]:checked').map(i => i.value);
    render();
  });
  $('#f-reset').addEventListener('click', reset);
  const ft = $('.filters-toggle');
  ft.addEventListener('click', () => {
    const open = !$('#filters').classList.contains('is-open');
    $('#filters').classList.toggle('is-open', open);
    ft.setAttribute('aria-expanded', String(open));
  });

  render();
  if (params.get('focus') === 'search') setTimeout(() => $('#q').focus(), 300);
})();
