import { Button } from "../ui/Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      className="feedback-state"
      role="alert"
    >
      <h2>{title}</h2>

      <p>{message}</p>

      {onRetry && (
        <div className="feedback-state-action">
          <Button
            type="button"
            variant="secondary"
            onClick={onRetry}
          >
            Try again
          </Button>
        </div>
      )}
    </section>
  );
}