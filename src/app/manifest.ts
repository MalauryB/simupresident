import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Qui sera président",
    short_name: "Qui sera président",
    description: "Qui sera président — Simulateur interactif de l'élection présidentielle 2027",
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
