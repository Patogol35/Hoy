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
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 🎬 Variantes animaciones
const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" },
  }),
};

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
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
        { label: "Inicio", path: "/", icon: <HomeIcon /> },
        { label: "Carrito", path: "/carrito", icon: <ShoppingCartIcon /> },
        { label: "Mis pedidos", path: "/pedidos", icon: <ListAltIcon /> },
        { label: "Cerrar sesión", action: handleLogout, icon: <LogoutIcon /> },
      ]
    : [
        { label: "Iniciar sesión", path: "/login", icon: <LoginIcon /> },
        { label: "Registrarse", path: "/register", icon: <PersonAddIcon /> },
      ];

  // Cambia estado con scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Topbar */}
      <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <AppBar
          position="fixed"
          elevation={scrolled ? 6 : 2}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark"
                ? theme.palette.background.paper
                : scrolled
                ? theme.palette.primary.dark
                : theme.palette.primary.main,
            transition: "all 0.3s ease",
            boxShadow: scrolled ? "0 4px 16px rgba(0,0,0,0.25)" : "none",
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
                  color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                🛍️ Tienda Jorge Patricio
              </Typography>
            </motion.div>

            {/* Desktop menu */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2, alignItems: "center" }}>
              {menuItems.map((item, i) => (
                <motion.div key={i} whileHover={{ y: -2, scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                  {item.path ? (
                    <Button
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        color: theme.palette.mode === "dark" ? "#fff" : "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        borderRadius: "12px",
                        px: 2.5,
                        py: 1,
                        transition: "all 0.3s ease",
                        background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)",
                        "&:hover": {
                          background: theme.palette.mode === "dark" ? "#333" : "#1976d2",
                          boxShadow: "0 0 20px rgba(0,0,0,0.35)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      onClick={item.action}
                      startIcon={item.icon}
                      sx={{
                        fontWeight: 600,
                        borderRadius: "12px",
                        px: 2.5,
                        py: 1,
                        background: theme.palette.mode === "dark" ? "#444" : "#c62828",
                        color: "#fff",
                        "&:hover": {
                          background: theme.palette.mode === "dark" ? "#666" : "#ef5350",
                          boxShadow: "0 0 20px rgba(0,0,0,0.45)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )}
                </motion.div>
              ))}
            </Box>

            {/* Botón menú móvil */}
            <IconButton
              sx={{ display: { xs: "block", lg: "none" }, color: "#fff" }}
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
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
            role="dialog"
            aria-modal="true"
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
                background: theme.palette.mode === "dark" ? "#222" : theme.palette.primary.main,
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
              {/* Botón cerrar */}
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ position: "absolute", top: "1rem", right: "1rem", color: "#fff" }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>

              <Stack spacing={2} sx={{ mt: 2 }}>
                {menuItems.map((item, i) =>
                  item.path ? (
                    <motion.div key={i} custom={i} variants={itemVariants} initial="hidden" animate="visible">
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
                          background: theme.palette.mode === "dark" ? "#333" : "#1976d2",
                          width: "100%",
                          py: 1.2,
                          "&:hover": {
                            boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key={i} custom={i} variants={itemVariants} initial="hidden" animate="visible">
                      <Button
                        onClick={item.action}
                        startIcon={item.icon}
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: "12px",
                          textTransform: "none",
                          background: theme.palette.mode === "dark" ? "#555" : "#c62828",
                          width: "100%",
                          py: 1.2,
                          "&:hover": {
                            boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  )
                )}
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
