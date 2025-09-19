
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
  // lee del localStorage si existe
  const storedMode = localStorage.getItem("mode") || "light";
  const [mode, setMode] = useState(storedMode);

  const toggleMode = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("mode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: { default: "#f4f6f8", paper: "#fff" },
              }
            : {
                primary: { main: "#90caf9" },
                background: { default: "#121212", paper: "#1e1e1e" },
              }),
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
