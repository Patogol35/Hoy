import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#4f46e5" }, // Azul violeta
    secondary: { main: "#f43f5e" }, // Rojo rosado
    background: { default: "#f9fafb" },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 16, transition: "0.3s" } } },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, textTransform: "none", fontWeight: 600 } },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="colored"
        toastStyle={{ borderRadius: "12px", fontFamily: "Inter, sans-serif" }}
      />
    </ThemeProvider>
  </React.StrictMode>
);
