import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# Load the questions once, when the server starts.
# Path(__file__) makes this work no matter which folder you run it from.
DATA_FILE = Path(__file__).parent / "data" / "questions.json"
ALL_QUESTIONS = json.loads(DATA_FILE.read_text(encoding="utf-8"))

# Quick lookup: question id -> the full question (including the answer)
BY_ID = {q["id"]: q for q in ALL_QUESTIONS}


# ---------- Endpoint 1: send the questions for a section ----------
@app.get("/api/questions/{section}")
def get_questions(section: str, side: str = "learning"):
    chosen = [q for q in ALL_QUESTIONS if q["section"] == section and q.get("side","learning") == side]
    if not chosen:
        raise HTTPException(status_code=404, detail="No questions for that section")
    # Strip the answer key before it leaves the server
    return [{k: v for k, v in q.items() if k != "answer"} for q in chosen]


# ---------- Endpoint 2: mark one answer ----------
class Submission(BaseModel):
    questionId: str
    answer: str


@app.post("/api/check-answer")
def check_answer(sub: Submission):
    q = BY_ID.get(sub.questionId)
    if q is None:
        raise HTTPException(status_code=404, detail="Unknown question")
    return {"correct": sub.answer == q["answer"]}
