"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { FRAMES, GALLERY_DIR } from "./gallery-frames";

/**
 * Tiles per row, down the section. The trailing pair repeats if the gallery
 * ever grows past twelve, so it keeps alternating rather than falling apart.
 */
const ROW_PATTERN = [1, 2, 3, 2, 3, 1];

/** How many tiles share each frame's row — drives the tile shape in CSS. */
function rowSizes(count: number): number[] {
  const out: number[] = [];
  for (let i = 0, row = 0; i < count; row += 1) {
    const n = Math.min(
      row < ROW_PATTERN.length ? ROW_PATTERN[row] : row % 2 ? 3 : 2,
      count - i
    );
    for (let k = 0; k < n; k += 1) out.push(n);
    i += n;
  }
  return out;
}

export function Gallery({ availablePhotos }: { availablePhotos: string[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // A frame with no file on disk is skipped rather than rendered broken, so the
  // gallery stays presentable while photos are still being collected.
  const frames = useMemo(() => {
    const present = new Set(availablePhotos);
    return FRAMES.filter((f) => present.has(f.file));
  }, [availablePhotos]);

  const count = frames.length;
  const sizes = useMemo(() => rowSizes(count), [count]);

  const open = useCallback((i: number) => setOpenIdx(i), []);
  const close = useCallback(() => setOpenIdx(null), []);
  const next = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i + 1) % count)),
    [count]
  );
  const prev = useCallback(
    () => setOpenIdx((i) => (i === null ? null : (i - 1 + count) % count)),
    [count]
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

  const current = openIdx !== null ? frames[openIdx] : null;

  if (count === 0) return null;

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
          {frames.map((it, i) => (
            <div
              key={it.file}
              className={["g-item", `t${sizes[i]}`, "reveal", i % 3 ? `d${i % 3}` : ""]
                .filter(Boolean)
                .join(" ")}
              role="button"
              aria-label={`Open ${it.tag}`}
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
              <img
                loading="lazy"
                src={`${GALLERY_DIR}${it.file}`}
                alt={it.alt}
                style={it.focus ? { objectPosition: it.focus } : undefined}
              />
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
            <em>{openIdx !== null ? openIdx + 1 : 1}</em> / <em>{count}</em>
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
              src={current ? `${GALLERY_DIR}${current.file}` : ""}
              alt={current?.alt ?? ""}
            />
            <div className="lightbox-meta">{current?.tag ?? ""}</div>
          </div>
        </div>
      </div>
    </>
  );
}
