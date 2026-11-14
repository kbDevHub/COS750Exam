import { useEffect, useRef, useState } from "react";
import { Volume2, Square } from "lucide-react";

export default function ReadAloud({ text }) {
    const [speaking, setSpeaking] = useState(false);
    const current = useRef(null);
    const supported = typeof window !== "undefined" && "speechSynthesis" in window;

    useEffect(() => () => {
        if (current.current) window.speechSynthesis.cancel();
    }, []);

    if (!supported) return null;

    const toggle = () => {
        window.speechSynthesis.cancel();
        if (speaking) {
            setSpeaking(false);
            return;
        }
        const u = new SpeechSynthesisUtterance(text);
        u.onend = u.onerror = () => {
            if (current.current === u) {
                current.current = null;
                setSpeaking(false);
            }
        };
        current.current = u;
        window.speechSynthesis.speak(u);
        setSpeaking(true);
    };

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={speaking}
            className={
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 align-middle text-sm font-semibold " +
                "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 " +
                (speaking
                    ? "border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border-indigo-200 bg-white text-indigo-700 shadow-sm hover:border-indigo-300 hover:bg-indigo-50")
            }
        >
            {speaking ? (
                <Square size={14} fill="currentColor" aria-hidden="true" />
            ) : (
                <Volume2 size={16} aria-hidden="true" />
            )}
            {speaking ? "Stop" : "Listen"}
        </button>
    );
}
