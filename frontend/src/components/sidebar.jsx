
import { NavLink } from "react-router-dom";

function Sidebar() {
    const sections = [
        { title: "Introduction", path: "/" },
        { title: "Nodes", path: "/nodes" },
        { title: "Edges", path: "/edges" },
        { title: "Weighted Graphs", path: "/weights" },
        { title: "Dijkstra's Algorithm", path: "/dijkstra" },
        { title: "Test Yourself", path: "/test" },
    ];

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-[180px] shrink-0 flex-col bg-[#1f2937] px-4 py-6 font-mono text-white">

            {/* Sidebar heading */}
            <div className="mb-8 border-b border-gray-700 pb-5">
                <h2 className="mb-2 text-lg font-bold">
                    Pre-Class
                </h2>

                <p className="text-sm text-gray-400">
                    Graphs + Dijkstra
                </p>
            </div>

            {/* Navigation */}
            <nav>
                <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Learning Sections
                </p>

                <ul className="space-y-1">
                    {sections.map((section, index) => (
                        <li key={section.path}>
                            <NavLink
                                to={section.path}
                                end={section.path === "/"}
                                className={({ isActive }) =>
                                    `flex w-full items-center gap-2 rounded-md px-3 py-3 text-sm transition-colors duration-200 ${
                                        isActive
                                            ? "bg-[#4b5563] text-white"
                                            : "text-gray-300 hover:bg-[#374151]"
                                    }`
                                }
                            >
                                <span className="min-w-[22px] text-xs opacity-60">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span>{section.title}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sidebar footer */}
            <div className="mt-auto border-t border-gray-700 pt-5">
                <p className="text-xs text-gray-400">
                    COS 750 Exam
                </p>
            </div>

        </aside>
    );
}

export default Sidebar;
