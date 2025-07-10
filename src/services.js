// Read GET Method
async function getFilms() {
    const response = await fetch("http://localhost:3000/movies", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const filmData = await response.json();
    console.log(filmData);
    return filmData;
}
getFilms()

// Print films
let filmContainer = document.getElementById("film-section");

async function printFilms() {
    let listFilms = await getFilms();
    filmContainer.innerHTML = ""; // Limpiar contenido anterior

    listFilms.forEach(film => {
        filmContainer.innerHTML += `
            <div class="film-card">
                <h1>${film.film}</h1> 
                <p><strong>Director:</strong> ${film.director}</p>
                <p><strong>Género:</strong> ${film.genre}</p>
                <p><strong>Año:</strong> ${film.year}</p>
                <p><strong>Duración:</strong> ${film.duration}</p>
                <p><strong>Calificación:</strong> ${film.rating}</p>
                <p><strong>Idioma:</strong> ${film.language}</p>
                <p><strong>Descripción:</strong> ${film.film_description}</p>
                <button onclick="deleteFilm('${film.id}')">Eliminar</button>
            </div>
        `;
    });
}

// Delete DELETE Method
async function deleteFilm(id) {
    const response = await fetch(`http://localhost:3000/movies/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        console.log(`Película con ID ${id} eliminada`);
        printFilms(); // Recarga la lista después de borrar
    } else {
        console.error("Error al eliminar la película");
    }
}

// Create POST Method
async function createFilm(newFilm) { //El async puede manejar cosas que toman tiempo, como pedir datos a un servidor
    try { //Intenta ejecutar el bloque de codigo. Si algo falla el error se atrapará en el catch.
        const response = await fetch("http://localhost:3000/movies", { // Fetch sirve para enviar datos a la URL del servidor (localhost). await espera la respuesta
            method: "POST", // POST se usa para enviar un nuevo dato (crear algo)
            headers: {
                'Content-Type': 'application/json'
            }, // le decimos al servidor que los datos que mandamos estan en formato JSON 
            body: JSON.stringify(newFilm) // convertimos le objeto newFilm a texto JSON antes de enviarlo
        });

        if (response.ok) { //si el servidor a respondido con exito (código 200), entonces:
            const createdFilm = await response.json();// convertimos la respuesta del servidor a un objeto JS
            console.log("Pelicula creada:", createdFilm);
            printFilms(); // Actualiza la lista, mosttramos la pelicula en la consola y llamamos a printFilm() para actualizar la lista en la pantalla
        } else {
            console.error("Error al crear la pelicula");
        } 
    } catch (error) {
        console.error("Error en la solicitud POST:", error);
    }
}//si algo sale mal(por ejemplo, no hay conexión), mostramos el error

const filmForm = document.getElementById("film-form");

filmForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(filmForm);
    const newFilm = Object.fromEntries(formData.entries());

    const editingId = filmForm.dataset.editing;

    if (editingId) {
        updatefilm(editingId, newFilm);
        delete filmForm.dataset.editing;
    } else {
        createFilm(newFilm);
    }

    filmForm.reset(); 
});


