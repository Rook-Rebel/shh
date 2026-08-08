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
  // Video/thumbnail bytes upload straight from the browser to Supabase
  // Storage via a signed URL — they never pass through a Server Action or
  // proxy.ts, so neither needs a raised body-size limit. Every action here
  // only ever carries small metadata (title, description, storage paths).
};

export default nextConfig;
