import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { NotebookText } from "lucide-react";

const STORAGE_KEY = "cos212-notes";
const HIDDEN_ON = ["/test"];

const SECTION_TITLES = {
    "/": "Introduction",
    "/nodes": "1.1 Graph - Nodes",
    "/edges": "1.2 Graph - Edges",
    "/weights": "1.3 Graph - Weighted Graphs",
    "/shortest-path": "2.1 Dijkstra algorithm - Shortest path problem",
    "/dijkstra": "2.2 Dijkstra algorithm - Dijkstra algorithm",
    "/test": "Test Yourself",
};

export default function NoteTaker() {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [saved, setSaved] = useState(true);
    const textareaRef = useRef(null);
    const { pathname } = useLocation();

    const focusAtEnd = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        const end = el.value.length;
        el.setSelectionRange(end, end);
        el.scrollTop = el.scrollHeight;
    };

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setNotes(stored);
        } catch {
            console.log("issue persisting notes");
        }
    }, []);

    useEffect(() => {
        setSaved(false);
        const t = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, notes);
            } catch {
                console.log("issue persisting notes");
            }
            setSaved(true);
        }, 500);
        return () => clearTimeout(t);
    }, [notes]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    useEffect(() => {
        if (open) focusAtEnd();
    }, [open]);

    const currentTitle = SECTION_TITLES[pathname] ?? "Notes";

    const addSectionTag = () => {
        const tag = `${notes && !notes.endsWith("\n") ? "\n\n" : ""}## ${currentTitle}\n`;
        setNotes((n) => n + tag);
        requestAnimationFrame(focusAtEnd);
    };

    const download = () => {
        const date = new Date().toISOString().slice(0, 10);
        const header = `COS212 Pre-class notes (${date})\n${"=".repeat(32)}\n\n`;
        const blob = new Blob([header + notes], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cos212-notes-${date}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const clear = () => {
        setNotes("");
    };

    const btn =
        "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 " +
        "transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
        "disabled:cursor-not-allowed disabled:opacity-40";

    if (HIDDEN_ON.includes(pathname)) return null;

    return (
        <div className="fixed right-4 top-4 z-50 flex flex-col items-end gap-2 font-mono">
            <button
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="note-panel"
                className="group relative flex border items-center justify-center rounded-lg p-2 text-black transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
                <NotebookText size={20} strokeWidth={1.8} />

                <span className="absolute right-full mr-2 whitespace-nowrap rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                    {open ? "Close" : "Open"}
                </span>
            </button>

            {open && (
                <div
                    id="note-panel"
                    role="dialog"
                    aria-label="Note taker"
                    className="w-[min(92vw,360px)] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">Notes</h2>
                        <span className="text-xs text-slate-400" aria-live="polite">
                            {saved ? "Saved" : "Saving..."}
                        </span>
                    </div>

                    <p className="mb-2 text-xs text-slate-500">
                        You are on: <span className="font-semibold text-slate-700">{currentTitle}</span>
                    </p>

                    <label htmlFor="note-text" className="sr-only">
                        Write your notes here
                    </label>
                    <textarea
                        id="note-text"
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write quick notes or questions you would like to ask in class..."
                        rows={10}
                        className="w-full resize-y rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button className={btn} onClick={addSectionTag}>
                            + Add section title
                        </button>
                        <button className={btn} onClick={download} disabled={notes.trim() === ""}>
                            ⬇ Download
                        </button>
                        <button className={`${btn} ml-auto text-slate-500`} onClick={clear} disabled={notes === ""}>
                            Clear
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}