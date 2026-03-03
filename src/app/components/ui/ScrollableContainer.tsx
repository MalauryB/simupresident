"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode, type HTMLAttributes } from "react";

interface ScrollableContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper that adds:
 * - overscroll-behavior-x: contain (prevents browser back on swipe)
 * - A right-edge gradient hint when content overflows horizontally
 */
export function ScrollableContainer({ children, className = "", ...rest }: ScrollableContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const check = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.scrollLeft - el.clientWidth > 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    check();
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);

  // Re-check after children render / charts resize
  useEffect(() => {
    const timer = setTimeout(check, 500);
    return () => clearTimeout(timer);
  }, [children, check]);

  return (
    <div className="relative min-w-0 overflow-hidden">
      <div
        ref={ref}
        className={`overflow-x-auto ${className}`}
        style={{ overscrollBehaviorX: "contain", WebkitOverflowScrolling: "touch" }}
        {...rest}
      >
        {children}
      </div>
      {canScrollRight && (
        <div
          className="pointer-events-none absolute right-0 top-0 flex h-full w-10 items-center justify-center"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.85) 60%, white)",
          }}
          aria-hidden="true"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="animate-pulse text-gray-400"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
