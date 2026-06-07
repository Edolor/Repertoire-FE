import { Hero } from "@/components/sections/Hero";
import { WorkWithMe } from "@/components/sections/WorkWithMe";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { AgentDemo } from "@/components/sections/AgentDemo";
import { WritingTeaser } from "@/components/sections/WritingTeaser";
import { FAQ } from "@/components/sections/FAQ";
import { ContactSection } from "@/components/sections/ContactSection";
import { DashedDivider } from "@/components/primitives/Section";
import { JsonLd } from "@/components/JsonLd";
import { graph, personNode, websiteNode, faqNode } from "@/lib/seo";

const homeLd = graph(personNode, websiteNode, faqNode());

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeLd} />
      <Hero />
      <WorkWithMe />
      <DashedDivider className="mx-auto max-w-content" />
      <AboutTeaser />
      <DashedDivider className="mx-auto max-w-content" />
      <SelectedWork />
      <AgentDemo />
      <DashedDivider className="mx-auto max-w-content" />
      <WritingTeaser />
      <DashedDivider className="mx-auto max-w-content" />
      <FAQ />
      <DashedDivider className="mx-auto max-w-content" />
      <ContactSection />
    </>
  );
}
