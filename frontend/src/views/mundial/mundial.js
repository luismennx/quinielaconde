const API_URL = "https://quinielaconde.onrender.com/api";

const urlParams = new URLSearchParams(window.location.search);

const ligaId = urlParams.get("liga");

const partidosContainer =
  document.getElementById("partidosContainer");

const jornadaTitulo =
  document.getElementById("jornadaTitulo");

const jornadaFecha =
  document.getElementById("jornadaFecha");

const prevJornadaBtn =
  document.getElementById("prevJornada");

const nextJornadaBtn =
  document.getElementById("nextJornada");

const registrarJuegoBtn =
  document.getElementById("registrarJuegoBtn");

const tabPartidos =
  document.getElementById("tabPartidos");

const tabPosiciones =
  document.getElementById("tabPosiciones");

const jornadaPanel =
  document.querySelector(".jornada-panel");

const posicionesSection =
  document.getElementById("posicionesSection");

const posicionesContainer =
  document.getElementById("posicionesContainer");

let jornadas = [];

let jornadaActualIndex = 0;

let selecciones = {};

document.addEventListener(
  "DOMContentLoaded",
  iniciarPantalla
);

async function iniciarPantalla() {

  if (!ligaId) {
    alert("Liga inválida");
    return;
  }

  await cargarJornadas();
}

async function cargarJornadas() {

  try {

    partidosContainer.innerHTML = `
      <p class="loading">
        Cargando jornadas...
      </p>
    `;

    const response = await fetch(
      `${API_URL}/mundial/${ligaId}/jornadas`
    );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar las jornadas"
      );
    }

    jornadas = await response.json();

    if (!jornadas.length) {

      partidosContainer.innerHTML = `
        <p class="loading">
          No hay jornadas disponibles.
        </p>
      `;

      return;
    }

    jornadaActualIndex = 0;

    actualizarHeaderJornada();

    await cargarPartidos();

  } catch (error) {

    console.error(
      "Error cargando jornadas:",
      error
    );

    partidosContainer.innerHTML = `
      <p class="loading">
        Error cargando jornadas.
      </p>
    `;
  }
}

function actualizarHeaderJornada() {

  const jornada =
    jornadas[jornadaActualIndex];

  jornadaTitulo.textContent =
    jornada.nombre;

  jornadaFecha.textContent =
    formatearRangoFechas(
      jornada.fecha_inicio,
      jornada.fecha_fin
    );
}

async function cargarPartidos() {

  try {

    partidosContainer.innerHTML = `
      <p class="loading">
        Cargando partidos...
      </p>
    `;

    const jornada =
      jornadas[jornadaActualIndex];

    const response = await fetch(
      `${API_URL}/mundial/jornadas/${jornada.id}/partidos`
    );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar partidos"
      );
    }

    const partidos =
      await response.json();

    renderPartidos(partidos);

  } catch (error) {

    console.error(
      "Error cargando partidos:",
      error
    );

    partidosContainer.innerHTML = `
      <p class="loading">
        Error cargando partidos.
      </p>
    `;
  }
}

function renderPartidos(partidos) {

  partidosContainer.innerHTML = "";

  partidos.forEach((partido) => {

    const card =
      document.createElement("article");

    card.classList.add("match-card");

    card.innerHTML = `
      <div class="match-header">

        <span class="group-label">
          ${partido.grupo || "Mundial"}
        </span>

        <span class="match-time">
          ${formatearFechaPartido(
            partido.fecha_partido
          )}
        </span>

      </div>

      <div class="teams-row">

        <button
          class="team-option"
          data-match-id="${partido.id}"
          data-value="local"
        >

          <img
            src="${obtenerBandera(
              partido.local_bandera
            )}"
            alt="${partido.local_nombre}"
          >

          <h4>
            ${partido.local_nombre}
          </h4>

        </button>

        <button
          class="draw-option"
          data-match-id="${partido.id}"
          data-value="empate"
        >
          X
        </button>

        <button
          class="team-option"
          data-match-id="${partido.id}"
          data-value="visitante"
        >

          <img
            src="${obtenerBandera(
              partido.visitante_bandera
            )}"
            alt="${partido.visitante_nombre}"
          >

          <h4>
            ${partido.visitante_nombre}
          </h4>

        </button>

      </div>
    `;

    partidosContainer.appendChild(card);
  });

  activarSelecciones();
}

function activarSelecciones() {

  const options =
    document.querySelectorAll(
      ".team-option, .draw-option"
    );

  options.forEach((option) => {

    option.addEventListener("click", () => {

      const matchId =
        option.dataset.matchId;

      const value =
        option.dataset.value;

      const sameMatchOptions =
        document.querySelectorAll(
          `[data-match-id="${matchId}"]`
        );

      sameMatchOptions.forEach((el) => {
        el.classList.remove("active");
      });

      option.classList.add("active");

      selecciones[matchId] = value;

      console.log(
        "Selecciones:",
        selecciones
      );
    });
  });
}

function formatearFechaPartido(fechaISO) {

  const fecha =
    new Date(fechaISO);

  return fecha.toLocaleString(
    "es-MX",
    {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }
  );
}

function formatearRangoFechas(
  inicio,
  fin
) {

  const fechaInicio =
    new Date(inicio);

  const fechaFin =
    new Date(fin);

  return `
    ${fechaInicio.toLocaleDateString("es-MX")}
    -
    ${fechaFin.toLocaleDateString("es-MX")}
  `;
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

prevJornadaBtn.addEventListener(
  "click",
  async () => {

    if (jornadaActualIndex <= 0) {
      return;
    }

    jornadaActualIndex--;

    actualizarHeaderJornada();

    await cargarPartidos();
  }
);

nextJornadaBtn.addEventListener(
  "click",
  async () => {

    if (
      jornadaActualIndex >=
      jornadas.length - 1
    ) {
      return;
    }

    jornadaActualIndex++;

    actualizarHeaderJornada();

    await cargarPartidos();
  }
);

registrarJuegoBtn.addEventListener("click", () => {
  const jornada = jornadas[jornadaActualIndex];

  const totalPartidos = document.querySelectorAll(".match-card").length;
  const totalSelecciones = Object.keys(selecciones).length;

  if (totalSelecciones < totalPartidos) {
    alert("Debes seleccionar un pronóstico para cada partido.");
    return;
  }

  localStorage.setItem(
    "quiniela_selecciones",
    JSON.stringify(selecciones)
  );

  localStorage.setItem(
    "quiniela_jornada_actual",
    JSON.stringify(jornada)
  );

  localStorage.setItem(
    "quiniela_liga_id",
    ligaId
  );

  window.location.href = `../ticket/ticket.html?jornada=${jornada.id}&liga=${ligaId}`;
});

tabPartidos.addEventListener(
  "click",
  () => {

    tabPartidos.classList.add("active");
    tabPosiciones.classList.remove("active");

    jornadaPanel.classList.remove("hidden");

    posicionesSection.classList.add("hidden");
  }
);

tabPosiciones.addEventListener(
  "click",
  async () => {

    tabPosiciones.classList.add("active");

    tabPartidos.classList.remove("active");

    jornadaPanel.classList.add("hidden");

    posicionesSection.classList.remove("hidden");

    await cargarPosiciones();
  }
);

async function cargarPosiciones() {

  try {

    posicionesContainer.innerHTML = `
      <p class="loading">
        Cargando posiciones...
      </p>
    `;

    const response = await fetch(
      `${API_URL}/mundial/${ligaId}/posiciones`
    );

    if (!response.ok) {
      throw new Error(
        "No se pudieron cargar posiciones"
      );
    }

    const posiciones =
      await response.json();

    renderPosiciones(posiciones);

  } catch (error) {

    console.error(
      "Error cargando posiciones:",
      error
    );

    posicionesContainer.innerHTML = `
      <p class="loading">
        Error cargando posiciones.
      </p>
    `;
  }
}

function renderPosiciones(posiciones) {

  posicionesContainer.innerHTML = "";

  const grupos = {};

  posiciones.forEach((equipo) => {

    if (!grupos[equipo.grupo]) {
      grupos[equipo.grupo] = [];
    }

    grupos[equipo.grupo].push(equipo);
  });

  Object.keys(grupos).forEach((grupo) => {

    const equipos = grupos[grupo];

    const table =
      document.createElement("article");

    table.classList.add("group-table");

    table.innerHTML = `
      <div class="group-header">
        ${grupo}
      </div>

      <div class="table-scroll">

        <table class="positions-table">

          <thead>
            <tr>
              <th>Equipo</th>
              <th>PJ</th>
              <th>G</th>
              <th>E</th>
              <th>P</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>PTS</th>
            </tr>
          </thead>

          <tbody>

            ${equipos.map((equipo) => `
              <tr>

                <td>

                  <div class="team-cell">

                    <img
                      src="${obtenerBandera(
                        equipo.equipo_bandera
                      )}"
                      alt="${equipo.equipo_nombre}"
                    >

                    <span class="team-name">
                      ${equipo.equipo_nombre}
                    </span>

                  </div>

                </td>

                <td>${equipo.pj}</td>
                <td>${equipo.g}</td>
                <td>${equipo.e}</td>
                <td>${equipo.p}</td>
                <td>${equipo.gf}</td>
                <td>${equipo.gc}</td>
                <td>${equipo.dg}</td>

                <td class="points">
                  ${equipo.pts}
                </td>

              </tr>
            `).join("")}

          </tbody>

        </table>

      </div>
    `;

    posicionesContainer.appendChild(table);
  });
}