
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
        { text: "🏠 Inicio", path: "/" },
        { text: "🛒 Carrito", path: "/carrito" },
        { text: "📦 Mis pedidos", path: "/pedidos" },
        { text: "Cerrar sesión", action: handleLogout, highlight: true },
      ]
    : [
        { text: "Iniciar sesión", path: "/login" },
        { text: "Registrarse", path: "/register", highlight: true },
      ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "white",
          color: "primary.main",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          px: 2,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo con subtítulo */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              color: "primary.main",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: "1.4rem",
                lineHeight: 1.2,
              }}
            >
              🛍️ MiTienda
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "primary.main",
              }}
            >
              Jorge Patricio Santamaría Cherrez
            </Typography>
          </Box>

          {/* Menú */}
          {isMobile ? (
            <Button
              onClick={() => setOpen(true)}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                borderRadius: "8px",
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
                      borderRadius: "8px",
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
                      borderRadius: "8px",
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

      {/* Drawer flotante elegante */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 240,
            maxHeight: "70vh",
            borderRadius: "16px 0 0 16px",
            bgcolor: "white",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            mt: 10,
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Menú
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 2 }}>
          {menuItems.map((item, idx) => (
            <ListItem
              key={idx}
              button
              component={item.path ? Link : "button"}
              to={item.path}
              onClick={item.action || (() => setOpen(false))}
              sx={{
                mb: 1,
                borderRadius: 1.5,
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
