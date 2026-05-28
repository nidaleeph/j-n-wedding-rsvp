"use client";

import { useEffect, useRef, useState } from "react";

const SRC = "/audio/out-of-my-league.mp3";
// New key + value scheme so any leftover "1" from earlier buggy versions is
// ignored (which would have stuck the page on muted). Anything other than
// "off" means: play by default.
const PREF_KEY = "jn-music-pref";
const LEGACY_KEY = "jn-music-muted";
const TARGET_VOLUME = 0.55;
const FADE_MS = 1400;

/**
 * Floating bottom-right music button.
 *
 * Behavior:
 *  - Audio is muted in the DOM until the envelope intro dispatches
 *    `jn:intro-opened` — that click is the user gesture browsers need.
 *  - On that event, we start playback unless the visitor has *explicitly*
 *    muted via the button on a previous visit (`localStorage["jn-music-muted"]
 *    === "1"`).
 *  - localStorage is written ONLY when the user clicks the toggle. We never
 *    persist transient state, so reloads can't accidentally stick on muted.
 */
export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number | null>(null);
  // Have we received the user gesture (envelope tap) yet? Until then, we
  // don't touch the audio element at all.
  const gestureRef = useRef(false);

  const [shown, setShown] = useState(false);
  const [muted, setMuted] = useState(true);

  // Clear any leftover stale key from earlier buggy builds.
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Listen for the envelope-open gesture
  useEffect(() => {
    function onIntroOpened() {
      if (gestureRef.current) return;
      gestureRef.current = true;
      setShown(true);

      let userMuted = false;
      try {
        userMuted = localStorage.getItem(PREF_KEY) === "off";
      } catch {
        /* ignore */
      }
      setMuted(userMuted);
    }
    window.addEventListener("jn:intro-opened", onIntroOpened);
    return () => window.removeEventListener("jn:intro-opened", onIntroOpened);
  }, []);

  // Drive the audio element from `muted` — but only after the user gesture.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!gestureRef.current) return;

    if (fadeRafRef.current !== null) {
      cancelAnimationFrame(fadeRafRef.current);
      fadeRafRef.current = null;
    }

    if (muted) {
      fadeTo(audio, 0, FADE_MS, () => audio.pause());
      return;
    }

    audio.volume = audio.volume || 0;
    const p = audio.play();
    if (p) {
      p.catch(() => {
        // Browser still blocked it — give up gracefully without persisting.
        setMuted(true);
      });
    }
    fadeTo(audio, TARGET_VOLUME, FADE_MS);
  }, [muted]);

  function fadeTo(audio: HTMLAudioElement, target: number, ms: number, done?: () => void) {
    const start = audio.volume;
    const t0 = performance.now();
    function step(now: number) {
      const p = Math.min(1, (now - t0) / ms);
      audio.volume = start + (target - start) * p;
      if (p < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        fadeRafRef.current = null;
        done?.();
      }
    }
    fadeRafRef.current = requestAnimationFrame(step);
  }

  function onClick() {
    const next = !muted;
    setMuted(next);
    // Only an explicit click persists the preference.
    try {
      localStorage.setItem(PREF_KEY, next ? "off" : "on");
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="auto" />
      <button
        type="button"
        className={`music-toggle${shown ? " show" : ""}${muted ? " muted" : ""}`}
        aria-label={muted ? "Play music" : "Mute music"}
        aria-pressed={!muted}
        onClick={onClick}
      >
        <svg
          className="ic-play"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19V5l10 7-10 7Z" />
        </svg>
        <svg
          className="ic-mute"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9v6h4l5 4V5L7 9H3Z" />
          <line x1="15" y1="9" x2="21" y2="15" />
          <line x1="21" y1="9" x2="15" y2="15" />
        </svg>
      </button>
    </>
  );
}
