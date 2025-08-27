export default function ProductoCard({ producto, agregarAlCarrito }) {
    return (
        <div>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button>
        </div>
    );
}