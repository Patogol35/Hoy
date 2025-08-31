import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuItems = isAuthenticated ? (
    <>
      <MenuItem component={Link} to="/carrito" onClick={handleMenuClose}>
        Carrito
      </MenuItem>
      <MenuItem component={Link} to="/pedidos" onClick={handleMenuClose}>
        Mis pedidos
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleLogout();
          handleMenuClose();
        }}
      >
        Cerrar sesión
      </MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
        Iniciar sesión
      </MenuItem>
      <MenuItem component={Link} to="/register" onClick={handleMenuClose}>
        Registrarse
      </MenuItem>
    </>
  );

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

        {/* Menú escritorio */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
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
              <Button color="inherit" sx={{ ml: 1 }} component={Link} to="/register">
                Registrarse
              </Button>
            </>
          )}
        </Box>

        {/* Menú móvil */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            keepMounted
          >
            {menuItems}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
      }
