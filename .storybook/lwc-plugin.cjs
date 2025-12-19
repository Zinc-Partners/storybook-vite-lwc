const path = require('path');
const fs = require('fs');
const { createFilter } = require('vite');
const lwcRollup = require('@lwc/rollup-plugin');

// ============================================
// 1. PATCH PLUGIN - Wrap vite:css transforms to skip LWC files
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/patch.ts
// ============================================
function patchPlugin() {
    return {
        name: 'lwc:patch',
        enforce: 'pre',
        configResolved(config) {
            // Wrap vite:css and vite:css-post to skip LWC files
            const cssPlugins = ['vite:css', 'vite:css-post'];
            
            for (const pluginName of cssPlugins) {
                const plugin = config.plugins.find((p) => p && p.name === pluginName);
                if (plugin && plugin.transform) {
                    const originalTransform = plugin.transform;
                    plugin.transform = function(code, id, options) {
                        // Skip LWC CSS files - let LWC plugin handle them
                        if (id && id.includes('/force-app/main/default/lwc/')) {
                            return null;
                        }
                        // Let vite:css handle everything else
                        return originalTransform.call(this, code, id, options);
                    };
                }
            }
        },
    };
}

// ============================================
// 2. ALIAS PLUGIN - Add ?import to HTML imports
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/alias.ts
// ============================================
function aliasPlugin() {
    return {
        name: 'lwc:alias',
        enforce: 'pre',
        config() {
            return {
                resolve: {
                    alias: [
                        {
                            // Match HTML imports except index.html and iframe.html
                            find: /^(?!.*index)(?!.*iframe)(.*)\.html$/,
                            replacement: '$1.html?import',
                        },
                    ],
                },
            };
        },
    };
}

// ============================================
// 3. LWC PLUGIN - Main compilation plugin
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/lwc.ts
// ============================================
function createRollupPlugin(options) {
    const plugin = lwcRollup(options);
    
    // Extract handlers - they may be wrapped in objects with 'handler' property
    const buildStart = plugin.buildStart 
        ? (typeof plugin.buildStart === 'object' && 'handler' in plugin.buildStart) 
            ? plugin.buildStart.handler 
            : plugin.buildStart 
        : () => {};
    const resolveId = plugin.resolveId 
        ? (typeof plugin.resolveId === 'object' && 'handler' in plugin.resolveId) 
            ? plugin.resolveId.handler 
            : plugin.resolveId 
        : () => {};
    const load = plugin.load 
        ? (typeof plugin.load === 'object' && 'handler' in plugin.load) 
            ? plugin.load.handler 
            : plugin.load 
        : () => {};
    const transform = plugin.transform 
        ? (typeof plugin.transform === 'object' && 'handler' in plugin.transform) 
            ? plugin.transform.handler 
            : plugin.transform 
        : () => {};

    return { buildStart, resolveId, load, transform };
}

function lwcPlugin(config = {}) {
    const LWC_DIR = path.resolve(__dirname, '../force-app/main/default/lwc');
    
    const lwcOptions = {
        modules: [{ dir: LWC_DIR, namespace: 'c' }],
        ...config
    };
    
    const lwc = createRollupPlugin(lwcOptions);
    
    // Filter to exclude Vite/Storybook internals and non-LWC files
    const filter = createFilter(
        undefined,
        [
            '**/vite/**',
            '**/@vitest/**', 
            '**/.vite/**',
            '**/node_modules/**',
            'index.html',
            '/__vitest_test__/**',
            '**/*.mdx',  // Exclude MDX files - let Storybook addon-docs handle them
        ]
    );

    return {
        name: 'lwc:vite-plugin',
        
        config() {
            return {
                define: {
                    'process.env.SKIP_LWC_VERSION_MISMATCH_CHECK': 'false',
                },
            };
        },

        async buildStart(options) {
            try {
                await lwc.buildStart.call(this, options);
            } catch (e) {
                console.error('[lwc] buildStart error:', e.message);
            }
        },

        async resolveId(source, importer, options) {
            // Manually resolve c/ namespace imports
            if (source.startsWith('c/')) {
                const componentName = source.slice(2);
                const componentPath = path.join(LWC_DIR, componentName, `${componentName}.js`);
                if (fs.existsSync(componentPath)) {
                    return componentPath;
                }
                return null;
            }
            
            // Handle scoped CSS that doesn't exist - return virtual empty module
            if (source.includes('.scoped.css')) {
                // Check if the actual file exists
                if (importer && importer.includes('/force-app/')) {
                    const dir = path.dirname(importer.split('?')[0]);
                    const cssPath = path.resolve(dir, source.split('?')[0]);
                    if (!fs.existsSync(cssPath)) {
                        return '\0empty-scoped-css';
                    }
                }
            }

            if (!filter(source)) {
                return null;
            }

            // Handle HTML importer case (from vite-plugin-lwc)
            if (
                importer &&
                path.extname(importer) === '.html' &&
                path.isAbsolute(importer) &&
                path.extname(source) !== '' &&
                path.isAbsolute(source)
            ) {
                const dir = path.dirname(importer);
                return path.join(dir, source);
            }

            try {
                const id = await lwc.resolveId.call(this, source, importer, options);
                // Intercept empty_css.css from LWC
                if (id && id.includes('empty_css.css')) {
                    return '\0empty-scoped-css';
                }
                return id || null;
            } catch (e) {
                // Silently fail - let other plugins try
                return null;
            }
        },

        load(id, options) {
            // Handle empty scoped CSS virtual module
            if (id === '\0empty-scoped-css') {
                return 'export default [];';
            }
            
            if (!filter(id)) {
                return null;
            }

            try {
                return lwc.load.call(this, id);
            } catch (e) {
                return null;
            }
        },

        transform(code, id, options) {
            if (!filter(id)) {
                return null;
            }

            try {
                return lwc.transform.call(this, code, id);
            } catch (e) {
                return null;
            }
        },
    };
}

// ============================================
// EXPORT ALL PLUGINS
// ============================================
function createLwcPlugins(options = {}) {
    return [
        // 1. Patch vite:css plugins to skip LWC files
        patchPlugin(),
        // 2. Add ?import to HTML imports
        aliasPlugin(),
        // 3. Main LWC plugin
        lwcPlugin(options),
    ];
}

module.exports = { 
    createLwcPlugins,
    patchPlugin,
    aliasPlugin,
    lwcPlugin,
};
