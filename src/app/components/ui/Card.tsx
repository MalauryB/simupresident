import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface CardSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`border-b border-gray-200 px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
  ...props
}: CardSectionProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: CardSectionProps) {
  return (
    <div
      className={`border-t border-gray-200 px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
