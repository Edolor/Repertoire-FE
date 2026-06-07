import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("flex", "items-center")).toBe("flex items-center");
  });

  it("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });

  it("drops falsy and conditional values", () => {
    expect(cn("a", false, null, undefined, 0, "", "b")).toBe("a b");
  });

  it("dedupes conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("keeps non-conflicting Tailwind classes", () => {
    expect(cn("p-2", "m-4")).toBe("p-2 m-4");
  });

  it("supports clsx conditional object syntax", () => {
    expect(cn({ active: true, disabled: false }, "base")).toBe("active base");
  });

  it("supports arrays (clsx) and flattens them", () => {
    expect(cn(["flex", "gap-2"], "p-4")).toBe("flex gap-2 p-4");
  });

  it("resolves conflicts across nested arrays/objects", () => {
    expect(cn(["text-sm", { "text-lg": true }])).toBe("text-lg");
  });

  it("handles a mix of falsy entries and conflicts together", () => {
    expect(cn("bg-red-500", false && "bg-blue-500", "bg-green-500")).toBe(
      "bg-green-500"
    );
  });

  it("returns an empty string when all inputs are falsy", () => {
    expect(cn(false, null, undefined, "")).toBe("");
  });
});
