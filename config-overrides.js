module.exports = function override(config, env) {
    // Add TypeScript extensions to webpack resolution
    config.resolve = {
        ...config.resolve,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    };
    return config;
} 