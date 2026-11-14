import { useState } from "react";
import EdgeExplorer from "../components/EdgeExplorer";
import PathBuilder from "../components/PathBuilder";
import ReadAloud from "../components/ReadAloud";
import QuizRunner from "../components/QuizRunner";

const DEFINITION =
    "In a weighted graph, every edge has a number attached to it called a weight. The weight can represent distance, travel time or cost. A path is a sequence of vertices where each consecutive pair is joined by an edge. The cost of a path is the sum of the weights of its edges.";

/* Reflective observation: predict first, then check. Constructivist. */
function Predict() {
    const [choice, setChoice] = useState(null);

    const options = [
        { id: "A", label: "I → A → P" },
        { id: "M", label: "I → M → P" },
        { id: "same", label: "About the same" },
    ];

    return (
        <div>
            <ul className="mb-4 flex flex-wrap gap-2 text-sm">
                {["I–A = 4", "A–P = 5", "I–M = 2", "M–P = 8", "I–P = 12"].map((e) => (
                    <li key={e} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium">
                        {e}
                    </li>
                ))}
            </ul>
            <p className="mb-3 text-sm text-slate-500">Each number is walking time in minutes.</p>

            <p className="mb-3 font-medium text-slate-900">
                You are at the IT Building (I) and want to reach the Piazza (P). Both routes below use two
                edges. Which do you think is quicker?
            </p>

            <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                    <button
                        key={o.id}
                        aria-pressed={choice === o.id}
                        onClick={() => setChoice(o.id)}
                        className={
                            "rounded-lg border-2 px-4 py-2 text-sm font-semibold transition focus:outline-none " +
                            "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
                            (choice === o.id
                                ? "border-indigo-300 bg-indigo-50 text-indigo-900"
                                : "border-gray-300 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900")
                        }
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            {choice && (
                <div className="anim-note mt-4" aria-live="polite">
                    <p className="font-semibold">
                        {choice === "A"
                            ? "Nice prediction. Let's check it."
                            : "Good try. Checking is how we learn, so let's add it up."}
                    </p>
                    <p className="mt-1">
                        I → A → P: 4 + 5 = <strong>9</strong> minutes.
                        <br />
                        I → M → P: 2 + 8 = <strong>10</strong> minutes.
                    </p>
                    <p className="mt-1">Both use two edges, but I → A → P is one minute quicker.</p>
                </div>
            )}
        </div>
    );
}

function Weights() {
    return (
        <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

            <header>
                <h1 className="text-4xl font-bold text-slate-900">Weighted Graphs and Paths</h1>
            </header>

            <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
                <h2 className="mb-4 text-2xl font-semibold text-indigo-900">Learning Objectives</h2>
                <p className="mb-3">By the end of this section you should be able to:</p>
                <ol className="list-inside list-decimal space-y-2">
                    <li>Define a weighted graph.</li>
                    <li>Explain what an edge weight represents.</li>
                    <li>Define a path and calculate its total cost.</li>
                    <li>Explain why the fewest edges do not always give the cheapest path.</li>
                    <li>State the shortest path problem.</li>
                </ol>
            </section>

            {/* Concrete experience: Visual */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">Not all roads are equal</h2>
                <p className="mb-4 leading-7">
                    On campus, some walks take longer than others. Switch on the weights to see how long each
                    connection takes.
                </p>
                <EdgeExplorer allowWeights={true} allowDirections={true} />
            </section>

            {/* Reflective observation: Read/Write, constructivist */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">Make a prediction</h2>
                <Predict />
            </section>

            {/* Abstract conceptualisation: Read/Write + Auditory */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Weights, Paths and Costs</h2>
                    <ReadAloud text={DEFINITION} />
                </div>
                <p className="leading-7">
                    In a <strong>weighted graph</strong>, every edge has a number attached to it called a{" "}
                    <strong>weight</strong>. The weight can represent distance, travel time or cost.
                </p>
                <p className="leading-7">
                    A <strong>path</strong> is a sequence of vertices where each consecutive pair is joined by an
                    edge. For example, I → A → P.
                </p>
                <p className="leading-7">
                    The <strong>cost</strong> of a path is the sum of the weights of its edges. For I → A → P, the
                    cost is 4 + 5 = 9.
                </p>
            </section>

            {/* Active experimentation: Kinesthetic + Visual */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">Try it: find every path</h2>
                <PathBuilder />
            </section>

            {/* Reflective observation (round 2): Read/Write */}
            <section className="space-y-4">
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-700">Key idea</p>
                    <p className="leading-7">
                        The path with the <strong>fewest edges</strong> is not always the <strong>cheapest</strong>.
                        The direct road I → P is one edge, but it costs 12 minutes. Going via the Aula takes two
                        edges and costs only 9.
                    </p>
                </div>
            </section>

            <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-4" />

            {/* Behaviourist feedback */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">Mini Test</h2>
                <p className="mb-4">Test your understanding of weights, paths and costs.</p>
                <QuizRunner section="weights" />
            </section>

        </div>
    );
}

export default Weights;