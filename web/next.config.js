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
  // Skip static export to avoid monorepo React version conflicts
  output: undefined,
}

module.exports = nextConfig
