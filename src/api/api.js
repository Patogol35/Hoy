// src/api/Api.js

// Tomamos la URL base del backend desde .env
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper para obtener token
const getToken = () => localStorage.getItem("token");

// Headers con autenticación (si hay token)
const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------------- //
// 🔑 AUTENTICACIÓN
// ---------------------- //
export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ---------------------- //
// 📦 PRODUCTOS
// ---------------------- //
export const getProductos = async () => {
  const res = await fetch(`${BASE_URL}/productos/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
};

// ---------------------- //
// 🛒 PEDIDOS
// ---------------------- //
export const crearPedido = async (productos) => {
  const res = await fetch(`${BASE_URL}/pedidos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ productos }),
  });
  return res.json();
};

export const getPedidos = async () => {
  const res = await fetch(`${BASE_URL}/pedidos/`, {
    headers: { "Content-Type": "application/json", ...authHeaders() },
  });
  return res.json();
};
