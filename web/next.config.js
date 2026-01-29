/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    // Ignore ESLint during builds - parser version conflict with monorepo
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
