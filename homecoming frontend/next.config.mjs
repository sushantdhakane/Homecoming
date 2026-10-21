/** Proxies /api/* to the FastAPI backend (Qloo + Jev + LLM) so the browser never sees keys. */
export default { async rewrites() { return [{ source: "/api/:path*", destination: `${process.env.BACKEND_URL || "http://localhost:8000"}/api/:path*` }]; } };
