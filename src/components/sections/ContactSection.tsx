import { Section } from "@/components/primitives/Section";
import { ContactForm } from "@/components/interactive/ContactForm";
import { CopyButton } from "@/components/primitives/CopyButton";
import { PERSON } from "@/content/site";

export function ContactSection() {
  return (
    <Section
      id="contact"
      index="07"
      eyebrow="Contact"
      title="Let's talk"
      intro="Open to full-time systems / platform and full-stack roles, and available for contract. Hiring, or just want to talk shop? Use the form, or reach me directly below."
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm />
        <div className="font-mono text-sm">
          <p className="text-text/70">Hiring / peer path, no form:</p>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2">
              <a
                href={`mailto:${PERSON.email}`}
                className="link-underline text-accent-2"
              >
                &gt; {PERSON.email}
              </a>
              <CopyButton value={PERSON.email} label="email" />
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
