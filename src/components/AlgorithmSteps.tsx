import { AlgorithmStep } from "@/lib/dijkstra";
import { ChevronRight } from "lucide-react";

interface AlgorithmStepsProps {
  steps: AlgorithmStep[];
}

const AlgorithmSteps = ({ steps }: AlgorithmStepsProps) => {
  if (steps.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Algorithm Steps
      </h3>
      <div className="space-y-1">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-xs font-mono py-1 border-b border-border/50 last:border-0"
          >
            <ChevronRight className="w-3 h-3 mt-0.5 text-primary shrink-0" />
            <span className="text-secondary-foreground">{step.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSteps;
