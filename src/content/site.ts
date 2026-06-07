/**
 * Hardcoded site copy. All content here is verified against the owner's
 * résumé/CV, the MITACS project, and public Farpoint/Fabric material.
 * Farpoint work is described at the public capability level only (NDA).
 * Layout reads from here so copy can change without touching components.
 */
import {
  githubUrl,
  linkedinUrl,
  twitterUrl,
  emailUrl,
  resumeLink,
} from "@/urls";

export const PERSON = {
  name: "Aghoghomena Akasukpe",
  role: "Systems & Full-Stack Engineer",
  // Outcome positioning: what I build, not a job title.
  outcome:
    "I build the systems under AI agents (orchestration, tool execution, MCP, runtimes, memory) and ship full-stack product end to end.",
  signature: "I build the platform layer under AI agents, and the product on top of it.",
  // Availability line rendered near the hero CTAs.
  availability:
    "Open to full-time systems / platform and full-stack roles. Available for contract on a limited basis.",
  email: emailUrl,
  github: githubUrl,
  linkedin: linkedinUrl,
  twitter: twitterUrl,
  resume: resumeLink,
};

// Answer-first FAQ: each answer leads with a direct, self-contained
// statement (the unit answer engines lift). Employer-facing, drafted from
// the verified résumé. Rendered visibly AND emitted as FAQPage JSON-LD so
// ChatGPT/Perplexity/Google AI can cite it verbatim.
export const FAQ = [
  {
    q: "What roles is Aghoghomena Akasukpe open to?",
    a: "Full-time systems / platform engineering and full-stack product engineering roles. He builds the infrastructure under AI agents (orchestration, tool execution, MCP clients, runtimes, memory) and ships full-stack product end to end. He is also available for contract on a limited basis.",
  },
  {
    q: "What is his strongest engineering work?",
    a: "Architecting the agent infrastructure behind Fabric, Farpoint's agentic coding IDE: MCP layers for structured tool invocation and multi-step orchestration, tool-execution and memory pipelines, and distributed pipelines that analyze and transform large, multi-file codebases. Earlier, as a software engineer at Cavista in healthcare, he built C#/.NET claims-parsing, optimized SQL, and shipped tested, reliable releases.",
  },
  {
    q: "What is his full-stack experience?",
    a: "He ships end to end in TypeScript, from a cross-platform Electron + React desktop IDE (Fabric, at Farpoint) to the web. On the web: React/Next.js front ends, typed APIs, and the data layer with React Query, Zod, and Playwright (this site runs on that stack). His backend history spans C#/.NET at Cavista and Laravel/PHP APIs at Azul, plus a school-management platform for 100,000+ users on Next.js, Node, Docker, and AWS.",
  },
  {
    q: "What are his credentials?",
    a: "Best Graduating Student of the School of Computing & Engineering Sciences at Babcock University (First Class, 4.88/5.0, top 1%), an MSc in Computer Science at Ontario Tech University on a Dean's Graduate Scholarship, a peer-reviewed publication at PST 2025 (IEEE Xplore), a $20,000 MITACS research award, and AWS Machine Learning Specialty certification.",
  },
  {
    q: "What systems does he build under AI agents?",
    a: "The infrastructure that lets language models plan and act on real code: agent orchestration loops, tool-execution layers, Model Context Protocol (MCP) clients, runtimes, and memory, designed for structured, multi-file work on real repositories rather than one-shot prompting.",
  },
  {
    q: "What do colleagues say about working with him?",
    a: "Two named LinkedIn recommendations from his Cavista team. A Senior Engineer noted his skills 'often rivaled those of more senior engineers'; a Product Director noted he 'actively participates in discussions, guiding the team toward optimal decisions' and reviews work thoroughly to fully understand intent.",
  },
];

// Typed labels so the Hero's `label === "Research"` lookup is checked against
// the data: renaming a PROOF label here becomes a compile error there.
export type ProofLabel = "Currently" | "Shipped" | "Foundation" | "Research";

export const PROOF = [
  { label: "Currently", value: "Agentic AI Systems Engineer, Farpoint (Fabric)" },
  { label: "Shipped", value: "Software Engineer, Cavista (healthcare)" },
  { label: "Foundation", value: "Best Graduating Student · First Class 4.88/5.0" },
  { label: "Research", value: "MSc CS · PST 2025 (IEEE) · $20K MITACS" },
] satisfies { label: ProofLabel; value: string }[];

// "How I build": three engineering pillars, each grounded in real work.
export const PILLARS = [
  {
    id: "platform",
    name: "Systems & platform",
    tagline: "The infrastructure under AI agents.",
    body: "The runtime that lets agents plan, call tools, and act on real code. At Farpoint I architect the agent infrastructure behind Fabric, an agentic coding IDE: MCP for structured tool invocation and multi-step orchestration, tool-abstraction and execution layers, context-lifecycle and memory pipelines, and distributed pipelines for large-scale codebase analysis and autonomous code improvement.",
    stack: ["MCP", "Orchestration", "Tool execution", "Memory pipelines", "Distributed", "TypeScript"],
  },
  {
    id: "fullstack",
    name: "Full-stack product",
    tagline: "Shipped end to end, desktop to web.",
    body: "Fabric, Farpoint's agentic coding IDE, is a cross-platform Electron + React + TypeScript desktop app: a Monaco editor, Tree-sitter parsing across a dozen languages, embedded terminals (xterm + node-pty), database awareness, and multi-provider LLM adapters, tested with Vitest and Playwright. On the web I've shipped a school-management platform for 100,000+ users (Next.js, Node, Docker, AWS), this site (Next.js 15, React Query, Zod, Playwright), and apps in Laravel and Django.",
    stack: ["Electron", "React", "TypeScript", "Monaco", "Next.js", "Node"],
  },
  {
    id: "backend",
    name: "Backend & data",
    tagline: "Made it fast and correct.",
    body: "At Cavista I built healthcare-claims parsing in C#/.NET, optimized SQL with EF/LINQ, and handled race conditions for an 80% process improvement, with unit and integration tests and production log analysis. Solid CS fundamentals, kept sharp with competitive coding.",
    stack: ["C#/.NET", "SQL Server", "EF/LINQ", "Postgres", "Docker", "AWS"],
  },
];

// How I work: collaboration-positive, paraphrased from the two named
// recommendations. Replaces the old adversarial "anti-pitch".
export const HOW_I_WORK = {
  title: "How I work",
  points: [
    "I dig into the hard problem and ship reliable solutions; colleagues have said my work “often rivaled more senior engineers.”",
    "I review thoroughly and ask the questions that surface intent before building, not after.",
    "I document and communicate so the whole team moves faster, and I own the outcome.",
  ],
};

// The render contract for a research/publication card. Lives with the data
// (which `satisfies` it below) and is imported by <ResearchList>, so the
// component and its content share exactly one definition.
export type ResearchItem = {
  title: string;
  venue: string;
  why: string;
  href: string;
  hrefLabel: string;
};

export const RESEARCH = [
  {
    title: "Peer-reviewed publication, PST 2025",
    venue: "Privacy, Security and Trust (PST) 2025 · IEEE Xplore",
    why: "Peer review at an established venue is external evidence the work holds up under scrutiny by people paid to find holes in it. That is the bar I hold my engineering to.",
    href: "https://ieeexplore.ieee.org/document/11268872",
    hrefLabel: "Read the paper on IEEE Xplore",
  },
  {
    title: "$20,000 MITACS research award",
    venue: "MITACS · agentic coding infrastructure (MCP)",
    why: "A competitive, funded award means an external committee staked money on the research direction before it produced results. It funds the agentic-coding-infrastructure work directly.",
    href: linkedinUrl,
    hrefLabel: "About the award",
  },
] satisfies ResearchItem[];

// Verified academic foundation — single source of truth for these credential
// claims. Wording mirrors the résumé/FAQ exactly (no inferred degree titles).
export const ACADEMIC_FOUNDATION = [
  "MSc Computer Science — Ontario Tech University (Dean's Graduate Scholarship)",
  "Babcock University — Best Graduating Student, School of Computing & Engineering Sciences (First Class, 4.88/5.0, top 1%)",
  "AWS Machine Learning Specialty certification",
];

// Verbatim contiguous excerpts from the two named LinkedIn recommendations.
// Fully attributed, linked to the originals, no carousel.
export const TESTIMONIALS = [
  {
    quote:
      "He consistently demonstrated technical expertise and a strong problem-solving mindset. His ability to dive deep into complex challenges and deliver reliable solutions was truly impressive. In fact, his skills often rivaled those of more senior engineers.",
    name: "Rajeshree Kathariya",
    title: "Senior Engineer at Phreesia",
    relationship: "Worked with Aghoghomena at Cavista Technologies",
    href: linkedinUrl,
    // Middle-aged woman, professional attire. Stylized, respectful.
    look: {
      // Race-agnostic: a neutral non-skin tone, identical for everyone.
      skin: "#AEB4BD",
      hairColor: "#2B2620",
      hairStyle: "bob" as const,
      cloth: "#34406B",
      attire: "blazer" as const,
    },
  },
  {
    quote:
      "He actively participates in discussions, guiding the team toward optimal decisions. His dedication to reviewing items thoroughly and asking insightful questions reflects his commitment to fully understanding feature intent.",
    name: "Brian Harrington",
    title: "Product Director at Axxess",
    relationship: "Worked with Aghoghomena at Cavista Technologies",
    href: linkedinUrl,
    // Older male, professional attire. Stylized, respectful.
    look: {
      // Race-agnostic: same neutral tone as everyone else; age reads from
      // the grey hair + glasses, not skin.
      skin: "#AEB4BD",
      hairColor: "#8A8A8A",
      hairStyle: "shortGrey" as const,
      cloth: "#3A4250",
      attire: "suit" as const,
      glasses: true,
    },
  },
];

// Surfaced work history (was buried in a popup). Concise, employer-facing.
export const EXPERIENCE = [
  {
    role: "Agentic AI Systems Engineer (Contract)",
    org: "Farpoint Technologies (Fabric)",
    period: "2026 to present",
    note: "Architecting the agent infrastructure behind Fabric, an agentic AI coding IDE: MCP for structured tool invocation and multi-step orchestration, tool-execution and memory pipelines, and distributed pipelines for large-scale codebase analysis and autonomous code improvement.",
  },
  {
    role: "Software Engineer (Healthcare)",
    org: "Cavista Technologies",
    period: "2023 to 2024",
    note: "C#/.NET healthcare-claims parsing, SQL optimization, race-condition handling (80% process improvement), unit/integration testing.",
  },
  {
    role: "Full-Stack Engineer",
    org: "Azul",
    period: "2021 to 2023",
    note: "Laravel/PHP REST APIs, MySQL optimization and indexing, JWT auth, and TypeScript/Next.js/React front ends.",
  },
];

export const ABOUT_NARRATIVE = [
  "I'm a systems and full-stack engineer. I build the infrastructure that lets AI agents plan, call tools, and act on real code (agent orchestration, tool execution, MCP clients, runtimes, memory), and I ship full-stack product end to end. Right now I'm the agent-infrastructure engineer behind Fabric, Farpoint's agentic coding IDE: MCP for tool invocation and orchestration, tool-execution and memory pipelines, and distributed pipelines for large-scale codebase analysis and autonomous code improvement.",
  "I ship across the stack. This site runs on Next.js 15, React, TypeScript, Tailwind, React Query, Zod, and Playwright. Before grad school I was a software engineer at Cavista in healthcare (C#/.NET claims parsing, SQL optimization, and tests) and a full-stack engineer building APIs and product in Laravel and Django. The foundation is solid CS: Best Graduating Student of my school at Babcock University (First Class, 4.88/5.0, top 1%) and an MSc in Computer Science at Ontario Tech University on a Dean's scholarship.",
  "My research adds rigor: a peer-reviewed PST 2025 publication (IEEE Xplore) and a $20K MITACS award. I work best engineer-to-engineer, inside a team that ships: reviewing thoroughly, asking the questions that surface intent, and owning the outcome.",
];

export const EXPERTISE = [
  { k: "Systems & platform", v: "Agent orchestration, tool routing, MCP clients, runtimes, memory" },
  { k: "Agentic coding infra", v: "MCP, tool execution, memory pipelines, distributed codebase analysis (Fabric)" },
  { k: "Full-stack product", v: "Electron desktop + Next.js / React / TypeScript web, typed end to end" },
  { k: "Backend & APIs", v: "C#/.NET, Laravel, Django; REST APIs; SQL optimization" },
  { k: "Cloud & data", v: "AWS, Docker, Terraform; Postgres, MySQL, Redis; vector stores" },
  { k: "Quality & testing", v: "xUnit, Playwright, React Query, Zod; typed and tested end to end" },
];

// Top nav: real destinations only (no in-page section jumps). Contact stays a
// home anchor — the one conventional exception.
export const NAV = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
] satisfies { href: string; label: string }[];
