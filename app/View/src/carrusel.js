window.addEventListener('DOMContentLoaded', function() {
    const carruseles = document.querySelectorAll('.carrusel');
  
    carruseles.forEach(function(carrusel) {
      const slider = carrusel.querySelector('.slider');
      const imagenes = slider.querySelectorAll('img');
      let indice = 0;
  
      function mostrarImagen(indice) {
        imagenes.forEach(function(imagen, index) {
          if (index === indice) {
            imagen.style.display = 'block';
          } else {
            imagen.style.display = 'none';
          }
        });
      }
  
      function cambiarImagen(direccion) {
        indice += direccion;
        if (indice < 0) {
          indice = imagenes.length - 1;
        } else if (indice === imagenes.length) {
          indice = 0;
        }
        mostrarImagen(indice);
      }
  
      mostrarImagen(indice);
  
      carrusel.addEventListener('click', function(event) {
        if (event.target.classList.contains('anterior')) {
          cambiarImagen(-1); // Retrocede una imagen
        } else if (event.target.classList.contains('siguiente')) {
          cambiarImagen(1); // Avanza una imagen
        }
      });
    });
  });
  