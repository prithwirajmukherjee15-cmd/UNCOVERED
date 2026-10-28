/* Uncovered — product imagery: real album covers and turntable photos. */
(function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const root = () => (document.body && document.body.dataset.root) || '';
  const alt = p => p.type === 'vinyl' ? `${p.title} by ${p.artist}, album cover` : p.type === 'player' ? `${p.artist} ${p.title} turntable` : p.title;
  function img(p, o = {}) {
    if (!p) return '';
    return `<img src="${root()}${p.img}" alt="${o.decorative ? '' : esc(alt(p))}" loading="${o.eager ? 'eager' : 'lazy'}" decoding="async"${o.cls ? ` class="${o.cls}"` : ''}>`;
  }
  // Kept under the old names so every page script keeps working.
  const cover = (p, o) => img(p, o);
  const visual = (p, o = {}) => `<div class="media media--${p.type}">${img(p, o)}</div>`;
  window.ART = { esc, img, cover, visual, alt };
})();
