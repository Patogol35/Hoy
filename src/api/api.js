const BASE_URL = "http://localhost:8000/api";

export const login = async (data) => {
    const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const register = async (data) => {
    const res = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return res.json();
};

export const getProductos = async () => {
    const res = await fetch(`${BASE_URL}/productos/`);
    return res.json();
};

export const crearPedido = async (productos, token) => {
    const res = await fetch(`${BASE_URL}/pedidos/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productos })
    });
    return res.json();
};

export const getPedidos = async (token) => {
    const res = await fetch(`${BASE_URL}/pedidos/`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
};