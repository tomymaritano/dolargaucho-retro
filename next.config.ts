import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "https://zvmxlvgonwnkgsjnyxje.supabase.co/storage/v1/s3"], // 👈 Agrega este dominio para permitir imágenes de Unsplash
  },
};

export default nextConfig;
