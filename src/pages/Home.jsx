import { useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../hooks/useCategorias";
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
  Pagination,
} from "@mui/material";
import { Search } from "lucide-react";

export default function Home() {
  // Estados
  const [categoria, setCategoria] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);

  const itemsPerPage = 6;

  // Hooks
  const { categorias, loading: loadingCat } = useCategorias();
  const { productos, loading, error } = useProductos({ categoria, search, sort });

  // Paginación
  const startIndex = (page - 1) * itemsPerPage;
  const paginated = productos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🛍️ Nuestros Productos
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Filtros */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={3}>
        {/* Buscador */}
        <TextField
          label="Buscar producto"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          fullWidth
        />

        {/* Categorías */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoria || ""}
            onChange={(e) => {
              setCategoria(e.target.value || null);
              setPage(1);
            }}
            label="Categoría"
          >
            <MenuItem value="">Todas</MenuItem>
            {!loadingCat &&
              categorias.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.nombre}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Orden por precio */}
        <FormControl sx={{ minWidth: 150 }}>
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

      {/* Loading y error */}
      {loading && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" textAlign="center">
          Error al cargar productos.
        </Typography>
      )}

      {/* Lista de productos */}
      {!loading && !error && (
        <>
          <Grid container spacing={2}>
            {paginated.length > 0 ? (
              paginated.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod.id}>
                  <ProductoCard producto={prod} />
                </Grid>
              ))
            ) : (
              <Typography textAlign="center" width="100%" mt={3}>
                No se encontraron productos
              </Typography>
            )}
          </Grid>

          {/* Paginación */}
          {productos.length > itemsPerPage && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={Math.ceil(productos.length / itemsPerPage)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
      }
