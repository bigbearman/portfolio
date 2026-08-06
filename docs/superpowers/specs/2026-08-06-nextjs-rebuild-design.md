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
- **i18n**: route-based, `app/[lang]/page.tsx` with `generateStaticParams`
  returning `en` and `vi`. Each language gets its own URL and its own
  rendered HTML (fixes the SEO/crawlability gap from the old client-only
  `localStorage` toggle). `/` redirects to `/en` via a static
  `public/_redirects` rule (`/  /en  302`) — static export can't run
  middleware, and a static redirect is simplest for a fixed default.
- **Styling**: copy `styles.css` to `app/globals.css` verbatim, import once
  in the root layout. No CSS Modules conversion — not needed to hit the
  goal and would risk introducing class-name mismatches for no benefit.
- **Fonts**: JetBrains Mono via `next/font/google` instead of the current
  `<link>` tag — self-hosts the font file at build time, drops one
  render-blocking request to Google Fonts. Free side effect of the
  migration, not extra scope.
- **Contact form backend**: `functions/api/contact.js` is unchanged.
  Cloudflare Pages serves the static `out/` directory and the `functions/`
  directory independently, so the existing Resend + rate-limit + honeypot
  logic keeps working with zero edits.
- **Deploy**: `wrangler.jsonc` → `pages_build_output_dir: "out"`.
  `next.config.ts` → `output: 'export'`, `trailingSlash: true`,
  `images: { unoptimized: true }` (static export can't run the Next Image
  optimization API).

## Content

`content.js` → `content.ts`, same shape (`meta`, `nav`, `hero`, `about`,
`skills`, `experience`, `projects`, `lab`, `contact`, `footer`), typed with an
explicit `PortfolioContent` interface (no `any`). Changes from the current
data:

- Remove the two placeholder project entries ("Project Two", "Project
  Three" — `content.js:287-304`). Real projects get added back later as real
  entries when they exist; a visibly-fake "coming soon" card stays out.
- Each project's `screenshots` array becomes `{ src, alt }[]` so the
  slideshow can render a real, distinct `alt` per image instead of the
  current shared `"project screenshot"` string.

## Component mapping

`app.jsx` (999 lines, single client-rendered file) splits into:

**Server Components** (no client JS shipped): `About`, `Skills`,
`Experience`, `Lab`, `Footer`, and the static parts of `Nav`.

**Client Components** (need state/effects, marked `"use client"`):
- `ThemeToggle` — dark/light + `localStorage`, same behavior as today's
  `useLocalStorage` hook.
- `Hero` — terminal typing-command animation.
- `ProjectsSlideshow` — screenshot fade/interval carousel.
- `ContactForm` — form state + `fetch('/api/contact')`, same request shape
  the backend already expects (`name`, `email`, `message`, `website`
  honeypot, `lang`).

`image-slot.js` (641 lines) is dropped entirely. It's a custom element from
an unrelated design-prototyping tool (`window.omelette` runtime); outside
that runtime it only ever displays its `src` fallback, so in production it
was always equivalent to a plain `<img src="profile.webp">`. The rebuild
uses a plain `<img>` (or `next/image` with `unoptimized`) directly.

## SEO / metadata fixes

Bundled into this migration since the component tree is being rewritten
anyway:

- `generateMetadata` per `[lang]` layout: title, description sourced from
  `content.ts`, `alternates.languages` (`en`/`vi` hreflang pair),
  `openGraph` + `twitter` card metadata.
- Favicon via the `app/icon.png` file convention (Next.js wires the
  `<link>` automatically).
- One static `og-image.png` (1200×630) built from the profile photo + name
  — an implementation detail handled while coding, not a design decision.

## File layout (new)

```
app/
  layout.tsx                 root layout: <html>, next/font, globals.css
  icon.png                   favicon
  [lang]/
    layout.tsx                generateMetadata (title/og/hreflang per lang)
    page.tsx                  assembles the sections below
components/
  Nav.tsx
  ThemeToggle.tsx             "use client"
  Hero.tsx                    "use client"
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
  _redirects                  "/  /en  302"
  profile.webp, screenshots/*, Kien_Duong_CV.pdf   (moved as-is)
functions/api/contact.js      (unchanged)
wrangler.jsonc                (pages_build_output_dir: "out")
next.config.ts
```

## Testing

No test suite exists for this project today. Verification for this
migration is: `next build` succeeds with `output: 'export'`, the generated
`out/` serves both `/en` and `/vi` with correct hreflang/og tags, the
contact form still posts to `/api/contact` and gets a real response from
the unmodified Pages Function, and a manual pass through both language
routes checks visual parity against the current live site.
