import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// MUI
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Banner de demo
function DemoBanner() {
  return (
    <Box
      sx={{
        bgcolor: "#FFF3CD",
        color: "#856404",
        p: 2,
        borderRadius: 2,
        mb: 3,
        border: "1px solid #FFEEBA",
      }}
    >
      <Typography variant="body1" fontWeight="bold">
        ⚠️ Esta es una aplicación demostrativa (proyecto personal). Los pedidos
        no son reales y no se piden datos sensibles.
      </Typography>
    </Box>
  );
}

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
    <Box sx={{ pb: { xs: 14, sm: 6 } }}>
      {/* Banner de demo */}
      <DemoBanner />

      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Tu Carrito
      </Typography>

      {loading && <Typography>Cargando carrito...</Typography>}
      {!loading && items.length === 0 && (
        <Typography>Tu carrito está vacío.</Typography>
      )}

      {/* Lista de productos */}
      {!loading &&
        items.map((it) => (
          <Card
            key={it.id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: 2,
              borderRadius: 3,
              boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
              transition: "all 0.3s",
              "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
            }}
          >
            {/* Imagen */}
            <CardMedia
              component="img"
              image={it.producto?.imagen}
              alt={it.producto?.nombre}
              sx={{
                width: { xs: "100%", sm: 120 },
                height: { xs: 180, sm: 120 },
                objectFit: "contain",
                bgcolor: "#fafafa",
                borderRadius: { xs: "12px 12px 0 0", sm: "12px 0 0 12px" },
                p: 1,
              }}
            />

            {/* Contenido */}
            <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
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
              </Box>
              <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                ${Number(it.subtotal || it.cantidad * it.producto?.precio).toFixed(2)}
              </Typography>
            </CardContent>

            {/* Controles */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                gap: 1,
              }}
            >
              {/* Botones cantidad */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => decrementar(it)}
                  sx={{
                    bgcolor: "#f5f5f5",
                    "&:hover": { bgcolor: "#e0e0e0" },
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  type="number"
                  size="small"
                  value={it.cantidad}
                  inputProps={{ min: 1 }}
                  onChange={(e) => {
                    const nuevaCantidad = Number(e.target.value);
                    if (nuevaCantidad >= 1) setCantidad(it.id, nuevaCantidad);
                  }}
                  sx={{
                    width: 60,
                    "& input": { textAlign: "center", fontWeight: "bold" },
                  }}
                />
                <IconButton
                  onClick={() => incrementar(it)}
                  sx={{
                    bgcolor: "#f5f5f5",
                    "&:hover": { bgcolor: "#e0e0e0" },
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              {/* Botón eliminar */}
              <IconButton
                onClick={() => eliminarItem(it.id)}
                sx={{
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(211,47,47,0.1)" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))}

      {/* Total y comprar */}
      {!loading && items.length > 0 && (
        <Box
          mt={3}
          sx={{
            textAlign: "right",
            position: { xs: "fixed", sm: "static" },
            bottom: { xs: 0, sm: "auto" },
            left: 0,
            right: 0,
            bgcolor: { xs: "white", sm: "transparent" },
            p: { xs: 2, sm: 0 },
            boxShadow: { xs: "0 -4px 12px rgba(0,0,0,0.15)", sm: "none" },
            borderTop: { xs: "1px solid #ddd", sm: "none" },
          }}
        >
          <Divider sx={{ mb: 2, display: { xs: "none", sm: "block" } }} />
          <Typography variant="h6" gutterBottom>
            Total: <strong>${total.toFixed(2)}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
              width: { xs: "100%", sm: "auto" },
              transition: "all 0.3s",
              fontWeight: "bold",
              borderRadius: 3,
              py: 1.2,
              "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
            }}
            onClick={comprar}
          >
            Finalizar compra
          </Button>
        </Box>
      )}
    </Box>
  );
}
