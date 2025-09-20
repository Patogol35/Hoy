import { useEffect, useState, useMemo } from "react";
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
  Divider,
  Box,
  Chip,
  Stack,
  Button,
} from "@mui/material";

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Página actual
  const [next, setNext] = useState(null); // URL de la siguiente página

  useEffect(() => {
    setLoading(true);
    getPedidos(access, page)
      .then((data) => {
        if (!data?.results) return;

        // Numerar pedidos sin reordenar ni recalcular toda la lista
        const startIndex = (page - 1) * 40; // PAGE_SIZE del backend (ajústalo si cambias PAGE_SIZE)
        const pedidosNumerados = data.results.map((p, i) => ({
          ...p,
          numeroLocal: startIndex + i + 1,
        }));

        setPedidos((prev) => [...prev, ...pedidosNumerados]);
        setNext(data.next);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access, page]);

  // Memorizar el renderizado de pedidos para evitar renders innecesarios
  const pedidosRender = useMemo(
    () =>
      pedidos.map((p) => (
        <Card
          key={p.id}
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
      )),
    [pedidos]
  );

  if (loading && pedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Cargando pedidos...</Container>;

  if (!loading && pedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Aún no tienes pedidos.</Container>;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Mis pedidos
      </Typography>

      {pedidosRender}

      {/* Botón “Ver más” */}
      {next && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => setPage((p) => p + 1)}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ver más"}
          </Button>
        </Box>
      )}

      {/* Feedback de carga incremental */}
      {loading && pedidos.length > 0 && (
        <Typography sx={{ textAlign: "center", mt: 2 }}>
          Cargando más pedidos...
        </Typography>
      )}
    </Container>
  );
                  }
