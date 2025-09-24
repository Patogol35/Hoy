// src/pages/Home.jsx
import { useState } from "react";
import { getCategorias } from "../api/api";
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
  Chip,
  Button,
  Pagination,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import { useProductos } from "../hooks/useProductos";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";

export default function Home() {
  const { agregarProducto } = useCarrito();
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);

  const { productos, loading } = useProductos({ categoria, search, sort });

  // Paginación
  const productosPorPagina = 6;
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const productosPagina = productos.slice(
    (page - 1) * productosPorPagina,
    page * productosPorPagina
  );

  const handleAddToCart = (producto) => {
    agregarProducto(producto);
    toast.success(`${producto.nombre} agregado al carrito`);
  };

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(data))
      .catch(() => setCategorias([]));
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Catálogo de Productos
      </Typography>

      {/* Filtros */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={3}
        alignItems="center"
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            label="Categoría"
          >
            <MenuItem value="">Todas</MenuItem>
            {categorias.map((c) => (
              <MenuItem key={c.id} value={c.nombre}>
                {c.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          variant="outlined"
          placeholder="Buscar producto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Ordenar por precio</InputLabel>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            label="Ordenar por precio"
          >
            <MenuItem value="asc">Menor a mayor</MenuItem>
            <MenuItem value="desc">Mayor a menor</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Grid de productos */}
      {productosPagina.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {productosPagina.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductoCard
                  producto={producto}
                  onAgregar={handleAddToCart}
                  onVerDetalle={(id) => console.log("Ver detalle:", id)}
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPaginas}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
