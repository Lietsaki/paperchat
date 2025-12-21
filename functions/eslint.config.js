import globals from 'globals'
import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import tsParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import _import from 'eslint-plugin-import'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  globalIgnores([
    'lib/**/*',
    'eslint.config.js',
    '.eslintrc.js'
  ]),
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
      'google',
      'plugin:@typescript-eslint/recommended'
    )
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node
      },
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.dev.json'],
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import)
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      indent: ['error', 2],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'import/no-unresolved': 0,
      'max-len': 0,
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off'
    }
  }
])
