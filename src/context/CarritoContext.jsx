import { createContext, useContext, useEffect, useState } from "react";
import { agregarAlCarrito as apiAgregar, getCarrito as apiGetCarrito } from "../api/api";
import { useAuth } from "./AuthContext";

const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const { access } = useAuth();
  const [carrito, setCarrito] = useState(null); // Estructura del backend: { id, usuario, creado, items: [...] }
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
      // fallback vacío si hay error
      setCarrito({ items: [] });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access]);

  const agregarAlCarrito = async (producto_id, cantidad = 1) => {
    if (!access) throw new Error("Debes iniciar sesión para agregar al carrito.");
    await apiAgregar(producto_id, cantidad, access);
    // refresca carrito
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
        limpiarLocal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export const useCarrito = () => useContext(CarritoContext);
