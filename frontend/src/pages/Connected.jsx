import { useState } from "react";
import QuizRunner from "../components/QuizRunner";
import ReadAloud from "../components/ReadAloud";
import { useProgress } from "../components/Progress";

const DEFINITION =
  "A graph is connected when you can get from any vertex to any other by following edges. An n-connected graph has at least n different routes between any two vertices, and the routes never share a stop in between. A biconnected graph is the case where n is two, so no single vertex failing can split the graph. An articulation point is a vertex that holds the graph together: remove just that one and the graph falls into separate pieces. A block is a chunk of the graph that no single vertex can break apart.";

const NODES = {
  A: { x: 70, y: 50 },
  J: { x: 70, y: 170 },
  Z: { x: 220, y: 50 },
  R: { x: 220, y: 170 },
  N: { x: 340, y: 110 },
  P: { x: 340, y: 230 },
  L: { x: 480, y: 230 },
};
const EDGES = [
  ["A", "J"], ["J", "R"], ["R", "Z"], ["Z", "A"],
  ["R", "N"], ["N", "P"], ["P", "R"], ["P", "L"],
];
const COLOURS = ["#4f46e5", "#d97706", "#059669", "#db2777", "#0891b2"];
const RADIUS = 22;

function components(removed) {
  const left = Object.keys(NODES).filter((v) => !removed.includes(v));
  const seen = new Set();
  const pieces = [];
  for (const start of left) {
    if (seen.has(start)) continue;
    const piece = [];
    const queue = [start];
    seen.add(start);
    while (queue.length) {
      const v = queue.shift();
      piece.push(v);
      for (const [a, b] of EDGES) {
        const u = a === v ? b : b === v ? a : null;
        if (u && !removed.includes(u) && !seen.has(u)) {
          seen.add(u);
          queue.push(u);
        }
      }
    }
    pieces.push(piece);
  }
  return pieces;
}

/* The lecture's own wording, shown under each plain-language definition
   so students still recognise it in the lecture and the exam. */
/*
function LectureWords({ children }) {
  return (
    <p className="text-sm text-slate-500">
      <span className="font-semibold">In the lecture's words:</span> {children}
    </p>
  );
}
*/

function BreakIt() {
  const [removed, setRemoved] = useState([]);

  const toggle = (v) =>
    setRemoved((r) => (r.includes(v) ? r.filter((x) => x !== v) : [...r, v]));

  const pieces = components(removed);
  const colourOf = (v) => COLOURS[pieces.findIndex((p) => p.includes(v)) % COLOURS.length];

  let note;
  if (removed.length === 0) {
    note = "All seven vertices are in one piece, so this graph is connected. Now try removing a vertex.";
  } else if (pieces.length === 0) {
    note = "Nothing left. Put some vertices back.";
  } else if (pieces.length === 1) {
    note =
      removed.length === 1
        ? `Removing ${removed[0]} leaves one piece. The graph is still connected, so ${removed[0]} is not a breaking point.`
        : "What is left is still one connected piece.";
  } else {
    note =
      removed.length === 1
        ? `Removing ${removed[0]} splits the graph into ${pieces.length} pieces. ${removed[0]} is an articulation point.`
        : `The graph is now in ${pieces.length} separate pieces.`;
  }

  return (
    <div>
      <p className="mb-3">
        Click a vertex to remove it. Click it again to put it back. Each separate piece gets its own colour.
      </p>

      <svg
        viewBox="0 0 560 280"
        className="w-full rounded-lg border border-slate-300 bg-white"
        role="group"
        aria-label="A graph of seven vertices. Select a vertex to remove it."
      >
        {EDGES.map(([a, b]) => {
          if (removed.includes(a) || removed.includes(b)) return null;
          return (
            <line
              key={a + b}
              x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
              stroke={pieces.length > 1 ? colourOf(a) : "#94a3b8"}
              strokeWidth="3" strokeLinecap="round"
            />
          );
        })}

        {Object.entries(NODES).map(([v, p]) => {
          const gone = removed.includes(v);
          const col = gone ? "#cbd5e1" : colourOf(v);
          return (
            <g
              key={v}
              className="cursor-pointer"
              tabIndex={0}
              role="button"
              aria-pressed={gone}
              aria-label={`Vertex ${v}${gone ? ", removed" : ""}`}
              onClick={() => toggle(v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(v);
                }
              }}
            >
              <circle
                cx={p.x} cy={p.y} r={RADIUS}
                fill={gone ? "#f8fafc" : "#ffffff"}
                stroke={pieces.length > 1 || gone ? col : "#4f46e5"}
                strokeWidth="3"
                strokeDasharray={gone ? "5" : undefined}
              />
              <text
                x={p.x} y={p.y + 7} textAnchor="middle" fontSize="20" fontWeight="700"
                fill={gone ? "#94a3b8" : "#1e293b"}
              >
                {v}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="anim-note mt-3" aria-live="polite">{note}</p>

      <div className="anim-controls">
        <button className="anim-btn anim-btn-secondary" onClick={() => setRemoved([])} disabled={removed.length === 0}>
          Put everything back
        </button>
        <span className="anim-step">Pieces: {pieces.length}</span>
      </div>
    </div>
  );
}

export default function Connected() {
  const { markComplete } = useProgress();

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">
      <header>
        <h1 className="text-4xl font-bold text-slate-900">Connectivity</h1>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">Learning Objectives</h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Define a connected graph.</li>
          <li>Explain what an n-connected (biconnected) graph is.</li>
          <li>Identify articulation points and blocks in a graph.</li>
          <li>Explain why articulation points matter in real networks.</li>
          <li>Distinguish weakly connected from strongly connected directed graphs.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">How easily does it break?</h2>
        <p className="mb-4 leading-7">
          This graph is connected: you can get from any vertex to any other. But how hard is it to make it disconnected? Can you break it by removing just one vertex?
        </p>
        <BreakIt />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Connected graphs</h2>
          <ReadAloud text={DEFINITION} />
        </div>
        <p className="leading-7">
          A graph is <strong>connected</strong> when you can get from any vertex to any other by following edges, like driving between any two towns on a road map. Two islands with no bridge between them are not connected.
        </p>
        {/*<LectureWords>a path exists between any two vertices.</LectureWords>*/}
        <p className="leading-7">
          Connected is a yes-or-no answer. To ask <em>how well</em> connected a graph is, count the different routes. An{" "}<strong>n-connected</strong> graph has at least n routes between any two vertices, and the routes never share a stop in between. Another way to see it: fewer than n vertices failing can never break the graph apart.
        </p>
        {/*<LectureWords>at least n non-overlapping paths between any two vertices. Two paths overlap if they share any vertex.</LectureWords>*/}
        <p className="leading-7">
          A <strong>biconnected</strong> graph is the case n = 2. There are always two separate routes between any two vertices, so if one vertex fails there is always another way round.
        </p>
        {/*<LectureWords>a 2-connected graph.</LectureWords>*/}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Articulation points and blocks</h2>
        <p className="leading-7">
          Some graphs have a vertex that holds everything together. Remove just that one and the graph falls into separate pieces. That vertex is an <strong>articulation point</strong>, a single point of failure. Try it in the graph at the top of the page: remove R.
        </p>
        {/*<LectureWords>a vertex that always has to be on the path between some pair of vertices.</LectureWords>*/}
        <p className="leading-7">
          A <strong>block</strong> is a chunk of the graph that no single vertex can break apart. Blocks join up at the articulation points. In the graph above, P and R are the articulation points, and there are three blocks: A, J, R and Z; then R, N and P; then P and L.
        </p>
        {/*<LectureWords>the biconnected subgraphs are called blocks.</LectureWords>*/}
        <div className=" p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">Why it matters</p>
          <p className="leading-7">
            In a telecommunications network, an articulation point is a single point of failure. If it fails, part of the network is cut off. Finding articulation points lets us spot the weak spots. Later we will see that depth first search can find them.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Connectivity in directed graphs</h2>
        <p className="leading-7">
          For a directed graph, "connected" depends on what we mean by it.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">Weakly connected</p>
            <p className="mt-1 leading-7">
              Pretend the arrows are plain lines. If the graph is in one piece, it is weakly connected.
            </p>
            {/*<p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold">In the lecture's words:</span> the corresponding undirected graph structure is connected.
            </p>*/}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="font-semibold text-slate-900">Strongly connected</p>
            <p className="mt-1 leading-7">
              Obey the arrows like one-way streets. If you can still get from every vertex to every other, it is strongly connected.
            </p>
            {/*<p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold">In the lecture's words:</span> every vertex is reachable from every other vertex.
            </p>*/}
          </div>
        </div>
        <p className="leading-7">
          A graph where you can walk from A to B to C but never back is weakly connected only. Add an arrow from C back to A and it becomes strongly connected. The pieces of a digraph that are strongly connected are called strongly connected components.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Mini Test</h2>
        <p className="mb-4">Test your understanding of connectivity.</p>
        <QuizRunner section="connected" onPass={() => markComplete("/connected")} />
      </section>
    </div>
  );
}