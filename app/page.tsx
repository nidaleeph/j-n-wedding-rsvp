import { Atmosphere } from "@/components/Atmosphere";
import { Countdown } from "@/components/Countdown";
import { Details } from "@/components/Details";
import { EnvelopeIntro } from "@/components/EnvelopeIntro";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Letters } from "@/components/Letters";
import { Marquee } from "@/components/Marquee";
import { MusicToggle } from "@/components/MusicToggle";
import { Nav } from "@/components/Nav";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { Rsvp } from "@/components/Rsvp";
import { Story } from "@/components/Story";

export default function Page() {
  return (
    <>
      <EnvelopeIntro />
      <Atmosphere />
      <Nav />

      <Hero />

      <Marquee
        items={[
          { text: "Jonathan & Nerizza" },
          { text: "forever & ever", script: true },
          { text: "February 25, 2027" },
          { text: "Tagaytay" },
        ]}
      />

      <Countdown />

      <Story />

      <Marquee
        variant="dark"
        items={[
          { text: "with all our hearts", script: true },
          { text: "YOU ARE INVITED" },
          { text: "two become one", script: true },
          { text: "TAGAYTAY MMXXVII" },
        ]}
      />

      <Letters />
      <Gallery />
      <Details />
      <Rsvp />
      <Footer />

      <MusicToggle />
      <RevealOnScroll />
    </>
  );
}
