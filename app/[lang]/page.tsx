import { content, toLang } from "@/content";
import Nav from "@/components/Nav";

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
      <p>
        {lang}: {content.meta.name}
      </p>
    </>
  );
}
