import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const baseStyle = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#fff",
  borderRadius: "12px",
  textTransform: "none",
  width: "100%",
  py: 1.2,
  transition: "all 0.3s ease",
  "& .MuiButton-startIcon": {
    color: "#fff",
  },
};

function NavButton({ item, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  return (
    <motion.div whileHover={{ y: -2, scale: 1.08 }} whileTap={{ scale: 0.95 }}>
      <Button
        component={Link}
        to={item.path}
        startIcon={<Icon />}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        sx={(theme) => ({
          ...baseStyle,

          // ===== Estilo móvil (sm para abajo) =====
          background: item.color,

          // ===== Sobrescribe en desktop (md en adelante) =====
          [theme.breakpoints.up("md")]: {
            background: isActive ? item.color : "transparent",
          },

          boxShadow: isActive
            ? "0 0 20px rgba(255,255,255,0.6)"
            : "none",
          transform: isActive ? "scale(1.05)" : "scale(1)",
          "&:hover": {
            boxShadow: isActive
              ? "0 0 20px rgba(0,0,0,0.4)"
              : "0 0 12px rgba(0,0,0,0.25)",
            filter: "brightness(1.1)",
          },
        })}
      >
        {item.label}
      </Button>
    </motion.div>
  );
}

export default React.memo(NavButton);
