import { content, type Lang } from "@/content";

export default function JsonLd({ lang }: { lang: Lang }) {
  const m = content.meta;
  const siteUrl = `https://${m.site}`;
  const jobTitle = lang === "en" ? m.titleEn : m.titleVi;

  const person = {
    "@type": "Person",
    name: m.name,
    jobTitle,
    url: siteUrl,
    image: `${siteUrl}/profile.webp`,
    email: `mailto:${m.email}`,
    telephone: m.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hanoi",
      addressCountry: "VN",
    },
    knowsAbout: content.skills.groups.flatMap((g) => g.items),
    sameAs: [
      `https://github.com/${m.github}`,
      `https://linkedin.com/in/${m.linkedin}`,
      siteUrl,
    ],
  };

  const website = {
    "@type": "WebSite",
    url: siteUrl,
    name: m.name,
    inLanguage: lang,
    author: person,
  };

  const profilePage = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteUrl}/${lang}/`,
    inLanguage: lang,
    about: person,
    isPartOf: website,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
    />
  );
}
