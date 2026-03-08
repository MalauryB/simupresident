import { generateSimData } from "./simulation";

self.onmessage = (e: MessageEvent) => {
  const { activeParties, pollSource, days, gammaRejetED, gammaRejetEG } =
    e.data;
  try {
    const result = generateSimData(
      activeParties,
      pollSource,
      days,
      gammaRejetED,
      gammaRejetEG,
    );
    self.postMessage({ type: "result", data: result });
  } catch (err) {
    self.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : String(err),
    });
  }
};
