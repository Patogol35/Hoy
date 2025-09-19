        import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5); // mostrar solo 5 al inicio

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      if (!token) {
        setError("⚠️ No tienes sesión activa.");
        setPedidos([]);
        return;
      }

      let data = await getPedidos(token);

      // 🔹 Forzar a array si el backend devuelve objeto o null
      if (!Array.isArray(data)) {
        data = data ? [data] : [];
      }

      // ordenar por fecha descendente
      const ordenados = [...data].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      // agregar número relativo local
      const pedidosNumerados = ordenados.map((p, index) => ({
        ...p,
        numeroLocal: ordenados.length - index,
      }));

      setPedidos(pedidosNumerados);
    } catch (err) {
      setError(err.message || "Error al cargar pedidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
        <Typography align="center">Cargando pedidos...</Typography>
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );

  if (pedidos.length === 0)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Aún no tienes pedidos.</Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Mis pedidos
        </Typography>
        <Button variant="outlined" onClick={fetchPedidos}>
          Actualizar
        </Button>
      </Stack>

      {pedidos.slice(0, visibleCount).map((p) => (
        <Card
          key={p.id || p.numeroLocal}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 3,
            transition: "all 0.3s",
            "&:hover": { boxShadow: 6, transform: "scale(1.01)" },
          }}
        >
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
              sx={{ mb: 1 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Pedido #{p.numeroLocal}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(p.fecha).toLocaleString()}
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                Total: ${Number(p.total).toFixed(2)}
              </Typography>
            </Stack>

            <List dense>
              {(p.items ?? p.detalles)?.map((item, i, arr) => (
                <Box key={i}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                      py: 1,
                    }}
                  >
                    <ListItemText
                      primary={`${item.cantidad} x ${
                        item.producto?.nombre ?? "Producto"
                      } — $${Number(
                        item.precio_unitario ?? item.producto?.precio ?? 0
                      ).toFixed(2)}`}
                      secondary={`Subtotal: $${Number(
                        item.subtotal ?? 0
                      ).toFixed(2)}`}
                    />
                    {item.estado && (
                      <Chip
                        label={item.estado}
                        color={
                          item.estado === "Entregado"
                            ? "success"
                            : item.estado === "En preparación"
                            ? "warning"
                            : "error"
                        }
                        size="small"
                        sx={{ mt: { xs: 1, sm: 0 } }}
                      />
                    )}
                  </ListItem>
                  {i < arr.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      {visibleCount < pedidos.length && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            Ver más
          </Button>
        </Box>
      )}
    </Container>
  );
}
