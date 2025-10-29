export async function cargarProducto(supabase) {
  const urlParams = new URLSearchParams(window.location.search);
  const productoId = urlParams.get("productoId");

  let { data, error } = await supabase
    .from("productos")
    .select("*, productos_imagenes(*), categorias(nombre)")
    .eq("id", productoId)
    .single();

  if (error) {
    console.error("Ocurrio un: " + error);
    return;
  }

  // --- STOCK ---
  const agotado = document.querySelector("#agotado");
  if (data.stock === 0) {
    agotado.classList.remove("hidden");
    agotado.classList.add("block");
  } else {
    agotado.classList.remove("block");
    agotado.classList.add("hidden");
  }

  // --- ATRIBUTOS ---
  const atributosProducto = document.querySelector("#atributosProducto");
  Object.entries(data.atributos).forEach(([nombre, contenido]) => {
    const div = document.createElement("div");
    div.className = "mt-2";

    const nombreAtributo = document.createElement("p");
    nombreAtributo.className = "text-sm font-bold opacity-85";
    nombreAtributo.textContent = nombre;

    const containerAtributos = document.createElement("div");
    containerAtributos.className = "mt-2 flex items-center gap-2";

    const valores = Array.isArray(contenido) ? contenido : [contenido];
    const valoresValidos = valores.filter((v) => v !== null && v !== undefined && v !== "");
    if (valoresValidos.length === 0) return;

    valoresValidos.forEach((valor) => {
      const label = document.createElement("label");
      label.className = "flex items-center gap-2 cursor-pointer border border-gray-500 rounded-full px-4 py-2 hover:bg-gray-100";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = nombre;
      input.value = valor;
      input.className = "hidden peer";

      const texto = document.createElement("span");
      texto.className = "text-xs font-bold";
      texto.textContent = valor;

      label.addEventListener("click", () => {
        containerAtributos
          .querySelectorAll("label")
          .forEach((el) => el.classList.remove("bg-black", "text-white"));
        label.classList.add("bg-black", "text-white");
      });

      label.appendChild(input);
      label.appendChild(texto);
      containerAtributos.appendChild(label);
    });

    div.appendChild(nombreAtributo);
    div.appendChild(containerAtributos);
    atributosProducto.appendChild(div);
  });

  // --- IMÁGENES MINIATURA CON BOTONES ---
  const containerImg = document.querySelector("#containerImg");
  const btn1 = document.querySelector("#btn1");
  const btn2 = document.querySelector("#btn2");
  const imagenPrincipal = document.querySelector("#imagenProducto");

  const imagenes = data.productos_imagenes;
  const maxVisible = 5;
  let startIndex = 0;

  function renderImages() {
    containerImg.innerHTML = "";
    const visibles = imagenes.slice(startIndex, startIndex + maxVisible);
    visibles.forEach((e) => {
      const imgUrl = document.createElement("img");
      imgUrl.className = "w-12 xl:w-full h-full xl:h-14 object-cover cursor-pointer border border-transparent hover:border-gray-400";
      imgUrl.src = e.imagen_url;
      containerImg.appendChild(imgUrl);

      imgUrl.addEventListener("click", () => {
        imagenPrincipal.src = e.imagen_url;
      });
    });

    // Mostrar/ocultar botones según cantidad
    if (imagenes.length <= maxVisible) {
      btn1.classList.add("hidden");
      btn2.classList.add("hidden");
    } else {
      btn1.classList.toggle("hidden", startIndex === 0);
      btn2.classList.toggle(
        "hidden",
        startIndex + maxVisible >= imagenes.length
      );
    }
  }

  btn1.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex--;
      renderImages();
    }
  });

  btn2.addEventListener("click", () => {
    if (startIndex + maxVisible < imagenes.length) {
      startIndex++;
      renderImages();
    }
  });

  renderImages();

  // --- INFORMACIÓN DEL PRODUCTO ---
  imagenPrincipal.src = data.productos_imagenes[0].imagen_url;
  document.querySelector("#categoriaNombre").textContent = data.categorias.nombre;
  document.querySelector("#nombreProducto").textContent = data.nombre;
  document.querySelector("#precioProducto").textContent = "$" + data.precio;
  document.querySelector("#stockProducto").textContent = data.stock + " Productos";
  document.querySelector("#descripcionProducto").textContent = data.descripcion;

  // --- CANTIDAD ---
  let contador = 1;
  document.querySelector("#cantidad").textContent = contador;

  document.querySelector("#btnMenos").addEventListener("click", () => {
    if (contador === 1) return;
    contador--;
    const precio = data.precio * contador;
    document.querySelector("#cantidad").textContent = contador;
    document.querySelector("#precioProducto").textContent = "$" + precio.toFixed(2);
  });

  document.querySelector("#btnMas").addEventListener("click", () => {
    if (contador === data.stock) return;
    contador++;
    const precio = data.precio * contador;
    document.querySelector("#cantidad").textContent = contador;
    document.querySelector("#precioProducto").textContent = "$" + precio.toFixed(2);
  });

  // --- ZOOM SIGUE AL MOUSE ---
  const imagen = document.querySelector("#imagenProducto");
  imagen.parentElement.classList.add("overflow-hidden", "relative");

  imagen.addEventListener("mouseenter", () => {
    imagen.style.transformOrigin = "center center";
    imagen.style.transition = "transform 0.2s ease-out";
    imagen.style.transform = "scale(2)";
  });

  imagen.addEventListener("mousemove", (e) => {
    const rect = imagen.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imagen.style.transformOrigin = `${x}% ${y}%`;
  });

  imagen.addEventListener("mouseleave", () => {
    imagen.style.transform = "scale(1)";
    imagen.style.transformOrigin = "center center";
  });
}
