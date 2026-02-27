import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Parameter card                                                     */
/* ------------------------------------------------------------------ */
function ParamCard({
  title,
  tagLabel,
  tagColor,
  children,
}: {
  title: string;
  tagLabel: string;
  tagColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold text-primary-dark">{title}</h3>
        <span
          className="shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: `${tagColor}18`, color: tagColor }}
        >
          {tagLabel}
        </span>
      </div>
      <div className="text-xs leading-relaxed text-gray-500">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Methodology page (server component)                                */
/* ------------------------------------------------------------------ */
export default function MethodologiePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-dark"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour
      </Link>

      {/* Badge */}
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
          DOCUMENTATION
        </span>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          M&eacute;thodologie
        </h1>
        <p className="text-gray-500">
          Comment fonctionne notre mod&egrave;le de simulation
          &eacute;lectorale.
        </p>
      </div>

      <div className="space-y-8">
        {/* ---- Principe general ---- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            Principe g&eacute;n&eacute;ral
          </h2>
          <p className="mb-3 text-sm leading-relaxed text-gray-600">
            Notre simulateur repose sur une m&eacute;thode de{" "}
            <strong>Monte Carlo</strong> : nous g&eacute;n&eacute;rons un grand
            nombre de sc&eacute;narios al&eacute;atoires (10 000) pour estimer
            les probabilit&eacute;s de chaque &eacute;v&eacute;nement
            (&eacute;limination au premier tour, qualification, victoire).
          </p>
          <p className="text-sm leading-relaxed text-gray-600">
            Chaque sc&eacute;nario simule l&rsquo;&eacute;volution quotidienne
            des intentions de vote sur 365 jours, en appliquant un bruit
            al&eacute;atoire et une tendance de fond propre &agrave; chaque
            candidat.
          </p>
        </div>

        {/* ---- Parametres du modele ---- */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-primary-dark">
            Les param&egrave;tres du mod&egrave;le
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ParamCard
              title="Point de d&eacute;part"
              tagLabel="sondages"
              tagColor="#556C96"
            >
              <p>
                Intention de vote initiale, issue des sondages
                agr&eacute;g&eacute;s, d&eacute;biais&eacute;s ou
                personnalis&eacute;s. C&rsquo;est la valeur de
                d&eacute;part de la trajectoire.
              </p>
            </ParamCard>

            <ParamCard
              title="Tendance"
              tagLabel="dynamique"
              tagColor="#16a34a"
            >
              <p>
                Param&egrave;tre entre 0 et 1 repr&eacute;sentant la dynamique
                de long terme. Au-dessus de 0.5, le candidat a tendance &agrave;
                progresser ; en-dessous, &agrave; reculer.
              </p>
            </ParamCard>

            <ParamCard
              title="Attractivit&eacute;"
              tagLabel="volatilit&eacute;"
              tagColor="#FFB800"
            >
              <p>
                Mesure la stabilit&eacute; de l&rsquo;&eacute;lectorat. Une
                forte attractivit&eacute; r&eacute;duit la dispersion de
                l&rsquo;intervalle de confiance : l&rsquo;&eacute;lectorat est
                plus fid&egrave;le.
              </p>
            </ParamCard>

            <ParamCard
              title="Coefficient barrage"
              tagLabel="2nd tour"
              tagColor="#ea580c"
            >
              <p>
                Repr&eacute;sente le niveau de &laquo; vote
                barrage &raquo; oppos&eacute; au candidat au second tour. Plus
                il est &eacute;lev&eacute;, plus le candidat aura du mal
                &agrave; convertir une qualification en victoire.
              </p>
            </ParamCard>

            <ParamCard
              title="Positionnement id&eacute;ologique"
              tagLabel="reports"
              tagColor="#8B5CF6"
            >
              <p>
                R&eacute;partition gauche/centre/droite, utilis&eacute;e pour
                mod&eacute;liser les reports de voix entre candidats
                &eacute;limin&eacute;s et candidats restants.
              </p>
            </ParamCard>
          </div>
        </div>

        {/* ---- Processus de simulation ---- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            Processus de simulation
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            Pour chaque jour <em>t</em> et chaque candidat <em>i</em>, la
            valeur est mise &agrave; jour selon :
          </p>
          <div className="mb-4 rounded-xl bg-gray-50 p-4">
            <code className="block font-mono text-sm text-primary-dark">
              V<sub>i</sub>(t+1) = V<sub>i</sub>(t) + drift<sub>i</sub> +
              &epsilon;
            </code>
            <div className="mt-2 space-y-1 font-mono text-xs text-gray-500">
              <p>
                drift<sub>i</sub> = (tendance<sub>i</sub> &minus; 0.5)
                &times; 0.0003
              </p>
              <p>&epsilon; ~ N(0, &sigma;&sup2;) avec &sigma; = 0.004</p>
              <p>
                IC(t) = V<sub>i</sub>(t) &plusmn; spread(t, attractivit&eacute;
                <sub>i</sub>)
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Le <em>spread</em> (largeur de l&rsquo;intervalle de confiance)
            augmente avec le temps et diminue avec l&rsquo;attractivit&eacute; du
            candidat.
          </p>
        </div>

        {/* ---- Simulation des deux tours ---- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            Simulation des deux tours
          </h2>
          <div className="space-y-3 text-sm leading-relaxed text-gray-600">
            <p>
              <strong>Premier tour :</strong> &Agrave; l&rsquo;issue de la
              simulation, les deux candidats en t&ecirc;te sont
              s&eacute;lectionn&eacute;s pour le second tour. La
              probabilit&eacute; de qualification tient compte de la position
              relative du candidat.
            </p>
            <p>
              <strong>Second tour :</strong> La probabilit&eacute; de
              victoire combine la probabilit&eacute; de qualification avec un
              mod&egrave;le de duel int&eacute;grant le coefficient
              &laquo; barrage &raquo;. Un candidat ayant un fort barrage voit sa
              probabilit&eacute; de victoire r&eacute;duite, m&ecirc;me
              s&rsquo;il se qualifie souvent.
            </p>
          </div>
        </div>

        {/* ---- Resultats et IC ---- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            R&eacute;sultats et intervalles de confiance
          </h2>
          <p className="text-sm leading-relaxed text-gray-600">
            Les r&eacute;sultats affich&eacute;s sont la moyenne et le
            75&egrave;me percentile sur l&rsquo;ensemble des simulations. Les
            bandes color&eacute;es sur le graphique de trajectoire
            repr&eacute;sentent l&rsquo;intervalle dans lequel le candidat
            se situe dans 75% des sc&eacute;narios. Plus cet intervalle est
            large, plus l&rsquo;incertitude est grande.
          </p>
        </div>

        {/* ---- Sources des donnees ---- */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-bold text-primary-dark">
            Sources des donn&eacute;es
          </h2>
          <div className="space-y-2 text-sm leading-relaxed text-gray-600">
            <p>
              <strong>Sondage agr&eacute;g&eacute; :</strong> Moyenne
              pond&eacute;r&eacute;e des sondages publi&eacute;s par les
              principaux instituts (IFOP, Ipsos, Elabe, Harris Interactive,
              OpinionWay).
            </p>
            <p>
              <strong>Sondage d&eacute;biais&eacute; :</strong> Sondages
              corrig&eacute;s des biais historiques de chaque institut
              (<em>house effects</em>), calibr&eacute;s sur les
              r&eacute;sultats r&eacute;els des &eacute;lections
              pr&eacute;c&eacute;dentes.
            </p>
            <p>
              <strong>Personnalisable :</strong> Permet &agrave;
              l&rsquo;utilisateur de d&eacute;finir librement les points de
              d&eacute;part.
            </p>
          </div>
        </div>

        {/* ---- Limites du modele (warning card) ---- */}
        <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="mb-2 text-lg font-bold text-primary-dark">
                Limites du mod&egrave;le
              </h2>
              <ul className="space-y-2 text-sm leading-relaxed text-gray-600">
                <li>
                  Le mod&egrave;le ne prend pas en compte les
                  &eacute;v&eacute;nements impr&eacute;visibles (scandales,
                  crises, changements d&rsquo;alliances).
                </li>
                <li>
                  Les reports de voix au second tour sont simplifi&eacute;s et
                  ne mod&eacute;lisent pas les dynamiques de campagne.
                </li>
                <li>
                  Les param&egrave;tres initiaux sont calibr&eacute;s sur les
                  sondages actuels, qui peuvent &eacute;voluer
                  significativement.
                </li>
                <li>
                  Ce simulateur est un outil p&eacute;dagogique : il
                  n&rsquo;a pas vocation &agrave; pr&eacute;dire le
                  r&eacute;sultat de l&rsquo;&eacute;lection.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
