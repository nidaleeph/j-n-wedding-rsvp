"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SLIDES, UPLOADS, isDarkSurface } from "./slides";

/**
 * Presentation credentials.
 *
 * This is a client-side gate, exactly as the design specifies: the check runs
 * in the browser and the credentials below ship in the JS bundle. It keeps a
 * casual visitor out of the deck; it does not make the content private. If this
 * ever needs to be genuinely non-public, move the check to a route handler and
 * gate the slide markup behind an httpOnly cookie.
 */
const AUTH = { user: "family", pass: "pamamanhikan2027"};
const SKEY = "jn-pamamanhikan-auth";

export function Deck({ availablePhotos }: { availablePhotos: string[] }) {
  const [live, setLive] = useState(false);
  const [idx, setIdx] = useState(0);
  /** Bumped on each failed sign-in; the bump re-mounts the error and restarts its shake. */
  const [errCount, setErrCount] = useState(0);

  const deckRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const touch = useRef({ x: 0, y: 0 });

  const present = useMemo(() => new Set(availablePhotos), [availablePhotos]);
  const have = useCallback((file: string) => present.has(file), [present]);
  const ctx = useMemo(() => ({ have }), [have]);

  const last = SLIDES.length - 1;

  /* ── scale-to-fit: a slide is never allowed to clip ── */
  const fitSlide = useCallback((slide: HTMLElement | null) => {
    if (!slide) return;
    const fit = slide.querySelector<HTMLElement>(".fit");
    const wrap = fit?.querySelector<HTMLElement>(".wrap");
    if (!fit || !wrap) return;

    wrap.style.transform = "translate(-50%,-50%)";
    const cs = getComputedStyle(fit);
    const availH = slide.clientHeight - (parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom));
    const availW = slide.clientWidth - (parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight));
    if (availH <= 0 || availW <= 0) return;

    const k = Math.min(1, availH / wrap.scrollHeight, availW / wrap.scrollWidth);
    wrap.style.transform =
      "translate(-50%,-50%)" + (k < 0.999 ? ` scale(${k.toFixed(4)})` : "");
  }, []);

  const fitAll = useCallback(() => {
    slideRefs.current.forEach(fitSlide);
  }, [fitSlide]);

  /* ── navigation ── */
  const next = useCallback(() => setIdx((i) => Math.min(i + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  const exit = useCallback(() => {
    setLive(false);
    setIdx(0);
    setErrCount(0);
    try {
      sessionStorage.removeItem(SKEY);
    } catch {
      /* private browsing — the gate simply won't be remembered */
    }
    formRef.current?.reset();
    setTimeout(() => userRef.current?.focus(), 250);
  }, []);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const u = userRef.current?.value.trim() ?? "";
    const p = passRef.current?.value ?? "";
    if (u === AUTH.user && p === AUTH.pass) {
      try {
        sessionStorage.setItem(SKEY, "1");
      } catch {
        /* non-fatal: the deck opens, it just won't survive a reload */
      }
      setErrCount(0);
      setLive(true);
      return;
    }
    setErrCount((n) => n + 1);
    if (passRef.current) {
      passRef.current.value = "";
      passRef.current.focus();
    }
  }, []);

  /* ── restore a session that already signed in ── */
  useEffect(() => {
    let restored = false;
    try {
      restored = sessionStorage.getItem(SKEY) === "1";
    } catch {
      /* ignore */
    }
    if (restored) setLive(true);
    else userRef.current?.focus();
  }, []);

  /* ── page-level state while the deck owns the viewport ── */
  useEffect(() => {
    document.body.classList.add("pmk-locked");
    return () => document.body.classList.remove("pmk-locked");
  }, []);

  useEffect(() => {
    const dark = live && isDarkSurface(SLIDES[idx].surface);
    document.body.classList.toggle("pmk-dark", dark);
    return () => document.body.classList.remove("pmk-dark");
  }, [live, idx]);

  /* ── keep every slide fitted ── */
  useEffect(() => {
    if (!live) return;
    const raf = requestAnimationFrame(fitAll);
    const t = setTimeout(fitAll, 400);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [live, fitAll]);

  useEffect(() => {
    fitSlide(slideRefs.current[idx]);
  }, [idx, fitSlide]);

  useEffect(() => {
    const onOrientation = () => setTimeout(fitAll, 220);
    window.addEventListener("resize", fitAll);
    window.addEventListener("orientationchange", onOrientation);
    if (document.fonts?.ready) document.fonts.ready.then(fitAll).catch(() => {});
    return () => {
      window.removeEventListener("resize", fitAll);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, [fitAll]);

  // Photos settle after layout, so refit the slide each one lands on.
  useEffect(() => {
    const root = deckRef.current;
    if (!root) return;
    const bound = Array.from(root.querySelectorAll("img")).map((img) => {
      const onLoad = () => fitSlide(img.closest<HTMLElement>(".slide"));
      img.addEventListener("load", onLoad);
      return [img, onLoad] as const;
    });
    return () => bound.forEach(([img, onLoad]) => img.removeEventListener("load", onLoad));
  }, [fitSlide]);

  /* ── keyboard ── */
  useEffect(() => {
    if (!live) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        exit();
      } else if (e.key === "Home") {
        setIdx(0);
      } else if (e.key === "End") {
        setIdx(SLIDES.length - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [live, next, prev, exit]);

  /* ── touch ── */
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touch.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!live) return;
      const dx = e.changedTouches[0].clientX - touch.current.x;
      const dy = e.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) next();
        else prev();
      }
    },
    [live, next, prev],
  );

  return (
    <div className="pmk">
      {/* ══════════ LOGIN GATE ══════════ */}
      <div className={`gate${live ? " hidden" : ""}`} aria-hidden={live}>
        <form className="gate-card" ref={formRef} onSubmit={onSubmit} autoComplete="off">
          <span className="corner tl" />
          <span className="corner br" />
          <div className="gate-mono">J &amp; N</div>
          <div className="rule" />
          <h1 className="gate-title">FAMILY PRESENTATION</h1>
          <p className="gate-sub">Pamamanhikan · for our families only</p>
          <div className="gate-field">
            <label htmlFor="pmk-u">Username</label>
            <input
              id="pmk-u"
              ref={userRef}
              type="text"
              autoCapitalize="none"
              spellCheck={false}
              required
              tabIndex={live ? -1 : 0}
            />
          </div>
          <div className="gate-field">
            <label htmlFor="pmk-p">Password</label>
            <input id="pmk-p" ref={passRef} type="password" required tabIndex={live ? -1 : 0} />
          </div>
          <button className="gate-btn" type="submit" tabIndex={live ? -1 : 0}>
            Enter Presentation
          </button>
          <div key={errCount} className={`gate-err${errCount > 0 ? " show" : ""}`} role="alert">
            Incorrect username or password
          </div>
        </form>
      </div>

      {/* ══════════ DECK ══════════ */}
      <div
        className={`deck${live ? " live" : ""}`}
        ref={deckRef}
        aria-live="polite"
        aria-hidden={!live}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((slide, i) => (
          <section
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`slide ${slide.surface}${i === idx ? " on" : ""}`}
          >
            {slide.surface === "photo" && (
              <>
                <div
                  className={`s-bg${slide.bg && have(slide.bg) ? "" : " pending"}`}
                  style={
                    slide.bg && have(slide.bg)
                      ? { backgroundImage: `url('${UPLOADS}${slide.bg}')` }
                      : undefined
                  }
                />
                <div className="s-veil" />
              </>
            )}
            <div className="fit">
              <div className={`wrap${slide.wide ? " wide" : ""}`}>
                {slide.render(ctx)}
                {slide.endButton && (
                  <button className="end-btn" type="button" onClick={exit}>
                    End Presentation
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ══════════ CHROME ══════════ */}
      {live && (
        <>
          <div className="bar top">
            <div className="brand">J &amp; N</div>
            <div className="chip">Pamamanhikan · 2027</div>
          </div>
          <div className="bar bot">
            <div className="counter">
              <b>{idx + 1}</b> / <b>{SLIDES.length}</b>
            </div>
            <div className="navs">
              <button
                className="nav-btn"
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                disabled={idx === 0}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <button
                className="nav-btn"
                type="button"
                aria-label="Next slide"
                onClick={next}
                disabled={idx === last}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
            <button className="exit" type="button" onClick={exit}>
              Exit
            </button>
          </div>
          <div className="progress">
            <i style={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }} />
          </div>
        </>
      )}
    </div>
  );
}
