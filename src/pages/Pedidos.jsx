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
      <Container sx={{ mt: 4 }}>
        <Typography>Cargando pedidos...</Typography>
      </Container>
    );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mis pedidos
      </Typography>

      {pedidos.length === 0 && (
        <Typography>Aún no tienes pedidos.</Typography>
      )}

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
            <Typography variant="h6" fontWeight="bold">
              Pedido #{p.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fecha: {new Date(p.fecha).toLocaleString()}
            </Typography>
            <Typography variant="body1" color="primary" sx={{ mb: 2 }}>
              Total: ${Number(p.total).toFixed(2)}
            </Typography>

            <List dense>
              {p.items?.map((item, i) => (
                <Box key={i}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <ListItemText
                      primary={`${item.cantidad} x ${item.producto?.nombre} — $${Number(
                        item.precio_unitario
                      ).toFixed(2)}`}
                      secondary={`Subtotal: $${Number(item.subtotal).toFixed(2)}`}
                    />
                    {item.estado && (
                      <Chip
                        label={item.estado}
                        color={
                          item.estado === "Entregado"
                            ? "success"
                            : item.estado === "En preparación"
                            ? "warning"
                            : "default"
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
