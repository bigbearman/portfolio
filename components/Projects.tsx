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
              <article
                key={i}
                className={`proj ${inProgress ? "is-in-progress" : ""}`}
              >
                <div className="proj__bar">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="name">
                    {p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.case
                  </span>
                </div>
                <div className="proj__hero">
                  {hasShots ? (
                    <ProjectsSlideshow shots={p.screenshots!} lang={lang} />
                  ) : (
                    <span className="label-pill">
                      {lang === "en" ? "preview" : "xem trước"}
                    </span>
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
                  <h3 className="proj__title">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </h3>
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
