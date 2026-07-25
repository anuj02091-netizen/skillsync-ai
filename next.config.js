/** @type {import('next').NextConfig} */
const nextConfig = {
  // Needed so Next.js doesn't try to bundle pdf-parse for the Edge/browser
  // runtime, which avoids pdf.js worker-related errors on the server.
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
  },
};

module.exports = nextConfig;
