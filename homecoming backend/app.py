"""Homecoming: translate your taste from the city you left to the city you moved to, via Qloo's taste graph."""
import asyncio, json, os, re
import httpx
try:
    from dotenv import load_dotenv
    load_dotenv()   # reads .env next to app.py when running locally; hosted env vars still win
except ImportError:
    pass
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

QLOO = os.getenv("QLOO_API_URL", "https://hackathon.api.qloo.com")
QKEY = os.getenv("QLOO_API_KEY", "")
# Any OpenAI-compatible endpoint. Defaults to OpenCode's free Nemotron.
LLM_URL = os.getenv("LLM_BASE_URL", "https://opencode.ai/inference/openai/v1")
LLM_KEY = os.getenv("LLM_API_KEY") or os.getenv("OPENCODE_API_KEY", "")   # same OpenCode key powers Jev and the LLM
MODEL = os.getenv("LLM_MODEL", "nemotron-3.5-lightning-free")
THINKING = os.getenv("LLM_THINKING")   # unset = send no thinking flag (not every host supports it); "1"/"0" = NVIDIA-style toggle
try:  # optional: Jev (TypeSafe System One) scores how close each match is to the original
    from typesafe_sdk import Noul, TypeSafeClient
except ImportError:
    TypeSafeClient = None
# Jev backend: OpenCode Zen free tier (JEV_PROVIDER=opencode) or TypeSafe direct (paid). Override anything via env.
_oc, _ts = os.getenv("OPENCODE_API_KEY", ""), os.getenv("TYPESAFE_API_KEY", "")
JEV_PROVIDER = os.getenv("JEV_PROVIDER") or ("opencode" if _oc else "typesafe")
JEV_KW = ({"api_key": _oc, "base_url": os.getenv("JEV_BASE_URL", "https://opencode.ai/inference/systemone"),
           "model": os.getenv("JEV_MODEL", "jev-1.13-free")} if JEV_PROVIDER == "opencode"
          else {"api_key": _ts, "base_url": os.getenv("JEV_BASE_URL") or None, "model": os.getenv("JEV_MODEL") or None})
JEV = bool(JEV_KW["api_key"]) and TypeSafeClient is not None
app = FastAPI(title="Homecoming")

class Love(BaseModel):
    name: str
    kind: str = "place"          # place | artist | movie

class Req(BaseModel):
    home: str
    new: str
    loves: list[Love]

TYPES = {"place": "urn:entity:place", "artist": "urn:entity:artist", "movie": "urn:entity:movie"}

async def q(c, path, **p):
    r = await c.get(QLOO + path, params=p, headers={"X-Api-Key": QKEY}, timeout=25)
    r.raise_for_status()
    return r.json()

def ents(j):
    r = j.get("results")
    return (r.get("entities") if isinstance(r, dict) else r) or []

NOISE = {"restroom", "place", "destination", "restaurant", "central"}
def clean_tags(tags):
    """Drop duplicates, age-bracket tags ("18 24") and generic place tags that say nothing about taste."""
    seen, out = set(), []
    for t in tags:
        k = t.strip().lower()
        if not k or k in seen or k in NOISE or re.fullmatch(r"\d{1,2}( \d{1,2})?\+?", k):
            continue
        seen.add(k); out.append(t.strip())
    return out

def slim(e):
    return {"name": e.get("name"), "id": e.get("entity_id"),
            "affinity": (e.get("query") or {}).get("affinity"),
            "address": (e.get("properties") or {}).get("address", ""),
            "tags": clean_tags([t.get("name") for t in e.get("tags", []) if t.get("name")])}

async def resolve(c, love, home):
    # places are searched with the home city so "Blue Door" finds YOUR Blue Door
    term = f"{love.name} {home}" if love.kind == "place" else love.name
    try:
        hits = ents(await q(c, "/search", query=term, types=TYPES[love.kind], take=1))
        return {**slim(hits[0]), "kind": love.kind} if hits else None
    except Exception:
        return None

async def translate(c, src, new):
    """One home favourite -> its closest taste-equivalents in the new city."""
    p = {"signal.interests.entities": src["id"], "take": 8}
    if src["kind"] == "place":
        p.update({"filter.type": "urn:entity:place", "filter.location.query": new})
    else:   # music/film have no address: ask what the NEW CITY's audience loves that fits
        p.update({"filter.type": TYPES[src["kind"]], "signal.location.query": new})
    try:
        out = []
        for e in ents(await q(c, "/v2/insights", **p)):
            m = slim(e)
            m["shared"] = [t for t in m["tags"] if t in set(src["tags"])][:5]
            out.append(m)
        return out
    except Exception:
        return []

def jev_rescore(pair, new):
    """One Jev call per favourite: two Noul (0-1) questions per candidate, averaged into a fit score."""
    ms = [m for m in pair["matches"] if m["tags"]]
    if not ms:
        return
    state = {"loved": {"name": pair["from"]["name"], "tags": pair["from"]["tags"][:10]}, "new_city": new,
             "candidates": [{"id": f"m{i}", "name": m["name"], "tags": m["tags"][:10]} for i, m in enumerate(ms)]}
    qs = {}
    for i, m in enumerate(ms):
        qs[f"m{i}_vibe"] = Noul(instructions=f"Judging only from the tags in the state, would a fan of 'loved' find candidate m{i} a close match in atmosphere and character?")
        qs[f"m{i}_role"] = Noul(instructions=f"Judging only from the tags in the state, does candidate m{i} play the same role in daily life as 'loved' (same kind of experience)?")
    try:
        with TypeSafeClient(**JEV_KW) as c:
            r = c.system_one(state=state, questions=qs)
        for i, m in enumerate(ms):
            m["jev"] = round((r.answers[f"m{i}_vibe"].noul + r.answers[f"m{i}_role"].noul) / 2, 2)
        pair["matches"].sort(key=lambda m: m.get("jev", -1), reverse=True)
        strong = [m for m in pair["matches"] if m.get("jev", 0) >= 0.3]
        pair["matches"] = (strong or pair["matches"])[:3]   # drop weak matches, but never return nothing
    except Exception:
        pass   # Jev is an enhancement; Qloo results still stand

async def guide(pairs, home, new):
    system = ("You write a warm 'first weeks' guide for someone who moved cities. Use ONLY the matches and "
              "shared tags provided; never invent details about venues. Return JSON only: "
              '{"intro":str,"first_week":[str,str,str]} where first_week items are concrete suggestions naming matches.')
    async with httpx.AsyncClient() as c:
        r = await c.post(LLM_URL.rstrip("/") + "/chat/completions", timeout=90,
            headers={"Authorization": f"Bearer {LLM_KEY}"},
            json={"model": MODEL, "max_tokens": 2000 if THINKING == "1" else 900, "temperature": 0.6, "top_p": 0.95,
                  **({"chat_template_kwargs": {"enable_thinking": THINKING == "1"}} if THINKING is not None else {}),
                  "messages": [{"role": "system", "content": system},
                               {"role": "user", "content": json.dumps({"from": home, "to": new, "pairs": pairs})}]})
        r.raise_for_status()
        t = r.json()["choices"][0]["message"]["content"] or ""
        t = re.sub(r"<think>.*?</think>", "", t, flags=re.S)   # drop reasoning traces if the model emits them
        return json.loads(re.search(r"\{.*\}", t, re.S).group(0))

def demo(req):
    return {"mode": "demo", "pairs": [{"from": {"name": l.name, "kind": l.kind, "tags": ["cozy", "indie"]},
        "matches": [{"name": f"Sample match {i + 1} in {req.new}", "affinity": .9 - i * .08, "shared": ["cozy", "indie"], "address": req.new}
                    for i in range(3)]} for l in req.loves]}

@app.post("/api/translate")
async def api(req: Req):
    if not QKEY:
        return demo(req)
    async with httpx.AsyncClient() as c:
        srcs = [s for s in await asyncio.gather(*[resolve(c, l, req.home) for l in req.loves]) if s]
        if not srcs:
            return {"error": "Qloo couldn't find any of those. Try fuller names."}
        res = await asyncio.gather(*[translate(c, s, req.new) for s in srcs])
    pairs = [{"from": s, "matches": m} for s, m in zip(srcs, res)]
    if JEV:   # Jev sees all 8 candidates and keeps the best 3
        await asyncio.gather(*[asyncio.to_thread(jev_rescore, p, req.new) for p in pairs])
    for p in pairs:   # also covers "no Jev" and "Jev call failed"
        p["matches"] = p["matches"][:3]
    out = {"mode": "live", "jev": JEV, "pairs": pairs}
    if LLM_KEY:
        try:
            brief = [{"loved": p["from"]["name"], "matches": [{"name": m["name"], "shared": m["shared"]} for m in p["matches"]]} for p in pairs]
            out["guide"] = await guide(brief, req.home, req.new)
        except Exception as e:
            out["guide_error"] = str(e)[:100]
    return out

@app.get("/healthz")
def health(): return {"ok": True, "qloo": bool(QKEY), "llm": bool(LLM_KEY), "jev": JEV, "jev_provider": JEV_PROVIDER if JEV else None}

@app.get("/")
def index(): return FileResponse("static/index.html")
