import API_URL from "../../js/api.js";
import { mostrarAlerta } from "../../components/ui/alert.js";

const form = document.querySelector("#loginForm");
const identificadorInput = document.querySelector("#identificador");
const passwordInput = document.querySelector("#password");
const togglePasswordBtn = document.querySelector("#togglePassword");

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
    mostrarAlerta({
      tipo: "warning",
      titulo: "Campos incompletos",
      mensaje: "Por favor ingresa tu usuario/correo y contraseña.",
      duracion: 2200
    });
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
      if (respuesta.status === 404) {
        mostrarAlerta({
          tipo: "warning",
          titulo: "Usuario no encontrado",
          mensaje: "No existe una cuenta con este usuario o correo.\nPuedes crear una cuenta fácilmente.",
          duracion: 3500,
          accionTexto: "Crear cuenta",
          accionCallback: () => {
            window.location.href = "./registro.html";
          }
        });
        return;
      }

      mostrarAlerta({
        tipo: "error",
        titulo: "Datos incorrectos",
        mensaje: data.message || "El usuario o la contraseña no son correctos. Intenta nuevamente.",
        duracion: 2200
      });
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    mostrarAlerta({
      tipo: "success",
      titulo: "Inicio de sesión exitoso",
      mensaje: "Bienvenido de nuevo 👋\nTu acceso fue correcto, te estamos redirigiendo...",
      duracion: 2000,
      redireccion: "../home/home.html"
    });
  } catch (error) {
    console.error("Error en login:", error);

    mostrarAlerta({
  tipo: "network",
  titulo: "Error de conexión",
  mensaje: "No pudimos iniciar sesión en este momento. Revisa tu conexión e inténtalo de nuevo.",
  duracion: 3200,
  accionTexto: "Reintentar",
  accionCallback: () => {
    location.reload();
  }
});
  }
});