import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";
// MUI
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
  const { access } = useAuth(); // token de acceso
  const [pedidos, setPedidos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPedidos = async (pagina = 1) => {
    if (!access) return;
    setLoading(true);
    setError("");
    try {
      const data = await getPedidos(access, pagina);
      setPedidos(data.results || []); // DRF paginated
      const pages = Math.ceil(data.count / 10); // asume 10 por página
      setTotalPages(pages);
      setPage(pagina);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError(err.message || "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📦 Mis Pedidos
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && pedidos.length === 0 && !error && (
        <Typography>No tienes pedidos registrados.</Typography>
      )}

      {!loading && pedidos.length > 0 && (
        <List>
          {pedidos.map((pedido) => (
            <Card key={pedido.id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem disableGutters>
                  <ListItemText
                    primary={`Pedido #${pedido.id}`}
                    secondary={`Fecha: ${new Date(
                      pedido.fecha
                    ).toLocaleString()}`}
                  />
                  <Chip
                    label={pedido.estado}
                    color={
                      pedido.estado === "ENTREGADO" ? "success" : "primary"
                    }
                  />
                </ListItem>
                <Divider />
                <Box mt={1}>
                  <Typography variant="body2">
                    Total: ${pedido.total}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </List>
      )}

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <Stack
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            disabled={page === 1 || loading}
            onClick={() => fetchPedidos(page - 1)}
          >
            Anterior
          </Button>
          <Typography align="center" sx={{ mt: 1 }}>
            Página {page} de {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={page === totalPages || loading}
            onClick={() => fetchPedidos(page + 1)}
          >
            Siguiente
          </Button>
        </Stack>
      )}
    </Container>
  );
            }
