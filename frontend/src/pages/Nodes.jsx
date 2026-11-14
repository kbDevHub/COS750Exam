
import QuizRunner from "../components/QuizRunner";
import CampusMap from "../components/CampusMap";
import ReadAloud from "../components/ReadAloud";

const DEFINITION =
  "A graph is a way of representing things and the connections between them. The things are called vertices. In programming they are often called nodes. The two words mean the same thing.";


function Nodes() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Nodes</h1>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">
          Learning Objectives
        </h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Define a graph as a set of vertices connected by edges.</li>
          <li>Identify the vertices in a diagram or real-world scenario.</li>
          <li>Explain that node and vertex mean the same thing.</li>
        </ol>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Think of the campus</h2>
        <p className="mb-4 leading-7">
          Picture your day on campus. Each place you visit is one "thing" on the map.
        </p>
        <CampusMap />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">What is a Node?</h2>
          <ReadAloud text={DEFINITION} />
        </div>

        <p className="leading-7">
          A graph is a way of representing things and the connections between them. The "things" are called <strong>vertices</strong> (singular: vertex). In programming, they are often called <strong> nodes</strong>. The two words mean the same thing.
        </p>
        <p className="leading-7">
          A vertex can represent anything: a city on a map, a person in a social network, a web page or a train station.
        </p>
        <p className="leading-7">
          On its own, a vertex is just a labelled point. In diagrams, vertices are drawn as circles with names inside, such as A, B or C.
        </p>
      </section>

      <div className="flex items-center justify-between border-b border-slate-300 pb-3 mb-4"/>

      {/* Mini Test */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Mini Test</h2>
        <p className="mb-4">Test your understanding of nodes and vertices.</p>
        <QuizRunner section="nodes" />
      </section>

    </div>
  );
}

export default Nodes;
