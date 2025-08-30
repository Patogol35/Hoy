import { Grid, Box } from "@mui/material";
import ProductoCard from "./ProductoCard";

export default function ListaProductos({ productos }) {
  return (
    <Box sx={{ p: 2, maxWidth: "1300px", mx: "auto" }}>
      <Grid container spacing={3} justifyContent="center">
        {productos.map((producto) => (
          <Grid
            item
            key={producto.id}
            xs={12}    // móvil: 1 columna
            sm={6}     // tablet: 2 columnas
            md={4}     // desktop pequeño: 3 columnas
            lg={3}     // desktop grande: 4 columnas
          >
            <ProductoCard producto={producto} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
