import { content, type Lang } from "@/content";
import SecHead from "./SecHead";
import ContactForm from "./ContactForm";

export default function Contact({ lang }: { lang: Lang }) {
  const c = content.contact[lang];
  const m = content.meta;

  return (
    <section id="contact">
      <div className="container">
        <SecHead cmd="POST /api/contact" hash="06" />
        <div className="contact-grid">
          <div>
            <h2 className="contact__title">{c.title}</h2>
            <p className="contact__sub">{c.sub}</p>
            <ul className="contact__list">
              <li>
                <span className="k">email</span>
                <a href={`mailto:${m.email}`}>{m.email}</a>
              </li>
              <li>
                <span className="k">phone</span>
                <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>
              </li>
              <li>
                <span className="k">linkedin</span>
                <a
                  href={`https://linkedin.com/in/${m.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  /in/{m.linkedin}
                </a>
              </li>
              <li>
                <span className="k">github</span>
                <a
                  href={`https://github.com/${m.github}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{m.github}
                </a>
              </li>
              <li>
                <span className="k">site</span>
                <a href={`https://${m.site}`} target="_blank" rel="noreferrer">
                  {m.site}
                </a>
              </li>
              <li>
                <span className="k">timezone</span>
                <span style={{ color: "var(--fg-2)" }}>
                  {m.timezone} · Hanoi
                </span>
              </li>
            </ul>
          </div>

          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
