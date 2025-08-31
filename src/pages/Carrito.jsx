import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// MUI
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  TextField,
} from "@mui/material";

export default function Carrito() {
  const {
    items,
    cargarCarrito,
    loading,
    limpiarLocal,
    setCantidad,
    eliminarItem,
  } = useCarrito();
  const { access } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const total = items.reduce(
    (acc, it) =>
      acc + Number(it.subtotal || it.cantidad * (it.producto?.precio || 0)),
    0
  );

  const comprar = async () => {
    try {
      const res = await crearPedido(access);
      if (res?.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Pedido realizado ✅");
      limpiarLocal();
      navigate("/pedidos");
    } catch (e) {
      toast.error(e.message || "Ocurrió un error en la compra");
    }
  };

  const incrementar = (it) => setCantidad(it.id, it.cantidad + 1);
  const decrementar = (it) =>
    it.cantidad > 1 && setCantidad(it.id, it.cantidad - 1);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carrito
      </Typography>

      {loading && <Typography>Cargando carrito...</Typography>}
      {!loading && items.length === 0 && (
        <Typography>Tu carrito está vacío.</Typography>
      )}

      {!loading &&
        items.map((it) => (
          <Card
            key={it.id}
            sx={{
              display: "flex",
              mb: 2,
              borderRadius: 3,
              boxShadow: 3,
              transition: "all 0.3s",
              "&:hover": { boxShadow: 8, transform: "scale(1.01)" },
            }}
          >
            {/* Imagen */}
            <CardMedia
              component="img"
              image={it.producto?.imagen_url}
              alt={it.producto?.nombre}
              sx={{
                width: { xs: 100, sm: 150 },
                height: { xs: 100, sm: 150 },
                objectFit: "cover",
                borderRadius: "8px 0 0 8px",
              }}
            />

            {/* Contenido */}
            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                {it.producto?.nombre}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  mb: 1,
                }}
              >
                {it.producto?.descripcion}
              </Typography>

              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                ${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}
              </Typography>
            </CardContent>

            {/* Controles */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  onClick={() => decrementar(it)}
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: 30,
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  -
                </Button>
                <TextField
                  type="number"
                  size="small"
                  value={it.cantidad}
                  inputProps={{ min: 1 }}
                  onChange={(e) => {
                    const nuevaCantidad = Number(e.target.value);
                    if (nuevaCantidad >= 1) setCantidad(it.id, nuevaCantidad);
                  }}
                  sx={{ width: 60, "& input": { textAlign: "center" } }}
                />
                <Button
                  onClick={() => incrementar(it)}
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: 30,
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  +
                </Button>
                {/* Botón eliminar a la derecha */}
                <Button
                  onClick={() => eliminarItem(it.id)}
                  variant="contained"
                  color="error"
                  sx={{
                    minWidth: 40,
                    fontWeight: "bold",
                    ml: 1,
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  ✖️
                </Button>
              </Box>
            </Box>
          </Card>
        ))}

      {!loading && items.length > 0 && (
        <Box mt={3} textAlign="right">
          <Typography variant="h6" gutterBottom>
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={comprar}
          >
            Comprar
          </Button>
        </Box>
      )}
    </Container>
  );
}
