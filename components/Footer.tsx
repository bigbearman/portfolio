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
          <span style={{ color: "var(--fg-2)" }}>
            {m.name.toLowerCase().replace(" ", "-")}
          </span>{" "}
          {/* ponytail: year is fixed at build time under static export, refreshes on next deploy */}
          — © {new Date().getFullYear()}. {f.rights}
        </p>
        <p>
          <span style={{ color: "var(--muted)" }}>// </span>
          {f.built}
        </p>
        <div className="footer__socials">
          <a
            href={`https://github.com/${m.github}`}
            target="_blank"
            rel="noreferrer"
            aria-label="github"
          >
            <Github />
          </a>
          <a
            href={`https://linkedin.com/in/${m.linkedin}`}
            target="_blank"
            rel="noreferrer"
            aria-label="linkedin"
          >
            <Linkedin />
          </a>
          <a href={`mailto:${m.email}`} aria-label="email">
            <Mail />
          </a>
          <a
            href={`https://${m.site}`}
            target="_blank"
            rel="noreferrer"
            aria-label="site"
          >
            <Site />
          </a>
        </div>
      </div>
    </footer>
  );
}
