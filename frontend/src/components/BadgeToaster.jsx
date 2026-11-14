import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useBadges } from "../utils/useBadges";
import { UNIT_BADGES } from "../utils/badges";

const COLORS = ["#f59e0b", "#fbbf24", "#6366f1", "#10b981", "#ec4899", "#38bdf8"];

function fireSideConfetti() {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => { };

    const end = Date.now() + 2000;
    let frame;

    const burst = (x, angle) =>
        confetti({
            particleCount: 60,
            angle,
            spread: 70,
            startVelocity: 55,
            origin: { x, y: 0.7 },
            colors: COLORS,
            zIndex: 100,
        });
    burst(0, 60);
    burst(1, 120);

    const stream = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors: COLORS, zIndex: 100 });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors: COLORS, zIndex: 100 });
        if (Date.now() < end) frame = requestAnimationFrame(stream);
    };
    stream();

    return () => cancelAnimationFrame(frame);
}

export default function BadgeToaster() {
    const { earnedIds } = useBadges();
    const seen = useRef(null);
    const [queue, setQueue] = useState([]);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (seen.current === null) {
            seen.current = new Set(earnedIds);
            return;
        }
        const fresh = earnedIds.filter((id) => !seen.current.has(id));
        seen.current = new Set(earnedIds);
        if (fresh.length) {
            setQueue((q) => [
                ...q,
                ...fresh
                    .map((id) => UNIT_BADGES.find((b) => b.id === id))
                    .filter(Boolean)
                    .map((b) => ({ ...b, key: b.id + Date.now() })),
            ]);
        }
    }, [earnedIds]);

    const current = queue[0] ?? null;
    const dismiss = () => setQueue((q) => q.slice(1));

    useEffect(() => {
        if (!current) return;
        const stop = fireSideConfetti();
        buttonRef.current?.focus();

        const onKey = (e) => e.key === "Escape" && dismiss();
        document.addEventListener("keydown", onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            stop();
            confetti.reset();
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [current?.key]);

    if (!current) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4"
            onClick={dismiss}
        >
            <style>{`
        @keyframes badge-pop {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { opacity: 1; transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes badge-glow {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(251,191,36,0.5)); }
          50%      { filter: drop-shadow(0 0 28px rgba(251,191,36,0.95)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .badge-pop, .badge-glow { animation: none !important; }
        }
      `}</style>

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="badge-earned-title"
                aria-describedby="badge-earned-desc"
                onClick={(e) => e.stopPropagation()}
                className="badge-pop w-full max-w-md rounded-3xl border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-2xl"
                style={{ animation: "badge-pop 0.5s ease-out" }}
            >
                <p className="text-sm font-bold uppercase tracking-widest text-green-700">
                    Badge earned!
                </p>

                <img
                    src={current.img}
                    alt=""
                    className="badge-glow mx-auto my-5 h-56 w-56 object-contain"
                    style={{ animation: "badge-glow 2s ease-in-out infinite" }}
                />

                <h2 id="badge-earned-title" className="text-3xl font-bold text-slate-900">
                    {current.title}
                </h2>
                <p id="badge-earned-desc" className="mt-2 text-slate-600">
                    {current.desc}
                </p>

                <button
                    ref={buttonRef}
                    onClick={dismiss}
                    className="mt-6 w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {queue.length > 1 ? `Awesome! (${queue.length - 1} more)` : "Awesome!"}
                </button>
            </div>
        </div>
    );
}