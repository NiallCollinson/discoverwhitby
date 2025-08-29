/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@discoverwhitby/ui",
    "@discoverwhitby/db",
    "@discoverwhitby/auth",
  ],
};

export default nextConfig;
