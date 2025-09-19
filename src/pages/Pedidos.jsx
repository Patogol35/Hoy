import { useEffect, useState } from "react";
import { getPedidos, crearPedido } from "../api/api";
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
  const [nextPage, setNextPage] = useState(null);

  // 🔹 Función para ordenar y numerar pedidos
  const numerarPedidos = (lista) => {
    const ordenados = [...lista].sort(
      (a, b) => new Date(b.fecha) - new Date(a.fecha)
    );
    return ordenados.map((p, index) => ({
      ...p,
      numeroUsuario: ordenados.length - index,
    }));
  };

  // 🔹 Cargar pedidos iniciales (primera página)
  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const data = await getPedidos(access); // trae la primera página
        setPedidos(numerarPedidos(data.results ?? []));
        setNextPage(data.next || null);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [access]);

  // 🔹 Cargar página siguiente (paginación)
  const cargarMasPedidos = async () => {
    if (!nextPage) return;

    try {
      const data = await getPedidos(access, nextPage);
      const combinados = [...pedidos, ...(data.results ?? [])];
      setPedidos(numerarPedidos(combinados));
      setNextPage(data.next || null);
    } catch (err) {
      console.error("Error cargando más pedidos:", err);
    }
  };

  // 🔹 Agregar un pedido nuevo inmediatamente
  const agregarNuevoPedido = async () => {
    try {
      const nuevoPedido = await crearPedido(access);
      // Insertamos al inicio y recalculamos la numeración
      setPedidos(prev => numerarPedidos([nuevoPedido, ...prev]));
    } catch (err) {
      console.error("Error al crear pedido:", err);
    }
  };

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando pedidos...</Typography>
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
                Pedido #{p.numeroUsuario}
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

      {nextPage && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={cargarMasPedidos}>
            Ver más
          </Button>
        </Box>
      )}
    </Container>
  );
}
