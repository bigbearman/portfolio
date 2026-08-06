import { JetBrains_Mono } from "next/font/google";
import type { Metadata } from "next";
import { content, toLang } from "@/content";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = toLang((await params).lang);
  const m = content.meta;
  const title = `${m.name} — ${lang === "en" ? m.titleEn : m.titleVi}`;
  const description = content.hero[lang].sub;
  const siteUrl = `https://${m.site}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${lang}/`,
      languages: { en: "/en/", vi: "/vi/" },
    },
    openGraph: {
      title,
      description,
      url: `/${lang}/`,
      siteName: m.name,
      locale: lang === "en" ? "en_US" : "vi_VN",
      alternateLocale: lang === "en" ? "vi_VN" : "en_US",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = toLang((await params).lang);

  return (
    <html lang={lang} data-theme="dark">
      <body className={jetbrainsMono.className}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=JSON.parse(localStorage.getItem('kd:theme')||'\"dark\"');document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
