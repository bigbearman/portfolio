# Portfolio rebuild: static HTML/React-CDN → Next.js

Date: 2026-08-06

## Context

Current site (`index.html`, `app.jsx`, `content.js`) loads React, ReactDOM, and
Babel standalone from a CDN and transpiles JSX in the browser at runtime. No
build step, no SSR, no production React build. Prior review flagged this as
the main perf/SEO risk, plus a set of smaller issues (missing og/favicon meta,
generic alt text, two placeholder project cards, an unused prototyping widget
left wired into the hero avatar).

Goal: rebuild the same design and content on Next.js, fixing those issues as
part of the migration, without adding capabilities the site doesn't need.

## Non-goals

- No visual/UX redesign — port the current terminal/monospace look as-is.
- No CMS, no database, no dynamic per-request rendering — content stays
  hardcoded in a typed data module, same as today's `content.js`.
- No i18n library (`next-intl` etc.) — two languages with a data shape that
  already keys everything by `en`/`vi` doesn't need one.

## Decisions

- **Framework**: Next.js App Router, TypeScript.
- **Rendering**: static export (`output: 'export'`). The entire site is
  static content; static export needs no adapter (no OpenNext, no
  next-on-pages) and deploys to Cloudflare Pages exactly like today. If a
  genuine need for SSR/ISR shows up later (e.g. a CMS-driven blog needing
  on-demand revalidation), switch `next.config` + add an adapter then — the
  page/component code doesn't need to be rewritten for that.
- **i18n routing**: `app/[lang]/page.tsx` with `generateStaticParams`
  returning `en` and `vi`. Each language gets its own URL and its own
  rendered HTML (fixes the SEO/crawlability gap from the old client-only
  `localStorage` toggle). The language switcher is a plain server-rendered
  `<Link href="/vi/">` / `<Link href="/en/">` in `Nav` — no client JS, no
  `localStorage` for language. `kd:lang` is dropped; `localStorage` is only
  used for `kd:theme` now.
- **`/` redirect**: static export can't run middleware, so `/` → `/en/`
  (trailing slash, matching `trailingSlash: true` below) via
  `public/_redirects`: `/  /en/  302`. 302 not 301 — the default locale is
  hardcoded (no `Accept-Language` negotiation; Cloudflare's static
  `_redirects` can't inspect that header, and this app has no server to do
  it either) and may change later, so the redirect shouldn't be
  permanently cached by browsers/crawlers as a 301.
- **Root layout / `<html lang>` ownership**: no separate `app/layout.tsx`.
  `app/[lang]/layout.tsx` is the outermost layout in the tree (nothing
  above it), so Next.js treats it as the root layout and it owns
  `<html lang={lang}>` and `<body>` directly — no ownership split between
  a root wrapper and a lang layout. It also owns: `next/font` class on
  `<body>`, the `globals.css` import, `generateMetadata`, and the theme
  boot script (next bullet).
- **Theme FOUC**: `[lang]/layout.tsx` inlines a small blocking
  `<script>` (via `dangerouslySetInnerHTML`, no dependency) that reads
  `localStorage['kd:theme']` and sets `data-theme` on `<html>` before
  paint. Without it, a light-mode user gets a dark flash on load since the
  default `data-theme="dark"` is in the static HTML.
- **Absolute asset paths**: because pages are served from `/en/` and
  `/vi/` instead of `/`, every asset reference in `content.ts`
  (`meta.resumeUrl`, each project's `screenshots[].src`, the profile photo
  path) must be root-absolute (`/Kien_Duong_CV.pdf`, `/screenshots/...`,
  `/profile.webp`), not relative — a relative path resolves against the
  current `/en/…` URL and 404s.
- **Styling**: copy `styles.css` to `app/globals.css` verbatim, import once
  in `[lang]/layout.tsx`. No CSS Modules conversion — not needed to hit the
  goal and would risk introducing class-name mismatches for no benefit.
- **Fonts**: JetBrains Mono via `next/font/google` instead of the current
  `<link>` tag — self-hosts the font file at build time, drops one
  render-blocking request to Google Fonts. Free side effect of the
  migration, not extra scope.
- **Contact form backend**: `functions/api/contact.js` is unchanged and
  stays at the repo root (Cloudflare Pages Functions are discovered from a
  top-level `functions/` directory regardless of the static build output
  dir). The existing Resend + rate-limit + honeypot logic keeps working
  with zero edits.
- **Deploy surface**:
  - `next.config.ts`: `output: 'export'`, `trailingSlash: true`,
    `images: { unoptimized: true }` (static export can't run the Next
    Image optimization API).
  - `wrangler.jsonc`: `pages_build_output_dir: "out"`.
  - Cloudflare Pages build command becomes `next build`; build output
    directory `out`.
  - `deploy.sh` currently stages the old flat files and runs
    `wrangler pages deploy .` — it gets updated in this same PR to run
    `next build` and deploy `out/` instead of the repo root.
  - `SETUP.md`'s documented build settings get updated to match, same PR.
- **Old files removed in this PR**: `index.html`, `app.jsx`, `content.js`,
  `styles.css`, `image-slot.js` are deleted once their replacements exist
  (`content.ts`, `app/globals.css`, the new component tree) — no dead
  legacy runtime left behind. `portfolio-standalone.html` and
  `design-notes.md` are untracked scratch files unrelated to the build;
  left untouched.

## Content

`content.js` → `content.ts`, same shape (`meta`, `nav`, `hero`, `about`,
`skills`, `experience`, `projects`, `lab`, `contact`, `footer`), typed with an
explicit `PortfolioContent` interface (no `any`). Changes from the current
data:

- Remove the two placeholder project entries ("Project Two", "Project
  Three" — `content.js:287-304`) and drop `"placeholder"` from the
  project `status` union entirely (only real statuses like `"in-progress"`
  remain). Real projects get added back later as real entries when they
  exist; a visibly-fake "coming soon" card stays out.
- Each project's `screenshots` field becomes an optional
  `{ src: string; alt: string }[]` (optional because not every project has
  screenshots) so the slideshow renders a real, distinct `alt` per image
  instead of the current shared `"project screenshot"` string.
- All asset-path strings (`meta.resumeUrl`, `screenshots[].src`, profile
  photo path) are root-absolute — see Decisions.
- The contact form's client-side error messages (`ERR` map, currently
  hardcoded inside the form component) move into `content.ts` under
  `contact.en.errors` / `contact.vi.errors`, alongside the rest of the
  bilingual contact copy, instead of living in component code.

## Component mapping

`app.jsx` (999 lines, single client-rendered file) splits into:

**Server Components** (no client JS shipped): `Nav` (renders the lang
`<Link>` switcher directly), `Hero` (static markup — name, role, tags,
CTAs, avatar card, stats), `About`, `Skills`, `Experience`, `Lab`,
`Contact` (static copy + form shell), `Footer`.

**Client Components** (need state/effects, marked `"use client"`):
- `ThemeToggle` — dark/light + `localStorage['kd:theme']`, same behavior
  as today's `useLocalStorage` hook. The only interactive piece inside
  `Nav`.
- `Typewriter` — the terminal command-typing effect used inside `Hero`'s
  `hero__term` block (today's `TypeLine`-style component around
  `app.jsx:147`). Rendered as a small client island inside the otherwise
  server-rendered `Hero`, not by making the whole `Hero` client — the rest
  of the hero (tags, CTAs, avatar, stats) doesn't need JS.
- `ProjectsSlideshow` — screenshot fade/interval carousel.
- `ContactForm` — form state + `fetch('/api/contact')`, same request shape
  the backend already expects (`name`, `email`, `message`, `website`
  honeypot, `lang`); error strings read from `content.ts` per Content
  section above.

`image-slot.js` (641 lines) is dropped entirely. It's a custom element from
an unrelated design-prototyping tool (`window.omelette` runtime); outside
that runtime it only ever displays its `src` fallback, so in production it
was always equivalent to a plain `<img src="profile.webp">`. The rebuild
uses a plain `<img>` (or `next/image` with `unoptimized`) directly.

## SEO / metadata fixes

Bundled into this migration since the component tree is being rewritten
anyway:

- `generateMetadata` per `[lang]` layout: title, description sourced from
  `content.ts`, `alternates.canonical` + `alternates.languages` (`en`/`vi`
  hreflang pair), `openGraph` (incl. `locale` / `alternateLocale`) +
  `twitter` card metadata.
- Favicon via the `app/icon.png` file convention (Next.js wires the
  `<link>` automatically).
- One static `og-image.png` (1200×630) built from the profile photo + name
  — an implementation detail handled while coding, not a design decision.
- `app/robots.ts` + `app/sitemap.ts` (static export emits `robots.txt` /
  `sitemap.xml`) listing `/en/` and `/vi/`.

## GEO (Generative Engine Optimization)

Same migration pass — make the person/entity easy for AI answer engines
(ChatGPT, Perplexity, Gemini, Claude, AI Overviews) to extract and cite,
without changing the visual design or adding a CMS.

**In scope (static, data-driven, no UI redesign):**

- **JSON-LD** (`Person` + `WebSite` + `ProfilePage`) injected once per
  `[lang]` page via a small server component (`components/JsonLd.tsx`
  rendering a `<script type="application/ld+json">`). Sourced from
  `content.ts` so EN/VI descriptions stay in sync with visible copy.
  Minimum fields:
  - `Person`: `name`, `jobTitle`, `url`, `image`, `email`, `telephone`,
    `address` (Hanoi / VN), `knowsAbout` (from skills), `sameAs`
    (GitHub, LinkedIn, site — already in `meta`).
  - `WebSite`: `url`, `name`, `inLanguage` (`en` / `vi`), `author` →
    Person.
  - `ProfilePage` (or `WebPage`): `url`, `inLanguage`, `about` → Person,
    `isPartOf` → WebSite.
  - No `FAQPage` schema unless a real FAQ section is added to the UI
    later — inventing invisible FAQ markup is out of scope / risky.
- **`public/llms.txt`** (llmstxt.org convention): short Markdown index at
  the site root describing who this is, what they do, and the canonical
  pages (`/en/`, `/vi/`, résumé PDF, contact). Keep under ~40 lines,
  factual, no marketing fluff.
- **`robots.txt`**: explicitly allow major AI retrieval crawlers
  (`GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot` /
  `anthropic-ai`, `Google-Extended`) — do **not** block training/retrieval
  bots for a personal portfolio that wants to be cited. Sitemap URL
  pointed at the generated `sitemap.xml`.
- **Entity consistency**: one canonical English job title + one Vietnamese
  title used identically in `<title>`, OG, JSON-LD `jobTitle`, and
  `llms.txt` (already true via `content.meta.titleEn` / `titleVi` —
  enforce in the typed module, don't fork strings).
- **Semantic HTML hygiene** (no redesign): keep a single `<h1>`, real
  section headings (`<h2>` per section), descriptive `alt` on project
  screenshots (already required above). Generative engines lean on
  heading structure the same way classic crawlers do.

**Out of scope for GEO this pass:**

- No new FAQ / blog / "answer-first" content rewrite.
- No Wikidata / Knowledge Graph account creation.
- No analytics pipeline for LLM referral traffic (can add later in GA4).
- No separate AI-only landing page.
- **`llms-full.txt`** — skip for now. A full plain-text dump duplicating
  about/experience/projects is another copy of `content.ts` to keep in
  sync by hand; add it later only if there's actual evidence of AI-referral
  traffic worth optimizing for. `llms.txt` alone covers discoverability.

## File layout (new)

```
app/
  icon.png                   favicon
  robots.ts                  allow AI crawlers + sitemap URL
  sitemap.ts                 /en/ + /vi/
  [lang]/
    layout.tsx                root layout: <html lang>, <body>, next/font,
                               globals.css, generateMetadata, theme boot script
    page.tsx                  assembles sections + <JsonLd />
components/
  JsonLd.tsx                  Person / WebSite / ProfilePage JSON-LD
  Nav.tsx                     server; renders lang <Link> switcher
  ThemeToggle.tsx             "use client"
  Hero.tsx                    server; renders <Typewriter /> island
  Typewriter.tsx              "use client"
  About.tsx
  Skills.tsx
  Experience.tsx
  Projects.tsx
  ProjectsSlideshow.tsx       "use client"
  Lab.tsx
  Contact.tsx
  ContactForm.tsx             "use client"
  Footer.tsx
content.ts
app/globals.css              (copied from styles.css)
public/
  _redirects                  "/  /en/  302"
  llms.txt                    GEO index (llmstxt.org)
  og-image.png
  profile.webp, screenshots/*, Kien_Duong_CV.pdf   (referenced as /… absolute)
functions/api/contact.js      (unchanged, stays at repo root)
wrangler.jsonc                (pages_build_output_dir: "out")
next.config.ts
deploy.sh                     (updated: next build → deploy out/)
SETUP.md                      (updated build settings)
package.json                  next build → out/
```

Deleted: `index.html`, `app.jsx`, `content.js`, `styles.css`,
`image-slot.js`.

## Testing

No test suite exists for this project today. Verification for this
migration is:

- `next build` succeeds with `output: 'export'`.
- `out/` serves `/en/` and `/vi/` with correct canonical, hreflang, og,
  and twitter tags; public assets (`/profile.webp`, `/screenshots/*`,
  `/Kien_Duong_CV.pdf`) return 200 from both language routes.
- No dark/light theme flash on first paint in either language route.
- View-source on each lang shows JSON-LD (`Person` / `WebSite` /
  `ProfilePage`) with matching `inLanguage` and `sameAs` links.
- `/llms.txt` and `/robots.txt` / `/sitemap.xml` are reachable at the site
  root.
- Contact form still posts to `/api/contact` and gets a real response from
  the unmodified Pages Function.
- Manual pass through both language routes checks visual parity against
  the current live site (theme toggle, typing hero, slideshow, form).
