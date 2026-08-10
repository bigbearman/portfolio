export type Lang = "en" | "vi";

// Next.js 15's generated route types check `params` against a structural
// `{ [key]: string }` shape with no narrowing from `generateStaticParams`,
// so every `app/[lang]/*` entry point (layout, page, opengraph-image) must
// declare `params: Promise<{ lang: string }>` and narrow with this helper —
// declaring `Promise<{ lang: Lang }>` directly fails `next build`.
export function toLang(value: string): Lang {
  return value === "vi" ? "vi" : "en";
}

interface Localized<T> {
  en: T;
  vi: T;
}

interface MetaContent {
  name: string;
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
  url?: string;
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
  bad_name: string;
  invalid_json: string;
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
        items: [
          "React.js",
          "Next.js",
          "TypeScript",
          "JavaScript ES2022+",
          "Vite",
        ],
      },
      {
        key: "styling",
        label: { en: "styling", vi: "giao-diện" },
        items: [
          "TailwindCSS",
          "CSS Modules",
          "SCSS",
          "Styled Components",
          "Figma",
        ],
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
        items: [
          "GCP",
          "AWS",
          "Vercel",
          "Docker",
          "Nginx",
          "GitHub Actions",
          "BullMQ",
        ],
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
        en: "Senior Frontend Developer",
        vi: "Senior Frontend Developer",
      },
      org: "Lab3",
      where: "Hanoi",
      period: { en: "Nov 2022 — Mar 2026", vi: "11/2022 — 3/2026" },
      duration: { en: "3 yrs 5 mos", vi: "3 năm 5 tháng" },
      bullets: {
        en: [
          "Core frontend engineer across Lab3's Web3 product suite — whales.market (decentralized OTC pre-market trading), Whales Predict, and mention.network — built with React, Next.js, and TypeScript.",
          "Shipped the memePire mobile app with React Native, delivering a shared codebase and consistent UX across iOS and Android.",
          "Built reusable UI component libraries and frontend architecture patterns adopted across multiple concurrent products, cutting project setup and onboarding time by ~50%.",
          "Optimized client-facing apps to Lighthouse scores of 90+ in performance, accessibility, and SEO, reducing average page load time by ~40% vs. baseline.",
          "Worked in a fast-paced crypto product environment with rapid release cycles, real-time market data, and close collaboration with backend and smart-contract teams.",
        ],
        vi: [
          "Frontend engineer nòng cốt cho bộ sản phẩm Web3 của Lab3 — whales.market (sàn OTC pre-market phi tập trung), Whales Predict và mention.network — xây bằng React, Next.js và TypeScript.",
          "Ship app mobile memePire với React Native, dùng chung codebase và UX nhất quán trên cả iOS và Android.",
          "Xây dựng thư viện UI component và pattern kiến trúc frontend tái sử dụng, áp dụng cho nhiều sản phẩm chạy song song, giảm ~50% thời gian setup và onboarding dự án.",
          "Tối ưu các app client lên điểm Lighthouse 90+ (hiệu năng, a11y, SEO), giảm ~40% thời gian tải trang trung bình so với baseline.",
          "Làm việc trong môi trường sản phẩm crypto nhịp độ nhanh, chu kỳ release gấp, dữ liệu thị trường real-time, phối hợp chặt với team backend và smart-contract.",
        ],
      },
    },
    {
      role: {
        en: "Full-Stack Developer (Remote, in parallel)",
        vi: "Full-Stack Developer (Remote, song song)",
      },
      org: "HealthImpact",
      where: "Remote",
      period: { en: "Jan 2024 — Jun 2026", vi: "1/2024 — 6/2026" },
      duration: { en: "2 yrs 6 mos", vi: "2 năm 6 tháng" },
      bullets: {
        en: [
          "Architected and shipped an AI-powered healthcare chatbot platform (React + Laravel + pgvector) serving 100–500 active users/month, with semantic search over patient records and clinical trial data.",
          "Built and maintained the backend REST APIs and third-party integrations powering the platform, with asynchronous processing for embedding generation and data synchronization.",
          "Owned delivery end-to-end: system design, API development, CI/CD pipeline setup, and deployment on Vercel and GCP — through to production support.",
          "Maintained production stability and delivery velocity while working asynchronously alongside a full-time role — strong self-management and ownership.",
        ],
        vi: [
          "Kiến trúc và ship nền tảng chatbot AI cho healthcare (React + Laravel + pgvector), phục vụ 100–500 active user/tháng, semantic search trên hồ sơ bệnh nhân và dữ liệu thử nghiệm lâm sàng.",
          "Xây dựng và bảo trì REST API backend cùng các tích hợp bên thứ ba, xử lý bất đồng bộ cho sinh embedding và đồng bộ dữ liệu.",
          "Chịu trách nhiệm end-to-end: thiết kế hệ thống, phát triển API, setup CI/CD, deploy trên Vercel và GCP — đến tận production support.",
          "Giữ ổn định production và tốc độ delivery trong khi làm bất đồng bộ song song với công việc full-time — tinh thần tự quản lý và ownership cao.",
        ],
      },
    },
    {
      role: {
        en: "Project Manager & Frontend Lead",
        vi: "Project Manager & Frontend Lead",
      },
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
    {
      name: "Whales Market",
      url: "https://whales.market",
      stack: ["React", "Next.js", "TypeScript"],
      blurb: {
        en: "Decentralized pre-market OTC exchange for trading tokens before they list. Frontend engineer on the trading dashboard, order book, and settlement flows.",
        vi: "Sàn OTC pre-market phi tập trung để giao dịch token trước khi niêm yết. Frontend engineer cho dashboard giao dịch, order book và luồng settlement.",
      },
      screenshots: [
        {
          src: "/screenshots/whales-market-dashboard.jpg",
          alt: {
            en: "Whales Market live pre-market dashboard with token order book",
            vi: "Dashboard pre-market trực tiếp của Whales Market với order book token",
          },
        },
      ],
      year: 2025,
    },
    {
      name: "Mention Network",
      url: "https://mention.network",
      stack: ["React", "Next.js", "TypeScript", "Shopify"],
      blurb: {
        en: "AI visibility (GEO) platform for Shopify resellers — checks whether AI assistants recommend a store, audits the product page against 40 signals, and deploys fixes in one click.",
        vi: "Nền tảng AI visibility (GEO) cho Shopify reseller — kiểm tra AI assistant có đề xuất store không, audit trang sản phẩm theo 40 tiêu chí, và deploy fix chỉ với một click.",
      },
      screenshots: [
        {
          src: "/screenshots/mention-network-home.jpg",
          alt: {
            en: "Mention Network landing page asking if AI recommends your store",
            vi: "Trang chủ Mention Network hỏi liệu AI có đề xuất store của bạn không",
          },
        },
      ],
      year: 2025,
    },
    {
      name: "Whales Predict",
      stack: ["React", "Next.js", "TypeScript"],
      blurb: {
        en: "Prediction market for traders to bet on token and event outcomes. Frontend engineer on pricing logic, risk display, and outcome modeling. Product is currently paused; screenshots are from the design phase.",
        vi: "Prediction market cho trader đặt cược vào kết quả token và sự kiện. Frontend engineer cho pricing logic, hiển thị risk và outcome modeling. Sản phẩm hiện tạm dừng; ảnh chụp từ giai đoạn thiết kế.",
      },
      screenshots: [
        {
          src: "/screenshots/whales-predict-design.png",
          alt: {
            en: "Whales Predict design mockup showing trending prediction markets",
            vi: "Mockup thiết kế Whales Predict với danh sách prediction market xu hướng",
          },
        },
      ],
      year: 2025,
    },
    {
      name: "memePire",
      stack: ["React Native", "TypeScript", "Solana"],
      blurb: {
        en: "Mobile-first meme coin trading app for Solana with smart-money signals and one-tap copy trading. Built the full React Native product across iOS and Android. Project has since stopped; screenshots are from the design phase.",
        vi: "App mobile-first giao dịch meme coin trên Solana với smart-money signal và copy trading một chạm. Xây toàn bộ product React Native trên cả iOS và Android. Project đã dừng; ảnh chụp từ giai đoạn thiết kế.",
      },
      screenshots: [
        {
          src: "/screenshots/memepire-design.png",
          alt: {
            en: "memePire mobile app design showing top-pick tokens and trading feed",
            vi: "Thiết kế app mobile memePire với danh sách token nổi bật và feed giao dịch",
          },
        },
      ],
      year: 2025,
    },
  ],

  lab: [
    {
      tag: "agent",
      title: {
        en: "Autonomous dev-workflow agents",
        vi: "Agent tự động hóa workflow dev",
      },
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
      title: {
        en: "pgvector RAG for medical Q&A",
        vi: "pgvector RAG cho hỏi-đáp y khoa",
      },
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
      title: {
        en: "Lighthouse > 95 on a heavy SPA",
        vi: "Lighthouse > 95 trên SPA nặng",
      },
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
        bad_name: "Please enter your name.",
        invalid_json: "Couldn't read that — please try again.",
        server_not_configured:
          "Server isn't configured yet — try email instead.",
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
        bad_name: "Anh nhập tên giúp em nhé.",
        invalid_json: "Không đọc được dữ liệu — anh thử lại nhé.",
        server_not_configured:
          "Server chưa cấu hình xong — anh gửi mail trực tiếp giúp em nhé.",
        send_failed: "Không gửi được. Anh email trực tiếp giúp em nhé.",
        network_error: "Lỗi mạng. Anh thử lại nhé.",
        generic: "Có lỗi xảy ra. Anh thử lại nhé.",
      },
    },
  },

  footer: {
    en: {
      built:
        "built with React, lots of coffee, and an unreasonable love for monospace fonts.",
      rights: "All rights reserved.",
    },
    vi: {
      built:
        "xây bằng React, rất nhiều cà phê, và một tình yêu vô lý dành cho font monospace.",
      rights: "Mọi quyền được bảo lưu.",
    },
  },
};
