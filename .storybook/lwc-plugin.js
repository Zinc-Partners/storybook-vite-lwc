import path from "path";
import fs from "fs";
import { createFilter } from "vite";
import lwcRollup from "@lwc/rollup-plugin";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// 1. PATCH PLUGIN - Wrap vite:css transforms to skip LWC files
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/patch.ts
// ============================================
function patchPlugin() {
  return {
    name: "lwc:patch",
    enforce: "pre",
    configResolved(config) {
      // Wrap vite:css and vite:css-post to skip LWC files
      const cssPlugins = ["vite:css", "vite:css-post"];

      for (const pluginName of cssPlugins) {
        const plugin = config.plugins.find((p) => p && p.name === pluginName);
        if (plugin && plugin.transform) {
          const originalTransform = plugin.transform;
          plugin.transform = function (code, id, options) {
            // Skip LWC CSS files - let LWC plugin handle them
            if (id && id.includes("/force-app/main/default/lwc/")) {
              return null;
            }
            // Let vite:css handle everything else
            return originalTransform.call(this, code, id, options);
          };
        }
      }
    }
  };
}

// ============================================
// 2. ALIAS PLUGIN - Add ?import to HTML imports
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/alias.ts
// ============================================
function aliasPlugin() {
  return {
    name: "lwc:alias",
    enforce: "pre",
    config() {
      return {
        resolve: {
          alias: [
            {
              // Match HTML imports except index.html and iframe.html
              find: /^(?!.*index)(?!.*iframe)(.*)\.html$/,
              replacement: "$1.html?import"
            }
          ]
        }
      };
    }
  };
}

// ============================================
// 3. LWC PLUGIN - Main compilation plugin
// Based on: https://github.com/cardoso/vite-plugin-lwc/blob/main/packages/vite-plugin-lwc/src/lwc.ts
// ============================================
function createRollupPlugin(options) {
  const plugin = lwcRollup(options);

  // Extract handlers - they may be wrapped in objects with 'handler' property
  const extractHandler = (hook) => {
    if (!hook) return null;
    if (typeof hook === "function") return hook;
    if (
      typeof hook === "object" &&
      "handler" in hook &&
      typeof hook.handler === "function"
    ) {
      return hook.handler;
    }
    return null;
  };

  return {
    buildStart: extractHandler(plugin.buildStart),
    resolveId: extractHandler(plugin.resolveId),
    load: extractHandler(plugin.load),
    transform: extractHandler(plugin.transform)
  };
}

function lwcPlugin(config = {}) {
  const LWC_DIR = path.resolve(__dirname, "../force-app/main/default/lwc");

  const lwcOptions = {
    modules: [{ dir: LWC_DIR, namespace: "c" }],
    // Specify rootDir to prevent LWC plugin from trying to auto-detect it from Rollup's input
    // This avoids the buildStart error when Vite doesn't provide the input config
    rootDir: path.resolve(__dirname, ".."),
    ...config
  };

  const lwc = createRollupPlugin(lwcOptions);

  // Filter to exclude Vite/Storybook internals and non-LWC files
  const filter = createFilter(undefined, [
    "**/vite/**",
    "**/@vitest/**",
    "**/.vite/**",
    "**/node_modules/**",
    "index.html",
    "/__vitest_test__/**",
    "**/*.mdx" // Exclude MDX files - let Storybook addon-docs handle them
  ]);

  return {
    name: "lwc:vite-plugin",

    config() {
      return {
        define: {
          "process.env.SKIP_LWC_VERSION_MISMATCH_CHECK": "false"
        }
      };
    },

    async buildStart(options) {
      if (!lwc.buildStart) return;

      try {
        // Vite may pass undefined options to buildStart
        // LWC plugin expects an options object, provide empty object as fallback
        const buildOptions = options || {};
        await lwc.buildStart.call(this, buildOptions);
      } catch (e) {
        console.error("[lwc] buildStart error:", e);
      }
    },

    async resolveId(source, importer, options) {
      // Manually resolve c/ namespace imports
      if (source.startsWith("c/")) {
        const componentName = source.slice(2);
        const componentPath = path.join(
          LWC_DIR,
          componentName,
          `${componentName}.js`
        );
        if (fs.existsSync(componentPath)) {
          return componentPath;
        }
        return null;
      }

      // Handle scoped CSS that doesn't exist - return virtual empty module
      if (source.includes(".scoped.css")) {
        // Check if the actual file exists
        if (importer && importer.includes("/force-app/")) {
          const dir = path.dirname(importer.split("?")[0]);
          const cssPath = path.resolve(dir, source.split("?")[0]);
          if (!fs.existsSync(cssPath)) {
            return "\0empty-scoped-css";
          }
        }
      }

      if (!filter(source)) {
        return null;
      }

      // Handle HTML importer case (from vite-plugin-lwc)
      if (
        importer &&
        path.extname(importer) === ".html" &&
        path.isAbsolute(importer) &&
        path.extname(source) !== "" &&
        path.isAbsolute(source)
      ) {
        const dir = path.dirname(importer);
        return path.join(dir, source);
      }

      if (!lwc.resolveId) return null;

      try {
        const id = await lwc.resolveId.call(this, source, importer, options);
        // Intercept empty_css.css from LWC
        if (id && id.includes("empty_css.css")) {
          return "\0empty-scoped-css";
        }
        return id || null;
      } catch (e) {
        // Silently fail - let other plugins try
        return null;
      }
    },

    load(id, options) {
      // Handle empty scoped CSS virtual module
      if (id === "\0empty-scoped-css") {
        return "export default [];";
      }

      if (!filter(id)) {
        return null;
      }

      if (!lwc.load) return null;

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

      if (!lwc.transform) return null;

      try {
        return lwc.transform.call(this, code, id);
      } catch (e) {
        return null;
      }
    }
  };
}

// ============================================
// EXPORT ALL PLUGINS
// ============================================
export function createLwcPlugins(options = {}) {
  return [
    // 1. Patch vite:css plugins to skip LWC files
    patchPlugin(),
    // 2. Add ?import to HTML imports
    aliasPlugin(),
    // 3. Main LWC plugin
    lwcPlugin(options)
  ];
}

export { patchPlugin, aliasPlugin, lwcPlugin };
