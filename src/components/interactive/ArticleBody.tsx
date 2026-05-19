"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbox } from "@/components/primitives/Lightbox";

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
        try {
          await navigator.clipboard.writeText(pre.innerText);
          flash("✓ copied", "is-copied");
        } catch {
          flash("✗ failed", "is-error");
        }
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
