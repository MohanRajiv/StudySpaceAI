/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Disable webpack processing of pdfjs-dist workers on server
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist/build/pdf.worker.mjs': false,
      };
    }
    return config;
  },
};

export default nextConfig;
