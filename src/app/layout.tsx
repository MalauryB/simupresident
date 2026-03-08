import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/app/components/layout/Header";
import { Footer } from "@/app/components/layout/Footer";
import { SimulationProvider } from "@/lib/simulation-context";

const SITE_URL = "https://quipresident.fr";
const APP_NAME = "Qui pour l\u2019\u00c9lys\u00e9e\u202f?";
const APP_DESCRIPTION =
  "Simulez l\u2019\u00e9lection pr\u00e9sidentielle 2027 gr\u00e2ce \u00e0 notre mod\u00e8le de simulation interactif. Probabilit\u00e9s, trajectoires et sc\u00e9narios de second tour.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "élection présidentielle 2027",
    "simulation élection",
    "sondages présidentielle",
    "qui sera président",
    "simulateur élection France",
    "Monte Carlo élection",
    "probabilités présidentielle",
  ],
  authors: [{ name: "Nimli", url: "https://nimli.fr" }],
  creator: "Nimli",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#556C96",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" dir="ltr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: APP_NAME,
              url: SITE_URL,
              description: APP_DESCRIPTION,
              applicationCategory: "UtilitiesApplication",
              operatingSystem: "Any",
              inLanguage: "fr",
              author: {
                "@type": "Organization",
                name: "Nimli",
                url: "https://nimli.fr",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-secondary text-primary-dark antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white focus:outline-none"
        >
          Aller au contenu principal
        </a>
        <SimulationProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </SimulationProvider>
      </body>
    </html>
  );
}
