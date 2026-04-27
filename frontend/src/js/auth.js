import API_URL from "./api.js";

export function getToken() {
  return localStorage.getItem("token");
}

export function getUsuarioLocal() {
  return JSON.parse(localStorage.getItem("usuario"));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
  window.location.href = "/frontend/src/views/auth/login.html";
}

export function protegerRuta() {
  const token = getToken();

  if (!token) {
    window.location.href = "/frontend/src/views/auth/login.html";
  }
}

export async function obtenerPerfil() {
  const token = getToken();

  const response = await fetch(`${API_URL}/user/perfil`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    logout();
    return null;
  }

  localStorage.setItem("usuario", JSON.stringify(data.usuario));
  return data.usuario;
}