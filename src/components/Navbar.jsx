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
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeIcon from "@mui/icons-material/Code";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Variantes animación menú
  const menuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 18 },
    },
    exit: {
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  // Cerrar si clic fuera del drawer
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <AppBar
      position="sticky"
      sx={{
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        borderBottom: `2px solid ${theme.palette.primary.main}`,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <CodeIcon sx={{ color: theme.palette.primary.main }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: theme.palette.text.primary,
              fontWeight: "bold",
              "&:hover": { color: theme.palette.primary.main },
            }}
          >
            Tienda
          </Typography>
        </Stack>

        {/* Links en PC */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
        >
          <Button component={Link} to="/" color="inherit">
            Inicio
          </Button>
          <Button component={Link} to="/productos" color="inherit">
            Productos
          </Button>
          <Button component={Link} to="/carrito" color="inherit">
            Carrito
          </Button>
          {user ? (
            <>
              <Button component={Link} to="/perfil" color="inherit">
                Perfil
              </Button>
              <Button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                color="inherit"
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              Iniciar sesión
            </Button>
          )}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Stack>

        {/* Botón hamburguesa móvil */}
        <IconButton
          sx={{ display: { xs: "flex", md: "none" } }}
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Drawer móvil */}
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1200,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              ref={menuRef}
              style={{
                width: "280px",
                background: theme.palette.primary.main,
                borderRadius: "16px 0 0 16px",
                padding: "2rem 1.5rem 2rem",
                paddingTop: "5rem",
                boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "stretch",
                maxHeight: "100vh", // 🔹 no corta la última opción
                overflowY: "auto",  // 🔹 scroll si se pasa
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  mb: 3,
                  color: "#fff",
                  background: "rgba(0,0,0,0.6)",
                  "&:hover": { background: "rgba(0,0,0,0.9)" },
                  alignSelf: "center",
                }}
                aria-label="Cerrar menú"
              >
                <CloseIcon fontSize="medium" /> {/* 🔹 más compacto */}
              </IconButton>

              {/* Links menú */}
              <Button component={Link} to="/" sx={{ color: "#fff" }}>
                Inicio
              </Button>
              <Button component={Link} to="/productos" sx={{ color: "#fff" }}>
                Productos
              </Button>
              <Button component={Link} to="/carrito" sx={{ color: "#fff" }}>
                Carrito
              </Button>
              {user ? (
                <>
                  <Button component={Link} to="/perfil" sx={{ color: "#fff" }}>
                    Perfil
                  </Button>
                  <Button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    sx={{ color: "#fff" }}
                  >
                    Cerrar sesión
                  </Button>
                </>
              ) : (
                <Button component={Link} to="/login" sx={{ color: "#fff" }}>
                  Iniciar sesión
                </Button>
              )}
              <IconButton
                onClick={toggleDarkMode}
                sx={{ color: "#fff", mt: 2, alignSelf: "center" }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </motion.div>
          </Box>
        )}
      </AnimatePresence>
    </AppBar>
  );
}
