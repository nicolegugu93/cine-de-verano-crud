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
    const listFilms = await getFilms();
    const filmContainer = document.getElementById("film-section");
    filmContainer.innerHTML = "";

    listFilms.forEach(film => {
        let images = Array.isArray(film.images)
            ? film.images
            : (film.images || "").split(',').map(img => img.trim());

        const frontImage = images[0]
            ? `<img src="/public/${images[0]}" alt="${film.film}" />`
            : `<div style="color:white">Sin imagen</div>`;

        const filmCardHTML = `
            <div class="film-card">
                <div class="film-inner">
                    <div class="film-front">
                        ${frontImage}
                    </div>
                    <div class="film-back">
                        <h1>${film.film}</h1> 
                        <p><strong>Director:</strong> ${film.director}</p>
                        <p><strong>Género:</strong> ${film.genre}</p>
                        <p><strong>Año:</strong> ${film.year}</p>
                        <p><strong>Duración:</strong> ${film.duration}</p>
                        <p><strong>Calificación:</strong> ${film.rating}</p>
                        <p><strong>Idioma:</strong> ${film.language}</p>
                        <p><strong>Descripción:</strong> ${film.film_description}</p>
                        <button onclick="deleteFilm('${film.id}')">Eliminar</button>
                        <button onclick="loadFilmToForm('${film.id}')">Editar</button>
                    </div>
                </div>
            </div>
        `;

        filmContainer.innerHTML += filmCardHTML;
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

    // --- PASO 3: convertir el campo 'images' de string a array ---
    if (newFilm.images) {
        newFilm.images = newFilm.images.split(',').map(img => img.trim());
    }
    // ---------------------------------------------------------------

    const editingId = filmForm.dataset.editing;

    if (editingId) {
        updateFilm(editingId, newFilm);
        delete filmForm.dataset.editing;
    } else {
        createFilm(newFilm);
    }

    filmForm.reset(); 
});



// Update PUT Method
async function updateFilm(id, editedFilm) {
    try {
        const response = await fetch(`http://localhost:3000/movies/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedFilm)
        });

        if (response.ok) {
            const updatedFilm = await response.json();
            console.log("Pelicula actualizada:", updatedFilm);
            printFilms(); // Refresca la lista
        } else {
            console.error("Error al actualizar la pelicula");
        }
    } catch (error) {
        console.error("Error en la solicitud PUT:", error);
    }
}


async function loadFilmToForm(id) {
    const response = await fetch(`http://localhost:3000/movies/${id}`);
    if (response.ok) {
        const film = await response.json();

        // Rellenar el formulario
        document.querySelector('[name="film"]').value = film.film;
        document.querySelector('[name="director"]').value = film.director;
        document.querySelector('[name="genre"]').value = film.genre;
        document.querySelector('[name="year"]').value = film.year;
        document.querySelector('[name="duration"]').value = film.duration;
        document.querySelector('[name="rating"]').value = film.rating;
        document.querySelector('[name="language"]').value = film.language;
        document.querySelector('[name="film_description"]').value = film.film_description;

        document.querySelector('[name="images"]').value = film.images?.join(', ') || '';

        // Guardar el ID en el formulario para saber que estamos editando
        filmForm.dataset.editing = id;
    } else {
        console.error("No se pudo cargar la pelicula para editar");
    }
}

