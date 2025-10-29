export async function ofertas(supa) {
  let { data, error } = await supa.from("ofertas").select("*");

  if (error) {
    console.error("Ocurrio un error en: " + error)
    return
  }

  const carrusel = document.querySelector("#carousel");

  if (data.lenght === 0) {
    carrusel.innerHTML = 'No hay ofertas Disponibles'
    return
  }

  data.forEach(element => {
    const img = document.createElement("img");
    img.className = 'w-full h-full object-cover flex-shrink-0';
    img.src = element.imgOferta;

    carrusel.appendChild(img)
  });
}
