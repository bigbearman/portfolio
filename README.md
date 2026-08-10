# kiendt.dev

Personal portfolio for Kien Duong — Senior Frontend Engineer. Terminal/developer-themed, single-page, bilingual (EN/VI), built with Next.js and statically exported to Cloudflare Pages.

**Live:** [kiendt.dev](https://kiendt.dev)

## Stack

- [Next.js](https://nextjs.org) 15 (App Router, static export)
- React 18 + TypeScript
- Plain CSS (no framework) — JetBrains Mono, terminal aesthetic
- Content lives in one typed module: [`content.ts`](./content.ts)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com), auto-built from `main` via Git integration
- Contact form backed by a Cloudflare Pages Function (`functions/api/contact.js`) + [Resend](https://resend.com)

## Structure

```text
app/[lang]/       route per locale (en, vi)
components/       page sections (Hero, About, Experience, Projects, Lab, Contact, Footer)
content.ts        all copy + data, typed, both languages
functions/api/     Cloudflare Pages Function (contact form)
public/           static assets, screenshots, _headers, _redirects
```

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run build         # static export to out/
```

The contact form needs Cloudflare Pages Functions to run, which `next dev` doesn't serve. To test it locally:

```bash
npm run build
npx wrangler pages dev out
```

## Deploy

Push to `main` — Cloudflare Pages Git integration builds and deploys automatically. See [`SETUP.md`](./SETUP.md) for first-time project setup (env vars, domain, Resend).
