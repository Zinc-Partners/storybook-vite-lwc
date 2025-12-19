const { createLwcPlugins } = require('./lwc-plugin.cjs');
const path = require('path');

// Plugin to fix file:// URLs with encoded spaces in MDX imports
function mdxFileUrlFixPlugin() {
    return {
        name: 'mdx-file-url-fix',
        enforce: 'pre',
        resolveId(source) {
            // Match file:// URLs (typically from MDX compilation)
            if (source.startsWith('file://')) {
                // Decode URL-encoded path and convert to regular file path
                try {
                    const url = new URL(source);
                    const filePath = decodeURIComponent(url.pathname);
                    return filePath;
                } catch (e) {
                    return null;
                }
            }
            return null;
        },
    };
}

module.exports = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    viteFinal: async (config) => {
        // Get LWC plugins (patch, alias, lwc)
        const lwcPlugins = createLwcPlugins();
        
        // Plugin to fix file:// URLs with spaces (from MDX compilation)
        const fileUrlFix = mdxFileUrlFixPlugin();
        
        // Insert plugins at the beginning, keep all existing plugins
        config.plugins = [
            fileUrlFix,  // Fix MDX file:// URLs first
            ...lwcPlugins,
            ...config.plugins,
        ];

        // Suppress chunk size warning (Storybook's DocsRenderer is large by design)
        config.build = {
            ...config.build,
            chunkSizeWarningLimit: 1500,
        };

        return config;
    },
};
