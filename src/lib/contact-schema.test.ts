import { describe, it, expect } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I have a concrete problem to discuss.",
};

describe("contactSchema", () => {
  it("accepts a fully valid input", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("accepts valid input with an empty honeypot", () => {
    const r = contactSchema.safeParse({ ...valid, company_website: "" });
    expect(r.success).toBe(true);
  });

  it("accepts valid input with the honeypot omitted (optional)", () => {
    const { company_website, ...rest } = { ...valid } as Record<string, unknown>;
    void company_website;
    const r = contactSchema.safeParse(rest);
    expect(r.success).toBe(true);
  });

  it("rejects a name shorter than 2 chars with the exact message", () => {
    const r = contactSchema.safeParse({ ...valid, name: "A" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "name");
      expect(issue?.message).toBe("Tell me who you are");
    }
  });

  it("rejects an empty name with the exact message", () => {
    const r = contactSchema.safeParse({ ...valid, name: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "name");
      expect(issue?.message).toBe("Tell me who you are");
    }
  });

  it("rejects a name longer than 120 chars", () => {
    const r = contactSchema.safeParse({ ...valid, name: "x".repeat(121) });
    expect(r.success).toBe(false);
  });

  it("rejects a malformed email with the exact message", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "email");
      expect(issue?.message).toBe("That email looks off");
    }
  });

  it("rejects a message shorter than 12 chars with the exact message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "message");
      expect(issue?.message).toBe("One concrete line about the problem");
    }
  });

  it("accepts a message exactly 12 chars (min boundary)", () => {
    const r = contactSchema.safeParse({ ...valid, message: "x".repeat(12) });
    expect(r.success).toBe(true);
  });

  it("accepts a message exactly 600 chars (max boundary)", () => {
    const r = contactSchema.safeParse({ ...valid, message: "x".repeat(600) });
    expect(r.success).toBe(true);
  });

  it("rejects a message longer than 600 chars with the exact message", () => {
    const r = contactSchema.safeParse({ ...valid, message: "x".repeat(601) });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "message");
      expect(issue?.message).toBe("Keep it to the gist, we go deeper on a call");
    }
  });

  it("rejects a non-empty honeypot (company_website max 0)", () => {
    const r = contactSchema.safeParse({ ...valid, company_website: "bot.example.com" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issue = r.error.issues.find((i) => i.path[0] === "company_website");
      expect(issue).toBeDefined();
    }
  });

  it("reports all failing fields at once", () => {
    const r = contactSchema.safeParse({ name: "", email: "bad", message: "x" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toEqual(expect.arrayContaining(["name", "email", "message"]));
    }
  });

  it("rejects missing required fields", () => {
    const r = contactSchema.safeParse({});
    expect(r.success).toBe(false);
  });
});
