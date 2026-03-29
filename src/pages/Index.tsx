import { useState, useMemo } from "react";
import { defaultGraph, randomizeTraffic, GraphData } from "@/lib/graphData";
import { runDijkstra, OptimizeMode, DijkstraResult } from "@/lib/dijkstra";
import GraphVisualization from "@/components/GraphVisualization";
import RouteResult from "@/components/RouteResult";
import AlgorithmSteps from "@/components/AlgorithmSteps";
import AlgorithmExplanation from "@/components/AlgorithmExplanation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Navigation,
  Shuffle,
  Zap,
  Route,
  BarChart3,
} from "lucide-react";

const MODES: { value: OptimizeMode; label: string; icon: React.ReactNode }[] = [
  { value: "traffic", label: "Least Traffic", icon: <Zap className="w-4 h-4" /> },
  { value: "distance", label: "Shortest Distance", icon: <Route className="w-4 h-4" /> },
  { value: "balanced", label: "Balanced (30/70)", icon: <BarChart3 className="w-4 h-4" /> },
];

const Index = () => {
  const [graph, setGraph] = useState<GraphData>(defaultGraph);
  const [source, setSource] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [mode, setMode] = useState<OptimizeMode>("traffic");
  const [result, setResult] = useState<DijkstraResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<DijkstraResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const locations = useMemo(() => graph.nodes, [graph]);

  const handleFindRoute = () => {
    if (!source || !destination || source === destination) return;
    const primary = runDijkstra(graph, source, destination, mode);
    setResult(primary);

    // Run comparison with opposite mode
    const compMode: OptimizeMode = mode === "distance" ? "traffic" : "distance";
    const comparison = runDijkstra(graph, source, destination, compMode);
    setComparisonResult(comparison);
    setShowSteps(true);
  };

  const handleRandomizeTraffic = () => {
    const newGraph = randomizeTraffic(graph);
    setGraph(newGraph);
    setResult(null);
    setComparisonResult(null);
    setShowSteps(false);
  };

  const handleReset = () => {
    setGraph(defaultGraph);
    setSource("");
    setDestination("");
    setResult(null);
    setComparisonResult(null);
    setShowSteps(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Smart Traffic Route Optimizer
              </h1>
              <p className="text-xs text-muted-foreground">
                Dijkstra's Algorithm · Real-time traffic optimization
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRandomizeTraffic}
              className="gap-1.5"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Randomize Traffic
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Controls + Results */}
          <div className="space-y-5">
            {/* Controls Card */}
            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Route Configuration
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Source Location
                  </label>
                  <Select value={source} onValueChange={setSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem
                          key={loc.id}
                          value={loc.id}
                          disabled={loc.id === destination}
                        >
                          {loc.id} — {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Destination
                  </label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem
                          key={loc.id}
                          value={loc.id}
                          disabled={loc.id === source}
                        >
                          {loc.id} — {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    Optimize For
                  </label>
                  <div className="flex gap-1.5">
                    {MODES.map((m) => (
                      <button
                        key={m.value}
                        onClick={() => setMode(m.value)}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                          mode === m.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {m.icon}
                        <span className="hidden sm:inline">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleFindRoute}
                disabled={!source || !destination || source === destination}
              >
                <Navigation className="w-4 h-4" />
                Find Best Route
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-3">
                <RouteResult
                  result={result}
                  graph={graph}
                  label={`Optimized: ${MODES.find((m) => m.value === mode)?.label}`}
                  variant="primary"
                />
                {comparisonResult && (
                  <RouteResult
                    result={comparisonResult}
                    graph={graph}
                    label={`Comparison: ${
                      mode === "distance" ? "Least Traffic" : "Shortest Distance"
                    }`}
                    variant="secondary"
                  />
                )}
              </div>
            )}

            {/* Traffic Legend */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Traffic Legend
              </h3>
              <div className="flex gap-4">
                {[
                  { label: "Low", color: "bg-traffic-low" },
                  { label: "Medium", color: "bg-traffic-medium" },
                  { label: "High", color: "bg-traffic-high" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel: Graph + Steps */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-lg border border-border bg-card p-2 h-[480px]">
              <GraphVisualization
                graph={graph}
                highlightedPath={result?.path ?? []}
                visitedNodes={result?.steps.flatMap((s) => s.visitedNodes) ?? []}
              />
            </div>

            {showSteps && result && <AlgorithmSteps steps={result.steps} />}
            <AlgorithmExplanation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
