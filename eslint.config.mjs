import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // React Hook Form's watch/subscribe APIs are intentionally used here.
      "react-hooks/incompatible-library": "off",
    },
  },
  {
    files: ["src/app/legal/**/*.tsx"],
    rules: {
      // Legal copy is maintained as editorial prose, where literal quotations
      // are clearer and have no runtime impact.
      "react/no-unescaped-entities": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
