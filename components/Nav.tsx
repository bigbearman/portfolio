import Link from "next/link";
import { content, type Lang } from "@/content";
import { Download } from "./Icon";
import ThemeToggle from "./ThemeToggle";

const SECTION_IDS = [
  "about",
  "skills",
  "work",
  "projects",
  "lab",
  "contact",
] as const;

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
          <Link
            href={`/${otherLang}/`}
            className="icon-btn"
            aria-label="toggle language"
            title="EN / VI"
          >
            <span className={lang === "en" ? "v" : "k"}>EN</span>
            <span className="k">/</span>
            <span className={lang === "vi" ? "v" : "k"}>VI</span>
          </Link>

          <ThemeToggle />

          <a
            href={content.meta.resumeUrl}
            download
            className="icon-btn resume-btn"
          >
            <Download />
            <span>{t.resume}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
