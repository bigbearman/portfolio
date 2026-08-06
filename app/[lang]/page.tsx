import { toLang } from "@/content";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "vi" }];
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = toLang((await params).lang);
  return (
    <>
      <Nav lang={lang} />
      <main>
        <Hero lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
      </main>
    </>
  );
}
