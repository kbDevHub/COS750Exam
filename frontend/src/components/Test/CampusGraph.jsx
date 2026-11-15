import { CAMPUS_GRAPH } from "../../data/testGraphs.js";

/**
 * Undirected, weighted graph of University of Pretoria campuses.
 * The data lives in src/data/testGraphs2.js (CAMPUS_GRAPH).
 *
 * Props (all optional, default to CAMPUS_GRAPH):
 *  nodes    { name: [x, y, labelPosition] }
 *  edges    [[from, to, km]]
 *  viewBox  drawing size
 */

const R = 9;

const LABEL = {
  above: { dx: 0, dy: -17, anchor: "middle" },
  below: { dx: 0, dy: 22, anchor: "middle" },
  left: { dx: -16, dy: 0, anchor: "end" },
  right: { dx: 16, dy: 0, anchor: "start" },
};

export default function CampusGraph({
  nodes = CAMPUS_GRAPH.nodes,
  edges = CAMPUS_GRAPH.edges,
  viewBox = CAMPUS_GRAPH.viewBox,
}) {
  return (
    <figure className="m-0">
      <svg viewBox={viewBox} className="w-full max-w-xl" aria-hidden="true">
        {edges.map(([a, b, km]) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          const len = Math.hypot(x2 - x1, y2 - y1);
          const ux = (x2 - x1) / len;
          const uy = (y2 - y1) / len;
          // label sits beside the midpoint, pushed off the line
          const lx = (x1 + x2) / 2 - uy * 11;
          const ly = (y1 + y2) / 2 + ux * 11;
          return (
            <g key={`${a}-${b}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="2" />
              <text x={lx} y={ly} fontSize="12" textAnchor="middle"
                    dominantBaseline="central" fill="#1e293b"
                    stroke="#fff" strokeWidth="3" paintOrder="stroke">
                {km} km
              </text>
            </g>
          );
        })}

        {Object.entries(nodes).map(([name, [x, y, pos]]) => {
          const l = LABEL[pos] ?? LABEL.below;
          return (
            <g key={name}>
              <circle cx={x} cy={y} r={R} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.5" />
              <text x={x + l.dx} y={y + l.dy} fontSize="14" fontWeight="600"
                    textAnchor={l.anchor} dominantBaseline="central" fill="#0f172a">
                {name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="sr-only">
        <p>
          Graph of {Object.keys(nodes).length} University of Pretoria campuses:{" "}
          {Object.keys(nodes).join(", ")}. Each connection works in both
          directions and the weight is the approximate distance in kilometres.
          Connections:
        </p>
        <ul>
          {edges.map(([a, b, km]) => (
            <li key={`${a}-${b}`}>{a} to {b}, {km} km</li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-2 text-sm text-slate-500">
        Each line works in both directions. Distances are approximate.
      </figcaption>
    </figure>
  );
}