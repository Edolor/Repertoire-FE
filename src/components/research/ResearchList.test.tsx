import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResearchList, type ResearchItem } from "@/components/research/ResearchList";

const items: ResearchItem[] = [
  {
    title: "Adversarial Robustness of Vision Models",
    venue: "NeurIPS 2024",
    why: "Showed a cheap defense that survives gradient-free attacks.",
    href: "https://example.com/paper-one",
    hrefLabel: "Read the paper",
  },
  {
    title: "Federated Learning at the Edge",
    venue: "ICLR 2023",
    why: "Cut bandwidth by 40% with sketched gradients.",
    href: "https://example.org/paper-two",
    hrefLabel: "View preprint",
  },
];

describe("ResearchList", () => {
  it("renders the title, venue, and why for each item", () => {
    render(<ResearchList items={items} />);
    expect(
      screen.getByRole("heading", { name: "Adversarial Robustness of Vision Models" }),
    ).toBeInTheDocument();
    expect(screen.getByText("NeurIPS 2024")).toBeInTheDocument();
    expect(
      screen.getByText("Showed a cheap defense that survives gradient-free attacks."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Federated Learning at the Edge" }),
    ).toBeInTheDocument();
  });

  it("renders a link per item carrying the hrefLabel and href", () => {
    render(<ResearchList items={items} />);
    const link = screen.getByRole("link", { name: /Read the paper/ });
    expect(link).toHaveAttribute("href", "https://example.com/paper-one");
  });

  it("opens external links in a new tab with a noreferrer rel (security invariant)", () => {
    render(<ResearchList items={items} />);
    const link = screen.getByRole("link", { name: /Read the paper/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noreferrer");
  });

  it("renders one card per item", () => {
    render(<ResearchList items={items} />);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByRole("heading")).toHaveLength(2);
  });
});
