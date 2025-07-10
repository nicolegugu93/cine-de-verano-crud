// Create POST Method (pendiente de implementar)
function createFilm(newFilm) {
    // Aquí va la lógica para enviar POST a /movies
}

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

// Update PUT Method (pendiente de implementar)
function updateFilm(id, editedFilm) {
    // Aquí va la lógica para PUT a /movies/id
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

// Ejecutar al cargar
printFilms();
