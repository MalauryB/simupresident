import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qui pour l\u2019\u00c9lys\u00e9e\u202f?",
    short_name: "Qui pour l\u2019\u00c9lys\u00e9e\u202f?",
    description: "Qui pour l\u2019\u00c9lys\u00e9e\u202f? \u2014 Simulateur interactif de l\u2019\u00e9lection pr\u00e9sidentielle 2027",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#556C96",
    orientation: "portrait",
    lang: "fr",
    icons: [
      {
        src: "/icons/icon-192x192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
