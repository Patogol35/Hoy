import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
// MUI
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
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
        maxWidth: 300,
        borderRadius: 3,
        boxShadow: 3,
        m: 2,
      }}
    >
      {producto.imagen_url && (
        <CardMedia
          component="img"
          height="200"
          image={producto.imagen_url}
          alt={producto.nombre}
          sx={{ objectFit: "cover" }}
        />
      )}

      <CardContent>
        <Typography variant="h6" gutterBottom>
          {producto.nombre}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {producto.descripcion}
        </Typography>
        <Typography variant="h6" color="primary">
          ${producto.precio}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onAdd}
        >
          Agregar al carrito
        </Button>
      </CardActions>
    </Card>
  );
}