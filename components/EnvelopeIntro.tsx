"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function EnvelopeIntro() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);
  const introRef = useRef<HTMLDivElement | null>(null);

  // lock body scroll while intro is visible
  useEffect(() => {
    document.body.classList.add("intro-locked");
    return () => {
      document.body.classList.remove("intro-locked");
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t1 = setTimeout(() => {
      document.body.classList.remove("intro-locked");
      setGone(true);
    }, 2600);
    return () => clearTimeout(t1);
  }, [open]);

  const sparks = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        key: i,
      })),
    []
  );

  const burst = useMemo(() => {
    const arr: Array<{ bx: number; by: number; delay: number; size: number; key: number }> = [];
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + (Math.random() * 0.3 - 0.15);
      const dist = 80 + Math.random() * 90;
      arr.push({
        bx: Math.cos(angle) * dist,
        by: Math.sin(angle) * dist - 30,
        delay: Math.random() * 0.15,
        size: 3 + Math.random() * 5,
        key: i,
      });
    }
    return arr;
  }, []);

  // remove the DOM node after the fade-out finishes
  useEffect(() => {
    if (!gone) return;
    const t = setTimeout(() => introRef.current?.remove(), 1400);
    return () => clearTimeout(t);
  }, [gone]);

  function openEnvelope() {
    if (open) return;
    setOpen(true);
    // The envelope tap is the user gesture browsers require for audio autoplay.
    // MusicToggle listens for this and starts playback (unless previously muted).
    try {
      window.dispatchEvent(new CustomEvent("jn:intro-opened"));
    } catch {
      /* ignore */
    }
  }

  return (
    <div ref={introRef} className={`intro${gone ? " gone" : ""}`} id="intro">
      <div className="intro-spark">
        {sparks.map((s) => (
          <span
            key={s.key}
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="intro-wrap">
        <div className="intro-eyebrow">
          <span></span>You are cordially invited<span></span>
        </div>

        <div
          className={`envelope${open ? " open" : ""}`}
          role="button"
          tabIndex={0}
          aria-label="Open invitation"
          onClick={openEnvelope}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openEnvelope();
            }
          }}
        >
          <div className="env-aura" />
          <div className="env-body" />
          <div className="env-light" />

          <div className="invitation-card">
            <div className="you">An invitation</div>
            <div className="ic-orn" />
            <div className="ic-names">Jonathan &amp; Nerizza</div>
            <div className="ic-orn" />
            <div className="ic-date">25 · 02 · 2027</div>
          </div>

          <div className="env-flap">
            <svg viewBox="0 0 700 500" preserveAspectRatio="none">
              <defs>
                <linearGradient id="flapGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2a8a6b" />
                  <stop offset="55%" stopColor="#1a6e54" />
                  <stop offset="100%" stopColor="#0a3f30" />
                </linearGradient>
              </defs>
              <path d="M0 0 L700 0 L350 280 Z" fill="url(#flapGrad)" stroke="#c9a961" strokeWidth="2" />
              <path d="M10 10 L690 10 L350 264 Z" fill="none" stroke="#c9a961" strokeOpacity="0.5" strokeWidth="1" />
              <path d="M20 20 L680 20 L350 250 Z" fill="none" stroke="#c9a961" strokeOpacity="0.15" strokeWidth="1" />
            </svg>

            <span className="seal-ring" />

            <svg
              className="seal-laurel"
              viewBox="0 0 150 150"
              fill="none"
              stroke="#c9a961"
              strokeWidth="1.1"
            >
              <path d="M25 75 Q15 60, 18 40" />
              <ellipse cx="22" cy="68" rx="4" ry="7" transform="rotate(-30 22 68)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="19" cy="58" rx="4" ry="7" transform="rotate(-40 19 58)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="17" cy="48" rx="4" ry="7" transform="rotate(-50 17 48)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="28" cy="70" rx="4" ry="6.5" transform="rotate(40 28 70)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <ellipse cx="25" cy="60" rx="4" ry="6.5" transform="rotate(30 25 60)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <ellipse cx="22" cy="50" rx="4" ry="6.5" transform="rotate(20 22 50)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <path d="M125 75 Q135 60, 132 40" />
              <ellipse cx="128" cy="68" rx="4" ry="7" transform="rotate(30 128 68)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="131" cy="58" rx="4" ry="7" transform="rotate(40 131 58)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="133" cy="48" rx="4" ry="7" transform="rotate(50 133 48)" fill="#c9a961" fillOpacity="0.5" stroke="none" />
              <ellipse cx="122" cy="70" rx="4" ry="6.5" transform="rotate(-40 122 70)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <ellipse cx="125" cy="60" rx="4" ry="6.5" transform="rotate(-30 125 60)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <ellipse cx="128" cy="50" rx="4" ry="6.5" transform="rotate(-20 128 50)" fill="#c9a961" fillOpacity="0.35" stroke="none" />
              <circle cx="75" cy="112" r="2" fill="#c9a961" stroke="none" />
              <circle cx="68" cy="110" r="1.4" fill="#c9a961" stroke="none" opacity="0.6" />
              <circle cx="82" cy="110" r="1.4" fill="#c9a961" stroke="none" opacity="0.6" />
            </svg>

            <div className="seal">
              <span className="seal-text">J&amp;N</span>
            </div>
          </div>

          <div className="env-burst">
            {burst.map((b) => (
              <span
                key={b.key}
                className="b"
                style={
                  {
                    "--bx": `${b.bx}px`,
                    "--by": `${b.by}px`,
                    animationDelay: `${b.delay}s`,
                    width: `${b.size}px`,
                    height: `${b.size}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="intro-prompt">
          <em>Pour vous</em>
          <span className="tap">Tap envelope to open</span>
        </div>
      </div>
    </div>
  );
}
