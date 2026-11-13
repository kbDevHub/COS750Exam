
import EdgeExplorer from "../components/EdgeExplorer";
import QuizRunner from "../components/QuizRunner";
import EdgesExample from "../components/EdgesExample";
import ReadAloud from "../components/ReadAloud";


const DEF_EDGE =
  "An edge is a line that connects two vertices. It represents a relationship between them, such as a path between two places or a friendship between two people";
  const DEF_ADJ="Two vertices joined by an edge are called adjacent, or neighbours";

  function Edges() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Edges</h1>
      </header>

      <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">
          Learning Objectives
        </h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Define an edge as a connection between two vertices.</li>
          <li>Distinguish between directed and undirected edges.</li>
          <li>Identify edges in a diagram and state which vertices they connect.</li>
          <li>Define adjacent vertices.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">What is an Edge?</h2>
        <ReadAloud text={DEF_EDGE} />
        <p className="leading-7">
          An <strong>edge</strong> is a line that connects two vertices. It represents a relationship between them, such as a path between two places or a friendship between two people.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Types of Edges</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-2 font-semibold text-indigo-700">Undirected edge</h3>
            <p className="leading-7">
              The connection works both ways, like a two-way road. If Node A is connected to Node B, then Node B is connected to Node A.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="mb-2 font-semibold text-indigo-700">Directed edge</h3>
            <p className="leading-7">
              The connection works only one way, like a one-way street. Directed edges are drawn as arrows.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Try It</h2>
        <p>Click on the edges to explore the connections. Try switching between directed and undirected edges.</p>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <EdgeExplorer allowWeights={false} allowDirections={true} />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">Adjacent Vertices</h2>
        <ReadAloud text={DEF_ADJ}/>
        <p>
          Two vertices joined by an edge are called <strong>adjacent</strong>, or <strong>neighbours</strong>.
        </p>
        <p>If there is an edge between A and B, then A and B are neighbours.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-900">Example</h2>
        <p>
          If IT Building–Merensky and Merensky–Aula are edges, then Merensky is a neighbour of both IT Building and Aula.
        </p>
        <p>
          IT Building and Aula are not neighbours because no edge joins them directly.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <EdgesExample />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Mini Test</h2>
        <QuizRunner section="edges" />
      </section>

    </div>
  );
}

export default Edges;
