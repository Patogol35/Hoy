// Centraliza todas las llamadas a la API y maneja JWT + errores
const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:8000/api";

// Helper: fetch con Authorization si hay token
async function authFetch(url, options = {}, token) {
  const headers = {
    ...(options.headers || {}),
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });

  // Intenta parsear JSON siempre que haya contenido
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.detail || data?.error || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// AUTH
export const login = async (credentials) => {
  // Backend: POST /api/token/  (username, password)
  return authFetch(`${BASE_URL}/token/`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = async (data) => {
  // Backend: POST /api/register/
  return authFetch(`${BASE_URL}/register/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// PRODUCTOS
export const getProductos = async () => {
  return authFetch(`${BASE_URL}/productos/`, { method: "GET" });
};

// CARRITO
export const getCarrito = async (token) => {
  // Backend: GET /api/carrito/
  return authFetch(`${BASE_URL}/carrito/`, { method: "GET" }, token);
};

export const agregarAlCarrito = async (producto_id, cantidad = 1, token) => {
  // Backend: POST /api/carrito/agregar/  { producto_id, cantidad }
  return authFetch(
    `${BASE_URL}/carrito/agregar/`,
    {
      method: "POST",
      body: JSON.stringify({ producto_id, cantidad }),
    },
    token
  );
};

// PEDIDOS
export const crearPedido = async (token) => {
  // Backend crea el pedido desde el carrito del usuario
  return authFetch(`${BASE_URL}/pedido/crear/`, { method: "POST" }, token);
};

export const getPedidos = async (token) => {
  // Backend: GET /api/pedidos/
  return authFetch(`${BASE_URL}/pedidos/`, { method: "GET" }, token);
};
