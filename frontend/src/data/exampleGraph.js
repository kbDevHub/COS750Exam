export const nodes = [
  { id: "A", x: 60,  y: 120 },
  { id: "B", x: 200, y: 40 },
  { id: "C", x: 200, y: 200 },
  { id: "D", x: 360, y: 60 },
  { id: "E", x: 360, y: 190 },
];

export const edges = [
  { from: "A", to: "B", w: 4 },
  { from: "A", to: "C", w: 2 },
  { from: "B", to: "C", w: 1 },
  { from: "B", to: "D", w: 5 },
  { from: "C", to: "D", w: 8 },
  { from: "C", to: "E", w: 10 },
  { from: "D", to: "E", w: 2 },
];
