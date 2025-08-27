import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ display: "flex", gap: 12, padding: "10px 16px", borderBottom: "1px solid #eee" }}>
      <Link to="/">Inicio</Link>
      {isAuthenticated ? (
        <>
          <Link to="/carrito">Carrito</Link>
          <Link to="/pedidos">Mis pedidos</Link>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}
