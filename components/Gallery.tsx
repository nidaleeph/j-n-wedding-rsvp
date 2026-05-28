"use client";

import { useCallback, useEffect, useState } from "react";

type Item = { cls: string; src: string; tag: string; delay: string };

const items: Item[] = [
  {
    cls: "a",
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    tag: "Together",
    delay: "",
  },
  {
    cls: "b",
    src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=80",
    tag: "The Ring",
    delay: "d1",
  },
  {
    cls: "c",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
    tag: "Promises",
    delay: "d2",
  },
  {
    cls: "d",
    src: "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=1100&q=80",
    tag: "Forever",
    delay: "d1",
  },
  {
    cls: "e",
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
    tag: "Always",
    delay: "d2",
  },
  {
    cls: "f",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=700&q=80",
    tag: "Details",
    delay: "d3",
  },
  {
    cls: "g",
    src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
    tag: "Florals",
    delay: "d2",
  },
];

function upgradeUrl(src: string) {
  return src.replace(/w=\d+/, "w=1600").replace(/q=\d+/, "q=85");
}

export function Gallery() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const open = useCallback((i: number) => {
    setOpenIdx(((i % items.length) + items.length) % items.length);
  }, []);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % items.length)),
    []
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + items.length) % items.length)),
    []
  );

  useEffect(() => {
    if (openIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIdx, close, next, prev]);

  const current = openIdx !== null ? items[openIdx] : null;

  return (
    <>
      <section className="gallery-sec" id="gallery">
        <div className="container center">
          <div className="eyebrow reveal">Captured moments</div>
          <h2 className="section-title reveal d1">
            Our <em>favourite</em> frames
          </h2>
          <p className="lead reveal d2">
            A few of the little moments that made us — laughter, light, and everything in between.
          </p>
        </div>

        <div className="container gallery">
          {items.map((it, i) => (
            <div
              key={it.cls}
              className={["g-item", it.cls, "reveal", it.delay].filter(Boolean).join(" ")}
              role="button"
              tabIndex={0}
              onClick={() => open(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(i);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" src={it.src} alt={it.tag} />
              <div className="tag">{it.tag}</div>
            </div>
          ))}
        </div>
      </section>

      <div
        className={`lightbox${openIdx !== null ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={openIdx === null}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="lightbox-stage">
          <div className="lightbox-count">
            <em>{openIdx !== null ? openIdx + 1 : 1}</em> / <em>{items.length}</em>
          </div>
          <button
            className="lightbox-close"
            aria-label="Close"
            type="button"
            onClick={close}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
          <button
            className="lightbox-nav prev"
            aria-label="Previous"
            type="button"
            onClick={prev}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <button
            className="lightbox-nav next"
            aria-label="Next"
            type="button"
            onClick={next}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
          <div className="lightbox-img-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current ? upgradeUrl(current.src) : ""}
              alt={current?.tag ?? ""}
            />
            <div className="lightbox-meta">{current?.tag ?? ""}</div>
          </div>
        </div>
      </div>
    </>
  );
}
