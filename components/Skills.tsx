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
