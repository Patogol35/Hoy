import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <Link to="/">Inicio</Link>
            {user ? (
                <>
                    <Link to="/carrito">Carrito</Link>
                    <Link to="/pedidos">Mis pedidos</Link>
                    <button onClick={logout}>Cerrar sesión</button>
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