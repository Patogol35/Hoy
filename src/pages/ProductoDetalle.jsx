import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Stack } from "@mui/material";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";

export default function ProductoDetalle() {
  const { state } = useLocation();
  const producto = state?.producto;
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

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
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        ← Regresar a productos
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f5f5f5",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            }}
          >
            <Box
              component="img"
              src={producto.imagen}
              alt={producto.nombre}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight="bold">
              {producto.nombre}
            </Typography>
            <Typography variant="h5" color="primary">
              ${producto.precio}
            </Typography>
            <Typography variant="body1">{producto.descripcion}</Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleAdd}
              sx={{
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.05)", boxShadow: "0 6px 15px rgba(0,0,0,0.2)" },
              }}
            >
              Agregar al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
