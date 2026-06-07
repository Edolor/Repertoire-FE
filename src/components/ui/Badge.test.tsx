import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge", () => {
  it("renders its children as text", () => {
    render(<Badge>TypeScript</Badge>);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText("Tag").tagName).toBe("SPAN");
  });

  it("applies the base classes", () => {
    render(<Badge>Base</Badge>);
    const el = screen.getByText("Base");
    expect(el).toHaveClass("inline-flex", "items-center", "font-mono", "text-xs");
  });

  it("merges a passed className alongside the base classes", () => {
    render(<Badge className="custom-badge">Merged</Badge>);
    const el = screen.getByText("Merged");
    expect(el).toHaveClass("custom-badge");
    // base classes remain present after merging
    expect(el).toHaveClass("inline-flex", "font-mono");
  });
});
