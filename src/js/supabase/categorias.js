export async function cargarCategorias(supabase) {
  let { data, error } = await supabase.from("categorias").select("*");

  const texto = document.querySelector(".text");
  const categorias = document.querySelector(".categorias");

  if (error) {
    console.error("Fallo: " + error);
    return;
  }

  categorias.innerHTML = "";

  if (data.length === 0) {
    containerCategorias.textContent = "No hay Categorias Registradas";
    return;
  }

  texto.innerHTML = `<p class="text-2xl font-bold mb-2">Elige tu categoría</p>
            <div class="flex justify-center">
              <p class="text-xs xl:text-sm opacity-75 md:w-2/3 xl:w-1/2">Las mejores seccion de categorias con productos totalmente calificados para nuestros clientes, prueba nuestros productos ahora mismo y disfruta de nuestro reembolso.</p>
            </div>`;

  data.forEach((element) => {
    const divCategorias = document.createElement("a");
    divCategorias.className = "flex flex-col items-center flex-shrink-0";
    divCategorias.href = `/public/pages/categorias.html?categoriaId=${element.id}&categoriaName=${encodeURIComponent(element.nombre)}&categoriaDescripcion=${encodeURIComponent(element.descripcion)}`;
    divCategorias.innerHTML = `
              <img class="rounded-full w-16 h-16 md:w-18 md:h-18 lg:w-24 lg:h-24 xl:w-30 xl:h-30 object-cover transform transition" src="${element.imagen}" alt="">
              <p class="font-medium mt-2 text-xs xl:text-base">${element.nombre}</p>
          `;

    categorias.appendChild(divCategorias);
  });
}
