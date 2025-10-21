import { defineConfig } from "vite";

export default defineConfig({
  test: {
    deps: {
      interopDefault: true,
    },

    globals: true,
    environment: "happy-dom",
  },
});
