import Link from "next/link"

const steps = [
  {
    title: "Claim territory",
    description:
      "Open territory starts at $2. Pick a square, add your faction banner, connect your handle, and claim your spot on the map.",
  },
  {
    title: "Display your faction",
    description:
      "Your territory shows your uploaded banner and can link to your X profile. Larger groups of territory can become logos, ads, or faction zones.",
  },
  {
    title: "Get dominated",
    description:
      "Owned territory can always be taken over by another player for 10% more than the last claim price.",
  },
  {
    title: "Get paid out",
    description:
      "When someone dominates your territory, you receive your previous value plus half of the 10% premium. The platform receives the other half.",
  },
]

const examples = [
  {
    label: "Initial claim",
    lines: ["Alice claims territory for $2.00", "Platform receives $2.00", "Alice controls the territory"],
  },
  {
    label: "Takeover",
    lines: ["Bob dominates it for $2.20", "Alice receives about $2.10", "Platform receives about $0.10", "Bob now controls the territory"],
  },
]

const incentives = [
  "Control visible territory on a public map",
  "Promote your X handle, project, or community",
  "Buy early before territory becomes more expensive",
  "Get paid if someone takes your territory",
  "Compete for the most territory, highest-value territory, and most takeovers",
]

export default function HowItWorksPage() {
  return (
    <main className="min-h-[calc(100dvh-64px)] bg-background px-4 py-10 text-foreground">
      <section className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/40">
            WTF is Dominance?
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                A territory takeover game powered by x402.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/60 md:text-lg">
                Dominance is a public ownership map where every square can be
                claimed, displayed, and taken. Claim open territory, place your
                banner, and get paid when another player wants your spot more
                than you do.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-white/85"
                >
                  Enter the map
                </Link>

                <Link
                  href="/leaderboard"
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  View leaders
                </Link>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-5">
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 96 }, (_, index) => {
                  const active =
                    index === 18 ||
                    index === 19 ||
                    index === 20 ||
                    index === 26 ||
                    index === 27 ||
                    index === 28 ||
                    index === 42 ||
                    index === 43 ||
                    index === 50

                  return (
                    <div
                      key={index}
                      className={[
                        "aspect-square rounded-md border",
                        active
                          ? "border-violet-400/60 bg-violet-500/70 shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                          : "border-white/10 bg-white/5",
                      ].join(" ")}
                    />
                  )
                })}
              </div>

              <p className="mt-4 text-sm leading-6 text-white/50">
                The map is fixed. Territory positions do not change between
                desktop and mobile, so groups and banners keep their shape.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black">
                {index + 1}
              </div>

              <h2 className="mt-5 text-xl font-black text-white">
                {step.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55">
                {step.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              The money loop
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              Territory gets more expensive every takeover.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/55">
              Every takeover costs 10% more than the previous claim. Half of
              that premium goes to the previous controller, and half goes to the
              platform through the x402 fee model.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {examples.map((example) => (
                <div
                  key={example.label}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4"
                >
                  <h3 className="font-black text-white">{example.label}</h3>

                  <div className="mt-4 space-y-2">
                    {example.lines.map((line) => (
                      <p key={line} className="text-sm text-white/55">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
              Why play?
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              Visibility, rivalry, and upside.
            </h2>

            <div className="mt-6 space-y-3">
              {incentives.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-medium text-white/65"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/40">
            Simple rule
          </p>

          <h2 className="mt-4 text-3xl font-black text-white">
            Nobody owns territory forever.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/55 md:text-base">
            Dominance is not a static ad board. It is a living map. If someone
            wants your territory, they can take it, but they must pay more than
            you did. If they do, you get paid and the map updates.
          </p>
        </section>
      </section>
    </main>
  )
}