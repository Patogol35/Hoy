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
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <AppBar position="static" sx={{ background: "#1e1e2f" }}>
      <Toolbar>
        {/* LOGO */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          E-commerce Jorge
        </Typography>

        {/* MENU DESKTOP */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/productos">
            Productos
          </Button>
          <Button color="inherit" component={Link} to="/carrito">
            Carrito
          </Button>

          {isAuthenticated && user ? (
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ ml: 2 }}>
              <AccountCircleIcon sx={{ color: "#fff" }} />
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                {user.username}
              </Typography>
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.8,
                  fontSize: "0.95rem",
                  color: "#fff",
                  background: "linear-gradient(135deg, #c62828, #ef5350)",
                  "&:hover": {
                    boxShadow: "0 0 15px rgba(0,0,0,0.45)",
                  },
                }}
              >
                Cerrar sesión
              </Button>
            </Stack>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "12px",
                px: 2,
                py: 0.8,
                fontSize: "0.95rem",
                color: "#fff",
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              }}
            >
              Iniciar sesión
            </Button>
          )}
        </Box>

        {/* MENU MOBILE */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* DRAWER MOBILE */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button component={Link} to="/productos" onClick={toggleDrawer}>
              <ListItemText primary="Productos" />
            </ListItem>
            <ListItem button component={Link} to="/carrito" onClick={toggleDrawer}>
              <ListItemText primary="Carrito" />
            </ListItem>
          </List>
          <Divider />
          <Box sx={{ p: 2, mt: "auto" }}>
            {isAuthenticated && user ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <AccountCircleIcon />
                  <Typography>{user.username}</Typography>
                </Stack>
                <Button
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  fullWidth
                  sx={{
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "12px",
                    px: 2,
                    py: 0.8,
                    fontSize: "0.95rem",
                    color: "#fff",
                    background: "linear-gradient(135deg, #c62828, #ef5350)",
                    "&:hover": {
                      boxShadow: "0 0 15px rgba(0,0,0,0.45)",
                    },
                  }}
                >
                  Cerrar sesión
                </Button>
              </Stack>
            ) : (
              <Button
                component={Link}
                to="/login"
                fullWidth
                sx={{
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  px: 2,
                  py: 0.8,
                  fontSize: "0.95rem",
                  color: "#fff",
                  background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                }}
              >
                Iniciar sesión
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
          }
