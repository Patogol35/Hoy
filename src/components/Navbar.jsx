import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animaciones
const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  const menuItems = isAuthenticated
    ? [
        { label: "Inicio", path: "/", icon: <HomeIcon />, color: "linear-gradient(135deg, #0288d1, #26c6da)" },
        { label: "Carrito", path: "/carrito", icon: <ShoppingCartIcon />, color: "linear-gradient(135deg, #2e7d32, #66bb6a)" },
        { label: "Mis pedidos", path: "/pedidos", icon: <ListAltIcon />, color: "linear-gradient(135deg, #f57c00, #ffb74d)" },
      ]
    : [
        { label: "Iniciar sesión", path: "/login", icon: <LoginIcon />, color: "linear-gradient(135deg, #0288d1, #26c6da)" },
        { label: "Registrarse", path: "/register", icon: <PersonAddIcon />, color: "linear-gradient(135deg, #6a1b9a, #ab47bc)" },
      ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Navbar desktop */}
      <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <AppBar
          position="fixed"
          elevation={2}
          sx={{
            backgroundColor: theme.palette.primary.main,
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
            zIndex: 1400,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: "bold",
                  color: "#fff",
                  cursor: "pointer",
                  lineHeight: 1.2,
                  textDecoration: "none",
                }}
              >
                <ShoppingBagIcon
                  sx={{
                    fontSize: 28,
                    background: "linear-gradient(135deg, #FF5722, #FFC107)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />
                Tienda Patricio
              </Typography>
            </motion.div>

            {/* Desktop menu */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2, alignItems: "center" }}>
              {menuItems.map((item, i) => (
                <motion.div key={i} whileHover={{ y: -2, scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      borderRadius: "12px",
                      px: 2.5,
                      py: 1,
                      transition: "all 0.3s ease",
                      background: "rgba(255,255,255,0.08)",
                      "&:hover": {
                        background: item.color,
                        boxShadow: "0 0 20px rgba(0,0,0,0.35)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}

              {isAuthenticated && user && (
                <>
                  <Typography sx={{ color: "#fff", fontWeight: 600, mx: 2 }}>
                    👤 {user.username}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      background: "linear-gradient(135deg, #d32f2f, #f44336)",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: "12px",
                      textTransform: "none",
                      px: 2.5,
                      py: 1,
                      "&:hover": {
                        boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                      },
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </>
              )}
            </Box>

            {/* Botón menú móvil */}
            <IconButton
              sx={{ display: { xs: "block", lg: "none" }, color: "#fff" }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Drawer móvil */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1300,
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              ref={menuRef}
              tabIndex={-1}
              style={{
                width: "280px",
                background: theme.palette.primary.main,
                borderRadius: "16px 0 0 16px",
                padding: "2rem 1rem 1rem 1rem", // 🔹 menos espacio arriba
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón X arriba absoluto */}
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#fff",
                  background: "rgba(0,0,0,0.6)",
                  "&:hover": { background: "rgba(0,0,0,0.9)" },
                  zIndex: 2,
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>

              {/* Contenido con espacio debajo de la X */}
              <Stack spacing={2} sx={{ mt: 8 }}>
                {isAuthenticated && user && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      textAlign: "center",
                      mb: 1,
                    }}
                  >
                    👤 {user.username}
                  </Typography>
                )}

                {menuItems.map((item, i) => (
                  <Button
                    key={i}
                    component={Link}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    startIcon={item.icon}
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#fff",
                      borderRadius: "12px",
                      textTransform: "none",
                      background: item.color,
                      width: "100%",
                      py: 1.2,
                      "&:hover": {
                        boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {isAuthenticated && (
                  <Button
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#fff",
                      borderRadius: "12px",
                      textTransform: "none",
                      background: "linear-gradient(135deg, #d32f2f, #f44336)",
                      width: "100%",
                      py: 1.2,
                      "&:hover": {
                        boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                      },
                    }}
                  >
                    Cerrar sesión
                  </Button>
                )}
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
      }
