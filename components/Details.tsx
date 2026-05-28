export function Details() {
  const mapUrl = "https://maps.google.com/?q=Jardin+de+Miracles+Tagaytay";

  return (
    <section className="details" id="details">
      <div className="container center">
        <div className="eyebrow reveal">The wedding</div>
        <h2 className="section-title reveal d1">
          Where it <em>all happens</em>
        </h2>
        <p className="lead reveal d2">
          Two ceremonies. One celebration. We've planned every detail to feel as warm and timeless
          as the love that built this day.
        </p>

        <div className="detail-cards">
          <div className="d-card reveal d2">
            <div className="ch">Ceremony · I</div>
            <svg
              className="icon"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path
                d="M24 5 L26 18 L38 16 L28 24 L36 34 L24 28 L12 34 L20 24 L10 16 L22 18 Z"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="24" r="20" strokeDasharray="2 4" />
            </svg>
            <h3>The Ceremony</h3>
            <div className="sub">at the pavilion</div>
            <div className="time">4 : 00 PM</div>
            <div className="divider" />
            <div className="venue">Jardin de Milagros</div>
            <div className="addr">Pavilion · Tagaytay, Cavite</div>
            <a className="map" href={mapUrl} target="_blank" rel="noopener noreferrer">
              View on map →
            </a>
          </div>

          <div className="d-card reveal d3">
            <div className="ch">Reception · II</div>
            <svg
              className="icon"
              viewBox="0 0 48 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path d="M14 8 V20 Q14 30, 24 30 Q34 30, 34 20 V8 Z" />
              <path d="M24 30 V40 M16 40 H32" />
              <path d="M14 8 H34" />
              <circle cx="20" cy="14" r="1.5" fill="currentColor" />
              <circle cx="28" cy="14" r="1.5" fill="currentColor" />
            </svg>
            <h3>The Reception</h3>
            <div className="sub">an evening in the garden</div>
            <div className="time">6 : 00 PM</div>
            <div className="divider" />
            <div className="venue">Jardin de Milagros</div>
            <div className="addr">Garden · Tagaytay, Cavite</div>
            <a className="map" href={mapUrl} target="_blank" rel="noopener noreferrer">
              View on map →
            </a>
          </div>
        </div>

        <div className="dress-code reveal d2">
          <h4>Dress Code · Formal Attire</h4>
          <div className="formal">Black Tie Optional</div>
          <div className="palette">
            <span className="swatch" data-name="Emerald" style={{ background: "#0f5440" }} />
            <span className="swatch" data-name="Gold" style={{ background: "#c9a961" }} />
            <span className="swatch" data-name="Champagne" style={{ background: "#f3e6cd" }} />
            <span className="swatch" data-name="Cream" style={{ background: "#f5ead0" }} />
          </div>
          <p className="note">
            We kindly ask our guests to wear shades that complement the palette above. Please, no
            white.
          </p>
        </div>
      </div>
    </section>
  );
}
