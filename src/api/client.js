/**
 * Resolves `VITE_API_URL` for fetch. When the API hostname matches the page
 * (e.g. both `localhost`), the **protocol is aligned with the current page**
 * so `http://localhost:5173` does not call `https://localhost:5000` (blocked /
 * wrong) and vice versa.
 */
export function resolveApiBase() {
  const raw = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (!raw) return "";
  if (typeof window === "undefined") return raw;
  try {
    const api = new URL(raw);
    if (window.location.hostname === api.hostname) {
      api.protocol = window.location.protocol;
      return api.origin;
    }
  } catch {
    return raw;
  }
  return raw;
}

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function api(path, options = {}) {
  const url = `${resolveApiBase()}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  // Default no-store so conditional GETs never return 304: fetch marks 304 as
  // !res.ok and the body is empty, which breaks JSON parsing and error handling.
  const res = await fetch(url, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });
  const text = await res.text();
  let body = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { error: text || res.statusText };
  }
  if (!res.ok) {
    throw new ApiError(res.status, body.error || "Request failed", body.details);
  }
  return body;
}
