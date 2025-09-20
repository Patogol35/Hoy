import { useEffect, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // página actual
  const [next, setNext] = useState(null); // url de la siguiente página

  const cargarPedidos = useCallback(() => {
    if (!access) return;
    setLoading(true);

    getPedidos(access, page)
      .then((data) => {
        if (!data?.results) return;

        // Asignamos numeroLocal incremental sin reordenar
        const pedidosConNumero = data.results.map((p, idx) => ({
          ...p,
          numeroLocal: pedidos.length + idx + 1,
        }));

        setPedidos((prev) => [...prev, ...pedidosConNumero]);
        setNext(data.next);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access, page, pedidos.length]);

  // Cargar pedidos al montar y al cambiar la página
  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  if (loading && pedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Cargando pedidos...</Container>;

  if (pedidos.length === 0)
    return <Container sx={{ mt: 4 }}>Aún no tienes pedidos.</Container>;

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h5" gutterBottom>
        Mis pedidos
      </Typography>

      {pedidos.map((p) => (
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
    </Container>
  );
}
