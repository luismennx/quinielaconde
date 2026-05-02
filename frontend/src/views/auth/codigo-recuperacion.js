import { mostrarAlerta } from "../../components/ui/alert.js";

const form = document.querySelector("#codigoForm");
const inputs = document.querySelectorAll(".code-inputs input");

const recoveryIdentificador = localStorage.getItem("recovery_identificador");

if (!recoveryIdentificador) {
  window.location.href = "./recuperacion.html";
}

inputs[0].focus();

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

    const texto = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    texto.split("").forEach((numero, i) => {
      if (inputs[i]) inputs[i].value = numero;
    });

    const ultimoIndex = Math.min(texto.length, inputs.length) - 1;
    if (inputs[ultimoIndex]) inputs[ultimoIndex].focus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const codigo = [...inputs].map(input => input.value).join("");

  if (codigo.length !== 6) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Código incompleto",
      mensaje: "Ingresa los 6 dígitos del código.",
      duracion: 2200
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
});