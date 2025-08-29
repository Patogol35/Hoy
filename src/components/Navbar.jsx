import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// MUI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo o nombre de la tienda */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          MiTienda
        </Typography>

        {/* Menú de enlaces */}
        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/carrito">
                Carrito
              </Button>
              <Button color="inherit" component={Link} to="/pedidos">
                Mis pedidos
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Iniciar sesión
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}