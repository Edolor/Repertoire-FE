// Helpers for recovering from a stale build: after a deploy, a browser still
// holding old HTML/chunk references throws a ChunkLoadError (the "error on first
// load, fixed by a hard refresh" case). We detect that and force a fresh fetch.

export function isStaleChunkError(input?: unknown): boolean {
  const msg =
    typeof input === "string"
      ? input
      : ((input as { message?: string; reason?: { message?: string } })?.message ??
        (input as { reason?: { message?: string } })?.reason?.message ??
        "");
  return /ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
    String(msg),
  );
}

// Reload bypassing a cached HTML document (a content query forces a fresh
// response, which then references the new content-hashed chunks).
export function hardReload() {
  if (typeof window === "undefined") return;
  try {
    const u = new URL(window.location.href);
    u.searchParams.set("_r", String(Date.now()));
    window.location.replace(u.toString());
  } catch {
    window.location.reload();
  }
}

// Guarded one-time auto-reload (shared key so the boundary + global listener
// don't double-fire, and a stuck deploy can't loop).
const KEY = "stale-reload-ts";
export function autoRecoverOnce(windowMs = 12000): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < windowMs) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* sessionStorage unavailable — fall through and reload anyway */
  }
  hardReload();
  return true;
}

// Strip the cache-bust marker from the URL after a successful recovery.
export function cleanRecoverParam() {
  if (typeof window === "undefined") return;
  try {
    const u = new URL(window.location.href);
    if (u.searchParams.has("_r")) {
      u.searchParams.delete("_r");
      window.history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
  } catch {
    /* noop */
  }
}
