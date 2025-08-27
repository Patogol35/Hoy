import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Productos</h2>
      {productos.length === 0 && <p>No hay productos disponibles.</p>}
      {productos.map((prod) => (
        <ProductoCard key={prod.id} producto={prod} />
      ))}
    </div>
  );
}
