import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksk-shop.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/control-room-ksk", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
