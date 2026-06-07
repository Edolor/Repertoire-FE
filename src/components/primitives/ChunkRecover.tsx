"use client";

import { useEffect } from "react";
import { isStaleChunkError, autoRecoverOnce, cleanRecoverParam } from "@/lib/recover";

/**
 * Proactively recovers from stale-deploy chunk errors that escape React's error
 * boundary (failed async chunk / dynamic-import fetches): on a matching window
 * error it hard-reloads to the latest build exactly once. Also strips the
 * cache-bust marker after a successful recovery.
 */
export function ChunkRecover() {
  useEffect(() => {
    cleanRecoverParam();
    const onError = (e: ErrorEvent) => {
      if (isStaleChunkError(e.message) || isStaleChunkError(e.error)) autoRecoverOnce();
    };
    const onReject = (e: PromiseRejectionEvent) => {
      if (isStaleChunkError(e.reason)) autoRecoverOnce();
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
    };
  }, []);
  return null;
}
