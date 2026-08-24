/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    agentRules: false,
    watchOptions: {
        pollIntervalMs: 1000,
    },
};

if (process.env.NEXT_DEV_WEBPACK === '1') {
    nextConfig.webpack = (config, { dev }) => {
        if (dev) {
            config.watchOptions = {
                poll: 1000,
                aggregateTimeout: 300,
            };
        }
        return config;
    };
}

export default nextConfig;
