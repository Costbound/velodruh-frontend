import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  envPrefix: "VELODRUH_",
  plugins: [reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 3001,
  },
});
