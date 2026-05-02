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

form.addEventListener("submit", (event) => {
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

  localStorage.removeItem("recovery_identificador");
  localStorage.removeItem("recovery_code");

  mostrarAlerta({
    tipo: "success",
    titulo: "Contraseña actualizada",
    mensaje: "Ya puedes iniciar sesión con tu nueva contraseña.",
    duracion: 2000,
    redireccion: "./login.html"
  });
});