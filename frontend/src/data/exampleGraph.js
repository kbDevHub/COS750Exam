export const START = "I";
export const TARGET = "P";

export const nodes = [
  { id: "I", name: "IT Building", x: 300, y: 70,  labelDy: -46 },
  { id: "A", name: "Aula",        x: 110, y: 150, labelDy: -46 },
  { id: "M", name: "Merensky",    x: 490, y: 150, labelDy: -46 },
  { id: "P", name: "Piazza",      x: 300, y: 230, labelDy: 46 },
];

export const edges = [
  { from: "I", to: "A", w: 4 },
  { from: "A", to: "P", w: 5 },
  { from: "I", to: "M", w: 2 },
  { from: "M", to: "P", w: 8 },
  { from: "I", to: "P", w: 12 },
];