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
  CardContent,
  CardActions,
  IconButton,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {it.producto?.nombre}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton onClick={() => decrementar(it)}>
                      <Remove />
                    </IconButton>

                    <TextField
                      type="number"
                      size="small"
                      value={it.cantidad}
                      inputProps={{ min: 1 }}
                      onChange={(e) => {
                        const nuevaCantidad = Number(e.target.value);
                        if (nuevaCantidad >= 1)
                          setCantidad(it.id, nuevaCantidad);
                      }}
                      sx={{ width: 70 }}
                    />

                    <IconButton onClick={() => incrementar(it)}>
                      <Add />
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="body1" color="primary">
                    ${Number(
                      it.subtotal || it.cantidad * it.producto?.precio
                    ).toFixed(2)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <IconButton
                    color="error"
                    onClick={() => eliminarItem(it.id)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
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
            onClick={comprar}
          >
            Comprar
          </Button>
        </Box>
      )}
    </Container>
  );
}