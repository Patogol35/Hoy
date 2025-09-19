import { useState, useEffect } from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Stack,
  Button,
} from "@mui/material";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Pedidos() {
  const { access } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0); // 👈 total de pedidos

  useEffect(() => {
    getPedidos(access, page)
      .then((data) => {
        if (!data) return;
        setPedidos((prev) => [...prev, ...data.results]);
        setHasMore(!!data.next);
        setTotalCount(data.count); // 👈 guardamos total
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [access, page]);

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!pedidos.length) {
    return (
      <Typography align="center" variant="h6" mt={4}>
        No tienes pedidos realizados todavía.
      </Typography>
    );
  }

  return (
    <Box mt={4} px={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Mis Pedidos
      </Typography>

      <Stack spacing={2}>
        {pedidos.map((pedido, index) => {
          // 👇 número correcto (del más nuevo al más viejo)
          const numero = totalCount - (index + (page - 1) * 5);
          return <PedidoCard key={pedido.id} pedido={pedido} numero={numero} />;
        })}
      </Stack>

      {hasMore && (
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => setPage((prev) => prev + 1)}>
            Ver más
          </Button>
        </Box>
      )}
    </Box>
  );
}
