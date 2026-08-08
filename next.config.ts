import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Video uploads go through a Server Action (multipart FormData), so
      // the default 1MB limit needs raising. 100mb leaves headroom above
      // Supabase's free-tier 50MB-per-file storage default.
      bodySizeLimit: "100mb",
    },
    // proxy.ts runs on every /admin request and buffers the body (to check
    // the admin session cookie), separately from the Server Actions limit
    // above. Its own default is 10MB, which silently truncates any upload
    // past that — matching it to the same ceiling.
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
