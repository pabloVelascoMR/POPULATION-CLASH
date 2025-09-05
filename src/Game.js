import { City } from './City.js';

document.addEventListener("DOMContentLoaded", async () => {

    // Variables principales del juego
    let cities = [];
    let ciudad1;
    let ciudad2;
    let score = 0;
    let gameOn = true;

    // API de imágenes
    const PEXELS_API_KEY = "KxzKQzjVJb8KDst9b36AoLOisQRJucPSZt5yWsvvdg5CyyM3gsdPrtZh";
    const PEXELS_ENDPOINT = 'https://api.pexels.com/v1/search';

    // Elementos del DOM
    const city1El = document.getElementById("city1");
    const city2El = document.getElementById("city2");
    const city1TextEl = document.getElementById("city1-text");
    const city2TextEl = document.getElementById("city2-text");
    const resultEl = document.getElementById("result");
    const mayorBtn = document.getElementById("mayorBtn");
    const menorBtn = document.getElementById("menorBtn");

    // Crear elemento para mostrar score
    const scoreEl = document.createElement("p");
    scoreEl.id = "score";
    scoreEl.textContent = `Score: ${score}`;
    city1El.parentElement.insertBefore(scoreEl, city1El.parentElement.firstChild);

    // Cargar ciudades desde JSON
    const data = await fetch('ciudades.json').then(res => res.json());
    cities = data.map(c => new City(c.city, c.population, c.country));

    // Seleccionar la primera ciudad al azar
    ciudad1 = cities[Math.floor(Math.random() * cities.length)];

    // Función para obtener imagen de la ciudad
    async function fetchCityImage(cityName) {
        try {
            const res = await fetch(`${PEXELS_ENDPOINT}?query=${encodeURIComponent(cityName)}&per_page=1`, {
                headers: { Authorization: PEXELS_API_KEY }
            });
            const data = await res.json();
            return (data.photos && data.photos.length > 0) 
                ? data.photos[0].src.landscape 
                : 'fallback.jpg';
        } catch {
            return 'fallback.jpg';
        }
    }

    // Función para mostrar las ciudades en pantalla
    async function mostrarCiudades() {
        // Elegir ciudad2 distinta de ciudad1
        ciudad2 = cities[Math.floor(Math.random() * cities.length)];
        while (ciudad2.getNombre() === ciudad1.getNombre()) {
            ciudad2 = cities[Math.floor(Math.random() * cities.length)];
        }

        // Actualizar texto
        city1TextEl.innerHTML = `${ciudad1.getNombre()}, ${ciudad1.getCountry()}<br>
            <span class="population">${ciudad1.getDimension().toLocaleString()} hab.</span>`;
        city2TextEl.innerHTML = `${ciudad2.getNombre()}, ${ciudad2.getCountry()}<br>
            <span class="population">???</span>`;

        // Actualizar imágenes
        city1El.style.backgroundImage = `url(${await fetchCityImage(ciudad1.getNombre())})`;
        city2El.style.backgroundImage = `url(${await fetchCityImage(ciudad2.getNombre())})`;

        resultEl.textContent = "";
    }

    // Mostrar la primera ronda
    await mostrarCiudades();

    // Función para manejar la respuesta del jugador
    async function manejarRespuesta(respuestaJugador) {
        if (!gameOn) return;

        const esMayor = ciudad2.getDimension() > ciudad1.getDimension();

        if (respuestaJugador === esMayor) {
            // Acertó
            score++;
            scoreEl.textContent = `Score: ${score}`;
            ciudad1 = City.copy(ciudad2);
            await mostrarCiudades();
        } else {
            // Falló
            gameOn = false;
            localStorage.setItem("lastScore", score);
            window.location.href = "gameover.html";
        }
    }

    // Eventos de los botones
    mayorBtn.addEventListener("click", () => manejarRespuesta(true));
    menorBtn.addEventListener("click", () => manejarRespuesta(false));

});
