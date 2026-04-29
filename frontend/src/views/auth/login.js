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
    console.log("🔵 LOGIN API URL:", `${API_URL}/api/auth/login`);
    console.log("🔵 LOGIN BODY:", { identificador, password: "********" });

    const respuesta = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ identificador, password })
    });

    console.log("🟡 STATUS:", respuesta.status);
    console.log("🟡 OK:", respuesta.ok);
    console.log("🟡 CONTENT-TYPE:", respuesta.headers.get("content-type"));

    const textoRespuesta = await respuesta.text();

    console.log("🟠 RESPUESTA RAW DEL SERVIDOR:");
    console.log(textoRespuesta);

    let data = {};

    try {
      data = textoRespuesta ? JSON.parse(textoRespuesta) : {};
      console.log("🟢 RESPUESTA JSON PARSEADA:", data);
    } catch (parseError) {
      console.error("🔴 ERROR PARSEANDO JSON:", parseError);
      console.error("🔴 EL SERVIDOR NO RESPONDIÓ JSON");
      throw new Error("El servidor respondió algo que no es JSON");
    }

    if (!respuesta.ok) {
      console.error("🔴 ERROR HTTP LOGIN:", {
        status: respuesta.status,
        data
      });

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
        titulo: `Error ${respuesta.status}`,
        mensaje:
  data?.debug?.sqlMessage ||
  data?.debug?.message ||
  data?.error ||
  data?.message ||
  "Error desconocido en el servidor.",
        duracion: 5000
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
    console.error("💥 ERROR REAL EN LOGIN COMPLETO:");
    console.error("name:", error?.name);
    console.error("message:", error?.message);
    console.error("code:", error?.code);
    console.error("errno:", error?.errno);
    console.error("sqlMessage:", error?.sqlMessage);
    console.error("sql:", error?.sql);
    console.error("stack:", error?.stack);
    console.error("error completo:", error);

    return res.status(500).json({
      message: "Error interno al iniciar sesión",
      debug: {
        name: error?.name || null,
        message: error?.message || null,
        code: error?.code || null,
        errno: error?.errno || null,
        sqlMessage: error?.sqlMessage || null,
        sql: error?.sql || null,
        stack: error?.stack || null
      }
    });
  }
});