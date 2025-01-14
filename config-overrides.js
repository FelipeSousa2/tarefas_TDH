// config-overrides.js
module.exports = {
  webpack: (config, env) => {
    config.resolve.fallback = {
      process: require.resolve("process/browser"),
      ...config.resolve.fallback,
    };
    return config;
  },
};
