import { MapPin } from "lucide-react";
/** Illustration only: two postcards joined by a dashed thread. No real venues are named. */
export default function HeroArt() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[480px]" role="img" aria-label="Illustration: a favourite café back home connected to a similar one in a new city">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 480 430" fill="none" aria-hidden>
        <path className="draw" d="M120 170 C 120 290, 340 220, 360 285" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="120" cy="170" r="6" fill="var(--highlight)" /><circle cx="360" cy="285" r="6" fill="var(--highlight)" />
      </svg>
      <div className="settle absolute left-0 top-2 w-[270px] rounded-lg bg-surface p-5 shadow-card" style={{ "--r0": "-6deg", "--r": "-3deg" } as React.CSSProperties}>
        <p className="flex items-center gap-1.5 text-sm text-muted"><MapPin size={15} aria-hidden /> Back home</p>
        <p className="display mt-1 text-[28px] leading-tight">Your corner café</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-[13px]">{["slow mornings", "indie", "warm"].map(t => <span key={t} className="rounded-full bg-alt px-2.5 py-0.5">{t}</span>)}</div>
      </div>
      <div className="settle absolute bottom-3 right-0 w-[290px] rounded-lg bg-inkbg p-5 text-onink shadow-card on-ink" style={{ "--r0": "5deg", "--r": "2deg", animationDelay: ".25s" } as React.CSSProperties}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="flex items-center gap-1.5 text-sm text-onmuted"><MapPin size={15} aria-hidden /> Your new city</p>
            <p className="display mt-1 text-[28px] leading-tight">The one that feels the same</p></div>
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full" style={{ background: "conic-gradient(var(--highlight) 91%, rgba(255,255,255,.15) 0)" }}>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-inkbg text-sm font-bold">91</span></div>
        </div>
        <p className="mt-3 text-[13px] text-onmuted">You both share: slow mornings, indie, warm</p>
      </div>
    </div>
  );
}
