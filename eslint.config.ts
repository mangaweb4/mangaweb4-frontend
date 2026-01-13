import { defineConfig, globalIgnores } from 'eslint/config';

import globals from 'globals';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default defineConfig(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		name: 'typescript',
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname // Helps resolve the absolute path
			}
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		name: 'svelte',
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		rules: {
			'svelte/no-navigation-without-resolve': 'off', //TODO: remove this rule after figuring out the effects.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'], // Add support for additional file extensions, such as .svelte
				parser: ts.parser,
				// Specify a parser for each language, if needed:
				// parser: {
				//   ts: ts.parser,
				//   js: espree,    // Use espree for .js files (add: import espree from 'espree')
				//   typescript: ts.parser
				// },

				// We recommend importing and specifying svelte.config.js.
				// By doing so, some rules in eslint-plugin-svelte will automatically read the configuration and adjust their behavior accordingly.
				// While certain Svelte settings may be statically loaded from svelte.config.js even if you don’t specify it,
				// explicitly specifying it ensures better compatibility and functionality.
				//
				// If non-serializable properties are included, running ESLint with the --cache flag will fail.
				// In that case, please remove the non-serializable properties. (e.g. `svelteConfig: { ...svelteConfig, kit: { ...svelteConfig.kit, typescript: undefined }}`)
				svelteConfig
			}
		}
	},
	globalIgnores([
		'**/.DS_Store',
		'**/node_modules',
		'build',
		'.svelte-kit',
		'package',
		'**/.env',
		'**/.env.*',
		'!**/.env.example',
		'**/pnpm-lock.yaml',
		'**/package-lock.json',
		'**/yarn.lock',
		'src/lib/grpc/**'
	])
);
