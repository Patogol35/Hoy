import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Container
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Container>
    );
  return (
    <Container
      sx={{
        mt: 6,
        mb: 6,
        // ⬇️ Esto asegura que el contenido arranque debajo del AppBar
        ...theme.mixins.toolbar,
      }}
    >
      {/* Banner demo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            bgcolor: "#FFF9E6",
            color: "#8A6D3B",
            p: 2,
            borderRadius: 2,
            mb: 4,
            border: "1px solid #FFECB3",
            textAlign: "center",
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            ⚠️ Esta es una aplicación demostrativa. Los pedidos no son reales y
            no se solicitan datos sensibles.
          </Typography>
        </Box>
      </motion.div>
      {/* Título */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          🛍️ Productos
        </Typography>
        <Divider
          sx={{
            width: 80,
            mx: "auto",
            borderBottomWidth: 3,
            borderColor: "primary.main",
            borderRadius: 2,
          }}
        />
      </Box>
      {/* Mensaje si no hay productos */}
      {productos.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            color: "text.secondary",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
          <Typography variant="h6">No hay productos disponibles.</Typography>
        </Box>
      )}
      {/* Grid de productos */}
      <Grid container spacing={3}>
        {productos.map((prod, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductoCard producto={prod} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
