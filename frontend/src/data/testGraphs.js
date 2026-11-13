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