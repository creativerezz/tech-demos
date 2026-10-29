import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { voidReact } from "@void/react/plugin";
import { defineConfig } from "vite";
import { voidPlugin } from "void";

export default defineConfig({
  base: process.env.VITE_BASE ?? "/",
  plugins: [voidPlugin(), voidReact(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
});
