import { useState } from "react";

//maps nodes to position
const NODES = {A:{x:60, y:60}, B:{x:260, y:60}, C:{x:60, y:190}, D:{x:260, y:190}};
const EDGES =
[
    {id: 1, from: "A", to: "B", w:4 },
    {id: 2, from: "A", to: "C", w:2 },
    {id: 3, from: "B", to: "D", w:5 },
    {id: 4, from: "C", to: "D", w:8 },
]
export default function EdgeExplorer({
allowWeights = true,
allowDirections = true,
})
{


const [weighted, setWeighted] = useState(false);
const [directed, setDirected]= useState(false);
const [picked, setPicked]= useState(null);

const R = 18;

return (
<div>
  <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2 text-slate-700">
    {allowWeights && (
    <label className="flex cursor-pointer items-center gap-2">
    <input type="checkbox" className="h-4 w-4 accent-indigo-600" checked={weighted} onChange={(e) => setWeighted(e.target.checked)} /> Show weights</label>)}
    {allowDirections && (
    <label className="flex cursor-pointer items-center gap-2">
    <input type="checkbox" className="h-4 w-4 accent-indigo-600" checked={directed} onChange={(e) => setDirected(e.target.checked)} /> Show directions</label> )}
  </div>

  <svg viewBox="0 0 320 250" className="w-full rounded-lg border border-slate-300 bg-white " onClick={()=>setPicked(null)}>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,0 L8,4 L0,8 z" fill="#94a3b8" />
    </marker>
  </defs>

  {EDGES.map((e) => {
  const a = NODES[e.from], b = NODES[e.to];
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
  const x2 = b.x - (dx / len) * (directed ? R + 4 : 0);
  const y2 = b.y - (dy / len) * (directed ? R + 4 : 0);
  const active = picked?.id === e.id;
  return (
  <g
    key={e.id}
    onClick={(ev) => {
        ev.stopPropagation();
        setPicked(e);
    }}
    className="cursor-pointer"
  >
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="16" />
  <line x1={a.x} y1={a.y} x2={x2} y2={y2}
  stroke={active ? "#4f46e5" : "#94a3b8"} strokeWidth={active ? 4 : 2.5}
  markerEnd={directed ? "url(#arrow)" : undefined} />
  {weighted && (
  <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} textAnchor="middle" fontSize="14" fontWeight="600" fill="#d97706">{e.w}</text>
                )}
  </g>
            );
          })}

  {Object.entries(NODES).map(([name, p]) => (
  <g key={name}>
  <circle cx={p.x} cy={p.y} r={R} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2" />
  <text x={p.x} y={p.y + 5} textAnchor="middle" fill="#312e81" fontSize="14" fontWeight="700">{name}</text>
  </g>
          ))}
  </svg>

  <p className="mt-3 min-h-10 text-slate-700">
  {picked
  ? `Edge ${picked.from}${directed ? " → " : " – "}${picked.to}: joins ${picked.from} and ${picked.to}` +
              (weighted ? `, with cost ${picked.w}.` : ".") +
              (directed ? ` You can only travel from ${picked.from} to ${picked.to}.` : " You can travel either way.")
  : "Click an edge to inspect it."}
  </p>
</div>
  );
}
