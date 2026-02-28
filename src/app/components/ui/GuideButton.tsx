"use client";

interface GuideButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function GuideButton({ onClick, label = "Guide de cette étape", className = "" }: GuideButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 ${className}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
      </svg>
      {label}
    </button>
  );
}
