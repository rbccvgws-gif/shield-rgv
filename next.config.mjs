/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dev only: let phones reach `npm run dev` through an ngrok tunnel.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.app', '*.ngrok.io'],
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
