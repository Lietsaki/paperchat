import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: false,
  sassOptions: {
    loadPaths: [path.join(import.meta.dirname, 'styles')],
    prependData: `@use "main.scss" as *;`
  }
}

export default nextConfig