import API_URL from "../../js/api.js";

const form = document.querySelector("#registroForm");
const mensaje = document.querySelector("#mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.querySelector("#nombre").value.trim();
  const apodo = document.querySelector("#apodo").value.trim();
  const correo = document.querySelector("#correo").value.trim();
  const whatsapp = document.querySelector("#whatsapp").value.trim();
  const password = document.querySelector("#password").value.trim();
  const confirmPassword = document.querySelector("#confirmPassword").value.trim();

  if (!nombre || !apodo || !correo || !password) {
    return mostrarMensaje("Completa todos los campos obligatorios");
  }

  if (password !== confirmPassword) {
    return mostrarMensaje("Las contraseñas no coinciden");
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombre,
        apodo,
        correo,
        whatsapp,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return mostrarMensaje(data.message || "Error al registrar usuario");
    }

    mostrarMensaje("Cuenta creada correctamente", true);

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);

  } catch (error) {
    console.error(error);
    mostrarMensaje("Error de conexión con el servidor");
  }
});

function mostrarMensaje(texto, success = false) {
  mensaje.textContent = texto;
  mensaje.style.display = "block";
  mensaje.style.color = success ? "#78ff54" : "#ff6b6b";
}