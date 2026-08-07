import fs from "node:fs";
import path from "node:path";

/**
 * The hero background video.
 *
 * Rendered only when the file is actually in `public/hero/` — otherwise the
 * still `.hero-bg` behind it carries the section on its own, so a missing
 * encode degrades to the old hero rather than to a black rectangle. The still
 * also covers the cases the video can't: `prefers-reduced-motion`, a browser
 * that refuses to autoplay, and the moments before the first frame decodes.
 */
const HERO_DIR = path.join(process.cwd(), "public", "hero");
const VIDEO = "hero.mp4";
const POSTER = "hero-poster.jpg";

function heroAssets() {
  let files: string[] = [];
  try {
    files = fs.readdirSync(HERO_DIR);
  } catch {
    /* no hero directory yet */
  }
  return {
    video: files.includes(VIDEO) ? `/hero/${VIDEO}` : null,
    poster: files.includes(POSTER) ? `/hero/${POSTER}` : undefined,
  };
}

const CornerOrnament = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => (
  <svg
    className={`hero-orn ${pos}`}
    viewBox="0 0 100 100"
    fill="none"
    stroke="#d9c089"
    strokeWidth="0.8"
    aria-hidden
  >
    <path d="M2 30 L2 2 L30 2" />
    <path d="M2 56 Q2 18, 18 8 Q34 2, 56 2" opacity="0.55" />
    <circle cx="2" cy="2" r="2.5" fill="#d9c089" stroke="none" />
    {(pos === "tl" || pos === "tr") && (
      <path
        d="M14 14 Q22 18, 26 26 Q22 22, 14 22 Z"
        fill="#d9c089"
        fillOpacity="0.35"
        stroke="none"
      />
    )}
  </svg>
);

function AnimatedName({ name, baseDelay }: { name: string; baseDelay: number }) {
  return (
    <h1 className="hero-name" aria-label={name}>
      {name.split("").map((ch, i) => (
        <span
          key={i}
          className="letter"
          style={{ animationDelay: `${baseDelay + i * 0.08}s` }}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const { video, poster } = heroAssets();

  return (
    <header className="hero" id="top">
      {video && (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      <div className="hero-bg" />

      <CornerOrnament pos="tl" />
      <CornerOrnament pos="tr" />
      <CornerOrnament pos="bl" />
      <CornerOrnament pos="br" />

      <div className="hero-inner">
        <div className="hero-eyebrow">Together with their families</div>

        <AnimatedName name="Jonathan" baseDelay={0.4} />
        <span className="hero-amp">&amp;</span>
        <AnimatedName name="Nerizza" baseDelay={1.8} />

        <div className="hero-divider" />

        <div className="hero-meta">
          <div className="date">25 · 02 · 2027</div>
          <div className="place">Tagaytay, Philippines</div>
        </div>
      </div>

      <div className="scroll-cue">Scroll to discover</div>
    </header>
  );
}
