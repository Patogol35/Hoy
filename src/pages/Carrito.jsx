import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

export default function Carrito() {
  const {
    items,
    cargarCarrito,
    loading,
    limpiarLocal,
    setCantidad,
    eliminarItem,
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
        toast.error(res.error);
        return;
      }
      toast.success("Pedido realizado ✅");
      limpiarLocal();
      navigate("/pedidos");
    } catch (e) {
      toast.error(e.message || "Ocurrió un error en la compra");
    }
  };

  const incrementar = (it) => setCantidad(it.id, it.cantidad + 1);
  const decrementar = (it) => it.cantidad > 1 && setCantidad(it.id, it.cantidad - 1);

  return (
    <div className="carrito">
      <h2>Carrito</h2>
      {loading && <p>Cargando carrito...</p>}
      {!loading && items.length === 0 && <p>Tu carrito está vacío.</p>}

      {!loading &&
        items.map((it) => (
          <div key={it.id} className="carrito-item">
            <span>{it.producto?.nombre}</span>

            <div className="carrito-controls">
              <button onClick={() => decrementar(it)}>-</button>

              <input
                type="number"
                min="1"
                value={it.cantidad}
                onChange={(e) => {
                  const nuevaCantidad = Number(e.target.value);
                  if (nuevaCantidad >= 1) setCantidad(it.id, nuevaCantidad);
                }}
              />

              <button onClick={() => incrementar(it)}>+</button>
            </div>

            <span>${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}</span>

            <button className="btn-eliminar" onClick={() => eliminarItem(it.id)}>❌</button>
          </div>
        ))}

      {!loading && items.length > 0 && (
        <>
          <div className="carrito-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={comprar}>Comprar</button>
        </>
      )}
    </div>
  );
}

