import { useState } from "react";

const R = 28;

const NODES = {
  I: { name: "IT Building", x: 300, y: 40 },
  A: { name: "Aula", x: 110, y: 120 },
  M: { name: "Merensky", x: 490, y: 120 },
  P: { name: "Piazza", x: 300, y: 200 },
};

const EDGES = [
  { id: 1, from: "I", to: "A", w: 4 },
  { id: 2, from: "A", to: "P", w: 5 },
  { id: 3, from: "I", to: "M", w: 2 },
  { id: 4, from: "M", to: "P", w: 8 },
  { id: 5, from: "I", to: "P", w: 12 },
];

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
      />
      {label}
    </label>
  );
}

export default function EdgeExplorer({ allowWeights = true, allowDirections = true }) {
  const [weighted, setWeighted] = useState(false);
  const [directed, setDirected] = useState(false);
  const [picked, setPicked] = useState(null);

  const describe = (e) => {
    const link = directed ? "→" : "–";
    let text = `Edge ${e.from} ${link} ${e.to}: joins ${NODES[e.from].name} (${e.from}) and ${NODES[e.to].name} (${e.to})`;
    text += weighted ? `, with a walking time of ${e.w} minutes. ` : ". ";
    text += directed
      ? `You can only travel from ${e.from} to ${e.to}.`
      : "You can travel either way.";
    return text;
  };

  return (
    <div>
      {(allowWeights || allowDirections) && (
        <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2">
          {allowWeights && <Toggle label="Show weights" checked={weighted} onChange={setWeighted} />}
          {allowDirections && (
            <Toggle label="Show directions" checked={directed} onChange={setDirected} />
          )}
        </div>
      )}

      <svg
        viewBox="0 0 600 250"
        className="w-full rounded-lg border border-slate-300 bg-white"
        role="group"
        aria-label="Graph of four campus vertices. Select an edge to inspect it."
      >
        <defs>
          <marker id="edge-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
          <marker id="edge-arrow-active" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#4f46e5" />
          </marker>
        </defs>

        {/* Edges */}
        {EDGES.map((e) => {
          const a = NODES[e.from];
          const b = NODES[e.to];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          // Stop the line at the circle edge so arrowheads are visible
          const x2 = directed ? b.x - ux * (R + 4) : b.x;
          const y2 = directed ? b.y - uy * (R + 4) : b.y;
          const active = picked?.id === e.id;

          return (
            <g
              key={e.id}
              onClick={() => setPicked(e)}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-pressed={active}
              aria-label={`Edge between ${e.from} and ${e.to}`}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                  ev.preventDefault();
                  setPicked(e);
                }
              }}
            >
              {/* Wide invisible line = easier to click */}
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="22" />
              <line
                x1={a.x} y1={a.y} x2={x2} y2={y2}
                stroke={active ? "#4f46e5" : "#94a3b8"}
                strokeWidth={active ? 5 : 2.5}
                strokeLinecap="round"
                markerEnd={directed ? `url(#${active ? "edge-arrow-active" : "edge-arrow"})` : undefined}
              />
            </g>
          );
        })}

        {/* Weight labels (drawn after edges so they sit on top) */}
        {weighted &&
          EDGES.map((e) => {
            const a = NODES[e.from];
            const b = NODES[e.to];
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const active = picked?.id === e.id;
            return (
              <g key={"w" + e.id} pointerEvents="none">
                <rect
                  x={mx - 17} y={my - 12} width="34" height="24" rx="7"
                  fill="#ffffff" stroke={active ? "#4f46e5" : "#94a3b8"} strokeWidth="1.5"
                />
                <text
                  x={mx} y={my + 5} textAnchor="middle" fontSize="14" fontWeight="700"
                  fill={active ? "#312e81" : "#475569"}
                >
                  {e.w}
                </text>
              </g>
            );
          })}

        {/* Vertices */}
        {Object.entries(NODES).map(([k, p]) => (
          <g key={k} pointerEvents="none">
            <circle cx={p.x} cy={p.y} r={R} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
            <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#312e81">
              {k}
            </text>
          </g>
        ))}
      </svg>

      <p className="anim-note mt-3" aria-live="polite">
        {picked ? describe(picked) : "Click an edge to inspect it."}
      </p>
    </div>
  );
}