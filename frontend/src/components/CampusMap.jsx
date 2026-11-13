import { useState } from "react";

const Icons = {
    lecture: (c) => (
        // IT building
        <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
            <rect x="-14" y="-12" width="28" height="24" rx="2" />
            <rect x="-9" y="-7" width="5" height="5" />
            <rect x="4" y="-7" width="5" height="5" />
            <rect x="-9" y="2" width="5" height="5" />
            <rect x="4" y="2" width="5" height="5" />
            <line x1="0" y1="12" x2="0" y2="6" />
        </g>
    ),
    park: (c) => (
        // Aula 
        <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="0" cy="-5" r="9" />
            <line x1="0" y1="4" x2="0" y2="13" />
            <line x1="-12" y1="13" x2="12" y2="13" />
        </g>
    ),
    library: (c) => (
        // Merensky 
        <g fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round">
            <path d="M0 -8 C-6 -12 -12 -12 -15 -10 L-15 10 C-12 8 -6 8 0 12 Z" />
            <path d="M0 -8 C6 -12 12 -12 15 -10 L15 10 C12 8 6 8 0 12 Z" />
        </g>
    ),
    food: (c) => (
        // Piazza 
        <g fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="-7" y1="-13" x2="-7" y2="13" />
            <path d="M-12 -13 L-12 -4 Q-12 0 -7 0 Q-2 0 -2 -4 L-2 -13" />
            <path d="M8 13 L8 -13 Q15 -7 15 0 L8 0" />
        </g>
    ),
};

const PLACES = [
    { name: "IT Building", label: "I", role: "Lecture hall", icon: "lecture", x: 300, y: 40 },
    { name: "Aula", label: "A", role: "Rest area", icon: "park", x: 120, y: 110 },
    { name: "Merensky", label: "M", role: "Library", icon: "library", x: 480, y: 110 },
    { name: "Piazza", label: "P", role: "Food court", icon: "food", x: 300, y: 190 },
];

export default function CampusMap() {
    const [placed, setPlaced] = useState([]);

    const toggle = (name) =>
        setPlaced((p) => (p.includes(name) ? p.filter((n) => n !== name) : [...p, name]));

    return (
        <div>
            <p className="mb-2">
                Here are four places on campus. Click a building to turn it into a vertex.
            </p>

            <svg
                viewBox="0 0 600 260"
                className="w-full rounded-lg border border-slate-300 bg-white"
                role="group"
                aria-label="Four campus buildings that can be turned into vertices"
            >
                {PLACES.map((p) => {
                    const on = placed.includes(p.name);
                    const colour = on ? "#4f46e5" : "#64748b";
                    return (
                        <g
                            key={p.name}
                            onClick={() => toggle(p.name)}
                            className="cursor-pointer"
                            tabIndex={0}
                            role="button"
                            aria-pressed={on}
                            aria-label={on ? `Vertex ${p.label}` : `${p.name}, ${p.role}`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggle(p.name);
                                }
                            }}
                        >
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r="30"
                                fill={on ? "#e0e7ff" : "#f8fafc"}
                                stroke={colour}
                                strokeWidth="2"
                                strokeDasharray={on ? "0" : "5"}
                            />

                            {on ? (
                                <text
                                    x={p.x}
                                    y={p.y + 7}
                                    textAnchor="middle"
                                    fontSize="22"
                                    fontWeight="700"
                                    fill="#312e81"
                                >
                                    {p.label}
                                </text>
                            ) : (
                                <>
                                    <g transform={`translate(${p.x} ${p.y})`}>{Icons[p.icon](colour)}</g>
                                    <text x={p.x} y={p.y + 48} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b">
                                        {p.name}
                                    </text>
                                    <text x={p.x} y={p.y + 63} textAnchor="middle" fontSize="11" fill="#64748b">
                                        {p.role}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>

            <p className="anim-note mt-3" aria-live="polite">
                {placed.length === 0 && "Nothing yet. Click a building."}
                {placed.length > 0 && placed.length < 4 && `${placed.length} of 4 vertices.`}
                {placed.length === 4 &&
                    "Four buildings, four vertices. Each circle is a vertex, also called a node."}
            </p>
        </div>
    );
}