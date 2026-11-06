import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import express from "express";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { apiRouter } from "./server/routes.js";

function vitePluginSolarGridApi(): Plugin {
  return {
    name: "solargrid-api-plugin",
    configureServer(server: ViteDevServer) {
      const apiApp = express();
      apiApp.use(express.json());
      apiApp.use(express.urlencoded({ extended: true }));
      apiApp.use("/api", apiRouter);
      server.middlewares.use(apiApp);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    jsxLocPlugin(),
    vitePluginSolarGridApi(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@server": path.resolve(import.meta.dirname, "server"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
