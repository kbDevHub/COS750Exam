import { useState } from "react";

const R = 28;

const NODES = {
  I: { name: "IT Building", x: 300, y: 40 },
  A: { name: "Aula", x: 110, y: 120 },
  M: { name: "Merensky", x: 490, y: 120 },
  P: { name: "Piazza", x: 300, y: 200 },
};

const EDGES = [
  { from: "I", to: "A", w: 4 },
  { from: "A", to: "P", w: 5 },
  { from: "I", to: "M", w: 2 },
  { from: "M", to: "P", w: 8 },
  { from: "I", to: "P", w: 12 },
];

const ORDER = ["I", "A", "M", "P"];

const weightOf = (a, b) =>
  EDGES.find((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a))?.w ?? 0;

export default function AdjacencyExplorer() {
  const [picked, setPicked] = useState(null);

  const isOn = (a, b) =>
    !!picked && ((picked[0] === a && picked[1] === b) || (picked[0] === b && picked[1] === a));

  const describe = () => {
    if (!picked) return "Click an edge in the graph or a cell in the matrix.";
    const [r, c] = picked;
    const w = weightOf(r, c);
    if (r === c) return `Row ${r}, column ${c} is 0. A vertex has no edge to itself.`;
    if (!w) return `Row ${r}, column ${c} is 0, so there is no edge between ${NODES[r].name} and ${NODES[c].name}.`;
    return `Row ${r}, column ${c} is ${w}: ${NODES[r].name} and ${NODES[c].name} are joined by an edge with a walking time of ${w} minutes. Row ${c}, column ${r} is also ${w}, because you can walk either way.`;
  };

  return (
    <div>
      <div className="grid items-center gap-6 md:grid-cols-2">
        <svg
          viewBox="0 0 600 250"
          className="w-full rounded-lg border border-slate-300 bg-white"
          role="group"
          aria-label="Graph of four campus vertices: I, A, M and P, with walking times on the edges. Select an edge to find it in the matrix."
        >
          {EDGES.map((e) => {
            const a = NODES[e.from];
            const b = NODES[e.to];
            const active = isOn(e.from, e.to);
            return (
              <g
                key={e.from + e.to}
                onClick={() => setPicked([e.from, e.to])}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-pressed={active}
                aria-label={`Edge between ${e.from} and ${e.to}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setPicked([e.from, e.to]);
                  }
                }}
              >
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="22" />
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={active ? "#4f46e5" : "#94a3b8"}
                  strokeWidth={active ? 5 : 2.5}
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {EDGES.map((e) => {
            const a = NODES[e.from];
            const b = NODES[e.to];
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            return (
              <g key={"w" + e.from + e.to} pointerEvents="none">
                <rect x={mx - 17} y={my - 12} width="34" height="24" rx="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" />
                <text x={mx} y={my + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">
                  {e.w}
                </text>
              </g>
            );
          })}

          {Object.entries(NODES).map(([k, p]) => (
            <g key={k} pointerEvents="none">
              <circle cx={p.x} cy={p.y} r={R} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
              <text x={p.x} y={p.y + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#312e81">
                {k}
              </text>
            </g>
          ))}
        </svg>

        <table className="mx-auto border-collapse text-center">
          <caption className="sr-only">Adjacency matrix of the campus graph. 0 means no edge.</caption>
          <thead>
            <tr>
              <th className="p-2" />
              {ORDER.map((c) => (
                <th key={c} scope="col" className="h-11 w-12 border-b-2 border-slate-400 font-semibold text-slate-900">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDER.map((r) => (
              <tr key={r}>
                <th scope="row" className="h-11 w-12 border-r-2 border-slate-400 font-semibold text-slate-900">
                  {r}
                </th>
                {ORDER.map((c) => {
                  const w = weightOf(r, c);
                  const on = isOn(r, c);
                  return (
                    <td key={c} className="border border-slate-200 p-0">
                      <button
                        onClick={() => setPicked([r, c])}
                        aria-pressed={on}
                        aria-label={`Row ${r}, column ${c}: ${w}`}
                        className={
                          "h-11 w-12 " +
                          (on
                            ? "bg-indigo-600 font-bold text-white"
                            : w
                              ? "bg-indigo-50 font-semibold text-indigo-900 hover:bg-indigo-100"
                              : "text-slate-400 hover:bg-slate-100")
                        }
                      >
                        {w}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="anim-note mt-3" aria-live="polite">
        {describe()}
      </p>
    </div>
  );
}
