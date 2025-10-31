export function filtrarSearch(supa) {
  // --- Elementos ---
  const search = document.querySelector("#search");
  const btnBuscar = document.querySelector("#btnBuscar");
  const container = document.querySelector("#containerSearch");
  const wrapper = container.parentElement; // el div con class="relative invisible"

  // --- Util: debounce ---
  function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // --- Control de peticiones (token para evitar race conditions) ---
  let latestToken = 0;

  async function doSearch(value, token) {
    // Limpiar y ocultar por defecto
    container.innerHTML = "";
    wrapper.classList.add("invisible");

    if (!value) return;

    // Llamada a Supabase (traer id para dedupe / link)
    const { data, error } = await supa
      .from("productos")
      .select("id, nombre")
      .ilike("nombre", `%${value}%`)
      .limit(10);

    // Si ya hubo otra petición más nueva, ignorar esta respuesta
    if (token !== latestToken) return;

    if (error) {
      console.error(error);
      container.innerHTML = "<p class='text-red-500 p-2'>Error al buscar</p>";
      wrapper.classList.remove("invisible");
      return;
    }

    if (!data || data.length === 0) {
      container.innerHTML = "<p class='text-gray-400 p-2'>Sin resultados</p>";
      wrapper.classList.remove("invisible");
      return;
    }

    // --- Dedupe: por id (en caso de que la BD devuelva duplicados) ---
    const seen = new Set();
    const deduped = [];
    for (const row of data) {
      if (!row.id) continue; // seguridad
      if (!seen.has(row.id)) {
        seen.add(row.id);
        deduped.push(row);
      }
    }

    // Renderizar resultados
    deduped.forEach((element) => {
      // Por seguridad, evitar volver a añadir si ya existe (doble check)
      if (container.querySelector(`[data-id="${element.id}"]`)) return;

      const div = document.createElement("div");
      div.setAttribute("data-id", element.id);
      div.className =
        "flex items-center gap-2 p-2 duration-150 hover:bg-blue-300 cursor-pointer hover:text-white group";
      div.innerHTML = `
      <svg class="fill-current text-gray-400 group-hover:text-white" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
        <path d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"/>
      </svg>
      <p>${element.nombre}</p>
    `;

      div.addEventListener("click", () => {
        window.location.href = `/pages/search_producto.html?search=${element.nombre}`;
      });

      container.appendChild(div);
    });

    // Mostrar el contenedor ya que hay resultados (o mensaje)
    wrapper.classList.remove("invisible");
  }

  // --- Handler debounced ---
  const handler = debounce(async () => {
    const value = search.value.trim();
    // incrementar token y guardar el token actual localmente
    const token = ++latestToken;
    await doSearch(value, token);
  }, 250);

  // --- Eventos ---
  search.addEventListener("input", handler);

  search.addEventListener("keydown", (e) => {
    if (search.value.trim() === "") return;
    if (e.key === "Enter") {
      window.location.href = `/src/pages/search_producto.html?search=${encodeURIComponent(
        search.value
      )}`;
    }
  });

  btnBuscar.addEventListener("click", () => {
    if (search.value.trim() === "") return;
    window.location.href = `/src/pages/search_producto.html?search=${encodeURIComponent(
      search.value
    )}`;
  });

  // Ocultar cuando se da clic fuera (opcional)
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target) && e.target !== search) {
      wrapper.classList.add("invisible");
    }
  });
}
