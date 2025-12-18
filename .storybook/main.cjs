const { createLwcPlugins } = require('./lwc-plugin.cjs');

module.exports = {
    stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-essentials',
        '@chromatic-com/storybook',
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    viteFinal: async (config) => {
        // Get LWC plugins (patch, alias, lwc)
        const lwcPlugins = createLwcPlugins();
        
        // Insert LWC plugins at the beginning, keep all existing plugins
        // The patch plugin will modify vite:css plugins in configResolved
        config.plugins = [
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
