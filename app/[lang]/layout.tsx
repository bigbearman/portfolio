import { JetBrains_Mono } from "next/font/google";
import { toLang } from "@/content";
import "../globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
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
