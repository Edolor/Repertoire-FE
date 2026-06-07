import { describe, it, expect } from "vitest";
import { https, sanitizeAbout } from "@/lib/sanitize";
import { AboutProps } from "@/types/About.types";

describe("https", () => {
  it("rewrites a leading http:// to https://", () => {
    expect(https("http://example.com/a.png")).toBe("https://example.com/a.png");
  });

  it("is case-insensitive on the scheme", () => {
    expect(https("HTTP://example.com")).toBe("https://example.com");
    expect(https("HtTp://example.com")).toBe("https://example.com");
  });

  it("leaves an already-https URL untouched", () => {
    expect(https("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  it("only rewrites the scheme at the start, not http inside the URL", () => {
    expect(https("https://x.com/?u=http://y.com")).toBe(
      "https://x.com/?u=http://y.com",
    );
  });

  it("does not touch other schemes (e.g. data:, ftp:)", () => {
    expect(https("ftp://example.com/a.png")).toBe("ftp://example.com/a.png");
    expect(https("data:image/png;base64,AAAA")).toBe(
      "data:image/png;base64,AAAA",
    );
  });

  it("returns empty string for undefined", () => {
    expect(https(undefined)).toBe("");
  });

  it("returns empty string for non-string inputs", () => {
    // Guard branch: typeof url !== "string"
    expect(https(null as unknown as string)).toBe("");
    expect(https(123 as unknown as string)).toBe("");
  });

  it("returns an empty string unchanged", () => {
    expect(https("")).toBe("");
  });
});

describe("sanitizeAbout", () => {
  it("defaults all arrays to empty when absent", () => {
    const out = sanitizeAbout({} as unknown as AboutProps);
    expect(out.experiences).toEqual([]);
    expect(out.education).toEqual([]);
    expect(out.awards).toEqual([]);
    expect(out.certifications).toEqual([]);
  });

  it("rewrites award banners to https", () => {
    const about = {
      awards: [{ banner: "http://cdn/x.png", title: "A" }],
    } as unknown as AboutProps;

    const out = sanitizeAbout(about);
    expect(out.awards[0].banner).toBe("https://cdn/x.png");
    // unrelated fields preserved
    expect((out.awards[0] as unknown as { title: string }).title).toBe("A");
  });

  it("rewrites certification banners to https", () => {
    const about = {
      certifications: [{ banner: "http://cdn/c.png" }],
    } as unknown as AboutProps;

    const out = sanitizeAbout(about);
    expect(out.certifications[0].banner).toBe("https://cdn/c.png");
  });

  it("passes experiences and education through unchanged", () => {
    const experiences = [{ role: "Engineer" }];
    const education = [{ school: "Uni" }];
    const about = {
      experiences,
      education,
    } as unknown as AboutProps;

    const out = sanitizeAbout(about);
    expect(out.experiences).toEqual(experiences);
    expect(out.education).toEqual(education);
  });

  it("does not mutate the original banner objects", () => {
    const award = { banner: "http://cdn/x.png" };
    const about = { awards: [award] } as unknown as AboutProps;

    sanitizeAbout(about);
    expect(award.banner).toBe("http://cdn/x.png");
  });
});
