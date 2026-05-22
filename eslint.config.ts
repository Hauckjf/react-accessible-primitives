import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";

// eslint-plugin-react ships CJS without flat-config type declarations;
// cast to the Plugin shape ESLint 9 expects.
const react = reactPlugin as unknown as import("eslint").Plugin;

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "storybook-static/**",
      // Config files are not part of the TS project — exclude from typed rules.
      "eslint.config.ts",
      "vitest.config.ts",
      "tsup.config.ts",
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    plugins: { react },
    languageOptions: {
      parserOptions: {
        // projectService=true ativa o "Project Service" do typescript-eslint, que
        // resolve cada arquivo via tsconfig.json automaticamente. tests/ JÁ está
        // no `include` do tsconfig.json, então não precisamos de allowDefaultProject.
        // Bug histórico: `allowDefaultProject: ["tests/**/*.ts"]` quebrou CI em
        // typescript-eslint v8.x porque a regra agora proíbe `**` (motivo: o
        // default-project scan é caro e o glob amplo derruba performance).
        projectService: true,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "react/react-in-jsx-scope": "off",
    },
  },
);
