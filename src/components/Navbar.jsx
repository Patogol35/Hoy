import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

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
        px: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
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

        {/* Menú móvil */}
        <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" component={Link} to="/carrito">
                <ShoppingCartIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/pedidos">
                <ListAltIcon />
              </IconButton>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton color="inherit" component={Link} to="/login">
                <LoginIcon />
              </IconButton>
            </>
          )}
        </Box>

        {/* Menú escritorio */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/carrito" startIcon={<ShoppingCartIcon />}>
                Carrito
              </Button>
              <Button color="inherit" component={Link} to="/pedidos" startIcon={<ListAltIcon />}>
                Pedidos
              </Button>
              <Button
                variant="outlined"
                sx={{ bgcolor: "white", color: "primary.main", ml: 1 }}
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
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
