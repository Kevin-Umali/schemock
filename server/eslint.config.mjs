import baseConfig from '@hono/eslint-config'

export default {
  ...baseConfig,
  extends: [
    ...baseConfig.extends, // Use the extensions from the base config
    'plugin:prettier/recommended', // Integrate Prettier with ESLint
  ],
  plugins: [
    ...(baseConfig.plugins || []), // Use plugins from the base config
    'prettier', // Add Prettier as an ESLint plugin
  ],
  rules: {
    // Disable conflicting ESLint rules here, if needed
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // Match this with your preferred style
      },
    ],
  },
}
