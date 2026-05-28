type Chapter = {
  number: string;
  date: string;
  title: string;
  body: string;
  pull: string;
  image: string;
  flip?: boolean;
};

const chapters: Chapter[] = [
  {
    number: "Chapter One",
    date: "First glance",
    title: "A rainy Tuesday in Manila",
    body: "Jonathan was running late. Nerizza was sheltering under the same café awning, willing the storm to pass. He offered to share his umbrella, she said yes — and never let it go.",
    pull: "“It rained for three days. We didn't mind.”",
    image:
      "https://images.unsplash.com/photo-1525772764200-be829a350797?auto=format&fit=crop&w=900&q=80",
  },
  {
    number: "Chapter Two",
    date: "First date",
    title: "Coffee that lasted seven hours",
    body: "A small café in Poblacion. Three espressos. The barista politely turned off the lights at closing. We talked all the way home — and most of the night that followed.",
    pull: "“Some conversations are the start of a whole life.”",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    flip: true,
  },
  {
    number: "Chapter Three",
    date: "The proposal",
    title: "On a quiet hill in Tagaytay",
    body: "Sunset behind the volcano. A ring in his pocket. A question on his lips. Her answer made the next chapter possible — this one, this very day, this invitation.",
    pull: "“Yes. A thousand times, yes.”",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
  },
];

export function Story() {
  return (
    <section className="story" id="story">
      <div className="story-head">
        <div className="eyebrow reveal">A love story</div>
        <h2 className="section-title reveal d1">
          How <em>we met</em>
        </h2>
        <p className="lead reveal d2">
          Six years, two cities, countless cups of coffee, and a forever in the making.
        </p>
      </div>

      <div className="story-frame">
        <div className="story-rows">
          {chapters.map((ch, i) => (
            <div key={i} className={ch.flip ? "story-row flip" : "story-row"}>
              <div className="story-img reveal">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img loading="lazy" src={ch.image} alt="" />
              </div>
              <div className="story-caption reveal d2">
                <div className="ch-num">{ch.number}</div>
                <div className="ch-line" />
                <div className="ch-date">{ch.date}</div>
                <h3>{ch.title}</h3>
                <p>{ch.body}</p>
                <div className="pull">{ch.pull}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
