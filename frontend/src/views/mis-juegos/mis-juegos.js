import API_URL from "../../js/api.js";
import { mostrarAlerta } from "../../components/ui/alert.js";

const listaTickets = document.querySelector("#listaTickets");
const estadoCarga = document.querySelector("#estadoCarga");
const sinTickets = document.querySelector("#sinTickets");

const saldoUsuario = document.querySelector("#saldoUsuario");

const botonesFiltroEstado = document.querySelectorAll(".filter-btn");
const filtroDeporte = document.querySelector("#filtroDeporte");
const filtroLiga = document.querySelector("#filtroLiga");
const filtroFecha = document.querySelector("#filtroFecha");
const buscarFolio = document.querySelector("#buscarFolio");
const btnIrJugar = document.querySelector("#btnIrJugar");

let ticketsGlobal = [];
let estadoActual = "todos";

document.addEventListener("DOMContentLoaded", () => {
  validarSesion();
  cargarUsuarioLocal();
  cargarMisJuegos();
  configurarEventos();
});

function validarSesion() {
  const token = localStorage.getItem("token");

  if (!token) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Sesión requerida",
      mensaje: "Inicia sesión para ver tus juegos.",
      duracion: 2500
    });

    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1500);
  }
}

function cargarUsuarioLocal() {
  const usuarioGuardado = localStorage.getItem("usuario");

  if (!usuarioGuardado) return;

  try {
    const usuario = JSON.parse(usuarioGuardado);

    if (usuario?.saldo !== undefined && saldoUsuario) {
      saldoUsuario.textContent = Number(usuario.saldo).toFixed(2);
    }
  } catch (error) {
    console.error("Error leyendo usuario local:", error);
  }
}

function configurarEventos() {
  botonesFiltroEstado.forEach((boton) => {
    boton.addEventListener("click", () => {
      botonesFiltroEstado.forEach((btn) => btn.classList.remove("active"));
      boton.classList.add("active");

      estadoActual = boton.dataset.estado;
      aplicarFiltros();
    });
  });

  filtroDeporte.addEventListener("change", aplicarFiltros);
  filtroLiga.addEventListener("change", aplicarFiltros);
  filtroFecha.addEventListener("change", aplicarFiltros);
  buscarFolio.addEventListener("input", aplicarFiltros);

  btnIrJugar.addEventListener("click", () => {
    window.location.href = "../jugar/jugar.html";
  });
}

async function cargarMisJuegos() {
  const token = localStorage.getItem("token");

  estadoCarga.classList.remove("hidden");
  sinTickets.classList.add("hidden");
  listaTickets.innerHTML = "";

  try {
    const respuesta = await fetch(`${API_URL}/mis-juegos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(data?.mensaje || data?.message || "Error al cargar tus juegos");
    }

    ticketsGlobal = data.tickets || [];

    estadoCarga.classList.add("hidden");

    aplicarFiltros();
  } catch (error) {
    console.error("Error cargando mis juegos:", error);

    estadoCarga.classList.add("hidden");

    mostrarAlerta({
      tipo: "error",
      titulo: "No pudimos cargar tus juegos",
      mensaje: error.message || "Intenta nuevamente.",
      duracion: 3500
    });
  }
}

function aplicarFiltros() {
  let ticketsFiltrados = [...ticketsGlobal];

  if (estadoActual !== "todos") {
    ticketsFiltrados = ticketsFiltrados.filter(
      (ticket) => ticket.estado === estadoActual
    );
  }

  const deporte = filtroDeporte.value;
  const liga = filtroLiga.value;
  const fecha = filtroFecha.value;
  const folio = buscarFolio.value.trim().toLowerCase();

  if (deporte) {
    ticketsFiltrados = ticketsFiltrados.filter(
      (ticket) => ticket.deporte === deporte
    );
  }

  if (liga) {
    ticketsFiltrados = ticketsFiltrados.filter(
      (ticket) => ticket.liga === liga
    );
  }

  if (fecha) {
    ticketsFiltrados = ticketsFiltrados.filter((ticket) => {
      const fechaTicket = ticket.creado_en?.split("T")[0];
      return fechaTicket === fecha;
    });
  }

  if (folio) {
    ticketsFiltrados = ticketsFiltrados.filter((ticket) =>
      String(ticket.folio).toLowerCase().includes(folio)
    );
  }

  pintarTickets(ticketsFiltrados);
}

function pintarTickets(tickets) {
  listaTickets.innerHTML = "";

  if (!tickets.length) {
    sinTickets.classList.remove("hidden");
    return;
  }

  sinTickets.classList.add("hidden");

  tickets.forEach((ticket) => {
    const card = document.createElement("article");
    card.className = `ticket-card ${ticket.estado}`;

    card.innerHTML = `
      <div class="ticket-header">
        <div>
          <p class="ticket-title">${ticket.liga || "Mundial 2026"}</p>
          <p class="ticket-folio">Folio #${ticket.folio}</p>
        </div>

        <span class="ticket-status ${ticket.estado}">
          ${formatearEstado(ticket.estado)}
        </span>
      </div>

      <div class="ticket-info">
        <p><strong>${ticket.jornada || "Jornada"}</strong></p>
        <p>Fase de grupos</p>
        <p>Costo del juego: <strong>$${Number(ticket.costo_unitario || 30).toFixed(2)}</strong></p>
        <p>Puntos: <strong>${ticket.puntos_obtenidos || 0}</strong></p>
        <p>Aciertos: <strong>${ticket.total_aciertos || 0}</strong></p>
      </div>

      <div class="ticket-resumen">
        ${crearResumenPartidos(ticket.resumen_partidos || [])}
      </div>

      <button class="btn-detalle" data-id="${ticket.id}">
        Ver detalle
      </button>
    `;

    listaTickets.appendChild(card);
  });

  document.querySelectorAll(".btn-detalle").forEach((boton) => {
    boton.addEventListener("click", () => {
      const ticketId = boton.dataset.id;
      window.location.href = `./detalle-juego.html?id=${ticketId}`;
    });
  });
}

function crearResumenPartidos(partidos) {
  if (!partidos.length) {
    return `
      <p class="partido">
        No hay resumen disponible.
      </p>
    `;
  }

  return partidos
    .slice(0, 3)
    .map((partido) => {
      return `
        <div class="partido">
          <p>
            ${partido.equipo_local} vs ${partido.equipo_visitante}
          </p>
          <p class="prediccion">
            Selección: ${formatearSeleccion(partido.seleccion)}
          </p>
        </div>
      `;
    })
    .join("");
}

function formatearEstado(estado) {
  const estados = {
    pendiente: "Pendiente",
    en_juego: "En juego",
    ganado: "Ganado",
    perdido: "Perdido"
  };

  return estados[estado] || "Pendiente";
}

function formatearSeleccion(seleccion) {
  const selecciones = {
    local: "Local",
    empate: "Empate",
    visitante: "Visitante"
  };

  return selecciones[seleccion] || seleccion;
}