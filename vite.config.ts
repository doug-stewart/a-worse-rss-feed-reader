import * as path from 'node:path';

import TanStackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: '/a-worse-rss-feed-reader/',
    plugins: [
        react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
        svgr(),
        TanStackRouter(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
