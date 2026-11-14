import { useState } from "react";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const PSEUDO = [
    "DIJKSTRA(Graph, Start)",
    "",
    "    FOR EACH vertex v IN Graph DO",
    "        Distance[v] ← ∞",
    "        Previous[v] ← NIL",
    "        Visited[v] ← FALSE",
    "    END FOR",
    "",
    "    Distance[Start] ← 0",
    "",
    "    REPEAT |V| TIMES",
    "",
    "        u ← unvisited vertex with the smallest Distance",
    "",
    "        IF Distance[u] = ∞ THEN",
    "            BREAK",
    "        END IF",
    "",
    "        Visited[u] ← TRUE",
    "",
    "        FOR EACH edge (u, v) IN Graph[u] DO",
    "",
    "            Weight ← weight of edge (u, v)",
    "",
    "            IF Visited[v] = FALSE AND",
    "               Distance[u] + Weight < Distance[v] THEN",
    "",
    "                Distance[v] ← Distance[u] + Weight",
    "                Previous[v] ← u",
    "",
    "            END IF",
    "",
    "        END FOR",
    "",
    "    END REPEAT",
    "",
    "    RETURN Distance, Previous",
    "",
    "END DIJKSTRA"
].join("\n");

const CPP = [
    "#include <vector>",
    "#include <limits>",
    "using namespace std;",
    "",
    "const int INF = numeric_limits<int>::max();",
    "",
    "// graph[u] holds (neighbour, weight) pairs",
    "void dijkstra(const vector<vector<pair<int,int>>>& graph, int start,",
    "              vector<int>& dist, vector<int>& previous) {",
    "    int n = graph.size();",
    "    dist.assign(n, INF);",
    "    previous.assign(n, -1);",
    "    vector<bool> visited(n, false);",
    "    dist[start] = 0;",
    "",
    "    for (int count = 0; count < n; count++) {",
    "        // pick the unvisited vertex with the smallest dist",
    "        int u = -1;",
    "        for (int i = 0; i < n; i++)",
    "            if (!visited[i] && (u == -1 || dist[i] < dist[u]))",
    "                u = i;",
    "",
    "        if (dist[u] == INF) break;",
    "        visited[u] = true;",
    "",
    "        for (auto edge : graph[u]) {",
    "            int v = edge.first;",
    "            int w = edge.second;",
    "            if (!visited[v] && dist[u] + w < dist[v]) {",
    "                dist[v] = dist[u] + w;   // relax the edge",
    "                previous[v] = u;",
    "            }",
    "        }",
    "    }",
    "}",
].join("\n");

const JAVASCRIPT=
[
    "function dijkstra(graph, start) {",
    "const INF = Infinity;",
    "",
    "const n = graph.length;",
    "",
    "const dist = new Array(n).fill(INF);",
    "const previous = new Array(n).fill(-1);",
    "const visited = new Array(n).fill(false);",
    "",
    "dist[start] = 0;",
    "",
    "for (let count = 0; count < n; count++) {",
    "",
    "    // Pick the unvisited vertex with the smallest dist",
    "    let u = -1;",
    "",
    "    for (let i = 0; i < n; i++) {",
    "        if (!visited[i] && (u === -1 || dist[i] < dist[u])) {",
    "            u = i;",
    "        }",
    "    }",

    "    if (dist[u] === INF) break;",
    "",
    "    visited[u] = true;",
    "",
    "    for (const edge of graph[u]) {",
    "        const v = edge[0];",
    "        const w = edge[1];",
    "",
    "        if (!visited[v] && dist[u] + w < dist[v]) {",
    "            dist[v] = dist[u] + w;  // Relax the edge",
    "            previous[v] = u;",
    "        }",
    "    }",
    "}",
    "",
    "return { dist, previous };",
"}"
].join("\n");

const TABS =
[
    {id: "pseudo", label: "Pseudocode", lang:"text", code: PSEUDO},
    {id: "cpp", label: "C++", lang: "cpp", code: CPP},
    {id: "js", label: "Javascript", lang: "javascript", code: JAVASCRIPT}
];

export default function DijkstraCodeview()
{
    const [active, setActive]= useState("pseudo");
    const current =TABS.find((t)=> t.id ===active);

    return(
        <div>
            <div className="mb-3 flex gap-2" role="tablist" aria-label="Code Language">
                {TABS.map((t)=>{
                    const on =t.id ===active;
                    return (
                        <button
                            key={t.id}
                            role="tab"
                            aria-selected={on}
                            onClick={()=> setActive(t.id)}
                            className={
                                "rounded-lg border px-4 py-2 text-sm font-semibold " +
                                (on ? "border-indigo-600 bg-indigo-600 text-white": "border-slate-300 bg-white text-slate-700 hover:bg-slate-50")
                            }
                            >
                                {t.label}
                            </button>
                    );
                })}

            </div>
            <SyntaxHighlighter
                language={current.lang}
                style={vscDarkPlus}
                showLineNumbers
                customStyle={{borderRadius: "0.5rem", margin:0, fontSize:"0.875rem"}}
                >
                    {current.code}
                </SyntaxHighlighter>
        </div>
    )
}
