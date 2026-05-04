import API_URL from "../../js/api.js";
import { mostrarAlerta } from "../../components/ui/alert.js";

const form = document.querySelector("#nuevaPasswordForm");
const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");
const togglePasswordBtn = document.querySelector("#togglePassword");
const toggleConfirmPasswordBtn = document.querySelector("#toggleConfirmPassword");

const recoveryIdentificador = localStorage.getItem("recovery_identificador");
const recoveryCode = localStorage.getItem("recovery_code");

if (!recoveryIdentificador || !recoveryCode) {
  window.location.href = "./recuperacion.html";
}

togglePasswordBtn.addEventListener("click", () => {
  const esPassword = passwordInput.type === "password";
  passwordInput.type = esPassword ? "text" : "password";
  togglePasswordBtn.textContent = esPassword ? "🙈" : "👁️";
});

toggleConfirmPasswordBtn.addEventListener("click", () => {
  const esPassword = confirmPasswordInput.type === "password";
  confirmPasswordInput.type = esPassword ? "text" : "password";
  toggleConfirmPasswordBtn.textContent = esPassword ? "🙈" : "👁️";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!password || !confirmPassword) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Campos incompletos",
      mensaje: "Ingresa y confirma tu nueva contraseña.",
      duracion: 2200
    });
    return;
  }

  if (password.length < 8) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Contraseña muy corta",
      mensaje: "Tu contraseña debe tener al menos 8 caracteres.",
      duracion: 2200
    });
    return;
  }

  if (password !== confirmPassword) {
    mostrarAlerta({
      tipo: "error",
      titulo: "Contraseñas diferentes",
      mensaje: "Las contraseñas no coinciden.",
      duracion: 2200
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identificador: recoveryIdentificador,
        codigo: recoveryCode,
        password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta({
        tipo: "error",
        titulo: "No se pudo actualizar",
        mensaje: data.message || "Intenta nuevamente.",
        duracion: 2500
      });
      return;
    }

    localStorage.removeItem("recovery_identificador");
    localStorage.removeItem("recovery_code");

    mostrarAlerta({
      tipo: "success",
      titulo: "Contraseña actualizada",
      mensaje: "Ya puedes iniciar sesión con tu nueva contraseña.",
      duracion: 2000,
      redireccion: "./login.html"
    });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);

    mostrarAlerta({
      tipo: "network",
      titulo: "Error de conexión",
      mensaje: "No pudimos actualizar tu contraseña.",
      duracion: 2500
    });
  }
});