import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";
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
        { text: "🛒 Carrito", path: "/carrito" },
        { text: "📦 Mis pedidos", path: "/pedidos" },
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
        sx={{
          bgcolor: "white",
          color: "primary.main",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
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
              color: "primary.main",
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: "1.3rem",
            }}
          >
            🛍️ MiTienda
          </Typography>

          {/* Menú */}
          {isMobile ? (
            <Button
              onClick={() => setOpen(true)}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                borderRadius: "999px",
                px: 2,
                py: 0.5,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
            >
              ☰ Menú
            </Button>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              {menuItems.map((item, idx) =>
                item.path ? (
                  <Button
                    key={idx}
                    component={Link}
                    to={item.path}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "999px",
                      px: 2,
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <Button
                    key={idx}
                    onClick={item.action}
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "999px",
                      px: 2,
                    }}
                  >
                    {item.text}
                  </Button>
                )
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            bgcolor: "#f9fafb",
            borderRadius: "16px 0 0 16px",
            p: 1,
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            my: 2,
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
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
              sx={{
                borderRadius: 2,
                mb: 1,
                "&:hover": { backgroundColor: "primary.light" },
              }}
            >
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  textAlign: "center",
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
