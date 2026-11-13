import QuizRunner from "../components/QuizRunner";
import CampusGraph from "../components/Test/CampusGraph.jsx";
import {CAMPUS_GRAPH, MATRIX_GRAPH} from "../data/testGraphs.js";
import AdjacencyMatrix from "../components/Test/AdjacencyMatrix.jsx";

function Test() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Test Yourself</h1>
        <p className="mt-3 leading-7">
          Test your understanding of graph theory. The assessment covers every
          topic in this learning module and has three parts.
        </p>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-3 text-2xl font-semibold text-indigo-900">Topics Covered</h2>
        <ul className="list-inside list-disc space-y-1">
          {/*<li>Introduction to Graphs</li>*/}
          <li>Nodes</li>
          <li>Edges</li>
          <li>Weighted Graphs and Paths</li>
          <li>Adjacency Matrix</li>
          <li>Dijkstra's Algorithm</li>
        </ul>
      </section>

    {/* Part 1: nodes, edges, weights (campus graph + real-world examples) */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">
          Part 1: Nodes, edges and weights
        </h2>
        <p className="mb-4 leading-7">
          The graph shows {Object.keys(CAMPUS_GRAPH.nodes).length} University of
          Pretoria campuses and the roads between them. Use it to answer the
          first five questions.
        </p>
        <div className="mb-6">
          <CampusGraph />
        </div>
        <QuizRunner section="final-basics" />
      </section>

    {/* Part 2: adjacency matrix */}
      <section className = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className = "mb-3 text-2xl font-bold text-slate-900">
          Part 2: Adjacency matrices
        </h2 >
        <p className = "mb-4 leading-7">
         This is the adjacency matrix of {MATRIX_GRAPH.directed ? "a directed": "an undirected"}, weighted graph with
         vertices {MATRIX_GRAPH.vertices.join(", ")}.Use it to answer the first four questions.
        </p>
       <div className = "mb-6 overflow-x-auto">
         <AdjacencyMatrix />
       </div >
       <QuizRunner section = "final-matrix" />
      </section >
    </div>
  );
}

export default Test;