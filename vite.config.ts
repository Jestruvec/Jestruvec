import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/Jestruvec/",
  plugins: [tailwindcss()],
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
