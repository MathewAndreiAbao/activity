module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    // Ionic components use `slot="start"` etc. as a native web-component
    // slot (light DOM projection), not Vue's own template slot syntax.
    'vue/no-deprecated-slot-attribute': 'off',
  },
};
