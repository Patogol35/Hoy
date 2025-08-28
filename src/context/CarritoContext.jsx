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
  const [carrito, setCarrito] = useState({ items: [] });
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

  // Actualizar cantidad localmente para evitar parpadeo
  const actualizarCantidad = async (producto_id, delta) => {
    if (!access) throw new Error("Debes iniciar sesión.");

    const item = carrito.items.find(it => it.producto.id === producto_id);
    if (!item) return;

    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;

    // Actualizamos localmente
    setCarrito(prev => ({
      ...prev,
      items: prev.items.map(it =>
        it.producto.id === producto_id
          ? { ...it, cantidad: nuevaCantidad, subtotal: nuevaCantidad * it.producto.precio }
          : it
      )
    }));

    // Luego sincronizamos con la API
    await apiAgregar(producto_id, delta, access);
  };

  // Opcional: setear cantidad absoluta
  const setCantidad = async (itemId, cantidad) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    setCarrito(prev => ({
      ...prev,
      items: prev.items.map(it =>
        it.id === itemId
          ? { ...it, cantidad, subtotal: cantidad * it.producto.precio }
          : it
      )
    }));
    await apiSetCantidad(itemId, cantidad, access);
  };

  const agregarAlCarrito = async (producto_id, cantidad = 1) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    await apiAgregar(producto_id, cantidad, access);
    await cargarCarrito();
  };

  const eliminarItem = async (itemId) => {
    if (!access) throw new Error("Debes iniciar sesión.");
    setCarrito(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== itemId)
    }));
    await apiEliminar(itemId, access);
  };

  const limpiarLocal = () => setCarrito({ items: [] });

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        items: carrito.items || [],
        loading,
        cargarCarrito,
        agregarAlCarrito,
        actualizarCantidad,
        setCantidad,
        eliminarItem,
        limpiarLocal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
