import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
// MUI
import { Container, Typography, Grid } from "@mui/material";

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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Productos
      </Typography>

      {productos.length === 0 && (
        <Typography>No hay productos disponibles.</Typography>
      )}

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