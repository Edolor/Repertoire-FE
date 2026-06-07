import { describe, it, expect } from "vitest";
import { HOME_SECTIONS, sectionNumber } from "@/content/sections";

describe("sectionNumber", () => {
  it("leaves the hero unnumbered", () => {
    expect(sectionNumber("hero")).toBeUndefined();
  });

  it("numbers the first non-hero section 01 and counts up", () => {
    expect(sectionNumber("how-i-build")).toBe("01");
    expect(sectionNumber("about")).toBe("02");
  });

  it("numbers the last section 07", () => {
    expect(sectionNumber("contact")).toBe("07");
  });

  it("returns undefined for an unknown id", () => {
    expect(sectionNumber("does-not-exist")).toBeUndefined();
  });

  it("zero-pads every number to a 2-digit string", () => {
    for (const { id } of HOME_SECTIONS.filter((s) => s.id !== "hero")) {
      const n = sectionNumber(id);
      expect(n).toMatch(/^\d{2}$/);
    }
  });
});

describe("HOME_SECTIONS", () => {
  it("starts with the hero", () => {
    expect(HOME_SECTIONS[0].id).toBe("hero");
  });

  it("numbers the non-hero sections contiguously in render order", () => {
    const numbered = HOME_SECTIONS.filter((s) => s.id !== "hero").map((s) =>
      sectionNumber(s.id),
    );
    expect(numbered).toEqual(["01", "02", "03", "04", "05", "06", "07"]);
  });
});
