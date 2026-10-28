# Uncovered — uncovered.store

Website for **Uncovered**: vinyl records in connected (NFC) sleeves that unlock
exclusive album content, plus the turntables to play them.

A static site with no build step: plain HTML, CSS and JavaScript.

## Run it locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works, but a local server is closer to production.

## Pages (from the blueprint)

| Page | File | Purpose |
|---|---|---|
| Homepage | `index.html` | Concept, current recommendation, pack offer, latest releases, best-sellers |
| Shop | `shop.html` | Catalogue by category, artist and genre, with search, filters and sorting |
| Product pages | `product.html?id=…` | Details, tracklist, price, availability, what's inside the sleeve |
| How it works | `how-it-works.html` | Connected sleeve explained, NFC instructions, sleeve-code unlock |
| Cart & checkout | `cart.html` | Cart → delivery → payment → confirmation |
| Album content hub | `album.html?id=…` | Story, interview, lyrics, live session for each album |
| Help & contact | `help.html` | Delivery, returns, NFC troubleshooting, FAQ, contact |
| Journal | `journal/` | SEO guides (see `docs/SEO-PLAN.md`) |

Shop, How it works and Help are in the top bar on every page.

## The three journeys

1. **Discovery and purchase:** Home → Shop → Product → Cart → Checkout → Confirmation
2. **Content access:** tap the sleeve → `https://uncovered.store/a/<album-id>?k=<token>` → album hub.
   The `_redirects` file (Netlify) serves these short links from `album.html`, so the
   sleeve opens the hub directly, skipping the homepage.
3. **Support:** Help → FAQ / NFC troubleshooting → contact form

## Measuring success

`assets/js/main.js` pushes events to `window.dataLayer` (ready for Google Tag Manager / GA4):

| Blueprint measure | Event |
|---|---|
| Completed purchases | `purchase` (plus `add_to_cart`, `begin_checkout`) |
| Successful content access after an NFC tap | `nfc_access` (`source`: `nfc`, `sleeve_code` or `preview`) |
| Repeat visits to album content | `hub_repeat_visit`, `content_view` |

## Project structure

```
index.html, shop.html, product.html, cart.html, album.html, how-it-works.html, help.html, 404.html
journal/                 SEO articles
assets/css/style.css     all styles (design tokens at the top)
assets/js/data.js        catalogue: albums, record players, packs
assets/js/art.js         generated cover art, vinyl and turntable visuals
assets/js/main.js        header, footer, cart, drawer, scroll effects, analytics
assets/js/*.js           one script per page
docs/SEO-PLAN.md         keyword targets and next steps
sitemap.xml, robots.txt, _redirects
```

## Design

- Framed, editorial layout from the homepage mockup: paper background, heavy black rules,
  the UNCOVERED wordmark, the "Our concept / Current Reco / Pack Offer" row and the category row.
- Scroll-driven scenes: the Last releases shelf scrolls sideways, the best-seller
  turntable drops its needle and spins, the record slides out of its sleeve in "Our concept",
  the pack fans out. Smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis);
  everything still works without it.
- Fonts: Anton (display), Instrument Serif (accents), Inter (text), from Google Fonts.
- Respects "reduce motion" settings. Mobile layouts replace pinned scenes with normal scrolling.
- The headphones icon (top-left, desktop) toggles a generated vinyl-crackle ambience.

## Before launch (demo parts to replace)

- **Catalogue:** artists and albums in `data.js` are placeholders, and cover art is generated.
  Swap in the real catalogue, artwork and prices.
- **Payments:** checkout is a demo and takes no payment. Connect Stripe, or move the shop to
  Shopify and keep this design as the theme.
- **Sleeve tokens:** the hub only checks that a token is present, and the sleeve codes live in
  `data.js`. Verify tokens and codes server-side and serve hub content from an API.
- **Media:** the live-session player is a placeholder. Host videos on Vimeo, Mux or YouTube.
- **Forms:** newsletter and contact forms need a backend (e.g. Netlify Forms, Klaviyo).
- **SEO:** product pages are rendered by JavaScript; pre-render them for the best indexing.

## Deploy

Any static host works. On Netlify, drag the folder in or connect the repo (no build command,
publish directory `/`); `_redirects` is picked up automatically. Point `uncovered.store` at it.
