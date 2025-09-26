import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import React from "react";

function NavButton({ item, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  // Rutas que deben mostrarse siempre con fondo en desktop
  const alwaysColoredPaths = ["/login", "/register"];

  return (
    <motion.div whileHover={{ y: -2, scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        component={Link}
        to={item.path}
        startIcon={<Icon />}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        sx={(theme) => ({
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "#fff",
          borderRadius: "12px",
          textTransform: "none",
          width: "100%",
          py: 1.2,
          transition: "all 0.25s ease",
          "& .MuiButton-startIcon": { color: "#fff" },

          // Fondo dinámico
          background: {
            xs: item.color, // móvil siempre con color
            md:
              isActive || alwaysColoredPaths.includes(item.path)
                ? item.color
                : "transparent", // desktop: activo o login/register
          },

          // Sombras y efecto activo
          boxShadow: isActive
            ? "0 0 20px rgba(255,255,255,0.5)"
            : "none",
          transform: isActive ? "scale(1.04)" : "scale(1)",

          "&:hover": {
            boxShadow: isActive
              ? "0 0 20px rgba(0,0,0,0.4)"
              : "0 0 12px rgba(0,0,0,0.25)",
            filter: "brightness(1.1)",
          },

          // Ajuste dark mode
          ...(theme.palette.mode === "dark" && {
            color: "#fff",
            "&:hover": {
              filter: "brightness(1.2)",
            },
          }),
        })}
      >
        {item.label}
      </Button>
    </motion.div>
  );
}

export default React.memo(NavButton);
