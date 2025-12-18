// vite.config.js
import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Note: LWC plugin is configured in .storybook/main.cjs for Storybook
// For standalone Vite builds, add vite-plugin-lwc here

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    }
});
