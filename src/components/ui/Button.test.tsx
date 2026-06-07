import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button, ButtonLink } from "@/components/ui/Button";

describe("Button", () => {
  it("applies the default primary/md variant classes", () => {
    render(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("bg-accent");
    expect(btn).toHaveClass("text-accent-fg");
    expect(btn).toHaveClass("h-11", "px-5");
  });

  it("applies the secondary variant classes", () => {
    render(<Button variant="secondary">Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("text-accent-2");
    expect(btn).toHaveClass("border-accent-2");
    expect(btn).not.toHaveClass("bg-accent");
  });

  it("merges a passed className onto the element", () => {
    render(<Button className="custom-cls">Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("custom-cls");
  });

  it("forwards its ref to the underlying <button>", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={(el) => (ref.current = el)}>Go</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes the disabled attribute through", () => {
    render(<Button disabled>Go</Button>);
    expect((screen.getByRole("button", { name: "Go" }) as HTMLButtonElement).disabled).toBe(true);
  });
});

describe("ButtonLink", () => {
  it("renders an <a> with the given href", () => {
    render(<ButtonLink href="/work">Work</ButtonLink>);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
  });

  it("defaults rel to noopener noreferrer for target=_blank with no rel", () => {
    render(
      <ButtonLink href="https://example.com" target="_blank">
        Out
      </ButtonLink>,
    );
    expect(screen.getByRole("link", { name: "Out" })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("keeps an explicit rel when target=_blank", () => {
    render(
      <ButtonLink href="https://example.com" target="_blank" rel="nofollow">
        Out
      </ButtonLink>,
    );
    expect(screen.getByRole("link", { name: "Out" })).toHaveAttribute("rel", "nofollow");
  });

  it("leaves rel unset when there is no target", () => {
    render(<ButtonLink href="/work">Work</ButtonLink>);
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute("rel");
  });
});
