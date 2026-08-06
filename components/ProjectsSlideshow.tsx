"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/content";

interface Shot {
  src: string;
  alt: { en: string; vi: string };
}

export default function ProjectsSlideshow({
  shots,
  lang,
}: {
  shots: Shot[];
  lang: Lang;
}) {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (shots.length < 2) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % shots.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [shots.length]);

  const shot = shots[idx];

  return (
    <img
      src={shot.src}
      alt={shot.alt[lang]}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        opacity: fade ? 1 : 0,
        transition: "opacity 0.3s ease",
        display: "block",
      }}
    />
  );
}
