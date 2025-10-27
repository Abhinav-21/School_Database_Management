/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true
  },
  experimental: {
    forceSwcTransforms: true
  }
}

module.exports = nextConfig
