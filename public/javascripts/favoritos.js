function obtenerDatosLibro() {
    // Obtén el ID del libro o cualquier otro identificador necesario
    const urlParams = new URLSearchParams(window.location.search);
    const idArchivo = urlParams.get('id'); 
    // Realiza una llamada a la API para obtener los datos del libro
    fetch('/obtenerLibro/' + idArchivo)
        .then(response => response.json())
        .then(data => {
            // Extrae los datos necesarios del libro
            var nombreAutor = data.nombreAutor;
            var fecha = data.fecha;
            var titulo = data.titulo;
            var pdf_url = data.pdf_url;
            var img_libro = data.img_libro;
            // Llama a la función agregarFav() con los datos del libro
            agregarFav(nombreAutor, fecha, titulo, pdf_url, img_libro, idArchivo);
        })
        .catch(error => {
            console.error('Error al obtener los datos del libro:', error);
        });
}

function agregarFav(nombreAutor, fecha, titulo, pdf_url, img_libro, idArchivo) {
    var corazon = document.getElementById("corazon");

    if (corazon.getAttribute("src") === "images/corazon-azul.png") {
        corazon.setAttribute("src", "images/corazon-rojo.png");
        fetch('/favoritos/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombreAutor: nombreAutor,
                fecha: fecha,
                titulo: titulo,
                pdf_url: pdf_url,
                img_libro: img_libro, 
                idArchivo: idArchivo
            })
        })
        .then(response => response.json())
        .then(data => {
            // Manejar la respuesta del servidor si es necesario
            console.log(data);
        })
        .catch(error => {
            // Manejar errores de la solicitud
            console.error(error);
        });
    } else {
        corazon.setAttribute("src", "images/corazon-azul.png");
        //fetch para eliminar de favoritos
    }
}