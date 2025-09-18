import { useEffect, useState } from "react";
import { getProductos } from "../api/api";
import ProductoCard from "../components/ProductoCard";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  Divider,
  TextField,
  Stack,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("asc"); // ordenamiento
  const [search, setSearch] = useState(""); // búsqueda
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    getProductos()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // debounce para no filtrar en cada tecla
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Filtrado y ordenamiento
  const filtered = productos
    .filter((p) =>
      debouncedSearch === ""
        ? true
        : p.nombre.toLowerCase().includes(debouncedSearch)
    )
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  if (loading)
    return (
      <Box
        sx={{
          mt: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={50} color="primary" />
      </Box>
    );

  return (
    <>
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

      {/* Encabezado */}
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
            mb: 3,
          }}
        />

        {/* Buscador y ordenamiento */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            placeholder="Buscar producto..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: "100%", sm: 250 } }}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sort}
              label="Ordenar por"
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="desc">Precio: mayor a menor</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Mensaje si no hay productos */}
      {filtered.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            mt: 8,
            color: "text.secondary",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
          <Typography variant="h6">No se encontraron productos.</Typography>
        </Box>
      )}

      {/* Grid de productos */}
      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {filtered.map((prod, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={prod.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <ProductoCard producto={prod} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </>
  );
}


