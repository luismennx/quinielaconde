import API_URL from "../../js/api.js";
import { mostrarAlerta } from "../../components/ui/alert.js";

const form = document.querySelector("#recoveryForm");
const recoveryValueInput = document.querySelector("#recoveryValue");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const identificador = recoveryValueInput.value.trim();

  if (!identificador) {
    mostrarAlerta({
      tipo: "warning",
      titulo: "Campos incompletos",
      mensaje: "Ingresa tu correo, apodo o WhatsApp.",
      duracion: 2200
    });
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/recover-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ identificador })
    });

    const data = await response.json();

    if (!response.ok) {
      mostrarAlerta({
        tipo: "warning",
        titulo: "Usuario no encontrado",
        mensaje: data.message || "No encontramos una cuenta con esos datos.",
        duracion: 2800,
        accionTexto: "Crear cuenta",
        accionCallback: () => {
          window.location.href = "./registro.html";
        }
      });
      return;
    }

    localStorage.setItem("recovery_identificador", identificador);

    mostrarAlerta({
      tipo: "success",
      titulo: "Código enviado",
      mensaje: "Te enviamos un código de recuperación.",
      duracion: 1800,
      redireccion: "./codigo-recuperacion.html"
    });
  } catch (error) {
    console.error("Error en recuperación:", error);

    mostrarAlerta({
      tipo: "network",
      titulo: "Error de conexión",
      mensaje: "No pudimos enviar el código. Intenta nuevamente.",
      duracion: 2600
    });
  }
});