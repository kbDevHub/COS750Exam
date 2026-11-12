
import EdgeExplorer from "../components/EdgeExplorer";

function Weights() {
    return (
        <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

            <header>
                <h1 className="text-4xl font-bold text-slate-900">
                    Weighted Graphs and Paths
                </h1>
            </header>

            <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
                <h2 className="mb-4 text-2xl font-semibold text-indigo-900">
                    Learning Objectives
                </h2>
                <p className="mb-3">By the end of this section you should be able to:</p>
                <ol className="list-inside list-decimal space-y-2">
                    <li>Define a weighted graph.</li>
                    <li>Explain what an edge weight represents.</li>
                    <li>Define a path and calculate its total cost.</li>
                    <li>Explain why the fewest edges do not always give the cheapest path.</li>
                    <li>State the shortest path problem.</li>
                </ol>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Weighted Graphs</h2>
                <p className="leading-7">
                    In a <strong>weighted graph</strong>, every edge has a number attached to it called a weight.
                </p>
                <p className="leading-7">The weight can represent distance, travel time or cost.</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Explore Edge Weights</h2>
                <p>Switch on the weights to see the cost associated with each edge.</p>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <EdgeExplorer allowWeights={true} allowDirections={true} />
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Paths and Costs</h2>
                <p className="leading-7">
                    A <strong>path</strong> is a sequence of vertices where each consecutive pair is joined by an edge.
                </p>
                <p className="leading-7">
                    The <strong>cost</strong> of a path is the sum of the weights of its edges.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Example</h2>
                <p>Consider these edges:</p>

                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {["A-B = 4", "B-D = 5", "A-C = 2", "C-D = 8"].map((edge) => (
                        <li key={edge} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center font-medium">
                            {edge}
                        </li>
                    ))}
                </ul>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                        <p className="font-semibold text-green-900">Path A → B → D</p>
                        <p>4 + 5 = <strong>9</strong></p>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                        <p className="font-semibold text-blue-900">Path A → C → D</p>
                        <p>2 + 8 = <strong>10</strong></p>
                    </div>
                </div>

                <p>Both paths use two edges, but the first path is cheaper.</p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">
                    The Shortest Path Problem
                </h2>
                <p className="leading-7">
                    The shortest path problem asks which path has the lowest total cost between a starting vertex and a destination vertex.
                </p>
            </section>

        </div>
    );
}

export default Weights;
