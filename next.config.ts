import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const HIDDEN_DESTINATIONS = [
  "china",
  "pakistan",
  "turkmenistan",
  "iran",
  "turkey",
  "afghanistan",
  "india",
  "georgia",
  "armenia",
  "azerbaijan",
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/ru", destination: "/en", permanent: true },
      { source: "/ru/:path*", destination: "/en/:path*", permanent: true },
      {
        source: "/:locale/services-logistics",
        destination: "/:locale/services",
        permanent: true,
      },
      {
        source: "/:locale/silk-trails",
        destination: "/:locale/destinations",
        permanent: true,
      },
      {
        source: "/:locale/pricing",
        destination: "/:locale/journeys",
        permanent: true,
      },
      {
        source: "/:locale/partners",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale/plan-journey",
        destination: "/:locale/plan-my-journey",
        permanent: true,
      },
      ...HIDDEN_DESTINATIONS.map((slug) => ({
        source: `/:locale/destinations/${slug}`,
        destination: "/:locale/destinations",
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);