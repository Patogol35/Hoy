import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

// Variantes de animación
const menuVariants = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { type: "spring", stiffness: 80 } },
  exit: { x: "100%", transition: { duration: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 },
  }),
};

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const menuItems = [
    { label: "Inicio", path: "/", icon: "🏠", color: "linear-gradient(135deg,#4cafef,#2196f3)" },
    { label: "Carrito", path: "/carrito", icon: "🛒", color: "linear-gradient(135deg,#81c784,#388e3c)" },
    { label: "Mis pedidos", path: "/pedidos", icon: "📦", color: "linear-gradient(135deg,#ffb74d,#f57c00)" },
  ];

  return (
    <>
      {/* ===== NAVBAR ESCRITORIO ===== */}
      <AppBar
        position="static"
        sx={{
          background: theme.palette.primary.main,
          px: 2,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Logo / título */}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            🛍️ MiTienda
          </Typography>

          {/* Menú en escritorio */}
          <Stack direction="row" spacing={2} alignItems="center">
            {menuItems.map((item, i) => (
              <Button
                key={i}
                component={Link}
                to={item.path}
                sx={{
                  fontWeight: 600,
                  color: "#fff",
                  textTransform: "none",
                }}
              >
                {item.icon} {item.label}
              </Button>
            ))}

            {/* Nombre de usuario */}
            {isAuthenticated && user && (
              <Typography
                variant="body1"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  ml: 2,
                }}
              >
                👤 {user.username}
              </Typography>
            )}

            {/* Botón logout */}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontWeight: 600,
                  color: "#fff",
                  textTransform: "none",
                  background: "linear-gradient(135deg, #d32f2f, #f44336)",
                  px: 2,
                  "&:hover": { boxShadow: "0 0 10px rgba(0,0,0,0.3)" },
                }}
              >
                Cerrar sesión
              </Button>
            )}

            {/* Botón abrir menú en móvil */}
            <IconButton
              edge="end"
              sx={{ color: "#fff", display: { md: "none" } }}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ===== DRAWER MÓVIL ===== */}
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
                {/* Botón X arriba */}
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
                      color: "#fff",
                      background: "rgba(0,0,0,0.25)",
                      "&:hover": { background: "rgba(0,0,0,0.4)" },
                    }}
                  >
                    <CloseIcon />
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

                {/* Opciones del menú */}
                {menuItems.map((item, i) => (
                  <motion.div
                    key={i}
                    custom={i + 1}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
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
                        "&:hover": {
                          boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}

                {/* Botón logout */}
                {isAuthenticated && (
                  <motion.div
                    custom={menuItems.length + 1}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                  >
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
