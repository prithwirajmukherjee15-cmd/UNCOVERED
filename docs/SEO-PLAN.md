# Uncovered — SEO plan

> **Note:** the site is currently a single homepage. The journal and shop pages this plan refers to were removed and can be restored from the git history.

How the site targets the three search features from the brief, what's already built,
and what still needs checking. **No search volumes are included yet**: they must be
pulled from a keyword tool (see "Next steps").

## 1. Featured snippets (how-to and definition questions)

Each journal article opens with a **"Short answer" box**: a 40–60 word answer
written to be quoted directly by Google. Tables and numbered lists sit right under
it, since Google often lifts those as list or table snippets.

| Target question | Page | Snippet format |
|---|---|---|
| How to clean vinyl records | `journal/how-to-clean-vinyl-records.html` | Paragraph + numbered steps |
| Do you need speakers for a turntable? | `journal/do-you-need-speakers-for-a-turntable.html` | Paragraph + setup table |
| What's the difference between 33 and 45 RPM? | `journal/33-vs-45-rpm.html` | Paragraph + comparison table |

## 2. People Also Ask

Each article ends with a **"Questions people also ask"** block, marked up as
`FAQPage` structured data. The Help and How it works pages have FAQ markup too.

| Target question | Page |
|---|---|
| Are cheap record players bad for vinyl? | `journal/are-cheap-record-players-bad-for-vinyl.html` |
| Is it worth buying used vinyl records? | `journal/is-buying-used-vinyl-worth-it.html` |
| How long do vinyl records last? | `journal/how-long-do-vinyl-records-last.html` |
| Do I need an app for NFC / does the chip need a battery? | `how-it-works.html` |
| Delivery, returns, second-hand, rental questions | `help.html` |

Every article links to a relevant product or category (the brief's "introduce
beginners to our catalogue" goal).

## 3. Standard search snippets (purchase intent)

| Query type | Page | Notes |
|---|---|---|
| "buy [artist] vinyl", "[album] vinyl" | `product.html?id=…` | Title is `Album — Artist (Vinyl LP) — Uncovered`, with `Product` + `MusicAlbum` structured data (price, availability) |
| "vinyl records shop", "new vinyl releases", "vinyl pre-order" | `shop.html?cat=…` | One URL per category |
| "turntable with built-in preamp", "beginner turntable" | `product.html?id=uncovered-one`, `shop.html?cat=players` | |
| "second-hand vinyl records" | `journal/is-buying-used-vinyl-worth-it.html` | Uncovered sells new records only, so this targets the guide, not the shop |
| "turntable rental", "borrow vinyl records" | *(not targeted)* | **Decision needed:** only target these if Uncovered actually offers rental or borrowing. The Help FAQ says it doesn't yet. |

## Technical SEO already in place

- Unique `<title>`, meta description and canonical URL on every page
- `sitemap.xml` and `robots.txt` (cart and album hubs are `noindex`: hubs are private sleeve content)
- Structured data: `Organization` + `WebSite` (home), `Product`/`MusicAlbum` (products),
  `Article` + `FAQPage` + `BreadcrumbList` (journal), `FAQPage` (help, how it works)
- Fast, static pages with no images to download (covers are drawn as SVG)

**Known limitation:** product pages are rendered with JavaScript from `assets/js/data.js`.
Google does render JavaScript, but for best results generate static product pages
(or move to a commerce platform) before launch.

## Next steps: find the popular keywords

1. **Pull volumes** for every keyword above, plus variations, in
   [Google Keyword Planner](https://ads.google.com/home/tools/keyword-planner/) (free with an Ads account),
   or Semrush / Ahrefs. Check each target market separately (France, UK…).
2. **Mine real questions**: Google's "People also ask" boxes, AnswerThePublic,
   AlsoAsked, and Reddit threads such as r/vinyl and r/turntables.
3. **Check difficulty and current results**: who ranks now, and whether a
   featured snippet already exists (it's easier to win an existing snippet with a
   better answer than to create demand).
4. **Prioritise** by volume × purchase intent × how well we can answer it. Write
   the next articles from the top of that list.
5. After launch, connect **Google Search Console** and track impressions,
   clicks and snippet wins per article.

### Candidate keywords to check (no volumes yet)

- Beginner: *how to use a turntable*, *how to set up a record player*, *what is a phono preamp*,
  *belt drive vs direct drive*, *how to store vinyl records*, *why does my record skip*
- Buying: *best turntable for beginners*, *turntable with speakers*, *bluetooth turntable*,
  *vinyl gift ideas*, *limited edition vinyl*, *vinyl pre-order*
- Brand angle: *vinyl with digital content*, *NFC vinyl*, *exclusive album content*
