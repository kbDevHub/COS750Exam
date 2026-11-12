import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MAX_ATTEMPTS = 2;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const SECTION_TITLES = {
  "/": "Introduction",
  "/nodes": "1.1 Graph: Nodes",
  "/edges": "1.2 Graph: Edges",
  "/weights": "1.3 Graph: Weighted Graphs",
  "/shortest-path": "2.1 Dijkstra algorithm: Shortest path problem",
  "/dijkstra": "2.2 Dijkstra algorithm: Dijkstra algorithm",
  "/test": "Test Yourself",
};

const getNextChapter = (section) => {
  const paths = Object.keys(SECTION_TITLES);

  const currentPath = paths.find(
    (path) => path.replace("/", "") === section
  );

  if (!currentPath) return null;

  const currentIndex = paths.indexOf(currentPath);

  if (currentIndex === paths.length - 1) return null;

  const nextPath = paths[currentIndex + 1];

  return {
    path: nextPath,
    title: SECTION_TITLES[nextPath],
  };
};

const btnPrimary =
  "rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm " +
  "transition hover:bg-indigo-700 active:scale-[0.98] focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none";

const btnSecondary =
  "rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 " +
  "transition hover:bg-slate-100 active:scale-[0.98] focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2";

export default function QuizRunner({ section, onPass = () => { } }) {
  const [questions, setQuestions] = useState([]);
  const [loadError, setLoadError] = useState(false);

  const [qi, setQi] = useState(0);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  // "answering" | "wrong" | "correct" | "failed"
  const [status, setStatus] = useState("answering");
  const [wrongCount, setWrongCount] = useState(0);
  const [missed, setMissed] = useState([]); // ids not answered within MAX_ATTEMPTS
  const navigate = useNavigate();
  const nextChapter = getNextChapter(section);

  // Load questions from the backend
  useEffect(() => {
    fetch(`/api/questions/${section}?side=learning`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) setOptions(shuffle(data[0].options));
      })
      .catch(() => setLoadError(true));
  }, [section]);

  // Guards (after all hooks)
  if (loadError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
        Couldn't load the questions. Is the backend running?
      </div>
    );
  if (questions.length === 0)
    return (
      <div className="animate-pulse rounded-xl bg-slate-100 p-6 text-sm text-slate-500">
        Loading questions...
      </div>
    );

  const q = questions[qi];
  const isLast = qi === questions.length - 1;
  const done = status === "correct" || status === "failed";
  const finished = qi + (done ? 1 : 0);
  const progress = (finished / questions.length) * 100;
  const attemptNumber = Math.min(wrongCount + (status === "correct" ? 0 : 1), MAX_ATTEMPTS);
  const isMiss = status === "wrong" || status === "failed";

  const submit = async () => {
    try {
      const res = await fetch("/api/check-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id, answer: options[selected] }),
      });
      const { correct } = await res.json();
      if (correct) {
        setStatus("correct");
      } else {
        const w = wrongCount + 1;
        setWrongCount(w);
        if (w >= MAX_ATTEMPTS) {
          setMissed((m) => [...m, q.id]);
          setStatus("failed");
        } else {
          setStatus("wrong");
        }
      }
    } catch {
      setLoadError(true);
    }
  };

  const retry = () => {
    setOptions(shuffle(q.options));
    setSelected(null);
    setStatus("answering");
  };

  const next = () => {
    if (isLast) {
      onPass(missed);
      return;
    }

    const nq = questions[qi + 1];
    setQi(qi + 1);
    setOptions(shuffle(nq.options));
    setSelected(null);
    setStatus("answering");
    setWrongCount(0);
  };

  const optionClasses = (i) => {
    const base =
      "group flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3.5 transition " +
      "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 has-[:focus-visible]:ring-offset-2";
    if (selected !== i)
      return `${base} border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50`;
    if (status === "correct") return `${base} border-emerald-500 bg-emerald-50`;
    if (isMiss) return `${base} border-amber-500 bg-amber-50`;
    return `${base} border-indigo-500 bg-indigo-50`;
  };

  const badgeClasses = (i) => {
    const base =
      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition";
    if (selected !== i) return `${base} bg-slate-100 text-slate-600 group-hover:bg-indigo-100`;
    if (status === "correct") return `${base} bg-emerald-500 text-white`;
    if (isMiss) return `${base} bg-amber-500 text-white`;
    return `${base} bg-indigo-600 text-white`;
  };

  const badgeContent = (i) => {
    if (selected === i && status === "correct") return "✓";
    if (selected === i && isMiss) return "✕";
    return String.fromCharCode(65 + i);
  };

  const proceed = () => {
    const finalMissed = status === "wrong" ? [...missed, q.id] : missed;
    if (status === "wrong") setMissed(finalMissed);

    if (isLast) {
      onPass(finalMissed);
      if (nextChapter) navigate(nextChapter.path);
      return;
    }

    const nq = questions[qi + 1];
    setQi(qi + 1);
    setOptions(shuffle(nq.options));
    setSelected(null);
    setStatus("answering");
    setWrongCount(0);
  };

  const proceedLabel = isLast
    ? nextChapter
      ? `Next chapter: ${nextChapter.title} →`
      : "Finish"
    : "Next question →";

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-50 p-5 sm:p-6">
      {/* Header + progress */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>Check your understanding</span>
          <span>
            Question {qi + 1} of {questions.length}
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={finished}
          aria-label="Quiz progress"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Attempt indicator */}
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <span>
            Attempt {attemptNumber} of {MAX_ATTEMPTS}
          </span>
          {Array.from({ length: MAX_ATTEMPTS }).map((_, n) => (
            <span
              key={n}
              aria-hidden="true"
              className={
                "h-2.5 w-2.5 rounded-full " +
                (n < attemptNumber ? "bg-indigo-600" : "bg-slate-300")
              }
            />
          ))}
        </div>
      </div>

      {/* Question + options */}
      <fieldset>
        <legend className="mb-4 text-lg font-semibold leading-snug text-slate-900">
          {q.question}
        </legend>

        <div className="space-y-2.5">
          {options.map((o, i) => (
            <label key={o} className={optionClasses(i)}>
              <input
                type="radio"
                name={`q-${q.id}`}
                className="sr-only"
                checked={selected === i}
                disabled={status !== "answering"}
                onChange={() => setSelected(i)}
              />
              <span className={badgeClasses(i)} aria-hidden="true">
                {badgeContent(i)}
              </span>
              <span className="text-slate-800">{o}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Actions + feedback */}
      <div className="mt-5" aria-live="polite">
        {status === "answering" && (
          <button className={btnPrimary} onClick={submit} disabled={selected === null}>
            Submit
          </button>
        )}

        {status === "correct" && (
          <button className={btnPrimary} onClick={proceed}>
            {proceedLabel}
          </button>
        )}

        {status === "wrong" && (
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900">Not quite. You have one more attempt.</p>
            <div className="mt-3 rounded-lg bg-white/70 p-3 text-sm text-slate-700">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-700">
                Hint
              </span>
              {q.hint}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className={btnPrimary} onClick={retry}>
                Try again
              </button>
              <button className={btnSecondary} onClick={proceed}>
                Skip: {proceedLabel}
              </button>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <p className="font-semibold text-amber-900">
              That's okay. Let's go through it together before moving on.
            </p>
            <div className="mt-3 rounded-lg bg-white/70 p-3 text-sm text-slate-700">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-700">
                Let's revisit
              </span>
              {q.reteach}
            </div>
            <button className={`${btnPrimary} mt-4`} onClick={proceed}>
              {proceedLabel}
            </button>
          </div>
        )}
      </div>
    </div >
  );
}