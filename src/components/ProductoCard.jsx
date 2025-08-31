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
        borderRadius: 3,
        boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        },
        bgcolor: "white",
      }}
    >
      {/* Imagen con altura fija */}
      <Box
        sx={{
          width: "100%",
          height: 220,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <CardMedia
          component="img"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.05)" },
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
              bgcolor: "secondary.main",
              color: "white",
              fontWeight: "bold",
            }}
          />
        )}
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ lineHeight: 1.3, minHeight: 56 }}
        >
          {producto.nombre}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: 40,
          }}
        >
          {producto.descripcion}
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          fontWeight="bold"
          sx={{ mt: 1 }}
        >
          ${producto.precio}
        </Typography>

        {/* Botones */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
              },
              transition: "all 0.3s ease",
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
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() =>
              navigate(`/producto/${producto.id}`, { state: { producto } })
            }
          >
            Ver detalles 🔍
          </Button>
        </Box>
      </Box>
    </Card>
  );
    }
