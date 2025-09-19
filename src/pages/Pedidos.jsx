import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    cargarPedidos(1);
  }, []);

  async function cargarPedidos(numPagina) {
    setLoading(true);
    try {
      const data = await getPedidos(access, numPagina);
      const pedidosConNumero = data.results.map((p, index) => ({
        ...p,
        numeroLocal: (numPagina - 1) * 10 + (index + 1),
      }));

      if (numPagina === 1) {
        setPedidos(pedidosConNumero);
      } else {
        setPedidos((prev) => [...prev, ...pedidosConNumero]);
      }

      setNextPage(data.next ? numPagina + 1 : null);
    } catch (err) {
      console.error("Error cargando pedidos", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading && pedidos.length === 0)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
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
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mis pedidos
      </Typography>

      {pedidos.map((p) => {
        const itemsPedido = p.items || p.detalles || [];
        return (
          <Card key={p.id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
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
                  {new Date(p.fecha_creacion).toLocaleString()}
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  Total: ${Number(p.total).toFixed(2)}
                </Typography>
              </Stack>

              {itemsPedido.length === 0 ? (
                <Typography>No hay productos en este pedido.</Typography>
              ) : (
                <List dense>
                  {itemsPedido.map((item, i) => (
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
                          primary={`${item.cantidad || 0} x ${
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
                      {i < itemsPedido.length - 1 && <Divider component="li" />}
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        );
      })}

      {nextPage && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => {
              setPage(nextPage);
              cargarPedidos(nextPage);
            }}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ver más"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
