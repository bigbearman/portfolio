import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

function commitSha(org: string, periodEn: string): string {
  const s = (org + periodEn)
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()
    .slice(0, 7);
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
              <div
                key={i}
                className={`tl-item ${isCurrent ? "is-current" : ""}`}
              >
                <div className="tl-item__head">
                  <span className="commit">
                    commit {commitSha(x.org, x.period.en)}
                  </span>
                  <span className="date">{x.period[lang]}</span>
                  <span className="dur">{x.duration[lang]}</span>
                  {isCurrent && (
                    <span className="badge">
                      {lang === "en" ? "current" : "hiện tại"}
                    </span>
                  )}
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
