"use client";
import { useState } from "react";
import { ArrowRight, Clapperboard, MapPin, Music, Plus, X } from "lucide-react";
import { Kind, Result } from "@/lib/types";
import Results from "./Results";

const KINDS = [{ k: "place" as Kind, label: "Place", Icon: MapPin, ph: "A café, bar or bakery you loved" }, { k: "artist" as Kind, label: "Artist", Icon: Music, ph: "A singer or band you loved" }, { k: "movie" as Kind, label: "Film", Icon: Clapperboard, ph: "A film you loved" }];
type Row = { id: number; name: string; kind: Kind };
let uid = 1;
const input = "w-full rounded-md border-2 border-field bg-surface px-4 py-3 text-base placeholder:text-muted";

export default function Planner() {
  const [home, setHome] = useState(""); const [city, setCity] = useState("");
  const [rows, setRows] = useState<Row[]>([{ id: uid++, name: "", kind: "place" }]);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [err, setErr] = useState(""); const [res, setRes] = useState<Result | null>(null);
  const upd = (id: number, p: Partial<Row>) => setRows(rs => rs.map(r => (r.id === id ? { ...r, ...p } : r)));

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr("");
    const loves = rows.filter(r => r.name.trim()).map(r => ({ name: r.name.trim(), kind: r.kind }));
    if (!home.trim() || !city.trim()) return setErr("Enter the city you left and the city you moved to.");
    if (!loves.length) return setErr("Add at least one thing you loved, like a café, a band or a film.");
    setState("loading"); setRes(null);
    try {
      const r: Result = await (await fetch("/api/translate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ home: home.trim(), new: city.trim(), loves }) })).json();
      if (r.error) { setErr(`${r.error} Try the full name of the place.`); setState("idle"); } else { setRes(r); setState("done"); }
    } catch { setErr("We couldn't reach the server. Check your connection and try again."); setState("idle"); }
  }

  return (
    <div>
      <form onSubmit={submit} className="rounded-lg bg-surface p-6 shadow-card sm:p-10" noValidate>
        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <label className="block"><span className="mb-1.5 block font-medium">City you left</span><input className={input} value={home} onChange={e => setHome(e.target.value)} placeholder="e.g. Pune" autoComplete="off" /></label>
          <ArrowRight className="mb-3.5 hidden text-accent sm:block" aria-hidden />
          <label className="block"><span className="mb-1.5 block font-medium">City you moved to</span><input className={input} value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Toronto" autoComplete="off" /></label>
        </div>
        <fieldset className="mt-8"><legend className="mb-3 font-medium">What did you love back home?</legend>
          <div className="space-y-4">{rows.map(r => (
            <div key={r.id} className="grid gap-3 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <div role="radiogroup" aria-label="Kind of favourite" className="inline-flex rounded-full bg-alt p-1">
                {KINDS.map(({ k, label, Icon }) => <button key={k} type="button" role="radio" aria-checked={r.kind === k} onClick={() => upd(r.id, { kind: k })}
                  className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[15px] font-medium transition-colors ${r.kind === k ? "bg-accent text-onaccent" : "text-ink hover:bg-surface"}`}><Icon size={16} aria-hidden />{label}</button>)}
              </div>
              <input className={input} aria-label="Favourite name" value={r.name} onChange={e => upd(r.id, { name: e.target.value })} placeholder={KINDS.find(x => x.k === r.kind)!.ph} />
              {rows.length > 1 ? <button type="button" onClick={() => setRows(rs => rs.filter(x => x.id !== r.id))} aria-label="Remove this favourite" className="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-alt"><X size={18} /></button> : <span className="hidden sm:block" />}
            </div>))}
          </div>
          <button type="button" onClick={() => setRows(rs => [...rs, { id: uid++, name: "", kind: "place" }])} className="mt-4 inline-flex min-h-11 items-center gap-2 font-medium text-accent hover:underline"><Plus size={18} aria-hidden />Add another favourite</button>
        </fieldset>
        {err && <p role="alert" className="mt-5 rounded-md bg-[#FBE4E1] px-4 py-3 text-danger">{err}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button disabled={state === "loading"} className="min-h-12 rounded-full bg-accent px-8 text-lg font-bold text-onaccent transition hover:-translate-y-0.5 hover:shadow-card disabled:cursor-wait disabled:opacity-70">{state === "loading" ? "Reading the taste graph…" : "Find my way home"}</button>
          <button type="button" onClick={() => { setHome("Pune"); setCity("Toronto"); setRows([{ id: uid++, name: "German Bakery", kind: "place" }, { id: uid++, name: "Prateek Kuhad", kind: "artist" }]); }} className="min-h-11 font-medium text-muted underline underline-offset-4 hover:text-ink">Try an example</button>
        </div>
      </form>
      <div aria-live="polite">
        {state === "loading" && <div className="mt-12 grid gap-4 md:grid-cols-3" aria-hidden>{[0, 1, 2].map(i => <div key={i} className="h-40 animate-pulse rounded-lg bg-alt" />)}</div>}
        {res && state === "done" && <Results r={res} home={home} city={city} />}
      </div>
    </div>
  );
}
