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
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("asc");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoria, setCategoria] = useState("Todos");

  const { agregarAlCarrito } = useCarrito();

  // Categorías fijas en frontend
  const categorias = ["Todos", "Electrónica", "Ropa", "Hogar", "Juguetes", "Otros"];

  useEffect(() => {
    getProductos()
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];
        // Asignar categoría manualmente si no existe
        const listaConCategoria = lista.map((p, i) => ({
          ...p,
          categoria: p.categoria || categorias[i % categorias.length],
        }));
        setProductos(listaConCategoria);
      })
      .catch((err) => {
        console.error(err);
        setProductos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Debounce de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.toLowerCase());
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const filtered = productos
    .filter((p) =>
      debouncedSearch === ""
        ? true
        : p.nombre?.toLowerCase().includes(debouncedSearch)
    )
    .filter((p) => (categoria === "Todos" ? true : p.categoria === categoria))
    .sort((a, b) =>
      sort === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

  const handleAdd = async (prod) => {
    try {
      await agregarAlCarrito(prod.id, 1);
      toast.success(`${prod.nombre} agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading)
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Encabezado y filtros */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Productos
        </Typography>
        <Divider sx={{ width: 80, mx: "auto", mb: 3, borderBottomWidth: 3, borderColor: "primary.main" }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            placeholder="Buscar producto..."
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

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              {categorias.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <MenuItem value="asc">Precio: menor a mayor</MenuItem>
              <MenuItem value="desc">Precio: mayor a menor</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      {/* Grid de productos */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "text.secondary" }}>
          No se encontraron productos.
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filtered.map((prod) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id} sx={{ display: "flex", justifyContent: "center" }}>
              <ProductoCard producto={prod} onAgregar={handleAdd} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
