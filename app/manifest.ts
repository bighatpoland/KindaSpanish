import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kinda Spanish",
    short_name: "Kinda Spanish",
    description:
      "A mobile-first Spanish practice app for surviving real-life conversations in Spain.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6eddc",
    theme_color: "#6e4b2e",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
