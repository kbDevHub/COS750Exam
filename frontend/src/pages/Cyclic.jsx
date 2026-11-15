import { useState } from "react";
import QuizRunner from "../components/QuizRunner";
import ReadAloud from "../components/ReadAloud";
import { useProgress } from "../components/Progress";

const DEFINITION =
  "A cycle is a path that arrives back at its start, where every vertex is unique. A graph with no cycles is acyclic. Cycles are important to detect, for example when packages depend on each other.";

/* Package dependency graph from the slides. An arrow X to Y means: to install X you need Y. */
const NODES = {
  A: { x: 300, y: 40 },
  D: { x: 90, y: 150 },
  B: { x: 300, y: 150 },
  C: { x: 510, y: 150 },
  E: { x: 405, y: 240 },
};
const BASE = [["A", "B"], ["A", "C"], ["A", "D"], ["D", "B"], ["B", "C"]];
const EXTRA = ["C", "E"];
const BACK = ["E", "B"];
const CYCLE = ["B-C", "C-E", "E-B"];
const RADIUS = 22;

function Arrow({ from, to, colour, width = 2.5 }) {
  const a = NODES[from];
  const b = NODES[to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const x1 = a.x + ux * RADIUS;
  const y1 = a.y + uy * RADIUS;
  const x2 = b.x - ux * (RADIUS + 6);
  const y2 = b.y - uy * (RADIUS + 6);
  // arrowhead
  const hx = b.x - ux * RADIUS;
  const hy = b.y - uy * RADIUS;
  const px = -uy;
  const py = ux;
  const head = `${hx},${hy} ${hx - ux * 12 + px * 6},${hy - uy * 12 + py * 6} ${hx - ux * 12 - px * 6},${hy - uy * 12 - py * 6}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={colour} strokeWidth={width} strokeLinecap="round" />
      <polygon points={head} fill={colour} />
    </g>
  );
}

function Dependencies() {
  const [withLoop, setWithLoop] = useState(false);

  const edges = [...BASE, ...(withLoop ? [EXTRA, BACK] : [])];
  const inCycle = (a, b) => withLoop && CYCLE.includes(`${a}-${b}`);

  return (
    <div>
      <p className="mb-3">
        You are releasing a software package. An arrow from X to Y means{" "}
        <strong>"to install X you need Y"</strong>.
      </p>

      <label className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={withLoop}
          onChange={(e) => setWithLoop(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className="relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5"
        />
        What if C needs E, and E needs B?
      </label>

      <svg
        viewBox="0 0 600 280"
        className="w-full rounded-lg border border-slate-300 bg-white"
        role="img"
        aria-label="Package dependency graph"
      >
        {edges.map(([a, b]) => (
          <Arrow
            key={a + b}
            from={a}
            to={b}
            colour={inCycle(a, b) ? "#dc2626" : "#94a3b8"}
            width={inCycle(a, b) ? 4 : 2.5}
          />
        ))}
        {Object.entries(NODES).map(([v, p]) => {
          if (!withLoop && v === "E") return null;
          const hot = withLoop && ["B", "C", "E"].includes(v);
          return (
            <g key={v}>
              <circle
                cx={p.x} cy={p.y} r={RADIUS}
                fill={hot ? "#fee2e2" : "#e0e7ff"}
                stroke={hot ? "#dc2626" : "#4f46e5"}
                strokeWidth="3"
              />
              <text x={p.x} y={p.y + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#1e293b">
                {v}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="anim-note mt-3" aria-live="polite">
        {withLoop
          ? "To install E you need B, but B needs C, and C needs E. You can never finish. B → C → E → B is a cycle."
          : "To install A you need B, C and D. To install D you need B, and to install B you need C. Install C, then B, then D, then A. It works."}
      </p>
    </div>
  );
}

export default function Cyclic() {
  const { markComplete } = useProgress();

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">
      <header>
        <h1 className="text-4xl font-bold text-slate-900">Cyclic Graphs</h1>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">Learning Objectives</h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Define a cycle in a graph.</li>
          <li>Identify a cycle in a diagram or real-world scenario.</li>
          <li>Explain why cycles matter in practice.</li>
          <li>Name the main approaches used to detect cycles.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Can this package be installed?</h2>
        <p className="mb-4 leading-7">
          Software packages often depend on other packages. Keep track of those dependencies in a graph,
          then switch on the extra dependency to see what goes wrong.
        </p>
        <Dependencies />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">What is a cycle?</h2>
          <ReadAloud text={DEFINITION} />
        </div>
        <p className="leading-7">
          A <strong>cycle</strong> is a path that arrives back at its start, where every vertex is
          unique. In the example, B → C → E → B is a cycle: following the arrows from B brings you back
          to B.
        </p>
        <p className="leading-7">
          A graph with no cycles is <strong>acyclic</strong>. The first dependency graph was acyclic, so
          there was a valid order to install the packages. The second was not.
        </p>
        <p className="leading-7">
          Cycles can appear in undirected graphs too. A triangle of three vertices, each joined to the
          other two, is a cycle.
        </p>
      </section>

      <section className="space-y-4">
        <div className=" p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">Why it matters</p>
          <p className="leading-7">
            You often need to be aware of cycles in a graph. A cycle in a dependency graph means the
            software can never be installed, because every package in the loop is waiting for another.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">How do we find cycles?</h2>
        <p className="leading-7">
          We need an algorithm that detects cycles automatically. You will meet three approaches:
        </p>
        <ol className="list-inside list-decimal pl-6 space-y-3 leading-7">
          <li>Floyd-Warshall</li>
          <li>Depth first search</li>
          <li>Union-find</li>
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Mini Test</h2>
        <p className="mb-4">Test your understanding of cycles.</p>
        <QuizRunner section="cyclic" onPass={() => markComplete("/cyclic")} />
      </section>
    </div>
  );
}