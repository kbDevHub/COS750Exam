import { useState, useEffect } from "react";
import { dijkstraSteps } from "../utils/dijkstraSteps";
import { nodes, edges } from "../data/exampleGraph";


console.log("nodes:", nodes, "edges:", edges);
const steps = dijkstraSteps(nodes, edges, "A");
const pos = Object.fromEntries(nodes.map(n => [n.id, n]));

export default function DijkstraAnimation() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const s = steps[i];

  useEffect(() => {
    if (!playing) return;
    if (i >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setI(i + 1), 1500);
    return () => clearTimeout(t);
  }, [playing, i]);

  const nodeColour = (id) =>
    id === s.current ? "#f59e0b" : s.visited.includes(id) ? "#86efac" : "#e5e7eb";

  return (
    <div>
      <svg viewBox="0 0 420 250" width="100%">
        {edges.map((e, k) => {
          const a = pos[e.from], b = pos[e.to];
          const active = s.edge === e;
          return (
            <g key={k}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke={active ? "#4f46e5" : "#9ca3af"} strokeWidth={active ? 4 : 2} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="13">{e.w}</text>
            </g>
          );
        })}
        {nodes.map(n => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="20" fill={nodeColour(n.id)} stroke="#374151" strokeWidth="2" />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontWeight="bold">{n.id}</text>
            <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="12">
              {s.dist[n.id] === Infinity ? "∞" : s.dist[n.id]}
            </text>
          </g>
        ))}
      </svg>

      <p className="anim-note">{s.note}</p>

        <div className="anim-controls">
        <button className="anim-btn" onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
            Back
        </button>
        <button className="anim-btn anim-btn-primary" onClick={() => setPlaying(!playing)}>
            {playing ? "Pause" : "Play"}
        </button>
        <button className="anim-btn" onClick={() => setI(Math.min(steps.length - 1, i + 1))} disabled={i === steps.length - 1}>
            Next
        </button>
        <button className="anim-btn anim-btn-secondary" onClick={() => { setI(0); setPlaying(false); }}>
            Reset
        </button>
        <span className="anim-step">Step {i + 1} / {steps.length}</span>
        </div>
    </div>
  );
}
