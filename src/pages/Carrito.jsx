import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const { items, cargarCarrito, loading, limpiarLocal } = useCarrito();
  const { access } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = items.reduce((acc, it) => acc + Number(it.subtotal || (it.cantidad * (it.producto?.precio || 0))), 0);

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
    <div style={{ padding: 16 }}>
      <h2>Carrito</h2>
      {loading && <p>Cargando carrito...</p>}
      {!loading && items.length === 0 && <p>Tu carrito está vacío.</p>}
      {!loading &&
        items.map((it) => (
          <div key={it.id} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
            {it.cantidad} x {it.producto?.nombre} — ${Number(it.producto?.precio).toFixed(2)} &nbsp;
            <b>Subtotal:</b> ${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}
          </div>
        ))}
      {!loading && items.length > 0 && (
        <>
          <h3>Total: ${total.toFixed(2)}</h3>
          <button onClick={comprar}>Comprar</button>
        </>
      )}
    </div>
  );
}
