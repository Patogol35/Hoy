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
import { Brightness4, Brightness7 } from "@mui/icons-material";
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

export default function Navbar({ mode, setMode }) {
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
        { label: "🏠 Inicio", path: "/", color: "linear-gradient(135deg, #0288d1, #26c6da)" },
        { label: "🛒 Carrito", path: "/carrito", color: "linear-gradient(135deg, #2e7d32, #66bb6a)" },
        { label: "📦 Mis pedidos", path: "/pedidos", color: "linear-gradient(135deg, #f57c00, #ffb74d)" },
        { label: "Cerrar sesión", action: handleLogout, color: "linear-gradient(135deg, #c62828, #ef5350)" },
      ]
    : [
        { label: "Iniciar sesión", path: "/login", color: "linear-gradient(135deg, #0288d1, #26c6da)" },
        { label: "Registrarse", path: "/register", color: "linear-gradient(135deg, #6a1b9a, #ab47bc)" },
      ];

  // 🎯 Navbar cambia con scroll
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
              mode === "dark"
                ? "#121212"
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
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontWeight: "bold",
                  color: "#fff",
                  cursor: "pointer",
                  lineHeight: 1.2,
                }}
                component={Link}
                to="/"
              >
                🛍️ MiTienda
                <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 500, color: "#ddd" }}>
                  Desarrollado por Jorge Patricio Santamaría Cherrez
                </Typography>
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
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                        borderRadius: "10px",
                        px: 2,
                        py: 1,
                        transition: "all 0.3s ease",
                        background: "transparent",
                        "&:hover": {
                          background: item.color,
                          boxShadow: "0 0 15px rgba(0,0,0,0.4)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      onClick={item.action}
                      sx={{
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2,
                        py: 1,
                        background: item.color,
                        "&:hover": {
                          boxShadow: "0 0 15px rgba(0,0,0,0.5)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )}
                </motion.div>
              ))}

              {/* Botón tema */}
              <IconButton
                onClick={() => setMode(mode === "light" ? "dark" : "light")}
                sx={{ color: "#fff" }}
                aria-label="Cambiar tema"
              >
                {mode === "light" ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
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
                background: mode === "dark" ? "rgba(30,30,30,0.95)" : theme.palette.primary.main,
                borderRadius: "16px 0 0 16px",
                padding: "2rem",
                paddingTop: "5rem",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                maxHeight: "100vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Stack spacing={2}>
                {menuItems.map((item, i) =>
                  item.path ? (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Button
                        component={Link}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: "10px",
                          textTransform: "none",
                          background: item.color,
                          width: "100%",
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={i}
                      custom={i}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Button
                        onClick={item.action}
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: "10px",
                          textTransform: "none",
                          background: item.color,
                          width: "100%",
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  )
                )}
              </Stack>

              {/* Botones abajo */}
              <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                <Button
                  onClick={() => setMode(mode === "light" ? "dark" : "light")}
                  startIcon={mode === "light" ? <Brightness4 /> : <Brightness7 />}
                  sx={{
                    flex: 1,
                    color: "#fff",
                    border: "1px solid #fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    minHeight: "48px",
                    "&:hover": { background: "rgba(255,255,255,0.12)" },
                  }}
                >
                  {mode === "light" ? "Modo Noche" : "Modo Día"}
                </Button>

                <Button
                  onClick={() => setOpen(false)}
                  startIcon={<CloseIcon />}
                  sx={{
                    flex: 1,
                    color: "#fff",
                    border: "1px solid #fff",
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    minHeight: "48px",
                    "&:hover": { background: "rgba(255,255,255,0.12)" },
                  }}
                >
                  Cerrar
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
