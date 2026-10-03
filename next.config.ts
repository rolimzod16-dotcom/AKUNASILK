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
        hostname: "images.pexels.com",
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
  async rewrites() {
    return [{ source: "/admin/about", destination: "/admin/partners" }];
  },
  async redirects() {
    return [
      {
        source: "/:locale(en|ru)/services-logistics",
        destination: "/:locale/services",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/silk-trails",
        destination: "/:locale/destinations",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/pricing",
        destination: "/:locale/journeys",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/partners",
        destination: "/:locale/about",
        permanent: true,
      },
      {
        source: "/:locale(en|ru)/plan-journey",
        destination: "/:locale/plan-my-journey",
        permanent: true,
      },
      ...HIDDEN_DESTINATIONS.map((slug) => ({
        source: `/:locale(en|ru)/destinations/${slug}`,
        destination: "/:locale/destinations",
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);