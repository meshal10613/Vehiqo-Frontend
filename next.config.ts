import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["react-pdf"],
    turbopack: {
        resolveAlias: {
            canvas: { browser: "" },
            encoding: { browser: "" },
        },
    },
    webpack: (config) => {
        // Fix for react-pdf canvas rendering
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        return config;
    },
    images: {
        formats: ["image/avif", "image/webp"], // by default avif, and if not avif then webp
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "img.daisyui.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "i.ibb.co.com",
            },
        ],
    },
};

export default nextConfig;
