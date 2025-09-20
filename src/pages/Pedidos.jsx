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
  Divider,
  Box,
  Chip,
  Stack,
  Button,
} from "@mui/material";

const PAGE_SIZE = 10; // 👈 cantidad de pedidos por página

export default function Pedidos() {
  const { access } = useAuth();
  const [allPedidos, setAllPedidos] = useState([]); // todos los pedidos
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // página actual

  useEffect(() => {
    setLoading(true);
    getPedidos(access) // ⚡️ trae todos los pedidos
      .then((data) => {
        if (!data?.results) return;

        // ordenar por fecha descendente (recientes primero)
        const ordenados = [...data.results].sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );

        // numerarlos de forma global (más reciente = número mayor)
        const pedidosNumerados = ordenados.map((p, index) => ({
          ...p,
          numeroLocal: ordenados.length - index,
        }));

        setAllPedidos(pedidosNumerados);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access]);

  // calcular pedidos visibles según la página
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pedidosVisibles = allPedidos.slice(startIndex, endIndex);

  const totalPages = Math.ceil(allPedidos.length / PAGE_SIZE);

  if (loading && allPedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Cargando pedidos...</Container>;

  if (allPedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Aún no tienes pedidos.</Container>;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Mis pedidos
      </Typography>

      {pedidosVisibles.map((p) => (
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
      ))}

      {/* Controles de paginación */}
      <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </Button>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Página {page} de {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Siguiente
        </Button>
      </Stack>
    </Container>
  );
                        }
