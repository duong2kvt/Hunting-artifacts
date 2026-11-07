const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/**'] },
  {
    files: ['src/features/onboarding/{avatar-picker,name-popup,onboarding-flow}.tsx'],
    // Reanimated shared values are mutable animation handles, not React state.
    rules: { 'react-hooks/immutability': 'off' },
  },
]);
