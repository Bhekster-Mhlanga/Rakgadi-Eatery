import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Development in GitHub Codespaces only.
  // VS Code forwards the app to your browser as http://localhost:3000, but the
  // Codespace sends its own public address as the host. Next.js treats that
  // mismatch as a possible forged request and blocks forms ("Invalid Server
  // Actions request"). These entries tell it localhost is expected.
  // Production keeps the strict default, so nothing is loosened there.
  ...(isDev && {
    allowedDevOrigins: ["*.app.github.dev"],
    experimental: {
      serverActions: {
        allowedOrigins: ["localhost:3000", "localhost:3001"],
      },
    },
  }),
};

export default nextConfig;
