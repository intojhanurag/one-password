
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: [
      "**/out/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/extenison-lock/out/**"
    ]
  }
];
