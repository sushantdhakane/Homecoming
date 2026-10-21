import { Result, KIND_LABEL } from "@/lib/types";
export default function Results({ r, home, city }: { r: Result; home: string; city: string }) {
  let n = 0;
  return (
    <div className="mt-12 space-y-10">
      {r.mode === "demo" && <p className="rounded-md bg-alt px-4 py-3 text-[15px]">This is sample data. Add a Qloo key on the server to see real matches.</p>}
      {r.guide && (
        <section className="rise rounded-lg bg-accent p-7 text-onaccent sm:p-9">
          <h3 className="display text-3xl">Your first weeks in {city}</h3>
          <p className="mt-2 max-w-2xl opacity-95">{r.guide.intro}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">{r.guide.first_week?.map((x, i) => <li key={i} className="rounded-md bg-white/10 p-4 text-[15px] leading-snug ring-1 ring-white/25">{x}</li>)}</ul>
        </section>
      )}
      {r.pairs.map((p, i) => (
        <section key={i}>
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3"><h3 className="display text-3xl">{p.from.name}</h3>
            <span className="text-muted">your {KIND_LABEL[p.from.kind] ?? "favourite"} in {home}, feels like</span></div>
          {p.matches.length === 0 && <p className="text-muted">No close matches yet. Try adding another favourite of the same kind.</p>}
          <div className="grid gap-4 md:grid-cols-3">
            {p.matches.map((m, j) => {
              const v = m.jev ?? m.affinity; const pc = v == null ? null : Math.round(v * 100);
              return (
                <article key={j} className="rise flex flex-col rounded-lg bg-surface p-6 shadow-card" style={{ animationDelay: `${n++ * 80}ms` }}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="display text-2xl leading-tight">{m.name}</h4>
                    {pc != null && <div className="text-center" title={m.jev != null ? "Jev fit score" : "Qloo taste affinity"}>
                      <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: `conic-gradient(var(--accent) ${pc}%, var(--border) 0)` }}>
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-[15px] font-bold">{pc}</span></div>
                      <span className="text-xs text-muted">{m.jev != null ? "fit" : "taste"}</span></div>}
                  </div>
                  {m.address && <p className="mt-1 text-sm text-muted">{m.address}</p>}
                  {!!m.shared?.length && <div className="mt-auto pt-4"><p className="mb-1.5 text-sm text-muted">You both share</p>
                    <div className="flex flex-wrap gap-1.5">{m.shared.map(t => <span key={t} className="rounded-full bg-alt px-2.5 py-0.5 text-[13px]">{t}</span>)}</div></div>}
                </article>);
            })}
          </div>
        </section>
      ))}
      <p className="display pt-6 text-center text-3xl sm:text-4xl">Now close the tab. {city} is waiting.</p>
    </div>
  );
}
