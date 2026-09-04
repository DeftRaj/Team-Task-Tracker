import { useState } from "react";

import { simulateNextRequestFailure } from "../../services/mockApi";

/**
 * Development-only panel used to demonstrate two required behaviours
 * on demand, without needing the browser console:
 *
 * 1. "Simulate next request failure" flips a flag that the mock
 *    data-service layer checks on its next call, so the very next
 *    create/edit/delete/load action fails and the app's existing
 *    error handling (role="alert" messages, retry buttons) runs.
 * 2. "Trigger error boundary" deliberately throws during render, to
 *    prove the global ErrorBoundary in main.tsx catches unexpected
 *    rendering errors instead of white-screening the app.
 *
 * This component renders nothing outside development: import.meta.env.DEV
 * is statically replaced by Vite, so `vite build` strips this panel
 * out of the production bundle entirely.
 */
export function DevTools() {
  const [shouldCrash, setShouldCrash] = useState(false);
  const [message, setMessage] = useState("");

  if (!import.meta.env.DEV) {
    return null;
  }

  if (shouldCrash) {
    throw new Error(
      "Simulated render error triggered from the DevTools panel.",
    );
  }

  function handleSimulateFailure() {
    simulateNextRequestFailure();

    setMessage(
      "Next request will fail. Try creating, editing, deleting a task, " +
        "creating a project.",
    );
  }

  function handleTriggerCrash() {
    setShouldCrash(true);
  }

  return (
    <div
      className="dev-tools"
      role="region"
      aria-label="Development tools"
    >
      <p className="dev-tools-label">
        Dev tools <span aria-hidden="true">(dev build only)</span>
      </p>

      <div className="dev-tools-buttons">
        <button
          type="button"
          className="dev-tools-button"
          onClick={handleSimulateFailure}
        >
          Simulate next request failure
        </button>

        <button
          type="button"
          className="dev-tools-button dev-tools-button-danger"
          onClick={handleTriggerCrash}
        >
          Trigger error boundary
        </button>
      </div>

      {message && (
        <p
          className="dev-tools-message"
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}