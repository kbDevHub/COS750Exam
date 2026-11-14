import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SECTION_TITLES } from "../data/SectionTitles";

export default function BadgeModal({ badge, onClose }) {
    const closeRef = useRef(null);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        closeRef.current?.focus();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/60 p-4"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="badge-title"
                className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 rounded p-1.5 text-gray-400 hover:text-gray-700"
                    aria-label="Close"
                >
                    ✕
                </button>

                <img
                    src={badge.img}
                    alt=""
                    className={"mx-auto h-56 w-56 object-contain " + (badge.earned ? "" : "opacity-40 grayscale")}
                />

                <h2 id="badge-title" className="mt-3 text-center text-2xl font-bold text-gray-900">
                    {badge.title}
                </h2>
                <p className="text-center text-sm text-gray-600">{badge.desc}</p>
                <p className="mt-2 text-center text-sm font-semibold">
                    {badge.earned ? (
                        <span className="text-emerald-700">✓ Badge earned</span>
                    ) : (
                        <span className="text-gray-500">
                            {badge.done} of {badge.total} sections complete
                        </span>
                    )}
                </p>

                <h3 className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Sections
                </h3>
                <ul className="space-y-1.5">
                    {badge.paths.map((p) => {
                        const done = badge.doneMap[p];
                        return (
                            <li
                                key={p}
                                className={
                                    "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm " +
                                    (done ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50")
                                }
                            >
                                <span
                                    aria-hidden="true"
                                    className={
                                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                                        (done ? "bg-emerald-500 text-white" : "bg-gray-300 text-white")
                                    }
                                >
                                    {done ? "✓" : ""}
                                </span>
                                <span className="flex-1 text-gray-800">{SECTION_TITLES[p] ?? p}</span>
                                <span className="text-xs font-semibold">
                                    {done ? (
                                        <span className="text-emerald-700">Completed</span>
                                    ) : (
                                        <Link
                                            to={p}
                                            onClick={onClose}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            Go to section
                                        </Link>
                                    )}
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <button className="anim-btn anim-btn-primary mt-5 w-full" ref={closeRef} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}