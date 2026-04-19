/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this block to allow your local IP
  experimental: {
    serverActions: {
      allowedOrigins: ['172.20.163.161:3000', 'localhost:3000'],
    },
  },
  // If your version specifically requires 'allowedDevOrigins' at the root:
  allowedDevOrigins: ['172.20.163.161'],
};

export default nextConfig;