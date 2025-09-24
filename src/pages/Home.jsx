import { useState } from "react";
import {
  Box, Typography, Divider, Stack, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Grid, Pagination,
  IconButton, CircularProgress
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ProductoCard from "../components/ProductoCard";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
import { useCarritoHandler } from "../hooks/useCarritoHandler";

export default function Home() {
  const [categoria, setCategoria] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  const categorias = useCategorias();
  const { loading, filtered, paginated, page, setPage } = useProductos({
    categoria,
    search,
    sort,
    itemsPerPage: 8,
  });
  const { handleAdd, handleCarritoClick } = useCarritoHandler();

  if (loading)
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Encabezado */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
          <StorefrontIcon sx={{ fontSize: 32 }} /> Productos
        </Typography>
        <Divider sx={{ width: 80, mx: "auto", borderBottomWidth: 3, mb: 3 }} />

        {/* Filtros */}
<Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
  <TextField
    placeholder="Buscar producto..."
    size="small"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
  />
  <FormControl size="small" sx={{ minWidth: 150 }}>
    <InputLabel>Categoría</InputLabel>
    <Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
      <MenuItem value="">Todas</MenuItem>
      {categorias.map((cat) => (
        <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
      ))}
    </Select>
  </FormControl>
  <FormControl size="small" sx={{ minWidth: 150 }}>
    <InputLabel>Ordenar por</InputLabel>
    <Select value={sort} onChange={(e) => setSort(e.target.value)}>
      <MenuItem value="asc">Precio: menor a mayor</MenuItem>
      <MenuItem value="desc">Precio: mayor a menor</MenuItem>
    </Select>
  </FormControl>
</Stack>
      </Box>

      {/* Productos */}
      <Grid container spacing={3} justifyContent="center">
        {paginated.map((prod, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProductoCard producto={prod} onAgregar={handleAdd} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Paginación */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={Math.ceil(filtered.length / 8)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Botón Carrito */}
      <IconButton
        onClick={handleCarritoClick}
        sx={{ position: "fixed", bottom: 24, right: 24, bgcolor: "primary.main", color: "white" }}
      >
        <ShoppingCartIcon />
      </IconButton>
    </>
  );
}
