import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
// MUI
import { Container, Typography, Grid, Box } from "@mui/material";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando productos...</Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      {/* Banner de demo */}
      <Box
        sx={{
          bgcolor: "#FFF3CD", // Amarillo claro tipo alerta
          color: "#856404",
          p: 2,
          borderRadius: 2,
          mb: 3,
          border: "1px solid #FFEEBA",
        }}
      >
        <Typography variant="body1" fontWeight="bold">
          ⚠️ Esta es una aplicación demostrativa (proyecto personal mío). Los pedidos no son reales y no se piden datos sensibles.
        </Typography>
      </Box>

      {/* Título */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Productos
      </Typography>

      {/* Mensaje si no hay productos */}
      {productos.length === 0 && (
        <Typography>No hay productos disponibles.</Typography>
      )}

      {/* Grid de productos */}
      <Grid container spacing={3}>
        {productos.map((prod) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
            <ProductoCard producto={prod} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
