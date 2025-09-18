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
} from "@mui/material";

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPedidos(access)
      .then(setPedidos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [access]);

  if (loading)
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
        🛒 Mis pedidos
      </Typography>

      {pedidos.length === 0 && (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
          Aún no tienes pedidos.
        </Typography>
      )}

      {pedidos.map((p) => (
        <Card
          key={p.id}
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 3,
            transition: "all 0.3s",
            "&:hover": { boxShadow: 8, transform: "scale(1.01)" },
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Pedido #{p.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(p.fecha).toLocaleString()}
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Total: ${Number(p.total).toFixed(2)}
            </Typography>

            <List dense>
              {p.items?.map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    bgcolor: i % 2 === 0 ? "rgba(25, 118, 210,0.05)" : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    p: 1,
                  }}
                >
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography fontWeight="bold">
                          {item.cantidad} x {item.producto?.nombre} — $
                          {Number(item.precio_unitario).toFixed(2)}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Subtotal: ${Number(item.subtotal).toFixed(2)}
                        </Typography>
                      }
                    />
                    <Chip
                      label={item.estado || "Pendiente"}
                      color={item.estado === "Entregado" ? "success" : "warning"}
                      size="small"
                    />
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
