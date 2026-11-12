
import { NavLink } from "react-router-dom";

function Sidebar() {
    const units = [
        {
            title: "Unit 1: Graphs",
            sections: [
                { title: "1.1 Nodes", path: "/nodes" },
                { title: "1.2 Edges", path: "/edges" },
                { title: "1.3 Weighted Graphs", path: "/weights" },
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

    return (
        <aside className="fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col overflow-y-auto bg-[#1f2937] px-4 py-6 font-mono text-white">

            <div className="mb-8 border-b border-gray-700 pb-5">
                <h2 className="mb-2 text-lg font-bold">
                    Pre-Class
                </h2>
                <p className="text-sm text-gray-400">
                    Graphs + Dijkstra
                </p>
            </div>

            <nav className="flex-1">
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
                    {units.map((unit) => (
                        <div key={unit.title} className="mb-7">
                            <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                                {unit.title}
                            </p>

                            <ul className="space-y-1 border-l border-gray-600 ml-3">
                                {unit.sections.map((section) => (
                                    <li key={section.path}>
                                        <NavLink
                                            to={section.path}
                                            className={({ isActive }) =>
                                                `${linkStyle({ isActive })} ml-2`
                                            }
                                        >
                                            {section.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Test Yourself */}
                <div className="mt-2 border-t border-gray-700 pt-4">
                    <NavLink
                        to="/test"
                        className={linkStyle}
                    >
                        Test Yourself
                    </NavLink>
                </div>
            </nav>

            {/* Sidebar footer */}
            <div className="mt-8 border-t border-gray-700 pt-5">
                <p className="text-xs text-gray-400">
                    COS 750 Exam
                </p>
            </div>
        </aside>
    );
}

export default Sidebar;
