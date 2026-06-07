import { describe, it, expect, vi, beforeEach } from "vitest";
import { TOAST_EVENT, showToast, type ToastDetail } from "@/lib/toast";

describe("toast", () => {
  it("exports the expected event name", () => {
    expect(TOAST_EVENT).toBe("ui-toast");
  });

  it("dispatches a CustomEvent on window with the message in detail", () => {
    const received: ToastDetail[] = [];
    const handler = (e: Event) => received.push((e as CustomEvent<ToastDetail>).detail);
    window.addEventListener(TOAST_EVENT, handler);

    showToast("Saved!");

    window.removeEventListener(TOAST_EVENT, handler);
    expect(received).toHaveLength(1);
    expect(received[0].message).toBe("Saved!");
    expect(typeof received[0].id).toBe("number");
  });

  it("emits a real CustomEvent of the correct type", () => {
    let captured: Event | null = null;
    const handler = (e: Event) => (captured = e);
    window.addEventListener(TOAST_EVENT, handler);

    showToast("hi");

    window.removeEventListener(TOAST_EVENT, handler);
    expect(captured).toBeInstanceOf(CustomEvent);
    expect((captured as unknown as Event).type).toBe(TOAST_EVENT);
  });

  it("gives multiple toasts distinct ids", () => {
    const ids: number[] = [];
    const handler = (e: Event) => ids.push((e as CustomEvent<ToastDetail>).detail.id);
    window.addEventListener(TOAST_EVENT, handler);

    showToast("one");
    showToast("two");
    showToast("three");

    window.removeEventListener(TOAST_EVENT, handler);
    expect(ids).toHaveLength(3);
    expect(new Set(ids).size).toBe(3);
  });

  it("preserves the exact message string (including empty)", () => {
    const messages: string[] = [];
    const handler = (e: Event) => messages.push((e as CustomEvent<ToastDetail>).detail.message);
    window.addEventListener(TOAST_EVENT, handler);

    showToast("");
    showToast("  spaced  ");

    window.removeEventListener(TOAST_EVENT, handler);
    expect(messages).toEqual(["", "  spaced  "]);
  });

  describe("SSR safety (window undefined)", () => {
    beforeEach(() => {
      // Make `typeof window === "undefined"` true for the guard branch.
      vi.stubGlobal("window", undefined);
    });

    it("does not throw when window is undefined", () => {
      expect(() => showToast("ssr")).not.toThrow();
    });

    it("returns undefined without dispatching when window is undefined", () => {
      expect(showToast("ssr")).toBeUndefined();
    });
  });
});
