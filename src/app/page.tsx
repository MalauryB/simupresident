import { Button } from "@/app/components/ui/Button";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@/app/components/ui/Card";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero section */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Bienvenue sur SimuPresident
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Votre simulateur interactif de gestion présidentielle.
        </p>
        <Button size="lg">Commencer la simulation</Button>
      </section>

      {/* Feature cards */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900">
          Fonctionnalités
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Simulation réaliste</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Prenez des décisions et observez leurs conséquences sur le pays.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm">
                En savoir plus
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Statistiques détaillées</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Suivez l&apos;évolution de votre mandat grâce à des indicateurs
                précis.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm">
                En savoir plus
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Mode hors connexion</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600">
                Jouez partout, même sans connexion internet.
              </p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm">
                En savoir plus
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
