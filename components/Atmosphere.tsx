"use client";

import { useMemo } from "react";

export function Atmosphere() {
  const drift = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        key: i,
        isGold: Math.random() > 0.4,
        left: Math.random() * 100,
        delay: Math.random() * 18,
        duration: 16 + Math.random() * 14,
      })),
    []
  );

  return (
    <div className="atmosphere" id="atmosphere" aria-hidden>
      {drift.map((d) => (
        <span
          key={d.key}
          className={d.isGold ? "gold" : "petal"}
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
