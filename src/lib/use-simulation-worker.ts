"use client";

import { useEffect, useRef, useState } from "react";
import type { PartyData } from "@/types/simulation";
import type { SimulationData } from "@/types/simulation";

export function useSimulationWorker(
  activeParties: PartyData[],
  pollSource: string,
  days: number,
  gammaRejetED?: number,
  gammaRejetEG?: number,
) {
  const [simData, setSimData] = useState<SimulationData | null>(null);
  const [computing, setComputing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    setComputing(true);
    setError(null);

    // Terminate any previous worker still running
    workerRef.current?.terminate();

    const worker = new Worker(
      new URL("./simulation.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      if (e.data.type === "result") {
        setSimData(e.data.data);
        setComputing(false);
      } else if (e.data.type === "error") {
        setError(e.data.message);
        setComputing(false);
      }
    };

    worker.onerror = (e) => {
      setError(e.message ?? "Erreur inattendue dans le worker");
      setComputing(false);
    };

    worker.postMessage({
      activeParties,
      pollSource,
      days,
      gammaRejetED,
      gammaRejetEG,
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [activeParties, pollSource, days, gammaRejetED, gammaRejetEG]);

  return { simData, computing, error };
}
