# Homecoming web (Next.js)

Front end for Homecoming. It talks to the FastAPI backend in `../homecoming` (Qloo taste graph, Jev fit scores, LLM plan) through a Next.js rewrite, so no API keys reach the browser.

## Run locally
```
# terminal 1: backend (see ../homecoming/README.md)
cd ../homecoming && uvicorn app:app --reload
# terminal 2: this app
npm install
npm run dev        # http://localhost:3000
```
`BACKEND_URL` (default `http://localhost:8000`) points at the backend.

## Deploy
1. Backend: deploy `../homecoming` to Render (set `QLOO_API_KEY`, `OPENCODE_API_KEY`).
2. This app: import the repo into Vercel, set `BACKEND_URL` to the Render URL, deploy. The Vercel URL is your demo link.

## Design system
`design/tokens.json` holds colour roles, type, spacing and radius. `app/globals.css` and `tailwind.config.js` map them to classes like `bg-paper text-ink`. Every text pair passes WCAG AA.

Stack: Next.js 14 (App Router), React 18, Tailwind CSS 3, lucide-react. License: MIT
