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
  Drawer,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingBag as ShoppingBagIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

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

  const renderMenuItems = (onClick) =>
    menuItems.map((item, i) => (
      <NavButton key={i} item={item} onClick={onClick} />
    ));

  const renderUserSection = (showLogout = true, isMobile = false) =>
    isAuthenticated && (
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1.5}
        alignItems="center"
        sx={{ my: isMobile ? 2 : 0, textAlign: "center" }}
      >
        <AccountCircleIcon sx={{ color: "#fff" }} />
        <Typography sx={{ color: "#fff", fontWeight: 600 }}>
          {user?.username}
        </Typography>
        {showLogout && (
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
        )}
      </Stack>
    );

  return (
    <>
      {/* Navbar Desktop */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
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
              E-commerce Jorge Patricio 
            </Typography>

            {/* Desktop Menu */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {renderMenuItems()}
              <IconButton onClick={toggleMode} sx={{ color: "#fff" }}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
              {renderUserSection(true, false)} {/* Desktop */}
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

      {/* Drawer Móvil */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: "#1976d2",
            borderRadius: "16px 0 0 16px",
            p: 2,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {/* Header drawer */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ color: "#fff" }}
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* User info móvil */}
        {renderUserSection(false, true)}

        {/* Menú items */}
        <Stack spacing={2} sx={{ flex: 1, mt: 2 }}>
          {renderMenuItems(() => setOpen(false))}
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

          {/* Botones utilitarios */}
          <Stack spacing={2} alignItems="center" sx={{ mt: 3, pb: 2 }}>
            <IconButton
              onClick={toggleMode}
              sx={{
                color: "#fff",
                background: "rgba(0,0,0,0.4)",
                "&:hover": { background: "rgba(0,0,0,0.7)" },
                width: 48,
                height: 48,
              }}
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: "#fff",
                background: "rgba(0,0,0,0.6)",
                "&:hover": { background: "rgba(0,0,0,0.9)" },
                width: 42,
                height: 42,
              }}
              aria-label="Cerrar menú"
            >
              <CloseIcon sx={{ fontSize: 26 }} />
            </IconButton>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
              }
