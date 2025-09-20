import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Animaciones
const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
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
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // menú perfil
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const authMenuItems = [
    { label: "Mis pedidos", path: "/pedidos", icon: <ListAltIcon /> },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AppBar
          position="fixed"
          elevation={2}
          sx={{
            backgroundColor: theme.palette.primary.main,
            boxShadow: "none",
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
                />{" "}
                Tienda Jorge Patricio
              </Typography>
            </motion.div>

            {/* Desktop menu */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                gap: 2,
                alignItems: "center",
              }}
            >
              {isAuthenticated && user ? (
                <>
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar
                      sx={{
                        bgcolor: "secondary.main",
                        width: 36,
                        height: 36,
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem disabled>👋 Hola, {user.username}</MenuItem>
                    {authMenuItems.map((item, i) => (
                      <MenuItem
                        key={i}
                        component={Link}
                        to={item.path}
                        onClick={handleMenuClose}
                      >
                        {item.icon}
                        <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Cerrar sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" color="inherit">
                    <LoginIcon fontSize="small" sx={{ mr: 1 }} />
                    Iniciar sesión
                  </Button>
                  <Button component={Link} to="/register" color="inherit">
                    <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                    Registrarse
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
              <IconButton
                onClick={() => setOpen(false)}
                sx={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  color: "#fff",
                }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>

              {isAuthenticated && user && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 40,
                      height: 40,
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography sx={{ color: "#fff", fontWeight: "600" }}>
                    👋 Hola, {user.username}
                  </Typography>
                </Box>
              )}

              <Stack spacing={2} sx={{ mt: 2 }}>
                {isAuthenticated ? (
                  <>
                    <motion.div
                      custom={0}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Button
                        component={Link}
                        to="/pedidos"
                        onClick={() => setOpen(false)}
                        startIcon={<ListAltIcon />}
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: "12px",
                          textTransform: "none",
                          background: "linear-gradient(135deg, #f57c00, #ffb74d)",
                          width: "100%",
                          py: 1.2,
                          "&:hover": {
                            boxShadow: "0 0 15px rgba(0,0,0,0.35)",
                          },
                        }}
                      >
                        Mis pedidos
                      </Button>
                    </motion.div>

                    <motion.div
                      custom={1}
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
                          background: "linear-gradient(135deg, #c62828, #ef5350)",
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
                  </>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      onClick={() => setOpen(false)}
                      startIcon={<LoginIcon />}
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#fff",
                        borderRadius: "12px",
                        textTransform: "none",
                        background: "linear-gradient(135deg, #0288d1, #26c6da)",
                        width: "100%",
                        py: 1.2,
                      }}
                    >
                      Iniciar sesión
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      onClick={() => setOpen(false)}
                      startIcon={<PersonAddIcon />}
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#fff",
                        borderRadius: "12px",
                        textTransform: "none",
                        background: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
                        width: "100%",
                        py: 1.2,
                      }}
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </Stack>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
