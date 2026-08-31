import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="feedback-state">
      <h2>{title}</h2>

      {description && (
        <p>{description}</p>
      )}

      {action && (
        <div className="feedback-state-action">
          {action}
        </div>
      )}
    </section>
  );
}