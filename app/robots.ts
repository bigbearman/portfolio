import type { MetadataRoute } from "next";
import { content } from "@/content";

export const dynamic = "force-static";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = `https://${content.meta.site}`;
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
