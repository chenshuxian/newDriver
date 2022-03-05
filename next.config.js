/**
 * @type {import('next').NextConfig}
 */
 const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

 const nextConfig = {
    /* config options here */
    compress: false,
    reactStrictMode: true,
    async headers() {
      return [
        {
          // Apply these headers to all routes in your application.
          source: "/(.*)",
          headers: securityHeaders,
        },
      ];
    },
  }  
  
  module.exports = nextConfig