import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  const menuItems = isAuthenticated
    ? [
        { text: "Carrito", path: "/carrito" },
        { text: "Mis pedidos", path: "/pedidos" },
        { text: "Cerrar sesión", action: handleLogout },
      ]
    : [
        { text: "Iniciar sesión", path: "/login" },
        { text: "Registrarse", path: "/register" },
      ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ bgcolor: "primary.main", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
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

          {isMobile ? (
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box>
              {menuItems.map((item, idx) =>
                item.path ? (
                  <Button
                    key={idx}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{ ml: 1 }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <Button
                    key={idx}
                    variant="outlined"
                    sx={{ bgcolor: "white", color: "primary.main", ml: 1 }}
                    onClick={item.action}
                  >
                    {item.text}
                  </Button>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer para móviles */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" mb={2}>
            Menú
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item, idx) => (
              <ListItem
                key={idx}
                button
                component={item.path ? Link : "button"}
                to={item.path}
                onClick={item.action || (() => setOpen(false))}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
