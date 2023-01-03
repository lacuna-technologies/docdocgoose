/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: [`image/avif`, `image/webp`],
    unoptimized: true,
  },
  reactStrictMode: true,
}

module.exports = nextConfig
