import { ImageResponse } from "next/og";
import { content, toLang } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = toLang((await params).lang);
  const m = content.meta;
  const role = lang === "en" ? m.titleEn : m.titleVi;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0b0f14",
        color: "#e6e6e6",
        fontFamily: "monospace",
      }}
    >
      <div style={{ fontSize: 28, color: "#7ee787" }}>$ whoami</div>
      <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20 }}>
        {m.name}
      </div>
      <div style={{ fontSize: 36, color: "#9aa4af", marginTop: 16 }}>
        {role}
      </div>
      <div style={{ fontSize: 28, color: "#7ee787", marginTop: 40 }}>
        {m.site}
      </div>
    </div>,
    { ...size },
  );
}
