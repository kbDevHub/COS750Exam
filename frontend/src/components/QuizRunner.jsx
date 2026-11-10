import { useState, useEffect } from "react";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function QuizRunner({ section, onPass }) {
  const [questions, setQuestions] = useState([]);
  const [loadError, setLoadError] = useState(false);

  const [qi, setQi] = useState(0);
  const [options, setOptions] = useState([]);          // now starts empty
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("answering");
  const [wrongCount, setWrongCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  // 1. LOAD the questions from the backend when the quiz appears
  useEffect(() => {
    fetch(`/api/questions/${section}?side=learning`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data);
        if (data.length > 0) setOptions(shuffle(data[0].options));
      })
      .catch(() => setLoadError(true));
  }, [section]);

  // 2. GUARDS: must come after all the hooks above, before using `questions`
  if (loadError) return <p>Couldn't load the questions. Is the backend running?</p>;
  if (questions.length === 0) return <p>Loading questions...</p>;

  const q = questions[qi];
  const isLast = qi === questions.length - 1;

  // 3. MARKING now asks the backend (async)
  const submit = async () => {
    setTotalAttempts((n) => n + 1);
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
        setWrongCount((n) => n + 1);
        setStatus("wrong");
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
    if (isLast) return onPass();
    const nq = questions[qi + 1];
    setQi(qi + 1);
    setOptions(shuffle(nq.options));
    setSelected(null);
    setStatus("answering");
    setWrongCount(0);
  };

  return (
    <div className = "quiz">
      <strong>Check your understanding ({qi + 1}/{questions.length})</strong>
      <p>{q.question}</p>

      {/* 4. options are plain strings now, so {o} instead of {o.text} */}
      {options.map((o, i) => (
        <label key={o} className={"quiz-option" + (selected === i ? " selected" : "")}>
          <input type="radio" checked={selected === i} disabled={status !== "answering"} onChange={() => setSelected(i)} /> {o}
        </label>
      ))}

      {status === "answering" && <button className = "quiz-button" onClick={submit} disabled={selected === null}>Submit</button>}

      {status === "wrong" && (
        <div className="quiz-feedback wrong">
          <p>❌ Not quite.</p>
          {wrongCount === 1 && <p>💡 Hint: {q.hint}</p>}
          {wrongCount >= 2 && <p>📖 Let's revisit: {q.reteach}</p>}
          <button className= "quiz-button" onClick={retry}>Try again</button>
        </div>
      )}

      {status === "correct" && (
        <div className="quiz-feedback correct">
          <p>✅ Correct!{wrongCount > 0 ? " Well done for sticking with it." : ""}</p>
          <button className="quiz-button" onClick={next}>{isLast ? "Finish section 🎉" : "Next question →"}</button>
        </div>
      )}

      <small className="quiz-atttempts">Total attempts: {totalAttempts}</small>
    </div>
  );
}
