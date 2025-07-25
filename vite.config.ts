import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import checker from "vite-plugin-checker";

const buildDate = `${new Date().getTime()}`;
// https://vite.dev/config/
export default defineConfig((_) => {
  return {
    plugins: [
      vue(),
      vueJsx(),
      checker({
        typescript: true,
      }),
    ],
    define: {
      __APP_CREATETIME__: buildDate,
    },
    resolve: {
      alias: {
        "@src": new URL("./src", import.meta.url).href,
        "@node_modules": new URL("./node_modules", import.meta.url).href,
      },
    },

    build: {
      minify: "esbuild",
      lib: {
        entry: ["./src/lib/install.ts"],
        name: "simplestFlow",
        formats: ["es", "cjs", "iife"],
      },

      rollupOptions: {
        external: ["vue", "element-plus"],
        output: {
          globals: {
            vue: "Vue",
            "element-plus": "element-plus",
          },
        },
      },
    },
  };
});
