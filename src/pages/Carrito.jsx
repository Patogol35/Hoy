import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../App.css";
export default function Carrito() {
  const {
    items,
    cargarCarrito,
    loading,
    limpiarLocal,
    actualizarCantidad, // +/- por producto_id
    eliminarItem,       // eliminar por item_id
    // setCantidad,     // si quieres un input para cantidad absoluta
  } = useCarrito();
  const { access } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const total = items.reduce(
    (acc, it) =>
      acc + Number(it.subtotal || it.cantidad * (it.producto?.precio || 0)),
    0
  );
  const comprar = async () => {
    try {
      const res = await crearPedido(access);
      if (res?.error) {
        alert(res.error);
        return;
      }
      alert("Pedido realizado ✅");
      limpiarLocal();
      navigate("/pedidos");
    } catch (e) {
      alert(e.message);
    }
  };
  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {loading && <p>Cargando carrito...</p>}
      {!loading && items.length === 0 && <p>Tu carrito está vacío.</p>}
      {!loading &&
        items.map((it) => (
          <div key={it.id} className="carrito-item">
            <span>{it.producto?.nombre}</span>
            {/* Controles de cantidad (usan producto_id) */}
            <div className="carrito-controls">
              <button onClick={() => actualizarCantidad(it.producto.id, -1)}>-</button>
              <span>{it.cantidad}</span>
              <button onClick={() => actualizarCantidad(it.producto.id, 1)}>+</button>
            </div>
            <span>
              ${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}
            </span>
            {/* Eliminar por item_id */}
            <button className="btn-eliminar" onClick={() => eliminarItem(it.id)}>
              ❌
            </button>
          </div>
        ))}
      {!loading && items.length > 0 && (
        <>
          <div className="carrito-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={comprar}>Comprar</button>
        </>
      )}
    </div>
  );
}