/**
 * Hardcoded site copy. Items marked DRAFT are placeholder text written from
 * CLAUDE.md + the brief and must be swapped for verified content before this
 * is treated as final (testimonials, the PST paper URL, exact figures).
 * Layout reads from here so copy can change without touching components.
 */
import {
  githubUrl,
  linkedinUrl,
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
  resume: resumeLink,
};

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
    relationship: "Worked with Aghoghomena at Cavista",
    href: linkedinUrl,
  },
  {
    quote:
      "He actively participates in discussions, guiding the team toward optimal decisions. His dedication to reviewing items thoroughly and asking insightful questions reflects his commitment to fully understanding feature intent.",
    name: "Brian Harrington",
    title: "Product Director at Axxess",
    relationship: "Worked with Aghoghomena on the claims management solution",
    href: linkedinUrl,
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
