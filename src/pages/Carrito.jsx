import { useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { crearPedido } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// MUI
import {
  Typography,
  Box,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

import CarritoItem from "../components/CarritoItem";
import { calcularSubtotal } from "../utils/carritoUtils";

export default function Carrito() {
  const theme = useTheme();
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

  // Calcular total con memo para evitar recalcular en cada render
  const total = useMemo(
    () => items.reduce((acc, it) => acc + calcularSubtotal(it), 0),
    [items]
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
      <Typography
  variant="h4"
  gutterBottom
  fontWeight="bold"
  align="center"   
  sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, color: "primary.main"  }}
>
  <ShoppingCartIcon color="primary" sx={{ fontSize: 36 }} />
  Tu Carrito
</Typography>

      {loading && <Typography>Cargando carrito...</Typography>}
      {!loading && items.length === 0 && (
        <Typography>Tu carrito está vacío.</Typography>
      )}

      {!loading &&
        items.map((it) => (
          <CarritoItem
            key={it.id}
            it={it}
            theme={theme}
            incrementar={incrementar}
            decrementar={decrementar}
            setCantidad={setCantidad}
            eliminarItem={eliminarItem}
          />
        ))}

      {!loading && items.length > 0 && (
        <Box
          mt={3}
          sx={{
            textAlign: "right",
            position: { xs: "fixed", sm: "static" },
            bottom: { xs: 0, sm: "auto" },
            left: 0,
            right: 0,
            bgcolor: { xs: theme.palette.background.paper, sm: "transparent" },
            p: { xs: 2, sm: 0 },
            boxShadow: { xs: "0 -4px 12px rgba(0,0,0,0.15)", sm: "none" },
            borderTop: { xs: "1px solid #ddd", sm: "none" },
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
