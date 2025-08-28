import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "../App.css";
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
    <div className="card">
      {/* ✅ Imagen del producto */}
      {producto.imagen_url && (
        <img
  src={producto.imagen_url}
  alt={producto.nombre}
  style={{
    width: '100%',
    maxWidth: '250px',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '12px'
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