type MarqueeProps = {
  variant?: "light" | "dark";
  items: Array<{ text: string; script?: boolean }>;
};

function Track({ items }: { items: MarqueeProps["items"] }) {
  return (
    <span>
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 60 }}>
          {item.script ? <i className="scr">{item.text}</i> : <span>{item.text}</span>}
          <span className="dot" />
        </span>
      ))}
    </span>
  );
}

export function Marquee({ variant = "light", items }: MarqueeProps) {
  return (
    <div className={variant === "dark" ? "marquee dark" : "marquee"} aria-hidden>
      <div className="marquee-track">
        <Track items={items} />
        <Track items={items} />
      </div>
    </div>
  );
}
