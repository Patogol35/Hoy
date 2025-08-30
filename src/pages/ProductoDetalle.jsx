import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Stack } from "@mui/material";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";

export default function ProductoDetalle() {
  const { state } = useLocation();
  const producto = state?.producto;
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate(); // 🔥 para regresar

  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const handleAdd = async () => {
    try {
      await agregarAlCarrito(producto.id, 1);
      toast.success(`"${producto.nombre}" agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      {/* Botón regresar */}
      <Button
        variant="outlined"
        sx={{ mb: 3 }}
        onClick={() => navigate(-1)} // 🔥 vuelve a la página anterior
      >
        ← Regresar a productos
      </Button>

      <Grid container spacing={4}>
        {/* Imagen más grande */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={producto.imagen_url}
            alt={producto.nombre}
            sx={{
              width: "100%",
              height: 400,          // más grande que la card
              objectFit: "cover",   // recorta para mantener proporción
              objectPosition: "center",
              borderRadius: 3,
              boxShadow: 3,
            }}
          />
        </Grid>

        {/* Detalles */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              {producto.nombre}
            </Typography>
            <Typography variant="h5" color="primary">
              ${producto.precio}
            </Typography>
            <Typography variant="body1">
              {producto.descripcion}
            </Typography>
            <Button variant="contained" size="large" onClick={handleAdd}>
              Agregar al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}


