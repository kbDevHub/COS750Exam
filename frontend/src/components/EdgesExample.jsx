import { useState } from "react";

const PLACES=
[
    {name:"IT Building", label : "I", x: 110, y:140},
    {name:"Merensky", label : "M", x: 300, y:140},
    {name:"Aula", label : "A", x: 490, y:140},
]

const EDGES= [
    ["IT Building", "Merensky"],
    ["Merensky","Aula"]
]

const R=30;

export default function EdgesExample()
{
    const [selected,setSelected]= useState(null);

    const byName= Object.fromEntries(PLACES.map((p) => [p.name,p]));

    const neighboursOf = (name)=> EDGES.filter((e)=> e.includes(name)).map((e) => (e[0]===name ? e[1]:e[0]));

    const neighbours= selected ? neighboursOf(selected):[];

    const toggle =(name)=> setSelected((s) => (s===name ? null: name));


    return(
        <div>
            <p className ="mb-2">
                Click a vertex to see its neighbours.
            </p>
            <svg
                viewBox="0 0 600 240"
                className="w-full rounded-lg border border-slate-300 bg-white"
                role="group"
                aria-label="Three towns joined by two edges: IT Building to Merensky, and Merensky to Aula"
                >
                    <path
                        d="M110 110 Q300 20 490 110"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                        strokeDasharray="6"
                    />
                    <text x="300" y="52" textAnchor="middle" fontSize="12" fill="#64748b">
                        no direct edge:not neighbours
                    </text>

                    {EDGES.map(([a,b])=>
                    {
                        const A=byName[a];
                        const B= byName[b];
                        const active = selected ===a || selected===b;
                        return(
                            <line
                                key={"${a}-${b}"}
                                x1={A.x +R}
                                y1={A.y}
                                x2={B.x -R}
                                y2={B.y}
                                stroke={active ? "#4f46e5": "#94a3b8"}
                                strokeWidth={active ? 4:2.5}
                                />
                        );
                    })}

                    {PLACES.map((p)=>{
                        const isSelected = selected ===p.name;
                        const isNeighbour = neighbours.includes(p.name);
                        const stroke = isSelected ? "#4f46e5" : isNeighbour? "#059669" : "#4f46e5";
                        const fill = isSelected ? "#c7d2fe": isNeighbour ?"#d1fae5": "#e0e7ff";

                        return (
                            <g
                                key={p.name}
                                onClick={()=> toggle(p.name)}
                                className="cursor-pointer"
                                tabIndex={0}
                                role="button"
                                aria-pressed={isSelected}
                                aria-label={"${p.name}, vertex ${p.label}"}
                                onKeyDown={(e)=>{
                                    if (e.key==="Enter" || e.key===" ")
                                    {
                                        e.preventDefault();
                                        toggle(p.name);
                                    }
                                }}
                            >
                                <circle cx={p.x} cy={p.y} r={R} fill={fill} stroke={stroke} strokeWidth="2" />
                                <text x={p.x} y={p.y+7} textAnchor="middle" fontSize="22" fontWeight={700} fill="#312e81">
                                    {p.label}
                                </text>
                                <text x={p.x} y={p.y + 52} textAnchor="middle" fontSize="13" fontWeight="600" fill="#1e293b">
                                    {p.name}
                                </text>
                            </g>
                        );

                    })}
                </svg>

                <p className="mt-3 text-slate-700" aria-live="polite">
                    {!selected && "IT Building–Merensky and Merensky–Aula are the two edges."}
                    {selected && neighbours.length === 1 && (
                        <>{selected} has one neighbour: {neighbours[0]}.</>
                    )}
                    {selected && neighbours.length === 2 && (
                        <>{selected} has two neighbours: {neighbours[0]} and {neighbours[1]}.</>
                    )}
                </p>

        </div>
    );
}
