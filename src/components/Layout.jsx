import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Navbar from "./Navbar"; // ajusta la ruta a tu Navbar
import { Outlet } from "react-router-dom";

export default function Layout() {
  const theme = useTheme();

  return (
    <Box>
      {/* Navbar fijo */}
      <Navbar />

      {/* Contenido principal con ajuste dinámico */}
      <Container
        sx={{
          pt: `calc(${theme.mixins.toolbar.minHeight}px + 16px)`,
          pb: 4,
        }}
      >
        {/* Aquí se renderizan tus páginas */}
        <Outlet />
      </Container>
    </Box>
  );
}
