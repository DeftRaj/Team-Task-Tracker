import { useRouteError } from "react-router";

export function RouteErrorFallback() {
  const error = useRouteError();

  console.error("Unhandled route error:", error);

  function handleReload() {
    window.location.reload();
  }

  return (
    <main
      role="alert"
      className="error-boundary"
    >
      <section className="error-boundary__content">
        <h1>Something went wrong</h1>

        <p>
          We couldn't load this part of the
          application. Please try refreshing
          the page.
        </p>

        <button
          type="button"
          onClick={handleReload}
        >
          Reload application
        </button>
      </section>
    </main>
  );
}