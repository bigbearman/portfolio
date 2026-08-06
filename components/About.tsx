import { content, type Lang } from "@/content";
import SecHead from "./SecHead";

export default function About({ lang }: { lang: Lang }) {
  const a = content.about[lang];

  return (
    <section id="about">
      <div className="container">
        <SecHead cmd={`cat ${a.file}`} hash="01" />
        <div className="window">
          <div className="window__bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="window__title">
              <span>{a.file}</span>
            </span>
            <span>md</span>
          </div>
          <div className="window__body readme">
            {a.lines.map((ln, i) => {
              if (ln.kind === "h" && ln.text.startsWith("##")) {
                return (
                  <h2 key={i} className="md-h2">
                    {ln.text.replace(/^#+\s*/, "")}
                  </h2>
                );
              }
              if (ln.kind === "h") {
                return (
                  <h1 key={i} className="md-h1">
                    {ln.text.replace(/^#+\s*/, "")}
                  </h1>
                );
              }
              if (ln.kind === "li") {
                if (i > 0 && a.lines[i - 1].kind === "li") return null;
                const items: string[] = [];
                let j = i;
                while (j < a.lines.length && a.lines[j].kind === "li") {
                  items.push(a.lines[j].text);
                  j++;
                }
                return (
                  <ul key={i}>
                    {items.map((x, k) => (
                      <li key={k}>{x}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{ln.text}</p>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
