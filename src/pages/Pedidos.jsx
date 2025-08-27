import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPedidos(access)
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access]);

  if (loading) return <div className="p-6">Cargando pedidos...</div>;

  return (
    <div className="p-6">
      <h2>Mis pedidos</h2>
      {pedidos.length === 0 && <p>Aún no tienes pedidos.</p>}
      {pedidos.map((p) => (
        <div key={p.id} className="pedido-card">
          <h4>Pedido #{p.id}</h4>
          <p>
            <b>Fecha:</b> {new Date(p.fecha).toLocaleString()}
          </p>
          <p>
            <b>Total:</b> ${Number(p.total).toFixed(2)}
          </p>
          <ul>
            {p.items?.map((item, i) => (
              <li key={i}>
                {item.cantidad} x {item.producto?.nombre} — $
                {Number(item.precio_unitario).toFixed(2)} &nbsp;
                <i>Subtotal: ${Number(item.subtotal).toFixed(2)}</i>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
