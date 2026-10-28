/* Uncovered — "Listen to an extract": plays Deezer's public 30-second preview of the album.
   Uses Deezer's JSONP search (no account needed). Falls back to opening Deezer search. */
(function () {
  let audio = null, current = null, n = 0;
  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const cb = '__dz' + (++n) + Date.now();
      const s = document.createElement('script');
      const t = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, 6000);
      function cleanup() { clearTimeout(t); delete window[cb]; s.remove(); }
      window[cb] = data => { cleanup(); resolve(data); };
      s.src = url + (url.includes('?') ? '&' : '?') + 'output=jsonp&callback=' + cb;
      s.onerror = () => { cleanup(); reject(new Error('network')); };
      document.head.append(s);
    });
  }
  async function findPreview(p) {
    const q = `artist:"${p.artist.split(' feat.')[0]}" album:"${p.title}"`;
    const d = await jsonp('https://api.deezer.com/search?q=' + encodeURIComponent(q) + '&limit=5');
    const hit = (d.data || []).find(t => t.preview);
    if (hit) return hit;
    const d2 = await jsonp('https://api.deezer.com/search?q=' + encodeURIComponent(p.artist + ' ' + p.title) + '&limit=5');
    return (d2.data || []).find(t => t.preview);
  }
  const deezerSearch = p => 'https://www.deezer.com/search/' + encodeURIComponent(p.artist + ' ' + p.title);

  // btn: the button; status: element showing "Now playing" + progress (class .player)
  async function toggle(p, btn, status) {
    if (audio && current === p.id) {
      audio.pause(); audio = null; current = null;
      btn.textContent = 'Listen to an extract'; status.classList.remove('is-playing'); status.hidden = true;
      return;
    }
    if (audio) audio.pause();
    btn.textContent = 'Loading…';
    try {
      const track = await findPreview(p);
      if (!track) throw new Error('none');
      audio = new Audio(track.preview); current = p.id;
      await audio.play();
      btn.textContent = 'Stop';
      status.hidden = false;
      status.querySelector('[data-now]').textContent = `Now playing: “${track.title}” · 30-second preview via Deezer`;
      status.classList.remove('is-playing'); void status.offsetWidth; status.classList.add('is-playing');
      audio.addEventListener('ended', () => { btn.textContent = 'Listen to an extract'; status.classList.remove('is-playing'); current = null; audio = null; });
      window.SITE && window.SITE.track('listen_extract', { item_id: p.id });
    } catch (e) {
      btn.textContent = 'Listen to an extract';
      window.open(deezerSearch(p), '_blank', 'noopener');
    }
  }
  window.LISTEN = { toggle, deezerSearch };
})();
