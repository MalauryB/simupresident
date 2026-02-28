interface StepIndicatorProps {
  current: number;
  labels: string[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ current, labels, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {labels.map((label, i) => {
        const isCompleted = i < current;
        const isActive = i === current;

        return (
          <div key={label} className="flex items-center">
            {/* Connector line before (except first) */}
            {i > 0 && (
              <div
                className={`h-0.5 w-4 sm:w-8 md:w-12 transition-colors duration-300 ${
                  i <= current ? "bg-accent" : "bg-gray-200"
                }`}
              />
            )}

            {/* Step circle + label */}
            <button
              type="button"
              onClick={() => { onStepClick?.(i); }}
              aria-label={`${label}${isCompleted ? " (terminé)" : isActive ? " (en cours)" : ""}`}
              className="flex flex-col items-center gap-1 cursor-pointer sm:gap-1.5"
            >
              <div
                className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isCompleted
                    ? "bg-accent text-white hover:shadow-md"
                    : isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/30"
                      : "border-2 border-gray-200 bg-white text-gray-400 hover:border-accent/50 hover:text-accent/70"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
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
                className={`hidden text-xs font-medium transition-colors duration-300 sm:block ${
                  isActive
                    ? "text-accent"
                    : isCompleted
                      ? "text-gray-600"
                      : "text-gray-400"
                }`}
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
