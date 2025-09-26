// src/components/Navbar.jsx
import React, { useState } from "react";
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
  Drawer,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle as AccountCircleIcon,
  Brightness4,
  Brightness7,
  Logout,
} from "@mui/icons-material";
import NavButton from "./NavButton";
import menuConfig from "../config/menuConfig";

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItems = (onClick) =>
    menuConfig.map((item) => (
      <NavButton
        key={item.path}
        item={item}
        onClick={onClick}
        sx={{ mb: { xs: 1.5, md: 0 } }} // margen inferior solo en móvil
      />
    ));

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "background.paper" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", fontWeight: "bold" }}
          >
            MiTienda
          </Typography>

          {/* Menú Desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {renderMenuItems()}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ color: "error.main", fontWeight: 600 }}
              >
                Cerrar sesión
              </Button>
            )}
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            {isAuthenticated && (
              <Stack direction="row" spacing={1} alignItems="center">
                <AccountCircleIcon />
                <Typography sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
              </Stack>
            )}
          </Box>

          {/* Botón menú móvil */}
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer móvil */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.default",
          }}
        >
          {/* Botón cerrar */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Usuario centrado */}
          {isAuthenticated && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ my: 2 }}
            >
              <AccountCircleIcon />
              <Typography sx={{ fontWeight: 600 }}>
                {user?.username}
              </Typography>
            </Stack>
          )}

          {/* Opciones */}
          <Stack spacing={2} sx={{ flex: 1, mt: 2, px: 2 }}>
            {renderMenuItems(() => setOpen(false))}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{ color: "error.main", fontWeight: 600 }}
              >
                Cerrar sesión
              </Button>
            )}
          </Stack>

          {/* Dark mode toggle abajo */}
          <Box sx={{ p: 2 }}>
            <IconButton onClick={toggleDarkMode} color="inherit" fullWidth>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
