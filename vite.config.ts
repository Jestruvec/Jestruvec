import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/Jestruvec/",
  assetsInclude: ["**/*.glb", "**/*.gltf"],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
