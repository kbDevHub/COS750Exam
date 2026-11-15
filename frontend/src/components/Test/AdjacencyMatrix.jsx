import { MATRIX_GRAPH } from "../../data/testGraphs.js";

/**
 * Shows a graph as an adjacency matrix.
 * The data lives in src/data/testGraphs2.js (MATRIX_GRAPH).
 *
 * Props (all optional):
 *  vertices  array of vertex names, in row/column order
 *  edges     [[from, to, weight]]
 *  directed  false (default): each edge fills both [from][to] and [to][from]
 *            true: each edge fills only [from][to]
 *  caption   short text shown under the table
 */
export default function AdjacencyMatrix({
  vertices = MATRIX_GRAPH.vertices,
  edges = MATRIX_GRAPH.edges,
  directed = MATRIX_GRAPH.directed,
  caption,
}) {
  const weight = {};
  for (const [a, b, w] of edges) {
    weight[`${a}|${b}`] = w;
    if (!directed) weight[`${b}|${a}`] = w;
  }

  return (
    <figure className="inline-block">
      <table className="border-collapse text-center">
        <caption className="sr-only">
          Adjacency matrix. Rows are where an edge starts and columns are where it ends. A 0 means there is no edge.
        </caption>
        <thead>
          <tr>
            <th className="p-2" />
            {vertices.map((v) => (
              <th
                key={v}
                scope="col"
                className="h-10 w-12 border-b-2 border-slate-400 font-semibold text-slate-900"
              >
                {v}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {vertices.map((row) => (
            <tr key={row}>
              <th
                scope="row"
                className="h-10 w-12 border-r-2 border-slate-400 font-semibold text-slate-900"
              >
                {row}
              </th>
              {vertices.map((col) => {
                const w = weight[`${row}|${col}`] ?? 0;
                return (
                  <td
                    key={col}
                    className={`h-10 w-12 border border-slate-200 ${
                      w ? "bg-indigo-50 font-semibold text-indigo-900" : "text-slate-400"
                    }`}
                  >
                    {w}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <figcaption className="mt-2 text-sm text-slate-500">
        {caption ?? "Rows are where an edge starts. Columns are where it ends. 0 means no edge."}
      </figcaption>
    </figure>
  );
}
