import { useState } from "react";
import { Eye, Volume2, BookOpen, Hand, Undo2, RotateCcw, Lightbulb, Siren } from "lucide-react";

import TownMap from "../components/TownMap";
import QuizRunner from "../components/QuizRunner";
import ReadAloud from "../components/ReadAloud";
import {
  OFFERED_ROUTES,
  ROUTE_STYLES,
  START,
  TARGET,
  SHORTEST_COST,
  allSimplePaths,
  areNeighbours,
  costSum,
  describePath,
  pathCost,
  vertexById,
} from "../data/shortestPathTown";

/*
 * Section 2.1: The Shortest Path Problem
 *
 * Structure follows Kolb's learning cycle (secondary learning style):
 *   Step 1  Concrete experience        - the emergency call: guess the faster route
 *   Step 2  Reflective observation     - see the totals, think about what decides speed
 *   Step 3  Abstract conceptualisation - the definition of the shortest path problem
 *   Step 4  Active experimentation     - build a route that beats both
 *
 * Every step offers several VARK modes (primary learning style), shown as tags:
 *   Visual (the map), Aural (read aloud), Read/write (step log, definitions),
 *   Kinaesthetic (tapping vertices to choose or build routes).
 */

const ROUTES = OFFERED_ROUTES.map((r) => ({ ...r, cost: pathCost(r.path) }));
const BEST_OFFERED = Math.min(...ROUTES.map((r) => r.cost));
const FASTER = ROUTES.find((r) => r.cost === BEST_OFFERED);
const ALL_ROUTES = allSimplePaths()
  .map((path) => ({ path, cost: pathCost(path) }))
  .sort((a, b) => a.cost - b.cost || a.path.length - b.path.length);

const name = (id) => vertexById(id).short ?? id;
const arrow = (path) => path.map(name).join(" → ");

/* ---------- Text that is shown and also read aloud ---------- */

const CALL_TEXT =
  "Emergency call. A patient needs to get to the hospital as fast as possible. You are the dispatcher. " +
  "Two routes from the ambulance depot to the hospital are suggested, and each uses three roads. " +
  "The number on each road is the driving time in minutes. Which route do you think is faster?";

const REVEAL_TEXT = ROUTES.map((r) => `${r.label}: ${describePath(r.path)}`).join(" ");

const DEFINITION_TEXT =
  "The cost of a path is the sum of the weights of its edges. " +
  "The shortest path between two vertices is the path with the lowest total cost. It is not the path with the fewest edges. " +
  "The single-source shortest path problem asks: given a weighted graph and one start vertex, called the source, " +
  "what is the shortest path from the source to every other vertex?";

const CHALLENGE_TEXT =
  "Your turn. Build your own route from the depot to the hospital that is faster than both suggested routes. " +
  "Tap a junction next to the ambulance to drive there. You cannot visit the same junction twice.";

/* ---------- Small building blocks ---------- */

const MODES = {
  visual: { Icon: Eye, label: "See" },
  aural: { Icon: Volume2, label: "Listen" },
  read: { Icon: BookOpen, label: "Read" },
  kinaesthetic: { Icon: Hand, label: "Do" },
};

function ModeTags({ modes }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Ways to learn in this step">
      {modes.map((m) => {
        const { Icon, label } = MODES[m];
        return (
          <li
            key={m}
            className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
          >
            <Icon size={13} aria-hidden="true" />
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function StepHeader({ step, kolb, title, modes, readText }) {
  return (
    <div className="mb-4 space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
        Step {step} of 4 · {kolb}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        {readText && <ReadAloud text={readText} />}
      </div>
      <ModeTags modes={modes} />
    </div>
  );
}

function Legend({ kinds }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600" aria-label="Map key">
      {kinds.map(({ kind, text }) => {
        const s = ROUTE_STYLES[kind];
        return (
          <li key={kind} className="flex items-center gap-2">
            <svg width="40" height="10" aria-hidden="true">
              <line
                x1="3"
                y1="5"
                x2="37"
                y2="5"
                stroke={s.stroke}
                strokeWidth="5"
                strokeDasharray={s.dash}
                strokeLinecap="round"
              />
            </svg>
            {text} <span className="sr-only">({s.label})</span>
          </li>
        );
      })}
    </ul>
  );
}

const btn =
  "rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnSecondary = `${btn} border border-slate-300 bg-white text-slate-700 hover:bg-slate-100`;

/* ---------- Step 2: reflection question ---------- */

const REFLECT_OPTIONS = [
  {
    id: "roads",
    text: "The number of roads it uses",
    feedback:
      "Not quite. Both routes use exactly 3 roads, yet one takes 2 minutes longer. Counting roads does not tell you the time.",
  },
  {
    id: "total",
    text: "The total of the driving times on its roads",
    feedback:
      "Yes. A route's time is the sum of the times on its roads. In graph terms, the cost of a path is the sum of its edge weights.",
    correct: true,
  },
  {
    id: "first",
    text: "How short the first road is",
    feedback:
      "Not quite. Route 2 starts with the shortest road (2 minutes) but then takes a slow 10-minute road. One short road does not make a fast route.",
  },
];

function Reflection() {
  const [picked, setPicked] = useState(null);
  const choice = REFLECT_OPTIONS.find((o) => o.id === picked);

  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <fieldset>
        <legend className="mb-3 font-semibold text-slate-900">
          Think about it: both routes use 3 roads. So what decides how fast a route is?
        </legend>
        <div className="space-y-2">
          {REFLECT_OPTIONS.map((o) => (
            <label
              key={o.id}
              className={
                "flex cursor-pointer items-center gap-3 rounded-lg border-2 bg-white p-3 transition " +
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 " +
                (picked === o.id
                  ? o.correct
                    ? "border-emerald-500"
                    : "border-amber-500"
                  : "border-slate-200 hover:border-indigo-300")
              }
            >
              <input
                type="radio"
                name="reflect"
                className="sr-only"
                checked={picked === o.id}
                onChange={() => setPicked(o.id)}
              />
              <span aria-hidden="true" className="font-bold text-slate-400">
                {picked === o.id ? (o.correct ? "✓" : "✕") : "○"}
              </span>
              {o.text}
            </label>
          ))}
        </div>
      </fieldset>
      <p className="mt-3 min-h-[1.5em] text-sm leading-6" aria-live="polite">
        {choice?.feedback}
      </p>
    </div>
  );
}

/* ---------- Step 4: build a route ---------- */

function RouteBuilder({ onSolved }) {
  const [route, setRoute] = useState([START]);
  const [tries, setTries] = useState([]); // costs of finished routes that were not the fastest

  const end = route[route.length - 1];
  const arrived = end === TARGET;
  const cost = pathCost(route);
  const canDriveTo = (id) => !arrived && !route.includes(id) && areNeighbours(end, id);
  const stuck = !arrived && !["A", "B", "C", "D", "E", "H"].some(canDriveTo);

  const driveTo = (id) => {
    const next = [...route, id];
    setRoute(next);
    if (id === TARGET) {
      const total = pathCost(next);
      if (total === SHORTEST_COST) onSolved(next);
      else setTries((t) => [...t, total]);
    }
  };
  const undo = () => setRoute((r) => (r.length > 1 ? r.slice(0, -1) : r));
  const reset = () => setRoute([START]);

  let verdict = null;
  if (arrived) {
    if (cost === SHORTEST_COST) {
      verdict = {
        tone: "good",
        text: `${cost} minutes. That is the fastest possible route! It uses ${route.length - 1} roads, more than either suggested route, yet it is ${BEST_OFFERED - cost} minutes faster than ${FASTER.label}.`,
      };
    } else if (cost < BEST_OFFERED) {
      verdict = {
        tone: "close",
        text: `${cost} minutes. You beat both suggested routes! But there is a route that is faster still. Can you find it?`,
      };
    } else {
      verdict = {
        tone: "try",
        text: `${cost} minutes. That is not faster than ${FASTER.label} (${BEST_OFFERED} minutes). Undo a few roads or start over and try another way.`,
      };
    }
  }

  const showHint = !(arrived && cost === SHORTEST_COST) && tries.length >= 2;

  const toneClasses = {
    good: "border-emerald-500 bg-emerald-50 text-emerald-900",
    close: "border-indigo-500 bg-indigo-50 text-indigo-900",
    try: "border-amber-500 bg-amber-50 text-amber-900",
  };

  return (
    <div>
      <TownMap
        highlights={[{ path: route, kind: "built" }]}
        current={end}
        inRoute={route}
        clickable={canDriveTo}
        onVertexClick={driveTo}
        ariaLabel="Town map. Press a junction next to the ambulance to drive there."
      />
      <Legend kinds={[{ kind: "built", text: "Your route" }]} />

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
        {/* Step log: the route in words, announced to screen readers */}
        <div className="anim-note" aria-live="polite">
          <p className="font-semibold text-slate-900">Your route: {arrow(route)}</p>
          <p className="mt-1 text-sm">
            {route.length === 1
              ? "The ambulance is at the depot. Tap a junction joined to it by a road."
              : `Time so far: ${costSum(route)} = ${cost} minutes.`}
          </p>
          {stuck && (
            <p className="mt-1 text-sm font-semibold text-amber-800">
              Dead end: every road from here leads somewhere you have already been. Press Undo.
            </p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <button className={btnSecondary} onClick={undo} disabled={route.length === 1}>
            <Undo2 size={15} className="mr-1 inline" aria-hidden="true" />
            Undo
          </button>
          <button className={btnSecondary} onClick={reset} disabled={route.length === 1}>
            <RotateCcw size={15} className="mr-1 inline" aria-hidden="true" />
            Start over
          </button>
        </div>
      </div>

      {verdict && (
        <div className={`mt-4 rounded-xl border-l-4 p-4 ${toneClasses[verdict.tone]}`} role="status">
          <p className="font-semibold">{verdict.text}</p>
          {verdict.tone !== "good" && (
            <button className={`${btnPrimary} mt-3`} onClick={reset}>
              Try another route
            </button>
          )}
        </div>
      )}

      {showHint && (
        <div className="mt-4 flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          <Lightbulb size={18} className="shrink-0 text-amber-500" aria-hidden="true" />
          <p>
            <span className="font-semibold">Hint:</span> look for the cheapest roads in the middle of town. The road
            between C and D takes only 2 minutes. How can the ambulance reach C quickly, and where can it go after D?
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Closing: why trying every route does not scale ---------- */

function AllRoutes({ best }) {
  const [open, setOpen] = useState(false);
  const fewestRoads = Math.min(...ALL_ROUTES.map((r) => r.path.length - 1));

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="mb-2 text-2xl font-bold text-slate-900">Why not just try every route?</h2>
      <p className="leading-7">
        You found the answer by trying routes. This small town has <strong>{ALL_ROUTES.length} different routes</strong>{" "}
        from the depot to the hospital that never visit a junction twice. A real city has thousands of junctions, and the
        number of routes grows so fast that no computer could list them all.
      </p>
      <p className="mt-3 leading-7">
        In the next section you will meet <strong>Dijkstra's algorithm</strong>, which finds the shortest path without
        trying every route.
      </p>

      <button className={`${btnSecondary} mt-4`} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide" : "Show"} all {ALL_ROUTES.length} routes
      </button>

      {open && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Every route from the depot to the hospital, fastest first</caption>
            <thead className="border-b border-slate-300 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th scope="col" className="py-2 pr-4">Route</th>
                <th scope="col" className="py-2 pr-4">Roads</th>
                <th scope="col" className="py-2 pr-4">Time (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {ALL_ROUTES.map((r) => {
                const isBest = r.cost === SHORTEST_COST;
                return (
                  <tr key={r.path.join("")} className={`border-b border-slate-100 ${isBest ? "bg-emerald-50 font-semibold" : ""}`}>
                    <td className="py-2 pr-4">
                      {arrow(r.path)}
                      {isBest && <span className="ml-2 text-emerald-700">★ shortest</span>}
                    </td>
                    <td className="py-2 pr-4">
                      {r.path.length - 1}
                      {r.path.length - 1 === fewestRoads && <span className="ml-1 text-slate-500">(fewest)</span>}
                    </td>
                    <td className="py-2 pr-4">
                      {costSum(r.path)} = {r.cost}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {best && (
            <p className="mt-3 text-sm text-slate-600">
              Your route, {arrow(best)}, is the one marked ★.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ---------- The page ---------- */

function Short() {
  const [guess, setGuess] = useState(null);
  const [solvedRoute, setSolvedRoute] = useState(null);

  const guessed = ROUTES.find((r) => r.id === guess);
  const guessedRight = guessed?.cost === BEST_OFFERED;

  return (
    <div className="mx-auto max-w-5xl space-y-8 text-slate-700">
      <header>
        <h1 className="text-4xl font-bold text-slate-900">The Shortest Path Problem</h1>
      </header>

      <section className="rounded-xl border border-indigo-500 bg-indigo-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold text-indigo-900">Learning Objectives</h2>
        <p className="mb-3">By the end of this section you should be able to:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>Calculate the total cost of a path by adding its edge weights.</li>
          <li>Explain why the path with the fewest edges is not always the shortest path.</li>
          <li>State the single-source shortest path problem.</li>
          <li>Explain why trying every route does not work for large graphs.</li>
        </ol>
      </section>

      {/* Step 1: Concrete experience */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <StepHeader
          step={1}
          kolb="Experience it"
          title="Emergency call"
          modes={["visual", "aural", "read", "kinaesthetic"]}
          readText={CALL_TEXT}
        />
        <div className="mb-4 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <Siren size={20} className="shrink-0 text-red-600" aria-hidden="true" />
          <p className="leading-7">
            A patient needs to get to the hospital as fast as possible. <strong>You are the dispatcher.</strong> Two
            routes from the ambulance depot to the hospital are suggested. Each uses 3 roads, and the number on each road
            is the driving time in minutes.
          </p>
        </div>

        <TownMap
          highlights={ROUTES.map((r) => ({ path: r.path, kind: r.id }))}
          ariaLabel={`Town map with two suggested routes. ${ROUTES.map(
            (r) => `${r.label} goes ${arrow(r.path)}.`
          ).join(" ")}`}
        />
        <Legend
          kinds={ROUTES.map((r) => ({ kind: r.id, text: `${r.label}: ${arrow(r.path)}` }))}
        />

        <fieldset className="mt-5">
          <legend className="mb-3 font-semibold text-slate-900">Which route gets the ambulance there faster?</legend>
          <div className="flex flex-wrap gap-3">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                className={guess === r.id ? btnPrimary : btnSecondary}
                onClick={() => setGuess(r.id)}
                aria-pressed={guess === r.id}
                disabled={guess !== null}
              >
                {r.label}, {r.via}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      {/* Step 2: Reflective observation */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <StepHeader
          step={2}
          kolb="Look back"
          title="What happened?"
          modes={["read", "aural"]}
          readText={guess ? REVEAL_TEXT : undefined}
        />

        {!guess ? (
          <p className="anim-note">Make your guess in step 1 to see what happened.</p>
        ) : (
          <>
            <p role="status" className={`mb-4 font-semibold ${guessedRight ? "text-emerald-700" : "text-amber-800"}`}>
              {guessedRight
                ? `Good call: ${guessed.label} is faster.`
                : `${guessed.label} looked good, but ${FASTER.label} is faster.`}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {ROUTES.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-xl border-2 p-5 ${r.cost === BEST_OFFERED ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                >
                  <p className="font-semibold text-slate-900">
                    {r.label}: {arrow(r.path)}
                    {r === guessed && <span className="ml-2 text-xs font-bold uppercase text-indigo-600">your guess</span>}
                  </p>
                  <p className="mt-2 text-sm">{r.path.length - 1} roads</p>
                  <p className="mt-1 text-lg">
                    {costSum(r.path)} = <strong>{r.cost} minutes</strong>
                    {r.cost === BEST_OFFERED && <span className="ml-2 text-emerald-700">✓ faster</span>}
                  </p>
                </div>
              ))}
            </div>

            <Reflection />
          </>
        )}
      </section>

      {/* Step 3: Abstract conceptualisation */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <StepHeader
          step={3}
          kolb="The idea"
          title="What is the shortest path problem?"
          modes={["read", "aural", "visual"]}
          readText={DEFINITION_TEXT}
        />

        <dl className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-5">
            <dt className="mb-2 font-semibold text-indigo-700">Cost of a path</dt>
            <dd className="leading-7">
              The <strong>sum of the weights</strong> of its edges. Roads of 4, 3 and 2 minutes cost 4 + 3 + 2 = 9.
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <dt className="mb-2 font-semibold text-indigo-700">Shortest path</dt>
            <dd className="leading-7">
              The path between two vertices with the <strong>lowest total cost</strong>. Not the one with the fewest
              edges.
            </dd>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <dt className="mb-2 font-semibold text-indigo-700">Source</dt>
            <dd className="leading-7">
              The vertex where every path starts. Here it is the ambulance depot, <strong>S</strong>.
            </dd>
          </div>
        </dl>

        <div className="mt-5 rounded-xl border border-indigo-500 bg-indigo-50 p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-indigo-700">Definition</p>
          <p className="leading-7 text-indigo-950">
            The <strong>single-source shortest path problem</strong>: given a weighted graph and one start vertex (the{" "}
            <em>source</em>), find the shortest path from the source to <strong>every other vertex</strong>.
          </p>
        </div>

        <p className="mt-4 leading-7">
          A routing app solves this problem every time it plans a trip. The weights can be minutes, kilometres or rand,
          but the question is always the same: which path has the lowest total cost?
        </p>
      </section>

      {/* Step 4: Active experimentation */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <StepHeader
          step={4}
          kolb="Try it yourself"
          title="Beat both routes"
          modes={["kinaesthetic", "visual", "read", "aural"]}
          readText={CHALLENGE_TEXT}
        />
        <p className="mb-4 leading-7">
          Build your own route from the depot to the hospital that is faster than both suggested routes. Tap a junction
          with a dashed ring to drive there. You cannot visit the same junction twice.
        </p>
        <RouteBuilder onSolved={setSolvedRoute} />
      </section>

      <AllRoutes best={solvedRoute} />

      {/* Mini Test */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-2xl font-bold text-slate-900">Mini Test</h2>
        <p className="mb-4">Test your understanding of the shortest path problem.</p>
        <QuizRunner section="shortest-path" />
      </section>
    </div>
  );
}

export default Short;
