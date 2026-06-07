import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/primitives/Reveal";
import { FAQ as ITEMS } from "@/content/site";

// Visible, answer-first Q&A. The text is in the DOM (not collapsed behind
// JS) on purpose: answer engines lift the question/answer pair directly,
// and the same content is mirrored as FAQPage JSON-LD on the home page.
export function FAQ() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Questions, answered directly"
      intro="The things people ask before reaching out."
    >
      <dl className="divide-y divide-divider border-y border-divider">
        {ITEMS.map((item, idx) => (
          <Reveal key={item.q} delay={idx * 0.04}>
            <div className="py-5">
              <dt className="flex gap-2 text-lg font-bold leading-snug">
                <span className="select-none text-accent">&gt;</span>
                {item.q}
              </dt>
              <dd className="mt-1.5 text-pretty leading-relaxed text-text/75">{item.a}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
