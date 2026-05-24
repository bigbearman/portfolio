/* eslint-disable */
const { useState, useEffect, useRef, useMemo } = React;

const C = window.PORTFOLIO_CONTENT;

/* -------------------- hooks -------------------- */
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s == null ? initial : JSON.parse(s); }
    catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

function useTheme() {
  const [theme, setTheme] = useLocalStorage("kd:theme", "dark");
  useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  return [theme, setTheme];
}

function useLang() {
  const [lang, setLang] = useLocalStorage("kd:lang", "en");
  useEffect(() => { document.documentElement.setAttribute("lang", lang); }, [lang]);
  return [lang, setLang];
}

/* -------------------- icons -------------------- */
const Icon = {
  Sun: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>),
  Moon: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Download: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  Arrow: () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  Github: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>),
  Linkedin: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.99 0 1.78-.77 1.78-1.72V1.72C24 .77 23.21 0 22.22 0z"/></svg>),
  Mail: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>),
  Site: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
};

/* -------------------- typed name -------------------- */
function TypedName({ text }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [text]);
  return (<span>{shown}<span className="cursor" aria-hidden="true"></span></span>);
}

/* -------------------- nav -------------------- */
function Nav({ lang, setLang, theme, setTheme }) {
  const t = C.nav[lang];
  const items = [
    { id: "about", label: t.about },
    { id: "skills", label: t.skills },
    { id: "work", label: t.work },
    { id: "projects", label: t.projects },
    { id: "lab", label: t.lab },
    { id: "contact", label: t.contact },
  ];
  return (
    <nav className="nav">
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" aria-label="home">
          <span className="nav__monogram">kd</span>
          <span className="nav__path">~/<b>kien-duong</b></span>
        </a>

        <div className="nav__links" role="navigation">
          {items.map(it => (
            <a key={it.id} href={`#${it.id}`} className="nav__link">
              <span className="dot">$</span>{it.label}
            </a>
          ))}
        </div>

        <div className="nav__tools">
          <button
            className="icon-btn"
            onClick={() => setLang(lang === "en" ? "vi" : "en")}
            aria-label="toggle language"
            title="EN / VI"
          >
            <span className={lang === "en" ? "v" : "k"}>EN</span>
            <span className="k">/</span>
            <span className={lang === "vi" ? "v" : "k"}>VI</span>
          </button>

          <button
            className="icon-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="toggle theme"
            title={theme === "dark" ? "light mode" : "dark mode"}
          >
            {theme === "dark" ? <Icon.Sun/> : <Icon.Moon/>}
          </button>

          <a href={C.meta.resumeUrl} download className="icon-btn resume-btn">
            <Icon.Download/><span>{t.resume}</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

/* -------------------- section header -------------------- */
function SecHead({ id, cmd, hash }) {
  return (
    <div className="sec-head">
      <span className="sec-head__prompt">$</span>
      <span className="sec-head__cmd">{cmd}</span>
      <span className="sec-head__rule"/>
      <span className="sec-head__hash">#{hash}</span>
    </div>
  );
}

/* -------------------- hero -------------------- */
function Hero({ lang }) {
  const t = C.hero[lang];
  return (
    <section id="top" className="hero">
      <div className="container hero__grid">
        <div>
          <div className="hero__term">
            <div className="line"><span className="prompt">kien@dev</span><span>:~$</span><span className="cmd">{t.commands[0]}</span></div>
            <div className="line out">{C.meta.name.toLowerCase().replace(" ", "-")}</div>
            <div className="line"><span className="prompt">kien@dev</span><span>:~$</span><span className="cmd">{t.commands[1]}</span></div>
            <div className="out">
              <div><span className="key">name</span>= "{C.meta.name}"</div>
              <div><span className="key">role</span>= "{lang === "en" ? C.meta.titleEn : C.meta.titleVi}"</div>
              <div><span className="key">location</span>= "{C.meta.location}"</div>
              <div><span className="key">years_exp</span>= {C.meta.yearsExp}+</div>
            </div>
          </div>

          <h1 className="hero__name">
            <TypedName text={C.meta.name}/>
          </h1>
          <p className="hero__role">
            <span style={{color: "var(--muted)"}}>// </span>{t.sub}
          </p>

          <div className="hero__tags">
            {t.tags.map((tag, i) => (
              <span key={tag} className={`hero__tag ${i === 0 ? "is-active" : ""}`}>{tag}</span>
            ))}
          </div>

          <div className="hero__ctas">
            <a href="#contact" className="btn btn--primary">
              {t.ctaPrimary} <span className="arrow"><Icon.Arrow/></span>
            </a>
            <a href="#projects" className="btn">
              {t.ctaSecondary}
            </a>
          </div>
        </div>

        <aside className="hero__aside">
          <div className="avatar-card">
            <div className="avatar-card__bar">
              <span className="dots"><i/><i/><i/></span>
              <span style={{marginLeft: 6}}>profile.jpg</span>
            </div>
            <div className="avatar-card__slot">
              <image-slot id="avatar" shape="rect" placeholder={lang === "en" ? "drop your photo" : "thả ảnh vào đây"}></image-slot>
            </div>
            <dl className="avatar-card__meta">
              <dt>status</dt>
              <dd><span className="status-chip"><i/>{lang === "en" ? "open to work" : "đang tìm cơ hội"}</span></dd>
              <dt>email</dt>
              <dd><a href={`mailto:${C.meta.email}`}>{C.meta.email}</a></dd>
              <dt>github</dt>
              <dd><a href={`https://github.com/${C.meta.github}`} target="_blank" rel="noreferrer">@{C.meta.github}</a></dd>
              <dt>site</dt>
              <dd><a href={`https://${C.meta.site}`} target="_blank" rel="noreferrer">{C.meta.site}</a></dd>
            </dl>
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat__n">10<span className="pct">+</span></div>
              <div className="stat__l">{lang === "en" ? "years shipping" : "năm kinh nghiệm"}</div>
            </div>
            <div className="stat">
              <div className="stat__n">90<span className="pct">+</span></div>
              <div className="stat__l">{lang === "en" ? "lighthouse avg" : "điểm lighthouse"}</div>
            </div>
            <div className="stat">
              <div className="stat__n">4</div>
              <div className="stat__l">{lang === "en" ? "frontend roles" : "vị trí frontend"}</div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* -------------------- about -------------------- */
function About({ lang }) {
  const a = C.about[lang];
  return (
    <section id="about">
      <div className="container">
        <SecHead cmd={`cat ${a.file}`} hash="01"/>
        <div className="window">
          <div className="window__bar">
            <span className="dots"><i/><i/><i/></span>
            <span className="window__title"><span>{a.file}</span></span>
            <span>md</span>
          </div>
          <div className="window__body readme">
            {a.lines.map((ln, i) => {
              if (ln.kind === "h" && ln.text.startsWith("##")) return <h2 key={i} className="md-h2">{ln.text.replace(/^#+\s*/, "")}</h2>;
              if (ln.kind === "h") return <h1 key={i} className="md-h1">{ln.text.replace(/^#+\s*/, "")}</h1>;
              if (ln.kind === "li") {
                // group consecutive li
                if (i > 0 && a.lines[i - 1].kind === "li") return null;
                const items = [];
                let j = i;
                while (j < a.lines.length && a.lines[j].kind === "li") { items.push(a.lines[j].text); j++; }
                return <ul key={i}>{items.map((x, k) => <li key={k}>{x}</li>)}</ul>;
              }
              return <p key={i}>{ln.text}</p>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- skills -------------------- */
function Skills({ lang }) {
  return (
    <section id="skills">
      <div className="container">
        <SecHead cmd="ls -la ~/skills" hash="02"/>
        <div className="skills-grid">
          {C.skills.groups.map(g => (
            <div key={g.key} className="skill-group">
              <div className="skill-group__head">
                <span><span className="cmd">$</span> cat <b>{g.label[lang]}.txt</b></span>
                <span>{g.items.length} items</span>
              </div>
              <div className="chips">
                {g.items.map(it => <span key={it} className="chip">{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- experience -------------------- */
function Experience({ lang }) {
  const t = C.nav[lang];
  return (
    <section id="work">
      <div className="container">
        <SecHead cmd="git log --author=kien --pretty=full" hash="03"/>
        <div className="timeline">
          {C.experience.map((x, i) => {
            const isCur = x.tag === "current";
            const sha = (() => {
              const s = (x.org + x.period.en).replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 7);
              return s.padEnd(7, "a");
            })();
            return (
              <div key={i} className={`tl-item ${isCur ? "is-current" : ""}`}>
                <div className="tl-item__head">
                  <span className="commit">commit {sha}</span>
                  <span className="date">{x.period[lang]}</span>
                  <span className="dur">{x.duration[lang]}</span>
                  {isCur && <span className="badge">{lang === "en" ? "current" : "hiện tại"}</span>}
                </div>
                <h3 className="tl-item__title">{x.role[lang]}</h3>
                <div className="tl-item__org">
                  {x.org} <span>· {x.where}</span>
                </div>
                <ul className="tl-item__bullets">
                  {x.bullets[lang].map((b, k) => <li key={k}>{b}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------- projects -------------------- */
function Projects({ lang }) {
  return (
    <section id="projects">
      <div className="container">
        <SecHead cmd="ls projects/ --status" hash="04"/>
        <div className="proj-grid">
          {C.projects.map((p, i) => {
            const inProg = p.status === "in-progress";
            const placeholder = p.status === "placeholder";
            return (
              <article key={i} className={`proj ${inProg ? "is-in-progress" : ""} ${placeholder ? "is-placeholder" : ""}`}>
                <div className="proj__bar">
                  <span className="dots"><i/><i/><i/></span>
                  <span className="name">{p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.case</span>
                </div>
                <div className="proj__hero">
                  <span className="label-pill">{inProg ? (lang === "en" ? "preview" : "xem trước") : (lang === "en" ? "drop screenshot" : "thả ảnh chụp")}</span>
                </div>
                <div className="proj__body">
                  <div className="proj__status">
                    <i/>{inProg ? (lang === "en" ? "in progress · 2025" : "đang triển khai · 2025") : (lang === "en" ? "coming soon" : "sắp ra mắt")}
                  </div>
                  <h3 className="proj__title">{p.name}</h3>
                  <p className="proj__blurb">{p.blurb[lang]}</p>
                  <div className="proj__stack chips">
                    {p.stack.map(s => <span key={s} className="chip">{s}</span>)}
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

/* -------------------- lab -------------------- */
function Lab({ lang }) {
  return (
    <section id="lab">
      <div className="container">
        <SecHead cmd="tail -f ai-lab/*.log" hash="05"/>
        <div className="lab-grid">
          {C.lab.map((card, i) => (
            <div key={i} className="lab-card">
              <div className="lab-card__head">
                <span className="lab-card__tag">{card.tag}</span>
                <span style={{marginLeft: "auto"}}>experiment_{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="lab-card__title">{card.title[lang]}</div>
              <pre className="lab-card__log">
                {card.log.map((ln, k) => {
                  const colored = ln
                    .replace(/(\[[a-z0-9.]+\])/gi, (m) => `__BL${m}__BL`)
                    .replace(/(\b✓\b|merged|approved|ok|green)/gi, (m) => `__GR${m}__GR`);
                  const parts = colored.split(/(__BL.*?__BL|__GR.*?__GR)/g);
                  return (
                    <div key={k}>
                      {parts.map((part, j) => {
                        if (part.startsWith("__BL")) return <span key={j} className="lg-key">{part.slice(4, -4)}</span>;
                        if (part.startsWith("__GR")) return <span key={j} className="lg-ok">{part.slice(4, -4)}</span>;
                        return part;
                      })}
                    </div>
                  );
                })}
              </pre>
              <div className="lab-card__stack chips">
                {card.stack.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------- contact -------------------- */
function Contact({ lang }) {
  const c = C.contact[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const ERR = {
    en: {
      rate_limited: "Too many tries — please wait a minute.",
      bad_email: "That email doesn't look right.",
      bad_message: "Message is too short or too long.",
      server_not_configured: "Server isn't configured yet — try email instead.",
      send_failed: "Couldn't deliver. Please email me directly.",
      network_error: "Network error. Please try again.",
      generic: "Something went wrong. Please try again.",
    },
    vi: {
      rate_limited: "Gửi quá nhanh — anh đợi 1 phút rồi thử lại nhé.",
      bad_email: "Email chưa đúng định dạng.",
      bad_message: "Nội dung quá ngắn hoặc quá dài.",
      server_not_configured: "Server chưa cấu hình xong — anh gửi mail trực tiếp giúp em nhé.",
      send_failed: "Không gửi được. Anh email trực tiếp giúp em nhé.",
      network_error: "Lỗi mạng. Anh thử lại nhé.",
      generic: "Có lỗi xảy ra. Anh thử lại nhé.",
    },
  };

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!form.name || !form.email || !form.message) return;

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        const key = data.error || "generic";
        setErrorMsg(ERR[lang][key] || ERR[lang].generic);
        setStatus("error");
      }
    } catch {
      setErrorMsg(ERR[lang].network_error);
      setStatus("error");
    }
  };

  const onKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit(e);
  };

  const sent = status === "sent";

  return (
    <section id="contact">
      <div className="container">
        <SecHead cmd="POST /api/contact" hash="06"/>
        <div className="contact-grid">
          <div>
            <h2 className="contact__title">{c.title}</h2>
            <p className="contact__sub">{c.sub}</p>
            <ul className="contact__list">
              <li><span className="k">email</span><a href={`mailto:${C.meta.email}`}>{C.meta.email}</a></li>
              <li><span className="k">phone</span><a href={`tel:${C.meta.phone.replace(/\s/g, "")}`}>{C.meta.phone}</a></li>
              <li><span className="k">linkedin</span><a href={`https://linkedin.com/in/${C.meta.linkedin}`} target="_blank" rel="noreferrer">/in/{C.meta.linkedin}</a></li>
              <li><span className="k">github</span><a href={`https://github.com/${C.meta.github}`} target="_blank" rel="noreferrer">@{C.meta.github}</a></li>
              <li><span className="k">site</span><a href={`https://${C.meta.site}`} target="_blank" rel="noreferrer">{C.meta.site}</a></li>
              <li><span className="k">timezone</span><span style={{color: "var(--fg-2)"}}>{C.meta.timezone} · Hanoi</span></li>
            </ul>
          </div>

          <form className="tform" onSubmit={submit} onKeyDown={onKeyDown}>
            <div className="tform__bar">
              <span className="dots"><i/><i/><i/></span>
              <span style={{marginLeft: 6}}>compose --message</span>
            </div>

            {/* honeypot — hidden from humans, bots fill it */}
            <input
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm({...form, website: e.target.value})}
              style={{position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0}}
              aria-hidden="true"
            />

            {sent ? (
              <div className="tform__sent">{c.sent}</div>
            ) : (<>
              <div className="tform__body">
                <div className="tform__row">
                  <span className="tform__prompt">name $</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    placeholder={c.fields.name}
                    autoComplete="name"
                    disabled={status === "sending"}
                  />
                </div>
                <div className="tform__row">
                  <span className="tform__prompt">email $</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    placeholder={c.fields.email}
                    autoComplete="email"
                    disabled={status === "sending"}
                  />
                </div>
                <div className="tform__row">
                  <span className="tform__prompt">body  $</span>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder={c.fields.message}
                    disabled={status === "sending"}
                  />
                </div>
              </div>

              {status === "error" && (
                <div className="tform__err">
                  <span style={{color: "var(--red)"}}>!</span> {errorMsg}
                </div>
              )}

              <div className="tform__send">
                <span className="tform__hint"><kbd>⌘</kbd>+<kbd>↵</kbd> {lang === "en" ? "to send" : "để gửi"}</span>
                <button type="submit" className="btn btn--primary" disabled={status === "sending"}>
                  {status === "sending"
                    ? (lang === "en" ? "sending…" : "đang gửi…")
                    : c.send}
                  {status !== "sending" && <span className="arrow"><Icon.Arrow/></span>}
                </button>
              </div>
            </>)}
          </form>
        </div>
      </div>
    </section>
  );
}

/* -------------------- footer -------------------- */
function Footer({ lang }) {
  const f = C.footer[lang];
  return (
    <footer className="footer">
      <div className="container footer__row">
        <p>
          <span style={{color: "var(--green)"}}>$</span> whoami<br/>
          <span style={{color: "var(--fg-2)"}}>{C.meta.name.toLowerCase().replace(" ", "-")}</span> — © {new Date().getFullYear()}. {f.rights}
        </p>
        <p>
          <span style={{color: "var(--muted)"}}>// </span>{f.built}
        </p>
        <div className="footer__socials">
          <a href={`https://github.com/${C.meta.github}`} target="_blank" rel="noreferrer" aria-label="github"><Icon.Github/></a>
          <a href={`https://linkedin.com/in/${C.meta.linkedin}`} target="_blank" rel="noreferrer" aria-label="linkedin"><Icon.Linkedin/></a>
          <a href={`mailto:${C.meta.email}`} aria-label="email"><Icon.Mail/></a>
          <a href={`https://${C.meta.site}`} target="_blank" rel="noreferrer" aria-label="site"><Icon.Site/></a>
        </div>
      </div>
    </footer>
  );
}

/* -------------------- app -------------------- */
function App() {
  const [theme, setTheme] = useTheme();
  const [lang, setLang] = useLang();
  return (
    <>
      <Nav lang={lang} setLang={setLang} theme={theme} setTheme={setTheme}/>
      <main>
        <Hero lang={lang}/>
        <About lang={lang}/>
        <Skills lang={lang}/>
        <Experience lang={lang}/>
        <Projects lang={lang}/>
        <Lab lang={lang}/>
        <Contact lang={lang}/>
      </main>
      <Footer lang={lang}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
