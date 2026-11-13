import { useMemo, useState } from "react";
import GraphDiagram from "./GraphDiagram";
import { TRACE_GRAPH } from "../../data/testGraphs.js";

/*Used for the Dijkstra trace table in Test.jsx. The user fills in the table, then checks their answers. The solution can be revealed after checking.*/
/* ---------- Dijkstra, recording the state after every iteration ---------- */

function runTrace({ nodes, edges, source }) {
  const names = Object.keys(nodes);
  const dist = Object.fromEntries(names.map((n) => [n, Infinity]));
  dist[source] = 0;
  const initial = { ...dist };
  const done = new Set();
  const steps = [];

  while (done.size < names.length) {
    let u = null;
    for (const n of names) {
      if (!done.has(n) && (u === null || dist[n] < dist[u])) u = n;
    }
    if (u === null || dist[u] === Infinity) break;
    done.add(u);
    for (const [a, b, w] of edges) {
      if (a === u && dist[u] + w < dist[b]) dist[b] = dist[u] + w;
    }
    steps.push({ curr: u, dist: { ...dist } });
  }
  return { initial, steps };
}

function parseDist(text) {
  const t = text.trim().toLowerCase();
  if (t === "") return null;
  if (["inf", "infinity", "∞"].includes(t)) return Infinity;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

const show = (d) => (d === Infinity ? "∞" : d);


const btnPrimary =
  "rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm " +
  "transition hover:bg-indigo-700 active:scale-[0.98] focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";

const btnSecondary =
  "rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 " +
  "transition hover:bg-slate-100 active:scale-[0.98] focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";



/* ---------- Component ---------- */

/**
 * Props (all optional):
 *  graph       { source, nodes: {name: [x, y]}, edges: [[from, to, weight]] }
 *  onComplete  (correctCells, totalCells) => void  - called on every check
 *
 * Marking: the curr cell must match. A distance cell is correct if it shows the
 * distance after that iteration, or if it is left blank because it did not change.
 *
 * This was inspired by COS 212's 2023 Semester Test 2
 */
export default function DijkstraTrace({ graph = TRACE_GRAPH, onComplete }) {
  const { nodes, edges, source } = graph;
  const names = Object.keys(nodes);
  const { initial, steps } = useMemo(() => runTrace(graph), [graph]);

  const [cells, setCells] = useState({});
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const key = (i, row) => `${i}|${row}`;
  const get = (i, row) => cells[key(i, row)] ?? "";
  const setCell = (i, row, value) => {
    setCells((c) => ({ ...c, [key(i, row)]: value }));
    setChecked(false);
  };

  const cellOk = (i, row) => {
    const step = steps[i];
    if (row === "curr") return get(i, row) === step.curr;
    const expected = step.dist[row];
    const before = i === 0 ? initial[row] : steps[i - 1].dist[row];
    const text = get(i, row);
    if (text.trim() === "") return expected === before;
    return parseDist(text) === expected;
  };

  const rows = ["curr", ...names];
  const total = steps.length * rows.length;
  const correct = steps.reduce(
    (sum, _, i) => sum + rows.filter((r) => cellOk(i, r)).length,
    0
  );

  // Plain-text list of cells to review (so the result never depends on colour alone)
  const reviewList = steps
    .map((_, i) => {
      const bad = rows.filter((r) => !cellOk(i, r));
      return bad.length
        ? `Iteration ${i + 1}: ${bad.map((r) => (r === "curr" ? "curr" : `distance of ${r}`)).join(", ")}`
        : null;
    })
    .filter(Boolean);

  const allCurrFilled = steps.every((_, i) => get(i, "curr") !== "");

  const check = () => {
    setChecked(true);
    onComplete?.(correct, total);
  };

  const cellStyle = (i, row) =>
    !checked
      ? "border-slate-300"
      : cellOk(i, row)
      ? "border-green-500 bg-green-50"
      : "border-red-400 bg-red-50";

  // "Vertex A to: B (1), C (3), E (5)"
  const adjacency = names
    .map((n) => ({
      n,
      out: edges.filter(([a]) => a === n).map(([, b, w]) => `${b} (${w})`),
    }))
    .filter((x) => x.out.length);

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-slate-900">Question 1</h3>
      <p className="leading-7">
        Assume that Dijkstra's Shortest Path algorithm is executed on the
        provided graph starting at vertex <strong>{source}</strong>. Complete
        the following table, indicating clearly at each iteration the value of{" "}
        <em>curr</em>, and any updated distances for vertices.
      </p>

      <div className="flex flex-wrap items-start gap-6">
        <GraphDiagram nodes={nodes} edges={edges} source={source} viewBox={graph.viewBox} altList={false} />
        <ul aria-label="Edges of the graph, listed by vertex" className="space-y-1 font-mono text-sm text-slate-800">
          {adjacency.map(({ n, out }) => (
            <li key={n}>
              Vertex {n} to: {out.join(", ")}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse text-center">
          <caption className="sr-only">
            Dijkstra trace table. Each column is one iteration. The first row is curr; the other rows are the distance of each vertex.
          </caption>

          <thead>
            <tr className="border-b-2 border-slate-300 text-slate-900">
              <th scope="col" className="px-3 py-2 text-left">Iteration</th>
              <th scope="col" className="px-3 py-2">Initial</th>
              {steps.map((_, i) => (
                <th key={i} scope="col" className="px-3 py-2">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row} className="border-b border-slate-200">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-slate-900">
                  {row === "curr" ? "curr" : row}
                </th>
                <td className="bg-slate-100 px-3 py-2 text-slate-500">
                  {row === "curr" ? "" : show(initial[row])}
                </td>
                {steps.map((_, i) => (
                  <td key={i} className="px-2 py-2">
                    {row === "curr" ? (
                      <select
                        aria-label={`curr in iteration ${i + 1}`}
                        value={get(i, row)}
                        onChange={(e) => setCell(i, row, e.target.value)}
                        className={`w-16 rounded-md border px-1 py-1 ${cellStyle(i, row)}`}
                      >
                        <option value="">-</option>
                        {names.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        aria-label={`distance of ${row} in iteration ${i + 1}`}
                        value={get(i, row)}
                        onChange={(e) => setCell(i, row, e.target.value)}
                        aria-invalid={checked && !cellOk(i, row)}
                        className={`w-14 rounded-md border px-1 py-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${cellStyle(i, row)}`}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        Write a distance only when it changes in that iteration (or repeat the
        old value). Use ∞ for a distance that is still unknown.
      </p>

      <div className="anim-controls">
        <button className={btnPrimary} onClick={check} disabled={!allCurrFilled}>
          Check answers
        </button>
        <button
          className={btnSecondary}
          onClick={() => setRevealed(true)}
          disabled={!checked || correct === total}
        >
          Show solution
        </button>
      </div>

      {checked && (
        <div className="anim-note" role="status">
          {correct === total
            ? "Every cell is correct. Well done."
            : `${correct} of ${total} cells correct. Review the cells marked below, then try again.`}
          {correct !== total && (
            <>
              <ul className="mt-2 list-inside list-disc">
                {reviewList.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <span className="mt-1 block">
                Hint: curr is the unvisited vertex with the smallest distance.
                After choosing it, update a neighbour only if the new route is
                cheaper than its current distance.
              </span>
            </>
          )}
        </div>
      )}

      {revealed && (
        <div className="overflow-x-auto rounded-xl border border-indigo-500 bg-indigo-50 p-4">
          <p className="mb-2 font-semibold text-indigo-900">Solution</p>
          <table className="border-collapse text-center">
            <caption className="sr-only">Solution of the Dijkstra trace table.</caption>
            <thead>
              <tr className="text-indigo-900">
                <th scope="col" className="px-3 py-1 text-left">Iteration</th>
                <th scope="col" className="px-3 py-1">Initial</th>
                {steps.map((_, i) => (
                  <th key={i} scope="col" className="px-3 py-1">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-indigo-100">
                <th scope="row" className="px-3 py-1 text-left">curr</th>
                <td />
                {steps.map((s, i) => (
                  <td key={i} className="px-3 py-1 font-semibold">{s.curr}</td>
                ))}
              </tr>
              {names.map((n) => (
                <tr key={n} className="border-t border-indigo-100">
                  <th scope="row" className="px-3 py-1 text-left">{n}</th>
                  <td className="px-3 py-1 text-slate-500">{show(initial[n])}</td>
                  {steps.map((s, i) => {
                    const before = i === 0 ? initial[n] : steps[i - 1].dist[n];
                    const changed = s.dist[n] !== before;
                    return (
                      <td
                        key={i}
                        className={`px-3 py-1 ${changed ? "font-bold text-indigo-700" : "text-slate-400"}`}
                      >
                        {show(s.dist[n])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm text-slate-600">
            Bold values changed in that iteration.
          </p>
        </div>
      )}
    </div>
  );
}
