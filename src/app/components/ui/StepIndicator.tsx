interface StepIndicatorProps {
  current: number;
  labels: string[];
  onStepClick?: (step: number) => void;
  vertical?: boolean;
}

export function StepIndicator({ current, labels, onStepClick, vertical }: StepIndicatorProps) {
  return (
    <div className={vertical ? "flex flex-col items-start gap-0" : "flex items-center justify-center"}>
      {labels.map((label, i) => {
        const isCompleted = i < current;
        const isActive = i === current;

        return (
          <div key={label} className={vertical ? "flex flex-col items-start" : "flex items-center"}>
            {/* Connector line before (except first) */}
            {i > 0 && (
              <div
                className={`transition-colors duration-300 ${
                  i <= current ? "bg-accent" : "bg-gray-200"
                } ${vertical ? "ml-[15px] h-5 w-0.5" : "h-0.5 w-4 sm:w-8 md:w-12"}`}
              />
            )}

            {/* Step circle + label */}
            <button
              type="button"
              onClick={() => { onStepClick?.(i); }}
              aria-label={`${label}${isCompleted ? " (terminé)" : isActive ? " (en cours)" : ""}`}
              className={vertical ? "flex items-center gap-3" : "flex flex-col items-center gap-1 sm:gap-1.5"}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-accent text-white"
                    : isActive
                      ? "bg-accent text-white shadow-sm"
                      : "border-2 border-gray-200 bg-white text-gray-400 hover:border-accent/50 hover:text-accent/70"
                } ${!vertical ? "h-7 w-7 text-xs sm:h-8 sm:w-8 sm:text-sm" : ""}`}
              >
                {isCompleted ? (
                  <svg
                    className={vertical ? "h-4 w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4"}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-accent"
                    : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400"
                } ${vertical ? "" : "hidden sm:block"}`}
              >
                {label}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
