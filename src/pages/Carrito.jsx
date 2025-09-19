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
  Chip,
  Paper,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

// Banner de demo
function DemoBanner() {
  return (
    <Box
      sx={{
        bgcolor: "#FFF9E6",
        color: "#8A6D3B",
        p: 2,
        borderRadius: 2,
        mb: 4,
        border: "1px solid #FFECB3",
        textAlign: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
      }}
    >
      ⚠️ Esta es una aplicación demostrativa. Los pedidos no son reales.
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

  const incrementar = (it) => {
    const stock = it.producto?.stock ?? 0;
    if (it.cantidad < stock) {
      setCantidad(it.id, it.cantidad + 1);
    } else {
      toast.warning(`Solo hay ${stock} unidades disponibles`);
    }
  };

  const decrementar = (it) =>
    it.cantidad > 1 && setCantidad(it.id, it.cantidad - 1);

  return (
    <Box sx={{ pb: { xs: 16, sm: 6 } }}>
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
        items.map((it) => {
          const stock = it.producto?.stock ?? 0;

          return (
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
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
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
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip
                    icon={<MonetizationOnIcon />}
                    label={`$${Number(
                      it.subtotal || it.cantidad * it.producto?.precio
                    ).toFixed(2)}`}
                    color="success"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Chip
                    label={`Stock: ${stock} unidades`}
                    color={stock > 0 ? "info" : "default"}
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>
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
                    inputProps={{ min: 1, max: stock }}
                    onChange={(e) => {
                      const nuevaCantidad = Number(e.target.value);
                      if (nuevaCantidad >= 1 && nuevaCantidad <= stock) {
                        setCantidad(it.id, nuevaCantidad);
                      } else if (nuevaCantidad > stock) {
                        toast.warning(
                          `No puedes pedir más de ${stock} unidades`
                        );
                        setCantidad(it.id, stock);
                      }
                    }}
                    sx={{
                      width: 60,
                      "& input": {
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => incrementar(it)}
                    disabled={it.cantidad >= stock}
                    sx={{
                      bgcolor: it.cantidad >= stock ? "#eee" : "#f5f5f5",
                      "&:hover": {
                        bgcolor: it.cantidad >= stock ? "#eee" : "#e0e0e0",
                      },
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
          );
        })}

      {/* Total y comprar */}
      {!loading && items.length > 0 && (
        <>
          {/* Vista escritorio */}
          <Box
            mt={3}
            sx={{
              textAlign: "right",
              display: { xs: "none", sm: "block" },
            }}
          >
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Total:{" "}
              <strong>
                ${total.toFixed(2)} <MonetizationOnIcon fontSize="small" />
              </strong>
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{
                borderRadius: 50,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
                background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #43A047, #1B5E20)",
                  transform: "translateY(-2px) scale(1.03)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                },
              }}
              onClick={comprar}
            >
              <MonetizationOnIcon sx={{ fontSize: "1.5rem" }} />
              Finalizar compra
            </Button>
          </Box>

          {/* Vista móvil fija abajo */}
          <Paper
            elevation={12}
            sx={{
              display: { xs: "flex", sm: "none" },
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              bgcolor: "white",
              borderTop: "1px solid #ddd",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              ${total.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{
                flex: 1,
                ml: 2,
                borderRadius: 50,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #43A047, #1B5E20)",
                  transform: "scale(1.03)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
                },
              }}
              onClick={comprar}
            >
              Finalizar
            </Button>
          </Paper>
        </>
      )}
    </Box>
  );
}
