export function headerImg() {
  // Carrusel de imagenes ofertas header
  const carousel = document.getElementById("carousel");
  const slides = carousel.children;
  const total = slides.length;
  let index = 0;

  document.getElementById("btnNext").addEventListener("click", nextSlide);
  document.getElementById("btnPrev").addEventListener("click", prevSlide);

  function updateSlide() {
    const offset = -index * 100;
    carousel.style.transform = `translateX(${offset}%)`;
  }

  function nextSlide() {
    index = (index + 1) % total;
    updateSlide();
  }

  function prevSlide() {
    index = (index - 1 + total) % total;
    updateSlide();
  }

  // Opcional: carrusel automático cada 5s
  setInterval(nextSlide, 5000);
}
