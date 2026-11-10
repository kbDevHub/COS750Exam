# COS212 App: Graphs and Dijkstra's Algorithm

A pre-lecture, tutor-style learning app for the University of Pretoria's COS212 (Data Structures and Algorithms) module. Built for the COS750 Educational Software Development examination.

The app teaches **graphs** (nodes/vertices, edges, weighted graphs and paths) and **Dijkstra's algorithm** to students who have no prior knowledge of the topic. Each section ends with a mini test that students must pass before moving on, and they can retry as many times as they like.

## Team

| Name | Student number |
|---|---|
| Kaylee Bibis| u22547097|
| Shahil Parbhoo Narsing | u21746134 |
| Rosemary Erawemen| U22666240 |
| Lwando Msindo |  U21507067|
| Simphiwe Jessica Zither | U20463104 |

**Group name:** Geekers

## Features

- Learning sections: Introduction, Nodes, Edges, Weighted Graphs and Paths, Dijkstra's Algorithm
- Interactive edge explorer (toggle weights and directions, click an edge to inspect it)
- Step-by-step Dijkstra animation
- Gated mini tests: a student must answer correctly to continue, with unlimited retries
- Escalating support: a hint after the first wrong answer, a short re-teach after the second
- Answer keys are kept on the server, and answers are marked by the backend

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Python, FastAPI, Uvicorn |
| Question data | JSON file (`backend/data/questions.json`) |

## Project structure

```
COS750Exam/
├── frontend/                  React app
│   ├── scripts/
│   │   └── start-api.cjs      Starts the backend (picks the right Python command for your OS)
│   ├── src/                   Components, section content and styles
│   ├── vite.config.js         Dev server and /api proxy to the backend
│   └── package.json
└── backend/                   Python API
    ├── main.py                API routes
    ├── requirements.txt       Python dependencies
    └── data/
        └── questions.json     Quiz questions and answer keys
```

## Prerequisites

Install these before you start:

1. **Node.js** (LTS version): https://nodejs.org
2. **Python 3.9 or newer**: https://www.python.org
   - On Windows, tick **"Add Python to PATH"** during installation.

Check that both work:

```bash
node --version
python3 --version      # Mac / Linux
py --version           # Windows
```

## Setup (first time only)

**1. Clone the repository**

```bash
git clone <repository-url>
cd COS750Exam
```

**2. Install the backend dependencies**

```bash
cd backend
python3 -m pip install -r requirements.txt     # Mac / Linux
py -m pip install -r requirements.txt          # Windows
```

If you use a virtual environment, activate it first.

**3. Install the frontend dependencies**

```bash
cd ../frontend
npm install
```

## Running the app

From the `frontend/` folder:

```bash
npm run dev
```

This starts **both** the frontend and the backend. In the terminal you should see a `[web]` line with the local address (usually `http://localhost:5173`) and an `[api]` line saying that Uvicorn is running on port 8000. Open the `[web]` address in your browser.

Press `Ctrl + C` to stop both.

### Running the two parts separately (for debugging)

```bash
npm run dev:web      # frontend only
npm run dev:api      # backend only
```

To check the backend on its own, open `http://127.0.0.1:8000/docs`. This page lets you try each endpoint.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/questions/{section}` | Returns the questions for a section (without answers) |
| POST | `/api/check-answer` | Takes `{ questionId, answer }` and returns `{ correct: true/false }` |

## Adding or editing content

### Section text

Section content is written as data in `sections.js`. Each section is a list of blocks (`heading`, `paragraph`, `list`, `numbered`, `objectives`, `divider`, `animation`, `interactive`, `quiz`). To add a mini test to a section, add this block at the end of its content:

```js
{ type: "quiz", section: "edges" }
```

### Quiz questions

Questions live in `backend/data/questions.json`:

```json
{
  "id": "edges-1",
  "section": "edges",
  "question": "What is an edge in a graph?",
  "options": ["A connection between two nodes", "A single item", "..."],
  "answer": "A connection between two nodes",
  "hint": "Look at the lines in the diagram. What do they join?",
  "reteach": "An edge is a line joining two nodes..."
}
```

Rules:
- `section` must match the section's `id` in `sections.js` exactly (`nodes`, `edges`, `weights`, `dijkstra`).
- `id` must be unique and follow the `section-number` pattern.
- `answer` must be copied **exactly** from one of the `options`. Marking is a plain text comparison.
- The backend reads the file when it starts, so **restart `npm run dev` after editing it**.
- Check the JSON syntax (commas between questions, none after the last one). A syntax error stops the backend from starting.

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| "Couldn't load the questions" in the app | The backend isn't running. Check the `[api]` lines in the terminal for an error. |
| 502 Bad Gateway in the browser console | The backend crashed or isn't reachable. Read the `[api]` error. |
| "Python was not found" | Install Python and make sure it's on your PATH. Restart the terminal afterwards. |
| `No module named fastapi` or `uvicorn` | Run the pip install step again, using the same Python that runs the app. |
| New questions don't appear | Restart `npm run dev`. |
| A correct answer is marked wrong | The `answer` text doesn't exactly match an option (check dashes, spaces and capitals). |
| Quiz shows no questions for a section | The `section` value in `questions.json` doesn't match the section `id`. |
| Port already in use | Stop any other program using port 8000 or 5173, or close old terminals still running the app. |

## Generative AI acknowledgement

Generative AI (Claude, by Anthropic) was used to help with parts of the app's content and code. The tool and the prompts used are documented in the ID document, as required by the COS750 examination specification.

## Documentation

- Software Engineering (SE) document: _add link or file name_
- Instructional Design (ID) document: _add link or file name_
