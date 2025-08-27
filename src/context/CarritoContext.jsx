import { createContext, useContext, useEffect, useState } from "react";
import {
  agregarAlCarrito as apiAgregar,
  getCarrito as apiGetCarrito,
  eliminarDelCarrito as apiEliminar,
  setCantidadItem as apiSetCantidad,
} from "../api/api";
import { useAuth } from "./AuthContext";
const CarritoContext = createContext();
export function CarritoProvider({ children }) {
  const { access } = useAuth();
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(false);
  const cargarCarrito = async () => {
    if (!access) {
      setCarrito({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const data = await apiGetCarrito(access);
      setCarrito(data);
    } catch (e) {
      console.error(e);
      setCarrito({ items: [] });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access]);
  // Sumar/restar usando el mismo endpoint de agregar
  const actualizarCantidad = async (producto_id, delta) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    await apiAgregar(producto_id, delta, access);
    await cargarCarrito();
  };
  // (Opcional) setear cantidad absoluta por item_id
  const setCantidad = async (itemId, cantidad) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    await apiSetCantidad(itemId, cantidad, access);
    await cargarCarrito();
  };
  const agregarAlCarrito = async (producto_id, cantidad = 1) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    await apiAgregar(producto_id, cantidad, access);
    await cargarCarrito();
  };
  const eliminarItem = async (itemId) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    await apiEliminar(itemId, access);
    await cargarCarrito();
  };
  const limpiarLocal = () => setCarrito({ items: [] });
  return (
    <CarritoContext.Provider
      value={{
        carrito,
        items: carrito?.items || [],
        loading,
        cargarCarrito,
        agregarAlCarrito,
        actualizarCantidad, // suma/resta por producto_id
        setCantidad,        // set absoluto por item_id (opcional)
        eliminarItem,       // eliminar por item_id
        limpiarLocal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
export const useCarrito = () => useContext(CarritoContext);
