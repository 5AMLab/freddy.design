/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
  // The cPanel host caps process count tightly enough that Next's default
  // parallel static-generation workers hit EAGAIN mid-build. One worker is
  // slower but reliable within that limit.
  experimental: {
    cpus: 1,
  },
  // Permanent redirect for the removed Maison Freddy case study (spec 1.9).
  // The site isn't indexed yet, so this is cheap insurance rather than a
  // rescue — it covers any link already shared privately.
  async redirects() {
    return [
      {
        source: "/work/maison-freddy-cold-brew",
        destination: "/work",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
