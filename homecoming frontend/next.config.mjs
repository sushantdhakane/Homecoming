/**
 * Proxies /api/* to the FastAPI backend (Qloo + Jev + LLM) so the browser never sees keys.
 * Set BACKEND_URL (e.g. https://homecoming-api.onrender.com) in Vercel > Settings > Environment Variables.
 * Locally it falls back to http://localhost:8000. In production with no BACKEND_URL, no rewrite is added,
 * so a missing variable can never produce an invalid deploy.
 */
const backend = process.env.BACKEND_URL || (process.env.NODE_ENV !== "production" ? "http://localhost:8000" : "");
export default {
  async rewrites() {
    return backend ? [{ source: "/api/:path*", destination: `${backend.replace(/\/$/, "")}/api/:path*` }] : [];
  },
};
