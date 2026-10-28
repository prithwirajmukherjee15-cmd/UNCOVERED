/* Uncovered — generated visuals: album covers (SVG), vinyl discs and turntables (HTML/CSS).
   Covers are drawn from each album's `art` settings so no image files are needed. */
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Small seeded random generator so each cover is always drawn the same way.
  function rng(seed) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => {
      h += 0x6D2B79F5;
      let t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pattern(p) {
    const { pattern, bg, fg, accent } = p.art;
    const R = rng(p.id);
    let s = '';
    switch (pattern) {
      case 'waves':
        for (let i = 0; i < 14; i++) {
          const y = 112 + i * 15;
          let d = `M-10 ${y}`;
          for (let x = -10; x <= 410; x += 10) d += ` L${x} ${(y + Math.sin(x / 38 + i * 0.55) * (5 + i * 0.9)).toFixed(1)}`;
          const hi = i % 5 === 3;
          s += `<path d="${d}" fill="none" stroke="${hi ? accent : fg}" stroke-width="${hi ? 3 : 1.4}" opacity="${(0.35 + i * 0.045).toFixed(2)}"/>`;
        }
        s += `<circle cx="300" cy="92" r="30" fill="${accent}"/>`;
        break;
      case 'bauhaus':
        s += `<circle cx="128" cy="150" r="92" fill="${accent}"/><rect x="206" y="58" width="140" height="140" fill="${fg}"/>
              <circle cx="276" cy="128" r="36" fill="${bg}"/><path d="M206 340 A134 134 0 0 1 340 206 L340 340 Z" fill="${fg}"/>
              <rect x="48" y="272" width="118" height="14" fill="${accent}"/><rect x="48" y="300" width="70" height="14" fill="${fg}"/>`;
        break;
      case 'rings':
        for (let i = 10; i > 0; i--) s += `<circle cx="226" cy="196" r="${i * 14}" fill="none" stroke="${fg}" stroke-width="${i % 4 === 0 ? 2.6 : 1}" opacity="${(0.3 + (10 - i) * 0.06).toFixed(2)}"/>`;
        s += `<circle cx="226" cy="196" r="20" fill="${accent}"/><line x1="40" y1="340" x2="360" y2="340" stroke="${fg}" stroke-width="1" opacity=".6"/>`;
        break;
      case 'arches':
        for (let i = 0; i < 6; i++) {
          const w = 312 - i * 48, x = (400 - w) / 2, top = 70 + i * 26;
          s += `<path d="M${x} 340 L${x} ${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2} L${x + w} 340 Z" fill="${i === 5 ? accent : i % 2 ? bg : fg}"/>`;
        }
        break;
      case 'bars':
        for (let i = 0; i < 26; i++) {
          const h = 24 + R() * 196;
          s += `<rect x="${(34 + i * 13).toFixed(1)}" y="${(300 - h).toFixed(1)}" width="7" height="${h.toFixed(1)}" fill="${i === 17 ? accent : fg}"/>`;
        }
        s += `<rect x="34" y="308" width="332" height="2" fill="${fg}"/>`;
        break;
      case 'sun':
        s += `<circle cx="200" cy="206" r="126" fill="${accent}"/>`;
        for (let i = 0; i < 8; i++) s += `<rect x="60" y="${214 + i * 15}" width="280" height="${(2 + i * 1.6).toFixed(1)}" fill="${bg}"/>`;
        s += `<rect x="40" y="338" width="320" height="2" fill="${fg}"/>`;
        break;
      case 'letter':
        s += `<text x="96" y="452" font-family="Anton, Impact, sans-serif" font-size="520" fill="${fg}">${esc(p.title[0])}</text>
              <rect x="40" y="70" width="14" height="250" fill="${accent}"/>`;
        break;
      case 'moon':
        s += `<circle cx="210" cy="196" r="118" fill="${accent}"/><circle cx="256" cy="168" r="104" fill="${bg}"/>`;
        for (let i = 0; i < 22; i++) s += `<circle cx="${(30 + R() * 340).toFixed(1)}" cy="${(60 + R() * 270).toFixed(1)}" r="${(1 + R() * 2).toFixed(1)}" fill="${fg}" opacity=".7"/>`;
        s += `<path d="M0 330 Q100 300 200 322 T400 312 L400 340 L0 340Z" fill="${fg}" opacity=".85"/>`;
        break;
      case 'keys': {
        const white = 14, w = 320 / white;
        for (let i = 0; i <= white; i++) s += `<line x1="${40 + i * w}" y1="70" x2="${40 + i * w}" y2="320" stroke="${fg}" stroke-width="1.2"/>`;
        s += `<rect x="40" y="70" width="320" height="250" fill="none" stroke="${fg}" stroke-width="2"/>`;
        [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].forEach((k, j) => {
          s += `<rect x="${(40 + (k + 1) * w - w * 0.3).toFixed(1)}" y="70" width="${(w * 0.6).toFixed(1)}" height="150" fill="${j === 6 ? accent : fg}"/>`;
        });
        break;
      }
      case 'dots':
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
          const big = x === 5 && y === 2;
          s += `<circle cx="${68 + x * 38}" cy="${74 + y * 36}" r="${big ? 17 : (3 + R() * 11).toFixed(1)}" fill="${big ? accent : fg}" opacity="${big ? 1 : (0.45 + R() * 0.5).toFixed(2)}"/>`;
        }
        break;
      case 'stripes':
        s += `<clipPath id="clip-${p.id}"><rect x="0" y="64" width="400" height="272"/></clipPath><g clip-path="url(#clip-${p.id})"><g transform="rotate(-28 200 200)">`;
        for (let i = 0; i < 12; i++) s += `<rect x="-200" y="${-100 + i * 52}" width="800" height="${i % 3 === 1 ? 26 : 12}" fill="${i % 3 === 1 ? accent : fg}"/>`;
        s += `</g></g>`;
        break;
      case 'rays':
        for (let i = 0; i < 18; i++) {
          const a0 = Math.PI + (i / 18) * Math.PI, a1 = Math.PI + ((i + 0.5) / 18) * Math.PI;
          s += `<path d="M200 340 L${(200 + Math.cos(a0) * 420).toFixed(1)} ${(340 + Math.sin(a0) * 420).toFixed(1)} L${(200 + Math.cos(a1) * 420).toFixed(1)} ${(340 + Math.sin(a1) * 420).toFixed(1)}Z" fill="${i % 2 ? accent : fg}" opacity="${i % 2 ? 0.9 : 0.16}"/>`;
        }
        s += `<circle cx="200" cy="340" r="70" fill="${accent}"/><rect x="0" y="338" width="400" height="62" fill="${bg}"/>`;
        break;
    }
    return s;
  }

  function cover(p, opts = {}) {
    if (!p || !p.art || !p.art.pattern) return '';
    const a = p.art, ink = a.ink || a.fg;
    const label = `${p.title} by ${p.artist}, album cover`;
    const text = opts.text === false ? '' :
      `<g font-family="Inter, Arial, sans-serif" fill="${ink}" stroke="${a.bg}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">
         <text x="24" y="40" font-size="12.5" font-weight="600" letter-spacing="2">${esc(p.artist.toUpperCase())}</text>
         <text x="24" y="376" font-family="Anton, Impact, sans-serif" font-size="24" letter-spacing=".5">${esc(p.title.toUpperCase())}</text>
       </g>`;
    return `<svg class="cover-svg" viewBox="0 0 400 400" role="img" aria-label="${esc(label)}"><rect width="400" height="400" fill="${a.bg}"/>${pattern(p)}${text}</svg>`;
  }

  // A vinyl record. Outer wrapper stays still (it carries the light reflection),
  // the inner disc is what spins.
  function disc(label = '#C2471B', o = {}) {
    return `<div class="disc ${o.cls || ''}" style="--label:${label}" aria-hidden="true">
      <div class="disc__vinyl"><span class="disc__label"><b>UNCOVERED</b><i>${esc(o.side || 'Side A · 33⅓')}</i></span></div>
    </div>`;
  }

  // Top-down turntable. The SVG arm is drawn in a 500×400 space that matches the plinth.
  function turntable(o = {}) {
    return `<div class="tt ${o.cls || ''}" style="--plinth:${o.plinth || '#1C1C1C'};--plinth-2:${o.plinth2 || '#2A2A2A'}" aria-hidden="true">
      <div class="tt__body">
        <div class="tt__platter">${disc(o.label || '#C2471B', { side: o.side })}</div>
        <svg class="tt__svg" viewBox="0 0 500 400">
          <circle cx="430" cy="80" r="32" class="tt__base"/>
          <rect x="452" y="286" width="12" height="34" rx="4" class="tt__rest"/>
          <g class="tt__arm">
            <rect x="416" y="16" width="28" height="36" rx="6" class="tt__cw"/>
            <line x1="430" y1="52" x2="430" y2="300" class="tt__tube"/>
            <line x1="430" y1="299" x2="420" y2="318" class="tt__tube"/>
            <rect x="406" y="312" width="24" height="36" rx="3" class="tt__head" transform="rotate(22 418 330)"/>
            <circle cx="430" cy="80" r="13" class="tt__pivot"/>
          </g>
          <g class="tt__ctrl">
            <circle cx="440" cy="358" r="13"/>
            <rect x="34" y="364" width="30" height="12" rx="2"/><rect x="70" y="364" width="30" height="12" rx="2"/>
          </g>
          <circle cx="470" cy="358" r="3.5" class="tt__led"/>
        </svg>
      </div>
    </div>`;
  }

  // Sleeve with a record peeking out — used on product cards and pages.
  function sleeve(p, o = {}) {
    return `<div class="sleeve ${o.cls || ''}">
      ${disc(p.art.label || p.art.accent, { cls: 'sleeve__disc' })}
      <div class="sleeve__cover">${cover(p)}<span class="nfc-dot" title="Connected sleeve"></span></div>
    </div>`;
  }

  function packVisual(p, picks) {
    const D = window.UNCOVERED;
    const covers = (picks && picks.length ? picks : ['saint-ouen-sessions', 'velvet-static', 'midnight-ledger']).slice(0, 3).map(id => D.get(id));
    return `<div class="packvis">
      <div class="packvis__covers">${covers.map((c, i) => `<div class="packvis__cover" style="--i:${i}">${cover(c, { text: false })}</div>`).join('')}</div>
      <div class="packvis__tt">${turntable(p.art)}</div>
    </div>`;
  }

  // Picks the right visual for any product type.
  function visual(p, o = {}) {
    if (p.type === 'vinyl') return sleeve(p, o);
    if (p.type === 'player') return `<div class="tt-wrap">${turntable({ ...p.art, cls: o.cls })}</div>`;
    if (p.type === 'pack') return packVisual(p);
    return '';
  }

  window.ART = { cover, disc, turntable, sleeve, packVisual, visual, esc };
})();
