import ProductoCard from "../components/ProductoCard";
import "./Productos.css";

export default function Productos({ productos, onAdd }) {
  return (
    <div className="container">
      <h1 className="page-title">Productos</h1>
      <div className="productos-grid">
        {productos.map((p) => (
          <ProductoCard key={p.id} producto={p} onAdd={onAdd} />
        ))}
      </div>
    </div>
  );
}
