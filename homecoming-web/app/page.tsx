import { Clapperboard, MapPin, Music } from "lucide-react";
import HeroArt from "@/components/HeroArt";
import Planner from "@/components/Planner";

const steps = [
  { t: "Tell us what you loved", d: "A café, a band, a film. Name two cities and a few favourites." },
  { t: "We read the taste graph", d: "Qloo finds places and sounds that people with your taste love in your new city." },
  { t: "See why each one fits", d: "Every match shows what it shares with your original, plus a fit score." },
];
const kinds = [
  { Icon: MapPin, t: "Places", d: "Your regular café, the bar you never missed a Friday at, the bakery with the line out the door." },
  { Icon: Music, t: "Music", d: "Artists you loved back home, matched to what people like you listen to where you are now." },
  { Icon: Clapperboard, t: "Films", d: "Stories that felt like yours, and the local favourites that share their mood." },
];

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-paper">
        <nav className="mx-auto flex h-16 max-w-page items-center justify-between px-6" aria-label="Main">
          <a href="#top" className="display text-2xl">Homecoming</a>
          <div className="flex items-center gap-6 text-[15px] font-medium"><a href="#how" className="hidden hover:underline sm:block">How it works</a>
            <a href="#try" className="rounded-full bg-ink px-5 py-2.5 text-paper hover:opacity-90">Try it</a></div>
        </nav>
      </header>
      <main id="top">
        <section className="mx-auto grid max-w-page items-center gap-10 px-6 pb-20 pt-14 lg:grid-cols-[1.1fr_.9fr] lg:pt-20">
          <div>
            <h1 className="display text-[clamp(2.8rem,7vw,5rem)] leading-[1.02]">Your taste didn’t move.<br />Your address did.</h1>
            <p className="mt-6 max-w-xl text-xl text-muted">Tell us what you loved back home. Homecoming finds what feels the same in your new city, and shows you exactly why.</p>
            <div className="mt-9 flex flex-wrap gap-4"><a href="#try" className="rounded-full bg-accent px-8 py-3.5 text-lg font-bold text-onaccent hover:-translate-y-0.5 hover:shadow-card transition">Translate my taste</a>
              <a href="#how" className="rounded-full border-2 border-ink px-8 py-3 text-lg font-medium hover:bg-surface">How it works</a></div>
          </div>
          <HeroArt />
        </section>

        <section className="mx-auto max-w-page px-6 py-16">
          <h2 className="display max-w-2xl text-4xl sm:text-5xl">Three things we translate</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">{kinds.map(({ Icon, t, d }) => (
            <div key={t} className="rounded-lg bg-surface p-7 shadow-card"><span className="grid h-12 w-12 place-items-center rounded-full bg-alt text-accent"><Icon size={22} aria-hidden /></span>
              <h3 className="display mt-5 text-2xl">{t}</h3><p className="mt-2 text-muted">{d}</p></div>))}</div>
        </section>

        <section id="how" className="mx-auto max-w-page px-6 py-16">
          <h2 className="display text-4xl sm:text-5xl">How it works</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">{steps.map((s, i) => (
            <li key={s.t} className="border-t-2 border-ink pt-5"><span className="display text-4xl text-accent">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3><p className="mt-1 text-muted">{s.d}</p></li>))}</ol>
        </section>

        <section id="try" className="mx-auto max-w-page px-6 py-16">
          <h2 className="display mb-2 text-4xl sm:text-5xl">Find your way home</h2>
          <p className="mb-8 max-w-xl text-muted">It takes a minute. Add as many favourites as you like.</p>
          <Planner />
        </section>

        <section className="on-ink mx-4 my-16 rounded-[32px] bg-inkbg px-6 py-20 text-onink sm:mx-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="display text-4xl sm:text-5xl">Taste, not star ratings.</h2>
            <p className="mt-5 text-xl text-onmuted">A five-star café can still feel like the wrong room. We match on what you actually like, and show the traits you share, so you can judge the match yourself.</p>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-page flex-wrap justify-between gap-3 border-t border-line px-6 py-8 text-sm text-muted">
        <span>Matches by Qloo’s taste graph. Fit scores by Jev.</span><span>Developed by <a href="https://www.linkedin.com/in/sushant-dhakane-6651871b4/" className="font-medium text-ink underline underline-offset-4 hover:text-accent" target="_blank" rel="noopener noreferrer">Sushant Dhakane</a> · MIT licensed</span>
      </footer>
    </>
  );
}
