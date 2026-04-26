import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KSK Shop",
    short_name: "KSK Shop",
    description: "Брендовый магазин женской одежды KSK Shop.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffb089",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
