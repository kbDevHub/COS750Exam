export const sections=
[
    {
        id: "intro",
        title: "Introduction",
        content:
        [
            { type: "paragraph", text: "Graphs are a powerful data structure that can be used to model relationships between objects. In this section, we will introduce the basic concepts of graphs, including nodes, edges, and weights. We will also discuss some common applications of graphs in computer science and other fields." },
            { type: "heading", text: "Where do you see graphs?"},
            {
                type: "list",
                items: [
                    "Social networks (e.g., Facebook, Twitter)",
                    "Transportation networks (e.g., roads, railways)",
                    "Computer networks (e.g., the internet)",
                    "Biological networks (e.g., protein-protein interaction networks)",
                    "Recommendation systems (e.g., Netflix, Amazon)"
                ],
            },
        ],

    },

    {id: "nodes", title: "Nodes",
        content: [
            {   type: "objectives", text: "By the end of this section you should be able to:"},
            {   type: "numbered", items:
                [
                    "Define a grpah as a set of versitect connected by edges.",
                    "Identify the vertices in a digram or real-world scenario.",
                    "Explaint that 'node' and 'vertex' mean the same thing."
                ]
            },
            {   type: "divider"},
            {   type: "paragraph", text: "A grpah is a way of representing things and the connection between them. The 'things' are called {{accent:vertices}} (singular vertex). In programming, they are often called {{accent:nodes}}. The two words mean the same thing." },
            {   type: "paragraph", text: "A vetex can represnt anything: a city on a map, a person in a social netwrk, a web page, a train station. On its own, a vertex is just a labelled point. In diagrams, vertices are drawns as circles with names inside, such as A, B or C." },
            {   type: "paragraph", text: "Example: A small road netwokr has four towns: Pretoria, Johannesburg, Midrand and Centurion. This graph has 4 vetices" },
            {   type:"divider"},
            {   type: "paragraph", text: "{{bold: Mini Test}}"},
            {   type: "quiz", section:"nodes"}
        ]
    },

    {id: "edges", title: "Edges",
        content:
        [
            {   type: "objectives", text: "By the end of this section you should be able to:"},
            {   type: "numbered", items:
                [
                    "Define an edge as a connection between two vertices.",
                    "Distinguish between directed and undirected edges.",
                    "Identify the edges in a digram and state which vertices they connect.",
                    "Define adjacent vertices."
                ]
            },
            {   type: "divider"},
            {   type: "paragraph", text:" An {{accent:edge}} is a line that connects two vertices. it represent a relationship between them, such as a road between two towns or a friendship between two people."},
            {   type: "paragraph", text: "Edges come in two kinds:"},
            {   type: "list", items:
                [
                    "{{bold:Undirected edge}}: the conection works both ways, like a two-way road. If Node A is connected to Node B, then Node B is connected to Node A.",
                    "{{bold:Directed edge}}: the connection works only one way, like a on-way street. Anedge from Node A to Node B does not mean there is an edge from Node B to Node A. Directed edges are drawn as arrowns."
                ]
            },
            {   type: "paragraph", text: "Two vertices joined by an edge are called {{accent:adjacent}}, or {{accent:neighbours}}. If there is an edge between A and B, then A and B are neighbours."},
            {   type: "paragraph", text: "Example: If Pretoria- Midrand and Midrand-Johannesburg are edges, then Midrand is a neighbour of both Pretoria and Johannesburg. Pretoria and Johannesburg are not neighbours, becuase no edge joins the, directly."},
            {   type:"divider"},
            {   type: "paragraph", text: "{{bold: Try It}}"},
            {   type: "interactive", name: "edge", "allowWeights": false},
            {   type:"divider"},
            {   type: "paragraph", text: "{{bold: Mini Test}}"},
            {   type: "quiz", section:"edges"}
        ]
    },

    {id: "weights", title: "Weighted Graphs and Paths",
        content:
        [
            {   type: "objectives", text: "By the end of this section you should be able to:"},
            {   type: "numbered", items:
                [
                    "Define a weighted graph and explain ehat and edge weight represents,",
                    "Define a a path and calculate its total cost.",
                    "Explain why the path with the fewsest edges is not always the cheapest path.",
                    "State the shortest path problem"
                ]
            },
            {   type: "divider"},
            {   type: "paragraph", text: "In a {{accent:weighted graph}}, every edge has a number attachd to it called a {{accent:weight}}. The weoght can represent distance, travel time, cost or any other measure. For example, an edge between two towns might have weight 40 to show they are 40 km apart."},
            {   type: "paragraph", text: "A {{accent:path}} is a sequence of vertices wehre each consecutitve pair is joined by an edge. The {{accent:cost}} of a path is the sum of the wieghts of its edges."},
            {   type: "paragraph", text: "Example: take edges A-B (weigth 4), B-D (weight 5), A-C (weight 2) and C-D (weigth 8)."},
            {   type: "list", items:
                [
                    "Path A-> -> B -> D cost 4+ 5 = {{bold:9}}",
                    "Path A -> C -> D cost 2 + 8 = {{bold:10}}"
                ]

            },
            {   type: "paragraph", text: "Both paths use two edges, byt the first is cheaper"},
            {   type:"divider"},
            {   type: "paragraph", text: "{{bold: Try It}}"},
            {   type: "interactive", name: "edge"},
            {   type:"divider"},
            {   type: "paragraph", text: "The fewest-edges path is {{bold:not}} always the cheapest path. A route with more edges can still cost less in total if its weights are small enough."},
            {   type: "divider"},
            {   type: "paragraph", text: "{{bold:Shortest path problem}}"},
            {   type: "paragraph", text: " The {{accent: shortest path probelem}} asks: given a start vertex and a destination vertex, which path has the lowest total cost? This is what routing apps do when finding the quickest route between two places."}

        ]
    },

    {id: "dijkstra", title: "Dijkstra's Algorithm",
        content:
        [
            {   type: "objectives", text: "By the end of this section you should be able to:"},
            {   type: "numbered", items:
                [
                    "State the problem Dijkstra's algorithm solves.",
                    "Describe the steps of the algorithm in order.",
                    "Explain what 'relaxing' an edge means.",
                    "Trace the algorithm on a small weighted graph, recording the distances.",
                    "Reconstruct the shortest path from the recorded information.",
                    "State the algorithm's key limitation: it requires non-negative edge weights."
                ]
            },
            {   type: "divider"},
            {   type: "paragraph", text: "{{accent: Dijkstra's algorithm}} finds the shortest path from one {{bold: start vertex}} to every other vertex in a weighted graph. It works only when all edge weights are zero or positive."},
            {   type: "paragraph", text: " The algorithm keeps two pieces of information for every vertex:"},
            {   type: "list", items:
                [
                    "{{bold:Distance:}} the cheapest cost found so far to reach it from the start (initially infinity, except the start vertex which is 0).",
                    "{{bold:Previous:}} the vertex we cam from on that cheapest route."
                ]
            },
            {   type: "paragraph", text : "{{bold: Steps:}}"},
            {   type: "numbered", items:
                [
                    "Set the start vertex's distance to 0 and ever other distance to infinity.",
                    "Mark all vertices as unvisited.",
                    "Pick the unvisted vertex with the smallest distance. Call it the current vertex or {{accent:curr}}.",
                    "For each unvisited neighbour of {{accent:curr}}, calculate: current distance + edge weight. If this is smaller than the neighbour's recorded distance, update the neighbour's distance and set its previous vertex({{accent:prev}}) to {accent:curr}} This update is called {{bold:relaxing}} the edge.",
                    "Mark the {{accent:curr}} as visited. Its distance is now final.",
                    "Repeat step 3 until all vertices are visited."

                ]
            },
            {   type: "divider"},
            {   type: "paragraph", text: "Edges (undirected): A-B (4), A-C (2), B-C (1), B-D (5), C-D (8), C-E (10), D-E (2). Start at Node A."},
            {   type: "paragraph", text: "{{bold: Start:}} A=0, B=∞, C=∞, D=∞, E=∞. "},
            {   type: "paragraph", text:"{{bold: Step 1:}} Visit A (0). Relax A-B: 0+4 = {{bold:4}}, so B=4. Relax A-C: 0 +2 = {{bold:2}}, so C=2."},
            {   type: "paragraph", text:"{{bold: Step 2:}} Visit C (2), the smallest unvisited node. Relax C-B: 2+1 = {{bold:3}}, which is less than 4, so B=3. Relax C-D: 2 +8 = {{bold:10}}, so D=10. Relax C-E: 2+10= {{bold:12}}, so E =12."},
            {   type: "paragraph", text:"{{bold: Step 3:}} Visit B (3). Relax B-D: 3+5 = {{bold:8}}, which is less that D=10, so D=8."},
            {   type: "paragraph", text:"{{bold: Step 4:}} Visit D (8). Relax D-E: 8+2 = {{bold:10}}, which is less that E=12, so E=10."},
            {   type: "paragraph", text:"{{bold: Step 5:}} Visit E (10). No more possible updates, therfore we are done."},
            {   type: "paragraph", text:"{{bold: Final distances from A:}} Visit D (10). A=0, B=3, C=2, D=8, E=10."},
            {   type: "paragraph", text: "The animation below shows the worked example in action"},
            {   type: "animation", name:"dijkstra"},
            {   type:"divider"},
            {   type: "paragraph", text:"{{bold:Reading the path}}"},
            {   type: "paragraph", text: "To find the path to E, follow the previous vertives backwards: E <- D <- B <- C <- A. Reversed, the shortest path is A -> C -> B -> D -> E, with a cost of 2+1+5+2= {{bold:10}}."},
            {   type: "paragraph", text: "Notice that the dirext edge A-B (cost 4) was beaten by the route through C (cost 3). Dijkstra's algorithm discovers this automatically"},
            {   type: "paragraph", text:"{{bold:Why is works}}"},
            {   type: "paragraph", text :"Always visiting the closest unvisited vertex first guarentees its distance cannot be improved later becuase every other route would have to pass through vertices that are at least as far away."},
            {   type: "divider"},
            {   type: "paragraph", text:"{{bold:Greedy Algorithm}}"},
            {   type: "paragraph", text: "Dijkstra's algorithm is known as a {{accent:Greedy Algorithm}} becasue at every step it makes the choice that looks best right now: it picks the unvisited vertex witht the {{bold:smallest distance}} form the source, and locks that distance in."},
            {   type: "paragraph", text: "It never goes back to change a decision once a vertex has been finalised. This is safe becuase all edge weights are {{bold:non-negative}}. Any other route to tha vertex would have to pass through vertices that are already further away, and adding more weights can only make the total bigger, never smaller."},
            {   type: "paragraph", text:"{{bold:Limitation}}"},
            {   type: "paragraph", text: "Negative edge weights break this guarentee, so Dijkstra's algorithm cannot beused on graphs with negative weights."}

        ]
    },

    {id: "test", title: "Test Yourself"},

]
