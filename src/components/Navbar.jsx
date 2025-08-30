import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "primary.main",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          🛍️ MiTienda
        </Typography>

        <Box>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/carrito">
                Carrito
              </Button>
              <Button color="inherit" component={Link} to="/pedidos">
                Mis pedidos
              </Button>
              <Button
                variant="outlined"
                sx={{ bgcolor: "white", color: "primary.main", ml: 1 }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Iniciar sesión
              </Button>
              <Button
               color="inherit"
                sx={{ ml: 1 }}
                component={Link}
                to="/register"
              >
                Registrarse
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
