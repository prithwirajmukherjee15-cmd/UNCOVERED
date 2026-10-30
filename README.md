<div align="center">

# UNCOVERED

### *Records worth uncovering.*

New releases · Preorders · Hand-graded used vinyl · Record players

**[uncovered-store.netlify.app](https://uncovered-store.netlify.app)** &nbsp;·&nbsp; `uncovered.store`

</div>

---

## Contents

1. [About](#about)
2. [The homepage, section by section](#the-homepage-section-by-section)
3. [The opening sequence](#the-opening-sequence)
4. [Real catalogue, no placeholders](#real-catalogue-no-placeholders)
5. [Design system](#design-system)
6. [Project structure](#project-structure)
7. [Run it locally](#run-it-locally)
8. [Deploy](#deploy)
9. [Editing the shop](#editing-the-shop)
10. [Measuring success](#measuring-success)
11. [Credits & licences](#credits--licences)
12. [Before launch](#before-launch)

---

## About

**Uncovered** is a record shop for people who'd rather listen than scroll. We dig through the crates so you don't have to: new releases, rare finds and second-hand gems, each one checked by hand before it ships.

This repository is the shop's website: a **single, premium homepage** on a black background, built with plain HTML, CSS and JavaScript. There's no framework and no build step.

| | |
|---|---|
| **Pages** | One: `index.html` |
| **Stack** | HTML · CSS · vanilla JavaScript · [Lenis](https://github.com/darkroomengineering/lenis) smooth scrolling |
| **Hosting** | Netlify (static) |
| **Catalogue** | 40 real records and 7 real turntables |

---

## The homepage, section by section

| # | Section | What it does |
|---|---|---|
| 1 | **Opening** | The hero video opens as a small rounded window and expands to full screen, then a popup plays (see below). |
| 2 | **Hero** | Full-screen turntable footage under a frosted glass panel: *"Records worth uncovering."*, with **Build my pack**, **Shop last releases** and **Our story**. |
| 3 | **Banner** | Three panels: **Our concept**, **Current Reco** (*Kind of Blue*, with a 30-second listen) and **Pack Offer**. They sit side by side on desktop and become a swipeable slider on mobile. |
| 4 | **Main menu** | What's new · Preorder · Vinyl · Record players · Special sales. Hovering shows each category's intro line, and clicking filters the Browse grid. |
| 5 | **Last releases** | The six newest records, with real September–October 2026 release dates. |
| 6 | **Best-sellers** | The top six, with **#1 / #2 / #3** badges. |
| 7 | **Video band** | Spinning vinyl grooves behind *"Every record, checked by hand."* |
| 8 | **Browse** | Every category plus search, in one grid. |
| 9 | **Build my pack** | Pick a turntable and three records. The visual updates live and **10% off** is applied automatically. |
| 10 | **Our story** | Dig · Check · Ship · Tap. |
| 11 | **Release alerts** | *"Never miss a release"*, a weekly Friday email sign-up. |
| 12 | **Footer** | Shop links, contact and credits. |

The **cart** is a slide-out drawer with a free-delivery meter. Hovering any product card slides the **record out of its sleeve**, with the real album cover as its label.

---

## The opening sequence

The opening follows a three-beat structure, on black:

```
 ① black page + announcement bar     ② window expands to full screen     ③ popup over the blurred hero
 ┌──────────────────────────┐         ┌──────────────────────────┐         ┌──────────────────────────┐
 │                          │         │ ◉ UNCOVERED      [pill] ≡│         │   ┌──────────────────┐   │
 │      ┌──────────┐        │   ──▶   │      hero video          │   ──▶   │   │  animated stage  │   │
 │      │  video   │        │         │  ┌────────────────────┐  │         │   ├──────────────────┤   │
 │      └──────────┘        │         │  │ Records worth …    │  │         │   │ headline · CTAs  │   │
 │                          │         │  └────────────────────┘  │         │   └──────────────────┘   │
 └──────────────────────────┘         └──────────────────────────┘         └──────────────────────────┘
```

The popup's stage loops through six scenes. Each record scene plays **that record's official video** in the background (muted, with a sound toggle):

| Scene | Record | Background video |
|---|---|---|
| *Uncover your vinyl.* | Uncovered label | none |
| *Your record.* | Kate Bush, *Hounds of Love* | *Running Up That Hill*, official |
| Finder: **Hounds of Love** | Kate Bush, *Hounds of Love* | *Running Up That Hill*, official |
| Finder: **Moon Safari** | Air, *Moon Safari* | *Sexy Boy*, official |
| **Graded.** | Talking Heads, *Remain in Light* | *Once in a Lifetime*, official |
| **Flip.** | David Bowie, *Hunky Dory* | *Life On Mars?*, official |

Below the stage: *"We dug through everything. And that uncovers everything."* with **Try it now** and **Maybe later ›**.

> **Notes**
> - Only videos whose owners allow embedding are used. A video fades in only once YouTube reports it's playing; otherwise the scene keeps its tinted background.
> - The popup shows once per browser session. Add `#opening` to the URL to see it again.
> - The card always fits the screen, so the buttons are never cut off.

---

## Real catalogue, no placeholders

| Data | Source |
|---|---|
| Tracklists, labels, catalogue numbers, release dates | [MusicBrainz](https://musicbrainz.org/) (public-domain core data) |
| Album covers | [Cover Art Archive](https://coverartarchive.org/), stored in `assets/img/covers/` |
| Turntable photos | [Wikimedia Commons](https://commons.wikimedia.org/) (CC BY / CC BY-SA), stored in `assets/img/players/` |
| Hero and band footage | Beachfront B-Roll via the [Internet Archive](https://archive.org/details/RecordPlayer) (CC BY 3.0) |
| 30-second extracts | Deezer public previews |

**What's in the shop**

- **New releases:** *Back to Black* (20th-anniversary zoetrope), Iommi, Insomnium, Hole reissues, Meshell Ndegeocello, John Williams on gold vinyl…
- **Preorders:** Shygirl (signed), Arca, Because of Art, Mylène Farmer 7", the *Stranger Things* 17-LP box…
- **Best-sellers:** *Rumours*, *Random Access Memories*, *Moon Safari*, *Kind of Blue*, *Histoire de Melody Nelson*…
- **Used & graded:** *Hunky Dory*, *Remain in Light*, *What's Going On*, *Hounds of Love*…
- **Record players:** Audio-Technica AT-LP60, Rega Planar 2 & 3, Technics SL-1200 (1972) & MK5, Pro-Ject RPM 3 Carbon & X8 Evolution.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0E0D0C` / `#000` on the homepage | Background |
| `--text` | `#EDE6DA` | Ivory text |
| `--muted` | `#A39B8F` | Secondary text |
| `--brass` | `#C9A26B` | Accents, primary buttons |
| `--red` | `#E06A42` | Sale badges, low stock |

| Font | Used for |
|---|---|
| **Anton** | The UNCOVERED wordmark |
| **Inter** | UI, the hero and popup headlines (tight tracking) |
| **Instrument Serif** | Editorial headings |

**Motion:** the expanding hero, frosted glass, scroll reveals, records sliding out of sleeves, a speed-reactive announcement marquee and Lenis smooth scrolling. Everything respects *reduce motion*, and videos pause when off screen.

---

## Project structure

```
UNCOVERED/
├── index.html              ← the single homepage
├── assets/
│   ├── css/style.css       ← all styles, design tokens at the top
│   ├── js/
│   │   ├── catalog.js      ← generated catalogue data (records, players, pack)
│   │   ├── data.js         ← catalogue helpers and categories
│   │   ├── art.js          ← image helpers
│   │   ├── main.js         ← header, menu, cart drawer, footer, scroll engine
│   │   ├── home.js         ← homepage rows, Browse, pack builder, slider
│   │   ├── opening.js      ← opening sequence and popup
│   │   └── listen.js       ← Deezer 30-second extracts
│   ├── img/covers/         ← 40 album covers
│   ├── img/players/        ← turntable photos
│   └── video/              ← hero and band footage (MP4 + WebM + posters)
├── docs/
│   ├── SEO-PLAN.md         ← keyword targets
│   └── NETLINKING.md       ← backlink partners
├── netlify.toml · robots.txt · sitemap.xml · favicon.svg
└── README.md
```

---

## Run it locally

```bash
git clone https://github.com/prithwirajmukherjee15-cmd/UNCOVERED.git
cd UNCOVERED
python3 -m http.server 8000      # or: npx serve
```

Then open **http://localhost:8000**.

---

## Deploy

The site is static, so there's no build command. Netlify reads `netlify.toml` and publishes the repository root.

1. In Netlify, choose **Add new site → Import from Git** and pick this repo, branch `main`.
2. Leave the build command empty and set the publish directory to `.`.
3. Under **Domain management**, add `uncovered.store`.

When you change CSS or JS, bump the `?v=` number on its `<script>` / `<link>` tag in `index.html` so returning visitors get the new file.

---

## Editing the shop

Everything lives in **`assets/js/catalog.js`**:

| To change | Edit |
|---|---|
| Prices, sale prices | `price`, `oldPrice` |
| Stock, "Only 3 left" | `status: 'low'`, `stock` |
| Used record grades | `grade: ['VG+', 'VG']` (record, sleeve) |
| Best-seller order | `rank` |
| Release of the week | `tags: ['new', 'week']` |
| Current Reco | the banner panel in `index.html` |
| Popup records and videos | `VIDEOS` and `scenes` in `assets/js/opening.js` |

---

## Measuring success

Events are pushed to `window.dataLayer`, ready for Google Tag Manager / GA4:

| Event | When |
|---|---|
| `add_to_cart`, `begin_checkout` | Shopping |
| `opening_try_it`, `opening_dismiss` | Popup choice |
| `listen_extract` | A 30-second preview plays |
| `newsletter_signup` | Release-alert sign-up |

---

## Credits & licences

- **Footage:** "Record Player Close Up" and "Vinyl Record Looping Background" by Beachfront B-Roll (Jeffrey Beach), CC BY 3.0.
- **Turntable photos:** Wikimedia Commons contributors (Adrian DuMay, Jacques from Cape Town, kenji ross, WeKn0What!, BMRR, MärkJ2057, Solomon203), CC BY / CC BY-SA. Credited on the site.
- **Release data:** MusicBrainz. **Covers:** Cover Art Archive. Album artwork belongs to the artists and labels.
- **Videos in the popup:** official uploads embedded from the artists' YouTube channels.

---

## Before launch

- [ ] Set real prices, stock and grades in `catalog.js`
- [ ] Connect checkout (Stripe or Shopify); the cart currently stops at "Checkout opens at launch"
- [ ] Connect the release-alert form (Klaviyo, Mailchimp or Netlify Forms)
- [ ] Replace stock photos with your own shots of used records and pre-owned decks
- [ ] Point `uncovered.store` at Netlify

<div align="center">

---

**UNCOVERED** · *Records worth uncovering.*

</div>
