# Homecoming: your taste, in a new city

Moving somewhere new means losing your regular café, your music scene, your sense of what's good. Homecoming translates what you loved at home into the new city using **Qloo's taste graph**.

## How it works
1. **Resolve** each favourite (place, artist, film) to a Qloo entity with `/search`. Places are searched with the home city, so a common name finds *your* venue.
2. **Translate** each favourite on its own with `/v2/insights`:
   - Places: `filter.type=urn:entity:place` + `filter.location.query=<new city>` + `signal.interests.entities=<your place>`, giving the new city's places whose fans share your taste.
   - Artists/films: `signal.location.query=<new city>` + `signal.interests.entities`, giving what people in the new city who like your favourite also love.
3. **Explain** every match by intersecting Qloo tags between the original and the match ("you both: cozy, indie"). This is data, not LLM guesswork.
4. **Score (Jev 1.13, optional; free via OpenCode Zen):** Jev (TypeSafe's System One model) answers typed yes/no-probability questions about each home→new pair from the Qloo tags, and the average becomes a "Jev fit %" that re-ranks matches. Qloo finds candidates; Jev judges closeness.
5. **Agent (Nemotron via OpenCode, optional)** writes a "first weeks" plan using only the matched entities and shared tags.

An LLM alone can say "Toronto has great cafés." Only a taste graph can say *which* one is your German Bakery.

## Run
```
cp .env.example .env   # QLOO_API_KEY (+ OPENCODE_API_KEY for Jev and the LLM)
pip install -r requirements.txt
uvicorn app:app --reload   # .env is loaded automatically
```
No key = labelled demo mode. Deploy with `render.yaml` (Docker web service), adding the env vars.

License: MIT
