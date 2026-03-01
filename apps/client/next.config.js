/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "i.imgur.com", pathname: "/**" },
			{ protocol: "https", hostname: "media.forgecdn.net", pathname: "/**" },
			{ protocol: "https", hostname: "preview.redd.it", pathname: "/**" },
		],
	},
};

export default nextConfig;
