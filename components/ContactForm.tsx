"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { content, type Lang } from "@/content";
import { Arrow } from "./Icon";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ lang }: { lang: Lang }) {
  const c = content.contact[lang];
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
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
      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        const key = (data.error as keyof typeof c.errors) || "generic";
        setErrorMsg(c.errors[key] || c.errors.generic);
        setStatus("error");
      }
    } catch {
      setErrorMsg(c.errors.network_error);
      setStatus("error");
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.currentTarget.requestSubmit();
    }
  };

  const sent = status === "sent";

  return (
    <form className="tform" onSubmit={submit} onKeyDown={onKeyDown}>
      <div className="tform__bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span style={{ marginLeft: 6 }}>compose --message</span>
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
        style={{
          position: "absolute",
          left: "-9999px",
          width: 1,
          height: 1,
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {sent ? (
        <div className="tform__sent">{c.sent}</div>
      ) : (
        <>
          <div className="tform__body">
            <div className="tform__row">
              <span className="tform__prompt">name $</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={c.fields.email}
                autoComplete="email"
                disabled={status === "sending"}
              />
            </div>
            <div className="tform__row">
              <span className="tform__prompt">body $</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={c.fields.message}
                disabled={status === "sending"}
              />
            </div>
          </div>

          {status === "error" && (
            <div className="tform__err">
              <span style={{ color: "var(--red)" }}>!</span> {errorMsg}
            </div>
          )}

          <div className="tform__send">
            <span className="tform__hint">
              <kbd>⌘</kbd>+<kbd>↵</kbd> {lang === "en" ? "to send" : "để gửi"}
            </span>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? lang === "en"
                  ? "sending…"
                  : "đang gửi…"
                : c.send}
              {status !== "sending" && (
                <span className="arrow">
                  <Arrow />
                </span>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}
