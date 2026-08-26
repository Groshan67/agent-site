import Link from "next/link";
import { getAllRadarItems } from "@/lib/radar";
import { getAllPrompts } from "@/lib/prompts";
import RadarCard from "@/components/RadarCard";
import PromptsTicker from "@/components/PromptsTicker";
import AboutSection from "@/components/AboutSection";
import NostalgiaEmoticons from "@/components/NostalgiaEmoticons";
import YahooMessengerLogin from "@/components/YahooMessengerLogin";

export default function Home() {
  const latestRadar = getAllRadarItems().slice(0, 2);
  const topPrompts = getAllPrompts().slice(0, 8);

  return (
    <div className="py-20">

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">

        {/* Left Content */}
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            signal, not noise
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl font-medium tracking-tight text-foreground sm:text-4xl">
            Ghasem Roshan — full-stack dev, with an agent doing some of the work.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            I build with Node.js, TypeScript, React, and Next.js. This site has
            a twist: part of it runs itself — an agent scans for interesting
            AI &amp; open-source projects every day and adds them to Radar, and
            pulls worth-sharing prompts into the public library below.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
            <Link
              href="/radar"
              className="rounded-md border border-border bg-card px-4 py-2 transition-colors hover:border-accent hover:text-accent"
            >
              view radar →
            </Link>

            <Link
              href="/prompts"
              className="rounded-md border border-border bg-card px-4 py-2 transition-colors hover:border-accent hover:text-accent"
            >
              view prompts →
            </Link>
          </div>
        </div>

        {/* Right Nostalgia Container */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-card">


          {/* Yahoo Messenger nostalgia */}
          <div className="flex aspect-[8/4] items-center justify-center p-1">
            <YahooMessengerLogin />
          </div>

          {/* Emoticons */}
          <NostalgiaEmoticons />

          {/* Footer */}
          <div className="border-t border-border bg-background/80 px-4 py-3">
            <div className="flex items-center justify-between font-mono text-xs text-muted">
              <span>~/developer/nostalgia</span>
              <span className="text-green-300 animate-pulse">● online</span>
            </div>
          </div>
        </div>

      </div>


      <AboutSection />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {latestRadar.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                  latest on radar
                </h2>
                <Link
                  href="/radar"
                  className="font-mono text-xs text-accent transition-colors hover:text-foreground"
                >
                  view all →
                </Link>
              </div>
              <ul className="mt-4 space-y-4">
                {latestRadar.map((item) => (
                  <li key={item.slug}>
                    <RadarCard
                      item={item}
                      tagHref={(tag) => `/radar?tag=${encodeURIComponent(tag)}`}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {topPrompts.length > 0 && (
            <section>
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
                  top prompts
                </h2>
                <Link
                  href="/prompts"
                  className="font-mono text-xs text-accent transition-colors hover:text-foreground"
                >
                  view all →
                </Link>
              </div>
              <div className="mt-4">
                <PromptsTicker items={topPrompts} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
