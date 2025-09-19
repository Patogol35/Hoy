import { Box, Container } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const theme = useTheme();

  return (
    <Box>
      <Navbar />
      <Container
        sx={{
          pt: `calc(${theme.mixins.toolbar.minHeight}px + 16px)`,
          pb: 4,
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}
