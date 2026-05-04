import API_URL from "../../js/api.js";
import { mostrarAlerta } from "../../components/ui/alert.js";

const form = document.querySelector("#codigoForm");
const inputs = document.querySelectorAll(".code-inputs input");

const recoveryIdentificador = localStorage.getItem("recovery_identificador");

if (!recoveryIdentificador) {
  window.location.href = "./recuperacion.html";
}

inputs[0]?.focus();

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");

    if (input.value && inputs[index + 1]) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value && inputs[index - 1]) {
      inputs[index - 1].focus();
    }
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();

    const texto = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    texto.split("").forEach((numero, i) => {
      if (inputs[i]) inputs[i].value = numero;
    });

    const ultimoIndex = Math.min(texto.length, inputs.length) - 1;
    if (inputs[ultimoIndex]) inputs[ultimoIndex].focus();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const codigo = [...inputs].map((input) => input.value).join("");

  if (codigo.length !== 6) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Código incompleto",
      mensaje: "Ingresa los 6 dígitos del código.",
      duracion: 2200
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/verify-recovery-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identificador: recoveryIdentificador,
        codigo
      })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta({
        tipo: "error",
        titulo: "Código incorrecto",
        mensaje: data.message || "El código no es válido o expiró.",
        duracion: 2400
      });
      return;
    }

    localStorage.setItem("recovery_code", codigo);

    mostrarAlerta({
      tipo: "success",
      titulo: "Código validado",
      mensaje: "Ahora crea tu nueva contraseña.",
      duracion: 1600,
      redireccion: "./nueva-password.html"
    });
  } catch (error) {
    console.error("Error al validar código:", error);

    mostrarAlerta({
      tipo: "network",
      titulo: "Error de conexión",
      mensaje: "No pudimos validar el código.",
      duracion: 2500
    });
  }
});