import { useEffect, useRef, useState } from "react";
import { useProgress } from "../components/Progress";
import QuizRunner from "../components/QuizRunner";
import CampusGraph from "../components/Test/CampusGraph.jsx";
import GraphDiagram from "../components/Test/GraphDiagram.jsx";
import AdjacencyMatrix from "../components/Test/AdjacencyMatrix.jsx";
import DijkstraTrace from "../components/Test/DijkstraTrace.jsx";

import {
  CAMPUS_GRAPH,
  MATRIX_GRAPH,
  GRAPH_ARTICULATION,
  GRAPH_DIRECTED_CONNECTIVITY,
  GRAPH_TWO_CYCLES,
  GRAPH_DAG,
} from "../data/testGraphs.js";

// The parts, in the order the student unlocks them. Each path is the quiz section name.
// QuizRunner marks a section complete per difficulty level, so progress is stored under
// `${path}@L${level}` (see partPath), and the student has to pass every part at a level.
const PARTS = [
  { path: "/final-basics", title: "Nodes, edges and weights" },
  { path: "/final-matrix", title: "Adjacency matrices" },
  { path: "/final-connectivity", title: "Connectivity" },
  { path: "/final-cycles", title: "Cycles" },
  { path: "/final-dijkstra", title: "Dijkstra's algorithm" },
];
const TOTAL_PARTS = PARTS.length;

const partPath = (n, lvl) => `${PARTS[n - 1].path}@L${lvl}`;

const LEVELS = [
  { value: 1, label: "Level 1", desc: "Foundations" },
  { value: 2, label: "Level 2", desc: "Intermediate" },
  { value: 3, label: "Level 3", desc: "Challenging" },
];

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

/* A graph with its caption ("Graph 1") underneath */
function GraphFigure({ graph }) {
  return (
    <figure className="m-0">
      <GraphDiagram {...graph} />
      <figcaption className="mt-1 text-sm font-semibold text-slate-600">
        {graph.caption}
        {graph.directed ? " (directed)" : " (undirected)"}
      </figcaption>
    </figure>
  );
}

function DifficultyPicker({ value, onChange }) {
  return (
    <fieldset className="mb-4">
      <legend className="mb-2 text-sm font-semibold text-slate-700">Choose a difficulty</legend>
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <label
            key={l.value}
            className={
              "cursor-pointer rounded-lg border-2 px-4 py-2 text-sm transition " +
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 " +
              (value === l.value
                ? "border-indigo-600 bg-indigo-50 font-semibold text-indigo-900"
                : "border-slate-200 bg-white hover:border-indigo-300")
            }
          >
            <input
              type="radio"
              name="difficulty"
              className="sr-only"
              checked={value === l.value}
              onChange={() => onChange(l.value)}
            />
            {l.label} <span className="text-slate-500">· {l.desc}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* Shown when all parts are finished. It celebrates finishing (focus is on readiness rather than points) and,
   depending on the student's performance, points at what is worth a second look before the lecture. */
function Completion({ missedByPart, headingRef }) {
  const known = PARTS.map((_, i) => i + 1).filter((n) => missedByPart[n]);
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
        You've worked through nodes, edges, weights, adjacency matrices, connectivity, cycles, and Dijkstra's algorithm, so you're
        ready for the lecture.
      </p>

      {toRevisit.length > 0 && (
        <div className="mx-auto mt-4 max-w-xl rounded-xl bg-white/70 p-4 text-left text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Worth a second look before the lecture</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {toRevisit.map((n) => (
              <li key={n}>
                {PARTS[n - 1].title}: {missedByPart[n].length}{" "}
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
  const { completed, markComplete, clearTestProgress } = useProgress();
  const [level, setLevel] = useState(null);
  // Parts that have no questions at the chosen level are skipped (not saved as progress).
  const [emptyParts, setEmptyParts] = useState({});

  // A part is done when it is in the saved progress for this level, or had no questions at this level.
  const isDone = (n) =>
    level !== null && (completed.includes(partPath(n, level)) || !!emptyParts[n]);
  // Part n unlocks only when every earlier part is done.
  const isLocked = (n) => !PARTS.slice(0, n - 1).every((_, i) => isDone(i + 1));
  const firstOpen = PARTS.findIndex((_, i) => !isDone(i + 1));
  const partsDone = firstOpen === -1 ? TOTAL_PARTS : firstOpen;

  const [announcement, setAnnouncement] = useState("");

  // Questions missed per part, for the parts finished in this visit (not saved)
  const [missedByPart, setMissedByPart] = useState({});
  const [justFinished, setJustFinished] = useState(false);

  const partRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const celebrationRef = useRef(null);

  const finishPart = (n, missed = [], { persist = true } = {}) => {
    if (persist) markComplete(partPath(n, level)); // no-op if QuizRunner already did
    setMissedByPart((prev) => ({ ...prev, [n]: missed }));
    setAnnouncement(
      n < TOTAL_PARTS
        ? `Part ${n} complete. Part ${n + 1} is unlocked.`
        : `All ${TOTAL_PARTS} parts complete. You have finished the assessment and you are ready for the lecture.`
    );
    if (n === TOTAL_PARTS) {
      if (persist) markComplete("/test");
      setJustFinished(true);
    }
  };

  const handleEmpty = (n) => () => {
    setEmptyParts((prev) => ({ ...prev, [n]: true }));
    finishPart(n, [], { persist: false });
  };

  const changeLevel = (v) => {
    clearTestProgress();
    setLevel(v);
    setEmptyParts({});
    setMissedByPart({});
    setJustFinished(false);
  };

  // Bring the celebration into view once, right after the student finishes the final part
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

  // "Part n complete" banner with a button to the next part
  const banner = (n) =>
    isDone(n) && n < TOTAL_PARTS ? (
      <PartComplete
        message={`Part ${n} complete. Part ${n + 1} is unlocked.`}
        buttonLabel={`Go to Part ${n + 1}`}
        onContinue={!isDone(n + 1) ? () => goToPart(n + 1) : undefined}
      />
    ) : null;

  const partProps = (n) => ({
    number: n,
    title: PARTS[n - 1].title,
    locked: isLocked(n),
    headingRef: partRefs[n - 1],
  });

  // The quiz for part n. key={level} remounts it when the difficulty changes.
  const quiz = (n, section) =>
    level ? (
      <QuizRunner
        key={level}
        section={section}
        level={level}
        completePath={partPath(n, level)}
        onPass={(missed) => finishPart(n, missed)}
        onEmpty={handleEmpty(n)}
      />
    ) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">
      {/* Announces unlocks to screen readers */}
      <p role="status" className="sr-only">{announcement}</p>

      <header>
        <h1 className="text-4xl font-bold text-slate-900">Test Yourself</h1>
        <p className="mt-3 leading-7">
          Test your understanding of graph theory. The assessment covers every
          topic in this learning module and has {TOTAL_PARTS} parts. Finish each
          part to unlock the next. When you complete the last part, you are
          ready for the lecture.
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
          <li>Connectivity</li>
          <li>Cycles</li>
          <li>Dijkstra's Algorithm</li>
        </ul>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <DifficultyPicker value={level} onChange={changeLevel} />
        {!level && <p className="text-sm text-slate-500">Pick a difficulty to begin.</p>}
      </section>

      {/* Part 1: nodes, edges, weights */}
      <Part {...partProps(1)} locked={false}>
        {!emptyParts[1] && (
          <>
            <p className="mb-4 leading-7">
              The graph shows {Object.keys(CAMPUS_GRAPH.nodes).length} University of
              Pretoria campuses and the roads between them. Use it to answer the
              first five questions.
            </p>
            <div className="mb-6">
              <CampusGraph />
            </div>
          </>
        )}
        {quiz(1, "final-basics")}
        {banner(1)}
      </Part>

      {/* Part 2: adjacency matrix */}
      <Part {...partProps(2)}>
        {!emptyParts[2] && (
          <>
            <p className="mb-4 leading-7">
              This is the adjacency matrix of{" "}
              {MATRIX_GRAPH.directed ? "a directed" : "an undirected"}, weighted graph
              with vertices {MATRIX_GRAPH.vertices.join(", ")}. Use it to answer the
              questions about this matrix.
            </p>
            <div className="mb-6 overflow-x-auto">
              <AdjacencyMatrix />
            </div>
          </>
        )}
        {quiz(2, "final-matrix")}
        {banner(2)}
      </Part>

      {/* Part 3: connectivity */}
      <Part {...partProps(3)}>
        {!emptyParts[3] && (
          <>
            <p className="mb-4 leading-7">
              Use the two graphs below to answer the questions. Graph 1 is
              undirected and Graph 2 is directed. These questions need some
              reasoning, so work through each answer before you choose.
            </p>
            <div className="mb-6 grid gap-6 sm:grid-cols-2">
              <GraphFigure graph={GRAPH_ARTICULATION} />
              <GraphFigure graph={GRAPH_DIRECTED_CONNECTIVITY} />
            </div>
          </>
        )}
        {quiz(3, "final-connectivity")}
        {banner(3)}
      </Part>

      {/* Part 4: cycles */}
      <Part {...partProps(4)}>
        {!emptyParts[4] && (
          <>
            <p className="mb-4 leading-7">
              Use the two graphs below to answer the questions. Graph 3 is
              undirected and Graph 4 is directed. These questions need some
              reasoning, so work through each answer before you choose.
            </p>
            <div className="mb-6 grid gap-6 sm:grid-cols-2">
              <GraphFigure graph={GRAPH_TWO_CYCLES} />
              <GraphFigure graph={GRAPH_DAG} />
            </div>
          </>
        )}
        {quiz(4, "final-cycles")}
        {banner(4)}
      </Part>

      {/* Part 5: Dijkstra */}
      <Part {...partProps(5)}>
        <DijkstraTrace />
        <hr className="my-8 border-slate-200" />
        <h3 className="mb-3 text-lg font-semibold text-slate-900">Question 2</h3>
        <p className="mb-4 leading-7">Answer the following questions.</p>
        {quiz(5, "final-dijkstra")}
        {justFinished && (
          <Completion missedByPart={missedByPart} headingRef={celebrationRef} />
        )}
      </Part>
    </div>
  );
}

export default Test;