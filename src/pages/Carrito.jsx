import { useEffect } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Animaciones
import { motion, AnimatePresence } from "framer-motion";

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
  Skeleton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

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
    <Box sx={{ pb: { xs: 14, sm: 6 } }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🛒 Tu Carrito
      </Typography>

      {/* Loader */}
      {loading && (
        <Box>
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={120}
              sx={{ mb: 2, borderRadius: 2 }}
            />
          ))}
        </Box>
      )}

      {/* Carrito vacío */}
      {!loading && items.length === 0 && (
        <Typography>Tu carrito está vacío.</Typography>
      )}

      {/* Lista de items */}
      <AnimatePresence>
        {!loading &&
          items.map((it) => {
            const stock = it.producto?.stock ?? 0;

            return (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
                    "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={it.producto?.imagen || undefined}
                    alt={it.producto?.nombre}
                    sx={{
                      width: { xs: "100%", sm: 160 },
                      height: { xs: 200, sm: 160 },
                      objectFit: "contain",
                      borderRadius: { xs: "12px 12px 0 0", sm: "12px 0 0 12px" },
                      bgcolor: "#fafafa",
                      border: "1px solid #eee",
                      p: 1,
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />

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
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          px: 1.5,
                        }}
                      />
                      <Chip
                        label={`Stock: ${stock}`}
                        color={stock > 0 ? "info" : "default"}
                        sx={{ fontWeight: "bold" }}
                      />
                      {it.cantidad >= stock && (
                        <Chip label="Stock máximo" color="error" size="small" />
                      )}
                    </Box>
                  </CardContent>

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
                          if (
                            nuevaCantidad >= 1 &&
                            nuevaCantidad <= stock
                          ) {
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
                            bgcolor:
                              it.cantidad >= stock ? "#eee" : "#e0e0e0",
                          },
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <IconButton
                      onClick={() => {
                        eliminarItem(it.id);
                        toast.info("Producto eliminado 🗑️");
                      }}
                      sx={{
                        color: "error.main",
                        "&:hover": { bgcolor: "rgba(211,47,47,0.1)" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </motion.div>
            );
          })}
      </AnimatePresence>

      {/* Footer de compra */}
      {!loading && items.length > 0 && (
        <Box
          mt={3}
          sx={{
            textAlign: "right",
            position: { xs: "fixed", sm: "sticky" },
            bottom: { xs: 16, sm: "auto" },
            right: { xs: 16, sm: 0 },
            left: { xs: 16, sm: "auto" },
            bgcolor: { xs: "white", sm: "transparent" },
            p: { xs: 2, sm: 0 },
            boxShadow: { xs: "0 -4px 12px rgba(0,0,0,0.15)", sm: "none" },
            borderRadius: { xs: 3, sm: 0 },
            zIndex: 10,
          }}
        >
          <Divider sx={{ mb: 2, display: { xs: "none", sm: "block" } }} />
          <Typography variant="h6" gutterBottom>
            Total:{" "}
            <strong>
              ${total.toFixed(2)} <MonetizationOnIcon fontSize="small" />
            </strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ShoppingCartCheckoutIcon />}
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
