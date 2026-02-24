import * as path from 'node:path';

import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    base: '/a-worse-rss-feed-reader/',
    plugins: [
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react({ babel: { plugins: [['babel-plugin-react-compiler']] } }),
        svgr({ svgrOptions: { titleProp: true } }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
