/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during build (already covered by TypeScript)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
