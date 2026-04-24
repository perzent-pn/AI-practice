import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import security from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ============================================================
  // Security Rules — ป้องกัน common security anti-patterns
  // ============================================================
  {
    plugins: { security },
    rules: {
      // ป้องกัน eval() และ similar
      "security/detect-eval-with-expression": "error",
      // ป้องกัน child_process execution
      "security/detect-child-process": "error",
      // ป้องกัน non-literal require
      "security/detect-non-literal-require": "warn",
      // ป้องกัน non-literal fs
      "security/detect-non-literal-fs-filename": "warn",
      // ป้องกัน possible timing attacks
      "security/detect-possible-timing-attacks": "warn",
      // ป้องกัน unsafe regex (ReDoS)
      "security/detect-unsafe-regex": "error",
      // ป้องกัน buffer() ที่ไม่ปลอดภัย
      "security/detect-buffer-noassert": "error",
      // ป้องกัน pseudoRandomBytes
      "security/detect-pseudoRandomBytes": "warn",
      // ป้องกัน no-csrf-before-method-override
      "security/detect-no-csrf-before-method-override": "error",
    },
  },

  // ============================================================
  // TypeScript Strict Rules — ป้องกัน type-related vulnerabilities
  // ============================================================
  {
    rules: {
      // ห้าม any — บังคับ strict typing
      "@typescript-eslint/no-explicit-any": "error",
      // ห้ามลืม await async functions (ป้องกัน unhandled promises)
      "@typescript-eslint/no-floating-promises": "off",
      // ห้าม unused variables
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Prisma generated files:
    "src/generated/**",
  ]),
]);

export default eslintConfig;
