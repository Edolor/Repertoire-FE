/**
 * Single source of truth for SEO/AEO: the canonical origin (previously
 * duplicated across layout, sitemap, robots, both feeds, and two pages),
 * shared title/description, and JSON-LD graph builders.
 *
 * Entity consistency is the core AEO lever: every page links the same
 * Person and WebSite nodes by @id, so answer engines resolve one
 * coherent identity instead of guessing per page.
 */
import { PERSON, EXPERTISE, FAQ } from "@/content/site";
import { twitterHandle } from "@/urls";

// Canonical host. www, with apex assumed to 301 here (confirmed).
export const SITE_URL = "https://www.aghoghomena.com";
export const SITE_NAME = "Aghoghomena Akasukpe";
export const SITE_TITLE =
  "Aghoghomena Akasukpe | Agentic AI Systems Engineer";
export const SITE_DESCRIPTION =
  "I build production agent systems: Model Context Protocol clients, agent orchestration, skills runtimes, semantic memory, and tool-execution isolation. Then I red-team them. MSc Computer Science (AI & Security), peer-reviewed PST 2025, $20K MITACS research award.";
export const TWITTER_HANDLE = `@${twitterHandle}`;
export const LOCALE = "en_US";

/** Absolute URL for a site-relative path (`/writing` -> full origin URL). */
export const abs = (path = "/") =>
  path.startsWith("http") ? path : `${SITE_URL}${path}`;

// Stable @id anchors so cross-page references resolve to one entity.
const PERSON_ID = `${SITE_URL}/#person`;
const SITE_ID = `${SITE_URL}/#website`;

// The home OG card carries the headshot; reuse it as the portrait so the
// entity has a real image without duplicating the asset into public/.
const PERSON_IMAGE = abs("/opengraph-image");

export const personNode = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PERSON.name,
  url: SITE_URL,
  image: PERSON_IMAGE,
  jobTitle: PERSON.role,
  description: PERSON.outcome,
  email: `mailto:${PERSON.email}`,
  sameAs: [PERSON.github, PERSON.linkedin, PERSON.twitter],
  knowsAbout: [
    ...EXPERTISE.map((e) => e.k),
    "Model Context Protocol",
    "LLM tool use",
    "AI security",
    "AI red teaming",
    "Agentic AI systems",
  ],
  award: [
    "$20,000 MITACS BSI research award",
    "Peer-reviewed publication, PST 2025",
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "degree",
      name: "MSc Computer Science (AI and Security)",
    },
  ],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

const ref = { "@id": PERSON_ID } as const;
const siteRef = { "@id": SITE_ID } as const;

/** Wrap any set of nodes in a single @graph document. */
export const graph = (...nodes: object[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

export const breadcrumbNode = (trail: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

export const faqNode = () => ({
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const profilePageNode = (path: string) => ({
  "@type": "ProfilePage",
  "@id": `${abs(path)}#profilepage`,
  url: abs(path),
  name: `${PERSON.name}: about`,
  isPartOf: siteRef,
  about: ref,
  mainEntity: ref,
  dateModified: new Date().toISOString(),
});

export const articleNode = (a: {
  type?: "Article" | "TechArticle";
  section?: string;
  title: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  keywords?: string[];
  wordCount?: number;
  abstract?: string;
}) => ({
  "@type": a.type ?? "Article",
  headline: a.title,
  name: a.title,
  description: a.description,
  ...(a.abstract ? { abstract: a.abstract } : {}),
  ...(a.section ? { articleSection: a.section } : {}),
  image: abs(`${a.path}/opengraph-image`),
  url: abs(a.path),
  mainEntityOfPage: abs(a.path),
  inLanguage: "en",
  ...(a.datePublished ? { datePublished: a.datePublished } : {}),
  ...(a.dateModified ? { dateModified: a.dateModified } : {}),
  ...(a.wordCount ? { wordCount: a.wordCount } : {}),
  ...(a.keywords?.length ? { keywords: a.keywords.join(", ") } : {}),
  author: ref,
  publisher: ref,
  isPartOf: siteRef,
});
