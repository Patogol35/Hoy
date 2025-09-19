import { createContext, useContext, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {
  // Forzar modo claro
  const mode = "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          background: { default: "#f4f6f8", paper: "#fff" },
        },
        shape: { borderRadius: 12 },
      }),
    []
  );

  return (
    <ThemeModeContext.Provider value={{ mode }}>
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
