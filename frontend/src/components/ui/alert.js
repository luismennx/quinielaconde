export function mostrarAlerta({
  tipo = "success",
  titulo = "",
  mensaje = "",
  duracion = 2200,
  redireccion = null,
  accionTexto = null,
  accionCallback = null
}) {
  const overlay = document.createElement("div");
  overlay.className = "alert-overlay";

  const iconos = {
    success: "✓",
    error: "×",
    warning: "!",
    network: "🌐"
  };

  const icono = iconos[tipo] || "!";

  overlay.innerHTML = `
    <div class="alert-card alert-card--${tipo}">
      <div class="alert-icon alert-icon--${tipo}">
        ${icono}
      </div>

      <h2>${titulo}</h2>
      <p>${mensaje}</p>

      ${
        accionTexto
          ? `<button class="alert-action-btn">${accionTexto}</button>`
          : ""
      }

      <div class="alert-dots">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // botón opcional
  if (accionTexto && accionCallback) {
    overlay.querySelector(".alert-action-btn")
      .addEventListener("click", accionCallback);
  }

  setTimeout(() => {
    overlay.classList.add("fade-out");

    setTimeout(() => {
      overlay.remove();
      if (redireccion) window.location.href = redireccion;
    }, 350);

  }, duracion);
}