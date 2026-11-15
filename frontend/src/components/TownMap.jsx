import { TOWN_VERTICES, TOWN_EDGES, ROUTE_STYLES, vertexById } from "../data/shortestPathTown";

const R = 24;


const edgeKey = (a, b) => [a, b].sort().join("-");

const pathEdges = (path) => path.slice(1).map((v, i) => edgeKey(path[i], v));

export default function TownMap({
  highlights = [],
  current = null,
  inRoute = [],
  clickable = () => false,
  onVertexClick = () => {},
  ariaLabel = "Town map: an ambulance depot, five junctions and a hospital joined by roads with driving times",
}) {
  const vertexLabel = (v) => {
    let text = `${v.name}${v.id.length === 1 && v.short ? ` (${v.id})` : ""}`;
    if (v.id === current) text += ", the ambulance is here";
    else if (inRoute.includes(v.id)) text += ", already on your route";
    if (clickable(v.id)) text += `. Press to drive to ${v.short ?? v.id}`;
    return text;
  };

  return (
    <svg
      viewBox="0 0 700 320"
      className="w-full rounded-lg border border-slate-300 bg-white"
      role="group"
      aria-label={ariaLabel}
    >
      {/* Plain roads */}
      {TOWN_EDGES.map((e) => {
        const a = vertexById(e.from);
        const b = vertexById(e.to);
        return (
          <line
            key={`road-${e.from}-${e.to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="#cbd5e1"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}

      {/* Highlighted routes, drawn over the roads */}
      {highlights.map(({ path, kind }) => {
        const s = ROUTE_STYLES[kind];
        const keys = pathEdges(path);
        return TOWN_EDGES.filter((e) => keys.includes(edgeKey(e.from, e.to))).map((e) => {
          const a = vertexById(e.from);
          const b = vertexById(e.to);
          return (
            <line
              key={`${kind}-${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={s.stroke}
              strokeWidth={s.width}
              strokeDasharray={s.dash}
              strokeLinecap="round"
            />
          );
        });
      })}

      {/* Driving times */}
      {TOWN_EDGES.map((e) => {
        const a = vertexById(e.from);
        const b = vertexById(e.to);
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return (
          <g key={`w-${e.from}-${e.to}`} aria-hidden="true">
            <rect x={mx - 15} y={my - 12} width="30" height="22" rx="5" fill="#ffffff" stroke="#e2e8f0" />
            <text x={mx} y={my + 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0f172a">
              {e.w}
            </text>
          </g>
        );
      })}

      {/* Vertices */}
      {TOWN_VERTICES.map((v) => {
        const isCurrent = v.id === current;
        const isOn = inRoute.includes(v.id);
        const canClick = clickable(v.id);
        const isEnd = v.id === "S" || v.id === "H";

        const fill = isCurrent ? "#d1fae5" : isOn ? "#ecfdf5" : isEnd ? "#eef2ff" : "#f8fafc";
        const stroke = isCurrent || isOn ? "#059669" : canClick ? "#4f46e5" : "#64748b";

        const act = () => canClick && onVertexClick(v.id);

        return (
          <g
            key={v.id}
            role={canClick ? "button" : "img"}
            tabIndex={canClick ? 0 : undefined}
            aria-label={vertexLabel(v)}
            className={canClick ? "cursor-pointer focus:outline-none" : undefined}
            onClick={act}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                act();
              }
            }}
          >
            {/* A dashed ring marks the places you can drive to next */}
            {canClick && (
              <circle cx={v.x} cy={v.y} r={R + 7} fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 4" />
            )}
            <circle
              cx={v.x}
              cy={v.y}
              r={R}
              fill={fill}
              stroke={stroke}
              strokeWidth={isCurrent ? 5 : 2.5}
            />
            <text
              x={v.x}
              y={v.y + 6}
              textAnchor="middle"
              fontSize="17"
              fontWeight="700"
              fill="#1e1b4b"
              aria-hidden="true"
            >
              {v.id === "S" ? "🚑" : v.id === "H" ? "🏥" : v.id}
            </text>
            {isEnd && (
              <text
                x={v.x}
                y={v.y + R + 20}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill="#1e293b"
                aria-hidden="true"
              >
                {v.short} ({v.id})
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
