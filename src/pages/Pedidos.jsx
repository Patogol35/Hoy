import { useEffect, useState } from "react";
import { getPedidos } from "../api/api";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  Button,
} from "@mui/material";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // 🔹 mostrar 5 pedidos al inicio

  useEffect(() => {
    const cargar = async () => {
      const data = await getPedidos();
      const pedidosConNumero = data
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map((pedido, index) => ({
          ...pedido,
          numeroLocal: index + 1,
        }));
      setPedidos(pedidosConNumero);
    };
    cargar();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Mis Pedidos
      </Typography>
      {pedidos.length === 0 ? (
        <Typography>Aún no tienes pedidos.</Typography>
      ) : (
        pedidos.slice(0, visibleCount).map((pedido) => (
          <Card key={pedido.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Pedido #{pedido.numeroLocal}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Fecha: {new Date(pedido.fecha).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 1 }} />
              {pedido.detalles.map((detalle) => (
                <Box
                  key={detalle.id}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Typography>
                    {detalle.producto.nombre} (x{detalle.cantidad})
                  </Typography>
                  <Typography>${detalle.subtotal}</Typography>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Typography variant="h6">
                Total: ${pedido.total}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      {/* 🔹 Botón para cargar más pedidos */}
      {visibleCount < pedidos.length && (
        <Box textAlign="center" mt={2}>
          <Button
            variant="outlined"
            onClick={() => setVisibleCount((prev) => prev + 5)}
          >
            Ver más
          </Button>
        </Box>
      )}
    </Container>
  );
}
