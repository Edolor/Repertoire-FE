export const TOAST_EVENT = "ui-toast";

export type ToastDetail = { id: number; message: string };

/** Fire a transient toast from anywhere on the client. */
export function showToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: Date.now() + Math.random(), message },
    }),
  );
}
