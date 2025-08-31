import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import {
  Card,
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
        boxShadow: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        },
      }}
    >
      {/* Imagen */}
      <Box
        sx={{
          position: "relative",
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          overflow: "hidden",
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
            transition: "transform 0.5s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />

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
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {producto.nombre}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexGrow: 1,
            mb: 2,
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

        <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
          ${producto.precio}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: 2,
              textTransform: "none",
              py: 1,
              fontWeight: "bold",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
              },
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
              py: 1,
              fontWeight: "medium",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
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
          
