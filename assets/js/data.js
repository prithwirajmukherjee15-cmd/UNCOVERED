/* Uncovered — catalogue API built on catalog.js (real records from MusicBrainz). */
(function () {
  const RAW = window.UNCOVERED_DATA;
  const albums = RAW.albums, players = RAW.players, packs = RAW.packs;
  // Code printed on each Uncovered sleeve (fallback for phones without NFC).
  const VIDEOS = window.UNCOVERED_VIDEOS || {};
  albums.forEach(a => { if (VIDEOS[a.id]) a.video = VIDEOS[a.id]; });
  albums.forEach(a => { a.code = 'UNC-' + a.mb.replace(/-/g, '').slice(0, 6).toUpperCase(); });
  const all = [...albums, ...players, ...packs];
  const byId = Object.fromEntries(all.map(p => [p.id, p]));
  const TODAY = '2026-10-28';
  const isPre = p => p.status === 'preorder';
  window.UNCOVERED = {
    albums, players, packs, all, credits: RAW.credits, today: TODAY,
    get: id => byId[id],
    categories: {
      new: { label: "What's new", intro: 'Everything that landed in the shop this week, from fresh pressings to rare second-hand finds.',
        test: p => (p.tags.includes('new') && !isPre(p)) || (p.condition !== 'New' && p.type !== 'pack') },
      preorder: { label: 'Preorder', intro: 'Reserve upcoming releases today and get them on release day, delivered to your door.', test: isPre },
      vinyl: { label: 'Vinyl', intro: 'New, reissued and used records across every genre, sorted and graded by hand.', test: p => p.type === 'vinyl' },
      players: { label: 'Record players', intro: 'Turntables for every budget, from first setups to audiophile decks, tested by our team.', test: p => p.type === 'player' },
      sale: { label: 'Special sales', intro: "Limited-time deals, clearance crates and bundle offers. When they're gone, they're gone.", test: p => !!p.oldPrice || p.type === 'pack' }
    },
    extraCategories: {
      bestsellers: { label: 'Best-sellers', intro: 'The records everyone is spinning right now. Chosen by our customers, approved by our team.', test: p => p.tags.includes('bestseller') },
      used: { label: 'Used & graded', intro: 'Second-hand records and turntables, checked, cleaned and graded by hand before they ship.', test: p => p.condition !== 'New' && p.type !== 'pack' },
      packs: { label: 'Packs', intro: 'A record player and three records of your choice, at a special price.', test: p => p.type === 'pack' }
    },
    lastReleases: () => albums.filter(a => a.tags.includes('new') && !isPre(a)).sort((a, b) => b.released.localeCompare(a.released)),
    comingSoon: () => albums.filter(isPre).sort((a, b) => a.released.localeCompare(b.released)),
    bestsellers: () => all.filter(p => p.rank).sort((a, b) => a.rank - b.rank)
  };
})();
