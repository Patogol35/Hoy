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
} from "@mui/material";

const ESTADOS = ["Todos", "Entregado", "En preparación", "Cancelado"];

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    getPedidos(access)
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access]);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );

  const pedidosFiltrados =
    filtro === "Todos"
      ? pedidos
      : pedidos.filter((p) =>
          p.items.some((i) => i.estado === filtro)
        );

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mis pedidos
      </Typography>

      {/* Filtro por estado */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
        {ESTADOS.map((e) => (
          <Button
            key={e}
            variant={filtro === e ? "contained" : "outlined"}
            color={filtro === e ? "primary" : "inherit"}
            size="small"
            onClick={() => setFiltro(e)}
            sx={{ textTransform: "none" }}
          >
            {e}
          </Button>
        ))}
      </Stack>

      {pedidosFiltrados.length === 0 && (
        <Typography>No hay pedidos para este filtro.</Typography>
      )}

      {pedidosFiltrados.map((p) => (
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
                Pedido #{p.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(p.fecha).toLocaleString()}
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                Total: ${Number(p.total).toFixed(2)}
              </Typography>
            </Stack>

            <List dense>
              {p.items?.map((item, i) => (
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
                      primary={`${item.cantidad} x ${item.producto?.nombre} — $${Number(
                        item.precio_unitario
                      ).toFixed(2)}`}
                      secondary={`Subtotal: $${Number(item.subtotal).toFixed(
                        2
                      )}`}
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
                  {i < p.items.length - 1 && <Divider component="li" />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
