import { Section } from "@/components/primitives/Section";
import { ContactForm } from "@/components/interactive/ContactForm";
import { PERSON } from "@/content/site";

export function ContactSection() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Tell me the problem in one line"
      intro="The form qualifies a consulting conversation. Hiring or just want to talk shop? The direct email and GitHub below are never funneled through anything."
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm />
        <div className="font-mono text-sm">
          <p className="text-text/55">Hiring / peer path, no form:</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                href={`mailto:${PERSON.email}`}
                className="text-accent-2 hover:underline"
              >
                &gt; {PERSON.email}
              </a>
            </li>
            <li>
              <a
                href={PERSON.github}
                target="_blank"
                rel="noreferrer"
                className="text-text/75 hover:text-text"
              >
                &gt; GitHub
              </a>
            </li>
            <li>
              <a
                href={PERSON.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-text/75 hover:text-text"
              >
                &gt; LinkedIn
              </a>
            </li>
            <li>
              <a
                href={PERSON.resume}
                target="_blank"
                rel="noreferrer"
                className="text-text/75 hover:text-text"
              >
                &gt; Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
