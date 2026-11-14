// Directed, weighted graph drawing shared by DijkstraTable and DijkstraTrace.
// Props: nodes { name: [x, y] }, edges [[from, to, weight]], source, viewBox,
//   altList (default true): add a screen-reader-only list of the edges. Pass false
//   when the page already shows the edges as visible text next to the diagram.

const R = 16; // node radius

export default function GraphDiagram({ nodes, edges, source, viewBox = "0 0 430 310", altList = true }) {
  return (
    <>
    <svg viewBox={viewBox} className="w-full max-w-lg" aria-hidden="true">
      <defs>
        <marker id="dj-arrow" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#475569" />
        </marker>
      </defs>

      {edges.map(([a, b, w]) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ux = (x2 - x1) / len;
        const uy = (y2 - y1) / len;
        const sx = x1 + ux * R, sy = y1 + uy * R;
        const ex = x2 - ux * (R + 2), ey = y2 - uy * (R + 2);
        // label sits beside the midpoint, pushed off the line
        const lx = (x1 + x2) / 2 - uy * 11;
        const ly = (y1 + y2) / 2 + ux * 11;
        return (
          <g key={`${a}-${b}`}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#475569"
                  strokeWidth="1.5" markerEnd="url(#dj-arrow)" />
            <text x={lx} y={ly} fontSize="12" textAnchor="middle"
                  dominantBaseline="central" fill="#1e293b"
                  stroke="#fff" strokeWidth="3" paintOrder="stroke">
              {w}
            </text>
          </g>
        );
      })}

      {Object.entries(nodes).map(([name, [x, y]]) => (
        <g key={name}>
          <circle cx={x} cy={y} r={R}
                  fill={name === source ? "#e0e7ff" : "#fff"}
                  stroke={name === source ? "#4f46e5" : "#334155"}
                  strokeWidth="2" />
          <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                fontSize="14" fontWeight="600" fill="#0f172a">
            {name}
          </text>
        </g>
      ))}
    </svg>
    {altList && (
      <div className="sr-only">
        <p>
          Directed weighted graph with vertices {Object.keys(nodes).join(", ")}.
          {source ? ` The source vertex is ${source}.` : ""} Edges:
        </p>
        <ul>
          {edges.map(([a, b, w]) => (
            <li key={`${a}-${b}`}>{a} to {b}, weight {w}</li>
          ))}
        </ul>
      </div>
    )}
    </>
  );
}