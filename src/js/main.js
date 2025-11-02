import "../css/style.css";
import { createClient } from "@supabase/supabase-js";
import { filtrarSearch } from "../utils/filtros";
import { ofertas } from "./supabase/ofertas";
import { headerImg } from "../utils/header";
import { nav } from "../view/nav";
import { cargarCategorias } from "./supabase/categorias";
import { cargarProductos } from "./supabase/productos";
import { cargarProducto } from "./supabase/producto";

// Conexiones Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supa = createClient(supabaseUrl, supabaseKey);

// Ocultar Anuncio en la parte inferior del header
function anuncio() {
  const anuncio = document.querySelector("#anuncioHeader");
  const btnAnuncio = document.querySelector("#btnAnuncioDelete");

  btnAnuncio.addEventListener("click", () => {
    anuncio.classList.add("hidden");
  });
}

// Insertar Navegacion
document.querySelector("nav").innerHTML = nav;

// Funcion Filtrar Productos Nombre
filtrarSearch(supa);

// Cargar los archivos
document.addEventListener("DOMContentLoaded", async () => {
  const currentPage = window.location.pathname;

  try {
    if (currentPage.includes("index.html") || currentPage === "/") {
      await ofertas(supa);
      anuncio()
      headerImg();
    }

    if (
      currentPage.includes("index.html") ||
      currentPage.includes("categorias.html") ||
      currentPage === "/"
    ) {
      await cargarCategorias(supa);
      await cargarProductos(supa);
    }

    if (
      currentPage.includes("todos_productos.html") ||
      currentPage.includes("search_producto.html")
    ) {
      await cargarProductos(supa);
    }

    if (currentPage.includes("productos.html")) {
      await cargarProducto(supa);
    }
  } catch (error) {
    console.log("Error al cargar la pagina: ", error);
  }
});
