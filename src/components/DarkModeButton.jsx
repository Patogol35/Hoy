import { IconButton, Button } from "@mui/material";
import { useThemeMode } from "../context/ThemeContext";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export default function DarkModeButton({ variant = "icon" }) {
  const { mode, toggleMode } = useThemeMode();

  if (variant === "icon") {
    return (
      <IconButton onClick={toggleMode} sx={{ color: "#fff" }}>
        {mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    );
  }

  return (
    <Button
      onClick={toggleMode}
      startIcon={mode === "light" ? <Brightness4 /> : <Brightness7 />}
      sx={{
        fontWeight: 600,
        textTransform: "none",
        borderRadius: 2,
        background: "linear-gradient(135deg, #555, #888)",
        color: "#fff",
        width: "100%",
      }}
    >
      {mode === "light" ? "Modo Oscuro" : "Modo Claro"}
    </Button>
  );
}
