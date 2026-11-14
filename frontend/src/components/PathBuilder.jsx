
import { useState } from "react";

const VERTICES = {
  I: { name: "IT Building", x: 300, y: 40 },
  A: { name: "Aula", x: 110, y: 120 },
  M: { name: "Merensky", x: 490, y: 120 },
  P: { name: "Piazza", x: 300, y: 200 },
};

const EDGES = [
  { a: "I", b: "A", w: 4 },
  { a: "A", b: "P", w: 5 },
  { a: "I", b: "M", w: 2 },
  { a: "M", b: "P", w: 8 },
  { a: "I", b: "P", w: 12 },
];

const TOTAL_PATHS = 3;

const weightOf = (a, b) =>
  EDGES.find(
    (e) =>
      (e.a === a && e.b === b) ||
      (e.a === b && e.b === a)
  )?.w ?? null;

const pathCost = (p) =>
  p.slice(1).reduce((s, v, i) => s + weightOf(p[i], v), 0);

const edgeOnPath = (path, e) =>
  path.some(
    (v, i) =>
      i > 0 &&
      ((path[i - 1] === e.a && v === e.b) ||
        (path[i - 1] === e.b && v === e.a))
  );

const arrow = (p) => p.join(" → ");

export default function PathBuilder() {
  const [path, setPath] = useState([]);
  const [found, setFound] = useState([]);
  const [msg, setMsg] = useState(
    "Start at I, the IT Building."
  );

  const last = path[path.length - 1];
  const complete = last === "P";

  const weights = path
    .slice(1)
    .map((v, i) => weightOf(path[i], v));

  const total = weights.reduce((s, w) => s + w, 0);

  const click = (v) => {
    if (path.length === 0) {
      if (v !== "I") {
        setMsg(
          "Every path here starts at I, the IT Building. Click I first."
        );
        return;
      }

      setPath(["I"]);
      setMsg("Good start. Now click a vertex that is joined to I.");
      return;
    }

    if (complete) {
      setMsg("This path is finished. Use Undo or Start a new path.");
      return;
    }

    if (v === last) return;

    if (path.includes(v)) {
      setMsg(
        `You have already visited ${v}. A path does not revisit vertices.`
      );
      return;
    }

    if (weightOf(last, v) === null) {
      setMsg(
        `There is no edge between ${last} and ${v}. Try a vertex that is joined to ${last}.`
      );
      return;
    }

    const next = [...path, v];
    setPath(next);

    if (v === "P") {
      const cost = pathCost(next);
      const key = next.join("");
      const isNew = !found.some((f) => f.key === key);

      if (isNew) {
        const updated = [...found, { key, path: next, cost }];
        setFound(updated);

        setMsg(
          updated.length === TOTAL_PATHS
            ? "You found all three paths! Compare their costs and their number of edges."
            : `New path found: cost ${cost} minutes. Can you find another?`
        );
      } else {
        setMsg(
          "You have already found that one. Try a different route."
        );
      }
    } else {
      setMsg(
        `Cost so far: ${pathCost(next)} minutes. Keep going to P.`
      );
    }
  };

  const undo = () => {
    setPath((p) => p.slice(0, -1));
    setMsg("Step removed. Choose another vertex.");
  };

  const restart = () => {
    setPath([]);
    setMsg("Start at I, the IT Building.");
  };

  const cheapest = found.length
    ? Math.min(...found.map((f) => f.cost))
    : null;

  return (
    <div>
      <p className="mb-3">
        Build a path from <strong>I</strong> to <strong>P</strong> by
        clicking vertices in order. The numbers are walking minutes.
        Can you find all {TOTAL_PATHS} paths?
      </p>

      <ul className="mb-3 flex flex-wrap gap-2 text-xs text-slate-600">
        {Object.entries(VERTICES).map(([k, v]) => (
          <li
            key={k}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
          >
            <strong>{k}</strong> = {v.name}
          </li>
        ))}
      </ul>

      {/* Graph and controls in the same container */}
      <div className="relative rounded-lg border border-slate-300 bg-white pb-16">

        <svg
          viewBox="0 0 600 250"
          className="w-full"
          role="group"
          aria-label="Weighted graph of four campus vertices. Click vertices to build a path."
        >
          {/* Edges */}
          {EDGES.map((e) => {
            const A = VERTICES[e.a];
            const B = VERTICES[e.b];
            const on = edgeOnPath(path, e);

            return (
              <line
                key={e.a + e.b}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={on ? "#4f46e5" : "#cbd5e1"}
                strokeWidth={on ? 5 : 2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Weight labels */}
          {EDGES.map((e) => {
            const A = VERTICES[e.a];
            const B = VERTICES[e.b];
            const mx = (A.x + B.x) / 2;
            const my = (A.y + B.y) / 2;
            const on = edgeOnPath(path, e);

            return (
              <g key={"w" + e.a + e.b}>
                <rect
                  x={mx - 17}
                  y={my - 12}
                  width="34"
                  height="24"
                  rx="7"
                  fill="#ffffff"
                  stroke={on ? "#4f46e5" : "#94a3b8"}
                  strokeWidth="1.5"
                />
                <text
                  x={mx}
                  y={my + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={on ? "#312e81" : "#475569"}
                >
                  {e.w}
                </text>
              </g>
            );
          })}

          {/* Vertices */}
          {Object.entries(VERTICES).map(([k, v]) => {
            const on = path.includes(k);

            return (
              <g
                key={k}
                onClick={() => click(k)}
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-pressed={on}
                aria-label={`Vertex ${k}, ${v.name}${on ? ", in your path" : ""}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    click(k);
                  }
                }}
              >
                <circle
                  cx={v.x}
                  cy={v.y}
                  r="28"
                  fill={on ? "#4f46e5" : "#f8fafc"}
                  stroke={on ? "#4338ca" : "#64748b"}
                  strokeWidth="2"
                />

                <text
                  x={v.x}
                  y={v.y + 8}
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="700"
                  fill={on ? "#ffffff" : "#1e293b"}
                >
                  {k}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
          <button className="anim-btn" onClick={undo} disabled={path.length === 0}>
            Undo
          </button>

          <button className="anim-btn anim-btn-secondary" onClick={restart} disabled={path.length === 0}>
            Start a new path
          </button>
        </div>

        <span className="absolute bottom-3 right-3 anim-step">
          Paths found: {found.length} / {TOTAL_PATHS}
        </span>
      </div>

      {/* Current path and cost */}
      <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <p>
          <span className="font-semibold text-slate-900">
            Your path:
          </span>{" "}
          {path.length ? arrow(path) : "nothing yet"}
        </p>

        {weights.length > 0 && (
          <p className="mt-1">
            <span className="font-semibold text-slate-900">
              Cost:
            </span>{" "}
            {weights.length > 1
              ? `${weights.join(" + ")} = `
              : ""}
            <strong>{total}</strong> minutes (
            {weights.length} edge
            {weights.length > 1 ? "s" : ""})
          </p>
        )}
      </div>

      <p className="anim-note mt-3" aria-live="polite">
        {msg}
      </p>

      {/* Found paths */}
      {found.length > 0 && (
        <ul className="mt-4 space-y-2">
          {found.map((f) => (
            <li
              key={f.key}
              className={
                "flex flex-wrap items-center gap-x-3 rounded-lg border p-3 text-sm " +
                (f.cost === cheapest && found.length === TOTAL_PATHS
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white")
              }
            >
              <strong>{arrow(f.path)}</strong>

              <span>{f.cost} minutes</span>

              <span className="text-slate-500">
                {f.path.length - 1} edge
                {f.path.length > 2 ? "s" : ""}
              </span>

              {f.cost === cheapest && found.length === TOTAL_PATHS && (
                <span className="ml-auto text-xs font-bold text-emerald-700">
                  ✓ Cheapest
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
