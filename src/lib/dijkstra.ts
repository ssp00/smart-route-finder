/**
 * Dijkstra's Algorithm Implementation
 * 
 * Dijkstra's algorithm finds the shortest path between nodes in a weighted graph.
 * It works by:
 * 1. Starting from the source, assign distance 0 to it and infinity to all others.
 * 2. Pick the unvisited node with the smallest tentative distance.
 * 3. For each unvisited neighbor, calculate tentative distance through current node.
 *    If smaller than the recorded distance, update it.
 * 4. Mark current node as visited. Repeat until destination is reached.
 * 
 * Time complexity: O((V + E) log V) with a priority queue.
 */

import { GraphData, GraphEdge } from "./graphData";

export type OptimizeMode = "traffic" | "distance" | "balanced";

export interface AlgorithmStep {
  currentNode: string;
  visitedNodes: string[];
  distances: Record<string, number>;
  updatedNeighbor?: string;
  message: string;
}

export interface DijkstraResult {
  path: string[];
  totalCost: number;
  totalDistance: number;
  totalTrafficScore: number;
  estimatedMinutes: number;
  steps: AlgorithmStep[];
  found: boolean;
}

/** Calculate edge cost based on optimization mode */
const edgeCost = (edge: GraphEdge, mode: OptimizeMode): number => {
  switch (mode) {
    case "traffic":
      return edge.trafficWeight;
    case "distance":
      return edge.distance;
    case "balanced":
      // Weighted combination: 30% distance, 70% traffic
      return edge.distance * 0.3 + edge.trafficWeight * 0.7;
  }
};

/** Build adjacency list from edges (undirected graph) */
const buildAdjacency = (edges: GraphEdge[]): Map<string, { neighbor: string; edge: GraphEdge }[]> => {
  const adj = new Map<string, { neighbor: string; edge: GraphEdge }[]>();
  for (const edge of edges) {
    if (!adj.has(edge.from)) adj.set(edge.from, []);
    if (!adj.has(edge.to)) adj.set(edge.to, []);
    adj.get(edge.from)!.push({ neighbor: edge.to, edge });
    adj.get(edge.to)!.push({ neighbor: edge.from, edge });
  }
  return adj;
};

export const runDijkstra = (
  graph: GraphData,
  source: string,
  destination: string,
  mode: OptimizeMode
): DijkstraResult => {
  const adj = buildAdjacency(graph.edges);
  const nodeIds = graph.nodes.map((n) => n.id);

  // Initialize distances to infinity, source to 0
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();
  const steps: AlgorithmStep[] = [];

  for (const id of nodeIds) {
    dist[id] = Infinity;
    prev[id] = null;
  }
  dist[source] = 0;

  steps.push({
    currentNode: source,
    visitedNodes: [],
    distances: { ...dist },
    message: `Initialize: Set distance to ${source} = 0, all others = ∞`,
  });

  // Simple priority queue using array (sufficient for small graphs)
  while (true) {
    // Pick unvisited node with smallest distance
    let current: string | null = null;
    let minDist = Infinity;
    for (const id of nodeIds) {
      if (!visited.has(id) && dist[id] < minDist) {
        minDist = dist[id];
        current = id;
      }
    }

    if (current === null || current === destination) break;

    visited.add(current);
    const neighbors = adj.get(current) || [];

    for (const { neighbor, edge } of neighbors) {
      if (visited.has(neighbor)) continue;
      const cost = edgeCost(edge, mode);
      const newDist = dist[current] + cost;

      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist;
        prev[neighbor] = current;

        steps.push({
          currentNode: current,
          visitedNodes: [...visited],
          distances: { ...dist },
          updatedNeighbor: neighbor,
          message: `Visit ${current}: Update ${neighbor} distance to ${newDist.toFixed(1)} (via ${current})`,
        });
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let node: string | null = destination;
  while (node !== null) {
    path.unshift(node);
    node = prev[node];
  }

  const found = path[0] === source && path.length > 1;

  // Calculate actual metrics along the path
  let totalDistance = 0;
  let totalTrafficScore = 0;
  if (found) {
    for (let i = 0; i < path.length - 1; i++) {
      const edge = graph.edges.find(
        (e) =>
          (e.from === path[i] && e.to === path[i + 1]) ||
          (e.to === path[i] && e.from === path[i + 1])
      );
      if (edge) {
        totalDistance += edge.distance;
        totalTrafficScore += edge.trafficWeight;
      }
    }
  }

  // Estimate time: base speed 40km/h, traffic multiplier
  const avgTrafficPerEdge = found ? totalTrafficScore / (path.length - 1) : 0;
  const speedFactor = Math.max(0.3, 1 - avgTrafficPerEdge * 0.1);
  const estimatedMinutes = found ? (totalDistance / (40 * speedFactor)) * 60 : 0;

  return {
    path: found ? path : [],
    totalCost: dist[destination] ?? Infinity,
    totalDistance,
    totalTrafficScore,
    estimatedMinutes: Math.round(estimatedMinutes),
    steps,
    found,
  };
};
