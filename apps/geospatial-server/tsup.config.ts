import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  external: ["database"],
  splitting: false,
  sourcemap: true,
  clean: true,
});
