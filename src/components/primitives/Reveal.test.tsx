import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/primitives/Reveal";

describe("Reveal", () => {
  it("applies data-dir from the direction prop", () => {
    const { container } = render(
      <Reveal direction="left">content</Reveal>,
    );
    const el = container.querySelector(".reveal") as HTMLElement;
    expect(el).toBeTruthy();
    expect(el).toHaveAttribute("data-dir", "left");
  });

  it("defaults data-dir to 'up'", () => {
    const { container } = render(<Reveal>content</Reveal>);
    const el = container.querySelector(".reveal") as HTMLElement;
    expect(el).toHaveAttribute("data-dir", "up");
  });

  it("sets no transitionDelay when delay is 0/unset", () => {
    const { container } = render(<Reveal>content</Reveal>);
    const el = container.querySelector(".reveal") as HTMLElement;
    expect(el.style.transitionDelay).toBe("");
  });

  it("sets a seconds transitionDelay when delay > 0", () => {
    const { container } = render(<Reveal delay={0.5}>content</Reveal>);
    const el = container.querySelector(".reveal") as HTMLElement;
    expect(el.style.transitionDelay).toBe("0.5s");
  });
});

describe("RevealGroup", () => {
  it("injects a per-child transitionDelay of index * stagger (default 0.07s)", () => {
    const { container } = render(
      <RevealGroup>
        <RevealItem>a</RevealItem>
        <RevealItem>b</RevealItem>
        <RevealItem>c</RevealItem>
      </RevealGroup>,
    );
    const items = container.querySelectorAll<HTMLElement>(".reveal");
    expect(items).toHaveLength(3);
    // index 0 -> 0 -> no inline transitionDelay
    expect(items[0].style.transitionDelay).toBe("");
    // index 1 -> 0.07s, index 2 -> 0.14s
    expect(items[1].style.transitionDelay).toBe("0.07s");
    expect(items[2].style.transitionDelay).toBe("0.14s");
  });

  it("honors a custom stagger value", () => {
    const { container } = render(
      <RevealGroup stagger={0.2}>
        <RevealItem>a</RevealItem>
        <RevealItem>b</RevealItem>
      </RevealGroup>,
    );
    const items = container.querySelectorAll<HTMLElement>(".reveal");
    expect(items[1].style.transitionDelay).toBe("0.2s");
  });

  it("passes a raw string child through without throwing", () => {
    expect(() =>
      render(
        <RevealGroup>
          plain text
          <RevealItem>item</RevealItem>
        </RevealGroup>,
      ),
    ).not.toThrow();
    expect(screen.getByText(/plain text/)).toBeInTheDocument();
    expect(screen.getByText("item")).toBeInTheDocument();
  });
});
