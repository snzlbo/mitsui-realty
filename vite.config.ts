import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  build: {
    lib: {
      entry: "./src/main.ts",
      name: "MultiChatEmbed",
      fileName: "widget",
      formats: ["es"],
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});
