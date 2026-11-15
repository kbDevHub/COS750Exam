/* Each drawn graph has:
 *   nodes    { name: [x, y] }   x, y only position the circle in the diagram
 *   edges    [[from, to, weight]]
 *   viewBox  "0 0 width height" of the drawing; enlarge it if you move nodes outward
 */

/* ---------- Part 1: University of Pretoria campuses  [final-basics] ---------- */
// Undirected. Weights are approximate distances in km, taken from google maps.
// Node's third value is where its name is drawn: "above" | "below" | "left" | "right".
export const CAMPUS_GRAPH = {
  viewBox: "0 0 490 310",
  nodes: {
    Onderstepoort: [140, 50, "above"],
    Prinshof: [100, 170, "left"],
    Groenkloof: [200, 265, "below"],
    Hatfield: [290, 120, "above"],
    Hillcrest: [370, 230, "below"],
    Mamelodi: [450, 95, "above"],
  },
  // Only the direct roads that are drawn (kept sparse so the picture stays readable).
  edges: [
    ["Hatfield", "Hillcrest", 2.6],
    ["Hatfield", "Groenkloof", 4.3],
    ["Hatfield", "Prinshof", 5.8],
    ["Groenkloof", "Prinshof", 5.7],
    ["Hillcrest", "Groenkloof", 6.7],
    ["Prinshof", "Onderstepoort", 11.6],
    ["Hatfield", "Onderstepoort", 15.9],
    ["Hatfield", "Mamelodi", 20.5],
  ],
};
// Full table of estimated distances between every pair of campuses (reference only). Taken from google maps.
export const CAMPUS_ALL_DISTANCES = [
  ["Hatfield", "Groenkloof", 4.3],
  ["Hatfield", "Hillcrest", 2.6],
  ["Hatfield", "Prinshof", 5.8],
  ["Hatfield", "Mamelodi", 20.5],
  ["Hatfield", "Onderstepoort", 15.9],
  ["Hillcrest", "Groenkloof", 6.7],
  ["Hillcrest", "Prinshof", 8.1],
  ["Hillcrest", "Mamelodi", 20.0],
  ["Hillcrest", "Onderstepoort", 18.2],
  ["Prinshof", "Mamelodi", 25.0],
  ["Prinshof", "Groenkloof", 5.7],
  ["Prinshof", "Onderstepoort", 11.6],
  ["Mamelodi", "Groenkloof", 24.9],
  ["Mamelodi", "Onderstepoort", 35.0],
  ["Groenkloof", "Onderstepoort", 15.9],
];



/* ---------- Part 2: adjacency matrix  [final-matrix] ---------- */
// vertices = row/column order. directed: false fills both [a][b] and [b][a].
export const MATRIX_GRAPH = {
  vertices: ["A", "B", "C", "D"],
  directed: false,
  edges: [
    ["A", "B", 4],
    ["A", "C", 2],
    ["B", "D", 5],
    ["C", "D", 1],
  ],
};


/* ---------- Part 3: Dijkstra trace table  [final-dijkstra] ---------- */
// Directed. The table has one iteration column per vertex.
export const TRACE_GRAPH = {
  source: "A",
  viewBox: "0 0 340 250",
  nodes: {
    A: [40, 110], B: [140, 40], C: [140, 110], D: [300, 40], E: [300, 210],
  },
  edges: [
    ["A", "B", 1], ["A", "C", 3], ["A", "E", 5],
    ["B", "C", 1], ["B", "D", 4],
    ["C", "E", 3], ["C", "D", 1],
    ["D", "E", 1],
  ],
};

/* ---------- Part 4: connectivity  [final-connectivity] ---------- */
// Drawn without weights. directed: false draws plain lines, true draws arrows.
// Graph 1 follows the lecture slides (chapter 8, connectivity).
export const GRAPH_ARTICULATION = {
  caption: "Graph 1",
  directed: false,
  showWeights: false,
  viewBox: "0 0 340 230",
  nodes: {
    Z: [120, 30], A: [40, 100], R: [120, 100], P: [250, 100],
    J: [80, 190], N: [180, 190], L: [300, 190],
  },
  edges: [
    ["Z", "A"], ["Z", "R"], ["A", "J"], ["J", "R"],
    ["R", "P"], ["R", "N"], ["N", "P"], ["P", "L"],
  ],
};

export const GRAPH_DIRECTED_CONNECTIVITY = {
  caption: "Graph 2",
  directed: true,
  showWeights: false,
  viewBox: "0 0 330 230",
  nodes: {
    M: [130, 30], A: [40, 100], R: [130, 100], P: [230, 100],
    J: [80, 190], N: [180, 190], L: [280, 190],
  },
  edges: [
    ["A", "M"], ["R", "M"], ["A", "J"], ["J", "R"],
    ["R", "P"], ["P", "N"], ["N", "R"], ["P", "L"],
  ],
};

/* ---------- Part 4: cycles  [final-cycles] ---------- */

// Graph 3: undirected, two triangles joined by one edge.
export const GRAPH_TWO_CYCLES = {
  caption: "Graph 3",
  directed: false,
  showWeights: false,
  viewBox: "0 0 360 180",
  nodes: {
    A: [40, 40], B: [40, 140], C: [130, 90],
    D: [230, 90], E: [320, 40], F: [320, 140],
  },
  edges: [
    ["A", "B"], ["B", "C"], ["C", "A"], ["C", "D"],
    ["D", "E"], ["E", "F"], ["F", "D"],
  ],
};

// Graph 4: directed, no cycle (a loop only appears if the arrows are ignored).
export const GRAPH_DAG = {
  caption: "Graph 4",
  directed: true,
  showWeights: false,
  viewBox: "0 0 260 180",
  nodes: { A: [40, 90], B: [130, 30], C: [130, 150], D: [220, 90] },
  edges: [["A", "B"], ["A", "C"], ["B", "D"], ["C", "D"]],
};
