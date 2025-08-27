import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Carrito() {
  const { items, cargarCarrito, loading, limpiarLocal } = useCarrito();
  const { access } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
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
            <span>
              {it.cantidad} x {it.producto?.nombre}
            </span>
            <span>
              ${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}
            </span>
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
