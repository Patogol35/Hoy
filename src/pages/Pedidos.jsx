import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Pedidos() {
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        if (user) {
            getPedidos(user.token).then(setPedidos);
        }
    }, [user]);

    return (
        <div>
            <h2>Mis pedidos</h2>
            {pedidos.map(p => (
                <div key={p.id}>Pedido #{p.id} - {p.productos.length} productos</div>
            ))}
        </div>
    );
}