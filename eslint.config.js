// @ts-check

import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import { tanstackConfig } from '@tanstack/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath),

    // 1. Base JS/TS configs
    js.configs.recommended,
    ...tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,

    // 2. Framework/Lib configs
    tanstackConfig,

    // Disable type-aware linting for config files (must come after tanstackConfig)
    {
        files: ['*.config.{js,ts}', '*.config.*.{js,ts}'],
        ...tseslint.configs.disableTypeChecked,
    },

    // 3. React specifically
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        ignores: ['*.config.{js,ts}', '*.config.*.{js,ts}'],
        plugins: {
            'jsx-a11y': jsxA11y,
            'react-compiler': reactCompiler,
            'react-refresh': reactRefresh,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            globals: globals.browser,
            sourceType: 'module',
            parserOptions: {
                project: null,
                projectService: true,
                tsconfigRootDir: fileURLToPath(new URL('.', import.meta.url)),
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                    ],
                    pathGroups: [
                        {
                            pattern: 'eslint/config',
                            group: 'external',
                            position: 'before',
                        },
                    ],
                    'newlines-between': 'always',
                    alphabetize: { order: 'asc', caseInsensitive: true },
                },
            ],
            // Many of these 'off' rules might be necessary because import-plugin
            // struggles with Flat Config + TS without explicit resolvers.
            // 'import/default': 'off',
            // 'import/no-named-as-default-member': 'off',
            // 'import/no-named-as-default': 'off',
            // 'import/no-unresolved': 'off',

            'jsx-a11y/anchor-is-valid': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',

            'react-compiler/react-compiler': 'error',
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },

    // 5. Prettier (Must be last to override formatting rules)
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
]);
