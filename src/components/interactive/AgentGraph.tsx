"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Hero centerpiece: a blueprint of the system primitives the owner builds, with
 * a data packet continuously "running the loop" around them. On-brand for the
 * engineering-spec aesthetic (SVG, 1px lines, mono labels, theme-aware via
 * currentColor/accent tokens) and ~zero bundle cost vs. a 3D engine.
 *
 * prefers-reduced-motion → a static, fully-drawn graph (equally legible, no
 * packet, no glow animation). The rAF loop is gated to in-view only.
 */

const W = 340;
const H = 226;
const CX = W / 2;
const CY = H / 2 + 2;
const R = 92;

// The real primitives, as ring nodes. Order = the loop the packet traces.
const NODES = [
  { label: "orchestration", short: "orch" },
  { label: "tool execution", short: "tools" },
  { label: "MCP", short: "mcp" },
  { label: "runtime", short: "runtime" },
  { label: "memory", short: "memory" },
];

// Pentagon vertices, first node at top.
const PTS = NODES.map((_, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / NODES.length;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function AgentGraph() {
  const reduced = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  // phase ∈ [0, N): integer part = current edge, fraction = progress along it.
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    let inView = true;
    let t = 0;
    let acc = 0;
    const loop = (now: number) => {
      const delta = last ? now - last : 16;
      last = now;
      // ~5.6s per full loop; smooth and unhurried.
      t = (t + delta / 1000 / 1.12) % NODES.length;
      // Cap React re-renders to ~30fps — plenty for this slow ambient loop,
      // and halves the per-frame SVG re-render cost.
      acc += delta;
      if (acc >= 33) {
        acc = 0;
        setPhase(t);
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView && !raf) {
          last = 0;
          raf = requestAnimationFrame(loop);
        } else if (!inView && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const seg = Math.floor(phase) % NODES.length;
  const frac = phase - Math.floor(phase);
  const from = PTS[seg];
  const to = PTS[(seg + 1) % NODES.length];
  const packet = reduced
    ? PTS[0]
    : { x: lerp(from.x, to.x, frac), y: lerp(from.y, to.y, frac) };

  // A node is "hot" briefly as the packet arrives at / leaves it.
  const heat = (i: number) => {
    if (reduced) return i === 0 ? 1 : 0;
    // distance in phase space to this node (it sits at integer index i,
    // the packet "arrives" at node (seg+1) as frac→1).
    const arriving = (seg + 1) % NODES.length;
    if (i === arriving) return Math.max(0, frac - 0.4) / 0.6; // ramps up on arrival
    if (i === seg) return Math.max(0, 0.5 - frac) / 0.5; // fades as it leaves
    return 0;
  };

  return (
    <div className="panel relative w-full overflow-hidden border border-divider bg-surface">
      <div className="flex items-center justify-between border-b border-divider px-3 py-2 font-mono text-[11px] text-text/50">
        <span>system.graph</span>
        <span aria-hidden>{reduced ? "static" : "running"}</span>
      </div>
      <div className="graph-paper p-2">
        <svg
          ref={ref}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label="A graph of the agent system primitives — orchestration, tool execution, MCP, runtime, and memory — connected in a loop."
        >
          {/* edges */}
          {PTS.map((p, i) => {
            const q = PTS[(i + 1) % NODES.length];
            const active = !reduced && i === seg;
            return (
              <line
                key={`e${i}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke="currentColor"
                className={active ? "text-accent" : "text-text/20"}
                strokeWidth={active ? 1.4 : 1}
                strokeDasharray="2 4"
              />
            );
          })}

          {/* center hub + spokes (faint, structural) */}
          {PTS.map((p, i) => (
            <line
              key={`s${i}`}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              className="text-text/10"
              strokeWidth={1}
            />
          ))}
          <circle cx={CX} cy={CY} r={3} className="fill-text/30" />

          {/* nodes */}
          {PTS.map((p, i) => {
            const h = heat(i);
            return (
              <g key={`n${i}`}>
                {h > 0.02 && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={9 + h * 9}
                    className="fill-accent"
                    style={{ opacity: h * 0.18 }}
                  />
                )}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  stroke="currentColor"
                  strokeWidth={1.4}
                  className={h > 0.3 ? "fill-accent text-accent" : "fill-bg text-text/45"}
                  style={{ transition: "none" }}
                />
                <text
                  x={p.x}
                  y={p.y + (p.y < CY ? -12 : 18)}
                  textAnchor="middle"
                  className={h > 0.3 ? "fill-accent font-mono" : "fill-text/60 font-mono"}
                  style={{ fontSize: 9, letterSpacing: 0.3 }}
                >
                  {NODES[i].short}
                </text>
              </g>
            );
          })}

          {/* the data packet */}
          {!reduced && (
            <>
              <circle cx={packet.x} cy={packet.y} r={6} className="fill-accent" style={{ opacity: 0.22 }} />
              <circle cx={packet.x} cy={packet.y} r={2.6} className="fill-accent" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
