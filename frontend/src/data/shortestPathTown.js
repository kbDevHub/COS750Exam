// The town used in section 2.1, The Shortest Path Problem.
// S is the ambulance depot (start) and H is the hospital (destination).
// Weights are driving times in minutes.
//
// Designed so that:
//  - Route 1 and Route 2 both use 3 roads, but take different times (16 vs 14).
//  - The fastest route (S-A-C-D-H = 12) uses 4 roads, so "fewest roads" is not "fastest".
//  - The road out of the depot with the smallest time (S-B = 2) is NOT on the fastest route.

export const TOWN_VERTICES = [
  { id: "S", name: "Ambulance depot", short: "Depot", x: 70, y: 160 },
  { id: "A", name: "Junction A", x: 210, y: 70 },
  { id: "B", name: "Junction B", x: 210, y: 250 },
  { id: "C", name: "Junction C", x: 350, y: 160 },
  { id: "D", name: "Junction D", x: 490, y: 70 },
  { id: "E", name: "Junction E", x: 490, y: 250 },
  { id: "H", name: "Hospital", short: "Hospital", x: 630, y: 160 },
];

export const TOWN_EDGES = [
  { from: "S", to: "A", w: 4 },
  { from: "S", to: "B", w: 2 },
  { from: "A", to: "C", w: 3 },
  { from: "B", to: "C", w: 6 },
  { from: "A", to: "D", w: 9 },
  { from: "C", to: "D", w: 2 },
  { from: "C", to: "E", w: 7 },
  { from: "B", to: "E", w: 10 },
  { from: "D", to: "H", w: 3 },
  { from: "E", to: "H", w: 2 },
];

// Each highlight style differs by line pattern as well as colour,
// so no meaning is carried by colour alone.
export const ROUTE_STYLES = {
  route1: { stroke: "#4f46e5", dash: "10 6", width: 6, label: "dashed line" },
  route2: { stroke: "#d97706", dash: "2 7", width: 6, label: "dotted line" },
  built: { stroke: "#059669", dash: "0", width: 7, label: "solid line" },
};

export const START = "S";
export const TARGET = "H";

// The two routes the dispatcher is offered in the emergency call.
export const OFFERED_ROUTES = [
  { id: "route1", label: "Route 1", via: "the main road through A and D", path: ["S", "A", "D", "H"] },
  { id: "route2", label: "Route 2", via: "the back roads through B and E", path: ["S", "B", "E", "H"] },
];

const key = (a, b) => [a, b].sort().join("-");
const WEIGHT = Object.fromEntries(TOWN_EDGES.map((e) => [key(e.from, e.to), e.w]));

export const vertexById = (id) => TOWN_VERTICES.find((v) => v.id === id);

/** Weight of the road between a and b, or undefined if they are not neighbours. */
export const weight = (a, b) => WEIGHT[key(a, b)];

export const areNeighbours = (a, b) => weight(a, b) !== undefined;

/** Total time of a path, e.g. ["S","A","D","H"] -> 16. */
export const pathCost = (path) =>
  path.slice(1).reduce((sum, v, i) => sum + weight(path[i], v), 0);

/** "4 + 9 + 3" for a path. */
export const costSum = (path) =>
  path.slice(1).map((v, i) => weight(path[i], v)).join(" + ");

/** A sentence describing a path, used by the step log and read aloud. */
export const describePath = (path) => {
  if (path.length === 0) return "";
  const legs = path
    .slice(1)
    .map((v, i) => `${vertexById(path[i]).short ?? path[i]} to ${vertexById(v).short ?? v} takes ${weight(path[i], v)} minutes`);
  return `${legs.join(", ")}. Total: ${costSum(path)} = ${pathCost(path)} minutes.`;
};

/** Every route from start to target that never visits a vertex twice. */
export const allSimplePaths = (start = START, target = TARGET) => {
  const found = [];
  const walk = (path) => {
    const last = path[path.length - 1];
    if (last === target) {
      found.push(path);
      return;
    }
    TOWN_VERTICES.forEach((v) => {
      if (!path.includes(v.id) && areNeighbours(last, v.id)) walk([...path, v.id]);
    });
  };
  walk([start]);
  return found;
};

export const SHORTEST_COST = Math.min(...allSimplePaths().map(pathCost));
