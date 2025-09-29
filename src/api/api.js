// =====================
// BASE URL
// =====================
const BASE_URL = import.meta?.env?.VITE_API_URL || "http://localhost:8000/api";

// =====================
// REFRESH TOKEN
// =====================
export const refreshToken = async (refresh) => {
  const res = await fetch(`${BASE_URL}/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) throw new Error("No se pudo refrescar el token");
  return res.json();
};

// =====================
// FETCH CON AUTO REFRESH
// =====================
async function authFetch(url, options = {}, token) {
  let headers = {
    ...(options.headers || {}),
    ...(options.body && { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  // Si expira el access → intentar refrescar
  if (res.status === 401 && localStorage.getItem("refresh")) {
    try {
      const newTokens = await refreshToken(localStorage.getItem("refresh"));
      if (newTokens?.access) {
        localStorage.setItem("access", newTokens.access);
        token = newTokens.access;

        // reintento con nuevo token
        headers = {
          ...(options.headers || {}),
          ...(options.body && { "Content-Type": "application/json" }),
          Authorization: `Bearer ${token}`,
        };
        res = await fetch(url, { ...options, headers });
      }
    } catch (err) {
      console.error("Refresh token inválido:", err);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      throw new Error("⚠️ Tu sesión expiró, vuelve a iniciar sesión.");
    }
  }

  const text = await res.text();
  let data = null;
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

// =====================
// ENDPOINTS
// =====================

// AUTH
export const login = async (credentials) => {
  return authFetch(`${BASE_URL}/token/`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const register = async (data) => {
  return authFetch(`${BASE_URL}/register/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// PRODUCTOS (con filtros opcionales)
export const getProductos = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${BASE_URL}/productos/?${query}` : `${BASE_URL}/productos/`;
  return authFetch(url, { method: "GET" });
};

// CATEGORÍAS
export const getCategorias = async () => {
  return authFetch(`${BASE_URL}/categorias/`, { method: "GET" });
};

// CARRITO
export const getCarrito = async (token) => {
  return authFetch(`${BASE_URL}/carrito/`, { method: "GET" }, token);
};

export const agregarAlCarrito = async (producto_id, cantidad = 1, token) => {
  return authFetch(
    `${BASE_URL}/carrito/agregar/`,
    {
      method: "POST",
      body: JSON.stringify({ producto_id, cantidad }),
    },
    token
  );
};

export const eliminarDelCarrito = async (itemId, token) => {
  return authFetch(
    `${BASE_URL}/carrito/eliminar/${itemId}/`,
    { method: "DELETE" },
    token
  );
};

export const setCantidadItem = async (itemId, cantidad, token) => {
  return authFetch(
    `${BASE_URL}/carrito/actualizar/${itemId}/`,
    { method: "PUT", body: JSON.stringify({ cantidad }) },
    token
  );
};

// PEDIDOS
export const crearPedido = async (token) => {
  return authFetch(`${BASE_URL}/pedido/crear/`, { method: "POST" }, token);
};

export const getPedidos = async (token, page = 1) => {
  return authFetch(`${BASE_URL}/pedidos/?page=${page}`, { method: "GET" }, token);
};

// PERFIL DE USUARIO
export const getUserProfile = async (token) => {
  const API_ROOT = BASE_URL.replace("/api", "");
  return authFetch(`${API_ROOT}/user/profile/`, { method: "GET" }, token);
};



