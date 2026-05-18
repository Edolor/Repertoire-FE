import { Hero } from "@/components/sections/Hero";
import { WorkWithMe } from "@/components/sections/WorkWithMe";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { AgentDemo } from "@/components/sections/AgentDemo";
import { Research } from "@/components/sections/Research";
import { WritingTeaser } from "@/components/sections/WritingTeaser";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
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
      <FAQ />
      <DashedDivider className="mx-auto max-w-content" />
      <ContactSection />
    </>
  );
}
