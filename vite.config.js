import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
    tests: {
        globals: true,
        environment: "happy-dom"
    },
    plugins: [vue()]
});