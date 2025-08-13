import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		useCache: true,
		globalNotFound: true,
	},
};

export default nextConfig;
