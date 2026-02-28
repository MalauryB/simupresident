"use client";

import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { getSelected } from "@/lib/simulation";
import type { CandidatVariant, PartyColors } from "@/types/simulation";

/* ------------------------------------------------------------------ */
/*  Candidate photo — rectangular header for home page cards           */
/* ------------------------------------------------------------------ */
function CandidatePhoto({
  candidate,
  colors,
}: {
  candidate: CandidatVariant;
  colors: PartyColors;
}) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: colors.bg, height: 260 }}
    >
      {/* Initials fallback */}
      <span
        className="text-2xl font-bold select-none"
        style={{ color: colors.fg }}
      >
        {candidate.initials}
      </span>

      {/* Photo overlay */}
      {candidate.photoUrl && (
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      {/* Bottom accent line */}
      <div
        className="absolute inset-x-0 bottom-0 h-0.5"
        style={{ backgroundColor: colors.accent }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Home page                                                          */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const router = useRouter();
  const { parties, partyColors } = useSimulation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* ---- Hero section ---- */}
      <section className="mb-20 text-center">
        {/* Badge */}
        <span className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
          Pr&eacute;sidentielle 2027
        </span>

        {/* Title */}
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-dark sm:text-5xl lg:text-6xl">
          Qui pour{" "}
          <span className="text-accent">l&rsquo;&Eacute;lys&eacute;e</span>&nbsp;?
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
          Simulez l&rsquo;&eacute;lection pr&eacute;sidentielle gr&acirc;ce
          &agrave; notre mod&egrave;le math&eacute;matique.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.push("/simulation")}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-bold text-white transition-colors duration-200 hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          Lancer une simulation
        </button>
      </section>

      {/* ---- Party cards grid ---- */}
      <section className="mb-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {parties.map((party) => {
            const candidate = getSelected(party);
            const colors = partyColors[party.tag];
            return (
              <div
                key={party.tag}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow duration-200 hover:shadow-md"
              >
                {/* Candidate photo header */}
                <CandidatePhoto candidate={candidate} colors={colors} />

                {/* Card body */}
                <div className="flex flex-col items-center px-4 py-4">
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
                  <p className="text-center text-xs text-gray-500">
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
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-2 text-lg font-bold text-primary-dark">
            Une id&eacute;e d&rsquo;am&eacute;lioration ?
          </h3>
          <p className="mb-4 text-sm text-gray-600">
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
        <div className="rounded-xl border border-primary/20 bg-primary-dark p-6">
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
  );
}
