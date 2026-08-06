"use client";

import { useEffect, useState } from "react";

export default function TypedName({ text }: { text: string }) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [text]);

  return (
    <span>
      {shown}
      <span className="cursor" aria-hidden="true"></span>
    </span>
  );
}
