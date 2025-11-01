import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        productos: resolve(__dirname, "src/pages/productos.html"),
        categorias: resolve(__dirname, "src/pages/categorias.html"),
        todos: resolve(__dirname, "src/pages/todos_productos.html"),
        search: resolve(__dirname, "src/pages/search_producto.html"),
      },
    },
  },
});
