import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
import { useCarrito } from "../context/CarritoContext";

export default function Home() {
    const [productos, setProductos] = useState([]);
    const { agregarAlCarrito } = useCarrito();

    useEffect(() => {
        getProductos().then(setProductos);
    }, []);

    return (
        <div>
            <h2>Productos</h2>
            {productos.map(prod => (
                <ProductoCard key={prod.id} producto={prod} agregarAlCarrito={agregarAlCarrito} />
            ))}
        </div>
    );
}