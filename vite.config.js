
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  appType: "mpa",

  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        welcome: resolve(import.meta.dirname, "pages/welcome.html"),
        preferences: resolve(import.meta.dirname, "pages/preferences.html"),
        dashboard: resolve(import.meta.dirname, "pages/dashboard.html"),
        planner: resolve(import.meta.dirname, "pages/planner.html"),
        route: resolve(import.meta.dirname, "pages/route.html"),
        report: resolve(import.meta.dirname, "pages/report.html"),
        confirmation: resolve(import.meta.dirname, "pages/confirmation.html"),
        map: resolve(import.meta.dirname, "pages/map.html"),
        settings: resolve(import.meta.dirname, "pages/settings.html"),
        heatmap: resolve(import.meta.dirname, "pages/heatmap.html"),
        analytics: resolve(import.meta.dirname, "pages/analytics.html")
      }
    }
  }
});
