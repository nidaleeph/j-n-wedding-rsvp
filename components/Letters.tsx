export function Letters() {
  return (
    <section className="letters" id="letters">
      <div className="container center">
        <div className="eyebrow reveal">A note from us</div>
        <h2 className="section-title reveal d1">
          Words from the <em>bride &amp; groom</em>
        </h2>
        <p className="lead reveal d2">
          Two little letters, written for the people we love most — you.
        </p>
      </div>

      <div className="container letter-grid">
        <div className="love-note reveal d2">
          <div className="from">From the groom</div>
          <div className="salut">Dear friend,</div>
          <div className="body">
            I never knew what the word <i>home</i> meant until I met her. Every day since has been a
            quiet kind of miracle, and I cannot wait to make it official with all of you watching.
            Thank you for being part of our story — for the late-night calls, the bad advice, the
            good champagne. We love you.
          </div>
          <div className="sig">Jonathan</div>
        </div>

        <div className="love-note reveal d3">
          <div className="from">From the bride</div>
          <div className="salut">My loves,</div>
          <div className="body">
            He is my safest place and my favorite adventure all at once. To say <i>yes</i> to him is
            the easiest thing I've ever done. The hard part is choosing only one song to dance to.
            Come dance, come cry, come eat too much cake with us. We'd be incomplete without you.
          </div>
          <div className="sig">Nerizza</div>
        </div>
      </div>
    </section>
  );
}
