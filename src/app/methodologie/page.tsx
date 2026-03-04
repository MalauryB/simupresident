import { BackLink } from "@/app/components/ui/BackLink";

/* ------------------------------------------------------------------ */
/*  Section card                                                       */
/* ------------------------------------------------------------------ */
function SectionCard({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="rounded-xl border border-gray-200 bg-white p-6"
    >
      <h2 className="mb-3 text-lg font-bold text-primary-dark">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Methodology page                                                   */
/* ------------------------------------------------------------------ */
export default function MethodologiePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <BackLink href="/" />

      {/* Badge */}
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
          DOCUMENTATION
        </span>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          Note m&eacute;thodologique
        </h1>
        <p className="text-gray-600">
          Mod&egrave;le de simulation d&rsquo;une &eacute;lection pr&eacute;sidentielle &agrave; deux tours
        </p>
        <a
          href="/Note_technique.pdf"
          download
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          T&eacute;l&eacute;charger la note technique (PDF)
        </a>
      </div>

      <div className="space-y-8">
        {/* ---- Introduction ---- */}
        <SectionCard title="Objectif du mod&egrave;le">
          <p>
            Ce mod&egrave;le vise &agrave; simuler l&rsquo;&eacute;volution d&rsquo;une campagne
            pr&eacute;sidentielle et &agrave; estimer, par simulations r&eacute;p&eacute;t&eacute;es,
            les probabilit&eacute;s de qualification au second tour puis de victoire finale.
          </p>
          <p>
            L&rsquo;objectif n&rsquo;est pas de pr&eacute;dire un score exact, mais
            d&rsquo;&eacute;valuer des sc&eacute;narios probables en tenant compte :
          </p>
          <ul className="ml-4 list-disc space-y-1">
            <li>des &eacute;quilibres id&eacute;ologiques,</li>
            <li>des al&eacute;as de campagne,</li>
            <li>des tendances structurelles,</li>
            <li>et du vote utile en fin de campagne.</li>
          </ul>
        </SectionCard>

        {/* ---- I. Premier tour ---- */}
        <div>
          <h2 className="mb-4 text-xl font-extrabold text-primary-dark">
            I. Le mod&egrave;le de premier tour
          </h2>
          <div className="space-y-6">
            {/* 1) Blocs idéologiques */}
            <SectionCard title="1) Les blocs id&eacute;ologiques">
              <p>
                En science politique, on analyse souvent l&rsquo;&eacute;lectorat comme
                structur&eacute; en grands blocs id&eacute;ologiques relativement stables
                (par exemple : gauche, centre, droite, extr&ecirc;me droite).
              </p>
              <p>L&rsquo;id&eacute;e centrale est simple :</p>
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-xs font-medium text-primary-dark">
                  Les &eacute;lecteurs votent tr&egrave;s majoritairement pour un candidat
                  appartenant &agrave; leur bloc id&eacute;ologique, et beaucoup plus rarement
                  pour un candidat d&rsquo;un bloc oppos&eacute;.
                </p>
              </div>
              <p>Dans le mod&egrave;le :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Chaque candidat est associ&eacute; &agrave; un profil id&eacute;ologique.</li>
                <li>Certains candidats sont clairement positionn&eacute;s dans un bloc.</li>
                <li>D&rsquo;autres peuvent &ecirc;tre situ&eacute;s entre deux blocs, ce qui leur permet de capter une partie de chacun.</li>
              </ul>
              <p>Cela permet de mod&eacute;liser le fait que :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Les gains d&rsquo;un candidat proviennent principalement de candidats id&eacute;ologiquement proches.</li>
                <li>Les transferts entre blocs &eacute;loign&eacute;s sont rares.</li>
              </ul>
            </SectionCard>

            {/* 2) Dynamique de campagne */}
            <SectionCard title="2) La dynamique de campagne : les &eacute;v&eacute;nements impr&eacute;visibles">
              <p>
                Une campagne &eacute;lectorale est marqu&eacute;e par des &eacute;v&eacute;nements
                difficiles &agrave; anticiper : pol&eacute;miques, d&eacute;bats, affaires,
                crises internationales, prises de position, erreurs de communication.
              </p>
              <p>
                Ces &eacute;v&eacute;nements sont mod&eacute;lis&eacute;s comme une{" "}
                <strong>marche al&eacute;atoire</strong>, c&rsquo;est-&agrave;-dire une succession
                de chocs impr&eacute;visibles.
              </p>
              <p>Deux types d&rsquo;&eacute;v&eacute;nements sont distingu&eacute;s :</p>

              <h3 className="mt-2 text-sm font-bold text-primary-dark">a) Les chocs de bloc</h3>
              <p>
                Certains &eacute;v&eacute;nements affectent tout un bloc id&eacute;ologique.
                Par exemple, une crise s&eacute;curitaire peut b&eacute;n&eacute;ficier &agrave;
                l&rsquo;ensemble des candidats d&rsquo;un bloc. Un d&eacute;bat sur les retraites
                peut affecter globalement les candidats de gauche ou de droite.
              </p>
              <p>
                Dans le mod&egrave;le, ces chocs d&eacute;placent simultan&eacute;ment tous les
                candidats appartenant au m&ecirc;me bloc.
              </p>

              <h3 className="mt-2 text-sm font-bold text-primary-dark">b) Les chocs individuels</h3>
              <p>
                D&rsquo;autres &eacute;v&eacute;nements concernent un candidat en particulier :
                une d&eacute;claration pol&eacute;mique, une erreur strat&eacute;gique, une bonne
                prestation m&eacute;diatique. Ces chocs affectent uniquement le candidat concern&eacute;.
              </p>

              <div className="rounded-xl bg-gray-50 p-4">
                <h3 className="mb-1 text-xs font-bold text-primary-dark">Calibration des param&egrave;tres</h3>
                <p className="text-xs text-gray-600">
                  L&rsquo;intensit&eacute; de ces chocs n&rsquo;est pas choisie arbitrairement.
                  Les param&egrave;tres ont &eacute;t&eacute; estim&eacute;s de mani&egrave;re &agrave;
                  reproduire la volatilit&eacute; observ&eacute;e pendant la campagne pr&eacute;sidentielle
                  de 2022 et l&rsquo;ampleur moyenne des variations de sondages.
                </p>
              </div>
            </SectionCard>

            {/* 3) Tendance */}
            <SectionCard title="3) La tendance de long terme (effet structurel)">
              <p>
                Au-del&agrave; des al&eacute;as quotidiens, certains candidats peuvent &ecirc;tre
                port&eacute;s par une dynamique de fond.
              </p>
              <p>Exemples :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Un gouvernement sortant peut s&rsquo;user apr&egrave;s plusieurs ann&eacute;es de pouvoir.</li>
                <li>Un courant politique peut b&eacute;n&eacute;ficier d&rsquo;un contexte favorable.</li>
                <li>Un candidat peut s&rsquo;installer progressivement comme figure centrale.</li>
              </ul>
              <p>Dans le mod&egrave;le :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Chaque candidat peut avoir une tendance structurelle &agrave; gagner ou perdre des points.</li>
                <li>Cette tendance est lente et cumulative.</li>
                <li>
                  Les points gagn&eacute;s ou perdus ne disparaissent pas :
                  ils sont redistribu&eacute;s principalement vers les candidats id&eacute;ologiquement proches.
                </li>
              </ul>
              <p>
                Cela permet de mod&eacute;liser des ph&eacute;nom&egrave;nes comme
                l&rsquo;&eacute;rosion progressive d&rsquo;un bloc, la mont&eacute;e structurelle
                d&rsquo;un autre, ou la recomposition interne d&rsquo;un espace politique.
              </p>
            </SectionCard>

            {/* 4) Vote utile */}
            <SectionCard title="4) L&rsquo;effet du vote utile">
              <p>
                En fin de campagne, une part significative des &eacute;lecteurs d&eacute;clare
                voter &laquo;&nbsp;utile&nbsp;&raquo;. Les enqu&ecirc;tes sugg&egrave;rent que cette
                proportion pourrait se situer entre 25&nbsp;% et 35&nbsp;%.
              </p>
              <p>
                Le vote utile correspond au comportement suivant : un &eacute;lecteur choisit non
                pas son candidat pr&eacute;f&eacute;r&eacute;, mais celui qui semble le mieux
                plac&eacute; pour atteindre le second tour.
              </p>

              <h3 className="mt-2 text-sm font-bold text-primary-dark">Comment le mod&egrave;le l&rsquo;int&egrave;gre</h3>
              <p>
                Le vote utile est activ&eacute; progressivement dans les derniers jours de campagne.
                Il d&eacute;pend de deux &eacute;l&eacute;ments :
              </p>

              <h3 className="mt-2 text-sm font-bold text-primary-dark">a) L&rsquo;enjeu</h3>
              <p>
                Plus un candidat est proche du seuil estim&eacute; de qualification (fix&eacute;
                dans les simulations &agrave; 15&nbsp;%), plus l&rsquo;&laquo;&nbsp;enjeu&nbsp;&raquo;
                est &eacute;lev&eacute;. Un candidat &agrave; 14&ndash;16&nbsp;% d&eacute;clenche
                donc davantage de vote utile qu&rsquo;un candidat &agrave; 5&nbsp;% ou &agrave; 30&nbsp;%.
              </p>

              <h3 className="mt-2 text-sm font-bold text-primary-dark">b) La capacit&eacute; &agrave; capter le vote utile</h3>
              <p>
                Tous les candidats ne b&eacute;n&eacute;ficient pas &eacute;galement du vote utile.
                Un param&egrave;tre sp&eacute;cifique mesure la cr&eacute;dibilit&eacute;,
                l&rsquo;exp&eacute;rience, la perception de capacit&eacute; &agrave; gouverner et
                la stature pr&eacute;sidentielle.
              </p>
              <p>
                Ainsi, deux candidats &agrave; 14&nbsp;% ne capteront pas n&eacute;cessairement
                la m&ecirc;me quantit&eacute; de vote utile.
              </p>
            </SectionCard>

            {/* 5) Simulations */}
            <SectionCard title="5) Pourquoi utiliser des simulations&nbsp;?">
              <p>
                Le mod&egrave;le ne produit pas une seule trajectoire. Il simule des centaines
                de campagnes possibles, chacune avec ses chocs al&eacute;atoires.
              </p>
              <p>On en d&eacute;duit :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>une trajectoire m&eacute;diane,</li>
                <li>des intervalles d&rsquo;incertitude,</li>
                <li>des probabilit&eacute;s de qualification au second tour.</li>
              </ul>
              <p>Cela permet d&rsquo;&eacute;valuer :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>le degr&eacute; d&rsquo;incertitude,</li>
                <li>la robustesse d&rsquo;un sc&eacute;nario,</li>
                <li>la probabilit&eacute; de retournement.</li>
              </ul>
            </SectionCard>
          </div>
        </div>

        {/* ---- II. Second tour ---- */}
        <div>
          <h2 className="mb-4 text-xl font-extrabold text-primary-dark">
            II. Le mod&egrave;le de second tour
          </h2>
          <div className="space-y-6">
            <SectionCard title="1) Logique g&eacute;n&eacute;rale">
              <p>
                Le second tour est mod&eacute;lis&eacute; &agrave; partir des r&eacute;sultats
                simul&eacute;s du premier tour. On identifie automatiquement les deux candidats
                qualifi&eacute;s dans chaque simulation, puis on mod&eacute;lise les reports de voix.
              </p>
              <p>
                Les &eacute;lecteurs du second tour adoptent l&rsquo;un des trois comportements :
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Voter pour A", color: "#556C96" },
                  { label: "Voter pour B", color: "#B6CDE8" },
                  { label: "Ne pas s\u2019exprimer", color: "#ca8a04" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border p-3 text-center"
                    style={{ borderColor: `${item.color}40` }}
                  >
                    <div
                      className="mx-auto mb-1 h-2 w-8 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <p>Leur choix d&eacute;pend :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>de leur proximit&eacute; id&eacute;ologique avec les finalistes,</li>
                <li>de m&eacute;canismes de &laquo;&nbsp;barrage&nbsp;&raquo;,</li>
                <li>d&rsquo;un taux structurel de non-expression.</li>
              </ul>
            </SectionCard>

            <SectionCard title="2) Le vote de proximit&eacute;">
              <p>
                Les &eacute;lecteurs votent en priorit&eacute; pour le candidat le plus proche
                id&eacute;ologiquement d&rsquo;eux. C&rsquo;est la r&egrave;gle de base du mod&egrave;le.
              </p>
            </SectionCard>

            <SectionCard title="3) Le non-vote">
              <p>
                Si aucun des deux candidats n&rsquo;appartient au bloc d&rsquo;un &eacute;lecteur,
                une partie peut s&rsquo;abstenir, voter blanc, ou refuser de choisir.
                Ce comportement est mod&eacute;lis&eacute; par un param&egrave;tre sp&eacute;cifique.
              </p>
            </SectionCard>

            <SectionCard title="4) Les effets de &laquo;&nbsp;barrage&nbsp;&raquo;">
              <p>Le mod&egrave;le int&egrave;gre deux param&egrave;tres suppl&eacute;mentaires :</p>
              <ul className="ml-4 list-disc space-y-1">
                <li>un taux de rejet de l&rsquo;extr&ecirc;me droite,</li>
                <li>un taux de rejet de la gauche radicale.</li>
              </ul>
              <p>
                Cela permet de mod&eacute;liser les ph&eacute;nom&egrave;nes observ&eacute;s dans
                les seconds tours pass&eacute;s, o&ugrave; certains &eacute;lecteurs votent non pas
                pour soutenir un candidat, mais pour emp&ecirc;cher l&rsquo;autre de gagner.
              </p>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-600">
                  Les valeurs par d&eacute;faut de ces param&egrave;tres sont estim&eacute;es &agrave;
                  partir des comportements observ&eacute;s lors des &eacute;lections l&eacute;gislatives de 2024.
                </p>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* ---- III. Ce que produit le modèle ---- */}
        <SectionCard title="III. Ce que produit le mod&egrave;le">
          <p>&Agrave; l&rsquo;issue des simulations, le mod&egrave;le fournit :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>la probabilit&eacute; de qualification au second tour de chaque candidat,</li>
            <li>la probabilit&eacute; de chaque duel possible,</li>
            <li>la probabilit&eacute; de victoire finale.</li>
          </ul>
        </SectionCard>

        {/* ---- IV. Philosophie ---- */}
        <SectionCard title="IV. Philosophie g&eacute;n&eacute;rale du mod&egrave;le">
          <p>Ce mod&egrave;le repose sur quatre id&eacute;es structurantes :</p>
          <ul className="ml-4 list-decimal space-y-1">
            <li>L&rsquo;&eacute;lectorat est organis&eacute; en blocs relativement stables.</li>
            <li>Les campagnes sont domin&eacute;es par l&rsquo;incertitude et les chocs impr&eacute;visibles.</li>
            <li>Des tendances structurelles peuvent modifier lentement les &eacute;quilibres.</li>
            <li>Le vote utile et les logiques de barrage modifient les comportements &agrave; l&rsquo;approche du scrutin.</li>
          </ul>
          <p>Il ne pr&eacute;tend pas pr&eacute;dire l&rsquo;avenir avec certitude. Il vise &agrave; :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>mesurer l&rsquo;incertitude,</li>
            <li>quantifier les sc&eacute;narios plausibles,</li>
            <li>&eacute;clairer les dynamiques possibles.</li>
          </ul>
        </SectionCard>

        {/* ---- Limites du modele ---- */}
        <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
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
                  Les reports de voix au second tour sont simplifi&eacute;s,
                  sans mod&eacute;liser les dynamiques de campagne de
                  l&rsquo;entre-deux-tours.
                </li>
                <li>
                  Les param&egrave;tres initiaux sont calibr&eacute;s sur les
                  sondages actuels, qui peuvent &eacute;voluer
                  significativement.
                </li>
                <li>
                  Ce simulateur est un{" "}
                  <strong>outil p&eacute;dagogique et de strat&eacute;gie politique</strong> :
                  il n&rsquo;a pas vocation &agrave; pr&eacute;dire le r&eacute;sultat
                  de l&rsquo;&eacute;lection.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---- Sources ---- */}
        <SectionCard title="Sources des donn&eacute;es">
          <p>
            <strong>Sondage agr&eacute;g&eacute; :</strong> Moyenne
            pond&eacute;r&eacute;e des sondages publi&eacute;s par les
            principaux instituts (IFOP, Ipsos, Elabe, Harris Interactive,
            OpinionWay).
          </p>
          <p>
            <strong>Personnalisable :</strong> Permet &agrave;
            l&rsquo;utilisateur de d&eacute;finir librement les points de
            d&eacute;part.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
