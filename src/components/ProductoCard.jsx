import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import { Card, CardMedia, CardContent, CardActions, Typography, Button } from "@mui/material";

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
        maxWidth: 320,
        borderRadius: 3,
        boxShadow: 4,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 6,
        },
      }}
    >
      {producto.imagen_url && (
        <CardMedia
          component="img"
          height="200"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{
            objectFit: "cover",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom noWrap>
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${producto.precio}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "secondary.main",
            "&:hover": { bgcolor: "secondary.dark" },
          }}
          onClick={onAdd}
        >
          Agregar al carrito
        </Button>
      </CardActions>
    </Card>
  );
}
