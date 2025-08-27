import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">🛍️ MiTienda</Link>

        <button className="menu-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <ul className={`nav-links ${open ? "active" : ""}`}>
          <li><Link to="/">Productos</Link></li>
          <li><Link to="/carrito">Carrito</Link></li>
          {user ? (
            <>
              <li><Link to="/pedidos">Mis pedidos</Link></li>
              <li><button onClick={onLogout}>Salir</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Registro</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
