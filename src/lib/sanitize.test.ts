import { describe, it, expect } from "vitest";
import { https, sanitizeProject, sanitizeAbout } from "@/lib/sanitize";
import { BaseProjectProps } from "@/types/Project.types";
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

describe("sanitizeProject", () => {
  it("rewrites thumbnail and every image URL to https", () => {
    const project = {
      id: 1,
      title: "Demo",
      thumbnail: "http://cdn.example.com/thumb.png",
      images: ["http://cdn.example.com/1.png", "https://cdn.example.com/2.png"],
    } as unknown as BaseProjectProps;

    const out = sanitizeProject(project);
    expect(out.thumbnail).toBe("https://cdn.example.com/thumb.png");
    expect(out.images).toEqual([
      "https://cdn.example.com/1.png",
      "https://cdn.example.com/2.png",
    ]);
  });

  it("preserves unrelated fields", () => {
    const project = {
      id: 7,
      title: "Keep me",
      thumbnail: "http://x/y.png",
    } as unknown as BaseProjectProps;

    const out = sanitizeProject(project);
    expect(out.id).toBe(7);
    expect(out.title).toBe("Keep me");
  });

  it("returns a new object (does not mutate the input)", () => {
    const project = {
      thumbnail: "http://x/y.png",
    } as unknown as BaseProjectProps;

    const out = sanitizeProject(project);
    expect(out).not.toBe(project);
    expect(project.thumbnail).toBe("http://x/y.png");
  });

  it("coerces a missing thumbnail to an empty string", () => {
    const project = {} as unknown as BaseProjectProps;
    const out = sanitizeProject(project);
    expect(out.thumbnail).toBe("");
  });

  it("leaves images undefined when not provided", () => {
    const project = {
      thumbnail: "http://x/y.png",
    } as unknown as BaseProjectProps;
    const out = sanitizeProject(project);
    expect(out.images).toBeUndefined();
  });

  it("recursively sanitizes nested other_projects", () => {
    const project = {
      thumbnail: "http://a/t.png",
      other_projects: [
        {
          thumbnail: "http://b/t.png",
          images: ["http://b/1.png"],
          other_projects: [{ thumbnail: "http://c/t.png" }],
        },
      ],
    } as unknown as BaseProjectProps;

    const out = sanitizeProject(project);
    expect(out.thumbnail).toBe("https://a/t.png");
    expect(out.other_projects![0].thumbnail).toBe("https://b/t.png");
    expect(out.other_projects![0].images).toEqual(["https://b/1.png"]);
    expect(out.other_projects![0].other_projects![0].thumbnail).toBe(
      "https://c/t.png",
    );
  });

  it("leaves other_projects undefined when not provided", () => {
    const project = {
      thumbnail: "http://x/y.png",
    } as unknown as BaseProjectProps;
    expect(sanitizeProject(project).other_projects).toBeUndefined();
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
