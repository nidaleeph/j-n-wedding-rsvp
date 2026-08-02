import type { ReactNode } from "react";

/** Where the deck's photos live under `public/`. */
export const UPLOADS = "/pamamanhikan/uploads/";

/** Every photo the deck references, in slide order. */
export const DECK_PHOTOS = [
  "492567682_1259226789537098_9052167054890522977_n.jpg", // 01 welcome background
  "492198776_1245292330930544_4978978755993565844_n.jpg", // 04 collage
  "488908919_1230110359115408_6850493547472933478_n.jpg", // 04 collage
  "IMG_3114.jpeg", // 09 thanksgiving background
  "IMG_0434.jpeg", // 11 work & partnership background
  "IMG_0601.jpeg", // 15 collage
  "IMG_0762.jpeg", // 15 collage
  "IMG_0989.jpeg", // 15 collage
  "IMG_1515.jpeg", // 15 collage
  "IMG_2607.jpeg", // 15 collage
  "IMG_3152.jpeg", // 15 collage
] as const;

export type SlideSurface = "light" | "plain" | "deep" | "photo";

export type SlideDef = {
  /** Surface treatment — also decides whether the chrome flips to its dark variant. */
  surface: SlideSurface;
  /** Background photo filename, for `photo` slides. */
  bg?: string;
  /** Widen the content column from 1240px to 1500px. */
  wide?: boolean;
  /** Append the "End Presentation" control, which returns the deck to the gate. */
  endButton?: boolean;
  /** Inner content of `.wrap`. */
  render: (ctx: SlideContext) => ReactNode;
};

export type SlideContext = {
  /** True once the photo has actually been placed in `public/pamamanhikan/uploads/`. */
  have: (file: string) => boolean;
};

/** Photo slides and deep slides both get the inverted chrome. */
export const isDarkSurface = (s: SlideSurface) => s === "photo" || s === "deep";

/**
 * A collage tile. Falls back to an emerald-and-gold monogram plate when the
 * photo has not been dropped into `public/pamamanhikan/uploads/` yet, so the
 * deck still presents cleanly with photos missing. In development the expected
 * filename is printed on the plate; in production it is not.
 */
function Frame({ file, alt, have }: { file: string; alt: string; have: SlideContext["have"] }) {
  if (!have(file)) {
    return (
      <figure className="pending" title={`Add ${file} to public${UPLOADS}`}>
        <span className="mono">J &amp; N</span>
        {process.env.NODE_ENV !== "production" && <span className="fn">{file}</span>}
      </figure>
    );
  }
  return (
    <figure>
      {/* Plain <img>: the deck also paints photos as CSS backgrounds, and these
          are fixed local assets sized by the grid — next/image adds no value. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${UPLOADS}${file}`} alt={alt} loading="lazy" />
    </figure>
  );
}

const COUPLE = "Jonathan and Nerizza";

export const SLIDES: SlideDef[] = [
  /* 1 · WELCOME */
  {
    surface: "photo",
    bg: "492567682_1259226789537098_9052167054890522977_n.jpg",
    render: () => (
      <>
        <div className="eyebrow">Pamamanhikan Presentation</div>
        <div className="s-sub">Jonathan &amp; Nerizza</div>
        <div className="rule" style={{ marginTop: 26 }} />
        {/* sized via CSS, not an inline style, so the breakpoints can reach it */}
        <h1 className="s-title datestamp">FEBRUARY 25, 2027</h1>
        <p className="s-lead" style={{ marginTop: 10, fontStyle: "italic" }}>
          Jardin De Milagros · Tagaytay
        </p>
        <p className="verse">
          “Love is patient, love is kind. It always protects, always trusts, always hopes, always
          perseveres.”
          <cite>1 Corinthians 13 : 4, 7</cite>
        </p>
      </>
    ),
  },

  /* 2 · PURPOSE */
  {
    surface: "light",
    render: () => (
      <>
        <svg
          className="sym"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M24 6v36M12 17h24" />
          <circle cx="24" cy="24" r="20" strokeDasharray="2 5" />
        </svg>
        <div className="eyebrow" style={{ marginTop: 18 }}>
          Why we are here
        </div>
        <h2 className="s-title">
          Purpose of the <span className="accent">Gathering</span>
        </h2>
        <ul className="points">
          <li>To humbly ask for the blessing of both our families</li>
          <li>To share our intention of building a Christ-centered marriage</li>
          <li>To begin this journey with unity, respect, and prayer</li>
          <li>To celebrate the joining of two families as one</li>
        </ul>
      </>
    ),
  },

  /* 3 · DATE & VENUE */
  {
    surface: "plain",
    render: () => (
      <>
        <div className="eyebrow">The wedding</div>
        <h2 className="s-title">
          Date &amp; <span className="accent">Venue</span>
        </h2>
        <div className="datecard">
          <span className="corner tl" />
          <span className="corner br" />
          <div className="dc-day">February 25</div>
          <div className="dc-yr">Thursday · MMXXVII</div>
          <div className="rule" style={{ margin: "20px auto" }} />
          <div className="dc-venue">JARDIN DE MILAGROS</div>
          <div className="dc-loc">Tagaytay</div>
        </div>
        <div className="cards two" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          <div className="card">
            <div className="k">Ceremony</div>
            <h3>Christian Wedding</h3>
            <ul>
              <li>Facilitated by Metronorth Jesus Ministries</li>
              <li>Church coordinators to guide the program</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Officiating</div>
            <h3>Pastor Rex Del Rosario</h3>
            <ul>
              <li>Will officiate the wedding ceremony</li>
              <li>Prayer and Word at the center of the day</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },

  /* 4 · VENUE OPTIONS */
  {
    surface: "light",
    wide: true,
    render: ({ have }) => (
      <>
        <div className="eyebrow">Still being finalized</div>
        <h2 className="s-title">
          Proposed Venue <span className="accent">Setup</span>
        </h2>
        <div className="cards two" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <div className="card featured">
            <div className="k">Option A · Preferred</div>
            <h3>Garden Ceremony</h3>
            <ul>
              <li>Wedding ceremony at the open garden</li>
              <li>Reception inside the event hall</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Option B</div>
            <h3>Indoor Ceremony</h3>
            <ul>
              <li>Wedding ceremony inside the event hall</li>
              <li>Reception at the outdoor garden area</li>
            </ul>
          </div>
        </div>
        <p className="note" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <b>Outdoor reception</b> is currently our preferred direction — the final setup is still
          being finalized with the venue.
        </p>
        <div className="collage trio">
          <Frame
            file="492198776_1245292330930544_4978978755993565844_n.jpg"
            alt="Jardin De Milagros garden grounds"
            have={have}
          />
          <Frame
            file="488908919_1230110359115408_6850493547472933478_n.jpg"
            alt="Venue pavilion exterior"
            have={have}
          />
          <Frame
            file="492567682_1259226789537098_9052167054890522977_n.jpg"
            alt="Event hall interior"
            have={have}
          />
        </div>
      </>
    ),
  },

  /* 5 · BUDGET */
  {
    surface: "deep",
    wide: true,
    render: () => (
      <>
        <div className="eyebrow">Planning together</div>
        <h2 className="s-title">
          Wedding <span className="accent">Budget</span>
        </h2>
        <div className="bigfig">
          ₱600,000 – ₱700,000<small>Estimated total range</small>
        </div>
        <div className="cards four" style={{ marginTop: 38 }}>
          <div className="card">
            <div className="k">Couple</div>
            <h3>Major Expenses</h3>
            <ul>
              <li>Venue, catering, coordination</li>
              <li>Photo &amp; video, styling</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Bride&rsquo;s Parents</div>
            <h3>Attire</h3>
            <ul>
              <li>Bride&rsquo;s gown and attire</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Groom&rsquo;s Parents</div>
            <h3>Attire</h3>
            <ul>
              <li>Groom&rsquo;s suit and attire</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Entourage</div>
            <h3>Individual Rental</h3>
            <ul>
              <li>Attire rental per member</li>
              <li>Service to be coordinated</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },

  /* 6 · GUESTS */
  {
    surface: "plain",
    wide: true,
    render: () => (
      <>
        <div className="eyebrow">Intimate by design</div>
        <h2 className="s-title">
          Guest List &amp; <span className="accent">Celebration</span>
        </h2>
        <div className="counts">
          <div className="count total">
            <div className="n">100–110</div>
            <div className="l">Total guests</div>
          </div>
          <div className="count">
            <div className="n">40–50</div>
            <div className="l">Bride&rsquo;s side</div>
          </div>
          <div className="count">
            <div className="n">55–65</div>
            <div className="l">Groom&rsquo;s side</div>
          </div>
        </div>
        <div className="cards two" style={{ maxWidth: 880, margin: "26px auto 0" }}>
          <div className="card">
            <div className="k">Who we are inviting</div>
            <h3>Closest to Us</h3>
            <ul>
              <li>Immediate family from both sides</li>
              <li>The grandmother of the bride</li>
              <li>Important relatives and mentors</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">The atmosphere</div>
            <h3>Natural &amp; Candid</h3>
            <ul>
              <li>Relaxed, joyful, and elegant</li>
              <li>Minimal formal traditions</li>
              <li>Authentic moments over performances</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },

  /* 7 · CEREMONY & SPONSORS */
  {
    surface: "light",
    render: () => (
      <>
        <svg
          className="sym"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M24 8l2.6 8.4H35l-6.8 5 2.6 8.4L24 24.6l-6.8 5.2 2.6-8.4-6.8-5h8.4z" />
          <path d="M8 40h32" />
        </svg>
        <div className="eyebrow" style={{ marginTop: 18 }}>
          The program
        </div>
        <h2 className="s-title">
          Ceremony &amp; <span className="accent">Sponsors</span>
        </h2>
        <ul className="points">
          <li>Church coordinators will handle the ceremony flow</li>
          <li>Pastor Rex Del Rosario will officiate the wedding</li>
          <li>Parents, entourage, and sponsors will take part in the program</li>
          <li>We welcome our families&rsquo; guidance and experience in shaping the ceremony</li>
        </ul>
        <p className="foot-quote">“The more sponsors, the more prayers and blessings.”</p>
      </>
    ),
  },

  /* 8 · FAMILY STAY */
  {
    surface: "plain",
    wide: true,
    render: () => (
      <>
        <div className="eyebrow">Staying close by</div>
        <h2 className="s-title">
          Family Stay <span className="accent">Arrangement</span>
        </h2>
        <div className="stay" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <div className="cell">
            <div className="k">Check-in</div>
            <div className="v">Feb 24, 2027</div>
          </div>
          <div className="cell">
            <div className="k">Check-out</div>
            <div className="v">Feb 26 · 11 AM</div>
          </div>
          <div className="cell">
            <div className="k">Duration</div>
            <div className="v">2 Nights</div>
          </div>
          <div className="cell">
            <div className="k">Capacity</div>
            <div className="v">30–35 Guests</div>
          </div>
        </div>
        <div className="cards two" style={{ maxWidth: 880, margin: "24px auto 0" }}>
          <div className="card">
            <div className="k">Who stays with us</div>
            <h3>Under One Roof</h3>
            <ul>
              <li>Bride&rsquo;s family</li>
              <li>Groom&rsquo;s family</li>
              <li>Selected friends</li>
              <li>Church coordinators</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Why</div>
            <h3>Rest &amp; Togetherness</h3>
            <ul>
              <li>Stay within reach of the venue</li>
              <li>Less travel stress on the day</li>
              <li>Meaningful family time before and after</li>
            </ul>
          </div>
        </div>
      </>
    ),
  },

  /* 9 · THANKSGIVING */
  {
    surface: "photo",
    bg: "IMG_3114.jpeg",
    render: () => (
      <>
        <div className="eyebrow">Before the wedding</div>
        <h2 className="s-title">
          Thanksgiving &amp; <span className="accent">Outreach</span>
        </h2>
        <ul className="points" style={{ maxWidth: 640 }}>
          <li>A thanksgiving gathering ahead of the wedding day</li>
          <li>A visit to a nearby orphanage</li>
          <li>Sharing joy and blessings with the children</li>
          <li>Beginning the celebration with gratitude and service</li>
        </ul>
      </>
    ),
  },

  /* 10 · HOME */
  {
    surface: "light",
    wide: true,
    render: () => (
      <>
        <div className="eyebrow">The next chapter</div>
        <h2 className="s-title">
          Our Home &amp; <span className="accent">Future</span>
        </h2>
        <div className="cards two" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          <div className="card">
            <div className="k">Under construction</div>
            <h3>House in Tanza</h3>
            <ul>
              <li>Renovation begins September</li>
              <li>Simple, family-oriented design</li>
              <li>Designed by Architect Rachel</li>
              <li>Supported by engineering professionals</li>
            </ul>
          </div>
          <div className="card">
            <div className="k">Where we will live</div>
            <h3>Home &amp; Church</h3>
            <ul>
              <li>Temporary residence in Tanza after the wedding</li>
              <li>Weekend service in QC stays part of our routine</li>
              <li>Prayerful goal to build closer to QC in time</li>
            </ul>
          </div>
        </div>
        <p className="note" style={{ maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
          Building slowly and prayerfully — <b>a home, not just a house.</b>
        </p>
      </>
    ),
  },

  /* 11 · WORK & PARTNERSHIP */
  {
    surface: "photo",
    bg: "IMG_0434.jpeg",
    render: () => (
      <>
        <div className="eyebrow">Side by side</div>
        <h2 className="s-title">
          Work, Partnership &amp; <span className="accent">Daily Life</span>
        </h2>
        <ul className="points" style={{ maxWidth: 640 }}>
          <li>Both of us will continue working after marriage</li>
          <li>Shared decision-making for our family</li>
          <li>A healthy balance between work and home</li>
          <li>Prioritising time together and our future family</li>
          <li>Financial stewardship as one team</li>
        </ul>
      </>
    ),
  },

  /* 12 · CHRIST-CENTERED */
  {
    surface: "deep",
    render: () => (
      <>
        <svg
          className="sym"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M24 5v38M13 16h22" />
        </svg>
        <div className="eyebrow" style={{ marginTop: 20 }}>
          Our prayer
        </div>
        <p className="quote">
          A home where <em>Christ</em> is the centre — where we serve the Lord together, choose peace
          and patience, resolve conflict with grace, and continue to honour and support our parents.
        </p>
        <div className="rule" style={{ marginTop: 34 }} />
        <p className="verse" style={{ marginTop: 24 }}>
          “Unless the Lord builds the house, the builders labour in vain.”
          <cite>Psalm 127 : 1</cite>
        </p>
      </>
    ),
  },

  /* 13 · FUTURE FAMILY */
  {
    surface: "plain",
    render: () => (
      <>
        <svg
          className="sym"
          style={{ width: 78, height: 78 }}
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="22" cy="20" r="6" />
          <circle cx="42" cy="20" r="6" />
          <circle cx="32" cy="34" r="4.4" />
          <path d="M12 46c0-6.6 4.5-11 10-11s10 4.4 10 11" />
          <path d="M32 46c0-6.6 4.5-11 10-11s10 4.4 10 11" />
          <path d="M25 54c0-4.2 3.2-7 7-7s7 2.8 7 7" />
        </svg>
        <div className="eyebrow" style={{ marginTop: 24 }}>
          In God&rsquo;s time
        </div>
        <p className="quote" style={{ maxWidth: 720 }}>
          Entrusting our future family to <em>God&rsquo;s</em> perfect timing.
        </p>
      </>
    ),
  },

  /* 14 · TIMELINE */
  {
    surface: "light",
    wide: true,
    render: () => (
      <>
        <div className="eyebrow">How the day will flow</div>
        <h2 className="s-title">
          Wedding Day <span className="accent">Timeline</span>
        </h2>
        <div className="timeline" style={{ maxWidth: 860, marginLeft: "auto", marginRight: "auto" }}>
          <div className="tl-item">
            <div className="tl-time">4 : 00 PM</div>
            <div className="tl-what">Ceremony</div>
          </div>
          <div className="tl-item">
            <div className="tl-time">6 : 00 PM</div>
            <div className="tl-what">Reception</div>
          </div>
          <div className="tl-item">
            <div className="tl-time">9 : 00 PM</div>
            <div className="tl-what">Closing</div>
          </div>
        </div>
        <p className="note" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          Simple, elegant, and relaxed — <b>no concert-style program.</b> One special dance for the
          bride and groom, joined by the entourage.
        </p>
      </>
    ),
  },

  /* 15 · THANK YOU */
  {
    surface: "light",
    wide: true,
    endButton: true,
    render: ({ have }) => (
      <>
        <div className="eyebrow">From both of us</div>
        <h2 className="s-title">
          Thank <span className="accent">You</span>
        </h2>
        <p className="s-lead">
          Thank you for your love, guidance, prayers, and support. We look forward to beginning this
          new chapter together — as one family.
        </p>
        <div className="collage grid6">
          <Frame file="IMG_0601.jpeg" alt={COUPLE} have={have} />
          <Frame file="IMG_0762.jpeg" alt={COUPLE} have={have} />
          <Frame file="IMG_0989.jpeg" alt={COUPLE} have={have} />
          <Frame file="IMG_1515.jpeg" alt={COUPLE} have={have} />
          <Frame file="IMG_2607.jpeg" alt={COUPLE} have={have} />
          <Frame file="IMG_3152.jpeg" alt={COUPLE} have={have} />
        </div>
        <p
          className="verse"
          style={{ color: "color-mix(in oklab,var(--emerald-800),transparent 38%)" }}
        >
          “May the Lord bless our two families and keep us in His grace.”
          <cite style={{ color: "var(--gold-700)" }}>A closing prayer</cite>
        </p>
      </>
    ),
  },
];
