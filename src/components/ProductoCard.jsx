import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import {
  Card,
  CardMedia,
  CardContent,
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        boxShadow: 4,
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 10,
        },
      }}
    >
      {/* Contenedor imagen */}
      <Box
        sx={{
          width: "100%",
          height: 220,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
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
            objectPosition: "center",
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
        {producto.nuevo && (
          <Chip
            label="Nuevo"
            color="secondary"
            size="small"
            sx={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
          />
        )}
      </Box>

      {/* Contenedor contenido */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {producto.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {producto.descripcion}
          </Typography>

          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            ${producto.precio}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              navigate(`/producto/${producto.id}`, { state: { producto } })
            }
          >
            Ver más
          </Button>
          <Button variant="contained" fullWidth onClick={onAdd}>
            Agregar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
