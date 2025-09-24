import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useCarritoHandler() {
  const { agregarAlCarrito } = useCarrito();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdd = async (prod) => {
    try {
      await agregarAlCarrito(prod.id, 1);
      toast.success(`${prod.nombre} agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const handleCarritoClick = () => {
    if (!user) {
      toast.warning("Debes iniciar sesión para acceder al carrito ⚠️");
      return;
    }
    navigate("/carrito");
  };

  return { handleAdd, handleCarritoClick };
}
