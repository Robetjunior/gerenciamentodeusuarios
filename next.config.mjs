
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // We'll use the app directory structure rather than modifying tsconfig
  experimental: {
    appDir: false,
  },
  // Ensure compatibility with existing imports
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname + '/src',
    };
    return config;
  },
};

export default nextConfig;
