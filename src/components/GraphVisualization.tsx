import { useRef, useEffect, useCallback } from "react";
import { GraphData, GraphEdge } from "@/lib/graphData";

interface GraphVisualizationProps {
  graph: GraphData;
  highlightedPath: string[];
  animatingStep?: number;
  visitedNodes?: string[];
}

const TRAFFIC_COLORS = {
  low: "#4ade80",
  medium: "#facc15",
  high: "#f87171",
};

const GraphVisualization = ({
  graph,
  highlightedPath,
  visitedNodes = [],
}: GraphVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isEdgeInPath = useCallback(
    (edge: GraphEdge) => {
      for (let i = 0; i < highlightedPath.length - 1; i++) {
        if (
          (edge.from === highlightedPath[i] && edge.to === highlightedPath[i + 1]) ||
          (edge.to === highlightedPath[i] && edge.from === highlightedPath[i + 1])
        ) {
          return true;
        }
      }
      return false;
    },
    [highlightedPath]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;
    const pad = 50;

    const toX = (x: number) => pad + (x / 100) * (W - pad * 2);
    const toY = (y: number) => pad + (y / 100) * (H - pad * 2);

    ctx.clearRect(0, 0, W, H);

    // Draw edges
    for (const edge of graph.edges) {
      const fromNode = graph.nodes.find((n) => n.id === edge.from)!;
      const toNode = graph.nodes.find((n) => n.id === edge.to)!;
      const inPath = isEdgeInPath(edge);

      ctx.beginPath();
      ctx.moveTo(toX(fromNode.x), toY(fromNode.y));
      ctx.lineTo(toX(toNode.x), toY(toNode.y));

      if (inPath) {
        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#4ade80";
        ctx.shadowBlur = 15;
      } else {
        ctx.strokeStyle = TRAFFIC_COLORS[edge.traffic] + "55";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Edge label (traffic indicator dot)
      const mx = (toX(fromNode.x) + toX(toNode.x)) / 2;
      const my = (toY(fromNode.y) + toY(toNode.y)) / 2;
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fillStyle = TRAFFIC_COLORS[edge.traffic];
      ctx.fill();
    }

    // Draw nodes
    for (const node of graph.nodes) {
      const x = toX(node.x);
      const y = toY(node.y);
      const inPath = highlightedPath.includes(node.id);
      const isVisited = visitedNodes.includes(node.id);

      // Glow for path nodes
      if (inPath) {
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74, 222, 128, 0.15)";
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = inPath
        ? "#4ade80"
        : isVisited
        ? "#facc1588"
        : "#1e293b";
      ctx.fill();
      ctx.strokeStyle = inPath ? "#4ade80" : isVisited ? "#facc15" : "#334155";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node ID
      ctx.fillStyle = inPath ? "#0f172a" : "#e2e8f0";
      ctx.font = "bold 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, x, y);

      // Label
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px 'Space Grotesk', sans-serif";
      ctx.fillText(node.label, x, y + 24);
    }
  }, [graph, highlightedPath, visitedNodes, isEdgeInPath]);

  useEffect(() => {
    draw();
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{ minHeight: 400 }}
    />
  );
};

export default GraphVisualization;
