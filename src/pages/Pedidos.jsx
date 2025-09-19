import { useEffect, useState } from "react";
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
import { BASE_URL } from "../api/api"; // 👈 asegúrate de exportar BASE_URL en api.js
import { authFetch } from "../api/api"; // 👈 si authFetch no lo exportas, copia su lógica aquí

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [nextUrl, setNextUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 función para cargar pedidos (primera vez o siguientes páginas)
  const cargarPedidos = async (url = `${BASE_URL}/pedidos/`) => {
    setLoading(true);
    try {
      const data = await authFetch(url, { method: "GET" }, access);
      if (!data || !data.results) return;

      // ⚡ pedidos vienen ordenados del backend con order_by('-fecha')
      const pedidosNumerados = data.results.map((p, index) => ({
        ...p,
        numeroLocal: pedidos.length + data.results.length - index,
      }));

      // acumulamos pedidos
      setPedidos((prev) => [...prev, ...pedidosNumerados]);
      setNextUrl(data.next); // guardamos la URL de la siguiente página
    } catch (err) {
      console.error("Error cargando pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 cargar la primera página al montar
  useEffect(() => {
    if (access) {
      setPedidos([]); // reset si cambia usuario
      cargarPedidos();
    }
  }, [access]);

  if (loading && pedidos.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );
  }

  if (!loading && pedidos.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Aún no tienes pedidos.</Typography>
      </Container>
    );
  }

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

      {/* 🔹 Botón para cargar más pedidos si hay siguiente página */}
      {nextUrl && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => cargarPedidos(nextUrl)}>
            Ver más
          </Button>
        </Box>
      )}
    </Container>
  );
}
