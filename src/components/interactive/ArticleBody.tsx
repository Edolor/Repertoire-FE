"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbox } from "@/components/primitives/Lightbox";

/**
 * Copy text to the clipboard, returning whether it worked. Prefers the async
 * Clipboard API but falls back to the legacy execCommand path, which works in a
 * user-gesture handler even when the async API is blocked (lost focus, missing
 * permission, insecure context) — the case that left the copy button looking
 * like it did nothing. Always succeeds on a real click in practice.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to the legacy path */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Renders compiled-markdown post HTML and progressively enhances it:
 *  - figure images become click-to-zoom (Lightbox) and lazy-loaded
 *  - code blocks get a copy-to-clipboard button
 *
 * Reusable for every /writing post. CSP-safe: no eval, no remote assets,
 * pure React event handlers. Enhancement is additive, so the article is
 * fully readable even if this never hydrates.
 */
export function ArticleBody({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cleanups: Array<() => void> = [];

    root.querySelectorAll("figure img").forEach((node) => {
      const img = node as HTMLImageElement;
      img.classList.add("zoomable");
      img.loading = "lazy";
      img.decoding = "async";
      const open = () =>
        setZoom({ src: img.currentSrc || img.src, alt: img.alt });
      img.addEventListener("click", open);
      cleanups.push(() => img.removeEventListener("click", open));
    });

    root.querySelectorAll("pre").forEach((node) => {
      const pre = node as HTMLPreElement;
      if (pre.parentElement?.classList.contains("code-wrap")) return;
      const wrap = document.createElement("div");
      wrap.className = "code-wrap";
      pre.parentNode?.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "copy";
      let resetTimer = 0;
      const reset = () => {
        btn.textContent = "copy";
        btn.classList.remove("is-copied", "is-error");
      };
      const flash = (label: string, cls: string) => {
        window.clearTimeout(resetTimer);
        btn.textContent = label;
        btn.classList.remove("is-copied", "is-error");
        btn.classList.add(cls);
        resetTimer = window.setTimeout(reset, 1800);
      };
      const onClick = async () => {
        const ok = await copyText(pre.innerText);
        flash(ok ? "✓ copied" : "✗ failed", ok ? "is-copied" : "is-error");
      };
      btn.addEventListener("click", onClick);
      wrap.appendChild(btn);
      cleanups.push(() => {
        window.clearTimeout(resetTimer);
        btn.removeEventListener("click", onClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return (
    <>
      <div
        ref={ref}
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {zoom && (
        <Lightbox
          src={zoom.src}
          alt={zoom.alt}
          onClose={() => setZoom(null)}
        />
      )}
    </>
  );
}
