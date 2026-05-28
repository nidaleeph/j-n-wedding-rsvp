"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

type Attend = "yes" | "no" | null;

type RsvpData = {
  fname: string;
  attend: Attend;
  diet: string;
  declineMsg: string;
  msg: string;
  song: string;
};

const INITIAL: RsvpData = {
  fname: "",
  attend: null,
  diet: "",
  declineMsg: "",
  msg: "",
  song: "",
};

const MENU = [
  {
    num: "I.",
    course: "To begin",
    dish: "Welcome Canapés",
    desc: "smoked salmon blinis · truffle arancini · caprese skewers",
  },
  {
    num: "II.",
    course: "Appetizer",
    dish: "Pan-seared Scallops",
    desc: "cauliflower purée, brown butter, crispy capers",
  },
  {
    num: "III.",
    course: "Soup",
    dish: "Roasted Pumpkin & Sage",
    desc: "toasted pepitas, crème fraîche, brown butter",
  },
  {
    num: "IV.",
    course: "Salad",
    dish: "Burrata & Heirloom Tomato",
    desc: "aged balsamic, basil oil, warm sourdough",
  },
  {
    num: "V.",
    course: "Main Course",
    dish: "Beef Tenderloin",
    desc: "slow-braised, truffle jus, roasted root vegetables, potato pâvé",
  },
  {
    num: "VI.",
    course: "Dessert",
    dish: "Vanilla Bean Panna Cotta",
    desc: "candied citrus, raspberry coulis, edible gold leaf",
  },
  {
    num: "VII.",
    course: "To finish",
    dish: "Coffee, Tea & Petit Fours",
    desc: "artisan chocolates, macarons, espresso, herbal teas",
  },
];

const STEPS_TOTAL = 4; // steps 1..4 are input; 5 is confirmation

export function Rsvp() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RsvpData>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const cardRef = useRef<HTMLFormElement | null>(null);
  const confettiRef = useRef<HTMLDivElement | null>(null);

  function update<K extends keyof RsvpData>(key: K, value: RsvpData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function scrollIntoView() {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 720) return;
    const card = cardRef.current;
    if (!card) return;
    const y = card.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  function go(n: number) {
    setStep(n);
    setTimeout(scrollIntoView, 50);
  }

  function validateStep(n: number) {
    if (n === 1) {
      if (!data.fname.trim()) {
        flash("fname");
        return false;
      }
    }
    if (n === 2) return !!data.attend;
    return true;
  }

  function flash(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.transition = "transform .08s";
    el.style.transform = "translateX(-6px)";
    setTimeout(() => (el.style.transform = "translateX(6px)"), 80);
    setTimeout(() => (el.style.transform = ""), 160);
    el.focus?.();
  }

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fname.trim(),
          attending: data.attend === "yes",
          dietaryNotes: data.diet.trim() || null,
          declineMessage: data.declineMsg.trim() || null,
          message: data.msg.trim() || null,
          songRequest: data.song.trim() || null,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      go(5);
      burstConfetti();
      try {
        localStorage.setItem("jn-rsvp", JSON.stringify(data));
      } catch {
        /* ignore */
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function burstConfetti() {
    const wrap = confettiRef.current;
    if (!wrap) return;
    wrap.innerHTML = "";
    const colors = ["#0f5440", "#1a6e54", "#c9a961", "#d9c089", "#f3e6cd", "#ffffff"];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement("span");
      p.className = "piece";
      p.style.background = colors[i % colors.length];
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 0.4}s`;
      p.style.animationDuration = `${2 + Math.random() * 1.6}s`;
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      p.style.width = `${4 + Math.random() * 6}px`;
      p.style.height = `${8 + Math.random() * 10}px`;
      if (i % 5 === 0) p.style.borderRadius = "50%";
      wrap.appendChild(p);
    }
  }

  // Hydrate from localStorage on first mount — show confirmation if returning visitor
  useEffect(() => {
    try {
      const raw = localStorage.getItem("jn-rsvp");
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<RsvpData>;
      if (saved && saved.attend) {
        setData({ ...INITIAL, ...saved });
        setStep(5);
      } else if (saved?.fname) {
        setData((d) => ({ ...d, fname: saved.fname || "" }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit();
  }

  function onClickNext() {
    if (!validateStep(step)) return;
    // Decliners: skip step 4 entirely — submit after the message field on step 3
    if (step === 3 && data.attend === "no") {
      submit();
      return;
    }
    go(Math.min(step + 1, STEPS_TOTAL));
  }

  function onClickBack() {
    go(Math.max(step - 1, 1));
  }

  const stepProps = (n: number) => ({
    className: `step${step === n ? " active" : ""}`,
    "data-step": n,
  });

  const firstName = useMemo(() => (data.fname || "Friend").trim().split(" ")[0], [data.fname]);

  return (
    <section className="rsvp-sec" id="rsvp">
      <div className="container center">
        <div className="eyebrow reveal">Reservation</div>
        <h2 className="section-title reveal d1">
          Kindly <em>reply</em>
        </h2>
        <p className="lead reveal d2">
          Your presence means the world. Please respond on or before{" "}
          <strong>January 25, 2027</strong>.
        </p>
      </div>

      <form
        ref={cardRef}
        className="rsvp-card reveal d2"
        autoComplete="off"
        noValidate
        onSubmit={onSubmit}
      >
        <Stepper current={step} />

        {/* STEP 1 — Name */}
        <div {...stepProps(1)}>
          <h3>First, tell us who you are</h3>
          <p className="step-sub">We'll match your name to our invitation list.</p>
          <div className="field">
            <label htmlFor="fname">Full name</label>
            <input
              id="fname"
              name="fname"
              type="text"
              placeholder="e.g. Maria Santos"
              required
              value={data.fname}
              onChange={(e) => update("fname", e.target.value)}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              fontStyle: "italic",
              color: "color-mix(in oklab, var(--emerald-800), transparent 40%)",
              marginTop: -4,
            }}
          >
            Please write your full name exactly as it appears on your invitation.
          </p>
          <div className="step-actions">
            <span />
            <button type="button" className="btn" onClick={onClickNext}>
              Continue
            </button>
          </div>
        </div>

        {/* STEP 2 — Attending */}
        <div {...stepProps(2)}>
          <h3>Will you be joining us?</h3>
          <p className="step-sub">We truly hope to celebrate with you.</p>
          <div className="choice-grid">
            <div
              className={`choice${data.attend === "yes" ? " selected" : ""}`}
              tabIndex={0}
              role="button"
              onClick={() => update("attend", "yes")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && update("attend", "yes")}
            >
              <svg className="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M24 42 L8 26 Q2 20, 8 14 Q14 8, 20 14 L24 18 L28 14 Q34 8, 40 14 Q46 20, 40 26 Z" />
              </svg>
              <div className="title">Joyfully Accept</div>
              <div className="desc">I'll be there</div>
            </div>
            <div
              className={`choice${data.attend === "no" ? " selected" : ""}`}
              tabIndex={0}
              role="button"
              onClick={() => update("attend", "no")}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && update("attend", "no")}
            >
              <svg className="ico" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="24" cy="24" r="18" />
                <path d="M16 32 Q24 26, 32 32" />
                <circle cx="18" cy="20" r="1.4" fill="currentColor" />
                <circle cx="30" cy="20" r="1.4" fill="currentColor" />
              </svg>
              <div className="title">Regretfully Decline</div>
              <div className="desc">Wish I could</div>
            </div>
          </div>
          <div className="step-actions">
            <button type="button" className="btn ghost" onClick={onClickBack}>
              Back
            </button>
            <button type="button" className="btn" disabled={!data.attend} onClick={onClickNext}>
              Continue
            </button>
          </div>
        </div>

        {/* STEP 3 — Details (accept) OR Decline note */}
        <div {...stepProps(3)}>
          {data.attend === "yes" ? (
            <>
              <h3>A few more details</h3>
              <p className="step-sub">Just so we can take care of you.</p>

              <div className="field">
                <label htmlFor="diet">Allergies or dietary notes</label>
                <input
                  id="diet"
                  type="text"
                  placeholder="Optional — anything we should know"
                  value={data.diet}
                  onChange={(e) => update("diet", e.target.value)}
                />
              </div>

              <div className="menu-card">
                <div className="menu-eyebrow">An evening of indulgence</div>
                <div className="menu-script">Our menu</div>
                <div className="menu-title">A multi-course tasting</div>
                <p className="menu-sub">served at table, paired with wine</p>
                <div className="menu-rule" />

                <ul className="menu-list">
                  {MENU.map((m) => (
                    <li key={m.num} className="course">
                      <span className="num">{m.num}</span>
                      <div>
                        <div className="course-name">{m.course}</div>
                        <div className="dish">{m.dish}</div>
                        <div className="dish-desc">{m.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="menu-footnote">
                  A vegetarian alternative is available on request — please share any allergies
                  above so we can take care of you.
                </p>
              </div>
            </>
          ) : (
            <>
              <h3>We'll miss you dearly</h3>
              <p className="step-sub">
                If you'd like to leave a message, we'd love to read it.
              </p>
              <div className="field">
                <label htmlFor="declineMsg">A note for the couple</label>
                <textarea
                  id="declineMsg"
                  placeholder="A wish, a memory, anything at all..."
                  value={data.declineMsg}
                  onChange={(e) => update("declineMsg", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="step-actions">
            <button type="button" className="btn ghost" onClick={onClickBack}>
              Back
            </button>
            <button type="button" className="btn" onClick={onClickNext} disabled={submitting}>
              {data.attend === "no" ? (submitting ? "Sending…" : "Send my RSVP") : "Continue"}
            </button>
          </div>
          {error && step === 3 && data.attend === "no" && <p className="error-text">{error}</p>}
        </div>

        {/* STEP 4 — Message + gifts (accept only) */}
        <div {...stepProps(4)}>
          <h3>One last thing</h3>
          <p className="step-sub">Send Jonathan &amp; Nerizza a little love.</p>
          <div className="field">
            <label htmlFor="msg">Message to the couple</label>
            <textarea
              id="msg"
              placeholder="A blessing, an inside joke, a sweet wish..."
              value={data.msg}
              onChange={(e) => update("msg", e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="song">Song to dance to</label>
            <input
              id="song"
              type="text"
              placeholder="What will get you on the dance floor?"
              value={data.song}
              onChange={(e) => update("song", e.target.value)}
            />
          </div>

          <GiftsBlock />

          <div className="step-actions">
            <button type="button" className="btn ghost" onClick={onClickBack}>
              Back
            </button>
            <button type="submit" className="btn gold" disabled={submitting}>
              {submitting ? "Sending…" : "Send my RSVP"}
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </div>

        {/* STEP 5 — Confirmation */}
        <div className={`step confirmation${step === 5 ? " active" : ""}`} data-step={5}>
          <div className="confetti" ref={confettiRef} />
          <div className="check-wrap">
            <div className="check-ring" />
            <div className="check-circle">
              <svg
                viewBox="0 0 50 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 26 L22 34 L38 16" />
              </svg>
            </div>
          </div>

          {data.attend === "yes" ? (
            <>
              <div className="confirm-script">we can&rsquo;t wait</div>
              <h3 className="confirm-title">See you soon, {firstName}.</h3>
              <p className="confirm-msg">
                Your RSVP has been received with the biggest smiles. We've saved your seat for{" "}
                <strong>February 25, 2027</strong>. We'll see you at Jardin de Milagros, Tagaytay.
              </p>
              <div className="confirm-summary">
                <div className="row">
                  <span className="k">Name</span>
                  <span className="v">{data.fname}</span>
                </div>
                <div className="row">
                  <span className="k">Attending</span>
                  <span className="v">Joyfully accepting</span>
                </div>
                <div className="row">
                  <span className="k">Ceremony</span>
                  <span className="v">4:00 PM · Pavilion</span>
                </div>
                <div className="row">
                  <span className="k">Reception</span>
                  <span className="v">6:00 PM · Garden</span>
                </div>
                {data.diet && (
                  <div className="row">
                    <span className="k">Notes</span>
                    <span className="v">{data.diet}</span>
                  </div>
                )}
                {data.song && (
                  <div className="row">
                    <span className="k">Song request</span>
                    <span className="v">{data.song}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="confirm-script">with love</div>
              <h3 className="confirm-title">We'll miss you, {firstName}.</h3>
              <p className="confirm-msg">
                Thank you for letting us know. Your message will be tucked away in our memory of
                this day.
              </p>
              {data.declineMsg && (
                <div className="confirm-summary">
                  <div className="row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                    <span className="k">Your note</span>
                    <span className="v" style={{ fontStyle: "italic", fontWeight: 400 }}>
                      “{data.declineMsg}”
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <p
            style={{
              fontFamily: "var(--script)",
              color: "var(--gold-600)",
              fontSize: 42,
              lineHeight: 1,
              marginTop: 14,
            }}
          >
            — J &amp; N
          </p>
          <button
            type="button"
            className="btn ghost"
            style={{ marginTop: 18 }}
            onClick={() => {
              try {
                localStorage.removeItem("jn-rsvp");
              } catch {
                /* ignore */
              }
              go(1);
            }}
          >
            Edit my response
          </button>
        </div>
      </form>
    </section>
  );
}

function Stepper({ current }: { current: number }) {
  const dots = [1, 2, 3, 4];
  return (
    <div className="stepper">
      {dots.map((n, i) => (
        <Fragment key={n}>
          <span
            className={[
              "dot",
              current === n ? "active" : "",
              current > n ? "done" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {n}
          </span>
          {i < dots.length - 1 && <span className={`bar${current > n ? " filled" : ""}`} />}
        </Fragment>
      ))}
    </div>
  );
}

function GiftsBlock() {
  const [bankCopied, setBankCopied] = useState(false);
  const [gcashCopied, setGcashCopied] = useState(false);

  async function copy(value: string, which: "bank" | "gcash") {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    if (which === "bank") {
      setBankCopied(true);
      setTimeout(() => setBankCopied(false), 1800);
    } else {
      setGcashCopied(true);
      setTimeout(() => setGcashCopied(false), 1800);
    }
  }

  return (
    <div className="gifts-block">
      <div className="gifts-eyebrow">On the matter of gifts</div>
      <div className="gifts-script">Your presence is our gift</div>
      <p className="gifts-text">
        Truly — you being there is more than enough. But if you'd like to bless our new beginning
        with a little something, a contribution to our home would mean the world.{" "}
        <i>Cash gifts are most appreciated.</i>
      </p>

      <div className="gifts-grid">
        <div className="gifts-card">
          <div className="gifts-label">Bank Transfer</div>
          <div className="gifts-bank">BPI</div>
          <div className="gifts-name">Nerizza Gonzales</div>
          <div className="gifts-detail">1234 5678 9012</div>
          <button
            type="button"
            className={`copy-btn${bankCopied ? " copied" : ""}`}
            onClick={() => copy("1234 5678 9012", "bank")}
          >
            {bankCopied ? "Copied ✓" : "Copy number"}
          </button>
        </div>

        <div className="gifts-card">
          <div className="gifts-label">GCash · Scan to send</div>
          <Qr />
          <div className="gifts-name">Nerizza G.</div>
          <div className="gifts-detail">+63 917 123 4567</div>
          <button
            type="button"
            className={`copy-btn${gcashCopied ? " copied" : ""}`}
            onClick={() => copy("+63 917 123 4567", "gcash")}
          >
            {gcashCopied ? "Copied ✓" : "Copy number"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Qr() {
  // Deterministic pseudo-QR pattern (placeholder — replace with a real QR image when ready)
  const rects: Array<{ x: number; y: number }> = useMemo(() => {
    let seed = 73841;
    const rng = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    const out: Array<{ x: number; y: number }> = [];
    for (let y = 0; y < 25; y++) {
      for (let x = 0; x < 25; x++) {
        if ((x < 7 && y < 7) || (x > 17 && y < 7) || (x < 7 && y > 17)) continue;
        if (x > 10 && x < 14 && y > 10 && y < 14) continue;
        if (rng() > 0.55) out.push({ x: x * 4, y: y * 4 });
      }
    }
    return out;
  }, []);

  return (
    <div className="qr">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="#fefdf9" />
        <g>
          {rects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={4} height={4} fill="#062f24" />
          ))}
        </g>
        {/* Finder patterns */}
        <rect x="6" y="6" width="20" height="20" fill="#062f24" />
        <rect x="10" y="10" width="12" height="12" fill="#fefdf9" />
        <rect x="13" y="13" width="6" height="6" fill="#062f24" />
        <rect x="74" y="6" width="20" height="20" fill="#062f24" />
        <rect x="78" y="10" width="12" height="12" fill="#fefdf9" />
        <rect x="81" y="13" width="6" height="6" fill="#062f24" />
        <rect x="6" y="74" width="20" height="20" fill="#062f24" />
        <rect x="10" y="78" width="12" height="12" fill="#fefdf9" />
        <rect x="13" y="81" width="6" height="6" fill="#062f24" />
      </svg>
      <div className="qr-overlay">&amp;</div>
    </div>
  );
}
