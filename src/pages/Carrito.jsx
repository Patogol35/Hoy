import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
    const { carrito, limpiarCarrito } = useCarrito();
    const { user } = useAuth();
    const navigate = useNavigate();

    const comprar = async () => {
        if (!user) return;
        const res = await crearPedido(carrito, user.token);
        alert("Pedido realizado");
        limpiarCarrito();
        navigate("/pedidos");
    };

    return (
        <div>
            <h2>Carrito</h2>
            {carrito.map((p, i) => (
                <div key={i}>{p.nombre} - ${p.precio}</div>
            ))}
            <button onClick={comprar}>Comprar</button>
        </div>
    );
}