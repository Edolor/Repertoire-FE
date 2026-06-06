import { Section } from "@/components/primitives/Section";
import { AgentExplorable } from "@/components/interactive/AgentExplorable";

export function AgentDemo() {
  return (
    <Section
      id="agent-demo"
      eyebrow="How an agent loop works"
      title="How I structure the loop, and how I build it"
      intro="A steppable plan / tool / result / reflect run over a sample repo (canned, not a live model). It shows how I structure orchestration, route tool calls, and use the reflect step to keep the system observable and recoverable, the same patterns behind the agentic-coding work."
    >
      <AgentExplorable />
    </Section>
  );
}
