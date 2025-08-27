import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
import "../App.css";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Cargando productos...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Productos</h2>
      {productos.length === 0 && <p>No hay productos disponibles.</p>}
      <div className="grid">
        {productos.map((prod) => (
          <ProductoCard key={prod.id} producto={prod} />
        ))}
      </div>
    </div>
  );
}
