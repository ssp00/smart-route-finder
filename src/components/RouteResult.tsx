import { DijkstraResult } from "@/lib/dijkstra";
import { GraphData } from "@/lib/graphData";
import { ArrowRight, Clock, Route, Gauge } from "lucide-react";

interface RouteResultProps {
  result: DijkstraResult;
  graph: GraphData;
  label: string;
  variant: "primary" | "secondary";
}

const TRAFFIC_DOT: Record<string, string> = {
  low: "bg-traffic-low",
  medium: "bg-traffic-medium",
  high: "bg-traffic-high",
};

const RouteResult = ({ result, graph, label, variant }: RouteResultProps) => {
  if (!result.found) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">No route found</p>
      </div>
    );
  }

  const isPrimary = variant === "primary";

  return (
    <div
      className={`rounded-lg border p-5 transition-all ${
        isPrimary
          ? "border-primary/40 bg-primary/5 glow-primary"
          : "border-border bg-card"
      }`}
    >
      <h3
        className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
          isPrimary ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {label}
      </h3>

      {/* Path */}
      <div className="flex flex-wrap items-center gap-1 mb-4">
        {result.path.map((nodeId, i) => {
          const node = graph.nodes.find((n) => n.id === nodeId);
          return (
            <span key={nodeId} className="flex items-center gap-1">
              <span
                className={`text-xs font-mono px-2 py-1 rounded ${
                  isPrimary
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {node?.label ?? nodeId}
              </span>
              {i < result.path.length - 1 && (
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              )}
            </span>
          );
        })}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Distance</p>
            <p className="text-sm font-semibold">{result.totalDistance} km</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Traffic Score</p>
            <p className="text-sm font-semibold">{result.totalTrafficScore}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Est. Time</p>
            <p className="text-sm font-semibold">{result.estimatedMinutes} min</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteResult;
