import { content, toLang } from "@/content";

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
    <p>
      {lang}: {content.meta.name}
    </p>
  );
}
