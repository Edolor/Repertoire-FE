import { Hero } from "@/components/sections/Hero";
import { WorkWithMe } from "@/components/sections/WorkWithMe";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { AgentDemo } from "@/components/sections/AgentDemo";
import { Research } from "@/components/sections/Research";
import { WritingTeaser } from "@/components/sections/WritingTeaser";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { ContactSection } from "@/components/sections/ContactSection";
import { DashedDivider } from "@/components/primitives/Section";
import { PERSON } from "@/content/site";

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON.name,
  jobTitle: PERSON.role,
  url: "https://www.aghoghomena.com",
  sameAs: [PERSON.github, PERSON.linkedin],
  description: PERSON.outcome,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <Hero />
      <WorkWithMe />
      <DashedDivider className="mx-auto max-w-content" />
      <SelectedWork />
      <DashedDivider className="mx-auto max-w-content" />
      <AgentDemo />
      <DashedDivider className="mx-auto max-w-content" />
      <Research />
      <DashedDivider className="mx-auto max-w-content" />
      <WritingTeaser />
      <DashedDivider className="mx-auto max-w-content" />
      <AboutTeaser />
      <DashedDivider className="mx-auto max-w-content" />
      <ContactSection />
    </>
  );
}
