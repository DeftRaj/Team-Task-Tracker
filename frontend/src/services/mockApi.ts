let shouldFailNextRequest = false;

export function simulateDelay(
  milliseconds = 600,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

export function simulateNextRequestFailure() {
  shouldFailNextRequest = true;
}

export function consumeSimulatedFailure(): boolean {
  if (!shouldFailNextRequest) {
    return false;
  }

  shouldFailNextRequest = false;
  return true;
}