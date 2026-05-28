"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2027-02-25T15:00:00+08:00").getTime();

function pad(n: number, l = 2) {
  return String(Math.max(0, n)).padStart(l, "0");
}

function compute(now: number) {
  const d = Math.max(0, TARGET - now);
  return {
    days: pad(Math.floor(d / 86400000), 3),
    hrs: pad(Math.floor((d % 86400000) / 3600000)),
    min: pad(Math.floor((d % 3600000) / 60000)),
    sec: pad(Math.floor((d % 60000) / 1000)),
  };
}

const INITIAL = { days: "000", hrs: "00", min: "00", sec: "00" };

export function Countdown() {
  const [t, setT] = useState(INITIAL);

  useEffect(() => {
    setT(compute(Date.now()));
    const id = setInterval(() => setT(compute(Date.now())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="countdown-section" id="countdown">
      <div className="container center">
        <div className="eyebrow reveal">Counting the days</div>
        <h2 className="section-title reveal d1">
          Until <em>forever</em>
        </h2>
        <p className="lead reveal d2">
          Every passing moment brings us closer to the day we say <i>“I do.”</i> We can't wait to
          share it with you.
        </p>

        <div className="countdown reveal d3">
          <div className="cd-box">
            <span className="cd-num">{t.days}</span>
            <div className="cd-label">Days</div>
          </div>
          <div className="cd-box">
            <span className="cd-num">{t.hrs}</span>
            <div className="cd-label">Hours</div>
          </div>
          <div className="cd-box">
            <span className="cd-num">{t.min}</span>
            <div className="cd-label">Minutes</div>
          </div>
          <div className="cd-box">
            <span className="cd-num">{t.sec}</span>
            <div className="cd-label">Seconds</div>
          </div>
        </div>

        <div className="save-the-date reveal d4">Save the date</div>
        <div className="ceremony-date reveal d4">THURSDAY · FEBRUARY 25</div>
      </div>
    </section>
  );
}
