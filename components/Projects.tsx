"use client";

import { useEffect, useState } from "react";
import { content, type Lang } from "@/content";
import SecHead from "./SecHead";
import ProjectsSlideshow from "./ProjectsSlideshow";

export default function Projects({ lang }: { lang: Lang }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? content.projects[openIdx] : null;

  useEffect(() => {
    if (openIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIdx]);

  return (
    <section id="projects">
      <div className="container">
        <SecHead cmd="ls projects/ --status" hash="04" />
        <div className="proj-grid">
          {content.projects.map((p, i) => {
            const inProgress = p.status === "in-progress";
            const hasShots = !!p.screenshots && p.screenshots.length > 0;
            const hasCaseStudy = !!p.scope || !!p.impact;
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
                  {hasCaseStudy && (
                    <button
                      type="button"
                      className="proj__case-btn"
                      onClick={() => setOpenIdx(i)}
                    >
                      {lang === "en" ? "View case study →" : "Xem case study →"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {open && (
        <div className="proj-modal__backdrop" onClick={() => setOpenIdx(null)}>
          <div
            className="proj-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="proj-modal__close"
              aria-label={lang === "en" ? "Close" : "Đóng"}
              onClick={() => setOpenIdx(null)}
            >
              ×
            </button>
            {open.screenshots && open.screenshots.length > 0 && (
              <div className="proj-modal__hero">
                <ProjectsSlideshow shots={open.screenshots} lang={lang} />
              </div>
            )}
            <h3 className="proj-modal__title">{open.name}</h3>
            <p className="proj-modal__blurb">{open.blurb[lang]}</p>
            <div className="proj__stack chips">
              {open.stack.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
            <div className="proj-modal__grid">
              {open.scope && (
                <div>
                  <h4>{lang === "en" ? "Scope" : "Phạm vi"}</h4>
                  <ul>
                    {open.scope[lang].map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
              {open.impact && (
                <div>
                  <h4>{lang === "en" ? "Impact" : "Kết quả"}</h4>
                  <ul>
                    {open.impact[lang].map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {open.url && (
              <a
                href={open.url}
                target="_blank"
                rel="noopener noreferrer"
                className="proj-modal__link"
              >
                {lang === "en" ? "Visit live site →" : "Xem site live →"}
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
