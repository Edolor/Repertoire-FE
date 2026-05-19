/**
 * Hardcoded site copy. Items marked DRAFT are placeholder text written from
 * CLAUDE.md + the brief and must be swapped for verified content before this
 * is treated as final (testimonials, the PST paper URL, exact figures).
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
  role: "Agentic AI Systems Engineer",
  // Outcome positioning, not a job title.
  outcome:
    "I build production agent systems that can be trusted to run, then I break them so they hold up when it counts.",
  signature: "Hi, I build agents. And then I break them.",
  email: emailUrl,
  github: githubUrl,
  linkedin: linkedinUrl,
  twitter: twitterUrl,
  resume: resumeLink,
};

// Answer-first FAQ: each answer leads with a direct, self-contained
// statement (the unit answer engines lift). NDA-safe, on-brand, drafted
// for review. Rendered visibly on the home page AND emitted as FAQPage
// JSON-LD so ChatGPT/Perplexity/Google AI can cite it verbatim.
export const FAQ = [
  {
    q: "What does an Agentic AI Systems Engineer do?",
    a: "An Agentic AI Systems Engineer builds the production systems that let language models plan, call tools, and act on real code: Model Context Protocol clients, agent orchestration loops, skills runtimes, semantic memory, and tool-execution isolation. Aghoghomena Akasukpe builds these systems and then red-teams them.",
  },
  {
    q: "How can I work with Aghoghomena Akasukpe?",
    a: "There are three engagement models: an advisory retainer (monthly, fixed hours, architecture and threat-model reviews), a fixed-scope build (a bounded capability built and handed over in two to six weeks), and an agent red-team assessment (adversarial testing with severity-ranked findings in one to three weeks).",
  },
  {
    q: "What is agent red-teaming?",
    a: "Agent red-teaming is adversarial assessment of an AI agent as a system, not a chatbot. It targets the tool-execution surface, isolation boundaries, and failure modes that let a single successful attack cause real damage. The output is severity-ranked findings with deterministic reproductions and suggested boundaries.",
  },
  {
    q: "Is prompt injection the main risk for tool-using agents?",
    a: "Prompt injection is on the list of risks for tool-using agents, but it is not at the top. The risks that matter most are ranked by how much a single success costs you: an unbounded tool-execution surface and weak isolation boundaries usually outrank prompt-level attacks.",
  },
  {
    q: "What are Aghoghomena Akasukpe's credentials?",
    a: "An MSc in Computer Science (AI and Security), a peer-reviewed publication at PST 2025, and a $20,000 MITACS BSI research award. The applied track is core engineering on a production agentic coding platform, with two named LinkedIn recommendations from prior engineering roles.",
  },
  {
    q: "Who is the right fit for these engagements?",
    a: "Engineering teams shipping an agent who want the plan pressure-tested rather than approved. The fit is wrong if you want a prompt tweaked and the reliability problem declared solved, or if the agent cannot be discussed as a system with boundaries and failure modes.",
  },
];

export const PROOF = [
  { label: "Peer-reviewed", value: "PST 2025 publication" },
  { label: "Research award", value: "$20K MITACS BSI" },
  { label: "Industry", value: "Core engineer, agentic coding platform" },
  { label: "Endorsed", value: "2 named recommendations" },
];

export const ENGAGEMENTS = [
  {
    id: "advisory",
    name: "Advisory retainer",
    tagline: "A senior agent-systems engineer on call.",
    forWho: "Teams shipping an agent who want decisions reviewed before they ship, not after.",
    youGet: [
      "Recurring architecture and threat-model reviews",
      "Async design feedback on the agent loop, tools, and boundaries",
      "A standing line for the hard calls",
    ],
    shape: "Monthly, fixed hours, cancel anytime.",
  },
  {
    id: "build",
    name: "Fixed-scope build",
    tagline: "A bounded piece of the agent system, built and handed over.",
    forWho: "Teams who need a specific capability (isolation layer, skills runtime, memory) built right once.",
    youGet: [
      "A scoped statement of work with a definition of done",
      "Production code, tests, and the trade-off writeup",
      "A handover so your team owns it after",
    ],
    shape: "Fixed price, fixed scope, 2 to 6 weeks typical.",
  },
  {
    id: "redteam",
    name: "Agent red-team assessment",
    tagline: "Find the failures that matter before an adversary does.",
    forWho: "Teams with a shipping agent who want it adversarially tested as a system, not a chatbot.",
    youGet: [
      "Severity-ranked findings with deterministic reproductions",
      "Suggested boundaries, not just problems",
      "A readout your engineers can act on",
    ],
    shape: "Fixed-scope, time-boxed, report in 1 to 3 weeks.",
  },
];

// The honest anti-pitch.
export const ANTI_PITCH = {
  title: "You will not enjoy working with me if",
  points: [
    "you want a prompt tweaked and the reliability problem declared solved",
    "the agent cannot be discussed as a system with boundaries and failure modes",
    "you need a vendor who agrees with the plan rather than pressure-tests it",
  ],
};

export const RESEARCH = [
  {
    title: "Peer-reviewed publication, PST 2025",
    venue: "Privacy, Security and Trust (PST) 2025",
    why: "Peer review at a security venue is external evidence the work survives scrutiny by people paid to find holes in it. That is the bar I hold my own systems to.",
    href: "https://ieeexplore.ieee.org/document/11268872",
    hrefLabel: "Read the paper on IEEE Xplore",
    draft: false,
  },
  {
    title: "$20,000 MITACS BSI research award",
    venue: "MITACS, Business Strategy Internship",
    why: "A funded award means an external committee staked money on the research direction before it produced anything. It is forward-looking credibility, not a retrospective pat.",
    href: linkedinUrl,
    hrefLabel: "About the award",
    draft: false,
  },
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

export const ABOUT_NARRATIVE = [
  "I am an Agentic AI Systems Engineer. I build the production systems that let language models plan, call tools, and act against real code: Model Context Protocol clients, agent orchestration, skills runtimes, tool-execution isolation, and semantic memory.",
  "The differentiating part is the second half. I red-team what I build. An MSc in Computer Science (AI and Security), a peer-reviewed PST 2025 publication, and a $20K MITACS BSI research award are the formal version of one habit: assume the system will be attacked, and design as if it already has been.",
  "I work best engineer-to-engineer, with teams who want the plan pressure-tested rather than approved.",
];

export const EXPERTISE = [
  { k: "Agent orchestration", v: "Planning loops, tool routing, reflection that is inspectable" },
  { k: "Tool-execution isolation", v: "Enforced boundaries, not prompt-level suggestions" },
  { k: "MCP clients", v: "Model Context Protocol integration and capability surfaces" },
  { k: "Skills runtimes", v: "Versioned, capability-scoped, untrusted-by-default" },
  { k: "Semantic memory", v: "Retrieval-backed memory for long-horizon sessions" },
  { k: "AI red-teaming", v: "Adversarial assessment of agents as systems" },
];

export const NAV = [
  { href: "/#work-with-me", label: "Work with me" },
  { href: "/#selected-work", label: "Selected work" },
  { href: "/#research", label: "Research" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];
