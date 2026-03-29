import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";

const AlgorithmExplanation = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Algorithm Explanation (Viva Reference)
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 text-sm text-secondary-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-1">What is Dijkstra's Algorithm?</h4>
            <p>
              Dijkstra's algorithm finds the shortest (least-cost) path between a source node and all other nodes in a weighted graph with non-negative edge weights. It uses a greedy approach, always expanding the unvisited node with the smallest tentative distance.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">How It Works (Steps)</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Initialize distance to source = 0, all others = ∞</li>
              <li>Mark all nodes as unvisited</li>
              <li>Pick the unvisited node with the smallest distance</li>
              <li>For each unvisited neighbor, calculate tentative distance through the current node</li>
              <li>If the new distance is smaller, update it and record the predecessor</li>
              <li>Mark the current node as visited</li>
              <li>Repeat steps 3–6 until destination is visited</li>
              <li>Reconstruct the path by tracing predecessors from destination to source</li>
            </ol>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Time Complexity</h4>
            <div className="bg-secondary/50 rounded-md p-3 font-mono text-xs">
              <p><span className="text-primary font-bold">O((V + E) log V)</span> — with a min-heap / priority queue</p>
              <p className="mt-1 text-muted-foreground">V = number of vertices (nodes), E = number of edges</p>
              <p className="mt-1 text-muted-foreground">Our implementation uses a simple array scan: <span className="text-primary">O(V²)</span>, sufficient for small graphs.</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Space Complexity</h4>
            <div className="bg-secondary/50 rounded-md p-3 font-mono text-xs">
              <p><span className="text-primary font-bold">O(V + E)</span> — for adjacency list, distance array, and predecessor map</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Weight Function Used</h4>
            <div className="bg-secondary/50 rounded-md p-3 font-mono text-xs space-y-1">
              <p><span className="text-traffic-low">Traffic mode:</span> weight = trafficWeight (Low=1, Med=3, High=6)</p>
              <p><span className="text-traffic-medium">Distance mode:</span> weight = distance (km)</p>
              <p><span className="text-traffic-high">Balanced mode:</span> cost = 0.3 × distance + 0.7 × trafficWeight</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-1">Key Properties</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Greedy algorithm — always picks the minimum cost node next</li>
              <li>Guarantees optimal path for non-negative weights</li>
              <li>Does not work with negative edge weights (use Bellman-Ford instead)</li>
              <li>Graph is undirected — each road can be traversed in both directions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmExplanation;
