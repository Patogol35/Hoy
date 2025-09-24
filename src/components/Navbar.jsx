import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../context/ThemeContext";
import { useScrollTrigger } from "../hooks/useScrollTrigger";
import { authMenu, guestMenu } from "../config/menuConfig";
import NavButton from "./NavButton";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Stack,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const scrolled = useScrollTrigger(50);

  const menuItems = isAuthenticated ? authMenu : guestMenu;

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      {/* Navbar Desktop */}
      <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        <AppBar
          position="fixed"
          elevation={scrolled ? 6 : 2}
          sx={{
            backgroundColor: "#1976d2",
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
            zIndex: 1400,
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Logo */}
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

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2, alignItems: "center" }}>
              {menuItems.map((item, i) => (
                <NavButton key={i} item={item} />
              ))}

              {/* Botón Modo Oscuro solo ícono */}
              <IconButton onClick={toggleMode} sx={{ color: "#fff" }}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>

              {isAuthenticated && (
                <>
                  <Typography sx={{ color: "#fff", fontWeight: 600, mx: 2 }}>
                    👤 {user?.username}
                  </Typography>
                  <Button
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      fontWeight: 600,
                      color: "#fff",
                      background: "linear-gradient(135deg, #d32f2f, #f44336)",
                      borderRadius: "12px",
                      px: 2.5,
                      py: 1,
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
              aria-label="Abrir menú"
              aria-expanded={open}
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
              style={{
                width: "280px",
                background: "#1976d2",
                borderRadius: "16px 0 0 16px",
                padding: "4rem 1.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón X */}
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  mb: 2,
                  color: "#fff",
                  background: "rgba(0,0,0,0.6)",
                  "&:hover": { background: "rgba(0,0,0,0.9)" },
                  alignSelf: "center",
                  width: 42,
                  height: 42,
                }}
                aria-label="Cerrar menú"
              >
                <CloseIcon sx={{ fontSize: 26 }} />
              </IconButton>

              {/* Usuario */}
              {isAuthenticated && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    mb: 2,
                  }}
                >
                  👤 {user?.username}
                </Typography>
              )}

              {/* Items menú */}
              <Stack spacing={2} sx={{ flex: 1, overflowY: "auto" }}>
                {menuItems.map((item, i) => (
                  <NavButton key={i} item={item} onClick={() => setOpen(false)} />
                ))}

                {/* Ícono modo oscuro justo después de las opciones */}
                <IconButton
                  onClick={toggleMode}
                  sx={{
                    color: "#fff",
                    background: "rgba(0,0,0,0.4)",
                    "&:hover": { background: "rgba(0,0,0,0.7)" },
                    width: 48,
                    height: 48,
                    alignSelf: "center",
                  }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>

                {isAuthenticated && (
                  <Button
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{
                      fontWeight: 600,
                      color: "#fff",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #d32f2f, #f44336)",
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
