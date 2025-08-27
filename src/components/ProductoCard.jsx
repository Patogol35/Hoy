import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

export default function ProductoCard({ producto }) {
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const onAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(producto.id, 1);
      alert("Producto agregado al carrito");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ border: "1px solid #eee", padding: 16, borderRadius: 12, marginBottom: 12 }}>
      <h3>{producto.nombre}</h3>
      <p>{producto.descripcion}</p>
      <p><b>Precio:</b> ${producto.precio}</p>
      <button onClick={onAdd}>Agregar al carrito</button>
    </div>
  );
}
