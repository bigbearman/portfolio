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
            <div className="line out">
              {m.name.toLowerCase().replace(" ", "-")}
            </div>
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
                <span className="key">role</span>= &quot;
                {lang === "en" ? m.titleEn : m.titleVi}&quot;
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
              <span
                key={tag}
                className={`hero__tag ${i === 0 ? "is-active" : ""}`}
              >
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
                <a
                  href={`https://github.com/${m.github}`}
                  target="_blank"
                  rel="noreferrer"
                >
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
              <div className="stat__l">
                {lang === "en" ? "years shipping" : "năm kinh nghiệm"}
              </div>
            </div>
            <div className="stat">
              <div className="stat__n">
                90<span className="pct">+</span>
              </div>
              <div className="stat__l">
                {lang === "en" ? "lighthouse avg" : "điểm lighthouse"}
              </div>
            </div>
            <div className="stat">
              <div className="stat__n">4</div>
              <div className="stat__l">
                {lang === "en" ? "frontend roles" : "vị trí frontend"}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
