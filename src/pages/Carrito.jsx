  import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  const { items, cargarCarrito, loading, limpiarLocal, setCantidad, eliminarItem } = useCarrito();
  const { access } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const total = items.reduce(
    (acc, it) => acc + Number(it.subtotal || it.cantidad * (it.producto?.precio || 0)),
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
  const decrementar = (it) => it.cantidad > 1 && setCantidad(it.id, it.cantidad - 1);

  return (
    <Container sx={{ mt: 4, mb: { xs: 12, sm: 6 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Carrito
      </Typography>

      {loading && <Typography>Cargando carrito...</Typography>}
      {!loading && items.length === 0 && <Typography>Tu carrito está vacío.</Typography>}

      {!loading &&
        items.map((it) => (
          <Card
            key={it.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
              borderRadius: 3,
              boxShadow: 3,
              transition: "all 0.3s",
              "&:hover": { boxShadow: 8, transform: "scale(1.01)" },
            }}
          >
            <CardMedia
              component="img"
              image={it.producto?.imagen_url}
              alt={it.producto?.nombre}
              sx={{
                width: { xs: "100%", sm: 150 },
                height: { xs: 180, sm: 150 },
                objectFit: "cover",
                borderRadius: { xs: "8px 8px 0 0", sm: "8px 0 0 8px" },
              }}
            />

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
                    "&:hover": { backgroundColor: "#e0e0e0", transform: "scale(1.1)" },
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
                    "&:hover": { backgroundColor: "#e0e0e0", transform: "scale(1.1)" },
                    transition: "all 0.2s",
                  }}
                >
                  +
                </Button>

                <Button
                  onClick={() => eliminarItem(it.id)}
                  variant="contained"
                  color="error"
                  sx={{
                    minWidth: 40,
                    fontWeight: "bold",
                    ml: 1,
                    "&:hover": { backgroundColor: "#d32f2f", transform: "scale(1.1)" },
                    transition: "all 0.2s",
                  }}
                >
                  X
                </Button>
              </Box>
            </Box>
          </Card>
        ))}

      {!loading && items.length > 0 && (
        <Box
          sx={{
            textAlign: "right",
            position: { xs: "fixed", sm: "static" },
            bottom: { xs: 0, sm: "auto" },
            left: 0,
            right: 0,
            bgcolor: { xs: "white", sm: "transparent" },
            p: { xs: 2, sm: 0 },
            boxShadow: { xs: "0 -4px 10px rgba(0,0,0,0.1)", sm: "none" },
            display: "flex",
            justifyContent: { xs: "space-between", sm: "flex-end" },
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              width: { xs: "45%", sm: "auto" },
              transition: "all 0.3s",
              fontWeight: "bold",
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
