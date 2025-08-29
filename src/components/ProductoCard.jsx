import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import "../App.css";

export default function ProductoCard({ producto }) {
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const onAdd = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión para agregar productos 🛒");
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(producto.id, 1);
      toast.success(`"${producto.nombre}" agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="card">
      {/* ✅ Imagen con estilos inline */}
      {producto.imagen_url && (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          style={{
            width: "100%",
            maxWidth: "250px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "12px",
          }}
        />
      )}

      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p className="price">${producto.precio}</p>
      <button onClick={onAdd}>Agregar al carrito</button>
    </div>
  );
}
