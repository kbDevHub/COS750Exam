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