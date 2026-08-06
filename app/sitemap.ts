import type { MetadataRoute } from "next";
import { content } from "@/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = `https://${content.meta.site}`;
  const languages = { en: `${siteUrl}/en/`, vi: `${siteUrl}/vi/` };
  return [
    { url: languages.en, alternates: { languages } },
    { url: languages.vi, alternates: { languages } },
  ];
}
