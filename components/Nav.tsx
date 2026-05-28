"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#countdown", label: "The Date" },
  { href: "#story", label: "Our Story" },
  { href: "#letters", label: "Letters" },
  { href: "#gallery", label: "Moments" },
  { href: "#details", label: "The Wedding" },
  { href: "#rsvp", label: "RSVP" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // Use a portal-free approach: drawer rendered after nav.
  // SectionLink closes the drawer when clicked.
  function close() {
    setMenuOpen(false);
  }

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`} id="nav">
        <div className="mono">J &amp; N</div>
        <div className="nav-right">
          <a href="#rsvp" className="nav-cta">
            RSVP
          </a>
          <button
            className="menu-btn"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <span className="bar" />
          </button>
        </div>
      </nav>

      <div className="nav-drawer" id="navDrawer">
        <div className="monogram">J &amp; N</div>
        {links.map((l) => (
          <a key={l.href} href={l.href} data-close onClick={close}>
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
