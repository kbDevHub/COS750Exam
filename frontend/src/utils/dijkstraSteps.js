export function dijkstraSteps(nodes, edges, start) {
  const dist = {}, prev = {}, visited = new Set();
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; });
  dist[start] = 0;

  const steps = [];
  const snap = (current, edge, note) =>
    steps.push({ current, edge, visited: [...visited], dist: { ...dist }, prev: { ...prev }, note });

  snap(null, null, `Set ${start} to 0 and every other vertex to infinity.`);

  while (visited.size < nodes.length) {
    let current = null;
    for (const n of nodes) {
      if (!visited.has(n.id) && (current === null || dist[n.id] < dist[current])) current = n.id;
    }
    if (current === null || dist[current] === Infinity) break;

    snap(current, null, `Pick ${current}: it has the smallest distance (${dist[current]}) of the unvisited vertices.`);

    for (const e of edges) {
      const other = e.from === current ? e.to : e.to === current ? e.from : null;
      if (other === null || visited.has(other)) continue;
      const alt = dist[current] + e.w;
      if (alt < dist[other]) {
        dist[other] = alt;
        prev[other] = current;
        snap(current, e, `${dist[current]} + edge ${e.w} = ${alt}, which is better, so ${other} becomes ${alt}.`);
      } else {
        snap(current, e, `${dist[current]} + edge ${e.w} = ${alt}, which is not better than ${dist[other]}. No change.`);
      }
    }

    visited.add(current);
    snap(current, null, `${current} is visited. Its distance of ${dist[current]} is final.`);
  }
  return steps;
}
