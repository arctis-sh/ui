import { readdirSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

function entriesFromDir(dir: string, ext: string) {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((name) => name.endsWith(ext))
      .map((name) => {
        const base = name.slice(0, -ext.length);
        return [base, path.join(dir, name)];
      }),
  );
}

export default defineConfig({
  entry: {
    ...entriesFromDir("src/components/ui", ".tsx"),
    ...entriesFromDir("src/lib", ".ts"),
  },
  format: ["esm"],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    /^@base-ui\//,
    "@tanstack/react-table",
    "embla-carousel-react",
    "embla-carousel-autoplay",
    "input-otp",
    "react-resizable-panels",
    "tailwind-merge",
  ],
  esbuildOptions(options) {
    options.alias = {
      "@/components/ui": path.resolve("src/components/ui"),
      "@/lib": path.resolve("src/lib"),
    };
    options.jsx = "automatic";
  },
});
