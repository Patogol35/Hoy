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
  Divider,
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
      toast.success(`${producto.nombre} agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 320,
        borderRadius: 3,
        boxShadow: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 12,
        },
      }}
    >
      {/* Imagen */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{
            height: 220,
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.07)" },
          }}
        />

        {/* Badge NUEVO */}
        {producto.nuevo && (
          <Chip
            label="Nuevo"
            color="secondary"
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              fontWeight: "bold",
              bgcolor: "secondary.main",
              color: "white",
            }}
          />
        )}
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, color: "text.primary" }}
        >
          {producto.nombre}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            mb: 2,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {producto.descripcion}
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          ${producto.precio}
        </Typography>

        {/* Botones */}
        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              py: 1,
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={onAdd}
          >
            Agregar al carrito 🛒
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "medium",
              py: 1,
              "&:hover": { transform: "scale(1.05)", boxShadow: 3 },
            }}
            onClick={() =>
              navigate(`/producto/${producto.id}`, { state: { producto } })
            }
          >
            Ver detalles 🔎
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
