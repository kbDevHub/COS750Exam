import { useEffect, useRef, useState } from "react";
import { useProgress } from "../components/Progress";
import QuizRunner from "../components/QuizRunner";
import CampusGraph from "../components/Test/CampusGraph.jsx";
import {CAMPUS_GRAPH, MATRIX_GRAPH} from "../data/testGraphs.js";
import AdjacencyMatrix from "../components/Test/AdjacencyMatrix.jsx";
import DijkstraTrace from "../components/Test/DijkstraTrace.jsx";

const TOTAL_PARTS = 3;

// Match with what QuizRunner expects, except QuizRunner expects it on sections, not parts. So we simulate that.
const PART_PATHS = ["/final-basics", "/final-matrix", "/final-dijkstra"];
const PART_TITLES = ["Nodes, edges and weights", "Adjacency matrices", "Dijkstra's algorithm"];

const btnPrimary =
  "rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm " +
  "transition hover:bg-indigo-700 active:scale-[0.98] focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";


/* One part of the assessment. A locked part shows only its title and a
   message: its content is not rendered, so it can't be skipped to. */
function Part({ number, title, locked, headingRef, children }) {
  return (
    <section
      aria-labelledby={`part-${number}-title`}
      className={
        locked
          ? "rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6"
          : "rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      <h2
        id={`part-${number}-title`}
        ref={headingRef}
        tabIndex={-1}
        className={
          "text-2xl font-bold focus:outline-none " +
          (locked ? "text-slate-500" : "mb-3 text-slate-900")
        }
      >
        Part {number}: {title}
      </h2>
      {locked ? (
        <p className="mt-2 flex items-center gap-2 text-slate-500">
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
            <path d="M6 8V6a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1Zm2 0h4V6a2 2 0 1 0-4 0v2Z" />
          </svg>
          Locked. Complete Part {number - 1} to unlock this part.
        </p>
      ) : (
        children
      )}
    </section>
  );
}

function PartComplete({ message, buttonLabel, onContinue }) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4">
      <p className="font-semibold text-emerald-900">{message}</p>
      {onContinue && (
        <button className={`${btnPrimary} ml-auto shrink-0`} onClick={onContinue}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

/* Shown when all three parts are finished. It celebrates finishing (focus is on readiness rather than points) and,
   depending on the student's performance, points at what is worth a second look before the lecture. */
function Completion({ missedByPart, headingRef }) {
  const known = [1, 2, 3].filter((n) => missedByPart[n]);
  const toRevisit = known.filter((n) => missedByPart[n].length > 0);
  const allKnown = known.length === TOTAL_PARTS;

  return (
    <div className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
      <div
        aria-hidden="true"
        className="anim-pop mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white"
      >
        <svg viewBox="0 0 20 20" className="h-7 w-7" fill="currentColor">
          <path d="M8.2 13.6 4.9 10.3l-1.3 1.3 4.6 4.6 8.2-8.2-1.3-1.3z" />
        </svg>
      </div>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-emerald-900 focus:outline-none"
      >
        You've finished the assessment
      </h3>
      <p className="mx-auto mt-2 max-w-xl leading-7 text-emerald-900">
        You've worked through nodes, edges, weights, adjacency matrices and Dijkstra's algorithm, so you're
        ready for the lecture.
      </p>

      {toRevisit.length > 0 && (
        <div className="mx-auto mt-4 max-w-xl rounded-xl bg-white/70 p-4 text-left text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Worth a second look before the lecture</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {toRevisit.map((n) => (
              <li key={n}>
                {PART_TITLES[n - 1]}: {missedByPart[n].length}{" "}
                {missedByPart[n].length === 1 ? "question" : "questions"} to revisit
              </li>
            ))}
          </ul>
          <p className="mt-2 text-slate-500">
            These are just pointers. It is sufficient that you
            understand the work, not to get every question right.
          </p>
        </div>
      )}
      {toRevisit.length === 0 && allKnown && (
        <p className="mt-3 font-semibold text-emerald-800">
          You answered every question within two attempts.
        </p>
      )}
    </div>
  );
}



function Test() {
  const { completed, markComplete } = useProgress();

  // Part n is unlocked once the previous parts are in the saved progress.
  const partsDone = PART_PATHS.filter((p) => completed.includes(p)).length;
  const [announcement, setAnnouncement] = useState("");

  // Questions missed per part, for the parts finished in this visit (not saved)
  const [missedByPart, setMissedByPart] = useState({});
  const [justFinished, setJustFinished] = useState(false);


  const partRefs = [useRef(null), useRef(null), useRef(null)];

  const celebrationRef = useRef(null);


    const finishPart = (n, missed = []) => {
    markComplete(PART_PATHS[n - 1]); // no-op if QuizRunner already did
      setMissedByPart((prev) => ({ ...prev, [n]: missed }));
      setAnnouncement(
      n < TOTAL_PARTS
        ? `Part ${n} complete. Part ${n + 1} is unlocked.`
        : "All three parts of the assessment are complete. You are ready for the lecture."
    );
    if (n === TOTAL_PARTS) {
      markComplete("/test");
      setJustFinished(true);
    }
  };

  // Bring the celebration into view once, right after the student finishes Part 3
  useEffect(() => {
    if (!justFinished || !celebrationRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    celebrationRef.current.focus();
    celebrationRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, [justFinished]);



  // Move the student (and keyboard / screen reader focus) to a part
  const goToPart = (n) => {
    const el = partRefs[n - 1].current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.focus();
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const isLocked = (n) => partsDone < n - 1;

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">
      {/* Announces unlocks to screen readers */}
      <p role="status" className="sr-only">{announcement}</p>

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Test Yourself</h1>
        <p className="mt-3 leading-7">
          Test your understanding of graph theory. The assessment covers every
          topic in this learning module and has three parts. Finish each part to
          unlock the next. When you complete Part 3, you are prepared for the
          lecture.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Progress: {partsDone} of {TOTAL_PARTS} parts complete
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

    {/* Part 1: nodes, edges, weights */}
    <Part number={1} title="Nodes, edges and weights" locked={false} headingRef={partRefs[0]}>
        <p className="mb-4 leading-7">
          The graph shows {Object.keys(CAMPUS_GRAPH.nodes).length} University of
          Pretoria campuses and the roads between them. Use it to answer the
          first five questions.
        </p>
        <div className="mb-6">
          <CampusGraph />
        </div>
        <QuizRunner section="final-basics" onPass={(missed) => finishPart(1, missed)} />
          {partsDone >= 1 && (
            <PartComplete
              message="Part 1 complete. Part 2 is unlocked."
              buttonLabel="Go to Part 2"
              onContinue={partsDone === 1 ? () => goToPart(2) : undefined}
            />
          )}
      </Part>


    {/* Part 2: adjacency matrix */}
    <Part number={2} title="Adjacency matrices" locked={isLocked(2)} headingRef={partRefs[1]}>
        <p className="mb-4 leading-7">
          This is the adjacency matrix of{" "}
          {MATRIX_GRAPH.directed ? "a directed" : "an undirected"}, weighted graph
          with vertices {MATRIX_GRAPH.vertices.join(", ")}. Use it to answer the
          first four questions.
        </p>
        <div className="mb-6 overflow-x-auto">
          <AdjacencyMatrix />
        </div>
        <QuizRunner section="final-matrix" onPass={(missed) => finishPart(2, missed)} />
        {partsDone >= 2 && (
          <PartComplete
            message="Part 2 complete. Part 3 is unlocked."
            buttonLabel="Go to Part 3"
            onContinue={partsDone === 2 ? () => goToPart(3) : undefined}
          />
        )}
      </Part>

    { /* Part 3: Dijkstra */}
     <Part number={3} title="Dijkstra's algorithm" locked={isLocked(3)} headingRef={partRefs[2]}>
        <DijkstraTrace/>
        <hr className = "my-8 border-slate-200"/>
        <h3 className = "mb-3 text-lg font-semibold text-slate-900" >
          Question 2
        </h3>
        <p className = "mb-4 leading-7">
          Answer the following questions. Use your solution from Question 1 to answer the first two questions.
        </p>
        <QuizRunner section="final-dijkstra" onPass={(missed) => finishPart(3, missed)} />
        {partsDone >= 3 && (
          <Completion missedByPart={missedByPart} headingRef={celebrationRef} />
        )}
      </Part>
    </div>
  );
}

export default Test;