module.exports = {
  root: true,
  env: {
    node: true,        // Node globals: require, exports, console
    es2021: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    "no-undef": "off",              // avoids require/exports errors
    "no-empty": ["error", { "allowEmptyCatch": true }],
    semi: ["warn", "always"]
  },
  ignorePatterns: ["out/**", "node_modules/**"]        // ignore compiled JS
};
