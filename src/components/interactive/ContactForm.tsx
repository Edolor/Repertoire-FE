"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { useCreateMessage } from "@/hooks/useQueries";
import { Input, Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { PERSON } from "@/content/site";

const CALCOM = process.env.NEXT_PUBLIC_CALCOM_LINK; // e.g. https://cal.com/you/intro
const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const mutation = useCreateMessage();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data: ContactInput) => {
    if (data.company_website) return; // honeypot tripped, drop silently
    mutation.mutate({
      name: data.name,
      email: data.email,
      message: data.message,
    });
  };

  if (mutation.isSuccess) {
    return (
      <div className="border border-divider bg-surface p-6 font-mono text-sm">
        <p className="text-accent">&gt; message sent.</p>
        <p className="mt-2 text-text/75">
          I read these myself and reply from {PERSON.email}.
        </p>
        {CALCOM ? (
          <div className="mt-5">
            <p className="mb-2 text-text/60">
              Want to skip the back-and-forth? Grab a slot:
            </p>
            <iframe
              title="Book a call"
              src={CALCOM}
              className="h-[520px] w-full border border-divider"
            />
          </div>
        ) : (
          <a
            href={`mailto:${PERSON.email}`}
            className="mt-4 inline-block text-accent-2 hover:underline"
          >
            or email me directly &gt;
          </a>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="border border-divider bg-surface p-6"
    >
      {TURNSTILE && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div
            className="cf-turnstile mb-4"
            data-sitekey={TURNSTILE}
          />
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && (
            <p className="mt-1 font-mono text-xs text-accent">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="mt-1 font-mono text-xs text-accent">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="message">One line about the problem</Label>
        <Textarea
          id="message"
          rows={3}
          {...register("message")}
          aria-invalid={!!errors.message}
          placeholder="e.g. building an agent platform and need someone who can own the orchestration + tooling layer"
        />
        {errors.message && (
          <p className="mt-1 font-mono text-xs text-accent">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot: visually hidden, off the tab order. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          tabIndex={-1}
          autoComplete="off"
          {...register("company_website")}
        />
      </div>

      {mutation.isError && (
        <p className="mt-4 border border-accent/40 bg-accent/5 px-3 py-2 font-mono text-xs text-accent">
          Could not send (the API may be rate-limited at 10/day/IP). Email me
          directly:{" "}
          <a className="underline" href={`mailto:${PERSON.email}`}>
            {PERSON.email}
          </a>
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={isSubmitting || mutation.isPending}>
          {mutation.isPending ? "sending…" : "Send"}
        </Button>
        <a
          href={`mailto:${PERSON.email}`}
          className="font-mono text-sm text-accent-2 hover:underline"
        >
          or just email me &gt;
        </a>
      </div>
    </form>
  );
}
