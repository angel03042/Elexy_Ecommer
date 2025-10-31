export async function cargarProductos(supabase) {
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaId = urlParams.get("categoriaId");
  const categoriaName = urlParams.get("categoriaName");
  const categoriaDescripcion = urlParams.get("categoriaDescripcion");

  const search = urlParams.get("search");
  const textoSearch = document.querySelector(".texto_search");

  const mediaQuery = window.matchMedia("(max-width: 1024px)");

  let query = supabase
    .from("productos")
    .select("*, categorias(nombre), productos_imagenes(*)");

  if (
    window.location.pathname === "/" ||
    window.location.pathname.includes("index.html")
  ) {
    query = query.limit(8);
    if (mediaQuery.matches) {
      query = query.limit(6);
    }
  }

  if (categoriaId) {
    query = query.eq("categoria_id", categoriaId);
  }

  if (search) {
    query = query.ilike("nombre", `%${search}%`);
    textoSearch.innerHTML = `<p class="text-lg md:text-2xl font-bold mb-4">"${search}"</p>`;
  }

  let { data, error } = await query;

  const contenedorProducto = document.querySelector(".productoContenedor");
  const text = document.querySelector(".textoCategoria");

  if (error) {
    console.log("Ocurrio un: ", error);
    return;
  }

  if (data.length === 0) {
    contenedorProducto.textContent = "No hay productos registrados";
    return;
  }

  if (categoriaName || categoriaDescripcion) {
    text.innerHTML = `<div class="">
              <p class="text-lg md:text-2xl font-bold mb-4">${
                categoriaName || ""
              }</p>
              <p class="text-xs xl:text-sm opacity-75 xl:w-2/3">${
                categoriaDescripcion || ""
              }</p>
            </div>`;
  }

  data.forEach((element) => {
    const producto = document.createElement("a");
    producto.href = `/pages/productos.html?productoId=${element.id}`;
    producto.className =
      "overflow-hidden h-[300px] xl:h-[380px] cursor-pointer";

    producto.innerHTML = `<div class="w-full h-2/3 flex justify-center items-center">
                <img class="h-full w-full object-cover" src="${element.productos_imagenes[0]?.imagen_url}" alt="${element.nombre}">
              </div>
              <div class="flex flex-col justify-between h-1/3 p-2 bg-gray-100">
                <div>
                  <p class="opacity-75 text-xs/tight md:text-sm font-medium">${element.categorias?.nombre}</p>
                  <p class="text-sm/tight xl:text-lg font-bold opacity-90">${element?.nombre}</p>
                </div>
                <p class="text-base md:text-xl font-medium opacity-95">$ ${element.precio}</p>
              </div>`;

    contenedorProducto.appendChild(producto);
  });
}
