import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

/**
 * jsdom reports `offsetParent === null` for every element, which would make the
 * hook's visibility filter discard the buttons and short-circuit the Tab trap.
 * Force a non-null offsetParent so the trap logic can actually run. (Re-spied
 * per test because the global restoreMocks config restores it after each test.)
 */
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "offsetParent", "get").mockReturnValue(
    document.body,
  );
});

function Trap({ onEscape }: { onEscape?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = useFocusTrap(ref, { active: true, onEscape });
  return (
    <div ref={ref} tabIndex={-1} data-testid="container" onKeyDown={onKeyDown}>
      <button>first</button>
      <button>second</button>
      <button>third</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("moves focus into the container on mount", () => {
    render(<Trap />);
    expect(document.activeElement).toBe(screen.getByTestId("container"));
  });

  it("routes Escape to the onEscape callback", () => {
    const onEscape = vi.fn();
    render(<Trap onEscape={onEscape} />);
    fireEvent.keyDown(screen.getByTestId("container"), { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("wraps Tab from the last focusable back to the first", () => {
    render(<Trap />);
    const container = screen.getByTestId("container");
    const buttons = screen.getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    last.focus();
    expect(document.activeElement).toBe(last);
    fireEvent.keyDown(container, { key: "Tab" });
    expect(document.activeElement).toBe(first);
  });

  it("wraps shift+Tab from the first focusable to the last", () => {
    render(<Trap />);
    const container = screen.getByTestId("container");
    const buttons = screen.getAllByRole("button");
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    first.focus();
    fireEvent.keyDown(container, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("wraps shift+Tab from the container itself to the last", () => {
    render(<Trap />);
    const container = screen.getByTestId("container");
    const last = screen.getAllByRole("button").slice(-1)[0];
    container.focus();
    fireEvent.keyDown(container, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("ignores non-Tab, non-Escape keys without preventing default", () => {
    render(<Trap />);
    const container = screen.getByTestId("container");
    const result = fireEvent.keyDown(container, { key: "a" });
    // unhandled keys are not consumed by the trap
    expect(result).toBe(true);
  });

  it("restores focus to the previously focused element on unmount", () => {
    const outside = document.createElement("button");
    outside.textContent = "outside";
    document.body.appendChild(outside);
    outside.focus();
    expect(document.activeElement).toBe(outside);

    const { unmount } = render(<Trap />);
    expect(document.activeElement).not.toBe(outside);

    unmount();
    expect(document.activeElement).toBe(outside);

    document.body.removeChild(outside);
  });
});
