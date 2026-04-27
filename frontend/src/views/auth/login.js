import API_URL from "../../js/api.js";

const form = document.querySelector("#loginForm");
const identificadorInput = document.querySelector("#identificador");
const passwordInput = document.querySelector("#password");
const togglePasswordBtn = document.querySelector("#togglePassword");
const mensaje = document.querySelector("#mensaje");

togglePasswordBtn.addEventListener("click", () => {
  const esPassword = passwordInput.type === "password";

  passwordInput.type = esPassword ? "text" : "password";
  togglePasswordBtn.textContent = esPassword ? "🙈" : "👁️";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const identificador = identificadorInput.value.trim();
  const password = passwordInput.value.trim();

  if (!identificador || !password) {
    mostrarMensaje("Ingresa tu correo, apodo o WhatsApp y tu contraseña.");
    return;
  }

  try {
    const respuesta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ identificador, password })
    });

    const data = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(data.message || "Error al iniciar sesión.");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    window.location.href = "../home/home.html";
  } catch (error) {
    console.error("Error en login:", error);
    mostrarMensaje("No se pudo conectar con el servidor.");
  }
});

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.style.display = "block";
}