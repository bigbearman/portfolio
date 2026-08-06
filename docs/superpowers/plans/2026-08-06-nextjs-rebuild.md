# Next.js Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current CDN-React/Babel-runtime portfolio as a Next.js App Router site with the same design and content, fixing the perf/SEO/GEO issues found in review, deployed as a Cloudflare Pages static export.

**Architecture:** Next.js 15 App Router + TypeScript, `output: 'export'`. Route `app/[lang]/` (en/vi) via `generateStaticParams`, static HTML per language with real hreflang/OG/JSON-LD metadata. `functions/api/contact.js` (Cloudflare Pages Function, Resend-backed) is untouched and keeps serving `/api/contact` alongside the static export.

**Tech Stack:** Next.js 15, React 18, TypeScript, `next/font/google`, `next/og` (ImageResponse), Cloudflare Pages (static export). No new runtime dependency beyond `next`/`react`/`react-dom`/`typescript`.

## Global Constraints

- TypeScript strict mode, no `any` (project rule) — every new file is `.ts`/`.tsx` with explicit types, no implicit `any`.
- `next.config.ts`: `output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }` — no adapter (no OpenNext, no next-on-pages).
- No i18n library — `Lang = "en" | "vi"`, content keyed by hand in `content.ts`.
- No visual/UX redesign — every class name and DOM structure below is a direct port of the current `app.jsx` / `styles.css`, not a rewrite.
- Every asset path in content/components is root-absolute (`/profile.webp`, `/screenshots/...`, `/Kien_Duong_CV.pdf`) — pages live under `/en/` and `/vi/`, so relative paths break.
- `functions/api/contact.js` is not modified in this plan. It stays at the repo root; Cloudflare Pages serves it independently of the static `out/` directory.
- Reference source files (read-only, for porting): `content.js`, `app.jsx`, `styles.css`, `functions/api/contact.js`.

---

### Task 1: Project scaffold + walking skeleton

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/[lang]/layout.tsx` (bare version — upgraded in Task 3)
- Create: `app/[lang]/page.tsx` (placeholder — replaced incrementally through Task 11)
- Modify: `.gitignore`

**Interfaces:**
- Produces: `Lang` route param contract (`"en" | "vi"`) that every later `app/[lang]/*` file and component relies on via `generateStaticParams`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "portfolio",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Create bare root layout `app/[lang]/layout.tsx`**

```tsx
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "vi" }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Create placeholder page `app/[lang]/page.tsx`**

```tsx
export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: "en" | "vi" }>;
}) {
  const { lang } = await params;
  return <p>{lang}</p>;
}
```

- [ ] **Step 6: Update `.gitignore`**

Add these lines (keep everything already in the file):

```
# Next.js
node_modules/
.next/
out/
next-env.d.ts
```

- [ ] **Step 7: Install and build**

Run: `npm install`
Run: `npm run build`
Expected: build succeeds, `out/en/index.html` contains `<p>en</p>`, `out/vi/index.html` contains `<p>vi</p>`.

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts app/ .gitignore
git commit -m "chore: scaffold Next.js app with en/vi walking skeleton"
```

---

### Task 2: Typed content module

**Files:**
- Create: `content.ts`
- Modify: `app/[lang]/page.tsx` (temporary: render `content.meta.name` to prove the module loads)

**Interfaces:**
- Consumes: nothing new.
- Produces: `export type Lang = "en" | "vi"`, `export interface PortfolioContent { ... }`, `export const content: PortfolioContent`. Every component task from here on imports `{ content, type Lang } from "@/content"`.

- [ ] **Step 1: Create `content.ts`**

```ts
export type Lang = "en" | "vi";

interface Localized<T> {
  en: T;
  vi: T;
}

interface MetaContent {
  name: string;
  handle: string;
  titleEn: string;
  titleVi: string;
  location: string;
  timezone: string;
  email: string;
  phone: string;
  site: string;
  github: string;
  linkedin: string;
  yearsExp: number;
  resumeUrl: string;
}

interface NavLabels {
  about: string;
  skills: string;
  work: string;
  projects: string;
  lab: string;
  contact: string;
  resume: string;
}

interface HeroContent {
  greet: string;
  role: string;
  sub: string;
  tags: string[];
  ctaPrimary: string;
  ctaSecondary: string;
  commands: [string, string];
}

type AboutLineKind = "h" | "p" | "li";

interface AboutLine {
  kind: AboutLineKind;
  text: string;
}

interface AboutContent {
  file: string;
  lines: AboutLine[];
}

interface SkillGroup {
  key: string;
  label: Localized<string>;
  items: string[];
}

interface ExperienceEntry {
  role: Localized<string>;
  org: string;
  where: string;
  period: Localized<string>;
  duration: Localized<string>;
  tag?: "current";
  bullets: Localized<string[]>;
}

interface ProjectScreenshot {
  src: string;
  alt: Localized<string>;
}

interface Project {
  status?: "in-progress";
  name: string;
  stack: string[];
  blurb: Localized<string>;
  screenshots?: ProjectScreenshot[];
  year?: number;
}

interface LabCard {
  tag: string;
  title: Localized<string>;
  stack: string[];
  log: string[];
}

interface ContactErrors {
  rate_limited: string;
  bad_email: string;
  bad_message: string;
  server_not_configured: string;
  send_failed: string;
  network_error: string;
  generic: string;
}

interface ContactContent {
  title: string;
  sub: string;
  fields: { name: string; email: string; message: string };
  send: string;
  sent: string;
  errors: ContactErrors;
}

interface FooterContent {
  built: string;
  rights: string;
}

export interface PortfolioContent {
  meta: MetaContent;
  nav: Localized<NavLabels>;
  hero: Localized<HeroContent>;
  about: Localized<AboutContent>;
  skills: { groups: SkillGroup[] };
  experience: ExperienceEntry[];
  projects: Project[];
  lab: LabCard[];
  contact: Localized<ContactContent>;
  footer: Localized<FooterContent>;
}

export const content: PortfolioContent = {
  meta: {
    name: "Kien Duong",
    handle: "kiendt",
    titleEn: "Senior Frontend Engineer",
    titleVi: "Kỹ sư Frontend Senior",
    location: "Hanoi, Vietnam",
    timezone: "GMT+7",
    email: "kienduong.hust@gmail.com",
    phone: "+84 868 605 359",
    site: "kiendt.dev",
    github: "bigbearman",
    linkedin: "kien-duong-fullstack",
    yearsExp: 10,
    resumeUrl: "/Kien_Duong_CV.pdf",
  },

  nav: {
    en: {
      about: "about",
      skills: "skills",
      work: "work",
      projects: "projects",
      lab: "lab",
      contact: "contact",
      resume: "résumé.pdf",
    },
    vi: {
      about: "giới-thiệu",
      skills: "kỹ-năng",
      work: "kinh-nghiệm",
      projects: "dự-án",
      lab: "ai-lab",
      contact: "liên-hệ",
      resume: "cv.pdf",
    },
  },

  hero: {
    en: {
      greet: "Hi there, I'm",
      role: "Senior Frontend Engineer",
      sub: "React · Next.js · TypeScript — building production web apps for 10+ years.",
      tags: ["available for hire", "remote-first", "freelance / contract"],
      ctaPrimary: "get in touch",
      ctaSecondary: "view work",
      commands: ["whoami", "cat .profile | head -n 4"],
    },
    vi: {
      greet: "Xin chào, mình là",
      role: "Kỹ sư Frontend Senior",
      sub: "React · Next.js · TypeScript — xây dựng web app production hơn 10 năm.",
      tags: ["đang tìm cơ hội", "remote-first", "freelance / hợp đồng"],
      ctaPrimary: "liên hệ",
      ctaSecondary: "xem dự án",
      commands: ["whoami", "cat .profile | head -n 4"],
    },
  },

  about: {
    en: {
      file: "README.md",
      lines: [
        { kind: "h", text: "# About" },
        {
          kind: "p",
          text: "Senior Frontend Engineer with 10+ years building production web apps. I care about performance, scalable architecture, and the developer experience of the teams I work with.",
        },
        {
          kind: "p",
          text: "Currently shipping an AI chatbot platform for healthcare (React + Laravel + pgvector) and running experiments with autonomous AI agent teams for dev workflow automation.",
        },
        {
          kind: "p",
          text: "I've led small frontend teams, run code reviews and technical interviews, and shipped products end-to-end on my own. I write code that other people can pick up six months later without cursing me.",
        },
        { kind: "h", text: "## Currently open to" },
        { kind: "li", text: "Senior Frontend roles at product companies" },
        { kind: "li", text: "Remote-first or hybrid (based in Hanoi, GMT+7)" },
        { kind: "li", text: "Freelance and short-term contract work" },
      ],
    },
    vi: {
      file: "README.md",
      lines: [
        { kind: "h", text: "# Giới thiệu" },
        {
          kind: "p",
          text: "Kỹ sư Frontend Senior với hơn 10 năm xây dựng web app production. Mình quan tâm đến hiệu năng, kiến trúc có khả năng mở rộng và trải nghiệm của lập trình viên trong team.",
        },
        {
          kind: "p",
          text: "Hiện đang phát triển nền tảng chatbot AI cho lĩnh vực y tế (React + Laravel + pgvector) và thử nghiệm hệ thống AI agent tự động cho workflow dev.",
        },
        {
          kind: "p",
          text: "Mình đã dẫn dắt team frontend nhỏ, review code, phỏng vấn kỹ thuật và ship sản phẩm end-to-end một mình. Code mình viết để team đọc lại sau 6 tháng vẫn hiểu được, không cần chửi mình.",
        },
        { kind: "h", text: "## Đang mở cho" },
        { kind: "li", text: "Vị trí Senior Frontend tại product company" },
        { kind: "li", text: "Remote-first hoặc hybrid (Hà Nội, GMT+7)" },
        { kind: "li", text: "Freelance và hợp đồng ngắn hạn" },
      ],
    },
  },

  skills: {
    groups: [
      {
        key: "core",
        label: { en: "core", vi: "lõi" },
        items: ["React.js", "Next.js", "TypeScript", "JavaScript ES2022+", "Vite"],
      },
      {
        key: "styling",
        label: { en: "styling", vi: "giao-diện" },
        items: ["TailwindCSS", "CSS Modules", "SCSS", "Styled Components", "Figma"],
      },
      {
        key: "backend",
        label: { en: "backend", vi: "backend" },
        items: ["Node.js", "NestJS", "Laravel", "Express", "REST", "GraphQL"],
      },
      {
        key: "ai",
        label: { en: "python · ai", vi: "python · ai" },
        items: [
          "Python",
          "Claude API",
          "Anthropic SDK",
          "OpenAI API",
          "Prompt Engineering",
          "Agent Systems",
        ],
      },
      {
        key: "data",
        label: { en: "data", vi: "dữ-liệu" },
        items: ["PostgreSQL", "MySQL", "Redis", "pgvector"],
      },
      {
        key: "infra",
        label: { en: "infra · cloud", vi: "hạ-tầng" },
        items: ["GCP", "AWS", "Vercel", "Docker", "Nginx", "GitHub Actions", "BullMQ"],
      },
      {
        key: "cms",
        label: { en: "cms · php", vi: "cms · php" },
        items: ["Joomla CMS", "PHP", "WordPress"],
      },
      {
        key: "lead",
        label: { en: "leadership", vi: "lãnh-đạo" },
        items: ["Code Review", "Architecture", "Tech Interviews", "Mentoring"],
      },
    ],
  },

  experience: [
    {
      role: {
        en: "Senior Frontend Engineer · Freelance",
        vi: "Senior Frontend Engineer · Freelance",
      },
      org: "Self-employed",
      where: "Remote",
      period: { en: "Nov 2022 — Present", vi: "11/2022 — nay" },
      duration: { en: "2 yrs 7 mos", vi: "2 năm 7 tháng" },
      tag: "current",
      bullets: {
        en: [
          "Built and optimized production web apps with React, Next.js, TypeScript, and TailwindCSS for clients across industries.",
          "Developed an AI chatbot platform for healthcare — React frontend, Laravel backend, pgvector for semantic search.",
          "Built autonomous AI agent systems for dev workflow automation using Claude API, NestJS, BullMQ, and Redis.",
          "Achieved Lighthouse scores above 90 (performance, a11y, SEO) across multiple client projects.",
          "Shipped end-to-end independently — architecture, API integration, deployment on Vercel and GCP.",
        ],
        vi: [
          "Xây dựng và tối ưu web app production với React, Next.js, TypeScript và TailwindCSS cho clients trong nhiều ngành.",
          "Phát triển chatbot AI cho healthcare — frontend React, backend Laravel, pgvector cho semantic search.",
          "Xây dựng hệ thống AI agent tự động cho workflow dev dùng Claude API, NestJS, BullMQ và Redis.",
          "Đạt điểm Lighthouse trên 90 (hiệu năng, a11y, SEO) trên nhiều dự án client.",
          "Ship end-to-end độc lập — kiến trúc, tích hợp API, deploy trên Vercel và GCP.",
        ],
      },
    },
    {
      role: { en: "Project Manager & Frontend Lead", vi: "Project Manager & Frontend Lead" },
      org: "JoomlArt.com",
      where: "Hanoi",
      period: { en: "Nov 2021 — Oct 2022", vi: "11/2021 — 10/2022" },
      duration: { en: "1 yr", vi: "1 năm" },
      bullets: {
        en: [
          "Led frontend direction across 3+ concurrent web projects; set architecture standards and component guidelines adopted by the whole team.",
          "Ran weekly code reviews — reduced critical bugs in production releases by ~30% over 6 months.",
          "Collaborated with designers and backend engineers to ship consistent, on-time deliverables.",
          "Onboarded and mentored 2–3 junior frontend developers via 1-on-1s and internal workshops.",
        ],
        vi: [
          "Dẫn dắt frontend cho 3+ dự án web song song; thiết lập chuẩn kiến trúc và component guideline được cả team áp dụng.",
          "Tổ chức code review hàng tuần — giảm ~30% bug nghiêm trọng trên production trong 6 tháng.",
          "Phối hợp với designer và backend để ship sản phẩm nhất quán, đúng tiến độ.",
          "Onboarding và mentor 2–3 junior frontend qua 1-on-1 và workshop nội bộ.",
        ],
      },
    },
    {
      role: { en: "Full-Stack Developer", vi: "Full-Stack Developer" },
      org: "JoomlArt.com",
      where: "Hanoi",
      period: { en: "Oct 2018 — Oct 2021", vi: "10/2018 — 10/2021" },
      duration: { en: "3 yrs 1 mo", vi: "3 năm 1 tháng" },
      bullets: {
        en: [
          "Designed and built Joomla templates, plugins, modules and custom components serving thousands of end users.",
          "Migrated key product pages to modern PHP patterns, improving maintainability and reducing load times.",
          "Integrated REST APIs and third-party services into CMS-driven products.",
        ],
        vi: [
          "Thiết kế và xây dựng Joomla templates, plugin, module và custom component phục vụ hàng nghìn người dùng.",
          "Migrate các trang sản phẩm chính sang pattern PHP hiện đại, cải thiện khả năng bảo trì và giảm thời gian tải.",
          "Tích hợp REST API và third-party service vào sản phẩm CMS.",
        ],
      },
    },
    {
      role: { en: "Senior PHP Developer", vi: "Senior PHP Developer" },
      org: "NextG Solutions",
      where: "Hanoi",
      period: { en: "Dec 2014 — Oct 2018", vi: "12/2014 — 10/2018" },
      duration: { en: "3 yrs 11 mos", vi: "3 năm 11 tháng" },
      bullets: {
        en: [
          "Gathered client requirements, designed technical specs, and implemented full PHP-based web solutions.",
          "Built and maintained multiple production web systems handling real-time data and user management.",
        ],
        vi: [
          "Tổng hợp yêu cầu khách hàng, thiết kế tech spec và triển khai giải pháp web full PHP.",
          "Xây dựng và bảo trì nhiều hệ thống web production xử lý dữ liệu real-time và quản lý người dùng.",
        ],
      },
    },
  ],

  projects: [
    {
      status: "in-progress",
      name: "HealthImpact.AI — Clinical Trial Matching",
      stack: ["React", "Laravel", "pgvector", "Claude API"],
      blurb: {
        en: "AI chatbot platform for cancer patients. Matches users to relevant clinical trials using pgvector semantic search, explains results in plain language, and handles medical document uploads.",
        vi: "Nền tảng chatbot AI cho bệnh nhân ung thư. Kết hợp pgvector semantic search để ghép người dùng với thử nghiệm lâm sàng phù hợp, giải thích kết quả bằng ngôn ngữ đơn giản.",
      },
      screenshots: [
        {
          src: "/screenshots/healthimpact-chat.png",
          alt: {
            en: "HealthImpact.AI chat screen matching a patient to a clinical trial",
            vi: "Màn hình chat HealthImpact.AI ghép bệnh nhân với thử nghiệm lâm sàng",
          },
        },
        {
          src: "/screenshots/healthimpact-trials.png",
          alt: {
            en: "List of matched clinical trials in HealthImpact.AI",
            vi: "Danh sách thử nghiệm lâm sàng phù hợp trong HealthImpact.AI",
          },
        },
        {
          src: "/screenshots/healthimpact-profile.png",
          alt: {
            en: "Patient profile screen in HealthImpact.AI",
            vi: "Màn hình hồ sơ bệnh nhân trong HealthImpact.AI",
          },
        },
        {
          src: "/screenshots/healthimpact-register.png",
          alt: {
            en: "Registration screen for HealthImpact.AI",
            vi: "Màn hình đăng ký của HealthImpact.AI",
          },
        },
      ],
      year: 2025,
    },
  ],

  lab: [
    {
      tag: "agent",
      title: { en: "Autonomous dev-workflow agents", vi: "Agent tự động hóa workflow dev" },
      stack: ["Claude API", "NestJS", "BullMQ", "Redis"],
      log: [
        "[orchestrator] spawning planner agent…",
        "[planner]      task = 'refactor checkout/* to typed hooks'",
        "[planner]      split into 4 subtasks → reviewer queue",
        "[coder.01]     opened PR #482 (+412 / -287)",
        "[reviewer]     approved · ci green · merged ✓",
      ],
    },
    {
      tag: "rag",
      title: { en: "pgvector RAG for medical Q&A", vi: "pgvector RAG cho hỏi-đáp y khoa" },
      stack: ["pgvector", "Laravel", "Claude"],
      log: [
        "$ embed --model voyage-3 --batch 256 docs/*.md",
        "indexed 14,238 chunks in 11.4s",
        "query='dosage for amoxicillin pediatric' → top-5 in 38ms",
        "answer streamed · 1,124 tokens · latency 1.9s",
      ],
    },
    {
      tag: "perf",
      title: { en: "Lighthouse > 95 on a heavy SPA", vi: "Lighthouse > 95 trên SPA nặng" },
      stack: ["Next.js", "Vite", "Sharp"],
      log: [
        "before  perf=62  lcp=4.1s  cls=0.21",
        "after   perf=97  lcp=1.2s  cls=0.02",
        "wins: route-level code split, image LQIP, font subsets",
      ],
    },
  ],

  contact: {
    en: {
      title: "Let's talk",
      sub: "Open to senior frontend roles, freelance and contract work. I usually reply within a day.",
      fields: {
        name: "your name",
        email: "your email",
        message: "what are you working on?",
      },
      send: "send message",
      sent: "message sent. talk soon →",
      errors: {
        rate_limited: "Too many tries — please wait a minute.",
        bad_email: "That email doesn't look right.",
        bad_message: "Message is too short or too long.",
        server_not_configured: "Server isn't configured yet — try email instead.",
        send_failed: "Couldn't deliver. Please email me directly.",
        network_error: "Network error. Please try again.",
        generic: "Something went wrong. Please try again.",
      },
    },
    vi: {
      title: "Cùng trao đổi nhé",
      sub: "Mở cho vị trí senior frontend, freelance và hợp đồng. Mình thường phản hồi trong vòng một ngày.",
      fields: {
        name: "tên của bạn",
        email: "email của bạn",
        message: "bạn đang làm gì?",
      },
      send: "gửi tin nhắn",
      sent: "đã gửi. mình sẽ phản hồi sớm →",
      errors: {
        rate_limited: "Gửi quá nhanh — anh đợi 1 phút rồi thử lại nhé.",
        bad_email: "Email chưa đúng định dạng.",
        bad_message: "Nội dung quá ngắn hoặc quá dài.",
        server_not_configured: "Server chưa cấu hình xong — anh gửi mail trực tiếp giúp em nhé.",
        send_failed: "Không gửi được. Anh email trực tiếp giúp em nhé.",
        network_error: "Lỗi mạng. Anh thử lại nhé.",
        generic: "Có lỗi xảy ra. Anh thử lại nhé.",
      },
    },
  },

  footer: {
    en: {
      built: "built with React, lots of coffee, and an unreasonable love for monospace fonts.",
      rights: "All rights reserved.",
    },
    vi: {
      built: "xây bằng React, rất nhiều cà phê, và một tình yêu vô lý dành cho font monospace.",
      rights: "Mọi quyền được bảo lưu.",
    },
  },
};
```

- [ ] **Step 2: Temporarily wire content into the placeholder page**

Edit `app/[lang]/page.tsx`:

```tsx
import { content, type Lang } from "@/content";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return <p>{lang}: {content.meta.name}</p>;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no errors (confirms `PortfolioContent` shape is internally consistent).

Run: `npm run build`
Expected: `out/en/index.html` contains `en: Kien Duong`; `out/vi/index.html` contains `vi: Kien Duong`.

- [ ] **Step 4: Commit**

```bash
git add content.ts app/\[lang\]/page.tsx
git commit -m "feat: add typed bilingual content module"
```

---

### Task 3: Shared primitives, global styles, real root layout

**Files:**
- Create: `components/Icon.tsx`
- Create: `components/SecHead.tsx`
- Create: `app/globals.css` (moved from `styles.css`, one selector fixed)
- Delete: `styles.css`
- Modify: `app/[lang]/layout.tsx` (font, globals.css, theme boot script, default `data-theme`)

**Interfaces:**
- Consumes: `Lang` from `content.ts` (Task 2).
- Produces: named icon components (`Sun`, `Moon`, `Download`, `Arrow`, `Github`, `Linkedin`, `Mail`, `Site`) from `components/Icon.tsx`; `SecHead({ cmd, hash }: { cmd: string; hash: string })` from `components/SecHead.tsx`. Both consumed by every section component from Task 5 onward.

- [ ] **Step 1: Create `components/Icon.tsx`**

```tsx
export function Sun() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function Moon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Download() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function Github() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function Linkedin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.99 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0z" />
    </svg>
  );
}

export function Mail() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function Site() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
```

- [ ] **Step 2: Create `components/SecHead.tsx`**

```tsx
export default function SecHead({ cmd, hash }: { cmd: string; hash: string }) {
  return (
    <div className="sec-head">
      <span className="sec-head__prompt">$</span>
      <span className="sec-head__cmd">{cmd}</span>
      <span className="sec-head__rule" />
      <span className="sec-head__hash">#{hash}</span>
    </div>
  );
}
```

- [ ] **Step 3: Move `styles.css` to `app/globals.css`**

Run: `git mv styles.css app/globals.css`

Then edit `app/globals.css`: find the rule block

```css
.avatar-card__slot image-slot {
  --is-bg: var(--panel-2);
  --is-fg: var(--muted);
  --is-border: var(--border);
  width: 100%;
  height: 100%;
  display: block;
}
```

and replace it with (the avatar is now a plain `<img>`, not the old `<image-slot>` custom element — see Task 5):

```css
.avatar-card__slot img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
```

- [ ] **Step 4: Upgrade the root layout `app/[lang]/layout.tsx`**

```tsx
import { JetBrains_Mono } from "next/font/google";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: "en" | "vi" }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} data-theme="dark">
      <body className={jetbrainsMono.className}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=JSON.parse(localStorage.getItem('kd:theme')||'\"dark\"');document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: page shows `en: Kien Duong` in JetBrains Mono, on a dark background (from `globals.css`), no console errors about the removed `image-slot` element.

In the browser console run `localStorage.setItem('kd:theme', JSON.stringify('light'))` and reload.
Expected: page background switches to the light theme immediately on load (boot script working, no flash of dark-then-light).

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/\[lang\]/layout.tsx components/Icon.tsx components/SecHead.tsx
git rm styles.css
git commit -m "feat: port global styles and root layout with theme boot script"
```

---

### Task 4: Theme toggle + nav

**Files:**
- Create: `components/ThemeToggle.tsx`
- Create: `components/Nav.tsx`
- Modify: `app/[lang]/page.tsx` (render `<Nav lang={lang} />` above the placeholder text)

**Interfaces:**
- Consumes: `Sun`, `Moon`, `Download` from `components/Icon.tsx` (Task 3); `content`, `Lang` from `content.ts` (Task 2).
- Produces: `ThemeToggle()` (no props, client component); `Nav({ lang }: { lang: Lang })`. `Nav` is imported by `app/[lang]/page.tsx` from this task onward.

- [ ] **Step 1: Create `components/ThemeToggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "./Icon";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("kd:theme", JSON.stringify(next));
    } catch {
      // localStorage unavailable (private mode) — theme just won't persist
    }
  };

  return (
    <button
      className="icon-btn"
      onClick={toggle}
      aria-label="toggle theme"
      title={theme === "dark" ? "light mode" : "dark mode"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
```

- [ ] **Step 2: Create `components/Nav.tsx`**

```tsx
import Link from "next/link";
import { content, type Lang } from "@/content";
import { Download } from "./Icon";
import ThemeToggle from "./ThemeToggle";

const SECTION_IDS = ["about", "skills", "work", "projects", "lab", "contact"] as const;

export default function Nav({ lang }: { lang: Lang }) {
  const t = content.nav[lang];
  const items = SECTION_IDS.map((id) => ({ id, label: t[id] }));
  const otherLang: Lang = lang === "en" ? "vi" : "en";

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="home">
          <span className="nav__monogram">kd</span>
          <span className="nav__path">
            ~/<b>kien-duong</b>
          </span>
        </a>

        <div className="nav__links" role="navigation">
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className="nav__link">
              <span className="dot">$</span>
              {it.label}
            </a>
          ))}
        </div>

        <div className="nav__tools">
          <Link href={`/${otherLang}/`} className="icon-btn" aria-label="toggle language" title="EN / VI">
            <span className={lang === "en" ? "v" : "k"}>EN</span>
            <span className="k">/</span>
            <span className={lang === "vi" ? "v" : "k"}>VI</span>
          </Link>

          <ThemeToggle />

          <a href={content.meta.resumeUrl} download className="icon-btn resume-btn">
            <Download />
            <span>{t.resume}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Wire into the page**

Edit `app/[lang]/page.tsx`:

```tsx
import { content, type Lang } from "@/content";
import Nav from "@/components/Nav";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return (
    <>
      <Nav lang={lang} />
      <p>{lang}: {content.meta.name}</p>
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds for both `/en/` and `/vi/`.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: nav bar renders with brand, section links, `EN/VI` link (clicking it navigates to `/vi/` and the page keeps the same nav minus the placeholder text swapping to Vietnamese via `content.meta.name` unaffected), theme button toggles dark/light and persists across reload, résumé link points at `/Kien_Duong_CV.pdf`.

- [ ] **Step 5: Commit**

```bash
git add components/ThemeToggle.tsx components/Nav.tsx app/\[lang\]/page.tsx
git commit -m "feat: add theme toggle and nav with route-based language switch"
```

---

### Task 5: Hero section

**Files:**
- Create: `components/TypedName.tsx`
- Create: `components/Hero.tsx`
- Modify: `app/[lang]/page.tsx` (replace the placeholder `<p>` with `<main><Hero lang={lang} /></main>`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `Arrow` from `components/Icon.tsx` (Task 3).
- Produces: `Hero({ lang }: { lang: Lang })`, consumed by `page.tsx` from now on and by no other component.

- [ ] **Step 1: Create `components/TypedName.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";

export default function TypedName({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span>
      {shown}
      <span className="cursor" aria-hidden="true"></span>
    </span>
  );
}
```

- [ ] **Step 2: Create `components/Hero.tsx`**

```tsx
import { content, type Lang } from "@/content";
import TypedName from "./TypedName";
import { Arrow } from "./Icon";

export default function Hero({ lang }: { lang: Lang }) {
  const t = content.hero[lang];
  const m = content.meta;

  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div>
          <div className="hero__term">
            <div className="line">
              <span className="prompt">kien@dev</span>
              <span>:~$</span>
              <span className="cmd">{t.commands[0]}</span>
            </div>
            <div className="line out">{m.name.toLowerCase().replace(" ", "-")}</div>
            <div className="line">
              <span className="prompt">kien@dev</span>
              <span>:~$</span>
              <span className="cmd">{t.commands[1]}</span>
            </div>
            <div className="out">
              <div>
                <span className="key">name</span>= &quot;{m.name}&quot;
              </div>
              <div>
                <span className="key">role</span>= &quot;{lang === "en" ? m.titleEn : m.titleVi}&quot;
              </div>
              <div>
                <span className="key">location</span>= &quot;{m.location}&quot;
              </div>
              <div>
                <span className="key">years_exp</span>= {m.yearsExp}+
              </div>
            </div>
          </div>

          <h1 className="hero__name">
            <TypedName text={m.name} />
          </h1>
          <p className="hero__role">
            <span style={{ color: "var(--muted)" }}>// </span>
            {t.sub}
          </p>

          <div className="hero__tags">
            {t.tags.map((tag, i) => (
              <span key={tag} className={`hero__tag ${i === 0 ? "is-active" : ""}`}>
                {tag}
              </span>
            ))}
          </div>

          <div className="hero__ctas">
            <a href="#contact" className="btn btn--primary">
              {t.ctaPrimary}{" "}
              <span className="arrow">
                <Arrow />
              </span>
            </a>
            <a href="#projects" className="btn">
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        <aside className="hero__aside">
          <div className="avatar-card">
            <div className="avatar-card__bar">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              <span style={{ marginLeft: 6 }}>profile.webp</span>
            </div>
            <div className="avatar-card__slot">
              <img src="/profile.webp" alt={m.name} />
            </div>
            <dl className="avatar-card__meta">
              <dt>status</dt>
              <dd>
                <span className="status-chip">
                  <i />
                  {lang === "en" ? "open to work" : "đang tìm cơ hội"}
                </span>
              </dd>
              <dt>email</dt>
              <dd>
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </dd>
              <dt>github</dt>
              <dd>
                <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer">
                  @{m.github}
                </a>
              </dd>
              <dt>site</dt>
              <dd>
                <a href={`https://${m.site}`} target="_blank" rel="noreferrer">
                  {m.site}
                </a>
              </dd>
            </dl>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat__n">
                10<span className="pct">+</span>
              </div>
              <div className="stat__l">{lang === "en" ? "years shipping" : "năm kinh nghiệm"}</div>
            </div>
            <div className="stat">
              <div className="stat__n">
                90<span className="pct">+</span>
              </div>
              <div className="stat__l">{lang === "en" ? "lighthouse avg" : "điểm lighthouse"}</div>
            </div>
            <div className="stat">
              <div className="stat__n">4</div>
              <div className="stat__l">{lang === "en" ? "frontend roles" : "vị trí frontend"}</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page**

Edit `app/[lang]/page.tsx`:

```tsx
import { type Lang } from "@/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return (
    <>
      <Nav lang={lang} />
      <main>
        <Hero lang={lang} />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: hero renders — terminal block with static `whoami` / `cat .profile` lines, `<h1>` types out "Kien Duong" character by character on load, tags row, two CTA buttons, avatar card shows `/profile.webp` as a plain image (no drop-target placeholder), stats row shows `10+ / 90+ / 4`.

- [ ] **Step 5: Commit**

```bash
git add components/TypedName.tsx components/Hero.tsx app/\[lang\]/page.tsx
git commit -m "feat: add hero section with typed name effect"
```

---

### Task 6: About + Skills sections

**Files:**
- Create: `components/About.tsx`
- Create: `components/Skills.tsx`
- Modify: `app/[lang]/page.tsx` (add both sections after `<Hero />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `SecHead` (Task 3).
- Produces: `About({ lang }: { lang: Lang })`, `Skills({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/About.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

export default function About({ lang }: { lang: Lang }) {
  const a = content.about[lang];

  return (
    <section id="about">
      <div className="container">
        <SecHead cmd={`cat ${a.file}`} hash="01" />
        <div className="window">
          <div className="window__bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="window__title">
              <span>{a.file}</span>
            </span>
            <span>md</span>
          </div>
          <div className="window__body readme">
            {a.lines.map((ln, i) => {
              if (ln.kind === "h" && ln.text.startsWith("##")) {
                return (
                  <h2 key={i} className="md-h2">
                    {ln.text.replace(/^#+\s*/, "")}
                  </h2>
                );
              }
              if (ln.kind === "h") {
                return (
                  <h1 key={i} className="md-h1">
                    {ln.text.replace(/^#+\s*/, "")}
                  </h1>
                );
              }
              if (ln.kind === "li") {
                if (i > 0 && a.lines[i - 1].kind === "li") return null;
                const items: string[] = [];
                let j = i;
                while (j < a.lines.length && a.lines[j].kind === "li") {
                  items.push(a.lines[j].text);
                  j++;
                }
                return (
                  <ul key={i}>
                    {items.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{ln.text}</p>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/Skills.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

export default function Skills({ lang }: { lang: Lang }) {
  return (
    <section id="skills">
      <div className="container">
        <SecHead cmd="ls -la ~/skills" hash="02" />
        <div className="skills-grid">
          {content.skills.groups.map((g) => (
            <div key={g.key} className="skill-group">
              <div className="skill-group__head">
                <span>
                  <span className="cmd">$</span> cat <b>{g.label[lang]}.txt</b>
                </span>
                <span>{g.items.length} items</span>
              </div>
              <div className="chips">
                {g.items.map((it) => (
                  <span key={it} className="chip">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page**

Edit `app/[lang]/page.tsx` — add imports for `About` and `Skills`, render both inside `<main>` right after `<Hero lang={lang} />`:

```tsx
<main>
  <Hero lang={lang} />
  <About lang={lang} />
  <Skills lang={lang} />
</main>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: About section renders as a fake `README.md` window with heading/paragraphs/bulleted list grouped correctly (3 list items under "Currently open to" show as one `<ul>`, not three). Skills section shows 8 skill-group cards with correct item counts.

- [ ] **Step 5: Commit**

```bash
git add components/About.tsx components/Skills.tsx app/\[lang\]/page.tsx
git commit -m "feat: add about and skills sections"
```

---

### Task 7: Experience section

**Files:**
- Create: `components/Experience.tsx`
- Modify: `app/[lang]/page.tsx` (add section after `<Skills />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `SecHead` (Task 3).
- Produces: `Experience({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/Experience.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

function commitSha(org: string, periodEn: string): string {
  const s = (org + periodEn).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 7);
  return s.padEnd(7, "a");
}

export default function Experience({ lang }: { lang: Lang }) {
  return (
    <section id="work">
      <div className="container">
        <SecHead cmd="git log --author=kien --pretty=full" hash="03" />
        <div className="timeline">
          {content.experience.map((x, i) => {
            const isCurrent = x.tag === "current";
            return (
              <div key={i} className={`tl-item ${isCurrent ? "is-current" : ""}`}>
                <div className="tl-item__head">
                  <span className="commit">commit {commitSha(x.org, x.period.en)}</span>
                  <span className="date">{x.period[lang]}</span>
                  <span className="dur">{x.duration[lang]}</span>
                  {isCurrent && <span className="badge">{lang === "en" ? "current" : "hiện tại"}</span>}
                </div>
                <h3 className="tl-item__title">{x.role[lang]}</h3>
                <div className="tl-item__org">
                  {x.org} <span>· {x.where}</span>
                </div>
                <ul className="tl-item__bullets">
                  {x.bullets[lang].map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into the page**

Edit `app/[lang]/page.tsx` — add `Experience` after `Skills`:

```tsx
<main>
  <Hero lang={lang} />
  <About lang={lang} />
  <Skills lang={lang} />
  <Experience lang={lang} />
</main>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: 4 timeline entries render newest-first, the "Senior Frontend Engineer · Freelance" entry shows a "current" badge, each entry's fake commit sha is a 7-char lowercase alnum string.

- [ ] **Step 4: Commit**

```bash
git add components/Experience.tsx app/\[lang\]/page.tsx
git commit -m "feat: add experience timeline section"
```

---

### Task 8: Projects + slideshow

**Files:**
- Create: `components/ProjectsSlideshow.tsx`
- Create: `components/Projects.tsx`
- Modify: `app/[lang]/page.tsx` (add section after `<Experience />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `SecHead` (Task 3).
- Produces: `ProjectsSlideshow({ shots, lang }: { shots: { src: string; alt: { en: string; vi: string } }[]; lang: Lang })`; `Projects({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/ProjectsSlideshow.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/content";

interface Shot {
  src: string;
  alt: { en: string; vi: string };
}

export default function ProjectsSlideshow({ shots, lang }: { shots: Shot[]; lang: Lang }) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (shots.length < 2) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % shots.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [shots.length]);

  const shot = shots[idx];

  return (
    <img
      src={shot.src}
      alt={shot.alt[lang]}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.3s ease",
        display: "block",
      }}
    />
  );
}
```

- [ ] **Step 2: Create `components/Projects.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";
import ProjectsSlideshow from "./ProjectsSlideshow";

export default function Projects({ lang }: { lang: Lang }) {
  return (
    <section id="projects">
      <div className="container">
        <SecHead cmd="ls projects/ --status" hash="04" />
        <div className="proj-grid">
          {content.projects.map((p, i) => {
            const inProgress = p.status === "in-progress";
            const hasShots = !!p.screenshots && p.screenshots.length > 0;
            return (
              <article key={i} className={`proj ${inProgress ? "is-in-progress" : ""}`}>
                <div className="proj__bar">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="name">{p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.case</span>
                </div>
                <div className="proj__hero">
                  {hasShots ? (
                    <ProjectsSlideshow shots={p.screenshots!} lang={lang} />
                  ) : (
                    <span className="label-pill">{lang === "en" ? "preview" : "xem trước"}</span>
                  )}
                </div>
                <div className="proj__body">
                  <div className="proj__status">
                    <i />
                    {inProgress
                      ? lang === "en"
                        ? `in progress · ${p.year}`
                        : `đang triển khai · ${p.year}`
                      : lang === "en"
                        ? "shipped"
                        : "đã ra mắt"}
                  </div>
                  <h3 className="proj__title">{p.name}</h3>
                  <p className="proj__blurb">{p.blurb[lang]}</p>
                  <div className="proj__stack chips">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page**

Edit `app/[lang]/page.tsx` — add `Projects` after `Experience`:

```tsx
<main>
  <Hero lang={lang} />
  <About lang={lang} />
  <Skills lang={lang} />
  <Experience lang={lang} />
  <Projects lang={lang} />
</main>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: HealthImpact.AI card renders, screenshot slideshow cycles through 4 images every 3s with a fade transition, each image's `alt` text is the specific descriptive string (inspect via devtools, not the old generic `"project screenshot"`), status line reads "in progress · 2025" (from `p.year`, not a hardcoded literal).

- [ ] **Step 5: Commit**

```bash
git add components/ProjectsSlideshow.tsx components/Projects.tsx app/\[lang\]/page.tsx
git commit -m "feat: add projects section with screenshot slideshow"
```

---

### Task 9: Lab section

**Files:**
- Create: `components/Lab.tsx`
- Modify: `app/[lang]/page.tsx` (add section after `<Projects />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `SecHead` (Task 3).
- Produces: `Lab({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/Lab.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

function renderLogLine(line: string, key: number) {
  const colored = line
    .replace(/(\[[a-z0-9.]+\])/gi, (m) => `__BL${m}__BL`)
    .replace(/(\b✓\b|merged|approved|ok|green)/gi, (m) => `__GR${m}__GR`);
  const parts = colored.split(/(__BL.*?__BL|__GR.*?__GR)/g);
  return (
    <div key={key}>
      {parts.map((part, j) => {
        if (part.startsWith("__BL")) {
          return (
            <span key={j} className="lg-key">
              {part.slice(4, -4)}
            </span>
          );
        }
        if (part.startsWith("__GR")) {
          return (
            <span key={j} className="lg-ok">
              {part.slice(4, -4)}
            </span>
          );
        }
        return part;
      })}
    </div>
  );
}

export default function Lab({ lang }: { lang: Lang }) {
  return (
    <section id="lab">
      <div className="container">
        <SecHead cmd="tail -f ai-lab/*.log" hash="05" />
        <div className="lab-grid">
          {content.lab.map((card, i) => (
            <div key={i} className="lab-card">
              <div className="lab-card__head">
                <span className="lab-card__tag">{card.tag}</span>
                <span style={{ marginLeft: "auto" }}>experiment_{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="lab-card__title">{card.title[lang]}</div>
              <pre className="lab-card__log">{card.log.map((ln, k) => renderLogLine(ln, k))}</pre>
              <div className="lab-card__stack chips">
                {card.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into the page**

Edit `app/[lang]/page.tsx` — add `Lab` after `Projects`:

```tsx
<main>
  <Hero lang={lang} />
  <About lang={lang} />
  <Skills lang={lang} />
  <Experience lang={lang} />
  <Projects lang={lang} />
  <Lab lang={lang} />
</main>
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`
Expected: 3 lab cards render, log lines show `[bracketed]` tokens colored via `.lg-key` and `merged`/`approved`/`ok`/`✓` tokens colored via `.lg-ok`.

- [ ] **Step 4: Commit**

```bash
git add components/Lab.tsx app/\[lang\]/page.tsx
git commit -m "feat: add lab section with colored log rendering"
```

---

### Task 10: Contact form + section

**Files:**
- Create: `components/ContactForm.tsx`
- Create: `components/Contact.tsx`
- Modify: `app/[lang]/page.tsx` (add section after `<Lab />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `SecHead` (Task 3); `Arrow` (Task 3). Talks to the existing, unmodified `POST /api/contact` (`functions/api/contact.js`), which expects JSON `{ name, email, message, website, lang }` and returns `{ ok: true }` or `{ ok: false, error: string }`.
- Produces: `ContactForm({ lang }: { lang: Lang })`; `Contact({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/ContactForm.tsx`**

```tsx
"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { content, type Lang } from "@/content";
import { Arrow } from "./Icon";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ lang }: { lang: Lang }) {
  const c = content.contact[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data: { ok?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        const key = (data.error as keyof typeof c.errors) || "generic";
        setErrorMsg(c.errors[key] || c.errors.generic);
        setStatus("error");
      }
    } catch {
      setErrorMsg(c.errors.network_error);
      setStatus("error");
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.currentTarget.requestSubmit();
    }
  };

  const sent = status === "sent";

  return (
    <form className="tform" onSubmit={submit} onKeyDown={onKeyDown}>
      <div className="tform__bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span style={{ marginLeft: 6 }}>compose --message</span>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        aria-hidden="true"
      />

      {sent ? (
        <div className="tform__sent">{c.sent}</div>
      ) : (
        <>
          <div className="tform__body">
            <div className="tform__row">
              <span className="tform__prompt">name $</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={c.fields.name}
                autoComplete="name"
                disabled={status === "sending"}
              />
            </div>
            <div className="tform__row">
              <span className="tform__prompt">email $</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={c.fields.email}
                autoComplete="email"
                disabled={status === "sending"}
              />
            </div>
            <div className="tform__row">
              <span className="tform__prompt">body $</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={c.fields.message}
                disabled={status === "sending"}
              />
            </div>
          </div>

          {status === "error" && (
            <div className="tform__err">
              <span style={{ color: "var(--red)" }}>!</span> {errorMsg}
            </div>
          )}

          <div className="tform__send">
            <span className="tform__hint">
              <kbd>⌘</kbd>+<kbd>↵</kbd> {lang === "en" ? "to send" : "để gửi"}
            </span>
            <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
              {status === "sending" ? (lang === "en" ? "sending…" : "đang gửi…") : c.send}
              {status !== "sending" && (
                <span className="arrow">
                  <Arrow />
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
```

Note: the original used `form.requestSubmit()` indirectly by calling the submit handler directly on Cmd/Ctrl+Enter; this version calls the native `form.requestSubmit()` instead, which is the standard DOM way to trigger the same submit path (including the `preventDefault` inside `submit`) without duplicating logic.

- [ ] **Step 2: Create `components/Contact.tsx`**

```tsx
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";
import ContactForm from "./ContactForm";

export default function Contact({ lang }: { lang: Lang }) {
  const c = content.contact[lang];
  const m = content.meta;

  return (
    <section id="contact">
      <div className="container">
        <SecHead cmd="POST /api/contact" hash="06" />
        <div className="contact-grid">
          <div>
            <h2 className="contact__title">{c.title}</h2>
            <p className="contact__sub">{c.sub}</p>
            <ul className="contact__list">
              <li>
                <span className="k">email</span>
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </li>
              <li>
                <span className="k">phone</span>
                <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>
              </li>
              <li>
                <span className="k">linkedin</span>
                <a href={`https://linkedin.com/in/${m.linkedin}`} target="_blank" rel="noreferrer">
                  /in/{m.linkedin}
                </a>
              </li>
              <li>
                <span className="k">github</span>
                <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer">
                  @{m.github}
                </a>
              </li>
              <li>
                <span className="k">site</span>
                <a href={`https://${m.site}`} target="_blank" rel="noreferrer">
                  {m.site}
                </a>
              </li>
              <li>
                <span className="k">timezone</span>
                <span style={{ color: "var(--fg-2)" }}>{m.timezone} · Hanoi</span>
              </li>
            </ul>
          </div>

          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire into the page**

Edit `app/[lang]/page.tsx` — add `Contact` after `Lab`:

```tsx
<main>
  <Hero lang={lang} />
  <About lang={lang} />
  <Skills lang={lang} />
  <Experience lang={lang} />
  <Projects lang={lang} />
  <Lab lang={lang} />
  <Contact lang={lang} />
</main>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open `http://localhost:3000/en/`, open devtools Network tab, fill in name/email/message, submit.
Expected: request fires as `POST /api/contact` with the correct JSON body; since `next dev` has no Pages Functions runtime, it 404s — confirm the form falls into the `status === "error"` branch and shows the `generic` error message (proves the error path renders correctly; the real end-to-end send is verified against the unmodified Function in Task 14).

- [ ] **Step 5: Commit**

```bash
git add components/ContactForm.tsx components/Contact.tsx app/\[lang\]/page.tsx
git commit -m "feat: add contact section wired to existing /api/contact function"
```

---

### Task 11: Footer + full page assembly

**Files:**
- Create: `components/Footer.tsx`
- Modify: `app/[lang]/page.tsx` (final structure: `Nav`, `main` with all 7 sections, `Footer`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2); `Github`, `Linkedin`, `Mail`, `Site` (Task 3).
- Produces: `Footer({ lang }: { lang: Lang })`. This completes the section list `page.tsx` renders — no further sections are added after this task.

- [ ] **Step 1: Create `components/Footer.tsx`**

```tsx
import { content, type Lang } from "@/content";
import { Github, Linkedin, Mail, Site } from "./Icon";

export default function Footer({ lang }: { lang: Lang }) {
  const f = content.footer[lang];
  const m = content.meta;

  return (
    <footer className="footer">
      <div className="container footer__row">
        <p>
          <span style={{ color: "var(--green)" }}>$</span> whoami
          <br />
          <span style={{ color: "var(--fg-2)" }}>{m.name.toLowerCase().replace(" ", "-")}</span>{" "}
          {/* ponytail: year is fixed at build time under static export, refreshes on next deploy */}
          — © {new Date().getFullYear()}. {f.rights}
        </p>
        <p>
          <span style={{ color: "var(--muted)" }}>// </span>
          {f.built}
        </p>
        <div className="footer__socials">
          <a href={`https://github.com/${m.github}`} target="_blank" rel="noreferrer" aria-label="github">
            <Github />
          </a>
          <a href={`https://linkedin.com/in/${m.linkedin}`} target="_blank" rel="noreferrer" aria-label="linkedin">
            <Linkedin />
          </a>
          <a href={`mailto:${m.email}`} aria-label="email">
            <Mail />
          </a>
          <a href={`https://${m.site}`} target="_blank" rel="noreferrer" aria-label="site">
            <Site />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Finalize `app/[lang]/page.tsx`**

```tsx
import { type Lang } from "@/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Lab from "@/components/Lab";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  return (
    <>
      <Nav lang={lang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Experience lang={lang} />
        <Projects lang={lang} />
        <Lab lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run dev`, open both `http://localhost:3000/en/` and `http://localhost:3000/vi/`, scroll top to bottom.
Expected: full page renders in both languages — nav, hero, about, skills, experience, projects, lab, contact, footer, in that order, visually matching the current live site's layout and copy. Footer shows the four social icons and current year.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx app/\[lang\]/page.tsx
git commit -m "feat: add footer and assemble full page"
```

---

### Task 12: JSON-LD + per-language metadata

**Files:**
- Create: `components/JsonLd.tsx`
- Modify: `app/[lang]/layout.tsx` (add `generateMetadata`)
- Modify: `app/[lang]/page.tsx` (render `<JsonLd lang={lang} />`)

**Interfaces:**
- Consumes: `content`, `Lang` (Task 2).
- Produces: `JsonLd({ lang }: { lang: Lang })`.

- [ ] **Step 1: Create `components/JsonLd.tsx`**

```tsx
import { content, type Lang } from "@/content";

export default function JsonLd({ lang }: { lang: Lang }) {
  const m = content.meta;
  const siteUrl = `https://${m.site}`;
  const jobTitle = lang === "en" ? m.titleEn : m.titleVi;

  const person = {
    "@type": "Person",
    name: m.name,
    jobTitle,
    url: siteUrl,
    image: `${siteUrl}/profile.webp`,
    email: `mailto:${m.email}`,
    telephone: m.phone,
    address: { "@type": "PostalAddress", addressLocality: "Hanoi", addressCountry: "VN" },
    knowsAbout: content.skills.groups.flatMap((g) => g.items),
    sameAs: [`https://github.com/${m.github}`, `https://linkedin.com/in/${m.linkedin}`, siteUrl],
  };

  const website = {
    "@type": "WebSite",
    url: siteUrl,
    name: m.name,
    inLanguage: lang,
    author: person,
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteUrl}/${lang}/`,
    inLanguage: lang,
    about: person,
    isPartOf: website,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }} />;
}
```

- [ ] **Step 2: Add `generateMetadata` to `app/[lang]/layout.tsx`**

Add this import and function above the existing `LangLayout` (keep the rest of the file — font, `data-theme`, theme boot script — unchanged):

```tsx
import type { Metadata } from "next";
import { content, type Lang } from "@/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const m = content.meta;
  const title = `${m.name} — ${lang === "en" ? m.titleEn : m.titleVi}`;
  const description = content.hero[lang].sub;
  const siteUrl = `https://${m.site}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${lang}/`,
      languages: { en: "/en/", vi: "/vi/" },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/`,
      siteName: m.name,
      locale: lang === "en" ? "en_US" : "vi_VN",
      alternateLocale: lang === "en" ? "vi_VN" : "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

Change the layout's own param type from `{ lang: "en" | "vi" }` to the imported `Lang` type in both `generateStaticParams`-adjacent function signature and `LangLayout`, so the file has a single source of truth for the type.

- [ ] **Step 3: Render `JsonLd` in the page**

Edit `app/[lang]/page.tsx` — add the import and render it as the first child of the top-level fragment:

```tsx
import JsonLd from "@/components/JsonLd";
// ...
return (
  <>
    <JsonLd lang={lang} />
    <Nav lang={lang} />
    ...
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build succeeds.

Run: `npm run build` then open `out/en/index.html` and `out/vi/index.html` in a text editor (or `grep`).
Expected: each file contains `<link rel="canonical" href="https://kiendt.dev/en/">` (or `/vi/`), `<link rel="alternate" hreflang="en" ...>` and `hreflang="vi"`, `<meta property="og:locale" ...>`, and a `<script type="application/ld+json">` block containing `"@type":"ProfilePage"` with `"inLanguage":"en"` (or `"vi"`) matching the page.

- [ ] **Step 5: Commit**

```bash
git add components/JsonLd.tsx app/\[lang\]/layout.tsx app/\[lang\]/page.tsx
git commit -m "feat: add JSON-LD and per-language SEO metadata"
```

---

### Task 13: OG image, favicon, robots, sitemap, redirect, llms.txt

**Files:**
- Create: `app/[lang]/opengraph-image.tsx`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Create: `public/_redirects`
- Create: `public/llms.txt`

**Interfaces:**
- Consumes: `content` (Task 2).
- Produces: static files consumed only by the build output / Cloudflare Pages, not by other components.

- [ ] **Step 1: Create `app/[lang]/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { content, type Lang } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function OgImage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const m = content.meta;
  const role = lang === "en" ? m.titleEn : m.titleVi;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0f14",
          color: "#e6e6e6",
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 28, color: "#7ee787" }}>$ whoami</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20 }}>{m.name}</div>
        <div style={{ fontSize: 36, color: "#9aa4af", marginTop: 16 }}>{role}</div>
        <div style={{ fontSize: 28, color: "#7ee787", marginTop: 40 }}>{m.site}</div>
      </div>
    ),
    { ...size },
  );
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { content } from "@/content";

const AI_CRAWLERS = ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "anthropic-ai", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `https://${content.meta.site}`;
  return {
    rules: [{ userAgent: "*", allow: "/" }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Create `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { content } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = `https://${content.meta.site}`;
  const languages = { en: `${siteUrl}/en/`, vi: `${siteUrl}/vi/` };
  return [
    { url: languages.en, alternates: { languages } },
    { url: languages.vi, alternates: { languages } },
  ];
}
```

- [ ] **Step 4: Create `public/_redirects`**

```
/  /en/  302
```

- [ ] **Step 5: Create `public/llms.txt`**

```markdown
# Kien Duong

> Senior Frontend Engineer (10+ years), based in Hanoi, Vietnam (GMT+7).
> React, Next.js, TypeScript. Currently building an AI chatbot platform for
> healthcare (React + Laravel + pgvector) and experimenting with autonomous
> AI agent systems for dev workflow automation.

Open to senior frontend roles, remote-first or hybrid, and freelance /
contract work.

## Pages

- [Portfolio (English)](https://kiendt.dev/en/): experience, skills,
  projects, and contact form.
- [Portfolio (Vietnamese)](https://kiendt.dev/vi/): same content in
  Vietnamese.
- [Résumé (PDF)](https://kiendt.dev/Kien_Duong_CV.pdf)

## Contact

- Email: kienduong.hust@gmail.com
- GitHub: https://github.com/bigbearman
- LinkedIn: https://linkedin.com/in/kien-duong-fullstack
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: build succeeds; `out/en/opengraph-image` and `out/vi/opengraph-image` exist as non-empty PNG files (open one to confirm it renders the name/role/site text on a dark background); `out/robots.txt` lists `Allow: /` for `*` and each AI crawler user-agent, plus a `Sitemap:` line; `out/sitemap.xml` lists both `/en/` and `/vi/` URLs; `out/llms.txt` matches the file created above. The favicon (`app/icon.png`) doesn't exist yet — that's created in Task 14 once `profile.webp` has moved into `public/`.

- [ ] **Step 7: Commit**

```bash
git add app/\[lang\]/opengraph-image.tsx app/robots.ts app/sitemap.ts public/_redirects public/llms.txt
git commit -m "feat: add OG image, robots, sitemap, root redirect, and llms.txt"
```

---

### Task 14: Move static assets, delete legacy files, update deploy tooling, final verification

**Files:**
- Move: `profile.webp`, `screenshots/*`, `Kien_Duong_CV.pdf` → `public/`
- Create: `app/icon.png` (via `sips` from `public/profile.webp`)
- Delete: `index.html`, `app.jsx`, `content.js`, `image-slot.js`
- Modify: `wrangler.jsonc`
- Modify: `deploy.sh`
- Modify: `SETUP.md`

**Interfaces:**
- Consumes: nothing new — this task only relocates files already referenced by absolute path (`/profile.webp`, `/screenshots/...`, `/Kien_Duong_CV.pdf`) since Task 2.
- Produces: nothing consumed by other tasks — this is the last task.

- [ ] **Step 1: Move static assets into `public/`**

```bash
mkdir -p public
git mv profile.webp public/profile.webp
git mv screenshots public/screenshots
git mv Kien_Duong_CV.pdf public/Kien_Duong_CV.pdf
```

- [ ] **Step 2: Generate the favicon from the profile photo**

Check the photo's dimensions first:

```bash
sips -g pixelWidth -g pixelHeight public/profile.webp
```

Center-crop it to a square PNG using the smaller of the two dimensions reported above (example assumes at least 480px on both sides — replace `480` with the actual smaller dimension if different):

```bash
sips -s format png -c 480 480 public/profile.webp --out app/icon.png
```

- [ ] **Step 3: Delete the legacy runtime files**

```bash
git rm index.html app.jsx content.js image-slot.js
```

- [ ] **Step 4: Update `wrangler.jsonc`**

```json
{
  "name": "portfolio",
  "pages_build_output_dir": "out",
  "compatibility_date": "2026-05-24",
  "compatibility_flags": ["nodejs_compat"]
}
```

- [ ] **Step 5: Update `deploy.sh`**

```bash
#!/usr/bin/env bash
set -e

MSG="${1:-update portfolio}"

npm run build

git add app/ components/ content.ts public/ functions/api/contact.js \
        wrangler.jsonc next.config.ts tsconfig.json package.json package-lock.json \
        .gitignore

git diff --cached --quiet && echo "Nothing to commit." && exit 0

git commit -m "$MSG"
git push origin main

wrangler pages deploy out --project-name portfolio --branch main
```

- [ ] **Step 6: Update `SETUP.md`**

In section "3. Tạo Cloudflare Pages project", change:

```
   - Build command: *(để trống)*
   - Build output directory: `/`
```

to:

```
   - Build command: `npm run build`
   - Build output directory: `out`
```

In section "Nếu chạy local để test", change the command block from:

```bash
npx wrangler@latest pages dev .
```

to:

```bash
npm run build
npx wrangler@latest pages dev out
```

and the `RESEND_API_KEY=... npx wrangler pages dev .` line the same way (`pages dev out`).

In section "Đã build sẵn cho anh", change the second bullet from referencing `app.jsx` to:

```
- `components/ContactForm.tsx` — Form đã wire fetch `/api/contact`, có loading state, error messages
  song ngữ EN/VI, disable input khi đang gửi.
```

- [ ] **Step 7: Final verification**

Run: `npm run build`
Expected: build succeeds; `out/en/index.html` and `out/vi/index.html` reference `/profile.webp`, `/screenshots/healthimpact-*.png`, `/Kien_Duong_CV.pdf` (grep the output HTML for these paths and confirm no `screenshots/` or `profile.webp` relative-path references remain).

Run: `npx tsc --noEmit`
Expected: no errors.

Run local full-stack check (serves the static export together with the real, unmodified `functions/api/contact.js`):

```bash
npx wrangler@latest pages dev out
```

Open `http://localhost:8788/en/` and `http://localhost:8788/vi/`, click through both — nav, hero typed name, theme toggle persisting after reload, about/skills/experience/projects (slideshow cycling)/lab, then submit the contact form. Without `RESEND_API_KEY`/`TO_EMAIL` set, expect a graceful `server_not_configured` error message (in the page's language) rather than a crash — this confirms the form still talks correctly to the real, unmodified Function.

Expected overall: both language routes visually match the current live site (`kiendt.dev`) section-by-section, no console errors, no broken images, no FOUC on theme.

- [ ] **Step 8: Commit**

```bash
git add public/ app/icon.png wrangler.jsonc deploy.sh SETUP.md
git commit -m "chore: move static assets, remove legacy runtime files, update deploy tooling"
```

At this point the branch is ready for review. Deploying to production (`wrangler pages deploy out` from `deploy.sh`, or pushing to trigger the existing Cloudflare Pages Git integration if one exists) is a separate, explicit step for whoever reviews this branch to run — not part of this plan.
