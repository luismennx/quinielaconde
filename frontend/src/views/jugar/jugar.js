const API_URL = "https://quinielaconde.onrender.com/api";

const sportsContainer = document.getElementById("sportsContainer");

document.addEventListener("DOMContentLoaded", cargarDeportes);

async function cargarDeportes() {
  try {
    sportsContainer.innerHTML = `
      <p class="loading">Cargando deportes y ligas...</p>
    `;

    const response = await fetch(`${API_URL}/deportes`);

    if (!response.ok) {
      throw new Error("No se pudieron cargar los deportes");
    }

    const deportes = await response.json();

    renderDeportes(deportes);

  } catch (error) {
    console.error("Error cargando deportes:", error);

    sportsContainer.innerHTML = `
      <div class="error-box">
        <h3>Error de conexión</h3>
        <p>No pudimos cargar las ligas disponibles.</p>

        <button onclick="cargarDeportes()">
          Reintentar
        </button>
      </div>
    `;
  }
}

function formatearFechaCierre(fechaISO) {
  if (!fechaISO) return "Próximamente";

  const fecha = new Date(fechaISO);

  return fecha.toLocaleString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

function obtenerLogoLiga(liga) {
  if (!liga.logo) {
    return "../../assets/img/default-league.png";
  }

  if (liga.logo.startsWith("http")) {
    return liga.logo;
  }

  return `https://quinielaconde.onrender.com${liga.logo}`;
}

function renderDeportes(deportes) {
  sportsContainer.innerHTML = "";

  deportes.forEach((deporte) => {

    const sportBlock = document.createElement("article");

    sportBlock.classList.add("sport-block");

    sportBlock.innerHTML = `
      <div class="sport-title">
        <h2>${deporte.nombre}</h2>
        <span>${deporte.icono || "🏆"}</span>
      </div>

      <div class="leagues-list">

        ${deporte.ligas.map((liga) => `

          <button 
            class="league-card" 
            data-liga-id="${liga.id}"
            data-liga-nombre="${liga.nombre}"
          >

            <div class="league-logo">
              <img 
                src="${obtenerLogoLiga(liga)}" 
                alt="${liga.nombre}"
              >
            </div>

            <div class="league-info">
              <h3>${liga.nombre}</h3>

              <p>
                Cierre:
                <strong>
                  ${formatearFechaCierre(liga.fecha_cierre)}
                </strong>
              </p>
            </div>

            <div class="arrow">›</div>

          </button>

        `).join("")}

      </div>
    `;

    sportsContainer.appendChild(sportBlock);
  });

  activarClicksLigas();
}

function activarClicksLigas() {

  const leagueCards = document.querySelectorAll(".league-card");

  leagueCards.forEach((card) => {

    card.addEventListener("click", () => {

      const ligaId = card.dataset.ligaId;
      const ligaNombre = card.dataset.ligaNombre;

      console.log("Liga seleccionada:", ligaNombre);

      // MUNDIAL 2026
      if (
        ligaNombre.toLowerCase().includes("mundial")
      ) {

        window.location.href =
          `../mundial/mundial.html?liga=${ligaId}`;

        return;
      }

      // DEMÁS LIGAS
      window.location.href =
        `../jornadas/jornadas.html?liga=${ligaId}`;
    });
  });
}