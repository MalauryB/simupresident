"use client";

import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { getSelected } from "@/lib/simulation";
import { Avatar } from "@/app/components/ui/Avatar";

/* ------------------------------------------------------------------ */
/*  Floating decorative shape                                          */
/* ------------------------------------------------------------------ */
function FloatingShape({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full opacity-20 blur-3xl animate-[float_8s_ease-in-out_infinite] ${className}`}
      style={{ background: color }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const router = useRouter();
  const { parties, partyColors } = useSimulation();

  return (
    <div className="relative overflow-hidden">
      {/* Floating decorative background shapes */}
      <FloatingShape
        className="left-[-5%] top-[10%] h-72 w-72"
        color="#B6CDE8"
      />
      <FloatingShape
        className="right-[-8%] top-[30%] h-96 w-96"
        color="#FF584D"
      />
      <FloatingShape
        className="bottom-[15%] left-[20%] h-64 w-64"
        color="#556C96"
      />
      <FloatingShape
        className="bottom-[5%] right-[15%] h-56 w-56"
        color="#EEEDFF"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* ---- Hero section ---- */}
        <section className="mb-20 text-center">
          {/* Badge */}
          <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
            Pr&eacute;sidentielle 2027
          </span>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-dark sm:text-5xl lg:text-6xl">
            Qui sera{" "}
            <span className="relative inline-block text-accent">
              pr&eacute;sident
              {/* Decorative SVG underline */}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8 C40 2, 80 2, 100 6 S160 12, 198 4"
                  stroke="#FF584D"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.6"
                />
              </svg>
            </span>{" "}
            ?
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-500">
            Simulez l&rsquo;&eacute;lection pr&eacute;sidentielle gr&acirc;ce
            &agrave; notre mod&egrave;le math&eacute;matique.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/simulation")}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-[#FF7B73] px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl animate-[pulse-glow_3s_ease-in-out_infinite]"
          >
            <span className="text-xl">🚀</span>
            Lancer une simulation
          </button>
        </section>

        {/* ---- Party cards grid ---- */}
        <section className="mb-20">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {parties.map((party, i) => {
              const candidate = getSelected(party);
              const colors = partyColors[party.tag];
              return (
                <div
                  key={party.tag}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Gradient top bar */}
                  <div
                    className="h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${colors.accent}, ${colors.chart})`,
                    }}
                  />

                  <div className="flex flex-col items-center px-4 py-5">
                    {/* Avatar */}
                    <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                      <Avatar candidate={candidate} colors={colors} size={56} />
                    </div>

                    {/* Candidate name */}
                    <h3 className="mb-1 text-center text-sm font-semibold text-primary-dark">
                      {candidate.name}
                    </h3>

                    {/* Tag badge */}
                    <span
                      className="mb-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={{
                        backgroundColor: `${colors.accent}18`,
                        color: colors.accent,
                      }}
                    >
                      {party.tag}
                    </span>

                    {/* Party name */}
                    <p className="text-center text-xs text-gray-400">
                      {party.party}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ---- Bottom banner cards ---- */}
        <section className="grid gap-6 sm:grid-cols-2">
          {/* Suggestion card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-primary-dark">
              Une id&eacute;e d&rsquo;am&eacute;lioration ?
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Nous sommes toujours &agrave; l&rsquo;&eacute;coute pour
              am&eacute;liorer la plateforme.
            </p>
            <a
              href="mailto:contact@quipresident.fr"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent/80"
            >
              Nous &eacute;crire &rarr;
            </a>
          </div>

          {/* Project card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-bold text-white">
              Un projet informatique ?
            </h3>
            <p className="mb-4 text-sm text-primary-light/80">
              Notre &eacute;quipe peut vous accompagner sur vos projets data et
              simulation.
            </p>
            <a
              href="mailto:projet@quipresident.fr"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-primary-light"
            >
              Discutons-en &rarr;
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
