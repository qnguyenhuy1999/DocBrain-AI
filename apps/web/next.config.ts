import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@docbrain/ui', '@docbrain/types', '@docbrain/validators'],
}

export default nextConfig
