import apiClient from "../apiClient";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";


export const loginUser = async (form) => {
  const response = await apiClient.post("/api/auth/login", form);
  return response.data;
};

export const registerUser = async (form) => {
  await apiClient.post("/api/users", form);
};

export const getCurrentUser = async ({ token }) => {
  const response = await fetch(`${API_BASE_URL}/api/users/auth/current-user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,  // Incluir el token JWT en el encabezado
      "Content-Type": "application/json",
    },
    credentials: "include", // Si usas cookies, de lo contrario puedes eliminar esto
  });

  const data = await response.json();

  return data;
}