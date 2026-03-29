/**
 * Graph data representing a city road network.
 * Each node is a location, each edge is a road with distance and traffic level.
 */

export type TrafficLevel = "low" | "medium" | "high";

export interface GraphNode {
  id: string;
  label: string;
  x: number; // position for visualization (0-100 normalized)
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  distance: number; // in km
  traffic: TrafficLevel;
  trafficWeight: number; // numeric: low=1, medium=3, high=6
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const trafficToWeight = (level: TrafficLevel): number => {
  switch (level) {
    case "low": return 1;
    case "medium": return 3;
    case "high": return 6;
  }
};

/**
 * Sample graph: 10 locations in a fictional city grid.
 */
export const defaultGraph: GraphData = {
  nodes: [
    { id: "A", label: "Downtown Hub", x: 50, y: 10 },
    { id: "B", label: "Tech Park", x: 20, y: 30 },
    { id: "C", label: "Central Mall", x: 75, y: 25 },
    { id: "D", label: "University", x: 10, y: 55 },
    { id: "E", label: "Station Plaza", x: 45, y: 45 },
    { id: "F", label: "Airport Road", x: 85, y: 50 },
    { id: "G", label: "Industrial Zone", x: 25, y: 75 },
    { id: "H", label: "Riverside", x: 60, y: 70 },
    { id: "I", label: "Suburbs North", x: 90, y: 78 },
    { id: "J", label: "Green Valley", x: 45, y: 92 },
  ],
  edges: [
    { from: "A", to: "B", distance: 5, traffic: "medium", trafficWeight: 3 },
    { from: "A", to: "C", distance: 4, traffic: "high", trafficWeight: 6 },
    { from: "A", to: "E", distance: 6, traffic: "low", trafficWeight: 1 },
    { from: "B", to: "D", distance: 3, traffic: "low", trafficWeight: 1 },
    { from: "B", to: "E", distance: 4, traffic: "medium", trafficWeight: 3 },
    { from: "C", to: "E", distance: 5, traffic: "high", trafficWeight: 6 },
    { from: "C", to: "F", distance: 3, traffic: "medium", trafficWeight: 3 },
    { from: "D", to: "G", distance: 4, traffic: "low", trafficWeight: 1 },
    { from: "D", to: "E", distance: 7, traffic: "medium", trafficWeight: 3 },
    { from: "E", to: "F", distance: 6, traffic: "high", trafficWeight: 6 },
    { from: "E", to: "H", distance: 4, traffic: "low", trafficWeight: 1 },
    { from: "E", to: "G", distance: 5, traffic: "medium", trafficWeight: 3 },
    { from: "F", to: "I", distance: 3, traffic: "low", trafficWeight: 1 },
    { from: "F", to: "H", distance: 5, traffic: "medium", trafficWeight: 3 },
    { from: "G", to: "J", distance: 4, traffic: "low", trafficWeight: 1 },
    { from: "G", to: "H", distance: 6, traffic: "high", trafficWeight: 6 },
    { from: "H", to: "I", distance: 5, traffic: "medium", trafficWeight: 3 },
    { from: "H", to: "J", distance: 3, traffic: "low", trafficWeight: 1 },
    { from: "I", to: "J", distance: 7, traffic: "high", trafficWeight: 6 },
  ],
};

/** Randomize traffic levels on all edges */
export const randomizeTraffic = (graph: GraphData): GraphData => {
  const levels: TrafficLevel[] = ["low", "medium", "high"];
  return {
    ...graph,
    edges: graph.edges.map((e) => {
      const traffic = levels[Math.floor(Math.random() * 3)];
      return { ...e, traffic, trafficWeight: trafficToWeight(traffic) };
    }),
  };
};
