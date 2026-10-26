import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Anciennes adresses conservées pour les liens déjà partagés et le référencement.
    return [
      { source: "/reprise", destination: "/vendre", permanent: true },
      { source: "/requete-recherche", destination: "/recherche-personnalisee", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
