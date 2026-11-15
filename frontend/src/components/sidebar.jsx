
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Check, ChevronRight, Menu, X } from "lucide-react";
import { useProgress } from "./Progress";
import defaultAvatar from "../assets/user.png";

function Sidebar() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const units = [
        {
            title: "Unit 1: Graphs",
            sections: [
                { title: "1.1 Nodes", path: "/nodes" },
                { title: "1.2 Edges", path: "/edges" },
                { title: "1.3 Weighted Graphs", path: "/weights" },
                { title: "1.4 Adjacency Matrix", path: "/adjacency" },
                { title: "1.5 Connectivity", path: "/connected"},
                { title: "1.6 Cyclic graphs", path: "/cyclic"},
            ],
        },
        {
            title: "Unit 2: Dijkstra",
            sections: [
                { title: "2.1 Shortest path problem", path: "/shortest-path" },
                { title: "2.2 Dijkstra algorithm", path: "/dijkstra" },
            ],
        },
    ];

    const linkStyle = ({ isActive }) =>
        `block rounded-md px-3 py-2 text-sm transition-colors duration-200 ${isActive
            ? "bg-[#4b5563] text-white"
            : "text-gray-300 hover:bg-[#374151] hover:text-white"
        }`;

    const { completed } = useProgress();

    return (
        <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="sidebar"
            className="fixed left-4 top-4 z-40 flex items-center justify-center rounded-lg border bg-white p-2 text-black shadow-sm transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 md:hidden"
        >
            <Menu size={20} strokeWidth={1.8} />
        </button>

        {open && (
            <div
                className="fixed inset-0 z-40 bg-black/40 md:hidden"
                onClick={() => setOpen(false)}
                aria-hidden="true"
            />
        )}

        <aside
            id="sidebar"
            onClick={(e) => e.target.closest("a") && setOpen(false)}
            className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col overflow-hidden bg-[#1f2937] px-4 py-6 font-mono text-white transition-[translate,visibility] duration-200 md:visible md:translate-x-0 ${open ? "visible translate-x-0" : "invisible -translate-x-full"}`}
        >

            <div className="mb-8 flex items-start justify-between border-b border-gray-700 pb-5">
                <div>
                    <h2 className="mb-2 text-lg font-bold">
                        Pre-Class
                    </h2>
                    <p className="text-sm text-gray-400">
                        Graphs + Dijkstra
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="rounded-md p-1 text-gray-400 hover:bg-[#374151] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto">
                {/* Introduction */}
                <NavLink
                    to="/"
                    end
                    className={linkStyle}
                >
                    Introduction
                </NavLink>

                {/* Units */}
                <div className="mt-7">
                    {units.map((unit) => {
                        const doneCount = unit.sections.filter((s) => completed.includes(s.path)).length;
                        const total = unit.sections.length;
                        const pct = (doneCount / total) * 100;

                        return (
                            <div key={unit.title} className="mb-7">
                                <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                    {unit.title}
                                </p>

                                {/* Unit progress */}
                                <div className="mb-3 px-3">
                                    <div
                                        className="h-1.5 overflow-hidden rounded-full bg-gray-700"
                                        role="progressbar"
                                        aria-valuemin={0}
                                        aria-valuemax={total}
                                        aria-valuenow={doneCount}
                                        aria-label={`${unit.title} progress`}
                                    >
                                        <div
                                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="mt-1 text-[11px] text-gray-400">
                                        {doneCount} of {total} complete
                                    </p>
                                </div>

                                <ul className="ml-3 space-y-1 border-l border-gray-600">
                                    {unit.sections.map((section) => {
                                        const done = completed.includes(section.path);
                                        return (
                                            <li key={section.path}>
                                                <NavLink
                                                    to={section.path}
                                                    className={({ isActive }) =>
                                                        `${linkStyle({ isActive })} ml-2 flex items-center justify-between gap-2`
                                                    }
                                                >
                                                    <span>{section.title}</span>
                                                    {done ? (
                                                        <Check size={14} className="shrink-0 text-emerald-400" aria-label="Completed" />
                                                    ) : (
                                                        <ChevronRight size={14} className="shrink-0 text-gray-500" aria-hidden="true" />
                                                    )}
                                                </NavLink>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Sandbox */}
                <div className="mt-2 border-t border-gray-700 pt-4">
                    <NavLink to="/sandbox" className={linkStyle}>Tool: Sandbox</NavLink>
                </div>

                {/* Test Yourself */}
                <div className="mt-2 border-t border-gray-700 pt-4">
                    <NavLink to="/test" className={({ isActive }) =>
                      `${linkStyle({ isActive })} flex items-center justify-between gap-2`}>
                      <span>Test Yourself</span>
                      {completed.includes("/test") && (
                        <Check size={14} className="shrink-0 text-emerald-400" aria-label="Completed" />
                      )}
                    </NavLink>
                </div>
            </nav>

            {/* User profile */}
            <div className="mt-auto shrink-0 border-t border-gray-700 pt-5">
                <div className="flex items-center gap-3">

                    <img
                        src={defaultAvatar}
                        alt="User profile"
                        className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-gray-600"
                    />

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                            u12345678
                        </p>
                        <p className="text-xs text-gray-400">
                            Student
                        </p>
                    </div>

                    <NavLink
                        to="/profile"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-700 hover:text-white"
                        aria-label="View profile"
                    >
                        <ChevronRight className="h-5 w-5" strokeWidth={2} />
                    </NavLink>

                </div>
            </div>
        </aside>
        </>
    );
}

export default Sidebar;
