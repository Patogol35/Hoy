import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import {
  Card,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
} from "@mui/material";

export default function ProductoCard({ producto }) {
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const onAdd = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión para agregar productos 🛒");
      navigate("/login");
      return;
    }
    try {
      await agregarAlCarrito(producto.id, 1);
      toast.success(`"${producto.nombre}" agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 300,
        borderRadius: 4,
        boxShadow: 4,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: 12,
        },
      }}
    >
      {/* Imagen con efecto zoom */}
      <Box sx={{ width: "100%", height: 220, overflow: "hidden", position: "relative" }}>
        <CardMedia
          component="img"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
        {/* Badge NUEVO */}
        {producto.nuevo && (
          <Chip
            label="Nuevo"
            color="secondary"
            size="small"
            sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
          />
        )}
      </Box>

      {/* Contenido visible siempre */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary" fontWeight="bold">
          ${producto.precio}
        </Typography>

        {/* Botones con efectos */}
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexDirection: "column" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={onAdd}
          >
            Agregar 🛒
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
            }}
            onClick={() =>
              navigate(`/producto/${producto.id}`, { state: { producto } })
            }
          >
            Ver más 🔎
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

