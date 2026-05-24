// Bilingual content + structured CV data
window.PORTFOLIO_CONTENT = {
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
    resumeUrl: "Kien_Duong_CV.pdf",
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
        "screenshots/healthimpact-chat.png",
        "screenshots/healthimpact-trials.png",
        "screenshots/healthimpact-profile.png",
        "screenshots/healthimpact-register.png",
      ],
      year: 2025,
    },
    {
      status: "placeholder",
      name: "Project Two",
      stack: ["Next.js", "TypeScript", "Vercel"],
      blurb: {
        en: "Case study coming soon — drop a project description here.",
        vi: "Case study sắp ra mắt — thêm mô tả dự án ở đây.",
      },
    },
    {
      status: "placeholder",
      name: "Project Three",
      stack: ["React", "Node.js", "PostgreSQL"],
      blurb: {
        en: "Case study coming soon — drop a project description here.",
        vi: "Case study sắp ra mắt — thêm mô tả dự án ở đây.",
      },
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
