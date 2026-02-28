import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Formula block (math notation in monospace)                         */
/* ------------------------------------------------------------------ */
function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl bg-gray-50 px-4 py-3">
      <div className="font-mono text-sm leading-relaxed text-primary-dark">
        {children}
      </div>
    </div>
  );
}

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
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-3 text-lg font-bold text-primary-dark">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </div>
  );
}

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
        {/* ---- Idée générale ---- */}
        <SectionCard title="L'id&eacute;e g&eacute;n&eacute;rale">
          <p>
            Le programme simule une &eacute;lection pr&eacute;sidentielle en{" "}
            <strong>deux temps</strong> :
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong>Premier tour :</strong> on simule jour apr&egrave;s jour
              l&rsquo;&eacute;volution des intentions de vote des candidats,
              avec une part de hasard (comme des &laquo; petits
              &eacute;v&eacute;nements &raquo; quotidiens).
            </li>
            <li>
              <strong>Second tour :</strong> &agrave; la fin, on regarde qui
              sont les deux premiers, puis on simule comment les &eacute;lecteurs
              des autres candidats se reportent, en tenant compte de la
              proximit&eacute; id&eacute;ologique, de l&rsquo;abstention, et
              d&rsquo;un possible vote barrage (refus d&rsquo;un candidat
              jug&eacute; extr&ecirc;me).
            </li>
          </ul>
          <p>
            L&rsquo;ensemble repose sur une m&eacute;thode{" "}
            <strong>Monte Carlo</strong> : on r&eacute;p&egrave;te la simulation
            des centaines de fois pour obtenir non seulement une courbe moyenne,
            mais aussi des <strong>bandes d&rsquo;incertitude</strong>.
          </p>
        </SectionCard>

        {/* ---- A) Dynamique de base ---- */}
        <SectionCard
          id="dynamique"
          title="A) La dynamique de base (premier tour)"
        >
          <p>
            Chaque candidat a une courbe d&rsquo;intentions de vote qui bouge
            chaque jour. On part d&rsquo;une{" "}
            <strong>situation initiale</strong> (les parts v<sub>0</sub>).
          </p>
          <p>Chaque jour, il y a :</p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              Un <strong>choc &laquo; id&eacute;ologique &raquo; commun</strong>{" "}
              (3 dimensions dans &nu;) qui impacte les candidats selon leur
              position dans l&rsquo;espace politique (matrice W).
            </li>
            <li>
              Un{" "}
              <strong>bruit propre &agrave; chaque candidat</strong>{" "}
              (&eacute;v&eacute;nements, bourdes, actualit&eacute;s).
            </li>
          </ul>
          <p>
            En plus, le mod&egrave;le introduit une petite{" "}
            <strong>tendance n&eacute;gative (drift)</strong> sur certains
            candidats : ils perdent l&eacute;g&egrave;rement chaque jour, et ces
            voix sont redistribu&eacute;es en partie vers les autres candidats
            proches d&rsquo;eux.
          </p>

          <div className="rounded-xl bg-gray-50 p-4">
            <code className="block font-mono text-sm text-primary-dark">
              V<sub>i</sub>(t+1) = V<sub>i</sub>(t) + drift<sub>i</sub> +
              W&sdot;&nu;(t) + &epsilon;<sub>i</sub>(t)
            </code>
            <div className="mt-2 space-y-1 font-mono text-xs text-gray-500">
              <p>
                drift<sub>i</sub> = (tendance<sub>i</sub> &minus; 0.5) &times;
                0.0003
              </p>
              <p>
                &nu;(t) ~ N(0, &Sigma;) &mdash; choc commun en 3 dimensions
              </p>
              <p>
                &epsilon;<sub>i</sub>(t) ~ N(0, &sigma;<sup>2</sup>) &mdash;
                bruit propre au candidat
              </p>
            </div>
          </div>

          <p className="text-xs italic text-gray-400">
            R&eacute;sultat : m&ecirc;me sans vote utile, on obtient des
            trajectoires plausibles et incertaines des intentions de vote.
          </p>
        </SectionCard>

        {/* ---- B) Vote utile ---- */}
        <SectionCard id="vote-utile" title="B) Le vote utile (premier tour)">
          <p>
            Le vote utile n&rsquo;est pas actif tout le temps : il est
            activ&eacute; seulement{" "}
            <strong>&agrave; la fin de la campagne</strong> (derniers jours),
            via une fonction progressive{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-primary-dark">
              activation(t)
            </code>
            .
          </p>
          <p>
            Quand il s&rsquo;active, une partie des &eacute;lecteurs des
            &laquo; petits &raquo; candidats se d&eacute;place vers des
            candidats :
          </p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong>Id&eacute;ologiquement proches</strong> (proximit&eacute;
              via cosinus sur la matrice W).
            </li>
            <li>
              <strong>Jug&eacute;s plus viables</strong> (ceux qui sont
              d&eacute;j&agrave; hauts dans les intentions).
            </li>
            <li>
              &Eacute;ventuellement{" "}
              <strong>favoris&eacute;s/d&eacute;favoris&eacute;s structurellement</strong>{" "}
              par le param&egrave;tre &psi;.
            </li>
          </ul>
          <p>
            L&rsquo;effet est <strong>&laquo; doux &raquo;</strong> : ce
            n&rsquo;est pas un transfert brutal. Chaque candidat garde une
            fraction de ses voix, et l&rsquo;autre fraction est
            redistribu&eacute;e selon une r&egrave;gle probabiliste.
          </p>
          <div className="rounded-xl bg-primary/5 p-4">
            <p className="text-xs font-medium text-primary-dark">
              Le vote utile sert &agrave; reproduire une dynamique
              r&eacute;aliste de &laquo; cristallisation &raquo; en fin de
              campagne.
            </p>
          </div>
        </SectionCard>

        {/* ---- C) Vote barrage ---- */}
        <SectionCard
          id="vote-barrage"
          title="C) Le vote barrage (second tour)"
        >
          <p>
            Au second tour, on prend les{" "}
            <strong>deux premiers du premier tour</strong> : A et B.
          </p>
          <p>
            Pour chaque &eacute;lectorat (les &eacute;lecteurs du candidat 1, du
            2, etc.), le mod&egrave;le calcule la probabilit&eacute; de :
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: "Voter pour A", color: "#556C96" },
              { label: "Voter pour B", color: "#B6CDE8" },
              { label: "S'abstenir", color: "#ca8a04" },
              { label: "Voter blanc/nul", color: "#9ca3af" },
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
          <p>
            Les &eacute;lecteurs ont tendance &agrave; choisir le finaliste le
            plus <strong>proche d&rsquo;eux</strong> dans l&rsquo;espace
            id&eacute;ologique (via cosinus sur W).
          </p>
          <p>
            Mais le mod&egrave;le ajoute une chose tr&egrave;s importante : une{" "}
            <strong>p&eacute;nalit&eacute; de rejet</strong> si un candidat
            finaliste est per&ccedil;u comme &laquo; extr&ecirc;me &raquo;.
          </p>
          <div className="rounded-xl bg-accent/5 p-4">
            <p className="mb-2 text-xs font-bold text-accent">
              Deux param&egrave;tres globaux de barrage
            </p>
            <ul className="ml-4 list-disc space-y-1 text-xs text-gray-600">
              <li>
                <strong>&gamma;_ED</strong> (barrage extr&ecirc;me droite) : p&eacute;nalise
                les candidats selon leur composante droite (W<sub>droite</sub>).
              </li>
              <li>
                <strong>&gamma;_EG</strong> (barrage extr&ecirc;me gauche) : p&eacute;nalise
                les candidats selon leur composante gauche (W<sub>gauche</sub>).
              </li>
              <li>
                La p&eacute;nalit&eacute; de chaque candidat est calcul&eacute;e automatiquement :
                &rho;<sub>k</sub> = &gamma;_ED &times; W<sub>k,droite</sub> + &gamma;_EG &times; W<sub>k,gauche</sub>.
              </li>
              <li>
                C&rsquo;est une fa&ccedil;on simple et calibrable de
                repr&eacute;senter le &laquo; front r&eacute;publicain &raquo;
                ou au contraire son affaiblissement.
              </li>
            </ul>
          </div>
        </SectionCard>

        {/* ---- Paramètres du modèle ---- */}
        <div>
          <h2 className="mb-4 text-lg font-bold text-primary-dark">
            Les param&egrave;tres ajustables
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ParamCard
              title="Point de d&eacute;part (v₀)"
              tagLabel="sondages"
              tagColor="#556C96"
            >
              <p>
                Intention de vote initiale, issue des sondages
                agr&eacute;g&eacute;s, d&eacute;biais&eacute;s ou
                personnalis&eacute;s. C&rsquo;est la valeur de d&eacute;part de
                la trajectoire.
              </p>
            </ParamCard>

            <ParamCard
              title="Tendance (drift)"
              tagLabel="dynamique"
              tagColor="#16a34a"
            >
              <p>
                Param&egrave;tre entre 0 et 1 repr&eacute;sentant la dynamique
                de long terme. Au-dessus de 0.5, le candidat progresse ;
                en-dessous, il recule.
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
              title="Barrage ED / EG (&gamma;)"
              tagLabel="2nd tour"
              tagColor="#ea580c"
            >
              <p>
                Deux coefficients globaux qui p&eacute;nalisent les candidats
                extr&ecirc;mes au second tour. &gamma;_ED s&rsquo;applique
                proportionnellement &agrave; la composante droite, &gamma;_EG
                &agrave; la composante gauche du vecteur id&eacute;ologique.
              </p>
            </ParamCard>

            <ParamCard
              title="Positionnement id&eacute;ologique (W)"
              tagLabel="reports"
              tagColor="#8B5CF6"
            >
              <p>
                R&eacute;partition gauche/centre/droite en 3 dimensions,
                utilis&eacute;e pour mod&eacute;liser les chocs communs, le vote
                utile et les reports au second tour.
              </p>
            </ParamCard>

            <ParamCard
              title="Vote utile (&psi;)"
              tagLabel="1er tour"
              tagColor="#0891b2"
            >
              <p>
                Facteur structurel favorisant ou d&eacute;favorisant certains
                candidats lors de la cristallisation en fin de campagne. Agit en
                compl&eacute;ment de la proximit&eacute; id&eacute;ologique.
              </p>
            </ParamCard>
          </div>
        </div>

        {/* ---- Formalisation mathématique ---- */}
        <div id="maths">
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary">
              FORMALISATION
            </span>
          </div>
          <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-primary-dark">
            Mod&egrave;le math&eacute;matique
          </h2>
        </div>

        {/* -- Notations -- */}
        <SectionCard id="notations" title="Notations">
          <p>
            On consid&egrave;re <strong>K</strong> candidats. &Agrave; chaque date{" "}
            <em>t &isin; {"{"}1, &hellip;, T{"}"}</em>, on note{" "}
            <strong>v<sub>t</sub></strong> le vecteur des intentions de vote
            (parts) vivant sur le simplexe :
          </p>
          <Formula>
            v<sub>t</sub> &isin; &Delta;<sup>K&minus;1</sup> &nbsp;&nbsp;
            (v<sub>t,k</sub> &ge; 0, &nbsp; &sum;<sub>k</sub> v<sub>t,k</sub> = 1)
          </Formula>
          <p>
            On dispose d&rsquo;un <em>embedding</em> id&eacute;ologique{" "}
            <strong>W &isin; &real;<sup>K&times;B</sup></strong> o&ugrave;{" "}
            <em>B = 3</em> (gauche, centre, droite).
          </p>
          <p>
            On travaille en <strong>logits relatifs</strong> &agrave; une baseline
            (candidat K) :
          </p>
          <Formula>
            &eta;<sub>t</sub> &isin; &real;<sup>K&minus;1</sup>, &nbsp;&nbsp;
            <span className="text-gray-400">
              &eta;&#771;<sub>t</sub> = (&eta;<sub>t</sub>, 0)
            </span>
          </Formula>
          <p>
            La transformation softmax convertit les logits en parts :{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-primary-dark">
              softmax(x)<sub>k</sub> = exp(x<sub>k</sub>) / &sum;<sub>j</sub> exp(x<sub>j</sub>)
            </code>
          </p>
          <p>
            La similarit&eacute; cosinus entre deux vecteurs :{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-primary-dark">
              cos(a, b) = &lang;a, b&rang; / (||a|| &middot; ||b||)
            </code>
          </p>
        </SectionCard>

        {/* -- Premier tour : dynamique latente -- */}
        <SectionCard
          id="dynamique-latente"
          title="Premier tour : dynamique latente"
        >
          <h3 className="text-sm font-bold text-primary-dark">
            Chocs factoriels et idiosyncratiques
          </h3>
          <p>
            Chaque jour, un facteur id&eacute;ologique commun affecte tous les
            candidats selon leur position dans l&rsquo;espace W :
          </p>
          <Formula>
            <p>&nu;<sub>t</sub> ~ N(0, Q<sub>f</sub>)&nbsp;&nbsp; avec Q<sub>f</sub> = diag(&sigma;<sub>f,1</sub><sup>2</sup>, &hellip;, &sigma;<sub>f,B</sub><sup>2</sup>)</p>
            <p className="mt-1">&epsilon;<sub>t</sub> ~ N(0, D)&nbsp;&nbsp; avec D = diag(&sigma;<sub>&epsilon;,1</sub><sup>2</sup>, &hellip;, &sigma;<sub>&epsilon;,K</sub><sup>2</sup>)</p>
            <p className="mt-2 font-semibold">u<sub>t</sub> = W&middot;&nu;<sub>t</sub> + &epsilon;<sub>t</sub></p>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            Drift cibl&eacute; et compensation
          </h3>
          <p>
            Un drift &delta; &lt; 0 est appliqu&eacute; sur un candidat c* (perte
            progressive). Les voix perdues sont redistribu&eacute;es aux candidats
            proches :
          </p>
          <Formula>
            <p>s<sub>k</sub> = cos(W<sub>c*</sub>, W<sub>k</sub>), &nbsp;&nbsp; w<sub>k</sub> = s<sub>k</sub> / &sum;<sub>j&ne;c*</sub> s<sub>j</sub></p>
            <p className="mt-1">u<sub>t,k</sub> &larr; u<sub>t,k</sub> &minus; &delta; &middot; w<sub>k</sub></p>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            &Eacute;volution des logits et parts
          </h3>
          <Formula>
            <p>&eta;<sub>t</sub> = (1 &minus; &kappa;) &middot; &eta;<sub>t&minus;1</sub> + u<sub>t, 1:(K&minus;1)</sub></p>
            <p className="mt-1 text-gray-500 text-xs">&kappa; &ge; 0 : param&egrave;tre de mean-reversion (proche de 0 en pratique)</p>
            <p className="mt-2 font-semibold">v<sub>t</sub><sup>base</sup> = softmax(&eta;&#771;<sub>t</sub>)</p>
          </Formula>
        </SectionCard>

        {/* -- Vote utile : formalisation -- */}
        <SectionCard
          id="vote-utile-maths"
          title="Vote utile : formalisation"
        >
          <h3 className="text-sm font-bold text-primary-dark">
            Activation temporelle
          </h3>
          <Formula>
            a<sub>t</sub> = 1 / (1 + exp((T &minus; t &minus; &tau;<sub>0</sub>) / s<sub>&tau;</sub>)) &nbsp;&isin; (0, 1)
          </Formula>
          <p className="text-xs text-gray-500">
            &tau;<sub>0</sub> contr&ocirc;le le moment d&rsquo;activation,{" "}
            s<sub>&tau;</sub> sa pente.
          </p>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            R&eacute;tention et masse mobile
          </h3>
          <p>
            Une fonction logistique d&eacute;termine la fraction de voix que
            chaque candidat conserve :
          </p>
          <Formula>
            <p>r(v) = 1 / (1 + exp(&minus;(v &minus; &tau;<sub>vote</sub>) / s<sub>v</sub>))</p>
            <p className="mt-1">m<sub>k</sub> = (1 &minus; r<sub>k</sub>) &middot; v<sub>t,k</sub><sup>base</sup> &nbsp;&nbsp;<span className="text-gray-400">(masse mobile)</span></p>
            <p>v<sub>k</sub><sup>keep</sup> = r<sub>k</sub> &middot; v<sub>t,k</sub><sup>base</sup> &nbsp;&nbsp;<span className="text-gray-400">(fraction conserv&eacute;e)</span></p>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            Matrice de redistribution
          </h3>
          <p>
            Le score de transfert d&rsquo;un candidat source <em>j</em> vers une
            destination <em>k</em> combine proximit&eacute; id&eacute;ologique,
            viabilit&eacute; et biais structurel :
          </p>
          <Formula>
            <p>score<sub>j&rarr;k</sub> = cos(W<sub>j</sub>, W<sub>k</sub>)<sup>&lambda;<sub>cos</sub></sup> &middot; exp(&psi;<sub>k</sub> + &beta;<sub>viab</sub> &middot; log(v<sub>t,k</sub><sup>base</sup> + &epsilon;))</p>
            <p className="mt-1">A<sub>j&rarr;k</sub> = score<sub>j&rarr;k</sub> / &sum;<sub>&ell;</sub> score<sub>j&rarr;&ell;</sub></p>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            Transformation finale
          </h3>
          <Formula>
            <p>v<sub>t</sub><sup>VU</sup> = v<sup>keep</sup> + m<sup>T</sup> &middot; A &nbsp;&nbsp;<span className="text-gray-400">(puis renormalis&eacute;)</span></p>
            <p className="mt-2 font-semibold">v<sub>t</sub><sup>obs</sup> = (1 &minus; a<sub>t</sub>) &middot; v<sub>t</sub><sup>base</sup> + a<sub>t</sub> &middot; v<sub>t</sub><sup>VU</sup></p>
          </Formula>
        </SectionCard>

        {/* -- Second tour -- */}
        <SectionCard
          id="second-tour-maths"
          title="Second tour : reports, abstention et barrage"
        >
          <h3 className="text-sm font-bold text-primary-dark">
            S&eacute;lection des finalistes
          </h3>
          <Formula>
            A = argmax<sub>k</sub> v<sub>T,k</sub><sup>obs</sup>, &nbsp;&nbsp;
            B = argmax<sub>k&ne;A</sub> v<sub>T,k</sub><sup>obs</sup>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            P&eacute;nalit&eacute; de rejet (vote barrage)
          </h3>
          <Formula>
            &rho;<sub>k</sub> = &gamma;<sub>ED</sub> &middot; W<sub>k,3</sub> + &gamma;<sub>EG</sub> &middot; W<sub>k,1</sub>
          </Formula>
          <p className="text-xs text-gray-500">
            &gamma;<sub>ED</sub>, &gamma;<sub>EG</sub> &ge; 0 contr&ocirc;lent
            l&rsquo;intensit&eacute; du rejet pour les extr&ecirc;mes droite/gauche.
          </p>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            Logits &agrave; 4 issues par &eacute;lectorat source <em>s</em>
          </h3>
          <Formula>
            <p>&ell;<sub>A</sub>(s) = &beta; &middot; cos(W<sub>s</sub>, W<sub>A</sub>)<sup>&lambda;</sup> &minus; &rho;<sub>A</sub></p>
            <p>&ell;<sub>B</sub>(s) = &beta; &middot; cos(W<sub>s</sub>, W<sub>B</sub>)<sup>&lambda;</sup> &minus; &rho;<sub>B</sub></p>
            <p className="mt-1">&ell;<sub>abst</sub>(s) = &alpha;<sub>abst</sub> + &kappa;<sub>abst</sub> &middot; d<sub>s</sub></p>
            <p>&ell;<sub>bn</sub>(s) = &alpha;<sub>bn</sub> + &kappa;<sub>bn</sub> &middot; d<sub>s</sub></p>
            <p className="mt-1 text-xs text-gray-400">o&ugrave; d<sub>s</sub> = 1 &minus; max(simA<sub>s</sub>, simB<sub>s</sub>)</p>
          </Formula>

          <h3 className="mt-4 text-sm font-bold text-primary-dark">
            Matrice de transition et agr&eacute;gation
          </h3>
          <Formula>
            <p>M<sub>s,&middot;</sub> = softmax(&ell;<sub>A</sub>(s), &ell;<sub>B</sub>(s), &ell;<sub>abst</sub>(s), &ell;<sub>bn</sub>(s))</p>
            <p className="mt-2">V<sup>(2)</sup><sub>ins</sub> = (v<sub>T</sub><sup>obs</sup>)<sup>T</sup> &middot; M &nbsp;&isin; &real;<sup>4</sup></p>
            <p className="mt-1 font-semibold">V<sup>(2)</sup><sub>expr</sub>(A) = V<sup>(2)</sup><sub>ins</sub>(A) / (V<sup>(2)</sup><sub>ins</sub>(A) + V<sup>(2)</sup><sub>ins</sub>(B))</p>
          </Formula>
        </SectionCard>

        {/* -- Monte Carlo -- */}
        <SectionCard id="monte-carlo" title="Monte Carlo et probabilit&eacute;s">
          <p>
            On r&eacute;p&egrave;te <strong>S</strong> simulations
            ind&eacute;pendantes. &Agrave; chaque simulation <em>s</em>, on
            obtient une trajectoire compl&egrave;te puis le duel final.
          </p>
          <p>On estime alors :</p>
          <ul className="ml-4 list-disc space-y-2">
            <li>
              <strong>P(qualification)</strong> :{" "}
              <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-primary-dark">
                P(k &isin; {"{"}A, B{"}"}) &approx; (1/S) &middot; &sum; 1{"{"}k &isin; {"{"}A<sup>(s)</sup>, B<sup>(s)</sup>{"}"}{"}"}</code>
            </li>
            <li>
              <strong>Probabilit&eacute;s de duels</strong> : fr&eacute;quences
              empiriques des paires (A<sup>(s)</sup>, B<sup>(s)</sup>).
            </li>
            <li>
              <strong>P(victoire)</strong> : fr&eacute;quence empirique du
              gagnant au second tour.
            </li>
            <li>
              <strong>Intervalles de cr&eacute;dibilit&eacute;</strong> :
              quantiles des distributions simul&eacute;es (ex. 10%&ndash;90% ou
              12.5%&ndash;87.5%).
            </li>
          </ul>
        </SectionCard>

        {/* ---- Sources des données ---- */}
        <SectionCard title="Sources des donn&eacute;es">
          <p>
            <strong>Sondage agr&eacute;g&eacute; :</strong> Moyenne
            pond&eacute;r&eacute;e des sondages publi&eacute;s par les
            principaux instituts (IFOP, Ipsos, Elabe, Harris Interactive,
            OpinionWay).
          </p>
          <p>
            <strong>Sondage d&eacute;biais&eacute; :</strong> Sondages
            corrig&eacute;s des biais historiques de chaque institut (
            <em>house effects</em>), calibr&eacute;s sur les r&eacute;sultats
            r&eacute;els des &eacute;lections pr&eacute;c&eacute;dentes.
          </p>
          <p>
            <strong>Personnalisable :</strong> Permet &agrave;
            l&rsquo;utilisateur de d&eacute;finir librement les points de
            d&eacute;part.
          </p>
        </SectionCard>

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
                  Les reports de voix au second tour sont simplifi&eacute;s via
                  la matrice W et le coefficient &rho;, sans mod&eacute;liser les
                  dynamiques de campagne de l&rsquo;entre-deux-tours.
                </li>
                <li>
                  Les param&egrave;tres initiaux sont calibr&eacute;s sur les
                  sondages actuels, qui peuvent &eacute;voluer
                  significativement.
                </li>
                <li>
                  Ce simulateur est un{" "}
                  <strong>outil p&eacute;dagogique</strong> : il n&rsquo;a pas
                  vocation &agrave; pr&eacute;dire le r&eacute;sultat de
                  l&rsquo;&eacute;lection.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
