
import AdjacencyExplorer from "../components/AdjacencyExplorer";
import QuizRunner from "../components/QuizRunner";
import ReadAloud from "../components/ReadAloud";

const DEF_MATRIX =
  "A program cannot read a drawing, so it stores a graph as a table called an adjacency matrix. It has one row and one column for every vertex. The cell in row X, column Y holds the weight of the edge between X and Y. A 0 means there is no edge.";

function Adjacency() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Adjacency Matrix</h1>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">
          Learning Objectives
        </h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Define an adjacency matrix.</li>
          <li>Read the weight of an edge from a matrix.</li>
          <li>Explain why an undirected graph gives a matrix that mirrors itself.</li>
          <li>Say when an adjacency list is a better choice.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">What is an Adjacency Matrix?</h2>
          <ReadAloud text={DEF_MATRIX} />
        </div>
        <p className="leading-7">
          A program cannot read a drawing, so it stores a graph as a table called an <strong>adjacency matrix</strong>.
          It has one row and one column for every vertex.
        </p>
        <p className="leading-7">
          The cell in row X, column Y holds the <strong>weight</strong> of the edge between X and Y. A <strong>0</strong> means there is no edge.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Try It</h2>
        <p>This is the campus graph from the last two sections. Click an edge to find its cells in the matrix, or click a cell to find its edge.</p>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <AdjacencyExplorer />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Undirected and Directed Graphs</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-2 font-semibold text-indigo-700">Undirected graph</h3>
            <p className="leading-7">
              Each edge works both ways, so it fills two cells: row X, column Y and row Y, column X. The matrix mirrors itself across the diagonal.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-2 font-semibold text-indigo-700">Directed graph</h3>
            <p className="leading-7">
              Each edge works one way only, so it fills just one cell: the row where the edge starts and the column where it ends.
            </p>
          </div>
        </div>
      </section>

      <section className=" p-5">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">Key idea</p>
        <p className="leading-7">
          A matrix has a cell for every pair of vertices, even pairs with no edge. An <strong>adjacency list</strong> stores
          only the edges that exist, so it uses less space when a graph has few edges.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Mini Test</h2>
        <QuizRunner section="adjacency" />
      </section>

    </div>
  );
}

export default Adjacency;
