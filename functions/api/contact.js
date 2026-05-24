/**
 * Cloudflare Pages Function — POST /api/contact
 * ---------------------------------------------
 * Receives the contact form submission and forwards it to your inbox
 * via the Resend API. Free tier: 100 emails/day, 3,000/month.
 *
 * Required environment variables (set in Cloudflare dashboard →
 * Pages project → Settings → Environment variables):
 *
 *   RESEND_API_KEY   Your Resend API key (re_xxxxxxxxxxxxxxxxx)
 *   TO_EMAIL         Inbox that receives contact messages
 *                    e.g. kienduong.hust@gmail.com
 *   FROM_EMAIL       (optional) Verified sender at your domain
 *                    e.g. contact@kiendt.dev
 *                    Falls back to onboarding@resend.dev for testing.
 *
 * Do NOT commit real keys. Put them in the Cloudflare dashboard only.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

// Very small in-memory rate limit per Worker isolate (best-effort, not perfect)
const hits = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;

function rateLimit(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length <= RATE_MAX;
}

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  // --- 1. parse + validate ---
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const honey = (body.website || "").trim(); // honeypot — real users leave empty
  const lang = body.lang === "vi" ? "vi" : "en";

  if (honey) {
    // Pretend success so bots don't retry
    return json({ ok: true });
  }
  if (!name || name.length > 120) return json({ ok: false, error: "bad_name" }, 400);
  if (!EMAIL_RE.test(email) || email.length > 200)
    return json({ ok: false, error: "bad_email" }, 400);
  if (!message || message.length < 5 || message.length > 5000)
    return json({ ok: false, error: "bad_message" }, 400);

  // --- 2. rate limit by IP ---
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";
  if (!rateLimit(ip)) {
    return json({ ok: false, error: "rate_limited" }, 429);
  }

  // --- 3. env check ---
  const apiKey = env.RESEND_API_KEY;
  const to = env.TO_EMAIL;
  const from = env.FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return json({ ok: false, error: "server_not_configured" }, 500);
  }

  // --- 4. compose + send via Resend ---
  const subject = `[Portfolio] new message from ${name}`;
  const html = `
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; max-width: 560px; color: #1a1f26;">
      <h2 style="font-size: 16px; margin: 0 0 12px;">New contact-form message</h2>
      <p style="margin: 4px 0;"><strong>name</strong>  ${escapeHtml(name)}</p>
      <p style="margin: 4px 0;"><strong>email</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin: 4px 0;"><strong>lang</strong>  ${escapeHtml(lang)}</p>
      <p style="margin: 4px 0;"><strong>ip</strong>    ${escapeHtml(ip)}</p>
      <hr style="border:none; border-top:1px solid #e6e3da; margin:14px 0;"/>
      <pre style="white-space: pre-wrap; word-break: break-word; font: inherit; margin: 0;">${escapeHtml(message)}</pre>
    </div>
  `;
  const text = `New contact-form message\n\nname:  ${name}\nemail: ${email}\nlang:  ${lang}\nip:    ${ip}\n\n${message}\n`;

  let resendRes;
  try {
    resendRes = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        reply_to: email,
      }),
    });
  } catch (err) {
    return json({ ok: false, error: "network_error" }, 502);
  }

  if (!resendRes.ok) {
    let detail = "";
    try {
      detail = await resendRes.text();
    } catch {}
    console.error("resend_failed", resendRes.status, detail);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

// Block other methods cleanly
export const onRequest = ({ request }) => {
  if (request.method === "POST") return onRequestPost({ request });
  return new Response("method not allowed", { status: 405 });
};
