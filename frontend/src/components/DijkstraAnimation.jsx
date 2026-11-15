import { useState, useEffect, useMemo } from "react";
import { dijkstraSteps } from "../utils/dijkstraSteps";
import { nodes, edges, START, TARGET } from "../data/exampleGraph";

const R = 28;
const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));
const fmt = (d) => (d === Infinity ? "∞" : d);

const same = (a, b) =>
  (a.from === b.from && a.to === b.to) || (a.from === b.to && a.to === b.from);

function pathEdges(prev, target) {
  const out = [];
  let v = target;
  while (prev[v]) {
    out.push({ from: prev[v], to: v });
    v = prev[v];
  }
  return out;
}

function LegendDot({ className, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded-full border ${className}`} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function DijkstraAnimation() {
  const steps = useMemo(() => dijkstraSteps(nodes, edges, START), []);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  const s = steps[i];
  const prevStep = i > 0 ? steps[i - 1] : null;
  const last = i === steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI((n) => n + 1), 1500);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  const finalPath = last ? pathEdges(s.prev, TARGET) : [];
  const onFinalPath = (e) => finalPath.some((p) => same(p, e));
  const improved = (id) => prevStep && s.dist[id] < prevStep.dist[id];

  const togglePlay = () => {
    if (!playing && last) setI(0);
    setPlaying((p) => !p);
  };

  const nodeStyle = (id) => {
    if (id === s.current) return { fill: "#fde68a", stroke: "#d97706", text: "#78350f" };
    if (s.visited.includes(id)) return { fill: "#d1fae5", stroke: "#059669", text: "#064e3b" };
    return { fill: "#f8fafc", stroke: "#64748b", text: "#1e293b" };
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
        <LegendDot className="border-amber-600 bg-amber-200" label="Being processed" />
        <LegendDot className="border-emerald-600 bg-emerald-100" label="Visited (distance is final)" />
        <LegendDot className="border-slate-500 bg-slate-50" label="Not visited yet" />
        <span>Numbers on edges = walking minutes. Numbers beside circles = best distance from {START} so far.</span>
      </div>

      <svg
        viewBox="0 0 600 300"
        className="w-full rounded-lg border border-slate-300 bg-white"
        role="img"
        aria-label={`Dijkstra animation, step ${i + 1} of ${steps.length}. ${s.note}`}
      >
        {edges.map((e, k) => {
          const a = pos[e.from];
          const b = pos[e.to];
          const active = s.edge === e;
          const final = onFinalPath(e);
          const stroke = final ? "#059669" : active ? "#4f46e5" : "#cbd5e1";
          return (
            <line
              key={k}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={stroke}
              strokeWidth={active || final ? 5 : 2}
              strokeLinecap="round"
            />
          );
        })}

        {edges.map((e, k) => {
          const a = pos[e.from];
          const b = pos[e.to];
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const active = s.edge === e;
          const final = onFinalPath(e);
          const accent = final ? "#059669" : active ? "#4f46e5" : "#94a3b8";
          return (
            <g key={"w" + k}>
              <rect x={mx - 17} y={my - 12} width="34" height="24" rx="7" fill="#ffffff" stroke={accent} strokeWidth="1.5" />
              <text x={mx} y={my + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={active || final ? "#1e1b4b" : "#475569"}>
                {e.w}
              </text>
            </g>
          );
        })}

        {nodes.map((n) => {
          const c = nodeStyle(n.id);
          const upd = improved(n.id);
          const px = n.x;
          const py = n.y + n.labelDy;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={R} fill={c.fill} stroke={c.stroke} strokeWidth="3" />
              <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill={c.text}>
                {n.id}
              </text>
              <rect
                x={px - 24} y={py - 13} width="48" height="26" rx="13"
                fill={upd ? "#e0e7ff" : "#ffffff"}
                stroke={upd ? "#4f46e5" : "#cbd5e1"}
                strokeWidth={upd ? 2 : 1.5}
              />
              <text x={px} y={py + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill={upd ? "#312e81" : "#475569"}>
                {fmt(s.dist[n.id])}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="anim-note mt-3" aria-live="polite">
        {s.note}
        {last && (
          <>
            {" "}
            <strong>
              Shortest path from {START} to {TARGET}:{" "}
              {[...finalPath].reverse().map((p) => p.from).concat(TARGET).join(" → ")} ({fmt(s.dist[TARGET])} minutes).
            </strong>
          </>
        )}
      </p>

      <div className="anim-controls">
        <button className="anim-btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
          Back
        </button>
        <button className="anim-btn anim-btn-primary" onClick={togglePlay}>
          {playing ? "Pause" : last ? "Replay" : "Play"}
        </button>
        <button
          className="anim-btn"
          onClick={() => setI(Math.min(steps.length - 1, i + 1))}
          disabled={last}
        >
          Next
        </button>
        <button
          className="anim-btn anim-btn-secondary"
          onClick={() => { setI(0); setPlaying(false); }}
          disabled={i === 0}
        >
          Reset
        </button>
        <span className="anim-step">Step {i + 1} / {steps.length}</span>
      </div>
    </div>
  );
}