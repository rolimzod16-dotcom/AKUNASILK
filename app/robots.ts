import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/api",
          "/*/admin",
        ],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
