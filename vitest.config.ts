import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    deps: {
      interopDefault: true,
    },

    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
  },
  plugins: [tsconfigPaths()],
});
