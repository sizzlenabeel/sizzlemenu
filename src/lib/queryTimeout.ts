const QUERY_TIMEOUT_MS = 12_000;

export function createQuerySignal(parentSignal: AbortSignal) {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timeoutId = window.setTimeout(abort, QUERY_TIMEOUT_MS);

  parentSignal.addEventListener("abort", abort, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);
      parentSignal.removeEventListener("abort", abort);
    },
  };
}
