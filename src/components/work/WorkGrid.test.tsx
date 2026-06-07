import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WorkGrid, type WorkCardItem } from "@/components/work/WorkGrid";

const items: WorkCardItem[] = [
  {
    slug: "ledger",
    permalink: "/work/ledger",
    client: "Acme",
    locked: false,
    title: "Distributed Ledger Platform",
    summary: "A horizontally scalable settlement system.",
    outcome: "Cut reconciliation time by 90%.",
    tags: ["Go", "Postgres", "Kafka"],
  },
  {
    slug: "vault",
    permalink: "/work/vault",
    client: "Globex",
    locked: true,
    title: "Secrets Vault Migration",
    summary: "Zero-downtime migration of credential storage.",
    outcome: "Rotated 10k secrets with no outages.",
    tags: ["Rust", "Vault"],
  },
];

describe("WorkGrid", () => {
  it("renders one link per item pointing at each item's permalink", () => {
    render(<WorkGrid items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/work/ledger",
      "/work/vault",
    ]);
  });

  it("renders the title, summary, and outcome text for each item", () => {
    render(<WorkGrid items={items} />);
    for (const w of items) {
      expect(screen.getByText(w.title)).toBeInTheDocument();
      expect(screen.getByText(w.summary)).toBeInTheDocument();
      expect(screen.getByText(w.outcome)).toBeInTheDocument();
    }
  });

  it("renders every tag string as a badge", () => {
    render(<WorkGrid items={items} />);
    for (const tag of [...items[0].tags, ...items[1].tags]) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });

  it("shows the NDA label only for the locked item", () => {
    render(<WorkGrid items={items} />);
    expect(screen.getAllByText("details under NDA")).toHaveLength(1);
  });
});
