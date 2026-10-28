# Uncovered — uncovered.store

Website for **Uncovered** (*Records worth uncovering.*): new releases, preorders,
hand-graded used vinyl and record players.

A static site with no build step: plain HTML, CSS and JavaScript.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works, but a local server is closer to production.

## Pages

| Page | File |
|---|---|
| Homepage (Page 1 spec) | `index.html` |
| Last releases (Page 2 spec) | `new-releases.html` |
| Shop: categories, search, filters | `shop.html?cat=new / preorder / vinyl / players / sale / bestsellers / used` |
| Product pages (records, turntables, pack builder) | `product.html?id=…` |
| Our story / how it works (NFC sleeve) | `how-it-works.html` |
| Record page opened by the NFC sleeve | `album.html?id=…` (short link `/a/<id>`) |
| Cart & checkout | `cart.html` |
| Help (delivery, grading, returns, NFC, FAQ, contact) | `help.html` |
| Journal (SEO guides) | `journal/` |

## Catalogue: real data

- **Records:** 40 real releases. Tracklists, labels, catalogue numbers and release dates come from
  [MusicBrainz](https://musicbrainz.org/) (CC0). Covers come from the [Cover Art Archive](https://coverartarchive.org/)
  and are stored in `assets/img/covers/`. "Last releases" and "Coming soon" are actual September–November 2026 vinyl releases.
- **Turntables:** 7 real models (Audio-Technica, Rega, Technics, Pro-Ject). Photos are from Wikimedia Commons
  under CC BY / CC BY-SA, credited on each product page. Specs are limited to facts we could confirm; each page
  links to the maker's site.
- **Set by the team:** prices, stock, used-record grades and the monthly Reco. Edit them in
  `assets/js/catalog.js` (or regenerate it).
- "Listen to an extract" plays Deezer's public 30-second preview.

## Before launch

- Replace the demo checkout with Stripe or Shopify, and connect the newsletter/contact forms to a backend.
- Verify NFC sleeve tokens and sleeve codes server-side.
- Use your own photos of used records and pre-owned decks as stock arrives.

## Docs

- `docs/SEO-PLAN.md`: keyword targets and next steps.
- `docs/NETLINKING.md`: backlink partners and the pages that support them.

## Deploy

Static site, no build step. Netlify picks up `netlify.toml` and `_redirects`.
