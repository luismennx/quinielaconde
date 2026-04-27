import {
  protegerRuta,
  obtenerPerfil,
  logout
} from "../../js/auth.js";

protegerRuta();

const usuarioTexto = document.querySelector("#usuario");
const cerrarSesionBtn = document.querySelector("#cerrarSesion");

async function cargarHome() {
  const usuario = await obtenerPerfil();

  if (!usuario) return;

  usuarioTexto.textContent =
    `Hola, ${usuario.apodo || usuario.nombre}. Saldo: $${usuario.saldo}`;
}

cerrarSesionBtn.addEventListener("click", logout);

cargarHome();