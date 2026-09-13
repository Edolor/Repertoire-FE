import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito } from "next/font/google";
import styles from "./day-out.module.css";
import { Reveal } from "./Reveal";
import { Rsvp } from "./Rsvp";
import {
  MatchaArt,
  LighthouseArt,
  BowlingArt,
  CarArt,
  CoupleArt,
  Sprig,
  Sprinkle,
} from "./illustrations";

/*
 * Both faces are fetched at BUILD time by next/font and served from this
 * origin, which is the only way to use Google Fonts under the site's
 * `font-src 'self'` CSP. A runtime <link> to fonts.googleapis.com would be
 * blocked. Scoped to this route via CSS variables on the wrapper.
 */
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-day-serif",
  display: "swap",
});

const sans = Nunito({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-day-sans",
  display: "swap",
});

// A private page shared by link. Kept out of search and out of the sitemap.
export const metadata: Metadata = {
  title: { absolute: "A date with Ifeoma" },
  description: "I planned us a day.",
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: "/day-out" },
  openGraph: {
    title: { absolute: "A date with Ifeoma" },
    description: "I planned us a day.",
    type: "website",
    url: "/day-out",
    siteName: "An invitation",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: { absolute: "A date with Ifeoma" },
    description: "I planned us a day.",
  },
};

const STOPS = [
  {
    number: "One",
    title: <>Matcha &amp; Something Sweet</>,
    place: "Momochee’s Desserts",
    blurb:
      "We start soft. Proper Kyoto matcha, whisked by hand, and something sweet to go with it.",
    Art: MatchaArt,
  },
  {
    number: "Two",
    title: <>A Walk by the Water</>,
    place: "The Port Credit Waterfront",
    blurb: "Out along the marina to the lighthouse. Boats, breeze, no rush.",
    Art: LighthouseArt,
  },
  {
    number: "Three",
    title: <>A Little Friendly Competition</>,
    place: "GameTime",
    blurb: "Bowling and arcade games. Fair warning: I intend to win.",
    Art: BowlingArt,
  },
  {
    number: "Four",
    title: <>Then North</>,
    place: null,
    blurb: "I get you to Vaughan in good time, as promised.",
    Art: CarArt,
  },
];

export default function DayOutPage() {
  return (
    <main className={`${styles.root} ${serif.variable} ${sans.variable}`}>
      <div className={styles.column}>
        <Reveal className={styles.opening}>
          <CoupleArt className={styles.couple} />
          <p className={styles.eyebrow}>An invitation</p>
          <h1 className={styles.title}>
            A date with <em>Ifeoma.</em>
          </h1>
          <p className={styles.lede}>I planned us a day.</p>
          <p className={styles.note}>Excited to see you.</p>
        </Reveal>

        <Reveal className={styles.flourish}>
          <Sprig />
        </Reveal>

        {STOPS.map((stop, i) => (
          <div key={stop.number}>
            {i > 0 && (
              <Reveal className={styles.flourish}>
                <Sprinkle />
              </Reveal>
            )}
            {i === 2 && (
              <Reveal className={styles.aside}>
                <p className={styles.note}>Still excited to see you.</p>
              </Reveal>
            )}
            <Reveal>
              <section className={styles.stop} aria-labelledby={`stop-${i + 1}`}>
                <stop.Art className={styles.art} />
                <p className={styles.number}>{stop.number}</p>
                <h2 id={`stop-${i + 1}`} className={styles.stopTitle}>
                  {stop.title}
                </h2>
                {stop.place && <p className={styles.place}>{stop.place}</p>}
                <p className={styles.blurb}>{stop.blurb}</p>
              </section>
            </Reveal>
          </div>
        ))}

        <Reveal className={styles.flourish}>
          <Sprinkle />
        </Reveal>

        <Reveal className={styles.closing}>
          <p className={styles.signoff}>That’s the day. The rest we make up as we go.</p>
          <p className={styles.note}>Excited to see you.</p>
          <Rsvp />
        </Reveal>

        <Reveal className={styles.flourish}>
          <Sprig />
        </Reveal>
      </div>
    </main>
  );
}
