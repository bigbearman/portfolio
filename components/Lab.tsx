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
                <span style={{ marginLeft: "auto" }}>
                  experiment_{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="lab-card__title">{card.title[lang]}</div>
              <pre className="lab-card__log">
                {card.log.map((ln, k) => renderLogLine(ln, k))}
              </pre>
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
