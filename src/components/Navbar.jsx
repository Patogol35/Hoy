import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

export default function Navbar() {
  const theme = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { carrito } = useCarrito();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  const menuItems = [
    { label: "Inicio", path: "/", icon: <MenuIcon />, color: "#4f46e5" },
    {
      label: `Carrito (${carrito.length})`,
      path: "/carrito",
      icon: <ShoppingCartIcon />,
      color: "#16a34a",
    },
    { label: "Mis pedidos", path: "/pedidos", icon: <MenuIcon />, color: "#f59e0b" },
  ];

  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", transition: { duration: 0.25 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  // cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* AppBar */}
      <AppBar position="static" sx={{ background: theme.palette.primary.main }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            🛍️ MiTienda
          </Typography>

          {/* Desktop */}
          <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
            {menuItems.map((item, i) => (
              <Button
                key={i}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  background: item.color,
                  borderRadius: "10px",
                  "&:hover": { opacity: 0.9 },
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
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(135deg,#d32f2f,#f44336)",
                  borderRadius: "10px",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Cerrar sesión
              </Button>
            )}
          </Stack>

          {/* Botón menú móvil */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

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
                padding: "2rem",
                paddingTop: "5rem",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Stack spacing={2} sx={{ mt: 2 }}>
                {/* Botón X flotante */}
                <motion.div
                  custom={-1}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ position: "absolute", top: 16, right: 16 }}
                >
                  <IconButton
                    onClick={() => setOpen(false)}
                    sx={{
                      color: "#000",
                      background: "rgba(255,255,255,0.8)",
                      "&:hover": { background: "rgba(255,255,255,1)" },
                    }}
                  >
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                </motion.div>

                {/* Nombre de usuario */}
                {isAuthenticated && user && (
                  <motion.div custom={0} variants={itemVariants} initial="hidden" animate="visible">
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
                  </motion.div>
                )}

                {/* Opciones */}
                {menuItems.map((item, i) => (
                  <motion.div key={i} custom={i + 1} variants={itemVariants} initial="hidden" animate="visible">
                    <Button
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
                        "&:hover": { boxShadow: "0 0 15px rgba(0,0,0,0.35)" },
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}

                {/* Logout */}
                {isAuthenticated && (
                  <motion.div custom={menuItems.length + 1} variants={itemVariants} initial="hidden" animate="visible">
                    <Button
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#fff",
                        borderRadius: "12px",
                        textTransform: "none",
                        background: "linear-gradient(135deg,#d32f2f,#f44336)",
                        width: "100%",
                        py: 1.2,
                        "&:hover": { boxShadow: "0 0 15px rgba(0,0,0,0.35)" },
                      }}
                    >
                      Cerrar sesión
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
