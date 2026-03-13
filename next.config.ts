import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const remotePatterns: RemotePattern[] = [];

if (wordpressUrl) {
  const { protocol, hostname, port } = new URL(wordpressUrl);

  remotePatterns.push({
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    port,
    pathname: "/wp-content/uploads/**",
  });
}

// remove and replace with self hosted image domain if needed
// or from wordpress server if it serves images directly from there
// make sure does not violate great firewall of china (GFC) rules if you use external image domain
remotePatterns.push({
  protocol: "https",
  hostname: "images.unsplash.com",
  pathname: "/**",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
