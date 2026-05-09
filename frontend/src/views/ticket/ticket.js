const API_URL = "https://quinielaconde.onrender.com/api";

const urlParams = new URLSearchParams(window.location.search);
const jornadaId = urlParams.get("jornada");

const resumenContainer = document.getElementById("resumenContainer");
const jornadaNombre = document.getElementById("jornadaNombre");
const confirmarJuegoBtn = document.getElementById("confirmarJuegoBtn");
const editarJuegoBtn = document.getElementById("editarJuegoBtn");

const selecciones = JSON.parse(
  localStorage.getItem("quiniela_selecciones") || "{}"
);

document.addEventListener("DOMContentLoaded", cargarResumenTicket);

async function cargarResumenTicket() {
  if (!jornadaId) {
    resumenContainer.innerHTML = `<p class="loading">Jornada inválida.</p>`;
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/mundial/jornadas/${jornadaId}/partidos`
    );

    if (!response.ok) {
      throw new Error("No se pudieron cargar los partidos del ticket");
    }

    const partidos = await response.json();

    jornadaNombre.textContent = `Jornada ${jornadaId}`;

    renderResumen(partidos);

  } catch (error) {
    console.error("Error cargando ticket:", error);

    resumenContainer.innerHTML = `
      <p class="loading">Error cargando el resumen del ticket.</p>
    `;
  }
}

function renderResumen(partidos) {
  const partidosSeleccionados = partidos.filter((partido) => {
    return selecciones[partido.id];
  });

  if (!partidosSeleccionados.length) {
    resumenContainer.innerHTML = `
      <p class="loading">
        No hay pronósticos seleccionados.
      </p>
    `;
    return;
  }

  resumenContainer.innerHTML = partidosSeleccionados.map((partido) => {
    const seleccion = selecciones[partido.id];

    return `
      <article class="prediccion-card">

        <div class="prediccion-top">
          <span>${partido.grupo || "Mundial"}</span>
          <span>${formatearFechaPartido(partido.fecha_partido)}</span>
        </div>

        <div class="prediccion-match">

          <div class="team-box">
            <img src="${obtenerBandera(partido.local_bandera)}" alt="${partido.local_nombre}">
            <h4>${partido.local_nombre}</h4>
          </div>

          <div class="vs">VS</div>

          <div class="team-box">
            <img src="${obtenerBandera(partido.visitante_bandera)}" alt="${partido.visitante_nombre}">
            <h4>${partido.visitante_nombre}</h4>
          </div>

        </div>

        <div class="prediccion-result">
          <span>Tu pronóstico</span>
          <strong>${obtenerTextoSeleccion(seleccion, partido)}</strong>
        </div>

      </article>
    `;
  }).join("");
}

function obtenerTextoSeleccion(seleccion, partido) {
  if (seleccion === "local") return `Gana ${partido.local_nombre}`;
  if (seleccion === "visitante") return `Gana ${partido.visitante_nombre}`;
  if (seleccion === "empate") return "Empate";
  return "Sin selección";
}

function obtenerBandera(path) {
  if (!path) {
    return "../../assets/img/default-team.png";
  }

  if (path.startsWith("http")) {
    return path;
  }

  return `https://quinielaconde.onrender.com${path}`;
}

function formatearFechaPartido(fechaISO) {
  const fecha = new Date(fechaISO);

  return fecha.toLocaleString("es-MX", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}

confirmarJuegoBtn.addEventListener("click", () => {
  alert("Aquí después guardaremos el ticket real en backend.");
});

editarJuegoBtn.addEventListener("click", () => {
  window.history.back();
});