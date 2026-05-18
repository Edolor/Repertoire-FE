import { Section } from "@/components/primitives/Section";
import { AgentExplorable } from "@/components/interactive/AgentExplorable";

export function AgentDemo() {
  return (
    <Section
      id="agent-demo"
      eyebrow="Watch an agent work"
      title="How I think about the loop"
      intro="A canned, steppable run over a fake repo: plan, tool call, result, reflect. Not a live model. It shows where I put the boundaries and why the reflect step is the one I watch."
    >
      <AgentExplorable />
    </Section>
  );
}
