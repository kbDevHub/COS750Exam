
import DijkstraAnimation from "../components/DijkstraAnimation";
import QuizRunner from "../components/QuizRunner";

function Dijkstra() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

      <header>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900">
          Dijkstra's Algorithm
        </h1>
        <p className="text-lg text-slate-500">
          Learn how to find the shortest path in a weighted graph.
        </p>
      </header>

      <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">
          Learning Objectives
        </h2>
        <ol className="list-inside list-decimal space-y-2 text-indigo-950">
          <li>State the problem Dijkstra's algorithm solves.</li>
          <li>Describe the steps of the algorithm.</li>
          <li>Explain what relaxing an edge means.</li>
          <li>Trace the algorithm on a weighted graph.</li>
          <li>Reconstruct the shortest path.</li>
          <li>Explain why negative weights are not allowed.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900">
          What is Dijkstra's Algorithm?
        </h2>
        <p className="leading-7">
          Dijkstra's algorithm finds the shortest path from one starting vertex to every other vertex in a weighted graph.
        </p>
        <p className="leading-7">
          It only works when all edge weights are zero or positive.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Information Used
        </h2>
        <ul className="list-inside list-disc space-y-2 leading-7">
          <li>
            <strong className="text-indigo-700">Distance:</strong>{" "}
            The cheapest cost found so far to reach a vertex.
          </li>
          <li>
            <strong className="text-indigo-700">Previous:</strong>{" "}
            The vertex we came from on the cheapest route.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900">
          Steps of the Algorithm
        </h2>
        <ol className="list-inside list-decimal space-y-3 leading-7">
          <li>Set the start distance to 0 and all others to infinity.</li>
          <li>Mark all vertices as unvisited.</li>
          <li>Choose the unvisited vertex with the smallest distance.</li>
          <li>Calculate the distances to its unvisited neighbours.</li>
          <li>Update distances when a cheaper route is found. This is called relaxing an edge.</li>
          <li>Mark the current vertex as visited.</li>
          <li>Repeat until all vertices have been visited.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Worked Example
        </h2>
        <p>We will use the following undirected weighted graph, starting at vertex A:</p>

        <div className="rounded-xl bg-slate-50 p-5">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {["A-B (4)", "A-C (2)", "B-C (1)", "B-D (5)", "C-D (8)", "C-E (10)", "D-E (2)"].map((edge) => (
              <li key={edge} className="rounded-lg border border-slate-200 bg-white p-3 text-center font-medium">
                {edge}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold text-slate-900">Starting Distances</h3>
            <p>A = 0, B = ∞, C = ∞, D = ∞, E = ∞.</p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="mb-3 font-semibold text-green-900">Final Distances</h3>
            <ul className="grid grid-cols-3 gap-2">
              {["A = 0", "B = 3", "C = 2", "D = 8", "E = 10"].map((distance) => (
                <li key={distance} className="font-semibold text-green-800">
                  {distance}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Interactive Dijkstra Animation
        </h2>
        <p className="leading-7">
          Use the controls to move through each step of the algorithm. Watch how the distances change as vertices are visited.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <DijkstraAnimation />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Reading the Shortest Path
        </h2>
        <p>To find the path to E, follow the previous vertices backwards:</p>

        <div className="rounded-xl bg-indigo-50 p-5 text-center text-xl font-bold text-indigo-800">
          E ← D ← B ← C ← A
        </div>

        <p>
          Therefore, the shortest path is:
          <strong className="text-indigo-700"> A → C → B → D → E</strong>
        </p>
        <p>
          Total cost: 2 + 1 + 5 + 2 = <strong>10</strong>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Why Does It Work?
        </h2>
        <p className="leading-7">
          Dijkstra's algorithm is a greedy algorithm. It always chooses
          the unvisited vertex with the smallest recorded distance.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Limitations</h2>
        <p className="leading-7">
          Dijkstra's algorithm cannot be used with negative edge weights
          because they can invalidate its distance-finalisation process.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Mini Test</h2>
        <QuizRunner section="dijkstra" />
      </section>

    </div>
  );
}

export default Dijkstra;
