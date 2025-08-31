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
        { text: "Cerrar sesión", action: handleLogout, highlight: true },
      ]
    : [
        { text: "Iniciar sesión", path: "/login", highlight: true },
        { text: "Registrarse", path: "/register", highlight: true },
      ];

  return (
    <>
      {/* Navbar */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "primary.main",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          borderBottom: "1px solid #eee",
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
              fontSize: "1.4rem",
              transition: "0.3s",
              "&:hover": { color: "secondary.main" },
            }}
          >
            🛍️ MiTienda
          </Typography>

          {/* Botones */}
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
                transition: "0.3s",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                  transform: "scale(1.05)",
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
                      color: item.highlight ? "white" : "primary.main",
                      bgcolor: item.highlight ? "primary.main" : "transparent",
                      border: item.highlight ? "none" : "1px solid #ddd",
                      "&:hover": {
                        bgcolor: item.highlight
                          ? "secondary.main"
                          : "primary.light",
                        color: "white",
                        transform: "scale(1.05)",
                      },
                      transition: "0.3s",
                    }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <Button
                    key={idx}
                    onClick={item.action}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "999px",
                      px: 2,
                      color: "white",
                      bgcolor: "primary.main",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        transform: "scale(1.05)",
                      },
                      transition: "0.3s",
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

      {/* Drawer para móviles */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: "16px 0 0 16px",
            bgcolor: "linear-gradient(to bottom, #ffffff, #f9fafb)",
            p: 2,
          },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 1,
            }}
          >
            MiTienda
          </Typography>
          <Divider />
        </Box>

        <List>
          {menuItems.map((item, idx) => (
            <ListItem
              key={idx}
              button
              component={item.path ? Link : "button"}
              to={item.path}
              onClick={item.action || (() => setOpen(false))}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: item.highlight ? "primary.main" : "transparent",
                color: item.highlight ? "white" : "text.primary",
                "&:hover": {
                  bgcolor: item.highlight ? "secondary.main" : "primary.light",
                  color: "white",
                },
                transition: "0.3s",
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
