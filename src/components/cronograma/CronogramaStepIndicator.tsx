import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CronogramaStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const CronogramaStepIndicator = ({
  currentStep,
  totalSteps,
  steps,
}: CronogramaStepIndicatorProps) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center",
                  isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
              {stepNumber < totalSteps && (
                <div
                  className={cn(
                    "h-[2px] flex-1 transition-colors",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
