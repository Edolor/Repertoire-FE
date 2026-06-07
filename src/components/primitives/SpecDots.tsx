"use client";

import { useEffect, useRef } from "react";

/**
 * Low-density drifting "spec dots" on a canvas — ambient depth behind the hero.
 * Accent-tinted (recolors per theme), in-view gated (rAF pauses offscreen),
 * static under reduced-motion, and not drawn at all under reduced-data.
 */
export function SpecDots({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.matchMedia("(prefers-reduced-data: reduce)").matches) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const N = 38;
    const dots: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];

    const init = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots.length = 0;
      for (let i = 0; i < N; i++)
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.3 + 0.4,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          a: Math.random() * 0.35 + 0.08,
        });
    };
    init();

    const rgb = () =>
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim()
        .split(/\s+/)
        .join(",") || "245,78,0";

    let raf = 0;
    let visible = true;
    const draw = () => {
      raf = 0;
      ctx.clearRect(0, 0, w, h);
      const c = rgb();
      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x += w;
          if (d.x > w) d.x -= w;
          if (d.y < 0) d.y += h;
          if (d.y > h) d.y -= h;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c},${d.a})`;
        ctx.fill();
      }
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };
    draw();

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !reduced && !raf) raf = requestAnimationFrame(draw);
        else if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    const onResize = () => {
      init();
      if (!raf) draw();
    };
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
