import Image from "next/image";
import Link from "next/link";
import { BackLink } from "@/app/components/ui/BackLink";
import { SIM_COUNT } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  About page (server component)                                      */
/* ------------------------------------------------------------------ */
export default function AProposPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <BackLink href="/" />

      {/* Badge */}
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
          QUI SOMMES-NOUS
        </span>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          &Agrave; propos
        </h1>
        <p className="text-gray-600">
          D&eacute;couvrez la mission derri&egrave;re
          quiserapr&eacute;sident.fr.
        </p>
      </div>

      <div className="space-y-8">
        {/* ---- Mission ---- */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            Notre mission
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            quiserapr&eacute;sident.fr a pour objectif de rendre
            l&rsquo;analyse &eacute;lectorale accessible &agrave; tous.
            Gr&acirc;ce &agrave; notre simulateur interactif, chacun peut
            explorer les diff&eacute;rents sc&eacute;narios de
            l&rsquo;&eacute;lection pr&eacute;sidentielle 2027, comprendre
            l&rsquo;impact des param&egrave;tres sur les r&eacute;sultats et se
            familiariser avec les m&eacute;thodes de simulation statistique.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Nous croyons que la transparence m&eacute;thodologique est
            essentielle : tous nos mod&egrave;les sont document&eacute;s et les
            param&egrave;tres sont ajustables par l&rsquo;utilisateur.
          </p>
        </div>

        {/* ---- How it works ---- */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-primary-dark">
            Comment &ccedil;a marche
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                1
              </div>
              <h3 className="mb-1 text-sm font-bold text-primary-dark">
                Configurez
              </h3>
              <p className="text-xs text-gray-700">
                S&eacute;lectionnez les candidats et ajustez les
                param&egrave;tres de la simulation.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl font-bold text-accent">
                2
              </div>
              <h3 className="mb-1 text-sm font-bold text-primary-dark">
                Simulez
              </h3>
              <p className="text-xs text-gray-700">
                {SIM_COUNT} simulations sont
                g&eacute;n&eacute;r&eacute;es en quelques secondes.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
                3
              </div>
              <h3 className="mb-1 text-sm font-bold text-primary-dark">
                Analysez
              </h3>
              <p className="text-xs text-gray-700">
                Explorez les trajectoires, probabilit&eacute;s et intervalles
                de confiance.
              </p>
            </div>
          </div>
        </div>

        {/* ---- FAQ ---- */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-primary-dark">
            Questions fr&eacute;quentes
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Est-ce que le simulateur pr\u00e9dit le r\u00e9sultat de l'\u00e9lection ?",
                a: "Non. C'est un outil p\u00e9dagogique qui explore des sc\u00e9narios possibles, pas une pr\u00e9vision.",
              },
              {
                q: "Pourquoi seulement 8 candidats ?",
                a: "Nous avons limit\u00e9 le nombre de candidats pour que le mod\u00e8le reste lisible et ne devienne pas trop complexe. Ajouter davantage de candidats augmenterait consid\u00e9rablement le nombre d\u2019interactions \u00e0 mod\u00e9liser.",
              },
              {
                q: "Pourquoi ces param\u00e8tres par d\u00e9faut ?",
                a: "Ces param\u00e8tres nous semblent r\u00e9alistes au regard des connaissances \u00e0 l\u2019instant t, mais il ne s\u2019agit que d\u2019interpr\u00e9tation. Le but est avant tout que chaque utilisateur choisisse ses propres param\u00e8tres.",
              },
              {
                q: "Peut-on avoir acc\u00e8s au code de la simulation ?",
                a: null,
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="mb-1 text-sm font-bold text-primary-dark">
                  {faq.q}
                </h3>
                {faq.a ? (
                  <p className="text-xs leading-relaxed text-gray-700">
                    {faq.a}
                  </p>
                ) : (
                  <p className="text-xs leading-relaxed text-gray-700">
                    Oui ! Le projet est enti&egrave;rement open source. Le code
                    sp&eacute;cifique du mod&egrave;le se trouve dans le fichier{" "}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-[11px] font-medium text-primary-dark">
                      src/lib/simulation.ts
                    </code>.{" "}
                    <a
                      href="https://github.com/MalauryB/quiserapresident"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:text-accent/80"
                    >
                      Voir le code sur GitHub &rarr;
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- Contact ---- */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-primary-dark">
            Contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Suggestion card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-2 text-sm font-bold text-primary-dark">
                Une id&eacute;e d&rsquo;am&eacute;lioration ?
              </h3>
              <p className="mb-3 text-xs text-gray-700">
                Partagez vos suggestions pour am&eacute;liorer la plateforme.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-accent/80"
              >
                Nous &eacute;crire &rarr;
              </Link>
            </div>

            {/* Project card */}
            <a
              href="https://nimli.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-colors hover:bg-neutral-900"
            >
              <Image src="/logo_blanc.png" alt="Nimli" width={40} height={40} className="shrink-0 rounded-lg object-contain" />
              <div>
                <p className="text-sm font-semibold" style={{ color: "#E8DCD0" }}>
                  Fait b&eacute;n&eacute;volement par <span style={{ color: "#D4637A" }}>Nimli</span>
                </p>
                <p className="text-xs text-neutral-400 transition-colors group-hover:text-neutral-300">
                  nimli.fr &rarr;
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* ---- Bottom banner ---- */}
        <div className="rounded-xl bg-primary-dark p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-white">
            Envie de contribuer ?
          </h2>
          <p className="mb-4 text-sm text-primary-light/80">
            Le projet est open source et en d&eacute;veloppement actif.
            Consultez le code, ouvrez une issue ou proposez une pull request.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/MalauryB/quiserapresident"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Code source sur GitHub &rarr;
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Nous contacter &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
