import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksk-shop.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/catalog", "/about", "/checkout", "/account"];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "daily",
    priority: route === "/" ? 1 : 0.8,
  }));
}
